CREATE TABLE IF NOT EXISTS avatar_frames (
	frame_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '头像框ID',
	code VARCHAR(64) NOT NULL COMMENT '稳定业务标识',
	name VARCHAR(64) NOT NULL COMMENT '头像框名称',
	asset_url VARCHAR(500) NOT NULL COMMENT '完整头像框资源地址',
	thumbnail_url VARCHAR(500) NOT NULL COMMENT '静态缩略图地址',
	required_tier ENUM('free', 'standard', 'super') NOT NULL DEFAULT 'free' COMMENT '最低通行证档位',
	is_animated TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否为动画头像框',
	avatar_scale DECIMAL(5,4) NOT NULL DEFAULT 0.5800 COMMENT '头像相对外框的缩放比例',
	offset_x DECIMAL(6,2) NOT NULL DEFAULT 0.00 COMMENT '头像水平偏移百分比',
	offset_y DECIMAL(6,2) NOT NULL DEFAULT 0.00 COMMENT '头像垂直偏移百分比',
	status ENUM('draft', 'active', 'disabled') NOT NULL DEFAULT 'draft' COMMENT '素材状态',
	sort_order INT NOT NULL DEFAULT 0 COMMENT '展示顺序',
	source VARCHAR(255) NULL COMMENT '素材来源说明',
	license_status ENUM('pending', 'cleared', 'blocked') NOT NULL DEFAULT 'pending' COMMENT '授权状态',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (frame_id),
	UNIQUE KEY uniq_avatar_frame_code (code),
	KEY idx_avatar_frame_status_sort (status, sort_order),
	KEY idx_avatar_frame_tier_status (required_tier, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='头像框素材目录';

CREATE TABLE IF NOT EXISTS user_avatar_frame_selections (
	user_id INT NOT NULL COMMENT '用户ID',
	frame_id INT UNSIGNED NOT NULL COMMENT '当前选择的头像框ID',
	selected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (user_id),
	KEY idx_user_avatar_frame_frame (frame_id),
	CONSTRAINT fk_user_avatar_frame_user
		FOREIGN KEY (user_id) REFERENCES users (user_id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_user_avatar_frame_frame
		FOREIGN KEY (frame_id) REFERENCES avatar_frames (frame_id)
		ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户当前头像框选择';

DELETE FROM user_avatar_frame_selections WHERE frame_id IN (4, 6, 27);
DELETE FROM avatar_frames WHERE frame_id IN (4, 6, 27);

INSERT INTO avatar_frames
	(frame_id, code, name, asset_url, thumbnail_url, required_tier, is_animated,
	 avatar_scale, offset_x, offset_y, status, sort_order, source, license_status)
VALUES
	(1,  'devil-pink',       '恶魔心焰',   'https://storage.codesocean.top/api/resource/get/179135800369649', 'https://storage.codesocean.top/api/resource/get/179135800483750', 'super',    0, 0.5400,  0.60,  1.40, 'active',  10, 'MoeBlog 开源社区公共素材', 'cleared'),
	(2,  'winter-snow',      '冬日初雪',   'https://storage.codesocean.top/api/resource/get/179135800558341', 'https://storage.codesocean.top/api/resource/get/179135800650582', 'standard', 0, 0.5700, -0.60,  2.10, 'active',  20, 'MoeBlog 开源社区公共素材', 'cleared'),
	(3,  'prism-gem',        '虹彩宝石',   'https://storage.codesocean.top/api/resource/get/179135800736493', 'https://storage.codesocean.top/api/resource/get/179135800813294', 'super',    0, 0.6000,  0.20, -1.20, 'active',  30, 'MoeBlog 开源社区公共素材', 'cleared'),
	(5,  'green-garden',     '青野花环',   'https://storage.codesocean.top/api/resource/get/179135800890855', 'https://storage.codesocean.top/api/resource/get/179135800974676', 'free',     0, 0.6500, -0.20, -0.60, 'active',  50, 'MoeBlog 开源社区公共素材', 'cleared'),
	(7,  'candy-wreath',     '糖果花环',   'https://storage.codesocean.top/api/resource/get/179135801045407', 'https://storage.codesocean.top/api/resource/get/179135801125278', 'free',     0, 0.6100,  0.60,  1.40, 'active',  70, 'MoeBlog 开源社区公共素材', 'cleared'),
	(8,  'starlight-moon',   '星月长夜',   'https://storage.codesocean.top/api/resource/get/179135801195919', 'https://storage.codesocean.top/api/resource/get/179135801273850', 'super',    0, 0.5900, -1.20, -1.20, 'active',  80, 'MoeBlog 开源社区公共素材', 'cleared'),
	(9,  'cat-donut',        '猫咪甜甜圈', 'https://storage.codesocean.top/api/resource/get/179135801342821', 'https://storage.codesocean.top/api/resource/get/179135801689572', 'standard', 1, 0.5800, -0.20,  0.00, 'active',  90, 'MoeBlog 开源社区公共素材', 'cleared'),
	(10, 'fortune-blossom',  '福运梅花',   'https://storage.codesocean.top/api/resource/get/179135801760083', 'https://storage.codesocean.top/api/resource/get/179135801843074', 'standard', 0, 0.6100, -1.80,  0.20, 'active', 100, 'MoeBlog 开源社区公共素材', 'cleared'),
	(11, 'panda-fortune',    '熊猫纳福',   'https://storage.codesocean.top/api/resource/get/179135801917835', 'https://storage.codesocean.top/api/resource/get/179135801994086', 'standard', 0, 0.5900, -0.20,  1.80, 'active', 110, 'MoeBlog 开源社区公共素材', 'cleared'),
	(12, 'forest-wreath',    '森语花环',   'https://storage.codesocean.top/api/resource/get/179135802065877', 'https://storage.codesocean.top/api/resource/get/179135802154688', 'free',     0, 0.6500, -1.00,  0.60, 'active', 120, 'MoeBlog 开源社区公共素材', 'cleared'),
	(13, 'cyber-cat',        '赛博猫耳',   'https://storage.codesocean.top/api/resource/get/179135802227339', 'https://storage.codesocean.top/api/resource/get/179135802816390', 'super',    1, 0.5700,  0.20,  2.20, 'active', 130, 'MoeBlog 开源社区公共素材', 'cleared'),
	(14, 'purple-ribbon',    '紫韵花结',   'https://storage.codesocean.top/api/resource/get/179135802958281', 'https://storage.codesocean.top/api/resource/get/179135803065782', 'standard', 0, 0.6100,  0.30,  2.40, 'active', 140, 'MoeBlog 开源社区公共素材', 'cleared'),
	(15, 'sunny-companion',  '暖阳相伴',   'https://storage.codesocean.top/api/resource/get/179135803153573', 'https://storage.codesocean.top/api/resource/get/179135803248864', 'free',     0, 0.5900, -2.30,  3.70, 'active', 150, 'MoeBlog 开源社区公共素材', 'cleared'),
	(16, 'lucky-cat',        '招财猫咪',   'https://storage.codesocean.top/api/resource/get/179135803321275', 'https://storage.codesocean.top/api/resource/get/179135803395216', 'free',     0, 0.6100, -1.20, -2.20, 'active', 160, 'MoeBlog 开源社区公共素材', 'cleared'),
	(17, 'golden-flame',     '鎏金焰心',   'https://storage.codesocean.top/api/resource/get/179135803475767', 'https://storage.codesocean.top/api/resource/get/179135803549098', 'super',    0, 0.6200, -0.20, -2.50, 'active', 170, 'MoeBlog 开源社区公共素材', 'cleared'),
	(18, 'lantern-cloud',    '灯笼祥云',   'https://storage.codesocean.top/api/resource/get/179135803620139', 'https://storage.codesocean.top/api/resource/get/179135803701720', 'standard', 0, 0.6200,  4.40,  1.70, 'active', 180, 'MoeBlog 开源社区公共素材', 'cleared'),
	(19, 'cat-maid',         '猫耳女仆',   'https://storage.codesocean.top/api/resource/get/179135803770011', 'https://storage.codesocean.top/api/resource/get/179135803853632', 'standard', 0, 0.5800,  0.30, -3.40, 'active', 190, 'MoeBlog 开源社区公共素材', 'cleared'),
	(20, 'night-companion',  '夜色相伴',   'https://storage.codesocean.top/api/resource/get/179135803926573', 'https://storage.codesocean.top/api/resource/get/179135803999254', 'super',    0, 0.5800, -0.10,  8.50, 'active', 200, 'MoeBlog 开源社区公共素材', 'cleared'),
	(21, 'forest-companion', '森林相伴',   'https://storage.codesocean.top/api/resource/get/179135804069495', 'https://storage.codesocean.top/api/resource/get/179135804145966', 'standard', 0, 0.5900, -1.70,  4.20, 'active', 210, 'MoeBlog 开源社区公共素材', 'cleared'),
	(22, 'sleepy-maid',      '午后小憩',   'https://storage.codesocean.top/api/resource/get/179135804215297', 'https://storage.codesocean.top/api/resource/get/179135804352118', 'standard', 0, 0.5900,  0.00,  5.30, 'active', 220, 'MoeBlog 开源社区公共素材', 'cleared'),
	(23, 'royal-laurel',     '赤金月桂',   'https://storage.codesocean.top/api/resource/get/179135804427609', 'https://storage.codesocean.top/api/resource/get/179135804498530', 'super',    0, 0.6000,  0.20, -2.30, 'active', 230, 'MoeBlog 开源社区公共素材', 'cleared'),
	(24, 'egg-ribbon',       '懒蛋丝带',   'https://storage.codesocean.top/api/resource/get/179135804568651', 'https://storage.codesocean.top/api/resource/get/179135804642472', 'free',     0, 0.6000, -1.80, -0.60, 'active', 240, 'MoeBlog 开源社区公共素材', 'cleared'),
	(25, 'rabbit-picnic',    '兔兔野餐',   'https://storage.codesocean.top/api/resource/get/179135804711343', 'https://storage.codesocean.top/api/resource/get/179135805709654', 'super',    1, 0.5900, -1.20,  3.30, 'active', 250, 'MoeBlog 开源社区公共素材', 'cleared'),
	(26, 'crystal-stage',    '水晶舞台',   'https://storage.codesocean.top/api/resource/get/179135805785385', 'https://storage.codesocean.top/api/resource/get/179135805862856', 'super',    0, 0.6000,  0.20, -1.80, 'active', 260, 'MoeBlog 开源社区公共素材', 'cleared'),
	(28, 'hamster-blossom',  '仓鼠迎春',   'https://storage.codesocean.top/api/resource/get/179135805932527', 'https://storage.codesocean.top/api/resource/get/179135806015188', 'free',     0, 0.6000, -0.20,  0.60, 'active', 280, 'MoeBlog 开源社区公共素材', 'cleared')
ON DUPLICATE KEY UPDATE
	name = VALUES(name),
	asset_url = VALUES(asset_url),
	thumbnail_url = VALUES(thumbnail_url),
	required_tier = VALUES(required_tier),
	is_animated = VALUES(is_animated),
	avatar_scale = VALUES(avatar_scale),
	offset_x = VALUES(offset_x),
	offset_y = VALUES(offset_y),
	status = VALUES(status),
	sort_order = VALUES(sort_order),
	source = VALUES(source),
	license_status = VALUES(license_status);
