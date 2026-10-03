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
		'refund',
		'expiration'
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

CREATE TABLE IF NOT EXISTS redstone_lots (
	lot_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '红石批次ID',
	user_id INT NOT NULL COMMENT '用户ID',
	source_transaction_id BIGINT UNSIGNED NULL COMMENT '产生该批次的红石流水ID',
	granted_amount INT UNSIGNED NOT NULL COMMENT '批次初始数量',
	remaining_amount INT UNSIGNED NOT NULL COMMENT '批次剩余数量',
	expires_at DATETIME NULL COMMENT '到期时间；NULL表示永不过期',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	PRIMARY KEY (lot_id),
	UNIQUE KEY uniq_redstone_lot_source_transaction (source_transaction_id),
	KEY idx_redstone_lot_user_expiry (user_id, expires_at, remaining_amount),
	CONSTRAINT fk_redstone_lot_user
		FOREIGN KEY (user_id) REFERENCES users (user_id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_redstone_lot_source_transaction
		FOREIGN KEY (source_transaction_id) REFERENCES redstone_transactions (transaction_id)
		ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户可用红石批次（赠送红石按批次过期）';

CREATE TABLE IF NOT EXISTS redstone_lot_consumptions (
	consumption_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '批次扣减记录ID',
	transaction_id BIGINT UNSIGNED NOT NULL COMMENT '红石消费流水ID',
	lot_id BIGINT UNSIGNED NOT NULL COMMENT '被消费的红石批次ID',
	amount INT UNSIGNED NOT NULL COMMENT '从该批次扣除的数量',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	PRIMARY KEY (consumption_id),
	UNIQUE KEY uniq_redstone_consumption_transaction_lot (transaction_id, lot_id),
	KEY idx_redstone_consumption_lot (lot_id),
	CONSTRAINT fk_redstone_consumption_transaction
		FOREIGN KEY (transaction_id) REFERENCES redstone_transactions (transaction_id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_redstone_consumption_lot
		FOREIGN KEY (lot_id) REFERENCES redstone_lots (lot_id)
		ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='红石消费与批次的分摊记录';
