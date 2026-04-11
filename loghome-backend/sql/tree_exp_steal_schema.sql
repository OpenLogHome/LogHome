-- 树场偷能量玩法数据库迁移脚本
-- 请先执行 tree_exp_orb_schema.sql，再执行本脚本

CREATE TABLE IF NOT EXISTS `tree_exp_steal_records` (
  `record_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `source_user_id` bigint(20) NOT NULL,
  `source_plant_id` int(11) NOT NULL,
  `target_user_id` bigint(20) NOT NULL,
  `target_plant_id` int(11) NOT NULL,
  `reward` int(11) NOT NULL DEFAULT 1,
  `orb_count_affected` int(11) NOT NULL DEFAULT 1,
  `date_key` date NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`record_id`),
  KEY `idx_source_date` (`source_user_id`,`date_key`,`created_at`),
  KEY `idx_target_date` (`target_user_id`,`date_key`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tree_exp_settings` (`setting_key`,`setting_value`,`description`) VALUES
('steal_min_pending_reward','3','好友可偷取的最小未收成长值门槛'),
('steal_ratio','0.35','单次偷取未收成长值的比例'),
('steal_min_reward','1','单次偷取最少获得成长值'),
('steal_max_reward','8','单次偷取最多获得成长值'),
('steal_friend_limit','18','偷能量面板最多展示多少个好友'),
('steal_log_limit','12','失窃播报最多展示多少条记录')
ON DUPLICATE KEY UPDATE
`setting_value`=VALUES(`setting_value`),
`description`=VALUES(`description`);
