exports.ids = [14];
exports.modules = {

/***/ 129:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(186);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("8864a414", content, true, context)
};

/***/ }),

/***/ 185:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_id_e0f119b2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(129);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_id_e0f119b2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_id_e0f119b2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_id_e0f119b2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_id_e0f119b2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 186:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".settings-page[data-v-e0f119b2]{max-width:900px;margin:0 auto;padding:20px}.page-header[data-v-e0f119b2]{margin-bottom:16px}.page-header .back-link[data-v-e0f119b2]{font-size:14px;color:#947358}.page-header .back-link .back-icon[data-v-e0f119b2]{margin-right:4px}.page-header .page-title[data-v-e0f119b2]{font-size:22px;color:#333;margin:12px 0 0}.settings-card[data-v-e0f119b2]{background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.06);padding:20px;margin-bottom:20px}.section-title[data-v-e0f119b2]{font-size:16px;color:#333;margin:0 0 16px;padding-left:10px;border-left:3px solid #947358}.profile-form[data-v-e0f119b2]{max-width:460px}.image-settings[data-v-e0f119b2]{display:flex;flex-wrap:wrap;gap:30px;align-items:flex-end}.image-block[data-v-e0f119b2]{display:flex;flex-direction:column;align-items:flex-start;gap:10px}.image-block .image-label[data-v-e0f119b2]{font-size:13px;color:#666}.image-block .avatar-preview[data-v-e0f119b2]{width:88px;height:88px;border-radius:50%;object-fit:cover;background:#f5f5f5}.image-block.cover .cover-preview[data-v-e0f119b2]{width:320px;height:120px;object-fit:cover;border-radius:6px;background:#f5f5f5}.tip[data-v-e0f119b2]{margin:16px 0 0;font-size:12px;color:#999}.info-row[data-v-e0f119b2]{display:flex;align-items:center;padding:10px 0;border-bottom:1px solid #f5f5f5}.info-row[data-v-e0f119b2]:last-child{border-bottom:none}.info-row .label[data-v-e0f119b2]{width:90px;font-size:14px;color:#666}.info-row .value[data-v-e0f119b2]{flex:1;font-size:14px;color:#333}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 244:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/settings.vue?vue&type=template&id=e0f119b2&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "settings-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-e0f119b2>", "</div>", [_c('nuxt-link', {
    staticClass: "back-link",
    attrs: {
      "to": "/me"
    }
  }, [_c('span', {
    staticClass: "back-icon"
  }, [_vm._v("←")]), _vm._v(" 返回个人中心\n    ")]), _vm._ssrNode(" <h1 class=\"page-title\" data-v-e0f119b2>账号设置</h1>")], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"settings-card\" data-v-e0f119b2>", "</div>", [_vm._ssrNode("<h2 class=\"section-title\" data-v-e0f119b2>个人资料</h2> "), _c('el-form', {
    staticClass: "profile-form",
    attrs: {
      "label-width": "90px",
      "size": "small"
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": "昵称"
    }
  }, [_c('el-input', {
    attrs: {
      "maxlength": "20",
      "show-word-limit": "",
      "placeholder": "请输入昵称"
    },
    model: {
      value: _vm.form.name,
      callback: function ($$v) {
        _vm.$set(_vm.form, "name", $$v);
      },
      expression: "form.name"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "个性签名"
    }
  }, [_c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 2,
      "maxlength": "30",
      "show-word-limit": "",
      "placeholder": "写点什么让别人认识你"
    },
    model: {
      value: _vm.form.motto,
      callback: function ($$v) {
        _vm.$set(_vm.form, "motto", $$v);
      },
      expression: "form.motto"
    }
  })], 1), _vm._v(" "), _c('el-form-item', [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.savingProfile
    },
    on: {
      "click": _vm.saveProfile
    }
  }, [_vm._v("保存资料")])], 1)], 1)], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"settings-card\" data-v-e0f119b2>", "</div>", [_vm._ssrNode("<h2 class=\"section-title\" data-v-e0f119b2>头像与封面</h2> "), _vm._ssrNode("<div class=\"image-settings\" data-v-e0f119b2>", "</div>", [_vm._ssrNode("<div class=\"image-block\" data-v-e0f119b2>", "</div>", [_vm._ssrNode("<div class=\"image-label\" data-v-e0f119b2>头像</div> <img" + _vm._ssrAttr("src", _vm.form.avatar_url || '/default-avatar.png') + " alt=\"头像\" class=\"avatar-preview\" data-v-e0f119b2> "), _c('el-upload', {
    attrs: {
      "action": "",
      "show-file-list": false,
      "auto-upload": false,
      "accept": "image/*",
      "on-change": file => _vm.handleImageChange(file, 'avatar')
    }
  }, [_c('el-button', {
    attrs: {
      "size": "mini",
      "loading": _vm.uploading === 'avatar'
    }
  }, [_vm._v("更换头像")])], 1)], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"image-block cover\" data-v-e0f119b2>", "</div>", [_vm._ssrNode("<div class=\"image-label\" data-v-e0f119b2>个人主页封面</div> <img" + _vm._ssrAttr("src", _vm.form.top_pic_url || _vm.defaultCover) + " alt=\"封面\" class=\"cover-preview\" data-v-e0f119b2> "), _c('el-upload', {
    attrs: {
      "action": "",
      "show-file-list": false,
      "auto-upload": false,
      "accept": "image/*",
      "on-change": file => _vm.handleImageChange(file, 'cover')
    }
  }, [_c('el-button', {
    attrs: {
      "size": "mini",
      "loading": _vm.uploading === 'cover'
    }
  }, [_vm._v("更换封面")])], 1)], 2)], 2), _vm._ssrNode(" <p class=\"tip\" data-v-e0f119b2>图片会被压缩后上传，建议 JPG/PNG，单张不超过 5MB。</p>")], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"settings-card\" data-v-e0f119b2>", "</div>", [_vm._ssrNode("<h2 class=\"section-title\" data-v-e0f119b2>账号信息</h2> <div class=\"info-row\" data-v-e0f119b2><span class=\"label\" data-v-e0f119b2>用户 ID</span> <span class=\"value\" data-v-e0f119b2>" + _vm._ssrEscape(_vm._s(_vm.user.user_id)) + "</span></div> <div class=\"info-row\" data-v-e0f119b2><span class=\"label\" data-v-e0f119b2>注册时间</span> <span class=\"value\" data-v-e0f119b2>" + _vm._ssrEscape(_vm._s(_vm.formatDate(_vm.user.register_time))) + "</span></div> "), _vm._ssrNode("<div class=\"info-row\" data-v-e0f119b2>", "</div>", [_vm._ssrNode("<span class=\"label\" data-v-e0f119b2>邮箱</span> <span class=\"value\" data-v-e0f119b2>" + _vm._ssrEscape(_vm._s(_vm.emailBound ? _vm.user.email : '未绑定')) + "</span> "), _c('el-button', {
    attrs: {
      "size": "mini",
      "type": "text"
    },
    on: {
      "click": function ($event) {
        return _vm.gotoMobilePage('/pages/users/activateAccount', _vm.emailBound ? '更换邮箱' : '绑定邮箱');
      }
    }
  }, [_vm._v("\n        " + _vm._s(_vm.emailBound ? '更换邮箱' : '绑定邮箱') + "\n      ")])], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"info-row\" data-v-e0f119b2>", "</div>", [_vm._ssrNode("<span class=\"label\" data-v-e0f119b2>密码</span> <span class=\"value\" data-v-e0f119b2>••••••</span> "), _c('el-button', {
    attrs: {
      "size": "mini",
      "type": "text"
    },
    on: {
      "click": function ($event) {
        return _vm.gotoMobilePage('/pages/users/changePwd', '修改密码');
      }
    }
  }, [_vm._v("修改密码")])], 2)], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/me/settings.vue?vue&type=template&id=e0f119b2&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/settings.vue?vue&type=script&lang=js
