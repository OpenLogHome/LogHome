exports.ids = [50];
exports.modules = {

/***/ 172:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(194);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("ed252e78", content, true, context)
};

/***/ }),

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/LogPowerWordmark.vue?vue&type=template&id=026f4e20&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "log-power-wordmark",
    class: {
      'is-fallback': _vm.failed
    },
    attrs: {
      "role": "img",
      "aria-label": "原木力"
    }
  }, [_vm._ssrNode(!_vm.failed ? "<img src=\"/brand/log-power-wordmark.png\" alt aria-hidden=\"true\" data-v-026f4e20>" : "<span data-v-026f4e20>原木力</span>")]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/LogPowerWordmark.vue?vue&type=template&id=026f4e20&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/LogPowerWordmark.vue?vue&type=script&lang=js
/* harmony default export */ var LogPowerWordmarkvue_type_script_lang_js = ({
  name: 'LogPowerWordmark',
  data() {
    return {
      failed: false
    };
  }
});
// CONCATENATED MODULE: ./components/LogPowerWordmark.vue?vue&type=script&lang=js
 /* harmony default export */ var components_LogPowerWordmarkvue_type_script_lang_js = (LogPowerWordmarkvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/LogPowerWordmark.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(193)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_LogPowerWordmarkvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "026f4e20",
  "3afa3e90"
  
)

/* harmony default export */ var LogPowerWordmark = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 193:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(172);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.log-power-wordmark[data-v-026f4e20] {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  width: 3.8em;\r\n  height: 1em;\r\n  vertical-align: -0.16em;\r\n  flex-shrink: 0;\r\n  line-height: 1;\r\n  letter-spacing: normal;\r\n  position: relative;\r\n  /* Let the rising arrow extend above the text line without clipping. */\r\n  overflow: visible;\n}\n.log-power-wordmark img[data-v-026f4e20] {\r\n  display: block;\r\n  width: 100%;\r\n  /* Align the letter bodies with adjacent text; the arrow rises above them.\r\n     Canvas: 2051 × 767; letter-body vertical center: 364px. */\r\n  height: 142.1%;\r\n  position: absolute;\r\n  left: 0;\r\n  top: 50%;\r\n  transform: translateY(-47.46%);\r\n  object-fit: contain;\n}\n.log-power-wordmark.is-fallback[data-v-026f4e20] {\r\n  width: auto;\r\n  height: auto;\r\n  position: static;\r\n  overflow: visible;\r\n  vertical-align: baseline;\r\n  line-height: inherit;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 354:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(499);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("23a02c2a", content, true, context)
};

/***/ }),

