exports.ids = [25];
exports.modules = {

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(185);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("2bf41f4d", content, true, context)
};

/***/ }),

/***/ 184:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_cd11f428_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(132);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_cd11f428_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_cd11f428_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_cd11f428_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_cd11f428_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 185:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".info-edit-page[data-v-cd11f428]{width:100%;max-width:800px;margin:0 auto;padding:20px}.info-edit-page .page-header[data-v-cd11f428]{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px}.info-edit-page .page-header .page-title[data-v-cd11f428]{font-size:28px;color:#704c35;margin:0}.info-edit-page .page-header .back-link[data-v-cd11f428]{color:#947358;text-decoration:none;font-size:16px}.info-edit-page .page-header .back-link[data-v-cd11f428]:hover{text-decoration:underline}.info-edit-page .info-edit-container[data-v-cd11f428]{background-color:#fff;border-radius:8px;padding:30px;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);display:flex;flex-direction:column;gap:30px}.info-edit-page .cover-section[data-v-cd11f428]{display:flex;justify-content:center}.info-edit-page .cover-section .cover-preview[data-v-cd11f428]{width:200px;height:260px;border-radius:8px;overflow:hidden;position:relative;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.15)}.info-edit-page .cover-section .cover-preview:hover .cover-overlay[data-v-cd11f428]{opacity:1}.info-edit-page .cover-section .cover-preview .cover-overlay[data-v-cd11f428]{position:absolute;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,.5);display:flex;flex-direction:column;justify-content:center;align-items:center;opacity:0;transition:opacity .3s;color:#fff}.info-edit-page .cover-section .cover-preview .cover-overlay i[data-v-cd11f428]{font-size:32px;margin-bottom:10px}.info-edit-page .loading-state[data-v-cd11f428]{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.info-edit-page .loading-state .loading-spinner[data-v-cd11f428]{width:50px;height:50px;border:5px solid #f5f5f5;border-top:5px solid #947358;border-radius:50%;margin:0 auto 20px;animation:spin-cd11f428 1s linear infinite}.info-edit-page .loading-state .loading-text[data-v-cd11f428]{color:#666}@keyframes spin-cd11f428{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.info-edit-page .error-state[data-v-cd11f428]{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.info-edit-page .error-state .error-icon[data-v-cd11f428]{font-size:50px;margin-bottom:20px;color:#e74c3c}.info-edit-page .error-state .error-title[data-v-cd11f428]{font-size:20px;color:#333;margin-bottom:10px}.info-edit-page .error-state .error-desc[data-v-cd11f428]{color:#666;margin-bottom:25px}.info-edit-page .error-state .error-button[data-v-cd11f428]{background-color:#947358;color:#fff;border:none;border-radius:4px;padding:10px 30px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.info-edit-page .error-state .error-button[data-v-cd11f428]:hover{background-color:#704c35}.upload-container[data-v-cd11f428]{display:flex;flex-direction:column;align-items:center;gap:20px}.upload-container .cover-uploader[data-v-cd11f428]{width:300px}.upload-container .cover-uploader .el-upload[data-v-cd11f428]{width:100%;border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden;text-align:center;padding:20px 0}.upload-container .cover-uploader .el-upload[data-v-cd11f428]:hover{border-color:#947358}.upload-container .cover-uploader .cover-uploader-icon[data-v-cd11f428]{font-size:28px;color:#8c939d;width:100%;height:100px;line-height:100px;text-align:center}.upload-container .cover-uploader .cover-preview-image[data-v-cd11f428]{max-width:100%;max-height:300px;display:block;margin:0 auto}.upload-container .cover-uploader .upload-tip[data-v-cd11f428]{color:#666;font-size:14px;margin-top:10px;line-height:1.5}.upload-container .upload-actions[data-v-cd11f428]{display:flex;justify-content:center;gap:20px;margin-top:20px}@media(max-width: 768px){.info-edit-page[data-v-cd11f428]{padding:10px}.info-edit-page .page-header .page-title[data-v-cd11f428]{font-size:24px}.info-edit-page .info-edit-container[data-v-cd11f428]{padding:20px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 230:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/settings/info/_id.vue?vue&type=template&id=cd11f428&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "info-edit-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-cd11f428>", "</div>", [_vm._ssrNode("<h1 class=\"page-title\" data-v-cd11f428>修改作品信息</h1> "), _c('nuxt-link', {
    staticClass: "back-link",
    attrs: {
      "to": `/write/settings/${_vm.$route.params.id}`
    }
  }, [_vm._v("返回作品设置")])], 2), _vm._ssrNode(" "), !_vm.loading && !_vm.error ? _vm._ssrNode("<div class=\"info-edit-container\" data-v-cd11f428>", "</div>", [_vm._ssrNode("<div class=\"cover-section\" data-v-cd11f428><div class=\"cover-preview\"" + _vm._ssrStyle(null, _vm.coverStyle, null) + " data-v-cd11f428><div class=\"cover-overlay\" data-v-cd11f428><i class=\"el-icon-camera\" data-v-cd11f428></i> <span data-v-cd11f428>点击更换封面</span></div></div></div> "), _vm._ssrNode("<div class=\"form-section\" data-v-cd11f428>", "</div>", [_c('el-form', {
    attrs: {
      "model": _vm.novelForm,
      "label-position": "top"
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": "作品名称",
      "rules": [{
        required: true,
        message: '请输入作品名称',
        trigger: 'blur'
      }]
    }
  }, [_c('el-input', {
    attrs: {
      "placeholder": "请输入作品名称",
      "maxlength": "15",
      "show-word-limit": ""
    },
    model: {
      value: _vm.novelForm.title,
      callback: function ($$v) {
        _vm.$set(_vm.novelForm, "title", $$v);
      },
      expression: "novelForm.title"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "作品简介",
      "rules": [{
        required: true,
        message: '请输入作品简介',
        trigger: 'blur'
      }]
    }
  }, [_c('el-input', {
    attrs: {
      "type": "textarea",
      "placeholder": "请输入作品简介",
      "rows": 6,
      "maxlength": "300",
      "show-word-limit": ""
    },
    model: {
      value: _vm.novelForm.content,
      callback: function ($$v) {
        _vm.$set(_vm.novelForm, "content", $$v);
      },
      expression: "novelForm.content"
    }
  })], 1), _vm._v(" "), _c('el-form-item', [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.submitting
    },
    on: {
      "click": _vm.submitForm
    }
  }, [_vm._v("保存修改")]), _vm._v(" "), _c('el-button', {
    on: {
      "click": function ($event) {
        return _vm.$router.push(`/write/settings/${_vm.$route.params.id}`);
      }
    }
  }, [_vm._v("取消")])], 1)], 1)], 1)], 2) : _vm._e(), _vm._ssrNode(" " + (_vm.loading ? "<div class=\"loading-state\" data-v-cd11f428><div class=\"loading-spinner\" data-v-cd11f428></div> <p class=\"loading-text\" data-v-cd11f428>正在加载作品信息...</p></div>" : _vm.error ? "<div class=\"error-state\" data-v-cd11f428><div class=\"error-icon\" data-v-cd11f428>❌</div> <h3 class=\"error-title\" data-v-cd11f428>加载失败</h3> <p class=\"error-desc\" data-v-cd11f428>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button class=\"error-button\" data-v-cd11f428>重试</button></div>" : "<!---->") + " "), _c('el-dialog', {
    attrs: {
      "title": "上传封面",
      "visible": _vm.coverDialogVisible,
      "width": "50%"
    },
    on: {
      "update:visible": function ($event) {
        _vm.coverDialogVisible = $event;
      }
    }
  }, [_c('div', {
    staticClass: "upload-container"
  }, [_c('el-upload', {
    staticClass: "cover-uploader",
    attrs: {
      "action": "",
      "http-request": _vm.uploadCover,
      "show-file-list": false,
      "before-upload": _vm.beforeCoverUpload
    }
  }, [_vm.coverPreview ? _c('img', {
    staticClass: "cover-preview-image",
    attrs: {
      "src": _vm.coverPreview
    }
  }) : _c('i', {
    staticClass: "el-icon-plus cover-uploader-icon"
  }), _vm._v(" "), _c('div', {
    staticClass: "upload-tip"
  }, [_vm._v("点击上传封面图片"), _c('br'), _vm._v("建议尺寸: 741×962")])]), _vm._v(" "), _c('div', {
    staticClass: "upload-actions"
  }, [_c('el-button', {
    on: {
      "click": function ($event) {
        _vm.coverDialogVisible = false;
      }
    }
  }, [_vm._v("取消")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary",
      "disabled": !_vm.coverFile
    },
    on: {
      "click": _vm.confirmCoverUpload
    }
  }, [_vm._v("确认上传")])], 1)], 1)])], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/write/settings/info/_id.vue?vue&type=template&id=cd11f428&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/settings/info/_id.vue?vue&type=script&lang=js
