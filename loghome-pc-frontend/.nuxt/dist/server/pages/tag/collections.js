exports.ids = [20];
exports.modules = {

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(192);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("1592a269", content, true, context)
};

/***/ }),

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_vue_vue_type_style_index_0_id_5f8dabc6_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(132);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_vue_vue_type_style_index_0_id_5f8dabc6_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_vue_vue_type_style_index_0_id_5f8dabc6_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_vue_vue_type_style_index_0_id_5f8dabc6_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_vue_vue_type_style_index_0_id_5f8dabc6_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 192:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".tag-collections-page[data-v-5f8dabc6]{max-width:1200px;margin:0 auto;padding:20px;background-color:#fff;min-height:calc(100vh - 140px)}.page-header[data-v-5f8dabc6]{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;padding-bottom:15px;border-bottom:1px solid #e0e0e0}.page-header .page-title[data-v-5f8dabc6]{font-size:24px;font-weight:bold;color:#947358;margin:0}.page-header .back-button[data-v-5f8dabc6]{padding:8px 16px;background-color:#947358;color:#fff;border-radius:4px;text-decoration:none;font-size:14px;transition:background-color .3s}.page-header .back-button[data-v-5f8dabc6]:hover{background-color:hsl(27,25.4237288136%,36.2745098039%)}.loading-container[data-v-5f8dabc6],.error-container[data-v-5f8dabc6],.empty-container[data-v-5f8dabc6]{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px}.loading-container p[data-v-5f8dabc6],.error-container p[data-v-5f8dabc6],.empty-container p[data-v-5f8dabc6]{margin-top:20px;color:#666;font-size:16px}.loading-spinner[data-v-5f8dabc6]{width:50px;height:50px;border:5px solid rgba(148,115,88,.2);border-top-color:#947358;border-radius:50%;animation:spin-5f8dabc6 1s linear infinite}@keyframes spin-5f8dabc6{to{transform:rotate(360deg)}}.retry-button[data-v-5f8dabc6]{margin-top:15px;padding:8px 20px;background-color:#947358;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px}.retry-button[data-v-5f8dabc6]:hover{background-color:hsl(27,25.4237288136%,36.2745098039%)}.novels-grid[data-v-5f8dabc6]{display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:25px;margin-top:20px}.novel-card[data-v-5f8dabc6]{display:flex;flex-direction:column;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);transition:transform .3s,box-shadow .3s;background-color:#fff;height:100%}.novel-card[data-v-5f8dabc6]:hover{transform:translateY(-5px);box-shadow:0 5px 15px rgba(0,0,0,.1)}.novel-cover[data-v-5f8dabc6]{height:180px;background-size:cover;background-position:center;position:relative}.novel-cover .novel-category[data-v-5f8dabc6]{position:absolute;top:10px;right:10px;background-color:rgba(0,0,0,.7);color:#fff;padding:3px 8px;border-radius:4px;font-size:12px}.novel-info[data-v-5f8dabc6]{padding:15px;display:flex;flex-direction:column;flex-grow:1}.novel-title[data-v-5f8dabc6]{font-size:18px;font-weight:bold;margin:0 0 10px;color:#333;line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical}.novel-author-info[data-v-5f8dabc6]{display:flex;align-items:center;margin-bottom:12px}.novel-author-info .author-avatar[data-v-5f8dabc6]{width:24px;height:24px;border-radius:50%;margin-right:8px;object-fit:cover}.novel-author-info .author-name[data-v-5f8dabc6]{font-size:14px;color:#666}.novel-desc[data-v-5f8dabc6]{font-size:14px;color:#666;margin:0 0 15px;line-height:1.5;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;flex-grow:1}.novel-stats[data-v-5f8dabc6]{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:8px}.novel-stats span[data-v-5f8dabc6]{font-size:12px;color:#666}.novel-update-time[data-v-5f8dabc6]{font-size:12px;color:#666;margin-bottom:15px}.read-button[data-v-5f8dabc6]{padding:8px 0;background-color:#947358;color:#fff;border-radius:4px;text-align:center;text-decoration:none;font-size:14px;transition:background-color .3s}.read-button[data-v-5f8dabc6]:hover{background-color:hsl(27,25.4237288136%,36.2745098039%)}@media(max-width: 768px){.novels-grid[data-v-5f8dabc6]{grid-template-columns:repeat(auto-fill, minmax(250px, 1fr))}}@media(max-width: 480px){.novels-grid[data-v-5f8dabc6]{grid-template-columns:1fr}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 246:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/tag/collections.vue?vue&type=template&id=5f8dabc6&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "tag-collections-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-5f8dabc6>", "</div>", [_vm._ssrNode("<h1 class=\"page-title\" data-v-5f8dabc6>" + _vm._ssrEscape(_vm._s(_vm.tagName || '标签集合')) + "</h1> "), _c('nuxt-link', {
    staticClass: "back-button",
    attrs: {
      "to": "/read"
    }
  }, [_vm._v("返回书库")])], 2), _vm._ssrNode(" "), _vm.loading ? _vm._ssrNode("<div class=\"loading-container\" data-v-5f8dabc6>", "</div>", [_vm._ssrNode("<div class=\"loading-spinner\" data-v-5f8dabc6></div> <p data-v-5f8dabc6>正在加载内容...</p>")], 2) : _vm.error ? _vm._ssrNode("<div class=\"error-container\" data-v-5f8dabc6><p data-v-5f8dabc6>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button class=\"retry-button\" data-v-5f8dabc6>重试</button></div>") : _vm.novels.length === 0 ? _vm._ssrNode("<div class=\"empty-container\" data-v-5f8dabc6><p data-v-5f8dabc6>该标签下暂无小说</p></div>") : _vm._ssrNode("<div class=\"novels-grid\" data-v-5f8dabc6>", "</div>", _vm._l(_vm.novels, function (novel) {
    return _vm._ssrNode("<div class=\"novel-card\" data-v-5f8dabc6>", "</div>", [_vm._ssrNode((novel.picUrl ? "<div class=\"novel-cover\"" + _vm._ssrStyle(null, `background-image: url(${novel.picUrl})`, null) + " data-v-5f8dabc6>" + (novel.novel_type === 'world' ? "<span class=\"novel-category\" data-v-5f8dabc6>世界设定</span>" : "<!---->") + "</div>" : "<div class=\"novel-cover\"" + _vm._ssrStyle(null, `background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`, null) + " data-v-5f8dabc6>" + (novel.novel_type === 'world' ? "<span class=\"novel-category\" data-v-5f8dabc6>世界设定</span>" : "<!---->") + "</div>") + " "), _vm._ssrNode("<div class=\"novel-info\" data-v-5f8dabc6>", "</div>", [_vm._ssrNode("<h3 class=\"novel-title\" data-v-5f8dabc6>" + _vm._ssrEscape(_vm._s(novel.name)) + "</h3> <div class=\"novel-author-info\" data-v-5f8dabc6><img" + _vm._ssrAttr("src", novel.avatar_url || '/default-avatar.png') + " alt=\"作者头像\"" + _vm._ssrAttr("onerror", `this.onerror=null;this.src='/default-avatar.png'`) + " class=\"author-avatar\" data-v-5f8dabc6> <span class=\"author-name\" data-v-5f8dabc6>" + _vm._ssrEscape(_vm._s(novel.user_name || '佚名')) + "</span></div> <p class=\"novel-desc\" data-v-5f8dabc6>" + _vm._ssrEscape(_vm._s(_vm.truncateText(novel.content, 100))) + "</p> <div class=\"novel-stats\" data-v-5f8dabc6><span title=\"阅读量\" data-v-5f8dabc6>" + _vm._ssrEscape("👁️ " + _vm._s(_vm.formatNumber(novel.clicks || 0))) + "</span> <span title=\"字数\" data-v-5f8dabc6>" + _vm._ssrEscape("📃 " + _vm._s(_vm.formatNumber(novel.text_count || 0)) + "字") + "</span> <span title=\"连载状态\" data-v-5f8dabc6>" + _vm._ssrEscape(_vm._s(novel.is_complete === 1 ? '已完结' : '连载中')) + "</span></div> <div class=\"novel-update-time\" data-v-5f8dabc6><span title=\"更新时间\" data-v-5f8dabc6>" + _vm._ssrEscape("🕒 " + _vm._s(_vm.formatDateTime(novel.update_time))) + "</span></div> "), _c('nuxt-link', {
      staticClass: "read-button",
      attrs: {
        "to": `/novel/${novel.novel_id}`
      }
    }, [_vm._v("开始阅读")])], 2)], 2);
  }), 0)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/tag/collections.vue?vue&type=template&id=5f8dabc6&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/tag/collections.vue?vue&type=script&lang=js
