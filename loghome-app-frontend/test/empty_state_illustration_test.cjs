const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { parse, compileTemplate } = require('vue/compiler-sfc');

const root = path.resolve(__dirname, '..');
const files = [
	'components/nothing.vue',
	'components/worldsPage.vue',
	'pages/worlds/worldPage.vue',
	'pages/readers/bookInfo.vue',
	'pages/community/circles.vue',
	'pages/community/circleMembers.vue',
	'pages/community/search.vue',
	'pages/community/circle.vue',
];

test('通用空状态都使用透明原木娘插画且模板可编译', () => {
	const image = fs.readFileSync(path.join(root, 'static/loggirl-404-empty-chest.png'));
	assert.equal(image.subarray(1, 4).toString(), 'PNG');
	assert.equal(image[25], 6, '插画应具有 RGBA 透明通道');
	for (const file of files) {
		const source = fs.readFileSync(path.join(root, file), 'utf8');
		assert.match(source, /loggirl-404-empty-chest\.png/, file);
		assert.doesNotMatch(source, /(?:static\/nothing|images\/icon_nothing)\.png/, file);
		const parsed = parse({ source, filename: file });
		const descriptor = parsed.descriptor || parsed;
		const compiled = compileTemplate({ source: descriptor.template.content, filename: file });
		assert.equal(compiled.errors.length, 0, file);
	}
});
