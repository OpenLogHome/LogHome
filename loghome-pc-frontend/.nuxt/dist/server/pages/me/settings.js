exports.ids = [33];
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

/***/ 327:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(443);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("01798daa", content, true, context)
};

/***/ }),

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(445);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("5849c249", content, true, context)
};

/***/ }),

/***/ 442:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiPreference_vue_vue_type_style_index_0_id_9fc02716_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(327);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiPreference_vue_vue_type_style_index_0_id_9fc02716_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiPreference_vue_vue_type_style_index_0_id_9fc02716_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiPreference_vue_vue_type_style_index_0_id_9fc02716_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiPreference_vue_vue_type_style_index_0_id_9fc02716_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 443:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.ai-preference[data-v-9fc02716] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  gap: 24px;\n}\n.ai-preference h2[data-v-9fc02716] {\r\n  font-size: 18px;\r\n  color: #6b553f;\r\n  margin: 0 0 12px;\n}\n.ai-preference p[data-v-9fc02716] {\r\n  font-size: 13px;\r\n  line-height: 1.8;\r\n  color: #978978;\r\n  margin: 0;\n}\n.ai-preference label[data-v-9fc02716] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 6px;\r\n  flex-shrink: 0;\r\n  font-size: 14px;\r\n  color: #839456;\r\n  cursor: pointer;\n}\n.ai-preference input[data-v-9fc02716] {\r\n  accent-color: #839456;\n}\n.ai-preference p.error[data-v-9fc02716] {\r\n  color: #b65341;\r\n  margin-top: 8px;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 444:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_id_6332c1a2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(328);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_id_6332c1a2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_id_6332c1a2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_id_6332c1a2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_settings_vue_vue_type_style_index_0_id_6332c1a2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 445:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".settings-page[data-v-6332c1a2]{width:100%;max-width:900px;margin:0 auto;padding:20px}.page-header[data-v-6332c1a2]{margin-bottom:16px}.page-header .back-link[data-v-6332c1a2]{font-size:14px;color:var(--wood, #947358)}.page-header .back-link .back-icon[data-v-6332c1a2]{margin-right:4px}.page-header .page-title[data-v-6332c1a2]{font-size:22px;color:#333;margin:12px 0 0}.settings-card[data-v-6332c1a2]{background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.06);padding:20px;margin-bottom:20px}.section-title[data-v-6332c1a2]{font-size:16px;color:#333;margin:0 0 16px;padding-left:10px;border-left:3px solid var(--wood, #947358)}.profile-form[data-v-6332c1a2]{max-width:460px}.image-settings[data-v-6332c1a2]{display:flex;flex-wrap:wrap;gap:30px;align-items:flex-end}.image-block[data-v-6332c1a2]{display:flex;flex-direction:column;align-items:flex-start;gap:10px}.image-block .image-label[data-v-6332c1a2]{font-size:13px;color:#666}.image-block .avatar-preview[data-v-6332c1a2]{width:88px;height:88px;border-radius:50%;object-fit:cover;background:#f5f5f5}.image-block.cover .cover-preview[data-v-6332c1a2]{width:320px;height:120px;object-fit:cover;border-radius:6px;background:#f5f5f5}.tip[data-v-6332c1a2]{margin:16px 0 0;font-size:12px;color:#999}.info-row[data-v-6332c1a2]{display:flex;align-items:center;padding:10px 0;border-bottom:1px solid #f5f5f5}.info-row[data-v-6332c1a2]:last-child{border-bottom:none}.info-row .label[data-v-6332c1a2]{width:90px;font-size:14px;color:#666}.info-row .value[data-v-6332c1a2]{flex:1;font-size:14px;color:#333}.friends-page[data-v-6332c1a2],.settings-page[data-v-6332c1a2],.post-detail-page[data-v-6332c1a2],.post-edit-container[data-v-6332c1a2]{padding:0 !important;max-width:none !important}.friends-card[data-v-6332c1a2],.settings-card[data-v-6332c1a2],.post-detail[data-v-6332c1a2],.comments-section[data-v-6332c1a2]{border:1px solid var(--line, #e9e0d5) !important;border-radius:14px !important;box-shadow:none !important;background:var(--surface, #fffdf9) !important}.post-detail-container[data-v-6332c1a2]{gap:22px !important}.post-detail-main[data-v-6332c1a2]{min-width:0}.post-detail-page[data-v-6332c1a2]{min-height:0 !important}.settings-links[data-v-6332c1a2]{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:24px}.settings-links a[data-v-6332c1a2]{font-size:14px;color:var(--wood)}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 558:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/settings.vue?vue&type=template&id=6332c1a2&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('Workspace', {
    attrs: {
      "title": _vm.$t('账号设置'),
      "active": "/me/settings"
    }
  }, [_c('div', {
    staticClass: "settings-page"
  }, [_vm.profileError ? _c('el-alert', {
    attrs: {
      "title": _vm.profileError,
      "type": "error",
      "closable": false
    }
  }) : _vm._e(), _vm._v(" "), _vm.profileError ? _c('el-button', {
    on: {
      "click": _vm.load
    }
  }, [_vm._v(_vm._s(_vm.$t("重新加载")))]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "settings-card settings-profile"
  }, [_c('h2', {
    staticClass: "section-title"
  }, [_vm._v(_vm._s(_vm.$t("个人资料")))]), _vm._v(" "), _c('el-form', {
    staticClass: "profile-form",
    attrs: {
      "disabled": !_vm.profileReady || _vm.savingProfile || !!_vm.uploading,
      "label-width": "90px",
      "size": "small"
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": _vm.$t('昵称')
    }
  }, [_c('el-input', {
    attrs: {
      "maxlength": "20",
      "show-word-limit": "",
      "placeholder": _vm.$t('请输入昵称')
    },
    model: {
      value: _vm.form.name,
      callback: function ($$v) {
        _vm.$set(_vm.form, "name", $$v);
      },
      expression: "form.name"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('个性签名')
    }
  }, [_c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 2,
      "maxlength": "30",
      "show-word-limit": "",
      "placeholder": _vm.$t('写点什么让别人认识你')
    },
    model: {
      value: _vm.form.motto,
      callback: function ($$v) {
        _vm.$set(_vm.form, "motto", $$v);
      },
      expression: "form.motto"
    }
  })], 1), _vm._v(" "), _c('el-form-item', [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.savingProfile
    },
    on: {
      "click": _vm.saveProfile
    }
  }, [_vm._v(_vm._s(_vm.$t("保存资料")))])], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "settings-card settings-language"
  }, [_c('h2', {
    staticClass: "section-title"
  }, [_vm._v(_vm._s(_vm.$t("语言 / Language")))]), _vm._v(" "), _c('el-select', {
    staticStyle: {
      "width": "min(100%, 280px)"
    },
    attrs: {
      "aria-label": _vm.$t('语言 / Language'),
      "value": _vm.$language.state.preference,
      "disabled": _vm.$language.state.saving
    },
    on: {
      "change": _vm.$language.set
    }
  }, [_c('el-option', {
    attrs: {
      "label": _vm.$t('跟随系统'),
      "value": "follow-system"
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": _vm.$t('简体中文'),
      "value": "zh-CN"
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": "English",
      "value": "en"
    }
  })], 1), _vm._v(" "), _vm.$language.state.syncError ? _c('div', {
    attrs: {
      "role": "status"
    }
  }, [_c('p', [_vm._v(_vm._s(_vm.$t("语言已在此设备生效，账号同步失败。")))]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "text",
      "loading": _vm.$language.state.saving
    },
    on: {
      "click": function ($event) {
        return _vm.$language.set(_vm.$language.state.preference);
      }
    }
  }, [_vm._v(_vm._s(_vm.$t("重试同步")))])], 1) : _vm._e()], 1), _vm._v(" "), _c('div', {
    staticClass: "settings-card settings-ai"
  }, [_c('ReaderAiPreference')], 1), _vm._v(" "), _c('div', {
    staticClass: "settings-card settings-appearance"
  }, [_c('div', {
    staticClass: "settings-appearance-heading"
  }, [_c('h2', {
    staticClass: "section-title"
  }, [_vm._v(_vm._s(_vm.$t("头像与封面")))]), _vm._v(" "), _c('nuxt-link', {
    attrs: {
      "to": "/me/frames"
    }
  }, [_vm._v(_vm._s(_vm.$t("头像挂件")) + " →")])], 1), _vm._v(" "), _c('div', {
    staticClass: "image-settings"
  }, [_c('div', {
    staticClass: "image-block"
  }, [_c('div', {
    staticClass: "image-label"
  }, [_vm._v(_vm._s(_vm.$t("头像")))]), _vm._v(" "), _c('img', {
    staticClass: "avatar-preview",
    attrs: {
      "src": _vm.form.avatar_url || '/default-avatar.png',
      "alt": _vm.$t('头像')
    },
    on: {
      "error": function ($event) {
        $event.target.src = '/default-avatar.png';
      }
    }
  }), _vm._v(" "), _c('el-upload', {
    attrs: {
      "action": "",
      "show-file-list": false,
      "auto-upload": false,
      "accept": "image/*",
      "on-change": file => _vm.handleImageChange(file, 'avatar')
    }
  }, [_c('el-button', {
    attrs: {
      "size": "mini",
      "loading": _vm.uploading === 'avatar'
    }
  }, [_vm._v(_vm._s(_vm.$t("更换头像")))])], 1)], 1), _vm._v(" "), _c('div', {
    staticClass: "image-block cover"
  }, [_c('div', {
    staticClass: "image-label"
  }, [_vm._v(_vm._s(_vm.$t("个人主页封面")))]), _vm._v(" "), _c('img', {
    staticClass: "cover-preview",
    attrs: {
      "src": _vm.form.top_pic_url || _vm.defaultCover,
      "alt": _vm.$t('封面')
    },
    on: {
      "error": function ($event) {
        $event.target.src = _vm.defaultCover;
      }
    }
  }), _vm._v(" "), _c('el-upload', {
    attrs: {
      "action": "",
      "show-file-list": false,
      "auto-upload": false,
      "accept": "image/*",
      "on-change": file => _vm.handleImageChange(file, 'cover')
    }
  }, [_c('el-button', {
    attrs: {
      "size": "mini",
      "loading": _vm.uploading === 'cover'
    }
  }, [_vm._v(_vm._s(_vm.$t("更换封面")))])], 1)], 1)]), _vm._v(" "), _c('p', {
    staticClass: "tip"
  }, [_vm._v("\n        " + _vm._s(_vm.$t("图片会被压缩后上传，建议 JPG/PNG，单张不超过 5MB。")) + "\n      ")])]), _vm._v(" "), _c('div', {
    directives: [{
      name: "loading",
      rawName: "v-loading",
      value: _vm.loadingPrivacy,
      expression: "loadingPrivacy"
    }],
    staticClass: "settings-card"
  }, [_c('h2', {
    staticClass: "section-title"
  }, [_vm._v(_vm._s(_vm.$t("隐私设置")))]), _vm._v(" "), _c('p', {
    staticClass: "tip"
  }, [_vm._v("\n        " + _vm._s(_vm.$t("账户级设置，保存后立即生效，并同步到所有设备。")) + "\n      ")]), _vm._v(" "), _vm.privacyReady ? _c('el-form', {
    attrs: {
      "label-position": "top",
      "size": "small"
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": _vm.$t('关注与粉丝列表')
    }
  }, [_c('el-select', {
    staticStyle: {
      "width": "100%"
    },
    attrs: {
      "disabled": _vm.savingPrivacy
    },
    model: {
      value: _vm.privacy.follow_list_visibility,
      callback: function ($$v) {
        _vm.$set(_vm.privacy, "follow_list_visibility", $$v);
      },
      expression: "privacy.follow_list_visibility"
    }
  }, _vm._l(_vm.listOptions, function (item) {
    return _c('el-option', {
      key: item.value,
      attrs: {
        "label": _vm.$t(item.label),
        "value": item.value
      }
    });
  }), 1), _vm._v(" "), _c('p', {
    staticClass: "tip"
  }, [_vm._v("\n            " + _vm._s(_vm.$t("本人始终可查看自己的列表，关注和粉丝数量仍公开。")) + "\n          ")])], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": _vm.$t('谁可以私信我')
    }
  }, [_c('el-select', {
    staticStyle: {
      "width": "100%"
    },
    attrs: {
      "disabled": _vm.savingPrivacy
    },
    model: {
      value: _vm.privacy.direct_message_policy,
      callback: function ($$v) {
        _vm.$set(_vm.privacy, "direct_message_policy", $$v);
      },
      expression: "privacy.direct_message_policy"
    }
  }, _vm._l(_vm.messageOptions, function (item) {
    return _c('el-option', {
      key: item.value,
      attrs: {
        "label": _vm.$t(item.label),
        "value": item.value
      }
    });
  }), 1), _vm._v(" "), _c('p', {
    staticClass: "tip"
  }, [_vm._v("\n            " + _vm._s(_vm.$t("默认允许所有已登录用户私信；“我关注的人”指你已关注的发件人。历史消息不受影响。")) + "\n          ")])], 1), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.savingPrivacy,
      "disabled": !_vm.privacyChanged
    },
    on: {
      "click": _vm.savePrivacy
    }
  }, [_vm._v(_vm._s(_vm.$t("保存隐私设置")))])], 1) : !_vm.loadingPrivacy ? _c('el-alert', {
    attrs: {
      "title": _vm.$t('隐私设置加载失败，请重试'),
      "type": "error",
      "closable": false
    }
  }) : _vm._e(), _vm._v(" "), !_vm.loadingPrivacy && !_vm.privacyReady ? _c('el-button', {
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.loadPrivacy
    }
  }, [_vm._v(_vm._s(_vm.$t("重新加载")))]) : _vm._e()], 1), _vm._v(" "), _c('div', {
    staticClass: "settings-card"
  }, [_c('h2', {
    staticClass: "section-title"
  }, [_vm._v(_vm._s(_vm.$t("账号信息")))]), _vm._v(" "), _c('div', {
    staticClass: "info-row"
  }, [_c('span', {
    staticClass: "label"
  }, [_vm._v(_vm._s(_vm.$t("用户 ID")))]), _vm._v(" "), _c('span', {
    staticClass: "value"
  }, [_vm._v(_vm._s(_vm.user.user_id))])]), _vm._v(" "), _c('div', {
    staticClass: "info-row"
  }, [_c('span', {
    staticClass: "label"
  }, [_vm._v(_vm._s(_vm.$t("注册时间")))]), _vm._v(" "), _c('span', {
    staticClass: "value"
  }, [_vm._v(_vm._s(_vm.formatDate(_vm.user.register_time)))])]), _vm._v(" "), _c('div', {
    staticClass: "info-row"
  }, [_c('span', {
    staticClass: "label"
  }, [_vm._v(_vm._s(_vm.$t("邮箱")))]), _vm._v(" "), _c('span', {
    staticClass: "value"
  }, [_vm._v(_vm._s(_vm.emailBound ? _vm.user.email : _vm.$t("未绑定")))]), _vm._v(" "), _c('el-button', {
    attrs: {
      "size": "mini",
      "type": "text"
    },
    on: {
      "click": function ($event) {
        return _vm.$router.push('/me/security');
      }
    }
  }, [_vm._v("\n          " + _vm._s(_vm.$t(_vm.emailBound ? "更换邮箱" : "绑定邮箱")) + "\n        ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "info-row"
  }, [_c('span', {
    staticClass: "label"
  }, [_vm._v(_vm._s(_vm.$t("密码")))]), _vm._v(" "), _c('span', {
    staticClass: "value"
  }, [_vm._v("••••••")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "size": "mini",
      "type": "text"
    },
    on: {
      "click": function ($event) {
        return _vm.$router.push('/me/security');
      }
    }
  }, [_vm._v(_vm._s(_vm.$t("修改密码")))])], 1)])], 1), _vm._v(" "), _c('div', {
    staticClass: "settings-session"
  }, [_c('el-button', {
    attrs: {
      "type": "danger",
      "plain": "",
      "size": "small"
    },
    on: {
      "click": _vm.logoutAccount
    }
  }, [_vm._v(_vm._s(_vm.$t("退出登录")))])], 1)]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/me/settings.vue?vue&type=template&id=6332c1a2&scoped=true

