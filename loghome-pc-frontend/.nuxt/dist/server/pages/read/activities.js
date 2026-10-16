exports.ids = [43];
exports.modules = {

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* unused harmony export activityNewsLink */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return normalizeActivities; });
/* unused harmony export activityMessageLink */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return activityMessagePage; });
/* harmony import */ var _social_links__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
/* harmony import */ var _reading_discovery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _reader_comment_links__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(40);
/* harmony import */ var _reading_seo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(39);




function safeLink(raw, mobileBase) {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  if (!value || /[\\\u0000-\u001f]/.test(value)) return null;
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (url.username || url.password) return null;
      if (url.origin === _reading_seo__WEBPACK_IMPORTED_MODULE_3__[/* SITE_ORIGIN */ "a"]) return {
        href: url.pathname + url.search + url.hash,
        external: false
      };
      if (url.origin === new URL(mobileBase).origin && url.hash.startsWith('#/pages/')) return Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_1__[/* discoveryLink */ "g"])(url.hash.slice(1), mobileBase);
      return {
        href: url.href,
        external: true
      };
    } catch (_) {
      return null;
    }
  }
  return Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_1__[/* discoveryLink */ "g"])(value, mobileBase);
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
  const reading = Object(_reader_comment_links__WEBPACK_IMPORTED_MODULE_2__[/* readingMessageTarget */ "c"])(route);
  if (reading) return {
    href: reading.path,
    external: false
  };
  const post = route.match(/^community\/postDetail\?id=([1-9]\d*)(?:&|$)/);
  if (post) return {
    href: `/community/post/${Number(post[1])}`,
    external: false
  };
  if (route === 'community/activityMessages') return {
    href: '/read/activities',
    external: false
  };
  const social = Object(_social_links__WEBPACK_IMPORTED_MODULE_0__[/* socialMessageTarget */ "a"])(route);
  if (social && !social.mobile) return {
    href: social.path,
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URL"]))

/***/ }),

/***/ 209:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(248);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("6acf16a5", content, true, context)
};

