exports.ids = [66];
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

/***/ 361:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(514);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("60bc5710", content, true, context)
};

/***/ }),

/***/ 513:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_tagId_vue_vue_type_style_index_0_id_a6deb860_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(361);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_tagId_vue_vue_type_style_index_0_id_a6deb860_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_tagId_vue_vue_type_style_index_0_id_a6deb860_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_tagId_vue_vue_type_style_index_0_id_a6deb860_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_tagId_vue_vue_type_style_index_0_id_a6deb860_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 514:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".activity-form-page[data-v-a6deb860]{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:40px 20px}.form-header[data-v-a6deb860]{width:100%;max-width:600px;display:flex;align-items:center;margin-bottom:32px;padding:20px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.08)}.back-button[data-v-a6deb860]{background:none;border:none;color:#007bff;cursor:pointer;font-size:16px;margin-right:16px;padding:8px 12px;border-radius:6px;transition:all .2s}.back-button[data-v-a6deb860]:hover{background:#f8f9fa;transform:translateX(-2px)}.form-title[data-v-a6deb860]{margin:0;font-size:24px;font-weight:600;color:#333;text-align:center;flex:1}.form-container[data-v-a6deb860]{width:100%;max-width:600px;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.1);overflow:hidden}.form-content[data-v-a6deb860]{padding:40px}.form-content .form-fields .form-field[data-v-a6deb860]{margin-bottom:24px}.form-content .form-fields .field-label[data-v-a6deb860]{display:block;margin-bottom:8px;font-weight:500;color:#333;font-size:15px}.form-content .form-fields .required-mark[data-v-a6deb860]{color:#dc3545;margin-left:2px}.form-content .form-fields .form-input[data-v-a6deb860]{width:100%;padding:14px 16px;border:2px solid #e9ecef;border-radius:8px;font-size:15px;transition:all .3s ease;background:#fafbfc}.form-content .form-fields .form-input[data-v-a6deb860]:focus{outline:none;border-color:#007bff;background:#fff;box-shadow:0 0 0 3px rgba(0,123,255,.1);transform:translateY(-1px)}.form-content .form-fields .form-input[data-v-a6deb860]:hover{border-color:#007bff;background:#fff}.form-actions[data-v-a6deb860]{display:flex;gap:16px;justify-content:center;margin-top:40px;padding-top:32px;border-top:1px solid #e9ecef}.cancel-button[data-v-a6deb860],.submit-button[data-v-a6deb860]{padding:12px 32px;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;transition:all .3s ease;min-width:120px}.cancel-button[data-v-a6deb860]{background:#fff;border:2px solid #e9ecef;color:#666}.cancel-button[data-v-a6deb860]:hover{background:#f8f9fa;border-color:#007bff;color:#007bff;transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.1)}.submit-button[data-v-a6deb860]{background:linear-gradient(135deg, #007bff 0%, #0056b3 100%);border:2px solid #007bff;color:#fff}.submit-button[data-v-a6deb860]:hover:not(:disabled){background:linear-gradient(135deg, #0056b3 0%, #004085 100%);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,123,255,.3)}.submit-button[data-v-a6deb860]:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}.loading-state[data-v-a6deb860],.error-state[data-v-a6deb860]{width:100%;max-width:600px;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.1);text-align:center;padding:80px 40px}.loading-spinner[data-v-a6deb860]{width:48px;height:48px;border:4px solid #f3f3f3;border-top:4px solid #007bff;border-radius:50%;animation:spin-a6deb860 1s linear infinite;margin:0 auto 24px}@keyframes spin-a6deb860{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.loading-state p[data-v-a6deb860]{color:#666;font-size:16px;margin:0}.error-icon[data-v-a6deb860]{font-size:64px;margin-bottom:24px}.error-state h3[data-v-a6deb860]{margin:0 0 12px 0;color:#333;font-size:20px}.error-state p[data-v-a6deb860]{margin:0 0 24px 0;color:#666;font-size:16px}.error-state button[data-v-a6deb860]{padding:12px 24px;background:linear-gradient(135deg, #007bff 0%, #0056b3 100%);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:15px;font-weight:500;transition:all .3s ease}.error-state button[data-v-a6deb860]:hover{background:linear-gradient(135deg, #0056b3 0%, #004085 100%);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,123,255,.3)}@media(max-width: 768px){.activity-form-page[data-v-a6deb860]{padding:20px 16px}.form-header[data-v-a6deb860]{padding:16px;margin-bottom:24px}.form-title[data-v-a6deb860]{font-size:20px}.form-content[data-v-a6deb860]{padding:24px}.form-actions[data-v-a6deb860]{flex-direction:column;gap:12px}.cancel-button[data-v-a6deb860],.submit-button[data-v-a6deb860]{width:100%}.loading-state[data-v-a6deb860],.error-state[data-v-a6deb860]{padding:60px 24px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 619:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/activity-form/_workId/_tagId.vue?vue&type=template&id=a6deb860&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "activity-form-page"
  }, [_vm._ssrNode("<div class=\"form-header\" data-v-a6deb860><button class=\"back-button\" data-v-a6deb860>返回</button> <h1 class=\"form-title\" data-v-a6deb860>" + _vm._ssrEscape(_vm._s(_vm.currentActivity ? _vm.currentActivity.activity_name : '活动信息填写')) + "</h1></div> "), _vm.currentActivity && _vm.currentActivity.required_fields ? _vm._ssrNode("<div class=\"form-container\" data-v-a6deb860>", "</div>", [_vm._ssrNode("<div class=\"form-content\" data-v-a6deb860><div class=\"form-fields\" data-v-a6deb860>" + _vm._ssrList(_vm.currentActivity.required_fields, function (field) {
    return "<div class=\"form-field\" data-v-a6deb860><label class=\"field-label\" data-v-a6deb860>" + _vm._ssrEscape("\n            " + _vm._s(field.name) + "\n            ") + (field.required ? "<span class=\"required-mark\" data-v-a6deb860>*</span>" : "<!---->") + "</label> <input" + _vm._ssrAttr("placeholder", field.placeholder || '请输入' + field.name) + _vm._ssrAttr("maxlength", field.maxLength) + _vm._ssrAttr("value", _vm.activityFormData[field.name]) + " class=\"form-input\" data-v-a6deb860></div>";
  }) + "</div> <div class=\"form-actions\" data-v-a6deb860><button type=\"button\" class=\"cancel-button\" data-v-a6deb860>取消</button> <button type=\"button\"" + _vm._ssrAttr("disabled", _vm.submitting) + " class=\"submit-button\" data-v-a6deb860>" + _vm._ssrEscape("\n          " + _vm._s(_vm.submitting ? '提交中...' : '提交') + "\n        ") + "</button></div></div>")], 2) : _vm.loading ? _vm._ssrNode("<div class=\"loading-state\" data-v-a6deb860><div class=\"loading-spinner\" data-v-a6deb860></div> <p data-v-a6deb860>正在加载活动信息...</p></div>") : _vm.error ? _vm._ssrNode("<div class=\"error-state\" data-v-a6deb860>", "</div>", [_vm._ssrNode("<div aria-hidden=\"true\" class=\"error-icon\" data-v-a6deb860>", "</div>", [_c('SiteIcon', {
    attrs: {
      "name": "warning"
    }
  })], 1), _vm._ssrNode(" <h3 data-v-a6deb860>加载失败</h3> <p data-v-a6deb860>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button data-v-a6deb860>重试</button>")], 2) : _vm._e()], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/write/activity-form/_workId/_tagId.vue?vue&type=template&id=a6deb860&scoped=true

