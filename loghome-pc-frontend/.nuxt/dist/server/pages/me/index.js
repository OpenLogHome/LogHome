exports.ids = [27];
exports.modules = {

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(146);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("81d3b816", content, true, context)
};

/***/ }),

/***/ 144:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(148);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("0cd59bf6", content, true, context)
};

/***/ }),

/***/ 145:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Workspace_vue_vue_type_style_index_0_id_0f3977ca_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(143);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Workspace_vue_vue_type_style_index_0_id_0f3977ca_prod_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Workspace_vue_vue_type_style_index_0_id_0f3977ca_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Workspace_vue_vue_type_style_index_0_id_0f3977ca_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Workspace_vue_vue_type_style_index_0_id_0f3977ca_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 146:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.social-workspace {\r\n  --wood: #79573d;\r\n  --ink: #382d25;\r\n  --muted: #776a5d;\r\n  --line: #e9e0d5;\r\n  --surface: #fffdf9;\r\n  --soft: #f2e9dd;\r\n  max-width: 1440px;\r\n  margin: auto;\r\n  display: grid;\r\n  grid-template-columns: 190px minmax(0, 1fr);\r\n  gap: 24px;\r\n  padding: 24px 28px 48px;\r\n  color: var(--ink);\r\n  font-family: -apple-system, BlinkMacSystemFont, \"PingFang SC\", \"Microsoft YaHei\",\r\n    sans-serif;\n}\n.social-workspace:has(.workspace-aside) {\r\n  grid-template-columns: 190px minmax(0, 1fr) 280px;\n}\n.workspace-nav {\r\n  position: sticky;\r\n  top: 90px;\r\n  align-self: start;\n}\n.workspace-nav nav {\r\n  display: grid;\r\n  gap: 6px;\r\n  margin: 8px 0 24px;\n}\n.workspace-nav nav a {\r\n  padding: 13px 14px;\r\n  display: flex;\r\n  gap: 12px;\r\n  align-items: center;\r\n  border-radius: 10px;\r\n  color: var(--muted);\n}\n.workspace-nav nav a:hover,\r\n.workspace-nav nav a.nuxt-link-active,\r\n.workspace-nav nav a.selected {\r\n  background: var(--soft);\r\n  color: #704c35;\n}\n.workspace-compose {\r\n  display: flex;\r\n  justify-content: center;\r\n  gap: 8px;\r\n  background: var(--wood);\r\n  color: white !important;\r\n  border-radius: 10px;\r\n  padding: 13px;\n}\n.workspace-main {\r\n  min-width: 0;\n}\n.workspace-heading {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  flex-wrap: wrap;\r\n  gap: 16px;\r\n  margin: 0 0 20px;\r\n  align-items: center;\n}\n.workspace-heading h1 {\r\n  font-size: 26px;\r\n  line-height: 1.4;\r\n  margin: 0;\r\n  color: var(--ink);\n}\n.workspace-heading p {\r\n  font-size: 14px;\r\n  color: var(--muted);\r\n  margin: 0;\r\n  line-height: 1.7;\n}\n.workspace-actions {\r\n  display: flex;\r\n  gap: 8px;\n}\n.workspace-aside {\r\n  align-self: start;\r\n  position: sticky;\r\n  top: 96px;\r\n  padding-top: 8px;\n}\n.social-panel {\r\n  background: var(--surface);\r\n  border: 1px solid var(--line);\r\n  border-radius: 16px;\r\n  padding: 22px;\r\n  margin-bottom: 18px;\n}\n.social-panel h2,\r\n.social-panel h3 {\r\n  margin: 0 0 16px;\r\n  font-size: 18px;\n}\n.social-muted {\r\n  color: var(--muted);\r\n  font-size: 13px;\r\n  line-height: 1.7;\n}\n.social-state {\r\n  text-align: center;\r\n  padding: 56px 16px;\r\n  color: var(--muted);\r\n  line-height: 1.8;\n}\n.social-state i {\r\n  display: block;\r\n  font-size: 34px;\r\n  margin-bottom: 14px;\r\n  color: #b9a58c;\n}\n.social-state button {\r\n  margin-top: 12px;\n}\n.social-tabs {\r\n  display: flex;\r\n  gap: 8px;\r\n  flex-wrap: wrap;\r\n  margin-bottom: 20px;\n}\n.social-tabs button {\r\n  border: 1px solid var(--line);\r\n  background: var(--surface);\r\n  color: var(--muted);\r\n  border-radius: 9px;\r\n  padding: 10px 16px;\r\n  cursor: pointer;\n}\n.social-tabs button.active {\r\n  background: var(--wood);\r\n  border-color: var(--wood);\r\n  color: white;\n}\n.social-workspace a:focus-visible,\r\n.social-workspace button:focus-visible {\r\n  outline: 3px solid #bb9566;\r\n  outline-offset: 3px;\n}\n.social-list-row {\r\n  display: flex;\r\n  gap: 14px;\r\n  align-items: center;\r\n  padding: 16px 0;\r\n  border-bottom: 1px solid var(--line);\n}\n.social-list-row:last-child {\r\n  border-bottom: 0;\n}\n.social-list-row img {\r\n  width: 46px;\r\n  height: 46px;\r\n  object-fit: cover;\r\n  border-radius: 12px;\n}\n.social-list-row .row-main {\r\n  flex: 1;\r\n  min-width: 0;\n}\n.social-list-row p {\r\n  margin: 6px 0 0;\r\n  line-height: 1.6;\r\n  font-size: 13px;\r\n  color: var(--muted);\n}\n.social-list-row a {\r\n  color: var(--ink);\n}\n.social-end {\r\n  text-align: center;\r\n  padding: 20px;\r\n  color: var(--muted);\r\n  font-size: 13px;\n}\n.social-card-grid {\r\n  display: grid;\r\n  grid-template-columns: repeat(2, minmax(0, 1fr));\r\n  gap: 16px;\n}\n.social-toolbar {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  gap: 16px;\r\n  align-items: center;\r\n  margin-bottom: 20px;\n}\n.social-toolbar .el-input {\r\n  max-width: 420px;\n}\n@media (max-width: 1200px) {\n.social-workspace:has(.workspace-aside) {\r\n    grid-template-columns: 170px minmax(0, 1fr);\n}\n.workspace-aside {\r\n    display: none;\n}\n}\n@media (max-width: 850px) {\n.social-workspace,\r\n  .social-workspace:has(.workspace-aside) {\r\n    grid-template-columns: minmax(0, 1fr);\r\n    padding: 20px 16px;\r\n    gap: 20px;\n}\n.workspace-nav {\r\n    position: static;\n}\n.workspace-compose {\r\n    display: none;\n}\n.workspace-nav nav {\r\n    display: flex;\r\n    overflow: auto;\r\n    margin: 0;\r\n    gap: 4px;\n}\n.workspace-nav nav a {\r\n    white-space: nowrap;\r\n    padding: 10px;\n}\n.workspace-heading {\r\n    align-items: flex-start;\n}\n.workspace-heading h1 {\r\n    font-size: 24px;\n}\n.social-card-grid {\r\n    grid-template-columns: 1fr;\n}\n.social-toolbar {\r\n    flex-wrap: wrap;\n}\n}\n.social-workspace a {\r\n  text-decoration: none;\n}\n.social-workspace button {\r\n  font-family: inherit;\n}\n.social-workspace .el-button {\r\n  border-radius: 8px;\r\n  white-space: nowrap;\n}\n.social-workspace .el-button--primary {\r\n  background: var(--wood);\r\n  border-color: var(--wood);\r\n  color: #fffdf9;\n}\n.social-workspace .el-button--primary:hover,\r\n.social-workspace .el-button--primary:focus {\r\n  background: #67472f;\r\n  border-color: #67472f;\n}\n.social-workspace .el-button--primary.is-disabled {\r\n  background: #e4d9cb;\r\n  border-color: #e4d9cb;\r\n  color: #766858;\n}\n.social-workspace .el-button--text {\r\n  color: var(--wood);\n}\n.social-workspace .el-input__inner,\r\n.social-workspace .el-textarea__inner {\r\n  border-radius: 8px;\r\n  border-color: #c6b9a7;\r\n  background: var(--surface);\r\n  color: var(--ink);\n}\n.social-workspace .el-input__inner::placeholder,\r\n.social-workspace .el-textarea__inner::placeholder {\r\n  color: #776e63;\n}\n.social-workspace .el-input__inner:focus,\r\n.social-workspace .el-textarea__inner:focus {\r\n  border-color: var(--wood);\r\n  box-shadow: 0 0 0 2px #94735820;\n}\n.social-workspace .el-radio-button__orig-radio:checked + .el-radio-button__inner {\r\n  background: var(--wood);\r\n  border-color: var(--wood);\r\n  box-shadow: -1px 0 0 0 var(--wood);\n}\n.social-workspace .el-switch.is-checked .el-switch__core {\r\n  border-color: var(--wood);\r\n  background: var(--wood);\n}\n.social-workspace .el-button:active,\r\n.social-tabs button:active {\r\n  transform: translateY(1px);\n}\n.social-skip {\r\n  position: absolute;\r\n  left: 16px;\r\n  top: -100px;\r\n  z-index: 100;\r\n  background: var(--surface);\r\n  border: 2px solid var(--wood);\r\n  padding: 12px;\n}\n.social-skip:focus {\r\n  top: 90px;\n}\n.social-workspace .el-dialog {\r\n  border-radius: 16px;\r\n  overflow: hidden;\n}\n.social-workspace .el-dialog__body {\r\n  color: var(--ink);\n}\n.social-workspace .el-progress-bar__inner {\r\n  background: var(--wood);\n}\n.social-workspace .el-collapse-item__header,\r\n.social-workspace .el-collapse-item__wrap {\r\n  background: transparent;\r\n  color: var(--ink);\n}\n.social-workspace .el-collapse-item__content {\r\n  color: var(--muted);\n}\n@media (prefers-reduced-motion: no-preference) {\n.social-workspace button,\r\n  .social-workspace a {\r\n    transition: transform 0.16s ease, opacity 0.16s ease;\n}\n.social-post {\r\n    animation: social-enter 0.2s ease-out;\n}\n@keyframes social-enter {\nfrom {\r\n      opacity: 0.5;\r\n      transform: translateY(4px);\n}\nto {\r\n      opacity: 1;\r\n      transform: translateY(0);\n}\n}\n}\n@media (prefers-reduced-motion: reduce) {\n.social-workspace * {\r\n    animation: none !important;\r\n    transition: none !important;\n}\n}\n[data-theme=\"dark\"].social-workspace {\r\n  --ink: #eee5d9;\r\n  --muted: #c4b6a5;\r\n  --line: #504536;\r\n  --surface: #2a2621;\r\n  --soft: #383126;\r\n  --wood: #c8a782;\n}\n@media all {\n[data-theme=\"dark\"].social-workspace {\r\n    --ink: #eee5d9;\r\n    --muted: #c4b6a5;\r\n    --line: #504536;\r\n    --surface: #2a2621;\r\n    --soft: #383126;\r\n    --wood: #c8a782;\r\n    background: #211e19;\r\n    border-radius: 16px;\n}\n[data-theme=\"dark\"].social-workspace .social-panel,\r\n  [data-theme=\"dark\"].social-workspace .social-post,\r\n  [data-theme=\"dark\"].social-workspace .circle-tile,\r\n  [data-theme=\"dark\"].social-workspace .product-card,\r\n  [data-theme=\"dark\"].social-workspace .frame-option,\r\n  [data-theme=\"dark\"].social-workspace .badge-option,\r\n  [data-theme=\"dark\"].social-workspace .pass-card {\r\n    background: var(--surface);\r\n    border-color: var(--line);\r\n    color: var(--ink);\n}\n[data-theme=\"dark\"].social-workspace .post-body,\r\n  [data-theme=\"dark\"].social-workspace .post-author,\r\n  [data-theme=\"dark\"].social-workspace .feed-circle,\r\n  [data-theme=\"dark\"].social-workspace .personal-services a,\r\n  [data-theme=\"dark\"].social-workspace .personal-quick a,\r\n  [data-theme=\"dark\"].social-workspace .lab-entry {\r\n    color: var(--ink);\n}\n[data-theme=\"dark\"].social-workspace .post-body p,\r\n  [data-theme=\"dark\"].social-workspace .social-post footer a,\r\n  [data-theme=\"dark\"].social-workspace .social-post footer button,\r\n  [data-theme=\"dark\"].social-workspace .personal-services p,\r\n  [data-theme=\"dark\"].social-workspace .personal-quick p,\r\n  [data-theme=\"dark\"].social-workspace .circle-tile p,\r\n  [data-theme=\"dark\"].social-workspace .product-card p,\r\n  [data-theme=\"dark\"].social-workspace .product-summary p,\r\n  [data-theme=\"dark\"].social-workspace .product-description p,\r\n  [data-theme=\"dark\"].social-workspace .pass-card li p,\r\n  [data-theme=\"dark\"].social-workspace .pass-summary,\r\n  [data-theme=\"dark\"].social-workspace .message-target {\r\n    color: var(--muted);\n}\n[data-theme=\"dark\"].social-workspace\r\n    .el-button:not(.el-button--primary):not(.el-button--text),\r\n  [data-theme=\"dark\"].social-workspace .el-radio-button__inner {\r\n    background: var(--surface);\r\n    border-color: var(--line);\r\n    color: var(--ink);\n}\n[data-theme=\"dark\"].social-workspace .el-button--primary {\r\n    color: #211e19;\n}\n[data-theme=\"dark\"].social-workspace .el-button--primary:hover {\r\n    background: #d6b58e;\r\n    border-color: #d6b58e;\n}\n[data-theme=\"dark\"].social-workspace .el-dialog {\r\n    background: var(--surface);\n}\n[data-theme=\"dark\"].social-workspace .el-dialog__title,\r\n  [data-theme=\"dark\"].social-workspace .el-form-item__label {\r\n    color: var(--ink);\n}\n[data-theme=\"dark\"].social-workspace .el-input__inner::placeholder,\r\n  [data-theme=\"dark\"].social-workspace .el-textarea__inner::placeholder {\r\n    color: #c4b6a5;\n}\n[data-theme=\"dark\"].social-workspace .personal-tree,\r\n  [data-theme=\"dark\"].social-workspace .store-intro,\r\n  [data-theme=\"dark\"].social-workspace .post-work,\r\n  [data-theme=\"dark\"].social-workspace .post-circle,\r\n  [data-theme=\"dark\"].social-workspace .message-categories button.active,\r\n  [data-theme=\"dark\"].social-workspace .frame-option.selected,\r\n  [data-theme=\"dark\"].social-workspace .pass-plans button,\r\n  [data-theme=\"dark\"].social-workspace .product-variants button,\r\n  [data-theme=\"dark\"].social-workspace .recharge-plans button,\r\n  [data-theme=\"dark\"].social-workspace .rules-hero,\r\n  [data-theme=\"dark\"].social-workspace .rules-section,\r\n  [data-theme=\"dark\"].social-workspace .badge-detail-image,\r\n  [data-theme=\"dark\"].social-workspace .badge-condition-group {\r\n    background: var(--soft);\r\n    color: var(--ink);\r\n    border-color: var(--line);\n}\n[data-theme=\"dark\"].social-workspace .pass-plans span,\r\n  [data-theme=\"dark\"].social-workspace .product-variants span,\r\n  [data-theme=\"dark\"].social-workspace .frame-option span {\r\n    color: var(--muted);\n}\n[data-theme=\"dark\"].social-workspace .workspace-nav nav a:hover,\r\n  [data-theme=\"dark\"].social-workspace .workspace-nav nav a.nuxt-link-active {\r\n    background: var(--soft);\r\n    color: var(--wood);\n}\n[data-theme=\"dark\"].social-workspace .workspace-compose {\r\n    color: #211e19 !important;\n}\n[data-theme=\"dark\"].social-workspace .social-tabs button.active {\r\n    color: #211e19;\n}\n[data-theme=\"dark\"].social-workspace .el-input__count,\r\n  [data-theme=\"dark\"].social-workspace .el-textarea .el-input__count {\r\n    background: var(--surface);\r\n    color: var(--muted);\n}\n}\n.workspace-theme {\r\n  height: 38px;\r\n  width: 38px;\r\n  display: grid;\r\n  place-items: center;\r\n  border: 1px solid var(--line);\r\n  border-radius: 9px;\r\n  background: var(--surface);\r\n  color: var(--muted);\r\n  cursor: pointer;\r\n  flex-shrink: 0;\r\n  font-size: 17px;\n}\n.social-workspace .workspace-actions {\r\n  align-items: center;\n}\n.social-workspace .workspace-compose {\r\n  color: #fffdf9 !important;\n}\n.social-workspace .el-button--primary {\r\n  color: #fffdf9;\n}\n.social-workspace[data-theme=\"dark\"] .workspace-compose,\r\n.social-workspace[data-theme=\"dark\"] .el-button--primary {\r\n  color: #211e19 !important;\n}\n.social-workspace[data-theme=\"dark\"] .settings-card,\r\n.social-workspace[data-theme=\"dark\"] .friends-card,\r\n.social-workspace[data-theme=\"dark\"] .post-detail,\r\n.social-workspace[data-theme=\"dark\"] .comments-section {\r\n  background: var(--surface) !important;\r\n  border-color: var(--line) !important;\r\n  color: var(--ink);\n}\n.social-workspace .el-switch__label.is-active {\r\n  color: var(--wood);\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Workspace_vue_vue_type_style_index_1_id_0f3977ca_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(144);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Workspace_vue_vue_type_style_index_1_id_0f3977ca_prod_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Workspace_vue_vue_type_style_index_1_id_0f3977ca_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Workspace_vue_vue_type_style_index_1_id_0f3977ca_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Workspace_vue_vue_type_style_index_1_id_0f3977ca_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 148:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.social-workspace .social-sr-only {\r\n  position: absolute;\r\n  width: 1px;\r\n  height: 1px;\r\n  padding: 0;\r\n  margin: -1px;\r\n  overflow: hidden;\r\n  clip: rect(0, 0, 0, 0);\r\n  white-space: nowrap;\r\n  border: 0;\n}\n.workspace-heading .social-tabs {\r\n  margin: 0;\n}\n.workspace-actions {\r\n  align-items: center;\n}\n.workspace-heading > div:first-child {\r\n  min-width: 0;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 149:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/social/Workspace.vue?vue&type=template&id=0f3977ca
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "social-workspace",
    attrs: {
      "data-theme": _vm.resolvedTheme
    }
  }, [_vm._ssrNode("<a href=\"#social-main\" class=\"social-skip\">" + _vm._ssrEscape(_vm._s(_vm.$t("跳转到页面内容"))) + "</a> "), _vm._ssrNode("<aside class=\"workspace-nav\">", "</aside>", [_vm._ssrNode("<nav" + _vm._ssrAttr("aria-label", _vm.$t('社区与个人中心导航')) + ">", "</nav>", _vm._l(_vm.links, function (item) {
    return _c('nuxt-link', {
      key: item.to,
      class: {
        selected: item.to === _vm.active
      },
      attrs: {
        "to": item.to,
        "exact": item.exact
      }
    }, [_c('i', {
      class: item.icon,
      attrs: {
        "aria-hidden": "true"
      }
    }), _vm._v(_vm._s(_vm.$t(item.label)))]);
  }), 1), _vm._ssrNode(" "), _vm.showCompose ? _c('nuxt-link', {
    staticClass: "workspace-compose",
    attrs: {
      "to": "/community/post/edit"
    }
  }, [_c('i', {
    staticClass: "el-icon-edit"
  }), _vm._v(_vm._s(_vm.$t("发布帖子")))]) : _vm._e()], 2), _vm._ssrNode(" "), _vm._ssrNode("<main id=\"social-main\" tabindex=\"-1\" class=\"workspace-main\">", "</main>", [!_vm.compact || _vm.$slots.heading || _vm.$slots.actions ? _vm._ssrNode("<header class=\"workspace-heading\">", "</header>", [_vm._ssrNode("<div>", "</div>", [_vm._ssrNode("<h1" + _vm._ssrClass(null, {
    'social-sr-only': _vm.compact
  }) + ">" + _vm._ssrEscape(_vm._s(_vm.title)) + "</h1> "), _vm._t("heading"), _vm._ssrNode(" " + (_vm.description ? "<p>" + _vm._ssrEscape(_vm._s(_vm.description)) + "</p>" : "<!---->"))], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"workspace-actions\">", "</div>", [_vm._t("actions")], 2)], 2) : _vm._ssrNode("<h1 class=\"social-sr-only\">" + _vm._ssrEscape(_vm._s(_vm.title)) + "</h1>"), _vm._ssrNode(" "), _vm.sectionNavigation ? _vm._ssrNode("<nav" + _vm._ssrAttr("aria-label", _vm.$t(_vm.sectionNavigation.label)) + " class=\"workspace-sections\">", "</nav>", _vm._l(_vm.sectionNavigation.links, function (item) {
    return _c('nuxt-link', {
      key: item.to,
      class: {
        current: item.current
      },
      attrs: {
        "to": item.to,
        "aria-current": item.current ? 'page' : undefined
      }
    }, [_vm._v(_vm._s(_vm.$t(item.label)))]);
  }), 1) : _vm._e(), _vm._ssrNode(" "), _vm._t("default")], 2), _vm._ssrNode(" "), _vm.$slots.aside ? _vm._ssrNode("<aside class=\"workspace-aside\">", "</aside>", [_vm._t("aside")], 2) : _vm._e()], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/social/Workspace.vue?vue&type=template&id=0f3977ca

