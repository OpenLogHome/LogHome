exports.ids = [3];
exports.modules = {

/***/ 111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export parsePrivateMessage */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return normalizePrivateMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return formatMessagePreview; });
/**
 * 私信结构化消息解析
 * 移动端聊天会把图片、作品分享编码成 __LOGHOME_DM__: 前缀的 JSON 存进 message_content，
 * 网页端需要按同样的协议渲染，否则会话里会出现原始 JSON 字符串。
 */

const PRIVATE_MESSAGE_PREFIX = '__LOGHOME_DM__:';
const PRIVATE_MESSAGE_VERSION = 1;
function getStructuredPayload(messageContent) {
  if (typeof messageContent !== 'string' || !messageContent.startsWith(PRIVATE_MESSAGE_PREFIX)) return null;
  try {
    const payload = JSON.parse(messageContent.slice(PRIVATE_MESSAGE_PREFIX.length));
    if (!payload || payload.version !== PRIVATE_MESSAGE_VERSION) return null;
    return payload;
  } catch (error) {
    console.error('解析私信内容失败', error);
    return null;
  }
}
function parsePrivateMessage(messageContent) {
  const text = typeof messageContent === 'string' ? messageContent : '';
  const payload = getStructuredPayload(messageContent);
  if (!payload) return {
    type: 'text',
    text,
    previewText: text
  };
  if (payload.type === 'image' && payload.url) {
    return {
      type: 'image',
      text: '',
      previewText: '[图片]',
      imageUrl: payload.url
    };
  }
  if (payload.type === 'novel_share' && payload.novel) {
    const novel = payload.novel;
    return {
      type: 'novel_share',
      text: '',
      previewText: novel.name ? `分享了作品《${novel.name}》` : '分享了作品',
      novel
    };
  }
  return {
    type: 'text',
    text,
    previewText: text
  };
}
function normalizePrivateMessage(message) {
  const parsed = parsePrivateMessage(message.message_content);
  return {
    ...message,
    displayType: parsed.type,
    displayText: parsed.text,
    previewText: parsed.previewText,
    imageUrl: parsed.imageUrl || '',
    novel: parsed.novel || null
  };
}
function formatMessagePreview(messageContent) {
  return parsePrivateMessage(messageContent).previewText;
}

/***/ }),

/***/ 125:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(178);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("2029ae4b", content, true, context)
};

/***/ }),

