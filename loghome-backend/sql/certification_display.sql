-- 用户选择对外展示的认证标识序号；未设置时默认展示第一个。
CREATE TABLE IF NOT EXISTS user_certification_display (
  user_id bigint(20) NOT NULL,
  cert_index int NOT NULL DEFAULT 0,
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
