# 设备检测功能说明

## 功能概述

本项目已集成设备检测功能，能够自动识别访问设备类型（桌面端/移动端），并根据设备类型提供相应的用户界面。移动端使用独立的SPA应用，桌面端使用Nuxt.js应用。

**新增功能**：智能URI解析器，支持桌面端到移动端的路径映射转换，解决两端在关键页面URI上的分歧问题。

## 实现方式

### 1. 中间件检测 (middleware/device-detect.js)
- 在服务端通过 User-Agent 检测设备类型
- 移动设备访问时自动重定向到移动端SPA应用
- **集成URI解析器**，智能转换桌面端路径为移动端路径
- 支持hash路由方式传递路径信息

### 2. 插件支持 (plugins/device-detect.js)
- 提供客户端设备检测工具函数
- 可在组件中使用 `this.$device` 访问设备信息
- 支持设备类型判断、屏幕尺寸检测等功能
- **集成URI解析器**，客户端重定向也支持智能路径映射

### 3. URI解析器 (utils/uri-resolver.js + config/uri-mapping.js)
- **智能路径映射**：根据配置规则将桌面端URI转换为移动端URI
- **多种匹配模式**：精确匹配、参数匹配、前缀匹配
- **查询参数映射**：支持查询参数名称转换
- **容错机制**：解析失败时自动使用后备方案

## URI解析器详细说明

### 配置文件结构 (config/uri-mapping.js)

```javascript
export default {
  // 精确匹配规则 - 完全匹配路径
  exact: {
    '/': '/home',                    // 首页映射
    '/read': '/reading',             // 阅读页面
    '/write': '/editor',             // 写作页面
    '/me': '/profile',               // 个人中心
    '/world': '/community',          // 社区页面
  },

  // 参数匹配规则 - 支持动态参数
  params: [
    {
      // 用户页面：/users/123 -> /user/123
      pattern: /^\/users\/(\d+)$/,
      replacement: '/user/$1'
    },
    {
      // 文章页面：/read/article/123 -> /article/123
      pattern: /^\/read\/article\/(\d+)$/,
      replacement: '/article/$1'
    }
  ],

  // 前缀匹配规则 - 匹配路径前缀
  prefix: [
    {
      // 用户相关页面：/users/* -> /user/*
      from: '/users/',
      to: '/user/'
    }
  ],

  // 查询参数映射规则
  queryParams: {
    'page': 'p',           // 分页参数
    'category': 'cat',     // 分类参数
    'search': 'q',         // 搜索参数
  }
}
```

### 映射规则优先级

1. **精确匹配** (exact) - 最高优先级
2. **参数匹配** (params) - 支持正则表达式和参数替换
3. **前缀匹配** (prefix) - 匹配路径前缀
4. **默认规则** (default) - 保持原路径或应用默认前缀

### 使用示例

```javascript
// 桌面端路径 -> 移动端路径转换示例
'/users/123'           -> '/user/123'
'/read/article/456'    -> '/article/456'
'/write/edit/789'      -> '/editor/789'
'/tag/javascript'      -> '/tags/javascript'
'/world/community'     -> '/community/community'

// 查询参数转换示例
'?page=1&category=tech' -> '?p=1&cat=tech'
```

## 配置说明

### nuxt.config.js 配置
```javascript
export default {
  env: {
    // 移动端SPA应用URL配置
    mobileUrl: process.env.NODE_ENV === 'production' 
      ? "https://m.yourdomain.com" // 生产环境移动端URL
      : "http://localhost:3001" // 开发环境移动端URL
  },
  router: {
    // 全局中间件
    middleware: ['device-detect']
  },
  plugins: [
    '~/plugins/device-detect.js'
  ]
}
```

## 移动端SPA应用集成

### 路径传递方式
移动端重定向支持智能路径映射：

#### 智能映射示例
```
桌面端: https://pc.yourdomain.com/users/123?page=2
移动端: https://m.yourdomain.com/#/user/123?p=2
```

#### 后备方案（解析失败时）
```
桌面端: https://pc.yourdomain.com/some/unknown/path
移动端: https://m.yourdomain.com/#/some/unknown/path
```

### 移动端SPA应用路由处理
移动端SPA应用需要处理从桌面端传递过来的路径：

```javascript
// 移动端SPA应用路由处理示例
function handleRedirectFromDesktop() {
  // 处理hash路由
  if (window.location.hash) {
    const path = window.location.hash.substring(1) // 去掉 #
    // 导航到对应路径
    router.push(path)
  }
}
```

## 使用方法

### 1. 自定义URI映射规则

编辑 `config/uri-mapping.js` 文件，添加或修改映射规则：

```javascript
// 添加新的精确匹配规则
exact: {
  '/custom-page': '/mobile-custom',
  // ... 其他规则
},

// 添加新的参数匹配规则
params: [
  {
    pattern: /^\/blog\/(\d+)\/comment\/(\d+)$/,
    replacement: '/post/$1/reply/$2'
  },
  // ... 其他规则
]
```

### 2. 在组件中检测设备类型
```javascript
export default {
  mounted() {
    // 检测是否为移动设备
    if (this.$device.isMobile()) {
      console.log('当前是移动设备')
    }
    
    // 获取设备类型
    const deviceType = this.$device.getDeviceType() // 'mobile', 'tablet', 'desktop'
    
    // 获取屏幕尺寸
    const screenSize = this.$device.getScreenSize() // 'xs', 'sm', 'md', 'lg', 'xl'
  }
}
```

