const express = require('express');
const auth = require('../bin/auth');
const { createTtsService } = require('../bin/tts');
const service = createTtsService({ database: require('../sql'), http: require('axios'), config: require('../config') });
const router = express.Router();

router.post('/session', auth, async (req, res) => {
	res.set('Cache-Control', 'no-store');
	try {
		// Never accept a user ID or TTS key from the request body.
		const userId = Number(req.user[0].user_id);
		res.json({ code: 200, data: await service.getSession(userId) });
	} catch (error) {
		// Axios errors contain request headers; do not log them or return upstream bodies.
		const code = error.message === 'TTS_NOT_CONFIGURED' ? 'TTS_NOT_CONFIGURED' : 'TTS_UNAVAILABLE';
		res.status(503).json({ code, message: '听书服务暂时不可用，请稍后重试' });
	}
});

module.exports = router;
