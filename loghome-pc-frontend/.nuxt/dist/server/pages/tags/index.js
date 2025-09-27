exports.ids = [17];
exports.modules = {

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(167);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("9153c8bc", content, true, context)
};

/***/ }),

/***/ 166:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_74d9802c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(123);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_74d9802c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_74d9802c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_74d9802c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_74d9802c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".tags-page[data-v-74d9802c]{max-width:1200px;margin:0 auto;padding:20px;background-color:#fff;min-height:calc(100vh - 140px)}.page-header[data-v-74d9802c]{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;padding-bottom:15px;border-bottom:1px solid #e0e0e0}.page-header .page-title[data-v-74d9802c]{font-size:28px;font-weight:bold;color:#947358;margin:0}.page-header .back-button[data-v-74d9802c]{padding:10px 20px;background-color:#947358;color:#fff;border-radius:6px;text-decoration:none;font-size:14px;transition:all .3s ease}.page-header .back-button[data-v-74d9802c]:hover{background-color:hsl(27,25.4237288136%,36.2745098039%);transform:translateY(-2px)}.loading-container[data-v-74d9802c],.error-container[data-v-74d9802c],.empty-container[data-v-74d9802c]{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px}.loading-container p[data-v-74d9802c],.error-container p[data-v-74d9802c],.empty-container p[data-v-74d9802c]{margin-top:20px;color:#666;font-size:16px}.loading-spinner[data-v-74d9802c]{width:50px;height:50px;border:5px solid rgba(148,115,88,.2);border-top-color:#947358;border-radius:50%;animation:spin-74d9802c 1s linear infinite}@keyframes spin-74d9802c{to{transform:rotate(360deg)}}.retry-button[data-v-74d9802c]{margin-top:15px;padding:10px 24px;background-color:#947358;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;transition:all .3s ease}.retry-button[data-v-74d9802c]:hover{background-color:hsl(27,25.4237288136%,36.2745098039%);transform:translateY(-2px)}.tags-container[data-v-74d9802c]{margin-top:20px}.tags-grid[data-v-74d9802c]{display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:20px}.tag-item[data-v-74d9802c]{position:relative;background-color:#fff;border:2px solid #e0e0e0;border-radius:12px;padding:20px;cursor:pointer;transition:all .3s ease;overflow:hidden;min-height:120px;display:flex;flex-direction:column;justify-content:space-between}.tag-item[data-v-74d9802c]:hover{transform:translateY(-5px);box-shadow:0 8px 25px rgba(0,0,0,.1);border-color:#947358}.tag-item:hover .tag-hover-overlay[data-v-74d9802c]{opacity:1}.tag-item.activity[data-v-74d9802c]{border-color:#ec8600;background:linear-gradient(135deg, #fff 0%, rgba(255, 207, 165, 0.1) 100%)}.tag-item.activity .tag-name[data-v-74d9802c]{color:#ec8600}.tag-item.suggested[data-v-74d9802c]{border-color:#ec8600;border-style:dashed}.tag-item.suggested .tag-name[data-v-74d9802c]{color:#ec8600}.tag-content[data-v-74d9802c]{position:relative;z-index:2}.tag-name[data-v-74d9802c]{font-size:20px;font-weight:bold;margin:0 0 8px 0;color:#333;line-height:1.3}.tag-count[data-v-74d9802c]{font-size:14px;color:#666;margin-bottom:12px}.tag-badges[data-v-74d9802c]{display:flex;flex-wrap:wrap;gap:6px}.badge[data-v-74d9802c]{padding:3px 8px;border-radius:12px;font-size:12px;font-weight:500}.badge.activity-badge[data-v-74d9802c]{background-color:#ffcfa5;color:#ec8600}.badge.suggested-badge[data-v-74d9802c]{background-color:rgba(236,134,0,.1);color:#ec8600;border:1px solid #ec8600}.tag-hover-overlay[data-v-74d9802c]{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg, rgba(148, 115, 88, 0.9) 0%, rgba(112, 76, 53, 0.9) 100%);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s ease;border-radius:10px}.tag-hover-overlay .view-text[data-v-74d9802c]{color:#fff;font-size:16px;font-weight:bold}@media(max-width: 768px){.tags-page[data-v-74d9802c]{padding:15px}.page-header[data-v-74d9802c]{flex-direction:column;gap:15px;text-align:center}.page-header .page-title[data-v-74d9802c]{font-size:24px}.tags-grid[data-v-74d9802c]{grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));gap:15px}.tag-item[data-v-74d9802c]{padding:15px;min-height:100px}.tag-name[data-v-74d9802c]{font-size:18px}}@media(max-width: 480px){.tags-grid[data-v-74d9802c]{grid-template-columns:1fr}.tag-item[data-v-74d9802c]{min-height:80px}}.dark-mode .tags-page[data-v-74d9802c]{background-color:#1e1e1e;color:#ccc}.dark-mode .page-header[data-v-74d9802c]{border-bottom-color:#3c3c3c}.dark-mode .page-header .page-title[data-v-74d9802c]{color:#ccc}.dark-mode .tag-item[data-v-74d9802c]{background-color:#2c2c2c;border-color:#3c3c3c}.dark-mode .tag-item[data-v-74d9802c]:hover{border-color:#947358}.dark-mode .tag-item.activity[data-v-74d9802c]{background:linear-gradient(135deg, #2C2C2C 0%, rgba(236, 134, 0, 0.1) 100%)}.dark-mode .tag-name[data-v-74d9802c]{color:#ccc}.activity .dark-mode .tag-name[data-v-74d9802c],.suggested .dark-mode .tag-name[data-v-74d9802c]{color:#ec8600}.dark-mode .tag-count[data-v-74d9802c]{color:#888}.dark-mode .loading-container p[data-v-74d9802c],.dark-mode .error-container p[data-v-74d9802c],.dark-mode .empty-container p[data-v-74d9802c]{color:#888}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 222:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/tags/index.vue?vue&type=template&id=74d9802c&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "tags-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-74d9802c>", "</div>", [_vm._ssrNode("<h1 class=\"page-title\" data-v-74d9802c>标签库</h1> "), _c('nuxt-link', {
    staticClass: "back-button",
    attrs: {
      "to": "/read"
    }
  }, [_vm._v("返回书库")])], 2), _vm._ssrNode(" " + (_vm.loading ? "<div class=\"loading-container\" data-v-74d9802c><div class=\"loading-spinner\" data-v-74d9802c></div> <p data-v-74d9802c>正在加载标签...</p></div>" : _vm.error ? "<div class=\"error-container\" data-v-74d9802c><p data-v-74d9802c>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button class=\"retry-button\" data-v-74d9802c>重试</button></div>" : _vm.tags.length === 0 ? "<div class=\"empty-container\" data-v-74d9802c><p data-v-74d9802c>暂无标签</p></div>" : "<div class=\"tags-container\" data-v-74d9802c><div class=\"tags-grid\" data-v-74d9802c>" + _vm._ssrList(_vm.tags, function (item, index) {
    return "<div" + _vm._ssrClass("tag-item", {
      'activity': item.is_activity_tag,
      'suggested': item.is_suggested
    }) + " data-v-74d9802c><div class=\"tag-content\" data-v-74d9802c><h3 class=\"tag-name\" data-v-74d9802c>" + _vm._ssrEscape(_vm._s(item.tag_name)) + "</h3> <div class=\"tag-count\" data-v-74d9802c>" + _vm._ssrEscape(_vm._s(item.count) + " 部作品") + "</div> <div class=\"tag-badges\" data-v-74d9802c>" + (item.is_activity_tag ? "<span class=\"badge activity-badge\" data-v-74d9802c>活动标签</span>" : "<!---->") + " " + (item.is_suggested ? "<span class=\"badge suggested-badge\" data-v-74d9802c>推荐标签</span>" : "<!---->") + "</div></div> <div class=\"tag-hover-overlay\" data-v-74d9802c><span class=\"view-text\" data-v-74d9802c>查看作品</span></div></div>";
  }) + "</div></div>"))], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/tags/index.vue?vue&type=template&id=74d9802c&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/tags/index.vue?vue&type=script&lang=js
