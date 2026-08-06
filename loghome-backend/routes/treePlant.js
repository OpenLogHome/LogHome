
// 引入依赖包
let express = require('express');
let { query } = require('../sql.js');
let auth = require('../bin/auth.js');
let bank = require('../bin/bank.js');
let message = require('../bin/message.js');
let achievements = require('../bin/achievements.js');
let avatarFrames = require('../bin/avatarFrames.js');

// 创建路由对象
let router = express.Router();

const TREE_STATUS = {
    UNPLANTED: '未种植',
    GROWING: '种植',
    BLOOMING: '开花',
    FRUITING: '结果',
};

const DEFAULT_TREE_SCENE_THEME = 'oak_island';
const TREE_SCENE_THEME_KEYS = new Set([
    'oak_island',
    'birch_blossom',
    'snow_spruce',
    'sakura_grove',
    'savanna_acacia',
    'swamp_redwood',
]);

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
    steal_min_pending_reward: 3,
    steal_ratio: 0.35,
    steal_min_reward: 1,
    steal_max_reward: 8,
    steal_friend_limit: 18,
    steal_log_limit: 12,
    timezone: 'Asia/Shanghai',
};

const RANDOM_SPAWN_PROGRESS_CODE = '__exp_random_spawn__';
const BASE_TREE_HARVEST_LOG_REWARD = 5;
const TREE_MEMBERSHIP_MULTIPLIERS = Object.freeze({
    standard: 1.2,
    super: 2,
});

let expSchemaReady = null;
let expSchemaCheckAt = 0;
let stealSchemaReady = null;
let stealSchemaCheckAt = 0;
let treeNotificationSettingsSchemaReady = null;
let treeNotificationSettingsSchemaCheckAt = 0;
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

function toBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        return ['1', 'true', 'yes', 'on'].includes(normalized);
    }
    return false;
}