// CONCATENATED MODULE: ./utils/workspace-navigation.js
// Keep related tools one click apart without adding another navigation level.
function workspaceNavigation(rawPath = "", circleRole = 0) {
  const path = String(rawPath).split("?")[0].replace(/\/$/, "") || "/";
  const section = (label, links, selected) => ({
    label,
    links: links.map(([to, name]) => ({
      to,
      label: name,
      current: to === (selected || path)
    }))
  });
  if (/^\/me\/(settings|security|notifications|storage)$/.test(path)) return section("账号设置", [["/me/settings", "个人资料"], ["/me/security", "账号安全"], ["/me/notifications", "消息推送"], ["/me/storage", "存储管理"]]);
  if (/^\/me\/(achievements|frames)$/.test(path)) return section("个性装扮", [["/me/achievements", "勋章与称号"], ["/me/frames", "头像挂件"]]);
  if (/^\/membership(?:\/|$)/.test(path)) return section("原木通行证", [["/membership", "通行证权益"], ["/membership/gift", "赠送好友"], ["/membership/redeem", "兑换通行证"], ["/membership/rules", "服务规则"]]);
  if (/^\/store(?:\/|$)/.test(path)) return section("原木商城", [["/store", "商品"], ["/store/orders", "我的订单"], ["/store/addresses", "收货地址"]], /^\/store\/\d+$/.test(path) ? "/store" : path);
  const circle = path.match(/^\/community\/circle\/(?:(members|settings)\/)?([1-9]\d*)$/);
  if (circle) {
    const id = circle[2];
    return section("圈子", [[`/community/circle/${id}`, "动态"], [`/community/circle/members/${id}`, "成员"], ...(circleRole > 0 ? [[`/community/circle/settings/${id}`, "圈子设置"]] : [])]);
  }
  if (/^\/community\/(chat|mail)(?:\/|$)/.test(path)) return section("消息中心", [["/me/messages", "消息中心"], ["/me/friends", "好友与关注"], ["/community/mail/new", "写信"]]);
  return null;
}
function showWorkspaceCompose(path = "") {
  return /^\/community\/(circles|search)$/.test(path) || /^\/community\/post\/[1-9]\d*$/.test(path);
}
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/social/Workspace.vue?vue&type=script&lang=js

