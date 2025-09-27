exports.ids = [21];
exports.modules = {

/***/ 136:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(193);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("4cea0ea6", content, true, context)
};

/***/ }),

/***/ 192:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_03c3e330_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(136);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_03c3e330_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_03c3e330_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_03c3e330_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_03c3e330_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 193:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".write-edit-page[data-v-03c3e330]{width:100%;min-height:100vh;background-color:#fafafa;display:flex;flex-direction:column}.write-edit-page .edit-container[data-v-03c3e330]{flex:1;max-width:2400px;width:100%;display:flex;flex-direction:column}.write-edit-page .edit-container .split-layout[data-v-03c3e330]{display:flex;height:100%;min-height:100vh;flex:1}.write-edit-page .edit-container .left-panel[data-v-03c3e330]{flex:0 0 auto;background-color:#fff;display:flex;flex-direction:column;overflow:hidden}.write-edit-page .edit-container .resize-handle[data-v-03c3e330]{width:4px;background-color:#ddd;cursor:col-resize;transition:background-color .2s ease}.write-edit-page .edit-container .resize-handle[data-v-03c3e330]:hover{background-color:#947358}.write-edit-page .edit-container .expand-button[data-v-03c3e330]{width:13px;height:100vh;background-color:#ddd;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background-color .2s ease}.write-edit-page .edit-container .expand-button svg[data-v-03c3e330]{width:16px;height:16px;color:#fff}.write-edit-page .edit-container .expand-button[data-v-03c3e330]:hover{background-color:#704c35}.write-edit-page .edit-container .drag-overlay[data-v-03c3e330]{position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;cursor:col-resize}.write-edit-page .edit-container .right-panel[data-v-03c3e330]{flex:1;background-color:#fff;display:flex;flex-direction:column;overflow:hidden}.write-edit-page .edit-container .micro-app-container[data-v-03c3e330]{flex:1;position:relative;overflow:hidden}.write-edit-page .edit-container .micro-app-container .mobile-iframe[data-v-03c3e330]{width:100%;height:100%;border:none;display:block}.write-edit-page .edit-container .micro-app-container .loading-container[data-v-03c3e330]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%}.write-edit-page .edit-container .micro-app-container .loading-container .loading-spinner[data-v-03c3e330]{width:40px;height:40px;border:4px solid #f5f5f5;border-top:4px solid #947358;border-radius:50%;animation:spin-03c3e330 1s linear infinite;margin-bottom:16px}.write-edit-page .edit-container .micro-app-container .loading-container .loading-text[data-v-03c3e330]{color:#666;font-size:14px;margin:0}.write-edit-page .edit-container .editor-container[data-v-03c3e330]{flex:1;display:flex;flex-direction:column;overflow:hidden}.write-edit-page .edit-container .editor-container .editor-header[data-v-03c3e330]{display:flex;align-items:center;justify-content:space-between;padding:3px 20px;background-color:#f5f5f5;border-bottom:1px solid #eee}.write-edit-page .edit-container .editor-container .editor-header .editor-title[data-v-03c3e330]{display:flex;align-items:center;gap:8px}.write-edit-page .edit-container .editor-container .editor-header .editor-title .editor-icon[data-v-03c3e330]{font-size:18px}.write-edit-page .edit-container .editor-container .editor-header .editor-title .title-text[data-v-03c3e330]{font-size:16px;font-weight:600;color:#333}.write-edit-page .edit-container .editor-container .editor-header .editor-title .article-type-tag[data-v-03c3e330]{background-color:#947358;color:#fff;padding:2px 8px;border-radius:12px;font-size:12px;font-weight:500}.write-edit-page .edit-container .editor-container .editor-header .close-editor-btn[data-v-03c3e330]{width:32px;height:32px;border:none;background-color:rgba(0,0,0,0);cursor:pointer;border-radius:4px;display:flex;align-items:center;justify-content:center;transition:background-color .2s ease}.write-edit-page .edit-container .editor-container .editor-header .close-editor-btn svg[data-v-03c3e330]{width:18px;height:18px;color:#666}.write-edit-page .edit-container .editor-container .editor-header .close-editor-btn[data-v-03c3e330]:hover{background-color:#eee}.write-edit-page .edit-container .editor-container .editor-iframe[data-v-03c3e330]{flex:1;width:100%;border:none;display:block}.write-edit-page .edit-container .empty-content[data-v-03c3e330]{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;text-align:center}.write-edit-page .edit-container .empty-content .empty-icon[data-v-03c3e330]{font-size:64px;margin-bottom:20px;opacity:.6}.write-edit-page .edit-container .empty-content .empty-title[data-v-03c3e330]{font-size:20px;font-weight:600;color:#333;margin:0 0 12px 0}.write-edit-page .edit-container .empty-content .empty-desc[data-v-03c3e330]{font-size:16px;color:#666;margin:0;line-height:1.6}.write-edit-page .edit-container .work-info[data-v-03c3e330]{background-color:#fff;border-radius:8px;padding:30px;box-shadow:0 2px 8px rgba(0,0,0,.1)}.write-edit-page .edit-container .work-info .work-id-display[data-v-03c3e330]{color:#666;font-size:14px;margin-bottom:30px;padding:10px 15px;background-color:#f5f5f5;border-radius:4px;border-left:3px solid #947358}.write-edit-page .edit-container .work-info .placeholder-content[data-v-03c3e330]{text-align:center;padding:60px 20px}.write-edit-page .edit-container .work-info .placeholder-content .placeholder-icon[data-v-03c3e330]{font-size:64px;margin-bottom:20px}.write-edit-page .edit-container .work-info .placeholder-content .placeholder-title[data-v-03c3e330]{font-size:24px;color:#333;margin-bottom:15px;font-weight:600}.write-edit-page .edit-container .work-info .placeholder-content .placeholder-desc[data-v-03c3e330]{color:#666;font-size:16px;line-height:1.6}.write-edit-page .edit-container .loading-state[data-v-03c3e330]{background-color:#fff;border-radius:8px;padding:60px 30px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.1);margin:auto;max-width:500px}.write-edit-page .edit-container .loading-state .loading-spinner[data-v-03c3e330]{width:40px;height:40px;border:4px solid #f5f5f5;border-top:4px solid #947358;border-radius:50%;animation:spin-03c3e330 1s linear infinite;margin:0 auto 20px auto}.write-edit-page .edit-container .loading-state .loading-text[data-v-03c3e330]{color:#666;font-size:16px;margin:0;line-height:1.6}.write-edit-page .edit-container .error-state[data-v-03c3e330]{background-color:#fff;border-radius:8px;padding:60px 30px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.1);margin:auto;max-width:500px}.write-edit-page .edit-container .error-state .error-icon[data-v-03c3e330]{font-size:64px;margin-bottom:20px}.write-edit-page .edit-container .error-state .error-title[data-v-03c3e330]{font-size:24px;color:#333;margin-bottom:15px;font-weight:600}.write-edit-page .edit-container .error-state .error-desc[data-v-03c3e330]{color:#666;font-size:16px;margin-bottom:30px;line-height:1.6}.write-edit-page .edit-container .error-state .error-button[data-v-03c3e330]{background-color:#947358;color:#fff;border:none;border-radius:6px;padding:12px 24px;font-size:16px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.write-edit-page .edit-container .error-state .error-button[data-v-03c3e330]:hover{background-color:#704c35}@keyframes spin-03c3e330{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@media(max-width: 1024px){.write-edit-page .edit-container .split-layout[data-v-03c3e330]{flex-direction:column}.write-edit-page .edit-container .resize-handle[data-v-03c3e330]{display:none}.write-edit-page .edit-container .left-panel[data-v-03c3e330],.write-edit-page .edit-container .right-panel[data-v-03c3e330]{min-height:400px}}@media(max-width: 768px){.write-edit-page .edit-container[data-v-03c3e330]{padding:15px}.write-edit-page .edit-container .split-layout[data-v-03c3e330]{flex-direction:column}.write-edit-page .edit-container .resize-handle[data-v-03c3e330]{display:none}.write-edit-page .edit-container .empty-content[data-v-03c3e330]{padding:40px 15px}.write-edit-page .edit-container .empty-content .empty-icon[data-v-03c3e330]{font-size:48px}.write-edit-page .edit-container .empty-content .empty-title[data-v-03c3e330]{font-size:18px}.write-edit-page .edit-container .work-info[data-v-03c3e330],.write-edit-page .edit-container .loading-state[data-v-03c3e330],.write-edit-page .edit-container .error-state[data-v-03c3e330]{padding:30px 20px}.write-edit-page .edit-container .work-info .placeholder-content[data-v-03c3e330],.write-edit-page .edit-container .loading-state .placeholder-content[data-v-03c3e330],.write-edit-page .edit-container .error-state .placeholder-content[data-v-03c3e330]{padding:40px 15px}.write-edit-page .edit-container .work-info .placeholder-content .placeholder-icon[data-v-03c3e330],.write-edit-page .edit-container .loading-state .placeholder-content .placeholder-icon[data-v-03c3e330],.write-edit-page .edit-container .error-state .placeholder-content .placeholder-icon[data-v-03c3e330]{font-size:48px}.write-edit-page .edit-container .work-info .placeholder-content .placeholder-title[data-v-03c3e330],.write-edit-page .edit-container .loading-state .placeholder-content .placeholder-title[data-v-03c3e330],.write-edit-page .edit-container .error-state .placeholder-content .placeholder-title[data-v-03c3e330]{font-size:20px}.write-edit-page .edit-container .work-info .placeholder-content .placeholder-desc[data-v-03c3e330],.write-edit-page .edit-container .loading-state .placeholder-content .placeholder-desc[data-v-03c3e330],.write-edit-page .edit-container .error-state .placeholder-content .placeholder-desc[data-v-03c3e330]{font-size:14px}.write-edit-page .edit-container .loading-state[data-v-03c3e330]{padding:40px 20px}.write-edit-page .edit-container .loading-state .loading-spinner[data-v-03c3e330]{width:32px;height:32px}.write-edit-page .edit-container .loading-state .loading-text[data-v-03c3e330]{font-size:14px}.write-edit-page .edit-container .error-state[data-v-03c3e330]{padding:40px 20px}.write-edit-page .edit-container .error-state .error-icon[data-v-03c3e330]{font-size:48px}.write-edit-page .edit-container .error-state .error-title[data-v-03c3e330]{font-size:20px}.write-edit-page .edit-container .error-state .error-desc[data-v-03c3e330]{font-size:14px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/edit/_id.vue?vue&type=template&id=03c3e330&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "write-edit-page"
  }, [_vm._ssrNode("<div class=\"edit-container\" data-v-03c3e330>" + (_vm.isInitializing ? "<div class=\"loading-state\" data-v-03c3e330><div class=\"loading-spinner\" data-v-03c3e330></div> <p class=\"loading-text\" data-v-03c3e330>正在初始化编辑器...</p></div>" : !_vm.workId ? "<div class=\"error-state\" data-v-03c3e330><div class=\"error-icon\" data-v-03c3e330>❌</div> <h3 class=\"error-title\" data-v-03c3e330>无效的作品</h3> <p class=\"error-desc\" data-v-03c3e330>未能获取到有效的作品，请返回重新选择作品</p> <button class=\"error-button\" data-v-03c3e330>返回作品列表</button></div>" : "<div class=\"split-layout\" data-v-03c3e330><div class=\"left-panel\"" + _vm._ssrStyle(null, {
    width: _vm.leftPanelWidth + 'px'
  }, {
    display: !_vm.isLeftPanelHidden ? '' : 'none'
  }) + " data-v-03c3e330><div class=\"micro-app-container\" data-v-03c3e330>" + (_vm.panelUrl ? "<iframe" + _vm._ssrAttr("src", _vm.panelUrl) + " frameborder=\"0\" class=\"mobile-iframe\" data-v-03c3e330></iframe>" : "<div class=\"loading-container\" data-v-03c3e330><div class=\"loading-spinner\" data-v-03c3e330></div> <p class=\"loading-text\" data-v-03c3e330>正在加载编辑器...</p></div>") + "</div></div> <div class=\"resize-handle\"" + _vm._ssrStyle(null, null, {
    display: !_vm.isLeftPanelHidden ? '' : 'none'
  }) + " data-v-03c3e330></div> <div class=\"expand-button\"" + _vm._ssrStyle(null, null, {
    display: _vm.isLeftPanelHidden ? '' : 'none'
  }) + " data-v-03c3e330><svg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" data-v-03c3e330><path d=\"M9 18L15 12L9 6\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" data-v-03c3e330></path></svg></div> <div class=\"right-panel\" data-v-03c3e330>" + (_vm.rightPanelContent === 'editor' ? "<div class=\"editor-container\" data-v-03c3e330><div class=\"editor-header\" data-v-03c3e330><div class=\"editor-title\" data-v-03c3e330><span class=\"title-text\" data-v-03c3e330>" + _vm._ssrEscape(_vm._s(_vm.currentEditingArticle ? _vm.currentEditingArticle.title : '编辑器')) + "</span> " + (_vm.currentEditingArticle ? "<span class=\"article-type-tag\" data-v-03c3e330>" + _vm._ssrEscape("\n                " + _vm._s(_vm.getArticleTypeLabel(_vm.currentEditingArticle.article_type)) + "\n              ") + "</span>" : "<!---->") + "</div> <button class=\"close-editor-btn\" data-v-03c3e330><svg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" data-v-03c3e330><path d=\"M18 6L6 18M6 6L18 18\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" data-v-03c3e330></path></svg></button></div> <iframe frameborder=\"0\" class=\"editor-iframe\" data-v-03c3e330></iframe></div>" : "<div class=\"empty-content\" data-v-03c3e330><div class=\"empty-icon\" data-v-03c3e330>📝</div> <h4 class=\"empty-title\" data-v-03c3e330>选择文章开始编辑</h4> <p class=\"empty-desc\" data-v-03c3e330>在左侧选择要编辑的文章，编辑器将在此处显示</p></div>") + "</div> <div class=\"drag-overlay\"" + _vm._ssrStyle(null, null, {
    display: _vm.isResizing ? '' : 'none'
  }) + " data-v-03c3e330></div></div>") + "</div>")]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/write/edit/_id.vue?vue&type=template&id=03c3e330&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/edit/_id.vue?vue&type=script&lang=js
