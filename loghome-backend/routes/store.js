let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let bank = require('../bin/bank.js');

let router = express.Router();

let getUser = (req) => {
	let user = req.user;
	return JSON.parse(JSON.stringify(user))[0];
};

let generateOrderNo = () => {
	const now = new Date();
	const timestamp =
		now.getFullYear().toString() +
		String(now.getMonth() + 1).padStart(2, '0') +
		String(now.getDate()).padStart(2, '0') +
		String(now.getHours()).padStart(2, '0') +
		String(now.getMinutes()).padStart(2, '0') +
		String(now.getSeconds()).padStart(2, '0');
	const random = Math.floor(Math.random() * 1000000000)
		.toString()
		.padStart(9, '0');
	return `SO${timestamp}${random}`;
};

let generateTrackingCode = () => {
	const now = Date.now().toString(36).toUpperCase();
	const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
	return `${now}${rand}`.slice(0, 16);
};

router.get('/products', async (req, res) => {
	try {
		const type = req.query.type || 'all';
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const offset = (page - 1) * pageSize;
		let where = 'WHERE status = ?';
		let params = ['on'];
		if (type !== 'all') {
			where += ' AND type = ?';
			params.push(type);
		}
		const countResult = await query(
			`SELECT COUNT(*) as total FROM store_products ${where}`,
			params,
		);
		const list = await query(
			`SELECT product_id, title, summary, type, price, stock, cover_url, shipping_desc FROM store_products ${where} ORDER BY product_id DESC LIMIT ?, ?`,
			[...params, offset, pageSize],
		);
		res.json({
			code: 200,
			data: {
				total: countResult[0].total,
				page,
				pageSize,
				list,
			},
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/products/:id', async (req, res) => {
	try {
		const productId = Number(req.params.id);
		const result = await query(
			'SELECT product_id, title, summary, description, type, price, stock, cover_url, media_urls, shipping_desc, status FROM store_products WHERE product_id = ?',
			[productId],
		);
		if (result.length === 0) {
			res.json(404, { msg: '商品不存在' });
			return;
		}
		res.json({ code: 200, data: result[0] });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/addresses', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const list = await query(
			'SELECT address_id, receiver_name, receiver_phone, province, city, district, detail, is_default, created_at, updated_at FROM store_addresses WHERE user_id = ? ORDER BY is_default DESC, updated_at DESC',
			[user.user_id],
		);
		res.json({ code: 200, data: list });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/addresses/default', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const result = await query(
			'SELECT address_id, receiver_name, receiver_phone, province, city, district, detail, is_default FROM store_addresses WHERE user_id = ? AND is_default = 1 LIMIT 1',
			[user.user_id],
		);
		if (result.length === 0) {
			res.json({ code: 200, data: null });
			return;
		}
		res.json({ code: 200, data: result[0] });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/addresses/:id', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const addressId = Number(req.params.id);
		const result = await query(
			'SELECT address_id, receiver_name, receiver_phone, province, city, district, detail, is_default FROM store_addresses WHERE address_id = ? AND user_id = ?',
			[addressId, user.user_id],
		);
		if (result.length === 0) {
			res.json(404, { msg: '地址不存在' });
			return;
		}
		res.json({ code: 200, data: result[0] });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/addresses', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const {
			receiver_name,
			receiver_phone,
			province,
			city,
			district,
			detail,
			is_default,
		} = req.body;
		if (!receiver_name || !receiver_phone || !detail) {
			res.json(400, { msg: '请完善地址信息' });
			return;
		}
		const existing = await query(
			'SELECT address_id FROM store_addresses WHERE user_id = ?',
			[user.user_id],
		);
		let setDefault = is_default ? 1 : 0;
		if (existing.length === 0) {
			setDefault = 1;
		}
		if (setDefault === 1) {
			await query('UPDATE store_addresses SET is_default = 0 WHERE user_id = ?', [
				user.user_id,
			]);
		}
		const result = await query(
			'INSERT INTO store_addresses (user_id, receiver_name, receiver_phone, province, city, district, detail, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
			[
				user.user_id,
				receiver_name,
				receiver_phone,
				province,
				city,
				district,
				detail,
				setDefault,
			],
		);
		res.json({ code: 200, data: { address_id: result.insertId } });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.put('/addresses/:id', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const addressId = Number(req.params.id);
		const {
			receiver_name,
			receiver_phone,
			province,
			city,
			district,
			detail,
			is_default,
		} = req.body;
		if (!receiver_name || !receiver_phone || !detail) {
			res.json(400, { msg: '请完善地址信息' });
			return;
		}
		if (is_default) {
			await query('UPDATE store_addresses SET is_default = 0 WHERE user_id = ?', [
				user.user_id,
			]);
		}
		await query(
			'UPDATE store_addresses SET receiver_name = ?, receiver_phone = ?, province = ?, city = ?, district = ?, detail = ?, is_default = ? WHERE address_id = ? AND user_id = ?',
			[
				receiver_name,
				receiver_phone,
				province,
				city,
				district,
				detail,
				is_default ? 1 : 0,
				addressId,
				user.user_id,
			],
		);
		res.json({ code: 200 });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/addresses/:id/default', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const addressId = Number(req.params.id);
		await query('UPDATE store_addresses SET is_default = 0 WHERE user_id = ?', [
			user.user_id,
		]);
		const result = await query(
			'UPDATE store_addresses SET is_default = 1 WHERE address_id = ? AND user_id = ?',
			[addressId, user.user_id],
		);
		if (result.affectedRows === 0) {
			res.json(404, { msg: '地址不存在' });
			return;
		}
		res.json({ code: 200 });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.delete('/addresses/:id', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const addressId = Number(req.params.id);
		const before = await query(
			'SELECT is_default FROM store_addresses WHERE address_id = ? AND user_id = ?',
			[addressId, user.user_id],
		);
		if (before.length === 0) {
			res.json(404, { msg: '地址不存在' });
			return;
		}
		await query(
			'DELETE FROM store_addresses WHERE address_id = ? AND user_id = ?',
			[addressId, user.user_id],
		);
		if (before[0].is_default === 1) {
			const next = await query(
				'SELECT address_id FROM store_addresses WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
				[user.user_id],
			);
			if (next.length > 0) {
				await query(
					'UPDATE store_addresses SET is_default = 1 WHERE address_id = ?',
					[next[0].address_id],
				);
			}
		}
		res.json({ code: 200 });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/orders', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const { product_id, address_id } = req.body;
		if (!product_id) {
			res.json(400, { msg: '商品参数缺失' });
			return;
		}
		const productList = await query(
			'SELECT product_id, title, type, price, stock, cover_url, shipping_desc, status FROM store_products WHERE product_id = ?',
			[product_id],
		);
		if (productList.length === 0 || productList[0].status !== 'on') {
			res.json(404, { msg: '商品不存在或已下架' });
			return;
		}
		const product = productList[0];
		if (product.stock <= 0) {
			res.json(400, { msg: '库存不足' });
			return;
		}
		await bank.checkAccount(user);
		const bankRows = await query(
			'SELECT log, cropped_log FROM user_bank WHERE user_id = ?',
			[user.user_id],
		);
		const logAmount = Number(bankRows[0].log || 0);
		const croppedAmount = Number(bankRows[0].cropped_log || 0);
		const price = Number(product.price);
		if (logAmount + croppedAmount < price) {
			res.json(400, { msg: '余额不足' });
			return;
		}
		const payCropped = Math.min(croppedAmount, price);
		const payLog = price - payCropped;

		let addressSnapshot = null;
		if (product.type === 'physical') {
			if (!address_id) {
				res.json(400, { msg: '请选择收货地址' });
				return;
			}
			const addressList = await query(
				'SELECT address_id, receiver_name, receiver_phone, province, city, district, detail FROM store_addresses WHERE address_id = ? AND user_id = ?',
				[address_id, user.user_id],
			);
			if (addressList.length === 0) {
				res.json(400, { msg: '收货地址不存在' });
				return;
			}
			addressSnapshot = addressList[0];
		}

		const bankResult = await query(
			'UPDATE user_bank SET log = log - ?, cropped_log = cropped_log - ? WHERE user_id = ? AND log >= ? AND cropped_log >= ?',
			[payLog, payCropped, user.user_id, payLog, payCropped],
		);
		if (bankResult.affectedRows === 0) {
			res.json(400, { msg: '余额不足' });
			return;
		}

		const stockResult = await query(
			'UPDATE store_products SET stock = stock - 1 WHERE product_id = ? AND stock > 0',
			[product.product_id],
		);
		if (stockResult.affectedRows === 0) {
			await query(
				'UPDATE user_bank SET log = log + ?, cropped_log = cropped_log + ? WHERE user_id = ?',
				[payLog, payCropped, user.user_id],
			);
			res.json(400, { msg: '库存不足' });
			return;
		}

		const status = product.type === 'virtual' ? 'completed' : 'pending';
		const trackingNumber = product.type === 'virtual' ? generateTrackingCode() : null;
		const orderNo = generateOrderNo();
		const now = new Date();
		try {
			const result = await query(
				'INSERT INTO store_orders (order_no, user_id, product_id, product_title, product_cover, product_type, price, pay_log, pay_cropped_log, shipping_desc, status, address_id, receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_detail, tracking_number, created_at, updated_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[
					orderNo,
					user.user_id,
					product.product_id,
					product.title,
					product.cover_url,
					product.type,
					price,
					payLog,
					payCropped,
					product.shipping_desc,
					status,
					addressSnapshot ? addressSnapshot.address_id : null,
					addressSnapshot ? addressSnapshot.receiver_name : null,
					addressSnapshot ? addressSnapshot.receiver_phone : null,
					addressSnapshot ? addressSnapshot.province : null,
					addressSnapshot ? addressSnapshot.city : null,
					addressSnapshot ? addressSnapshot.district : null,
					addressSnapshot ? addressSnapshot.detail : null,
					trackingNumber,
					now,
					now,
					product.type === 'virtual' ? now : null,
				],
			);
			res.json({
				code: 200,
				data: {
					order_id: result.insertId,
					order_no: orderNo,
					status,
					pay_log: payLog,
					pay_cropped_log: payCropped,
				},
			});
		} catch (e) {
			await query(
				'UPDATE user_bank SET log = log + ?, cropped_log = cropped_log + ? WHERE user_id = ?',
				[payLog, payCropped, user.user_id],
			);
			await query(
				'UPDATE store_products SET stock = stock + 1 WHERE product_id = ?',
				[product.product_id],
			);
			throw e;
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: '下单失败' });
	}
});

