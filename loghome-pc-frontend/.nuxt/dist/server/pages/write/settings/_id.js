exports.ids = [70];
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

/***/ 360:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(512);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("df072386", content, true, context)
};

/***/ }),

/***/ 511:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_7b3defa0_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(360);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_7b3defa0_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_7b3defa0_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_7b3defa0_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_7b3defa0_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 512:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".settings-page[data-v-7b3defa0]{width:100%;max-width:800px;margin:0 auto;padding:20px}.settings-page .page-header[data-v-7b3defa0]{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px}.settings-page .page-header .page-title[data-v-7b3defa0]{font-size:28px;color:#704c35;margin:0}.settings-page .page-header .back-link[data-v-7b3defa0]{color:#947358;text-decoration:none;font-size:16px}.settings-page .page-header .back-link[data-v-7b3defa0]:hover{text-decoration:underline}.settings-page .settings-container[data-v-7b3defa0]{display:flex;flex-direction:column;gap:20px}.settings-page .settings-card[data-v-7b3defa0]{background-color:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 12px 0 rgba(0,0,0,.1)}.settings-page .settings-card.danger-zone[data-v-7b3defa0]{border-left:4px solid #f56c6c}.settings-page .settings-section-title[data-v-7b3defa0]{font-size:18px;color:#704c35;margin:0 0 20px 0;padding-bottom:10px;border-bottom:1px solid #eee}.settings-page .settings-item[data-v-7b3defa0]{display:flex;align-items:center;padding:15px 0;border-bottom:1px solid #f5f5f5;cursor:pointer;transition:background-color .3s}.settings-page .settings-item[data-v-7b3defa0]:last-child{border-bottom:none}.settings-page .settings-item[data-v-7b3defa0]:hover{background-color:#f5f5f5}.settings-page .settings-item.delete-item .settings-label[data-v-7b3defa0]{color:#f56c6c}.settings-page .settings-label[data-v-7b3defa0]{flex:1;font-size:16px;color:#333}.settings-page .settings-value[data-v-7b3defa0]{flex:2;font-size:16px;color:#666;text-align:right;padding-right:10px;overflow:hidden;text-overflow:ellipsis}.settings-page .settings-arrow[data-v-7b3defa0]{font-size:20px;color:#888;margin-left:10px}.settings-page .tags-container[data-v-7b3defa0]{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px}.settings-page .tags-container .tag-item[data-v-7b3defa0]{background-color:#f0f0f0;color:#666;padding:2px 8px;border-radius:4px;font-size:14px}.settings-page .tags-container .tag-item.activity-tag[data-v-7b3defa0]{background-color:rgba(251,125,70,.2);color:#fb7d46}.settings-page .loading-state[data-v-7b3defa0]{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.settings-page .loading-state .loading-spinner[data-v-7b3defa0]{width:50px;height:50px;border:5px solid #f5f5f5;border-top:5px solid #947358;border-radius:50%;margin:0 auto 20px;animation:spin-7b3defa0 1s linear infinite}.settings-page .loading-state .loading-text[data-v-7b3defa0]{color:#666}@keyframes spin-7b3defa0{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.settings-page .error-state[data-v-7b3defa0]{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.settings-page .error-state .error-icon[data-v-7b3defa0]{font-size:50px;margin-bottom:20px;color:#e74c3c}.settings-page .error-state .error-title[data-v-7b3defa0]{font-size:20px;color:#333;margin-bottom:10px}.settings-page .error-state .error-desc[data-v-7b3defa0]{color:#666;margin-bottom:25px}.settings-page .error-state .error-button[data-v-7b3defa0]{background-color:#947358;color:#fff;border:none;border-radius:4px;padding:10px 30px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.settings-page .error-state .error-button[data-v-7b3defa0]:hover{background-color:#704c35}.settings-page .status-options[data-v-7b3defa0]{display:flex;flex-direction:column;gap:10px}.settings-page .status-options .status-option[data-v-7b3defa0]{padding:12px 20px;background-color:#f5f5f5;border-radius:4px;cursor:pointer;transition:background-color .3s}.settings-page .status-options .status-option[data-v-7b3defa0]:hover{background-color:hsl(0,0%,91.0784313725%)}.settings-page .delete-confirm-content[data-v-7b3defa0]{text-align:center}.settings-page .delete-confirm-content .delete-warning[data-v-7b3defa0]{color:#f56c6c;font-weight:bold;margin-top:10px}@media(max-width: 768px){.settings-page[data-v-7b3defa0]{padding:10px}.settings-page .page-header .page-title[data-v-7b3defa0]{font-size:24px}.settings-page .settings-label[data-v-7b3defa0],.settings-page .settings-value[data-v-7b3defa0]{font-size:14px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 618:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/settings/_id.vue?vue&type=template&id=7b3defa0&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "settings-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-7b3defa0>", "</div>", [_vm._ssrNode("<h1 class=\"page-title\" data-v-7b3defa0>作品设置</h1> "), _c('nuxt-link', {
    staticClass: "back-link",
    attrs: {
      "to": `/write`
    }
  }, [_vm._v("返回创作中心")])], 2), _vm._ssrNode(" " + (_vm.novel ? "<div class=\"settings-container\" data-v-7b3defa0><div class=\"settings-card\" data-v-7b3defa0><h2 class=\"settings-section-title\" data-v-7b3defa0>基本设置</h2> <div class=\"settings-item\" data-v-7b3defa0><div class=\"settings-label\" data-v-7b3defa0>作品状态</div> <div class=\"settings-value\" data-v-7b3defa0>" + _vm._ssrEscape(_vm._s(_vm.novel.is_personal == 0 ? "公开" : "私密")) + "</div> <div class=\"settings-arrow\" data-v-7b3defa0>›</div></div> <div class=\"settings-item\" data-v-7b3defa0><div class=\"settings-label\" data-v-7b3defa0>更新状态</div> <div class=\"settings-value\" data-v-7b3defa0>" + _vm._ssrEscape(_vm._s(_vm.novel.is_complete == 0 ? "连载" : "完结")) + "</div> <div class=\"settings-arrow\" data-v-7b3defa0>›</div></div> <div class=\"settings-item\" data-v-7b3defa0><div class=\"settings-label\" data-v-7b3defa0>作品标签</div> <div class=\"settings-value tags-container\" data-v-7b3defa0>" + (_vm.tags.length === 0 ? "<span data-v-7b3defa0>无</span>" : "<!---->") + " " + _vm._ssrList(_vm.tags, function (tag) {
    return "<span" + _vm._ssrClass("tag-item", {
      'activity-tag': tag.is_activity_tag
    }) + " data-v-7b3defa0>" + _vm._ssrEscape("\n            " + _vm._s(tag.tag_name) + "\n          ") + "</span>";
  }) + "</div> <div class=\"settings-arrow\" data-v-7b3defa0>›</div></div> <div class=\"settings-item\" data-v-7b3defa0><div class=\"settings-label\" data-v-7b3defa0>修改作品信息</div> <div class=\"settings-arrow\" data-v-7b3defa0>›</div></div></div> <div class=\"settings-card danger-zone\" data-v-7b3defa0><h2 class=\"settings-section-title\" data-v-7b3defa0>危险操作</h2> <div class=\"settings-item delete-item\" data-v-7b3defa0><div class=\"settings-label\" data-v-7b3defa0>删除作品</div> <div class=\"settings-arrow\" data-v-7b3defa0>›</div></div></div></div>" : "<!---->") + " "), _vm.loading ? _vm._ssrNode("<div class=\"loading-state\" data-v-7b3defa0>", "</div>", [_vm._ssrNode("<div class=\"loading-spinner\" data-v-7b3defa0></div> <p class=\"loading-text\" data-v-7b3defa0>正在加载作品信息...</p>")], 2) : _vm.error ? _vm._ssrNode("<div class=\"error-state\" data-v-7b3defa0>", "</div>", [_vm._ssrNode("<div aria-hidden=\"true\" class=\"error-icon\" data-v-7b3defa0>", "</div>", [_c('SiteIcon', {
    attrs: {
      "name": "warning"
    }
  })], 1), _vm._ssrNode(" <h3 class=\"error-title\" data-v-7b3defa0>加载失败</h3> <p class=\"error-desc\" data-v-7b3defa0>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button class=\"error-button\" data-v-7b3defa0>重试</button>")], 2) : _vm._e(), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "title": _vm.dialogTitle,
      "visible": _vm.dialogVisible,
      "width": "30%",
      "before-close": _vm.handleDialogClose
    },
    on: {
      "update:visible": function ($event) {
        _vm.dialogVisible = $event;
      }
    }
  }, [_c('div', {
    staticClass: "status-options"
  }, _vm._l(_vm.dialogOptions, function (option) {
    return _c('div', {
      key: option.value,
      staticClass: "status-option",
      on: {
        "click": function ($event) {
          return _vm.selectStatus(option.value);
        }
      }
    }, [_vm._v("\n        " + _vm._s(option.label) + "\n      ")]);
  }), 0)]), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "title": "确认删除",
      "visible": _vm.deleteDialogVisible,
      "width": "30%"
    },
    on: {
      "update:visible": function ($event) {
        _vm.deleteDialogVisible = $event;
      }
    }
  }, [_c('div', {
    staticClass: "delete-confirm-content"
  }, [_c('p', [_vm._v("删除后将无法找回，确定继续吗？")]), _vm._v(" "), _c('p', {
    staticClass: "delete-warning"
  }, [_vm._v("（删除作品将消耗50原木）")])]), _vm._v(" "), _c('span', {
    staticClass: "dialog-footer",
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('el-button', {
    on: {
      "click": function ($event) {
        _vm.deleteDialogVisible = false;
      }
    }
  }, [_vm._v("取消")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "danger"
    },
    on: {
      "click": _vm.deleteNovel
    }
  }, [_vm._v("确认删除")])], 1)])], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/write/settings/_id.vue?vue&type=template&id=7b3defa0&scoped=true

