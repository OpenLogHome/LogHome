const express = require('express');
const browser = require('../../bin/pddSelenium');
const router = express.Router();
const { saveProduct, buildPddProduct } = require('../../bin/storeProducts');

router.use((req, res, next) => {
	res.set('Cache-Control', 'no-store');
	next();
});

function endpoint(operation) {
	return async (req, res) => {
		try {
			const data = await operation(req.user[0].user_id, req);
			res.json({ code: 200, data });
		} catch (error) {
			// Never log Selenium errors: they can contain login fields or signed URLs.
			const status = ['BUSY', 'CAPACITY', 'LOGIN_IN_PROGRESS'].includes(error.code) ? 409 :
				['NOT_CONFIGURED', 'BROWSER_UNAVAILABLE', 'BROWSER_ERROR'].includes(error.code) ? 503 : 400;
			res.status(status).json({ code: status, error: error.code || 'IMPORT_FAILED', msg: error.code === 'ER_DUP_ENTRY' ? '该来源商品或规格已导入，请编辑现有商品' : /^[A-Z_]+$/.test(error.code || '') && !error.code.startsWith('ER_') ? error.message : '采集服务请求失败' });
		}
	};
}

router.get('/status', endpoint(owner => browser.status(owner)));
router.post('/login/start', endpoint(owner => browser.startLogin(owner)));
router.post('/login/action', endpoint((owner, req) => browser.loginAction(owner, req.body)));
router.post('/login/save', endpoint(owner => browser.saveLogin(owner)));
router.post('/login/close', endpoint(owner => browser.closeLogin(owner)));
router.post('/import', endpoint(async (owner, req) => {
	const product = await browser.collect(owner, req.body.url);
	return await saveProduct(buildPddProduct(product, req.body.category));
}));

router.post('/collect', endpoint((owner, req) => browser.collect(owner, req.body.url)));

module.exports = router;
