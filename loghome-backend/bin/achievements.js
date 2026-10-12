const { query } = require('../sql.js');
const message = require('./message.js');

const ACHIEVEMENT_CATEGORIES = ['monthly_limited', 'official', 'growth'];
const ACHIEVEMENT_GRANT_TYPES = ['manual', 'rule_auto', 'rule_review'];
const ACHIEVEMENT_REPEAT_POLICIES = ['once', 'monthly', 'quarterly', 'yearly'];
const ACHIEVEMENT_PERIOD_TYPES = ['lifetime', 'month', 'quarter', 'year'];
const ACHIEVEMENT_COMPARATORS = ['>=', '>', '=', '<=', '<'];
const ACHIEVEMENT_TITLE_TERM_TYPES = ['adjective', 'noun'];
const METRIC_COLUMN_MAP = {
	read_seconds: 'read_seconds',
	write_seconds: 'write_seconds',
	community_post_count: 'community_post_count',
	comment_count: 'comment_count',
};

function toBool(value) {
	return Number(value) === 1 || value === true;
}

function toInt(value, fallback = 0) {
	const n = Number(value);
	return Number.isFinite(n) ? Math.floor(n) : fallback;
}

function toNumber(value, fallback = 0) {
	const n = Number(value);
	return Number.isFinite(n) ? n : fallback;
}

function safeJsonParse(value, fallback) {
	if (!value) return fallback;
	try {
		return JSON.parse(value);
	} catch (e) {
		return fallback;
	}
}

function formatDateKey(date = new Date()) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