function randomIntInRange(min, max) {
    const lo = Math.floor(Math.min(min, max));
    const hi = Math.floor(Math.max(min, max));
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function calculateMembershipReward(baseReward, multiplier) {
    return Math.max(0, Math.round(toNumber(baseReward, 0) * toNumber(multiplier, 1)));
}

async function getTreeRewardBenefits(userId) {
    const rows = await query(
        `SELECT membership_type
         FROM membership_subscriptions
         WHERE user_id = ? AND status = 'active'
           AND starts_at <= NOW() AND expires_at > NOW()
         ORDER BY FIELD(membership_type, 'super', 'standard'), expires_at DESC
         LIMIT 1`,
        [Number(userId)]
    );
    const membershipType = rows[0]?.membership_type || '';
    const multiplier = TREE_MEMBERSHIP_MULTIPLIERS[membershipType] || 1;
    return {
        membership_type: membershipType,
        membership_name: membershipType === 'super'
            ? '超级原木通行证'
            : membershipType === 'standard' ? '原木通行证' : '普通用户',
        multiplier,
        active: multiplier > 1,
    };
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

function normalizeTreeSceneTheme(value) {
    const normalized = typeof value === 'string' ? value.trim() : '';
    if (!normalized || normalized === 'defaultTree') return DEFAULT_TREE_SCENE_THEME;
    return TREE_SCENE_THEME_KEYS.has(normalized) ? normalized : DEFAULT_TREE_SCENE_THEME;
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
        merged.steal_min_pending_reward = toPositiveInt(merged.steal_min_pending_reward, DEFAULT_EXP_SETTINGS.steal_min_pending_reward);
        merged.steal_ratio = Math.max(0.1, Math.min(0.9, Number(merged.steal_ratio || DEFAULT_EXP_SETTINGS.steal_ratio)));
        merged.steal_min_reward = toPositiveInt(merged.steal_min_reward, DEFAULT_EXP_SETTINGS.steal_min_reward);
        merged.steal_max_reward = toPositiveInt(merged.steal_max_reward, DEFAULT_EXP_SETTINGS.steal_max_reward);
        merged.steal_friend_limit = toPositiveInt(merged.steal_friend_limit, DEFAULT_EXP_SETTINGS.steal_friend_limit);
        merged.steal_log_limit = toPositiveInt(merged.steal_log_limit, DEFAULT_EXP_SETTINGS.steal_log_limit);
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

async function ensureTreeNotificationSettingsSchemaReady() {
    const now = Date.now();
    if (treeNotificationSettingsSchemaReady === true) return true;
    if (treeNotificationSettingsSchemaReady === false && now - treeNotificationSettingsSchemaCheckAt < 60 * 1000) return false;

    try {
        await query('SELECT user_id, notifications_disabled FROM user_tree_notification_settings LIMIT 1');
        treeNotificationSettingsSchemaReady = true;
    } catch (err) {
        if (!isTableMissingError(err)) {
            throw err;
        }

        try {
            await query(
                `CREATE TABLE IF NOT EXISTS user_tree_notification_settings (
                    user_id bigint(20) NOT NULL,
                    notifications_disabled tinyint(1) NOT NULL DEFAULT 0,
                    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    PRIMARY KEY (user_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
            );
            await query('SELECT user_id, notifications_disabled FROM user_tree_notification_settings LIMIT 1');
            treeNotificationSettingsSchemaReady = true;
        } catch (createErr) {
            console.log(createErr);
            treeNotificationSettingsSchemaReady = false;
        }
    }

    treeNotificationSettingsSchemaCheckAt = now;
    return treeNotificationSettingsSchemaReady;
}

async function getTreeNotificationSettings(userId) {
    const isReady = await ensureTreeNotificationSettingsSchemaReady();
    if (!isReady) {
        return {
            notifications_disabled: false,
            settings_available: false,
        };
    }

    const rows = await query(
        `SELECT notifications_disabled
         FROM user_tree_notification_settings
         WHERE user_id = ?
         LIMIT 1`,
        [userId]
    );

    return {
        notifications_disabled: rows.length > 0 ? toBoolean(rows[0].notifications_disabled) : false,
        settings_available: true,
    };
}

async function setTreeNotificationSettings(userId, disabled) {
    const isReady = await ensureTreeNotificationSettingsSchemaReady();
    if (!isReady) {
        throw new Error('tree notification settings schema is not ready');
    }

    const nextValue = disabled ? 1 : 0;
    await query(
        `INSERT INTO user_tree_notification_settings
         (user_id, notifications_disabled, created_at, updated_at)
         VALUES (?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
            notifications_disabled = VALUES(notifications_disabled),
            updated_at = NOW()`,
        [userId, nextValue]
    );

    return {
        notifications_disabled: !!nextValue,
        settings_available: true,
    };
}

async function sendTreePlantNotification(fromUserId, toUserId, content, routerPath = 'treePlant/treeplant') {
    const settings = await getTreeNotificationSettings(toUserId);
    if (settings.notifications_disabled) return false;

    await message.sendMsg(
        fromUserId,
        toUserId,
        content,
        routerPath,
        'notification',
        true
    );
    return true;
}

async function getActiveTree(userId) {
    const trees = await query('SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0', [userId]);
    if (!trees || trees.length === 0) return null;
    return trees[0];
}

async function getLatestTree(userId) {
    const rows = await query('SELECT * FROM treeplant WHERE user_id = ? ORDER BY plant_id DESC LIMIT 1', [userId]);
    if (!rows || rows.length === 0) return null;
    return rows[0];
}

function buildUnplantedTreePlaceholder(userId, latestTree = null) {
    const preferredTheme = normalizeTreeSceneTheme(latestTree && latestTree.treeType);
    return {
        plant_id: latestTree && latestTree.plant_id ? latestTree.plant_id : 0,
        user_id: userId,
        treeType: preferredTheme,
        tree_status: TREE_STATUS.UNPLANTED,
        growth_val: 0,
        max_growth: DEFAULT_EXP_SETTINGS.max_growth,
        plant_time: latestTree && latestTree.plant_time ? latestTree.plant_time : null,
        is_gotten: 1,
        tasks: [],
        exp_tasks: [],
        exp_orbs: [],
        exp_feature_enabled: false,
    };
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

async function ensureStealSchemaReady() {
    const expReady = await ensureExpSchemaReady();
    if (!expReady) return false;

    const now = Date.now();
    if (stealSchemaReady === true) return true;
    if (stealSchemaReady === false && now - stealSchemaCheckAt < 60 * 1000) return false;

    try {
        await query(
            'SELECT record_id, source_user_id, source_plant_id, target_user_id, target_plant_id, reward, date_key FROM tree_exp_steal_records LIMIT 1'
        );
        stealSchemaReady = true;
    } catch (err) {
        if (isTableMissingError(err)) {
            stealSchemaReady = false;
        } else {
            throw err;
        }
    }

    stealSchemaCheckAt = now;
    return stealSchemaReady;
}

function buildSqlPlaceholders(values) {
    return values.map(() => '?').join(',');
}

function calcStealRewardByPending(pendingReward, settings) {
    const totalPending = toNumber(pendingReward, 0);
    const threshold = toPositiveInt(settings.steal_min_pending_reward, DEFAULT_EXP_SETTINGS.steal_min_pending_reward);
    if (totalPending < threshold) return 0;

    const minReward = toPositiveInt(settings.steal_min_reward, DEFAULT_EXP_SETTINGS.steal_min_reward);
    const maxReward = toPositiveInt(settings.steal_max_reward, DEFAULT_EXP_SETTINGS.steal_max_reward);
    const ratio = Math.max(0.1, Math.min(0.9, Number(settings.steal_ratio || DEFAULT_EXP_SETTINGS.steal_ratio)));
    const rawReward = Math.floor(totalPending * ratio);
    const targetReward = rawReward > 0 ? rawReward : minReward;
    return Math.max(minReward, Math.min(maxReward, targetReward));
}

async function getPendingOrbStats(userId, plantId) {
    const rows = await query(
        `SELECT COUNT(*) AS pending_orb_count,
                COALESCE(SUM(reward), 0) AS pending_reward_total
         FROM tree_exp_orbs
         WHERE user_id = ?
           AND plant_id = ?
           AND status = 'pending'
           AND (expire_at IS NULL OR expire_at > NOW())`,
        [userId, plantId]
    );

    return {
        pending_orb_count: toNumber(rows?.[0]?.pending_orb_count, 0),
        pending_reward_total: toNumber(rows?.[0]?.pending_reward_total, 0),
    };
}

async function isMutualFriend(userId, targetUserId) {
    const rows = await query(
        `SELECT 1
         FROM user_follow f1
         INNER JOIN user_follow f2
            ON f1.follow_id = f2.user_id
           AND f2.follow_id = f1.user_id
         WHERE f1.user_id = ?
           AND f1.follow_id = ?
         LIMIT 1`,
        [userId, targetUserId]
    );
    return rows.length > 0;
}

async function getUserBasicInfo(userId) {
    const rows = await query(
        `SELECT user_id, name, avatar_url
         FROM users
         WHERE user_id = ?
         LIMIT 1`,
        [userId]
    );
    return rows.length > 0
        ? rows[0]
        : { user_id: userId, name: '好友', avatar_url: '' };
}

async function getTodayStealRecord(sourceUserId, targetUserId, dateKey) {
    const rows = await query(
        `SELECT record_id, reward, orb_count_affected
         FROM tree_exp_steal_records
         WHERE source_user_id = ?
           AND target_user_id = ?
           AND date_key = ?
         LIMIT 1`,
        [sourceUserId, targetUserId, dateKey]
    );
    return rows.length > 0 ? rows[0] : null;
}

function buildStealAllowance(pendingRewardTotal, alreadyStolenReward, settings) {
    const currentPendingReward = toNumber(pendingRewardTotal, 0);
    const todayStolenReward = toNumber(alreadyStolenReward, 0);
    const totalStealReward = calcStealRewardByPending(currentPendingReward + todayStolenReward, settings);
    return {
        total_steal_reward: totalStealReward,
        today_stolen_reward: todayStolenReward,
        remaining_steal_reward: Math.max(totalStealReward - todayStolenReward, 0),
    };
}

function buildVisitStealTip(context) {
    const threshold = toPositiveInt(context.threshold, DEFAULT_EXP_SETTINGS.steal_min_pending_reward);
    const pendingRewardTotal = toNumber(context.pending_reward_total, 0);
    const remainingStealReward = toNumber(context.remaining_steal_reward, 0);
    const todayStolenReward = toNumber(context.today_stolen_reward, 0);
    const pendingOrbCount = toPositiveInt(context.pending_orb_count, 0);

    if (!context.has_active_tree) {
        return '对方还没种树，先去别的好友树场看看。';
    }
    if (context.need_own_tree) {
        return '先种下自己的树苗，才能从好友树场顺走成长值。';
    }
    if (pendingOrbCount <= 0) {
        return todayStolenReward > 0
            ? '今天能偷的已经拿完了，对方树上也没有剩余经验球。'
            : '对方树上的经验球已经被收走了，换个好友看看。';
    }
    if (remainingStealReward <= 0) {
        return '今天在这个好友树场的偷取额度已经用完了，明天再来。';
    }
    if (pendingRewardTotal < threshold && todayStolenReward <= 0) {
        return `还差 ${Math.max(threshold - pendingRewardTotal, 0)} 点成长值才能开偷。`;
    }
    if (todayStolenReward > 0) {
        return `今天还可以继续顺走 ${remainingStealReward} 点成长值。`;
    }
    return `今天最多可顺走 ${remainingStealReward} 点成长值，点经验球也能手动偷取。`;
}

async function buildVisitTreeScene(viewerUserId, targetUserId, options = {}) {
    const settings = options.settings || await loadExpSettings();
    const dateKey = options.dateKey || getDateKeyByTimezone(settings.timezone);
    const myTree = Object.prototype.hasOwnProperty.call(options, 'myTree')
        ? options.myTree
        : await getActiveTree(viewerUserId);
    const targetTree = Object.prototype.hasOwnProperty.call(options, 'targetTree')
        ? options.targetTree
        : await getActiveTree(targetUserId);
    const targetUser = options.targetUser || await getUserBasicInfo(targetUserId);
    const targetAvatarFrame = await avatarFrames.getEffectiveAvatarFrame(targetUserId);

    if (!targetTree) {
        return {
            target_user_id: Number(targetUser.user_id || targetUserId),
            target_name: targetUser.name || '好友',
            target_avatar_url: targetUser.avatar_url || '',
            target_avatar_frame: targetAvatarFrame,
            has_active_tree: false,
            need_own_tree: !myTree,
            can_steal: false,
            pending_orb_count: 0,
            pending_reward_total: 0,
            total_steal_reward: 0,
            remaining_steal_reward: 0,
            today_stolen_reward: 0,
            steal_tip: buildVisitStealTip({
                has_active_tree: false,
                need_own_tree: !myTree,
                pending_orb_count: 0,
                pending_reward_total: 0,
                remaining_steal_reward: 0,
                today_stolen_reward: 0,
                threshold: settings.steal_min_pending_reward,
            }),
            tree: {
                ...buildUnplantedTreePlaceholder(targetUserId),
                treeType: DEFAULT_TREE_SCENE_THEME,
            },
        };
    }

    const expOrbs = Array.isArray(options.expOrbs)
        ? options.expOrbs
        : await getPendingOrbs(targetUserId, targetTree.plant_id);
    const pendingRewardTotal = expOrbs.reduce((sum, item) => sum + toNumber(item.reward, 0), 0);
    const existingRecord = Object.prototype.hasOwnProperty.call(options, 'existingRecord')
        ? options.existingRecord
        : await getTodayStealRecord(targetUserId, viewerUserId, dateKey);
    const allowance = buildStealAllowance(pendingRewardTotal, existingRecord?.reward, settings);
    const maxGrowth = toPositiveInt(settings.max_growth, DEFAULT_EXP_SETTINGS.max_growth);

    return {
        target_user_id: Number(targetUser.user_id || targetUserId),
        target_name: targetUser.name || '好友',
        target_avatar_url: targetUser.avatar_url || '',
        target_avatar_frame: targetAvatarFrame,
        has_active_tree: true,
        need_own_tree: !myTree,
        can_steal: !!myTree && allowance.remaining_steal_reward > 0 && expOrbs.length > 0,
        pending_orb_count: expOrbs.length,
        pending_reward_total: pendingRewardTotal,
        total_steal_reward: allowance.total_steal_reward,
        remaining_steal_reward: allowance.remaining_steal_reward,
        today_stolen_reward: allowance.today_stolen_reward,
        steal_tip: buildVisitStealTip({
            has_active_tree: true,
            need_own_tree: !myTree,
            pending_orb_count: expOrbs.length,
            pending_reward_total: pendingRewardTotal,
            remaining_steal_reward: allowance.remaining_steal_reward,
            today_stolen_reward: allowance.today_stolen_reward,
            threshold: settings.steal_min_pending_reward,
        }),
        tree: {
            ...targetTree,
            treeType: normalizeTreeSceneTheme(targetTree.treeType),
            tasks: [],
            exp_tasks: [],
            exp_orbs: expOrbs,
            max_growth: maxGrowth,
            exp_feature_enabled: true,
        },
    };
}

async function takeRewardFromOrb(userId, orb, rewardToTake) {
    const orbReward = toNumber(orb && orb.reward, 0);
    const actualTake = Math.min(orbReward, toNumber(rewardToTake, 0));
    if (actualTake <= 0) {
        return 0;
    }

    let updateRes = null;
    if (actualTake >= orbReward) {
        updateRes = await query(
            `UPDATE tree_exp_orbs
             SET status = 'collected', collected_at = NOW()
             WHERE orb_id = ?
               AND user_id = ?
               AND status = 'pending'
             LIMIT 1`,
            [orb.orb_id, userId]
        );
    } else {
        updateRes = await query(
            `UPDATE tree_exp_orbs
             SET reward = reward - ?
             WHERE orb_id = ?
               AND user_id = ?
               AND status = 'pending'
               AND reward >= ?
             LIMIT 1`,
            [actualTake, orb.orb_id, userId, actualTake]
        );
    }

    return toNumber(updateRes?.affectedRows, 0) > 0 ? actualTake : 0;
}

async function performStealAgainstFriend(user, targetUserId, options = {}) {
    const result = {
        ok: false,
        msg: 'System error',
    };

    const myTree = await getActiveTree(user.user_id);
    if (!myTree) {
        result.msg = '先种下自己的树苗，再去好友树场串门';
        return result;
    }

    const mutualFriend = await isMutualFriend(user.user_id, targetUserId);
    if (!mutualFriend) {
        result.msg = '只有互相关注的好友之间才能偷取';
        return result;
    }

    const settings = await loadExpSettings();
    const dateKey = getDateKeyByTimezone(settings.timezone);
    const targetTree = await getActiveTree(targetUserId);
    if (!targetTree) {
        result.msg = '对方还没种树，偷不到成长值';
        return result;
    }

    const targetUser = await getUserBasicInfo(targetUserId);
    const pendingOrbs = await getPendingOrbs(targetUserId, targetTree.plant_id);
    if (pendingOrbs.length === 0) {
        result.msg = '对方树上的经验球已经被收走了';
        return result;
    }

    const pendingRewardTotal = pendingOrbs.reduce((sum, item) => sum + toNumber(item.reward, 0), 0);
    const existingRecord = await getTodayStealRecord(targetUserId, user.user_id, dateKey);
    const allowance = buildStealAllowance(pendingRewardTotal, existingRecord?.reward, settings);
    const threshold = toPositiveInt(settings.steal_min_pending_reward, DEFAULT_EXP_SETTINGS.steal_min_pending_reward);

    if (allowance.total_steal_reward <= 0) {
        result.msg = `对方未收取成长值不足 ${threshold} 点，还偷不了`;
        return result;
    }
    if (allowance.remaining_steal_reward <= 0) {
        result.msg = '今天已经把这个好友能偷的都偷完了，明天再来吧';
        return result;
    }

    const preferredOrbId = toPositiveInt(options.orbId, 0);
    let actualReward = 0;
    let affectedOrbCount = 0;

    if (preferredOrbId) {
        const selectedOrb = pendingOrbs.find((item) => Number(item.orb_id) === preferredOrbId);
        if (!selectedOrb) {
            result.msg = '这个经验球已经被收走了';
            return result;
        }
        actualReward = await takeRewardFromOrb(targetUserId, selectedOrb, allowance.remaining_steal_reward);
        if (actualReward > 0) {
            affectedOrbCount = 1;
        }
    } else {
        let remainingReward = allowance.remaining_steal_reward;
        for (const orb of pendingOrbs) {
            if (remainingReward <= 0) break;
            const takenReward = await takeRewardFromOrb(targetUserId, orb, remainingReward);
            if (takenReward <= 0) continue;
            actualReward += takenReward;
            remainingReward -= takenReward;
            affectedOrbCount += 1;
        }
    }

    if (actualReward <= 0) {
        result.msg = '手慢了，成长值刚被对方收走';
        return result;
    }

    const growthResult = await applyGrowthReward(
        myTree,
        actualReward,
        toPositiveInt(settings.max_growth, DEFAULT_EXP_SETTINGS.max_growth)
    );
    myTree.growth_val = growthResult.growth_val;
    myTree.tree_status = growthResult.tree_status;

    if (existingRecord) {
        await query(
            `UPDATE tree_exp_steal_records
             SET reward = reward + ?,
                 orb_count_affected = orb_count_affected + ?,
                 updated_at = NOW()
             WHERE record_id = ?
             LIMIT 1`,
            [actualReward, affectedOrbCount, existingRecord.record_id]
        );
    } else {
        await query(
            `INSERT INTO tree_exp_steal_records
             (source_user_id, source_plant_id, target_user_id, target_plant_id, reward, orb_count_affected, date_key, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [targetUserId, targetTree.plant_id, user.user_id, myTree.plant_id, actualReward, affectedOrbCount, dateKey]
        );
        try {
            await sendTreePlantNotification(
                user.user_id,
                targetUserId,
                `${user.name || '一位好友'} 来树场串门，顺走了你 ${actualReward} 点成长值。`
            );
        } catch (notifyErr) {
            console.log(notifyErr);
        }
    }

    let dashboard = null;
    try {
        dashboard = await buildStealDashboard(user.user_id);
    } catch (dashboardErr) {
        console.log(dashboardErr);
    }

    let visitScene = null;
    try {
        visitScene = await buildVisitTreeScene(user.user_id, targetUserId, {
            myTree,
            targetTree,
            targetUser,
            settings,
            dateKey,
        });
    } catch (visitErr) {
        console.log(visitErr);
    }

    return {
        ok: true,
        msg: '偷取成功',
        reward: actualReward,
        target_user_id: Number(targetUser.user_id || targetUserId),
        target_name: targetUser.name || '好友',
        target_avatar_url: targetUser.avatar_url || '',
        growth_val: growthResult.growth_val,
        tree_status: growthResult.tree_status,
        steal_dashboard: dashboard,
        visit_scene: visitScene,
        affected_orb_count: affectedOrbCount,
    };
}

async function getMutualFriends(userId, limit) {
    return await query(
        `SELECT DISTINCT u.user_id, u.name, u.avatar_url, u.user_group, u.motto
         FROM user_follow f1
         INNER JOIN user_follow f2
            ON f1.follow_id = f2.user_id
           AND f2.follow_id = f1.user_id
         INNER JOIN users u
            ON u.user_id = f1.follow_id
         WHERE f1.user_id = ?
         ORDER BY u.user_id DESC
         LIMIT ?`,
        [userId, limit]
    );
}

async function getRecentStealLogs(userId, limit) {
    return await query(
        `SELECT r.record_id,
                r.reward,
                r.orb_count_affected,
                r.created_at,
                u.user_id AS thief_user_id,
                u.name AS thief_name,
                u.avatar_url AS thief_avatar_url
         FROM tree_exp_steal_records r
         LEFT JOIN users u
            ON u.user_id = r.target_user_id
         WHERE r.source_user_id = ?
         ORDER BY r.created_at DESC, r.record_id DESC
         LIMIT ?`,
        [userId, limit]
    );
}

async function buildStealDashboard(userId) {
    const ready = await ensureStealSchemaReady();
    if (!ready) {
        return {
            steal_feature_enabled: false,
            has_active_tree: false,
            can_be_stolen: false,
            my_pending_orb_count: 0,
            my_pending_reward_total: 0,
            can_steal_count: 0,
            today_i_stole_count: 0,
            today_i_stole_reward: 0,
            today_stolen_me_count: 0,
            today_stolen_me_reward: 0,
            steal_warn_threshold: DEFAULT_EXP_SETTINGS.steal_min_pending_reward,
            steal_targets: [],
            recent_steal_logs: [],
        };
    }

    const settings = await loadExpSettings();
    const threshold = toPositiveInt(settings.steal_min_pending_reward, DEFAULT_EXP_SETTINGS.steal_min_pending_reward);
    const dateKey = getDateKeyByTimezone(settings.timezone);
    const currentTree = await getActiveTree(userId);
    const selfPendingStats = currentTree
        ? await getPendingOrbStats(userId, currentTree.plant_id)
        : { pending_orb_count: 0, pending_reward_total: 0 };

    const todayIStoleRows = await query(
        `SELECT COUNT(*) AS steal_count, COALESCE(SUM(reward), 0) AS total_reward
         FROM tree_exp_steal_records
         WHERE target_user_id = ? AND date_key = ?`,
        [userId, dateKey]
    );
    const todayStolenMeRows = await query(
        `SELECT COUNT(*) AS steal_count, COALESCE(SUM(reward), 0) AS total_reward
         FROM tree_exp_steal_records
         WHERE source_user_id = ? AND date_key = ?`,
        [userId, dateKey]
    );

    const friendLimit = toPositiveInt(settings.steal_friend_limit, DEFAULT_EXP_SETTINGS.steal_friend_limit);
    const friends = await getMutualFriends(userId, friendLimit);
    let stealTargets = [];

    if (friends.length > 0) {
        const friendIds = friends.map((item) => item.user_id);
        const placeholders = buildSqlPlaceholders(friendIds);

        const activeTrees = await query(
            `SELECT user_id, plant_id, tree_status
             FROM treeplant
             WHERE is_gotten = 0
               AND user_id IN (${placeholders})`,
            friendIds
        );
        const pendingStatsRows = await query(
            `SELECT user_id,
                    plant_id,
                    COUNT(*) AS pending_orb_count,
                    COALESCE(SUM(reward), 0) AS pending_reward_total
             FROM tree_exp_orbs
             WHERE status = 'pending'
               AND (expire_at IS NULL OR expire_at > NOW())
               AND user_id IN (${placeholders})
             GROUP BY user_id, plant_id`,
            friendIds
        );
        const stolenTodayRows = await query(
            `SELECT source_user_id,
                    COUNT(*) AS steal_count,
                    COALESCE(SUM(reward), 0) AS total_reward,
                    MAX(created_at) AS last_steal_at
             FROM tree_exp_steal_records
             WHERE target_user_id = ?
               AND date_key = ?
               AND source_user_id IN (${placeholders})
             GROUP BY source_user_id`,
            [userId, dateKey, ...friendIds]
        );

        const treeMap = new Map(activeTrees.map((item) => [Number(item.user_id), item]));
        const pendingMap = new Map(pendingStatsRows.map((item) => [Number(item.user_id), item]));
        const stolenTodayMap = new Map(stolenTodayRows.map((item) => [Number(item.source_user_id), item]));
        const statusRank = { ready: 0, stolen_today: 1, not_ready: 2, no_tree: 3 };

        stealTargets = friends.map((friend) => {
            const friendId = Number(friend.user_id);
            const targetTree = treeMap.get(friendId);
            const pendingStats = pendingMap.get(friendId);
            const pendingRewardTotal = toNumber(pendingStats?.pending_reward_total, 0);
            const pendingOrbCount = toNumber(pendingStats?.pending_orb_count, 0);
            const stolenToday = stolenTodayMap.get(friendId);
            const todayStolenReward = toNumber(stolenToday?.total_reward, 0);
            const todayAlreadyStolen = todayStolenReward > 0;
            const allowance = buildStealAllowance(pendingRewardTotal, todayStolenReward, settings);
            const availableStealReward = allowance.remaining_steal_reward;

            let stealStatus = 'not_ready';
            let stealStatusText = '再等等';
            let stealTip = `还差 ${Math.max(threshold - pendingRewardTotal, 0)} 点成长值可偷`;

            if (!targetTree) {
                stealStatus = 'no_tree';
                stealStatusText = '未开种';
                stealTip = '对方还没种树，先去催他种下树苗';
            } else if (pendingOrbCount <= 0) {
                stealStatus = 'not_ready';
                stealStatusText = '已空树';
                stealTip = '这棵树上的经验球已经被收完了';
            } else if (availableStealReward > 0) {
                stealStatus = 'ready';
                stealStatusText = '串门';
                stealTip = todayAlreadyStolen
                    ? `今天还可以继续顺走 ${availableStealReward} 点成长值`
                    : `当前可顺走约 ${availableStealReward} 点成长值`;
            } else if (todayAlreadyStolen) {
                stealStatus = 'stolen_today';
                stealStatusText = '已偷完';
                stealTip = '今天在这位好友树场的偷取额度已经用完了';
            }

            return {
                user_id: friendId,
                name: friend.name || '好友',
                avatar_url: friend.avatar_url || '',
                user_group: friend.user_group,
                motto: friend.motto || '',
                has_active_tree: !!targetTree,
                tree_status: targetTree ? targetTree.tree_status : TREE_STATUS.UNPLANTED,
                pending_orb_count: pendingOrbCount,
                pending_reward_total: pendingRewardTotal,
                today_already_stolen: todayAlreadyStolen,
                today_stolen_reward: todayStolenReward,
                total_steal_reward: allowance.total_steal_reward,
                remaining_steal_reward: allowance.remaining_steal_reward,
                available_steal_reward: availableStealReward,
                can_steal: !!targetTree && pendingOrbCount > 0 && availableStealReward > 0,
                steal_status: stealStatus,
                steal_status_text: stealStatusText,
                steal_tip: stealTip,
            };
        }).sort((a, b) => {
            const statusDiff = (statusRank[a.steal_status] || 99) - (statusRank[b.steal_status] || 99);
            if (statusDiff !== 0) return statusDiff;
            if (b.pending_reward_total !== a.pending_reward_total) return b.pending_reward_total - a.pending_reward_total;
            return Number(b.user_id) - Number(a.user_id);
        });
    }

    const logLimit = toPositiveInt(settings.steal_log_limit, DEFAULT_EXP_SETTINGS.steal_log_limit);
    const recentStealLogs = await getRecentStealLogs(userId, logLimit);
    await avatarFrames.decorateRows(stealTargets, [
        { userIdField: 'user_id', targetField: 'avatar_frame' },
    ]);

    return {
        steal_feature_enabled: true,
        has_active_tree: !!currentTree,
        can_be_stolen: toNumber(selfPendingStats.pending_reward_total, 0) >= threshold,
        my_pending_orb_count: toNumber(selfPendingStats.pending_orb_count, 0),
        my_pending_reward_total: toNumber(selfPendingStats.pending_reward_total, 0),
        steal_warn_threshold: threshold,
        can_steal_count: stealTargets.filter((item) => item.can_steal).length,
        today_i_stole_count: toNumber(todayIStoleRows?.[0]?.steal_count, 0),
        today_i_stole_reward: toNumber(todayIStoleRows?.[0]?.total_reward, 0),
        today_stolen_me_count: toNumber(todayStolenMeRows?.[0]?.steal_count, 0),
        today_stolen_me_reward: toNumber(todayStolenMeRows?.[0]?.total_reward, 0),
        steal_targets: stealTargets,
        recent_steal_logs: recentStealLogs,
        today_date_key: dateKey,
    };
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

async function buildExpTaskStates(userId, settings, rewardBenefits = null) {
    const tasks = await loadExpTasks();
    if (tasks.length === 0) return [];
    const benefits = rewardBenefits || await getTreeRewardBenefits(userId);

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
            base_exp_reward: task.exp_reward,
            reward_multiplier: benefits.multiplier,
            exp_reward: calculateMembershipReward(task.exp_reward, benefits.multiplier),
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

    const rewardBenefits = options.rewardBenefits || await getTreeRewardBenefits(userId);
    const expTasksBefore = await buildExpTaskStates(userId, settings, rewardBenefits);
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
            reward_benefits: rewardBenefits,
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
            reward_multiplier: rewardBenefits.multiplier,
        });
    }

    let growthResult = defaultGrowth;
    if (totalReward > 0) {
        growthResult = await applyGrowthReward(tree, totalReward, maxGrowth);
        tree.growth_val = growthResult.growth_val;
        tree.tree_status = growthResult.tree_status;
    }

    const expTasks = await buildExpTaskStates(userId, settings, rewardBenefits);
    return {
        ok: true,
        has_active_tree: true,
        total_reward: totalReward,
        settled_tasks: settledTasks,
        exp_tasks: expTasks,
        reward_benefits: rewardBenefits,
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
        const rewardBenefits = await getTreeRewardBenefits(user.user_id);
        let trees = await query(
            'SELECT * FROM treeplant WHERE user_id = ? AND is_gotten = 0',
            [user.user_id],
        );

        if (trees.length === 0) {
            const latestTree = await getLatestTree(user.user_id);
            res.end(JSON.stringify([{
                ...buildUnplantedTreePlaceholder(user.user_id, latestTree),
                reward_benefits: rewardBenefits,
            }]));
            return;
        }

        let tree = trees[0];
        tree.treeType = normalizeTreeSceneTheme(tree.treeType);

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
                base_growth_reward: toNumber(task.growth_reward, 0),
                reward_multiplier: rewardBenefits.multiplier,
                growth_reward: calculateMembershipReward(task.growth_reward, rewardBenefits.multiplier),
                status: status
            };
        });

        tree.tasks = tasksWithStatus;
        tree.growth_val = tree.growth_val || 0;

        const expReady = await ensureExpSchemaReady();
        if (expReady) {
            const expSettings = await loadExpSettings();
            const settleResult = await settleExpTaskRewards(user.user_id, tree, expSettings, { rewardBenefits });
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

        tree.reward_benefits = rewardBenefits;

        res.end(JSON.stringify([tree]));
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'bad request' });
    }
});

