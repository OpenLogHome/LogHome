const { query, withTransaction } = require('../sql.js');

const TABLE_NAME = 'articles_writer';
const COLUMN_NAME = 'updated_at';
const INDEX_NAME = 'idx_articles_writer_article_updated_at';
const DEFAULT_BATCH_SIZE = 500;

async function hasTable(tableName) {
	const rows = await query(
		`SELECT COUNT(*) AS count
		FROM INFORMATION_SCHEMA.TABLES
		WHERE TABLE_SCHEMA = DATABASE()
			AND TABLE_NAME = ?`,
		[tableName],
	);
	return Number(rows[0]?.count || 0) > 0;
}

async function hasColumn(tableName, columnName) {
	const rows = await query(
		`SELECT COUNT(*) AS count
		FROM INFORMATION_SCHEMA.COLUMNS
		WHERE TABLE_SCHEMA = DATABASE()
			AND TABLE_NAME = ?
			AND COLUMN_NAME = ?`,
		[tableName, columnName],
	);
	return Number(rows[0]?.count || 0) > 0;
}

async function hasIndex(tableName, indexName) {
	const rows = await query(
		`SELECT COUNT(*) AS count
		FROM INFORMATION_SCHEMA.STATISTICS
		WHERE TABLE_SCHEMA = DATABASE()
			AND TABLE_NAME = ?
			AND INDEX_NAME = ?`,
		[tableName, indexName],
	);
	return Number(rows[0]?.count || 0) > 0;
}

function normalizeLegacyCreateTime(rawCreateTime) {
	const digits = String(rawCreateTime || '').replace(/\D/g, '').slice(0, 14);
	if (digits.length !== 14) {
		return null;
	}

	return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)} ${digits.slice(8, 10)}:${digits.slice(10, 12)}:${digits.slice(12, 14)}.000000`;
}

async function ensureUpdatedAtColumn(dryRun = false) {
	if (await hasColumn(TABLE_NAME, COLUMN_NAME)) {
		console.log(`column ${TABLE_NAME}.${COLUMN_NAME} already exists`);
		return;
	}

	if (dryRun) {
		console.log(`[dry-run] would add column ${TABLE_NAME}.${COLUMN_NAME}`);
		return;
	}

	await query(
		`ALTER TABLE ${TABLE_NAME}
		ADD COLUMN ${COLUMN_NAME} DATETIME(6) NULL DEFAULT NULL AFTER create_time`,
	);
	console.log(`added column ${TABLE_NAME}.${COLUMN_NAME}`);
}

async function backfillUpdatedAt(
	batchSize = DEFAULT_BATCH_SIZE,
	dryRun = false,
	columnExists = true,
) {
	let lastId = 0;
	let updatedCount = 0;
	let invalidCount = 0;
	const invalidSamples = [];

	while (true) {
		const whereClause = columnExists
			? `${COLUMN_NAME} IS NULL AND id > ?`
			: `id > ?`;
		const rows = await query(
			`SELECT id, create_time
			FROM ${TABLE_NAME}
			WHERE ${whereClause}
			ORDER BY id ASC
			LIMIT ?`,
			[lastId, batchSize],
		);

		if (!rows.length) {
			break;
		}

		const updates = [];
		for (const row of rows) {
			const normalizedUpdatedAt = normalizeLegacyCreateTime(row.create_time);
			if (!normalizedUpdatedAt) {
				invalidCount += 1;
				if (invalidSamples.length < 20) {
					invalidSamples.push({
						id: Number(row.id),
						create_time: row.create_time || null,
					});
				}
				continue;
			}

			updates.push({
				id: Number(row.id),
				updated_at: normalizedUpdatedAt,
			});
		}

		if (updates.length > 0) {
			if (dryRun) {
				console.log(
					`[dry-run] would backfill ${updates.length} rows up to id ${Number(rows[rows.length - 1].id)}`,
				);
			} else {
				await withTransaction(async (tx) => {
					const cases = [];
					const params = [];
					const ids = [];

					for (const update of updates) {
						cases.push('WHEN ? THEN ?');
						params.push(update.id, update.updated_at);
						ids.push(update.id);
					}

					await tx(
						`UPDATE ${TABLE_NAME}
						SET ${COLUMN_NAME} = CASE id ${cases.join(' ')} END
						WHERE id IN (${ids.map(() => '?').join(',')})`,
						[...params, ...ids],
					);
				}, `backfill ${TABLE_NAME}.${COLUMN_NAME}`);
			}
			updatedCount += updates.length;
		}

		lastId = Number(rows[rows.length - 1].id);
	}

	console.log(`backfilled ${updatedCount} rows for ${TABLE_NAME}.${COLUMN_NAME}`);
	if (invalidCount > 0) {
		console.log(
			`left ${invalidCount} rows unchanged because create_time could not be normalized`,
		);
		console.log('sample invalid rows:', invalidSamples);
	}
}

async function ensureUpdatedAtColumnBehavior(dryRun = false) {
	if (dryRun) {
		console.log(
			`[dry-run] would modify ${TABLE_NAME}.${COLUMN_NAME} to DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
		);
		return;
	}

	await query(
		`ALTER TABLE ${TABLE_NAME}
		MODIFY COLUMN ${COLUMN_NAME} DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
	);
	console.log(`updated column behavior for ${TABLE_NAME}.${COLUMN_NAME}`);
}

async function ensureUpdatedAtIndex(dryRun = false) {
	if (await hasIndex(TABLE_NAME, INDEX_NAME)) {
		console.log(`index ${INDEX_NAME} already exists`);
		return;
	}

	if (dryRun) {
		console.log(
			`[dry-run] would add index ${INDEX_NAME} on ${TABLE_NAME}(article_id, ${COLUMN_NAME}, id)`,
		);
		return;
	}

	await query(
		`ALTER TABLE ${TABLE_NAME}
		ADD INDEX ${INDEX_NAME} (article_id, ${COLUMN_NAME}, id)`,
	);
	console.log(`added index ${INDEX_NAME}`);
}

async function main() {
	const dryRun = process.argv.includes('--dry-run');
	const batchArg = process.argv.find((arg) => arg.startsWith('--batch='));
	const batchSize = batchArg
		? Math.max(1, Number(batchArg.split('=')[1]) || DEFAULT_BATCH_SIZE)
		: DEFAULT_BATCH_SIZE;

	console.log(
		`start articles_writer updated_at migration${dryRun ? ' (dry-run)' : ''}`,
	);

	if (!(await hasTable(TABLE_NAME))) {
		throw new Error(`table ${TABLE_NAME} does not exist`);
	}

	const columnExistsBeforeMigration = await hasColumn(TABLE_NAME, COLUMN_NAME);
	await ensureUpdatedAtColumn(dryRun);
	await backfillUpdatedAt(
		batchSize,
		dryRun,
		dryRun ? columnExistsBeforeMigration : true,
	);
	await ensureUpdatedAtColumnBehavior(dryRun);
	await ensureUpdatedAtIndex(dryRun);

	console.log('articles_writer updated_at migration completed');
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error('articles_writer updated_at migration failed', error);
		process.exit(1);
	});
