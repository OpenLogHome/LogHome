exports.ids = [18];
exports.modules = {

/***/ 375:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(544);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("1f75b9ed", content, true, context)
};

/***/ }),

/***/ 376:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(547);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("50c4a86e", content, true, context)
};

/***/ }),

/***/ 542:
/***/ (function(module) {

module.exports = JSON.parse("{\"hero\":{\"eyebrow\":\"给热爱 Minecraft，也热爱故事的你\",\"titleStart\":\"方块跃然纸上，\",\"titleSecondLine\":\"故事\",\"titleHighlight\":\"在此生长\",\"lead\":\"一个属于 Minecraft 同好们的二创社区。\",\"descriptionFirstLine\":\"在这里，\",\"descriptionSecondLine\":\"拥抱天马行空的想象，让热爱与创作变得触手可及。\",\"readAction\":\"发现新的故事\",\"writeAction\":\"写下我的故事\",\"communityAction\":\"或者……先来社区逛逛吧！\",\"caption\":\"从一块原木，到一个故事。\",\"titleEnd\":\"。\",\"worldDescription\":\"史蒂夫阅读、艾利克斯写作，两人在方块森林中交流的循环动画\"},\"pathsLabel\":\"选择你的原木之旅\",\"paths\":[{\"path\":\"/read\",\"label\":\"READ\",\"title\":\"去往新的世界。\",\"description\":\"看看各种各样的小说、漫画与世界设定\"},{\"path\":\"/write\",\"label\":\"CREATE\",\"title\":\"挥洒你的灵感。\",\"description\":\"尝试创建自己的作品吧\"},{\"path\":\"/community\",\"label\":\"CONNECT\",\"title\":\"或者……交些朋友？\",\"description\":\"分享故事，交换想法，找到自己的伙伴\"}],\"stories\":{\"eyebrow\":\"在文字里，探索世界\",\"title\":\"站内经典\",\"description\":\"所谓故事，在结成甘美的果实之前，也是一颗青涩的种子。\",\"browseAction\":\"前往原木书库\",\"loading\":\"正在寻找书库经典…\",\"retry\":\"重新加载\",\"untitled\":\"未命名作品\",\"descriptionFallback\":\"翻开作品，探索作者笔下的世界。\",\"error\":\"作品推荐暂时未能加载，你仍可以前往书库发现故事。\",\"empty\":\"每一个世界，都在等待新的故事。来书库看看吧。\",\"coverAlt\":\"{name}封面\",\"source\":\"来自「{collection}」专题\",\"types\":{\"world\":\"世界设定\",\"manga\":\"漫画\",\"novel\":\"小说\"},\"authorFallback\":\"佚名\"},\"create\":{\"eyebrow\":\"让想象绽放\",\"titleFirstLine\":\"一直想讲的那个故事，\",\"titleSecondLine\":\"不如就从此刻开始。\",\"description\":\"让一个尚未成形的想法，长成属于你的参天大树。\",\"action\":\"进入创作空间\",\"previewTitle\":\"我的第一部作品\",\"caption\":\"从一个念头开始 · 创作过程与文字示例\",\"previewLabel\":\"创作过程示例\",\"stagesLabel\":\"查看创作过程\",\"steps\":[\"无需踌躇犹豫，这没什么难的\",\"就像你做过无数次的那样\",\"再一次拥抱自己脑中的故事就好\"],\"stages\":[{\"label\":\"记下灵感\",\"eyebrow\":\"一个新的念头\",\"title\":\"无名之人\",\"text\":\"没有来处，亦无归途。\"},{\"label\":\"创建章节\",\"eyebrow\":\"第一章\",\"title\":\"童话的前奏\",\"text\":\"晨光穿林，他拿起地图，第一次走向了熟悉的村庄之外。\"},{\"label\":\"介绍作品\",\"eyebrow\":\"我的作品简介\",\"title\":\"勇者年代记\",\"text\":\"一封匿名来信，把一位从未离开村庄的少年带向地图之外。这是一个关于探索、相遇，以及寻找的故事。\"}]},\"community\":{\"eyebrow\":\"故事之外，也成方圆\",\"titleFirstLine\":\"我说，\",\"titleSecondLine\":\"交点朋友怎么样？\",\"description\":\"聊聊喜欢的角色，交换有趣的设定，分享今天的灵感。关于 Minecraft 与你的故事，这里有更多话题。\",\"action\":\"去社区聊聊\",\"loading\":\"正在寻找社区里的新话题…\",\"listLabel\":\"社区里的新话题\",\"emptyTitle\":\"来这里，可以聊些什么？\",\"retry\":\"重新加载社区话题\",\"circleFallback\":\"社区交流\",\"titleFallback\":\"来听听这个想法\",\"authorFallback\":\"社区成员\",\"ideas\":[{\"mark\":\"聊\",\"title\":\"聊聊喜欢的角色与剧情\",\"text\":\"交换不同的理解，发现故事的另一面。\"},{\"mark\":\"想\",\"title\":\"分享突然冒出的灵感\",\"text\":\"把一个念头，交给更多想象。\"},{\"mark\":\"写\",\"title\":\"一起讨论世界设定\",\"text\":\"从一个地名开始，让世界一点点清晰。\"}],\"showIdeas\":false},\"download\":{\"eyebrow\":\"让好故事与你同行\",\"titleFirstLine\":\"无论何处，\",\"titleSecondLine\":\"原木都会陪伴在你身边。\",\"description\":\"把社区装进口袋吧！\",\"action\":\"下载 Android 版\",\"readAction\":\"前往网页端\",\"platform\":\"Android 客户端\",\"loading\":\"正在获取下载信息…\",\"error\":\"下载信息暂时不可用。\",\"retry\":\"重试\",\"weixinTip\":\"请点击微信右上角菜单，选择「在浏览器中打开」后下载。\",\"imageAlt\":\"原木社区 Android 客户端书库与阅读界面\",\"version\":\" · v{version}\",\"caption\":\"\"},\"openSource\":{\"eyebrow\":\"OpenLoghome · 开源共建\",\"titleFirstLine\":\"社区的下一段故事，\",\"titleSecondLine\":\"也可以由你来书写。\",\"description\":\"原木社区由 OpenLoghome 开源项目驱动。提交问题、补充文档、贡献代码，或把这里介绍给兴趣于此的朋友，都是参与建设的方式。\",\"githubAction\":\"前往 GitHub\",\"letterAction\":\"阅读开源公开信\",\"codeContribution\":\"贡献代码与文档\",\"feedbackContribution\":\"问题反馈\",\"shareContribution\":\"分享链接\",\"note\":\"一个因热爱而生的地方。\"},\"faq\":{\"eyebrow\":\"在出发之前\",\"title\":\"你可能还想知道\",\"questions\":[{\"title\":\"这里可以读到什么？\",\"answer\":\"原木社区面向 Minecraft 及其衍生文化爱好者。你可以在书库里发现小说、漫画与世界设定。\"},{\"title\":\"从哪里开始创作？\",\"answer\":\"从「写作」进入个人创作空间，创建作品，再添加章节。需要登录时，按页面提示完成即可。\"},{\"title\":\"一定要下载客户端吗？\",\"answer\":\"不必。你可以通过网页端阅读、创作和参与社区讨论，Android 客户端只是一个选择。\"},{\"title\":\"不会写代码，也能参与共建吗？\",\"answer\":\"当然。反馈使用中的问题、补充文档，或向同好介绍原木社区，都是参与的方式。\"}],\"enabled\":false},\"ending\":{\"eyebrow\":\"故事在此生长\",\"title\":\"冒险的书页，就从这里翻开吧。\",\"description\":\"先读一个故事，也许下一个故事就来自你。\",\"writeAction\":\"我也想写\",\"readAction\":\"发现好故事\",\"showDetails\":false},\"seo\":{\"title\":\"原木社区 - Minecraft 同人文学与创作社区\",\"description\":\"在原木社区发现 Minecraft 同人小说、漫画与世界设定，写下自己的方块故事，与同好交流灵感。支持网页阅读与创作，并提供 Android 客户端。\"}}");

/***/ }),

