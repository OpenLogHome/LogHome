const { query } = require('../sql.js');

async function getEnabledReaderFonts() {
	return query(
		`SELECT
			font_id,
			font_key,
			font_name,
			regular_family,
			regular_url,
			regular_format,
			bold_family,
			bold_url,
			bold_format,
			font_version,
			sort_order
		FROM reader_fonts
		WHERE is_enabled = 1
		ORDER BY sort_order ASC, font_id ASC`,
	);
}

module.exports = {
	getEnabledReaderFonts,
};
