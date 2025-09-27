exports.ids = [4];
exports.modules = {

/***/ 134:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(189);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("5fd6649f", content, true, context)
};

/***/ }),

/***/ 188:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_7c37a923_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(134);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_7c37a923_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_7c37a923_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_7c37a923_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_7c37a923_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 189:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.circle-detail-container[data-v-7c37a923] {\r\n  max-width: 1200px;\r\n  margin: 0 auto;\r\n  padding: 20px;\r\n  background: #f5f7fa;\r\n  min-height: 100vh;\n}\n.circle-header[data-v-7c37a923] {\r\n  position: relative;\r\n  background: #fff;\r\n  border-radius: 16px;\r\n  overflow: hidden;\r\n  margin-bottom: 24px;\r\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\r\n  transition: box-shadow 0.3s ease;\n}\n.circle-header[data-v-7c37a923]:hover {\r\n  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);\n}\n.circle-bg[data-v-7c37a923] {\r\n  height: 240px;\r\n  background-size: cover;\r\n  background-position: center;\r\n  background-repeat: no-repeat;\r\n  filter: blur(0.5px);\n}\n.header-overlay[data-v-7c37a923] {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%);\n}\n.circle-info[data-v-7c37a923] {\r\n  position: absolute;\r\n  bottom: 24px;\r\n  left: 24px;\r\n  right: 24px;\r\n  display: flex;\r\n  align-items: flex-end;\r\n  color: white;\n}\n.circle-avatar[data-v-7c37a923] {\r\n  width: 100px;\r\n  height: 100px;\r\n  border-radius: 20px;\r\n  border: 4px solid rgba(255, 255, 255, 0.9);\r\n  margin-right: 20px;\r\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);\r\n  transition: transform 0.3s ease;\n}\n.circle-avatar[data-v-7c37a923]:hover {\r\n  transform: scale(1.05);\n}\n.circle-meta[data-v-7c37a923] {\r\n  flex: 1;\n}\n.circle-name[data-v-7c37a923] {\r\n  font-size: 28px;\r\n  font-weight: 700;\r\n  margin-bottom: 8px;\r\n  display: flex;\r\n  align-items: center;\r\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);\r\n  letter-spacing: 0.5px;\r\n  color: rgba(255, 255, 255, 0.95);\n}\n.official-tag[data-v-7c37a923] {\r\n  background: linear-gradient(135deg, #FB7D46, #fa6c2e);\r\n  color: white;\r\n  padding: 4px 12px;\r\n  border-radius: 16px;\r\n  font-size: 12px;\r\n  font-weight: 600;\r\n  margin-left: 12px;\r\n  box-shadow: 0 2px 8px rgba(251, 125, 70, 0.3);\n}\n.circle-stats[data-v-7c37a923] {\r\n  display: flex;\r\n  gap: 20px;\r\n  margin-bottom: 12px;\r\n  font-size: 14px;\r\n  color: rgba(255, 255, 255, 0.85);\r\n  font-weight: 600;\n}\n.circle-stats span[data-v-7c37a923] {\r\n  margin-right: 15px;\r\n  font-size: 14px;\r\n  opacity: 0.9;\n}\n.circle-description[data-v-7c37a923] {\r\n  font-size: 14px;\r\n  color: rgba(255, 255, 255, 0.8);\r\n  line-height: 1.6;\r\n  cursor: pointer;\r\n  transition: color 0.3s ease;\r\n  max-width: 600px;\n}\n.circle-description[data-v-7c37a923]:hover {\r\n  color: rgba(255, 255, 255, 1);\n}\n.action-bar[data-v-7c37a923] {\r\n  background: #fff;\r\n  border-radius: 16px;\r\n  padding: 20px 24px;\r\n  margin-bottom: 24px;\r\n  display: flex;\r\n  gap: 12px;\r\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\r\n  transition: box-shadow 0.3s ease;\n}\n.action-bar[data-v-7c37a923]:hover {\r\n  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);\n}\n.action-bar .el-button[data-v-7c37a923] {\r\n  border-radius: 12px;\r\n  font-weight: 600;\r\n  padding: 12px 24px;\r\n  transition: all 0.3s ease;\n}\n.action-bar .el-button--primary[data-v-7c37a923] {\r\n  background: #947358;\r\n  border-color: #947358;\r\n  color: white;\r\n  box-shadow: 0 4px 15px rgba(148, 115, 88, 0.3);\n}\n.action-bar .el-button--primary[data-v-7c37a923]:hover {\r\n  background: #704C35;\r\n  border-color: #704C35;\r\n  transform: translateY(-2px);\r\n  box-shadow: 0 8px 25px rgba(148, 115, 88, 0.4);\n}\n.action-bar .el-button--success[data-v-7c37a923] {\r\n  background: #947358;\r\n  border-color: #947358;\r\n  color: white;\r\n  box-shadow: 0 4px 15px rgba(148, 115, 88, 0.3);\n}\n.action-bar .el-button--success[data-v-7c37a923]:hover {\r\n  background: #704C35;\r\n  border-color: #704C35;\r\n  transform: translateY(-2px);\r\n  box-shadow: 0 8px 25px rgba(148, 115, 88, 0.4);\n}\n.action-bar .el-button--default[data-v-7c37a923] {\r\n  background: #fff;\r\n  color: #947358;\r\n  border: 1px solid #947358;\r\n  box-shadow: 0 4px 15px rgba(148, 115, 88, 0.1);\n}\n.action-bar .el-button--default[data-v-7c37a923]:hover {\r\n  background: #947358;\r\n  color: white;\r\n  transform: translateY(-2px);\r\n  box-shadow: 0 8px 25px rgba(148, 115, 88, 0.3);\n}\n.circle-members[data-v-7c37a923] {\r\n  background: #fff;\r\n  border-radius: 16px;\r\n  padding: 24px;\r\n  margin-bottom: 24px;\r\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\r\n  transition: box-shadow 0.3s ease;\n}\n.circle-members[data-v-7c37a923]:hover {\r\n  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);\n}\n.section-header[data-v-7c37a923] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  margin-bottom: 20px;\r\n  padding-bottom: 12px;\r\n  border-bottom: 2px solid #f0f2f5;\n}\n.section-header .el-button--text[data-v-7c37a923] {\r\n  background: linear-gradient(135deg, #947358, #704C35);\r\n  color: white;\r\n  border: none;\r\n  border-radius: 20px;\r\n  padding: 8px 16px;\r\n  font-size: 12px;\r\n  font-weight: 600;\r\n  cursor: pointer;\r\n  transition: all 0.3s ease;\r\n  box-shadow: 0 2px 8px rgba(148, 115, 88, 0.3);\n}\n.section-header .el-button--text[data-v-7c37a923]:hover {\r\n  transform: translateY(-2px);\r\n  box-shadow: 0 4px 12px rgba(148, 115, 88, 0.4);\r\n  background: linear-gradient(135deg, #704C35, #5a3a28);\n}\n.section-title[data-v-7c37a923] {\r\n  margin: 0;\r\n  font-size: 20px;\r\n  font-weight: 700;\r\n  color: #2c3e50;\r\n  display: flex;\r\n  align-items: center;\n}\n.section-title[data-v-7c37a923]::before {\r\n  content: '';\r\n  width: 4px;\r\n  height: 20px;\r\n  background: linear-gradient(135deg, #947358, #704C35);\r\n  border-radius: 2px;\r\n  margin-right: 12px;\n}\n.members-list[data-v-7c37a923] {\r\n  display: flex;\r\n  gap: 20px;\r\n  overflow-x: auto;\r\n  padding: 16px 0;\r\n  scrollbar-width: thin;\r\n  scrollbar-color: #ddd transparent;\n}\n.members-list[data-v-7c37a923]::-webkit-scrollbar {\r\n  height: 6px;\n}\n.members-list[data-v-7c37a923]::-webkit-scrollbar-track {\r\n  background: #f1f1f1;\r\n  border-radius: 3px;\n}\n.members-list[data-v-7c37a923]::-webkit-scrollbar-thumb {\r\n  background: #c1c1c1;\r\n  border-radius: 3px;\n}\n.member-item[data-v-7c37a923] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  min-width: 90px;\r\n  cursor: pointer;\r\n  transition: all 0.3s ease;\r\n  padding: 12px;\r\n  border-radius: 12px;\n}\n.member-item[data-v-7c37a923]:hover {\r\n  transform: translateY(-4px);\r\n  background: rgba(148, 115, 88, 0.05);\r\n  box-shadow: 0 4px 16px rgba(148, 115, 88, 0.15);\n}\n.member-avatar-wrapper[data-v-7c37a923] {\r\n  position: relative;\r\n  margin-bottom: 12px;\n}\n.member-avatar[data-v-7c37a923] {\r\n  width: 56px;\r\n  height: 56px;\r\n  border-radius: 50%;\r\n  border: 3px solid #fff;\r\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\r\n  transition: transform 0.3s ease;\n}\n.member-item:hover .member-avatar[data-v-7c37a923] {\r\n  transform: scale(1.1);\n}\n.member-role[data-v-7c37a923] {\r\n  position: absolute;\r\n  bottom: -8px;\r\n  left: 50%;\r\n  transform: translateX(-50%);\r\n  background: linear-gradient(135deg, #947358, #704C35);\r\n  color: white;\r\n  padding: 4px 8px;\r\n  border-radius: 12px;\r\n  font-size: 10px;\r\n  font-weight: 600;\r\n  white-space: nowrap;\r\n  box-shadow: 0 2px 8px rgba(148, 115, 88, 0.3);\n}\n.member-role.admin[data-v-7c37a923] {\r\n  background: linear-gradient(135deg, #947358, #a8926f);\r\n  box-shadow: 0 2px 8px rgba(148, 115, 88, 0.3);\n}\n.member-name[data-v-7c37a923] {\r\n  font-size: 13px;\r\n  font-weight: 500;\r\n  text-align: center;\r\n  max-width: 90px;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  white-space: nowrap;\r\n  color: #333;\r\n  transition: color 0.3s ease;\n}\n.posts-container[data-v-7c37a923] {\r\n  background: #fff;\r\n  border-radius: 16px;\r\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\r\n  transition: box-shadow 0.3s ease;\r\n  overflow: hidden;\n}\n.posts-container[data-v-7c37a923]:hover {\r\n  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);\n}\n.filter-bar[data-v-7c37a923] {\r\n  padding: 20px 24px 0;\r\n  border-bottom: 1px solid #f0f2f5;\n}\n.filter-bar .el-tabs__header[data-v-7c37a923] {\r\n  margin: 0;\n}\n.filter-bar .el-tabs__nav-wrap[data-v-7c37a923]::after {\r\n  background: #f0f2f5;\n}\n.filter-bar .el-tabs__active-bar[data-v-7c37a923] {\r\n  background: #947358;\n}\n.filter-bar .el-tabs__item[data-v-7c37a923] {\r\n  font-weight: 600;\r\n  color: #666;\r\n  transition: all 0.3s ease;\n}\n.filter-bar .el-tabs__item.is-active[data-v-7c37a923] {\r\n  color: #947358;\n}\n.posts-list[data-v-7c37a923] {\r\n  padding: 24px;\n}\n.post-card[data-v-7c37a923] {\r\n  background: white;\r\n  border-radius: 16px;\r\n  padding: 24px;\r\n  box-shadow: 0 4px 20px rgba(0,0,0,0.08);\r\n  transition: all 0.3s ease;\r\n  border: 1px solid rgba(0,0,0,0.05);\r\n  cursor: pointer;\r\n  margin-bottom: 20px;\n}\n.post-card[data-v-7c37a923]:hover {\r\n  box-shadow: 0 8px 30px rgba(0,0,0,0.12);\r\n  transform: translateY(-2px);\n}\n.post-header[data-v-7c37a923] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  margin-bottom: 16px;\n}\n.user-info[data-v-7c37a923] {\r\n  display: flex;\r\n  align-items: center;\r\n  cursor: pointer;\r\n  transition: all 0.3s ease;\r\n  padding: 8px;\r\n  border-radius: 12px;\r\n  margin: -8px;\n}\n.user-info[data-v-7c37a923]:hover {\r\n  background: rgba(148, 115, 88, 0.05);\r\n  transform: translateX(4px);\n}\n.user-avatar[data-v-7c37a923] {\r\n  width: 44px;\r\n  height: 44px;\r\n  border-radius: 50%;\r\n  margin-right: 12px;\r\n  border: 2px solid #fff;\r\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\r\n  transition: transform 0.3s ease;\n}\n.user-info:hover .user-avatar[data-v-7c37a923] {\r\n  transform: scale(1.05);\n}\n.user-meta[data-v-7c37a923] {\r\n  display: flex;\r\n  flex-direction: column;\n}\n.user-name[data-v-7c37a923] {\r\n  font-weight: 600;\r\n  color: #333;\r\n  margin-bottom: 4px;\r\n  font-size: 15px;\n}\n.post-time[data-v-7c37a923] {\r\n  font-size: 13px;\r\n  color: #888;\r\n  font-weight: 500;\n}\n.post-content[data-v-7c37a923] {\r\n  margin-bottom: 20px;\n}\n.post-title[data-v-7c37a923] {\r\n  font-size: 18px;\r\n  font-weight: 700;\r\n  margin: 0 0 12px 0;\r\n  color: #333;\r\n  line-height: 1.4;\r\n  letter-spacing: 0.3px;\n}\n.post-text[data-v-7c37a923] {\r\n  color: #6c757d;\r\n  line-height: 1.6;\r\n  font-size: 15px;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 2;\r\n  -webkit-box-orient: vertical;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  max-height: 3.2em;\r\n  margin: 0;\n}\n.post-images[data-v-7c37a923] {\r\n  margin: 16px 0;\n}\n.image-grid[data-v-7c37a923] {\r\n  display: grid;\r\n  gap: 8px;\r\n  border-radius: 12px;\r\n  overflow: hidden;\r\n  position: relative;\n}\n.grid-1[data-v-7c37a923] {\r\n  grid-template-columns: 1fr;\r\n  max-width: 300px;\n}\n.grid-2[data-v-7c37a923] {\r\n  grid-template-columns: repeat(2, 1fr);\r\n  max-width: 400px;\n}\n.grid-3[data-v-7c37a923] {\r\n  grid-template-columns: repeat(3, 1fr);\r\n  max-width: 450px;\n}\n.grid-multi[data-v-7c37a923] {\r\n  grid-template-columns: repeat(3, 1fr);\r\n  max-width: 450px;\n}\n.post-image[data-v-7c37a923] {\r\n  width: 100%;\r\n  height: 120px;\r\n  object-fit: cover;\r\n  cursor: pointer;\r\n  transition: all 0.3s ease;\r\n  border-radius: 8px;\n}\n.post-image[data-v-7c37a923]:hover {\r\n  transform: scale(1.05);\n}\n.image-count[data-v-7c37a923] {\r\n  position: absolute;\r\n  bottom: 8px;\r\n  right: 8px;\r\n  background: rgba(0,0,0,0.7);\r\n  color: white;\r\n  padding: 4px 8px;\r\n  border-radius: 12px;\r\n  font-size: 12px;\n}\n.post-image[data-v-7c37a923]:hover {\r\n  transform: scale(1.05);\n}\n.post-footer[data-v-7c37a923] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 24px;\r\n  margin-top: 16px;\r\n  padding-top: 16px;\r\n  border-top: 1px solid #f1f3f4;\n}\n.action-btn[data-v-7c37a923] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n  background: none;\r\n  border: none;\r\n  color: #6c757d;\r\n  cursor: pointer;\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  padding: 8px 12px;\r\n  border-radius: 20px;\r\n  transition: all 0.3s ease;\n}\n.action-btn[data-v-7c37a923]:hover {\r\n  color: #947358;\r\n  background: rgba(148, 115, 88, 0.1);\n}\n.action-btn.liked[data-v-7c37a923] {\r\n  color: #EA7034;\n}\n.action-btn.liked[data-v-7c37a923]:hover {\r\n  background: rgba(234, 112, 52, 0.1);\n}\n.action-btn .liked[data-v-7c37a923] {\r\n  color: #EA7034;\n}\n.float-btn[data-v-7c37a923] {\r\n  position: fixed;\r\n  bottom: 30px;\r\n  right: 30px;\r\n  width: 64px;\r\n  height: 64px;\r\n  z-index: 1000;\r\n  background: linear-gradient(135deg, #947358, #704C35);\r\n  border: none;\r\n  box-shadow: 0 8px 24px rgba(148, 115, 88, 0.4);\r\n  transition: all 0.3s ease;\r\n  font-size: 20px;\n}\n.float-btn[data-v-7c37a923]:hover {\r\n  transform: translateY(-4px) scale(1.05);\r\n  box-shadow: 0 12px 32px rgba(148, 115, 88, 0.5);\r\n  background: linear-gradient(135deg, #704C35, #5a3a28);\n}\n.float-btn[data-v-7c37a923]:active {\r\n  transform: translateY(-2px) scale(1.02);\n}\n.load-more[data-v-7c37a923] {\r\n  text-align: center;\r\n  padding: 24px;\n}\n.load-more .el-button[data-v-7c37a923] {\r\n  background: linear-gradient(135deg, #947358, #704C35);\r\n  border: none;\r\n  color: white;\r\n  padding: 12px 32px;\r\n  border-radius: 25px;\r\n  font-weight: 600;\r\n  font-size: 14px;\r\n  transition: all 0.3s ease;\r\n  box-shadow: 0 4px 15px rgba(148, 115, 88, 0.3);\n}\n.load-more .el-button[data-v-7c37a923]:hover {\r\n  transform: translateY(-2px);\r\n  box-shadow: 0 8px 25px rgba(148, 115, 88, 0.4);\r\n  background: linear-gradient(135deg, #704C35, #5a3a28);\n}\n.empty-state[data-v-7c37a923] {\r\n  text-align: center;\r\n  padding: 60px 20px;\n}\n.empty-image[data-v-7c37a923] {\r\n  width: 120px;\r\n  height: 120px;\r\n  opacity: 0.5;\r\n  margin-bottom: 20px;\n}\n.empty-text[data-v-7c37a923] {\r\n  color: #888;\r\n  font-size: 16px;\n}\n.info-content[data-v-7c37a923] {\r\n  max-height: 500px;\r\n  overflow-y: auto;\n}\n.info-section[data-v-7c37a923] {\r\n  margin-bottom: 20px;\n}\n.info-title[data-v-7c37a923] {\r\n  font-size: 16px;\r\n  font-weight: 600;\r\n  margin: 0 0 10px 0;\r\n  color: #333;\n}\n.info-text[data-v-7c37a923] {\r\n  color: #666;\r\n  line-height: 1.6;\r\n  margin: 0;\n}\n@media (max-width: 768px) {\n.circle-detail-container[data-v-7c37a923] {\r\n    padding: 10px;\n}\n.circle-info[data-v-7c37a923] {\r\n    flex-direction: column;\r\n    align-items: flex-start;\n}\n.circle-avatar[data-v-7c37a923] {\r\n    width: 60px;\r\n    height: 60px;\r\n    margin-bottom: 10px;\n}\n.action-bar[data-v-7c37a923] {\r\n    flex-direction: column;\n}\n.members-list[data-v-7c37a923] {\r\n    justify-content: flex-start;\n}\n.float-btn[data-v-7c37a923] {\r\n    bottom: 20px;\r\n    right: 20px;\r\n    width: 50px;\r\n    height: 50px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 232:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/circle/_id.vue?vue&type=template&id=7c37a923&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "circle-detail-container"
  }, [_vm._ssrNode("<div class=\"circle-header\" data-v-7c37a923><div class=\"circle-bg\"" + _vm._ssrStyle(null, {
    backgroundImage: `url(${_vm.circle.bg_url || _vm.circle.icon || '/default-circle.png'})`
  }, null) + " data-v-7c37a923></div> <div class=\"header-overlay\" data-v-7c37a923></div> <div class=\"circle-info\" data-v-7c37a923><img" + _vm._ssrAttr("src", _vm.circle.icon || '/default-circle.png') + _vm._ssrAttr("alt", _vm.circle.name) + " class=\"circle-avatar\" data-v-7c37a923> <div class=\"circle-meta\" data-v-7c37a923><div class=\"circle-name\" data-v-7c37a923>" + _vm._ssrEscape("\n          " + _vm._s(_vm.circle.name) + "\n          ") + (_vm.circle.is_official ? "<span class=\"official-tag\" data-v-7c37a923>官方</span>" : "<!---->") + "</div> <div class=\"circle-stats\" data-v-7c37a923><span data-v-7c37a923>" + _vm._ssrEscape(_vm._s(_vm.circle.member_count) + "成员") + "</span> <span data-v-7c37a923>" + _vm._ssrEscape(_vm._s(_vm.circle.post_count) + "帖子") + "</span></div> <div class=\"circle-description\" data-v-7c37a923>" + _vm._ssrEscape(_vm._s(_vm.circle.description)) + "</div></div></div></div> "), _vm._ssrNode("<div class=\"action-bar\" data-v-7c37a923>", "</div>", [_c('el-button', {
    attrs: {
      "type": _vm.isJoined ? 'success' : 'primary',
      "loading": _vm.joinLoading
    },
    on: {
      "click": _vm.toggleJoin
    }
  }, [_vm._v("\n      " + _vm._s(_vm.isJoined ? '已加入' : '加入圈子') + "\n    ")]), _vm._ssrNode(" "), _c('el-button', {
    on: {
      "click": _vm.showCircleInfo
    }
  }, [_vm._v("圈子公告")]), _vm._ssrNode(" "), _vm.isJoined && (_vm.userRole === 1 || _vm.userRole === 2) ? _c('el-button', {
    on: {
      "click": _vm.openEditCircle
    }
  }, [_vm._v("圈子设置")]) : _vm._e()], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"circle-members\" data-v-7c37a923>", "</div>", [_vm._ssrNode("<div class=\"section-header\" data-v-7c37a923>", "</div>", [_vm._ssrNode("<h3 class=\"section-title\" data-v-7c37a923>" + _vm._ssrEscape("成员 (" + _vm._s(_vm.circle.member_count || 0) + ")") + "</h3> "), _c('el-button', {
    attrs: {
      "type": "text"
    },
    on: {
      "click": _vm.openCircleMembers
    }
  }, [_vm._v("\n        更多 "), _c('i', {
    staticClass: "el-icon-arrow-right"
  })])], 2), _vm._ssrNode(" <div class=\"members-list\" data-v-7c37a923>" + _vm._ssrList(_vm.members, function (member, index) {
    return "<div class=\"member-item\" data-v-7c37a923><div class=\"member-avatar-wrapper\" data-v-7c37a923><img" + _vm._ssrAttr("src", member.avatar_url || '/default-avatar.jpg') + _vm._ssrAttr("alt", member.name) + " class=\"member-avatar\" data-v-7c37a923> " + (member.role === 2 ? "<span class=\"member-role\" data-v-7c37a923>圈主</span>" : member.role === 1 ? "<span class=\"member-role admin\" data-v-7c37a923>管理员</span>" : "<!---->") + "</div> <span class=\"member-name\" data-v-7c37a923>" + _vm._ssrEscape(_vm._s(member.name)) + "</span></div>";
  }) + "</div>")], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"posts-container\" data-v-7c37a923>", "</div>", [_vm._ssrNode("<div class=\"filter-bar\" data-v-7c37a923>", "</div>", [_c('el-tabs', {
    on: {
      "tab-click": _vm.switchFilter
    },
    model: {
      value: _vm.currentFilter,
      callback: function ($$v) {
        _vm.currentFilter = $$v;
      },
      expression: "currentFilter"
    }
  }, _vm._l(_vm.filters, function (item, index) {
    return _c('el-tab-pane', {
      key: index,
      attrs: {
        "label": item.name,
        "name": item.value
      }
    });
  }), 1)], 1), _vm._ssrNode(" "), _c('div', {
    directives: [{
      name: "loading",
      rawName: "v-loading",
      value: _vm.loadingPosts,
      expression: "loadingPosts"
    }],
    staticClass: "posts-list"
  }, [_vm._l(_vm.posts, function (post, index) {
    return _vm._ssrNode("<div class=\"post-card\" data-v-7c37a923>", "</div>", [_vm._ssrNode("<div class=\"post-header\" data-v-7c37a923>", "</div>", [_vm._ssrNode("<div class=\"user-info\" data-v-7c37a923><img" + _vm._ssrAttr("src", post.author_avatar || '/default-avatar.jpg') + " alt=\"用户头像\" class=\"user-avatar\" data-v-7c37a923> <div class=\"user-meta\" data-v-7c37a923><span class=\"user-name\" data-v-7c37a923>" + _vm._ssrEscape(_vm._s(post.author_name)) + "</span> <span class=\"post-time\" data-v-7c37a923>" + _vm._ssrEscape(_vm._s(_vm.formatTime(post.create_time))) + "</span></div></div> "), post.is_top ? _c('el-tag', {
      attrs: {
        "type": "warning",
        "size": "small"
      }
    }, [_vm._v("置顶")]) : _vm._e()], 2), _vm._ssrNode(" <div class=\"post-content\" data-v-7c37a923><h4 class=\"post-title\" data-v-7c37a923>" + _vm._ssrEscape(_vm._s(post.title)) + "</h4> <p class=\"post-text\" data-v-7c37a923>" + _vm._ssrEscape(_vm._s(post.content)) + "</p></div> " + (post.media_urls && post.media_urls.length > 0 ? "<div class=\"post-images\" data-v-7c37a923><div" + _vm._ssrClass(null, ['image-grid', 'grid-' + (post.media_urls.length > 3 ? 'multi' : post.media_urls.length)]) + " data-v-7c37a923>" + _vm._ssrList(post.media_urls.slice(0, 9), function (img, imgIndex) {
      return "<img" + _vm._ssrAttr("src", img) + " alt=\"帖子图片\" class=\"post-image\" data-v-7c37a923>";
    }) + " " + (post.media_urls.length > 9 ? "<div class=\"image-count\" data-v-7c37a923>" + _vm._ssrEscape("+" + _vm._s(post.media_urls.length - 9)) + "</div>" : "<!---->") + "</div></div>" : "<!---->") + " <div class=\"post-footer\" data-v-7c37a923><div class=\"action-btn\" data-v-7c37a923><i class=\"el-icon-chat-dot-round\" data-v-7c37a923></i> <span data-v-7c37a923>" + _vm._ssrEscape(_vm._s(post.comment_count || 0)) + "</span></div> <div" + _vm._ssrClass("action-btn", {
      liked: post.is_liked
    }) + " data-v-7c37a923><i" + _vm._ssrClass(null, post.is_liked ? 'el-icon-star-on' : 'el-icon-star-off') + _vm._ssrStyle(null, {
      color: post.is_liked ? '#EA7034' : '#666'
    }, null) + " data-v-7c37a923></i> <span" + _vm._ssrClass(null, {
      liked: post.is_liked
    }) + " data-v-7c37a923>" + _vm._ssrEscape(_vm._s(post.like_count || 0)) + "</span></div> <div class=\"action-btn\" data-v-7c37a923><i class=\"el-icon-share\" data-v-7c37a923></i> <span data-v-7c37a923>分享</span></div></div>")], 2);
  }), _vm._ssrNode(" "), _vm.hasMore && !_vm.loadingPosts ? _vm._ssrNode("<div class=\"load-more\" data-v-7c37a923>", "</div>", [_c('el-button', {
    attrs: {
      "loading": _vm.loadingMore
    },
    on: {
      "click": _vm.loadMore
    }
  }, [_vm._v("加载更多")])], 1) : _vm._e(), _vm._ssrNode(" " + (_vm.posts.length === 0 && !_vm.loadingPosts ? "<div class=\"empty-state\" data-v-7c37a923><img src=\"/nothing.png\" alt=\"暂无内容\" class=\"empty-image\" data-v-7c37a923> <p class=\"empty-text\" data-v-7c37a923>暂无帖子</p></div>" : "<!---->"))], 2)], 2), _vm._ssrNode(" "), _c('el-button', {
    staticClass: "float-btn",
    attrs: {
      "type": "primary",
      "circle": ""
    },
    on: {
      "click": _vm.createPost
    }
  }, [_c('i', {
    staticClass: "el-icon-plus"
  })]), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "title": "圈子信息",
      "visible": _vm.infoDialogVisible,
      "width": "600px"
    },
    on: {
      "update:visible": function ($event) {
        _vm.infoDialogVisible = $event;
      }
    }
  }, [_c('div', {
    staticClass: "info-content"
  }, [_c('div', {
    staticClass: "info-section"
  }, [_c('h4', {
    staticClass: "info-title"
  }, [_vm._v("圈子简介")]), _vm._v(" "), _c('p', {
    staticClass: "info-text"
  }, [_vm._v(_vm._s(_vm.circle.description || '暂无圈子简介'))])]), _vm._v(" "), _c('div', {
    staticClass: "info-section"
  }, [_c('h4', {
    staticClass: "info-title"
  }, [_vm._v("圈子规则")]), _vm._v(" "), _c('p', {
    staticClass: "info-text"
  }, [_vm._v(_vm._s(_vm.circle.rules || '暂无圈子规则'))])]), _vm._v(" "), _c('div', {
    staticClass: "info-section"
  }, [_c('h4', {
    staticClass: "info-title"
  }, [_vm._v("圈子公告")]), _vm._v(" "), _c('p', {
    staticClass: "info-text"
  }, [_vm._v(_vm._s(_vm.circle.announcement || '暂无圈子公告'))])]), _vm._v(" "), _c('div', {
    staticClass: "info-section"
  }, [_c('h4', {
    staticClass: "info-title"
  }, [_vm._v("圈主")]), _vm._v(" "), _c('div', {
    staticClass: "member-item",
    on: {
      "click": function ($event) {
        return _vm.navigateToUser(_vm.circle.creator_id);
      }
    }
  }, [_c('img', {
    staticClass: "member-avatar",
    attrs: {
      "src": _vm.circle.creator_avatar || '/default-avatar.jpg',
      "alt": _vm.circle.creator_name
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "member-name"
  }, [_vm._v(_vm._s(_vm.circle.creator_name))])])])])])], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/community/circle/_id.vue?vue&type=template&id=7c37a923&scoped=true

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(108);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/circle/_id.vue?vue&type=script&lang=js

