exports.ids = [20];
exports.modules = {

/***/ 138:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(197);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("0107c8c9", content, true, context)
};

/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_tagId_vue_vue_type_style_index_0_id_30904100_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(138);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_tagId_vue_vue_type_style_index_0_id_30904100_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_tagId_vue_vue_type_style_index_0_id_30904100_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_tagId_vue_vue_type_style_index_0_id_30904100_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_tagId_vue_vue_type_style_index_0_id_30904100_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 197:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".activity-form-page[data-v-30904100]{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:40px 20px}.form-header[data-v-30904100]{width:100%;max-width:600px;display:flex;align-items:center;margin-bottom:32px;padding:20px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.08)}.back-button[data-v-30904100]{background:none;border:none;color:#007bff;cursor:pointer;font-size:16px;margin-right:16px;padding:8px 12px;border-radius:6px;transition:all .2s}.back-button[data-v-30904100]:hover{background:#f8f9fa;transform:translateX(-2px)}.form-title[data-v-30904100]{margin:0;font-size:24px;font-weight:600;color:#333;text-align:center;flex:1}.form-container[data-v-30904100]{width:100%;max-width:600px;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.1);overflow:hidden}.form-content[data-v-30904100]{padding:40px}.form-content .form-fields .form-field[data-v-30904100]{margin-bottom:24px}.form-content .form-fields .field-label[data-v-30904100]{display:block;margin-bottom:8px;font-weight:500;color:#333;font-size:15px}.form-content .form-fields .required-mark[data-v-30904100]{color:#dc3545;margin-left:2px}.form-content .form-fields .form-input[data-v-30904100]{width:100%;padding:14px 16px;border:2px solid #e9ecef;border-radius:8px;font-size:15px;transition:all .3s ease;background:#fafbfc}.form-content .form-fields .form-input[data-v-30904100]:focus{outline:none;border-color:#007bff;background:#fff;box-shadow:0 0 0 3px rgba(0,123,255,.1);transform:translateY(-1px)}.form-content .form-fields .form-input[data-v-30904100]:hover{border-color:#007bff;background:#fff}.form-actions[data-v-30904100]{display:flex;gap:16px;justify-content:center;margin-top:40px;padding-top:32px;border-top:1px solid #e9ecef}.cancel-button[data-v-30904100],.submit-button[data-v-30904100]{padding:12px 32px;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;transition:all .3s ease;min-width:120px}.cancel-button[data-v-30904100]{background:#fff;border:2px solid #e9ecef;color:#666}.cancel-button[data-v-30904100]:hover{background:#f8f9fa;border-color:#007bff;color:#007bff;transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.1)}.submit-button[data-v-30904100]{background:linear-gradient(135deg, #007bff 0%, #0056b3 100%);border:2px solid #007bff;color:#fff}.submit-button[data-v-30904100]:hover:not(:disabled){background:linear-gradient(135deg, #0056b3 0%, #004085 100%);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,123,255,.3)}.submit-button[data-v-30904100]:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}.loading-state[data-v-30904100],.error-state[data-v-30904100]{width:100%;max-width:600px;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.1);text-align:center;padding:80px 40px}.loading-spinner[data-v-30904100]{width:48px;height:48px;border:4px solid #f3f3f3;border-top:4px solid #007bff;border-radius:50%;animation:spin-30904100 1s linear infinite;margin:0 auto 24px}@keyframes spin-30904100{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.loading-state p[data-v-30904100]{color:#666;font-size:16px;margin:0}.error-icon[data-v-30904100]{font-size:64px;margin-bottom:24px}.error-state h3[data-v-30904100]{margin:0 0 12px 0;color:#333;font-size:20px}.error-state p[data-v-30904100]{margin:0 0 24px 0;color:#666;font-size:16px}.error-state button[data-v-30904100]{padding:12px 24px;background:linear-gradient(135deg, #007bff 0%, #0056b3 100%);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:15px;font-weight:500;transition:all .3s ease}.error-state button[data-v-30904100]:hover{background:linear-gradient(135deg, #0056b3 0%, #004085 100%);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,123,255,.3)}@media(max-width: 768px){.activity-form-page[data-v-30904100]{padding:20px 16px}.form-header[data-v-30904100]{padding:16px;margin-bottom:24px}.form-title[data-v-30904100]{font-size:20px}.form-content[data-v-30904100]{padding:24px}.form-actions[data-v-30904100]{flex-direction:column;gap:12px}.cancel-button[data-v-30904100],.submit-button[data-v-30904100]{width:100%}.loading-state[data-v-30904100],.error-state[data-v-30904100]{padding:60px 24px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 236:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/activity-form/_workId/_tagId.vue?vue&type=template&id=30904100&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "activity-form-page"
  }, [_vm._ssrNode("<div class=\"form-header\" data-v-30904100><button class=\"back-button\" data-v-30904100>返回</button> <h1 class=\"form-title\" data-v-30904100>" + _vm._ssrEscape(_vm._s(_vm.currentActivity ? _vm.currentActivity.activity_name : '活动信息填写')) + "</h1></div> " + (_vm.currentActivity && _vm.currentActivity.required_fields ? "<div class=\"form-container\" data-v-30904100><div class=\"form-content\" data-v-30904100><div class=\"form-fields\" data-v-30904100>" + _vm._ssrList(_vm.currentActivity.required_fields, function (field) {
    return "<div class=\"form-field\" data-v-30904100><label class=\"field-label\" data-v-30904100>" + _vm._ssrEscape("\n            " + _vm._s(field.name) + "\n            ") + (field.required ? "<span class=\"required-mark\" data-v-30904100>*</span>" : "<!---->") + "</label> <input" + _vm._ssrAttr("placeholder", field.placeholder || '请输入' + field.name) + _vm._ssrAttr("maxlength", field.maxLength) + _vm._ssrAttr("value", _vm.activityFormData[field.name]) + " class=\"form-input\" data-v-30904100></div>";
  }) + "</div> <div class=\"form-actions\" data-v-30904100><button type=\"button\" class=\"cancel-button\" data-v-30904100>取消</button> <button type=\"button\"" + _vm._ssrAttr("disabled", _vm.submitting) + " class=\"submit-button\" data-v-30904100>" + _vm._ssrEscape("\n          " + _vm._s(_vm.submitting ? '提交中...' : '提交') + "\n        ") + "</button></div></div></div>" : _vm.loading ? "<div class=\"loading-state\" data-v-30904100><div class=\"loading-spinner\" data-v-30904100></div> <p data-v-30904100>正在加载活动信息...</p></div>" : _vm.error ? "<div class=\"error-state\" data-v-30904100><div class=\"error-icon\" data-v-30904100>❌</div> <h3 data-v-30904100>加载失败</h3> <p data-v-30904100>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button data-v-30904100>重试</button></div>" : "<!---->"))]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/write/activity-form/_workId/_tagId.vue?vue&type=template&id=30904100&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/activity-form/_workId/_tagId.vue?vue&type=script&lang=js
