exports.ids = [1];
exports.modules = {

/***/ 311:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(411);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("e189af5a", content, true, context)
};

/***/ }),

/***/ 409:
/***/ (function(module) {

module.exports = JSON.parse("{\"header\":{\"back\":\"← 返回原木社区首页\",\"eyebrow\":\"OPENLOGHOME · 社区档案\",\"title\":\"原木社区开源公开信\",\"dateLabel\":\"原始发布日期：2024 年 3 月 1 日\",\"note\":\"以下保留原始公开信内容。运营年限、用户规模与许可证描述均为当时表述；当前项目授权请以代码仓库中的 LICENSE 文件为准。\",\"date\":\"2024-03-01\"},\"intro\":{\"title\":\"原木社区由 OpenLoghome 开源项目驱动\",\"quote\":\"\\\" 将社区的建设权，交还给所有人 \\\"\",\"imageAlt\":\"开源计划\",\"paragraphs\":[[\"亲爱的朋友，\"],[\"原木社区 是一款为 Minecraft 及其衍生文化爱好者打造的综合性文学作品平台，涵盖作品创作与阅读体验。自2021年下半年开始，我们已经持续稳定地运营了两年多时间。\"],[\"而在今天，2024年3月1日，我们将\",\"做一件大胆的事\",\"，这标志着原木社区进入新篇章，我们将一起奔跑、一起努力、一起见证、一起参与这个社区的成长与发展。\"]]},\"background\":{\"paragraphs\":[[\"Minecraft 同人文学作品是一个小众但活跃的社群，我们在热爱Minecraft的同时也热爱文学，拥有独特的品味和风趣。\"],[\"原木社区自启动以来，已经积累了超\",\"200位用户\",\"，周活跃用户数达\",\"81人\",\"，这对于一个小众的群体来说难能可贵。\"],[\"但在社区蓬勃发展同时，我们\",\"一直面临着人力短缺的挑战\",\"。作为一个公益性社区，我们一直以来一直在努力维护开发、维护和运营的平衡。我们不仅投入资金和大量精力来维护服务器的运行，还积极收集用户反馈，并进行详尽的分析和实现。\"],[\"随着需求的增长和系统复杂度的提升，我们很难集中精力为原木社区引入新的大型功能，因此开发工作也逐渐停滞不前。\"],[\"然而，我们幸运地拥有一个活跃的用户社区。\",\"在深思熟虑之后，我们决定将社区建设的权利交给大家，启动《原木社区开源计划》。\"],[\"在该计划下，原木社区现有的\",\"全部技术资产\",\"（包括前端和后端代码，但不包括用户数据）将全部以Mozilla公共许可证\",\"开源至GitHub\",\"，并欢迎社区成员的贡献。每一行代码、每一个提交的问题、每一个报告的bug，甚至每一个提出的问题，都将对原木社区的发展产生重要影响。\"],[\"与此同时，我们将继续\",\"坚持推进原木社区的官方版本的运营工作\",\"。通过广告和原木充值等收入维持服务器的正常运行，保障大家熟悉的社区万古长青。\"]]},\"participation\":{\"imageAlt\":\"团队合作\",\"paragraphs\":[[\"无论是贡献代码、添加 API 文档、整理 bugs 和 issues、review 代码……\"],[\"原木社区 在方方面面都期待你的助力。\"],[\"你可以根据你自身的情况，选择以下的一项或者多项，参与到 原木社区 的开源项目中来：\"],[\"…… 所有你能想到的让 原木社区 变得更好的事情\"]],\"items\":[\"贡献代码\",\"建设 API 文档\",\"Review PR\",\"向有需要的人推荐 原木社区\",\"参与 原木社区 的群讨论\"]},\"github\":{\"imageAlt\":\"GitHub\",\"paragraphs\":[[\"我们的主要开源部分有：\"],[\"loghome\",\"：包含 原木社区 的完整技术代码\"],[\"loghome-testDb\",\"：包含用于社区功能测试的完整数据库\"],[\"你也可以在 \",\"这里\",\" 找到更多的 原木社区 开源项目。\"]]},\"contribution\":{\"codeTitle\":\"代码贡献\",\"apiTitle\":\"API文档贡献\",\"paragraphs\":[[\"对于代码贡献，我们需要你\",\"明确说明修改了哪些功能\",\"，并在贡献前\",\"确保业务功能经过测试\",\"。\"],[\"由于原木社区是一个前后端分离的项目，且还在线上运营，因此请\",\"尽少可能变动数据库的结构\",\"，以保障用户的数据安全。如果你增加了新的表或字段，也一定要\",\"明确说明\",\"。\"],[\"原木社区 的 API 文档使用 ApiDoc 创建。 API 文档直接撰写在后端项目代码行间，统一放在接口声明函数的前面。\"],[\"如果你在贡献中修改了API文档，请\",\"明确说明\",\"。\"]]},\"community\":{\"githubAction\":\"访问 GitHub\",\"qqAction\":\"加入 QQ 群\",\"imageAlt\":\"社区交流\",\"paragraphs\":[[\"欢迎各位参与到原木社区活跃的开发中，在社群中碰撞出思想的火花。\"],[\"QQ群：701928273\"]]},\"seo\":{\"title\":\"原木社区开源公开信（2024） - 原木社区\",\"description\":\"原木社区于 2024 年 3 月 1 日发布的开源公开信，记录 OpenLoghome 开源共建计划的起点。\"}}");

/***/ }),

