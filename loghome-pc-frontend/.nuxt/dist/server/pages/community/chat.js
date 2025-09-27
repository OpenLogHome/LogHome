exports.ids = [3];
exports.modules = {

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(173);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("443403b8", content, true, context)
};

/***/ }),

/***/ 172:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_64badf73_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(126);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_64badf73_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_64badf73_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_64badf73_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_64badf73_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".chat-page[data-v-64badf73]{height:100vh;display:flex;flex-direction:column;background-color:#f5f5f5}.chat-header[data-v-64badf73]{background:#fff;padding:16px 20px;border-bottom:1px solid #eee;display:flex;align-items:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.chat-header .back-button[data-v-64badf73]{margin-right:16px;cursor:pointer;padding:8px;border-radius:4px;transition:background-color .2s}.chat-header .back-button[data-v-64badf73]:hover{background-color:#f0f0f0}.chat-header .back-button i[data-v-64badf73]{font-size:20px;color:#666}.chat-header .chat-user-info[data-v-64badf73]{display:flex;align-items:center}.chat-header .chat-user-info .user-avatar[data-v-64badf73]{width:40px;height:40px;border-radius:50%;margin-right:12px;object-fit:cover}.chat-header .chat-user-info .user-details .username[data-v-64badf73]{margin:0;font-size:16px;font-weight:500;color:#333}.chat-header .chat-user-info .user-details .online-status[data-v-64badf73]{font-size:12px;color:#999}.chat-header .chat-user-info .user-details .online-status.online[data-v-64badf73]{color:#67c23a}.messages-container[data-v-64badf73]{flex:1;overflow-y:auto;padding:20px}.messages-container .messages-list[data-v-64badf73]{display:flex;flex-direction:column;gap:16px}.messages-container .message-item[data-v-64badf73]{display:flex;align-items:flex-start}.messages-container .message-item.own-message[data-v-64badf73]{flex-direction:row-reverse}.messages-container .message-item.own-message .message-content[data-v-64badf73]{align-items:flex-end}.messages-container .message-item.own-message .message-content .message-bubble[data-v-64badf73]{background-color:#409eff;color:#fff}.messages-container .message-item .message-avatar[data-v-64badf73]{margin:0 12px}.messages-container .message-item .message-avatar img[data-v-64badf73]{width:36px;height:36px;border-radius:50%;object-fit:cover}.messages-container .message-item .message-content[data-v-64badf73]{display:flex;flex-direction:column;align-items:flex-start;max-width:60%}.messages-container .message-item .message-content .message-bubble[data-v-64badf73]{background-color:#fff;border-radius:12px;padding:12px 16px;box-shadow:0 2px 4px rgba(0,0,0,.1)}.messages-container .message-item .message-content .message-bubble .message-text[data-v-64badf73]{font-size:14px;line-height:1.5;white-space:pre-wrap;word-break:break-word}.messages-container .message-item .message-content .message-bubble .message-time[data-v-64badf73]{font-size:11px;color:hsla(0,0%,100%,.7);margin-top:4px;text-align:right}.messages-container .message-item:not(.own-message) .message-content .message-bubble .message-time[data-v-64badf73]{color:#999}.messages-container .empty-messages[data-v-64badf73]{text-align:center;padding:60px 20px;color:#999}.messages-container .empty-messages i[data-v-64badf73]{font-size:64px;margin-bottom:16px;display:block}.messages-container .empty-messages p[data-v-64badf73]{font-size:16px;margin:0}.message-input-container[data-v-64badf73]{background:#fff;border-top:1px solid #eee;padding:16px 20px}.message-input-container .input-wrapper[data-v-64badf73]{display:flex;align-items:flex-end;gap:12px}.message-input-container .input-wrapper .el-textarea[data-v-64badf73]{flex:1}.message-input-container .input-wrapper .input-actions[data-v-64badf73]{display:flex;align-items:center}@media(min-width: 1200px){.chat-page[data-v-64badf73]{max-width:1200px;margin:0 auto;box-shadow:0 0 20px rgba(0,0,0,.1)}.messages-container[data-v-64badf73]{padding:30px 40px}.message-item .message-content[data-v-64badf73]{max-width:50%}.message-input-container[data-v-64badf73]{padding:20px 40px}}@media(max-width: 1199px)and (min-width: 992px){.messages-container[data-v-64badf73]{padding:25px 30px}.message-item .message-content[data-v-64badf73]{max-width:55%}.message-input-container[data-v-64badf73]{padding:18px 30px}}@media(max-width: 991px)and (min-width: 768px){.messages-container[data-v-64badf73]{padding:20px 25px}.message-item .message-content[data-v-64badf73]{max-width:65%}.message-input-container[data-v-64badf73]{padding:16px 25px}.chat-header[data-v-64badf73]{padding:14px 20px}}@media(max-width: 767px){.chat-page[data-v-64badf73]{height:100vh}.messages-container[data-v-64badf73]{padding:16px}.message-item .message-content[data-v-64badf73]{max-width:80%}.message-item .message-avatar[data-v-64badf73]{margin:0 8px}.message-item .message-avatar img[data-v-64badf73]{width:32px;height:32px}.message-input-container[data-v-64badf73]{padding:12px 16px}.chat-header[data-v-64badf73]{padding:12px 16px}.chat-header .chat-user-info .user-avatar[data-v-64badf73]{width:36px;height:36px}.chat-header .chat-user-info .user-details .username[data-v-64badf73]{font-size:15px}}@media(max-width: 480px){.message-item .message-content[data-v-64badf73]{max-width:85%}.message-item .message-bubble[data-v-64badf73]{padding:10px 12px !important}.message-item .message-bubble .message-text[data-v-64badf73]{font-size:13px !important}.message-input-container[data-v-64badf73]{padding:10px 12px}.message-input-container .input-wrapper[data-v-64badf73]{gap:8px}.chat-header[data-v-64badf73]{padding:10px 12px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/chat.vue?vue&type=template&id=64badf73&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "chat-page"
  }, [_vm._ssrNode("<div class=\"chat-header\" data-v-64badf73><div class=\"back-button\" data-v-64badf73><i class=\"el-icon-arrow-left\" data-v-64badf73></i></div> <div class=\"chat-user-info\" data-v-64badf73><img" + _vm._ssrAttr("src", _vm.targetUser.avatar_url || '/default-avatar.png') + " alt=\"头像\" class=\"user-avatar\" data-v-64badf73> <div class=\"user-details\" data-v-64badf73><h3 class=\"username\" data-v-64badf73>" + _vm._ssrEscape(_vm._s(_vm.targetUser.nickname || _vm.targetUser.username)) + "</h3> <span" + _vm._ssrClass("online-status", {
    online: _vm.targetUser.is_online
  }) + " data-v-64badf73>" + _vm._ssrEscape(_vm._s(_vm.targetUser.is_online ? '在线' : '离线')) + "</span></div></div></div> <div class=\"messages-container\" data-v-64badf73><div class=\"messages-list\" data-v-64badf73>" + _vm._ssrList(_vm.messages, function (message) {
    return "<div" + _vm._ssrClass("message-item", {
      'own-message': message.from_id === _vm.myUserId
    }) + " data-v-64badf73><div class=\"message-avatar\" data-v-64badf73><img" + _vm._ssrAttr("src", message.from_id === _vm.myUserId ? _vm.myUserInfo.avatar_url : _vm.targetUser.avatar_url) + " alt=\"头像\" data-v-64badf73></div> <div class=\"message-content\" data-v-64badf73><div class=\"message-bubble\" data-v-64badf73><div class=\"message-text\" data-v-64badf73>" + _vm._ssrEscape(_vm._s(message.content)) + "</div> <div class=\"message-time\" data-v-64badf73>" + _vm._ssrEscape(_vm._s(_vm.formatTime(message.created_at))) + "</div></div></div></div>";
  }) + "</div> " + (_vm.messages.length === 0 ? "<div class=\"empty-messages\" data-v-64badf73><i class=\"el-icon-chat-dot-round\" data-v-64badf73></i> <p data-v-64badf73>还没有消息，开始聊天吧！</p></div>" : "<!---->") + "</div> "), _vm._ssrNode("<div class=\"message-input-container\" data-v-64badf73>", "</div>", [_vm._ssrNode("<div class=\"input-wrapper\" data-v-64badf73>", "</div>", [_c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 2,
      "placeholder": "输入消息...",
      "maxlength": "500",
      "show-word-limit": ""
    },
    on: {
      "keydown": [function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        $event.preventDefault();
        return _vm.sendMessage.apply(null, arguments);
      }, function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        if (!$event.ctrlKey) return null;
        return _vm.addNewLine.apply(null, arguments);
      }]
    },
    model: {
      value: _vm.newMessage,
      callback: function ($$v) {
        _vm.newMessage = $$v;
      },
      expression: "newMessage"
    }
  }), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"input-actions\" data-v-64badf73>", "</div>", [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.sending,
      "disabled": !_vm.newMessage.trim()
    },
    on: {
      "click": _vm.sendMessage
    }
  }, [_vm._v("\n          发送\n        ")])], 1)], 2)])], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/community/chat.vue?vue&type=template&id=64badf73&scoped=true

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(108);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/chat.vue?vue&type=script&lang=js

