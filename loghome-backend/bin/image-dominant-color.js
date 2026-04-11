const fetch = require('node-fetch');
const Jimp = require('jimp');
const { query } = require('../sql.js');
let sharp = null;
let sharpLoadError = null;

try {
	sharp = require('sharp');
} catch (error) {
	sharpLoadError = error;
}

const DEFAULT_SAMPLE_SIZE = 64;
const DEFAULT_BUCKET_SIZE = 32;
const DEFAULT_FETCH_TIMEOUT = 15000;
const DEFAULT_DB_RETRY_TIMES = 2;
const DEFAULT_DOWNLOAD_RETRY_TIMES = 2;
const MIN_ALPHA = 128;
const MIN_BRIGHTNESS = 18;
const MAX_BRIGHTNESS = 245;

const BUSINESS_IMAGE_SOURCES = [
	{ table: 'novels', field: 'picUrl' },
	{ table: 'users', field: 'avatar_url' },
	{ table: 'users', field: 'top_pic_url' },
	{ table: 'open_users', field: 'avatar_url' },
	{ table: 'open_users', field: 'top_pic_url' },
	{ table: 'banners', field: 'image_url' },
	{ table: 'library_roulous_chart', field: 'image' },
	{ table: 'library_index_tags', field: 'tag_icon' },
	{ table: 'library_recommend_collections', field: 'icon' },
	{ table: 'comm_circles', field: 'icon' },
	{ table: 'comm_circles', field: 'bg_url' },
	{ table: 'comm_comments', field: 'image_url' },
	{ table: 'comm_posts', field: 'media_urls', parser: 'json-array' },
	{ table: 'novel_comments', field: 'media_urls', parser: 'json-array' },
	{ table: 'novel_pics', field: 'pic_url' },
	{ table: 'popup_posters', field: 'image_url' },
	{ table: 'store_categories', field: 'icon' },
	{ table: 'store_order_items', field: 'product_image' },
	{ table: 'store_products', field: 'cover_url' },
	{ table: 'store_products', field: 'media_urls', parser: 'json-array' },
	{ table: 'tree_exp_tasks', field: 'icon' },
	{ table: 'tree_tasks', field: 'icon' },
	{ table: 'user_message', field: 'bg_url' },
];

function normalizeImageUrl(imageUrl) {
	if (typeof imageUrl !== 'string') {
		return null;
	}

	const trimmed = imageUrl.trim();
	return trimmed || null;
}

function isRemoteImageUrl(imageUrl) {
	return /^https?:\/\//i.test(imageUrl);
}

function rgbToHex(r, g, b) {
	return (
		'#' +
		[r, g, b]
			.map((value) => {
				const channel = Math.max(0, Math.min(255, Math.round(value)));
				return channel.toString(16).padStart(2, '0');
			})
			.join('')
			.toUpperCase()
	);
}

function getBrightness(r, g, b) {
	return (r * 299 + g * 587 + b * 114) / 1000;
}

function getSaturation(r, g, b) {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	if (max === 0) {
		return 0;
	}
	return (max - min) / max;
}

function collectBucketStatsFromRawData(pixelData, channels, skipExtremePixels) {
	const buckets = new Map();

	for (let idx = 0; idx < pixelData.length; idx += channels) {
		const r = pixelData[idx];
		const g = pixelData[idx + 1];
		const b = pixelData[idx + 2];
		const a = channels >= 4 ? pixelData[idx + 3] : 255;

		if (a < MIN_ALPHA) {
			continue;
		}

		const brightness = getBrightness(r, g, b);
		if (
			skipExtremePixels &&
			(brightness < MIN_BRIGHTNESS || brightness > MAX_BRIGHTNESS)
		) {
			continue;
		}

		const bucketKey = [
			Math.floor(r / DEFAULT_BUCKET_SIZE),
			Math.floor(g / DEFAULT_BUCKET_SIZE),
			Math.floor(b / DEFAULT_BUCKET_SIZE),
		].join(':');
		const saturationWeight = 1 + getSaturation(r, g, b) * 1.5;
		const weight = saturationWeight * (a / 255);
		const currentBucket = buckets.get(bucketKey) || {
			weight: 0,
			r: 0,
			g: 0,
			b: 0,
		};

		currentBucket.weight += weight;
		currentBucket.r += r * weight;
		currentBucket.g += g * weight;
		currentBucket.b += b * weight;
		buckets.set(bucketKey, currentBucket);
	}

	return buckets;
}

