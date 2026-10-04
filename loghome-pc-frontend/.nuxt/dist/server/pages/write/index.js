exports.ids = [26];
exports.modules = {

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(174);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("2507fb0b", content, true, context)
};

/***/ }),

/***/ 173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_0cb4b644_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(123);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_0cb4b644_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_0cb4b644_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_0cb4b644_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_0cb4b644_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 174:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".write-page{width:100%}.write-page .page-header{margin-bottom:30px}.write-page .page-title{font-size:32px;color:#704c35}.write-page .write-container{display:grid;grid-template-columns:1fr 300px;gap:30px}.write-page .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.write-page .section-title{font-size:24px;color:#704c35;margin:0}.write-page .new-button{background-color:#947358;color:#fff;border:none;border-radius:4px;padding:10px 20px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.write-page .new-button:hover{background-color:#704c35}.write-page .tabs{display:flex;margin-bottom:20px;border-bottom:1px solid #eee}.write-page .tab-button{padding:10px 20px;background:none;border:none;color:#666;font-size:16px;cursor:pointer;position:relative;transition:color .3s ease}.write-page .tab-button:hover{color:#947358}.write-page .tab-button.active{color:#947358;font-weight:600}.write-page .tab-button.active:after{content:\"\";position:absolute;bottom:-1px;left:0;right:0;height:3px;background-color:#947358;display:block}.write-page .loading-state{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.write-page .loading-state .loading-spinner{width:50px;height:50px;border:5px solid #f5f5f5;border-top:5px solid #947358;border-radius:50%;margin:0 auto 20px;animation:spin 1s linear infinite}.write-page .loading-state .loading-text{color:#666}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.write-page .error-state{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.write-page .error-state .error-icon{font-size:50px;margin-bottom:20px;color:#e74c3c}.write-page .error-state .error-title{font-size:20px;color:#333;margin-bottom:10px}.write-page .error-state .error-desc{color:#666;margin-bottom:25px}.write-page .error-state .error-button{background-color:#947358;color:#fff;border:none;border-radius:4px;padding:10px 30px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.write-page .error-state .error-button:hover{background-color:#704c35}.write-page .work-empty{background-color:#fff;border-radius:8px;padding:40px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.1)}.write-page .work-empty .empty-icon{font-size:64px;margin-bottom:20px}.write-page .work-empty .empty-title{font-size:20px;color:#333;margin-bottom:10px}.write-page .work-empty .empty-desc{color:#666;margin-bottom:25px}.write-page .work-empty .empty-button{background-color:#fb7d46;color:#fff;border:none;border-radius:4px;padding:10px 30px;font-weight:600;cursor:pointer;transition:background-color .3s ease}.write-page .work-empty .empty-button:hover{background-color:#fa6c2e}.write-page .work-item{display:flex;background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,.1);margin-bottom:20px}.write-page .work-item .work-cover{width:150px;position:relative;flex-shrink:0}.write-page .work-item .work-category{position:absolute;top:10px;right:10px;background-color:rgba(0,0,0,.5);color:#fff;padding:4px 8px;border-radius:4px;font-size:12px}.write-page .work-item .work-status{position:absolute;bottom:10px;left:10px;background-color:rgba(0,0,0,.5);color:#fff;padding:4px 8px;border-radius:4px;font-size:12px}.write-page .work-item .work-status.status-completed{background-color:rgba(25,135,84,.7)}.write-page .work-item .work-status.status-draft{background-color:rgba(108,117,125,.7)}.write-page .work-item .work-info{flex-grow:1;padding:20px}.write-page .work-item .work-title{font-size:20px;color:#704c35;margin:0 0 10px}.write-page .work-item .work-stats{display:flex;color:#666;font-size:14px;margin-bottom:10px}.write-page .work-item .work-stats span{margin-right:15px}.write-page .work-item .work-desc{color:#666;font-size:14px;line-height:1.5;margin-bottom:15px}.write-page .work-item .work-update{color:#888;font-size:13px;margin-bottom:15px}.write-page .work-item .work-actions{display:flex;gap:10px}.write-page .work-item .work-action{padding:8px 15px;border-radius:4px;background-color:#f5f5f5;border:none;color:#666;cursor:pointer;transition:all .3s ease}.write-page .work-item .work-action:hover{background-color:#e0e0e0}.write-page .work-item .work-action.primary{background-color:#fb7d46;color:#fff}.write-page .work-item .work-action.primary:hover{background-color:#fa6c2e}.write-page .work-item .activity-section{margin-top:16px;padding:16px;background:#f8f9fa;border-radius:8px;border:1px solid #e9ecef}.write-page .work-item .activity-section-title{margin:0 0 12px 0;font-size:16px;font-weight:600;color:#333}.write-page .work-item .activity-item{background:#fff;border-radius:6px;padding:12px;margin-bottom:12px;border:1px solid #e9ecef}.write-page .work-item .activity-item:last-child{margin-bottom:0}.write-page .work-item .activity-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.write-page .work-item .activity-name{font-weight:600;color:#333;font-size:14px}.write-page .work-item .activity-status{background:#28a745;color:#fff;padding:2px 8px;border-radius:12px;font-size:12px}.write-page .work-item .activity-description{color:#666;font-size:13px;line-height:1.4;margin-bottom:12px}.write-page .work-item .activity-news{margin-bottom:12px}.write-page .work-item .news-title{font-size:13px;font-weight:600;color:#333;margin-bottom:6px}.write-page .work-item .news-item{display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:#f8f9fa;border-radius:4px;margin-bottom:4px;cursor:pointer;transition:background .2s}.write-page .work-item .news-item:hover{background:#e9ecef}.write-page .work-item .news-item:last-child{margin-bottom:0}.write-page .work-item .news-item-title{font-size:12px;color:#666;flex:1}.write-page .work-item .news-arrow{color:#999;font-size:12px}.write-page .work-item .activity-form{border-top:1px solid #e9ecef;padding-top:12px}.write-page .work-item .form-status{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.write-page .work-item .form-title{font-size:13px;font-weight:600;color:#333}.write-page .work-item .form-status-text{font-size:12px;padding:2px 6px;border-radius:10px}.write-page .work-item .form-status-text.status-incomplete{background:#ffeaa7;color:#d63031}.write-page .work-item .form-status-text.status-complete{background:#00b894;color:#fff}.write-page .work-item .form-button{width:100%;padding:8px;background:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;transition:background .2s}.write-page .work-item .form-button:hover{background:#0056b3}.write-page .sidebar-section{background-color:#fff;border-radius:8px;padding:20px;margin-bottom:25px;box-shadow:0 2px 4px rgba(0,0,0,.1)}.write-page .sidebar-section .sidebar-title{font-size:18px;margin-bottom:15px;color:#704c35;padding-bottom:10px;border-bottom:1px solid #eee}.write-page .sidebar-section .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.write-page .sidebar-section .stats-grid .stat-item{text-align:center;padding:10px;background-color:#f5f5f5;border-radius:4px}.write-page .sidebar-section .stats-grid .stat-item .stat-value{font-size:20px;font-weight:600;color:#947358;margin-bottom:5px}.write-page .sidebar-section .stats-grid .stat-item .stat-label{font-size:14px;color:#666}.write-page .sidebar-section .guide-list{list-style:none;padding:0;margin:0}.write-page .sidebar-section .guide-list .guide-item{padding:8px 0;border-bottom:1px solid #f5f5f5}.write-page .sidebar-section .guide-list .guide-item:last-child{border-bottom:none}.write-page .sidebar-section .guide-list .guide-item .guide-link{color:#947358;text-decoration:none;transition:color .3s ease}.write-page .sidebar-section .guide-list .guide-item .guide-link:hover{color:#704c35;text-decoration:underline}.write-page .sidebar-section .activity-list{display:flex;flex-direction:column;gap:15px}.write-page .sidebar-section .activity-list .activity-item{padding:15px;background-color:#f5f5f5;border-radius:4px;border-left:3px solid #947358}.write-page .sidebar-section .activity-list .activity-item .activity-title{font-size:16px;color:#333;margin:0 0 10px}.write-page .sidebar-section .activity-list .activity-item .activity-desc{font-size:14px;color:#666;margin:0 0 10px;line-height:1.4}.write-page .sidebar-section .activity-list .activity-item .activity-date{font-size:13px;color:#888;margin:0 0 10px}.write-page .sidebar-section .activity-list .activity-item .activity-link{display:inline-block;color:#947358;text-decoration:none;font-size:14px;font-weight:600}.write-page .sidebar-section .activity-list .activity-item .activity-link:hover{text-decoration:underline}@media(max-width: 992px){.write-page .write-container{grid-template-columns:1fr}.write-page .work-cover{width:100px}}@media(max-width: 576px){.write-page .work-item{flex-direction:column}.write-page .work-item .work-cover{width:100%;height:140px}.write-page .work-item .work-actions{flex-wrap:wrap}.write-page .work-item .work-actions .work-action{flex:1 0 auto}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 238:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/index.vue?vue&type=template&id=0cb4b644
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "write-page"
  }, [_vm._ssrNode("<div class=\"page-header\"><h1 class=\"page-title\">创作中心</h1></div> <div class=\"write-container\"><div class=\"works-section\"><div class=\"section-header\"><h2 class=\"section-title\">我的作品</h2> <button class=\"new-button\">+ 创建新作品</button></div> <div class=\"tabs\"><button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'all'
  }) + ">全部作品</button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'ongoing'
  }) + ">连载中</button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'completed'
  }) + ">已完结</button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'draft'
  }) + ">草稿箱</button></div> <div class=\"works-list\">" + (_vm.loading ? "<div class=\"loading-state\"><div class=\"loading-spinner\"></div> <p class=\"loading-text\">正在加载作品列表...</p></div>" : _vm.error ? "<div class=\"error-state\"><div class=\"error-icon\">❌</div> <h3 class=\"error-title\">加载失败</h3> <p class=\"error-desc\">" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button class=\"error-button\">重试</button></div>" : !_vm.filteredWorks.length ? "<div class=\"work-empty\"><div class=\"empty-icon\">📝</div> <h3 class=\"empty-title\">" + _vm._ssrEscape(_vm._s(_vm.activeTab === 'all' ? '您还没有创建任何作品' : '没有符合条件的作品')) + "</h3> " + (_vm.activeTab === 'all' ? "<p class=\"empty-desc\">点击&quot;创建新作品&quot;按钮开始您的创作之旅</p>" : "<!---->") + " " + (_vm.activeTab === 'all' ? "<button class=\"empty-button\">+ 立即创建</button>" : "<!---->") + "</div>" : "<!---->") + " " + _vm._ssrList(_vm.filteredWorks, function (work) {
    return "<div class=\"work-item\"><div class=\"work-cover\"" + _vm._ssrStyle(null, work.picUrl ? `background-image: url(${work.picUrl}); background-size: cover; background-position: center;` : `background-color: ${work.color}`, null) + "><span class=\"work-category\">" + _vm._ssrEscape(_vm._s(work.category)) + "</span> <span" + _vm._ssrClass("work-status", {
      'status-completed': work.status === '已完结',
      'status-draft': work.status === '草稿'
    }) + ">" + _vm._ssrEscape(_vm._s(work.status)) + "</span></div> <div class=\"work-info\"><h3 class=\"work-title\">" + _vm._ssrEscape(_vm._s(work.title)) + "</h3> <p class=\"work-stats\"><span>" + _vm._ssrEscape(_vm._s(work.status)) + "</span> <span>" + _vm._ssrEscape(_vm._s(work.wordCount) + "字") + "</span></p> <p class=\"work-desc\">" + _vm._ssrEscape(_vm._s(work.description)) + "</p> <p class=\"work-update\">" + _vm._ssrEscape("最近更新: " + _vm._s(work.lastUpdate)) + "</p> <div class=\"work-actions\"><button class=\"work-action primary\">开始写作</button> <button class=\"work-action\">编辑信息</button></div> " + (work.activityInfo && work.activityInfo.hasActivity ? "<div class=\"activity-section\"><h4 class=\"activity-section-title\">创作活动</h4> <div class=\"activity-list\">" + _vm._ssrList(work.activityInfo.activities, function (activity) {
      return "<div class=\"activity-item\"><div class=\"activity-header\"><div class=\"activity-name\">" + _vm._ssrEscape(_vm._s(activity.activity_name)) + "</div> <span class=\"activity-status\">活动中</span></div> <div class=\"activity-description\">" + _vm._ssrEscape(_vm._s(activity.activity_description)) + "</div> " + (activity.activity_news && activity.activity_news.length > 0 ? "<div class=\"activity-news\"><div class=\"news-title\">活动资讯</div> <div class=\"news-list\">" + _vm._ssrList(activity.activity_news, function (news) {
        return "<div class=\"news-item\"><div class=\"news-item-title\">" + _vm._ssrEscape(_vm._s(news.title)) + "</div> <i class=\"el-icon-arrow-right\"></i></div>";
      }) + "</div></div>" : "<!---->") + " " + (activity.required_fields && activity.required_fields.length > 0 ? "<div class=\"activity-form\"><div class=\"form-status\"><div class=\"form-title\">活动参与信息</div> <div" + _vm._ssrClass("form-status-text", _vm.getFormStatusClass(work.id, activity.tag_id)) + ">" + _vm._ssrEscape("\n                        " + _vm._s(_vm.getFormStatusText(work.id, activity.tag_id, activity.required_fields)) + "\n                      ") + "</div></div> <button class=\"form-button\">" + _vm._ssrEscape("\n                      " + _vm._s(_vm.hasFilledForm(work.id, activity.tag_id) ? '修改信息' : '填写信息') + "\n                    ") + "</button></div>" : "<!---->") + "</div>";
    }) + "</div></div>" : "<!---->") + "</div></div>";
  }) + "</div></div> <div class=\"sidebar\"><div class=\"sidebar-section\"><h3 class=\"sidebar-title\">创作数据</h3> <div class=\"stats-grid\"><div class=\"stat-item\"><div class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.stats.totalWorks)) + "</div> <div class=\"stat-label\">作品总数</div></div> <div class=\"stat-item\"><div class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.stats.totalWords)) + "</div> <div class=\"stat-label\">总字数</div></div></div></div></div></div>")]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/write/index.vue?vue&type=template&id=0cb4b644

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/write/index.vue?vue&type=script&lang=js
/* harmony default export */ var writevue_type_script_lang_js = ({
  head() {
    return {
      title: '创作中心 - 原木社区'
    };
  },
  data() {
    return {
      activeTab: 'all',
      works: [],
      stats: {
        totalWorks: 0,
        totalWords: '0',
        totalViews: '0',
        totalFavorites: 0
      },
      loading: false,
      error: null,
      // 创作活动相关数据
      activityData: {},
      activityFormData: {},
      showActivityForm: false,
      currentActivity: null
    };
  },
  async mounted() {
    this.checkLoginStatus();
    await this.fetchWorks();
    await this.loadActivityData();
  },
  computed: {
    filteredWorks() {
      if (this.activeTab === 'all') {
        return this.works;
      } else if (this.activeTab === 'ongoing') {
        return this.works.filter(work => work.status === '连载中');
      } else if (this.activeTab === 'completed') {
        return this.works.filter(work => work.status === '已完结');
      } else if (this.activeTab === 'draft') {
        return this.works.filter(work => work.status === '草稿');
      }
      return this.works;
    }
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$message.warning('请先登录');
        this.$router.push('/login');
      }
    },
    async fetchWorks() {
      this.loading = true;
      this.error = null;
      try {
        // 使用新添加的API接口获取用户作品列表
        const response = await this.$api.essays.getNovelsOf();
        if (response && Array.isArray(response)) {
          // 转换API返回的数据格式为组件所需的格式
          this.works = response.map(novel => {
            // 根据novel_type确定分类
            let category = '小说';
            if (novel.novel_type === 'fiction') {
              category = '小说';
            } else if (novel.novel_type === 'nonfiction') {
              category = '非虚构';
            } else if (novel.novel_type === 'poetry') {
              category = '诗歌';
            } else if (novel.novel_type === 'world') {
              category = '世界设定';
            }

            // 根据is_complete确定状态
            let status = '连载中';
            if (novel.is_complete == 1) {
              status = '已完结';
            } else if (novel.is_personal == 1) {
              status = '草稿';
            }

            // 获取封面图片URL，如果没有则使用随机颜色作为封面背景色
            const colors = ['#a8d8ea', '#aa96da', '#c7ceea', '#f6c3d5', '#e4f9d4', '#f9d4d4'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const picUrl = novel.picUrl || null;

            // 格式化最后更新时间
            const lastUpdate = novel.update_time ? this.formatDate(novel.update_time) : '未知';

            // 格式化字数
            const wordCount = novel.text_count ? this.formatNumber(novel.text_count) : novel.word_count ? this.formatNumber(novel.word_count) : '0';
            return {
              id: novel.novel_id,
              title: novel.name,
              status,
              category,
              wordCount,
              chapterCount: novel.article_count || 0,
              description: novel.content || '暂无简介',
              lastUpdate,
              color,
              picUrl
            };
          });

          // 更新统计数据
          this.updateStats();

          // 缓存作品数据
          localStorage.setItem('LogHomeUserEssay', JSON.stringify(response));
        }
      } catch (error) {
        console.error('获取作品列表失败:', error);
        this.error = '获取作品列表失败，请稍后重试';

        // 尝试从缓存获取数据
        const cachedWorks = localStorage.getItem('LogHomeUserEssay');
        if (cachedWorks) {
          const parsedWorks = JSON.parse(cachedWorks);
          if (Array.isArray(parsedWorks)) {
            this.works = this.transformWorks(parsedWorks);
            this.updateStats();
          }
        }
      } finally {
        this.loading = false;
      }
    },
    transformWorks(novels) {
      return novels.map(novel => {
        // 根据novel_type确定分类
        let category = '小说';
        if (novel.novel_type === 'fiction') {
          category = '小说';
        } else if (novel.novel_type === 'nonfiction') {
          category = '非虚构';
        } else if (novel.novel_type === 'poetry') {
          category = '诗歌';
        } else if (novel.novel_type === 'world') {
          category = '世界设定';
        }

        // 根据is_complete确定状态
        let status = '连载中';
        if (novel.is_complete == 1) {
          status = '已完结';
        } else if (novel.is_personal == 1) {
          status = '草稿';
        }

        // 获取封面图片URL，如果没有则使用随机颜色作为封面背景色
        const colors = ['#a8d8ea', '#aa96da', '#c7ceea', '#f6c3d5', '#e4f9d4', '#f9d4d4'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const picUrl = novel.picUrl || null;

        // 格式化最后更新时间
        const lastUpdate = novel.update_time ? this.formatDate(novel.update_time) : '未知';

        // 格式化字数
        const wordCount = novel.text_count ? this.formatNumber(novel.text_count) : novel.word_count ? this.formatNumber(novel.word_count) : '0';
        return {
          id: novel.novel_id || novel.id,
          // 优先使用novel_id，兼容缓存数据
          title: novel.name,
          status,
          category,
          wordCount,
          chapterCount: novel.article_count || 0,
          description: novel.content || '暂无简介',
          lastUpdate,
          color,
          picUrl
        };
      });
    },
    updateStats() {
      // 计算总作品数
      this.stats.totalWorks = this.works.length;

      // 计算总字数
      const totalWords = this.works.reduce((sum, work) => {
        const wordCount = parseInt(work.wordCount.replace(/,/g, '')) || 0;
        return sum + wordCount;
      }, 0);
      this.stats.totalWords = this.formatNumber(totalWords);

      // 暂时使用默认值，后续可以通过API获取
      this.stats.totalViews = '0';
      this.stats.totalFavorites = 0;
    },
    formatDate(dateString) {
      try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      } catch (error) {
        return '未知';
      }
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    createNewWork() {
      // 跳转到创建新作品页面
      this.$router.push('/write/new');
    },
    openEditPage(workId) {
      // 在新窗口中打开编辑页面
      const url = `/write/edit/${workId}`;
      window.open(url, '_blank');
    },
    // 创作活动相关方法
    openNewsLink(news) {
      if (news.pc_link) {
        window.open(news.pc_link, '_blank');
      }
    },
    openActivityForm(workId, activity) {
      // 打开活动信息填写表单
      this.$router.push(`/write/activity-form/${workId}/${activity.tag_id}`);
    },
    hasFilledForm(workId, tagId) {
      // 检查是否已填写表单 - 基于服务器返回的数据
      const work = this.works.find(w => w.id === workId);
      if (!work || !work.activityInfo || !work.activityInfo.userInfo) return false;
      return work.activityInfo.userInfo.some(info => info.tag_id === tagId);
    },
    getFormStatusText(workId, tagId, requiredFields) {
      if (!this.hasFilledForm(workId, tagId)) {
        const requiredCount = requiredFields.filter(field => field.required).length;
        return requiredCount > 0 ? `有${requiredCount}项必填信息未填写` : '信息未填写';
      }
      const work = this.works.find(w => w.id === workId);
      if (!work || !work.activityInfo || !work.activityInfo.userInfo) return '信息未填写';
      const userInfo = work.activityInfo.userInfo.find(info => info.tag_id === tagId);
      if (!userInfo) return '信息未填写';

      // 从 information_data 字段解析实际的表单数据
      let formData = {};
      try {
        formData = userInfo.information_data ? JSON.parse(userInfo.information_data) : {};
      } catch (e) {
        console.error('解析表单数据失败:', e);
        formData = {};
      }
      const missingRequired = requiredFields.filter(field => field.required && (!formData[field.name] || formData[field.name].toString().trim() === ''));
      return missingRequired.length > 0 ? `还有${missingRequired.length}项必填信息未完善` : '信息已完善';
    },
    getFormStatusClass(workId, tagId) {
      if (!this.hasFilledForm(workId, tagId)) return 'status-incomplete';
      const work = this.works.find(w => w.id === workId);
      if (!work || !work.activityInfo || !work.activityInfo.userInfo) return 'status-incomplete';
      const userInfo = work.activityInfo.userInfo.find(info => info.tag_id === tagId);
      if (!userInfo) return 'status-incomplete';
      const activity = work.activityInfo.activities.find(act => act.tag_id === tagId);
      if (!activity) return 'status-incomplete';

      // 从 information_data 字段解析实际的表单数据
      let formData = {};
      try {
        formData = userInfo.information_data ? JSON.parse(userInfo.information_data) : {};
      } catch (e) {
        console.error('解析表单数据失败:', e);
        formData = {};
      }
      const missingRequired = activity.required_fields.filter(field => field.required && (!formData[field.name] || formData[field.name].toString().trim() === ''));
      return missingRequired.length > 0 ? 'status-incomplete' : 'status-complete';
    },
    getRequiredFieldsByTagId(tagId) {
      // 根据tagId获取必填字段
      for (const work of this.works) {
        if (work.activityInfo && work.activityInfo.activities) {
          const activity = work.activityInfo.activities.find(a => a.tag_id === tagId);
          if (activity) {
            return activity.required_fields;
          }
        }
      }
      return null;
    },
    // 加载创作活动数据
    async loadActivityData() {
      try {
        // 为每个作品加载活动信息
        for (const work of this.works) {
          await this.loadWorkActivityInfo(work);
        }
      } catch (error) {
        console.error('加载活动数据失败:', error);
      }
    },
    async loadWorkActivityInfo(work) {
      try {
        const response = await this.$api.essays.getNovelActivity(work.id);
        this.$set(work, 'activityInfo', response);
        console.log(work);
      } catch (error) {
        console.error(`加载作品 ${work.id} 的活动信息失败:`, error);
        this.$set(work, 'activityInfo', {
          hasActivity: false,
          activities: []
        });
      }
    },
    // 提交活动信息
    async submitActivityInfo(workId, tagId, formData) {
      try {
        const response = await this.$api.essays.submitActivityInfo(workId, tagId, formData);
        if (response.code === 200) {
          // 保存到本地存储
          const key = `activity_form_${workId}_${tagId}`;
          localStorage.setItem(key, JSON.stringify(formData));

          // 重新加载活动信息
          const work = this.works.find(w => w.id === workId);
          if (work) {
            await this.loadWorkActivityInfo(work);
          }
          return {
            success: true,
            message: '提交成功'
          };
        } else {
          return {
            success: false,
            message: response.message || '提交失败'
          };
        }
      } catch (error) {
        console.error('提交活动信息失败:', error);
        return {
          success: false,
          message: '网络错误，请重试'
        };
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/write/index.vue?vue&type=script&lang=js
 /* harmony default export */ var pages_writevue_type_script_lang_js = (writevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/write/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(173)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_writevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  "3f8d31cf"
  
)

/* harmony default export */ var write = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=index.js.map