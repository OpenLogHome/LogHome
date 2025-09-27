exports.ids = [26];
exports.modules = {

/***/ 133:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(187);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("0a18f48c", content, true, context)
};

/***/ }),

/***/ 186:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_166c886e_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(133);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_166c886e_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_166c886e_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_166c886e_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_166c886e_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 187:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".tags-edit-container[data-v-166c886e]{max-width:800px;margin:20px auto;padding:0 15px}.tags-edit-container .tags-card[data-v-166c886e]{margin-bottom:20px}.tags-edit-container .tags-card .card-header[data-v-166c886e]{display:flex;justify-content:space-between;align-items:center}.tags-edit-container .tags-card h3[data-v-166c886e]{font-size:16px;margin-bottom:15px;color:#947358;font-weight:600}.tags-edit-container .tags-card h3 .tag-count[data-v-166c886e]{font-size:14px;color:#999;font-weight:normal}.tags-edit-container .current-tags[data-v-166c886e],.tags-edit-container .suggested-tags[data-v-166c886e]{margin-bottom:25px}.tags-edit-container .tags-wrapper[data-v-166c886e]{display:flex;flex-wrap:wrap}.tags-edit-container .tags-wrapper .tag-item[data-v-166c886e]{margin-right:10px;margin-bottom:10px;cursor:default}.tags-edit-container .tags-wrapper .suggested-tag[data-v-166c886e]{cursor:pointer}.tags-edit-container .tags-wrapper .add-tag-btn[data-v-166c886e]{margin-bottom:10px}@media(max-width: 768px){.tags-edit-container[data-v-166c886e]{padding:0 10px}.tags-edit-container .el-dialog[data-v-166c886e]{width:90% !important}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 231:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/settings/tags/_id.vue?vue&type=template&id=166c886e&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "tags-edit-container"
  }, [_c('el-card', {
    staticClass: "tags-card"
  }, [_c('div', {
    staticClass: "card-header",
    attrs: {
      "slot": "header"
    },
    slot: "header"
  }, [_c('span', [_vm._v("作品标签")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "text"
    },
    on: {
      "click": _vm.goBack
    }
  }, [_vm._v("返回")])], 1), _vm._v(" "), _c('div', {
    staticClass: "current-tags"
  }, [_c('h3', [_vm._v("当前标签 "), _c('span', {
    staticClass: "tag-count"
  }, [_vm._v("(" + _vm._s(_vm.tags && _vm.tags.length || 0) + "/8)")])]), _vm._v(" "), _c('div', {
    staticClass: "tags-wrapper"
  }, [_vm._l(_vm.tags || [], function (tag) {
    return _c('el-tag', {
      key: tag.tag_id,
      staticClass: "tag-item",
      attrs: {
        "closable": "",
        "type": tag.is_activity_tag ? 'warning' : '',
        "effect": tag.is_suggested ? 'plain' : 'light'
      },
      on: {
        "close": function ($event) {
          return _vm.deleteTag(tag.tag_id);
        }
      }
    }, [_vm._v("\n          " + _vm._s(tag.tag_name) + "\n        ")]);
  }), _vm._v(" "), (_vm.tags && _vm.tags.length || 0) < 8 ? _c('el-button', {
    staticClass: "add-tag-btn",
    attrs: {
      "size": "small",
      "icon": "el-icon-plus"
    },
    on: {
      "click": _vm.showAddTagDialog
    }
  }, [_vm._v("\n          添加标签\n        ")]) : _vm._e()], 2)]), _vm._v(" "), _c('div', {
    staticClass: "suggested-tags"
  }, [_c('h3', [_vm._v("官方标签")]), _vm._v(" "), _c('div', {
    staticClass: "tags-wrapper"
  }, _vm._l(_vm.suggested_tags || [], function (tag) {
    return _c('el-tag', {
      key: tag.tag_id,
      staticClass: "tag-item suggested-tag",
      attrs: {
        "type": tag.is_activity_tag ? 'warning' : '',
        "effect": tag.is_chosen || tag.is_suggested ? 'plain' : 'light'
      },
      on: {
        "click": function ($event) {
          return _vm.dealWithSuggested(tag.tag_id, tag.tag_name, tag.is_chosen);
        }
      }
    }, [_vm._v("\n          " + _vm._s(tag.tag_name) + "\n        ")]);
  }), 1)])]), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "title": "添加标签",
      "visible": _vm.addTagDialogVisible,
      "width": "30%",
      "center": ""
    },
    on: {
      "update:visible": function ($event) {
        _vm.addTagDialogVisible = $event;
      }
    }
  }, [_c('el-input', {
    attrs: {
      "placeholder": "请输入标签名称",
      "maxlength": "15",
      "show-word-limit": ""
    },
    model: {
      value: _vm.newTagName,
      callback: function ($$v) {
        _vm.newTagName = $$v;
      },
      expression: "newTagName"
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "dialog-footer",
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('el-button', {
    on: {
      "click": function ($event) {
        _vm.addTagDialogVisible = false;
      }
    }
  }, [_vm._v("取 消")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.addCustomTag
    }
  }, [_vm._v("确 定")])], 1)], 1)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/write/settings/tags/_id.vue?vue&type=template&id=166c886e&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/settings/tags/_id.vue?vue&type=script&lang=js
