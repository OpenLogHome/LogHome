// Public pages receive only a parcel number and carrier code, never app credentials or phone numbers.
export function getTrackingLinks(order = {}) {
	const number = String(order.tracking_number || '').trim()
	if (!number || order.product_type !== 'physical')
		return { queryUrl: '', officialUrl: '', officialName: '' }
	let code = String(order.shipping_company_code || '').trim()
	if (!code && /^JT\d{13}$/i.test(number)) code = 'jtexpress'
	const queryUrl =
		'https://m.kuaidi100.com/app/query/?coname=indexall&nu=' +
		encodeURIComponent(number) +
		(code ? '&com=' + encodeURIComponent(code) : '')
	const officialUrl =
		code === 'jtexpress'
			? 'https://www.jtexpress.com.cn/distM/serviceSearch.html?billcode=' +
			  encodeURIComponent(number)
			: ''
	return { queryUrl, officialUrl, officialName: officialUrl ? '极兔官方' : '' }
}
