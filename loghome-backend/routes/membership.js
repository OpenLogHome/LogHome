const express = require('express');
const auth = require('../bin/auth.js');
const membership = require('../bin/membership.js');

const router = express.Router();

function getUser(req) {
	return JSON.parse(JSON.stringify(req.user))[0];
}

function sendError(res, error) {
	if (error && error.isBusinessError) {
		res.status(error.statusCode || 400).json({
			code: error.code || 'MEMBERSHIP_ERROR',
			message: error.message,
		});
		return;
	}
	console.log('会员接口错误:', error);
	res.status(500).json({ code: 'INTERNAL_ERROR', message: '会员服务暂时不可用' });
}

router.get('/plans', (req, res) => {
	res.json({ code: 200, data: membership.getPlanList() });
});

router.get('/subscription', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const data = await membership.getSubscriptionStatus(user.user_id);
		res.json({ code: 200, data });
	} catch (error) {
		sendError(res, error);
	}
});

router.get('/history', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const data = await membership.listSubscriptions(user.user_id, req.query.page, req.query.pageSize);
		res.json({ code: 200, data });
	} catch (error) {
		sendError(res, error);
	}
});

router.get('/gift-friends', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const list = await membership.listGiftFriends(user.user_id);
		res.json({ code: 200, data: { list } });
	} catch (error) {
		sendError(res, error);
	}
});

router.get('/redeem-history', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const data = await membership.listRedeemHistory(user.user_id, req.query.page, req.query.pageSize);
		res.json({ code: 200, data });
	} catch (error) {
		sendError(res, error);
	}
});

router.post('/redeem', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const data = await membership.redeemMembership(user.user_id, req.body.code);
		res.status(data.replayed ? 200 : 201).json({ code: 200, data });
	} catch (error) {
		sendError(res, error);
	}
});

router.post('/subscribe', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const data = await membership.purchaseMembership({
			purchaserUserId: user.user_id,
			beneficiaryUserId: user.user_id,
			membershipType: req.body.membership_type,
			billingCycle: req.body.billing_cycle,
			autoRenew: req.body.auto_renew,
			clientRequestId: req.body.client_request_id,
			source: 'purchase',
		});
		res.status(data.replayed ? 200 : 201).json({ code: 200, data });
	} catch (error) {
		sendError(res, error);
	}
});

router.post('/gift', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const beneficiaryUserId = Number(req.body.beneficiary_user_id);
		if (beneficiaryUserId === Number(user.user_id)) {
			throw membership.createBusinessError('赠送对象不能是自己，请使用开通入口', 422, 'CANNOT_GIFT_SELF');
		}
		const data = await membership.purchaseMembership({
			purchaserUserId: user.user_id,
			beneficiaryUserId,
			membershipType: req.body.membership_type,
			billingCycle: req.body.billing_cycle,
			autoRenew: false,
			clientRequestId: req.body.client_request_id,
			source: 'gift',
			giftMessage: req.body.message,
		});
		res.status(data.replayed ? 200 : 201).json({ code: 200, data });
	} catch (error) {
		sendError(res, error);
	}
});

router.patch('/auto-renew', auth, async (req, res) => {
	try {
		if (typeof req.body.enabled !== 'boolean') {
			throw membership.createBusinessError('enabled 必须是布尔值', 422, 'INVALID_AUTO_RENEW_VALUE');
		}
		const user = getUser(req);
		const subscription = await membership.setAutoRenew(user.user_id, req.body.enabled);
		res.json({ code: 200, data: { subscription } });
	} catch (error) {
		sendError(res, error);
	}
});

module.exports = router;