/***/ 543:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeVoxelWorld_vue_vue_type_style_index_0_id_3e71fefe_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(375);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeVoxelWorld_vue_vue_type_style_index_0_id_3e71fefe_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeVoxelWorld_vue_vue_type_style_index_0_id_3e71fefe_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeVoxelWorld_vue_vue_type_style_index_0_id_3e71fefe_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeVoxelWorld_vue_vue_type_style_index_0_id_3e71fefe_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 544:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.voxel-world[data-v-3e71fefe] { position: relative; min-width: 0; height: 590px;\n}\n.world-canvas[data-v-3e71fefe] { position: absolute; inset: 0;\n}\n.world-canvas[data-v-3e71fefe] canvas { display: block; width: 100%; height: 100%;\n}\n@media (max-width: 1050px) {\n.voxel-world[data-v-3e71fefe] { height: 540px;\n}\n}\n@media (max-width: 720px) {\n.voxel-world[data-v-3e71fefe] { height: 500px;\n}\n}\n@media (max-width: 420px) {\n.voxel-world[data-v-3e71fefe] { height: 410px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 545:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return loadLandingWorks; });
/* unused harmony export publicWorks */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return landingPosts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return plainText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return downloadInfo; });
/* harmony import */ var _reading_discovery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


// Reuse public discovery feeds. The optional 首页精选 collection lets editors
// curate the landing page without introducing another configuration service.
async function loadLandingWorks(reading, authorFallback) {
  const [collections, feed] = await Promise.allSettled([reading.getCollections(), reading.getBooks(1, 8)]);
  const candidates = Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_0__[/* activeCollections */ "c"])(collections.status === 'fulfilled' ? collections.value : []).filter(item => !['banner', '最近更新'].includes(item.collection_title));
  const selected = candidates.find(item => item.collection_title === '首页精选') || candidates.find(item => item.collection_title === '入站必读') || candidates[0];
  if (selected) {
    try {
      const works = publicWorks(await reading.getCollectionBooks(selected.collection_title, 1, 8), authorFallback);
      if (works.length) return {
        works: works.slice(0, 4),
        collection: selected.collection_title,
        error: false
      };
    } catch (_) {/* The public feed remains usable if a collection is unavailable. */}
  }
  return {
    works: publicWorks(feed.status === 'fulfilled' ? feed.value : [], authorFallback).slice(0, 4),
    collection: '',
    error: feed.status === 'rejected'
  };
}
function publicWorks(value, authorFallback) {
  const works = Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_0__[/* asList */ "d"])(value).map(work => work && {
    ...work,
    author_name: work.author_name || work.user_name || work.username || authorFallback
  });
  return Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_0__[/* uniqueWorks */ "m"])(works).filter(work => !Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_0__[/* enabledFlag */ "h"])(work.is_personal) && !Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_0__[/* enabledFlag */ "h"])(work.is_banned) && !Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_0__[/* enabledFlag */ "h"])(work.deleted));
}
function landingPosts(value) {
  const seen = new Set();
  return Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_0__[/* asList */ "d"])(value && value.list).filter(post => {
    const id = Number(post && post.post_id);
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id) || post.status != null && Number(post.status) !== 1) return false;
    seen.add(id);
    return true;
  }).slice(0, 3);
}
function plainText(value, limit = 120) {
  return String(value || '').replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/\s+/g, ' ').trim().slice(0, limit);
}
function downloadInfo(value) {
  const release = Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_0__[/* asList */ "d"])(value)[0];
  if (!release || typeof release.update_url !== 'string') return null;
  try {
    const url = new URL(release.update_url);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return {
      url: url.href,
      version: String(release.version || '')
    };
  } catch (_) {
    return null;
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URL"]))

/***/ }),

