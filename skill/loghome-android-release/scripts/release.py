#!/usr/bin/env python3
"""HBuilderX Web -> packaged assets -> signed Android release (Python 3.9+)."""
import argparse
import contextlib
import datetime as dt
import hashlib
import ipaddress
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import urllib.parse
import urllib.request
import uuid
import zipfile

PRODUCTION = 'https://api.loghome.ink'
PACKAGE = 'top.codesocean.loghome'


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def digest(stream):
    result = hashlib.sha256()
    for chunk in iter(lambda: stream.read(1024 * 1024), b''):
        result.update(chunk)
    return result.hexdigest()


def sha256(path):
    with Path(path).open('rb') as stream:
        return digest(stream)


def backend_url(value):
    value = value.rstrip('/')
    parsed = urllib.parse.urlsplit(value)
    require(parsed.scheme == 'https' and parsed.hostname and not parsed.username
            and not parsed.password and not parsed.query and not parsed.fragment
            and re.fullmatch(r'https://[A-Za-z0-9.\-:\[\]]+(?:/[A-Za-z0-9/_.~-]*)?', value),
            '后端必须是无凭证、查询参数和片段的 HTTPS URL')
    require(parsed.port is None or 0 < parsed.port < 65536, '后端端口无效')
    host = parsed.hostname.lower()
    require(host != 'localhost' and not host.endswith(('.localhost', '.local')), '正式包不能使用本地后端')
    try:
        address = ipaddress.ip_address(host)
    except ValueError:
        pass
    else:
        require(address.is_global, '正式包不能使用模拟器、回环或私网 IP')
    return value


def read_version(text):
    codes = re.findall(r'^\s*versionCode\s+(\d+)\s*$', text, re.M)
    names = re.findall(r'^\s*versionName\s+"([^"]+)"\s*$', text, re.M)
    require(len(codes) == len(names) == 1, '无法唯一识别 Android 版本')
    return names[0], int(codes[0])


def change_version(text, name, code):
    require(bool(re.fullmatch(r'\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?', name)), 'versionName 须形如 3.2.3')
    require(0 < code <= 2100000000, 'versionCode 超出 Android 范围')
    old_name, old_code = read_version(text)
    require(code >= old_code, '不能降低 versionCode')
    require(code != old_code or name == old_name, '相同 versionCode 只能重打同名版本')
    text = re.sub(r'(?m)^(\s*versionCode\s+)\d+(\s*)$', lambda m: m[1] + str(code) + m[2], text)
    return re.sub(r'(?m)^(\s*versionName\s+)"[^"]+"', lambda m: m[1] + json.dumps(name), text)


def run(command, cwd, env, log, timeout=1200):
    with Path(log).open('w', encoding='utf-8') as stream:
        result = subprocess.run([str(arg) for arg in command], cwd=cwd, env=env,
                                stdout=stream, stderr=subprocess.STDOUT, timeout=timeout)
    require(result.returncode == 0, f'命令失败（{result.returncode}），日志：{log}')


def find_tools(root, args):
    candidates = [args.hbuilder_cli, os.environ.get('HBUILDERX_CLI'),
                  '/Applications/HBuilderX.app/Contents/MacOS/cli',
                  r'C:\Program Files\HBuilderX\cli.exe', r'C:\HBuilderX\cli.exe']
    cli = next((Path(p).expanduser() for p in candidates if p and Path(p).expanduser().is_file()), None)
    require(cli, '找不到 HBuilderX CLI，请传 --hbuilder-cli')
    candidates = [args.java_home, os.environ.get('JAVA_HOME'),
                  '/Applications/Android Studio.app/Contents/jbr/Contents/Home',
                  str(Path(os.environ.get('PROGRAMFILES', r'C:\Program Files')) / 'Android/Android Studio/jbr')]
    java = next((Path(p).expanduser() for p in candidates if p and
                 (Path(p).expanduser() / 'bin' / ('java.exe' if os.name == 'nt' else 'java')).is_file()), None)
    require(java, '找不到 JDK，请传 --java-home（推荐 Android Studio JBR）')
    node = shutil.which('node')
    require(node, '需要 Node.js 验证实际编译后的后端地址')
    local = root / 'loghome-android/local.properties'
    match = re.search(r'^sdk\.dir\s*=\s*(.+)$', local.read_text(encoding='utf-8') if local.exists() else '', re.M)
    sdk = Path(match[1].strip().replace('\\:', ':').replace('\\\\', '\\')) if match else Path(
        os.environ.get('ANDROID_HOME') or os.environ.get('ANDROID_SDK_ROOT') or '')
    require((sdk / 'build-tools').is_dir(), '找不到 SDK build-tools，请检查 local.properties')
    versions = sorted((p for p in (sdk / 'build-tools').iterdir() if p.is_dir()),
                      key=lambda p: tuple(int(n) for n in re.findall(r'\d+', p.name)), reverse=True)
    tools = None
    for version in versions:
        aapt = version / ('aapt.exe' if os.name == 'nt' else 'aapt')
        signer = version / ('apksigner.bat' if os.name == 'nt' else 'apksigner')
        if aapt.is_file() and signer.is_file():
            tools = {'aapt': aapt, 'signer': signer}
            break
    require(tools, 'Android build-tools 缺少 aapt/apksigner')
    require((root / 'loghome-android/key.properties').is_file(), '缺少 key.properties，无法生成已有签名的正式 APK')
    require((root / 'loghome-android' / ('gradlew.bat' if os.name == 'nt' else 'gradlew')).is_file(), '缺少 Gradle wrapper')
    return {**tools, 'cli': cli.resolve(), 'java': java.resolve(), 'node': node, 'sdk': sdk.resolve()}


