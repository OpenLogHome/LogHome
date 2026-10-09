import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _cfcd54d2 = () => interopDefault(import('..\\pages\\community\\index.vue' /* webpackChunkName: "pages/community/index" */))
const _455fe127 = () => interopDefault(import('..\\pages\\forgot-password.vue' /* webpackChunkName: "pages/forgot-password" */))
const _78d6b10b = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _1d61be48 = () => interopDefault(import('..\\pages\\me\\index.vue' /* webpackChunkName: "pages/me/index" */))
const _e678e0c4 = () => interopDefault(import('..\\pages\\read\\index.vue' /* webpackChunkName: "pages/read/index" */))
const _3b1cec14 = () => interopDefault(import('..\\pages\\search.vue' /* webpackChunkName: "pages/search" */))
const _7903d58a = () => interopDefault(import('..\\pages\\tags\\index.vue' /* webpackChunkName: "pages/tags/index" */))
const _9f377a3e = () => interopDefault(import('..\\pages\\write\\index.vue' /* webpackChunkName: "pages/write/index" */))
const _5d798c06 = () => interopDefault(import('..\\pages\\agreement\\content.vue' /* webpackChunkName: "pages/agreement/content" */))
const _6c960d23 = () => interopDefault(import('..\\pages\\community\\chat.vue' /* webpackChunkName: "pages/community/chat" */))
const _39dfbab0 = () => interopDefault(import('..\\pages\\community\\circles.vue' /* webpackChunkName: "pages/community/circles" */))
const _1cb5539f = () => interopDefault(import('..\\pages\\me\\friends.vue' /* webpackChunkName: "pages/me/friends" */))
const _0adb4232 = () => interopDefault(import('..\\pages\\me\\messages.vue' /* webpackChunkName: "pages/me/messages" */))
const _7651b989 = () => interopDefault(import('..\\pages\\me\\settings.vue' /* webpackChunkName: "pages/me/settings" */))
const _eec8e5c4 = () => interopDefault(import('..\\pages\\novel\\fans.vue' /* webpackChunkName: "pages/novel/fans" */))
const _9ab6883e = () => interopDefault(import('..\\pages\\read\\collections.vue' /* webpackChunkName: "pages/read/collections" */))
const _2c63e7ee = () => interopDefault(import('..\\pages\\tag\\collections.vue' /* webpackChunkName: "pages/tag/collections" */))
const _78254322 = () => interopDefault(import('..\\pages\\write\\new.vue' /* webpackChunkName: "pages/write/new" */))
const _75d4a8b5 = () => interopDefault(import('..\\pages\\community\\post\\edit.vue' /* webpackChunkName: "pages/community/post/edit" */))
const _3a0dfd18 = () => interopDefault(import('..\\pages\\write\\settings\\info\\_id.vue' /* webpackChunkName: "pages/write/settings/info/_id" */))
const _7bb4560d = () => interopDefault(import('..\\pages\\write\\settings\\tags\\_id.vue' /* webpackChunkName: "pages/write/settings/tags/_id" */))
const _469dc66f = () => interopDefault(import('..\\pages\\community\\circle\\_id.vue' /* webpackChunkName: "pages/community/circle/_id" */))
const _62eaa842 = () => interopDefault(import('..\\pages\\community\\post\\_id.vue' /* webpackChunkName: "pages/community/post/_id" */))
const _2c3bfb1e = () => interopDefault(import('..\\pages\\manga\\read\\_articleId.vue' /* webpackChunkName: "pages/manga/read/_articleId" */))
const _5c7785ff = () => interopDefault(import('..\\pages\\write\\edit\\_id.vue' /* webpackChunkName: "pages/write/edit/_id" */))
const _464a9ef4 = () => interopDefault(import('..\\pages\\write\\settings\\_id.vue' /* webpackChunkName: "pages/write/settings/_id" */))
const _c1458500 = () => interopDefault(import('..\\pages\\write\\activity-form\\_workId\\_tagId.vue' /* webpackChunkName: "pages/write/activity-form/_workId/_tagId" */))
const _7fabee5c = () => interopDefault(import('..\\pages\\article\\_id.vue' /* webpackChunkName: "pages/article/_id" */))
const _66e0c558 = () => interopDefault(import('..\\pages\\manga\\_id.vue' /* webpackChunkName: "pages/manga/_id" */))
const _4c8363cc = () => interopDefault(import('..\\pages\\novel\\_id.vue' /* webpackChunkName: "pages/novel/_id" */))
const _23199d00 = () => interopDefault(import('..\\pages\\users\\_id.vue' /* webpackChunkName: "pages/users/_id" */))
const _e3038194 = () => interopDefault(import('..\\pages\\world\\_id.vue' /* webpackChunkName: "pages/world/_id" */))
const _a1a1e418 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _cfcd54d2,
    name: "community"
  }, {
    path: "/forgot-password",
    component: _455fe127,
    name: "forgot-password"
  }, {
    path: "/login",
    component: _78d6b10b,
    name: "login"
  }, {
    path: "/me",
    component: _1d61be48,
    name: "me"
  }, {
    path: "/read",
    component: _e678e0c4,
    name: "read"
  }, {
    path: "/search",
    component: _3b1cec14,
    name: "search"
  }, {
    path: "/tags",
    component: _7903d58a,
    name: "tags"
  }, {
    path: "/write",
    component: _9f377a3e,
    name: "write"
  }, {
    path: "/agreement/content",
    component: _5d798c06,
    name: "agreement-content"
  }, {
    path: "/community/chat",
    component: _6c960d23,
    name: "community-chat"
  }, {
    path: "/community/circles",
    component: _39dfbab0,
    name: "community-circles"
  }, {
    path: "/me/friends",
    component: _1cb5539f,
    name: "me-friends"
  }, {
    path: "/me/messages",
    component: _0adb4232,
    name: "me-messages"
  }, {
    path: "/me/settings",
    component: _7651b989,
    name: "me-settings"
  }, {
    path: "/novel/fans",
    component: _eec8e5c4,
    name: "novel-fans"
  }, {
    path: "/read/collections",
    component: _9ab6883e,
    name: "read-collections"
  }, {
    path: "/tag/collections",
    component: _2c63e7ee,
    name: "tag-collections"
  }, {
    path: "/write/new",
    component: _78254322,
    name: "write-new"
  }, {
    path: "/community/post/edit",
    component: _75d4a8b5,
    name: "community-post-edit"
  }, {
    path: "/write/settings/info/:id?",
    component: _3a0dfd18,
    name: "write-settings-info-id"
  }, {
    path: "/write/settings/tags/:id?",
    component: _7bb4560d,
    name: "write-settings-tags-id"
  }, {
    path: "/community/circle/:id?",
    component: _469dc66f,
    name: "community-circle-id"
  }, {
    path: "/community/post/:id?",
    component: _62eaa842,
    name: "community-post-id"
  }, {
    path: "/manga/read/:articleId?",
    component: _2c3bfb1e,
    name: "manga-read-articleId"
  }, {
    path: "/write/edit/:id?",
    component: _5c7785ff,
    name: "write-edit-id"
  }, {
    path: "/write/settings/:id?",
    component: _464a9ef4,
    name: "write-settings-id"
  }, {
    path: "/write/activity-form/:workId?/:tagId?",
    component: _c1458500,
    name: "write-activity-form-workId-tagId"
  }, {
    path: "/article/:id?",
    component: _7fabee5c,
    name: "article-id"
  }, {
    path: "/manga/:id?",
    component: _66e0c558,
    name: "manga-id"
  }, {
    path: "/novel/:id?",
    component: _4c8363cc,
    name: "novel-id"
  }, {
    path: "/users/:id?",
    component: _23199d00,
    name: "users-id"
  }, {
    path: "/world/:id?",
    component: _e3038194,
    name: "world-id"
  }, {
    path: "/",
    component: _a1a1e418,
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
