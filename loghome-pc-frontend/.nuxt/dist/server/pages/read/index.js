exports.ids = [49];
exports.modules = {

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(175);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("2b647e0a", content, true, context)
};

/***/ }),

/***/ 165:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return loginReturnPath; });
// Login callers may supply a local return route, never an external destination.
function loginReturnPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f]/.test(value)) return '/';
  try {
    const url = new URL(value, 'https://loghome.ink');
    if (url.origin !== 'https://loghome.ink' || url.pathname === '/login') return '/';
    return url.pathname + url.search + url.hash;
  } catch (_) {
    return '/';
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URL"]))

/***/ }),

/***/ 171:
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
var reading_discovery = __webpack_require__(11);

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
  
  var style0 = __webpack_require__(174)
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

/***/ 172:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(194);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("ed252e78", content, true, context)
};

/***/ }),

/***/ 174:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCard_vue_vue_type_style_index_0_id_731e206c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(163);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCard_vue_vue_type_style_index_0_id_731e206c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCard_vue_vue_type_style_index_0_id_731e206c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCard_vue_vue_type_style_index_0_id_731e206c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCard_vue_vue_type_style_index_0_id_731e206c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 175:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reading-work[data-v-731e206c] { display: flex; align-items: flex-start; gap: 16px; padding: 16px 10px; border: 0; border-radius: 8px; background: transparent; color: var(--reading-ink, #302f2a); text-decoration: none; min-width: 0; transition: background .18s ease, transform .18s ease;\n}\n.reading-work[data-v-731e206c]:hover { background: var(--reading-hover, #f5f4f0); text-decoration: none;\n}\n.reading-work[data-v-731e206c]:active { transform: translateY(1px);\n}\n.reading-work[data-v-731e206c]:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 2px;\n}\n.work-cover[data-v-731e206c] { position: relative; flex: 0 0 80px; width: 80px; height: 112px; border-radius: 4px; overflow: hidden; background: #e8e7e2; box-shadow: 0 3px 7px #40362914;\n}\n.work-cover img[data-v-731e206c] { width: 100%; height: 100%; object-fit: cover; display: block;\n}\n.work-kind[data-v-731e206c] { position: absolute; bottom: 0; left: 0; right: 0; padding: 3px 0; text-align: center; background: #383c36e8; color: #fff; font-size: 11px;\n}\n.work-kind.world[data-v-731e206c] { background: #526047ed;\n}\n.work-copy[data-v-731e206c] { min-width: 0; flex: 1;\n}\n.work-copy h3[data-v-731e206c] { font-size: 15px; line-height: 1.5; font-weight: 600; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere;\n}\n.work-author[data-v-731e206c] { color: var(--reading-muted, #73716a); font-size: 13px; margin: 6px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;\n}\n.work-description[data-v-731e206c] { color: var(--reading-secondary, #615e57); font-size: 13px; line-height: 1.75; margin: 8px 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere;\n}\n.work-meta[data-v-731e206c] { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: var(--reading-muted, #73716a); margin-top: 8px; font-variant-numeric: tabular-nums;\n}\n.work-score[data-v-731e206c] { color: var(--reading-accent, #79573c); font-weight: 600;\n}\n.work-date[data-v-731e206c] { font-size: 11px; color: var(--reading-muted, #73716a); margin-top: 5px; font-variant-numeric: tabular-nums;\n}\n.work-badges[data-v-731e206c] { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 5px;\n}\n.work-badge[data-v-731e206c] { padding: 2px 5px; border-radius: 3px; font-size: 10px; line-height: 1.4; color: #526043; background: #edf1e7;\n}\n.tone-gold[data-v-731e206c] { color: #80601f; background: #f8efd7;\n}\n.tone-red[data-v-731e206c] { color: #9b5146; background: #faeeeb;\n}\n.tone-blue[data-v-731e206c] { color: #46647a; background: #edf2f5;\n}\n.work-rank[data-v-731e206c] { flex: 0 0 26px; color: #96948c; font-size: 21px; line-height: 1.4; font-weight: 500; padding-top: 1px; font-family: 'SFMono-Regular', Consolas, monospace; font-variant-numeric: tabular-nums;\n}\n.work-rank.podium[data-v-731e206c] { color: var(--reading-accent, #79573c);\n}\n.work-updates[data-v-731e206c], .work-progress[data-v-731e206c] { font-size: 12px; margin-top: 6px; color: var(--reading-accent, #79573c);\n}\n.compact[data-v-731e206c] { gap: 12px; padding: 12px 8px;\n}\n.compact .work-cover[data-v-731e206c] { flex-basis: 54px; width: 54px; height: 76px;\n}\n.compact .work-copy h3[data-v-731e206c] { font-size: 14px;\n}\n.compact .work-rank[data-v-731e206c] { flex-basis: 24px; font-size: 19px;\n}\n.compact .work-author[data-v-731e206c] { font-size: 12px; margin: 4px 0;\n}\n.compact .work-meta[data-v-731e206c] { font-size: 11px; margin-top: 6px;\n}\n@media (prefers-reduced-motion: reduce) {\n.reading-work[data-v-731e206c] { transition: none;\n}\n.reading-work[data-v-731e206c]:active { transform: none;\n}\n}\n@media (max-width: 640px) {\n.reading-work[data-v-731e206c] { padding: 14px 4px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 191:
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
  
  var style0 = __webpack_require__(193)
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

/***/ 192:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URLSearchParams) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return normalizeReaderPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return initialReaderPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return pageCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return pageAtCoordinate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return textReaderResumeUrl; });
function normalizeReaderPosition(value = {}) {
  var _value$paragraphId, _value$charOffset, _value$pageIndex;
  const integer = value => Number.isSafeInteger(Number(value)) && Number(value) >= 0 ? Number(value) : 0;
  return {
    paragraphId: integer((_value$paragraphId = value.paragraphId) !== null && _value$paragraphId !== void 0 ? _value$paragraphId : value.last_paragraph_id),
    charOffset: integer((_value$charOffset = value.charOffset) !== null && _value$charOffset !== void 0 ? _value$charOffset : value.last_char_offset),
    pageIndex: integer((_value$pageIndex = value.pageIndex) !== null && _value$pageIndex !== void 0 ? _value$pageIndex : value.last_page_idx)
  };
}
function initialReaderPosition(query = {}, saved, articleId) {
  if (Number(query.paragraphId) > 0) return normalizeReaderPosition({
    paragraphId: query.paragraphId,
    charOffset: query.charOffset
  });
  if (query.edge === 'end') return {
    paragraphId: 0,
    charOffset: 0,
    pageIndex: Number.MAX_SAFE_INTEGER
  };
  if (query.start === '1') return normalizeReaderPosition();
  if (query.pageIdx != null) return normalizeReaderPosition({
    pageIndex: query.pageIdx
  });
  if (saved && Number(saved.last_article_id) === Number(articleId)) return normalizeReaderPosition(saved);
  return normalizeReaderPosition({
    pageIndex: query.pageIdx
  });
}
function pageCount(scrollWidth, width, gap = 40) {
  return Math.max(1, Math.ceil((scrollWidth + gap - 1) / (width + gap)));
}
function pageAtCoordinate(coordinate, origin, currentPage, width, gap = 40) {
  return Math.max(0, Math.floor((coordinate - origin + currentPage * (width + gap) + .5) / (width + gap)));
}
function textReaderResumeUrl(record) {
  const id = Number(record && record.last_article_id);
  if (!(id > 0)) return '';
  const position = normalizeReaderPosition(record);
  const params = new URLSearchParams({
    resume: '1'
  });
  if (position.paragraphId) {
    params.set('paragraphId', position.paragraphId);
    if (position.charOffset) params.set('charOffset', position.charOffset);
  } else params.set('pageIdx', position.pageIndex);
  return `/article/${id}?${params}`;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URLSearchParams"]))

/***/ }),

/***/ 193:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(172);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.log-power-wordmark[data-v-026f4e20] {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  width: 3.8em;\r\n  height: 1em;\r\n  vertical-align: -0.16em;\r\n  flex-shrink: 0;\r\n  line-height: 1;\r\n  letter-spacing: normal;\r\n  position: relative;\r\n  /* Let the rising arrow extend above the text line without clipping. */\r\n  overflow: visible;\n}\n.log-power-wordmark img[data-v-026f4e20] {\r\n  display: block;\r\n  width: 100%;\r\n  /* Align the letter bodies with adjacent text; the arrow rises above them.\r\n     Canvas: 2051 × 767; letter-body vertical center: 364px. */\r\n  height: 142.1%;\r\n  position: absolute;\r\n  left: 0;\r\n  top: 50%;\r\n  transform: translateY(-47.46%);\r\n  object-fit: contain;\n}\n.log-power-wordmark.is-fallback[data-v-026f4e20] {\r\n  width: auto;\r\n  height: auto;\r\n  position: static;\r\n  overflow: visible;\r\n  vertical-align: baseline;\r\n  line-height: inherit;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 204:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(237);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("4cf591b6", content, true, context)
};

/***/ }),

/***/ 205:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(241);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("b77789b0", content, true, context)
};

/***/ }),

/***/ 206:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(243);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("1a6d9f55", content, true, context)
};

/***/ }),

