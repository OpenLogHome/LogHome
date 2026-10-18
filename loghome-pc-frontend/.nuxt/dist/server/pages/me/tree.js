exports.ids = [35];
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

/***/ 155:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

/* harmony default export */ __webpack_exports__["a"] = ({
  mounted() {
    this.accountToken = Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])();
    this.accountChanged = () => {
      if (Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])() !== this.accountToken) {
        this.accountToken = Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])();
        this.$router.replace({
          path: "/login",
          query: {
            redirect: this.$route.fullPath
          }
        });
      }
    };
    window.addEventListener("storage", this.accountChanged);
    window.addEventListener("auth-state-changed", this.accountChanged);
    window.addEventListener("focus", this.accountChanged);
    if (this.$options.requiresAuth !== false && !Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])()) {
      this.$router.replace({
        path: "/login",
        query: {
          redirect: this.$route.fullPath
        }
      });
      return;
    }
    this.load();
  },
  beforeDestroy() {
    window.removeEventListener("storage", this.accountChanged);
    window.removeEventListener("auth-state-changed", this.accountChanged);
    window.removeEventListener("focus", this.accountChanged);
  },
  methods: {
    async confirmAction(content, title) {
      const token = Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])();
      try {
        await this.$confirm(content, title, {
          confirmButtonText: this.$t("确认"),
          cancelButtonText: this.$t("取消")
        });
        if (!token || Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])() !== token) {
          this.$message.info(this.$t("账号已切换，请刷新后重试"));
          return false;
        }
        return true;
      } catch (_) {
        return false;
      }
    },
    accountDate(value) {
      return value ? new Date(value).toLocaleString(this.$language ? this.$language.state.locale : "zh-CN") : this.$t("暂无");
    }
  }
});

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

/***/ 210:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(250);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("96b213fe", content, true, context)
};

/***/ }),

