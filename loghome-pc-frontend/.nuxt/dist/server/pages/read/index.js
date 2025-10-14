exports.ids = [15];
exports.modules = {

/***/ 107:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(109);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("26961ba2", content, true, context)
};

/***/ }),

/***/ 108:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Banner_vue_vue_type_style_index_0_id_299ab842_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(107);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Banner_vue_vue_type_style_index_0_id_299ab842_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Banner_vue_vue_type_style_index_0_id_299ab842_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Banner_vue_vue_type_style_index_0_id_299ab842_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Banner_vue_vue_type_style_index_0_id_299ab842_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 109:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".banner-container[data-v-299ab842]{width:100%;margin:10px 0}.banner-container .banner-swiper[data-v-299ab842]{position:relative;width:100%;height:200px;overflow:hidden;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.1)}@media(max-width: 768px){.banner-container .banner-swiper[data-v-299ab842]{height:150px}}.banner-container .banner-wrapper[data-v-299ab842]{display:flex;width:100%;height:100%;transition:transform .5s ease}.banner-container .banner-item[data-v-299ab842]{flex:0 0 100%;position:relative;cursor:pointer;overflow:hidden}.banner-container .banner-item .banner-image[data-v-299ab842]{width:100%;height:100%;object-fit:cover;transition:transform .3s ease}.banner-container .banner-item:hover .banner-image[data-v-299ab842]{transform:scale(1.05)}.banner-container .banner-item .banner-mask[data-v-299ab842]{position:absolute;bottom:0;left:0;width:100%;padding:15px 20px;background:linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)}.banner-container .banner-item .banner-mask .banner-title[data-v-299ab842]{color:#fff;font-size:16px;font-weight:bold;margin:0}.banner-container .banner-pagination[data-v-299ab842]{position:absolute;bottom:15px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:10}.banner-container .banner-pagination .pagination-dot[data-v-299ab842]{width:8px;height:8px;border-radius:50%;background-color:hsla(0,0%,100%,.5);cursor:pointer;transition:all .3s ease}.banner-container .banner-pagination .pagination-dot.active[data-v-299ab842]{background-color:#fff;transform:scale(1.2)}.banner-container .banner-pagination .pagination-dot[data-v-299ab842]:hover{background-color:hsla(0,0%,100%,.8)}.banner-container .banner-button-prev[data-v-299ab842],.banner-container .banner-button-next[data-v-299ab842]{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;background-color:rgba(0,0,0,.5);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:all .3s ease;z-index:10}.banner-container .banner-button-prev .arrow[data-v-299ab842],.banner-container .banner-button-next .arrow[data-v-299ab842]{color:#fff;font-size:18px;font-weight:bold}.banner-container .banner-button-prev[data-v-299ab842]:hover,.banner-container .banner-button-next[data-v-299ab842]:hover{background-color:rgba(0,0,0,.7)}.banner-container .banner-button-prev[data-v-299ab842]{left:10px}.banner-container .banner-button-next[data-v-299ab842]{right:10px}.banner-container .banner-swiper:hover .banner-button-prev[data-v-299ab842],.banner-container .banner-swiper:hover .banner-button-next[data-v-299ab842]{opacity:1}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/Banner.vue?vue&type=template&id=299ab842&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.banners.length > 0 ? _c('div', {
    staticClass: "banner-container"
  }, [_vm._ssrNode("<div class=\"banner-swiper\" data-v-299ab842><div class=\"banner-wrapper\"" + _vm._ssrStyle(null, {
    transform: `translateX(-${_vm.currentSlide * 100}%)`
  }, null) + " data-v-299ab842>" + _vm._ssrList(_vm.banners, function (banner, index) {
    return "<div class=\"banner-item\" data-v-299ab842><img" + _vm._ssrAttr("src", banner.image_url) + _vm._ssrAttr("alt", banner.title || 'banner') + " class=\"banner-image\" data-v-299ab842> " + (banner.title ? "<div class=\"banner-mask\" data-v-299ab842><div class=\"banner-title\" data-v-299ab842>" + _vm._ssrEscape(_vm._s(banner.title)) + "</div></div>" : "<!---->") + "</div>";
  }) + "</div> " + (_vm.banners.length > 1 ? "<div class=\"banner-pagination\" data-v-299ab842>" + _vm._ssrList(_vm.banners, function (_, index) {
    return "<span" + _vm._ssrClass(null, ['pagination-dot', {
      active: _vm.currentSlide === index
    }]) + " data-v-299ab842></span>";
  }) + "</div>" : "<!---->") + " " + (_vm.banners.length > 1 ? "<div class=\"banner-button-prev\" data-v-299ab842><span class=\"arrow\" data-v-299ab842>‹</span></div>" : "<!---->") + " " + (_vm.banners.length > 1 ? "<div class=\"banner-button-next\" data-v-299ab842><span class=\"arrow\" data-v-299ab842>›</span></div>" : "<!---->") + "</div>")]) : _vm._e();
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/Banner.vue?vue&type=template&id=299ab842&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Banner.vue?vue&type=script&lang=js
/* harmony default export */ var Bannervue_type_script_lang_js = ({
  name: 'Banner',
  props: {
    page: {
      type: String,
      default: 'library'
    },
    // 新增可配置项
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 8000
    },
    duration: {
      type: Number,
      default: 500
    },
    showDots: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      banners: [],
      currentSlide: 0,
      autoPlayInterval: null
    };
  },
  async created() {
    await this.getBanners();
  },
  methods: {
    async getBanners() {
      try {
        const response = await this.$api.novels.getBanners(this.page);
        this.banners = response || [];
      } catch (error) {
        console.error('获取Banner数据失败:', error);
        this.banners = [];
      }
    },
    navigateToBanner(banner) {
      if (banner.link_url_pc && banner.link_url_pc !== "None") {
        this.$router.push(banner.link_url_pc);
      }
    },
    // 设置轮播图当前显示的slide
    setSlide(index) {
      this.currentSlide = index;
    },
    // 切换到上一张轮播图
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      } else {
        // 循环到最后一张
        this.currentSlide = this.banners.length - 1;
      }
    },
    // 切换到下一张轮播图
    nextSlide() {
      if (this.currentSlide < this.banners.length - 1) {
        this.currentSlide++;
      } else {
        // 循环到第一张
        this.currentSlide = 0;
      }
    },
    // 启动自动播放
    startAutoPlay() {
      // 确保仅在客户端执行，并且有至少两个轮播项目时才启动轮播
      if (true) return;
      this.stopAutoPlay();
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, this.interval);
    },
    // 停止自动播放
    stopAutoPlay() {
      if (false) {}
    }
  },
  mounted() {
    // 仅在客户端执行
    if (false) {}
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    this.stopAutoPlay();
  }
});
// CONCATENATED MODULE: ./components/Banner.vue?vue&type=script&lang=js
 /* harmony default export */ var components_Bannervue_type_script_lang_js = (Bannervue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./components/Banner.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(108)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_Bannervue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "299ab842",
  "06e91d3e"
  
)