/***/ 236:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Banner_vue_vue_type_style_index_0_id_5589a2e3_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(204);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Banner_vue_vue_type_style_index_0_id_5589a2e3_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Banner_vue_vue_type_style_index_0_id_5589a2e3_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Banner_vue_vue_type_style_index_0_id_5589a2e3_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Banner_vue_vue_type_style_index_0_id_5589a2e3_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 237:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".banner-container[data-v-5589a2e3]{width:100%;margin:10px 0}.banner-container .banner-swiper[data-v-5589a2e3]{position:relative;width:100%;height:200px;overflow:hidden;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.1)}@media(max-width: 768px){.banner-container .banner-swiper[data-v-5589a2e3]{height:150px}}.banner-container .banner-wrapper[data-v-5589a2e3]{display:flex;width:100%;height:100%;transition:transform .5s ease}.banner-container .banner-item[data-v-5589a2e3]{flex:0 0 100%;position:relative;cursor:pointer;overflow:hidden}.banner-container .banner-item .banner-image[data-v-5589a2e3]{width:100%;height:100%;object-fit:cover;transition:transform .3s ease}.banner-container .banner-item:hover .banner-image[data-v-5589a2e3]{transform:scale(1.05)}.banner-container .banner-item .banner-mask[data-v-5589a2e3]{position:absolute;bottom:0;left:0;width:100%;padding:15px 20px;background:linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)}.banner-container .banner-item .banner-mask .banner-title[data-v-5589a2e3]{color:#fff;font-size:16px;font-weight:bold;margin:0}.banner-container .banner-pagination[data-v-5589a2e3]{position:absolute;bottom:15px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:10}.banner-container .banner-pagination .pagination-dot[data-v-5589a2e3]{width:8px;height:8px;border-radius:50%;background-color:hsla(0,0%,100%,.5);cursor:pointer;transition:all .3s ease}.banner-container .banner-pagination .pagination-dot.active[data-v-5589a2e3]{background-color:#fff;transform:scale(1.2)}.banner-container .banner-pagination .pagination-dot[data-v-5589a2e3]:hover{background-color:hsla(0,0%,100%,.8)}.banner-container .banner-button-prev[data-v-5589a2e3],.banner-container .banner-button-next[data-v-5589a2e3]{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;background-color:rgba(0,0,0,.5);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:all .3s ease;z-index:10}.banner-container .banner-button-prev .arrow[data-v-5589a2e3],.banner-container .banner-button-next .arrow[data-v-5589a2e3]{color:#fff;font-size:18px;font-weight:bold}.banner-container .banner-button-prev[data-v-5589a2e3]:hover,.banner-container .banner-button-next[data-v-5589a2e3]:hover{background-color:rgba(0,0,0,.7)}.banner-container .banner-button-prev[data-v-5589a2e3]{left:10px}.banner-container .banner-button-next[data-v-5589a2e3]{right:10px}.banner-container .banner-swiper:hover .banner-button-prev[data-v-5589a2e3],.banner-container .banner-swiper:hover .banner-button-next[data-v-5589a2e3]{opacity:1}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_RankPanel_vue_vue_type_style_index_0_id_cc7b92a6_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(205);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_RankPanel_vue_vue_type_style_index_0_id_cc7b92a6_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_RankPanel_vue_vue_type_style_index_0_id_cc7b92a6_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_RankPanel_vue_vue_type_style_index_0_id_cc7b92a6_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_RankPanel_vue_vue_type_style_index_0_id_cc7b92a6_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 241:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.rank-panel[data-v-cc7b92a6] { padding: 26px; background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de); border-radius: 12px;\n}\n.rank-heading[data-v-cc7b92a6] { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 22px;\n}\n.rank-heading h1[data-v-cc7b92a6], .rank-heading h2[data-v-cc7b92a6] { font-size: 21px; font-weight: 600; letter-spacing: -.4px; color: var(--reading-ink, #302f2a);\n}\n.rank-heading h1[data-v-cc7b92a6] { font-size: 28px; line-height: 1.4;\n}\n.rank-heading p[data-v-cc7b92a6] { font-size: 14px; line-height: 1.7; color: var(--reading-muted, #73716a); margin-top: 8px;\n}\n.rank-actions[data-v-cc7b92a6] { display: flex; gap: 16px; align-items: center; font-size: 13px; flex-shrink: 0;\n}\n.rank-actions a[data-v-cc7b92a6] { color: var(--reading-accent, #79573c); text-decoration: none;\n}\nbutton[data-v-cc7b92a6] { font: inherit; cursor: pointer;\n}\n.rank-actions button[data-v-cc7b92a6] { color: var(--reading-muted, #73716a); border: 0; background: none; padding: 8px 4px;\n}\n.rank-controls[data-v-cc7b92a6] { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; padding-bottom: 18px; border-bottom: 1px solid var(--reading-line, #e4e3de);\n}\n.board-buttons[data-v-cc7b92a6], .zone-buttons[data-v-cc7b92a6] { display: flex; gap: 4px; flex-wrap: wrap;\n}\n.board-buttons[data-v-cc7b92a6] { background: var(--reading-hover, #f5f4f0); padding: 4px; border-radius: 8px;\n}\n.board-buttons a[data-v-cc7b92a6], .zone-buttons a[data-v-cc7b92a6] { padding: 8px 12px; font-size: 13px; border: 0; border-radius: 5px; color: var(--reading-secondary, #615e57); text-decoration: none; white-space: nowrap; transition: background .18s ease, color .18s ease;\n}\n.board-buttons a[data-v-cc7b92a6]:hover, .zone-buttons a[data-v-cc7b92a6]:hover { color: var(--reading-accent, #79573c); background: var(--reading-tint, #eee7de);\n}\n.board-buttons a.active[data-v-cc7b92a6] { color: #fff; background: var(--reading-accent, #79573c);\n}\n.zone-buttons a[data-v-cc7b92a6] { padding: 8px 10px; background: none;\n}\n.zone-buttons a.active[data-v-cc7b92a6] { color: var(--reading-accent, #79573c); background: var(--reading-tint, #eee7de); font-weight: 600;\n}\n.rank-grid[data-v-cc7b92a6], .rank-skeleton[data-v-cc7b92a6] { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px 22px; margin-top: 12px;\n}\n.full .rank-grid[data-v-cc7b92a6], .full .rank-skeleton[data-v-cc7b92a6] { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 24px;\n}\n.rank-skeleton div[data-v-cc7b92a6] { height: 110px; border-radius: 8px; background: var(--reading-hover, #f5f4f0);\n}\n.rank-snapshot[data-v-cc7b92a6] { font-size: 12px; color: var(--reading-muted, #73716a); margin-top: 16px; font-variant-numeric: tabular-nums;\n}\n.rank-state[data-v-cc7b92a6] { padding: 40px 16px; font-size: 14px; line-height: 1.8; text-align: center; color: var(--reading-muted, #73716a);\n}\n.rank-error[data-v-cc7b92a6] { color: #9d503b;\n}\n.rank-state button[data-v-cc7b92a6], .rank-bottom button[data-v-cc7b92a6] { border: 1px solid var(--reading-line, #e4e3de); background: var(--reading-surface, #fff); color: var(--reading-accent, #79573c); padding: 10px 20px; border-radius: 6px;\n}\n.rank-bottom[data-v-cc7b92a6] { text-align: center; font-size: 13px; color: var(--reading-muted, #73716a); margin-top: 28px;\n}\n.rank-page-links[data-v-cc7b92a6] { display: flex; justify-content: center; gap: 24px; margin-top: 18px; font-size: 13px;\n}.rank-page-links a[data-v-cc7b92a6] { color: var(--reading-accent, #79573c); text-decoration: none;\n}\nbutton[data-v-cc7b92a6]:disabled { opacity: .5; cursor: wait;\n}\nbutton[data-v-cc7b92a6]:focus-visible, a[data-v-cc7b92a6]:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px;\n}\n.full[data-v-cc7b92a6] { padding: 32px;\n}\n@media (min-width: 1440px) {\n.rank-grid[data-v-cc7b92a6] { grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n}\n@media (max-width: 1100px) {\n.full .rank-grid[data-v-cc7b92a6], .full .rank-skeleton[data-v-cc7b92a6] { grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n}\n@media (max-width: 640px) {\n.rank-grid[data-v-cc7b92a6], .full .rank-grid[data-v-cc7b92a6], .rank-skeleton[data-v-cc7b92a6], .full .rank-skeleton[data-v-cc7b92a6] { grid-template-columns: 1fr;\n}\n.rank-panel[data-v-cc7b92a6], .full[data-v-cc7b92a6] { padding: 20px 16px;\n}\n.rank-heading[data-v-cc7b92a6] { align-items: flex-start; flex-wrap: wrap;\n}\n.rank-heading h1[data-v-cc7b92a6] { font-size: 24px;\n}\n.rank-actions[data-v-cc7b92a6] { gap: 14px;\n}\n.rank-controls[data-v-cc7b92a6] { gap: 12px;\n}\n.board-buttons a[data-v-cc7b92a6] { padding: 8px 10px;\n}\n}\n@media (prefers-reduced-motion: reduce) {\n.board-buttons a[data-v-cc7b92a6], .zone-buttons a[data-v-cc7b92a6] { transition: none;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReadingShelf_vue_vue_type_style_index_0_id_785fd617_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(206);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReadingShelf_vue_vue_type_style_index_0_id_785fd617_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReadingShelf_vue_vue_type_style_index_0_id_785fd617_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReadingShelf_vue_vue_type_style_index_0_id_785fd617_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReadingShelf_vue_vue_type_style_index_0_id_785fd617_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 243:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reading-shelf[data-v-785fd617] { padding: 22px; border-radius: 12px; background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de);\n}\n.shelf-header[data-v-785fd617] { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px;\n}\n.shelf-header h2[data-v-785fd617] { font-size: 18px; font-weight: 600; color: var(--reading-ink, #302f2a); letter-spacing: -.3px;\n}\n.shelf-header a[data-v-785fd617], .shelf-hint a[data-v-785fd617], .shelf-item-actions a[data-v-785fd617] { font-size: 13px; color: var(--reading-accent, #79573c); text-decoration: none;\n}\n.shelf-toolbar[data-v-785fd617] { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 8px;\n}\n.shelf-tabs[data-v-785fd617] { display: flex; gap: 2px;\n}\nbutton[data-v-785fd617] { cursor: pointer; font: inherit;\n}\n.shelf-tabs button[data-v-785fd617] { padding: 7px 8px; font-size: 12px; color: var(--reading-muted, #73716a); background: none; border: 0; border-radius: 5px; white-space: nowrap;\n}\n.shelf-tabs .active[data-v-785fd617] { color: var(--reading-accent, #79573c); background: var(--reading-tint, #eee7de); font-weight: 600;\n}\n.shelf-refresh[data-v-785fd617] { padding: 6px 0 6px 6px; font-size: 12px; background: none; border: 0; color: var(--reading-muted, #73716a); white-space: nowrap;\n}\n.shelf-grid[data-v-785fd617] { display: grid; gap: 4px;\n}\n.shelf-item[data-v-785fd617] { min-width: 0;\n}\n.full[data-v-785fd617] { padding: 32px; min-height: 60vh;\n}\n.full .shelf-header[data-v-785fd617] { padding-bottom: 20px; border-bottom: 1px solid var(--reading-line, #e4e3de);\n}\n.full .shelf-header h2[data-v-785fd617] { font-size: 28px;\n}\n.full .shelf-grid[data-v-785fd617] { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px 28px;\n}\n.full .shelf-tabs button[data-v-785fd617] { font-size: 14px; padding: 9px 14px;\n}\n.shelf-empty[data-v-785fd617] { padding: 40px 12px; color: var(--reading-muted, #73716a); font-size: 14px; line-height: 1.8; text-align: center;\n}\n.shelf-hint[data-v-785fd617], .shelf-count[data-v-785fd617] { font-size: 12px; color: var(--reading-muted, #73716a); margin: 16px 0 0; line-height: 1.8;\n}\n.shelf-error[data-v-785fd617] { font-size: 13px; color: #9d503b; line-height: 1.8; margin-bottom: 12px;\n}\n.shelf-error button[data-v-785fd617] { color: var(--reading-accent, #79573c); border: 0; background: none; text-decoration: underline;\n}\n.shelf-search[data-v-785fd617] { display: flex; gap: 14px; align-items: center; font-size: 13px; color: var(--reading-secondary, #615e57); margin: 20px 0 24px; flex-wrap: wrap;\n}\n.shelf-search input[data-v-785fd617] { border: 1px solid var(--reading-line, #e4e3de); background: var(--reading-hover, #f5f4f0); border-radius: 6px; padding: 11px 14px; width: min(320px, 100%); font: inherit; color: var(--reading-ink, #302f2a);\n}\n.shelf-item-actions[data-v-785fd617] { display: flex; justify-content: space-between; gap: 10px; padding: 8px 10px;\n}\n.shelf-item-actions button[data-v-785fd617] { font-size: 12px; color: var(--reading-muted, #73716a); background: none; border: 0;\n}\n.shelf-item-actions button[data-v-785fd617]:hover { color: #9d503b;\n}\nbutton[data-v-785fd617]:focus-visible, a[data-v-785fd617]:focus-visible, input[data-v-785fd617]:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px;\n}\nbutton[data-v-785fd617]:disabled { opacity: .5;\n}\n@media (max-width: 1024px) {\n.full .shelf-grid[data-v-785fd617] { grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n}\n@media (max-width: 640px) {\n.full .shelf-grid[data-v-785fd617] { grid-template-columns: 1fr; gap: 16px;\n}\n.full[data-v-785fd617] { padding: 20px 16px;\n}\n.full .shelf-header h2[data-v-785fd617] { font-size: 24px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 285:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/Banner.vue?vue&type=template&id=5589a2e3&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.banners.length > 0 ? _c('div', {
    staticClass: "banner-container"
  }, [_vm._ssrNode("<div class=\"banner-swiper\" data-v-5589a2e3><div class=\"banner-wrapper\"" + _vm._ssrStyle(null, {
    transform: `translateX(-${_vm.currentSlide * 100}%)`
  }, null) + " data-v-5589a2e3>" + _vm._ssrList(_vm.banners, function (banner, index) {
    return "<div role=\"link\" tabindex=\"0\" class=\"banner-item\" data-v-5589a2e3><img" + _vm._ssrAttr("src", banner.image_url) + _vm._ssrAttr("alt", banner.title || 'banner') + " class=\"banner-image\" data-v-5589a2e3> " + (banner.title ? "<div class=\"banner-mask\" data-v-5589a2e3><div class=\"banner-title\" data-v-5589a2e3>" + _vm._ssrEscape(_vm._s(banner.title)) + "</div></div>" : "<!---->") + "</div>";
  }) + "</div> " + (_vm.banners.length > 1 ? "<div class=\"banner-pagination\" data-v-5589a2e3>" + _vm._ssrList(_vm.banners, function (_, index) {
    return "<span" + _vm._ssrClass(null, ['pagination-dot', {
      active: _vm.currentSlide === index
    }]) + " data-v-5589a2e3></span>";
  }) + "</div>" : "<!---->") + " " + (_vm.banners.length > 1 ? "<div class=\"banner-button-prev\" data-v-5589a2e3><span class=\"arrow\" data-v-5589a2e3>‹</span></div>" : "<!---->") + " " + (_vm.banners.length > 1 ? "<div class=\"banner-button-next\" data-v-5589a2e3><span class=\"arrow\" data-v-5589a2e3>›</span></div>" : "<!---->") + "</div>")]) : _vm._e();
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/Banner.vue?vue&type=template&id=5589a2e3&scoped=true

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(11);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Banner.vue?vue&type=script&lang=js

