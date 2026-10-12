exports.ids = [20];
exports.modules = {

/***/ 127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URLSearchParams) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return readingCommentId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return readingCommentTarget; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return readingMessageTarget; });
function readingCommentId(query = {}) {
  const id = Number(query.preLoadCommentId || query.comment_id || query.commentId);
  return Number.isSafeInteger(id) && id > 0 ? id : 0;
}
function readingCommentTarget(comment, book, anchor) {
  if (!comment || !book || Number(comment.novelId) !== Number(book.novel_id)) return '';
  const suffix = `preLoadCommentId=${Number(anchor) || Number(comment.commentId)}`;
  if (Number(comment.articleId) > 0) {
    if (book.novel_type === 'manga') return `/manga/read/${comment.articleId}?novelId=${book.novel_id}&${suffix}`;
    return `/article/${comment.articleId}?${suffix}${Number(comment.paragraphId) > 0 ? `&paragraphId=${comment.paragraphId}` : ''}`;
  }
  return `/${book.novel_type === 'manga' ? 'manga' : book.novel_type === 'world' ? 'world' : 'novel'}/${book.novel_id}?${suffix}`;
}
function readingMessageTarget(router) {
  const raw = String(router || '').trim();
  if (!raw || /^[a-z][a-z\d+.-]*:|^\/\/|[\\\x00-\x1f]/i.test(raw)) return null;
  const source = raw.replace(/^\/?(?:#\/)?(?:pages\/)?/, '');
  const [path, search = ''] = source.split('?'),
    query = new URLSearchParams(search);
  const id = Number(query.get('id') || query.get('novelId') || query.get('novel_id'));
  const anchor = readingCommentId(Object.fromEntries(query));
  if (/^readers\/(?:bookInfo|bookComment|mangaInfo|mangaReader|bookEnd|bookExcerpts|newReader\/article)$/.test(path)) {
    const workId = /(?:mangaReader|newReader\/article)$/.test(path) ? Number(query.get('novelId') || query.get('novel_id')) : id;
    if (anchor) return {
      path: `/read/comment/${anchor}${Number.isSafeInteger(workId) && workId > 0 ? `?novelId=${workId}` : ''}`
    };
    if (!Number.isSafeInteger(id) || id <= 0) return null;
    if (path === 'readers/newReader/article') return {
      path: `/article/${id}`
    };
    if (path === 'readers/mangaReader') return {
      path: `/manga/read/${id}${Number(query.get('novelId')) > 0 ? `?novelId=${Number(query.get('novelId'))}` : ''}`
    };
    return {
      path: `/${path === 'readers/mangaInfo' ? 'manga' : path === 'readers/bookEnd' ? 'read/end' : 'novel'}/${id}`
    };
  }
  return null;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)["URLSearchParams"]))

/***/ }),

/***/ 197:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* unused harmony export activityNewsLink */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return normalizeActivities; });
/* unused harmony export activityMessageLink */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return activityMessagePage; });
/* harmony import */ var _reading_discovery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _reader_comment_links__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(127);
/* harmony import */ var _reading_seo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(34);



