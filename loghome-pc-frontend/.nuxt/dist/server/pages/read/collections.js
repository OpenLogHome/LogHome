exports.ids = [23];
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

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(199);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("5dea3534", content, true, context)
};

/***/ }),

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCollection_vue_vue_type_style_index_0_id_3d4a479e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(167);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCollection_vue_vue_type_style_index_0_id_3d4a479e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCollection_vue_vue_type_style_index_0_id_3d4a479e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCollection_vue_vue_type_style_index_0_id_3d4a479e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorkCollection_vue_vue_type_style_index_0_id_3d4a479e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 199:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.work-collection[data-v-3d4a479e] { margin: 0 auto; padding: 32px; min-height: 70vh; background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de); border-radius: 12px;\n}\nheader[data-v-3d4a479e] { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding-bottom: 24px; border-bottom: 1px solid var(--reading-line, #e4e3de);\n}\nheader p[data-v-3d4a479e] { margin-bottom: 8px; font-size: 13px; color: var(--reading-muted, #73716a);\n}\nh1[data-v-3d4a479e] { font-size: 28px; line-height: 1.4; font-weight: 600; letter-spacing: -.5px; color: var(--reading-ink, #302f2a);\n}\nheader a[data-v-3d4a479e] { font-size: 13px; color: var(--reading-accent, #79573c); text-decoration: none; flex-shrink: 0;\n}\n.toolbar[data-v-3d4a479e] { display: flex; align-items: center; justify-content: space-between; margin: 20px 0; font-size: 13px; color: var(--reading-muted, #73716a);\n}\nbutton[data-v-3d4a479e] { font: inherit; cursor: pointer; border: 1px solid var(--reading-line, #e4e3de); border-radius: 6px; background: var(--reading-surface, #fff); padding: 9px 18px; color: var(--reading-accent, #79573c);\n}\n.grid[data-v-3d4a479e] { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px 28px;\n}\n.empty[data-v-3d4a479e], .more[data-v-3d4a479e] { text-align: center; padding: 40px 16px; font-size: 14px; line-height: 1.8; color: var(--reading-muted, #73716a);\n}\n.page-links[data-v-3d4a479e] { display: flex; justify-content: center; gap: 24px; font-size: 13px;\n}.page-links a[data-v-3d4a479e] { color: var(--reading-accent, #79573c); text-decoration: none;\n}\n.notice[data-v-3d4a479e] { background: #faf0e9; border-radius: 6px; padding: 16px; margin-bottom: 18px; color: #9d503b; font-size: 13px; line-height: 1.8;\n}\nbutton[data-v-3d4a479e]:disabled { opacity: .5;\n}\nbutton[data-v-3d4a479e]:focus-visible, a[data-v-3d4a479e]:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px;\n}\n@media (max-width: 1024px) {\n.grid[data-v-3d4a479e] { grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n}\n@media (max-width: 640px) {\n.grid[data-v-3d4a479e] { grid-template-columns: 1fr;\n}\n.work-collection[data-v-3d4a479e] { padding: 20px 16px;\n}\nheader[data-v-3d4a479e] { align-items: flex-start; flex-wrap: wrap; gap: 12px;\n}\nh1[data-v-3d4a479e] { font-size: 24px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 222:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/WorkCollection.vue?vue&type=template&id=3d4a479e&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "work-collection"
  }, [_vm._ssrNode("<header data-v-3d4a479e>", "</header>", [_vm._ssrNode("<div data-v-3d4a479e><p data-v-3d4a479e>" + _vm._ssrEscape(_vm._s(_vm.tagId ? '按标签发现' : '精选专题')) + "</p><h1 data-v-3d4a479e>" + _vm._ssrEscape(_vm._s(_vm.heading)) + "</h1></div>"), _c('nuxt-link', {
    attrs: {
      "to": _vm.tagId ? '/tags' : '/read'
    }
  }, [_vm._v(_vm._s(_vm.tagId ? '所有标签' : '返回书库') + " →")])], 2), _vm._ssrNode(" <div class=\"toolbar\" data-v-3d4a479e><span data-v-3d4a479e>" + _vm._ssrEscape(_vm._s(_vm.tagId ? `${_vm.books.length} 部作品` : '小说 · 漫画 · 世界')) + "</span><button" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-3d4a479e>刷新</button></div> " + (_vm.error ? "<p role=\"alert\" class=\"notice\" data-v-3d4a479e>" + _vm._ssrEscape(_vm._s(_vm.error) + " ") + "<button data-v-3d4a479e>重试</button></p>" : "<!---->") + " "), _vm.visibleBooks.length ? _vm._ssrNode("<div class=\"grid\" data-v-3d4a479e>", "</div>", _vm._l(_vm.visibleBooks, function (book) {
    return _c('WorkCard', {
      key: book.novel_id,
      attrs: {
        "work": book
      }
    });
  }), 1) : _vm._ssrNode("<p class=\"empty\" data-v-3d4a479e>" + _vm._ssrEscape(_vm._s(_vm.loading ? '正在加载作品…' : _vm.error ? '暂时无法加载作品。' : '这里还没有作品。')) + "</p>"), _vm._ssrNode(" " + (_vm.books.length ? "<div class=\"more\" data-v-3d4a479e>" + (_vm.hasMore ? "<button" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-3d4a479e>" + _vm._ssrEscape(_vm._s(_vm.loading ? '加载中…' : '加载更多作品')) + "</button>" : "<span data-v-3d4a479e>已展示全部作品</span>") + "</div>" : "<!---->") + " "), _vm._ssrNode("<nav aria-label=\"作品分页\" class=\"page-links\" data-v-3d4a479e>", "</nav>", [_vm.requestedPage > 1 ? _c('nuxt-link', {
    attrs: {
      "to": _vm.pageUrl(_vm.requestedPage - 1),
      "rel": "prev"
    }
  }, [_vm._v("上一页")]) : _vm._e(), _vm.hasMore ? _c('nuxt-link', {
    attrs: {
      "to": _vm.pageUrl(_vm.page + 1),
      "rel": "next"
    }
  }, [_vm._v("第 " + _vm._s(_vm.page + 1) + " 页 →")]) : _vm._e()], 1)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/WorkCollection.vue?vue&type=template&id=3d4a479e&scoped=true

// EXTERNAL MODULE: ./components/read/WorkCard.vue + 4 modules
var WorkCard = __webpack_require__(136);

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(10);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(34);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/WorkCollection.vue?vue&type=script&lang=js



const AMOUNT = 24;
/* harmony default export */ var WorkCollectionvue_type_script_lang_js = ({
  components: {
    WorkCard: WorkCard["a" /* default */]
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    tagId: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    books: [],
    tagName: '',
    loading: true,
    error: '',
    page: 1,
    shown: AMOUNT,
    firstShown: 0,
    hasMore: false,
    version: 0,
    failedPage: 1
  }),
  head() {
    return Object(reading_seo["d" /* readingHead */])({
      title: `${this.heading}${this.requestedPage > 1 ? ` · 第 ${this.requestedPage} 页` : ''} - 原木社区`,
      description: `阅读「${this.heading}」中的小说、漫画与世界设定，发现更多精彩作品。`,
      path: this.tagId ? '/tag/collections' : '/read/collections',
      query: this.$route.query,
      schema: Object(reading_seo["g" /* workListSchema */])(this.visibleBooks, this.heading, (this.requestedPage - 1) * AMOUNT),
      noindex: !!this.error || this.requestedPage > 1 && !this.visibleBooks.length
    });
  },
  computed: {
    heading() {
      return this.tagId ? this.tagName || '标签作品' : this.title;
    },
    requestedPage() {
      return Object(reading_seo["e" /* readingPage */])(this.$route.query.page);
    },
    resourceKey() {
      return `${this.tagId}:${this.title}`;
    },
    visibleBooks() {
      return this.tagId ? this.books.slice(this.firstShown, this.shown) : this.books;
    }
  },
  async fetch() {
    await this.loadFirst();
  },
  watch: {
    resourceKey() {
      this.books = [];
      this.tagName = '';
      this.loadFirst();
    },
    requestedPage() {
      this.books = [];
      this.loadFirst();
    }
  },
  beforeDestroy() {
    this.version++;
  },
  methods: {
    pageUrl(page) {
      return {
        path: this.tagId ? '/tag/collections' : '/read/collections',
        query: {
          ...(this.tagId ? {
            tag_id: this.tagId
          } : {
            title: this.title
          }),
          ...(page > 1 ? {
            page
          } : {})
        }
      };
    },
    async loadFirst() {
      const version = ++this.version;
      const page = this.requestedPage;
      this.loading = true;
      this.error = '';
      this.failedPage = page;
      try {
        if (this.tagId) {
          const [tag, books] = await Promise.all([this.$api.reading.getTag(this.tagId), this.$api.reading.getTagBooks(this.tagId)]);
          if (version !== this.version) return;
          this.tagName = tag.tag_name || '标签作品';
          this.books = Object(reading_discovery["m" /* uniqueWorks */])(books);
          this.firstShown = (page - 1) * AMOUNT;
          this.shown = page * AMOUNT;
          this.hasMore = this.books.length > this.shown;
        } else {
          const books = await this.$api.reading.getCollectionBooks(this.title, page, AMOUNT);
          if (version !== this.version) return;
          this.books = Object(reading_discovery["m" /* uniqueWorks */])(books);
          this.hasMore = Object(reading_discovery["d" /* asList */])(books).length === AMOUNT;
        }
        this.page = page;
        if (page > 1 && !this.visibleBooks.length) Object(reading_seo["f" /* readingResponseStatus */])(this, 404);
      } catch (failure) {
        if (version === this.version) {
          this.error = '加载失败，请稍后重试。';
          Object(reading_seo["f" /* readingResponseStatus */])(this, failure.status === 404 ? 404 : 503);
        }
      } finally {
        if (version === this.version) this.loading = false;
      }
    },
    retry() {
      return this.failedPage <= this.requestedPage ? this.loadFirst() : this.loadMore();
    },
    async loadMore() {
      if (this.loading || !this.hasMore) return;
      if (this.tagId) {
        this.shown += AMOUNT;
        this.page++;
        this.hasMore = this.books.length > this.shown;
        return;
      }
      const version = this.version,
        page = this.page + 1;
      this.loading = true;
      this.error = '';
      this.failedPage = page;
      try {
        const books = await this.$api.reading.getCollectionBooks(this.title, page, AMOUNT);
        if (version !== this.version) return;
        this.books = Object(reading_discovery["m" /* uniqueWorks */])([...this.books, ...Object(reading_discovery["d" /* asList */])(books)]);
        this.page = page;
        this.hasMore = Object(reading_discovery["d" /* asList */])(books).length === AMOUNT;
      } catch (_) {
        if (version === this.version) this.error = '后续作品加载失败，已保留当前列表。';
      } finally {
        if (version === this.version) this.loading = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/WorkCollection.vue?vue&type=script&lang=js
 /* harmony default export */ var read_WorkCollectionvue_type_script_lang_js = (WorkCollectionvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/WorkCollection.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(198)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_WorkCollectionvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "3d4a479e",
  "2400d40d"
  
)

/* harmony default export */ var WorkCollection = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 431:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/collections.vue?vue&type=template&id=c1318498
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('WorkCollection', {
    attrs: {
      "title": _vm.title
    }
  });
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/collections.vue?vue&type=template&id=c1318498

// EXTERNAL MODULE: ./components/read/WorkCollection.vue + 4 modules
var WorkCollection = __webpack_require__(222);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/collections.vue?vue&type=script&lang=js

/* harmony default export */ var collectionsvue_type_script_lang_js = ({
  components: {
    WorkCollection: WorkCollection["a" /* default */]
  },
  computed: {
    title() {
      return String(this.$route.query.title || '人气最佳');
    }
  },
  middleware({
    query,
    redirect
  }) {
    if (query.title === '原木力爆棚' || query.title === '最近更新') return redirect('/read/rank', {
      board: query.title === '原木力爆棚' ? 'logpower' : 'update',
      zone: 'all'
    });
  },
  watchQuery: ['title', 'page']
});
// CONCATENATED MODULE: ./pages/read/collections.vue?vue&type=script&lang=js
 /* harmony default export */ var read_collectionsvue_type_script_lang_js = (collectionsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/read/collections.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_collectionsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  "e4fa8cf6"
  
)

/* harmony default export */ var collections = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=collections.js.map