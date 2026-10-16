exports.ids = [63];
exports.modules = {

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

/***/ 207:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(246);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("43eed56b", content, true, context)
};

/***/ }),

/***/ 245:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Medal_vue_vue_type_style_index_0_id_4b1bbfbd_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Medal_vue_vue_type_style_index_0_id_4b1bbfbd_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Medal_vue_vue_type_style_index_0_id_4b1bbfbd_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Medal_vue_vue_type_style_index_0_id_4b1bbfbd_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Medal_vue_vue_type_style_index_0_id_4b1bbfbd_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 246:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.social-medal[data-v-4b1bbfbd] {\r\n  background: none;\r\n  border: 0;\r\n  cursor: pointer;\r\n  width: 180px;\r\n  height: 180px;\r\n  perspective: 700px;\r\n  padding: 0;\r\n  display: inline-block;\n}\n.medal-rotation[data-v-4b1bbfbd] {\r\n  position: relative;\r\n  display: block;\r\n  width: 100%;\r\n  height: 100%;\r\n  transform-style: preserve-3d;\r\n  transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));\r\n  transition: transform 0.2s ease;\n}\n.flipped .medal-rotation[data-v-4b1bbfbd] {\r\n  transform: rotateX(var(--tilt-x, 0deg)) rotateY(calc(180deg + var(--tilt-y, 0deg)));\n}\n.medal-face[data-v-4b1bbfbd] {\r\n  position: absolute;\r\n  inset: 0;\r\n  backface-visibility: hidden;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  border-radius: 50%;\r\n  overflow: hidden;\n}\n.medal-front img[data-v-4b1bbfbd] {\r\n  width: 82%;\r\n  height: 82%;\r\n  object-fit: contain;\r\n  image-rendering: pixelated;\n}\n.medal-back[data-v-4b1bbfbd] {\r\n  transform: rotateY(180deg);\r\n  background: var(--soft, #f2e9dd);\r\n  border: 2px solid #b99863;\r\n  color: var(--ink, #382d25);\r\n  padding: 25px;\r\n  flex-direction: column;\r\n  gap: 16px;\n}\n.medal-back strong[data-v-4b1bbfbd] {\r\n  font-size: 16px;\n}\n.medal-back > span[data-v-4b1bbfbd] {\r\n  font-size: 11px;\r\n  color: var(--muted, #82766c);\n}\n.locked img[data-v-4b1bbfbd] {\r\n  filter: grayscale(1);\r\n  opacity: 0.5;\n}\n.medal-shine[data-v-4b1bbfbd] {\r\n  position: absolute;\r\n  inset: 0;\r\n  background: linear-gradient(115deg, transparent 25%, #fff9 50%, transparent 75%);\r\n  transform: translateX(-140%);\r\n  pointer-events: none;\n}\n.social-medal:hover .medal-shine[data-v-4b1bbfbd] {\r\n  transform: translateX(140%);\r\n  transition: transform 0.8s ease;\n}\n@media (prefers-reduced-motion: reduce) {\n.medal-rotation[data-v-4b1bbfbd] {\r\n    transition: none;\n}\n.medal-shine[data-v-4b1bbfbd] {\r\n    display: none;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 288:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/social/Medal.vue?vue&type=template&id=4b1bbfbd&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('button', {
    ref: "medal",
    staticClass: "social-medal",
    class: {
      locked: _vm.locked,
      shiny: _vm.shiny,
      flipped: _vm.flipped
    },
    attrs: {
      "aria-label": _vm.flipped ? _vm.$t('查看勋章正面') : _vm.$t('翻转查看勋章背面')
    },
    on: {
      "click": function ($event) {
        _vm.flipped = !_vm.flipped;
      },
      "pointermove": _vm.tilt,
      "pointerleave": _vm.reset
    }
  }, [_vm._ssrNode("<span class=\"medal-rotation\" data-v-4b1bbfbd><span class=\"medal-face medal-front\" data-v-4b1bbfbd><img" + _vm._ssrAttr("src", _vm.src) + _vm._ssrAttr("alt", _vm.title) + " data-v-4b1bbfbd>" + (_vm.shiny && !_vm.locked ? "<span class=\"medal-shine\" data-v-4b1bbfbd></span>" : "<!---->") + "</span><span class=\"medal-face medal-back\" data-v-4b1bbfbd><strong data-v-4b1bbfbd>" + _vm._ssrEscape(_vm._s(_vm.title)) + "</strong><span data-v-4b1bbfbd>" + _vm._ssrEscape(_vm._s(_vm.locked ? _vm.$t("待解锁勋章") : _vm.$t("原木社区荣誉"))) + "</span></span></span>")]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/social/Medal.vue?vue&type=template&id=4b1bbfbd&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/social/Medal.vue?vue&type=script&lang=js
/* harmony default export */ var Medalvue_type_script_lang_js = ({
  props: {
    src: String,
    title: String,
    locked: Boolean,
    shiny: Boolean
  },
  data: () => ({
    flipped: false
  }),
  methods: {
    tilt(event) {
      if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const bounds = this.$refs.medal.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5,
        y = (event.clientY - bounds.top) / bounds.height - 0.5;
      this.$refs.rotation.style.setProperty("--tilt-x", `${-y * 18}deg`);
      this.$refs.rotation.style.setProperty("--tilt-y", `${x * 18}deg`);
    },
    reset() {
      this.$refs.rotation.style.setProperty("--tilt-x", "0deg");
      this.$refs.rotation.style.setProperty("--tilt-y", "0deg");
    }
  }
});
// CONCATENATED MODULE: ./components/social/Medal.vue?vue&type=script&lang=js
 /* harmony default export */ var social_Medalvue_type_script_lang_js = (Medalvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/social/Medal.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(245)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  social_Medalvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "4b1bbfbd",
  "12008000"
  
)

/* harmony default export */ var Medal = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 372:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(537);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("637842aa", content, true, context)
};