/***/ 498:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_57791a95_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(354);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_57791a95_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_57791a95_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_57791a95_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_57791a95_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 499:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.power-page[data-v-57791a95]{max-width:1180px;margin:32px auto 80px;padding:0 24px;color:#514535}.power-page nav[data-v-57791a95]{display:flex;gap:12px;font-size:12px;margin-bottom:30px;color:#998d80}.power-page a[data-v-57791a95]{color:#80684e;text-decoration:none}.power-heading[data-v-57791a95]{display:flex;align-items:center;justify-content:space-between;gap:24px}.power-heading p[data-v-57791a95]{font-size:13px;color:#998d80;margin:0 0 10px}.power-heading h1[data-v-57791a95]{display:flex;align-items:center;gap:8px;font-size:26px;margin:0}.power-heading>a[data-v-57791a95]{font-size:13px}.power-summary[data-v-57791a95]{display:flex;align-items:center;gap:48px;margin:28px 0;padding:24px 28px;border:1px solid #e5ddcf;background:#fffdf9;border-radius:12px}.power-summary span[data-v-57791a95]{font-size:12px;color:#998d80}.power-summary strong[data-v-57791a95]{display:block;margin-top:8px;font-size:30px;font-variant-numeric:tabular-nums;color:#947358}.power-summary p[data-v-57791a95]{margin:0 0 0 auto;font-size:12px;line-height:1.9;color:#998d80}.power-grid[data-v-57791a95]{display:grid;grid-template-columns:1.2fr 1fr;gap:24px}.power-card[data-v-57791a95]{background:#fff;border:1px solid #e5ddcf;border-radius:12px;padding:26px}.power-card h2[data-v-57791a95],.power-final h2[data-v-57791a95]{font-size:17px;margin:0 0 24px}.power-card table[data-v-57791a95]{width:100%;border-collapse:collapse;font-size:13px}.power-card th[data-v-57791a95]{font-weight:500}.power-card th[data-v-57791a95],.power-card td[data-v-57791a95]{padding:14px 6px;border-bottom:1px solid #eee8df;text-align:right;font-variant-numeric:tabular-nums}.power-card th[data-v-57791a95]:first-child{text-align:left}.power-card thead[data-v-57791a95]{font-size:12px;color:#998d80}.power-card tfoot[data-v-57791a95]{font-weight:600;color:#80684e}.power-note[data-v-57791a95]{font-size:12px;line-height:1.9;color:#998d80;margin:20px 0 0}.power-card dl[data-v-57791a95]{font-size:12px;margin:0 0 24px}.power-card dl>div[data-v-57791a95]{display:flex;justify-content:space-between;margin:12px 0;gap:20px}.power-card dd[data-v-57791a95]{margin:0;text-align:right}.factor[data-v-57791a95]{padding:14px 18px;background:#f7f5f0;border-radius:8px;margin:12px 0;font-size:13px}.factor>div[data-v-57791a95]{display:flex;justify-content:space-between}.factor p[data-v-57791a95]{font-size:12px;color:#998d80;margin:12px 0 0;line-height:1.7}.factor small[data-v-57791a95]{display:block;color:#947358;margin-top:8px}.power-final[data-v-57791a95]{margin-top:24px;border:1px solid #e5ddcf;border-radius:12px;padding:26px;background:#fffdf9}.power-final h2[data-v-57791a95]{margin-bottom:16px}.power-final p[data-v-57791a95]{font-size:20px;margin:0 0 16px;font-variant-numeric:tabular-nums}.power-final span[data-v-57791a95],.power-final a[data-v-57791a95]{font-size:12px}.power-final span[data-v-57791a95]{color:#998d80}.power-final a[data-v-57791a95]{float:right}.power-page a[data-v-57791a95]:focus-visible{outline:2px solid #947358;outline-offset:4px}@media(max-width:900px){.power-grid[data-v-57791a95]{grid-template-columns:1fr}.power-summary[data-v-57791a95]{gap:24px;flex-wrap:wrap}.power-summary p[data-v-57791a95]{margin:0;flex-basis:100%}}@media(max-width:600px){.power-page[data-v-57791a95]{padding:0 14px;margin-top:24px}.power-heading[data-v-57791a95]{align-items:flex-start;flex-direction:column;gap:14px}.power-heading h1[data-v-57791a95]{font-size:22px}.power-card[data-v-57791a95]{padding:18px 14px}.power-summary[data-v-57791a95]{padding:20px}.power-summary strong[data-v-57791a95]{font-size:26px}.power-final p[data-v-57791a95]{font-size:16px;line-height:1.8}.power-final a[data-v-57791a95]{float:none;display:block;margin-top:14px}}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 565:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/power/_id.vue?vue&type=template&id=57791a95&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('main', {
    staticClass: "power-page"
  }, [_vm._ssrNode("<nav aria-label=\"阅读导航\" data-v-57791a95>", "</nav>", [_c('nuxt-link', {
    attrs: {
      "to": "/read"
    }
  }, [_vm._v("书库")]), _vm._ssrNode("<span data-v-57791a95>/</span>"), _c('nuxt-link', {
    attrs: {
      "to": _vm.workUrl(_vm.power)
    }
  }, [_vm._v(_vm._s(_vm.power.name))]), _vm._ssrNode("<span data-v-57791a95>/</span><span data-v-57791a95>原木力说明</span>")], 2), _vm._ssrNode(" "), _vm._ssrNode("<header class=\"power-heading\" data-v-57791a95>", "</header>", [_vm._ssrNode("<div data-v-57791a95>", "</div>", [_vm._ssrNode("<p data-v-57791a95>" + _vm._ssrEscape(_vm._s(_vm.power.name)) + "</p>"), _vm._ssrNode("<h1 data-v-57791a95>", "</h1>", [_c('LogPowerWordmark'), _vm._ssrNode(" · 分项说明")], 2)], 2), _c('nuxt-link', {
    attrs: {
      "to": "/read/rank?board=logpower"
    }
  }, [_vm._v("查看原木力榜 →")])], 1), _vm._ssrNode(" <section class=\"power-summary\" data-v-57791a95><div data-v-57791a95><span data-v-57791a95>按当前数据计算</span><strong data-v-57791a95>" + _vm._ssrEscape(_vm._s(_vm.format(_vm.power.score))) + "</strong></div><div data-v-57791a95><span data-v-57791a95>当前榜单分值</span><strong data-v-57791a95>" + _vm._ssrEscape(_vm._s(_vm.format(_vm.power.ranked_score))) + "</strong></div><p data-v-57791a95>" + _vm._ssrEscape("数据时间：" + _vm._s(_vm.powerDate(_vm.power.generated_at)) + "（北京时间）") + "<br data-v-57791a95>榜单按批次更新，与当前数据计算结果可能略有差异。</p></section> <div class=\"power-grid\" data-v-57791a95><section class=\"power-card\" data-v-57791a95><h2 data-v-57791a95>基础分计算</h2><table data-v-57791a95><thead data-v-57791a95><tr data-v-57791a95><th scope=\"col\" data-v-57791a95>互动</th><th scope=\"col\" data-v-57791a95>累计数据</th><th scope=\"col\" data-v-57791a95>权重</th><th scope=\"col\" data-v-57791a95>贡献分值</th></tr></thead><tbody data-v-57791a95>" + _vm._ssrList(_vm.breakdown.rows, function (row) {
    return "<tr data-v-57791a95><th scope=\"row\" data-v-57791a95>" + _vm._ssrEscape(_vm._s(row.label)) + "</th><td data-v-57791a95>" + _vm._ssrEscape(_vm._s(_vm.format(row.amount))) + "</td><td data-v-57791a95>" + _vm._ssrEscape("× " + _vm._s(row.weight)) + "</td><td data-v-57791a95>" + _vm._ssrEscape(_vm._s(_vm.format(row.value))) + "</td></tr>";
  }) + "</tbody><tfoot data-v-57791a95><tr data-v-57791a95><th colspan=\"3\" scope=\"row\" data-v-57791a95>基础分总计</th><td data-v-57791a95>" + _vm._ssrEscape(_vm._s(_vm.format(_vm.breakdown.base))) + "</td></tr></tfoot></table><p class=\"power-note\" data-v-57791a95>阅读、收藏、点赞和未删除的作品评论按服务端累计；打赏按礼物数量 × 单价累计，再乘权重。</p></section> <section class=\"power-card\" data-v-57791a95><h2 data-v-57791a95>更新频率修正</h2><dl data-v-57791a95><div data-v-57791a95><dt data-v-57791a95>最近更新</dt><dd data-v-57791a95>" + _vm._ssrEscape(_vm._s(_vm.powerDate(_vm.power.update_time))) + "</dd></div><div data-v-57791a95><dt data-v-57791a95>与计算日期相差</dt><dd data-v-57791a95>" + _vm._ssrEscape(_vm._s(_vm.daysLabel)) + "</dd></div></dl><div class=\"factor\" data-v-57791a95><div data-v-57791a95><span data-v-57791a95>修正系数 A</span><strong data-v-57791a95>" + _vm._ssrEscape(_vm._s(_vm.breakdown.factorA.toFixed(4))) + "</strong></div><p data-v-57791a95>max(0.4, 1 + (相差天数 + 5) × 0.066)</p>" + (_vm.breakdown.factorA === .4 ? "<small data-v-57791a95>已达到下限 0.4</small>" : "<!---->") + "</div><div class=\"factor\" data-v-57791a95><div data-v-57791a95><span data-v-57791a95>修正系数 B</span><strong data-v-57791a95>" + _vm._ssrEscape(_vm._s(_vm.breakdown.factorB.toFixed(4))) + "</strong></div><p data-v-57791a95>max(0.6, 1 + 相差天数 × 0.0035)</p>" + (_vm.breakdown.factorB === .6 ? "<small data-v-57791a95>已达到下限 0.6</small>" : "<!---->") + "</div><p class=\"power-note\" data-v-57791a95>相差天数 = 更新日期 − 计算日期，按服务端日期计算，更新越久，修正系数越低。</p></section></div> "), _vm._ssrNode("<section class=\"power-final\" data-v-57791a95>", "</section>", [_vm._ssrNode("<h2 data-v-57791a95>最终计算</h2><p data-v-57791a95>" + _vm._ssrEscape(_vm._s(_vm.format(_vm.breakdown.base)) + " × " + _vm._s(_vm.breakdown.factorA.toFixed(4)) + " × " + _vm._s(_vm.breakdown.factorB.toFixed(4)) + " ≈ ") + "<strong data-v-57791a95>" + _vm._ssrEscape(_vm._s(_vm.format(_vm.power.score))) + "</strong></p><span data-v-57791a95>原木力反映作品阅读、互动及更新情况。</span>"), _c('nuxt-link', {
    attrs: {
      "to": _vm.workUrl(_vm.power)
    }
  }, [_vm._v("返回作品详情 →")])], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/power/_id.vue?vue&type=template&id=57791a95&scoped=true

// EXTERNAL MODULE: ./components/LogPowerWordmark.vue + 4 modules
var LogPowerWordmark = __webpack_require__(191);

// CONCATENATED MODULE: ./utils/reader-power.js
function normalizePower(source, id) {
  if (!source || Number(source.novel_id) !== Number(id) || !['novel', 'manga', 'world'].includes(source.novel_type)) throw new Error('原木力数据格式无效');
  const data = {
    ...source
  };
  for (const key of ['clicks', 'nices', 'bookmarks', 'comments', 'tips', 'score', 'ranked_score']) {
    if (source[key] === null || source[key] === '' || !Number.isFinite(Number(source[key])) || Number(source[key]) < 0) throw new Error('原木力数据格式无效');
    data[key] = Number(source[key]);
  }
  data.novel_id = Number(id);
  if (typeof source.generated_at === 'number' || /^\d+$/.test(String(source.generated_at))) data.generated_at = Number(source.generated_at);
  if (data.generated_at === null || !Number.isFinite(new Date(data.generated_at).getTime())) throw new Error('原木力计算时间无效');
  data.days_diff = source.days_diff === null ? null : Number(source.days_diff);
  if (data.days_diff !== null && !Number.isSafeInteger(data.days_diff)) throw new Error('原木力日期格式无效');
  return data;
}
function powerBreakdown(data) {
  const rows = [{
    key: 'clicks',
    label: '阅读',
    weight: 8
  }, {
    key: 'bookmarks',
    label: '收藏',
    weight: 200
  }, {
    key: 'comments',
    label: '评论',
    weight: 20
  }, {
    key: 'nices',
    label: '点赞',
    weight: 12
  }, {
    key: 'tips',
    label: '打赏及其他',
    weight: 10
  }].map(row => ({
    ...row,
    amount: data[row.key],
    value: data[row.key] * row.weight
  }));
  const factorA = data.days_diff === null ? .4 : Math.max(.4, 1 + (data.days_diff + 5) * .066);
  const factorB = data.days_diff === null ? .6 : Math.max(.6, 1 + data.days_diff * .0035);
  return {
    rows,
    base: rows.reduce((sum, row) => sum + row.value, 0),
    factorA,
    factorB
  };
}
function powerDate(value) {
  const date = new Date(value);
  return value && Number.isFinite(date.getTime()) ? date.toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    hour12: false
  }) : '暂无记录';
}
// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(11);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(39);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/power/_id.vue?vue&type=script&lang=js