/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_346ec8a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(209);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_346ec8a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_346ec8a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_346ec8a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_346ec8a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 248:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.activity-inbox[data-v-346ec8a2] {\r\n  max-width: 1180px;\r\n  margin: auto;\r\n  padding: 110px 28px 65px;\r\n  color: #514739;\n}\nheader[data-v-346ec8a2] {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 20px;\r\n  margin-bottom: 30px;\n}\nh1[data-v-346ec8a2] {\r\n  font-size: 28px;\r\n  margin: 18px 0 12px;\n}\nheader p[data-v-346ec8a2],\r\n.summary[data-v-346ec8a2],\r\n.quiet[data-v-346ec8a2] {\r\n  color: #968978;\r\n  font-size: 13px;\r\n  line-height: 1.8;\n}\na[data-v-346ec8a2] {\r\n  color: #788858;\r\n  text-decoration: none;\n}\nbutton[data-v-346ec8a2] {\r\n  background: white;\r\n  border: 1px solid #dcd7cc;\r\n  color: #7c674d;\r\n  border-radius: 6px;\r\n  padding: 9px 16px;\r\n  cursor: pointer;\n}\nbutton[data-v-346ec8a2]:disabled {\r\n  opacity: 0.45;\r\n  cursor: default;\n}\n.message-grid[data-v-346ec8a2] {\r\n  display: grid;\r\n  grid-template-columns: repeat(2, minmax(0, 1fr));\r\n  gap: 20px;\r\n  align-items: start;\n}\n.message-grid article[data-v-346ec8a2] {\r\n  min-width: 0;\r\n  background: white;\r\n  border: 1px solid #e7e2d9;\r\n  border-radius: 12px;\r\n  overflow: hidden;\n}\n.message-grid img[data-v-346ec8a2] {\r\n  width: 100%;\r\n  max-height: 220px;\r\n  object-fit: cover;\n}\n.message-body[data-v-346ec8a2] {\r\n  padding: 22px;\n}\ntime[data-v-346ec8a2] {\r\n  font-size: 12px;\r\n  color: #a09383;\n}\n.message-body p[data-v-346ec8a2] {\r\n  font-size: 15px;\r\n  line-height: 1.9;\r\n  white-space: pre-wrap;\r\n  overflow-wrap: anywhere;\r\n  margin: 16px 0;\n}\n.message-body a[data-v-346ec8a2] {\r\n  font-size: 13px;\n}\n.state[data-v-346ec8a2] {\r\n  text-align: center;\r\n  background: #fff;\r\n  padding: 55px 20px;\r\n  border: 1px solid #e7e2d9;\r\n  border-radius: 10px;\r\n  color: #998978;\r\n  font-size: 14px;\n}\n.state h2[data-v-346ec8a2] {\r\n  color: #615442;\r\n  font-size: 20px;\n}\n.state p[data-v-346ec8a2] {\r\n  line-height: 1.8;\r\n  margin: 16px 0;\n}\n.error[data-v-346ec8a2] {\r\n  color: #a14b39;\r\n  font-size: 13px;\r\n  background: #fff5ed;\r\n  padding: 16px;\r\n  border-radius: 7px;\n}\n.error button[data-v-346ec8a2] {\r\n  margin-left: 12px;\n}\nnav[data-v-346ec8a2] {\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  gap: 20px;\r\n  margin-top: 30px;\r\n  font-size: 13px;\n}\na[data-v-346ec8a2]:focus-visible,\r\nbutton[data-v-346ec8a2]:focus-visible {\r\n  outline: 2px solid #8e9e69;\r\n  outline-offset: 3px;\n}\n@media (max-width: 760px) {\n.activity-inbox[data-v-346ec8a2] {\r\n    padding: 100px 18px 45px;\n}\n.message-grid[data-v-346ec8a2] {\r\n    grid-template-columns: 1fr;\n}\nheader[data-v-346ec8a2] {\r\n    align-items: flex-start;\n}\nh1[data-v-346ec8a2] {\r\n    font-size: 25px;\n}\n.message-body[data-v-346ec8a2] {\r\n    padding: 18px;\n}\n}\n.activity-inbox.embedded[data-v-346ec8a2] {\r\n  padding: 0;\r\n  max-width: none;\r\n  color: var(--ink, #52483c);\n}\n.embedded .message-grid[data-v-346ec8a2] {\r\n  grid-template-columns: 1fr;\n}\n.embedded .message-grid article[data-v-346ec8a2] {\r\n  background: var(--surface, #fffdf9);\r\n  border-color: var(--line, #e9e0d5);\n}\n.embedded .message-grid p[data-v-346ec8a2] {\r\n  color: var(--ink, #52483c);\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderActivityInbox.vue?vue&type=template&id=346ec8a2&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "activity-inbox",
    class: {
      embedded: _vm.embedded
    }
  }, [!_vm.embedded ? _vm._ssrNode("<header data-v-346ec8a2>", "</header>", [_vm._ssrNode("<div data-v-346ec8a2>", "</div>", [_c('nuxt-link', {
    attrs: {
      "to": "/read/resources"
    }
  }, [_vm._v(_vm._s(_vm.$t("← 获取原木")))]), _vm._ssrNode(" <h1 data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.$t("活动消息"))) + "</h1> <p data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.$t("社区活动的参与条件、截止时间与奖励说明。"))) + "</p>")], 2), _vm._ssrNode(" " + (_vm.token && !_vm.authExpired ? "<button" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-346ec8a2>" + _vm._ssrEscape("\n      " + _vm._s(_vm.loading ? _vm.$t("刷新中…") : _vm.$t("刷新消息")) + "\n    ") + "</button>" : "<!---->"))], 2) : _vm._e(), _vm._ssrNode(" "), !_vm.ready ? _vm._ssrNode("<div class=\"state\" data-v-346ec8a2>", "</div>", [_vm._ssrNode(_vm._ssrEscape(_vm._s(_vm.$t("正在准备消息列表…"))))], 2) : !_vm.token || _vm.authExpired ? _vm._ssrNode("<div class=\"state\" data-v-346ec8a2>", "</div>", [_vm._ssrNode("<h2 data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.authExpired ? _vm.$t("登录状态已过期") : _vm.$t("登录后查看活动消息"))) + "</h2> <p data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.$t("活动消息与账号关联，登录后可查看收到的通知。"))) + "</p> "), _c('nuxt-link', {
    attrs: {
      "to": _vm.loginUrl
    }
  }, [_vm._v(_vm._s(_vm.$t("前往登录 →")))])], 2) : [_vm._ssrNode((_vm.error ? "<p role=\"alert\" class=\"error\" data-v-346ec8a2>" + _vm._ssrEscape("\n      " + _vm._s(_vm.error) + "\n      ") + "<button" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.$t("重试"))) + "</button></p>" : "<!---->") + " <p aria-live=\"polite\" class=\"summary\" data-v-346ec8a2>" + _vm._ssrEscape("\n      " + _vm._s(_vm.loading ? _vm.$t("正在读取活动消息…") : _vm.$t("共 {p0} 条活动消息 · 最新消息在前", {
    p0: _vm.total
  })) + "\n    ") + "</p> "), _vm._ssrNode("<div" + _vm._ssrAttr("aria-busy", _vm.loading) + " class=\"message-grid\" data-v-346ec8a2>", "</div>", _vm._l(_vm.messages, function (item) {
    return _vm._ssrNode("<article data-v-346ec8a2>", "</article>", [_vm._ssrNode((item.bg_url ? "<img" + _vm._ssrAttr("src", item.bg_url) + " alt loading=\"lazy\" data-v-346ec8a2>" : "<!---->") + " "), _vm._ssrNode("<div class=\"message-body\" data-v-346ec8a2>", "</div>", [_vm._ssrNode("<time" + _vm._ssrAttr("datetime", item.time) + " data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.date(item.time))) + "</time> <p data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(item.message_content)) + "</p> "), item.link && !item.link.external ? _c('nuxt-link', {
      attrs: {
        "to": item.link.href
      }
    }, [_vm._v(_vm._s(_vm.$t("查看活动详情 →")))]) : item.link ? _c('a', {
      attrs: {
        "href": item.link.href,
        "target": "_blank",
        "rel": "noopener noreferrer"
      }
    }, [_vm._v(_vm._s(_vm.$t("查看活动详情 ↗")))]) : _c('span', {
      staticClass: "quiet"
    }, [_vm._v(_vm._s(_vm.$t("这条通知暂无详情链接")))])], 2)], 2);
  }), 0), _vm._ssrNode(" " + (!_vm.loading && !_vm.error && !_vm.messages.length ? "<p class=\"state\" data-v-346ec8a2>" + _vm._ssrEscape("\n      " + _vm._s(_vm.$t("暂无活动消息")) + "\n    ") + "</p>" : "<!---->") + " " + (_vm.totalPages > 1 ? "<nav" + _vm._ssrAttr("aria-label", _vm.$t('活动消息分页')) + " data-v-346ec8a2><button" + _vm._ssrAttr("disabled", _vm.loading || _vm.page <= 1) + " data-v-346ec8a2>" + _vm._ssrEscape("\n        " + _vm._s(_vm.$t("上一页"))) + "</button><span data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.$t("第 {p0} / {p1} 页", {
    p0: _vm.page,
    p1: _vm.totalPages
  }))) + "</span><button" + _vm._ssrAttr("disabled", _vm.loading || _vm.page >= _vm.totalPages) + " data-v-346ec8a2>" + _vm._ssrEscape("\n        " + _vm._s(_vm.$t("下一页")) + "\n      ") + "</button></nav>" : "<!---->"))]], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderActivityInbox.vue?vue&type=template&id=346ec8a2&scoped=true

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reader-activities.js
var reader_activities = __webpack_require__(208);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderActivityInbox.vue?vue&type=script&lang=js


