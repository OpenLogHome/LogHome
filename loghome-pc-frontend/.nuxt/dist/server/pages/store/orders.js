exports.ids = [60];
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

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _utils_social_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _social__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(26);


const request = (path, params = {}, method = "GET", body, auth = false) => Object(_social__WEBPACK_IMPORTED_MODULE_1__[/* socialRequest */ "b"])(`/store${path}`, params, method, body, auth).then(result => {
  if (!result || result.data == null) throw new Error("商城数据异常，请刷新重试");
  return result.data;
});
/* harmony default export */ __webpack_exports__["a"] = ({
  products: params => request("/products", params).then(value => Object(_utils_social_response__WEBPACK_IMPORTED_MODULE_0__[/* responsePage */ "c"])(value, "商品列表")),
  product: id => request(`/products/${encodeURIComponent(id)}`).then(value => {
    Object(_utils_social_response__WEBPACK_IMPORTED_MODULE_0__[/* responseObject */ "b"])(value, "商品详情");
    if (!value.id || !value.title) throw new Error("商品详情数据异常，请刷新重试");
    return value;
  }),
  addresses: () => request("/addresses", {}, "GET", null, true).then(value => Object(_utils_social_response__WEBPACK_IMPORTED_MODULE_0__[/* responseList */ "a"])(value, "收货地址")),
  saveAddress: (id, body) => request(id ? `/addresses/${id}` : "/addresses", {}, id ? "PUT" : "POST", body, true),
  defaultAddress: id => request(`/addresses/${id}/default`, {}, "POST", {}, true),
  deleteAddress: id => request(`/addresses/${id}`, {}, "DELETE", null, true),
  createOrder: body => request("/orders", {}, "POST", body, true),
  orders: params => request("/orders", params, "GET", null, true).then(value => Object(_utils_social_response__WEBPACK_IMPORTED_MODULE_0__[/* responsePage */ "c"])(value, "订单列表")),
  confirm: id => request(`/orders/${id}/confirm`, {}, "POST", {}, true),
  logistics: id => request(`/orders/${id}/logistics`, {}, "GET", null, true)
});

/***/ }),

/***/ 337:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(464);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("7c38b8fa", content, true, context)
};

/***/ }),