router.get('/orders', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const status = req.query.status || 'all';
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const offset = (page - 1) * pageSize;
		let where = 'WHERE user_id = ?';
		let params = [user.user_id];
		if (status === 'pending') {
			where += ' AND status = ?';
			params.push('pending');
		} else if (status === 'shipped') {
			where += ' AND status IN (?, ?)';
			params.push('shipped', 'completed');
		} else if (status === 'completed') {
			where += ' AND status = ?';
			params.push('completed');
		}
		const countResult = await query(
			`SELECT COUNT(*) as total FROM store_orders ${where}`,
			params,
		);
		const list = await query(
			`SELECT order_id, order_no, product_id, product_title, product_cover, product_type, price, pay_log, pay_cropped_log, shipping_desc, status, receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_detail, tracking_number, created_at, updated_at, shipped_at, completed_at FROM store_orders ${where} ORDER BY created_at DESC LIMIT ?, ?`,
			[...params, offset, pageSize],
		);
		res.json({
			code: 200,
			data: {
				total: countResult[0].total,
				page,
				pageSize,
				list,
			},
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/orders/:id', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const orderId = Number(req.params.id);
		const result = await query(
			'SELECT order_id, order_no, product_id, product_title, product_cover, product_type, price, pay_log, pay_cropped_log, shipping_desc, status, receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_detail, tracking_number, created_at, updated_at, shipped_at, completed_at FROM store_orders WHERE order_id = ? AND user_id = ?',
			[orderId, user.user_id],
		);
		if (result.length === 0) {
			res.json(404, { msg: '订单不存在' });
			return;
		}
		res.json({ code: 200, data: result[0] });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/orders/:id/confirm', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const orderId = Number(req.params.id);
		const now = new Date();
		const result = await query(
			'UPDATE store_orders SET status = ?, completed_at = ?, updated_at = ? WHERE order_id = ? AND user_id = ? AND status = ?',
			['completed', now, now, orderId, user.user_id, 'shipped'],
		);
		if (result.affectedRows === 0) {
			res.json(400, { msg: '订单状态不支持确认收货' });
			return;
		}
		res.json({ code: 200 });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
