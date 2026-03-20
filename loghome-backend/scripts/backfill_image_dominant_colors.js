const {
	BUSINESS_IMAGE_SOURCES,
	ensureImageDominantColor,
	ensureImageDominantColorsTable,
	extractImageUrlsFromValue,
	getImageDominantColorRecord,
	runQueryWithRetry,
} = require('../bin/image-dominant-color.js');

function parseCliArgs() {
	const args = process.argv.slice(2);
	const options = {
		concurrency: 4,
		force: false,
		retryFailed: false,
		limit: null,
	};

	for (const arg of args) {
		if (arg === '--force') {
			options.force = true;
			options.retryFailed = true;
			continue;
		}

		if (arg === '--retry-failed') {
			options.retryFailed = true;
			continue;
		}

		if (arg.startsWith('--concurrency=')) {
			const concurrency = Number(arg.split('=')[1]);
			if (Number.isFinite(concurrency) && concurrency > 0) {
				options.concurrency = Math.floor(concurrency);
			}
			continue;
		}

		if (arg.startsWith('--limit=')) {
			const limit = Number(arg.split('=')[1]);
			if (Number.isFinite(limit) && limit > 0) {
				options.limit = Math.floor(limit);
			}
		}
	}

	return options;
}

async function getAvailableSources() {
	const rows = await runQueryWithRetry(
		`SELECT TABLE_NAME, COLUMN_NAME
		FROM information_schema.COLUMNS
		WHERE TABLE_SCHEMA = DATABASE()`,
	);
	const availableColumns = new Set(
		rows.map((row) => `${row.TABLE_NAME}.${row.COLUMN_NAME}`),
	);

	return BUSINESS_IMAGE_SOURCES.filter((source) =>
		availableColumns.has(`${source.table}.${source.field}`),
	);
}

async function collectDistinctImageUrls(sources) {
	const imageUrls = new Map();

	for (const source of sources) {
		const rows = await runQueryWithRetry(
			`SELECT DISTINCT \`${source.field}\` AS image_value
			FROM \`${source.table}\`
			WHERE \`${source.field}\` IS NOT NULL
				AND TRIM(\`${source.field}\`) <> ''`,
		);

		for (const row of rows) {
			const urls = extractImageUrlsFromValue(
				row.image_value,
				source.parser || 'single',
			);
			for (const imageUrl of urls) {
				if (!imageUrls.has(imageUrl)) {
					imageUrls.set(imageUrl, new Set());
				}
				imageUrls.get(imageUrl).add(`${source.table}.${source.field}`);
			}
		}
	}

	return imageUrls;
}

async function processImageUrls(imageUrls, options) {
	const queue = imageUrls.slice();
	const stats = {
		success: 0,
		failed: 0,
		skipped: 0,
	};

	async function worker() {
		while (queue.length > 0) {
			const imageUrl = queue.shift();
			const existingRecord = await getImageDominantColorRecord(imageUrl);
			const shouldSkipSuccess =
				!options.force &&
				existingRecord &&
				existingRecord.extract_status === 'success' &&
				existingRecord.dominant_color;
			const shouldSkipFailed =
				!options.force &&
				!options.retryFailed &&
				existingRecord &&
				existingRecord.extract_status === 'failed';

			if (shouldSkipSuccess || shouldSkipFailed) {
				stats.skipped += 1;
				continue;
			}

			try {
				await ensureImageDominantColor(imageUrl, {
					force: options.force,
					retryFailed: options.retryFailed,
				});
				stats.success += 1;
			} catch (error) {
				stats.failed += 1;
				console.log(`[FAILED] ${imageUrl} => ${error.message}`);
			}

			const processed = stats.success + stats.failed + stats.skipped;
			if (processed % 20 === 0) {
				console.log(
					`progress: ${processed}/${imageUrls.length} success=${stats.success} skipped=${stats.skipped} failed=${stats.failed}`,
				);
			}
		}
	}

	const workers = Array.from({ length: options.concurrency }, () => worker());
	await Promise.all(workers);
	return stats;
}

async function main() {
	const options = parseCliArgs();
	await ensureImageDominantColorsTable();

	const availableSources = await getAvailableSources();
	console.log(
		`available sources: ${availableSources
			.map((source) => `${source.table}.${source.field}`)
			.join(', ')}`,
	);

	const imageUrlMap = await collectDistinctImageUrls(availableSources);
	let imageUrls = [...imageUrlMap.keys()];
	if (options.limit) {
		imageUrls = imageUrls.slice(0, options.limit);
	}

	console.log(`unique image urls: ${imageUrls.length}`);
	const stats = await processImageUrls(imageUrls, options);
	console.log(
		`done: success=${stats.success} skipped=${stats.skipped} failed=${stats.failed}`,
	);
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