/***/ }),

/***/ 373:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(539);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("53a68134", content, true, context)
};

/***/ }),

/***/ 536:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_1b47e8ef_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(372);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_1b47e8ef_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_1b47e8ef_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_1b47e8ef_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_1b47e8ef_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 537:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".user-profile-page[data-v-1b47e8ef]{max-width:1200px;margin:0 auto;padding:20px;background-color:#f8f9fa}.profile-header[data-v-1b47e8ef]{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);margin-bottom:24px}.cover-container[data-v-1b47e8ef]{position:relative;height:300px;overflow:hidden}.cover-container .cover-image[data-v-1b47e8ef]{width:100%;height:100%;object-fit:cover;cursor:pointer;transition:transform .3s ease}.cover-container .cover-image[data-v-1b47e8ef]:hover{transform:scale(1.02)}.cover-container .cover-overlay[data-v-1b47e8ef]{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;flex-direction:column;color:#fff;cursor:pointer;opacity:0;transition:opacity .3s ease}.cover-container .cover-overlay[data-v-1b47e8ef]:hover{opacity:1}.cover-container .cover-overlay i[data-v-1b47e8ef]{font-size:32px;margin-bottom:8px}.cover-container .cover-overlay span[data-v-1b47e8ef]{font-size:16px}.user-info-section[data-v-1b47e8ef]{padding:30px;display:flex;justify-content:space-between;align-items:flex-start;margin-top:-80px;position:relative;z-index:2}.user-basic-info[data-v-1b47e8ef]{display:flex;align-items:flex-start;flex:1}.avatar-container[data-v-1b47e8ef]{margin-right:24px}.avatar-container .user-avatar[data-v-1b47e8ef]{width:120px;height:120px;border-radius:12px;border:4px solid #fff;object-fit:cover;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.1);transition:transform .3s ease}.avatar-container .user-avatar[data-v-1b47e8ef]:hover{transform:scale(1.05)}.user-details[data-v-1b47e8ef]{flex:1;padding-top:20px}.user-name-section[data-v-1b47e8ef]{margin-bottom:16px}.user-name-section .user-name[data-v-1b47e8ef]{font-size:32px;font-weight:bold;color:#2c3e50;margin:0 0 8px 0}.user-name-section .user-id[data-v-1b47e8ef]{background:rgba(0,0,0,.1);color:#666;padding:4px 12px;border-radius:16px;font-size:14px;margin-right:12px}.user-groups[data-v-1b47e8ef]{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:8px}.user-groups .user-group[data-v-1b47e8ef]{padding:4px 12px;border-radius:16px;font-size:12px;font-weight:500}.user-groups .user-group.founder[data-v-1b47e8ef]{background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff}.user-groups .user-group.copemate[data-v-1b47e8ef]{background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%);color:#fff}.user-groups .user-group.nonTitle[data-v-1b47e8ef]{display:none}.user-groups .admin-badge[data-v-1b47e8ef]{background:#5af;color:#fff;padding:4px 12px;border-radius:16px;font-size:12px;display:flex;align-items:center}.user-motto[data-v-1b47e8ef]{color:#666;font-size:16px;line-height:1.5;margin-bottom:20px}.follow-stats[data-v-1b47e8ef]{display:flex;gap:32px}.follow-stats .stat-item[data-v-1b47e8ef]{cursor:pointer;transition:transform .2s ease}.follow-stats .stat-item[data-v-1b47e8ef]:hover{transform:translateY(-2px)}.follow-stats .stat-item .stat-number[data-v-1b47e8ef]{display:block;font-size:24px;font-weight:bold;color:#2c3e50}.follow-stats .stat-item .stat-label[data-v-1b47e8ef]{display:block;font-size:14px;color:#666;margin-top:4px}.action-buttons[data-v-1b47e8ef]{display:flex;gap:12px;align-items:flex-start;padding-top:20px}.content-tabs[data-v-1b47e8ef]{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)}.tab-header[data-v-1b47e8ef]{display:flex;border-bottom:1px solid #eee}.tab-header .tab-item[data-v-1b47e8ef]{flex:1;padding:20px;text-align:center;font-size:16px;font-weight:500;color:#666;cursor:pointer;transition:all .3s ease;border-bottom:3px solid rgba(0,0,0,0)}.tab-header .tab-item[data-v-1b47e8ef]:hover{color:#947358;background:#f8f9fa}.tab-header .tab-item.active[data-v-1b47e8ef]{color:#947358;border-bottom-color:#947358;background:#fff}.tab-content[data-v-1b47e8ef]{min-height:400px;padding:30px}.works-grid[data-v-1b47e8ef]{display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:24px}.works-grid .work-item[data-v-1b47e8ef]{cursor:pointer;transition:transform .3s ease}.works-grid .work-item[data-v-1b47e8ef]:hover{transform:translateY(-4px)}.works-grid .work-item .work-cover[data-v-1b47e8ef]{width:100%;height:280px;object-fit:cover;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1)}.works-grid .work-item .work-info[data-v-1b47e8ef]{padding:12px 0}.works-grid .work-item .work-info .work-title[data-v-1b47e8ef]{font-size:16px;font-weight:500;color:#2c3e50;margin:0;text-align:center}.posts-list .post-item[data-v-1b47e8ef]{background:#f8f9fa;border-radius:12px;padding:24px;margin-bottom:20px;cursor:pointer;transition:all .3s ease}.posts-list .post-item[data-v-1b47e8ef]:hover{background:#f0f1f3;transform:translateY(-2px)}.posts-list .post-item .post-header[data-v-1b47e8ef]{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.posts-list .post-item .post-header .post-circle[data-v-1b47e8ef]{background:#947358;color:#fff;padding:4px 12px;border-radius:16px;font-size:12px;cursor:pointer}.posts-list .post-item .post-header .post-circle[data-v-1b47e8ef]:hover{background:#826347}.posts-list .post-item .post-header .post-time[data-v-1b47e8ef]{color:#999;font-size:14px}.posts-list .post-item .post-content[data-v-1b47e8ef]{margin-bottom:16px}.posts-list .post-item .post-content .post-title[data-v-1b47e8ef]{font-size:18px;font-weight:600;color:#2c3e50;margin:0 0 8px 0}.posts-list .post-item .post-content .post-text[data-v-1b47e8ef]{color:#666;line-height:1.6;margin:0;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}.posts-list .post-item .post-images[data-v-1b47e8ef]{margin:16px 0}.posts-list .post-item .post-images .image-grid[data-v-1b47e8ef]{display:grid;gap:8px}.posts-list .post-item .post-images .image-grid.grid-1[data-v-1b47e8ef]{grid-template-columns:1fr;max-width:400px}.posts-list .post-item .post-images .image-grid.grid-1 .post-image[data-v-1b47e8ef]{height:300px}.posts-list .post-item .post-images .image-grid.grid-2[data-v-1b47e8ef]{grid-template-columns:repeat(2, 1fr)}.posts-list .post-item .post-images .image-grid.grid-2 .post-image[data-v-1b47e8ef]{height:200px}.posts-list .post-item .post-images .image-grid.grid-3[data-v-1b47e8ef],.posts-list .post-item .post-images .image-grid.grid-multi[data-v-1b47e8ef]{grid-template-columns:repeat(3, 1fr)}.posts-list .post-item .post-images .image-grid.grid-3 .post-image[data-v-1b47e8ef],.posts-list .post-item .post-images .image-grid.grid-multi .post-image[data-v-1b47e8ef]{height:150px}.posts-list .post-item .post-images .image-grid .post-image[data-v-1b47e8ef]{width:100%;object-fit:cover;border-radius:8px;cursor:pointer;transition:transform .3s ease}.posts-list .post-item .post-images .image-grid .post-image[data-v-1b47e8ef]:hover{transform:scale(1.02)}.posts-list .post-item .post-images .image-grid .image-count[data-v-1b47e8ef]{position:absolute;right:8px;bottom:8px;background:rgba(0,0,0,.7);color:#fff;padding:4px 8px;border-radius:12px;font-size:12px}.posts-list .post-item .post-footer[data-v-1b47e8ef]{display:flex;gap:24px;padding-top:16px;border-top:1px solid #eee}.posts-list .post-item .post-footer .post-action[data-v-1b47e8ef]{display:flex;align-items:center;color:#666;font-size:14px}.posts-list .post-item .post-footer .post-action i[data-v-1b47e8ef]{margin-right:6px;font-size:16px}.worlds-grid[data-v-1b47e8ef]{display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:24px}.worlds-grid .world-item[data-v-1b47e8ef]{cursor:pointer;transition:transform .3s ease}.worlds-grid .world-item[data-v-1b47e8ef]:hover{transform:translateY(-4px)}.worlds-grid .world-item .world-cover[data-v-1b47e8ef]{width:100%;height:280px;object-fit:cover;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1)}.worlds-grid .world-item .world-info[data-v-1b47e8ef]{padding:12px 0}.worlds-grid .world-item .world-info .world-title[data-v-1b47e8ef]{font-size:16px;font-weight:500;color:#2c3e50;margin:0;text-align:center}.empty-state[data-v-1b47e8ef]{text-align:center;padding:60px 20px;color:#999}.empty-state i[data-v-1b47e8ef]{font-size:64px;margin-bottom:16px;display:block}.empty-state p[data-v-1b47e8ef]{font-size:16px;margin:0}.load-more[data-v-1b47e8ef]{text-align:center;padding:30px 0}@media(min-width: 1200px){.user-profile-page[data-v-1b47e8ef]{max-width:1400px;padding:30px}.works-grid[data-v-1b47e8ef],.worlds-grid[data-v-1b47e8ef]{grid-template-columns:repeat(auto-fill, minmax(220px, 1fr))}.cover-container[data-v-1b47e8ef]{height:350px}}@media(max-width: 1199px)and (min-width: 992px){.user-profile-page[data-v-1b47e8ef]{max-width:100%;padding:25px}.works-grid[data-v-1b47e8ef],.worlds-grid[data-v-1b47e8ef]{grid-template-columns:repeat(auto-fill, minmax(180px, 1fr))}}@media(max-width: 991px)and (min-width: 768px){.user-profile-page[data-v-1b47e8ef]{padding:20px}.user-info-section[data-v-1b47e8ef]{padding:25px}.user-name[data-v-1b47e8ef]{font-size:28px !important}.user-avatar[data-v-1b47e8ef]{width:100px !important;height:100px !important}.works-grid[data-v-1b47e8ef],.worlds-grid[data-v-1b47e8ef]{grid-template-columns:repeat(auto-fill, minmax(160px, 1fr));gap:20px}.cover-container[data-v-1b47e8ef]{height:250px}}@media(max-width: 767px){.user-profile-page[data-v-1b47e8ef]{padding:10px}.user-info-section[data-v-1b47e8ef]{flex-direction:column;align-items:stretch;padding:20px;margin-top:-60px}.user-basic-info[data-v-1b47e8ef]{flex-direction:column;align-items:center;text-align:center;margin-bottom:20px}.avatar-container[data-v-1b47e8ef]{margin-right:0;margin-bottom:16px}.avatar-container .user-avatar[data-v-1b47e8ef]{width:80px;height:80px}.user-name[data-v-1b47e8ef]{font-size:24px !important}.action-buttons[data-v-1b47e8ef]{justify-content:center;padding-top:0;flex-wrap:wrap}.follow-stats[data-v-1b47e8ef]{justify-content:center;gap:20px}.works-grid[data-v-1b47e8ef],.worlds-grid[data-v-1b47e8ef]{grid-template-columns:repeat(auto-fill, minmax(140px, 1fr));gap:16px}.tab-content[data-v-1b47e8ef]{padding:20px}.tab-header .tab-item[data-v-1b47e8ef]{padding:16px 12px;font-size:14px}.cover-container[data-v-1b47e8ef]{height:200px}.post-item[data-v-1b47e8ef]{padding:16px}.post-item .post-title[data-v-1b47e8ef]{font-size:16px !important}}@media(max-width: 480px){.user-profile-page[data-v-1b47e8ef]{padding:8px}.user-info-section[data-v-1b47e8ef]{padding:16px}.works-grid[data-v-1b47e8ef],.worlds-grid[data-v-1b47e8ef]{grid-template-columns:repeat(2, 1fr);gap:12px}.tab-content[data-v-1b47e8ef]{padding:16px}.action-buttons .el-button[data-v-1b47e8ef]{font-size:12px;padding:8px 12px}}.profile-medal[data-v-1b47e8ef]{width:30px;height:30px;object-fit:contain;image-rendering:pixelated}.profile-membership[data-v-1b47e8ef]{font-size:12px;color:#947358}.profile-display-title[data-v-1b47e8ef]{font-size:14px;color:#947358;margin:8px 0}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 538:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_1b47e8ef_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(373);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_1b47e8ef_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_1b47e8ef_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_1b47e8ef_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_1b47e8ef_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 539:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.profile-medal-button[data-v-1b47e8ef]{padding:0;border:0;background:none;cursor:pointer;display:inline-flex;align-items:center;border-radius:50%}.profile-medal-button[data-v-1b47e8ef]:focus-visible{outline:2px solid #92704f;outline-offset:4px}.public-badge-detail[data-v-1b47e8ef]{text-align:center;line-height:1.7}.public-badge-detail a[data-v-1b47e8ef]{color:#795a3d}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 621:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/users/_id.vue?vue&type=template&id=1b47e8ef&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "user-profile-page"
  }, [_vm._ssrNode("<div class=\"profile-header\" data-v-1b47e8ef>", "</div>", [_vm._ssrNode("<div class=\"cover-container\" data-v-1b47e8ef><img" + _vm._ssrAttr("src", _vm.user.top_pic_url || 'https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg') + _vm._ssrAttr("alt", _vm.$t("背景封面")) + " class=\"cover-image\" data-v-1b47e8ef> " + (_vm.isCurrentUser ? "<div class=\"cover-overlay\" data-v-1b47e8ef><i class=\"el-icon-camera\" data-v-1b47e8ef></i> <span data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(_vm.$t("更换封面"))) + "</span></div>" : "<!---->") + "</div> "), _vm._ssrNode("<div class=\"user-info-section\" data-v-1b47e8ef>", "</div>", [_vm._ssrNode("<div class=\"user-basic-info\" data-v-1b47e8ef>", "</div>", [_vm._ssrNode("<div class=\"avatar-container\" data-v-1b47e8ef>", "</div>", [_c('Avatar', {
    attrs: {
      "src": _vm.user.avatar_url,
      "frame": _vm.user.avatar_frame,
      "size": 100
    },
    nativeOn: {
      "click": function ($event) {
        return _vm.previewAvatar.apply(null, arguments);
      }
    }
  })], 1), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"user-details\" data-v-1b47e8ef>", "</div>", [_vm._ssrNode("<div class=\"user-name-section\" data-v-1b47e8ef>", "</div>", [_vm._ssrNode("<h1 class=\"user-name\" data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(_vm.user.name)) + "</h1>" + (_vm.user.selected_badge ? "<button" + _vm._ssrAttr("aria-label", _vm.$t("查看勋章：{p0}", {
    p0: _vm.user.selected_badge.title
  })) + " class=\"profile-medal-button\" data-v-1b47e8ef><img" + _vm._ssrAttr("src", _vm.user.selected_badge.badge_image_url || '/social/icons/icon_my_name_tag.png') + _vm._ssrAttr("alt", _vm.user.selected_badge.title) + " class=\"profile-medal\" data-v-1b47e8ef></button>" : "<!---->")), _vm.user.membership_type ? _c('nuxt-link', {
    staticClass: "profile-membership",
    attrs: {
      "to": "/membership"
    }
  }, [_vm._v(_vm._s(_vm.user.membership_type === 'super' ? _vm.$t("超级原木通行证") : _vm.$t("原木通行证")))]) : _vm._e(), _vm._ssrNode(" <span class=\"user-id\" data-v-1b47e8ef>" + _vm._ssrEscape("ID: " + _vm._s(_vm.uid)) + "</span> <div class=\"user-groups\" data-v-1b47e8ef>" + _vm._ssrList(_vm.userGroups, function (group) {
    return "<span" + _vm._ssrClass("user-group", _vm.getGroupClass(group)) + " data-v-1b47e8ef>" + _vm._ssrEscape("\r\n                " + _vm._s(group) + "\r\n              ") + "</span>";
  }) + " " + (_vm.user.is_admin ? "<span class=\"admin-badge\" data-v-1b47e8ef>" + _vm._ssrEscape("\r\n                " + _vm._s(_vm.$t("社区管理员")) + "\r\n              ") + "</span>" : "<!---->") + "</div>")], 2), _vm._ssrNode(" " + (_vm.user.display_title ? "<p class=\"profile-display-title\" data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(_vm.user.display_title)) + "</p>" : "<!---->") + "<div class=\"user-motto\" data-v-1b47e8ef>" + _vm._ssrEscape("\r\n            " + _vm._s(_vm.user.motto || _vm.$t("暂无简介")) + "\r\n          ") + "</div> <div class=\"follow-stats\" data-v-1b47e8ef><div class=\"stat-item\" data-v-1b47e8ef><span class=\"stat-number\" data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(_vm.fans)) + "</span> <span class=\"stat-label\" data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(_vm.$t("粉丝"))) + "</span></div> <div class=\"stat-item\" data-v-1b47e8ef><span class=\"stat-number\" data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(_vm.follows)) + "</span> <span class=\"stat-label\" data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(_vm.$t("关注"))) + "</span></div></div>")], 2)], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"action-buttons\" data-v-1b47e8ef>", "</div>", [!_vm.isCurrentUser ? _c('el-button', {
    attrs: {
      "type": _vm.isFollowing ? 'default' : 'primary',
      "loading": _vm.followLoading
    },
    on: {
      "click": _vm.toggleFollow
    }
  }, [_vm._v("\r\n          " + _vm._s(_vm.isFollowing ? _vm.$t("已关注") : _vm.$t("关注")) + "\r\n        ")]) : _vm._e(), _vm._ssrNode(" "), _vm.isCurrentUser ? _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.editProfile
    }
  }, [_vm._v("\r\n          " + _vm._s(_vm.$t("编辑资料")) + "\r\n        ")]) : _vm._e(), _vm._ssrNode(" "), !_vm.isCurrentUser ? _c('el-button', {
    on: {
      "click": _vm.sendPrivateMessage
    }
  }, [_vm._v("\r\n          " + _vm._s(_vm.$t("私信")) + "\r\n        ")]) : _vm._e()], 2)], 2)], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"content-tabs\" data-v-1b47e8ef>", "</div>", [_vm._ssrNode("<div class=\"tab-header\" data-v-1b47e8ef><div" + _vm._ssrClass("tab-item", {
    active: _vm.currentTab === 0
  }) + " data-v-1b47e8ef>" + _vm._ssrEscape("\r\n        " + _vm._s(_vm.$t("作品")) + "\r\n      ") + "</div> <div" + _vm._ssrClass("tab-item", {
    active: _vm.currentTab === 1
  }) + " data-v-1b47e8ef>" + _vm._ssrEscape("\r\n        " + _vm._s(_vm.$t("动态")) + "\r\n      ") + "</div> <div" + _vm._ssrClass("tab-item", {
    active: _vm.currentTab === 2
  }) + " data-v-1b47e8ef>" + _vm._ssrEscape("\r\n        " + _vm._s(_vm.$t("世界")) + "\r\n      ") + "</div></div> "), _vm._ssrNode("<div class=\"tab-content\" data-v-1b47e8ef>", "</div>", [_vm._ssrNode("<div class=\"works-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.currentTab === 0 ? '' : 'none'
  }) + " data-v-1b47e8ef>" + (_vm.userWorks.length > 0 ? "<div class=\"works-grid\" data-v-1b47e8ef>" + _vm._ssrList(_vm.userWorks, function (work) {
    return "<div class=\"work-item\"" + _vm._ssrStyle(null, null, {
      display: !work.is_personal ? '' : 'none'
    }) + " data-v-1b47e8ef><img" + _vm._ssrAttr("src", work.picUrl) + _vm._ssrAttr("alt", _vm.$t("作品封面")) + " class=\"work-cover\" data-v-1b47e8ef> <div class=\"work-info\" data-v-1b47e8ef><h3 class=\"work-title\" data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(work.name)) + "</h3></div></div>";
  }) + "</div>" : "<div class=\"empty-state\" data-v-1b47e8ef><i class=\"el-icon-document\" data-v-1b47e8ef></i> <p data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(_vm.$t("暂无作品"))) + "</p></div>") + "</div> "), _vm._ssrNode("<div class=\"posts-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.currentTab === 1 ? '' : 'none'
  }) + " data-v-1b47e8ef>", "</div>", [_vm._ssrNode((_vm.userPosts.length > 0 ? "<div class=\"posts-list\" data-v-1b47e8ef>" + _vm._ssrList(_vm.userPosts, function (post) {
    return "<div class=\"post-item\" data-v-1b47e8ef><div class=\"post-header\" data-v-1b47e8ef><div class=\"post-circle\" data-v-1b47e8ef>" + _vm._ssrEscape("\r\n                " + _vm._s(post.circle_name) + "\r\n              ") + "</div> <div class=\"post-time\" data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(_vm.formatTime(post.create_time))) + "</div></div> <div class=\"post-content\" data-v-1b47e8ef><h3 class=\"post-title\" data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(post.title)) + "</h3> <p class=\"post-text\" data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(post.content)) + "</p></div> " + (post.media_urls && post.media_urls.length > 0 ? "<div class=\"post-images\" data-v-1b47e8ef><div" + _vm._ssrClass("image-grid", _vm.getImageGridClass(post.media_urls.length)) + " data-v-1b47e8ef>" + _vm._ssrList(post.media_urls.slice(0, 9), function (img, imgIndex) {
      return "<img" + _vm._ssrAttr("src", img) + _vm._ssrAttr("alt", _vm.$t("帖子图片")) + " class=\"post-image\" data-v-1b47e8ef>";
    }) + " " + (post.media_urls.length > 9 ? "<div class=\"image-count\" data-v-1b47e8ef>" + _vm._ssrEscape("\r\n                  +" + _vm._s(post.media_urls.length - 9) + "\r\n                ") + "</div>" : "<!---->") + "</div></div>" : "<!---->") + " <div class=\"post-footer\" data-v-1b47e8ef><div class=\"post-action\" data-v-1b47e8ef><i class=\"el-icon-chat-dot-round\" data-v-1b47e8ef></i> <span data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(post.comment_count || 0)) + "</span></div> <div class=\"post-action\" data-v-1b47e8ef><i class=\"el-icon-star-off\" data-v-1b47e8ef></i> <span data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(post.like_count || 0)) + "</span></div></div></div>";
  }) + "</div>" : "<div class=\"empty-state\" data-v-1b47e8ef><i class=\"el-icon-chat-dot-round\" data-v-1b47e8ef></i> <p data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(_vm.$t("暂无动态"))) + "</p></div>") + " "), _vm.postsHasMore && _vm.userPosts.length > 0 ? _vm._ssrNode("<div class=\"load-more\" data-v-1b47e8ef>", "</div>", [_c('el-button', {
    attrs: {
      "loading": _vm.postsLoading
    },
    on: {
      "click": _vm.loadMorePosts
    }
  }, [_vm._v("\r\n            " + _vm._s(_vm.postsLoading ? _vm.$t("加载中...") : _vm.$t("加载更多")) + "\r\n          ")])], 1) : _vm._e()], 2), _vm._ssrNode(" <div class=\"worlds-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.currentTab === 2 ? '' : 'none'
  }) + " data-v-1b47e8ef>" + (_vm.userWorlds.length > 0 ? "<div class=\"worlds-grid\" data-v-1b47e8ef>" + _vm._ssrList(_vm.userWorlds, function (world) {
    return "<div class=\"world-item\" data-v-1b47e8ef><img" + _vm._ssrAttr("src", world.picUrl) + _vm._ssrAttr("alt", _vm.$t("世界封面")) + " class=\"world-cover\" data-v-1b47e8ef> <div class=\"world-info\" data-v-1b47e8ef><h3 class=\"world-title\" data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(world.name)) + "</h3></div></div>";
  }) + "</div>" : "<div class=\"empty-state\" data-v-1b47e8ef><i class=\"el-icon-place\" data-v-1b47e8ef></i> <p data-v-1b47e8ef>" + _vm._ssrEscape(_vm._s(_vm.$t("暂无世界"))) + "</p></div>") + "</div>")], 2)], 2), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "title": _vm.user.selected_badge ? _vm.user.selected_badge.title : _vm.$t("勋章详情"),
      "visible": _vm.badgeVisible,
      "width": "min(560px, 92vw)"
    },
    on: {
      "update:visible": function ($event) {
        _vm.badgeVisible = $event;
      }
    }
  }, [_vm.user.selected_badge ? _c('div', {
    staticClass: "public-badge-detail"
  }, [_c('Medal', {
    attrs: {
      "src": _vm.user.selected_badge.badge_image_url || '/social/icons/icon_my_name_tag.png',
      "title": _vm.user.selected_badge.title,
      "shiny": !!_vm.user.selected_badge.badge_shine
    }
  }), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.user.selected_badge.description))]), _vm._v(" "), _vm.user.selected_badge.title_term_text ? _c('p', [_vm._v("称号词条：" + _vm._s(_vm.user.selected_badge.title_term_text))]) : _vm._e(), _vm._v(" "), _vm.user.selected_badge.granted_at ? _c('p', [_vm._v("获得时间：" + _vm._s(_vm.formatTime(_vm.user.selected_badge.granted_at)))]) : _vm._e(), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.$t("点击勋章可翻转查看背面。")))]), _vm._v(" "), _vm.isCurrentUser ? _c('nuxt-link', {
    attrs: {
      "to": "/me/achievements"
    }
  }, [_vm._v(_vm._s(_vm.$t("管理我的勋章与称号")))]) : _vm._e()], 1) : _vm._e()])], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/users/_id.vue?vue&type=template&id=1b47e8ef&scoped=true

