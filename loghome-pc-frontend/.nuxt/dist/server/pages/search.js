exports.ids = [16];
exports.modules = {

/***/ 120:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(166);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("06bae06a", content, true, context)
};

/***/ }),

/***/ 165:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_21909cc9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(120);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_21909cc9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_21909cc9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_21909cc9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_21909cc9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 166:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\r\n/* 变量定义 - 深棕色系 */\n[data-v-21909cc9]:root {\r\n  --primary-color: #947358;\r\n  --secondary-color: #704C35;\r\n  --text-color: #333;\r\n  --text-light: #666;\r\n  --text-lighter: #888;\r\n  --border-color: #eee;\r\n  --border-light: #f5f5f5;\r\n  --background-color: #fff;\r\n  --orange-color: #FB7D46;\r\n  --orange-dark: #fa6c2e;\n}\n.search-page[data-v-21909cc9] {\r\n  min-height: 100vh;\r\n  background: #f8f9fa;\n}\r\n\r\n/* 搜索头部 */\n.search-header[data-v-21909cc9] {\r\n  background: white;\r\n  border-bottom: 1px solid #e0e0e0;\r\n  padding: 20px 0;\r\n  position: sticky;\r\n  top: 60px;\r\n  z-index: 100;\n}\n.search-container[data-v-21909cc9] {\r\n  max-width: 1200px;\r\n  margin: 0 auto;\r\n  padding: 0 20px;\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 15px;\n}\n.search-box[data-v-21909cc9] {\r\n  flex: 1;\r\n  max-width: 600px;\r\n  position: relative;\r\n  display: flex;\r\n  align-items: center;\r\n  background: #f5f5f5;\r\n  border-radius: 25px;\r\n  padding: 0 20px;\r\n  transition: all 0.3s;\n}\n.search-box[data-v-21909cc9]:focus-within {\r\n  background: white;\r\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\r\n  border: 1px solid #947358;\n}\n.search-icon[data-v-21909cc9] {\r\n  color: #999;\r\n  font-size: 18px;\r\n  margin-right: 10px;\n}\n.search-input[data-v-21909cc9] {\r\n  flex: 1;\r\n  border: none;\r\n  background: transparent;\r\n  outline: none;\r\n  padding: 12px 0;\r\n  font-size: 16px;\r\n  color: #333;\n}\n.search-input[data-v-21909cc9]::placeholder {\r\n  color: #999;\n}\n.search-clear[data-v-21909cc9] {\r\n  color: #999;\r\n  cursor: pointer;\r\n  font-size: 16px;\r\n  margin-left: 10px;\r\n  transition: color 0.3s;\n}\n.search-clear[data-v-21909cc9]:hover {\r\n  color: #666;\n}\n.search-btn[data-v-21909cc9] {\r\n  background: #947358;\r\n  color: white;\r\n  border: none;\r\n  padding: 12px 24px;\r\n  border-radius: 20px;\r\n  cursor: pointer;\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  transition: all 0.3s;\n}\n.search-btn[data-v-21909cc9]:hover:not(:disabled) {\r\n  background: #704C35;\n}\n.search-btn[data-v-21909cc9]:disabled {\r\n  background: #c0c4cc;\r\n  cursor: not-allowed;\n}\r\n\r\n/* 搜索内容区域 */\n.search-content[data-v-21909cc9] {\r\n  max-width: 1200px;\r\n  margin: 0 auto;\r\n  padding: 30px 20px;\n}\r\n\r\n/* 搜索前状态 */\n.search-before[data-v-21909cc9] {\r\n  max-width: 800px;\r\n  margin: 0 auto;\n}\n.search-section[data-v-21909cc9] {\r\n  margin-bottom: 40px;\n}\n.section-header[data-v-21909cc9] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  margin-bottom: 20px;\n}\n.section-title[data-v-21909cc9] {\r\n  font-size: 18px;\r\n  font-weight: 600;\r\n  color: #333;\r\n  margin: 0;\n}\n.clear-btn[data-v-21909cc9] {\r\n  background: none;\r\n  border: none;\r\n  color: #999;\r\n  cursor: pointer;\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 5px;\r\n  font-size: 14px;\r\n  transition: color 0.3s;\n}\n.clear-btn[data-v-21909cc9]:hover {\r\n  color: #666;\n}\n.tag-list[data-v-21909cc9] {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 12px;\n}\n.tag-item[data-v-21909cc9] {\r\n  background: white;\r\n  color: #666;\r\n  padding: 8px 16px;\r\n  border-radius: 20px;\r\n  font-size: 14px;\r\n  cursor: pointer;\r\n  border: 1px solid #e0e0e0;\r\n  transition: all 0.3s;\n}\n.tag-item[data-v-21909cc9]:hover {\r\n  background: #947358;\r\n  color: white;\r\n  border-color: #947358;\n}\n.hot-tag[data-v-21909cc9] {\r\n  background: linear-gradient(45deg, #704C35, #947358);\r\n  color: white;\r\n  border: none;\n}\n.hot-tag[data-v-21909cc9]:hover {\r\n  background: linear-gradient(45deg, #5D3C29, #A68B76);\r\n  transform: translateY(-2px);\n}\r\n\r\n/* 搜索后状态 */\n.search-stats[data-v-21909cc9] {\r\n  margin-bottom: 20px;\r\n  padding: 20px;\r\n  background: white;\r\n  border-radius: 8px;\r\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\n}\n.search-keyword[data-v-21909cc9] {\r\n  font-size: 18px;\r\n  font-weight: 600;\r\n  color: #947358;\r\n  margin-right: 15px;\n}\n.search-count[data-v-21909cc9] {\r\n  color: #666;\r\n  font-size: 14px;\n}\r\n\r\n/* 搜索类型切换 */\n.search-tabs[data-v-21909cc9] {\r\n  display: flex;\r\n  background: white;\r\n  border-radius: 8px;\r\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\r\n  margin-bottom: 30px;\r\n  overflow: hidden;\n}\n.tab-item[data-v-21909cc9] {\r\n  flex: 1;\r\n  padding: 15px 20px;\r\n  cursor: pointer;\r\n  text-align: center;\r\n  border-bottom: 3px solid transparent;\r\n  transition: all 0.3s;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  gap: 5px;\n}\n.tab-item[data-v-21909cc9]:hover {\r\n  background: #f8f9fa;\n}\n.tab-item.active[data-v-21909cc9] {\r\n  color: #947358;\r\n  border-bottom-color: #947358;\r\n  background: #f5f2ef;\n}\n.tab-name[data-v-21909cc9] {\r\n  font-weight: 500;\n}\n.tab-count[data-v-21909cc9] {\r\n  font-size: 12px;\r\n  color: #999;\n}\n.tab-item.active .tab-count[data-v-21909cc9] {\r\n  color: #947358;\n}\r\n\r\n/* 结果容器 */\n.results-container[data-v-21909cc9] {\r\n  min-height: 400px;\n}\n.loading[data-v-21909cc9] {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  padding: 60px 20px;\r\n  color: #666;\r\n  font-size: 16px;\r\n  gap: 10px;\n}\n.loading i[data-v-21909cc9] {\r\n  font-size: 20px;\n}\r\n\r\n/* 全部结果 */\n.result-section[data-v-21909cc9] {\r\n  background: white;\r\n  border-radius: 8px;\r\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\r\n  margin-bottom: 30px;\r\n  overflow: hidden;\n}\n.result-section .section-title[data-v-21909cc9] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  padding: 20px;\r\n  border-bottom: 1px solid #f0f0f0;\r\n  background: #f8f9fa;\n}\n.result-section .section-title h4[data-v-21909cc9] {\r\n  margin: 0;\r\n  font-size: 16px;\r\n  font-weight: 600;\r\n  color: #333;\n}\n.more-link[data-v-21909cc9] {\r\n  color: #947358;\r\n  text-decoration: none;\r\n  font-size: 14px;\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 5px;\r\n  transition: color 0.3s;\n}\n.more-link[data-v-21909cc9]:hover {\r\n  color: #704C35;\n}\r\n\r\n/* 书籍结果 */\n.book-grid[data-v-21909cc9] {\r\n  display: grid;\r\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\r\n  gap: 20px;\r\n  padding: 20px;\n}\n.book-item[data-v-21909cc9] {\r\n  display: flex;\r\n  cursor: pointer;\r\n  transition: all 0.3s;\r\n  padding: 15px;\r\n  border-radius: 8px;\n}\n.book-item[data-v-21909cc9]:hover {\r\n  background: #f5f2ef;\r\n  transform: translateY(-2px);\n}\n.book-cover[data-v-21909cc9] {\r\n  width: 60px;\r\n  height: 84px;\r\n  border-radius: 6px;\r\n  object-fit: cover;\r\n  margin-right: 15px;\r\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.book-info[data-v-21909cc9] {\r\n  flex: 1;\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: space-between;\n}\n.book-title[data-v-21909cc9] {\r\n  font-size: 16px;\r\n  font-weight: 600;\r\n  color: #333;\r\n  margin-bottom: 8px;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\n}\n.book-author[data-v-21909cc9] {\r\n  font-size: 14px;\r\n  color: #666;\r\n  margin-bottom: 8px;\n}\n.book-desc[data-v-21909cc9] {\r\n  font-size: 13px;\r\n  color: #999;\r\n  line-height: 1.4;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 2;\r\n  -webkit-box-orient: vertical;\n}\r\n\r\n/* 帖子结果 */\n.post-list[data-v-21909cc9] {\r\n  padding: 0;\n}\n.post-item[data-v-21909cc9] {\r\n  padding: 20px;\r\n  cursor: pointer;\r\n  border-bottom: 1px solid #f0f0f0;\r\n  transition: background-color 0.3s;\n}\n.post-item[data-v-21909cc9]:last-child {\r\n  border-bottom: none;\n}\n.post-item[data-v-21909cc9]:hover {\r\n  background: #f5f2ef;\n}\n.post-header[data-v-21909cc9] {\r\n  display: flex;\r\n  align-items: center;\r\n  margin-bottom: 12px;\n}\n.post-header .user-avatar[data-v-21909cc9] {\r\n  width: 32px;\r\n  height: 32px;\r\n  border-radius: 50%;\r\n  margin-right: 12px;\n}\n.post-meta[data-v-21909cc9] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 12px;\n}\n.user-name[data-v-21909cc9] {\r\n  font-size: 14px;\r\n  color: #666;\r\n  font-weight: 500;\n}\n.post-time[data-v-21909cc9] {\r\n  font-size: 12px;\r\n  color: #999;\n}\n.post-content[data-v-21909cc9] {\r\n  margin-left: 44px;\n}\n.post-title[data-v-21909cc9] {\r\n  font-size: 16px;\r\n  font-weight: 600;\r\n  color: #333;\r\n  margin-bottom: 8px;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\n}\n.post-text[data-v-21909cc9] {\r\n  font-size: 14px;\r\n  color: #666;\r\n  line-height: 1.5;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 2;\r\n  -webkit-box-orient: vertical;\n}\r\n\r\n/* 圈子结果 */\n.circle-list[data-v-21909cc9] {\r\n  padding: 20px;\r\n  display: grid;\r\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\r\n  gap: 20px;\n}\n.circle-item[data-v-21909cc9] {\r\n  display: flex;\r\n  cursor: pointer;\r\n  padding: 15px;\r\n  border-radius: 8px;\r\n  transition: all 0.3s;\n}\n.circle-item[data-v-21909cc9]:hover {\r\n  background: #f5f2ef;\r\n  transform: translateY(-2px);\n}\n.circle-icon[data-v-21909cc9] {\r\n  width: 50px;\r\n  height: 50px;\r\n  border-radius: 50%;\r\n  object-fit: cover;\r\n  margin-right: 15px;\n}\n.circle-info[data-v-21909cc9] {\r\n  flex: 1;\n}\n.circle-name[data-v-21909cc9] {\r\n  font-size: 16px;\r\n  font-weight: 600;\r\n  color: #333;\r\n  margin-bottom: 6px;\n}\n.circle-meta[data-v-21909cc9] {\r\n  font-size: 12px;\r\n  color: #666;\r\n  margin-bottom: 6px;\n}\n.circle-desc[data-v-21909cc9] {\r\n  font-size: 13px;\r\n  color: #999;\r\n  line-height: 1.4;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 2;\r\n  -webkit-box-orient: vertical;\n}\r\n\r\n/* 用户结果 */\n.user-list[data-v-21909cc9] {\r\n  padding: 20px;\r\n  display: grid;\r\n  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));\r\n  gap: 20px;\n}\n.user-item[data-v-21909cc9] {\r\n  display: flex;\r\n  cursor: pointer;\r\n  padding: 15px;\r\n  border-radius: 8px;\r\n  transition: all 0.3s;\n}\n.user-item[data-v-21909cc9]:hover {\r\n  background: #f5f2ef;\r\n  transform: translateY(-2px);\n}\n.user-item .user-avatar[data-v-21909cc9] {\r\n  width: 50px;\r\n  height: 50px;\r\n  border-radius: 50%;\r\n  object-fit: cover;\r\n  margin-right: 15px;\n}\n.user-info[data-v-21909cc9] {\r\n  flex: 1;\n}\n.user-name[data-v-21909cc9] {\r\n  font-size: 16px;\r\n  font-weight: 600;\r\n  color: #333;\r\n  margin-bottom: 6px;\n}\n.user-motto[data-v-21909cc9] {\r\n  font-size: 13px;\r\n  color: #666;\r\n  line-height: 1.4;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 2;\r\n  -webkit-box-orient: vertical;\n}\r\n\r\n/* 加载更多 */\n.load-more[data-v-21909cc9] {\r\n  text-align: center;\r\n  padding: 30px 20px;\n}\n.load-more-btn[data-v-21909cc9] {\r\n  background: white;\r\n  color: #947358;\r\n  border: 1px solid #947358;\r\n  padding: 12px 30px;\r\n  border-radius: 20px;\r\n  cursor: pointer;\r\n  font-size: 14px;\r\n  transition: all 0.3s;\r\n  display: inline-flex;\r\n  align-items: center;\r\n  gap: 8px;\n}\n.load-more-btn[data-v-21909cc9]:hover:not(:disabled) {\r\n  background: #947358;\r\n  color: white;\n}\n.load-more-btn[data-v-21909cc9]:disabled {\r\n  background: #f5f5f5;\r\n  color: #c0c4cc;\r\n  border-color: #e0e0e0;\r\n  cursor: not-allowed;\n}\r\n\r\n/* 无结果 */\n.no-results[data-v-21909cc9] {\r\n  text-align: center;\r\n  padding: 80px 20px;\r\n  color: #999;\n}\n.no-results-icon[data-v-21909cc9] {\r\n  font-size: 64px;\r\n  margin-bottom: 20px;\r\n  opacity: 0.5;\n}\n.no-results-text h3[data-v-21909cc9] {\r\n  font-size: 18px;\r\n  margin: 0 0 10px 0;\r\n  color: #666;\n}\n.no-results-text p[data-v-21909cc9] {\r\n  font-size: 14px;\r\n  margin: 0;\r\n  color: #999;\n}\r\n\r\n/* 响应式设计 */\n@media (max-width: 768px) {\n.search-container[data-v-21909cc9] {\r\n    padding: 0 15px;\r\n    flex-direction: column;\r\n    gap: 15px;\n}\n.search-box[data-v-21909cc9] {\r\n    max-width: none;\n}\n.search-content[data-v-21909cc9] {\r\n    padding: 20px 15px;\n}\n.search-tabs[data-v-21909cc9] {\r\n    flex-direction: column;\n}\n.tab-item[data-v-21909cc9] {\r\n    border-bottom: 1px solid #f0f0f0;\r\n    border-right: none;\n}\n.book-grid[data-v-21909cc9] {\r\n    grid-template-columns: 1fr;\r\n    gap: 15px;\r\n    padding: 15px;\n}\n.circle-list[data-v-21909cc9],\r\n  .user-list[data-v-21909cc9] {\r\n    grid-template-columns: 1fr;\r\n    gap: 15px;\r\n    padding: 15px;\n}\n.post-content[data-v-21909cc9] {\r\n    margin-left: 0;\n}\n.tag-list[data-v-21909cc9] {\r\n    gap: 8px;\n}\n.tag-item[data-v-21909cc9] {\r\n    font-size: 13px;\r\n    padding: 6px 12px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 226:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/search.vue?vue&type=template&id=21909cc9&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "search-page"
  }, [_vm._ssrNode("<div class=\"search-header\" data-v-21909cc9><div class=\"search-container\" data-v-21909cc9><div class=\"search-box\" data-v-21909cc9><i class=\"el-icon-search search-icon\" data-v-21909cc9></i> <input type=\"text\" placeholder=\"搜索小说、作者、帖子、用户...\"" + _vm._ssrAttr("value", _vm.searchKeyword) + " class=\"search-input\" data-v-21909cc9> " + (_vm.searchKeyword ? "<i class=\"el-icon-close search-clear\" data-v-21909cc9></i>" : "<!---->") + "</div> <button" + _vm._ssrAttr("disabled", !_vm.searchKeyword.trim()) + " class=\"search-btn\" data-v-21909cc9>\n        搜索\n      </button></div></div> "), _vm._ssrNode("<div class=\"search-content\" data-v-21909cc9>", "</div>", [_vm._ssrNode((!_vm.hasSearched ? "<div class=\"search-before\" data-v-21909cc9>" + (_vm.searchHistory.length > 0 ? "<div class=\"search-section\" data-v-21909cc9><div class=\"section-header\" data-v-21909cc9><h3 class=\"section-title\" data-v-21909cc9>搜索历史</h3> <button class=\"clear-btn\" data-v-21909cc9><i class=\"el-icon-delete\" data-v-21909cc9></i>\n            清空\n          </button></div> <div class=\"tag-list\" data-v-21909cc9>" + _vm._ssrList(_vm.searchHistory, function (item, index) {
    return "<span class=\"tag-item\" data-v-21909cc9>" + _vm._ssrEscape("\n            " + _vm._s(item) + "\n          ") + "</span>";
  }) + "</div></div>" : "<!---->") + " <div class=\"search-section\" data-v-21909cc9><div class=\"section-header\" data-v-21909cc9><h3 class=\"section-title\" data-v-21909cc9>热门搜索</h3></div> <div class=\"tag-list\" data-v-21909cc9>" + _vm._ssrList(_vm.hotSearches, function (item, index) {
    return "<span class=\"tag-item hot-tag\" data-v-21909cc9>" + _vm._ssrEscape("\n            " + _vm._s(item.keyword) + "\n          ") + "</span>";
  }) + "</div></div></div>" : "<!---->") + " "), _vm.hasSearched ? _vm._ssrNode("<div class=\"search-after\" data-v-21909cc9>", "</div>", [_vm._ssrNode("<div class=\"search-stats\" data-v-21909cc9><span class=\"search-keyword\" data-v-21909cc9>" + _vm._ssrEscape("\"" + _vm._s(_vm.currentKeyword) + "\"") + "</span> <span class=\"search-count\" data-v-21909cc9>" + _vm._ssrEscape("找到 " + _vm._s(_vm.totalResults) + " 个结果") + "</span></div> <div class=\"search-tabs\" data-v-21909cc9><div" + _vm._ssrClass("tab-item", {
    'active': _vm.searchType === 'all'
  }) + " data-v-21909cc9><span class=\"tab-name\" data-v-21909cc9>全部</span> " + (_vm.totalResults > 0 ? "<span class=\"tab-count\" data-v-21909cc9>" + _vm._ssrEscape("(" + _vm._s(_vm.totalResults) + ")") + "</span>" : "<!---->") + "</div> <div" + _vm._ssrClass("tab-item", {
    'active': _vm.searchType === 'books'
  }) + " data-v-21909cc9><span class=\"tab-name\" data-v-21909cc9>书籍</span> " + (_vm.searchResults.books.total > 0 ? "<span class=\"tab-count\" data-v-21909cc9>" + _vm._ssrEscape("(" + _vm._s(_vm.searchResults.books.total) + ")") + "</span>" : "<!---->") + "</div> <div" + _vm._ssrClass("tab-item", {
    'active': _vm.searchType === 'posts'
  }) + " data-v-21909cc9><span class=\"tab-name\" data-v-21909cc9>帖子</span> " + (_vm.searchResults.posts.total > 0 ? "<span class=\"tab-count\" data-v-21909cc9>" + _vm._ssrEscape("(" + _vm._s(_vm.searchResults.posts.total) + ")") + "</span>" : "<!---->") + "</div> <div" + _vm._ssrClass("tab-item", {
    'active': _vm.searchType === 'circles'
  }) + " data-v-21909cc9><span class=\"tab-name\" data-v-21909cc9>圈子</span> " + (_vm.searchResults.circles.total > 0 ? "<span class=\"tab-count\" data-v-21909cc9>" + _vm._ssrEscape("(" + _vm._s(_vm.searchResults.circles.total) + ")") + "</span>" : "<!---->") + "</div> <div" + _vm._ssrClass("tab-item", {
    'active': _vm.searchType === 'users'
  }) + " data-v-21909cc9><span class=\"tab-name\" data-v-21909cc9>用户</span> " + (_vm.searchResults.users.total > 0 ? "<span class=\"tab-count\" data-v-21909cc9>" + _vm._ssrEscape("(" + _vm._s(_vm.searchResults.users.total) + ")") + "</span>" : "<!---->") + "</div></div> "), _vm._ssrNode("<div class=\"results-container\" data-v-21909cc9>", "</div>", [_vm.isSearching ? _vm._ssrNode("<div class=\"loading\" data-v-21909cc9>", "</div>", [_vm._ssrNode("<i class=\"el-icon-loading\" data-v-21909cc9></i> <span data-v-21909cc9>搜索中...</span>")], 2) : _vm._ssrNode("<div class=\"results-content\" data-v-21909cc9>", "</div>", [_vm.searchType === 'all' ? _vm._ssrNode("<div class=\"all-results\" data-v-21909cc9>", "</div>", [_vm.searchResults.books.list.length > 0 ? _vm._ssrNode("<div class=\"result-section\" data-v-21909cc9>", "</div>", [_vm._ssrNode("<div class=\"section-title\" data-v-21909cc9>", "</div>", [_vm._ssrNode("<h4 data-v-21909cc9>书籍</h4> "), _c('nuxt-link', {
    staticClass: "more-link",
    attrs: {
      "to": `/search?type=books&keyword=${_vm.currentKeyword}`
    }
  }, [_vm._v("\n                  查看更多 "), _c('i', {
    staticClass: "el-icon-arrow-right"
  })])], 2), _vm._ssrNode(" <div class=\"book-grid\" data-v-21909cc9>" + _vm._ssrList(_vm.searchResults.books.list.slice(0, 6), function (book, index) {
    return "<div class=\"book-item\" data-v-21909cc9><img" + _vm._ssrAttr("src", book.picUrl + '?thumbnail=1') + _vm._ssrAttr("alt", book.name) + " class=\"book-cover\" data-v-21909cc9> <div class=\"book-info\" data-v-21909cc9><div class=\"book-title\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(book.name)) + "</div> <div class=\"book-author\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(book.author_name)) + "</div> <div class=\"book-desc\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(book.content)) + "</div></div></div>";
  }) + "</div>")], 2) : _vm._e(), _vm._ssrNode(" "), _vm.searchResults.posts.list.length > 0 ? _vm._ssrNode("<div class=\"result-section\" data-v-21909cc9>", "</div>", [_vm._ssrNode("<div class=\"section-title\" data-v-21909cc9>", "</div>", [_vm._ssrNode("<h4 data-v-21909cc9>帖子</h4> "), _c('nuxt-link', {
    staticClass: "more-link",
    attrs: {
      "to": `/search?type=posts&keyword=${_vm.currentKeyword}`
    }
  }, [_vm._v("\n                  查看更多 "), _c('i', {
    staticClass: "el-icon-arrow-right"
  })])], 2), _vm._ssrNode(" <div class=\"post-list\" data-v-21909cc9>" + _vm._ssrList(_vm.searchResults.posts.list.slice(0, 5), function (post, index) {
    return "<div class=\"post-item\" data-v-21909cc9><div class=\"post-header\" data-v-21909cc9><img" + _vm._ssrAttr("src", post.author_avatar || '/default-avatar.png') + _vm._ssrAttr("alt", post.author_name) + " class=\"user-avatar\" data-v-21909cc9> <div class=\"post-meta\" data-v-21909cc9><span class=\"user-name\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(post.author_name || '匿名用户')) + "</span> <span class=\"post-time\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(_vm.formatTime(post.create_time))) + "</span></div></div> <div class=\"post-content\" data-v-21909cc9><div class=\"post-title\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(post.title)) + "</div> <div class=\"post-text\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(post.content)) + "</div></div></div>";
  }) + "</div>")], 2) : _vm._e(), _vm._ssrNode(" "), _vm.searchResults.circles.list.length > 0 ? _vm._ssrNode("<div class=\"result-section\" data-v-21909cc9>", "</div>", [_vm._ssrNode("<div class=\"section-title\" data-v-21909cc9>", "</div>", [_vm._ssrNode("<h4 data-v-21909cc9>圈子</h4> "), _c('nuxt-link', {
    staticClass: "more-link",
    attrs: {
      "to": `/search?type=circles&keyword=${_vm.currentKeyword}`
    }
  }, [_vm._v("\n                  查看更多 "), _c('i', {
    staticClass: "el-icon-arrow-right"
  })])], 2), _vm._ssrNode(" <div class=\"circle-list\" data-v-21909cc9>" + _vm._ssrList(_vm.searchResults.circles.list.slice(0, 4), function (circle, index) {
    return "<div class=\"circle-item\" data-v-21909cc9><img" + _vm._ssrAttr("src", circle.icon || '/default-circle.png') + _vm._ssrAttr("alt", circle.name) + " class=\"circle-icon\" data-v-21909cc9> <div class=\"circle-info\" data-v-21909cc9><div class=\"circle-name\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(circle.name)) + "</div> <div class=\"circle-meta\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(circle.member_count || 0) + "人 · " + _vm._s(circle.category_name || '未分类')) + "</div> <div class=\"circle-desc\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(circle.description || '暂无描述')) + "</div></div></div>";
  }) + "</div>")], 2) : _vm._e(), _vm._ssrNode(" "), _vm.searchResults.users.list.length > 0 ? _vm._ssrNode("<div class=\"result-section\" data-v-21909cc9>", "</div>", [_vm._ssrNode("<div class=\"section-title\" data-v-21909cc9>", "</div>", [_vm._ssrNode("<h4 data-v-21909cc9>用户</h4> "), _c('nuxt-link', {
    staticClass: "more-link",
    attrs: {
      "to": `/search?type=users&keyword=${_vm.currentKeyword}`
    }
  }, [_vm._v("\n                  查看更多 "), _c('i', {
    staticClass: "el-icon-arrow-right"
  })])], 2), _vm._ssrNode(" <div class=\"user-list\" data-v-21909cc9>" + _vm._ssrList(_vm.searchResults.users.list.slice(0, 6), function (user, index) {
    return "<div class=\"user-item\" data-v-21909cc9><img" + _vm._ssrAttr("src", user.avatar_url || '/default-avatar.png') + _vm._ssrAttr("alt", user.name) + " class=\"user-avatar\" data-v-21909cc9> <div class=\"user-info\" data-v-21909cc9><div class=\"user-name\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(user.name || '匿名用户')) + "</div> <div class=\"user-motto\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(user.motto || '这个人很懒，还没有设置个性签名')) + "</div></div></div>";
  }) + "</div>")], 2) : _vm._e()], 2) : _vm._ssrNode("<div class=\"single-results\" data-v-21909cc9>" + (_vm.searchType === 'books' ? "<div class=\"book-results\" data-v-21909cc9><div class=\"book-grid\" data-v-21909cc9>" + _vm._ssrList(_vm.searchResults.books.list, function (book, index) {
    return "<div class=\"book-item\" data-v-21909cc9><img" + _vm._ssrAttr("src", book.picUrl + '?thumbnail=1') + _vm._ssrAttr("alt", book.name) + " class=\"book-cover\" data-v-21909cc9> <div class=\"book-info\" data-v-21909cc9><div class=\"book-title\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(book.name)) + "</div> <div class=\"book-author\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(book.author_name)) + "</div> <div class=\"book-desc\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(book.content)) + "</div></div></div>";
  }) + "</div></div>" : "<!---->") + " " + (_vm.searchType === 'posts' ? "<div class=\"post-results\" data-v-21909cc9><div class=\"post-list\" data-v-21909cc9>" + _vm._ssrList(_vm.searchResults.posts.list, function (post, index) {
    return "<div class=\"post-item\" data-v-21909cc9><div class=\"post-header\" data-v-21909cc9><img" + _vm._ssrAttr("src", post.author_avatar || '/default-avatar.png') + _vm._ssrAttr("alt", post.author_name) + " class=\"user-avatar\" data-v-21909cc9> <div class=\"post-meta\" data-v-21909cc9><span class=\"user-name\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(post.author_name || '匿名用户')) + "</span> <span class=\"post-time\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(_vm.formatTime(post.create_time))) + "</span></div></div> <div class=\"post-content\" data-v-21909cc9><div class=\"post-title\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(post.title)) + "</div> <div class=\"post-text\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(post.content)) + "</div></div></div>";
  }) + "</div></div>" : "<!---->") + " " + (_vm.searchType === 'circles' ? "<div class=\"circle-results\" data-v-21909cc9><div class=\"circle-list\" data-v-21909cc9>" + _vm._ssrList(_vm.searchResults.circles.list, function (circle, index) {
    return "<div class=\"circle-item\" data-v-21909cc9><img" + _vm._ssrAttr("src", circle.icon || '/default-circle.png') + _vm._ssrAttr("alt", circle.name) + " class=\"circle-icon\" data-v-21909cc9> <div class=\"circle-info\" data-v-21909cc9><div class=\"circle-name\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(circle.name)) + "</div> <div class=\"circle-meta\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(circle.member_count || 0) + "人 · " + _vm._s(circle.category_name || '未分类')) + "</div> <div class=\"circle-desc\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(circle.description || '暂无描述')) + "</div></div></div>";
  }) + "</div></div>" : "<!---->") + " " + (_vm.searchType === 'users' ? "<div class=\"user-results\" data-v-21909cc9><div class=\"user-list\" data-v-21909cc9>" + _vm._ssrList(_vm.searchResults.users.list, function (user, index) {
    return "<div class=\"user-item\" data-v-21909cc9><img" + _vm._ssrAttr("src", user.avatar_url || '/default-avatar.png') + _vm._ssrAttr("alt", user.name) + " class=\"user-avatar\" data-v-21909cc9> <div class=\"user-info\" data-v-21909cc9><div class=\"user-name\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(user.name || '匿名用户')) + "</div> <div class=\"user-motto\" data-v-21909cc9>" + _vm._ssrEscape(_vm._s(user.motto || '这个人很懒，还没有设置个性签名')) + "</div></div></div>";
  }) + "</div></div>" : "<!---->") + "</div>"), _vm._ssrNode(" " + (_vm.canLoadMore && _vm.searchType !== 'all' ? "<div class=\"load-more\" data-v-21909cc9><button" + _vm._ssrAttr("disabled", _vm.isLoadingMore) + " class=\"load-more-btn\" data-v-21909cc9>" + (_vm.isLoadingMore ? "<i class=\"el-icon-loading\" data-v-21909cc9></i>" : "<!---->") + _vm._ssrEscape("\n              " + _vm._s(_vm.isLoadingMore ? '加载中...' : '加载更多') + "\n            ") + "</button></div>" : "<!---->") + " " + (_vm.noResults ? "<div class=\"no-results\" data-v-21909cc9><div class=\"no-results-icon\" data-v-21909cc9><i class=\"el-icon-search\" data-v-21909cc9></i></div> <div class=\"no-results-text\" data-v-21909cc9><h3 data-v-21909cc9>没有找到相关内容</h3> <p data-v-21909cc9>试试其他关键词或检查拼写</p></div></div>" : "<!---->"))], 2)])], 2) : _vm._e()], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/search.vue?vue&type=template&id=21909cc9&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/search.vue?vue&type=script&lang=js
/* harmony default export */ var searchvue_type_script_lang_js = ({
  name: 'SearchPage',
  head() {
    return {
      title: this.hasSearched ? `${this.currentKeyword} - 搜索结果` : '搜索 - LogHome',
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.hasSearched ? `搜索"${this.currentKeyword}"的结果` : 'LogHome搜索页面'
      }]
    };
  },
  data() {
    return {
      searchKeyword: '',
      currentKeyword: '',
      hasSearched: false,
      searchType: 'all',
      searchHistory: [],
      hotSearches: [],
      searchResults: {
        circles: {
          list: [],
          total: 0
        },
        posts: {
          list: [],
          total: 0
        },
        users: {
          list: [],
          total: 0
        },
        books: {
          list: [],
          total: 0
        }
      },
      isSearching: false,
      isLoadingMore: false,
      searchTimer: null,
      currentPage: {
        circles: 1,
        posts: 1,
        users: 1,
        books: 1
      }
    };
  },
  computed: {
    totalResults() {
      const {
        circles,
        posts,
        users,
        books
      } = this.searchResults;
      return (circles.total || 0) + (posts.total || 0) + (users.total || 0) + (books.total || 0);
    },
    noResults() {
      if (!this.hasSearched) return false;
      return this.totalResults === 0;
    },
    canLoadMore() {
      if (this.searchType === 'all') return false;
      const currentResults = this.searchResults[this.searchType];
      return currentResults.list.length < currentResults.total;
    }
  },
  mounted() {
    this.loadSearchHistory();
    this.getHotSearches();

    // 处理URL参数
    const {
      keyword,
      type
    } = this.$route.query;
    if (keyword) {
      this.searchKeyword = keyword;
      this.currentKeyword = keyword;
      this.searchType = type || 'all';
      this.search();
    }

    // 聚焦搜索框
    this.$nextTick(() => {
      if (this.$refs.searchInput) {
        this.$refs.searchInput.focus();
      }
    });
  },
  watch: {
    '$route.query': {
      handler(newQuery) {
        const {
          keyword,
          type
        } = newQuery;
        if (keyword && keyword !== this.currentKeyword) {
          this.searchKeyword = keyword;
          this.currentKeyword = keyword;
          this.searchType = type || 'all';
          this.search();
        }
      },
      deep: true
    }
  },
  methods: {
    onSearchInput() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      // 实时搜索建议可以在这里实现
    },
    clearSearch() {
      this.searchKeyword = '';
      this.hasSearched = false;
      this.currentKeyword = '';
      this.$router.push('/search');
    },
    handleSearch() {
      if (!this.searchKeyword.trim()) return;
      this.currentKeyword = this.searchKeyword.trim();
      this.search();
      this.saveSearchHistory(this.currentKeyword);

      // 更新URL
      this.$router.push({
        path: '/search',
        query: {
          keyword: this.currentKeyword,
          type: this.searchType
        }
      });
    },
    searchWithKeyword(keyword) {
      this.searchKeyword = keyword;
      this.currentKeyword = keyword;
      this.search();
      this.saveSearchHistory(keyword);

      // 更新URL
      this.$router.push({
        path: '/search',
        query: {
          keyword: keyword,
          type: this.searchType
        }
      });
    },
    switchSearchType(type) {
      this.searchType = type;
      if (this.hasSearched) {
        this.resetPagination();
        this.search();

        // 更新URL
        this.$router.push({
          path: '/search',
          query: {
            keyword: this.currentKeyword,
            type: type
          }
        });
      }
    },
    resetPagination() {
      this.currentPage = {
        circles: 1,
        posts: 1,
        users: 1,
        books: 1
      };
    },
    async search() {
      if (this.isSearching || !this.currentKeyword.trim()) return;
      this.isSearching = true;
      this.hasSearched = true;
      try {
        if (this.searchType === 'all') {
          // 搜索所有类型
          await Promise.all([this.searchBooks(), this.searchPosts(), this.searchCircles(), this.searchUsers()]);
        } else {
          // 搜索单个类型
          switch (this.searchType) {
            case 'books':
              await this.searchBooks();
              break;
            case 'posts':
              await this.searchPosts();
              break;
            case 'circles':
              await this.searchCircles();
              break;
            case 'users':
              await this.searchUsers();
              break;
          }
        }
      } catch (error) {
        console.error('搜索失败:', error);
        this.$message.error('搜索失败，请稍后重试');
      } finally {
        this.isSearching = false;
      }
    },
    async loadMore() {
      if (this.isLoadingMore || !this.canLoadMore) return;
      this.isLoadingMore = true;
      this.currentPage[this.searchType]++;
      try {
        switch (this.searchType) {
          case 'books':
            await this.searchBooks(true);
            break;
          case 'posts':
            await this.searchPosts(true);
            break;
          case 'circles':
            await this.searchCircles(true);
            break;
          case 'users':
            await this.searchUsers(true);
            break;
        }
      } catch (error) {
        console.error('加载更多失败:', error);
        this.$message.error('加载失败，请稍后重试');
        this.currentPage[this.searchType]--;
      } finally {
        this.isLoadingMore = false;
      }
    },
    async searchBooks(isLoadMore = false) {
      try {
        const result = await this.$api.search.searchNovels({
          keyword: this.currentKeyword,
          page: this.currentPage.books,
          limit: this.searchType === 'all' ? 6 : 12
        });
        if (isLoadMore) {
          this.searchResults.books.list.push(...result.list);
        } else {
          this.searchResults.books = result;
        }
      } catch (error) {
        console.error('搜索书籍失败:', error);
        this.searchResults.books = {
          list: [],
          total: 0
        };
      }
    },
    async searchPosts(isLoadMore = false) {
      try {
        const result = await this.$api.search.searchPosts({
          keyword: this.currentKeyword,
          page: this.currentPage.posts,
          limit: this.searchType === 'all' ? 5 : 10
        });
        if (isLoadMore) {
          this.searchResults.posts.list.push(...result.list);
        } else {
          this.searchResults.posts = result;
        }
      } catch (error) {
        console.error('搜索帖子失败:', error);
        this.searchResults.posts = {
          list: [],
          total: 0
        };
      }
    },
    async searchCircles(isLoadMore = false) {
      try {
        const result = await this.$api.search.searchCircles({
          keyword: this.currentKeyword,
          page: this.currentPage.circles,
          limit: this.searchType === 'all' ? 4 : 8
        });
        if (isLoadMore) {
          this.searchResults.circles.list.push(...result.list);
        } else {
          this.searchResults.circles = result;
        }
      } catch (error) {
        console.error('搜索圈子失败:', error);
        this.searchResults.circles = {
          list: [],
          total: 0
        };
      }
    },
    async searchUsers(isLoadMore = false) {
      try {
        const result = await this.$api.search.searchUsers({
          keyword: this.currentKeyword,
          page: this.currentPage.users,
          limit: this.searchType === 'all' ? 6 : 12
        });
        if (isLoadMore) {
          this.searchResults.users.list.push(...result.list);
        } else {
          this.searchResults.users = result;
        }
      } catch (error) {
        console.error('搜索用户失败:', error);
        this.searchResults.users = {
          list: [],
          total: 0
        };
      }
    },
    saveSearchHistory(keyword) {
      if (!keyword || keyword.trim() === '') return;
      let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      history = history.filter(item => item !== keyword);
      history.unshift(keyword);
      history = history.slice(0, 10); // 最多保存10条

      localStorage.setItem('searchHistory', JSON.stringify(history));
      this.searchHistory = history;
    },
    loadSearchHistory() {
      this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    },
    clearSearchHistory() {
      localStorage.removeItem('searchHistory');
      this.searchHistory = [];
      this.$message.success('搜索历史已清空');
    },
    async getHotSearches() {
      try {
        this.hotSearches = await this.$api.search.getHotSearches();
      } catch (error) {
        console.error('获取热门搜索失败:', error);
        // 设置默认热门搜索
        this.hotSearches = [{
          keyword: '修仙'
        }, {
          keyword: '都市'
        }, {
          keyword: '玄幻'
        }, {
          keyword: '言情'
        }, {
          keyword: '历史'
        }, {
          keyword: '科幻'
        }, {
          keyword: '悬疑'
        }, {
          keyword: '武侠'
        }];
      }
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      if (diff < 60000) {
        return '刚刚';
      } else if (diff < 3600000) {
        return Math.floor(diff / 60000) + '分钟前';
      } else if (diff < 86400000) {
        return Math.floor(diff / 3600000) + '小时前';
      } else {
        return Math.floor(diff / 86400000) + '天前';
      }
    },
    // 导航方法
    navigateToBook(novelId, novelType) {
      // 如果是世界设定类型，跳转到world页面，否则跳转到novel页面
      if (novelType === 'world') {
        this.$router.push(`/world/${novelId}`);
      } else {
        this.$router.push(`/novel/${novelId}`);
      }
    },
    navigateToPost(postId) {
      this.$router.push(`/community/post/${postId}`);
    },
    navigateToCircle(circleId) {
      this.$router.push(`/community/circle/${circleId}`);
    },
    navigateToUser(userId) {
      this.$router.push(`/users/${userId}`);
    }
  }
});
// CONCATENATED MODULE: ./pages/search.vue?vue&type=script&lang=js
 /* harmony default export */ var pages_searchvue_type_script_lang_js = (searchvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/search.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(165)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_searchvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "21909cc9",
  "76a66604"
  
)

/* harmony default export */ var search = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=search.js.map