function safeLink(raw, mobileBase) {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  if (!value || /[\\\u0000-\u001f]/.test(value)) return null;
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (url.username || url.password) return null;
      if (url.origin === _reading_seo__WEBPACK_IMPORTED_MODULE_2__[/* SITE_ORIGIN */ "a"]) return {
        href: url.pathname + url.search + url.hash,
        external: false
      };
      if (url.origin === new URL(mobileBase).origin && url.hash.startsWith('#/pages/')) return Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_0__[/* discoveryLink */ "g"])(url.hash.slice(1), mobileBase);
      return {
        href: url.href,
        external: true
      };
    } catch (_) {
      return null;
    }
  }
  return Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_0__[/* discoveryLink */ "g"])(value, mobileBase);
}
function activityNewsLink(news, mobileBase = 'https://m.loghome.ink') {
  return safeLink(news && news.pc_link, mobileBase) || safeLink(news && news.mobile_link, mobileBase);
}
function normalizeActivities(rows, mobileBase = 'https://m.loghome.ink') {
  if (!Array.isArray(rows)) throw Error('活动资讯返回数据无效');
  const seen = new Set();
  return rows.filter(row => {
    const id = Number(row && row.tag_id);
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id)) return false;
    seen.add(id);
    return true;
  }).map(row => ({
    ...row,
    tag_id: Number(row.tag_id),
    news: (Array.isArray(row.news) ? row.news : []).filter(news => news && typeof news.title === 'string').map(news => ({
      ...news,
      link: activityNewsLink(news, mobileBase)
    }))
  }));
}
function activityMessageLink(router, mobileBase = 'https://m.loghome.ink') {
  const raw = String(router || '').trim();
  if (!raw || raw === '/' || raw === 'None' || /^[a-z][a-z\d+.-]*:|^\/\/|[\\\u0000-\u001f]/i.test(raw)) return null;
  const route = raw.replace(/^(?:\.\.?\/)+/, '').replace(/^\/?(?:#\/)?(?:pages\/)?/, '');
  const reading = Object(_reader_comment_links__WEBPACK_IMPORTED_MODULE_1__[/* readingMessageTarget */ "c"])(route);
  if (reading) return {
    href: reading.path,
    external: false
  };
  const post = route.match(/^community\/postDetail\?id=([1-9]\d*)(?:&|$)/);
  if (post) return {
    href: `/community/post/${Number(post[1])}`,
    external: false
  };
  return safeLink(`/pages/${route}`, mobileBase);
}
function activityMessagePage(result, page, amount = 20, mobileBase = 'https://m.loghome.ink') {
  if (!result || result.msg !== 'ok' || result.page !== page || result.amount !== amount || !Number.isSafeInteger(result.total) || result.total < 0 || !Array.isArray(result.messages) || result.messages.length > amount) throw Error('活动消息返回数据无效，请刷新重试');
  const seen = new Set();
  const messages = result.messages.map(row => {
    const id = Number(row && row.message_id);
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id) || row.message_type !== 'activity') throw Error('活动消息返回数据无效，请刷新重试');
    seen.add(id);
    return {
      ...row,
      message_id: id,
      message_content: String(row.message_content || ''),
      bg_url: /^https?:\/\//i.test(String(row.bg_url || '')) ? row.bg_url : '',
      link: activityMessageLink(row.router, mobileBase)
    };
  });
  return {
    total: result.total,
    messages
  };
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)["URL"]))

/***/ }),

/***/ 249:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(329);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("89a71f52", content, true, context)
};

/***/ }),

