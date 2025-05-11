exports.ids = [7];
exports.modules = {

/***/ 109:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(138);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("295baf2c", content, true, context)
};

/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_fans_vue_vue_type_style_index_0_id_7a16d500_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(109);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_fans_vue_vue_type_style_index_0_id_7a16d500_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_fans_vue_vue_type_style_index_0_id_7a16d500_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_fans_vue_vue_type_style_index_0_id_7a16d500_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_fans_vue_vue_type_style_index_0_id_7a16d500_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 138:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "@keyframes spin-7a16d500{to{transform:rotate(360deg)}}.fans-page[data-v-7a16d500]{max-width:1000px;margin:0 auto;padding:0 20px}.fans-page .page-header[data-v-7a16d500]{display:flex;align-items:center;margin:20px 0}.fans-page .page-header .back-link[data-v-7a16d500]{color:#666;text-decoration:none;margin-right:15px}.fans-page .page-header .back-link[data-v-7a16d500]:hover{color:#ea7034}.fans-page .page-header .back-link .back-icon[data-v-7a16d500]{font-size:20px;margin-right:5px}.fans-page .page-header .page-title[data-v-7a16d500]{margin:0;font-size:24px;color:#333}.fans-page .loading-container[data-v-7a16d500],.fans-page .error-container[data-v-7a16d500]{display:flex;align-items:center;justify-content:center;flex-direction:column;padding:50px;text-align:center}.fans-page .loading-spinner[data-v-7a16d500]{width:50px;height:50px;border:5px solid rgba(148,115,88,.2);border-top-color:#947358;border-radius:50%;animation:spin-7a16d500 1s linear infinite;margin-bottom:20px}.fans-page .back-button[data-v-7a16d500]{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;font-size:14px;background-color:#947358;color:#fff;text-decoration:none;margin-top:20px;border:none}.fans-page .fans-container[data-v-7a16d500]{background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);padding:20px;margin-bottom:40px}.fans-page .fans-container .novel-info[data-v-7a16d500]{display:flex;margin-bottom:30px}.fans-page .fans-container .novel-info .novel-cover[data-v-7a16d500]{width:120px;height:160px;background-size:cover;background-position:center;border-radius:8px;margin-right:20px;flex-shrink:0;box-shadow:0 4px 8px rgba(0,0,0,.15)}.fans-page .fans-container .novel-info .novel-details[data-v-7a16d500]{flex:1}.fans-page .fans-container .novel-info .novel-details .novel-title[data-v-7a16d500]{font-size:20px;font-weight:bold;margin:0 0 15px 0;color:#333}.fans-page .fans-container .novel-info .novel-details .novel-author[data-v-7a16d500]{display:flex;align-items:center;cursor:pointer}.fans-page .fans-container .novel-info .novel-details .novel-author .author-avatar[data-v-7a16d500],.fans-page .fans-container .novel-info .novel-details .novel-author .author-avatar-placeholder[data-v-7a16d500]{width:30px;height:30px;border-radius:50%;margin-right:10px}.fans-page .fans-container .novel-info .novel-details .novel-author .author-avatar[data-v-7a16d500]{object-fit:cover}.fans-page .fans-container .novel-info .novel-details .novel-author .author-avatar-placeholder[data-v-7a16d500]{display:flex;align-items:center;justify-content:center;background-color:#947358;color:#fff;font-weight:bold}.fans-page .fans-container .novel-info .novel-details .novel-author .author-name[data-v-7a16d500]{font-size:16px;color:#666}.fans-page .fans-container .novel-info .novel-details .novel-author .author-name[data-v-7a16d500]:hover{color:#947358}.fans-page .fans-container .fans-list-container[data-v-7a16d500]{margin-bottom:60px}.fans-page .fans-container .fans-list-container .section-title[data-v-7a16d500]{font-size:18px;color:#704c35;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid #eee}.fans-page .fans-container .fans-list-container .fans-list .fan-item[data-v-7a16d500]{display:flex;align-items:center;padding:15px 10px;border-bottom:1px solid #f5f5f5}.fans-page .fans-container .fans-list-container .fans-list .fan-item[data-v-7a16d500]:last-child{border-bottom:none}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-rank[data-v-7a16d500]{width:40px;display:flex;justify-content:center;align-items:center}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-rank .rank-number[data-v-7a16d500]{font-size:16px;font-weight:bold;color:#666}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-rank .rank-first[data-v-7a16d500],.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-rank .rank-second[data-v-7a16d500],.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-rank .rank-third[data-v-7a16d500]{width:24px;height:24px;display:flex;justify-content:center;align-items:center;color:#fff;font-weight:bold;font-size:14px;border-radius:50%}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-rank .rank-first[data-v-7a16d500]{background-color:#ff6b6b}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-rank .rank-second[data-v-7a16d500]{background-color:#ffb347}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-rank .rank-third[data-v-7a16d500]{background-color:#59c2a7}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-avatar[data-v-7a16d500]{margin:0 15px}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-avatar img[data-v-7a16d500]{width:50px;height:50px;border-radius:50%;object-fit:cover;cursor:pointer;transition:transform .2s}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-avatar img[data-v-7a16d500]:hover{transform:scale(1.05)}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-details[data-v-7a16d500]{flex:1}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-details .fan-info[data-v-7a16d500]{display:flex;justify-content:space-between;margin-bottom:8px}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-details .fan-info .fan-name[data-v-7a16d500]{font-weight:bold;color:#ea7034;cursor:pointer}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-details .fan-info .fan-name[data-v-7a16d500]:hover{text-decoration:underline}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-details .fan-info .fan-value[data-v-7a16d500]{font-weight:bold;color:#ea7034}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-details .fan-message[data-v-7a16d500]{padding:8px 12px;background-color:rgba(234,112,52,.1);border-radius:8px;font-size:14px;color:#666;position:relative}.fans-page .fans-container .fans-list-container .fans-list .fan-item .fan-details .fan-message[data-v-7a16d500]:before{content:\"\";position:absolute;top:-8px;left:15px;border-width:0 8px 8px;border-style:solid;border-color:rgba(0,0,0,0) rgba(0,0,0,0) rgba(234,112,52,.1)}.fans-page .fans-container .my-info-wrapper[data-v-7a16d500]{position:fixed;bottom:0;left:0;width:100%;z-index:10}.fans-page .fans-container .my-info-wrapper .my-info-rank[data-v-7a16d500]{background-color:rgba(0,0,0,.8);color:#fff;padding:6px 15px;border-top-right-radius:20px;font-size:14px;display:inline-block}.fans-page .fans-container .my-info-wrapper .my-info[data-v-7a16d500]{display:flex;align-items:center;background-color:rgba(0,0,0,.8);padding:10px 15px}.fans-page .fans-container .my-info-wrapper .my-info .my-avatar[data-v-7a16d500]{margin-right:15px}.fans-page .fans-container .my-info-wrapper .my-info .my-avatar img[data-v-7a16d500]{width:40px;height:40px;border-radius:50%;object-fit:cover}.fans-page .fans-container .my-info-wrapper .my-info .my-details[data-v-7a16d500]{display:flex;flex:1;justify-content:space-between;align-items:center}.fans-page .fans-container .my-info-wrapper .my-info .my-details .my-name[data-v-7a16d500]{color:#fff;font-weight:bold}.fans-page .fans-container .my-info-wrapper .my-info .my-details .my-value[data-v-7a16d500]{color:#ea7034;font-weight:bold}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 163:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/novel/fans.vue?vue&type=template&id=7a16d500&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "fans-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-7a16d500>", "</div>", [_c('nuxt-link', {
    staticClass: "back-link",
    attrs: {
      "to": "/read"
    }
  }, [_c('span', {
    staticClass: "back-icon"
  }, [_vm._v("←")]), _vm._v(" 返回书库\n    ")]), _vm._ssrNode(" <h1 class=\"page-title\" data-v-7a16d500>" + _vm._ssrEscape(_vm._s(_vm.novel.name) + " - 粉丝榜") + "</h1>")], 2), _vm._ssrNode(" "), _vm.loading ? _vm._ssrNode("<div class=\"loading-container\" data-v-7a16d500>", "</div>", [_vm._ssrNode("<div class=\"loading-spinner\" data-v-7a16d500></div> <p data-v-7a16d500>正在加载粉丝榜...</p>")], 2) : _vm.error ? _vm._ssrNode("<div class=\"error-container\" data-v-7a16d500>", "</div>", [_vm._ssrNode("<p data-v-7a16d500>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> "), _c('nuxt-link', {
    staticClass: "back-button",
    attrs: {
      "to": `/novel/${_vm.novelId}`
    }
  }, [_vm._v("返回小说详情")])], 2) : _vm._ssrNode("<div class=\"fans-container\" data-v-7a16d500><div class=\"novel-info\" data-v-7a16d500>" + (_vm.novel.picUrl ? "<div class=\"novel-cover\"" + _vm._ssrStyle(null, `background-image: url(${_vm.novel.picUrl})`, null) + " data-v-7a16d500></div>" : "<div class=\"novel-cover\"" + _vm._ssrStyle(null, `background-color: hsl(${_vm.novel.novel_id * 30 % 360}, 70%, 80%)`, null) + " data-v-7a16d500></div>") + " <div class=\"novel-details\" data-v-7a16d500><h2 class=\"novel-title\" data-v-7a16d500>" + _vm._ssrEscape(_vm._s(_vm.novel.name)) + "</h2> <div class=\"novel-author\" data-v-7a16d500>" + (_vm.novel.auther_avatar ? "<img" + _vm._ssrAttr("src", _vm.novel.auther_avatar) + " alt=\"作者头像\" class=\"author-avatar\" data-v-7a16d500>" : "<div class=\"author-avatar-placeholder\" data-v-7a16d500>" + _vm._ssrEscape(_vm._s(_vm.novel.author_name ? _vm.novel.author_name.charAt(0) : '作')) + "</div>") + " <span class=\"author-name\" data-v-7a16d500>" + _vm._ssrEscape(_vm._s(_vm.novel.author_name || '佚名')) + "</span></div></div></div> <div class=\"fans-list-container\" data-v-7a16d500><h3 class=\"section-title\" data-v-7a16d500>原木力榜 - 粉丝贡献排行</h3> <div class=\"fans-list\" data-v-7a16d500>" + _vm._ssrList(_vm.fansList, function (fan, index) {
    return "<div class=\"fan-item\" data-v-7a16d500><div class=\"fan-rank\" data-v-7a16d500><div" + _vm._ssrClass(null, index <= 2 ? _vm.rankClasses[index] : 'rank-number') + " data-v-7a16d500>" + _vm._ssrEscape(_vm._s(index + 1)) + "</div></div> <div class=\"fan-avatar\" data-v-7a16d500><img" + _vm._ssrAttr("src", fan.avatar_url) + " alt=\"头像\" data-v-7a16d500></div> <div class=\"fan-details\" data-v-7a16d500><div class=\"fan-info\" data-v-7a16d500><span class=\"fan-name\" data-v-7a16d500>" + _vm._ssrEscape(_vm._s(fan.user_name)) + "</span> <span class=\"fan-value\" data-v-7a16d500>" + _vm._ssrEscape(_vm._s(fan.fans_value)) + "</span></div> <div class=\"fan-message\" data-v-7a16d500>\n              此书只应天上有，当赏当赏！\n            </div></div></div>";
  }) + "</div></div> " + (_vm.$auth.loggedIn && _vm.myInfo.name ? "<div class=\"my-info-wrapper\" data-v-7a16d500><div class=\"my-info-rank\" data-v-7a16d500>" + _vm._ssrEscape("\n        " + _vm._s(_vm.myInfo.rank) + "\n      ") + "</div> <div class=\"my-info\" data-v-7a16d500><div class=\"my-avatar\" data-v-7a16d500><img" + _vm._ssrAttr("src", _vm.myInfo.avatar_url) + " alt=\"我的头像\" data-v-7a16d500></div> <div class=\"my-details\" data-v-7a16d500><span class=\"my-name\" data-v-7a16d500>" + _vm._ssrEscape(_vm._s(_vm.myInfo.name)) + "</span> <span class=\"my-value\" data-v-7a16d500>" + _vm._ssrEscape(_vm._s(_vm.myInfo.fans_value)) + "</span></div></div></div>" : "<!---->") + "</div>")], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/novel/fans.vue?vue&type=template&id=7a16d500&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/novel/fans.vue?vue&type=script&lang=js
