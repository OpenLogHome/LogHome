const fs = require('fs');
const path = require('path');
const { query } = require('../sql.js');

function parseLocalDate(dateStr) {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
	if (!m) throw new Error(`Invalid date: ${dateStr}`);
	return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0, 0);
}

function pad2(n) {
	return String(n).padStart(2, '0');
}

function formatTimestampLocal(d) {
	return (
		d.getFullYear() +
		pad2(d.getMonth() + 1) +
		pad2(d.getDate()) +
		'-' +
		pad2(d.getHours()) +
		pad2(d.getMinutes()) +
		pad2(d.getSeconds())
	);
}

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

async function getAffectedNovels(tagId) {
	return query(
		`SELECT DISTINCT n.novel_id, n.author_id, n.name
		 FROM novels n
		 JOIN novel_tag nt ON nt.novel_id = n.novel_id
		 WHERE nt.tag_id = ? AND n.deleted = 0 AND n.author_id <> -1`,
		[tagId],
	);
}

async function applyChange({ tagId, effectiveDateStr, backupPath }) {
	const now = new Date();
	const effectiveAt = parseLocalDate(effectiveDateStr);

	const affected = await getAffectedNovels(tagId);
	console.log(
		JSON.stringify(
			{
				mode: 'apply',
				now: now.toISOString(),
				effective_date_local: effectiveDateStr,
				effective_at_local_iso: effectiveAt.toISOString(),
				tag_id: tagId,
				affected_count: affected.length,
			},
			null,
			2,
		),
	);

	if (now < effectiveAt) {
		console.log('Not effective yet; no changes made.');
		return;
	}

	if (affected.length === 0) {
		console.log('No novels to update; no changes made.');
		return;
	}

	const logDir = path.resolve(__dirname, '..', 'log');
	fs.mkdirSync(logDir, { recursive: true });

	const resolvedBackupPath =
		backupPath && backupPath.trim().length > 0
			? path.resolve(backupPath)
			: path.join(logDir, `tag${tagId}_author_backup_${formatTimestampLocal(now)}.json`);

	const backupPayload = {
		meta: {
			mode: 'apply',
			generated_at: now.toISOString(),
			effective_date_local: effectiveDateStr,
			tag_id: tagId,
			row_count: affected.length,
		},
		novels: affected.map(r => ({
			novel_id: Number(r.novel_id),
			author_id: Number(r.author_id),
			name: r.name,
		})),
	};

	fs.writeFileSync(resolvedBackupPath, JSON.stringify(backupPayload, null, 2), 'utf8');
	console.log(`Backup written: ${resolvedBackupPath}`);

	const result = await query(
		`UPDATE novels n
		 JOIN novel_tag nt ON nt.novel_id = n.novel_id
		 SET n.author_id = -1
		 WHERE nt.tag_id = ? AND n.deleted = 0 AND n.author_id <> -1`,
		[tagId],
	);

	console.log(
		JSON.stringify(
			{
				updated_rows: Number(result.affectedRows ?? 0),
			},
			null,
			2,
		),
	);
}

async function restoreFromBackup(backupFilePath) {
	if (!backupFilePath) throw new Error('--restore requires a JSON file path');
	const resolved = path.resolve(backupFilePath);
	const raw = fs.readFileSync(resolved, 'utf8');
	const payload = JSON.parse(raw);

	if (!payload || !Array.isArray(payload.novels)) {
		throw new Error('Invalid backup JSON: missing novels[]');
	}

	const entries = [];
	const seen = new Set();
	for (const r of payload.novels) {
		const novelId = Number(r.novel_id);
		const authorId = Number(r.author_id);
		if (!Number.isFinite(novelId) || !Number.isFinite(authorId)) continue;
		if (seen.has(novelId)) continue;
		seen.add(novelId);
		entries.push({ novelId, authorId });
	}

	console.log(
		JSON.stringify(
			{
				mode: 'restore',
				backup: resolved,
				entry_count: entries.length,
			},
			null,
			2,
		),
	);

	const batchSize = 200;
	let totalAffected = 0;
	for (let i = 0; i < entries.length; i += batchSize) {
		const batch = entries.slice(i, i + batchSize);
		const caseFragments = batch.map(() => 'WHEN ? THEN ?').join(' ');
		const inPlaceholders = batch.map(() => '?').join(', ');
		const sql = `UPDATE novels
			SET author_id = CASE novel_id ${caseFragments} ELSE author_id END
			WHERE novel_id IN (${inPlaceholders})`;

		const values = [];
		for (const e of batch) values.push(e.novelId, e.authorId);
		for (const e of batch) values.push(e.novelId);

		const result = await query(sql, values);
		totalAffected += Number(result.affectedRows ?? 0);
	}

	console.log(
		JSON.stringify(
			{
				restored_rows: totalAffected,
			},
			null,
			2,
		),
	);
}

async function main() {
	const args = process.argv.slice(2);
	const tagId = Number(getArgValue(args, '--tag-id') ?? 236);
	const effectiveDateStr = getArgValue(args, '--effective-date') ?? '2026-01-21';
	const backupPath = getArgValue(args, '--backup');
	const restorePath = getArgValue(args, '--restore');

	if (!Number.isFinite(tagId)) throw new Error(`Invalid --tag-id: ${tagId}`);

	if (hasFlag(args, '--help') || hasFlag(args, '-h')) {
		console.log(
			[
				'Usage:',
				'  node scripts/tag236_author_to_minus1.js [--tag-id 236] [--effective-date 2026-01-21] [--backup <path>]',
				'  node scripts/tag236_author_to_minus1.js --restore <backup.json>',
			].join('\n'),
		);
		return;
	}

	if (restorePath) {
		await restoreFromBackup(restorePath);
		return;
	}

	await applyChange({ tagId, effectiveDateStr, backupPath });
}

main().catch(err => {
	console.error(err && err.stack ? err.stack : String(err));
	process.exitCode = 1;
});

