-- 创建页面操作记录表
CREATE TABLE IF NOT EXISTS `page_operation_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_name` varchar(100) NOT NULL COMMENT '页面名称',
  `operation` varchar(100) DEFAULT NULL COMMENT '执行的操作',
  `params` text DEFAULT NULL COMMENT '操作参数（JSON格式）',
  `reason` text DEFAULT NULL COMMENT '操作原因',
  `page_content` longtext DEFAULT NULL COMMENT '页面内容',
  `ai_response` longtext DEFAULT NULL COMMENT 'AI响应内容',
  `energy_before` int(11) DEFAULT NULL COMMENT '操作前能量',
  `energy_after` int(11) DEFAULT NULL COMMENT '操作后能量',
  `memory_created` tinyint(1) DEFAULT 0 COMMENT '是否创建了记忆',
  `memory_content` text DEFAULT NULL COMMENT '记忆内容（如果创建了记忆）',
  `status` varchar(20) DEFAULT 'success' COMMENT '操作状态（success/error）',
  `error_message` text DEFAULT NULL COMMENT '错误信息',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_page_name` (`page_name`),
  KEY `idx_operation` (`operation`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='页面操作记录表'; 