/***/ 249:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderRewards_vue_vue_type_style_index_0_id_173ef78a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(210);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderRewards_vue_vue_type_style_index_0_id_173ef78a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderRewards_vue_vue_type_style_index_0_id_173ef78a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderRewards_vue_vue_type_style_index_0_id_173ef78a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderRewards_vue_vue_type_style_index_0_id_173ef78a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 250:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-rewards[data-v-173ef78a] {\r\n  max-width: 1180px;\r\n  margin: 0 auto;\r\n  padding: 112px 28px 65px;\r\n  color: #52483c;\r\n  font-size: 14px;\n}\n.rewards-heading[data-v-173ef78a] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  gap: 22px;\r\n  margin-bottom: 26px;\n}\n.rewards-heading h1[data-v-173ef78a] {\r\n  font-size: 28px;\r\n  margin: 15px 0 10px;\n}\n.rewards-heading p[data-v-173ef78a],\r\n.quiet[data-v-173ef78a] {\r\n  font-size: 13px;\r\n  color: #998c7a;\r\n  line-height: 1.8;\n}\n.rewards-heading > div[data-v-173ef78a]:last-child {\r\n  display: flex;\r\n  gap: 18px;\r\n  align-items: center;\n}\na[data-v-173ef78a] {\r\n  color: #829355;\r\n  text-decoration: none;\n}\nbutton[data-v-173ef78a],\r\nselect[data-v-173ef78a] {\r\n  font: inherit;\r\n  border: 1px solid #e0d8cb;\r\n  border-radius: 7px;\r\n  background: white;\r\n  color: #8a7254;\r\n  padding: 8px 13px;\r\n  cursor: pointer;\n}\nbutton[data-v-173ef78a]:disabled,\r\nselect[data-v-173ef78a]:disabled {\r\n  opacity: 0.5;\r\n  cursor: default;\n}\nbutton[data-v-173ef78a]:focus-visible,\r\nselect[data-v-173ef78a]:focus-visible,\r\na[data-v-173ef78a]:focus-visible {\r\n  outline: 2px solid #8da35e;\r\n  outline-offset: 3px;\n}\n.rewards-gate[data-v-173ef78a] {\r\n  padding: 36px;\r\n  background: white;\r\n  border: 1px solid #e5e3dc;\r\n  border-radius: 13px;\r\n  line-height: 1.9;\n}\n.rewards-layout[data-v-173ef78a] {\r\n  display: grid;\r\n  grid-template-columns: 320px minmax(0, 1fr);\r\n  gap: 22px;\n}\n.tree-card[data-v-173ef78a],\r\n.rewards-panel[data-v-173ef78a] {\r\n  border: 1px solid #e5e5da;\r\n  background: white;\r\n  border-radius: 13px;\r\n  padding: 24px;\r\n  min-width: 0;\n}\n.tree-card[data-v-173ef78a] {\r\n  align-self: start;\r\n  position: sticky;\r\n  top: 84px;\r\n  text-align: center;\n}\n.tree-card h2[data-v-173ef78a] {\r\n  font-size: 19px;\r\n  line-height: 1.6;\r\n  margin: 10px 0 22px;\n}\n.tree-label[data-v-173ef78a] {\r\n  font-size: 12px;\r\n  color: #a19279;\n}\n.growth-row[data-v-173ef78a] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  margin: 18px 0 10px;\r\n  font-size: 13px;\r\n  color: #968775;\n}\n.growth-row strong[data-v-173ef78a] {\r\n  font-variant-numeric: tabular-nums;\r\n  color: #7a8c50;\n}\nprogress[data-v-173ef78a] {\r\n  appearance: none;\r\n  height: 9px;\r\n  width: 100%;\r\n  border: 0;\r\n  border-radius: 5px;\r\n  overflow: hidden;\r\n  background: #eeeee4;\n}\nprogress[data-v-173ef78a]::-webkit-progress-bar {\r\n  background: #eeeee4;\n}\nprogress[data-v-173ef78a]::-webkit-progress-value {\r\n  background: #8ba158;\n}\nprogress[data-v-173ef78a]::-moz-progress-bar {\r\n  background: #8ba158;\n}\n.primary[data-v-173ef78a] {\r\n  width: 100%;\r\n  background: #879b59;\r\n  border-color: #879b59;\r\n  color: white;\r\n  margin: 14px 0;\r\n  padding: 12px;\n}\n.resource-balances[data-v-173ef78a] {\r\n  display: flex;\r\n  border-top: 1px solid #eee8dc;\r\n  margin: 23px 0 15px;\r\n  padding-top: 20px;\r\n  gap: 22px;\r\n  justify-content: center;\n}\n.resource-balances dt[data-v-173ef78a] {\r\n  font-size: 12px;\r\n  color: #a3947d;\r\n  margin-bottom: 8px;\n}\n.resource-balances dd[data-v-173ef78a] {\r\n  margin: 0;\r\n  font-size: 22px;\r\n  font-weight: 600;\r\n  color: #8e744f;\n}\n.tree-card > a[data-v-173ef78a] {\r\n  font-size: 12px;\n}\n.theme-label[data-v-173ef78a] {\r\n  display: grid;\r\n  text-align: left;\r\n  gap: 8px;\r\n  font-size: 12px;\r\n  color: #a1917a;\r\n  margin-top: 20px;\n}\n.theme-label select[data-v-173ef78a] {\r\n  width: 100%;\n}\n.rewards-panel[data-v-173ef78a] {\r\n  margin-bottom: 20px;\n}\n.rewards-panel > header[data-v-173ef78a] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  gap: 15px;\n}\n.rewards-panel h2[data-v-173ef78a] {\r\n  font-size: 17px;\r\n  margin: 0;\n}\n.rewards-panel header p[data-v-173ef78a] {\r\n  margin: 8px 0;\n}\n.orb-grid[data-v-173ef78a] {\r\n  display: grid;\r\n  grid-template-columns: repeat(5, minmax(0, 1fr));\r\n  gap: 10px;\r\n  margin-top: 15px;\n}\n.orb-grid button[data-v-173ef78a] {\r\n  display: flex;\r\n  align-items: center;\r\n  flex-direction: column;\r\n  gap: 6px;\r\n  background: #f8faef;\r\n  border-color: #e2e9cc;\r\n  padding: 12px 4px;\r\n  color: #819549;\n}\n.orb-grid small[data-v-173ef78a] {\r\n  font-size: 10px;\n}\n.orb-pixel[data-v-173ef78a] {\r\n  display: block;\r\n  width: 18px;\r\n  height: 18px;\r\n  box-shadow: 4px 0 #acc656, -4px 0 #acc656, 0 4px #acc656, 0 -4px #acc656;\r\n  background: #d6eb83;\r\n  margin: 5px;\n}\n.task-list article[data-v-173ef78a] {\r\n  display: grid;\r\n  grid-template-columns: minmax(0, 1fr) 75px 85px;\r\n  gap: 14px;\r\n  align-items: center;\r\n  padding: 18px 0;\r\n  border-bottom: 1px solid #eeeade;\n}\n.task-list article[data-v-173ef78a]:last-child {\r\n  border-bottom: 0;\n}\n.task-list h3[data-v-173ef78a] {\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  margin: 0 0 7px;\n}\n.task-list p[data-v-173ef78a] {\r\n  margin: 0;\r\n  font-size: 12px;\r\n  color: #a0927e;\r\n  line-height: 1.7;\n}\n.task-list small[data-v-173ef78a] {\r\n  display: block;\r\n  font-size: 11px;\r\n  color: #a59885;\r\n  margin-top: 7px;\n}\n.task-reward[data-v-173ef78a] {\r\n  font-size: 12px;\r\n  color: #8d9e60;\r\n  text-align: right;\n}\n.task-list a[data-v-173ef78a],\r\n.completed[data-v-173ef78a] {\r\n  font-size: 12px;\r\n  text-align: right;\n}\n.completed[data-v-173ef78a] {\r\n  color: #aaa28d;\n}\n.task-list button[data-v-173ef78a] {\r\n  font-size: 12px;\n}\n.error[data-v-173ef78a] {\r\n  font-size: 13px;\r\n  color: #b05d43;\r\n  line-height: 1.8;\n}\n.notice[data-v-173ef78a] {\r\n  padding: 12px 16px;\r\n  background: #edf3df;\r\n  border: 1px solid #dce6c5;\r\n  border-radius: 8px;\r\n  color: #7c8d51;\n}\n.rewards-footer[data-v-173ef78a] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  gap: 15px;\r\n  margin-top: 10px;\r\n  font-size: 13px;\n}\n.tree-pixel-art[data-v-173ef78a] {\r\n  width: 190px;\r\n  height: 175px;\r\n  position: relative;\r\n  margin: 0 auto 15px;\n}\n.pixel-ground[data-v-173ef78a] {\r\n  position: absolute;\r\n  bottom: 8px;\r\n  left: 12px;\r\n  width: 166px;\r\n  height: 18px;\r\n  background: #a8bb72;\r\n  box-shadow: 0 8px #b2946b;\n}\n.pixel-trunk[data-v-173ef78a] {\r\n  position: absolute;\r\n  bottom: 26px;\r\n  left: 83px;\r\n  width: 24px;\r\n  height: 71px;\r\n  background: #b08b5a;\r\n  box-shadow: inset -7px 0 #957044;\n}\n.pixel-leaves[data-v-173ef78a] {\r\n  position: absolute;\r\n  top: 10px;\r\n  left: 28px;\r\n  width: 134px;\r\n  height: 80px;\r\n  background: #a4b970;\r\n  box-shadow: inset -18px -15px #91a65f, 16px 20px #a4b970, -16px 20px #a4b970,\r\n    0 -8px #bacb8b;\n}\n.pixel-fruit[data-v-173ef78a] {\r\n  position: absolute;\r\n  left: 55px;\r\n  top: 60px;\r\n  width: 12px;\r\n  height: 12px;\r\n  background: #dda777;\r\n  box-shadow: 48px 18px #dda777, 76px -10px #dda777;\n}\n.tree-pixel-art.empty .pixel-trunk[data-v-173ef78a] {\r\n  height: 35px;\n}\n.tree-pixel-art.empty .pixel-leaves[data-v-173ef78a] {\r\n  transform: scale(0.4);\r\n  top: 60px;\n}\n.tree-pixel-art.mature .pixel-leaves[data-v-173ef78a] {\r\n  background: #8ca651;\r\n  box-shadow: inset -18px -15px #7f984c, 16px 20px #8ca651, -16px 20px #8ca651,\r\n    0 -8px #a5bb72;\n}\n@media (max-width: 1000px) {\n.rewards-layout[data-v-173ef78a] {\r\n    grid-template-columns: 280px minmax(0, 1fr);\n}\n.tree-card[data-v-173ef78a],\r\n  .rewards-panel[data-v-173ef78a] {\r\n    padding: 20px;\n}\n.orb-grid[data-v-173ef78a] {\r\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n}\n}\n@media (max-width: 800px) {\n.reader-rewards[data-v-173ef78a] {\r\n    padding: 100px 20px 50px;\n}\n.rewards-heading[data-v-173ef78a] {\r\n    align-items: flex-start;\r\n    flex-direction: column;\n}\n.rewards-layout[data-v-173ef78a] {\r\n    grid-template-columns: minmax(0, 1fr);\n}\n.tree-card[data-v-173ef78a] {\r\n    position: static;\n}\n.tree-pixel-art[data-v-173ef78a] {\r\n    height: 145px;\n}\n.tree-pixel-art .pixel-leaves[data-v-173ef78a] {\r\n    top: 0;\n}\n.orb-grid[data-v-173ef78a] {\r\n    grid-template-columns: repeat(5, minmax(0, 1fr));\n}\n}\n@media (max-width: 500px) {\n.reader-rewards[data-v-173ef78a] {\r\n    padding-left: 14px;\r\n    padding-right: 14px;\n}\n.task-list article[data-v-173ef78a] {\r\n    grid-template-columns: minmax(0, 1fr) 65px 65px;\r\n    gap: 8px;\n}\n.task-list button[data-v-173ef78a] {\r\n    padding: 8px;\n}\n.orb-grid[data-v-173ef78a] {\r\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n.rewards-footer[data-v-173ef78a] {\r\n    flex-direction: column;\n}\n}\n.reader-rewards.embedded[data-v-173ef78a] {\r\n  padding: 0;\r\n  max-width: none;\n}\n.embedded .rewards-layout[data-v-173ef78a] {\r\n  grid-template-columns: 1fr;\n}\n.embedded .tree-preview[data-v-173ef78a] {\r\n  display: none;\n}\n.embedded .tree-panel[data-v-173ef78a] {\r\n  padding: 22px;\n}\n.embedded .rewards-panel[data-v-173ef78a] {\r\n  border-radius: 14px;\n}\n.embedded .tasks-column[data-v-173ef78a] {\r\n  display: grid;\r\n  grid-template-columns: 1fr 1fr;\r\n  gap: 18px;\n}\n@media (max-width: 1100px) {\n.embedded .tasks-column[data-v-173ef78a] {\r\n    grid-template-columns: 1fr;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 251:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return isTreePlantLowPerformanceMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return setTreePlantLowPerformanceMode; });
/* unused harmony export isBrowserH5TreeSceneEnvironment */
/* unused harmony export canUseHighQualityTreeScene */
/* unused harmony export shouldUseTreePlant3DScene */
/* unused harmony export shouldUseVoxelTreeScene */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DEFAULT_TREE_PLANT_SCENE_THEME; });
/* unused harmony export TREE_PLANT_LOW_PERFORMANCE_KEY */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TREE_PLANT_SCENE_THEMES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return normalizeTreePlantSceneTheme; });
const TREE_PLANT_LOW_PERFORMANCE_KEY = 'loghomeTreePlantLowPerformance';
const DEFAULT_TREE_PLANT_SCENE_THEME = 'oak_island';
const TREE_PLANT_SCENE_THEMES = [{
  key: 'oak_island',
  label: '橡岛晴岚'
}, {
  key: 'birch_blossom',
  label: '白桦花涧'
}, {
  key: 'snow_spruce',
  label: '雪杉云境'
}, {
  key: 'sakura_grove',
  label: '樱庭春晓'
}, {
  key: 'savanna_acacia',
  label: '金合旷野'
}, {
  key: 'swamp_redwood',
  label: '红杉泽影'
}];
function normalizeBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    return value === '1' || value === 'true' || value === 'yes' || value === 'on';
  }
  return false;
}
function readStorageValue(key) {
  try {
    if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
      const value = uni.getStorageSync(key);
      if (value !== '' && value !== null && value !== undefined) return value;
    }
  } catch (e) {}
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {}
  return '';
}
function writeStorageValue(key, value) {
  const normalizedValue = value ? '1' : '0';
  try {
    if (typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function') {
      uni.setStorageSync(key, normalizedValue);
    }
  } catch (e) {}
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, normalizedValue);
    }
  } catch (e) {}
}
function normalizeTreePlantSceneTheme(value) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return TREE_PLANT_SCENE_THEMES.some(item => item.key === normalized) ? normalized : DEFAULT_TREE_PLANT_SCENE_THEME;
}
function isTreePlantLowPerformanceMode() {
  return normalizeBoolean(readStorageValue(TREE_PLANT_LOW_PERFORMANCE_KEY));
}
function setTreePlantLowPerformanceMode(enabled) {
  writeStorageValue(TREE_PLANT_LOW_PERFORMANCE_KEY, !!enabled);
}
function isBrowserH5TreeSceneEnvironment() {
  if (typeof window === 'undefined') return false;
  return true;
}
function canUseHighQualityTreeScene() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!(window.WebGLRenderingContext && gl);
  } catch (e) {
    return false;
  }
}
function shouldUseTreePlant3DScene() {
  return isBrowserH5TreeSceneEnvironment() && !isTreePlantLowPerformanceMode() && canUseHighQualityTreeScene();
}
const shouldUseVoxelTreeScene = shouldUseTreePlant3DScene;


