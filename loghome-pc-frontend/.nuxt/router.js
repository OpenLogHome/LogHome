import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5bcb2864 = () => interopDefault(import('..\\pages\\community\\index.vue' /* webpackChunkName: "pages/community/index" */))
const _ab50afe0 = () => interopDefault(import('..\\pages\\forgot-password.vue' /* webpackChunkName: "pages/forgot-password" */))
const _6a755198 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _7c86eaf6 = () => interopDefault(import('..\\pages\\me\\index.vue' /* webpackChunkName: "pages/me/index" */))
const _0b120af2 = () => interopDefault(import('..\\pages\\membership\\index.vue' /* webpackChunkName: "pages/membership/index" */))
const _110599f2 = () => interopDefault(import('..\\pages\\read\\index.vue' /* webpackChunkName: "pages/read/index" */))
const _6350ae26 = () => interopDefault(import('..\\pages\\search.vue' /* webpackChunkName: "pages/search" */))
const _387b1656 = () => interopDefault(import('..\\pages\\store\\index.vue' /* webpackChunkName: "pages/store/index" */))
const _2e37b8a4 = () => interopDefault(import('..\\pages\\tags\\index.vue' /* webpackChunkName: "pages/tags/index" */))
const _c641e6d0 = () => interopDefault(import('..\\pages\\write\\index.vue' /* webpackChunkName: "pages/write/index" */))
const _6fe23e56 = () => interopDefault(import('..\\pages\\about\\open-source.vue' /* webpackChunkName: "pages/about/open-source" */))
const _e150c318 = () => interopDefault(import('..\\pages\\agreement\\content.vue' /* webpackChunkName: "pages/agreement/content" */))
const _5ce457e8 = () => interopDefault(import('..\\pages\\community\\chat.vue' /* webpackChunkName: "pages/community/chat" */))
const _bdb6f1c2 = () => interopDefault(import('..\\pages\\community\\circles.vue' /* webpackChunkName: "pages/community/circles" */))
const _1cf1e75c = () => interopDefault(import('..\\pages\\community\\search.vue' /* webpackChunkName: "pages/community/search" */))
const _803da97e = () => interopDefault(import('..\\pages\\me\\achievements.vue' /* webpackChunkName: "pages/me/achievements" */))
const _2a49d456 = () => interopDefault(import('..\\pages\\me\\credit.vue' /* webpackChunkName: "pages/me/credit" */))
const _3cd80f83 = () => interopDefault(import('..\\pages\\me\\frames.vue' /* webpackChunkName: "pages/me/frames" */))
const _f12211f0 = () => interopDefault(import('..\\pages\\me\\friends.vue' /* webpackChunkName: "pages/me/friends" */))
const _90bcbc44 = () => interopDefault(import('..\\pages\\me\\help.vue' /* webpackChunkName: "pages/me/help" */))
const _d9545f34 = () => interopDefault(import('..\\pages\\me\\invite.vue' /* webpackChunkName: "pages/me/invite" */))
const _7f737880 = () => interopDefault(import('..\\pages\\me\\lab.vue' /* webpackChunkName: "pages/me/lab" */))
const _1153e82e = () => interopDefault(import('..\\pages\\me\\messages.vue' /* webpackChunkName: "pages/me/messages" */))
const _b2f09eca = () => interopDefault(import('..\\pages\\me\\notifications.vue' /* webpackChunkName: "pages/me/notifications" */))
const _731f67dd = () => interopDefault(import('..\\pages\\me\\security.vue' /* webpackChunkName: "pages/me/security" */))
const _62cc8340 = () => interopDefault(import('..\\pages\\me\\settings.vue' /* webpackChunkName: "pages/me/settings" */))
const _14510cee = () => interopDefault(import('..\\pages\\me\\storage.vue' /* webpackChunkName: "pages/me/storage" */))
const _3953cfbb = () => interopDefault(import('..\\pages\\me\\tree.vue' /* webpackChunkName: "pages/me/tree" */))
const _41fc0554 = () => interopDefault(import('..\\pages\\me\\wallet.vue' /* webpackChunkName: "pages/me/wallet" */))
const _236b340b = () => interopDefault(import('..\\pages\\membership\\gift.vue' /* webpackChunkName: "pages/membership/gift" */))
const _d0ff2c92 = () => interopDefault(import('..\\pages\\membership\\redeem.vue' /* webpackChunkName: "pages/membership/redeem" */))
const _a21affa8 = () => interopDefault(import('..\\pages\\membership\\rules.vue' /* webpackChunkName: "pages/membership/rules" */))
const _19559ef2 = () => interopDefault(import('..\\pages\\novel\\fans.vue' /* webpackChunkName: "pages/novel/fans" */))
const _7e2a0cf0 = () => interopDefault(import('..\\pages\\read\\activities.vue' /* webpackChunkName: "pages/read/activities" */))
const _2ea2b418 = () => interopDefault(import('..\\pages\\read\\bookcase.vue' /* webpackChunkName: "pages/read/bookcase" */))
const _8e7326ec = () => interopDefault(import('..\\pages\\read\\collections.vue' /* webpackChunkName: "pages/read/collections" */))
const _b5c21ef2 = () => interopDefault(import('..\\pages\\read\\rank.vue' /* webpackChunkName: "pages/read/rank" */))
const _77d8994f = () => interopDefault(import('..\\pages\\read\\redstone.vue' /* webpackChunkName: "pages/read/redstone" */))
const _15ab5f4c = () => interopDefault(import('..\\pages\\read\\resources.vue' /* webpackChunkName: "pages/read/resources" */))
const _32777519 = () => interopDefault(import('..\\pages\\read\\rewards.vue' /* webpackChunkName: "pages/read/rewards" */))
const _ac32a9b4 = () => interopDefault(import('..\\pages\\store\\addresses.vue' /* webpackChunkName: "pages/store/addresses" */))
const _49beb6de = () => interopDefault(import('..\\pages\\store\\orders.vue' /* webpackChunkName: "pages/store/orders" */))
const _23cf2240 = () => interopDefault(import('..\\pages\\tag\\collections.vue' /* webpackChunkName: "pages/tag/collections" */))
const _012d29e6 = () => interopDefault(import('..\\pages\\write\\new.vue' /* webpackChunkName: "pages/write/new" */))
const _2bffa600 = () => interopDefault(import('..\\pages\\community\\circle\\create.vue' /* webpackChunkName: "pages/community/circle/create" */))
const _7b59ff76 = () => interopDefault(import('..\\pages\\community\\mail\\new.vue' /* webpackChunkName: "pages/community/mail/new" */))
const _3cebdcde = () => interopDefault(import('..\\pages\\community\\post\\edit.vue' /* webpackChunkName: "pages/community/post/edit" */))
const _5ad89545 = () => interopDefault(import('..\\pages\\community\\circle\\members\\_id.vue' /* webpackChunkName: "pages/community/circle/members/_id" */))
const _de9b63ba = () => interopDefault(import('..\\pages\\community\\circle\\settings\\_id.vue' /* webpackChunkName: "pages/community/circle/settings/_id" */))
const _4b4dfa8f = () => interopDefault(import('..\\pages\\write\\settings\\info\\_id.vue' /* webpackChunkName: "pages/write/settings/info/_id" */))
const _e61758f8 = () => interopDefault(import('..\\pages\\write\\settings\\tags\\_id.vue' /* webpackChunkName: "pages/write/settings/tags/_id" */))
const _626d1766 = () => interopDefault(import('..\\pages\\community\\circle\\_id.vue' /* webpackChunkName: "pages/community/circle/_id" */))
const _a2c5a942 = () => interopDefault(import('..\\pages\\community\\mail\\_id.vue' /* webpackChunkName: "pages/community/mail/_id" */))
const _979ee278 = () => interopDefault(import('..\\pages\\community\\miniapp\\_id.vue' /* webpackChunkName: "pages/community/miniapp/_id" */))
const _5917ce96 = () => interopDefault(import('..\\pages\\community\\post\\_id.vue' /* webpackChunkName: "pages/community/post/_id" */))
const _eb526df2 = () => interopDefault(import('..\\pages\\manga\\read\\_articleId.vue' /* webpackChunkName: "pages/manga/read/_articleId" */))
const _615447bc = () => interopDefault(import('..\\pages\\read\\ask\\_id.vue' /* webpackChunkName: "pages/read/ask/_id" */))
const _3155fd16 = () => interopDefault(import('..\\pages\\read\\comment\\_id.vue' /* webpackChunkName: "pages/read/comment/_id" */))
const _2cbd70cc = () => interopDefault(import('..\\pages\\read\\end\\_id.vue' /* webpackChunkName: "pages/read/end/_id" */))
const _64535c20 = () => interopDefault(import('..\\pages\\read\\power\\_id.vue' /* webpackChunkName: "pages/read/power/_id" */))
const _7bad291d = () => interopDefault(import('..\\pages\\read\\preview\\_key.vue' /* webpackChunkName: "pages/read/preview/_key" */))
const _f2fc5d00 = () => interopDefault(import('..\\pages\\world\\relations\\_id.vue' /* webpackChunkName: "pages/world/relations/_id" */))
const _d30ec794 = () => interopDefault(import('..\\pages\\write\\edit\\_id.vue' /* webpackChunkName: "pages/write/edit/_id" */))
const _6767d33d = () => interopDefault(import('..\\pages\\write\\settings\\_id.vue' /* webpackChunkName: "pages/write/settings/_id" */))
const _767e00ae = () => interopDefault(import('..\\pages\\write\\activity-form\\_workId\\_tagId.vue' /* webpackChunkName: "pages/write/activity-form/_workId/_tagId" */))
const _a6b65aee = () => interopDefault(import('..\\pages\\article\\_id.vue' /* webpackChunkName: "pages/article/_id" */))
const _09cf68cb = () => interopDefault(import('..\\pages\\manga\\_id.vue' /* webpackChunkName: "pages/manga/_id" */))
const _ec79a17a = () => interopDefault(import('..\\pages\\novel\\_id.vue' /* webpackChunkName: "pages/novel/_id" */))
const _4766b63e = () => interopDefault(import('..\\pages\\store\\_id.vue' /* webpackChunkName: "pages/store/_id" */))
const _2bb2fcf7 = () => interopDefault(import('..\\pages\\users\\_id.vue' /* webpackChunkName: "pages/users/_id" */))
const _6883eaa6 = () => interopDefault(import('..\\pages\\world\\_id.vue' /* webpackChunkName: "pages/world/_id" */))
const _011db41d = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/community",
    component: _5bcb2864,
    name: "community"
  }, {
    path: "/forgot-password",
    component: _ab50afe0,
    name: "forgot-password"
  }, {
    path: "/login",
    component: _6a755198,
    name: "login"
  }, {
    path: "/me",
    component: _7c86eaf6,
    name: "me"
  }, {
    path: "/membership",
    component: _0b120af2,
    name: "membership"
  }, {
    path: "/read",
    component: _110599f2,
    name: "read"
  }, {
    path: "/search",
    component: _6350ae26,
    name: "search"
  }, {
    path: "/store",
    component: _387b1656,
    name: "store"
  }, {
    path: "/tags",
    component: _2e37b8a4,
    name: "tags"
  }, {
    path: "/write",
    component: _c641e6d0,
    name: "write"
  }, {
    path: "/about/open-source",
    component: _6fe23e56,
    name: "about-open-source"
  }, {
    path: "/agreement/content",
    component: _e150c318,
    name: "agreement-content"
  }, {
    path: "/community/chat",
    component: _5ce457e8,
    name: "community-chat"
  }, {
    path: "/community/circles",
    component: _bdb6f1c2,
    name: "community-circles"
  }, {
    path: "/community/search",
    component: _1cf1e75c,
    name: "community-search"
  }, {
    path: "/me/achievements",
    component: _803da97e,
    name: "me-achievements"
  }, {
    path: "/me/credit",
    component: _2a49d456,
    name: "me-credit"
  }, {
    path: "/me/frames",
    component: _3cd80f83,
    name: "me-frames"
  }, {
    path: "/me/friends",
    component: _f12211f0,
    name: "me-friends"
  }, {
    path: "/me/help",
    component: _90bcbc44,
    name: "me-help"
  }, {
    path: "/me/invite",
    component: _d9545f34,
    name: "me-invite"
  }, {
    path: "/me/lab",
    component: _7f737880,
    name: "me-lab"
  }, {
    path: "/me/messages",
    component: _1153e82e,
    name: "me-messages"
  }, {
    path: "/me/notifications",
    component: _b2f09eca,
    name: "me-notifications"
  }, {
    path: "/me/security",
    component: _731f67dd,
    name: "me-security"
  }, {
    path: "/me/settings",
    component: _62cc8340,
    name: "me-settings"
  }, {
    path: "/me/storage",
    component: _14510cee,
    name: "me-storage"
  }, {
    path: "/me/tree",
    component: _3953cfbb,
    name: "me-tree"
  }, {
    path: "/me/wallet",
    component: _41fc0554,
    name: "me-wallet"
  }, {
    path: "/membership/gift",
    component: _236b340b,
    name: "membership-gift"
  }, {
    path: "/membership/redeem",
    component: _d0ff2c92,
    name: "membership-redeem"
  }, {
    path: "/membership/rules",
    component: _a21affa8,
    name: "membership-rules"
  }, {
    path: "/novel/fans",
    component: _19559ef2,
    name: "novel-fans"
  }, {
    path: "/read/activities",
    component: _7e2a0cf0,
    name: "read-activities"
  }, {
    path: "/read/bookcase",
    component: _2ea2b418,
    name: "read-bookcase"
  }, {
    path: "/read/collections",
    component: _8e7326ec,
    name: "read-collections"
  }, {
    path: "/read/rank",
    component: _b5c21ef2,
    name: "read-rank"
  }, {
    path: "/read/redstone",
    component: _77d8994f,
    name: "read-redstone"
  }, {
    path: "/read/resources",
    component: _15ab5f4c,
    name: "read-resources"
  }, {
    path: "/read/rewards",
    component: _32777519,
    name: "read-rewards"
  }, {
    path: "/store/addresses",
    component: _ac32a9b4,
    name: "store-addresses"
  }, {
    path: "/store/orders",
    component: _49beb6de,
    name: "store-orders"
  }, {
    path: "/tag/collections",
    component: _23cf2240,
    name: "tag-collections"
  }, {
    path: "/write/new",
    component: _012d29e6,
    name: "write-new"
  }, {
    path: "/community/circle/create",
    component: _2bffa600,
    name: "community-circle-create"
  }, {
    path: "/community/mail/new",
    component: _7b59ff76,
    name: "community-mail-new"
  }, {
    path: "/community/post/edit",
    component: _3cebdcde,
    name: "community-post-edit"
  }, {
    path: "/community/circle/members/:id?",
    component: _5ad89545,
    name: "community-circle-members-id"
  }, {
    path: "/community/circle/settings/:id?",
    component: _de9b63ba,
    name: "community-circle-settings-id"
  }, {
    path: "/write/settings/info/:id?",
    component: _4b4dfa8f,
    name: "write-settings-info-id"
  }, {
    path: "/write/settings/tags/:id?",
    component: _e61758f8,
    name: "write-settings-tags-id"
  }, {
    path: "/community/circle/:id?",
    component: _626d1766,
    name: "community-circle-id"
  }, {
    path: "/community/mail/:id?",
    component: _a2c5a942,
    name: "community-mail-id"
  }, {
    path: "/community/miniapp/:id?",
    component: _979ee278,
    name: "community-miniapp-id"
  }, {
    path: "/community/post/:id?",
    component: _5917ce96,
    name: "community-post-id"
  }, {
    path: "/manga/read/:articleId?",
    component: _eb526df2,
    name: "manga-read-articleId"
  }, {
    path: "/read/ask/:id?",
    component: _615447bc,
    name: "read-ask-id"
  }, {
    path: "/read/comment/:id?",
    component: _3155fd16,
    name: "read-comment-id"
  }, {
    path: "/read/end/:id?",
    component: _2cbd70cc,
    name: "read-end-id"
  }, {
    path: "/read/power/:id?",
    component: _64535c20,
    name: "read-power-id"
  }, {
    path: "/read/preview/:key?",
    component: _7bad291d,
    name: "read-preview-key"
  }, {
    path: "/world/relations/:id?",
    component: _f2fc5d00,
    name: "world-relations-id"
  }, {
    path: "/write/edit/:id?",
    component: _d30ec794,
    name: "write-edit-id"
  }, {
    path: "/write/settings/:id?",
    component: _6767d33d,
    name: "write-settings-id"
  }, {
    path: "/write/activity-form/:workId?/:tagId?",
    component: _767e00ae,
    name: "write-activity-form-workId-tagId"
  }, {
    path: "/article/:id?",
    component: _a6b65aee,
    name: "article-id"
  }, {
    path: "/manga/:id?",
    component: _09cf68cb,
    name: "manga-id"
  }, {
    path: "/novel/:id?",
    component: _ec79a17a,
    name: "novel-id"
  }, {
    path: "/store/:id",
    component: _4766b63e,
    name: "store-id"
  }, {
    path: "/users/:id?",
    component: _2bb2fcf7,
    name: "users-id"
  }, {
    path: "/world/:id?",
    component: _6883eaa6,
    name: "world-id"
  }, {
    path: "/",
    component: _011db41d,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
