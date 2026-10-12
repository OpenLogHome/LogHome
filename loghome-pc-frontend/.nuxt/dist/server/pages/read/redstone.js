exports.ids = [30];
exports.modules = {

/***/ 250:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(332);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("f96031a6", content, true, context)
};

/***/ }),

/***/ 330:
/***/ (function(module) {

module.exports = JSON.parse("{\"redstone\":{\"aiDeclaration\":{\"title\":\"关于使用生成式人工智能的声明\",\"subtitle\":\"透明使用 · 保护创作 · 尊重选择\",\"models\":\"原木社区的所有 AI 辅助功能均使用市场上已有的模型提供服务。AI 是阅读与创作的辅助工具，不替代创作者的表达、判断与责任。\",\"promiseTitle\":\"用户资产绝不用于模型训练\",\"promise\":\"我们承诺：用户的作品、草稿、设定、图片、提示词、对话记录及其他相关资产，绝不会被用于任何形式的模型训练、微调、蒸馏或训练数据集构建；也不会被出售、共享或授权第三方用于模型训练。\",\"expand\":\"阅读完整声明与使用原则\",\"collapse\":\"收起完整声明\",\"settings\":\"管理 AI 使用偏好\",\"sections\":{\"data\":{\"title\":\"必要的推理传输与数据最小化\",\"body\":\"为完成问答、纠错、图像生成或内容检索，系统可能向模型服务提供方发送所需的内容与上下文。这些处理用于服务推理或检索，不代表授权任何主体将内容用于模型训练。请勿提交密码、他人的敏感信息或你无权提供的内容。\"},\"providers\":{\"title\":\"第三方模型服务同样遵守不训练承诺\",\"body\":\"不训练承诺同样适用于第三方模型服务。模型服务的接入与使用须以禁止利用用户资产训练模型的数据条款和使用设置为前提；不得以改进模型、优化算法等名义绕过这一承诺。\"},\"rights\":{\"title\":\"尊重原创与内容权益\",\"body\":\"使用 AI 辅助不改变你已有作品及相关资产的权益归属。AI 输出不保证独创性或排他性；请核实是否过度复现他人作品，不将洗稿、冒用身份或侵犯他人权益的内容当作原创发布。\"},\"reliability\":{\"title\":\"透明标识与人工核验\",\"body\":\"AI 可能产生事实错误、偏见或不恰当的表达，输出仅供辅助参考，不应被视为已核实的事实或专业意见。重要内容应由人审核；对外发布实质性 AI 生成的内容时，应说明 AI 的参与，避免误导读者。\"},\"safety\":{\"title\":\"安全、公平与负责任使用\",\"body\":\"请遵守社区规则，不利用生成式 AI 制作欺骗、骚扰、仇恨、歧视、侵犯隐私或其他有害内容，不伪造他人身份或散布虚假信息。尊重不同群体与观点，审慎对待模型可能存在的偏见。\"},\"choice\":{\"title\":\"自主选择与问题反馈\",\"body\":\"AI 辅助不是使用原木社区的必要条件。你可在“设置”中开启“禁用人工智能辅助”，隐藏红石中心和 AI 功能入口，普通阅读、写作与发布不受影响。如发现输出错误、安全风险或权益问题，可通过应用内反馈中心提出反馈。\"}}}}}");

/***/ }),