/* harmony default export */ var Workspacevue_type_script_lang_js = ({
  props: {
    title: String,
    description: String,
    compact: Boolean,
    active: String,
    circleRole: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    themeReady: false,
    links: [{
      to: "/community",
      label: "社区动态",
      icon: "el-icon-discover",
      exact: true
    }, {
      to: "/community/circles",
      label: "圈子广场",
      icon: "el-icon-chat-dot-round"
    }, {
      to: "/community/search",
      label: "搜索社区",
      icon: "el-icon-search"
    }, {
      to: "/me/messages",
      label: "消息中心",
      icon: "el-icon-bell"
    }, {
      to: "/me/friends",
      label: "好友与关注",
      icon: "el-icon-user"
    }, {
      to: "/me",
      label: "个人中心",
      icon: "el-icon-house",
      exact: true
    }, {
      to: "/me/settings",
      label: "账号设置",
      icon: "el-icon-setting"
    }]
  }),
  mounted() {
    this.themeReady = true;
  },
  computed: {
    sectionNavigation() {
      return workspaceNavigation(this.$route.path, this.circleRole);
    },
    showCompose() {
      return showWorkspaceCompose(this.$route.path);
    },
    resolvedTheme() {
      return this.themeReady ? this.$theme.resolved : "light";
    }
  },
  watch: {
    resolvedTheme(value) {
      this.$emit("theme-change", value);
    }
  }
});
// CONCATENATED MODULE: ./components/social/Workspace.vue?vue&type=script&lang=js
 /* harmony default export */ var social_Workspacevue_type_script_lang_js = (Workspacevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/social/Workspace.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(145)
if (style0.__inject__) style0.__inject__(context)
var style1 = __webpack_require__(147)
if (style1.__inject__) style1.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  social_Workspacevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  "c21043c4"
  
)