/* harmony default export */ var ReaderActivityInboxvue_type_script_lang_js = ({
  props: {
    embedded: Boolean
  },
  data: () => ({
    ready: false,
    token: null,
    authExpired: false,
    messages: [],
    page: 1,
    total: 0,
    loading: false,
    error: "",
    failedPage: 1,
    version: 0,
    epoch: 0
  }),
  computed: {
    loginUrl() {
      return {
        path: "/login",
        query: {
          redirect: this.embedded ? "/me/messages?tab=activity" : "/read/activities"
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
    window.addEventListener("storage", this.storage);
    window.addEventListener("focus", this.checkAccount);
    window.addEventListener("auth-state-changed", this.checkAccount);
  },
  beforeDestroy() {
    this.version++;
    this.epoch++;
    window.removeEventListener("storage", this.storage);
    window.removeEventListener("focus", this.checkAccount);
    window.removeEventListener("auth-state-changed", this.checkAccount);
  },
  methods: {
    storage(event) {
      if (event.key === "token") this.checkAccount();
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
        error: "",
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
      this.error = "";
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
        this.error = error.message || "活动消息加载失败";
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
      return Number.isFinite(date.getTime()) ? date.toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
        hour12: false
      }) : "时间未提供";
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderActivityInbox.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderActivityInboxvue_type_script_lang_js = (ReaderActivityInboxvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderActivityInbox.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(247)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderActivityInboxvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "346ec8a2",
  "47f196b4"
  
)

/* harmony default export */ var ReaderActivityInbox = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 596:
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

// EXTERNAL MODULE: ./components/read/ReaderActivityInbox.vue + 4 modules
var ReaderActivityInbox = __webpack_require__(289);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(39);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/activities.vue?vue&type=script&lang=js


/* harmony default export */ var activitiesvue_type_script_lang_js = ({
  components: {
    ReaderActivityInbox: ReaderActivityInbox["a" /* default */]
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
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/read/activities.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_activitiesvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  "9178bda6"
  
)

/* harmony default export */ var activities = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=activities.js.map