def check_backend(url):
    request = urllib.request.Request(url + '/miniapps', headers={'Accept': 'application/json'})
    with urllib.request.urlopen(request, timeout=20) as response:
        require(response.status == 200 and response.url.startswith(url + '/'), '后端状态或重定向地址异常')
        require('application/json' in response.headers.get('Content-Type', ''), '后端没有返回 JSON')
        payload = json.loads(response.read(2 * 1024 * 1024))
        require(isinstance(payload, dict) and isinstance(payload.get('data'), list), '/miniapps 响应结构不正确')


@contextlib.contextmanager
def production_env(path, url):
    original = path.read_bytes() if path.exists() else None
    text = original.decode('utf-8-sig') if original is not None else ''
    text = re.sub(r'(?m)^\s*(?:export\s+)?VUE_APP_API_BASE_URL\s*=.*(?:\n|$)', '', text)
    try:
        path.write_text(text.rstrip('\n') + '\nVUE_APP_API_BASE_URL=' + url + '\n', encoding='utf-8')
        yield
    finally:
        if original is None:
            path.unlink(missing_ok=True)
        else:
            path.write_bytes(original)


def assignment_expression(source):
    match = re.search(r'\.prototype\.\$baseUrl\s*=\s*', source)
    require(match, '编译产物中找不到 $baseUrl，停止发布以免连接错误后端')
    start = match.end()
    stack, quote, escaped = [], None, False
    for index in range(start, len(source)):
        char = source[index]
        if quote:
            if escaped:
                escaped = False
            elif char == '\\':
                escaped = True
            elif char == quote:
                quote = None
        elif char in "\"'`":
            quote = char
        elif char in '([{':
            stack.append(char)
        elif char in ')]}':
            if not stack:
                break
            stack.pop()
        elif char in ',;' and not stack:
            return source[start:index]
    raise RuntimeError('无法解析编译后的后端表达式')


def verify_frontend(build, url, node):
    require((build / 'index.html').is_file(), 'HBuilderX 本次发行未生成 index.html')
    html = (build / 'index.html').read_text(encoding='utf-8')
    refs = set(re.findall(r'(?:\./|/)?static/[^\s\"\'<>]+?\.(?:js|css)', html))
    require(refs and all((build / ref.lstrip('./')).is_file() for ref in refs), 'index.html 引用的脚本或样式缺失')
    entries = list((build / 'static/js').glob('index.*.js'))
    require(len(entries) == 1, '无法唯一识别本次前端入口 JS')
    expression = assignment_expression(entries[0].read_text(encoding='utf-8'))
    native = re.match(r'([\w$]+)\s*\|\|', expression)
    require(native, '前端没有优先使用原生 backendEndpoint，请检查 main.js')
    script = """const vm=require('node:vm');const d=JSON.parse(process.argv[1]);
for(const native of [null,'https://native.example.invalid']){
 const actual=vm.runInNewContext(d.expression,{[d.variable]:native,process:{env:{}}},{timeout:1000});
 if(actual!==(native||d.url))throw Error('Compiled backend selection mismatch');
}"""
    result = subprocess.run([str(node), '-e', script, json.dumps({'expression': expression, 'variable': native[1], 'url': url})],
                            capture_output=True, text=True, timeout=10)
    require(result.returncode == 0, '前端编译后的实际后端地址不符，停止发布')