/* harmony default export */ var Bannervue_type_script_lang_js = ({
  name: 'Banner',
  props: {
    page: {
      type: String,
      default: 'library'
    },
    // 新增可配置项
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 8000
    },
    duration: {
      type: Number,
      default: 500
    },
    showDots: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      banners: [],
      currentSlide: 0,
      autoPlayInterval: null
    };
  },
  async created() {
    await this.getBanners();
  },
  methods: {
    async getBanners() {
      try {
        const response = await this.$api.novels.getBanners(this.page);
        this.banners = response || [];
        this.startAutoPlay();
      } catch (error) {
        console.error('获取Banner数据失败:', error);
        this.banners = [];
      }
    },
    navigateToBanner(banner) {
      const raw = banner.link_url_pc && banner.link_url_pc !== 'None' ? banner.link_url_pc : banner.link_url;
      const link = Object(reading_discovery["g" /* discoveryLink */])(raw, "https://m.loghome.ink");
      if (!link) return;
      if (link.external) window.open(link.href, '_blank', 'noopener,noreferrer');else this.$router.push(link.href);
    },
    // 设置轮播图当前显示的slide
    setSlide(index) {
      this.currentSlide = index;
    },
    // 切换到上一张轮播图
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      } else {
        // 循环到最后一张
        this.currentSlide = this.banners.length - 1;
      }
    },
    // 切换到下一张轮播图
    nextSlide() {
      if (this.currentSlide < this.banners.length - 1) {
        this.currentSlide++;
      } else {
        // 循环到第一张
        this.currentSlide = 0;
      }
    },
    // 启动自动播放
    startAutoPlay() {
      // 确保仅在客户端执行，并且有至少两个轮播项目时才启动轮播
      if (true) return;
      this.stopAutoPlay();
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, this.interval);
    },
    // 停止自动播放
    stopAutoPlay() {
      if (false) {}
    }
  },
  mounted() {
    // 仅在客户端执行
    if (false) {}
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    this.stopAutoPlay();
  }
});
// CONCATENATED MODULE: ./components/Banner.vue?vue&type=script&lang=js
 /* harmony default export */ var components_Bannervue_type_script_lang_js = (Bannervue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/Banner.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(236)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_Bannervue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "5589a2e3",
  "32ddc0b8"
  
)

/* harmony default export */ var Banner = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 286:
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
var WorkCard = __webpack_require__(171);

// EXTERNAL MODULE: ./components/LogPowerWordmark.vue + 4 modules
var LogPowerWordmark = __webpack_require__(191);

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(11);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(39);

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
  
  var style0 = __webpack_require__(240)
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

