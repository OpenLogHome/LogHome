exports.ids = [73];
exports.modules = {

/***/ 377:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(549);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("a9bb35bc", content, true, context)
};

/***/ }),

/***/ 548:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TreeScene_vue_vue_type_style_index_0_id_a506e3ee_prod_scoped_true_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(377);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TreeScene_vue_vue_type_style_index_0_id_a506e3ee_prod_scoped_true_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TreeScene_vue_vue_type_style_index_0_id_a506e3ee_prod_scoped_true_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TreeScene_vue_vue_type_style_index_0_id_a506e3ee_prod_scoped_true_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TreeScene_vue_vue_type_style_index_0_id_a506e3ee_prod_scoped_true_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 549:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".oak-tree-3d[data-v-a506e3ee]{position:relative;width:100%;height:100%;overflow:hidden;background:radial-gradient(circle at 50% 12%, var(--scene-halo-core) 0%, var(--scene-halo-mid) 42%, rgba(255, 255, 255, 0) 72%),linear-gradient(180deg, var(--scene-sky-top) 0%, var(--scene-sky-mid) 32%, var(--scene-sky-low) 72%, var(--scene-sky-bottom) 100%);transition:background .45s ease}.scene-backdrop[data-v-a506e3ee]{position:absolute;inset:0;pointer-events:none}.sun-halo[data-v-a506e3ee]{position:absolute;z-index:2;top:6%;right:10%;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle, var(--scene-halo-core) 0%, var(--scene-halo-mid) 42%, rgba(255, 255, 255, 0) 72%)}.sun-halo[data-v-a506e3ee]::before{content:\"\";position:absolute;left:50%;top:50%;width:46px;height:46px;transform:translate(-50%, -50%);border-radius:2px;background:var(--scene-halo-core);box-shadow:-5px 0 0 var(--scene-halo-mid),5px 0 0 var(--scene-halo-mid),0 -5px 0 var(--scene-halo-mid),0 5px 0 var(--scene-halo-mid)}.is-night .sun-halo[data-v-a506e3ee]{top:7%;right:11%}.is-night .sun-halo[data-v-a506e3ee]::after{content:\"\";position:absolute;left:calc(50% - 12px);top:calc(50% - 9px);width:7px;height:7px;background:var(--scene-moon-shade);box-shadow:17px 5px 0 var(--scene-moon-shade),10px 20px 0 var(--scene-moon-shade),27px 24px 0 var(--scene-moon-shade)}.pixel-stars[data-v-a506e3ee]{position:absolute;inset:0;z-index:1;pointer-events:none}.pixel-star[data-v-a506e3ee]{position:absolute;width:2px;height:2px;background:var(--scene-star-color);box-shadow:0 0 4px var(--scene-star-color);animation:pixel-star-twinkle-a506e3ee 3.2s steps(2, end) infinite}.pixel-star.star-size-2[data-v-a506e3ee]{width:3.5px;height:3.5px}.pixel-star[data-v-a506e3ee]:nth-child(3n+1){animation-delay:-0.9s}.pixel-star[data-v-a506e3ee]:nth-child(3n+2){animation-delay:-1.8s}.mist[data-v-a506e3ee]{position:absolute;border-radius:499.5px;filter:blur(9px)}.mist-a[data-v-a506e3ee]{left:8%;top:18%;width:140px;height:35px;background:var(--scene-mist-a)}.mist-b[data-v-a506e3ee]{right:12%;top:28%;width:110px;height:30px;background:var(--scene-mist-b)}.scene-host[data-v-a506e3ee]{position:absolute;inset:0;touch-action:none}.gesture-hint[data-v-a506e3ee]{position:absolute;left:50%;bottom:105px;transform:translateX(-50%);pointer-events:none;padding:8px 12px;border-radius:499.5px;background:rgba(33,26,19,.55);color:#fff6e8;font-size:11px;font-weight:800;letter-spacing:.5px;box-shadow:0 8px 16px rgba(18,13,9,.16);animation:hint-fade-a506e3ee 2.8s ease-in-out infinite}.scene-error[data-v-a506e3ee]{position:absolute;left:50%;bottom:95px;transform:translateX(-50%);max-width:280px;padding:8px 11px;border-radius:11px;background:rgba(47,34,25,.72);color:#fff8ef;font-size:11px;text-align:center;line-height:1.5}@keyframes hint-fade-a506e3ee{0%,100%{opacity:.55;transform:translateX(-50%) translateY(0)}50%{opacity:1;transform:translateX(-50%) translateY(-3px)}}@keyframes pixel-star-twinkle-a506e3ee{0%,100%{filter:brightness(0.72);transform:scale(0.85)}50%{filter:brightness(1.28);transform:scale(1.15)}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 567:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/social/tree/TreeScene.vue?vue&type=template&id=a506e3ee&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "oak-tree-3d",
    class: {
      'is-night': _vm.nightMode
    },
    style: _vm.sceneThemeStyle,
    attrs: {
      "tabindex": "0",
      "role": "img",
      "aria-label": _vm.$t('树场场景，可拖动或使用左右方向键旋转')
    },
    on: {
      "keydown": [function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "left", 37, $event.key, ["Left", "ArrowLeft"])) return null;
        if ('button' in $event && $event.button !== 0) return null;
        $event.preventDefault();
        return _vm.rotateBy(-0.2);
      }, function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "right", 39, $event.key, ["Right", "ArrowRight"])) return null;
        if ('button' in $event && $event.button !== 2) return null;
        $event.preventDefault();
        return _vm.rotateBy(0.2);
      }]
    }
  }, [_vm._ssrNode("<div class=\"scene-backdrop\" data-v-a506e3ee><div class=\"sun-halo\" data-v-a506e3ee></div> " + (_vm.nightMode ? "<div class=\"pixel-stars\" data-v-a506e3ee>" + _vm._ssrList(_vm.nightStars, function (star, index) {
    return "<div" + _vm._ssrClass("pixel-star", 'star-size-' + star.size) + _vm._ssrStyle(null, {
      left: star.x + '%',
      top: star.y + '%',
      opacity: star.opacity
    }, null) + " data-v-a506e3ee></div>";
  }) + "</div>" : "<!---->") + " <div class=\"mist mist-a\" data-v-a506e3ee></div> <div class=\"mist mist-b\" data-v-a506e3ee></div></div> <div class=\"scene-host\" data-v-a506e3ee></div> " + (!_vm.hasInteracted ? "<div class=\"gesture-hint\" data-v-a506e3ee><span data-v-a506e3ee>" + _vm._ssrEscape(_vm._s(_vm.$t("拖动旋转树场"))) + "</span></div>" : "<!---->") + " " + (_vm.initFailed ? "<div class=\"scene-error\" data-v-a506e3ee><span data-v-a506e3ee>" + _vm._ssrEscape(_vm._s(_vm.$t("当前环境无法启用高质量 3D 树场，已切回经典模式。"))) + "</span></div>" : "<!---->"))]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/social/tree/TreeScene.vue?vue&type=template&id=a506e3ee&scoped=true

// EXTERNAL MODULE: external "three"
var external_three_ = __webpack_require__(141);

// EXTERNAL MODULE: ./utils/tree-scene-settings.js
var tree_scene_settings = __webpack_require__(251);

// CONCATENATED MODULE: ./components/social/tree/sceneThemes.js

