const crypto = require('crypto');
const { query } = require('../sql');
const secrets = require('../SECRET');

function base64UrlDecode(value) {
	const source = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
	const padded = source.padEnd(source.length + ((4 - (source.length % 4)) % 4), '=');
	return Buffer.from(padded, 'base64').toString('utf8');
}

function base64UrlEncode(buffer) {
	return Buffer.from(buffer)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/g, '');
}

function verifyJwt(token) {
	const rawToken = String(token || '').trim();
	const parts = rawToken.split('.');
	if (parts.length !== 3) {
		return null;
	}

	let header;
	let payload;
	try {
		header = JSON.parse(base64UrlDecode(parts[0]));
		payload = JSON.parse(base64UrlDecode(parts[1]));
	} catch (error) {
		return null;
	}

	if (!header || header.alg !== 'HS256') {
		return null;
	}

	const secret = String(secrets.SECRET || process.env.JWT_SECRET || '');
	if (!secret) {
		return null;
	}

	const expected = base64UrlEncode(
		crypto
			.createHmac('sha256', secret)
			.update(`${parts[0]}.${parts[1]}`)
			.digest()
	);
	const actual = parts[2];
	const expectedBuffer = Buffer.from(expected);
	const actualBuffer = Buffer.from(actual);
	if (
		expectedBuffer.length !== actualBuffer.length
		|| !crypto.timingSafeEqual(expectedBuffer, actualBuffer)
	) {
		return null;
	}

	if (payload.exp && Number(payload.exp) * 1000 < Date.now()) {
		return null;
	}

	return payload;
}

async function getAuthenticatedUser(req) {
	const rawHeader = String(req.headers.authorization || '');
	const token = rawHeader.split(' ').pop();
	const decoded = verifyJwt(token);
	if (!decoded || !decoded.id || !decoded.pwd) {
		return null;
	}

	const rows = await query(
		'SELECT * FROM users WHERE user_id = ? AND pwd = ? AND activated = 1 LIMIT 1',
		[decoded.id, decoded.pwd]
	);
	return rows[0] || null;
}

function extractJwtPayload(req) {
	const rawHeader = String(req.headers.authorization || '');
	const token = rawHeader.split(' ').pop();
	return verifyJwt(token);
}

function requireAuth(req, res, next) {
	const decoded = extractJwtPayload(req);
	if (!decoded || !decoded.id || !decoded.pwd) {
		return res.status(401).json({ msg: '登录已失效' });
	}
	req.auth = decoded;
	next();
}

async function requireUser(req, res, next) {
	const decoded = req.auth || extractJwtPayload(req);
	if (!decoded || !decoded.id || !decoded.pwd) {
		return res.status(401).json({ msg: '登录已失效' });
	}

	const rows = await query(
		'SELECT * FROM users WHERE user_id = ? AND pwd = ? AND activated = 1 LIMIT 1',
		[decoded.id, decoded.pwd]
	);
	if (!rows || !rows[0]) {
		return res.status(401).json({ msg: '登录已失效' });
	}
	req.user = rows[0];
	next();
}

module.exports = {
	verifyJwt,
	getAuthenticatedUser,
	requireAuth,
	requireUser,
};
