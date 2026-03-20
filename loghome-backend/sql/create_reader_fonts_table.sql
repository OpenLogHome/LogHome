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