/***/ 546:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_home_landing_css_vue_type_style_index_0_id_0c1817fc_prod_scoped_true_lang_css_external__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(376);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_home_landing_css_vue_type_style_index_0_id_0c1817fc_prod_scoped_true_lang_css_external__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_home_landing_css_vue_type_style_index_0_id_0c1817fc_prod_scoped_true_lang_css_external__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_home_landing_css_vue_type_style_index_0_id_0c1817fc_prod_scoped_true_lang_css_external__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_home_landing_css_vue_type_style_index_0_id_0c1817fc_prod_scoped_true_lang_css_external__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 547:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".home-container[data-v-0c1817fc] { --home-ink:#333b2f; --home-muted:#687060; --home-wood:#79573c; --home-green:#52643e; --home-line:#dfe2d6; color:var(--home-ink); font-size:16px; line-height:1.8;\n}\n.home-container *[data-v-0c1817fc] { box-sizing:border-box;\n}\n.home-container h1[data-v-0c1817fc],.home-container h2[data-v-0c1817fc],.home-container h3[data-v-0c1817fc],.home-container p[data-v-0c1817fc],.home-container figure[data-v-0c1817fc] { margin:0;\n}\n.home-container a[data-v-0c1817fc] { text-decoration:none;\n}\n.home-container button[data-v-0c1817fc] { font:inherit; cursor:pointer;\n}\n.home-container[data-v-0c1817fc] :is(a,button,summary):focus-visible { outline:2px solid var(--home-wood); outline-offset:5px;\n}\n.home-container :is(section,nav)[id][data-v-0c1817fc] { scroll-margin-top:110px;\n}\n.home-hero[data-v-0c1817fc] { display:grid; grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr); align-items:center; gap:20px; padding:18px 0 48px;\n}\n.home-intro[data-v-0c1817fc] { padding:0 0 8px 10px;\n}\n.home-eyebrow[data-v-0c1817fc] { color:var(--home-green); font-size:12px; letter-spacing:1.6px; line-height:1.8;\n}\n.home-eyebrow > span[data-v-0c1817fc] { display:inline-block; width:8px; height:8px; margin-right:10px; background:#8d9f67; box-shadow:3px 3px 0 #d4dcc4;\n}\n.home-intro h1[data-v-0c1817fc] { font-size:clamp(34px,4.1vw,56px); font-weight:750; line-height:1.45; letter-spacing:-1.8px; margin:24px 0;\n}\n.title-highlight[data-v-0c1817fc] { color:var(--home-green); text-decoration:underline; text-decoration-color:#c7d3b0; text-underline-offset:10px; text-decoration-thickness:4px;\n}\n.home-lead[data-v-0c1817fc] { font-size:18px; color:#505d46;\n}\n.home-description[data-v-0c1817fc] { color:var(--home-muted); font-size:15px; line-height:1.95; max-width:42em; margin-top:16px !important;\n}\n.home-actions[data-v-0c1817fc] { display:flex; align-items:center; flex-wrap:wrap; gap:14px 24px; margin-top:28px;\n}\n.home-cta[data-v-0c1817fc] { display:inline-flex; align-items:center; justify-content:center; gap:18px; padding:12px 22px; min-height:48px; border:1px solid transparent; border-radius:7px; font-size:14px; font-weight:600; line-height:1.5; transition:background .18s,transform .18s;\n}\n.home-cta[data-v-0c1817fc]:hover { transform:translateY(-2px);\n}\n.home-cta-primary[data-v-0c1817fc] { background:var(--home-wood); border-color:var(--home-wood); color:#fffdf7;\n}\n.home-cta-primary[data-v-0c1817fc]:hover { background:#65452e;\n}\n.home-cta-secondary[data-v-0c1817fc] { background:#fffdf8; border-color:#d8dcce; color:var(--home-wood);\n}\n.home-cta-secondary[data-v-0c1817fc]:hover { background:#f0eee5;\n}\n.home-community-link[data-v-0c1817fc] { display:inline-block; margin-top:22px; color:var(--home-muted); font-size:13px; padding:4px 0;\n}\n.home-community-link[data-v-0c1817fc]:hover,.home-text-link[data-v-0c1817fc]:hover,.home-source[data-v-0c1817fc]:hover { text-decoration:underline; text-underline-offset:5px;\n}\n.home-world[data-v-0c1817fc] { min-width:0;\n}\n.home-world > p[data-v-0c1817fc] { text-align:center; font-size:12px; letter-spacing:2px; color:var(--home-muted); margin-top:-24px; position:relative;\n}\n.home-paths[data-v-0c1817fc] { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:28px; border-block:1px solid var(--home-line); padding:24px 0;\n}\n.home-paths a[data-v-0c1817fc] { position:relative; color:var(--home-ink); padding:4px 28px 4px 10px;\n}\n.path-label[data-v-0c1817fc] { display:block; font-size:10px; letter-spacing:2px; color:var(--home-muted); margin-bottom:6px;\n}\n.home-paths h2[data-v-0c1817fc] { font-size:19px; font-weight:600;\n}\n.home-paths p[data-v-0c1817fc] { font-size:13px; color:var(--home-muted); margin-top:5px;\n}\n.path-arrow[data-v-0c1817fc] { position:absolute; right:6px; top:28px; color:var(--home-wood);\n}\n.home-section[data-v-0c1817fc] { padding:80px 0;\n}\n.home-section h2[data-v-0c1817fc],.home-ending h2[data-v-0c1817fc] { font-size:clamp(25px,2.8vw,34px); font-weight:650; line-height:1.55; letter-spacing:-.8px; margin-top:12px;\n}\n.home-section-heading[data-v-0c1817fc] { display:flex; justify-content:space-between; align-items:flex-end; gap:28px; margin-bottom:32px;\n}\n.home-text-link[data-v-0c1817fc] { display:inline-flex; align-items:center; gap:12px; color:var(--home-wood); font-size:14px; min-height:40px; flex-shrink:0;\n}\n.home-books[data-v-0c1817fc] { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:32px;\n}\n.home-book[data-v-0c1817fc] { display:block; min-width:0; color:var(--home-ink);\n}\n.home-book-cover[data-v-0c1817fc] { position:relative; aspect-ratio:2 / 3; border-radius:4px 8px 8px 4px; overflow:hidden; background:#eee9df; box-shadow:0 6px 16px #40362912; transition:transform .2s;\n}\n.home-book:hover .home-book-cover[data-v-0c1817fc] { transform:translateY(-4px);\n}\n.home-book-cover img[data-v-0c1817fc] { display:block; width:100%; height:100%; object-fit:cover;\n}\n.home-book-cover > span[data-v-0c1817fc] { position:absolute; left:10px; bottom:10px; padding:3px 9px; border-radius:3px; background:#fffdf7f2; color:#414b36; font-size:11px;\n}\n.home-book h3[data-v-0c1817fc] { font-size:18px; line-height:1.6; margin-top:18px; font-weight:600; overflow-wrap:anywhere; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;\n}\n.home-book-author[data-v-0c1817fc] { margin-top:4px !important; color:var(--home-muted); font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;\n}\n.home-book-description[data-v-0c1817fc] { margin-top:9px !important; color:var(--home-muted); font-size:13px; line-height:1.8; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; overflow-wrap:anywhere;\n}\n.home-source[data-v-0c1817fc] { display:inline-block; margin-top:24px; color:var(--home-wood); font-size:13px;\n}\n.home-status[data-v-0c1817fc] { padding:24px 0; color:var(--home-muted); font-size:14px; border-top:1px solid var(--home-line);\n}\n.home-inline-button[data-v-0c1817fc] { display:inline-block; padding:6px 0; border:0; background:transparent; color:var(--home-wood); text-decoration:underline; text-underline-offset:4px; font-size:13px !important;\n}\n.home-feature[data-v-0c1817fc] { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); align-items:center; gap:64px;\n}\n.home-feature-copy > .home-cta[data-v-0c1817fc] { margin-top:26px;\n}\n.home-create[data-v-0c1817fc],.home-download[data-v-0c1817fc] { padding:64px 48px; border-radius:14px; background:#ecf0e4;\n}\n.home-writing-steps[data-v-0c1817fc] { list-style:none; padding:0; margin:22px 0 0; color:var(--home-muted); font-size:14px;\n}\n.home-writing-steps li[data-v-0c1817fc] { position:relative; padding-left:20px; margin:10px 0;\n}\n.home-writing-steps li[data-v-0c1817fc]:before { content:''; width:5px; height:5px; position:absolute; top:10px; left:0; background:#839763;\n}\n.home-writing-preview[data-v-0c1817fc] { min-width:0; background:#fffdf8; border:1px solid #dce0d2; border-radius:12px; box-shadow:0 14px 30px #465a3410; overflow:hidden;\n}\n.writing-toolbar[data-v-0c1817fc] { padding:15px 18px; display:flex; justify-content:space-between; align-items:center; color:var(--home-muted); font-size:12px; border-bottom:1px solid #e5e6dc;\n}\n.writing-dots[data-v-0c1817fc] { color:#cbd1be; font-size:9px; letter-spacing:2px;\n}\n.writing-stage-buttons[data-v-0c1817fc] { display:flex; gap:6px; padding:18px 18px 0; flex-wrap:wrap;\n}\n.writing-stage-buttons button[data-v-0c1817fc] { border:0; border-radius:4px; background:transparent; color:var(--home-muted); font-size:12px; padding:7px 11px;\n}\n.writing-stage-buttons button[aria-pressed='true'][data-v-0c1817fc] { background:#f0e8dc; color:var(--home-wood);\n}\n.writing-page[data-v-0c1817fc] { padding:24px 28px; min-height:270px;\n}\n.writing-overline[data-v-0c1817fc] { color:#818876; font-size:11px; letter-spacing:2px;\n}\n.writing-page h3[data-v-0c1817fc] { font-family:'Songti SC',STSong,serif; font-size:23px; line-height:1.7; font-weight:600; margin:12px 0;\n}\n.writing-page > p[data-v-0c1817fc]:not(.writing-overline) { color:#646d5c; font-size:14px; line-height:2.2;\n}\n.writing-rule[data-v-0c1817fc] { display:block; width:45%; height:1px; background:#e8e5dc; margin-top:25px;\n}\n.writing-caption[data-v-0c1817fc] { background:#f3eee5; padding:10px 18px; color:var(--home-muted); font-size:11px;\n}\n.home-list-label[data-v-0c1817fc] { color:var(--home-muted); font-size:12px; margin-bottom:10px !important;\n}\n.home-post[data-v-0c1817fc] { display:block; color:var(--home-ink); padding:19px 0; border-bottom:1px solid var(--home-line);\n}\n.home-post[data-v-0c1817fc]:first-of-type { border-top:1px solid var(--home-line);\n}\n.home-post h3[data-v-0c1817fc] { font-size:17px; font-weight:600; line-height:1.7; margin:7px 0; overflow-wrap:anywhere;\n}\n.home-post h3 > span[data-v-0c1817fc] { color:var(--home-wood); margin-left:8px;\n}\n.home-post:hover h3[data-v-0c1817fc] { color:var(--home-wood);\n}\n.home-post > p[data-v-0c1817fc] { color:var(--home-muted); font-size:13px; line-height:1.8; overflow-wrap:anywhere; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;\n}\n.home-post-meta[data-v-0c1817fc] { display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; color:var(--home-green); font-size:11px;\n}\n.home-post-meta time[data-v-0c1817fc] { color:var(--home-muted);\n}\n.home-post-author[data-v-0c1817fc] { display:block; color:var(--home-muted); font-size:11px; margin-top:8px;\n}\n.home-topic[data-v-0c1817fc] { display:flex; align-items:center; gap:18px; padding:20px 0; border-bottom:1px solid var(--home-line);\n}\n.home-topic > span[data-v-0c1817fc] { display:grid; place-items:center; width:42px; height:42px; flex-shrink:0; border-radius:8px; background:#ecf0e4; color:var(--home-green);\n}\n.home-topic h3[data-v-0c1817fc] { font-size:16px; font-weight:600;\n}\n.home-topic p[data-v-0c1817fc] { font-size:13px; color:var(--home-muted); margin-top:4px;\n}\n.home-download[data-v-0c1817fc] { background:#f3eee5; grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);\n}\n.home-download-status[data-v-0c1817fc] { margin-top:18px !important; color:var(--home-muted); font-size:12px;\n}\n.home-weixin-tip[data-v-0c1817fc] { color:#65452e; font-size:14px; margin-top:14px !important; padding:12px 16px; background:#fff9eb; border-radius:6px;\n}\n.home-mobile-preview[data-v-0c1817fc] { text-align:center;\n}\n.home-mobile-preview img[data-v-0c1817fc] { display:block; width:100%; max-width:285px; height:auto; margin:auto;\n}\n.home-mobile-preview figcaption[data-v-0c1817fc] { color:var(--home-muted); font-size:12px; margin-top:18px;\n}\n.home-open-source[data-v-0c1817fc] { border-bottom:1px solid var(--home-line);\n}\n.home-contributions[data-v-0c1817fc] > :is(a,p):not(.home-contribution-note) { display:flex; align-items:center; gap:20px; border-bottom:1px solid var(--home-line); padding:20px 0; color:var(--home-ink); font-size:16px;\n}\n.home-contributions > a[data-v-0c1817fc]:hover { color:var(--home-wood);\n}\n.home-contributions > :is(a,p) > span[data-v-0c1817fc]:first-child { color:#818876; font-size:12px;\n}\n.home-contributions > a > span[data-v-0c1817fc]:last-child { margin-left:auto; color:var(--home-wood);\n}\n.home-contribution-note[data-v-0c1817fc] { font-size:12px; color:var(--home-muted); margin-top:22px !important;\n}\n.home-faq[data-v-0c1817fc] { display:grid; grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr); gap:60px;\n}\n.home-faq details[data-v-0c1817fc] { border-bottom:1px solid var(--home-line);\n}\n.home-faq summary[data-v-0c1817fc] { cursor:pointer; display:flex; justify-content:space-between; gap:20px; align-items:center; min-height:64px; padding:16px 0; font-size:15px; list-style:none;\n}\n.home-faq summary[data-v-0c1817fc]::-webkit-details-marker { display:none;\n}\n.home-faq summary > span[data-v-0c1817fc] { color:var(--home-wood); font-size:20px; flex-shrink:0;\n}\n.home-faq details[open] summary > span[data-v-0c1817fc] { transform:rotate(45deg);\n}\n.home-faq details p[data-v-0c1817fc] { padding:0 25px 20px 0; color:var(--home-muted); font-size:14px; line-height:1.9;\n}\n.home-ending[data-v-0c1817fc] { text-align:center; padding:60px 24px; background:#ecf0e4; border-radius:14px; margin-bottom:30px;\n}\n.home-ending .home-description[data-v-0c1817fc] { margin-inline:auto;\n}\n.home-ending .home-actions[data-v-0c1817fc] { justify-content:center;\n}\n.home-community-compact[data-v-0c1817fc] { grid-template-columns:1fr;\n}\n.home-community-compact .home-feature-copy[data-v-0c1817fc] { max-width:640px;\n}\n.home-ending-sign[data-v-0c1817fc] { position:relative; isolation:isolate; max-width:880px; margin:64px auto 48px; padding:48px 40px; border:1px solid #cbb496; border-radius:5px; background:repeating-linear-gradient(0deg,transparent 0,transparent 38px,#79573c05 39px,#79573c05 40px),#f1e5d2; box-shadow:inset 0 0 0 6px #fbf4e680,0 7px 0 #d6bea0,0 16px 24px #79573c0d;\n}\n.home-ending-sign[data-v-0c1817fc]::before,.home-ending-sign[data-v-0c1817fc]::after { content:''; position:absolute; top:18px; width:6px; height:6px; border-radius:50%; background:#94785b; box-shadow:inset 1px 1px 1px #60442b60;\n}\n.home-ending-sign[data-v-0c1817fc]::before { left:18px;\n}\n.home-ending-sign[data-v-0c1817fc]::after { right:18px;\n}\n.home-ending-sign .home-eyebrow[data-v-0c1817fc] { color:var(--home-wood); letter-spacing:3px;\n}\n.home-ending-sign h2[data-v-0c1817fc] { font-family:'Songti SC',STSong,serif; color:#59432e; text-wrap:balance;\n}\n@media(min-width:1400px) {\n.home-hero[data-v-0c1817fc] { gap:42px;\n}\n}\n@media(max-width:1050px) {\n.home-hero[data-v-0c1817fc] { grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:12px;\n}\n.home-intro[data-v-0c1817fc] { padding-left:0;\n}\n.home-intro h1[data-v-0c1817fc] { font-size:38px; letter-spacing:-1px;\n}\n.home-lead[data-v-0c1817fc] { font-size:16px;\n}\n.home-feature[data-v-0c1817fc] { gap:32px;\n}\n.home-create[data-v-0c1817fc],.home-download[data-v-0c1817fc] { padding:48px 28px;\n}\n.home-books[data-v-0c1817fc] { gap:22px;\n}\n.home-cta[data-v-0c1817fc] { padding:12px 17px; gap:12px;\n}\n.home-paths[data-v-0c1817fc] { gap:18px;\n}\n.home-paths h2[data-v-0c1817fc] { font-size:17px;\n}\n}\n@media(max-width:760px) {\n.home-hero[data-v-0c1817fc] { grid-template-columns:1fr; gap:0; padding-top:28px;\n}\n.home-intro h1[data-v-0c1817fc] { font-size:clamp(34px,7vw,48px);\n}\n.home-world[data-v-0c1817fc] { max-width:550px; width:100%; margin:auto;\n}\n.home-paths[data-v-0c1817fc] { gap:14px;\n}\n.home-paths a[data-v-0c1817fc] { padding-left:0; padding-right:14px;\n}\n.path-arrow[data-v-0c1817fc] { display:none;\n}\n.home-paths h2[data-v-0c1817fc] { font-size:15px;\n}\n.home-paths p[data-v-0c1817fc] { font-size:12px;\n}\n.home-section[data-v-0c1817fc] { padding:48px 0;\n}\n.home-section-heading[data-v-0c1817fc] { flex-wrap:wrap; gap:12px;\n}\n.home-books[data-v-0c1817fc] { grid-template-columns:repeat(2,minmax(0,1fr)); gap:26px 20px;\n}\n.home-feature[data-v-0c1817fc],.home-faq[data-v-0c1817fc] { grid-template-columns:1fr; gap:30px;\n}\n.home-create[data-v-0c1817fc],.home-download[data-v-0c1817fc] { padding:36px 24px;\n}\n.home-feature-copy .home-description[data-v-0c1817fc] { max-width:100%;\n}\n.home-mobile-preview img[data-v-0c1817fc] { max-width:240px;\n}\n.home-ending[data-v-0c1817fc] { padding:40px 20px;\n}\n.home-container :is(section,nav)[id][data-v-0c1817fc] { scroll-margin-top:180px;\n}\n}\n@media(max-width:400px) {\n.home-paths[data-v-0c1817fc] { grid-template-columns:1fr; gap:0; padding:8px 0;\n}\n.home-paths a[data-v-0c1817fc] { padding:16px 0;\n}\n.home-paths a + a[data-v-0c1817fc] { border-top:1px solid var(--home-line);\n}\n.path-label[data-v-0c1817fc] { display:none;\n}\n.home-paths h2[data-v-0c1817fc] { font-size:17px;\n}\n.path-arrow[data-v-0c1817fc] { display:block;\n}\n.home-create[data-v-0c1817fc],.home-download[data-v-0c1817fc] { padding:30px 18px;\n}\n.writing-page[data-v-0c1817fc] { padding:22px 18px;\n}\n.writing-stage-buttons[data-v-0c1817fc] { padding-inline:10px; gap:3px;\n}\n.writing-stage-buttons button[data-v-0c1817fc] { padding:8px;\n}\n.home-actions[data-v-0c1817fc] { gap:12px;\n}\n.home-book h3[data-v-0c1817fc] { font-size:16px;\n}\n.home-eyebrow[data-v-0c1817fc] { letter-spacing:.7px;\n}\n}\n@media(pointer:coarse) {\n.writing-stage-buttons button[data-v-0c1817fc],.home-inline-button[data-v-0c1817fc],.home-text-link[data-v-0c1817fc],.home-community-link[data-v-0c1817fc] { min-height:44px;\n}\n}\n@media(prefers-reduced-motion:reduce) {\n.home-cta[data-v-0c1817fc],.home-book-cover[data-v-0c1817fc] { transition:none;\n}\n.home-cta[data-v-0c1817fc]:hover,.home-book:hover .home-book-cover[data-v-0c1817fc] { transform:none;\n}\n}\r\n\r\n/* Offset the router hash target so the fixed navigation cannot cover the title. */\n.home-download-anchor[data-v-0c1817fc] { position:relative; top:-80px; height:0; pointer-events:none;\n}\n@media(max-width:720px) {\n.home-download-anchor[data-v-0c1817fc] { top:-170px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 561:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/index.vue?vue&type=template&id=0c1817fc&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "home-container"
  }, [_vm._ssrNode("<section aria-labelledby=\"home-title\" class=\"home-hero\" data-v-0c1817fc>", "</section>", [_vm._ssrNode("<div class=\"home-intro\" data-v-0c1817fc>", "</div>", [_vm._ssrNode("<h1 id=\"home-title\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.hero.titleStart)) + "<br data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.hero.titleSecondLine)) + "<span class=\"title-highlight\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.hero.titleHighlight)) + "</span>" + _vm._ssrEscape(_vm._s(_vm.copy.hero.titleEnd)) + "</h1> <p class=\"home-lead\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.hero.lead)) + "</p> <p class=\"home-description\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.hero.descriptionFirstLine)) + "<br data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.hero.descriptionSecondLine)) + "</p> "), _vm._ssrNode("<div class=\"home-actions\" data-v-0c1817fc>", "</div>", [_c('nuxt-link', {
    staticClass: "home-cta home-cta-primary",
    attrs: {
      "to": "/read"
    }
  }, [_vm._v(_vm._s(_vm.copy.hero.readAction) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("↗")])]), _vm._ssrNode(" "), _c('nuxt-link', {
    staticClass: "home-cta home-cta-secondary",
    attrs: {
      "to": "/write"
    }
  }, [_vm._v(_vm._s(_vm.copy.hero.writeAction) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("↗")])])], 2), _vm._ssrNode(" "), _c('nuxt-link', {
    staticClass: "home-community-link",
    attrs: {
      "to": "/community"
    }
  }, [_vm._v(_vm._s(_vm.copy.hero.communityAction) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("→")])])], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"home-world\" data-v-0c1817fc>", "</div>", [_c('HomeVoxelWorld', {
    attrs: {
      "description": _vm.copy.hero.worldDescription
    }
  }), _vm._ssrNode("<p data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.hero.caption)) + "</p>")], 2)], 2), _vm._ssrNode(" "), _vm._ssrNode("<nav" + _vm._ssrAttr("aria-label", _vm.copy.pathsLabel) + " class=\"home-paths\" data-v-0c1817fc>", "</nav>", _vm._l(_vm.copy.paths, function (item) {
    return _c('nuxt-link', {
      key: item.path,
      attrs: {
        "to": item.path
      }
    }, [_c('span', {
      staticClass: "path-label"
    }, [_vm._v(_vm._s(item.label))]), _c('h2', [_vm._v(_vm._s(item.title))]), _c('p', [_vm._v(_vm._s(item.description))]), _c('span', {
      staticClass: "path-arrow",
      attrs: {
        "aria-hidden": "true"
      }
    }, [_vm._v("↗")])]);
  }), 1), _vm._ssrNode(" "), _vm._ssrNode("<section id=\"home-stories\" aria-labelledby=\"stories-title\" class=\"home-section\" data-v-0c1817fc>", "</section>", [_vm._ssrNode("<header class=\"home-section-heading\" data-v-0c1817fc>", "</header>", [_vm._ssrNode("<div data-v-0c1817fc><p class=\"home-eyebrow\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.stories.eyebrow)) + "</p><h2 id=\"stories-title\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.stories.title)) + "</h2><p class=\"home-description\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.stories.description)) + "</p></div> "), _c('nuxt-link', {
    staticClass: "home-text-link",
    attrs: {
      "to": "/read"
    }
  }, [_vm._v(_vm._s(_vm.copy.stories.browseAction) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("→")])])], 2), _vm._ssrNode(" "), _vm.worksLoading ? _vm._ssrNode("<p role=\"status\" class=\"home-status\" data-v-0c1817fc>", "</p>", [_vm._ssrNode(_vm._ssrEscape(_vm._s(_vm.copy.stories.loading)))], 2) : _vm.works.length ? _vm._ssrNode("<div class=\"home-books\" data-v-0c1817fc>", "</div>", _vm._l(_vm.works, function (work) {
    return _c('nuxt-link', {
      key: work.novel_id,
      staticClass: "home-book",
      attrs: {
        "to": _vm.workUrl(work)
      }
    }, [_c('div', {
      staticClass: "home-book-cover"
    }, [_c('img', {
      attrs: {
        "src": work.picUrl || '/default-book-cover.png',
        "alt": _vm.formatCopy(_vm.copy.stories.coverAlt, {
          name: work.name || _vm.copy.stories.untitled
        }),
        "loading": "lazy",
        "decoding": "async"
      },
      on: {
        "error": _vm.coverError
      }
    }), _c('span', [_vm._v(_vm._s(_vm.workType(work)))])]), _vm._v(" "), _c('h3', [_vm._v(_vm._s(work.name || _vm.copy.stories.untitled))]), _c('p', {
      staticClass: "home-book-author"
    }, [_vm._v(_vm._s(work.author_name))]), _c('p', {
      staticClass: "home-book-description"
    }, [_vm._v(_vm._s(_vm.plainText(work.content) || _vm.copy.stories.descriptionFallback))])]);
  }), 1) : _vm._ssrNode("<div role=\"status\" class=\"home-status\" data-v-0c1817fc><p data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.worksError ? _vm.copy.stories.error : _vm.copy.stories.empty)) + "</p>" + (_vm.worksError ? "<button type=\"button\" class=\"home-inline-button\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.stories.retry)) + "</button>" : "<!---->") + "</div>"), _vm._ssrNode(" "), _vm.collection && _vm.works.length ? _c('nuxt-link', {
    staticClass: "home-source",
    attrs: {
      "to": _vm.collectionUrl(_vm.collection)
    }
  }, [_vm._v(_vm._s(_vm.formatCopy(_vm.copy.stories.source, {
    collection: _vm.collection
  })) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("→")])]) : _vm._e()], 2), _vm._ssrNode(" "), _vm._ssrNode("<section id=\"home-create\" aria-labelledby=\"create-title\" class=\"home-section home-feature home-create\" data-v-0c1817fc>", "</section>", [_vm._ssrNode("<div class=\"home-feature-copy\" data-v-0c1817fc>", "</div>", [_vm._ssrNode("<p class=\"home-eyebrow\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.create.eyebrow)) + "</p><h2 id=\"create-title\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.create.titleFirstLine)) + "<br data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.create.titleSecondLine)) + "</h2><p class=\"home-description\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.create.description)) + "</p><ul class=\"home-writing-steps\" data-v-0c1817fc>" + _vm._ssrList(_vm.copy.create.steps, function (step) {
    return "<li data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(step)) + "</li>";
  }) + "</ul>"), _c('nuxt-link', {
    staticClass: "home-cta home-cta-primary",
    attrs: {
      "to": "/write"
    }
  }, [_vm._v(_vm._s(_vm.copy.create.action) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("↗")])])], 2), _vm._ssrNode(" <div" + _vm._ssrAttr("aria-label", _vm.copy.create.previewLabel) + " class=\"home-writing-preview\" data-v-0c1817fc><div class=\"writing-toolbar\" data-v-0c1817fc><span aria-hidden=\"true\" class=\"writing-dots\" data-v-0c1817fc>● ● ●</span><span data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.create.previewTitle)) + "</span></div> <div role=\"group\"" + _vm._ssrAttr("aria-label", _vm.copy.create.stagesLabel) + " class=\"writing-stage-buttons\" data-v-0c1817fc>" + _vm._ssrList(_vm.copy.create.stages, function (stage, index) {
    return "<button type=\"button\"" + _vm._ssrAttr("aria-pressed", _vm.writingStage === index) + " data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(stage.label)) + "</button>";
  }) + "</div> <div aria-live=\"polite\" class=\"writing-page\" data-v-0c1817fc><p class=\"writing-overline\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.currentStage.eyebrow)) + "</p><h3 data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.currentStage.title)) + "</h3><p data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.currentStage.text)) + "</p><span aria-hidden=\"true\" class=\"writing-rule\" data-v-0c1817fc></span></div> <p class=\"writing-caption\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.create.caption)) + "</p></div>")], 2), _vm._ssrNode(" "), _vm._ssrNode("<section id=\"home-community\" aria-labelledby=\"community-title\"" + _vm._ssrClass("home-section home-feature", {
    'home-community-compact': !_vm.showDiscussions
  }) + " data-v-0c1817fc>", "</section>", [_vm._ssrNode("<div class=\"home-feature-copy\" data-v-0c1817fc>", "</div>", [_vm._ssrNode("<p class=\"home-eyebrow\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.community.eyebrow)) + "</p><h2 id=\"community-title\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.community.titleFirstLine)) + "<br data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.community.titleSecondLine)) + "</h2><p class=\"home-description\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.community.description)) + "</p>"), _c('nuxt-link', {
    staticClass: "home-cta home-cta-secondary",
    attrs: {
      "to": "/community"
    }
  }, [_vm._v(_vm._s(_vm.copy.community.action) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("↗")])])], 2), _vm._ssrNode(" "), _vm.showDiscussions ? _vm._ssrNode("<div class=\"home-discussions\" data-v-0c1817fc>", "</div>", [_vm.postsLoading ? _vm._ssrNode("<p role=\"status\" class=\"home-status\" data-v-0c1817fc>", "</p>", [_vm._ssrNode(_vm._ssrEscape(_vm._s(_vm.copy.community.loading)))], 2) : _vm.posts.length ? [_vm._ssrNode("<p class=\"home-list-label\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.community.listLabel)) + "</p>"), _vm._l(_vm.posts, function (post) {
    return _c('nuxt-link', {
      key: post.post_id,
      staticClass: "home-post",
      attrs: {
        "to": '/community/post/' + post.post_id
      }
    }, [_c('div', {
      staticClass: "home-post-meta"
    }, [_c('span', [_vm._v(_vm._s(post.circle_name || _vm.copy.community.circleFallback))]), post.create_time ? _c('time', {
      attrs: {
        "datetime": post.create_time
      }
    }, [_vm._v(_vm._s(_vm.postDate(post.create_time)))]) : _vm._e()]), _c('h3', [_vm._v(_vm._s(_vm.plainText(post.title, 80) || _vm.copy.community.titleFallback) + " "), _c('span', {
      attrs: {
        "aria-hidden": "true"
      }
    }, [_vm._v("↗")])]), _c('p', [_vm._v(_vm._s(_vm.plainText(post.content, 90)))]), _c('span', {
      staticClass: "home-post-author"
    }, [_vm._v(_vm._s(post.author_name || _vm.copy.community.authorFallback))])]);
  })] : _vm._ssrNode((_vm.copy.community.showIdeas ? "<p class=\"home-list-label\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.community.emptyTitle)) + "</p>" + _vm._ssrList(_vm.copy.community.ideas, function (topic) {
    return "<div class=\"home-topic\" data-v-0c1817fc><span aria-hidden=\"true\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(topic.mark)) + "</span><div data-v-0c1817fc><h3 data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(topic.title)) + "</h3><p data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(topic.text)) + "</p></div></div>";
  }) : "<!---->") + (_vm.postsError ? "<button type=\"button\" class=\"home-inline-button\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.community.retry)) + "</button>" : "<!---->"))], 2) : _vm._e()], 2), _vm._ssrNode(" <div id=\"home-download\" aria-hidden=\"true\" class=\"home-download-anchor\" data-v-0c1817fc></div> "), _vm._ssrNode("<section aria-labelledby=\"download-title\" class=\"home-section home-feature home-download\" data-v-0c1817fc>", "</section>", [_vm._ssrNode("<div class=\"home-feature-copy\" data-v-0c1817fc>", "</div>", [_vm._ssrNode("<p class=\"home-eyebrow\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.download.eyebrow)) + "</p><h2 id=\"download-title\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.download.titleFirstLine)) + "<br data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.download.titleSecondLine)) + "</h2><p class=\"home-description\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.download.description)) + "</p> "), _vm._ssrNode("<div class=\"home-actions\" data-v-0c1817fc>", "</div>", [_vm._ssrNode(_vm.androidDownloadUrl ? "<a" + _vm._ssrAttr("href", _vm.androidDownloadUrl) + " class=\"home-cta home-cta-primary\" data-v-0c1817fc><img src=\"/icon_an.png\" alt width=\"20\" height=\"20\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.download.action) + " ") + "<span aria-hidden=\"true\" data-v-0c1817fc>↗</span></a>" : "<!---->"), _c('nuxt-link', {
    staticClass: "home-text-link",
    attrs: {
      "to": "/read"
    }
  }, [_vm._v(_vm._s(_vm.copy.download.readAction) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("→")])])], 2), _vm._ssrNode(" <p role=\"status\" class=\"home-download-status\" data-v-0c1817fc>" + (_vm.androidDownloadUrl ? _vm._ssrEscape(_vm._s(_vm.copy.download.platform)) + (_vm.androidVersion ? "<span data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.formatCopy(_vm.copy.download.version, {
    version: _vm.androidVersion
  }))) + "</span>" : "<!---->") : _vm.downloadLoading ? _vm._ssrEscape(_vm._s(_vm.copy.download.loading)) : _vm._ssrEscape(_vm._s(_vm.copy.download.error)) + "<button type=\"button\" class=\"home-inline-button\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.download.retry)) + "</button>") + "</p> " + (_vm.showWeixinTip ? "<p role=\"status\" class=\"home-weixin-tip\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.download.weixinTip)) + "</p>" : "<!---->"))], 2), _vm._ssrNode(" <figure class=\"home-mobile-preview\" data-v-0c1817fc><img src=\"/1.png\"" + _vm._ssrAttr("alt", _vm.copy.download.imageAlt) + " loading=\"lazy\" decoding=\"async\" width=\"1594\" height=\"2586\" data-v-0c1817fc>" + (_vm.copy.download.caption ? "<figcaption data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.download.caption)) + "</figcaption>" : "<!---->") + "</figure>")], 2), _vm._ssrNode(" "), _vm._ssrNode("<section id=\"home-open-source\" aria-labelledby=\"open-source-title\" class=\"home-section home-feature home-open-source\" data-v-0c1817fc>", "</section>", [_vm._ssrNode("<div class=\"home-feature-copy\" data-v-0c1817fc>", "</div>", [_vm._ssrNode("<p class=\"home-eyebrow\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.openSource.eyebrow)) + "</p><h2 id=\"open-source-title\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.openSource.titleFirstLine)) + "<br data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.openSource.titleSecondLine)) + "</h2><p class=\"home-description\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.openSource.description)) + "</p>"), _vm._ssrNode("<div class=\"home-actions\" data-v-0c1817fc>", "</div>", [_vm._ssrNode("<a href=\"https://github.com/OpenLogHome\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"home-text-link\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.openSource.githubAction) + " ") + "<span aria-hidden=\"true\" data-v-0c1817fc>↗</span></a>"), _c('nuxt-link', {
    staticClass: "home-text-link",
    attrs: {
      "to": "/about/open-source"
    }
  }, [_vm._v(_vm._s(_vm.copy.openSource.letterAction) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("→")])])], 2)], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"home-contributions\" data-v-0c1817fc>", "</div>", [_vm._ssrNode("<a href=\"https://github.com/OpenLogHome\" target=\"_blank\" rel=\"noopener noreferrer\" data-v-0c1817fc><span data-v-0c1817fc>01</span>" + _vm._ssrEscape(_vm._s(_vm.copy.openSource.codeContribution) + " ") + "<span aria-hidden=\"true\" data-v-0c1817fc>↗</span></a>"), _c('nuxt-link', {
    attrs: {
      "to": "/community"
    }
  }, [_c('span', [_vm._v("02")]), _vm._v(_vm._s(_vm.copy.openSource.feedbackContribution) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("↗")])]), _vm._ssrNode("<p data-v-0c1817fc><span data-v-0c1817fc>03</span>" + _vm._ssrEscape(_vm._s(_vm.copy.openSource.shareContribution)) + "</p><p class=\"home-contribution-note\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.openSource.note)) + "</p>")], 2)], 2), _vm._ssrNode(" " + (_vm.copy.faq.enabled ? "<section aria-labelledby=\"faq-title\" class=\"home-section home-faq\" data-v-0c1817fc><div data-v-0c1817fc><p class=\"home-eyebrow\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.faq.eyebrow)) + "</p><h2 id=\"faq-title\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.faq.title)) + "</h2></div><div data-v-0c1817fc>" + _vm._ssrList(_vm.copy.faq.questions, function (item, index) {
    return "<details" + _vm._ssrAttr("open", index === 0) + " data-v-0c1817fc><summary data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(item.title)) + "<span aria-hidden=\"true\" data-v-0c1817fc>＋</span></summary><p data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(item.answer)) + "</p></details>";
  }) + "</div></section>" : "<!---->") + " "), _vm._ssrNode("<section aria-labelledby=\"ending-title\"" + _vm._ssrClass("home-ending", {
    'home-ending-sign': !_vm.copy.ending.showDetails
  }) + " data-v-0c1817fc>", "</section>", [_vm._ssrNode("<p class=\"home-eyebrow\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.ending.eyebrow)) + "</p><h2 id=\"ending-title\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.ending.title)) + "</h2>" + (_vm.copy.ending.showDetails && _vm.copy.ending.description ? "<p class=\"home-description\" data-v-0c1817fc>" + _vm._ssrEscape(_vm._s(_vm.copy.ending.description)) + "</p>" : "<!---->")), _vm.copy.ending.showDetails ? _vm._ssrNode("<div class=\"home-actions\" data-v-0c1817fc>", "</div>", [_c('nuxt-link', {
    staticClass: "home-cta home-cta-primary",
    attrs: {
      "to": "/read"
    }
  }, [_vm._v(_vm._s(_vm.copy.ending.readAction) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("↗")])]), _c('nuxt-link', {
    staticClass: "home-text-link",
    attrs: {
      "to": "/write"
    }
  }, [_vm._v(_vm._s(_vm.copy.ending.writeAction) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("→")])])], 1) : _vm._e()], 2)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/index.vue?vue&type=template&id=0c1817fc&scoped=true

