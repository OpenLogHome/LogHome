exports.ids = [6];
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

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(259);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("0737bf28", content, true, context)
};

/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(261);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("62fdf60a", content, true, context)
};

/***/ }),

/***/ 258:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ImageUpload_vue_vue_type_style_index_0_id_54a14c0c_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(213);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ImageUpload_vue_vue_type_style_index_0_id_54a14c0c_prod_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ImageUpload_vue_vue_type_style_index_0_id_54a14c0c_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ImageUpload_vue_vue_type_style_index_0_id_54a14c0c_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ImageUpload_vue_vue_type_style_index_0_id_54a14c0c_prod_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 259:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.social-image-upload .el-upload {\r\n  position: relative;\r\n  width: 112px;\r\n  height: 112px;\r\n  border: 1px dashed #cbb79b;\r\n  border-radius: 12px;\r\n  overflow: hidden;\r\n  background: #f7f1e9;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  color: var(--wood, #947358);\r\n  font-size: 13px;\n}\n.social-image-upload.wide .el-upload {\r\n  width: 260px;\n}\n.social-image-upload img {\r\n  width: 100%;\r\n  height: 100%;\r\n  object-fit: cover;\n}\n.social-image-upload i {\r\n  font-size: 24px;\r\n  margin-bottom: 8px;\n}\n.upload-progress {\r\n  position: absolute;\r\n  inset: 0;\r\n  display: grid;\r\n  place-items: center;\r\n  background: #fffdf9cc;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 260:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CircleEditor_vue_vue_type_style_index_0_id_5a6cac56_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(214);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CircleEditor_vue_vue_type_style_index_0_id_5a6cac56_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CircleEditor_vue_vue_type_style_index_0_id_5a6cac56_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CircleEditor_vue_vue_type_style_index_0_id_5a6cac56_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CircleEditor_vue_vue_type_style_index_0_id_5a6cac56_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 261:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.circle-editor-grid[data-v-5a6cac56] {\r\n  display: grid;\r\n  grid-template-columns: minmax(0, 1fr) 260px;\r\n  gap: 20px;\n}\n.editor-media[data-v-5a6cac56] {\r\n  display: flex;\r\n  gap: 24px;\n}\n.editor-submit[data-v-5a6cac56] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 16px;\r\n  padding-top: 12px;\n}\n.circle-preview[data-v-5a6cac56] {\r\n  padding: 24px 14px;\r\n  background: #eee3d2;\r\n  background-size: cover;\r\n  border-radius: 12px;\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 12px;\r\n  align-items: center;\n}\n.circle-preview img[data-v-5a6cac56] {\r\n  width: 70px;\r\n  height: 70px;\r\n  object-fit: cover;\r\n  border: 3px solid white;\r\n  border-radius: 16px;\n}\n.circle-preview strong[data-v-5a6cac56] {\r\n  background: #fffdf9e6;\r\n  border-radius: 6px;\r\n  padding: 6px 12px;\r\n  max-width: 100%;\r\n  overflow-wrap: anywhere;\n}\n@media (max-width: 1050px) {\n.circle-editor-grid[data-v-5a6cac56] {\r\n    grid-template-columns: 1fr;\n}\n.circle-editor-grid > aside[data-v-5a6cac56] {\r\n    display: none;\n}\n}\n@media (max-width: 600px) {\n.editor-media[data-v-5a6cac56] {\r\n    flex-wrap: wrap;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 280:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/social/CircleEditor.vue?vue&type=template&id=5a6cac56&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('Workspace', {
    attrs: {
      "title": _vm.id ? _vm.$t('圈子设置') : _vm.$t('创建圈子'),
      "active": "/community/circles",
      "circle-role": _vm.role
    }
  }, [_vm.error ? _c('div', {
    staticClass: "social-panel social-state",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v("\n    " + _vm._s(_vm.error)), _c('br'), _c('el-button', {
    on: {
      "click": _vm.load
    }
  }, [_vm._v(_vm._s(_vm.$t("重试")))])], 1) : _vm.loading ? _c('div', {
    staticClass: "social-panel"
  }, [_c('el-skeleton', {
    attrs: {
      "rows": 8,
      "animated": ""
    }
  })], 1) : _vm.id && _vm.role < 1 ? _c('div', {
    staticClass: "social-panel social-state"
  }, [_vm._v("\n    " + _vm._s(_vm.$t("只有圈主或管理员可以编辑圈子。")) + "\n  ")]) : _c('div', {
    staticClass: "circle-editor-grid"
  }, [_c('el-form', {
    ref: "form",
    staticClass: "social-panel",
    attrs: {
      "model": _vm.form,
      "rules": _vm.rules,
      "label-position": "top"
    },
    nativeOn: {
      "submit": function ($event) {
        $event.preventDefault();
        return _vm.save.apply(null, arguments);
      }
    }
  }, [_c('div', {
    staticClass: "editor-media"
  }, [_c('el-form-item', {
    attrs: {
      "label": _vm.$t('圈子图标'),
      "prop": "icon"
    }
  }, [_c('ImageUpload', {
    model: {
      value: _vm.form.icon,
      callback: function ($$v) {
        _vm.$set(_vm.form, "icon", $$v);
      },
      expression: "form.icon"
    }
  })], 1), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('背景图片')
    }
  }, [_c('ImageUpload', {
    attrs: {
      "wide": ""
    },
    model: {
      value: _vm.form.bg_url,
      callback: function ($$v) {
        _vm.$set(_vm.form, "bg_url", $$v);
      },
      expression: "form.bg_url"
    }
  })], 1)], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('圈子名称'),
      "prop": "name"
    }
  }, [_c('el-input', {
    attrs: {
      "disabled": !!_vm.id && _vm.role !== 2,
      "maxlength": "20",
      "show-word-limit": "",
      "placeholder": _vm.$t('2-20 个字符')
    },
    model: {
      value: _vm.form.name,
      callback: function ($$v) {
        _vm.$set(_vm.form, "name", $$v);
      },
      expression: "form.name"
    }
  })], 1), _vm._v(" "), !_vm.id ? _c('el-form-item', {
    attrs: {
      "label": _vm.$t('圈子分类'),
      "prop": "category_id"
    }
  }, [_c('el-select', {
    attrs: {
      "placeholder": _vm.$t('选择分类')
    },
    model: {
      value: _vm.form.category_id,
      callback: function ($$v) {
        _vm.$set(_vm.form, "category_id", $$v);
      },
      expression: "form.category_id"
    }
  }, _vm._l(_vm.categories, function (category) {
    return _c('el-option', {
      key: category.category_id,
      attrs: {
        "label": category.name,
        "value": category.category_id
      }
    });
  }), 1)], 1) : _vm._e(), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('圈子简介'),
      "prop": "description"
    }
  }, [_c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 3,
      "maxlength": "200",
      "show-word-limit": "",
      "placeholder": _vm.$t('10-200 个字符，介绍圈子的兴趣和主题')
    },
    model: {
      value: _vm.form.description,
      callback: function ($$v) {
        _vm.$set(_vm.form, "description", $$v);
      },
      expression: "form.description"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('圈子规则')
    }
  }, [_c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 4,
      "maxlength": "500",
      "show-word-limit": "",
      "placeholder": _vm.$t('发帖规范、交流约定与禁止内容')
    },
    model: {
      value: _vm.form.rules,
      callback: function ($$v) {
        _vm.$set(_vm.form, "rules", $$v);
      },
      expression: "form.rules"
    }
  })], 1), _vm._v(" "), _vm.id ? _c('el-form-item', {
    attrs: {
      "label": _vm.$t('圈子公告')
    }
  }, [_c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 3,
      "maxlength": "500",
      "show-word-limit": ""
    },
    model: {
      value: _vm.form.announcement,
      callback: function ($$v) {
        _vm.$set(_vm.form, "announcement", $$v);
      },
      expression: "form.announcement"
    }
  })], 1) : _vm._e(), _vm._v(" "), _vm.id && _vm.role === 2 ? [_c('el-divider'), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('入圈验证')
    }
  }, [_c('el-switch', {
    attrs: {
      "active-value": 1,
      "inactive-value": 0,
      "active-text": _vm.$t('加入时需要审核')
    },
    model: {
      value: _vm.settings.need_verification,
      callback: function ($$v) {
        _vm.$set(_vm.settings, "need_verification", $$v);
      },
      expression: "settings.need_verification"
    }
  })], 1), _vm.settings.need_verification ? _c('el-form-item', {
    attrs: {
      "label": _vm.$t('验证问题')
    }
  }, [_c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 3,
      "placeholder": _vm.$t('希望申请者回答什么问题？')
    },
    model: {
      value: _vm.settings.verification_questions,
      callback: function ($$v) {
        _vm.$set(_vm.settings, "verification_questions", $$v);
      },
      expression: "settings.verification_questions"
    }
  })], 1) : _vm._e()] : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "editor-submit"
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "native-type": "submit",
      "loading": _vm.saving
    }
  }, [_vm._v(_vm._s(_vm.id ? _vm.$t("保存更改") : _vm.$t("提交创建申请")))]), !_vm.id ? _c('span', {
    staticClass: "social-muted"
  }, [_vm._v(_vm._s(_vm.$t("创建后需要等待审核")))]) : _vm._e()], 1)], 2), _vm._v(" "), _c('aside', [_c('section', {
    staticClass: "social-panel"
  }, [_c('h3', [_vm._v(_vm._s(_vm.$t("圈子预览")))]), _vm._v(" "), _c('div', {
    staticClass: "circle-preview",
    style: {
      backgroundImage: _vm.form.bg_url ? `url(${_vm.form.bg_url})` : ''
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.form.icon || '/default-avatar.png',
      "alt": _vm.$t('圈子图标')
    }
  }), _c('strong', [_vm._v(_vm._s(_vm.form.name || _vm.$t("圈子名称")))])]), _vm._v(" "), _c('p', {
    staticClass: "social-muted"
  }, [_vm._v("\n          " + _vm._s(_vm.form.description || _vm.$t("圈子简介将显示在这里。")) + "\n        ")])]), _vm._v(" "), !_vm.id ? _c('section', {
    staticClass: "social-panel"
  }, [_c('h3', [_vm._v(_vm._s(_vm.$t("创建须知")))]), _vm._v(" "), _c('p', {
    staticClass: "social-muted"
  }, [_vm._v("\n          " + _vm._s(_vm.$t("账号注册满 30\n          天且无违规记录。圈子名称不能重复，申请通过后你将成为圈主。")) + "\n        ")])]) : _vm._e()])], 1)]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/social/CircleEditor.vue?vue&type=template&id=5a6cac56&scoped=true

