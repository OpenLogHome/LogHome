// 相对时间格式化（P1 格式化层）：main.js 的 Vue.prototype.timeConvert 迁移至此
// zh 输出与旧实现逐字一致（刚刚/N分钟前/.../N年前，向下取整），en 用 Intl.RelativeTimeFormat
import moment from 'moment'
import i18n from '@/i18n/index.js'

const MINUTE = 60 * 1000
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7
const MONTH = DAY * 30
const YEAR = DAY * 365

let rtf = null
try {
	rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
} catch (error) {}

function enRelative(value, unit) {
	if (rtf) return rtf.format(-value, unit)
	const plural = value === 1 ? '' : 's'
	return `${value} ${unit}${plural} ago`
}

// 与旧 timeConvert 相同的分桶边界（月=30天、年=365天、周=7天）
export function relativeTime(dateTimeStamp) {
	const timestamp = new Date(dateTimeStamp).getTime()
	const diff = Date.now() - timestamp
	if (diff < 0) return i18n.locale === 'en' ? 'Just now' : '刚刚'

	const value = unit => Math.floor(diff / unit)
	if (diff >= YEAR) return i18n.locale === 'en' ? enRelative(value(YEAR), 'year') : `${value(YEAR)}年前`
	if (diff >= MONTH) return i18n.locale === 'en' ? enRelative(value(MONTH), 'month') : `${value(MONTH)}个月前`
	if (diff >= WEEK) return i18n.locale === 'en' ? enRelative(value(WEEK), 'week') : `${value(WEEK)}周前`
	if (diff >= DAY) return i18n.locale === 'en' ? enRelative(value(DAY), 'day') : `${value(DAY)}天前`
	if (diff >= HOUR) return i18n.locale === 'en' ? enRelative(value(HOUR), 'hour') : `${value(HOUR)}小时前`
	if (diff >= MINUTE) return i18n.locale === 'en' ? enRelative(value(MINUTE), 'minute') : `${value(MINUTE)}分钟前`
	return i18n.locale === 'en' ? 'Just now' : '刚刚'
}

// 帖子/动态时间线：分钟→小时→天，30 天以上显示绝对日期
// zh 输出与社区各页原 formatTime 实现逐字一致
export function postTimeText(time) {
	const postTime = moment(time)
	const now = moment()
	const diff = now.diff(postTime, 'minutes')
	if (diff < 1) return i18n.locale === 'en' ? 'Just now' : '刚刚'
	if (diff < 60) return i18n.locale === 'en' ? enRelative(diff, 'minute') : `${diff}分钟前`
	const hourDiff = now.diff(postTime, 'hours')
	if (hourDiff < 24) return i18n.locale === 'en' ? enRelative(hourDiff, 'hour') : `${hourDiff}小时前`
	const dayDiff = now.diff(postTime, 'days')
	if (dayDiff < 30) return i18n.locale === 'en' ? enRelative(dayDiff, 'day') : `${dayDiff}天前`
	return postTime.format('YYYY-MM-DD')
}
