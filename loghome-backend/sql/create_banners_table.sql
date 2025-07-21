-- 创建banners表SQL
CREATE TABLE IF NOT EXISTS `banners` (
  `banner_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `image_url` varchar(255) NOT NULL COMMENT '图片URL',
  `link_url` varchar(255) DEFAULT NULL COMMENT '链接URL',
  `page_location` varchar(50) NOT NULL DEFAULT 'library' COMMENT '页面位置',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否激活',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `order` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`banner_id`),
  KEY `idx_page_active` (`page_location`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='网站横幅广告表';

-- 插入示例数据
INSERT INTO `banners` (`title`, `image_url`, `link_url`, `page_location`, `is_active`, `start_time`, `end_time`, `order`) VALUES
('新书发布', 'https://example.com/images/banner1.jpg', '/pages/readers/bookInfo?id=1', 'library', 1, NULL, NULL, 1),
('作者招募', 'https://example.com/images/banner2.jpg', '/pages/community/join', 'library', 1, NULL, NULL, 2),
('阅读大赛', 'https://example.com/images/banner3.jpg', '/pages/activity/reading', 'bookcase', 1, NULL, NULL, 1);