/* harmony default export */ var _idvue_type_script_lang_js = ({
  head() {
    return {
      title: '修改作品信息 - 原木社区'
    };
  },
  data() {
    return {
      loading: true,
      error: null,
      submitting: false,
      novelForm: {
        title: '',
        content: ''
      },
      coverUrl: '',
      coverColor: '',
      coverDialogVisible: false,
      coverFile: null,
      coverPreview: ''
    };
  },
  computed: {
    coverStyle() {
      if (this.coverUrl) {
        return {
          backgroundImage: `url(${this.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      } else {
        // 随机颜色作为封面背景
        const colors = ['#a8d8ea', '#aa96da', '#c7ceea', '#f6c3d5', '#e4f9d4', '#f9d4d4'];
        this.coverColor = this.coverColor || colors[Math.floor(Math.random() * colors.length)];
        return {
          backgroundColor: this.coverColor
        };
      }
    }
  },
  async mounted() {
    await this.fetchNovelData();
  },
  methods: {
    async fetchNovelData() {
      this.loading = true;
      this.error = null;
      try {
        // 获取作品信息
        const novelId = this.$route.params.id;
        const response = await this.$api.essays.getNovelById(novelId);
        if (response && response.length > 0) {
          const novel = response[0];
          this.novelForm.title = novel.name;
          this.novelForm.content = novel.content;
          this.coverUrl = novel.picUrl;
        } else {
          this.error = '未找到作品信息';
        }
      } catch (error) {
        console.error('获取作品信息失败:', error);
        this.error = '获取作品信息失败，请稍后重试';
      } finally {
        this.loading = false;
      }
    },
    openCoverUpload() {
      this.coverDialogVisible = true;
      this.coverPreview = this.coverUrl;
      this.coverFile = null;
    },
    beforeCoverUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImage) {
        this.$message.error('只能上传图片文件!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!');
        return false;
      }

      // 创建预览
      this.coverFile = file;
      this.createCoverPreview(file);
      return false; // 阻止自动上传
    },
    createCoverPreview(file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.coverPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async uploadCover() {
      // 这个方法不会被直接调用，因为我们阻止了自动上传
      // 但需要提供给el-upload组件
    },
    async confirmCoverUpload() {
      if (!this.coverFile) {
        this.$message.warning('请先选择图片');
        return;
      }
      try {
        this.submitting = true;

        // 读取文件为base64
        const reader = new FileReader();
        reader.readAsDataURL(this.coverFile);
        reader.onload = async () => {
          const base64Data = reader.result;
          const novelId = this.$route.params.id;

          // 调用API上传封面
          await this.$api.essays.changeCover({
            img: base64Data,
            novel_id: novelId
          });
          this.$message.success('封面上传成功');
          this.coverUrl = base64Data; // 临时显示，实际应该重新获取作品信息
          this.coverDialogVisible = false;
          this.submitting = false;

          // 重新获取作品信息以更新封面URL
          await this.fetchNovelData();
        };
      } catch (error) {
        console.error('上传封面失败:', error);
        this.$message.error('上传封面失败，请稍后重试');
        this.submitting = false;
      }
    },
    async submitForm() {
      // 表单验证
      if (!this.novelForm.title.trim()) {
        this.$message.warning('请输入作品名称');
        return;
      }
      if (!this.novelForm.content.trim()) {
        this.$message.warning('请输入作品简介');
        return;
      }
      try {
        this.submitting = true;
        const novelId = this.$route.params.id;

        // 调用API修改作品信息
        await this.$api.essays.modifyNovel(novelId, this.novelForm.title, this.novelForm.content);
        this.$message.success('作品信息修改成功');

        // 返回作品设置页面
        this.$router.push(`/write/settings/${novelId}`);
      } catch (error) {
        console.error('修改作品信息失败:', error);
        this.$message.error('修改作品信息失败，请稍后重试');
      } finally {
        this.submitting = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/write/settings/info/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var info_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/write/settings/info/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(184)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  info_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "cd11f428",
  "25759056"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map