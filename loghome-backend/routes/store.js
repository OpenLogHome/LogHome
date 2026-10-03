let express = require('express');
let { query, withTransaction } = require('../sql.js');
let auth = require('../bin/auth.js');
const { attachVariants } = require('../bin/storeProducts');

const { getLogistics, getLogisticsMetadata } = require('../bin/storeLogistics');

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

let createBusinessError = (message, statusCode = 400) => {
	const error = new Error(message);
	error.isBusinessError = true;
	error.statusCode = statusCode;
	return error;
};

let isDuplicateKeyError = (error) => {
	return error && (error.code === 'ER_DUP_ENTRY' || error.errno === 1062);
};

let buildOrderSubmitData = (orderRow) => {
	return {
		id: orderRow.id,
		order_no: orderRow.order_no,
		status: orderRow.status,
		pay_log: Number(orderRow.pay_log || 0),
		pay_cropped_log: Number(orderRow.pay_cropped_log || 0),
	};
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
		if (req.query.category) {
			where += ' AND category = ?';
			params.push(String(req.query.category).slice(0, 80));
		}
		const countResult = await query(
			`SELECT COUNT(*) as total FROM store_products ${where}`,
			params,
		);
		const list = await query(
			`SELECT id, title, summary, type, price, stock, cover_url, shipping_desc, category, has_variants FROM store_products ${where} ORDER BY id DESC LIMIT ?, ?`,
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
			'SELECT id, title, summary, description, type, price, stock, cover_url, media_urls, shipping_desc, status, category, has_variants FROM store_products WHERE id = ? AND status = ?',
			[productId, 'on'],
		);
		if (result.length === 0) {
			res.json(404, { msg: '商品不存在' });
			return;
		}
		await attachVariants(result);
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
		const { product_id, variant_id, address_id, client_request_id } = req.body;
		if (!product_id) {
			res.json(400, { msg: '商品参数缺失' });
			return;
		}
		const requestKey = String(client_request_id || '').trim().slice(0, 64);
		const orderData = await withTransaction(async (transactionalQuery) => {
			if (requestKey) {
				try {
					await transactionalQuery(
						'INSERT INTO store_order_requests (request_key, user_id, product_id, variant_id, address_id, status) VALUES (?, ?, ?, ?, ?, ?)',
						[requestKey, user.user_id, Number(product_id), variant_id || null, address_id || null, 'processing'],
					);
				} catch (error) {
					if (!isDuplicateKeyError(error)) {
						throw error;
					}
					const existingRequestList = await transactionalQuery(
						'SELECT order_id, status, user_id, product_id, variant_id FROM store_order_requests WHERE request_key = ? LIMIT 1',
						[requestKey],
					);
					const existingRequest = existingRequestList[0];
					if (existingRequest && (Number(existingRequest.user_id) !== Number(user.user_id) || Number(existingRequest.product_id) !== Number(product_id) || Number(existingRequest.variant_id || 0) !== Number(variant_id || 0))) throw createBusinessError('请求标识已用于其他商品或规格', 409);
					if (
						existingRequest &&
						existingRequest.status === 'succeeded' &&
						existingRequest.order_id
					) {
						const existingOrderList = await transactionalQuery(
							'SELECT id, order_no, status, pay_log, pay_cropped_log FROM store_orders WHERE id = ? AND user_id = ? LIMIT 1',
							[existingRequest.order_id, user.user_id],
						);
						if (existingOrderList.length > 0) {
							return buildOrderSubmitData(existingOrderList[0]);
						}
					}
					throw createBusinessError('订单处理中，请勿重复提交', 409);
				}
			}

			await transactionalQuery('INSERT IGNORE INTO user_bank(user_id) VALUES(?)', [
				user.user_id,
			]);

			const productList = await transactionalQuery(
				'SELECT id, title, type, price, stock, cover_url, shipping_desc, status, has_variants, source_metadata FROM store_products WHERE id = ? LIMIT 1 FOR UPDATE',
				[product_id],
			);
			if (productList.length === 0 || productList[0].status !== 'on') {
				throw createBusinessError('商品不存在或已下架', 404);
			}

			const product = productList[0];
			let variant = null;
			if (product.has_variants) {
				if (!Number.isSafeInteger(Number(variant_id)) || Number(variant_id) <= 0) throw createBusinessError('请选择商品规格');
				const variants = await transactionalQuery('SELECT * FROM store_product_variants WHERE id = ? AND product_id = ? AND deleted = 0 FOR UPDATE', [variant_id, product.id]);
				variant = variants[0];
				if (!variant || variant.status !== 'on') throw createBusinessError('商品规格不存在或已停用');
				if (Number(variant.stock) <= 0) throw createBusinessError('该规格库存不足');
			} else if (variant_id) throw createBusinessError('该商品不支持此规格');
			if (Number(product.stock) <= 0) {
				throw createBusinessError('库存不足');
			}

			const bankRows = await transactionalQuery(
				'SELECT log, cropped_log FROM user_bank WHERE user_id = ? LIMIT 1',
				[user.user_id],
			);
			const logAmount = Number(bankRows[0].log || 0);
			const croppedAmount = Number(bankRows[0].cropped_log || 0);
			const price = Number(variant ? variant.price : product.price || 0);
			if (logAmount + croppedAmount < price) {
				throw createBusinessError('余额不足');
			}

			const payCropped = Math.min(croppedAmount, price);
			const payLog = price - payCropped;
			let addressSnapshot = null;

			if (product.type === 'physical') {
				if (!address_id) {
					throw createBusinessError('请选择收货地址');
				}
				const addressList = await transactionalQuery(
					'SELECT address_id, receiver_name, receiver_phone, province, city, district, detail FROM store_addresses WHERE address_id = ? AND user_id = ? LIMIT 1',
					[address_id, user.user_id],
				);
				if (addressList.length === 0) {
					throw createBusinessError('收货地址不存在');
				}
				addressSnapshot = addressList[0];
			}

			const bankResult = await transactionalQuery(
				'UPDATE user_bank SET log = log - ?, cropped_log = cropped_log - ? WHERE user_id = ? AND log >= ? AND cropped_log >= ?',
				[payLog, payCropped, user.user_id, payLog, payCropped],
			);
			if (bankResult.affectedRows === 0) {
				throw createBusinessError('余额不足');
			}

			const stockResult = await transactionalQuery(
				'UPDATE store_products SET stock = stock - 1 WHERE id = ? AND stock > 0',
				[product.id],
			);
			if (stockResult.affectedRows === 0) {
				throw createBusinessError('库存不足');
			}

			if (variant) {
				const result = await transactionalQuery('UPDATE store_product_variants SET stock = stock - 1 WHERE id = ? AND product_id = ? AND stock > 0 AND deleted = 0 AND status = ?', [variant.id, product.id, 'on']);
				if (!result.affectedRows) throw createBusinessError('该规格库存不足');
			}

			const status = product.type === 'virtual' ? 'completed' : 'pending';
			const trackingNumber = product.type === 'virtual' ? generateTrackingCode() : null;
			const orderNo = generateOrderNo();
			const now = new Date();
			const result = await transactionalQuery(
				'INSERT INTO store_orders (order_no, user_id, product_id, product_title, product_cover, product_type, variant_id, variant_label, source_snapshot, price, pay_log, pay_cropped_log, shipping_desc, status, address_id, receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_detail, tracking_number, created_at, updated_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[
					orderNo,
					user.user_id,
					product.id,
					product.title,
					variant && variant.cover_url || product.cover_url,
					product.type,
					variant ? variant.id : null,
					variant ? variant.label : null,
					variant ? JSON.stringify({ ...JSON.parse(product.source_metadata || '{}'), ...JSON.parse(variant.source_metadata || '{}') }) : product.source_metadata,
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

			if (requestKey) {
				await transactionalQuery(
					'UPDATE store_order_requests SET order_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE request_key = ?',
					[result.insertId, 'succeeded', requestKey],
				);
			}

			return buildOrderSubmitData({
				id: result.insertId,
				order_no: orderNo,
				status,
				pay_log: payLog,
				pay_cropped_log: payCropped,
			});
		}, 'store.createOrder');

		res.json({
			code: 200,
			data: orderData,
		});
	} catch (e) {
		console.log(e);
		if (e && e.isBusinessError) {
			res.json(e.statusCode || 400, { msg: e.message });
			return;
		}
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
			`SELECT id, order_no, product_id, product_title, variant_id, variant_label, product_cover, product_type, price, pay_log, pay_cropped_log, shipping_desc, status, receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_detail, tracking_number, shipping_company, shipping_company_code, created_at, updated_at, shipped_at, completed_at FROM store_orders ${where} ORDER BY created_at DESC LIMIT ?, ?`,
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

router.get('/orders/:id/logistics', auth, async (req, res) => {
 try {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({msg:'订单ID无效'});
  const rows = await query('SELECT id, order_no, user_id, product_title, product_cover, variant_label, product_type, status, tracking_number, shipping_company, shipping_company_code, receiver_phone, shipped_at FROM store_orders WHERE id = ? AND user_id = ?', [id, getUser(req).user_id]);
  const order = rows[0];
  if (!order) return res.status(404).json({msg:'订单不存在'});
  const metadata = getLogisticsMetadata(order);
  const logistics = req.query.query === 'metadata' ? metadata.logistics : await getLogistics(order);
  const {receiver_phone, user_id, ...publicOrder} = order;
  res.json({code:200, data:{order:publicOrder, logistics, ...(req.query.query === 'metadata' && metadata.native_query ? {native_query:metadata.native_query} : {})}});
 } catch (_) { res.status(500).json({msg:'物流信息加载失败，请稍后重试'}); }
});

router.get('/orders/:id', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const orderId = Number(req.params.id);
		const result = await query(
			'SELECT id, order_no, product_id, product_title, variant_id, variant_label, product_cover, product_type, price, pay_log, pay_cropped_log, shipping_desc, status, receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_detail, tracking_number, shipping_company, shipping_company_code, created_at, updated_at, shipped_at, completed_at FROM store_orders WHERE id = ? AND user_id = ?',
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
			'UPDATE store_orders SET status = ?, completed_at = ?, updated_at = ? WHERE id = ? AND user_id = ? AND status = ?',
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
