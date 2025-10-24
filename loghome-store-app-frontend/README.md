# LogHome 商店前端

这是 LogHome 项目的商店前端子项目，基于 Vue 3 + Vite 构建，提供完整的电商功能。

## 功能特性

### 🛍️ 商品管理
- **商品列表页面** (`/products`)
  - 商品搜索和筛选
  - 分类筛选
  - 价格排序
  - 分页显示
  - 响应式网格布局

- **商品详情页面** (`/products/:id`)
  - 商品图片轮播
  - 详细信息展示
  - 规格选择
  - 数量调整
  - 添加到购物车
  - 立即购买
  - 相关商品推荐

### 🛒 购物车功能
- **购物车页面** (`/cart`)
  - 商品列表展示
  - 数量修改
  - 商品删除
  - 批量操作
  - 价格计算
  - 结算功能

### 📦 订单管理
- **订单列表页面** (`/orders`)
  - 订单状态筛选
  - 订单详情查看
  - 订单操作（取消、确认收货等）
  - 分页显示

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **路由管理**: Vue Router 4
- **HTTP 客户端**: Fetch API
- **样式**: 原生 CSS + 响应式设计

## 项目结构

```
src/
├── views/              # 页面组件
│   ├── ProductList.vue # 商品列表页
│   ├── ProductDetail.vue # 商品详情页
│   ├── Cart.vue        # 购物车页
│   └── Orders.vue      # 订单页
├── utils/              # 工具函数
│   └── api.js          # API 接口封装
├── router/             # 路由配置
│   └── index.js        # 路由定义
├── App.vue             # 根组件
└── main.js             # 入口文件
```

## 页面路由

| 路径 | 页面 | 描述 |
|------|------|------|
| `/` | 商品列表 | 默认首页，显示所有商品 |
| `/products` | 商品列表 | 商品列表页面 |
| `/products/:id` | 商品详情 | 单个商品的详细信息 |
| `/cart` | 购物车 | 用户的购物车页面 |
| `/orders` | 订单管理 | 用户的订单列表 |

## 开发指南

### 环境要求
- Node.js >= 16
- npm 或 yarn

### 项目设置

```sh
npm install
```

### 开发模式（热重载）

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
