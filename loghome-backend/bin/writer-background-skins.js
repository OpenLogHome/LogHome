const { query } = require('../sql.js');

async function getEnabledWriterBackgroundSkins() {
	return query(
		`SELECT
			skin_id,
			skin_key,
			skin_name,
			theme_key,
			image_url,
			overlay_color,
			background_size,
			background_position,
			background_repeat,
			required_membership,
			sort_order
		FROM writer_background_skins
		WHERE is_enabled = 1
		ORDER BY sort_order ASC, skin_id ASC`,
	);
}

module.exports = {
	getEnabledWriterBackgroundSkins,
};