function collectBucketStatsFromJimp(image, skipExtremePixels) {
	const resized = image
		.clone()
		.resize(DEFAULT_SAMPLE_SIZE, DEFAULT_SAMPLE_SIZE, Jimp.RESIZE_BEZIER);
	return collectBucketStatsFromRawData(
		resized.bitmap.data,
		4,
		skipExtremePixels,
	);
}

function getDominantColorFromBuckets(buckets) {
	let bestBucket = null;

	for (const bucket of buckets.values()) {
		if (!bestBucket || bucket.weight > bestBucket.weight) {
			bestBucket = bucket;
		}
	}

	if (!bestBucket || bestBucket.weight === 0) {
		return null;
	}

	return rgbToHex(
		bestBucket.r / bestBucket.weight,
		bestBucket.g / bestBucket.weight,
		bestBucket.b / bestBucket.weight,
	);
}

function trimErrorMessage(error) {
	const message = error && error.message ? error.message : String(error);
	return message.slice(0, 255);
}

function shouldRetryDatabaseError(error) {
	return (
		error &&
		(error.code === 'PROTOCOL_CONNECTION_LOST' ||
			error.code === 'ECONNRESET' ||
			error.code === 'ETIMEDOUT')
	);
}

function shouldRetryDownloadError(error) {
	const message = trimErrorMessage(error).toLowerCase();
	return (
		(error &&
			(error.code === 'ECONNRESET' ||
				error.code === 'ETIMEDOUT' ||
				error.code === 'EAI_AGAIN')) ||
		message.includes('socket hang up') ||
		message.includes('network socket disconnected') ||
		message.includes('response timeout') ||
		message.includes('unrecognised content at end of stream')
	);
}