/***/ }),

/***/ 282:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderRewards.vue?vue&type=template&id=173ef78a&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "reader-rewards",
    class: {
      embedded: _vm.embedded
    },
    attrs: {
      "aria-labelledby": "reader-rewards-title"
    }
  }, [!_vm.embedded ? _vm._ssrNode("<header class=\"rewards-heading\" data-v-173ef78a>", "</header>", [_vm._ssrNode("<div data-v-173ef78a>", "</div>", [_c('nuxt-link', {
    attrs: {
      "to": "/read"
    }
  }, [_vm._v(_vm._s(_vm.$t("← 返回书库")))]), _vm._ssrNode(" <h1 id=\"reader-rewards-title\" data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("阅读奖励与树场"))) + "</h1> <p data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("阅读、分享与交流，让你的树慢慢长大。"))) + "</p>")], 2), _vm._ssrNode(" "), _vm._ssrNode("<div data-v-173ef78a>", "</div>", [_c('nuxt-link', {
    attrs: {
      "to": "/read/resources"
    }
  }, [_vm._v(_vm._s(_vm.$t("如何获取原木")))]), _vm._ssrNode("<button" + _vm._ssrAttr("disabled", _vm.loading || !!_vm.busy) + " data-v-173ef78a>" + _vm._ssrEscape("\n        " + _vm._s(_vm.loading ? _vm.$t("刷新中…") : _vm.$t("刷新状态")) + "\n      ") + "</button>")], 2)], 2) : _vm._e(), _vm._ssrNode(" "), !_vm.ready ? _vm._ssrNode("<div class=\"rewards-gate\" data-v-173ef78a>", "</div>", [_vm._ssrNode(_vm._ssrEscape(_vm._s(_vm.$t("正在确认账户…"))))], 2) : !_vm.token || _vm.authExpired ? _vm._ssrNode("<div class=\"rewards-gate\" data-v-173ef78a>", "</div>", [_vm._ssrNode("<h2 data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.authExpired ? _vm.$t("登录已失效") : _vm.$t("登录后培育你的树木"))) + "</h2> <p data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("成长值、经验球、收获和余额由当前账号的树场记录决定。"))) + "</p> "), _c('nuxt-link', {
    attrs: {
      "to": _vm.loginUrl
    }
  }, [_vm._v(_vm._s(_vm.$t("登录后继续")))])], 2) : [_vm._ssrNode((_vm.error ? "<p role=\"alert\" class=\"error\" data-v-173ef78a>" + _vm._ssrEscape("\n      " + _vm._s(_vm.error) + "\n      ") + "<button" + _vm._ssrAttr("disabled", !!_vm.busy || _vm.loading) + " data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("刷新核对"))) + "</button></p>" : "<!---->") + " " + (_vm.balanceError ? "<p role=\"alert\" class=\"error\" data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.balanceError)) + "</p>" : "<!---->") + " " + (_vm.notice ? "<p role=\"status\" class=\"notice\" data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.notice)) + "</p>" : "<!---->") + " " + (_vm.uncertain ? "<p role=\"alert\" class=\"error\" data-v-173ef78a>" + _vm._ssrEscape("\n      " + _vm._s(_vm.$t("上次操作结果尚未确认，请先刷新树场和余额后再操作。")) + "\n    ") + "</p>" : "<!---->") + " "), _vm._ssrNode("<div class=\"rewards-layout\" data-v-173ef78a>", "</div>", [_vm._ssrNode("<aside" + _vm._ssrAttr("aria-label", _vm.$t('我的树木')) + " class=\"tree-card\" data-v-173ef78a>", "</aside>", [_vm.tree ? [_vm._ssrNode("<div aria-hidden=\"true\"" + _vm._ssrClass("tree-pixel-art", {
    mature: _vm.tree.status === '结果',
    empty: !_vm.tree.active
  }) + " data-v-173ef78a><div class=\"pixel-ground\" data-v-173ef78a></div> <div class=\"pixel-trunk\" data-v-173ef78a></div> <div class=\"pixel-leaves\" data-v-173ef78a></div> " + (_vm.tree.status === '结果' ? "<div class=\"pixel-fruit\" data-v-173ef78a></div>" : "<!---->") + "</div> <span class=\"tree-label\" data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.themeName)) + "</span> <h2 data-v-173ef78a>" + _vm._ssrEscape("\n            " + _vm._s(_vm.tree.status === "未种植" ? _vm.tree.id ? _vm.$t("继续种下下一棵树") : _vm.$t("种下你的第一份期待") : _vm.tree.status === "结果" ? _vm.$t("这棵树可以收获了") : _vm.tree.status === "开花" ? _vm.$t("树木正在开花") : _vm.$t("树苗正在生长")) + "\n          ") + "</h2> <div class=\"growth-row\" data-v-173ef78a><span data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("成长值"))) + "</span><strong data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.tree.growth) + " / " + _vm._s(_vm.tree.maximum)) + "</strong></div> <progress" + _vm._ssrAttr("max", _vm.tree.maximum) + _vm._ssrAttr("aria-label", _vm.$t('树木成长进度')) + _vm._ssrAttr("value", Math.min(_vm.tree.growth, _vm.tree.maximum)) + " data-v-173ef78a></progress> " + (_vm.tree.growth > _vm.tree.maximum ? "<p class=\"quiet\" data-v-173ef78a>" + _vm._ssrEscape("\n            " + _vm._s(_vm.$t("多出的 {p0} 成长值在下次种植时继续保留。", {
    p0: _vm.tree.growth - _vm.tree.maximum
  })) + "\n          ") + "</p>" : "<!---->") + " <p class=\"quiet\" data-v-173ef78a>" + _vm._ssrEscape("\n            " + _vm._s(_vm.tree.benefits.name)) + (_vm.tree.benefits.multiplier > 1 ? _vm._ssrEscape(_vm._s(_vm.$t("· 任务成长值 {p0} 倍加成", {
    p0: _vm.tree.benefits.multiplier
  }))) : "<!---->") + "</p> "), !_vm.tree.active ? [_vm._ssrNode("<label class=\"theme-label\" data-v-173ef78a>", "</label>", [_vm._ssrNode(_vm._ssrEscape(_vm._s(_vm.$t("树苗主题")))), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.theme,
      expression: "theme"
    }],
    attrs: {
      "disabled": !!_vm.busy
    },
    on: {
      "change": function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.theme = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }
    }
  }, _vm._l(_vm.themes, function (option) {
    return _c('option', {
      key: option.key,
      domProps: {
        "value": option.key
      }
    }, [_vm._v("\n                  " + _vm._s(option.name) + "\n                ")]);
  }), 0)], 2), _vm._ssrNode("<button" + _vm._ssrAttr("disabled", !!_vm.busy || _vm.loading || _vm.uncertain) + " class=\"primary\" data-v-173ef78a>" + _vm._ssrEscape("\n              " + _vm._s(_vm.busy === "plant" ? _vm.$t("种植中…") : _vm.$t("种下树苗")) + "\n            ") + "</button>")] : _vm.tree.status === '结果' ? _vm._ssrNode("<button" + _vm._ssrAttr("disabled", !!_vm.busy || _vm.loading || _vm.uncertain) + " class=\"primary\" data-v-173ef78a>" + _vm._ssrEscape("\n            " + _vm._s(_vm.busy === "harvest" ? _vm.$t("收获中…") : _vm.$t("收获原木与苹果")) + "\n          ") + "</button>") : _vm._ssrNode("<p class=\"quiet\" data-v-173ef78a>" + _vm._ssrEscape("\n            " + _vm._s(_vm.$t("完成任务、收集经验球，继续积累成长值。")) + "\n          ") + "</p>")] : _vm._ssrNode("<p class=\"quiet\" data-v-173ef78a>" + _vm._ssrEscape("\n          " + _vm._s(_vm.loading ? _vm.$t("正在读取树木信息…") : _vm.$t("树木信息暂不可用，请刷新重试。")) + "\n        ") + "</p>"), _vm._ssrNode(" <dl class=\"resource-balances\" data-v-173ef78a><div data-v-173ef78a><dt data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("我的原木"))) + "</dt> <dd data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.balances ? _vm.balances.log.toLocaleString() : "—")) + "</dd></div> <div data-v-173ef78a><dt data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("我的苹果"))) + "</dt> <dd data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.balances ? _vm.balances.apple.toLocaleString() : "—")) + "</dd></div></dl> "), _c('nuxt-link', {
    attrs: {
      "to": "/read/resources"
    }
  }, [_vm._v(_vm._s(_vm.$t("获取原木的方法 →")))])], 2), _vm._ssrNode(" "), _vm.tree ? _vm._ssrNode("<div class=\"rewards-main\" data-v-173ef78a>", "</div>", [_vm._ssrNode("<section aria-labelledby=\"orbs-title\" class=\"rewards-panel\" data-v-173ef78a><header data-v-173ef78a><div data-v-173ef78a><h2 id=\"orbs-title\" data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("经验球"))) + "</h2> <p class=\"quiet\" data-v-173ef78a>" + _vm._ssrEscape("\n                " + _vm._s(_vm.tree.orbs.length ? _vm.$t("待收集 ") + _vm.tree.orbs.length + _vm.$t(" 个 · 成长值 ") + _vm.orbTotal : _vm.tree.active ? _vm.$t("新的经验球出现后会显示在这里。") : _vm.$t("种下树苗后，开始积累成长值。")) + "\n              ") + "</p></div> " + (_vm.tree.orbs.length ? "<button" + _vm._ssrAttr("disabled", !!_vm.busy || _vm.loading || _vm.uncertain) + " data-v-173ef78a>" + _vm._ssrEscape("\n              " + _vm._s(_vm.busy === "collect" ? _vm.$t("收集中…") : _vm.$t("一键收集")) + "\n            ") + "</button>" : "<!---->") + "</header> <div class=\"orb-grid\" data-v-173ef78a>" + _vm._ssrList(_vm.tree.orbs, function (orb) {
    return "<button" + _vm._ssrAttr("disabled", !!_vm.busy || _vm.loading || _vm.uncertain) + _vm._ssrAttr("aria-label", _vm.$t('收集经验球 {p0}，成长值 {p1}', {
      p0: orb.orb_id,
      p1: orb.reward
    })) + " data-v-173ef78a><span aria-hidden=\"true\" class=\"orb-pixel\" data-v-173ef78a></span><strong data-v-173ef78a>" + _vm._ssrEscape("+" + _vm._s(orb.reward)) + "</strong><small data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("收集成长值"))) + "</small></button>";
  }) + "</div></section> "), _vm._ssrNode("<section aria-labelledby=\"daily-tasks-title\" class=\"rewards-panel\" data-v-173ef78a>", "</section>", [_vm._ssrNode("<header data-v-173ef78a><h2 id=\"daily-tasks-title\" data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("日常任务"))) + "</h2> <span class=\"quiet\" data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("{p0} / {p1} 已完成", {
    p0: _vm.completedTasks,
    p1: _vm.tree.tasks.length
  }))) + "</span></header> "), _vm._ssrNode("<div class=\"task-list\" data-v-173ef78a>", "</div>", _vm._l(_vm.tree.tasks, function (task) {
    return _vm._ssrNode("<article data-v-173ef78a>", "</article>", [_vm._ssrNode("<div data-v-173ef78a><h3 data-v-173ef78a>" + _vm._ssrEscape(_vm._s(task.task_name)) + "</h3> <p data-v-173ef78a>" + _vm._ssrEscape(_vm._s(task.task_desc)) + "</p> " + (task.multiplier > 1 && task.base != null ? "<small data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("基础 {p0} × {p1}", {
      p0: task.base,
      p1: task.multiplier
    }))) + "</small>" : "<!---->") + "</div> <strong class=\"task-reward\" data-v-173ef78a>" + _vm._ssrEscape("+" + _vm._s(task.reward) + " XP") + "</strong>"), task.completed ? _vm._ssrNode("<span class=\"completed\" data-v-173ef78a>", "</span>", [_vm._ssrNode(_vm._ssrEscape(_vm._s(_vm.$t("已完成"))))], 2) : _vm.isCheckin(task) ? _vm._ssrNode("<button" + _vm._ssrAttr("disabled", !!_vm.busy || _vm.loading || _vm.uncertain) + " data-v-173ef78a>" + _vm._ssrEscape("\n                " + _vm._s(_vm.busy === task.task_code ? _vm.$t("领取中…") : _vm.$t("领取"))) + "</button>") : _c('nuxt-link', {
      attrs: {
        "to": _vm.taskLink(task)
      }
    }, [_vm._v(_vm._s(_vm.$t("去完成 →")))])], 2);
  }), 0), _vm._ssrNode(" " + (!_vm.tree.tasks.length ? "<p class=\"quiet\" data-v-173ef78a>" + _vm._ssrEscape("\n            " + _vm._s(_vm.tree.active ? _vm.$t("暂无日常任务") : _vm.$t("种植后查看今日任务")) + "\n          ") + "</p>" : "<!---->"))], 2), _vm._ssrNode(" "), _vm._ssrNode("<section aria-labelledby=\"exp-tasks-title\" class=\"rewards-panel\" data-v-173ef78a>", "</section>", [_vm._ssrNode("<header data-v-173ef78a><h2 id=\"exp-tasks-title\" data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("经验任务"))) + "</h2> <span class=\"quiet\" data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("{p0} / {p1} 已完成", {
    p0: _vm.completedExpTasks,
    p1: _vm.tree.expTasks.length
  }))) + "</span></header> "), _vm._ssrNode("<div class=\"task-list\" data-v-173ef78a>", "</div>", _vm._l(_vm.tree.expTasks, function (task) {
    return _vm._ssrNode("<article data-v-173ef78a>", "</article>", [_vm._ssrNode("<div data-v-173ef78a><h3 data-v-173ef78a>" + _vm._ssrEscape(_vm._s(task.task_name)) + "</h3> <p data-v-173ef78a>" + _vm._ssrEscape(_vm._s(task.task_desc)) + "</p> <small data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("{p0} · 已结算 {p1} / {p2} 次", {
      p0: task.progress_text,
      p1: task.completed_times,
      p2: task.daily_limit
    }))) + "</small>" + (task.multiplier > 1 && task.base != null ? "<small data-v-173ef78a>" + _vm._ssrEscape(_vm._s(_vm.$t("基础 {p0} × {p1}", {
      p0: task.base,
      p1: task.multiplier
    }))) + "</small>" : "<!---->") + "</div> <strong class=\"task-reward\" data-v-173ef78a>" + _vm._ssrEscape("+" + _vm._s(task.reward) + " XP") + "</strong>"), task.completed ? _vm._ssrNode("<span class=\"completed\" data-v-173ef78a>", "</span>", [_vm._ssrNode(_vm._ssrEscape(_vm._s(_vm.$t("已自动完成"))))], 2) : _c('nuxt-link', {
      attrs: {
        "to": _vm.taskLink(task)
      }
    }, [_vm._v(_vm._s(_vm.$t("去完成 →")))])], 2);
  }), 0), _vm._ssrNode(" " + (!_vm.tree.expTasks.length ? "<p class=\"quiet\" data-v-173ef78a>" + _vm._ssrEscape("\n            " + _vm._s(_vm.tree.active ? _vm.$t("暂无经验任务") : _vm.$t("种植后查看阅读等经验任务")) + "\n          ") + "</p>" : "<p class=\"quiet\" data-v-173ef78a>" + _vm._ssrEscape("\n            " + _vm._s(_vm.$t("阅读等经验任务由服务端按实际进度自动结算，刷新可查看最新状态。")) + "\n          ") + "</p>"))], 2)], 2) : _vm._e()], 2), _vm._ssrNode(" "), !_vm.embedded ? _vm._ssrNode("<footer class=\"rewards-footer\" data-v-173ef78a>", "</footer>", [_c('nuxt-link', {
    attrs: {
      "to": "/me/tree"
    }
  }, [_vm._v(_vm._s(_vm.$t("完整树场与好友互动 →")))]), _c('nuxt-link', {
    attrs: {
      "to": "/read"
    }
  }, [_vm._v(_vm._s(_vm.$t("继续发现好作品 →")))])], 1) : _vm._e()]], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderRewards.vue?vue&type=template&id=173ef78a&scoped=true

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// CONCATENATED MODULE: ./utils/reader-rewards.js
const TREE_THEMES = [{
  key: 'oak_island',
  name: '橡木小岛'
}, {
  key: 'birch_blossom',
  name: '白桦花林'
}, {
  key: 'snow_spruce',
  name: '雪地云杉'
}, {
  key: 'sakura_grove',
  name: '樱花树林'
}, {
  key: 'savanna_acacia',
  name: '草原金合欢'
}, {
  key: 'swamp_redwood',
  name: '沼泽红杉'
}];
const number = (value, label, minimum = 0) => {
  if (value == null || value === '' || !Number.isFinite(Number(value)) || Number(value) < minimum) throw new Error(`${label}加载异常，请刷新重试。`);
  return Number(value);
};
const integer = (value, label, minimum = 0) => {
  const n = number(value, label, minimum);
  if (!Number.isSafeInteger(n)) throw new Error(`${label}加载异常，请刷新重试。`);
  return n;
};
function rewardBalances(raw) {
  const row = Array.isArray(raw) ? raw[0] : raw;
  if (!row) throw new Error('资源余额读取失败');
  return {
    log: integer(row.log, '原木余额'),
    apple: integer(row.apple, '苹果余额')
  };
}
function tasks(rows, exp = false) {
  if (!Array.isArray(rows)) throw new Error('任务列表读取失败');
  const codes = new Set();
  return rows.map(row => {
    if (!row || !/^[a-zA-Z0-9_-]{1,80}$/.test(row.task_code) || codes.has(row.task_code)) throw new Error('任务列表数据异常');
    codes.add(row.task_code);
    return {
      ...row,
      task_name: String(row.task_name || '任务'),
      task_desc: String(row.task_desc || ''),
      reward: integer(exp ? row.exp_reward : row.growth_reward, '任务成长值'),
      base: row[exp ? 'base_exp_reward' : 'base_growth_reward'] == null ? null : number(row[exp ? 'base_exp_reward' : 'base_growth_reward'], '基础成长值'),
      multiplier: row.reward_multiplier == null ? 1 : number(row.reward_multiplier, '成长值加成', 1),
      completed: row.status === 'completed',
      ...(exp ? {
        completed_times: integer(row.completed_times, '已结算次数'),
        daily_limit: integer(row.daily_limit, '每日上限', 1),
        progress_text: String(row.progress_text || '')
      } : {})
    };
  });
}
function rewardTree(raw) {
  if (!Array.isArray(raw) || raw.length > 1) throw new Error('树场信息读取失败');
  const row = raw[0] || {
    plant_id: 0,
    tree_status: '未种植',
    growth_val: 0,
    max_growth: 100,
    is_gotten: 1,
    tasks: [],
    exp_tasks: [],
    exp_orbs: []
  };
  if (!['未种植', '种植', '开花', '结果'].includes(row.tree_status)) throw new Error('树木状态异常');
  const active = row.tree_status !== '未种植',
    id = integer(row.plant_id, '树木编号', active ? 1 : 0),
    growth = number(row.growth_val, '成长值'),
    maximum = number(row.max_growth, '成熟成长值', 1);
  if (active && Number(row.is_gotten) !== 0) throw new Error('这棵树已收获，请刷新树场');
  const ids = new Set(),
    orbs = (row.exp_orbs || []).map(orb => {
      const id = integer(orb.orb_id, '经验球编号', 1);
      if (ids.has(id)) throw new Error('经验球列表异常');
      ids.add(id);
      return {
        ...orb,
        orb_id: id,
        reward: integer(orb.reward, '经验球成长值', 1)
      };
    });
  return {
    id,
    active,
    status: row.tree_status,
    growth,
    maximum,
    theme: TREE_THEMES.some(theme => theme.key === row.treeType) ? row.treeType : 'oak_island',
    tasks: tasks(row.tasks || []),
    expTasks: tasks(row.exp_tasks || [], true),
    orbs,
    benefits: {
      name: String(row.reward_benefits && row.reward_benefits.membership_name || '普通用户'),
      multiplier: row.reward_benefits ? number(row.reward_benefits.multiplier, '会员加成', 1) : 1
    },
    expEnabled: row.exp_feature_enabled === true
  };
}
function rewardTaskLink(task) {
  const source = String(task.source_code || task.task_code || '');
  if (/write|chapter/.test(source)) return '/write';
  if (/community|post|reply/.test(source)) return '/community';
  if (/email|profile|account/.test(source)) return '/me/settings';
  return '/read';
}
function harvestReceipt(raw, id) {
  if (!raw || raw.success !== true || Number(raw.plant_id) !== id) throw new Error('收获结果未能确认，请刷新树场核对状态。');
  const balances = rewardBalances(raw.balances);
  if (raw.replayed === true) return {
    replayed: true,
    balances,
    rewards: null
  };
  if (!raw.rewards) throw new Error('收获奖励未能确认，请刷新余额。');
  return {
    replayed: false,
    balances,
    rewards: {
      log: integer(raw.rewards.log, '收获原木'),
      apple: integer(raw.rewards.apple, '收获苹果')
    }
  };
}
function collectionReceipt(raw) {
  var _raw$total_reward;
  if (!raw || raw.success !== true || !['种植', '开花', '结果'].includes(raw.tree_status)) throw new Error('经验球收集结果未确认，请刷新状态。');
  return integer((_raw$total_reward = raw.total_reward) !== null && _raw$total_reward !== void 0 ? _raw$total_reward : raw.reward, '收集成长值');
}
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderRewards.vue?vue&type=script&lang=js


