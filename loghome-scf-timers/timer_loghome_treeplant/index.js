let { query } = require('./sql.js');
let { sendMsg } = require('./message.js');

const TIMER_AUTO_SPAWN_PROGRESS_CODE = '__exp_timer_auto_spawn__';
const TIMER_PENDING_LIMIT_NOTICE_PREFIX = '__exp_timer_limit_notice__:';
const TIMER_PENDING_LIMIT_NOTICE_DATE_KEY = '1970-01-01';
const TIMER_PENDING_ORB_CAP = 5;
const TREEPLANT_MESSAGE_ROUTE = 'treePlant/treeplant';

const DEFAULT_EXP_SETTINGS = {
  max_pending_orbs: 30,
  random_reward_min: 2,
  random_reward_max: 6,
  random_spawn_cooldown_seconds: 900,
  random_spawn_probability: 0.8,
  orb_expire_hours: 48,
  orb_pos_x_min: 22,
  orb_pos_x_max: 78,
  orb_pos_y_min: 16,
  orb_pos_y_max: 56,
  timezone: 'Asia/Shanghai',
};

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

function pad2(value) {
  const str = String(value);
  return str.length >= 2 ? str : `0${str}`;
}

function getDatePart(parts, type) {
  if (!parts || !parts.length) return '';

  for (let i = 0; i < parts.length; i += 1) {
    if (parts[i] && parts[i].type === type) return parts[i].value;
  }

  return '';
}

function getFirstRowValue(rows, key) {
  if (!rows || !rows[0]) return undefined;
  return rows[0][key];
}

function randomIntInRange(min, max) {
  const lo = Math.floor(Math.min(min, max));
  const hi = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function getDateKeyByTimezone(timezone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    if (typeof formatter.formatToParts === 'function') {
      const parts = formatter.formatToParts(new Date());
      const year = getDatePart(parts, 'year');
      const month = getDatePart(parts, 'month');
      const day = getDatePart(parts, 'day');
      if (year && month && day) return `${year}-${month}-${day}`;
    }
  } catch (e) {
    // ignore
  }

  const now = new Date();
  const y = now.getFullYear();
  const m = pad2(now.getMonth() + 1);
  const d = pad2(now.getDate());
  return `${y}-${m}-${d}`;
}

function getPendingLimitNoticeTaskCode(plantId) {
  return `${TIMER_PENDING_LIMIT_NOTICE_PREFIX}${plantId}`;
}

async function ensureExpSchemaReady() {
  try {
    await query('SELECT task_code FROM tree_exp_tasks LIMIT 1');
    await query('SELECT setting_key FROM tree_exp_settings LIMIT 1');
    await query('SELECT id FROM user_tree_exp_task_daily LIMIT 1');
    await query('SELECT orb_id FROM tree_exp_orbs LIMIT 1');
    return true;
  } catch (err) {
    if (isTableMissingError(err)) return false;
    throw err;
  }
}

async function loadExpSettings() {
  const rows = await query('SELECT setting_key, setting_value FROM tree_exp_settings');
  const merged = Object.assign({}, DEFAULT_EXP_SETTINGS);

  for (const row of rows) {
    if (!row.setting_key) continue;
    merged[row.setting_key] = row.setting_value;
  }

  merged.max_pending_orbs = toPositiveInt(merged.max_pending_orbs, DEFAULT_EXP_SETTINGS.max_pending_orbs);
  merged.random_reward_min = toPositiveInt(merged.random_reward_min, DEFAULT_EXP_SETTINGS.random_reward_min);
  merged.random_reward_max = toPositiveInt(merged.random_reward_max, DEFAULT_EXP_SETTINGS.random_reward_max);
  merged.random_spawn_cooldown_seconds = toPositiveInt(merged.random_spawn_cooldown_seconds, DEFAULT_EXP_SETTINGS.random_spawn_cooldown_seconds);
  merged.random_spawn_probability = Math.max(0, Math.min(1, Number(merged.random_spawn_probability || DEFAULT_EXP_SETTINGS.random_spawn_probability)));
  merged.orb_expire_hours = toPositiveInt(merged.orb_expire_hours, DEFAULT_EXP_SETTINGS.orb_expire_hours);
  merged.orb_pos_x_min = toNumber(merged.orb_pos_x_min, DEFAULT_EXP_SETTINGS.orb_pos_x_min);
  merged.orb_pos_x_max = toNumber(merged.orb_pos_x_max, DEFAULT_EXP_SETTINGS.orb_pos_x_max);
  merged.orb_pos_y_min = toNumber(merged.orb_pos_y_min, DEFAULT_EXP_SETTINGS.orb_pos_y_min);
  merged.orb_pos_y_max = toNumber(merged.orb_pos_y_max, DEFAULT_EXP_SETTINGS.orb_pos_y_max);
  merged.timezone = String(merged.timezone || DEFAULT_EXP_SETTINGS.timezone);

  return merged;
}

