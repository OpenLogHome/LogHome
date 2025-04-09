import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _cf860a0c = () => interopDefault(import('..\\pages\\community.vue' /* webpackChunkName: "pages/community" */))
const _696b2495 = () => interopDefault(import('..\\pages\\read.vue' /* webpackChunkName: "pages/read" */))
const _95b6c720 = () => interopDefault(import('..\\pages\\write.vue' /* webpackChunkName: "pages/write" */))
const _9360bffa = () => interopDefault(import('..\\pages\\article\\_id.vue' /* webpackChunkName: "pages/article/_id" */))
const _08d7133d = () => interopDefault(import('..\\pages\\novel\\_id.vue' /* webpackChunkName: "pages/novel/_id" */))
const _4e54883a = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _cf860a0c,
    name: "community"
  }, {
    path: "/read",
    component: _696b2495,
    name: "read"
  }, {
    path: "/write",
    component: _95b6c720,
    name: "write"
  }, {
    path: "/article/:id?",
    component: _9360bffa,
    name: "article-id"
  }, {
    path: "/novel/:id?",
    component: _08d7133d,
    name: "novel-id"
  }, {
    path: "/",
    component: _4e54883a,
    name: "index"
  }, {
    path: "/release/",
    component: _4e54883a,
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
