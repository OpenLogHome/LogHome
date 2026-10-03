CREATE TABLE IF NOT EXISTS activity_popularity_vote (
	vote_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '人气票投票记录ID',
	tag_id INT NOT NULL COMMENT '活动标签ID',
	user_id INT NOT NULL COMMENT '投票用户ID',
	novel_id INT NOT NULL COMMENT '被投票的小说ID',
	create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '投票时间',
	PRIMARY KEY (vote_id),
	UNIQUE KEY uniq_activity_vote (tag_id, user_id, novel_id),
	KEY idx_activity_vote_count (tag_id, novel_id),
	KEY idx_activity_vote_user (user_id, tag_id),
	CONSTRAINT fk_activity_vote_tag
		FOREIGN KEY (tag_id) REFERENCES activity (tag_id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_activity_vote_user
		FOREIGN KEY (user_id) REFERENCES users (user_id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_activity_vote_novel
		FOREIGN KEY (novel_id) REFERENCES novels (novel_id)
		ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='创作活动人气票投票记录';
