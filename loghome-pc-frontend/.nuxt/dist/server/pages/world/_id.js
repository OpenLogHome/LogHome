exports.ids = [20];
exports.modules = {

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(211);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("e5c8533c", content, true, context)
};

/***/ }),

/***/ 210:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_722a71b8_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(142);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_722a71b8_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_722a71b8_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_722a71b8_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_722a71b8_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 211:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".world-page[data-v-722a71b8]{max-width:1200px;margin:0 auto;padding:20px}.world-page .error-container[data-v-722a71b8]{text-align:center;padding:40px 0}.world-page .error-container p[data-v-722a71b8]{font-size:18px;color:#ff4d4f;margin-bottom:20px}.world-page .error-container .back-button[data-v-722a71b8]{display:inline-block;padding:8px 16px;background-color:#947358;color:#fff;border-radius:4px;text-decoration:none}.world-page .error-container .back-button[data-v-722a71b8]:hover{background-color:#704c35}.world-page .world-container[data-v-722a71b8]{background-color:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);overflow:hidden}.world-page .world-container .world-header[data-v-722a71b8]{position:relative;display:flex;padding:30px;background-image:linear-gradient(to top, #ffffff, #fff2d0)}.world-page .world-container .world-header .world-cover[data-v-722a71b8]{width:180px;height:240px;border-radius:8px;background-size:cover;background-position:center;box-shadow:0 4px 12px rgba(0,0,0,.15);flex-shrink:0}.world-page .world-container .world-header .world-id-tag[data-v-722a71b8]{position:absolute;top:10px;left:10px;background-color:rgba(0,0,0,.6);color:#fff;padding:2px 8px;border-radius:4px;font-size:12px}.world-page .world-container .world-header .world-info[data-v-722a71b8]{margin-left:30px;flex-grow:1}.world-page .world-container .world-header .world-info .world-title[data-v-722a71b8]{font-size:28px;font-weight:bold;margin-bottom:15px;background-image:linear-gradient(to right, black, #947358);-webkit-background-clip:text;color:rgba(0,0,0,0)}.world-page .world-container .world-header .world-info .world-meta[data-v-722a71b8]{display:flex;align-items:center;margin-bottom:15px}.world-page .world-container .world-header .world-info .world-meta .author-info[data-v-722a71b8]{display:flex;align-items:center;cursor:pointer}.world-page .world-container .world-header .world-info .world-meta .author-info .author-avatar[data-v-722a71b8],.world-page .world-container .world-header .world-info .world-meta .author-info .author-avatar-placeholder[data-v-722a71b8]{width:40px;height:40px;border-radius:50%;margin-right:10px;object-fit:cover}.world-page .world-container .world-header .world-info .world-meta .author-info .author-avatar-placeholder[data-v-722a71b8]{background-color:#947358;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px}.world-page .world-container .world-header .world-info .world-meta .author-info .author-name[data-v-722a71b8]{font-size:16px;color:#666}.world-page .world-container .world-header .world-info .world-meta .author-info .author-name[data-v-722a71b8]:hover{color:#947358}.world-page .world-container .world-header .world-info .world-update-time[data-v-722a71b8]{font-size:14px;color:#999;margin-bottom:15px}.world-page .world-container .world-header .world-info .world-desc[data-v-722a71b8]{font-size:14px;color:#333;line-height:1.6;margin-bottom:20px;max-height:100px;overflow-y:auto}.world-page .world-container .world-header .world-info .edit-button[data-v-722a71b8]{display:inline-block;padding:8px 20px;background-color:#947358;color:#fff;border:1px solid #947358;border-radius:20px;font-size:14px;cursor:pointer;transition:all .3s}.world-page .world-container .world-header .world-info .edit-button[data-v-722a71b8]:hover{background-color:#704c35;border-color:#704c35}.world-page .world-container .world-content[data-v-722a71b8]{padding:20px 30px 30px}.world-page .world-container .world-content .world-section[data-v-722a71b8]{margin-top:10px}.world-page .world-container .world-content .world-section .section-header[data-v-722a71b8]{display:flex;align-items:center;margin:20px 0 15px}.world-page .world-container .world-content .world-section .section-header .section-line[data-v-722a71b8]{width:4px;height:18px;background-color:#947358;margin-right:10px}.world-page .world-container .world-content .world-section .section-header h3[data-v-722a71b8]{font-size:18px;color:#704c35;font-weight:bold;margin:0}.world-page .world-container .world-content .world-section .vocab-tags[data-v-722a71b8]{display:flex;flex-wrap:wrap;margin-top:15px}.world-page .world-container .world-content .world-section .vocab-tags .vocab-tag[data-v-722a71b8]{margin:0 10px 10px 0;cursor:pointer;background-color:rgba(148,115,88,.1);border-color:rgba(148,115,88,.2);color:#704c35}.world-page .world-container .world-content .world-section .vocab-tags .vocab-tag[data-v-722a71b8]:hover{background-color:rgba(148,115,88,.2);border-color:rgba(148,115,88,.3);color:#704c35}.world-page .world-container .world-content .associated-novels .novel-card[data-v-722a71b8]{display:flex;padding:15px;border-bottom:1px solid #f0f0f0;text-decoration:none;color:inherit}.world-page .world-container .world-content .associated-novels .novel-card[data-v-722a71b8]:last-child{border-bottom:none}.world-page .world-container .world-content .associated-novels .novel-card[data-v-722a71b8]:hover{background-color:#f9f9f9}.world-page .world-container .world-content .associated-novels .novel-card .novel-cover[data-v-722a71b8]{width:120px;height:160px;flex-shrink:0}.world-page .world-container .world-content .associated-novels .novel-card .novel-cover img[data-v-722a71b8]{width:100%;height:100%;object-fit:cover;border-radius:4px}.world-page .world-container .world-content .associated-novels .novel-card .novel-info[data-v-722a71b8]{margin-left:20px;flex-grow:1}.world-page .world-container .world-content .associated-novels .novel-card .novel-info .novel-title[data-v-722a71b8]{font-size:18px;font-weight:bold;margin-bottom:10px;display:flex;align-items:center}.world-page .world-container .world-content .associated-novels .novel-card .novel-info .novel-title .novel-tag[data-v-722a71b8]{font-size:12px;padding:2px 6px;background-color:#ffd591;color:#873800;border-radius:4px;margin-left:10px;font-weight:normal}.world-page .world-container .world-content .associated-novels .novel-card .novel-info .novel-author[data-v-722a71b8]{display:flex;align-items:center;margin-bottom:10px}.world-page .world-container .world-content .associated-novels .novel-card .novel-info .novel-author .author-avatar[data-v-722a71b8]{width:24px;height:24px;border-radius:50%;margin-right:8px}.world-page .world-container .world-content .associated-novels .novel-card .novel-info .novel-author .author-name[data-v-722a71b8]{font-size:14px;color:#666}.world-page .world-container .world-content .associated-novels .novel-card .novel-info .novel-desc[data-v-722a71b8]{font-size:14px;color:#999;line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}.world-page .world-container .world-content .nothing[data-v-722a71b8]{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 0}.world-page .world-container .world-content .nothing .nothing-img[data-v-722a71b8]{width:80px;height:80px;opacity:.5;margin-bottom:15px}.world-page .world-container .world-content .nothing .nothing-text[data-v-722a71b8]{font-size:14px;color:#999}@media(max-width: 768px){.world-page[data-v-722a71b8]{padding:10px}.world-page .world-container .world-header[data-v-722a71b8]{flex-direction:column;padding:20px}.world-page .world-container .world-header .world-cover[data-v-722a71b8]{width:120px;height:160px;margin-bottom:20px}.world-page .world-container .world-header .world-info[data-v-722a71b8]{margin-left:0}.world-page .world-container .world-header .world-info .world-title[data-v-722a71b8]{font-size:22px}.world-page .world-container .world-content[data-v-722a71b8]{padding:15px}}[data-v-722a71b8] .el-tabs__active-bar{background-color:#947358}[data-v-722a71b8] .el-tabs__item:hover{color:#947358}[data-v-722a71b8] .el-tabs__item.is-active{color:#947358}[data-v-722a71b8] .el-collapse-item__header:hover{color:#947358}[data-v-722a71b8] .el-collapse-item__header.is-active{color:#947358;border-bottom-color:#947358}[data-v-722a71b8] .el-collapse-item__wrap{border-bottom-color:#ebeef5}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 245:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/world/_id.vue?vue&type=template&id=722a71b8&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "world-page"
  }, [_vm.error ? _vm._ssrNode("<div class=\"error-container\" data-v-722a71b8>", "</div>", [_vm._ssrNode("<p data-v-722a71b8>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> "), _c('nuxt-link', {
    staticClass: "back-button",
    attrs: {
      "to": "/read"
    }
  }, [_vm._v("返回阅读列表")])], 2) : _vm._e(), _vm._ssrNode(" "), !_vm.error && _vm.world ? _vm._ssrNode("<div class=\"world-container\" data-v-722a71b8>", "</div>", [_vm._ssrNode("<div class=\"world-header\" data-v-722a71b8>" + (_vm.world.picUrl ? "<div class=\"world-cover\"" + _vm._ssrStyle(null, `background-image: url(${_vm.world.picUrl})`, null) + " data-v-722a71b8></div>" : "<div class=\"world-cover\"" + _vm._ssrStyle(null, `background-color: hsl(${_vm.world.novel_id * 30 % 360}, 70%, 80%)`, null) + " data-v-722a71b8></div>") + " <div class=\"world-id-tag\" data-v-722a71b8>" + _vm._ssrEscape("ID " + _vm._s(_vm.world.novel_id)) + "</div> <div class=\"world-info\" data-v-722a71b8><h1 class=\"world-title\" data-v-722a71b8>" + _vm._ssrEscape(_vm._s(_vm.world.name)) + "</h1> <div class=\"world-meta\" data-v-722a71b8><div class=\"author-info\" data-v-722a71b8>" + (_vm.world.avatar_url || _vm.world.auther_avatar ? "<img" + _vm._ssrAttr("src", _vm.world.avatar_url || _vm.world.auther_avatar) + " alt=\"作者头像\"" + _vm._ssrAttr("onerror", `this.onerror=null;this.src='/static/default-avatar.png'`) + " class=\"author-avatar\" data-v-722a71b8>" : "<div class=\"author-avatar-placeholder\" data-v-722a71b8>" + _vm._ssrEscape(_vm._s(_vm.world.user_name ? _vm.world.user_name.charAt(0) : '作')) + "</div>") + " <span class=\"author-name\" data-v-722a71b8>" + _vm._ssrEscape(_vm._s(_vm.world.user_name || _vm.world.author_name || '佚名')) + "</span></div></div> <div class=\"world-update-time\" data-v-722a71b8>" + _vm._ssrEscape("\n          最近更新：" + _vm._s(_vm.formatDate(_vm.world.update_time)) + "\n        ") + "</div> <div class=\"world-desc\" data-v-722a71b8>" + _vm._ssrEscape("\n          " + _vm._s(_vm.world.content) + "\n        ") + "</div> " + (_vm.isCreator ? "<div class=\"edit-button\" data-v-722a71b8>\n          编辑设定\n        </div>" : "<!---->") + "</div></div> "), _vm._ssrNode("<div class=\"world-content\" data-v-722a71b8>", "</div>", [_c('el-tabs', [_c('el-tab-pane', {
    attrs: {
      "label": "世界设定"
    }
  }, [_c('div', {
    staticClass: "world-section"
  }, [_c('div', {
    staticClass: "section-header"
  }, [_c('div', {
    staticClass: "section-line"
  }), _vm._v(" "), _c('h3', [_vm._v("世界大纲")])]), _vm._v(" "), _vm.worldOutlines.length > 0 ? _c('el-collapse', {
    attrs: {
      "accordion": ""
    }
  }, _vm._l(_vm.worldOutlines, function (outline) {
    return _c('el-collapse-item', {
      key: outline.article_id,
      attrs: {
        "title": outline.title,
        "name": outline.article_id
      }
    }, [_c('div', {
      staticClass: "article-content",
      on: {
        "click": function ($event) {
          return _vm.gotoArticle(outline.article_id);
        }
      }
    }, [_vm._v("\n                  查看详情\n                ")])]);
  }), 1) : _c('div', {
    staticClass: "nothing"
  }, [_c('img', {
    staticClass: "nothing-img",
    attrs: {
      "src": "/static/default-avatar.png",
      "alt": "暂无内容"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "nothing-text"
  }, [_vm._v("这是一片什么都没有的荒原")])]), _vm._v(" "), _c('div', {
    staticClass: "section-header"
  }, [_c('div', {
    staticClass: "section-line"
  }), _vm._v(" "), _c('h3', [_vm._v("世界词条")])]), _vm._v(" "), _vm.worldVocabs.length > 0 ? _c('div', {
    staticClass: "vocab-tags"
  }, _vm._l(_vm.worldVocabs, function (vocab) {
    return _c('el-tag', {
      key: vocab.article_id,
      staticClass: "vocab-tag",
      on: {
        "click": function ($event) {
          return _vm.gotoArticle(vocab.article_id);
        }
      }
    }, [_vm._v("\n                " + _vm._s(vocab.title) + "\n              ")]);
  }), 1) : _c('div', {
    staticClass: "nothing"
  }, [_c('img', {
    staticClass: "nothing-img",
    attrs: {
      "src": "/static/default-avatar.png",
      "alt": "暂无内容"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "nothing-text"
  }, [_vm._v("这是一片什么都没有的荒原")])])], 1)]), _vm._v(" "), _c('el-tab-pane', {
    attrs: {
      "label": "关联作品"
    }
  }, [_vm.assoNovels.length > 0 ? _c('div', {
    staticClass: "associated-novels"
  }, _vm._l(_vm.assoNovels, function (novel) {
    return _c('nuxt-link', {
      key: novel.novel_id,
      staticClass: "novel-card",
      attrs: {
        "to": `/novel/${novel.novel_id}`
      }
    }, [_c('div', {
      staticClass: "novel-cover"
    }, [_c('img', {
      attrs: {
        "src": novel.picUrl ? novel.picUrl + '?thumbnail=1' : '/static/user/defaultCover.jpg',
        "alt": novel.name,
        "onerror": `this.onerror=null;this.src='/static/user/defaultCover.jpg'`
      }
    })]), _vm._v(" "), _c('div', {
      staticClass: "novel-info"
    }, [_c('h4', {
      staticClass: "novel-title"
    }, [_vm._v("\n                  " + _vm._s(novel.name) + "\n                  "), novel.novel_type === 'world' ? _c('span', {
      staticClass: "novel-tag"
    }, [_vm._v("世界设定")]) : _vm._e()]), _vm._v(" "), _c('div', {
      staticClass: "novel-author"
    }, [_c('img', {
      staticClass: "author-avatar",
      attrs: {
        "src": novel.avatar_url || novel.auther_avatar || '/static/default-avatar.png',
        "alt": "作者头像",
        "onerror": `this.onerror=null;this.src='/static/default-avatar.png'`
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "author-name"
    }, [_vm._v(_vm._s(novel.user_name || novel.author_name || '佚名'))])]), _vm._v(" "), _c('p', {
      staticClass: "novel-desc"
    }, [_vm._v(_vm._s(_vm.truncateText(novel.content, 100)))])])]);
  }), 1) : _c('div', {
    staticClass: "nothing"
  }, [_c('img', {
    staticClass: "nothing-img",
    attrs: {
      "src": "/static/default-avatar.png",
      "alt": "暂无内容"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "nothing-text"
  }, [_vm._v("这是一片什么都没有的荒原")])])])], 1)], 1)], 2) : _vm._e()], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/world/_id.vue?vue&type=template&id=722a71b8&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/world/_id.vue?vue&type=script&lang=js
// 移除不必要的axios导入

/* harmony default export */ var _idvue_type_script_lang_js = ({
  head() {
    return {
      title: this.world ? `${this.world.name} - 世界设定 - 原木社区` : '世界设定 - 原木社区',
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.world ? this.truncateText(this.world.content, 150) : '原木社区世界设定'
      }]
    };
  },
  async asyncData({
    params,
    $api,
    error
  }) {
    try {
      const worldId = params.id;
      const world = await $api.novels.getNovelById(worldId);
      if (!world || world.length === 0) {
        return {
          error: '未找到该世界设定'
        };
      }
      const worldData = world[0];

      // worldData中已经包含作者信息，无需额外获取
      // 如果author_name存在，使用author_name作为user_name
      if (worldData.author_name && !worldData.user_name) {
        worldData.user_name = worldData.author_name;
      }

      // 获取世界大纲和词条
      const articles = (await $api.articles.getArticles(worldData.novel_id)) || [];
      const worldOutlines = articles.filter(item => item.article_type === 'worldOutline');
      const worldVocabs = articles.filter(item => item.article_type === 'worldVocabulary');

      // 获取关联作品 - 使用世界关联作品API
      const assoNovels = (await $api.worlds.getAssoWorldByWorldId(worldData.novel_id)) || [];

      // 关联作品中已包含作者信息，确保使用正确的字段
      for (const novel of assoNovels) {
        if (novel.author_name && !novel.user_name) {
          novel.user_name = novel.author_name;
        }
      }
      return {
        world: worldData,
        worldOutlines,
        worldVocabs,
        assoNovels
      };
    } catch (err) {
      console.error('获取世界设定失败:', err);
      return {
        error: '获取世界设定失败'
      };
    }
  },
  data() {
    return {
      error: null,
      world: null,
      worldOutlines: [],
      worldVocabs: [],
      assoNovels: [],
      userInfo: null
    };
  },
  computed: {
    isCreator() {
      return this.userInfo && this.world && this.userInfo.user_id === this.world.creator_id;
    }
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      try {
        const token = this.$store.state.auth.token;
        if (!token) return;
        const userInfo = await this.$api.users.getUserProfile();
        this.userInfo = userInfo;
        // 确保用户信息加载后重新检查创建者权限
        this.checkCreatorPermission();
      } catch (err) {
        console.error('获取用户信息失败:', err);
      }
    },
    formatDate(utcDatetime) {
      if (!utcDatetime) return '';
      const date = new Date(utcDatetime);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
    gotoUserProfile(userId) {
      if (!userId) return;
      this.$router.push(`/users/${userId}`);
    },
    gotoArticle(articleId) {
      this.$router.push(`/article/${articleId}`);
    },
    editWorld(novelId) {
      this.$router.push(`/write/edit/${novelId}?worldId=${this.world.world_id}`);
    },
    checkCreatorPermission() {
      if (this.userInfo && this.world) {
        // 验证当前用户是否为创建者
        this.isCreator = this.userInfo.user_id === this.world.creator_id;
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/world/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var world_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/world/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(210)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  world_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "722a71b8",
  "5cff58c4"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map