/* harmony default export */ var Banner = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(162);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("561985be", content, true, context)
};

/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(164);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("fae8b632", content, true, context)
};

/***/ }),

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/category.5de7f60.png";

/***/ }),

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/activity.cc8c077.png";

/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/ranks.fc09bfc.png";

/***/ }),

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/recommands.20e9088.png";

/***/ }),

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/finish.3700fe7.png";

/***/ }),

/***/ 161:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BannerSwiper_vue_vue_type_style_index_0_id_6911e5e2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(118);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BannerSwiper_vue_vue_type_style_index_0_id_6911e5e2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BannerSwiper_vue_vue_type_style_index_0_id_6911e5e2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BannerSwiper_vue_vue_type_style_index_0_id_6911e5e2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BannerSwiper_vue_vue_type_style_index_0_id_6911e5e2_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".banner-section[data-v-6911e5e2]{background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.1);width:100%;max-width:100%;display:flex;flex-direction:column}.banner-section .swiper-container[data-v-6911e5e2]{position:relative;width:100%;height:280px;overflow:hidden;border-radius:8px 8px 0 0}@media(max-width: 768px){.banner-section .swiper-container[data-v-6911e5e2]{height:220px}}.banner-section .swiper-wrapper[data-v-6911e5e2]{display:flex;width:100%;height:100%;transition:transform .5s ease}.banner-section .swiper-slide[data-v-6911e5e2]{flex:0 0 100%;position:relative;cursor:pointer}.banner-section .swiper-slide .slide-content[data-v-6911e5e2]{position:relative;width:100%;height:100%}.banner-section .swiper-slide .slide-content img[data-v-6911e5e2]{width:100%;height:100%;object-fit:cover}.banner-section .swiper-slide .slide-content .slide-info[data-v-6911e5e2]{position:absolute;bottom:0;left:0;width:100%;padding:15px;background:linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);color:#fff}.banner-section .swiper-slide .slide-content .slide-info h3[data-v-6911e5e2]{margin:0 0 5px;font-size:18px}.banner-section .swiper-slide .slide-content .slide-info p[data-v-6911e5e2]{margin:0;font-size:14px;opacity:.8}.banner-section .swiper-pagination[data-v-6911e5e2]{position:absolute;bottom:15px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:10}.banner-section .swiper-pagination .pagination-bullet[data-v-6911e5e2]{width:10px;height:10px;border-radius:50%;background-color:hsla(0,0%,100%,.5);cursor:pointer;transition:all .3s ease}.banner-section .swiper-pagination .pagination-bullet.active[data-v-6911e5e2]{background-color:#fff;transform:scale(1.2)}.banner-section .swiper-button-prev[data-v-6911e5e2],.banner-section .swiper-button-next[data-v-6911e5e2]{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;background-color:rgba(214,214,214,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:all .3s ease;z-index:10}.banner-section .swiper-button-prev .arrow[data-v-6911e5e2],.banner-section .swiper-button-next .arrow[data-v-6911e5e2]{color:#fff;font-size:20px}.banner-section .swiper-button-prev[data-v-6911e5e2]{left:10px}.banner-section .swiper-button-next[data-v-6911e5e2]{right:10px}.banner-section .swiper-container:hover .swiper-button-prev[data-v-6911e5e2],.banner-section .swiper-container:hover .swiper-button-next[data-v-6911e5e2]{opacity:1}.banner-section .nav-section[data-v-6911e5e2]{display:flex;justify-content:space-around;padding:15px 0;background:linear-gradient(180deg, white, #fcf9e4);border-radius:0 0 8px 8px}.banner-section .nav-section .nav-button[data-v-6911e5e2]{display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:all .2s}.banner-section .nav-section .nav-button[data-v-6911e5e2]:hover{transform:translateY(-3px)}.banner-section .nav-section .nav-button img[data-v-6911e5e2]{width:45px;height:45px;object-fit:contain;margin-bottom:8px;filter:drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))}.banner-section .nav-section .nav-button span[data-v-6911e5e2]{font-size:14px;color:#333}@keyframes spin-6911e5e2{to{transform:rotate(360deg)}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 163:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_56aaadea_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(119);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_56aaadea_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_56aaadea_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_56aaadea_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_56aaadea_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 164:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "*{box-sizing:border-box}img{max-width:100%}@keyframes spin{to{transform:rotate(360deg)}}.read-page{max-width:1400px;margin:0 auto;padding:20px 30px;display:grid;grid-template-columns:minmax(0, 3fr) minmax(300px, 1fr);grid-column-gap:30px;grid-row-gap:30px;grid-template-areas:\"header header\" \"banner sidebar\" \"collections sidebar\" \"content sidebar\";box-sizing:border-box}.read-page .full-width{grid-column:1/-1}.read-page .page-header{grid-area:header}.read-page .page-header .page-title{font-size:24px;color:#704c35}.read-page .banner-container{grid-area:banner;width:100%;overflow:hidden}.read-page .collections-container{grid-area:collections;width:100%}.read-page .collection-cards{width:100%;max-width:100%;overflow:hidden}.read-page .collection-cards .collection-card{background-color:#fff;border-radius:8px;overflow:hidden;margin-bottom:20px;width:100%;max-width:100%;box-shadow:0 2px 8px rgba(0,0,0,.08)}.read-page .collection-cards .collection-card .collection-header{display:flex;align-items:center;justify-content:space-between;padding:15px;border-bottom:1px solid #f5f5f5;cursor:pointer;transition:background-color .2s}.read-page .collection-cards .collection-card .collection-header:hover{background-color:#f5f5f5}.read-page .collection-cards .collection-card .collection-header .collection-title{display:flex;align-items:center;position:relative}.read-page .collection-cards .collection-card .collection-header .collection-title h3{font-size:18px;margin:0;color:#333;position:relative;z-index:1}.read-page .collection-cards .collection-card .collection-header .collection-title .light-line{position:absolute;bottom:0;left:0;height:8px;width:100%;background-color:rgba(82,196,26,.3);z-index:0}.read-page .collection-cards .collection-card .collection-header .collection-title .collection-icon{width:24px;height:24px;margin-left:10px;border-radius:4px}.read-page .collection-cards .collection-card .collection-header .more-button{display:flex;align-items:center;color:#947358;font-size:14px}.read-page .collection-cards .collection-card .collection-header .more-button .right-icon{font-style:normal;margin-left:5px}.read-page .collection-cards .collection-card .novel-slide{padding:15px;width:100%;max-width:100%;overflow:hidden}.read-page .collection-cards .collection-card .novel-slide .slide-wrapper{display:flex;overflow-x:auto;gap:15px;padding-bottom:10px;width:100%;max-width:100%}.read-page .collection-cards .collection-card .novel-slide .slide-wrapper::-webkit-scrollbar{height:6px}.read-page .collection-cards .collection-card .novel-slide .slide-wrapper::-webkit-scrollbar-track{background:#f5f5f5;border-radius:10px}.read-page .collection-cards .collection-card .novel-slide .slide-wrapper::-webkit-scrollbar-thumb{background:#947358;border-radius:10px}.read-page .collection-cards .collection-card .novel-slide .slide-wrapper .book-cover{flex:0 0 auto;width:120px;min-width:120px;max-width:120px;cursor:pointer;transition:transform .3s}.read-page .collection-cards .collection-card .novel-slide .slide-wrapper .book-cover:hover{transform:translateY(-5px)}.read-page .collection-cards .collection-card .novel-slide .slide-wrapper .book-cover .cover-image{height:160px;border-radius:6px;background-size:cover;background-position:center;position:relative;margin-bottom:8px}.read-page .collection-cards .collection-card .novel-slide .slide-wrapper .book-cover .cover-image .novel-type{position:absolute;top:5px;right:5px;background-color:rgba(148,115,88,.8);color:#fff;padding:2px 6px;border-radius:10px;font-size:12px}.read-page .collection-cards .collection-card .novel-slide .slide-wrapper .book-cover .book-title{font-size:14px;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center}.read-page .collection-cards .collection-card .novel-list{padding:15px}.read-page .collection-cards .collection-card .novel-list .list-wrapper{display:grid;grid-template-columns:repeat(2, 1fr);gap:20px;max-width:100%}.read-page .collection-cards .collection-card .novel-list .list-wrapper .book-card{display:flex;padding:10px;border-radius:6px;text-decoration:none;color:inherit;transition:all .3s;max-width:100%;overflow:hidden}.read-page .collection-cards .collection-card .novel-list .list-wrapper .book-card:hover{background-color:#f5f5f5}.read-page .collection-cards .collection-card .novel-list .list-wrapper .book-card .book-cover{width:80px;min-width:80px;height:120px;flex-shrink:0;margin-right:15px}.read-page .collection-cards .collection-card .novel-list .list-wrapper .book-card .book-cover img{width:100%;height:100%;object-fit:cover;border-radius:4px}.read-page .collection-cards .collection-card .novel-list .list-wrapper .book-card .book-info{flex:1;overflow:hidden;min-width:0}.read-page .collection-cards .collection-card .novel-list .list-wrapper .book-card .book-info .book-title{font-size:16px;font-weight:bold;margin:0 0 8px;color:#333;display:flex;align-items:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.read-page .collection-cards .collection-card .novel-list .list-wrapper .book-card .book-info .book-title .book-tag{font-size:12px;background-color:#faad14;color:#fff;padding:2px 6px;border-radius:10px;margin-left:8px;font-weight:normal;flex-shrink:0}.read-page .collection-cards .collection-card .novel-list .list-wrapper .book-card .book-info .book-author{display:flex;align-items:center;margin-bottom:8px}.read-page .collection-cards .collection-card .novel-list .list-wrapper .book-card .book-info .book-author .author-avatar{width:20px;height:20px;border-radius:50%;margin-right:6px;flex-shrink:0}.read-page .collection-cards .collection-card .novel-list .list-wrapper .book-card .book-info .book-author .author-name{font-size:14px;color:#947358;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.read-page .collection-cards .collection-card .novel-list .list-wrapper .book-card .book-info .book-desc{font-size:13px;color:#666;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;line-height:1.5;max-width:100%}.read-page .novels-container{grid-area:content;width:100%}.read-page .novels-container .loading-container{display:flex;align-items:center;justify-content:center;flex-direction:column;min-height:300px}.read-page .novels-container .loading-container .loading-spinner{width:50px;height:50px;border:5px solid rgba(148,115,88,.2);border-top-color:#947358;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px}.read-page .novels-container .empty-state{display:flex;align-items:center;justify-content:center;min-height:300px;color:#888;font-style:italic}.read-page .novels-container .novels-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));grid-gap:20px}.read-page .novels-container .novels-grid .novel-card{background-color:#fff;border-radius:8px;overflow:hidden;transition:transform .3s,box-shadow .3s;display:flex;flex-direction:column;height:100%;box-shadow:0 2px 8px rgba(0,0,0,.08)}.read-page .novels-container .novels-grid .novel-card:hover{transform:translateY(-5px);box-shadow:0 5px 15px rgba(0,0,0,.15)}.read-page .novels-container .novels-grid .novel-card .novel-cover{width:100%;height:160px;background-size:cover;background-position:center;position:relative}.read-page .novels-container .novels-grid .novel-card .novel-cover .novel-category{position:absolute;top:10px;right:10px;background-color:rgba(148,115,88,.8);color:#fff;padding:2px 8px;border-radius:20px;font-size:12px}.read-page .novels-container .novels-grid .novel-card .novel-info{padding:15px;display:flex;flex-direction:column;flex:1}.read-page .novels-container .novels-grid .novel-card .novel-info .novel-title{font-size:18px;font-weight:bold;margin-bottom:5px;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.read-page .novels-container .novels-grid .novel-card .novel-info .novel-author-info{display:flex;align-items:center;margin-bottom:5px}.read-page .novels-container .novels-grid .novel-card .novel-info .novel-author-info .author-avatar{width:24px;height:24px;border-radius:50%;margin-right:8px;flex-shrink:0;object-fit:cover}.read-page .novels-container .novels-grid .novel-card .novel-info .novel-author-info .author-name{font-size:14px;color:#947358;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.read-page .novels-container .novels-grid .novel-card .novel-info .novel-desc{color:#666;font-size:14px;line-height:1.5;margin-bottom:15px;height:60px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;flex:1}.read-page .novels-container .novels-grid .novel-card .novel-info .novel-stats{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;font-size:12px;color:#888}.read-page .novels-container .novels-grid .novel-card .novel-info .novel-stats span{display:inline-flex;align-items:center;margin-right:8px}.read-page .novels-container .novels-grid .novel-card .novel-info .novel-stats span:last-child{margin-right:0}.read-page .novels-container .novels-grid .novel-card .novel-info .novel-update-time{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;font-size:12px;color:#888}.read-page .novels-container .novels-grid .novel-card .novel-info .novel-update-time span{display:inline-flex;align-items:center;margin-right:8px}.read-page .novels-container .novels-grid .novel-card .novel-info .novel-update-time span:last-child{margin-right:0}.read-page .novels-container .novels-grid .novel-card .novel-info .read-button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;font-size:14px;display:block;text-align:center;background-color:#947358;color:#fff;text-decoration:none;width:100%;margin-top:auto}.read-page .novels-container .novels-grid .novel-card .novel-info .read-button:hover{background-color:hsl(27,25.4237288136%,36.2745098039%)}.read-page .sidebar{grid-area:sidebar;position:sticky;top:30px;height:fit-content;align-self:start;width:100%;max-width:300px}.read-page .sidebar .sidebar-section{background-color:#fff;border-radius:8px;overflow:hidden;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,.08)}.read-page .sidebar .sidebar-section .sidebar-title{padding:15px;margin:0;background-color:#947358;color:#fff;font-size:16px}.read-page .sidebar .sidebar-section .history-list{list-style:none;padding:0;margin:0}.read-page .sidebar .sidebar-section .history-list .history-item{text-decoration:none;color:inherit;display:flex;align-items:center;padding:12px 15px;border-bottom:1px solid #f5f5f5;transition:background-color .2s ease}.read-page .sidebar .sidebar-section .history-list .history-item:hover{background-color:rgba(148,115,88,.1)}.read-page .sidebar .sidebar-section .history-list .history-item .history-cover{width:50px;height:75px;flex-shrink:0;background-size:cover;background-position:center;border-radius:4px;margin-right:15px}.read-page .sidebar .sidebar-section .history-list .history-item .history-info{flex:1;overflow:hidden}.read-page .sidebar .sidebar-section .history-list .history-item .history-info .history-title{margin:0 0 3px;font-size:14px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.read-page .sidebar .sidebar-section .history-list .history-item .history-info .history-author{font-size:12px;color:#666;margin:0}.read-page .sidebar .sidebar-section .ranking-list{list-style:none;padding:0;margin:0}.read-page .sidebar .sidebar-section .ranking-list .ranking-item-link{text-decoration:none;color:inherit;display:block}.read-page .sidebar .sidebar-section .ranking-list .ranking-item-link:hover .ranking-item{background-color:rgba(148,115,88,.1)}.read-page .sidebar .sidebar-section .ranking-list .ranking-item{display:flex;align-items:center;justify-content:space-between;padding:12px 15px;border-bottom:1px solid #f5f5f5;transition:background-color .2s ease}.read-page .sidebar .sidebar-section .ranking-list .ranking-item:last-child{border-bottom:none}.read-page .sidebar .sidebar-section .ranking-list .ranking-item .ranking-number{width:24px;height:24px;display:flex;align-items:center;justify-content:center;background-color:#947358;color:#fff;border-radius:50%;font-size:12px;margin-right:10px;flex-shrink:0}.read-page .sidebar .sidebar-section .ranking-list .ranking-item.rank-1 .ranking-number{background-color:#ff7043}.read-page .sidebar .sidebar-section .ranking-list .ranking-item.rank-2 .ranking-number{background-color:#ff9800}.read-page .sidebar .sidebar-section .ranking-list .ranking-item.rank-3 .ranking-number{background-color:#ffc107}.read-page .sidebar .sidebar-section .ranking-list .ranking-item .ranking-info{flex:1;overflow:hidden}.read-page .sidebar .sidebar-section .ranking-list .ranking-item .ranking-info .ranking-title{margin:0 0 3px;font-size:14px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.read-page .sidebar .sidebar-section .ranking-list .ranking-item .ranking-info .ranking-author-info{display:flex;align-items:center;margin-bottom:3px}.read-page .sidebar .sidebar-section .ranking-list .ranking-item .ranking-info .ranking-author-info .author-avatar{width:20px;height:20px;border-radius:50%;margin-right:8px;flex-shrink:0}.read-page .sidebar .sidebar-section .ranking-list .ranking-item .ranking-info .ranking-author-info .author-name{font-size:12px;color:#666}.read-page .sidebar .sidebar-section .ranking-list .ranking-item .ranking-stats{font-size:12px;color:#888;white-space:nowrap;display:flex;flex-direction:column;align-items:flex-end}.read-page .sidebar .sidebar-section .ranking-list .ranking-item .ranking-stats .ranking-stat,.read-page .sidebar .sidebar-section .ranking-list .ranking-item .ranking-stats .novel-status{margin-bottom:3px}.read-page .sidebar .sidebar-section .ranking-list .ranking-item .ranking-stats .ranking-stat:last-child,.read-page .sidebar .sidebar-section .ranking-list .ranking-item .ranking-stats .novel-status:last-child{margin-bottom:0}.read-page .sidebar .sidebar-section .ranking-list .ranking-item .ranking-stats .novel-status{background-color:rgba(148,115,88,.1);color:#947358;padding:2px 6px;border-radius:10px;font-size:10px}.read-page .sidebar .sidebar-section .tag-cloud{padding:15px;display:flex;flex-wrap:wrap;gap:8px}.read-page .sidebar .sidebar-section .tag-cloud .tag-link{display:inline-block;padding:4px 10px;background-color:rgba(148,115,88,.1);color:#947358;border-radius:20px;text-decoration:none;transition:all .2s}.read-page .sidebar .sidebar-section .tag-cloud .tag-link:hover{background-color:#947358;color:#fff}.read-page .fade-enter-active,.read-page .fade-leave-active{transition:opacity .5s}.read-page .fade-enter,.read-page .fade-leave-to{opacity:0}.read-page .load-more-container{padding:40px 0;text-align:center;margin-top:30px}.read-page .load-more-container .load-more-button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;font-size:14px;background-color:#947358;color:#fff;padding:12px 40px;font-size:16px;border:none;box-shadow:0 2px 8px rgba(148,115,88,.3)}.read-page .load-more-container .load-more-button:hover{background-color:hsl(27,25.4237288136%,36.2745098039%);transform:translateY(-2px);box-shadow:0 4px 12px rgba(148,115,88,.4)}.read-page .load-more-container .loading-state{display:flex;align-items:center;justify-content:center;flex-direction:column}.read-page .load-more-container .loading-state .loading-spinner-small{width:30px;height:30px;border:3px solid rgba(148,115,88,.2);border-top-color:#947358;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:10px}.read-page .load-more-container .loading-state p{color:#888}.read-page .load-more-container .all-loaded-message{color:#888;font-style:italic}.read-page .load-more-container .error-message{color:#ff4d4f}.read-page .load-more-container .error-message .retry-button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;font-size:14px;background-color:#ff4d4f;color:#fff;border:none;margin-top:10px}.read-page .load-more-container .error-message .retry-button:hover{background-color:rgb(255,26,28.5730337079)}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 222:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/index.vue?vue&type=template&id=56aaadea
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "read-page"
  }, [_vm._ssrNode("<div class=\"banner-container\">", "</div>", [_c('BannerSwiper', {
    attrs: {
      "chartList": _vm.chartList
    }
  })], 1), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"collections-container\">", "</div>", [_vm._ssrNode("<div class=\"collection-cards\">", "</div>", [_vm._l(_vm.safeCollections, function (item, index) {
    return [index != 1 ? _vm._ssrNode("<div class=\"collection-card\">", "</div>", [_vm._ssrNode("<div class=\"collection-header\"><div class=\"collection-title\"><h3>" + _vm._ssrEscape(_vm._s(item.collection_title)) + "</h3> <div class=\"light-line\"></div> " + (item.icon ? "<img" + _vm._ssrAttr("src", item.icon) + _vm._ssrAttr("alt", item.collection_title) + " class=\"collection-icon\">" : "<!---->") + "</div> <div class=\"more-button\"><span>更多</span> <i class=\"right-icon\">❯</i></div></div> "), item.collection_type === 'slide' ? _vm._ssrNode("<div class=\"novel-slide\">", "</div>", [_vm._ssrNode("<div class=\"slide-wrapper\">" + _vm._ssrList(item.novels || [], function (novel) {
      return "<div class=\"book-cover\"><div class=\"cover-image\"" + _vm._ssrStyle(null, novel.picUrl ? `background-image: url(${novel.picUrl})` : `background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`, null) + ">" + (novel.novel_type === 'world' ? "<span class=\"novel-type\">世界设定</span>" : "<!---->") + "</div> <div class=\"book-title\">" + _vm._ssrEscape(_vm._s(novel.name)) + "</div></div>";
    }) + "</div>")], 2) : _vm._ssrNode("<div class=\"novel-list\">", "</div>", [_vm._ssrNode("<div class=\"list-wrapper\">", "</div>", _vm._l((item.novels || []).slice(0, 4), function (novel) {
      return _c('nuxt-link', {
        key: novel.novel_id,
        staticClass: "book-card",
        attrs: {
          "to": `/novel/${novel.novel_id}`
        }
      }, [_c('div', {
        staticClass: "book-cover"
      }, [_c('img', {
        attrs: {
          "src": novel.picUrl ? novel.picUrl + '?thumbnail=1' : '/static/user/defaultCover.jpg',
          "alt": novel.name,
          "onerror": `this.onerror=null;this.src='/static/user/defaultCover.jpg'`
        }
      })]), _vm._v(" "), _c('div', {
        staticClass: "book-info"
      }, [_c('h4', {
        staticClass: "book-title"
      }, [_vm._v("\n                     " + _vm._s(novel.name) + "\n                     "), novel.novel_type === 'world' ? _c('span', {
        staticClass: "book-tag"
      }, [_vm._v("世界设定")]) : _vm._e()]), _vm._v(" "), _c('div', {
        staticClass: "book-author"
      }, [_c('img', {
        staticClass: "author-avatar",
        attrs: {
          "src": novel.avatar_url || '/static/user/defaultAvatar.jpg',
          "alt": "作者头像",
          "onerror": `this.onerror=null;this.src='/static/user/defaultAvatar.jpg'`
        }
      }), _vm._v(" "), _c('span', {
        staticClass: "author-name"
      }, [_vm._v(_vm._s(novel.user_name || novel.author_name || '佚名'))])]), _vm._v(" "), _c('p', {
        staticClass: "book-desc"
      }, [_vm._v(_vm._s(_vm.truncateText(novel.content, 80)))])])]);
    }), 1)])], 2) : _vm._e(), _vm._ssrNode(" "), index === 1 ? _c('Banner', {
      key: 'banner-' + index,
      attrs: {
        "page": "library"
      }
    }) : _vm._e()];
  })], 2)]), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"novels-container\">", "</div>", [_vm.loading ? _vm._ssrNode("<div class=\"loading-container\">", "</div>", [_vm._ssrNode("<div class=\"loading-spinner\"></div> <p>正在加载小说列表...</p>")], 2) : _vm.displayedNovels.length === 0 ? _vm._ssrNode("<div class=\"empty-state\"><p>没有找到符合条件的小说</p></div>") : _vm._ssrNode("<div>", "</div>", [_vm._ssrNode("<div class=\"novels-grid\">", "</div>", _vm._l(_vm.displayedNovels, function (novel) {
    return _vm._ssrNode("<div class=\"novel-card\">", "</div>", [_vm._ssrNode((novel.picUrl ? "<div class=\"novel-cover\"" + _vm._ssrStyle(null, `background-image: url(${novel.picUrl})`, null) + ">" + (novel.novel_type === 'world' ? "<span class=\"novel-category\">世界设定</span>" : "<!---->") + "</div>" : "<div class=\"novel-cover\"" + _vm._ssrStyle(null, `background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`, null) + ">" + (novel.novel_type === 'world' ? "<span class=\"novel-category\">世界设定</span>" : "<!---->") + "</div>") + " "), _vm._ssrNode("<div class=\"novel-info\">", "</div>", [_vm._ssrNode("<h3 class=\"novel-title\">" + _vm._ssrEscape(_vm._s(novel.name)) + "</h3> <div class=\"novel-author-info\"><img" + _vm._ssrAttr("src", novel.auther_avatar || '/static/user/defaultAvatar.jpg') + " alt=\"作者头像\"" + _vm._ssrAttr("onerror", `this.onerror=null;this.src='/static/user/defaultAvatar.jpg'`) + " class=\"author-avatar\"> <span class=\"author-name\">" + _vm._ssrEscape(_vm._s(novel.author_name || '佚名')) + "</span></div> <p class=\"novel-desc\">" + _vm._ssrEscape(_vm._s(_vm.truncateText(novel.content, 80))) + "</p> <div class=\"novel-stats\"><span title=\"阅读量\">" + _vm._ssrEscape("👁️ " + _vm._s(_vm.formatNumber(novel.clicks || 0))) + "</span> <span title=\"字数\">" + _vm._ssrEscape("📃 " + _vm._s(_vm.formatNumber(novel.text_count || 0)) + "字") + "</span> <span title=\"连载状态\">" + _vm._ssrEscape(_vm._s(novel.is_complete === 1 ? '已完结' : '连载中')) + "</span></div> <div class=\"novel-update-time\"><span title=\"更新时间\">" + _vm._ssrEscape("🕒 " + _vm._s(_vm.formatDateTime(novel.update_time))) + "</span></div> "), _c('nuxt-link', {
      staticClass: "read-button",
      attrs: {
        "to": `/novel/${novel.novel_id}`
      }
    }, [_vm._v("开始阅读")])], 2)], 2);
  }), 0), _vm._ssrNode(" <div class=\"load-more-container\">" + (!_vm.loading && !_vm.allLoaded && !_vm.isLoadingMore ? "<button class=\"load-more-button\">\n          加载更多\n        </button>" : "<!---->") + " " + (_vm.isLoadingMore ? "<div class=\"loading-state\"><div class=\"loading-spinner-small\"></div> <p>正在加载更多小说...</p></div>" : "<!---->") + " " + (_vm.allLoaded ? "<div class=\"all-loaded-message\"><p>已加载全部小说</p></div>" : "<!---->") + " " + (_vm.hasError ? "<div class=\"error-message\"><p>" + _vm._ssrEscape(_vm._s(_vm.errorMessage)) + "</p> <button class=\"retry-button\">重试</button></div>" : "<!---->") + "</div>")], 2)]), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"sidebar\">", "</div>", [_vm._ssrNode("<div class=\"sidebar-section\">", "</div>", [_vm._ssrNode("<h3 class=\"sidebar-title\">随机推书</h3> "), _vm._ssrNode("<ul class=\"ranking-list\">", "</ul>", _vm._l(_vm.randomNovels || [], function (novel, index) {
    return _c('nuxt-link', {
      key: novel.novel_id,
      staticClass: "ranking-item-link",
      attrs: {
        "to": `/novel/${novel.novel_id}`
      }
    }, [_c('li', {
      staticClass: "ranking-item",
      class: `rank-${index + 1}`
    }, [_c('span', {
      staticClass: "ranking-number"
    }, [_vm._v(_vm._s(index + 1))]), _vm._v(" "), _c('div', {
      staticClass: "ranking-info"
    }, [_c('h4', {
      staticClass: "ranking-title"
    }, [_vm._v(_vm._s(novel.name))]), _vm._v(" "), _c('div', {
      staticClass: "ranking-author-info"
    }, [_c('img', {
      staticClass: "author-avatar",
      attrs: {
        "src": novel.auther_avatar || '/static/user/defaultAvatar.jpg',
        "alt": "作者头像",
        "onerror": `this.onerror=null;this.src='/static/user/defaultAvatar.jpg'`
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "author-name"
    }, [_vm._v(_vm._s(novel.author_name || '佚名'))])])]), _vm._v(" "), _c('div', {
      staticClass: "ranking-stats"
    }, [_c('span', {
      staticClass: "ranking-stat"
    }, [_vm._v(_vm._s(_vm.formatNumber(novel.clicks || 0)) + "浏览")]), _vm._v(" "), _c('span', {
      staticClass: "novel-status"
    }, [_vm._v(_vm._s(novel.is_complete === 1 ? '完结' : '连载'))])])])]);
  }), 1)], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"sidebar-section\">", "</div>", [_vm._ssrNode("<h3 class=\"sidebar-title\">热门标签</h3> "), _vm._ssrNode("<div class=\"tag-cloud\">", "</div>", _vm._l((_vm.popularTags || []).slice(0, 12), function (tag) {
    return _c('nuxt-link', {
      key: tag.tag_id,
      staticClass: "tag-link",
      style: `font-size: ${12 + Math.min(tag.count / 5, 8)}px`,
      attrs: {
        "to": `/tag/collections?tag_id=${tag.tag_id}`
      }
    }, [_vm._v("\n          " + _vm._s(tag.tag_name) + "\n        ")]);
  }), 1)], 2)], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/index.vue?vue&type=template&id=56aaadea

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/BannerSwiper.vue?vue&type=template&id=6911e5e2&scoped=true
var BannerSwipervue_type_template_id_6911e5e2_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "banner-section"
  }, [_vm._ssrNode((_vm.chartList.length > 0 ? "<div class=\"swiper-container\" data-v-6911e5e2><div class=\"swiper-wrapper\"" + _vm._ssrStyle(null, {
    transform: `translateX(-${_vm.currentSlide * 100}%)`
  }, null) + " data-v-6911e5e2>" + _vm._ssrList(_vm.chartList, function (item, index) {
    return "<div class=\"swiper-slide\" data-v-6911e5e2><div class=\"slide-content\" data-v-6911e5e2><img" + _vm._ssrAttr("src", item.img) + _vm._ssrAttr("alt", item.title) + " data-v-6911e5e2> <div class=\"slide-info\" data-v-6911e5e2><h3 data-v-6911e5e2>" + _vm._ssrEscape(_vm._s(item.title)) + "</h3> <p data-v-6911e5e2>" + _vm._ssrEscape(_vm._s(item.Subtitle)) + "</p></div></div></div>";
  }) + "</div> " + (_vm.chartList.length > 1 ? "<div class=\"swiper-pagination\" data-v-6911e5e2>" + _vm._ssrList(_vm.chartList, function (_, index) {
    return "<span" + _vm._ssrClass(null, ['pagination-bullet', {
      active: _vm.currentSlide === index
    }]) + " data-v-6911e5e2></span>";
  }) + "</div>" : "<!---->") + " " + (_vm.chartList.length > 1 ? "<div class=\"swiper-button-prev\" data-v-6911e5e2><span class=\"arrow\" data-v-6911e5e2>❮</span></div>" : "<!---->") + " " + (_vm.chartList.length > 1 ? "<div class=\"swiper-button-next\" data-v-6911e5e2><span class=\"arrow\" data-v-6911e5e2>❯</span></div>" : "<!---->") + "</div>" : "<!---->") + " <div class=\"nav-section\" data-v-6911e5e2><div class=\"nav-button\" data-v-6911e5e2><img" + _vm._ssrAttr("src", __webpack_require__(156)) + " alt=\"标签\" data-v-6911e5e2> <span data-v-6911e5e2>标签</span></div> <div class=\"nav-button\" data-v-6911e5e2><img" + _vm._ssrAttr("src", __webpack_require__(157)) + " alt=\"活动\" data-v-6911e5e2> <span data-v-6911e5e2>活动</span></div> <div class=\"nav-button\" data-v-6911e5e2><img" + _vm._ssrAttr("src", __webpack_require__(158)) + " alt=\"排行\" data-v-6911e5e2> <span data-v-6911e5e2>排行</span></div> <div class=\"nav-button\" data-v-6911e5e2><img" + _vm._ssrAttr("src", __webpack_require__(159)) + " alt=\"推荐\" data-v-6911e5e2> <span data-v-6911e5e2>推荐</span></div> <div class=\"nav-button\" data-v-6911e5e2><img" + _vm._ssrAttr("src", __webpack_require__(160)) + " alt=\"完结\" data-v-6911e5e2> <span data-v-6911e5e2>完结</span></div></div>")]);
};
var BannerSwipervue_type_template_id_6911e5e2_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/BannerSwiper.vue?vue&type=template&id=6911e5e2&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/BannerSwiper.vue?vue&type=script&lang=js
/* harmony default export */ var BannerSwipervue_type_script_lang_js = ({
  name: 'BannerSwiper',
  props: {
    chartList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentSlide: 0,
      autoPlayInterval: null
    };
  },
  methods: {
    // 轮播图点击事件处理
    roulousChartClicked(item) {
      if (item.navigate_to && item.navigate_to !== "None") {
        this.$router.push(item.navigate_to);
      }
    },
    // 导航栏点击事件处理
    navBarJump(section) {
      switch (section) {
        case "标签":
          this.$router.push('/tags');
          break;
        case "活动":
          this.gotoCollections("干草块杯活动专辑");
          break;
        case "排行":
          this.gotoCollections("原木力爆棚");
          break;
        case "推荐":
          this.gotoCollections("原木力飙升");
          break;
        case "完结":
          this.gotoCollections("完本经典");
          break;
      }
    },
    // 前往专题集合页面
    gotoCollections(collectionTitle) {
      console.log('BannerSwiper准备跳转到集合页面:', collectionTitle);
      // 确保标题是字符串并且不为空
      if (!collectionTitle || typeof collectionTitle !== 'string') {
        console.error('无效的集合标题:', collectionTitle);
        return;
      }
      try {
        const encodedTitle = encodeURIComponent(collectionTitle.trim());
        const url = `/read/collections?title=${encodedTitle}`;
        console.log('跳转URL:', url);
        this.$router.push(url);
      } catch (error) {
        console.error('跳转集合页面失败:', error);
      }
    },
    // 设置轮播图当前显示的slide
    setSlide(index) {
      this.currentSlide = index;
    },
    // 切换到上一张轮播图
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      } else {
        // 循环到最后一张
        this.currentSlide = this.chartList.length - 1;
      }
    },
    // 切换到下一张轮播图
    nextSlide() {
      if (this.currentSlide < this.chartList.length - 1) {
        this.currentSlide++;
      } else {
        // 循环到第一张
        this.currentSlide = 0;
      }
    },
    // 启动自动播放
    startAutoPlay() {
      // 确保仅在客户端执行，并且有至少两个轮播项目时才启动轮播
      if (true) return;
      this.stopAutoPlay();
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, 5000); // 5秒切换一次
    },
    // 停止自动播放
    stopAutoPlay() {
      if (false) {}
    }
  },
  mounted() {
    // 仅在客户端执行
    if (false) {}
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    this.stopAutoPlay();
  }
});
// CONCATENATED MODULE: ./components/read/BannerSwiper.vue?vue&type=script&lang=js
 /* harmony default export */ var read_BannerSwipervue_type_script_lang_js = (BannerSwipervue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./components/read/BannerSwiper.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(161)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_BannerSwipervue_type_script_lang_js,
  BannerSwipervue_type_template_id_6911e5e2_scoped_true_render,
  BannerSwipervue_type_template_id_6911e5e2_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "6911e5e2",
  "b190f930"
  
)

