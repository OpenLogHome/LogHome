exports.ids = [6];
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

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(148);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("5ec6d1c4", content, true, context)
};

/***/ }),

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_1c51992d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(113);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_1c51992d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_1c51992d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_1c51992d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_1c51992d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 148:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.community-page[data-v-1c51992d] {\r\n  max-width: 1200px;\r\n  margin: 0 auto;\r\n  padding: 20px;\r\n  min-height: 100vh;\n}\r\n\r\n/* 搜索栏样式 */\n.search-bar[data-v-1c51992d] {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  margin-bottom: 30px;\n}\n.search-input-wrapper[data-v-1c51992d] {\r\n  flex: 1;\r\n  display: flex;\r\n  align-items: center;\r\n  background: white;\r\n  border-radius: 25px;\r\n  padding: 12px 20px;\r\n  cursor: pointer;\r\n  transition: all 0.3s ease;\r\n  box-shadow: 0 2px 8px rgba(0,0,0,0.06);\r\n  border: 1px solid #e9ecef;\r\n  margin-right: 20px;\n}\n.search-input-wrapper[data-v-1c51992d]:hover {\r\n  border-color: #947358;\r\n  box-shadow: 0 4px 16px rgba(148, 115, 88, 0.15);\n}\n.search-input-wrapper i[data-v-1c51992d] {\r\n  margin-right: 12px;\r\n  color: #6c757d;\r\n  font-size: 18px;\n}\n.search-placeholder[data-v-1c51992d] {\r\n  color: #6c757d;\r\n  font-size: 16px;\n}\n.message-icon[data-v-1c51992d] {\r\n  position: relative;\r\n  width: 48px;\r\n  height: 48px;\r\n  background: white;\r\n  border-radius: 50%;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  cursor: pointer;\r\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\r\n  transition: all 0.3s ease;\n}\n.message-icon[data-v-1c51992d]:hover {\r\n  background: #947358;\r\n  color: white;\r\n  transform: scale(1.05);\n}\n.message-icon i[data-v-1c51992d] {\r\n  font-size: 20px;\n}\n.unread-badge[data-v-1c51992d] {\r\n  position: absolute;\r\n  top: -5px;\r\n  right: -5px;\r\n  background: #dc3545;\r\n  color: white;\r\n  border-radius: 50%;\r\n  width: 20px;\r\n  height: 20px;\r\n  font-size: 12px;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  font-weight: 600;\n}\r\n\r\n/* 轮播图样式 */\n.swiper-section[data-v-1c51992d] {\r\n  margin-bottom: 30px;\r\n  border-radius: 12px;\r\n  overflow: hidden;\n}\n.banner-section[data-v-1c51992d] {\r\n  margin-bottom: 30px;\r\n  border-radius: 12px;\r\n  overflow: hidden;\r\n  box-shadow: 0 4px 20px rgba(0,0,0,0.08);\n}\r\n\r\n/* 通用section样式 */\n.section[data-v-1c51992d] {\r\n  margin-bottom: 30px;\n}\n.circles-section[data-v-1c51992d],\r\n.posts-section[data-v-1c51992d] {\r\n  margin-bottom: 30px;\n}\n.section-header[data-v-1c51992d] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  margin-bottom: 20px;\n}\n.section-title[data-v-1c51992d] {\r\n  font-size: 22px;\r\n  font-weight: 700;\r\n  color: #2c3e50;\r\n  position: relative;\n}\n.section-title[data-v-1c51992d]::after {\r\n  content: '';\r\n  position: absolute;\r\n  bottom: -4px;\r\n  left: 0;\r\n  width: 40px;\r\n  height: 3px;\r\n  background: linear-gradient(90deg, #947358, #704C35);\r\n  border-radius: 2px;\n}\n.section-more[data-v-1c51992d] {\r\n  color: #947358;\r\n  text-decoration: none;\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  padding: 6px 12px;\r\n  border-radius: 20px;\r\n  transition: all 0.3s ease;\r\n  cursor: pointer;\n}\n.section-more[data-v-1c51992d]:hover {\r\n  background: rgba(148, 115, 88, 0.1);\r\n  text-decoration: none;\n}\n.more-link[data-v-1c51992d] {\r\n  color: #947358;\r\n  text-decoration: none;\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  padding: 6px 12px;\r\n  border-radius: 20px;\r\n  transition: all 0.3s ease;\n}\n.more-link[data-v-1c51992d]:hover {\r\n  background: rgba(148, 115, 88, 0.1);\r\n  text-decoration: none;\n}\n.sort-tabs[data-v-1c51992d] {\r\n  display: flex;\r\n  margin-bottom: 24px;\r\n  background: white;\r\n  border-radius: 12px;\r\n  padding: 6px;\r\n  box-shadow: 0 2px 12px rgba(0,0,0,0.06);\n}\n.sort-tab[data-v-1c51992d] {\r\n  flex: 1;\r\n  padding: 12px 24px;\r\n  background: none;\r\n  border: none;\r\n  font-size: 16px;\r\n  font-weight: 500;\r\n  color: #6c757d;\r\n  cursor: pointer;\r\n  border-radius: 8px;\r\n  transition: all 0.3s ease;\r\n  text-align: center;\n}\n.sort-tab.active[data-v-1c51992d] {\r\n  color: white;\r\n  background: linear-gradient(135deg, #947358, #704C35);\r\n  box-shadow: 0 2px 8px rgba(148, 115, 88, 0.3);\n}\n.sort-tab[data-v-1c51992d]:hover:not(.active) {\r\n  color: #947358;\r\n  background: rgba(148, 115, 88, 0.1);\n}\r\n\r\n/* 排序按钮样式 */\n.header-actions[data-v-1c51992d] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 16px;\n}\n.sort-buttons[data-v-1c51992d] {\r\n  display: flex;\r\n  gap: 8px;\n}\n.sort-btn[data-v-1c51992d] {\r\n  padding: 8px 16px;\r\n  background: white;\r\n  border: 1px solid #e9ecef;\r\n  border-radius: 20px;\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  color: #6c757d;\r\n  cursor: pointer;\r\n  transition: all 0.3s ease;\n}\n.sort-btn.active[data-v-1c51992d] {\r\n  background: #947358;\r\n  color: white;\r\n  border-color: #947358;\n}\n.sort-btn[data-v-1c51992d]:hover:not(.active) {\r\n  border-color: #947358;\r\n  color: #947358;\n}\r\n\r\n/* 圈子网格样式 */\n.circles-grid[data-v-1c51992d] {\r\n  display: grid;\r\n  grid-template-columns: 2fr 1fr;\r\n  gap: 20px;\r\n  align-items: start;\n}\r\n\r\n/* 主圈子卡片 */\n.circle-main[data-v-1c51992d] {\r\n  background: white;\r\n  border-radius: 16px;\r\n  overflow: hidden;\r\n  box-shadow: 0 4px 20px rgba(0,0,0,0.08);\r\n  transition: all 0.3s ease;\r\n  cursor: pointer;\r\n  border: 1px solid rgba(0,0,0,0.05);\r\n  position: relative;\n}\n.circle-main[data-v-1c51992d]:hover {\r\n  transform: translateY(-4px);\r\n  box-shadow: 0 8px 30px rgba(0,0,0,0.15);\n}\n.circle-bg[data-v-1c51992d] {\r\n  width: 100%;\r\n  height: 160px;\r\n  object-fit: cover;\r\n  display: block;\n}\n.circle-info[data-v-1c51992d] {\r\n  position: absolute;\r\n  bottom: 0;\r\n  left: 0;\r\n  right: 0;\r\n  background: linear-gradient(transparent, rgba(0,0,0,0.7));\r\n  padding: 20px;\r\n  display: flex;\r\n  align-items: center;\r\n  color: white;\n}\n.circle-icon[data-v-1c51992d] {\r\n  width: 48px;\r\n  height: 48px;\r\n  border-radius: 50%;\r\n  margin-right: 12px;\r\n  border: 2px solid white;\r\n  box-shadow: 0 2px 8px rgba(0,0,0,0.3);\n}\n.circle-details h4[data-v-1c51992d] {\r\n  margin: 0 0 4px 0;\r\n  font-size: 16px;\r\n  font-weight: 600;\r\n  color: white;\n}\n.circle-details span[data-v-1c51992d] {\r\n  font-size: 13px;\r\n  color: rgba(255,255,255,0.9);\r\n  font-weight: 500;\n}\r\n\r\n/* 侧边圈子列表 */\n.circles-side[data-v-1c51992d] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 12px;\n}\n.side-circle[data-v-1c51992d] {\r\n  background: white;\r\n  border-radius: 12px;\r\n  padding: 16px;\r\n  display: flex;\r\n  align-items: center;\r\n  cursor: pointer;\r\n  transition: all 0.3s ease;\r\n  box-shadow: 0 2px 8px rgba(0,0,0,0.06);\r\n  border: 1px solid rgba(0,0,0,0.05);\n}\n.side-circle[data-v-1c51992d]:hover {\r\n  transform: translateY(-2px);\r\n  box-shadow: 0 4px 16px rgba(0,0,0,0.12);\n}\n.side-circle img[data-v-1c51992d] {\r\n  width: 36px;\r\n  height: 36px;\r\n  border-radius: 50%;\r\n  margin-right: 12px;\r\n  border: 1px solid #e9ecef;\n}\n.side-circle h5[data-v-1c51992d] {\r\n  margin: 0 0 2px 0;\r\n  font-size: 14px;\r\n  font-weight: 600;\r\n  color: #2c3e50;\n}\n.side-circle span[data-v-1c51992d] {\r\n  font-size: 12px;\r\n  color: #6c757d;\n}\n.all-circles[data-v-1c51992d] {\r\n  background: linear-gradient(135deg, #947358, #704C35);\r\n  color: white;\r\n  border-radius: 12px;\r\n  padding: 16px;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  cursor: pointer;\r\n  transition: all 0.3s ease;\r\n  box-shadow: 0 2px 8px rgba(148, 115, 88, 0.3);\n}\n.all-circles[data-v-1c51992d]:hover {\r\n  transform: translateY(-2px);\r\n  box-shadow: 0 4px 16px rgba(148, 115, 88, 0.4);\n}\n.all-circles span[data-v-1c51992d] {\r\n  font-size: 14px;\r\n  font-weight: 600;\n}\n.all-circles i[data-v-1c51992d] {\r\n  font-size: 16px;\n}\r\n\r\n/* 兼容旧样式 */\n.circle-card[data-v-1c51992d] {\r\n  background: white;\r\n  border-radius: 16px;\r\n  overflow: hidden;\r\n  box-shadow: 0 4px 20px rgba(0,0,0,0.08);\r\n  transition: all 0.3s ease;\r\n  cursor: pointer;\r\n  border: 1px solid rgba(0,0,0,0.05);\n}\n.circle-card[data-v-1c51992d]:hover {\r\n  transform: translateY(-4px);\r\n  box-shadow: 0 8px 30px rgba(0,0,0,0.15);\n}\n.circle-avatar[data-v-1c51992d] {\r\n  width: 52px;\r\n  height: 52px;\r\n  border-radius: 50%;\r\n  margin-right: 16px;\r\n  border: 3px solid white;\r\n  box-shadow: 0 4px 12px rgba(0,0,0,0.15);\n}\n.circle-details h3[data-v-1c51992d] {\r\n  margin: 0 0 6px 0;\r\n  font-size: 17px;\r\n  font-weight: 600;\r\n  color: #2c3e50;\n}\n.circle-members[data-v-1c51992d] {\r\n  font-size: 14px;\r\n  color: #6c757d;\r\n  font-weight: 500;\n}\r\n\r\n/* 帖子列表样式 - 瀑布流布局 */\n.posts-list[data-v-1c51992d] {\r\n  column-count: 2;\r\n  column-gap: 20px;\r\n  column-fill: balance;\n}\n.post-card[data-v-1c51992d] {\r\n  background: white;\r\n  border-radius: 16px;\r\n  padding: 24px;\r\n  box-shadow: 0 4px 20px rgba(0,0,0,0.08);\r\n  transition: all 0.3s ease;\r\n  border: 1px solid rgba(0,0,0,0.05);\r\n  cursor: pointer;\r\n  break-inside: avoid;\r\n  margin-bottom: 20px;\r\n  display: inline-block;\r\n  width: 100%;\n}\n.post-card[data-v-1c51992d]:hover {\r\n  box-shadow: 0 8px 30px rgba(0,0,0,0.12);\r\n  transform: translateY(-2px);\n}\n.post-header[data-v-1c51992d] {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  margin-bottom: 16px;\n}\n.user-avatar[data-v-1c51992d] {\r\n  width: 44px;\r\n  height: 44px;\r\n  border-radius: 50%;\r\n  margin-right: 12px;\r\n  cursor: pointer;\r\n  border: 2px solid #f8f9fa;\r\n  transition: all 0.3s ease;\n}\n.user-avatar[data-v-1c51992d]:hover {\r\n  border-color: #947358;\n}\n.user-info[data-v-1c51992d] {\r\n  display: flex;\r\n  align-items: center;\r\n  cursor: pointer;\n}\n.user-meta[data-v-1c51992d] {\r\n  display: flex;\r\n  flex-direction: column;\n}\n.user-name[data-v-1c51992d] {\r\n  font-weight: 600;\r\n  color: #2c3e50;\r\n  margin-bottom: 2px;\r\n  font-size: 15px;\r\n  transition: color 0.3s ease;\r\n  display: block;\n}\n.user-name[data-v-1c51992d]:hover {\r\n  color: #947358;\n}\n.post-time[data-v-1c51992d] {\r\n  font-size: 13px;\r\n  color: #8e9aaf;\r\n  font-weight: 500;\n}\n.post-circle[data-v-1c51992d] {\r\n  background: #f8f9fa;\r\n  color: #6c757d;\r\n  padding: 4px 12px;\r\n  border-radius: 12px;\r\n  font-size: 12px;\r\n  cursor: pointer;\r\n  transition: all 0.3s ease;\n}\n.post-circle[data-v-1c51992d]:hover {\r\n  background: #e9ecef;\r\n  color: #495057;\n}\n.post-content[data-v-1c51992d] {\r\n  margin: 0 0 16px 0;\n}\n.post-title[data-v-1c51992d] {\r\n  font-size: 19px;\r\n  font-weight: 700;\r\n  color: #2c3e50;\r\n  margin-bottom: 12px;\r\n  line-height: 1.4;\n}\n.post-text[data-v-1c51992d] {\r\n  color: #6c757d;\r\n  line-height: 1.6;\r\n  font-size: 15px;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 3;\r\n  -webkit-box-orient: vertical;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  max-height: 4.8em;\n}\n.post-images[data-v-1c51992d] {\r\n  margin: 16px 0;\n}\n.image-grid[data-v-1c51992d] {\r\n  display: grid;\r\n  gap: 8px;\r\n  border-radius: 12px;\r\n  overflow: hidden;\n}\n.grid-1[data-v-1c51992d] {\r\n  grid-template-columns: 1fr;\r\n  max-width: 300px;\n}\n.grid-2[data-v-1c51992d] {\r\n  grid-template-columns: repeat(2, 1fr);\r\n  max-width: 400px;\n}\n.grid-3[data-v-1c51992d] {\r\n  grid-template-columns: repeat(3, 1fr);\r\n  max-width: 450px;\n}\n.grid-multi[data-v-1c51992d] {\r\n  grid-template-columns: repeat(3, 1fr);\r\n  max-width: 450px;\n}\n.post-image[data-v-1c51992d] {\r\n  width: 100%;\r\n  height: 120px;\r\n  object-fit: cover;\r\n  cursor: pointer;\r\n  transition: all 0.3s ease;\n}\n.post-image[data-v-1c51992d]:hover {\r\n  transform: scale(1.05);\n}\n.image-count[data-v-1c51992d] {\r\n  position: absolute;\r\n  bottom: 8px;\r\n  right: 8px;\r\n  background: rgba(0,0,0,0.7);\r\n  color: white;\r\n  padding: 4px 8px;\r\n  border-radius: 12px;\r\n  font-size: 12px;\n}\n.post-footer[data-v-1c51992d] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 24px;\r\n  margin-top: 16px;\r\n  padding-top: 16px;\r\n  border-top: 1px solid #f1f3f4;\n}\n.post-title[data-v-1c51992d]:hover {\r\n  color: #947358;\n}\n.post-text[data-v-1c51992d] {\r\n  color: #495057;\r\n  line-height: 1.7;\r\n  margin-bottom: 16px;\r\n  font-size: 15px;\n}\n.post-images[data-v-1c51992d] {\r\n  display: grid;\r\n  gap: 12px;\r\n  margin-bottom: 16px;\n}\n.post-images.single[data-v-1c51992d] {\r\n  grid-template-columns: 1fr;\r\n  max-width: 500px;\n}\n.post-images.double[data-v-1c51992d] {\r\n  grid-template-columns: 1fr 1fr;\n}\n.post-images.multiple[data-v-1c51992d] {\r\n  grid-template-columns: repeat(3, 1fr);\n}\n.post-image[data-v-1c51992d] {\r\n  width: 100%;\r\n  border-radius: 12px;\r\n  cursor: pointer;\r\n  transition: all 0.3s ease;\r\n  box-shadow: 0 2px 12px rgba(0,0,0,0.1);\n}\n.post-image[data-v-1c51992d]:hover {\r\n  transform: scale(1.03);\r\n  box-shadow: 0 4px 20px rgba(0,0,0,0.15);\n}\n.post-actions[data-v-1c51992d] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 24px;\r\n  padding-top: 16px;\r\n  border-top: 1px solid #f1f3f4;\n}\n.action-btn[data-v-1c51992d] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n  background: none;\r\n  border: none;\r\n  color: #6c757d;\r\n  cursor: pointer;\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  padding: 8px 12px;\r\n  border-radius: 20px;\r\n  transition: all 0.3s ease;\n}\n.action-btn[data-v-1c51992d]:hover {\r\n  color: #947358;\r\n  background: rgba(148, 115, 88, 0.1);\n}\n.action-btn.liked[data-v-1c51992d] {\r\n  color: #dc3545;\n}\n.action-btn.liked[data-v-1c51992d]:hover {\r\n  background: rgba(220,53,69,0.1);\n}\r\n\r\n/* 加载更多样式 */\n.load-more[data-v-1c51992d] {\r\n  text-align: center;\r\n  padding: 30px;\n}\n.no-more[data-v-1c51992d] {\r\n  text-align: center;\r\n  padding: 20px;\r\n  color: #8e9aaf;\r\n  font-size: 14px;\n}\r\n\r\n/* 发布按钮样式 */\n.create-post-btn[data-v-1c51992d] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 6px;\r\n  background: linear-gradient(135deg, #947358, #704C35);\r\n  border: none;\r\n  border-radius: 20px;\r\n  color: white;\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n  padding: 8px 16px;\r\n  cursor: pointer;\r\n  box-shadow: 0 2px 10px rgba(148, 115, 88, 0.3);\r\n  transition: all 0.3s ease;\n}\n.create-post-btn[data-v-1c51992d]:hover {\r\n  transform: translateY(-2px);\r\n  box-shadow: 0 4px 15px rgba(148, 115, 88, 0.4);\n}\n.message-badge[data-v-1c51992d] {\r\n  position: absolute;\r\n  top: -5px;\r\n  right: -5px;\r\n  background: #dc3545;\r\n  color: white;\r\n  border-radius: 50%;\r\n  width: 24px;\r\n  height: 24px;\r\n  font-size: 12px;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  font-weight: 600;\n}\r\n\r\n/* 响应式设计 */\n@media (max-width: 768px) {\n.community-page[data-v-1c51992d] {\r\n    padding: 15px;\n}\n.circles-grid[data-v-1c51992d] {\r\n    grid-template-columns: 1fr;\r\n    gap: 16px;\n}\n.circle-main[data-v-1c51992d] {\r\n    margin-bottom: 16px;\n}\n.circles-side[data-v-1c51992d] {\r\n    display: grid;\r\n    grid-template-columns: repeat(2, 1fr);\r\n    gap: 12px;\n}\n.all-circles[data-v-1c51992d] {\r\n    grid-column: 1 / -1;\n}\n.sort-buttons[data-v-1c51992d] {\r\n    display: flex;\r\n    gap: 8px;\n}\n.sort-btn[data-v-1c51992d] {\r\n    flex: 1;\r\n    padding: 8px 16px;\r\n    font-size: 14px;\n}\n.post-images.multiple[data-v-1c51992d] {\r\n    grid-template-columns: repeat(2, 1fr);\n}\n.post-card[data-v-1c51992d] {\r\n    padding: 20px;\n}\n.message-btn[data-v-1c51992d] {\r\n    width: 50px;\r\n    height: 50px;\r\n    bottom: 20px;\r\n    right: 20px;\r\n    font-size: 20px;\n}\r\n  \r\n  /* 瀑布流响应式 */\n.posts-list[data-v-1c51992d] {\r\n      column-count: 1;\r\n      column-gap: 15px;\n}\n}\n@media (max-width: 480px) {\n.search-input-wrapper[data-v-1c51992d] {\r\n    margin-right: 10px;\n}\n.search-placeholder[data-v-1c51992d] {\r\n    font-size: 14px;\n}\n.section-title[data-v-1c51992d] {\r\n    font-size: 18px;\n}\n.sort-btn[data-v-1c51992d] {\r\n    padding: 5px 10px;\r\n    font-size: 13px;\n}\n.post-title[data-v-1c51992d] {\r\n    font-size: 17px;\n}\n.post-card[data-v-1c51992d] {\r\n    padding: 16px;\n}\n.post-actions[data-v-1c51992d] {\r\n    gap: 16px;\n}\n.action-btn[data-v-1c51992d] {\r\n    padding: 6px 10px;\r\n    font-size: 13px;\n}\r\n  \r\n  /* 小屏幕瀑布流 */\n.posts-list[data-v-1c51992d] {\r\n    column-count: 1;\r\n    column-gap: 0;\n}\n}\r\n\r\n/* 加载动画 */\n@keyframes fadeInUp-1c51992d {\nfrom {\r\n    opacity: 0;\r\n    transform: translateY(20px);\n}\nto {\r\n    opacity: 1;\r\n    transform: translateY(0);\n}\n}\n.post-card[data-v-1c51992d] {\r\n  animation: fadeInUp-1c51992d 0.5s ease-out;\n}\r\n\r\n/* 骨架屏样式 */\n.skeleton[data-v-1c51992d] {\r\n  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);\r\n  background-size: 200% 100%;\r\n  animation: loading-1c51992d 1.5s infinite;\n}\n@keyframes loading-1c51992d {\n0% {\r\n    background-position: 200% 0;\n}\n100% {\r\n    background-position: -200% 0;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/index.vue?vue&type=template&id=1c51992d&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "community-page"
  }, [_vm.swiperItems && _vm.swiperItems.length > 0 ? _vm._ssrNode("<div class=\"swiper-section\" data-v-1c51992d>", "</div>", [_c('Banner', {
    attrs: {
      "banners": _vm.swiperItems,
      "page": "community_index"
    }
  })], 1) : _vm._e(), _vm._ssrNode(" " + (_vm.recommendCircles && _vm.recommendCircles.length > 0 ? "<div class=\"section\" data-v-1c51992d><div class=\"section-header\" data-v-1c51992d><h3 class=\"section-title\" data-v-1c51992d>推荐圈子</h3> <span class=\"section-more\" data-v-1c51992d>更多</span></div> <div class=\"circles-grid\" data-v-1c51992d>" + (_vm.hasCircle(0) ? "<div class=\"circle-main\" data-v-1c51992d><img" + _vm._ssrAttr("src", _vm.getCircleImage(0)) + " alt=\"圈子背景\" class=\"circle-bg\" data-v-1c51992d> <div class=\"circle-info\" data-v-1c51992d><img" + _vm._ssrAttr("src", _vm.getCircleIcon(0)) + " alt=\"圈子图标\" class=\"circle-icon\" data-v-1c51992d> <div class=\"circle-details\" data-v-1c51992d><h4 data-v-1c51992d>" + _vm._ssrEscape(_vm._s(_vm.getCircleName(0))) + "</h4> <span data-v-1c51992d>" + _vm._ssrEscape(_vm._s(_vm.getCircleMemberCount(0)) + "人") + "</span></div></div></div>" : "<!---->") + " <div class=\"circles-side\" data-v-1c51992d>" + (_vm.hasCircle(1) ? "<div class=\"side-circle\" data-v-1c51992d><img" + _vm._ssrAttr("src", _vm.getCircleIcon(1)) + " alt=\"圈子图标\" data-v-1c51992d> <div data-v-1c51992d><h5 data-v-1c51992d>" + _vm._ssrEscape(_vm._s(_vm.getCircleName(1))) + "</h5> <span data-v-1c51992d>" + _vm._ssrEscape(_vm._s(_vm.getCircleMemberCount(1)) + "人") + "</span></div></div>" : "<!---->") + " " + (_vm.hasCircle(2) ? "<div class=\"side-circle\" data-v-1c51992d><img" + _vm._ssrAttr("src", _vm.getCircleIcon(2)) + " alt=\"圈子图标\" data-v-1c51992d> <div data-v-1c51992d><h5 data-v-1c51992d>" + _vm._ssrEscape(_vm._s(_vm.getCircleName(2))) + "</h5> <span data-v-1c51992d>" + _vm._ssrEscape(_vm._s(_vm.getCircleMemberCount(2)) + "人") + "</span></div></div>" : "<!---->") + " <div class=\"all-circles\" data-v-1c51992d><span data-v-1c51992d>全部圈子</span> <i class=\"el-icon-arrow-right\" data-v-1c51992d></i></div></div></div></div>" : "<!---->") + " "), _vm._ssrNode("<div class=\"section\" data-v-1c51992d>", "</div>", [_vm._ssrNode("<div class=\"section-header\" data-v-1c51992d><h3 class=\"section-title\" data-v-1c51992d>帖子</h3> <div class=\"header-actions\" data-v-1c51992d><div class=\"sort-buttons\" data-v-1c51992d><button" + _vm._ssrClass(null, ['sort-btn', {
    active: _vm.sortType === 'hot'
  }]) + " data-v-1c51992d>热门</button> <button" + _vm._ssrClass(null, ['sort-btn', {
    active: _vm.sortType === 'new'
  }]) + " data-v-1c51992d>最新</button></div> <div class=\"create-post-btn\" data-v-1c51992d><i class=\"el-icon-plus\" data-v-1c51992d></i> <span data-v-1c51992d>发布</span></div></div></div> <div class=\"posts-list\" data-v-1c51992d>" + _vm._ssrList(_vm.posts || [], function (post, index) {
    return "<div class=\"post-card\" data-v-1c51992d><div class=\"post-header\" data-v-1c51992d><div class=\"user-info\" data-v-1c51992d><img" + _vm._ssrAttr("src", post.author_avatar) + " alt=\"用户头像\" class=\"user-avatar\" data-v-1c51992d> <div class=\"user-meta\" data-v-1c51992d><span class=\"user-name\" data-v-1c51992d>" + _vm._ssrEscape(_vm._s(post.author_name)) + "</span> <span class=\"post-time\" data-v-1c51992d>" + _vm._ssrEscape(_vm._s(_vm.formatTime(post.create_time))) + "</span></div></div> <div class=\"post-circle\" data-v-1c51992d>" + _vm._ssrEscape("\n            " + _vm._s(post.circle_name) + "\n          ") + "</div></div> <div class=\"post-content\" data-v-1c51992d><h4 class=\"post-title\" data-v-1c51992d>" + _vm._ssrEscape(_vm._s(post.title)) + "</h4> <p class=\"post-text\" data-v-1c51992d>" + _vm._ssrEscape(_vm._s(post.content)) + "</p></div> " + (post.media_urls && post.media_urls.length > 0 ? "<div class=\"post-images\" data-v-1c51992d><div" + _vm._ssrClass(null, ['image-grid', 'grid-' + (post.media_urls.length > 3 ? 'multi' : post.media_urls.length)]) + " data-v-1c51992d>" + _vm._ssrList(post.media_urls.slice(0, 9), function (img, imgIndex) {
      return "<img" + _vm._ssrAttr("src", img) + " alt=\"帖子图片\" class=\"post-image\" data-v-1c51992d>";
    }) + " " + (post.media_urls.length > 9 ? "<div class=\"image-count\" data-v-1c51992d>" + _vm._ssrEscape("+" + _vm._s(post.media_urls.length - 9)) + "</div>" : "<!---->") + "</div></div>" : "<!---->") + " <div class=\"post-footer\" data-v-1c51992d><div class=\"action-btn\" data-v-1c51992d><i class=\"el-icon-chat-dot-round\" data-v-1c51992d></i> <span data-v-1c51992d>" + _vm._ssrEscape(_vm._s(post.comment_count || 0)) + "</span></div> <div" + _vm._ssrClass("action-btn", {
      liked: post.is_liked
    }) + " data-v-1c51992d><i" + _vm._ssrClass(null, post.is_liked ? 'el-icon-star-on' : 'el-icon-star-off') + _vm._ssrStyle(null, {
      color: post.is_liked ? '#EA7034' : '#666'
    }, null) + " data-v-1c51992d></i> <span" + _vm._ssrClass(null, {
      liked: post.is_liked
    }) + " data-v-1c51992d>" + _vm._ssrEscape(_vm._s(post.like_count || 0)) + "</span></div> <div class=\"action-btn\" data-v-1c51992d><i class=\"el-icon-share\" data-v-1c51992d></i> <span data-v-1c51992d>分享</span></div></div></div>";
  }) + "</div> "), _vm.hasMore ? _vm._ssrNode("<div class=\"load-more\" data-v-1c51992d>", "</div>", [_c('el-button', {
    attrs: {
      "loading": _vm.loadingStatus === 'loading'
    },
    on: {
      "click": _vm.loadMore
    }
  }, [_vm._v("加载更多")])], 1) : _vm.posts && _vm.posts.length > 0 ? _vm._ssrNode("<div class=\"no-more\" data-v-1c51992d><span data-v-1c51992d>没有更多内容了</span></div>") : _vm._e()], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/community/index.vue?vue&type=template&id=1c51992d&scoped=true

// EXTERNAL MODULE: ./components/Banner.vue + 4 modules
var Banner = __webpack_require__(112);

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(106);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/index.vue?vue&type=script&lang=js


/* harmony default export */ var communityvue_type_script_lang_js = ({
  components: {
    Banner: Banner["a" /* default */]
  },
  head() {
    return {
      title: '社区 - LogHome',
      meta: [{
        hid: 'description',
        name: 'description',
        content: 'LogHome社区 - 分享阅读心得，发现优质书籍，与书友交流互动的知识社区平台'
      }, {
        hid: 'keywords',
        name: 'keywords',
        content: '读书社区,书评,阅读分享,书友交流,读书笔记,好书推荐'
      }, {
        property: 'og:title',
        content: 'LogHome社区 - 书友交流分享平台'
      }, {
        property: 'og:description',
        content: '在LogHome社区发现好书，分享阅读心得，与志同道合的书友一起探讨文学世界'
      }, {
        property: 'og:type',
        content: 'website'
      }],
      link: [{
        rel: 'canonical',
        href: 'https://loghome.cn/community'
      }]
    };
  },
  data() {
    return {
      sortType: 'new',
      loadingStatus: 'more',
      page: 1,
      pageSize: 10,
      posts: [],
      recommendCircles: [],
      unreadCount: 0,
      hasMore: true,
      swiperItems: []
    };
  },
  async asyncData({
    $api
  }) {
    try {
      // 并行获取数据以提高性能
      const [circlesRes, postsRes, swiperRes] = await Promise.all([$api.community.getRecommendCircles({
        page: 1,
        pageSize: 4,
        sort: 'random'
      }), $api.community.getRecommendPosts({
        page: 1,
        pageSize: 10,
        sort: 'new'
      }), $api.novels.getLibraryRoulousChart()]);
      return {
        recommendCircles: (circlesRes === null || circlesRes === void 0 ? void 0 : circlesRes.list) || [],
        posts: ((postsRes === null || postsRes === void 0 ? void 0 : postsRes.list) || []).map(post => {
          if (post.media_urls && typeof post.media_urls === 'string') {
            try {
              post.media_urls = JSON.parse(post.media_urls);
            } catch (e) {
              post.media_urls = [];
            }
          }
          post.is_liked = false;
          post.is_liked_checked = false;
          return post;
        }),
        swiperItems: (swiperRes || []).filter(item => item.isValid === 1).map(item => ({
          image_url: item.image,
          title: item.title,
          link_url: item.navigate_to === 'None' ? null : item.navigate_to
        })),
        hasMore: (postsRes === null || postsRes === void 0 ? void 0 : postsRes.total) > (postsRes === null || postsRes === void 0 ? void 0 : postsRes.pageSize)
      };
    } catch (error) {
      console.error('获取社区数据失败:', error);
      return {
        recommendCircles: [],
        posts: [],
        swiperItems: [],
        hasMore: false
      };
    }
  },
  mounted() {
    // 客户端获取点赞状态
    if (false) {}
    // 初始化瀑布流
    this.$nextTick(() => {
      this.initWaterfall();
    });
  },
  beforeDestroy() {
    // 清理事件监听器
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
    }
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  },
  methods: {
    async loadRecommendCircles() {
      try {
        const res = await this.$api.community.getRecommendCircles({
          page: 1,
          pageSize: 4,
          sort: 'random'
        });
        this.recommendCircles = (res === null || res === void 0 ? void 0 : res.list) || [];
      } catch (error) {
        console.error('加载推荐圈子失败', error);
        this.recommendCircles = [];
      }
    },
    async loadPosts() {
      if (!this.hasMore || this.loadingStatus === 'loading') return;
      this.loadingStatus = 'loading';
      try {
        const res = await this.$api.community.getRecommendPosts({
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortType
        });
        if (res !== null && res !== void 0 && res.list) {
          const newPosts = res.list.map(post => {
            if (post.media_urls && typeof post.media_urls === 'string') {
              try {
                post.media_urls = JSON.parse(post.media_urls);
              } catch (e) {
                post.media_urls = [];
              }
            }
            post.is_liked = false;
            post.is_liked_checked = false;
            return post;
          });
          if (this.page === 1) {
            this.posts = newPosts;
          } else {
            this.posts = [...this.posts, ...newPosts];
          }
          this.page++;
          this.hasMore = this.posts.length < res.total;
          this.loadingStatus = this.hasMore ? 'more' : 'noMore';

          // 获取点赞状态
          setTimeout(() => {
            this.getPostsLikeStatus();
          }, 100);

          // 重新初始化瀑布流
          this.$nextTick(() => {
            this.initWaterfall();
          });
        }
      } catch (error) {
        console.error('加载帖子失败', error);
        this.loadingStatus = 'more';
      }
    },
    async getPostsLikeStatus() {
      try {
        // 检查是否已登录
        if (!localStorage.getItem('token')) return;
        const uncheckedPosts = this.posts.filter(post => !post.is_liked_checked);
        if (uncheckedPosts.length === 0) return;
        for (const post of uncheckedPosts) {
          try {
            const res = await this.$api.community.getLikeStatus({
              target_id: post.post_id,
              target_type: 1
            });
            post.is_liked = res.liked;
            post.is_liked_checked = true;
          } catch (err) {
            console.error(`获取帖子 ${post.post_id} 点赞状态失败:`, err);
          }
        }
      } catch (error) {
        console.error('获取点赞状态失败:', error);
      }
    },
    changeSort(type) {
      if (this.sortType === type) return;
      this.sortType = type;
      this.page = 1;
      this.posts = [];
      this.hasMore = true;
      this.loadPosts();
    },
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
    navigateToSearch() {
      this.$router.push('/community/search?origin=community');
    },
    navigateToCircles() {
      this.$router.push('/community/circles');
    },
    navigateToCircle(circleId) {
      if (!circleId || circleId === 0) {
        this.$message.warning('圈子不存在');
        return;
      }
      this.$router.push(`/community/circle/${circleId}`);
    },
    navigateToPost(postId) {
      this.$router.push(`/community/post/${postId}`);
    },
    navigateToUser(userId) {
      this.$router.push(`/users/${userId}`);
    },
    navigateToCreatePost() {
      this.$router.push('/community/post/edit');
    },
    loadMore() {
      if (this.hasMore) {
        this.loadPosts();
      }
    },
    previewImage(images, index) {
      // PC端图片预览逻辑
      console.log('预览图片:', images, index);
    },
    async likePost(post) {
      try {
        const token = this.$auth.getToken();
        if (!token) {
          this.$message.warning('请先登录');
          return;
        }
        const res = await this.$api.community.likePost({
          target_id: post.post_id,
          target_type: 1
        });
        if ((res === null || res === void 0 ? void 0 : res.liked) !== undefined) {
          post.is_liked = res.liked;
          post.like_count += post.is_liked ? 1 : -1;
        } else {
          post.is_liked = !post.is_liked;
          post.like_count += post.is_liked ? 1 : -1;
        }
      } catch (error) {
        console.error('点赞失败', error);
        this.$message.error('操作失败');
      }
    },
    sharePost(post) {
      // PC端分享逻辑
      const shareUrl = `${window.location.origin}/community/post/${post.post_id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.$message.success('链接已复制到剪贴板');
      }).catch(() => {
        this.$message.error('复制失败');
      });
    },
    gotoMessage() {
      this.$router.push('/community/message');
    },
    // 圈子相关辅助方法
    getCircleId(index) {
      var _this$recommendCircle, _this$recommendCircle2;
      return ((_this$recommendCircle = this.recommendCircles) === null || _this$recommendCircle === void 0 ? void 0 : (_this$recommendCircle2 = _this$recommendCircle[index]) === null || _this$recommendCircle2 === void 0 ? void 0 : _this$recommendCircle2.circle_id) || 0;
    },
    getCircleImage(index) {
      var _this$recommendCircle3;
      const circle = (_this$recommendCircle3 = this.recommendCircles) === null || _this$recommendCircle3 === void 0 ? void 0 : _this$recommendCircle3[index];
      return (circle === null || circle === void 0 ? void 0 : circle.bg_url) || (circle === null || circle === void 0 ? void 0 : circle.icon) || '/static/default-circle.png';
    },
    getCircleIcon(index) {
      var _this$recommendCircle4, _this$recommendCircle5;
      return ((_this$recommendCircle4 = this.recommendCircles) === null || _this$recommendCircle4 === void 0 ? void 0 : (_this$recommendCircle5 = _this$recommendCircle4[index]) === null || _this$recommendCircle5 === void 0 ? void 0 : _this$recommendCircle5.icon) || '/static/default-circle.png';
    },
    getCircleName(index) {
      var _this$recommendCircle6, _this$recommendCircle7;
      return ((_this$recommendCircle6 = this.recommendCircles) === null || _this$recommendCircle6 === void 0 ? void 0 : (_this$recommendCircle7 = _this$recommendCircle6[index]) === null || _this$recommendCircle7 === void 0 ? void 0 : _this$recommendCircle7.name) || '未知圈子';
    },
    getCircleMemberCount(index) {
      var _this$recommendCircle8, _this$recommendCircle9;
      return ((_this$recommendCircle8 = this.recommendCircles) === null || _this$recommendCircle8 === void 0 ? void 0 : (_this$recommendCircle9 = _this$recommendCircle8[index]) === null || _this$recommendCircle9 === void 0 ? void 0 : _this$recommendCircle9.member_count) || 0;
    },
    hasCircle(index) {
      var _this$recommendCircle0;
      const circle = (_this$recommendCircle0 = this.recommendCircles) === null || _this$recommendCircle0 === void 0 ? void 0 : _this$recommendCircle0[index];
      return circle && circle.circle_id && circle.circle_id !== 0;
    },
    // 瀑布流相关方法
    initWaterfall() {
      if (true) return;
      this.$nextTick(() => {
        this.adjustWaterfallLayout();
      });
    },
    adjustWaterfallLayout() {
      // CSS columns 会自动处理布局，这里主要用于监听窗口变化
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', this.handleResize);
      }
    },
    handleResize() {
      // 防抖处理
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.initWaterfall();
      }, 300);
    }
  }
});
// CONCATENATED MODULE: ./pages/community/index.vue?vue&type=script&lang=js
 /* harmony default export */ var pages_communityvue_type_script_lang_js = (communityvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/community/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(147)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_communityvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "1c51992d",
  "0493761a"
  
)

/* harmony default export */ var community = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=index.js.map