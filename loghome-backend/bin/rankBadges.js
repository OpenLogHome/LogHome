const { query } = require('../sql');
const rules = require('./rankBadgeRules');
const HOUR = 3600000,
	DAY = 24 * HOUR;
const time = value => {
	if (value instanceof Date) return value.getTime();
	if (!value) return NaN;
	let text = String(value).replace(' ', 'T');
	if (/^\d{4}-\d{2}-\d{2}$/.test(text)) text += 'T00:00:00';
	if (!/Z$|[+-]\d\d:\d\d$/.test(text)) text += '+08:00';
	return new Date(text).getTime();
};
const dayString = date =>
	new Date(time(date) + 8 * HOUR).toISOString().slice(0, 10);
// Calendar anniversaries in Shanghai; February 29 becomes February 28 in non-leap years.
function completedWorkYears(createdAt, nowMs) {
	if (!Number.isFinite(createdAt) || createdAt > nowMs) return 0;
	const created = new Date(createdAt + 8 * HOUR),
		now = new Date(nowMs + 8 * HOUR);
	const year = now.getUTCFullYear(),
		month = created.getUTCMonth();
	let years = year - created.getUTCFullYear();
	const anniversaryDay = Math.min(
		created.getUTCDate(),
		new Date(Date.UTC(year, month + 1, 0)).getUTCDate(),
	);
	const anniversary =
		Date.UTC(
			year,
			month,
			anniversaryDay,
			created.getUTCHours(),
			created.getUTCMinutes(),
			created.getUTCSeconds(),
			created.getUTCMilliseconds(),
		) -
		8 * HOUR;
	if (nowMs < anniversary) years--;
	return Math.max(0, years);
}

