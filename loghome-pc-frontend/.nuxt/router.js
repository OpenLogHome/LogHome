import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5bcb2864 = () => interopDefault(import('..\\pages\\community\\index.vue' /* webpackChunkName: "pages/community/index" */))
const _6a755198 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _7c86eaf6 = () => interopDefault(import('..\\pages\\me\\index.vue' /* webpackChunkName: "pages/me/index" */))
const _110599f2 = () => interopDefault(import('..\\pages\\read\\index.vue' /* webpackChunkName: "pages/read/index" */))
const _6350ae26 = () => interopDefault(import('..\\pages\\search.vue' /* webpackChunkName: "pages/search" */))
const _2e37b8a4 = () => interopDefault(import('..\\pages\\tags\\index.vue' /* webpackChunkName: "pages/tags/index" */))
const _c641e6d0 = () => interopDefault(import('..\\pages\\write\\index.vue' /* webpackChunkName: "pages/write/index" */))
const _e150c318 = () => interopDefault(import('..\\pages\\agreement\\content.vue' /* webpackChunkName: "pages/agreement/content" */))
const _5ce457e8 = () => interopDefault(import('..\\pages\\community\\chat.vue' /* webpackChunkName: "pages/community/chat" */))
const _bdb6f1c2 = () => interopDefault(import('..\\pages\\community\\circles.vue' /* webpackChunkName: "pages/community/circles" */))
const _f12211f0 = () => interopDefault(import('..\\pages\\me\\friends.vue' /* webpackChunkName: "pages/me/friends" */))
const _1153e82e = () => interopDefault(import('..\\pages\\me\\messages.vue' /* webpackChunkName: "pages/me/messages" */))
const _62cc8340 = () => interopDefault(import('..\\pages\\me\\settings.vue' /* webpackChunkName: "pages/me/settings" */))
const _19559ef2 = () => interopDefault(import('..\\pages\\novel\\fans.vue' /* webpackChunkName: "pages/novel/fans" */))
const _8e7326ec = () => interopDefault(import('..\\pages\\read\\collections.vue' /* webpackChunkName: "pages/read/collections" */))
const _23cf2240 = () => interopDefault(import('..\\pages\\tag\\collections.vue' /* webpackChunkName: "pages/tag/collections" */))
const _012d29e6 = () => interopDefault(import('..\\pages\\write\\new.vue' /* webpackChunkName: "pages/write/new" */))
const _3cebdcde = () => interopDefault(import('..\\pages\\community\\post\\edit.vue' /* webpackChunkName: "pages/community/post/edit" */))
const _4b4dfa8f = () => interopDefault(import('..\\pages\\write\\settings\\info\\_id.vue' /* webpackChunkName: "pages/write/settings/info/_id" */))
const _e61758f8 = () => interopDefault(import('..\\pages\\write\\settings\\tags\\_id.vue' /* webpackChunkName: "pages/write/settings/tags/_id" */))
const _626d1766 = () => interopDefault(import('..\\pages\\community\\circle\\_id.vue' /* webpackChunkName: "pages/community/circle/_id" */))
const _5917ce96 = () => interopDefault(import('..\\pages\\community\\post\\_id.vue' /* webpackChunkName: "pages/community/post/_id" */))
const _d30ec794 = () => interopDefault(import('..\\pages\\write\\edit\\_id.vue' /* webpackChunkName: "pages/write/edit/_id" */))
const _6767d33d = () => interopDefault(import('..\\pages\\write\\settings\\_id.vue' /* webpackChunkName: "pages/write/settings/_id" */))
const _767e00ae = () => interopDefault(import('..\\pages\\write\\activity-form\\_workId\\_tagId.vue' /* webpackChunkName: "pages/write/activity-form/_workId/_tagId" */))
const _a6b65aee = () => interopDefault(import('..\\pages\\article\\_id.vue' /* webpackChunkName: "pages/article/_id" */))
const _ec79a17a = () => interopDefault(import('..\\pages\\novel\\_id.vue' /* webpackChunkName: "pages/novel/_id" */))
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
    path: "/login",
    component: _6a755198,
    name: "login"
  }, {
    path: "/me",
    component: _7c86eaf6,
    name: "me"
  }, {
    path: "/read",
    component: _110599f2,
    name: "read"
  }, {
    path: "/search",
    component: _6350ae26,
    name: "search"
  }, {
    path: "/tags",
    component: _2e37b8a4,
    name: "tags"
  }, {
    path: "/write",
    component: _c641e6d0,
    name: "write"
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
    path: "/me/friends",
    component: _f12211f0,
    name: "me-friends"
  }, {
    path: "/me/messages",
    component: _1153e82e,
    name: "me-messages"
  }, {
    path: "/me/settings",
    component: _62cc8340,
    name: "me-settings"
  }, {
    path: "/novel/fans",
    component: _19559ef2,
    name: "novel-fans"
  }, {
    path: "/read/collections",
    component: _8e7326ec,
    name: "read-collections"
  }, {
    path: "/tag/collections",
    component: _23cf2240,
    name: "tag-collections"
  }, {
    path: "/write/new",
    component: _012d29e6,
    name: "write-new"
  }, {
    path: "/community/post/edit",
    component: _3cebdcde,
    name: "community-post-edit"
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
    path: "/community/post/:id?",
    component: _5917ce96,
    name: "community-post-id"
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
    path: "/novel/:id?",
    component: _ec79a17a,
    name: "novel-id"
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
