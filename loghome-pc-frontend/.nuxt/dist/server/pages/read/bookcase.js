exports.ids = [22];
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

/***/ 135:
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)["URL"]))

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

/***/ 156:
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)["URLSearchParams"]))

/***/ }),

/***/ 166:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(195);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("1a6d9f55", content, true, context)
};

/***/ }),

/***/ 194:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReadingShelf_vue_vue_type_style_index_0_id_785fd617_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(166);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReadingShelf_vue_vue_type_style_index_0_id_785fd617_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReadingShelf_vue_vue_type_style_index_0_id_785fd617_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReadingShelf_vue_vue_type_style_index_0_id_785fd617_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReadingShelf_vue_vue_type_style_index_0_id_785fd617_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reading-shelf[data-v-785fd617] { padding: 22px; border-radius: 12px; background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de);\n}\n.shelf-header[data-v-785fd617] { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px;\n}\n.shelf-header h2[data-v-785fd617] { font-size: 18px; font-weight: 600; color: var(--reading-ink, #302f2a); letter-spacing: -.3px;\n}\n.shelf-header a[data-v-785fd617], .shelf-hint a[data-v-785fd617], .shelf-item-actions a[data-v-785fd617] { font-size: 13px; color: var(--reading-accent, #79573c); text-decoration: none;\n}\n.shelf-toolbar[data-v-785fd617] { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 8px;\n}\n.shelf-tabs[data-v-785fd617] { display: flex; gap: 2px;\n}\nbutton[data-v-785fd617] { cursor: pointer; font: inherit;\n}\n.shelf-tabs button[data-v-785fd617] { padding: 7px 8px; font-size: 12px; color: var(--reading-muted, #73716a); background: none; border: 0; border-radius: 5px; white-space: nowrap;\n}\n.shelf-tabs .active[data-v-785fd617] { color: var(--reading-accent, #79573c); background: var(--reading-tint, #eee7de); font-weight: 600;\n}\n.shelf-refresh[data-v-785fd617] { padding: 6px 0 6px 6px; font-size: 12px; background: none; border: 0; color: var(--reading-muted, #73716a); white-space: nowrap;\n}\n.shelf-grid[data-v-785fd617] { display: grid; gap: 4px;\n}\n.shelf-item[data-v-785fd617] { min-width: 0;\n}\n.full[data-v-785fd617] { padding: 32px; min-height: 60vh;\n}\n.full .shelf-header[data-v-785fd617] { padding-bottom: 20px; border-bottom: 1px solid var(--reading-line, #e4e3de);\n}\n.full .shelf-header h2[data-v-785fd617] { font-size: 28px;\n}\n.full .shelf-grid[data-v-785fd617] { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px 28px;\n}\n.full .shelf-tabs button[data-v-785fd617] { font-size: 14px; padding: 9px 14px;\n}\n.shelf-empty[data-v-785fd617] { padding: 40px 12px; color: var(--reading-muted, #73716a); font-size: 14px; line-height: 1.8; text-align: center;\n}\n.shelf-hint[data-v-785fd617], .shelf-count[data-v-785fd617] { font-size: 12px; color: var(--reading-muted, #73716a); margin: 16px 0 0; line-height: 1.8;\n}\n.shelf-error[data-v-785fd617] { font-size: 13px; color: #9d503b; line-height: 1.8; margin-bottom: 12px;\n}\n.shelf-error button[data-v-785fd617] { color: var(--reading-accent, #79573c); border: 0; background: none; text-decoration: underline;\n}\n.shelf-search[data-v-785fd617] { display: flex; gap: 14px; align-items: center; font-size: 13px; color: var(--reading-secondary, #615e57); margin: 20px 0 24px; flex-wrap: wrap;\n}\n.shelf-search input[data-v-785fd617] { border: 1px solid var(--reading-line, #e4e3de); background: var(--reading-hover, #f5f4f0); border-radius: 6px; padding: 11px 14px; width: min(320px, 100%); font: inherit; color: var(--reading-ink, #302f2a);\n}\n.shelf-item-actions[data-v-785fd617] { display: flex; justify-content: space-between; gap: 10px; padding: 8px 10px;\n}\n.shelf-item-actions button[data-v-785fd617] { font-size: 12px; color: var(--reading-muted, #73716a); background: none; border: 0;\n}\n.shelf-item-actions button[data-v-785fd617]:hover { color: #9d503b;\n}\nbutton[data-v-785fd617]:focus-visible, a[data-v-785fd617]:focus-visible, input[data-v-785fd617]:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px;\n}\nbutton[data-v-785fd617]:disabled { opacity: .5;\n}\n@media (max-width: 1024px) {\n.full .shelf-grid[data-v-785fd617] { grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n}\n@media (max-width: 640px) {\n.full .shelf-grid[data-v-785fd617] { grid-template-columns: 1fr; gap: 16px;\n}\n.full[data-v-785fd617] { padding: 20px 16px;\n}\n.full .shelf-header h2[data-v-785fd617] { font-size: 24px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 221:
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
var reader_position = __webpack_require__(156);

// EXTERNAL MODULE: ./components/read/WorkCard.vue + 4 modules
var WorkCard = __webpack_require__(136);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reading-history.js
var reading_history = __webpack_require__(35);

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(10);

// EXTERNAL MODULE: ./utils/login-return.js
var login_return = __webpack_require__(135);

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
  
  var style0 = __webpack_require__(194)
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

/***/ 430:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/bookcase.vue?vue&type=template&id=e4bc6ed8
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('ReadingShelf', {
    attrs: {
      "full": ""
    }
  });
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/bookcase.vue?vue&type=template&id=e4bc6ed8

// EXTERNAL MODULE: ./components/read/ReadingShelf.vue + 4 modules
var ReadingShelf = __webpack_require__(221);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/bookcase.vue?vue&type=script&lang=js

/* harmony default export */ var bookcasevue_type_script_lang_js = ({
  components: {
    ReadingShelf: ReadingShelf["a" /* default */]
  },
  head: () => ({
    title: '我的书架 - 原木社区',
    meta: [{
      hid: 'robots',
      name: 'robots',
      content: 'noindex,follow'
    }]
  })
});
// CONCATENATED MODULE: ./pages/read/bookcase.vue?vue&type=script&lang=js
 /* harmony default export */ var read_bookcasevue_type_script_lang_js = (bookcasevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/read/bookcase.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_bookcasevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  "68321a4e"
  
)

/* harmony default export */ var bookcase = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=bookcase.js.map