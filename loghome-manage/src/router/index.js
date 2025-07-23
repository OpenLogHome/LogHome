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
import novelsManage from "../views/library/novelsManage.vue"
import articlesManage from "../views/library/articlesManage.vue"

// 导入社区管理页面
import CircleManage from "../views/community/CircleManage.vue"
import CommunityPostsManage from "../views/community/PostsManage.vue"
import ReportsManage from "../views/community/ReportsManage.vue"

// 导入支付管理页面
import BankAccountsManage from "../views/payments/BankAccountsManage.vue"
import PaymentOrdersManage from "../views/payments/PaymentOrdersManage.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children:[ 
        {
            path: '/',
            component:DashBoard,
            name:'仪表盘',
            meta: {
                requireAuth: true,
                breadNumber: 1,
                parentName:"首页"
            }
        },
        {
            path: '/UserManage',
            component:UserManage,
            name:'用户管理',
            meta: {
                requireAuth: true,
                breadNumber: 1,
                parentName:"系统管理"
            }
        },
        {
            path:'/libraryRoulousChart',
            component:libraryRoulousChart,
            name:'书库轮播图管理',
            meta: {
                requireAuth: true,
                breadNumber: 1,
                parentName:"书库管理"
            }
        },
        {
            path:'/novelsManage',
            component:novelsManage,
            name:'小说管理',
            meta: {
                requireAuth: true,
                breadNumber: 1,
                parentName:"书库管理"
            }
        },
        {
            path:'/articlesManage/:novelId',
            component:articlesManage,
            name:'文章管理',
            meta: {
                requireAuth: true,
                breadNumber: 2,
                parentName:"书库管理"
            }
        },
        {
            path:'/faqsManage',
            component:faqsManage,
            name:'反馈管理',
            meta: {
                requireAuth: true,
                breadNumber: 1,
                parentName:"系统管理"
            }
        },
        {
            path:'/auditManage',
            component:auditManage,
            name:'文章审核',
            meta: {
                requireAuth: true,
                breadNumber: 1,
                parentName:"书库管理"
            }
        },
        {
            path:'/postsManage',
            component:postsManage,
            name:'帖子管理',
            meta: {
                requireAuth: true,
                breadNumber: 1,
                parentName:"系统管理"
            }
        },
        // 社区管理路由
        {
            path:'/circleManage',
            component:CircleManage,
            name:'圈子管理',
            meta: {
                requireAuth: true,
                breadNumber: 1,
                parentName:"社区管理"
            }
        },
        {
            path:'/communityPosts',
            component:CommunityPostsManage,
            name:'社区帖子管理',
            meta: {
                requireAuth: true,
                breadNumber: 1,
                parentName:"社区管理"
            }
        },
        {
            path:'/reportsManage',
            component:ReportsManage,
            name:'举报管理',
            meta: {
                requireAuth: true,
                breadNumber: 1,
                parentName:"社区管理"
            }
        },
        {            path: '/activity-messages',            name: 'ActivityMessagesManage',            component: () => import('../views/community/ActivityMessagesManage.vue'),            meta: { title: '活动消息管理', requiresAuth: true }        },
        // 支付管理路由
        {
            path: '/bank-accounts',
            component: BankAccountsManage,
            name: '原木银行账户',
            meta: {
                requireAuth: true,
                breadNumber: 1,
                parentName: "支付管理"
            }
        },
        {
            path: '/payment-orders',
            component: PaymentOrdersManage,
            name: '充值订单管理',
            meta: {
                requireAuth: true,
                breadNumber: 1,
                parentName: "支付管理"
            }
        }    ]  },
  {
      path:'/login',
      component:Login,
      name:'登录',
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
