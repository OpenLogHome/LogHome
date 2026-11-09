#!/usr/bin/env python3
"""Isolated release fixtures; no device installation, credentials or live writes."""
import argparse
import io
import json
from pathlib import Path
import shutil
import sys
import tempfile
import unittest
from unittest.mock import patch
import zipfile

sys.dont_write_bytecode = True
import release as release_tool


class ReleaseTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.front = self.root / 'loghome-app-frontend'
        self.android = self.root / 'loghome-android'
        self.build = self.front / 'unpackage/dist/build/web'
        self.gradle = self.android / 'app/build.gradle'
        self.zip = self.android / 'app/src/main/assets/web/web.zip'
        self.apk_dir = self.android / 'app/build/outputs/apk/release'
        self.args = argparse.Namespace(check=False, version_name='3.2.3', version_code=323,
                                       backend_url=release_tool.PRODUCTION, hbuilder_cli=None, java_home=None)
        self.write(self.gradle, 'android {\n versionCode 322\n versionName "3.2.2"\n}\n')
        self.write(self.android / 'gradle.properties', 'backend_endpoint=http://10.0.2.2:9000\n')
        self.write(self.build / 'index.html', 'original frontend')
        self.write(self.zip, b'original zip')
        self.write(self.apk_dir / 'app-release.apk', b'original apk')
        self.env_path = self.front / '.env.production.local'
        self.write(self.env_path, b'\xef\xbb\xbfKEEP=unchanged\r\nVUE_APP_API_BASE_URL=http://localhost:9000\r\n')
        self.node = shutil.which('node')
        self.assertIsNotNone(self.node, 'Node.js is required for compiled-expression behavior tests')
        self.tools = {'cli': Path('fixture-hbuilder'), 'java': self.root / 'jdk', 'node': self.node,
                      'aapt': Path('fixture-aapt'), 'signer': Path('fixture-signer')}

    @staticmethod
    def write(path, content):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content if isinstance(content, bytes) else content.encode())

    def compiled_frontend(self, url):
        self.write(self.build / 'index.html', '<script src="./static/js/index.new.js"></script>')
        self.write(self.build / 'static/js/index.new.js',
                   'Vue.prototype.$baseUrl=n||Object({VUE_APP_API_BASE_URL:' + json.dumps(url) +
                   '}).VUE_APP_API_BASE_URL||"https://fallback.invalid",Vue.prototype.other=1;')

    def fake_command(self, command, cwd, env, log, timeout=1200):
        self.write(log, 'fixture command completed\n')
        if command[0] == self.tools['cli']:
            self.assertFalse(self.build.exists(), 'Old frontend must not be reusable as a fresh build')
            self.assertNotIn('VUE_APP_API_BASE_URL', env)
            self.assertIn('VUE_APP_API_BASE_URL=' + self.args.backend_url, self.env_path.read_text())
            self.compiled_frontend(self.args.backend_url)
        elif Path(command[0]).name.startswith('gradlew'):
            self.assertIn('-Pbackend_endpoint=' + self.args.backend_url, command)
            self.assertIn('-PloghomeWebviewEntryUrl=', command)
            name, code = release_tool.read_version(self.gradle.read_text())
            config = '\n'.join(['boolean DEBUG = false;', f'int VERSION_CODE = {code};',
                                f'String VERSION_NAME = "{name}";', 'String WEBVIEW_ENTRY_URL = "";',
                                f'String BACKEND_ENDPOINT = "{self.args.backend_url}";'])
            self.write(self.android / 'app/build/generated/source/buildConfig/release/test/BuildConfig.java', config)
            self.apk_dir.mkdir(parents=True)
            with zipfile.ZipFile(self.apk_dir / 'app-release.apk', 'w') as apk:
                apk.write(self.zip, 'assets/web/web.zip')
            self.write(self.apk_dir / 'output-metadata.json', json.dumps({'elements': [{'outputFile': 'app-release.apk'}]}))
        elif command[0] == self.tools['aapt']:
            self.write(log, f"package: name='{release_tool.PACKAGE}' versionCode='323' versionName='3.2.3'\n")

    def pipeline(self, runner=None):
        with patch.object(release_tool, 'find_tools', return_value=self.tools), \
             patch.object(release_tool, 'check_backend'), \
             patch.object(release_tool, 'run', side_effect=runner or self.fake_command), \
             patch('sys.stdout', new_callable=io.StringIO), patch('sys.stderr', new_callable=io.StringIO):
            return release_tool.release(self.root, self.args)

    def test_complete_pipeline_overrides_debug_backend_and_restores_env(self):
        original_env = self.env_path.read_bytes()
        output = self.pipeline()
        report = json.loads((output / 'release-manifest.json').read_text())
        self.assertEqual(report['versionCode'], 323)
        self.assertEqual(report['backendEndpoint'], release_tool.PRODUCTION)
        self.assertEqual(report['apkSha256'], release_tool.sha256(report['apk']))
        self.assertEqual(self.env_path.read_bytes(), original_env)
        self.assertIn('http://10.0.2.2:9000', (self.android / 'gradle.properties').read_text())
        self.assertTrue((output / 'previous-web.zip').exists())
        self.assertFalse((self.root / '_tmp/releases/.release.lock').exists())

    def test_signing_failure_restores_all_previous_outputs_and_version(self):
        original_gradle, original_env = self.gradle.read_bytes(), self.env_path.read_bytes()
        def fail_signing(command, *args, **kwargs):
            if command[0] == self.tools['signer']:
                raise RuntimeError('signature rejected')
            self.fake_command(command, *args, **kwargs)
        with self.assertRaisesRegex(RuntimeError, 'signature rejected'):
            self.pipeline(fail_signing)
        self.assertEqual(self.gradle.read_bytes(), original_gradle)
        self.assertEqual(self.env_path.read_bytes(), original_env)
        self.assertEqual(self.zip.read_bytes(), b'original zip')
        self.assertEqual((self.build / 'index.html').read_text(), 'original frontend')
        self.assertEqual((self.apk_dir / 'app-release.apk').read_bytes(), b'original apk')
        self.assertFalse(list((self.root / '_tmp/releases').glob('*/release-manifest.json')))

    def test_false_success_hbuilder_cannot_reuse_stale_frontend(self):
        def no_output(command, cwd, env, log, timeout=1200):
            self.write(log, 'CLI returned without building')
        with self.assertRaisesRegex(RuntimeError, '未生成 index.html'):
            self.pipeline(no_output)
        self.assertEqual((self.build / 'index.html').read_text(), 'original frontend')
        self.assertEqual(self.zip.read_bytes(), b'original zip')

    def test_unsafe_backend_rejected(self):
        for url in ['http://api.loghome.ink', 'http://10.0.2.2:9000', 'https://127.0.0.1',
                    'https://10.0.2.2', 'https://192.168.1.4', 'https://[::1]',
                    'https://localhost', 'https://x.local', 'https://a:b@api.loghome.ink',
                    'https://api.loghome.ink?token=x']:
            with self.subTest(url=url), self.assertRaises((RuntimeError, ValueError)):
                release_tool.backend_url(url)
        self.assertEqual(release_tool.backend_url(release_tool.PRODUCTION + '/'), release_tool.PRODUCTION)

    def test_version_downgrade_rejected_and_rebuild_allowed(self):
        old = self.gradle.read_text()
        self.assertEqual(release_tool.change_version(old, '3.2.2', 322), old)
        for name, code in [('3.2.1', 321), ('3.2.3', 322), ('3.2.3', 2100000001)]:
            with self.assertRaises(RuntimeError):
                release_tool.change_version(old, name, code)

    def test_actual_compiled_selection_checks_both_native_and_web_fallback(self):
        self.compiled_frontend(release_tool.PRODUCTION)
        release_tool.verify_frontend(self.build, release_tool.PRODUCTION, self.node)
        self.compiled_frontend('http://10.0.2.2:9000')
        with self.assertRaisesRegex(RuntimeError, '实际后端地址不符'):
            release_tool.verify_frontend(self.build, release_tool.PRODUCTION, self.node)

    def test_zip_layout_and_junk_filter_and_reproducibility(self):
        self.compiled_frontend(release_tool.PRODUCTION)
        for name in ['.DS_Store', '__MACOSX/._index.html', '归档.zip', 'static/a.js.map']:
            self.write(self.build / name, 'unwanted')
        self.write(self.build / 'static/中文.png', b'pixel')
        release_tool.pack_web(self.build, self.zip)
        first = self.zip.read_bytes()
        with zipfile.ZipFile(self.zip) as archive:
            self.assertEqual(set(archive.namelist()), {'index.html', 'static/js/index.new.js', 'static/中文.png'})
        release_tool.pack_web(self.build, self.zip)
        self.assertEqual(self.zip.read_bytes(), first)

    def test_temporary_env_removed_when_not_preexisting_even_on_failure(self):
        self.env_path.unlink()
        with self.assertRaisesRegex(RuntimeError, 'fixture failure'):
            with release_tool.production_env(self.env_path, release_tool.PRODUCTION):
                self.assertTrue(self.env_path.exists())
                raise RuntimeError('fixture failure')
        self.assertFalse(self.env_path.exists())

    def test_existing_lock_prevents_other_release(self):
        self.write(self.root / '_tmp/releases/.release.lock', 'other process')
        with self.assertRaisesRegex(RuntimeError, '存在发布锁'):
            self.pipeline()
        self.assertEqual((self.root / '_tmp/releases/.release.lock').read_text(), 'other process')


if __name__ == '__main__':
    unittest.main(verbosity=2)
