-- 创建记忆表
CREATE TABLE IF NOT EXISTS `user_memories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL COMMENT '用户ID',
  `object_type` enum('novel','article','user') NOT NULL COMMENT '记忆对象类型',
  `object_id` varchar(50) NOT NULL COMMENT '记忆对象ID',
  `content` text NOT NULL COMMENT '记忆内容',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_object` (`user_id`,`object_type`,`object_id`),
  KEY `idx_object` (`object_type`,`object_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户记忆表'; 