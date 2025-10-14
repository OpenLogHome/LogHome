exports.ids = [11];
exports.modules = {

/***/ 117:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(155);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("b17fe12a", content, true, context)
};

/***/ }),

/***/ 154:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_me_vue_vue_type_style_index_0_id_3c2f45fe_prod_scoped_true_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(117);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_me_vue_vue_type_style_index_0_id_3c2f45fe_prod_scoped_true_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_me_vue_vue_type_style_index_0_id_3c2f45fe_prod_scoped_true_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_me_vue_vue_type_style_index_0_id_3c2f45fe_prod_scoped_true_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_me_vue_vue_type_style_index_0_id_3c2f45fe_prod_scoped_true_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 155:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".user-profile-container[data-v-3c2f45fe]{max-width:1200px;margin:0 auto;padding:20px}.profile-header[data-v-3c2f45fe]{background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);margin-bottom:20px;position:relative}.header-background[data-v-3c2f45fe]{height:200px;position:relative;overflow:hidden}.header-background .cover-image[data-v-3c2f45fe]{width:100%;height:100%;object-fit:cover}.header-background .edit-cover[data-v-3c2f45fe]{position:absolute;right:20px;bottom:20px;background:rgba(0,0,0,.5);color:#fff;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:14px}.header-background .edit-cover[data-v-3c2f45fe]:hover{background:rgba(0,0,0,.7)}.user-info-box[data-v-3c2f45fe]{padding:20px;display:flex;align-items:flex-start;margin-top:-50px;position:relative;z-index:1}.avatar-box[data-v-3c2f45fe]{position:relative;margin-right:20px}.avatar-box .avatar-image[data-v-3c2f45fe]{width:100px;height:100px;border-radius:8px;border:4px solid #fff;object-fit:cover;background-color:#f5f5f5}.avatar-box .edit-avatar[data-v-3c2f45fe]{position:absolute;right:-10px;bottom:-10px;width:30px;height:30px;border-radius:50%;background:#947358;color:#fff;display:flex;justify-content:center;align-items:center;cursor:pointer}.avatar-box .edit-avatar[data-v-3c2f45fe]:hover{background:#826347}.user-info[data-v-3c2f45fe]{flex:1;padding-top:10px}.user-name[data-v-3c2f45fe]{display:flex;align-items:center;flex-wrap:wrap}.user-name .name[data-v-3c2f45fe]{font-size:24px;font-weight:bold;margin-right:10px}.user-name .user-id[data-v-3c2f45fe]{background:rgba(0,0,0,.1);padding:2px 8px;border-radius:4px;font-size:14px;margin-right:10px}.user-name .user-group[data-v-3c2f45fe]{background:#947358;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;margin-right:5px;margin-bottom:5px}.user-motto[data-v-3c2f45fe]{color:#666;margin-top:10px;font-size:14px}.profile-body[data-v-3c2f45fe]{display:flex;gap:20px}.profile-body .left-panel[data-v-3c2f45fe]{width:300px;flex-shrink:0}.profile-body .right-panel[data-v-3c2f45fe]{flex:1}.card[data-v-3c2f45fe]{background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);margin-bottom:20px;padding:20px}.card .card-title[data-v-3c2f45fe]{font-size:18px;font-weight:bold;margin-bottom:15px;color:#333;border-bottom:1px solid #f0f0f0;padding-bottom:10px}.action-items[data-v-3c2f45fe]{display:grid;grid-template-columns:repeat(3, 1fr);gap:15px}.action-item[data-v-3c2f45fe]{display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:all .3s;padding:10px;border-radius:8px}.action-item[data-v-3c2f45fe]:hover{background:#f9f9f9}.action-item .action-icon[data-v-3c2f45fe]{width:48px;height:48px;background:#f0f0f0;border-radius:50%;display:flex;justify-content:center;align-items:center;margin-bottom:8px;font-size:24px;color:#947358}.action-item .action-icon.warning[data-v-3c2f45fe]{color:#f50;animation:pulse-3c2f45fe 1.5s infinite}.action-item .action-icon.new-message[data-v-3c2f45fe]{position:relative}.action-item .action-icon.new-message[data-v-3c2f45fe]:after{content:\"\";position:absolute;top:0;right:0;width:10px;height:10px;background:#f50;border-radius:50%}.action-item .action-text[data-v-3c2f45fe]{font-size:14px}.action-item .action-text.warning[data-v-3c2f45fe]{color:#f50;font-weight:bold}.tree-status[data-v-3c2f45fe]{display:flex;align-items:center;margin-bottom:15px;font-size:16px}.tree-status i[data-v-3c2f45fe]{margin-right:10px;font-size:20px;color:#947358}.tree-status.warning[data-v-3c2f45fe]{color:#f50}.tree-status.warning i[data-v-3c2f45fe]{color:#f50;animation:pulse-3c2f45fe 1.5s infinite}.balance-amount[data-v-3c2f45fe]{font-size:24px;font-weight:bold;color:#947358;margin-bottom:15px}.function-list[data-v-3c2f45fe]{display:grid;grid-template-columns:repeat(3, 1fr);gap:15px}.function-item[data-v-3c2f45fe]{display:flex;align-items:center;padding:10px;border-radius:8px;cursor:pointer;transition:all .3s}.function-item[data-v-3c2f45fe]:hover{background:#f9f9f9}.function-item i[data-v-3c2f45fe]{font-size:20px;color:#947358;margin-right:10px}.function-item span[data-v-3c2f45fe]{font-size:14px}.empty-works[data-v-3c2f45fe],.empty-bookcase[data-v-3c2f45fe]{display:flex;flex-direction:column;align-items:center;padding:30px 0;color:#999}.empty-works i[data-v-3c2f45fe],.empty-bookcase i[data-v-3c2f45fe]{font-size:48px;margin-bottom:15px}.empty-works p[data-v-3c2f45fe],.empty-bookcase p[data-v-3c2f45fe]{margin-bottom:15px}.works-grid[data-v-3c2f45fe]{display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:20px;margin-top:15px}.work-item[data-v-3c2f45fe]{background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);cursor:pointer;transition:all .3s ease}.work-item[data-v-3c2f45fe]:hover{transform:translateY(-4px);box-shadow:0 4px 16px rgba(0,0,0,.15)}.work-item .work-cover[data-v-3c2f45fe]{width:100%;height:120px;object-fit:cover;background-color:#f5f5f5}.work-item .work-info[data-v-3c2f45fe]{padding:15px}.work-item .work-info .work-title[data-v-3c2f45fe]{font-size:16px;font-weight:bold;color:#333;margin:0 0 8px 0;line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.work-item .work-info .work-desc[data-v-3c2f45fe]{font-size:14px;color:#666;margin:0;line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}@keyframes pulse-3c2f45fe{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(1)}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/me.vue?vue&type=template&id=3c2f45fe&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "user-profile-container"
  }, [_vm._ssrNode("<div class=\"profile-header\" data-v-3c2f45fe><div class=\"header-background\" data-v-3c2f45fe><img" + _vm._ssrAttr("src", _vm.user.top_pic_url || 'https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg') + " alt=\"背景图片\" class=\"cover-image\" data-v-3c2f45fe> <div class=\"edit-cover\" data-v-3c2f45fe><i class=\"el-icon-camera\" data-v-3c2f45fe></i> 更换封面\n      </div></div> <div class=\"user-info-box\" data-v-3c2f45fe><div class=\"avatar-box\" data-v-3c2f45fe><img" + _vm._ssrAttr("src", _vm.user.avatar_url || '../static/user/defaultAvatar.jpg') + " alt=\"用户头像\" class=\"avatar-image\" data-v-3c2f45fe> <div class=\"edit-avatar\" data-v-3c2f45fe><i class=\"el-icon-edit\" data-v-3c2f45fe></i></div></div> <div class=\"user-info\" data-v-3c2f45fe><div class=\"user-name\" data-v-3c2f45fe><span class=\"name\" data-v-3c2f45fe>" + _vm._ssrEscape(_vm._s(_vm.user.name)) + "</span> <span class=\"user-id\" data-v-3c2f45fe>" + _vm._ssrEscape("ID: " + _vm._s(_vm.user.user_id)) + "</span> " + _vm._ssrList(_vm.userGroups, function (group) {
    return "<span class=\"user-group\" data-v-3c2f45fe>" + _vm._ssrEscape(_vm._s(group)) + "</span>";
  }) + "</div> <div class=\"user-motto\" data-v-3c2f45fe>" + _vm._ssrEscape(_vm._s(_vm.user.motto || '这个人很懒，什么都没留下...')) + "</div></div></div></div> "), _vm._ssrNode("<div class=\"profile-body\" data-v-3c2f45fe>", "</div>", [_vm._ssrNode("<div class=\"left-panel\" data-v-3c2f45fe>", "</div>", [_vm._ssrNode("<div class=\"card user-actions\" data-v-3c2f45fe><div class=\"action-items\" data-v-3c2f45fe>" + (_vm.user.email === 'unbind' ? "<div class=\"action-item\" data-v-3c2f45fe><div class=\"action-icon warning\" data-v-3c2f45fe><i class=\"el-icon-warning-outline\" data-v-3c2f45fe></i></div> <div class=\"action-text warning\" data-v-3c2f45fe>绑定邮箱</div></div>" : "<!---->") + " <div class=\"action-item\" data-v-3c2f45fe><div class=\"action-icon\" data-v-3c2f45fe><i class=\"el-icon-user\" data-v-3c2f45fe></i></div> <div class=\"action-text\" data-v-3c2f45fe>个人名片</div></div> <div class=\"action-item\" data-v-3c2f45fe><div" + _vm._ssrClass("action-icon", {
    'new-message': _vm.hasNewMessage || _vm.hasNewPrivateMessage
  }) + " data-v-3c2f45fe><i class=\"el-icon-message\" data-v-3c2f45fe></i></div> <div class=\"action-text\" data-v-3c2f45fe>我的消息</div></div> <div class=\"action-item\" data-v-3c2f45fe><div class=\"action-icon\" data-v-3c2f45fe><i class=\"el-icon-user-solid\" data-v-3c2f45fe></i></div> <div class=\"action-text\" data-v-3c2f45fe>我的好友</div></div> <div class=\"action-item\" data-v-3c2f45fe><div class=\"action-icon\" data-v-3c2f45fe><i class=\"el-icon-setting\" data-v-3c2f45fe></i></div> <div class=\"action-text\" data-v-3c2f45fe>账号设置</div></div></div></div> "), _vm._ssrNode("<div class=\"card tree-plant\" data-v-3c2f45fe>", "</div>", [_vm._ssrNode("<div class=\"card-title\" data-v-3c2f45fe>原木树场</div> <div" + _vm._ssrClass("tree-status", {
    'warning': _vm.treeState === '未种植' || _vm.treeState === '结果'
  }) + " data-v-3c2f45fe><i class=\"el-icon-tree\" data-v-3c2f45fe></i> <span data-v-3c2f45fe>" + _vm._ssrEscape("当前状态：" + _vm._s(_vm.treeState)) + "</span></div> "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.gotoTreePlant
    }
  }, [_vm._v("进入树场")])], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"card balance\" data-v-3c2f45fe>", "</div>", [_vm._ssrNode("<div class=\"card-title\" data-v-3c2f45fe>账户余额</div> <div class=\"balance-amount\" data-v-3c2f45fe>" + _vm._ssrEscape(_vm._s(_vm.earningsMoney) + " 元") + "</div> "), _c('el-button', {
    on: {
      "click": _vm.gotoEarnings
    }
  }, [_vm._v("余额提现")])], 2)], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"right-panel\" data-v-3c2f45fe>", "</div>", [_vm._ssrNode("<div class=\"card\" data-v-3c2f45fe><div class=\"card-title\" data-v-3c2f45fe>社区功能</div> <div class=\"function-list\" data-v-3c2f45fe><div class=\"function-item\" data-v-3c2f45fe><i class=\"el-icon-medal\" data-v-3c2f45fe></i> <span data-v-3c2f45fe>我的信誉</span></div> <div class=\"function-item\" data-v-3c2f45fe><i class=\"el-icon-coin\" data-v-3c2f45fe></i> <span data-v-3c2f45fe>支持社区</span></div> <div class=\"function-item\" data-v-3c2f45fe><i class=\"el-icon-info\" data-v-3c2f45fe></i> <span data-v-3c2f45fe>关于社区</span></div> <div class=\"function-item\" data-v-3c2f45fe><i class=\"el-icon-document\" data-v-3c2f45fe></i> <span data-v-3c2f45fe>意见反馈</span></div> <div class=\"function-item\" data-v-3c2f45fe><i class=\"el-icon-setting\" data-v-3c2f45fe></i> <span data-v-3c2f45fe>设置</span></div> " + (_vm.user.is_admin === 1 ? "<div class=\"function-item\" data-v-3c2f45fe><i class=\"el-icon-s-tools\" data-v-3c2f45fe></i> <span data-v-3c2f45fe>平台管理</span></div>" : "<!---->") + "</div></div> "), _vm._ssrNode("<div class=\"card\" data-v-3c2f45fe>", "</div>", [_vm._ssrNode("<div class=\"card-title\" data-v-3c2f45fe>我的作品</div> "), !_vm.userWorks || _vm.userWorks.length === 0 ? _vm._ssrNode("<div class=\"empty-works\" data-v-3c2f45fe>", "</div>", [_vm._ssrNode("<i class=\"el-icon-document\" data-v-3c2f45fe></i> <p data-v-3c2f45fe>你还没有创作作品</p> "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.gotoWrite
    }
  }, [_vm._v("开始创作")])], 2) : _vm._ssrNode("<div class=\"works-grid\" data-v-3c2f45fe>" + _vm._ssrList(_vm.userWorks, function (work) {
    return "<div class=\"work-item\"" + _vm._ssrStyle(null, null, {
      display: !work.is_personal ? '' : 'none'
    }) + " data-v-3c2f45fe><img" + _vm._ssrAttr("src", work.picUrl) + " alt=\"作品封面\" class=\"work-cover\" data-v-3c2f45fe> <div class=\"work-info\" data-v-3c2f45fe><h3 class=\"work-title\" data-v-3c2f45fe>" + _vm._ssrEscape(_vm._s(work.name)) + "</h3> <p class=\"work-desc\" data-v-3c2f45fe>" + _vm._ssrEscape(_vm._s(work.content || '暂无简介')) + "</p></div></div>";
  }) + "</div>")], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"card\" data-v-3c2f45fe>", "</div>", [_vm._ssrNode("<div class=\"card-title\" data-v-3c2f45fe>我的书架</div> "), !_vm.userBookcase || _vm.userBookcase.length === 0 ? _vm._ssrNode("<div class=\"empty-bookcase\" data-v-3c2f45fe>", "</div>", [_vm._ssrNode("<i class=\"el-icon-collection\" data-v-3c2f45fe></i> <p data-v-3c2f45fe>你的书架还是空的</p> "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.gotoLibrary
    }
  }, [_vm._v("去看书")])], 2) : _vm._ssrNode("<div class=\"bookcase-list\" data-v-3c2f45fe></div>")], 2)], 2)], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/me.vue?vue&type=template&id=3c2f45fe&scoped=true

// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__(10);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/me.vue?vue&type=script&lang=js

/* harmony default export */ var mevue_type_script_lang_js = ({
  layout: 'default',
  data() {
    return {
      user: {},
      userGroups: [],
      hasNewMessage: false,
      hasNewPrivateMessage: false,
      treeState: "无",
      earningsMoney: 0.00,
      userWorks: [],
      userBookcase: [],
      worksLoading: false,
      bookcaseLoading: false
    };
  },
  mounted() {
    this.loadUserInfo();
    this.checkMessages();
    this.checkTreePlant();
    this.refreshResources();
    this.loadUserWorks();
  },
  methods: {
    loadUserInfo() {
      // 先尝试从localStorage获取用户信息
      const cachedUserInfo = localStorage.getItem('LogHomeUserInfo');
      if (cachedUserInfo) {
        this.user = JSON.parse(cachedUserInfo);
        if (this.user.user_group) {
          this.userGroups = this.user.user_group.split(",");
        }
        return;
      }

      // 如果没有缓存，从服务器获取
      this.fetchUserInfo();
    },
    async fetchUserInfo() {
      try {
        // 使用API服务获取用户信息
        this.user = await this.$api.users.getUserProfile();
        if (this.user.user_group) {
          this.userGroups = this.user.user_group.split(",");
        }
      } catch (error) {
        console.error('获取用户资料失败', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login?msg=unAuthorized');
        }
      }
    },
    getToken() {
      const tk = JSON.parse(localStorage.getItem('token'));
      return tk ? tk.tk : null;
    },
    checkMessages() {
      // 检查系统消息
      if (localStorage.getItem('messages') === "") {
        localStorage.setItem('messages', "[]");
      }
      const curMessage = JSON.parse(localStorage.getItem('messages') || "[]");
      for (let item of curMessage) {
        if (item.is_read === 0 && item.to_id === this.user.user_id) {
          this.hasNewMessage = true;
          break;
        }
      }

      // 检查私信
      const unreadPrivateMessages = localStorage.getItem('unreadPrivateMessages');
      this.hasNewPrivateMessage = unreadPrivateMessages && parseInt(unreadPrivateMessages) > 0;
    },
    async checkTreePlant() {
      try {
        const result = await this.$api.treePlant.getTreePlantInfo();
        this.treeState = result.treeState;
      } catch (error) {
        console.error('获取树场信息失败', error);
      }
    },
    async refreshResources() {
      try {
        const result = await this.$api.resources.getUserResources();
        this.earningsMoney = result.earningsMoney;
      } catch (error) {
        console.error('获取资源信息失败', error);
      }
    },
    // 加载用户作品
    async loadUserWorks() {
      this.worksLoading = true;
      try {
        const response = await this.$api.users.getUserNovels(this.user.user_id);
        if (response.code === 0) {
          this.userWorks = response.data || [];
        } else {
          throw new Error(response.message || '获取作品失败');
        }
      } catch (error) {
        console.error('加载用户作品失败', error);
        this.$message.error('作品信息加载失败');
      } finally {
        this.worksLoading = false;
      }
    },
    bankNum(num) {
      if (isNaN(num)) {
        return num;
      } else {
        const s = num.toFixed(2).toString();
        return s.substring(0, s.indexOf(".") + 3);
      }
    },
    changeCoverImage() {
      this.$router.push("/users/top_pic_upload?noneAnimation=1");
    },
    changeUserInfo() {
      this.$router.push("/users/change_user_info");
    },
    viewUserProfile() {
      this.$router.push("/users/personalPage?id=" + this.user.user_id);
    },
    gotoMessages() {
      this.$router.push("/community/message");
      this.hasNewMessage = false;
      this.hasNewPrivateMessage = false;
    },
    gotoFriends() {
      this.$router.push("/community/friends");
    },
    gotoSettings() {
      this.$router.push("/users/clientSet");
    },
    activate() {
      this.$router.push("/users/activateAccount");
    },
    gotoTreePlant() {
      this.$router.push("/treePlant/treeplant");
    },
    gotoEarnings() {
      this.$router.push("/payments/earnings");
    },
    gotoCredits() {
      this.$router.push("/users/user_credit");
    },
    gotoRecharge() {
      this.$router.push("/payments/recharge");
    },
    gotoAbout() {
      this.$router.push("/apps/about");
    },
    gotoFeedback() {
      this.$router.push("/apps/faqs/faq");
    },
    gotoClientSet() {
      this.$router.push("/users/clientSet");
    },
    gotoAdmin() {
      this.$router.push("/manage/index");
    },
    gotoWrite() {
      this.$router.push("/write");
    },
    gotoLibrary() {
      this.$router.push("/read");
    },
    // 导航到作品
    navigateToWork(novelId) {
      if (novelId > 0) {
        this.$router.push(`/novel/${novelId}`);
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/me.vue?vue&type=script&lang=js
 /* harmony default export */ var pages_mevue_type_script_lang_js = (mevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/me.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(154)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_mevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "3c2f45fe",
  "32d3d018"
  
)

/* harmony default export */ var me = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=me.js.map