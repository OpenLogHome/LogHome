// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');

// 创建路由对象
let router = express.Router();

router.get('/get_my_worlds', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let results = await query(`SELECT w.*, n.*, u.name user_name, u.avatar_url FROM world w, novels n, users u 
		WHERE w.creator_id = ? AND w.is_delete = 0 AND n.deleted = 0 AND w.asso_novel_id = n.novel_id
		AND u.user_id = w.creator_id`, [user.user_id]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_world_by_id', async function (req, res) {
	try {
		let results = await query(`SELECT w.*, n.*, u.name user_name, u.avatar_url FROM world w, novels n, users u 
		WHERE w.world_id = ? AND w.is_delete = 0 AND n.deleted = 0 AND w.asso_novel_id = n.novel_id
		AND u.user_id = w.creator_id`, [req.query.world_id]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_world_by_novel_id', async function (req, res) {
	try {
		let results = await query(`SELECT w.*, n.*, u.name user_name, u.avatar_url FROM world w, novels n, users u
		 WHERE n.novel_id = ? AND w.is_delete = 0 AND n.deleted = 0 AND w.asso_novel_id = n.novel_id
		 AND u.user_id = w.creator_id`, [req.query.novel_id]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_worlds_search', async function (req, res) {
	try {
		let keyword = '%' + req.query.keyword + '%';
		let results = await query(
			`SELECT w.*, n.*,u.name user_name,u.avatar_url 
							FROM novels n,users u, world w
							WHERE u.user_id = n.author_id 
							AND n.deleted = 0
							AND n.is_personal = 0
							AND (n.name LIKE ? OR n.content LIKE ?)
							AND w.asso_novel_id = n.novel_id`,
			[keyword, keyword],
		);

		for (let i = 0; i < results.length; i++) {
			let r = Math.floor(Math.random() * results.length);
			let t = results[i];
			results[i] = results[r];
			results[r] = t;
		}
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/create_world', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let newNovel = await query(
			'INSERT INTO novels(name,content,author_id,update_time,novel_type) VALUES(?,?,?,CURRENT_TIMESTAMP,"world")',
			[req.query.world_name, "这个作者很懒，还没有写世界简介~", user.user_id],
		);
		console.log(newNovel);
		let results = await query("INSERT INTO world(creator_id, asso_novel_id) VALUES(?, ?)",
			[user.user_id, newNovel.insertId]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_asso_world_by_world_id', async function (req, res) {
	try {
		let results = await query(`SELECT n.*, u.name user_name, u.avatar_url FROM world_novel wn, novels n, users u
		WHERE n.deleted = 0 AND n.is_personal = 0 AND wn.novel_id = n.novel_id AND wn.world_id = ? AND u.user_id = n.author_id`, [req.query.world_id]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_asso_world_by_novel_id', async function (req, res) {
	try {
		let results = await query(`SELECT w.*, wn.*, u.name user_name, u.avatar_url FROM world w, world_novel n, novels wn, users u
		WHERE n.novel_id = ? AND w.is_delete = 0 AND w.world_id = n.world_id AND wn.novel_id = w.asso_novel_id AND u.user_id = w.creator_id`, [req.query.novel_id]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/add_world_novel_asso',auth, async function (req, res){
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let val = await query(`SELECT * FROM novels WHERE author_id = ?`, [user.user_id]);
		if(val.length > 0){
			let results = await query(`INSERT INTO world_novel(world_id, novel_id) VALUES(?, ?)`, [req.query.world_id, req.query.novel_id]);
			res.end(JSON.stringify(results));
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/delete_world_novel_asso',auth, async function (req, res){
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let val = await query(`SELECT * FROM novels WHERE author_id = ?`, [user.user_id]);
		if(val.length > 0){
			let results = await query(`DELETE FROM world_novel WHERE world_id = ? AND novel_id = ?`, [req.query.world_id, req.query.novel_id]);
			res.end(JSON.stringify(results));
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_worlds_by_author', async function (req, res) {
	try {
		let user_id = req.query.user_id;
		let results = await query(`SELECT w.*, n.*, u.name user_name, u.avatar_url FROM world w, novels n, users u 
		WHERE w.creator_id = ? AND w.is_delete = 0 AND n.deleted = 0 AND w.asso_novel_id = n.novel_id AND n.is_personal = 0
		AND u.user_id = w.creator_id`, [user_id]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;