// EXTERNAL MODULE: ./components/social/Workspace.vue + 5 modules
var Workspace = __webpack_require__(149);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/social/ImageUpload.vue?vue&type=template&id=54a14c0c
var ImageUploadvue_type_template_id_54a14c0c_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('el-upload', {
    staticClass: "social-image-upload",
    class: {
      wide: _vm.wide
    },
    attrs: {
      "action": "https://storage.codesocean.top/api/resource/upload?container=172018735018984",
      "headers": _vm.headers,
      "show-file-list": false,
      "before-upload": _vm.before,
      "on-success": _vm.success,
      "on-error": _vm.failure,
      "disabled": _vm.busy
    }
  }, [_vm.value ? _c('img', {
    attrs: {
      "src": _vm.value,
      "alt": _vm.$t('已上传图片')
    }
  }) : _c('span', [_c('i', {
    staticClass: "el-icon-plus"
  }), _c('br'), _vm._v(_vm._s(_vm.$t("上传图片")))]), _vm._v(" "), _vm.busy ? _c('div', {
    staticClass: "upload-progress"
  }, [_vm._v(_vm._s(_vm.$t("上传中…")))]) : _vm._e()]);
};
var ImageUploadvue_type_template_id_54a14c0c_staticRenderFns = [];

// CONCATENATED MODULE: ./components/social/ImageUpload.vue?vue&type=template&id=54a14c0c

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/social/ImageUpload.vue?vue&type=script&lang=js
/* harmony default export */ var ImageUploadvue_type_script_lang_js = ({
  props: {
    value: String,
    wide: Boolean
  },
  data: () => ({
    busy: false,
    headers: {
      ServiceKey: "a24785bedb466b9733dd317771d4b69c08da07fd"
    }
  }),
  methods: {
    before(file) {
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) || file.size > 5 * 1024 * 1024) {
        this.$message.error(this.$t("请选择 5MB 以内的 JPG、PNG、WebP 或 GIF 图片"));
        return false;
      }
      this.busy = true;
      return true;
    },
    success(result) {
      this.busy = false;
      if (result.data && result.data.resource_id) this.$emit("input", `https://storage.codesocean.top/api/resource/get/${result.data.resource_id}`);else this.$message.error(this.$t("图片上传失败，请重试"));
    },
    failure() {
      this.busy = false;
      this.$message.error(this.$t("图片上传失败，请重试"));
    }
  }
});
// CONCATENATED MODULE: ./components/social/ImageUpload.vue?vue&type=script&lang=js
 /* harmony default export */ var social_ImageUploadvue_type_script_lang_js = (ImageUploadvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/social/ImageUpload.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(258)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  social_ImageUploadvue_type_script_lang_js,
  ImageUploadvue_type_template_id_54a14c0c_render,
  ImageUploadvue_type_template_id_54a14c0c_staticRenderFns,
  false,
  injectStyles,
  null,
  "1a50bdf6"
  
)

