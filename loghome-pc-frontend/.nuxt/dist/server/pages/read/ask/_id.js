exports.ids = [44];
exports.modules = {

/***/ 150:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/ui/SiteIcon.vue?vue&type=template&id=6a890970&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('svg', {
    staticClass: "site-icon",
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 256 256",
      "fill": "currentColor",
      "aria-hidden": "true",
      "focusable": "false"
    }
  }, [_vm._ssrNode(_vm._ssrList(_vm.paths, function (path, index) {
    return "<path" + _vm._ssrAttr("d", path) + " data-v-6a890970></path>";
  }))]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/ui/SiteIcon.vue?vue&type=template&id=6a890970&scoped=true

// CONCATENATED MODULE: ./assets/icons/phosphor-glyphs.js
// Official Phosphor SVG paths, regular weight (heartFilled uses fill).
// Source: https://github.com/phosphor-icons/core/tree/2b75f3ad12b420c9504ef05df8d2564a28f8500e
// MIT license: ./PHOSPHOR-LICENSE.txt. No runtime downloads.
/* harmony default export */ var phosphor_glyphs = ({
  "heart": ["M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"],
  "heartFilled": ["M240,102c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,228.66,16,172,16,102A62.07,62.07,0,0,1,78,40c20.65,0,38.73,8.88,50,23.89C139.27,48.88,157.35,40,178,40A62.07,62.07,0,0,1,240,102Z"],
  "smiley": ["M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"],
  "image": ["M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"],
  "inbox": ["M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,16V152h-28.7A15.86,15.86,0,0,0,168,156.69L148.69,176H107.31L88,156.69A15.86,15.86,0,0,0,76.69,152H48V48Zm0,160H48V168H76.69L96,187.31A15.86,15.86,0,0,0,107.31,192h41.38A15.86,15.86,0,0,0,160,187.31L179.31,168H208v40Z"],
  "warning": ["M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"],
  "edit": ["M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM136,75.31,152.69,92,68,176.69,51.31,160ZM48,208V179.31L76.69,208Zm48-3.31L79.32,188,164,103.31,180.69,120Zm96-96L147.32,64l24-24L216,84.69Z"],
  "sparkle": ["M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z"],
  "comment": ["M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"]
});
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/ui/SiteIcon.vue?vue&type=script&lang=js

/* harmony default export */ var SiteIconvue_type_script_lang_js = ({
  name: 'SiteIcon',
  props: {
    name: {
      type: String,
      required: true,
      validator: name => Object.prototype.hasOwnProperty.call(phosphor_glyphs, name)
    },
    filled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    paths() {
      return phosphor_glyphs[this.filled && phosphor_glyphs[`${this.name}Filled`] ? `${this.name}Filled` : this.name] || [];
    }
  }
});
// CONCATENATED MODULE: ./components/ui/SiteIcon.vue?vue&type=script&lang=js
 /* harmony default export */ var ui_SiteIconvue_type_script_lang_js = (SiteIconvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/ui/SiteIcon.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(157)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  ui_SiteIconvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "6a890970",
  "1e2053a0"
  
)

/* harmony default export */ var SiteIcon = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(158);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("ca2f1c12", content, true, context)
};

/***/ }),

/***/ 157:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(151);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.site-icon[data-v-6a890970] { display: inline-block; width: 1.125em; height: 1.125em; flex: none; vertical-align: -0.18em;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 352:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(495);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("366ecb0e", content, true, context)
};

/***/ }),