/* harmony default export */ var Workspace = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 152:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(162);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("47fbd60c", content, true, context)
};

/***/ }),

/***/ 154:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return accountRequestId; });
/* harmony import */ var _utils_social_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _social__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(26);


const get = (path, params = {}) => Object(_social__WEBPACK_IMPORTED_MODULE_1__[/* socialRequest */ "b"])(path, params, "GET", null, true);
const post = (path, body, method = "POST") => Object(_social__WEBPACK_IMPORTED_MODULE_1__[/* socialRequest */ "b"])(path, {}, method, body, true);
const data = promise => promise.then(result => {
  if (!result || result.data === undefined || result.data === null) throw new Error("账户服务返回数据异常，请刷新重试");
  return result.data;
});
/* harmony default export */ __webpack_exports__["b"] = ({
  profile: () => get("/users/userprofile").then(value => {
    if (!value || !value.user_id) throw new Error("用户资料加载异常，请重新登录");
    return value;
  }),
  balances: () => get("/resource/get_resources").then(rows => {
    Object(_utils_social_response__WEBPACK_IMPORTED_MODULE_0__[/* responseList */ "a"])(rows, "账户资源");
    if (!rows.length) throw new Error("资源余额读取失败，请刷新重试");
    return Object(_utils_social_response__WEBPACK_IMPORTED_MODULE_0__[/* responseObject */ "b"])(rows[0], "账户资源");
  }),
  membershipPlans: () => data(Object(_social__WEBPACK_IMPORTED_MODULE_1__[/* socialRequest */ "b"])("/membership/plans")).then(value => Object(_utils_social_response__WEBPACK_IMPORTED_MODULE_0__[/* responseList */ "a"])(value, "通行证方案")),
  membership: () => data(get("/membership/subscription")),
  subscribe: body => data(post("/membership/subscribe", body)),
  gift: body => data(post("/membership/gift", body)),
  giftFriends: () => data(get("/membership/gift-friends")).then(result => result.list),
  autoRenew: enabled => data(post("/membership/auto-renew", {
    enabled
  }, "PATCH")),
  redeem: code => data(post("/membership/redeem", {
    code
  })),
  redeemHistory: (page = 1) => data(get("/membership/redeem-history", {
    page,
    pageSize: 20
  })),
  achievements: () => get("/users/achievements"),
  achievementSummary: () => get("/users/achievements_summary"),
  achievementDefinitions: () => get("/users/achievements_definitions"),
  achievementProgress: id => get("/users/achievement_progress", {
    achievement_id: id
  }),
  selectBadge: id => post("/users/select_badge", {
    achievement_id: id
  }),
  saveTitle: body => post("/users/title_profile", body),
  frames: () => data(get("/avatar-frames")),
  selectFrame: id => data(post("/avatar-frames/selection", {
    frame_id: id
  }, "PUT")),
  credit: () => get("/credit/history"),
  invite: () => get("/app/get_invite_code"),
  useInvite: body => post("/app/use_invite_code", body),
  lab: () => data(Object(_social__WEBPACK_IMPORTED_MODULE_1__[/* socialRequest */ "b"])("/lab")),
  faqs: () => Object(_social__WEBPACK_IMPORTED_MODULE_1__[/* socialRequest */ "b"])("/app/get_typical_faqs"),
  newestFaqs: () => Object(_social__WEBPACK_IMPORTED_MODULE_1__[/* socialRequest */ "b"])("/app/get_newest_faqs"),
  feedback: body => post("/app/post_faq", body)
});
function accountRequestId(prefix = "account") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

/***/ }),

/***/ 159:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/social/Avatar.vue?vue&type=template&id=66dd0e41&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "social-avatar",
    style: {
      width: `${_vm.size}px`,
      height: `${_vm.size}px`
    }
  }, [_vm._ssrNode("<img" + _vm._ssrAttr("src", _vm.failed ? '/default-avatar.png' : _vm.src || '/default-avatar.png') + _vm._ssrAttr("alt", _vm.alt) + " class=\"avatar-face\"" + _vm._ssrStyle(null, _vm.photoStyle, null) + " data-v-66dd0e41>" + (_vm.frameUrl ? "<img" + _vm._ssrAttr("src", _vm.frameUrl) + " alt class=\"avatar-frame\" data-v-66dd0e41>" : "<!---->"))]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/social/Avatar.vue?vue&type=template&id=66dd0e41&scoped=true

// EXTERNAL MODULE: ./config/avatar-frame-assets.json
var avatar_frame_assets = __webpack_require__(160);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/social/Avatar.vue?vue&type=script&lang=js

/* harmony default export */ var Avatarvue_type_script_lang_js = ({
  props: {
    src: String,
    frame: Object,
    size: {
      type: Number,
      default: 44
    },
    alt: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    failed: false
  }),
  watch: {
    src() {
      this.failed = false;
    }
  },
  computed: {
    frameUrl() {
      const value = this.frame && (this.frame.thumbnail_url || this.frame.asset_url || this.frame.image_url);
      return value && (avatar_frame_assets[value.split("?")[0]] ? avatar_frame_assets[value.split("?")[0]].url : value.startsWith("/static/") ? value.replace("/static/", "/social/") : value);
    },
    photoStyle() {
      if (!this.frame) return {};
      const scale = Math.max(0.35, Math.min(0.9, Number(this.frame.avatar_scale) || 0.58));
      return {
        width: `${scale * 100}%`,
        height: `${scale * 100}%`,
        left: `${50 + (Number(this.frame.offset_x) || 0)}%`,
        top: `${50 + (Number(this.frame.offset_y) || 0)}%`
      };
    }
  }
});
// CONCATENATED MODULE: ./components/social/Avatar.vue?vue&type=script&lang=js
 /* harmony default export */ var social_Avatarvue_type_script_lang_js = (Avatarvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/social/Avatar.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(161)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  social_Avatarvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "66dd0e41",
  "174528c0"
  
)

