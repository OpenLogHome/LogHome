exports.ids = [14];
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

/***/ 150:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/ui/SiteIcon.vue?vue&type=template&id=6a890970&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('svg', {
    staticClass: "site-icon",
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 256 256",
      "fill": "currentColor",
      "aria-hidden": "true",
      "focusable": "false"
    }
  }, [_vm._ssrNode(_vm._ssrList(_vm.paths, function (path, index) {
    return "<path" + _vm._ssrAttr("d", path) + " data-v-6a890970></path>";
  }))]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/ui/SiteIcon.vue?vue&type=template&id=6a890970&scoped=true

// CONCATENATED MODULE: ./assets/icons/phosphor-glyphs.js
// Official Phosphor SVG paths, regular weight (heartFilled uses fill).
// Source: https://github.com/phosphor-icons/core/tree/2b75f3ad12b420c9504ef05df8d2564a28f8500e
// MIT license: ./PHOSPHOR-LICENSE.txt. No runtime downloads.
/* harmony default export */ var phosphor_glyphs = ({
  "heart": ["M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"],
  "heartFilled": ["M240,102c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,228.66,16,172,16,102A62.07,62.07,0,0,1,78,40c20.65,0,38.73,8.88,50,23.89C139.27,48.88,157.35,40,178,40A62.07,62.07,0,0,1,240,102Z"],
  "smiley": ["M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"],
  "image": ["M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"],
  "inbox": ["M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,16V152h-28.7A15.86,15.86,0,0,0,168,156.69L148.69,176H107.31L88,156.69A15.86,15.86,0,0,0,76.69,152H48V48Zm0,160H48V168H76.69L96,187.31A15.86,15.86,0,0,0,107.31,192h41.38A15.86,15.86,0,0,0,160,187.31L179.31,168H208v40Z"],
  "warning": ["M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"],
  "edit": ["M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM136,75.31,152.69,92,68,176.69,51.31,160ZM48,208V179.31L76.69,208Zm48-3.31L79.32,188,164,103.31,180.69,120Zm96-96L147.32,64l24-24L216,84.69Z"],
  "sparkle": ["M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z"],
  "comment": ["M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"]
});
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/ui/SiteIcon.vue?vue&type=script&lang=js

/* harmony default export */ var SiteIconvue_type_script_lang_js = ({
  name: 'SiteIcon',
  props: {
    name: {
      type: String,
      required: true,
      validator: name => Object.prototype.hasOwnProperty.call(phosphor_glyphs, name)
    },
    filled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    paths() {
      return phosphor_glyphs[this.filled && phosphor_glyphs[`${this.name}Filled`] ? `${this.name}Filled` : this.name] || [];
    }
  }
});
// CONCATENATED MODULE: ./components/ui/SiteIcon.vue?vue&type=script&lang=js
 /* harmony default export */ var ui_SiteIconvue_type_script_lang_js = (SiteIconvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/ui/SiteIcon.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(157)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  ui_SiteIconvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "6a890970",
  "1e2053a0"
  
)

/* harmony default export */ var SiteIcon = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(158);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("ca2f1c12", content, true, context)
};

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

/***/ 153:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export currentCommentUserId */
/* unused harmony export canModerateComment */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getMangaCommentErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return fetchMangaComments; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return fetchMangaCommentById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return fetchMangaCommentAmount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return fetchMangaArticleCommentAmounts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return publishMangaComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return replyMangaComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return praiseMangaComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return deleteMangaComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return uploadMangaCommentImage; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);


// 漫画作品与话数在数据模型上就是 novels / articles，评论直接复用社区的书评接口，
// 作品级评论 article_id 传 0、话评传对应的 article_id，paragraph_id 固定 -1（漫画没有划线段落）。
const ROOT_COMMENT = {
  article_id: 0,
  paragraph_id: -1
};

// 评论配图沿用书评的图片容器与服务密钥
const IMAGE_UPLOAD_URL = 'https://storage.codesocean.top/api/resource/upload?container=172018735018984';
const IMAGE_RESOURCE_URL = 'https://storage.codesocean.top/api/resource/get/';
const IMAGE_SERVICE_KEY = 'a24785bedb466b9733dd317771d4b69c08da07fd';
function readStoredSession() {
  let value = null;
  try {
    if (typeof window !== 'undefined') value = window.localStorage.getItem('token');
    if (typeof value === 'string') value = JSON.parse(value);
  } catch (error) {
    return {};
  }
  return value && typeof value === 'object' ? value : {};
}
function authHeaders() {
  const token = readStoredSession().tk;
  if (!token) throw new Error('请先登录后再操作');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}
function optionalAuthHeaders() {
  const token = readStoredSession().tk;
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`
  };
}
function currentCommentUserId() {
  return readStoredSession().id;
}
function canModerateComment(comment) {
  const userId = currentCommentUserId();
  if (!userId) return false;
  return String(comment.userId) === String(userId) || String(comment.workAuthorId) === String(userId);
}
function getMangaCommentErrorMessage(error, fallback = '评论暂时不可用') {
  const data = error && error.response && error.response.data;
  if (data && (data.message || data.msg)) return data.message || data.msg;
  return error && error.message ? error.message : fallback;
}
function parseMediaUrls(value) {
  let parsed = value;
  try {
    if (typeof value === 'string') parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(url => typeof url === 'string' && /^https?:\/\//i.test(url)) : [];
  } catch (error) {
    return [];
  }
}
function formatCommentTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  // 后端以 UTC 序列化，展示时换算为东八区墙上时间，与书评保持一致
  const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const pad = input => String(input).padStart(2, '0');
  return `${beijing.getUTCFullYear()}-${pad(beijing.getUTCMonth() + 1)}-${pad(beijing.getUTCDate())} ${pad(beijing.getUTCHours())}:${pad(beijing.getUTCMinutes())}`;
}
function toReplyViewModel(reply, namesByCommentId, workAuthorId) {
  return {
    commentId: reply.essay_comment_id,
    userId: reply.user_id,
    userName: reply.name,
    targetUserName: namesByCommentId[reply.reply_to_id] || '',
    content: reply.content,
    images: parseMediaUrls(reply.media_urls),
    time: formatCommentTime(reply.comment_time),
    canModerate: canModerateComment({
      userId: reply.user_id,
      workAuthorId
    })
  };
}
function toCommentViewModel(item, praiseTypeMap) {
  const replies = Array.isArray(item.replies) ? item.replies : [];
  const namesByCommentId = {
    [item.essay_comment_id]: item.name
  };
  for (const reply of replies) namesByCommentId[reply.essay_comment_id] = reply.name;
  const praiseType = Object.prototype.hasOwnProperty.call(praiseTypeMap, item.essay_comment_id) ? Number(praiseTypeMap[item.essay_comment_id]) : 3;
  return {
    commentId: item.essay_comment_id,
    userId: item.user_id,
    novelId: item.novel_id,
    userName: item.name,
    avatarUrl: item.avatar_url,
    avatarFrame: item.avatar_frame || null,
    workAuthorId: item.author_id,
    content: item.content,
    images: parseMediaUrls(item.media_urls),
    time: formatCommentTime(item.comment_time),
    likeNum: Math.max(Number(item.likeNum) || 0, praiseType === 0 ? 1 : 0),
    praiseType,
    articleId: Number(item.article_id) || 0,
    paragraphId: item.cento ? Number(item.cento.paragraph_id) || 0 : 0,
    articleTitle: item.article_title || '',
    excerpt: item.cento && item.cento.paragraph ? item.cento.paragraph : '',
    replies: replies.map(reply => toReplyViewModel(reply, namesByCommentId, item.author_id)),
    canModerate: canModerateComment({
      userId: item.user_id,
      workAuthorId: item.author_id
    })
  };
}
async function fetchPraiseTypeMap(baseUrl, commentIds) {
  if (!commentIds.length) return {};
  const headers = optionalAuthHeaders();
  if (!headers) return {};
  try {
    const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/get_comment_praise_statuses`, {
      params: {
        comment_ids: commentIds.join(',')
      },
      headers
    });
    const praiseTypeMap = {};
    for (const item of response.data || []) praiseTypeMap[item.novel_comment_id] = item.type;
    return praiseTypeMap;
  } catch (error) {
    return {};
  }
}
async function fetchMangaComments(baseUrl, options) {
  const {
    novelId,
    articleId,
    paragraphId,
    page = 1,
    pageSize = 10
  } = options;
  const params = {
    id: novelId,
    page,
    pageSize
  };
  if (articleId !== undefined && articleId !== null && articleId !== 0) params.articleId = articleId;
  if (Number(articleId) > 0 && Number(paragraphId) > 0) params.paragraphId = Number(paragraphId);
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/novel_commonts_all_fast`, {
    params
  });
  const rows = Array.isArray(response.data) ? response.data : [];
  const praiseTypeMap = await fetchPraiseTypeMap(baseUrl, rows.map(item => item.essay_comment_id));
  return rows.map(item => toCommentViewModel(item, praiseTypeMap));
}

// A notification may target a root or reply. The server resolves its root and scope.
async function fetchMangaCommentById(baseUrl, commentId) {
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/novel_comment_from_comment_id`, {
    params: {
      comment_id: commentId
    }
  });
  const item = (response.data || [])[0];
  if (!item) return null;
  const replies = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/novel_commonts_reply_to`, {
    params: {
      id: item.essay_comment_id
    }
  }).then(replyResponse => Array.isArray(replyResponse.data) ? replyResponse.data : []);
  item.replies = replies;
  const praiseTypeMap = await fetchPraiseTypeMap(baseUrl, [item.essay_comment_id]);
  return toCommentViewModel(item, praiseTypeMap);
}
async function fetchMangaCommentAmount(baseUrl, novelId, articleId, paragraphId) {
  const params = {
    id: novelId
  };
  if (articleId !== undefined && articleId !== null && articleId !== 0) params.articleId = articleId;
  if (Number(articleId) > 0 && Number(paragraphId) > 0) params.paragraphId = Number(paragraphId);
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/novel_commonts_amount`, {
    params
  });
  const row = (response.data || [])[0] || {};
  return Number(row['COUNT(*)']) || 0;
}

// 目录角标用：一次取回各话评论数，返回 { [article_id]: amount }
async function fetchMangaArticleCommentAmounts(baseUrl, novelId) {
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/novel_articles_comment_amounts`, {
    params: {
      id: novelId
    }
  });
  const amounts = {};
  for (const row of response.data || []) amounts[row.article_id] = Number(row.amount) || 0;
  return amounts;
}
async function publishMangaComment(baseUrl, options) {
  const {
    novelId,
    articleId,
    paragraphId,
    content,
    images = []
  } = options;
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(`${baseUrl}/community/comment_on_novel`, {
    novel_id: novelId,
    content,
    media_urls: images,
    ...(articleId ? {
      article_id: articleId,
      paragraph_id: Number(paragraphId) > 0 ? Number(paragraphId) : -1
    } : ROOT_COMMENT)
  }, {
    headers: authHeaders()
  });
  return toCommentViewModel({
    ...response.data,
    replies: [],
    likeNum: 0
  }, {});
}
async function replyMangaComment(baseUrl, options) {
  const {
    novelId,
    articleId,
    rootCommentId,
    replyToCommentId,
    content,
    images = []
  } = options;
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(`${baseUrl}/community/reply_to_novel_comment`, {
    novel_id: novelId,
    // essay_comment_id 是被回复的那一条，fatherId 是所属的根评论
    essay_comment_id: replyToCommentId,
    fatherId: rootCommentId,
    article_id: articleId || 0,
    content,
    media_urls: images
  }, {
    headers: authHeaders()
  });
  return response.data;
}
async function praiseMangaComment(baseUrl, commentId, type) {
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(`${baseUrl}/community/praise_on_comment`, {
    essay_comment_id: commentId,
    type
  }, {
    headers: authHeaders()
  });
  return response.data;
}
async function deleteMangaComment(baseUrl, commentId) {
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/delete_comment`, {
    params: {
      id: commentId
    },
    headers: authHeaders()
  });
  return response.data;
}

// 浏览器端配图上传：接收 File/Blob，走 FormData，返回可访问的资源 URL
async function uploadMangaCommentImage(file) {
  const form = new FormData();
  form.append('file', file);
  const response = await fetch(IMAGE_UPLOAD_URL, {
    method: 'POST',
    headers: {
      ServiceKey: IMAGE_SERVICE_KEY
    },
    body: form
  });
  if (!response.ok) throw new Error('图片上传失败，请稍后重试');
  const data = await response.json();
  const id = data && data.data && data.data.resource_id;
  if (!id || !/^[a-zA-Z0-9_-]{1,100}$/.test(String(id))) throw new Error('图片上传结果无效，请重试');
  return IMAGE_RESOURCE_URL + id;
}