/***/ 331:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_redstone_vue_vue_type_style_index_0_id_7bfab053_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(250);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_redstone_vue_vue_type_style_index_0_id_7bfab053_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_redstone_vue_vue_type_style_index_0_id_7bfab053_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_redstone_vue_vue_type_style_index_0_id_7bfab053_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_redstone_vue_vue_type_style_index_0_id_7bfab053_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 332:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.redstone-center[data-v-7bfab053]{max-width:1180px;margin:0 auto;padding:112px 28px 72px;color:#493e36;font-size:14px}.center-heading[data-v-7bfab053]{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:30px}.center-heading h1[data-v-7bfab053]{font-size:30px;margin:16px 0 8px}.center-heading p[data-v-7bfab053],.quiet[data-v-7bfab053]{color:#928579;line-height:1.8}.center-heading a[data-v-7bfab053],a[data-v-7bfab053]{color:#82654c}.center-gate[data-v-7bfab053]{padding:36px;background:white;border:1px solid #e8e4de;border-radius:14px;margin-bottom:22px}.center-gate p[data-v-7bfab053]{line-height:1.8}.balance-overview[data-v-7bfab053]{display:flex;justify-content:space-between;gap:24px;border:1px solid #e9dacf;border-radius:14px;padding:30px 34px;background:linear-gradient(110deg,#fff9f3,#fff);margin-bottom:22px}.balance-overview span[data-v-7bfab053]{color:#887369}.balance-overview strong[data-v-7bfab053]{display:block;font-size:40px;color:#a75a47;margin-top:10px;font-variant-numeric:tabular-nums}.balance-overview small[data-v-7bfab053]{font-size:14px;font-weight:400}.balance-overview p[data-v-7bfab053]{font-size:13px;color:#887369;margin:12px 0 0}.logs-balance[data-v-7bfab053]{text-align:right}.logs-balance strong[data-v-7bfab053]{font-size:26px;color:#70604e}.logs-balance button[data-v-7bfab053]{margin-top:16px}.center-grid[data-v-7bfab053]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px}.center-panel[data-v-7bfab053]{background:white;border:1px solid #e7e3dd;border-radius:14px;padding:26px;margin-bottom:22px;min-width:0}.center-panel h2[data-v-7bfab053]{font-size:18px;margin:0 0 12px}.center-panel h3[data-v-7bfab053]{font-size:15px;margin:24px 0 12px}.panel-heading[data-v-7bfab053]{display:flex;justify-content:space-between;align-items:center;gap:14px}.panel-heading span[data-v-7bfab053]{color:#9a8375;font-size:13px}.panel-heading h2[data-v-7bfab053]{margin:0}.panel-heading p[data-v-7bfab053]{margin-bottom:0}button[data-v-7bfab053]{border:1px solid #ded7cf;border-radius:7px;background:#fff;color:#776149;padding:8px 13px;cursor:pointer;font:inherit}button[data-v-7bfab053]:disabled{opacity:.5;cursor:default}button[data-v-7bfab053]:focus-visible,input[data-v-7bfab053]:focus-visible,summary[data-v-7bfab053]:focus-visible,a[data-v-7bfab053]:focus-visible{outline:2px solid #a56f54;outline-offset:3px}.exchange-panel label[data-v-7bfab053]{display:block;font-size:13px;margin:22px 0 10px}.amount-field[data-v-7bfab053]{display:flex;align-items:center;gap:12px;border:1px solid #dccdbf;border-radius:9px;padding:12px 16px}.amount-field input[data-v-7bfab053]{width:100%;min-width:0;font:inherit;font-size:24px;border:0;background:transparent;color:#493e36}.amount-field span[data-v-7bfab053]{white-space:nowrap;color:#928579}.quick-amounts[data-v-7bfab053]{display:flex;gap:9px;margin:12px 0 24px}.quick-amounts button[data-v-7bfab053]{flex:1}.quick-amounts button[aria-pressed=true][data-v-7bfab053]{color:#a75a47;border-color:#c58b76;background:#fff6f0}.cost-line[data-v-7bfab053]{display:flex;justify-content:space-between;border-top:1px solid #eee8e2;padding-top:20px;margin-bottom:20px}.cost-line strong[data-v-7bfab053]{font-size:20px;color:#957152}.exchange-button[data-v-7bfab053]{width:100%;background:#aa6650;border-color:#aa6650;color:white;padding:13px}.grant-list[data-v-7bfab053]{margin:20px 0}.grant-list>div[data-v-7bfab053]{display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid #eee8e2}.grant-list dd[data-v-7bfab053]{font-size:20px;font-weight:600;margin:0;color:#a75a47}.grant-list small[data-v-7bfab053]{font-size:12px;font-weight:400;color:#928579}.ai-uses[data-v-7bfab053]{padding-left:18px;line-height:2;color:#76675b}.error[data-v-7bfab053]{color:#ac453b;font-size:13px;line-height:1.8}.success[data-v-7bfab053]{color:#657948;line-height:1.8}.pending-note[data-v-7bfab053]{padding:12px;background:#fff5e7;border-radius:7px;line-height:1.8;color:#907044}.records-scroll[data-v-7bfab053]{overflow-x:auto;margin-top:22px}table[data-v-7bfab053]{border-collapse:collapse;width:100%;font-size:13px;min-width:650px}th[data-v-7bfab053],td[data-v-7bfab053]{text-align:left;padding:15px 12px;border-bottom:1px solid #ece7e1}th[data-v-7bfab053]{font-size:12px;font-weight:400;color:#96877a}td[data-v-7bfab053]:first-child{white-space:nowrap}.record-amount[data-v-7bfab053]{font-variant-numeric:tabular-nums;font-weight:600;color:#647f49}.record-amount.spent[data-v-7bfab053]{color:#af6452}.history-pagination[data-v-7bfab053]{display:flex;justify-content:center;align-items:center;gap:16px;margin-top:22px;font-size:13px}.declaration-panel p[data-v-7bfab053]{line-height:1.9}.declaration-panel summary[data-v-7bfab053]{cursor:pointer;color:#82654c;margin-top:20px}.declaration-panel details section[data-v-7bfab053]{border-top:1px solid #eee8e2;margin-top:22px}.center-gate h2[data-v-7bfab053]{font-size:20px}@media(max-width:800px){.redstone-center[data-v-7bfab053]{padding:100px 20px 50px}.center-grid[data-v-7bfab053]{grid-template-columns:minmax(0,1fr)}.center-heading[data-v-7bfab053]{align-items:flex-start}.balance-overview[data-v-7bfab053]{padding:24px}.center-panel[data-v-7bfab053]{padding:22px}}@media(max-width:450px){.redstone-center[data-v-7bfab053]{padding-left:14px;padding-right:14px}.center-heading[data-v-7bfab053]{flex-direction:column;gap:12px}.balance-overview[data-v-7bfab053]{padding:20px;gap:14px}.balance-overview strong[data-v-7bfab053]{font-size:30px}.logs-balance strong[data-v-7bfab053]{font-size:22px}.panel-heading[data-v-7bfab053]{align-items:flex-start;flex-wrap:wrap}.history-pagination[data-v-7bfab053]{gap:10px}.history-pagination button[data-v-7bfab053]{padding:8px}.grant-list small[data-v-7bfab053]{font-size:11px}}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 416:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/redstone.vue?vue&type=template&id=7bfab053&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "redstone-center",
    attrs: {
      "aria-labelledby": "redstone-title"
    }
  }, [_vm._ssrNode("<header class=\"center-heading\" data-v-7bfab053>", "</header>", [_vm._ssrNode("<div data-v-7bfab053>", "</div>", [_c('nuxt-link', {
    attrs: {
      "to": "/read"
    }
  }, [_vm._v("← 返回书库")]), _vm._ssrNode("<h1 id=\"redstone-title\" data-v-7bfab053>红石中心</h1><p data-v-7bfab053>为阅读与创作补充一点灵感能量</p>")], 2), _c('nuxt-link', {
    attrs: {
      "to": "/me/settings"
    }
  }, [_vm._v("AI 辅助设置")])], 1), _vm._ssrNode(" "), !_vm.ready ? _vm._ssrNode("<div class=\"center-gate\" data-v-7bfab053>", "</div>", [_vm._ssrNode("正在读取账户状态…")], 2) : _vm.disabled ? _vm._ssrNode("<div class=\"center-gate\" data-v-7bfab053>", "</div>", [_vm._ssrNode("<h2 data-v-7bfab053>AI 辅助已关闭</h2><p data-v-7bfab053>开启 AI 辅助后，可以查看红石余额与兑换记录。</p>"), _c('nuxt-link', {
    attrs: {
      "to": "/me/settings"
    }
  }, [_vm._v("前往设置")])], 2) : !_vm.token || _vm.authExpired ? _vm._ssrNode("<div class=\"center-gate\" data-v-7bfab053>", "</div>", [_vm._ssrNode("<h2 data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.authExpired ? '登录已失效' : '登录后查看我的红石')) + "</h2><p data-v-7bfab053>红石用于原木娘助读、AI 创作等智能功能。</p>"), _c('nuxt-link', {
    attrs: {
      "to": _vm.loginUrl
    }
  }, [_vm._v("登录后继续")])], 2) : _vm._ssrNode("<div class=\"balance-overview\" data-v-7bfab053><div data-v-7bfab053><span data-v-7bfab053>我的红石</span><strong data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.account ? _vm.account.total.toLocaleString() : '—') + " ") + "<small data-v-7bfab053>红石</small></strong><p data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.account ? '永久 ' + _vm.account.permanent.toLocaleString() + ' · 赠送 ' + _vm.account.expiring.toLocaleString() : '尚未取得余额')) + "</p>" + (_vm.account && _vm.account.expiration ? "<p data-v-7bfab053>" + _vm._ssrEscape("最近到期：" + _vm._s(_vm.date(_vm.account.expiration)) + "（北京时间）") + "</p>" : "<!---->") + "</div><div class=\"logs-balance\" data-v-7bfab053><span data-v-7bfab053>可用原木</span><strong data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.account ? _vm.account.log.toLocaleString() : '—')) + "</strong><button" + _vm._ssrAttr("disabled", _vm.accountLoading || _vm.submitting) + " data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.accountLoading ? '刷新中…' : '刷新余额')) + "</button></div></div> " + (_vm.accountError ? "<p role=\"alert\" class=\"error\" data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.accountError)) + "</p>" : "<!---->") + (_vm.storageError ? "<p role=\"alert\" class=\"error\" data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.storageError) + " ") + "<button data-v-7bfab053>重新读取兑换记录</button></p>" : "<!---->") + " <div class=\"center-grid\" data-v-7bfab053><section aria-labelledby=\"exchange-title\" class=\"center-panel exchange-panel\" data-v-7bfab053><div class=\"panel-heading\" data-v-7bfab053><h2 id=\"exchange-title\" data-v-7bfab053>兑换红石</h2><span data-v-7bfab053>10 原木 = 1 红石</span></div><p class=\"quiet\" data-v-7bfab053>兑换所得红石永久有效，兑换后不可撤销。</p><label for=\"redstone-amount\" data-v-7bfab053>兑换数量</label><div class=\"amount-field\" data-v-7bfab053><input id=\"redstone-amount\" inputmode=\"numeric\" maxlength=\"6\" autocomplete=\"off\"" + _vm._ssrAttr("disabled", !!_vm.pending || _vm.submitting || _vm.confirming) + " placeholder=\"1–100000\"" + _vm._ssrAttr("value", _vm.amount) + " data-v-7bfab053><span data-v-7bfab053>红石</span></div><div class=\"quick-amounts\" data-v-7bfab053>" + _vm._ssrList([10, 50, 100, 300], function (value) {
    return "<button" + _vm._ssrAttr("disabled", !!_vm.pending || _vm.submitting || _vm.confirming) + _vm._ssrAttr("aria-pressed", Number(_vm.amount) === value) + " data-v-7bfab053>" + _vm._ssrEscape(_vm._s(value)) + "</button>";
  }) + "</div><div class=\"cost-line\" data-v-7bfab053><span data-v-7bfab053>需要支付</span><strong data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.cost.toLocaleString()) + " 原木") + "</strong></div>" + (_vm.validAmount && _vm.account && _vm.cost > _vm.account.log && !_vm.pending ? "<p class=\"error\" data-v-7bfab053>原木余额不足</p>" : "<!---->") + (_vm.pending ? "<p role=\"status\" class=\"pending-note\" data-v-7bfab053>" + _vm._ssrEscape("上次 " + _vm._s(_vm.pending.amount) + " 红石兑换的结果尚待确认。重试会复用同一兑换编号，避免重复扣除原木。") + "</p>" : "<!---->") + "<button" + _vm._ssrAttr("disabled", _vm.submitting || _vm.confirming || !!_vm.storageError || !_vm.pending && !_vm.canExchange) + " class=\"exchange-button\" data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.submitting ? '兑换处理中…' : _vm.confirming ? '等待确认…' : _vm.pending ? '确认上次兑换结果' : '确认兑换')) + "</button>" + (_vm.exchangeError ? "<p role=\"alert\" class=\"error\" data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.exchangeError)) + "</p>" : "<!---->") + (_vm.notice ? "<p role=\"status\" class=\"success\" data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.notice)) + "</p>" : "<!---->") + "</section> <section aria-labelledby=\"grants-title\" class=\"center-panel\" data-v-7bfab053><h2 id=\"grants-title\" data-v-7bfab053>每月赠送</h2><p class=\"quiet\" data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.account ? '赠送红石有效期为 ' + _vm.account.validity + ' 个月，使用时优先消耗临近到期的赠送红石。' : '取得账户信息后显示当前赠送标准。')) + "</p><dl class=\"grant-list\" data-v-7bfab053><div data-v-7bfab053><dt data-v-7bfab053>普通用户</dt><dd data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.account ? _vm.account.ordinaryGrant : '—') + " ") + "<small data-v-7bfab053>红石 / 月</small></dd></div><div data-v-7bfab053><dt data-v-7bfab053>原木通行证</dt><dd data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.account ? _vm.account.standardGrant : '—') + " ") + "<small data-v-7bfab053>红石 / 周期</small></dd></div><div data-v-7bfab053><dt data-v-7bfab053>超级原木通行证</dt><dd data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.account ? _vm.account.superGrant : '—') + " ") + "<small data-v-7bfab053>红石 / 周期</small></dd></div></dl><p class=\"quiet\" data-v-7bfab053>普通用户每月首次访问时到账；通行证月付开通或续费到账，年付按月到账。</p><a" + _vm._ssrAttr("href", _vm.membershipUrl) + " target=\"_blank\" rel=\"noopener\" data-v-7bfab053>查看原木通行证 ↗</a><h3 data-v-7bfab053>红石可以做什么？</h3><ul class=\"ai-uses\" data-v-7bfab053><li data-v-7bfab053>原木娘助读：快速 1 红石，深入 2 红石</li><li data-v-7bfab053>AI 创作：普通 1 红石，深度思考 2 红石</li><li data-v-7bfab053>图像生成：5 红石；智能纠错普通用户 2 红石，通行证免费</li></ul><p class=\"quiet\" data-v-7bfab053>具体消耗以使用页面提示为准。</p></section></div> <section aria-labelledby=\"records-title\" class=\"center-panel records-panel\" data-v-7bfab053><div class=\"panel-heading\" data-v-7bfab053><div data-v-7bfab053><h2 id=\"records-title\" data-v-7bfab053>红石流水</h2><p class=\"quiet\" data-v-7bfab053>赠送、兑换、到期与 AI 使用记录 · 时间均为北京时间</p></div><button" + _vm._ssrAttr("disabled", _vm.historyLoading || _vm.submitting) + " data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.historyLoading ? '读取中…' : '刷新流水')) + "</button></div>" + (_vm.historyError ? "<p role=\"alert\" class=\"error\" data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.historyError) + " ") + "<button" + _vm._ssrAttr("disabled", _vm.historyLoading) + " data-v-7bfab053>重试</button></p>" : "<!---->") + (_vm.records.length ? "<div class=\"records-scroll\" data-v-7bfab053><table data-v-7bfab053><thead data-v-7bfab053><tr data-v-7bfab053><th scope=\"col\" data-v-7bfab053>时间</th><th scope=\"col\" data-v-7bfab053>项目</th><th scope=\"col\" data-v-7bfab053>原木支出</th><th scope=\"col\" data-v-7bfab053>红石变动</th><th scope=\"col\" data-v-7bfab053>有效期 / 剩余</th></tr></thead><tbody data-v-7bfab053>" + _vm._ssrList(_vm.records, function (row) {
    return "<tr data-v-7bfab053><td data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.date(row.created_at))) + "</td><td data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.title(row))) + "</td><td data-v-7bfab053>" + _vm._ssrEscape(_vm._s(row.log_cost ? row.log_cost.toLocaleString() : '—')) + "</td><td" + _vm._ssrClass("record-amount", {
      spent: row.amount < 0
    }) + " data-v-7bfab053>" + _vm._ssrEscape(_vm._s(row.amount > 0 ? '+' : '') + _vm._s(row.amount.toLocaleString())) + "</td><td data-v-7bfab053>" + _vm._ssrEscape(_vm._s(row.expires_at ? _vm.date(row.expires_at) + (row.remaining_amount != null ? ' · 剩余 ' + row.remaining_amount : '') : row.transaction_type === 'log_exchange' ? '永久有效' : '—')) + "</td></tr>";
  }) + "</tbody></table></div>" : !_vm.historyLoading && !_vm.historyError ? "<p class=\"quiet\" data-v-7bfab053>暂无红石流水</p>" : "<!---->") + (_vm.total > 20 ? "<nav aria-label=\"红石流水分页\" class=\"history-pagination\" data-v-7bfab053><button" + _vm._ssrAttr("disabled", _vm.page <= 1 || _vm.historyLoading || _vm.submitting) + " data-v-7bfab053>上一页</button><span data-v-7bfab053>" + _vm._ssrEscape("第 " + _vm._s(_vm.page) + " / " + _vm._s(Math.ceil(_vm.total / 20)) + " 页 · " + _vm._s(_vm.total) + " 条") + "</span><button" + _vm._ssrAttr("disabled", _vm.page * 20 >= _vm.total || _vm.historyLoading || _vm.submitting) + " data-v-7bfab053>下一页</button></nav>" : "<!---->") + "</section>"), _vm._ssrNode(" "), _vm._ssrNode("<section class=\"center-panel declaration-panel\" data-v-7bfab053>", "</section>", [_vm._ssrNode("<h2 data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.declaration.title)) + "</h2><p class=\"quiet\" data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.declaration.subtitle)) + "</p><p data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.declaration.models)) + "</p><h3 data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.declaration.promiseTitle)) + "</h3><p data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.declaration.promise)) + "</p>"), _vm._ssrNode("<details data-v-7bfab053>", "</details>", [_vm._ssrNode("<summary data-v-7bfab053>" + _vm._ssrEscape(_vm._s(_vm.declaration.expand)) + "</summary>" + _vm._ssrList(_vm.declaration.sections, function (section, key) {
    return "<section data-v-7bfab053><h3 data-v-7bfab053>" + _vm._ssrEscape(_vm._s(section.title)) + "</h3><p data-v-7bfab053>" + _vm._ssrEscape(_vm._s(section.body)) + "</p></section>";
  })), _c('nuxt-link', {
    attrs: {
      "to": "/me/settings"
    }
  }, [_vm._v(_vm._s(_vm.declaration.settings))])], 2)], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/redstone.vue?vue&type=template&id=7bfab053&scoped=true

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reader-ai.js
var reader_ai = __webpack_require__(36);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(34);

