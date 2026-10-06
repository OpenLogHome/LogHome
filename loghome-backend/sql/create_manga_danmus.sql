-- 漫画弹幕表：弹幕与作品、话数及阅读页码（page_idx，0 基）绑定
CREATE TABLE IF NOT EXISTS `manga_danmus` (
  `danmu_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '发送用户',
  `novel_id` int(11) NOT NULL COMMENT '作品ID',
  `article_id` int(11) NOT NULL COMMENT '话数ID',
  `page_idx` int(11) NOT NULL DEFAULT '0' COMMENT '绑定的页码（0基）',
  `content` varchar(150) NOT NULL COMMENT '弹幕内容',
  `danmu_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '软删标记',
  PRIMARY KEY (`danmu_id`),
  KEY `idx_manga_page` (`novel_id`, `article_id`, `page_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='漫画弹幕表';
