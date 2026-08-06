CREATE TABLE IF NOT EXISTS membership_redeem_codes (
	code_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '兑换码ID',
	code_hash CHAR(64) NOT NULL COMMENT '标准化兑换码的SHA-256摘要',
	code_hint VARCHAR(20) NOT NULL COMMENT '用于后台识别的脱敏兑换码',
	membership_type ENUM('standard', 'super') NOT NULL COMMENT '兑换的会员档位',
	duration_days INT UNSIGNED NOT NULL COMMENT '兑换后增加的有效天数',
	usage_limit INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '最多可兑换次数',
	used_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '已经兑换次数',
	status ENUM('active', 'disabled', 'exhausted') NOT NULL DEFAULT 'active' COMMENT '兑换码状态',
	expires_at DATETIME NULL COMMENT '兑换码失效时间，NULL表示不失效',
	created_by INT NULL COMMENT '创建兑换码的管理员用户ID',
	remark VARCHAR(255) NULL COMMENT '后台备注',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (code_id),
	UNIQUE KEY uniq_membership_redeem_code_hash (code_hash),
	KEY idx_membership_redeem_code_status_expiry (status, expires_at),
	CONSTRAINT fk_membership_redeem_code_creator
		FOREIGN KEY (created_by) REFERENCES users (user_id)
		ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员兑换码';

CREATE TABLE IF NOT EXISTS membership_redeem_uses (
	redemption_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '兑换记录ID',
	code_id BIGINT UNSIGNED NOT NULL COMMENT '兑换码ID',
	user_id INT NOT NULL COMMENT '兑换用户ID',
	subscription_id BIGINT UNSIGNED NOT NULL COMMENT '兑换生成的订阅记录ID',
	redeemed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '兑换时间',
	PRIMARY KEY (redemption_id),
	UNIQUE KEY uniq_membership_redeem_code_user (code_id, user_id),
	KEY idx_membership_redeem_user_time (user_id, redeemed_at),
	KEY idx_membership_redeem_subscription (subscription_id),
	CONSTRAINT fk_membership_redeem_use_code
		FOREIGN KEY (code_id) REFERENCES membership_redeem_codes (code_id)
		ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_membership_redeem_use_user
		FOREIGN KEY (user_id) REFERENCES users (user_id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_membership_redeem_use_subscription
		FOREIGN KEY (subscription_id) REFERENCES membership_subscriptions (subscription_id)
		ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员兑换码使用记录';