router.get('/notification_settings', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    try {
        const settings = await getTreeNotificationSettings(user.user_id);
        res.json(200, settings);
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'bad request' });
    }
});

router.post('/notification_settings', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    try {
        const body = req.body || {};
        const hasNotificationsDisabled = Object.prototype.hasOwnProperty.call(body, 'notifications_disabled');
        const hasDisabled = Object.prototype.hasOwnProperty.call(body, 'disabled');
        const rawDisabled = hasNotificationsDisabled
            ? body.notifications_disabled
            : hasDisabled
                ? body.disabled
                : req.query?.notifications_disabled;
        const settings = await setTreeNotificationSettings(user.user_id, toBoolean(rawDisabled));
        res.json(200, settings);
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'bad request' });
    }
});

router.post('/set_tree_scene_theme', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    try {
        const nextTheme = normalizeTreeSceneTheme(req.body?.tree_type || req.query?.tree_type);
        const activeTree = await getActiveTree(user.user_id);

        if (activeTree) {
            await query(
                'UPDATE treeplant SET treeType = ? WHERE plant_id = ?',
                [nextTheme, activeTree.plant_id]
            );
            return res.json(200, {
                msg: 'ok',
                tree_type: nextTheme,
                has_active_tree: true,
            });
        }

        const latestTree = await getLatestTree(user.user_id);
        if (latestTree) {
            await query(
                'UPDATE treeplant SET treeType = ? WHERE plant_id = ?',
                [nextTheme, latestTree.plant_id]
            );
            return res.json(200, {
                msg: 'ok',
                tree_type: nextTheme,
                has_active_tree: false,
            });
        }

        await query(
            'INSERT INTO treeplant(treeType, user_id, tree_status, growth_val, is_gotten) VALUES(?, ?, ?, ?, 1)',
            [nextTheme, user.user_id, TREE_STATUS.UNPLANTED, 0]
        );

        return res.json(200, {
            msg: 'ok',
            tree_type: nextTheme,
            has_active_tree: false,
        });
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'bad request' });
    }
});