/***/ }),

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return stickerUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return stickerUserId; });
/* unused harmony export readerSticker */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return fetchReaderStickers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return favoriteReaderSticker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return privacyReaderSticker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return deleteReaderSticker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createReaderSticker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return saveImageAsReaderSticker; });
/* harmony import */ var _plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

const ROOT = '/community/stickers';
function stickerUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
  } catch (_) {
    return '';
  }
}
function stickerUserId() {
  try {
    return Number(JSON.parse(localStorage.getItem('token') || '{}').id) || 0;
  } catch (_) {
    return 0;
  }
}
function readerSticker(raw) {
  const id = Number(raw && raw.sticker_id),
    url = stickerUrl(raw && raw.url);
  if (!Number.isSafeInteger(id) || id <= 0 || !url) return null;
  return {
    ...raw,
    sticker_id: id,
    url,
    user_id: Number(raw.user_id) || 0,
    is_private: raw.is_private === true || Number(raw.is_private) === 1,
    is_favorite: raw.is_favorite === true || Number(raw.is_favorite) === 1
  };
}
function checkAccount(token) {
  if (!token) throw new Error('请先登录后使用表情包');
  if (Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])() !== token) throw new Error('账号已变化，请重新操作');
}
async function request(path = '', {
  params = {},
  method = 'GET',
  body
} = {}, token = Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])()) {
  checkAccount(token);
  return Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingRequest */ "b"])(ROOT + path, params, {
    method,
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}
async function fetchReaderStickers({
  favorites = false,
  category = 'all',
  page = 1,
  url
} = {}, token = Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])()) {
  const data = await request(favorites ? '/favorites' : '', {
    params: {
      category: ['all', 'my', 'public', 'logwood'].includes(category) ? category : 'all',
      page,
      limit: 20,
      ...(url ? {
        url
      } : {})
    }
  }, token);
  const items = (Array.isArray(data) ? data : Array.isArray(data.stickers) ? data.stickers : []).map(readerSticker).filter(Boolean);
  const pagination = data.pagination || {};
  return {
    items,
    pages: Math.max(1, Number(pagination.pages) || 1),
    total: Math.max(0, Number(pagination.total) || items.length)
  };
}
const favoriteReaderSticker = (id, favorite, token) => request(favorite ? '/favorites' : `/favorites/${Number(id)}`, {
  method: favorite ? 'POST' : 'DELETE',
  body: favorite ? {
    sticker_id: Number(id)
  } : undefined
}, token);
const privacyReaderSticker = (id, isPrivate, token) => request(`/${Number(id)}`, {
  method: 'PUT',
  body: {
    is_private: !!isPrivate
  }
}, token);
const deleteReaderSticker = (id, token) => request(`/${Number(id)}`, {
  method: 'DELETE'
}, token);
async function createReaderSticker(url, isPrivate = false, token = Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])()) {
  const safe = stickerUrl(url);
  if (!safe) throw new Error('图片地址无效');
  const data = await request('', {
    method: 'POST',
    body: {
      url: safe,
      is_private: !!isPrivate
    }
  }, token);
  const sticker = readerSticker(data);
  if (!sticker) throw new Error('表情包保存结果无效，请刷新确认');
  return sticker;
}
async function saveImageAsReaderSticker(url, token = Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])()) {
  const safe = stickerUrl(url);
  if (!safe) throw new Error('图片地址无效');
  const {
    items
  } = await fetchReaderStickers({
    url: safe
  }, token);
  checkAccount(token);
  let sticker = items.find(item => !item.is_private || item.user_id === stickerUserId());
  if (!sticker) sticker = await createReaderSticker(safe, false, token);
  checkAccount(token);
  if (!sticker.is_favorite) {
    try {
      await favoriteReaderSticker(sticker.sticker_id, true, token);
    } catch (error) {
      if (!/已收藏/.test(error.message)) throw error;
    }
  }
  return sticker;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URL"]))

/***/ }),

/***/ 157:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(151);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.site-icon[data-v-6a890970] { display: inline-block; width: 1.125em; height: 1.125em; flex: none; vertical-align: -0.18em;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


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

/***/ 164:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(178);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("7e210ac6", content, true, context)
};

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

/***/ 176:
/***/ (function(module) {

module.exports = JSON.parse("[\"😀\",\"😃\",\"😄\",\"😁\",\"😆\",\"😅\",\"😂\",\"🤣\",\"😊\",\"😇\",\"🙂\",\"🙃\",\"😉\",\"😌\",\"😍\",\"🥰\",\"😘\",\"😗\",\"😙\",\"😚\",\"😋\",\"😛\",\"😝\",\"😜\",\"🤪\",\"🤨\",\"🧐\",\"🤓\",\"😎\",\"🤩\",\"🥳\",\"😏\",\"😒\",\"😞\",\"😔\",\"😟\",\"😕\",\"🙁\",\"☹️\",\"😣\",\"😖\",\"😫\",\"😩\",\"🥺\",\"😢\",\"😭\",\"😤\",\"😠\",\"😡\",\"🤬\",\"🤯\",\"😳\",\"🥵\",\"🥶\",\"😱\",\"😨\",\"😰\",\"😥\",\"😓\",\"🤗\",\"🤔\",\"🤭\",\"🤫\",\"🤥\",\"😶\",\"😐\",\"😑\",\"😬\",\"🙄\",\"😯\",\"😦\",\"😧\",\"😮\",\"😲\",\"🥱\",\"😴\",\"🤤\",\"😪\",\"😵\",\"🤐\",\"🥴\",\"🤢\",\"🤮\",\"🤧\",\"😷\",\"🤒\",\"🤕\",\"🤑\",\"🤠\",\"😈\",\"👿\",\"👹\",\"👺\",\"🤡\",\"💩\",\"👻\",\"💀\",\"☠️\",\"👽\",\"👾\",\"🤖\",\"🎃\",\"😺\",\"😸\",\"😹\",\"😻\",\"😼\",\"😽\",\"🙀\",\"😿\",\"😾\",\"👋\",\"🤚\",\"🖐\",\"✋\",\"🖖\",\"👌\",\"🤌\",\"🤏\",\"✌️\",\"🤞\",\"🤟\",\"🤘\",\"🤙\",\"👈\",\"👉\",\"👆\",\"🖕\",\"👇\",\"☝️\",\"👍\",\"👎\",\"✊\",\"👊\",\"🤛\",\"🤜\",\"👏\",\"🙌\",\"👐\",\"🤲\",\"🤝\",\"🙏\",\"✍️\",\"💅\",\"🤳\",\"💪\",\"🦾\",\"🦵\",\"🦿\",\"🦶\",\"👣\",\"👂\",\"🦻\",\"👃\",\"🫀\",\"🫁\",\"🧠\",\"🦷\",\"🦴\",\"👀\",\"👁\",\"👅\",\"👄\",\"💋\",\"🩸\",\"🔥\",\"✨\",\"🌟\",\"💫\",\"💬\"]");

/***/ }),