/***/ 287:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReadingShelf.vue?vue&type=template&id=785fd617&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "reading-shelf",
    class: {
      full: _vm.full
    },
    attrs: {
      "aria-label": "我的书架"
    }
  }, [_vm._ssrNode("<header class=\"shelf-header\" data-v-785fd617>", "</header>", [_vm._ssrNode("<h2 data-v-785fd617>我的书架</h2> "), !_vm.full ? _c('nuxt-link', {
    attrs: {
      "to": "/read/bookcase"
    }
  }, [_vm._v("全部 →")]) : _c('nuxt-link', {
    attrs: {
      "to": "/read"
    }
  }, [_vm._v("返回书库")])], 2), _vm._ssrNode(" <div class=\"shelf-toolbar\" data-v-785fd617><div class=\"shelf-tabs\" data-v-785fd617>" + _vm._ssrList(_vm.tabs, function (item) {
    return "<button" + _vm._ssrAttr("aria-pressed", _vm.tab === item.key) + _vm._ssrClass(null, {
      active: _vm.tab === item.key
    }) + " data-v-785fd617>" + _vm._ssrEscape(_vm._s(item.label)) + "</button>";
  }) + "</div> <button" + _vm._ssrAttr("disabled", _vm.loading) + " class=\"shelf-refresh\" data-v-785fd617>" + _vm._ssrEscape(_vm._s(_vm.loading ? '同步中…' : '刷新')) + "</button></div> " + (_vm.full ? "<label class=\"shelf-search\" data-v-785fd617>查找书架作品 <input type=\"search\" placeholder=\"书名或作者\"" + _vm._ssrAttr("value", _vm.keyword) + " data-v-785fd617></label>" : "<!---->") + " "), !_vm.loggedIn ? _vm._ssrNode("<p class=\"shelf-hint\" data-v-785fd617>", "</p>", [_c('nuxt-link', {
    attrs: {
      "to": "/login"
    }
  }, [_vm._v("登录")]), _vm._ssrNode("后同步收藏与阅读进度。")], 2) : _vm._e(), _vm._ssrNode(" "), _vm.error ? _vm._ssrNode("<p role=\"alert\" class=\"shelf-error\" data-v-785fd617>", "</p>", [_vm._ssrNode(_vm._ssrEscape(_vm._s(_vm.error) + " ")), _vm.authExpired ? _c('nuxt-link', {
    attrs: {
      "to": _vm.loginUrl
    }
  }, [_vm._v("重新登录")]) : _c('button', {
    on: {
      "click": _vm.load
    }
  }, [_vm._v("重试")])], 2) : _vm._e(), _vm._ssrNode(" "), _vm.visibleBooks.length ? _vm._ssrNode("<div class=\"shelf-grid\" data-v-785fd617>", "</div>", _vm._l(_vm.visibleBooks, function (book) {
    return _vm._ssrNode("<div class=\"shelf-item\" data-v-785fd617>", "</div>", [_c('WorkCard', {
      attrs: {
        "work": book,
        "compact": !_vm.full,
        "destination": _vm.resumeUrl(book)
      }
    }), _vm._ssrNode(" "), _vm.full ? _vm._ssrNode("<div class=\"shelf-item-actions\" data-v-785fd617>", "</div>", [_c('nuxt-link', {
      attrs: {
        "to": _vm.workUrl(book)
      }
    }, [_vm._v("作品详情")]), _vm._ssrNode(" " + (book.inShelf && _vm.loggedIn ? "<button" + _vm._ssrAttr("disabled", _vm.loading || !!_vm.removing || _vm.authExpired) + " data-v-785fd617>" + _vm._ssrEscape(_vm._s(_vm.removing === book.novel_id ? '处理中…' : '移出书架')) + "</button>" : "<!---->"))], 2) : _vm._e()], 2);
  }), 0) : _vm._ssrNode("<div class=\"shelf-empty\" data-v-785fd617>" + _vm._ssrEscape(_vm._s(_vm.loading ? '正在整理书架…' : _vm.keyword ? '没有找到匹配的作品。' : _vm.tab === 'history' ? '阅读过的作品会显示在这里。' : '收藏喜欢的作品，随时回来接着读。')) + "</div>"), _vm._ssrNode(" " + (!_vm.full && _vm.filteredBooks.length > 4 ? "<p class=\"shelf-count\" data-v-785fd617>" + _vm._ssrEscape("还有 " + _vm._s(_vm.filteredBooks.length - 4) + " 部作品在书架中") + "</p>" : "<!---->"))], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReadingShelf.vue?vue&type=template&id=785fd617&scoped=true

// EXTERNAL MODULE: ./utils/reader-position.js
var reader_position = __webpack_require__(192);

// EXTERNAL MODULE: ./components/read/WorkCard.vue + 4 modules
var WorkCard = __webpack_require__(171);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reading-history.js
var reading_history = __webpack_require__(41);

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(11);

// EXTERNAL MODULE: ./utils/login-return.js
var login_return = __webpack_require__(165);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReadingShelf.vue?vue&type=script&lang=js






function storageRead(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null') || fallback;
  } catch (_) {
    return fallback;
  }
}
/* harmony default export */ var ReadingShelfvue_type_script_lang_js = ({
  components: {
    WorkCard: WorkCard["a" /* default */]
  },
  props: {
    full: Boolean
  },
  data: () => ({
    tabs: [{
      key: 'all',
      label: '全部'
    }, {
      key: 'favorites',
      label: '收藏'
    }, {
      key: 'history',
      label: '最近阅读'
    }],
    tab: 'all',
    books: [],
    keyword: '',
    loading: true,
    error: '',
    loggedIn: false,
    version: 0,
    removing: null,
    account: null,
    identityVersion: 0,
    removeVersion: 0,
    authExpired: false
  }),
  computed: {
    filteredBooks() {
      const keyword = this.keyword.trim().toLowerCase();
      return this.books.filter(book => (this.tab !== 'favorites' || book.inShelf) && (this.tab !== 'history' || book.historyIndex != null) && (!keyword || `${book.name} ${book.author_name}`.toLowerCase().includes(keyword)));
    },
    visibleBooks() {
      return this.full ? this.filteredBooks : this.filteredBooks.slice(0, 4);
    },
    loginUrl() {
      return {
        path: '/login',
        query: {
          redirect: Object(login_return["a" /* loginReturnPath */])(this.$route.fullPath)
        }
      };
    }
  },
  mounted() {
    this.load();
    window.addEventListener('storage', this.onStorage);
    window.addEventListener('focus', this.checkAccount);
    window.addEventListener('auth-state-changed', this.checkAccount);
  },
  beforeDestroy() {
    this.version++;
    this.identityVersion++;
    this.removeVersion++;
    this.books = [];
    window.removeEventListener('storage', this.onStorage);
    window.removeEventListener('focus', this.checkAccount);
    window.removeEventListener('auth-state-changed', this.checkAccount);
  },
  methods: {
    workUrl: reading_discovery["n" /* workUrl */],
    checkAccount() {
      if (this.account === Object(reading["c" /* readingToken */])()) return false;
      this.load();
      return true;
    },
    expired(error) {
      return [401, 403].includes(Number(error && (error.status || error.response && error.response.status)));
    },
    clearExpiredShelf(token) {
      this.authExpired = true;
      this.books = [];
      this.error = '登录状态已过期，请重新登录后同步书架。';
      try {
        localStorage.removeItem(`loghome_pc_shelf_${Object(reading_history["c" /* readingAccountKey */])(token)}`);
      } catch (_) {}
    },
    onStorage(event) {
      if (event.key === 'token' || event.key === 'loghomeReaderHistory' || (event.key || '').startsWith('loghome_pc_history_')) this.load();
    },
    resumeUrl(book) {
      if (Number(book.last_article_id) > 0 && book.novel_type !== 'world') {
        return book.novel_type === 'manga' ? `/manga/read/${book.last_article_id}?novelId=${book.novel_id}&pageIdx=${Number(book.last_page_idx) || 0}` : Object(reader_position["e" /* textReaderResumeUrl */])(book);
      }
      return Object(reading_discovery["n" /* workUrl */])(book);
    },
    async load() {
      const token = Object(reading["c" /* readingToken */])();
      if (token !== this.account) {
        this.account = token;
        this.identityVersion++;
        this.removeVersion++;
        this.removing = null;
        this.keyword = '';
      }
      const version = ++this.version;
      this.loggedIn = !!token;
      this.loading = true;
      this.error = '';
      this.authExpired = false;
      this.books = [];
      const localHistory = Object(reading_history["a" /* localReadingHistory */])(token);
      if (!token) {
        this.books = Object(reading_discovery["j" /* mergeShelf */])([], localHistory);
        this.loading = false;
        return;
      }
      const key = `loghome_pc_shelf_${Object(reading_history["c" /* readingAccountKey */])(token)}`,
        cache = storageRead(key, null);
      this.books = cache && cache.version === 1 ? Object(reading_discovery["m" /* uniqueWorks */])(cache.books) : Object(reading_discovery["j" /* mergeShelf */])([], localHistory);
      const results = await Promise.allSettled([this.$api.reading.getShelf(), this.$api.reading.getHistory()]);
      if (version !== this.version || token !== Object(reading["c" /* readingToken */])()) return;
      if (results.some(result => result.status === 'rejected' && this.expired(result.reason))) {
        this.clearExpiredShelf(token);
        this.loading = false;
        return;
      }
      if (results.some(result => result.status === 'fulfilled' && !Array.isArray(result.value))) {
        this.error = '部分书架数据暂不可用，请重试。';
      }
      const likes = results[0].status === 'fulfilled' && Array.isArray(results[0].value) ? results[0].value : this.books.filter(book => book.inShelf);
      const cloudHistory = results[1].status === 'fulfilled' && Array.isArray(results[1].value) ? results[1].value : this.books.filter(book => book.historyIndex != null);
      const history = Object(reading_discovery["i" /* mergeReadingHistory */])(cloudHistory, localHistory);
      this.books = Object(reading_discovery["j" /* mergeShelf */])(likes, history);
      if (results.some(result => result.status === 'rejected')) this.error = '部分书架数据未能同步，已保留可用记录。';
      try {
        const checked = Object(reading_discovery["m" /* uniqueWorks */])(likes).map(book => {
          const record = history.find(item => item.novel_id === book.novel_id);
          let chapter = 0;
          chapter = Number((Object(reading_history["b" /* localReadingProgress */])(book.novel_id, token) || {}).last_article_chapter) || 0;
          return {
            novel_id: book.novel_id,
            latest_chapter: Math.max(chapter, Number((record || {}).last_article_chapter) || 0)
          };
        });
        const updates = checked.length ? await this.$api.reading.getUpdates(checked) : {
          updates: []
        };
        if (version !== this.version || token !== Object(reading["c" /* readingToken */])()) return;
        this.books = Object(reading_discovery["j" /* mergeShelf */])(likes, history, updates.updates);
        localStorage.setItem(key, JSON.stringify({
          version: 1,
          books: this.books
        }));
      } catch (_) {
        if (version === this.version && !this.error) this.error = '更新提示暂时不可用，作品仍可正常打开。';
      } finally {
        if (version === this.version) this.loading = false;
      }
    },
    async remove(book) {
      if (this.checkAccount()) return;
      if (!this.loggedIn || this.authExpired) {
        this.$router.push(this.loginUrl);
        return;
      }
      const id = Number(book && book.novel_id);
      if (!Number.isSafeInteger(id) || id < 1 || !this.books.some(row => Number(row.novel_id) === id && row.inShelf) || this.removing || this.loading) return;
      const token = this.account,
        identity = this.identityVersion,
        operation = ++this.removeVersion;
      const current = () => identity === this.identityVersion && operation === this.removeVersion && token === this.account && token === Object(reading["c" /* readingToken */])();
      this.removing = id;
      try {
        await this.$confirm('确定将这部作品移出书架？', '取消收藏', {
          type: 'warning'
        });
        if (!current() || !this.books.some(row => Number(row.novel_id) === id && row.inShelf)) return;
        await this.$api.reading.removeFavorite(id);
        if (current()) await this.load();
      } catch (error) {
        if (current() && error !== 'cancel' && error !== 'close') {
          if (this.expired(error)) this.clearExpiredShelf(token);else this.error = '未能移出书架，请重试。';
        }
      } finally {
        if (current()) this.removing = null;
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReadingShelf.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReadingShelfvue_type_script_lang_js = (ReadingShelfvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReadingShelf.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(242)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReadingShelfvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "785fd617",
  "7ea04c7c"
  
)

/* harmony default export */ var ReadingShelf = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 304:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(396);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("0d6c0792", content, true, context)
};

/***/ }),

/***/ 305:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(398);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("a5a7f34c", content, true, context)
};

/***/ }),