/* harmony default export */ var chatvue_type_script_lang_js = ({
  name: 'ChatPage',
  data() {
    return {
      targetUserId: null,
      targetUser: {},
      messages: [],
      newMessage: '',
      sending: false,
      loading: false,
      myUserId: null,
      myUserInfo: {},
      page: 1,
      hasMore: true
    };
  },
  async mounted() {
    // 获取目标用户ID
    this.targetUserId = this.$route.query.id;
    if (!this.targetUserId) {
      this.$message.error('缺少用户ID参数');
      this.goBack();
      return;
    }

    // 获取当前用户信息
    await this.getCurrentUserInfo();

    // 获取目标用户信息
    await this.getTargetUserInfo();

    // 加载聊天记录
    await this.loadMessages();

    // 滚动到底部
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },
  methods: {
    // 获取当前用户信息
    async getCurrentUserInfo() {
      try {
        const userInfo = localStorage.getItem('LogHomeUserInfo');
        if (userInfo) {
          this.myUserInfo = JSON.parse(userInfo);
          this.myUserId = this.myUserInfo.user_id;
        } else {
          this.$message.error('请先登录');
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('获取用户信息失败', error);
        this.$message.error('获取用户信息失败');
      }
    },
    // 获取目标用户信息
    async getTargetUserInfo() {
      try {
        const response = await this.$api.users.getUserInfo(this.targetUserId);
        if (response.code === 0) {
          this.targetUser = response.data;
        } else {
          throw new Error(response.message || '获取用户信息失败');
        }
      } catch (error) {
        console.error('获取目标用户信息失败', error);
        this.$message.error('获取用户信息失败');
      }
    },
    // 加载聊天记录
    async loadMessages() {
      if (this.loading || !this.hasMore) return;
      this.loading = true;
      try {
        const response = await this.$api.community.getMessagesList({
          target_id: this.targetUserId,
          page: this.page,
          limit: 20
        });
        if (response.code === 0) {
          const newMessages = response.data.list || [];
          if (this.page === 1) {
            this.messages = newMessages;
          } else {
            this.messages = [...newMessages, ...this.messages];
          }
          this.hasMore = newMessages.length === 20;
          this.page++;
        } else {
          throw new Error(response.message || '加载消息失败');
        }
      } catch (error) {
        console.error('加载消息失败', error);
        this.$message.error('加载消息失败');
      } finally {
        this.loading = false;
      }
    },
    // 发送消息
    async sendMessage() {
      if (!this.newMessage.trim() || this.sending) return;
      const messageContent = this.newMessage.trim();
      this.sending = true;
      try {
        const response = await this.$api.community.sendMessage({
          to_id: this.targetUserId,
          content: messageContent,
          type: 'text'
        });
        if (response.code === 0) {
          // 添加消息到列表
          const newMessage = {
            message_id: Date.now(),
            // 临时ID
            from_id: this.myUserId,
            to_id: this.targetUserId,
            content: messageContent,
            created_at: new Date().toISOString(),
            is_read: 0
          };
          this.messages.push(newMessage);
          this.newMessage = '';

          // 滚动到底部
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        } else {
          throw new Error(response.message || '发送失败');
        }
      } catch (error) {
        console.error('发送消息失败', error);
        this.$message.error('发送失败，请重试');
      } finally {
        this.sending = false;
      }
    },
    // 添加换行
    addNewLine() {
      this.newMessage += '\n';
    },
    // 滚动到底部
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    // 格式化时间
    formatTime(time) {
      return external_moment_default()(time).format('MM-DD HH:mm');
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    }
  }
});
// CONCATENATED MODULE: ./pages/community/chat.vue?vue&type=script&lang=js
 /* harmony default export */ var community_chatvue_type_script_lang_js = (chatvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/community/chat.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(172)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  community_chatvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "64badf73",
  "52d91c6d"
  
)

/* harmony default export */ var chat = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=chat.js.map