/***/ 177:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(164);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 178:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-emoji-picker[data-v-e43c8880]{display:inline-flex}.emoji-trigger[data-v-e43c8880]{display:inline-flex;align-items:center;gap:5px;background:none;border:0;color:#947358;font:inherit;font-size:13px;cursor:pointer;padding:0}.emoji-trigger[data-v-e43c8880]:disabled{opacity:.5;cursor:default}.emoji-tabs[data-v-e43c8880]{display:flex;gap:8px;border-bottom:1px solid #e8e2d8;padding-bottom:12px;margin-bottom:16px}.emoji-tabs button[data-v-e43c8880],.categories button[data-v-e43c8880],.upload-trigger[data-v-e43c8880]{font:inherit;font-size:13px;border:1px solid #e6ddcf;border-radius:6px;padding:7px 12px;background:#fff;color:#89775e;cursor:pointer}.emoji-tabs button.active[data-v-e43c8880],.categories button.active[data-v-e43c8880]{background:#ecf0df;color:#7a8e50;border-color:#dbe4c6}.emoji-grid[data-v-e43c8880]{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:6px;max-height:420px;overflow:auto}.emoji-grid button[data-v-e43c8880]{border:0;background:#faf8f3;padding:8px 0;border-radius:7px;font-size:25px;cursor:pointer}.emoji-grid button[data-v-e43c8880]:hover{background:#eeeadf}.sticker-toolbar[data-v-e43c8880]{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin-bottom:18px}.categories[data-v-e43c8880]{display:flex;gap:6px;flex-wrap:wrap}.categories button[data-v-e43c8880]{font-size:12px;padding:6px 9px}.sticker-grid[data-v-e43c8880]{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;max-height:440px;overflow:auto;padding:1px}.sticker-card[data-v-e43c8880]{min-width:0}.sticker-image[data-v-e43c8880]{position:relative;display:block;width:100%;aspect-ratio:1;background:#faf8f4;border:1px solid #eee8df;border-radius:8px;padding:6px;cursor:pointer}.sticker-image img[data-v-e43c8880]{width:100%;height:100%;object-fit:contain}.privacy-badge[data-v-e43c8880]{position:absolute;right:4px;bottom:4px;background:#fff9;color:#9c8f7d;border-radius:3px;font-size:10px;padding:2px 4px}.sticker-actions[data-v-e43c8880]{display:flex;gap:7px;align-items:center;justify-content:center;padding:6px 0}.sticker-actions button[data-v-e43c8880]{padding:0;border:0;background:none;font-size:11px;color:#9c8566;cursor:pointer}.sticker-actions .manage[data-v-e43c8880]{font-size:18px;line-height:12px}.empty[data-v-e43c8880]{padding:40px 12px;text-align:center;color:#aa9c89;font-size:13px}.error[data-v-e43c8880]{font-size:13px;line-height:1.8;color:#b45b48;margin:12px 0}.error button[data-v-e43c8880]{border:0;background:none;color:inherit;text-decoration:underline;cursor:pointer}.load-more[data-v-e43c8880]{display:block;margin:18px auto 0;background:none;border:0;color:#8f7657;cursor:pointer}.hint[data-v-e43c8880]{font-size:13px;color:#9e8c75;line-height:1.8}.upload-file[data-v-e43c8880]{display:inline-flex;position:relative;border:1px dashed #d6cab7;padding:16px 25px;cursor:pointer;margin:12px 0}.upload-file input[data-v-e43c8880]{position:absolute;inset:0;width:100%;opacity:0;cursor:pointer}.upload-preview[data-v-e43c8880]{display:block;max-width:180px;max-height:180px;object-fit:contain;margin-bottom:16px}.upload-privacy[data-v-e43c8880]{display:flex;gap:6px;align-items:center;font-size:13px;color:#93816a;margin-top:10px}button[data-v-e43c8880]:focus-visible{outline:2px solid #839455;outline-offset:3px}button[data-v-e43c8880]:disabled{cursor:default;opacity:.5}@media(max-width:600px){.emoji-grid[data-v-e43c8880]{grid-template-columns:repeat(7,minmax(0,1fr))}.sticker-grid[data-v-e43c8880]{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.sticker-actions[data-v-e43c8880]{gap:10px}}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 179:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderEmojiPicker.vue?vue&type=template&id=e43c8880&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "reader-emoji-picker"
  }, [_vm._ssrNode("<button type=\"button\"" + _vm._ssrAttr("disabled", _vm.disabled) + " class=\"emoji-trigger\" data-v-e43c8880>", "</button>", [_c('SiteIcon', {
    attrs: {
      "name": "smiley"
    }
  }), _vm._ssrNode(" <span data-v-e43c8880>表情</span>")], 2), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "title": "表情与表情包",
      "visible": _vm.visible,
      "width": "min(690px, 94vw)",
      "append-to-body": ""
    },
    on: {
      "update:visible": function ($event) {
        _vm.visible = $event;
      }
    }
  }, [_c('div', {
    staticClass: "emoji-tabs",
    attrs: {
      "role": "tablist",
      "aria-label": "表情类型"
    }
  }, _vm._l(_vm.tabs, function (item) {
    return _c('button', {
      key: item.id,
      class: {
        active: _vm.tab === item.id
      },
      attrs: {
        "role": "tab",
        "aria-selected": _vm.tab === item.id
      },
      on: {
        "click": function ($event) {
          return _vm.changeTab(item.id);
        }
      }
    }, [_vm._v(_vm._s(item.label))]);
  }), 0), _vm._v(" "), _vm.tab === 'emoji' ? _c('div', {
    staticClass: "emoji-grid"
  }, _vm._l(_vm.emojis, function (emoji) {
    return _c('button', {
      key: emoji,
      attrs: {
        "aria-label": `插入 ${emoji}`
      },
      on: {
        "click": function ($event) {
          return _vm.selectEmoji(emoji);
        }
      }
    }, [_vm._v(_vm._s(emoji))]);
  }), 0) : _c('div', [_c('div', {
    staticClass: "sticker-toolbar"
  }, [_vm.tab === 'sticker' ? _c('div', {
    staticClass: "categories",
    attrs: {
      "aria-label": "表情包分类"
    }
  }, _vm._l(_vm.categories, function (item) {
    return _c('button', {
      key: item.id,
      class: {
        active: _vm.category === item.id
      },
      attrs: {
        "aria-pressed": _vm.category === item.id
      },
      on: {
        "click": function ($event) {
          return _vm.changeCategory(item.id);
        }
      }
    }, [_vm._v(_vm._s(item.label))]);
  }), 0) : _vm._e(), _c('button', {
    staticClass: "upload-trigger",
    attrs: {
      "disabled": !_vm.account
    },
    on: {
      "click": _vm.openUpload
    }
  }, [_vm._v("＋ 上传表情包")])]), _vm._v(" "), !_vm.account ? _c('p', {
    staticClass: "empty"
  }, [_vm._v("登录后可以选择和收藏表情包。")]) : _vm.loading && !_vm.items.length ? _c('p', {
    staticClass: "empty",
    attrs: {
      "role": "status"
    }
  }, [_vm._v("正在加载表情包…")]) : !_vm.items.length && !_vm.error ? _c('p', {
    staticClass: "empty"
  }, [_vm._v(_vm._s(_vm.tab === 'favorite' ? '暂无收藏，可在表情包卡片上选择收藏。' : '这个分类还没有表情包。'))]) : _vm._e(), _vm._v(" "), _vm.error ? _c('p', {
    staticClass: "error",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v(_vm._s(_vm.error) + " "), _c('button', {
    on: {
      "click": function ($event) {
        return _vm.load(_vm.failedPage);
      }
    }
  }, [_vm._v("重试")])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "sticker-grid"
  }, _vm._l(_vm.items, function (item) {
    return _c('article', {
      key: item.sticker_id,
      staticClass: "sticker-card"
    }, [_c('button', {
      staticClass: "sticker-image",
      attrs: {
        "aria-label": `插入表情包 ${item.sticker_id}`
      },
      on: {
        "click": function ($event) {
          return _vm.selectSticker(item);
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.url,
        "alt": "表情包",
        "loading": "lazy"
      }
    }), item.is_private ? _c('span', {
      staticClass: "privacy-badge"
    }, [_vm._v("私密")]) : _vm._e()]), _vm._v(" "), _c('div', {
      staticClass: "sticker-actions"
    }, [_c('button', {
      attrs: {
        "disabled": !!_vm.pending[item.sticker_id]
      },
      on: {
        "click": function ($event) {
          return _vm.favorite(item);
        }
      }
    }, [_vm._v(_vm._s(item.is_favorite ? '已收藏' : '收藏'))]), _c('button', {
      attrs: {
        "disabled": !!_vm.pending[item.sticker_id]
      },
      on: {
        "click": function ($event) {
          return _vm.preview(item);
        }
      }
    }, [_vm._v("预览")]), _vm.isOwner(item) ? _c('el-dropdown', {
      attrs: {
        "trigger": "click"
      },
      on: {
        "command": function ($event) {
          return _vm.command($event, item);
        }
      }
    }, [_c('button', {
      staticClass: "manage",
      attrs: {
        "disabled": !!_vm.pending[item.sticker_id],
        "aria-label": `管理表情包 ${item.sticker_id}`
      }
    }, [_vm._v("⋯")]), _c('el-dropdown-menu', {
      attrs: {
        "slot": "dropdown"
      },
      slot: "dropdown"
    }, [_c('el-dropdown-item', {
      attrs: {
        "command": 'privacy'
      }
    }, [_vm._v(_vm._s(item.is_private ? '设为公开' : '设为私密'))]), _c('el-dropdown-item', {
      attrs: {
        "command": "delete"
      }
    }, [_vm._v("删除表情包")])], 1)], 1) : _vm._e()], 1)]);
  }), 0), _vm._v(" "), _vm.page < _vm.pages && _vm.account ? _c('button', {
    staticClass: "load-more",
    attrs: {
      "disabled": _vm.loading
    },
    on: {
      "click": function ($event) {
        return _vm.load(_vm.page + 1);
      }
    }
  }, [_vm._v(_vm._s(_vm.loading ? '加载中…' : '加载更多'))]) : _vm._e()])]), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "title": "上传表情包",
      "visible": _vm.uploadVisible,
      "width": "min(460px, 94vw)",
      "append-to-body": ""
    },
    on: {
      "update:visible": function ($event) {
        _vm.uploadVisible = $event;
      }
    }
  }, [_c('p', {
    staticClass: "hint"
  }, [_vm._v("上传后可以在评论中使用。公开表情包会出现在其他读者的表情列表中。")]), _vm._v(" "), _c('label', {
    staticClass: "upload-file"
  }, [_c('input', {
    attrs: {
      "type": "file",
      "accept": "image/*",
      "disabled": _vm.uploading || _vm.saving
    },
    on: {
      "change": _vm.chooseFile
    }
  }), _vm._v(_vm._s(_vm.uploading ? '图片上传中…' : '选择图片'))]), _vm._v(" "), _vm.uploadUrl ? _c('img', {
    staticClass: "upload-preview",
    attrs: {
      "src": _vm.uploadUrl,
      "alt": "待保存的表情包"
    }
  }) : _vm._e(), _vm._v(" "), _c('label', {
    staticClass: "upload-privacy"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.isPrivate,
      expression: "isPrivate"
    }],
    attrs: {
      "type": "checkbox",
      "disabled": _vm.saving
    },
    domProps: {
      "checked": Array.isArray(_vm.isPrivate) ? _vm._i(_vm.isPrivate, null) > -1 : _vm.isPrivate
    },
    on: {
      "change": function ($event) {
        var $$a = _vm.isPrivate,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.isPrivate = $$a.concat([$$v]));
          } else {
            $$i > -1 && (_vm.isPrivate = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.isPrivate = $$c;
        }
      }
    }
  }), _vm._v(" 仅自己可见")]), _vm.uploadError ? _c('p', {
    staticClass: "error",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v(_vm._s(_vm.uploadError))]) : _vm._e(), _vm._v(" "), _c('span', {
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "disabled": _vm.saving
    },
    on: {
      "click": function ($event) {
        _vm.uploadVisible = false;
      }
    }
  }, [_vm._v("取消")]), _c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.saving,
      "disabled": !_vm.uploadUrl || _vm.uploading
    },
    on: {
      "click": _vm.saveUpload
    }
  }, [_vm._v("保存表情包")])], 1)])], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderEmojiPicker.vue?vue&type=template&id=e43c8880&scoped=true

// EXTERNAL MODULE: ./components/ui/SiteIcon.vue + 5 modules
var SiteIcon = __webpack_require__(150);

// EXTERNAL MODULE: ./config/reader/emojis.json
var emojis = __webpack_require__(176);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reader-stickers.js
var reader_stickers = __webpack_require__(156);

// EXTERNAL MODULE: ./common/manga-comment-api.js
var manga_comment_api = __webpack_require__(153);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderEmojiPicker.vue?vue&type=script&lang=js





/* harmony default export */ var ReaderEmojiPickervue_type_script_lang_js = ({
  components: {
    SiteIcon: SiteIcon["a" /* default */]
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    visible: false,
    tab: 'emoji',
    category: 'all',
    emojis: emojis,
    items: [],
    account: null,
    page: 0,
    pages: 1,
    failedPage: 1,
    loading: false,
    error: '',
    version: 0,
    pending: {},
    uploadVisible: false,
    uploadUrl: '',
    uploadError: '',
    uploading: false,
    saving: false,
    isPrivate: false,
    uploadVersion: 0,
    tabs: [{
      id: 'emoji',
      label: 'Emoji'
    }, {
      id: 'sticker',
      label: '表情包'
    }, {
      id: 'favorite',
      label: '收藏'
    }],
    categories: [{
      id: 'all',
      label: '全部'
    }, {
      id: 'my',
      label: '我上传的'
    }, {
      id: 'public',
      label: '公开'
    }, {
      id: 'logwood',
      label: '原木娘专属'
    }]
  }),
  watch: {
    visible(value) {
      if (!value) this.close();
    },
    uploadVisible(value) {
      if (!value) this.resetUpload();
    }
  },
  mounted() {
    window.addEventListener('storage', this.checkAccount);
    window.addEventListener('focus', this.checkAccount);
  },
  beforeDestroy() {
    this.version++;
    this.uploadVersion++;
    window.removeEventListener('storage', this.checkAccount);
    window.removeEventListener('focus', this.checkAccount);
  },
  methods: {
    isOwner(item) {
      return item.user_id > 0 && item.user_id === Object(reader_stickers["h" /* stickerUserId */])();
    },
    checkAccount() {
      if (Object(reading["c" /* readingToken */])() !== this.account) {
        this.version++;
        this.account = Object(reading["c" /* readingToken */])();
        this.items = [];
        this.page = 0;
        this.pages = 1;
        this.loading = false;
        this.pending = {};
        this.error = '';
        this.uploadVisible = false;
        this.resetUpload();
        if (this.visible && this.tab !== 'emoji' && this.account) this.load(1);
      }
    },
    open() {
      if (this.disabled) return;
      this.checkAccount();
      this.visible = true;
      if (this.tab !== 'emoji' && this.account) this.load(1);
    },
    close() {
      this.version++;
      this.loading = false;
      this.uploadVisible = false;
      this.resetUpload();
    },
    changeTab(tab) {
      this.tab = tab;
      this.version++;
      this.items = [];
      this.page = 0;
      this.pages = 1;
      this.error = '';
      this.loading = false;
      if (tab !== 'emoji' && this.account) this.load(1);
    },
    changeCategory(category) {
      this.category = category;
      this.version++;
      this.items = [];
      this.page = 0;
      this.pages = 1;
      this.error = '';
      this.loading = false;
      if (this.account) this.load(1);
    },
    async load(page = 1) {
      this.checkAccount();
      if (!this.account || this.tab === 'emoji' || this.loading) return;
      const version = ++this.version,
        token = this.account;
      this.loading = true;
      this.error = '';
      this.failedPage = page;
      try {
        const result = await Object(reader_stickers["d" /* fetchReaderStickers */])({
          favorites: this.tab === 'favorite',
          category: this.category,
          page
        }, token);
        if (version !== this.version || token !== Object(reading["c" /* readingToken */])()) return;
        const items = page === 1 ? result.items : this.items.concat(result.items);
        this.items = items.filter((item, i) => items.findIndex(row => row.sticker_id === item.sticker_id) === i);
        this.page = page;
        this.pages = result.pages;
      } catch (error) {
        if (version === this.version && token === Object(reading["c" /* readingToken */])()) this.error = error.message;
      } finally {
        if (version === this.version) this.loading = false;
      }
    },
    selectEmoji(content) {
      if (this.disabled) return;
      this.$emit('select', {
        type: 'emoji',
        content
      });
      this.visible = false;
    },
    selectSticker(item) {
      this.checkAccount();
      if (!this.account || this.disabled || !this.items.some(row => row.sticker_id === item.sticker_id)) return;
      this.$emit('select', {
        type: 'sticker',
        content: item.url,
        sticker_id: item.sticker_id
      });
      this.visible = false;
    },
    preview(item) {
      if (this.$preview) this.$preview([item.url], 0);
    },
    async favorite(item) {
      this.checkAccount();
      if (!this.account || this.pending[item.sticker_id]) return;
      const token = this.account,
        version = this.version;
      this.$set(this.pending, item.sticker_id, true);
      try {
        await Object(reader_stickers["c" /* favoriteReaderSticker */])(item.sticker_id, !item.is_favorite, token);
        if (token !== Object(reading["c" /* readingToken */])() || version !== this.version) return;
        item.is_favorite = !item.is_favorite;
        if (this.tab === 'favorite' && !item.is_favorite) this.items = this.items.filter(row => row.sticker_id !== item.sticker_id);
      } catch (error) {
        if (token === Object(reading["c" /* readingToken */])() && version === this.version) this.error = error.message;
      } finally {
        if (token === this.account) this.$set(this.pending, item.sticker_id, false);
      }
    },
    async command(command, item) {
      this.checkAccount();
      if (!this.account || !this.isOwner(item) || this.pending[item.sticker_id]) return;
      const token = this.account,
        version = this.version;
      const message = command === 'delete' ? '删除此表情包及其收藏记录？' : item.is_private ? '设为公开后，其他读者可以查看、收藏和使用这个表情包。' : '设为私密后，仅你可以查看这个表情包。';
      try {
        await this.$confirm(message, '表情包管理', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        });
      } catch (_) {
        return;
      }
      if (token !== Object(reading["c" /* readingToken */])() || version !== this.version) return;
      this.$set(this.pending, item.sticker_id, true);
      try {
        if (command === 'delete') await Object(reader_stickers["b" /* deleteReaderSticker */])(item.sticker_id, token);else await Object(reader_stickers["e" /* privacyReaderSticker */])(item.sticker_id, !item.is_private, token);
        if (token !== Object(reading["c" /* readingToken */])() || version !== this.version) return;
        this.$message.success(command === 'delete' ? '表情包已删除' : '可见范围已更新');
        this.loading = false;
        await this.load(1);
      } catch (error) {
        if (token === Object(reading["c" /* readingToken */])() && version === this.version) this.error = error.message;
      } finally {
        if (token === Object(reading["c" /* readingToken */])()) this.$set(this.pending, item.sticker_id, false);
      }
    },
    resetUpload() {
      this.uploadVersion++;
      this.uploadUrl = '';
      this.uploadError = '';
      this.uploading = false;
      this.saving = false;
      this.isPrivate = false;
    },
    openUpload() {
      this.checkAccount();
      if (!this.account) return;
      this.resetUpload();
      this.uploadVisible = true;
    },
    async chooseFile(event) {
      const file = (event.target.files || [])[0];
      event.target.value = '';
      if (!file || this.uploading || this.saving) return;
      this.checkAccount();
      if (!this.account) return;
      const token = this.account,
        version = ++this.uploadVersion;
      this.uploading = true;
      this.uploadError = '';
      this.uploadUrl = '';
      try {
        if (!/^image\//.test(file.type) || file.size > 10 * 1024 * 1024) throw new Error('请选择 10MB 以内的图片');
        const url = await Object(manga_comment_api["j" /* uploadMangaCommentImage */])(file);
        if (version === this.uploadVersion && token === Object(reading["c" /* readingToken */])()) this.uploadUrl = url;
      } catch (error) {
        if (version === this.uploadVersion && token === Object(reading["c" /* readingToken */])()) this.uploadError = error.message;
      } finally {
        if (version === this.uploadVersion) this.uploading = false;
      }
    },
    async saveUpload() {
      this.checkAccount();
      if (!this.account || !this.uploadUrl || this.uploading || this.saving) return;
      const token = this.account,
        version = this.uploadVersion;
      this.saving = true;
      this.uploadError = '';
      try {
        await Object(reader_stickers["a" /* createReaderSticker */])(this.uploadUrl, this.isPrivate, token);
        if (version !== this.uploadVersion || token !== Object(reading["c" /* readingToken */])()) return;
        this.$message.success('表情包已保存');
        this.uploadVisible = false;
        if (this.tab !== 'emoji') await this.load(1);
      } catch (error) {
        if (version === this.uploadVersion && token === Object(reading["c" /* readingToken */])()) this.uploadError = error.message;
      } finally {
        if (version === this.uploadVersion) this.saving = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderEmojiPicker.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderEmojiPickervue_type_script_lang_js = (ReaderEmojiPickervue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderEmojiPicker.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(177)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderEmojiPickervue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "e43c8880",
  "6e6fa0ba"
  
)

/* harmony default export */ var ReaderEmojiPicker = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 346:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(483);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("76593716", content, true, context)
};

/***/ }),

/***/ 347:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(485);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("4a6084d2", content, true, context)
};