// EXTERNAL MODULE: ./components/ui/SiteIcon.vue + 5 modules
var SiteIcon = __webpack_require__(150);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/activity-form/_workId/_tagId.vue?vue&type=script&lang=js

/* harmony default export */ var _tagIdvue_type_script_lang_js = ({
  components: {
    SiteIcon: SiteIcon["a" /* default */]
  },
  name: 'ActivityForm',
  data() {
    return {
      currentActivity: null,
      activityFormData: {},
      loading: true,
      error: null,
      submitting: false
    };
  },
  async mounted() {
    await this.loadActivityInfo();
  },
  methods: {
    async loadActivityInfo() {
      try {
        this.loading = true;
        this.error = null;
        const workId = this.$route.params.workId;
        const tagId = this.$route.params.tagId;
        const response = await this.$api.essays.getNovelActivity(workId);
        if (response) {
          const activity = response.activities.find(a => a.tag_id == tagId);
          if (activity) {
            this.currentActivity = activity;
            // 如果已有填写的数据，预填充表单
            if (response.userInfo && response.userInfo.length > 0) {
              const existingInfo = response.userInfo.find(info => info.tag_id == tagId);
              if (existingInfo) {
                try {
                  this.activityFormData = existingInfo.information_data ? JSON.parse(existingInfo.information_data) : {};
                } catch (e) {
                  console.error('解析已填写的表单数据失败:', e);
                  this.activityFormData = {};
                }
              } else {
                this.activityFormData = {};
              }
            } else {
              this.activityFormData = {};
            }
          } else {
            this.error = '未找到对应的活动信息';
          }
        } else {
          this.error = '加载活动信息失败';
        }
      } catch (error) {
        console.error('加载活动信息失败:', error);
        this.error = '网络错误，请重试';
      } finally {
        this.loading = false;
      }
    },
    async submitActivityForm() {
      try {
        var _this$currentActivity;
        // 验证必填字段
        if ((_this$currentActivity = this.currentActivity) !== null && _this$currentActivity !== void 0 && _this$currentActivity.required_fields) {
          for (const field of this.currentActivity.required_fields) {
            if (field.required && (!this.activityFormData[field.name] || this.activityFormData[field.name].toString().trim() === '')) {
              this.$message.error(`请填写${field.name}`);
              return;
            }
          }
        }
        this.submitting = true;
        const workId = this.$route.params.workId;
        const tagId = this.$route.params.tagId;
        const response = await this.$api.essays.submitActivityInfo(workId, tagId, this.activityFormData);
        if (response.success === true) {
          this.$message.success('提交成功！');
          this.goBack();
        } else {
          this.$message.error(response.message || '提交失败，请重试');
        }
      } catch (error) {
        console.error('提交表单失败:', error);
        this.$message.error('网络错误，请重试');
      } finally {
        this.submitting = false;
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
});
// CONCATENATED MODULE: ./pages/write/activity-form/_workId/_tagId.vue?vue&type=script&lang=js
 /* harmony default export */ var _workId_tagIdvue_type_script_lang_js = (_tagIdvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/write/activity-form/_workId/_tagId.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(513)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  _workId_tagIdvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "a6deb860",
  "b665d6d8"
  
)

/* harmony default export */ var _tagId = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_tagId.js.map