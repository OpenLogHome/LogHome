const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const rules = require('../bin/rankBadgeRules');
function load(file, dependencies) {
	const module = { exports: {} };
	vm.runInNewContext(
		fs.readFileSync(path.join(__dirname, '../', file), 'utf8'),
		{
			module,
			require: name => {
				if (name in dependencies) return dependencies[name];
				throw new Error('Unexpected dependency ' + name);
			},
			console: { log() {} },
			process: { env: {} },
			Date,
			Map,
			Set,
		},
		{ filename: file },
	);
	return module.exports;
}
const engine = load('bin/rankBadges.js', {
	'../sql': { query: async () => [] },
	'./rankBadgeRules': rules,
});
const now = new Date('2026-10-07T04:00:00Z');
const item = {
	position: 1,
	novel_type: 'novel',
	clicks: 10000,
	create_time: '2026-08-01 12:00:00',
};
const codes = badges => Array.from(badges, b => b.code);
test('八种标签按优先级返回，包含可追溯证据和有效期', () => {
	const badges = engine.buildBadges(
		{ ...item, create_time: '2026-10-06 12:00:00' },
		{
			firstPublicKnown: true,
			firstPublicAt: '2026-10-06 12:00:00',
			publishedChapters: 3,
			publishedWords: 6000,
			interactionReaders: 10,
			interactionActions: 30,
			nices: 1000,
		},
		{
			championDays: 2,
			previousPosition: 6,
			firstSeenKnown: true,
			firstSeenAt: '2026-10-07 00:00:00',
			appearanceDays: 7,
		},
		now,
	);
	assert.deepEqual(codes(badges), [
		'champion',
		'rank_rise',
		'new_entry',
		'update_burst',
		'interaction_hot',
		'nice_milestone',
		'read_milestone',
		'appearance',
	]);
	assert.ok(badges.every(b => b.evidence && new Date(b.expires_at) > now));
	assert.equal(badges[1].text, '飙升5名');
	assert.equal(badges[7].text, '上榜7天');
});
test('阈值以下不生成标签，旧作品不会因最近首发或入榜标为新作', () => {
	assert.deepEqual(
		codes(
			engine.buildBadges(
				{ ...item, clicks: 9999 },
				{
					nices: 999,
					publishedChapters: 3,
					publishedWords: 5999,
					interactionReaders: 9,
					interactionActions: 30,
					firstPublicKnown: true,
					firstPublicAt: '2026-10-06 12:00:00',
				},
				{
					championDays: 1,
					previousPosition: 5,
					appearanceDays: 6,
					firstSeenKnown: true,
					firstSeenAt: '2026-10-07 00:00:00',
				},
				now,
			),
		),
		[],
	);
});
test('创建30天内即为新作，不依赖首发历史或72小时入榜限制', () => {
	for (const create_time of [
		'2026-10-06 12:00:00',
		'2026-09-07 12:00:01',
		new Date('2026-09-08T04:00:00Z'),
	]) {
		const badges = engine.buildBadges(
			{ ...item, create_time },
			{ firstPublicKnown: false },
			{ firstSeenKnown: false, firstSeenAt: '2026-09-08 12:00:00' },
			now,
		);
		const badge = badges.find(b => b.code === 'new_entry');
		assert.ok(badge);
		assert.equal(badge.evidence.created_at, create_time);
		assert.equal(badge.evidence.window_days, 30);
		assert.ok(new Date(badge.expires_at) > now);
	}
});
test('创建时间超过或达到30天、位于未来、缺失或无效时不标新作', () => {
	for (const create_time of [
		'2026-09-07 12:00:00',
		'2026-09-07 11:59:59',
		'2026-10-08 12:00:00',
		null,
		undefined,
		'invalid',
	]) {
		assert.ok(
			!codes(
				engine.buildBadges({ ...item, create_time }, {}, {}, now),
			).includes('new_entry'),
		);
	}
});
test('漫画与世界按有效首次发布数判断爆更，首榜标签要求当前仍为第一', () => {
	for (const [novel_type, count] of [
		['manga', 2],
		['world', 3],
	]) {
		assert.ok(
			codes(
				engine.buildBadges(
					{ novel_type, position: 2 },
					{ publishedChapters: count, publishedWords: 0 },
					{ championDays: 5 },
					now,
				),
			).includes('update_burst'),
		);
		assert.ok(
			!codes(
				engine.buildBadges(
					{ novel_type, position: 2 },
					{ publishedChapters: count - 1, publishedWords: 0 },
					{ championDays: 5 },
					now,
				),
			).includes('update_burst'),
		);
		assert.ok(
			!codes(
				engine.buildBadges(
					{ novel_type, position: 2 },
					{},
					{ championDays: 5 },
					now,
				),
			).includes('champion'),
		);
	}
});
test('历史按完成日期统计，跨榜单独立，断日终止连冠', async () => {
	const query = async sql =>
		sql.includes('COUNT(DISTINCT')
			? [{ board: 'update', zone: 'all', novel_id: 1, days: 7 }]
			: sql.includes('FROM rank_entry_history')
			? []
			: [
					{
						board: 'update',
						zone: 'all',
						novel_id: 1,
						day: '2026-10-06',
						position: 1,
					},
					{
						board: 'update',
						zone: 'all',
						novel_id: 1,
						day: '2026-10-05',
						position: 1,
					},
					{
						board: 'update',
						zone: 'all',
						novel_id: 1,
						day: '2026-10-03',
						position: 1,
					},
					{
						board: 'logpower',
						zone: 'all',
						novel_id: 1,
						day: '2026-10-06',
						position: 6,
					},
			  ];
	const e = load('bin/rankBadges.js', {
		'../sql': { query },
		'./rankBadgeRules': rules,
	});
	const h = await e.collectHistory([1], '2026-10-07 12:00:00');
	assert.equal(h.get('update:all:1').championDays, 2);
	assert.equal(h.get('update:all:1').appearanceDays, 7);
	assert.equal(h.get('logpower:all:1').previousPosition, 6);
	assert.equal(h.get('logpower:all:1').championDays, 0);
	assert.equal(e.dayString('2026-10-07'), '2026-10-07');
});
test('已有未知历史不阻止新章节爆更；统计过滤草稿删除项并排除作者互动', async () => {
	const calls = [];
	const query = async (sql, args) => {
		calls.push(sql);
		return sql.includes('FROM novel_publish_record p')
			? [
					{
						novel_id: 1,
						first_public_at: null,
						published_chapters: 3,
						published_words: 6000,
					},
			  ]
			: [];
	};
	const e = load('bin/rankBadges.js', {
		'../sql': { query },
		'./rankBadgeRules': rules,
	});
	const f = (await e.collectFeatures([1], '2026-10-07 12:00:00')).get(1);
	assert.equal(f.firstPublicKnown, false);
	assert.ok(codes(e.buildBadges(item, f, {}, now)).includes('update_burst'));
	assert.match(calls.join('\n'), /a.deleted=0 AND a.is_draft=0/);
	assert.match(calls.join('\n'), /COUNT\(DISTINCT events.user_id\)/);
	assert.match(calls.join('\n'), /nc.deleted=0 AND nc.user_id<>n.author_id/);
});
test('首次发布记录幂等：编辑与重新发布不改变时间；草稿和分卷不计数', async () => {
	const records = new Map();
	let article = {
		article_id: 1,
		novel_id: 2,
		article_type: 'richtext',
		is_draft: 0,
		deleted: 0,
		is_personal: 0,
		is_banned: 0,
		content: JSON.stringify([{ type: 'text', value: '<b>文字</b> 空格' }]),
	};
	const query = async (sql, args) => {
		if (sql.startsWith('SELECT')) return [article];
		assert.match(sql, /INSERT IGNORE/);
		if (!records.has(args[0])) records.set(args[0], args);
		return {};
	};
	const p = load('bin/novelPublication.js', { '../sql': { query } });
	await p.recordFirstPublication(1);
	article.content = JSON.stringify([{ type: 'text', value: '更改内容' }]);
	await p.recordFirstPublication(1);
	assert.equal(records.size, 1);
	assert.equal(records.get(1)[5], 4);
	for (const change of [
		{ is_draft: 1 },
		{ is_draft: 0, deleted: 1 },
		{ deleted: 0, article_type: 'spliter' },
	]) {
		article = { ...article, ...change, article_id: records.size + 1 };
		await p.recordFirstPublication(article.article_id);
	}
	assert.equal(records.size, 1);
	assert.equal(
		p.hasPublishedContent(
			{ pages: [{ url: 'https://example.com/a.png' }] },
			'mangaStrip',
		),
		true,
	);
	assert.equal(p.hasPublishedContent({ pages: [] }, 'mangaStrip'), false);
	assert.equal(
		p.hasPublishedContent([{ type: 'text', value: '  ' }], 'richtext'),
		false,
	);
	article = {
		...article,
		article_type: 'richtext',
		article_id: 3,
		is_personal: 1,
	};
	await p.recordFirstPublication(3);
	assert.equal(records.get(3)[4], 0);
});
function route(query) {
	let handler;
	load('routes/library/rank.js', {
		express: { Router: () => ({ get: (p, h) => (handler = h) }) },
		'../../sql.js': { query },
		'../../bin/rankBadges': engine,
		'../../bin/rankBoards.js': {
			BOARDS: ['update', 'logpower', 'complete', 'new'],
			ZONES: { all: 1, novel: 1, manga: 1, world: 1 },
			RANK_LIMIT: 50,
		},
		'../../bin/rankBadgeSchema': { ensureRankBadgeSchema: async () => {} },
	});
	return handler;
}
function response() {
	return {
		status(c) {
			this.code = c;
			return this;
		},
		json(body) {
			this.body = body;
		},
		end(body) {
			this.body = JSON.parse(body);
		},
	};
}
test('分页固定批次，过滤过期标签，空榜不回退旧榜', async () => {
	const calls = [];
	let empty = false;
	const handler = route(async (sql, args) => {
		calls.push([sql, args]);
		if (sql.includes('FROM rank_batch'))
			return [{ batch_id: 8, generated_at: now }];
		if (empty) return [];
		return [
			{
				item_json: JSON.stringify({ novel_id: 1, name: '短标题' }),
				badges_json: JSON.stringify([
					{ code: 'expired', expires_at: '2000-01-01T00:00:00Z' },
					{ code: 'valid', expires_at: '2099-01-01T00:00:00Z' },
				]),
			},
		];
	});
	const res = response();
	await handler(
		{
			query: {
				board: 'logpower',
				zone: 'all',
				page: 2,
				amount: 20,
				batch_id: 8,
			},
		},
		res,
	);
	assert.equal(res.body.batch_id, 8);
	assert.equal(res.body.items[0].badges.length, 1);
	assert.equal(res.body.items[0].badges[0].code, 'valid');
	assert.deepEqual(Array.from(calls[1][1]), [8, 'logpower', 'all', 20, 20]);
	assert.match(
		calls[1][0],
		/n.deleted=0 AND n.is_personal=0 AND n.is_banned=0/,
	);
	empty = true;
	const res2 = response();
	await handler({ query: { board: 'complete', zone: 'manga' } }, res2);
	assert.equal(res2.body.items.length, 0);
	assert.equal(calls.length, 4);
});
test('批次过期返回410，错误批次参数返回400', async () => {
	const handler = route(async () => []);
	const res = response();
	await handler({ query: { board: 'update', zone: 'all', batch_id: 8 } }, res);
	assert.equal(res.code, 410);
	assert.equal(res.body.code, 'RANK_BATCH_EXPIRED');
	const bad = response();
	await handler(
		{ query: { board: 'update', zone: 'all', batch_id: 'x' } },
		bad,
	);
	assert.equal(bad.code, 400);
});
test('榜单与标签在一个事务发布，构建失败不会提交半批次，空榜也完成覆盖', async () => {
	for (const fail of [false, true]) {
		let committed = ['prior-complete-batch'];
		const writes = [];
		let initialized = false;
		const query = async sql => {
			assert.equal(initialized, true);
			if (sql.startsWith('SELECT n.novel_id'))
				return [{ novel_id: 1, novel_type: 'novel', clicks: 0 }];
			return [];
		};
		const withTransaction = async work => {
			const staged = [];
			const result = await work(async (sql, args) => {
				writes.push(sql);
				staged.push(sql);
				if (fail && sql.startsWith('INSERT INTO rank_badge_snapshot'))
					throw new Error('write failed');
				return { insertId: 9 };
			});
			committed = staged;
			return result;
		};
		const boards = load('bin/rankBoards.js', {
			'../sql.js': { query, withTransaction },
			'./rankBadgeSchema': {
				ensureRankBadgeSchema: async () => {
					initialized = true;
				},
			},
			'./rankBadges': {
				...engine,
				collectFeatures: async () => new Map(),
				collectHistory: async () => new Map(),
			},
		});
		if (fail) {
			await assert.rejects(() => boards.run(), /write failed/);
			assert.deepEqual(committed, ['prior-complete-batch']);
			assert.ok(!writes.some(sql => sql.includes("SET status='complete'")));
		} else {
			const counts = await boards.run();
			assert.equal(Object.keys(counts).length, 16);
			assert.equal(
				writes.filter(sql => sql.startsWith('DELETE FROM rank_snapshot'))
					.length,
				16,
			);
			assert.equal(
				writes.at(-1),
				"UPDATE rank_batch SET status='complete' WHERE batch_id=?",
			);
		}
	}
});
test('迁移只初始化一次，涵盖旧草稿/删除内容，服务重启不吞掉新草稿首次发布', async () => {
	let completed = false,
		seeds = 0;
	const query = async sql => (sql.startsWith('SHOW COLUMNS') ? [{}] : []);
	const withTransaction = async work =>
		work(async sql => {
			if (sql.startsWith('SELECT completed_at'))
				return [{ completed_at: completed ? now : null }];
			if (
				sql.includes('SELECT article_id,novel_id,article_type FROM articles')
			) {
				seeds++;
				assert.ok(!sql.includes('is_draft=0'));
				assert.ok(!sql.includes('deleted=0'));
			}
			if (sql.startsWith('UPDATE rank_badge_migration')) completed = true;
			return {};
		});
	const deps = { '../sql': { query, withTransaction } };
	const a = load('bin/rankBadgeSchema.js', deps);
	await Promise.all([a.ensureRankBadgeSchema(), a.ensureRankBadgeSchema()]);
	const b = load('bin/rankBadgeSchema.js', deps);
	await b.ensureRankBadgeSchema();
	assert.equal(seeds, 1);
});
test('旧部署配置自动注册每小时榜单任务，明确关闭的任务与全局开关仍优先', () => {
	for (const config of [
		{ jobs: {} },
		{ jobs: { rankSnapshot: { enabled: false } } },
		{ enabled: false, jobs: {} },
	]) {
		const crons = [];
		const timers = load('timers/index.js', {
			'node-schedule': {
				scheduleJob: cron => {
					crons.push(cron);
					return { cancel() {} };
				},
			},
			'./config.js': config,
		});
		timers.start();
		assert.deepEqual(
			crons,
			config.enabled === false || config.jobs.rankSnapshot
				? []
				: ['0 5 * * * *'],
		);
		timers.stop();
	}
});

