/**
 * URI映射配置文件
 * 定义桌面端到移动端的路径映射规则
 */

export default {
  // 精确匹配规则 - 完全匹配路径
  exact: {
    '/': '/',                    // 首页映射
    '/write': '/pages/essays',             // 写作页面
    '/community': '/pages/community/index',             // 写作页面
    '/read': '/pages/library',               // 个人中心
    '/read/collections': '/pages/readers/collections',  // 标签页面
    '/community/post/edit': '/pages/community/postEdit',
    '/me': '/pages/me',
    '/write/new': '/pages/writers/newEssay',
  },

  // 参数匹配规则 - 支持动态参数
  params: [
    {
      pattern: /^\/users\/(\d+)$/,
      replacement: '/pages/users/personalPage?id=$1'
    },
    {
      pattern: /^\/article\/(\d+)$/,
      replacement: '/pages/readers/newReader/article?id=$1'
    },
    {
      pattern: /^\/novel\/(\d+)$/,
      replacement: '/pages/readers/bookInfo?id=$1'
    },
    {
      pattern: /^\/write\/edit\/(\d+)$/,
      replacement: '/pages/writers/allArticles?id=$1'
    },
    {
      pattern: /^\/write\/settings\/(\d+)$/,
      replacement: '/pages/writers/essaySet?id=$1'
    },
    {
      pattern: /^\/write\/settings\/tags\/(\d+)$/,
      replacement: '/pages/writers/changeNovelTags?id=$1'
    },
    {
      pattern: /^\/write\/settings\/info\/(\d+)$/,
      replacement: '/pages/writers/changeEssayInfo?id=$1'
    },
    {
      pattern: /^\/community\/post\/(\d+)$/,
      replacement: '/pages/community/postDetail?id=$1'
    },
    {
      pattern: /^\/community\/circle\/(\d+)$/,
      replacement: '/pages/community/circle?id=$1'
    },
    {
      pattern: /^\/community\/circle\/(\d+)$/,
      replacement: '/pages/community/circle?id=$1'
    }
  ],

  // 前缀匹配规则 - 匹配路径前缀
  prefix: [],

  // 查询参数映射规则
  queryParams: {},

  // 默认映射规则
  default: {
    // 如果没有匹配到任何规则，是否保持原路径
    keepOriginal: true,
    // 默认前缀（可选）
    prefix: '',
    // 是否移除特定前缀
    removePrefix: []
  },

  // 特殊处理规则
  special: {
    // 需要完全忽略的路径（不进行重定向）
    ignore: [
      '/api',
      '/static',
      '/assets',
      '/_nuxt'
    ],
    // 需要移除的查询参数
    removeParams: [
      'utm_source',
      'utm_medium',
      'utm_campaign'
    ]
  }
}