/***/ 463:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_orders_vue_vue_type_style_index_0_id_6564d8f8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(337);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_orders_vue_vue_type_style_index_0_id_6564d8f8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_orders_vue_vue_type_style_index_0_id_6564d8f8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_orders_vue_vue_type_style_index_0_id_6564d8f8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_orders_vue_vue_type_style_index_0_id_6564d8f8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 464:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.store-order header[data-v-6564d8f8] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  font-size: 12px;\r\n  color: var(--muted, #82766c);\r\n  gap: 14px;\n}\n.store-order .social-list-row[data-v-6564d8f8] {\r\n  border: 0;\r\n  color: var(--ink, #382d25);\n}\n.store-order .social-list-row img[data-v-6564d8f8] {\r\n  width: 80px;\r\n  height: 80px;\n}\n.store-order footer[data-v-6564d8f8] {\r\n  display: flex;\r\n  justify-content: flex-end;\n}\n.el-timeline[data-v-6564d8f8] {\r\n  margin: 24px 0;\r\n  padding-left: 8px;\n}\n.el-dialog a[data-v-6564d8f8] {\r\n  display: inline-block;\r\n  margin: 12px 16px 0 0;\r\n  color: var(--wood, #947358);\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 564:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/store/orders.vue?vue&type=template&id=6564d8f8&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('Workspace', {
    attrs: {
      "title": _vm.$t('商城订单'),
      "active": "/me"
    },
    scopedSlots: _vm._u([{
      key: "actions",
      fn: function () {
        return [_c('nuxt-link', {
          attrs: {
            "to": "/store"
          }
        }, [_c('el-button', [_vm._v(_vm._s(_vm.$t("继续逛商城")))])], 1), _c('el-button', {
          attrs: {
            "icon": "el-icon-refresh",
            "loading": _vm.loading
          },
          on: {
            "click": _vm.reset
          }
        }, [_vm._v(_vm._s(_vm.$t("刷新")))])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c('div', {
    staticClass: "social-tabs"
  }, _vm._l(_vm.tabs, function (item) {
    return _c('button', {
      key: item.key,
      class: {
        active: _vm.status === item.key
      },
      on: {
        "click": function ($event) {
          return _vm.changeStatus(item.key);
        }
      }
    }, [_vm._v("\n      " + _vm._s(_vm.$t(item.label)) + "\n    ")]);
  }), 0), _vm._v(" "), _vm.error ? _c('div', {
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
  }, [_vm._v(_vm._s(_vm.$t("重试")))])], 1) : _vm._e(), _vm._v(" "), _vm.loading && !_vm.orders.length ? _c('el-skeleton', {
    staticClass: "social-panel",
    attrs: {
      "rows": 5,
      "animated": ""
    }
  }) : _vm._e(), _vm._v(" "), _vm._l(_vm.orders, function (order) {
    return _c('article', {
      key: order.id,
      staticClass: "social-panel store-order"
    }, [_c('header', [_c('span', [_vm._v(_vm._s(_vm.$t("订单号 {p0}", {
      p0: order.order_no
    })))]), _c('el-tag', {
      attrs: {
        "size": "small",
        "type": order.status === 'completed' ? 'success' : 'info'
      }
    }, [_vm._v(_vm._s(_vm.$t(_vm.statusLabel(order.status))))])], 1), _vm._v(" "), _c('nuxt-link', {
      staticClass: "social-list-row",
      attrs: {
        "to": `/store/${order.product_id}`
      }
    }, [_c('img', {
      attrs: {
        "src": order.product_cover || '/social/icons/store.png',
        "alt": ""
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "row-main"
    }, [_c('strong', [_vm._v(_vm._s(order.product_title))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(order.variant_label || order.shipping_desc))])]), _vm._v(" "), _c('strong', [_vm._v(_vm._s(_vm.$t("{p0} 原木", {
      p0: order.price
    })))])]), _vm._v(" "), _c('p', {
      staticClass: "social-muted"
    }, [_vm._v("\n      " + _vm._s(_vm.$t("支付 {p0} 去皮原木 + {p1} 原木", {
      p0: order.pay_cropped_log,
      p1: order.pay_log
    }))), _c('br'), _vm._v(_vm._s(_vm.$t("下单时间 {p0}", {
      p0: _vm.accountDate(order.created_at)
    })) + "\n    ")]), _vm._v(" "), order.product_type === 'physical' ? _c('p', {
      staticClass: "social-muted"
    }, [_vm._v("\n      " + _vm._s(order.receiver_name) + " " + _vm._s(order.receiver_phone)), _c('br'), _vm._v(_vm._s(order.receiver_province) + _vm._s(order.receiver_city) + _vm._s(order.receiver_district) + _vm._s(order.receiver_detail) + "\n    ")]) : _vm._e(), _vm._v(" "), _c('footer', [order.product_type === 'physical' ? _c('el-button', {
      attrs: {
        "size": "small"
      },
      on: {
        "click": function ($event) {
          return _vm.openLogistics(order);
        }
      }
    }, [_vm._v(_vm._s(_vm.$t("查看物流")))]) : _vm._e(), order.status === 'shipped' ? _c('el-button', {
      attrs: {
        "type": "primary",
        "size": "small",
        "disabled": _vm.busy
      },
      on: {
        "click": function ($event) {
          return _vm.confirm(order);
        }
      }
    }, [_vm._v(_vm._s(_vm.$t("确认收货")))]) : _vm._e()], 1)], 1);
  }), _vm._v(" "), !_vm.loading && !_vm.error && !_vm.orders.length ? _c('div', {
    staticClass: "social-panel social-state"
  }, [_c('i', {
    staticClass: "el-icon-box"
  }), _vm._v(_vm._s(_vm.$t("暂无订单记录"))), _c('br'), _c('nuxt-link', {
    attrs: {
      "to": "/store"
    }
  }, [_vm._v(_vm._s(_vm.$t("去商城看看")))])], 1) : _vm._e(), _vm._v(" "), _vm.hasMore ? _c('div', {
    staticClass: "social-end"
  }, [_c('el-button', {
    attrs: {
      "loading": _vm.loading
    },
    on: {
      "click": _vm.load
    }
  }, [_vm._v(_vm._s(_vm.$t("加载更多")))])], 1) : _vm._e(), _vm._v(" "), _c('el-dialog', {
    attrs: {
      "title": _vm.$t('物流详情'),
      "visible": _vm.logisticsVisible,
      "width": "min(650px, 94vw)"
    },
    on: {
      "update:visible": function ($event) {
        _vm.logisticsVisible = $event;
      }
    },
    scopedSlots: _vm._u([{
      key: "footer",
      fn: function () {
        return [_c('el-button', {
          on: {
            "click": function ($event) {
              _vm.logisticsVisible = false;
            }
          }
        }, [_vm._v(_vm._s(_vm.$t("关闭")))]), _vm.selectedOrder ? _c('el-button', {
          attrs: {
            "loading": _vm.logisticsLoading
          },
          on: {
            "click": function ($event) {
              return _vm.openLogistics(_vm.selectedOrder);
            }
          }
        }, [_vm._v(_vm._s(_vm.$t("刷新物流")))]) : _vm._e()];
      },
      proxy: true
    }])
  }, [_vm.logisticsLoading ? _c('el-skeleton', {
    attrs: {
      "rows": 5,
      "animated": ""
    }
  }) : _vm.logisticsError ? _c('el-alert', {
    attrs: {
      "title": _vm.logisticsError,
      "type": "error",
      "closable": false
    }
  }) : _vm.logistics ? [_c('p', {
    staticClass: "social-muted"
  }, [_vm._v("\n        " + _vm._s(_vm.logistics.order.shipping_company) + "\n        " + _vm._s(_vm.logistics.order.tracking_number) + "\n      ")]), _vm._v(" "), _c('p', [_vm._v("\n        " + _vm._s(_vm.logistics.logistics.state_text || _vm.logistics.logistics.message || _vm.$t("发货后可查看物流动态")) + "\n      ")]), _vm._v(" "), _vm.logistics.logistics.events && _vm.logistics.logistics.events.length ? _c('el-timeline', _vm._l(_vm.logistics.logistics.events, function (event, index) {
    return _c('el-timeline-item', {
      key: index,
      attrs: {
        "timestamp": event.time
      }
    }, [_vm._v(_vm._s(event.context))]);
  }), 1) : _vm._e(), _vm._v(" "), _vm.logistics.logistics.checked_at ? _c('p', {
    staticClass: "social-muted"
  }, [_vm._v("\n        " + _vm._s(_vm.$t("查询时间 {p0}", {
    p0: _vm.accountDate(_vm.logistics.logistics.checked_at)
  })) + "\n      ")]) : _vm._e(), _vm._v(" "), _vm.tracking.queryUrl ? _c('a', {
    attrs: {
      "href": _vm.tracking.queryUrl,
      "target": "_blank",
      "rel": "noopener noreferrer"
    }
  }, [_vm._v(_vm._s(_vm.$t("快递查询 ↗")))]) : _vm._e(), _vm.tracking.officialUrl ? _c('a', {
    attrs: {
      "href": _vm.tracking.officialUrl,
      "target": "_blank",
      "rel": "noopener noreferrer"
    }
  }, [_vm._v(_vm._s(_vm.tracking.officialName) + " ↗")]) : _vm._e()] : _vm._e()], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/store/orders.vue?vue&type=template&id=6564d8f8&scoped=true

// EXTERNAL MODULE: ./components/social/Workspace.vue + 5 modules
var Workspace = __webpack_require__(149);

// EXTERNAL MODULE: ./plugins/api/store.js
var store = __webpack_require__(195);

// EXTERNAL MODULE: ./mixins/account-page.js
var account_page = __webpack_require__(155);

// CONCATENATED MODULE: ./utils/store-tracking-links.js
// Public pages receive only a parcel number and carrier code, never app credentials or phone numbers.
function getTrackingLinks(order = {}) {
  const number = String(order.tracking_number || "").trim();
  if (!number || order.product_type !== "physical") return {
    queryUrl: "",
    officialUrl: "",
    officialName: ""
  };
  let code = String(order.shipping_company_code || "").trim();
  if (!code && /^JT\d{13}$/i.test(number)) code = "jtexpress";
  const queryUrl = "https://m.kuaidi100.com/app/query/?coname=indexall&nu=" + encodeURIComponent(number) + (code ? "&com=" + encodeURIComponent(code) : "");
  const officialUrl = code === "jtexpress" ? "https://www.jtexpress.com.cn/distM/serviceSearch.html?billcode=" + encodeURIComponent(number) : "";
  return {
    queryUrl,
    officialUrl,
    officialName: officialUrl ? "极兔官方" : ""
  };
}
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/store/orders.vue?vue&type=script&lang=js




/* harmony default export */ var ordersvue_type_script_lang_js = ({
  components: {
    Workspace: Workspace["a" /* default */]
  },
  mixins: [account_page["a" /* default */]],
  data: () => ({
    orders: [],
    status: "all",
    page: 1,
    loading: false,
    error: "",
    hasMore: true,
    busy: false,
    requestId: 0,
    tabs: [{
      key: "all",
      label: "全部订单"
    }, {
      key: "pending",
      label: "待发货"
    }, {
      key: "shipped",
      label: "已发货"
    }, {
      key: "completed",
      label: "已完成"
    }],
    logisticsVisible: false,
    logistics: null,
    logisticsLoading: false,
    logisticsError: "",
    selectedOrder: null,
    logisticsRequest: 0
  }),
  computed: {
    tracking() {
      return this.logistics ? getTrackingLinks(this.logistics.order) : {};
    }
  },
  beforeDestroy() {
    this.requestId++;
    this.logisticsRequest++;
  },
  methods: {
    statusLabel(value) {
      return {
        pending: "待发货",
        shipped: "已发货",
        completed: "已完成"
      }[value] || value;
    },
    changeStatus(status) {
      if (this.status === status) return;
      this.status = status;
      this.reset();
    },
    reset() {
      this.requestId++;
      this.loading = false;
      this.orders = [];
      this.page = 1;
      this.hasMore = true;
      this.load();
    },
    async load() {
      if (this.loading || !this.hasMore) return;
      const request = ++this.requestId;
      this.loading = true;
      this.error = "";
      try {
        const result = await store["a" /* default */].orders({
          status: this.status,
          page: this.page,
          pageSize: 12
        });
        if (request !== this.requestId) return;
        this.orders = [...this.orders, ...result.list];
        this.page++;
        this.hasMore = this.orders.length < result.total;
      } catch (error) {
        if (request === this.requestId) this.error = error.message;
      } finally {
        if (request === this.requestId) this.loading = false;
      }
    },
    async confirm(order) {
      if (this.busy || !(await this.confirmAction("请确认已收到商品，确认后订单将完成。", "确认收货"))) return;
      this.busy = true;
      try {
        await store["a" /* default */].confirm(order.id);
        this.$message.success(this.$t("已确认收货"));
        this.reset();
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.busy = false;
      }
    },
    async openLogistics(order) {
      const request = ++this.logisticsRequest;
      this.selectedOrder = order;
      this.logisticsVisible = true;
      this.logisticsLoading = true;
      this.logisticsError = "";
      this.logistics = null;
      try {
        const result = await store["a" /* default */].logistics(order.id);
        if (request === this.logisticsRequest) this.logistics = result;
      } catch (error) {
        if (request === this.logisticsRequest) this.logisticsError = error.message;
      } finally {
        if (request === this.logisticsRequest) this.logisticsLoading = false;
      }
    }
  },
  head: () => ({
    title: "商城订单 - 原木商城"
  })
});
// CONCATENATED MODULE: ./pages/store/orders.vue?vue&type=script&lang=js
 /* harmony default export */ var store_ordersvue_type_script_lang_js = (ordersvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/store/orders.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(463)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  store_ordersvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "6564d8f8",
  "51ee01f6"
  
)

/* harmony default export */ var orders = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=orders.js.map