/* harmony default export */ var _idvue_type_script_lang_js = ({
  components: {
    LogPowerWordmark: LogPowerWordmark["a" /* default */]
  },
  async asyncData({
    params,
    $api,
    error
  }) {
    const id = Number(params.id);
    if (!Number.isSafeInteger(id) || id <= 0) return error({
      statusCode: 404,
      message: '作品不存在'
    });
    try {
      return {
        power: normalizePower(await $api.reader.power(id), id)
      };
    } catch (failure) {
      return error({
        statusCode: failure.status === 404 ? 404 : 503,
        message: failure.status === 404 ? '作品不存在或未公开' : '原木力数据暂时不可用，请稍后重试'
      });
    }
  },
  data: () => ({
    power: {}
  }),
  computed: {
    breakdown() {
      return powerBreakdown(this.power);
    },
    daysLabel() {
      const days = this.power.days_diff;
      return days === null ? '暂无记录' : days === 0 ? '今天' : `${Math.abs(days)} 天${days > 0 ? '后' : '前'}`;
    }
  },
  head() {
    return Object(reading_seo["d" /* readingHead */])({
      title: `${this.power.name} - 原木力说明 - 原木社区`,
      description: `查看《${this.power.name}》的阅读、收藏、评论、点赞与打赏贡献，以及更新时间修正公式。`,
      path: `/read/power/${this.power.novel_id}`,
      image: this.power.picUrl
    });
  },
  methods: {
    workUrl: reading_discovery["n" /* workUrl */],
    powerDate: powerDate,
    format(value) {
      return Number(value || 0).toLocaleString('zh-CN', {
        maximumFractionDigits: 2
      });
    }
  }
});
// CONCATENATED MODULE: ./pages/read/power/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var power_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/read/power/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(498)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  power_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "57791a95",
  "39da5553"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map