/* harmony default export */ var _idvue_type_script_lang_js = ({
  data() {
    return {
      novel_id: null,
      tags: [],
      suggested_tags: [],
      addTagDialogVisible: false,
      newTagName: '',
      loading: false,
      error: null
    };
  },
  async asyncData({
    params,
    $api,
    error
  }) {
    try {
      const novel_id = params.id;
      return {
        novel_id,
        tags: [],
        suggested_tags: []
      };
    } catch (err) {
      error({
        statusCode: 404,
        message: '无法获取作品信息'
      });
    }
  },
  async mounted() {
    try {
      this.loading = true;
      await this.getNovelTags();
      await this.getSuggestedTags();
    } catch (err) {
      this.error = err.message || '加载标签失败';
      this.$message.error(this.error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async getNovelTags() {
      try {
        const response = await this.$api.library.getNovelTags(this.novel_id);
        this.tags = response || [];
        console.log('获取标签成功:', this.tags);
      } catch (error) {
        var _error$response, _error$response$data;
        console.error('获取作品标签失败:', error);
        this.$message.error(((_error$response = error.response) === null || _error$response === void 0 ? void 0 : (_error$response$data = _error$response.data) === null || _error$response$data === void 0 ? void 0 : _error$response$data.msg) || '获取作品标签失败');
        this.tags = [];
        throw error;
      }
    },
    async getSuggestedTags() {
      try {
        const response = await this.$api.library.getSuggestedTags(this.novel_id);
        this.suggested_tags = response || [];
        console.log('获取推荐标签成功:', this.suggested_tags);
      } catch (error) {
        var _error$response2, _error$response2$data;
        console.error('获取推荐标签失败:', error);
        this.$message.error(((_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : (_error$response2$data = _error$response2.data) === null || _error$response2$data === void 0 ? void 0 : _error$response2$data.msg) || '获取推荐标签失败');
        this.suggested_tags = [];
        throw error;
      }
    },
    async deleteTag(tag_id) {
      try {
        await this.$api.library.deleteNovelTag(this.novel_id, tag_id);
        this.$message.success('删除标签成功');
        await this.getNovelTags();
        await this.getSuggestedTags();
      } catch (error) {
        var _error$response3, _error$response3$data;
        this.$message.error(((_error$response3 = error.response) === null || _error$response3 === void 0 ? void 0 : (_error$response3$data = _error$response3.data) === null || _error$response3$data === void 0 ? void 0 : _error$response3$data.msg) || '删除标签失败');
      }
    },
    async addTag(tagName) {
      if (!tagName || tagName.trim() === '') {
        this.$message.warning('标签名称不能为空');
        return;
      }
      try {
        await this.$api.library.addNovelTag(this.novel_id, tagName.trim());
        this.$message.success('添加标签成功');
        this.newTagName = '';
        this.addTagDialogVisible = false;
        await this.getNovelTags();
        await this.getSuggestedTags();
      } catch (error) {
        var _error$response4, _error$response4$data;
        this.$message.error(((_error$response4 = error.response) === null || _error$response4 === void 0 ? void 0 : (_error$response4$data = _error$response4.data) === null || _error$response4$data === void 0 ? void 0 : _error$response4$data.msg) || '添加标签失败');
      }
    },
    showAddTagDialog() {
      this.newTagName = '';
      this.addTagDialogVisible = true;
    },
    addCustomTag() {
      this.addTag(this.newTagName);
    },
    dealWithSuggested(id, name, chosen) {
      const tagsLength = this.tags && this.tags.length || 0;
      if (chosen === true) {
        this.deleteTag(id);
      } else if (chosen === false && tagsLength < 8) {
        this.addTag(name);
      } else if (tagsLength >= 8) {
        this.$message.warning('最多只能使用8个标签');
      }
    },
    goBack() {
      this.$router.push(`/write/settings/${this.novel_id}`);
    }
  }
});
// CONCATENATED MODULE: ./pages/write/settings/tags/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var tags_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/write/settings/tags/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(186)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  tags_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "166c886e",
  "2fd5c4c1"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map