/* harmony default export */ var tagsvue_type_script_lang_js = ({
  head() {
    return {
      title: '标签库 - 原木社区',
      meta: [{
        hid: 'description',
        name: 'description',
        content: '原木社区 - 浏览所有小说标签，发现更多精彩内容'
      }]
    };
  },
  data() {
    return {
      tags: [],
      loading: true,
      error: null
    };
  },
  async asyncData({
    $api
  }) {
    try {
      const tags = await $api.novels.getAllTags();
      return {
        tags: tags || [],
        loading: false
      };
    } catch (error) {
      console.error('获取标签失败:', error);
      return {
        tags: [],
        loading: false,
        error: '获取标签失败，请稍后重试'
      };
    }
  },
  methods: {
    async getNovelTags() {
      this.loading = true;
      this.error = null;
      try {
        const tags = await this.$api.novels.getAllTags();
        this.tags = tags || [];
      } catch (error) {
        console.error('获取标签失败:', error);
        this.error = '获取标签失败，请稍后重试';
      } finally {
        this.loading = false;
      }
    },
    gotoTagNovels(tagId) {
      this.$router.push(`/tag/collections?tag_id=${tagId}`);
    }
  }
});
// CONCATENATED MODULE: ./pages/tags/index.vue?vue&type=script&lang=js
 /* harmony default export */ var pages_tagsvue_type_script_lang_js = (tagsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/tags/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(166)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_tagsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "74d9802c",
  "0456af51"
  
)

/* harmony default export */ var tags = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=index.js.map