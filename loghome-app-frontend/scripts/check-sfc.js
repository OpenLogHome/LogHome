// SFC 快速校验（i18n 批量迁移配套）：node scripts/check-sfc.js <file.vue>...
// 1) vue/compiler-sfc parse 结构错误（模板未闭合、多 script 块等）
// 2) <script> 块 ESM 语法（node --check）
// 3) 模板 mustache {{ }} 配对粗检
const { execFileSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const sfc = require('vue/compiler-sfc')

const files = process.argv.slice(2)
if (!files.length) {
	console.error('usage: node scripts/check-sfc.js <file.vue>...')
	process.exit(2)
}

let failed = 0
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sfc-check-'))

files.forEach(file => {
	const problems = []
	const source = fs.readFileSync(file, 'utf8')
	let descriptor = null
	try {
		const parsed = sfc.parse({ source, filename: file })
		// Vue 2.7 返回 descriptor 本身，Vue 3 返回 { descriptor, errors }。
		descriptor = parsed.descriptor || parsed
		;(parsed.errors || []).forEach(err => problems.push('parse: ' + (err.message || err)))
	} catch (error) {
		problems.push('parse threw: ' + error.message)
	}

	if (descriptor && descriptor.template) {
		const tpl = descriptor.template.content
		const opens = (tpl.match(/\{\{/g) || []).length
		const closes = (tpl.match(/\}\}/g) || []).length
		if (opens !== closes) problems.push(`mustache 不配对: {{ ×${opens} vs }} ×${closes}`)
	}

	if (descriptor && descriptor.script && descriptor.script.content.trim()) {
		const tmpFile = path.join(tmpDir, path.basename(file) + '.' + Math.random().toString(36).slice(2) + '.mjs')
		fs.writeFileSync(tmpFile, descriptor.script.content)
		try {
			execFileSync(process.execPath, ['--check', tmpFile], { stdio: 'pipe' })
		} catch (error) {
			const detail = (error.stderr || Buffer.from('')).toString().split('\n').slice(0, 4).join(' | ')
			problems.push('script 语法: ' + detail)
		}
		fs.unlinkSync(tmpFile)
	}

	if (problems.length) {
		failed++
		console.error('✗ ' + file)
		problems.forEach(p => console.error('   - ' + p))
	} else {
		console.log('✓ ' + file)
	}
})

fs.rmdirSync(tmpDir)
process.exit(failed ? 1 : 0)
