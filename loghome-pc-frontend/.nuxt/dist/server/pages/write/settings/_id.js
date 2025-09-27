exports.ids = [24];
exports.modules = {

/***/ 137:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(195);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("54cd6995", content, true, context)
};

/***/ }),

/***/ 194:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_43268a78_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(137);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_43268a78_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_43268a78_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_43268a78_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_43268a78_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".settings-page[data-v-43268a78]{width:100%;max-width:800px;margin:0 auto;padding:20px}.settings-page .page-header[data-v-43268a78]{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px}.settings-page .page-header .page-title[data-v-43268a78]{font-size:28px;color:#704c35;margin:0}.settings-page .page-header .back-link[data-v-43268a78]{color:#947358;text-decoration:none;font-size:16px}.settings-page .page-header .back-link[data-v-43268a78]:hover{text-decoration:underline}.settings-page .settings-container[data-v-43268a78]{display:flex;flex-direction:column;gap:20px}.settings-page .settings-card[data-v-43268a78]{background-color:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 12px 0 rgba(0,0,0,.1)}.settings-page .settings-card.danger-zone[data-v-43268a78]{border-left:4px solid #f56c6c}.settings-page .settings-section-title[data-v-43268a78]{font-size:18px;color:#704c35;margin:0 0 20px 0;padding-bottom:10px;border-bottom:1px solid #eee}.settings-page .settings-item[data-v-43268a78]{display:flex;align-items:center;padding:15px 0;border-bottom:1px solid #f5f5f5;cursor:pointer;transition:background-color .3s}.settings-page .settings-item[data-v-43268a78]:last-child{border-bottom:none}.settings-page .settings-item[data-v-43268a78]:hover{background-color:#f5f5f5}.settings-page .settings-item.delete-item .settings-label[data-v-43268a78]{color:#f56c6c}.settings-page .settings-label[data-v-43268a78]{flex:1;font-size:16px;color:#333}.settings-page .settings-value[data-v-43268a78]{flex:2;font-size:16px;color:#666;text-align:right;padding-right:10px;overflow:hidden;text-overflow:ellipsis}.settings-page .settings-arrow[data-v-43268a78]{font-size:20px;color:#888;margin-left:10px}.settings-page .tags-container[data-v-43268a78]{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px}.settings-page .tags-container .tag-item[data-v-43268a78]{background-color:#f0f0f0;color:#666;padding:2px 8px;border-radius:4px;font-size:14px}.settings-page .tags-container .tag-item.activity-tag[data-v-43268a78]{background-color:rgba(251,125,70,.2);color:#fb7d46}.settings-page .loading-state[data-v-43268a78]{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.settings-page .loading-state .loading-spinner[data-v-43268a78]{width:50px;height:50px;border:5px solid #f5f5f5;border-top:5px solid #947358;border-radius:50%;margin:0 auto 20px;animation:spin-43268a78 1s linear infinite}.settings-page .loading-state .loading-text[data-v-43268a78]{color:#666}@keyframes spin-43268a78{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.settings-page .error-state[data-v-43268a78]{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.settings-page .error-state .error-icon[data-v-43268a78]{font-size:50px;margin-bottom:20px;color:#e74c3c}.settings-page .error-state .error-title[data-v-43268a78]{font-size:20px;color:#333;margin-bottom:10px}.settings-page .error-state .error-desc[data-v-43268a78]{color:#666;margin-bottom:25px}.settings-page .error-state .error-button[data-v-43268a78]{background-color:#947358;color:#fff;border:none;border-radius:4px;padding:10px 30px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.settings-page .error-state .error-button[data-v-43268a78]:hover{background-color:#704c35}.settings-page .status-options[data-v-43268a78]{display:flex;flex-direction:column;gap:10px}.settings-page .status-options .status-option[data-v-43268a78]{padding:12px 20px;background-color:#f5f5f5;border-radius:4px;cursor:pointer;transition:background-color .3s}.settings-page .status-options .status-option[data-v-43268a78]:hover{background-color:hsl(0,0%,91.0784313725%)}.settings-page .delete-confirm-content[data-v-43268a78]{text-align:center}.settings-page .delete-confirm-content .delete-warning[data-v-43268a78]{color:#f56c6c;font-weight:bold;margin-top:10px}@media(max-width: 768px){.settings-page[data-v-43268a78]{padding:10px}.settings-page .page-header .page-title[data-v-43268a78]{font-size:24px}.settings-page .settings-label[data-v-43268a78],.settings-page .settings-value[data-v-43268a78]{font-size:14px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/settings/_id.vue?vue&type=template&id=43268a78&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "settings-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-43268a78>", "</div>", [_vm._ssrNode("<h1 class=\"page-title\" data-v-43268a78>作品设置</h1> "), _c('nuxt-link', {
    staticClass: "back-link",
    attrs: {
      "to": `/write`
    }
  }, [_vm._v("返回创作中心")])], 2), _vm._ssrNode(" " + (_vm.novel ? "<div class=\"settings-container\" data-v-43268a78><div class=\"settings-card\" data-v-43268a78><h2 class=\"settings-section-title\" data-v-43268a78>基本设置</h2> <div class=\"settings-item\" data-v-43268a78><div class=\"settings-label\" data-v-43268a78>作品状态</div> <div class=\"settings-value\" data-v-43268a78>" + _vm._ssrEscape(_vm._s(_vm.novel.is_personal == 0 ? "公开" : "私密")) + "</div> <div class=\"settings-arrow\" data-v-43268a78>›</div></div> <div class=\"settings-item\" data-v-43268a78><div class=\"settings-label\" data-v-43268a78>更新状态</div> <div class=\"settings-value\" data-v-43268a78>" + _vm._ssrEscape(_vm._s(_vm.novel.is_complete == 0 ? "连载" : "完结")) + "</div> <div class=\"settings-arrow\" data-v-43268a78>›</div></div> <div class=\"settings-item\" data-v-43268a78><div class=\"settings-label\" data-v-43268a78>作品标签</div> <div class=\"settings-value tags-container\" data-v-43268a78>" + (_vm.tags.length === 0 ? "<span data-v-43268a78>无</span>" : "<!---->") + " " + _vm._ssrList(_vm.tags, function (tag) {
    return "<span" + _vm._ssrClass("tag-item", {
      'activity-tag': tag.is_activity_tag
    }) + " data-v-43268a78>" + _vm._ssrEscape("\n            " + _vm._s(tag.tag_name) + "\n          ") + "</span>";
  }) + "</div> <div class=\"settings-arrow\" data-v-43268a78>›</div></div> <div class=\"settings-item\" data-v-43268a78><div class=\"settings-label\" data-v-43268a78>修改作品信息</div> <div class=\"settings-arrow\" data-v-43268a78>›</div></div></div> <div class=\"settings-card danger-zone\" data-v-43268a78><h2 class=\"settings-section-title\" data-v-43268a78>危险操作</h2> <div class=\"settings-item delete-item\" data-v-43268a78><div class=\"settings-label\" data-v-43268a78>删除作品</div> <div class=\"settings-arrow\" data-v-43268a78>›</div></div></div></div>" : "<!---->") + " " + (_vm.loading ? "<div class=\"loading-state\" data-v-43268a78><div class=\"loading-spinner\" data-v-43268a78></div> <p class=\"loading-text\" data-v-43268a78>正在加载作品信息...</p></div>" : _vm.error ? "<div class=\"error-state\" data-v-43268a78><div class=\"error-icon\" data-v-43268a78>❌</div> <h3 class=\"error-title\" data-v-43268a78>加载失败</h3> <p class=\"error-desc\" data-v-43268a78>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button class=\"error-button\" data-v-43268a78>重试</button></div>" : "<!---->") + " "), _c('el-dialog', {
    attrs: {
      "title": _vm.dialogTitle,
      "visible": _vm.dialogVisible,
      "width": "30%",
      "before-close": _vm.handleDialogClose
    },
    on: {
      "update:visible": function ($event) {
        _vm.dialogVisible = $event;
      }
    }
  }, [_c('div', {
    staticClass: "status-options"
  }, _vm._l(_vm.dialogOptions, function (option) {
    return _c('div', {
      key: option.value,
      staticClass: "status-option",
      on: {
        "click": function ($event) {
          return _vm.selectStatus(option.value);
        }
      }
    }, [_vm._v("\n        " + _vm._s(option.label) + "\n      ")]);
  }), 0)]), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "title": "确认删除",
      "visible": _vm.deleteDialogVisible,
      "width": "30%"
    },
    on: {
      "update:visible": function ($event) {
        _vm.deleteDialogVisible = $event;
      }
    }
  }, [_c('div', {
    staticClass: "delete-confirm-content"
  }, [_c('p', [_vm._v("删除后将无法找回，确定继续吗？")]), _vm._v(" "), _c('p', {
    staticClass: "delete-warning"
  }, [_vm._v("（删除作品将消耗50原木）")])]), _vm._v(" "), _c('span', {
    staticClass: "dialog-footer",
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('el-button', {
    on: {
      "click": function ($event) {
        _vm.deleteDialogVisible = false;
      }
    }
  }, [_vm._v("取消")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "danger"
    },
    on: {
      "click": _vm.deleteNovel
    }
  }, [_vm._v("确认删除")])], 1)])], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/write/settings/_id.vue?vue&type=template&id=43268a78&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/settings/_id.vue?vue&type=script&lang=js
