// 从 pages.json 生成导航标题 i18n 映射（P1 标题机制，node scripts/gen-title-map.js）
// 产物：
//   i18n/title-map.js            路由 → 标题 key（'titles.<path 转点>'）
//   i18n/messages/zh-CN.titles.json  标题 zh 词条（值 = pages.json 原文）
// en.titles.json 由人工翻译维护；脚本仅报告缺失，不覆盖。
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const pagesJson = JSON.parse(fs.readFileSync(path.join(root, 'pages.json'), 'utf8'))

const routeTitleKeys = {}
const zhTitles = {}
let missingEn = []

function setDeep(obj, keys, value) {
	let cur = obj
	for (let i = 0; i < keys.length - 1; i++) {
		if (!cur[keys[i]] || typeof cur[keys[i]] !== 'object') cur[keys[i]] = {}
		cur = cur[keys[i]]
	}
	cur[keys[keys.length - 1]] = value
}
function getDeep(obj, keys) {
	let cur = obj
	for (const key of keys) {
		if (cur == null || typeof cur !== 'object') return undefined
		cur = cur[key]
	}
	return cur
}

const allPages = [...(pagesJson.pages || [])]
;(pagesJson.subPackages || []).forEach(sp =>
	(sp.pages || []).forEach(p => allPages.push({ ...p, path: sp.root + '/' + p.path })),
)

allPages.forEach(page => {
	const title = (page.style && page.style.navigationBarTitleText) || ''
	if (!title || !/[\u4e00-\u9fa5]/.test(title)) return
	const keyPath = ['titles', ...page.path.split('/')]
	routeTitleKeys[page.path] = keyPath.join('.')
	setDeep(zhTitles, keyPath, title)
})

fs.writeFileSync(
	path.join(root, 'i18n/title-map.js'),
	'// 由 scripts/gen-title-map.js 从 pages.json 生成，勿手改\nexport const routeTitleKeys = ' +
	JSON.stringify(routeTitleKeys, null, '\t') +
	'\n',
)
fs.writeFileSync(
	path.join(root, 'i18n/messages/zh-CN.titles.json'),
	JSON.stringify(zhTitles, null, '\t') + '\n',
)

let enTitles = {}
const enPath = path.join(root, 'i18n/messages/en.titles.json')
if (fs.existsSync(enPath)) enTitles = JSON.parse(fs.readFileSync(enPath, 'utf8'))
Object.keys(routeTitleKeys).forEach(route => {
	const keyPath = ['titles', ...route.split('/')]
	if (getDeep(enTitles, keyPath) === undefined) missingEn.push(keyPath.join('.'))
})

console.log(`已生成标题映射：${Object.keys(routeTitleKeys).length} 个路由`)
if (missingEn.length) {
	console.log(`en.titles.json 缺失 ${missingEn.length} 条：`)
	missingEn.forEach(k => console.log('  - ' + k))
} else {
	console.log('en.titles.json 覆盖完整 ✓')
}
