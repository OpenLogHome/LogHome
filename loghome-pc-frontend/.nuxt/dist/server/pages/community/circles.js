exports.ids = [9];
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

/***/ 314:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(417);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("0e88ca53", content, true, context)
};

/***/ }),

/***/ 416:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_34a103bc_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(314);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_34a103bc_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_34a103bc_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_34a103bc_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_34a103bc_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 417:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.circles-search[data-v-34a103bc] {\r\n  display: flex;\r\n  gap: 12px;\n}\n.circle-grid[data-v-34a103bc] {\r\n  display: grid;\r\n  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));\r\n  gap: 20px;\n}\n.circle-tile[data-v-34a103bc] {\r\n  border: 1px solid var(--line, #e9e0d5);\r\n  border-radius: 14px;\r\n  overflow: hidden;\r\n  background: var(--surface, #fffdf9);\r\n  color: var(--ink, #382d25);\n}\n.circle-tile-cover[data-v-34a103bc] {\r\n  height: 112px;\r\n  background-color: #e8ddcc;\r\n  background-size: cover;\r\n  background-position: center;\r\n  position: relative;\n}\n.circle-tile-cover img[data-v-34a103bc] {\r\n  position: absolute;\r\n  left: 22px;\r\n  bottom: -20px;\r\n  width: 64px;\r\n  height: 64px;\r\n  border-radius: 14px;\r\n  border: 4px solid var(--surface, #fffdf9);\r\n  object-fit: cover;\n}\n.circle-tile-body[data-v-34a103bc] {\r\n  padding: 34px 22px 22px;\n}\n.circle-tile header[data-v-34a103bc] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 10px;\n}\n.circle-tile h2[data-v-34a103bc] {\r\n  font-size: 19px;\r\n  margin: 0;\n}\n.circle-tile p[data-v-34a103bc] {\r\n  font-size: 13px;\r\n  color: var(--muted, #82766c);\r\n  line-height: 1.8;\r\n  height: 46px;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 2;\r\n  -webkit-box-orient: vertical;\r\n  overflow: hidden;\r\n  margin: 12px 0 20px;\n}\n.circle-tile footer[data-v-34a103bc] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  gap: 8px;\r\n  font-size: 11px;\r\n  color: var(--muted, #82766c);\n}\n@media (max-width: 650px) {\n.circle-grid[data-v-34a103bc] {\r\n    grid-template-columns: 1fr;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 579:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/circles.vue?vue&type=template&id=34a103bc&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('Workspace', {
    attrs: {
      "title": _vm.$t('圈子广场'),
      "active": "/community/circles"
    },
    scopedSlots: _vm._u([{
      key: "actions",
      fn: function () {
        return [_c('nuxt-link', {
          attrs: {
            "to": "/community/circle/create"
          }
        }, [_c('el-button', {
          attrs: {
            "type": "primary",
            "icon": "el-icon-plus"
          }
        }, [_vm._v(_vm._s(_vm.$t("创建圈子")))])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c('form', {
    staticClass: "social-panel circles-search",
    on: {
      "submit": function ($event) {
        $event.preventDefault();
        return _vm.search.apply(null, arguments);
      }
    }
  }, [_c('el-input', {
    attrs: {
      "clearable": "",
      "placeholder": _vm.$t('搜索圈子名称或描述'),
      "aria-label": _vm.$t('搜索圈子名称或描述')
    },
    model: {
      value: _vm.keyword,
      callback: function ($$v) {
        _vm.keyword = $$v;
      },
      expression: "keyword"
    }
  }), _c('el-button', {
    attrs: {
      "native-type": "submit",
      "icon": "el-icon-search"
    }
  }, [_vm._v(_vm._s(_vm.$t("搜索")))])], 1), _vm._v(" "), _c('div', {
    staticClass: "social-tabs"
  }, [_c('button', {
    class: {
      active: _vm.filter === 'all'
    },
    on: {
      "click": function ($event) {
        return _vm.switchFilter('all');
      }
    }
  }, [_vm._v("\n      " + _vm._s(_vm.$t("全部圈子")))]), _c('button', {
    class: {
      active: _vm.filter === 'mine'
    },
    on: {
      "click": function ($event) {
        return _vm.switchFilter('mine');
      }
    }
  }, [_vm._v("\n      " + _vm._s(_vm.$t("我的圈子")))]), _vm._l(_vm.categories, function (category) {
    return _c('button', {
      key: category.category_id,
      class: {
        active: _vm.filter === String(category.category_id)
      },
      on: {
        "click": function ($event) {
          _vm.switchFilter(String(category.category_id));
        }
      }
    }, [_vm._v("\n      " + _vm._s(category.name) + "\n    ")]);
  })], 2), _vm._v(" "), _vm.error ? _c('div', {
    staticClass: "social-panel social-state",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v("\n    " + _vm._s(_vm.error)), _c('br'), _c('el-button', {
    on: {
      "click": _vm.load
    }
  }, [_vm._v(_vm._s(_vm.$t("重试")))])], 1) : _vm._e(), _vm._v(" "), _vm.loading && !_vm.circles.length ? _c('el-skeleton', {
    staticClass: "social-panel",
    attrs: {
      "rows": 6,
      "animated": ""
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "circle-grid"
  }, _vm._l(_vm.circles, function (circle) {
    return _c('nuxt-link', {
      key: circle.circle_id,
      staticClass: "circle-tile",
      attrs: {
        "to": `/community/circle/${circle.circle_id}`
      }
    }, [_c('div', {
      staticClass: "circle-tile-cover",
      style: {
        backgroundImage: circle.bg_url ? `url(${circle.bg_url})` : ''
      }
    }, [_c('img', {
      attrs: {
        "src": circle.icon || '/default-avatar.png',
        "alt": ""
      }
    })]), _vm._v(" "), _c('div', {
      staticClass: "circle-tile-body"
    }, [_c('header', [_c('h2', [_vm._v(_vm._s(circle.name))]), _vm._v(" "), circle.is_official ? _c('el-tag', {
      attrs: {
        "size": "mini",
        "type": "warning"
      }
    }, [_vm._v(_vm._s(_vm.$t("官方")))]) : _vm._e()], 1), _vm._v(" "), _c('p', [_vm._v(_vm._s(circle.description || _vm.$t("来这里与圈友交流吧。")))]), _vm._v(" "), _c('footer', [_c('span', [_vm._v(_vm._s(_vm.$t("{p0} 位成员 / {p1} 篇帖子", {
      p0: circle.member_count || 0,
      p1: circle.post_count || 0
    })))]), _vm.joinedIds.has(String(circle.circle_id)) ? _c('el-tag', {
      attrs: {
        "size": "mini",
        "type": "info"
      }
    }, [_vm._v(_vm._s(_vm.$t("已加入")))]) : _vm._e()], 1)])]);
  }), 1), _vm._v(" "), !_vm.loading && !_vm.error && !_vm.circles.length ? _c('div', {
    staticClass: "social-panel social-state"
  }, [_c('i', {
    staticClass: "el-icon-chat-dot-round"
  }), _vm._v(_vm._s(_vm.filter === "mine" ? _vm.$t("还没有加入圈子，去广场寻找同好吧。") : _vm.$t("没有找到相关圈子，试试其他分类或关键词。")) + "\n  ")]) : _vm._e(), _vm._v(" "), _vm.circles.length ? _c('div', {
    staticClass: "social-end"
  }, [_vm.hasMore ? _c('el-button', {
    attrs: {
      "loading": _vm.loading
    },
    on: {
      "click": _vm.load
    }
  }, [_vm._v(_vm._s(_vm.$t("加载更多")))]) : _c('span', [_vm._v(_vm._s(_vm.$t("全部圈子已展示")))])], 1) : _vm._e()], 1);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/community/circles.vue?vue&type=template&id=34a103bc&scoped=true

// EXTERNAL MODULE: ./components/social/Workspace.vue + 5 modules
var Workspace = __webpack_require__(149);

// EXTERNAL MODULE: ./plugins/api/social.js
var social = __webpack_require__(26);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/circles.vue?vue&type=script&lang=js



/* harmony default export */ var circlesvue_type_script_lang_js = ({
  components: {
    Workspace: Workspace["a" /* default */]
  },
  data: () => ({
    categories: [],
    circles: [],
    mine: [],
    filter: "all",
    keyword: "",
    searchedKeyword: "",
    page: 1,
    loading: false,
    error: "",
    hasMore: true,
    requestId: 0
  }),
  computed: {
    joinedIds() {
      return new Set(this.mine.map(item => String(item.circle_id)));
    }
  },
  async mounted() {
    try {
      const [categories, mine] = await Promise.all([social["a" /* default */].categories(), Object(reading["c" /* readingToken */])() ? social["a" /* default */].myCircles() : Promise.resolve([])]);
      this.categories = categories;
      this.mine = mine;
    } catch (error) {
      this.$message.error(error.message);
    }
    this.load();
  },
  beforeDestroy() {
    this.requestId++;
  },
  methods: {
    switchFilter(filter) {
      if (this.filter === filter) return;
      if (filter === "mine" && !Object(reading["c" /* readingToken */])()) {
        this.$router.push({
          path: "/login",
          query: {
            redirect: "/community/circles"
          }
        });
        return;
      }
      this.filter = filter;
      this.reset();
    },
    search() {
      this.searchedKeyword = this.keyword.trim();
      this.reset();
    },
    reset() {
      this.requestId++;
      this.loading = false;
      this.page = 1;
      this.hasMore = true;
      this.circles = [];
      this.load();
    },
    async load() {
      if (this.loading || !this.hasMore) return;
      const request = ++this.requestId;
      this.loading = true;
      this.error = "";
      try {
        if (this.filter === "mine") {
          this.mine = await social["a" /* default */].myCircles();
          if (request !== this.requestId) return;
          this.circles = this.mine.filter(item => `${item.name} ${item.description || ""}`.includes(this.searchedKeyword));
          this.hasMore = false;
          return;
        }
        const result = await social["a" /* default */].circles({
          page: this.page,
          pageSize: 12,
          keyword: this.searchedKeyword,
          ...(this.filter === "all" ? {} : {
            category_id: this.filter
          })
        });
        if (request !== this.requestId) return;
        this.circles = [...this.circles, ...result.list];
        this.page++;
        this.hasMore = this.circles.length < result.total;
      } catch (error) {
        if (request === this.requestId) this.error = error.message;
      } finally {
        if (request === this.requestId) this.loading = false;
      }
    }
  },
  head: () => ({
    title: "圈子广场 - 原木社区"
  })
});
// CONCATENATED MODULE: ./pages/community/circles.vue?vue&type=script&lang=js
 /* harmony default export */ var community_circlesvue_type_script_lang_js = (circlesvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/community/circles.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(416)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  community_circlesvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "34a103bc",
  "91ee6e2c"
  
)

/* harmony default export */ var circles = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=circles.js.map