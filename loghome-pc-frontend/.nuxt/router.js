import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _16042d1f = () => interopDefault(import('..\\pages\\community.vue' /* webpackChunkName: "pages/community" */))
const _63fc6f50 = () => interopDefault(import('..\\pages\\read.vue' /* webpackChunkName: "pages/read" */))
const _0cbca915 = () => interopDefault(import('..\\pages\\write.vue' /* webpackChunkName: "pages/write" */))
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
    path: "/read",
    component: _63fc6f50,
    name: "read"
  }, {
    path: "/write",
    component: _0cbca915,
    name: "write"
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
  }, {
    path: "/release/",
    component: _306dc888,
    name: "release"
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
