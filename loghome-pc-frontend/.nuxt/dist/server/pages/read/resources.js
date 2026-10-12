exports.ids = [31];
exports.modules = {

/***/ 251:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(334);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("9410fdca", content, true, context)
};

/***/ }),

/***/ 333:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resources_vue_vue_type_style_index_0_id_69f82d72_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(251);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resources_vue_vue_type_style_index_0_id_69f82d72_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resources_vue_vue_type_style_index_0_id_69f82d72_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resources_vue_vue_type_style_index_0_id_69f82d72_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_resources_vue_vue_type_style_index_0_id_69f82d72_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 334:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".resources-guide[data-v-69f82d72]{max-width:1180px;margin:0 auto;padding:112px 28px 70px;color:#514739}.resources-guide a[data-v-69f82d72]{color:#778957;text-decoration:none}.intro[data-v-69f82d72]{display:grid;grid-template-columns:1fr 420px;align-items:center;gap:38px;margin:35px 0}.intro small[data-v-69f82d72]{color:#8c9c67;font-size:13px}.intro h1[data-v-69f82d72]{font-size:30px;line-height:1.5;margin:12px 0}.intro p[data-v-69f82d72],p[data-v-69f82d72]{color:#958978;font-size:14px;line-height:1.9}.intro img[data-v-69f82d72]{width:100%;height:200px;object-fit:contain;border-radius:16px;background:#fffcf4}.channels[data-v-69f82d72]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.channels article[data-v-69f82d72]{background:white;border:1px solid #e5e6dc;border-radius:13px;padding:24px;display:flex;flex-direction:column;min-width:0}.channel-title[data-v-69f82d72]{display:flex;align-items:center;gap:9px;flex-wrap:wrap}.channel-title>span[data-v-69f82d72]{font-size:14px;padding:7px;background:#eef1e4;border-radius:6px;color:#829159}.channel-title h2[data-v-69f82d72]{font-size:17px;margin:0}.channel-title small[data-v-69f82d72]{font-size:11px;color:#a39987}.channels ol[data-v-69f82d72]{padding-left:20px;font-size:13px;line-height:1.9;color:#988c7a;flex:1}.channels li[data-v-69f82d72]{margin:8px 0}.channels a[data-v-69f82d72]{font-size:14px;border-top:1px solid #efede5;padding-top:18px;margin-top:10px}aside[data-v-69f82d72]{margin-top:28px;border:1px solid #e7e5dd;background:#fff;border-radius:13px;padding:24px}aside h2[data-v-69f82d72]{font-size:17px;margin:0}a[data-v-69f82d72]:focus-visible{outline:2px solid #8da366;outline-offset:3px}@media(max-width:900px){.intro[data-v-69f82d72]{grid-template-columns:1fr 280px;gap:20px}.channels[data-v-69f82d72]{grid-template-columns:1fr}.channels ol[data-v-69f82d72]{margin-top:0}.intro h1[data-v-69f82d72]{font-size:25px}}@media(max-width:600px){.resources-guide[data-v-69f82d72]{padding:100px 18px 50px}.intro[data-v-69f82d72]{grid-template-columns:1fr;gap:10px}.intro img[data-v-69f82d72]{height:160px}.intro h1[data-v-69f82d72]{font-size:24px}.channels article[data-v-69f82d72]{padding:20px}}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 433:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/resources.vue?vue&type=template&id=69f82d72&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "resources-guide"
  }, [_vm._ssrNode("<header data-v-69f82d72>", "</header>", [_c('nuxt-link', {
    attrs: {
      "to": "/read"
    }
  }, [_vm._v("← 返回书库")]), _vm._ssrNode("<div class=\"intro\" data-v-69f82d72><div data-v-69f82d72><small data-v-69f82d72>原木娘的小课堂</small><h1 data-v-69f82d72>攒一点原木，为喜欢的作品加油</h1><p data-v-69f82d72>种一棵树、补充余额，或参与社区活动，找到适合你的获取方式。</p></div><img src=\"/reading/get-logs-guide.png\" alt=\"原木娘种树、充值和参与社区活动\" data-v-69f82d72></div>")], 2), _vm._ssrNode("<div class=\"channels\" data-v-69f82d72>", "</div>", _vm._l(_vm.channels, function (channel) {
    return _vm._ssrNode("<article data-v-69f82d72>", "</article>", [_vm._ssrNode("<div class=\"channel-title\" data-v-69f82d72><span data-v-69f82d72>" + _vm._ssrEscape(_vm._s(channel.number)) + "</span><h2 data-v-69f82d72>" + _vm._ssrEscape(_vm._s(channel.title)) + "</h2><small data-v-69f82d72>" + _vm._ssrEscape(_vm._s(channel.tag)) + "</small></div><p data-v-69f82d72>" + _vm._ssrEscape(_vm._s(channel.description)) + "</p><ol data-v-69f82d72>" + _vm._ssrList(channel.steps, function (step) {
      return "<li data-v-69f82d72>" + _vm._ssrEscape(_vm._s(step)) + "</li>";
    }) + "</ol>"), channel.to ? _c('nuxt-link', {
      attrs: {
        "to": channel.to
      }
    }, [_vm._v(_vm._s(channel.action) + " →")]) : _c('a', {
      attrs: {
        "href": channel.href,
        "target": "_blank",
        "rel": "noopener"
      }
    }, [_vm._v(_vm._s(channel.action) + " ↗")])], 2);
  }), 0), _vm._ssrNode("<aside data-v-69f82d72>", "</aside>", [_vm._ssrNode("<h2 data-v-69f82d72>把原木送给喜欢的创作者</h2><p data-v-69f82d72>获取原木后，回到作品页选择礼物，就能为喜欢的作品打赏。树场收益、充值额度及活动奖励以对应页面说明为准。</p>"), _c('nuxt-link', {
    attrs: {
      "to": "/read"
    }
  }, [_vm._v("发现喜欢的作品 →")])], 2)]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/resources.vue?vue&type=template&id=69f82d72&scoped=true

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(34);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/resources.vue?vue&type=script&lang=js