function buildBadges(item, features = {}, history = {}, now = new Date()) {
	const badges = [],
		nowMs = now.getTime();
	const add = (code, text, tone, priority, evidence, expiresAt) =>
		badges.push({
			code,
			text,
			tone,
			priority,
			evidence,
			expires_at: expiresAt || new Date(nowMs + HOUR).toISOString(),
		});
	if (
		Number(item.position) === 1 &&
		Number(history.championDays) >= rules.championDays
	)
		add('champion', '蝉联榜首', 'gold', 100, {
			settled_days: history.championDays,
		});
	const rise = Number(history.previousPosition) - Number(item.position);
	if (history.previousPosition && rise >= rules.riseMinimum)
		add('rank_rise', `飙升${rise}名`, 'green', 90, {
			previous_position: history.previousPosition,
			position: item.position,
		});
	const createdAt = time(item.create_time);
	if (createdAt <= nowMs && nowMs - createdAt < rules.newWorkDays * DAY)
		add(
			'new_entry',
			'新作上榜',
			'green',
			80,
			{ created_at: item.create_time, window_days: rules.newWorkDays },
			new Date(createdAt + rules.newWorkDays * DAY).toISOString(),
		);

	const burst = rules.burst[item.novel_type];
	if (
		burst &&
		features.publishedChapters >= burst.chapters &&
		features.publishedWords >= burst.words
	)
		add('update_burst', '疯狂爆更', 'orange', 70, {
			hours: 24,
			chapters: features.publishedChapters,
			words: features.publishedWords,
		});
	if (
		features.interactionReaders >= rules.interaction.readers &&
		features.interactionActions >= rules.interaction.actions
	)
		add('interaction_hot', '互动火热', 'orange', 60, {
			days: rules.interaction.days,
			readers: features.interactionReaders,
			actions: features.interactionActions,
		});
	if (features.nices >= rules.niceThreshold)
		add('nice_milestone', '点赞过千', 'gold', 50, { nices: features.nices });
	if (Number(item.clicks) >= rules.readThreshold)
		add('read_milestone', '阅读过万', 'gold', 40, {
			reads: Number(item.clicks),
		});
	const ageYears = completedWorkYears(createdAt, nowMs);
	if (ageYears >= rules.oldWorkMinimumYears)
		add('old_work', `${ageYears}年老作`, 'gold', 35, {
			created_at: item.create_time,
			completed_years: ageYears,
		});

	const days = Number(history.appearanceDays || 0);
	if (days >= rules.appearanceMilestones[0])
		add('appearance', `上榜${days}天`, 'gold', 30, { days });
	return badges.sort((a, b) => b.priority - a.priority);
}
async function collectFeatures(ids, date) {
	const features = new Map(
		ids.map(id => [
			id,
			{
				nices: 0,
				publishedChapters: 0,
				publishedWords: 0,
				interactionReaders: 0,
				interactionActions: 0,
			},
		]),
	);
	if (!ids.length) return features;
	const marks = ids.map(() => '?').join(',');
	const [nices, publications, interactions] = await Promise.all([
		query(
			`SELECT novel_id,COUNT(*) nices FROM novel_nice WHERE novel_id IN (${marks}) GROUP BY novel_id`,
			ids,
		),
		query(
			`SELECT p.novel_id,IF(EXISTS (SELECT 1 FROM novel_publish_record old WHERE old.novel_id=p.novel_id AND old.first_publication_known=0),NULL,MIN(IF(p.content_valid=1,p.first_published_at,NULL))) first_public_at,
   SUM(p.content_valid=1 AND p.first_published_at >= DATE_SUB(?,INTERVAL 24 HOUR)) published_chapters,
   SUM(IF(p.content_valid=1 AND p.first_published_at >= DATE_SUB(?,INTERVAL 24 HOUR),p.words_at_publish,0)) published_words
   FROM novel_publish_record p JOIN articles a ON a.article_id=p.article_id AND a.deleted=0 AND a.is_draft=0
   WHERE p.novel_id IN (${marks}) AND p.first_publication_known=1 AND p.first_published_at <= ?
   GROUP BY p.novel_id`,
			[date, date, ...ids, date],
		),
		query(
			`SELECT events.novel_id,COUNT(*) actions,COUNT(DISTINCT events.user_id) readers FROM (
   SELECT nn.novel_id,nn.user_id,CONCAT('nice:',nn.user_id,':',nn.date) event_id FROM novel_nice nn JOIN novels n ON n.novel_id=nn.novel_id
   WHERE nn.novel_id IN (${marks}) AND nn.date >= DATE(DATE_SUB(?,INTERVAL 6 DAY)) AND nn.date <= DATE(?) AND nn.user_id<>n.author_id
   UNION ALL
   SELECT nc.novel_id,nc.user_id,CONCAT('comment:',nc.essay_comment_id) event_id FROM novel_comments nc JOIN novels n ON n.novel_id=nc.novel_id
   WHERE nc.novel_id IN (${marks}) AND nc.comment_time >= DATE(DATE_SUB(?,INTERVAL 6 DAY)) AND nc.comment_time<=? AND nc.deleted=0 AND nc.user_id<>n.author_id
  ) events GROUP BY events.novel_id`,
			[...ids, date, date, ...ids, date, date],
		),
	]);
	for (const row of nices)
		Object.assign(features.get(row.novel_id), { nices: Number(row.nices) });
	for (const row of publications)
		Object.assign(features.get(row.novel_id), {
			firstPublicAt: row.first_public_at,
			firstPublicKnown: !!row.first_public_at,
			publishedChapters: Number(row.published_chapters),
			publishedWords: Number(row.published_words),
		});
	for (const row of interactions)
		Object.assign(features.get(row.novel_id), {
			interactionActions: Number(row.actions),
			interactionReaders: Number(row.readers),
		});
	return features;
}
async function collectHistory(ids, date) {
	const history = new Map();
	if (!ids.length) return history;
	const marks = ids.map(() => '?').join(',');
	const day = dayString(date),
		yesterday = dayString(new Date(time(date) - DAY));
	const [totals, recent, entries] = await Promise.all([
		query(
			`SELECT board,zone,novel_id,COUNT(DISTINCT snapshot_date) days FROM rank_snapshot WHERE novel_id IN (${marks}) AND snapshot_date < ? GROUP BY board,zone,novel_id`,
			[...ids, day],
		),
		query(
			`SELECT board,zone,novel_id,position,DATE_FORMAT(snapshot_date,'%Y-%m-%d') day FROM rank_snapshot WHERE novel_id IN (${marks}) AND snapshot_date BETWEEN DATE_SUB(?,INTERVAL 31 DAY) AND ?`,
			[...ids, day, yesterday],
		),
		query(`SELECT * FROM rank_entry_history WHERE novel_id IN (${marks})`, ids),
	]);
	const key = row => `${row.board}:${row.zone}:${row.novel_id}`;
	const get = row => {
		const k = key(row);
		if (!history.has(k)) history.set(k, {});
		return history.get(k);
	};
	for (const row of totals) get(row).appearanceDays = Number(row.days); // Completed days only, never hourly executions.
	for (const row of entries)
		Object.assign(get(row), {
			firstSeenAt: row.first_seen_at,
			firstSeenKnown: Number(row.first_seen_known) === 1,
		});
	for (const row of recent) {
		const h = get(row);
		if (!h.positions) h.positions = {};
		h.positions[row.day] = Number(row.position);
		if (row.day === yesterday) h.previousPosition = Number(row.position);
	}
	for (const h of history.values()) {
		h.championDays = 0;
		for (let n = 1; n <= 31; n++) {
			const d = dayString(new Date(time(date) - n * DAY));
			if (!h.positions || h.positions[d] !== 1) break;
			h.championDays++;
		}
	}
	return history;
}
module.exports = {
	buildBadges,
	collectFeatures,
	collectHistory,
	dayString,
	rules,
};
