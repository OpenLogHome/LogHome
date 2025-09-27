exports.ids = [6];
exports.modules = {

/***/ 135:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(191);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("f164b5b2", content, true, context)
};

/***/ }),

/***/ 190:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_fd7f0c4e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(135);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_fd7f0c4e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_fd7f0c4e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_fd7f0c4e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_fd7f0c4e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 191:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.post-detail-page[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  justify-content: center;\r\n  padding: 20px;\r\n  background-color: #f5f5f5;\n}\n.post-detail-container[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  width: 100%;\r\n  max-width: 1200px;\r\n  gap: 20px;\n}\n.post-detail-main[data-v-fd7f0c4e] {\r\n  flex: 1;\r\n  min-width: 0;\n}\n.comments-section-sidebar[data-v-fd7f0c4e] {\r\n  width: 400px;\r\n  flex-shrink: 0;\n}\n.post-detail[data-v-fd7f0c4e] {\r\n  background-color: #fff;\r\n  border-radius: 8px;\r\n  padding: 24px;\r\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n}\n.comments-section[data-v-fd7f0c4e] {\r\n  background-color: #fff;\r\n  border-radius: 8px;\r\n  padding: 24px;\r\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n}\r\n\r\n/* 帖子头部 */\n.post-header[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  margin-bottom: 20px;\n}\n.user-info[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  align-items: center;\r\n  cursor: pointer;\n}\n.user-avatar[data-v-fd7f0c4e] {\r\n  width: 48px;\r\n  height: 48px;\r\n  border-radius: 50%;\r\n  margin-right: 12px;\r\n  object-fit: cover;\n}\n.user-meta[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  flex-direction: column;\n}\n.user-name[data-v-fd7f0c4e] {\r\n  font-weight: bold;\r\n  color: #333;\n}\n.post-time[data-v-fd7f0c4e] {\r\n  font-size: 12px;\r\n  color: #999;\n}\n.post-circle[data-v-fd7f0c4e] {\r\n  background-color: #f0f2f5;\r\n  color: #666;\r\n  padding: 6px 12px;\r\n  border-radius: 16px;\r\n  font-size: 14px;\r\n  cursor: pointer;\r\n  transition: background-color 0.3s;\n}\n.post-circle[data-v-fd7f0c4e]:hover {\r\n  background-color: #e4e6e9;\n}\r\n\r\n/* 帖子内容 */\n.post-content[data-v-fd7f0c4e] {\r\n  margin-bottom: 24px;\n}\n.post-title[data-v-fd7f0c4e] {\r\n  font-size: 24px;\r\n  font-weight: bold;\r\n  margin-bottom: 16px;\r\n  color: #333;\n}\n.post-text[data-v-fd7f0c4e] {\r\n  font-size: 16px;\r\n  line-height: 1.8;\r\n  color: #555;\r\n  white-space: pre-wrap;\n}\r\n\r\n/* 帖子图片 */\n.post-images[data-v-fd7f0c4e] {\r\n  margin-bottom: 24px;\n}\n.image-grid[data-v-fd7f0c4e] {\r\n  display: grid;\r\n  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));\r\n  gap: 10px;\n}\n.post-image[data-v-fd7f0c4e] {\r\n  width: 100%;\r\n  height: auto;\r\n  aspect-ratio: 1 / 1;\r\n  object-fit: cover;\r\n  border-radius: 8px;\r\n  cursor: pointer;\r\n  transition: transform 0.3s;\n}\n.post-image[data-v-fd7f0c4e]:hover {\r\n  transform: scale(1.05);\n}\r\n\r\n/* 绑定作品 */\n.linked-book[data-v-fd7f0c4e] {\r\n  margin-bottom: 24px;\n}\n.book-card[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  background-color: #f9f9f9;\r\n  border: 1px solid #eee;\r\n  border-radius: 8px;\r\n  padding: 16px;\r\n  cursor: pointer;\r\n  transition: box-shadow 0.3s;\n}\n.book-card[data-v-fd7f0c4e]:hover {\r\n  box-shadow: 0 2px 8px rgba(0,0,0,0.05);\n}\n.book-cover[data-v-fd7f0c4e] {\r\n  width: 80px;\r\n  height: 112px;\r\n  object-fit: cover;\r\n  border-radius: 4px;\r\n  margin-right: 16px;\n}\n.book-info[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\n}\n.book-name[data-v-fd7f0c4e] {\r\n  font-size: 16px;\r\n  font-weight: bold;\r\n  margin: 0 0 8px;\n}\n.book-author[data-v-fd7f0c4e] {\r\n  font-size: 14px;\r\n  color: #666;\r\n  margin: 0 0 8px;\n}\n.book-desc[data-v-fd7f0c4e] {\r\n  font-size: 14px;\r\n  color: #999;\r\n  margin: 0;\r\n  line-height: 1.5;\n}\r\n\r\n/* 帖子操作 */\n.post-actions[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 24px;\r\n  border-top: 1px solid #f0f0f0;\r\n  padding-top: 16px;\n}\n.action-btn[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 6px;\r\n  color: #666;\r\n  cursor: pointer;\r\n  font-size: 14px;\r\n  transition: color 0.3s;\n}\n.action-btn[data-v-fd7f0c4e]:hover,\r\n.action-btn.liked[data-v-fd7f0c4e] {\r\n  color: #EA7034;\n}\n.action-btn i[data-v-fd7f0c4e] {\r\n  font-size: 20px;\n}\n.post-owner-actions[data-v-fd7f0c4e] {\r\n  margin-left: auto;\n}\r\n\r\n/* 评论区 */\n.comments-title[data-v-fd7f0c4e] {\r\n  font-size: 18px;\r\n  font-weight: bold;\r\n  margin-bottom: 20px;\r\n  border-bottom: 1px solid #f0f0f0;\r\n  padding-bottom: 10px;\n}\n.comment-input-container[data-v-fd7f0c4e] {\r\n  margin-bottom: 24px;\n}\n.comment-actions[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  justify-content: flex-end;\r\n  margin-top: 10px;\n}\n.comments-list[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 24px;\n}\n.comment-item[data-v-fd7f0c4e] {\r\n  padding-bottom: 16px;\r\n  border-bottom: 1px solid #f0f0f0;\n}\n.comment-item[data-v-fd7f0c4e]:last-child {\r\n  border-bottom: none;\n}\n.comment-header[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: flex-start;\r\n  margin-bottom: 12px;\n}\n.user-avatar-small[data-v-fd7f0c4e] {\r\n  width: 24px;\r\n  height: 24px;\r\n  border-radius: 50%;\r\n  margin-right: 8px;\n}\n.comment-time[data-v-fd7f0c4e], .reply-time[data-v-fd7f0c4e] {\r\n  font-size: 12px;\r\n  color: #999;\n}\n.comment-content[data-v-fd7f0c4e], .reply-content[data-v-fd7f0c4e] {\r\n  font-size: 15px;\r\n  color: #555;\r\n  line-height: 1.7;\r\n  margin-left: 56px; /* 48px avatar + 8px margin */\r\n  white-space: pre-wrap;\n}\n.reply-content[data-v-fd7f0c4e] {\r\n  margin-left: 32px; /* 24px avatar + 8px margin */\n}\n.reply-to[data-v-fd7f0c4e] {\r\n  color: #007bff;\r\n  margin-right: 4px;\n}\n.comment-footer[data-v-fd7f0c4e], .reply-footer[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 20px;\r\n  margin-top: 12px;\r\n  margin-left: 56px;\n}\n.reply-footer[data-v-fd7f0c4e] {\r\n  margin-left: 32px;\n}\n.replies-list[data-v-fd7f0c4e] {\r\n  margin-top: 16px;\r\n  margin-left: 56px;\r\n  padding-left: 16px;\r\n  border-left: 2px solid #f0f0f0;\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 16px;\n}\n.reply-item[data-v-fd7f0c4e] {\r\n  /* No extra styling needed now */\n}\n.load-more-replies[data-v-fd7f0c4e] {\r\n  font-size: 14px;\r\n  color: #007bff;\r\n  cursor: pointer;\r\n  margin-top: 10px;\n}\n.reply-input-container[data-v-fd7f0c4e] {\r\n  margin-top: 16px;\r\n  margin-left: 56px;\n}\n.reply-actions[data-v-fd7f0c4e] {\r\n  display: flex;\r\n  justify-content: flex-end;\r\n  margin-top: 8px;\r\n  gap: 8px;\n}\n.no-comments[data-v-fd7f0c4e] {\r\n  text-align: center;\r\n  color: #999;\r\n  padding: 40px 0;\n}\n.no-comments i[data-v-fd7f0c4e] {\r\n  font-size: 48px;\r\n  margin-bottom: 16px;\n}\n.load-more[data-v-fd7f0c4e] {\r\n  text-align: center;\r\n  margin-top: 24px;\n}\r\n\r\n/* 分享对话框 */\n.share-dialog-content[data-v-fd7f0c4e] {\r\n  text-align: center;\n}\n.share-text[data-v-fd7f0c4e] {\r\n  margin-bottom: 16px;\r\n  white-space: pre-wrap;\r\n  word-break: break-all;\r\n  text-align: left;\r\n  background-color: #f5f5f5;\r\n  padding: 10px;\r\n  border-radius: 4px;\n}\n.share-actions[data-v-fd7f0c4e] {\r\n  margin-top: 16px;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/post/_id.vue?vue&type=template&id=fd7f0c4e&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "post-detail-page"
  }, [_vm._ssrNode("<div class=\"post-detail-container\" data-v-fd7f0c4e>", "</div>", [_vm._ssrNode("<div class=\"post-detail-main\" data-v-fd7f0c4e>", "</div>", [_vm.post ? _vm._ssrNode("<div class=\"post-detail\" data-v-fd7f0c4e>", "</div>", [_vm._ssrNode("<div class=\"post-header\" data-v-fd7f0c4e><div class=\"user-info\" data-v-fd7f0c4e><img" + _vm._ssrAttr("src", _vm.post.author_avatar) + " alt=\"用户头像\" class=\"user-avatar\" data-v-fd7f0c4e> <div class=\"user-meta\" data-v-fd7f0c4e><span class=\"user-name\" data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(_vm.post.author_name)) + "</span> <span class=\"post-time\" data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(_vm.formatTime(_vm.post.create_time))) + "</span></div></div> <div class=\"post-circle\" data-v-fd7f0c4e>" + _vm._ssrEscape("\n            " + _vm._s(_vm.post.circle_name) + "\n          ") + "</div></div> <div class=\"post-content\" data-v-fd7f0c4e><h1 class=\"post-title\" data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(_vm.post.title)) + "</h1> <p class=\"post-text\" data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(_vm.post.content)) + "</p></div> " + (_vm.post.media_urls && _vm.post.media_urls.length > 0 ? "<div class=\"post-images\" data-v-fd7f0c4e><div class=\"image-grid\" data-v-fd7f0c4e>" + _vm._ssrList(_vm.post.media_urls, function (img, imgIndex) {
    return "<img" + _vm._ssrAttr("src", img) + " alt=\"帖子图片\" class=\"post-image\" data-v-fd7f0c4e>";
  }) + "</div></div>" : "<!---->") + " " + (_vm.post.novel_id && _vm.post.novel ? "<div class=\"linked-book\" data-v-fd7f0c4e><div class=\"book-card\" data-v-fd7f0c4e><img" + _vm._ssrAttr("src", _vm.post.novel.picUrl) + " alt=\"作品封面\" class=\"book-cover\" data-v-fd7f0c4e> <div class=\"book-info\" data-v-fd7f0c4e><h4 class=\"book-name\" data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(_vm.post.novel.name)) + "</h4> <p class=\"book-author\" data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(_vm.post.novel.author_name)) + "</p> <p class=\"book-desc\" data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(_vm.post.novel.content && _vm.post.novel.content.length > 50 ? _vm.post.novel.content.substr(0, 50) + '...' : _vm.post.novel.content)) + "</p></div></div></div>" : "<!---->") + " "), _vm._ssrNode("<div class=\"post-actions\" data-v-fd7f0c4e>", "</div>", [_vm._ssrNode("<div class=\"action-btn\" data-v-fd7f0c4e><i class=\"el-icon-chat-dot-round\" data-v-fd7f0c4e></i> <span data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(_vm.post.comment_count || 0)) + "</span></div> <div" + _vm._ssrClass("action-btn", {
    liked: _vm.post.is_liked
  }) + " data-v-fd7f0c4e><i" + _vm._ssrClass(null, _vm.post.is_liked ? 'el-icon-star-on' : 'el-icon-star-off') + _vm._ssrStyle(null, {
    color: _vm.post.is_liked ? '#EA7034' : '#666'
  }, null) + " data-v-fd7f0c4e></i> <span" + _vm._ssrClass(null, {
    liked: _vm.post.is_liked
  }) + " data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(_vm.post.like_count || 0)) + "</span></div> <div class=\"action-btn\" data-v-fd7f0c4e><i class=\"el-icon-share\" data-v-fd7f0c4e></i> <span data-v-fd7f0c4e>分享</span></div> "), _vm.canEditPost || _vm.canDeletePost ? _vm._ssrNode("<div class=\"post-owner-actions\" data-v-fd7f0c4e>", "</div>", [_vm.canEditPost ? _c('el-button', {
    attrs: {
      "size": "small",
      "type": "text"
    },
    on: {
      "click": _vm.editPost
    }
  }, [_vm._v("编辑")]) : _vm._e(), _vm._ssrNode(" "), _vm.canDeletePost ? _c('el-button', {
    attrs: {
      "size": "small",
      "type": "text"
    },
    on: {
      "click": _vm.confirmDeletePost
    }
  }, [_vm._v("删除")]) : _vm._e()], 2) : _vm._e()], 2)], 2) : _vm._e()]), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"comments-section-sidebar\" data-v-fd7f0c4e>", "</div>", [_vm._ssrNode("<div class=\"comments-section\" data-v-fd7f0c4e>", "</div>", [_vm._ssrNode("<h3 class=\"comments-title\" data-v-fd7f0c4e>" + _vm._ssrEscape("评论 (" + _vm._s(_vm.post ? _vm.post.comment_count || 0 : 0) + ")") + "</h3> "), _vm._ssrNode("<div class=\"comment-input-container\" data-v-fd7f0c4e>", "</div>", [_c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 2,
      "placeholder": "写下你的评论...",
      "maxlength": 500,
      "show-word-limit": ""
    },
    model: {
      value: _vm.commentContent,
      callback: function ($$v) {
        _vm.commentContent = $$v;
      },
      expression: "commentContent"
    }
  }), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"comment-actions\" data-v-fd7f0c4e>", "</div>", [_c('el-button', {
    attrs: {
      "type": "primary",
      "disabled": !_vm.commentContent.trim() || _vm.isSubmitting
    },
    on: {
      "click": _vm.submitComment
    }
  }, [_vm._v("发布评论")])], 1)], 2), _vm._ssrNode(" "), _vm.comments.length > 0 ? _vm._ssrNode("<div class=\"comments-list\" data-v-fd7f0c4e>", "</div>", _vm._l(_vm.comments, function (comment) {
    return _vm._ssrNode("<div class=\"comment-item\" data-v-fd7f0c4e>", "</div>", [_vm._ssrNode("<div class=\"comment-header\" data-v-fd7f0c4e>", "</div>", [_vm._ssrNode("<div class=\"user-info\" data-v-fd7f0c4e><img" + _vm._ssrAttr("src", comment.user_avatar) + " alt=\"用户头像\" class=\"user-avatar\" data-v-fd7f0c4e> <div class=\"user-meta\" data-v-fd7f0c4e><span class=\"user-name\" data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(comment.user_name)) + "</span> <span class=\"comment-time\" data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(_vm.formatTime(comment.create_time))) + "</span></div></div> "), _vm._ssrNode("<div class=\"comment-actions\" data-v-fd7f0c4e>", "</div>", [_vm.isCommentOwner(comment) || _vm.isPostOwner ? _c('el-dropdown', {
      attrs: {
        "trigger": "click"
      }
    }, [_c('span', {
      staticClass: "el-dropdown-link"
    }, [_c('i', {
      staticClass: "el-icon-more"
    })]), _vm._v(" "), _c('el-dropdown-menu', {
      attrs: {
        "slot": "dropdown"
      },
      slot: "dropdown"
    }, [_vm.isCommentOwner(comment) || _vm.isPostOwner ? _c('el-dropdown-item', {
      nativeOn: {
        "click": function ($event) {
          return _vm.confirmDeleteComment(comment);
        }
      }
    }, [_vm._v("删除")]) : _vm._e()], 1)], 1) : _vm._e()], 1)], 2), _vm._ssrNode(" <div class=\"comment-content\" data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(comment.content)) + "</div> <div class=\"comment-footer\" data-v-fd7f0c4e><div" + _vm._ssrClass("action-btn", {
      liked: comment.is_liked
    }) + " data-v-fd7f0c4e><i" + _vm._ssrClass(null, comment.is_liked ? 'el-icon-star-on' : 'el-icon-star-off') + _vm._ssrStyle(null, {
      color: comment.is_liked ? '#EA7034' : '#666'
    }, null) + " data-v-fd7f0c4e></i> <span" + _vm._ssrClass(null, {
      liked: comment.is_liked
    }) + " data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(comment.like_count || 0)) + "</span></div> <div class=\"action-btn\" data-v-fd7f0c4e><i class=\"el-icon-chat-dot-round\" data-v-fd7f0c4e></i> <span data-v-fd7f0c4e>回复</span></div></div> "), comment.replies && comment.replies.length > 0 ? _vm._ssrNode("<div class=\"replies-list\" data-v-fd7f0c4e>", "</div>", [_vm._l(comment.replies, function (reply) {
      return _vm._ssrNode("<div class=\"reply-item\" data-v-fd7f0c4e>", "</div>", [_vm._ssrNode("<div class=\"reply-header\" data-v-fd7f0c4e>", "</div>", [_vm._ssrNode("<div class=\"user-info\" data-v-fd7f0c4e><img" + _vm._ssrAttr("src", reply.user_avatar) + " alt=\"用户头像\" class=\"user-avatar-small\" data-v-fd7f0c4e> <div class=\"user-meta\" data-v-fd7f0c4e><span class=\"user-name\" data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(reply.user_name)) + "</span> <span class=\"reply-time\" data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(_vm.formatTime(reply.create_time))) + "</span></div></div> "), _vm._ssrNode("<div class=\"reply-actions\" data-v-fd7f0c4e>", "</div>", [_vm.isCommentOwner(reply) || _vm.isPostOwner ? _c('el-dropdown', {
        attrs: {
          "trigger": "click"
        }
      }, [_c('span', {
        staticClass: "el-dropdown-link"
      }, [_c('i', {
        staticClass: "el-icon-more"
      })]), _vm._v(" "), _c('el-dropdown-menu', {
        attrs: {
          "slot": "dropdown"
        },
        slot: "dropdown"
      }, [_vm.isCommentOwner(reply) || _vm.isPostOwner ? _c('el-dropdown-item', {
        nativeOn: {
          "click": function ($event) {
            return _vm.confirmDeleteComment(reply);
          }
        }
      }, [_vm._v("删除")]) : _vm._e()], 1)], 1) : _vm._e()], 1)], 2), _vm._ssrNode(" <div class=\"reply-content\" data-v-fd7f0c4e>" + (reply.reply_to_user_id && reply.reply_to_user_id !== comment.user_id ? "<span class=\"reply-to\" data-v-fd7f0c4e>" + _vm._ssrEscape("回复 " + _vm._s(reply.reply_user_name) + "：") + "</span>" : "<!---->") + _vm._ssrEscape("\n                  " + _vm._s(reply.content) + "\n                ") + "</div> <div class=\"reply-footer\" data-v-fd7f0c4e><div" + _vm._ssrClass("action-btn", {
        liked: reply.is_liked
      }) + " data-v-fd7f0c4e><i" + _vm._ssrClass(null, reply.is_liked ? 'el-icon-star-on' : 'el-icon-star-off') + _vm._ssrStyle(null, {
        color: reply.is_liked ? '#EA7034' : '#666'
      }, null) + " data-v-fd7f0c4e></i> <span" + _vm._ssrClass(null, {
        liked: reply.is_liked
      }) + " data-v-fd7f0c4e>" + _vm._ssrEscape(_vm._s(reply.like_count || 0)) + "</span></div> <div class=\"action-btn\" data-v-fd7f0c4e><i class=\"el-icon-chat-dot-round\" data-v-fd7f0c4e></i> <span data-v-fd7f0c4e>回复</span></div></div>")], 2);
    }), _vm._ssrNode(" " + (comment.has_more_replies ? "<div class=\"load-more-replies\" data-v-fd7f0c4e><span data-v-fd7f0c4e>加载更多回复</span></div>" : "<!---->"))], 2) : _vm._e(), _vm._ssrNode(" "), _vm.replyingTo && _vm.replyingTo.comment_id === comment.comment_id ? _vm._ssrNode("<div class=\"reply-input-container\" data-v-fd7f0c4e>", "</div>", [_c('el-input', {
      attrs: {
        "type": "textarea",
        "rows": 1,
        "placeholder": _vm.replyingTo.reply_user_name ? `回复 ${_vm.replyingTo.reply_user_name}...` : '写下你的回复...',
        "maxlength": 500,
        "show-word-limit": ""
      },
      model: {
        value: _vm.replyContent,
        callback: function ($$v) {
          _vm.replyContent = $$v;
        },
        expression: "replyContent"
      }
    }), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"reply-actions\" data-v-fd7f0c4e>", "</div>", [_c('el-button', {
      attrs: {
        "size": "small"
      },
      on: {
        "click": _vm.cancelReply
      }
    }, [_vm._v("取消")]), _vm._ssrNode(" "), _c('el-button', {
      attrs: {
        "size": "small",
        "type": "primary",
        "disabled": !_vm.replyContent.trim() || _vm.isSubmitting
      },
      on: {
        "click": _vm.submitReply
      }
    }, [_vm._v("回复")])], 2)], 2) : _vm._e()], 2);
  }), 0) : _vm._ssrNode("<div class=\"no-comments\" data-v-fd7f0c4e><i class=\"el-icon-chat-dot-round\" data-v-fd7f0c4e></i> <p data-v-fd7f0c4e>暂无评论，快来发表第一条评论吧</p></div>"), _vm._ssrNode(" "), _vm.hasMoreComments ? _vm._ssrNode("<div class=\"load-more\" data-v-fd7f0c4e>", "</div>", [_c('el-button', {
    attrs: {
      "loading": _vm.loadingComments
    },
    on: {
      "click": _vm.loadMoreComments
    }
  }, [_vm._v("加载更多评论")])], 1) : _vm._e()], 2)])], 2), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "title": "分享帖子",
      "visible": _vm.shareDialogVisible,
      "width": "400px",
      "center": ""
    },
    on: {
      "update:visible": function ($event) {
        _vm.shareDialogVisible = $event;
      }
    }
  }, [_c('div', {
    staticClass: "share-dialog-content"
  }, [_c('p', {
    staticClass: "share-text"
  }, [_vm._v(_vm._s(_vm.shareText))]), _vm._v(" "), _c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 4,
      "readonly": ""
    },
    model: {
      value: _vm.shareText,
      callback: function ($$v) {
        _vm.shareText = $$v;
      },
      expression: "shareText"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "share-actions"
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.copyShareText
    }
  }, [_vm._v("复制链接")])], 1)], 1)])], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/community/post/_id.vue?vue&type=template&id=fd7f0c4e&scoped=true

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(108);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/post/_id.vue?vue&type=script&lang=js

