const { query } = require('../sql.js');

const CREATE_READER_FONTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS reader_fonts (
	font_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	font_key VARCHAR(64) NOT NULL COMMENT 'Font key used by frontend',
	font_name VARCHAR(64) NOT NULL COMMENT 'Display name',
	regular_family VARCHAR(128) NOT NULL COMMENT 'Regular CSS font-family name',
	regular_url VARCHAR(1024) NOT NULL COMMENT 'Regular font download URL',
	regular_format VARCHAR(16) NOT NULL DEFAULT 'ttf' COMMENT 'Regular font format',
	bold_family VARCHAR(128) DEFAULT NULL COMMENT 'Bold CSS font-family name',
	bold_url VARCHAR(1024) DEFAULT NULL COMMENT 'Bold font download URL',
	bold_format VARCHAR(16) DEFAULT NULL COMMENT 'Bold font format',
	font_version VARCHAR(32) NOT NULL DEFAULT '1' COMMENT 'Font version used for cache invalidation',
	sort_order INT NOT NULL DEFAULT 0 COMMENT 'Sort order',
	is_enabled TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Whether this font is enabled',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (font_id),
	UNIQUE KEY uniq_font_key (font_key),
	KEY idx_enabled_order (is_enabled, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Reader font configurations';
`;

const DEFAULT_READER_FONTS = [
	{
		font_key: '方正书宋',
		font_name: '方正书宋',
		regular_family: 'FangZhengShuSongJianTi',
		regular_url: 'https://storage.codesocean.top/api/resource/download/177381841456048',
		regular_format: 'ttf',
		bold_family: 'FangZhengShuSongJianTi',
		bold_url: 'https://storage.codesocean.top/api/resource/download/177381841456048',
		bold_format: 'ttf',
		font_version: '20260318',
		sort_order: 10,
	},
	{
		font_key: '思源黑体',
		font_name: '思源黑体',
		regular_family: 'SourceHanSansSCRegular',
		regular_url: 'https://storage.codesocean.top/api/resource/download/177381841455677',
		regular_format: 'otf',
		bold_family: 'SourceHanSansSCBold',
		bold_url: 'https://storage.codesocean.top/api/resource/download/177381841453935',
		bold_format: 'otf',
		font_version: '20260318',
		sort_order: 20,
	},
	{
		font_key: '方正楷体',
		font_name: '方正楷体',
		regular_family: 'FangZhengKaiTiJianTi',
		regular_url: 'https://storage.codesocean.top/api/resource/download/177381841453504',
		regular_format: 'ttf',
		bold_family: 'FangZhengKaiTiJianTi',
		bold_url: 'https://storage.codesocean.top/api/resource/download/177381841453504',
		bold_format: 'ttf',
		font_version: '20260318',
		sort_order: 30,
	},
	{
		font_key: '霞鹜文楷',
		font_name: '霞鹜文楷',
		regular_family: 'LXGWWenKaiRegular',
		regular_url: 'https://storage.codesocean.top/api/resource/download/177381841453453',
		regular_format: 'ttf',
		bold_family: 'LXGWWenKaiMedium',
		bold_url: 'https://storage.codesocean.top/api/resource/download/177381841454916',
		bold_format: 'ttf',
		font_version: '20260318',
		sort_order: 40,
	},
];

let ensureTablePromise = null;

async function seedDefaultReaderFonts() {
	for (const font of DEFAULT_READER_FONTS) {
		await query(
			`INSERT INTO reader_fonts (
				font_key,
				font_name,
				regular_family,
				regular_url,
				regular_format,
				bold_family,
				bold_url,
				bold_format,
				font_version,
				sort_order,
				is_enabled
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
			ON DUPLICATE KEY UPDATE
				font_name = VALUES(font_name),
				regular_family = VALUES(regular_family),
				regular_url = VALUES(regular_url),
				regular_format = VALUES(regular_format),
				bold_family = VALUES(bold_family),
				bold_url = VALUES(bold_url),
				bold_format = VALUES(bold_format),
				font_version = VALUES(font_version),
				sort_order = VALUES(sort_order)`,
			[
				font.font_key,
				font.font_name,
				font.regular_family,
				font.regular_url,
				font.regular_format,
				font.bold_family,
				font.bold_url,
				font.bold_format,
				font.font_version,
				font.sort_order,
			],
		);
	}
}

async function ensureReaderFontsTable() {
	if (!ensureTablePromise) {
		ensureTablePromise = (async () => {
			await query(CREATE_READER_FONTS_TABLE_SQL);
			await seedDefaultReaderFonts();
		})().catch((error) => {
			ensureTablePromise = null;
			throw error;
		});
	}

	return ensureTablePromise;
}

async function getEnabledReaderFonts() {
	await ensureReaderFontsTable();
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
	CREATE_READER_FONTS_TABLE_SQL,
	DEFAULT_READER_FONTS,
	ensureReaderFontsTable,
	getEnabledReaderFonts,
};
