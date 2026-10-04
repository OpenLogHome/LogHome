-- 账户隐私设置；旧账户未设置时保持列表公开、允许所有已登录用户私信。
CREATE TABLE IF NOT EXISTS user_privacy_settings (
  user_id bigint(20) NOT NULL,
  follow_list_visibility varchar(20) NOT NULL DEFAULT 'public',
  direct_message_policy varchar(20) NOT NULL DEFAULT 'default',
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