// EXTERNAL MODULE: ./assets/data/reader-redstone-declaration.json
var reader_redstone_declaration = __webpack_require__(330);

// CONCATENATED MODULE: ./utils/reader-redstone.js

const integer = (value, name, minimum = 0) => {
  if (value == null || value === '' || !Number.isSafeInteger(Number(value)) || Number(value) < minimum) throw new Error(`${name}数据异常，请刷新重试。`);
  return Number(value);
};
function redstoneAccount(raw) {
  if (!raw || !raw.exchange_rate || Number(raw.exchange_rate.log) !== 10 || Number(raw.exchange_rate.redstone) !== 1) throw new Error('兑换汇率加载失败，请刷新重试。');
  const result = {
    log: integer(raw.log_balance, '原木余额'),
    total: integer(raw.redstone_balance, '红石余额'),
    permanent: integer(raw.permanent_balance, '永久红石'),
    expiring: integer(raw.expiring_balance, '赠送红石'),
    standardGrant: integer(raw.membership_grants && raw.membership_grants.standard, '通行证赠送'),
    superGrant: integer(raw.membership_grants && raw.membership_grants.super, '超级通行证赠送'),
    ordinaryGrant: integer(raw.ordinary_monthly_grant, '普通用户赠送'),
    validity: integer(raw.gift_validity_months, '赠送有效期', 1),
    expiration: raw.next_expiration_at || null
  };
  if (result.total !== result.permanent + result.expiring || result.expiration && !Number.isFinite(new Date(result.expiration).getTime())) throw new Error('红石余额明细异常，请刷新重试。');
  return result;
}
function redstoneHistory(raw, page) {
  if (!raw || !Array.isArray(raw.list) || integer(raw.page, '流水页码', 1) !== page || integer(raw.pageSize, '流水条数', 1) !== 20) throw new Error('流水数据异常，请重试。');
  const total = integer(raw.total, '流水总数'),
    ids = new Set();
  if (raw.list.length > 20 || raw.list.length > total) throw new Error('流水条数异常，请重试。');
  const list = raw.list.map(row => {
    const id = integer(row.transaction_id, '流水编号', 1);
    if (ids.has(id) || row.amount == null || row.amount === '' || !Number.isFinite(new Date(row.created_at).getTime()) || row.created_at == null || row.expires_at && !Number.isFinite(new Date(row.expires_at).getTime())) throw new Error('流水记录异常，请重试。');
    ids.add(id);
    return {
      ...row,
      transaction_id: id,
      amount: integer(Math.abs(Number(row.amount)), '流水数量') * (Number(row.amount) < 0 ? -1 : 1),
      log_cost: integer(row.log_cost, '流水原木'),
      remaining_amount: row.remaining_amount == null ? null : integer(row.remaining_amount, '剩余赠送')
    };
  });
  return {
    list,
    total,
    page
  };
}
function redstoneAmount(value) {
  return /^\d{1,6}$/.test(String(value)) && Number(value) >= 1 && Number(value) <= 100000 ? Number(value) : 0;
}
function redstoneReceipt(raw, pending) {
  if (!raw || integer(raw.redstone_amount, '到账红石', 1) !== pending.amount || integer(raw.log_cost, '兑换成本') !== pending.amount * 10) throw new Error('兑换回执异常，请核对流水后重试同一兑换。');
  return {
    amount: pending.amount,
    log: integer(raw.log_balance, '原木余额'),
    total: integer(raw.redstone_balance, '红石余额'),
    replayed: raw.replayed === true
  };
}
function redstoneRequestId() {
  return `redstone-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2)}`;
}
function pendingKey(token) {
  return Object(reader_ai["h" /* aiStorageKey */])(token).replace('loghome_pc_reader_ai_v1_', 'loghome_pc_redstone_pending_v1_');
}
function readPendingRedstone(storage, token) {
  const stored = storage.getItem(pendingKey(token));
  if (!stored) return null;
  let value;
  try {
    value = JSON.parse(stored);
  } catch (_) {
    throw new Error('上次兑换记录损坏，请先核对红石流水。');
  }
  if (!value || value.version !== 1 || !redstoneAmount(value.amount) || !/^redstone-[a-zA-Z0-9-]{8,60}$/.test(value.id)) throw new Error('上次兑换记录异常，请先核对红石流水。');
  return {
    version: 1,
    id: value.id,
    amount: Number(value.amount),
    uncertain: true
  };
}
function savePendingRedstone(storage, token, pending) {
  storage.setItem(pendingKey(token), JSON.stringify({
    version: 1,
    id: pending.id,
    amount: pending.amount
  }));
}
function clearPendingRedstone(storage, token) {
  storage.removeItem(pendingKey(token));
}
function redstoneTitle(row) {
  const names = {
    membership_grant: '通行证赠送',
    membership_upgrade_grant: '升级通行证补赠',
    annual_refresh: '年付会员每月赠送',
    monthly_free_grant: '普通用户每月赠送',
    log_exchange: '原木兑换',
    ai_usage: 'AI 功能消耗',
    admin_adjustment: '系统调整',
    refund: '退款返还',
    expiration: '赠送红石过期'
  };
  return row.transaction_type === 'ai_usage' && row.description ? row.description : names[row.transaction_type] || row.description || '红石变动';
}
function redstoneDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date) : '—';
}
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/redstone.vue?vue&type=script&lang=js