// EXTERNAL MODULE: ./config/home-copy.json
var home_copy = __webpack_require__(542);

// EXTERNAL MODULE: ./utils/format-copy.js
var format_copy = __webpack_require__(18);

// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__(12);
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/HomeVoxelWorld.vue?vue&type=template&id=3e71fefe&scoped=true
var HomeVoxelWorldvue_type_template_id_3e71fefe_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "voxel-world",
    attrs: {
      "role": "img",
      "aria-label": _vm.description
    }
  }, [_vm._ssrNode("<div class=\"world-canvas\" data-v-3e71fefe></div>")]);
};
var HomeVoxelWorldvue_type_template_id_3e71fefe_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/HomeVoxelWorld.vue?vue&type=template&id=3e71fefe&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/HomeVoxelWorld.vue?vue&type=script&lang=js
/* harmony default export */ var HomeVoxelWorldvue_type_script_lang_js = ({
  props: {
    description: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.destroyed = false;
    this.frame = null;
    this.elapsed = 0;
    this.lastTime = 0;
    this.pointer = {
      x: 0,
      y: 0
    };
    this.inView = true;
    this.contextLost = false;
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.onMotionChange = () => {
      this.resetPointer();
      this.syncPlayback();
    };
    this.motionQuery.addEventListener('change', this.onMotionChange);
    document.addEventListener('visibilitychange', this.syncPlayback);
    if (window.IntersectionObserver) {
      this.visibilityObserver = new IntersectionObserver(entries => {
        this.inView = entries[0].isIntersecting;
        this.syncPlayback();
      }, {
        threshold: 0.05
      });
      this.visibilityObserver.observe(this.$el);
    }
    this.initialize();
  },
  beforeDestroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.frame);
    document.removeEventListener('visibilitychange', this.syncPlayback);
    this.motionQuery.removeEventListener('change', this.onMotionChange);
    if (this.visibilityObserver) this.visibilityObserver.disconnect();
    if (this.resizeObserver) this.resizeObserver.disconnect();
    window.removeEventListener('resize', this.resizeWorld);
    this.disposeWorld();
  },
  methods: {
    async initialize() {
      try {
        const {
          createHomeVoxelScene
        } = await __webpack_require__.e(/* import() */ 74).then(__webpack_require__.bind(null, 551));
        if (this.destroyed) return;
        this.world = createHomeVoxelScene(this.$refs.stage);
        this.world.canvas.addEventListener('webglcontextlost', this.onContextLost);
        this.world.canvas.addEventListener('webglcontextrestored', this.onContextRestored);
        if (window.ResizeObserver) {
          this.resizeObserver = new ResizeObserver(this.resizeWorld);
          this.resizeObserver.observe(this.$refs.stage);
        } else window.addEventListener('resize', this.resizeWorld);
        this.world.tick(0, this.elapsed, this.pointer);
        this.syncPlayback();
      } catch (error) {
        this.disposeWorld();
        // The illustration is decorative; the page remains usable without WebGL.
        if (false) {}
      }
    },
    disposeWorld() {
      if (!this.world) return;
      this.world.canvas.removeEventListener('webglcontextlost', this.onContextLost);
      this.world.canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
      this.world.dispose();
      this.world = null;
    },
    onContextLost(event) {
      event.preventDefault();
      this.contextLost = true;
      this.syncPlayback();
    },
    onContextRestored() {
      this.contextLost = false;
      this.resizeWorld();
      this.syncPlayback();
    },
    resizeWorld() {
      if (!this.world || this.contextLost) return;
      this.world.resize();
      this.world.tick(0, this.elapsed, this.pointer);
    },
    syncPlayback() {
      cancelAnimationFrame(this.frame);
      this.frame = null;
      this.lastTime = 0;
      if (this.world && !this.contextLost && !this.motionQuery.matches && this.inView && !document.hidden && !this.destroyed) {
        this.frame = requestAnimationFrame(this.animate);
      }
    },
    animate(now) {
      const delta = this.lastTime ? Math.min((now - this.lastTime) / 1000, 0.05) : 0;
      this.lastTime = now;
      this.elapsed += delta;
      this.world.tick(delta, this.elapsed, this.pointer);
      this.frame = requestAnimationFrame(this.animate);
    },
    movePointer(event) {
      if (this.motionQuery.matches || event.pointerType === 'touch') return;
      const rect = this.$refs.stage.getBoundingClientRect();
      this.pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      this.pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    },
    resetPointer() {
      this.pointer = {
        x: 0,
        y: 0
      };
    }
  }
});
// CONCATENATED MODULE: ./components/HomeVoxelWorld.vue?vue&type=script&lang=js
 /* harmony default export */ var components_HomeVoxelWorldvue_type_script_lang_js = (HomeVoxelWorldvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/HomeVoxelWorld.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(543)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_HomeVoxelWorldvue_type_script_lang_js,
  HomeVoxelWorldvue_type_template_id_3e71fefe_scoped_true_render,
  HomeVoxelWorldvue_type_template_id_3e71fefe_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "3e71fefe",
  "0ebda6ba"
  
)

