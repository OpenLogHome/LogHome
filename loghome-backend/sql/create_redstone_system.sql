CREATE TABLE IF NOT EXISTS redstone_transactions (
	transaction_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '红石流水ID',
	user_id INT NOT NULL COMMENT '用户ID',
	amount INT NOT NULL COMMENT '红石变动数量，正数为增加，负数为扣除',
	log_cost INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '本次兑换消耗的原木数量',
	transaction_type ENUM(
		'membership_grant',
		'membership_upgrade_grant',
		'annual_refresh',
		'monthly_free_grant',
		'log_exchange',
		'ai_usage',
		'admin_adjustment',
		'refund'
	) NOT NULL COMMENT '流水类型',
	reference_id VARCHAR(96) NULL COMMENT '关联订阅、订单或业务记录ID',
	period_key VARCHAR(40) NULL COMMENT '会员发放周期标识',
	request_key VARCHAR(160) NOT NULL COMMENT '全局幂等业务键',
	description VARCHAR(255) NULL COMMENT '流水说明',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	PRIMARY KEY (transaction_id),
	UNIQUE KEY uniq_redstone_request_key (request_key),
	KEY idx_redstone_user_created (user_id, created_at),
	KEY idx_redstone_user_type (user_id, transaction_type),
	CONSTRAINT fk_redstone_transaction_user
		FOREIGN KEY (user_id) REFERENCES users (user_id)
		ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户红石资产流水';
