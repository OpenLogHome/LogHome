exports.ids = [2];
exports.modules = {

/***/ 101:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(119);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("2a69ddd5", content, true, context)
};

/***/ }),

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_community_vue_vue_type_style_index_0_id_0fa3cc12_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(101);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_community_vue_vue_type_style_index_0_id_0fa3cc12_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_community_vue_vue_type_style_index_0_id_0fa3cc12_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_community_vue_vue_type_style_index_0_id_0fa3cc12_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_community_vue_vue_type_style_index_0_id_0fa3cc12_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".community-page[data-v-0fa3cc12]{max-width:1200px;margin:0 auto;padding:20px}.page-header[data-v-0fa3cc12]{margin-bottom:40px}.page-header .page-title[data-v-0fa3cc12]{font-size:28px;font-weight:700;color:#704c35;padding-left:20px;border-left:4px solid #947358}.construction-container[data-v-0fa3cc12]{display:flex;justify-content:center;align-items:center;min-height:400px;background-color:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.08)}.construction-content[data-v-0fa3cc12]{text-align:center;padding:40px}.construction-icon[data-v-0fa3cc12]{font-size:64px;margin-bottom:20px}.construction-title[data-v-0fa3cc12]{font-size:24px;color:#704c35;margin-bottom:10px}.construction-text[data-v-0fa3cc12]{font-size:18px;color:#666}@media(max-width: 768px){.page-title[data-v-0fa3cc12]{font-size:24px}.construction-title[data-v-0fa3cc12]{font-size:20px}.construction-text[data-v-0fa3cc12]{font-size:16px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 160:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community.vue?vue&type=template&id=0fa3cc12&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "community-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-0fa3cc12><h1 class=\"page-title\" data-v-0fa3cc12>作者社区</h1></div> <div class=\"construction-container\" data-v-0fa3cc12><div class=\"construction-content\" data-v-0fa3cc12><div class=\"construction-icon\" data-v-0fa3cc12>🚧</div> <h2 class=\"construction-title\" data-v-0fa3cc12>社区正在建设中</h2> <p class=\"construction-text\" data-v-0fa3cc12>敬请期待</p></div></div>")]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/community.vue?vue&type=template&id=0fa3cc12&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/community.vue?vue&type=script&lang=js
/* harmony default export */ var communityvue_type_script_lang_js = ({
  head() {
    return {
      title: '作者社区 - 原木社区'
    };
  }
});
// CONCATENATED MODULE: ./pages/community.vue?vue&type=script&lang=js
 /* harmony default export */ var pages_communityvue_type_script_lang_js = (communityvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/community.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(118)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_communityvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "0fa3cc12",
  "11e0ddbd"
  
)

/* harmony default export */ var community = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=community.js.map