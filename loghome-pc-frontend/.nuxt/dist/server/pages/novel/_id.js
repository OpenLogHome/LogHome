exports.ids = [15];
exports.modules = {

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(215);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("25973492", content, true, context)
};

/***/ }),

/***/ 144:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(217);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("1b51858f", content, true, context)
};

/***/ }),

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/bg.a726195.png";

/***/ }),

/***/ 214:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NovelFansList_vue_vue_type_style_index_0_id_a9959f8e_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(143);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NovelFansList_vue_vue_type_style_index_0_id_a9959f8e_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NovelFansList_vue_vue_type_style_index_0_id_a9959f8e_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NovelFansList_vue_vue_type_style_index_0_id_a9959f8e_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NovelFansList_vue_vue_type_style_index_0_id_a9959f8e_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "@keyframes spin-a9959f8e{to{transform:rotate(360deg)}}.fans-ranking[data-v-a9959f8e]{width:100%;position:relative;margin-bottom:20px}.fans-ranking .loading-wrapper[data-v-a9959f8e]{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px}.fans-ranking .loading-wrapper .loading-spinner[data-v-a9959f8e]{width:30px;height:30px;border:3px solid rgba(148,115,88,.2);border-top-color:#947358;border-radius:50%;animation:spin-a9959f8e 1s linear infinite;margin-bottom:10px}.fans-ranking .loading-wrapper p[data-v-a9959f8e]{color:#888;font-size:14px}.fans-ranking .fans-list-wrapper[data-v-a9959f8e]{width:100%;position:relative}.fans-ranking .fans-list-wrapper .fans-list[data-v-a9959f8e]{width:100%}.fans-ranking .fans-list-wrapper .fans-list .fan-item[data-v-a9959f8e]{display:flex;align-items:center;padding:15px 10px;border-bottom:1px solid #f5f5f5}.fans-ranking .fans-list-wrapper .fans-list .fan-item[data-v-a9959f8e]:last-child{border-bottom:none}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank[data-v-a9959f8e]{width:40px;display:flex;justify-content:center;align-items:center}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-number[data-v-a9959f8e]{font-size:16px;font-weight:bold;color:#666}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-first[data-v-a9959f8e],.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-second[data-v-a9959f8e],.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-third[data-v-a9959f8e]{width:24px;height:24px;display:flex;justify-content:center;align-items:center;color:#fff;font-weight:bold;font-size:14px;border-radius:50%}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-first[data-v-a9959f8e]{background-color:#ff6b6b}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-second[data-v-a9959f8e]{background-color:#ffb347}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-third[data-v-a9959f8e]{background-color:#59c2a7}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-avatar[data-v-a9959f8e]{margin:0 15px}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-avatar img[data-v-a9959f8e]{width:50px;height:50px;border-radius:50%;object-fit:cover;cursor:pointer;transition:transform .2s}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-avatar img[data-v-a9959f8e]:hover{transform:scale(1.05)}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details[data-v-a9959f8e]{flex:1}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details .fan-info[data-v-a9959f8e]{display:flex;justify-content:space-between;margin-bottom:8px}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details .fan-info .fan-name[data-v-a9959f8e]{font-weight:bold;color:#ea7034;cursor:pointer}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details .fan-info .fan-name[data-v-a9959f8e]:hover{text-decoration:underline}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details .fan-info .fan-value[data-v-a9959f8e]{font-weight:bold;color:#ea7034}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details .fan-message[data-v-a9959f8e]{padding:8px 12px;background-color:rgba(234,112,52,.1);border-radius:8px;font-size:14px;color:#666;position:relative}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details .fan-message[data-v-a9959f8e]:before{content:\"\";position:absolute;top:-8px;left:15px;border-width:0 8px 8px;border-style:solid;border-color:rgba(0,0,0,0) rgba(0,0,0,0) rgba(234,112,52,.1)}.fans-ranking .fans-list-wrapper .my-info-wrapper[data-v-a9959f8e]{position:sticky;bottom:0;left:0;width:100%;z-index:10}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info-rank[data-v-a9959f8e]{background-color:rgba(0,0,0,.8);color:#fff;padding:6px 15px;border-top-right-radius:20px;font-size:14px;display:inline-block}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info[data-v-a9959f8e]{display:flex;align-items:center;background-color:rgba(0,0,0,.8);padding:10px 15px}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info .my-avatar[data-v-a9959f8e]{margin-right:15px}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info .my-avatar img[data-v-a9959f8e]{width:40px;height:40px;border-radius:50%;object-fit:cover}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info .my-details[data-v-a9959f8e]{display:flex;flex:1;justify-content:space-between;align-items:center}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info .my-details .my-name[data-v-a9959f8e]{color:#fff;font-weight:bold}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info .my-details .my-value[data-v-a9959f8e]{color:#ea7034;font-weight:bold}.fans-ranking .view-more-wrapper[data-v-a9959f8e]{text-align:right;margin-top:15px}.fans-ranking .view-more-wrapper .view-more-link[data-v-a9959f8e]{color:#666;text-decoration:none;font-size:14px;padding:5px}.fans-ranking .view-more-wrapper .view-more-link[data-v-a9959f8e]:hover{color:#ea7034}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_3edc4f98_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(144);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_3edc4f98_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_3edc4f98_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_3edc4f98_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_3edc4f98_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 217:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "@keyframes spin{to{transform:rotate(360deg)}}@keyframes niubi{0%{transform:scale(0);opacity:1}50%{transform:scale(1)}90%{transform:scale(1);opacity:1}99%{transform:scale(1);opacity:0}100%{transform:scale(0);opacity:0}}.novel-page{max-width:1000px;margin:0 auto;padding:0 20px}.novel-page .loading-container,.novel-page .error-container{display:flex;align-items:center;justify-content:center;flex-direction:column;padding:50px;text-align:center}.novel-page .back-button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;font-size:14px;background-color:#947358;color:#fff;text-decoration:none;margin-top:20px;border:none}.novel-page .novel-container{background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);padding:20px;position:relative}.novel-page .novel-container .novel-header{display:flex;margin-bottom:30px}@media(max-width: 768px){.novel-page .novel-container .novel-header{flex-direction:column;align-items:center;text-align:center}}.novel-page .novel-container .novel-header .novel-cover{width:200px;height:280px;background-size:cover;background-position:center;border-radius:8px;margin-right:30px;flex-shrink:0;box-shadow:0 4px 8px rgba(0,0,0,.15);position:relative}@media(max-width: 768px){.novel-page .novel-container .novel-header .novel-cover{margin-right:0;margin-bottom:20px}}.novel-page .novel-container .novel-header .book-id-tag{position:absolute;right:0;bottom:0;background-color:rgba(0,0,0,.6);color:#fff;font-size:12px;padding:2px 6px}.novel-page .novel-container .novel-header .novel-info{flex:1}.novel-page .novel-container .novel-header .novel-info .novel-title{font-size:22px;font-weight:bold;color:#333;margin-bottom:12px}.novel-page .novel-container .novel-header .novel-info .novel-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info{display:flex;align-items:center;justify-content:center;cursor:pointer}.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info .author-avatar,.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info .author-avatar-placeholder{width:30px;height:30px;border-radius:50%;margin-right:10px}.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info .author-avatar{object-fit:cover}.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info .author-avatar-placeholder{display:flex;align-items:center;justify-content:center;background-color:#947358;color:#fff;font-weight:bold}.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info .author-name{font-size:16px;color:#666}.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info .author-name:hover{color:#947358}.novel-page .novel-container .novel-header .novel-info .novel-meta .novel-type{font-size:14px;padding:4px 10px;background-color:rgba(148,115,88,.1);color:#947358;border-radius:20px}.novel-page .novel-container .novel-header .novel-info .novel-stats{display:flex;margin-bottom:14px;flex-wrap:wrap}.novel-page .novel-container .novel-header .novel-info .novel-stats .stat-item{display:flex;flex-direction:column;align-items:center;margin-right:30px;margin-bottom:10px}.novel-page .novel-container .novel-header .novel-info .novel-stats .stat-item:last-child{margin-right:0}.novel-page .novel-container .novel-header .novel-info .novel-stats .stat-item .stat-icon{font-size:20px;margin-bottom:4px}.novel-page .novel-container .novel-header .novel-info .novel-stats .stat-item .stat-value{font-size:16px;font-weight:bold;color:#333;margin-bottom:2px}.novel-page .novel-container .novel-header .novel-info .novel-stats .stat-item .stat-label{font-size:12px;color:#666}.novel-page .novel-container .novel-header .novel-info .novel-tags{margin-bottom:16px}.novel-page .novel-container .novel-header .novel-info .novel-tags .tag{display:inline-block;padding:5px 11px;background-color:rgba(148,115,88,.1);color:#947358;border-radius:20px;font-size:14px;margin-right:8px;margin-bottom:8px}.novel-page .novel-container .novel-header .novel-info .novel-tags .tag.activity{color:#ec8600;background-color:#ffcfa5}.novel-page .novel-container .novel-header .novel-info .novel-actions{display:flex;flex-wrap:wrap}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;font-size:14px;margin-right:12px;margin-bottom:10px;min-width:90px}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.primary{background-color:#ea7034;color:#fff;border:none}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.primary:hover{background-color:rgb(231.609375,95.7209821429,28.890625)}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.reading-button{min-width:150px;position:relative;padding:10px 16px}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.reading-button .reading-info{display:flex;flex-direction:column;align-items:center}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.reading-button .reading-info span{font-weight:bold;font-size:16px}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.reading-button .reading-info small{font-size:12px;opacity:.8;margin-top:2px}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.reading-button .progress-indicator{position:absolute;bottom:0;left:0;width:100%;height:4px;background-color:rgba(0,0,0,.1);border-radius:0 0 4px 4px;overflow:hidden}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.reading-button .progress-indicator .progress-bar{height:100%;background-color:hsla(0,0%,100%,.7);transition:width .5s ease}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button:not(.primary){background-color:rgba(0,0,0,0);border:1px solid #947358;color:#947358}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button:not(.primary):hover{background-color:rgba(148,115,88,.05)}.novel-page .novel-container .novel-rank{display:flex;justify-content:space-between;align-items:center;background-color:rgba(0,0,0,.05);border-radius:8px;padding:15px 20px;margin-bottom:20px}.novel-page .novel-container .novel-rank .rank-info{color:#947358;text-decoration:none;font-size:16px}.novel-page .novel-container .novel-rank .rank-info .rank-number{font-size:20px;font-weight:bold;margin:0 5px}.novel-page .novel-container .novel-rank .rank-value{font-size:20px;font-weight:bold;color:#ea7034;text-decoration:none}.novel-page .novel-container .novel-content{margin-top:20px}.novel-page .novel-container .novel-content .content-tabs{display:flex;border-bottom:1px solid #eee;margin-bottom:20px;overflow-x:auto}.novel-page .novel-container .novel-content .content-tabs .tab-button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;font-size:14px;background:none;border:none;border-bottom:2px solid rgba(0,0,0,0);color:#666;padding:10px 20px;margin-right:10px;border-radius:0;white-space:nowrap}.novel-page .novel-container .novel-content .content-tabs .tab-button.active{color:#947358;border-bottom-color:#947358}.novel-page .novel-container .novel-content .tab-content{min-height:200px}.novel-page .novel-container .novel-content .tab-content .empty-content{color:#888;font-style:italic;text-align:center;padding:30px 0}.novel-page .novel-container .novel-content .tab-content .intro-content{line-height:1.8;color:#333;white-space:pre-line}.novel-page .novel-container .novel-content .tab-content .worlds-content{margin:15px 0}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:20px}@media(max-width: 768px){.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid{grid-template-columns:1fr}}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card{background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);transition:transform .2s,box-shadow .2s;position:relative;display:flex;height:140px}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card:hover{transform:translateY(-3px);box-shadow:0 5px 15px rgba(0,0,0,.15)}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-cover{width:100px;height:100%;background-size:cover;background-position:center}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info{flex:1;padding:15px;overflow:hidden}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info .world-title{font-size:16px;font-weight:bold;margin:0 0 10px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info .world-title .world-tag{font-size:12px;background-color:#faad14;color:#fff;padding:2px 6px;border-radius:4px;margin-left:8px;font-weight:normal;vertical-align:middle}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info .world-author{display:flex;align-items:center;margin-bottom:10px}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info .world-author .world-author-avatar{width:20px;height:20px;border-radius:50%;margin-right:6px}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info .world-author .world-author-name{font-size:12px;color:#666}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info .world-description{font-size:12px;color:#888;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;margin:0}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-link{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1}.novel-page .novel-container .novel-content .tab-content .fans-content{margin:15px 0}.novel-page .novel-container .novel-content .tab-content .activities-content{margin:15px 0}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group{background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);transition:transform .2s,box-shadow .2s;padding:15px;margin-bottom:15px}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group:hover{transform:translateY(-3px);box-shadow:0 5px 15px rgba(0,0,0,.15)}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-group-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:10px;border-bottom:1px solid #f5f5f5}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-group-head .activity-group-name{font-size:15px;font-weight:bold;color:#333}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-group-head .activity-group-status{font-size:12px;padding:2px 10px;border-radius:999px}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-group-head .activity-group-status.ongoing{color:#fff;background-color:#ea7034}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-group-head .activity-group-status.ended{color:#666;background-color:#f5f5f5}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-news-item{display:flex;align-items:center;justify-content:space-between;padding:10px 4px;border-bottom:1px solid #f5f5f5;cursor:pointer;transition:background-color .2s}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-news-item:hover{background-color:#f5f5f5}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-news-item .activity-news-item-title{font-size:14px;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-news-item .activity-news-item-arrow{flex-shrink:0;margin-left:12px;color:#888}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity{display:flex;align-items:center;justify-content:space-between;padding-top:12px;margin-top:4px}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity .activity-popularity-info{display:flex;flex-direction:column;min-width:0}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity .activity-popularity-info .activity-popularity-count{font-size:14px;font-weight:bold;color:#ea7034}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity .activity-popularity-info .activity-popularity-reason{margin-top:4px;font-size:12px;color:#666}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity .activity-popularity-btn{flex-shrink:0;padding:6px 20px;border-radius:999px;border:none;font-size:13px;font-weight:bold;color:#fff;background:linear-gradient(135deg, #ff8c42 0%, #ea7034 100%);cursor:pointer;transition:all .2s ease}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity .activity-popularity-btn:hover{opacity:.9}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity .activity-popularity-btn.disabled{color:#666;background:#f5f5f5;cursor:not-allowed}.novel-page .novel-container .novel-content .tab-content .chapters-content .chapter-list{display:flex;flex-direction:column}.novel-page .novel-container .novel-content .tab-content .chapters-content .chapter-list .chapter-item{display:flex;align-items:center;padding:10px 15px;border-bottom:1px solid #f5f5f5;text-decoration:none;color:#333;transition:background-color .2s}.novel-page .novel-container .novel-content .tab-content .chapters-content .chapter-list .chapter-item:hover{background-color:#f5f5f5}.novel-page .novel-container .novel-content .tab-content .chapters-content .chapter-list .chapter-item .chapter-number{flex:0 0 50px;color:#947358;font-weight:bold}.novel-page .novel-container .novel-content .tab-content .chapters-content .chapter-list .chapter-item .chapter-title{flex:1}.novel-page .novel-container .novel-content .tab-content .chapters-content .chapter-list .chapter-item .chapter-date{color:#888;font-size:12px}.novel-page .novel-container .novel-content .tab-content .comments-content .comment-list .comment-item{background-color:rgba(148,115,88,.05);border-radius:8px;padding:15px;margin-bottom:15px}.novel-page .novel-container .novel-content .tab-content .comments-content .comment-list .comment-item .comment-content{font-size:14px;line-height:1.6;margin-bottom:10px}.novel-page .novel-container .novel-content .tab-content .comments-content .comment-list .comment-item .comment-footer{display:flex;justify-content:space-between;font-size:12px;color:#666}.novel-page .novel-container .novel-content .tab-content .comments-content .comment-list .comment-item .comment-footer .comment-likes{display:flex;align-items:center}.novel-page .novel-container .novel-content .tab-content .comments-content .comment-list .comment-item .comment-footer .comment-likes .like-icon{margin-right:5px;color:#ff6b6b}.novel-page .novel-container .novel-content .tab-content .comments-content .view-all-comments{display:block;text-align:center;color:#947358;text-decoration:none;padding:10px;border-top:1px solid #eee;margin-top:20px;cursor:pointer}.novel-page .novel-container .novel-content .tab-content .comments-content .view-all-comments:hover{background-color:rgba(148,115,88,.05)}.novel-page .recommended-novels{margin-top:40px}.novel-page .recommended-novels .section-title{font-size:20px;margin-bottom:20px;color:#704c35}.novel-page .recommended-novels .novels-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(160px, 1fr));gap:20px}@media(max-width: 576px){.novel-page .recommended-novels .novels-grid{grid-template-columns:repeat(2, 1fr);gap:10px}}.novel-page .recommended-novels .novels-grid .mini-novel-card{position:relative;border-radius:6px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.1);transition:transform .2s,box-shadow .2s}.novel-page .recommended-novels .novels-grid .mini-novel-card:hover{transform:translateY(-5px);box-shadow:0 5px 15px rgba(0,0,0,.15)}.novel-page .recommended-novels .novels-grid .mini-novel-card .mini-novel-cover{height:200px;background-size:cover;background-position:center}.novel-page .recommended-novels .novels-grid .mini-novel-card .mini-novel-info{padding:10px}.novel-page .recommended-novels .novels-grid .mini-novel-card .mini-novel-info .mini-novel-title{font-size:14px;font-weight:bold;margin-bottom:5px;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.novel-page .recommended-novels .novels-grid .mini-novel-card .mini-novel-info .mini-novel-author{font-size:12px;color:#666;margin:0}.novel-page .recommended-novels .novels-grid .mini-novel-card .mini-novel-link{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1}.gift-box{width:200px;height:200px;position:fixed;left:calc(50% - 100px);top:110vh;z-index:9999;pointer-events:none}.gift-background{position:absolute;top:0;left:0;width:100%;height:100%}.gift{position:absolute;top:20%;left:20%;width:60%;height:60%}.tipping-popup{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000}.tipping-popup .tipping-content{background-color:#fff;border-radius:8px;width:90%;max-width:520px;max-height:86vh;overflow-y:auto;padding:20px}.tipping-popup .tipping-content h3{font-size:18px;margin:0 0 20px 0;text-align:center;color:#ea7034}.tipping-popup .tipping-content .res-icon{display:inline-block;width:16px;height:16px;border-radius:3px;vertical-align:-3px}.tipping-popup .tipping-content .res-icon.res-log{background:#a1662f}.tipping-popup .tipping-content .res-icon.res-apple{background:#d94a3d;border-radius:50%}.tipping-popup .tipping-content .tipping-balance{display:flex;justify-content:flex-end;gap:16px;margin-bottom:12px;font-size:13px;color:#333}.tipping-popup .tipping-content .tipping-balance .balance-item{display:inline-flex;align-items:center;gap:4px}.tipping-popup .tipping-content .tipping-options{display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-bottom:16px}.tipping-popup .tipping-content .tipping-options .tipping-item{display:flex;flex-direction:column;align-items:center;padding:8px 4px;border:2px solid rgba(200,200,200,.5);border-radius:8px;cursor:pointer;transition:all .2s}.tipping-popup .tipping-content .tipping-options .tipping-item:hover{border-color:rgba(255,112,67,.5)}.tipping-popup .tipping-content .tipping-options .tipping-item.selected{border-color:#ff7043;background-color:#fff8ea}.tipping-popup .tipping-content .tipping-options .tipping-item .item-name{font-size:12px;color:#795548;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.tipping-popup .tipping-content .tipping-options .tipping-item .item-image{width:44px;height:44px;object-fit:contain}.tipping-popup .tipping-content .tipping-options .tipping-item .item-cost{display:inline-flex;align-items:center;gap:3px;margin-top:4px;font-size:12px;font-weight:bold;color:#ea7034}.tipping-popup .tipping-content .tipping-amount{display:flex;align-items:center;gap:8px;margin-bottom:16px}.tipping-popup .tipping-content .tipping-amount .amount-label{font-size:14px;color:#795548}.tipping-popup .tipping-content .tipping-amount .amount-btn{width:28px;height:28px;border:none;border-radius:50%;background-color:rgba(234,112,52,.85);color:#fff;font-size:16px;line-height:1;cursor:pointer}.tipping-popup .tipping-content .tipping-amount .amount-input{width:64px;height:28px;text-align:center;border:1px dashed rgba(200,200,200,.8);border-radius:14px;font-size:14px}.tipping-popup .tipping-content .tipping-amount .amount-quick{margin-left:auto;font-size:12px;color:#947358;cursor:pointer}.tipping-popup .tipping-content .tipping-amount .amount-quick:hover{color:#ea7034}.tipping-popup .tipping-content .tipping-message{position:relative;margin-bottom:16px}.tipping-popup .tipping-content .tipping-message textarea{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid rgba(200,200,200,.6);border-radius:8px;font-size:13px;resize:vertical}.tipping-popup .tipping-content .tipping-message .message-counter{position:absolute;right:8px;bottom:6px;font-size:11px;color:#999}.tipping-popup .tipping-content .tipping-total{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-bottom:16px;font-size:14px;color:#795548}.tipping-popup .tipping-content .tipping-total strong{color:#ea7034;font-size:18px}.tipping-popup .tipping-content .tipping-total .tip-hint{margin-left:auto;font-size:12px;color:#999}.tipping-popup .tipping-content .tipping-buttons{display:flex;justify-content:space-between}.tipping-popup .tipping-content .tipping-buttons button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;font-size:14px;min-width:100px}.tipping-popup .tipping-content .tipping-buttons button:first-child{background-color:#f5f5f5;color:#333}.tipping-popup .tipping-content .tipping-buttons button:last-child{background-color:#ea7034;color:#fff}.tipping-popup .tipping-content .tipping-buttons button:last-child:disabled{opacity:.6;cursor:not-allowed}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/novel/_id.vue?vue&type=template&id=3edc4f98
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "novel-page"
  }, [_vm.error ? _vm._ssrNode("<div class=\"error-container\">", "</div>", [_vm._ssrNode("<p>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> "), _c('nuxt-link', {
    staticClass: "back-button",
    attrs: {
      "to": "/read"
    }
  }, [_vm._v("返回小说列表")])], 2) : _vm._e(), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"novel-container\">", "</div>", [_vm._ssrNode("<div id=\"gift-box\" class=\"gift-box\"><img id=\"gift-background\"" + _vm._ssrAttr("src", __webpack_require__(213)) + " class=\"gift-background\"> <img id=\"gift\"" + _vm._ssrAttr("src", _vm.giftImage) + " class=\"gift\"></div> <div class=\"novel-header\">" + (_vm.novel.picUrl ? "<div class=\"novel-cover\"" + _vm._ssrStyle(null, `background-image: url(${_vm.novel.picUrl})`, null) + "></div>" : "<div class=\"novel-cover\"" + _vm._ssrStyle(null, `background-color: hsl(${_vm.novel.novel_id * 30 % 360}, 70%, 80%)`, null) + "></div>") + " <div class=\"book-id-tag\">" + _vm._ssrEscape("ID " + _vm._s(_vm.novel.novel_id)) + "</div> <div class=\"novel-info\"><h1 class=\"novel-title\">" + _vm._ssrEscape(_vm._s(_vm.novel.name)) + "</h1> <div class=\"novel-meta\"><div class=\"author-info\">" + (_vm.novel.auther_avatar ? "<img" + _vm._ssrAttr("src", _vm.novel.auther_avatar) + " alt=\"作者头像\" class=\"author-avatar\">" : "<div class=\"author-avatar-placeholder\">" + _vm._ssrEscape(_vm._s(_vm.novel.author_name ? _vm.novel.author_name.charAt(0) : '作') + "\n            ") + "</div>") + " <span class=\"author-name\">" + _vm._ssrEscape(_vm._s(_vm.novel.author_name || '佚名')) + "</span></div></div> <div class=\"novel-stats\"><div class=\"stat-item\"><span class=\"stat-icon\">👁️</span> <span class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.formatNumber(_vm.novel.clicks || 0))) + "</span> <span class=\"stat-label\">阅读量</span></div> <div class=\"stat-item\"><span class=\"stat-icon\">❤️</span> <span class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.formatNumber(_vm.nice_amount || 0))) + "</span> <span class=\"stat-label\">喜欢</span></div> <div class=\"stat-item\"><span class=\"stat-icon\">📃</span> <span class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.formatNumber(_vm.novel.text_count || 0))) + "</span> <span class=\"stat-label\">字数</span></div> <div class=\"stat-item\"><span class=\"stat-icon\">📚</span> <span class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.novel.is_complete == 1 ? "已完结" : "连载中")) + "</span> <span class=\"stat-label\">状态</span></div></div> <div class=\"novel-tags\">" + _vm._ssrList(_vm.tags, function (tag) {
    return "<span" + _vm._ssrClass("tag", {
      'activity': tag.is_activity_tag
    }) + ">" + _vm._ssrEscape(_vm._s(tag.tag_name)) + "</span>";
  }) + "</div> <div class=\"novel-actions\">" + (_vm.chapters.length > 0 ? "<button class=\"action-button primary reading-button\"><div class=\"reading-info\"><span>" + _vm._ssrEscape(_vm._s(_vm.historyShown > 1 ? '继续阅读' : '开始阅读')) + "</span> " + (_vm.historyShown > 1 ? "<small>" + _vm._ssrEscape("已读 " + _vm._s(Math.min(_vm.historyShown / _vm.chapters.length * 100, 100).toFixed(0)) + "%") + "</small>" : "<!---->") + "</div> " + (_vm.historyShown > 1 ? "<div class=\"progress-indicator\"><div class=\"progress-bar\"" + _vm._ssrStyle(null, {
    width: `${Math.min(_vm.historyShown / _vm.chapters.length * 100, 100)}%`
  }, null) + "></div></div>" : "<!---->") + "</button>" : "<!---->") + " <button class=\"action-button\">" + (_vm.isInBookcase ? "<span>已收藏</span>" : "<span>收藏</span>") + "</button> <button class=\"action-button\">打赏</button> <button class=\"action-button\">分享</button></div></div></div> "), _vm._ssrNode("<div class=\"novel-rank\"" + _vm._ssrStyle(null, null, {
    display: _vm.novelRank.onRank ? '' : 'none'
  }) + ">", "</div>", [_c('nuxt-link', {
    staticClass: "rank-info",
    attrs: {
      "to": "/read/collections?title=原木力爆棚"
    }
  }, [_vm._v("\n        实时原木力榜第\n        "), _c('span', {
    staticClass: "rank-number"
  }, [_vm._v(_vm._s(_vm.novelRank.rank))]), _vm._v("\n        位\n      ")]), _vm._ssrNode(" "), _c('nuxt-link', {
    staticClass: "rank-value",
    attrs: {
      "to": "/read/collections?title=原木力爆棚"
    }
  }, [_vm._v("\n        " + _vm._s(_vm.novelRank.ranking) + "\n      ")])], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"novel-content\">", "</div>", [_vm._ssrNode("<div class=\"content-tabs\"><button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'intro'
  }) + ">\n          作品简介\n        </button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'chapters'
  }) + ">" + _vm._ssrEscape("\n          章节目录 (" + _vm._s(_vm.chapters.length) + ")\n        ") + "</button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'comments'
  }) + ">" + _vm._ssrEscape("\n          读者评论 (" + _vm._s(_vm.commentAmount) + ")\n        ") + "</button> " + (_vm.worlds.length > 0 ? "<button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'worlds'
  }) + ">" + _vm._ssrEscape("\n          世界设定 (" + _vm._s(_vm.worlds.length) + ")\n        ") + "</button>" : "<!---->") + " " + (_vm.fanInfo.length > 0 ? "<button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'fans'
  }) + ">\n          粉丝榜\n        </button>" : "<!---->") + " " + (_vm.activityNewsList.length > 0 ? "<button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'activities'
  }) + ">" + _vm._ssrEscape("\n          创作活动 (" + _vm._s(_vm.activityNewsList.length) + ")\n        ") + "</button>" : "<!---->") + "</div> "), _vm._ssrNode("<div class=\"tab-content\">", "</div>", [_vm._ssrNode("<div class=\"intro-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.activeTab === 'intro' ? '' : 'none'
  }) + ">" + (_vm.novel.content ? "<p>" + _vm._ssrEscape(_vm._s(_vm.novel.content)) + "</p>" : "<p class=\"empty-content\">暂无简介</p>") + "</div> "), _vm._ssrNode("<div class=\"chapters-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.activeTab === 'chapters' ? '' : 'none'
  }) + ">", "</div>", [_vm.chapters.length === 0 ? _vm._ssrNode("<div class=\"empty-content\">", "</div>", [_vm._ssrNode("\n            暂无章节\n          ")], 2) : _vm._ssrNode("<div class=\"chapter-list\">", "</div>", _vm._l(_vm.chapters, function (chapter) {
    return _c('nuxt-link', {
      key: chapter.article_id,
      staticClass: "chapter-item",
      attrs: {
        "to": `/article/${chapter.article_id}`
      }
    }, [_c('span', {
      staticClass: "chapter-number"
    }, [_vm._v(_vm._s(chapter.article_chapter))]), _vm._v(" "), _c('span', {
      staticClass: "chapter-title"
    }, [_vm._v(_vm._s(chapter.title))]), _vm._v(" "), _c('span', {
      staticClass: "chapter-date"
    }, [_vm._v(_vm._s(_vm.formatDate(chapter.update_time)))])]);
  }), 1)]), _vm._ssrNode(" <div class=\"comments-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.activeTab === 'comments' ? '' : 'none'
  }) + ">" + (_vm.commentInfo.length === 0 ? "<div class=\"empty-content\"><p>这本书还没有评论哦，快去抢沙发</p></div>" : "<div class=\"comment-list\">" + _vm._ssrList(_vm.commentInfo, function (comment) {
    return "<div class=\"comment-item\"><div class=\"comment-content\">" + _vm._ssrEscape(_vm._s(comment.content)) + "</div> <div class=\"comment-footer\"><span class=\"comment-author\">" + _vm._ssrEscape(_vm._s(comment.name)) + "</span> <span class=\"comment-likes\"><span class=\"like-icon\">❤️</span>" + _vm._ssrEscape("\n                  " + _vm._s(comment.likeNum) + "\n                ") + "</span></div></div>";
  }) + "</div>") + " <div class=\"view-all-comments\">" + _vm._ssrEscape("\n            查看全部评论 (" + _vm._s(_vm.commentAmount) + ")\n          ") + "</div></div> "), _vm._ssrNode("<div class=\"worlds-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.activeTab === 'worlds' ? '' : 'none'
  }) + ">", "</div>", [_vm._ssrNode("<div class=\"worlds-grid\">", "</div>", _vm._l(_vm.worlds, function (world) {
    return _vm._ssrNode("<div class=\"world-card\">", "</div>", [_vm._ssrNode((world.picUrl ? "<div class=\"world-cover\"" + _vm._ssrStyle(null, `background-image: url(${world.picUrl})`, null) + "></div>" : "<div class=\"world-cover\"" + _vm._ssrStyle(null, `background-color: hsl(${world.novel_id * 30 % 360}, 70%, 80%)`, null) + "></div>") + " <div class=\"world-info\"><h4 class=\"world-title\">" + _vm._ssrEscape("\n                  " + _vm._s(world.name) + "\n                  ") + (world.novel_type == 'world' ? "<span class=\"world-tag\">世界设定</span>" : "<!---->") + "</h4> <div class=\"world-author\">" + (world.avatar_url ? "<img" + _vm._ssrAttr("src", world.avatar_url) + " alt=\"作者头像\" class=\"world-author-avatar\">" : "<!---->") + " <span class=\"world-author-name\">" + _vm._ssrEscape(_vm._s(world.user_name)) + "</span></div> <p class=\"world-description\">" + _vm._ssrEscape(_vm._s(world.content)) + "</p></div> "), _c('nuxt-link', {
      staticClass: "world-link",
      attrs: {
        "to": `/novel/${world.novel_id}`
      }
    })], 2);
  }), 0)]), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"fans-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.activeTab === 'fans' ? '' : 'none'
  }) + ">", "</div>", [_c('NovelFansList', {
    ref: "fansList",
    attrs: {
      "novelId": _vm.novel.novel_id,
      "limit": 3
    }
  })], 1), _vm._ssrNode(" <div class=\"activities-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.activeTab === 'activities' ? '' : 'none'
  }) + ">" + _vm._ssrList(_vm.activityNewsList, function (activity) {
    return "<div class=\"activity-group\"><div class=\"activity-group-head\"><span class=\"activity-group-name\">" + _vm._ssrEscape(_vm._s(activity.activity_name)) + "</span> <span" + _vm._ssrClass("activity-group-status", activity.is_active == 1 ? 'ongoing' : 'ended') + ">" + _vm._ssrEscape("\n                " + _vm._s(activity.is_active == 1 ? '进行中' : '已结束') + "\n              ") + "</span></div> " + _vm._ssrList(activity.news, function (news, newsIndex) {
      return "<div class=\"activity-news-item\"><span class=\"activity-news-item-title\">" + _vm._ssrEscape(_vm._s(news.title)) + "</span> <span class=\"activity-news-item-arrow\">›</span></div>";
    }) + " " + (activity.popularity && activity.popularity.enabled ? "<div class=\"activity-popularity\"><div class=\"activity-popularity-info\"><span class=\"activity-popularity-count\">" + _vm._ssrEscape("人气票 " + _vm._s(activity.popularity.votes)) + "</span> " + (_vm.popularityHint(activity) ? "<span class=\"activity-popularity-reason\">" + _vm._ssrEscape(_vm._s(_vm.popularityHint(activity))) + "</span>" : "<!---->") + "</div> <button" + _vm._ssrClass("activity-popularity-btn", {
      disabled: _vm.popularityBtnDisabled(activity)
    }) + ">" + _vm._ssrEscape("\n                " + _vm._s(_vm.popularityBtnText(activity)) + "\n              ") + "</button></div>" : "<!---->") + "</div>";
  }) + "</div>")], 2)], 2)], 2), _vm._ssrNode(" "), !_vm.error ? _vm._ssrNode("<div class=\"recommended-novels\">", "</div>", [_vm._ssrNode("<h2 class=\"section-title\">推荐阅读</h2> "), _vm._ssrNode("<div class=\"novels-grid\">", "</div>", _vm._l(_vm.recommendedNovels, function (novel) {
    return _vm._ssrNode("<div class=\"mini-novel-card\">", "</div>", [_vm._ssrNode((novel.picUrl ? "<div class=\"mini-novel-cover\"" + _vm._ssrStyle(null, `background-image: url(${novel.picUrl})`, null) + "></div>" : "<div class=\"mini-novel-cover\"" + _vm._ssrStyle(null, `background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`, null) + "></div>") + " <div class=\"mini-novel-info\"><h3 class=\"mini-novel-title\">" + _vm._ssrEscape(_vm._s(novel.name)) + "</h3> <p class=\"mini-novel-author\">" + _vm._ssrEscape(_vm._s(novel.author_name || '佚名')) + "</p></div> "), _c('nuxt-link', {
      staticClass: "mini-novel-link",
      attrs: {
        "to": `/novel/${novel.novel_id}`
      }
    })], 2);
  }), 0)], 2) : _vm._e(), _vm._ssrNode(" " + (_vm.showTippingPopup ? "<div class=\"tipping-popup\"><div class=\"tipping-content\"><h3>打赏作者</h3> <div class=\"tipping-balance\"><span class=\"balance-item\"><i class=\"res-icon res-log\"></i>" + _vm._ssrEscape("原木 " + _vm._s(_vm.resources.log)) + "</span> <span class=\"balance-item\"><i class=\"res-icon res-apple\"></i>" + _vm._ssrEscape("苹果 " + _vm._s(_vm.resources.apple)) + "</span></div> <div class=\"tipping-options\">" + _vm._ssrList(_vm.tippingList, function (item) {
    return "<div" + _vm._ssrClass("tipping-item", {
      selected: _vm.selectedTippingItem && _vm.selectedTippingItem.item_name === item.item_name
    }) + "><span class=\"item-name\">" + _vm._ssrEscape(_vm._s(item.item_name)) + "</span> <img" + _vm._ssrAttr("src", item.img_url) + _vm._ssrAttr("alt", item.item_name) + " class=\"item-image\"> <span class=\"item-cost\"><i" + _vm._ssrClass("res-icon", item.is_log_free ? 'res-apple' : 'res-log') + "></i>" + _vm._ssrEscape("\n            " + _vm._s(item.item_cost) + "\n          ") + "</span></div>";
  }) + "</div> <div class=\"tipping-amount\"><span class=\"amount-label\">数量</span> <button class=\"amount-btn\">-</button> <input type=\"number\" min=\"1\" max=\"9999\"" + _vm._ssrAttr("value", _vm.tippingAmount) + " class=\"amount-input\"> <button class=\"amount-btn\">+</button> " + _vm._ssrList(_vm.quickAmounts, function (quick) {
    return "<span class=\"amount-quick\">" + _vm._ssrEscape(_vm._s(quick.label)) + "</span>";
  }) + "</div> <div class=\"tipping-message\"><textarea maxlength=\"50\" rows=\"2\" placeholder=\"添加留言...\">" + _vm._ssrEscape(_vm._s(_vm.tippingMessage)) + "</textarea> <span class=\"message-counter\">" + _vm._ssrEscape(_vm._s(_vm.tippingMessage.length) + "/50") + "</span></div> <div class=\"tipping-total\">\n        总计\n        <i" + _vm._ssrClass("res-icon", _vm.isAppleTipping ? 'res-apple' : 'res-log') + "></i> <strong>" + _vm._ssrEscape(_vm._s(_vm.totalTipCost)) + "</strong> " + (_vm.selectedTippingItem && !_vm.isAppleTipping ? "<span class=\"tip-hint\">" + _vm._ssrEscape("作者可得 " + _vm._s(Math.floor(_vm.totalTipCost / 2)) + " 原木收益") + "</span>" : "<!---->") + "</div> <div class=\"tipping-buttons\"><button>取消</button> <button" + _vm._ssrAttr("disabled", _vm.tipping || !_vm.selectedTippingItem) + ">" + _vm._ssrEscape("\n          " + _vm._s(_vm.tipping ? '打赏中...' : '确认打赏') + "\n        ") + "</button></div></div></div>" : "<!---->"))], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/novel/_id.vue?vue&type=template&id=3edc4f98

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/NovelFansList.vue?vue&type=template&id=a9959f8e&scoped=true
var NovelFansListvue_type_template_id_a9959f8e_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "fans-ranking"
  }, [_vm._ssrNode(_vm.loading ? "<div class=\"loading-wrapper\" data-v-a9959f8e><div class=\"loading-spinner\" data-v-a9959f8e></div> <p data-v-a9959f8e>正在加载粉丝榜...</p></div>" : "<div class=\"fans-list-wrapper\" data-v-a9959f8e><div class=\"fans-list\" data-v-a9959f8e>" + _vm._ssrList(_vm.fanInfo, function (fan, index) {
    return "<div class=\"fan-item\" data-v-a9959f8e><div class=\"fan-rank\" data-v-a9959f8e><div" + _vm._ssrClass(null, index <= 2 ? _vm.rankClasses[index] : 'rank-number') + " data-v-a9959f8e>" + _vm._ssrEscape("\n            " + _vm._s(index + 1) + "\n          ") + "</div></div> <div class=\"fan-avatar\" data-v-a9959f8e><img" + _vm._ssrAttr("src", fan.avatar_url) + " alt=\"头像\" data-v-a9959f8e></div> <div class=\"fan-details\" data-v-a9959f8e><div class=\"fan-info\" data-v-a9959f8e><span class=\"fan-name\" data-v-a9959f8e>" + _vm._ssrEscape(_vm._s(fan.user_name)) + "</span> <span class=\"fan-value\" data-v-a9959f8e>" + _vm._ssrEscape(_vm._s(fan.fans_value)) + "</span></div> <div class=\"fan-message\" data-v-a9959f8e>\n            此书只应天上有，当赏当赏！\n          </div></div></div>";
  }) + "</div> " + (_vm.isLogin && _vm.myInfo.name ? "<div class=\"my-info-wrapper\" data-v-a9959f8e><div class=\"my-info-rank\" data-v-a9959f8e>" + _vm._ssrEscape("\n        " + _vm._s(_vm.myInfo.rank) + "\n      ") + "</div> <div class=\"my-info\" data-v-a9959f8e><div class=\"my-avatar\" data-v-a9959f8e><img" + _vm._ssrAttr("src", _vm.myInfo.avatar_url) + " alt=\"我的头像\" data-v-a9959f8e></div> <div class=\"my-details\" data-v-a9959f8e><span class=\"my-name\" data-v-a9959f8e>" + _vm._ssrEscape(_vm._s(_vm.myInfo.name)) + "</span> <span class=\"my-value\" data-v-a9959f8e>" + _vm._ssrEscape(_vm._s(_vm.myInfo.fans_value)) + "</span></div></div></div>" : "<!---->") + "</div>")]);
};
var NovelFansListvue_type_template_id_a9959f8e_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/NovelFansList.vue?vue&type=template&id=a9959f8e&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/NovelFansList.vue?vue&type=script&lang=js
/* harmony default export */ var NovelFansListvue_type_script_lang_js = ({
  props: {
    novelId: {
      type: [Number, String],
      required: true
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      loading: true,
      fanInfo: [],
      myInfo: {
        rank: "未上榜",
        fans_value: 0,
        name: "",
        avatar_url: ""
      },
      rankClasses: ['rank-first', 'rank-second', 'rank-third'],
      isLogin: false,
      userInfo: null
    };
  },
  async mounted() {
    this.checkLoginStatus();
    await this.getFansList();
  },
  methods: {
    async getFansList() {
      this.loading = true;
      try {
        // 获取粉丝列表
        const fans = await this.$api.novels.getNovelFans(this.novelId);
        this.fanInfo = fans || [];

        // 获取用户信息（如果已登录）
        if (localStorage.getItem("token")) {
          await this.getMyInfo();
        }
      } catch (error) {
        console.error('获取粉丝榜失败', error);
      } finally {
        this.loading = false;
      }
    },
    async getMyInfo() {
      try {
        // 获取当前用户信息
        if (!this.userInfo) {
          this.userInfo = await this.$api.users.getUserProfile();
        }
        if (!this.userInfo) return;
        this.myInfo = {
          ...this.myInfo,
          ...this.userInfo,
          avatar_url: this.userInfo.avatar_url,
          name: this.userInfo.name || '用户'
        };

        // 查找用户在粉丝榜中的排名
        for (let i = 0; i < this.fanInfo.length; i++) {
          if (this.fanInfo[i].user_id == this.userInfo.user_id) {
            this.myInfo.rank = `第 ${i + 1} 名`;
            this.myInfo.fans_value = this.fanInfo[i].fans_value;
            break;
          }
        }
      } catch (error) {
        console.error('获取当前用户粉丝信息失败', error);
      }
    },
    gotoUserProfile(userId) {
      this.$router.push(`/users/${userId}`);
    },
    // 检查登录状态
    checkLoginStatus() {
      try {
        const tokenData = localStorage.getItem('token');
        if (tokenData) {
          this.isLogin = true;

          // 尝试从本地缓存获取用户信息
          const cachedUserInfo = localStorage.getItem('LogHomeUserInfo');
          if (cachedUserInfo) {
            this.userInfo = JSON.parse(cachedUserInfo);
          }
        } else {
          this.isLogin = false;
          this.userInfo = null;
        }
      } catch (e) {
        console.error("检查登录状态错误", e);
      }
    }
  }
});
// CONCATENATED MODULE: ./components/NovelFansList.vue?vue&type=script&lang=js
 /* harmony default export */ var components_NovelFansListvue_type_script_lang_js = (NovelFansListvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./components/NovelFansList.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(214)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_NovelFansListvue_type_script_lang_js,
  NovelFansListvue_type_template_id_a9959f8e_scoped_true_render,
  NovelFansListvue_type_template_id_a9959f8e_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "a9959f8e",
  "0a23dedc"
  
)