/* harmony default export */ var fansvue_type_script_lang_js = ({
  async asyncData({
    params,
    query,
    $api,
    error
  }) {
    const novelId = query.id || params.id;
    if (!novelId) {
      return error({
        statusCode: 404,
        message: '未找到小说ID'
      });
    }
    try {
      // 获取小说信息
      const novel = await $api.novels.getNovelById(novelId);
      if (!novel || novel.length === 0) {
        return error({
          statusCode: 404,
          message: '找不到该小说'
        });
      }

      // 获取粉丝榜数据
      const fansList = await $api.novels.getNovelFans(novelId);
      return {
        loading: false,
        error: null,
        novelId,
        novel: novel[0],
        fansList: fansList || []
      };
    } catch (err) {
      console.error('加载粉丝榜失败', err);
      return {
        loading: false,
        error: '加载粉丝榜失败，请稍后重试',
        novelId,
        novel: {},
        fansList: []
      };
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      novelId: null,
      novel: {},
      fansList: [],
      myInfo: {
        rank: "未上榜",
        fans_value: 0,
        name: "",
        avatar_url: ""
      },
      rankClasses: ['rank-first', 'rank-second', 'rank-third']
    };
  },
  head() {
    var _this$novel;
    return {
      title: (_this$novel = this.novel) !== null && _this$novel !== void 0 && _this$novel.name ? `${this.novel.name} - 粉丝榜 - 原木社区` : '粉丝榜 - 原木社区'
    };
  },
  async mounted() {
    if (localStorage.getItem("token")) {
      await this.getMyInfo();
    }
  },
  methods: {
    async getMyInfo() {
      try {
        // 获取当前用户信息
        const userInfo = this.$auth.user;
        if (!userInfo) return;
        this.myInfo = {
          ...this.myInfo,
          ...userInfo,
          avatar_url: userInfo.avatar,
          name: userInfo.name || userInfo.username
        };

        // 查找用户在粉丝榜中的排名
        for (let i = 0; i < this.fansList.length; i++) {
          if (this.fansList[i].user_id == userInfo.id) {
            this.myInfo.rank = `第 ${i + 1} 名`;
            this.myInfo.fans_value = this.fansList[i].fans_value;
            break;
          }
        }
      } catch (error) {
        console.error('获取当前用户粉丝信息失败', error);
      }
    },
    gotoUserProfile(userId) {
      this.$router.push(`/user/${userId}`);
    }
  }
});
// CONCATENATED MODULE: ./pages/novel/fans.vue?vue&type=script&lang=js
 /* harmony default export */ var novel_fansvue_type_script_lang_js = (fansvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/novel/fans.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(137)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  novel_fansvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "7a16d500",
  "45a35bbc"
  
)

/* harmony default export */ var fans = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=fans.js.map