/***/ 390:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/category.5de7f60.png";

/***/ }),

/***/ 391:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/activity.cc8c077.png";

/***/ }),

/***/ 392:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/ranks.fc09bfc.png";

/***/ }),

/***/ 393:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/recommands.20e9088.png";

/***/ }),

/***/ 394:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/finish.3700fe7.png";

/***/ }),

/***/ 395:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BannerSwiper_vue_vue_type_style_index_0_id_53255f79_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(304);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BannerSwiper_vue_vue_type_style_index_0_id_53255f79_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BannerSwiper_vue_vue_type_style_index_0_id_53255f79_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BannerSwiper_vue_vue_type_style_index_0_id_53255f79_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BannerSwiper_vue_vue_type_style_index_0_id_53255f79_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 396:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".banner-section[data-v-53255f79]{background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.1);width:100%;max-width:100%;display:flex;flex-direction:column}.banner-section .swiper-container[data-v-53255f79]{position:relative;width:100%;height:280px;overflow:hidden;border-radius:8px 8px 0 0}@media(max-width: 768px){.banner-section .swiper-container[data-v-53255f79]{height:220px}}.banner-section .swiper-wrapper[data-v-53255f79]{display:flex;width:100%;height:100%;transition:transform .5s ease}.banner-section .swiper-slide[data-v-53255f79]{flex:0 0 100%;position:relative;cursor:pointer}.banner-section .swiper-slide .slide-content[data-v-53255f79]{position:relative;width:100%;height:100%}.banner-section .swiper-slide .slide-content img[data-v-53255f79]{width:100%;height:100%;object-fit:cover}.banner-section .swiper-slide .slide-content .slide-info[data-v-53255f79]{position:absolute;bottom:0;left:0;width:100%;padding:15px;background:linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);color:#fff}.banner-section .swiper-slide .slide-content .slide-info h3[data-v-53255f79]{margin:0 0 5px;font-size:18px}.banner-section .swiper-slide .slide-content .slide-info p[data-v-53255f79]{margin:0;font-size:14px;opacity:.8}.banner-section .swiper-pagination[data-v-53255f79]{position:absolute;bottom:15px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:10}.banner-section .swiper-pagination .pagination-bullet[data-v-53255f79]{width:10px;height:10px;border-radius:50%;background-color:hsla(0,0%,100%,.5);cursor:pointer;transition:all .3s ease}.banner-section .swiper-pagination .pagination-bullet.active[data-v-53255f79]{background-color:#fff;transform:scale(1.2)}.banner-section .swiper-button-prev[data-v-53255f79],.banner-section .swiper-button-next[data-v-53255f79]{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;background-color:rgba(214,214,214,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:all .3s ease;z-index:10}.banner-section .swiper-button-prev .arrow[data-v-53255f79],.banner-section .swiper-button-next .arrow[data-v-53255f79]{color:#fff;font-size:20px}.banner-section .swiper-button-prev[data-v-53255f79]{left:10px}.banner-section .swiper-button-next[data-v-53255f79]{right:10px}.banner-section .swiper-container:hover .swiper-button-prev[data-v-53255f79],.banner-section .swiper-container:hover .swiper-button-next[data-v-53255f79]{opacity:1}.banner-section .nav-section[data-v-53255f79]{display:flex;justify-content:space-around;padding:15px 0;background:linear-gradient(180deg, white, #fcf9e4);border-radius:0 0 8px 8px}.banner-section .nav-section .nav-button[data-v-53255f79]{display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:all .2s}.banner-section .nav-section .nav-button[data-v-53255f79]:hover{transform:translateY(-3px)}.banner-section .nav-section .nav-button img[data-v-53255f79]{width:45px;height:45px;object-fit:contain;margin-bottom:8px;filter:drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))}.banner-section .nav-section .nav-button span[data-v-53255f79]{font-size:14px;color:#333}@keyframes spin-53255f79{to{transform:rotate(360deg)}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 397:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_71631711_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(305);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_71631711_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_71631711_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_71631711_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_71631711_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 398:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\nbutton[data-v-71631711] { cursor: pointer; font: inherit;\n}\n.discovery-tags[data-v-71631711] { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 24px;\n}\n.discovery-tags a[data-v-71631711] { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--reading-line, #e4e3de); border-radius: 6px; padding: 10px 16px; background: var(--reading-surface, #fff); font-size: 13px; font-weight: 500; text-decoration: none; color: var(--reading-accent, #79573c); transition: background .18s ease;\n}\n.discovery-tags a[data-v-71631711]:hover { background: var(--reading-tint, #eee7de);\n}\n.discovery-tags img[data-v-71631711] { width: 18px; height: 18px; object-fit: contain;\n}\n.discovery-layout[data-v-71631711] { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 28px; align-items: start;\n}\n.discovery-main[data-v-71631711], .discovery-sidebar[data-v-71631711] { min-width: 0; display: grid; gap: 28px;\n}\n.discovery-sidebar[data-v-71631711] { align-self: start;\n}\n.discovery-block[data-v-71631711] { padding: 26px; border: 1px solid var(--reading-line, #e4e3de); background: var(--reading-surface, #fff); border-radius: 12px;\n}\n.block-header[data-v-71631711] { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 14px;\n}\n.block-header h2[data-v-71631711] { display: flex; align-items: center; gap: 6px; color: var(--reading-ink, #302f2a); font-size: 21px; font-weight: 600; letter-spacing: -.4px;\n}\n.block-header h2 img[data-v-71631711] { width: 20px; height: 20px; object-fit: contain; margin-right: 4px;\n}\n.block-header a[data-v-71631711], .block-header > span[data-v-71631711] { font-size: 13px; color: var(--reading-accent, #79573c); text-decoration: none;\n}\n.block-header > span[data-v-71631711] { color: var(--reading-muted, #73716a);\n}\n.discovery-works[data-v-71631711] { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 24px;\n}\n.discovery-loading[data-v-71631711] { padding: 40px 16px; text-align: center; color: var(--reading-muted, #73716a); font-size: 14px; line-height: 1.8;\n}\n.discovery-notice[data-v-71631711] { font-size: 13px; color: #9d503b; padding: 14px 0; line-height: 1.8;\n}\n.discovery-notice button[data-v-71631711] { color: var(--reading-accent, #79573c); background: none; border: none; text-decoration: underline;\n}\n.discovery-pagination[data-v-71631711] { display: flex; justify-content: center; margin-top: 26px; color: var(--reading-muted, #73716a); font-size: 13px;\n}\n.discovery-pagination button[data-v-71631711] { padding: 11px 28px; border: 1px solid var(--reading-line, #e4e3de); background: var(--reading-surface, #fff); color: var(--reading-accent, #79573c); border-radius: 6px;\n}\n.discovery-page-links[data-v-71631711] { display: flex; justify-content: center; gap: 24px; margin-top: 18px; font-size: 13px;\n}.discovery-page-links a[data-v-71631711] { color: var(--reading-accent, #79573c); text-decoration: none;\n}\n.discovery-sidebar .discovery-block[data-v-71631711] { padding: 22px;\n}\n.discovery-sidebar .block-header h2[data-v-71631711] { font-size: 18px;\n}\n.popular-tag-list[data-v-71631711] { display: flex; flex-wrap: wrap; gap: 8px;\n}\n.popular-tag-list a[data-v-71631711] { padding: 7px 10px; border-radius: 5px; background: var(--reading-hover, #f5f4f0); color: var(--reading-secondary, #615e57); font-size: 12px; text-decoration: none;\n}\n.popular-tag-list a[data-v-71631711]:hover { background: var(--reading-tint, #eee7de); color: var(--reading-accent, #79573c);\n}\n.popular-tag-list small[data-v-71631711] { color: var(--reading-muted, #73716a); margin-left: 4px; font-variant-numeric: tabular-nums;\n}\n.topic-links[data-v-71631711] { display: grid; gap: 16px;\n}\n.topic-links a[data-v-71631711] { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; line-height: 1.7; color: var(--reading-secondary, #615e57); text-decoration: none;\n}\n.sidebar-hint[data-v-71631711] { font-size: 13px; color: var(--reading-muted, #73716a);\n}\n.discovery-carousel[data-v-71631711] .swiper-container { height: clamp(190px, 17vw, 250px); border-radius: 12px; box-shadow: none;\n}\nbutton[data-v-71631711]:disabled { opacity: .5; cursor: wait;\n}\na[data-v-71631711]:focus-visible, button[data-v-71631711]:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px;\n}\n@media (min-width: 1440px) {\n.discovery-works[data-v-71631711] { grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n}\n@media (max-width: 1024px) {\n.discovery-layout[data-v-71631711] { grid-template-columns: minmax(0, 1fr);\n}\n.discovery-sidebar[data-v-71631711] { grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n}\n@media (max-width: 640px) {\n.discovery-works[data-v-71631711], .discovery-sidebar[data-v-71631711] { grid-template-columns: 1fr;\n}\n.discovery-block[data-v-71631711] { padding: 20px 16px;\n}\n.discovery-tags[data-v-71631711] { gap: 6px; margin-bottom: 18px;\n}\n.discovery-tags a[data-v-71631711] { padding: 9px 12px;\n}\n.block-header[data-v-71631711] { align-items: flex-start; flex-wrap: wrap;\n}\n.block-header h2[data-v-71631711] { font-size: 19px;\n}\n.discovery-main[data-v-71631711], .discovery-sidebar[data-v-71631711], .discovery-layout[data-v-71631711] { gap: 20px;\n}\n}\n@media (prefers-reduced-motion: reduce) {\n.discovery-tags a[data-v-71631711] { transition: none;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 557:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/index.vue?vue&type=template&id=71631711&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "reading-discovery"
  }, [_vm.requestedPage === 1 && _vm.configuredTags.length ? _vm._ssrNode("<nav aria-label=\"精选分类\" class=\"discovery-tags\" data-v-71631711>", "</nav>", [_vm._l(_vm.configuredTags, function (tag) {
    return [tag.link.external ? _vm._ssrNode("<a" + _vm._ssrAttr("href", tag.link.href) + " target=\"_blank\" rel=\"noopener noreferrer\"" + _vm._ssrStyle(null, {
      color: tag.tag_color
    }, null) + " data-v-71631711>", "</a>", [_vm._ssrNode((tag.tag_icon ? "<img" + _vm._ssrAttr("src", tag.tag_icon) + " alt data-v-71631711>" : "<!---->") + _vm._ssrEscape(_vm._s(tag.tag_name) + " ↗"))], 2) : _c('nuxt-link', {
      key: tag.tag_id,
      style: {
        color: tag.tag_color
      },
      attrs: {
        "to": tag.link.href
      }
    }, [tag.tag_icon ? _c('img', {
      attrs: {
        "src": tag.tag_icon,
        "alt": ""
      }
    }) : _vm._e(), _vm._v(_vm._s(tag.tag_name) + " →")])];
  })], 2) : _vm._e(), _vm._ssrNode(" " + (_vm.errors.tags ? "<p role=\"alert\" class=\"discovery-notice\" data-v-71631711>分类入口暂时未能加载。<button data-v-71631711>重试</button></p>" : "<!---->") + " "), _vm._ssrNode("<div class=\"discovery-layout\" data-v-71631711>", "</div>", [_vm._ssrNode("<div class=\"discovery-main\" data-v-71631711>", "</div>", [_vm.requestedPage === 1 && _vm.chartList.length ? _c('BannerSwiper', {
    staticClass: "discovery-carousel",
    attrs: {
      "chart-list": _vm.chartList,
      "show-navigation": false
    }
  }) : _vm._e(), _vm._ssrNode(" " + (_vm.errors.collections ? "<p role=\"alert\" class=\"discovery-notice\" data-v-71631711>推荐内容暂时未能更新，已保留可用内容。<button data-v-71631711>重试</button></p>" : "<!---->") + " " + (_vm.refreshing && !_vm.collections.length ? "<div class=\"discovery-loading\" data-v-71631711>正在寻找好作品…</div>" : "<!---->") + " "), _vm._l(_vm.requestedPage === 1 ? _vm.collections : [], function (block) {
    return [block.collection_title === '最近更新' ? _c('RankPanel', {
      key: block.collection_id,
      ref: "rankPanels",
      refInFor: true
    }) : block.collection_title === 'banner' ? _c('Banner', {
      key: block.collection_id,
      attrs: {
        "page": "library"
      }
    }) : block.novels.length || block.error ? _c('section', {
      key: block.collection_id,
      staticClass: "discovery-block"
    }, [_c('header', {
      staticClass: "block-header"
    }, [_c('h2', [block.icon ? _c('img', {
      attrs: {
        "src": block.icon,
        "alt": ""
      }
    }) : _vm._e(), block.collection_title.startsWith('原木力') ? [_c('LogPowerWordmark'), _vm._v(_vm._s(block.collection_title.slice(3)))] : [_vm._v(_vm._s(block.collection_title))]], 2), _vm._v(" "), _c('nuxt-link', {
      attrs: {
        "to": _vm.collectionUrl(block.collection_title)
      }
    }, [_vm._v("查看全部 →")])], 1), _vm._v(" "), block.error ? _c('p', {
      staticClass: "discovery-notice"
    }, [_vm._v("这个专题未能加载。"), _c('button', {
      on: {
        "click": function ($event) {
          return _vm.retryCollection(block);
        }
      }
    }, [_vm._v("重试")])]) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "discovery-works"
    }, _vm._l(block.novels, function (work, index) {
      return _c('WorkCard', {
        key: work.novel_id,
        attrs: {
          "work": work,
          "compact": block.collection_type !== 'cards',
          "rank": block.collection_type === 'dense_card' ? index + 1 : 0
        }
      });
    }), 1)]) : _vm._e()];
  }), _vm._ssrNode(" "), _vm._ssrNode("<section aria-label=\"更多作品\" class=\"discovery-block\" data-v-71631711>", "</section>", [_vm._ssrNode("<header class=\"block-header\" data-v-71631711><h2 data-v-71631711>更多作品</h2><span data-v-71631711>小说 · 漫画 · 世界设定</span></header> "), _vm.feedLoading && !_vm.books.length ? _vm._ssrNode("<div class=\"discovery-loading\" data-v-71631711>", "</div>", [_vm._ssrNode("正在加载作品…")], 2) : _vm.books.length ? _vm._ssrNode("<div class=\"discovery-works\" data-v-71631711>", "</div>", _vm._l(_vm.books, function (work) {
    return _c('WorkCard', {
      key: work.novel_id,
      attrs: {
        "work": work
      }
    });
  }), 1) : !_vm.errors.feed ? _vm._ssrNode("<p class=\"discovery-loading\" data-v-71631711>暂时还没有公开作品。</p>") : _vm._e(), _vm._ssrNode(" " + (_vm.errors.feed ? "<p role=\"alert\" class=\"discovery-notice\" data-v-71631711>" + _vm._ssrEscape(_vm._s(_vm.errors.feed) + " ") + "<button data-v-71631711>重试</button></p>" : "<!---->") + " " + (_vm.books.length ? "<div class=\"discovery-pagination\" data-v-71631711>" + (_vm.hasMore ? "<button" + _vm._ssrAttr("disabled", _vm.feedLoading) + " data-v-71631711>" + _vm._ssrEscape(_vm._s(_vm.feedLoading ? '加载中…' : '加载更多作品')) + "</button>" : "<span data-v-71631711>已显示全部作品</span>") + "</div>" : "<!---->") + " "), _vm._ssrNode("<nav aria-label=\"作品分页\" class=\"discovery-page-links\" data-v-71631711>", "</nav>", [_vm.requestedPage > 1 ? _c('nuxt-link', {
    attrs: {
      "to": {
        path: '/read',
        query: _vm.requestedPage > 2 ? {
          page: _vm.requestedPage - 1
        } : {}
      },
      "rel": "prev"
    }
  }, [_vm._v("上一页")]) : _vm._e(), _vm.hasMore ? _c('nuxt-link', {
    attrs: {
      "to": {
        path: '/read',
        query: {
          page: _vm.page + 1
        }
      },
      "rel": "next"
    }
  }, [_vm._v("第 " + _vm._s(_vm.page + 1) + " 页 →")]) : _vm._e()], 1)], 2)], 2), _vm._ssrNode(" "), _vm._ssrNode("<aside aria-label=\"阅读侧栏\" class=\"discovery-sidebar\" data-v-71631711>", "</aside>", [_c('ReadingShelf', {
    ref: "shelf"
  }), _vm._ssrNode(" "), _vm._ssrNode("<section class=\"discovery-block\" data-v-71631711>", "</section>", [_vm._ssrNode("<header class=\"block-header\" data-v-71631711>", "</header>", [_vm._ssrNode("<h2 data-v-71631711>热门标签</h2>"), _c('nuxt-link', {
    attrs: {
      "to": "/tags"
    }
  }, [_vm._v("全部 →")])], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"popular-tag-list\" data-v-71631711>", "</div>", _vm._l(_vm.popularTags, function (tag) {
    return _c('nuxt-link', {
      key: tag.tag_id,
      attrs: {
        "to": `/tag/collections?tag_id=${tag.tag_id}`
      }
    }, [_vm._v(_vm._s(tag.tag_name) + " "), _c('small', [_vm._v(_vm._s(tag.count))])]);
  }), 1), _vm._ssrNode(" " + (!_vm.popularTags.length ? "<p class=\"sidebar-hint\" data-v-71631711>" + _vm._ssrEscape(_vm._s(_vm.errors.tags ? '标签暂时不可用' : '暂时没有标签')) + "</p>" : "<!---->"))], 2), _vm._ssrNode(" "), _vm.recommendationLinks.length ? _vm._ssrNode("<section class=\"discovery-block\" data-v-71631711>", "</section>", [_vm._ssrNode("<header class=\"block-header\" data-v-71631711><h2 data-v-71631711>推荐专题</h2></header> "), _vm._ssrNode("<nav class=\"topic-links\" data-v-71631711>", "</nav>", _vm._l(_vm.recommendationLinks, function (block) {
    return _c('nuxt-link', {
      key: block.collection_id,
      attrs: {
        "to": _vm.collectionUrl(block.collection_title)
      }
    }, [_vm._v(_vm._s(block.collection_title) + " "), _c('span', [_vm._v("→")])]);
  }), 1)], 2) : _vm._e()], 2)], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/index.vue?vue&type=template&id=71631711&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/BannerSwiper.vue?vue&type=template&id=53255f79&scoped=true
