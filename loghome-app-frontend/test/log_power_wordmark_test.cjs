const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function loadOptions() {
	const source = fs.readFileSync(path.join(root, 'components/LogPowerWordmark.vue'), 'utf8');
	const script = source
		.slice(source.indexOf('<script>') + '<script>'.length, source.indexOf('</script>'))
		.replace('export default', 'module.exports =');
	const sandbox = { module: { exports: {} } };
	vm.runInNewContext(script, sandbox, { filename: 'components/LogPowerWordmark.vue' });
	return { options: sandbox.module.exports, source };
}

test('LogPower 字标按语言切换素材并保留中文版本', () => {
	const { options, source } = loadOptions();
	const english = { $i18n: { locale: 'en' } };
	const chinese = { $i18n: { locale: 'zh-CN' } };

	english.isEnglish = options.computed.isEnglish.call(english);
	chinese.isEnglish = options.computed.isEnglish.call(chinese);

	assert.equal(options.computed.wordmarkSrc.call(english), '/static/brand/log-power-wordmark-en.png');
	assert.equal(options.computed.wordmarkSrc.call(chinese), '/static/brand/log-power-wordmark.png');
	assert.ok(fs.existsSync(path.join(root, 'static/brand/log-power-wordmark-en.png')));
	assert.match(source, /:key="wordmarkSrc"/, '语言切换时应强制重新创建图片节点');
});
