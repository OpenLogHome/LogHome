exports.ids = [11];
exports.modules = {

/***/ 108:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(136);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("17e5627b", content, true, context)
};

/***/ }),

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_write_vue_vue_type_style_index_0_id_402c338e_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(108);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_write_vue_vue_type_style_index_0_id_402c338e_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_write_vue_vue_type_style_index_0_id_402c338e_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_write_vue_vue_type_style_index_0_id_402c338e_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_write_vue_vue_type_style_index_0_id_402c338e_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 136:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".write-page{width:100%}.write-page .page-header{margin-bottom:30px}.write-page .page-title{font-size:32px;color:#704c35}.write-page .write-container{display:grid;grid-template-columns:1fr 300px;gap:30px}.write-page .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.write-page .section-title{font-size:24px;color:#704c35;margin:0}.write-page .new-button{background-color:#947358;color:#fff;border:none;border-radius:4px;padding:10px 20px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.write-page .new-button:hover{background-color:#704c35}.write-page .tabs{display:flex;margin-bottom:20px;border-bottom:1px solid #eee}.write-page .tab-button{padding:10px 20px;background:none;border:none;color:#666;font-size:16px;cursor:pointer;position:relative;transition:color .3s ease}.write-page .tab-button:hover{color:#947358}.write-page .tab-button.active{color:#947358;font-weight:600}.write-page .tab-button.active:after{content:\"\";position:absolute;bottom:-1px;left:0;right:0;height:3px;background-color:#947358;display:block}.write-page .work-empty{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.write-page .work-empty .empty-icon{font-size:64px;margin-bottom:20px}.write-page .work-empty .empty-title{font-size:20px;color:#333;margin-bottom:10px}.write-page .work-empty .empty-desc{color:#666;margin-bottom:25px}.write-page .work-empty .empty-button{background-color:#fb7d46;color:#fff;border:none;border-radius:4px;padding:10px 30px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.write-page .work-empty .empty-button:hover{background-color:#fa6c2e}.write-page .work-item{display:flex;background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,.1);margin-bottom:20px}.write-page .work-item .work-cover{width:150px;position:relative;flex-shrink:0}.write-page .work-item .work-category{position:absolute;top:10px;right:10px;background-color:rgba(0,0,0,.5);color:#fff;padding:4px 8px;border-radius:4px;font-size:12px}.write-page .work-item .work-info{flex-grow:1;padding:20px}.write-page .work-item .work-title{font-size:20px;color:#704c35;margin:0 0 10px}.write-page .work-item .work-stats{display:flex;color:#666;font-size:14px;margin-bottom:10px}.write-page .work-item .work-stats span{margin-right:15px}.write-page .work-item .work-desc{color:#666;font-size:14px;line-height:1.5;margin-bottom:15px}.write-page .work-item .work-update{color:#888;font-size:13px;margin-bottom:15px}.write-page .work-item .work-actions{display:flex;gap:10px}.write-page .work-item .work-action{padding:8px 15px;border-radius:4px;background-color:#f5f5f5;border:none;color:#666;cursor:pointer;transition:all .3s ease}.write-page .work-item .work-action:hover{background-color:#e0e0e0}.write-page .work-item .work-action.primary{background-color:#fb7d46;color:#fff}.write-page .work-item .work-action.primary:hover{background-color:#fa6c2e}.write-page .sidebar-section{background-color:#fff;border-radius:8px;padding:20px;margin-bottom:25px;box-shadow:0 2px 4px rgba(0,0,0,.1)}.write-page .sidebar-section .sidebar-title{font-size:18px;margin-bottom:15px;color:#704c35;padding-bottom:10px;border-bottom:1px solid #eee}.write-page .sidebar-section .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.write-page .sidebar-section .stats-grid .stat-item{text-align:center;padding:10px;background-color:#f5f5f5;border-radius:4px}.write-page .sidebar-section .stats-grid .stat-item .stat-value{font-size:20px;font-weight:600;color:#947358;margin-bottom:5px}.write-page .sidebar-section .stats-grid .stat-item .stat-label{font-size:14px;color:#666}.write-page .sidebar-section .guide-list{list-style:none;padding:0;margin:0}.write-page .sidebar-section .guide-list .guide-item{padding:8px 0;border-bottom:1px solid #f5f5f5}.write-page .sidebar-section .guide-list .guide-item:last-child{border-bottom:none}.write-page .sidebar-section .guide-list .guide-item .guide-link{color:#947358;text-decoration:none;transition:color .3s ease}.write-page .sidebar-section .guide-list .guide-item .guide-link:hover{color:#704c35;text-decoration:underline}.write-page .sidebar-section .activity-list{display:flex;flex-direction:column;gap:15px}.write-page .sidebar-section .activity-list .activity-item{padding:15px;background-color:#f5f5f5;border-radius:4px;border-left:3px solid #947358}.write-page .sidebar-section .activity-list .activity-item .activity-title{font-size:16px;color:#333;margin:0 0 10px}.write-page .sidebar-section .activity-list .activity-item .activity-desc{font-size:14px;color:#666;margin:0 0 10px;line-height:1.4}.write-page .sidebar-section .activity-list .activity-item .activity-date{font-size:13px;color:#888;margin:0 0 10px}.write-page .sidebar-section .activity-list .activity-item .activity-link{display:inline-block;color:#947358;text-decoration:none;font-size:14px;font-weight:600}.write-page .sidebar-section .activity-list .activity-item .activity-link:hover{text-decoration:underline}@media(max-width: 992px){.write-page .write-container{grid-template-columns:1fr}.write-page .work-cover{width:100px}}@media(max-width: 576px){.write-page .work-item{flex-direction:column}.write-page .work-item .work-cover{width:100%;height:140px}.write-page .work-item .work-actions{flex-wrap:wrap}.write-page .work-item .work-actions .work-action{flex:1 0 auto}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 162:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/write.vue?vue&type=template&id=402c338e
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "write-page"
  }, [_vm._ssrNode("<div class=\"page-header\"><h1 class=\"page-title\">创作中心</h1></div> "), _vm._ssrNode("<div class=\"write-container\">", "</div>", [_vm._ssrNode("<div class=\"works-section\"><div class=\"section-header\"><h2 class=\"section-title\">我的作品</h2> <button class=\"new-button\">+ 创建新作品</button></div> <div class=\"tabs\"><button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'all'
  }) + ">全部作品</button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'ongoing'
  }) + ">连载中</button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'completed'
  }) + ">已完结</button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'draft'
  }) + ">草稿箱</button></div> <div class=\"works-list\">" + (!_vm.works.length ? "<div class=\"work-empty\"><div class=\"empty-icon\">📝</div> <h3 class=\"empty-title\">您还没有创建任何作品</h3> <p class=\"empty-desc\">点击&quot;创建新作品&quot;按钮开始您的创作之旅</p> <button class=\"empty-button\">+ 立即创建</button></div>" : "<!---->") + " " + _vm._ssrList(_vm.works, function (work) {
    return "<div class=\"work-item\"><div class=\"work-cover\"" + _vm._ssrStyle(null, `background-color: ${work.color}`, null) + "><span class=\"work-category\">" + _vm._ssrEscape(_vm._s(work.category)) + "</span></div> <div class=\"work-info\"><h3 class=\"work-title\">" + _vm._ssrEscape(_vm._s(work.title)) + "</h3> <p class=\"work-stats\"><span>" + _vm._ssrEscape(_vm._s(work.status)) + "</span> <span>" + _vm._ssrEscape(_vm._s(work.wordCount) + "字") + "</span> <span>" + _vm._ssrEscape(_vm._s(work.chapterCount) + "章") + "</span></p> <p class=\"work-desc\">" + _vm._ssrEscape(_vm._s(work.description)) + "</p> <p class=\"work-update\">" + _vm._ssrEscape("最近更新: " + _vm._s(work.lastUpdate)) + "</p> <div class=\"work-actions\"><button class=\"work-action primary\">继续创作</button> <button class=\"work-action\">编辑信息</button> <button class=\"work-action\">管理章节</button></div></div></div>";
  }) + "</div></div> "), _vm._ssrNode("<div class=\"sidebar\">", "</div>", [_vm._ssrNode("<div class=\"sidebar-section\"><h3 class=\"sidebar-title\">创作数据</h3> <div class=\"stats-grid\"><div class=\"stat-item\"><div class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.stats.totalWorks)) + "</div> <div class=\"stat-label\">作品总数</div></div> <div class=\"stat-item\"><div class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.stats.totalWords)) + "</div> <div class=\"stat-label\">总字数</div></div> <div class=\"stat-item\"><div class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.stats.totalViews)) + "</div> <div class=\"stat-label\">总浏览量</div></div> <div class=\"stat-item\"><div class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.stats.totalFavorites)) + "</div> <div class=\"stat-label\">总收藏</div></div></div></div> "), _vm._ssrNode("<div class=\"sidebar-section\">", "</div>", [_vm._ssrNode("<h3 class=\"sidebar-title\">创作指南</h3> "), _vm._ssrNode("<ul class=\"guide-list\">", "</ul>", [_vm._ssrNode("<li class=\"guide-item\">", "</li>", [_c('nuxt-link', {
    staticClass: "guide-link",
    attrs: {
      "to": "/guide/getting-started"
    }
  }, [_vm._v("新手入门指南")])], 1), _vm._ssrNode(" "), _vm._ssrNode("<li class=\"guide-item\">", "</li>", [_c('nuxt-link', {
    staticClass: "guide-link",
    attrs: {
      "to": "/guide/plot-development"
    }
  }, [_vm._v("如何构思情节")])], 1), _vm._ssrNode(" "), _vm._ssrNode("<li class=\"guide-item\">", "</li>", [_c('nuxt-link', {
    staticClass: "guide-link",
    attrs: {
      "to": "/guide/character-creation"
    }
  }, [_vm._v("角色塑造技巧")])], 1), _vm._ssrNode(" "), _vm._ssrNode("<li class=\"guide-item\">", "</li>", [_c('nuxt-link', {
    staticClass: "guide-link",
    attrs: {
      "to": "/guide/writing-style"
    }
  }, [_vm._v("提升写作风格")])], 1), _vm._ssrNode(" "), _vm._ssrNode("<li class=\"guide-item\">", "</li>", [_c('nuxt-link', {
    staticClass: "guide-link",
    attrs: {
      "to": "/guide/publishing"
    }
  }, [_vm._v("作品发布与推广")])], 1)], 2)], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"sidebar-section\">", "</div>", [_vm._ssrNode("<h3 class=\"sidebar-title\">创作活动</h3> "), _vm._ssrNode("<div class=\"activity-list\">", "</div>", [_vm._ssrNode("<div class=\"activity-item\">", "</div>", [_vm._ssrNode("<h4 class=\"activity-title\">春季创作大赛</h4> <p class=\"activity-desc\">参与春季创作大赛，赢取丰厚奖金和推荐位展示</p> <p class=\"activity-date\">截止日期: 2023-05-30</p> "), _c('nuxt-link', {
    staticClass: "activity-link",
    attrs: {
      "to": "/activity/spring-contest"
    }
  }, [_vm._v("查看详情")])], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"activity-item\">", "</div>", [_vm._ssrNode("<h4 class=\"activity-title\">科幻题材征文</h4> <p class=\"activity-desc\">优秀科幻作品征集，入选作品将获得专业编辑指导</p> <p class=\"activity-date\">截止日期: 2023-06-15</p> "), _c('nuxt-link', {
    staticClass: "activity-link",
    attrs: {
      "to": "/activity/scifi-contest"
    }
  }, [_vm._v("查看详情")])], 2)], 2)], 2)], 2)], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/write.vue?vue&type=template&id=402c338e

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/write.vue?vue&type=script&lang=js
/* harmony default export */ var writevue_type_script_lang_js = ({
  head() {
    return {
      title: '创作中心 - 原木社区'
    };
  },
  data() {
    return {
      activeTab: 'all',
      works: [{
        id: 1,
        title: '星际迷航：新纪元',
        status: '连载中',
        category: '科幻',
        wordCount: '128,500',
        chapterCount: 35,
        description: '一部跨越星际的冒险故事，主角在探索宇宙奥秘的同时，也发现了人类文明的真相...',
        lastUpdate: '2023-04-05',
        color: '#a8d8ea'
      }, {
        id: 2,
        title: '魔法学院：元素觉醒',
        status: '草稿',
        category: '奇幻',
        wordCount: '45,200',
        chapterCount: 12,
        description: '少年意外觉醒了远古元素魔法，被迫卷入了一场关乎魔法世界存亡的战争...',
        lastUpdate: '2023-03-28',
        color: '#aa96da'
      }],
      stats: {
        totalWorks: 2,
        totalWords: '173,700',
        totalViews: '8,542',
        totalFavorites: 326
      }
    };
  }
});
// CONCATENATED MODULE: ./pages/write.vue?vue&type=script&lang=js
 /* harmony default export */ var pages_writevue_type_script_lang_js = (writevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/write.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(135)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_writevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  "5b534e9a"
  
)

/* harmony default export */ var write = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=write.js.map