/***/ 328:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_82d3fd12_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(249);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_82d3fd12_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_82d3fd12_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_82d3fd12_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_82d3fd12_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 329:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".activity-inbox[data-v-82d3fd12]{max-width:1180px;margin:auto;padding:110px 28px 65px;color:#514739}header[data-v-82d3fd12]{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:30px}h1[data-v-82d3fd12]{font-size:28px;margin:18px 0 12px}header p[data-v-82d3fd12],.summary[data-v-82d3fd12],.quiet[data-v-82d3fd12]{color:#968978;font-size:13px;line-height:1.8}a[data-v-82d3fd12]{color:#788858;text-decoration:none}button[data-v-82d3fd12]{background:white;border:1px solid #dcd7cc;color:#7c674d;border-radius:6px;padding:9px 16px;cursor:pointer}button[data-v-82d3fd12]:disabled{opacity:.45;cursor:default}.message-grid[data-v-82d3fd12]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;align-items:start}.message-grid article[data-v-82d3fd12]{min-width:0;background:white;border:1px solid #e7e2d9;border-radius:12px;overflow:hidden}.message-grid img[data-v-82d3fd12]{width:100%;max-height:220px;object-fit:cover}.message-body[data-v-82d3fd12]{padding:22px}time[data-v-82d3fd12]{font-size:12px;color:#a09383}.message-body p[data-v-82d3fd12]{font-size:15px;line-height:1.9;white-space:pre-wrap;overflow-wrap:anywhere;margin:16px 0}.message-body a[data-v-82d3fd12]{font-size:13px}.state[data-v-82d3fd12]{text-align:center;background:#fff;padding:55px 20px;border:1px solid #e7e2d9;border-radius:10px;color:#998978;font-size:14px}.state h2[data-v-82d3fd12]{color:#615442;font-size:20px}.state p[data-v-82d3fd12]{line-height:1.8;margin:16px 0}.error[data-v-82d3fd12]{color:#a14b39;font-size:13px;background:#fff5ed;padding:16px;border-radius:7px}.error button[data-v-82d3fd12]{margin-left:12px}nav[data-v-82d3fd12]{display:flex;justify-content:center;align-items:center;gap:20px;margin-top:30px;font-size:13px}a[data-v-82d3fd12]:focus-visible,button[data-v-82d3fd12]:focus-visible{outline:2px solid #8e9e69;outline-offset:3px}@media(max-width:760px){.activity-inbox[data-v-82d3fd12]{padding:100px 18px 45px}.message-grid[data-v-82d3fd12]{grid-template-columns:1fr}header[data-v-82d3fd12]{align-items:flex-start}h1[data-v-82d3fd12]{font-size:25px}.message-body[data-v-82d3fd12]{padding:18px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 413:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/activities.vue?vue&type=template&id=68bdef60
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('ReaderActivityInbox');
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/activities.vue?vue&type=template&id=68bdef60

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderActivityInbox.vue?vue&type=template&id=82d3fd12&scoped=true
var ReaderActivityInboxvue_type_template_id_82d3fd12_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "activity-inbox"
  }, [_vm._ssrNode("<header data-v-82d3fd12>", "</header>", [_vm._ssrNode("<div data-v-82d3fd12>", "</div>", [_c('nuxt-link', {
    attrs: {
      "to": "/read/resources"
    }
  }, [_vm._v("← 获取原木")]), _vm._ssrNode("<h1 data-v-82d3fd12>活动消息</h1><p data-v-82d3fd12>社区活动的参与条件、截止时间与奖励说明。</p>")], 2), _vm._ssrNode(_vm.token && !_vm.authExpired ? "<button" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-82d3fd12>" + _vm._ssrEscape(_vm._s(_vm.loading ? '刷新中…' : '刷新消息')) + "</button>" : "<!---->")], 2), _vm._ssrNode(" "), !_vm.ready ? _vm._ssrNode("<div class=\"state\" data-v-82d3fd12>", "</div>", [_vm._ssrNode("正在准备消息列表…")], 2) : !_vm.token || _vm.authExpired ? _vm._ssrNode("<div class=\"state\" data-v-82d3fd12>", "</div>", [_vm._ssrNode("<h2 data-v-82d3fd12>" + _vm._ssrEscape(_vm._s(_vm.authExpired ? '登录状态已过期' : '登录后查看活动消息')) + "</h2><p data-v-82d3fd12>活动消息与账号关联，登录后可查看收到的通知。</p>"), _c('nuxt-link', {
    attrs: {
      "to": _vm.loginUrl
    }
  }, [_vm._v("前往登录 →")])], 2) : [_vm._ssrNode((_vm.error ? "<p role=\"alert\" class=\"error\" data-v-82d3fd12>" + _vm._ssrEscape(_vm._s(_vm.error) + " ") + "<button" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-82d3fd12>重试</button></p>" : "<!---->") + "<p aria-live=\"polite\" class=\"summary\" data-v-82d3fd12>" + _vm._ssrEscape(_vm._s(_vm.loading ? '正在读取活动消息…' : `共 ${_vm.total} 条活动消息 · 最新消息在前`)) + "</p>"), _vm._ssrNode("<div" + _vm._ssrAttr("aria-busy", _vm.loading) + " class=\"message-grid\" data-v-82d3fd12>", "</div>", _vm._l(_vm.messages, function (item) {
    return _vm._ssrNode("<article data-v-82d3fd12>", "</article>", [_vm._ssrNode(item.bg_url ? "<img" + _vm._ssrAttr("src", item.bg_url) + " alt loading=\"lazy\" data-v-82d3fd12>" : "<!---->"), _vm._ssrNode("<div class=\"message-body\" data-v-82d3fd12>", "</div>", [_vm._ssrNode("<time" + _vm._ssrAttr("datetime", item.time) + " data-v-82d3fd12>" + _vm._ssrEscape(_vm._s(_vm.date(item.time))) + "</time><p data-v-82d3fd12>" + _vm._ssrEscape(_vm._s(item.message_content)) + "</p>"), item.link && !item.link.external ? _c('nuxt-link', {
      attrs: {
        "to": item.link.href
      }
    }, [_vm._v("查看活动详情 →")]) : item.link ? _c('a', {
      attrs: {
        "href": item.link.href,
        "target": "_blank",
        "rel": "noopener noreferrer"
      }
    }, [_vm._v("查看活动详情 ↗")]) : _c('span', {
      staticClass: "quiet"
    }, [_vm._v("这条通知暂无详情链接")])], 2)], 2);
  }), 0), _vm._ssrNode((!_vm.loading && !_vm.error && !_vm.messages.length ? "<p class=\"state\" data-v-82d3fd12>暂无活动消息</p>" : "<!---->") + (_vm.totalPages > 1 ? "<nav aria-label=\"活动消息分页\" data-v-82d3fd12><button" + _vm._ssrAttr("disabled", _vm.loading || _vm.page <= 1) + " data-v-82d3fd12>上一页</button><span data-v-82d3fd12>" + _vm._ssrEscape("第 " + _vm._s(_vm.page) + " / " + _vm._s(_vm.totalPages) + " 页") + "</span><button" + _vm._ssrAttr("disabled", _vm.loading || _vm.page >= _vm.totalPages) + " data-v-82d3fd12>下一页</button></nav>" : "<!---->"))]], 2);
};
var ReaderActivityInboxvue_type_template_id_82d3fd12_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderActivityInbox.vue?vue&type=template&id=82d3fd12&scoped=true

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reader-activities.js
var reader_activities = __webpack_require__(197);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderActivityInbox.vue?vue&type=script&lang=js


/* harmony default export */ var ReaderActivityInboxvue_type_script_lang_js = ({
  data: () => ({
    ready: false,
    token: null,
    authExpired: false,
    messages: [],
    page: 1,
    total: 0,
    loading: false,
    error: '',
    failedPage: 1,
    version: 0,
    epoch: 0
  }),
  computed: {
    loginUrl() {
      return {
        path: '/login',
        query: {
          redirect: '/read/activities'
        }
      };
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.total / 20));
    }
  },
  mounted() {
    this.ready = true;
    this.checkAccount();
    window.addEventListener('storage', this.storage);
    window.addEventListener('focus', this.checkAccount);
    window.addEventListener('auth-state-changed', this.checkAccount);
  },
  beforeDestroy() {
    this.version++;
    this.epoch++;
    window.removeEventListener('storage', this.storage);
    window.removeEventListener('focus', this.checkAccount);
    window.removeEventListener('auth-state-changed', this.checkAccount);
  },
  methods: {
    storage(event) {
      if (event.key === 'token') this.checkAccount();
    },
    checkAccount() {
      const token = Object(reading["c" /* readingToken */])();
      if (token === this.token) return;
      this.epoch++;
      this.version++;
      Object.assign(this, {
        token,
        authExpired: false,
        messages: [],
        page: 1,
        total: 0,
        loading: false,
        error: '',
        failedPage: 1
      });
      if (token) this.load(1);
    },
    current(token, epoch, version) {
      return token === Object(reading["c" /* readingToken */])() && token === this.token && epoch === this.epoch && version === this.version;
    },
    async load(page = 1) {
      if (!this.token || this.authExpired) return;
      const token = this.token,
        epoch = this.epoch,
        version = ++this.version;
      this.loading = true;
      this.error = '';
      this.failedPage = page;
      try {
        const raw = await this.$api.reader.activityMessages(page);
        if (!this.current(token, epoch, version)) return;
        const result = Object(reader_activities["a" /* activityMessagePage */])(raw, page, 20, "https://m.loghome.ink");
        if (page > 1 && !result.messages.length) return this.load(1);
        this.messages = result.messages;
        this.total = result.total;
        this.page = page;
      } catch (error) {
        if (!this.current(token, epoch, version)) return;
        this.error = error.message || '活动消息加载失败';
        if ([401, 403].includes(error.status)) {
          this.authExpired = true;
          this.messages = [];
          this.total = 0;
        }
      } finally {
        if (this.current(token, epoch, version)) this.loading = false;
      }
    },
    date(value) {
      const date = new Date(value);
      return Number.isFinite(date.getTime()) ? date.toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        hour12: false
      }) : '时间未提供';
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderActivityInbox.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderActivityInboxvue_type_script_lang_js = (ReaderActivityInboxvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderActivityInbox.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(328)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderActivityInboxvue_type_script_lang_js,
  ReaderActivityInboxvue_type_template_id_82d3fd12_scoped_true_render,
  ReaderActivityInboxvue_type_template_id_82d3fd12_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "82d3fd12",
  "47f196b4"
  
)

/* harmony default export */ var ReaderActivityInbox = (component.exports);
// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(34);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/activities.vue?vue&type=script&lang=js


/* harmony default export */ var activitiesvue_type_script_lang_js = ({
  components: {
    ReaderActivityInbox: ReaderActivityInbox
  },
  head: () => Object(reading_seo["d" /* readingHead */])({
    title: '活动消息 - 原木社区',
    description: '查看自己收到的社区活动通知与参与说明。',
    path: '/read/activities',
    noindex: true
  })
});
// CONCATENATED MODULE: ./pages/read/activities.vue?vue&type=script&lang=js
 /* harmony default export */ var read_activitiesvue_type_script_lang_js = (activitiesvue_type_script_lang_js); 
// CONCATENATED MODULE: ./pages/read/activities.vue





/* normalize component */

var activities_component = Object(componentNormalizer["a" /* default */])(
  read_activitiesvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  "9178bda6"
  
)

/* harmony default export */ var activities = __webpack_exports__["default"] = (activities_component.exports);

/***/ })

};;
//# sourceMappingURL=activities.js.map