/***/ }),

/***/ 348:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(487);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("64d17df1", content, true, context)
};

/***/ }),

/***/ 482:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentComposer_vue_vue_type_style_index_0_id_ca426c28_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(346);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentComposer_vue_vue_type_style_index_0_id_ca426c28_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentComposer_vue_vue_type_style_index_0_id_ca426c28_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentComposer_vue_vue_type_style_index_0_id_ca426c28_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CommentComposer_vue_vue_type_style_index_0_id_ca426c28_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 483:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.social-comment-composer[data-v-ca426c28] {\r\n  border-top: 1px solid #f0e9e2;\r\n  padding-top: 12px;\n}\n.reply-hint[data-v-ca426c28] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 10px;\r\n  font-size: 13px;\r\n  color: var(--wood, #947358);\r\n  margin-bottom: 8px;\n}\n.cancel-reply[data-v-ca426c28] {\r\n  background: none;\r\n  border: none;\r\n  color: #999;\r\n  cursor: pointer;\r\n  font-size: 12px;\n}\n.cancel-reply[data-v-ca426c28]:hover {\r\n  color: #e0524d;\n}\n.composer-input[data-v-ca426c28] {\r\n  width: 100%;\r\n  box-sizing: border-box;\r\n  resize: vertical;\r\n  border: 1px solid var(--line, #e9e0d5);\r\n  border-radius: 8px;\r\n  padding: 10px 12px;\r\n  font-size: 14px;\r\n  color: var(--ink, #382d25);\r\n  background: var(--surface, #fffdf9);\r\n  font-family: inherit;\r\n  outline: none;\n}\n.composer-input[data-v-ca426c28]:focus {\r\n  border-color: var(--wood, #947358);\n}\n.composer-images[data-v-ca426c28] {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 8px;\r\n  margin-top: 10px;\n}\n.upload-item[data-v-ca426c28] {\r\n  position: relative;\n}\n.upload-preview[data-v-ca426c28] {\r\n  width: 64px;\r\n  height: 64px;\r\n  object-fit: cover;\r\n  border-radius: 6px;\n}\n.remove-image[data-v-ca426c28] {\r\n  position: absolute;\r\n  top: -6px;\r\n  right: -6px;\r\n  width: 20px;\r\n  height: 20px;\r\n  border: none;\r\n  border-radius: 50%;\r\n  background: rgba(0, 0, 0, 0.6);\r\n  color: #fff;\r\n  cursor: pointer;\r\n  line-height: 1;\n}\n.composer-actions[data-v-ca426c28] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 14px;\r\n  margin-top: 10px;\n}\n.upload-btn[data-v-ca426c28] {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  gap: 5px;\r\n  font-size: 13px;\r\n  color: var(--wood, #947358);\r\n  cursor: pointer;\r\n  user-select: none;\n}\n.upload-btn.disabled[data-v-ca426c28] {\r\n  color: #ccc;\r\n  cursor: not-allowed;\n}\n.counter[data-v-ca426c28] {\r\n  font-size: 12px;\r\n  color: #bbb;\r\n  margin-left: auto;\n}\n.submit-btn[data-v-ca426c28] {\r\n  background: var(--wood, #947358);\r\n  border: none;\r\n  color: #fff;\r\n  border-radius: 18px;\r\n  padding: 8px 24px;\r\n  font-size: 14px;\r\n  cursor: pointer;\n}\n.submit-btn[data-v-ca426c28]:hover {\r\n  background: #704c35;\n}\n.submit-btn[data-v-ca426c28]:disabled {\r\n  opacity: 0.5;\r\n  cursor: not-allowed;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 484:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_73c7cbf9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(347);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_73c7cbf9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_73c7cbf9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_73c7cbf9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_73c7cbf9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 485:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.post-detail-page[data-v-73c7cbf9] {\r\n  display: flex;\r\n  justify-content: center;\r\n  padding: 20px;\r\n  background-color: #f5f5f5;\n}\n.post-detail-container[data-v-73c7cbf9] {\r\n  display: flex;\r\n  width: 100%;\r\n  max-width: 1200px;\r\n  gap: 20px;\n}\n.post-detail-main[data-v-73c7cbf9] {\r\n  flex: 1;\r\n  min-width: 0;\n}\n.comments-section-sidebar[data-v-73c7cbf9] {\r\n  width: 400px;\r\n  flex-shrink: 0;\n}\n.post-detail[data-v-73c7cbf9] {\r\n  background-color: #fff;\r\n  border-radius: 8px;\r\n  padding: 24px;\r\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.comments-section[data-v-73c7cbf9] {\r\n  background-color: #fff;\r\n  border-radius: 8px;\r\n  padding: 24px;\r\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\r\n\r\n/* 帖子头部 */\n.post-header[data-v-73c7cbf9] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  margin-bottom: 20px;\n}\n.user-info[data-v-73c7cbf9] {\r\n  display: flex;\r\n  align-items: center;\r\n  cursor: pointer;\n}\n.user-avatar[data-v-73c7cbf9] {\r\n  width: 48px;\r\n  height: 48px;\r\n  border-radius: 50%;\r\n  margin-right: 12px;\r\n  object-fit: cover;\n}\n.user-meta[data-v-73c7cbf9] {\r\n  display: flex;\r\n  flex-direction: column;\n}\n.user-name[data-v-73c7cbf9] {\r\n  font-weight: bold;\r\n  color: #333;\n}\n.post-time[data-v-73c7cbf9] {\r\n  font-size: 12px;\r\n  color: #999;\n}\n.post-circle[data-v-73c7cbf9] {\r\n  background-color: #f0f2f5;\r\n  color: #666;\r\n  padding: 6px 12px;\r\n  border-radius: 16px;\r\n  font-size: 14px;\r\n  cursor: pointer;\r\n  transition: background-color 0.3s;\n}\n.post-circle[data-v-73c7cbf9]:hover {\r\n  background-color: #e4e6e9;\n}\r\n\r\n/* 帖子内容 */\n.post-content[data-v-73c7cbf9] {\r\n  margin-bottom: 24px;\n}\n.post-title[data-v-73c7cbf9] {\r\n  font-size: 24px;\r\n  font-weight: bold;\r\n  margin-bottom: 16px;\r\n  color: #333;\n}\n.post-text[data-v-73c7cbf9] {\r\n  font-size: 16px;\r\n  line-height: 1.8;\r\n  color: #555;\r\n  white-space: pre-wrap;\n}\r\n\r\n/* 帖子图片 */\n.post-images[data-v-73c7cbf9] {\r\n  margin-bottom: 24px;\n}\n.image-grid[data-v-73c7cbf9] {\r\n  display: grid;\r\n  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));\r\n  gap: 10px;\n}\n.post-image[data-v-73c7cbf9] {\r\n  width: 100%;\r\n  height: auto;\r\n  aspect-ratio: 1 / 1;\r\n  object-fit: cover;\r\n  border-radius: 8px;\r\n  cursor: pointer;\r\n  transition: transform 0.3s;\n}\n.post-image[data-v-73c7cbf9]:hover {\r\n  transform: scale(1.05);\n}\r\n\r\n/* 绑定作品 */\n.linked-book[data-v-73c7cbf9] {\r\n  margin-bottom: 24px;\n}\n.book-card[data-v-73c7cbf9] {\r\n  display: flex;\r\n  background-color: #f9f9f9;\r\n  border: 1px solid #eee;\r\n  border-radius: 8px;\r\n  padding: 16px;\r\n  cursor: pointer;\r\n  transition: box-shadow 0.3s;\n}\n.book-card[data-v-73c7cbf9]:hover {\r\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);\n}\n.book-cover[data-v-73c7cbf9] {\r\n  width: 80px;\r\n  height: 112px;\r\n  object-fit: cover;\r\n  border-radius: 4px;\r\n  margin-right: 16px;\n}\n.book-info[data-v-73c7cbf9] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\n}\n.book-name[data-v-73c7cbf9] {\r\n  font-size: 16px;\r\n  font-weight: bold;\r\n  margin: 0 0 8px;\n}\n.book-author[data-v-73c7cbf9] {\r\n  font-size: 14px;\r\n  color: #666;\r\n  margin: 0 0 8px;\n}\n.book-desc[data-v-73c7cbf9] {\r\n  font-size: 14px;\r\n  color: #999;\r\n  margin: 0;\r\n  line-height: 1.5;\n}\r\n\r\n/* 帖子操作 */\n.post-actions[data-v-73c7cbf9] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 24px;\r\n  border-top: 1px solid #f0f0f0;\r\n  padding-top: 16px;\n}\n.action-btn[data-v-73c7cbf9] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 6px;\r\n  color: #666;\r\n  cursor: pointer;\r\n  font-size: 14px;\r\n  transition: color 0.3s;\n}\n.action-btn[data-v-73c7cbf9]:hover,\r\n.action-btn.liked[data-v-73c7cbf9] {\r\n  color: #ea7034;\n}\n.action-btn i[data-v-73c7cbf9] {\r\n  font-size: 20px;\n}\n.post-owner-actions[data-v-73c7cbf9] {\r\n  margin-left: auto;\n}\r\n\r\n/* 评论区 */\n.comments-title[data-v-73c7cbf9] {\r\n  font-size: 18px;\r\n  font-weight: bold;\r\n  margin-bottom: 20px;\r\n  border-bottom: 1px solid #f0f0f0;\r\n  padding-bottom: 10px;\n}\n.comment-input-container[data-v-73c7cbf9] {\r\n  margin-bottom: 24px;\n}\n.comment-actions[data-v-73c7cbf9] {\r\n  display: flex;\r\n  justify-content: flex-end;\r\n  margin-top: 10px;\n}\n.comments-list[data-v-73c7cbf9] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 24px;\n}\n.comment-item[data-v-73c7cbf9] {\r\n  padding-bottom: 16px;\r\n  border-bottom: 1px solid #f0f0f0;\n}\n.comment-item[data-v-73c7cbf9]:last-child {\r\n  border-bottom: none;\n}\n.comment-header[data-v-73c7cbf9] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: flex-start;\r\n  margin-bottom: 12px;\n}\n.user-avatar-small[data-v-73c7cbf9] {\r\n  width: 24px;\r\n  height: 24px;\r\n  border-radius: 50%;\r\n  margin-right: 8px;\n}\n.comment-time[data-v-73c7cbf9],\r\n.reply-time[data-v-73c7cbf9] {\r\n  font-size: 12px;\r\n  color: #999;\n}\n.comment-content[data-v-73c7cbf9],\r\n.reply-content[data-v-73c7cbf9] {\r\n  font-size: 15px;\r\n  color: #555;\r\n  line-height: 1.7;\r\n  margin-left: 56px; /* 48px avatar + 8px margin */\r\n  white-space: pre-wrap;\n}\n.reply-content[data-v-73c7cbf9] {\r\n  margin-left: 32px; /* 24px avatar + 8px margin */\n}\n.reply-to[data-v-73c7cbf9] {\r\n  color: #007bff;\r\n  margin-right: 4px;\n}\n.comment-footer[data-v-73c7cbf9],\r\n.reply-footer[data-v-73c7cbf9] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 20px;\r\n  margin-top: 12px;\r\n  margin-left: 56px;\n}\n.reply-footer[data-v-73c7cbf9] {\r\n  margin-left: 32px;\n}\n.replies-list[data-v-73c7cbf9] {\r\n  margin-top: 16px;\r\n  margin-left: 56px;\r\n  padding-left: 16px;\r\n  border-left: 2px solid #f0f0f0;\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 16px;\n}\n.reply-item[data-v-73c7cbf9] {\r\n  /* No extra styling needed now */\n}\n.load-more-replies[data-v-73c7cbf9] {\r\n  font-size: 14px;\r\n  color: #007bff;\r\n  cursor: pointer;\r\n  margin-top: 10px;\n}\n.reply-input-container[data-v-73c7cbf9] {\r\n  margin-top: 16px;\r\n  margin-left: 56px;\n}\n.reply-actions[data-v-73c7cbf9] {\r\n  display: flex;\r\n  justify-content: flex-end;\r\n  margin-top: 8px;\r\n  gap: 8px;\n}\n.no-comments[data-v-73c7cbf9] {\r\n  text-align: center;\r\n  color: #999;\r\n  padding: 40px 0;\n}\n.no-comments i[data-v-73c7cbf9] {\r\n  font-size: 48px;\r\n  margin-bottom: 16px;\n}\n.load-more[data-v-73c7cbf9] {\r\n  text-align: center;\r\n  margin-top: 24px;\n}\r\n\r\n/* 分享对话框 */\n.share-dialog-content[data-v-73c7cbf9] {\r\n  text-align: center;\n}\n.share-text[data-v-73c7cbf9] {\r\n  margin-bottom: 16px;\r\n  white-space: pre-wrap;\r\n  word-break: break-all;\r\n  text-align: left;\r\n  background-color: #f5f5f5;\r\n  padding: 10px;\r\n  border-radius: 4px;\n}\n.share-actions[data-v-73c7cbf9] {\r\n  margin-top: 16px;\n}\r\n\r\n/* These pages share the desktop workspace instead of adding another outer gutter. */\n.friends-page[data-v-73c7cbf9],\r\n.settings-page[data-v-73c7cbf9],\r\n.post-detail-page[data-v-73c7cbf9],\r\n.post-edit-container[data-v-73c7cbf9] {\r\n  padding: 0 !important;\r\n  max-width: none !important;\n}\n.friends-card[data-v-73c7cbf9],\r\n.settings-card[data-v-73c7cbf9],\r\n.post-detail[data-v-73c7cbf9],\r\n.comments-section[data-v-73c7cbf9] {\r\n  border: 1px solid var(--line, #e9e0d5) !important;\r\n  border-radius: 14px !important;\r\n  box-shadow: none !important;\r\n  background: var(--surface, #fffdf9) !important;\n}\n.post-detail-container[data-v-73c7cbf9] {\r\n  gap: 22px !important;\n}\n.post-detail-main[data-v-73c7cbf9] {\r\n  min-width: 0;\n}\n.post-detail-page[data-v-73c7cbf9] {\r\n  min-height: 0 !important;\n}\n.comment-image-button[data-v-73c7cbf9] {\r\n  border: 0;\r\n  padding: 0;\r\n  background: none;\r\n  cursor: zoom-in;\r\n  margin: 10px 0;\n}\n.comment-image-button img[data-v-73c7cbf9] {\r\n  display: block;\r\n  width: 140px;\r\n  max-height: 160px;\r\n  object-fit: contain;\r\n  border-radius: 8px;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 486:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_73c7cbf9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(348);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_73c7cbf9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_73c7cbf9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_73c7cbf9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_73c7cbf9_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 487:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.post-image-preview[data-v-73c7cbf9] {\r\n  display: block;\r\n  padding: 0;\r\n  border: 0;\r\n  background: none;\r\n  width: 100%;\r\n  cursor: zoom-in;\n}\n.post-image-preview img[data-v-73c7cbf9] {\r\n  display: block;\n}\n.sticker-save[data-v-73c7cbf9] {\r\n  display: block;\r\n  margin: 8px 0;\r\n  padding: 4px 0;\r\n  border: 0;\r\n  background: none;\r\n  color: var(--wood, #795a3d);\r\n  font: inherit;\r\n  font-size: 12px;\r\n  cursor: pointer;\n}\n.sticker-save[data-v-73c7cbf9]:disabled {\r\n  opacity: 0.5;\r\n  cursor: default;\n}\n.sticker-save[data-v-73c7cbf9]:focus-visible,\r\n.post-image-preview[data-v-73c7cbf9]:focus-visible {\r\n  outline: 2px solid var(--wood, #795a3d);\r\n  outline-offset: 3px;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 559:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/post/_id.vue?vue&type=template&id=73c7cbf9&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('Workspace', {
    attrs: {
      "title": _vm.$t('帖子详情'),
      "active": "/community"
    }
  }, [_c('div', {
    staticClass: "post-detail-page"
  }, [_c('div', {
    staticClass: "post-detail-container"
  }, [_c('div', {
    staticClass: "post-detail-main"
  }, [_vm.post ? _c('div', {
    staticClass: "post-detail"
  }, [_c('div', {
    staticClass: "post-header"
  }, [_c('div', {
    staticClass: "user-info",
    on: {
      "click": function ($event) {
        return _vm.navigateToUser(_vm.post.user_id);
      }
    }
  }, [_c('Avatar', {
    attrs: {
      "src": _vm.post.author_avatar,
      "frame": _vm.post.author_avatar_frame || _vm.post.avatar_frame,
      "size": 40
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "user-meta"
  }, [_c('span', {
    staticClass: "user-name"
  }, [_vm._v(_vm._s(_vm.post.author_name))]), _vm._v(" "), _c('span', {
    staticClass: "post-time"
  }, [_vm._v(_vm._s(_vm.formatTime(_vm.post.create_time)))])])], 1), _vm._v(" "), _c('div', {
    staticClass: "post-circle",
    on: {
      "click": function ($event) {
        return _vm.navigateToCircle(_vm.post.circle_id);
      }
    }
  }, [_vm._v("\n              " + _vm._s(_vm.post.circle_name) + "\n            ")])]), _vm._v(" "), _c('div', {
    staticClass: "post-content"
  }, [_c('h1', {
    staticClass: "post-title"
  }, [_vm._v(_vm._s(_vm.post.title))]), _vm._v(" "), _c('p', {
    staticClass: "post-text"
  }, [_vm._v(_vm._s(_vm.post.content))])]), _vm._v(" "), _vm.post.media_urls && _vm.post.media_urls.length > 0 ? _c('div', {
    staticClass: "post-images"
  }, [_c('div', {
    staticClass: "image-grid"
  }, _vm._l(_vm.post.media_urls, function (img, imgIndex) {
    return _c('div', {
      key: imgIndex,
      staticClass: "post-image-item"
    }, [_c('button', {
      staticClass: "post-image-preview",
      attrs: {
        "aria-label": _vm.$t('查看第 {p0} 张图片', {
          p0: imgIndex + 1
        })
      },
      on: {
        "click": function ($event) {
          return _vm.previewImage(_vm.post.media_urls, imgIndex);
        }
      }
    }, [_c('img', {
      staticClass: "post-image",
      attrs: {
        "src": img,
        "alt": _vm.$t('帖子图片')
      }
    })]), _vm._v(" "), _c('button', {
      staticClass: "sticker-save",
      attrs: {
        "disabled": !!_vm.savingSticker
      },
      on: {
        "click": function ($event) {
          return _vm.favoriteImage(img);
        }
      }
    }, [_vm._v("\n                  " + _vm._s(_vm.savingSticker === img ? _vm.$t("收藏中…") : _vm.$t("收藏为表情")) + "\n                ")])]);
  }), 0)]) : _vm._e(), _vm._v(" "), _vm.post.novel_id && _vm.post.novel ? _c('div', {
    staticClass: "linked-book"
  }, [_c('div', {
    staticClass: "book-card",
    on: {
      "click": function ($event) {
        return _vm.navigateToNovel(_vm.post.novel_id);
      }
    }
  }, [_c('img', {
    staticClass: "book-cover",
    attrs: {
      "src": _vm.post.novel.picUrl,
      "alt": _vm.$t('作品封面')
    },
    on: {
      "error": function ($event) {
        $event.target.src = '/default-book-cover.png';
      }
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "book-info"
  }, [_c('h4', {
    staticClass: "book-name"
  }, [_vm._v(_vm._s(_vm.post.novel.name))]), _vm._v(" "), _c('p', {
    staticClass: "book-author"
  }, [_vm._v(_vm._s(_vm.post.novel.author_name))]), _vm._v(" "), _c('p', {
    staticClass: "book-desc"
  }, [_vm._v("\n                  " + _vm._s(_vm.post.novel.content && _vm.post.novel.content.length > 50 ? _vm.post.novel.content.substr(0, 50) + "..." : _vm.post.novel.content) + "\n                ")])])])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "post-actions"
  }, [_c('div', {
    staticClass: "action-btn",
    on: {
      "click": _vm.toggleCommentInput
    }
  }, [_c('i', {
    staticClass: "el-icon-chat-dot-round"
  }), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.post.comment_count || 0))])]), _vm._v(" "), _c('div', {
    staticClass: "action-btn",
    class: {
      liked: _vm.post.is_liked
    },
    on: {
      "click": _vm.likePost
    }
  }, [_c('i', {
    class: _vm.post.is_liked ? 'el-icon-star-on' : 'el-icon-star-off',
    style: {
      color: _vm.post.is_liked ? '#EA7034' : '#666'
    }
  }), _vm._v(" "), _c('span', {
    class: {
      liked: _vm.post.is_liked
    }
  }, [_vm._v(_vm._s(_vm.post.like_count || 0))])]), _vm._v(" "), _c('div', {
    staticClass: "action-btn",
    on: {
      "click": _vm.sharePost
    }
  }, [_c('i', {
    staticClass: "el-icon-share"
  }), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.$t("分享")))])]), _vm._v(" "), _vm.canEditPost || _vm.canDeletePost ? _c('div', {
    staticClass: "post-owner-actions"
  }, [_vm.canEditPost ? _c('el-button', {
    attrs: {
      "size": "small",
      "type": "text"
    },
    on: {
      "click": _vm.editPost
    }
  }, [_vm._v(_vm._s(_vm.$t("编辑")))]) : _vm._e(), _vm._v(" "), _vm.canDeletePost ? _c('el-button', {
    attrs: {
      "size": "small",
      "type": "text"
    },
    on: {
      "click": _vm.confirmDeletePost
    }
  }, [_vm._v(_vm._s(_vm.$t("删除")))]) : _vm._e()], 1) : _vm._e()])]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "comments-section-sidebar"
  }, [_c('div', {
    staticClass: "comments-section"
  }, [_c('h3', {
    staticClass: "comments-title"
  }, [_vm._v("\n            " + _vm._s(_vm.$t("评论 ({p0})", {
    p0: _vm.post ? _vm.post.comment_count || 0 : 0
  })) + "\n          ")]), _vm._v(" "), _c('div', {
    ref: "commentInput",
    staticClass: "comment-input-container"
  }, [_c('CommentComposer', {
    ref: "composer",
    attrs: {
      "submitting": _vm.isSubmitting
    },
    on: {
      "submit": _vm.submitComment
    }
  })], 1), _vm._v(" "), _vm.comments.length > 0 ? _c('div', {
    staticClass: "comments-list"
  }, _vm._l(_vm.comments, function (comment) {
    return _c('div', {
      key: comment.comment_id,
      staticClass: "comment-item"
    }, [_c('div', {
      staticClass: "comment-header"
    }, [_c('div', {
      staticClass: "user-info",
      on: {
        "click": function ($event) {
          return _vm.navigateToUser(comment.user_id);
        }
      }
    }, [_c('Avatar', {
      attrs: {
        "src": comment.user_avatar,
        "frame": comment.user_avatar_frame,
        "size": 36
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "user-meta"
    }, [_c('span', {
      staticClass: "user-name"
    }, [_vm._v(_vm._s(comment.user_name))]), _vm._v(" "), _c('span', {
      staticClass: "comment-time"
    }, [_vm._v(_vm._s(_vm.formatTime(comment.create_time)))])])], 1), _vm._v(" "), _c('div', {
      staticClass: "comment-actions"
    }, [_vm.canDeleteComment(comment) ? _c('el-dropdown', {
      attrs: {
        "trigger": "click"
      }
    }, [_c('span', {
      staticClass: "el-dropdown-link"
    }, [_c('i', {
      staticClass: "el-icon-more"
    })]), _vm._v(" "), _c('el-dropdown-menu', {
      attrs: {
        "slot": "dropdown"
      },
      slot: "dropdown"
    }, [_vm.canDeleteComment(comment) ? _c('el-dropdown-item', {
      nativeOn: {
        "click": function ($event) {
          return _vm.confirmDeleteComment(comment);
        }
      }
    }, [_vm._v(_vm._s(_vm.$t("删除")))]) : _vm._e()], 1)], 1) : _vm._e()], 1)]), _vm._v(" "), _c('div', {
      staticClass: "comment-content"
    }, [_vm._v(_vm._s(comment.content))]), _vm._v(" "), comment.image_url ? _c('button', {
      staticClass: "comment-image-button",
      on: {
        "click": function ($event) {
          return _vm.previewImage([comment.image_url], 0);
        }
      }
    }, [_c('img', {
      attrs: {
        "src": comment.image_url,
        "alt": _vm.$t('评论配图')
      }
    })]) : _vm._e(), _vm._v(" "), comment.image_url ? _c('button', {
      staticClass: "sticker-save",
      attrs: {
        "disabled": !!_vm.savingSticker
      },
      on: {
        "click": function ($event) {
          return _vm.favoriteImage(comment.image_url);
        }
      }
    }, [_vm._v("\n                " + _vm._s(_vm.$t("收藏为表情")) + "\n              ")]) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "comment-footer"
    }, [_c('div', {
      staticClass: "action-btn",
      class: {
        liked: comment.is_liked
      },
      on: {
        "click": function ($event) {
          return _vm.likeComment(comment);
        }
      }
    }, [_c('i', {
      class: comment.is_liked ? 'el-icon-star-on' : 'el-icon-star-off',
      style: {
        color: comment.is_liked ? '#EA7034' : '#666'
      }
    }), _vm._v(" "), _c('span', {
      class: {
        liked: comment.is_liked
      }
    }, [_vm._v(_vm._s(comment.like_count || 0))])]), _vm._v(" "), _c('div', {
      staticClass: "action-btn",
      on: {
        "click": function ($event) {
          return _vm.replyToComment(comment);
        }
      }
    }, [_c('i', {
      staticClass: "el-icon-chat-dot-round"
    }), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.$t("回复")))])])]), _vm._v(" "), comment.replies && comment.replies.length > 0 ? _c('div', {
      staticClass: "replies-list"
    }, [_vm._l(comment.replies, function (reply) {
      return _c('div', {
        key: reply.comment_id,
        staticClass: "reply-item"
      }, [_c('div', {
        staticClass: "reply-header"
      }, [_c('div', {
        staticClass: "user-info",
        on: {
          "click": function ($event) {
            return _vm.navigateToUser(reply.user_id);
          }
        }
      }, [_c('Avatar', {
        attrs: {
          "src": reply.user_avatar,
          "frame": reply.user_avatar_frame,
          "size": 28
        }
      }), _vm._v(" "), _c('div', {
        staticClass: "user-meta"
      }, [_c('span', {
        staticClass: "user-name"
      }, [_vm._v(_vm._s(reply.user_name))]), _vm._v(" "), _c('span', {
        staticClass: "reply-time"
      }, [_vm._v(_vm._s(_vm.formatTime(reply.create_time)))])])], 1), _vm._v(" "), _c('div', {
        staticClass: "reply-actions"
      }, [_vm.canDeleteComment(reply) ? _c('el-dropdown', {
        attrs: {
          "trigger": "click"
        }
      }, [_c('span', {
        staticClass: "el-dropdown-link"
      }, [_c('i', {
        staticClass: "el-icon-more"
      })]), _vm._v(" "), _c('el-dropdown-menu', {
        attrs: {
          "slot": "dropdown"
        },
        slot: "dropdown"
      }, [_vm.canDeleteComment(reply) ? _c('el-dropdown-item', {
        nativeOn: {
          "click": function ($event) {
            return _vm.confirmDeleteComment(reply, comment);
          }
        }
      }, [_vm._v(_vm._s(_vm.$t("删除")))]) : _vm._e()], 1)], 1) : _vm._e()], 1)]), _vm._v(" "), _c('div', {
        staticClass: "reply-content"
      }, [reply.reply_to_user_id && reply.reply_to_user_id !== comment.user_id ? _c('span', {
        staticClass: "reply-to"
      }, [_vm._v(_vm._s(_vm.$t("回复 {p0}：", {
        p0: reply.reply_user_name
      })))]) : _vm._e(), _vm._v("\n                    " + _vm._s(reply.content) + "\n                  ")]), _vm._v(" "), reply.image_url ? _c('button', {
        staticClass: "comment-image-button",
        on: {
          "click": function ($event) {
            return _vm.previewImage([reply.image_url], 0);
          }
        }
      }, [_c('img', {
        attrs: {
          "src": reply.image_url,
          "alt": _vm.$t('回复配图')
        }
      })]) : _vm._e(), _vm._v(" "), reply.image_url ? _c('button', {
        staticClass: "sticker-save",
        attrs: {
          "disabled": !!_vm.savingSticker
        },
        on: {
          "click": function ($event) {
            return _vm.favoriteImage(reply.image_url);
          }
        }
      }, [_vm._v("\n                    " + _vm._s(_vm.$t("收藏为表情")) + "\n                  ")]) : _vm._e(), _vm._v(" "), _c('div', {
        staticClass: "reply-footer"
      }, [_c('div', {
        staticClass: "action-btn",
        class: {
          liked: reply.is_liked
        },
        on: {
          "click": function ($event) {
            return _vm.likeComment(reply);
          }
        }
      }, [_c('i', {
        class: reply.is_liked ? 'el-icon-star-on' : 'el-icon-star-off',
        style: {
          color: reply.is_liked ? '#EA7034' : '#666'
        }
      }), _vm._v(" "), _c('span', {
        class: {
          liked: reply.is_liked
        }
      }, [_vm._v(_vm._s(reply.like_count || 0))])]), _vm._v(" "), _c('div', {
        staticClass: "action-btn",
        on: {
          "click": function ($event) {
            return _vm.replyToComment(reply, comment);
          }
        }
      }, [_c('i', {
        staticClass: "el-icon-chat-dot-round"
      }), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.$t("回复")))])])])]);
    }), _vm._v(" "), comment.has_more_replies ? _c('div', {
      staticClass: "load-more-replies",
      on: {
        "click": function ($event) {
          return _vm.loadMoreReplies(comment);
        }
      }
    }, [_c('span', [_vm._v(_vm._s(_vm.$t("加载更多回复")))])]) : _vm._e()], 2) : _vm._e(), _vm._v(" "), _vm.replyingTo && _vm.replyingTo.comment_id === comment.comment_id ? _c('div', {
      staticClass: "reply-input-container"
    }, [_c('CommentComposer', {
      attrs: {
        "reply-to": {
          targetUserName: _vm.replyingTo.reply_user_name
        },
        "submitting": _vm.isSubmitting
      },
      on: {
        "cancel-reply": _vm.cancelReply,
        "submit": _vm.submitReply
      }
    })], 1) : _vm._e()]);
  }), 0) : _c('div', {
    staticClass: "no-comments"
  }, [_c('i', {
    staticClass: "el-icon-chat-dot-round"
  }), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.$t("暂无评论，快来发表第一条评论吧")))])]), _vm._v(" "), _vm.hasMoreComments ? _c('div', {
    staticClass: "load-more"
  }, [_c('el-button', {
    attrs: {
      "loading": _vm.loadingComments
    },
    on: {
      "click": _vm.loadMoreComments
    }
  }, [_vm._v(_vm._s(_vm.$t("加载更多评论")))])], 1) : _vm._e()])])]), _vm._v(" "), _c('el-dialog', {
    attrs: {
      "title": _vm.$t('分享帖子'),
      "visible": _vm.shareDialogVisible,
      "width": "400px",
      "center": ""
    },
    on: {
      "update:visible": function ($event) {
        _vm.shareDialogVisible = $event;
      }
    }
  }, [_c('div', {
    staticClass: "share-dialog-content"
  }, [_c('p', {
    staticClass: "share-text"
  }, [_vm._v(_vm._s(_vm.shareText))]), _vm._v(" "), _c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 4,
      "readonly": ""
    },
    model: {
      value: _vm.shareText,
      callback: function ($$v) {
        _vm.shareText = $$v;
      },
      expression: "shareText"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "share-actions"
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.copyShareText
    }
  }, [_vm._v(_vm._s(_vm.$t("复制链接")))])], 1)], 1)])], 1)]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/community/post/_id.vue?vue&type=template&id=73c7cbf9&scoped=true

