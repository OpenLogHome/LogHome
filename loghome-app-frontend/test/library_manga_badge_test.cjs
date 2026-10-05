const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sfc = require('vue/compiler-sfc');

function readComponent(file) {
	const source = fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
	const parsed = sfc.parse({ source, filename: file });
	const descriptor = parsed.descriptor || parsed;
	assert.equal(sfc.compileTemplate({ source: descriptor.template.content, filename: file }).errors.length, 0);
	return source;
}

test('首页各类书卡仅为漫画作品显示封面标签', () => {
	const library = readComponent('pages/library.vue');
	const bookInCase = readComponent('components/book_in_case.vue');
	assert.match(library, /:manga="novel\.novel_type === 'manga'"/);
	assert.equal((library.match(/v-if="novel\.novel_type === 'manga'" class="manga-cover-badge"/g) || []).length, 3);
	assert.match(library, /v-if="item\.novel_type === 'manga'" class="manga-cover-badge"/);
	assert.match(bookInCase, /<text v-if="manga" class="manga-badge">漫画<\/text>/);
	assert.match(bookInCase, /manga:\s*\{\s*type: Boolean,\s*default: false/);
});