/* harmony default export */ var HomeVoxelWorld = (component.exports);
// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(11);

// EXTERNAL MODULE: ./utils/home-landing.js
var home_landing = __webpack_require__(545);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/index.vue?vue&type=script&lang=js







/* harmony default export */ var lib_vue_loader_options_pagesvue_type_script_lang_js = ({
  components: {
    HomeVoxelWorld: HomeVoxelWorld
  },
  head() {
    return {
      title: this.copy.seo.title,
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.copy.seo.description
      }],
      link: [{
        rel: 'canonical',
        href: 'https://loghome.ink/'
      }]
    };
  },
  data() {
    return {
      copy: home_copy,
      works: [],
      collection: '',
      worksLoading: true,
      worksError: false,
      posts: [],
      postsLoading: true,
      postsError: false,
      androidVersion: '',
      androidDownloadUrl: '',
      downloadLoading: true,
      isWeixin: false,
      showWeixinTip: false,
      disposed: false,
      writingStage: 0
    };
  },
  computed: {
    currentStage() {
      return this.copy.create.stages[this.writingStage];
    },
    showDiscussions() {
      return this.postsLoading || this.posts.length > 0 || this.postsError || this.copy.community.showIdeas;
    }
  },
  mounted() {
    this.isWeixin = /micromessenger/i.test(navigator.userAgent);
    this.loadWorks();
    this.loadPosts();
    this.getAppVersion();
  },
  beforeDestroy() {
    this.disposed = true;
  },
  methods: {
    workUrl: reading_discovery["n" /* workUrl */],
    collectionUrl: reading_discovery["e" /* collectionUrl */],
    plainText: home_landing["d" /* plainText */],
    formatCopy: format_copy["a" /* formatCopy */],
    workType(work) {
      return work.novel_type === 'world' ? this.copy.stories.types.world : work.novel_type === 'manga' ? this.copy.stories.types.manga : this.copy.stories.types.novel;
    },
    postDate(value) {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('zh-CN');
    },
    coverError(event) {
      if (!event.target.src.endsWith('/default-book-cover.png')) event.target.src = '/default-book-cover.png';
    },
    async loadWorks() {
      this.worksLoading = true;
      this.worksError = false;
      try {
        const result = await Object(home_landing["c" /* loadLandingWorks */])(this.$api.reading, this.copy.stories.authorFallback);
        if (this.disposed) return;
        this.works = result.works;
        this.collection = result.collection;
        this.worksError = result.error;
      } catch (_) {
        if (!this.disposed) this.worksError = true;
      } finally {
        if (!this.disposed) this.worksLoading = false;
      }
    },
    async loadPosts() {
      this.postsLoading = true;
      this.postsError = false;
      try {
        const result = await Object(reading["b" /* readingRequest */])('/community/posts/recommend', {
          page: 1,
          pageSize: 3,
          sort: 'new'
        });
        if (this.disposed) return;
        if (!result || !Array.isArray(result.list)) throw new Error('Invalid posts response');
        this.posts = Object(home_landing["b" /* landingPosts */])(result);
      } catch (_) {
        if (!this.disposed) this.postsError = true;
      } finally {
        if (!this.disposed) this.postsLoading = false;
      }
    },
    async getAppVersion() {
      this.downloadLoading = true;
      try {
        const {
          data
        } = await external_axios_default.a.get('https://loghomeService.codesocean.top/app/get_app_update', {
          timeout: 12000
        });
        const release = Object(home_landing["a" /* downloadInfo */])(data);
        if (this.disposed) return;
        this.androidDownloadUrl = release ? release.url : '';
        this.androidVersion = release ? release.version : '';
      } catch (_) {
        if (!this.disposed) this.androidDownloadUrl = '';
      } finally {
        if (!this.disposed) this.downloadLoading = false;
      }
    },
    handleAndroidDownload(event) {
      if (this.isWeixin) {
        event.preventDefault();
        this.showWeixinTip = true;
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/index.vue?vue&type=script&lang=js
 /* harmony default export */ var pagesvue_type_script_lang_js = (lib_vue_loader_options_pagesvue_type_script_lang_js); 
// CONCATENATED MODULE: ./pages/index.vue



function pages_injectStyles (context) {
  
  var style0 = __webpack_require__(546)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var pages_component = Object(componentNormalizer["a" /* default */])(
  pagesvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  pages_injectStyles,
  "0c1817fc",
  "aa3a81e8"
  
)

/* harmony default export */ var pages = __webpack_exports__["default"] = (pages_component.exports);

/***/ })

};;
//# sourceMappingURL=index.js.map