/***/ 177:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_bed3fd7c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(125);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_bed3fd7c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_bed3fd7c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_bed3fd7c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_bed3fd7c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 178:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".chat-page[data-v-bed3fd7c]{height:100vh;display:flex;flex-direction:column;background-color:#f5f5f5}.chat-header[data-v-bed3fd7c]{background:#fff;padding:16px 20px;border-bottom:1px solid #eee;display:flex;align-items:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.chat-header .back-button[data-v-bed3fd7c]{margin-right:16px;cursor:pointer;padding:8px;border-radius:4px;transition:background-color .2s}.chat-header .back-button[data-v-bed3fd7c]:hover{background-color:#f0f0f0}.chat-header .back-button i[data-v-bed3fd7c]{font-size:20px;color:#666}.chat-header .chat-user-info[data-v-bed3fd7c]{display:flex;align-items:center}.chat-header .chat-user-info .user-avatar[data-v-bed3fd7c]{width:40px;height:40px;border-radius:50%;margin-right:12px;object-fit:cover}.chat-header .chat-user-info .user-details .username[data-v-bed3fd7c]{margin:0;font-size:16px;font-weight:500;color:#333}.chat-header .chat-user-info .user-details .user-id[data-v-bed3fd7c]{font-size:12px;color:#999}.messages-container[data-v-bed3fd7c]{flex:1;overflow-y:auto;padding:20px}.messages-container .messages-list[data-v-bed3fd7c]{display:flex;flex-direction:column;gap:16px}.messages-container .messages-list .load-more[data-v-bed3fd7c]{text-align:center;font-size:13px;color:#947358;cursor:pointer}.messages-container .messages-list .load-more[data-v-bed3fd7c]:hover{text-decoration:underline}.messages-container .message-item[data-v-bed3fd7c]{display:flex;align-items:flex-start}.messages-container .message-item.own-message[data-v-bed3fd7c]{flex-direction:row-reverse}.messages-container .message-item.own-message .message-content[data-v-bed3fd7c]{align-items:flex-end}.messages-container .message-item.own-message .message-content .message-bubble[data-v-bed3fd7c]{background-color:#409eff;color:#fff}.messages-container .message-item .message-avatar[data-v-bed3fd7c]{margin:0 12px}.messages-container .message-item .message-avatar img[data-v-bed3fd7c]{width:36px;height:36px;border-radius:50%;object-fit:cover}.messages-container .message-item .message-content[data-v-bed3fd7c]{display:flex;flex-direction:column;align-items:flex-start;max-width:60%}.messages-container .message-item .message-content .message-bubble[data-v-bed3fd7c]{background-color:#fff;border-radius:12px;padding:12px 16px;box-shadow:0 2px 4px rgba(0,0,0,.1)}.messages-container .message-item .message-content .message-bubble .message-text[data-v-bed3fd7c]{font-size:14px;line-height:1.5;white-space:pre-wrap;word-break:break-word}.messages-container .message-item .message-content .message-bubble .message-image[data-v-bed3fd7c]{display:block;max-width:260px;max-height:260px;border-radius:8px;object-fit:cover;cursor:zoom-in}.messages-container .message-item .message-content .message-bubble .shared-book-card[data-v-bed3fd7c]{display:flex;gap:10px;width:260px;max-width:100%;padding:8px;border-radius:8px;background:#faf8f5;border:1px solid #f0e8dd;cursor:pointer}.messages-container .message-item .message-content .message-bubble .shared-book-card .shared-book-cover[data-v-bed3fd7c]{width:48px;height:64px;object-fit:cover;border-radius:4px;flex-shrink:0;background:#eee}.messages-container .message-item .message-content .message-bubble .shared-book-card .shared-book-info[data-v-bed3fd7c]{flex:1;min-width:0;display:flex;flex-direction:column}.messages-container .message-item .message-content .message-bubble .shared-book-card .shared-book-tag[data-v-bed3fd7c]{font-size:11px;color:#947358}.messages-container .message-item .message-content .message-bubble .shared-book-card .shared-book-title[data-v-bed3fd7c]{font-size:14px;color:#333;font-weight:500;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.messages-container .message-item .message-content .message-bubble .shared-book-card .shared-book-author[data-v-bed3fd7c]{font-size:12px;color:#999;margin-top:2px}.messages-container .message-item .message-content .message-bubble .message-time[data-v-bed3fd7c]{font-size:11px;color:hsla(0,0%,100%,.7);margin-top:4px;text-align:right}.messages-container .message-item:not(.own-message) .message-content .message-bubble .message-time[data-v-bed3fd7c]{color:#999}.messages-container .empty-messages[data-v-bed3fd7c]{text-align:center;padding:60px 20px;color:#999}.messages-container .empty-messages i[data-v-bed3fd7c]{font-size:64px;margin-bottom:16px;display:block}.messages-container .empty-messages p[data-v-bed3fd7c]{font-size:16px;margin:0}.message-input-container[data-v-bed3fd7c]{background:#fff;border-top:1px solid #eee;padding:16px 20px}.message-input-container .input-wrapper[data-v-bed3fd7c]{display:flex;align-items:flex-end;gap:12px}.message-input-container .input-wrapper .el-textarea[data-v-bed3fd7c]{flex:1}.message-input-container .input-wrapper .input-actions[data-v-bed3fd7c]{display:flex;align-items:center}@media(min-width: 1200px){.chat-page[data-v-bed3fd7c]{max-width:1200px;margin:0 auto;box-shadow:0 0 20px rgba(0,0,0,.1)}.messages-container[data-v-bed3fd7c]{padding:30px 40px}.message-item .message-content[data-v-bed3fd7c]{max-width:50%}.message-input-container[data-v-bed3fd7c]{padding:20px 40px}}@media(max-width: 1199px)and (min-width: 992px){.messages-container[data-v-bed3fd7c]{padding:25px 30px}.message-item .message-content[data-v-bed3fd7c]{max-width:55%}.message-input-container[data-v-bed3fd7c]{padding:18px 30px}}@media(max-width: 991px)and (min-width: 768px){.messages-container[data-v-bed3fd7c]{padding:20px 25px}.message-item .message-content[data-v-bed3fd7c]{max-width:65%}.message-input-container[data-v-bed3fd7c]{padding:16px 25px}.chat-header[data-v-bed3fd7c]{padding:14px 20px}}@media(max-width: 767px){.chat-page[data-v-bed3fd7c]{height:100vh}.messages-container[data-v-bed3fd7c]{padding:16px}.message-item .message-content[data-v-bed3fd7c]{max-width:80%}.message-item .message-avatar[data-v-bed3fd7c]{margin:0 8px}.message-item .message-avatar img[data-v-bed3fd7c]{width:32px;height:32px}.message-input-container[data-v-bed3fd7c]{padding:12px 16px}.chat-header[data-v-bed3fd7c]{padding:12px 16px}.chat-header .chat-user-info .user-avatar[data-v-bed3fd7c]{width:36px;height:36px}.chat-header .chat-user-info .user-details .username[data-v-bed3fd7c]{font-size:15px}}@media(max-width: 480px){.message-item .message-content[data-v-bed3fd7c]{max-width:85%}.message-item .message-bubble[data-v-bed3fd7c]{padding:10px 12px !important}.message-item .message-bubble .message-text[data-v-bed3fd7c]{font-size:13px !important}.message-input-container[data-v-bed3fd7c]{padding:10px 12px}.message-input-container .input-wrapper[data-v-bed3fd7c]{gap:8px}.chat-header[data-v-bed3fd7c]{padding:10px 12px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/chat.vue?vue&type=template&id=bed3fd7c&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "chat-page"
  }, [_vm._ssrNode("<div class=\"chat-header\" data-v-bed3fd7c><div class=\"back-button\" data-v-bed3fd7c><i class=\"el-icon-arrow-left\" data-v-bed3fd7c></i></div> <div class=\"chat-user-info\" data-v-bed3fd7c><img" + _vm._ssrAttr("src", _vm.targetUser.avatar_url || '/default-avatar.png') + " alt=\"头像\" class=\"user-avatar\" data-v-bed3fd7c> <div class=\"user-details\" data-v-bed3fd7c><h3 class=\"username\" data-v-bed3fd7c>" + _vm._ssrEscape(_vm._s(_vm.targetUser.name)) + "</h3> <span class=\"user-id\" data-v-bed3fd7c>" + _vm._ssrEscape("ID: " + _vm._s(_vm.targetUser.user_id)) + "</span></div></div></div> <div class=\"messages-container\" data-v-bed3fd7c><div class=\"messages-list\" data-v-bed3fd7c>" + (_vm.hasMore && _vm.messages.length ? "<div class=\"load-more\" data-v-bed3fd7c>" + (!_vm.loading ? "<span data-v-bed3fd7c>加载更早的消息</span>" : "<span data-v-bed3fd7c>加载中...</span>") + "</div>" : "<!---->") + " " + _vm._ssrList(_vm.displayMessages, function (message) {
    return "<div" + _vm._ssrClass("message-item", {
      'own-message': message.sender_id === _vm.myUserId
    }) + " data-v-bed3fd7c><div class=\"message-avatar\" data-v-bed3fd7c><img" + _vm._ssrAttr("src", message.sender_id === _vm.myUserId ? _vm.myUserInfo.avatar_url : _vm.targetUser.avatar_url) + " alt=\"头像\" data-v-bed3fd7c></div> <div class=\"message-content\" data-v-bed3fd7c><div class=\"message-bubble\" data-v-bed3fd7c>" + (message.displayType === 'image' ? "<img" + _vm._ssrAttr("src", message.imageUrl) + " alt=\"图片消息\" class=\"message-image\" data-v-bed3fd7c>" : message.displayType === 'novel_share' ? "<div class=\"shared-book-card\" data-v-bed3fd7c><img" + _vm._ssrAttr("src", message.novel.picUrl || '/default-book-cover.png') + _vm._ssrAttr("alt", message.novel.name) + " class=\"shared-book-cover\" data-v-bed3fd7c> <div class=\"shared-book-info\" data-v-bed3fd7c><span class=\"shared-book-tag\" data-v-bed3fd7c>分享了作品</span> <span class=\"shared-book-title\" data-v-bed3fd7c>" + _vm._ssrEscape(_vm._s(message.novel.name)) + "</span> <span class=\"shared-book-author\" data-v-bed3fd7c>" + _vm._ssrEscape(_vm._s(message.novel.author_name)) + "</span></div></div>" : "<div class=\"message-text\" data-v-bed3fd7c>" + _vm._ssrEscape(_vm._s(message.displayText)) + "</div>") + " <div class=\"message-time\" data-v-bed3fd7c>" + _vm._ssrEscape(_vm._s(_vm.formatTime(message.sent_at))) + "</div></div></div></div>";
  }) + "</div> " + (_vm.messages.length === 0 ? "<div class=\"empty-messages\" data-v-bed3fd7c><i class=\"el-icon-chat-dot-round\" data-v-bed3fd7c></i> <p data-v-bed3fd7c>还没有消息，开始聊天吧！</p></div>" : "<!---->") + "</div> "), _vm._ssrNode("<div class=\"message-input-container\" data-v-bed3fd7c>", "</div>", [_vm._ssrNode("<div class=\"input-wrapper\" data-v-bed3fd7c>", "</div>", [_c('el-input', {
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
  }), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"input-actions\" data-v-bed3fd7c>", "</div>", [_c('el-button', {
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

// CONCATENATED MODULE: ./pages/community/chat.vue?vue&type=template&id=bed3fd7c&scoped=true

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(106);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// EXTERNAL MODULE: ./utils/private-message.js
var private_message = __webpack_require__(111);

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
      loading: false,
      hasMore: true,
      oldestId: null,
      newestId: null,
      pollTimer: null
    };
  },
  computed: {
    // 图片、作品分享等结构化私信需要解析后才能渲染
    displayMessages() {
      return this.messages.map(private_message["b" /* normalizePrivateMessage */]);
    }
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

    // 轮询新消息，避免只有刷新才能看到对方回复
    this.pollTimer = setInterval(this.pollNewMessages, 10000);
  },
  beforeDestroy() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  },
  methods: {
    getToken() {
      const token = localStorage.getItem('token');
      return token ? JSON.parse(token).tk : null;
    },
    // 获取当前用户信息
    async getCurrentUserInfo() {
      try {
        const userInfo = localStorage.getItem('LogHomeUserInfo');
        if (userInfo) {
          this.myUserInfo = JSON.parse(userInfo);
          this.myUserId = Number(this.myUserInfo.user_id);
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
    // 加载聊天记录（首屏）
    async loadMessages() {
      if (this.loading) return;
      this.loading = true;
      try {
        const response = await this.$api.community.getMessageList(this.targetUserId, 20);
        if (response.code === 0) {
          const list = Array.isArray(response.data) ? response.data : [];
          this.messages = list;
          this.hasMore = list.length === 20;
          if (list.length) {
            this.oldestId = list[0].id;
            this.newestId = list[list.length - 1].id;
          }
          this.markReceivedAsRead(list);
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
    // 向上翻页：加载更早的消息
    async loadOlderMessages() {
      if (this.loading || !this.hasMore || !this.oldestId) return;
      this.loading = true;
      try {
        const response = await this.$api.community.getMessageList(this.targetUserId, 20, this.oldestId);
        if (response.code === 0) {
          const list = Array.isArray(response.data) ? response.data : [];
          // 记录滚动位置，避免插入历史后视口跳动
          const container = this.$refs.messagesContainer;
          const previousHeight = container ? container.scrollHeight : 0;
          this.messages = [...list, ...this.messages];
          this.hasMore = list.length === 20;
          if (list.length) {
            this.oldestId = list[0].id;
          }
          this.$nextTick(() => {
            if (container) {
              container.scrollTop = container.scrollHeight - previousHeight;
            }
          });
        }
      } catch (error) {
        console.error('加载更早消息失败', error);
        this.$message.error('加载更早消息失败');
      } finally {
        this.loading = false;
      }
    },
    // 拉取对方新发来的消息
    async pollNewMessages() {
      if (this.sending || !this.targetUserId || this.newestId === null) return;
      try {
        const token = this.getToken();
        if (!token) return;
        const response = await fetch(`${"https://loghomeservice.codesocean.top"}/community/new_messages?friend_id=${this.targetUserId}&since_id=${this.newestId}`, {
          headers: {
            'Authorization': token
          }
        });
        const list = await response.json();
        if (Array.isArray(list) && list.length) {
          this.messages = [...this.messages, ...list];
          this.newestId = list[list.length - 1].id;
          this.markReceivedAsRead(list);
          this.$nextTick(this.scrollToBottom);
        }
      } catch (error) {
        console.error('获取新消息失败', error);
      }
    },
    // 把对方发来的未读消息标记为已读
    markReceivedAsRead(list) {
      const unread = list.filter(item => Number(item.receiver_id) === this.myUserId && !item.is_read);
      unread.forEach(item => {
        this.$api.community.markMessageAsRead(item.id);
      });
    },
    // 发送消息
    async sendMessage() {
      if (!this.newMessage.trim() || this.sending) return;
      const messageContent = this.newMessage.trim();
      this.sending = true;
      try {
        const response = await this.$api.community.sendMessage(this.targetUserId, messageContent);
        if (response.code === 0) {
          const created = response.data || {};
          this.messages.push({
            id: created.id,
            sender_id: this.myUserId,
            receiver_id: Number(this.targetUserId),
            message_content: messageContent,
            is_read: 0,
            sent_at: new Date()
          });
          if (created.id) {
            this.newestId = created.id;
          }
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
    previewImage(url) {
      if (url) this.$preview([url]);
    },
    openSharedNovel(novel) {
      if (novel && novel.novel_id) {
        this.$router.push(`/novel/${novel.novel_id}`);
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
  
  var style0 = __webpack_require__(177)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  community_chatvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "bed3fd7c",
  "4ac243be"
  
)

/* harmony default export */ var chat = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=chat.js.map