/* harmony default export */ var BannerSwiper = (component.exports);
// EXTERNAL MODULE: ./components/Banner.vue + 4 modules
var Banner = __webpack_require__(112);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/index.vue?vue&type=script&lang=js


/* harmony default export */ var readvue_type_script_lang_js = ({
  components: {
    BannerSwiper: BannerSwiper,
    Banner: Banner["a" /* default */]
  },
  head() {
    return {
      title: '书库 - 原木社区',
      link: [{
        rel: 'stylesheet',
        href: '//at.alicdn.com/t/font_1234567_abcdefg.css'
      }]
    };
  },
  async asyncData({
    $api
  }) {
    try {
      const [tags, chartData, collections] = await Promise.all([$api.novels.getAllTags(), $api.novels.getLibraryRoulousChart(), $api.novels.getLibraryCollections()]);

      // 处理轮播图数据
      const chartList = [];
      if (chartData && Array.isArray(chartData)) {
        for (const item of chartData) {
          if (item.isValid === 1) {
            chartList.push({
              img: item.image,
              title: item.title,
              Subtitle: item.name,
              navigate_to: item.navigate_to_pc
            });
          }
        }
      }

      // 处理集合数据
      const processedCollections = collections || [];
      const collectionNovelsPromises = processedCollections.map(collection => $api.novels.getCollectionNovels(collection.collection_title, 1, 10).then(novels => ({
        collection_title: collection.collection_title,
        novels: novels || []
      })).catch(error => {
        console.error(`获取集合 ${collection.collection_title} 的小说失败`, error);
        return {
          collection_title: collection.collection_title,
          novels: []
        };
      }));
      const collectionResults = await Promise.all(collectionNovelsPromises);

      // 将获取到的小说数组分配给对应的集合
      collectionResults.forEach(result => {
        const collection = processedCollections.find(c => c.collection_title === result.collection_title);
        if (collection) {
          collection.novels = result.novels;
        }
      });
      return {
        tags: tags || [],
        chartList,
        collections: processedCollections,
        loading: false
      };
    } catch (error) {
      console.error('获取数据失败', error);
      return {
        tags: [],
        chartList: [],
        collections: [],
        loading: false
      };
    }
  },
  data() {
    return {
      // 小说列表数据
      novels: [],
      displayedNovels: [],
      // 分页和加载状态
      pageSize: 12,
      loading: false,
      isLoadingMore: false,
      allLoaded: false,
      // 数据
      tags: [],
      chartList: [],
      collections: [],
      // 错误状态
      hasError: false,
      errorMessage: ''
    };
  },
  computed: {
    // 热门小说（点击量排序前5）
    randomNovels() {
      if (!this.novels || !this.novels.length) return [];
      console.log('计算随机小说列表', this.novels.length);
      return [...this.novels].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5);
    },
    // 热门标签（按关联小说数量排序）
    popularTags() {
      if (!this.tags || !this.tags.length) return [];
      return [...this.tags].sort((a, b) => (b.count || 0) - (a.count || 0));
    },
    // collections数组
    safeCollections() {
      return this.collections || [];
    }
  },
  methods: {
    // 获取随机小说
    async fetchRandomNovels() {
      this.loading = true;
      try {
        const novels = await this.$api.novels.getAllNovels();
        this.novels = novels || [];
        this.displayedNovels = this.novels.slice(0, this.pageSize);
      } catch (error) {
        console.error('获取随机小说列表失败', error);
        this.hasError = true;
        this.errorMessage = '获取小说列表失败，请稍后再试';
      } finally {
        this.loading = false;
      }
    },
    // 加载更多小说（获取新的随机小说）
    async loadMoreNovels() {
      if (this.isLoadingMore || this.loading) return;
      console.log('开始加载更多小说');
      this.isLoadingMore = true;
      try {
        // 获取新的随机小说，而不是加载现有数组的更多项
        const newNovels = await this.$api.novels.getAllNovels();
        if (newNovels && newNovels.length) {
          // 过滤掉已经显示的小说（根据novel_id去重）
          const existingIds = new Set(this.displayedNovels.map(novel => novel.novel_id));
          const uniqueNewNovels = newNovels.filter(novel => !existingIds.has(novel.novel_id));
          if (uniqueNewNovels.length > 0) {
            this.displayedNovels = [...this.displayedNovels, ...uniqueNewNovels.slice(0, this.pageSize)];
            console.log('加载了新小说', uniqueNewNovels.length);
          } else {
            // 如果没有新的唯一小说，标记为已全部加载
            console.log('没有新的唯一小说');
            this.allLoaded = true;
          }
        } else {
          console.log('API没有返回小说');
          this.allLoaded = true;
        }
      } catch (error) {
        console.error('加载更多随机小说失败', error);
        this.hasError = true;
        this.errorMessage = '加载更多小说失败，请稍后再试';
      } finally {
        this.isLoadingMore = false;
      }
    },
    // 格式化数字（大于1000显示为1k）
    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
      }
      return num;
    },
    // 截断文本
    truncateText(text, length) {
      if (!text) return '暂无简介';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    // 格式化日期时间
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return '暂无更新';
      try {
        const date = new Date(dateTimeStr);
        if (isNaN(date.getTime())) return '日期格式错误';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error('日期格式化错误', error);
        return '日期格式错误';
      }
    },
    // 前往专题集合页面
    gotoCollections(collectionTitle) {
      console.log('准备跳转到集合页面:', collectionTitle);
      // 确保标题是字符串并且不为空
      if (!collectionTitle || typeof collectionTitle !== 'string') {
        console.error('无效的集合标题:', collectionTitle);
        return;
      }
      try {
        const encodedTitle = encodeURIComponent(collectionTitle.trim());
        const url = `/read/collections?title=${encodedTitle}`;
        console.log('跳转URL:', url);
        this.$router.push(url);
      } catch (error) {
        console.error('跳转集合页面失败:', error);
      }
    },
    // 阅读小说或世界设定
    readBook(novelId, novelType) {
      if (novelId) {
        // 如果是世界设定类型，跳转到world页面，否则跳转到novel页面
        if (novelType === 'world') {
          this.$router.push(`/world/${novelId}`);
        } else {
          this.$router.push(`/novel/${novelId}`);
        }
      }
    }
  },
  mounted() {
    // 仅在客户端执行
    if (false) {}
  },
  async fetch() {
    // fetch钩子在客户端导航时被调用，用于处理错误或数据刷新
    if (this.$fetchState.pending || this.$fetchState.error) {
      this.loading = true;
    } else {
      this.loading = false;
    }
  },
  watch: {
    // 监听小说数据变化，更新显示状态
    novels: {
      handler(newNovels) {
        if (Array.isArray(newNovels) && newNovels.length && this.displayedNovels.length === 0) {
          this.displayedNovels = newNovels.slice(0, this.pageSize);
        }
      },
      immediate: true
    }
  }
});
// CONCATENATED MODULE: ./pages/read/index.vue?vue&type=script&lang=js
 /* harmony default export */ var pages_readvue_type_script_lang_js = (readvue_type_script_lang_js); 
// CONCATENATED MODULE: ./pages/read/index.vue



function read_injectStyles (context) {
  
  var style0 = __webpack_require__(163)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var read_component = Object(componentNormalizer["a" /* default */])(
  pages_readvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  read_injectStyles,
  null,
  "570e7f68"
  
)

/* harmony default export */ var read = __webpack_exports__["default"] = (read_component.exports);

/***/ })

};;
//# sourceMappingURL=index.js.map