exports.ids = [4];
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

/***/ 244:
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

/***/ 313:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(415);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("ac6c9f18", content, true, context)
};

/***/ }),

/***/ 414:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_64d392ed_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(313);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_64d392ed_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_64d392ed_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_64d392ed_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_chat_vue_vue_type_style_index_0_id_64d392ed_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 415:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".chat-page[data-v-64d392ed]{height:max(360px,100dvh - 220px);display:flex;flex-direction:column;background-color:#f5f5f5;border:1px solid var(--line, #e9e0d5);border-radius:12px;overflow:hidden}.chat-header[data-v-64d392ed]{background:var(--surface, #fffdf9);padding:16px 20px;border-bottom:1px solid var(--line, #e9e0d5);display:flex;align-items:center;flex:none}.chat-header .back-button[data-v-64d392ed]{margin-right:16px;cursor:pointer;padding:8px;border-radius:4px;transition:background-color .2s}.chat-header .back-button[data-v-64d392ed]:hover{background-color:#f0f0f0}.chat-header .back-button i[data-v-64d392ed]{font-size:20px;color:#666}.chat-header .chat-user-info[data-v-64d392ed]{display:flex;align-items:center}.chat-header .chat-user-info .user-avatar[data-v-64d392ed]{width:40px;height:40px;border-radius:50%;margin-right:12px;object-fit:cover}.chat-header .chat-user-info .user-details .username[data-v-64d392ed]{margin:0;font-size:16px;font-weight:500;color:var(--ink, #382d25)}.chat-header .chat-user-info .user-details .user-id[data-v-64d392ed]{font-size:12px;color:var(--muted, #776a5d)}.messages-container[data-v-64d392ed]{flex:1;min-height:0;overflow-y:auto;padding:20px}.messages-container .messages-list[data-v-64d392ed]{display:flex;flex-direction:column;gap:16px}.messages-container .messages-list .load-more[data-v-64d392ed]{text-align:center;font-size:13px;color:var(--wood, #947358);cursor:pointer}.messages-container .messages-list .load-more[data-v-64d392ed]:hover{text-decoration:underline}.messages-container .message-item[data-v-64d392ed]{display:flex;align-items:flex-start}.messages-container .message-item.own-message[data-v-64d392ed]{flex-direction:row-reverse}.messages-container .message-item.own-message .message-content[data-v-64d392ed]{align-items:flex-end}.messages-container .message-item.own-message .message-content .message-bubble[data-v-64d392ed]{background-color:var(--wood, #79573d);color:var(--ui-primary-text, #fffdf9)}.messages-container .message-item.own-message .message-content .message-bubble .message-time[data-v-64d392ed]{color:inherit;opacity:.8}.messages-container .message-item .message-avatar[data-v-64d392ed]{margin:0 12px}.messages-container .message-item .message-avatar img[data-v-64d392ed]{width:36px;height:36px;border-radius:50%;object-fit:cover}.messages-container .message-item .message-content[data-v-64d392ed]{display:flex;flex-direction:column;align-items:flex-start;max-width:60%}.messages-container .message-item .message-content .message-bubble[data-v-64d392ed]{background-color:var(--surface, #fffdf9);color:var(--ink, #382d25);border-radius:12px;padding:12px 16px}.messages-container .message-item .message-content .message-bubble .message-text[data-v-64d392ed]{font-size:14px;line-height:1.5;white-space:pre-wrap;word-break:break-word}.messages-container .message-item .message-content .message-bubble .message-image[data-v-64d392ed]{display:block;max-width:260px;max-height:260px;border-radius:8px;object-fit:cover;cursor:zoom-in}.messages-container .message-item .message-content .message-bubble .shared-book-card[data-v-64d392ed]{display:flex;gap:10px;width:260px;max-width:100%;padding:8px;border-radius:8px;background:#faf8f5;border:1px solid #f0e8dd;cursor:pointer}.messages-container .message-item .message-content .message-bubble .shared-book-card .shared-book-cover[data-v-64d392ed]{width:48px;height:64px;object-fit:cover;border-radius:4px;flex-shrink:0;background:#eee}.messages-container .message-item .message-content .message-bubble .shared-book-card .shared-book-info[data-v-64d392ed]{flex:1;min-width:0;display:flex;flex-direction:column}.messages-container .message-item .message-content .message-bubble .shared-book-card .shared-book-tag[data-v-64d392ed]{font-size:11px;color:var(--wood, #947358)}.messages-container .message-item .message-content .message-bubble .shared-book-card .shared-book-title[data-v-64d392ed]{font-size:14px;color:#333;font-weight:500;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.messages-container .message-item .message-content .message-bubble .shared-book-card .shared-book-author[data-v-64d392ed]{font-size:12px;color:#999;margin-top:2px}.messages-container .message-item .message-content .message-bubble .message-time[data-v-64d392ed]{font-size:11px;color:hsla(0,0%,100%,.7);margin-top:4px;text-align:right}.messages-container .message-item:not(.own-message) .message-content .message-bubble .message-time[data-v-64d392ed]{color:var(--muted, #776a5d)}.messages-container .empty-messages[data-v-64d392ed]{text-align:center;padding:60px 20px;color:var(--muted, #776a5d)}.messages-container .empty-messages i[data-v-64d392ed]{font-size:64px;margin-bottom:16px;display:block}.messages-container .empty-messages p[data-v-64d392ed]{font-size:16px;margin:0}.message-input-container[data-v-64d392ed]{background:var(--surface, #fffdf9);border-top:1px solid var(--line, #e9e0d5);padding:16px 20px;flex:none}.message-input-container .input-wrapper[data-v-64d392ed]{display:flex;align-items:flex-end;gap:12px}.message-input-container .input-wrapper .el-textarea[data-v-64d392ed]{flex:1}.message-input-container .input-wrapper .input-actions[data-v-64d392ed]{display:flex;align-items:center}@media(min-width: 1200px){.chat-page[data-v-64d392ed]{max-width:1200px;margin:0 auto}.messages-container[data-v-64d392ed]{padding:24px}.message-item .message-content[data-v-64d392ed]{max-width:50%}.message-input-container[data-v-64d392ed]{padding:16px 24px}}@media(max-width: 1199px)and (min-width: 992px){.messages-container[data-v-64d392ed]{padding:25px 30px}.message-item .message-content[data-v-64d392ed]{max-width:55%}.message-input-container[data-v-64d392ed]{padding:18px 30px}}@media(max-width: 991px)and (min-width: 768px){.messages-container[data-v-64d392ed]{padding:20px 25px}.message-item .message-content[data-v-64d392ed]{max-width:65%}.message-input-container[data-v-64d392ed]{padding:16px 25px}.chat-header[data-v-64d392ed]{padding:14px 20px}}@media(max-width: 767px){.chat-page[data-v-64d392ed]{height:max(360px,100dvh - 260px)}.messages-container[data-v-64d392ed]{padding:16px}.message-item .message-content[data-v-64d392ed]{max-width:80%}.message-item .message-avatar[data-v-64d392ed]{margin:0 8px}.message-item .message-avatar img[data-v-64d392ed]{width:32px;height:32px}.message-input-container[data-v-64d392ed]{padding:12px 16px}.chat-header[data-v-64d392ed]{padding:12px 16px}.chat-header .chat-user-info .user-avatar[data-v-64d392ed]{width:36px;height:36px}.chat-header .chat-user-info .user-details .username[data-v-64d392ed]{font-size:15px}}@media(max-width: 480px){.message-item .message-content[data-v-64d392ed]{max-width:85%}.message-item .message-bubble[data-v-64d392ed]{padding:10px 12px !important}.message-item .message-bubble .message-text[data-v-64d392ed]{font-size:13px !important}.message-input-container[data-v-64d392ed]{padding:10px 12px}.message-input-container .input-wrapper[data-v-64d392ed]{gap:8px}.chat-header[data-v-64d392ed]{padding:10px 12px}}.friends-page[data-v-64d392ed],.settings-page[data-v-64d392ed],.post-detail-page[data-v-64d392ed],.post-edit-container[data-v-64d392ed]{padding:0 !important;max-width:none !important}.friends-card[data-v-64d392ed],.settings-card[data-v-64d392ed],.post-detail[data-v-64d392ed],.comments-section[data-v-64d392ed]{border:1px solid var(--line, #e9e0d5) !important;border-radius:14px !important;box-shadow:none !important;background:var(--surface, #fffdf9) !important}.post-detail-container[data-v-64d392ed]{gap:22px !important}.post-detail-main[data-v-64d392ed]{min-width:0}.post-detail-page[data-v-64d392ed]{min-height:0 !important}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 578:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/chat.vue?vue&type=template&id=64d392ed&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('Workspace', {
    attrs: {
      "title": _vm.$t('私信对话'),
      "compact": "",
      "active": "/me/messages"
    }
  }, [_c('div', {
    staticClass: "chat-page"
  }, [_c('div', {
    staticClass: "chat-header"
  }, [_c('div', {
    staticClass: "chat-user-info"
  }, [_c('img', {
    staticClass: "user-avatar",
    attrs: {
      "src": _vm.targetUser.avatar_url || '/default-avatar.png',
      "alt": _vm.$t('头像')
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "user-details"
  }, [_c('h3', {
    staticClass: "username"
  }, [_vm._v(_vm._s(_vm.targetUser.name))]), _vm._v(" "), _c('span', {
    staticClass: "user-id"
  }, [_vm._v("ID: " + _vm._s(_vm.targetUser.user_id))])])])]), _vm._v(" "), _c('div', {
    ref: "messagesContainer",
    staticClass: "messages-container"
  }, [_c('div', {
    staticClass: "messages-list"
  }, [_vm.hasMore && _vm.messages.length ? _c('div', {
    staticClass: "load-more",
    on: {
      "click": _vm.loadOlderMessages
    }
  }, [!_vm.loading ? _c('span', [_vm._v(_vm._s(_vm.$t("加载更早的消息")))]) : _c('span', [_vm._v(_vm._s(_vm.$t("加载中...")))])]) : _vm._e(), _vm._v(" "), _vm._l(_vm.displayMessages, function (message) {
    return _c('div', {
      key: message.id,
      staticClass: "message-item",
      class: {
        'own-message': message.sender_id === _vm.myUserId
      }
    }, [_c('div', {
      staticClass: "message-avatar"
    }, [_c('img', {
      attrs: {
        "src": message.sender_id === _vm.myUserId ? _vm.myUserInfo.avatar_url : _vm.targetUser.avatar_url,
        "alt": _vm.$t('头像')
      }
    })]), _vm._v(" "), _c('div', {
      staticClass: "message-content"
    }, [_c('div', {
      staticClass: "message-bubble"
    }, [message.displayType === 'image' ? _c('img', {
      staticClass: "message-image",
      attrs: {
        "src": message.imageUrl,
        "alt": _vm.$t('图片消息')
      },
      on: {
        "click": function ($event) {
          return _vm.previewImage(message.imageUrl);
        }
      }
    }) : message.displayType === 'novel_share' ? _c('div', {
      staticClass: "shared-book-card",
      on: {
        "click": function ($event) {
          return _vm.openSharedNovel(message.novel);
        }
      }
    }, [_c('img', {
      staticClass: "shared-book-cover",
      attrs: {
        "src": message.novel.picUrl || '/default-book-cover.png',
        "alt": message.novel.name
      },
      on: {
        "error": function ($event) {
          $event.target.src = '/default-book-cover.png';
        }
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "shared-book-info"
    }, [_c('span', {
      staticClass: "shared-book-tag"
    }, [_vm._v(_vm._s(_vm.$t("分享了作品")))]), _vm._v(" "), _c('span', {
      staticClass: "shared-book-title"
    }, [_vm._v(_vm._s(message.novel.name))]), _vm._v(" "), _c('span', {
      staticClass: "shared-book-author"
    }, [_vm._v(_vm._s(message.novel.author_name))])])]) : _c('div', {
      staticClass: "message-text"
    }, [_vm._v(_vm._s(message.displayText))]), _vm._v(" "), _c('div', {
      staticClass: "message-time"
    }, [_vm._v("\n                " + _vm._s(_vm.formatTime(message.sent_at)) + "\n              ")])])])]);
  })], 2), _vm._v(" "), _vm.messages.length === 0 ? _c('div', {
    staticClass: "empty-messages"
  }, [_c('i', {
    staticClass: "el-icon-chat-dot-round"
  }), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.$t("还没有消息，开始聊天吧！")))])]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "message-input-container"
  }, [_c('div', {
    staticClass: "input-wrapper"
  }, [_c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 2,
      "placeholder": _vm.$t('输入消息...'),
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
  }), _vm._v(" "), _c('div', {
    staticClass: "input-actions"
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.sending,
      "disabled": !_vm.newMessage.trim()
    },
    on: {
      "click": _vm.sendMessage
    }
  }, [_vm._v("\n            " + _vm._s(_vm.$t("发送")) + "\n          ")])], 1)], 1)])])]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/community/chat.vue?vue&type=template&id=64d392ed&scoped=true