/* harmony default export */ var settingsvue_type_script_lang_js = ({
  layout: 'default',
  data() {
    return {
      user: {},
      form: {
        name: '',
        motto: '',
        avatar_url: '',
        top_pic_url: ''
      },
      defaultCover: 'https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg',
      savingProfile: false,
      uploading: null
    };
  },
  computed: {
    emailBound() {
      return !!this.user.email && this.user.email !== 'unbind';
    }
  },
  async mounted() {
    if (!localStorage.getItem('token')) {
      this.$message.warning('请先登录');
      this.$router.push('/login');
      return;
    }
    try {
      await this.refreshUser();
    } catch (error) {
      console.error('获取用户信息失败', error);
      localStorage.removeItem('token');
      this.$router.push('/login?msg=unAuthorized');
    }
  },
  methods: {
    async refreshUser() {
      const user = await this.$api.users.getUserProfile();
      this.user = user;
      this.form.name = user.name || '';
      this.form.motto = user.motto || '';
      this.form.avatar_url = user.avatar_url || '';
      this.form.top_pic_url = user.top_pic_url || '';
    },
    async saveProfile() {
      const name = (this.form.name || '').trim();
      if (!name) {
        this.$message.warning('昵称不能为空');
        return;
      }
      this.savingProfile = true;
      try {
        const response = await this.$api.users.updateUserInfo(name, (this.form.motto || '').trim());
        if (response.code !== 0) throw new Error(response.message || '保存失败');
        this.$message.success('资料已更新');
        await this.refreshUser();
      } catch (error) {
        console.error('保存资料失败', error);
        this.$message.error(error.message || '保存失败，请稍后重试');
      } finally {
        this.savingProfile = false;
      }
    },
    async handleImageChange(file, type) {
      const raw = file.raw || file;
      if (!raw || !raw.type.startsWith('image/')) {
        this.$message.warning('请选择图片文件');
        return;
      }
      if (raw.size > 5 * 1024 * 1024) {
        this.$message.warning('图片过大，请选择 5MB 以内的图片');
        return;
      }
      this.uploading = type;
      try {
        const img = await this.readAndResize(raw, type === 'avatar' ? 512 : 1600);
        const response = type === 'avatar' ? await this.$api.users.changeAvatar(img) : await this.$api.users.changeTopCover(img);
        if (response.code !== 0) throw new Error(response.message || '上传失败');
        this.$message.success(type === 'avatar' ? '头像已更新' : '封面已更新');
        await this.refreshUser();
      } catch (error) {
        console.error('上传图片失败', error);
        this.$message.error(error.message || '上传失败，请稍后重试');
      } finally {
        this.uploading = null;
      }
    },
    // 上传接口只接收 base64，先在本地把大图压到合适尺寸
    readAndResize(file, maxSize) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('读取文件失败'));
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => reject(new Error('图片解析失败'));
          image.onload = () => {
            const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));
            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          };
          image.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    },
    gotoMobilePage(pagePath, title) {
      return this.$openMobileWindow(pagePath, {
        title
      });
    },
    formatDate(value) {
      if (!value) return '-';
      const date = new Date(value);
      if (isNaN(date.getTime())) return '-';
      const pad = n => n < 10 ? `0${n}` : `${n}`;
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
  },
  head() {
    return {
      title: '账号设置 - 原木社区'
    };
  }
});
// CONCATENATED MODULE: ./pages/me/settings.vue?vue&type=script&lang=js
 /* harmony default export */ var me_settingsvue_type_script_lang_js = (settingsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/me/settings.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(185)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  me_settingsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "e0f119b2",
  "72ede021"
  
)

/* harmony default export */ var settings = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=settings.js.map