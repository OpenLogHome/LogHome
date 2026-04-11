CREATE TABLE IF NOT EXISTS store_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL COMMENT '商品标题',
  summary TEXT COMMENT '商品摘要',
  description TEXT COMMENT '商品描述（富文本）',
  type ENUM('virtual', 'physical') NOT NULL DEFAULT 'virtual' COMMENT '商品类型：virtual-虚拟，physical-实物',
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '商品价格',
  stock INT NOT NULL DEFAULT 0 COMMENT '库存数量',
  cover_url VARCHAR(500) COMMENT '封面图片URL',
  media_urls TEXT COMMENT '其他媒体图片URL（JSON数组）',
  shipping_desc VARCHAR(255) COMMENT '发货时效描述',
  status ENUM('on', 'off') NOT NULL DEFAULT 'on' COMMENT '商品状态：on-上架，off-下架',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分商城商品表';

CREATE TABLE IF NOT EXISTS store_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单编号',
  user_id INT NOT NULL COMMENT '用户ID',
  product_id INT NOT NULL COMMENT '商品ID',
  product_title VARCHAR(255) NOT NULL COMMENT '商品标题快照',
  product_cover VARCHAR(500) COMMENT '商品封面快照',
  product_type ENUM('virtual', 'physical') NOT NULL COMMENT '商品类型快照',
  price DECIMAL(10, 2) NOT NULL COMMENT '订单价格',
  pay_log DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '原木扣减数量',
  pay_cropped_log DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '去皮原木扣减数量',
  shipping_desc VARCHAR(255) COMMENT '发货时效描述快照',
  status ENUM('pending', 'shipped', 'completed', 'canceled') NOT NULL DEFAULT 'pending' COMMENT '订单状态：pending-待发货，shipped-已发货，completed-已完成，canceled-已取消',
  address_id INT NULL COMMENT '地址ID快照来源',
  receiver_name VARCHAR(100) COMMENT '收件人姓名快照',
  receiver_phone VARCHAR(20) COMMENT '收件人手机号快照',
  receiver_province VARCHAR(50) COMMENT '收件省份快照',
  receiver_city VARCHAR(50) COMMENT '收件城市快照',
  receiver_district VARCHAR(50) COMMENT '收件区县快照',
  receiver_detail VARCHAR(255) COMMENT '收件详细地址快照',
  tracking_number VARCHAR(100) COMMENT '物流单号或兑换码',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  shipped_at TIMESTAMP NULL COMMENT '发货时间',
  completed_at TIMESTAMP NULL COMMENT '完成时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_order_no (order_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分商城订单表';

CREATE TABLE IF NOT EXISTS store_addresses (
  address_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户ID',
  receiver_name VARCHAR(100) NOT NULL COMMENT '收件人姓名',
  receiver_phone VARCHAR(20) NOT NULL COMMENT '收件人手机号',
  province VARCHAR(50) COMMENT '省份',
  city VARCHAR(50) COMMENT '城市',
  district VARCHAR(50) COMMENT '区县',
  detail VARCHAR(255) NOT NULL COMMENT '详细地址',
  is_default TINYINT(1) DEFAULT 0 COMMENT '是否默认地址',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分商城地址表';

CREATE TABLE IF NOT EXISTS store_order_requests (
  request_key VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '客户端幂等请求键',
  user_id INT NOT NULL COMMENT '用户ID',
  product_id INT NOT NULL COMMENT '商品ID',
  address_id INT NULL COMMENT '地址ID',
  order_id INT NULL COMMENT '成功创建的订单ID',
  status ENUM('processing', 'succeeded') NOT NULL DEFAULT 'processing' COMMENT '请求处理状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_user_created_at (user_id, created_at),
  INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分商城订单幂等请求表';
