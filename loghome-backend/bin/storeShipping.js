const { withTransaction } = require('../sql');
const message = require('./message');
const carriers = require('./storeCarriers');
function businessError(msg, statusCode = 400) {
	return Object.assign(new Error(msg), { statusCode });
}
async function shipOrder(id, body) {
	const orderId = Number(id);
	const tracking = String(body.tracking_number || '').trim();
	const code = String(body.shipping_company_code || '').trim();
	const company = carriers.find(row => row.code === code);
	const name = company
		? company.name
		: String(body.shipping_company || '').trim();
	if (!Number.isSafeInteger(orderId) || orderId <= 0)
		throw businessError('订单ID无效');
	if (!/^[A-Za-z0-9-]{5,100}$/.test(tracking))
		throw businessError('请输入有效的快递单号（5～100位字母、数字或短横线）');
	if (code && !company)
		throw businessError('请选择支持的快递公司，或选择其他快递');
	if (!name || name.length > 60)
		throw businessError('请填写快递公司（最多60字）');
	return withTransaction(async q => {
		const rows = await q(
			'SELECT id, user_id, order_no, product_title, variant_label, product_type, status, tracking_number, shipping_company, shipping_company_code FROM store_orders WHERE id = ? FOR UPDATE',
			[orderId],
		);
		const order = rows[0];
		if (!order) throw businessError('订单不存在', 404);
		if (order.product_type !== 'physical')
			throw businessError('只有实物订单支持发货');
		if (
			['shipped', 'completed'].includes(order.status) &&
			order.tracking_number === tracking &&
			order.shipping_company === name &&
			(order.shipping_company_code || '') === code
		)
			return { replayed: true };
		if (order.status !== 'pending') throw businessError('订单状态不支持发货');
		const now = new Date();
		await q(
			'UPDATE store_orders SET status = ?, tracking_number = ?, shipping_company = ?, shipping_company_code = ?, shipped_at = ?, updated_at = ? WHERE id = ?',
			['shipped', tracking, name, code || null, now, now, orderId],
		);
		const content = `原木商城订单 ${order.order_no} 已发货：${
			order.product_title
		}${
			order.variant_label ? '（' + order.variant_label + '）' : ''
		}。${name}，单号 ${tracking}。点击查看物流。`;
		await message.sendMsg(
			-1,
			order.user_id,
			content,
			'store/logistics?order_id=' + orderId,
			'notification',
			true,
			null,
			q,
		);
		return { replayed: false };
	}, 'store shipment and notification');
}
module.exports = { shipOrder };