test('老作按创建时间计算满周年数，不与新作标签同时出现', () => {
	for (const [create_time, years] of [
		['2025-10-07 12:00:00', 1],
		['2025-10-07 12:00:01', 0],
		['2024-10-07 11:59:59', 2],
		['2024-10-08 00:00:00', 1],
		['2026-10-06 00:00:00', 0],
		['2027-01-01 00:00:00', 0],
		[null, 0],
		['invalid', 0],
	]) {
		const badges = engine.buildBadges({ ...item, create_time }, {}, {}, now);
		const age = badges.find(b => b.code === 'old_work');
		if (years) {
			assert.ok(age);
			assert.equal(age.text, `${years}年老作`);
			assert.equal(age.evidence.completed_years, years);
			assert.ok(!badges.some(b => b.code === 'new_entry'));
		} else assert.equal(age, undefined);
	}
});
test('闰日创建作品的非闰年周年按2月28日计算', () => {
	const created = { ...item, create_time: '2024-02-29 12:00:00' };
	for (const [date, years] of [
		['2025-02-28T03:59:59Z', 0],
		['2025-02-28T04:00:00Z', 1],
		['2026-02-28T04:00:00Z', 2],
	]) {
		const badge = engine
			.buildBadges(created, {}, {}, new Date(date))
			.find(b => b.code === 'old_work');
		assert.equal(badge?.evidence.completed_years || 0, years);
	}
});