def web_files(build):
    files = []
    for path in sorted(build.rglob('*')):
        relative = path.relative_to(build)
        if any(part.startswith('.') or part == '__MACOSX' for part in relative.parts):
            continue
        require(not path.is_symlink(), f'前端产物中不允许符号链接：{relative}')
        if path.is_file() and path.suffix.lower() not in {'.zip', '.apk', '.aab', '.map', '.log'}:
            files.append((path, relative.as_posix()))
    require(any(name == 'index.html' for _, name in files), 'ZIP 根目录缺少 index.html')
    return files


def pack_web(build, target):
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_suffix('.zip.tmp')
    try:
        with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
            for path, name in web_files(build):
                info = zipfile.ZipInfo(name, (2020, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                archive.writestr(info, path.read_bytes())
        with zipfile.ZipFile(temporary) as archive:
            require(archive.testzip() is None, 'ZIP CRC 校验失败')
            require(set(archive.namelist()) == {name for _, name in web_files(build)}, 'ZIP 清单不一致')
            for path, name in web_files(build):
                require(hashlib.sha256(archive.read(name)).hexdigest() == sha256(path), f'ZIP 内容不一致：{name}')
        os.replace(temporary, target)
    finally:
        temporary.unlink(missing_ok=True)


def verify_build_config(android, url, name, code):
    candidates = list((android / 'app/build/generated/source/buildConfig/release').rglob('BuildConfig.java'))
    require(len(candidates) == 1, '缺少或存在多个 release BuildConfig')
    text = candidates[0].read_text(encoding='utf-8')
    for field, expected in [('BACKEND_ENDPOINT', url), ('WEBVIEW_ENTRY_URL', ''), ('VERSION_NAME', name)]:
        match = re.search(r'\b' + field + r'\s*=\s*("(?:[^"\\]|\\.)*")\s*;', text)
        require(match and json.loads(match[1]) == expected, f'BuildConfig {field} 校验失败')
    require(bool(re.search(r'\bVERSION_CODE\s*=\s*' + str(code) + r'\s*;', text)), 'BuildConfig VERSION_CODE 不正确')
    require(bool(re.search(r'\bDEBUG\s*=\s*false\s*;', text)), 'BuildConfig 不是正式包')


def verify_apk(apk, web_zip, tools, env, output, name, code):
    run([tools['signer'], 'verify', '--verbose', apk], apk.parent, env, output / 'signature.log', 120)
    run([tools['aapt'], 'dump', 'badging', apk], apk.parent, env, output / 'apk-metadata.log', 120)
    text = (output / 'apk-metadata.log').read_text(encoding='utf-8', errors='replace')
    match = re.search(r"^package: name='([^']+)' versionCode='([^']+)' versionName='([^']+)'", text, re.M)
    require(match and match.groups() == (PACKAGE, str(code), name), 'APK 包名或实际版本不符')
    with zipfile.ZipFile(apk) as archive, archive.open('assets/web/web.zip') as stream:
        require(digest(stream) == sha256(web_zip), 'APK 内置 web.zip 不是本次资源包')


def release(root, args):
    url = backend_url(args.backend_url)
    frontend, android = root / 'loghome-app-frontend', root / 'loghome-android'
    gradle = android / 'app/build.gradle'
    original_gradle = gradle.read_bytes()
    current_name, current_code = read_version(original_gradle.decode('utf-8'))
    require(args.check or (args.version_name and args.version_code), '须提供 --version-name 和 --version-code')
    name, code = (current_name, current_code) if args.check else (args.version_name, args.version_code)
    updated = change_version(original_gradle.decode('utf-8'), name, code)
    tools = find_tools(root, args)
    print(f'预检：{name} ({code})，后端 {url}', flush=True)
    check_backend(url)
    if args.check:
        print('预检通过：工具、签名配置文件和后端响应可用。未修改或构建项目。')
        return None
    base = root / '_tmp/releases'
    base.mkdir(parents=True, exist_ok=True)
    lock = base / '.release.lock'
    try:
        descriptor = os.open(lock, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    except FileExistsError:
        raise RuntimeError(f'存在发布锁，请确认无其他构建运行：{lock}') from None
    os.write(descriptor, str(os.getpid()).encode())
    os.close(descriptor)
    output = base / (f'{name}-{code}-' + dt.datetime.now().strftime('%Y%m%d-%H%M%S') + '-' + uuid.uuid4().hex[:6])
    build = frontend / 'unpackage/dist/build/web'
    web_zip = android / 'app/src/main/assets/web/web.zip'
    apk_output = android / 'app/build/outputs/apk/release'
    env = dict(os.environ, JAVA_HOME=str(tools['java']))
    env['PATH'] = str(tools['java'] / 'bin') + os.pathsep + env.get('PATH', '')
    env.pop('VUE_APP_API_BASE_URL', None)
    env.pop('NODE_ENV', None)
    moved, zip_replaced = [], False
    try:
        output.mkdir(parents=True)
        for original, label in [(build, 'previous-web'), (apk_output, 'previous-apk-output')]:
            backup = output / label if original.exists() else None
            if backup:
                shutil.move(str(original), str(backup))
            moved.append((original, backup, label))
        if web_zip.exists():
            shutil.copy2(web_zip, output / 'previous-web.zip')
        print('1/5 HBuilderX 发行 Web 前端', flush=True)
        with production_env(frontend / '.env.production.local', url):
            run([tools['cli'], 'publish', 'web', '--project', frontend.resolve(),
                 '--webHosting', 'false', '--sourceMap', 'false'], root, env, output / 'hbuilder.log')
        log = (output / 'hbuilder.log').read_text(encoding='utf-8', errors='replace')
        require(not re.search(r'ERROR in|编译失败|发行失败|^Error:', log, re.M), f'HBuilderX 发行失败，日志：{output / "hbuilder.log"}')
        verify_frontend(build, url, tools['node'])
        print('2/5 生成并校验 Android 内置 web.zip', flush=True)
        pack_web(build, web_zip)
        zip_replaced = True
        print('3/5 更新 Android 版本号', flush=True)
        gradle.write_bytes(updated.encode('utf-8'))
        print('4/5 构建签名 release APK，显式覆盖调试后端', flush=True)
        wrapper = android / ('gradlew.bat' if os.name == 'nt' else 'gradlew')
        run([wrapper, ':app:assembleRelease', '--console=plain', f'-Pbackend_endpoint={url}',
             '-PloghomeWebviewEntryUrl='], android, env, output / 'gradle.log', 1800)
        print('5/5 核对实际地址、版本、签名和 APK 内置 Web 包', flush=True)
        verify_build_config(android, url, name, code)
        metadata = json.loads((apk_output / 'output-metadata.json').read_text(encoding='utf-8'))
        elements = metadata.get('elements', [])
        require(len(elements) == 1, '预计生成一个 APK，实际数量不同')
        apk = apk_output / elements[0]['outputFile']
        require(apk.is_file() and apk.resolve().parent == apk_output.resolve(), 'APK 输出路径异常')
        verify_apk(apk, web_zip, tools, env, output, name, code)
        destination = output / f'LogHome-Beta-{name}-{code}.apk'
        shutil.copy2(apk, destination)
        manifest = {'status': 'verified', 'versionName': name, 'versionCode': code,
                    'backendEndpoint': url, 'packageName': PACKAGE, 'apk': str(destination.resolve()),
                    'apkSha256': sha256(destination), 'webZipSha256': sha256(web_zip),
                    'webFileCount': len(web_files(build)), 'signatureVerified': True,
                    'apkEmbeddedWebVerified': True, 'createdAt': dt.datetime.now(dt.timezone.utc).isoformat()}
        (output / 'release-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(json.dumps(manifest, ensure_ascii=False, indent=2), flush=True)
        return output
    except BaseException:
        gradle.write_bytes(original_gradle)
        if zip_replaced:
            if (output / 'previous-web.zip').exists():
                shutil.copy2(output / 'previous-web.zip', web_zip)
            else:
                web_zip.unlink(missing_ok=True)
        for original, backup, label in reversed(moved):
            if original.exists():
                shutil.move(str(original), str(output / label.replace('previous-', 'failed-')))
            if backup:
                shutil.move(str(backup), str(original))
        print(f'发布失败，原版本和产物已恢复；日志：{output}', file=sys.stderr, flush=True)
        raise
    finally:
        lock.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='只读检查工具、版本和后端')
    parser.add_argument('--version-name')
    parser.add_argument('--version-code', type=int)
    parser.add_argument('--backend-url', default=PRODUCTION)
    parser.add_argument('--hbuilder-cli')
    parser.add_argument('--java-home')
    args = parser.parse_args()
    try:
        release(Path(__file__).resolve().parents[3], args)
    except (Exception, KeyboardInterrupt) as error:
        print(f'ERROR: {error}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