/* harmony default export */ var _tagIdvue_type_script_lang_js = ({
  name: 'ActivityForm',
  data() {
    return {
      currentActivity: null,
      activityFormData: {},
      loading: true,
      error: null,
      submitting: false
    };
  },
  async mounted() {
    await this.loadActivityInfo();
  },
  methods: {
    async loadActivityInfo() {
      try {
        this.loading = true;
        this.error = null;
        const workId = this.$route.params.workId;
        const tagId = this.$route.params.tagId;
        const response = await this.$api.essays.getNovelActivity(workId);
        if (response) {
          const activity = response.activities.find(a => a.tag_id == tagId);
          if (activity) {
            this.currentActivity = activity;
            // 如果已有填写的数据，预填充表单
            if (response.userInfo && response.userInfo.length > 0) {
              const existingInfo = response.userInfo.find(info => info.tag_id == tagId);
              if (existingInfo) {
                try {
                  this.activityFormData = existingInfo.information_data ? JSON.parse(existingInfo.information_data) : {};
                } catch (e) {
                  console.error('解析已填写的表单数据失败:', e);
                  this.activityFormData = {};
                }
              } else {
                this.activityFormData = {};
              }
            } else {
              this.activityFormData = {};
            }
          } else {
            this.error = '未找到对应的活动信息';
          }
        } else {
          this.error = '加载活动信息失败';
        }
      } catch (error) {
        console.error('加载活动信息失败:', error);
        this.error = '网络错误，请重试';
      } finally {
        this.loading = false;
      }
    },
    async submitActivityForm() {
      try {
        var _this$currentActivity;
        // 验证必填字段
        if ((_this$currentActivity = this.currentActivity) !== null && _this$currentActivity !== void 0 && _this$currentActivity.required_fields) {
          for (const field of this.currentActivity.required_fields) {
            if (field.required && (!this.activityFormData[field.name] || this.activityFormData[field.name].toString().trim() === '')) {
              this.$message.error(`请填写${field.name}`);
              return;
            }
          }
        }
        this.submitting = true;
        const workId = this.$route.params.workId;
        const tagId = this.$route.params.tagId;
        const response = await this.$api.essays.submitActivityInfo(workId, tagId, this.activityFormData);
        if (response.success === true) {
          this.$message.success('提交成功！');
          this.goBack();
        } else {
          this.$message.error(response.message || '提交失败，请重试');
        }
      } catch (error) {
        console.error('提交表单失败:', error);
        this.$message.error('网络错误，请重试');
      } finally {
        this.submitting = false;
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
});
// CONCATENATED MODULE: ./pages/write/activity-form/_workId/_tagId.vue?vue&type=script&lang=js
 /* harmony default export */ var _workId_tagIdvue_type_script_lang_js = (_tagIdvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/write/activity-form/_workId/_tagId.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(196)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  _workId_tagIdvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "30904100",
  "f6359640"
  
)

/* harmony default export */ var _tagId = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_tagId.js.map