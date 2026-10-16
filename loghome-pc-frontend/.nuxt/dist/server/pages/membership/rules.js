exports.ids = [40];
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

/***/ 332:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(453);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("d21783de", content, true, context)
};

/***/ }),

/***/ 452:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rules_vue_vue_type_style_index_0_id_2b2d33f4_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(332);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rules_vue_vue_type_style_index_0_id_2b2d33f4_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rules_vue_vue_type_style_index_0_id_2b2d33f4_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rules_vue_vue_type_style_index_0_id_2b2d33f4_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rules_vue_vue_type_style_index_0_id_2b2d33f4_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 453:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.rules-page[data-v-2b2d33f4] {\r\n  color: var(--ink, #382d25);\n}\n.rules-hero[data-v-2b2d33f4],\r\n.rules-section[data-v-2b2d33f4] {\r\n  background: var(--surface, #fffdf9);\r\n  border: 1px solid var(--line, #e9e0d5);\r\n  border-radius: 14px;\r\n  padding: 24px;\r\n  margin-bottom: 20px;\n}\n.rules-hero__marks[data-v-2b2d33f4],\r\n.price-grid[data-v-2b2d33f4] {\r\n  display: flex;\r\n  gap: 24px;\n}\n.rules-hero__marks img[data-v-2b2d33f4] {\r\n  width: 45px;\r\n  height: 45px;\r\n  object-fit: contain;\n}\n.rules-hero span[data-v-2b2d33f4] {\r\n  display: block;\r\n  margin: 12px 0;\r\n  line-height: 1.8;\n}\n.rules-hero__title[data-v-2b2d33f4] {\r\n  font-size: 24px;\r\n  font-weight: 700;\n}\n.rules-hero__eyebrow[data-v-2b2d33f4] {\r\n  font-size: 11px;\r\n  color: var(--wood, #947358);\n}\n.rules-hero__date[data-v-2b2d33f4] {\r\n  font-size: 12px;\r\n  color: var(--muted, #82766c);\n}\n.rules-section__heading[data-v-2b2d33f4] {\r\n  display: flex;\r\n  gap: 12px;\r\n  align-items: center;\r\n  font-size: 19px;\r\n  font-weight: 600;\r\n  margin-bottom: 20px;\n}\n.rules-section__heading > span[data-v-2b2d33f4] {\r\n  color: var(--wood, #947358);\n}\n.rules-section__heading div span[data-v-2b2d33f4] {\r\n  display: block;\n}\n.rules-section__heading div span[data-v-2b2d33f4]:last-child {\r\n  font-size: 13px;\r\n  color: var(--muted, #82766c);\r\n  font-weight: 400;\r\n  margin-top: 6px;\n}\n.price-card[data-v-2b2d33f4] {\r\n  flex: 1;\r\n  background: #f5eddf;\r\n  border-radius: 10px;\r\n  padding: 20px;\n}\n.price-card span[data-v-2b2d33f4] {\r\n  display: block;\r\n  margin-top: 8px;\r\n  font-size: 14px;\n}\n.price-card img[data-v-2b2d33f4] {\r\n  width: 40px;\r\n  height: 40px;\r\n  object-fit: contain;\n}\n.rule-list > div[data-v-2b2d33f4] {\r\n  display: flex;\r\n  gap: 10px;\r\n  font-size: 14px;\r\n  line-height: 1.9;\r\n  margin: 12px 0;\n}\n.rules-footer[data-v-2b2d33f4] {\r\n  font-size: 13px;\r\n  line-height: 1.9;\r\n  color: var(--muted, #82766c);\n}\n@media (max-width: 600px) {\n.price-grid[data-v-2b2d33f4] {\r\n    flex-direction: column;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 594:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/membership/rules.vue?vue&type=template&id=2b2d33f4&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('Workspace', {
    attrs: {
      "title": _vm.$t('通行证与红石规则'),
      "active": "/me"
    }
  }, [_c('div', {
    staticClass: "rules-content"
  }, [_c('div', {
    staticClass: "rules-hero"
  }, [_c('div', {
    staticClass: "rules-hero__marks"
  }, [_c('img', {
    attrs: {
      "src": "/social/membership/loghome-pass.png"
    }
  }), _vm._v(" "), _c('img', {
    attrs: {
      "src": "/social/icons/redstone.svg"
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "rules-hero__title"
  }, [_vm._v(_vm._s(_vm.$t("权益清晰，消费有据可查")))]), _vm._v(" "), _c('span', {
    staticClass: "rules-hero__description"
  }, [_vm._v(_vm._s(_vm.$t("以下规则适用于原木通行证、超级原木通行证及红石相关服务。")))]), _vm._v(" "), _c('span', {
    staticClass: "rules-hero__date"
  }, [_vm._v(_vm._s(_vm.$t("当前版本生效日期：2026 年 8 月 1 日")))])]), _vm._v(" "), _c('div', {
    staticClass: "rules-section"
  }, [_c('div', {
    staticClass: "rules-section__heading"
  }, [_c('span', [_vm._v("01")]), _vm._v(" "), _c('div', [_c('span', [_vm._v(_vm._s(_vm.$t("通行证方案")))]), _c('span', [_vm._v(_vm._s(_vm.$t("开通价格与有效期")))])])]), _vm._v(" "), _c('div', {
    staticClass: "price-grid"
  }, [_c('div', {
    staticClass: "price-card"
  }, [_c('img', {
    attrs: {
      "src": "/social/membership/loghome-pass.png"
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "price-card__name"
  }, [_vm._v(_vm._s(_vm.$t("原木通行证")))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.$t("月付 660 原木")))]), _c('span', [_vm._v(_vm._s(_vm.$t("年付 7200 原木")))])]), _vm._v(" "), _c('div', {
    staticClass: "price-card price-card--super"
  }, [_c('img', {
    attrs: {
      "src": "/social/membership/loghome-super-pass.png"
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "price-card__name"
  }, [_vm._v(_vm._s(_vm.$t("超级原木通行证")))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.$t("月付 880 原木")))]), _c('span', [_vm._v(_vm._s(_vm.$t("年付 9600 原木")))])])]), _vm._v(" "), _c('div', {
    staticClass: "rule-list"
  }, [_c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("月付按 30 天、年付按 365\n            天计算权益有效期，支付成功后立即生效。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("同档续费会从现有有效期末尾顺延；实际扣除和新到期日以确认页面及服务端结果为准。")))])])])]), _vm._v(" "), _c('div', {
    staticClass: "rules-section"
  }, [_c('div', {
    staticClass: "rules-section__heading"
  }, [_c('span', [_vm._v("02")]), _vm._v(" "), _c('div', [_c('span', [_vm._v(_vm._s(_vm.$t("升级与自动续费")))]), _c('span', [_vm._v(_vm._s(_vm.$t("状态随时可查、可管理")))])])]), _vm._v(" "), _c('div', {
    staticClass: "rule-list"
  }, [_c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("原木通行证升级至超级原木通行证，仅收取剩余有效天数对应的档位差价，到期日保持不变。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("超级原木通行证有效期内暂不支持降级；可在到期后重新选择通行证档位。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("开启自动续费后，将在到期时按当前订阅周期自动扣除原木；余额不足时续费失败，权益到期终止。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("关闭自动续费不会提前结束已生效权益，当前通行证仍可使用至到期日。")))])])])]), _vm._v(" "), _c('div', {
    staticClass: "rules-section"
  }, [_c('div', {
    staticClass: "rules-section__heading"
  }, [_c('span', [_vm._v("03")]), _vm._v(" "), _c('div', [_c('span', [_vm._v(_vm._s(_vm.$t("红石赠送")))]), _c('span', [_vm._v(_vm._s(_vm.$t("会员赠送与普通用户月赠")))])])]), _vm._v(" "), _c('div', {
    staticClass: "grant-grid"
  }, [_c('div', [_c('span', [_vm._v(_vm._s(_vm.$t("普通用户")))]), _c('span', [_vm._v("6")]), _c('span', [_vm._v(_vm._s(_vm.$t("红石 / 月")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v(_vm._s(_vm.$t("原木通行证")))]), _c('span', [_vm._v("100")]), _c('span', [_vm._v(_vm._s(_vm.$t("红石 / 周期")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v(_vm._s(_vm.$t("超级通行证")))]), _c('span', [_vm._v("200")]), _c('span', [_vm._v(_vm._s(_vm.$t("红石 / 周期")))])])]), _vm._v(" "), _c('div', {
    staticClass: "rule-list"
  }, [_c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("普通用户每个自然月赠送 6\n            红石；当月存在有效通行证时不重复领取普通用户月赠。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("月付通行证在开通及每次续费成功后赠送；年付通行证开通时先赠送一次，之后按月到账。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("标准版升级超级版时，当期按两档赠送标准的差额补赠红石。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("通行证赠送、升级补赠和普通用户月赠红石自到账日起 3\n            个月内有效。")))])])])]), _vm._v(" "), _c('div', {
    staticClass: "rules-section rules-section--redstone"
  }, [_c('div', {
    staticClass: "rules-section__heading"
  }, [_c('span', [_vm._v("04")]), _vm._v(" "), _c('div', [_c('span', [_vm._v(_vm._s(_vm.$t("红石兑换与消费")))]), _c('span', [_vm._v(_vm._s(_vm.$t("所有变动均记录账单")))])])]), _vm._v(" "), _c('div', {
    staticClass: "exchange-rate"
  }, [_c('img', {
    attrs: {
      "src": "/social/resources/log.png"
    }
  }), _c('span', [_vm._v(_vm._s(_vm.$t("10 原木")))]), _c('span', [_vm._v("=")]), _c('img', {
    attrs: {
      "src": "/social/icons/redstone.svg"
    }
  }), _c('span', [_vm._v(_vm._s(_vm.$t("1 红石")))])]), _vm._v(" "), _c('div', {
    staticClass: "usage-list"
  }, [_c('div', [_c('span', [_vm._v(_vm._s(_vm.$t("问问原木娘")))]), _c('span', [_vm._v(_vm._s(_vm.$t("普通 1 · 深度 2")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v(_vm._s(_vm.$t("笔泡 AI 助手")))]), _c('span', [_vm._v(_vm._s(_vm.$t("普通 1 · 深度 2 · 图像 5")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v(_vm._s(_vm.$t("文本纠错")))]), _c('span', [_vm._v(_vm._s(_vm.$t("普通免费 · 通行证智能免费 · 普通 2")))])])]), _vm._v(" "), _c('div', {
    staticClass: "rule-list"
  }, [_c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("发起付费 AI\n            操作即按页面显示数量扣除红石；红石不足时不会创建付费任务。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("消费时优先使用最早到期的赠送红石，再使用永久有效的兑换红石；原木兑换所得红石不会过期。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("同一任务断线重连或重复提交不会重复扣费。兑换、赠送与消费记录均可在红石中心查询。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("红石兑换比例和功能消耗如有调整，将以操作前页面展示为准。")))])])]), _vm._v(" "), _vm.aiAssistanceEnabled ? _c('div', {
    staticClass: "section-link",
    on: {
      "tap": _vm.gotoRedstone
    }
  }, [_c('span', [_vm._v(_vm._s(_vm.$t("前往红石中心")))]), _c('span', {
    staticClass: "ui-chevron",
    attrs: {
      "aria-hidden": "true"
    }
  })]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "rules-section"
  }, [_c('div', {
    staticClass: "rules-section__heading"
  }, [_c('span', [_vm._v("05")]), _vm._v(" "), _c('div', [_c('span', [_vm._v(_vm._s(_vm.$t("赠送与兑换码")))]), _c('span', [_vm._v(_vm._s(_vm.$t("权益发放至指定账号")))])])]), _vm._v(" "), _c('div', {
    staticClass: "rule-list"
  }, [_c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("赠送好友前请确认接收账号和通行证方案；赠送成功后，权益发放至所选好友账号。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("兑换码需在有效状态下使用。同一兑换码不可重复使用，具体档位与时长以兑换确认结果为准。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("已有通行证时，兑换权益会依据对应方案进行续期或升级。")))])])])]), _vm._v(" "), _c('div', {
    staticClass: "rules-section"
  }, [_c('div', {
    staticClass: "rules-section__heading"
  }, [_c('span', [_vm._v("06")]), _vm._v(" "), _c('div', [_c('span', [_vm._v(_vm._s(_vm.$t("会员专属功能")))]), _c('span', [_vm._v(_vm._s(_vm.$t("权益有效期间开放")))])])]), _vm._v(" "), _c('div', {
    staticClass: "rule-list"
  }, [_c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("定时发布仅限原木通行证及超级原木通行证会员使用，创建任务时会校验会员状态。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("主作者与一名协作者组成的双人协作作品免费；三人及以上协作需要主作者持有标准或超级原木通行证，否则协作者仅可预览作品，无法启用编辑、增删章节、排序和发布等其他权限。")))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v("•")]), _c('span', [_vm._v(_vm._s(_vm.$t("其他会员专属能力以对应功能页面标识为准；通行证到期后，未执行的新操作将不再享有会员权限。")))])])])]), _vm._v(" "), _c('div', {
    staticClass: "rules-note"
  }, [_vm._v("\n      " + _vm._s(_vm.$t("如页面展示与历史说明存在差异，以操作确认页、当前有效规则及服务端实际处理结果为准。")) + "\n    ")])])]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/membership/rules.vue?vue&type=template&id=2b2d33f4&scoped=true

// EXTERNAL MODULE: ./components/social/Workspace.vue + 5 modules
var Workspace = __webpack_require__(149);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/membership/rules.vue?vue&type=script&lang=js

/* harmony default export */ var rulesvue_type_script_lang_js = ({
  components: {
    Workspace: Workspace["a" /* default */]
  },
  head: () => ({
    title: "通行证与红石规则 - 原木社区"
  })
});
// CONCATENATED MODULE: ./pages/membership/rules.vue?vue&type=script&lang=js
 /* harmony default export */ var membership_rulesvue_type_script_lang_js = (rulesvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/membership/rules.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(452)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  membership_rulesvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "2b2d33f4",
  "44f70da7"
  
)

/* harmony default export */ var rules = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=rules.js.map