// EXTERNAL MODULE: ./components/social/Workspace.vue + 5 modules
var Workspace = __webpack_require__(149);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderAiPreference.vue?vue&type=template&id=9fc02716&scoped=true
var ReaderAiPreferencevue_type_template_id_9fc02716_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "ai-preference"
  }, [_vm._ssrNode("<div data-v-9fc02716><h2 data-v-9fc02716>" + _vm._ssrEscape(_vm._s(_vm.$t("AI 辅助功能"))) + "</h2> " + (_vm.error ? "<p role=\"alert\" class=\"error\" data-v-9fc02716>" + _vm._ssrEscape(_vm._s(_vm.$t(_vm.error))) + "</p>" : "<!---->") + "</div> <label data-v-9fc02716><input type=\"checkbox\"" + _vm._ssrAttr("disabled", !_vm.ready) + _vm._ssrAttr("checked", _vm.enabled) + " data-v-9fc02716>" + _vm._ssrEscape("\n    " + _vm._s(_vm.$t(_vm.enabled ? "已开启" : "已关闭"))) + "</label>")]);
};
var ReaderAiPreferencevue_type_template_id_9fc02716_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderAiPreference.vue?vue&type=template&id=9fc02716&scoped=true

// EXTERNAL MODULE: ./utils/reader-ai.js
var reader_ai = __webpack_require__(42);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderAiPreference.vue?vue&type=script&lang=js

