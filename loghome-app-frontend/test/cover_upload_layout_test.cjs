const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sfc = require('vue/compiler-sfc');

test('上传封面内容区扣除原生导航栏，不允许裁剪手势滚动整页', () => {
	const file = path.resolve(__dirname, '../pages/writers/cover_upload.vue');
	const source = fs.readFileSync(file, 'utf8');
	const parsed = sfc.parse({ source, filename: file });
	const descriptor = parsed.descriptor || parsed;
	assert.equal(sfc.compileTemplate({ source: descriptor.template.content, filename: file }).errors.length, 0);
	const style = sfc.compileStyle({ source: descriptor.styles[0].content, filename: file, id: 'data-v-cover-upload', scoped: true });
	assert.equal(style.errors.length, 0);
	assert.match(style.code, /height: calc\(100dvh - 44px - var\(--loghome-safe-top, 0px\)\)/);
	assert.match(style.code, /overflow: hidden/);
	assert.match(style.code, /touch-action: none/);
	assert.doesNotMatch(style.code, /min-height: 100vh/);
});