/***/ 410:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_open_source_vue_vue_type_style_index_0_id_99c29da8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(311);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_open_source_vue_vue_type_style_index_0_id_99c29da8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_open_source_vue_vue_type_style_index_0_id_99c29da8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_open_source_vue_vue_type_style_index_0_id_99c29da8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_open_source_vue_vue_type_style_index_0_id_99c29da8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 411:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.open-letter[data-v-99c29da8] { max-width: 800px; margin: 16px auto 60px; color: #333b2f; font-size: 16px; line-height: 1.95; overflow-wrap: anywhere;\n}\n.open-letter header[data-v-99c29da8] { margin: 32px 0 48px;\n}\n.open-letter h1[data-v-99c29da8] { font-size: clamp(26px, 5vw, 36px); line-height: 1.5;\n}\n.open-letter h2[data-v-99c29da8] { font-size: 24px; margin: 36px 0 20px;\n}\n.open-letter h3[data-v-99c29da8] { font-size: 21px; margin: 30px 0 18px;\n}\n.open-letter h4[data-v-99c29da8] { font-size: 18px; margin: 24px 0 12px;\n}\n.open-letter p[data-v-99c29da8] { margin: 14px 0;\n}\n.open-letter a[data-v-99c29da8] { color: #79573c; text-underline-offset: 4px;\n}\n.open-letter a[data-v-99c29da8]:focus-visible { outline: 2px solid #79573c; outline-offset: 4px;\n}\n.letter-eyebrow[data-v-99c29da8], .open-letter time[data-v-99c29da8] { color: #6d7365; font-size: 13px;\n}\n.archive-note[data-v-99c29da8] { padding: 20px 24px; border-left: 3px solid #947358; background: #f3eee5;\n}\n.open-letter img[data-v-99c29da8] { display: block; max-width: 150px; max-height: 140px; object-fit: contain; margin: 30px auto;\n}\n.open-letter ul[data-v-99c29da8] { padding-left: 24px;\n}\n.join-buttons[data-v-99c29da8] { display: flex; gap: 24px; flex-wrap: wrap;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 576:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/about/open-source.vue?vue&type=template&id=99c29da8&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('article', {
    staticClass: "open-letter"
  }, [_c('nuxt-link', {
    attrs: {
      "to": "/"
    }
  }, [_vm._v(_vm._s(_vm.copy.header.back))]), _vm._ssrNode(" <header data-v-99c29da8><p class=\"letter-eyebrow\" data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.header.eyebrow)) + "</p> <h1 data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.header.title)) + "</h1> <time" + _vm._ssrAttr("datetime", _vm.copy.header.date) + " data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.header.dateLabel)) + "</time> <p class=\"archive-note\" data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.header.note)) + "</p></header> <div class=\"opensource-section\" data-v-99c29da8><h2 class=\"section-title\" data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.intro.title)) + "</h2> <div class=\"opensource-container\" data-v-99c29da8><div class=\"opensource-hero\" data-v-99c29da8><h3 class=\"opensource-title\" data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.intro.quote)) + "</h3> <div class=\"opensource-intro\" data-v-99c29da8><div class=\"intro-image\" data-v-99c29da8><img src=\"/图片1.png\"" + _vm._ssrAttr("alt", _vm.copy.intro.imageAlt) + " class=\"intro-img\" data-v-99c29da8></div> <div class=\"intro-content\" data-v-99c29da8><p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.intro.paragraphs[0][0])) + "</p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.intro.paragraphs[1][0])) + "</p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.intro.paragraphs[2][0])) + "<strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.intro.paragraphs[2][1])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.intro.paragraphs[2][2])) + "</p></div></div></div> <div class=\"opensource-content\" data-v-99c29da8><div class=\"content-block\" data-v-99c29da8><p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[0][0])) + "</p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[1][0])) + "<strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[1][1])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[1][2])) + "<strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[1][3])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[1][4])) + "</p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[2][0])) + "<strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[2][1])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[2][2])) + "</p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[3][0])) + "</p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[4][0])) + "<strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[4][1])) + "</strong></p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[5][0])) + "<strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[5][1])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[5][2])) + "<a href=\"https://github.com/OpenLogHome\" target=\"_blank\" rel=\"noopener noreferrer\" data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[5][3])) + "</a>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[5][4])) + "</p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[6][0])) + "<strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[6][1])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.background.paragraphs[6][2])) + "</p></div> <div class=\"participation-section\" data-v-99c29da8><div class=\"participation-image\" data-v-99c29da8><img src=\"/teamwork.png\"" + _vm._ssrAttr("alt", _vm.copy.participation.imageAlt) + " class=\"teamwork-img\" data-v-99c29da8></div> <div class=\"participation-content\" data-v-99c29da8><p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.participation.paragraphs[0][0])) + "</p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.participation.paragraphs[1][0])) + "</p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.participation.paragraphs[2][0])) + "</p> <ul class=\"participation-list\" data-v-99c29da8><li data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.participation.items[0])) + "</li> <li data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.participation.items[1])) + "</li> <li data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.participation.items[2])) + "</li> <li data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.participation.items[3])) + "</li> <li data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.participation.items[4])) + "</li></ul> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.participation.paragraphs[3][0])) + "</p></div></div> <div class=\"github-section\" data-v-99c29da8><div class=\"github-image\" data-v-99c29da8><img src=\"/github.png\"" + _vm._ssrAttr("alt", _vm.copy.github.imageAlt) + " class=\"github-img\" data-v-99c29da8></div> <div class=\"github-content\" data-v-99c29da8><p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.github.paragraphs[0][0])) + "</p> <p data-v-99c29da8><strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.github.paragraphs[1][0])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.github.paragraphs[1][1])) + "</p> <p data-v-99c29da8><strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.github.paragraphs[2][0])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.github.paragraphs[2][1])) + "</p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.github.paragraphs[3][0])) + "<a href=\"https://github.com/OpenLogHome\" target=\"_blank\" rel=\"noopener noreferrer\" data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.github.paragraphs[3][1])) + "</a>" + _vm._ssrEscape(_vm._s(_vm.copy.github.paragraphs[3][2])) + "</p> <div class=\"contribution-guide\" data-v-99c29da8><h4 data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.codeTitle)) + "</h4> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[0][0])) + "<strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[0][1])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[0][2])) + "<strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[0][3])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[0][4])) + "</p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[1][0])) + "<strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[1][1])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[1][2])) + "<strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[1][3])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[1][4])) + "</p> <h4 data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.apiTitle)) + "</h4> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[2][0])) + "</p> <p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[3][0])) + "<strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[3][1])) + "</strong>" + _vm._ssrEscape(_vm._s(_vm.copy.contribution.paragraphs[3][2])) + "</p></div></div></div> <div class=\"community-section\" data-v-99c29da8><div class=\"community-image\" data-v-99c29da8><img src=\"/message.png\"" + _vm._ssrAttr("alt", _vm.copy.community.imageAlt) + " class=\"message-img\" data-v-99c29da8></div> <div class=\"community-content\" data-v-99c29da8><p data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.community.paragraphs[0][0])) + "</p> <p data-v-99c29da8><strong data-v-99c29da8>" + _vm._ssrEscape(_vm._s(_vm.copy.community.paragraphs[1][0])) + "</strong></p> <div class=\"join-buttons\" data-v-99c29da8><a href=\"https://github.com/OpenLogHome\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"join-btn github-btn\" data-v-99c29da8>" + _vm._ssrEscape("\n                " + _vm._s(_vm.copy.community.githubAction) + "\n              ") + "</a> <a href=\"tencent://groupwpa/?subcmd=all&param=7B2267726F757055696E223A3730313932383237332C2274696D655374616D70223A313733353030303030307D0A\" class=\"join-btn qq-btn\" data-v-99c29da8>" + _vm._ssrEscape("\n                " + _vm._s(_vm.copy.community.qqAction) + "\n              ") + "</a></div></div></div></div></div></div>")], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/about/open-source.vue?vue&type=template&id=99c29da8&scoped=true

// EXTERNAL MODULE: ./config/open-source-copy.json
var open_source_copy = __webpack_require__(409);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/about/open-source.vue?vue&type=script&lang=js

/* harmony default export */ var open_sourcevue_type_script_lang_js = ({
  data() {
    return {
      copy: open_source_copy
    };
  },
  head() {
    return {
      title: this.copy.seo.title,
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.copy.seo.description
      }]
    };
  }
});
// CONCATENATED MODULE: ./pages/about/open-source.vue?vue&type=script&lang=js
 /* harmony default export */ var about_open_sourcevue_type_script_lang_js = (open_sourcevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/about/open-source.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(410)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  about_open_sourcevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "99c29da8",
  "5336702e"
  
)

/* harmony default export */ var open_source = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=open-source.js.map