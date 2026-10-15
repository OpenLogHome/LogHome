import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _d1066372 = () => interopDefault(import('../pages/community/index.vue' /* webpackChunkName: "pages/community/index" */))
const _2f9620a0 = () => interopDefault(import('../pages/forgot-password.vue' /* webpackChunkName: "pages/forgot-password" */))
const _3e9643c4 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _22cb0d90 = () => interopDefault(import('../pages/me/index.vue' /* webpackChunkName: "pages/me/index" */))
const _ac8db564 = () => interopDefault(import('../pages/membership/index.vue' /* webpackChunkName: "pages/membership/index" */))
const _47d5b0ce = () => interopDefault(import('../pages/read/index.vue' /* webpackChunkName: "pages/read/index" */))
const _56b76346 = () => interopDefault(import('../pages/search.vue' /* webpackChunkName: "pages/search" */))
const _b1690a82 = () => interopDefault(import('../pages/store/index.vue' /* webpackChunkName: "pages/store/index" */))
const _39158391 = () => interopDefault(import('../pages/tags/index.vue' /* webpackChunkName: "pages/tags/index" */))
const _79629786 = () => interopDefault(import('../pages/write/index.vue' /* webpackChunkName: "pages/write/index" */))
const _6a6a3fd7 = () => interopDefault(import('../pages/about/open-source.vue' /* webpackChunkName: "pages/about/open-source" */))
const _7553b862 = () => interopDefault(import('../pages/agreement/content.vue' /* webpackChunkName: "pages/agreement/content" */))
const _4b88be73 = () => interopDefault(import('../pages/community/chat.vue' /* webpackChunkName: "pages/community/chat" */))
const _d10fa150 = () => interopDefault(import('../pages/community/circles.vue' /* webpackChunkName: "pages/community/circles" */))
const _03dbd403 = () => interopDefault(import('../pages/community/search.vue' /* webpackChunkName: "pages/community/search" */))
const _63b635d6 = () => interopDefault(import('../pages/me/achievements.vue' /* webpackChunkName: "pages/me/achievements" */))
const _29e89aaa = () => interopDefault(import('../pages/me/credit.vue' /* webpackChunkName: "pages/me/credit" */))
const _04cc2450 = () => interopDefault(import('../pages/me/frames.vue' /* webpackChunkName: "pages/me/frames" */))
const _422e395a = () => interopDefault(import('../pages/me/friends.vue' /* webpackChunkName: "pages/me/friends" */))
const _9afddd1a = () => interopDefault(import('../pages/me/help.vue' /* webpackChunkName: "pages/me/help" */))
const _5417aebb = () => interopDefault(import('../pages/me/invite.vue' /* webpackChunkName: "pages/me/invite" */))
const _e0657b6a = () => interopDefault(import('../pages/me/lab.vue' /* webpackChunkName: "pages/me/lab" */))
const _e1ccae04 = () => interopDefault(import('../pages/me/messages.vue' /* webpackChunkName: "pages/me/messages" */))
const _7d53f8a6 = () => interopDefault(import('../pages/me/notifications.vue' /* webpackChunkName: "pages/me/notifications" */))
const _0ae304f2 = () => interopDefault(import('../pages/me/security.vue' /* webpackChunkName: "pages/me/security" */))
const _0adfbf56 = () => interopDefault(import('../pages/me/settings.vue' /* webpackChunkName: "pages/me/settings" */))
const _6bcaf939 = () => interopDefault(import('../pages/me/storage.vue' /* webpackChunkName: "pages/me/storage" */))
const _34333f50 = () => interopDefault(import('../pages/me/tree.vue' /* webpackChunkName: "pages/me/tree" */))
const _c07848aa = () => interopDefault(import('../pages/me/wallet.vue' /* webpackChunkName: "pages/me/wallet" */))
const _73651464 = () => interopDefault(import('../pages/membership/gift.vue' /* webpackChunkName: "pages/membership/gift" */))
const _5ef8d060 = () => interopDefault(import('../pages/membership/redeem.vue' /* webpackChunkName: "pages/membership/redeem" */))
const _5e34aaf3 = () => interopDefault(import('../pages/membership/rules.vue' /* webpackChunkName: "pages/membership/rules" */))
const _174bec68 = () => interopDefault(import('../pages/novel/fans.vue' /* webpackChunkName: "pages/novel/fans" */))
const _ee25ffbe = () => interopDefault(import('../pages/read/activities.vue' /* webpackChunkName: "pages/read/activities" */))
const _5af90266 = () => interopDefault(import('../pages/read/bookcase.vue' /* webpackChunkName: "pages/read/bookcase" */))
const _1df58dde = () => interopDefault(import('../pages/read/collections.vue' /* webpackChunkName: "pages/read/collections" */))
const _7e6c1de0 = () => interopDefault(import('../pages/read/rank.vue' /* webpackChunkName: "pages/read/rank" */))
const _61ad7228 = () => interopDefault(import('../pages/read/redstone.vue' /* webpackChunkName: "pages/read/redstone" */))
const _45f092a1 = () => interopDefault(import('../pages/read/resources.vue' /* webpackChunkName: "pages/read/resources" */))
const _62b0c5c0 = () => interopDefault(import('../pages/read/rewards.vue' /* webpackChunkName: "pages/read/rewards" */))
const _90a699e2 = () => interopDefault(import('../pages/store/addresses.vue' /* webpackChunkName: "pages/store/addresses" */))
const _465ccd48 = () => interopDefault(import('../pages/store/orders.vue' /* webpackChunkName: "pages/store/orders" */))
const _7afc588a = () => interopDefault(import('../pages/tag/collections.vue' /* webpackChunkName: "pages/tag/collections" */))
const _2e3c76cb = () => interopDefault(import('../pages/write/new.vue' /* webpackChunkName: "pages/write/new" */))
const _7e6631e0 = () => interopDefault(import('../pages/community/circle/create.vue' /* webpackChunkName: "pages/community/circle/create" */))
const _b6c7da3a = () => interopDefault(import('../pages/community/mail/new.vue' /* webpackChunkName: "pages/community/mail/new" */))
const _ad3404e4 = () => interopDefault(import('../pages/community/post/edit.vue' /* webpackChunkName: "pages/community/post/edit" */))
const _0586b060 = () => interopDefault(import('../pages/community/circle/members/_id.vue' /* webpackChunkName: "pages/community/circle/members/_id" */))
const _211b41e2 = () => interopDefault(import('../pages/community/circle/settings/_id.vue' /* webpackChunkName: "pages/community/circle/settings/_id" */))
const _6d7abeb0 = () => interopDefault(import('../pages/write/settings/info/_id.vue' /* webpackChunkName: "pages/write/settings/info/_id" */))
const _77daf31b = () => interopDefault(import('../pages/write/settings/tags/_id.vue' /* webpackChunkName: "pages/write/settings/tags/_id" */))
const _1c191756 = () => interopDefault(import('../pages/community/circle/_id.vue' /* webpackChunkName: "pages/community/circle/_id" */))
const _de338406 = () => interopDefault(import('../pages/community/mail/_id.vue' /* webpackChunkName: "pages/community/mail/_id" */))
const _c6d0426c = () => interopDefault(import('../pages/community/miniapp/_id.vue' /* webpackChunkName: "pages/community/miniapp/_id" */))
const _0d025034 = () => interopDefault(import('../pages/community/post/_id.vue' /* webpackChunkName: "pages/community/post/_id" */))
const _301e13cb = () => interopDefault(import('../pages/manga/read/_articleId.vue' /* webpackChunkName: "pages/manga/read/_articleId" */))
const _24ea6b20 = () => interopDefault(import('../pages/read/ask/_id.vue' /* webpackChunkName: "pages/read/ask/_id" */))
const _f4c371f4 = () => interopDefault(import('../pages/read/comment/_id.vue' /* webpackChunkName: "pages/read/comment/_id" */))
const _b5a210fc = () => interopDefault(import('../pages/read/end/_id.vue' /* webpackChunkName: "pages/read/end/_id" */))
const _778b36a8 = () => interopDefault(import('../pages/read/power/_id.vue' /* webpackChunkName: "pages/read/power/_id" */))
const _32ec27bb = () => interopDefault(import('../pages/read/preview/_key.vue' /* webpackChunkName: "pages/read/preview/_key" */))
const _44308200 = () => interopDefault(import('../pages/world/relations/_id.vue' /* webpackChunkName: "pages/world/relations/_id" */))
const _1342719a = () => interopDefault(import('../pages/write/edit/_id.vue' /* webpackChunkName: "pages/write/edit/_id" */))
const _194f2833 = () => interopDefault(import('../pages/write/settings/_id.vue' /* webpackChunkName: "pages/write/settings/_id" */))
const _37fe1b8c = () => interopDefault(import('../pages/write/activity-form/_workId/_tagId.vue' /* webpackChunkName: "pages/write/activity-form/_workId/_tagId" */))
const _1ce7eb3c = () => interopDefault(import('../pages/article/_id.vue' /* webpackChunkName: "pages/article/_id" */))
const _764768ba = () => interopDefault(import('../pages/manga/_id.vue' /* webpackChunkName: "pages/manga/_id" */))
const _23f6197c = () => interopDefault(import('../pages/novel/_id.vue' /* webpackChunkName: "pages/novel/_id" */))
const _04a720e7 = () => interopDefault(import('../pages/store/_id.vue' /* webpackChunkName: "pages/store/_id" */))
const _24ca9f0e = () => interopDefault(import('../pages/users/_id.vue' /* webpackChunkName: "pages/users/_id" */))
const _08ec0298 = () => interopDefault(import('../pages/world/_id.vue' /* webpackChunkName: "pages/world/_id" */))
const _74eea0ad = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _d1066372,
    name: "community"
  }, {
    path: "/forgot-password",
    component: _2f9620a0,
    name: "forgot-password"
  }, {
    path: "/login",
    component: _3e9643c4,
    name: "login"
  }, {
    path: "/me",
    component: _22cb0d90,
    name: "me"
  }, {
    path: "/membership",
    component: _ac8db564,
    name: "membership"
  }, {
    path: "/read",
    component: _47d5b0ce,
    name: "read"
  }, {
    path: "/search",
    component: _56b76346,
    name: "search"
  }, {
    path: "/store",
    component: _b1690a82,
    name: "store"
  }, {
    path: "/tags",
    component: _39158391,
    name: "tags"
  }, {
    path: "/write",
    component: _79629786,
    name: "write"
  }, {
    path: "/about/open-source",
    component: _6a6a3fd7,
    name: "about-open-source"
  }, {
    path: "/agreement/content",
    component: _7553b862,
    name: "agreement-content"
  }, {
    path: "/community/chat",
    component: _4b88be73,
    name: "community-chat"
  }, {
    path: "/community/circles",
    component: _d10fa150,
    name: "community-circles"
  }, {
    path: "/community/search",
    component: _03dbd403,
    name: "community-search"
  }, {
    path: "/me/achievements",
    component: _63b635d6,
    name: "me-achievements"
  }, {
    path: "/me/credit",
    component: _29e89aaa,
    name: "me-credit"
  }, {
    path: "/me/frames",
    component: _04cc2450,
    name: "me-frames"
  }, {
    path: "/me/friends",
    component: _422e395a,
    name: "me-friends"
  }, {
    path: "/me/help",
    component: _9afddd1a,
    name: "me-help"
  }, {
    path: "/me/invite",
    component: _5417aebb,
    name: "me-invite"
  }, {
    path: "/me/lab",
    component: _e0657b6a,
    name: "me-lab"
  }, {
    path: "/me/messages",
    component: _e1ccae04,
    name: "me-messages"
  }, {
    path: "/me/notifications",
    component: _7d53f8a6,
    name: "me-notifications"
  }, {
    path: "/me/security",
    component: _0ae304f2,
    name: "me-security"
  }, {
    path: "/me/settings",
    component: _0adfbf56,
    name: "me-settings"
  }, {
    path: "/me/storage",
    component: _6bcaf939,
    name: "me-storage"
  }, {
    path: "/me/tree",
    component: _34333f50,
    name: "me-tree"
  }, {
    path: "/me/wallet",
    component: _c07848aa,
    name: "me-wallet"
  }, {
    path: "/membership/gift",
    component: _73651464,
    name: "membership-gift"
  }, {
    path: "/membership/redeem",
    component: _5ef8d060,
    name: "membership-redeem"
  }, {
    path: "/membership/rules",
    component: _5e34aaf3,
    name: "membership-rules"
  }, {
    path: "/novel/fans",
    component: _174bec68,
    name: "novel-fans"
  }, {
    path: "/read/activities",
    component: _ee25ffbe,
    name: "read-activities"
  }, {
    path: "/read/bookcase",
    component: _5af90266,
    name: "read-bookcase"
  }, {
    path: "/read/collections",
    component: _1df58dde,
    name: "read-collections"
  }, {
    path: "/read/rank",
    component: _7e6c1de0,
    name: "read-rank"
  }, {
    path: "/read/redstone",
    component: _61ad7228,
    name: "read-redstone"
  }, {
    path: "/read/resources",
    component: _45f092a1,
    name: "read-resources"
  }, {
    path: "/read/rewards",
    component: _62b0c5c0,
    name: "read-rewards"
  }, {
    path: "/store/addresses",
    component: _90a699e2,
    name: "store-addresses"
  }, {
    path: "/store/orders",
    component: _465ccd48,
    name: "store-orders"
  }, {
    path: "/tag/collections",
    component: _7afc588a,
    name: "tag-collections"
  }, {
    path: "/write/new",
    component: _2e3c76cb,
    name: "write-new"
  }, {
    path: "/community/circle/create",
    component: _7e6631e0,
    name: "community-circle-create"
  }, {
    path: "/community/mail/new",
    component: _b6c7da3a,
    name: "community-mail-new"
  }, {
    path: "/community/post/edit",
    component: _ad3404e4,
    name: "community-post-edit"
  }, {
    path: "/community/circle/members/:id?",
    component: _0586b060,
    name: "community-circle-members-id"
  }, {
    path: "/community/circle/settings/:id?",
    component: _211b41e2,
    name: "community-circle-settings-id"
  }, {
    path: "/write/settings/info/:id?",
    component: _6d7abeb0,
    name: "write-settings-info-id"
  }, {
    path: "/write/settings/tags/:id?",
    component: _77daf31b,
    name: "write-settings-tags-id"
  }, {
    path: "/community/circle/:id?",
    component: _1c191756,
    name: "community-circle-id"
  }, {
    path: "/community/mail/:id?",
    component: _de338406,
    name: "community-mail-id"
  }, {
    path: "/community/miniapp/:id?",
    component: _c6d0426c,
    name: "community-miniapp-id"
  }, {
    path: "/community/post/:id?",
    component: _0d025034,
    name: "community-post-id"
  }, {
    path: "/manga/read/:articleId?",
    component: _301e13cb,
    name: "manga-read-articleId"
  }, {
    path: "/read/ask/:id?",
    component: _24ea6b20,
    name: "read-ask-id"
  }, {
    path: "/read/comment/:id?",
    component: _f4c371f4,
    name: "read-comment-id"
  }, {
    path: "/read/end/:id?",
    component: _b5a210fc,
    name: "read-end-id"
  }, {
    path: "/read/power/:id?",
    component: _778b36a8,
    name: "read-power-id"
  }, {
    path: "/read/preview/:key?",
    component: _32ec27bb,
    name: "read-preview-key"
  }, {
    path: "/world/relations/:id?",
    component: _44308200,
    name: "world-relations-id"
  }, {
    path: "/write/edit/:id?",
    component: _1342719a,
    name: "write-edit-id"
  }, {
    path: "/write/settings/:id?",
    component: _194f2833,
    name: "write-settings-id"
  }, {
    path: "/write/activity-form/:workId?/:tagId?",
    component: _37fe1b8c,
    name: "write-activity-form-workId-tagId"
  }, {
    path: "/article/:id?",
    component: _1ce7eb3c,
    name: "article-id"
  }, {
    path: "/manga/:id?",
    component: _764768ba,
    name: "manga-id"
  }, {
    path: "/novel/:id?",
    component: _23f6197c,
    name: "novel-id"
  }, {
    path: "/store/:id",
    component: _04a720e7,
    name: "store-id"
  }, {
    path: "/users/:id?",
    component: _24ca9f0e,
    name: "users-id"
  }, {
    path: "/world/:id?",
    component: _08ec0298,
    name: "world-id"
  }, {
    path: "/",
    component: _74eea0ad,
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
