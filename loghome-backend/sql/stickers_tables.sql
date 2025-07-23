-- 表情包表
CREATE TABLE IF NOT EXISTS `stickers` (
  `sticker_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '上传用户ID',
  `url` VARCHAR(255) NOT NULL COMMENT '表情包URL',
  `is_private` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否私密，0-公开，1-私密',
  `created_at` DATETIME NOT NULL COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`sticker_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_is_private` (`is_private`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='表情包表';

-- 表情包收藏表
CREATE TABLE IF NOT EXISTS `sticker_favorites` (
  `favorite_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '用户ID',
  `sticker_id` INT NOT NULL COMMENT '表情包ID',
  `created_at` DATETIME NOT NULL COMMENT '收藏时间',
  PRIMARY KEY (`favorite_id`),
  UNIQUE KEY `uk_user_sticker` (`user_id`, `sticker_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_sticker_id` (`sticker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='表情包收藏表';

-- 添加外键约束
ALTER TABLE `stickers`
  ADD CONSTRAINT `fk_stickers_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `sticker_favorites`
  ADD CONSTRAINT `fk_sticker_favorites_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sticker_favorites_sticker_id` FOREIGN KEY (`sticker_id`) REFERENCES `stickers` (`sticker_id`) ON DELETE CASCADE ON UPDATE CASCADE;