async function expireOverdueOrbs() {
  await query(
    `UPDATE tree_exp_orbs
     SET status = 'expired'
     WHERE status = 'pending'
       AND expire_at IS NOT NULL
       AND expire_at <= NOW()`
  );
}

async function getLastAutoSpawnProgress(userId, dateKey) {
  const rows = await query(
    `SELECT progress_value
     FROM user_tree_exp_task_daily
     WHERE user_id = ? AND task_code = ? AND date_key = ?
     LIMIT 1`,
    [userId, TIMER_AUTO_SPAWN_PROGRESS_CODE, dateKey]
  );
  return toNumber(getFirstRowValue(rows, 'progress_value'), 0);
}

async function setLastAutoSpawnProgress(userId, dateKey, nowTs) {
  const rows = await query(
    `SELECT id
     FROM user_tree_exp_task_daily
     WHERE user_id = ? AND task_code = ? AND date_key = ?
     LIMIT 1`,
    [userId, TIMER_AUTO_SPAWN_PROGRESS_CODE, dateKey]
  );

  if (rows.length > 0) {
    await query(
      `UPDATE user_tree_exp_task_daily
       SET progress_value = ?, updated_at = NOW()
       WHERE id = ?`,
      [nowTs, rows[0].id]
    );
  } else {
    await query(
      `INSERT INTO user_tree_exp_task_daily
       (user_id, task_code, date_key, progress_value, completed_times, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, NOW(), NOW())`,
      [userId, TIMER_AUTO_SPAWN_PROGRESS_CODE, dateKey, nowTs]
    );
  }
}

async function hasPendingLimitNotice(userId, plantId) {
  const rows = await query(
    `SELECT id
     FROM user_tree_exp_task_daily
     WHERE user_id = ? AND task_code = ? AND date_key = ?
     LIMIT 1`,
    [userId, getPendingLimitNoticeTaskCode(plantId), TIMER_PENDING_LIMIT_NOTICE_DATE_KEY]
  );
  return rows.length > 0;
}

async function setPendingLimitNotice(userId, plantId, pendingCount) {
  await query(
    `INSERT INTO user_tree_exp_task_daily
     (user_id, task_code, date_key, progress_value, completed_times, created_at, updated_at)
     VALUES (?, ?, ?, ?, 0, NOW(), NOW())
     ON DUPLICATE KEY UPDATE progress_value = VALUES(progress_value), updated_at = NOW()`,
    [userId, getPendingLimitNoticeTaskCode(plantId), TIMER_PENDING_LIMIT_NOTICE_DATE_KEY, pendingCount]
  );
}

async function clearPendingLimitNotice(userId, plantId) {
  await query(
    `DELETE FROM user_tree_exp_task_daily
     WHERE user_id = ? AND task_code = ? AND date_key = ?`,
    [userId, getPendingLimitNoticeTaskCode(plantId), TIMER_PENDING_LIMIT_NOTICE_DATE_KEY]
  );
}

async function notifyPendingLimitReached(userId, plantId, pendingLimit, pendingCount) {
  const notified = await hasPendingLimitNotice(userId, plantId);
  if (notified) return false;

  const safePendingCount = toPositiveInt(pendingCount, pendingLimit);
  const content = `树场待收集经验球已经满啦！快来收集一下吧。`;

  try {
    await sendMsg(-1, userId, content, TREEPLANT_MESSAGE_ROUTE, 'notification', true);
    await setPendingLimitNotice(userId, plantId, safePendingCount);
    return true;
  } catch (err) {
    console.log(`Tree Plant Timer: failed to send pending-limit notice for user=${userId}, plant=${plantId}`, err);
    return false;
  }
}

