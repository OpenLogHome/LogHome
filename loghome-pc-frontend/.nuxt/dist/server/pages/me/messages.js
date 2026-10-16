exports.ids = [30];
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

/***/ 170:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return mediaUrls; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return normalizePost; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return messageTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return notificationGroups; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return postShareMessage; });
function mediaUrls(value) {
  try {
    const list = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(list) ? list.filter(url => typeof url === "string" && /^https?:\/\//i.test(url)) : [];
  } catch (_) {
    return [];
  }
}
function normalizePost(post) {
  return {
    ...post,
    media_urls: mediaUrls(post.media_urls),
    like_count: Number(post.like_count) || 0,
    is_liked: Boolean(post.is_liked),
    likePending: false
  };
}
function messageTime(value) {
  if (!value) return 0;
  const text = String(value).replace(" ", "T");
  return Date.parse(/Z$|[+-]\d{2}:?\d{2}$/.test(text) ? text : `${text}Z`) || 0;
}
function notificationGroups(messages, history = false, now = Date.now()) {
  const groups = new Map();
  messages.filter(item => {
    const archived = Number(item.is_read) === 2 || item.message_type === "notification" && messageTime(item.time) < now - 14 * 86400000;
    return archived === history;
  }).forEach(item => {
    const key = JSON.stringify([item.from_id, item.message_content, item.message_type, item.router]);
    if (!groups.has(key)) groups.set(key, {
      key,
      items: []
    });
    groups.get(key).items.push(item);
  });
  return [...groups.values()].map(group => ({
    ...group,
    items: group.items.sort((a, b) => messageTime(b.time) - messageTime(a.time))
  })).sort((a, b) => messageTime(b.items[0].time) - messageTime(a.items[0].time));
}
function postShareMessage(post, origin = "https://loghome.ink") {
  const content = String(post.content || "");
  return `来自原木社区的分享：${post.title || ""}\n${content.slice(0, 50)}${content.length > 50 ? "..." : ""}\n点击链接查看详情：${origin}/community/post/${post.post_id}`;
}

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* unused harmony export activityNewsLink */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return normalizeActivities; });
/* unused harmony export activityMessageLink */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return activityMessagePage; });
/* harmony import */ var _social_links__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
/* harmony import */ var _reading_discovery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _reader_comment_links__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(40);
/* harmony import */ var _reading_seo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(39);




function safeLink(raw, mobileBase) {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  if (!value || /[\\\u0000-\u001f]/.test(value)) return null;
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (url.username || url.password) return null;
      if (url.origin === _reading_seo__WEBPACK_IMPORTED_MODULE_3__[/* SITE_ORIGIN */ "a"]) return {
        href: url.pathname + url.search + url.hash,
        external: false
      };
      if (url.origin === new URL(mobileBase).origin && url.hash.startsWith('#/pages/')) return Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_1__[/* discoveryLink */ "g"])(url.hash.slice(1), mobileBase);
      return {
        href: url.href,
        external: true
      };
    } catch (_) {
      return null;
    }
  }
  return Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_1__[/* discoveryLink */ "g"])(value, mobileBase);
}
function activityNewsLink(news, mobileBase = 'https://m.loghome.ink') {
  return safeLink(news && news.pc_link, mobileBase) || safeLink(news && news.mobile_link, mobileBase);
}
function normalizeActivities(rows, mobileBase = 'https://m.loghome.ink') {
  if (!Array.isArray(rows)) throw Error('活动资讯返回数据无效');
  const seen = new Set();
  return rows.filter(row => {
    const id = Number(row && row.tag_id);
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id)) return false;
    seen.add(id);
    return true;
  }).map(row => ({
    ...row,
    tag_id: Number(row.tag_id),
    news: (Array.isArray(row.news) ? row.news : []).filter(news => news && typeof news.title === 'string').map(news => ({
      ...news,
      link: activityNewsLink(news, mobileBase)
    }))
  }));
}
function activityMessageLink(router, mobileBase = 'https://m.loghome.ink') {
  const raw = String(router || '').trim();
  if (!raw || raw === '/' || raw === 'None' || /^[a-z][a-z\d+.-]*:|^\/\/|[\\\u0000-\u001f]/i.test(raw)) return null;
  const route = raw.replace(/^(?:\.\.?\/)+/, '').replace(/^\/?(?:#\/)?(?:pages\/)?/, '');
  const reading = Object(_reader_comment_links__WEBPACK_IMPORTED_MODULE_2__[/* readingMessageTarget */ "c"])(route);
  if (reading) return {
    href: reading.path,
    external: false
  };
  const post = route.match(/^community\/postDetail\?id=([1-9]\d*)(?:&|$)/);
  if (post) return {
    href: `/community/post/${Number(post[1])}`,
    external: false
  };
  if (route === 'community/activityMessages') return {
    href: '/read/activities',
    external: false
  };
  const social = Object(_social_links__WEBPACK_IMPORTED_MODULE_0__[/* socialMessageTarget */ "a"])(route);
  if (social && !social.mobile) return {
    href: social.path,
    external: false
  };
  return safeLink(`/pages/${route}`, mobileBase);
}
function activityMessagePage(result, page, amount = 20, mobileBase = 'https://m.loghome.ink') {
  if (!result || result.msg !== 'ok' || result.page !== page || result.amount !== amount || !Number.isSafeInteger(result.total) || result.total < 0 || !Array.isArray(result.messages) || result.messages.length > amount) throw Error('活动消息返回数据无效，请刷新重试');
  const seen = new Set();
  const messages = result.messages.map(row => {
    const id = Number(row && row.message_id);
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id) || row.message_type !== 'activity') throw Error('活动消息返回数据无效，请刷新重试');
    seen.add(id);
    return {
      ...row,
      message_id: id,
      message_content: String(row.message_content || ''),
      bg_url: /^https?:\/\//i.test(String(row.bg_url || '')) ? row.bg_url : '',
      link: activityMessageLink(row.router, mobileBase)
    };
  });
  return {
    total: result.total,
    messages
  };
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URL"]))

/***/ }),

