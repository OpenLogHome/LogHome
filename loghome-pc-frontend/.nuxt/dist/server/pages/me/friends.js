exports.ids = [11];
exports.modules = {

/***/ 127:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(182);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("6a230fca", content, true, context)
};

/***/ }),

/***/ 181:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_friends_vue_vue_type_style_index_0_id_baa53e46_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(127);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_friends_vue_vue_type_style_index_0_id_baa53e46_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_friends_vue_vue_type_style_index_0_id_baa53e46_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_friends_vue_vue_type_style_index_0_id_baa53e46_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_friends_vue_vue_type_style_index_0_id_baa53e46_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 182:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".friends-page[data-v-baa53e46]{max-width:1000px;margin:0 auto;padding:20px}.page-header[data-v-baa53e46]{margin-bottom:16px}.page-header .back-link[data-v-baa53e46]{font-size:14px;color:#947358}.page-header .back-link .back-icon[data-v-baa53e46]{margin-right:4px}.page-header .page-title[data-v-baa53e46]{font-size:22px;color:#333;margin:12px 0 0}.friends-card[data-v-baa53e46]{background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.06);padding:0 20px 20px}.tab-body[data-v-baa53e46]{min-height:200px}.empty-state[data-v-baa53e46]{display:flex;flex-direction:column;align-items:center;padding:40px 0;color:#999}.empty-state .empty-image[data-v-baa53e46]{width:120px;margin-bottom:12px}.user-grid[data-v-baa53e46]{display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:16px;margin-top:15px}.user-card[data-v-baa53e46]{display:flex;align-items:center;gap:12px;padding:14px;border:1px solid #f0f0f0;border-radius:8px}.user-card[data-v-baa53e46]:hover{border-color:#e0d5c8;background:#faf8f5}.user-card .avatar[data-v-baa53e46]{width:48px;height:48px;border-radius:50%;object-fit:cover;flex-shrink:0;cursor:pointer;background:#f5f5f5}.user-card .user-meta[data-v-baa53e46]{flex:1;min-width:0}.user-card .user-meta .name[data-v-baa53e46]{display:block;font-size:15px;color:#333;font-weight:500;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.user-card .user-meta .motto[data-v-baa53e46]{display:block;font-size:12px;color:#999;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.user-card .user-actions[data-v-baa53e46]{display:flex;flex-direction:column;gap:6px;flex-shrink:0}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/friends.vue?vue&type=template&id=baa53e46&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "friends-page"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-baa53e46>", "</div>", [_c('nuxt-link', {
    staticClass: "back-link",
    attrs: {
      "to": _vm.backTarget
    }
  }, [_c('span', {
    staticClass: "back-icon"
  }, [_vm._v("←")]), _vm._v(" " + _vm._s(_vm.isSelf ? '返回个人中心' : '返回用户主页') + "\n    ")]), _vm._ssrNode(" <h1 class=\"page-title\" data-v-baa53e46>" + _vm._ssrEscape(_vm._s(_vm.isSelf ? '我的好友' : 'TA的关注关系')) + "</h1>")], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"friends-card\" data-v-baa53e46>", "</div>", [_c('el-tabs', {
    model: {
      value: _vm.activeTab,
      callback: function ($$v) {
        _vm.activeTab = $$v;
      },
      expression: "activeTab"
    }
  }, [_c('el-tab-pane', {
    attrs: {
      "label": "好友",
      "name": "friends"
    }
  }, [_c('div', {
    directives: [{
      name: "loading",
      rawName: "v-loading",
      value: _vm.loading,
      expression: "loading"
    }],
    staticClass: "tab-body"
  }, [!_vm.loading && _vm.friendsList.length === 0 ? _c('div', {
    staticClass: "empty-state"
  }, [_c('img', {
    staticClass: "empty-image",
    attrs: {
      "src": "/nothing.png",
      "alt": "暂无内容"
    }
  }), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.isSelf ? '还没有互相关注的好友，去关注别人吧' : 'TA还没有互相关注的好友'))])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "user-grid"
  }, _vm._l(_vm.friendsList, function (item) {
    return _c('div', {
      key: item.user_id,
      staticClass: "user-card"
    }, [_c('img', {
      staticClass: "avatar",
      attrs: {
        "src": item.avatar_url || '/default-avatar.png',
        "alt": item.name
      },
      on: {
        "click": function ($event) {
          return _vm.gotoUserProfile(item.user_id);
        },
        "error": function ($event) {
          $event.target.src = '/default-avatar.png';
        }
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "user-meta"
    }, [_c('span', {
      staticClass: "name",
      on: {
        "click": function ($event) {
          return _vm.gotoUserProfile(item.user_id);
        }
      }
    }, [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('span', {
      staticClass: "motto"
    }, [_vm._v(_vm._s(item.motto || '这个人很懒，什么都没留下...'))])]), _vm._v(" "), _c('div', {
      staticClass: "user-actions"
    }, [_c('el-button', {
      attrs: {
        "size": "mini"
      },
      on: {
        "click": function ($event) {
          return _vm.sendPrivateMessage(item.user_id);
        }
      }
    }, [_vm._v("私信")]), _vm._v(" "), _vm.isSelf ? _c('el-button', {
      attrs: {
        "size": "mini",
        "type": "primary",
        "plain": "",
        "loading": _vm.followLoadingId === item.user_id
      },
      on: {
        "click": function ($event) {
          return _vm.toggleFollow(item);
        }
      }
    }, [_vm._v("已互关")]) : _vm._e()], 1)]);
  }), 0)])]), _vm._v(" "), _c('el-tab-pane', {
    attrs: {
      "label": `粉丝 (${_vm.fansList.length})`,
      "name": "fans"
    }
  }, [_c('div', {
    directives: [{
      name: "loading",
      rawName: "v-loading",
      value: _vm.loading,
      expression: "loading"
    }],
    staticClass: "tab-body"
  }, [!_vm.loading && _vm.fansList.length === 0 ? _c('div', {
    staticClass: "empty-state"
  }, [_c('img', {
    staticClass: "empty-image",
    attrs: {
      "src": "/nothing.png",
      "alt": "暂无内容"
    }
  }), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.isSelf ? '还没有人关注你' : '还没有人关注TA'))])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "user-grid"
  }, _vm._l(_vm.fansList, function (item) {
    return _c('div', {
      key: item.user_id,
      staticClass: "user-card"
    }, [_c('img', {
      staticClass: "avatar",
      attrs: {
        "src": item.avatar_url || '/default-avatar.png',
        "alt": item.name
      },
      on: {
        "click": function ($event) {
          return _vm.gotoUserProfile(item.user_id);
        },
        "error": function ($event) {
          $event.target.src = '/default-avatar.png';
        }
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "user-meta"
    }, [_c('span', {
      staticClass: "name",
      on: {
        "click": function ($event) {
          return _vm.gotoUserProfile(item.user_id);
        }
      }
    }, [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('span', {
      staticClass: "motto"
    }, [_vm._v(_vm._s(item.motto || '这个人很懒，什么都没留下...'))])]), _vm._v(" "), _c('div', {
      staticClass: "user-actions"
    }, [_c('el-button', {
      attrs: {
        "size": "mini"
      },
      on: {
        "click": function ($event) {
          return _vm.sendPrivateMessage(item.user_id);
        }
      }
    }, [_vm._v("私信")]), _vm._v(" "), _vm.isSelf ? _c('el-button', {
      attrs: {
        "size": "mini",
        "type": _vm.isFollowing(item.user_id) ? '' : 'primary',
        "plain": _vm.isFollowing(item.user_id),
        "loading": _vm.followLoadingId === item.user_id
      },
      on: {
        "click": function ($event) {
          return _vm.toggleFollow(item);
        }
      }
    }, [_vm._v("\n                  " + _vm._s(_vm.isFollowing(item.user_id) ? '互相关注' : '关注') + "\n                ")]) : _vm._e()], 1)]);
  }), 0)])]), _vm._v(" "), _c('el-tab-pane', {
    attrs: {
      "label": `关注 (${_vm.followsList.length})`,
      "name": "follows"
    }
  }, [_c('div', {
    directives: [{
      name: "loading",
      rawName: "v-loading",
      value: _vm.loading,
      expression: "loading"
    }],
    staticClass: "tab-body"
  }, [!_vm.loading && _vm.followsList.length === 0 ? _c('div', {
    staticClass: "empty-state"
  }, [_c('img', {
    staticClass: "empty-image",
    attrs: {
      "src": "/nothing.png",
      "alt": "暂无内容"
    }
  }), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.isSelf ? '你还没有关注任何人' : 'TA还没有关注任何人'))])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "user-grid"
  }, _vm._l(_vm.followsList, function (item) {
    return _c('div', {
      key: item.user_id,
      staticClass: "user-card"
    }, [_c('img', {
      staticClass: "avatar",
      attrs: {
        "src": item.avatar_url || '/default-avatar.png',
        "alt": item.name
      },
      on: {
        "click": function ($event) {
          return _vm.gotoUserProfile(item.user_id);
        },
        "error": function ($event) {
          $event.target.src = '/default-avatar.png';
        }
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "user-meta"
    }, [_c('span', {
      staticClass: "name",
      on: {
        "click": function ($event) {
          return _vm.gotoUserProfile(item.user_id);
        }
      }
    }, [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('span', {
      staticClass: "motto"
    }, [_vm._v(_vm._s(item.motto || '这个人很懒，什么都没留下...'))])]), _vm._v(" "), _c('div', {
      staticClass: "user-actions"
    }, [_c('el-button', {
      attrs: {
        "size": "mini"
      },
      on: {
        "click": function ($event) {
          return _vm.sendPrivateMessage(item.user_id);
        }
      }
    }, [_vm._v("私信")]), _vm._v(" "), _vm.isSelf ? _c('el-button', {
      attrs: {
        "size": "mini",
        "plain": _vm.isFan(item.user_id),
        "loading": _vm.followLoadingId === item.user_id
      },
      on: {
        "click": function ($event) {
          return _vm.toggleFollow(item);
        }
      }
    }, [_vm._v("\n                  " + _vm._s(_vm.isFan(item.user_id) ? '已互关' : '已关注') + "\n                ")]) : _vm._e()], 1)]);
  }), 0)])])], 1)], 1)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/me/friends.vue?vue&type=template&id=baa53e46&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/friends.vue?vue&type=script&lang=js
