const express = require('express');
const auth = require('../bin/auth.js');
const redstone = require('../bin/redstone.js');

const router = express.Router();

function getUser(req) {
	return JSON.parse(JSON.stringify(req.user))[0];
}

function sendError(res, error) {
	if (error && error.isBusinessError) {
		res.status(error.statusCode || 400).json({ code: error.code || 'REDSTONE_ERROR', message: error.message });
		return;
	}
	console.log('红石接口错误:', error);
	res.status(500).json({ code: 'INTERNAL_ERROR', message: '红石服务暂时不可用' });
}

router.get('/account', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const data = await redstone.getAccount(user.user_id);
		res.json({ code: 200, data });
	} catch (error) {
		sendError(res, error);
	}
});

router.get('/transactions', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const data = await redstone.listTransactions(user.user_id, req.query.page, req.query.pageSize);
		res.json({ code: 200, data });
	} catch (error) {
		sendError(res, error);
	}
});

router.post('/exchange', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const data = await redstone.exchangeLogsForRedstone(
			user.user_id,
			req.body.redstone_amount,
			req.body.client_request_id,
		);
		res.status(data.replayed ? 200 : 201).json({ code: 200, data });
	} catch (error) {
		sendError(res, error);
	}
});

module.exports = router;
