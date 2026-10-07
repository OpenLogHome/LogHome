// Upload with STORAGE_SERVICE_KEY; --apply updates catalog URLs after public byte verification.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const FormData = require('form-data');
const mysql = require('mysql');
const root = path.resolve(__dirname, '../../loghome-app-frontend');
const manifestPath = path.join(root, 'common/avatar-frame-assets.json');
const assetDir = path.join(root, 'static/avatar-frames');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};

async function verify(entry) {
	const response = await axios.get(entry.url, { responseType: 'arraybuffer', timeout: 60000 });
	if (!String(response.headers['content-type']).startsWith('image/')) throw new Error('Public resource is not an image');
	if (hash(response.data) !== entry.sha256) throw new Error('Public resource bytes differ from local asset');
}

async function main() {
	const files = fs.readdirSync(assetDir).filter(name => /\.(png|gif)$/.test(name)).sort();
	const paths = files.flatMap(name => [`/static/avatar-frames/${name}`, `/static/avatar-frames/thumbnails/${path.parse(name).name}.webp`]);
	for (const [index, localPath] of paths.entries()) {
		const filePath = path.join(root, localPath.slice(1));
		const sha256 = hash(fs.readFileSync(filePath));
		let entry = manifest[localPath];
		if (!entry || entry.sha256 !== sha256) {
			if (!process.argv.includes('--upload') || !process.env.STORAGE_SERVICE_KEY) throw new Error('Upload requires --upload and STORAGE_SERVICE_KEY');
			const form = new FormData();
			form.append('file', fs.createReadStream(filePath));
			const container = process.env.STORAGE_CONTAINER || '172018735018984';
			const response = await axios.post(`https://storage.codesocean.top/api/resource/upload?container=${encodeURIComponent(container)}`, form, {
				headers: { ...form.getHeaders(), ServiceKey: process.env.STORAGE_SERVICE_KEY }, timeout: 60000, maxBodyLength: Infinity,
			});
			const payload = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
			const id = payload?.data?.resource_id ?? payload?.resource_id;
			if (!id || !/^\d+$/.test(String(id))) throw new Error('Upload response missing resource ID');
			entry = { url: `https://storage.codesocean.top/api/resource/get/${id}`, sha256 };
			manifest[localPath] = entry;
			fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
		}
		await verify(entry);
		console.log(`[${index + 1}/${paths.length}] verified ${localPath}`);
	}
	if (!process.argv.includes('--apply')) return;
	const connection = mysql.createConnection(require('../config').database);
	const query = (sql, values = []) => new Promise((resolve, reject) => connection.query(sql, values, (error, rows) => error ? reject(error) : resolve(rows)));
	try {
		await query('START TRANSACTION');
		const rows = await query('SELECT frame_id,asset_url,thumbnail_url FROM avatar_frames FOR UPDATE');
		fs.mkdirSync(path.resolve(__dirname, '../../_tmp'), { recursive: true });
		const backup = path.resolve(__dirname, `../../_tmp/avatar-frame-urls-backup-${Date.now()}.json`);
		fs.writeFileSync(backup, JSON.stringify(rows, null, 2) + '\n');
		let updated = 0;
		for (const row of rows) {
			const asset = manifest[row.asset_url]?.url || row.asset_url;
			const thumb = manifest[row.thumbnail_url]?.url || row.thumbnail_url;
			if (asset === row.asset_url && thumb === row.thumbnail_url) continue;
			await query('UPDATE avatar_frames SET asset_url=?,thumbnail_url=? WHERE frame_id=?', [asset, thumb, row.frame_id]);
			updated++;
		}
		await query('COMMIT');
		const seedPath = path.join(__dirname, '../sql/create_avatar_frames_tables.sql');
		let seed = fs.readFileSync(seedPath, 'utf8');
		for (const [localPath, entry] of Object.entries(manifest)) seed = seed.split(`'${localPath}'`).join(`'${entry.url}'`);
		fs.writeFileSync(seedPath, seed);
		console.log(`Updated ${updated} catalog records and seed URLs; backup: ${backup}`);
	} catch (error) {
		await query('ROLLBACK');
		throw error;
	} finally { connection.end(); }
}
main().catch(error => {
	// Do not log Axios request configs: they contain the storage service credential.
	console.error(error.response ? `Storage HTTP ${error.response.status}` : error.message);
	process.exitCode = 1;
});