/* harmony default export */ var ImageUpload = (component.exports);
// EXTERNAL MODULE: ./plugins/api/social.js
var social = __webpack_require__(26);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/social/CircleEditor.vue?vue&type=script&lang=js




/* harmony default export */ var CircleEditorvue_type_script_lang_js = ({
  components: {
    Workspace: Workspace["a" /* default */],
    ImageUpload: ImageUpload
  },
  props: {
    id: String
  },
  data: () => ({
    form: {
      name: "",
      description: "",
      rules: "",
      announcement: "",
      icon: "",
      bg_url: "",
      category_id: null
    },
    settings: {
      need_verification: 0,
      verification_questions: ""
    },
    role: 0,
    categories: [],
    loading: true,
    saving: false,
    error: "",
    snapshot: "",
    rules: {
      name: [{
        required: true,
        min: 2,
        max: 20,
        message: "名称需要 2-20 个字符",
        trigger: "blur"
      }],
      description: [{
        required: true,
        min: 10,
        max: 200,
        message: "简介需要 10-200 个字符",
        trigger: "blur"
      }],
      icon: [{
        required: true,
        message: "请上传圈子图标"
      }],
      category_id: [{
        required: true,
        message: "请选择圈子分类"
      }]
    }
  }),
  mounted() {
    this.load();
  },
  methods: {
    confirmLeave(next) {
      if (this.snapshot && this.snapshot !== JSON.stringify([this.form, this.settings])) this.$confirm(this.$t("更改尚未保存，确定离开？"), this.$t("离开编辑"), {
        type: "warning"
      }).then(() => next()).catch(() => next(false));else next();
    },
    async load() {
      if (!Object(reading["c" /* readingToken */])()) {
        this.$router.replace({
          path: "/login",
          query: {
            redirect: this.$route.fullPath
          }
        });
        return;
      }
      this.loading = true;
      this.error = "";
      try {
        if (this.id) {
          const [circle, mine] = await Promise.all([social["a" /* default */].circle(this.id), social["a" /* default */].myCircles()]);
          this.role = Number((mine.find(item => String(item.circle_id) === this.id) || {}).role) || 0;
          Object.keys(this.form).forEach(key => {
            this.form[key] = circle[key] || "";
          });
          if (this.role === 2) this.settings = {
            ...this.settings,
            ...(await social["a" /* default */].circleSettings(this.id))
          };
        } else this.categories = await social["a" /* default */].categories();
        this.snapshot = JSON.stringify([this.form, this.settings]);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    save() {
      if (this.saving) return;
      this.form.name = this.form.name.trim();
      this.form.description = this.form.description.trim();
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        this.saving = true;
        try {
          const payload = {
            ...this.form,
            name: this.form.name.trim(),
            description: this.form.description.trim()
          };
          if (this.id && this.role !== 2) delete payload.name;
          await social["a" /* default */].saveCircle(this.id, payload);
          if (this.id && this.role === 2) {
            try {
              await social["a" /* default */].saveCircleSettings(this.id, this.settings);
            } catch (error) {
              this.$message.error(this.$t("圈子资料已保存，但入圈设置未保存：{p0}", {
                p0: error.message
              }));
              return;
            }
          }
          this.snapshot = JSON.stringify([this.form, this.settings]);
          this.$message.success(this.id ? this.$t("圈子设置已保存") : this.$t("申请已提交，请等待审核"));
          this.$router.push(this.id ? `/community/circle/${this.id}` : "/community/circles");
        } catch (error) {
          this.$message.error(error.message);
        } finally {
          this.saving = false;
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./components/social/CircleEditor.vue?vue&type=script&lang=js
 /* harmony default export */ var social_CircleEditorvue_type_script_lang_js = (CircleEditorvue_type_script_lang_js); 
// CONCATENATED MODULE: ./components/social/CircleEditor.vue



function CircleEditor_injectStyles (context) {
  
  var style0 = __webpack_require__(260)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var CircleEditor_component = Object(componentNormalizer["a" /* default */])(
  social_CircleEditorvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  CircleEditor_injectStyles,
  "5a6cac56",
  "6ad15764"
  
)

/* harmony default export */ var CircleEditor = __webpack_exports__["a"] = (CircleEditor_component.exports);

/***/ }),

/***/ 605:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/circle/create.vue?vue&type=template&id=590fac22
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('CircleEditor', {
    ref: "editor"
  });
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/community/circle/create.vue?vue&type=template&id=590fac22

// EXTERNAL MODULE: ./components/social/CircleEditor.vue + 9 modules
var CircleEditor = __webpack_require__(280);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/circle/create.vue?vue&type=script&lang=js

/* harmony default export */ var createvue_type_script_lang_js = ({
  components: {
    CircleEditor: CircleEditor["a" /* default */]
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.editor.confirmLeave(next);
  },
  head: () => ({
    title: "创建圈子 - 原木社区"
  })
});
// CONCATENATED MODULE: ./pages/community/circle/create.vue?vue&type=script&lang=js
 /* harmony default export */ var circle_createvue_type_script_lang_js = (createvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/community/circle/create.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  circle_createvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  "357011e2"
  
)

/* harmony default export */ var create = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=create.js.map