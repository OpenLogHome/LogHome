exports.ids = [24];
exports.modules = {

/***/ 129:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(184);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("0019bd7d", content, true, context)
};

/***/ }),

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_new_vue_vue_type_style_index_0_id_a41543ac_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(129);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_new_vue_vue_type_style_index_0_id_a41543ac_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_new_vue_vue_type_style_index_0_id_a41543ac_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_new_vue_vue_type_style_index_0_id_a41543ac_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_new_vue_vue_type_style_index_0_id_a41543ac_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 184:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".new-work-page[data-v-a41543ac]{width:100%}.new-work-page .page-header[data-v-a41543ac]{margin-bottom:30px}.new-work-page .page-title[data-v-a41543ac]{font-size:32px;color:#704c35}.new-work-page .form-container[data-v-a41543ac]{display:grid;grid-template-columns:1fr 300px;gap:30px}.new-work-page .form-section[data-v-a41543ac]{background-color:#fff;border-radius:8px;padding:30px;box-shadow:0 2px 4px rgba(0,0,0,.1)}.new-work-page .form-group[data-v-a41543ac]{margin-bottom:25px}.new-work-page .form-label[data-v-a41543ac]{display:block;font-size:16px;font-weight:600;color:#333;margin-bottom:8px}.new-work-page .form-input[data-v-a41543ac],.new-work-page .form-textarea[data-v-a41543ac]{width:100%;padding:12px 15px;border:1px solid #eee;border-radius:4px;font-size:16px;color:#333;transition:border-color .3s ease}.new-work-page .form-input[data-v-a41543ac]:focus,.new-work-page .form-textarea[data-v-a41543ac]:focus{outline:none;border-color:#947358}.new-work-page .form-textarea[data-v-a41543ac]{resize:vertical;min-height:120px}.new-work-page .word-count[data-v-a41543ac]{text-align:right;font-size:14px;color:#888;margin-top:5px}.new-work-page .tags-select[data-v-a41543ac]{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}.new-work-page .tag-item[data-v-a41543ac]{padding:8px 15px;background-color:#f5f5f5;border-radius:4px;font-size:14px;color:#333;cursor:pointer;transition:all .3s ease;position:relative}.new-work-page .tag-item[data-v-a41543ac]:hover{background-color:hsl(0,0%,91.0784313725%)}.new-work-page .tag-item.selected[data-v-a41543ac]{background-color:hsl(18.2320441989,95.7671957672%,87.9411764706%);color:#fa6c2e;border:1px solid #fb7d46}.new-work-page .tag-item .activity-badge[data-v-a41543ac]{position:absolute;top:-8px;right:-8px;background-color:#fb7d46;color:#fff;font-size:12px;padding:2px 6px;border-radius:10px}.new-work-page .no-tags[data-v-a41543ac]{width:100%;padding:20px;text-align:center;color:#888;background-color:#f5f5f5;border-radius:4px}.new-work-page .agreement-group[data-v-a41543ac]{margin-top:30px}.new-work-page .checkbox-container[data-v-a41543ac]{display:flex;align-items:center;position:relative;padding-left:30px;cursor:pointer;font-size:16px;user-select:none}.new-work-page .checkbox-container input[data-v-a41543ac]{position:absolute;opacity:0;cursor:pointer;height:0;width:0}.new-work-page .checkbox-container .checkmark[data-v-a41543ac]{position:absolute;top:0;left:0;height:20px;width:20px;background-color:#f5f5f5;border:1px solid #eee;border-radius:3px}.new-work-page .checkbox-container:hover input~.checkmark[data-v-a41543ac]{background-color:hsl(0,0%,91.0784313725%)}.new-work-page .checkbox-container input:checked~.checkmark[data-v-a41543ac]{background-color:#fb7d46;border-color:#fb7d46}.new-work-page .checkbox-container .checkmark[data-v-a41543ac]:after{content:\"\";position:absolute;display:none}.new-work-page .checkbox-container input:checked~.checkmark[data-v-a41543ac]:after{display:block}.new-work-page .checkbox-container .checkmark[data-v-a41543ac]:after{left:7px;top:3px;width:5px;height:10px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg)}.new-work-page .agreement-text[data-v-a41543ac]{font-size:15px;color:#333}.new-work-page .agreement-link[data-v-a41543ac]{color:#fb7d46;text-decoration:none}.new-work-page .agreement-link[data-v-a41543ac]:hover{text-decoration:underline}.new-work-page .form-actions[data-v-a41543ac]{display:flex;justify-content:flex-end;gap:15px;margin-top:30px}.new-work-page .cancel-button[data-v-a41543ac],.new-work-page .submit-button[data-v-a41543ac]{padding:12px 25px;border-radius:4px;font-size:16px;font-weight:600;cursor:pointer;transition:all .3s ease}.new-work-page .cancel-button[data-v-a41543ac]{background-color:#f5f5f5;color:#333;border:none}.new-work-page .cancel-button[data-v-a41543ac]:hover{background-color:hsl(0,0%,91.0784313725%)}.new-work-page .submit-button[data-v-a41543ac]{background-color:#fb7d46;color:#fff;border:none}.new-work-page .submit-button[data-v-a41543ac]:hover{background-color:#fa6c2e}.new-work-page .submit-button[data-v-a41543ac]:disabled{background-color:hsl(18.2320441989,95.7671957672%,82.9411764706%);cursor:not-allowed}.new-work-page .sidebar-section[data-v-a41543ac]{background-color:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 4px rgba(0,0,0,.1)}.new-work-page .sidebar-title[data-v-a41543ac]{font-size:18px;color:#704c35;margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid #eee}.new-work-page .tips-list[data-v-a41543ac]{list-style:none;padding:0;margin:0}.new-work-page .tip-item[data-v-a41543ac]{position:relative;padding:10px 0 10px 25px;border-bottom:1px solid #f5f5f5;color:#666;font-size:14px;line-height:1.5}.new-work-page .tip-item[data-v-a41543ac]:last-child{border-bottom:none}.new-work-page .tip-item[data-v-a41543ac]:before{content:\"\";position:absolute;left:0;top:14px;width:6px;height:6px;border-radius:50%;background-color:#fb7d46}@media(max-width: 992px){.new-work-page .form-container[data-v-a41543ac]{grid-template-columns:1fr}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/new.vue?vue&type=template&id=a41543ac&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "new-work-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-a41543ac><h1 class=\"page-title\" data-v-a41543ac>创建新作品</h1></div> "), _vm._ssrNode("<div class=\"form-container\" data-v-a41543ac>", "</div>", [_vm._ssrNode("<div class=\"form-section\" data-v-a41543ac>", "</div>", [_vm._ssrNode("<div class=\"form-group\" data-v-a41543ac><label class=\"form-label\" data-v-a41543ac>作品名称</label> <input type=\"text\" placeholder=\"请输入作品名称（不超过15个字符）\" maxlength=\"15\"" + _vm._ssrAttr("value", _vm.title) + " class=\"form-input\" data-v-a41543ac> <div class=\"word-count\" data-v-a41543ac>" + _vm._ssrEscape(_vm._s(_vm.title.length) + "/15") + "</div></div> <div class=\"form-group\" data-v-a41543ac><label class=\"form-label\" data-v-a41543ac>作品简介</label> <textarea placeholder=\"请输入作品简介（不超过300个字符）\" maxlength=\"300\" rows=\"4\" class=\"form-textarea\" data-v-a41543ac>" + _vm._ssrEscape(_vm._s(_vm.content)) + "</textarea> <div class=\"word-count\" data-v-a41543ac>" + _vm._ssrEscape(_vm._s(_vm.content.length) + "/300") + "</div></div> <div class=\"form-group\" data-v-a41543ac><label class=\"form-label\" data-v-a41543ac>选择标签</label> <div class=\"tags-select\" data-v-a41543ac>" + _vm._ssrList(_vm.suggested_tags, function (tag) {
    return "<div" + _vm._ssrClass("tag-item", {
      'selected': _vm.selectedTags.includes(tag.tag_name)
    }) + " data-v-a41543ac>" + _vm._ssrEscape("\n            " + _vm._s(tag.tag_name) + "\n            ") + (tag.is_activity_tag ? "<span class=\"activity-badge\" data-v-a41543ac>活动</span>" : "<!---->") + "</div>";
  }) + " " + (!_vm.suggested_tags.length ? "<div class=\"no-tags\" data-v-a41543ac>暂无推荐标签</div>" : "<!---->") + "</div></div> "), _vm._ssrNode("<div class=\"form-group agreement-group\" data-v-a41543ac>", "</div>", [_vm._ssrNode("<label class=\"checkbox-container\" data-v-a41543ac>", "</label>", [_vm._ssrNode("<input type=\"checkbox\"" + _vm._ssrAttr("checked", Array.isArray(_vm.checked) ? _vm._i(_vm.checked, null) > -1 : _vm.checked) + " data-v-a41543ac> <span class=\"checkmark\" data-v-a41543ac></span> "), _vm._ssrNode("<span class=\"agreement-text\" data-v-a41543ac>", "</span>", [_vm._ssrNode("我已经阅读并接受\n            "), _c('nuxt-link', {
    staticClass: "agreement-link",
    attrs: {
      "to": "/agreement/content"
    }
  }, [_vm._v("《原木社区用户内容上传协议》")])], 2)], 2)]), _vm._ssrNode(" <div class=\"form-actions\" data-v-a41543ac><button class=\"cancel-button\" data-v-a41543ac>取消</button> <button" + _vm._ssrAttr("disabled", _vm.isSubmitting) + " class=\"submit-button\" data-v-a41543ac>" + _vm._ssrEscape(_vm._s(_vm.isSubmitting ? '创建中...' : '创建作品')) + "</button></div>")], 2), _vm._ssrNode(" <div class=\"sidebar\" data-v-a41543ac><div class=\"sidebar-section\" data-v-a41543ac><h3 class=\"sidebar-title\" data-v-a41543ac>创作提示</h3> <ul class=\"tips-list\" data-v-a41543ac><li class=\"tip-item\" data-v-a41543ac>作品名称简洁明了，容易记忆</li> <li class=\"tip-item\" data-v-a41543ac>作品简介应当概括故事核心，吸引读者</li> <li class=\"tip-item\" data-v-a41543ac>选择合适的标签有助于读者发现您的作品</li> <li class=\"tip-item\" data-v-a41543ac>创建后可以在设置中修改作品信息</li></ul></div></div>")], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/write/new.vue?vue&type=template&id=a41543ac&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/new.vue?vue&type=script&lang=js
/* harmony default export */ var newvue_type_script_lang_js = ({
  head() {
    return {
      title: '创建新作品 - 原木社区'
    };
  },
  data() {
    return {
      title: '',
      content: '',
      checked: false,
      isSubmitting: false,
      suggested_tags: [],
      selectedTags: [],
      novel_id: 0 // 临时ID，用于获取推荐标签
    };
  },
  mounted() {
    this.getSuggestedTags();
  },
  methods: {
    async getSuggestedTags() {
      try {
        // 由于获取推荐标签需要novel_id，这里使用0作为临时ID
        // 实际使用时可能需要调整后端API以支持不需要novel_id的情况
        const response = await this.$api.library.getSuggestedTags(this.novel_id);
        this.suggested_tags = response || [];

        // 过滤出活动标签
        if (this.suggested_tags.length > 0) {
          this.suggested_tags = this.suggested_tags.filter(tag => tag.is_activity_tag);
        }
      } catch (error) {
        console.error('获取推荐标签失败:', error);
        this.$notify.error({
          title: '错误',
          message: '获取推荐标签失败'
        });
        this.suggested_tags = [];
      }
    },
    toggleTag(tagName) {
      if (this.selectedTags.includes(tagName)) {
        this.selectedTags = this.selectedTags.filter(tag => tag !== tagName);
      } else {
        this.selectedTags.push(tagName);
      }
    },
    // 添加标签到小说
    async addTag(novelId, tagName) {
      if (tagName.trim() === '') return;
      try {
        await this.$api.library.addNovelTag(novelId, tagName);
      } catch (error) {
        console.error('添加标签失败:', error);
        this.$notify.error({
          title: '错误',
          message: '添加标签失败: ' + (error.message || '未知错误')
        });
      }
    },
    async submit() {
      // 表单验证
      if (!this.checked) {
        this.$notify.warning({
          title: '提示',
          message: '请先阅读并接受《原木社区用户内容上传协议》'
        });
        return;
      }
      if (!this.title.trim()) {
        this.$notify.warning({
          title: '提示',
          message: '请输入作品名称'
        });
        return;
      }
      if (!this.content.trim()) {
        this.$notify.warning({
          title: '提示',
          message: '请输入作品简介'
        });
        return;
      }

      // 防止重复提交
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      try {
        // 创建新作品
        const response = await this.$api.essays.addNovel(this.title.trim(), this.content.trim());

        // 添加标签
        if (this.selectedTags.length > 0 && response && response.insertId) {
          const novelId = response.insertId;
          for (const tagName of this.selectedTags) {
            await this.addTag(novelId, tagName);
          }
        }
        this.$notify.success({
          title: '成功',
          message: '作品创建成功'
        });

        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          this.$router.push('/write');
        }, 1500);
      } catch (error) {
        console.error('创建作品失败:', error);
        this.$notify.error({
          title: '错误',
          message: '创建作品失败: ' + (error.message || '未知错误')
        });
      } finally {
        this.isSubmitting = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/write/new.vue?vue&type=script&lang=js
 /* harmony default export */ var write_newvue_type_script_lang_js = (newvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/write/new.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(183)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  write_newvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "a41543ac",
  "fb606612"
  
)

/* harmony default export */ var write_new = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=new.js.map