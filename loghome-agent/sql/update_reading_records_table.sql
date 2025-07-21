-- 更新reading_records表，移除user_id字段
-- 如果表不存在，先创建新表
DROP TABLE IF EXISTS `reading_records`;

CREATE TABLE `reading_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_id` int(11) NOT NULL COMMENT '文章ID',
  `novel_id` int(11) DEFAULT NULL COMMENT '小说ID（可选）',
  `read_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '阅读时间',
  `read_duration` int(11) DEFAULT 0 COMMENT '阅读时长（秒）',
  `read_progress` decimal(5,2) DEFAULT 0.00 COMMENT '阅读进度（0-100）',
  `is_finished` tinyint(1) DEFAULT 0 COMMENT '是否读完（0未读完，1已读完）',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_article_id` (`article_id`),
  KEY `idx_novel_id` (`novel_id`),
  KEY `idx_read_time` (`read_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章阅读记录表';

-- 如果表已存在且有数据，可以使用以下ALTER语句（但建议先备份数据）
-- ALTER TABLE `reading_records` DROP COLUMN `user_id`; 