/***/ 209:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(248);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("6acf16a5", content, true, context)
};

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

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_346ec8a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(209);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_346ec8a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_346ec8a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_346ec8a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderActivityInbox_vue_vue_type_style_index_0_id_346ec8a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 248:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.activity-inbox[data-v-346ec8a2] {\r\n  max-width: 1180px;\r\n  margin: auto;\r\n  padding: 110px 28px 65px;\r\n  color: #514739;\n}\nheader[data-v-346ec8a2] {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 20px;\r\n  margin-bottom: 30px;\n}\nh1[data-v-346ec8a2] {\r\n  font-size: 28px;\r\n  margin: 18px 0 12px;\n}\nheader p[data-v-346ec8a2],\r\n.summary[data-v-346ec8a2],\r\n.quiet[data-v-346ec8a2] {\r\n  color: #968978;\r\n  font-size: 13px;\r\n  line-height: 1.8;\n}\na[data-v-346ec8a2] {\r\n  color: #788858;\r\n  text-decoration: none;\n}\nbutton[data-v-346ec8a2] {\r\n  background: white;\r\n  border: 1px solid #dcd7cc;\r\n  color: #7c674d;\r\n  border-radius: 6px;\r\n  padding: 9px 16px;\r\n  cursor: pointer;\n}\nbutton[data-v-346ec8a2]:disabled {\r\n  opacity: 0.45;\r\n  cursor: default;\n}\n.message-grid[data-v-346ec8a2] {\r\n  display: grid;\r\n  grid-template-columns: repeat(2, minmax(0, 1fr));\r\n  gap: 20px;\r\n  align-items: start;\n}\n.message-grid article[data-v-346ec8a2] {\r\n  min-width: 0;\r\n  background: white;\r\n  border: 1px solid #e7e2d9;\r\n  border-radius: 12px;\r\n  overflow: hidden;\n}\n.message-grid img[data-v-346ec8a2] {\r\n  width: 100%;\r\n  max-height: 220px;\r\n  object-fit: cover;\n}\n.message-body[data-v-346ec8a2] {\r\n  padding: 22px;\n}\ntime[data-v-346ec8a2] {\r\n  font-size: 12px;\r\n  color: #a09383;\n}\n.message-body p[data-v-346ec8a2] {\r\n  font-size: 15px;\r\n  line-height: 1.9;\r\n  white-space: pre-wrap;\r\n  overflow-wrap: anywhere;\r\n  margin: 16px 0;\n}\n.message-body a[data-v-346ec8a2] {\r\n  font-size: 13px;\n}\n.state[data-v-346ec8a2] {\r\n  text-align: center;\r\n  background: #fff;\r\n  padding: 55px 20px;\r\n  border: 1px solid #e7e2d9;\r\n  border-radius: 10px;\r\n  color: #998978;\r\n  font-size: 14px;\n}\n.state h2[data-v-346ec8a2] {\r\n  color: #615442;\r\n  font-size: 20px;\n}\n.state p[data-v-346ec8a2] {\r\n  line-height: 1.8;\r\n  margin: 16px 0;\n}\n.error[data-v-346ec8a2] {\r\n  color: #a14b39;\r\n  font-size: 13px;\r\n  background: #fff5ed;\r\n  padding: 16px;\r\n  border-radius: 7px;\n}\n.error button[data-v-346ec8a2] {\r\n  margin-left: 12px;\n}\nnav[data-v-346ec8a2] {\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  gap: 20px;\r\n  margin-top: 30px;\r\n  font-size: 13px;\n}\na[data-v-346ec8a2]:focus-visible,\r\nbutton[data-v-346ec8a2]:focus-visible {\r\n  outline: 2px solid #8e9e69;\r\n  outline-offset: 3px;\n}\n@media (max-width: 760px) {\n.activity-inbox[data-v-346ec8a2] {\r\n    padding: 100px 18px 45px;\n}\n.message-grid[data-v-346ec8a2] {\r\n    grid-template-columns: 1fr;\n}\nheader[data-v-346ec8a2] {\r\n    align-items: flex-start;\n}\nh1[data-v-346ec8a2] {\r\n    font-size: 25px;\n}\n.message-body[data-v-346ec8a2] {\r\n    padding: 18px;\n}\n}\n.activity-inbox.embedded[data-v-346ec8a2] {\r\n  padding: 0;\r\n  max-width: none;\r\n  color: var(--ink, #52483c);\n}\n.embedded .message-grid[data-v-346ec8a2] {\r\n  grid-template-columns: 1fr;\n}\n.embedded .message-grid article[data-v-346ec8a2] {\r\n  background: var(--surface, #fffdf9);\r\n  border-color: var(--line, #e9e0d5);\n}\n.embedded .message-grid p[data-v-346ec8a2] {\r\n  color: var(--ink, #52483c);\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderActivityInbox.vue?vue&type=template&id=346ec8a2&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "activity-inbox",
    class: {
      embedded: _vm.embedded
    }
  }, [!_vm.embedded ? _vm._ssrNode("<header data-v-346ec8a2>", "</header>", [_vm._ssrNode("<div data-v-346ec8a2>", "</div>", [_c('nuxt-link', {
    attrs: {
      "to": "/read/resources"
    }
  }, [_vm._v(_vm._s(_vm.$t("← 获取原木")))]), _vm._ssrNode(" <h1 data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.$t("活动消息"))) + "</h1> <p data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.$t("社区活动的参与条件、截止时间与奖励说明。"))) + "</p>")], 2), _vm._ssrNode(" " + (_vm.token && !_vm.authExpired ? "<button" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-346ec8a2>" + _vm._ssrEscape("\n      " + _vm._s(_vm.loading ? _vm.$t("刷新中…") : _vm.$t("刷新消息")) + "\n    ") + "</button>" : "<!---->"))], 2) : _vm._e(), _vm._ssrNode(" "), !_vm.ready ? _vm._ssrNode("<div class=\"state\" data-v-346ec8a2>", "</div>", [_vm._ssrNode(_vm._ssrEscape(_vm._s(_vm.$t("正在准备消息列表…"))))], 2) : !_vm.token || _vm.authExpired ? _vm._ssrNode("<div class=\"state\" data-v-346ec8a2>", "</div>", [_vm._ssrNode("<h2 data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.authExpired ? _vm.$t("登录状态已过期") : _vm.$t("登录后查看活动消息"))) + "</h2> <p data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.$t("活动消息与账号关联，登录后可查看收到的通知。"))) + "</p> "), _c('nuxt-link', {
    attrs: {
      "to": _vm.loginUrl
    }
  }, [_vm._v(_vm._s(_vm.$t("前往登录 →")))])], 2) : [_vm._ssrNode((_vm.error ? "<p role=\"alert\" class=\"error\" data-v-346ec8a2>" + _vm._ssrEscape("\n      " + _vm._s(_vm.error) + "\n      ") + "<button" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.$t("重试"))) + "</button></p>" : "<!---->") + " <p aria-live=\"polite\" class=\"summary\" data-v-346ec8a2>" + _vm._ssrEscape("\n      " + _vm._s(_vm.loading ? _vm.$t("正在读取活动消息…") : _vm.$t("共 {p0} 条活动消息 · 最新消息在前", {
    p0: _vm.total
  })) + "\n    ") + "</p> "), _vm._ssrNode("<div" + _vm._ssrAttr("aria-busy", _vm.loading) + " class=\"message-grid\" data-v-346ec8a2>", "</div>", _vm._l(_vm.messages, function (item) {
    return _vm._ssrNode("<article data-v-346ec8a2>", "</article>", [_vm._ssrNode((item.bg_url ? "<img" + _vm._ssrAttr("src", item.bg_url) + " alt loading=\"lazy\" data-v-346ec8a2>" : "<!---->") + " "), _vm._ssrNode("<div class=\"message-body\" data-v-346ec8a2>", "</div>", [_vm._ssrNode("<time" + _vm._ssrAttr("datetime", item.time) + " data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.date(item.time))) + "</time> <p data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(item.message_content)) + "</p> "), item.link && !item.link.external ? _c('nuxt-link', {
      attrs: {
        "to": item.link.href
      }
    }, [_vm._v(_vm._s(_vm.$t("查看活动详情 →")))]) : item.link ? _c('a', {
      attrs: {
        "href": item.link.href,
        "target": "_blank",
        "rel": "noopener noreferrer"
      }
    }, [_vm._v(_vm._s(_vm.$t("查看活动详情 ↗")))]) : _c('span', {
      staticClass: "quiet"
    }, [_vm._v(_vm._s(_vm.$t("这条通知暂无详情链接")))])], 2)], 2);
  }), 0), _vm._ssrNode(" " + (!_vm.loading && !_vm.error && !_vm.messages.length ? "<p class=\"state\" data-v-346ec8a2>" + _vm._ssrEscape("\n      " + _vm._s(_vm.$t("暂无活动消息")) + "\n    ") + "</p>" : "<!---->") + " " + (_vm.totalPages > 1 ? "<nav" + _vm._ssrAttr("aria-label", _vm.$t('活动消息分页')) + " data-v-346ec8a2><button" + _vm._ssrAttr("disabled", _vm.loading || _vm.page <= 1) + " data-v-346ec8a2>" + _vm._ssrEscape("\n        " + _vm._s(_vm.$t("上一页"))) + "</button><span data-v-346ec8a2>" + _vm._ssrEscape(_vm._s(_vm.$t("第 {p0} / {p1} 页", {
    p0: _vm.page,
    p1: _vm.totalPages
  }))) + "</span><button" + _vm._ssrAttr("disabled", _vm.loading || _vm.page >= _vm.totalPages) + " data-v-346ec8a2>" + _vm._ssrEscape("\n        " + _vm._s(_vm.$t("下一页")) + "\n      ") + "</button></nav>" : "<!---->"))]], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderActivityInbox.vue?vue&type=template&id=346ec8a2&scoped=true

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reader-activities.js
var reader_activities = __webpack_require__(208);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderActivityInbox.vue?vue&type=script&lang=js


