CREATE TABLE IF NOT EXISTS novel_writing_activity_daily (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    novel_id INT NOT NULL,
    user_id INT NOT NULL,
    activity_date DATE NOT NULL,
    active_seconds INT UNSIGNED NOT NULL DEFAULT 0,
    written_chars INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_novel_writing_activity_daily (novel_id, user_id, activity_date),
    KEY idx_novel_writing_activity_user_date (user_id, activity_date),
    KEY idx_novel_writing_activity_novel_date (novel_id, activity_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS novel_writing_activity_reports (
    report_id VARCHAR(64) NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    novel_id INT NOT NULL,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    activity_date DATE NOT NULL,
    active_seconds SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    written_chars INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (report_id),
    KEY idx_novel_writing_reports_created_at (created_at),
    KEY idx_novel_writing_reports_session (session_id),
    KEY idx_novel_writing_reports_user_date (user_id, activity_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
