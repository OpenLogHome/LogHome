const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const parser = require('@babel/parser');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'pages/redstone/index.vue'), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
const ast = parser.parse(script, { sourceType: 'module' });
const component = ast.program.body.find(node => node.type === 'ExportDefaultDeclaration').declaration;
const navigations = [];
const definition = vm.runInNewContext('(' + script.slice(component.start, component.end) + ')', {
	uni: { navigateTo: options => navigations.push(options.url) }
});
const locales = Object.fromEntries(['zh-CN', 'en'].map(locale => [locale,
	JSON.parse(fs.readFileSync(path.join(root, 'i18n/messages/' + locale + '.redstone.json'), 'utf8'))
]));
const translate = (locale, key) => key.split('.').reduce((value, part) => value && value[part], locales[locale]);
const leafKeys = (value, prefix = '') => Object.entries(value).flatMap(([key, child]) => {
	const fullKey = prefix ? prefix + '.' + key : key;
	return typeof child === 'string' ? [fullKey] : leafKeys(child, fullKey);
});

test('声明默认收起，模型来源与不训练承诺始终展示', () => {
	assert.equal(definition.data().aiDeclarationExpanded, false);
	const card = source.slice(source.indexOf('<view class="panel ai-declaration">'), source.indexOf('<view v-if="transactions.length"'));
	const details = card.indexOf('v-if="aiDeclarationExpanded"');
	assert.ok(card.indexOf("$t('redstone.aiDeclaration.models')") < details);
	assert.ok(card.indexOf("$t('redstone.aiDeclaration.promise')") < details);
	assert.match(card, /:aria-expanded="String\(aiDeclarationExpanded\)"/);
	assert.match(card, /@click="aiDeclarationExpanded = !aiDeclarationExpanded"/);
});

test('中英文声明键一致，六项伦理原则均完整且没有翻译占位符', () => {
	assert.deepEqual(leafKeys(locales['zh-CN']).sort(), leafKeys(locales.en).sort());
	for (const locale of Object.keys(locales)) {
		for (const key of leafKeys(locales[locale])) assert.ok(translate(locale, key).trim(), locale + ': ' + key);
		const sections = definition.computed.aiDeclarationSections.call({ $t: key => translate(locale, key) });
		assert.deepEqual(Array.from(sections, item => item.id), ['data', 'providers', 'rights', 'reliability', 'safety', 'choice']);
		for (const section of sections) {
			assert.equal(typeof section.title, 'string');
			assert.equal(typeof section.body, 'string');
			assert.ok(section.body.length > 30);
		}
	}
	assert.match(translate('zh-CN', 'redstone.aiDeclaration.promise'), /任何形式的模型训练、微调、蒸馏/);
	assert.match(translate('zh-CN', 'redstone.aiDeclaration.sections.data.body'), /发送所需的内容与上下文/);
	const index = fs.readFileSync(path.join(root, 'i18n/index.js'), 'utf8');
	assert.match(index, /mergeMessages\(\[zhCore, zhAuth, zhSettings, zhRedstone/);
	assert.match(index, /mergeMessages\(\[enCore, enAuth, enSettings, enRedstone/);
});

test('可跳转 AI 使用设置，原有禁用和兑换逻辑不受影响', async () => {
	definition.methods.gotoAiSettings();
	assert.equal(navigations.at(-1), '/pages/users/clientSet');
	assert.match(source, /<view v-if="aiAssistanceEnabled" class="redstone-page">/);
	let loaded = false;
	definition.onShow.call({ ensureAiPageAllowed: () => false, loadData: () => { loaded = true; } });
	assert.equal(loaded, false);
	await definition.methods.loadData.call({ aiAssistanceEnabled: false });
	assert.equal(definition.computed.validAmount.call({ amount: '50' }), true);
	assert.equal(definition.computed.logCost.call({ amount: '50', validAmount: true }), 500);
	assert.equal(definition.computed.validAmount.call({ amount: '1.5' }), false);
});