/* harmony default export */ var _idvue_type_script_lang_js = ({
  name: 'CircleDetail',
  data() {
    return {
      circleId: null,
      circle: {},
      isJoined: false,
      userRole: 0,
      // 0-普通成员 1-管理员 2-圈主
      joinLoading: false,
      filters: [{
        name: '全部',
        value: 'all'
      }, {
        name: '最新',
        value: 'new'
      }, {
        name: '热门',
        value: 'hot'
      }],
      currentFilter: 'all',
      posts: [],
      members: [],
      // 圈子成员列表
      page: 1,
      pageSize: 10,
      loadingPosts: false,
      loadingMore: false,
      hasMore: true,
      isLoggedIn: false,
      infoDialogVisible: false
    };
  },
  async asyncData({
    params,
    $api,
    error
  }) {
    try {
      const circleId = params.id;
      if (!circleId) {
        throw new Error('圈子ID不能为空');
      }
      return {
        circleId
      };
    } catch (err) {
      error({
        statusCode: 404,
        message: '圈子不存在'
      });
    }
  },
  async mounted() {
    this.checkLoginStatus();
    await this.loadCircleInfo();
    await this.loadMembers();
    await this.loadPosts();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = token && JSON.parse(token).tk;
    },
    async loadCircleInfo() {
      try {
        const res = await this.$api.community.getCircleDetail({
          circle_id: this.circleId
        });
        if (res) {
          this.circle = res;
          // 如果已登录，检查是否已加入圈子
          if (this.isLoggedIn) {
            await this.checkMemberStatus();
          }
        }
      } catch (error) {
        console.error('加载圈子信息失败', error);
        this.$message.error('加载圈子信息失败');
      }
    },
    async checkMemberStatus() {
      try {
        const circles = await this.$api.community.getMyCircles();
        if (circles && circles.length > 0) {
          const myCircle = circles.find(c => c.circle_id === parseInt(this.circleId));
          this.isJoined = !!myCircle;
          if (myCircle) {
            this.userRole = myCircle.role;
          }
        }
      } catch (error) {
        console.error('检查成员状态失败', error);
      }
    },
    async loadMembers() {
      try {
        const params = {
          pageSize: 10,
          page: 1
        };
        const res = await this.$api.community.getCircleMembers({
          circle_id: this.circleId,
          ...params
        });
        if (res && res.list) {
          this.members = res.list;
        }
      } catch (error) {
        console.error('加载圈子成员失败', error);
      }
    },
    async loadPosts() {
      if (!this.hasMore || this.loadingPosts) return;
      console.log(123);
      this.loadingPosts = true;
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          circle_id: this.circleId
        };

        // 根据筛选条件设置参数
        if (this.currentFilter === 'new') {
          params.sort = 'new';
        } else if (this.currentFilter === 'hot') {
          params.sort = 'hot';
        }
        const res = await this.$api.community.getPostsList(params);
        if (res && res.list) {
          // 处理帖子数据
          const newPosts = res.list.map(post => {
            // 初始化点赞状态
            post.is_liked = false;
            post.is_liked_checked = false;
            return post;
          });
          this.posts = this.page === 1 ? newPosts : [...this.posts, ...newPosts];
          this.page++;
          this.hasMore = this.posts.length < res.total;

          // 获取点赞状态
          if (this.isLoggedIn) {
            setTimeout(() => {
              this.getPostsLikeStatus();
            }, 100);
          }
        }
      } catch (error) {
        console.error('加载帖子失败', error);
        this.$message.error('加载帖子失败');
      } finally {
        this.loadingPosts = false;
      }
    },
    switchFilter(tab) {
      this.currentFilter = tab.name;
      this.page = 1;
      this.posts = [];
      this.hasMore = true;
      this.loadPosts();
      this.$forceUpdate();
    },
    loadMore() {
      if (this.hasMore && !this.loadingMore) {
        this.loadingMore = true;
        this.loadPosts().finally(() => {
          this.loadingMore = false;
        });
      }
    },
    async toggleJoin() {
      if (!this.isLoggedIn) {
        this.$router.push('/users/login');
        return;
      }
      this.joinLoading = true;
      try {
        if (this.isJoined) {
          // 退出圈子
          await this.$api.community.quitCircle({
            circle_id: this.circleId
          });
          this.isJoined = false;
          this.circle.member_count--;
          this.$message.success('已退出圈子');
        } else {
          // 检查圈子是否需要验证
          if (this.circle.need_verification) {
            await this.showJoinVerificationDialog();
          } else {
            // 直接加入圈子
            await this.joinCircle();
          }
        }
      } catch (error) {
        console.error('操作失败', error);
        this.$message.error(error.message || '操作失败，请重试');
      } finally {
        this.joinLoading = false;
      }
    },
    async showJoinVerificationDialog() {
      try {
        const res = await this.$api.community.getVerificationQuestions({
          circle_id: this.circleId
        });
        let verificationPrompt = '请输入验证信息';
        if (res && res.verification_questions) {
          verificationPrompt = res.verification_questions;
        }
        this.$prompt(verificationPrompt, '入圈验证', {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入...'
        }).then(({
          value
        }) => {
          this.joinCircle(value);
        }).catch(() => {
          // 用户取消
        });
      } catch (error) {
        console.error('获取验证问题失败', error);
        this.$prompt('入圈验证', '请输入验证信息', {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入...'
        }).then(({
          value
        }) => {
          this.joinCircle(value);
        }).catch(() => {
          // 用户取消
        });
      }
    },
    async joinCircle(verification_info = null) {
      try {
        const data = {
          circle_id: this.circleId
        };
        if (verification_info) {
          data.verification_info = verification_info;
        }
        await this.$api.community.joinCircle(data);
        if (this.circle.need_verification) {
          this.$message.info('申请已提交，等待审核');
        } else {
          this.isJoined = true;
          this.circle.member_count++;
          this.$message.success('已加入圈子');
        }
      } catch (error) {
        console.error('加入圈子失败', error);
        throw error;
      }
    },
    showCircleInfo() {
      this.infoDialogVisible = true;
    },
    async likePost(post) {
      if (!this.isLoggedIn) {
        this.$router.push('/users/login');
        return;
      }
      try {
        const res = await this.$api.community.likeTarget({
          target_id: post.post_id,
          target_type: 1
        });
        if (res && res.liked !== undefined) {
          post.is_liked = res.liked;
          post.like_count += post.is_liked ? 1 : -1;
        } else {
          post.is_liked = !post.is_liked;
          post.like_count += post.is_liked ? 1 : -1;
        }
      } catch (error) {
        console.error('点赞失败', error);
        this.$message.error('操作失败');
      }
    },
    sharePost(post) {
      this.createShareCode(post);
    },
    async createShareCode(post) {
      try {
        const shareMessage = `来自原木社区「${this.circle.name}」圈子的分享：${post.title}\n${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}\n点击链接查看详情：${window.location.origin}/community/post/${post.post_id}`;
        const res = await this.$api.community.createShareCode({
          post_id: post.post_id,
          share_message: shareMessage,
          expires_hours: 24 * 30
        });
        if (res && res.share_code) {
          this.$message.success('分享口令已生成');
          // 这里可以添加复制到剪贴板的功能
        }
      } catch (error) {
        console.error('创建分享口令失败', error);
        this.$message.error('分享失败');
      }
    },
    async getPostsLikeStatus() {
      try {
        const postIds = this.posts.filter(p => !p.is_liked_checked).map(p => p.post_id);
        if (postIds.length === 0) return;
        const res = await this.$api.community.getLikeStatus({
          target_ids: postIds.join(','),
          target_type: 1
        });
        if (res && Array.isArray(res)) {
          res.forEach(item => {
            const post = this.posts.find(p => p.post_id === item.target_id);
            if (post) {
              post.is_liked = item.is_liked;
              post.is_liked_checked = true;
            }
          });
        }
      } catch (error) {
        console.error('获取点赞状态失败', error);
      }
    },
    formatTime(time) {
      const now = external_moment_default()();
      const postTime = external_moment_default()(time);
      const diff = now.diff(postTime, 'minutes');
      if (diff < 1) return '刚刚';
      if (diff < 60) return `${diff}分钟前`;
      const hourDiff = now.diff(postTime, 'hours');
      if (hourDiff < 24) return `${hourDiff}小时前`;
      const dayDiff = now.diff(postTime, 'days');
      if (dayDiff < 30) return `${dayDiff}天前`;
      return postTime.format('YYYY-MM-DD');
    },
    navigateToPost(postId) {
      this.$router.push(`/community/post/${postId}`);
    },
    navigateToUser(userId) {
      this.$router.push(`/users/${userId}`);
    },
    createPost() {
      this.$router.push({
        path: '/community/post/edit',
        query: {
          circle_id: this.circleId
        }
      });
    },
    previewImage(images, index) {
      // 这里可以实现图片预览功能
      console.log('预览图片', images, index);
    },
    // 打开圈子编辑窗口
    async openEditCircle() {
      try {
        const tokenData = localStorage.getItem('token');
        if (tokenData) {
          let token = (await this.$api.users.generateCrossSiteToken()).crossSiteToken;
          this.$windowManager.createWindow({
            title: '编辑圈子',
            url: `${"https://m.loghome.ink"}/#/pages/users/external_login?token=${token}&redirectTo=${encodeURIComponent(`/pages/community/editCircle?id=${this.circleId}&hideback=true`)}`,
            width: 500,
            height: Math.min(800, window.screen.height - 200)
          });
        } else {
          this.$router.push("/login");
        }
      } catch (error) {
        console.error('打编辑圈子窗口失败', error);
        this.$message.error('打开编辑圈子失败，请稍后重试');
      }
    },
    async openCircleMembers() {
      try {
        const tokenData = localStorage.getItem('token');
        if (tokenData) {
          let token = (await this.$api.users.generateCrossSiteToken()).crossSiteToken;
          this.$windowManager.createWindow({
            title: '圈子成员',
            url: `${"https://m.loghome.ink"}/#/pages/users/external_login?token=${token}&redirectTo=${encodeURIComponent(`/pages/community/circleMembers?id=${this.circleId}&hideback=true`)}`,
            width: 500,
            height: Math.min(800, window.screen.height - 200)
          });
        } else {
          this.$router.push("/login");
        }
      } catch (error) {
        console.error('打开圈子成员失败', error);
        this.$message.error('打开圈子成员失败，请稍后重试');
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/community/circle/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var circle_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/community/circle/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(188)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  circle_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "7c37a923",
  "134b15fa"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map