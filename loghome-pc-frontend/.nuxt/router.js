import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _d1066372 = () => interopDefault(import('../pages/community/index.vue' /* webpackChunkName: "pages/community/index" */))
const _3e9643c4 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _22cb0d90 = () => interopDefault(import('../pages/me/index.vue' /* webpackChunkName: "pages/me/index" */))
const _47d5b0ce = () => interopDefault(import('../pages/read/index.vue' /* webpackChunkName: "pages/read/index" */))
const _56b76346 = () => interopDefault(import('../pages/search.vue' /* webpackChunkName: "pages/search" */))
const _39158391 = () => interopDefault(import('../pages/tags/index.vue' /* webpackChunkName: "pages/tags/index" */))
const _79629786 = () => interopDefault(import('../pages/write/index.vue' /* webpackChunkName: "pages/write/index" */))
const _7553b862 = () => interopDefault(import('../pages/agreement/content.vue' /* webpackChunkName: "pages/agreement/content" */))
const _4b88be73 = () => interopDefault(import('../pages/community/chat.vue' /* webpackChunkName: "pages/community/chat" */))
const _d10fa150 = () => interopDefault(import('../pages/community/circles.vue' /* webpackChunkName: "pages/community/circles" */))
const _422e395a = () => interopDefault(import('../pages/me/friends.vue' /* webpackChunkName: "pages/me/friends" */))
const _e1ccae04 = () => interopDefault(import('../pages/me/messages.vue' /* webpackChunkName: "pages/me/messages" */))
const _0adfbf56 = () => interopDefault(import('../pages/me/settings.vue' /* webpackChunkName: "pages/me/settings" */))
const _174bec68 = () => interopDefault(import('../pages/novel/fans.vue' /* webpackChunkName: "pages/novel/fans" */))
const _1df58dde = () => interopDefault(import('../pages/read/collections.vue' /* webpackChunkName: "pages/read/collections" */))
const _7afc588a = () => interopDefault(import('../pages/tag/collections.vue' /* webpackChunkName: "pages/tag/collections" */))
const _2e3c76cb = () => interopDefault(import('../pages/write/new.vue' /* webpackChunkName: "pages/write/new" */))
const _ad3404e4 = () => interopDefault(import('../pages/community/post/edit.vue' /* webpackChunkName: "pages/community/post/edit" */))
const _6d7abeb0 = () => interopDefault(import('../pages/write/settings/info/_id.vue' /* webpackChunkName: "pages/write/settings/info/_id" */))
const _77daf31b = () => interopDefault(import('../pages/write/settings/tags/_id.vue' /* webpackChunkName: "pages/write/settings/tags/_id" */))
const _1c191756 = () => interopDefault(import('../pages/community/circle/_id.vue' /* webpackChunkName: "pages/community/circle/_id" */))
const _0d025034 = () => interopDefault(import('../pages/community/post/_id.vue' /* webpackChunkName: "pages/community/post/_id" */))
const _1342719a = () => interopDefault(import('../pages/write/edit/_id.vue' /* webpackChunkName: "pages/write/edit/_id" */))
const _194f2833 = () => interopDefault(import('../pages/write/settings/_id.vue' /* webpackChunkName: "pages/write/settings/_id" */))
const _37fe1b8c = () => interopDefault(import('../pages/write/activity-form/_workId/_tagId.vue' /* webpackChunkName: "pages/write/activity-form/_workId/_tagId" */))
const _1ce7eb3c = () => interopDefault(import('../pages/article/_id.vue' /* webpackChunkName: "pages/article/_id" */))
const _23f6197c = () => interopDefault(import('../pages/novel/_id.vue' /* webpackChunkName: "pages/novel/_id" */))
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
    path: "/login",
    component: _3e9643c4,
    name: "login"
  }, {
    path: "/me",
    component: _22cb0d90,
    name: "me"
  }, {
    path: "/read",
    component: _47d5b0ce,
    name: "read"
  }, {
    path: "/search",
    component: _56b76346,
    name: "search"
  }, {
    path: "/tags",
    component: _39158391,
    name: "tags"
  }, {
    path: "/write",
    component: _79629786,
    name: "write"
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
    path: "/me/friends",
    component: _422e395a,
    name: "me-friends"
  }, {
    path: "/me/messages",
    component: _e1ccae04,
    name: "me-messages"
  }, {
    path: "/me/settings",
    component: _0adfbf56,
    name: "me-settings"
  }, {
    path: "/novel/fans",
    component: _174bec68,
    name: "novel-fans"
  }, {
    path: "/read/collections",
    component: _1df58dde,
    name: "read-collections"
  }, {
    path: "/tag/collections",
    component: _7afc588a,
    name: "tag-collections"
  }, {
    path: "/write/new",
    component: _2e3c76cb,
    name: "write-new"
  }, {
    path: "/community/post/edit",
    component: _ad3404e4,
    name: "community-post-edit"
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
    path: "/community/post/:id?",
    component: _0d025034,
    name: "community-post-id"
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
    path: "/novel/:id?",
    component: _23f6197c,
    name: "novel-id"
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
