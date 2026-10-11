// 侧栏和搜索共用同一份菜单，新增入口只需在这里维护。
export const dashboardMenu = { path: '/', label: '仪表盘', icon: 'el-icon-data-analysis' }

export const adminMenuGroups = [
  {
    id: 'library', label: '书库管理', icon: 'el-icon-notebook-1',
    children: [
      { path: '/libraryRoulousChart', label: '轮播图管理', icon: 'el-icon-picture-outline' },
      { path: '/index-tags', label: '快捷按钮管理', icon: 'el-icon-collection-tag' },
      { path: '/library-recommends', label: '榜单推荐管理', icon: 'el-icon-trophy' },
      { path: '/library-tags', label: '标签库管理', icon: 'el-icon-price-tag' },
      { path: '/novel-comments', label: '章评与划线管理', icon: 'el-icon-chat-line-square' },
      { path: '/tipping', label: '打赏与粉丝团', icon: 'el-icon-gift' },
      { path: '/worlds', label: '世界观管理', icon: 'el-icon-collection' },
      { path: '/article-feedbacks', label: '章节反馈管理', icon: 'el-icon-edit-outline' },
      { path: '/novelsManage', label: '小说管理', icon: 'el-icon-reading' },
      { path: '/auditManage', label: '文章审核', icon: 'el-icon-coordinate' }
    ]
  },
  {
    id: 'system', label: '系统管理', icon: 'el-icon-setting',
    children: [
      { path: '/UserManage', label: '用户管理', icon: 'el-icon-user' },
      { path: '/faqsManage', label: '反馈管理', icon: 'el-icon-phone-outline' },
      { path: '/postsManage', label: '帖子管理', icon: 'el-icon-document-copy' },
      { path: '/achievementsManage', label: '勋章管理', icon: 'el-icon-medal' },
      { path: '/app-updates', label: '版本管理', icon: 'el-icon-upload2' },
      { path: '/miniapps', label: '小程序管理', icon: 'el-icon-mobile-phone' },
      { path: '/site-settings', label: '站点设置', icon: 'el-icon-set-up' }
    ]
  },
  {
    id: 'community', label: '社区管理', icon: 'el-icon-chat-dot-round',
    children: [
      { path: '/circleManage', label: '圈子管理', icon: 'el-icon-connection' },
      { path: '/communityPosts', label: '帖子管理', icon: 'el-icon-document' },
      { path: '/reportsManage', label: '举报管理', icon: 'el-icon-warning-outline' },
      { path: '/activity-messages', label: '活动消息', icon: 'el-icon-date' },
      { path: '/community-search-keywords', label: '搜索关键词运营', icon: 'el-icon-search' },
      { path: '/community-audit-tools', label: '敏感词与审核日志', icon: 'el-icon-lock' },
      { path: '/user-contents', label: '用户内容管理', icon: 'el-icon-folder-opened' }
    ]
  },
  {
    id: 'payments', label: '支付管理', icon: 'el-icon-money',
    children: [
      { path: '/bank-accounts', label: '原木银行账户', icon: 'el-icon-bank-card' },
      { path: '/payment-orders', label: '充值订单管理', icon: 'el-icon-shopping-cart-full' },
      { path: '/earning-services', label: '提现申请处理', icon: 'el-icon-wallet' },
      { path: '/gift-cards', label: '礼品卡管理', icon: 'el-icon-present' },
      { path: '/exchange-records', label: '原木兑换记录', icon: 'el-icon-sort' },
      { path: '/redeem-codes', label: '通行证兑换码', icon: 'el-icon-tickets' },
      { path: '/pass-status', label: '通行证状态查询', icon: 'el-icon-user' },
      { path: '/redstone-manage', label: '红石余额管理', icon: 'el-icon-coin' }
    ]
  },
  {
    id: 'store', label: '积分商城', icon: 'el-icon-present',
    children: [
      { path: '/store-products', label: '商品管理', icon: 'el-icon-goods' },
      { path: '/store-orders', label: '订单管理', icon: 'el-icon-tickets' }
    ]
  },
  {
    id: 'operations', label: '运营配置', icon: 'el-icon-s-operation',
    children: [
      { path: '/popup-posters', label: '弹窗海报', icon: 'el-icon-picture-outline' },
      { path: '/banners', label: 'Banner 管理', icon: 'el-icon-picture' },
      { path: '/tree-config', label: '树场玩法配置', icon: 'el-icon-cherry' },
      { path: '/invites', label: '邀请码体系', icon: 'el-icon-chat-line-square' },
      { path: '/great-users', label: '荣誉用户管理', icon: 'el-icon-medal-1' },
      { path: '/stickers', label: '表情包管理', icon: 'el-icon-picture-outline-round' },
      { path: '/avatar-frames', label: '头像挂件管理', icon: 'el-icon-circle-plus-outline' },
      { path: '/writing-activities', label: '写作活动管理', icon: 'el-icon-trophy-1' }
    ]
  }
]