function formatDateTimeValue(date) {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	const hh = String(date.getHours()).padStart(2, '0');
	const mm = String(date.getMinutes()).padStart(2, '0');
	const ss = String(date.getSeconds()).padStart(2, '0');
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

function padDateTime(value) {
	if (!value) return null;
	if (value instanceof Date) {
		return formatDateTimeValue(value);
	}
	const s = String(value).trim();
	if (!s) return null;
	if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s} 00:00:00`;
	if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(s)) return `${s}:00`;
	if (s.includes('T') || /Z$/i.test(s)) {
		const parsed = new Date(s);
		const formatted = formatDateTimeValue(parsed);
		if (formatted) return formatted;
	}
	return s;
}

function toDateTimeRange(value, mode) {
	const raw = padDateTime(value);
	if (!raw) return null;
	if (mode === 'end' && /^\d{4}-\d{2}-\d{2} 00:00:00$/.test(raw)) {
		return raw.replace('00:00:00', '23:59:59');
	}
	return raw;
}

function getPeriodRange(periodType, baseDate = new Date()) {
	const date = new Date(baseDate);
	const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	if (periodType === 'month') {
		const next = new Date(start.getFullYear(), start.getMonth() + 1, 1);
		return {
			startKey: formatDateKey(new Date(start.getFullYear(), start.getMonth(), 1)),
			endKey: formatDateKey(next),
		};
	}

	if (periodType === 'quarter') {
		const month = start.getMonth();
		const quarterMonth = Math.floor(month / 3) * 3;
		const next = new Date(start.getFullYear(), quarterMonth + 3, 1);
		return {
			startKey: formatDateKey(new Date(start.getFullYear(), quarterMonth, 1)),
			endKey: formatDateKey(next),
		};
	}

	if (periodType === 'year') {
		const next = new Date(start.getFullYear() + 1, 0, 1);
		return {
			startKey: formatDateKey(new Date(start.getFullYear(), 0, 1)),
			endKey: formatDateKey(next),
		};
	}

	return null;
}

function getValidDate(value, fallback = new Date()) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return fallback;
	return date;
}

function getDateOnly(value) {
	const date = getValidDate(value, null);
	if (!date) return null;
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
	const next = new Date(date);
	next.setDate(next.getDate() + days);
	return next;
}

function getAchievementMetricWindow(achievement) {
	if (!achievement) {
		return {
			startKey: null,
			endKey: null,
		};
	}

	const startDate = achievement.valid_from ? getDateOnly(achievement.valid_from) : null;
	const endDate = achievement.valid_to ? getDateOnly(achievement.valid_to) : null;

	return {
		startKey: startDate ? formatDateKey(startDate) : null,
		endKey: endDate ? formatDateKey(addDays(endDate, 1)) : null,
	};
}

function intersectDateKeyRanges(baseRange, limitRange) {
	const startKey = baseRange?.startKey && limitRange?.startKey
		? (baseRange.startKey > limitRange.startKey ? baseRange.startKey : limitRange.startKey)
		: (baseRange?.startKey || limitRange?.startKey || null);
	const endKey = baseRange?.endKey && limitRange?.endKey
		? (baseRange.endKey < limitRange.endKey ? baseRange.endKey : limitRange.endKey)
		: (baseRange?.endKey || limitRange?.endKey || null);

	if (startKey && endKey && startKey >= endKey) {
		return {
			startKey,
			endKey,
			isEmpty: true,
		};
	}

	return {
		startKey,
		endKey,
		isEmpty: false,
	};
}

function getConditionMetricRange(condition, baseDate = new Date(), achievement = null) {
	const periodType = normalizePeriodType(condition.period_type);
	const periodRange = periodType === 'lifetime'
		? { startKey: null, endKey: null }
		: getPeriodRange(periodType, baseDate);
	return intersectDateKeyRanges(periodRange, getAchievementMetricWindow(achievement));
}

function clampDateToAchievementWindow(baseDate, achievement) {
	const date = getValidDate(baseDate);
	if (!achievement) return date;

	const startTs = achievement.valid_from ? new Date(achievement.valid_from).getTime() : null;
	const endTs = achievement.valid_to ? new Date(achievement.valid_to).getTime() : null;
	const currentTs = date.getTime();

	if (Number.isFinite(startTs) && currentTs < startTs) {
		return new Date(startTs);
	}
	if (Number.isFinite(endTs) && currentTs > endTs) {
		return new Date(endTs);
	}
	return date;
}

function compareMetricValue(currentValue, comparator, thresholdValue) {
	const current = toNumber(currentValue, 0);
	const threshold = toNumber(thresholdValue, 0);
	if (comparator === '>') return current > threshold;
	if (comparator === '=') return current === threshold;
	if (comparator === '<=') return current <= threshold;
	if (comparator === '<') return current < threshold;
	return current >= threshold;
}

function calcProgressRatio(currentValue, thresholdValue) {
	const current = toNumber(currentValue, 0);
	const threshold = toNumber(thresholdValue, 0);
	if (threshold <= 0) return 1;
	return Math.max(0, Math.min(1, current / threshold));
}

function normalizeCategory(value) {
	return ACHIEVEMENT_CATEGORIES.includes(value) ? value : 'official';
}

function normalizeGrantType(value) {
	return ACHIEVEMENT_GRANT_TYPES.includes(value) ? value : 'manual';
}

function normalizeRepeatPolicy(value) {
	return ACHIEVEMENT_REPEAT_POLICIES.includes(value) ? value : 'once';
}

function normalizePeriodType(value) {
	return ACHIEVEMENT_PERIOD_TYPES.includes(value) ? value : 'lifetime';
}

function normalizeComparator(value) {
	return ACHIEVEMENT_COMPARATORS.includes(value) ? value : '>=';
}

function normalizeTitleTermType(value) {
	return ACHIEVEMENT_TITLE_TERM_TYPES.includes(value) ? value : '';
}

function normalizeTitleTermText(value) {
	const text = String(value || '').trim();
	return text ? text.slice(0, 64) : '';
}

function deriveLegacyGrantMode(grantType) {
	return grantType === 'manual' ? 'official_manual' : 'official_auto';
}

function formatSummaryNumber(value) {
	const n = toNumber(value, 0);
	if (Math.abs(n - Math.round(n)) < 0.0001) return String(Math.round(n));
	return String(Math.round(n * 100) / 100);
}

function formatSummaryDuration(seconds) {
	const totalSeconds = Math.max(0, Math.round(toNumber(seconds, 0)));
	if (totalSeconds >= 3600) {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.round((totalSeconds % 3600) / 60);
		if (minutes <= 0) return `${hours}小时`;
		return `${hours}小时${minutes}分钟`;
	}
	if (totalSeconds >= 60) {
		if (totalSeconds % 60 === 0) return `${totalSeconds / 60}分钟`;
		const minutes = Math.floor(totalSeconds / 60);
		const remainSeconds = totalSeconds % 60;
		return `${minutes}分钟${remainSeconds}秒`;
	}
	return `${formatSummaryNumber(totalSeconds)}秒`;
}

function formatSummaryMetric(metricCode) {
	const metricMap = {
		read_seconds: '阅读时长',
		write_seconds: '写作时长',
		community_post_count: '发帖数',
		comment_count: '评论数',
	};
	return metricMap[metricCode] || metricCode || '进度';
}

function formatSummaryPeriod(periodType) {
	const periodMap = {
		lifetime: '累计',
		month: '本月',
		quarter: '本季度',
		year: '本年',
	};
	return periodMap[periodType] || '累计';
}

function formatSummaryThreshold(metricCode, thresholdValue) {
	if (metricCode === 'read_seconds' || metricCode === 'write_seconds') {
		return formatSummaryDuration(thresholdValue);
	}
	if (metricCode === 'community_post_count' || metricCode === 'comment_count') {
		return `${formatSummaryNumber(thresholdValue)}次`;
	}
	return formatSummaryNumber(thresholdValue);
}

function buildConditionSummary(condition) {
	const periodText = formatSummaryPeriod(condition.period_type);
	const metricText = formatSummaryMetric(condition.metric_code);
	const thresholdText = formatSummaryThreshold(condition.metric_code, condition.threshold_value);
	const comparator = condition.comparator || '>=';

	if (comparator === '>') return `${periodText}${metricText}超过${thresholdText}`;
	if (comparator === '=') return `${periodText}${metricText}达到${thresholdText}`;
	if (comparator === '<=') return `${periodText}${metricText}不超过${thresholdText}`;
	if (comparator === '<') return `${periodText}${metricText}少于${thresholdText}`;
	return `${periodText}${metricText}达到${thresholdText}`;
}

function buildRuleSummary(ruleGroups) {
	const groups = Array.isArray(ruleGroups) ? ruleGroups : [];
	const fragments = [];

	for (const group of groups) {
		const conditions = Array.isArray(group.conditions) ? group.conditions : [];
		const conditionText = conditions
			.filter((item) => item && item.metric_code)
			.map(buildConditionSummary)
			.join('，且');
		if (conditionText) fragments.push(conditionText);
	}

	return fragments.join('，或').slice(0, 255);
}

function isLegacyRuleSummary(summary) {
	const text = String(summary || '').trim();
	if (!text) return false;
	return /(read_seconds|write_seconds|community_post_count|comment_count)\s*(>=|>|=|<=|<)\s*\d+(\.\d+)?\s*\((lifetime|month|quarter|year)\)/.test(text);
}

function shouldRegenerateRuleSummary(incomingSummary, existingAchievement) {
	const normalizedIncoming = String(incomingSummary || '').trim();
	if (!normalizedIncoming) return true;
	if (!existingAchievement) return false;

	const existingSummary = String(existingAchievement.rule_summary || '').trim();
	if (!existingSummary || normalizedIncoming !== existingSummary) {
		return false;
	}

	if (isLegacyRuleSummary(existingSummary)) {
		return true;
	}

	const generatedFromExistingRules = buildRuleSummary(existingAchievement.rule_groups || []);
	return !!generatedFromExistingRules && existingSummary === generatedFromExistingRules;
}

function mapDefinitionRow(row) {
	if (!row) return null;
	const achievementId = toInt(row.achievement_id);
	const titleTermType = normalizeTitleTermType(row.title_term_type);
	const titleTermText = normalizeTitleTermText(row.title_term_text);
	const titleTerm = titleTermType && titleTermText
		? {
			achievement_id: achievementId,
			type: titleTermType,
			text: titleTermText,
		}
		: null;
	return {
		achievement_id: achievementId,
		achievement_key: row.achievement_key,
		title: row.title,
		description: row.description || '',
		badge_image_url: row.badge_image_url || '',
		badge_shine: toBool(row.badge_shine),
		grant_mode: row.grant_mode || 'official_manual',
		category: normalizeCategory(row.category),
		grant_type: normalizeGrantType(row.grant_type),
		repeat_policy: normalizeRepeatPolicy(row.repeat_policy),
		valid_from: row.valid_from || null,
		valid_to: row.valid_to || null,
		rule_summary: row.rule_summary || '',
		title_term_type: titleTermType,
		title_term_text: titleTermText,
		title_term: titleTerm,
		is_selectable: toBool(row.is_selectable),
		is_hidden: toBool(row.is_hidden),
		sort_order: toInt(row.sort_order),
		is_enabled: toBool(row.is_enabled),
		created_by_user_id: row.created_by_user_id == null ? null : toInt(row.created_by_user_id),
		updated_by_user_id: row.updated_by_user_id == null ? null : toInt(row.updated_by_user_id),
		created_at: row.created_at || null,
		updated_at: row.updated_at || null,
	};
}

function mapRuleConditionRow(row) {
	return {
		condition_id: toInt(row.condition_id),
		group_id: toInt(row.group_id),
		metric_code: row.metric_code || '',
		aggregation: row.aggregation || 'sum',
		period_type: normalizePeriodType(row.period_type),
		comparator: normalizeComparator(row.comparator),
		threshold_value: toNumber(row.threshold_value, 0),
		filters_json: safeJsonParse(row.filters_json, null),
		sort_order: toInt(row.sort_order),
		is_enabled: toBool(row.is_enabled),
	};
}

function mapRuleGroupRow(row) {
	return {
		group_id: toInt(row.group_id),
		achievement_id: toInt(row.achievement_id),
		group_name: row.group_name || '',
		sort_order: toInt(row.sort_order),
		is_enabled: toBool(row.is_enabled),
		conditions: [],
	};
}

function mapGrantedRow(row) {
	const def = mapDefinitionRow(row);
	return {
		...def,
		granted_at: row.granted_at,
		grant_source: row.grant_source || '',
		grant_reason: row.grant_reason || '',
		granted_by_user_id: row.granted_by_user_id == null ? null : toInt(row.granted_by_user_id),
		is_selected: toBool(row.is_selected),
	};
}

function mapTitleTermChoice(item) {
	if (!item || !item.title_term) return null;
	return {
		achievement_id: toInt(item.achievement_id),
		achievement_key: item.achievement_key || '',
		type: item.title_term.type,
		text: item.title_term.text,
		achievement_title: item.title || '',
		badge_image_url: item.badge_image_url || '',
		badge_shine: toBool(item.badge_shine),
		granted_at: item.granted_at || null,
	};
}

function buildUserTitleText(adjectiveText, nounText) {
	return `${String(adjectiveText || '')}${String(nounText || '')}`.trim();
}

function createEmptyUserTitleProfile(userId = null) {
	return {
		user_id: userId == null ? null : toInt(userId),
		is_visible: false,
		adjective_achievement_id: null,
		noun_achievement_id: null,
		adjective_term: null,
		noun_term: null,
		preview_text: '',
		display_text: '',
		has_title: false,
	};
}

async function getAchievementRuleGroups(achievementId) {
	const groups = await query(
		`SELECT *
		 FROM achievement_rule_groups
		 WHERE achievement_id = ?
		 ORDER BY sort_order ASC, group_id ASC`,
		[achievementId],
	);

	if (groups.length === 0) return [];

	const mappedGroups = groups.map(mapRuleGroupRow);
	const groupIds = mappedGroups.map((item) => item.group_id);
	const conditions = await query(
		`SELECT *
		 FROM achievement_rule_conditions
		 WHERE group_id IN (?)
		 ORDER BY sort_order ASC, condition_id ASC`,
		[groupIds],
	);
	const conditionMap = new Map(mappedGroups.map((item) => [item.group_id, item]));
	for (const row of conditions) {
		const targetGroup = conditionMap.get(toInt(row.group_id));
		if (targetGroup) {
			targetGroup.conditions.push(mapRuleConditionRow(row));
		}
	}

	return mappedGroups;
}

async function getAchievementDefinitionById(achievementId, options = {}) {
	const includeDisabled = options.includeDisabled === true;
	const rows = await query(
		`SELECT *
		 FROM achievement_definitions
		 WHERE achievement_id = ? ${includeDisabled ? '' : 'AND is_enabled = 1'}
		 LIMIT 1`,
		[achievementId],
	);
	if (rows.length === 0) return null;
	const definition = mapDefinitionRow(rows[0]);
	if (options.includeRules) {
		definition.rule_groups = await getAchievementRuleGroups(definition.achievement_id);
	}
	return definition;
}

async function getAchievementDefinitionByKey(achievementKey, options = {}) {
	const includeDisabled = options.includeDisabled === true;
	const rows = await query(
		`SELECT *
		 FROM achievement_definitions
		 WHERE achievement_key = ? ${includeDisabled ? '' : 'AND is_enabled = 1'}
		 LIMIT 1`,
		[achievementKey],
	);
	if (rows.length === 0) return null;
	const definition = mapDefinitionRow(rows[0]);
	if (options.includeRules) {
		definition.rule_groups = await getAchievementRuleGroups(definition.achievement_id);
	}
	return definition;
}

async function getAchievementDefinitions(options = {}) {
	const officialOnly = options.officialOnly === true;
	const includeDisabled = options.includeDisabled === true;
	const categories = Array.isArray(options.categories) ? options.categories.filter(Boolean) : [];
	const keyword = String(options.keyword || '').trim();
	const params = [];
	const conditions = [];

	if (!includeDisabled) {
		conditions.push('is_enabled = 1');
	}

	if (officialOnly) {
		conditions.push('category = ?');
		params.push('official');
	}

	if (categories.length > 0) {
		conditions.push(`category IN (${categories.map(() => '?').join(',')})`);
		params.push(...categories);
	}

	if (keyword) {
		conditions.push('(title LIKE ? OR achievement_key LIKE ?)');
		params.push(`%${keyword}%`, `%${keyword}%`);
	}

	const sql = `
		SELECT *
		FROM achievement_definitions
		${conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''}
		ORDER BY sort_order ASC, achievement_id ASC
	`;
	const rows = await query(sql, params);
	return rows.map(mapDefinitionRow);
}

async function listAchievementDefinitions(options = {}) {
	const list = await getAchievementDefinitions({
		includeDisabled: options.includeDisabled,
		categories: options.categories,
		keyword: options.keyword,
	});

	if (list.length === 0) return [];

	const ids = list.map((item) => item.achievement_id);
	const ruleCounts = await query(
		`SELECT g.achievement_id, COUNT(c.condition_id) AS condition_count
		 FROM achievement_rule_groups g
		 LEFT JOIN achievement_rule_conditions c ON c.group_id = g.group_id AND c.is_enabled = 1
		 WHERE g.achievement_id IN (?) AND g.is_enabled = 1
		 GROUP BY g.achievement_id`,
		[ids],
	);
	const grantCounts = await query(
		`SELECT achievement_id, COUNT(*) AS grant_count
		 FROM user_achievements
		 WHERE achievement_id IN (?)
		 GROUP BY achievement_id`,
		[ids],
	);

	const ruleCountMap = new Map(ruleCounts.map((item) => [toInt(item.achievement_id), toInt(item.condition_count)]));
	const grantCountMap = new Map(grantCounts.map((item) => [toInt(item.achievement_id), toInt(item.grant_count)]));

	return list.map((item) => ({
		...item,
		rule_count: ruleCountMap.get(item.achievement_id) || 0,
		grant_count: grantCountMap.get(item.achievement_id) || 0,
	}));
}

async function getAchievementDetail(achievementId, options = {}) {
	const definition = await getAchievementDefinitionById(achievementId, {
		includeDisabled: options.includeDisabled,
		includeRules: true,
	});
	if (!definition) return null;
	return definition;
}

function normalizeRuleGroups(ruleGroups) {
	const groups = Array.isArray(ruleGroups) ? ruleGroups : [];
	return groups.map((group, groupIndex) => {
		const conditions = Array.isArray(group.conditions) ? group.conditions : [];
		return {
			group_name: String(group.group_name || group.name || `规则组${groupIndex + 1}`).slice(0, 64),
			sort_order: toInt(group.sort_order, groupIndex + 1),
			is_enabled: group.is_enabled === undefined ? true : toBool(group.is_enabled),
			conditions: conditions
				.filter((item) => item && item.metric_code)
				.map((item, conditionIndex) => ({
					metric_code: String(item.metric_code || ''),
					aggregation: String(item.aggregation || 'sum'),
					period_type: normalizePeriodType(item.period_type),
					comparator: normalizeComparator(item.comparator),
					threshold_value: toNumber(item.threshold_value, 0),
					filters_json: item.filters_json || null,
					sort_order: toInt(item.sort_order, conditionIndex + 1),
					is_enabled: item.is_enabled === undefined ? true : toBool(item.is_enabled),
				})),
		};
	}).filter((group) => group.conditions.length > 0);
}

function sanitizeAchievementPayload(payload, options = {}) {
	const grantType = normalizeGrantType(payload.grant_type);
	const normalizedRules = normalizeRuleGroups(payload.rule_groups);
	const manualRuleSummary = String(payload.rule_summary || '').trim();
	const resolvedRuleSummary = options.forceGeneratedRuleSummary || !manualRuleSummary
		? buildRuleSummary(normalizedRules)
		: manualRuleSummary;
	const titleTermType = normalizeTitleTermType(payload.title_term_type);
	const titleTermText = normalizeTitleTermText(payload.title_term_text);
	return {
		achievement_key: String(payload.achievement_key || '').trim(),
		title: String(payload.title || '').trim(),
		description: String(payload.description || '').trim(),
		badge_image_url: String(payload.badge_image_url || '').trim(),
		badge_shine: toBool(payload.badge_shine),
		category: normalizeCategory(payload.category),
		grant_type: grantType,
		repeat_policy: normalizeRepeatPolicy(payload.repeat_policy),
		valid_from: toDateTimeRange(payload.valid_from, 'start'),
		valid_to: toDateTimeRange(payload.valid_to, 'end'),
		rule_summary: resolvedRuleSummary.slice(0, 255),
		title_term_type: titleTermType || null,
		title_term_text: titleTermType && titleTermText ? titleTermText : null,
		is_selectable: payload.is_selectable === undefined ? true : toBool(payload.is_selectable),
		is_hidden: payload.is_hidden === undefined ? false : toBool(payload.is_hidden),
		sort_order: toInt(payload.sort_order, 0),
		is_enabled: payload.is_enabled === undefined ? true : toBool(payload.is_enabled),
		grant_mode: deriveLegacyGrantMode(grantType),
		rule_groups: normalizedRules,
	};
}

async function saveAchievementDefinition(payload, actorUserId) {
	const achievementId = toInt(payload.achievement_id, 0);
	const existingAchievement = achievementId
		? await getAchievementDetail(achievementId, { includeDisabled: true })
		: null;
	const data = sanitizeAchievementPayload(payload, {
		forceGeneratedRuleSummary: shouldRegenerateRuleSummary(payload.rule_summary, existingAchievement),
	});
	if (!data.title) {
		throw new Error('INVALID_ACHIEVEMENT_TITLE');
	}

	if (!data.achievement_key) {
		data.achievement_key = `achievement_${Date.now()}`;
	}

	if (achievementId) {
		await query(
			`UPDATE achievement_definitions
			 SET achievement_key = ?,
				 title = ?,
				 description = ?,
				 badge_image_url = ?,
				 badge_shine = ?,
				 grant_mode = ?,
				 category = ?,
				 grant_type = ?,
				 repeat_policy = ?,
				 valid_from = ?,
				 valid_to = ?,
				 rule_summary = ?,
				 title_term_type = ?,
				 title_term_text = ?,
				 is_selectable = ?,
				 is_hidden = ?,
				 sort_order = ?,
				 is_enabled = ?,
				 updated_by_user_id = ?
			 WHERE achievement_id = ?`,
			[
				data.achievement_key,
				data.title,
				data.description,
				data.badge_image_url,
				data.badge_shine ? 1 : 0,
				data.grant_mode,
				data.category,
				data.grant_type,
				data.repeat_policy,
				data.valid_from,
				data.valid_to,
				data.rule_summary,
				data.title_term_type,
				data.title_term_text,
				data.is_selectable ? 1 : 0,
				data.is_hidden ? 1 : 0,
				data.sort_order,
				data.is_enabled ? 1 : 0,
				actorUserId || null,
				achievementId,
			],
		);
		await query('DELETE FROM achievement_rule_conditions WHERE group_id IN (SELECT group_id FROM achievement_rule_groups WHERE achievement_id = ?)', [achievementId]);
		await query('DELETE FROM achievement_rule_groups WHERE achievement_id = ?', [achievementId]);
	} else {
		const result = await query(
			`INSERT INTO achievement_definitions (
				achievement_key,
				title,
				description,
				badge_image_url,
				badge_shine,
				grant_mode,
				category,
				grant_type,
				repeat_policy,
				valid_from,
				valid_to,
				rule_summary,
				title_term_type,
				title_term_text,
				is_selectable,
				is_hidden,
				sort_order,
				is_enabled,
				created_by_user_id,
				updated_by_user_id
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
			[
				data.achievement_key,
				data.title,
				data.description,
				data.badge_image_url,
				data.badge_shine ? 1 : 0,
				data.grant_mode,
				data.category,
				data.grant_type,
				data.repeat_policy,
				data.valid_from,
				data.valid_to,
				data.rule_summary,
				data.title_term_type,
				data.title_term_text,
				data.is_selectable ? 1 : 0,
				data.is_hidden ? 1 : 0,
				data.sort_order,
				data.is_enabled ? 1 : 0,
				actorUserId || null,
				actorUserId || null,
			],
		);
		payload.achievement_id = result.insertId;
	}

	const targetAchievementId = achievementId || toInt(payload.achievement_id, 0);
	for (const group of data.rule_groups) {
		const groupResult = await query(
			`INSERT INTO achievement_rule_groups (
				achievement_id,
				group_name,
				sort_order,
				is_enabled
			) VALUES (?, ?, ?, ?)`,
			[targetAchievementId, group.group_name, group.sort_order, group.is_enabled ? 1 : 0],
		);
		const groupId = groupResult.insertId;
		for (const condition of group.conditions) {
			await query(
				`INSERT INTO achievement_rule_conditions (
					group_id,
					metric_code,
					aggregation,
					period_type,
					comparator,
					threshold_value,
					filters_json,
					sort_order,
					is_enabled
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					groupId,
					condition.metric_code,
					condition.aggregation,
					condition.period_type,
					condition.comparator,
					condition.threshold_value,
					condition.filters_json ? JSON.stringify(condition.filters_json) : null,
					condition.sort_order,
					condition.is_enabled ? 1 : 0,
				],
			);
		}
	}

	return await getAchievementDetail(targetAchievementId, { includeDisabled: true });
}

async function setAchievementEnabled(achievementId, enabled, actorUserId) {
	await query(
		`UPDATE achievement_definitions
		 SET is_enabled = ?,
			 updated_by_user_id = ?
		 WHERE achievement_id = ?`,
		[enabled ? 1 : 0, actorUserId || null, achievementId],
	);
	return await getAchievementDefinitionById(achievementId, { includeDisabled: true });
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
			d.category,
			d.grant_type,
			d.repeat_policy,
			d.valid_from,
			d.valid_to,
			d.rule_summary,
			d.title_term_type,
			d.title_term_text,
			d.is_selectable,
			d.is_hidden,
			d.sort_order,
			d.is_enabled,
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
			d.*,
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
	if (rows.length === 0) return null;
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
			d.*,
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

	if (ownedRows.length === 0) return null;

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

async function getUserTitleTerms(userId) {
	const rows = await query(
		`SELECT
			d.achievement_id,
			d.achievement_key,
			d.title,
			d.description,
			d.badge_image_url,
			d.badge_shine,
			d.grant_mode,
			d.category,
			d.grant_type,
			d.repeat_policy,
			d.valid_from,
			d.valid_to,
			d.rule_summary,
			d.title_term_type,
			d.title_term_text,
			d.is_selectable,
			d.is_hidden,
			d.sort_order,
			d.is_enabled,
			ua.granted_at,
			ua.grant_source,
			ua.grant_reason,
			ua.granted_by_user_id,
			0 AS is_selected
		FROM user_achievements ua
		INNER JOIN achievement_definitions d ON d.achievement_id = ua.achievement_id
		WHERE ua.user_id = ?
			AND d.is_enabled = 1
			AND d.title_term_type IN ('adjective', 'noun')
			AND TRIM(IFNULL(d.title_term_text, '')) <> ''
		ORDER BY ua.granted_at DESC, d.sort_order ASC, d.achievement_id ASC`,
		[userId],
	);
	return rows
		.map(mapGrantedRow)
		.map((item) => ({
			...item,
			title_term: mapTitleTermChoice(item),
		}));
}

async function getUserTitleProfile(userId) {
	const normalizedUserId = toInt(userId, 0);
	const emptyProfile = createEmptyUserTitleProfile(normalizedUserId || null);
	if (!normalizedUserId) return emptyProfile;

	const rows = await query(
		`SELECT
			user_id,
			adjective_achievement_id,
			noun_achievement_id,
			is_visible
		FROM user_title_showcase
		WHERE user_id = ?
		LIMIT 1`,
		[normalizedUserId],
	);
	if (rows.length === 0) return emptyProfile;

	const titleTerms = await getUserTitleTerms(normalizedUserId);
	const termMap = new Map(titleTerms.map((item) => [item.achievement_id, item]));
	const adjectiveSource = termMap.get(toInt(rows[0].adjective_achievement_id, 0));
	const nounSource = termMap.get(toInt(rows[0].noun_achievement_id, 0));
	const adjectiveTerm = adjectiveSource && adjectiveSource.title_term && adjectiveSource.title_term.type === 'adjective'
		? adjectiveSource.title_term
		: null;
	const nounTerm = nounSource && nounSource.title_term && nounSource.title_term.type === 'noun'
		? nounSource.title_term
		: null;
	const previewText = buildUserTitleText(
		adjectiveTerm ? adjectiveTerm.text : '',
		nounTerm ? nounTerm.text : '',
	);
	const isVisible = toBool(rows[0].is_visible);

	return {
		user_id: normalizedUserId,
		is_visible: isVisible,
		adjective_achievement_id: adjectiveTerm ? adjectiveTerm.achievement_id : null,
		noun_achievement_id: nounTerm ? nounTerm.achievement_id : null,
		adjective_term: adjectiveTerm,
		noun_term: nounTerm,
		preview_text: previewText,
		display_text: isVisible ? previewText : '',
		has_title: !!previewText,
	};
}

async function setUserTitleShowcase(userId, payload = {}) {
	const normalizedUserId = toInt(userId, 0);
	if (!normalizedUserId) throw new Error('INVALID_USER_ID');

	const adjectiveAchievementId = toInt(payload.adjective_achievement_id, 0) || null;
	const nounAchievementId = toInt(payload.noun_achievement_id, 0) || null;
	const isVisible = toBool(payload.is_visible);
	const titleTerms = await getUserTitleTerms(normalizedUserId);
	const termMap = new Map(titleTerms.map((item) => [item.achievement_id, item]));

	if (adjectiveAchievementId) {
		const adjectiveTerm = termMap.get(adjectiveAchievementId);
		if (!adjectiveTerm || !adjectiveTerm.title_term || adjectiveTerm.title_term.type !== 'adjective') {
			throw new Error('INVALID_ADJECTIVE_TERM');
		}
	}

	if (nounAchievementId) {
		const nounTerm = termMap.get(nounAchievementId);
		if (!nounTerm || !nounTerm.title_term || nounTerm.title_term.type !== 'noun') {
			throw new Error('INVALID_NOUN_TERM');
		}
	}

	if (!adjectiveAchievementId && !nounAchievementId && !isVisible) {
		await query('DELETE FROM user_title_showcase WHERE user_id = ?', [normalizedUserId]);
		return createEmptyUserTitleProfile(normalizedUserId);
	}

	await query(
		`INSERT INTO user_title_showcase (
			user_id,
			adjective_achievement_id,
			noun_achievement_id,
			is_visible
		) VALUES (?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
			adjective_achievement_id = VALUES(adjective_achievement_id),
			noun_achievement_id = VALUES(noun_achievement_id),
			is_visible = VALUES(is_visible)`,
		[
			normalizedUserId,
			adjectiveAchievementId,
			nounAchievementId,
			isVisible ? 1 : 0,
		],
	);

	return await getUserTitleProfile(normalizedUserId);
}

async function appendGrantLog(payload) {
	await query(
		`INSERT INTO achievement_grant_logs (
			user_id,
			achievement_id,
			event_type,
			grant_source,
			reason,
			operator_user_id,
			snapshot_json
		) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[
			payload.userId,
			payload.achievementId,
			payload.eventType || 'grant',
			payload.grantSource || '',
			String(payload.reason || '').slice(0, 255),
			payload.operatorUserId || null,
			payload.snapshot ? JSON.stringify(payload.snapshot) : null,
		],
	);
}

async function grantAchievementToUser(payload) {
	const userId = toInt(payload.userId, 0);
	const achievementId = toInt(payload.achievementId, 0);
	const achievementKey = payload.achievementKey || '';
	const adminUserId = payload.adminUserId ? toInt(payload.adminUserId, 0) : null;
	const reason = String(payload.reason || '').slice(0, 255);
	const grantSource = String(payload.grantSource || 'official_manual').slice(0, 32);

	if (!userId) throw new Error('INVALID_USER_ID');

	let definition = null;
	if (achievementId) {
		definition = await getAchievementDefinitionById(achievementId, { includeDisabled: false });
	} else if (achievementKey) {
		definition = await getAchievementDefinitionByKey(achievementKey, { includeDisabled: false });
	}

	if (!definition) throw new Error('ACHIEVEMENT_NOT_FOUND');

	const insertResult = await query(
		`INSERT IGNORE INTO user_achievements (
			user_id,
			achievement_id,
			grant_source,
			grant_reason,
			granted_by_user_id
		) VALUES (?, ?, ?, ?, ?)`,
		[userId, definition.achievement_id, grantSource, reason, adminUserId || null],
	);

	const grantedNow = toInt(insertResult.affectedRows, 0) > 0;

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
	}

	if (grantedNow) {
		await appendGrantLog({
			userId,
			achievementId: definition.achievement_id,
			eventType: grantSource === 'official_manual' ? 'manual_grant' : 'rule_grant',
			grantSource,
			reason,
			operatorUserId: adminUserId,
			snapshot: {
				achievement_title: definition.title,
				grant_type: definition.grant_type,
				category: definition.category,
			},
		});

		if (payload.suppressNotification !== true) {
			try {
				await message.sendMsg(
					adminUserId || -1,
					userId,
					`你已获得荣誉勋章：${definition.title}`,
					'users/achievements',
					'notification',
					true,
				);
			} catch (e) {
				// ignore notification failures
			}
		}
	}

	return {
		granted: grantedNow,
		already_granted: !grantedNow,
		achievement: definition,
	};
}

async function revokeAchievementFromUser(payload) {
	const userId = toInt(payload.userId, 0);
	const achievementId = toInt(payload.achievementId, 0);
	const operatorUserId = payload.operatorUserId ? toInt(payload.operatorUserId, 0) : null;
	if (!userId || !achievementId) {
		throw new Error('INVALID_REVOKE_PAYLOAD');
	}

	const definition = await getAchievementDefinitionById(achievementId, { includeDisabled: true });
	const rows = await query(
		'DELETE FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
		[userId, achievementId],
	);
	await query(
		'DELETE FROM user_badge_showcase WHERE user_id = ? AND achievement_id = ?',
		[userId, achievementId],
	);
	await query(
		`UPDATE user_title_showcase
		 SET adjective_achievement_id = CASE
			 WHEN adjective_achievement_id = ? THEN NULL
			 ELSE adjective_achievement_id
		 END,
		 noun_achievement_id = CASE
			 WHEN noun_achievement_id = ? THEN NULL
			 ELSE noun_achievement_id
		 END
		 WHERE adjective_achievement_id = ? OR noun_achievement_id = ?`,
		[achievementId, achievementId, achievementId, achievementId],
	);

	if (toInt(rows.affectedRows, 0) > 0) {
		await appendGrantLog({
			userId,
			achievementId,
			eventType: 'manual_revoke',
			grantSource: 'manual_revoke',
			reason: String(payload.reason || '').slice(0, 255),
			operatorUserId,
			snapshot: definition ? { achievement_title: definition.title } : null,
		});
	}

	return {
		revoked: toInt(rows.affectedRows, 0) > 0,
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
	const titleProfile = await getUserTitleProfile(userId);
	const recent = await query(
		`SELECT
			d.*,
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
		title_profile: titleProfile,
		recent_unlocks: recent.map(mapGrantedRow),
	};
}

async function upsertUserMetricDaily(userId, dateKey, metricCode, deltaValue, q = query) {
	const metricColumn = METRIC_COLUMN_MAP[metricCode];
	if (!metricColumn) throw new Error('UNSUPPORTED_METRIC_CODE');
	const safeDelta = Math.max(0, toInt(deltaValue, 0));
	if (!safeDelta) return;

	await q(
		`INSERT INTO user_metric_daily (user_id, date_key, ${metricColumn})
		 VALUES (?, ?, ?)
		 ON DUPLICATE KEY UPDATE
			${metricColumn} = ${metricColumn} + VALUES(${metricColumn}),
			updated_at = CURRENT_TIMESTAMP`,
		[userId, dateKey, safeDelta],
	);
}

async function getMetricValueForCondition(userId, condition, cache, baseDate = new Date(), achievement = null) {
	const metricCode = condition.metric_code;
	const metricColumn = METRIC_COLUMN_MAP[metricCode];
	if (!metricColumn) return 0;
	const periodType = normalizePeriodType(condition.period_type);
	const range = getConditionMetricRange(condition, baseDate, achievement);
	if (range.isEmpty) return 0;

	const cacheKey = `${userId}:${metricCode}:${periodType}:${range.startKey || 'min'}:${range.endKey || 'max'}`;
	if (cache.has(cacheKey)) return cache.get(cacheKey);

	let value = 0;
	if (!range.startKey && !range.endKey) {
		const rows = await query(
			`SELECT IFNULL(SUM(${metricColumn}), 0) AS total
			 FROM user_metric_daily
			 WHERE user_id = ?`,
			[userId],
		);
		value = toNumber(rows?.[0]?.total, 0);
	} else {
		const conditions = ['user_id = ?'];
		const params = [userId];
		if (range.startKey) {
			conditions.push('date_key >= ?');
			params.push(range.startKey);
		}
		if (range.endKey) {
			conditions.push('date_key < ?');
			params.push(range.endKey);
		}
		const rows = await query(
			`SELECT IFNULL(SUM(${metricColumn}), 0) AS total
			 FROM user_metric_daily
			 WHERE ${conditions.join(' AND ')}`,
			params,
		);
		value = toNumber(rows?.[0]?.total, 0);
	}

	cache.set(cacheKey, value);
	return value;
}

function isAchievementInValidWindow(achievement, baseDate = new Date()) {
	const nowTs = new Date(baseDate).getTime();
	if (achievement.valid_from) {
		const startTs = new Date(achievement.valid_from).getTime();
		if (Number.isFinite(startTs) && nowTs < startTs) return false;
	}
	if (achievement.valid_to) {
		const endTs = new Date(achievement.valid_to).getTime();
		if (Number.isFinite(endTs) && nowTs > endTs) return false;
	}
	return true;
}

async function evaluateAchievementForUser(achievementId, userId, options = {}) {
	const achievement = await getAchievementDetail(achievementId, { includeDisabled: true });
	if (!achievement) throw new Error('ACHIEVEMENT_NOT_FOUND');
	const rawBaseDate = getValidDate(options.baseDate || new Date());
	const progressBaseDate = options.clampToValidWindow === true
		? clampDateToAchievementWindow(rawBaseDate, achievement)
		: rawBaseDate;
	const isInValidWindow = isAchievementInValidWindow(achievement, rawBaseDate);
	const allowProgressOutsideWindow = options.allowProgressOutsideWindow === true;

	const result = {
		achievement,
		user_id: userId,
		matched: false,
		reason: '',
		group_results: [],
		granted: false,
		is_in_valid_window: isInValidWindow,
	};

	if (!achievement.is_enabled) {
		result.reason = 'achievement_disabled';
		return result;
	}

	if (!isInValidWindow && !allowProgressOutsideWindow) {
		result.reason = 'out_of_valid_window';
		return result;
	}

	const groups = Array.isArray(achievement.rule_groups) ? achievement.rule_groups.filter((item) => item.is_enabled) : [];
	if (groups.length === 0) {
		result.reason = 'no_rules';
		return result;
	}

	const metricCache = new Map();
	let matched = false;
	for (const group of groups) {
		const conditionResults = [];
		let groupMatched = true;
		for (const condition of group.conditions.filter((item) => item.is_enabled)) {
			const currentValue = await getMetricValueForCondition(userId, condition, metricCache, progressBaseDate, achievement);
			const conditionMatched = compareMetricValue(currentValue, condition.comparator, condition.threshold_value);
			if (!conditionMatched) groupMatched = false;
			conditionResults.push({
				...condition,
				current_value: currentValue,
				matched: conditionMatched,
				progress_ratio: calcProgressRatio(currentValue, condition.threshold_value),
			});
		}
		if (conditionResults.length === 0) {
			groupMatched = false;
		}
		result.group_results.push({
			group_id: group.group_id,
			group_name: group.group_name,
			matched: groupMatched,
			conditions: conditionResults,
		});
		if (groupMatched) matched = true;
	}

	result.matched = matched;
	result.reason = !isInValidWindow ? 'out_of_valid_window' : (matched ? 'matched' : 'threshold_not_met');

	if (matched && isInValidWindow && options.grantIfMatched === true && achievement.grant_type !== 'manual') {
		const grantResult = await grantAchievementToUser({
			userId,
			achievementId: achievement.achievement_id,
			adminUserId: options.operatorUserId || null,
			reason: options.reason || achievement.rule_summary || '规则自动发放',
			grantSource: achievement.grant_type === 'rule_review' ? 'rule_review' : 'rule_auto',
			suppressNotification: options.suppressNotification === true,
		});
		result.granted = grantResult.granted;
		result.already_granted = grantResult.already_granted;
	}

	return result;
}

async function getAchievementsByMetric(metricCode) {
	if (!METRIC_COLUMN_MAP[metricCode]) return [];
	const rows = await query(
		`SELECT DISTINCT d.*
		 FROM achievement_definitions d
		 INNER JOIN achievement_rule_groups g ON g.achievement_id = d.achievement_id AND g.is_enabled = 1
		 INNER JOIN achievement_rule_conditions c ON c.group_id = g.group_id AND c.is_enabled = 1
		 WHERE d.is_enabled = 1
		   AND d.grant_type IN ('rule_auto', 'rule_review')
		   AND c.metric_code = ?
		 ORDER BY d.sort_order ASC, d.achievement_id ASC`,
		[metricCode],
	);
	return rows.map(mapDefinitionRow);
}

async function recordMetricProgress(userId, metricCode, deltaValue, options = {}) {
	const occurredDate = options.occurredAt ? getValidDate(options.occurredAt) : new Date();
	const dateKey = options.dateKey || formatDateKey(occurredDate);
	await upsertUserMetricDaily(userId, dateKey, metricCode, deltaValue, options.query || query);
	const evaluationBaseDate = occurredDate;

	if (options.triggerEvaluation === false) {
		return { evaluated: [] };
	}

	const achievements = await getAchievementsByMetric(metricCode);
	const evaluated = [];
	for (const achievement of achievements) {
		evaluated.push(await evaluateAchievementForUser(achievement.achievement_id, userId, {
			grantIfMatched: true,
			baseDate: evaluationBaseDate,
			operatorUserId: options.operatorUserId || null,
			reason: options.reason || `${metricCode} 触发自动评估`,
			suppressNotification: options.suppressNotification === true,
		}));
	}

	return { evaluated };
}

async function recalculateUserAchievements(userId, options = {}) {
	const achievementIds = Array.isArray(options.achievementIds) ? options.achievementIds.map((item) => toInt(item, 0)).filter(Boolean) : [];
	const params = [];
	let sql = `
		SELECT *
		FROM achievement_definitions
		WHERE is_enabled = 1
		  AND grant_type IN ('rule_auto', 'rule_review')
	`;
	if (achievementIds.length > 0) {
		sql += ` AND achievement_id IN (${achievementIds.map(() => '?').join(',')})`;
		params.push(...achievementIds);
	}
	sql += ' ORDER BY sort_order ASC, achievement_id ASC';

	const rows = await query(sql, params);
	const results = [];
	for (const row of rows) {
		results.push(await evaluateAchievementForUser(toInt(row.achievement_id), userId, {
			grantIfMatched: options.grantIfMatched !== false,
			operatorUserId: options.operatorUserId || null,
			reason: options.reason || '管理员重新评估勋章规则',
			suppressNotification: options.suppressNotification === true,
		}));
	}
	return results;
}

async function getAchievementGrantLogs(options = {}) {
	const limit = Math.min(Math.max(toInt(options.limit, 20), 1), 100);
	const page = Math.max(toInt(options.page, 1), 1);
	const offset = (page - 1) * limit;
	const params = [];
	const conditions = [];

	if (toInt(options.achievementId, 0) > 0) {
		conditions.push('l.achievement_id = ?');
		params.push(toInt(options.achievementId));
	}
	if (toInt(options.userId, 0) > 0) {
		conditions.push('l.user_id = ?');
		params.push(toInt(options.userId));
	}

	const listSql = `
		SELECT
			l.*,
			d.title AS achievement_title,
			u.name AS user_name
		FROM achievement_grant_logs l
		LEFT JOIN achievement_definitions d ON d.achievement_id = l.achievement_id
		LEFT JOIN users u ON u.user_id = l.user_id
		${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
		ORDER BY l.created_at DESC
		LIMIT ?, ?
	`;
	const countSql = `
		SELECT COUNT(*) AS total
		FROM achievement_grant_logs l
		${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
	`;
	const list = await query(listSql, [...params, offset, limit]);
	const countRows = await query(countSql, params);
	return {
		list: list.map((item) => ({
			log_id: toInt(item.log_id),
			user_id: toInt(item.user_id),
			user_name: item.user_name || '',
			achievement_id: toInt(item.achievement_id),
			achievement_title: item.achievement_title || '',
			event_type: item.event_type || '',
			grant_source: item.grant_source || '',
			reason: item.reason || '',
			operator_user_id: item.operator_user_id == null ? null : toInt(item.operator_user_id),
			snapshot_json: safeJsonParse(item.snapshot_json, null),
			created_at: item.created_at,
		})),
		total: toInt(countRows?.[0]?.total, 0),
		page,
		limit,
	};
}

module.exports = {
	ACHIEVEMENT_CATEGORIES,
	ACHIEVEMENT_GRANT_TYPES,
	ACHIEVEMENT_REPEAT_POLICIES,
	getAchievementDefinitions,
	listAchievementDefinitions,
	getAchievementDetail,
	getAchievementDefinitionById,
	getAchievementDefinitionByKey,
	saveAchievementDefinition,
	setAchievementEnabled,
	getUserAchievements,
	getUserAchievementSummary,
	getUserBadge,
	setUserBadge,
	getUserTitleTerms,
	getUserTitleProfile,
	setUserTitleShowcase,
	grantAchievementToUser,
	revokeAchievementFromUser,
	evaluateAchievementForUser,
	recalculateUserAchievements,
	recordMetricProgress,
	getAchievementGrantLogs,
};
