-- 树场经验球功能数据库迁移脚本
-- 执行前建议备份数据库

CREATE TABLE IF NOT EXISTS `tree_exp_tasks` (
  `task_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `task_code` varchar(64) NOT NULL,
  `task_name` varchar(100) NOT NULL,
  `task_desc` varchar(255) DEFAULT '',
  `source_code` varchar(50) NOT NULL,
  `required_value` int(11) NOT NULL DEFAULT 1,
  `daily_limit` int(11) NOT NULL DEFAULT 1,
  `exp_reward` int(11) NOT NULL DEFAULT 1,
  `icon` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`),
  UNIQUE KEY `uniq_task_code` (`task_code`),
  KEY `idx_enabled_sort` (`is_enabled`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tree_exp_settings` (
  `setting_key` varchar(64) NOT NULL,
  `setting_value` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT '',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_tree_exp_task_daily` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `task_code` varchar(64) NOT NULL,
  `date_key` date NOT NULL,
  `progress_value` bigint(20) NOT NULL DEFAULT 0,
  `completed_times` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_task_date` (`user_id`,`task_code`,`date_key`),
  KEY `idx_user_date` (`user_id`,`date_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tree_exp_orbs` (
  `orb_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `plant_id` int(11) NOT NULL,
  `source_task_code` varchar(64) DEFAULT NULL,
  `spawn_type` varchar(32) NOT NULL DEFAULT 'task',
  `reward` int(11) NOT NULL DEFAULT 1,
  `pos_x` decimal(5,2) NOT NULL DEFAULT 50.00,
  `pos_y` decimal(5,2) NOT NULL DEFAULT 45.00,
  `status` enum('pending','collected','expired') NOT NULL DEFAULT 'pending',
  `expire_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `collected_at` datetime DEFAULT NULL,
  PRIMARY KEY (`orb_id`),
  KEY `idx_user_plant_status` (`user_id`,`plant_id`,`status`),
  KEY `idx_expire_status` (`status`,`expire_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tree_exp_tasks`
(`task_code`,`task_name`,`task_desc`,`source_code`,`required_value`,`daily_limit`,`exp_reward`,`icon`,`sort_order`,`is_enabled`)
VALUES
('exp_comm_post','社区发帖','每日每发 1 帖可领取 1 个经验球','community_post',1,3,8,NULL,10,1),
('exp_comm_reply','社区回帖','每日每回帖 1 次可领取 1 个经验球','community_reply',1,5,5,NULL,20,1),
('exp_read_time','阅读累计','每日累计阅读 10 分钟可领取 1 个经验球','read_seconds',600,3,6,NULL,30,1),
('exp_write_time','写作累计','每日累计写作 10 分钟可领取 1 个经验球','write_seconds',600,3,8,NULL,40,1)
ON DUPLICATE KEY UPDATE
`task_name`=VALUES(`task_name`),
`task_desc`=VALUES(`task_desc`),
`source_code`=VALUES(`source_code`),
`required_value`=VALUES(`required_value`),
`daily_limit`=VALUES(`daily_limit`),
`exp_reward`=VALUES(`exp_reward`),
`icon`=VALUES(`icon`),
`sort_order`=VALUES(`sort_order`),
`is_enabled`=VALUES(`is_enabled`);

INSERT INTO `tree_exp_settings` (`setting_key`,`setting_value`,`description`) VALUES
('max_pending_orbs','30','同一棵树最大待收集经验球数量'),
('collect_all_limit','50','一键收集单次最多处理经验球数量'),
('random_reward_min','2','随机刷新经验球最小经验值'),
('random_reward_max','6','随机刷新经验球最大经验值'),
('random_spawn_cooldown_seconds','900','随机刷新冷却秒数'),
('random_spawn_probability','0.8','页面刷新时被动随机刷新概率(0-1)'),
('orb_expire_hours','48','经验球过期小时数'),
('orb_pos_x_min','22','经验球X轴最小百分比'),
('orb_pos_x_max','78','经验球X轴最大百分比'),
('orb_pos_y_min','16','经验球Y轴最小百分比'),
('orb_pos_y_max','56','经验球Y轴最大百分比'),
('max_growth','100','树成长值阈值')
ON DUPLICATE KEY UPDATE
`setting_value`=VALUES(`setting_value`),
`description`=VALUES(`description`);