/* harmony default export */ var redstonevue_type_script_lang_js = ({
  data: () => ({
    ready: false,
    disabled: false,
    token: null,
    authExpired: false,
    account: null,
    accountLoading: false,
    accountError: '',
    records: [],
    total: 0,
    page: 1,
    historyLoading: false,
    historyError: '',
    amount: '',
    pending: null,
    storageError: '',
    exchangeError: '',
    notice: '',
    submitting: false,
    confirming: false,
    epoch: 0,
    accountVersion: 0,
    historyVersion: 0,
    declaration: reader_redstone_declaration.redstone.aiDeclaration
  }),
  computed: {
    validAmount() {
      return redstoneAmount(this.amount);
    },
    cost() {
      return this.validAmount * 10;
    },
    canExchange() {
      return !!this.account && !this.accountLoading && !this.accountError && this.validAmount > 0 && this.cost <= this.account.log;
    },
    loginUrl() {
      return {
        path: '/login',
        query: {
          redirect: '/read/redstone'
        }
      };
    },
    membershipUrl() {
      return `${"https://m.loghome.ink"}/#/pages/membership/index`;
    }
  },
  mounted() {
    this.checkContext();
    this.ready = true;
    window.addEventListener('focus', this.checkContext);
    window.addEventListener('storage', this.checkContext);
    window.addEventListener(reader_ai["a" /* AI_PREFERENCE_EVENT */], this.checkContext);
  },
  beforeDestroy() {
    this.epoch++;
    window.removeEventListener('focus', this.checkContext);
    window.removeEventListener('storage', this.checkContext);
    window.removeEventListener(reader_ai["a" /* AI_PREFERENCE_EVENT */], this.checkContext);
  },
  head() {
    return Object(reading_seo["d" /* readingHead */])({
      title: '红石中心 - 原木社区',
      description: '查看红石余额、兑换红石和查询 AI 功能消费记录。',
      path: '/read/redstone',
      noindex: true
    });
  },
  methods: {
    title: redstoneTitle,
    date: redstoneDate,
    current(token, epoch) {
      return this.token === token && Object(reading["c" /* readingToken */])() === token && this.epoch === epoch && !Object(reader_ai["m" /* readerAiDisabled */])();
    },
    checkContext(event) {
      const token = Object(reading["c" /* readingToken */])(),
        disabled = Object(reader_ai["m" /* readerAiDisabled */])();
      if (this.ready && token === this.token && disabled === this.disabled) {
        if (event && event.key === pendingKey(token)) this.readPending();
        return;
      }
      this.epoch++;
      this.accountVersion++;
      this.historyVersion++;
      Object.assign(this, {
        token,
        disabled,
        authExpired: false,
        account: null,
        accountLoading: false,
        accountError: '',
        records: [],
        total: 0,
        page: 1,
        historyLoading: false,
        historyError: '',
        amount: '',
        pending: null,
        storageError: '',
        exchangeError: '',
        notice: '',
        submitting: false,
        confirming: false
      });
      if (token && !disabled) {
        this.readPending();
        this.loadAccount();
        this.loadHistory(1);
      }
    },
    readPending() {
      this.checkContextIfChanged();
      if (!this.token || this.disabled || this.submitting) return;
      try {
        this.pending = readPendingRedstone(localStorage, this.token);
        this.storageError = '';
        if (this.pending) this.amount = String(this.pending.amount);
      } catch (error) {
        this.storageError = error.message || '兑换记录无法读取，请检查浏览器存储权限。';
      }
    },
    checkContextIfChanged() {
      if (Object(reading["c" /* readingToken */])() !== this.token || Object(reader_ai["m" /* readerAiDisabled */])() !== this.disabled) this.checkContext();
    },
    expire(error) {
      if (error.status === 401 || error.status === 403) this.authExpired = true;
    },
    async loadAccount() {
      this.checkContextIfChanged();
      if (!this.token || this.disabled || this.submitting) return;
      const token = this.token,
        epoch = this.epoch,
        version = ++this.accountVersion;
      this.accountLoading = true;
      this.accountError = '';
      try {
        const value = redstoneAccount(await this.$api.reader.redstoneAccount());
        if (!this.current(token, epoch) || version !== this.accountVersion) return;
        this.account = value;
      } catch (error) {
        if (!this.current(token, epoch) || version !== this.accountVersion) return;
        this.account = null;
        this.accountError = error.message || '红石余额读取失败';
        this.expire(error);
      } finally {
        if (this.current(token, epoch) && version === this.accountVersion) this.accountLoading = false;
      }
    },
    async loadHistory(page = 1) {
      this.checkContextIfChanged();
      if (!this.token || this.disabled || this.submitting || !Number.isSafeInteger(page) || page < 1) return;
      const token = this.token,
        epoch = this.epoch,
        version = ++this.historyVersion;
      this.historyLoading = true;
      this.historyError = '';
      try {
        const result = redstoneHistory(await this.$api.reader.redstoneTransactions(page), page);
        if (!this.current(token, epoch) || version !== this.historyVersion) return;
        this.records = result.list;
        this.total = result.total;
        this.page = page;
      } catch (error) {
        if (!this.current(token, epoch) || version !== this.historyVersion) return;
        this.historyError = error.message || '红石流水读取失败';
        this.expire(error);
      } finally {
        if (this.current(token, epoch) && version === this.historyVersion) this.historyLoading = false;
      }
    },
    async exchange() {
      this.checkContextIfChanged();
      if (!this.token || this.disabled || this.authExpired || this.submitting || this.confirming || this.storageError || !this.pending && !this.canExchange) return;
      const token = this.token,
        epoch = this.epoch,
        pending = this.pending || {
          id: redstoneRequestId(),
          amount: this.validAmount,
          uncertain: false
        };
      this.confirming = true;
      this.exchangeError = '';
      this.notice = '';
      try {
        await this.$confirm(this.pending ? `核对上次 ${pending.amount} 红石兑换。系统将复用同一编号，已完成的兑换不会重复扣除原木。` : `将消耗 ${pending.amount * 10} 原木，兑换 ${pending.amount} 红石。兑换所得红石永久有效，兑换后不可撤销。`, this.pending ? '确认上次兑换结果' : '确认兑换红石', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        });
        if (!this.current(token, epoch) || this.authExpired || !this.pending && (!this.canExchange || this.validAmount !== pending.amount)) return;
        try {
          const stored = readPendingRedstone(localStorage, token);
          if (stored && stored.id !== pending.id) {
            this.pending = stored;
            this.amount = String(stored.amount);
            this.exchangeError = '另一个页面有尚未确认的兑换，请先核对该兑换结果。';
            return;
          }
          savePendingRedstone(localStorage, token, pending);
        } catch (_) {
          this.storageError = '兑换记录无法保存或读取，请检查浏览器存储权限后重试。';
          return;
        }
        this.pending = pending;
        this.amount = String(pending.amount);
        this.submitting = true;
        this.accountVersion++;
        this.historyVersion++;
        this.accountLoading = false;
        this.historyLoading = false;
        try {
          const receipt = redstoneReceipt(await this.$api.reader.exchangeRedstone(pending.amount, pending.id), pending);
          if (!this.current(token, epoch)) return;
          try {
            clearPendingRedstone(localStorage, token);
            this.pending = null;
            this.amount = '';
          } catch (_) {
            this.pending = {
              ...pending,
              uncertain: true
            };
            this.storageError = '兑换已确认，但兑换记录未能清除。再次核对会使用相同编号。';
          }
          this.notice = `${receipt.replayed ? '已确认上次兑换' : '兑换成功'}：${receipt.amount} 红石已到账。`;
        } catch (error) {
          if (!this.current(token, epoch)) return;
          this.exchangeError = error.message || '兑换结果尚未确认，请重试同一兑换。';
          this.expire(error);
          if (!pending.uncertain && [400, 409, 422].includes(error.status)) {
            try {
              clearPendingRedstone(localStorage, token);
              this.pending = null;
            } catch (_) {
              this.pending = {
                ...pending,
                uncertain: true
              };
              this.storageError = '兑换记录无法清除，请检查浏览器存储权限。';
            }
          } else this.pending = {
            ...pending,
            uncertain: true
          };
        } finally {
          if (this.current(token, epoch)) {
            this.submitting = false;
            await this.loadAccount();
            await this.loadHistory(1);
          }
        }
      } catch (error) {
        if (this.current(token, epoch) && error !== 'cancel' && error !== 'close') this.exchangeError = error.message || '确认操作未完成，请重试。';
      } finally {
        if (this.current(token, epoch)) this.confirming = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/read/redstone.vue?vue&type=script&lang=js
 /* harmony default export */ var read_redstonevue_type_script_lang_js = (redstonevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/read/redstone.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(331)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_redstonevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "7bfab053",
  "5b10e634"
  
)

/* harmony default export */ var redstone = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=redstone.js.map