/* harmony default export */ var Avatar = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 160:
/***/ (function(module) {

module.exports = JSON.parse("{\"/static/avatar-frames/01.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800369649\",\"sha256\":\"ce59220f4debd13c08bf5fcb29484f21a4f85ac0844c41f38e23d8108ed504ca\"},\"/static/avatar-frames/thumbnails/01.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800483750\",\"sha256\":\"eead1d8d88321ff861e09bc7f1d114574a87f18d9915d12ae88523d28fb152b6\"},\"/static/avatar-frames/02.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800558341\",\"sha256\":\"edefcf69c2b1fdf40de7f229017f5e70c49d058109a52174730cbcbf69fbb2e5\"},\"/static/avatar-frames/thumbnails/02.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800650582\",\"sha256\":\"11d901b50ebd4bb8f79daa992b90eba780b78fc88b283c009c081aa63bdd3387\"},\"/static/avatar-frames/03.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800736493\",\"sha256\":\"c6837726690eb409a4152f647f72e2fca966c2b3168c11503c0f15d35ec99f1c\"},\"/static/avatar-frames/thumbnails/03.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800813294\",\"sha256\":\"ada3a8d02e6737d9aea25f941db84e058be890a0b7ed463bd45acb5a3a9e83a4\"},\"/static/avatar-frames/05.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800890855\",\"sha256\":\"04670e3f3d808c573ee501deb23e0cad453b1a8341669fc9ed2d48ac29c1a335\"},\"/static/avatar-frames/thumbnails/05.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800974676\",\"sha256\":\"db259e2cd0275cbae3449e8295ebba1d2fb8161c987058ed7954d0ea681ea454\"},\"/static/avatar-frames/07.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801045407\",\"sha256\":\"4261daa030658b80254383431e976875acc7c26b4e2a3d85bc9a9142d07252ef\"},\"/static/avatar-frames/thumbnails/07.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801125278\",\"sha256\":\"d287c540d44e961db5fbb1adc21a67f42f663062b0728938defafcf7c2b544dd\"},\"/static/avatar-frames/08.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801195919\",\"sha256\":\"e7b7c658d58aa7e722d402308d78d2c62c8a6ee0d25770cd61ec164acdbb7d99\"},\"/static/avatar-frames/thumbnails/08.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801273850\",\"sha256\":\"ba7e816e430b0ebe79c7ecc3480574cc62549e4f1df21feb3520c3725bdbea67\"},\"/static/avatar-frames/09.gif\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801342821\",\"sha256\":\"bff230fd73b4ba3cb9a885feb4bd7ad9921a330ff6aafd631b6f9fa9a2c8d8b1\"},\"/static/avatar-frames/thumbnails/09.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801689572\",\"sha256\":\"dde24e974b0db48571aaf6169da80f58723ecddf49ca813941de0b2b2e145878\"},\"/static/avatar-frames/10.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801760083\",\"sha256\":\"57fc88b0ea94d5bc911dafdc15d0dfecdbcc3e8f155128ce7e4423e2f8ed6ad0\"},\"/static/avatar-frames/thumbnails/10.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801843074\",\"sha256\":\"96162b1c531adbb5b14166da265841a82449190fd99df08f98829a2d507314fa\"},\"/static/avatar-frames/11.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801917835\",\"sha256\":\"43aed01404240f52c64aa9f396d87077a157800ef77eb29a57ff6c3c75edc33d\"},\"/static/avatar-frames/thumbnails/11.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801994086\",\"sha256\":\"0a460abb68075d1d40f4d1fe3e5cab219cf8b7a65ff6393048d689a4e5ec5971\"},\"/static/avatar-frames/12.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802065877\",\"sha256\":\"b3752dbc232a81a41b94f7d61dbca6ee00c54a1b0dcf8d0d21570c0141dc55ff\"},\"/static/avatar-frames/thumbnails/12.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802154688\",\"sha256\":\"b16c7497dd09c78ef135677a936fb1d2f46047694665245e4c73b673f2adc5f2\"},\"/static/avatar-frames/13.gif\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802227339\",\"sha256\":\"3a80ea21f9ab575c36cacde4d3497b69da6ded402c723c28dce3fe7d5d9df82f\"},\"/static/avatar-frames/thumbnails/13.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802816390\",\"sha256\":\"3f10ddc3641a933a4d7ad8017bc0f4734c1893d465e218c62741cc7e9f5a1844\"},\"/static/avatar-frames/14.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802958281\",\"sha256\":\"d5f49e1f4190b90d5c378808d182c600b63b2c6f325dc461773a08c011fd1344\"},\"/static/avatar-frames/thumbnails/14.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803065782\",\"sha256\":\"a723ff95174b5ecc70cfe8b1c761c41d97052622aa469023df5946f7ec42d6e4\"},\"/static/avatar-frames/15.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803153573\",\"sha256\":\"0e139149eec4905d116837a5c6501b6ff0fef549d5afc7778f05c68bf295df06\"},\"/static/avatar-frames/thumbnails/15.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803248864\",\"sha256\":\"705036da8a756e2b345a406a9f91a96df640dc0811a5a68ad186cbfa69ef26c7\"},\"/static/avatar-frames/16.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803321275\",\"sha256\":\"937ca6efd3303aad5a8463e637d1761e73f908e49b0093efab8c5879cb56626f\"},\"/static/avatar-frames/thumbnails/16.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803395216\",\"sha256\":\"0e6b2b46eacbd14a0c1c55e5280379ee693b265b371616942c4430de90953583\"},\"/static/avatar-frames/17.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803475767\",\"sha256\":\"164e15866f44d50b5a488c5c98ebb4387c314044263a36f2897a90bbc98b4f13\"},\"/static/avatar-frames/thumbnails/17.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803549098\",\"sha256\":\"e57078f04ec6bde991a265858cb7cf8c004fe57fbbc3d3addebfda5a3dcbdb21\"},\"/static/avatar-frames/18.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803620139\",\"sha256\":\"035bf7f5d6fbf8bfde7b1428ad8d50c4742db4b1b1f488692df870512c3b99b9\"},\"/static/avatar-frames/thumbnails/18.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803701720\",\"sha256\":\"eda4633bce44e9b4d796767e8f4fbc6de8757d8201dbe6404d18fac0a7ee8886\"},\"/static/avatar-frames/19.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803770011\",\"sha256\":\"95ff8306f2543e346b6766f96c025b73905a38d7f695c7115babf6dab31f134f\"},\"/static/avatar-frames/thumbnails/19.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803853632\",\"sha256\":\"0ca3bc3e9bef6fa1a804913930e1c971f648bfecf4e6502774d84f26d1791c96\"},\"/static/avatar-frames/20.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803926573\",\"sha256\":\"1835d65a5196a8faf04bddcd5a34ca88afb816900b9b3431467560c7f78e5ce9\"},\"/static/avatar-frames/thumbnails/20.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803999254\",\"sha256\":\"65c8d8e10e9314999357c9005178a1e95447a207a327e39289f225e8642e9eab\"},\"/static/avatar-frames/21.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804069495\",\"sha256\":\"3c0517040d5d0f84f59b8c02806245578e1e49d6da40ecd159bf435d0d64eeaf\"},\"/static/avatar-frames/thumbnails/21.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804145966\",\"sha256\":\"1ebd42a6894db3ccb507e0f564202167aa8598d25db96ca18491faad78e5005a\"},\"/static/avatar-frames/22.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804215297\",\"sha256\":\"ac9a53a0bb2bd441dce582b4c2fffedb73758f4e5c77fb1f59d100c63c6e4a1b\"},\"/static/avatar-frames/thumbnails/22.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804352118\",\"sha256\":\"afac522db0bc6461a77c1688a4bdacbd01a8192d57a123efe0f57afc18f87cc9\"},\"/static/avatar-frames/23.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804427609\",\"sha256\":\"341945ec5d00c2ecfb13e90be18d5fcd724707ab683683551d5e2e0ac9445313\"},\"/static/avatar-frames/thumbnails/23.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804498530\",\"sha256\":\"68ce2759f34de87dc2e83f82f0547937509867069f54904927b5317a2445adca\"},\"/static/avatar-frames/24.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804568651\",\"sha256\":\"863fb9046ad64c1405fd2d7a62fa90ecfa323a6fe6a2c791c08f76232c6d5f62\"},\"/static/avatar-frames/thumbnails/24.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804642472\",\"sha256\":\"4eeaf6dd92715b3362c516876089661e8c6b7f81feb9011062e3a13ab292e815\"},\"/static/avatar-frames/25.gif\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804711343\",\"sha256\":\"c32bd21af603206e394569b4f44b9b5c9e0051a820032352aff1bf02cc4b7054\"},\"/static/avatar-frames/thumbnails/25.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135805709654\",\"sha256\":\"bde48d523eb95c573dfbae88014ffeb56d3826667c502a34d3a7281b976a7362\"},\"/static/avatar-frames/26.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135805785385\",\"sha256\":\"5da0d5e5a9debe7b336c211560c35abb9b165b5b89d17f290fb6fd25522550ca\"},\"/static/avatar-frames/thumbnails/26.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135805862856\",\"sha256\":\"d57c2561d013293c736d576657c51d6cb0100f7f993b7c2a1014a7cadd58ae95\"},\"/static/avatar-frames/28.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135805932527\",\"sha256\":\"437b179375cad3b47ef1d35446330e3241ca9c1d5b135f66ffe45eed0dda107b\"},\"/static/avatar-frames/thumbnails/28.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135806015188\",\"sha256\":\"7ee8c37eca2a8157c035096e4aea2fecadc68bc4f2dd8702cae903b74baf0038\"}}");

/***/ }),

