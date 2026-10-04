exports.ids = [5];
exports.modules = {

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(180);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("60f54bc0", content, true, context)
};

/***/ }),

/***/ 179:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_ef3f2ffc_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(126);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_ef3f2ffc_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_ef3f2ffc_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_ef3f2ffc_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_circles_vue_vue_type_style_index_0_id_ef3f2ffc_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 180:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".circles-container[data-v-ef3f2ffc]{max-width:1200px;margin:0 auto;padding:20px;min-height:100vh}.page-header[data-v-ef3f2ffc]{text-align:center;margin-bottom:30px}.page-header .page-title[data-v-ef3f2ffc]{font-size:32px;font-weight:bold;color:#333;margin-bottom:8px}.page-header .page-subtitle[data-v-ef3f2ffc]{font-size:16px;color:#666;margin:0}.search-section[data-v-ef3f2ffc]{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;gap:20px}.search-section .search-box[data-v-ef3f2ffc]{display:flex;flex:1;max-width:500px}.search-section .search-box .search-input[data-v-ef3f2ffc]{flex:1;height:40px;padding:0 15px;border:1px solid #ddd;border-radius:20px 0 0 20px;font-size:14px;outline:none}.search-section .search-box .search-input[data-v-ef3f2ffc]:focus{border-color:#ea7034}.search-section .search-box .search-btn[data-v-ef3f2ffc]{width:50px;height:40px;background-color:#ea7034;border:none;border-radius:0 20px 20px 0;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}.search-section .search-box .search-btn[data-v-ef3f2ffc]:hover{background-color:#d65a2b}.search-section .create-circle-btn[data-v-ef3f2ffc]{height:40px;padding:0 20px;background-color:#ea7034;color:#fff;border:none;border-radius:20px;font-size:14px;cursor:pointer;display:flex;align-items:center;gap:5px;white-space:nowrap}.search-section .create-circle-btn[data-v-ef3f2ffc]:hover{background-color:#d65a2b}.search-section .create-circle-btn .icon-plus[data-v-ef3f2ffc]{font-size:16px}.circles-content .category-section[data-v-ef3f2ffc]{margin-bottom:40px}.circles-content .category-section .category-header[data-v-ef3f2ffc]{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:10px;border-bottom:2px solid #ea7034}.circles-content .category-section .category-header .category-name[data-v-ef3f2ffc]{font-size:24px;font-weight:bold;color:#333;margin:0}.circles-content .category-section .category-header .circle-count[data-v-ef3f2ffc]{font-size:14px;color:#666}.circles-content .category-section .circles-grid[data-v-ef3f2ffc]{display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:20px}.circle-card[data-v-ef3f2ffc]{background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.1);cursor:pointer;transition:all .3s ease}.circle-card[data-v-ef3f2ffc]:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.15)}.circle-card .circle-header[data-v-ef3f2ffc]{display:flex;align-items:flex-start;margin-bottom:15px}.circle-card .circle-header .circle-icon[data-v-ef3f2ffc]{width:60px;height:60px;border-radius:12px;object-fit:cover;margin-right:15px;flex-shrink:0}.circle-card .circle-header .circle-info[data-v-ef3f2ffc]{flex:1;min-width:0}.circle-card .circle-header .circle-info .circle-name-row[data-v-ef3f2ffc]{display:flex;align-items:center;margin-bottom:8px}.circle-card .circle-header .circle-info .circle-name-row .circle-name[data-v-ef3f2ffc]{font-size:18px;font-weight:bold;color:#333;margin:0;margin-right:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.circle-card .circle-header .circle-info .circle-name-row .official-tag[data-v-ef3f2ffc]{font-size:12px;color:#fff;background-color:#ea7034;padding:2px 8px;border-radius:10px;flex-shrink:0}.circle-card .circle-header .circle-info .circle-meta[data-v-ef3f2ffc]{display:flex;gap:15px}.circle-card .circle-header .circle-info .circle-meta .member-count[data-v-ef3f2ffc],.circle-card .circle-header .circle-info .circle-meta .post-count[data-v-ef3f2ffc]{font-size:14px;color:#666}.circle-card .circle-description[data-v-ef3f2ffc]{font-size:14px;color:#666;line-height:1.5;margin-bottom:15px;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.circle-card .circle-actions[data-v-ef3f2ffc]{display:flex;justify-content:flex-end}.circle-card .circle-actions .join-btn[data-v-ef3f2ffc]{padding:8px 20px;background-color:#ea7034;color:#fff;border:none;border-radius:20px;font-size:14px;cursor:pointer;transition:background-color .3s ease}.circle-card .circle-actions .join-btn[data-v-ef3f2ffc]:hover{background-color:#d65a2b}.circle-card .circle-actions .joined-btn[data-v-ef3f2ffc]{padding:8px 20px;background-color:#f0f0f0;color:#999;border:none;border-radius:20px;font-size:14px;cursor:default}.empty-state[data-v-ef3f2ffc]{text-align:center;padding:80px 20px}.empty-state .empty-icon[data-v-ef3f2ffc]{font-size:64px;margin-bottom:20px}.empty-state .empty-text[data-v-ef3f2ffc]{font-size:20px;color:#666;margin-bottom:10px}.empty-state .empty-desc[data-v-ef3f2ffc]{font-size:14px;color:#999;margin-bottom:30px}.empty-state .create-first-btn[data-v-ef3f2ffc]{padding:12px 30px;background-color:#ea7034;color:#fff;border:none;border-radius:25px;font-size:16px;cursor:pointer}.empty-state .create-first-btn[data-v-ef3f2ffc]:hover{background-color:#d65a2b}@media(max-width: 768px){.circles-container[data-v-ef3f2ffc]{padding:15px}.search-section[data-v-ef3f2ffc]{flex-direction:column;gap:15px}.search-section .search-box[data-v-ef3f2ffc]{max-width:none}.search-section .create-circle-btn[data-v-ef3f2ffc]{width:100%;justify-content:center}.circles-grid[data-v-ef3f2ffc]{grid-template-columns:1fr !important}.page-header .page-title[data-v-ef3f2ffc]{font-size:24px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/circles.vue?vue&type=template&id=ef3f2ffc&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "circles-container"
  }, [_vm._ssrNode("<div class=\"page-header\" data-v-ef3f2ffc><h1 class=\"page-title\" data-v-ef3f2ffc>圈子广场</h1> <p class=\"page-subtitle\" data-v-ef3f2ffc>发现有趣的圈子，找到志同道合的朋友</p></div> <div class=\"search-section\" data-v-ef3f2ffc><div class=\"search-box\" data-v-ef3f2ffc><input type=\"text\" placeholder=\"搜索圈子名称或描述\"" + _vm._ssrAttr("value", _vm.keyword) + " class=\"search-input\" data-v-ef3f2ffc> <button class=\"search-btn\" data-v-ef3f2ffc><i class=\"el-icon-search\" data-v-ef3f2ffc></i></button></div> <button class=\"create-circle-btn\" data-v-ef3f2ffc><i class=\"el-icon-plus\" data-v-ef3f2ffc></i>\n      创建圈子\n    </button></div> "), _c('div', {
    directives: [{
      name: "loading",
      rawName: "v-loading",
      value: _vm.loadingStatus === 'loading',
      expression: "loadingStatus === 'loading'"
    }],
    staticClass: "circles-content"
  }, [_vm._ssrNode(_vm._ssrList(_vm.categories, function (category, index) {
    return "<div class=\"category-section\" data-v-ef3f2ffc><div class=\"category-header\" data-v-ef3f2ffc><h2 class=\"category-name\" data-v-ef3f2ffc>" + _vm._ssrEscape(_vm._s(category.name)) + "</h2> <span class=\"circle-count\" data-v-ef3f2ffc>" + _vm._ssrEscape(_vm._s(category.circle_count) + "个圈子") + "</span></div> <div class=\"circles-grid\" data-v-ef3f2ffc>" + _vm._ssrList(_vm.categoryCircles[category.category_id], function (circle, circleIndex) {
      return "<div class=\"circle-card\" data-v-ef3f2ffc><div class=\"circle-header\" data-v-ef3f2ffc><img" + _vm._ssrAttr("src", circle.icon || '/default-avatar.png') + _vm._ssrAttr("alt", circle.name) + " class=\"circle-icon\" data-v-ef3f2ffc> <div class=\"circle-info\" data-v-ef3f2ffc><div class=\"circle-name-row\" data-v-ef3f2ffc><h3 class=\"circle-name\" data-v-ef3f2ffc>" + _vm._ssrEscape(_vm._s(circle.name)) + "</h3> " + (circle.is_official ? "<span class=\"official-tag\" data-v-ef3f2ffc>官方</span>" : "<!---->") + "</div> <div class=\"circle-meta\" data-v-ef3f2ffc><span class=\"member-count\" data-v-ef3f2ffc>" + _vm._ssrEscape(_vm._s(circle.member_count) + "人") + "</span> <span class=\"post-count\" data-v-ef3f2ffc>" + _vm._ssrEscape(_vm._s(circle.post_count) + "帖子") + "</span></div></div></div> <p class=\"circle-description\" data-v-ef3f2ffc>" + _vm._ssrEscape(_vm._s(circle.description)) + "</p></div>";
    }) + "</div></div>";
  }) + " " + (Object.keys(_vm.categoryCircles).length === 0 && _vm.loadingStatus !== 'loading' ? "<div class=\"empty-state\" data-v-ef3f2ffc><div class=\"empty-icon\" data-v-ef3f2ffc>📭</div> <p class=\"empty-text\" data-v-ef3f2ffc>暂无圈子</p> <p class=\"empty-desc\" data-v-ef3f2ffc>成为第一个创建圈子的人吧！</p> <button class=\"create-first-btn\" data-v-ef3f2ffc>创建圈子</button></div>" : "<!---->"))])], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/community/circles.vue?vue&type=template&id=ef3f2ffc&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/community/circles.vue?vue&type=script&lang=js
