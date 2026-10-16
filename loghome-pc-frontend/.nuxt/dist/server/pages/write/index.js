exports.ids = [41];
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

/***/ 239:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(309);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("4c72652d", content, true, context)
};

/***/ }),

/***/ 240:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(311);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("34fa41cc", content, true, context)
};

/***/ }),

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c0596958_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(239);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c0596958_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c0596958_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c0596958_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c0596958_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 309:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".write-page{width:100%}.write-page .page-header{margin-bottom:30px}.write-page .page-title{font-size:32px;color:#704c35}.write-page .write-container{display:grid;grid-template-columns:1fr 300px;gap:30px}.write-page .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.write-page .section-title{font-size:24px;color:#704c35;margin:0}.write-page .new-button{background-color:#947358;color:#fff;border:none;border-radius:4px;padding:10px 20px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.write-page .new-button:hover{background-color:#704c35}.write-page .tabs{display:flex;margin-bottom:20px;border-bottom:1px solid #eee}.write-page .tab-button{padding:10px 20px;background:none;border:none;color:#666;font-size:16px;cursor:pointer;position:relative;transition:color .3s ease}.write-page .tab-button:hover{color:#947358}.write-page .tab-button.active{color:#947358;font-weight:600}.write-page .tab-button.active:after{content:\"\";position:absolute;bottom:-1px;left:0;right:0;height:3px;background-color:#947358;display:block}.write-page .loading-state{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.write-page .loading-state .loading-spinner{width:50px;height:50px;border:5px solid #f5f5f5;border-top:5px solid #947358;border-radius:50%;margin:0 auto 20px;animation:spin 1s linear infinite}.write-page .loading-state .loading-text{color:#666}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.write-page .error-state{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.write-page .error-state .error-icon{font-size:50px;margin-bottom:20px;color:#e74c3c}.write-page .error-state .error-title{font-size:20px;color:#333;margin-bottom:10px}.write-page .error-state .error-desc{color:#666;margin-bottom:25px}.write-page .error-state .error-button{background-color:#947358;color:#fff;border:none;border-radius:4px;padding:10px 30px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.write-page .error-state .error-button:hover{background-color:#704c35}.write-page .work-empty{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.write-page .work-empty .empty-icon{color:#947358;font-size:48px;margin-bottom:20px}.write-page .work-empty .empty-title{font-size:20px;color:#333;margin-bottom:10px}.write-page .work-empty .empty-desc{color:#666;margin-bottom:25px}.write-page .work-empty .empty-button{background-color:#fb7d46;color:#fff;border:none;border-radius:4px;padding:10px 30px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.write-page .work-empty .empty-button:hover{background-color:#fa6c2e}.write-page .work-item{display:flex;background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,.1);margin-bottom:20px}.write-page .work-item .work-cover{width:150px;position:relative;flex-shrink:0}.write-page .work-item .work-category{position:absolute;top:10px;right:10px;background-color:rgba(0,0,0,.5);color:#fff;padding:4px 8px;border-radius:4px;font-size:12px}.write-page .work-item .work-status{position:absolute;bottom:10px;left:10px;background-color:rgba(0,0,0,.5);color:#fff;padding:4px 8px;border-radius:4px;font-size:12px}.write-page .work-item .work-status.status-completed{background-color:rgba(25,135,84,.7)}.write-page .work-item .work-status.status-draft{background-color:rgba(108,117,125,.7)}.write-page .work-item .work-info{flex-grow:1;padding:20px}.write-page .work-item .work-title{font-size:20px;color:#704c35;margin:0 0 10px}.write-page .work-item .work-stats{display:flex;color:#666;font-size:14px;margin-bottom:10px}.write-page .work-item .work-stats span{margin-right:15px}.write-page .work-item .work-desc{color:#666;font-size:14px;line-height:1.5;margin-bottom:15px}.write-page .work-item .work-update{color:#888;font-size:13px;margin-bottom:15px}.write-page .work-item .work-actions{display:flex;gap:10px}.write-page .work-item .work-action{padding:8px 15px;border-radius:4px;background-color:#f5f5f5;border:none;color:#666;cursor:pointer;transition:all .3s ease}.write-page .work-item .work-action:hover{background-color:#e0e0e0}.write-page .work-item .work-action.primary{background-color:#fb7d46;color:#fff}.write-page .work-item .work-action.primary:hover{background-color:#fa6c2e}.write-page .work-item .activity-section{margin-top:16px;padding:16px;background:#f8f9fa;border-radius:8px;border:1px solid #e9ecef}.write-page .work-item .activity-section-title{margin:0 0 12px 0;font-size:16px;font-weight:600;color:#333}.write-page .work-item .activity-item{background:#fff;border-radius:6px;padding:12px;margin-bottom:12px;border:1px solid #e9ecef}.write-page .work-item .activity-item:last-child{margin-bottom:0}.write-page .work-item .activity-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.write-page .work-item .activity-name{font-weight:600;color:#333;font-size:14px}.write-page .work-item .activity-status{background:#28a745;color:#fff;padding:2px 8px;border-radius:12px;font-size:12px}.write-page .work-item .activity-description{color:#666;font-size:13px;line-height:1.4;margin-bottom:12px}.write-page .work-item .activity-news{margin-bottom:12px}.write-page .work-item .news-title{font-size:13px;font-weight:600;color:#333;margin-bottom:6px}.write-page .work-item .news-item{display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:#f8f9fa;border-radius:4px;margin-bottom:4px;cursor:pointer;transition:background .2s}.write-page .work-item .news-item:hover{background:#e9ecef}.write-page .work-item .news-item:last-child{margin-bottom:0}.write-page .work-item .news-item-title{font-size:12px;color:#666;flex:1}.write-page .work-item .news-arrow{color:#999;font-size:12px}.write-page .work-item .activity-form{border-top:1px solid #e9ecef;padding-top:12px}.write-page .work-item .form-status{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.write-page .work-item .form-title{font-size:13px;font-weight:600;color:#333}.write-page .work-item .form-status-text{font-size:12px;padding:2px 6px;border-radius:10px}.write-page .work-item .form-status-text.status-incomplete{background:#ffeaa7;color:#d63031}.write-page .work-item .form-status-text.status-complete{background:#00b894;color:#fff}.write-page .work-item .form-button{width:100%;padding:8px;background:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;transition:background .2s}.write-page .work-item .form-button:hover{background:#0056b3}.write-page .sidebar-section{background-color:#fff;border-radius:8px;padding:20px;margin-bottom:25px;box-shadow:0 2px 4px rgba(0,0,0,.1)}.write-page .sidebar-section .sidebar-title{font-size:18px;margin-bottom:15px;color:#704c35;padding-bottom:10px;border-bottom:1px solid #eee}.write-page .sidebar-section .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.write-page .sidebar-section .stats-grid .stat-item{text-align:center;padding:10px;background-color:#f5f5f5;border-radius:4px}.write-page .sidebar-section .stats-grid .stat-item .stat-value{font-size:20px;font-weight:600;color:#947358;margin-bottom:5px}.write-page .sidebar-section .stats-grid .stat-item .stat-label{font-size:14px;color:#666}.write-page .sidebar-section .guide-list{list-style:none;padding:0;margin:0}.write-page .sidebar-section .guide-list .guide-item{padding:8px 0;border-bottom:1px solid #f5f5f5}.write-page .sidebar-section .guide-list .guide-item:last-child{border-bottom:none}.write-page .sidebar-section .guide-list .guide-item .guide-link{color:#947358;text-decoration:none;transition:color .3s ease}.write-page .sidebar-section .guide-list .guide-item .guide-link:hover{color:#704c35;text-decoration:underline}.write-page .sidebar-section .activity-list{display:flex;flex-direction:column;gap:15px}.write-page .sidebar-section .activity-list .activity-item{padding:15px;background-color:#f5f5f5;border-radius:4px;border-left:3px solid #947358}.write-page .sidebar-section .activity-list .activity-item .activity-title{font-size:16px;color:#333;margin:0 0 10px}.write-page .sidebar-section .activity-list .activity-item .activity-desc{font-size:14px;color:#666;margin:0 0 10px;line-height:1.4}.write-page .sidebar-section .activity-list .activity-item .activity-date{font-size:13px;color:#888;margin:0 0 10px}.write-page .sidebar-section .activity-list .activity-item .activity-link{display:inline-block;color:#947358;text-decoration:none;font-size:14px;font-weight:600}.write-page .sidebar-section .activity-list .activity-item .activity-link:hover{text-decoration:underline}@media(max-width: 992px){.write-page .write-container{grid-template-columns:1fr}.write-page .work-cover{width:100px}}@media(max-width: 576px){.write-page .work-item{flex-direction:column}.write-page .work-item .work-cover{width:100%;height:140px}.write-page .work-item .work-actions{flex-wrap:wrap}.write-page .work-item .work-actions .work-action{flex:1 0 auto}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 310:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_1_id_c0596958_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(240);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_1_id_c0596958_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_1_id_c0596958_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_1_id_c0596958_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_1_id_c0596958_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 311:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.work-search[data-v-c0596958]{margin-left:auto;border:1px solid #e8e5df;border-radius:7px;padding:10px 12px;width:240px;font-size:13px;background:white}.work-search[data-v-c0596958]:focus-visible{outline:2px solid #947358}.work-item[data-v-c0596958]{padding:20px!important;gap:20px!important}.work-cover[data-v-c0596958]{width:92px!important;height:124px!important;flex:0 0 92px!important;border-radius:7px!important}.work-title[data-v-c0596958]{font-size:18px!important;margin-bottom:8px!important}.work-desc[data-v-c0596958]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:13px!important}.work-actions[data-v-c0596958]{margin-top:12px!important}.work-action[data-v-c0596958]{font-size:12px!important;padding:8px 13px!important}.work-update[data-v-c0596958]{font-size:11px!important}.work-info[data-v-c0596958]{padding:0!important}.work-stats[data-v-c0596958]{font-size:12px!important}.section-header[data-v-c0596958]{gap:16px}.activity-section[data-v-c0596958]{margin-top:16px!important;padding-top:12px!important}@media(max-width:900px){.work-search[data-v-c0596958]{width:180px}}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 423:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/index.vue?vue&type=template&id=c0596958&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "write-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-c0596958><h1 class=\"page-title\" data-v-c0596958>创作中心</h1></div> "), _vm._ssrNode("<div class=\"write-container\" data-v-c0596958>", "</div>", [_vm._ssrNode("<div class=\"works-section\" data-v-c0596958>", "</div>", [_vm._ssrNode("<div class=\"section-header\" data-v-c0596958><h2 class=\"section-title\" data-v-c0596958>我的作品</h2> <input aria-label=\"搜索作品\" placeholder=\"搜索作品名或简介\"" + _vm._ssrAttr("value", _vm.workQuery) + " class=\"work-search\" data-v-c0596958> <button class=\"new-button\" data-v-c0596958>+ 创建新作品</button></div> <div class=\"tabs\" data-v-c0596958><button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'all'
  }) + " data-v-c0596958>全部作品</button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'ongoing'
  }) + " data-v-c0596958>连载中</button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'completed'
  }) + " data-v-c0596958>已完结</button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'draft'
  }) + " data-v-c0596958>草稿箱</button></div> "), _vm._ssrNode("<div class=\"works-list\" data-v-c0596958>", "</div>", [_vm.loading ? _vm._ssrNode("<div class=\"loading-state\" data-v-c0596958>", "</div>", [_vm._ssrNode("<div class=\"loading-spinner\" data-v-c0596958></div> <p class=\"loading-text\" data-v-c0596958>正在加载作品列表...</p>")], 2) : _vm.error ? _vm._ssrNode("<div class=\"error-state\" data-v-c0596958>", "</div>", [_vm._ssrNode("<div aria-hidden=\"true\" class=\"error-icon\" data-v-c0596958>", "</div>", [_c('SiteIcon', {
    attrs: {
      "name": "warning"
    }
  })], 1), _vm._ssrNode(" <h3 class=\"error-title\" data-v-c0596958>加载失败</h3> <p class=\"error-desc\" data-v-c0596958>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button class=\"error-button\" data-v-c0596958>重试</button>")], 2) : !_vm.filteredWorks.length ? _vm._ssrNode("<div class=\"work-empty\" data-v-c0596958>", "</div>", [_vm._ssrNode("<div aria-hidden=\"true\" class=\"empty-icon\" data-v-c0596958>", "</div>", [_c('SiteIcon', {
    attrs: {
      "name": "edit"
    }
  })], 1), _vm._ssrNode(" <h3 class=\"empty-title\" data-v-c0596958>" + _vm._ssrEscape(_vm._s(_vm.activeTab === 'all' ? '您还没有创建任何作品' : '没有符合条件的作品')) + "</h3> " + (_vm.activeTab === 'all' ? "<p class=\"empty-desc\" data-v-c0596958>点击&quot;创建新作品&quot;按钮开始您的创作之旅</p>" : "<!---->") + " " + (_vm.activeTab === 'all' ? "<button class=\"empty-button\" data-v-c0596958>+ 立即创建</button>" : "<!---->"))], 2) : _vm._e(), _vm._ssrNode(" " + _vm._ssrList(_vm.filteredWorks, function (work) {
    return "<div class=\"work-item\" data-v-c0596958><div class=\"work-cover\"" + _vm._ssrStyle(null, work.picUrl ? `background-image: url(${work.picUrl}); background-size: cover; background-position: center;` : `background-color: ${work.color}`, null) + " data-v-c0596958><span class=\"work-category\" data-v-c0596958>" + _vm._ssrEscape(_vm._s(work.category)) + "</span> <span" + _vm._ssrClass("work-status", {
      'status-completed': work.status === '已完结',
      'status-draft': work.status === '草稿'
    }) + " data-v-c0596958>" + _vm._ssrEscape(_vm._s(work.status)) + "</span></div> <div class=\"work-info\" data-v-c0596958><h3 class=\"work-title\" data-v-c0596958>" + _vm._ssrEscape(_vm._s(work.title)) + "</h3> <p class=\"work-stats\" data-v-c0596958><span data-v-c0596958>" + _vm._ssrEscape(_vm._s(work.status)) + "</span> <span data-v-c0596958>" + _vm._ssrEscape(_vm._s(work.wordCount) + "字") + "</span></p> <p class=\"work-desc\" data-v-c0596958>" + _vm._ssrEscape(_vm._s(work.description)) + "</p> <p class=\"work-update\" data-v-c0596958>" + _vm._ssrEscape("最近更新: " + _vm._s(work.lastUpdate)) + "</p> <div class=\"work-actions\" data-v-c0596958><button class=\"work-action primary\" data-v-c0596958>开始写作</button> <button class=\"work-action\" data-v-c0596958>作品设置</button></div> " + (work.activityInfo && work.activityInfo.hasActivity ? "<div class=\"activity-section\" data-v-c0596958><h4 class=\"activity-section-title\" data-v-c0596958>创作活动</h4> <div class=\"activity-list\" data-v-c0596958>" + _vm._ssrList(work.activityInfo.activities, function (activity) {
      return "<div class=\"activity-item\" data-v-c0596958><div class=\"activity-header\" data-v-c0596958><div class=\"activity-name\" data-v-c0596958>" + _vm._ssrEscape(_vm._s(activity.activity_name)) + "</div> <span class=\"activity-status\" data-v-c0596958>活动中</span></div> <div class=\"activity-description\" data-v-c0596958>" + _vm._ssrEscape(_vm._s(activity.activity_description)) + "</div> " + (activity.activity_news && activity.activity_news.length > 0 ? "<div class=\"activity-news\" data-v-c0596958><div class=\"news-title\" data-v-c0596958>活动资讯</div> <div class=\"news-list\" data-v-c0596958>" + _vm._ssrList(activity.activity_news, function (news) {
        return "<div class=\"news-item\" data-v-c0596958><div class=\"news-item-title\" data-v-c0596958>" + _vm._ssrEscape(_vm._s(news.title)) + "</div> <i class=\"el-icon-arrow-right\" data-v-c0596958></i></div>";
      }) + "</div></div>" : "<!---->") + " " + (activity.required_fields && activity.required_fields.length > 0 ? "<div class=\"activity-form\" data-v-c0596958><div class=\"form-status\" data-v-c0596958><div class=\"form-title\" data-v-c0596958>活动参与信息</div> <div" + _vm._ssrClass("form-status-text", _vm.getFormStatusClass(work.id, activity.tag_id)) + " data-v-c0596958>" + _vm._ssrEscape("\n                        " + _vm._s(_vm.getFormStatusText(work.id, activity.tag_id, activity.required_fields)) + "\n                      ") + "</div></div> <button class=\"form-button\" data-v-c0596958>" + _vm._ssrEscape("\n                      " + _vm._s(_vm.hasFilledForm(work.id, activity.tag_id) ? '修改信息' : '填写信息') + "\n                    ") + "</button></div>" : "<!---->") + "</div>";
    }) + "</div></div>" : "<!---->") + "</div></div>";
  }))], 2)], 2), _vm._ssrNode(" <div class=\"sidebar\" data-v-c0596958><div class=\"sidebar-section\" data-v-c0596958><h3 class=\"sidebar-title\" data-v-c0596958>创作数据</h3> <div class=\"stats-grid\" data-v-c0596958><div class=\"stat-item\" data-v-c0596958><div class=\"stat-value\" data-v-c0596958>" + _vm._ssrEscape(_vm._s(_vm.stats.totalWorks)) + "</div> <div class=\"stat-label\" data-v-c0596958>作品总数</div></div> <div class=\"stat-item\" data-v-c0596958><div class=\"stat-value\" data-v-c0596958>" + _vm._ssrEscape(_vm._s(_vm.stats.totalWords)) + "</div> <div class=\"stat-label\" data-v-c0596958>总字数</div></div></div></div></div>")], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/write/index.vue?vue&type=template&id=c0596958&scoped=true