/* harmony default export */ var ReaderRewardsvue_type_script_lang_js = ({
  props: {
    embedded: Boolean
  },
  data: () => ({
    ready: false,
    token: null,
    authExpired: false,
    tree: null,
    balances: null,
    theme: "oak_island",
    loading: false,
    busy: "",
    error: "",
    balanceError: "",
    notice: "",
    uncertain: false,
    version: 0,
    epoch: 0,
    themes: TREE_THEMES
  }),
  computed: {
    loginUrl() {
      return {
        path: "/login",
        query: {
          redirect: "/read/rewards"
        }
      };
    },
    fullTreeUrl() {
      return `${"https://m.loghome.ink"}/#/pages/treePlant/treeplant`;
    },
    themeName() {
      return (this.themes.find(theme => theme.key === (this.tree && this.tree.theme)) || this.themes[0]).name;
    },
    orbTotal() {
      return this.tree ? this.tree.orbs.reduce((sum, orb) => sum + orb.reward, 0) : 0;
    },
    completedTasks() {
      return this.tree ? this.tree.tasks.filter(task => task.completed).length : 0;
    },
    completedExpTasks() {
      return this.tree ? this.tree.expTasks.filter(task => task.completed).length : 0;
    }
  },
  mounted() {
    this.checkAccount();
    this.ready = true;
    window.addEventListener("storage", this.checkAccount);
    window.addEventListener("focus", this.checkAccount);
  },
  beforeDestroy() {
    this.epoch++;
    this.version++;
    window.removeEventListener("storage", this.checkAccount);
    window.removeEventListener("focus", this.checkAccount);
  },
  methods: {
    taskLink: rewardTaskLink,
    isCheckin(task) {
      return task.task_name.includes("签到");
    },
    current(token, epoch) {
      return token === Object(reading["c" /* readingToken */])() && token === this.token && epoch === this.epoch;
    },
    checkAccount() {
      const token = Object(reading["c" /* readingToken */])();
      if (this.ready && token === this.token) return;
      this.epoch++;
      this.version++;
      Object.assign(this, {
        token,
        authExpired: false,
        tree: null,
        balances: null,
        theme: "oak_island",
        loading: false,
        busy: "",
        error: "",
        balanceError: "",
        notice: "",
        uncertain: false
      });
      if (token) this.load();
    },
    expire(error) {
      if ([401, 403].includes(error.status)) this.authExpired = true;
    },
    async load() {
      if (Object(reading["c" /* readingToken */])() !== this.token) {
        this.checkAccount();
        return;
      }
      if (!this.token || this.busy) return;
      const token = this.token,
        epoch = this.epoch,
        version = ++this.version;
      this.loading = true;
      this.error = "";
      this.balanceError = "";
      const results = await Promise.allSettled([this.$api.reader.tree(), this.$api.reader.balances()]);
      if (!this.current(token, epoch) || version !== this.version) return;
      try {
        if (results[0].status === "rejected") throw results[0].reason;
        this.tree = rewardTree(results[0].value);
        this.theme = this.tree.theme;
        if (this.$emit) this.$emit("tree-updated", results[0].value[0] || {
          tree_status: "未种植",
          treeType: this.theme
        });
      } catch (error) {
        this.tree = null;
        this.error = error.message || "树场加载失败";
        this.expire(error);
      }
      try {
        if (results[1].status === "rejected") throw results[1].reason;
        this.balances = rewardBalances(results[1].value);
      } catch (error) {
        this.balances = null;
        this.balanceError = error.message || "资源余额读取失败";
        this.expire(error);
      }
      if (!this.error && !this.balanceError) this.uncertain = false;
      this.loading = false;
    },
    async mutate(action, request, receipt) {
      if (Object(reading["c" /* readingToken */])() !== this.token) {
        this.checkAccount();
        return;
      }
      if (!this.token || this.authExpired || this.busy || this.loading || this.uncertain || !this.tree) return;
      const token = this.token,
        epoch = this.epoch;
      this.busy = action;
      this.version++;
      this.error = "";
      this.notice = "";
      try {
        const raw = await request();
        if (!this.current(token, epoch)) return;
        this.notice = receipt(raw);
      } catch (error) {
        if (!this.current(token, epoch)) return;
        this.error = error.message || "操作失败，请刷新后重试";
        this.uncertain = !error.status || error.status >= 500;
        this.expire(error);
      } finally {
        if (this.current(token, epoch)) {
          this.busy = "";
          if (!this.uncertain) await this.load();
        }
      }
    },
    plant() {
      if (!this.tree || this.tree.active) return;
      const theme = this.theme;
      return this.mutate("plant", () => this.$api.reader.plantTree(theme), raw => {
        if (!raw || raw.success !== true || !Number.isSafeInteger(Number(raw.plant_id)) || Number(raw.plant_id) <= 0) throw new Error("种植结果尚未确认，请刷新树场");
        return "树苗已种下，开始积累成长值吧。";
      });
    },
    collect(orbId) {
      if (!this.tree || !this.tree.active || !this.tree.orbs.length || orbId && !this.tree.orbs.some(orb => orb.orb_id === orbId)) return;
      const id = this.tree.id;
      return this.mutate("collect", () => this.$api.reader.collectTreeOrbs(id, orbId), raw => `经验球已收集，成长值 +${collectionReceipt(raw)}。`);
    },
    claim(task) {
      if (!this.tree || !this.tree.active || task.completed || !this.isCheckin(task) || !this.tree.tasks.some(row => row.task_code === task.task_code)) return;
      return this.mutate(task.task_code, () => this.$api.reader.treeTask(task.task_code), raw => {
        if (!raw || raw.msg !== "Task completed" || typeof raw.reward !== "number" || !Number.isFinite(raw.reward) || raw.reward < 0) throw new Error("签到奖励尚未确认，请刷新状态");
        return `签到任务已完成，成长值 +${raw.reward}。`;
      });
    },
    async harvest() {
      if (Object(reading["c" /* readingToken */])() !== this.token) {
        this.checkAccount();
        return;
      }
      if (!this.tree || this.tree.status !== "结果" || this.busy || this.loading || this.uncertain) return;
      const token = this.token,
        epoch = this.epoch,
        id = this.tree.id;
      this.busy = "confirm";
      try {
        await this.$confirm(`收获当前树木的原木与苹果？${this.tree.orbs.length ? "剩余经验球会先一并收集，多出的成长值保留给下一棵树。" : ""}`, "确认收获", {
          confirmButtonText: "收获",
          cancelButtonText: "取消",
          type: "info"
        });
        if (!this.current(token, epoch) || !this.tree || this.tree.id !== id || this.tree.status !== "结果") return;
        this.busy = "";
        await this.mutate("harvest", () => this.$api.reader.harvestTree(id), raw => {
          const result = harvestReceipt(raw, id);
          this.balances = result.balances;
          return result.replayed ? "已确认这棵树先前已收获，余额已更新。" : `收获成功：原木 +${result.rewards.log}${result.rewards.apple ? "，苹果 +" + result.rewards.apple : ""}。`;
        });
      } catch (error) {
        if (this.current(token, epoch) && error !== "cancel" && error !== "close") this.error = error.message || "收获确认未完成";
      } finally {
        if (this.current(token, epoch) && this.busy === "confirm") this.busy = "";
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderRewards.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderRewardsvue_type_script_lang_js = (ReaderRewardsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderRewards.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(249)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderRewardsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "173ef78a",
  "029fac5a"
  
)

/* harmony default export */ var ReaderRewards = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 329:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(447);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("56417498", content, true, context)
};

/***/ }),

/***/ 446:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_tree_vue_vue_type_style_index_0_id_0c3aeabd_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(329);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_tree_vue_vue_type_style_index_0_id_0c3aeabd_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_tree_vue_vue_type_style_index_0_id_0c3aeabd_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_tree_vue_vue_type_style_index_0_id_0c3aeabd_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_tree_vue_vue_type_style_index_0_id_0c3aeabd_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 447:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.tree-desktop-grid[data-v-0c3aeabd] {\r\n  display: grid;\r\n  grid-template-columns: minmax(0, 1fr) 290px;\r\n  gap: 24px;\n}\n.tree-scene-panel[data-v-0c3aeabd] {\r\n  padding: 0;\r\n  overflow: hidden;\r\n  position: relative;\n}\n.tree-scene-panel .oak-tree-3d[data-v-0c3aeabd] {\r\n  height: 420px;\n}\n.tree-classic[data-v-0c3aeabd] {\r\n  height: 420px;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  background: #edf2d7;\n}\n.tree-classic img[data-v-0c3aeabd] {\r\n  width: 70%;\r\n  max-height: 380px;\r\n  object-fit: contain;\n}\n.tree-scene-caption[data-v-0c3aeabd] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  padding: 20px;\r\n  gap: 16px;\r\n  border-top: 1px solid var(--line, #e9e0d5);\n}\n.tree-scene-caption strong[data-v-0c3aeabd] {\r\n  font-size: 16px;\n}\n.tree-scene-caption span[data-v-0c3aeabd] {\r\n  font-size: 12px;\r\n  color: var(--muted);\n}\n.friend-orbs[data-v-0c3aeabd] {\r\n  padding: 0 20px 20px;\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 12px;\n}\n.friend-orbs p[data-v-0c3aeabd] {\r\n  width: 100%;\n}\n.friend-orbs > button[data-v-0c3aeabd]:not(.el-button) {\r\n  background: #e9efd8;\r\n  color: #596a39;\r\n  border: 1px solid #b7c58d;\r\n  border-radius: 9px;\r\n  padding: 10px;\r\n  cursor: pointer;\n}\n@media (max-width: 1100px) {\n.tree-desktop-grid[data-v-0c3aeabd] {\r\n    grid-template-columns: 1fr;\n}\n.tree-desktop-grid > aside[data-v-0c3aeabd] {\r\n    display: grid;\r\n    grid-template-columns: 1fr 1fr;\r\n    gap: 20px;\n}\n}\n@media (max-width: 650px) {\n.tree-desktop-grid > aside[data-v-0c3aeabd] {\r\n    grid-template-columns: 1fr;\n}\n.tree-scene-caption[data-v-0c3aeabd] {\r\n    flex-wrap: wrap;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 591:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/tree.vue?vue&type=template&id=0c3aeabd&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('Workspace', {
    attrs: {
      "title": _vm.$t('原木树场'),
      "active": "/me"
    },
    scopedSlots: _vm._u([{
      key: "actions",
      fn: function () {
        return [_c('el-switch', {
          attrs: {
            "active-text": _vm.$t('夜景')
          },
          model: {
            value: _vm.night,
            callback: function ($$v) {
              _vm.night = $$v;
            },
            expression: "night"
          }
        }), _c('el-button', {
          attrs: {
            "icon": "el-icon-refresh",
            "loading": _vm.loading
          },
          on: {
            "click": _vm.load
          }
        }, [_vm._v(_vm._s(_vm.$t("刷新树场")))])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _vm.error ? _c('div', {
    staticClass: "social-panel",
    attrs: {
      "role": "alert"
    }
  }, [_c('el-alert', {
    attrs: {
      "title": _vm.error,
      "type": "error",
      "closable": false
    }
  }), _c('el-button', {
    on: {
      "click": _vm.load
    }
  }, [_vm._v(_vm._s(_vm.$t("重试")))])], 1) : _vm._e(), _vm._v(" "), _vm.loading ? _c('el-skeleton', {
    staticClass: "social-panel",
    attrs: {
      "rows": 5,
      "animated": ""
    }
  }) : [_c('div', {
    staticClass: "tree-desktop-grid"
  }, [_c('section', {
    staticClass: "social-panel tree-scene-panel"
  }, [_c('client-only', [_vm.highQuality ? _c('TreeScene', {
    attrs: {
      "state": _vm.sceneState,
      "scene-theme": _vm.sceneState.treeType || 'oak_island',
      "night-mode": _vm.night
    },
    on: {
      "scene-unavailable": function ($event) {
        _vm.highQuality = false;
      }
    }
  }) : _c('div', {
    staticClass: "tree-classic"
  }, [_c('img', {
    attrs: {
      "src": _vm.classicImage,
      "alt": _vm.$t('树木成长阶段')
    }
  })])], 1), _vm._v(" "), _c('div', {
    staticClass: "tree-scene-caption"
  }, [_c('strong', [_vm._v(_vm._s(_vm.visiting ? _vm.$t("{p0} 的树场", {
    p0: _vm.visiting.target_name
  }) : _vm.$t("我的树场")))]), _c('span', [_vm._v(_vm._s(_vm.$t("{p0} / {p1} 成长值", {
    p0: _vm.sceneState.tree_status || _vm.$t("未种植"),
    p1: Math.floor(_vm.sceneState.growth_val || 0)
  })))]), _vm.visiting ? _c('el-button', {
    attrs: {
      "size": "small"
    },
    on: {
      "click": function ($event) {
        _vm.visiting = null;
      }
    }
  }, [_vm._v(_vm._s(_vm.$t("返回自己的树场")))]) : _vm._e()], 1), _vm._v(" "), _vm.visiting ? _c('div', {
    staticClass: "friend-orbs"
  }, [_c('p', {
    staticClass: "social-muted"
  }, [_vm._v(_vm._s(_vm.visiting.steal_tip))]), _vm._v(" "), _vm._l(_vm.sceneState.exp_orbs || [], function (orb) {
    return _c('button', {
      key: orb.orb_id,
      attrs: {
        "disabled": _vm.busy || !_vm.visiting.can_steal
      },
      on: {
        "click": function ($event) {
          return _vm.steal(orb);
        }
      }
    }, [_c('i', {
      staticClass: "el-icon-sugar"
    }), _vm._v(_vm._s(_vm.$t("{p0} 成长值", {
      p0: orb.reward
    })))]);
  }), (_vm.sceneState.exp_orbs || []).length ? _c('el-button', {
    attrs: {
      "disabled": _vm.busy || !_vm.visiting.can_steal
    },
    on: {
      "click": function ($event) {
        return _vm.steal();
      }
    }
  }, [_vm._v(_vm._s(_vm.$t("收集可获取成长值")))]) : _vm._e()], 2) : _vm._e()], 1), _vm._v(" "), _c('aside', [_c('section', {
    staticClass: "social-panel"
  }, [_c('h2', [_vm._v(_vm._s(_vm.$t("场景设置")))]), _vm._v(" "), _c('el-select', {
    staticStyle: {
      "width": "100%",
      "margin-bottom": "18px"
    },
    attrs: {
      "disabled": _vm.busy || !!_vm.visiting,
      "aria-label": _vm.$t('树场场景')
    },
    on: {
      "change": _vm.changeScene
    },
    model: {
      value: _vm.selectedTheme,
      callback: function ($$v) {
        _vm.selectedTheme = $$v;
      },
      expression: "selectedTheme"
    }
  }, _vm._l(_vm.themes, function (theme) {
    return _c('el-option', {
      key: theme.key,
      attrs: {
        "value": theme.key,
        "label": `${_vm.$t(theme.label)}${!['oak_island', 'birch_blossom'].includes(theme.key) && !_vm.membershipActive ? _vm.$t(' / 通行证专属') : ''}`
      }
    });
  }), 1), _vm._v(" "), _vm.settingsError ? _c('p', {
    staticClass: "social-muted",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v("\n            " + _vm._s(_vm.settingsError) + "\n          ")]) : _vm._e(), _vm._v(" "), _c('el-switch', {
    attrs: {
      "active-text": _vm.$t('高质量 3D')
    },
    on: {
      "change": _vm.saveQuality
    },
    model: {
      value: _vm.highQuality,
      callback: function ($$v) {
        _vm.highQuality = $$v;
      },
      expression: "highQuality"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "social-muted"
  }, [_vm._v(_vm._s(_vm.$t("关闭后使用经典视图，减少渲染开销。")))]), _vm._v(" "), _c('el-divider'), _c('el-switch', {
    attrs: {
      "disabled": _vm.busy,
      "active-text": _vm.$t('关闭树场通知')
    },
    on: {
      "change": _vm.changeNotifications
    },
    model: {
      value: _vm.notificationsDisabled,
      callback: function ($$v) {
        _vm.notificationsDisabled = $$v;
      },
      expression: "notificationsDisabled"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "social-muted"
  }, [_vm._v(_vm._s(_vm.$t("关闭后不接收成长和好友串门通知。")))])], 1), _vm._v(" "), _c('section', {
    staticClass: "social-panel"
  }, [_c('h2', [_vm._v(_vm._s(_vm.$t("好友树场")))]), _vm._v(" "), !_vm.dashboard.steal_feature_enabled ? _c('p', {
    staticClass: "social-muted"
  }, [_vm._v("\n            " + _vm._s(_vm.$t("好友串门暂未开放")) + "\n          ")]) : [_c('nuxt-link', {
    staticClass: "social-muted",
    attrs: {
      "to": "/me/friends"
    }
  }, [_vm._v(_vm._s(_vm.$t("互相关注后，一起培育小树。")))]), _vm._v(" "), _vm._l(_vm.dashboard.steal_targets || [], function (friend) {
    return _c('div', {
      key: friend.user_id,
      staticClass: "social-list-row"
    }, [_c('Avatar', {
      attrs: {
        "src": friend.avatar_url,
        "frame": friend.avatar_frame,
        "size": 40
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "row-main"
    }, [_c('strong', [_vm._v(_vm._s(friend.name))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(friend.has_active_tree ? _vm.$t("已种植") : _vm.$t("未种植")))])]), _vm._v(" "), _c('el-button', {
      attrs: {
        "size": "small",
        "disabled": _vm.busy || !friend.has_active_tree
      },
      on: {
        "click": function ($event) {
          return _vm.visit(friend);
        }
      }
    }, [_vm._v(_vm._s(_vm.$t("串门")))])], 1);
  }), _vm._v(" "), !(_vm.dashboard.steal_targets || []).length ? _c('p', {
    staticClass: "social-muted"
  }, [_vm._v("\n              " + _vm._s(_vm.$t("暂时没有可串门的好友树场")) + "\n            ")]) : _vm._e()]], 2)])]), _vm._v(" "), _c('ReaderRewards', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.visiting,
      expression: "!visiting"
    }],
    ref: "rewards",
    attrs: {
      "embedded": ""
    },
    on: {
      "tree-updated": function ($event) {
        _vm.ownTree = $event;
      }
    }
  }), _vm._v(" "), _vm.dashboard.recent_steal_logs && _vm.dashboard.recent_steal_logs.length ? _c('section', {
    staticClass: "social-panel"
  }, [_c('h2', [_vm._v(_vm._s(_vm.$t("树场动态")))]), _vm._v(" "), _vm._l(_vm.dashboard.recent_steal_logs, function (log, index) {
    return _c('div', {
      key: log.id || index,
      staticClass: "social-list-row"
    }, [_c('div', {
      staticClass: "row-main"
    }, [_c('strong', [_vm._v(_vm._s(_vm.$t("{p0} 收集了 {p1} 成长值", {
      p0: log.thief_name || log.name || _vm.$t("好友"),
      p1: log.stolen_reward || log.reward || 0
    })))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.accountDate(log.created_at || log.create_time)))])])]);
  })], 2) : _vm._e()]], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/me/tree.vue?vue&type=template&id=0c3aeabd&scoped=true

// EXTERNAL MODULE: ./components/social/Workspace.vue + 5 modules
var Workspace = __webpack_require__(149);

// EXTERNAL MODULE: ./components/social/Avatar.vue + 4 modules
var Avatar = __webpack_require__(159);

// EXTERNAL MODULE: ./components/read/ReaderRewards.vue + 5 modules
var ReaderRewards = __webpack_require__(282);

// EXTERNAL MODULE: ./plugins/api/social.js
var social = __webpack_require__(26);

// EXTERNAL MODULE: ./plugins/api/account.js
var account = __webpack_require__(154);

// EXTERNAL MODULE: ./mixins/account-page.js
var account_page = __webpack_require__(155);

// EXTERNAL MODULE: ./utils/tree-scene-settings.js
var tree_scene_settings = __webpack_require__(251);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/tree.vue?vue&type=script&lang=js







const get = (path, params = {}) => Object(social["b" /* socialRequest */])(`/treePlant/${path}`, params, "GET", null, true);
/* harmony default export */ var treevue_type_script_lang_js = ({
  components: {
    Workspace: Workspace["a" /* default */],
    Avatar: Avatar["a" /* default */],
    ReaderRewards: ReaderRewards["a" /* default */],
    TreeScene: () => __webpack_require__.e(/* import() */ 73).then(__webpack_require__.bind(null, 567))
  },
  mixins: [account_page["a" /* default */]],
  data: () => ({
    ownTree: {},
    dashboard: {},
    visiting: null,
    loading: true,
    error: "",
    busy: false,
    night: false,
    highQuality: true,
    selectedTheme: "oak_island",
    membershipActive: false,
    notificationsDisabled: false,
    settingsError: "",
    themes: tree_scene_settings["b" /* TREE_PLANT_SCENE_THEMES */]
  }),
  computed: {
    sceneState() {
      if (this.visiting) return this.visiting.tree || {};
      return this.ownTree;
    },
    classicImage() {
      const map = {
        未种植: "none",
        种植: "planted",
        开花: "flower",
        结果: "fruit"
      };
      return `/social/tree/island-${map[this.sceneState.tree_status] || "none"}.png`;
    }
  },
  mounted() {
    this.highQuality = !Object(tree_scene_settings["c" /* isTreePlantLowPerformanceMode */])();
  },
  methods: {
    async changeScene(theme) {
      if (this.busy || this.visiting) return;
      const old = this.ownTree.treeType || "oak_island";
      if (!["oak_island", "birch_blossom"].includes(theme) && !this.membershipActive) {
        this.selectedTheme = old;
        this.$confirm(this.$t("此树场场景需要原木通行证或超级原木通行证。"), this.$t("通行证专属场景"), {
          confirmButtonText: this.$t("了解通行证"),
          cancelButtonText: this.$t("继续浏览")
        }).then(() => this.$router.push("/membership")).catch(() => {});
        return;
      }
      this.busy = true;
      try {
        const result = await Object(social["b" /* socialRequest */])("/treePlant/set_tree_scene_theme", {}, "POST", {
          tree_type: theme
        }, true);
        this.$set(this.ownTree, "treeType", result.tree_type);
        if (this.$refs.rewards) {
          this.$refs.rewards.theme = result.tree_type;
          if (this.$refs.rewards.tree) this.$refs.rewards.tree.theme = result.tree_type;
        }
        this.$message.success(this.$t("树场场景已更新"));
      } catch (error) {
        this.selectedTheme = old;
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
    async changeNotifications(disabled) {
      if (this.busy) return;
      this.busy = true;
      try {
        const result = await Object(social["b" /* socialRequest */])("/treePlant/notification_settings", {}, "POST", {
          notifications_disabled: disabled
        }, true);
        this.notificationsDisabled = !!result.notifications_disabled;
        this.$message.success(this.$t("树场通知设置已更新"));
      } catch (error) {
        this.notificationsDisabled = !disabled;
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
    saveQuality() {
      Object(tree_scene_settings["e" /* setTreePlantLowPerformanceMode */])(!this.highQuality);
    },
    async load() {
      if (this.busy) return;
      this.loading = true;
      this.error = "";
      try {
        const [rows, dashboard] = await Promise.all([get("get_treePlant_of"), get("steal_dashboard")]);
        this.ownTree = rows[0] || {
          tree_status: "未种植",
          treeType: "oak_island"
        };
        this.dashboard = dashboard;
        this.selectedTheme = this.ownTree.treeType || "oak_island";
        this.settingsError = "";
        const settings = await Promise.allSettled([account["b" /* default */].membership(), get("notification_settings")]);
        if (settings[0].status === "fulfilled") this.membershipActive = !!settings[0].value.active;
        if (settings[1].status === "fulfilled") this.notificationsDisabled = !!settings[1].value.notifications_disabled;else this.settingsError = this.$t("通知设置暂不可用，请刷新重试");
        this.visiting = null;
        this.$nextTick(() => {
          if (this.$refs.rewards) this.$refs.rewards.load();
        });
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async visit(friend) {
      if (this.busy) return;
      this.busy = true;
      try {
        this.visiting = await get("visit_friend_tree", {
          target_user_id: friend.user_id
        });
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
    async steal(orb) {
      if (this.busy || !this.visiting || !this.visiting.can_steal) return;
      this.busy = true;
      try {
        const result = await Object(social["b" /* socialRequest */])("/treePlant/steal_friend_energy", {}, "POST", {
          target_user_id: this.visiting.target_user_id,
          ...(orb ? {
            orb_id: orb.orb_id
          } : {})
        }, true);
        if (result.visit_scene) this.visiting = result.visit_scene;
        if (result.steal_dashboard) this.dashboard = result.steal_dashboard;
        this.$message.success(this.$t("获得 {p0} 成长值", {
          p0: result.reward || 0
        }));
      } catch (error) {
        this.$message.error(error.message);
        try {
          this.visiting = await get("visit_friend_tree", {
            target_user_id: this.visiting.target_user_id
          });
        } catch (_) {}
      } finally {
        this.busy = false;
      }
    }
  },
  head: () => ({
    title: "原木树场 - 原木社区"
  })
});
// CONCATENATED MODULE: ./pages/me/tree.vue?vue&type=script&lang=js
 /* harmony default export */ var me_treevue_type_script_lang_js = (treevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/me/tree.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(446)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  me_treevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "0c3aeabd",
  "64be75c8"
  
)

/* harmony default export */ var tree = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=tree.js.map