exports.ids = [35];
exports.modules = {

/***/ 238:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(307);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("b7d62912", content, true, context)
};

/***/ }),

/***/ 306:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_97d27ad0_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(238);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_97d27ad0_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_97d27ad0_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_97d27ad0_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_97d27ad0_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 307:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".tags-page[data-v-97d27ad0]{max-width:1200px;margin:0 auto;padding:20px;background-color:#fff;min-height:calc(100vh - 140px)}.page-header[data-v-97d27ad0]{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;padding-bottom:15px;border-bottom:1px solid #e0e0e0}.page-header .page-title[data-v-97d27ad0]{font-size:28px;font-weight:bold;color:#947358;margin:0}.page-header .back-button[data-v-97d27ad0]{padding:10px 20px;background-color:#947358;color:#fff;border-radius:6px;text-decoration:none;font-size:14px;transition:all .3s ease}.page-header .back-button[data-v-97d27ad0]:hover{background-color:hsl(27,25.4237288136%,36.2745098039%);transform:translateY(-2px)}.loading-container[data-v-97d27ad0],.error-container[data-v-97d27ad0],.empty-container[data-v-97d27ad0]{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px}.loading-container p[data-v-97d27ad0],.error-container p[data-v-97d27ad0],.empty-container p[data-v-97d27ad0]{margin-top:20px;color:#666;font-size:16px}.loading-spinner[data-v-97d27ad0]{width:50px;height:50px;border:5px solid rgba(148,115,88,.2);border-top-color:#947358;border-radius:50%;animation:spin-97d27ad0 1s linear infinite}@keyframes spin-97d27ad0{to{transform:rotate(360deg)}}.retry-button[data-v-97d27ad0]{margin-top:15px;padding:10px 24px;background-color:#947358;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;transition:all .3s ease}.retry-button[data-v-97d27ad0]:hover{background-color:hsl(27,25.4237288136%,36.2745098039%);transform:translateY(-2px)}.tags-container[data-v-97d27ad0]{margin-top:20px}.tag-toolbar[data-v-97d27ad0]{display:flex;flex-wrap:wrap;align-items:center;gap:20px;font-size:13px;color:#999}.tag-toolbar label[data-v-97d27ad0]{display:flex;gap:10px;align-items:center}.tag-toolbar input[data-v-97d27ad0]{font:inherit;padding:9px 12px;border:1px solid #e0d7cc;border-radius:6px}.tag-filters[data-v-97d27ad0]{display:flex;gap:6px}.tag-filters button[data-v-97d27ad0]{font:inherit;padding:8px 14px;border:0;border-radius:5px;cursor:pointer;color:#947358;background:#f5f2ed}.tag-filters button.active[data-v-97d27ad0]{background:#947358;color:#fff}.tag-item[data-v-97d27ad0]{text-decoration:none}a[data-v-97d27ad0]:focus-visible,button[data-v-97d27ad0]:focus-visible,input[data-v-97d27ad0]:focus-visible{outline:2px solid #947358;outline-offset:3px}.tags-grid[data-v-97d27ad0]{display:grid;grid-template-columns:repeat(auto-fill, minmax(210px, 1fr));gap:14px}.tag-item[data-v-97d27ad0]{position:relative;background-color:#fff;border:2px solid #e0e0e0;border-radius:12px;padding:20px;cursor:pointer;transition:all .3s ease;overflow:hidden;min-height:120px;display:flex;flex-direction:column;justify-content:space-between}.tag-item[data-v-97d27ad0]:hover{transform:translateY(-5px);box-shadow:0 8px 25px rgba(0,0,0,.1);border-color:#947358}.tag-item.activity[data-v-97d27ad0]{border-color:#ec8600;background:linear-gradient(135deg, #fff 0%, rgba(255, 207, 165, 0.1) 100%)}.tag-item.activity .tag-name[data-v-97d27ad0]{color:#ec8600}.tag-item.suggested[data-v-97d27ad0]{border-color:#ec8600;border-style:dashed}.tag-item.suggested .tag-name[data-v-97d27ad0]{color:#ec8600}.tag-content[data-v-97d27ad0]{position:relative;z-index:2}.tag-name[data-v-97d27ad0]{font-size:17px;font-weight:bold;margin:0 0 8px 0;color:#333;line-height:1.3}.tag-count[data-v-97d27ad0]{font-size:14px;color:#666;margin-bottom:12px}.tag-badges[data-v-97d27ad0]{display:flex;flex-wrap:wrap;gap:6px}.badge[data-v-97d27ad0]{padding:3px 8px;border-radius:12px;font-size:12px;font-weight:500}.badge.activity-badge[data-v-97d27ad0]{background-color:#ffcfa5;color:#ec8600}.badge.suggested-badge[data-v-97d27ad0]{background-color:rgba(236,134,0,.1);color:#ec8600;border:1px solid #ec8600}@media(max-width: 768px){.tags-page[data-v-97d27ad0]{padding:15px}.page-header[data-v-97d27ad0]{flex-direction:column;gap:15px;text-align:center}.page-header .page-title[data-v-97d27ad0]{font-size:24px}.tags-grid[data-v-97d27ad0]{grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));gap:15px}.tag-item[data-v-97d27ad0]{padding:15px;min-height:100px}.tag-name[data-v-97d27ad0]{font-size:18px}}@media(max-width: 480px){.tags-grid[data-v-97d27ad0]{grid-template-columns:1fr}.tag-item[data-v-97d27ad0]{min-height:80px}}.dark-mode .tags-page[data-v-97d27ad0]{background-color:#1e1e1e;color:#ccc}.dark-mode .page-header[data-v-97d27ad0]{border-bottom-color:#3c3c3c}.dark-mode .page-header .page-title[data-v-97d27ad0]{color:#ccc}.dark-mode .tag-item[data-v-97d27ad0]{background-color:#2c2c2c;border-color:#3c3c3c}.dark-mode .tag-item[data-v-97d27ad0]:hover{border-color:#947358}.dark-mode .tag-item.activity[data-v-97d27ad0]{background:linear-gradient(135deg, #2C2C2C 0%, rgba(236, 134, 0, 0.1) 100%)}.dark-mode .tag-name[data-v-97d27ad0]{color:#ccc}.activity .dark-mode .tag-name[data-v-97d27ad0],.suggested .dark-mode .tag-name[data-v-97d27ad0]{color:#ec8600}.dark-mode .tag-count[data-v-97d27ad0]{color:#888}.dark-mode .loading-container p[data-v-97d27ad0],.dark-mode .error-container p[data-v-97d27ad0],.dark-mode .empty-container p[data-v-97d27ad0]{color:#888}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 422:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/tags/index.vue?vue&type=template&id=97d27ad0&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "tags-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-97d27ad0>", "</div>", [_vm._ssrNode("<h1 class=\"page-title\" data-v-97d27ad0>标签库</h1> "), _c('nuxt-link', {
    staticClass: "back-button",
    attrs: {
      "to": "/read"
    }
  }, [_vm._v("返回书库")])], 2), _vm._ssrNode(" <div class=\"tag-toolbar\" data-v-97d27ad0><label data-v-97d27ad0>查找标签 <input type=\"search\" placeholder=\"输入标签名称\"" + _vm._ssrAttr("value", _vm.keyword) + " data-v-97d27ad0></label> <div class=\"tag-filters\" data-v-97d27ad0>" + _vm._ssrList(_vm.filters, function (filter) {
    return "<button" + _vm._ssrAttr("aria-pressed", _vm.selected === filter.key) + _vm._ssrClass(null, {
      active: _vm.selected === filter.key
    }) + " data-v-97d27ad0>" + _vm._ssrEscape(_vm._s(filter.label)) + "</button>";
  }) + "</div> <span data-v-97d27ad0>" + _vm._ssrEscape(_vm._s(_vm.filteredTags.length) + " 个标签") + "</span></div> "), _vm.loading ? _vm._ssrNode("<div class=\"loading-container\" data-v-97d27ad0>", "</div>", [_vm._ssrNode("<div class=\"loading-spinner\" data-v-97d27ad0></div> <p data-v-97d27ad0>正在加载标签...</p>")], 2) : _vm.error ? _vm._ssrNode("<div class=\"error-container\" data-v-97d27ad0><p data-v-97d27ad0>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button class=\"retry-button\" data-v-97d27ad0>重试</button></div>") : _vm.filteredTags.length === 0 ? _vm._ssrNode("<div class=\"empty-container\" data-v-97d27ad0><p data-v-97d27ad0>没有找到匹配的标签</p></div>") : _vm._ssrNode("<div class=\"tags-container\" data-v-97d27ad0>", "</div>", [_vm._ssrNode("<div class=\"tags-grid\" data-v-97d27ad0>", "</div>", _vm._l(_vm.filteredTags, function (item) {
    return _c('nuxt-link', {
      key: item.tag_id,
      staticClass: "tag-item",
      class: {
        'activity': item.is_activity_tag,
        'suggested': item.is_suggested
      },
      attrs: {
        "to": `/tag/collections?tag_id=${item.tag_id}`
      }
    }, [_c('div', {
      staticClass: "tag-content"
    }, [_c('h3', {
      staticClass: "tag-name"
    }, [_vm._v(_vm._s(item.tag_name))]), _vm._v(" "), _c('div', {
      staticClass: "tag-count"
    }, [_vm._v(_vm._s(item.count) + " 部作品")]), _vm._v(" "), _c('div', {
      staticClass: "tag-badges"
    }, [item.is_activity_tag ? _c('span', {
      staticClass: "badge activity-badge"
    }, [_vm._v("活动标签")]) : _vm._e(), _vm._v(" "), item.is_suggested ? _c('span', {
      staticClass: "badge suggested-badge"
    }, [_vm._v("官方标签")]) : _vm._e()])])]);
  }), 1)])], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/tags/index.vue?vue&type=template&id=97d27ad0&scoped=true

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(10);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(34);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/tags/index.vue?vue&type=script&lang=js


