let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');
const { shipOrder } = require('../../bin/storeShipping');
const carriers = require('../../bin/storeCarriers');
const { saveProduct, attachVariants } = require('../../bin/storeProducts');

let router = express.Router();
router.use('/pdd', auth, require('./pddImport'));

router.get('/products', auth, async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const offset = (page - 1) * pageSize;
		const count = await query('SELECT COUNT(*) total FROM store_products');
		const list = await query(
			'SELECT id, title, summary, description, type, price, stock, status, shipping_desc, cover_url, media_urls, category, source_metadata, has_variants FROM store_products ORDER BY id DESC LIMIT ?, ?',
			[offset, pageSize],
		);
		await attachVariants(list, true);
		res.json({ code: 200, data: { total: count[0].total, list } });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

function saveEndpoint(edit) {
	return async (req, res) => {
		try {
			const id = edit ? Number(req.params.id) : undefined;
			if (edit && (!Number.isSafeInteger(id) || id <= 0)) return res.status(400).json({ msg: '商品ID无效' });
			res.json({ code: 200, data: await saveProduct(req.body, id) });
		} catch (error) {
			res.status(400).json({ code: 400, msg: error.code === 'ER_DUP_ENTRY' ? '该来源商品或规格已导入，请编辑现有商品' : /^INVALID_|^PRODUCT_NOT_FOUND$/.test(error.code || '') ? error.message : '商品保存失败' });
		}
	};
}
router.post('/products', auth, saveEndpoint(false));
router.put('/products/:id', auth, saveEndpoint(true));

router.delete('/products/:id', auth, async (req, res) => {
	try {
		const productId = Number(req.params.id);
		await query('UPDATE store_products SET status = ? WHERE id = ?', ['off', productId]);
		res.json({ code: 200 });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/carriers', auth, (req, res) => res.json({code:200, data:carriers}));

router.get('/orders', auth, async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const offset = (page - 1) * pageSize;
		const count = await query('SELECT COUNT(*) total FROM store_orders');
		const list = await query(
			'SELECT id, order_no, user_id, product_title, variant_id, variant_label, source_snapshot, product_type, price, status, pay_log, pay_cropped_log, shipping_desc, tracking_number, shipping_company, shipping_company_code, receiver_name, receiver_phone, receiver_province, receiver_city, receiver_district, receiver_detail, created_at, shipped_at, completed_at, updated_at FROM store_orders ORDER BY id DESC LIMIT ?, ?',
			[offset, pageSize],
		);
		res.json({ code: 200, data: { total: count[0].total, list } });
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/orders/:id/ship', auth, async (req, res) => {
 try { res.json({code:200, data:await shipOrder(req.params.id, req.body)}); }
 catch (error) {
  if (!error.statusCode) console.error('商城发货失败');
  res.status(error.statusCode || 500).json({code:error.statusCode || 500, msg:error.statusCode ? error.message : '发货失败，发货状态和通知均未保存，请重试'});
 }
});

module.exports = router;
