exports.ids = [5];
exports.modules = {

/***/ 122:
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
  
  var style0 = __webpack_require__(125)
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

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(126);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("ca2f1c12", content, true, context)
};

/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(123);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.site-icon[data-v-6a890970] { display: inline-block; width: 1.125em; height: 1.125em; flex: none; vertical-align: -0.18em;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 243:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(317);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("762cd471", content, true, context)
};

/***/ }),

/***/ 316:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_44f627fe_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(243);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_44f627fe_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_44f627fe_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_44f627fe_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_44f627fe_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 317:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".circles-container[data-v-44f627fe]{max-width:1200px;margin:0 auto;padding:20px;min-height:100vh}.page-header[data-v-44f627fe]{text-align:center;margin-bottom:30px}.page-header .page-title[data-v-44f627fe]{font-size:32px;font-weight:bold;color:#333;margin-bottom:8px}.page-header .page-subtitle[data-v-44f627fe]{font-size:16px;color:#666;margin:0}.search-section[data-v-44f627fe]{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;gap:20px}.search-section .search-box[data-v-44f627fe]{display:flex;flex:1;max-width:500px}.search-section .search-box .search-input[data-v-44f627fe]{flex:1;height:40px;padding:0 15px;border:1px solid #ddd;border-radius:20px 0 0 20px;font-size:14px;outline:none}.search-section .search-box .search-input[data-v-44f627fe]:focus{border-color:#ea7034}.search-section .search-box .search-btn[data-v-44f627fe]{width:50px;height:40px;background-color:#ea7034;border:none;border-radius:0 20px 20px 0;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}.search-section .search-box .search-btn[data-v-44f627fe]:hover{background-color:#d65a2b}.search-section .create-circle-btn[data-v-44f627fe]{height:40px;padding:0 20px;background-color:#ea7034;color:#fff;border:none;border-radius:20px;font-size:14px;cursor:pointer;display:flex;align-items:center;gap:5px;white-space:nowrap}.search-section .create-circle-btn[data-v-44f627fe]:hover{background-color:#d65a2b}.search-section .create-circle-btn .icon-plus[data-v-44f627fe]{font-size:16px}.circles-content .category-section[data-v-44f627fe]{margin-bottom:40px}.circles-content .category-section .category-header[data-v-44f627fe]{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:10px;border-bottom:2px solid #ea7034}.circles-content .category-section .category-header .category-name[data-v-44f627fe]{font-size:24px;font-weight:bold;color:#333;margin:0}.circles-content .category-section .category-header .circle-count[data-v-44f627fe]{font-size:14px;color:#666}.circles-content .category-section .circles-grid[data-v-44f627fe]{display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:20px}.circle-card[data-v-44f627fe]{background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.1);cursor:pointer;transition:all .3s ease}.circle-card[data-v-44f627fe]:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.15)}.circle-card .circle-header[data-v-44f627fe]{display:flex;align-items:flex-start;margin-bottom:15px}.circle-card .circle-header .circle-icon[data-v-44f627fe]{width:60px;height:60px;border-radius:12px;object-fit:cover;margin-right:15px;flex-shrink:0}.circle-card .circle-header .circle-info[data-v-44f627fe]{flex:1;min-width:0}.circle-card .circle-header .circle-info .circle-name-row[data-v-44f627fe]{display:flex;align-items:center;margin-bottom:8px}.circle-card .circle-header .circle-info .circle-name-row .circle-name[data-v-44f627fe]{font-size:18px;font-weight:bold;color:#333;margin:0;margin-right:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.circle-card .circle-header .circle-info .circle-name-row .official-tag[data-v-44f627fe]{font-size:12px;color:#fff;background-color:#ea7034;padding:2px 8px;border-radius:10px;flex-shrink:0}.circle-card .circle-header .circle-info .circle-meta[data-v-44f627fe]{display:flex;gap:15px}.circle-card .circle-header .circle-info .circle-meta .member-count[data-v-44f627fe],.circle-card .circle-header .circle-info .circle-meta .post-count[data-v-44f627fe]{font-size:14px;color:#666}.circle-card .circle-description[data-v-44f627fe]{font-size:14px;color:#666;line-height:1.5;margin-bottom:15px;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.circle-card .circle-actions[data-v-44f627fe]{display:flex;justify-content:flex-end}.circle-card .circle-actions .join-btn[data-v-44f627fe]{padding:8px 20px;background-color:#ea7034;color:#fff;border:none;border-radius:20px;font-size:14px;cursor:pointer;transition:background-color .3s ease}.circle-card .circle-actions .join-btn[data-v-44f627fe]:hover{background-color:#d65a2b}.circle-card .circle-actions .joined-btn[data-v-44f627fe]{padding:8px 20px;background-color:#f0f0f0;color:#999;border:none;border-radius:20px;font-size:14px;cursor:default}.empty-state[data-v-44f627fe]{text-align:center;padding:80px 20px}.empty-state .empty-icon[data-v-44f627fe]{color:#947358;font-size:48px;margin-bottom:20px}.empty-state .empty-text[data-v-44f627fe]{font-size:20px;color:#666;margin-bottom:10px}.empty-state .empty-desc[data-v-44f627fe]{font-size:14px;color:#999;margin-bottom:30px}.empty-state .create-first-btn[data-v-44f627fe]{padding:12px 30px;background-color:#ea7034;color:#fff;border:none;border-radius:25px;font-size:16px;cursor:pointer}.empty-state .create-first-btn[data-v-44f627fe]:hover{background-color:#d65a2b}@media(max-width: 768px){.circles-container[data-v-44f627fe]{padding:15px}.search-section[data-v-44f627fe]{flex-direction:column;gap:15px}.search-section .search-box[data-v-44f627fe]{max-width:none}.search-section .create-circle-btn[data-v-44f627fe]{width:100%;justify-content:center}.circles-grid[data-v-44f627fe]{grid-template-columns:1fr !important}.page-header .page-title[data-v-44f627fe]{font-size:24px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 426:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/circles.vue?vue&type=template&id=44f627fe&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "circles-container"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-44f627fe><h1 class=\"page-title\" data-v-44f627fe>圈子广场</h1> <p class=\"page-subtitle\" data-v-44f627fe>发现有趣的圈子，找到志同道合的朋友</p></div> <div class=\"search-section\" data-v-44f627fe><div class=\"search-box\" data-v-44f627fe><input type=\"text\" placeholder=\"搜索圈子名称或描述\"" + _vm._ssrAttr("value", _vm.keyword) + " class=\"search-input\" data-v-44f627fe> <button class=\"search-btn\" data-v-44f627fe><i class=\"el-icon-search\" data-v-44f627fe></i></button></div> <button class=\"create-circle-btn\" data-v-44f627fe><i class=\"el-icon-plus\" data-v-44f627fe></i>\n      创建圈子\n    </button></div> "), _c('div', {
    directives: [{
      name: "loading",
      rawName: "v-loading",
      value: _vm.loadingStatus === 'loading',
      expression: "loadingStatus === 'loading'"
    }],
    staticClass: "circles-content"
  }, [_vm._ssrNode(_vm._ssrList(_vm.categories, function (category, index) {
    return "<div class=\"category-section\" data-v-44f627fe><div class=\"category-header\" data-v-44f627fe><h2 class=\"category-name\" data-v-44f627fe>" + _vm._ssrEscape(_vm._s(category.name)) + "</h2> <span class=\"circle-count\" data-v-44f627fe>" + _vm._ssrEscape(_vm._s(category.circle_count) + "个圈子") + "</span></div> <div class=\"circles-grid\" data-v-44f627fe>" + _vm._ssrList(_vm.categoryCircles[category.category_id], function (circle, circleIndex) {
      return "<div class=\"circle-card\" data-v-44f627fe><div class=\"circle-header\" data-v-44f627fe><img" + _vm._ssrAttr("src", circle.icon || '/default-avatar.png') + _vm._ssrAttr("alt", circle.name) + " class=\"circle-icon\" data-v-44f627fe> <div class=\"circle-info\" data-v-44f627fe><div class=\"circle-name-row\" data-v-44f627fe><h3 class=\"circle-name\" data-v-44f627fe>" + _vm._ssrEscape(_vm._s(circle.name)) + "</h3> " + (circle.is_official ? "<span class=\"official-tag\" data-v-44f627fe>官方</span>" : "<!---->") + "</div> <div class=\"circle-meta\" data-v-44f627fe><span class=\"member-count\" data-v-44f627fe>" + _vm._ssrEscape(_vm._s(circle.member_count) + "人") + "</span> <span class=\"post-count\" data-v-44f627fe>" + _vm._ssrEscape(_vm._s(circle.post_count) + "帖子") + "</span></div></div></div> <p class=\"circle-description\" data-v-44f627fe>" + _vm._ssrEscape(_vm._s(circle.description)) + "</p></div>";
    }) + "</div></div>";
  }) + " "), Object.keys(_vm.categoryCircles).length === 0 && _vm.loadingStatus !== 'loading' ? _vm._ssrNode("<div class=\"empty-state\" data-v-44f627fe>", "</div>", [_vm._ssrNode("<div aria-hidden=\"true\" class=\"empty-icon\" data-v-44f627fe>", "</div>", [_c('SiteIcon', {
    attrs: {
      "name": "inbox"
    }
  })], 1), _vm._ssrNode(" <p class=\"empty-text\" data-v-44f627fe>暂无圈子</p> <p class=\"empty-desc\" data-v-44f627fe>成为第一个创建圈子的人吧！</p> <button class=\"create-first-btn\" data-v-44f627fe>创建圈子</button>")], 2) : _vm._e()], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/community/circles.vue?vue&type=template&id=44f627fe&scoped=true

// EXTERNAL MODULE: ./components/ui/SiteIcon.vue + 5 modules
var SiteIcon = __webpack_require__(122);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/circles.vue?vue&type=script&lang=js

/* harmony default export */ var circlesvue_type_script_lang_js = ({
  components: {
    SiteIcon: SiteIcon["a" /* default */]
  },
  name: 'CirclesPage',
  data() {
    return {
      categories: [],
      categoryCircles: {},
      keyword: '',
      loadingStatus: 'more',
      hasMore: true,
      isLoggedIn: false,
      myJoinedCircles: []
    };
  },
  async asyncData({
    $api
  }) {
    try {
      // 获取圈子分类
      const categories = await $api.community.getCircleCategories();
      return {
        categories: categories || []
      };
    } catch (error) {
      console.error('获取圈子分类失败:', error);
      return {
        categories: []
      };
    }
  },
  mounted() {
    this.checkLoginStatus();
    this.initializeData();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = token && JSON.parse(token).tk;
    },
    async initializeData() {
      if (this.categories.length === 0) {
        await this.loadCategories();
      }

      // 初始化每个分类的圈子列表
      this.categories.forEach(category => {
        this.$set(this.categoryCircles, category.category_id, []);
      });
      await Promise.all([this.loadCirclesByCategory(), this.isLoggedIn ? this.loadMyCircles() : Promise.resolve()]);
    },
    async loadCategories() {
      try {
        const categories = await this.$api.community.getCircleCategories();
        this.categories = categories || [];
      } catch (error) {
        console.error('加载分类失败', error);
        this.$message.error('加载分类失败');
      }
    },
    async loadCirclesByCategory() {
      if (!this.hasMore || this.loadingStatus === 'loading') return;
      this.loadingStatus = 'loading';
      try {
        const promises = this.categories.map(category => {
          return this.$api.community.getCirclesList({
            category_id: category.category_id,
            keyword: this.keyword
          });
        });
        const results = await Promise.all(promises);
        results.forEach((res, index) => {
          if (res && res.list) {
            const categoryId = this.categories[index].category_id;
            // 处理圈子数据，标记已加入的圈子
            const circles = res.list.map(circle => {
              circle.is_joined = this.myJoinedCircles.some(c => c.circle_id === circle.circle_id);
              return circle;
            });
            this.$set(this.categoryCircles, categoryId, circles);
            // 更新分类的圈子数量
            this.categories[index].circle_count = res.total;
          }
        });
        this.loadingStatus = 'noMore';
      } catch (error) {
        console.error('加载圈子失败', error);
        this.loadingStatus = 'more';
        this.$message.error('加载圈子失败');
      }
    },
    async loadMyCircles() {
      try {
        const myCircles = await this.$api.community.getMyCircles();
        this.myJoinedCircles = myCircles || [];

        // 更新所有分类中圈子的加入状态
        Object.keys(this.categoryCircles).forEach(categoryId => {
          this.categoryCircles[categoryId] = this.categoryCircles[categoryId].map(circle => {
            circle.is_joined = this.myJoinedCircles.some(c => c.circle_id === circle.circle_id);
            return circle;
          });
        });
      } catch (error) {
        console.error('加载我的圈子失败', error);
      }
    },
    searchCircles() {
      this.loadCirclesByCategory();
    },
    navigateToCircle(circleId) {
      this.$router.push(`/community/circle/${circleId}`);
    },
    async joinCircle(circle) {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录');
        this.$router.push('/login');
        return;
      }
      try {
        await this.$api.community.joinCircle({
          circle_id: circle.circle_id
        });

        // 更新圈子状态
        circle.is_joined = true;
        circle.member_count++;

        // 更新我的圈子列表
        this.myJoinedCircles.push(circle);
        this.$message.success('加入成功');
      } catch (error) {
        console.error('加入圈子失败', error);
        this.$message.error(error.message || '加入失败，请重试');
      }
    },
    // 打开圈子创建窗口
    async openCreateCircle() {
      if (!localStorage.getItem('token')) {
        this.$router.push("/login");
        return;
      }
      await this.$openMobileWindow(`/pages/community/createCircle?id=${this.circleId}`, {
        title: '创建圈子',
        width: 500
      });
    },
    handleImageError(event) {
      event.target.src = '/default-avatar.png';
    }
  }
});
// CONCATENATED MODULE: ./pages/community/circles.vue?vue&type=script&lang=js
 /* harmony default export */ var community_circlesvue_type_script_lang_js = (circlesvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/community/circles.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(316)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  community_circlesvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "44f627fe",
  "91ee6e2c"
  
)

/* harmony default export */ var circles = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=circles.js.map