/***/ 494:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiWorkspace_vue_vue_type_style_index_0_id_da169ac8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(352);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiWorkspace_vue_vue_type_style_index_0_id_da169ac8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiWorkspace_vue_vue_type_style_index_0_id_da169ac8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiWorkspace_vue_vue_type_style_index_0_id_da169ac8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiWorkspace_vue_vue_type_style_index_0_id_da169ac8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 495:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.ai-resource-links[data-v-da169ac8]{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:12px 20px;font-size:13px}\n.reader-ai[data-v-da169ac8]{max-width:1320px;margin:0 auto;padding:30px 28px 45px;color:#4e493f}.ai-page-head[data-v-da169ac8]{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:24px}.ai-page-head h1[data-v-da169ac8]{font-size:28px;margin:10px 0}.ai-page-head p[data-v-da169ac8]{color:#938b7f;font-size:14px;margin:0}a[data-v-da169ac8]{color:#88724f;text-decoration:none}a[data-v-da169ac8]:hover{text-decoration:underline}button[data-v-da169ac8],input[data-v-da169ac8],textarea[data-v-da169ac8]{font:inherit}button[data-v-da169ac8]{cursor:pointer;border:1px solid #e5ded3;border-radius:7px;background:#fff;color:#685b48;padding:7px 11px;font-size:13px}button[data-v-da169ac8]:hover{background:#f6f2ec}button[data-v-da169ac8]:disabled{opacity:.5;cursor:default}button[data-v-da169ac8]:focus-visible,a[data-v-da169ac8]:focus-visible,input[data-v-da169ac8]:focus-visible,textarea[data-v-da169ac8]:focus-visible,summary[data-v-da169ac8]:focus-visible{outline:2px solid #8d9d63;outline-offset:3px}.ai-gate[data-v-da169ac8]{background:#fff;border:1px solid #e8e4dc;border-radius:14px;padding:64px 30px;text-align:center;line-height:1.8}.ai-workspace[data-v-da169ac8]{display:grid;grid-template-columns:252px minmax(0,1fr);border:1px solid #e5dfd5;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 5px 25px #453a2510;min-height:620px}.ai-sidebar[data-v-da169ac8]{background:#faf8f4;border-right:1px solid #e5dfd5;padding:20px 15px;display:flex;flex-direction:column;min-width:0}.sidebar-head[data-v-da169ac8]{display:flex;align-items:center;justify-content:space-between;gap:8px}.sidebar-head h2[data-v-da169ac8]{font-size:17px;margin:0}.history-search[data-v-da169ac8]{font-size:12px;color:#94897b;display:grid;gap:7px;margin:20px 0 12px}.history-search input[data-v-da169ac8]{min-width:0;box-sizing:border-box;width:100%;padding:9px;border:1px solid #ded8cf;background:#fff;border-radius:7px;color:#4e493f}.history-list[data-v-da169ac8]{max-height:570px;overflow:auto;flex:1}.history-group h3[data-v-da169ac8]{font-size:12px;color:#9a8d7b;font-weight:500;margin:18px 4px 8px;overflow-wrap:anywhere}.history-row[data-v-da169ac8]{display:flex;border-radius:8px;margin-bottom:4px}.history-row.selected[data-v-da169ac8]{background:#eaeede}.history-item[data-v-da169ac8]{flex:1;text-align:left;background:transparent;border:0;min-width:0;display:grid;gap:7px;padding:12px 8px}.history-item strong[data-v-da169ac8]{font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.history-item small[data-v-da169ac8]{font-size:11px;color:#a09789}.history-delete[data-v-da169ac8]{padding:5px;background:transparent;border:0;align-self:center;color:#a99e8d;font-size:18px}.clear-history[data-v-da169ac8]{margin-top:20px;font-size:11px;background:transparent}.ai-main[data-v-da169ac8]{position:relative;min-width:0;display:flex;flex-direction:column}.conversation-head[data-v-da169ac8]{padding:22px 28px 17px;display:flex;justify-content:space-between;gap:15px;align-items:center;border-bottom:1px solid #eee9e0}.conversation-head h2[data-v-da169ac8]{font-size:17px;margin:0 0 7px;overflow-wrap:anywhere}.conversation-head p[data-v-da169ac8]{font-size:12px;color:#918472;margin:0}.conversation-head button[data-v-da169ac8]{flex-shrink:0;max-width:220px;overflow-wrap:anywhere}.ai-metrics[data-v-da169ac8]{padding:12px 28px;display:flex;align-items:start;flex-wrap:wrap;gap:12px 20px;background:#fcfbf8;font-size:12px;border-bottom:1px solid #eee9e0}.ai-metrics details[data-v-da169ac8]{flex:0 1 230px}.ai-metrics p[data-v-da169ac8]{line-height:1.7;margin:12px 0 8px}summary[data-v-da169ac8]{cursor:pointer;color:#8c795f}.quiet[data-v-da169ac8]{color:#a29686;font-size:12px;line-height:1.8}.ai-messages[data-v-da169ac8]{height:min(54vh,590px);min-height:290px;overflow:auto;overscroll-behavior:contain;padding:20px 28px 30px;scrollbar-gutter:stable}.chat-welcome[data-v-da169ac8]{max-width:500px;margin:44px auto;text-align:center}.welcome-mark[data-v-da169ac8]{display:inline-grid;place-content:center;font-size:32px;background:#eff1e5;color:#809454;width:65px;height:65px;border-radius:18px}.chat-welcome h2[data-v-da169ac8]{font-size:22px;margin:20px 0 14px}.chat-welcome p[data-v-da169ac8]{line-height:1.8;font-size:14px;color:#8e8578}.question-chips[data-v-da169ac8]{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:23px 0}.question-chips button[data-v-da169ac8]{font-size:12px;border-color:#e2e7d4;background:#f8faf1;color:#778452}.ai-message[data-v-da169ac8]{padding:22px 0;border-bottom:1px solid #f0ebe3;overflow-wrap:anywhere}.message-label[data-v-da169ac8]{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.message-label strong[data-v-da169ac8]{font-size:13px;color:#889652}.ai-message.user .message-label strong[data-v-da169ac8]{color:#9a8567}.message-actions[data-v-da169ac8]{display:flex;gap:12px}.message-actions button[data-v-da169ac8]{background:none;border:0;padding:0;font-size:11px;color:#9a8d79}.user-text[data-v-da169ac8]{white-space:pre-wrap;font-size:14px;line-height:1.8;background:#f7f4ef;border-radius:9px;padding:14px 16px;margin:0}.ai-markdown[data-v-da169ac8]{font-size:14px;line-height:1.8;overflow-wrap:anywhere;min-width:0}.ai-markdown[data-v-da169ac8] a.ai-citation{font-size:11px;color:#7c934f;padding:1px 5px;background:#eef3e1;border-radius:4px;margin:0 3px}.ai-markdown[data-v-da169ac8] table{max-width:100%}.thinking[data-v-da169ac8],.citations[data-v-da169ac8]{font-size:12px;line-height:1.8;margin:12px 0;padding:10px 13px;border:1px solid #eee7db;border-radius:7px;background:#faf8f4}.thinking ol[data-v-da169ac8],.citations ol[data-v-da169ac8]{padding-left:20px;color:#948a7c;white-space:pre-wrap}.thinking li[data-v-da169ac8]{margin:6px 0}.citations blockquote[data-v-da169ac8]{border-left:2px solid #d4c8b3;padding-left:12px;margin:9px 0 14px;color:#9b8a72}.ai-composer[data-v-da169ac8]{padding:18px 28px 16px;border-top:1px solid #e9e2d7;background:#fff}.ai-composer textarea[data-v-da169ac8]{display:block;width:100%;box-sizing:border-box;resize:vertical;border:1px solid #e2d9cb;border-radius:10px;background:#fcfbf8;padding:14px;color:#4c453a;font-size:14px;line-height:1.7;min-height:90px;max-height:250px}.composer-footer[data-v-da169ac8]{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:12px}.composer-footer fieldset[data-v-da169ac8]{border:0;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:16px;font-size:13px}.composer-footer fieldset label[data-v-da169ac8]{cursor:pointer;display:flex;align-items:center;gap:5px}.composer-footer small[data-v-da169ac8]{font-size:11px;color:#a68d6b}.send[data-v-da169ac8]{background:#839556;color:#fff;border-color:#839556;min-width:92px;padding:10px 15px}.send[data-v-da169ac8]:hover{background:#748649;color:#fff}.composer-hint[data-v-da169ac8]{font-size:11px;color:#aa9f91;margin:10px 0 0}.ai-error[data-v-da169ac8]{font-size:13px;color:#b65341;line-height:1.7;white-space:pre-wrap;margin:0 0 12px}.resource-help[data-v-da169ac8]{display:flex;gap:20px;font-size:13px;margin:10px 0}.resume-row[data-v-da169ac8]{display:flex;flex-wrap:wrap;align-items:center;gap:10px;background:#f9f4e9;padding:12px;border-radius:8px;margin-bottom:12px;font-size:12px;color:#a08b65}.resume-row span[data-v-da169ac8]{flex:1 1 280px;line-height:1.8}.jump-bottom[data-v-da169ac8]{position:absolute;right:32px;bottom:245px;box-shadow:0 2px 12px #0001;z-index:1}.sr-only[data-v-da169ac8]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@media(max-width:950px){.reader-ai[data-v-da169ac8]{padding:22px 16px}.ai-workspace[data-v-da169ac8]{grid-template-columns:210px minmax(0,1fr)}.conversation-head[data-v-da169ac8],.ai-composer[data-v-da169ac8]{padding:18px}.ai-messages[data-v-da169ac8]{padding:16px 18px}.ai-metrics[data-v-da169ac8]{padding:10px 18px}.composer-footer[data-v-da169ac8]{align-items:end}.composer-footer fieldset[data-v-da169ac8]{gap:8px}}@media(max-width:700px){.reader-ai[data-v-da169ac8]{padding:18px 10px}.ai-page-head h1[data-v-da169ac8]{font-size:23px}.ai-page-head>a[data-v-da169ac8]{font-size:12px}.ai-workspace[data-v-da169ac8]{display:flex;flex-direction:column}.ai-sidebar[data-v-da169ac8]{border-right:0;border-bottom:1px solid #e5dfd5;padding:12px}.history-search[data-v-da169ac8]{margin:10px 0}.history-list[data-v-da169ac8]{max-height:130px;display:flex;gap:16px}.history-group[data-v-da169ac8]{min-width:170px;max-width:230px}.history-group h3[data-v-da169ac8]{margin-top:2px}.clear-history[data-v-da169ac8]{margin-top:8px;align-self:start}.conversation-head[data-v-da169ac8]{flex-wrap:wrap}.ai-messages[data-v-da169ac8]{height:430px}.message-actions[data-v-da169ac8]{gap:8px}.composer-footer fieldset[data-v-da169ac8]{font-size:12px}.composer-footer small[data-v-da169ac8]{font-size:10px}.send[data-v-da169ac8]{min-width:75px}.jump-bottom[data-v-da169ac8]{right:18px}.chat-welcome[data-v-da169ac8]{margin:25px auto}}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 555:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/ask/_id.vue?vue&type=template&id=6cbd7bf4
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('ReaderAiWorkspace', {
    key: _vm.book.novel_id,
    attrs: {
      "book": _vm.book
    }
  });
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/ask/_id.vue?vue&type=template&id=6cbd7bf4

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderAiWorkspace.vue?vue&type=template&id=da169ac8&scoped=true
var ReaderAiWorkspacevue_type_template_id_da169ac8_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "reader-ai",
    attrs: {
      "aria-labelledby": "reader-ai-title"
    }
  }, [_vm._ssrNode("<header class=\"ai-page-head\" data-v-da169ac8>", "</header>", [_vm._ssrNode("<div data-v-da169ac8>", "</div>", [_c('nuxt-link', {
    attrs: {
      "to": _vm.bookUrl
    }
  }, [_vm._v("← 返回作品")]), _vm._ssrNode("<h1 id=\"reader-ai-title\" data-v-da169ac8>向原木娘提问</h1><p data-v-da169ac8>" + _vm._ssrEscape("与原木娘一起读懂《" + _vm._s(_vm.book.name) + "》") + "</p>")], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"ai-resource-links\" data-v-da169ac8>", "</div>", [_vm.ready && !_vm.disabled ? _c('nuxt-link', {
    attrs: {
      "to": "/read/redstone"
    }
  }, [_vm._v("红石中心")]) : _vm._e(), _c('nuxt-link', {
    attrs: {
      "to": "/me/settings"
    }
  }, [_vm._v("AI 辅助设置")])], 1)], 2), _vm._ssrNode(" "), !_vm.ready ? _vm._ssrNode("<div class=\"ai-gate\" data-v-da169ac8>", "</div>", [_vm._ssrNode("正在加载会话…")], 2) : _vm.disabled ? _vm._ssrNode("<div class=\"ai-gate\" data-v-da169ac8>", "</div>", [_vm._ssrNode("<h2 data-v-da169ac8>AI 辅助已关闭</h2><p data-v-da169ac8>在账号设置中开启后，可以使用原木娘助读。</p>"), _c('nuxt-link', {
    attrs: {
      "to": "/me/settings"
    }
  }, [_vm._v("前往设置")])], 2) : _vm.authorDisabled ? _vm._ssrNode("<div class=\"ai-gate\" data-v-da169ac8>", "</div>", [_vm._ssrNode("<h2 data-v-da169ac8>作者已关闭本作品的 AI 助读</h2><p data-v-da169ac8>你仍然可以阅读正文、查看书摘和参与评论。</p>"), _c('nuxt-link', {
    attrs: {
      "to": _vm.bookUrl
    }
  }, [_vm._v("返回作品")])], 2) : !_vm.accountToken || _vm.authExpired ? _vm._ssrNode("<div class=\"ai-gate\" data-v-da169ac8>", "</div>", [_vm._ssrNode("<h2 data-v-da169ac8>" + _vm._ssrEscape(_vm._s(_vm.authExpired ? '登录已失效，请重新登录' : '登录后与原木娘聊聊这本书')) + "</h2>"), _c('nuxt-link', {
    attrs: {
      "to": _vm.loginUrl
    }
  }, [_vm._v("登录后提问")])], 2) : _vm._ssrNode("<div class=\"ai-workspace\" data-v-da169ac8>", "</div>", [_vm._ssrNode("<aside aria-label=\"历史会话\" class=\"ai-sidebar\" data-v-da169ac8><div class=\"sidebar-head\" data-v-da169ac8><h2 data-v-da169ac8>会话</h2><button data-v-da169ac8>＋ 新会话</button></div> <label class=\"history-search\" data-v-da169ac8>搜索历史<input type=\"search\" placeholder=\"作品、问题或回复\"" + _vm._ssrAttr("value", _vm.keyword) + " data-v-da169ac8></label> <div class=\"history-list\" data-v-da169ac8>" + _vm._ssrList(_vm.historyGroups, function (group) {
    return "<section class=\"history-group\" data-v-da169ac8><h3 data-v-da169ac8>" + _vm._ssrEscape(_vm._s(group.name)) + "</h3> " + _vm._ssrList(group.sessions, function (item) {
      return "<div" + _vm._ssrClass("history-row", {
        selected: _vm.session && item.id === _vm.session.id
      }) + " data-v-da169ac8><button" + _vm._ssrAttr("aria-current", _vm.session && item.id === _vm.session.id ? 'true' : null) + " class=\"history-item\" data-v-da169ac8><strong data-v-da169ac8>" + _vm._ssrEscape(_vm._s(item.title)) + "</strong><small data-v-da169ac8>" + _vm._ssrEscape(_vm._s(_vm.historyTime(item.updatedAt)) + _vm._s(item.pendingTask ? ' · 待接收' : '')) + "</small></button> <button" + _vm._ssrAttr("aria-label", `删除会话 ${item.title}`) + " class=\"history-delete\" data-v-da169ac8>×</button></div>";
    }) + "</section>";
  }) + " " + (!_vm.historyGroups.length ? "<p class=\"quiet\" data-v-da169ac8>未找到相关会话</p>" : "<!---->") + "</div> <button class=\"clear-history\" data-v-da169ac8>清空本账号的会话历史</button></aside> "), _vm.session ? _vm._ssrNode("<main class=\"ai-main\" data-v-da169ac8>", "</main>", [_vm._ssrNode("<div class=\"conversation-head\" data-v-da169ac8><div data-v-da169ac8><h2 data-v-da169ac8>" + _vm._ssrEscape(_vm._s(_vm.session.title)) + "</h2><p data-v-da169ac8>" + _vm._ssrEscape("当前作品：" + _vm._s(_vm.session.activeNovel.novelName)) + (_vm.session.activeNovel.novelId !== _vm.session.novelId ? "<span data-v-da169ac8> · 临时上下文</span>" : "<!---->") + "</p></div> " + (_vm.session.activeNovel.novelId !== _vm.session.novelId ? "<button" + _vm._ssrAttr("disabled", _vm.busy || !!_vm.session.pendingTask) + " data-v-da169ac8>" + _vm._ssrEscape("回到《" + _vm._s(_vm.book.name) + "》") + "</button>" : "<!---->") + "</div> <div class=\"ai-metrics\" data-v-da169ac8><details data-v-da169ac8><summary data-v-da169ac8>" + _vm._ssrEscape("作品索引 " + _vm._s(_vm.index ? Math.round(_vm.index.percent) + '%' : '—')) + "</summary>" + (_vm.index ? "<p data-v-da169ac8>" + _vm._ssrEscape("已索引摘要 " + _vm._s(_vm.index.indexed) + " / " + _vm._s(_vm.index.total) + " 章，待索引 " + _vm._s(_vm.index.pending) + " 章") + (_vm.index.queueStatus ? "<span data-v-da169ac8>" + _vm._ssrEscape("；队列 " + _vm._s(_vm.index.queueStatus)) + "</span>" : "<!---->") + "。</p>" : "<p data-v-da169ac8>尚未读取索引信息。</p>") + (_vm.indexError ? "<p role=\"alert\" data-v-da169ac8>" + _vm._ssrEscape(_vm._s(_vm.indexError)) + "</p>" : "<!---->") + "<button" + _vm._ssrAttr("disabled", _vm.indexLoading) + " data-v-da169ac8>" + _vm._ssrEscape(_vm._s(_vm.indexLoading ? '读取中…' : '刷新索引状态')) + "</button></details> <details data-v-da169ac8><summary data-v-da169ac8>" + _vm._ssrEscape("上下文 " + _vm._s(Math.round(_vm.session.context.percent)) + "%") + "</summary><p data-v-da169ac8>" + _vm._ssrEscape(_vm._s(_vm.session.context.usedTokens.toLocaleString()) + " / " + _vm._s(_vm.session.context.limitTokens.toLocaleString()) + " tokens") + "</p><p data-v-da169ac8>" + _vm._ssrEscape("达到 " + _vm._s(_vm.session.context.thresholdTokens.toLocaleString()) + " tokens 后，服务会压缩上下文以继续对话。已压缩 " + _vm._s(_vm.session.context.compressedCount) + " 次。") + "</p></details> <span class=\"quiet\" data-v-da169ac8>" + _vm._ssrEscape(_vm._s(_vm.busy ? '正在接收回复' : _vm.session.pendingTask ? '接收已暂停' : '可以提问')) + "</span></div> "), _vm._ssrNode("<div tabindex=\"0\" aria-label=\"问答内容\" class=\"ai-messages\" data-v-da169ac8>", "</div>", [!_vm.session.messages.length ? _vm._ssrNode("<div class=\"chat-welcome\" data-v-da169ac8>", "</div>", [_c('SiteIcon', {
    staticClass: "welcome-mark",
    attrs: {
      "name": "sparkle"
    }
  }), _vm._ssrNode("<h2 data-v-da169ac8>从一个问题开始</h2><p data-v-da169ac8>可以讨论情节、人物和世界设定。原木娘会检索作品，并附上可回到正文的引用。</p><p class=\"quiet\" data-v-da169ac8>回答可能涉及后续情节；AI 内容仅供参考。</p><div class=\"question-chips\" data-v-da169ac8>" + _vm._ssrList(_vm.suggestions, function (question) {
    return "<button data-v-da169ac8>" + _vm._ssrEscape(_vm._s(question)) + "</button>";
  }) + "</div>")], 2) : _vm._e(), _vm._ssrNode(" " + _vm._ssrList(_vm.session.messages, function (message) {
    return "<article" + _vm._ssrClass("ai-message", message.role) + " data-v-da169ac8><div class=\"message-label\" data-v-da169ac8><strong data-v-da169ac8>" + _vm._ssrEscape(_vm._s(message.role === 'user' ? '你' : '原木娘')) + "</strong><div class=\"message-actions\" data-v-da169ac8><button" + _vm._ssrAttr("disabled", !message.content) + " data-v-da169ac8>复制</button><button" + _vm._ssrAttr("disabled", _vm.busy || !!_vm.session.pendingTask) + " data-v-da169ac8>删除</button>" + (message.role === 'user' ? "<button" + _vm._ssrAttr("disabled", _vm.busy || !!_vm.session.pendingTask) + " data-v-da169ac8>回滚</button>" : "<!---->") + "</div></div> " + (message.thinkingSteps.length || message.currentThinkingText ? "<details class=\"thinking\" data-v-da169ac8><summary data-v-da169ac8>思考与检索过程</summary><ol data-v-da169ac8>" + _vm._ssrList(message.thinkingSteps, function (step, i) {
      return "<li data-v-da169ac8>" + _vm._ssrEscape(_vm._s(step)) + "</li>";
    }) + (message.currentThinkingText ? "<li data-v-da169ac8>" + _vm._ssrEscape(_vm._s(message.currentThinkingText)) + "</li>" : "<!---->") + "</ol></details>" : "<!---->") + " " + (message.role === 'user' ? "<p class=\"user-text\" data-v-da169ac8>" + _vm._ssrEscape(_vm._s(message.content)) + "</p>" : "<div class=\"ai-markdown\" data-v-da169ac8>" + _vm._s(_vm.markdown(message)) + "</div>") + " " + (!message.content && !message.error && _vm.session.pendingTask && _vm.session.pendingTask.messageId === message.id ? "<p class=\"quiet\" data-v-da169ac8>" + _vm._ssrEscape(_vm._s(_vm.busy ? '正在阅读和整理…' : '等待继续接收回复')) + "</p>" : "<!---->") + " " + (message.citations.length ? "<details class=\"citations\" data-v-da169ac8><summary data-v-da169ac8>" + _vm._ssrEscape("参考引用 · " + _vm._s(message.citations.length)) + "</summary><ol data-v-da169ac8>" + _vm._ssrList(message.citations, function (citation, i) {
      return "<li data-v-da169ac8>" + (_vm.citationUrl(citation) ? "<a" + _vm._ssrAttr("href", _vm.citationUrl(citation)) + " target=\"_blank\" rel=\"noopener\" data-v-da169ac8>" + _vm._ssrEscape("[" + _vm._s(citation.displayIndex) + "] " + _vm._s(citation.title) + _vm._s(citation.paragraphId ? ` · 第 ${citation.paragraphId} 段` : '') + " ↗") + "</a>" : "<span data-v-da169ac8>" + _vm._ssrEscape("[" + _vm._s(citation.displayIndex) + "] " + _vm._s(citation.title)) + "</span>") + (citation.snippet ? "<blockquote data-v-da169ac8>" + _vm._ssrEscape(_vm._s(citation.snippet)) + "</blockquote>" : "<!---->") + "</li>";
    }) + "</ol></details>" : "<!---->") + " " + (message.error ? "<p role=\"alert\" class=\"ai-error\" data-v-da169ac8>" + _vm._ssrEscape(_vm._s(message.error)) + "</p>" : "<!---->") + "</article>";
  }))], 2), _vm._ssrNode(" " + (!_vm.atBottom ? "<button class=\"jump-bottom\" data-v-da169ac8>回到最新回复 ↓</button>" : "<!---->") + " "), _vm._ssrNode("<div class=\"ai-composer\" data-v-da169ac8>", "</div>", [_vm._ssrNode((_vm.error ? "<p role=\"alert\" class=\"ai-error\" data-v-da169ac8>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p>" : "<!---->") + (_vm.storageError ? "<p role=\"alert\" class=\"ai-error\" data-v-da169ac8>" + _vm._ssrEscape(_vm._s(_vm.storageError)) + "</p>" : "<!---->") + " "), _vm.redstoneError ? _vm._ssrNode("<div class=\"resource-help\" data-v-da169ac8>", "</div>", [_c('nuxt-link', {
    attrs: {
      "to": "/read/redstone"
    }
  }, [_vm._v("兑换红石")]), _vm._ssrNode("<a href=\"https://m.loghome.ink/#/pages/membership/index\" target=\"_blank\" rel=\"noopener\" data-v-da169ac8>开通通行证 ↗</a>")], 2) : _vm._e(), _vm._ssrNode(" " + (_vm.session.pendingTask && !_vm.busy ? "<div class=\"resume-row\" data-v-da169ac8><span data-v-da169ac8>回复接收未完成，可从上次位置继续。暂停接收时，服务仍可能继续生成回复。</span><button data-v-da169ac8>继续接收</button><button data-v-da169ac8>结束此次回复</button></div>" : "<!---->") + " <label for=\"reader-ai-question\" class=\"sr-only\" data-v-da169ac8>向原木娘提问</label><textarea id=\"reader-ai-question\"" + _vm._ssrAttr("disabled", _vm.busy || !!_vm.session.pendingTask) + " rows=\"3\" placeholder=\"输入你想了解的情节、人物或设定…\" data-v-da169ac8>" + _vm._ssrEscape(_vm._s(_vm.session.draft)) + "</textarea> <div class=\"composer-footer\" data-v-da169ac8><fieldset" + _vm._ssrAttr("disabled", _vm.busy || !!_vm.session.pendingTask) + " data-v-da169ac8><legend class=\"sr-only\" data-v-da169ac8>检索模式</legend><label data-v-da169ac8><input type=\"radio\" value=\"fast\"" + _vm._ssrAttr("checked", _vm._q(_vm.session.mode, "fast")) + " data-v-da169ac8> 快速 <small data-v-da169ac8>1 红石 / 次</small></label><label data-v-da169ac8><input type=\"radio\" value=\"deep\"" + _vm._ssrAttr("checked", _vm._q(_vm.session.mode, "deep")) + " data-v-da169ac8> 深入 <small data-v-da169ac8>2 红石 / 次</small></label></fieldset>" + (_vm.busy ? "<button class=\"send\" data-v-da169ac8>暂停接收</button>" : "<button" + _vm._ssrAttr("disabled", !_vm.session.draft.trim() || !!_vm.session.pendingTask) + " class=\"send\" data-v-da169ac8>发送 ↑</button>") + "</div> <p class=\"composer-hint\" data-v-da169ac8>Ctrl / ⌘ + Enter 发送。继续接收复用同一任务，不创建新提问。</p>")], 2)], 2) : _vm._e()], 2)], 2);
};
var ReaderAiWorkspacevue_type_template_id_da169ac8_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderAiWorkspace.vue?vue&type=template&id=da169ac8&scoped=true