/* harmony default export */ var ReaderAiPreferencevue_type_script_lang_js = ({
  data: () => ({
    ready: false,
    enabled: false,
    error: ""
  }),
  mounted() {
    this.sync();
    this.ready = true;
    window.addEventListener("storage", this.sync);
    window.addEventListener(reader_ai["a" /* AI_PREFERENCE_EVENT */], this.sync);
  },
  beforeDestroy() {
    window.removeEventListener("storage", this.sync);
    window.removeEventListener(reader_ai["a" /* AI_PREFERENCE_EVENT */], this.sync);
  },
  methods: {
    sync() {
      this.enabled = !Object(reader_ai["m" /* readerAiDisabled */])();
    },
    change(enabled) {
      try {
        Object(reader_ai["o" /* setReaderAiDisabled */])(!enabled);
        this.enabled = enabled;
        this.error = "";
      } catch (_) {
        this.error = "设置未能保存，请检查浏览器存储权限后重试。";
        this.sync();
        this.$forceUpdate();
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderAiPreference.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderAiPreferencevue_type_script_lang_js = (ReaderAiPreferencevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderAiPreference.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(442)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderAiPreferencevue_type_script_lang_js,
  ReaderAiPreferencevue_type_template_id_9fc02716_scoped_true_render,
  ReaderAiPreferencevue_type_template_id_9fc02716_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "9fc02716",
  "5ea1a084"
  
)

/* harmony default export */ var ReaderAiPreference = (component.exports);
// EXTERNAL MODULE: ./plugins/api/account.js
var account = __webpack_require__(154);

// EXTERNAL MODULE: ./mixins/account-page.js
var account_page = __webpack_require__(155);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/me/settings.vue?vue&type=script&lang=js





/* harmony default export */ var settingsvue_type_script_lang_js = ({
  components: {
    Workspace: Workspace["a" /* default */],
    ReaderAiPreference: ReaderAiPreference
  },
  mixins: [account_page["a" /* default */]],
  layout: "default",
  data() {
    return {
      user: {},
      profileError: "",
      profileReady: false,
      originalProfile: null,
      form: {
        name: "",
        motto: "",
        avatar_url: "",
        top_pic_url: ""
      },
      defaultCover: "https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg",
      savingProfile: false,
      privacy: {
        follow_list_visibility: "public",
        direct_message_policy: "default"
      },
      privacyOriginal: "",
      privacyReady: false,
      loadingPrivacy: true,
      savingPrivacy: false,
      listOptions: [{
        value: "public",
        label: "全部公开"
      }, {
        value: "following_only",
        label: "仅公开关注列表"
      }, {
        value: "fans_only",
        label: "仅公开粉丝列表"
      }, {
        value: "private",
        label: "全部私密"
      }],
      messageOptions: [{
        value: "default",
        label: "默认"
      }, {
        value: "following",
        label: "我关注的人"
      }, {
        value: "mutual",
        label: "互相关注的人"
      }, {
        value: "none",
        label: "禁止私信"
      }],
      uploading: null
    };
  },
  computed: {
    privacyChanged() {
      return JSON.stringify(this.privacy) !== this.privacyOriginal;
    },
    emailBound() {
      return !!this.user.email && this.user.email !== "unbind";
    }
  },
  async beforeRouteLeave(to, from, next) {
    if (Object(reading["c" /* readingToken */])() !== this.accountToken) return next();
    if (this.savingProfile || this.savingPrivacy || this.uploading) {
      this.$message.info(this.$t("设置正在保存，请稍候"));
      return next(false);
    }
    if ((!this.profileReady || this.profileSnapshot() === this.originalProfile) && (!this.privacyReady || !this.privacyChanged)) return next();
    try {
      await this.$confirm(this.$t("更改尚未保存，确定离开？"), this.$t("离开编辑"), {
        confirmButtonText: this.$t("离开"),
        cancelButtonText: this.$t("继续编辑")
      });
      next();
    } catch (_) {
      next(false);
    }
  },
  methods: {
    async load() {
      this.profileError = "";
      this.profileReady = false;
      try {
        await this.refreshUser();
      } catch (error) {
        this.profileError = error.message || this.$t("获取用户信息失败");
      }
      this.loadPrivacy();
    },
    profileSnapshot() {
      return JSON.stringify({
        name: this.form.name,
        motto: this.form.motto
      });
    },
    sameAccount() {
      return !!this.accountToken && this.accountToken === Object(reading["c" /* readingToken */])();
    },
    async logoutAccount() {
      try {
        await this.$confirm(this.$t("确定退出当前账号？"), this.$t("退出登录"));
        localStorage.removeItem("token");
        localStorage.removeItem("LogHomeUserInfo");
        window.dispatchEvent(new Event("auth-state-changed"));
        this.$router.push("/login");
      } catch (_) {}
    },
    async loadPrivacy() {
      this.loadingPrivacy = true;
      this.privacyReady = false;
      try {
        const token = Object(reading["c" /* readingToken */])();
        const privacy = await this.$api.users.getPrivacySettings();
        if (token !== Object(reading["c" /* readingToken */])()) return;
        this.privacy = privacy;
        this.privacyOriginal = JSON.stringify(this.privacy);
        this.privacyReady = true;
      } catch (error) {
        this.$message.error(error.message || this.$t("隐私设置加载失败"));
      } finally {
        this.loadingPrivacy = false;
      }
    },
    async savePrivacy() {
      if (!this.privacyReady || this.savingPrivacy || !this.privacyChanged || !this.sameAccount()) return;
      this.savingPrivacy = true;
      try {
        const token = Object(reading["c" /* readingToken */])();
        const privacy = await this.$api.users.savePrivacySettings(this.privacy);
        if (token !== Object(reading["c" /* readingToken */])()) return;
        this.privacy = privacy;
        this.privacyOriginal = JSON.stringify(this.privacy);
        this.$message.success(this.$t("隐私设置已保存"));
      } catch (error) {
        this.$message.error(error.message || this.$t("保存失败，请稍后重试"));
      } finally {
        this.savingPrivacy = false;
      }
    },
    async refreshUser(keepDraft = false) {
      const user = await account["b" /* default */].profile();
      if (!this.sameAccount()) return;
      this.user = user;
      if (!keepDraft) {
        this.form.name = user.name || "";
        this.form.motto = user.motto || "";
      }
      this.form.avatar_url = user.avatar_url || "";
      this.form.top_pic_url = user.top_pic_url || "";
      this.originalProfile = JSON.stringify({
        name: user.name || "",
        motto: user.motto || ""
      });
      this.profileReady = true;
    },
    async saveProfile() {
      if (this.savingProfile || !this.profileReady || !this.sameAccount()) return;
      const name = (this.form.name || "").trim();
      if (!name) {
        this.$message.warning(this.$t("昵称不能为空"));
        return;
      }
      this.savingProfile = true;
      try {
        const response = await this.$api.users.updateUserInfo(name, (this.form.motto || "").trim());
        if (!this.sameAccount()) return;
        if (response.code !== 0) throw new Error(response.message || "保存失败");
        this.$message.success(this.$t("资料已更新"));
        await this.refreshUser();
      } catch (error) {
        console.error("保存资料失败", error);
        this.$message.error(error.message || this.$t("保存失败，请稍后重试"));
      } finally {
        this.savingProfile = false;
      }
    },
    async handleImageChange(file, type) {
      if (this.uploading || this.savingProfile || !this.profileReady || !this.sameAccount()) return;
      const raw = file.raw || file;
      if (!raw || !raw.type.startsWith("image/")) {
        this.$message.warning(this.$t("请选择图片文件"));
        return;
      }
      if (raw.size > 5 * 1024 * 1024) {
        this.$message.warning(this.$t("图片过大，请选择 5MB 以内的图片"));
        return;
      }
      this.uploading = type;
      try {
        const img = await this.readAndResize(raw, type === "avatar" ? 512 : 1600);
        if (!this.sameAccount()) return;
        const response = type === "avatar" ? await this.$api.users.changeAvatar(img) : await this.$api.users.changeTopCover(img);
        if (!this.sameAccount()) return;
        if (response.code !== 0) throw new Error(response.message || "上传失败");
        this.$message.success(type === "avatar" ? this.$t("头像已更新") : this.$t("封面已更新"));
        await this.refreshUser(true);
      } catch (error) {
        console.error("上传图片失败", error);
        this.$message.error(error.message || this.$t("上传失败，请稍后重试"));
      } finally {
        this.uploading = null;
      }
    },
    // 上传接口只接收 base64，先在本地把大图压到合适尺寸
    readAndResize(file, maxSize) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("读取文件失败"));
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => reject(new Error("图片解析失败"));
          image.onload = () => {
            const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));
            canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          };
          image.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    },
    formatDate(value) {
      if (!value) return "-";
      const date = new Date(value);
      if (isNaN(date.getTime())) return "-";
      const pad = n => n < 10 ? `0${n}` : `${n}`;
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
  },
  head() {
    return {
      title: "账号设置 - 原木社区"
    };
  }
});
// CONCATENATED MODULE: ./pages/me/settings.vue?vue&type=script&lang=js
 /* harmony default export */ var me_settingsvue_type_script_lang_js = (settingsvue_type_script_lang_js); 
// CONCATENATED MODULE: ./pages/me/settings.vue



function settings_injectStyles (context) {
  
  var style0 = __webpack_require__(444)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var settings_component = Object(componentNormalizer["a" /* default */])(
  me_settingsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  settings_injectStyles,
  "6332c1a2",
  "72ede021"
  
)

/* harmony default export */ var settings = __webpack_exports__["default"] = (settings_component.exports);

/***/ })

};;
//# sourceMappingURL=settings.js.map