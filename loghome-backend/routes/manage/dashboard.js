let express = require('express');
let { query } = require('../../sql.js');
let auth = require('../../bin/adminAuth.js');

let router = express.Router();

async function safeScalar(sql, params = [], fallback = 0) {
	try {
		const rows = await query(sql, params);
		if (!rows || rows.length === 0) return fallback;
		const first = rows[0];
		const value = first.value !== undefined ? first.value : Object.values(first)[0];
		return Number(value) || 0;
	} catch (e) {
		const message = String(e && e.message ? e.message : '');
		if (
			e &&
			(e.code === 'ER_NO_SUCH_TABLE' ||
				e.code === 'ER_BAD_FIELD_ERROR' ||
				message.includes("doesn't exist") ||
				message.includes('Unknown column'))
		) {
			return fallback;
		}
		throw e;
	}
}

router.get('/summary', auth, async function (req, res) {
	try {
		const [
			pendingFaqs,
			pendingArticles,
			pendingReports,
			pendingCircles,
			pendingCommunityPosts,
			searchKeywords,
			recommendedKeywords,
			sensitiveWords,
			pendingRechargeOrders,
			paidRechargeOrders,
			pendingEarningServices,
			unusedGiftCards,
			exchangeRecords,
			activeBanners,
			activePopupPosters,
		] = await Promise.all([
			safeScalar('SELECT COUNT(*) AS value FROM faqs WHERE solved = 0'),
			safeScalar(
				'SELECT COUNT(*) AS value FROM articles WHERE audit_status != ? AND audit_status != ?',
				['Checked', 'Uncheck'],
			),
			safeScalar('SELECT COUNT(*) AS value FROM comm_reports WHERE status = 0'),
			safeScalar('SELECT COUNT(*) AS value FROM comm_circles WHERE status = 0'),
			safeScalar('SELECT COUNT(*) AS value FROM comm_posts WHERE status = 0'),
			safeScalar('SELECT COUNT(*) AS value FROM search_keywords WHERE status = 1'),
			safeScalar(
				'SELECT COUNT(*) AS value FROM search_keywords WHERE status = 1 AND is_recommended = 1',
			),
			safeScalar('SELECT COUNT(*) AS value FROM comm_sensitive_words'),
			safeScalar(
				'SELECT COUNT(*) AS value FROM recharge_payments WHERE status = ? AND payment_id NOT LIKE ? AND payment_id NOT LIKE ?',
				['created', 'GIFT-%', 'EXCHANGE-%'],
			),
			safeScalar(
				'SELECT COUNT(*) AS value FROM recharge_payments WHERE status = ? AND payment_id NOT LIKE ? AND payment_id NOT LIKE ?',
				['paid', 'GIFT-%', 'EXCHANGE-%'],
			),
			safeScalar('SELECT COUNT(*) AS value FROM earning_service WHERE finished = 0'),
			safeScalar('SELECT COUNT(*) AS value FROM log_gift_card WHERE is_used = 0'),
			safeScalar('SELECT COUNT(*) AS value FROM recharge_payments WHERE payment_id LIKE ?', ['EXCHANGE-%']),
			safeScalar('SELECT COUNT(*) AS value FROM banners WHERE is_active = 1'),
			safeScalar(
				'SELECT COUNT(*) AS value FROM popup_posters WHERE start_time <= NOW() AND end_time >= NOW()',
			),
		]);

		res.json({
			content: {
				pendingFaqs,
				pendingArticles,
			},
			community: {
				pendingReports,
				pendingCircles,
				pendingCommunityPosts,
				searchKeywords,
				recommendedKeywords,
				sensitiveWords,
			},
			payments: {
				pendingRechargeOrders,
				paidRechargeOrders,
				pendingEarningServices,
				unusedGiftCards,
				exchangeRecords,
			},
			operations: {
				activeBanners,
				activePopupPosters,
			},
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({ msg: 'bad request' });
	}
});

module.exports = router;
