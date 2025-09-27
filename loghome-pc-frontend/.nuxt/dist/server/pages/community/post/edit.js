exports.ids = [7];
exports.modules = {

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(183);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("35881364", content, true, context)
};

/***/ }),

/***/ 182:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_032ef9c2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(131);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_032ef9c2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_032ef9c2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_032ef9c2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_032ef9c2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.post-edit-container[data-v-032ef9c2] {\n  max-width: 800px;\n  margin: 20px auto;\n}\n.box-card[data-v-032ef9c2] {\n  border-radius: 8px;\n}\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/post/edit.vue?vue&type=template&id=032ef9c2&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "post-edit-container"
  }, [_c('el-card', {
    staticClass: "box-card"
  }, [_c('div', {
    staticClass: "clearfix",
    attrs: {
      "slot": "header"
    },
    slot: "header"
  }, [_c('span', [_vm._v(_vm._s(_vm.isEdit ? '编辑帖子' : '发布新帖'))])]), _vm._v(" "), _c('el-form', {
    ref: "postForm",
    attrs: {
      "model": _vm.postData,
      "rules": _vm.rules,
      "label-width": "100px"
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": "标题",
      "prop": "title"
    }
  }, [_c('el-input', {
    attrs: {
      "placeholder": "请输入标题",
      "maxlength": "50",
      "show-word-limit": ""
    },
    model: {
      value: _vm.postData.title,
      callback: function ($$v) {
        _vm.$set(_vm.postData, "title", $$v);
      },
      expression: "postData.title"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "内容",
      "prop": "content"
    }
  }, [_c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 6,
      "placeholder": "分享你的想法...",
      "maxlength": "2000",
      "show-word-limit": ""
    },
    model: {
      value: _vm.postData.content,
      callback: function ($$v) {
        _vm.$set(_vm.postData, "content", $$v);
      },
      expression: "postData.content"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "图片"
    }
  }, [_c('el-upload', {
    attrs: {
      "action": "https://storage.codesocean.top/api/resource/upload?container=172018735018984",
      "list-type": "picture-card",
      "file-list": _vm.postData.media_urls,
      "on-success": _vm.handleImageSuccess,
      "on-remove": _vm.handleImageRemove,
      "before-upload": _vm.beforeImageUpload,
      "headers": _vm.uploadHeaders,
      "multiple": "",
      "limit": 9
    }
  }, [_c('i', {
    staticClass: "el-icon-plus"
  })])], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "发布到",
      "prop": "circle_id"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": "请选择圈子"
    },
    on: {
      "change": _vm.handleCircleChange
    },
    model: {
      value: _vm.postData.circle_id,
      callback: function ($$v) {
        _vm.$set(_vm.postData, "circle_id", $$v);
      },
      expression: "postData.circle_id"
    }
  }, _vm._l(_vm.circles, function (circle) {
    return _c('el-option', {
      key: circle.circle_id,
      attrs: {
        "label": circle.name,
        "value": circle.circle_id
      }
    });
  }), 1)], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "绑定作品"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": "请选择作品（可选）",
      "clearable": ""
    },
    model: {
      value: _vm.postData.novel_id,
      callback: function ($$v) {
        _vm.$set(_vm.postData, "novel_id", $$v);
      },
      expression: "postData.novel_id"
    }
  }, _vm._l(_vm.myNovels, function (novel) {
    return _c('el-option', {
      key: novel.novel_id,
      attrs: {
        "label": novel.name,
        "value": novel.novel_id
      }
    });
  }), 1)], 1), _vm._v(" "), _c('el-form-item', [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.isSubmitting
    },
    on: {
      "click": _vm.submitPost
    }
  }, [_vm._v(_vm._s(_vm.isEdit ? '保存' : '发布'))]), _vm._v(" "), _c('el-button', {
    on: {
      "click": _vm.cancel
    }
  }, [_vm._v("取消")])], 1)], 1)], 1)], 1);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/community/post/edit.vue?vue&type=template&id=032ef9c2&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/post/edit.vue?vue&type=script&lang=js
