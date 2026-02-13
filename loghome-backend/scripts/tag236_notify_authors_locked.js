const fs = require('fs');
const path = require('path');
const message = require('../bin/message.js');

function getArgValue(args, name) {
	const idx = args.indexOf(name);
	if (idx === -1) return undefined;
	const next = args[idx + 1];
	if (!next || next.startsWith('--')) return undefined;
	return next;
}

function hasFlag(args, name) {
	return args.includes(name);
}

function normalizeEntries(payload) {
	if (!payload || !Array.isArray(payload.novels)) {
		throw new Error('Invalid backup JSON: missing novels[]');
	}

	const entries = [];
	const seen = new Set();
	for (const r of payload.novels) {
		const novelId = Number(r.novel_id);
		const authorId = Number(r.author_id);
		const name = typeof r.name === 'string' ? r.name : '';
		if (!Number.isFinite(novelId) || !Number.isFinite(authorId)) continue;
		if (authorId === -1) continue;
		const key = `${authorId}::${name}`;
		if (seen.has(key)) continue;
		seen.add(key);
		entries.push({ novelId, authorId, name });
	}

	return entries;
}

async function main() {
	const args = process.argv.slice(2);
	const backupPathArg = getArgValue(args, '--backup');
	const fromId = Number(getArgValue(args, '--from-id') ?? -1);
	const router = getArgValue(args, '--router') ?? '';
	const type = getArgValue(args, '--type') ?? 'notification';
	const dryRun = hasFlag(args, '--dry-run');
	const force = hasFlag(args, '--force');

	if (hasFlag(args, '--help') || hasFlag(args, '-h')) {
		console.log(
			[
				'Usage:',
				'  node scripts/tag236_notify_authors_locked.js [--backup <backup.json>] [--from-id -1] [--router ""] [--type notification] [--dry-run] [--force]',
				'',
				'Notes:',
				'  --dry-run  只打印将要发送的消息，不写入数据库',
				'  --force    忽略1小时内重复消息限制（谨慎使用）',
			].join('\n'),
		);
		return;
	}

	if (!Number.isFinite(fromId)) throw new Error(`Invalid --from-id: ${fromId}`);

	const defaultBackup = path.resolve(
		__dirname,
		'..',
		'log',
		'tag236_author_backup_20260121-000046.json',
	);
	const backupPath = path.resolve(backupPathArg ?? defaultBackup);
	const raw = fs.readFileSync(backupPath, 'utf8');
	const payload = JSON.parse(raw);
	const entries = normalizeEntries(payload);

	const template = name =>
		`干草块杯正式进入评审环节，您的作品《${name}》被暂时锁定，评审结束后将解锁，感谢您的理解！`;

	const authorSet = new Set(entries.map(e => e.authorId));
	console.log(
		JSON.stringify(
			{
				backup: backupPath,
				novel_count: entries.length,
				author_count: authorSet.size,
				dry_run: dryRun,
				force: force,
			},
			null,
			2,
		),
	);

	let sent = 0;
	for (const e of entries) {
		const content = template(e.name);
		if (dryRun) {
			console.log(
				JSON.stringify(
					{
						from_id: fromId,
						to_id: e.authorId,
						novel_id: e.novelId,
						content,
						router,
						type,
					},
					null,
					2,
				),
			);
			sent += 1;
			continue;
		}

		await message.sendMsg(fromId, e.authorId, content, router, type, force);
		sent += 1;
	}

	console.log(
		JSON.stringify(
			{
				sent_count: sent,
			},
			null,
			2,
		),
	);
}

main().catch(err => {
	console.error(err && err.stack ? err.stack : String(err));
	process.exitCode = 1;
});