// EXTERNAL MODULE: ./components/social/Workspace.vue + 5 modules
var Workspace = __webpack_require__(149);

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(43);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/private-message.js
var private_message = __webpack_require__(244);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/chat.vue?vue&type=script&lang=js




/* harmony default export */ var chatvue_type_script_lang_js = ({
  components: {
    Workspace: Workspace["a" /* default */]
  },
  name: "ChatPage",
  data() {
    return {
      accountToken: null,
      disposed: false,
      targetUserId: null,
      targetUser: {},
      messages: [],
      newMessage: "",
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
    this.accountToken = Object(reading["c" /* readingToken */])();
    if (!this.accountToken) {
      this.login();
      return;
    }
    window.addEventListener("storage", this.checkAccount);
    window.addEventListener("focus", this.checkAccount);
    window.addEventListener("auth-state-changed", this.checkAccount);
    // 获取目标用户ID
    this.targetUserId = this.$route.query.id;
    if (!/^[1-9]\d*$/.test(this.targetUserId || "")) {
      this.$message.error(this.$t("缺少用户ID参数"));
      this.goBack();
      return;
    }

    // 获取当前用户信息
    await this.getCurrentUserInfo();
    if (!this.myUserId || !this.currentAccount()) return;

    // 获取目标用户信息
    await this.getTargetUserInfo();

    // 加载聊天记录
    await this.loadMessages();

    // 滚动到底部
    this.$nextTick(() => {
      this.scrollToBottom();
    });
    if (!this.currentAccount()) return;
    // 轮询新消息，避免只有刷新才能看到对方回复
    this.pollTimer = setInterval(this.pollNewMessages, 10000);
  },
  beforeRouteLeave(to, from, next) {
    if (this.sending) {
      this.$message.info(this.$t("消息正在发送，请稍候"));
      next(false);
      return;
    }
    if (!this.newMessage.trim() || !this.currentAccount()) {
      next();
      return;
    }
    this.$confirm(this.$t("尚有未发送的私信，离开后将丢失内容。"), this.$t("离开聊天"), {
      confirmButtonText: this.$t("离开"),
      cancelButtonText: this.$t("继续编辑")
    }).then(() => next()).catch(() => next(false));
  },
  beforeDestroy() {
    this.disposed = true;
    window.removeEventListener("storage", this.checkAccount);
    window.removeEventListener("focus", this.checkAccount);
    window.removeEventListener("auth-state-changed", this.checkAccount);
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  },
  methods: {
    login() {
      this.$router.replace({
        path: "/login",
        query: {
          redirect: this.$route.fullPath
        }
      });
    },
    currentAccount() {
      return !this.disposed && !!this.accountToken && Object(reading["c" /* readingToken */])() === this.accountToken;
    },
    checkAccount() {
      if (this.currentAccount() || this.disposed) return;
      this.messages = [];
      this.newMessage = "";
      this.myUserId = null;
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
      this.login();
    },
    getToken() {
      return Object(reading["c" /* readingToken */])();
    },
    // 获取当前用户信息
    async getCurrentUserInfo() {
      try {
        const userInfo = await this.$api.users.getUserProfile();
        if (!this.currentAccount()) return;
        this.myUserInfo = userInfo;
        this.myUserId = Number(userInfo.user_id);
        if (!this.myUserId) this.login();
      } catch (error) {
        console.error("获取用户信息失败", error);
        this.$message.error(this.$t("获取用户信息失败"));
      }
    },
    // 获取目标用户信息
    async getTargetUserInfo() {
      try {
        const response = await this.$api.users.getUserInfo(this.targetUserId);
        if (!this.currentAccount()) return;
        if (response.code === 0) {
          this.targetUser = response.data;
        } else {
          throw new Error(response.message || "获取用户信息失败");
        }
      } catch (error) {
        console.error("获取目标用户信息失败", error);
        this.$message.error(this.$t("获取用户信息失败"));
      }
    },
    // 加载聊天记录（首屏）
    async loadMessages() {
      if (this.loading || !this.currentAccount()) return;
      this.loading = true;
      try {
        const response = await this.$api.community.getMessageList(this.targetUserId, 20);
        if (!this.currentAccount()) return;
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
          throw new Error(response.message || "加载消息失败");
        }
      } catch (error) {
        console.error("加载消息失败", error);
        this.$message.error(this.$t("加载消息失败"));
      } finally {
        this.loading = false;
      }
    },
    // 向上翻页：加载更早的消息
    async loadOlderMessages() {
      if (this.loading || !this.hasMore || !this.oldestId || !this.currentAccount()) return;
      this.loading = true;
      try {
        const response = await this.$api.community.getMessageList(this.targetUserId, 20, this.oldestId);
        if (!this.currentAccount()) return;
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
        console.error("加载更早消息失败", error);
        this.$message.error(this.$t("加载更早消息失败"));
      } finally {
        this.loading = false;
      }
    },
    // 拉取对方新发来的消息
    async pollNewMessages() {
      if (this.sending || !this.targetUserId || this.newestId === null || !this.currentAccount()) return;
      try {
        const token = this.getToken();
        if (!token) return;
        const response = await fetch(`${"https://api.loghome.ink"}/community/new_messages?friend_id=${this.targetUserId}&since_id=${this.newestId}`, {
          headers: {
            Authorization: token
          }
        });
        if (!response.ok) throw new Error("读取消息失败");
        const list = await response.json();
        if (!this.currentAccount()) return;
        if (Array.isArray(list) && list.length) {
          this.messages = [...this.messages, ...list];
          this.newestId = list[list.length - 1].id;
          this.markReceivedAsRead(list);
          this.$nextTick(this.scrollToBottom);
        }
      } catch (error) {
        console.error("获取新消息失败", error);
      }
    },
    // 把对方发来的未读消息标记为已读
    markReceivedAsRead(list) {
      if (!this.currentAccount()) return;
      const unread = list.filter(item => Number(item.receiver_id) === this.myUserId && !item.is_read);
      unread.forEach(item => {
        this.$api.community.markMessageAsRead(item.id);
      });
    },
    // 发送消息
    async sendMessage() {
      if (!this.newMessage.trim() || this.sending || !this.currentAccount()) return;
      const messageContent = this.newMessage.trim();
      this.sending = true;
      try {
        const response = await this.$api.community.sendMessage(this.targetUserId, messageContent);
        if (!this.currentAccount()) return;
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
          this.newMessage = "";

          // 滚动到底部
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        } else {
          throw new Error(response.message || "发送失败");
        }
      } catch (error) {
        console.error("发送消息失败", error);
        this.$message.error(this.$t("发送失败，请重试"));
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
      this.newMessage += "\n";
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
      return external_moment_default()(time).format("MM-DD HH:mm");
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
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/community/chat.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(414)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  community_chatvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "64d392ed",
  "4ac243be"
  
)

/* harmony default export */ var chat = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=chat.js.map