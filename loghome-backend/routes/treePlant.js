
// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let bank = require('../bin/bank.js');

// 创建路由对象
let router = express.Router();

const TREE_STATUS = {
    UNPLANTED: '未种植',
    GROWING: '种植',
    BLOOMING: '开花',
    FRUITING: '结果',
};

const DEFAULT_EXP_SETTINGS = {
    max_pending_orbs: 30,
    collect_all_limit: 50,
    random_reward_min: 2,
    random_reward_max: 6,
    random_spawn_cooldown_seconds: 900,
    random_spawn_probability: 0.8,
    orb_expire_hours: 48,
    orb_pos_x_min: 22,
    orb_pos_x_max: 78,
    orb_pos_y_min: 16,
    orb_pos_y_max: 56,
    max_growth: 100,
    timezone: 'Asia/Shanghai',
};

const RANDOM_SPAWN_PROGRESS_CODE = '__exp_random_spawn__';

let expSchemaReady = null;
let expSchemaCheckAt = 0;
let expTasksCache = { data: [], ts: 0 };
let expSettingsCache = { data: DEFAULT_EXP_SETTINGS, ts: 0 };

function isSameDay(d1, d2) {
    if (!d1 || !d2) return false;
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function isTableMissingError(err) {
    if (!err) return false;
    return err.code === 'ER_NO_SUCH_TABLE' ||
        err.code === 'ER_BAD_FIELD_ERROR' ||
        /doesn't exist/i.test(String(err.message || ''));
}

function toPositiveInt(value, fallback) {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return fallback;
    return Math.floor(n);
}

function toNumber(value, fallback = 0) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return n;
}

