-- 创建搜索关键词表
CREATE TABLE IF NOT EXISTS `search_keywords` (
  `keyword_id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` varchar(255) NOT NULL COMMENT '搜索关键词',
  `search_count` int(11) NOT NULL DEFAULT '0' COMMENT '搜索次数',
  `category` varchar(50) NOT NULL DEFAULT 'all' COMMENT '关键词分类：all, books, posts, circles, users',
  `is_recommended` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否推荐',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：1-有效，0-无效',
  `last_searched_at` datetime DEFAULT NULL COMMENT '最后搜索时间',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`keyword_id`),
  UNIQUE KEY `keyword` (`keyword`),
  KEY `idx_category` (`category`),
  KEY `idx_search_count` (`search_count`),
  KEY `idx_is_recommended` (`is_recommended`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='搜索关键词表'; 