/* harmony default export */ var ReaderActivityInboxvue_type_script_lang_js = ({
  props: {
    embedded: Boolean
  },
  data: () => ({
    ready: false,
    token: null,
    authExpired: false,
    messages: [],
    page: 1,
    total: 0,
    loading: false,
    error: "",
    failedPage: 1,
    version: 0,
    epoch: 0
  }),
  computed: {
    loginUrl() {
      return {
        path: "/login",
        query: {
          redirect: this.embedded ? "/me/messages?tab=activity" : "/read/activities"
        }
      };
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.total / 20));
    }
  },
  mounted() {
    this.ready = true;
    this.checkAccount();
    window.addEventListener("storage", this.storage);
    window.addEventListener("focus", this.checkAccount);
    window.addEventListener("auth-state-changed", this.checkAccount);
  },
  beforeDestroy() {
    this.version++;
    this.epoch++;
    window.removeEventListener("storage", this.storage);
    window.removeEventListener("focus", this.checkAccount);
    window.removeEventListener("auth-state-changed", this.checkAccount);
  },
  methods: {
    storage(event) {
      if (event.key === "token") this.checkAccount();
    },
    checkAccount() {
      const token = Object(reading["c" /* readingToken */])();
      if (token === this.token) return;
      this.epoch++;
      this.version++;
      Object.assign(this, {
        token,
        authExpired: false,
        messages: [],
        page: 1,
        total: 0,
        loading: false,
        error: "",
        failedPage: 1
      });
      if (token) this.load(1);
    },
    current(token, epoch, version) {
      return token === Object(reading["c" /* readingToken */])() && token === this.token && epoch === this.epoch && version === this.version;
    },
    async load(page = 1) {
      if (!this.token || this.authExpired) return;
      const token = this.token,
        epoch = this.epoch,
        version = ++this.version;
      this.loading = true;
      this.error = "";
      this.failedPage = page;
      try {
        const raw = await this.$api.reader.activityMessages(page);
        if (!this.current(token, epoch, version)) return;
        const result = Object(reader_activities["a" /* activityMessagePage */])(raw, page, 20, "https://m.loghome.ink");
        if (page > 1 && !result.messages.length) return this.load(1);
        this.messages = result.messages;
        this.total = result.total;
        this.page = page;
      } catch (error) {
        if (!this.current(token, epoch, version)) return;
        this.error = error.message || "活动消息加载失败";
        if ([401, 403].includes(error.status)) {
          this.authExpired = true;
          this.messages = [];
          this.total = 0;
        }
      } finally {
        if (this.current(token, epoch, version)) this.loading = false;
      }
    },
    date(value) {
      const date = new Date(value);
      return Number.isFinite(date.getTime()) ? date.toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
        hour12: false
      }) : "时间未提供";
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderActivityInbox.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderActivityInboxvue_type_script_lang_js = (ReaderActivityInboxvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderActivityInbox.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(247)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderActivityInboxvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "346ec8a2",
  "47f196b4"
  
)

