const express = require('express');
const auth = require('../bin/auth');
const creditSqls = require('../sqls/credit');

const router = express.Router();

router.get('/history', auth, async (req, res) => {
	try {
		const uid = req.user[0].user_id;
		const history = await creditSqls.creditHistory(uid);
		const credit = await creditSqls.getCredit(uid);
		res.json({
			code: 200,
			credit,
			history,
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