async function tryAutoSpawnOrb(tree, settings) {
  const userId = tree.user_id;
  const plantId = tree.plant_id;
  const dateKey = getDateKeyByTimezone(settings.timezone);
  const nowTs = Date.now();
  const cooldownMs = toPositiveInt(settings.random_spawn_cooldown_seconds, 900) * 1000;
  const pendingLimit = Math.min(
    TIMER_PENDING_ORB_CAP,
    toPositiveInt(settings.max_pending_orbs, DEFAULT_EXP_SETTINGS.max_pending_orbs)
  );

  const pendingRows = await query(
    `SELECT COUNT(*) AS count
     FROM tree_exp_orbs
     WHERE user_id = ? AND plant_id = ? AND status = 'pending'`,
    [userId, plantId]
  );
  const pendingCount = toNumber(getFirstRowValue(pendingRows, 'count'), 0);

  if (pendingCount < pendingLimit) {
    await clearPendingLimitNotice(userId, plantId);
  }
  if (pendingCount >= pendingLimit) {
    await notifyPendingLimitReached(userId, plantId, pendingLimit, pendingCount);
    return { spawned: false, reason: 'pending_limit' };
  }

  const lastTs = await getLastAutoSpawnProgress(userId, dateKey);
  if (lastTs > 0 && nowTs - lastTs < cooldownMs) {
    return { spawned: false, reason: 'cooldown' };
  }

  const chance = Number(settings.random_spawn_probability || 0.8);
  if (Math.random() > chance) {
    await setLastAutoSpawnProgress(userId, dateKey, nowTs);
    return { spawned: false, reason: 'probability' };
  }

  const reward = randomIntInRange(settings.random_reward_min, settings.random_reward_max);
  const posX = randomIntInRange(settings.orb_pos_x_min, settings.orb_pos_x_max);
  const posY = randomIntInRange(settings.orb_pos_y_min, settings.orb_pos_y_max);
  const expireAt = new Date(nowTs + toPositiveInt(settings.orb_expire_hours, 48) * 3600 * 1000);

  await query(
    `INSERT INTO tree_exp_orbs
     (user_id, plant_id, source_task_code, spawn_type, reward, pos_x, pos_y, status, expire_at, created_at)
     VALUES (?, ?, NULL, 'auto_timer', ?, ?, ?, 'pending', ?, NOW())`,
    [userId, plantId, reward, posX, posY, expireAt]
  );

  const nextPendingCount = pendingCount + 1;
  if (nextPendingCount >= pendingLimit) {
    await notifyPendingLimitReached(userId, plantId, pendingLimit, nextPendingCount);
  }

  await setLastAutoSpawnProgress(userId, dateKey, nowTs);
  return { spawned: true };
}

async function updateTreeStatus() {
  const ready = await ensureExpSchemaReady();
  if (!ready) {
    console.log('Tree Plant Timer: exp schema not ready, skip auto spawn.');
    return { spawned: 0, scanned: 0, skipped: 'schema_not_ready' };
  }

  const settings = await loadExpSettings();
  await expireOverdueOrbs();

  const trees = await query('SELECT plant_id, user_id FROM treeplant WHERE is_gotten = 0');
  let spawned = 0;

  for (const tree of trees) {
    const result = await tryAutoSpawnOrb(tree, settings);
    if (result.spawned) spawned += 1;
  }

  console.log(`Tree Plant Timer: scanned=${trees.length}, spawned=${spawned}`);
  return { scanned: trees.length, spawned };
}

exports.main_handler = async (event, context, callback) => {
  try {
    const result = await updateTreeStatus();
    console.log('树场定时任务执行完毕。', result);
    event.result = 'success';
    event.detail = result;
  } catch (err) {
    console.log('树场定时任务执行失败:', err);
    event.result = 'failed';
    event.error = String(err && err.message ? err.message : err);
  }
  return event;
};
