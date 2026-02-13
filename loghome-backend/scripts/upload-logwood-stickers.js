const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { query } = require('../sql.js');

function parseArgs(argv) {
	const args = { dir: 'd:\\LogHome\\表情包', dryRun: false, isPrivate: false, limit: null };
	for (let i = 2; i < argv.length; i++) {
		const key = argv[i];
		if (key === '--dir') {
			args.dir = argv[i + 1];
			i++;
		} else if (key === '--dry-run') {
			args.dryRun = true;
		} else if (key === '--private') {
			args.isPrivate = true;
		} else if (key === '--limit') {
			args.limit = Number(argv[i + 1]);
			i++;
		}
	}
	return args;
}

async function uploadToStorage({ filePath, containerId, serviceKey }) {
	const uploadUrl = `https://storage.codesocean.top/api/resource/upload?container=${encodeURIComponent(containerId)}`;
	const formData = new FormData();
	formData.append('file', fs.createReadStream(filePath));

	const response = await axios.post(uploadUrl, formData, {
		headers: {
			...formData.getHeaders(),
			ServiceKey: serviceKey,
		},
		maxBodyLength: Infinity,
		maxContentLength: Infinity,
	});

	const payload = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
	const resourceId = payload?.data?.resource_id ?? payload?.resource_id ?? payload?.data?.id;
	if (!resourceId) {
		throw new Error('storage upload response missing resource_id');
	}

	return `https://storage.codesocean.top/api/resource/get/${resourceId}`;
}

async function main() {
	const args = parseArgs(process.argv);
	const containerId = process.env.STORAGE_CONTAINER ?? '172018735018984';

	const allEntries = await fs.promises.readdir(args.dir, { withFileTypes: true });
	let files = allEntries
		.filter((e) => e.isFile())
		.map((e) => path.join(args.dir, e.name))
		.filter((p) => {
			const ext = path.extname(p).toLowerCase();
			return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
		})
		.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));

	if (args.limit && Number.isFinite(args.limit)) {
		files = files.slice(0, Math.max(0, args.limit));
	}

	if (files.length === 0) {
		console.log('no image files found');
		return;
	}

	if (args.dryRun) {
		console.log(`dry-run: files=${files.length}`);
		for (let i = 0; i < Math.min(10, files.length); i++) {
			console.log(path.basename(files[i]));
		}
		return;
	}

	const serviceKey = process.env.STORAGE_SERVICE_KEY;
	if (!serviceKey) {
		throw new Error('missing env STORAGE_SERVICE_KEY');
	}

	const user0 = await query('SELECT user_id FROM users WHERE user_id = 520', []);
	if (!user0 || user0.length === 0) {
		throw new Error('user_id=520 not found in users table');
	}

	let successCount = 0;
	let failCount = 0;

	for (let index = 0; index < files.length; index++) {
		const filePath = files[index];
		const fileName = path.basename(filePath);
		try {
			const url = await uploadToStorage({ filePath, containerId, serviceKey });
			await query(
				'INSERT INTO stickers (user_id, url, is_private, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
				[520, url, args.isPrivate ? 1 : 0],
			);
			console.log(`[${index + 1}/${files.length}] uploaded ${fileName}`);
			successCount++;
		} catch (error) {
			console.error(`[${index + 1}/${files.length}] failed ${fileName}`, error?.message ?? error);
			failCount++;
		}
	}

	console.log(`done: success=${successCount} failed=${failCount}`);
}

main().catch((e) => {
	console.error(e?.message ?? e);
	process.exitCode = 1;
});