/* harmony default export */ var _idvue_type_script_lang_js = ({
  head() {
    return {
      title: '作品设置 - 原木社区'
    };
  },
  data() {
    return {
      novel: null,
      tags: [],
      loading: true,
      error: null,
      dialogVisible: false,
      dialogTitle: '',
      dialogType: '',
      dialogOptions: [],
      deleteDialogVisible: false
    };
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
          this.novel = response[0];
          // 获取作品标签
          await this.fetchNovelTags();
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
    async fetchNovelTags() {
      try {
        const novelId = this.$route.params.id;
        const response = await this.$api.library.getNovelTags(novelId);
        if (response && Array.isArray(response)) {
          this.tags = response;
        }
      } catch (error) {
        console.error('获取作品标签失败:', error);
      }
    },
    showStatusDialog(type) {
      this.dialogType = type;
      if (type === 'personal') {
        this.dialogTitle = '设置作品状态';
        this.dialogOptions = [{
          label: '公开',
          value: 0
        }, {
          label: '私密',
          value: 1
        }];
      } else if (type === 'update') {
        this.dialogTitle = '设置更新状态';
        this.dialogOptions = [{
          label: '连载',
          value: 0
        }, {
          label: '完结',
          value: 1
        }];
      }
      this.dialogVisible = true;
    },
    handleDialogClose() {
      this.dialogVisible = false;
    },
    async selectStatus(value) {
      try {
        const novelId = this.$route.params.id;
        if (this.dialogType === 'personal') {
          await this.$api.essays.setNovelStatus({
            is_personal: value,
            novel_id: novelId
          });
          this.$message.success('作品状态修改成功');
        } else if (this.dialogType === 'update') {
          await this.$api.essays.setNovelUpdateStatus({
            is_complete: value,
            novel_id: novelId
          });
          this.$message.success('更新状态修改成功');
        }

        // 刷新作品数据
        await this.fetchNovelData();
      } catch (error) {
        console.error('修改状态失败:', error);
        this.$message.error('修改状态失败，请稍后重试');
      } finally {
        this.dialogVisible = false;
      }
    },
    goToInfoEdit() {
      this.$router.push(`/write/settings/info/${this.$route.params.id}`);
    },
    goToTagsEdit() {
      this.$router.push(`/write/settings/tags/${this.$route.params.id}`);
    },
    confirmDelete() {
      this.deleteDialogVisible = true;
    },
    async deleteNovel() {
      try {
        const novelId = this.$route.params.id;
        await this.$api.essays.deleteNovel({
          id: novelId
        });
        this.$message.success('作品已删除');

        // 跳转回创作中心
        this.$router.push('/write');
      } catch (error) {
        console.error('删除作品失败:', error);
        this.$message.error('删除作品失败，请稍后重试');
      } finally {
        this.deleteDialogVisible = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/write/settings/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var settings_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/write/settings/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(194)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  settings_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "43268a78",
  "af568440"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map