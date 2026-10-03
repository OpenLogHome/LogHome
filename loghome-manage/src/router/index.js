import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'

import DashBoard from '../views/DashBoard.vue'
import UserManage from '../views/system/UserManage.vue'

import Login from '../views/Login.vue'
import libraryRoulousChart from '../views/library/roulousChart.vue'
import faqsManage from '../views/system/FaqManage.vue'
import auditManage from '../views/system/AuditManage.vue'
import postsManage from "../views/system/postsManage.vue"
import AchievementsManage from "../views/system/AchievementsManage.vue"
import novelsManage from "../views/library/novelsManage.vue"
import articlesManage from "../views/library/articlesManage.vue"
import BannerManage from '../views/banners/index.vue'

// 导入社区管理页面
import CircleManage from "../views/community/CircleManage.vue"
import CommunityPostsManage from "../views/community/PostsManage.vue"
import ReportsManage from "../views/community/ReportsManage.vue"
import ActivityMessagesManage from '../views/community/ActivityMessagesManage.vue'
import SearchKeywordsManage from '../views/community/SearchKeywordsManage.vue'
import SensitiveWordsManage from '../views/community/SensitiveWordsManage.vue'

// 导入支付管理页面
import BankAccountsManage from "../views/payments/BankAccountsManage.vue"
import PaymentOrdersManage from "../views/payments/PaymentOrdersManage.vue"
import EarningServicesManage from '../views/payments/EarningServicesManage.vue'
import GiftCardsManage from '../views/payments/GiftCardsManage.vue'
import ExchangeRecordsManage from '../views/payments/ExchangeRecordsManage.vue'
import StoreProductsManage from "../views/store/ProductsManage.vue"
import StoreOrdersManage from "../views/store/OrdersManage.vue"
import PopupPosterManage from '../views/operations/PopupPosterManage.vue'
import RedeemCodesManage from '../views/membership/RedeemCodesManage.vue'
import PassStatusQuery from '../views/membership/PassStatusQuery.vue'
import RedstoneManage from '../views/membership/RedstoneManage.vue'
import AppUpdateManage from '../views/system/AppUpdateManage.vue'
import IndexTagsManage from '../views/library/IndexTagsManage.vue'
import SiteSettingsManage from '../views/system/SiteSettingsManage.vue'
import LibraryRecommendsManage from '../views/library/LibraryRecommendsManage.vue'
import TagsManage from '../views/library/TagsManage.vue'
import TreeConfigManage from '../views/operations/TreeConfigManage.vue'
import InvitesManage from '../views/operations/InvitesManage.vue'
import GreatUsersManage from '../views/operations/GreatUsersManage.vue'
import StickersManage from '../views/operations/StickersManage.vue'
import AvatarFramesManage from '../views/operations/AvatarFramesManage.vue'
import WritingActivitiesManage from '../views/operations/WritingActivitiesManage.vue'
import NovelCommentsManage from '../views/library/NovelCommentsManage.vue'
import TippingManage from '../views/library/TippingManage.vue'
import WorldsManage from '../views/library/WorldsManage.vue'
import ArticleFeedbacksManage from '../views/library/ArticleFeedbacksManage.vue'
import UserContentsManage from '../views/community/UserContentsManage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      {
        path: '/',
        component: DashBoard,
        name: '仪表盘',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '首页'
        }
      },
      {
        path: '/UserManage',
        component: UserManage,
        name: '用户管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '系统管理'
        }
      },
      {
        path: '/libraryRoulousChart',
        component: libraryRoulousChart,
        name: '书库轮播图管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '书库管理'
        }
      },
      {
        path: '/index-tags',
        component: IndexTagsManage,
        name: '书库快捷按钮',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '书库管理'
        }
      },
      {
        path: '/library-recommends',
        component: LibraryRecommendsManage,
        name: '榜单推荐管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '书库管理'
        }
      },
      {
        path: '/library-tags',
        component: TagsManage,
        name: '标签库管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '书库管理'
        }
      },
      {
        path: '/novel-comments',
        component: NovelCommentsManage,
        name: '章评与划线管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '书库管理'
        }
      },
      {
        path: '/tipping',
        component: TippingManage,
        name: '打赏与粉丝团',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '书库管理'
        }
      },
      {
        path: '/worlds',
        component: WorldsManage,
        name: '世界观管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '书库管理'
        }
      },
      {
        path: '/article-feedbacks',
        component: ArticleFeedbacksManage,
        name: '章节反馈管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '书库管理'
        }
      },
      {
        path: '/novelsManage',
        component: novelsManage,
        name: '小说管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '书库管理'
        }
      },
      {
        path: '/articlesManage/:novelId',
        component: articlesManage,
        name: '文章管理',
        meta: {
          requireAuth: true,
          breadNumber: 2,
          parentName: '书库管理'
        }
      },
      {
        path: '/achievementsManage',
        component: AchievementsManage,
        name: '勋章管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '系统管理'
        }
      },
      {
        path: '/faqsManage',
        component: faqsManage,
        name: '反馈管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '系统管理'
        }
      },
      {
        path: '/auditManage',
        component: auditManage,
        name: '文章审核',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '书库管理'
        }
      },
      {
        path: '/postsManage',
        component: postsManage,
        name: '帖子管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '系统管理'
        }
      },
      {
        path: '/circleManage',
        component: CircleManage,
        name: '圈子管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '社区管理'
        }
      },
      {
        path: '/communityPosts',
        component: CommunityPostsManage,
        name: '社区帖子管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '社区管理'
        }
      },
      {
        path: '/reportsManage',
        component: ReportsManage,
        name: '举报管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '社区管理'
        }
      },
      {
        path: '/activity-messages',
        component: ActivityMessagesManage,
        name: '活动消息管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '社区管理'
        }
      },
      {
        path: '/community-search-keywords',
        component: SearchKeywordsManage,
        name: '搜索关键词运营',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '社区管理'
        }
      },
      {
        path: '/community-audit-tools',
        component: SensitiveWordsManage,
        name: '敏感词与审核日志',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '社区管理'
        }
      },
      {
        path: '/user-contents',
        component: UserContentsManage,
        name: '用户内容管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '社区管理'
        }
      },
      {
        path: '/bank-accounts',
        component: BankAccountsManage,
        name: '原木银行账户',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '支付管理'
        }
      },
      {
        path: '/payment-orders',
        component: PaymentOrdersManage,
        name: '充值订单管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '支付管理'
        }
      },
      {
        path: '/earning-services',
        component: EarningServicesManage,
        name: '提现申请处理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '支付管理'
        }
      },
      {
        path: '/gift-cards',
        component: GiftCardsManage,
        name: '礼品卡管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '支付管理'
        }
      },
      {
        path: '/exchange-records',
        component: ExchangeRecordsManage,
        name: '原木兑换记录',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '支付管理'
        }
      },
      {
        path: '/store-products',
        component: StoreProductsManage,
        name: '积分商城商品管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '积分商城'
        }
      },
      {
        path: '/store-orders',
        component: StoreOrdersManage,
        name: '积分商城订单管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '积分商城'
        }
      },
      {
        path: '/popup-posters',
        component: PopupPosterManage,
        name: '弹窗海报管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '运营配置'
        }
      },
      {
        path: '/banners',
        component: BannerManage,
        name: 'Banner 管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '运营配置'
        }
      },
      {
        path: '/redeem-codes',
        component: RedeemCodesManage,
        name: '通行证兑换码管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '支付管理'
        }
      },
      {
        path: '/pass-status',
        component: PassStatusQuery,
        name: '通行证状态查询',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '支付管理'
        }
      },
      {
        path: '/redstone-manage',
        component: RedstoneManage,
        name: '红石余额管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '支付管理'
        }
      },
      {
        path: '/app-updates',
        component: AppUpdateManage,
        name: '版本管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '系统管理'
        }
      },
      {
        path: '/site-settings',
        component: SiteSettingsManage,
        name: '站点设置',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '系统管理'
        }
      },
      {
        path: '/tree-config',
        component: TreeConfigManage,
        name: '树场玩法配置',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '运营配置'
        }
      },
      {
        path: '/invites',
        component: InvitesManage,
        name: '邀请码体系',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '运营配置'
        }
      },
      {
        path: '/great-users',
        component: GreatUsersManage,
        name: '荣誉用户管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '运营配置'
        }
      },
      {
        path: '/stickers',
        component: StickersManage,
        name: '表情包管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '运营配置'
        }
      },
      {
        path: '/avatar-frames',
        component: AvatarFramesManage,
        name: '头像挂件管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '运营配置'
        }
      },
      {
        path: '/writing-activities',
        component: WritingActivitiesManage,
        name: '写作活动管理',
        meta: {
          requireAuth: true,
          breadNumber: 1,
          parentName: '运营配置'
        }
      }
    ]
  },
  {
    path: '/login',
    component: Login,
    name: '登录',
    meta: {
      requireAuth: false,
      breadNumber: 0
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