/* harmony default export */ var _idvue_type_script_lang_js = ({
  layout: 'empty',
  head() {
    return {
      title: `写作编辑器 - 原木社区`
    };
  },
  data() {
    return {
      workId: null,
      token: null,
      panelUrl: '',
      microAppData: {},
      leftPanelWidth: 400,
      isResizing: false,
      startX: 0,
      startWidth: 0,
      isLeftPanelHidden: false,
      currentEditingArticle: null,
      rightPanelContent: 'empty',
      // 'empty', 'editor'
      isInitializing: true // 添加初始化状态
    };
  },
  created() {
    // 在created钩子中立即获取workId，避免闪动
    this.workId = this.$route.params.id;

    // 验证ID是否有效
    if (!this.workId || this.workId === 'undefined') {
      console.error('无效的作品ID:', this.workId);
      this.workId = null;
      this.isInitializing = false;
      return;
    }
    console.log('当前编辑的作品ID:', this.workId);
  },
  async mounted() {
    // 如果workId有效，继续初始化
    if (this.workId) {
      // 获取token并构建移动端URL
      await this.initializeMobileApp();

      // 监听来自iframe的消息
      window.addEventListener('message', this.handleIframeMessage);
    }

    // 初始化完成
    this.isInitializing = false;
  },
  beforeDestroy() {
    // 清理事件监听器
    window.removeEventListener('message', this.handleIframeMessage);
  },
  methods: {
    async initializeMobileApp() {
      try {
        const tokenData = localStorage.getItem('token');
        if (tokenData) {
          // 获取跨站点token
          const response = await this.$api.users.generateCrossSiteToken();
          this.token = response.crossSiteToken;

          // 构建移动端URL
          const redirectUrl = encodeURIComponent(`/pages/writers/allArticles?id=${this.workId}`);
          this.panelUrl = `${"https://m.loghome.ink"}/#/pages/users/external_login?token=${this.token}&hideback=true&redirectTo=${redirectUrl}`;
          console.log('移动端URL:', this.panelUrl);
        } else {
          console.error('未找到token');
        }
      } catch (error) {
        console.error('初始化移动端应用失败:', error);
      }
    },
    goBack() {
      // 返回上一页
      this.$router.go(-1);
    },
    onMicroAppMounted(e) {
      console.log('micro-app mounted:', e);
    },
    onMicroAppUnmount(e) {
      console.log('micro-app unmount:', e);
    },
    onMicroAppError(e) {
      console.error('micro-app error:', e);
    },
    startResize(e) {
      this.isResizing = true;
      this.startX = e.clientX;
      this.startWidth = this.leftPanelWidth;
      document.addEventListener('mousemove', this.handleResize);
      document.addEventListener('mouseup', this.stopResize);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    handleResize(e) {
      if (!this.isResizing) return;
      const deltaX = e.clientX - this.startX;
      const newWidth = this.startWidth + deltaX;

      // 如果拖拽到小于100px，隐藏面板
      if (newWidth < 100) {
        this.isLeftPanelHidden = true;
        this.stopResize();
        return;
      }

      // 限制最小和最大宽度
      if (newWidth >= 100 && newWidth <= 400) {
        this.leftPanelWidth = newWidth;
      }
    },
    stopResize() {
      this.isResizing = false;
      document.removeEventListener('mousemove', this.handleResize);
      document.removeEventListener('mouseup', this.stopResize);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    },
    showLeftPanel() {
      this.isLeftPanelHidden = false;
      this.leftPanelWidth = 200; // 重新显示时设置为默认宽度
    },
    handleIframeMessage(event) {
      console.log('父框架收到iframe消息:', event.data);
      if (event.data.type === 'iframe_ready' && event.data.source === 'allArticles') {
        // iframe已准备就绪，发送确认消息
        console.log('收到移动端编辑器准备就绪消息，发送确认');

        // 向iframe发送确认消息
        const iframe = document.querySelector('.mobile-iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'frame_confirmed',
            source: 'parentFrame',
            message: '父框架已确认通信'
          }, '*');
          console.log('已向iframe发送确认消息');
        }
      } else if (event.data.type === 'iframe_ready' && event.data.source === 'chapterEditor') {
        // chapterEditor iframe已准备就绪，发送确认消息
        console.log('收到章节编辑器准备就绪消息，发送确认');

        // 向右侧编辑器iframe发送确认消息
        const editorIframe = document.querySelector('.editor-iframe');
        if (editorIframe && editorIframe.contentWindow) {
          editorIframe.contentWindow.postMessage({
            type: 'frame_confirmed',
            target: 'chapterEditor',
            source: 'parentFrame',
            message: '父框架已确认通信'
          }, '*');
          console.log('已向章节编辑器iframe发送确认消息');
        }
      } else if (event.data.type === 'frame_enabled' && event.data.source === 'allArticles') {
        console.log('iframe模式已成功启用:', event.data.message);
      } else if (event.data.type === 'current_selected' && event.data.source === 'chapterEditor') {
        // 处理来自chapterEditor的当前选中文章消息
        console.log('收到章节编辑器当前选中文章消息:', event.data.data);

        // 转发消息给左侧的allArticles iframe
        const iframe = document.querySelector('.mobile-iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'current_selected',
            source: 'parentFrame',
            data: event.data.data
          }, '*');
          console.log('已转发当前选中文章消息给allArticles');
        }
      } else if (event.data.type === 'edit_article' && event.data.source === 'allArticles') {
        // 处理文章编辑请求
        console.log('收到文章编辑请求:', event.data.data);
        this.handleArticleEdit(event.data.data);
      }
    },
    handleArticleEdit(articleData) {
      // 保存当前编辑的文章信息
      this.currentEditingArticle = articleData;
      this.rightPanelContent = 'editor';
      console.log('开始编辑文章:', articleData.title, '类型:', articleData.article_type);

      // 根据文章类型构建编辑器URL
      let editorUrl = '';
      if (articleData.article_type === 'worldVocabulary') {
        editorUrl = `/pages/writers/worldVocabularyEditor?id=${articleData.article_id}`;
      } else if (articleData.article_type !== 'spliter') {
        editorUrl = `/pages/writers/chapterEditor?id=${articleData.article_id}`;
      }
      if (editorUrl) {
        // 构建完整的编辑器URL
        const fullEditorUrl = `${"https://m.loghome.ink"}/#${editorUrl}&hideback=true&token=${this.token}`;

        // 更新右侧面板内容
        this.$nextTick(() => {
          const rightIframe = document.querySelector('.editor-iframe');
          if (rightIframe) {
            rightIframe.src = fullEditorUrl;
          }
        });
      }
    },
    getArticleTypeLabel(articleType) {
      const typeLabels = {
        'richtext': '章节',
        'worldOutline': '大纲',
        'worldVocabulary': '词条',
        'spliter': '分卷'
      };
      return typeLabels[articleType] || '文章';
    },
    closeEditor() {
      this.rightPanelContent = 'empty';
      this.currentEditingArticle = null;

      // 向左侧面板发送取消选中的消息
      const iframe = document.querySelector('.mobile-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'clear_selection',
          source: 'parentFrame',
          message: '编辑器已关闭，取消文章选中状态'
        }, '*');
        console.log('已向左侧面板发送取消选中消息');
      }
      console.log('关闭编辑器');
    }
  }
});
// CONCATENATED MODULE: ./pages/write/edit/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var edit_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/write/edit/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(192)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  edit_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "03c3e330",
  "3a285447"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map