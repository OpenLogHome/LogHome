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
	(1,  'devil-pink',       '恶魔心焰',   '/static/avatar-frames/01.png', '/static/avatar-frames/thumbnails/01.webp', 'super',    0, 0.5400,  0.60,  1.40, 'active',  10, 'MoeBlog 开源社区公共素材', 'cleared'),
	(2,  'winter-snow',      '冬日初雪',   '/static/avatar-frames/02.png', '/static/avatar-frames/thumbnails/02.webp', 'standard', 0, 0.5700, -0.60,  2.10, 'active',  20, 'MoeBlog 开源社区公共素材', 'cleared'),
	(3,  'prism-gem',        '虹彩宝石',   '/static/avatar-frames/03.png', '/static/avatar-frames/thumbnails/03.webp', 'super',    0, 0.6000,  0.20, -1.20, 'active',  30, 'MoeBlog 开源社区公共素材', 'cleared'),
	(5,  'green-garden',     '青野花环',   '/static/avatar-frames/05.png', '/static/avatar-frames/thumbnails/05.webp', 'free',     0, 0.6500, -0.20, -0.60, 'active',  50, 'MoeBlog 开源社区公共素材', 'cleared'),
	(7,  'candy-wreath',     '糖果花环',   '/static/avatar-frames/07.png', '/static/avatar-frames/thumbnails/07.webp', 'free',     0, 0.6100,  0.60,  1.40, 'active',  70, 'MoeBlog 开源社区公共素材', 'cleared'),
	(8,  'starlight-moon',   '星月长夜',   '/static/avatar-frames/08.png', '/static/avatar-frames/thumbnails/08.webp', 'super',    0, 0.5900, -1.20, -1.20, 'active',  80, 'MoeBlog 开源社区公共素材', 'cleared'),
	(9,  'cat-donut',        '猫咪甜甜圈', '/static/avatar-frames/09.gif', '/static/avatar-frames/thumbnails/09.webp', 'standard', 1, 0.5800, -0.20,  0.00, 'active',  90, 'MoeBlog 开源社区公共素材', 'cleared'),
	(10, 'fortune-blossom',  '福运梅花',   '/static/avatar-frames/10.png', '/static/avatar-frames/thumbnails/10.webp', 'standard', 0, 0.6100, -1.80,  0.20, 'active', 100, 'MoeBlog 开源社区公共素材', 'cleared'),
	(11, 'panda-fortune',    '熊猫纳福',   '/static/avatar-frames/11.png', '/static/avatar-frames/thumbnails/11.webp', 'standard', 0, 0.5900, -0.20,  1.80, 'active', 110, 'MoeBlog 开源社区公共素材', 'cleared'),
	(12, 'forest-wreath',    '森语花环',   '/static/avatar-frames/12.png', '/static/avatar-frames/thumbnails/12.webp', 'free',     0, 0.6500, -1.00,  0.60, 'active', 120, 'MoeBlog 开源社区公共素材', 'cleared'),
	(13, 'cyber-cat',        '赛博猫耳',   '/static/avatar-frames/13.gif', '/static/avatar-frames/thumbnails/13.webp', 'super',    1, 0.5700,  0.20,  2.20, 'active', 130, 'MoeBlog 开源社区公共素材', 'cleared'),
	(14, 'purple-ribbon',    '紫韵花结',   '/static/avatar-frames/14.png', '/static/avatar-frames/thumbnails/14.webp', 'standard', 0, 0.6100,  0.30,  2.40, 'active', 140, 'MoeBlog 开源社区公共素材', 'cleared'),
	(15, 'sunny-companion',  '暖阳相伴',   '/static/avatar-frames/15.png', '/static/avatar-frames/thumbnails/15.webp', 'free',     0, 0.5900, -2.30,  3.70, 'active', 150, 'MoeBlog 开源社区公共素材', 'cleared'),
	(16, 'lucky-cat',        '招财猫咪',   '/static/avatar-frames/16.png', '/static/avatar-frames/thumbnails/16.webp', 'free',     0, 0.6100, -1.20, -2.20, 'active', 160, 'MoeBlog 开源社区公共素材', 'cleared'),
	(17, 'golden-flame',     '鎏金焰心',   '/static/avatar-frames/17.png', '/static/avatar-frames/thumbnails/17.webp', 'super',    0, 0.6200, -0.20, -2.50, 'active', 170, 'MoeBlog 开源社区公共素材', 'cleared'),
	(18, 'lantern-cloud',    '灯笼祥云',   '/static/avatar-frames/18.png', '/static/avatar-frames/thumbnails/18.webp', 'standard', 0, 0.6200,  4.40,  1.70, 'active', 180, 'MoeBlog 开源社区公共素材', 'cleared'),
	(19, 'cat-maid',         '猫耳女仆',   '/static/avatar-frames/19.png', '/static/avatar-frames/thumbnails/19.webp', 'standard', 0, 0.5800,  0.30, -3.40, 'active', 190, 'MoeBlog 开源社区公共素材', 'cleared'),
	(20, 'night-companion',  '夜色相伴',   '/static/avatar-frames/20.png', '/static/avatar-frames/thumbnails/20.webp', 'super',    0, 0.5800, -0.10,  8.50, 'active', 200, 'MoeBlog 开源社区公共素材', 'cleared'),
	(21, 'forest-companion', '森林相伴',   '/static/avatar-frames/21.png', '/static/avatar-frames/thumbnails/21.webp', 'standard', 0, 0.5900, -1.70,  4.20, 'active', 210, 'MoeBlog 开源社区公共素材', 'cleared'),
	(22, 'sleepy-maid',      '午后小憩',   '/static/avatar-frames/22.png', '/static/avatar-frames/thumbnails/22.webp', 'standard', 0, 0.5900,  0.00,  5.30, 'active', 220, 'MoeBlog 开源社区公共素材', 'cleared'),
	(23, 'royal-laurel',     '赤金月桂',   '/static/avatar-frames/23.png', '/static/avatar-frames/thumbnails/23.webp', 'super',    0, 0.6000,  0.20, -2.30, 'active', 230, 'MoeBlog 开源社区公共素材', 'cleared'),
	(24, 'egg-ribbon',       '懒蛋丝带',   '/static/avatar-frames/24.png', '/static/avatar-frames/thumbnails/24.webp', 'free',     0, 0.6000, -1.80, -0.60, 'active', 240, 'MoeBlog 开源社区公共素材', 'cleared'),
	(25, 'rabbit-picnic',    '兔兔野餐',   '/static/avatar-frames/25.gif', '/static/avatar-frames/thumbnails/25.webp', 'super',    1, 0.5900, -1.20,  3.30, 'active', 250, 'MoeBlog 开源社区公共素材', 'cleared'),
	(26, 'crystal-stage',    '水晶舞台',   '/static/avatar-frames/26.png', '/static/avatar-frames/thumbnails/26.webp', 'super',    0, 0.6000,  0.20, -1.80, 'active', 260, 'MoeBlog 开源社区公共素材', 'cleared'),
	(28, 'hamster-blossom',  '仓鼠迎春',   '/static/avatar-frames/28.png', '/static/avatar-frames/thumbnails/28.webp', 'free',     0, 0.6000, -0.20,  0.60, 'active', 280, 'MoeBlog 开源社区公共素材', 'cleared')
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
