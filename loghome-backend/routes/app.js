// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let sysLog = require('../bin/log.js');
let statistics = require('../bin/statistics.js');
let bank = require('../bin/bank.js');
let message = require('../bin/message.js');

// 创建路由对象
let router = express.Router();

router.get('/get_web_update', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM web_update_log ORDER BY web_update_id DESC LIMIT 0,1',
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_app_update', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM app_update_log ORDER BY app_update_id DESC LIMIT 0,1',
		);
		// 直接返回所有字段，包括 allow_hot, is_forced, asset_url
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 检查当前版本到最新版本之间是否所有版本都支持热更新
router.get('/check_hot_update_compatibility', async function (req, res) {
	try {
		const currentVersion = req.query.current_version;
		if (!currentVersion) {
			return res.json(400, { msg: 'current_version is required' });
		}

		// 获取当前版本和最新版本之间的所有版本记录
		const versions = await query(
			`SELECT * FROM app_update_log 
			WHERE version_number > ? 
			ORDER BY app_update_id ASC`,
			[currentVersion]
		);

		// 检查是否所有版本都支持热更新
		const allVersionsSupportHotUpdate = versions.every(v => v.allow_hot === 1);
		
		// 获取最新版本信息
		const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;
		
		res.json({
			allow_hot: allVersionsSupportHotUpdate && latestVersion.allow_hot === 1,
			latest_version: latestVersion,
			versions_between: versions
		});
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_grand_users', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM users WHERE user_group != ?',
			['用户'],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_great_users', async function (req, res) {
	try {
		let results = await query(
			'SELECT u.*,g.great_info FROM users u,great_users g WHERE u.user_id = g.user_id'
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_typical_faqs', async function (req, res) {
	try {
		let results = await query('SELECT * FROM faqs WHERE is_typical = 1');
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_newest_faqs', async function (req, res) {
	try {
		let results = await query(
			'SELECT * FROM faqs WHERE solved = 1 ORDER BY faq_id DESC ',
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_faqs_by_id', async function (req, res) {
	try {
		let results = await query('SELECT * FROM faqs WHERE faq_id = ?', [
			req.query.id,
		]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_my_faqs', auth, async function (req, res) {
	try {
		let user = req.user;
		user = JSON.parse(JSON.stringify(user))[0];
		let results = await query('SELECT * FROM faqs WHERE user_id = ?', [
			user.user_id,
		]);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.post('/post_faq', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			`INSERT INTO faqs(user_id,faq_title,faq_content,answer) 
                                VALUES(?,?,?,?)`,
			[user.user_id, req.body.faq_title, req.body.faq_content, ''],
		);
		res.end(JSON.stringify(results));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

router.get('/get_site_set', async function (req, res) {
	try {
		let results = await query('SELECT * FROM siteset');
		res.end(JSON.stringify(results[0]));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 生成随机邀请码
function generateInviteCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除容易混淆的字符
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// 检查月度重置
async function checkMonthlyReset(userId) {
    try {
        const inviteCode = await query(
            'SELECT * FROM invite_codes WHERE user_id = ?',
            [userId]
        );
        
        if (inviteCode.length === 0) {
            return;
        }
        
        const lastResetTime = new Date(inviteCode[0].last_reset_time);
        const currentTime = new Date();
        
        // 如果上次重置时间是上个月或更早
        if (lastResetTime.getMonth() !== currentTime.getMonth() || 
            lastResetTime.getFullYear() !== currentTime.getFullYear()) {
            
            await query(
                'UPDATE invite_codes SET last_month_new_count = 0, last_month_return_count = 0, last_reset_time = CURRENT_TIMESTAMP WHERE user_id = ?',
                [userId]
            );
        }
    } catch (e) {
        console.log('Error checking monthly reset:', e);
    }
}

// 获取用户邀请码
router.get('/get_invite_code', auth, async function (req, res) {
    try {
        const user = req.user[0];
        
        // 检查是否需要月度重置
        await checkMonthlyReset(user.user_id);
        
        // 查询用户是否已有邀请码
        let inviteCode = await query(
            'SELECT * FROM invite_codes WHERE user_id = ?',
            [user.user_id]
        );
        
        // 如果没有，生成新邀请码
        if (inviteCode.length === 0) {
            let newCode;
            let codeExists = true;
            
            // 确保生成唯一的邀请码
            while (codeExists) {
                newCode = generateInviteCode();
                const existingCode = await query(
                    'SELECT * FROM invite_codes WHERE invite_code = ?',
                    [newCode]
                );
                
                codeExists = existingCode.length > 0;
            }
            
            // 插入新邀请码
            await query(
                'INSERT INTO invite_codes (user_id, invite_code) VALUES (?, ?)',
                [user.user_id, newCode]
            );
            
            // 获取新创建的邀请码记录
            inviteCode = await query(
                'SELECT * FROM invite_codes WHERE user_id = ?',
                [user.user_id]
            );
        }
        
        res.json(inviteCode[0]);
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 使用邀请码
router.post('/use_invite_code', auth, async function (req, res) {
    try {
        const user = req.user[0];
        const { invite_code, invite_type } = req.body;
        
        if (!invite_code || !invite_type) {
            return res.status(400).json({ msg: '邀请码和邀请类型不能为空' });
        }
        
        // 验证邀请类型
        if (invite_type !== 'new' && invite_type !== 'return') {
            return res.status(400).json({ msg: '无效的邀请类型' });
        }
        
        // 查找邀请码
        const inviteCodeRecord = await query(
            'SELECT * FROM invite_codes WHERE invite_code = ?',
            [invite_code]
        );
        
        if (inviteCodeRecord.length === 0) {
            return res.status(400).json({ msg: '邀请码不存在' });
        }
        
        const inviter = inviteCodeRecord[0];
        
        // 检查是否是自己的邀请码
        if (inviter.user_id === user.user_id) {
            return res.status(400).json({ msg: '不能使用自己的邀请码' });
        }
        
        // 检查是否已经使用过该类型的邀请码
        const existingRecord = await query(
            'SELECT * FROM invite_records WHERE invitee_id = ? AND invite_type = ?',
            [user.user_id, invite_type]
        );
        
        if (existingRecord.length > 0) {
            return res.status(400).json({ msg: `您已经使用过${invite_type === 'new' ? '新用户' : '回归用户'}邀请码` });
        }
        
        // 如果是新用户，检查注册时间是否在14天内
        if (invite_type === 'new') {
            const userInfo = await query(
                'SELECT register_time FROM users WHERE user_id = ?',
                [user.user_id]
            );
            
            if (userInfo.length > 0) {
                const registerTime = new Date(userInfo[0].register_time);
                const currentTime = new Date();
                const daysDiff = Math.floor((currentTime - registerTime) / (1000 * 60 * 60 * 24));
                
                if (daysDiff > 14) {
                    return res.status(400).json({ msg: '新用户必须在注册后14天内填写邀请码' });
                }
            }
        }
        
        // 如果是回归用户，检查是否有回归资格
        if (invite_type === 'return') {
            // 检查用户是否在回归资格表中有有效记录
            const eligibilityRecord = await query(
                'SELECT * FROM return_user_eligibility WHERE user_id = ? AND is_used = 0 AND expiry_date > NOW()',
                [user.user_id]
            );
            
            if (eligibilityRecord.length === 0) {
                // 如果没有有效的回归资格记录，检查是否满足90天未登录条件
                const loginRecord = await query(
                    'SELECT online_time FROM users WHERE user_id = ?',
                    [user.user_id]
                );
                
                if (loginRecord.length > 0 && loginRecord[0].online_time) {
                    const lastLoginTime = new Date(loginRecord[0].online_time);
                    const currentTime = new Date();
                    const daysDiff = Math.floor((currentTime - lastLoginTime) / (1000 * 60 * 60 * 24));
                    
                    if (daysDiff < 90) {
                        return res.status(400).json({ msg: '您不符合回归用户资格，需要90天以上未登录' });
                    }
                } else {
                    return res.status(400).json({ msg: '无法确认您的登录记录，无法使用回归用户邀请码' });
                }
            }
        }
        
        // 检查邀请人本月邀请数量是否已达上限
        const monthlyField = invite_type === 'new' ? 'last_month_new_count' : 'last_month_return_count';
        if (inviter[monthlyField] >= 10) {
            return res.status(400).json({ msg: '邀请人本月邀请数量已达上限' });
        }
        
        // 开始事务
        await query('START TRANSACTION');
        
        try {
            // 插入邀请记录
            await query(
                'INSERT INTO invite_records (inviter_id, invitee_id, invite_type) VALUES (?, ?, ?)',
                [inviter.user_id, user.user_id, invite_type]
            );
            
            // 更新邀请人的统计数据
            const totalField = invite_type === 'new' ? 'new_user_count' : 'return_user_count';
            await query(
                `UPDATE invite_codes SET ${totalField} = ${totalField} + 1, ${monthlyField} = ${monthlyField} + 1 WHERE user_id = ?`,
                [inviter.user_id]
            );
            
            // 发放奖励
            const rewardAmount = invite_type === 'new' ? 1000 : 500;
            
            // 给邀请人奖励
            await bank.addAmount(inviter, 'log', rewardAmount);
            
            // 给被邀请人奖励
            await bank.addAmount(user, 'log', rewardAmount);
            
            // 发送消息通知
            message.sendMsg(
                -1,
                inviter.user_id,
                `您成功邀请了一位${invite_type === 'new' ? '新用户' : '回归用户'} ${user.name}，获得${rewardAmount}原木奖励！`,
                '',
                'notification',
                true
            );
            
            message.sendMsg(
                -1,
                user.user_id,
                `您已成功使用邀请码${invite_code}，获得${rewardAmount}原木奖励！`,
                '',
                'notification',
                true
            );
            
            // 如果是回归用户，标记回归资格已使用
            if (invite_type === 'return') {
                await query(
                    'UPDATE return_user_eligibility SET is_used = 1, use_time = NOW() WHERE user_id = ? AND is_used = 0 ORDER BY eligibility_id DESC LIMIT 1',
                    [user.user_id]
                );
            }
            
            // 提交事务
            await query('COMMIT');
            
            res.json({ success: true, msg: '邀请码使用成功' });
        } catch (error) {
            // 回滚事务
            await query('ROLLBACK');
            throw error;
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: '处理邀请码失败' });
    }
});

// 获取邀请记录
router.get('/get_invite_records', auth, async function (req, res) {
    try {
        const user = req.user[0];
        
        // 获取邀请记录
        const records = await query(
            `SELECT ir.*, u.name, u.avatar_url, ir.create_time 
             FROM invite_records ir
             JOIN users u ON ir.invitee_id = u.user_id
             WHERE ir.inviter_id = ?
             ORDER BY ir.create_time DESC`,
            [user.user_id]
        );
        
        res.json(records);
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: 'bad request' });
    }
});

// 检查用户的邀请资格状态
router.get('/check_invite_eligibility', auth, async function (req, res) {
    try {
        const user = req.user[0];
        const result = {
            newUserEligible: false,
            returnUserEligible: false
        };
        
        // 检查是否已使用过邀请码
        const newUserRecord = await query(
            'SELECT * FROM invite_records WHERE invitee_id = ? AND invite_type = ?',
            [user.user_id, 'new']
        );
        
        const returnUserRecord = await query(
            'SELECT * FROM invite_records WHERE invitee_id = ? AND invite_type = ?',
            [user.user_id, 'return']
        );
        
        // 检查新用户资格（注册时间在14天内且未使用过新用户邀请码）
        if (newUserRecord.length === 0) {
            const registerTime = new Date(user.register_time);
            const currentTime = new Date();
            const daysDiff = Math.floor((currentTime - registerTime) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= 14) {
                result.newUserEligible = true;
            }
        }
        
        // 检查回归用户资格
        if (returnUserRecord.length === 0) {
            // 检查用户是否在回归资格表中有有效记录
            const eligibilityRecord = await query(
                'SELECT * FROM return_user_eligibility WHERE user_id = ? AND is_used = 0 AND expiry_date > NOW()',
                [user.user_id]
            );
            
            if (eligibilityRecord.length > 0) {
                result.returnUserEligible = true;
            }
        }
        
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: '检查邀请资格失败' });
    }
});

// 获取服务器当前时间
router.get('/get_server_time', async function (req, res) {
    try {
        const now = new Date();
        
        // 格式化为yyyymmddhhmmss
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const formattedTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
        
        res.json({ server_time: formattedTime });
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: '获取服务器时间失败' });
    }
});

// 获取弹窗海报
router.get('/get_popup_poster', async function (req, res) {
    try {
        const currentUrl = req.query.url;
        if (!currentUrl) {
            return res.json([]);
        }

        // 查询当前时间在有效期内，且匹配当前URL的海报
        const results = await query(
            `SELECT * FROM popup_posters 
            WHERE page_url = ? 
            AND start_time <= NOW() 
            AND end_time >= NOW()
            ORDER BY id DESC LIMIT 1`,
            [currentUrl]
        );
        
        res.json(results);
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: '获取弹窗海报失败' });
    }
});

module.exports = router;