// EXTERNAL MODULE: ./components/social/Avatar.vue + 4 modules
var Avatar = __webpack_require__(159);

// EXTERNAL MODULE: ./components/social/Medal.vue + 4 modules
var Medal = __webpack_require__(288);

// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__(12);

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(43);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/users/_id.vue?vue&type=script&lang=js





/* harmony default export */ var _idvue_type_script_lang_js = ({
  components: {
    Avatar: Avatar["a" /* default */],
    Medal: Medal["a" /* default */]
  },
  name: 'UserProfile',
  layout: 'default',
  data() {
    return {
      badgeVisible: false,
      uid: null,
      user: {},
      userGroups: [],
      myUserInfo: {},
      fans: 0,
      follows: 0,
      isFollowing: false,
      followLoading: false,
      // 标签页
      currentTab: 0,
      // 作品数据
      userWorks: [],
      // 动态数据
      userPosts: [],
      postsPage: 1,
      postsPageSize: 10,
      postsHasMore: true,
      postsLoading: false,
      // 世界数据
      userWorlds: [],
      // 用户组样式映射
      group2class: {
        "社区奠基人": "founder",
        "原木体验官": "copemate",
        "用户": 'nonTitle',
        "社区管理员": 'nonTitle',
        "系统消息": 'nonTitle'
      }
    };
  },
  computed: {
    isCurrentUser() {
      return this.myUserInfo.user_id && this.uid == this.myUserInfo.user_id;
    }
  },
  async mounted() {
    this.uid = this.$route.params.id;
    await this.loadUserInfo();
    await this.loadMyUserInfo();
    await this.loadUserStats();
    await this.loadUserWorks();
    await this.loadUserWorlds();
  },
  methods: {
    // 加载用户信息
    async loadUserInfo() {
      try {
        const response = await this.$api.users.getUserInfo(this.uid);
        if (response.code === 0) {
          this.user = response.data;
          this.badgeVisible = this.$route.query.badge === "1" && !!this.user.selected_badge;
          if (this.user.user_group) {
            this.userGroups = this.user.user_group.split(',');
          }
        } else {
          throw new Error(response.message || '获取用户信息失败');
        }
      } catch (error) {
        console.error('加载用户信息失败', error);
        this.$message.error('用户信息加载失败');
      }
    },
    // 加载当前登录用户信息
    async loadMyUserInfo() {
      try {
        this.myUserInfo = await this.$api.users.getUserProfile();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
        }
      }
    },
    // 加载用户统计数据
    async loadUserStats() {
      try {
        const counts = await this.$api.users.getSocialCounts(this.uid);
        this.fans = Number(counts.fans);
        this.follows = Number(counts.follows);

        // 检查是否已关注
        if (this.myUserInfo.user_id && !this.isCurrentUser) {
          this.checkFollowStatus();
        }
      } catch (error) {
        console.error('加载用户统计数据失败', error);
      }
    },
    // 检查关注状态
    async checkFollowStatus() {
      try {
        const response = await this.$api.users.checkFollowStatus(this.uid, this.myUserInfo.user_id);
        if (response.code === 0) {
          this.isFollowing = response.data.isFollowing;
        }
      } catch (error) {
        console.error('检查关注状态失败', error);
      }
    },
    // 加载用户作品
    async loadUserWorks() {
      try {
        const response = await this.$api.users.getUserNovels(this.uid);
        if (response.code === 0) {
          this.userWorks = response.data || [];
        } else {
          throw new Error(response.message || '获取作品失败');
        }
      } catch (error) {
        console.error('加载用户作品失败', error);
        this.$message.error('作品信息加载失败');
      }
    },
    // 加载用户世界
    async loadUserWorlds() {
      try {
        const response = await this.$api.users.getUserWorlds(this.uid);
        if (response.code === 0) {
          this.userWorlds = response.data || [];
        } else {
          throw new Error(response.message || '获取世界设定失败');
        }
      } catch (error) {
        console.error('加载用户世界失败', error);
        this.$message.error('世界信息加载失败');
      }
    },
    // 加载用户动态
    async loadUserPosts() {
      if (this.postsLoading || !this.postsHasMore) return;
      this.postsLoading = true;
      try {
        const response = await this.$api.users.getUserPosts(this.uid, {
          page: this.postsPage,
          pageSize: this.postsPageSize
        });
        if (response.code === 0 && response.data && response.data.list) {
          const newPosts = response.data.list.map(post => {
            if (post.media_urls && typeof post.media_urls === 'string') {
              try {
                post.media_urls = JSON.parse(post.media_urls);
              } catch (e) {
                post.media_urls = [];
              }
            }
            return post;
          });
          if (this.postsPage === 1) {
            this.userPosts = newPosts;
          } else {
            this.userPosts = [...this.userPosts, ...newPosts];
          }
          this.postsPage++;
          this.postsHasMore = this.userPosts.length < response.data.total;
        } else {
          throw new Error(response.message || '获取动态失败');
        }
      } catch (error) {
        console.error('加载用户动态失败', error);
        this.$message.error('加载用户动态失败');
      } finally {
        this.postsLoading = false;
      }
    },
    // 加载更多动态
    loadMorePosts() {
      this.loadUserPosts();
    },
    // 切换标签页
    switchTab(index) {
      this.currentTab = index;
      if (index === 1 && this.userPosts.length === 0) {
        this.loadUserPosts();
      }
    },
    // 切换关注状态
    async toggleFollow() {
      if (!this.myUserInfo.user_id) {
        this.$message.warning('请先登录');
        this.$router.push('/login');
        return;
      }
      if (this.uid == this.myUserInfo.user_id) {
        this.$message.warning('不能关注自己');
        return;
      }
      this.followLoading = true;
      try {
        let response;
        if (this.isFollowing) {
          response = await this.$api.users.unfollowUser(this.uid);
        } else {
          response = await this.$api.users.followUser(this.uid);
        }
        if (response.code === 0) {
          this.isFollowing = !this.isFollowing;
          this.fans += this.isFollowing ? 1 : -1;
          this.$message.success(this.isFollowing ? '关注成功' : '取消关注成功');
        } else {
          throw new Error(response.message || '操作失败');
        }
      } catch (error) {
        console.error('关注操作失败', error);
        this.$message.error('操作失败，请重试');
      } finally {
        this.followLoading = false;
      }
    },
    // 发送私信
    sendPrivateMessage() {
      if (!this.myUserInfo.user_id) {
        this.$message.warning('请先登录');
        this.$router.push('/login');
        return;
      }
      this.$router.push(`/community/chat?id=${this.uid}`);
    },
    // 编辑资料
    editProfile() {
      this.$router.push('/users/change_user_info');
    },
    // 更换封面
    changeCoverImage() {
      this.$router.push('/users/top_pic_upload?noneAnimation=1');
    },
    // 预览封面图片
    previewCoverImage() {
      if (this.user.top_pic_url) {
        this.$preview([this.user.top_pic_url]);
      }
    },
    // 预览头像
    previewAvatar() {
      if (this.user.avatar_url) {
        this.$preview([this.user.avatar_url]);
      }
    },
    // 预览帖子图片
    previewPostImages(images, index) {
      this.$preview(images, index);
    },
    // 导航到好友页面
    navigateToFriends(tab) {
      this.$router.push(`/me/friends?id=${this.uid}&tab=${tab}`);
    },
    // 导航到作品
    navigateToWork(novelId) {
      if (novelId > 0) {
        this.$router.push(`/novel/${novelId}`);
      }
    },
    // 导航到帖子
    navigateToPost(postId) {
      this.$router.push(`/community/post/${postId}`);
    },
    // 导航到圈子
    navigateToCircle(circleId) {
      if (!circleId || circleId === 0) {
        this.$message.warning('圈子不存在');
        return;
      }
      this.$router.push(`/community/circle/${circleId}`);
    },
    // 导航到世界
    navigateToWorld(worldId) {
      this.$router.push(`/world/${worldId}`);
    },
    // 获取用户组样式
    getGroupClass(group) {
      return this.group2class[group] || 'nonTitle';
    },
    // 获取图片网格样式
    getImageGridClass(count) {
      if (count === 1) return 'grid-1';
      if (count === 2) return 'grid-2';
      if (count === 3) return 'grid-3';
      return 'grid-multi';
    },
    // 格式化时间
    formatTime(time) {
      const now = external_moment_default()();
      const postTime = external_moment_default()(time);
      const diff = now.diff(postTime, 'minutes');
      if (diff < 1) return '刚刚';
      if (diff < 60) return `${diff}分钟前`;
      const hourDiff = now.diff(postTime, 'hours');
      if (hourDiff < 24) return `${hourDiff}小时前`;
      const dayDiff = now.diff(postTime, 'days');
      if (dayDiff < 30) return `${dayDiff}天前`;
      return postTime.format('YYYY-MM-DD');
    },
    // 获取token
    getToken() {
      return Object(reading["c" /* readingToken */])();
    }
  }
});
// CONCATENATED MODULE: ./pages/users/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var users_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/users/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(536)
if (style0.__inject__) style0.__inject__(context)
var style1 = __webpack_require__(538)
if (style1.__inject__) style1.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  users_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "1b47e8ef",
  "2f4f5920"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map