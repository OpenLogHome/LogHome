exports.ids = [71];
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

/***/ 341:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(473);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("cd6de318", content, true, context)
};

/***/ }),

/***/ 472:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_599bbd1b_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(341);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_599bbd1b_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_599bbd1b_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_599bbd1b_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_599bbd1b_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 473:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".info-edit-page[data-v-599bbd1b]{width:100%;max-width:800px;margin:0 auto;padding:20px}.info-edit-page .page-header[data-v-599bbd1b]{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px}.info-edit-page .page-header .page-title[data-v-599bbd1b]{font-size:28px;color:#704c35;margin:0}.info-edit-page .page-header .back-link[data-v-599bbd1b]{color:#947358;text-decoration:none;font-size:16px}.info-edit-page .page-header .back-link[data-v-599bbd1b]:hover{text-decoration:underline}.info-edit-page .info-edit-container[data-v-599bbd1b]{background-color:#fff;border-radius:8px;padding:30px;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);display:flex;flex-direction:column;gap:30px}.info-edit-page .cover-section[data-v-599bbd1b]{display:flex;justify-content:center}.info-edit-page .cover-section .cover-preview[data-v-599bbd1b]{width:200px;height:260px;border-radius:8px;overflow:hidden;position:relative;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.15)}.info-edit-page .cover-section .cover-preview:hover .cover-overlay[data-v-599bbd1b]{opacity:1}.info-edit-page .cover-section .cover-preview .cover-overlay[data-v-599bbd1b]{position:absolute;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,.5);display:flex;flex-direction:column;justify-content:center;align-items:center;opacity:0;transition:opacity .3s;color:#fff}.info-edit-page .cover-section .cover-preview .cover-overlay i[data-v-599bbd1b]{font-size:32px;margin-bottom:10px}.info-edit-page .loading-state[data-v-599bbd1b]{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.info-edit-page .loading-state .loading-spinner[data-v-599bbd1b]{width:50px;height:50px;border:5px solid #f5f5f5;border-top:5px solid #947358;border-radius:50%;margin:0 auto 20px;animation:spin-599bbd1b 1s linear infinite}.info-edit-page .loading-state .loading-text[data-v-599bbd1b]{color:#666}@keyframes spin-599bbd1b{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.info-edit-page .error-state[data-v-599bbd1b]{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.info-edit-page .error-state .error-icon[data-v-599bbd1b]{font-size:50px;margin-bottom:20px;color:#e74c3c}.info-edit-page .error-state .error-title[data-v-599bbd1b]{font-size:20px;color:#333;margin-bottom:10px}.info-edit-page .error-state .error-desc[data-v-599bbd1b]{color:#666;margin-bottom:25px}.info-edit-page .error-state .error-button[data-v-599bbd1b]{background-color:#947358;color:#fff;border:none;border-radius:4px;padding:10px 30px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.info-edit-page .error-state .error-button[data-v-599bbd1b]:hover{background-color:#704c35}.upload-container[data-v-599bbd1b]{display:flex;flex-direction:column;align-items:center;gap:20px}.upload-container .cover-uploader[data-v-599bbd1b]{width:300px}.upload-container .cover-uploader .el-upload[data-v-599bbd1b]{width:100%;border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden;text-align:center;padding:20px 0}.upload-container .cover-uploader .el-upload[data-v-599bbd1b]:hover{border-color:#947358}.upload-container .cover-uploader .cover-uploader-icon[data-v-599bbd1b]{font-size:28px;color:#8c939d;width:100%;height:100px;line-height:100px;text-align:center}.upload-container .cover-uploader .cover-preview-image[data-v-599bbd1b]{max-width:100%;max-height:300px;display:block;margin:0 auto}.upload-container .cover-uploader .upload-tip[data-v-599bbd1b]{color:#666;font-size:14px;margin-top:10px;line-height:1.5}.upload-container .upload-actions[data-v-599bbd1b]{display:flex;justify-content:center;gap:20px;margin-top:20px}@media(max-width: 768px){.info-edit-page[data-v-599bbd1b]{padding:10px}.info-edit-page .page-header .page-title[data-v-599bbd1b]{font-size:24px}.info-edit-page .info-edit-container[data-v-599bbd1b]{padding:20px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 610:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/settings/info/_id.vue?vue&type=template&id=599bbd1b&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "info-edit-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-599bbd1b>", "</div>", [_vm._ssrNode("<h1 class=\"page-title\" data-v-599bbd1b>修改作品信息</h1> "), _c('nuxt-link', {
    staticClass: "back-link",
    attrs: {
      "to": `/write/settings/${_vm.$route.params.id}`
    }
  }, [_vm._v("返回作品设置")])], 2), _vm._ssrNode(" "), !_vm.loading && !_vm.error ? _vm._ssrNode("<div class=\"info-edit-container\" data-v-599bbd1b>", "</div>", [_vm._ssrNode("<div class=\"cover-section\" data-v-599bbd1b><div class=\"cover-preview\"" + _vm._ssrStyle(null, _vm.coverStyle, null) + " data-v-599bbd1b><div class=\"cover-overlay\" data-v-599bbd1b><i class=\"el-icon-camera\" data-v-599bbd1b></i> <span data-v-599bbd1b>点击更换封面</span></div></div></div> "), _vm._ssrNode("<div class=\"form-section\" data-v-599bbd1b>", "</div>", [_c('el-form', {
    attrs: {
      "model": _vm.novelForm,
      "label-position": "top"
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": "作品名称",
      "rules": [{
        required: true,
        message: '请输入作品名称',
        trigger: 'blur'
      }]
    }
  }, [_c('el-input', {
    attrs: {
      "placeholder": "请输入作品名称",
      "maxlength": "25",
      "show-word-limit": ""
    },
    model: {
      value: _vm.novelForm.title,
      callback: function ($$v) {
        _vm.$set(_vm.novelForm, "title", $$v);
      },
      expression: "novelForm.title"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "作品简介",
      "rules": [{
        required: true,
        message: '请输入作品简介',
        trigger: 'blur'
      }]
    }
  }, [_c('el-input', {
    attrs: {
      "type": "textarea",
      "placeholder": "请输入作品简介",
      "rows": 6,
      "maxlength": "300",
      "show-word-limit": ""
    },
    model: {
      value: _vm.novelForm.content,
      callback: function ($$v) {
        _vm.$set(_vm.novelForm, "content", $$v);
      },
      expression: "novelForm.content"
    }
  })], 1), _vm._v(" "), _c('el-form-item', [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.submitting
    },
    on: {
      "click": _vm.submitForm
    }
  }, [_vm._v("保存修改")]), _vm._v(" "), _c('el-button', {
    on: {
      "click": function ($event) {
        return _vm.$router.push(`/write/settings/${_vm.$route.params.id}`);
      }
    }
  }, [_vm._v("取消")])], 1)], 1)], 1)], 2) : _vm._e(), _vm._ssrNode(" "), _vm.loading ? _vm._ssrNode("<div class=\"loading-state\" data-v-599bbd1b>", "</div>", [_vm._ssrNode("<div class=\"loading-spinner\" data-v-599bbd1b></div> <p class=\"loading-text\" data-v-599bbd1b>正在加载作品信息...</p>")], 2) : _vm.error ? _vm._ssrNode("<div class=\"error-state\" data-v-599bbd1b>", "</div>", [_vm._ssrNode("<div aria-hidden=\"true\" class=\"error-icon\" data-v-599bbd1b>", "</div>", [_c('SiteIcon', {
    attrs: {
      "name": "warning"
    }
  })], 1), _vm._ssrNode(" <h3 class=\"error-title\" data-v-599bbd1b>加载失败</h3> <p class=\"error-desc\" data-v-599bbd1b>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button class=\"error-button\" data-v-599bbd1b>重试</button>")], 2) : _vm._e(), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "title": "上传封面",
      "visible": _vm.coverDialogVisible,
      "width": "50%"
    },
    on: {
      "update:visible": function ($event) {
        _vm.coverDialogVisible = $event;
      }
    }
  }, [_c('div', {
    staticClass: "upload-container"
  }, [_c('el-upload', {
    staticClass: "cover-uploader",
    attrs: {
      "action": "",
      "http-request": _vm.uploadCover,
      "show-file-list": false,
      "before-upload": _vm.beforeCoverUpload
    }
  }, [_vm.coverPreview ? _c('img', {
    staticClass: "cover-preview-image",
    attrs: {
      "src": _vm.coverPreview
    }
  }) : _c('i', {
    staticClass: "el-icon-plus cover-uploader-icon"
  }), _vm._v(" "), _c('div', {
    staticClass: "upload-tip"
  }, [_vm._v("点击上传封面图片"), _c('br'), _vm._v("建议尺寸: 741×962")])]), _vm._v(" "), _c('div', {
    staticClass: "upload-actions"
  }, [_c('el-button', {
    on: {
      "click": function ($event) {
        _vm.coverDialogVisible = false;
      }
    }
  }, [_vm._v("取消")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary",
      "disabled": !_vm.coverFile
    },
    on: {
      "click": _vm.confirmCoverUpload
    }
  }, [_vm._v("确认上传")])], 1)], 1)])], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/write/settings/info/_id.vue?vue&type=template&id=599bbd1b&scoped=true

