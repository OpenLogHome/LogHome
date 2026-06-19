const { query } = require('../sql.js');
const {
	calculateContentHash,
	repairArticleParagraphIds,
} = require('../bin/articleParagraphIds.js');

function parseArgs(argv) {
	const options = {
		fix: false,
		includeDeleted: false,
		includeWriter: false,
		batchSize: 200,
		limit: 0,
		articleId: 0,
	};

	for (const arg of argv) {
		if (arg === '--fix') {
			options.fix = true;
		} else if (arg === '--include-deleted') {
			options.includeDeleted = true;
		} else if (arg === '--include-writer') {
			options.includeWriter = true;
		} else if (arg.startsWith('--batch-size=')) {
			options.batchSize = Math.max(1, Number(arg.slice('--batch-size='.length)) || options.batchSize);
		} else if (arg.startsWith('--limit=')) {
			options.limit = Math.max(0, Number(arg.slice('--limit='.length)) || 0);
		} else if (arg.startsWith('--article-id=')) {
			options.articleId = Math.max(0, Number(arg.slice('--article-id='.length)) || 0);
		} else if (arg === '--help' || arg === '-h') {
			options.help = true;
		}
	}

	return options;
}

function printHelp() {
	console.log(`
Usage:
  node scripts/check_and_fix_article_paragraph_ids.js [options]

Options:
  --fix              Write repaired content back to the database. Default is dry-run.
  --article-id=ID    Only inspect one article_id from articles.
  --include-deleted  Include deleted articles. Default only checks deleted = 0.
  --include-writer   Also inspect articles_writer draft snapshots.
  --batch-size=N     Rows per batch. Default 200.
  --limit=N          Stop after scanning N rows per table. Default scans all.
`);
}

function formatDuplicateIds(duplicateIds) {
	return duplicateIds
		.map((item) => `${item.id}x${item.count}`)
		.join(', ');
}

async function updateArticle(row, repairedContent) {
	await query(
		'UPDATE articles SET content = ?, content_hash = ? WHERE article_id = ?',
		[
			repairedContent,
			calculateContentHash(repairedContent),
			row.article_id,
		],
	);
}

async function updateWriterSnapshot(row, repairedContent) {
	await query(
		'UPDATE articles_writer SET content = ?, content_hash = ? WHERE id = ?',
		[
			repairedContent,
			calculateContentHash(repairedContent),
			row.id,
		],
	);
}

async function scanRows(options, config) {
	const summary = {
		table: config.table,
		scanned: 0,
		damaged: 0,
		repaired: 0,
		failed: 0,
	};
	let lastId = 0;

	while (true) {
		const where = [`${config.primaryKey} > ?`, 'content IS NOT NULL'];
		const params = [lastId];

		if (config.table === 'articles' && !options.includeDeleted) {
			where.push('deleted = 0');
		}

		if (options.articleId) {
			where.push('article_id = ?');
			params.push(options.articleId);
		}

		params.push(options.batchSize);
		const rows = await query(
			`SELECT ${config.columns.join(', ')}
			FROM ${config.table}
			WHERE ${where.join(' AND ')}
			ORDER BY ${config.primaryKey} ASC
			LIMIT ?`,
			params,
		);

		if (rows.length === 0) {
			break;
		}

		for (const row of rows) {
			lastId = Number(row[config.primaryKey]);
			summary.scanned += 1;

			const repaired = repairArticleParagraphIds(row.content, {
				fillMissing: false,
			});

			if (!repaired.hasDuplicateIds) {
				continue;
			}

			summary.damaged += 1;
			const label = config.describe(row);
			const duplicateText = formatDuplicateIds(repaired.duplicateIds);
			console.log(
				`${options.fix ? 'repairing' : 'would repair'} ${label}: ` +
				`${repaired.textBlockCount} text blocks, duplicate ids ${duplicateText}`,
			);

			if (!options.fix) {
				continue;
			}

			try {
				await config.update(row, repaired.content);
				summary.repaired += 1;
			} catch (error) {
				summary.failed += 1;
				console.error(`failed to repair ${label}:`, error.message || error);
			}
		}

		if (options.articleId || (options.limit && summary.scanned >= options.limit)) {
			break;
		}
	}

	return summary;
}

async function main() {
	const options = parseArgs(process.argv.slice(2));
	if (options.help) {
		printHelp();
		return;
	}

	console.log(options.fix ? 'mode: fix' : 'mode: dry-run');
	const summaries = [];
	summaries.push(await scanRows(options, {
		table: 'articles',
		primaryKey: 'article_id',
		columns: ['article_id', 'novel_id', 'article_chapter', 'title', 'content'],
		describe: (row) => `articles.article_id=${row.article_id} "${row.title || ''}"`,
		update: updateArticle,
	}));

	if (options.includeWriter) {
		summaries.push(await scanRows(options, {
			table: 'articles_writer',
			primaryKey: 'id',
			columns: ['id', 'article_id', 'novel_id', 'title', 'content'],
			describe: (row) => `articles_writer.id=${row.id} article_id=${row.article_id} "${row.title || ''}"`,
			update: updateWriterSnapshot,
		}));
	}

	for (const summary of summaries) {
		console.log(
			`${summary.table}: scanned=${summary.scanned}, damaged=${summary.damaged}, ` +
			`repaired=${summary.repaired}, failed=${summary.failed}`,
		);
	}

	if (!options.fix) {
		console.log('dry-run only; rerun with --fix to update damaged rows.');
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