/* harmony default export */ var _idvue_type_script_lang_js = ({
  head() {
    return {
      title: this.post ? `${this.post.title} - LogHome社区` : 'LogHome社区',
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.post ? `${this.post.content.substring(0, 100)}...` : 'LogHome社区帖子详情'
      }]
    };
  },
  async asyncData({
    params,
    $api,
    error
  }) {
    try {
      const postId = params.id;
      const post = await $api.community.getPostDetail({
        post_id: postId
      });

      // 获取评论
      const commentsRes = await $api.community.getComments({
        post_id: postId,
        page: 1,
        pageSize: 10
      });

      // 处理评论数据，确保格式一致
      const comments = commentsRes.list || [];
      comments.forEach(comment => {
        // 确保replies字段存在
        if (!comment.replies) {
          comment.replies = [];
        }

        // 处理媒体URL
        if (comment.image_url) {
          comment.media_urls = [comment.image_url];
        } else {
          comment.media_urls = [];
        }

        // 处理回复的媒体URL
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            if (reply.image_url) {
              reply.media_urls = [reply.image_url];
            } else {
              reply.media_urls = [];
            }
          });
        }
      });
      return {
        post,
        comments: comments,
        commentPage: 1,
        hasMoreComments: commentsRes.has_more || false,
        totalComments: commentsRes.total || 0
      };
    } catch (err) {
      console.error('获取帖子详情失败:', err);
      error({
        statusCode: 404,
        message: '帖子不存在或已被删除'
      });
      return {};
    }
  },
  data() {
    return {
      commentContent: '',
      replyContent: '',
      replyingTo: null,
      isSubmitting: false,
      loadingComments: false,
      shareDialogVisible: false,
      shareText: '',
      currentUserId: null,
      isLogin: false,
      userInfo: null,
      userRole: -1 // -1: 未知, 0: 普通成员, 1: 管理员, 2: 圈主
    };
  },
  computed: {
    isPostOwner() {
      return this.currentUserId && this.post && this.currentUserId === this.post.user_id;
    },
    canDeletePost() {
      if (!this.userInfo || !this.post) return false;
      // 管理员/圈主/作者可删除
      return this.userInfo.is_admin == 1 || this.userInfo.user_id == this.post.user_id || this.userRole == 1 || this.userRole == 2;
    },
    canEditPost() {
      if (!this.userInfo || !this.post) return false;
      console.log(this.userInfo);
      // 作者可编辑
      return this.userInfo.user_id == this.post.user_id;
    }
  },
  mounted() {
    this.checkLoginStatus();
    this.getPostLikeStatus();
    this.getCommentsLikeStatus();
    this.loadInitialReplies();
    this.getUserRole();
  },
  methods: {
    checkLoginStatus() {
      try {
        const token = localStorage.getItem('token');
        this.isLogin = !!token;
        if (this.isLogin) {
          this.getUserInfo();
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
        this.isLogin = false;
      }
    },
    async getUserInfo() {
      try {
        const user = await this.$api.users.getUserProfile();
        this.userInfo = user;
        this.currentUserId = user.user_id;
        // 缓存用户信息
        localStorage.setItem('userInfo', JSON.stringify(user));
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    formatTime(time) {
      const now = external_moment_default()();
      const postTime = external_moment_default()(time);
      const diff = now.diff(postTime, 'minutes');
      if (diff < 1) return '刚刚';
      if (diff < 60) return `${diff}分钟前`;
      const hourDiff = now.diff(postTime, 'hours');
      if (hourDiff < 24) return `${hourDiff}小时前`;
      const dayDiff = now.diff(postTime, 'days');
      if (dayDiff < 30) return `${dayDiff}天前`;
      return postTime.format('YYYY-MM-DD');
    },
    navigateToUser(userId) {
      this.$router.push(`/users/${userId}`);
    },
    navigateToCircle(circleId) {
      this.$router.push(`/community/circle/${circleId}`);
    },
    navigateToNovel(novelId) {
      this.$router.push(`/novel/${novelId}`);
    },
    previewImage(images, index) {
      // 使用Element UI的图片预览功能
      const h = this.$createElement;
      this.$imagePreview({
        images,
        index
      });
    },
    async getPostLikeStatus() {
      try {
        if (!this.isLogin || !this.post) return;
        const res = await this.$api.community.getLikeStatus({
          target_id: this.post.post_id,
          target_type: 1 // 1表示帖子
        });
        this.$set(this.post, 'is_liked', res.liked);
      } catch (error) {
        console.error('获取帖子点赞状态失败:', error);
      }
    },
    async getCommentsLikeStatus() {
      try {
        if (!this.isLogin || !this.comments.length) return;
        for (const comment of this.comments) {
          try {
            const res = await this.$api.community.getLikeStatus({
              target_id: comment.comment_id,
              target_type: 2 // 2表示评论
            });
            this.$set(comment, 'is_liked', res.liked);

            // 获取回复的点赞状态
            if (comment.replies && comment.replies.length) {
              for (const reply of comment.replies) {
                try {
                  const replyRes = await this.$api.community.getLikeStatus({
                    target_id: reply.comment_id,
                    target_type: 2 // 2表示评论
                  });
                  this.$set(reply, 'is_liked', replyRes.liked);
                } catch (err) {
                  console.error(`获取回复 ${reply.comment_id} 点赞状态失败:`, err);
                }
              }
            }
          } catch (err) {
            console.error(`获取评论 ${comment.comment_id} 点赞状态失败:`, err);
          }
        }
      } catch (error) {
        console.error('获取评论点赞状态失败:', error);
      }
    },
    async likePost() {
      try {
        if (!this.isLogin) {
          this.$message.warning('请先登录');
          return;
        }
        const action = this.post.is_liked ? 'unlike' : 'like';
        await this.$api.community.likeTarget({
          target_id: this.post.post_id,
          target_type: 1,
          // 1表示帖子
          action
        });

        // 更新点赞状态和数量
        this.$set(this.post, 'is_liked', !this.post.is_liked);
        this.$set(this.post, 'like_count', this.post.is_liked ? (this.post.like_count || 0) + 1 : Math.max((this.post.like_count || 0) - 1, 0));
      } catch (error) {
        console.error('点赞操作失败:', error);
        this.$message.error('操作失败，请稍后重试');
      }
    },
    async likeComment(comment) {
      try {
        if (!this.isLogin) {
          this.$message.warning('请先登录');
          return;
        }
        const action = comment.is_liked ? 'unlike' : 'like';
        await this.$api.community.likeTarget({
          target_id: comment.comment_id,
          target_type: 2,
          // 2表示评论
          action
        });

        // 更新点赞状态和数量
        this.$set(comment, 'is_liked', !comment.is_liked);
        this.$set(comment, 'like_count', comment.is_liked ? (comment.like_count || 0) + 1 : Math.max((comment.like_count || 0) - 1, 0));
      } catch (error) {
        console.error('点赞评论失败:', error);
        this.$message.error('操作失败，请稍后重试');
      }
    },
    sharePost() {
      const shareUrl = `${window.location.origin}/community/post/${this.post.post_id}`;
      this.shareText = `来自LogHome社区的分享：${this.post.title}\n${this.post.content.substring(0, 50)}${this.post.content.length > 50 ? '...' : ''}\n点击链接查看详情：${shareUrl}`;
      this.shareDialogVisible = true;
    },
    editPost() {
      this.$router.push({
        path: '/community/post/edit',
        query: {
          post_id: this.post.post_id
        }
      });
    },
    async getUserRole() {
      try {
        if (!this.isLogin || !this.post || !this.post.circle_id) {
          this.userRole = 0;
          return;
        }
        const circles = await this.$api.community.getMyCircles();
        if (circles && circles.length > 0) {
          const circle = circles.find(c => c.circle_id == this.post.circle_id);
          if (circle) {
            this.userRole = circle.role;
          } else {
            this.userRole = 0;
          }
        } else {
          this.userRole = 0;
        }
      } catch (error) {
        console.error('获取用户角色失败:', error);
        this.userRole = 0;
      }
    },
    confirmDeletePost() {
      this.$confirm('确定要删除该帖子吗？', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          console.log(this.post);
          await this.$api.community.deletePost(this.post.post_id);
          this.$message.success('删除成功');
          setTimeout(() => {
            this.$router.go(-1);
          }, 1200);
        } catch (error) {
          console.error('删除帖子失败:', error);
          this.$message.error('删除失败，请稍后重试');
        }
      }).catch(() => {
        // 用户取消删除
      });
    },
    copyShareText() {
      const textarea = document.createElement('textarea');
      textarea.value = this.shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.$message.success('已复制到剪贴板');
      this.shareDialogVisible = false;
    },
    toggleCommentInput() {
      if (this.$refs.commentInput) {
        this.$refs.commentInput.scrollIntoView({
          behavior: 'smooth'
        });
        setTimeout(() => {
          const textarea = this.$refs.commentInput.querySelector('textarea');
          if (textarea) textarea.focus();
        }, 300);
      }
    },
    async submitComment() {
      try {
        if (!this.isLogin) {
          this.$message.warning('请先登录');
          return;
        }
        if (!this.commentContent.trim()) {
          this.$message.warning('评论内容不能为空');
          return;
        }
        this.isSubmitting = true;
        const res = await this.$api.community.createComment({
          post_id: this.post.post_id,
          content: this.commentContent.trim()
        });

        // 添加新评论到列表顶部
        const newComment = {
          ...res.comment,
          // 使用返回的评论数据
          user_name: res.comment.user_name || this.userInfo.nickname,
          user_avatar: res.comment.user_avatar || this.userInfo.avatar_url,
          create_time: res.comment.create_time || new Date().toISOString(),
          like_count: res.comment.like_count || 0,
          is_liked: false,
          replies: []
        };
        this.comments.unshift(newComment);

        // 更新帖子评论数
        this.$set(this.post, 'comment_count', (this.post.comment_count || 0) + 1);

        // 清空输入框
        this.commentContent = '';
        this.$message.success('评论成功');
      } catch (error) {
        console.error('发表评论失败:', error);
        this.$message.error('评论失败，请稍后重试');
      } finally {
        this.isSubmitting = false;
      }
    },
    replyToComment(comment, parentComment = null) {
      if (!this.isLogin) {
        this.$message.warning('请先登录');
        return;
      }

      // 如果是回复一个回复，那么parentComment就是被回复的那个评论
      // 如果是回复一个评论，那么parentComment就是null
      const replyToUser = parentComment ? comment : null;
      const targetComment = parentComment || comment;
      this.replyingTo = {
        comment_id: targetComment.comment_id,
        parent_id: targetComment.comment_id,
        reply_to_comment_id: comment.comment_id,
        reply_to_user_id: comment.user_id,
        reply_user_name: comment.user_name
      };

      // 滚动到回复框并聚焦
      this.$nextTick(() => {
        const replyInput = this.$el.querySelector(`.comment-item[data-comment-id="${targetComment.comment_id}"] .reply-input-container`);
        if (replyInput) {
          replyInput.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          setTimeout(() => {
            const textarea = replyInput.querySelector('textarea');
            if (textarea) textarea.focus();
          }, 300);
        }
      });
    },
    cancelReply() {
      this.replyingTo = null;
      this.replyContent = '';
    },
    async submitReply() {
      try {
        if (!this.isLogin) {
          this.$message.warning('请先登录');
          return;
        }
        if (!this.replyContent.trim()) {
          this.$message.warning('回复内容不能为空');
          return;
        }
        this.isSubmitting = true;
        const res = await this.$api.community.createComment({
          post_id: this.post.post_id,
          content: this.replyContent.trim(),
          parent_id: this.replyingTo.parent_id,
          reply_to_comment_id: this.replyingTo.reply_to_comment_id
        });

        // 找到对应的评论
        const parentComment = this.comments.find(c => c.comment_id === this.replyingTo.parent_id);
        if (parentComment) {
          const newReply = {
            ...res.comment,
            user_name: res.comment.user_name || this.userInfo.nickname,
            user_avatar: res.comment.user_avatar || this.userInfo.avatar_url,
            create_time: res.comment.create_time || new Date().toISOString(),
            like_count: res.comment.like_count || 0,
            is_liked: false,
            reply_user_name: this.replyingTo.reply_user_name
          };
          if (!parentComment.replies) {
            this.$set(parentComment, 'replies', []);
          }
          parentComment.replies.push(newReply);
        }

        // 更新帖子评论数
        this.$set(this.post, 'comment_count', (this.post.comment_count || 0) + 1);

        // 清空输入框并取消回复状态
        this.cancelReply();
        this.$message.success('回复成功');
      } catch (error) {
        console.error('发表回复失败:', error);
        this.$message.error('回复失败，请稍后重试');
      } finally {
        this.isSubmitting = false;
      }
    },
    async loadMoreComments() {
      if (this.loadingComments) return;
      this.loadingComments = true;
      try {
        const nextPage = this.commentPage + 1;
        const res = await this.$api.community.getComments({
          post_id: this.post.post_id,
          page: nextPage,
          pageSize: 10
        });
        const newComments = res.list || [];

        // 处理新加载的评论
        newComments.forEach(comment => {
          if (!comment.replies) {
            comment.replies = [];
          }
        });
        this.comments.push(...newComments);
        this.commentPage = nextPage;
        this.hasMoreComments = res.has_more || false;

        // 获取新加载评论的点赞状态
        this.getCommentsLikeStatus();
        // 加载新评论的初始回复
        this.loadInitialReplies(newComments);
      } catch (error) {
        console.error('加载更多评论失败:', error);
        this.$message.error('加载失败，请稍后重试');
      } finally {
        this.loadingComments = false;
      }
    },
    async loadInitialReplies(commentsToLoad = this.comments) {
      // 为每个评论加载前几条回复
      for (const comment of commentsToLoad) {
        if (comment.reply_count > 0 && (!comment.replies || comment.replies.length === 0)) {
          await this.loadMoreReplies(comment, true);
        }
      }
    },
    async loadMoreReplies(comment, isInitial = false) {
      try {
        const page = isInitial ? 1 : (comment.reply_page || 1) + 1;
        const pageSize = isInitial ? 2 : 5; // 初始加载2条，后续加载5条

        const res = await this.$api.community.getReplies({
          comment_id: comment.comment_id,
          page,
          pageSize
        });
        const newReplies = res.list || [];
        if (isInitial) {
          this.$set(comment, 'replies', newReplies);
        } else {
          comment.replies.push(...newReplies);
        }
        this.$set(comment, 'reply_page', page);
        this.$set(comment, 'has_more_replies', res.has_more || false);

        // 获取新加载回复的点赞状态
        this.getCommentsLikeStatus();
      } catch (error) {
        console.error(`加载更多回复失败 (评论ID: ${comment.comment_id}):`, error);
      }
    },
    isCommentOwner(comment) {
      return this.currentUserId && comment && this.currentUserId === comment.user_id;
    },
    editPost() {
      this.$router.push(`/community/post/edit?post_id=${this.post.post_id}`);
    },
    async deletePost() {
      try {
        await this.$api.community.deletePost(this.post.post_id);
        this.$message.success('帖子删除成功');
        // 跳转到社区首页或上一个页面
        this.$router.push('/community');
      } catch (error) {
        console.error('删除帖子失败:', error);
        this.$message.error('删除失败，请稍后重试');
      }
    },
    confirmDeleteComment(comment) {
      this.$confirm('确定要删除这条评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteComment(comment);
      }).catch(() => {
        // 用户取消删除
      });
    },
    async deleteComment(comment) {
      try {
        await this.$api.community.deleteComment({
          comment_id: comment.comment_id
        });

        // 从UI中移除评论
        // 检查是一级评论还是回复
        if (comment.parent_id) {
          // 是回复
          const parentComment = this.comments.find(c => c.comment_id === comment.parent_id);
          if (parentComment && parentComment.replies) {
            const replyIndex = parentComment.replies.findIndex(r => r.comment_id === comment.comment_id);
            if (replyIndex > -1) {
              parentComment.replies.splice(replyIndex, 1);
            }
          }
        } else {
          // 是一级评论
          const commentIndex = this.comments.findIndex(c => c.comment_id === comment.comment_id);
          if (commentIndex > -1) {
            this.comments.splice(commentIndex, 1);
          }
        }

        // 更新帖子评论数
        this.$set(this.post, 'comment_count', Math.max((this.post.comment_count || 0) - 1, 0));
        this.$message.success('评论删除成功');
      } catch (error) {
        console.error('删除评论失败:', error);
        this.$message.error('删除失败，请稍后重试');
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/community/post/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var post_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/community/post/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(190)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  post_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "fd7f0c4e",
  "47b08c13"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map