/* harmony default export */ var friendsvue_type_script_lang_js = ({
  layout: 'default',
  data() {
    return {
      activeTab: 'friends',
      userId: null,
      isSelf: true,
      fansList: [],
      followsList: [],
      loading: false,
      followLoadingId: null
    };
  },
  computed: {
    backTarget() {
      return this.isSelf ? '/me' : `/users/${this.userId}`;
    },
    // 后端没有可靠的互关接口，用粉丝和关注两个列表求交集
    friendsList() {
      const followIds = new Set(this.followsList.map(item => String(item.user_id)));
      return this.fansList.filter(item => followIds.has(String(item.user_id)));
    }
  },
  async mounted() {
    if (!localStorage.getItem('token')) {
      this.$message.warning('请先登录');
      this.$router.push('/login');
      return;
    }
    const queryTab = this.$route.query.tab;
    if (queryTab === '0') this.activeTab = 'follows';else if (queryTab === '1') this.activeTab = 'fans';else if (['friends', 'fans', 'follows'].includes(queryTab)) this.activeTab = queryTab;
    try {
      const myUserId = Number((await this.$api.users.getUserProfile()).user_id);
      // 支持从他人主页带入 id 查看 TA 的关注关系，默认看自己
      this.userId = Number(this.$route.query.id) || myUserId;
      this.isSelf = this.userId === myUserId;
    } catch (error) {
      console.error('获取用户信息失败', error);
      localStorage.removeItem('token');
      this.$router.push('/login?msg=unAuthorized');
      return;
    }
    this.loadRelations();
  },
  methods: {
    async loadRelations() {
      this.loading = true;
      try {
        const [fansResponse, followsResponse] = await Promise.all([this.$api.users.getUserFans(this.userId), this.$api.users.getUserFollows(this.userId)]);
        this.fansList = (fansResponse.data || []).map(item => ({
          ...item,
          user_id: Number(item.user_id)
        }));
        // 关注列表返回的是 follow_id，统一成 user_id 供模板使用
        this.followsList = (followsResponse.data || []).map(item => ({
          ...item,
          user_id: Number(item.follow_id)
        }));
      } catch (error) {
        console.error('获取关注关系失败', error);
        this.$message.error('好友信息加载失败');
      } finally {
        this.loading = false;
      }
    },
    isFollowing(userId) {
      return this.followsList.some(item => item.user_id === Number(userId));
    },
    isFan(userId) {
      return this.fansList.some(item => item.user_id === Number(userId));
    },
    async toggleFollow(user) {
      this.followLoadingId = user.user_id;
      try {
        const following = this.isFollowing(user.user_id);
        const response = following ? await this.$api.users.unfollowUser(user.user_id) : await this.$api.users.followUser(user.user_id);
        if (response.code !== 0) throw new Error(response.message || '操作失败');
        this.$message.success(following ? '已取消关注' : '关注成功');
        await this.loadRelations();
      } catch (error) {
        console.error('关注操作失败', error);
        this.$message.error('操作失败，请重试');
      } finally {
        this.followLoadingId = null;
      }
    },
    gotoUserProfile(userId) {
      this.$router.push(`/users/${userId}`);
    },
    sendPrivateMessage(userId) {
      this.$router.push(`/community/chat?id=${userId}`);
    }
  },
  head() {
    return {
      title: (this.isSelf ? '我的好友' : 'TA的关注关系') + ' - 原木社区'
    };
  }
});
// CONCATENATED MODULE: ./pages/me/friends.vue?vue&type=script&lang=js
 /* harmony default export */ var me_friendsvue_type_script_lang_js = (friendsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/me/friends.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(181)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  me_friendsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "baa53e46",
  "6f2dfa07"
  
)

/* harmony default export */ var friends = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=friends.js.map