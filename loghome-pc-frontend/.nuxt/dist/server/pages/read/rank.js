exports.ids = [29];
exports.modules = {

/***/ 129:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(140);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("2b647e0a", content, true, context)
};

/***/ }),

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/WorkCard.vue?vue&type=template&id=731e206c&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('nuxt-link', {
    staticClass: "reading-work",
    class: {
      compact: _vm.compact
    },
    attrs: {
      "to": _vm.destination || _vm.workUrl(_vm.book)
    }
  }, [_vm.rank ? _c('span', {
    staticClass: "work-rank",
    class: {
      podium: _vm.rank <= 3
    }
  }, [_vm._v(_vm._s(String(_vm.rank).padStart(2, '0')))]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "work-cover"
  }, [_c('img', {
    attrs: {
      "src": _vm.book.picUrl || '/default-book-cover.png',
      "alt": _vm.book.name || '作品封面',
      "loading": "lazy"
    },
    on: {
      "error": _vm.coverError
    }
  }), _vm._v(" "), _vm.book.novel_type === 'manga' || _vm.book.novel_type === 'world' ? _c('span', {
    staticClass: "work-kind",
    class: _vm.book.novel_type
  }, [_vm._v(_vm._s(_vm.book.novel_type === 'manga' ? '漫画' : '世界'))]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "work-copy"
  }, [_c('h3', {
    attrs: {
      "title": _vm.book.name
    }
  }, [_vm._v(_vm._s(_vm.book.name || '未命名作品'))]), _vm._v(" "), _c('div', {
    staticClass: "work-author"
  }, [_vm._v(_vm._s(_vm.book.author_name))]), _vm._v(" "), _vm.visibleBadges.length || _vm.book.is_haycraft ? _c('div', {
    staticClass: "work-badges"
  }, [_vm.book.is_haycraft ? _c('span', {
    staticClass: "work-badge tone-gold",
    attrs: {
      "title": "HayCraft 干草块文会作品"
    }
  }, [_vm._v("HayCraft")]) : _vm._e(), _vm._v(" "), _vm._l(_vm.visibleBadges, function (badge) {
    return _c('span', {
      key: badge.code,
      staticClass: "work-badge",
      class: 'tone-' + badge.tone
    }, [_vm._v(_vm._s(badge.text))]);
  })], 2) : _vm._e(), _vm._v(" "), !_vm.compact && _vm.book.content ? _c('p', {
    staticClass: "work-description"
  }, [_vm._v(_vm._s(_vm.plainDescription))]) : _vm._e(), _vm._v(" "), _vm.book.updateInfo && _vm.book.updateInfo.has_updates ? _c('div', {
    staticClass: "work-updates"
  }, [_vm._v("更新 " + _vm._s(_vm.book.updateInfo.new_chapters_count) + " 章")]) : _vm.book.last_article_chapter ? _c('div', {
    staticClass: "work-progress"
  }, [_vm._v("读至第 " + _vm._s(_vm.book.last_article_chapter) + " 章")]) : _vm._e(), _vm._v(" "), _vm.showScore ? _c('div', {
    staticClass: "work-meta work-score"
  }, [_vm._v("原木力 " + _vm._s(_vm.numberText(_vm.book.score == null ? _vm.book.ranking : _vm.book.score)))]) : _c('div', {
    staticClass: "work-meta"
  }, [_c('span', [_vm._v(_vm._s(_vm.book.novel_type === 'world' ? '世界设定' : _vm.book.is_complete ? '已完结' : '连载中'))]), _vm._v(" "), !_vm.compact && _vm.book.text_count ? _c('span', [_vm._v(_vm._s(_vm.numberText(_vm.book.text_count)) + " 字")]) : _vm._e()]), _vm._v(" "), !_vm.compact ? _c('div', {
    staticClass: "work-date"
  }, [_vm._v(_vm._s(_vm.dateText(_vm.book.update_time)))]) : _vm._e()])]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/WorkCard.vue?vue&type=template&id=731e206c&scoped=true

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(10);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/WorkCard.vue?vue&type=script&lang=js

/* harmony default export */ var WorkCardvue_type_script_lang_js = ({
  props: {
    work: {
      type: Object,
      required: true
    },
    compact: Boolean,
    rank: {
      type: Number,
      default: 0
    },
    showScore: Boolean,
    destination: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    now: Date.now(),
    expiryTimer: null
  }),
  computed: {
    book() {
      return Object(reading_discovery["k" /* normalizeWork */])(this.work);
    },
    plainDescription() {
      return String(this.book.content || '暂无简介').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
    },
    visibleBadges() {
      return Object(reading_discovery["d" /* asList */])(this.book.badges).filter(badge => badge.code !== 'haycraft_work' && (!badge.expires_at || new Date(badge.expires_at).getTime() > this.now)).slice(0, this.compact ? 1 : 2);
    }
  },
  watch: {
    'work.badges': {
      handler() {
        this.now = Date.now();
        this.scheduleExpiry();
      },
      deep: true
    }
  },
  mounted() {
    this.scheduleExpiry();
  },
  beforeDestroy() {
    clearTimeout(this.expiryTimer);
  },
  methods: {
    workUrl: reading_discovery["n" /* workUrl */],
    dateText: reading_discovery["f" /* dateText */],
    numberText: reading_discovery["l" /* numberText */],
    coverError(event) {
      if (!event.target.src.endsWith('/default-book-cover.png')) event.target.src = '/default-book-cover.png';
    },
    scheduleExpiry() {
      clearTimeout(this.expiryTimer);
      const next = Math.min(...Object(reading_discovery["d" /* asList */])(this.work.badges).map(badge => new Date(badge.expires_at).getTime()).filter(time => time > this.now));
      if (Number.isFinite(next)) this.expiryTimer = setTimeout(() => {
        this.now = Date.now();
        this.scheduleExpiry();
      }, Math.min(next - this.now + 1, 2147483647));
    }
  }
});
// CONCATENATED MODULE: ./components/read/WorkCard.vue?vue&type=script&lang=js
 /* harmony default export */ var read_WorkCardvue_type_script_lang_js = (WorkCardvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/WorkCard.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(139)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_WorkCardvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "731e206c",
  "40a3f682"
  
)

