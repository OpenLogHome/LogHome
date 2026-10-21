// i18n 词典审计（2A 配套）：node scripts/i18n-audit.js
// 校验：zh/en key 双向一致、en 中文残留（允许 allowlist）、插值变量一致、
//       花括号配对、域顶层 key 不跨文件重复、en 标题缺口、未被引用的 key（WARN）
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const messagesDir = path.join(root, 'i18n/messages')
const HAN = /[\u4e00-\u9fff]/
const SRC_DIRS = ['pages', 'components', 'common', 'mixins']
const SRC_EXTRA = ['App.vue', 'main.js']

function readJson(file) {
	return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function walk(dir, out = []) {
	if (!fs.existsSync(dir)) return out
	fs.readdirSync(dir).forEach(name => {
		const full = path.join(dir, name)
		const stat = fs.statSync(full)
		if (stat.isDirectory()) {
			if (name === 'node_modules' || name === 'unpackage' || name.startsWith('.')) return
			walk(full, out)
		} else if (/\.(vue|js)$/.test(name)) {
			out.push(full)
		}
	})
	return out
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

// 两种写法都算合法：{{var}}（仓库约定）与 {var}（vue-i18n v8 原生，历史词条）
const VARS = /\{\{(\w+)\}\}|\{(\w+)\}/g
function placeholders(value) {
	const names = []
	let match
	VARS.lastIndex = 0
	while ((match = VARS.exec(value))) names.push(match[1] || match[2])
	return names.sort().join(',')
}

// 去掉合法占位符后仍有花括号 = 未配对/裸花括号
function hasBareBrace(value) {
	return /[{}]/.test(value.replace(VARS, ''))
}

const groups = {}
fs.readdirSync(messagesDir)
	.filter(name => /^(zh-CN|en)(\.[\w-]+)?\.json$/.test(name))
	.forEach(name => {
		const match = name.match(/^(zh-CN|en)(?:\.([\w-]+))?\.json$/)
		const domain = match[2] || 'core'
		groups[domain] = groups[domain] || {}
		groups[domain][match[1]] = name
	})

const allowlist = readJson(path.join(__dirname, 'i18n-allowlist.json'))
const allowedZhInEn = allowlist.zhInEn || {}

const failures = []
const warnings = []

const zhFlat = {}
const enFlat = {}
const domainOwner = {}

Object.keys(groups).forEach(domain => {
	const pair = groups[domain]
	if (!pair['zh-CN'] || !pair.en) {
		failures.push(`域 ${domain} 缺少 ${pair['zh-CN'] ? 'en' : 'zh-CN'} 文件`)
		return
	}
	const zh = flatten(readJson(path.join(messagesDir, pair['zh-CN'])))
	const en = flatten(readJson(path.join(messagesDir, pair.en)))
	Object.keys(zh).forEach(key => {
		zhFlat[key] = zh[key]
		domainOwner[key] = domain
	})
	Object.keys(en).forEach(key => {
		enFlat[key] = en[key]
		if (!domainOwner[key]) domainOwner[key] = domain
	})
})

const allKeys = Object.keys(zhFlat)
allKeys.forEach(key => {
	if (!(key in enFlat)) failures.push(`缺少 en: ${key}`)
})
Object.keys(enFlat).forEach(key => {
	if (!(key in zhFlat)) failures.push(`多余 en: ${key}`)
})

Object.keys(zhFlat).forEach(key => {
	const zh = zhFlat[key]
	const en = enFlat[key]
	if (typeof zh !== 'string') return
	if (hasBareBrace(zh)) failures.push(`zh 花括号不配对: ${key} => ${JSON.stringify(zh)}`)
	if (typeof en !== 'string') return
	if (hasBareBrace(en)) failures.push(`en 花括号不配对: ${key} => ${JSON.stringify(en)}`)
	const zhVars = placeholders(zh)
	const enVars = placeholders(en)
	if (zhVars !== enVars) failures.push(`插值不一致: ${key} (zh: ${zhVars || '-'} / en: ${enVars || '-'})`)
	if (HAN.test(en) && !(key in allowedZhInEn)) failures.push(`en 含中文: ${key} => ${JSON.stringify(en)}`)
})

// 顶层域名跨文件重复（合并会静默覆盖）
const seenDomain = {}
fs.readdirSync(messagesDir)
	.filter(name => /^(zh-CN|en)(\.[\w-]+)?\.json$/.test(name))
	.forEach(name => {
		const topKeys = Object.keys(readJson(path.join(messagesDir, name)))
		topKeys.forEach(key => {
			const owner = name.replace(/^(zh-CN|en)\.?/, '') || 'core'
			if (seenDomain[key] && seenDomain[key] !== owner) {
				failures.push(`域名 ${key} 在 ${seenDomain[key]} 与 ${owner} 重复定义`)
			}
			seenDomain[key] = owner
		})
	})

// 标题：title-map 里的每个 key 必须 zh/en 都有
const titleMapFile = path.join(root, 'i18n/title-map.js')
const titleKeys = [...fs.readFileSync(titleMapFile, 'utf8').matchAll(/'titles\.[\w.]+'|"titles\.[\w.]+"/g)].map(m =>
	m[0].slice(1, -1),
)
const missingTitles = titleKeys.filter(key => !(key in zhFlat) || !(key in enFlat))
if (missingTitles.length) failures.push(`标题缺口 ${missingTitles.length} 条: ${missingTitles.slice(0, 8).join(', ')}`)

// 未引用 key：扫描源码里的字面量 key 与动态前缀
function stripComments(code) {
	return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1')
}
let sourceText = ''
SRC_DIRS.forEach(dir => walk(path.join(root, dir)).forEach(file => {
	sourceText += stripComments(fs.readFileSync(file, 'utf8')) + '\n'
}))
SRC_EXTRA.forEach(file => {
	const full = path.join(root, file)
	if (fs.existsSync(full)) sourceText += stripComments(fs.readFileSync(full, 'utf8')) + '\n'
})
// 只收集键形状的字符串（域.路径），避免被相邻引号截断
const quoted = new Set()
;[...sourceText.matchAll(/['"`]([a-z][\w]*(?:\.[\w]+)+)['"`]/g)].forEach(m => quoted.add(m[1]))
const dynamicPrefixes = new Set()
;[...sourceText.matchAll(/['"`]([\w.]+\.)['"`]\s*\+|`([\w.]+\.)\$\{/g)].forEach(m => {
	dynamicPrefixes.add(m[1] || m[2])
})
titleKeys.forEach(key => quoted.add(key))
const unused = allKeys.filter(key => {
	if (quoted.has(key)) return false
	for (const prefix of dynamicPrefixes) {
		if (key.startsWith(prefix)) return false
	}
	return true
})
if (unused.length) {
	warnings.push(`未被引用 ${unused.length} 条（动态拼接可能误报）：${unused.slice(0, 12).join(', ')}`)
}

console.log('=== i18n 词典审计 ===')
console.log(`域: ${Object.keys(groups).sort().join(', ')}`)
console.log(`词条: zh ${allKeys.length} / en ${Object.keys(enFlat).length}`)
if (failures.length) {
	console.log(`\n[FAIL] ${failures.length} 项`)
	failures.forEach(item => console.log('  - ' + item))
} else {
	console.log('\n[PASS] 词典一致性检查通过')
}
if (warnings.length) {
	console.log(`\n[WARN] ${warnings.length} 项`)
	warnings.forEach(item => console.log('  - ' + item))
}
process.exitCode = failures.length ? 1 : 0
