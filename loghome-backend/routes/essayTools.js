// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let axios = require('axios');

// 创建路由对象
let router = express.Router();

router.post('/news_summary', async (req, res) => {
	try {
		let axios = require('axios');
		let FormData = require('form-data');
		let data = new FormData();
		data.append('title', req.body.title);
		data.append('content', req.body.content);
		data.append('max_summary_len', req.body.max_summary_len);
		data.append('type', 'news_summary');
		data.append('apiType', 'nlp');

		let config = {
			method: 'post',
			url: 'https://ai.baidu.com/aidemo',
			headers: {
				...data.getHeaders(),
			},
			data: data,
		};

		axios(config)
			.then(function (response) {
				res.end(JSON.stringify(response.data));
			})
			.catch(function (error) {
				console.log(error);
				res.json(400, { msg: 'bad request' });
			});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