/* harmony default export */ var WorkCard = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 137:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(158);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("ed252e78", content, true, context)
};

/***/ }),

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCard_vue_vue_type_style_index_0_id_731e206c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(129);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCard_vue_vue_type_style_index_0_id_731e206c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCard_vue_vue_type_style_index_0_id_731e206c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCard_vue_vue_type_style_index_0_id_731e206c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCard_vue_vue_type_style_index_0_id_731e206c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 140:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reading-work[data-v-731e206c] { display: flex; align-items: flex-start; gap: 16px; padding: 16px 10px; border: 0; border-radius: 8px; background: transparent; color: var(--reading-ink, #302f2a); text-decoration: none; min-width: 0; transition: background .18s ease, transform .18s ease;\n}\n.reading-work[data-v-731e206c]:hover { background: var(--reading-hover, #f5f4f0); text-decoration: none;\n}\n.reading-work[data-v-731e206c]:active { transform: translateY(1px);\n}\n.reading-work[data-v-731e206c]:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 2px;\n}\n.work-cover[data-v-731e206c] { position: relative; flex: 0 0 80px; width: 80px; height: 112px; border-radius: 4px; overflow: hidden; background: #e8e7e2; box-shadow: 0 3px 7px #40362914;\n}\n.work-cover img[data-v-731e206c] { width: 100%; height: 100%; object-fit: cover; display: block;\n}\n.work-kind[data-v-731e206c] { position: absolute; bottom: 0; left: 0; right: 0; padding: 3px 0; text-align: center; background: #383c36e8; color: #fff; font-size: 11px;\n}\n.work-kind.world[data-v-731e206c] { background: #526047ed;\n}\n.work-copy[data-v-731e206c] { min-width: 0; flex: 1;\n}\n.work-copy h3[data-v-731e206c] { font-size: 15px; line-height: 1.5; font-weight: 600; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere;\n}\n.work-author[data-v-731e206c] { color: var(--reading-muted, #73716a); font-size: 13px; margin: 6px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;\n}\n.work-description[data-v-731e206c] { color: var(--reading-secondary, #615e57); font-size: 13px; line-height: 1.75; margin: 8px 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere;\n}\n.work-meta[data-v-731e206c] { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: var(--reading-muted, #73716a); margin-top: 8px; font-variant-numeric: tabular-nums;\n}\n.work-score[data-v-731e206c] { color: var(--reading-accent, #79573c); font-weight: 600;\n}\n.work-date[data-v-731e206c] { font-size: 11px; color: var(--reading-muted, #73716a); margin-top: 5px; font-variant-numeric: tabular-nums;\n}\n.work-badges[data-v-731e206c] { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 5px;\n}\n.work-badge[data-v-731e206c] { padding: 2px 5px; border-radius: 3px; font-size: 10px; line-height: 1.4; color: #526043; background: #edf1e7;\n}\n.tone-gold[data-v-731e206c] { color: #80601f; background: #f8efd7;\n}\n.tone-red[data-v-731e206c] { color: #9b5146; background: #faeeeb;\n}\n.tone-blue[data-v-731e206c] { color: #46647a; background: #edf2f5;\n}\n.work-rank[data-v-731e206c] { flex: 0 0 26px; color: #96948c; font-size: 21px; line-height: 1.4; font-weight: 500; padding-top: 1px; font-family: 'SFMono-Regular', Consolas, monospace; font-variant-numeric: tabular-nums;\n}\n.work-rank.podium[data-v-731e206c] { color: var(--reading-accent, #79573c);\n}\n.work-updates[data-v-731e206c], .work-progress[data-v-731e206c] { font-size: 12px; margin-top: 6px; color: var(--reading-accent, #79573c);\n}\n.compact[data-v-731e206c] { gap: 12px; padding: 12px 8px;\n}\n.compact .work-cover[data-v-731e206c] { flex-basis: 54px; width: 54px; height: 76px;\n}\n.compact .work-copy h3[data-v-731e206c] { font-size: 14px;\n}\n.compact .work-rank[data-v-731e206c] { flex-basis: 24px; font-size: 19px;\n}\n.compact .work-author[data-v-731e206c] { font-size: 12px; margin: 4px 0;\n}\n.compact .work-meta[data-v-731e206c] { font-size: 11px; margin-top: 6px;\n}\n@media (prefers-reduced-motion: reduce) {\n.reading-work[data-v-731e206c] { transition: none;\n}\n.reading-work[data-v-731e206c]:active { transform: none;\n}\n}\n@media (max-width: 640px) {\n.reading-work[data-v-731e206c] { padding: 14px 4px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 155:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/LogPowerWordmark.vue?vue&type=template&id=026f4e20&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "log-power-wordmark",
    class: {
      'is-fallback': _vm.failed
    },
    attrs: {
      "role": "img",
      "aria-label": "原木力"
    }
  }, [_vm._ssrNode(!_vm.failed ? "<img src=\"/brand/log-power-wordmark.png\" alt aria-hidden=\"true\" data-v-026f4e20>" : "<span data-v-026f4e20>原木力</span>")]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/LogPowerWordmark.vue?vue&type=template&id=026f4e20&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/LogPowerWordmark.vue?vue&type=script&lang=js
/* harmony default export */ var LogPowerWordmarkvue_type_script_lang_js = ({
  name: 'LogPowerWordmark',
  data() {
    return {
      failed: false
    };
  }
});
// CONCATENATED MODULE: ./components/LogPowerWordmark.vue?vue&type=script&lang=js
 /* harmony default export */ var components_LogPowerWordmarkvue_type_script_lang_js = (LogPowerWordmarkvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/LogPowerWordmark.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(157)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_LogPowerWordmarkvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "026f4e20",
  "3afa3e90"
  
)

/* harmony default export */ var LogPowerWordmark = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 157:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(137);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.log-power-wordmark[data-v-026f4e20] {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  width: 3.8em;\r\n  height: 1em;\r\n  vertical-align: -0.16em;\r\n  flex-shrink: 0;\r\n  line-height: 1;\r\n  letter-spacing: normal;\r\n  position: relative;\r\n  /* Let the rising arrow extend above the text line without clipping. */\r\n  overflow: visible;\n}\n.log-power-wordmark img[data-v-026f4e20] {\r\n  display: block;\r\n  width: 100%;\r\n  /* Align the letter bodies with adjacent text; the arrow rises above them.\r\n     Canvas: 2051 × 767; letter-body vertical center: 364px. */\r\n  height: 142.1%;\r\n  position: absolute;\r\n  left: 0;\r\n  top: 50%;\r\n  transform: translateY(-47.46%);\r\n  object-fit: contain;\n}\n.log-power-wordmark.is-fallback[data-v-026f4e20] {\r\n  width: auto;\r\n  height: auto;\r\n  position: static;\r\n  overflow: visible;\r\n  vertical-align: baseline;\r\n  line-height: inherit;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 165:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(193);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("b77789b0", content, true, context)
};

/***/ }),