// EXTERNAL MODULE: ./components/ui/SiteIcon.vue + 5 modules
var SiteIcon = __webpack_require__(150);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/settings/_id.vue?vue&type=script&lang=js

/* harmony default export */ var _idvue_type_script_lang_js = ({
  components: {
    SiteIcon: SiteIcon["a" /* default */]
  },
  head() {
    return {
      title: '作品设置 - 原木社区'
    };
  },
  data() {
    return {
      novel: null,
      tags: [],
      restrictingActivities: [],
      loading: true,
      error: null,
      dialogVisible: false,
      dialogTitle: '',
      dialogType: '',
      dialogOptions: [],
      deleteDialogVisible: false
    };
  },
  async mounted() {
    await this.fetchNovelData();
  },
  methods: {
    async fetchNovelData() {
      this.loading = true;
      this.error = null;
      try {
        // 获取作品信息
        const novelId = this.$route.params.id;
        const response = await this.$api.essays.getNovelById(novelId);
        if (response && response.length > 0) {
          this.novel = response[0];
          // 获取作品标签
          await this.fetchNovelTags();
          // 获取作品关联的活动限制信息
          await this.fetchActivityRestrictions();
        } else {
          this.error = '未找到作品信息';
        }
      } catch (error) {
        console.error('获取作品信息失败:', error);
        this.error = '获取作品信息失败，请稍后重试';
      } finally {
        this.loading = false;
      }
    },
    async fetchNovelTags() {
      try {
        const novelId = this.$route.params.id;
        const response = await this.$api.library.getNovelTags(novelId);
        if (response && Array.isArray(response)) {
          this.tags = response;
        }
      } catch (error) {
        console.error('获取作品标签失败:', error);
      }
    },
    // 获取进行中且开启"限制完结后更新"的活动
    async fetchActivityRestrictions() {
      this.restrictingActivities = [];
      try {
        const res = await this.$api.essays.getNovelActivity(this.$route.params.id);
        if (res && res.hasActivity && Array.isArray(res.activities)) {
          this.restrictingActivities = res.activities.filter(a => Number(a.is_active) === 1 && Number(a.restrict_complete_update) === 1);
        }
      } catch (error) {
        console.error('获取活动限制信息失败:', error);
      }
    },
    showStatusDialog(type) {
      this.dialogType = type;
      if (type === 'personal') {
        this.dialogTitle = '设置作品状态';
        this.dialogOptions = [{
          label: '公开',
          value: 0
        }, {
          label: '私密',
          value: 1
        }];
      } else if (type === 'update') {
        this.dialogTitle = '设置更新状态';
        this.dialogOptions = [{
          label: '连载',
          value: 0
        }, {
          label: '完结',
          value: 1
        }];
      }
      this.dialogVisible = true;
    },
    handleDialogClose() {
      this.dialogVisible = false;
    },
    async selectStatus(value) {
      try {
        const novelId = this.$route.params.id;
        if (this.dialogType === 'personal') {
          await this.$api.essays.setNovelStatus({
            is_personal: value,
            novel_id: novelId
          });
          this.$message.success('作品状态修改成功');
          await this.fetchNovelData();
        } else if (this.dialogType === 'update') {
          this.dialogVisible = false;
          await this.confirmUpdateStatus(value);
          return;
        }

        // 刷新作品数据
        await this.fetchNovelData();
      } catch (error) {
        console.error('修改状态失败:', error);
        this.$message.error('修改状态失败，请稍后重试');
      } finally {
        this.dialogVisible = false;
      }
    },
    // 完结/连载切换：进行中的活动可能限制完结后的更新操作
    async confirmUpdateStatus(value) {
      const isComplete = Number(this.novel.is_complete) === 1;
      const restricted = this.restrictingActivities.length > 0;
      const restrictNames = this.restrictingActivities.map(a => `「${a.activity_name}」`).join('、');
      const novelId = this.$route.params.id;
      if (value === 0 && isComplete && restricted) {
        this.$alert(`作品已完结并参与进行中的创作活动${restrictNames}，活动期间不可退回连载状态。`, '无法退回连载', {
          confirmButtonText: '知道了'
        });
        return;
      }
      if (value === 1 && !isComplete && restricted) {
        try {
          await this.$confirm(`完结后，在活动${restrictNames}期间将无法新增或编辑章节，也无法退回连载状态。确定完结吗？`, '确认完结', {
            confirmButtonText: '确定完结',
            cancelButtonText: '再想想',
            type: 'warning'
          });
        } catch (e) {
          return;
        }
      }
      try {
        const res = await this.$api.essays.setNovelUpdateStatus({
          is_complete: value,
          novel_id: novelId
        });
        if (res && res.msg) {
          this.$message.error(res.msg);
        } else {
          this.$message.success('更新状态修改成功');
        }
        await this.fetchNovelData();
      } catch (error) {
        console.error('修改状态失败:', error);
        this.$message.error('修改状态失败，请稍后重试');
      }
    },
    goToInfoEdit() {
      this.$router.push(`/write/settings/info/${this.$route.params.id}`);
    },
    goToTagsEdit() {
      this.$router.push(`/write/settings/tags/${this.$route.params.id}`);
    },
    confirmDelete() {
      this.deleteDialogVisible = true;
    },
    async deleteNovel() {
      try {
        const novelId = this.$route.params.id;
        await this.$api.essays.deleteNovel({
          id: novelId
        });
        this.$message.success('作品已删除');

        // 跳转回创作中心
        this.$router.push('/write');
      } catch (error) {
        console.error('删除作品失败:', error);
        this.$message.error('删除作品失败，请稍后重试');
      } finally {
        this.deleteDialogVisible = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/write/settings/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var settings_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/write/settings/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(511)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  settings_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "7b3defa0",
  "6f3a8594"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map