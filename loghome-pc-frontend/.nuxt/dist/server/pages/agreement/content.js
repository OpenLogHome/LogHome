exports.ids = [1];
exports.modules = {

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(172);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("331539a2", content, true, context)
};

/***/ }),

/***/ 171:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_content_vue_vue_type_style_index_0_id_63e4a6ac_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(123);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_content_vue_vue_type_style_index_0_id_63e4a6ac_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_content_vue_vue_type_style_index_0_id_63e4a6ac_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_content_vue_vue_type_style_index_0_id_63e4a6ac_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_content_vue_vue_type_style_index_0_id_63e4a6ac_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 172:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".agreement-page[data-v-63e4a6ac]{width:100%}.agreement-page .page-header[data-v-63e4a6ac]{margin-bottom:30px}.agreement-page .page-title[data-v-63e4a6ac]{font-size:32px;color:#704c35}.agreement-page .agreement-container[data-v-63e4a6ac]{background-color:#fff;border-radius:8px;padding:30px;box-shadow:0 2px 4px rgba(0,0,0,.1)}.agreement-page .agreement-content h2[data-v-63e4a6ac]{font-size:20px;color:#704c35;margin:30px 0 15px}.agreement-page .agreement-content h2[data-v-63e4a6ac]:first-child{margin-top:0}.agreement-page .agreement-content p[data-v-63e4a6ac]{margin:10px 0;line-height:1.6;color:#333}.agreement-page .agreement-content ul[data-v-63e4a6ac]{margin:10px 0;padding-left:20px}.agreement-page .agreement-content ul li[data-v-63e4a6ac]{margin:8px 0;line-height:1.6;color:#333}.agreement-page .agreement-actions[data-v-63e4a6ac]{margin-top:30px;display:flex;justify-content:center}.agreement-page .back-button[data-v-63e4a6ac]{padding:12px 25px;border-radius:4px;font-size:16px;font-weight:600;background-color:#947358;color:#fff;border:none;cursor:pointer;transition:background-color .3s ease}.agreement-page .back-button[data-v-63e4a6ac]:hover{background-color:#704c35}@media(max-width: 768px){.agreement-page .agreement-container[data-v-63e4a6ac]{padding:20px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/agreement/content.vue?vue&type=template&id=63e4a6ac&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "agreement-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-63e4a6ac><h1 class=\"page-title\" data-v-63e4a6ac>原木社区用户内容上传协议</h1></div> <div class=\"agreement-container\" data-v-63e4a6ac><div class=\"agreement-content\" data-v-63e4a6ac><h2 data-v-63e4a6ac>一、总则</h2> <p data-v-63e4a6ac>1.1 本协议是您与原木社区（以下简称&quot;本社区&quot;）之间关于您使用本社区提供的网络服务所订立的协议。</p> <p data-v-63e4a6ac>1.2 您在使用本社区提供的网络服务之前，应当仔细阅读本协议，充分理解各条款内容，特别是免除或限制责任的条款以及开通或使用某项服务的单独协议。</p> <p data-v-63e4a6ac>1.3 您一旦注册、登录、使用或以任何方式使用本协议所涉及的相关服务，即视为您已阅读并同意受本协议约束。</p> <h2 data-v-63e4a6ac>二、内容规范</h2> <p data-v-63e4a6ac>2.1 您在本社区上传、发布的内容应当符合国家法律法规、社会公序良俗和本社区的相关规定。</p> <p data-v-63e4a6ac>2.2 您保证对您所上传、发布的内容拥有合法的知识产权或使用权，不侵犯任何第三方的合法权益。</p> <p data-v-63e4a6ac>2.3 常见侵犯知识产权的情形：</p> <ul data-v-63e4a6ac><li data-v-63e4a6ac>未经授权，将他人作品<strong data-v-63e4a6ac>转载</strong>，发表至原木社区；</li> <li data-v-63e4a6ac>未经授权，<strong data-v-63e4a6ac>改编</strong>他人作品，发表至原木社区；</li> <li data-v-63e4a6ac>未经授权，将他人作品<strong data-v-63e4a6ac>过多引用或重新组织语句</strong>，发表至原木社区；</li> <li data-v-63e4a6ac>未经授权，发表与他人<strong data-v-63e4a6ac>大纲雷同度高</strong>的作品至原木社区；</li> <li data-v-63e4a6ac>未经授权，将电影、电视剧、动漫等<strong data-v-63e4a6ac>视频化内容改编</strong>成文字，发表至原木社区；</li> <li data-v-63e4a6ac>未经授权，将<strong data-v-63e4a6ac>漫画改编</strong>成文字，发表至原木社区；</li> <li data-v-63e4a6ac>未经授权，将戏剧、词曲等<strong data-v-63e4a6ac>艺术作品改编</strong>，发表至原木社区；</li> <li data-v-63e4a6ac>未经授权，将<strong data-v-63e4a6ac>网络图片</strong>发布于作品中；</li> <li data-v-63e4a6ac>其它违法违规行为。</li></ul> <p data-v-63e4a6ac>2.4 常见的违规情形：</p> <ul data-v-63e4a6ac><li data-v-63e4a6ac>利用作品发布<strong data-v-63e4a6ac>虚假欺诈广告</strong>；</li> <li data-v-63e4a6ac>利用作品外站<strong data-v-63e4a6ac>拉人、拉书</strong>；</li> <li data-v-63e4a6ac>利用作品<strong data-v-63e4a6ac>谩骂编辑、平台</strong>，<strong data-v-63e4a6ac>恶意攻击他人或传播谣言</strong>；</li> <li data-v-63e4a6ac>利用作品传播<strong data-v-63e4a6ac>色情文字或图片</strong>；</li> <li data-v-63e4a6ac>利用作品<strong data-v-63e4a6ac>恶意传播宗教、政治倾向、暴力等情形</strong>；</li> <li data-v-63e4a6ac>其它不文明违规行为。</li></ul> <h2 data-v-63e4a6ac>三、权益保护与处罚</h2> <p data-v-63e4a6ac>3.1 如发现<strong data-v-63e4a6ac>站内</strong>有侵犯知识产权或违规情形，请联系社区管理员。若情况属实，根据情节严重将会受到警告、禁言、封号、删除违法违规作品、追究法律责任的处罚；</p> <p data-v-63e4a6ac>3.2 如发现<strong data-v-63e4a6ac>站外</strong>有侵犯本站作品作者知识产权的情形，请准备相关证据资料，联系原木社区，我们会运用<strong data-v-63e4a6ac>法律手段协助作者维护权益</strong>。</p> <h2 data-v-63e4a6ac>四、权利声明</h2> <p data-v-63e4a6ac>4.1 您保留对您上传、发布内容的著作权和其他合法权益。</p> <p data-v-63e4a6ac>4.2 您授予本社区一项全球性、免费、非独家、可转授权的许可，允许本社区在全球范围内、在本协议期限内，为实现本社区的目的而使用、复制、修改、改编、出版、翻译、创建衍生作品、传播、表演和展示您的内容，和/或将前述权利的全部或部分转授权给第三方。</p> <p data-v-63e4a6ac>4.3 本社区有权但无义务对您上传、发布的内容进行审核，有权根据相关法律法规的要求或本社区的判断对您上传、发布的内容进行删除或采取其他处理措施。</p> <h2 data-v-63e4a6ac>五、责任限制</h2> <p data-v-63e4a6ac>5.1 您应对您上传、发布的内容承担全部责任。</p> <p data-v-63e4a6ac>5.2 如因您上传、发布的内容导致本社区或任何第三方遭受损失，您应当承担全部责任并赔偿相关损失。</p> <p data-v-63e4a6ac>5.3 本社区不对您上传、发布的内容的准确性、完整性、适用性等做任何保证。</p> <h2 data-v-63e4a6ac>六、协议修改</h2> <p data-v-63e4a6ac>6.1 本社区有权在必要时修改本协议条款，并在本社区网站公布。</p> <p data-v-63e4a6ac>6.2 如您不同意相关变更，请立即停止使用本社区服务。如您继续使用本社区服务，则视为您已接受修改后的协议。</p> <h2 data-v-63e4a6ac>七、其他</h2> <p data-v-63e4a6ac>7.1 本协议的成立、生效、履行、解释及争议的解决均适用中华人民共和国法律。</p> <p data-v-63e4a6ac>7.2 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。</p> <p data-v-63e4a6ac>7.3 本协议的最终解释权归本社区所有。</p></div> <div class=\"agreement-actions\" data-v-63e4a6ac><button class=\"back-button\" data-v-63e4a6ac>返回</button></div></div>")]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/agreement/content.vue?vue&type=template&id=63e4a6ac&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/agreement/content.vue?vue&type=script&lang=js
/* harmony default export */ var contentvue_type_script_lang_js = ({
  head() {
    return {
      title: '用户内容上传协议 - 原木社区'
    };
  }
});
// CONCATENATED MODULE: ./pages/agreement/content.vue?vue&type=script&lang=js
 /* harmony default export */ var agreement_contentvue_type_script_lang_js = (contentvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/agreement/content.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(171)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  agreement_contentvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "63e4a6ac",
  "f9e6c10a"
  
)

/* harmony default export */ var content = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=content.js.map