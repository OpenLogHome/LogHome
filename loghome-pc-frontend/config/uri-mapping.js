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
    '/read/rank': '/pages/readers/rankBoard',
    '/read/bookcase': '/pages/bookcase/index',
    '/tags': '/pages/readers/tags',
    '/tag/collections': '/pages/readers/tagCollections',
    '/read/collections': '/pages/readers/collections',  // 标签页面
    '/community/post/edit': '/pages/community/postEdit',
    '/community/search': '/pages/community/search',
    '/community/circles': '/pages/community/circles',
    '/community/mail/new': '/pages/community/send_mail',
    '/community/circle/create': '/pages/community/createCircle',
    '/me/messages': '/pages/community/message',
    '/me/friends': '/pages/community/friends',
    '/me/settings': '/pages/users/clientSet',
    '/me/security': '/pages/users/activateAccount_email',
    '/me/notifications': '/pages/settings/pushSettings',
    '/me/storage': '/pages/users/storageManage',
    '/me/achievements': '/pages/users/achievements',
    '/me/frames': '/pages/users/avatar_frames',
    '/me/credit': '/pages/users/user_credit',
    '/me/tree': '/pages/treePlant/treeplant',
    '/me/invite': '/pages/apps/inviteCard',
    '/me/lab': '/pages/apps/lab',
    '/me/help': '/pages/apps/faqs/faq',
    '/me/wallet': '/pages/payments/recharge',
    '/membership': '/pages/membership/index',
    '/membership/redeem': '/pages/membership/redeem',
    '/membership/gift': '/pages/membership/gift',
    '/membership/rules': '/pages/membership/rules',
    '/store': '/pages/store/index',
    '/store/addresses': '/pages/store/address_list',
    '/store/orders': '/pages/store/orders',
    '/me': '/pages/me',
    '/write/new': '/pages/writers/newEssay',
    '/forgot-password': '/pages/users/forgottenPwd',
  },

  // 参数匹配规则 - 支持动态参数
  params: [
    { pattern: /^\/community\/mail\/(\d+)$/, replacement: '/pages/community/read_mail?id=$1' },
    { pattern: /^\/community\/circle\/settings\/(\d+)$/, replacement: '/pages/community/editCircle?id=$1' },
    { pattern: /^\/community\/circle\/members\/(\d+)$/, replacement: '/pages/community/circleMembers?id=$1' },
    { pattern: /^\/community\/miniapp\/([a-z][a-z0-9-]*)$/, replacement: '/pages/apps/miniapp?id=$1' },
    { pattern: /^\/store\/(\d+)$/, replacement: '/pages/store/detail?product_id=$1' },
    { pattern: /^\/read\/end\/(\d+)$/, replacement: '/pages/readers/bookEnd?novelId=$1' },
    { pattern: /^\/world\/(\d+)$/, replacement: '/pages/worlds/worldPage?id=$1' },
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
      pattern: /^\/manga\/read\/(\d+)$/,
      replacement: '/pages/readers/mangaReader?id=$1'
    },
    {
      pattern: /^\/manga\/(\d+)$/,
      replacement: '/pages/readers/mangaInfo?id=$1'
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
