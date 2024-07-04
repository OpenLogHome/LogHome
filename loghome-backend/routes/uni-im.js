// 引入依赖包
const express = require('express');
const { query } = require('../sql.js');
const auth = require('../bin/auth.js');
const sysLog = require('../bin/log.js');
const statistics = require('../bin/statistics.js');
const sig = require('../bin/uni-cloud/sig.js');
const axios = require("axios")
const uniCloudUrl = require("../config.js").uniCloudUrl
const {
	sendMsg,
	sendMail,
} = require("../bin/message.js")

// 创建路由对象
let router = express.Router();

router.post('/uni-register', auth, async (req, res) => {
    try {
        let requestParams = {
            externalUid: String(req.body.user_id),
            nickname: req.body.username,
            avatar: req.body.avatar
        }
        let { nonce, timestamp, signature } = sig(requestParams);
        axios({
            method: 'post',
            url: uniCloudUrl + '/externalRegister',
            headers: {
                "Content-Type": "application/json",
                "uni-id-nonce": nonce,
                "uni-id-timestamp": timestamp,
                "uni-id-signature": signature
            },
            data: {
                "clientInfo": req.body.clientInfo,
                "params": requestParams
            }
        })
        .then(function (response) {
            // console.log(response.data);
            res.send(response.data);
        })
        .catch(function (error) {
            res.json(400, error);
        });
    } catch (e) {
        res.json(400, e);
    }
});


router.post('/get-uni-token', auth, async (req, res) => {
    try {
        let user = req.user[0];
        let requestParams = {
            externalUid: String(user.user_id),
        }
        let { nonce, timestamp, signature } = sig(requestParams);
        axios({
            method: 'post',
            url: uniCloudUrl + '/externalLogin',
            headers: {
                "Content-Type": "application/json",
                "uni-id-nonce": nonce,
                "uni-id-timestamp": timestamp,
                "uni-id-signature": signature
            },
            data: {
                "clientInfo": req.body.clientInfo,
                "params": requestParams
            }
        })
        .then(async function (response) {
            if(response.data.errCode == 0){
                await query(`UPDATE users SET uni_id = ? WHERE user_id = ?`, [response.data.uid, user.user_id]);
            }
            res.send(response.data);
        })
        .catch(function (error) {
            res.json(400, error);
        });
    } catch (e) {
        res.json(400, e);
    }
});

router.post('/handle_send_message', auth, async (req, res) => {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
        let toUser = (await query(`SELECT * FROM users WHERE uni_id = ?`, [req.body.payload.data.to_uid]))[0];
		await query(`INSERT INTO user_message(from_id, to_id, message_content, router, message_type) VALUES(?, ?, ?, ?, ?)`, 
        [user.user_id, toUser.user_id, req.body.payload.data.body, 'None', 'im']);
		res.end(JSON.stringify("success"));
	} catch (e) {
        console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_user_by_uni_id', auth, async (req, res) => {
	try {
        let toUser = (await query(`SELECT * FROM users WHERE uni_id = ?`, [req.query.uni_id]))[0];
		res.end(JSON.stringify(toUser));
	} catch (e) {
        console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});


module.exports = router;