// EXTERNAL MODULE: ./components/ui/SiteIcon.vue + 5 modules
var SiteIcon = __webpack_require__(150);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(11);

// EXTERNAL MODULE: ./utils/reader-ai.js
var reader_ai = __webpack_require__(42);

// CONCATENATED MODULE: ./utils/reader-ai-markdown.js
// Mobile reader Markdown blocks, adapted to CSS pixels and safe native links.

const MARKDOWN_STYLES = {
  h1: 'font-size: 17px; font-weight: 700; margin: 10px 0 6px; line-height: 1.45;',
  h2: 'font-size: 15.5px; font-weight: 700; margin: 9px 0 6px; line-height: 1.45;',
  h3: 'font-size: 14.5px; font-weight: 700; margin: 8px 0 5px; line-height: 1.45;',
  p: 'margin: 0 0 7px; line-height: 1.8;',
  ul: 'margin: 0 0 7px; padding-left: 15px;',
  ol: 'margin: 0 0 7px; padding-left: 17px;',
  li: 'margin: 0 0 4px; line-height: 1.8;',
  blockquote: 'margin: 0 0 7px; padding: 4px 0 4px 9px; border-left: 3px solid rgba(125, 125, 125, 0.25); color: #8a847a; line-height: 1.8;',
  pre: 'margin: 0 0 7px; padding: 9px 10px; border-radius: 8px; background: rgba(24, 24, 24, 0.92); color: #f5f0e6; overflow-x: auto; white-space: pre-wrap; line-height: 1.7;',
  code: 'padding: 1px 4px; border-radius: 4px; background: rgba(0, 0, 0, 0.06); font-family: monospace;',
  hr: 'margin: 9px 0; border: none; border-top: 0.5px solid rgba(120, 120, 120, 0.18);',
  a: 'color: #b66a16; text-decoration: underline;',
  table: 'width: 100%; margin: 0 0 8px; border-collapse: collapse; table-layout: fixed; overflow-wrap: anywhere;',
  th: 'padding: 5px 6px; border: 0.5px solid rgba(150, 118, 70, 0.26); background: rgba(207, 169, 96, 0.14); font-weight: 700; line-height: 1.6; word-break: break-word; vertical-align: top;',
  td: 'padding: 5px 6px; border: 0.5px solid rgba(150, 118, 70, 0.22); line-height: 1.6; word-break: break-word; vertical-align: top;'
};
function escapeHtml(text) {
  return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function escapeAttribute(text) {
  return escapeHtml(text).replace(/`/g, '&#96;');
}
function renderInlineMarkdown(rawText) {
  const tokens = [],
    protect = html => {
      const key = `\u0000${tokens.length}\u0000`;
      tokens.push(html);
      return key;
    };
  let text = String(rawText || '').replace(/\u0000/g, '');
  text = text.replace(/`([^`\n]+)`/g, (_, code) => protect('<code style="' + MARKDOWN_STYLES.code + '">' + escapeHtml(code) + '</code>'));
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => protect('<a href="' + escapeAttribute(url) + '" target="_blank" rel="noopener noreferrer" style="' + MARKDOWN_STYLES.a + '">' + escapeHtml(label) + '</a>'));
  text = escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>').replace(/\*([^*\n]+)\*/g, '<em>$1</em>').replace(/_([^_\n]+)_/g, '<em>$1</em>').replace(/~~([^~]+)~~/g, '<del>$1</del>');
  return text.replace(/\u0000(\d+)\u0000/g, (_, index) => tokens[Number(index)] || '');
}
function renderParagraph(lines) {
  const content = lines.map(function (line) {
    return renderInlineMarkdown(line);
  }).join('<br/>');
  if (!content.trim()) {
    return '';
  }
  return '<p style="' + MARKDOWN_STYLES.p + '">' + content + '</p>';
}
function splitMarkdownTableRow(line) {
  let source = String(line || '').trim();
  if (!source || source.indexOf('|') === -1) {
    return [];
  }
  if (source.startsWith('|')) {
    source = source.slice(1);
  }
  if (source.endsWith('|')) {
    source = source.slice(0, -1);
  }
  const cells = [];
  let cell = '';
  let escaping = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '\\' && !escaping) {
      escaping = true;
      cell += char;
      continue;
    }
    if (char === '|' && !escaping) {
      cells.push(cell.trim().replace(/\\\|/g, '|'));
      cell = '';
      continue;
    }
    escaping = false;
    cell += char;
  }
  cells.push(cell.trim().replace(/\\\|/g, '|'));
  return cells;
}
function isMarkdownTableRow(line) {
  return splitMarkdownTableRow(line).length >= 2;
}
function isMarkdownTableSeparator(line) {
  const cells = splitMarkdownTableRow(line);
  return cells.length >= 2 && cells.every(function (cell) {
    return /^:?-{3,}:?$/.test(String(cell || '').replace(/\s+/g, ''));
  });
}
function getMarkdownTableAlignments(separatorLine) {
  return splitMarkdownTableRow(separatorLine).map(function (cell) {
    const value = String(cell || '').replace(/\s+/g, '');
    if (/^:-+:$/.test(value)) {
      return 'center';
    }
    if (/^-+:$/.test(value)) {
      return 'right';
    }
    return 'left';
  });
}
function renderMarkdownTable(headerCells, alignments, bodyRows) {
  const columnCount = headerCells.length;
  const safeAlignments = alignments.length > 0 ? alignments : headerCells.map(function () {
    return 'left';
  });
  const headerHtml = headerCells.map(function (cell, index) {
    const align = safeAlignments[index] || 'left';
    return '<th style="' + MARKDOWN_STYLES.th + ' text-align: ' + align + ';">' + renderInlineMarkdown(cell) + '</th>';
  }).join('');
  const bodyHtml = bodyRows.map(function (row) {
    const cells = row.slice(0, columnCount);
    while (cells.length < columnCount) {
      cells.push('');
    }
    return '<tr>' + cells.map(function (cell, index) {
      const align = safeAlignments[index] || 'left';
      return '<td style="' + MARKDOWN_STYLES.td + ' text-align: ' + align + ';">' + renderInlineMarkdown(cell) + '</td>';
    }).join('') + '</tr>';
  }).join('');
  return '<table style="' + MARKDOWN_STYLES.table + '"><thead><tr>' + headerHtml + '</tr></thead><tbody>' + bodyHtml + '</tbody></table>';
}
function renderMarkdownToHtml(markdownText) {
  const source = String(markdownText || '').replace(/\r\n/g, '\n');
  if (!source.trim()) {
    return '';
  }
  const lines = source.split('\n');
  const htmlParts = [];
  let paragraphLines = [];
  let listType = '';
  let listItems = [];
  let inCodeBlock = false;
  let codeLines = [];
  function flushParagraph() {
    if (paragraphLines.length === 0) {
      return;
    }
    const html = renderParagraph(paragraphLines);
    if (html) {
      htmlParts.push(html);
    }
    paragraphLines = [];
  }
  function flushList() {
    if (!listType || listItems.length === 0) {
      listType = '';
      listItems = [];
      return;
    }
    const listStyle = listType === 'ol' ? MARKDOWN_STYLES.ol : MARKDOWN_STYLES.ul;
    htmlParts.push('<' + listType + ' style="' + listStyle + '">' + listItems.map(function (item) {
      return '<li style="' + MARKDOWN_STYLES.li + '">' + renderInlineMarkdown(item) + '</li>';
    }).join('') + '</' + listType + '>');
    listType = '';
    listItems = [];
  }
  function flushCodeBlock() {
    if (!inCodeBlock) {
      return;
    }
    htmlParts.push('<pre style="' + MARKDOWN_STYLES.pre + '"><code>' + escapeHtml(codeLines.join('\n')) + '</code></pre>');
    inCodeBlock = false;
    codeLines = [];
  }
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      flushParagraph();
      flushList();
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        inCodeBlock = true;
        codeLines = [];
      }
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      flushParagraph();
      flushList();
      htmlParts.push('<hr style="' + MARKDOWN_STYLES.hr + '" />');
      continue;
    }
    const nextLine = lines[lineIndex + 1] || '';
    if (isMarkdownTableRow(trimmed) && isMarkdownTableSeparator(nextLine)) {
      flushParagraph();
      flushList();
      const headerCells = splitMarkdownTableRow(trimmed);
      const alignments = getMarkdownTableAlignments(nextLine);
      const bodyRows = [];
      lineIndex += 2;
      while (lineIndex < lines.length) {
        const tableLine = lines[lineIndex];
        const tableTrimmed = tableLine.trim();
        if (!tableTrimmed || !isMarkdownTableRow(tableTrimmed) || isMarkdownTableSeparator(tableTrimmed)) {
          lineIndex -= 1;
          break;
        }
        bodyRows.push(splitMarkdownTableRow(tableLine));
        lineIndex += 1;
      }
      htmlParts.push(renderMarkdownTable(headerCells, alignments, bodyRows));
      continue;
    }
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      const tag = 'h' + level;
      const style = MARKDOWN_STYLES[tag];
      htmlParts.push('<' + tag + ' style="' + style + '">' + renderInlineMarkdown(headingMatch[2]) + '</' + tag + '>');
      continue;
    }
    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      htmlParts.push('<blockquote style="' + MARKDOWN_STYLES.blockquote + '">' + renderInlineMarkdown(quoteMatch[1]) + '</blockquote>');
      continue;
    }
    const unorderedMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (listType && listType !== 'ul') {
        flushList();
      }
      listType = 'ul';
      listItems.push(unorderedMatch[1]);
      continue;
    }
    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listType && listType !== 'ol') {
        flushList();
      }
      listType = 'ol';
      listItems.push(orderedMatch[1]);
      continue;
    }
    if (listType) {
      flushList();
    }
    paragraphLines.push(trimmed);
  }
  flushParagraph();
  flushList();
  flushCodeBlock();
  return htmlParts.join('');
}
function renderAiMarkdown(message) {
  const citations = new Map();
  for (const item of message.citations || []) {
    citations.set(item.id, item);
    if (item.articleId) {
      citations.set(`a${item.articleId}`, item);
      if (item.paragraphId) citations.set(`a${item.articleId}p${item.paragraphId}`, item);
    }
  }
  let codeDepth = 0;
  // Resolve markers only in text nodes, never inside link attributes or code blocks.
  return renderMarkdownToHtml(message.content).split(/(<[^>]*>)/g).map(part => {
    if (part.startsWith('<')) {
      if (/^<(?:pre|code)(?:\s|>)/.test(part)) codeDepth++;
      if (/^<\/(?:pre|code)>/.test(part)) codeDepth = Math.max(0, codeDepth - 1);
      return part;
    }
    if (codeDepth) return part;
    return part.replace(/\[\[cite:([^\]]+)\]\]/g, (_, id) => {
      const item = citations.get(Object(reader_ai["b" /* aiCitationId */])(id)),
        url = item && Object(reader_ai["c" /* aiCitationUrl */])(item);
      return url ? '<a class="ai-citation" href="' + escapeAttribute(url) + '" target="_blank" rel="noopener" aria-label="引用 ' + item.displayIndex + '：' + escapeAttribute(item.title) + '">[' + item.displayIndex + ']</a>' : '';
    });
  }).join('');
}
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderAiWorkspace.vue?vue&type=script&lang=js





