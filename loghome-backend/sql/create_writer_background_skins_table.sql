CREATE TABLE IF NOT EXISTS writer_background_skins (
	skin_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	skin_key VARCHAR(64) NOT NULL COMMENT 'Stable key saved by the writer client',
	skin_name VARCHAR(64) NOT NULL COMMENT 'Name displayed in the writer settings',
	theme_key VARCHAR(64) NOT NULL DEFAULT 'yellow' COMMENT 'Base theme key applied with this image skin',
	image_url VARCHAR(1024) NOT NULL COMMENT 'HTTPS background image URL or /static/ project asset path',
	overlay_color VARCHAR(32) NOT NULL DEFAULT 'rgba(255,255,255,0.62)' COMMENT 'Overlay used to preserve text readability',
	background_size VARCHAR(16) NOT NULL DEFAULT 'cover' COMMENT 'cover, contain, or auto',
	background_position VARCHAR(32) NOT NULL DEFAULT 'center' COMMENT 'CSS background position',
	background_repeat VARCHAR(16) NOT NULL DEFAULT 'no-repeat' COMMENT 'CSS background repeat mode',
	required_membership ENUM('none', 'standard', 'super') NOT NULL DEFAULT 'none' COMMENT 'Minimum membership required to use this skin',
	sort_order INT NOT NULL DEFAULT 0 COMMENT 'Display order',
	is_enabled TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Whether this skin is available to clients',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (skin_id),
	UNIQUE KEY uniq_skin_key (skin_key),
	KEY idx_enabled_order (is_enabled, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Predefined writer editor background image skins';
