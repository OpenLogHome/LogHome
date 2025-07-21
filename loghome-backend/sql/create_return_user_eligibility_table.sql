-- 创建回归用户资格表
CREATE TABLE IF NOT EXISTS `return_user_eligibility` (
  `eligibility_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `expiry_date` datetime NOT NULL COMMENT '资格过期时间（14天后）',
  `is_used` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否已使用（0未使用，1已使用）',
  `use_time` datetime DEFAULT NULL COMMENT '使用时间',
  PRIMARY KEY (`eligibility_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expiry_date` (`expiry_date`),
  KEY `idx_is_used` (`is_used`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='回归用户邀请码资格表';

-- 添加外键约束（如果需要）
ALTER TABLE `return_user_eligibility`
  ADD CONSTRAINT `fk_return_user_eligibility_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE; 