exports.ids = [2];
exports.modules = {

/***/ 138:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(202);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("5e7008f0", content, true, context)
};

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_385daf24_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(138);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_385daf24_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_385daf24_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_385daf24_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_385daf24_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 202:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "@keyframes spin{to{transform:rotate(360deg)}}@keyframes slideDown{from{transform:translateY(-100%)}to{transform:translateY(0)}}@keyframes slideUp{from{transform:translateY(0)}to{transform:translateY(-100%)}}.article-page{max-width:1200px;margin:0 auto;padding:0;min-height:100vh;background-color:#f8f9fa}.article-page .loading-container,.article-page .error-container{display:flex;align-items:center;justify-content:center;flex-direction:column;min-height:300px;text-align:center;padding:50px}.article-page .loading-spinner{width:50px;height:50px;border:5px solid rgba(148,115,88,.2);border-top-color:#947358;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px}.article-page .back-button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;border:none;font-size:14px;background-color:#947358;color:#fff;padding:10px 20px;margin-top:20px}.article-page .article-container{position:relative}.article-page .article-header{background-color:hsla(0,0%,100%,.98);box-shadow:0 2px 8px rgba(0,0,0,.1);position:sticky;top:0;z-index:100;transition:transform .3s ease}.article-page .article-header.sticky .header-content{padding:10px 20px;display:flex;align-items:center;justify-content:space-between;max-width:1200px;margin:0 auto}.article-page .article-header.hidden{transform:translateY(-100%)}.article-page .novel-info{display:flex;align-items:center;justify-content:space-between;flex:1}.article-page .novel-title{color:#947358;font-size:18px;font-weight:bold;cursor:pointer;margin-right:20px}.article-page .novel-title:hover{text-decoration:underline}.article-page .reading-controls{margin-left:20px;display:flex;gap:20px;align-items:center}.article-page .reading-controls .control-item{display:flex;align-items:center}.article-page .reading-controls .control-item .control-label{color:#666;margin-right:8px;font-size:14px}.article-page .reading-controls .control-item .control-buttons{display:flex}.article-page .reading-controls .control-item .control-buttons button{padding:5px 10px;border:1px solid #ddd;background:none;margin:0 2px;cursor:pointer;border-radius:3px;font-size:14px}.article-page .reading-controls .control-item .control-buttons button.active{background-color:#947358;color:#fff;border-color:#947358}.article-page .theme-controls{display:flex;gap:8px}.article-page .theme-btn{width:24px;height:24px;border-radius:50%;cursor:pointer;border:2px solid rgba(0,0,0,0)}.article-page .theme-btn.active{border-color:#947358}.article-page .theme-btn.light{background-color:#fff;border:1px solid #ddd}.article-page .theme-btn.sepia{background-color:#f8f0e0}.article-page .theme-btn.dark{background-color:#282c35}.article-page .article-content-wrapper{padding:0;background-color:#fff;margin:0 auto}.article-page .article-content-wrapper.light{background-color:#fff;color:#333}.article-page .article-content-wrapper.sepia{background-color:#f8f0e0;color:#5b4636}.article-page .article-content-wrapper.dark{background-color:#282c35;color:#bbb}.article-page .article-title-container{text-align:center;padding:40px 20px 20px}.article-page .article-title-container .article-title{font-size:28px;font-weight:bold;margin-bottom:10px}.article-page .article-title-container .article-meta{font-size:14px}.article-page .article-title-container .article-meta span{margin:0 10px}.article-page .article-content{padding:30px 60px 60px;width:100%;line-height:1.8}.article-page .article-content p{margin-bottom:1.5em}.article-page .article-content .article-image{margin:2em 0;text-align:center}.article-page .article-content .article-image img{max-width:60%;height:auto;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.1)}.article-page .article-content .article-paragraph{transition:background-color .3s;border-radius:4px;padding:5px;position:relative}.article-page .article-content .article-paragraph.selected{background-color:rgba(148,115,88,.1)}.article-page .article-content .article-paragraph:hover{background-color:rgba(148,115,88,.05)}.article-page .article-content .article-paragraph .paragraph-comment-icon{display:inline-flex;align-items:center;justify-content:center;margin-left:8px;padding:3px 6px;border-radius:10px;background-color:rgba(148,115,88,.1);color:#947358;font-size:12px;cursor:pointer;white-space:nowrap;vertical-align:middle;transition:all .2s ease}.article-page .article-content .article-paragraph .paragraph-comment-icon i{margin-right:3px;font-size:14px}.article-page .article-content .article-paragraph .paragraph-comment-icon:hover{background-color:#947358;color:#fff}.article-page .empty-content{color:#888;font-style:italic;text-align:center;padding:60px 0}.article-page .article-footer{padding:20px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #eee;margin-top:50px;background-color:hsla(0,0%,100%,.95)}.article-page .chapter-nav{display:flex;gap:10px}.article-page .chapter-nav button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;border:none;font-size:14px}.article-page .chapter-nav button.nav-btn{background-color:#f5f5f5;color:#333}.article-page .chapter-nav button.nav-btn:hover:not(:disabled){background-color:#e9e9e9}.article-page .chapter-nav button.nav-btn:disabled{opacity:.5;cursor:not-allowed}.article-page .chapter-nav button.chapter-btn{background-color:#947358;color:#fff}.article-page .chapter-nav button.chapter-btn:hover{background-color:hsl(27,25.4237288136%,36.2745098039%)}.article-page .nav-icon{font-size:16px}.article-page .like-btn{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;border:none;font-size:14px;display:flex;align-items:center;gap:8px;background-color:#fff0f0;color:#ff6b6b;border:1px solid #ff6b6b}.article-page .like-btn:hover{background-color:#ffe0e0}.article-page .like-btn.active{background-color:#ff6b6b;color:#fff}.article-page .like-icon{font-size:16px}.article-page .comment-section{margin:0 auto;padding:30px 40px;background-color:#fff;box-shadow:0 2px 12px rgba(0,0,0,.05);margin-top:20px;border-radius:8px}.article-page .comment-section h3{font-size:18px;font-weight:bold;color:#704c35;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid #f5f5f5}.article-page .comment-section h3 span{font-size:14px;color:#888;font-weight:normal}.article-page .comment-input{margin-bottom:30px}.article-page .comment-input .comment-textarea{width:100%;padding:15px;border:1px solid #ddd;border-radius:4px;resize:vertical;margin-bottom:10px;font-size:14px}.article-page .comment-input .comment-textarea:focus{border-color:#947358;outline:none}.article-page .comment-input .submit-comment-btn{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;border:none;font-size:14px;background-color:#947358;color:#fff;float:right}.article-page .comment-input .submit-comment-btn:hover{background-color:hsl(27,25.4237288136%,36.2745098039%)}.article-page .comment-loading{display:flex;align-items:center;justify-content:center;flex-direction:column;padding:40px 0}.article-page .comment-loading .loading-spinner{width:50px;height:50px;border:5px solid rgba(148,115,88,.2);border-top-color:#947358;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;width:30px;height:30px;border-width:3px;margin-bottom:15px}.article-page .comment-loading p{color:#888;font-size:14px}.article-page .comment-empty{text-align:center;color:#888;padding:30px 0;font-style:italic}.article-page .comments-list{clear:both}.article-page .comment-item{display:flex;padding:20px 0;border-bottom:1px solid #f5f5f5}.article-page .comment-item:last-child{border-bottom:none}.article-page .comment-avatar{width:40px;height:40px;border-radius:50%;background-color:#947358;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;margin-right:15px;flex-shrink:0;cursor:pointer;overflow:hidden}.article-page .comment-avatar img{width:100%;height:100%;object-fit:cover}.article-page .comment-avatar span{display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:16px;text-transform:uppercase}.article-page .comment-content{flex-grow:1}.article-page .comment-content .comment-header{margin-bottom:8px}.article-page .comment-content .comment-header .comment-username{font-weight:bold;color:#333;margin-right:10px;cursor:pointer}.article-page .comment-content .comment-header .comment-username:hover{color:#947358}.article-page .comment-content .comment-header .comment-time{font-size:12px;color:#888}.article-page .comment-content .comment-text{line-height:1.6;color:#333;word-break:break-word;margin-bottom:10px}.article-page .comment-actions{display:flex;align-items:center;margin-top:10px}.article-page .comment-actions .action-item{display:flex;align-items:center;margin-right:20px;cursor:pointer;color:#888;font-size:13px}.article-page .comment-actions .action-item i{margin-right:5px;font-size:16px}.article-page .comment-actions .action-item i.active{color:#ea7034}.article-page .comment-actions .action-item:hover{color:#947358}.article-page .replies-list{margin-top:10px;background-color:#f8f8f8;border-radius:4px;padding:10px 15px;margin-bottom:10px}.article-page .replies-list .reply-item{padding:8px 0;border-bottom:1px dashed rgba(0,0,0,.05)}.article-page .replies-list .reply-item:last-child{border-bottom:none}.article-page .replies-list .reply-item .reply-content{font-size:13px;line-height:1.5;margin-bottom:5px}.article-page .replies-list .reply-item .reply-content .reply-username{color:#947358;font-weight:bold;cursor:pointer}.article-page .replies-list .reply-item .reply-content .reply-username:hover{text-decoration:underline}.article-page .replies-list .reply-item .reply-content .reply-target{color:#888}.article-page .replies-list .reply-item .reply-content .reply-target-username{color:#947358;cursor:pointer}.article-page .replies-list .reply-item .reply-content .reply-target-username:hover{text-decoration:underline}.article-page .replies-list .reply-item .reply-content .reply-text{color:#333;word-break:break-word}.article-page .replies-list .reply-item .reply-actions{text-align:right}.article-page .replies-list .reply-item .reply-actions .reply-action{color:#888;font-size:12px;cursor:pointer}.article-page .replies-list .reply-item .reply-actions .reply-action:hover{color:#947358}.article-page .reply-input{margin-top:10px;background-color:#f8f8f8;border-radius:4px;padding:10px}.article-page .reply-input .reply-textarea{width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;resize:vertical;margin-bottom:10px;font-size:13px;background-color:#fff}.article-page .reply-input .reply-textarea:focus{border-color:#947358;outline:none}.article-page .reply-input .reply-buttons{text-align:right}.article-page .reply-input .reply-buttons button{padding:6px 12px;border-radius:4px;font-size:13px;cursor:pointer;border:none;margin-left:10px}.article-page .reply-input .reply-buttons button.cancel-reply-btn{background-color:#f0f0f0;color:#333}.article-page .reply-input .reply-buttons button.cancel-reply-btn:hover{background-color:#e0e0e0}.article-page .reply-input .reply-buttons button.submit-reply-btn{background-color:#947358;color:#fff}.article-page .reply-input .reply-buttons button.submit-reply-btn:hover{background-color:hsl(27,25.4237288136%,36.2745098039%)}.article-page .pagination{margin-top:30px;text-align:center}.article-page .pagination button{display:inline-block;min-width:32px;height:32px;margin:0 5px;padding:0 10px;text-align:center;line-height:32px;background:none;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:14px;color:#333}.article-page .pagination button:hover{border-color:#947358;color:#947358}.article-page .pagination button.active{background-color:#947358;border-color:#947358;color:#fff}.article-page .paragraph-floating-panel{position:fixed;background-color:hsla(0,0%,100%,.95);padding:10px;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.15);z-index:1000;display:flex}.article-page .paragraph-floating-panel .panel-button{display:flex;flex-direction:column;align-items:center;padding:8px 12px;cursor:pointer;margin:0 5px;transition:all .2s}.article-page .paragraph-floating-panel .panel-button i{font-size:20px;margin-bottom:5px;color:#947358}.article-page .paragraph-floating-panel .panel-button span{font-size:12px;color:#333}.article-page .paragraph-floating-panel .panel-button:hover{background-color:rgba(148,115,88,.1);border-radius:5px}.article-page .paragraph-comment-drawer{position:fixed;top:0;right:0;bottom:0;width:100%;max-width:450px;background-color:#fff;box-shadow:-5px 0 15px rgba(0,0,0,.1);z-index:1001;transform:translateX(100%);transition:transform .3s ease;display:flex;flex-direction:column}.article-page .paragraph-comment-drawer.active{transform:translateX(0)}.article-page .paragraph-comment-drawer .drawer-header{padding:15px 20px;background-color:#947358;color:#fff;display:flex;align-items:center;justify-content:space-between}.article-page .paragraph-comment-drawer .drawer-header h3{margin:0;font-size:16px}.article-page .paragraph-comment-drawer .drawer-header .close-btn{background:none;border:none;color:#fff;font-size:24px;cursor:pointer;padding:0;line-height:1}.article-page .paragraph-comment-drawer .drawer-content{padding:20px;flex:1;overflow-y:auto}.article-page .paragraph-comment-drawer .drawer-content .paragraph-text{margin-bottom:20px}.article-page .paragraph-comment-drawer .drawer-content .paragraph-text blockquote{border-left:4px solid #947358;padding:10px 15px;background-color:rgba(148,115,88,.05);margin:0 0 20px 0;font-style:italic;color:#666}.article-page .paragraph-comment-drawer .drawer-content .comment-input{margin-bottom:30px}.article-page .paragraph-comment-drawer .drawer-content .comment-input textarea{width:100%;padding:12px;border:1px solid #ddd;border-radius:4px;resize:vertical;margin-bottom:10px}.article-page .paragraph-comment-drawer .drawer-content .comment-input textarea:focus{border-color:#947358;outline:none}.article-page .paragraph-comment-drawer .drawer-content .comment-input button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;border:none;font-size:14px;background-color:#947358;color:#fff;float:right}.article-page .paragraph-comment-drawer .drawer-content .comment-input button:hover{background-color:hsl(27,25.4237288136%,36.2745098039%)}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list{clear:both}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .empty-comments{padding:30px 0;text-align:center;color:#888;font-style:italic}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item{display:flex;padding:15px 0;border-bottom:1px solid #f5f5f5}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item:last-child{border-bottom:none}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item .comment-avatar{width:36px;height:36px;border-radius:50%;background-color:#947358;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;margin-right:12px;flex-shrink:0}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item .comment-content{flex:1}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item .comment-content .comment-header{margin-bottom:5px}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item .comment-content .comment-header .comment-username{font-weight:bold;margin-right:10px}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item .comment-content .comment-header .comment-time{font-size:12px;color:#888}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item .comment-content .comment-text{line-height:1.5}@media(max-width: 900px){.article-page .article-header .header-content{flex-direction:column;gap:10px}.article-page .novel-info{width:100%}.article-page .reading-controls{width:100%;justify-content:space-between}.article-page .article-content{padding:20px 30px}.article-page .paragraph-comment-drawer{width:100%}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 243:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/_id.vue?vue&type=template&id=385daf24
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "article-page"
  }, [_vm._ssrNode(_vm.loading ? "<div class=\"loading-container\"><div class=\"loading-spinner\"></div> <p>正在加载内容...</p></div>" : _vm.error ? "<div class=\"error-container\"><p>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button class=\"back-button\">返回</button></div>" : "<div class=\"article-container\"><div class=\"article-header sticky\"><div class=\"header-content\"><div class=\"novel-info\"><div class=\"novel-title\">" + _vm._ssrEscape(_vm._s(_vm.novel.name)) + "</div> <div class=\"chapter-nav\"><button" + _vm._ssrAttr("disabled", !_vm.hasPrevious) + " class=\"nav-btn\"><span class=\"nav-icon\">←</span> 上一章\n            </button> <button class=\"chapter-btn\"><span class=\"nav-icon\">≡</span> 目录\n            </button> <button" + _vm._ssrAttr("disabled", !_vm.hasNext) + " class=\"nav-btn\">\n              下一章 <span class=\"nav-icon\">→</span></button></div></div> <div class=\"reading-controls\"><div class=\"control-item\"><span class=\"control-label\">字体：</span> <div class=\"control-buttons\"><button" + _vm._ssrClass(null, {
    active: _vm.fontFamily === 'default'
  }) + ">默认</button> <button" + _vm._ssrClass(null, {
    active: _vm.fontFamily === 'serif'
  }) + ">宋体</button> <button" + _vm._ssrClass(null, {
    active: _vm.fontFamily === 'sans-serif'
  }) + ">黑体</button></div></div> <div class=\"control-item\"><span class=\"control-label\">字号：</span> <div class=\"control-buttons\"><button>A-</button> <button>A</button> <button>A+</button></div></div> <div class=\"control-item\"><span class=\"control-label\">主题：</span> <div class=\"theme-controls\"><button title=\"浅色模式\"" + _vm._ssrClass("theme-btn light", {
    active: _vm.theme === 'light'
  }) + "></button> <button title=\"护眼模式\"" + _vm._ssrClass("theme-btn sepia", {
    active: _vm.theme === 'sepia'
  }) + "></button> <button title=\"暗黑模式\"" + _vm._ssrClass("theme-btn dark", {
    active: _vm.theme === 'dark'
  }) + "></button></div></div></div></div></div> <div" + _vm._ssrClass("article-content-wrapper", _vm.theme) + "><div class=\"article-title-container\"><h1 class=\"article-title\">" + _vm._ssrEscape(_vm._s(_vm.article.title)) + "</h1> <div class=\"article-meta\"><span>" + _vm._ssrEscape("作者: " + _vm._s(_vm.novel.author_name || '佚名')) + "</span> <span>" + _vm._ssrEscape("更新: " + _vm._s(_vm.formatDate(_vm.article.update_time))) + "</span> <span>" + _vm._ssrEscape("字数: " + _vm._s(_vm.formatNumber(_vm.article.text_count || 0))) + "</span></div></div> <div class=\"article-content\"" + _vm._ssrStyle(null, {
    fontSize: _vm.fontSize + 'px',
    fontFamily: _vm.getFontFamily
  }, null) + ">" + (_vm.article.content ? "<div>" + _vm._s(_vm.formattedContent) + "</div>" : "<div class=\"empty-content\">\n          暂无内容\n        </div>") + "</div> <div class=\"article-footer\"><div class=\"like-action\"></div> <div class=\"chapter-nav\"><button" + _vm._ssrAttr("disabled", !_vm.hasPrevious) + " class=\"nav-btn\"><span class=\"nav-icon\">←</span> 上一章\n          </button> <button class=\"chapter-btn\"><span class=\"nav-icon\">≡</span> 目录\n          </button> <button" + _vm._ssrAttr("disabled", !_vm.hasNext) + " class=\"nav-btn\">\n            下一章 <span class=\"nav-icon\">→</span></button></div></div></div> <div class=\"comment-section\"><h3>读者评论 " + (_vm.commentTotal > 0 ? "<span>" + _vm._ssrEscape("(" + _vm._s(_vm.commentTotal) + ")") + "</span>" : "<!---->") + "</h3> <div class=\"comment-input\"><textarea placeholder=\"分享你的想法...\" rows=\"3\" class=\"comment-textarea\">" + _vm._ssrEscape(_vm._s(_vm.commentText)) + "</textarea> <button class=\"submit-comment-btn\">发表评论</button></div> <div class=\"comments-list\">" + (_vm.commentsLoading ? "<div class=\"comment-loading\"><div class=\"loading-spinner\"></div> <p>正在加载评论...</p></div>" : _vm.comments.length === 0 ? "<div class=\"comment-empty\">\n          还没有评论，快来发表第一条评论吧！\n        </div>" : _vm._ssrList(_vm.comments, function (comment, index) {
    return "<div class=\"comment-item\"><div class=\"comment-avatar\">" + (comment.avatar_url ? "<img" + _vm._ssrAttr("src", comment.avatar_url) + _vm._ssrAttr("alt", comment.name) + ">" : "<span>" + _vm._ssrEscape(_vm._s(comment.name ? comment.name.charAt(0) : '读')) + "</span>") + "</div> <div class=\"comment-content\"><div class=\"comment-header\"><span class=\"comment-username\">" + _vm._ssrEscape(_vm._s(comment.name || '匿名读者')) + "</span> <span class=\"comment-time\">" + _vm._ssrEscape(_vm._s(_vm.formatDate(comment.comment_time))) + "</span></div> <div class=\"comment-text\">" + _vm._ssrEscape(_vm._s(comment.content)) + "</div> <div class=\"comment-actions\"><div class=\"action-item\"><i" + _vm._ssrClass("el-icon-thumb", {
      active: comment.isLiked
    }) + "></i> <span>" + _vm._ssrEscape(_vm._s(comment.likeNum || 0)) + "</span></div> <div class=\"action-item\"><i class=\"el-icon-chat-line-round\"></i> <span>回复</span></div> " + (_vm.canDeleteComment(comment) ? "<div class=\"action-item\"><i class=\"el-icon-delete\"></i> <span>删除</span></div>" : "<!---->") + "</div> " + (comment.reviewLess && comment.reviewLess.length > 0 ? "<div class=\"replies-list\">" + _vm._ssrList(comment.reviewLess, function (reply, replyIndex) {
      return "<div class=\"reply-item\"><div class=\"reply-content\"><span class=\"reply-username\">" + _vm._ssrEscape(_vm._s(reply.userName || '匿名读者')) + "</span> " + (reply.targetUserName ? "<span class=\"reply-target\"> 回复 </span>" : "<!---->") + " " + (reply.targetUserName ? "<span class=\"reply-target-username\">" + _vm._ssrEscape(_vm._s(reply.targetUserName)) + "</span>" : "<!---->") + ":\n                  <span class=\"reply-text\">" + _vm._ssrEscape(_vm._s(reply.sendMsg)) + "</span></div> <div class=\"reply-actions\"><span class=\"reply-action\">回复</span></div></div>";
    }) + "</div>" : "<!---->") + " " + (_vm.replyingTo && _vm.replyingTo.comment_id === comment.essay_comment_id ? "<div class=\"reply-input\"><textarea" + _vm._ssrAttr("placeholder", _vm.replyingTo.replyToReply ? `回复 ${_vm.replyingTo.targetName}` : '写下你的回复...') + " rows=\"2\" class=\"reply-textarea\">" + _vm._ssrEscape(_vm._s(_vm.replyText)) + "</textarea> <div class=\"reply-buttons\"><button class=\"cancel-reply-btn\">取消</button> <button class=\"submit-reply-btn\">回复</button></div></div>" : "<!---->") + "</div></div>";
  })) + " " + (_vm.commentTotal > _vm.pageSize ? "<div class=\"pagination\">" + _vm._ssrList(_vm.totalPages, function (pageNum) {
    return "<button" + _vm._ssrClass(null, {
      active: _vm.currentPage === pageNum
    }) + ">" + _vm._ssrEscape("\n            " + _vm._s(pageNum) + "\n          ") + "</button>";
  }) + "</div>" : "<!---->") + "</div></div> <div class=\"paragraph-floating-panel\"" + _vm._ssrStyle(null, {
    left: _vm.panelPosition.x + 'px',
    top: _vm.panelPosition.y + 'px'
  }, {
    display: _vm.selectionMode ? '' : 'none'
  }) + "><div class=\"panel-button\"><i class=\"el-icon-document-copy\"></i> <span>复制</span></div> <div class=\"panel-button\"><i class=\"el-icon-chat-line-round\"></i> <span>评论</span></div></div></div>")]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/article/_id.vue?vue&type=template&id=385daf24

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/_id.vue?vue&type=script&lang=js
/* harmony default export */ var _idvue_type_script_lang_js = ({
  async asyncData({
    params,
    $api,
    error
  }) {
    try {
      // 获取章节内容
      const article = await $api.articles.getArticle(params.id);
      if (!article || article.length === 0) {
        return error({
          statusCode: 404,
          message: '找不到该章节'
        });
      }
      const articleData = article[0];

      // 获取小说信息
      const novel = await $api.novels.getNovelById(articleData.novel_id);
      if (!novel || novel.length === 0) {
        return error({
          statusCode: 404,
          message: '找不到该小说'
        });
      }

      // 获取章节列表
      const chapters = await $api.articles.getArticles(articleData.novel_id);

      // 找到当前章节的索引
      const currentChapterIndex = chapters.findIndex(chapter => chapter.article_id === articleData.article_id);
      return {
        article: articleData,
        novel: novel[0],
        chapters: chapters || [],
        currentChapterIndex,
        loading: false,
        error: null
      };
    } catch (err) {
      console.error('加载章节内容失败', err);
      return {
        loading: false,
        error: '加载章节内容失败，请稍后重试',
        article: {},
        novel: {},
        chapters: [],
        currentChapterIndex: -1
      };
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      isLiked: false,
      theme: 'light',
      fontFamily: 'default',
      fontSize: 18,
      defaultFontSize: 18,
      commentText: '',
      comments: [],
      showHeader: true,
      lastScrollPosition: 0,
      // 段落评论相关
      selectionMode: false,
      selectedParagraph: null,
      panelPosition: {
        x: 0,
        y: 0
      },
      paragraphComments: {},
      showCommentDrawer: false,
      currentParagraphId: null,
      paragraphCommentText: '',
      // 段落评论数量
      paragraphCommentsCount: {},
      // 评论相关
      commentTotal: 0,
      commentsLoading: true,
      pageSize: 10,
      currentPage: 1,
      replyingTo: null,
      replyText: '',
      userInfo: null
    };
  },
  computed: {
    hasPrevious() {
      return this.currentChapterIndex > 0;
    },
    hasNext() {
      return this.currentChapterIndex < this.chapters.length - 1;
    },
    formattedContent() {
      if (!this.article.content) return '';

      // 检查内容是否为JSON格式的混合内容
      try {
        const content = JSON.parse(this.article.content);
        // 如果能成功解析为JSON格式，则处理混合内容
        return content.map(item => {
          if (item.type === 'text') {
            // 处理文本段落，添加id和长按事件
            const id = item.id;
            return `<p class="article-paragraph" id="paragraph-${id}" data-paragraph-id="${id}" data-paragraph-text="${encodeURIComponent(item.value)}">${item.value}</p>`;
          } else if (item.type === 'image' && item.img) {
            // 处理图片
            return `<div class="article-image"><img src="${item.img}" alt="文章插图" /></div>`;
          }
          return '';
        }).join('');
      } catch (e) {
        // 如果不是JSON格式，则按原来的方式处理纯文本内容
        return this.article.content.split('\n').filter(para => para.trim().length > 0).map(para => {
          const id = para.id;
          return `<p class="article-paragraph" id="paragraph-${id}" data-paragraph-id="${id}" data-paragraph-text="${encodeURIComponent(para)}">${para}</p>`;
        }).join('');
      }
    },
    getFontFamily() {
      switch (this.fontFamily) {
        case 'serif':
          return '"Noto Serif SC", "Songti SC", SimSun, serif';
        case 'sans-serif':
          return '"Noto Sans SC", "Heiti SC", "Microsoft YaHei", sans-serif';
        default:
          return '"PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif';
      }
    },
    totalPages() {
      return Math.ceil(this.commentTotal / this.pageSize);
    }
  },
  head() {
    var _this$article, _this$article2;
    return {
      title: (_this$article = this.article) !== null && _this$article !== void 0 && _this$article.title ? `${this.article.title} - ${this.novel.name || '阅读'} - 原木社区` : '阅读章节 - 原木社区',
      meta: [{
        hid: 'description',
        name: 'description',
        content: (_this$article2 = this.article) !== null && _this$article2 !== void 0 && _this$article2.text ? this.article.text.substring(0, 150) + '...' : '原木社区小说阅读'
      }]
    };
  },
  mounted() {
    this.loadPreferences();
    this.recordRead();
    this.fetchComments();
    // 保存阅读历史
    this.saveReaderHistory();

    // 添加段落长按事件监听
    this.setupParagraphInteractions();

    // 添加点击空白区域关闭菜单的监听器
    document.addEventListener('click', this.handleDocumentClick);

    // 添加滚动事件监听
    window.addEventListener('scroll', this.handleScroll);

    // 获取段落评论数量
    this.fetchParagraphCommentsCount();

    // 获取当前用户信息
    this.getUserInfo();
  },
  beforeDestroy() {
    // 移除滚动事件监听
    window.removeEventListener('scroll', this.handleScroll);
    // 移除点击监听
    document.removeEventListener('click', this.handleDocumentClick);
  },
  methods: {
    // 记录阅读行为
    async recordRead() {
      if (this.article.article_id) {
        try {
          await this.$api.statistics.novelClicked(this.article.article_id);
        } catch (error) {
          console.error('记录阅读行为失败', error);
        }
      }
    },
    // 保存阅读历史到本地存储
    saveReaderHistory() {
      if (!this.novel || !this.novel.novel_id) return;
      try {
        let readerHistory = JSON.parse(localStorage.getItem("loghomeReaderHistory")) || [];

        // 移除已有的相同书籍记录
        readerHistory = readerHistory.filter(item => item.novel_id !== this.novel.novel_id);

        // 添加到历史记录
        readerHistory.push(this.novel);

        // 只保留最近的10本书
        if (readerHistory.length > 10) {
          readerHistory = readerHistory.slice(-10);
        }
        localStorage.setItem("loghomeReaderHistory", JSON.stringify(readerHistory));

        // 保存当前章节阅读进度
        if (this.article.article_chapter) {
          localStorage.setItem(`ReaderHistory_${this.novel.novel_id}`, this.article.article_chapter);
        }
      } catch (error) {
        console.error('保存阅读历史失败', error);
      }
    },
    // 滚动事件处理
    handleScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

      // 上滚显示，下滚隐藏
      if (currentScrollPosition < this.lastScrollPosition) {
        this.showHeader = true;
      } else if (currentScrollPosition > 50) {
        this.showHeader = false;
      }
      this.lastScrollPosition = currentScrollPosition;
    },
    // 切换点赞状态
    toggleLike() {
      this.isLiked = !this.isLiked;
      // 这里应该调用API保存点赞状态
    },
    // 加载阅读偏好
    loadPreferences() {
      if (false) {}
    },
    // 保存阅读偏好
    savePreferences() {
      if (false) {}
    },
    // 设置主题
    setTheme(theme) {
      this.theme = theme;
      this.savePreferences();
    },
    // 设置字体
    setFont(fontFamily) {
      this.fontFamily = fontFamily;
      this.savePreferences();
    },
    // 更改字体大小
    changeFontSize(delta) {
      this.fontSize = Math.max(14, Math.min(32, this.fontSize + delta));
      this.savePreferences();
    },
    // 重置字体大小
    resetFontSize() {
      this.fontSize = this.defaultFontSize;
      this.savePreferences();
    },
    // 章节导航
    navigateChapter(direction) {
      if (direction === 'prev' && this.hasPrevious) {
        const prevChapter = this.chapters[this.currentChapterIndex - 1];
        this.$router.push(`/article/${prevChapter.article_id}`);
      } else if (direction === 'next' && this.hasNext) {
        const nextChapter = this.chapters[this.currentChapterIndex + 1];
        this.$router.push(`/article/${nextChapter.article_id}`);
      }
    },
    // 返回小说详情页
    goToNovelDetail() {
      this.$router.push(`/novel/${this.article.novel_id}`);
    },
    // 返回上一页
    goBack() {
      this.$router.back();
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
    // 获取评论
    async fetchComments() {
      try {
        this.commentsLoading = true;

        // 获取评论总数
        const countResponse = await this.$api.community.getNovelCommentsAmount(this.novel.novel_id, this.article.article_id);
        if (countResponse && countResponse.length > 0) {
          this.commentTotal = countResponse[0]['COUNT(*)'];
        }

        // 获取当前页评论列表
        const commentsResponse = await this.$api.community.getArticleComments(this.novel.novel_id, this.article.article_id, this.currentPage, this.pageSize);
        if (commentsResponse && commentsResponse.length > 0) {
          // 处理评论数据
          this.comments = await this.processComments(commentsResponse);
        } else {
          this.comments = [];
        }
      } catch (error) {
        console.error('获取评论失败:', error);
        this.$message.error('获取评论失败，请稍后重试');
        this.comments = [];
      } finally {
        this.commentsLoading = false;
      }
    },
    // 处理评论数据，获取回复和点赞状态
    async processComments(comments) {
      const processedComments = [];
      for (const comment of comments) {
        // 获取评论的回复
        const replies = await this.$api.community.novel_commonts_reply_to(comment.essay_comment_id);

        // 检查当前用户是否已点赞
        let isLiked = false;
        if (localStorage.getItem("token")) {
          const likeStatus = await this.$api.community.getCommentPraiseStatus(comment.essay_comment_id);
          isLiked = likeStatus && likeStatus.length > 0 && likeStatus[0].type === 0;
        }

        // 格式化评论的回复
        const reviewLess = replies ? replies.map(reply => ({
          comment_id: reply.essay_comment_id,
          userName: reply.name,
          userId: reply.user_id,
          targetUserName: this.findTargetUserName(reply.reply_to_id, comments, replies),
          sendMsg: reply.content,
          article_id: reply.article_id
        })) : [];

        // 添加处理后的评论
        processedComments.push({
          ...comment,
          isLiked,
          reviewLess
        });
      }
      return processedComments;
    },
    // 通过回复ID查找目标用户名
    findTargetUserName(replyToId, comments, replies) {
      // 先在主评论中查找
      for (const comment of comments) {
        if (comment.essay_comment_id === replyToId) {
          return comment.name;
        }
      }

      // 再在回复中查找
      for (const reply of replies) {
        if (reply.essay_comment_id === replyToId) {
          return reply.name;
        }
      }
      return null;
    },
    // 获取当前用户信息
    async getUserInfo() {
      if (!localStorage.getItem("token")) return;
      try {
        // 先尝试从本地缓存获取用户信息
        const cachedUserInfo = localStorage.getItem('LogHomeUserInfo');
        if (cachedUserInfo) {
          this.userInfo = JSON.parse(cachedUserInfo);
        } else {
          // 使用API服务获取用户信息
          this.userInfo = await this.$api.users.getUserProfile();
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    // 提交评论
    async submitComment() {
      if (!this.commentText.trim()) {
        this.$message.info('评论内容不能为空');
        return;
      }
      if (!localStorage.getItem("token")) {
        this.$message.info('请先登录后再评论');
        this.$router.push(`/login?redirect=${encodeURIComponent(this.$route.path)}`);
        return;
      }
      try {
        await this.$api.community.commentOnArticle(this.novel.novel_id, this.article.article_id, this.commentText);
        this.commentText = '';
        this.$message.success('评论发表成功');

        // 重新加载评论
        this.currentPage = 1;
        this.fetchComments();
      } catch (error) {
        console.error('提交评论失败:', error);
        this.$message.error('评论发表失败，请稍后重试');
      }
    },
    // 处理评论点赞
    async handleLikeComment(comment) {
      if (!localStorage.getItem("token")) {
        this.$message.info('请先登录后再点赞');
        this.$router.push(`/login?redirect=${encodeURIComponent(this.$route.path)}`);
        return;
      }
      try {
        // 点赞状态切换
        const type = comment.isLiked ? 3 : 0; // 0 点赞，3 取消点赞

        await this.$api.community.praiseComment(comment.essay_comment_id, type);

        // 更新评论的点赞状态和数量
        comment.isLiked = !comment.isLiked;
        comment.likeNum = comment.isLiked ? (comment.likeNum || 0) + 1 : Math.max(0, (comment.likeNum || 0) - 1);
        this.$message.success(comment.isLiked ? '点赞成功' : '已取消点赞');
      } catch (error) {
        console.error('点赞操作失败:', error);
        this.$message.error('操作失败，请稍后重试');
      }
    },
    // 显示回复输入框
    showReplyInput(comment, reply) {
      if (!localStorage.getItem("token")) {
        this.$message.info('请先登录后再回复');
        this.$router.push(`/login?redirect=${encodeURIComponent(this.$route.path)}`);
        return;
      }
      this.replyText = '';
      if (reply) {
        // 回复某个回复
        this.replyingTo = {
          comment_id: comment.essay_comment_id,
          reply_id: reply.comment_id,
          replyToReply: true,
          targetId: reply.userId,
          targetName: reply.userName
        };
      } else {
        // 回复主评论
        this.replyingTo = {
          comment_id: comment.essay_comment_id,
          replyToReply: false,
          targetId: comment.user_id,
          targetName: comment.name
        };
      }
    },
    // 取消回复
    cancelReply() {
      this.replyingTo = null;
      this.replyText = '';
    },
    // 提交回复
    async submitReply(comment) {
      if (!this.replyText.trim()) {
        this.$message.info('回复内容不能为空');
        return;
      }
      if (!localStorage.getItem("token")) {
        this.$message.info('请先登录后再回复');
        this.$router.push(`/login?redirect=${encodeURIComponent(this.$route.path)}`);
        return;
      }
      try {
        const replyToId = this.replyingTo.replyToReply ? this.replyingTo.reply_id : comment.essay_comment_id;
        await this.$api.community.replyToComment(replyToId, this.replyText, comment.essay_comment_id, this.article.article_id);
        this.$message.success('回复发表成功');
        this.replyText = '';
        this.replyingTo = null;

        // 重新加载评论
        this.fetchComments();
      } catch (error) {
        console.error('回复评论失败:', error);
        this.$message.error('回复发表失败，请稍后重试');
      }
    },
    // 删除评论
    async deleteComment(comment) {
      if (!localStorage.getItem("token")) return;
      try {
        if (confirm('确定要删除这条评论吗？')) {
          await this.$api.community.deleteComment(comment.essay_comment_id);
          this.$message.success('评论已删除');

          // 重新加载评论
          this.fetchComments();
        }
      } catch (error) {
        console.error('删除评论失败:', error);
        this.$message.error('删除失败，请稍后重试');
      }
    },
    // 判断是否可以删除评论
    canDeleteComment(comment) {
      if (!localStorage.getItem("token") || !this.userInfo) return false;

      // 判断是否是自己的评论或者是小说作者
      return this.userInfo.user_id === comment.user_id || this.userInfo.user_id === this.novel.author_id;
    },
    // 查找用户ID (简单实现，实际应该调用API)
    findUserIdByName(userName) {
      if (!userName) return null;

      // 遍历评论和回复查找匹配的用户名
      for (const comment of this.comments) {
        if (comment.name === userName) {
          return comment.user_id;
        }
        if (comment.reviewLess) {
          for (const reply of comment.reviewLess) {
            if (reply.userName === userName) {
              return reply.userId;
            }
          }
        }
      }
      return null;
    },
    // 更改页面
    async changePage(pageNum) {
      if (this.currentPage === pageNum) return;
      this.currentPage = pageNum;
      await this.fetchComments();

      // 滚动到评论区顶部
      const commentSection = document.querySelector('.comment-section');
      if (commentSection) {
        commentSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    },
    // 获取段落评论数量
    async fetchParagraphCommentsCount() {
      try {
        if (!this.article || !this.article.content) return;

        // 检查内容是否为JSON格式的混合内容
        let paragraphs = [];
        try {
          const content = JSON.parse(this.article.content);
          // 筛选出文本段落
          paragraphs = content.filter(item => item.type === 'text').map(item => item.id);
        } catch (e) {
          console.log("not JSON format");
        }

        // 为每个段落ID获取评论数量
        for (const paragraphId of paragraphs) {
          const response = await this.$api.community.getNovelCommentsAmount(this.novel.novel_id, this.article.article_id, paragraphId);
          if (response && response.length > 0) {
            const count = response[0]['COUNT(*)'];
            if (count > 0) {
              this.$set(this.paragraphCommentsCount, paragraphId, count);

              // 添加评论图标到段落
              this.$nextTick(() => {
                this.addCommentIconToParagraph(paragraphId, count);
              });
            }
          }
        }
      } catch (error) {
        console.error('获取段落评论数量失败', error);
      }
    },
    // 为段落添加评论图标
    addCommentIconToParagraph(paragraphId, count) {
      const paragraph = document.getElementById(`paragraph-${paragraphId}`);
      if (!paragraph) return;

      // 检查是否已经添加了评论图标
      if (paragraph.querySelector('.paragraph-comment-icon')) return;

      // 创建评论图标容器
      const iconContainer = document.createElement('span');
      iconContainer.className = 'paragraph-comment-icon';
      iconContainer.innerHTML = `<i class="el-icon-chat-line-round"></i> ${count}`;
      iconContainer.title = `${count}条评论`;

      // 添加点击事件
      iconContainer.addEventListener('click', e => {
        e.stopPropagation();
        this.openParagraphCommentWindow(paragraphId);
      });

      // 添加到段落末尾
      paragraph.appendChild(iconContainer);
    },
    // 打开段落评论窗口
    async openParagraphCommentWindow(paragraphId) {
      try {
        const tokenData = localStorage.getItem('token');
        if (tokenData) {
          let token = (await this.$api.users.generateCrossSiteToken()).crossSiteToken;
          this.$windowManager.createWindow({
            title: '段落评论',
            url: `${"https://m.loghome.ink"}/#/pages/users/external_login?token=${token}&redirectTo=${encodeURIComponent(`/pages/readers/bookComment?id=${this.novel.novel_id}&articleId=${this.article.article_id}&paragraphId=${paragraphId}`)}&hideback=true`,
            width: 400,
            height: Math.min(800, window.screen.height - 200)
          });

          // 如果是从选择面板调用的，清除选择状态
          if (this.selectionMode) {
            this.clearSelection();
          }
        } else {
          this.$router.push("/login");
        }
      } catch (error) {
        console.error('打开段落评论窗口失败', error);
        this.$message.error('打开评论窗口失败，请稍后重试');
      }
    },
    // 设置段落交互
    setupParagraphInteractions() {
      setTimeout(() => {
        const paragraphs = document.querySelectorAll('.article-paragraph');
        paragraphs.forEach(paragraph => {
          // 添加右键菜单事件
          paragraph.addEventListener('contextmenu', e => {
            e.preventDefault(); // 阻止默认右键菜单
            this.handleParagraphRightClick(e, paragraph);
          });

          // 触摸设备长按支持
          let pressTimer;
          let touchStarted = false;
          paragraph.addEventListener('touchstart', e => {
            touchStarted = true;
            pressTimer = setTimeout(() => {
              if (touchStarted) {
                this.handleParagraphLongPress(e, paragraph);
              }
            }, 500);
          });
          paragraph.addEventListener('touchend', () => {
            touchStarted = false;
            clearTimeout(pressTimer);
          });
          paragraph.addEventListener('touchcancel', () => {
            touchStarted = false;
            clearTimeout(pressTimer);
          });
          paragraph.addEventListener('touchmove', () => {
            touchStarted = false;
            clearTimeout(pressTimer);
          });

          // 如果段落有评论，添加评论图标
          const paragraphId = paragraph.dataset.paragraphId;
          if (this.paragraphCommentsCount[paragraphId]) {
            this.addCommentIconToParagraph(paragraphId, this.paragraphCommentsCount[paragraphId]);
          }
        });
      }, 500);
    },
    // 处理段落右键点击
    handleParagraphRightClick(event, paragraph) {
      // 清除之前的选择
      this.clearSelection();

      // 设置当前选中段落
      const paragraphId = paragraph.dataset.paragraphId;
      const paragraphText = decodeURIComponent(paragraph.dataset.paragraphText);
      this.selectedParagraph = {
        id: paragraphId,
        text: paragraphText,
        element: paragraph
      };

      // 高亮显示选中段落
      paragraph.classList.add('selected');

      // 计算菜单位置 - 在鼠标右键位置显示
      this.panelPosition = {
        x: Math.max(20, Math.min(event.clientX, window.innerWidth - 300)),
        y: Math.min(event.clientY, window.innerHeight - 100)
      };
      this.selectionMode = true;
    },
    // 处理段落长按 - 保留此方法以便在触摸设备上仍然可以响应长按
    handleParagraphLongPress(event, paragraph) {
      event.preventDefault();

      // 清除之前的选择
      this.clearSelection();

      // 设置当前选中段落
      const paragraphId = paragraph.dataset.paragraphId;
      const paragraphText = decodeURIComponent(paragraph.dataset.paragraphText);
      this.selectedParagraph = {
        id: paragraphId,
        text: paragraphText,
        element: paragraph
      };

      // 高亮显示选中段落
      paragraph.classList.add('selected');

      // 计算面板位置
      const rect = paragraph.getBoundingClientRect();
      const x = (rect.left + rect.right) / 2 - 150; // 面板宽度的一半
      const y = rect.bottom + 10;
      this.panelPosition = {
        x: Math.max(20, Math.min(x, window.innerWidth - 300)),
        y: Math.min(y, window.innerHeight - 100)
      };
      this.selectionMode = true;
    },
    // 清除选择
    clearSelection() {
      if (this.selectedParagraph) {
        this.selectedParagraph.element.classList.remove('selected');
        this.selectedParagraph = null;
      }
      this.selectionMode = false;
    },
    // 复制段落内容
    handleCopy() {
      if (!this.selectedParagraph) return;
      const textToCopy = `${this.selectedParagraph.text}\n\n—— 摘自《${this.novel.name}》`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.$message.success('内容已复制');
        this.clearSelection();
      }).catch(() => {
        this.$message.error('复制失败');
      });
    },
    // 处理文档点击事件，关闭菜单
    handleDocumentClick(event) {
      // 如果点击的不是段落或菜单内部元素，则关闭菜单
      if (this.selectionMode && !event.target.closest('.paragraph-floating-panel') && !event.target.closest('.article-paragraph.selected')) {
        this.clearSelection();
      }
    },
    // 获取用户页面
    goToUserPage(userId) {
      this.$router.push(`/users/${userId}`);
    }
  }
});
// CONCATENATED MODULE: ./pages/article/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var article_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/article/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(201)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  article_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  "0b2a6728"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map