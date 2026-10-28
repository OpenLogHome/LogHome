const crypto = require('crypto');

const DOWNLOAD_TTL_MS = 15 * 60 * 1000;
const MAX_CACHE_BYTES = 128 * 1024 * 1024;

// Short-lived capability links let the system browser download without exposing a login token.
// Files remain in this process only; restarting it invalidates outstanding links.
function createDownloadStore({ now = Date.now, ttl = DOWNLOAD_TTL_MS, maxBytes = MAX_CACHE_BYTES } = {}) {
	const entries = new Map();
	let totalBytes = 0;
	function prune() {
		for (const [token, entry] of entries) {
			if (entry.expiresAt <= now()) {
				entries.delete(token);
				totalBytes -= entry.buffer.length;
			}
		}
	}
	return {
		prune,
		put(buffer, filename, contentType) {
			prune();
			if (!Buffer.isBuffer(buffer) || !buffer.length) throw new Error('导出文件为空');
			if (buffer.length > maxBytes - totalBytes) {
				throw Object.assign(new Error('导出文件缓存已满，请稍后重试'), { statusCode: 503 });
			}
			const token = crypto.randomBytes(24).toString('hex');
			entries.set(token, { buffer, filename, contentType, expiresAt: now() + ttl });
			totalBytes += buffer.length;
			return { download_url: `/essays/download_export/${token}`, filename, expires_in: Math.floor(ttl / 1000) };
		},
		get(token) {
			prune();
			if (typeof token !== 'string' || !/^[a-f0-9]{48}$/.test(token)) return null;
			return entries.get(token) || null;
		},
	};
}

const downloads = createDownloadStore();
const cleanupTimer = setInterval(() => downloads.prune(), 60 * 1000);
cleanupTimer.unref();

module.exports = { createDownloadStore, downloads };