/***/ 161:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Avatar_vue_vue_type_style_index_0_id_66dd0e41_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(152);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Avatar_vue_vue_type_style_index_0_id_66dd0e41_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Avatar_vue_vue_type_style_index_0_id_66dd0e41_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Avatar_vue_vue_type_style_index_0_id_66dd0e41_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Avatar_vue_vue_type_style_index_0_id_66dd0e41_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.social-avatar[data-v-66dd0e41] {\r\n  display: inline-block;\r\n  position: relative;\r\n  flex-shrink: 0;\n}\n.avatar-face[data-v-66dd0e41] {\r\n  position: absolute;\r\n  left: 50%;\r\n  top: 50%;\r\n  transform: translate(-50%, -50%);\r\n  width: 100%;\r\n  height: 100%;\r\n  object-fit: cover;\r\n  border-radius: 50%;\n}\n.avatar-frame[data-v-66dd0e41] {\r\n  position: absolute;\r\n  inset: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  object-fit: contain;\r\n  pointer-events: none;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 302:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(387);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("15761680", content, true, context)
};

/***/ }),

/***/ 386:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_14a5bdee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(302);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_14a5bdee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_14a5bdee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_14a5bdee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_14a5bdee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 387:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.profile-hero[data-v-14a5bdee] {\r\n  position: relative;\r\n  min-height: 230px;\r\n  background: #86674c;\r\n  background-size: cover;\r\n  background-position: center;\r\n  border-radius: 18px;\r\n  overflow: hidden;\r\n  color: white;\n}\n.profile-hero-shade[data-v-14a5bdee] {\r\n  position: absolute;\r\n  inset: 0;\r\n  background: linear-gradient(0deg, #30241ed9, #30241e40);\n}\n.profile-hero-main[data-v-14a5bdee] {\r\n  position: relative;\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 22px;\r\n  padding: 46px 30px;\r\n  min-height: 230px;\n}\n.profile-hero h2[data-v-14a5bdee] {\r\n  font-size: 26px;\r\n  margin: 0 0 8px;\n}\n.profile-hero h2 span[data-v-14a5bdee] {\r\n  font-size: 11px;\r\n  color: #e3d5c3;\r\n  font-weight: 400;\r\n  margin-left: 12px;\n}\n.profile-hero p[data-v-14a5bdee] {\r\n  font-size: 13px;\r\n  color: #f0e6d9;\n}\n.profile-card-link[data-v-14a5bdee] {\r\n  margin-left: auto;\r\n  color: #fff3df;\r\n  white-space: nowrap;\r\n  font-size: 13px;\n}\n.profile-groups[data-v-14a5bdee] {\r\n  display: flex;\r\n  gap: 6px;\n}\n.profile-groups span[data-v-14a5bdee] {\r\n  font-size: 11px;\r\n  background: #ffffff26;\r\n  padding: 3px 7px;\r\n  border-radius: 4px;\n}\n.membership-banner[data-v-14a5bdee] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 18px;\r\n  padding: 22px 26px;\r\n  background: linear-gradient(110deg, #33241b, #704b2e);\r\n  border: 1px solid #ae8a52;\r\n  color: #f1cf94;\r\n  border-radius: 15px;\r\n  margin: 18px 0;\n}\n.membership-banner.super[data-v-14a5bdee] {\r\n  background: linear-gradient(110deg, #122734, #254d61);\n}\n.membership-banner img[data-v-14a5bdee] {\r\n  width: 50px;\r\n  height: 50px;\r\n  object-fit: contain;\r\n  image-rendering: pixelated;\n}\n.membership-banner strong[data-v-14a5bdee] {\r\n  font-size: 18px;\n}\n.membership-banner p[data-v-14a5bdee] {\r\n  font-size: 12px;\r\n  opacity: 0.75;\r\n  margin: 8px 0 0;\n}\n.membership-banner > span[data-v-14a5bdee] {\r\n  margin-left: auto;\r\n  white-space: nowrap;\r\n  font-size: 13px;\n}\n.personal-quick[data-v-14a5bdee] {\r\n  display: grid;\r\n  grid-template-columns: 1fr 1fr;\r\n  gap: 18px;\n}\n.personal-quick a[data-v-14a5bdee] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 16px;\r\n  color: var(--ink, #382d25);\n}\n.personal-quick a > i[data-v-14a5bdee]:first-child {\r\n  font-size: 25px;\r\n  color: var(--wood, #947358);\n}\n.personal-quick p[data-v-14a5bdee] {\r\n  font-size: 12px;\r\n  color: var(--muted, #82766c);\r\n  margin: 7px 0 0;\n}\n.personal-quick a > i[data-v-14a5bdee]:last-child {\r\n  margin-left: auto;\r\n  color: #baac9b;\n}\n.personal-columns[data-v-14a5bdee] {\r\n  display: grid;\r\n  grid-template-columns: minmax(0, 1fr) 300px;\r\n  gap: 20px;\n}\n.personal-services a[data-v-14a5bdee],\r\n.personal-services button[data-v-14a5bdee] {\r\n  display: flex;\r\n  gap: 14px;\r\n  align-items: center;\r\n  padding: 16px 0;\r\n  color: var(--ink, #382d25);\r\n  border-bottom: 1px solid #eee6dc;\n}\n.personal-services a[data-v-14a5bdee]:last-child {\r\n  border: 0;\n}\n.personal-services a > i[data-v-14a5bdee]:first-child {\r\n  font-size: 20px;\r\n  color: var(--wood, #947358);\n}\n.personal-services p[data-v-14a5bdee] {\r\n  font-size: 12px;\r\n  color: var(--muted, #82766c);\r\n  margin: 6px 0 0;\n}\n.personal-services a > i[data-v-14a5bdee]:last-child {\r\n  margin-left: auto;\r\n  color: #baa891;\n}\n.personal-services span[data-v-14a5bdee] {\r\n  margin-left: auto;\r\n  font-size: 12px;\r\n  color: var(--wood, #947358);\n}\n.personal-services button[data-v-14a5bdee] {\r\n  background: none;\r\n  border: 0;\r\n  cursor: pointer;\r\n  width: 100%;\r\n  font: inherit;\n}\n.personal-services strong[data-v-14a5bdee] {\r\n  font-size: 14px;\r\n  font-weight: 500;\n}\n.personal-tree[data-v-14a5bdee] {\r\n  background: linear-gradient(130deg, #f1f2dc, #e0e8ca);\n}\n.personal-tree > span[data-v-14a5bdee] {\r\n  font-size: 12px;\r\n  color: #778453;\n}\n.personal-tree h2[data-v-14a5bdee] {\r\n  margin: 14px 0;\n}\n.earnings[data-v-14a5bdee] {\r\n  font-size: 30px;\r\n  color: var(--wood, #947358);\r\n  margin: 18px 0;\n}\n.earnings small[data-v-14a5bdee] {\r\n  font-size: 13px;\n}\n.social-toolbar h2[data-v-14a5bdee] {\r\n  margin: 0;\n}\n.social-toolbar a[data-v-14a5bdee],\r\n.personal-columns a[data-v-14a5bdee] {\r\n  font-size: 13px;\n}\n.account-security[data-v-14a5bdee] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 16px;\n}\n.account-security > i[data-v-14a5bdee] {\r\n  font-size: 24px;\r\n  color: #cc8e3c;\n}\n.account-security p[data-v-14a5bdee] {\r\n  font-size: 12px;\r\n  color: var(--muted, #82766c);\r\n  margin: 5px 0;\n}\n.account-security > a[data-v-14a5bdee] {\r\n  margin-left: auto;\n}\n.row-main p[data-v-14a5bdee] {\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 2;\r\n  -webkit-box-orient: vertical;\r\n  overflow: hidden;\n}\n@media (max-width: 1100px) {\n.personal-columns[data-v-14a5bdee] {\r\n    grid-template-columns: 1fr;\n}\n.profile-hero-main[data-v-14a5bdee] {\r\n    flex-wrap: wrap;\n}\n.profile-card-link[data-v-14a5bdee] {\r\n    margin-left: 108px;\n}\n}\n@media (max-width: 650px) {\n.personal-quick[data-v-14a5bdee] {\r\n    grid-template-columns: 1fr;\r\n    gap: 0;\n}\n.membership-banner[data-v-14a5bdee] {\r\n    padding: 18px;\r\n    flex-wrap: wrap;\n}\n.membership-banner strong[data-v-14a5bdee] {\r\n    font-size: 15px;\n}\n.profile-hero-main[data-v-14a5bdee] {\r\n    padding: 26px 20px;\r\n    gap: 14px;\n}\n.profile-card-link[data-v-14a5bdee] {\r\n    margin-left: 0;\n}\n.profile-hero h2[data-v-14a5bdee] {\r\n    font-size: 22px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 570:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/index.vue?vue&type=template&id=14a5bdee&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('Workspace', {
    attrs: {
      "title": _vm.$t('个人中心'),
      "active": "/me"
    },
    scopedSlots: _vm._u([{
      key: "actions",
      fn: function () {
        return [_c('nuxt-link', {
          attrs: {
            "to": "/me/settings"
          }
        }, [_c('el-button', {
          attrs: {
            "icon": "el-icon-setting"
          }
        }, [_vm._v(_vm._s(_vm.$t("编辑资料")))])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _vm.error ? _c('div', {
    staticClass: "social-panel social-state",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v("\n    " + _vm._s(_vm.error)), _c('br'), _c('el-button', {
    on: {
      "click": _vm.load
    }
  }, [_vm._v(_vm._s(_vm.$t("重新加载")))])], 1) : _vm.loading ? _c('el-skeleton', {
    staticClass: "social-panel",
    attrs: {
      "rows": 8,
      "animated": ""
    }
  }) : [_c('section', {
    staticClass: "profile-hero",
    style: {
      backgroundImage: _vm.user.top_pic_url ? `url(${_vm.user.top_pic_url})` : ''
    }
  }, [_c('div', {
    staticClass: "profile-hero-shade"
  }), _vm._v(" "), _c('div', {
    staticClass: "profile-hero-main"
  }, [_c('Avatar', {
    attrs: {
      "src": _vm.user.avatar_url,
      "frame": _vm.user.avatar_frame,
      "size": 86
    }
  }), _vm._v(" "), _c('div', [_c('h2', [_vm._v("\n            " + _vm._s(_vm.user.name) + " "), _c('span', [_vm._v("ID " + _vm._s(_vm.user.user_id))])]), _vm._v(" "), _vm.user.display_title ? _c('p', {
    staticClass: "profile-title"
  }, [_vm._v("\n            " + _vm._s(_vm.user.display_title) + "\n          ")]) : _vm._e(), _vm._v(" "), _vm.user.motto ? _c('p', [_vm._v(_vm._s(_vm.user.motto))]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "profile-groups"
  }, _vm._l(_vm.groups, function (group) {
    return _c('span', {
      key: group
    }, [_vm._v(_vm._s(group))]);
  }), 0)]), _vm._v(" "), _c('nuxt-link', {
    staticClass: "profile-card-link",
    attrs: {
      "to": `/users/${_vm.user.user_id}`
    }
  }, [_vm._v(_vm._s(_vm.$t("查看个人名片 →")))])], 1)]), _vm._v(" "), _c('nuxt-link', {
    staticClass: "membership-banner",
    class: {
      super: _vm.membership && _vm.membership.membership_type === 'super'
    },
    attrs: {
      "to": "/membership"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.membership && _vm.membership.membership_type === 'super' ? '/social/membership/loghome-super-pass.png' : '/social/membership/loghome-pass.png',
      "alt": ""
    }
  }), _vm._v(" "), _c('div', [_c('strong', [_vm._v(_vm._s(_vm.$t(_vm.membership ? _vm.membership.membership_type === "super" ? "超级原木通行证" : "原木通行证" : "原木通行证")))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.membershipCaption))])]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.$t(_vm.membership ? "管理权益" : "了解权益")) + " →")])]), _vm._v(" "), !_vm.user.email || _vm.user.email === 'unbind' ? _c('div', {
    staticClass: "social-panel account-security"
  }, [_c('i', {
    staticClass: "el-icon-warning-outline"
  }), _vm._v(" "), _c('div', [_c('strong', [_vm._v(_vm._s(_vm.$t("保护你的账号")))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.$t("绑定邮箱，方便找回密码和接收重要通知。")))])]), _vm._v(" "), _c('nuxt-link', {
    attrs: {
      "to": "/me/security"
    }
  }, [_c('el-button', {
    attrs: {
      "size": "small"
    }
  }, [_vm._v(_vm._s(_vm.$t("绑定邮箱")))])], 1)], 1) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "personal-quick"
  }, _vm._l(_vm.quick, function (item) {
    return _c('nuxt-link', {
      key: item.to,
      staticClass: "social-panel",
      attrs: {
        "to": item.to
      }
    }, [_c('i', {
      class: item.icon
    }), _vm._v(" "), _c('div', [_c('strong', [_vm._v(_vm._s(_vm.$t(item.label)))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.$t(item.description)))])]), _vm._v(" "), _c('i', {
      staticClass: "el-icon-arrow-right"
    })]);
  }), 1), _vm._v(" "), _c('div', {
    staticClass: "personal-columns"
  }, [_c('div', [_c('section', {
    staticClass: "social-panel"
  }, [_c('h2', [_vm._v(_vm._s(_vm.$t("我的服务")))]), _vm._v(" "), _c('div', {
    staticClass: "personal-services"
  }, _vm._l(_vm.services, function (item) {
    return _c('nuxt-link', {
      key: item.to,
      attrs: {
        "to": item.to
      }
    }, [_c('i', {
      class: item.icon
    }), _vm._v(" "), _c('div', [_c('strong', [_vm._v(_vm._s(_vm.$t(item.label)))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.$t(item.description)))])]), _vm._v(" "), item.to === '/me/wallet' ? _c('span', [_vm._v(_vm._s(_vm.$t("{p0} 原木", {
      p0: _vm.balances.log === undefined ? _vm.$t("暂无") : _vm.balances.log
    })))]) : _vm._e(), _c('i', {
      staticClass: "el-icon-arrow-right"
    })]);
  }), 1)]), _vm._v(" "), _c('section', {
    staticClass: "social-panel"
  }, [_c('h2', [_vm._v(_vm._s(_vm.$t("更多")))]), _vm._v(" "), _c('div', {
    staticClass: "personal-services"
  }, _vm._l(_vm.more, function (item) {
    return _c('nuxt-link', {
      key: item.to,
      attrs: {
        "to": item.to
      }
    }, [_c('i', {
      class: item.icon
    }), _c('strong', [_vm._v(_vm._s(_vm.$t(item.label)))]), _c('i', {
      staticClass: "el-icon-arrow-right"
    })]);
  }), 1)])]), _vm._v(" "), _c('div', [_c('section', {
    staticClass: "social-panel personal-tree"
  }, [_c('span', [_vm._v(_vm._s(_vm.$t("原木树场")))]), _vm._v(" "), _c('h2', [_vm._v(_vm._s(_vm.$t(_vm.tree.treeState || "查看你的树场")))]), _vm._v(" "), _c('nuxt-link', {
    attrs: {
      "to": "/me/tree"
    }
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    }
  }, [_vm._v(_vm._s(_vm.$t("进入树场")))])], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "social-panel"
  }, [_c('div', {
    staticClass: "social-toolbar"
  }, [_c('h2', [_vm._v(_vm._s(_vm.$t("我的作品")))]), _vm._v(" "), _c('nuxt-link', {
    attrs: {
      "to": "/write"
    }
  }, [_vm._v(_vm._s(_vm.$t("创作中心 →")))])], 1), _vm._v(" "), _vm._l(_vm.works.slice(0, 3), function (work) {
    return _c('nuxt-link', {
      key: work.novel_id,
      staticClass: "social-list-row",
      attrs: {
        "to": `/write/settings/${work.novel_id}`
      }
    }, [_c('img', {
      attrs: {
        "src": work.picUrl || '/default-book-cover.png',
        "alt": ""
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "row-main"
    }, [_c('strong', [_vm._v(_vm._s(work.name))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(work.content || _vm.$t("继续完善你的故事")))])])]);
  }), _vm._v(" "), !_vm.works.length ? _c('p', {
    staticClass: "social-muted"
  }, [_vm._v("\n            " + _vm._s(_vm.$t("暂无作品")) + "\n          ")]) : _vm._e()], 2), _vm._v(" "), _c('section', {
    staticClass: "social-panel"
  }, [_c('h2', [_vm._v(_vm._s(_vm.$t("账户收益")))]), _vm._v(" "), _c('div', {
    staticClass: "earnings"
  }, [_vm._v("\n            " + _vm._s(_vm.earnings) + " "), _c('small', [_vm._v(_vm._s(_vm.$t("元")))])]), _vm._v(" "), _c('nuxt-link', {
    attrs: {
      "to": "/me/wallet?tab=earnings"
    }
  }, [_vm._v(_vm._s(_vm.$t("收益与提现 →")))])], 1)])])]], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/me/index.vue?vue&type=template&id=14a5bdee&scoped=true

