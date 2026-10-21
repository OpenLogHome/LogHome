// i18n 词典单元测试：node --test test/i18n_messages_test.cjs
const test = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const messagesDir = path.join(root, 'i18n/messages')
const HAN = /[\u4e00-\u9fff]/
const VARS = /\{\{(\w+)\}\}|\{(\w+)\}/g

function readJson(file) {
	return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function flatten(obj, prefix = '', out = {}) {
	Object.keys(obj).forEach(key => {
		const value = obj[key]
		const full = prefix ? prefix + '.' + key : key
		if (value && typeof value === 'object' && !Array.isArray(value)) flatten(value, full, out)
		else out[full] = value
	})
	return out
}

function placeholders(value) {
	const names = []
	let match
	VARS.lastIndex = 0
	while ((match = VARS.exec(value))) names.push(match[1] || match[2])
	return names.sort().join(',')
}

const allowlist = readJson(path.join(root, 'scripts/i18n-allowlist.json')).zhInEn || {}
const locales = {}
const domainFiles = fs
	.readdirSync(messagesDir)
	.filter(name => /^(zh-CN|en)(\.[\w-]+)?\.json$/.test(name))

test('zh/en 每个域 key 双向一致', () => {
	const domains = {}
	domainFiles.forEach(name => {
		const match = name.match(/^(zh-CN|en)(?:\.([\w-]+))?\.json$/)
		const domain = match[2] || 'core'
		domains[domain] = domains[domain] || {}
		domains[domain][match[1]] = flatten(readJson(path.join(messagesDir, name)))
	})
	Object.keys(domains).forEach(domain => {
		locales[domain] = domains[domain]
		assert.ok(domains[domain]['zh-CN'], `${domain} 缺 zh-CN`)
		assert.ok(domains[domain].en, `${domain} 缺 en`)
		assert.deepStrictEqual(
			Object.keys(domains[domain].en).sort(),
			Object.keys(domains[domain]['zh-CN']).sort(),
			`${domain} key 不一致`
		)
	})
})

test('插值变量一致且花括号配对', () => {
	Object.values(locales).forEach(domain => {
		Object.keys(domain['zh-CN']).forEach(key => {
			const zh = domain['zh-CN'][key]
			const en = domain.en[key]
			assert.strictEqual(placeholders(zh), placeholders(en), `${key} 插值不一致`)
			assert.ok(!/[{}]/.test(zh.replace(VARS, '')), `${key} zh 花括号不配对`)
			assert.ok(!/[{}]/.test(en.replace(VARS, '')), `${key} en 花括号不配对`)
		})
	})
})

test('en 无中文残留（allowlist 除外）', () => {
	Object.values(locales).forEach(domain => {
		Object.keys(domain.en).forEach(key => {
			const value = domain.en[key]
			if (typeof value !== 'string' || !HAN.test(value)) return
			assert.ok(allowlist[key], `${key} 含中文: ${value}`)
		})
	})
})

test('title-map 每个路由标题 zh/en 均有词条', () => {
	const source = fs.readFileSync(path.join(root, 'i18n/title-map.js'), 'utf8')
	const keys = [...source.matchAll(/'titles\.[\w.]+'|"titles\.[\w.]+"/g)].map(m => m[0].slice(1, -1))
	assert.ok(keys.length > 100, `标题映射过少: ${keys.length}`)
	const zh = Object.assign({}, ...Object.values(locales).map(domain => domain['zh-CN']))
	const en = Object.assign({}, ...Object.values(locales).map(domain => domain.en))
	keys.forEach(key => {
		assert.ok(zh[key], `缺 zh 标题: ${key}`)
		assert.ok(en[key], `缺 en 标题: ${key}`)
	})
})

test('顶层域名不跨文件重复', () => {
	const seen = {}
	domainFiles.forEach(name => {
		const owner = name.replace(/^(zh-CN|en)\.?/, '').replace(/\.json$/, '') || 'core'
		Object.keys(readJson(path.join(messagesDir, name))).forEach(key => {
			if (seen[key]) assert.strictEqual(seen[key], owner, `域名 ${key} 在 ${seen[key]} 与 ${owner} 重复`)
			seen[key] = owner
		})
	})
})