var BannerSwipervue_type_template_id_53255f79_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "banner-section"
  }, [_vm.chartList.length > 0 ? _vm._ssrNode("<div class=\"swiper-container\" data-v-53255f79>", "</div>", [_vm._ssrNode("<div class=\"swiper-wrapper\"" + _vm._ssrStyle(null, {
    transform: `translateX(-${_vm.currentSlide * 100}%)`
  }, null) + " data-v-53255f79>", "</div>", _vm._l(_vm.chartList, function (item, index) {
    return _vm._ssrNode("<div role=\"link\" tabindex=\"0\" class=\"swiper-slide\" data-v-53255f79>", "</div>", [_vm._ssrNode("<div class=\"slide-content\" data-v-53255f79>", "</div>", [_vm._ssrNode("<img" + _vm._ssrAttr("src", item.img) + _vm._ssrAttr("alt", item.title) + " data-v-53255f79> "), _vm._ssrNode("<div class=\"slide-info\" data-v-53255f79>", "</div>", [_vm._ssrNode("<h3 data-v-53255f79>", "</h3>", [(item.title || '').startsWith('原木力') ? [_c('LogPowerWordmark'), _vm._ssrNode(_vm._ssrEscape(_vm._s(item.title.slice(3))))] : _vm._ssrNode(_vm._ssrEscape(_vm._s(item.title)))], 2), _vm._ssrNode(" <p data-v-53255f79>" + _vm._ssrEscape(_vm._s(item.Subtitle)) + "</p>")], 2)], 2)]);
  }), 0), _vm._ssrNode(" " + (_vm.chartList.length > 1 ? "<div class=\"swiper-pagination\" data-v-53255f79>" + _vm._ssrList(_vm.chartList, function (_, index) {
    return "<span" + _vm._ssrClass(null, ['pagination-bullet', {
      active: _vm.currentSlide === index
    }]) + " data-v-53255f79></span>";
  }) + "</div>" : "<!---->") + " " + (_vm.chartList.length > 1 ? "<div class=\"swiper-button-prev\" data-v-53255f79><span class=\"arrow\" data-v-53255f79>❮</span></div>" : "<!---->") + " " + (_vm.chartList.length > 1 ? "<div class=\"swiper-button-next\" data-v-53255f79><span class=\"arrow\" data-v-53255f79>❯</span></div>" : "<!---->"))], 2) : _vm._e(), _vm._ssrNode(" " + (_vm.showNavigation ? "<div class=\"nav-section\" data-v-53255f79><div class=\"nav-button\" data-v-53255f79><img" + _vm._ssrAttr("src", __webpack_require__(390)) + " alt=\"标签\" data-v-53255f79> <span data-v-53255f79>标签</span></div> <div class=\"nav-button\" data-v-53255f79><img" + _vm._ssrAttr("src", __webpack_require__(391)) + " alt=\"活动\" data-v-53255f79> <span data-v-53255f79>活动</span></div> <div class=\"nav-button\" data-v-53255f79><img" + _vm._ssrAttr("src", __webpack_require__(392)) + " alt=\"排行\" data-v-53255f79> <span data-v-53255f79>排行</span></div> <div class=\"nav-button\" data-v-53255f79><img" + _vm._ssrAttr("src", __webpack_require__(393)) + " alt=\"推荐\" data-v-53255f79> <span data-v-53255f79>推荐</span></div> <div class=\"nav-button\" data-v-53255f79><img" + _vm._ssrAttr("src", __webpack_require__(394)) + " alt=\"完结\" data-v-53255f79> <span data-v-53255f79>完结</span></div></div>" : "<!---->"))], 2);
};
var BannerSwipervue_type_template_id_53255f79_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/BannerSwiper.vue?vue&type=template&id=53255f79&scoped=true

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(11);

