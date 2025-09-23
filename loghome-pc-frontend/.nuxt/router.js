import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _073f485a = () => interopDefault(import('..\\pages\\community\\index.vue' /* webpackChunkName: "pages/community/index" */))
const _62e64bb0 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _35c3b8e9 = () => interopDefault(import('..\\pages\\me.vue' /* webpackChunkName: "pages/me" */))
const _1f8baefb = () => interopDefault(import('..\\pages\\read\\index.vue' /* webpackChunkName: "pages/read/index" */))
const _43808479 = () => interopDefault(import('..\\pages\\search.vue' /* webpackChunkName: "pages/search" */))
const _76a00f24 = () => interopDefault(import('..\\pages\\write\\index.vue' /* webpackChunkName: "pages/write/index" */))
const _0eb78800 = () => interopDefault(import('..\\pages\\agreement\\content.vue' /* webpackChunkName: "pages/agreement/content" */))
const _15553600 = () => interopDefault(import('..\\pages\\community\\chat.vue' /* webpackChunkName: "pages/community/chat" */))
const _1b63ac7b = () => interopDefault(import('..\\pages\\novel\\fans.vue' /* webpackChunkName: "pages/novel/fans" */))
const _283d217e = () => interopDefault(import('..\\pages\\read\\collections.vue' /* webpackChunkName: "pages/read/collections" */))
const _58f3fecc = () => interopDefault(import('..\\pages\\tag\\collections.vue' /* webpackChunkName: "pages/tag/collections" */))
const _8fb5411c = () => interopDefault(import('..\\pages\\write\\new.vue' /* webpackChunkName: "pages/write/new" */))
const _1152105c = () => interopDefault(import('..\\pages\\community\\post\\edit.vue' /* webpackChunkName: "pages/community/post/edit" */))
const _5a21981b = () => interopDefault(import('..\\pages\\write\\settings\\info\\_id.vue' /* webpackChunkName: "pages/write/settings/info/_id" */))
const _c8701de0 = () => interopDefault(import('..\\pages\\write\\settings\\tags\\_id.vue' /* webpackChunkName: "pages/write/settings/tags/_id" */))
const _15354a1c = () => interopDefault(import('..\\pages\\community\\circle\\_id.vue' /* webpackChunkName: "pages/community/circle/_id" */))
const _ffb8f5bc = () => interopDefault(import('..\\pages\\community\\post\\_id.vue' /* webpackChunkName: "pages/community/post/_id" */))
const _68c50e7c = () => interopDefault(import('..\\pages\\write\\edit\\_id.vue' /* webpackChunkName: "pages/write/edit/_id" */))
const _e318ec6e = () => interopDefault(import('..\\pages\\write\\settings\\_id.vue' /* webpackChunkName: "pages/write/settings/_id" */))
const _f33455d6 = () => interopDefault(import('..\\pages\\article\\_id.vue' /* webpackChunkName: "pages/article/_id" */))
const _40bb64cf = () => interopDefault(import('..\\pages\\novel\\_id.vue' /* webpackChunkName: "pages/novel/_id" */))
const _3aa99afa = () => interopDefault(import('..\\pages\\users\\_id.vue' /* webpackChunkName: "pages/users/_id" */))
const _fa937f8e = () => interopDefault(import('..\\pages\\world\\_id.vue' /* webpackChunkName: "pages/world/_id" */))
const _04e53711 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _073f485a,
    name: "community"
  }, {
    path: "/login",
    component: _62e64bb0,
    name: "login"
  }, {
    path: "/me",
    component: _35c3b8e9,
    name: "me"
  }, {
    path: "/read",
    component: _1f8baefb,
    name: "read"
  }, {
    path: "/search",
    component: _43808479,
    name: "search"
  }, {
    path: "/write",
    component: _76a00f24,
    name: "write"
  }, {
    path: "/agreement/content",
    component: _0eb78800,
    name: "agreement-content"
  }, {
    path: "/community/chat",
    component: _15553600,
    name: "community-chat"
  }, {
    path: "/novel/fans",
    component: _1b63ac7b,
    name: "novel-fans"
  }, {
    path: "/read/collections",
    component: _283d217e,
    name: "read-collections"
  }, {
    path: "/tag/collections",
    component: _58f3fecc,
    name: "tag-collections"
  }, {
    path: "/write/new",
    component: _8fb5411c,
    name: "write-new"
  }, {
    path: "/community/post/edit",
    component: _1152105c,
    name: "community-post-edit"
  }, {
    path: "/write/settings/info/:id?",
    component: _5a21981b,
    name: "write-settings-info-id"
  }, {
    path: "/write/settings/tags/:id?",
    component: _c8701de0,
    name: "write-settings-tags-id"
  }, {
    path: "/community/circle/:id?",
    component: _15354a1c,
    name: "community-circle-id"
  }, {
    path: "/community/post/:id?",
    component: _ffb8f5bc,
    name: "community-post-id"
  }, {
    path: "/write/edit/:id?",
    component: _68c50e7c,
    name: "write-edit-id"
  }, {
    path: "/write/settings/:id?",
    component: _e318ec6e,
    name: "write-settings-id"
  }, {
    path: "/article/:id?",
    component: _f33455d6,
    name: "article-id"
  }, {
    path: "/novel/:id?",
    component: _40bb64cf,
    name: "novel-id"
  }, {
    path: "/users/:id?",
    component: _3aa99afa,
    name: "users-id"
  }, {
    path: "/world/:id?",
    component: _fa937f8e,
    name: "world-id"
  }, {
    path: "/",
    component: _04e53711,
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