/* harmony default export */ var resourcesvue_type_script_lang_js = ({
  data: () => ({
    channels: [{
      id: 'tree',
      number: '01',
      title: '原木树场种树',
      tag: '日常积累',
      description: '从一棵小树苗开始，在自己的树场里培育树木，成熟后收获原木。',
      steps: ['进入原木树场，种下树苗', '根据树场提示培育树木，等待成熟', '收获树木，原木会加入你的余额'],
      action: '去树场种树',
      to: '/read/rewards'
    }, {
      id: 'recharge',
      number: '02',
      title: '原木充值',
      tag: '直接补充',
      description: '想及时支持喜欢的作品，可以通过充值补充原木余额。',
      steps: ['进入充值页面，选择合适的原木额度', '确认订单并按照页面提示完成支付', '支付成功后，查看原木余额及订单记录', '你的充值也将被用于社区维护与运营'],
      action: '前往原木充值',
      href: `${"https://m.loghome.ink"}/#/pages/payments/recharge`
    }, {
      id: 'activity',
      number: '03',
      title: '参与社区活动',
      tag: '一起参与',
      description: '关注社区活动公告，参与设有原木奖励的活动，收获创作与交流的乐趣。',
      steps: ['查看活动消息，了解正在开展的活动', '阅读参与条件、截止时间及奖励说明', '按照活动规则参与，奖励以活动公告为准'],
      action: '查看活动消息',
      to: '/read/activities'
    }]
  }),
  head: () => Object(reading_seo["d" /* readingHead */])({
    title: '如何获取原木 - 原木社区',
    description: '通过种树收获、原木充值与社区活动，为喜欢的作品和创作者加油。',
    path: '/read/resources'
  })
});
// CONCATENATED MODULE: ./pages/read/resources.vue?vue&type=script&lang=js
 /* harmony default export */ var read_resourcesvue_type_script_lang_js = (resourcesvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/read/resources.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(333)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_resourcesvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "69f82d72",
  "78fba015"
  
)

/* harmony default export */ var resources = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=resources.js.map