exports.ids = [55];
exports.modules = {

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

/***/ 601:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/rewards.vue?vue&type=template&id=06d6438d
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('ReaderRewards');
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/rewards.vue?vue&type=template&id=06d6438d

// EXTERNAL MODULE: ./components/read/ReaderRewards.vue + 5 modules
var ReaderRewards = __webpack_require__(282);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(39);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/rewards.vue?vue&type=script&lang=js


/* harmony default export */ var rewardsvue_type_script_lang_js = ({
  components: {
    ReaderRewards: ReaderRewards["a" /* default */]
  },
  head: () => Object(reading_seo["d" /* readingHead */])({
    title: '阅读奖励与树场 - 原木社区',
    description: '查看阅读任务、收集经验球、培育并收获自己的树木。',
    path: '/read/rewards',
    noindex: true
  })
});
// CONCATENATED MODULE: ./pages/read/rewards.vue?vue&type=script&lang=js
 /* harmony default export */ var read_rewardsvue_type_script_lang_js = (rewardsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/read/rewards.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_rewardsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  "083f7794"
  
)

/* harmony default export */ var rewards = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=rewards.js.map