function getDownloadCandidates(imageUrl) {
	const candidates = [imageUrl];
	if (/^https:\/\//i.test(imageUrl)) {
		candidates.push(imageUrl.replace(/^https:\/\//i, 'http://'));
	}
	return [...new Set(candidates)];
}

async function runQueryWithRetry(sql, values, retriesLeft = DEFAULT_DB_RETRY_TIMES) {
	try {
		return await query(sql, values);
	} catch (error) {
		if (retriesLeft > 0 && shouldRetryDatabaseError(error)) {
			return runQueryWithRetry(sql, values, retriesLeft - 1);
		}
		throw error;
	}
}

function decodeBase64Image(imageBase64) {
	if (typeof imageBase64 !== 'string' || !imageBase64.trim()) {
		return null;
	}

	const trimmed = imageBase64.trim();
	const base64Payload = trimmed.includes(',') ? trimmed.split(',').pop() : trimmed;
	return Buffer.from(base64Payload, 'base64');
}

async function getImageDominantColorRecord(imageUrl) {
	const normalizedImageUrl = normalizeImageUrl(imageUrl);
	if (!normalizedImageUrl) {
		return null;
	}

	const rows = await runQueryWithRetry(
		'SELECT image_url, dominant_color, extract_status, error_message FROM image_dominant_colors WHERE image_url = ? LIMIT 1',
		[normalizedImageUrl],
	);
	return rows[0] || null;
}

async function saveImageDominantColor(imageUrl, dominantColor) {
	await runQueryWithRetry(
		`INSERT INTO image_dominant_colors (image_url, dominant_color, extract_status, error_message)
		VALUES (?, ?, 'success', NULL)
		ON DUPLICATE KEY UPDATE
			dominant_color = VALUES(dominant_color),
			extract_status = 'success',
			error_message = NULL`,
		[imageUrl, dominantColor],
	);
}

async function saveImageDominantColorFailure(imageUrl, error) {
	await runQueryWithRetry(
		`INSERT INTO image_dominant_colors (image_url, dominant_color, extract_status, error_message)
		VALUES (?, NULL, 'failed', ?)
		ON DUPLICATE KEY UPDATE
			dominant_color = NULL,
			extract_status = 'failed',
			error_message = VALUES(error_message)`,
		[imageUrl, trimErrorMessage(error)],
	);
}

async function downloadImageBufferOnce(imageUrl) {
	const response = await fetch(imageUrl, {
		timeout: DEFAULT_FETCH_TIMEOUT,
		headers: {
			'User-Agent': 'LogHomeImageColorBot/1.0',
		},
	});

	if (!response.ok) {
		throw new Error(`download failed: ${response.status}`);
	}

	return response.buffer();
}

async function downloadImageBuffer(imageUrl) {
	const candidates = getDownloadCandidates(imageUrl);
	let lastError = null;

	for (const candidateUrl of candidates) {
		for (
			let retriesLeft = DEFAULT_DOWNLOAD_RETRY_TIMES;
			retriesLeft >= 0;
			retriesLeft -= 1
		) {
			try {
				return await downloadImageBufferOnce(candidateUrl);
			} catch (error) {
				lastError = error;
				if (!shouldRetryDownloadError(error) || retriesLeft === 0) {
					break;
				}
			}
		}
	}

	throw lastError || new Error('download failed');
}

async function extractDominantColorFromBuffer(imageBuffer) {
	if (!Buffer.isBuffer(imageBuffer) || imageBuffer.length === 0) {
		throw new Error('image buffer is empty');
	}

	let lastError = null;

	if (sharp) {
		try {
			const sharpResult = await sharp(imageBuffer, { failOn: 'none' })
				.resize(DEFAULT_SAMPLE_SIZE, DEFAULT_SAMPLE_SIZE, { fit: 'fill' })
				.ensureAlpha()
				.raw()
				.toBuffer({ resolveWithObject: true });
			let dominantColor = getDominantColorFromBuckets(
				collectBucketStatsFromRawData(sharpResult.data, sharpResult.info.channels, true),
			);

			if (!dominantColor) {
				dominantColor = getDominantColorFromBuckets(
					collectBucketStatsFromRawData(
						sharpResult.data,
						sharpResult.info.channels,
						false,
					),
				);
			}

			if (dominantColor) {
				return dominantColor;
			}
		} catch (error) {
			lastError = error;
		}
	} else if (sharpLoadError) {
		lastError = sharpLoadError;
	}

	try {
		const image = await Jimp.read(imageBuffer);
		let dominantColor = getDominantColorFromBuckets(
			collectBucketStatsFromJimp(image, true),
		);

		if (!dominantColor) {
			dominantColor = getDominantColorFromBuckets(
				collectBucketStatsFromJimp(image, false),
			);
		}

		if (dominantColor) {
			return dominantColor;
		}
	} catch (error) {
		lastError = error;
	}

	throw lastError || new Error('dominant color not found');
}

async function ensureImageDominantColor(imageUrl, options = {}) {
	const normalizedImageUrl = normalizeImageUrl(imageUrl);
	if (!normalizedImageUrl) {
		return null;
	}

	const existingRecord = await getImageDominantColorRecord(normalizedImageUrl);
	if (
		!options.force &&
		existingRecord &&
		existingRecord.extract_status === 'success' &&
		existingRecord.dominant_color
	) {
		return existingRecord.dominant_color;
	}

	if (
		!options.force &&
		!options.retryFailed &&
		existingRecord &&
		existingRecord.extract_status === 'failed'
	) {
		return null;
	}

	try {
		const imageBuffer =
			options.imageBuffer || (await downloadImageBuffer(normalizedImageUrl));
		const dominantColor = await extractDominantColorFromBuffer(imageBuffer);
		await saveImageDominantColor(normalizedImageUrl, dominantColor);
		return dominantColor;
	} catch (error) {
		await saveImageDominantColorFailure(normalizedImageUrl, error);
		throw error;
	}
}

function extractImageUrlsFromValue(value, parser = 'single') {
	if (value === null || value === undefined) {
		return [];
	}

	let rawValues = [];
	if (parser === 'json-array') {
		if (Array.isArray(value)) {
			rawValues = value;
		} else if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed) {
				return [];
			}

			try {
				const parsedValue = JSON.parse(trimmed);
				rawValues = Array.isArray(parsedValue) ? parsedValue : [trimmed];
			} catch (error) {
				rawValues = [trimmed];
			}
		} else {
			rawValues = [value];
		}
	} else {
		rawValues = [value];
	}

	const normalizedUrls = rawValues
		.map(normalizeImageUrl)
		.filter((imageUrl) => imageUrl && isRemoteImageUrl(imageUrl));

	return [...new Set(normalizedUrls)];
}

module.exports = {
	BUSINESS_IMAGE_SOURCES,
	decodeBase64Image,
	ensureImageDominantColor,
	extractDominantColorFromBuffer,
	extractImageUrlsFromValue,
	getImageDominantColorRecord,
	runQueryWithRetry,
	saveImageDominantColor,
	saveImageDominantColorFailure,
};