test('HayCraft 文会标签优先于榜首、新作和全部其他标签，兼容布尔与数据库标志', () => {
	for (const flag of [true, 1, '1']) {
		const badges = engine.buildBadges({ ...item, is_haycraft: flag, create_time: '2026-10-06 12:00:00' }, { nices: 1000 }, { championDays: 3 }, now);
		assert.equal(badges[0].code, 'haycraft_work');
		assert.equal(badges[0].text, '干草块文会作品');
		assert.ok(badges.slice(1).every(badge => badge.priority < badges[0].priority));
	}
	for (const flag of [false, 0, '0', undefined]) {
		assert.ok(!codes(engine.buildBadges({ ...item, is_haycraft: flag, name: 'HayCraft' }, {}, {}, now)).includes('haycraft_work'));
	}
});
test('已有批次和无标签兜底也立即获得文会标签，重复应用不重复显示', async () => {
	const handler = route(async sql => sql.includes('FROM rank_batch')
		? [{ batch_id: 8, generated_at: now }]
		: [{ item_json: JSON.stringify({ novel_id: 1, is_haycraft: 1 }), badges_json: JSON.stringify([{ code: 'champion', priority: 100 }]) }]);
	const res = response();
	await handler({ query: { board: 'update', zone: 'all' } }, res);
	assert.equal(res.body.items[0].badges[0].text, '干草块文会作品');
	const badges = engine.withHaycraftBadge({ is_haycraft: 1 }, res.body.items[0].badges, now);
	assert.equal(badges.filter(badge => badge.code === 'haycraft_work').length, 1);
	assert.equal(engine.withHaycraftBadge({ is_haycraft: 1 }, [], now)[0].text, '干草块文会作品');
});
