const { query, withTransaction } = require('../sql.js');
const membership = require('./membership.js');

const TIER_RANKS = Object.freeze({ free: 0, standard: 1, super: 2 });

function createBusinessError(message, statusCode = 400, code = 'AVATAR_FRAME_ERROR') {
	const error = new Error(message);
	error.isBusinessError = true;
	error.statusCode = statusCode;
	error.code = code;
	return error;
}

function serializeFrame(row) {
	if (!row) return null;
	return {
		frame_id: Number(row.frame_id),
		code: row.code,
		name: row.name,
		asset_url: row.asset_url,
		thumbnail_url: row.thumbnail_url,
		required_tier: row.required_tier,
		is_animated: Boolean(row.is_animated),
		avatar_scale: Number(row.avatar_scale || 0.58),
		offset_x: Number(row.offset_x || 0),
		offset_y: Number(row.offset_y || 0),
	};
}

function getMembershipRank(subscription) {
	if (!subscription) return TIER_RANKS.free;
	return TIER_RANKS[subscription.membership_type] || TIER_RANKS.free;
}

async function getSelectedFrameId(userId, databaseQuery = query) {
	const rows = await databaseQuery(
		'SELECT frame_id FROM user_avatar_frame_selections WHERE user_id = ? LIMIT 1',
		[Number(userId)],
	);
	return rows.length > 0 ? Number(rows[0].frame_id) : null;
}

async function getCatalogForUser(userId) {
	const [frames, subscription, selectedFrameId] = await Promise.all([
		query(
			`SELECT * FROM avatar_frames
			 WHERE status = 'active' AND license_status = 'cleared'
			 ORDER BY sort_order ASC, frame_id ASC`,
		),
		membership.getCurrentSubscription(userId),
		getSelectedFrameId(userId),
	]);
	const membershipRank = getMembershipRank(subscription);
	return {
		membership_type: subscription ? subscription.membership_type : '',
		selected_frame_id: selectedFrameId,
		frames: frames.map((row) => {
			const frame = serializeFrame(row);
			const canUse = membershipRank >= TIER_RANKS[frame.required_tier];
			return {
				...frame,
				can_use: canUse,
				selected: selectedFrameId === frame.frame_id,
				locked_reason: canUse ? '' : frame.required_tier,
			};
		}),
	};
}

async function selectAvatarFrame(userId, frameId) {
	const normalizedFrameId = frameId === null || frameId === undefined || frameId === ''
		? null
		: Number(frameId);
	if (normalizedFrameId !== null && (!Number.isInteger(normalizedFrameId) || normalizedFrameId <= 0)) {
		throw createBusinessError('头像挂件参数无效', 422, 'INVALID_AVATAR_FRAME_ID');
	}

	return withTransaction(async (databaseQuery) => {
		if (normalizedFrameId === null) {
			await databaseQuery('DELETE FROM user_avatar_frame_selections WHERE user_id = ?', [Number(userId)]);
			return { selected_frame_id: null, avatar_frame: null };
		}

		const frameRows = await databaseQuery(
			`SELECT * FROM avatar_frames
			 WHERE frame_id = ? AND status = 'active' AND license_status = 'cleared'
			 LIMIT 1 FOR UPDATE`,
			[normalizedFrameId],
		);
		if (frameRows.length === 0) {
			throw createBusinessError('头像挂件不存在或已下架', 404, 'AVATAR_FRAME_NOT_AVAILABLE');
		}

		const frame = serializeFrame(frameRows[0]);
		const subscription = await membership.getCurrentSubscription(userId, databaseQuery, true);
		if (getMembershipRank(subscription) < TIER_RANKS[frame.required_tier]) {
			throw createBusinessError(
				frame.required_tier === 'super' ? '该头像挂件需要超级原木通行证' : '该头像挂件需要原木通行证',
				403,
				'AVATAR_FRAME_MEMBERSHIP_REQUIRED',
			);
		}

		await databaseQuery(
			`INSERT INTO user_avatar_frame_selections (user_id, frame_id, selected_at, updated_at)
			 VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
			 ON DUPLICATE KEY UPDATE frame_id = VALUES(frame_id), selected_at = CURRENT_TIMESTAMP,
			 updated_at = CURRENT_TIMESTAMP`,
			[Number(userId), normalizedFrameId],
		);
		return { selected_frame_id: normalizedFrameId, avatar_frame: frame };
	}, 'select avatar frame');
}

async function getEffectiveAvatarFrames(userIds) {
	const ids = [...new Set((userIds || []).map(Number).filter((id) => Number.isInteger(id) && id > 0))];
	if (ids.length === 0) return new Map();
	const rows = await query(
		`SELECT selections.user_id, frames.*
		 FROM user_avatar_frame_selections selections
		 INNER JOIN avatar_frames frames ON frames.frame_id = selections.frame_id
		 WHERE selections.user_id IN (?)
		   AND frames.status = 'active'
		   AND frames.license_status = 'cleared'
		   AND (
		     frames.required_tier = 'free'
		     OR EXISTS (
		       SELECT 1 FROM membership_subscriptions subscriptions
		       WHERE subscriptions.user_id = selections.user_id
		         AND subscriptions.status = 'active'
		         AND subscriptions.starts_at <= NOW()
		         AND subscriptions.expires_at > NOW()
		         AND (
		           subscriptions.membership_type = 'super'
		           OR (subscriptions.membership_type = 'standard' AND frames.required_tier = 'standard')
		         )
		     )
		   )`,
		[ids],
	);
	return new Map(rows.map((row) => [Number(row.user_id), serializeFrame(row)]));
}

async function getEffectiveAvatarFrame(userId) {
	const frames = await getEffectiveAvatarFrames([userId]);
	return frames.get(Number(userId)) || null;
}

async function decorateRows(rows, mappings) {
	const safeRows = Array.isArray(rows) ? rows : [];
	const safeMappings = Array.isArray(mappings) ? mappings : [];
	const userIds = [];
	for (const row of safeRows) {
		for (const mapping of safeMappings) userIds.push(row[mapping.userIdField]);
	}
	const frameMap = await getEffectiveAvatarFrames(userIds);
	for (const row of safeRows) {
		for (const mapping of safeMappings) {
			row[mapping.targetField] = frameMap.get(Number(row[mapping.userIdField])) || null;
		}
	}
	return safeRows;
}

module.exports = {
	TIER_RANKS,
	createBusinessError,
	decorateRows,
	getCatalogForUser,
	getEffectiveAvatarFrame,
	getEffectiveAvatarFrames,
	getSelectedFrameId,
	selectAvatarFrame,
	serializeFrame,
};