// EXTERNAL MODULE: ./components/social/Workspace.vue + 5 modules
var Workspace = __webpack_require__(149);

// EXTERNAL MODULE: ./components/social/Avatar.vue + 4 modules
var Avatar = __webpack_require__(159);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/social/CommentComposer.vue?vue&type=template&id=ca426c28&scoped=true
var CommentComposervue_type_template_id_ca426c28_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "social-comment-composer"
  }, [_vm._ssrNode((_vm.replyTo ? "<div class=\"reply-hint\" data-v-ca426c28>" + _vm._ssrEscape("\n    " + _vm._s(_vm.$t("回复 @{p0}", {
    p0: _vm.replyTo.targetUserName || ""
  }))) + "<button class=\"cancel-reply\" data-v-ca426c28>" + _vm._ssrEscape("\n      " + _vm._s(_vm.$t("取消")) + "\n    ") + "</button></div>" : "<!---->") + " <div class=\"composer-row\" data-v-ca426c28><textarea" + _vm._ssrAttr("placeholder", _vm.replyTo ? _vm.$t('写下你的回复…') : _vm.$t('发条友善的评论…')) + " maxlength=\"500\" rows=\"3\" class=\"composer-input\" data-v-ca426c28>" + _vm._ssrEscape(_vm._s(_vm.content)) + "</textarea></div> " + (_vm.images.length ? "<div class=\"composer-images\" data-v-ca426c28>" + _vm._ssrList(_vm.images, function (img, i) {
    return "<div class=\"upload-item\" data-v-ca426c28><img" + _vm._ssrAttr("src", img) + " class=\"upload-preview\" data-v-ca426c28> <button class=\"remove-image\" data-v-ca426c28>×</button></div>";
  }) + "</div>" : "<!---->") + " "), _vm._ssrNode("<div class=\"composer-actions\" data-v-ca426c28>", "</div>", [_c('ReaderEmojiPicker', {
    attrs: {
      "disabled": _vm.submitting || _vm.uploading
    },
    on: {
      "select": _vm.appendEmoji
    }
  }), _vm._ssrNode(" "), _vm._ssrNode("<label" + _vm._ssrClass("upload-btn", {
    disabled: _vm.uploading
  }) + " data-v-ca426c28>", "</label>", [_vm._ssrNode("<input type=\"file\" accept=\"image/*\" hidden=\"hidden\"" + _vm._ssrAttr("disabled", _vm.uploading || _vm.images.length >= 1) + " data-v-ca426c28> "), _c('SiteIcon', {
    attrs: {
      "name": "image"
    }
  }), _vm._ssrNode(" <span data-v-ca426c28>" + _vm._ssrEscape(_vm._s(_vm.uploading ? _vm.$t("上传中…") : _vm.$t("图片"))) + "</span>")], 2), _vm._ssrNode(" <span class=\"counter\" data-v-ca426c28>" + _vm._ssrEscape(_vm._s(_vm.content.length) + "/500") + "</span> <button" + _vm._ssrAttr("disabled", _vm.submitting || !_vm.content.trim() && !_vm.images.length || _vm.uploading) + " class=\"submit-btn\" data-v-ca426c28>" + _vm._ssrEscape("\n      " + _vm._s(_vm.submitting ? _vm.$t("发送中…") : _vm.$t("发送")) + "\n    ") + "</button>")], 2)], 2);
};
var CommentComposervue_type_template_id_ca426c28_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/social/CommentComposer.vue?vue&type=template&id=ca426c28&scoped=true