// EXTERNAL MODULE: ./components/ui/SiteIcon.vue + 5 modules
var SiteIcon = __webpack_require__(150);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/settings/info/_id.vue?vue&type=script&lang=js

/* harmony default export */ var _idvue_type_script_lang_js = ({
  components: {
    SiteIcon: SiteIcon["a" /* default */]
  },
  head() {
    return {
      title: '修改作品信息 - 原木社区'
    };
  },
  data() {
    return {
      loading: true,
      error: null,
      submitting: false,
      novelForm: {
        title: '',
        content: ''
      },
      coverUrl: '',
      coverColor: '',
      coverDialogVisible: false,
      coverFile: null,
      coverPreview: ''
    };
  },
  computed: {
    coverStyle() {
      if (this.coverUrl) {
        return {
          backgroundImage: `url(${this.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      } else {
        // 随机颜色作为封面背景
        const colors = ['#a8d8ea', '#aa96da', '#c7ceea', '#f6c3d5', '#e4f9d4', '#f9d4d4'];
        this.coverColor = this.coverColor || colors[Math.floor(Math.random() * colors.length)];
        return {
          backgroundColor: this.coverColor
        };
      }
    }
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
          const novel = response[0];
          this.novelForm.title = novel.name;
          this.novelForm.content = novel.content;
          this.coverUrl = novel.picUrl;
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
    openCoverUpload() {
      this.coverDialogVisible = true;
      this.coverPreview = this.coverUrl;
      this.coverFile = null;
    },
    beforeCoverUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImage) {
        this.$message.error('只能上传图片文件!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!');
        return false;
      }

      // 创建预览
      this.coverFile = file;
      this.createCoverPreview(file);
      return false; // 阻止自动上传
    },
    createCoverPreview(file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.coverPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async uploadCover() {
      // 这个方法不会被直接调用，因为我们阻止了自动上传
      // 但需要提供给el-upload组件
    },
    async confirmCoverUpload() {
      if (!this.coverFile) {
        this.$message.warning('请先选择图片');
        return;
      }
      try {
        this.submitting = true;

        // 读取文件为base64
        const reader = new FileReader();
        reader.readAsDataURL(this.coverFile);
        reader.onload = async () => {
          const base64Data = reader.result;
          const novelId = this.$route.params.id;

          // 调用API上传封面
          await this.$api.essays.changeCover({
            img: base64Data,
            novel_id: novelId
          });
          this.$message.success('封面上传成功');
          this.coverUrl = base64Data; // 临时显示，实际应该重新获取作品信息
          this.coverDialogVisible = false;
          this.submitting = false;

          // 重新获取作品信息以更新封面URL
          await this.fetchNovelData();
        };
      } catch (error) {
        console.error('上传封面失败:', error);
        this.$message.error('上传封面失败，请稍后重试');
        this.submitting = false;
      }
    },
    async submitForm() {
      // 表单验证
      if (!this.novelForm.title.trim()) {
        this.$message.warning('请输入作品名称');
        return;
      }
      if (!this.novelForm.content.trim()) {
        this.$message.warning('请输入作品简介');
        return;
      }
      try {
        this.submitting = true;
        const novelId = this.$route.params.id;

        // 调用API修改作品信息
        await this.$api.essays.modifyNovel(novelId, this.novelForm.title, this.novelForm.content);
        this.$message.success('作品信息修改成功');

        // 返回作品设置页面
        this.$router.push(`/write/settings/${novelId}`);
      } catch (error) {
        console.error('修改作品信息失败:', error);
        this.$message.error('修改作品信息失败，请稍后重试');
      } finally {
        this.submitting = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/write/settings/info/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var info_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/write/settings/info/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(472)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  info_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "599bbd1b",
  "a5870dbc"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map