### 3. 手动重定向（支持智能映射）
```javascript
// 重定向到移动端SPA应用（自动应用URI映射）
this.$device.redirectToMobile('/users/123')

// 重定向到桌面端
this.$device.redirectToDesktop('/current-path')
```

### 4. 直接使用URI解析器
```javascript
import { resolveDesktopToMobile, buildMobileUrl } from '~/utils/uri-resolver.js'

// 解析桌面端路径为移动端路径
const result = resolveDesktopToMobile('/users/123', { page: 1 })
console.log(result) // { path: '/user/123', query: { p: 1 } }

// 构建完整的移动端URL
const mobileUrl = buildMobileUrl('https://m.example.com', '/users/123', { page: 1 })
console.log(mobileUrl) // https://m.example.com/#/user/123?p=1
```

## 设备检测规则

### 移动设备识别
基于 User-Agent 检测以下设备：
- Android 设备
- iOS 设备 (iPhone, iPad, iPod)
- Windows Mobile
- BlackBerry
- Opera Mini
- 其他移动浏览器

### 检测优先级
1. 服务端 User-Agent 检测（主要方式）
2. 客户端屏幕尺寸检测（辅助方式）

## 部署配置

### 开发环境
```javascript
// nuxt.config.js
mobileUrl: "http://localhost:3001" // 移动端SPA应用开发服务器
```

### 生产环境
```javascript
// nuxt.config.js
mobileUrl: "https://m.yourdomain.com" // 移动端SPA应用生产地址
```

## 注意事项

1. **URI映射配置**：根据实际需求配置 `config/uri-mapping.js` 中的映射规则
2. **URL配置**：确保在 `nuxt.config.js` 中正确配置移动端SPA应用的URL
3. **重定向循环**：中间件会自动避免无限重定向
4. **SEO友好**：服务端检测确保搜索引擎能正确索引
5. **路径传递**：移动端SPA应用需要处理从桌面端传递的路径信息
6. **跨域问题**：如果移动端和桌面端在不同域名，注意处理跨域问题
7. **容错机制**：URI解析失败时会自动使用后备方案，确保功能正常

## URI映射规则编写指南

### 1. 精确匹配规则
适用于固定路径的一对一映射：
```javascript
exact: {
  '/about': '/about-us',
  '/contact': '/contact-us'
}
```

### 2. 参数匹配规则
适用于包含动态参数的路径：
```javascript
params: [
  {
    // 匹配 /product/123/review/456
    pattern: /^\/product\/(\d+)\/review\/(\d+)$/,
    replacement: '/item/$1/comment/$2'
  }
]
```

### 3. 前缀匹配规则
适用于整个路径分支的映射：
```javascript
prefix: [
  {
    from: '/admin/',
    to: '/manage/'
  }
]
```

### 4. 查询参数映射
适用于查询参数名称的转换：
```javascript
queryParams: {
  'pageNumber': 'page',
  'itemsPerPage': 'limit'
}
```

## 移动端SPA应用开发建议

### 1. 路由配置
```javascript
// 移动端SPA应用路由配置示例
const routes = [
  { path: '/home', component: Home },        // 对应桌面端 /
  { path: '/user/:id', component: User },    // 对应桌面端 /users/:id
  { path: '/article/:id', component: Article }, // 对应桌面端 /read/article/:id
  { path: '/editor', component: Editor },    // 对应桌面端 /write
  { path: '/profile', component: Profile }   // 对应桌面端 /me
]
```

### 2. 初始化处理
```javascript
// 移动端应用初始化时处理桌面端重定向
window.addEventListener('DOMContentLoaded', () => {
  handleRedirectFromDesktop()
})
```

### 3. 返回桌面端链接
```javascript
// 在移动端提供返回桌面端的功能
function goToDesktop() {
  const currentPath = getCurrentPath()
  // 注意：这里可能需要反向映射（移动端路径 -> 桌面端路径）
  window.location.href = `https://pc.yourdomain.com${currentPath}`
}
```

## 测试方法

1. **开发环境测试**：
   - 启动桌面端Nuxt.js应用
   - 启动移动端SPA应用
   - 使用浏览器开发者工具切换设备模拟
   - 测试各种路径的映射是否正确

2. **生产环境测试**：
   - 部署两个应用到不同域名
   - 使用真实移动设备访问
   - 确认重定向和路径映射正常工作

3. **URI映射测试**：
   - 测试精确匹配规则
   - 测试参数匹配规则
   - 测试前缀匹配规则
   - 测试查询参数映射
   - 测试容错机制

## 故障排除

1. **重定向不生效**：检查 `mobileUrl` 配置是否正确
2. **路径映射错误**：检查 `config/uri-mapping.js` 中的映射规则
3. **路径丢失**：确认移动端SPA应用正确处理hash路由或查询参数
4. **无限重定向**：检查移动端和桌面端URL配置是否不同
5. **跨域问题**：配置正确的CORS策略或使用相同主域名
6. **URI解析失败**：检查控制台错误信息，确认映射规则语法正确
7. **参数匹配不工作**：确认正则表达式语法正确，测试匹配结果

## 高级功能

### 1. 配置验证
```javascript
import { validateUriMapping } from '~/utils/uri-resolver.js'

// 验证URI映射配置
const validation = validateUriMapping()
if (!validation.isValid) {
  console.error('URI映射配置错误:', validation.errors)
}
```

### 2. 自定义映射逻辑
可以扩展 `uri-resolver.js` 中的函数来实现更复杂的映射逻辑。

### 3. 动态映射规则
可以根据用户状态、设备特性等动态调整映射规则。