// 偷能量互动面板
router.get('/steal_dashboard', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    try {
        const dashboard = await buildStealDashboard(user.user_id);
        res.json(200, dashboard);
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'bad request' });
    }
});

router.get('/visit_friend_tree', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    const targetUserId = toPositiveInt(req.query?.target_user_id, 0);
    if (!targetUserId) {
        return res.json(400, { msg: '缺少目标好友' });
    }
    if (Number(targetUserId) === Number(user.user_id)) {
        return res.json(400, { msg: '不能串门到自己的树场' });
    }

    try {
        const ready = await ensureStealSchemaReady();
        if (!ready) {
            return res.json(400, { msg: '偷能量功能未初始化，请先执行数据库升级脚本' });
        }

        const mutualFriend = await isMutualFriend(user.user_id, targetUserId);
        if (!mutualFriend) {
            return res.json(400, { msg: '只有互相关注的好友之间才能串门' });
        }

        const targetTree = await getActiveTree(targetUserId);
        if (!targetTree) {
            return res.json(400, { msg: '对方还没种树，暂时没有可串门的树场' });
        }

        const scene = await buildVisitTreeScene(user.user_id, targetUserId);
        res.json(200, scene);
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'bad request' });
    }
});

// 从好友树场偷取未收成长值
router.post('/steal_friend_energy', auth, async (req, res) => {
    let user = req.user;
    user = JSON.parse(JSON.stringify(user))[0];

    const targetUserId = toPositiveInt(req.body?.target_user_id, 0);
    const orbId = toPositiveInt(req.body?.orb_id, 0);
    if (!targetUserId) {
        return res.json(400, { msg: '缺少目标好友' });
    }
    if (Number(targetUserId) === Number(user.user_id)) {
        return res.json(400, { msg: '不能偷自己的树场' });
    }

    try {
        const ready = await ensureStealSchemaReady();
        if (!ready) {
            return res.json(400, { msg: '偷能量功能未初始化，请先执行数据库升级脚本' });
        }
        const stealResult = await performStealAgainstFriend(user, targetUserId, { orbId });
        if (!stealResult.ok) {
            return res.json(400, { msg: stealResult.msg });
        }

        res.json(200, stealResult);
    } catch (e) {
        console.log(e);
        res.json(400, { msg: 'System error' });
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
            let nextTreeTheme = DEFAULT_TREE_SCENE_THEME;

            let lastTrees = await query(
                'SELECT * FROM treeplant WHERE user_id = ? ORDER BY plant_id DESC LIMIT 1',
                [user.user_id]
            );

            if (lastTrees.length > 0) {
                let lastTree = lastTrees[0];
                nextTreeTheme = normalizeTreeSceneTheme(lastTree.treeType);
                if (lastTree.growth_val > 100) {
                    initialGrowth = lastTree.growth_val - 100;
                    initialStatus = calcTreeStatusByGrowth(initialGrowth);
                }
            }

            if (req.query.tree_type) {
                nextTreeTheme = normalizeTreeSceneTheme(req.query.tree_type);
            }

            let insertRes = await query(
                'INSERT INTO treeplant(treeType, user_id, tree_status, growth_val) VALUES(?, ?, ?, ?)',
                [nextTreeTheme, user.user_id, initialStatus, initialGrowth],
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
        const rewardBenefits = await getTreeRewardBenefits(user.user_id);
        const actualReward = calculateMembershipReward(task.growth_reward, rewardBenefits.multiplier);
        const growthResult = await applyGrowthReward(tree, actualReward, toPositiveInt(expSettings.max_growth, 100));

        res.json(200, {
            msg: 'Task completed',
            growth_val: growthResult.growth_val,
            tree_status: growthResult.tree_status,
            reward: actualReward,
            base_reward: toNumber(task.growth_reward, 0),
            reward_multiplier: rewardBenefits.multiplier,
            reward_benefits: rewardBenefits,
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
        const shouldRecordAchievementMetric = activity_type === 'read_seconds' || activity_type === 'write_seconds';
        if (shouldRecordAchievementMetric) {
            await achievements.recordMetricProgress(user.user_id, activity_type, deltaSeconds, {
                reason: '阅读/写作时长上报',
                suppressNotification: true,
            });
        }

        const ready = await ensureExpSchemaReady();
        if (!ready) {
            return res.json(200, {
                msg: shouldRecordAchievementMetric ? 'ok' : '经验球功能未初始化，请先执行数据库升级脚本',
                exp_tasks: [],
                settled_tasks: [],
                total_reward: 0,
                growth_val: 0,
                tree_status: null,
                has_active_tree: false,
            });
        }

        const settings = await loadExpSettings();
        const tasks = await loadExpTasks();

        const matchedTasks = tasks.filter((task) => task.source_code === activity_type);
        if (matchedTasks.length === 0) {
            return res.json(200, {
                msg: 'ok',
                exp_tasks: [],
                settled_tasks: [],
                total_reward: 0,
                growth_val: 0,
                tree_status: null,
                has_active_tree: false,
            });
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
                let logAmount = BASE_TREE_HARVEST_LOG_REWARD;
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
                let logAmount = BASE_TREE_HARVEST_LOG_REWARD;
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
