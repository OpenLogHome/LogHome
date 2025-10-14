exports.ids = [19];
exports.modules = {

/***/ 141:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(209);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("03742b30", content, true, context)
};

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_0b8b423c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(141);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_0b8b423c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_0b8b423c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_0b8b423c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_0b8b423c_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 209:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".user-profile-page[data-v-0b8b423c]{max-width:1200px;margin:0 auto;padding:20px;background-color:#f8f9fa}.profile-header[data-v-0b8b423c]{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);margin-bottom:24px}.cover-container[data-v-0b8b423c]{position:relative;height:300px;overflow:hidden}.cover-container .cover-image[data-v-0b8b423c]{width:100%;height:100%;object-fit:cover;cursor:pointer;transition:transform .3s ease}.cover-container .cover-image[data-v-0b8b423c]:hover{transform:scale(1.02)}.cover-container .cover-overlay[data-v-0b8b423c]{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;flex-direction:column;color:#fff;cursor:pointer;opacity:0;transition:opacity .3s ease}.cover-container .cover-overlay[data-v-0b8b423c]:hover{opacity:1}.cover-container .cover-overlay i[data-v-0b8b423c]{font-size:32px;margin-bottom:8px}.cover-container .cover-overlay span[data-v-0b8b423c]{font-size:16px}.user-info-section[data-v-0b8b423c]{padding:30px;display:flex;justify-content:space-between;align-items:flex-start;margin-top:-80px;position:relative;z-index:2}.user-basic-info[data-v-0b8b423c]{display:flex;align-items:flex-start;flex:1}.avatar-container[data-v-0b8b423c]{margin-right:24px}.avatar-container .user-avatar[data-v-0b8b423c]{width:120px;height:120px;border-radius:12px;border:4px solid #fff;object-fit:cover;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.1);transition:transform .3s ease}.avatar-container .user-avatar[data-v-0b8b423c]:hover{transform:scale(1.05)}.user-details[data-v-0b8b423c]{flex:1;padding-top:20px}.user-name-section[data-v-0b8b423c]{margin-bottom:16px}.user-name-section .user-name[data-v-0b8b423c]{font-size:32px;font-weight:bold;color:#2c3e50;margin:0 0 8px 0}.user-name-section .user-id[data-v-0b8b423c]{background:rgba(0,0,0,.1);color:#666;padding:4px 12px;border-radius:16px;font-size:14px;margin-right:12px}.user-groups[data-v-0b8b423c]{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:8px}.user-groups .user-group[data-v-0b8b423c]{padding:4px 12px;border-radius:16px;font-size:12px;font-weight:500}.user-groups .user-group.founder[data-v-0b8b423c]{background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff}.user-groups .user-group.copemate[data-v-0b8b423c]{background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%);color:#fff}.user-groups .user-group.nonTitle[data-v-0b8b423c]{display:none}.user-groups .admin-badge[data-v-0b8b423c]{background:#5af;color:#fff;padding:4px 12px;border-radius:16px;font-size:12px;display:flex;align-items:center}.user-groups .admin-badge .admin-icon[data-v-0b8b423c]{width:16px;height:16px;margin-right:4px}.user-motto[data-v-0b8b423c]{color:#666;font-size:16px;line-height:1.5;margin-bottom:20px}.follow-stats[data-v-0b8b423c]{display:flex;gap:32px}.follow-stats .stat-item[data-v-0b8b423c]{cursor:pointer;transition:transform .2s ease}.follow-stats .stat-item[data-v-0b8b423c]:hover{transform:translateY(-2px)}.follow-stats .stat-item .stat-number[data-v-0b8b423c]{display:block;font-size:24px;font-weight:bold;color:#2c3e50}.follow-stats .stat-item .stat-label[data-v-0b8b423c]{display:block;font-size:14px;color:#666;margin-top:4px}.action-buttons[data-v-0b8b423c]{display:flex;gap:12px;align-items:flex-start;padding-top:20px}.content-tabs[data-v-0b8b423c]{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)}.tab-header[data-v-0b8b423c]{display:flex;border-bottom:1px solid #eee}.tab-header .tab-item[data-v-0b8b423c]{flex:1;padding:20px;text-align:center;font-size:16px;font-weight:500;color:#666;cursor:pointer;transition:all .3s ease;border-bottom:3px solid rgba(0,0,0,0)}.tab-header .tab-item[data-v-0b8b423c]:hover{color:#947358;background:#f8f9fa}.tab-header .tab-item.active[data-v-0b8b423c]{color:#947358;border-bottom-color:#947358;background:#fff}.tab-content[data-v-0b8b423c]{min-height:400px;padding:30px}.works-grid[data-v-0b8b423c]{display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:24px}.works-grid .work-item[data-v-0b8b423c]{cursor:pointer;transition:transform .3s ease}.works-grid .work-item[data-v-0b8b423c]:hover{transform:translateY(-4px)}.works-grid .work-item .work-cover[data-v-0b8b423c]{width:100%;height:280px;object-fit:cover;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1)}.works-grid .work-item .work-info[data-v-0b8b423c]{padding:12px 0}.works-grid .work-item .work-info .work-title[data-v-0b8b423c]{font-size:16px;font-weight:500;color:#2c3e50;margin:0;text-align:center}.posts-list .post-item[data-v-0b8b423c]{background:#f8f9fa;border-radius:12px;padding:24px;margin-bottom:20px;cursor:pointer;transition:all .3s ease}.posts-list .post-item[data-v-0b8b423c]:hover{background:#f0f1f3;transform:translateY(-2px)}.posts-list .post-item .post-header[data-v-0b8b423c]{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.posts-list .post-item .post-header .post-circle[data-v-0b8b423c]{background:#947358;color:#fff;padding:4px 12px;border-radius:16px;font-size:12px;cursor:pointer}.posts-list .post-item .post-header .post-circle[data-v-0b8b423c]:hover{background:#826347}.posts-list .post-item .post-header .post-time[data-v-0b8b423c]{color:#999;font-size:14px}.posts-list .post-item .post-content[data-v-0b8b423c]{margin-bottom:16px}.posts-list .post-item .post-content .post-title[data-v-0b8b423c]{font-size:18px;font-weight:600;color:#2c3e50;margin:0 0 8px 0}.posts-list .post-item .post-content .post-text[data-v-0b8b423c]{color:#666;line-height:1.6;margin:0;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}.posts-list .post-item .post-images[data-v-0b8b423c]{margin:16px 0}.posts-list .post-item .post-images .image-grid[data-v-0b8b423c]{display:grid;gap:8px}.posts-list .post-item .post-images .image-grid.grid-1[data-v-0b8b423c]{grid-template-columns:1fr;max-width:400px}.posts-list .post-item .post-images .image-grid.grid-1 .post-image[data-v-0b8b423c]{height:300px}.posts-list .post-item .post-images .image-grid.grid-2[data-v-0b8b423c]{grid-template-columns:repeat(2, 1fr)}.posts-list .post-item .post-images .image-grid.grid-2 .post-image[data-v-0b8b423c]{height:200px}.posts-list .post-item .post-images .image-grid.grid-3[data-v-0b8b423c],.posts-list .post-item .post-images .image-grid.grid-multi[data-v-0b8b423c]{grid-template-columns:repeat(3, 1fr)}.posts-list .post-item .post-images .image-grid.grid-3 .post-image[data-v-0b8b423c],.posts-list .post-item .post-images .image-grid.grid-multi .post-image[data-v-0b8b423c]{height:150px}.posts-list .post-item .post-images .image-grid .post-image[data-v-0b8b423c]{width:100%;object-fit:cover;border-radius:8px;cursor:pointer;transition:transform .3s ease}.posts-list .post-item .post-images .image-grid .post-image[data-v-0b8b423c]:hover{transform:scale(1.02)}.posts-list .post-item .post-images .image-grid .image-count[data-v-0b8b423c]{position:absolute;right:8px;bottom:8px;background:rgba(0,0,0,.7);color:#fff;padding:4px 8px;border-radius:12px;font-size:12px}.posts-list .post-item .post-footer[data-v-0b8b423c]{display:flex;gap:24px;padding-top:16px;border-top:1px solid #eee}.posts-list .post-item .post-footer .post-action[data-v-0b8b423c]{display:flex;align-items:center;color:#666;font-size:14px}.posts-list .post-item .post-footer .post-action i[data-v-0b8b423c]{margin-right:6px;font-size:16px}.worlds-grid[data-v-0b8b423c]{display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:24px}.worlds-grid .world-item[data-v-0b8b423c]{cursor:pointer;transition:transform .3s ease}.worlds-grid .world-item[data-v-0b8b423c]:hover{transform:translateY(-4px)}.worlds-grid .world-item .world-cover[data-v-0b8b423c]{width:100%;height:280px;object-fit:cover;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1)}.worlds-grid .world-item .world-info[data-v-0b8b423c]{padding:12px 0}.worlds-grid .world-item .world-info .world-title[data-v-0b8b423c]{font-size:16px;font-weight:500;color:#2c3e50;margin:0;text-align:center}.empty-state[data-v-0b8b423c]{text-align:center;padding:60px 20px;color:#999}.empty-state i[data-v-0b8b423c]{font-size:64px;margin-bottom:16px;display:block}.empty-state p[data-v-0b8b423c]{font-size:16px;margin:0}.load-more[data-v-0b8b423c]{text-align:center;padding:30px 0}@media(min-width: 1200px){.user-profile-page[data-v-0b8b423c]{max-width:1400px;padding:30px}.works-grid[data-v-0b8b423c],.worlds-grid[data-v-0b8b423c]{grid-template-columns:repeat(auto-fill, minmax(220px, 1fr))}.cover-container[data-v-0b8b423c]{height:350px}}@media(max-width: 1199px)and (min-width: 992px){.user-profile-page[data-v-0b8b423c]{max-width:100%;padding:25px}.works-grid[data-v-0b8b423c],.worlds-grid[data-v-0b8b423c]{grid-template-columns:repeat(auto-fill, minmax(180px, 1fr))}}@media(max-width: 991px)and (min-width: 768px){.user-profile-page[data-v-0b8b423c]{padding:20px}.user-info-section[data-v-0b8b423c]{padding:25px}.user-name[data-v-0b8b423c]{font-size:28px !important}.user-avatar[data-v-0b8b423c]{width:100px !important;height:100px !important}.works-grid[data-v-0b8b423c],.worlds-grid[data-v-0b8b423c]{grid-template-columns:repeat(auto-fill, minmax(160px, 1fr));gap:20px}.cover-container[data-v-0b8b423c]{height:250px}}@media(max-width: 767px){.user-profile-page[data-v-0b8b423c]{padding:10px}.user-info-section[data-v-0b8b423c]{flex-direction:column;align-items:stretch;padding:20px;margin-top:-60px}.user-basic-info[data-v-0b8b423c]{flex-direction:column;align-items:center;text-align:center;margin-bottom:20px}.avatar-container[data-v-0b8b423c]{margin-right:0;margin-bottom:16px}.avatar-container .user-avatar[data-v-0b8b423c]{width:80px;height:80px}.user-name[data-v-0b8b423c]{font-size:24px !important}.action-buttons[data-v-0b8b423c]{justify-content:center;padding-top:0;flex-wrap:wrap}.follow-stats[data-v-0b8b423c]{justify-content:center;gap:20px}.works-grid[data-v-0b8b423c],.worlds-grid[data-v-0b8b423c]{grid-template-columns:repeat(auto-fill, minmax(140px, 1fr));gap:16px}.tab-content[data-v-0b8b423c]{padding:20px}.tab-header .tab-item[data-v-0b8b423c]{padding:16px 12px;font-size:14px}.cover-container[data-v-0b8b423c]{height:200px}.post-item[data-v-0b8b423c]{padding:16px}.post-item .post-title[data-v-0b8b423c]{font-size:16px !important}}@media(max-width: 480px){.user-profile-page[data-v-0b8b423c]{padding:8px}.user-info-section[data-v-0b8b423c]{padding:16px}.works-grid[data-v-0b8b423c],.worlds-grid[data-v-0b8b423c]{grid-template-columns:repeat(2, 1fr);gap:12px}.tab-content[data-v-0b8b423c]{padding:16px}.action-buttons .el-button[data-v-0b8b423c]{font-size:12px;padding:8px 12px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 244:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/users/_id.vue?vue&type=template&id=0b8b423c&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "user-profile-page"
  }, [_vm._ssrNode("<div class=\"profile-header\" data-v-0b8b423c>", "</div>", [_vm._ssrNode("<div class=\"cover-container\" data-v-0b8b423c><img" + _vm._ssrAttr("src", _vm.user.top_pic_url || 'https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg') + " alt=\"背景封面\" class=\"cover-image\" data-v-0b8b423c> " + (_vm.isCurrentUser ? "<div class=\"cover-overlay\" data-v-0b8b423c><i class=\"el-icon-camera\" data-v-0b8b423c></i> <span data-v-0b8b423c>更换封面</span></div>" : "<!---->") + "</div> "), _vm._ssrNode("<div class=\"user-info-section\" data-v-0b8b423c>", "</div>", [_vm._ssrNode("<div class=\"user-basic-info\" data-v-0b8b423c><div class=\"avatar-container\" data-v-0b8b423c><img" + _vm._ssrAttr("src", _vm.user.avatar_url || '/static/default-avatar.png') + " alt=\"用户头像\" class=\"user-avatar\" data-v-0b8b423c></div> <div class=\"user-details\" data-v-0b8b423c><div class=\"user-name-section\" data-v-0b8b423c><h1 class=\"user-name\" data-v-0b8b423c>" + _vm._ssrEscape(_vm._s(_vm.user.name)) + "</h1> <span class=\"user-id\" data-v-0b8b423c>" + _vm._ssrEscape("ID: " + _vm._s(_vm.uid)) + "</span> <div class=\"user-groups\" data-v-0b8b423c>" + _vm._ssrList(_vm.userGroups, function (group) {
    return "<span" + _vm._ssrClass("user-group", _vm.getGroupClass(group)) + " data-v-0b8b423c>" + _vm._ssrEscape("\n                " + _vm._s(group) + "\n              ") + "</span>";
  }) + " " + (_vm.user.is_admin ? "<span class=\"admin-badge\" data-v-0b8b423c><img src=\"/static/icons/admin.gif\" alt=\"管理员\" class=\"admin-icon\" data-v-0b8b423c>\n                社区管理员\n              </span>" : "<!---->") + "</div></div> <div class=\"user-motto\" data-v-0b8b423c>" + _vm._ssrEscape("\n            " + _vm._s(_vm.user.motto || '暂无简介') + "\n          ") + "</div> <div class=\"follow-stats\" data-v-0b8b423c><div class=\"stat-item\" data-v-0b8b423c><span class=\"stat-number\" data-v-0b8b423c>" + _vm._ssrEscape(_vm._s(_vm.fans)) + "</span> <span class=\"stat-label\" data-v-0b8b423c>粉丝</span></div> <div class=\"stat-item\" data-v-0b8b423c><span class=\"stat-number\" data-v-0b8b423c>" + _vm._ssrEscape(_vm._s(_vm.follows)) + "</span> <span class=\"stat-label\" data-v-0b8b423c>关注</span></div></div></div></div> "), _vm._ssrNode("<div class=\"action-buttons\" data-v-0b8b423c>", "</div>", [!_vm.isCurrentUser ? _c('el-button', {
    attrs: {
      "type": _vm.isFollowing ? 'default' : 'primary',
      "loading": _vm.followLoading
    },
    on: {
      "click": _vm.toggleFollow
    }
  }, [_vm._v("\n          " + _vm._s(_vm.isFollowing ? '已关注' : '关注') + "\n        ")]) : _vm._e(), _vm._ssrNode(" "), _vm.isCurrentUser ? _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.editProfile
    }
  }, [_vm._v("\n          编辑资料\n        ")]) : _vm._e(), _vm._ssrNode(" "), !_vm.isCurrentUser ? _c('el-button', {
    on: {
      "click": _vm.sendPrivateMessage
    }
  }, [_vm._v("\n          私信\n        ")]) : _vm._e()], 2)], 2)], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"content-tabs\" data-v-0b8b423c>", "</div>", [_vm._ssrNode("<div class=\"tab-header\" data-v-0b8b423c><div" + _vm._ssrClass("tab-item", {
    active: _vm.currentTab === 0
  }) + " data-v-0b8b423c>\n        作品\n      </div> <div" + _vm._ssrClass("tab-item", {
    active: _vm.currentTab === 1
  }) + " data-v-0b8b423c>\n        动态\n      </div> <div" + _vm._ssrClass("tab-item", {
    active: _vm.currentTab === 2
  }) + " data-v-0b8b423c>\n        世界\n      </div></div> "), _vm._ssrNode("<div class=\"tab-content\" data-v-0b8b423c>", "</div>", [_vm._ssrNode("<div class=\"works-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.currentTab === 0 ? '' : 'none'
  }) + " data-v-0b8b423c>" + (_vm.userWorks.length > 0 ? "<div class=\"works-grid\" data-v-0b8b423c>" + _vm._ssrList(_vm.userWorks, function (work) {
    return "<div class=\"work-item\"" + _vm._ssrStyle(null, null, {
      display: !work.is_personal ? '' : 'none'
    }) + " data-v-0b8b423c><img" + _vm._ssrAttr("src", work.picUrl) + " alt=\"作品封面\" class=\"work-cover\" data-v-0b8b423c> <div class=\"work-info\" data-v-0b8b423c><h3 class=\"work-title\" data-v-0b8b423c>" + _vm._ssrEscape(_vm._s(work.name)) + "</h3></div></div>";
  }) + "</div>" : "<div class=\"empty-state\" data-v-0b8b423c><i class=\"el-icon-document\" data-v-0b8b423c></i> <p data-v-0b8b423c>暂无作品</p></div>") + "</div> "), _vm._ssrNode("<div class=\"posts-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.currentTab === 1 ? '' : 'none'
  }) + " data-v-0b8b423c>", "</div>", [_vm._ssrNode((_vm.userPosts.length > 0 ? "<div class=\"posts-list\" data-v-0b8b423c>" + _vm._ssrList(_vm.userPosts, function (post) {
    return "<div class=\"post-item\" data-v-0b8b423c><div class=\"post-header\" data-v-0b8b423c><div class=\"post-circle\" data-v-0b8b423c>" + _vm._ssrEscape("\n                " + _vm._s(post.circle_name) + "\n              ") + "</div> <div class=\"post-time\" data-v-0b8b423c>" + _vm._ssrEscape(_vm._s(_vm.formatTime(post.create_time))) + "</div></div> <div class=\"post-content\" data-v-0b8b423c><h3 class=\"post-title\" data-v-0b8b423c>" + _vm._ssrEscape(_vm._s(post.title)) + "</h3> <p class=\"post-text\" data-v-0b8b423c>" + _vm._ssrEscape(_vm._s(post.content)) + "</p></div> " + (post.media_urls && post.media_urls.length > 0 ? "<div class=\"post-images\" data-v-0b8b423c><div" + _vm._ssrClass("image-grid", _vm.getImageGridClass(post.media_urls.length)) + " data-v-0b8b423c>" + _vm._ssrList(post.media_urls.slice(0, 9), function (img, imgIndex) {
      return "<img" + _vm._ssrAttr("src", img) + " alt=\"帖子图片\" class=\"post-image\" data-v-0b8b423c>";
    }) + " " + (post.media_urls.length > 9 ? "<div class=\"image-count\" data-v-0b8b423c>" + _vm._ssrEscape("\n                  +" + _vm._s(post.media_urls.length - 9) + "\n                ") + "</div>" : "<!---->") + "</div></div>" : "<!---->") + " <div class=\"post-footer\" data-v-0b8b423c><div class=\"post-action\" data-v-0b8b423c><i class=\"el-icon-chat-dot-round\" data-v-0b8b423c></i> <span data-v-0b8b423c>" + _vm._ssrEscape(_vm._s(post.comment_count || 0)) + "</span></div> <div class=\"post-action\" data-v-0b8b423c><i class=\"el-icon-star-off\" data-v-0b8b423c></i> <span data-v-0b8b423c>" + _vm._ssrEscape(_vm._s(post.like_count || 0)) + "</span></div></div></div>";
  }) + "</div>" : "<div class=\"empty-state\" data-v-0b8b423c><i class=\"el-icon-chat-dot-round\" data-v-0b8b423c></i> <p data-v-0b8b423c>暂无动态</p></div>") + " "), _vm.postsHasMore && _vm.userPosts.length > 0 ? _vm._ssrNode("<div class=\"load-more\" data-v-0b8b423c>", "</div>", [_c('el-button', {
    attrs: {
      "loading": _vm.postsLoading
    },
    on: {
      "click": _vm.loadMorePosts
    }
  }, [_vm._v("\n            " + _vm._s(_vm.postsLoading ? '加载中...' : '加载更多') + "\n          ")])], 1) : _vm._e()], 2), _vm._ssrNode(" <div class=\"worlds-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.currentTab === 2 ? '' : 'none'
  }) + " data-v-0b8b423c>" + (_vm.userWorlds.length > 0 ? "<div class=\"worlds-grid\" data-v-0b8b423c>" + _vm._ssrList(_vm.userWorlds, function (world) {
    return "<div class=\"world-item\" data-v-0b8b423c><img" + _vm._ssrAttr("src", world.picUrl) + " alt=\"世界封面\" class=\"world-cover\" data-v-0b8b423c> <div class=\"world-info\" data-v-0b8b423c><h3 class=\"world-title\" data-v-0b8b423c>" + _vm._ssrEscape(_vm._s(world.name)) + "</h3></div></div>";
  }) + "</div>" : "<div class=\"empty-state\" data-v-0b8b423c><i class=\"el-icon-place\" data-v-0b8b423c></i> <p data-v-0b8b423c>暂无世界</p></div>") + "</div>")], 2)], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/users/_id.vue?vue&type=template&id=0b8b423c&scoped=true

// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__(10);

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(106);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/users/_id.vue?vue&type=script&lang=js


/* harmony default export */ var _idvue_type_script_lang_js = ({
  name: 'UserProfile',
  layout: 'default',
  data() {
    return {
      uid: null,
      user: {},
      userGroups: [],
      myUserInfo: {},
      fans: 0,
      follows: 0,
      isFollowing: false,
      followLoading: false,
      // 标签页
      currentTab: 0,
      // 作品数据
      userWorks: [],
      // 动态数据
      userPosts: [],
      postsPage: 1,
      postsPageSize: 10,
      postsHasMore: true,
      postsLoading: false,
      // 世界数据
      userWorlds: [],
      // 用户组样式映射
      group2class: {
        "社区奠基人": "founder",
        "原木体验官": "copemate",
        "用户": 'nonTitle',
        "社区管理员": 'nonTitle',
        "系统消息": 'nonTitle'
      }
    };
  },
  computed: {
    isCurrentUser() {
      return this.myUserInfo.user_id && this.uid == this.myUserInfo.user_id;
    }
  },
  async mounted() {
    this.uid = this.$route.params.id;
    await this.loadUserInfo();
    await this.loadMyUserInfo();
    await this.loadUserStats();
    await this.loadUserWorks();
    await this.loadUserWorlds();
  },
  methods: {
    // 加载用户信息
    async loadUserInfo() {
      try {
        const response = await this.$api.users.getUserInfo(this.uid);
        if (response.code === 0) {
          this.user = response.data;
          if (this.user.user_group) {
            this.userGroups = this.user.user_group.split(',');
          }
        } else {
          throw new Error(response.message || '获取用户信息失败');
        }
      } catch (error) {
        console.error('加载用户信息失败', error);
        this.$message.error('用户信息加载失败');
      }
    },
    // 加载当前登录用户信息
    async loadMyUserInfo() {
      try {
        this.myUserInfo = await this.$api.users.getUserProfile();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
        }
      }
    },
    // 加载用户统计数据
    async loadUserStats() {
      try {
        // 加载粉丝数
        const fansResponse = await this.$api.users.getUserFans(this.uid);
        if (fansResponse.code === 0) {
          this.fans = fansResponse.data.length;
        }

        // 加载关注数
        const followsResponse = await this.$api.users.getUserFollows(this.uid);
        if (followsResponse.code === 0) {
          this.follows = followsResponse.data.length;
        }

        // 检查是否已关注
        if (this.myUserInfo.user_id && !this.isCurrentUser) {
          this.checkFollowStatus();
        }
      } catch (error) {
        console.error('加载用户统计数据失败', error);
      }
    },
    // 检查关注状态
    async checkFollowStatus() {
      try {
        const response = await this.$api.users.checkFollowStatus(this.uid);
        if (response.code === 0) {
          this.isFollowing = response.data.isFollowing;
        }
      } catch (error) {
        console.error('检查关注状态失败', error);
      }
    },
    // 加载用户作品
    async loadUserWorks() {
      try {
        const response = await this.$api.users.getUserNovels(this.uid);
        if (response.code === 0) {
          this.userWorks = response.data || [];
        } else {
          throw new Error(response.message || '获取作品失败');
        }
      } catch (error) {
        console.error('加载用户作品失败', error);
        this.$message.error('作品信息加载失败');
      }
    },
    // 加载用户世界
    async loadUserWorlds() {
      try {
        const response = await this.$api.users.getUserWorlds(this.uid);
        if (response.code === 0) {
          this.userWorlds = response.data || [];
        } else {
          throw new Error(response.message || '获取世界设定失败');
        }
      } catch (error) {
        console.error('加载用户世界失败', error);
        this.$message.error('世界信息加载失败');
      }
    },
    // 加载用户动态
    async loadUserPosts() {
      if (this.postsLoading || !this.postsHasMore) return;
      this.postsLoading = true;
      try {
        const response = await this.$api.users.getUserPosts(this.uid, {
          page: this.postsPage,
          pageSize: this.postsPageSize
        });
        if (response.code === 0 && response.data && response.data.list) {
          const newPosts = response.data.list.map(post => {
            if (post.media_urls && typeof post.media_urls === 'string') {
              try {
                post.media_urls = JSON.parse(post.media_urls);
              } catch (e) {
                post.media_urls = [];
              }
            }
            return post;
          });
          if (this.postsPage === 1) {
            this.userPosts = newPosts;
          } else {
            this.userPosts = [...this.userPosts, ...newPosts];
          }
          this.postsPage++;
          this.postsHasMore = this.userPosts.length < response.data.total;
        } else {
          throw new Error(response.message || '获取动态失败');
        }
      } catch (error) {
        console.error('加载用户动态失败', error);
        this.$message.error('加载用户动态失败');
      } finally {
        this.postsLoading = false;
      }
    },
    // 加载更多动态
    loadMorePosts() {
      this.loadUserPosts();
    },
    // 切换标签页
    switchTab(index) {
      this.currentTab = index;
      if (index === 1 && this.userPosts.length === 0) {
        this.loadUserPosts();
      }
    },
    // 切换关注状态
    async toggleFollow() {
      if (!this.myUserInfo.user_id) {
        this.$message.warning('请先登录');
        this.$router.push('/login');
        return;
      }
      if (this.myUserInfo.user_id === this.uid) {
        this.$message.warning('不能关注自己');
        return;
      }
      this.followLoading = true;
      try {
        let response;
        if (this.isFollowing) {
          response = await this.$api.users.unfollowUser(this.uid);
        } else {
          response = await this.$api.users.followUser(this.uid);
        }
        if (response.code === 0) {
          this.isFollowing = !this.isFollowing;
          this.fans += this.isFollowing ? 1 : -1;
          this.$message.success(this.isFollowing ? '关注成功' : '取消关注成功');
        } else {
          throw new Error(response.message || '操作失败');
        }
      } catch (error) {
        console.error('关注操作失败', error);
        this.$message.error('操作失败，请重试');
      } finally {
        this.followLoading = false;
      }
    },
    // 发送私信
    sendPrivateMessage() {
      if (!this.myUserInfo.user_id) {
        this.$message.warning('请先登录');
        this.$router.push('/login');
        return;
      }
      this.$router.push(`/community/chat?id=${this.uid}`);
    },
    // 编辑资料
    editProfile() {
      this.$router.push('/users/change_user_info');
    },
    // 更换封面
    changeCoverImage() {
      this.$router.push('/users/top_pic_upload?noneAnimation=1');
    },
    // 预览封面图片
    previewCoverImage() {
      if (this.user.top_pic_url) {
        this.$preview([this.user.top_pic_url]);
      }
    },
    // 预览头像
    previewAvatar() {
      if (this.user.avatar_url) {
        this.$preview([this.user.avatar_url]);
      }
    },
    // 预览帖子图片
    previewPostImages(images, index) {
      this.$preview(images, index);
    },
    // 导航到好友页面
    navigateToFriends(tab) {
      this.$router.push(`/community/friends?id=${this.uid}&tab=${tab}`);
    },
    // 导航到作品
    navigateToWork(novelId) {
      if (novelId > 0) {
        this.$router.push(`/novel/${novelId}`);
      }
    },
    // 导航到帖子
    navigateToPost(postId) {
      this.$router.push(`/community/post/${postId}`);
    },
    // 导航到圈子
    navigateToCircle(circleId) {
      if (!circleId || circleId === 0) {
        this.$message.warning('圈子不存在');
        return;
      }
      this.$router.push(`/community/circle/${circleId}`);
    },
    // 导航到世界
    navigateToWorld(worldId) {
      this.$router.push(`/world/${worldId}`);
    },
    // 获取用户组样式
    getGroupClass(group) {
      return this.group2class[group] || 'nonTitle';
    },
    // 获取图片网格样式
    getImageGridClass(count) {
      if (count === 1) return 'grid-1';
      if (count === 2) return 'grid-2';
      if (count === 3) return 'grid-3';
      return 'grid-multi';
    },
    // 格式化时间
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
    // 获取token
    getToken() {
      const token = JSON.parse(localStorage.getItem('token') || '{}');
      return token.tk || null;
    }
  }
});
// CONCATENATED MODULE: ./pages/users/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var users_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/users/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(208)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  users_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "0b8b423c",
  "78ddf53a"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map