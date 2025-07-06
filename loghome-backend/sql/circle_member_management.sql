-- 添加圈子加入验证信息表
CREATE TABLE IF NOT EXISTS `comm_circle_join_requests` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `circle_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `verification_info` text COMMENT '验证信息',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-待审核 1-已通过 2-已拒绝',
  `reviewer_id` int(11) DEFAULT NULL COMMENT '审核人ID',
  `review_time` datetime DEFAULT NULL COMMENT '审核时间',
  `review_comment` varchar(255) DEFAULT NULL COMMENT '审核备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `idx_circle_user` (`circle_id`,`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='圈子加入申请表';

-- 添加圈子设置表
CREATE TABLE IF NOT EXISTS `comm_circle_settings` (
  `circle_id` int(11) NOT NULL,
  `need_verification` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否需要验证 0-不需要 1-需要',
  `verification_questions` text COMMENT '验证问题，JSON格式',
  `auto_ban_keywords` text COMMENT '自动禁言关键词，JSON格式',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`circle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='圈子设置表';

-- 添加圈子禁言表
CREATE TABLE IF NOT EXISTS `comm_circle_bans` (
  `ban_id` int(11) NOT NULL AUTO_INCREMENT,
  `circle_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `operator_id` int(11) NOT NULL COMMENT '操作人ID',
  `ban_type` tinyint(4) NOT NULL COMMENT '0-禁言 1-踢出圈子',
  `duration` int(11) DEFAULT NULL COMMENT '禁言时长(分钟)，NULL表示永久',
  `reason` varchar(255) DEFAULT NULL COMMENT '原因',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-有效 0-已解除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  PRIMARY KEY (`ban_id`),
  KEY `idx_circle_user` (`circle_id`,`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='圈子禁言/踢出记录表';

-- 修改圈子成员表，添加禁言状态
ALTER TABLE `comm_circle_members` 
ADD COLUMN `is_banned` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否被禁言 0-否 1-是' AFTER `status`,
ADD COLUMN `ban_end_time` datetime DEFAULT NULL COMMENT '禁言结束时间' AFTER `is_banned`;

-- 修改圈子表，添加是否需要验证字段
ALTER TABLE `comm_circles` 
ADD COLUMN `need_verification` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否需要验证 0-不需要 1-需要' AFTER `status`;

-- 添加审核日志类型
-- 在comm_audit_logs表的target_type字段中添加新的类型：
-- 4-圈子成员管理
-- 在action字段中添加新的操作类型：
-- 6-禁言用户
-- 7-踢出用户
-- 8-审核入圈申请 