// EXTERNAL MODULE: ./components/ui/SiteIcon.vue + 5 modules
var SiteIcon = __webpack_require__(122);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/index.vue?vue&type=script&lang=js

/* harmony default export */ var writevue_type_script_lang_js = ({
  components: {
    SiteIcon: SiteIcon["a" /* default */]
  },
  head() {
    return {
      title: '创作中心 - 原木社区'
    };
  },
  data() {
    return {
      activeTab: 'all',
      workQuery: '',
      works: [],
      stats: {
        totalWorks: 0,
        totalWords: '0',
        totalViews: '0',
        totalFavorites: 0
      },
      loading: false,
      error: null,
      // 创作活动相关数据
      activityData: {},
      activityFormData: {},
      showActivityForm: false,
      currentActivity: null
    };
  },
  async mounted() {
    this.checkLoginStatus();
    await this.fetchWorks();
    await this.loadActivityData();
  },
  computed: {
    filteredWorks() {
      const works = this.works.filter(work => `${work.title} ${work.description}`.toLowerCase().includes(this.workQuery.trim().toLowerCase()));
      if (this.activeTab === 'all') {
        return works;
      } else if (this.activeTab === 'ongoing') {
        return works.filter(work => work.status === '连载中');
      } else if (this.activeTab === 'completed') {
        return works.filter(work => work.status === '已完结');
      } else if (this.activeTab === 'draft') {
        return works.filter(work => work.status === '草稿');
      }
      return this.works;
    }
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$message.warning('请先登录');
        this.$router.push('/login');
      }
    },
    async fetchWorks() {
      this.loading = true;
      this.error = null;
      try {
        // 使用新添加的API接口获取用户作品列表
        const response = await this.$api.essays.getNovelsOf();
        if (response && Array.isArray(response)) {
          // 转换API返回的数据格式为组件所需的格式
          this.works = response.map(novel => {
            // 根据novel_type确定分类
            let category = novel.novel_type === 'manga' ? '漫画' : '小说';
            if (novel.novel_type === 'fiction') {
              category = '小说';
            } else if (novel.novel_type === 'nonfiction') {
              category = '非虚构';
            } else if (novel.novel_type === 'poetry') {
              category = '诗歌';
            } else if (novel.novel_type === 'world') {
              category = '世界设定';
            }

            // 根据is_complete确定状态
            let status = '连载中';
            if (novel.is_complete == 1) {
              status = '已完结';
            } else if (novel.is_personal == 1) {
              status = '草稿';
            }

            // 获取封面图片URL，如果没有则使用随机颜色作为封面背景色
            const colors = ['#a8d8ea', '#aa96da', '#c7ceea', '#f6c3d5', '#e4f9d4', '#f9d4d4'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const picUrl = novel.picUrl || null;

            // 格式化最后更新时间
            const lastUpdate = novel.update_time ? this.formatDate(novel.update_time) : '未知';

            // 格式化字数
            const wordCount = novel.text_count ? this.formatNumber(novel.text_count) : novel.word_count ? this.formatNumber(novel.word_count) : '0';
            return {
              id: novel.novel_id,
              title: novel.name,
              status,
              category,
              wordCount,
              chapterCount: novel.article_count || 0,
              description: novel.content || '暂无简介',
              lastUpdate,
              color,
              picUrl
            };
          });

          // 更新统计数据
          this.updateStats();

          // 缓存作品数据
          localStorage.setItem('LogHomeUserEssay', JSON.stringify(response));
        }
      } catch (error) {
        console.error('获取作品列表失败:', error);
        this.error = '获取作品列表失败，请稍后重试';

        // 尝试从缓存获取数据
        const cachedWorks = localStorage.getItem('LogHomeUserEssay');
        if (cachedWorks) {
          const parsedWorks = JSON.parse(cachedWorks);
          if (Array.isArray(parsedWorks)) {
            this.works = this.transformWorks(parsedWorks);
            this.updateStats();
          }
        }
      } finally {
        this.loading = false;
      }
    },
    transformWorks(novels) {
      return novels.map(novel => {
        // 根据novel_type确定分类
        let category = novel.novel_type === 'manga' ? '漫画' : '小说';
        if (novel.novel_type === 'fiction') {
          category = '小说';
        } else if (novel.novel_type === 'nonfiction') {
          category = '非虚构';
        } else if (novel.novel_type === 'poetry') {
          category = '诗歌';
        } else if (novel.novel_type === 'world') {
          category = '世界设定';
        }

        // 根据is_complete确定状态
        let status = '连载中';
        if (novel.is_complete == 1) {
          status = '已完结';
        } else if (novel.is_personal == 1) {
          status = '草稿';
        }

        // 获取封面图片URL，如果没有则使用随机颜色作为封面背景色
        const colors = ['#a8d8ea', '#aa96da', '#c7ceea', '#f6c3d5', '#e4f9d4', '#f9d4d4'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const picUrl = novel.picUrl || null;

        // 格式化最后更新时间
        const lastUpdate = novel.update_time ? this.formatDate(novel.update_time) : '未知';

        // 格式化字数
        const wordCount = novel.text_count ? this.formatNumber(novel.text_count) : novel.word_count ? this.formatNumber(novel.word_count) : '0';
        return {
          id: novel.novel_id || novel.id,
          // 优先使用novel_id，兼容缓存数据
          title: novel.name,
          status,
          category,
          wordCount,
          chapterCount: novel.article_count || 0,
          description: novel.content || '暂无简介',
          lastUpdate,
          color,
          picUrl
        };
      });
    },
    updateStats() {
      // 计算总作品数
      this.stats.totalWorks = this.works.length;

      // 计算总字数
      const totalWords = this.works.reduce((sum, work) => {
        const wordCount = parseInt(work.wordCount.replace(/,/g, '')) || 0;
        return sum + wordCount;
      }, 0);
      this.stats.totalWords = this.formatNumber(totalWords);

      // 暂时使用默认值，后续可以通过API获取
      this.stats.totalViews = '0';
      this.stats.totalFavorites = 0;
    },
    formatDate(dateString) {
      try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      } catch (error) {
        return '未知';
      }
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    createNewWork() {
      // 跳转到创建新作品页面
      this.$router.push('/write/new');
    },
    openEditPage(workId) {
      // 在新窗口中打开编辑页面
      const url = `/write/edit/${workId}`;
      window.open(url, '_blank');
    },
    // 创作活动相关方法
    openNewsLink(news) {
      if (news.pc_link) {
        window.open(news.pc_link, '_blank');
      }
    },
    openActivityForm(workId, activity) {
      // 打开活动信息填写表单
      this.$router.push(`/write/activity-form/${workId}/${activity.tag_id}`);
    },
    hasFilledForm(workId, tagId) {
      // 检查是否已填写表单 - 基于服务器返回的数据
      const work = this.works.find(w => w.id === workId);
      if (!work || !work.activityInfo || !work.activityInfo.userInfo) return false;
      return work.activityInfo.userInfo.some(info => info.tag_id === tagId);
    },
    getFormStatusText(workId, tagId, requiredFields) {
      if (!this.hasFilledForm(workId, tagId)) {
        const requiredCount = requiredFields.filter(field => field.required).length;
        return requiredCount > 0 ? `有${requiredCount}项必填信息未填写` : '信息未填写';
      }
      const work = this.works.find(w => w.id === workId);
      if (!work || !work.activityInfo || !work.activityInfo.userInfo) return '信息未填写';
      const userInfo = work.activityInfo.userInfo.find(info => info.tag_id === tagId);
      if (!userInfo) return '信息未填写';

      // 从 information_data 字段解析实际的表单数据
      let formData = {};
      try {
        formData = userInfo.information_data ? JSON.parse(userInfo.information_data) : {};
      } catch (e) {
        console.error('解析表单数据失败:', e);
        formData = {};
      }
      const missingRequired = requiredFields.filter(field => field.required && (!formData[field.name] || formData[field.name].toString().trim() === ''));
      return missingRequired.length > 0 ? `还有${missingRequired.length}项必填信息未完善` : '信息已完善';
    },
    getFormStatusClass(workId, tagId) {
      if (!this.hasFilledForm(workId, tagId)) return 'status-incomplete';
      const work = this.works.find(w => w.id === workId);
      if (!work || !work.activityInfo || !work.activityInfo.userInfo) return 'status-incomplete';
      const userInfo = work.activityInfo.userInfo.find(info => info.tag_id === tagId);
      if (!userInfo) return 'status-incomplete';
      const activity = work.activityInfo.activities.find(act => act.tag_id === tagId);
      if (!activity) return 'status-incomplete';

      // 从 information_data 字段解析实际的表单数据
      let formData = {};
      try {
        formData = userInfo.information_data ? JSON.parse(userInfo.information_data) : {};
      } catch (e) {
        console.error('解析表单数据失败:', e);
        formData = {};
      }
      const missingRequired = activity.required_fields.filter(field => field.required && (!formData[field.name] || formData[field.name].toString().trim() === ''));
      return missingRequired.length > 0 ? 'status-incomplete' : 'status-complete';
    },
    getRequiredFieldsByTagId(tagId) {
      // 根据tagId获取必填字段
      for (const work of this.works) {
        if (work.activityInfo && work.activityInfo.activities) {
          const activity = work.activityInfo.activities.find(a => a.tag_id === tagId);
          if (activity) {
            return activity.required_fields;
          }
        }
      }
      return null;
    },
    // 加载创作活动数据
    async loadActivityData() {
      try {
        // 为每个作品加载活动信息
        for (const work of this.works) {
          await this.loadWorkActivityInfo(work);
        }
      } catch (error) {
        console.error('加载活动数据失败:', error);
      }
    },
    async loadWorkActivityInfo(work) {
      try {
        const response = await this.$api.essays.getNovelActivity(work.id);
        this.$set(work, 'activityInfo', response);
        console.log(work);
      } catch (error) {
        console.error(`加载作品 ${work.id} 的活动信息失败:`, error);
        this.$set(work, 'activityInfo', {
          hasActivity: false,
          activities: []
        });
      }
    },
    // 提交活动信息
    async submitActivityInfo(workId, tagId, formData) {
      try {
        const response = await this.$api.essays.submitActivityInfo(workId, tagId, formData);
        if (response.code === 200) {
          // 保存到本地存储
          const key = `activity_form_${workId}_${tagId}`;
          localStorage.setItem(key, JSON.stringify(formData));

          // 重新加载活动信息
          const work = this.works.find(w => w.id === workId);
          if (work) {
            await this.loadWorkActivityInfo(work);
          }
          return {
            success: true,
            message: '提交成功'
          };
        } else {
          return {
            success: false,
            message: response.message || '提交失败'
          };
        }
      } catch (error) {
        console.error('提交活动信息失败:', error);
        return {
          success: false,
          message: '网络错误，请重试'
        };
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/write/index.vue?vue&type=script&lang=js
 /* harmony default export */ var pages_writevue_type_script_lang_js = (writevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/write/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(308)
if (style0.__inject__) style0.__inject__(context)
var style1 = __webpack_require__(310)
if (style1.__inject__) style1.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_writevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "c0596958",
  "3f8d31cf"
  
)

/* harmony default export */ var write = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=index.js.map