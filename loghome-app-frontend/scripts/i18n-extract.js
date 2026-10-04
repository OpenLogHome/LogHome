// i18n 覆盖率报告（P1 配套）：node scripts/i18n-extract.js
// 扫描 pages/ components/ 的 .vue/.js：
//   - 剔除注释后统计仍含中文字面量的文件与处数（= 未迁移可见文案的近似上界）
//   - 统计 $t()/i18n.t() 使用数（= 已迁移量）
//   - 输出高频未迁移字符串 Top 30
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const SCAN_DIRS = ['pages', 'components', 'common', 'mixins']
const HAN = /[\u4e00-\u9fff]/

function walk(dir, out = []) {
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

// 粗略去注释：块注释 + 行注释（字符串里的 // 误伤率低，够报告用）
function stripComments(code) {
	return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1')
}

const rows = []
const stringCount = new Map()
let translatedUsages = 0

SCAN_DIRS.forEach(scan => {
	const dir = path.join(root, scan)
	if (!fs.existsSync(dir)) return
	walk(dir).forEach(file => {
		const source = fs.readFileSync(file, 'utf8')
		// vue 文件仅统计 template + script（style 无文案）
		const code = stripComments(source)
		const translated = (code.match(/\$t\s*\(|i18n\.t\s*\(|\$tc\s*\(/g) || []).length
		translatedUsages += translated
		let hits = 0
		code.split('\n').forEach(line => {
			if (!HAN.test(line)) return
			// 排除已是注释残留/纯数据文件（pca-code 省市区、简繁表）
			hits++
			const strings = line.match(/'[^'\n]*[\u4e00-\u9fff][^'\n]*'|"[^"\n]*[\u4e00-\u9fff][^"\n]*"|`[^`\n]*[\u4e00-\u9fff][^`\n]*`/g) || []
			strings.forEach(s => stringCount.set(s, (stringCount.get(s) || 0) + 1))
		})
		if (hits > 0) rows.push({ file: path.relative(root, file), lines: hits, translated })
	})
})

rows.sort((a, b) => b.lines - a.lines)
const totalLines = rows.reduce((sum, r) => sum + r.lines, 0)

console.log('=== i18n 覆盖率报告 ===')
console.log(`未迁移中文字面量行数: ${totalLines}（近似上界，含数据/内容文案）`)
console.log(`$t() 使用数: ${translatedUsages}`)
console.log(`含中文文件数: ${rows.length}`)
console.log('\n-- 待迁移 Top 25 文件 --')
rows.slice(0, 25).forEach(r => console.log(`${String(r.lines).padStart(4)}  ${r.file}`))
console.log('\n-- 高频未迁移字符串 Top 30（≥3 次）--')
;[...stringCount.entries()]
	.filter(([, n]) => n >= 3)
	.sort((a, b) => b[1] - a[1])
	.slice(0, 30)
	.forEach(([s, n]) => console.log(`${String(n).padStart(3)}× ${s}`))
