import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _16042d1f = () => interopDefault(import('..\\pages\\community.vue' /* webpackChunkName: "pages/community" */))
const _0bd528c2 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _2c7e72d2 = () => interopDefault(import('..\\pages\\me.vue' /* webpackChunkName: "pages/me" */))
const _f8ade99c = () => interopDefault(import('..\\pages\\read\\index.vue' /* webpackChunkName: "pages/read/index" */))
const _0cbca915 = () => interopDefault(import('..\\pages\\write.vue' /* webpackChunkName: "pages/write" */))
const _7f8108b2 = () => interopDefault(import('..\\pages\\novel\\fans.vue' /* webpackChunkName: "pages/novel/fans" */))
const _5d5c3875 = () => interopDefault(import('..\\pages\\read\\collections.vue' /* webpackChunkName: "pages/read/collections" */))
const _5aaaacf5 = () => interopDefault(import('..\\pages\\tag\\collections.vue' /* webpackChunkName: "pages/tag/collections" */))
const _b4180084 = () => interopDefault(import('..\\pages\\article\\_id.vue' /* webpackChunkName: "pages/article/_id" */))
const _43f625b8 = () => interopDefault(import('..\\pages\\novel\\_id.vue' /* webpackChunkName: "pages/novel/_id" */))
const _306dc888 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _16042d1f,
    name: "community"
  }, {
    path: "/login",
    component: _0bd528c2,
    name: "login"
  }, {
    path: "/me",
    component: _2c7e72d2,
    name: "me"
  }, {
    path: "/read",
    component: _f8ade99c,
    name: "read"
  }, {
    path: "/write",
    component: _0cbca915,
    name: "write"
  }, {
    path: "/novel/fans",
    component: _7f8108b2,
    name: "novel-fans"
  }, {
    path: "/read/collections",
    component: _5d5c3875,
    name: "read-collections"
  }, {
    path: "/tag/collections",
    component: _5aaaacf5,
    name: "tag-collections"
  }, {
    path: "/article/:id?",
    component: _b4180084,
    name: "article-id"
  }, {
    path: "/novel/:id?",
    component: _43f625b8,
    name: "novel-id"
  }, {
    path: "/",
    component: _306dc888,
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