/***/ 192:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_RankPanel_vue_vue_type_style_index_0_id_cc7b92a6_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(165);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_RankPanel_vue_vue_type_style_index_0_id_cc7b92a6_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_RankPanel_vue_vue_type_style_index_0_id_cc7b92a6_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_RankPanel_vue_vue_type_style_index_0_id_cc7b92a6_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_RankPanel_vue_vue_type_style_index_0_id_cc7b92a6_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 193:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.rank-panel[data-v-cc7b92a6] { padding: 26px; background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de); border-radius: 12px;\n}\n.rank-heading[data-v-cc7b92a6] { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 22px;\n}\n.rank-heading h1[data-v-cc7b92a6], .rank-heading h2[data-v-cc7b92a6] { font-size: 21px; font-weight: 600; letter-spacing: -.4px; color: var(--reading-ink, #302f2a);\n}\n.rank-heading h1[data-v-cc7b92a6] { font-size: 28px; line-height: 1.4;\n}\n.rank-heading p[data-v-cc7b92a6] { font-size: 14px; line-height: 1.7; color: var(--reading-muted, #73716a); margin-top: 8px;\n}\n.rank-actions[data-v-cc7b92a6] { display: flex; gap: 16px; align-items: center; font-size: 13px; flex-shrink: 0;\n}\n.rank-actions a[data-v-cc7b92a6] { color: var(--reading-accent, #79573c); text-decoration: none;\n}\nbutton[data-v-cc7b92a6] { font: inherit; cursor: pointer;\n}\n.rank-actions button[data-v-cc7b92a6] { color: var(--reading-muted, #73716a); border: 0; background: none; padding: 8px 4px;\n}\n.rank-controls[data-v-cc7b92a6] { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; padding-bottom: 18px; border-bottom: 1px solid var(--reading-line, #e4e3de);\n}\n.board-buttons[data-v-cc7b92a6], .zone-buttons[data-v-cc7b92a6] { display: flex; gap: 4px; flex-wrap: wrap;\n}\n.board-buttons[data-v-cc7b92a6] { background: var(--reading-hover, #f5f4f0); padding: 4px; border-radius: 8px;\n}\n.board-buttons a[data-v-cc7b92a6], .zone-buttons a[data-v-cc7b92a6] { padding: 8px 12px; font-size: 13px; border: 0; border-radius: 5px; color: var(--reading-secondary, #615e57); text-decoration: none; white-space: nowrap; transition: background .18s ease, color .18s ease;\n}\n.board-buttons a[data-v-cc7b92a6]:hover, .zone-buttons a[data-v-cc7b92a6]:hover { color: var(--reading-accent, #79573c); background: var(--reading-tint, #eee7de);\n}\n.board-buttons a.active[data-v-cc7b92a6] { color: #fff; background: var(--reading-accent, #79573c);\n}\n.zone-buttons a[data-v-cc7b92a6] { padding: 8px 10px; background: none;\n}\n.zone-buttons a.active[data-v-cc7b92a6] { color: var(--reading-accent, #79573c); background: var(--reading-tint, #eee7de); font-weight: 600;\n}\n.rank-grid[data-v-cc7b92a6], .rank-skeleton[data-v-cc7b92a6] { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px 22px; margin-top: 12px;\n}\n.full .rank-grid[data-v-cc7b92a6], .full .rank-skeleton[data-v-cc7b92a6] { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 24px;\n}\n.rank-skeleton div[data-v-cc7b92a6] { height: 110px; border-radius: 8px; background: var(--reading-hover, #f5f4f0);\n}\n.rank-snapshot[data-v-cc7b92a6] { font-size: 12px; color: var(--reading-muted, #73716a); margin-top: 16px; font-variant-numeric: tabular-nums;\n}\n.rank-state[data-v-cc7b92a6] { padding: 40px 16px; font-size: 14px; line-height: 1.8; text-align: center; color: var(--reading-muted, #73716a);\n}\n.rank-error[data-v-cc7b92a6] { color: #9d503b;\n}\n.rank-state button[data-v-cc7b92a6], .rank-bottom button[data-v-cc7b92a6] { border: 1px solid var(--reading-line, #e4e3de); background: var(--reading-surface, #fff); color: var(--reading-accent, #79573c); padding: 10px 20px; border-radius: 6px;\n}\n.rank-bottom[data-v-cc7b92a6] { text-align: center; font-size: 13px; color: var(--reading-muted, #73716a); margin-top: 28px;\n}\n.rank-page-links[data-v-cc7b92a6] { display: flex; justify-content: center; gap: 24px; margin-top: 18px; font-size: 13px;\n}.rank-page-links a[data-v-cc7b92a6] { color: var(--reading-accent, #79573c); text-decoration: none;\n}\nbutton[data-v-cc7b92a6]:disabled { opacity: .5; cursor: wait;\n}\nbutton[data-v-cc7b92a6]:focus-visible, a[data-v-cc7b92a6]:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px;\n}\n.full[data-v-cc7b92a6] { padding: 32px;\n}\n@media (min-width: 1440px) {\n.rank-grid[data-v-cc7b92a6] { grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n}\n@media (max-width: 1100px) {\n.full .rank-grid[data-v-cc7b92a6], .full .rank-skeleton[data-v-cc7b92a6] { grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n}\n@media (max-width: 640px) {\n.rank-grid[data-v-cc7b92a6], .full .rank-grid[data-v-cc7b92a6], .rank-skeleton[data-v-cc7b92a6], .full .rank-skeleton[data-v-cc7b92a6] { grid-template-columns: 1fr;\n}\n.rank-panel[data-v-cc7b92a6], .full[data-v-cc7b92a6] { padding: 20px 16px;\n}\n.rank-heading[data-v-cc7b92a6] { align-items: flex-start; flex-wrap: wrap;\n}\n.rank-heading h1[data-v-cc7b92a6] { font-size: 24px;\n}\n.rank-actions[data-v-cc7b92a6] { gap: 14px;\n}\n.rank-controls[data-v-cc7b92a6] { gap: 12px;\n}\n.board-buttons a[data-v-cc7b92a6] { padding: 8px 10px;\n}\n}\n@media (prefers-reduced-motion: reduce) {\n.board-buttons a[data-v-cc7b92a6], .zone-buttons a[data-v-cc7b92a6] { transition: none;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/RankPanel.vue?vue&type=template&id=cc7b92a6&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "rank-panel",
    class: {
      full: _vm.full
    },
    attrs: {
      "aria-label": "作品排行榜"
    }
  }, [_vm._ssrNode("<header class=\"rank-heading\" data-v-cc7b92a6>", "</header>", [_vm._ssrNode("<div data-v-cc7b92a6>" + (_vm.full ? "<h1 data-v-cc7b92a6>" + _vm._ssrEscape(_vm._s(_vm.selectedBoard.label) + " · " + _vm._s(_vm.selectedZone.label) + "作品" + _vm._s(_vm.requestedPage > 1 ? ` · 第 ${_vm.requestedPage} 页` : '')) + "</h1>" : "<h2 data-v-cc7b92a6>发现好作品</h2>") + (_vm.full ? "<p data-v-cc7b92a6>" + _vm._ssrEscape(_vm._s(_vm.selectedBoard.description)) + "</p>" : "<!---->") + "</div> "), _vm._ssrNode("<div class=\"rank-actions\" data-v-cc7b92a6>", "</div>", [_vm._ssrNode("<button type=\"button\"" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-cc7b92a6>刷新</button> "), !_vm.full ? _c('nuxt-link', {
    attrs: {
      "to": `/read/rank?board=${_vm.board}&zone=${_vm.zone}`
    }
  }, [_vm._v("完整榜单 →")]) : _c('nuxt-link', {
    attrs: {
      "to": "/read"
    }
  }, [_vm._v("返回书库")])], 2)], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"rank-controls\" data-v-cc7b92a6>", "</div>", [_vm._ssrNode("<div aria-label=\"选择榜单\" class=\"board-buttons\" data-v-cc7b92a6>", "</div>", _vm._l(_vm.boards, function (item) {
    return _c('nuxt-link', {
      key: item.key,
      class: {
        active: _vm.board === item.key
      },
      attrs: {
        "to": _vm.rankUrl(item.key, _vm.zone),
        "aria-current": _vm.board === item.key ? 'page' : null
      },
      nativeOn: {
        "click": function ($event) {
          $event.preventDefault();
          return _vm.select(item.key, _vm.zone);
        }
      }
    }, [item.key === 'logpower' ? [_c('LogPowerWordmark'), _vm._v("榜")] : [_vm._v(_vm._s(item.label))]], 2);
  }), 1), _vm._ssrNode(" "), _vm._ssrNode("<div aria-label=\"选择作品类型\" class=\"zone-buttons\" data-v-cc7b92a6>", "</div>", _vm._l(_vm.zones, function (item) {
    return _c('nuxt-link', {
      key: item.key,
      class: {
        active: _vm.zone === item.key
      },
      attrs: {
        "to": _vm.rankUrl(_vm.board, item.key),
        "aria-current": _vm.zone === item.key ? 'page' : null
      },
      nativeOn: {
        "click": function ($event) {
          $event.preventDefault();
          return _vm.select(_vm.board, item.key);
        }
      }
    }, [_vm._v(_vm._s(item.label))]);
  }), 1)], 2), _vm._ssrNode(" " + (_vm.snapshot && _vm.items.length ? "<p class=\"rank-snapshot\" data-v-cc7b92a6>" + _vm._ssrEscape("更新于 " + _vm._s(_vm.dateText(_vm.snapshot)) + " · " + _vm._s(_vm.items.length) + " 部作品") + "</p>" : "<!---->") + " "), _vm.loading && !_vm.items.length ? _vm._ssrNode("<div aria-label=\"榜单加载中\" aria-busy=\"true\" class=\"rank-skeleton\" data-v-cc7b92a6>", "</div>", [_vm._ssrNode(_vm._ssrList(_vm.full ? 12 : 9, function (n) {
    return "<div data-v-cc7b92a6></div>";
  }))], 2) : _vm.items.length ? _vm._ssrNode("<div class=\"rank-grid\" data-v-cc7b92a6>", "</div>", _vm._l(_vm.items, function (work, index) {
    return _c('WorkCard', {
      key: work.novel_id,
      attrs: {
        "work": work,
        "rank": Number(work.position) || index + 1,
        "compact": !_vm.full,
        "show-score": _vm.board === 'logpower' || _vm.board === 'new'
      }
    });
  }), 1) : !_vm.error ? _vm._ssrNode("<p class=\"rank-state\" data-v-cc7b92a6>这个榜单还没有作品，换个分类看看。</p>") : _vm._e(), _vm._ssrNode(" " + (_vm.error ? "<div role=\"alert\" class=\"rank-state rank-error\" data-v-cc7b92a6>" + _vm._ssrEscape(_vm._s(_vm.error) + " ") + "<button data-v-cc7b92a6>重试</button></div>" : "<!---->") + " "), _vm.full && _vm.items.length ? _vm._ssrNode("<div class=\"rank-bottom\" data-v-cc7b92a6>", "</div>", [_vm._ssrNode((_vm.hasMore ? "<button" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-cc7b92a6>" + _vm._ssrEscape(_vm._s(_vm.loading ? '正在加载…' : '加载更多')) + "</button>" : "<span data-v-cc7b92a6>已显示全部上榜作品</span>") + " "), _vm._ssrNode("<nav aria-label=\"榜单分页\" class=\"rank-page-links\" data-v-cc7b92a6>", "</nav>", [_vm.requestedPage > 1 ? _c('nuxt-link', {
    attrs: {
      "to": _vm.rankUrl(_vm.board, _vm.zone, _vm.requestedPage - 1),
      "rel": "prev"
    }
  }, [_vm._v("上一页")]) : _vm._e(), _vm.hasMore ? _c('nuxt-link', {
    attrs: {
      "to": _vm.rankUrl(_vm.board, _vm.zone, _vm.page + 1),
      "rel": "next"
    }
  }, [_vm._v("第 " + _vm._s(_vm.page + 1) + " 页 →")]) : _vm._e()], 1)], 2) : _vm._e()], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/RankPanel.vue?vue&type=template&id=cc7b92a6&scoped=true

// EXTERNAL MODULE: ./components/read/WorkCard.vue + 4 modules
var WorkCard = __webpack_require__(136);

// EXTERNAL MODULE: ./components/LogPowerWordmark.vue + 4 modules
var LogPowerWordmark = __webpack_require__(155);

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(10);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(34);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/RankPanel.vue?vue&type=script&lang=js




/* harmony default export */ var RankPanelvue_type_script_lang_js = ({
  components: {
    WorkCard: WorkCard["a" /* default */],
    LogPowerWordmark: LogPowerWordmark["a" /* default */]
  },
  props: {
    full: Boolean
  },
  data() {
    const query = this.full ? this.$route.query : {};
    return {
      boards: reading_discovery["a" /* READING_BOARDS */],
      zones: reading_discovery["b" /* READING_ZONES */],
      board: reading_discovery["a" /* READING_BOARDS */].some(item => item.key === query.board) ? query.board : 'update',
      zone: reading_discovery["b" /* READING_ZONES */].some(item => item.key === query.zone) ? query.zone : 'all',
      items: [],
      page: 1,
      snapshot: '',
      batchId: null,
      loading: false,
      hasMore: false,
      error: '',
      version: 0,
      failedPage: 1,
      cache: {}
    };
  },
  async fetch() {
    await this.loadFirst();
  },
  head() {
    return this.full ? Object(reading_seo["d" /* readingHead */])({
      title: `${this.selectedBoard.label} · ${this.selectedZone.label}作品${this.requestedPage > 1 ? ` 第 ${this.requestedPage} 页` : ''} - 原木社区`,
      description: this.selectedBoard.description,
      path: '/read/rank',
      query: this.$route.query,
      schema: Object(reading_seo["g" /* workListSchema */])(this.items, this.selectedBoard.label, (this.requestedPage - 1) * this.amount),
      noindex: !!this.error || this.requestedPage > 1 && !this.items.length
    }) : {};
  },
  computed: {
    amount() {
      return this.full ? 20 : 12;
    },
    selectedBoard() {
      return this.boards.find(item => item.key === this.board);
    },
    selectedZone() {
      return this.zones.find(item => item.key === this.zone);
    },
    requestedPage() {
      return this.full ? Object(reading_seo["e" /* readingPage */])(this.$route.query.page) : 1;
    }
  },
  watch: {
    '$route.query': function (query) {
      if (!this.full) return;
      const board = this.boards.some(item => item.key === query.board) ? query.board : 'update';
      const zone = this.zones.some(item => item.key === query.zone) ? query.zone : 'all';
      if (board !== this.board || zone !== this.zone) {
        this.board = board;
        this.zone = zone;
        this.loadFirst();
      }
    },
    requestedPage() {
      if (this.full) this.loadFirst();
    }
  },
  beforeDestroy() {
    this.version++;
  },
  methods: {
    dateText: reading_discovery["f" /* dateText */],
    rankUrl(board, zone, page = 1) {
      return {
        path: '/read/rank',
        query: {
          board,
          zone,
          ...(page > 1 ? {
            page
          } : {})
        }
      };
    },
    select(board, zone) {
      if (board === this.board && zone === this.zone) return;
      this.board = board;
      this.zone = zone;
      if (this.full) this.$router.replace(this.rankUrl(board, zone));
      this.loadFirst();
    },
    async loadFirst(force = false) {
      const version = ++this.version;
      const key = `${this.board}:${this.zone}`;
      const requestedPage = this.requestedPage;
      const cached = this.cache[key];
      this.items = cached && Date.now() - cached.savedAt < 600000 ? cached.items : [];
      this.page = 1;
      this.batchId = null;
      this.snapshot = '';
      this.hasMore = false;
      this.error = '';
      this.failedPage = 1;
      if (!force && !this.full && this.items.length) {
        this.loading = false;
        this.snapshot = cached.snapshot;
        return;
      }
      this.loading = true;
      try {
        let payload = await this.$api.reading.getRank({
          board: this.board,
          zone: this.zone,
          page: 1,
          amount: this.amount
        });
        if (version !== this.version) return;
        if (requestedPage > 1) {
          try {
            payload = await this.$api.reading.getRank({
              board: this.board,
              zone: this.zone,
              page: requestedPage,
              amount: this.amount,
              batch_id: payload.batch_id
            });
          } catch (error) {
            if (error.status !== 410) throw error;
            const fresh = await this.$api.reading.getRank({
              board: this.board,
              zone: this.zone,
              page: 1,
              amount: this.amount
            });
            if (version !== this.version) return;
            payload = await this.$api.reading.getRank({
              board: this.board,
              zone: this.zone,
              page: requestedPage,
              amount: this.amount,
              batch_id: fresh.batch_id
            });
          }
        }
        if (version !== this.version) return;
        this.items = Object(reading_discovery["m" /* uniqueWorks */])(payload.items);
        this.snapshot = payload.snapshot_date || '';
        this.batchId = payload.batch_id || null;
        this.page = requestedPage;
        this.hasMore = this.items.length >= this.amount;
        if (requestedPage > 1 && !this.items.length) Object(reading_seo["f" /* readingResponseStatus */])(this, 404);
        this.$set(this.cache, key, {
          items: this.items,
          snapshot: this.snapshot,
          savedAt: Date.now()
        });
      } catch (_) {
        if (version === this.version) {
          this.error = '榜单暂时加载失败，请重试。';
          if (this.full) Object(reading_seo["f" /* readingResponseStatus */])(this, 503);
        }
      } finally {
        if (version === this.version) this.loading = false;
      }
    },
    async loadMore() {
      if (this.loading || !this.hasMore) return;
      const version = this.version,
        next = this.page + 1;
      this.loading = true;
      this.error = '';
      this.failedPage = next;
      try {
        const payload = await this.$api.reading.getRank({
          board: this.board,
          zone: this.zone,
          page: next,
          amount: this.amount,
          batch_id: this.batchId
        });
        if (version !== this.version) return;
        this.items = Object(reading_discovery["m" /* uniqueWorks */])([...this.items, ...payload.items]);
        this.page = next;
        this.hasMore = payload.items.length >= this.amount;
      } catch (error) {
        if (version !== this.version) return;
        if (error.status === 410) {
          this.loading = false;
          return this.loadFirst(true);
        }
        this.error = '未能加载下一页，已保留当前榜单。';
      } finally {
        if (version === this.version) this.loading = false;
      }
    },
    retry() {
      return this.failedPage > 1 ? this.loadMore() : this.loadFirst(true);
    }
  }
});
// CONCATENATED MODULE: ./components/read/RankPanel.vue?vue&type=script&lang=js
 /* harmony default export */ var read_RankPanelvue_type_script_lang_js = (RankPanelvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/RankPanel.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(192)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_RankPanelvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "cc7b92a6",
  "671827aa"
  
)

/* harmony default export */ var RankPanel = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 432:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/rank.vue?vue&type=template&id=1b30d11d
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "reading-ranks-page"
  }, [_c('RankPanel', {
    attrs: {
      "full": ""
    }
  })], 1);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/rank.vue?vue&type=template&id=1b30d11d

// EXTERNAL MODULE: ./components/read/RankPanel.vue + 4 modules
var RankPanel = __webpack_require__(220);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/rank.vue?vue&type=script&lang=js

/* harmony default export */ var rankvue_type_script_lang_js = ({
  components: {
    RankPanel: RankPanel["a" /* default */]
  },
  watchQuery: ['board', 'zone', 'page']
});
// CONCATENATED MODULE: ./pages/read/rank.vue?vue&type=script&lang=js
 /* harmony default export */ var read_rankvue_type_script_lang_js = (rankvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/read/rank.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_rankvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  "566377ec"
  
)

/* harmony default export */ var rank = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=rank.js.map