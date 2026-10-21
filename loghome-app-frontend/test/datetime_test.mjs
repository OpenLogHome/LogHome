// 相对时间边界测试：ns 沙箱内替换 i18n 依赖后直接加载 common/datetime.js
import test from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = fs.readFileSync(path.join(root, 'common/datetime.js'), 'utf8')

globalThis.__i18nStub = { locale: 'zh-CN' }

const momentUrl = pathToFileURL(require.resolve('moment')).href
const transformed = source
	.replace(/import moment from 'moment'/, `import moment from '${momentUrl}'`)
	.replace(/import i18n from '@\/i18n\/index\.js'/, 'const i18n = globalThis.__i18nStub')
const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(transformed).toString('base64')
const { relativeTime, recentTimeText, postTimeText } = await import(moduleUrl)

const NOW = new Date('2026-10-21T12:00:00')
const realNow = Date.now

function at(offsetMs, locale = 'zh-CN') {
	globalThis.__i18nStub.locale = locale
	Date.now = () => NOW.getTime()
	return new Date(NOW.getTime() - offsetMs)
}

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

test.after(() => {
	Date.now = realNow
})

test('relativeTime zh 分桶边界', () => {
	assert.strictEqual(relativeTime(at(30 * 1000)), '刚刚')
	assert.strictEqual(relativeTime(at(59 * MINUTE)), '59分钟前')
	assert.strictEqual(relativeTime(at(23 * HOUR)), '23小时前')
	assert.strictEqual(relativeTime(at(29 * DAY)), '4周前')
	assert.strictEqual(relativeTime(at(30 * DAY)), '1个月前')
	assert.strictEqual(relativeTime(at(29 * DAY), { weeks: false }), '29天前')
})

test('relativeTime en 分桶边界', () => {
	assert.strictEqual(relativeTime(at(30 * 1000, 'en')), 'Just now')
	assert.strictEqual(relativeTime(at(59 * MINUTE, 'en')), '59 minutes ago')
	assert.strictEqual(relativeTime(at(23 * HOUR, 'en')), '23 hours ago')
	assert.strictEqual(relativeTime(at(29 * DAY, 'en')), '4 weeks ago')
	assert.strictEqual(relativeTime(at(30 * DAY, 'en')), 'last month')
})

test('postTimeText 29/30 天与 long 模式', () => {
	assert.strictEqual(postTimeText(at(59 * MINUTE)), '59分钟前')
	assert.strictEqual(postTimeText(at(23 * HOUR)), '23小时前')
	assert.strictEqual(postTimeText(at(29 * DAY)), '29天前')
	assert.strictEqual(postTimeText(at(30 * DAY)), '2026-09-21')
	assert.strictEqual(postTimeText(at(30 * DAY), { long: true }), '1个月前')
	assert.strictEqual(postTimeText(at(400 * DAY), { long: true }), '1年前')
})

test('recentTimeText 小时/天/绝对日期边界', () => {
	assert.strictEqual(recentTimeText(at(30 * 1000)), '刚刚')
	assert.strictEqual(recentTimeText(at(59 * MINUTE)), '59分钟前')
	assert.strictEqual(recentTimeText(at(23 * HOUR)), '23小时前')
	assert.strictEqual(recentTimeText(at(6 * DAY)), '6天前')
	assert.strictEqual(recentTimeText(at(7 * DAY)), '2026-10-14')
})