// EXTERNAL MODULE: ./components/ui/SiteIcon.vue + 5 modules
var SiteIcon = __webpack_require__(150);

// EXTERNAL MODULE: ./common/manga-comment-api.js
var manga_comment_api = __webpack_require__(153);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./components/read/ReaderEmojiPicker.vue + 4 modules
var ReaderEmojiPicker = __webpack_require__(179);

// EXTERNAL MODULE: ./utils/reader-stickers.js
var reader_stickers = __webpack_require__(156);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/social/CommentComposer.vue?vue&type=script&lang=js





/* harmony default export */ var CommentComposervue_type_script_lang_js = ({
  name: "SocialCommentComposer",
  components: {
    SiteIcon: SiteIcon["a" /* default */],
    ReaderEmojiPicker: ReaderEmojiPicker["a" /* default */]
  },
  props: {
    replyTo: {
      type: Object,
      default: null
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: "",
      images: [],
      uploading: false,
      uploadVersion: 0
    };
  },
  beforeDestroy() {
    this.uploadVersion++;
  },
  methods: {
    appendEmoji(data) {
      if (this.submitting || this.uploading || !data) return;
      if (data.type === "sticker") {
        const url = Object(reader_stickers["g" /* stickerUrl */])(data.content);
        if (!Object(reading["c" /* readingToken */])()) {
          this.$message.info(this.$t("请先登录后使用表情包"));
          return;
        }
        if (this.images.length >= 1) {
          this.$message.info(this.$t("最多添加 1 张配图或表情包"));
          return;
        }
        if (url) this.images.push(url);
        return;
      }
      const input = this.$refs.input,
        start = input ? input.selectionStart : this.content.length,
        end = input ? input.selectionEnd : start;
      const text = String(data.content || ""),
        value = this.content.slice(0, start) + text + this.content.slice(end);
      if (value.length > 500) {
        this.$message.info(this.$t("评论最多 500 字"));
        return;
      }
      this.content = value;
      this.$nextTick(() => {
        if (input) {
          input.focus();
          input.setSelectionRange(start + text.length, start + text.length);
        }
      });
    },
    async onPickFiles(e) {
      const files = Array.from(e.target.files || []);
      e.target.value = "";
      if (!files.length || this.uploading || this.submitting) return;
      if (!Object(reading["c" /* readingToken */])()) {
        this.$message.info(this.$t("请先登录后再上传评论配图"));
        return;
      }
      const version = ++this.uploadVersion,
        account = Object(reading["c" /* readingToken */])();
      this.uploading = true;
      try {
        for (const file of files) {
          if (this.images.length >= 1 || version !== this.uploadVersion || account !== Object(reading["c" /* readingToken */])()) break;
          const url = await Object(manga_comment_api["j" /* uploadMangaCommentImage */])(file);
          if (version !== this.uploadVersion || account !== Object(reading["c" /* readingToken */])()) return;
          this.images.push(url);
        }
      } catch (err) {
        if (version === this.uploadVersion && account === Object(reading["c" /* readingToken */])()) this.$message.error(this.$t("图片上传失败，请稍后重试"));
      } finally {
        if (version === this.uploadVersion) this.uploading = false;
      }
    },
    removeImage(i) {
      this.images.splice(i, 1);
    },
    submit() {
      if (!this.content.trim() && !this.images.length || this.content.length > 500 || this.submitting || this.uploading) return;
      this.$emit("submit", {
        content: this.content.trim(),
        images: this.images.slice()
      });
    },
    reset() {
      this.uploadVersion++;
      this.uploading = false;
      this.content = "";
      this.images = [];
    },
    focus() {
      this.$nextTick(() => {
        if (this.$refs.input) this.$refs.input.focus();
      });
    }
  }
});
// CONCATENATED MODULE: ./components/social/CommentComposer.vue?vue&type=script&lang=js
 /* harmony default export */ var social_CommentComposervue_type_script_lang_js = (CommentComposervue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/social/CommentComposer.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(482)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  social_CommentComposervue_type_script_lang_js,
  CommentComposervue_type_template_id_ca426c28_scoped_true_render,
  CommentComposervue_type_template_id_ca426c28_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "ca426c28",
  "2062ef30"
  
)

