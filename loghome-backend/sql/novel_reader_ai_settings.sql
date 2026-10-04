-- 作品级原木娘提问开关；未设置的旧作品默认允许读者提问。
CREATE TABLE IF NOT EXISTS novel_reader_ai_settings (
  novel_id bigint(20) NOT NULL,
  disable_reader_ai tinyint(1) NOT NULL DEFAULT 0,
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (novel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
