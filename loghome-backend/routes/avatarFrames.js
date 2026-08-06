const express = require('express');
const auth = require('../bin/auth.js');
const avatarFrames = require('../bin/avatarFrames.js');

const router = express.Router();

function getUser(req) {
	return JSON.parse(JSON.stringify(req.user))[0];
}

function sendError(res, error) {
	if (error && error.isBusinessError) {
		res.status(error.statusCode || 400).json({ code: error.code, message: error.message });
		return;
	}
	console.log('头像挂件接口错误:', error);
	res.status(500).json({ code: 'INTERNAL_ERROR', message: '头像挂件服务暂时不可用' });
}

router.get('/', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const data = await avatarFrames.getCatalogForUser(user.user_id);
		res.json({ code: 200, data });
	} catch (error) {
		sendError(res, error);
	}
});

router.put('/selection', auth, async (req, res) => {
	try {
		const user = getUser(req);
		const data = await avatarFrames.selectAvatarFrame(user.user_id, req.body.frame_id);
		res.json({ code: 200, data });
	} catch (error) {
		sendError(res, error);
	}
});

module.exports = router;
