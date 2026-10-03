let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

function toInt(value) {
	return value === 1 || value === true || value === '1' ? 1 : 0;
}

router.get('/', auth, async function (req, res) {
	try {
		let rows = await query('SELECT * FROM siteset LIMIT 1');
		res.json(rows[0] || {});
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

router.put('/', auth, async function (req, res) {
	try {
		let mourn = toInt(req.body.mourn);
		let openingPage = String(req.body.opening_page || '').trim();

		let rows = await query('SELECT * FROM siteset LIMIT 1');
		if (rows.length === 0) {
			await query('INSERT INTO siteset (mourn, opening_page) VALUES (?, ?)', [
				mourn,
				openingPage,
			]);
		} else {
			await query('UPDATE siteset SET mourn = ?, opening_page = ?', [
				mourn,
				openingPage,
			]);
		}

		res.json({ msg: 'success' });
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