/* harmony default export */ var ReaderAiWorkspacevue_type_script_lang_js = ({
  components: {
    SiteIcon: SiteIcon["a" /* default */]
  },
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    ready: false,
    disabled: false,
    accountToken: null,
    authExpired: false,
    authorDisabled: false,
    sessions: [],
    selectedId: '',
    keyword: '',
    busy: false,
    error: '',
    storageError: '',
    redstoneError: false,
    index: null,
    indexError: '',
    indexLoading: false,
    runVersion: 0,
    indexVersion: 0,
    atBottom: true
  }),
  computed: {
    bookUrl() {
      return Object(reading_discovery["n" /* workUrl */])(this.book);
    },
    loginUrl() {
      return {
        path: '/login',
        query: {
          redirect: `/read/ask/${this.book.novel_id}`
        }
      };
    },
    session() {
      return this.sessions.find(item => item.id === this.selectedId) || null;
    },
    suggestions() {
      return ['这本书讲了怎样的故事？', '帮我梳理主要人物之间的关系', '解释一下故事中的世界设定'];
    },
    historyGroups() {
      const keyword = this.keyword.trim().toLocaleLowerCase(),
        groups = new Map();
      this.sessions.slice().sort((a, b) => b.updatedAt - a.updatedAt).forEach(session => {
        if (keyword && ![session.novelName, session.title, ...session.messages.map(item => Object(reader_ai["q" /* stripAiCitations */])(item.content))].join('\n').toLocaleLowerCase().includes(keyword)) return;
        if (!groups.has(session.novelId)) groups.set(session.novelId, {
          id: session.novelId,
          name: session.novelName,
          sessions: []
        });
        groups.get(session.novelId).sessions.push(session);
      });
      return [...groups.values()];
    }
  },
  mounted() {
    this.syncIdentity();
    window.addEventListener('storage', this.syncIdentity);
    window.addEventListener('focus', this.syncIdentity);
    window.addEventListener(reader_ai["a" /* AI_PREFERENCE_EVENT */], this.syncIdentity);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.identityTimer = setInterval(this.syncIdentity, 1000);
  },
  beforeDestroy() {
    this.pause();
    this.indexVersion++;
    if (this.indexController) this.indexController.abort();
    clearInterval(this.identityTimer);
    clearTimeout(this.saveTimer);
    window.removeEventListener('storage', this.syncIdentity);
    window.removeEventListener('focus', this.syncIdentity);
    window.removeEventListener(reader_ai["a" /* AI_PREFERENCE_EVENT */], this.syncIdentity);
    document.removeEventListener('visibilitychange', this.onVisibility);
  },
  methods: {
    markdown: renderAiMarkdown,
    citationUrl: reader_ai["c" /* aiCitationUrl */],
    historyTime(time) {
      return new Date(time).toLocaleDateString('zh-CN', {
        month: 'numeric',
        day: 'numeric'
      });
    },
    syncIdentity() {
      const token = Object(reading["c" /* readingToken */])(),
        disabled = Object(reader_ai["m" /* readerAiDisabled */])(),
        first = !this.ready;
      if (!first && token === this.accountToken && disabled === this.disabled) return;
      this.pause();
      this.indexVersion++;
      if (this.indexController) this.indexController.abort();
      this.disabled = disabled;
      this.ready = true;
      this.error = '';
      this.redstoneError = false;
      this.index = null;
      this.indexError = '';
      this.indexLoading = false;
      if (token !== this.accountToken || first) {
        this.accountToken = token;
        this.sessions = token ? Object(reader_ai["l" /* loadAiHistory */])(token) : [];
        this.selectedId = '';
        this.keyword = '';
        this.storageError = '';
        this.authExpired = false;
        if (token) {
          const requested = this.$route && this.$route.query.session;
          const belongs = item => item.novelId === Number(this.book.novel_id);
          const latest = this.sessions.find(item => belongs(item) && item.id === requested) || this.sessions.find(item => belongs(item) && item.chosen) || this.sessions.find(belongs);
          if (latest) this.selectedId = latest.id;else {
            const session = Object(reader_ai["g" /* aiSession */])(this.book);
            this.sessions.unshift(session);
            this.selectedId = session.id;
          }
        }
      }
      this.authorDisabled = Number(this.book.disable_reader_ai) === 1;
      if (!disabled && token && !this.authorDisabled) {
        this.loadIndex();
        if (this.session && this.session.pendingTask && this.session.pendingTask.status !== 'paused') this.receive();
      }
    },
    valid() {
      this.syncIdentity();
      return !!this.accountToken && !this.authExpired && !this.disabled && !this.authorDisabled && !!this.session;
    },
    persist() {
      clearTimeout(this.saveTimer);
      if (this.accountToken !== Object(reading["c" /* readingToken */])() || !this.accountToken) return false;
      this.sessions.forEach(item => {
        if (item.novelId === Number(this.book.novel_id)) item.chosen = item.id === this.selectedId;
      });
      try {
        Object(reader_ai["n" /* saveAiHistory */])(this.accountToken, this.sessions);
        this.storageError = '';
        return true;
      } catch (_) {
        this.storageError = '会话或草稿未能保存，请检查浏览器存储空间。关闭页面后可能丢失本次内容。';
        return false;
      }
    },
    scheduleSave() {
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => this.persist(), 250);
    },
    onVisibility() {
      if (document.hidden) this.pause();else {
        this.syncIdentity();
        if (this.valid() && this.session.pendingTask && this.session.pendingTask.status !== 'paused' && !this.busy) this.receive();
      }
    },
    onScroll() {
      const area = this.$refs.messages;
      this.atBottom = !area || area.scrollHeight - area.scrollTop - area.clientHeight < 150;
    },
    scrollBottom(force = false) {
      if (!force && !this.atBottom) return;
      this.$nextTick(() => {
        const area = this.$refs.messages;
        if (area) {
          area.scrollTop = area.scrollHeight;
          this.atBottom = true;
        }
      });
    },
    chooseQuestion(question) {
      if (!this.valid() || this.busy || this.session.pendingTask) return;
      this.session.draft = question;
      this.persist();
      this.$refs.draft.focus();
    },
    onDraftKey(event) {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.isComposing) {
        event.preventDefault();
        this.submit();
      }
    },
    newSession() {
      this.syncIdentity();
      if (!this.accountToken || this.authExpired || this.disabled || this.authorDisabled) return;
      this.pause();
      const session = Object(reader_ai["g" /* aiSession */])(this.book);
      this.sessions.unshift(session);
      this.selectedId = session.id;
      this.error = '';
      this.redstoneError = false;
      this.index = null;
      this.persist();
      this.loadIndex();
      this.scrollBottom(true);
    },
    selectSession(item) {
      if (!this.valid()) return;
      this.pause();
      if (item.novelId !== Number(this.book.novel_id)) {
        this.$router.push({
          path: `/read/ask/${item.novelId}`,
          query: {
            session: item.id
          }
        });
        return;
      }
      this.selectedId = item.id;
      this.error = '';
      this.redstoneError = false;
      this.index = null;
      this.persist();
      this.loadIndex();
      this.scrollBottom(true);
      if (item.pendingTask && item.pendingTask.status !== 'paused') this.receive();
    },
    async confirm(message) {
      try {
        await this.$confirm(message, '会话管理', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        });
        return true;
      } catch (_) {
        return false;
      }
    },
    async deleteSession(item) {
      if (!this.valid()) return;
      const token = this.accountToken;
      if (!(await this.confirm(`删除「${item.title}」及其全部问答？`)) || token !== Object(reading["c" /* readingToken */])()) return;
      if (item.id === this.selectedId) this.pause();
      this.sessions = this.sessions.filter(session => session.id !== item.id);
      if (item.id === this.selectedId) {
        const next = this.sessions.find(session => session.novelId === Number(this.book.novel_id));
        if (next) {
          this.selectedId = next.id;
          this.index = null;
          this.loadIndex();
        } else this.newSession();
      }
      this.persist();
    },
    async clearHistory() {
      if (!this.valid()) return;
      const token = this.accountToken;
      if (!(await this.confirm('清空本账号在此浏览器中的所有作品会话和草稿？')) || token !== Object(reading["c" /* readingToken */])()) return;
      this.pause();
      this.sessions = [];
      this.newSession();
    },
    async deleteMessage(message) {
      if (!this.valid() || this.busy || this.session.pendingTask) return;
      const token = this.accountToken,
        session = this.session;
      if (!(await this.confirm('删除这条消息？')) || token !== Object(reading["c" /* readingToken */])() || this.session !== session || this.busy || session.pendingTask) return;
      session.messages = session.messages.filter(item => item.id !== message.id);
      session.updatedAt = Date.now();
      this.persist();
    },
    async rollback(message) {
      if (!this.valid() || this.busy || this.session.pendingTask || message.role !== 'user') return;
      const token = this.accountToken,
        session = this.session;
      if (!(await this.confirm('删除此问题及之后的回复，并把问题放回输入框？')) || token !== Object(reading["c" /* readingToken */])() || this.session !== session || this.busy || session.pendingTask) return;
      const index = session.messages.findIndex(item => item.id === message.id);
      if (index < 0) return;
      session.messages.splice(index);
      session.draft = message.content;
      session.updatedAt = Date.now();
      this.persist();
      this.$refs.draft.focus();
    },
    async copyMessage(message) {
      if (!this.valid()) return;
      try {
        await navigator.clipboard.writeText(Object(reader_ai["q" /* stripAiCitations */])(message.content));
        this.$message.success('已复制');
      } catch (_) {
        this.error = '复制失败，可选中消息文字手动复制。';
      }
    },
    restoreBook() {
      if (!this.valid() || this.busy || this.session.pendingTask) return;
      this.session.activeNovel = Object(reader_ai["e" /* aiNovel */])(this.book);
      this.persist();
      this.loadIndex();
    },
    pause(manual = false) {
      this.runVersion++;
      if (this.streamController) this.streamController.abort();
      this.streamController = null;
      this.busy = false;
      if (manual && this.session && this.session.pendingTask) this.session.pendingTask.status = 'paused';
      this.persist();
    },
    async discardTask() {
      if (!this.valid() || this.busy || !this.session.pendingTask) return;
      const token = this.accountToken,
        session = this.session;
      if (!(await this.confirm('结束接收这次回复？已有内容会保留。此操作不会撤销已经产生的红石扣费。')) || token !== Object(reading["c" /* readingToken */])() || this.session !== session || this.busy) return;
      session.pendingTask = null;
      this.error = '';
      this.persist();
    },
    async loadIndex() {
      if (!this.valid()) return;
      const session = this.session,
        novelId = session.activeNovel.novelId,
        token = this.accountToken,
        version = ++this.indexVersion;
      if (this.indexController) this.indexController.abort();
      const controller = new AbortController();
      this.indexController = controller;
      this.indexLoading = true;
      this.indexError = '';
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const index = await Object(reader_ai["k" /* fetchAiIndex */])(novelId, {
          token,
          signal: controller.signal
        });
        if (version === this.indexVersion && token === Object(reading["c" /* readingToken */])() && this.session === session) this.index = index;
      } catch (error) {
        if (version !== this.indexVersion || token !== Object(reading["c" /* readingToken */])() || this.session !== session) return;
        this.indexError = error.name === 'AbortError' ? '读取索引超时，请重试。' : error.message;
        if (error.status === 401) {
          this.authExpired = true;
          this.pause();
        }
        if (error.code === 'READER_AI_DISABLED' && novelId === Number(this.book.novel_id)) {
          this.authorDisabled = true;
          this.pause();
        }
      } finally {
        clearTimeout(timeout);
        if (version === this.indexVersion) this.indexLoading = false;
      }
    },
    async submit() {
      if (!this.valid() || this.busy || this.session.pendingTask || !this.session.draft.trim()) return;
      const session = this.session,
        text = session.draft.trim();
      session.messages.push(Object(reader_ai["d" /* aiMessage */])('user', text));
      session.draft = '';
      if (session.title === '新会话') session.title = text.slice(0, 24);
      const assistant = Object(reader_ai["d" /* aiMessage */])('assistant');
      session.messages.push(assistant);
      session.pendingTask = Object(reader_ai["j" /* createAiTask */])(session, assistant);
      session.updatedAt = Date.now();
      // Require a durable task id before starting a paid request.
      if (!this.persist()) return;
      this.scrollBottom(true);
      await this.receive();
    },
    async receive() {
      if (!this.valid() || this.busy || !this.session.pendingTask || !this.persist()) return;
      const session = this.session,
        token = this.accountToken,
        version = ++this.runVersion,
        task = session.pendingTask;
      task.status = 'running';
      const current = () => version === this.runVersion && token === Object(reading["c" /* readingToken */])() && !Object(reader_ai["m" /* readerAiDisabled */])() && this.session === session;
      const controller = new AbortController();
      this.streamController = controller;
      this.busy = true;
      this.error = '';
      this.redstoneError = false;
      try {
        // Check the current author setting before every send/resume; the AI service also enforces it.
        const books = await this.$api.reader.book(this.book.novel_id);
        if (!current()) return;
        if (!books[0]) throw new Error('作品不存在或不可阅读。');
        if (Number(books[0].disable_reader_ai) === 1) {
          this.authorDisabled = true;
          throw new Error('作者已关闭本作品的 AI 助读。');
        }
        await Object(reader_ai["p" /* streamReaderAi */])(Object(reader_ai["f" /* aiPayload */])(session, task), {
          token,
          signal: controller.signal,
          current: () => current() && session.pendingTask === task,
          onEvent: event => {
            if (!current()) return;
            const previousNovel = session.activeNovel.novelId;
            if (!Object(reader_ai["i" /* applyAiEvent */])(session, event)) return;
            session.updatedAt = Date.now();
            this.scheduleSave();
            this.scrollBottom();
            if (session.activeNovel.novelId !== previousNovel) {
              this.index = null;
              this.loadIndex();
            }
            if (event.type === 'error') {
              this.error = event.message || event.msg || '回复生成失败';
              this.redstoneError = event.code === 'INSUFFICIENT_REDSTONE' || /红石.*不足/.test(this.error);
              if (event.code === 'READER_AI_DISABLED' && session.activeNovel.novelId === session.novelId) this.authorDisabled = true;
            }
          }
        });
        if (current() && session.pendingTask) this.error = '连接已断开，回复接收未完成。请继续接收。';
      } catch (error) {
        if (!current() || error.name === 'AbortError') return;
        this.error = error.message;
        this.redstoneError = error.code === 'INSUFFICIENT_REDSTONE' || /红石.*不足/.test(error.message);
        if (error.status === 401) this.authExpired = true;
        if ([400, 401, 403, 404, 409].includes(error.status)) {
          const target = session.messages.find(message => message.id === task.messageId);
          if (target) target.error = error.message;
          session.pendingTask = null;
          if (error.code === 'READER_AI_DISABLED' && session.activeNovel.novelId === session.novelId) this.authorDisabled = true;
        }
      } finally {
        if (version === this.runVersion) {
          this.busy = false;
          this.streamController = null;
          this.persist();
        }
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderAiWorkspace.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderAiWorkspacevue_type_script_lang_js = (ReaderAiWorkspacevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderAiWorkspace.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(494)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderAiWorkspacevue_type_script_lang_js,
  ReaderAiWorkspacevue_type_template_id_da169ac8_scoped_true_render,
  ReaderAiWorkspacevue_type_template_id_da169ac8_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "da169ac8",
  "c04ec008"
  
)

/* harmony default export */ var ReaderAiWorkspace = (component.exports);
// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(39);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/ask/_id.vue?vue&type=script&lang=js



/* harmony default export */ var _idvue_type_script_lang_js = ({
  components: {
    ReaderAiWorkspace: ReaderAiWorkspace
  },
  async asyncData({
    params,
    $api,
    error,
    redirect
  }) {
    const id = Number(params.id);
    if (!Number.isSafeInteger(id) || id <= 0) return error({
      statusCode: 404,
      message: '作品不存在'
    });
    try {
      const books = await $api.reader.book(id),
        book = books && books[0];
      if (!book) return error({
        statusCode: 404,
        message: '作品不存在或不可阅读'
      });
      if (book.novel_type && book.novel_type !== 'novel') return redirect(Object(reading_discovery["n" /* workUrl */])(book));
      return {
        book
      };
    } catch (failure) {
      return error({
        statusCode: failure.status || 503,
        message: failure.message || '作品加载失败，请稍后重试'
      });
    }
  },
  head() {
    return Object(reading_seo["d" /* readingHead */])({
      title: `向原木娘提问 · ${this.book.name} - 原木社区`,
      description: `与原木娘一起阅读《${this.book.name}》。`,
      path: `/read/ask/${this.book.novel_id}`,
      noindex: true
    });
  }
});
// CONCATENATED MODULE: ./pages/read/ask/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var ask_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// CONCATENATED MODULE: ./pages/read/ask/_id.vue





/* normalize component */

var _id_component = Object(componentNormalizer["a" /* default */])(
  ask_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  "bdd1ae72"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (_id_component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map