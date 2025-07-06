-- 创建圈子表
CREATE TABLE IF NOT EXISTS `comm_circles` (
  `circle_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '圈子名称',
  `description` varchar(500) DEFAULT NULL COMMENT '圈子描述',
  `icon` varchar(255) DEFAULT NULL COMMENT '圈子图标',
  `cover` varchar(255) DEFAULT NULL COMMENT '圈子封面',
  `rules` text COMMENT '圈子规则',
  `announcement` text COMMENT '圈子公告',
  `creator_id` int(11) NOT NULL COMMENT '创建者ID',
  `category_id` int(11) DEFAULT NULL COMMENT '分类ID',
  `is_official` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否官方圈子',
  `need_verification` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否需要验证',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-待审核 1-已通过 2-已拒绝 3-已禁用',
  `member_count` int(11) NOT NULL DEFAULT '0' COMMENT '成员数',
  `post_count` int(11) NOT NULL DEFAULT '0' COMMENT '帖子数',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`circle_id`),
  KEY `idx_creator` (`creator_id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区圈子表';

-- 创建圈子分类表
CREATE TABLE IF NOT EXISTS `comm_circle_categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '分类名称',
  `parent_id` int(11) NOT NULL DEFAULT '0' COMMENT '父分类ID',
  `sort_order` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='圈子分类表';

-- 创建圈子成员表
CREATE TABLE IF NOT EXISTS `comm_circle_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `circle_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-普通成员 1-管理员 2-创建者',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '0-已退出 1-正常',
  `is_banned` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否被禁言',
  `ban_end_time` datetime DEFAULT NULL COMMENT '禁言结束时间',
  `join_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_circle_user` (`circle_id`,`user_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='圈子成员表';

-- 创建帖子表
CREATE TABLE IF NOT EXISTS `comm_posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `circle_id` int(11) NOT NULL COMMENT '所属圈子ID',
  `user_id` int(11) NOT NULL COMMENT '发布者ID',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `content` text NOT NULL COMMENT '内容',
  `media_urls` text COMMENT '媒体文件URL，JSON格式',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-待审核 1-已通过 2-已拒绝 3-已删除',
  `view_count` int(11) NOT NULL DEFAULT '0' COMMENT '浏览量',
  `like_count` int(11) NOT NULL DEFAULT '0' COMMENT '点赞数',
  `comment_count` int(11) NOT NULL DEFAULT '0' COMMENT '评论数',
  `is_top` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否置顶',
  `is_essence` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否精华',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `idx_circle` (`circle_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区帖子表';

-- 创建评论表
CREATE TABLE IF NOT EXISTS `comm_comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL COMMENT '帖子ID',
  `user_id` int(11) NOT NULL COMMENT '评论者ID',
  `parent_id` int(11) NOT NULL DEFAULT '0' COMMENT '父评论ID，0表示一级评论',
  `reply_to` int(11) DEFAULT NULL COMMENT '回复的用户ID',
  `content` text NOT NULL COMMENT '评论内容',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '0-已删除 1-正常',
  `like_count` int(11) NOT NULL DEFAULT '0' COMMENT '点赞数',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `idx_post` (`post_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 创建点赞表
CREATE TABLE IF NOT EXISTS `comm_likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `target_id` int(11) NOT NULL COMMENT '目标ID',
  `target_type` varchar(20) NOT NULL COMMENT 'post-帖子 comment-评论',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_target` (`user_id`,`target_id`,`target_type`),
  KEY `idx_target` (`target_id`,`target_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';

-- 创建举报表
CREATE TABLE IF NOT EXISTS `comm_reports` (
  `report_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '举报者ID',
  `target_id` int(11) NOT NULL COMMENT '目标ID',
  `target_type` varchar(20) NOT NULL COMMENT 'post-帖子 comment-评论 user-用户',
  `reason` varchar(255) NOT NULL COMMENT '举报原因',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-待处理 1-已处理 2-已忽略',
  `reviewer_id` int(11) DEFAULT NULL COMMENT '处理人ID',
  `review_time` datetime DEFAULT NULL COMMENT '处理时间',
  `review_comment` varchar(255) DEFAULT NULL COMMENT '处理备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_target` (`target_id`,`target_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='举报表';

-- 创建审核日志表
CREATE TABLE IF NOT EXISTS `comm_audit_logs` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '操作者ID',
  `target_id` int(11) NOT NULL COMMENT '目标ID',
  `target_type` tinyint(4) NOT NULL COMMENT '1-圈子 2-帖子 3-评论 4-圈子成员',
  `action` tinyint(4) NOT NULL COMMENT '1-通过 2-拒绝 3-启用 4-禁用/删除 5-设为精华 6-禁言 7-踢出 8-审核入圈',
  `reason` varchar(255) DEFAULT NULL COMMENT '原因',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_target` (`target_id`,`target_type`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审核日志表'; 