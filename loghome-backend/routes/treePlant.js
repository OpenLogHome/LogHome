// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let axios = require('axios');
const { htmlToText } = require('html-to-text');
let message = require('../bin/message.js');
// 创建路由对象
let router = express.Router();
let schedule = require('node-schedule');
let bank = require('../bin/bank.js');

// 辅助函数：判断是否同一天
function isSameDay(d1, d2) {
    if (!d1 || !d2) return false;
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// 获取树场信息（包含任务）
router.get('/get_treePlant_of', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
        // 1. 获取树木信息
		let trees = await query(
			'SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0',
			[user.user_id],
		);

        // 如果没有树，直接返回空数组
        if (trees.length === 0) {
            res.end(JSON.stringify([]));
            return;
        }

        let tree = trees[0];

        // 2. 获取所有任务
        let tasks = await query('SELECT * FROM tree_tasks ORDER BY task_id ASC');

        // 3. 获取用户任务进度
        let userTasks = await query(
            'SELECT * FROM user_tree_tasks WHERE user_id = ?',
            [user.user_id]
        );

        // 4. 合并任务状态
        let tasksWithStatus = tasks.map(task => {
            let userTask = userTasks.find(ut => ut.task_code === task.task_code);
            let status = 'pending'; // pending, completed

            if (userTask) {
                if (task.task_type === 'daily') {
                    if (isSameDay(userTask.last_completed_at, new Date())) {
                        status = 'completed';
                    }
                } else if (task.task_type === 'fixed') {
                    if (userTask.is_completed) {
                        status = 'completed';
                    }
                }
            }
            
            return {
                ...task,
                status: status
            };
        });

        // 将任务列表附加到树对象上
        tree.tasks = tasksWithStatus;
        // 确保 growth_val 存在
        tree.growth_val = tree.growth_val || 0;
        tree.max_growth = 100; // 硬编码最大成长值

		res.end(JSON.stringify([tree]));
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 种树
router.get('/plant_tree', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0',
			[user.user_id],
		);
		if (results.length > 0) {
			res.json(400, { msg: 'bad request' });
		} else {
            // 插入新树，初始成长值为 0，状态为 '种植'
			let results = await query(
				'INSERT INTO treeplant(treeType, user_id, tree_status, growth_val) VALUES(?, ?, ?, ?)',
				[req.query.tree_type, user.user_id, '种植', 0],
			);
			res.end(JSON.stringify(results));
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

// 完成任务接口
router.post('/do_task', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];
    let { task_code } = req.body;

    if (!task_code) {
        return res.json(400, { msg: 'Missing task_code' });
    }

    try {
        // 1. 检查树是否存在
        let trees = await query('SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0', [user.user_id]);
        if (trees.length === 0) {
            return res.json(400, { msg: 'No active tree' });
        }
        let tree = trees[0];

        // 2. 获取任务信息
        let tasks = await query('SELECT * FROM tree_tasks WHERE task_code = ?', [task_code]);
        if (tasks.length === 0) {
            return res.json(400, { msg: 'Task not found' });
        }
        let task = tasks[0];

        // 3. 检查是否已完成
        let userTasks = await query('SELECT * FROM user_tree_tasks WHERE user_id = ? AND task_code = ?', [user.user_id, task_code]);
        let userTask = userTasks.length > 0 ? userTasks[0] : null;

        if (userTask) {
            if (task.task_type === 'daily') {
                if (isSameDay(userTask.last_completed_at, new Date())) {
                    return res.json(400, { msg: 'Task already completed today' });
                }
            } else if (task.task_type === 'fixed') {
                if (userTask.is_completed) {
                    return res.json(400, { msg: 'Task already completed' });
                }
            }
        }

        // 4. 更新/插入用户任务记录
        let now = new Date();
        if (userTask) {
            await query('UPDATE user_tree_tasks SET last_completed_at = ?, is_completed = 1 WHERE id = ?', [now, userTask.id]);
        } else {
            await query('INSERT INTO user_tree_tasks (user_id, task_code, last_completed_at, is_completed) VALUES (?, ?, ?, 1)', [user.user_id, task_code, now]);
        }

        // 5. 增加成长值
        let newGrowth = (tree.growth_val || 0) + task.growth_reward;
        if (newGrowth > 100) newGrowth = 100; // 上限 100

        // 6. 更新树状态
        let newStatus = tree.tree_status;
        if (newGrowth >= 100) {
            newStatus = '结果';
        } else if (newGrowth >= 40) {
            newStatus = '开花';
        } else {
            newStatus = '种植';
        }

        await query('UPDATE treeplant SET growth_val = ?, tree_status = ? WHERE plant_id = ?', [newGrowth, newStatus, tree.plant_id]);
       
        res.json(200, { msg: 'Task completed', growth_val: newGrowth, tree_status: newStatus, reward: task.growth_reward, task_icon: task.icon });

    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'System error' });
    }
});

// 收获/铲除
router.get('/got_tree', auth, async (req, res) => {
	let user = req.user;
	user = JSON.parse(JSON.stringify(user))[0];
	try {
		let results = await query(
			'SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0',
			[user.user_id],
		);
		if (results.length > 0) {
            let tree = results[0];
			if (tree.tree_status === '种植') {
                res.json(400, { msg: '树苗还在成长中，无法铲除或收获' });
            } else if (tree.tree_status === '开花') {
                 // 开花状态收获：只有原木
                 let logAmount = 10;
                 await query('UPDATE treeplant SET is_gotten = 1 WHERE user_id = ?', [user.user_id]);
                 bank.addAmount(user, 'log', logAmount);
                 res.end('已收获，获得原木 × ' + logAmount);
            } else {
                // 结果状态收获：原木 + 苹果
                 let logAmount = 10;
                 let appleAmount = Math.floor(1 + Math.random() * 3);
                 await query('UPDATE treeplant SET is_gotten = 1 WHERE user_id = ?', [user.user_id]);
                 bank.addAmount(user, 'log', logAmount);
                 bank.addAmount(user, 'apple', appleAmount);
                 res.end('已收获，获得原木 × ' + logAmount + ' 苹果 × ' + appleAmount);
            }
		} else {
			res.json(400, { msg: 'bad request' });
		}
	} catch (e) {
		console.log(e);
		res.json(400, { msg: 'bad request' });
	}
});

module.exports = router;