// EXTERNAL MODULE: ./components/LogPowerWordmark.vue + 4 modules
var LogPowerWordmark = __webpack_require__(191);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/BannerSwiper.vue?vue&type=script&lang=js


/* harmony default export */ var BannerSwipervue_type_script_lang_js = ({
  components: {
    LogPowerWordmark: LogPowerWordmark["a" /* default */]
  },
  name: 'BannerSwiper',
  props: {
    showNavigation: {
      type: Boolean,
      default: true
    },
    chartList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentSlide: 0,
      autoPlayInterval: null
    };
  },
  methods: {
    // 轮播图点击事件处理
    roulousChartClicked(item) {
      const link = Object(reading_discovery["g" /* discoveryLink */])(item.navigate_to, "https://m.loghome.ink");
      if (!link) return;
      if (link.external) window.open(link.href, '_blank', 'noopener,noreferrer');else this.$router.push(link.href);
    },
    // 导航栏点击事件处理
    navBarJump(section) {
      switch (section) {
        case "标签":
          this.$router.push('/tags');
          break;
        case "活动":
          this.gotoCollections("干草块杯活动专辑");
          break;
        case "排行":
          this.gotoCollections("原木力爆棚");
          break;
        case "推荐":
          this.gotoCollections("原木力飙升");
          break;
        case "完结":
          this.gotoCollections("入站必读");
          break;
      }
    },
    // 前往专题集合页面
    gotoCollections(collectionTitle) {
      console.log('BannerSwiper准备跳转到集合页面:', collectionTitle);
      // 确保标题是字符串并且不为空
      if (!collectionTitle || typeof collectionTitle !== 'string') {
        console.error('无效的集合标题:', collectionTitle);
        return;
      }
      try {
        const encodedTitle = encodeURIComponent(collectionTitle.trim());
        const url = `/read/collections?title=${encodedTitle}`;
        console.log('跳转URL:', url);
        this.$router.push(url);
      } catch (error) {
        console.error('跳转集合页面失败:', error);
      }
    },
    // 设置轮播图当前显示的slide
    setSlide(index) {
      this.currentSlide = index;
    },
    // 切换到上一张轮播图
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      } else {
        // 循环到最后一张
        this.currentSlide = this.chartList.length - 1;
      }
    },
    // 切换到下一张轮播图
    nextSlide() {
      if (this.currentSlide < this.chartList.length - 1) {
        this.currentSlide++;
      } else {
        // 循环到第一张
        this.currentSlide = 0;
      }
    },
    // 启动自动播放
    startAutoPlay() {
      // 确保仅在客户端执行，并且有至少两个轮播项目时才启动轮播
      if (true) return;
      this.stopAutoPlay();
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, 5000); // 5秒切换一次
    },
    // 停止自动播放
    stopAutoPlay() {
      if (false) {}
    }
  },
  mounted() {
    // 仅在客户端执行
    if (false) {}
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    this.stopAutoPlay();
  }
});
// CONCATENATED MODULE: ./components/read/BannerSwiper.vue?vue&type=script&lang=js
 /* harmony default export */ var read_BannerSwipervue_type_script_lang_js = (BannerSwipervue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/BannerSwiper.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(395)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_BannerSwipervue_type_script_lang_js,
  BannerSwipervue_type_template_id_53255f79_scoped_true_render,
  BannerSwipervue_type_template_id_53255f79_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "53255f79",
  "62a22542"
  
)

