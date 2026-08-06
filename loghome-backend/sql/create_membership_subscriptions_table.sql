CREATE TABLE IF NOT EXISTS membership_subscriptions (
	subscription_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订阅记录ID',
	user_id INT NOT NULL COMMENT '用户ID',
	purchaser_user_id INT NULL COMMENT '实际付款用户ID，赠送时与权益用户不同',
	membership_type ENUM('standard', 'super') NOT NULL COMMENT '会员档位：standard-原木通行证，super-超级原木通行证',
	billing_cycle ENUM('monthly', 'yearly', 'custom') NOT NULL COMMENT '订阅周期',
	cost_log INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '本次实际扣除的原木数量',
	renewal_cost_log INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '下次自动续费应扣除的原木价格快照',
	redstone_grant_amount INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '每个会员发放周期赠送的红石数量',
	next_redstone_grant_at DATETIME NULL COMMENT '年付会员下一次红石发放时间',
	status ENUM('pending', 'active', 'expired', 'cancelled', 'refunded', 'replaced') NOT NULL DEFAULT 'pending' COMMENT '订阅状态',
	starts_at DATETIME NULL COMMENT '权益生效时间',
	expires_at DATETIME NULL COMMENT '权益到期时间',
	auto_renew TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否到期自动续订',
	cancel_at_period_end TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否在当前周期结束后停止续订',
	cancelled_at DATETIME NULL COMMENT '取消订阅时间',
	renewal_parent_id BIGINT UNSIGNED NULL COMMENT '续订前一条订阅记录ID',
	order_no VARCHAR(64) NULL COMMENT '关联订单号或幂等业务号',
	request_key VARCHAR(96) NULL COMMENT '用户维度幂等请求键',
	source ENUM('purchase', 'gift', 'redeem_code', 'auto_renewal', 'admin', 'migration') NOT NULL DEFAULT 'purchase' COMMENT '订阅来源',
	remark VARCHAR(255) NULL COMMENT '后台备注',
	last_renewal_attempt_at DATETIME NULL COMMENT '最近一次自动续费尝试时间',
	renewal_failure_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '自动续费连续失败次数',
	renewal_last_error VARCHAR(255) NULL COMMENT '最近一次自动续费失败原因',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	PRIMARY KEY (subscription_id),
	UNIQUE KEY uniq_membership_order_no (order_no),
	UNIQUE KEY uniq_membership_request_key (request_key),
	UNIQUE KEY uniq_membership_renewal_parent (renewal_parent_id),
	KEY idx_membership_user_status_expiry (user_id, status, expires_at),
	KEY idx_membership_user_created (user_id, created_at),
	KEY idx_membership_purchaser_created (purchaser_user_id, created_at),
	KEY idx_membership_type_status (membership_type, status),
	CONSTRAINT fk_membership_subscription_user
		FOREIGN KEY (user_id) REFERENCES users (user_id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_membership_subscription_purchaser
		FOREIGN KEY (purchaser_user_id) REFERENCES users (user_id)
		ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_membership_subscription_parent
		FOREIGN KEY (renewal_parent_id) REFERENCES membership_subscriptions (subscription_id)
		ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户会员订阅及续订历史';