/* harmony default export */ var NovelFansList = (component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/novel/_id.vue?vue&type=script&lang=js

/* harmony default export */ var _idvue_type_script_lang_js = ({
  components: {
    NovelFansList: NovelFansList
  },
  async asyncData({
    params,
    $api,
    error,
    redirect
  }) {
    try {
      // 获取小说详情 - 用于SEO的服务端渲染
      const novel = await $api.novels.getNovelById(params.id);
      if (!novel || novel.length === 0) {
        return error({
          statusCode: 404,
          message: '找不到该小说'
        });
      }
      const novelData = novel[0];

      // 如果是设定书，则应当跳转到世界设定查看页面
      if (novelData.novel_type === "world") {
        return redirect(`/world/${novelData.novel_id}`);
      }

      // 获取章节列表 - 用于SEO的服务端渲染
      const chapters = await $api.articles.getArticles(novelData.novel_id);

      // 获取小说标签 - 用于SEO的服务端渲染
      const tags = await $api.novels.getNovelTags(novelData.novel_id);

      // 返回服务端渲染所需的数据
      return {
        error: null,
        novel: novelData,
        chapters: chapters || [],
        tags: tags || []
      };
    } catch (err) {
      console.error('服务端获取小说数据失败', err);
      return error({
        statusCode: 500,
        message: '加载小说数据失败，请稍后重试'
      });
    }
  },
  data() {
    return {
      error: null,
      activeTab: 'intro',
      isInBookcase: false,
      recommendedNovels: [],
      history: 1,
      progressArticle: {},
      commentInfo: [],
      commentAmount: 0,
      niceStatus: false,
      nice_amount: 0,
      fanInfo: [],
      novelRank: {
        onRank: false,
        rank: 0,
        ranking: 0
      },
      worlds: [],
      showTippingPopup: false,
      giftImage: "",
      tippingList: [],
      selectedTippingItem: null,
      tippingAmount: 1,
      tippingMessage: "",
      tipping: false,
      resources: {
        log: 0,
        apple: 0
      },
      quickAmounts: [{
        label: '一心一意',
        value: 1
      }, {
        label: '十全十美',
        value: 10
      }, {
        label: '六六大顺',
        value: 66
      }, {
        label: '天长地久',
        value: 99
      }, {
        label: '爱的告白',
        value: 520
      }],
      userInfo: null,
      isLogin: false,
      activityNews: [],
      popularityStatus: {},
      isVotingPopularity: false
    };
  },
  head() {
    var _this$novel, _this$novel2;
    return {
      title: (_this$novel = this.novel) !== null && _this$novel !== void 0 && _this$novel.name ? `${this.novel.name} - 原木社区` : '小说详情 - 原木社区',
      meta: [{
        hid: 'description',
        name: 'description',
        content: (_this$novel2 = this.novel) !== null && _this$novel2 !== void 0 && _this$novel2.content ? this.novel.content.substring(0, 150) : '原木社区小说详情页'
      }, {
        hid: 'keywords',
        name: 'keywords',
        content: this.tags.map(tag => tag.tag_name).join(',') || '小说,原木社区,阅读'
      }]
    };
  },
  computed: {
    articleLength() {
      return this.chapters.length;
    },
    activityNewsList() {
      return this.activityNews.filter(activity => activity.news && activity.news.length > 0 || activity.popularity && activity.popularity.enabled);
    },
    historyShown() {
      let his = 0;
      for (let item of this.chapters) {
        his++;
        if (item.article_chapter == this.history) {
          return his;
        }
      }
      return this.history;
    },
    // is_log_free 的礼物用苹果支付，其余用原木
    isAppleTipping() {
      return !!(this.selectedTippingItem && this.selectedTippingItem.is_log_free);
    },
    safeTipAmount() {
      const amount = Math.floor(Number(this.tippingAmount));
      if (!amount || amount < 1) return 1;
      return Math.min(amount, 9999);
    },
    totalTipCost() {
      if (!this.selectedTippingItem) return 0;
      return this.selectedTippingItem.item_cost * this.safeTipAmount;
    },
    payableBalance() {
      return this.isAppleTipping ? this.resources.apple : this.resources.log;
    }
  },
  async mounted() {
    // 检查登录状态
    this.checkLoginStatus();
    // 如果已登录，获取用户信息
    if (this.isLogin) {
      await this.getUserInfo();
    }
    // 补充其他客户端数据
    await this.fetchClientData();
  },
  methods: {
    async fetchClientData() {
      try {
        // 获取推荐小说
        const allNovels = await this.$api.novels.getAllNovels();
        this.recommendedNovels = allNovels.filter(n => n.novel_id !== this.novel.novel_id).sort(() => 0.5 - Math.random()).slice(0, 6);

        // 获取喜欢数和状态
        this.getNices();

        // 获取评论数量
        this.getCommentNum();

        // 获取评论列表
        this.getNovelComments();

        // 获取粉丝统计
        this.getFansStatistics();

        // 获取关联世界
        this.getWorlds();

        // 检查排行榜
        this.checkNovelRank();

        // 检查收藏状态
        this.checkBookcaseStatus();

        // 获取创作活动新闻与人气票状态
        this.getNovelActivityNews();
        this.getPopularityStatus();

        // 获取阅读进度
        this.getReadingProgress();

        // 添加到阅读历史
        this.addReaderHistory(this.novel);
      } catch (error) {
        console.error('获取客户端数据失败', error);
      } finally {}
    },
    // 获取小说标签
    async getNovelTags() {
      try {
        const tags = await this.$api.novels.getNovelTags(this.novel.novel_id);
        this.tags = tags || [];
      } catch (error) {
        console.error('获取标签失败', error);
      }
    },
    // 获取评论数量
    async getCommentNum() {
      try {
        const res = await this.$api.community.getNovelCommentsAmount(this.novel.novel_id);
        if (res && res.length > 0) {
          this.commentAmount = res[0]['COUNT(*)'];
        }
      } catch (error) {
        console.error('获取评论数量失败', error);
      }
    },
    // 获取评论列表
    async getNovelComments() {
      try {
        const comments = await this.$api.community.getNovelComments(this.novel.novel_id);
        this.commentInfo = comments.slice(0, 3);
      } catch (error) {
        console.error('获取评论失败', error);
      }
    },
    // 获取喜欢数和状态
    async getNices() {
      try {
        // 获取喜欢数
        const nices = await this.$api.novels.getNicesById(this.novel.novel_id);
        if (nices && nices.length > 0) {
          this.nice_amount = nices[0].nices;
        }

        // 获取当前用户喜欢状态
        if (localStorage.getItem("token")) {
          const status = await this.$api.novels.getNiceStatus(this.novel.novel_id);
          if (status && status.length > 0 && status[0].nices === 1) {
            this.niceStatus = true;
          }
        }
      } catch (error) {
        console.error('获取喜欢状态失败', error);
      }
    },
    // 检查小说排行
    async checkNovelRank() {
      try {
        const ranks = await this.$api.novels.checkNovelRank(this.novel.novel_id);
        if (ranks && ranks.length > 0) {
          this.novelRank.onRank = true;
          this.novelRank.rank = ranks[0].rank;
          this.novelRank.ranking = ranks[0].ranking;
        }
      } catch (error) {
        console.error('获取排行信息失败', error);
      }
    },
    // 获取粉丝统计
    async getFansStatistics() {
      try {
        // 只检查是否存在粉丝，详细数据由NovelFansList组件获取
        const fans = await this.$api.novels.getNovelFans(this.novel.novel_id);
        this.fanInfo = fans && fans.length > 0 ? [{}] : []; // 只需要知道是否有数据
      } catch (error) {
        console.error('获取粉丝统计失败', error);
        this.fanInfo = [];
      }
    },
    // 获取关联世界
    async getWorlds() {
      try {
        const worlds = await this.$api.worlds.getAssoWorldByNovelId(this.novel.novel_id);
        this.worlds = worlds || [];
      } catch (error) {
        console.error('获取关联世界失败', error);
      }
    },
    // 获取创作活动新闻
    async getNovelActivityNews() {
      try {
        const list = await this.$api.library.getNovelActivityNews(this.novel.novel_id);
        this.activityNews = Array.isArray(list) ? list : [];
      } catch (error) {
        console.error('获取创作活动新闻失败', error);
        this.activityNews = [];
      }
    },
    // 打开活动新闻链接
    openActivityNews(news) {
      if (news.pc_link && false) {
        window.open(news.pc_link, '_blank');
      }
    },
    // 获取当前用户在各活动中的人气票状态
    async getPopularityStatus() {
      try {
        const list = await this.$api.popularity.getNovelStatus(this.novel.novel_id);
        const map = {};
        (Array.isArray(list) ? list : []).forEach(item => {
          map[item.tag_id] = item;
        });
        this.popularityStatus = map;
      } catch (error) {
        console.error('获取人气票状态失败', error);
        this.popularityStatus = {};
      }
    },
    popularityStatusOf(activity) {
      return this.popularityStatus[activity.tag_id] || null;
    },
    popularityBtnText(activity) {
      const status = this.popularityStatusOf(activity);
      return status && status.voted_this_novel ? '已投' : '投人气票';
    },
    popularityBtnDisabled(activity) {
      const status = this.popularityStatusOf(activity);
      // 未登录时按钮仍可点击（引导登录），登录后由服务端状态决定
      return !!status && !status.can_vote;
    },
    popularityHint(activity) {
      const status = this.popularityStatusOf(activity);
      if (!status) return '';
      if (status.voted_this_novel) return '';
      if (!status.can_vote) return status.reason;
      return `剩余 ${status.remaining} 票`;
    },
    // 投人气票
    async voteActivity(activity) {
      if (!localStorage.getItem('token')) {
        this.$router.push('/login');
        return;
      }
      const status = this.popularityStatusOf(activity);
      if (status && !status.can_vote) {
        this.$message.info(status.reason || '暂时无法投票');
        return;
      }
      if (this.isVotingPopularity) return;
      this.isVotingPopularity = true;
      try {
        await this.$api.popularity.vote(this.novel.novel_id, activity.tag_id);
        this.$message.success('已为本书投出 1 票');
        this.getPopularityStatus();
        this.getNovelActivityNews();
      } catch (error) {
        this.$message.error(error.message || '投票失败，请稍后重试');
        this.getPopularityStatus();
      } finally {
        this.isVotingPopularity = false;
      }
    },
    // 检查收藏状态
    async checkBookcaseStatus() {
      if (!localStorage.getItem("token")) return;
      try {
        const likes = await this.$api.bookcase.getLikesOf();
        if (likes) {
          this.isInBookcase = likes.some(item => item.novel_id === this.novel.novel_id);
        }
      } catch (error) {
        console.error('获取收藏状态失败', error);
      }
    },
    // 获取阅读进度
    getReadingProgress() {
      // 从本地存储获取阅读进度
      const readingHistory = localStorage.getItem(`ReaderHistory_${this.novel.novel_id}`);
      if (readingHistory) {
        this.history = parseInt(readingHistory);
      }

      // 获取当前阅读章节的内容
      if (this.chapters.length > 0) {
        let currentChapter = this.chapters[0];

        // 查找历史阅读章节
        for (const chapter of this.chapters) {
          if (chapter.article_chapter == this.history) {
            currentChapter = chapter;
            break;
          }
        }

        // 获取章节内容
        this.getChapterContent(currentChapter.article_id);
      }
    },
    // 获取章节内容
    async getChapterContent(articleId) {
      try {
        const article = await this.$api.articles.getArticle(articleId);
        if (article && article.length > 0) {
          this.progressArticle = article[0];
        }
      } catch (error) {
        console.error('获取章节内容失败', error);
        this.progressArticle = {
          title: "章节加载失败",
          content: "无法加载章节内容"
        };
      }
    },
    // 添加阅读历史
    addReaderHistory(book) {
      try {
        let readerHistory = JSON.parse(localStorage.getItem("loghomeReaderHistory")) || [];

        // 移除已有的相同书籍记录
        readerHistory = readerHistory.filter(item => item.novel_id !== book.novel_id);

        // 添加到历史记录
        readerHistory.push(book);

        // 只保留最近的10本书
        if (readerHistory.length > 10) {
          readerHistory = readerHistory.slice(-10);
        }
        localStorage.setItem("loghomeReaderHistory", JSON.stringify(readerHistory));
      } catch (error) {
        console.error('保存阅读历史失败', error);
      }
    },
    // 检查登录状态
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLogin = !!token;
      return this.isLogin;
    },
    // 获取用户信息
    async getUserInfo() {
      if (!this.isLogin) return null;
      try {
        if (!this.userInfo) {
          const userInfoResponse = await this.$api.users.getUserProfile();
          if (userInfoResponse) {
            this.userInfo = userInfoResponse;
          }
        }
        return this.userInfo;
      } catch (error) {
        console.error('获取用户信息失败', error);
        return null;
      }
    },
    // 开始阅读
    startReading() {
      if (this.chapters.length === 0) {
        this.$message.info("本书还没有章节");
        return;
      }
      if (this.history === 1) {
        // 从第一章开始
        this.$router.push(`/article/${this.chapters[0].article_id}`);
      } else {
        // 从历史章节继续
        let targetArticleId = this.chapters[0].article_id;
        for (const chapter of this.chapters) {
          if (chapter.article_chapter == this.history) {
            targetArticleId = chapter.article_id;
            break;
          }
        }
        this.$router.push(`/article/${targetArticleId}`);
      }
    },
    // 切换收藏状态
    async toggleLike() {
      if (!localStorage.getItem("token")) {
        this.$router.push('/login');
        return;
      }
      try {
        if (this.isInBookcase) {
          // 取消收藏
          await this.$api.bookcase.removeLikeNovel(this.novel.novel_id);
          this.$message.success("已从书架移除");
        } else {
          // 添加收藏
          await this.$api.bookcase.likeNovel(this.novel.novel_id);
          this.$message.success("成功添加到书架");
        }
        this.isInBookcase = !this.isInBookcase;
      } catch (error) {
        console.error('切换收藏状态失败', error);
        this.$message.error("操作失败，请稍后重试");
      }
    },
    // 点赞小说
    async nice() {
      if (!localStorage.getItem("token")) {
        this.$router.push('/login');
        return;
      }
      try {
        await this.$api.novels.niceNovel(this.novel.novel_id);
        this.getNices();
      } catch (error) {
        console.error('点赞失败', error);
        this.$message.error("操作失败，请稍后重试");
      }
    },
    // 打赏功能
    async tip() {
      if (!localStorage.getItem("token")) {
        this.$router.push('/login');
        return;
      }
      const userInfo = await this.getUserInfo();
      if (!userInfo) {
        this.$router.push('/login');
        return;
      }
      if (Number(userInfo.user_id) === Number(this.novel.auther_id)) {
        this.$message.info("不能给自己的书打赏哦");
        return;
      }
      this.showTippingPopup = true;
      if (this.tippingList.length === 0) {
        this.tippingList = await this.$api.library.getTippingList();
        if (this.tippingList.length === 0) {
          this.$message.error('打赏列表加载失败');
          this.showTippingPopup = false;
          return;
        }
        this.selectedTippingItem = this.tippingList[0];
      }
      this.resources = await this.$api.resources.getResourceBalances();
      if (!this.tippingMessage) {
        this.tippingMessage = await this.$api.library.getFanMessage(this.novel.novel_id);
      }
    },
    closeTipping() {
      this.showTippingPopup = false;
    },
    decreaseTipAmount() {
      if (this.safeTipAmount > 1) this.tippingAmount = this.safeTipAmount - 1;
    },
    increaseTipAmount() {
      if (this.safeTipAmount >= 9999) {
        this.$message.info('数量不能超过9999');
        return;
      }
      this.tippingAmount = this.safeTipAmount + 1;
    },
    // 确认打赏
    async confirmTip() {
      if (this.tipping || !this.selectedTippingItem) return;
      if (this.payableBalance < this.totalTipCost) {
        this.$message.error(`${this.isAppleTipping ? '苹果' : '原木'}余额不足`);
        return;
      }
      this.tipping = true;
      const item = this.selectedTippingItem;
      const message = this.tippingMessage.trim();
      try {
        await this.$api.library.tipNovel({
          from_id: Number(this.userInfo.user_id),
          novel_id: this.novel.novel_id,
          item_name: item.item_name,
          item_amount: this.safeTipAmount,
          item_cost: item.item_cost,
          resource_name: this.isAppleTipping ? 'apple' : 'log'
        });
        this.$message.success(`成功打赏 ${this.safeTipAmount} 个${item.item_name}`);
        this.showTippingPopup = false;
        if (message) {
          this.$api.library.updateFanMessage(this.novel.novel_id, message);
        }
        this.runGiftAnimation(item.img_url);
        this.resources = await this.$api.resources.getResourceBalances();
        this.getFansStatistics();
        if (this.$refs.fansList) {
          this.$refs.fansList.getFansList();
        }
      } catch (error) {
        console.error('打赏失败', error);
        this.$message.error(error.message || '打赏失败，请稍后重试');
      } finally {
        this.tipping = false;
      }
    },
    // 打赏动画
    runGiftAnimation(imgUrl = "/gift.png") {
      this.giftImage = imgUrl;
      setTimeout(() => {
        // 礼物动画
        const giftAnimation = [{
          top: "110vh",
          transform: "scale(0.1, 0.1)"
        }, {
          top: "16vh",
          transform: "scale(0.6, 0.6)",
          offset: 0.16
        }, {
          top: "37vh",
          transform: "scale(0.9, 0.9)",
          offset: 0.28
        }, {
          top: "36vh",
          transform: "scale(0.8, 0.8)",
          offset: 0.32
        }, {
          top: "36vh",
          transform: "scale(0.8, 0.8)",
          offset: 0.48
        }, {
          top: "36vh",
          transform: "scale(1.0, 1.0)",
          offset: 0.72
        }, {
          top: "36vh",
          transform: "scale(1.0, 1.0)"
        }];
        const giftAnimTiming = {
          duration: 4000,
          iteration: 1,
          easing: "ease-out"
        };

        // 背景动画
        const giftBackgroundAnimation = [{
          transform: "scale(0.2, 0.2)"
        }, {
          transform: "scale(0.2, 0.2)",
          filter: "drop-shadow(0px 0px 0px rgba(255, 199, 101, 0.6)) brightness(0.0)",
          offset: 0.56
        }, {
          transform: "scale(1.4, 1.4)",
          filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(1.0)",
          offset: 0.72
        }, {
          transform: "scale(1.2, 1.2) rotate(30deg)",
          filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(0.9)",
          offset: 0.79
        }, {
          transform: "scale(1.4, 1.4) rotate(60deg)",
          filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(0.8)",
          offset: 0.86
        }, {
          transform: "scale(1.2, 1.2) rotate(90deg)",
          filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(0.9)",
          offset: 0.93
        }, {
          transform: "scale(1.4, 1.4) rotate(120deg)",
          filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(1.0)"
        }];
        const giftBgAnimTiming = {
          duration: 4000,
          iteration: 1,
          easing: "ease-out"
        };
        document.getElementById("gift-box").animate(giftAnimation, giftAnimTiming);
        document.getElementById("gift-background").animate(giftBackgroundAnimation, giftBgAnimTiming);
      }, 100);
    },
    // 分享小说
    shareBook() {
      const content = `我正在原木社区读《${this.novel.name}》，你也一起来看看吧！\nhttps://loghome.ink/novel/${this.novel.novel_id}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(content).then(() => this.$message.success("分享链接已复制到剪贴板")).catch(() => this.$message.error("复制失败，请手动复制"));
      } else {
        // 兼容旧浏览器
        const textarea = document.createElement('textarea');
        textarea.value = content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.$message.success("分享链接已复制到剪贴板");
      }
    },
    // 跳转到用户主页
    gotoUserProfile(userId) {
      this.$router.push(`/users/${userId}`);
    },
    // 显示简介
    showDescription(content) {
      this.$modal.show('dialog', {
        title: '作品简介',
        text: content,
        buttons: [{
          title: '关闭',
          handler: () => this.$modal.hide('dialog')
        }]
      });
    },
    // 富文本转纯文本
    richtext2text(richtext) {
      if (!richtext) return '努力加载中';
      try {
        const richArr = JSON.parse(richtext);
        let richStr = "";
        for (const item of richArr) {
          if (item.type === "text") richStr += item.value + "\n";
          if (item.type === "image") richStr += "[图片]\n";
        }
        return richStr;
      } catch (error) {
        console.error('解析富文本失败', error);
        return '无法解析内容';
      }
    },
    // 格式化数字
    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
      }
      return num;
    },
    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    // UTC时间转北京时间
    utc2beijing(utc_datetime) {
      if (!utc_datetime) return '';

      // 转为正常的时间格式 年-月-日 时:分:秒
      const T_pos = utc_datetime.indexOf('T');
      const Z_pos = utc_datetime.indexOf('Z');
      const year_month_day = utc_datetime.substr(0, T_pos);
      const hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
      const new_datetime = year_month_day + " " + hour_minute_second;

      // 处理成为时间戳
      let timestamp = new Date(Date.parse(new_datetime)).getTime() / 1000;

      // 增加8个小时，北京时间比utc时间多八个时区
      timestamp = timestamp + 8 * 60 * 60;

      // 时间戳转为时间
      const date = new Date(timestamp * 1000);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    async showAllComments() {
      if (!localStorage.getItem('token')) {
        this.$router.push("/login");
        return;
      }
      await this.$openMobileWindow(`/pages/readers/bookComment?id=${this.novel.novel_id}`, {
        title: '小说评论',
        width: 500,
        height: 800
      });
    }
  }
});
// CONCATENATED MODULE: ./pages/novel/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var novel_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// CONCATENATED MODULE: ./pages/novel/_id.vue



function _id_injectStyles (context) {
  
  var style0 = __webpack_require__(216)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var _id_component = Object(componentNormalizer["a" /* default */])(
  novel_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  _id_injectStyles,
  null,
  "0eeca558"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (_id_component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map