const BASE_CAMERA = {
  radiusLandscape: 18.8,
  radiusPortrait: 21.8,
  phiLandscape: 1.02,
  phiPortrait: 0.95,
  fovLandscape: 36,
  fovPortrait: 40,
  targetLandscape: 2.7,
  targetPortrait: 2.95
};
const SCENE_THEMES = {
  oak_island: {
    key: "oak_island",
    treeKind: "oak",
    camera: BASE_CAMERA,
    backdrop: {
      haloCore: "rgba(255, 244, 203, 0.95)",
      haloMid: "rgba(255, 225, 128, 0.3)",
      skyTop: "#82d9ff",
      skyMid: "#b0e4ff",
      skyLow: "#d8f3c7",
      skyBottom: "#90cb69",
      mistA: "rgba(255, 255, 255, 0.24)",
      mistB: "rgba(255, 255, 255, 0.2)"
    },
    fog: {
      color: "#cce8ff",
      near: 16,
      far: 34
    },
    lights: {
      hemisphereSky: "#f6fdff",
      hemisphereGround: "#7db06a",
      hemisphereIntensity: 1.15,
      ambientColor: "#ffffff",
      ambientIntensity: 0.45,
      sunColor: "#fff5de",
      sunIntensity: 2.1,
      sunPosition: [9, 15, 8],
      rimColor: "#c8efff",
      rimIntensity: 0.55,
      rimPosition: [-10, 8, -10],
      toneExposure: 1.05
    },
    palette: {
      surfaceTop: ["#7bd04b", "#70c244", "#8bdb57", "#67b23f"],
      surfaceAccent: "#9fee71",
      surfaceBand: "#77c849",
      surfaceEdge: "#69b63f",
      fill: ["#8b5c38", "#7b4f2e", "#96663f", "#6d4324"],
      soil: ["#7b4726", "#6b3f21", "#85502e", "#5e351a"],
      path: ["#d0af74", "#c39d63", "#b68f56", "#dfbf85"],
      stone: ["#c7d0da", "#adb8c3", "#94a0ad", "#dce5ee"],
      trunkTop: ["#c08a54", "#9b6a3b", "#7f522b", "#c99964"],
      trunkSide: ["#9b6538", "#b67b46", "#7e4d26"],
      leaf: ["#3fa84b", "#2f8f3f", "#56be5b", "#287635"],
      leafAccent: "#72d070",
      blossom: ["#ffd4e4", "#f8b8d0", "#ffc9dc", "#ef9abf"],
      blossomAccent: "#fff2f7",
      fruit: ["#f35c49", "#dc4030", "#ff775d", "#bf2d1f"],
      fruitAccent: "#ffd79c",
      fruitStem: "#5a7b2d",
      plank: ["#c18a54", "#d39f6a", "#ad7345", "#9e6436"],
      cloudColor: "#ffffff",
      cloudOpacity: 0.78,
      glow: ["#ffe59b", "#ffcf58", 1.25],
      accentGlow: ["#ffd6ea", "#ffb3d9", 1.1]
    },
    clouds: [[-6.6, 10.8, -7.8, 1.35], [7.6, 9.6, -5.4, 1.1], [2.4, 11.4, 8.2, 0.95]]
  },
  birch_blossom: {
    key: "birch_blossom",
    treeKind: "birch",
    camera: {
      ...BASE_CAMERA,
      radiusLandscape: 19.1,
      radiusPortrait: 22.1
    },
    backdrop: {
      haloCore: "rgba(255, 248, 226, 0.9)",
      haloMid: "rgba(255, 221, 182, 0.28)",
      skyTop: "#9fe7ff",
      skyMid: "#d7f2ff",
      skyLow: "#f4f3dd",
      skyBottom: "#8acc84",
      mistA: "rgba(255, 255, 255, 0.28)",
      mistB: "rgba(245, 255, 252, 0.22)"
    },
    fog: {
      color: "#d7eef4",
      near: 16,
      far: 34
    },
    lights: {
      hemisphereSky: "#f8feff",
      hemisphereGround: "#86be7a",
      hemisphereIntensity: 1.12,
      ambientColor: "#ffffff",
      ambientIntensity: 0.46,
      sunColor: "#fff4dc",
      sunIntensity: 2.02,
      sunPosition: [8, 15, 7],
      rimColor: "#dff7ff",
      rimIntensity: 0.52,
      rimPosition: [-10, 8, -9],
      toneExposure: 1.03
    },
    palette: {
      surfaceTop: ["#91d868", "#82c95e", "#a7e17b", "#73bb53"],
      surfaceAccent: "#d6f2a4",
      surfaceBand: "#9ad974",
      surfaceEdge: "#7fb95d",
      fill: ["#9a7447", "#8a653d", "#a98554", "#74532f"],
      soil: ["#7e5a35", "#6b4a2a", "#916941", "#5d3f21"],
      path: ["#dcc89a", "#cdb37f", "#e5d3a6", "#bfa370"],
      stone: ["#d7dde2", "#b9c1c9", "#9da7b1", "#f0f4f7"],
      trunkTop: ["#f7f7f0", "#d5d3ca", "#a4a39d", "#fdfcf7"],
      trunkSide: ["#ece8e0", "#ffffff", "#3a3a35"],
      leaf: ["#72ba5d", "#5ea04a", "#8ed074", "#88bf5d"],
      leafAccent: "#c6ef9f",
      blossom: ["#fff0e0", "#f8dfc9", "#ffe7d7", "#f2d4bb"],
      blossomAccent: "#ffffff",
      fruit: ["#f5c66a", "#e7b34a", "#ffd78c", "#c18a2e"],
      fruitAccent: "#fff4cf",
      fruitStem: "#6c6d36",
      plank: ["#e3d1a8", "#f0dfb7", "#c8b085", "#9e8458"],
      cloudColor: "#ffffff",
      cloudOpacity: 0.8,
      glow: ["#ffe8a6", "#ffcb6b", 1.22],
      accentGlow: ["#fff4d5", "#ffe4b3", 1.02]
    },
    clouds: [[-7.2, 10.4, -6.8, 1.2], [8.2, 10.2, -4.6, 1.05], [3.1, 11.1, 8.4, 0.88]]
  },
  snow_spruce: {
    key: "snow_spruce",
    treeKind: "spruce",
    camera: {
      ...BASE_CAMERA,
      radiusLandscape: 19.8,
      radiusPortrait: 23,
      phiLandscape: 0.99,
      phiPortrait: 0.92,
      fovLandscape: 37,
      fovPortrait: 42,
      targetLandscape: 2.9,
      targetPortrait: 3.15
    },
    backdrop: {
      haloCore: "rgba(243, 249, 255, 0.92)",
      haloMid: "rgba(192, 221, 255, 0.28)",
      skyTop: "#6fb2ff",
      skyMid: "#b7dcff",
      skyLow: "#eef6ff",
      skyBottom: "#cfe5ff",
      mistA: "rgba(255, 255, 255, 0.26)",
      mistB: "rgba(220, 239, 255, 0.22)"
    },
    fog: {
      color: "#dbe9ff",
      near: 15,
      far: 34
    },
    lights: {
      hemisphereSky: "#eef7ff",
      hemisphereGround: "#8fa7c7",
      hemisphereIntensity: 1.18,
      ambientColor: "#ffffff",
      ambientIntensity: 0.48,
      sunColor: "#f8fbff",
      sunIntensity: 2.08,
      sunPosition: [8, 16, 7],
      rimColor: "#bfe2ff",
      rimIntensity: 0.68,
      rimPosition: [-11, 8, -10],
      toneExposure: 1.02
    },
    palette: {
      surfaceTop: ["#ffffff", "#edf5ff", "#dcecff", "#f5fbff"],
      surfaceAccent: "#cbe5ff",
      surfaceBand: "#f7fbff",
      surfaceEdge: "#d7e7f7",
      fill: ["#9ca8b8", "#8794a6", "#6d7987", "#b5c0cf"],
      soil: ["#7f8da1", "#6d7888", "#939fb0", "#5c6774"],
      path: ["#dfe8f7", "#ced9eb", "#edf4ff", "#b9c8de"],
      stone: ["#dbe3ee", "#bdc8d8", "#9da8b8", "#f4f8ff"],
      trunkTop: ["#8a6642", "#6d4c32", "#523523", "#9f7950"],
      trunkSide: ["#6a4a2e", "#876140", "#4e361f"],
      leaf: ["#2f5c47", "#264c3b", "#42735a", "#1e3c31"],
      leafAccent: "#cfe8de",
      blossom: ["#eff9ff", "#d4eef7", "#f7ffff", "#cae3ed"],
      blossomAccent: "#ffffff",
      fruit: ["#9b6844", "#835432", "#b17d58", "#6b4126"],
      fruitAccent: "#e8d0b0",
      fruitStem: "#5a4633",
      plank: ["#8f6e4d", "#a78666", "#765738", "#5b4128"],
      cloudColor: "#f9fdff",
      cloudOpacity: 0.84,
      glow: ["#cceeff", "#92ddff", 1.28],
      accentGlow: ["#eff9ff", "#c7eeff", 1.18]
    },
    clouds: [[-8.1, 11.2, -7.3, 1.4], [7.8, 10.6, -4.8, 1.2], [1.8, 11.7, 8.8, 1.05]]
  },
  sakura_grove: {
    key: "sakura_grove",
    treeKind: "sakura",
    camera: {
      ...BASE_CAMERA,
      radiusLandscape: 19.1,
      radiusPortrait: 22.1,
      phiLandscape: 1,
      phiPortrait: 0.94
    },
    backdrop: {
      haloCore: "rgba(255, 236, 244, 0.9)",
      haloMid: "rgba(255, 191, 224, 0.3)",
      skyTop: "#8fd9ff",
      skyMid: "#ffe0ef",
      skyLow: "#ffecc7",
      skyBottom: "#99d3a6",
      mistA: "rgba(255, 244, 249, 0.26)",
      mistB: "rgba(255, 228, 239, 0.22)"
    },
    fog: {
      color: "#f2dfea",
      near: 16,
      far: 34
    },
    lights: {
      hemisphereSky: "#fff8fc",
      hemisphereGround: "#94bf8d",
      hemisphereIntensity: 1.08,
      ambientColor: "#ffffff",
      ambientIntensity: 0.44,
      sunColor: "#fff0d9",
      sunIntensity: 1.98,
      sunPosition: [9, 15, 8],
      rimColor: "#ffd6ec",
      rimIntensity: 0.54,
      rimPosition: [-10, 8, -10],
      toneExposure: 1.04
    },
    palette: {
      surfaceTop: ["#8cd46b", "#78c960", "#9de07d", "#71bb55"],
      surfaceAccent: "#fbd1ea",
      surfaceBand: "#98d978",
      surfaceEdge: "#73b75a",
      fill: ["#8d5b40", "#794a35", "#9d6d4e", "#6d4129"],
      soil: ["#754229", "#653620", "#845039", "#572d19"],
      path: ["#e4c5b3", "#d5ad98", "#f0d5c7", "#c39582"],
      stone: ["#dcd7dd", "#c2bcc4", "#a8a0ab", "#f7eef7"],
      trunkTop: ["#b68563", "#936246", "#734531", "#c99a79"],
      trunkSide: ["#8d5d42", "#ad7a5e", "#6d422e"],
      leaf: ["#67b75e", "#5ca552", "#8ad67d", "#4f8c46"],
      leafAccent: "#c2efa6",
      blossom: ["#ffcde6", "#f8b4d5", "#ffd9eb", "#ef9cc6"],
      blossomAccent: "#fff7fb",
      fruit: ["#ff7b95", "#e65773", "#ff9bb0", "#c13f5b"],
      fruitAccent: "#ffe3ea",
      fruitStem: "#6f8b44",
      plank: ["#d7a481", "#e5bc9d", "#bc8562", "#945f41"],
      cloudColor: "#fffafc",
      cloudOpacity: 0.8,
      glow: ["#ffe0ad", "#ffc470", 1.22],
      accentGlow: ["#ffd7ec", "#ffb3d9", 1.18]
    },
    clouds: [[-7, 10.6, -6.9, 1.28], [8.1, 9.9, -4.8, 1.08], [2.6, 11.1, 8.4, 0.92]]
  },
  savanna_acacia: {
    key: "savanna_acacia",
    treeKind: "acacia",
    camera: {
      ...BASE_CAMERA,
      radiusLandscape: 19.4,
      radiusPortrait: 22.6,
      phiLandscape: 0.98,
      phiPortrait: 0.91,
      fovLandscape: 37,
      fovPortrait: 41,
      targetLandscape: 2.85,
      targetPortrait: 3.1
    },
    backdrop: {
      haloCore: "rgba(255, 231, 174, 0.9)",
      haloMid: "rgba(255, 192, 92, 0.32)",
      skyTop: "#7fd2ff",
      skyMid: "#ffe8a8",
      skyLow: "#f8d27e",
      skyBottom: "#c8b35a",
      mistA: "rgba(255, 248, 222, 0.18)",
      mistB: "rgba(255, 228, 171, 0.18)"
    },
    fog: {
      color: "#ead7a4",
      near: 15,
      far: 34
    },
    lights: {
      hemisphereSky: "#fff2c8",
      hemisphereGround: "#a08b4c",
      hemisphereIntensity: 1.12,
      ambientColor: "#fff4dc",
      ambientIntensity: 0.42,
      sunColor: "#ffd88e",
      sunIntensity: 2.18,
      sunPosition: [10, 16, 7],
      rimColor: "#ffefc3",
      rimIntensity: 0.46,
      rimPosition: [-10, 8, -9],
      toneExposure: 1.08
    },
    palette: {
      surfaceTop: ["#c5c15a", "#b3b04c", "#d6ce69", "#a09c42"],
      surfaceAccent: "#efe28d",
      surfaceBand: "#c7bf61",
      surfaceEdge: "#998e36",
      fill: ["#a95d32", "#954c29", "#b56e40", "#7d3d1f"],
      soil: ["#8b4a26", "#713818", "#9f6038", "#602d13"],
      path: ["#e0bf7b", "#cfa861", "#edcf8f", "#b78845"],
      stone: ["#ccb589", "#b69a72", "#9a7f5d", "#e0ceab"],
      trunkTop: ["#9d6b37", "#7a522b", "#5b3a1d", "#b9864b"],
      trunkSide: ["#7a5128", "#9b6a39", "#5a3919"],
      leaf: ["#6b8a3e", "#5a7333", "#829f4a", "#4b6329"],
      leafAccent: "#d6d37f",
      blossom: ["#f8d95b", "#ebc53c", "#ffe477", "#c8a62a"],
      blossomAccent: "#fff6b7",
      fruit: ["#8f4a2a", "#75371b", "#a55d39", "#5c250f"],
      fruitAccent: "#cda270",
      fruitStem: "#5d541f",
      plank: ["#bd8a54", "#d2a169", "#98673b", "#744a29"],
      cloudColor: "#fff8ea",
      cloudOpacity: 0.72,
      glow: ["#ffd374", "#ffab3d", 1.28],
      accentGlow: ["#ffe998", "#ffd45c", 1.06]
    },
    clouds: [[-8.4, 10.2, -7.6, 1.1], [8.5, 9.5, -4.2, 0.95], [1.2, 11.1, 8.8, 0.82]]
  },
  swamp_redwood: {
    key: "swamp_redwood",
    treeKind: "redwood",
    camera: {
      ...BASE_CAMERA,
      radiusLandscape: 20.8,
      radiusPortrait: 24.2,
      phiLandscape: 0.98,
      phiPortrait: 0.9,
      fovLandscape: 38,
      fovPortrait: 43,
      targetLandscape: 3.55,
      targetPortrait: 3.85
    },
    backdrop: {
      haloCore: "rgba(214, 243, 220, 0.8)",
      haloMid: "rgba(142, 211, 171, 0.24)",
      skyTop: "#74b0b1",
      skyMid: "#9ad0c2",
      skyLow: "#cad7b2",
      skyBottom: "#4f7d63",
      mistA: "rgba(208, 231, 214, 0.22)",
      mistB: "rgba(176, 214, 190, 0.22)"
    },
    fog: {
      color: "#adc8b8",
      near: 15,
      far: 33
    },
    lights: {
      hemisphereSky: "#d7efe5",
      hemisphereGround: "#55745f",
      hemisphereIntensity: 1.06,
      ambientColor: "#f4fff8",
      ambientIntensity: 0.4,
      sunColor: "#d7ffd9",
      sunIntensity: 1.62,
      sunPosition: [8, 14, 7],
      rimColor: "#c2ffe2",
      rimIntensity: 0.42,
      rimPosition: [-10, 8, -10],
      toneExposure: 0.97
    },
    palette: {
      surfaceTop: ["#5f8b58", "#4f7347", "#739d6c", "#435e3c"],
      surfaceAccent: "#8db58a",
      surfaceBand: "#628a59",
      surfaceEdge: "#49633f",
      fill: ["#5d4332", "#4a3326", "#735341", "#3a271c"],
      soil: ["#433126", "#36251d", "#584035", "#291b15"],
      path: ["#836f53", "#6c5944", "#9e8969", "#564735"],
      stone: ["#6d7f78", "#566861", "#7e928b", "#44524e"],
      water: ["#48766b", "#3d685f", "#5b897c", "#31554e"],
      trunkTop: ["#9c4f37", "#7a3726", "#562315", "#b76246"],
      trunkSide: ["#7a3826", "#9f5238", "#5d2619"],
      leaf: ["#365746", "#2d4738", "#4a6b57", "#20372c"],
      leafAccent: "#7aa48b",
      blossom: ["#d8b06f", "#b68b4b", "#e3c289", "#8e6732"],
      blossomAccent: "#f4e0b8",
      fruit: ["#8b2c24", "#6f1e18", "#a94437", "#54140f"],
      fruitAccent: "#e1a28c",
      fruitStem: "#53442d",
      plank: ["#85543f", "#9f6d55", "#663c2c", "#4e2a1e"],
      cloudColor: "#e8f6ef",
      cloudOpacity: 0.64,
      glow: ["#c4f5ad", "#7fd56a", 1.18],
      accentGlow: ["#b9efd8", "#74cfa4", 1.08]
    },
    clouds: [[-8.2, 10.4, -7.9, 1.18], [7.4, 9.7, -4.6, 1.02], [2.3, 10.9, 8.5, 0.88]]
  }
};
const NIGHT_THEME_OVERRIDES = {
  oak_island: {
    backdrop: {
      haloCore: "rgba(222, 234, 255, 0.94)",
      haloMid: "rgba(119, 151, 211, 0.28)",
      skyTop: "#071329",
      skyMid: "#10284b",
      skyLow: "#1c3b58",
      skyBottom: "#172f2b",
      mistA: "rgba(126, 156, 194, 0.12)",
      mistB: "rgba(93, 128, 168, 0.1)",
      starColor: "#dce9ff",
      moonShade: "#9baccc"
    },
    fog: {
      color: "#182d45",
      near: 14,
      far: 31
    },
    lights: {
      hemisphereSky: "#7896c8",
      hemisphereGround: "#15291f",
      hemisphereIntensity: 0.66,
      ambientColor: "#7085aa",
      ambientIntensity: 0.2,
      sunColor: "#c6dcff",
      sunIntensity: 1.18,
      sunPosition: [-9, 14, -7],
      rimColor: "#7599df",
      rimIntensity: 0.72,
      rimPosition: [10, 8, 10],
      toneExposure: 0.84
    },
    palette: {
      surfaceTop: ["#356b42", "#2d5c38", "#40794b", "#244d30"],
      surfaceAccent: "#5b9463",
      surfaceBand: "#315f3b",
      surfaceEdge: "#254b2f",
      leaf: ["#245433", "#1d452a", "#306640", "#173922"],
      leafAccent: "#4b8156",
      cloudColor: "#7d91ac",
      cloudOpacity: 0.34,
      glow: ["#ffeaa0", "#ffd45f", 2.2],
      accentGlow: ["#f8c9e2", "#ff9fd1", 1.8]
    }
  },
  birch_blossom: {
    backdrop: {
      haloCore: "rgba(231, 242, 255, 0.94)",
      haloMid: "rgba(151, 177, 222, 0.26)",
      skyTop: "#0a1830",
      skyMid: "#173252",
      skyLow: "#29495f",
      skyBottom: "#233b34",
      mistA: "rgba(171, 198, 218, 0.13)",
      mistB: "rgba(136, 169, 191, 0.1)",
      starColor: "#eef7ff",
      moonShade: "#abb9d2"
    },
    fog: {
      color: "#21384e",
      near: 14,
      far: 31
    },
    lights: {
      hemisphereSky: "#8ba5d0",
      hemisphereGround: "#1c3228",
      hemisphereIntensity: 0.7,
      ambientColor: "#7c91b2",
      ambientIntensity: 0.22,
      sunColor: "#d6e6ff",
      sunIntensity: 1.2,
      sunPosition: [-8, 15, -7],
      rimColor: "#91b7e6",
      rimIntensity: 0.7,
      rimPosition: [10, 8, 9],
      toneExposure: 0.86
    },
    palette: {
      surfaceTop: ["#416d45", "#365d3c", "#527d53", "#2d4e33"],
      surfaceAccent: "#789875",
      surfaceBand: "#3d6843",
      surfaceEdge: "#315438",
      leaf: ["#3d6740", "#315535", "#4c784d", "#29462d"],
      leafAccent: "#7b9b74",
      cloudColor: "#91a4ba",
      cloudOpacity: 0.36,
      glow: ["#ffedb0", "#ffd675", 2.15],
      accentGlow: ["#fff0cf", "#ffdca9", 1.75]
    }
  },
  snow_spruce: {
    backdrop: {
      haloCore: "rgba(232, 243, 255, 0.96)",
      haloMid: "rgba(129, 166, 226, 0.32)",
      skyTop: "#050d24",
      skyMid: "#132a55",
      skyLow: "#274977",
      skyBottom: "#29425f",
      mistA: "rgba(190, 216, 244, 0.15)",
      mistB: "rgba(146, 184, 224, 0.13)",
      starColor: "#f4f9ff",
      moonShade: "#a7b9d8"
    },
    fog: {
      color: "#233a5b",
      near: 13,
      far: 30
    },
    lights: {
      hemisphereSky: "#8aa9dd",
      hemisphereGround: "#26384f",
      hemisphereIntensity: 0.78,
      ambientColor: "#8da3c7",
      ambientIntensity: 0.24,
      sunColor: "#d9eaff",
      sunIntensity: 1.38,
      sunPosition: [-9, 16, -7],
      rimColor: "#8ec7ff",
      rimIntensity: 0.82,
      rimPosition: [11, 8, 10],
      toneExposure: 0.9
    },
    palette: {
      surfaceTop: ["#cbd8ea", "#b9c9df", "#dce6f3", "#a9bbd2"],
      surfaceAccent: "#e7f0fa",
      surfaceBand: "#b7c8db",
      surfaceEdge: "#8fa5bd",
      leaf: ["#193b32", "#142f29", "#245044", "#10261f"],
      leafAccent: "#7eaaa1",
      cloudColor: "#a8bad0",
      cloudOpacity: 0.4,
      glow: ["#c8f0ff", "#75d8ff", 2.35],
      accentGlow: ["#eaf8ff", "#a7e7ff", 2.05]
    }
  },
  sakura_grove: {
    backdrop: {
      haloCore: "rgba(247, 231, 255, 0.94)",
      haloMid: "rgba(181, 127, 213, 0.28)",
      skyTop: "#140d2d",
      skyMid: "#30204e",
      skyLow: "#54365d",
      skyBottom: "#2e3b38",
      mistA: "rgba(215, 166, 216, 0.14)",
      mistB: "rgba(178, 134, 192, 0.11)",
      starColor: "#ffeefe",
      moonShade: "#b6a3c7"
    },
    fog: {
      color: "#382743",
      near: 14,
      far: 31
    },
    lights: {
      hemisphereSky: "#a28bc7",
      hemisphereGround: "#29332d",
      hemisphereIntensity: 0.68,
      ambientColor: "#977cae",
      ambientIntensity: 0.22,
      sunColor: "#eadbff",
      sunIntensity: 1.2,
      sunPosition: [-9, 15, -7],
      rimColor: "#e09cd2",
      rimIntensity: 0.76,
      rimPosition: [10, 8, 10],
      toneExposure: 0.86
    },
    palette: {
      surfaceTop: ["#3d6440", "#345538", "#4b744d", "#2b482f"],
      surfaceAccent: "#9e7093",
      surfaceBand: "#3a5f3e",
      surfaceEdge: "#2d4c32",
      leaf: ["#345a39", "#2b4b30", "#416b45", "#243f29"],
      leafAccent: "#7f956b",
      blossom: ["#b66f9b", "#995b82", "#cc86ac", "#7e486c"],
      blossomAccent: "#efbad5",
      cloudColor: "#a18ca9",
      cloudOpacity: 0.34,
      glow: ["#ffe1ad", "#ffc16c", 2.1],
      accentGlow: ["#ffc8e9", "#ff82c4", 2.2]
    }
  },
  savanna_acacia: {
    backdrop: {
      haloCore: "rgba(231, 230, 211, 0.92)",
      haloMid: "rgba(144, 149, 181, 0.25)",
      skyTop: "#090f25",
      skyMid: "#1c2945",
      skyLow: "#3c3d48",
      skyBottom: "#403e2a",
      mistA: "rgba(172, 166, 137, 0.1)",
      mistB: "rgba(133, 141, 158, 0.09)",
      starColor: "#f6edcf",
      moonShade: "#aba995"
    },
    fog: {
      color: "#343641",
      near: 13,
      far: 30
    },
    lights: {
      hemisphereSky: "#7d8caf",
      hemisphereGround: "#37351e",
      hemisphereIntensity: 0.64,
      ambientColor: "#817f83",
      ambientIntensity: 0.2,
      sunColor: "#e6e3cf",
      sunIntensity: 1.14,
      sunPosition: [-10, 15, -6],
      rimColor: "#b5a77b",
      rimIntensity: 0.62,
      rimPosition: [10, 8, 9],
      toneExposure: 0.82
    },
    palette: {
      surfaceTop: ["#696a34", "#595b2c", "#77783d", "#4b4d25"],
      surfaceAccent: "#999151",
      surfaceBand: "#626130",
      surfaceEdge: "#48471f",
      leaf: ["#3b512a", "#314523", "#485f31", "#293a1d"],
      leafAccent: "#77784b",
      cloudColor: "#9b9a91",
      cloudOpacity: 0.28,
      glow: ["#ffd47d", "#ff9f3f", 2.3],
      accentGlow: ["#ffe59a", "#ffc954", 1.85]
    }
  },
  swamp_redwood: {
    backdrop: {
      haloCore: "rgba(211, 239, 226, 0.9)",
      haloMid: "rgba(91, 151, 132, 0.26)",
      skyTop: "#06191d",
      skyMid: "#123035",
      skyLow: "#21463f",
      skyBottom: "#162a22",
      mistA: "rgba(124, 178, 156, 0.15)",
      mistB: "rgba(92, 147, 126, 0.13)",
      starColor: "#d9f4e8",
      moonShade: "#8eafa3"
    },
    fog: {
      color: "#1b3933",
      near: 12,
      far: 28
    },
    lights: {
      hemisphereSky: "#6f9b94",
      hemisphereGround: "#14251e",
      hemisphereIntensity: 0.58,
      ambientColor: "#6a8f82",
      ambientIntensity: 0.18,
      sunColor: "#c6eddd",
      sunIntensity: 1.02,
      sunPosition: [-8, 14, -7],
      rimColor: "#62b395",
      rimIntensity: 0.7,
      rimPosition: [10, 8, 10],
      toneExposure: 0.78
    },
    palette: {
      surfaceTop: ["#304d36", "#293f2e", "#3a5940", "#213427"],
      surfaceAccent: "#59725d",
      surfaceBand: "#2d4933",
      surfaceEdge: "#203427",
      leaf: ["#1c362b", "#172c24", "#284538", "#10241c"],
      leafAccent: "#537766",
      water: ["#244f4b", "#1e423f", "#2e5e58", "#183634"],
      cloudColor: "#6d8d82",
      cloudOpacity: 0.3,
      glow: ["#bff59d", "#72dc63", 2.35],
      accentGlow: ["#9ceac9", "#54d3a0", 2.25]
    }
  }
};
function mergeThemeDefinition(theme, nightOverride) {
  if (!nightOverride) return theme;
  return {
    ...theme,
    isNight: true,
    backdrop: {
      ...theme.backdrop,
      ...nightOverride.backdrop
    },
    fog: {
      ...theme.fog,
      ...nightOverride.fog
    },
    lights: {
      ...theme.lights,
      ...nightOverride.lights
    },
    palette: {
      ...theme.palette,
      ...nightOverride.palette
    },
    clouds: nightOverride.clouds || theme.clouds
  };
}
function getSceneThemeDefinition(themeKey, nightMode = false) {
  const resolvedKey = Object(tree_scene_settings["d" /* normalizeTreePlantSceneTheme */])(themeKey || tree_scene_settings["a" /* DEFAULT_TREE_PLANT_SCENE_THEME */]);
  const theme = SCENE_THEMES[resolvedKey] || SCENE_THEMES.oak_island;
  return nightMode ? mergeThemeDefinition(theme, NIGHT_THEME_OVERRIDES[theme.key]) : theme;
}
function getCameraFraming(aspect = 1, themeKey = tree_scene_settings["a" /* DEFAULT_TREE_PLANT_SCENE_THEME */], nightMode = false) {
  const camera = getSceneThemeDefinition(themeKey, nightMode).camera;
  const safeAspect = Math.max(aspect || 1, 0.55);
  const portraitBias = Math.min(1, Math.max(0, (1 - safeAspect) / 0.45));
  return {
    radius: camera.radiusLandscape + (camera.radiusPortrait - camera.radiusLandscape) * portraitBias,
    phi: camera.phiLandscape + (camera.phiPortrait - camera.phiLandscape) * portraitBias,
    fov: camera.fovLandscape + (camera.fovPortrait - camera.fovLandscape) * portraitBias,
    targetY: camera.targetLandscape + (camera.targetPortrait - camera.targetLandscape) * portraitBias
  };
}
function getSceneThemeStyle(themeKey, nightMode = false) {
  const backdrop = getSceneThemeDefinition(themeKey, nightMode).backdrop;
  return {
    "--scene-halo-core": backdrop.haloCore,
    "--scene-halo-mid": backdrop.haloMid,
    "--scene-sky-top": backdrop.skyTop,
    "--scene-sky-mid": backdrop.skyMid,
    "--scene-sky-low": backdrop.skyLow,
    "--scene-sky-bottom": backdrop.skyBottom,
    "--scene-mist-a": backdrop.mistA,
    "--scene-mist-b": backdrop.mistB,
    "--scene-star-color": backdrop.starColor || "#ffffff",
    "--scene-moon-shade": backdrop.moonShade || "#aab7cf"
  };
}
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/social/tree/TreeScene.vue?vue&type=script&lang=js