/* harmony default export */ var circlesvue_type_script_lang_js = ({
  name: 'CirclesPage',
  data() {
    return {
      categories: [],
      categoryCircles: {},
      keyword: '',
      loadingStatus: 'more',
      hasMore: true,
      isLoggedIn: false,
      myJoinedCircles: []
    };
  },
  async asyncData({
    $api
  }) {
    try {
      // 获取圈子分类
      const categories = await $api.community.getCircleCategories();
      return {
        categories: categories || []
      };
    } catch (error) {
      console.error('获取圈子分类失败:', error);
      return {
        categories: []
      };
    }
  },
  mounted() {
    this.checkLoginStatus();
    this.initializeData();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = token && JSON.parse(token).tk;
    },
    async initializeData() {
      if (this.categories.length === 0) {
        await this.loadCategories();
      }

      // 初始化每个分类的圈子列表
      this.categories.forEach(category => {
        this.$set(this.categoryCircles, category.category_id, []);
      });
      await Promise.all([this.loadCirclesByCategory(), this.isLoggedIn ? this.loadMyCircles() : Promise.resolve()]);
    },
    async loadCategories() {
      try {
        const categories = await this.$api.community.getCircleCategories();
        this.categories = categories || [];
      } catch (error) {
        console.error('加载分类失败', error);
        this.$message.error('加载分类失败');
      }
    },
    async loadCirclesByCategory() {
      if (!this.hasMore || this.loadingStatus === 'loading') return;
      this.loadingStatus = 'loading';
      try {
        const promises = this.categories.map(category => {
          return this.$api.community.getCirclesList({
            category_id: category.category_id,
            keyword: this.keyword
          });
        });
        const results = await Promise.all(promises);
        results.forEach((res, index) => {
          if (res && res.list) {
            const categoryId = this.categories[index].category_id;
            // 处理圈子数据，标记已加入的圈子
            const circles = res.list.map(circle => {
              circle.is_joined = this.myJoinedCircles.some(c => c.circle_id === circle.circle_id);
              return circle;
            });
            this.$set(this.categoryCircles, categoryId, circles);
            // 更新分类的圈子数量
            this.categories[index].circle_count = res.total;
          }
        });
        this.loadingStatus = 'noMore';
      } catch (error) {
        console.error('加载圈子失败', error);
        this.loadingStatus = 'more';
        this.$message.error('加载圈子失败');
      }
    },
    async loadMyCircles() {
      try {
        const myCircles = await this.$api.community.getMyCircles();
        this.myJoinedCircles = myCircles || [];

        // 更新所有分类中圈子的加入状态
        Object.keys(this.categoryCircles).forEach(categoryId => {
          this.categoryCircles[categoryId] = this.categoryCircles[categoryId].map(circle => {
            circle.is_joined = this.myJoinedCircles.some(c => c.circle_id === circle.circle_id);
            return circle;
          });
        });
      } catch (error) {
        console.error('加载我的圈子失败', error);
      }
    },
    searchCircles() {
      this.loadCirclesByCategory();
    },
    navigateToCircle(circleId) {
      this.$router.push(`/community/circle/${circleId}`);
    },
    async joinCircle(circle) {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录');
        this.$router.push('/login');
        return;
      }
      try {
        await this.$api.community.joinCircle({
          circle_id: circle.circle_id
        });

        // 更新圈子状态
        circle.is_joined = true;
        circle.member_count++;

        // 更新我的圈子列表
        this.myJoinedCircles.push(circle);
        this.$message.success('加入成功');
      } catch (error) {
        console.error('加入圈子失败', error);
        this.$message.error(error.message || '加入失败，请重试');
      }
    },
    // 打开圈子创建窗口
    async openCreateCircle() {
      if (!localStorage.getItem('token')) {
        this.$router.push("/login");
        return;
      }
      await this.$openMobileWindow(`/pages/community/createCircle?id=${this.circleId}`, {
        title: '创建圈子',
        width: 500
      });
    },
    handleImageError(event) {
      event.target.src = '/default-avatar.png';
    }
  }
});
// CONCATENATED MODULE: ./pages/community/circles.vue?vue&type=script&lang=js
 /* harmony default export */ var community_circlesvue_type_script_lang_js = (circlesvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/community/circles.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(179)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  community_circlesvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "ef3f2ffc",
  "91ee6e2c"
  
)

/* harmony default export */ var circles = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=circles.js.map