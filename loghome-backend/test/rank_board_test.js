const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SQL_MODULE = path.resolve(__dirname, '../sql.js');

function loadRankBoards(queryStub) {
	require.cache[SQL_MODULE] = {
		id: SQL_MODULE,
		filename: SQL_MODULE,
		loaded: true,
		exports: { query: queryStub },
	};
	delete require.cache[path.resolve(__dirname, '../bin/rankBoards.js')];
	return require('../bin/rankBoards.js');
}

test('榜单口径：四榜共用公开过滤且按专区与各自规则筛选', () => {
	const rankBoards = loadRankBoards(async () => []);
	const cases = {
		update: /n\.update_time >= DATE_SUB\(CURRENT_TIMESTAMP\(\), INTERVAL 7 DAY\)[\s\S]*ORDER BY n\.update_time DESC/,
		logpower: /ORDER BY n\.ranking DESC/,
		complete: /AND n\.is_complete = 1[\s\S]*ORDER BY n\.update_time DESC/,
		new: /n\.create_time >= DATE_SUB\(CURRENT_TIMESTAMP\(\), INTERVAL 90 DAY\)[\s\S]*ORDER BY n\.ranking DESC/,
	};
	for (const [board, rule] of Object.entries(cases)) {
		for (const zone of Object.keys(rankBoards.ZONES)) {
			const sql = rankBoards.getBoardCandidatesSql(board, zone);
			assert.match(sql, /n\.deleted = 0 AND n\.is_personal = 0 AND n\.is_banned = 0/, `${board}/${zone} 公开过滤`);
			if (zone === 'all') assert.match(sql, /n\.novel_type IN \('novel', 'manga', 'world'\)/);
			else assert.match(sql, new RegExp(`n\\.novel_type = '${zone}'`), `${board}/${zone} 专区过滤`);
			assert.match(sql, rule, `${board}/${zone} 排序规则`);
			assert.match(sql, /LIMIT 50/, `${board}/${zone} Top 50`);
		}
	}
});

test('榜单口径：非法榜单或专区直接抛错', () => {
	const rankBoards = loadRankBoards(async () => []);
	assert.throws(() => rankBoards.getBoardCandidatesSql('hot', 'novel'));
	assert.throws(() => rankBoards.getBoardCandidatesSql('update', 'game'));
});

