let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

router.get('/products', auth, async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const offset = (page - 1) * pageSize;
		const count = await query('SELECT COUNT(*) total FROM store_products');
		const list = await query(
			'SELECT product_id, title, type, price, stock, status, shipping_desc, cover_url FROM store_products ORDER BY product_id DESC LIMIT ?, ?',
			[offset, pageSize],
		);
		res.json({ code: 200, data: { total: count[0].total, list } });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/products', auth, async (req, res) => {
	try {
		const {
			title,
			summary,
			description,
			type,
			price,
			stock,
			cover_url,
			media_urls,
			shipping_desc,
			status,
		} = req.body;
		if (!title || !type || !price) {
			res.json(400, { msg: '缺少必要字段' });
			return;
		}
		const result = await query(
			'INSERT INTO store_products (title, summary, description, type, price, stock, cover_url, media_urls, shipping_desc, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				title,
				summary || null,
				description || null,
				type,
				Number(price),
				Number(stock || 0),
				cover_url || null,
				media_urls || null,
				shipping_desc || null,
				status || 'on',
			],
		);
		res.json({ code: 200, data: { product_id: result.insertId } });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.put('/products/:id', auth, async (req, res) => {
	try {
		const productId = Number(req.params.id);
		const fields = [
			'title',
			'summary',
			'description',
			'type',
			'price',
			'stock',
			'cover_url',
			'media_urls',
			'shipping_desc',
			'status',
		];
		let sets = [];
		let values = [];
		for (let f of fields) {
			if (req.body[f] !== undefined) {
				sets.push(`${f} = ?`);
				values.push(req.body[f]);
			}
		}
		if (sets.length === 0) {
			res.json(400, { msg: '没有可更新字段' });
			return;
		}
		values.push(productId);
		await query(`UPDATE store_products SET ${sets.join(', ')} WHERE product_id = ?`, values);
		res.json({ code: 200 });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.delete('/products/:id', auth, async (req, res) => {
	try {
		const productId = Number(req.params.id);
		await query('DELETE FROM store_products WHERE product_id = ?', [productId]);
		res.json({ code: 200 });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/orders', auth, async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const offset = (page - 1) * pageSize;
		const count = await query('SELECT COUNT(*) total FROM store_orders');
		const list = await query(
			'SELECT order_id, order_no, user_id, product_title, product_type, price, status, pay_log, pay_cropped_log, tracking_number, created_at, shipped_at, completed_at FROM store_orders ORDER BY order_id DESC LIMIT ?, ?',
			[offset, pageSize],
		);
		res.json({ code: 200, data: { total: count[0].total, list } });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/orders/:id/ship', auth, async (req, res) => {
	try {
		const orderId = Number(req.params.id);
		const tracking = req.body.tracking_number || null;
		const now = new Date();
		const result = await query(
			'UPDATE store_orders SET status = ?, tracking_number = ?, shipped_at = ?, updated_at = ? WHERE order_id = ? AND status = ?',
			['shipped', tracking, now, now, orderId, 'pending'],
		);
		if (result.affectedRows === 0) {
			res.json(400, { msg: '订单状态不支持发货' });
			return;
		}
		res.json({ code: 200 });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