/* harmony default export */ var ReaderActivityInbox = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 323:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(435);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("347d562a", content, true, context)
};

/***/ }),

/***/ 434:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_719099ef_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(323);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_719099ef_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_719099ef_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_719099ef_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_719099ef_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 435:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.message-layout[data-v-719099ef] {\r\n  display: grid;\r\n  grid-template-columns: 170px minmax(0, 1fr);\r\n  gap: 18px;\n}\n.message-categories[data-v-719099ef] {\r\n  align-self: start;\r\n  padding: 10px;\n}\n.message-categories button[data-v-719099ef] {\r\n  width: 100%;\r\n  display: flex;\r\n  gap: 10px;\r\n  align-items: center;\r\n  border: 0;\r\n  background: none;\r\n  padding: 15px 12px;\r\n  color: var(--muted, #82766c);\r\n  cursor: pointer;\r\n  border-radius: 9px;\r\n  text-align: left;\n}\n.message-categories button.active[data-v-719099ef] {\r\n  background: #f0e5d7;\r\n  color: #704c35;\r\n  font-weight: 600;\n}\n.message-categories em[data-v-719099ef] {\r\n  margin-left: auto;\r\n  background: #ea7034;\r\n  border-radius: 9px;\r\n  padding: 1px 5px;\r\n  color: white;\r\n  font-size: 11px;\r\n  font-style: normal;\n}\n.message-content-panel[data-v-719099ef] {\r\n  min-height: 500px;\n}\n.message-meta[data-v-719099ef] {\r\n  text-align: right;\r\n  font-size: 11px;\r\n  color: #978a7c;\n}\n.message-meta .el-badge[data-v-719099ef] {\r\n  display: block;\r\n  margin-top: 12px;\n}\n.message-row-heading[data-v-719099ef] {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 12px;\n}\n.message-row-heading time[data-v-719099ef] {\r\n  font-size: 11px;\r\n  color: #978a7c;\n}\n.message-target[data-v-719099ef] {\r\n  text-align: left;\r\n  border: 0;\r\n  background: none;\r\n  padding: 8px 0;\r\n  color: var(--muted, #766858);\r\n  font-size: 14px;\r\n  line-height: 1.8;\r\n  cursor: pointer;\r\n  overflow-wrap: anywhere;\r\n  white-space: pre-line;\r\n  width: 100%;\n}\n.message-archive-tabs[data-v-719099ef] {\r\n  margin: 0;\n}\n.message-archive-tabs button[data-v-719099ef] {\r\n  font-size: 12px;\r\n  padding: 8px;\n}\n.social-toolbar h2[data-v-719099ef] {\r\n  margin: 0;\n}\n.group-history[data-v-719099ef] {\r\n  margin-left: 60px;\r\n  padding: 8px;\r\n  background: #f8f2ea;\r\n  border-radius: 8px;\n}\n.group-history button[data-v-719099ef] {\r\n  display: block;\r\n  background: none;\r\n  border: 0;\r\n  text-align: left;\r\n  padding: 10px;\r\n  color: var(--muted, #82766c);\r\n  cursor: pointer;\n}\n@media (max-width: 1100px) {\n.message-layout[data-v-719099ef] {\r\n    grid-template-columns: 1fr;\n}\n.message-categories[data-v-719099ef] {\r\n    display: flex;\r\n    flex-wrap: wrap;\n}\n.message-categories button[data-v-719099ef] {\r\n    width: auto;\n}\n.message-categories em[data-v-719099ef] {\r\n    margin-left: 0;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 587:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/messages.vue?vue&type=template&id=719099ef&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('Workspace', {
    attrs: {
      "title": _vm.$t('消息中心'),
      "active": "/me/messages"
    },
    scopedSlots: _vm._u([{
      key: "actions",
      fn: function () {
        return [_vm.tab === 'private' ? _c('nuxt-link', {
          attrs: {
            "to": "/community/mail/new"
          }
        }, [_c('el-button', {
          attrs: {
            "icon": "el-icon-edit"
          }
        }, [_vm._v(_vm._s(_vm.$t("写信")))])], 1) : _vm._e(), _c('el-button', {
          attrs: {
            "icon": "el-icon-refresh",
            "loading": _vm.loading
          },
          on: {
            "click": _vm.refresh
          }
        }, [_vm._v(_vm._s(_vm.$t("刷新消息")))])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c('div', {
    staticClass: "message-layout"
  }, [_c('nav', {
    staticClass: "social-panel message-categories",
    attrs: {
      "aria-label": _vm.$t('消息分类')
    }
  }, _vm._l(_vm.categories, function (item) {
    return _c('button', {
      key: item.value,
      class: {
        active: _vm.tab === item.value
      },
      attrs: {
        "aria-pressed": _vm.tab === item.value
      },
      on: {
        "click": function ($event) {
          return _vm.selectTab(item.value);
        }
      }
    }, [_c('i', {
      class: item.icon
    }), _c('span', [_vm._v(_vm._s(_vm.$t(item.label)))]), _vm.count(item.value) ? _c('em', [_vm._v(_vm._s(_vm.count(item.value) > 99 ? "99+" : _vm.count(item.value)))]) : _vm._e()]);
  }), 0), _vm._v(" "), _c('section', {
    staticClass: "social-panel message-content-panel"
  }, [_c('div', {
    staticClass: "social-toolbar"
  }, [_c('h2', [_vm._v(_vm._s(_vm.$t(_vm.currentLabel)))]), _vm._v(" "), _vm.tab === 'notification' ? _c('div', {
    staticClass: "social-tabs message-archive-tabs"
  }, [_c('button', {
    class: {
      active: !_vm.history
    },
    on: {
      "click": function ($event) {
        _vm.history = false;
      }
    }
  }, [_vm._v("\n            " + _vm._s(_vm.$t("当前消息")))]), _c('button', {
    class: {
      active: _vm.history
    },
    on: {
      "click": function ($event) {
        _vm.history = true;
      }
    }
  }, [_vm._v("\n            " + _vm._s(_vm.$t("历史消息")) + "\n          ")])]) : _vm._e()]), _vm._v(" "), _vm.error ? _c('div', {
    staticClass: "social-state",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v("\n        " + _vm._s(_vm.error)), _c('br'), _c('el-button', {
    on: {
      "click": _vm.refresh
    }
  }, [_vm._v(_vm._s(_vm.$t("重新加载")))])], 1) : _vm._e(), _vm._v(" "), _vm.loading ? _c('el-skeleton', {
    attrs: {
      "rows": 6,
      "animated": ""
    }
  }) : _vm.tab === 'private' ? [_vm._l(_vm.conversations, function (item) {
    return _c('nuxt-link', {
      key: item.user_id,
      staticClass: "social-list-row",
      attrs: {
        "to": `/community/chat?id=${item.user_id}`
      }
    }, [_c('img', {
      attrs: {
        "src": item.avatar_url || '/default-avatar.png',
        "alt": ""
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "row-main"
    }, [_c('strong', [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('p', [_vm._v("\n              " + _vm._s(_vm.preview(item.last_message_content) || _vm.$t("开始与对方聊天吧")) + "\n            ")])]), _vm._v(" "), _c('div', {
      staticClass: "message-meta"
    }, [_c('time', [_vm._v(_vm._s(_vm.formatTime(item.last_message_time)))]), item.unread_count ? _c('el-badge', {
      attrs: {
        "value": item.unread_count,
        "max": 99
      }
    }) : _vm._e()], 1)]);
  }), _vm._v(" "), !_vm.conversations.length && !_vm.error ? _c('div', {
    staticClass: "social-state"
  }, [_c('i', {
    staticClass: "el-icon-chat-dot-round"
  }), _vm._v(_vm._s(_vm.$t("暂无私信"))), _c('br'), _c('nuxt-link', {
    attrs: {
      "to": "/me/friends"
    }
  }, [_vm._v(_vm._s(_vm.$t("找到好友，开始交流")))])], 1) : _vm._e()] : _vm.tab === 'activity' ? _c('ReaderActivityInbox', {
    ref: "activityInbox",
    attrs: {
      "embedded": ""
    }
  }) : [_vm._l(_vm.groups, function (group) {
    return _c('article', {
      key: group.key,
      staticClass: "message-group"
    }, [_c('div', {
      staticClass: "social-list-row"
    }, [_c('nuxt-link', {
      attrs: {
        "to": `/users/${group.items[0].from_id}`
      }
    }, [_c('img', {
      attrs: {
        "src": group.items[0].avatar_url || '/default-avatar.png',
        "alt": ""
      }
    })]), _vm._v(" "), _c('div', {
      staticClass: "row-main"
    }, [_c('div', {
      staticClass: "message-row-heading"
    }, [_c('strong', [_vm._v(_vm._s(group.items[0].name))]), _c('time', [_vm._v(_vm._s(_vm.formatTime(group.items[0].time)))])]), _vm._v(" "), _c('button', {
      staticClass: "message-target",
      on: {
        "click": function ($event) {
          return _vm.openMessage(group.items[0]);
        }
      }
    }, [_vm._v("\n                " + _vm._s(group.items[0].message_content))]), group.items.length > 1 ? _c('el-button', {
      attrs: {
        "type": "text",
        "size": "small"
      },
      on: {
        "click": function ($event) {
          return _vm.$set(_vm.expanded, group.key, !_vm.expanded[group.key]);
        }
      }
    }, [_vm._v(_vm._s(_vm.expanded[group.key] ? _vm.$t("收起") : _vm.$t("查看 {p0} 条相同消息", {
      p0: group.items.length
    })))]) : _vm._e()], 1), _vm._v(" "), _vm.tab === 'notification' && !_vm.history ? _c('el-button', {
      attrs: {
        "type": "text",
        "disabled": _vm.archiving
      },
      on: {
        "click": function ($event) {
          return _vm.archive(group);
        }
      }
    }, [_vm._v(_vm._s(_vm.$t("归档")))]) : _vm._e()], 1), _vm._v(" "), _vm.expanded[group.key] ? _c('div', {
      staticClass: "group-history"
    }, _vm._l(group.items.slice(1), function (item) {
      return _c('button', {
        key: item.message_id,
        on: {
          "click": function ($event) {
            return _vm.openMessage(item);
          }
        }
      }, [_vm._v("\n              " + _vm._s(_vm.formatTime(item.time)) + " · " + _vm._s(item.message_content) + "\n            ")]);
    }), 0) : _vm._e()]);
  }), _vm._v(" "), !_vm.groups.length && !_vm.error ? _c('div', {
    staticClass: "social-state"
  }, [_c('i', {
    staticClass: "el-icon-bell"
  }), _vm._v(_vm._s(_vm.$t("暂无{p0}", {
    p0: _vm.$t(_vm.currentLabel)
  })) + "\n        ")]) : _vm._e()]], 2)])]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/me/messages.vue?vue&type=template&id=719099ef&scoped=true

// EXTERNAL MODULE: ./components/read/ReaderActivityInbox.vue + 4 modules
var ReaderActivityInbox = __webpack_require__(289);

// EXTERNAL MODULE: ./components/social/Workspace.vue + 5 modules
var Workspace = __webpack_require__(149);

// EXTERNAL MODULE: ./plugins/api/social.js
var social = __webpack_require__(26);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/social.js
var utils_social = __webpack_require__(170);

// EXTERNAL MODULE: ./utils/private-message.js
var private_message = __webpack_require__(244);

// EXTERNAL MODULE: ./utils/social-links.js
var social_links = __webpack_require__(44);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/messages.vue?vue&type=script&lang=js







/* harmony default export */ var messagesvue_type_script_lang_js = ({
  components: {
    Workspace: Workspace["a" /* default */],
    ReaderActivityInbox: ReaderActivityInbox["a" /* default */]
  },
  data: () => ({
    tab: "comment",
    history: false,
    messages: [],
    conversations: [],
    loading: false,
    error: "",
    archiving: false,
    expanded: {},
    categories: [{
      value: "comment",
      label: "评论与回复",
      icon: "el-icon-chat-dot-round"
    }, {
      value: "followed",
      label: "新增关注",
      icon: "el-icon-user"
    }, {
      value: "like_collect",
      label: "赞与收藏",
      icon: "el-icon-star-off"
    }, {
      value: "private",
      label: "私信",
      icon: "el-icon-message"
    }, {
      value: "notification",
      label: "系统通知",
      icon: "el-icon-bell"
    }, {
      value: "activity",
      label: "活动消息",
      icon: "el-icon-date"
    }]
  }),
  computed: {
    currentLabel() {
      return (this.categories.find(item => item.value === this.tab) || {}).label;
    },
    groups() {
      return Object(utils_social["d" /* notificationGroups */])(this.messages.filter(item => item.message_type === this.tab || this.tab === "notification" && !item.message_type), this.tab === "notification" && this.history);
    }
  },
  mounted() {
    if (!Object(reading["c" /* readingToken */])()) {
      this.$router.replace({
        path: "/login",
        query: {
          redirect: this.$route.fullPath
        }
      });
      return;
    }
    if (this.categories.some(item => item.value === this.$route.query.tab)) this.tab = this.$route.query.tab;
    this.refresh();
  },
  watch: {
    "$route.query.tab"(tab) {
      if (this.categories.some(item => item.value === tab)) {
        this.tab = tab;
        this.markSeen();
      }
    }
  },
  methods: {
    markSeen() {
      this.messages.forEach(item => {
        if (item.message_type === this.tab && Number(item.is_read) === 0) this.$set(item, "is_read", 1);
      });
    },
    preview: private_message["a" /* formatMessagePreview */],
    selectTab(tab) {
      this.tab = tab;
      this.markSeen();
      this.history = false;
      this.$router.replace({
        query: {
          tab
        }
      }).catch(() => {});
    },
    count(type) {
      if (type === "private") return this.conversations.reduce((sum, item) => sum + Number(item.unread_count || 0), 0);
      return this.messages.filter(item => item.message_type === type && Number(item.is_read) === 0).length;
    },
    async refresh() {
      if (this.loading) return;
      if (this.tab === "activity" && this.$refs.activityInbox) {
        this.$refs.activityInbox.load(this.$refs.activityInbox.page);
        return;
      }
      this.loading = true;
      this.error = "";
      try {
        await social["a" /* default */].deduplicateMessages().catch(() => {});
        const results = await Promise.allSettled([social["a" /* default */].messages(), social["a" /* default */].conversations()]);
        const failures = [];
        if (results[0].status === "fulfilled") this.messages = Array.isArray(results[0].value) ? results[0].value : [];else failures.push(results[0].reason.message);
        if (results[1].status === "fulfilled") this.conversations = results[1].value.data || [];else failures.push(results[1].reason.message);
        this.error = failures.join("；");
      } finally {
        this.markSeen();
        this.loading = false;
      }
    },
    async archive(group) {
      if (this.archiving) return;
      this.archiving = true;
      try {
        for (const item of group.items) {
          await social["a" /* default */].archive(item.message_id);
          this.$set(item, "is_read", 2);
        }
        this.$message.success(this.$t("已移入历史消息"));
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.archiving = false;
      }
    },
    formatTime(value) {
      const timestamp = Object(utils_social["b" /* messageTime */])(value);
      return timestamp ? new Date(timestamp).toLocaleString(this.$language.state.locale, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }) : "";
    },
    openMessage(item) {
      const target = Object(social_links["a" /* socialMessageTarget */])(item.router);
      if (!target) return;
      if (target.mobile) this.$openMobileWindow(target.path, {
        title: "消息详情"
      });else this.$router.push(target.path);
    }
  },
  head: () => ({
    title: "消息中心 - 原木社区"
  })
});
// CONCATENATED MODULE: ./pages/me/messages.vue?vue&type=script&lang=js
 /* harmony default export */ var me_messagesvue_type_script_lang_js = (messagesvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/me/messages.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(434)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  me_messagesvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "719099ef",
  "077768ca"
  
)

/* harmony default export */ var messages = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=messages.js.map