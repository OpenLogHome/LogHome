-- 树场消息通知偏好
-- 开启 notifications_disabled 后，不再为该用户写入树场相关通知

CREATE TABLE IF NOT EXISTS `user_tree_notification_settings` (
  `user_id` bigint(20) NOT NULL,
  `notifications_disabled` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