/* harmony default export */ var tagsvue_type_script_lang_js = ({
  head() {
    return Object(reading_seo["d" /* readingHead */])({
      title: '标签库 - 原木社区',
      description: '浏览原木社区所有作品标签，按活动、官方标签发现小说、漫画和世界设定。',
      path: '/tags'
    });
  },
  data() {
    return {
      keyword: '',
      selected: 'all',
      filters: [{
        key: 'all',
        label: '全部'
      }, {
        key: 'activity',
        label: '活动标签'
      }, {
        key: 'suggested',
        label: '官方标签'
      }],
      tags: [],
      loading: true,
      error: null
    };
  },
  async asyncData({
    $api
  }) {
    try {
      const tags = await $api.reading.getTags();
      return {
        tags: Object(reading_discovery["d" /* asList */])(tags).map(tag => ({
          ...tag,
          is_activity_tag: Object(reading_discovery["h" /* enabledFlag */])(tag.is_activity_tag),
          is_suggested: Object(reading_discovery["h" /* enabledFlag */])(tag.is_suggested)
        })),
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
  computed: {
    filteredTags() {
      const keyword = this.keyword.trim().toLowerCase();
      return this.tags.filter(tag => (!keyword || String(tag.tag_name).toLowerCase().includes(keyword)) && (this.selected !== 'activity' || tag.is_activity_tag) && (this.selected !== 'suggested' || tag.is_suggested));
    }
  },
  methods: {
    async getNovelTags() {
      this.loading = true;
      this.error = null;
      try {
        const tags = await this.$api.reading.getTags();
        this.tags = Object(reading_discovery["d" /* asList */])(tags).map(tag => ({
          ...tag,
          is_activity_tag: Object(reading_discovery["h" /* enabledFlag */])(tag.is_activity_tag),
          is_suggested: Object(reading_discovery["h" /* enabledFlag */])(tag.is_suggested)
        }));
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
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/tags/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(306)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_tagsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "97d27ad0",
  "60096b05"
  
)

/* harmony default export */ var pages_tags = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=index.js.map