const PATH_CELLS = new Set(["0:4", "0:3", "0:2", "0:1", "-1:4", "1:4", "-1:3", "1:3"]);
const SWAMP_WATER_CELLS = new Set(["-4:-1", "-3:-2", "-3:-1", "-3:0", "3:-2", "3:-1", "4:-1"]);
const NIGHT_STAR_POSITIONS = [{
  x: 7,
  y: 12,
  size: 1,
  opacity: 0.72
}, {
  x: 16,
  y: 24,
  size: 2,
  opacity: 0.9
}, {
  x: 24,
  y: 8,
  size: 1,
  opacity: 0.82
}, {
  x: 34,
  y: 19,
  size: 1,
  opacity: 0.68
}, {
  x: 43,
  y: 7,
  size: 2,
  opacity: 0.94
}, {
  x: 54,
  y: 27,
  size: 1,
  opacity: 0.76
}, {
  x: 63,
  y: 13,
  size: 1,
  opacity: 0.86
}, {
  x: 72,
  y: 31,
  size: 2,
  opacity: 0.72
}, {
  x: 83,
  y: 18,
  size: 1,
  opacity: 0.92
}, {
  x: 92,
  y: 8,
  size: 1,
  opacity: 0.7
}, {
  x: 12,
  y: 39,
  size: 1,
  opacity: 0.64
}, {
  x: 88,
  y: 42,
  size: 2,
  opacity: 0.74
}];
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function lerp(from, to, alpha) {
  return from + (to - from) * alpha;
}
function createCanvasTexture(resources, painter) {
  const canvas = document.createElement("canvas");
  const size = 32;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  painter(ctx, size);
  const texture = new external_three_["CanvasTexture"](canvas);
  texture.colorSpace = external_three_["SRGBColorSpace"];
  texture.magFilter = external_three_["NearestFilter"];
  texture.minFilter = external_three_["NearestMipmapNearestFilter"];
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  resources.textures.push(texture);
  return texture;
}
function createPixelTexture(resources, fileName, painter) {
  return createCanvasTexture(resources, painter);
}
function cutPixelHoles(ctx, cells, cellSize = 4) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  cells.forEach(([x, y]) => {
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  });
  ctx.restore();
}
function fillGrid(ctx, size, palette, cellSize = 4) {
  for (let y = 0; y < size; y += cellSize) {
    for (let x = 0; x < size; x += cellSize) {
      const paletteIndex = Math.abs((x * 13 + y * 7 + x * y) % palette.length);
      ctx.fillStyle = palette[paletteIndex];
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
}
function createTextureLibrary(resources, themeDefinition) {
  const palette = themeDefinition.palette;
  const grassTop = createPixelTexture(resources, "grass_top", (ctx, size) => {
    fillGrid(ctx, size, palette.surfaceTop);
    ctx.fillStyle = palette.surfaceAccent;
    ctx.fillRect(4, 4, 4, 4);
    ctx.fillRect(20, 8, 4, 4);
  });
  const dirt = createPixelTexture(resources, "dirt", (ctx, size) => {
    fillGrid(ctx, size, palette.fill);
  });
  const grassSide = createPixelTexture(resources, "grass_side", (ctx, size) => {
    ctx.fillStyle = palette.surfaceBand;
    ctx.fillRect(0, 0, size, 8);
    fillGrid(ctx, size, palette.fill);
    ctx.fillStyle = palette.surfaceBand;
    ctx.fillRect(0, 0, size, 6);
    ctx.fillStyle = palette.surfaceEdge;
    ctx.fillRect(0, 6, size, 2);
  });
  const soil = createPixelTexture(resources, "soil", (ctx, size) => {
    fillGrid(ctx, size, palette.soil);
  });
  const path = createPixelTexture(resources, "path", (ctx, size) => {
    fillGrid(ctx, size, palette.path);
    ctx.fillStyle = palette.path[1];
    ctx.fillRect(8, 8, 8, 4);
    ctx.fillRect(18, 18, 6, 4);
  });
  const stone = createPixelTexture(resources, "stone", (ctx, size) => {
    fillGrid(ctx, size, palette.stone);
    ctx.fillStyle = palette.stone[2];
    ctx.fillRect(8, 8, 4, 12);
    ctx.fillRect(18, 12, 8, 4);
    ctx.fillStyle = palette.stone[3];
    ctx.fillRect(4, 24, 8, 4);
    ctx.fillRect(24, 4, 4, 8);
  });
  const trunkTop = createPixelTexture(resources, "oak_log_top", (ctx, size) => {
    ctx.fillStyle = palette.trunkTop[0];
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = palette.trunkTop[1];
    ctx.fillRect(4, 4, 24, 24);
    ctx.fillStyle = palette.trunkTop[2];
    ctx.fillRect(8, 8, 16, 16);
    ctx.fillStyle = palette.trunkTop[3];
    ctx.fillRect(12, 12, 8, 8);
  });
  const trunkSide = createPixelTexture(resources, "oak_log_side", (ctx, size) => {
    ctx.fillStyle = palette.trunkSide[0];
    ctx.fillRect(0, 0, size, size);
    for (let x = 0; x < size; x += 6) {
      ctx.fillStyle = x % 12 === 0 ? palette.trunkSide[1] : palette.trunkSide[2];
      ctx.fillRect(x, 0, 3, size);
    }
  });
  const leaf = createPixelTexture(resources, "oak_leaves", (ctx, size) => {
    fillGrid(ctx, size, palette.leaf);
    ctx.fillStyle = palette.leafAccent;
    ctx.fillRect(4, 8, 4, 4);
    ctx.fillRect(20, 20, 4, 4);
    cutPixelHoles(ctx, [[0, 1], [7, 2], [2, 5], [5, 7]]);
  });
  const blossom = createPixelTexture(resources, "blossom", (ctx, size) => {
    fillGrid(ctx, size, palette.blossom);
    ctx.fillStyle = palette.blossomAccent;
    ctx.fillRect(8, 8, 4, 4);
    ctx.fillRect(20, 16, 4, 4);
    cutPixelHoles(ctx, [[1, 0], [6, 2], [0, 6], [7, 7]]);
  });
  const apple = createPixelTexture(resources, "apple", (ctx, size) => {
    fillGrid(ctx, size, palette.fruit);
    ctx.fillStyle = palette.fruitAccent;
    ctx.fillRect(8, 6, 4, 4);
    ctx.fillStyle = palette.fruitStem;
    ctx.fillRect(14, 2, 4, 4);
  });
  const plank = createPixelTexture(resources, "oak_planks", (ctx, size) => {
    ctx.fillStyle = palette.plank[0];
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 8) {
      ctx.fillStyle = y % 16 === 0 ? palette.plank[2] : palette.plank[1];
      ctx.fillRect(0, y, size, 2);
    }
    ctx.fillStyle = palette.plank[3];
    ctx.fillRect(8, 8, 2, 16);
    ctx.fillRect(22, 12, 2, 12);
  });
  const water = createPixelTexture(resources, "water", (ctx, size) => {
    fillGrid(ctx, size, palette.water || palette.stone, 8);
    ctx.fillStyle = (palette.water || palette.stone)[0];
    ctx.fillRect(0, 6, 20, 2);
    ctx.fillRect(12, 22, 20, 2);
  });
  return {
    grassTop,
    grassSide,
    dirt,
    soil,
    path,
    stone,
    trunkTop,
    trunkSide,
    leaf,
    blossom,
    apple,
    plank,
    water
  };
}
function createVoxelMaterial(resources, options) {
  const common = {
    roughness: 0.96,
    metalness: 0.03,
    envMapIntensity: 0.2
  };
  const material = new external_three_["MeshStandardMaterial"]({
    ...common,
    map: options.map,
    transparent: !!options.transparent,
    alphaTest: options.alphaTest || 0,
    opacity: options.opacity == null ? 1 : options.opacity,
    depthWrite: options.depthWrite !== false,
    emissive: options.emissive || "#000000",
    emissiveIntensity: options.emissiveIntensity || 0,
    flatShading: true
  });
  resources.materials.push(material);
  return material;
}
function createBoxMaterialSet(resources, options, axis = "y") {
  const common = {
    roughness: 0.96,
    metalness: 0.03,
    envMapIntensity: 0.2
  };
  const sideMaterial = new external_three_["MeshStandardMaterial"]({
    ...common,
    map: options.side,
    transparent: !!options.transparent,
    alphaTest: options.alphaTest || 0,
    emissive: options.sideEmissive || "#000000",
    emissiveIntensity: options.emissiveIntensity || 0,
    flatShading: true
  });
  const topMaterial = new external_three_["MeshStandardMaterial"]({
    ...common,
    map: options.top || options.side,
    transparent: !!options.transparent,
    alphaTest: options.alphaTest || 0,
    emissive: options.topEmissive || options.sideEmissive || "#000000",
    emissiveIntensity: options.emissiveIntensity || 0,
    flatShading: true
  });
  const bottomMaterial = new external_three_["MeshStandardMaterial"]({
    ...common,
    map: options.bottom || options.side,
    transparent: !!options.transparent,
    alphaTest: options.alphaTest || 0,
    flatShading: true
  });
  resources.materials.push(sideMaterial, topMaterial, bottomMaterial);
  if (axis === "x") {
    return [topMaterial, bottomMaterial, sideMaterial, sideMaterial, sideMaterial, sideMaterial];
  }
  if (axis === "z") {
    return [sideMaterial, sideMaterial, sideMaterial, sideMaterial, topMaterial, bottomMaterial];
  }
  return [sideMaterial, sideMaterial, topMaterial, bottomMaterial, sideMaterial, sideMaterial];
}
function createMaterialLibrary(resources, themeDefinition) {
  const textures = createTextureLibrary(resources, themeDefinition);
  const palette = themeDefinition.palette;
  const cloudMaterial = new external_three_["MeshStandardMaterial"]({
    color: palette.cloudColor,
    transparent: true,
    opacity: palette.cloudOpacity,
    roughness: 1,
    metalness: 0
  });
  const glowMaterial = new external_three_["MeshStandardMaterial"]({
    color: palette.glow[0],
    emissive: palette.glow[1],
    emissiveIntensity: palette.glow[2],
    roughness: 0.45,
    metalness: 0
  });
  const pinkGlowMaterial = new external_three_["MeshStandardMaterial"]({
    color: palette.accentGlow[0],
    emissive: palette.accentGlow[1],
    emissiveIntensity: palette.accentGlow[2],
    roughness: 0.55,
    metalness: 0
  });
  resources.materials.push(cloudMaterial, glowMaterial, pinkGlowMaterial);
  return {
    grass: createBoxMaterialSet(resources, {
      top: textures.grassTop,
      side: textures.grassSide,
      bottom: textures.dirt
    }),
    dirt: createVoxelMaterial(resources, {
      map: textures.dirt
    }),
    soil: createVoxelMaterial(resources, {
      map: textures.soil
    }),
    path: createVoxelMaterial(resources, {
      map: textures.path
    }),
    stone: createVoxelMaterial(resources, {
      map: textures.stone
    }),
    trunk: createBoxMaterialSet(resources, {
      top: textures.trunkTop,
      side: textures.trunkSide,
      bottom: textures.trunkTop
    }),
    trunkX: createBoxMaterialSet(resources, {
      top: textures.trunkTop,
      side: textures.trunkSide,
      bottom: textures.trunkTop
    }, "x"),
    trunkZ: createBoxMaterialSet(resources, {
      top: textures.trunkTop,
      side: textures.trunkSide,
      bottom: textures.trunkTop
    }, "z"),
    leaf: createVoxelMaterial(resources, {
      map: textures.leaf,
      alphaTest: 0.32,
      emissive: "#16351d",
      emissiveIntensity: 0.08
    }),
    blossom: createVoxelMaterial(resources, {
      map: textures.blossom,
      alphaTest: 0.3,
      emissive: "#5d1c38",
      emissiveIntensity: 0.06
    }),
    apple: createVoxelMaterial(resources, {
      map: textures.apple,
      emissive: "#51140f",
      emissiveIntensity: 0.1
    }),
    plank: createVoxelMaterial(resources, {
      map: textures.plank
    }),
    water: createVoxelMaterial(resources, {
      map: textures.water,
      transparent: true,
      opacity: 0.78,
      depthWrite: false
    }),
    cloud: cloudMaterial,
    glow: glowMaterial,
    pinkGlow: pinkGlowMaterial
  };
}
function createGeometryLibrary(resources) {
  const unit = new external_three_["BoxGeometry"](1, 1, 1);
  const sparkCube = new external_three_["BoxGeometry"](0.18, 0.18, 0.18);
  resources.geometries.push(unit, sparkCube);
  return {
    unit,
    sparkCube
  };
}
function createRuntime(framing = getCameraFraming(1)) {
  return {
    renderer: null,
    scene: null,
    camera: null,
    cameraTarget: new external_three_["Vector3"](0, framing.targetY || 2.6, 0),
    world: null,
    host: null,
    materials: null,
    geometries: null,
    resources: {
      textures: [],
      materials: [],
      geometries: []
    },
    clouds: [],
    ambientLights: [],
    isNight: false,
    stage: null,
    animationFrame: 0,
    resizeObserver: null,
    contextLostHandler: null,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    cameraTheta: 0,
    baseWorldRotationY: 0,
    basePhi: framing.phi,
    targetWorldRotationY: 0,
    targetPhi: framing.phi,
    currentWorldRotationY: 0,
    currentPhi: framing.phi,
    radius: framing.radius,
    lastTimestamp: 0
  };
}
function disposeRuntime(runtime) {
  if (!runtime) return;
  if (runtime.animationFrame) {
    cancelAnimationFrame(runtime.animationFrame);
    runtime.animationFrame = 0;
  }
  if (runtime.resizeObserver) {
    runtime.resizeObserver.disconnect();
    runtime.resizeObserver = null;
  }
  if (runtime.host) {
    runtime.host.onpointerdown = null;
    runtime.host.onpointermove = null;
    runtime.host.onpointerup = null;
    runtime.host.onpointerleave = null;
    runtime.host.onpointercancel = null;
  }
  if (runtime.renderer) {
    if (runtime.contextLostHandler && runtime.renderer.domElement) {
      runtime.renderer.domElement.removeEventListener("webglcontextlost", runtime.contextLostHandler);
    }
    const loseContext = runtime.renderer.getContext ? runtime.renderer.getContext().getExtension("WEBGL_lose_context") : null;
    runtime.renderer.dispose();
    if (loseContext) loseContext.loseContext();
    if (runtime.renderer.domElement && runtime.renderer.domElement.parentNode) {
      runtime.renderer.domElement.parentNode.removeChild(runtime.renderer.domElement);
    }
  }
  runtime.resources.textures.forEach(item => item.dispose && item.dispose());
  runtime.resources.materials.forEach(item => item.dispose && item.dispose());
  runtime.resources.geometries.forEach(item => item.dispose && item.dispose());
}
function addVoxel(runtime, group, materialKey, x, y, z, options = {}) {
  const scale = options.scale || [1, 1, 1];
  const mesh = new external_three_["Mesh"](runtime.geometries.unit, runtime.materials[materialKey]);
  mesh.scale.set(scale[0], scale[1], scale[2]);
  mesh.position.set(x, y - 0.5 + (scale[1] - 1) * 0.5, z);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  group.add(mesh);
  return mesh;
}
function addParticle(runtime, targetList, group, materialKey, config) {
  const mesh = new external_three_["Mesh"](runtime.geometries.sparkCube, runtime.materials[materialKey]);
  mesh.position.set(config.origin.x, config.origin.y, config.origin.z);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  group.add(mesh);
  targetList.push({
    mesh,
    origin: config.origin,
    radius: config.radius,
    speed: config.speed,
    lift: config.lift,
    phase: config.phase
  });
}
function animateParticleSet(items, timestamp, indexOffset = 0) {
  if (!Array.isArray(items)) return;
  items.forEach((item, index) => {
    item.mesh.position.x = item.origin.x + Math.cos(timestamp * 0.001 * item.speed + item.phase) * item.radius;
    item.mesh.position.z = item.origin.z + Math.sin(timestamp * 0.00115 * item.speed + item.phase) * item.radius;
    item.mesh.position.y = item.origin.y + Math.sin(timestamp * 0.0015 * item.speed + item.phase + index + indexOffset) * item.lift;
    item.mesh.rotation.y = timestamp * 0.0012 * item.speed + item.phase;
    item.mesh.rotation.x = item.mesh.rotation.y * 0.65;
  });
}
function addFlowerPatch(runtime, group, x, z, colorKey = "blossom") {
  const baseY = getDecorationBaseY(x, z);
  addVoxel(runtime, group, "leaf", x, baseY, z, {
    scale: [0.2, 0.28, 0.2],
    castShadow: false
  });
  addVoxel(runtime, group, colorKey, x, baseY + 0.32, z, {
    scale: [0.35, 0.2, 0.35],
    castShadow: false
  });
}
function buildCloud(runtime, x, y, z, scale = 1) {
  const cloud = new external_three_["Group"]();
  const offsets = [[-1.1, 0, 0, 1.6], [0, 0.25, 0.2, 1.9], [1.25, -0.1, -0.2, 1.35], [0.3, -0.2, 0.85, 1.15]];
  offsets.forEach(offset => {
    const mesh = new external_three_["Mesh"](runtime.geometries.unit, runtime.materials.cloud);
    mesh.scale.set(offset[3] * scale, 0.8 * scale, 1.1 * scale);
    mesh.position.set(offset[0] * scale, offset[1] * scale, offset[2] * scale);
    cloud.add(mesh);
  });
  cloud.position.set(x, y, z);
  runtime.world.add(cloud);
  runtime.clouds.push({
    group: cloud,
    baseX: x,
    baseZ: z,
    speed: 0.09 + scale * 0.02,
    amplitude: 0.6 + scale * 0.2,
    phase: (x + z) * 0.35
  });
}
function sampleTerrainNoise(x, z) {
  const seed = Math.sin(x * 12.9898 + z * 78.233 + x * z * 0.217) * 43758.5453;
  return seed - Math.floor(seed);
}
function isIslandSurfaceCell(x, z) {
  const radial = Math.sqrt(x * x + z * z * 1.08);
  const noise = sampleTerrainNoise(x, z);
  return radial <= 4.85 + noise * 0.45;
}
function getIslandTopHeight(x, z) {
  const key = `${x}:${z}`;
  const radial = Math.sqrt(x * x + z * z);
  const noise = sampleTerrainNoise(x, z);
  if (Math.abs(x) <= 1 && Math.abs(z) <= 1) return 0;
  if (PATH_CELLS.has(key)) return 0;
  if (radial < 2.2) return 0;
  if (radial < 3.65 && noise > 0.74) return 1;
  if (radial < 4.6 && noise > 0.86) return 1;
  return 0;
}
function getIslandDepth(x, z, topY) {
  const radial = Math.sqrt(x * x + z * z * 1.06);
  const noise = sampleTerrainNoise(x, z);
  return Math.max(3, Math.floor(3.2 + Math.max(0, 4.9 - radial) * 1.25 + noise * 2 + topY * 0.6));
}
function getSurfaceMaterialKey(runtime, x, z) {
  const key = `${x}:${z}`;
  if (Math.abs(x) <= 1 && Math.abs(z) <= 1) return "soil";
  if (PATH_CELLS.has(key)) return "path";
  if (runtime.themeKey === "swamp_redwood" && SWAMP_WATER_CELLS.has(key)) {
    return "water";
  }
  return "grass";
}
function getGroundTopY(x, z) {
  const cellX = Math.round(x);
  const cellZ = Math.round(z);
  return isIslandSurfaceCell(cellX, cellZ) ? getIslandTopHeight(cellX, cellZ) : 0;
}
function getDecorationBaseY(x, z) {
  return getGroundTopY(x, z) + 1;
}
function addGroundedVoxel(runtime, group, materialKey, x, z, options = {}, lift = 0) {
  return addVoxel(runtime, group, materialKey, x, getDecorationBaseY(x, z) + lift, z, options);
}
function buildFloatingShard(runtime, x, y, z, width = 2, depth = 2, height = 2) {
  for (let ix = 0; ix < width; ix += 1) {
    for (let iz = 0; iz < depth; iz += 1) {
      const offsetX = x + ix - (width - 1) * 0.5;
      const offsetZ = z + iz - (depth - 1) * 0.5;
      addVoxel(runtime, runtime.world, "grass", offsetX, y, offsetZ, {
        castShadow: false
      });
      const edgeDistance = Math.min(ix, iz, width - 1 - ix, depth - 1 - iz);
      const localDepth = Math.max(1, height - (edgeDistance === 0 ? 1 : 0));
      for (let iy = 1; iy <= localDepth; iy += 1) {
        addVoxel(runtime, runtime.world, "stone", offsetX, y - iy, offsetZ, {
          castShadow: false
        });
      }
    }
  }
}
function addLanternPost(runtime, group, x, z, glowMaterialKey = "glow") {
  const baseY = getDecorationBaseY(x, z);
  addVoxel(runtime, group, "plank", x, baseY, z, {
    scale: [0.5, 1.6, 0.5]
  });
  addVoxel(runtime, group, glowMaterialKey, x, baseY + 1.6, z, {
    scale: [0.42, 0.42, 0.42],
    castShadow: false,
    receiveShadow: false
  });
  if (runtime.isNight) {
    const glowPalette = glowMaterialKey === "pinkGlow" ? runtime.themeDefinition.palette.accentGlow : runtime.themeDefinition.palette.glow;
    const light = new external_three_["PointLight"](glowPalette[0], 3.4, 6.5, 2);
    light.position.set(x, baseY + 0.82, z);
    light.castShadow = false;
    group.add(light);
  }
}
function addGrassTuft(runtime, group, x, z, materialKey = "leaf") {
  const baseY = getDecorationBaseY(x, z);
  [[x - 0.14, baseY + 0.02, z, [0.18, 0.72, 0.18]], [x + 0.14, baseY + 0.08, z + 0.08, [0.18, 0.58, 0.18]], [x + 0.02, baseY + 0.12, z - 0.16, [0.18, 0.86, 0.18]]].forEach(item => {
    addVoxel(runtime, group, materialKey, item[0], item[1], item[2], {
      scale: item[3],
      castShadow: false
    });
  });
}
function addMiniBirch(runtime, group, x, z) {
  const baseY = getDecorationBaseY(x, z);
  addVoxel(runtime, group, "trunk", x, baseY, z, {
    scale: [0.24, 1.26, 0.24],
    castShadow: false
  });
  addVoxel(runtime, group, "leaf", x, baseY + 1.24, z, {
    scale: [0.64, 0.56, 0.64],
    castShadow: false
  });
  addVoxel(runtime, group, "blossom", x, baseY + 1.76, z, {
    scale: [0.28, 0.18, 0.28],
    castShadow: false
  });
}
function addCrystalCluster(runtime, group, x, z) {
  const baseY = getDecorationBaseY(x, z);
  [[x, baseY, z, [0.32, 1.46, 0.32]], [x + 0.28, baseY, z - 0.2, [0.22, 1.02, 0.22]], [x - 0.24, baseY, z + 0.16, [0.2, 0.88, 0.2]]].forEach(item => {
    addVoxel(runtime, group, "stone", item[0], item[1], item[2], {
      scale: item[3],
      castShadow: false
    });
  });
  addVoxel(runtime, group, "pinkGlow", x, baseY + 1.46, z, {
    scale: [0.16, 0.16, 0.16],
    castShadow: false,
    receiveShadow: false
  });
}
function addSwampStump(runtime, group, x, z) {
  const baseY = getDecorationBaseY(x, z);
  addVoxel(runtime, group, "trunk", x, baseY, z, {
    scale: [0.82, 0.92, 0.82]
  });
  addVoxel(runtime, group, "trunkZ", x + 0.56, baseY, z, {
    scale: [0.48, 0.44, 1.02]
  });
  addVoxel(runtime, group, "pinkGlow", x, baseY + 0.92, z, {
    scale: [0.2, 0.2, 0.2],
    castShadow: false,
    receiveShadow: false
  });
}
function buildNightAtmosphere(runtime, group) {
  if (!runtime.isNight) return;
  const materialKey = runtime.themeKey === "sakura_grove" || runtime.themeKey === "swamp_redwood" ? "pinkGlow" : "glow";
  [[-3.2, -1.4, 1.15, 0.46, 0.72, 0.18, 0.2], [3.1, -1.8, 1.35, 0.52, 0.64, 0.22, 1.4], [-2.4, 2.8, 1.72, 0.4, 0.82, 0.2, 2.6], [2.6, 2.4, 1.46, 0.44, 0.76, 0.18, 3.8], [-0.9, 3.6, 1.28, 0.36, 0.9, 0.16, 4.7], [1.2, -3.4, 1.58, 0.48, 0.68, 0.22, 5.5]].forEach((item, index) => {
    addParticle(runtime, runtime.ambientLights, group, index % 3 === 0 ? "glow" : materialKey, {
      origin: new external_three_["Vector3"](item[0], getGroundTopY(item[0], item[1]) + item[2], item[1]),
      radius: item[3],
      speed: item[4],
      lift: item[5],
      phase: item[6]
    });
  });
}
function buildThemeTerrainDecorations(runtime, terrain) {
  if (runtime.themeKey === "birch_blossom") {
    [[-4.4, -1], [-3.8, 2.5], [4.2, -2], [3.6, 2.7], [-1.5, -3.7], [1.8, -3.4], [0.8, 3.8]].forEach((item, index) => {
      addFlowerPatch(runtime, terrain, item[0], item[1], index % 3 === 0 ? "apple" : "blossom");
    });
    [[-3.9, 3.4], [3.8, 3.2], [-4.1, -2.8], [4.1, -1.7]].forEach(item => {
      addMiniBirch(runtime, terrain, item[0], item[1]);
    });
    addMiniBirch(runtime, terrain, -1.25, -0.8);
    addMiniBirch(runtime, terrain, 1.35, -0.2);
    addFlowerPatch(runtime, terrain, -0.35, 0.95, "blossom");
    addFlowerPatch(runtime, terrain, 0.45, 0.72, "blossom");
    addLanternPost(runtime, terrain, -2.2, 4.4, "pinkGlow");
    addLanternPost(runtime, terrain, 2.2, 4.4, "pinkGlow");
    return;
  }
  if (runtime.themeKey === "snow_spruce") {
    [[-4.2, -1.8, [0.34, 1.4, 0.34]], [-3.6, 2.8, [0.26, 1.08, 0.26]], [4.2, -2.3, [0.34, 1.5, 0.34]], [3.4, 2.6, [0.24, 0.96, 0.24]]].forEach(item => {
      addGroundedVoxel(runtime, terrain, "stone", item[0], item[1], {
        scale: item[2],
        castShadow: false
      });
      addGroundedVoxel(runtime, terrain, "pinkGlow", item[0], item[1], {
        scale: [0.16, 0.16, 0.16],
        castShadow: false,
        receiveShadow: false
      }, item[2][1]);
    });
    addCrystalCluster(runtime, terrain, -0.5, -0.9);
    addCrystalCluster(runtime, terrain, 0.7, -0.4);
    addLanternPost(runtime, terrain, -2.2, 4.4, "pinkGlow");
    addLanternPost(runtime, terrain, 2.2, 4.4, "pinkGlow");
    return;
  }
  if (runtime.themeKey === "sakura_grove") {
    [[-4.2, -1.2], [-3.8, 2.6], [4.1, -2.3], [3.6, 2.8], [-1.6, -3.8], [1.8, -3.5], [0.8, 3.9], [-0.7, 3.7]].forEach(item => {
      addFlowerPatch(runtime, terrain, item[0], item[1], "blossom");
    });
    addFlowerPatch(runtime, terrain, -0.55, 0.9, "blossom");
    addFlowerPatch(runtime, terrain, 0.35, 0.55, "blossom");
    addMiniBirch(runtime, terrain, -1.2, -0.65);
    addLanternPost(runtime, terrain, -2.2, 4.4, "pinkGlow");
    addLanternPost(runtime, terrain, 2.2, 4.4, "pinkGlow");
    return;
  }
  if (runtime.themeKey === "savanna_acacia") {
    [[-4.2, -1.6], [-3.6, 2.8], [4, -2.2], [3.8, 2.7], [-1.4, -3.8], [1.6, -3.3], [0.8, 3.9]].forEach(item => {
      addGrassTuft(runtime, terrain, item[0], item[1]);
    });
    [[-3.9, 3.3, [0.68, 1.8, 0.68]], [4.2, -1.9, [0.74, 2.1, 0.74]], [2.2, 4.1, [0.52, 1.3, 0.52]]].forEach(item => {
      addGroundedVoxel(runtime, terrain, "stone", item[0], item[1], {
        scale: item[2],
        castShadow: false
      });
    });
    addGrassTuft(runtime, terrain, -0.45, 0.88);
    addGrassTuft(runtime, terrain, 0.4, 0.62);
    addGroundedVoxel(runtime, terrain, "stone", 1.15, -0.35, {
      scale: [0.7, 0.9, 0.7],
      castShadow: false
    });
    addLanternPost(runtime, terrain, -2.2, 4.4, "glow");
    addLanternPost(runtime, terrain, 2.2, 4.4, "glow");
    return;
  }
  if (runtime.themeKey === "swamp_redwood") {
    [[-4.2, -1.1], [-3.6, 2.8], [4.1, -2.2], [3.6, 2.9], [-1.4, -3.8], [1.8, -3.4]].forEach(item => {
      addGrassTuft(runtime, terrain, item[0], item[1]);
    });
    [[-3.9, 3.3], [4, -1.8], [-1.6, 4]].forEach(item => {
      addGroundedVoxel(runtime, terrain, "trunk", item[0], item[1], {
        scale: [0.46, 1.24, 0.46]
      });
      addGroundedVoxel(runtime, terrain, "pinkGlow", item[0], item[1], {
        scale: [0.18, 0.18, 0.18],
        castShadow: false,
        receiveShadow: false
      }, 1.24);
    });
    addSwampStump(runtime, terrain, -0.35, -0.55);
    addGrassTuft(runtime, terrain, 0.55, 0.82);
    addLanternPost(runtime, terrain, -2.2, 4.4, "pinkGlow");
    addLanternPost(runtime, terrain, 2.2, 4.4, "pinkGlow");
    return;
  }
  [[-4.2, -1.2], [-3.8, 2.6], [4.1, -2.3], [3.6, 2.8], [-1.6, -3.8], [1.8, -3.5]].forEach((item, index) => {
    addFlowerPatch(runtime, terrain, item[0], item[1], index % 2 === 0 ? "blossom" : "apple");
  });
  [[-3.9, 3.4], [3.7, 3.1], [-4.1, -2.8], [4.2, -1.6]].forEach(item => {
    addGroundedVoxel(runtime, terrain, "leaf", item[0], item[1], {
      scale: [0.22, 0.75, 0.22],
      castShadow: false
    });
    addGroundedVoxel(runtime, terrain, "leaf", item[0], item[1], {
      scale: [0.46, 0.18, 0.46],
      castShadow: false
    }, 0.75);
  });
  addLanternPost(runtime, terrain, -2.2, 4.4, "glow");
  addLanternPost(runtime, terrain, 2.2, 4.4, "glow");
}
function buildThemeClouds(runtime) {
  (runtime.themeDefinition.clouds || []).forEach(item => {
    buildCloud(runtime, item[0], item[1], item[2], item[3]);
  });
}
function buildTerrain(runtime) {
  const terrain = new external_three_["Group"]();
  for (let x = -6; x <= 6; x += 1) {
    for (let z = -6; z <= 6; z += 1) {
      if (!isIslandSurfaceCell(x, z)) continue;
      const topY = getIslandTopHeight(x, z);
      const depth = getIslandDepth(x, z, topY);
      addVoxel(runtime, terrain, getSurfaceMaterialKey(runtime, x, z), x, topY, z, {
        castShadow: false
      });
      for (let step = 1; step <= depth; step += 1) {
        const y = topY - step;
        const materialKey = step > depth - 2 || y < -4 ? "stone" : "dirt";
        addVoxel(runtime, terrain, materialKey, x, y, z, {
          castShadow: false,
          receiveShadow: y >= -2
        });
      }
    }
  }
  [[0, -7, 0, [1.1, 3.4, 1.1]], [-0.7, -6.2, 0.5, [0.8, 2.2, 0.8]], [0.8, -6, -0.6, [0.7, 2, 0.7]]].forEach(item => {
    addVoxel(runtime, terrain, "stone", item[0], item[1], item[2], {
      scale: item[3],
      castShadow: false
    });
  });
  [[-9.2, -0.4, -3.2, 2, 2, 2], [9.4, -0.6, -4.4, 3, 2, 3], [-7.4, 0.4, 7.8, 2, 2, 2], [8.1, 0.2, 6.6, 3, 2, 2]].forEach(item => {
    buildFloatingShard(runtime, item[0], item[1], item[2], item[3], item[4], item[5]);
  });
  [[-1.1, 1.02, 4.3, [1.15, 0.22, 1.1]], [0, 1.02, 4.9, [1.25, 0.22, 1.25]], [1.1, 1.02, 4.3, [1.15, 0.22, 1.1]]].forEach(item => {
    addVoxel(runtime, terrain, "plank", item[0], item[1], item[2], {
      scale: item[3],
      castShadow: false
    });
  });
  buildThemeTerrainDecorations(runtime, terrain);
  buildNightAtmosphere(runtime, terrain);
  runtime.world.add(terrain);
  buildThemeClouds(runtime);
}
function addOakLeaves(runtime, group, cells, materialKey = "leaf", options = {}) {
  cells.forEach(cell => {
    addVoxel(runtime, group, materialKey, cell[0], cell[1], cell[2], options);
  });
}
function getBloomOakLeafCells() {
  return [[0, 4, 0], [-1, 4, 0], [1, 4, 0], [0, 4, -1], [0, 4, 1], [-2, 5, -1], [-1, 5, -2], [0, 5, -2], [1, 5, -2], [2, 5, -1], [-2, 5, 0], [-1, 5, 0], [0, 5, 0], [1, 5, 0], [2, 5, 0], [-2, 5, 1], [-1, 5, 1], [0, 5, 1], [1, 5, 1], [2, 5, 1], [-1, 5, 2], [0, 5, 2], [1, 5, 2], [-2, 6, 0], [-1, 6, -1], [0, 6, -1], [1, 6, -1], [2, 6, 0], [-1, 6, 0], [0, 6, 0], [1, 6, 0], [0, 6, 1], [1, 6, 1], [0, 7, 0], [-1, 7, 0], [0, 7, -1], [1, 7, 0]];
}
function getFruitOakLeafCells() {
  return [[0, 4, 0], [-1, 4, 0], [1, 4, 0], [0, 4, -1], [0, 4, 1], [-2, 5, -1], [-1, 5, -2], [0, 5, -2], [1, 5, -2], [2, 5, -1], [-2, 5, 0], [-1, 5, 0], [0, 5, 0], [1, 5, 0], [2, 5, 0], [-2, 5, 1], [-1, 5, 1], [0, 5, 1], [1, 5, 1], [2, 5, 1], [-1, 5, 2], [0, 5, 2], [1, 5, 2], [-2, 6, -1], [-1, 6, -1], [0, 6, -1], [1, 6, -1], [2, 6, -1], [-2, 6, 0], [-1, 6, 0], [0, 6, 0], [1, 6, 0], [2, 6, 0], [-1, 6, 1], [0, 6, 1], [1, 6, 1], [0, 6, 2], [-1, 7, 0], [0, 7, 0], [1, 7, 0], [0, 7, -1], [0, 7, 1]];
}
function getBirchLeafCells() {
  return [[0, 4, 0], [-1, 4, 0], [1, 4, 0], [0, 4, -1], [0, 4, 1], [-1, 5, -1], [0, 5, -1], [1, 5, -1], [-2, 5, 0], [-1, 5, 0], [0, 5, 0], [1, 5, 0], [2, 5, 0], [-1, 5, 1], [0, 5, 1], [1, 5, 1], [0, 5, 2], [-1, 6, 0], [0, 6, -1], [0, 6, 0], [1, 6, 0], [0, 6, 1], [0, 7, 0]];
}
function createStageShell() {
  const root = new external_three_["Group"]();
  const treePivot = new external_three_["Group"]();
  const floatingLights = [];
  root.add(treePivot);
  return {
    root,
    treePivot,
    floatingLights
  };
}
function addRoundCanopyLayer(runtime, group, materialKey, centerX, centerY, centerZ, radius, scale = [0.92, 0.82, 0.92]) {
  for (let x = -radius; x <= radius; x += 1) {
    for (let z = -radius; z <= radius; z += 1) {
      if (Math.sqrt(x * x + z * z) > radius + 0.2) continue;
      addVoxel(runtime, group, materialKey, centerX + x, centerY, centerZ + z, {
        scale,
        castShadow: true
      });
    }
  }
}
function addHorizontalLog(runtime, group, axis, x, y, z, length, thickness = 0.5) {
  const alongX = axis === "x";
  const segmentCount = Math.max(1, Math.ceil(length));
  const segmentLength = length / segmentCount;
  for (let index = 0; index < segmentCount; index += 1) {
    const offset = -length * 0.5 + segmentLength * (index + 0.5);
    addVoxel(runtime, group, alongX ? "trunkX" : "trunkZ", alongX ? x + offset : x, y, alongX ? z : z + offset, {
      scale: alongX ? [segmentLength + 0.02, thickness, thickness] : [thickness, thickness, segmentLength + 0.02]
    });
  }
}
function addTreeRoots(runtime, group, spread = 1.3, thickness = 0.44) {
  addHorizontalLog(runtime, group, "x", 0, 1, 0, spread, thickness);
  addHorizontalLog(runtime, group, "z", 0, 1.02, 0, spread, thickness);
}
function addPlotSign(runtime, group, x = 1.18, z = -1.18) {
  const baseY = getDecorationBaseY(x, z);
  addVoxel(runtime, group, "trunk", x, baseY, z, {
    scale: [0.26, 1.34, 0.26]
  });
  addVoxel(runtime, group, "plank", x, baseY + 1.18, z, {
    scale: [1.46, 0.76, 0.2],
    castShadow: true
  });
}
function buildBirchTreeStage(runtime, fruiting = false) {
  const stage = createStageShell();
  addTreeRoots(runtime, stage.treePivot, 1.18, 0.32);
  for (let y = 1; y <= 5; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, {
      scale: [0.66, 1, 0.66]
    });
  }
  addHorizontalLog(runtime, stage.treePivot, "x", 0.62, 4.34, 0, 1.56, 0.4);
  addHorizontalLog(runtime, stage.treePivot, "z", -0.32, 4.78, -0.54, 1.28, 0.36);
  addOakLeaves(runtime, stage.treePivot, getBirchLeafCells(), "leaf", {
    castShadow: true
  });
  const detailCells = fruiting ? [[-1.02, 4.48, 0.84], [1.02, 4.46, 0.92], [-0.92, 5.08, -0.08], [0.94, 5.1, -0.12], [0.06, 5.28, 0.96], [0.04, 6.04, -0.88]] : [[-1.1, 4.92, -0.86], [1.12, 5.08, -0.78], [-1.04, 5.12, 0.94], [1.04, 5.16, 0.98], [0, 6.16, -0.9]];
  detailCells.forEach(cell => {
    addVoxel(runtime, stage.treePivot, fruiting ? "apple" : "blossom", cell[0], cell[1], cell[2], {
      scale: fruiting ? [0.32, 0.4, 0.32] : [0.32, 0.32, 0.32],
      castShadow: false
    });
  });
  [{
    origin: new external_three_["Vector3"](-0.9, 5.08, 0.4),
    radius: 0.7,
    speed: 0.94,
    lift: 0.18,
    phase: 0.2
  }, {
    origin: new external_three_["Vector3"](0.92, 5.72, -0.22),
    radius: 0.78,
    speed: 0.82,
    lift: 0.22,
    phase: 1.6
  }].forEach(config => {
    addParticle(runtime, stage.floatingLights, stage.root, fruiting ? "glow" : "pinkGlow", config);
  });
  return stage;
}
function buildBirchBloomStage(runtime) {
  return buildBirchTreeStage(runtime, false);
}
function buildBirchFruitStage(runtime) {
  return buildBirchTreeStage(runtime, true);
}
function buildSpruceTreeStage(runtime, fruiting = false) {
  const stage = createStageShell();
  addTreeRoots(runtime, stage.treePivot, 1.34, 0.38);
  for (let y = 1; y <= 6; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, {
      scale: [0.68, 1, 0.68]
    });
  }
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 3.1, 0, 2, [0.96, 0.72, 0.96]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 4.25, 0, 2, [0.9, 0.68, 0.9]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 5.36, 0, 1, [0.84, 0.76, 0.84]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 6.42, 0, 1, [0.7, 0.76, 0.7]);
  addVoxel(runtime, stage.treePivot, "leaf", 0, 7.3, 0, {
    scale: [0.5, 0.84, 0.5],
    castShadow: true
  });
  const detailCells = fruiting ? [[-1.08, 3.08, 0.86], [1.08, 3.36, 0.72], [-0.9, 4.12, -0.7], [0.92, 4.24, -0.64], [0.08, 5.22, 0.82]] : [[-1.14, 3.58, 0.84], [1.12, 4.7, -0.72], [0.88, 5.82, 0.12], [0.04, 6.76, 0.7]];
  detailCells.forEach(cell => {
    addVoxel(runtime, stage.treePivot, fruiting ? "apple" : "blossom", cell[0], cell[1], cell[2], {
      scale: fruiting ? [0.28, 0.42, 0.28] : [0.32, 0.2, 0.32],
      castShadow: false
    });
  });
  [{
    origin: new external_three_["Vector3"](-0.84, 4.12, 0.7),
    radius: 0.62,
    speed: 0.92,
    lift: 0.16,
    phase: 0.3
  }, {
    origin: new external_three_["Vector3"](0.84, 5.18, -0.2),
    radius: 0.66,
    speed: 0.82,
    lift: 0.18,
    phase: 1.8
  }].forEach(config => {
    addParticle(runtime, stage.floatingLights, stage.root, fruiting ? "glow" : "pinkGlow", config);
  });
  return stage;
}
function buildSpruceBloomStage(runtime) {
  return buildSpruceTreeStage(runtime, false);
}
function buildSpruceFruitStage(runtime) {
  return buildSpruceTreeStage(runtime, true);
}
function buildSakuraTreeStage(runtime, fruiting = false) {
  const stage = createStageShell();
  addTreeRoots(runtime, stage.treePivot, 1.46, 0.4);
  for (let y = 1; y <= 4; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, {
      scale: [0.78, 1, 0.78]
    });
  }
  addHorizontalLog(runtime, stage.treePivot, "x", 0.68, 4.32, 0, 1.72, 0.44);
  addHorizontalLog(runtime, stage.treePivot, "z", -0.42, 4.62, -0.64, 1.5, 0.4);
  addRoundCanopyLayer(runtime, stage.treePivot, "blossom", 0, 4.82, 0, 2, [0.96, 0.76, 0.96]);
  addRoundCanopyLayer(runtime, stage.treePivot, "blossom", 0.36, 5.72, -0.12, 2, [0.9, 0.72, 0.9]);
  addRoundCanopyLayer(runtime, stage.treePivot, "blossom", -0.5, 6.52, 0.18, 1, [0.84, 0.76, 0.84]);
  [[-1.72, 4.26, 0], [1.72, 4.22, 0.12], [0.18, 4.18, 1.72], [-0.9, 4.42, -1.52]].forEach(cell => {
    addVoxel(runtime, stage.treePivot, "blossom", cell[0], cell[1], cell[2], {
      scale: [0.4, 0.58, 0.4],
      castShadow: true
    });
  });
  if (fruiting) {
    [[-1.12, 4.36, 0.86], [1.18, 4.52, 0.92], [-0.72, 5.12, -0.92], [0.9, 5.18, -0.76], [0.18, 5.62, 1.02]].forEach(cell => {
      addVoxel(runtime, stage.treePivot, "apple", cell[0], cell[1], cell[2], {
        scale: [0.32, 0.4, 0.32],
        castShadow: false
      });
    });
  }
  [{
    origin: new external_three_["Vector3"](-1.02, 5.06, 0.5),
    radius: 0.82,
    speed: 0.86,
    lift: 0.2,
    phase: 0.2
  }, {
    origin: new external_three_["Vector3"](1.08, 5.76, -0.3),
    radius: 0.9,
    speed: 0.76,
    lift: 0.24,
    phase: 1.7
  }].forEach(config => {
    addParticle(runtime, stage.floatingLights, stage.root, fruiting ? "glow" : "pinkGlow", config);
  });
  return stage;
}
function buildSakuraBloomStage(runtime) {
  return buildSakuraTreeStage(runtime, false);
}
function buildSakuraFruitStage(runtime) {
  return buildSakuraTreeStage(runtime, true);
}
function buildAcaciaTreeStage(runtime, fruiting = false) {
  const stage = createStageShell();
  addTreeRoots(runtime, stage.treePivot, 1.58, 0.46);
  for (let y = 1; y <= 3; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, {
      scale: [0.76, 1, 0.76]
    });
  }
  addHorizontalLog(runtime, stage.treePivot, "x", 0.66, 3.4, 0.08, 1.76, 0.5);
  addVoxel(runtime, stage.treePivot, "trunk", 1.3, 4.18, 0.08, {
    scale: [0.58, 1.18, 0.58]
  });
  addHorizontalLog(runtime, stage.treePivot, "x", -0.62, 3.76, -0.34, 1.38, 0.42);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 1.2, 4.82, 0.08, 2, [0.98, 0.7, 0.98]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", -0.9, 4.38, -0.42, 1, [0.92, 0.68, 0.92]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0.28, 5.54, 0.02, 1, [0.88, 0.64, 0.88]);
  const detailCells = fruiting ? [[1.62, 4.38, 0.72], [0.82, 4.36, -0.9], [1.2, 4.44, 1.02], [0.08, 5.04, -0.82], [-1.08, 3.98, -0.62]] : [[1.62, 5.08, 0.18], [0.64, 5.12, -1.02], [1.18, 5.14, 1.1], [-1.12, 4.7, -0.7]];
  detailCells.forEach(cell => {
    addVoxel(runtime, stage.treePivot, fruiting ? "apple" : "blossom", cell[0], cell[1], cell[2], {
      scale: fruiting ? [0.28, 0.4, 0.28] : [0.32, 0.3, 0.32],
      castShadow: false
    });
  });
  [{
    origin: new external_three_["Vector3"](1.18, 5.62, 0.32),
    radius: 0.78,
    speed: 0.82,
    lift: 0.16,
    phase: 0.4
  }, {
    origin: new external_three_["Vector3"](0.1, 5.9, -0.8),
    radius: 0.72,
    speed: 0.92,
    lift: 0.16,
    phase: 1.8
  }].forEach(config => {
    addParticle(runtime, stage.floatingLights, stage.root, fruiting ? "glow" : "pinkGlow", config);
  });
  return stage;
}
function buildAcaciaBloomStage(runtime) {
  return buildAcaciaTreeStage(runtime, false);
}
function buildAcaciaFruitStage(runtime) {
  return buildAcaciaTreeStage(runtime, true);
}
function buildRedwoodTreeStage(runtime, fruiting = false) {
  const stage = createStageShell();
  addTreeRoots(runtime, stage.treePivot, 2.08, 0.58);
  for (let y = 1; y <= 8; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, {
      scale: [1.02, 1, 1.02]
    });
  }
  addHorizontalLog(runtime, stage.treePivot, "x", 0, 4.42, 0, 3.2, 0.44);
  addHorizontalLog(runtime, stage.treePivot, "z", 0, 5.58, 0, 2.8, 0.4);
  addHorizontalLog(runtime, stage.treePivot, "x", 0, 6.72, 0, 2.2, 0.36);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 4.62, 0, 2, [0.98, 0.68, 0.98]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 5.76, 0, 2, [0.92, 0.66, 0.92]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 6.86, 0, 1, [0.86, 0.74, 0.86]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 7.92, 0, 1, [0.76, 0.76, 0.76]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 8.9, 0, 1, [0.62, 0.72, 0.62]);
  addVoxel(runtime, stage.treePivot, "leaf", 0, 9.72, 0, {
    scale: [0.44, 0.78, 0.44],
    castShadow: true
  });
  const detailCells = fruiting ? [[-1.26, 4.34, 0.72], [1.24, 4.4, -0.66], [-0.92, 5.52, -0.72], [0.94, 5.58, 0.7], [0.08, 6.62, -0.82]] : [[-1.2, 4.86, 0.76], [1.18, 5.02, -0.72], [-0.82, 6.02, -0.7], [0.82, 7.04, 0.68]];
  detailCells.forEach(cell => {
    addVoxel(runtime, stage.treePivot, fruiting ? "apple" : "blossom", cell[0], cell[1], cell[2], {
      scale: fruiting ? [0.24, 0.4, 0.24] : [0.26, 0.3, 0.26],
      castShadow: false
    });
  });
  [{
    origin: new external_three_["Vector3"](0.88, 6.62, 0.76),
    radius: 0.7,
    speed: 0.76,
    lift: 0.14,
    phase: 0.3
  }, {
    origin: new external_three_["Vector3"](-0.68, 7.46, -0.16),
    radius: 0.64,
    speed: 0.88,
    lift: 0.12,
    phase: 1.7
  }].forEach(config => {
    addParticle(runtime, stage.floatingLights, stage.root, fruiting ? "glow" : "pinkGlow", config);
  });
  return stage;
}
function buildRedwoodBloomStage(runtime) {
  return buildRedwoodTreeStage(runtime, false);
}
function buildRedwoodFruitStage(runtime) {
  return buildRedwoodTreeStage(runtime, true);
}
function buildEmptyStage(runtime) {
  const root = new external_three_["Group"]();
  const kind = runtime.themeDefinition.treeKind;
  addPlotSign(runtime, root);
  if (kind === "birch") {
    addFlowerPatch(runtime, root, -0.72, 0.94, "blossom");
    addFlowerPatch(runtime, root, 0.22, 0.82, "blossom");
    addGroundedVoxel(runtime, root, "stone", -0.7, -0.42, {
      scale: [0.62, 0.38, 0.54],
      castShadow: false
    });
  } else if (kind === "spruce") {
    addCrystalCluster(runtime, root, -0.22, 0.1);
    addGroundedVoxel(runtime, root, "stone", -0.88, 0.82, {
      scale: [0.7, 0.46, 0.7],
      castShadow: false
    });
    addGroundedVoxel(runtime, root, "blossom", -0.88, 0.82, {
      scale: [0.72, 0.18, 0.72],
      castShadow: false
    }, 0.46);
  } else if (kind === "sakura") {
    addVoxel(runtime, root, "plank", 0, 1, -0.88, {
      scale: [2.18, 0.2, 0.2],
      castShadow: false
    });
    addVoxel(runtime, root, "plank", -0.88, 1.02, 0, {
      scale: [0.2, 0.2, 1.96],
      castShadow: false
    });
    addFlowerPatch(runtime, root, -0.52, 0.72, "blossom");
    addFlowerPatch(runtime, root, 0.24, 0.66, "blossom");
  } else if (kind === "acacia") {
    addHorizontalLog(runtime, root, "x", -0.32, 1, 0.14, 1.18, 0.48);
    addGrassTuft(runtime, root, -0.82, 0.82);
    addGroundedVoxel(runtime, root, "stone", 0.58, 0.62, {
      scale: [0.58, 0.42, 0.62],
      castShadow: false
    });
  } else if (kind === "redwood") {
    addSwampStump(runtime, root, 0.08, -0.08);
    addGrassTuft(runtime, root, -0.86, 0.86);
    addFlowerPatch(runtime, root, 0.72, 0.68, "pinkGlow");
  } else {
    addVoxel(runtime, root, "leaf", -0.6, 1, 0.8, {
      scale: [0.36, 0.22, 0.36],
      castShadow: false
    });
    addVoxel(runtime, root, "blossom", -0.2, 1.2, 0.4, {
      scale: [0.24, 0.24, 0.24],
      castShadow: false
    });
  }
  return {
    root,
    treePivot: null,
    floatingLights: []
  };
}
function buildOakSaplingStage(runtime) {
  const root = new external_three_["Group"]();
  const treePivot = new external_three_["Group"]();
  root.add(treePivot);
  addTreeRoots(runtime, treePivot, 0.86, 0.24);
  addVoxel(runtime, treePivot, "trunk", 0, 1, 0, {
    scale: [0.56, 0.82, 0.56]
  });
  addVoxel(runtime, treePivot, "trunk", 0, 1.86, 0, {
    scale: [0.5, 0.74, 0.5]
  });
  [[0, 2.58, 0], [-0.48, 2.28, 0], [0.48, 2.28, 0], [0, 2.28, -0.48], [0, 2.28, 0.48]].forEach(cell => {
    addVoxel(runtime, treePivot, "leaf", cell[0], cell[1], cell[2], {
      scale: [0.72, 0.72, 0.72],
      castShadow: true
    });
  });
  return {
    root,
    treePivot,
    floatingLights: []
  };
}
function buildOakBloomStage(runtime) {
  const root = new external_three_["Group"]();
  const treePivot = new external_three_["Group"]();
  const floatingLights = [];
  root.add(treePivot);
  addTreeRoots(runtime, treePivot, 1.52, 0.44);
  for (let y = 1; y <= 4; y += 1) {
    addVoxel(runtime, treePivot, "trunk", 0, y, 0, {
      scale: [0.92, 1, 0.92]
    });
  }
  addHorizontalLog(runtime, treePivot, "x", 0, 4.28, 0, 2.38, 0.46);
  addHorizontalLog(runtime, treePivot, "z", 0, 4.56, 0, 2.08, 0.4);
  addOakLeaves(runtime, treePivot, getBloomOakLeafCells(), "leaf", {
    castShadow: true
  });
  [[-1.35, 5.1, -1.15], [1.3, 5.15, -1.1], [-1.2, 5.12, 1.22], [1.28, 5.18, 1.12], [0, 6.2, -1.2], [0.12, 6.18, 1.18], [-0.9, 6.1, 0], [0.95, 6.08, 0.08]].forEach(cell => {
    addVoxel(runtime, treePivot, "blossom", cell[0], cell[1], cell[2], {
      scale: [0.42, 0.42, 0.42],
      castShadow: false
    });
  });
  [{
    origin: new external_three_["Vector3"](-1.2, 5.2, 0.6),
    radius: 0.85,
    speed: 1.1,
    lift: 0.2,
    phase: 0.1
  }, {
    origin: new external_three_["Vector3"](1.4, 5.5, -0.2),
    radius: 0.92,
    speed: 0.86,
    lift: 0.28,
    phase: 1.4
  }, {
    origin: new external_three_["Vector3"](0.2, 6.2, 1.1),
    radius: 0.7,
    speed: 1.18,
    lift: 0.18,
    phase: 2.2
  }].forEach(config => {
    addParticle(runtime, floatingLights, root, "pinkGlow", config);
  });
  return {
    root,
    treePivot,
    floatingLights
  };
}
function buildOakFruitStage(runtime) {
  const root = new external_three_["Group"]();
  const treePivot = new external_three_["Group"]();
  const floatingLights = [];
  root.add(treePivot);
  addTreeRoots(runtime, treePivot, 1.62, 0.46);
  for (let y = 1; y <= 4; y += 1) {
    addVoxel(runtime, treePivot, "trunk", 0, y, 0, {
      scale: [0.98, 1, 0.98]
    });
  }
  addHorizontalLog(runtime, treePivot, "x", 0, 4.3, 0, 2.46, 0.48);
  addHorizontalLog(runtime, treePivot, "z", 0, 4.58, 0, 2.12, 0.42);
  addOakLeaves(runtime, treePivot, getFruitOakLeafCells(), "leaf", {
    castShadow: true
  });
  [[-1.1, 4.45, 1.08], [1.08, 4.4, 1.05], [-1.02, 5.08, -0.05], [1.05, 5.1, -0.04], [0.04, 5.25, 1.1], [0.15, 6.0, -1.1], [-0.92, 6.15, 0.8]].forEach(cell => {
    addVoxel(runtime, treePivot, "apple", cell[0], cell[1], cell[2], {
      scale: [0.48, 0.48, 0.48],
      castShadow: false
    });
  });
  [{
    origin: new external_three_["Vector3"](-1.1, 5.3, -1),
    radius: 0.96,
    speed: 0.82,
    lift: 0.26,
    phase: 0.2
  }, {
    origin: new external_three_["Vector3"](1.35, 5.8, 0.4),
    radius: 1.08,
    speed: 0.74,
    lift: 0.32,
    phase: 1.5
  }, {
    origin: new external_three_["Vector3"](0.1, 6.5, 1.2),
    radius: 0.78,
    speed: 0.94,
    lift: 0.24,
    phase: 2.4
  }, {
    origin: new external_three_["Vector3"](0.4, 4.8, -1.3),
    radius: 0.84,
    speed: 1.02,
    lift: 0.18,
    phase: 3.1
  }].forEach(config => {
    addParticle(runtime, floatingLights, root, "glow", config);
  });
  return {
    root,
    treePivot,
    floatingLights
  };
}
function buildHarvestStage(runtime) {
  const root = new external_three_["Group"]();
  const kind = runtime.themeDefinition.treeKind;
  if (kind === "spruce") {
    addVoxel(runtime, root, "trunk", 0, 1, 0, {
      scale: [0.92, 1.18, 0.92]
    });
    addVoxel(runtime, root, "trunk", 0, 2.08, 0, {
      scale: [0.62, 0.44, 0.62]
    });
    addCrystalCluster(runtime, root, -0.92, 0.42);
  } else if (kind === "acacia") {
    addVoxel(runtime, root, "trunk", 0.2, 1, 0, {
      scale: [1.18, 0.82, 1.18]
    });
    addHorizontalLog(runtime, root, "x", 1.12, 1.18, 0.12, 1.5, 0.5);
    addGrassTuft(runtime, root, -0.9, 0.7);
  } else if (kind === "redwood") {
    addSwampStump(runtime, root, 0.1, 0);
    addHorizontalLog(runtime, root, "x", -1.26, 1.06, -0.74, 1.46, 0.56);
  } else if (kind === "birch") {
    addVoxel(runtime, root, "trunk", 0, 1, 0, {
      scale: [0.9, 0.88, 0.9]
    });
    addHorizontalLog(runtime, root, "x", 0.96, 1.02, 0.62, 1.22, 0.44);
    addFlowerPatch(runtime, root, -0.82, 0.72, "blossom");
  } else if (kind === "sakura") {
    addVoxel(runtime, root, "trunk", 0, 1, 0, {
      scale: [1.02, 0.92, 1.02]
    });
    addHorizontalLog(runtime, root, "x", 1.08, 1.02, 0.62, 1.34, 0.48);
    addFlowerPatch(runtime, root, -0.62, 0.76, "blossom");
    addFlowerPatch(runtime, root, 0.28, 0.52, "blossom");
  } else {
    addVoxel(runtime, root, "trunk", 0, 1, 0, {
      scale: [1.08, 1, 1.08]
    });
    addVoxel(runtime, root, "trunk", 0, 2, 0, {
      scale: [0.78, 0.56, 0.78]
    });
  }
  [["x", 1.3, 1, 0.7, 1.5, 0.68], ["x", 2.42, 1.02, 0.72, 0.7, 0.68], ["x", -1.2, 1, -0.92, 1.28, 0.66], ["x", -2, 1.02, -0.92, 0.7, 0.66]].forEach(item => {
    addHorizontalLog(runtime, root, item[0], item[1], item[2], item[3], item[4], item[5]);
  });
  addVoxel(runtime, root, "plank", 1.8, 1, -1.5, {
    scale: [1.2, 0.8, 1.2]
  });
  addVoxel(runtime, root, "apple", 1.5, 1.45, -1.3, {
    scale: [0.42, 0.42, 0.42],
    castShadow: false
  });
  addVoxel(runtime, root, "apple", 1.95, 1.52, -1.55, {
    scale: [0.42, 0.42, 0.42],
    castShadow: false
  });
  return {
    root,
    treePivot: null,
    floatingLights: []
  };
}
function buildSaplingStage(runtime) {
  if (runtime.themeDefinition.treeKind === "birch") {
    const stage = createStageShell();
    addTreeRoots(runtime, stage.treePivot, 0.84, 0.22);
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.34, 1.04, 0.34]
    });
    addVoxel(runtime, stage.treePivot, "trunk", 0, 2.02, 0, {
      scale: [0.28, 0.86, 0.28]
    });
    addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 2.84, 0, 1, [0.66, 0.68, 0.66]);
    addVoxel(runtime, stage.treePivot, "blossom", 0.1, 3.08, 0.08, {
      scale: [0.22, 0.22, 0.22],
      castShadow: false
    });
    return stage;
  }
  if (runtime.themeDefinition.treeKind === "spruce") {
    const stage = createStageShell();
    addTreeRoots(runtime, stage.treePivot, 0.9, 0.24);
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.42, 1, 0.42]
    });
    addVoxel(runtime, stage.treePivot, "trunk", 0, 2, 0, {
      scale: [0.34, 0.82, 0.34]
    });
    addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 2.58, 0, 1, [0.74, 0.68, 0.74]);
    addVoxel(runtime, stage.treePivot, "leaf", 0, 3.32, 0, {
      scale: [0.4, 0.66, 0.4],
      castShadow: true
    });
    return stage;
  }
  if (runtime.themeDefinition.treeKind === "acacia") {
    const stage = createStageShell();
    addTreeRoots(runtime, stage.treePivot, 1.02, 0.28);
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.5, 0.96, 0.5]
    });
    addHorizontalLog(runtime, stage.treePivot, "x", 0.3, 1.92, 0.08, 0.86, 0.34);
    addVoxel(runtime, stage.treePivot, "trunk", 0.58, 2.6, 0.08, {
      scale: [0.34, 0.72, 0.34]
    });
    addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0.58, 3.04, 0.08, 1, [0.78, 0.62, 0.78]);
    return stage;
  }
  if (runtime.themeDefinition.treeKind === "redwood") {
    const stage = createStageShell();
    addTreeRoots(runtime, stage.treePivot, 1.18, 0.34);
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.58, 1.1, 0.58]
    });
    addVoxel(runtime, stage.treePivot, "trunk", 0, 2.08, 0, {
      scale: [0.48, 0.96, 0.48]
    });
    addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 2.76, 0, 1, [0.72, 0.64, 0.72]);
    addVoxel(runtime, stage.treePivot, "leaf", 0, 3.5, 0, {
      scale: [0.42, 0.7, 0.42],
      castShadow: true
    });
    return stage;
  }
  if (runtime.themeDefinition.treeKind === "sakura") {
    const stage = createStageShell();
    addTreeRoots(runtime, stage.treePivot, 0.92, 0.24);
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.5, 0.92, 0.5]
    });
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1.94, 0, {
      scale: [0.42, 0.72, 0.42]
    });
    [[0, 2.52, 0], [-0.46, 2.24, 0], [0.46, 2.24, 0], [0, 2.24, -0.46], [0, 2.24, 0.46]].forEach(cell => {
      addVoxel(runtime, stage.treePivot, "blossom", cell[0], cell[1], cell[2], {
        scale: [0.7, 0.7, 0.7],
        castShadow: true
      });
    });
    addVoxel(runtime, stage.treePivot, "leaf", 0, 2.18, 0, {
      scale: [0.42, 0.42, 0.42],
      castShadow: false
    });
    return stage;
  }
  return buildOakSaplingStage(runtime);
}
function buildBloomStage(runtime) {
  if (runtime.themeDefinition.treeKind === "birch") return buildBirchBloomStage(runtime);
  if (runtime.themeDefinition.treeKind === "spruce") return buildSpruceBloomStage(runtime);
  if (runtime.themeDefinition.treeKind === "sakura") return buildSakuraBloomStage(runtime);
  if (runtime.themeDefinition.treeKind === "acacia") return buildAcaciaBloomStage(runtime);
  if (runtime.themeDefinition.treeKind === "redwood") return buildRedwoodBloomStage(runtime);
  return buildOakBloomStage(runtime);
}
function buildFruitStage(runtime) {
  if (runtime.themeDefinition.treeKind === "birch") return buildBirchFruitStage(runtime);
  if (runtime.themeDefinition.treeKind === "spruce") return buildSpruceFruitStage(runtime);
  if (runtime.themeDefinition.treeKind === "sakura") return buildSakuraFruitStage(runtime);
  if (runtime.themeDefinition.treeKind === "acacia") return buildAcaciaFruitStage(runtime);
  if (runtime.themeDefinition.treeKind === "redwood") return buildRedwoodFruitStage(runtime);
  return buildOakFruitStage(runtime);
}
function buildStageForStatus(runtime, status) {
  if (status === "种植") return buildSaplingStage(runtime);
  if (status === "开花") return buildBloomStage(runtime);
  if (status === "结果") return buildFruitStage(runtime);
  if (status === "收获") return buildHarvestStage(runtime);
  return buildEmptyStage(runtime);
}
/* harmony default export */ var TreeScenevue_type_script_lang_js = ({
  props: {
    state: {
      type: Object,
      default() {
        return {};
      }
    },
    sceneTheme: {
      type: String,
      default: tree_scene_settings["a" /* DEFAULT_TREE_PLANT_SCENE_THEME */]
    },
    nightMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      runtime: null,
      initFailed: false,
      hasInteracted: false,
      nightStars: NIGHT_STAR_POSITIONS
    };
  },
  computed: {
    sceneStatus() {
      return this.state && this.state.tree_status ? this.state.tree_status : "未种植";
    },
    themeDefinition() {
      return getSceneThemeDefinition(this.sceneTheme, this.nightMode);
    },
    sceneThemeStyle() {
      return getSceneThemeStyle(this.sceneTheme, this.nightMode);
    }
  },
  watch: {
    sceneStatus() {
      this.rebuildStage();
    },
    sceneTheme() {
      this.refreshScene();
    },
    nightMode() {
      this.refreshScene();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initScene();
    });
  },
  beforeDestroy() {
    this.destroyScene();
  },
  beforeUnmount() {
    this.destroyScene();
  },
  methods: {
    rotateBy(angle) {
      if (this.runtime) {
        this.runtime.targetWorldRotationY += angle;
        this.hasInteracted = true;
      }
    },
    getHostElement() {
      const host = this.$refs.sceneHost;
      if (!host) return null;
      return host.$el || host;
    },
    refreshScene() {
      if (!this.$refs.sceneHost) return;
      this.hasInteracted = false;
      this.initFailed = false;
      this.destroyScene();
      this.$nextTick(() => {
        this.initScene();
      });
    },
    initScene() {
      if (typeof window === "undefined" || typeof document === "undefined") return;
      const host = this.getHostElement();
      if (!host) return;
      if (!window.WebGLRenderingContext && !window.WebGL2RenderingContext) {
        this.handleSceneUnavailable("missing_webgl_rendering_context");
        return;
      }
      let gl = null;
      try {
        const probe = document.createElement("canvas");
        gl = probe.getContext("webgl2") || probe.getContext("webgl") || probe.getContext("experimental-webgl");
      } catch (e) {
        gl = null;
      }
      if (!gl) {
        this.handleSceneUnavailable("failed_to_create_webgl_context");
        return;
      }
      const releaseProbe = gl.getExtension && gl.getExtension("WEBGL_lose_context");
      if (releaseProbe) releaseProbe.loseContext();
      const hostRect = host.getBoundingClientRect();
      const initialAspect = hostRect.height > 0 ? hostRect.width / hostRect.height : 1;
      const themeDefinition = this.themeDefinition;
      const initialFraming = getCameraFraming(initialAspect, themeDefinition.key, this.nightMode);
      const runtime = createRuntime(initialFraming);
      runtime.host = host;
      runtime.themeKey = themeDefinition.key;
      runtime.themeDefinition = themeDefinition;
      runtime.isNight = this.nightMode;
      let renderer = null;
      try {
        renderer = new external_three_["WebGLRenderer"]({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        });
      } catch (error) {
        this.handleSceneUnavailable("failed_to_initialize_renderer");
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = external_three_["PCFSoftShadowMap"];
      renderer.shadowMap.autoUpdate = false;
      renderer.outputColorSpace = external_three_["SRGBColorSpace"];
      renderer.toneMapping = external_three_["ACESFilmicToneMapping"];
      renderer.toneMappingExposure = themeDefinition.lights.toneExposure || 1.05;
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      host.innerHTML = "";
      host.appendChild(renderer.domElement);
      runtime.contextLostHandler = event => {
        event.preventDefault();
        if (this.runtime === runtime) {
          this.handleSceneUnavailable("webgl_context_lost");
        }
      };
      renderer.domElement.addEventListener("webglcontextlost", runtime.contextLostHandler, false);
      const scene = new external_three_["Scene"]();
      scene.fog = new external_three_["Fog"](themeDefinition.fog.color, themeDefinition.fog.near, themeDefinition.fog.far);
      const camera = new external_three_["PerspectiveCamera"](initialFraming.fov, 1, 0.1, 60);
      camera.position.setFromSpherical(new external_three_["Spherical"](runtime.radius, runtime.currentPhi, runtime.cameraTheta)).add(runtime.cameraTarget);
      camera.lookAt(runtime.cameraTarget);
      const ambient = new external_three_["HemisphereLight"](themeDefinition.lights.hemisphereSky, themeDefinition.lights.hemisphereGround, themeDefinition.lights.hemisphereIntensity);
      const fill = new external_three_["AmbientLight"](themeDefinition.lights.ambientColor, themeDefinition.lights.ambientIntensity);
      const sun = new external_three_["DirectionalLight"](themeDefinition.lights.sunColor, themeDefinition.lights.sunIntensity);
      sun.position.set(themeDefinition.lights.sunPosition[0], themeDefinition.lights.sunPosition[1], themeDefinition.lights.sunPosition[2]);
      sun.castShadow = true;
      sun.shadow.mapSize.width = 1024;
      sun.shadow.mapSize.height = 1024;
      sun.shadow.camera.left = -14;
      sun.shadow.camera.right = 14;
      sun.shadow.camera.top = 14;
      sun.shadow.camera.bottom = -14;
      sun.shadow.camera.near = 1;
      sun.shadow.camera.far = 40;
      const rim = new external_three_["DirectionalLight"](themeDefinition.lights.rimColor, themeDefinition.lights.rimIntensity);
      rim.position.set(themeDefinition.lights.rimPosition[0], themeDefinition.lights.rimPosition[1], themeDefinition.lights.rimPosition[2]);
      scene.add(ambient, fill, sun, rim);
      const world = new external_three_["Group"]();
      scene.add(world);
      runtime.renderer = renderer;
      runtime.scene = scene;
      runtime.camera = camera;
      runtime.world = world;
      runtime.materials = createMaterialLibrary(runtime.resources, themeDefinition);
      runtime.geometries = createGeometryLibrary(runtime.resources);
      buildTerrain(runtime);
      this.runtime = runtime;
      this.attachInteraction(runtime);
      this.updateRendererSize();
      this.rebuildStage();
      if (window.ResizeObserver) {
        runtime.resizeObserver = new window.ResizeObserver(() => {
          this.updateRendererSize();
        });
        runtime.resizeObserver.observe(host);
      } else {
        window.addEventListener("resize", this.updateRendererSize);
      }
      this.animate(0);
    },
    attachInteraction(runtime) {
      const host = runtime.host;
      if (!host) return;
      host.onpointerdown = event => {
        runtime.isDragging = true;
        runtime.dragStartX = event.clientX;
        runtime.dragStartY = event.clientY;
        host.setPointerCapture && host.setPointerCapture(event.pointerId);
        this.hasInteracted = true;
      };
      host.onpointermove = event => {
        if (!runtime.isDragging) return;
        const deltaX = event.clientX - runtime.dragStartX;
        const deltaY = event.clientY - runtime.dragStartY;
        runtime.targetWorldRotationY = runtime.baseWorldRotationY + deltaX * 0.012;
        runtime.targetPhi = clamp(runtime.basePhi + deltaY * 0.006, 0.82, 1.24);
      };
      const releasePointer = event => {
        if (!runtime.isDragging) return;
        runtime.isDragging = false;
        runtime.baseWorldRotationY = runtime.targetWorldRotationY;
        runtime.basePhi = runtime.targetPhi;
        host.releasePointerCapture && host.releasePointerCapture(event.pointerId);
      };
      host.onpointerup = releasePointer;
      host.onpointerleave = releasePointer;
      host.onpointercancel = releasePointer;
    },
    rebuildStage() {
      const runtime = this.runtime;
      if (!runtime || !runtime.world) return;
      if (runtime.stage && runtime.stage.root) {
        runtime.world.remove(runtime.stage.root);
      }
      runtime.stage = buildStageForStatus(runtime, this.sceneStatus);
      runtime.world.add(runtime.stage.root);
      runtime.renderer.shadowMap.needsUpdate = true;
    },
    updateRendererSize() {
      const runtime = this.runtime;
      if (!runtime || !runtime.host || !runtime.renderer || !runtime.camera) return;
      const rect = runtime.host.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const framing = getCameraFraming(width / height, runtime.themeKey || this.themeDefinition.key, runtime.isNight);
      runtime.radius = framing.radius;
      runtime.cameraTarget.y = framing.targetY || 2.6;
      runtime.camera.fov = framing.fov;
      if (!this.hasInteracted) {
        runtime.basePhi = framing.phi;
        runtime.targetPhi = framing.phi;
        runtime.currentPhi = framing.phi;
      }
      runtime.camera.aspect = width / height;
      runtime.camera.updateProjectionMatrix();
      runtime.renderer.setSize(width, height, false);
      runtime.renderer.shadowMap.needsUpdate = true;
    },
    animate(timestamp) {
      const runtime = this.runtime;
      if (!runtime || !runtime.renderer || !runtime.scene || !runtime.camera) return;
      runtime.lastTimestamp = timestamp;
      const previousWorldRotationY = runtime.currentWorldRotationY;
      runtime.currentWorldRotationY = lerp(runtime.currentWorldRotationY, runtime.targetWorldRotationY, 0.08);
      runtime.currentPhi = lerp(runtime.currentPhi, runtime.targetPhi, 0.08);
      if (runtime.world) {
        runtime.world.rotation.y = runtime.currentWorldRotationY;
        if (Math.abs(runtime.currentWorldRotationY - previousWorldRotationY) > 0.00001) {
          runtime.renderer.shadowMap.needsUpdate = true;
        }
      }
      const offset = new external_three_["Spherical"](runtime.radius, runtime.currentPhi, runtime.cameraTheta);
      runtime.camera.position.setFromSpherical(offset).add(runtime.cameraTarget);
      runtime.camera.lookAt(runtime.cameraTarget);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) runtime.clouds.forEach(cloud => {
        cloud.group.position.x = cloud.baseX + Math.sin(timestamp * 0.00018 * cloud.speed + cloud.phase) * cloud.amplitude;
        cloud.group.position.z = cloud.baseZ + Math.cos(timestamp * 0.00014 * cloud.speed + cloud.phase) * cloud.amplitude * 0.55;
      });
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && runtime.stage && Array.isArray(runtime.stage.floatingLights)) {
        animateParticleSet(runtime.stage.floatingLights, timestamp);
      }
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) animateParticleSet(runtime.ambientLights, timestamp, 7);
      runtime.renderer.render(runtime.scene, runtime.camera);
      runtime.animationFrame = requestAnimationFrame(nextTimestamp => this.animate(nextTimestamp));
    },
    handleSceneUnavailable(reason) {
      this.initFailed = true;
      try {
        console.info("[TREE3D_RUNTIME]" + JSON.stringify({
          reason: reason || "scene_unavailable",
          href: typeof window !== "undefined" && window.location ? window.location.href : ""
        }));
      } catch (error) {}
      this.$emit("scene-unavailable", reason || "scene_unavailable");
    },
    destroyScene() {
      if (!this.runtime) return;
      if (!window.ResizeObserver) {
        window.removeEventListener("resize", this.updateRendererSize);
      }
      disposeRuntime(this.runtime);
      this.runtime = null;
    }
  }
});
// CONCATENATED MODULE: ./components/social/tree/TreeScene.vue?vue&type=script&lang=js
 /* harmony default export */ var tree_TreeScenevue_type_script_lang_js = (TreeScenevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/social/tree/TreeScene.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(548)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  tree_TreeScenevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "a506e3ee",
  "c8ea3f52"
  
)

/* harmony default export */ var TreeScene = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=73.js.map