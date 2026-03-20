const { query } = require('../sql.js');
const message = require('./message.js');

const CREATE_ACHIEVEMENT_DEFINITIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS achievement_definitions (
	achievement_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	achievement_key VARCHAR(64) NOT NULL,
	title VARCHAR(64) NOT NULL,
	description VARCHAR(255) NOT NULL DEFAULT '',
	badge_image_url VARCHAR(512) NOT NULL DEFAULT '',
	badge_shine TINYINT(1) NOT NULL DEFAULT 0,
	grant_mode ENUM('official_manual', 'official_auto') NOT NULL DEFAULT 'official_manual',
	is_selectable TINYINT(1) NOT NULL DEFAULT 1,
	is_hidden TINYINT(1) NOT NULL DEFAULT 0,
	sort_order INT NOT NULL DEFAULT 0,
	is_enabled TINYINT(1) NOT NULL DEFAULT 1,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (achievement_id),
	UNIQUE KEY uniq_achievement_key (achievement_key),
	KEY idx_mode_enabled_sort (grant_mode, is_enabled, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Achievement definitions';
`;

const CREATE_USER_ACHIEVEMENTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS user_achievements (
	user_achievement_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	user_id BIGINT UNSIGNED NOT NULL,
	achievement_id BIGINT UNSIGNED NOT NULL,
	grant_source VARCHAR(32) NOT NULL DEFAULT 'official_manual',
	grant_reason VARCHAR(255) NOT NULL DEFAULT '',
	granted_by_user_id BIGINT UNSIGNED DEFAULT NULL,
	granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (user_achievement_id),
	UNIQUE KEY uniq_user_achievement (user_id, achievement_id),
	KEY idx_user_granted_at (user_id, granted_at),
	KEY idx_achievement_user (achievement_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User unlocked achievements';
`;

const CREATE_USER_BADGE_SHOWCASE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS user_badge_showcase (
	user_id BIGINT UNSIGNED NOT NULL,
	achievement_id BIGINT UNSIGNED NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (user_id),
	KEY idx_achievement_id (achievement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User selected badge';
`;

const DEFAULT_OFFICIAL_ACHIEVEMENTS = [
	{
		achievement_key: 'honor_foundation_member',
		title: '社区奠基人',
		description: '原木社区官方荣誉：社区奠基人',
		badge_image_url: '/static/rank/NO1.png',
		badge_shine: 1,
		grant_mode: 'official_manual',
		is_selectable: 1,
		is_hidden: 0,
		sort_order: 10,
	},
	{
		achievement_key: 'honor_community_guardian',
		title: '原木体验官',
		description: '原木社区官方荣誉：原木体验官',
		badge_image_url: '/static/rank/NO2.png',
		badge_shine: 1,
		grant_mode: 'official_manual',
		is_selectable: 1,
		is_hidden: 0,
		sort_order: 20,
	},
	{
		achievement_key: 'honor_special_honoree',
		title: '原木开拓者',
		description: '原木社区官方荣誉：原木开拓者',
		badge_image_url: '/static/rank/NO3.png',
		badge_shine: 0,
		grant_mode: 'official_manual',
		is_selectable: 1,
		is_hidden: 0,
		sort_order: 30,
	},
];

const LEGACY_USER_GROUP_MAPPINGS = [
	{
		group_name: '社区奠基人',
		achievement_key: 'honor_foundation_member',
	},
	{
		group_name: '原木体验官',
		achievement_key: 'honor_community_guardian',
	},
	{
		group_name: '原木开拓者',
		achievement_key: 'honor_special_honoree',
	},
];

let ensureTablePromise = null;

function toBool(value) {
	return Number(value) === 1;
}

function toInt(value, fallback = 0) {
	const n = Number(value);
	return Number.isFinite(n) ? Math.floor(n) : fallback;
}

function mapDefinitionRow(row) {
	if (!row) return null;
	return {
		achievement_id: toInt(row.achievement_id),
		achievement_key: row.achievement_key,
		title: row.title,
		description: row.description || '',
		badge_image_url: row.badge_image_url || '',
		badge_shine: toBool(row.badge_shine),
		grant_mode: row.grant_mode || 'official_manual',
		is_selectable: toBool(row.is_selectable),
		is_hidden: toBool(row.is_hidden),
		sort_order: toInt(row.sort_order),
	};
}

function mapGrantedRow(row) {
	const def = mapDefinitionRow(row);
	return {
		...def,
		granted_at: row.granted_at,
		grant_source: row.grant_source || '',
		grant_reason: row.grant_reason || '',
		granted_by_user_id:
			row.granted_by_user_id === null || row.granted_by_user_id === undefined
				? null
				: toInt(row.granted_by_user_id),
		is_selected: toBool(row.is_selected),
	};
}


async function getAchievementDefinitions(options = {}) {
	const officialOnly = options.officialOnly !== false;
	const params = [];
	let sql =
		'SELECT * FROM achievement_definitions WHERE is_enabled = 1';

	if (officialOnly) {
		sql += " AND grant_mode IN ('official_manual', 'official_auto')";
	}

	sql += ' ORDER BY sort_order ASC, achievement_id ASC';

	const rows = await query(sql, params);
	return rows.map(mapDefinitionRow);
}

async function getAchievementDefinitionById(achievementId, options = {}) {
	const rows = await query(
		'SELECT * FROM achievement_definitions WHERE achievement_id = ? AND is_enabled = 1 LIMIT 1',
		[achievementId],
	);
	return rows.length > 0 ? mapDefinitionRow(rows[0]) : null;
}

async function getAchievementDefinitionByKey(achievementKey, options = {}) {
	const rows = await query(
		'SELECT * FROM achievement_definitions WHERE achievement_key = ? AND is_enabled = 1 LIMIT 1',
		[achievementKey],
	);
	return rows.length > 0 ? mapDefinitionRow(rows[0]) : null;
}

async function getUserAchievements(userId) {
	
	const rows = await query(
		`SELECT
			d.achievement_id,
			d.achievement_key,
			d.title,
			d.description,
			d.badge_image_url,
			d.badge_shine,
			d.grant_mode,
			d.is_selectable,
			d.is_hidden,
			d.sort_order,
			ua.granted_at,
			ua.grant_source,
			ua.grant_reason,
			ua.granted_by_user_id,
			IF(s.user_id IS NULL, 0, 1) AS is_selected
		FROM user_achievements ua
		INNER JOIN achievement_definitions d ON d.achievement_id = ua.achievement_id
		LEFT JOIN user_badge_showcase s
			ON s.user_id = ua.user_id AND s.achievement_id = ua.achievement_id
		WHERE ua.user_id = ? AND d.is_enabled = 1
		ORDER BY ua.granted_at DESC, d.sort_order ASC, d.achievement_id ASC`,
		[userId],
	);
	return rows.map(mapGrantedRow);
}

async function getUserBadge(userId) {
	
	const rows = await query(
		`SELECT
			d.achievement_id,
			d.achievement_key,
			d.title,
			d.description,
			d.badge_image_url,
			d.badge_shine,
			d.grant_mode,
			d.is_selectable,
			d.is_hidden,
			d.sort_order,
			ua.granted_at
		FROM user_badge_showcase s
		INNER JOIN user_achievements ua
			ON ua.user_id = s.user_id AND ua.achievement_id = s.achievement_id
		INNER JOIN achievement_definitions d
			ON d.achievement_id = s.achievement_id AND d.is_enabled = 1
		WHERE s.user_id = ?
		LIMIT 1`,
		[userId],
	);

	if (rows.length === 0) {
		return null;
	}

	return {
		...mapDefinitionRow(rows[0]),
		granted_at: rows[0].granted_at,
	};
}

async function setUserBadge(userId, achievementId) {
	
	const normalizedId = toInt(achievementId, 0);

	if (!normalizedId) {
		await query('DELETE FROM user_badge_showcase WHERE user_id = ?', [userId]);
		return null;
	}

	const ownedRows = await query(
		`SELECT
			d.achievement_id,
			d.achievement_key,
			d.title,
			d.description,
			d.badge_image_url,
			d.badge_shine,
			d.grant_mode,
			d.is_selectable,
			d.is_hidden,
			d.sort_order,
			ua.granted_at
		FROM user_achievements ua
		INNER JOIN achievement_definitions d ON d.achievement_id = ua.achievement_id
		WHERE ua.user_id = ?
			AND ua.achievement_id = ?
			AND d.is_enabled = 1
			AND d.is_selectable = 1
		LIMIT 1`,
		[userId, normalizedId],
	);

	if (ownedRows.length === 0) {
		return null;
	}

	await query(
		`INSERT INTO user_badge_showcase (user_id, achievement_id)
		 VALUES (?, ?)
		 ON DUPLICATE KEY UPDATE achievement_id = VALUES(achievement_id)`,
		[userId, normalizedId],
	);

	return {
		...mapDefinitionRow(ownedRows[0]),
		granted_at: ownedRows[0].granted_at,
	};
}

async function grantAchievementToUser(payload) {
	

	const userId = toInt(payload.userId, 0);
	const achievementId = toInt(payload.achievementId, 0);
	const achievementKey = payload.achievementKey || '';
	const adminUserId = payload.adminUserId ? toInt(payload.adminUserId, 0) : null;
	const reason = String(payload.reason || '').slice(0, 255);

	if (!userId) {
		throw new Error('INVALID_USER_ID');
	}

	let definition = null;
	if (achievementId) {
		definition = await getAchievementDefinitionById(achievementId);
	} else if (achievementKey) {
		definition = await getAchievementDefinitionByKey(achievementKey);
	}

	if (!definition) {
		throw new Error('ACHIEVEMENT_NOT_FOUND');
	}

	const insertResult = await query(
		`INSERT IGNORE INTO user_achievements (
			user_id,
			achievement_id,
			grant_source,
			grant_reason,
			granted_by_user_id
		) VALUES (?, ?, 'official_manual', ?, ?)`,
		[userId, definition.achievement_id, reason, adminUserId || null],
	);

	const grantedNow = Number(insertResult.affectedRows || 0) > 0;

	if (grantedNow && definition.is_selectable) {
		await query(
			`INSERT INTO user_badge_showcase (user_id, achievement_id)
			SELECT ?, ?
			FROM DUAL
			WHERE NOT EXISTS (
				SELECT 1 FROM user_badge_showcase WHERE user_id = ?
			)`,
			[userId, definition.achievement_id, userId],
		);

		try {
			await message.sendMsg(
				adminUserId || -1,
				userId,
				`You unlocked official honor: ${definition.title}`,
				'users/achievements',
				'notification',
				true,
			);
		} catch (e) {
			// ignore notification errors to keep grant idempotent
		}
	}

	return {
		granted: grantedNow,
		already_granted: !grantedNow,
		achievement: definition,
	};
}

async function getUserAchievementSummary(userId) {
	
	const countRows = await query(
		'SELECT COUNT(*) AS total FROM user_achievements WHERE user_id = ?',
		[userId],
	);
	const totalUnlocked = toInt(countRows?.[0]?.total, 0);
	const selectedBadge = await getUserBadge(userId);
	const recent = await query(
		`SELECT
			d.achievement_id,
			d.achievement_key,
			d.title,
			d.description,
			d.badge_image_url,
			d.badge_shine,
			d.grant_mode,
			d.is_selectable,
			d.is_hidden,
			d.sort_order,
			ua.granted_at,
			ua.grant_source,
			ua.grant_reason,
			ua.granted_by_user_id,
			0 AS is_selected
		FROM user_achievements ua
		INNER JOIN achievement_definitions d ON d.achievement_id = ua.achievement_id
		WHERE ua.user_id = ? AND d.is_enabled = 1
		ORDER BY ua.granted_at DESC
		LIMIT 3`,
		[userId],
	);

	return {
		total_unlocked: totalUnlocked,
		selected_badge: selectedBadge,
		recent_unlocks: recent.map(mapGrantedRow),
	};
}

module.exports = {
	DEFAULT_OFFICIAL_ACHIEVEMENTS,
	LEGACY_USER_GROUP_MAPPINGS,
	getAchievementDefinitions,
	getUserAchievements,
	getUserAchievementSummary,
	getUserBadge,
	setUserBadge,
	grantAchievementToUser,
};