/* harmony default export */ var collectionsvue_type_script_lang_js = ({
  head() {
    return {
      title: `${this.tagName || '标签集合'} - 原木社区`,
      meta: [{
        hid: 'description',
        name: 'description',
        content: `原木社区 - ${this.tagName || '标签集合'} 分类下的热门小说列表`
      }]
    };
  },
  data() {
    return {
      tagId: 0,
      tagName: '',
      novels: [],
      loading: true,
      error: null
    };
  },
  async asyncData({
    query,
    $api,
    error
  }) {
    try {
      const tagId = query.tag_id || 3;
      console.log('标签ID:', tagId);

      // 获取标签名称
      const tagInfo = await $api.novels.getTagInfo(tagId);
      const tagName = (tagInfo === null || tagInfo === void 0 ? void 0 : tagInfo.tag_name) || '标签集合';

      // 获取标签下的小说
      const novels = await $api.novels.getTagCollections(tagId);
      console.log('获取到标签小说数据:', (novels === null || novels === void 0 ? void 0 : novels.length) || 0, '条记录');
      return {
        tagId,
        tagName,
        novels: novels || [],
        loading: false
      };
    } catch (err) {
      console.error('加载标签数据失败:', err);
      return {
        tagId: query.tag_id || 3,
        tagName: '标签集合',
        novels: [],
        loading: false,
        error: `加载标签数据失败: ${err.message || '未知错误'}`
      };
    }
  },
  methods: {
    // 刷新小说集合
    async refreshCollections() {
      this.loading = true;
      this.error = null;
      try {
        this.novels = await this.$api.novels.getTagCollections(this.tagId);
      } catch (err) {
        console.error('刷新标签数据失败:', err);
        this.error = '刷新标签数据失败，请稍后重试';
      } finally {
        this.loading = false;
      }
    },
    // 截断文本
    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
    // 格式化数字
    formatNumber(num) {
      if (!num) return '0';
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
      }
      return num.toString();
    },
    // 格式化日期时间
    formatDateTime(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 1) {
        return '今天';
      } else if (diffDays < 7) {
        return `${diffDays}天前`;
      } else {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/tag/collections.vue?vue&type=script&lang=js
 /* harmony default export */ var tag_collectionsvue_type_script_lang_js = (collectionsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/tag/collections.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(191)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  tag_collectionsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "5f8dabc6",
  "682a70e6"
  
)

/* harmony default export */ var collections = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=collections.js.map