/* harmony default export */ var BannerSwiper = (component.exports);
// EXTERNAL MODULE: ./components/Banner.vue + 4 modules
var Banner = __webpack_require__(285);

// EXTERNAL MODULE: ./components/read/WorkCard.vue + 4 modules
var WorkCard = __webpack_require__(171);

// EXTERNAL MODULE: ./components/read/RankPanel.vue + 4 modules
var RankPanel = __webpack_require__(286);

// EXTERNAL MODULE: ./components/read/ReadingShelf.vue + 4 modules
var ReadingShelf = __webpack_require__(287);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(39);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/index.vue?vue&type=script&lang=js








const CACHE_KEY = 'loghome_pc_library_v1';
/* harmony default export */ var readvue_type_script_lang_js = ({
  components: {
    BannerSwiper: BannerSwiper,
    Banner: Banner["a" /* default */],
    LogPowerWordmark: LogPowerWordmark["a" /* default */],
    WorkCard: WorkCard["a" /* default */],
    RankPanel: RankPanel["a" /* default */],
    ReadingShelf: ReadingShelf["a" /* default */]
  },
  head() {
    return Object(reading_seo["d" /* readingHead */])({
      title: `${this.requestedPage > 1 ? `公开作品 第 ${this.requestedPage} 页` : '阅读书库'} - 原木社区`,
      description: '浏览原木社区最新小说、漫画与世界设定，查看推荐专题和作品排行榜。',
      path: '/read',
      query: this.$route.query,
      schema: Object(reading_seo["g" /* workListSchema */])(this.books, '原木社区公开作品', (this.requestedPage - 1) * this.pageSize),
      noindex: this.requestedPage > 1 && !this.books.length || !!this.errors.feed && !this.books.length
    });
  },
  data: () => ({
    indexTags: [],
    tags: [],
    chartList: [],
    collections: [],
    books: [],
    page: 1,
    pageSize: 24,
    refreshing: false,
    feedLoading: false,
    hasMore: false,
    version: 0,
    feedVersion: 0,
    failedFeedPage: 1,
    errors: {
      tags: false,
      collections: false,
      feed: ''
    }
  }),
  async fetch() {
    await this.loadDiscovery();
  },
  computed: {
    requestedPage() {
      return Object(reading_seo["e" /* readingPage */])(this.$route.query.page);
    },
    configuredTags() {
      return this.indexTags.map(tag => ({
        ...tag,
        link: Object(reading_discovery["g" /* discoveryLink */])(tag.jump_url_pc && tag.jump_url_pc !== 'None' ? tag.jump_url_pc : tag.jump_url, "https://m.loghome.ink")
      })).filter(tag => tag.link);
    },
    popularTags() {
      return [...this.tags].sort((a, b) => Number(b.count) - Number(a.count)).slice(0, 16);
    },
    recommendationLinks() {
      return this.collections.filter(block => !['banner', '最近更新'].includes(block.collection_title));
    }
  },
  watch: {
    requestedPage() {
      this.books = [];
      this.loadDiscovery();
    }
  },
  mounted() {
    if (this.errors.collections || this.errors.feed || this.errors.tags) this.restoreCache();else this.persistCache();
  },
  beforeDestroy() {
    this.version++;
    this.feedVersion++;
  },
  methods: {
    collectionUrl: reading_discovery["e" /* collectionUrl */],
    async loadDiscovery() {
      const version = ++this.version;
      ++this.feedVersion;
      const firstPage = this.requestedPage;
      this.refreshing = true;
      this.feedLoading = true;
      this.failedFeedPage = firstPage;
      const results = await Promise.allSettled([this.$api.reading.getIndexTags(), this.$api.reading.getTags(), this.$api.reading.getCollections(), this.$api.reading.getBooks(firstPage, this.pageSize), this.$api.novels.getLibraryRoulousChart()]);
      if (version !== this.version) return;
      this.errors.tags = results[0].status === 'rejected' || results[1].status === 'rejected';
      if (results[0].status === 'fulfilled') this.indexTags = Object(reading_discovery["d" /* asList */])(results[0].value);
      if (results[1].status === 'fulfilled') this.tags = Object(reading_discovery["d" /* asList */])(results[1].value);
      if (results[4].status === 'fulfilled') this.chartList = Object(reading_discovery["d" /* asList */])(results[4].value).filter(item => Number(item.isValid) === 1).map(item => ({
        img: item.image,
        title: item.title || '',
        Subtitle: item.name,
        navigate_to: item.navigate_to_pc && item.navigate_to_pc !== 'None' ? item.navigate_to_pc : item.navigate_to
      }));
      if (results[3].status === 'fulfilled') {
        const rawBooks = Object(reading_discovery["d" /* asList */])(results[3].value);
        this.books = Object(reading_discovery["m" /* uniqueWorks */])(rawBooks);
        this.page = firstPage;
        this.hasMore = rawBooks.length >= this.pageSize;
        this.errors.feed = '';
        if (firstPage > 1 && !rawBooks.length) Object(reading_seo["f" /* readingResponseStatus */])(this, 404);
      } else {
        this.errors.feed = '作品列表加载失败，请重试。';
        if (firstPage > 1) Object(reading_seo["f" /* readingResponseStatus */])(this, 503);
      }
      this.feedLoading = false;
      this.errors.collections = results[2].status === 'rejected';
      if (firstPage === 1 && results[2].status === 'fulfilled') {
        const previous = this.collections;
        const blocks = await Promise.all(Object(reading_discovery["c" /* activeCollections */])(results[2].value).map(async block => {
          if (['banner', '最近更新'].includes(block.collection_title)) return {
            ...block,
            novels: [],
            error: false
          };
          try {
            return {
              ...block,
              novels: Object(reading_discovery["m" /* uniqueWorks */])(await this.$api.reading.getCollectionBooks(block.collection_title, 1, 12)),
              error: false
            };
          } catch (_) {
            return {
              ...block,
              novels: (previous.find(item => item.collection_id === block.collection_id) || {}).novels || [],
              error: true
            };
          }
        }));
        if (version !== this.version) return;
        this.collections = blocks;
      }
      this.refreshing = false;
      if (!this.errors.collections && !this.errors.feed) this.persistCache();
    },
    async retryCollection(block) {
      const version = this.version;
      try {
        const books = await this.$api.reading.getCollectionBooks(block.collection_title, 1, 12);
        if (version !== this.version) return;
        this.$set(block, 'novels', Object(reading_discovery["m" /* uniqueWorks */])(books));
        this.$set(block, 'error', false);
        this.persistCache();
      } catch (_) {
        if (version === this.version) this.$set(block, 'error', true);
      }
    },
    async loadMore() {
      if (this.feedLoading || !this.hasMore || this.refreshing) return;
      const version = this.feedVersion,
        next = this.page + 1;
      this.feedLoading = true;
      this.errors.feed = '';
      this.failedFeedPage = next;
      try {
        const books = Object(reading_discovery["d" /* asList */])(await this.$api.reading.getBooks(next, this.pageSize));
        if (version !== this.feedVersion) return;
        this.books = Object(reading_discovery["m" /* uniqueWorks */])([...this.books, ...books]);
        this.page = next;
        this.hasMore = books.length >= this.pageSize;
      } catch (_) {
        if (version === this.feedVersion) this.errors.feed = '下一页加载失败，已有作品已保留。';
      } finally {
        if (version === this.feedVersion) this.feedLoading = false;
      }
    },
    retryFeed() {
      return this.failedFeedPage > this.requestedPage ? this.loadMore() : this.loadDiscovery();
    },
    persistCache() {
      if (true) return;
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          version: 1,
          savedAt: Date.now(),
          indexTags: this.indexTags,
          tags: this.tags,
          chartList: this.chartList,
          collections: this.collections,
          books: this.books.slice(0, this.pageSize),
          hasMore: this.books.length >= this.pageSize
        }));
      } catch (_) {}
    },
    restoreCache() {
      if (this.requestedPage !== 1) return;
      try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
        if (!cache || cache.version !== 1 || Date.now() - cache.savedAt > 86400000) return;
        if (this.errors.collections) this.collections = Object(reading_discovery["c" /* activeCollections */])(cache.collections).map(block => ({
          ...block,
          novels: Object(reading_discovery["m" /* uniqueWorks */])(block.novels)
        }));
        if (this.errors.feed) {
          this.books = Object(reading_discovery["m" /* uniqueWorks */])(cache.books);
          this.page = 1;
          this.hasMore = !!cache.hasMore;
        }
        if (this.errors.tags) {
          this.tags = Object(reading_discovery["d" /* asList */])(cache.tags);
          this.indexTags = Object(reading_discovery["d" /* asList */])(cache.indexTags);
        }
        if (!this.chartList.length) this.chartList = Object(reading_discovery["d" /* asList */])(cache.chartList);
      } catch (_) {}
    }
  }
});
// CONCATENATED MODULE: ./pages/read/index.vue?vue&type=script&lang=js
 /* harmony default export */ var pages_readvue_type_script_lang_js = (readvue_type_script_lang_js); 
// CONCATENATED MODULE: ./pages/read/index.vue



function read_injectStyles (context) {
  
  var style0 = __webpack_require__(397)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var read_component = Object(componentNormalizer["a" /* default */])(
  pages_readvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  read_injectStyles,
  "71631711",
  "6ec99842"
  
)

/* harmony default export */ var read = __webpack_exports__["default"] = (read_component.exports);

/***/ })

};;
//# sourceMappingURL=index.js.map