/* harmony default export */ var editvue_type_script_lang_js = ({
  name: 'PostEdit',
  data() {
    return {
      isEdit: false,
      postId: null,
      postData: {
        title: '',
        content: '',
        media_urls: [],
        circle_id: '',
        novel_id: null
      },
      circles: [],
      myNovels: [],
      isSubmitting: false,
      isBanned: false,
      banInfo: null,
      uploadHeaders: {
        ServiceKey: "a24785bedb466b9733dd317771d4b69c08da07fd"
      },
      rules: {
        title: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '请输入内容',
          trigger: 'blur'
        }],
        circle_id: [{
          required: true,
          message: '请选择圈子',
          trigger: 'change'
        }]
      }
    };
  },
  async mounted() {
    this.checkLoginStatus();
    if (this.$route.query.post_id) {
      this.isEdit = true;
      this.postId = this.$route.query.post_id;
      await this.loadPostDetail();
    } else if (this.$route.query.circle_id) {
      this.postData.circle_id = Number(this.$route.query.circle_id);
      this.checkCircleBanStatus(this.postData.circle_id);
    }
    await this.loadCircles();
    await this.loadMyNovels();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$message.warning('请先登录');
        this.$router.push('/login');
      }
    },
    async loadCircles() {
      try {
        const res = await this.$api.community.getMyCircles();
        this.circles = res;
        if (this.postData.circle_id) {
          const circleExists = this.circles.some(c => c.circle_id === this.postData.circle_id);
          if (!circleExists) {
            this.postData.circle_id = '';
          }
        }
      } catch (error) {
        console.error('加载圈子失败', error);
        this.$message.error('加载圈子失败');
      }
    },
    async loadMyNovels() {
      try {
        const res = await this.$api.essays.getNovelsOf();
        this.myNovels = res;
      } catch (error) {
        console.error('加载作品失败', error);
        this.$message.error('加载作品失败');
      }
    },
    async loadPostDetail() {
      try {
        const post = await this.$api.community.getPostDetail({
          post_id: this.postId
        });
        this.postData.title = post.title;
        this.postData.content = post.content;
        this.postData.media_urls = post.media_urls ? post.media_urls.map(url => ({
          url
        })) : [];
        this.postData.circle_id = post.circle_id;
        this.postData.novel_id = post.novel_id || null;
      } catch (error) {
        console.error('加载帖子详情失败', error);
        this.$message.error('加载帖子详情失败');
      }
    },
    handleImageSuccess(response, file, fileList) {
      if (response.data && response.data.resource_id) {
        const url = "https://storage.codesocean.top/api/resource/get/" + response.data.resource_id;
        this.postData.media_urls.push({
          url
        });
      } else {
        this.$message.error('图片上传失败');
        fileList.pop();
      }
    },
    handleImageRemove(file, fileList) {
      this.postData.media_urls = fileList;
    },
    beforeImageUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    async handleCircleChange(circleId) {
      await this.checkCircleBanStatus(circleId);
    },
    async checkCircleBanStatus(circleId) {
      try {
        const res = await this.$api.community.getCircleMyStatus({
          circle_id: circleId
        });
        if (res) {
          this.isBanned = res.is_banned;
          this.banInfo = res.ban_info;
          if (this.isBanned) {
            const endTimeText = this.banInfo.end_time ? `，将于 ${new Date(this.banInfo.end_time).toLocaleString()} 解除` : '，永久禁言';
            this.$alert(`您在该圈子中已被禁言${endTimeText}，无法发布帖子`, '禁言提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.postData.circle_id = '';
              }
            });
          }
        }
      } catch (error) {
        console.error('获取禁言状态失败', error);
      }
    },
    submitPost() {
      this.$refs.postForm.validate(async valid => {
        if (valid) {
          if (this.isBanned) {
            this.$message.warning('您已被禁言，无法发布帖子');
            return;
          }
          this.isSubmitting = true;
          try {
            const postPayload = {
              title: this.postData.title.trim(),
              content: this.postData.content.trim(),
              media_urls: this.postData.media_urls.map(f => f.url),
              novel_id: this.postData.novel_id
            };
            if (this.isEdit) {
              await this.$api.community.updatePost({
                post_id: this.postId,
                ...postPayload
              });
            } else {
              postPayload.circle_id = this.postData.circle_id;
              postPayload.type = 0;
              await this.$api.community.createPost(postPayload);
            }
            this.$message.success(this.isEdit ? '编辑成功' : '发布成功，等待审核');
            this.$router.push('/community');
          } catch (error) {
            console.error('提交失败', error);
            this.$message.error(this.isEdit ? '编辑失败，请重试' : '发布失败，请重试');
          } finally {
            this.isSubmitting = false;
          }
        }
      });
    },
    cancel() {
      this.$router.back();
    }
  }
});
// CONCATENATED MODULE: ./pages/community/post/edit.vue?vue&type=script&lang=js
 /* harmony default export */ var post_editvue_type_script_lang_js = (editvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/community/post/edit.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(182)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  post_editvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "032ef9c2",
  "216acf01"
  
)

/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=edit.js.map