// EXTERNAL MODULE: ./components/social/Workspace.vue + 5 modules
var Workspace = __webpack_require__(149);

// EXTERNAL MODULE: ./components/social/Avatar.vue + 4 modules
var Avatar = __webpack_require__(159);

// EXTERNAL MODULE: ./plugins/api/account.js
var account = __webpack_require__(154);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/index.vue?vue&type=script&lang=js




/* harmony default export */ var mevue_type_script_lang_js = ({
  components: {
    Workspace: Workspace["a" /* default */],
    Avatar: Avatar["a" /* default */]
  },
  data: () => ({
    user: {},
    balances: {},
    membership: null,
    tree: {},
    works: [],
    loading: true,
    error: "",
    quick: [{
      to: "/me/messages",
      label: "我的消息",
      description: "查看互动、私信和社区通知",
      icon: "el-icon-message"
    }, {
      to: "/me/friends",
      label: "好友与关注",
      description: "与志同道合的朋友保持联系",
      icon: "el-icon-user"
    }],
    services: [{
      to: "/me/tree",
      label: "原木树场",
      description: "每日签到与成长任务",
      icon: "el-icon-pear"
    }, {
      to: "/me/achievements",
      label: "我的勋章",
      description: "记录成长，组合专属称号",
      icon: "el-icon-medal"
    }, {
      to: "/me/frames",
      label: "头像挂件",
      description: "装点你的社区身份",
      icon: "el-icon-picture-outline"
    }, {
      to: "/me/invite",
      label: "邀请好友",
      description: "分享原木社区，一起成长",
      icon: "el-icon-share"
    }, {
      to: "/me/wallet",
      label: "原木钱包",
      description: "充值、兑换与消费记录",
      icon: "el-icon-coin"
    }, {
      to: "/read/redstone",
      label: "红石账户",
      description: "管理 AI 服务的红石余额",
      icon: "el-icon-magic-stick"
    }, {
      to: "/store",
      label: "原木商城",
      description: "发现社区周边与精选商品",
      icon: "el-icon-shopping-bag-1"
    }, {
      to: "/me/lab",
      label: "原木实验室",
      description: "探索社区的新鲜玩法",
      icon: "el-icon-s-opportunity"
    }],
    more: [{
      to: "/me/credit",
      label: "我的信誉",
      icon: "el-icon-circle-check"
    }, {
      to: "/me/help",
      label: "帮助与反馈",
      icon: "el-icon-chat-line-round"
    }, {
      to: "/about/open-source",
      label: "关于原木社区",
      icon: "el-icon-info"
    }, {
      to: "/me/settings",
      label: "设置与隐私",
      icon: "el-icon-setting"
    }]
  }),
  computed: {
    membershipCaption() {
      if (!this.membership) return this.$t("专属身份、成长加速与更多个性体验");
      return this.$t("有效期至 {date} · {status}", {
        date: this.date(this.membership.expires_at),
        status: this.$t(this.membership.auto_renew ? "自动续费已开启" : "自动续费已关闭")
      });
    },
    groups() {
      return String(this.user.user_group || "").split(",").filter(Boolean);
    },
    earnings() {
      return (Number(this.balances.cropped_log || 0) / 100).toFixed(2);
    }
  },
  mounted() {
    if (!Object(reading["c" /* readingToken */])()) {
      this.$router.replace({
        path: "/login",
        query: {
          redirect: "/me"
        }
      });
      return;
    }
    this.load();
  },
  methods: {
    date(value) {
      return value ? new Date(value).toLocaleDateString(this.$language.state.locale) : "暂无";
    },
    async load() {
      this.loading = true;
      this.error = "";
      try {
        this.user = await account["b" /* default */].profile();
        localStorage.setItem("LogHomeUserInfo", JSON.stringify(this.user));
        const results = await Promise.allSettled([account["b" /* default */].balances(), account["b" /* default */].membership(), this.$api.treePlant.getTreePlantInfo(), this.$api.users.getUserNovels(this.user.user_id)]);
        if (results[0].status === "fulfilled") this.balances = results[0].value;
        if (results[1].status === "fulfilled") this.membership = results[1].value.subscription;
        if (results[2].status === "fulfilled") this.tree = results[2].value;
        if (results[3].status === "fulfilled") this.works = results[3].value.data || [];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  },
  head: () => ({
    title: "个人中心 - 原木社区"
  })
});
// CONCATENATED MODULE: ./pages/me/index.vue?vue&type=script&lang=js
 /* harmony default export */ var pages_mevue_type_script_lang_js = (mevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/me/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(386)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_mevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "14a5bdee",
  "91e37d78"
  
)

/* harmony default export */ var me = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=index.js.map