function randomIntInRange(min, max) {
    const lo = Math.floor(Math.min(min, max));
    const hi = Math.floor(Math.max(min, max));
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function getDateKeyByTimezone(timezone) {
    try {
        const parts = new Intl.DateTimeFormat('en-CA', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).formatToParts(new Date());
        const year = parts.find((p) => p.type === 'year')?.value;
        const month = parts.find((p) => p.type === 'month')?.value;
        const day = parts.find((p) => p.type === 'day')?.value;
        if (year && month && day) {
            return `${year}-${month}-${day}`;
        }
    } catch (e) {
        // ignore
    }

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getNextDateKey(dateKey) {
    const d = new Date(`${dateKey}T00:00:00`);
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function calcTreeStatusByGrowth(growthValue) {
    const g = toNumber(growthValue, 0);
    if (g >= 100) return TREE_STATUS.FRUITING;
    if (g >= 40) return TREE_STATUS.BLOOMING;
    return TREE_STATUS.GROWING;
}

async function ensureExpSchemaReady() {
    const now = Date.now();
    if (expSchemaReady === true) return true;
    if (expSchemaReady === false && now - expSchemaCheckAt < 60 * 1000) return false;

    try {
        await query('SELECT task_code, task_name, source_code, required_value, daily_limit, exp_reward, is_enabled FROM tree_exp_tasks LIMIT 1');
        await query('SELECT setting_key, setting_value FROM tree_exp_settings LIMIT 1');
        await query('SELECT user_id, task_code, date_key, progress_value, completed_times FROM user_tree_exp_task_daily LIMIT 1');
        await query('SELECT orb_id, user_id, plant_id, reward, pos_x, pos_y, status, created_at FROM tree_exp_orbs LIMIT 1');
        expSchemaReady = true;
    } catch (err) {
        if (isTableMissingError(err)) {
            expSchemaReady = false;
        } else {
            throw err;
        }
    }

    expSchemaCheckAt = now;
    return expSchemaReady;
}

async function loadExpSettings(force = false) {
    const isReady = await ensureExpSchemaReady();
    if (!isReady) return DEFAULT_EXP_SETTINGS;

    if (!force && Date.now() - expSettingsCache.ts < 30 * 1000) {
        return expSettingsCache.data;
    }

    try {
        const rows = await query('SELECT setting_key, setting_value FROM tree_exp_settings');
        const merged = { ...DEFAULT_EXP_SETTINGS };

        for (const row of rows) {
            const key = row.setting_key;
            if (!key) continue;
            merged[key] = row.setting_value;
        }

        merged.max_pending_orbs = toPositiveInt(merged.max_pending_orbs, DEFAULT_EXP_SETTINGS.max_pending_orbs);
        merged.collect_all_limit = toPositiveInt(merged.collect_all_limit, DEFAULT_EXP_SETTINGS.collect_all_limit);
        merged.random_reward_min = toPositiveInt(merged.random_reward_min, DEFAULT_EXP_SETTINGS.random_reward_min);
        merged.random_reward_max = toPositiveInt(merged.random_reward_max, DEFAULT_EXP_SETTINGS.random_reward_max);
        merged.random_spawn_cooldown_seconds = toPositiveInt(merged.random_spawn_cooldown_seconds, DEFAULT_EXP_SETTINGS.random_spawn_cooldown_seconds);
        merged.random_spawn_probability = Math.max(0, Math.min(1, Number(merged.random_spawn_probability || DEFAULT_EXP_SETTINGS.random_spawn_probability)));
        merged.orb_expire_hours = toPositiveInt(merged.orb_expire_hours, DEFAULT_EXP_SETTINGS.orb_expire_hours);
        merged.orb_pos_x_min = toNumber(merged.orb_pos_x_min, DEFAULT_EXP_SETTINGS.orb_pos_x_min);
        merged.orb_pos_x_max = toNumber(merged.orb_pos_x_max, DEFAULT_EXP_SETTINGS.orb_pos_x_max);
        merged.orb_pos_y_min = toNumber(merged.orb_pos_y_min, DEFAULT_EXP_SETTINGS.orb_pos_y_min);
        merged.orb_pos_y_max = toNumber(merged.orb_pos_y_max, DEFAULT_EXP_SETTINGS.orb_pos_y_max);
        merged.max_growth = toPositiveInt(merged.max_growth, DEFAULT_EXP_SETTINGS.max_growth);
        merged.timezone = String(merged.timezone || DEFAULT_EXP_SETTINGS.timezone);

        expSettingsCache = { data: merged, ts: Date.now() };
        return merged;
    } catch (err) {
        if (isTableMissingError(err)) {
            expSchemaReady = false;
            expSchemaCheckAt = Date.now();
            return DEFAULT_EXP_SETTINGS;
        }
        throw err;
    }
}

async function loadExpTasks(force = false) {
    const isReady = await ensureExpSchemaReady();
    if (!isReady) return [];

    if (!force && Date.now() - expTasksCache.ts < 30 * 1000) {
        return expTasksCache.data;
    }

    try {
        const rows = await query(
            `SELECT task_code, task_name, task_desc, source_code, required_value, daily_limit, exp_reward, icon, is_enabled
             FROM tree_exp_tasks
             WHERE is_enabled = 1
             ORDER BY sort_order ASC, task_id ASC`
        );

        const tasks = rows.map((item) => ({
            task_code: item.task_code,
            task_name: item.task_name,
            task_desc: item.task_desc || '',
            source_code: item.source_code,
            required_value: toPositiveInt(item.required_value, 1),
            daily_limit: toPositiveInt(item.daily_limit, 1),
            exp_reward: toPositiveInt(item.exp_reward, 1),
            icon: item.icon || '',
        }));

        expTasksCache = { data: tasks, ts: Date.now() };
        return tasks;
    } catch (err) {
        if (isTableMissingError(err)) {
            expSchemaReady = false;
            expSchemaCheckAt = Date.now();
            return [];
        }
        throw err;
    }
}

async function getActiveTree(userId) {
    const trees = await query('SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0', [userId]);
    if (!trees || trees.length === 0) return null;
    return trees[0];
}

async function applyGrowthReward(tree, reward, maxGrowth) {
    const currentGrowth = toNumber(tree.growth_val, 0);
    const rewardVal = toNumber(reward, 0);
    const newGrowth = currentGrowth + rewardVal;
    const newStatus = calcTreeStatusByGrowth(newGrowth);

    await query(
        'UPDATE treeplant SET growth_val = ?, tree_status = ? WHERE plant_id = ?',
        [newGrowth, newStatus, tree.plant_id]
    );

    return {
        growth_val: newGrowth,
        tree_status: newStatus,
        max_growth: maxGrowth,
    };
}

async function expireOverdueOrbs(userId) {
    await query(
        `UPDATE tree_exp_orbs
         SET status = 'expired'
         WHERE user_id = ?
           AND status = 'pending'
           AND expire_at IS NOT NULL
           AND expire_at <= NOW()`,
        [userId]
    );
}

async function getPendingOrbs(userId, plantId) {
    await expireOverdueOrbs(userId);
    const rows = await query(
        `SELECT orb_id, reward, pos_x, pos_y, source_task_code, spawn_type, created_at
         FROM tree_exp_orbs
         WHERE user_id = ?
           AND plant_id = ?
           AND status = 'pending'
         ORDER BY orb_id ASC`,
        [userId, plantId]
    );

    return rows.map((row) => ({
        orb_id: row.orb_id,
        reward: toPositiveInt(row.reward, 1),
        pos_x: toNumber(row.pos_x, 50),
        pos_y: toNumber(row.pos_y, 50),
        source_task_code: row.source_task_code,
        spawn_type: row.spawn_type,
        created_at: row.created_at,
    }));
}

function buildExpProgressText(task, progressValue) {
    if (task.source_code === 'read_seconds' || task.source_code === 'write_seconds') {
        const cur = Math.floor(progressValue / 60);
        const req = Math.max(1, Math.floor(task.required_value / 60));
        return `${cur}/${req} 分钟`;
    }
    return `${progressValue}/${task.required_value}`;
}

async function getExpProgressRows(userId, dateKey, taskCodes) {
    if (!taskCodes || taskCodes.length === 0) return [];
    return await query(
        `SELECT task_code, progress_value, completed_times
         FROM user_tree_exp_task_daily
         WHERE user_id = ? AND date_key = ? AND task_code IN (?)`,
        [userId, dateKey, taskCodes]
    );
}

async function getDailyCounters(userId, dateKey, tasks) {
    const counter = {};
    const needPost = tasks.some((t) => t.source_code === 'community_post');
    const needReply = tasks.some((t) => t.source_code === 'community_reply');

    if (!needPost && !needReply) {
        return counter;
    }

    const dayStart = `${dateKey} 00:00:00`;
    const dayEnd = `${getNextDateKey(dateKey)} 00:00:00`;

    if (needPost) {
        const rows = await query(
            `SELECT COUNT(*) AS count
             FROM comm_posts
             WHERE user_id = ?
               AND status = 1
               AND create_time >= ?
               AND create_time < ?`,
            [userId, dayStart, dayEnd]
        );
        counter.community_post = toNumber(rows?.[0]?.count, 0);
    }

    if (needReply) {
        const rows = await query(
            `SELECT COUNT(*) AS count
             FROM comm_comments
             WHERE user_id = ?
               AND status = 1
               AND create_time >= ?
               AND create_time < ?`,
            [userId, dayStart, dayEnd]
        );
        counter.community_reply = toNumber(rows?.[0]?.count, 0);
    }

    return counter;
}

async function buildExpTaskStates(userId, settings) {
    const tasks = await loadExpTasks();
    if (tasks.length === 0) return [];

    const dateKey = getDateKeyByTimezone(settings.timezone);
    const taskCodes = tasks.map((t) => t.task_code);
    const progressRows = await getExpProgressRows(userId, dateKey, taskCodes);
    const progressMap = new Map(progressRows.map((r) => [r.task_code, r]));
    const counters = await getDailyCounters(userId, dateKey, tasks);

    const states = [];

    for (const task of tasks) {
        const row = progressMap.get(task.task_code);
        let progressValue = toNumber(row?.progress_value, 0);

        if (task.source_code === 'community_post' || task.source_code === 'community_reply') {
            progressValue = toNumber(counters[task.source_code], 0);
        }

        const completedTimes = toNumber(row?.completed_times, 0);
        const maxAchievableTimes = Math.min(Math.floor(progressValue / task.required_value), task.daily_limit);
        const availableClaimTimes = Math.max(0, maxAchievableTimes - completedTimes);

        let status = 'pending';
        if (completedTimes >= task.daily_limit) {
            status = 'completed';
        } else if (availableClaimTimes > 0) {
            status = 'claimable';
        }

        states.push({
            task_code: task.task_code,
            task_name: task.task_name,
            task_desc: task.task_desc,
            icon: task.icon,
            source_code: task.source_code,
            required_value: task.required_value,
            daily_limit: task.daily_limit,
            exp_reward: task.exp_reward,
            progress_value: progressValue,
            completed_times: completedTimes,
            available_claim_times: availableClaimTimes,
            progress_text: buildExpProgressText(task, progressValue),
            status,
        });
    }

    return states;
}

function buildOrbPosition(settings) {
    return {
        x: randomIntInRange(settings.orb_pos_x_min, settings.orb_pos_x_max),
        y: randomIntInRange(settings.orb_pos_y_min, settings.orb_pos_y_max),
    };
}

function buildRandomOrbReward(settings) {
    const minR = toPositiveInt(settings.random_reward_min, 2);
    const maxR = toPositiveInt(settings.random_reward_max, 6);
    return randomIntInRange(minR, maxR);
}

async function createExpOrb(userId, plantId, reward, sourceTaskCode, spawnType, settings) {
    const pos = buildOrbPosition(settings);
    const expireAt = new Date(Date.now() + toPositiveInt(settings.orb_expire_hours, 48) * 3600 * 1000);

    const result = await query(
        `INSERT INTO tree_exp_orbs
         (user_id, plant_id, source_task_code, spawn_type, reward, pos_x, pos_y, status, expire_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())`,
        [userId, plantId, sourceTaskCode || null, spawnType || 'task', reward, pos.x, pos.y, expireAt]
    );

    return {
        orb_id: result.insertId,
        reward,
        pos_x: pos.x,
        pos_y: pos.y,
        source_task_code: sourceTaskCode || null,
        spawn_type: spawnType || 'task',
    };
}

async function upsertExpTaskDailyProgress(userId, taskCode, dateKey, progressValue, completedTimesDelta = 0) {
    const rows = await query(
        `SELECT id
         FROM user_tree_exp_task_daily
         WHERE user_id = ? AND task_code = ? AND date_key = ?
         LIMIT 1`,
        [userId, taskCode, dateKey]
    );

    if (rows.length > 0) {
        if (completedTimesDelta > 0) {
            await query(
                `UPDATE user_tree_exp_task_daily
                 SET completed_times = completed_times + ?,
                     progress_value = ?,
                     updated_at = NOW()
                 WHERE id = ?`,
                [completedTimesDelta, progressValue, rows[0].id]
            );
        } else {
            await query(
                `UPDATE user_tree_exp_task_daily
                 SET progress_value = ?,
                     updated_at = NOW()
                 WHERE id = ?`,
                [progressValue, rows[0].id]
            );
        }
    } else {
        await query(
            `INSERT INTO user_tree_exp_task_daily
             (user_id, task_code, date_key, progress_value, completed_times, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [userId, taskCode, dateKey, progressValue, completedTimesDelta]
        );
    }
}

async function settleExpTaskRewards(userId, tree, settings, options = {}) {
    const sourceCodes = Array.isArray(options.sourceCodes) ? options.sourceCodes.filter(Boolean) : [];
    const taskCodes = Array.isArray(options.taskCodes) ? options.taskCodes.filter(Boolean) : [];
    const sourceCodeSet = sourceCodes.length > 0 ? new Set(sourceCodes) : null;
    const taskCodeSet = taskCodes.length > 0 ? new Set(taskCodes) : null;
    const maxGrowth = toPositiveInt(settings.max_growth, 100);
    const defaultGrowth = {
        growth_val: tree ? toNumber(tree.growth_val, 0) : 0,
        tree_status: tree ? tree.tree_status : TREE_STATUS.UNPLANTED,
        max_growth: maxGrowth,
    };

    const expTasksBefore = await buildExpTaskStates(userId, settings);
    const matchedTasks = expTasksBefore.filter((task) => {
        const claimTimes = toNumber(task.available_claim_times, 0);
        if (claimTimes <= 0) return false;
        if (!sourceCodeSet && !taskCodeSet) return true;
        return (sourceCodeSet && sourceCodeSet.has(task.source_code)) ||
            (taskCodeSet && taskCodeSet.has(task.task_code));
    });

    if (!tree || matchedTasks.length === 0) {
        return {
            ok: true,
            has_active_tree: !!tree,
            total_reward: 0,
            settled_tasks: [],
            exp_tasks: expTasksBefore,
            ...defaultGrowth,
        };
    }

    const dateKey = getDateKeyByTimezone(settings.timezone);
    let totalReward = 0;
    const settledTasks = [];

    for (const task of matchedTasks) {
        const settleTimes = toPositiveInt(task.available_claim_times, 0);
        if (settleTimes <= 0) continue;

        await upsertExpTaskDailyProgress(
            userId,
            task.task_code,
            dateKey,
            toNumber(task.progress_value, 0),
            settleTimes
        );

        const reward = toPositiveInt(task.exp_reward, 0) * settleTimes;
        totalReward += reward;
        settledTasks.push({
            task_code: task.task_code,
            task_name: task.task_name,
            source_code: task.source_code,
            settled_times: settleTimes,
            reward,
        });
    }

    let growthResult = defaultGrowth;
    if (totalReward > 0) {
        growthResult = await applyGrowthReward(tree, totalReward, maxGrowth);
        tree.growth_val = growthResult.growth_val;
        tree.tree_status = growthResult.tree_status;
    }

    const expTasks = await buildExpTaskStates(userId, settings);
    return {
        ok: true,
        has_active_tree: true,
        total_reward: totalReward,
        settled_tasks: settledTasks,
        exp_tasks: expTasks,
        ...growthResult,
    };
}

async function getRandomSpawnProgress(userId, dateKey) {
    const rows = await query(
        `SELECT progress_value
         FROM user_tree_exp_task_daily
         WHERE user_id = ? AND task_code = ? AND date_key = ?
         LIMIT 1`,
        [userId, RANDOM_SPAWN_PROGRESS_CODE, dateKey]
    );

    return toNumber(rows?.[0]?.progress_value, 0);
}

async function setRandomSpawnProgress(userId, dateKey, nowTs) {
    const existing = await query(
        `SELECT id
         FROM user_tree_exp_task_daily
         WHERE user_id = ? AND task_code = ? AND date_key = ?
         LIMIT 1`,
        [userId, RANDOM_SPAWN_PROGRESS_CODE, dateKey]
    );

    if (existing.length > 0) {
        await query(
            `UPDATE user_tree_exp_task_daily
             SET progress_value = ?, updated_at = NOW()
             WHERE id = ?`,
            [nowTs, existing[0].id]
        );
    } else {
        await query(
            `INSERT INTO user_tree_exp_task_daily
             (user_id, task_code, date_key, progress_value, completed_times, created_at, updated_at)
             VALUES (?, ?, ?, ?, 0, NOW(), NOW())`,
            [userId, RANDOM_SPAWN_PROGRESS_CODE, dateKey, nowTs]
        );
    }
}

async function claimExpTask(userId, tree, taskCode, settings) {
    const tasks = await loadExpTasks();
    const task = tasks.find((item) => item.task_code === taskCode);
    if (!task) {
        return { ok: false, msg: '经验任务不存在或已禁用' };
    }

    const result = await settleExpTaskRewards(userId, tree, settings, { taskCodes: [taskCode] });
    if (result.total_reward <= 0) {
        return { ok: false, msg: '当前任务尚未达成自动结算条件' };
    }

    return {
        ok: true,
        reward: result.total_reward,
        exp_tasks: result.exp_tasks,
        growth_val: result.growth_val,
        tree_status: result.tree_status,
        settled_tasks: result.settled_tasks,
    };
}

async function incrementDurationProgress(userId, taskCode, deltaValue, settings) {
    if (deltaValue <= 0) return;

    const dateKey = getDateKeyByTimezone(settings.timezone);
    const rows = await query(
        `SELECT id
         FROM user_tree_exp_task_daily
         WHERE user_id = ? AND task_code = ? AND date_key = ?
         LIMIT 1`,
        [userId, taskCode, dateKey]
    );

    if (rows.length > 0) {
        await query(
            `UPDATE user_tree_exp_task_daily
             SET progress_value = progress_value + ?,
                 updated_at = NOW()
             WHERE id = ?`,
            [deltaValue, rows[0].id]
        );
    } else {
        await query(
            `INSERT INTO user_tree_exp_task_daily
             (user_id, task_code, date_key, progress_value, completed_times, created_at, updated_at)
             VALUES (?, ?, ?, ?, 0, NOW(), NOW())`,
            [userId, taskCode, dateKey, deltaValue]
        );
    }
}

// 获取树场信息（包含任务和经验球）
router.get('/get_treePlant_of', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];
    try {
        let trees = await query(
            'SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0',
            [user.user_id],
        );

        if (trees.length === 0) {
            res.end(JSON.stringify([]));
            return;
        }

        let tree = trees[0];

        let tasks = await query('SELECT * FROM tree_tasks ORDER BY task_id ASC');
        let userTasks = await query(
            'SELECT * FROM user_tree_tasks WHERE user_id = ?',
            [user.user_id]
        );

        let tasksWithStatus = tasks.map(task => {
            let userTask = userTasks.find(ut => ut.task_code === task.task_code);
            let status = 'pending';

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

        tree.tasks = tasksWithStatus;
        tree.growth_val = tree.growth_val || 0;

        const expReady = await ensureExpSchemaReady();
        if (expReady) {
            const expSettings = await loadExpSettings();
            const settleResult = await settleExpTaskRewards(user.user_id, tree, expSettings);
            tree.growth_val = settleResult.growth_val;
            tree.tree_status = settleResult.tree_status;
            tree.max_growth = settleResult.max_growth;
            tree.exp_orbs = await getPendingOrbs(user.user_id, tree.plant_id);
            tree.exp_tasks = settleResult.exp_tasks;
            tree.exp_feature_enabled = true;
        } else {
            tree.max_growth = 100;
            tree.exp_orbs = [];
            tree.exp_tasks = [];
            tree.exp_feature_enabled = false;
        }

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
            let initialGrowth = 0;
            let initialStatus = TREE_STATUS.GROWING;

            let lastTrees = await query(
                'SELECT * FROM treeplant WHERE user_id = ? ORDER BY plant_id DESC LIMIT 1',
                [user.user_id]
            );

            if (lastTrees.length > 0) {
                let lastTree = lastTrees[0];
                if (lastTree.growth_val > 100) {
                    initialGrowth = lastTree.growth_val - 100;
                    initialStatus = calcTreeStatusByGrowth(initialGrowth);
                }
            }

            let insertRes = await query(
                'INSERT INTO treeplant(treeType, user_id, tree_status, growth_val) VALUES(?, ?, ?, ?)',
                [req.query.tree_type, user.user_id, initialStatus, initialGrowth],
            );
            res.end(JSON.stringify(insertRes));
        }
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'bad request' });
    }
});

// 完成旧任务接口（保持兼容）
router.post('/do_task', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];
    let { task_code } = req.body;

    if (!task_code) {
        return res.json(400, { msg: 'Missing task_code' });
    }

    try {
        let trees = await query('SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0', [user.user_id]);
        if (trees.length === 0) {
            return res.json(400, { msg: 'No active tree' });
        }
        let tree = trees[0];

        let tasks = await query('SELECT * FROM tree_tasks WHERE task_code = ?', [task_code]);
        if (tasks.length === 0) {
            return res.json(400, { msg: 'Task not found' });
        }
        let task = tasks[0];

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

        let now = new Date();
        if (userTask) {
            await query('UPDATE user_tree_tasks SET last_completed_at = ?, is_completed = 1 WHERE id = ?', [now, userTask.id]);
        } else {
            await query('INSERT INTO user_tree_tasks (user_id, task_code, last_completed_at, is_completed) VALUES (?, ?, ?, 1)', [user.user_id, task_code, now]);
        }

        const expSettings = await loadExpSettings();
        const growthResult = await applyGrowthReward(tree, task.growth_reward, toPositiveInt(expSettings.max_growth, 100));

        res.json(200, {
            msg: 'Task completed',
            growth_val: growthResult.growth_val,
            tree_status: growthResult.tree_status,
            reward: task.growth_reward,
            task_icon: task.icon,
        });

    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'System error' });
    }
});

// 上报阅读/写作时长（供阅读器/写作器调用）
router.get('/exp_task_status', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    try {
        const ready = await ensureExpSchemaReady();
        if (!ready) {
            return res.json(200, { exp_feature_enabled: false, exp_tasks: [] });
        }

        const settings = await loadExpSettings();
        const expTasks = await buildExpTaskStates(user.user_id, settings);
        res.json(200, { exp_feature_enabled: true, exp_tasks: expTasks });
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'System error' });
    }
});

// 上报阅读/写作时长（供阅读器/写作器调用）
router.post('/report_exp_activity', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    const { activity_type, seconds } = req.body || {};
    const deltaSeconds = toPositiveInt(seconds, 0);

    if (!activity_type || deltaSeconds <= 0) {
        return res.json(400, { msg: '缺少有效参数' });
    }

    try {
        const ready = await ensureExpSchemaReady();
        if (!ready) {
            return res.json(400, { msg: '经验球功能未初始化，请先执行数据库升级脚本' });
        }

        const settings = await loadExpSettings();
        const tasks = await loadExpTasks();

        const matchedTasks = tasks.filter((task) => task.source_code === activity_type);
        if (matchedTasks.length === 0) {
            return res.json(400, { msg: '当前未配置该类经验任务' });
        }

        for (const task of matchedTasks) {
            await incrementDurationProgress(user.user_id, task.task_code, deltaSeconds, settings);
        }
        const tree = await getActiveTree(user.user_id);
        const settleResult = await settleExpTaskRewards(user.user_id, tree, settings, {
            sourceCodes: [activity_type],
        });

        res.json(200, {
            msg: 'ok',
            exp_tasks: settleResult.exp_tasks,
            settled_tasks: settleResult.settled_tasks,
            total_reward: settleResult.total_reward,
            growth_val: settleResult.growth_val,
            tree_status: settleResult.tree_status,
            has_active_tree: settleResult.has_active_tree,
        });
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'System error' });
    }
});

// 领取经验任务并刷新经验球
router.post('/settle_exp_tasks', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    const body = req.body || {};
    const sourceCodes = []
        .concat(body.source_code ? [body.source_code] : [])
        .concat(Array.isArray(body.source_codes) ? body.source_codes : []);
    const taskCodes = []
        .concat(body.task_code ? [body.task_code] : [])
        .concat(Array.isArray(body.task_codes) ? body.task_codes : []);

    try {
        const ready = await ensureExpSchemaReady();
        if (!ready) {
            return res.json(400, { msg: '经验球功能未初始化，请先执行数据库升级脚本' });
        }

        const settings = await loadExpSettings();
        const tree = await getActiveTree(user.user_id);
        const result = await settleExpTaskRewards(user.user_id, tree, settings, {
            sourceCodes,
            taskCodes,
        });

        res.json(200, {
            msg: 'ok',
            exp_tasks: result.exp_tasks,
            settled_tasks: result.settled_tasks,
            total_reward: result.total_reward,
            growth_val: result.growth_val,
            tree_status: result.tree_status,
            has_active_tree: result.has_active_tree,
        });
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'System error' });
    }
});

// 领取经验任务并刷新经验球
router.post('/claim_exp_task', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    const { task_code } = req.body || {};
    if (!task_code) {
        return res.json(400, { msg: '缺少 task_code' });
    }

    try {
        const ready = await ensureExpSchemaReady();
        if (!ready) {
            return res.json(400, { msg: '经验球功能未初始化，请先执行数据库升级脚本' });
        }

        const tree = await getActiveTree(user.user_id);
        if (!tree) {
            return res.json(400, { msg: 'No active tree' });
        }

        const settings = await loadExpSettings();
        const result = await claimExpTask(user.user_id, tree, task_code, settings);

        if (!result.ok) {
            return res.json(400, { msg: result.msg });
        }

        const expOrbs = await getPendingOrbs(user.user_id, tree.plant_id);

        res.json(200, {
            msg: '经验任务已自动结算',
            reward: result.reward,
            growth_val: result.growth_val,
            tree_status: result.tree_status,
            settled_tasks: result.settled_tasks,
            exp_tasks: result.exp_tasks,
            exp_orbs: expOrbs,
        });
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'System error' });
    }
});

// 随机刷新经验球（受冷却限制）
router.post('/refresh_exp_orb', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    try {
        const ready = await ensureExpSchemaReady();
        if (!ready) {
            return res.json(400, { msg: '经验球功能未初始化，请先执行数据库升级脚本' });
        }

        const tree = await getActiveTree(user.user_id);
        if (!tree) {
            return res.json(400, { msg: 'No active tree' });
        }

        const settings = await loadExpSettings();
        const dateKey = getDateKeyByTimezone(settings.timezone);
        const nowTs = Date.now();
        const cooldownMs = toPositiveInt(settings.random_spawn_cooldown_seconds, 900) * 1000;
        const lastTs = await getRandomSpawnProgress(user.user_id, dateKey);
        // Temporary opt-in bypass used by the mobile debug button.
        const shouldBypassCooldown =
            req.body &&
            (req.body.debug_bypass_cooldown === 1 ||
                req.body.debug_bypass_cooldown === '1' ||
                req.body.debug_bypass_cooldown === true);

        if (!shouldBypassCooldown && lastTs > 0 && nowTs - lastTs < cooldownMs) {
            const remainSeconds = Math.ceil((cooldownMs - (nowTs - lastTs)) / 1000);
            return res.json(400, { msg: `随机刷新冷却中，请 ${remainSeconds} 秒后再试` });
        }

        const pendingRows = await query(
            `SELECT COUNT(*) AS count
             FROM tree_exp_orbs
             WHERE user_id = ? AND plant_id = ? AND status = 'pending'`,
            [user.user_id, tree.plant_id]
        );
        const pendingCount = toNumber(pendingRows?.[0]?.count, 0);
        if (pendingCount >= toPositiveInt(settings.max_pending_orbs, 30)) {
            return res.json(400, { msg: '当前经验球过多，请先收集后再刷新' });
        }

        const reward = buildRandomOrbReward(settings);
        const orb = await createExpOrb(user.user_id, tree.plant_id, reward, null, 'random', settings);
        if (!shouldBypassCooldown) {
            await setRandomSpawnProgress(user.user_id, dateKey, nowTs);
        }

        const expOrbs = await getPendingOrbs(user.user_id, tree.plant_id);
        res.json(200, { msg: '随机刷新成功', orb, exp_orbs: expOrbs });
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'System error' });
    }
});

// 点击收集单个经验球
router.post('/collect_exp_orb', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    const { orb_id } = req.body || {};
    if (!orb_id) {
        return res.json(400, { msg: '缺少 orb_id' });
    }

    try {
        const ready = await ensureExpSchemaReady();
        if (!ready) {
            return res.json(400, { msg: '经验球功能未初始化，请先执行数据库升级脚本' });
        }

        const tree = await getActiveTree(user.user_id);
        if (!tree) {
            return res.json(400, { msg: 'No active tree' });
        }

        await expireOverdueOrbs(user.user_id);

        const rows = await query(
            `SELECT orb_id, reward
             FROM tree_exp_orbs
             WHERE orb_id = ? AND user_id = ? AND plant_id = ? AND status = 'pending'
             LIMIT 1`,
            [orb_id, user.user_id, tree.plant_id]
        );

        if (rows.length === 0) {
            return res.json(400, { msg: '经验球不存在或已被收集' });
        }

        const orb = rows[0];
        await query(
            `UPDATE tree_exp_orbs
             SET status = 'collected', collected_at = NOW()
             WHERE orb_id = ? AND user_id = ?`,
            [orb.orb_id, user.user_id]
        );

        const settings = await loadExpSettings();
        const growthResult = await applyGrowthReward(tree, orb.reward, toPositiveInt(settings.max_growth, 100));
        const expOrbs = await getPendingOrbs(user.user_id, tree.plant_id);

        res.json(200, {
            msg: '收集成功',
            reward: toPositiveInt(orb.reward, 1),
            growth_val: growthResult.growth_val,
            tree_status: growthResult.tree_status,
            exp_orbs: expOrbs,
        });
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'System error' });
    }
});

// 一键收集所有经验球
router.post('/collect_all_exp_orbs', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    try {
        const ready = await ensureExpSchemaReady();
        if (!ready) {
            return res.json(400, { msg: '经验球功能未初始化，请先执行数据库升级脚本' });
        }

        const tree = await getActiveTree(user.user_id);
        if (!tree) {
            return res.json(400, { msg: 'No active tree' });
        }

        await expireOverdueOrbs(user.user_id);

        const settings = await loadExpSettings();
        const collectLimit = toPositiveInt(settings.collect_all_limit, 50);

        const pending = await query(
            `SELECT orb_id, reward
             FROM tree_exp_orbs
             WHERE user_id = ? AND plant_id = ? AND status = 'pending'
             ORDER BY orb_id ASC
             LIMIT ?`,
            [user.user_id, tree.plant_id, collectLimit]
        );

        if (pending.length === 0) {
            return res.json(400, { msg: '暂无可收集经验球' });
        }

        const orbIds = pending.map((item) => item.orb_id);
        const totalReward = pending.reduce((sum, item) => sum + toPositiveInt(item.reward, 0), 0);

        const placeholders = orbIds.map(() => '?').join(',');
        await query(
            `UPDATE tree_exp_orbs
             SET status = 'collected', collected_at = NOW()
             WHERE user_id = ? AND orb_id IN (${placeholders})`,
            [user.user_id, ...orbIds]
        );

        const growthResult = await applyGrowthReward(tree, totalReward, toPositiveInt(settings.max_growth, 100));
        const expOrbs = await getPendingOrbs(user.user_id, tree.plant_id);

        res.json(200, {
            msg: '一键收集成功',
            collect_count: orbIds.length,
            total_reward: totalReward,
            growth_val: growthResult.growth_val,
            tree_status: growthResult.tree_status,
            exp_orbs: expOrbs,
        });
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
            if (tree.tree_status === TREE_STATUS.GROWING) {
                res.json(400, { msg: '树苗还在成长中，无法铲除或收获' });
            } else if (tree.tree_status === TREE_STATUS.BLOOMING) {
                let logAmount = 10;
                await query('UPDATE treeplant SET is_gotten = 1 WHERE user_id = ?', [user.user_id]);
                bank.addAmount(user, 'log', logAmount);

                if (await ensureExpSchemaReady()) {
                    await query(
                        `UPDATE tree_exp_orbs
                         SET status = 'expired', collected_at = NOW()
                         WHERE user_id = ? AND plant_id = ? AND status = 'pending'`,
                        [user.user_id, tree.plant_id]
                    );
                }

                res.end('已收获，获得原木 × ' + logAmount);
            } else {
                let logAmount = 10;
                let appleAmount = Math.floor(1 + Math.random() * 3);
                await query('UPDATE treeplant SET is_gotten = 1 WHERE user_id = ?', [user.user_id]);
                bank.addAmount(user, 'log', logAmount);
                bank.addAmount(user, 'apple', appleAmount);

                if (await ensureExpSchemaReady()) {
                    await query(
                        `UPDATE tree_exp_orbs
                         SET status = 'expired', collected_at = NOW()
                         WHERE user_id = ? AND plant_id = ? AND status = 'pending'`,
                        [user.user_id, tree.plant_id]
                    );
                }

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