/* harmony default export */ var CommentComposer = (component.exports);
// EXTERNAL MODULE: ./utils/social.js
var social = __webpack_require__(170);

// EXTERNAL MODULE: ./plugins/api/social.js
var api_social = __webpack_require__(26);

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(43);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/post/_id.vue?vue&type=script&lang=js








/* harmony default export */ var _idvue_type_script_lang_js = ({
  components: {
    Workspace: Workspace["a" /* default */],
    Avatar: Avatar["a" /* default */],
    CommentComposer: CommentComposer
  },
  head() {
    return {
      title: this.post ? `${this.post.title} - LogHome社区` : "LogHome社区",
      meta: [{
        hid: "description",
        name: "description",
        content: this.post ? `${String(this.post.content || "").substring(0, 100)}...` : "LogHome社区帖子详情"
      }]
    };
  },
  async asyncData({
    params,
    $api,
    error
  }) {
    try {
      const postId = params.id;
      const post = await $api.community.getPostDetail({
        post_id: postId
      });

      // 获取评论
      const commentsRes = await $api.community.getComments({
        post_id: postId,
        page: 1,
        pageSize: 10
      });

      // 处理评论数据，确保格式一致
      const comments = commentsRes.list || [];
      comments.forEach(comment => {
        // 确保replies字段存在
        if (!comment.replies) {
          comment.replies = [];
        }

        // 处理媒体URL
        if (comment.image_url) {
          comment.media_urls = [comment.image_url];
        } else {
          comment.media_urls = [];
        }

        // 处理回复的媒体URL
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            if (reply.image_url) {
              reply.media_urls = [reply.image_url];
            } else {
              reply.media_urls = [];
            }
          });
        }
      });
      return {
        post,
        comments: comments,
        commentPage: 1,
        hasMoreComments: 10 < Number(commentsRes.total || 0),
        totalComments: commentsRes.total || 0
      };
    } catch (err) {
      console.error("获取帖子详情失败:", err);
      error({
        statusCode: 404,
        message: "帖子不存在或已被删除"
      });
      return {};
    }
  },
  data() {
    return {
      savingSticker: "",
      deletingComment: null,
      deletingPost: false,
      commentContent: "",
      replyContent: "",
      replyingTo: null,
      isSubmitting: false,
      likePending: false,
      loadingComments: false,
      sharing: false,
      shareDialogVisible: false,
      shareText: "",
      currentUserId: null,
      isLogin: false,
      userInfo: null,
      userRole: -1 // -1: 未知, 0: 普通成员, 1: 管理员, 2: 圈主
    };
  },
  computed: {
    isPostOwner() {
      return this.currentUserId && this.post && this.currentUserId === this.post.user_id;
    },
    canDeletePost() {
      if (!this.userInfo || !this.post) return false;
      // 管理员/圈主/作者可删除
      return this.userInfo.is_admin == 1 || this.userInfo.user_id == this.post.user_id || this.userRole == 1 || this.userRole == 2;
    },
    canEditPost() {
      if (!this.userInfo || !this.post) return false;
      console.log(this.userInfo);
      // 作者可编辑
      return this.userInfo.user_id == this.post.user_id;
    }
  },
  mounted() {
    this.checkLoginStatus();
    this.getPostLikeStatus();
    this.getCommentsLikeStatus();
    this.loadInitialReplies();
    this.getUserRole();
  },
  methods: {
    checkLoginStatus() {
      try {
        const token = localStorage.getItem("token");
        this.isLogin = !!token;
        if (this.isLogin) {
          this.getUserInfo();
        }
      } catch (error) {
        console.error("检查登录状态失败:", error);
        this.isLogin = false;
      }
    },
    async getUserInfo() {
      try {
        const user = await this.$api.users.getUserProfile();
        this.userInfo = user;
        this.currentUserId = user.user_id;
        // 缓存用户信息
        localStorage.setItem("userInfo", JSON.stringify(user));
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    },
    formatTime(time) {
      const now = external_moment_default()();
      const postTime = external_moment_default()(time);
      const diff = now.diff(postTime, "minutes");
      if (diff < 1) return "刚刚";
      if (diff < 60) return `${diff}分钟前`;
      const hourDiff = now.diff(postTime, "hours");
      if (hourDiff < 24) return `${hourDiff}小时前`;
      const dayDiff = now.diff(postTime, "days");
      if (dayDiff < 30) return `${dayDiff}天前`;
      return postTime.format("YYYY-MM-DD");
    },
    navigateToUser(userId) {
      this.$router.push(`/users/${userId}`);
    },
    navigateToCircle(circleId) {
      this.$router.push(`/community/circle/${circleId}`);
    },
    navigateToNovel(novelId) {
      this.$router.push(`/novel/${novelId}`);
    },
    previewImage(images, index) {
      if (!images || !images.length) return;
      this.$preview(images, index || 0);
    },
    async getPostLikeStatus() {
      try {
        if (!this.isLogin || !this.post) return;
        const res = await this.$api.community.getLikeStatus({
          target_id: this.post.post_id,
          target_type: 1 // 1表示帖子
        });
        this.$set(this.post, "is_liked", res.liked);
      } catch (error) {
        console.error("获取帖子点赞状态失败:", error);
      }
    },
    async getCommentsLikeStatus() {
      try {
        if (!this.isLogin || !this.comments.length) return;
        for (const comment of this.comments) {
          try {
            const res = await this.$api.community.getLikeStatus({
              target_id: comment.comment_id,
              target_type: 2 // 2表示评论
            });
            this.$set(comment, "is_liked", res.liked);

            // 获取回复的点赞状态
            if (comment.replies && comment.replies.length) {
              for (const reply of comment.replies) {
                try {
                  const replyRes = await this.$api.community.getLikeStatus({
                    target_id: reply.comment_id,
                    target_type: 2 // 2表示评论
                  });
                  this.$set(reply, "is_liked", replyRes.liked);
                } catch (err) {
                  console.error(`获取回复 ${reply.comment_id} 点赞状态失败:`, err);
                }
              }
            }
          } catch (err) {
            console.error(`获取评论 ${comment.comment_id} 点赞状态失败:`, err);
          }
        }
      } catch (error) {
        console.error("获取评论点赞状态失败:", error);
      }
    },
    async likePost() {
      if (this.likePending) return;
      if (!this.isLogin) {
        this.$router.push({
          path: "/login",
          query: {
            redirect: this.$route.fullPath
          }
        });
        return;
      }
      this.likePending = true;
      try {
        const result = await Object(api_social["b" /* socialRequest */])("/community/interactions/like", {}, "POST", {
          target_id: this.post.post_id,
          target_type: 1
        }, true);
        const previous = !!this.post.is_liked,
          next = !!result.liked;
        this.$set(this.post, "is_liked", next);
        this.$set(this.post, "like_count", Math.max(0, Number(this.post.like_count || 0) + (next === previous ? 0 : next ? 1 : -1)));
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.likePending = false;
      }
    },
    async likeComment(comment) {
      if (comment.like_pending) return;
      if (!this.isLogin) {
        this.$router.push({
          path: "/login",
          query: {
            redirect: this.$route.fullPath
          }
        });
        return;
      }
      this.$set(comment, "like_pending", true);
      try {
        const result = await Object(api_social["b" /* socialRequest */])("/community/interactions/like", {}, "POST", {
          target_id: comment.comment_id,
          target_type: 2
        }, true);
        const previous = !!comment.is_liked,
          next = !!result.liked;
        this.$set(comment, "is_liked", next);
        this.$set(comment, "like_count", Math.max(0, Number(comment.like_count || 0) + (next === previous ? 0 : next ? 1 : -1)));
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.$set(comment, "like_pending", false);
      }
    },
    async sharePost() {
      if (this.sharing) return;
      if (!Object(reading["c" /* readingToken */])()) {
        this.$router.push({
          path: "/login",
          query: {
            redirect: this.$route.fullPath
          }
        });
        return;
      }
      this.sharing = true;
      try {
        this.shareText = await api_social["a" /* default */].sharePost(this.post.post_id, Object(social["e" /* postShareMessage */])(this.post, window.location.origin));
        this.shareDialogVisible = true;
        try {
          await navigator.clipboard.writeText(this.shareText);
          this.$message.success(this.$t("分享口令已复制"));
        } catch (_) {}
      } catch (error) {
        this.$message.error(error.message || this.$t("分享失败，请重试"));
      } finally {
        this.sharing = false;
      }
    },
    editPost() {
      this.$router.push({
        path: "/community/post/edit",
        query: {
          post_id: this.post.post_id
        }
      });
    },
    async getUserRole() {
      try {
        if (!this.isLogin || !this.post || !this.post.circle_id) {
          this.userRole = 0;
          return;
        }
        const circles = await this.$api.community.getMyCircles();
        if (circles && circles.length > 0) {
          const circle = circles.find(c => c.circle_id == this.post.circle_id);
          if (circle) {
            this.userRole = circle.role;
          } else {
            this.userRole = 0;
          }
        } else {
          this.userRole = 0;
        }
      } catch (error) {
        console.error("获取用户角色失败:", error);
        this.userRole = 0;
      }
    },
    async confirmDeletePost() {
      if (this.deletingPost || !this.canDeletePost) return;
      const token = Object(reading["c" /* readingToken */])();
      try {
        await this.$confirm(this.$t("确定要删除该帖子吗？"), this.$t("确认删除"), {
          confirmButtonText: this.$t("删除"),
          cancelButtonText: this.$t("取消"),
          type: "warning"
        });
      } catch (_) {
        return;
      }
      if (!token || token !== Object(reading["c" /* readingToken */])()) return;
      await this.deletePost();
    },
    copyShareText() {
      const textarea = document.createElement("textarea");
      textarea.value = this.shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.$message.success(this.$t("已复制到剪贴板"));
      this.shareDialogVisible = false;
    },
    toggleCommentInput() {
      if (this.$refs.commentInput) {
        this.$refs.commentInput.scrollIntoView({
          behavior: "smooth"
        });
        setTimeout(() => {
          const textarea = this.$refs.commentInput.querySelector("textarea");
          if (textarea) textarea.focus();
        }, 300);
      }
    },
    async submitComment(payload) {
      if (this.isSubmitting) return;
      if (payload) this.commentContent = payload.content || "";
      const image_url = payload && payload.images && payload.images[0] || null;
      try {
        if (!this.isLogin) {
          this.$message.warning(this.$t("请先登录"));
          return;
        }
        if (!this.commentContent.trim() && !image_url) {
          this.$message.warning(this.$t("评论内容不能为空"));
          return;
        }
        this.isSubmitting = true;
        const res = await Object(api_social["b" /* socialRequest */])("/community/comments/create", {}, "POST", {
          post_id: this.post.post_id,
          content: this.commentContent.trim(),
          image_url
        }, true);

        // 添加新评论到列表顶部
        const newComment = {
          ...res.comment,
          // 使用返回的评论数据
          user_name: res.comment.user_name || this.userInfo.name,
          user_avatar: res.comment.user_avatar || this.userInfo.avatar_url,
          create_time: res.comment.create_time || new Date().toISOString(),
          like_count: res.comment.like_count || 0,
          is_liked: false,
          replies: []
        };
        this.comments.unshift(newComment);

        // 更新帖子评论数
        this.$set(this.post, "comment_count", (this.post.comment_count || 0) + 1);

        // 清空输入框
        this.commentContent = "";
        if (this.$refs.composer) this.$refs.composer.reset();
        this.$message.success(this.$t("评论成功"));
      } catch (error) {
        console.error("发表评论失败:", error);
        this.$message.error(this.$t("评论失败，请稍后重试"));
      } finally {
        this.isSubmitting = false;
      }
    },
    replyToComment(comment, parentComment = null) {
      if (this.isSubmitting) return;
      if (!this.isLogin) {
        this.$message.warning(this.$t("请先登录"));
        return;
      }

      // 如果是回复一个回复，那么parentComment就是被回复的那个评论
      // 如果是回复一个评论，那么parentComment就是null
      const replyToUser = parentComment ? comment : null;
      const targetComment = parentComment || comment;
      this.replyingTo = {
        comment_id: targetComment.comment_id,
        parent_id: targetComment.comment_id,
        reply_to_comment_id: comment.comment_id,
        reply_to_user_id: comment.user_id,
        reply_user_name: comment.user_name
      };

      // 滚动到回复框并聚焦
      this.$nextTick(() => {
        const replyInput = this.$el.querySelector(`.comment-item[data-comment-id="${targetComment.comment_id}"] .reply-input-container`);
        if (replyInput) {
          replyInput.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
          setTimeout(() => {
            const textarea = replyInput.querySelector("textarea");
            if (textarea) textarea.focus();
          }, 300);
        }
      });
    },
    cancelReply() {
      this.replyingTo = null;
      this.replyContent = "";
    },
    async submitReply(payload) {
      if (this.isSubmitting || !this.replyingTo) return;
      if (payload) this.replyContent = payload.content || "";
      const image_url = payload && payload.images && payload.images[0] || null;
      try {
        if (!this.isLogin) {
          this.$message.warning(this.$t("请先登录"));
          return;
        }
        if (!this.replyContent.trim() && !image_url) {
          this.$message.warning(this.$t("回复内容不能为空"));
          return;
        }
        this.isSubmitting = true;
        const res = await Object(api_social["b" /* socialRequest */])("/community/comments/create", {}, "POST", {
          post_id: this.post.post_id,
          content: this.replyContent.trim(),
          image_url,
          parent_id: this.replyingTo.reply_to_comment_id,
          reply_to_user_id: this.replyingTo.reply_to_user_id
        }, true);

        // 找到对应的评论
        const parentComment = this.comments.find(c => c.comment_id === this.replyingTo.parent_id);
        if (parentComment) {
          const newReply = {
            ...res.comment,
            user_name: res.comment.user_name || this.userInfo.name,
            user_avatar: res.comment.user_avatar || this.userInfo.avatar_url,
            create_time: res.comment.create_time || new Date().toISOString(),
            like_count: res.comment.like_count || 0,
            is_liked: false,
            reply_user_name: this.replyingTo.reply_user_name
          };
          if (!parentComment.replies) {
            this.$set(parentComment, "replies", []);
          }
          parentComment.replies.push(newReply);
        }

        // 更新帖子评论数
        this.$set(this.post, "comment_count", (this.post.comment_count || 0) + 1);

        // 清空输入框并取消回复状态
        this.cancelReply();
        this.$message.success(this.$t("回复成功"));
      } catch (error) {
        console.error("发表回复失败:", error);
        this.$message.error(this.$t("回复失败，请稍后重试"));
      } finally {
        this.isSubmitting = false;
      }
    },
    async loadMoreComments() {
      if (this.loadingComments || !this.hasMoreComments) return;
      const postId = this.post.post_id;
      this.loadingComments = true;
      try {
        const nextPage = this.commentPage + 1;
        const res = await this.$api.community.getComments({
          post_id: this.post.post_id,
          page: nextPage,
          pageSize: 10
        });
        if (this.post.post_id !== postId) return;
        if (!res || !Array.isArray(res.list) || !Number.isFinite(Number(res.total))) throw new Error("评论数据异常，请重试");
        const known = new Set(this.comments.map(item => item.comment_id));
        const newComments = res.list.filter(item => !known.has(item.comment_id));

        // 处理新加载的评论
        newComments.forEach(comment => {
          if (!comment.replies) {
            comment.replies = [];
          }
        });
        this.comments.push(...newComments);
        this.commentPage = nextPage;
        this.hasMoreComments = nextPage * 10 < Number(res.total);
        this.totalComments = Number(res.total);

        // 获取新加载评论的点赞状态
        this.getCommentsLikeStatus();
        // 加载新评论的初始回复
        this.loadInitialReplies(newComments);
      } catch (error) {
        console.error("加载更多评论失败:", error);
        this.$message.error(this.$t("加载失败，请稍后重试"));
      } finally {
        this.loadingComments = false;
      }
    },
    async loadInitialReplies(commentsToLoad = this.comments) {
      // 为每个评论加载前几条回复
      for (const comment of commentsToLoad) {
        if (comment.reply_count > 0 && (!comment.replies || comment.replies.length === 0)) {
          await this.loadMoreReplies(comment, true);
        }
      }
    },
    async loadMoreReplies(comment, isInitial = false) {
      try {
        const page = isInitial ? 1 : (comment.reply_page || 1) + 1;
        const pageSize = isInitial ? 2 : 5; // 初始加载2条，后续加载5条

        const res = await this.$api.community.getCommentReplies({
          comment_id: comment.comment_id,
          page,
          pageSize
        });
        const newReplies = res.list || [];
        if (isInitial) {
          this.$set(comment, "replies", newReplies);
        } else {
          comment.replies.push(...newReplies);
        }
        this.$set(comment, "reply_page", page);
        this.$set(comment, "has_more_replies", page * pageSize < (res.total || 0));

        // 获取新加载回复的点赞状态
        this.getCommentsLikeStatus();
      } catch (error) {
        console.error(`加载更多回复失败 (评论ID: ${comment.comment_id}):`, error);
      }
    },
    isCommentOwner(comment) {
      return this.currentUserId && comment && this.currentUserId === comment.user_id;
    },
    canDeleteComment(comment) {
      return !!this.userInfo && !!comment && (Number(this.userInfo.user_id) === Number(comment.user_id) || this.canDeletePost);
    },
    async favoriteImage(url) {
      if (this.savingSticker) return;
      const token = Object(reading["c" /* readingToken */])();
      if (!token) {
        this.$router.push({
          path: "/login",
          query: {
            redirect: this.$route.fullPath
          }
        });
        return;
      }
      this.savingSticker = url;
      try {
        await Object(reader_stickers["f" /* saveImageAsReaderSticker */])(url, token);
        if (token === Object(reading["c" /* readingToken */])()) this.$message.success(this.$t("已添加到表情收藏"));
      } catch (error) {
        this.$message.error(error.message || this.$t("收藏失败，请重试"));
      } finally {
        this.savingSticker = "";
      }
    },
    async deletePost() {
      if (this.deletingPost || !this.canDeletePost) return;
      this.deletingPost = true;
      try {
        await Object(api_social["b" /* socialRequest */])(`/community/posts/${this.post.post_id}`, {}, "DELETE", null, true);
        this.$message.success(this.$t("帖子删除成功"));
        this.$router.push("/community");
      } catch (error) {
        this.$message.error(error.message || this.$t("删除失败，请稍后重试"));
      } finally {
        this.deletingPost = false;
      }
    },
    async confirmDeleteComment(comment, parentComment) {
      if (this.deletingComment || !this.canDeleteComment(comment)) return;
      const token = Object(reading["c" /* readingToken */])();
      try {
        await this.$confirm(this.$t("确定要删除这条评论吗？"), this.$t("确认删除"), {
          confirmButtonText: this.$t("删除"),
          cancelButtonText: this.$t("取消"),
          type: "warning"
        });
      } catch (_) {
        return;
      }
      if (!token || token !== Object(reading["c" /* readingToken */])()) return;
      await this.deleteComment(comment, parentComment);
    },
    async deleteComment(comment, parentComment) {
      if (this.deletingComment || !this.canDeleteComment(comment)) return;
      this.deletingComment = comment.comment_id;
      try {
        await Object(api_social["b" /* socialRequest */])(`/community/comments/${comment.comment_id}`, {}, "DELETE", null, true);
        let removed = 1;
        if (Number(comment.parent_id)) {
          const parent = parentComment || this.comments.find(c => c.comment_id === comment.root_id || c.comment_id === comment.parent_id || (c.replies || []).some(r => r.comment_id === comment.comment_id));
          if (parent) {
            const index = (parent.replies || []).findIndex(r => r.comment_id === comment.comment_id);
            if (index >= 0) parent.replies.splice(index, 1);
            this.$set(parent, "total_replies", Math.max(0, Number(parent.total_replies || parent.reply_count || 0) - 1));
            this.$set(parent, "reply_count", Math.max(0, Number(parent.reply_count || 0) - 1));
          }
        } else {
          const index = this.comments.findIndex(c => c.comment_id === comment.comment_id);
          if (index >= 0) this.comments.splice(index, 1);
          removed += Number(comment.reply_count || comment.total_replies || 0);
        }
        this.$set(this.post, "comment_count", Math.max(0, Number(this.post.comment_count || 0) - removed));
        this.$message.success(this.$t("评论删除成功"));
      } catch (error) {
        this.$message.error(error.message || this.$t("删除失败，请稍后重试"));
      } finally {
        this.deletingComment = null;
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/community/post/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var post_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// CONCATENATED MODULE: ./pages/community/post/_id.vue



function _id_injectStyles (context) {
  
  var style0 = __webpack_require__(484)
if (style0.__inject__) style0.__inject__(context)
var style1 = __webpack_require__(486)
if (style1.__inject__) style1.__inject__(context)

}

/* normalize component */

var _id_component = Object(componentNormalizer["a" /* default */])(
  post_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  _id_injectStyles,
  "73c7cbf9",
  "0e9653c7"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (_id_component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map