const router = require('express').Router();
const privacy = require('../bin/userPrivacy.js');

router.get('/', async (req, res, next) => {
	try { res.json(await privacy.getSettings(req.user[0].user_id)); } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
	try { res.json(await privacy.saveSettings(req.user[0].user_id, req.body)); } catch (error) {
		if (error.statusCode === 422) return res.status(422).json({ msg: error.message });
		next(error);
	}
});

module.exports = router;