test('原木力全局重算使用既有公式并覆盖全部公开作品', async () => {
	const executed = [];
	const rankBoards = loadRankBoards(async sql => {
		executed.push(sql);
		return [];
	});
	await rankBoards.refreshLogPower();
	assert.equal(executed.length, 1);
	assert.match(executed[0], /^UPDATE novels n SET n\.ranking = ROUND\(/);
	assert.match(executed[0], /n\.clicks \* 8/);
	assert.match(executed[0], /bookcase[\s\S]*\* 200/);
	assert.match(executed[0], /WHERE n\.deleted = 0 AND n\.is_personal = 0 AND n\.is_banned = 0/);
});

test('快照写入：同日重跑先删后插，名次从 1 连续递增', async () => {
	const executed = [];
	const candidates = [
		{ novel_id: 3, score: 900 },
		{ novel_id: 1, score: 700 },
		{ novel_id: 2, score: 0 },
	];
	const rankBoards = loadRankBoards(async sql => {
		executed.push(sql);
		return /SELECT n\.novel_id/.test(sql) ? candidates : [];
	});
	const count = await rankBoards.snapshotBoard('logpower', 'manga');
	assert.equal(count, 3);
	const deleteIndex = executed.findIndex(sql => sql.startsWith('DELETE FROM rank_snapshot'));
	assert.ok(deleteIndex >= 0, '先删除当日旧快照');
	const insertCalls = executed.filter(sql => sql.startsWith('INSERT INTO rank_snapshot'));
	assert.equal(insertCalls.length, 3);
	const firstInsertIndex = executed.findIndex(sql => sql.startsWith('INSERT INTO rank_snapshot'));
	assert.ok(deleteIndex < firstInsertIndex);
});

test('榜单接口：读取当日快照并返回 position 与展示字段', async () => {
	const executedSql = [];
	const executedValues = [];
	const queryStub = async (sql, values) => {
		executedSql.push(sql);
		executedValues.push(values);
		if (sql.includes("FROM rank_batch")) return [];
		if (sql.includes('MAX(snapshot_date)')) {
			return [{ snapshot_date: new Date('2026-10-07T00:00:00') }];
		}
		return [
			{ position: 1, score: 900, novel_id: 3, name: '榜一', novel_type: 'novel' },
			{ position: 2, score: 700, novel_id: 1, name: '榜二', novel_type: 'novel' },
		];
	};
	const source = fs.readFileSync(path.resolve(__dirname, '../routes/library/rank.js'), 'utf8');
	const rankBoards = loadRankBoards(queryStub);
	let handler;
	const routerStub = { get: (...args) => { handler = args.at(-1); } };
	vm.runInNewContext(source, {
		express: { Router: () => routerStub },
		require: (m) => {
			if (m === '../../bin/rankBadgeSchema') return {ensureRankBadgeSchema: async () => {}};
			if (m === 'express') return { Router: () => routerStub };
			if (m === '../../sql.js') return { query: queryStub };
			if (m === '../../bin/rankBoards.js') return rankBoards;
			return require(m);
		},
		console: { log() {} },
		module: { exports: {} },
	}, { filename: 'routes/library/rank.js' });
	assert.ok(handler, '路由已注册');

	const res = {
		status(code) { this.statusCode = code; return this; },
		json(body) { this.body = body; },
		end(body) { this.body = body; },
	};
	await handler({ query: { board: 'logpower', zone: 'novel', page: '1', amount: '20' } }, res);
	const payload = JSON.parse(res.body);
	assert.equal(payload.board, 'logpower');
	assert.equal(payload.zone, 'novel');
	assert.ok(payload.snapshot_date);
	assert.equal(payload.items.length, 2);
	assert.equal(payload.items[0].position, 1);
	const snapshotQueryIndex = executedSql.findIndex(sql => sql.includes('FROM rank_snapshot rs'));
	assert.ok(snapshotQueryIndex >= 0, '从快照表读取');
	assert.deepEqual(executedValues[snapshotQueryIndex][3], 0);
	assert.deepEqual(executedValues[snapshotQueryIndex][4], 20);
});

test('榜单接口：非法榜单或专区返回 400', async () => {
	const source = fs.readFileSync(path.resolve(__dirname, '../routes/library/rank.js'), 'utf8');
	const rankBoards = loadRankBoards(async () => []);
	let handler;
	const routerStub = { get: (...args) => { handler = args.at(-1); } };
	vm.runInNewContext(source, {
		express: { Router: () => routerStub },
		require: (m) => {
			if (m === '../../bin/rankBadgeSchema') return {ensureRankBadgeSchema: async () => {}};
			if (m === 'express') return { Router: () => routerStub };
			if (m === '../../sql.js') return { query: async () => [] };
			if (m === '../../bin/rankBoards.js') return rankBoards;
			return require(m);
		},
		console: { log() {} },
		module: { exports: {} },
	}, { filename: 'routes/library/rank.js' });
	const res = {
		status(code) { this.statusCode = code; return this; },
		json(body) { this.body = body; },
		end(body) { this.body = body; },
	};
	await handler({ query: { board: 'hot', zone: 'novel' } }, res);
	assert.equal(res.statusCode, 400);
	await handler({ query: { board: 'update', zone: 'game' } }, res);
	assert.equal(res.statusCode, 400);});

test('榜单接口：当日快照缺失时实时计算兜底并补名次', async () => {
	const queryStub = async (sql) => {
		if (sql.includes('FROM rank_batch')) return [];
		if (sql.includes('MAX(snapshot_date)')) return [{ snapshot_date: null }];
		return [
			{ novel_id: 9, score: 500, name: '实时兜底', novel_type: 'world' },
			{ novel_id: 8, score: 100, name: '实时兜底二', novel_type: 'world' },
		];
	};
	const source = fs.readFileSync(path.resolve(__dirname, '../routes/library/rank.js'), 'utf8');
	const rankBoards = loadRankBoards(queryStub);
	let handler;
	const routerStub = { get: (...args) => { handler = args.at(-1); } };
	vm.runInNewContext(source, {
		express: { Router: () => routerStub },
		require: (m) => {
			if (m === '../../bin/rankBadgeSchema') return {ensureRankBadgeSchema: async () => {}};
			if (m === 'express') return { Router: () => routerStub };
			if (m === '../../sql.js') return { query: queryStub };
			if (m === '../../bin/rankBoards.js') return rankBoards;
			return require(m);
		},
		console: { log() {} },
		module: { exports: {} },
	}, { filename: 'routes/library/rank.js' });
	const res = {
		status(code) { this.statusCode = code; return this; },
		json(body) { this.body = body; },
		end(body) { this.body = body; },
	};
	await handler({ query: { board: 'new', zone: 'world' } }, res);
	const payload = JSON.parse(res.body);
	assert.equal(payload.snapshot_date, null);
	assert.equal(payload.items.length, 2);
	assert.equal(payload.items[0].position, 1);
	assert.equal(payload.items[1].position, 2);
});

// 清理 sql.js stub，避免影响其他测试文件
delete require.cache[SQL_MODULE];
delete require.cache[path.resolve(__dirname, '../bin/rankBoards.js')];


test('全部榜：三类作品按同一规则混排，分页与快照口径一致', () => {
	const rankBoards = loadRankBoards(async () => []);
	for (const board of rankBoards.BOARDS) {
		const sql = rankBoards.getLiveBoardSql(board, 'all', 20, 20);
		assert.match(sql, /n\.novel_type IN \('novel', 'manga', 'world'\)/);
		assert.match(sql, /LIMIT 20, 20/);
		const order = sql.match(/ORDER BY[^\n]+/)[0];
		assert.ok(rankBoards.getBoardCandidatesSql(board, 'all').includes(order));
		assert.match(sql, /n\.deleted = 0 AND n\.is_personal = 0 AND n\.is_banned = 0/);
	}
});
