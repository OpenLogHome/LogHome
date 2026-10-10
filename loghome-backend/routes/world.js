// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
const {
	COLLABORATOR_STATUS,
	buildAccessPayload,
	serializeAccess,
} = require('../bin/novelCollaboration.js');

// 创建路由对象
let router = express.Router();

router.get('/get_my_worlds', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let results = await query(
			`SELECT
				w.*,
				n.*,
				u.name user_name,
				u.avatar_url,
				EXISTS(
					SELECT 1
					FROM novel_collaborators nc_active
					WHERE nc_active.novel_id = n.novel_id
						AND nc_active.status = ?
					LIMIT 1
				) AS has_active_collaborators,
				(
					SELECT COUNT(*)
					FROM novel_collaborators nc_count
					WHERE nc_count.novel_id = n.novel_id
						AND nc_count.status = '${COLLABORATOR_STATUS.ACTIVE}'
				) AS active_collaborator_count,
				(
					SELECT ms.membership_type
					FROM membership_subscriptions ms
					WHERE ms.user_id = n.author_id
						AND ms.status = 'active'
						AND ms.starts_at <= NOW()
						AND ms.expires_at > NOW()
						AND ms.membership_type IN ('standard', 'super')
					ORDER BY FIELD(ms.membership_type, 'super', 'standard'), ms.expires_at DESC
					LIMIT 1
				) AS owner_membership_type,
				nc.role AS collaborator_role,
				nc.status AS collaborator_status,
				nc.can_edit_article,
				nc.can_add_article,
				nc.can_delete_article,
				nc.can_sort_article,
				nc.can_publish_article
			FROM world w
			JOIN novels n ON w.asso_novel_id = n.novel_id
			JOIN users u ON u.user_id = w.creator_id
			LEFT JOIN novel_collaborators nc
				ON nc.novel_id = n.novel_id
				AND nc.user_id = ?
			WHERE w.is_delete = 0
				AND n.deleted = 0
				AND (
					w.creator_id = ?
					OR nc.status = ?
				)
			ORDER BY n.update_time DESC`,
			[
				COLLABORATOR_STATUS.ACTIVE,
				user.user_id,
				user.user_id,
				COLLABORATOR_STATUS.ACTIVE,
			],
		);
		results = JSON.parse(JSON.stringify(results)).map((row) => {
			const access = buildAccessPayload(row, user.user_id);
			const serializedAccess = serializeAccess(access);

			return {
				...row,
				...serializedAccess,
				current_access: serializedAccess,
			};
		});
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// Public vocabulary data in one request: SSR relationship graphs never expose drafts.
router.get('/vocabularies', async function (req, res) {
 const id = Number(req.query.novel_id);
 if (!Number.isSafeInteger(id) || id <= 0) return res.status(404).json({msg:'World not found'});
 try {
  const { PUBLIC_NOVEL, PUBLIC_ARTICLE } = require('../bin/readingVisibility');
  const books = await query(`SELECT n.novel_id FROM novels n WHERE n.novel_id = ? AND n.novel_type = 'world' AND ${PUBLIC_NOVEL}`, [id]);
  if (!books.length) return res.status(404).json({msg:'World not found or not public'});
  const words = await query(`SELECT a.article_id,a.novel_id,a.title,a.content,a.article_type FROM articles a JOIN novels n ON n.novel_id = a.novel_id WHERE a.novel_id = ? AND a.article_type = 'worldVocabulary' AND ${PUBLIC_ARTICLE} ORDER BY a.article_chapter ASC`, [id]);
  res.json(words);
 } catch (_) { res.status(503).json({msg:'Vocabulary data unavailable'}); }
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
