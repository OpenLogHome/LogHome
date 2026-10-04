exports.ids = [13];
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

/***/ 128:
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
  add("55a7f87a", content, true, context)
};

/***/ }),

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_489e61e6_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(128);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_489e61e6_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_489e61e6_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_489e61e6_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_489e61e6_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 184:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".messages-page[data-v-489e61e6]{max-width:900px;margin:0 auto;padding:20px}.page-header[data-v-489e61e6]{margin-bottom:16px}.page-header .back-link[data-v-489e61e6]{font-size:14px;color:#947358}.page-header .back-link .back-icon[data-v-489e61e6]{margin-right:4px}.page-header .page-title[data-v-489e61e6]{font-size:22px;color:#333;margin:12px 0 0}.messages-card[data-v-489e61e6]{background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.06);padding:0 20px 20px}.tab-badge[data-v-489e61e6]{font-style:normal;margin-left:6px;padding:0 6px;border-radius:8px;background:#f56c6c;color:#fff;font-size:12px;line-height:16px;display:inline-block}.tab-body[data-v-489e61e6]{min-height:200px}.empty-state[data-v-489e61e6]{display:flex;flex-direction:column;align-items:center;padding:40px 0;color:#999}.empty-state .empty-image[data-v-489e61e6]{width:120px;margin-bottom:12px}.conversation-item[data-v-489e61e6],.message-item[data-v-489e61e6]{display:flex;align-items:flex-start;gap:12px;padding:14px 8px;border-bottom:1px solid #f0f0f0;cursor:pointer}.conversation-item[data-v-489e61e6]:hover,.message-item[data-v-489e61e6]:hover{background:#faf8f5}.conversation-item .avatar[data-v-489e61e6],.message-item .avatar[data-v-489e61e6]{width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0;background:#f5f5f5}.conversation-main[data-v-489e61e6],.message-main[data-v-489e61e6]{flex:1;min-width:0}.conversation-top[data-v-489e61e6],.message-top[data-v-489e61e6]{display:flex;align-items:baseline;justify-content:space-between}.conversation-top .name[data-v-489e61e6],.message-top .name[data-v-489e61e6]{font-size:15px;color:#333;font-weight:500}.conversation-top .time[data-v-489e61e6],.message-top .time[data-v-489e61e6]{font-size:12px;color:#bbb;flex-shrink:0;margin-left:12px}.conversation-bottom[data-v-489e61e6]{display:flex;align-items:center;justify-content:space-between;margin-top:4px}.conversation-bottom .preview[data-v-489e61e6]{font-size:13px;color:#888;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.conversation-bottom .unread[data-v-489e61e6]{background:#f56c6c;color:#fff;border-radius:9px;padding:0 6px;font-size:12px;line-height:18px;flex-shrink:0;margin-left:12px}.message-item.unread .message-content[data-v-489e61e6]{color:#333;font-weight:500}.message-content[data-v-489e61e6]{margin:4px 0 0;font-size:13px;color:#888;line-height:1.5}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 243:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/messages.vue?vue&type=template&id=489e61e6&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "messages-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-489e61e6>", "</div>", [_c('nuxt-link', {
    staticClass: "back-link",
    attrs: {
      "to": "/me"
    }
  }, [_c('span', {
    staticClass: "back-icon"
  }, [_vm._v("←")]), _vm._v(" 返回个人中心\n    ")]), _vm._ssrNode(" <h1 class=\"page-title\" data-v-489e61e6>我的消息</h1>")], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"messages-card\" data-v-489e61e6>", "</div>", [_c('el-tabs', {
    on: {
      "tab-click": _vm.handleTabClick
    },
    model: {
      value: _vm.activeTab,
      callback: function ($$v) {
        _vm.activeTab = $$v;
      },
      expression: "activeTab"
    }
  }, [_c('el-tab-pane', {
    attrs: {
      "name": "private"
    }
  }, [_c('span', {
    attrs: {
      "slot": "label"
    },
    slot: "label"
  }, [_vm._v("\n          私信"), _vm.privateUnread > 0 ? _c('em', {
    staticClass: "tab-badge"
  }, [_vm._v(_vm._s(_vm.privateUnread > 99 ? '99+' : _vm.privateUnread))]) : _vm._e()]), _vm._v(" "), _c('div', {
    directives: [{
      name: "loading",
      rawName: "v-loading",
      value: _vm.privateLoading,
      expression: "privateLoading"
    }],
    staticClass: "tab-body"
  }, [!_vm.privateLoading && _vm.conversations.length === 0 ? _c('div', {
    staticClass: "empty-state"
  }, [_c('img', {
    staticClass: "empty-image",
    attrs: {
      "src": "/nothing.png",
      "alt": "暂无消息"
    }
  }), _vm._v(" "), _c('p', [_vm._v("还没有人给你发过私信")])]) : _vm._e(), _vm._v(" "), _vm._l(_vm.conversations, function (item) {
    return _c('div', {
      key: item.user_id,
      staticClass: "conversation-item",
      on: {
        "click": function ($event) {
          return _vm.openChat(item);
        }
      }
    }, [_c('img', {
      staticClass: "avatar",
      attrs: {
        "src": item.avatar_url || '/default-avatar.png',
        "alt": item.name
      },
      on: {
        "error": function ($event) {
          $event.target.src = '/default-avatar.png';
        }
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "conversation-main"
    }, [_c('div', {
      staticClass: "conversation-top"
    }, [_c('span', {
      staticClass: "name"
    }, [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('span', {
      staticClass: "time"
    }, [_vm._v(_vm._s(_vm.formatTime(item.last_message_time)))])]), _vm._v(" "), _c('div', {
      staticClass: "conversation-bottom"
    }, [_c('span', {
      staticClass: "preview"
    }, [_vm._v(_vm._s(_vm.formatPreview(item.last_message_content)))]), _vm._v(" "), item.unread_count > 0 ? _c('span', {
      staticClass: "unread"
    }, [_vm._v(_vm._s(item.unread_count > 99 ? '99+' : item.unread_count))]) : _vm._e()])])]);
  })], 2)]), _vm._v(" "), _c('el-tab-pane', {
    attrs: {
      "name": "system"
    }
  }, [_c('span', {
    attrs: {
      "slot": "label"
    },
    slot: "label"
  }, [_vm._v("\n          系统消息"), _vm.systemUnread > 0 ? _c('em', {
    staticClass: "tab-badge"
  }, [_vm._v(_vm._s(_vm.systemUnread > 99 ? '99+' : _vm.systemUnread))]) : _vm._e()]), _vm._v(" "), _c('div', {
    directives: [{
      name: "loading",
      rawName: "v-loading",
      value: _vm.systemLoading,
      expression: "systemLoading"
    }],
    staticClass: "tab-body"
  }, [!_vm.systemLoading && _vm.systemMessages.length === 0 ? _c('div', {
    staticClass: "empty-state"
  }, [_c('img', {
    staticClass: "empty-image",
    attrs: {
      "src": "/nothing.png",
      "alt": "暂无消息"
    }
  }), _vm._v(" "), _c('p', [_vm._v("暂无系统消息")])]) : _vm._e(), _vm._v(" "), _vm._l(_vm.systemMessages, function (item) {
    return _c('div', {
      key: item.message_id,
      staticClass: "message-item",
      class: {
        unread: !item.is_read
      },
      on: {
        "click": function ($event) {
          return _vm.openSystemMessage(item);
        }
      }
    }, [_c('img', {
      staticClass: "avatar",
      attrs: {
        "src": item.avatar_url || '/default-avatar.png',
        "alt": item.name
      },
      on: {
        "error": function ($event) {
          $event.target.src = '/default-avatar.png';
        }
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "message-main"
    }, [_c('div', {
      staticClass: "message-top"
    }, [_c('span', {
      staticClass: "name"
    }, [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('span', {
      staticClass: "time"
    }, [_vm._v(_vm._s(_vm.formatTime(item.time)))])]), _vm._v(" "), _c('p', {
      staticClass: "message-content"
    }, [_vm._v(_vm._s(item.message_content))])])]);
  })], 2)])], 1)], 1)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/me/messages.vue?vue&type=template&id=489e61e6&scoped=true

// EXTERNAL MODULE: ./utils/private-message.js
var private_message = __webpack_require__(111);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/messages.vue?vue&type=script&lang=js

/* harmony default export */ var messagesvue_type_script_lang_js = ({
  layout: 'default',
  data() {
    return {
      activeTab: 'private',
      conversations: [],
      privateLoading: false,
      privateLoaded: false,
      privateUnread: 0,
      systemMessages: [],
      systemLoading: false,
      systemLoaded: false,
      systemUnread: 0
    };
  },
  async mounted() {
    if (!localStorage.getItem('token')) {
      this.$message.warning('请先登录');
      this.$router.push('/login');
      return;
    }
    const [privateCount, systemCount] = await Promise.all([this.$api.community.getUnreadMessageCount(), this.$api.users.getUnreadSystemMessageCount()]);
    this.privateUnread = privateCount.count;
    this.systemUnread = systemCount.count;
    this.loadConversations();
  },
  methods: {
    handleTabClick(tab) {
      if (tab.name === 'private') {
        this.loadConversations();
      } else {
        this.loadSystemMessages();
      }
    },
    async loadConversations() {
      if (this.privateLoaded || this.privateLoading) return;
      this.privateLoading = true;
      try {
        const response = await this.$api.community.getConversationList();
        this.conversations = Array.isArray(response.data) ? response.data : [];
        this.privateLoaded = true;
      } catch (error) {
        console.error('获取私信会话失败', error);
        this.$message.error('私信列表加载失败');
      } finally {
        this.privateLoading = false;
      }
    },
    // 服务端读取系统消息后会将其标记为已读
    async loadSystemMessages() {
      if (this.systemLoaded || this.systemLoading) return;
      this.systemLoading = true;
      try {
        this.systemMessages = await this.$api.users.getHistoryMessages();
        this.systemLoaded = true;
        this.systemUnread = 0;
      } catch (error) {
        console.error('获取系统消息失败', error);
        this.$message.error('系统消息加载失败');
      } finally {
        this.systemLoading = false;
      }
    },
    formatPreview(content) {
      return Object(private_message["a" /* formatMessagePreview */])(content) || '开始和对方聊天吧';
    },
    openChat(conversation) {
      this.$router.push(`/community/chat?id=${conversation.user_id}`);
    },
    openSystemMessage(message) {
      const target = this.resolveTarget(message.router);
      if (!target) return;
      if (target.mobile) {
        this.openMobilePage(target.path, message.name || '消息详情');
      } else {
        this.$router.push(target.path);
      }
    },
    // 系统消息里的 router 是移动端页面路径，能映射到网页端的跳转，其余走移动端
    resolveTarget(router) {
      if (!router) return null;
      const novelMatch = router.match(/^readers\/book(?:Info|Comment)\?id=(\d+)/);
      if (novelMatch) return {
        path: `/novel/${novelMatch[1]}`
      };
      const postMatch = router.match(/^community\/postDetail\?id=(\d+)/);
      if (postMatch) return {
        path: `/community/post/${postMatch[1]}`
      };
      const userMatch = router.match(/^users\/personalPage\?id=(\d+)/);
      if (userMatch) return {
        path: `/users/${userMatch[1]}`
      };
      if (router === '/' || router === 'None') return null;
      return {
        path: `/pages/${router.replace(/^\/?pages\//, '')}`,
        mobile: true
      };
    },
    // 移动端专属页面用浮窗内嵌打开
    openMobilePage(pagePath, title) {
      return this.$openMobileWindow(pagePath, {
        title
      });
    },
    formatTime(value) {
      if (!value) return '';
      const date = new Date(value);
      if (isNaN(date.getTime())) return '';
      const now = new Date();
      const pad = n => n < 10 ? `0${n}` : `${n}`;
      const hm = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
      if (date.toDateString() === now.toDateString()) return hm;
      if (date.getFullYear() === now.getFullYear()) {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      }
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
  },
  head() {
    return {
      title: '我的消息 - 原木社区'
    };
  }
});
// CONCATENATED MODULE: ./pages/me/messages.vue?vue&type=script&lang=js
 /* harmony default export */ var me_messagesvue_type_script_lang_js = (messagesvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/me/messages.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(183)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  me_messagesvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "489e61e6",
  "077768ca"
  
)

/* harmony default export */ var messages = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=messages.js.map