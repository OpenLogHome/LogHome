exports.ids = [13];
exports.modules = {

/***/ 122:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/ui/SiteIcon.vue?vue&type=template&id=6a890970&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('svg', {
    staticClass: "site-icon",
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 256 256",
      "fill": "currentColor",
      "aria-hidden": "true",
      "focusable": "false"
    }
  }, [_vm._ssrNode(_vm._ssrList(_vm.paths, function (path, index) {
    return "<path" + _vm._ssrAttr("d", path) + " data-v-6a890970></path>";
  }))]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/ui/SiteIcon.vue?vue&type=template&id=6a890970&scoped=true

// CONCATENATED MODULE: ./assets/icons/phosphor-glyphs.js
// Official Phosphor SVG paths, regular weight (heartFilled uses fill).
// Source: https://github.com/phosphor-icons/core/tree/2b75f3ad12b420c9504ef05df8d2564a28f8500e
// MIT license: ./PHOSPHOR-LICENSE.txt. No runtime downloads.
/* harmony default export */ var phosphor_glyphs = ({
  "heart": ["M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"],
  "heartFilled": ["M240,102c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,228.66,16,172,16,102A62.07,62.07,0,0,1,78,40c20.65,0,38.73,8.88,50,23.89C139.27,48.88,157.35,40,178,40A62.07,62.07,0,0,1,240,102Z"],
  "smiley": ["M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"],
  "image": ["M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"],
  "inbox": ["M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,16V152h-28.7A15.86,15.86,0,0,0,168,156.69L148.69,176H107.31L88,156.69A15.86,15.86,0,0,0,76.69,152H48V48Zm0,160H48V168H76.69L96,187.31A15.86,15.86,0,0,0,107.31,192h41.38A15.86,15.86,0,0,0,160,187.31L179.31,168H208v40Z"],
  "warning": ["M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"],
  "edit": ["M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM136,75.31,152.69,92,68,176.69,51.31,160ZM48,208V179.31L76.69,208Zm48-3.31L79.32,188,164,103.31,180.69,120Zm96-96L147.32,64l24-24L216,84.69Z"],
  "sparkle": ["M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z"],
  "comment": ["M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"]
});
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/ui/SiteIcon.vue?vue&type=script&lang=js

/* harmony default export */ var SiteIconvue_type_script_lang_js = ({
  name: 'SiteIcon',
  props: {
    name: {
      type: String,
      required: true,
      validator: name => Object.prototype.hasOwnProperty.call(phosphor_glyphs, name)
    },
    filled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    paths() {
      return phosphor_glyphs[this.filled && phosphor_glyphs[`${this.name}Filled`] ? `${this.name}Filled` : this.name] || [];
    }
  }
});
// CONCATENATED MODULE: ./components/ui/SiteIcon.vue?vue&type=script&lang=js
 /* harmony default export */ var ui_SiteIconvue_type_script_lang_js = (SiteIconvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/ui/SiteIcon.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(125)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  ui_SiteIconvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "6a890970",
  "1e2053a0"
  
)

/* harmony default export */ var SiteIcon = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(126);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("ca2f1c12", content, true, context)
};

/***/ }),

/***/ 124:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export currentCommentUserId */
/* unused harmony export canModerateComment */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getMangaCommentErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return fetchMangaComments; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return fetchMangaCommentById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return fetchMangaCommentAmount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return fetchMangaArticleCommentAmounts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return publishMangaComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return replyMangaComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return praiseMangaComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return deleteMangaComment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return uploadMangaCommentImage; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);


// 漫画作品与话数在数据模型上就是 novels / articles，评论直接复用社区的书评接口，
// 作品级评论 article_id 传 0、话评传对应的 article_id，paragraph_id 固定 -1（漫画没有划线段落）。
const ROOT_COMMENT = {
  article_id: 0,
  paragraph_id: -1
};

// 评论配图沿用书评的图片容器与服务密钥
const IMAGE_UPLOAD_URL = 'https://storage.codesocean.top/api/resource/upload?container=172018735018984';
const IMAGE_RESOURCE_URL = 'https://storage.codesocean.top/api/resource/get/';
const IMAGE_SERVICE_KEY = 'a24785bedb466b9733dd317771d4b69c08da07fd';
function readStoredSession() {
  let value = null;
  try {
    if (typeof window !== 'undefined') value = window.localStorage.getItem('token');
    if (typeof value === 'string') value = JSON.parse(value);
  } catch (error) {
    return {};
  }
  return value && typeof value === 'object' ? value : {};
}
function authHeaders() {
  const token = readStoredSession().tk;
  if (!token) throw new Error('请先登录后再操作');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}
function optionalAuthHeaders() {
  const token = readStoredSession().tk;
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`
  };
}
function currentCommentUserId() {
  return readStoredSession().id;
}
function canModerateComment(comment) {
  const userId = currentCommentUserId();
  if (!userId) return false;
  return String(comment.userId) === String(userId) || String(comment.workAuthorId) === String(userId);
}
function getMangaCommentErrorMessage(error, fallback = '评论暂时不可用') {
  const data = error && error.response && error.response.data;
  if (data && (data.message || data.msg)) return data.message || data.msg;
  return error && error.message ? error.message : fallback;
}
function parseMediaUrls(value) {
  let parsed = value;
  try {
    if (typeof value === 'string') parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(url => typeof url === 'string' && /^https?:\/\//i.test(url)) : [];
  } catch (error) {
    return [];
  }
}
function formatCommentTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  // 后端以 UTC 序列化，展示时换算为东八区墙上时间，与书评保持一致
  const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const pad = input => String(input).padStart(2, '0');
  return `${beijing.getUTCFullYear()}-${pad(beijing.getUTCMonth() + 1)}-${pad(beijing.getUTCDate())} ${pad(beijing.getUTCHours())}:${pad(beijing.getUTCMinutes())}`;
}
function toReplyViewModel(reply, namesByCommentId, workAuthorId) {
  return {
    commentId: reply.essay_comment_id,
    userId: reply.user_id,
    userName: reply.name,
    targetUserName: namesByCommentId[reply.reply_to_id] || '',
    content: reply.content,
    images: parseMediaUrls(reply.media_urls),
    time: formatCommentTime(reply.comment_time),
    canModerate: canModerateComment({
      userId: reply.user_id,
      workAuthorId
    })
  };
}
function toCommentViewModel(item, praiseTypeMap) {
  const replies = Array.isArray(item.replies) ? item.replies : [];
  const namesByCommentId = {
    [item.essay_comment_id]: item.name
  };
  for (const reply of replies) namesByCommentId[reply.essay_comment_id] = reply.name;
  const praiseType = Object.prototype.hasOwnProperty.call(praiseTypeMap, item.essay_comment_id) ? Number(praiseTypeMap[item.essay_comment_id]) : 3;
  return {
    commentId: item.essay_comment_id,
    userId: item.user_id,
    novelId: item.novel_id,
    userName: item.name,
    avatarUrl: item.avatar_url,
    avatarFrame: item.avatar_frame || null,
    workAuthorId: item.author_id,
    content: item.content,
    images: parseMediaUrls(item.media_urls),
    time: formatCommentTime(item.comment_time),
    likeNum: Math.max(Number(item.likeNum) || 0, praiseType === 0 ? 1 : 0),
    praiseType,
    articleId: Number(item.article_id) || 0,
    paragraphId: item.cento ? Number(item.cento.paragraph_id) || 0 : 0,
    articleTitle: item.article_title || '',
    excerpt: item.cento && item.cento.paragraph ? item.cento.paragraph : '',
    replies: replies.map(reply => toReplyViewModel(reply, namesByCommentId, item.author_id)),
    canModerate: canModerateComment({
      userId: item.user_id,
      workAuthorId: item.author_id
    })
  };
}
async function fetchPraiseTypeMap(baseUrl, commentIds) {
  if (!commentIds.length) return {};
  const headers = optionalAuthHeaders();
  if (!headers) return {};
  try {
    const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/get_comment_praise_statuses`, {
      params: {
        comment_ids: commentIds.join(',')
      },
      headers
    });
    const praiseTypeMap = {};
    for (const item of response.data || []) praiseTypeMap[item.novel_comment_id] = item.type;
    return praiseTypeMap;
  } catch (error) {
    return {};
  }
}
async function fetchMangaComments(baseUrl, options) {
  const {
    novelId,
    articleId,
    paragraphId,
    page = 1,
    pageSize = 10
  } = options;
  const params = {
    id: novelId,
    page,
    pageSize
  };
  if (articleId !== undefined && articleId !== null && articleId !== 0) params.articleId = articleId;
  if (Number(articleId) > 0 && Number(paragraphId) > 0) params.paragraphId = Number(paragraphId);
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/novel_commonts_all_fast`, {
    params
  });
  const rows = Array.isArray(response.data) ? response.data : [];
  const praiseTypeMap = await fetchPraiseTypeMap(baseUrl, rows.map(item => item.essay_comment_id));
  return rows.map(item => toCommentViewModel(item, praiseTypeMap));
}

// A notification may target a root or reply. The server resolves its root and scope.
async function fetchMangaCommentById(baseUrl, commentId) {
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/novel_comment_from_comment_id`, {
    params: {
      comment_id: commentId
    }
  });
  const item = (response.data || [])[0];
  if (!item) return null;
  const replies = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/novel_commonts_reply_to`, {
    params: {
      id: item.essay_comment_id
    }
  }).then(replyResponse => Array.isArray(replyResponse.data) ? replyResponse.data : []);
  item.replies = replies;
  const praiseTypeMap = await fetchPraiseTypeMap(baseUrl, [item.essay_comment_id]);
  return toCommentViewModel(item, praiseTypeMap);
}
async function fetchMangaCommentAmount(baseUrl, novelId, articleId, paragraphId) {
  const params = {
    id: novelId
  };
  if (articleId !== undefined && articleId !== null && articleId !== 0) params.articleId = articleId;
  if (Number(articleId) > 0 && Number(paragraphId) > 0) params.paragraphId = Number(paragraphId);
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/novel_commonts_amount`, {
    params
  });
  const row = (response.data || [])[0] || {};
  return Number(row['COUNT(*)']) || 0;
}

// 目录角标用：一次取回各话评论数，返回 { [article_id]: amount }
async function fetchMangaArticleCommentAmounts(baseUrl, novelId) {
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/novel_articles_comment_amounts`, {
    params: {
      id: novelId
    }
  });
  const amounts = {};
  for (const row of response.data || []) amounts[row.article_id] = Number(row.amount) || 0;
  return amounts;
}
async function publishMangaComment(baseUrl, options) {
  const {
    novelId,
    articleId,
    paragraphId,
    content,
    images = []
  } = options;
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(`${baseUrl}/community/comment_on_novel`, {
    novel_id: novelId,
    content,
    media_urls: images,
    ...(articleId ? {
      article_id: articleId,
      paragraph_id: Number(paragraphId) > 0 ? Number(paragraphId) : -1
    } : ROOT_COMMENT)
  }, {
    headers: authHeaders()
  });
  return toCommentViewModel({
    ...response.data,
    replies: [],
    likeNum: 0
  }, {});
}
async function replyMangaComment(baseUrl, options) {
  const {
    novelId,
    articleId,
    rootCommentId,
    replyToCommentId,
    content,
    images = []
  } = options;
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(`${baseUrl}/community/reply_to_novel_comment`, {
    novel_id: novelId,
    // essay_comment_id 是被回复的那一条，fatherId 是所属的根评论
    essay_comment_id: replyToCommentId,
    fatherId: rootCommentId,
    article_id: articleId || 0,
    content,
    media_urls: images
  }, {
    headers: authHeaders()
  });
  return response.data;
}
async function praiseMangaComment(baseUrl, commentId, type) {
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(`${baseUrl}/community/praise_on_comment`, {
    essay_comment_id: commentId,
    type
  }, {
    headers: authHeaders()
  });
  return response.data;
}
async function deleteMangaComment(baseUrl, commentId) {
  const response = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(`${baseUrl}/community/delete_comment`, {
    params: {
      id: commentId
    },
    headers: authHeaders()
  });
  return response.data;
}

// 浏览器端配图上传：接收 File/Blob，走 FormData，返回可访问的资源 URL
async function uploadMangaCommentImage(file) {
  const form = new FormData();
  form.append('file', file);
  const response = await fetch(IMAGE_UPLOAD_URL, {
    method: 'POST',
    headers: {
      ServiceKey: IMAGE_SERVICE_KEY
    },
    body: form
  });
  if (!response.ok) throw new Error('图片上传失败，请稍后重试');
  const data = await response.json();
  const id = data && data.data && data.data.resource_id;
  if (!id || !/^[a-zA-Z0-9_-]{1,100}$/.test(String(id))) throw new Error('图片上传结果无效，请重试');
  return IMAGE_RESOURCE_URL + id;
}

/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(123);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.site-icon[data-v-6a890970] { display: inline-block; width: 1.125em; height: 1.125em; flex: none; vertical-align: -0.18em;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URLSearchParams) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return readingCommentId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return readingCommentTarget; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return readingMessageTarget; });
function readingCommentId(query = {}) {
  const id = Number(query.preLoadCommentId || query.comment_id || query.commentId);
  return Number.isSafeInteger(id) && id > 0 ? id : 0;
}
function readingCommentTarget(comment, book, anchor) {
  if (!comment || !book || Number(comment.novelId) !== Number(book.novel_id)) return '';
  const suffix = `preLoadCommentId=${Number(anchor) || Number(comment.commentId)}`;
  if (Number(comment.articleId) > 0) {
    if (book.novel_type === 'manga') return `/manga/read/${comment.articleId}?novelId=${book.novel_id}&${suffix}`;
    return `/article/${comment.articleId}?${suffix}${Number(comment.paragraphId) > 0 ? `&paragraphId=${comment.paragraphId}` : ''}`;
  }
  return `/${book.novel_type === 'manga' ? 'manga' : book.novel_type === 'world' ? 'world' : 'novel'}/${book.novel_id}?${suffix}`;
}
function readingMessageTarget(router) {
  const raw = String(router || '').trim();
  if (!raw || /^[a-z][a-z\d+.-]*:|^\/\/|[\\\x00-\x1f]/i.test(raw)) return null;
  const source = raw.replace(/^\/?(?:#\/)?(?:pages\/)?/, '');
  const [path, search = ''] = source.split('?'),
    query = new URLSearchParams(search);
  const id = Number(query.get('id') || query.get('novelId') || query.get('novel_id'));
  const anchor = readingCommentId(Object.fromEntries(query));
  if (/^readers\/(?:bookInfo|bookComment|mangaInfo|mangaReader|bookEnd|bookExcerpts|newReader\/article)$/.test(path)) {
    const workId = /(?:mangaReader|newReader\/article)$/.test(path) ? Number(query.get('novelId') || query.get('novel_id')) : id;
    if (anchor) return {
      path: `/read/comment/${anchor}${Number.isSafeInteger(workId) && workId > 0 ? `?novelId=${workId}` : ''}`
    };
    if (!Number.isSafeInteger(id) || id <= 0) return null;
    if (path === 'readers/newReader/article') return {
      path: `/article/${id}`
    };
    if (path === 'readers/mangaReader') return {
      path: `/manga/read/${id}${Number(query.get('novelId')) > 0 ? `?novelId=${Number(query.get('novelId'))}` : ''}`
    };
    return {
      path: `/${path === 'readers/mangaInfo' ? 'manga' : path === 'readers/bookEnd' ? 'read/end' : 'novel'}/${id}`
    };
  }
  return null;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)["URLSearchParams"]))

/***/ }),

/***/ 128:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return stickerUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return stickerUserId; });
/* unused harmony export readerSticker */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return fetchReaderStickers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return favoriteReaderSticker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return privacyReaderSticker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return deleteReaderSticker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createReaderSticker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return saveImageAsReaderSticker; });
/* harmony import */ var _plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

const ROOT = '/community/stickers';
function stickerUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
  } catch (_) {
    return '';
  }
}
function stickerUserId() {
  try {
    return Number(JSON.parse(localStorage.getItem('token') || '{}').id) || 0;
  } catch (_) {
    return 0;
  }
}
function readerSticker(raw) {
  const id = Number(raw && raw.sticker_id),
    url = stickerUrl(raw && raw.url);
  if (!Number.isSafeInteger(id) || id <= 0 || !url) return null;
  return {
    ...raw,
    sticker_id: id,
    url,
    user_id: Number(raw.user_id) || 0,
    is_private: raw.is_private === true || Number(raw.is_private) === 1,
    is_favorite: raw.is_favorite === true || Number(raw.is_favorite) === 1
  };
}
function checkAccount(token) {
  if (!token) throw new Error('请先登录后使用表情包');
  if (Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])() !== token) throw new Error('账号已变化，请重新操作');
}
async function request(path = '', {
  params = {},
  method = 'GET',
  body
} = {}, token = Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])()) {
  checkAccount(token);
  return Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingRequest */ "b"])(ROOT + path, params, {
    method,
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}
async function fetchReaderStickers({
  favorites = false,
  category = 'all',
  page = 1,
  url
} = {}, token = Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])()) {
  const data = await request(favorites ? '/favorites' : '', {
    params: {
      category: ['all', 'my', 'public', 'logwood'].includes(category) ? category : 'all',
      page,
      limit: 20,
      ...(url ? {
        url
      } : {})
    }
  }, token);
  const items = (Array.isArray(data) ? data : Array.isArray(data.stickers) ? data.stickers : []).map(readerSticker).filter(Boolean);
  const pagination = data.pagination || {};
  return {
    items,
    pages: Math.max(1, Number(pagination.pages) || 1),
    total: Math.max(0, Number(pagination.total) || items.length)
  };
}
const favoriteReaderSticker = (id, favorite, token) => request(favorite ? '/favorites' : `/favorites/${Number(id)}`, {
  method: favorite ? 'POST' : 'DELETE',
  body: favorite ? {
    sticker_id: Number(id)
  } : undefined
}, token);
const privacyReaderSticker = (id, isPrivate, token) => request(`/${Number(id)}`, {
  method: 'PUT',
  body: {
    is_private: !!isPrivate
  }
}, token);
const deleteReaderSticker = (id, token) => request(`/${Number(id)}`, {
  method: 'DELETE'
}, token);
async function createReaderSticker(url, isPrivate = false, token = Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])()) {
  const safe = stickerUrl(url);
  if (!safe) throw new Error('图片地址无效');
  const data = await request('', {
    method: 'POST',
    body: {
      url: safe,
      is_private: !!isPrivate
    }
  }, token);
  const sticker = readerSticker(data);
  if (!sticker) throw new Error('表情包保存结果无效，请刷新确认');
  return sticker;
}
async function saveImageAsReaderSticker(url, token = Object(_plugins_api_reading__WEBPACK_IMPORTED_MODULE_0__[/* readingToken */ "c"])()) {
  const safe = stickerUrl(url);
  if (!safe) throw new Error('图片地址无效');
  const {
    items
  } = await fetchReaderStickers({
    url: safe
  }, token);
  checkAccount(token);
  let sticker = items.find(item => !item.is_private || item.user_id === stickerUserId());
  if (!sticker) sticker = await createReaderSticker(safe, false, token);
  checkAccount(token);
  if (!sticker.is_favorite) {
    try {
      await favoriteReaderSticker(sticker.sticker_id, true, token);
    } catch (error) {
      if (!/已收藏/.test(error.message)) throw error;
    }
  }
  return sticker;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)["URL"]))

/***/ }),

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(144);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("6e3b9593", content, true, context)
};

/***/ }),

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(146);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("12716518", content, true, context)
};

/***/ }),

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(149);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("7e210ac6", content, true, context)
};

/***/ }),

/***/ 133:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(151);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("6efdea43", content, true, context)
};

/***/ }),

/***/ 134:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(153);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("ce121144", content, true, context)
};

/***/ }),

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return loginReturnPath; });
// Login callers may supply a local return route, never an external destination.
function loginReturnPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f]/.test(value)) return '/';
  try {
    const url = new URL(value, 'https://loghome.ink');
    if (url.origin !== 'https://loghome.ink' || url.pathname === '/login') return '/';
    return url.pathname + url.search + url.hash;
  } catch (_) {
    return '/';
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)["URL"]))

/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return worldImage; });
/* unused harmony export worldVocabulary */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return worldGraph; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return filterWorldNodes; });
/* unused harmony export loadWorldVocabularies */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return loadPublicWorld; });
/* harmony import */ var _reader_comment_links__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(127);

function worldImage(value) {
  if (typeof value !== 'string') return '';
  if (/^\/(?!\/)/.test(value) && !/[\\\x00-\x1f]/.test(value)) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
  } catch (_) {
    return '';
  }
}
const text = value => typeof value === 'string' || typeof value === 'number' ? String(value) : '';
function worldVocabulary(article) {
  let raw = article && article.content;
  try {
    if (typeof raw === 'string') raw = JSON.parse(raw);
  } catch (_) {
    raw = null;
  }
  if (!raw || Array.isArray(raw) || typeof raw !== 'object') raw = {};
  return {
    pic: worldImage(raw.pic),
    desc: text(raw.desc),
    attributes: (Array.isArray(raw.attributes) ? raw.attributes : []).filter(item => item && typeof item === 'object').map(item => ({
      name: text(item.name),
      content: text(item.content)
    })),
    relations: (Array.isArray(raw.relations) ? raw.relations : []).filter(item => item && Number.isSafeInteger(Number(item.id)) && Number(item.id) > 0).map(item => ({
      id: Number(item.id),
      name: text(item.name),
      relation: text(item.relation)
    }))
  };
}
function worldGraph(articles = []) {
  const ids = new Set(),
    nodes = [];
  for (const article of articles) {
    const id = Number(article.article_id);
    if (!Number.isSafeInteger(id) || id <= 0 || ids.has(id)) continue;
    ids.add(id);
    const content = worldVocabulary(article);
    nodes.push({
      id,
      title: text(article.title) || '未命名词条',
      ...content,
      loaded: Object.prototype.hasOwnProperty.call(article, 'content')
    });
  }
  const keys = new Set(),
    links = [],
    degrees = new Map(nodes.map(node => [node.id, 0]));
  for (const node of nodes) for (const relation of node.relations) {
    if (!ids.has(relation.id)) continue;
    const key = JSON.stringify([node.id, relation.id, relation.relation]);
    if (keys.has(key)) continue;
    keys.add(key);
    links.push({
      key,
      source: node.id,
      target: relation.id,
      label: relation.relation
    });
    degrees.set(node.id, degrees.get(node.id) + 1);
    if (relation.id !== node.id) degrees.set(relation.id, degrees.get(relation.id) + 1);
  }
  return {
    nodes: nodes.map(node => ({
      ...node,
      degree: degrees.get(node.id)
    })),
    links
  };
}
function filterWorldNodes(nodes, {
  search = '',
  kind = 'all'
} = {}) {
  const query = String(search).trim().toLocaleLowerCase();
  return nodes.filter(node => (kind === 'all' || kind === 'connected' && node.degree > 0 || kind === 'isolated' && node.loaded && node.degree === 0 || kind === 'pictured' && !!node.pic) && (!query || [node.title, node.desc, ...node.attributes.flatMap(a => [a.name, a.content])].join('\n').toLocaleLowerCase().includes(query)));
}
async function loadWorldVocabularies(reader, id, catalog) {
  let details;
  try {
    details = await reader.vocabularies(id);
  } catch (failure) {
    if (failure.status !== 404) throw failure;
    // Older running backends lack the batch endpoint; bounded public requests keep SSR usable.
    details = [];
    for (let offset = 0; offset < catalog.length; offset += 5) {
      const rows = await Promise.all(catalog.slice(offset, offset + 5).map(async word => {
        const result = await reader.article(word.article_id);
        return result && result[0];
      }));
      details.push(...rows);
    }
  }
  if (!Array.isArray(details)) throw new Error('词条数据格式无效');
  return catalog.map(word => {
    const detail = details.find(row => row && Number(row.article_id) === Number(word.article_id) && Number(row.novel_id) === Number(id) && row.article_type === 'worldVocabulary' && Number(row.is_draft) !== 1);
    if (!detail || !Object.prototype.hasOwnProperty.call(detail, 'content')) throw new Error('部分词条资料无法确认，请刷新重试');
    return {
      ...word,
      content: detail.content
    };
  });
}
async function loadPublicWorld({
  params,
  query = {},
  $api,
  error,
  redirect
}, relations = false) {
  const id = Number(params.id);
  if (!Number.isSafeInteger(id) || id <= 0) return error({
    statusCode: 404,
    message: '世界设定不存在'
  });
  try {
    let rows = await $api.reader.world(id);
    if (!Array.isArray(rows) || !rows.length) rows = await $api.reader.world(id, true);
    const info = rows && rows[0];
    if (!info) return error({
      statusCode: 404,
      message: '世界设定不存在'
    });
    const books = await $api.reader.book(info.novel_id),
      book = books && books[0];
    if (!book || book.novel_type !== 'world') return error({
      statusCode: 404,
      message: '世界设定不存在或未公开'
    });
    const world = {
      ...info,
      ...book,
      novel_type: 'world',
      user_name: book.author_name || info.user_name,
      author_id: book.author_id || book.auther_id || info.creator_id
    };
    if (Number(book.novel_id) !== id) {
      const anchor = Object(_reader_comment_links__WEBPACK_IMPORTED_MODULE_0__[/* readingCommentId */ "a"])(query);
      return redirect(301, `/world/${relations ? 'relations/' : ''}${book.novel_id}${anchor ? `?preLoadCommentId=${anchor}` : ''}`);
    }
    const [articles, works] = await Promise.all([$api.reader.chapters(book.novel_id), relations ? Promise.resolve([]) : $api.reader.worldWorks(info.world_id).then(items => ({
      items
    })).catch(() => ({
      items: [],
      error: '关联作品加载失败，请重试'
    }))]);
    const catalog = (articles || []).filter(a => a.article_type === 'worldVocabulary');
    const words = catalog.length ? await loadWorldVocabularies($api.reader, book.novel_id, catalog) : [];
    return {
      world,
      worldOutlines: (articles || []).filter(a => a.article_type === 'worldOutline'),
      worldVocabs: words,
      assoNovels: relations ? [] : Array.isArray(works.items) ? works.items : [],
      associatedError: relations ? '' : works.error || ''
    };
  } catch (failure) {
    var _failure$response;
    return error({
      statusCode: failure.status || ((_failure$response = failure.response) === null || _failure$response === void 0 ? void 0 : _failure$response.status) || 503,
      message: '世界设定暂时无法加载，请稍后重试'
    });
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)["URL"]))

/***/ }),

/***/ 141:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderAvatar.vue?vue&type=template&id=2e738078&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "reader-avatar",
    class: {
      framed: !!_vm.frameSource
    }
  }, [_vm._ssrNode("<span class=\"avatar-visual\"" + _vm._ssrStyle(null, _vm.visualStyle, null) + " data-v-2e738078><img" + _vm._ssrAttr("src", _vm.photoFailed || !_vm.src ? '/avatar-placeholder.svg' : _vm.src) + " alt loading=\"lazy\" class=\"avatar-photo\"" + _vm._ssrStyle(null, _vm.photoStyle, null) + " data-v-2e738078> " + (_vm.frameSource ? "<img" + _vm._ssrAttr("src", _vm.frameSource) + " alt loading=\"lazy\" class=\"avatar-frame\" data-v-2e738078>" : "<!---->") + "</span>")]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderAvatar.vue?vue&type=template&id=2e738078&scoped=true

// EXTERNAL MODULE: ./config/reader/avatar-frame-assets.json
var avatar_frame_assets = __webpack_require__(142);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderAvatar.vue?vue&type=script&lang=js

const bounded = (value, fallback, min, max) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback;
/* harmony default export */ var ReaderAvatarvue_type_script_lang_js = ({
  props: {
    src: {
      type: String,
      default: ''
    },
    frame: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    photoFailed: false,
    frameFailed: false
  }),
  computed: {
    frameSource() {
      if (!this.frame || this.frameFailed) return '';
      let source = this.frame.thumbnail_url || this.frame.asset_url || '';
      if (typeof source !== 'string') return '';
      const legacy = avatar_frame_assets[source.split('?')[0]];
      if (legacy) source = legacy.url;
      return /^https?:\/\//i.test(source) ? source : '';
    },
    visualStyle() {
      return {
        transform: `translate(-50%, -50%) scale(${this.frameSource ? 1.2 : 1})`
      };
    },
    photoStyle() {
      const scale = this.frameSource ? bounded(this.frame.avatar_scale, .58, .35, .9) : 1;
      return {
        width: `${scale * 100}%`,
        height: `${scale * 100}%`,
        left: `${50 + (this.frameSource ? bounded(this.frame.offset_x, 0, -50, 50) : 0)}%`,
        top: `${50 + (this.frameSource ? bounded(this.frame.offset_y, 0, -50, 50) : 0)}%`
      };
    }
  },
  watch: {
    src() {
      this.photoFailed = false;
    },
    frame: {
      deep: true,
      handler() {
        this.frameFailed = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderAvatar.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderAvatarvue_type_script_lang_js = (ReaderAvatarvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderAvatar.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(143)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderAvatarvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "2e738078",
  "33cc230c"
  
)

/* harmony default export */ var ReaderAvatar = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 142:
/***/ (function(module) {

module.exports = JSON.parse("{\"/static/avatar-frames/01.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800369649\",\"sha256\":\"ce59220f4debd13c08bf5fcb29484f21a4f85ac0844c41f38e23d8108ed504ca\"},\"/static/avatar-frames/thumbnails/01.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800483750\",\"sha256\":\"eead1d8d88321ff861e09bc7f1d114574a87f18d9915d12ae88523d28fb152b6\"},\"/static/avatar-frames/02.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800558341\",\"sha256\":\"edefcf69c2b1fdf40de7f229017f5e70c49d058109a52174730cbcbf69fbb2e5\"},\"/static/avatar-frames/thumbnails/02.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800650582\",\"sha256\":\"11d901b50ebd4bb8f79daa992b90eba780b78fc88b283c009c081aa63bdd3387\"},\"/static/avatar-frames/03.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800736493\",\"sha256\":\"c6837726690eb409a4152f647f72e2fca966c2b3168c11503c0f15d35ec99f1c\"},\"/static/avatar-frames/thumbnails/03.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800813294\",\"sha256\":\"ada3a8d02e6737d9aea25f941db84e058be890a0b7ed463bd45acb5a3a9e83a4\"},\"/static/avatar-frames/05.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800890855\",\"sha256\":\"04670e3f3d808c573ee501deb23e0cad453b1a8341669fc9ed2d48ac29c1a335\"},\"/static/avatar-frames/thumbnails/05.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800974676\",\"sha256\":\"db259e2cd0275cbae3449e8295ebba1d2fb8161c987058ed7954d0ea681ea454\"},\"/static/avatar-frames/07.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801045407\",\"sha256\":\"4261daa030658b80254383431e976875acc7c26b4e2a3d85bc9a9142d07252ef\"},\"/static/avatar-frames/thumbnails/07.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801125278\",\"sha256\":\"d287c540d44e961db5fbb1adc21a67f42f663062b0728938defafcf7c2b544dd\"},\"/static/avatar-frames/08.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801195919\",\"sha256\":\"e7b7c658d58aa7e722d402308d78d2c62c8a6ee0d25770cd61ec164acdbb7d99\"},\"/static/avatar-frames/thumbnails/08.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801273850\",\"sha256\":\"ba7e816e430b0ebe79c7ecc3480574cc62549e4f1df21feb3520c3725bdbea67\"},\"/static/avatar-frames/09.gif\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801342821\",\"sha256\":\"bff230fd73b4ba3cb9a885feb4bd7ad9921a330ff6aafd631b6f9fa9a2c8d8b1\"},\"/static/avatar-frames/thumbnails/09.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801689572\",\"sha256\":\"dde24e974b0db48571aaf6169da80f58723ecddf49ca813941de0b2b2e145878\"},\"/static/avatar-frames/10.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801760083\",\"sha256\":\"57fc88b0ea94d5bc911dafdc15d0dfecdbcc3e8f155128ce7e4423e2f8ed6ad0\"},\"/static/avatar-frames/thumbnails/10.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801843074\",\"sha256\":\"96162b1c531adbb5b14166da265841a82449190fd99df08f98829a2d507314fa\"},\"/static/avatar-frames/11.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801917835\",\"sha256\":\"43aed01404240f52c64aa9f396d87077a157800ef77eb29a57ff6c3c75edc33d\"},\"/static/avatar-frames/thumbnails/11.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801994086\",\"sha256\":\"0a460abb68075d1d40f4d1fe3e5cab219cf8b7a65ff6393048d689a4e5ec5971\"},\"/static/avatar-frames/12.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802065877\",\"sha256\":\"b3752dbc232a81a41b94f7d61dbca6ee00c54a1b0dcf8d0d21570c0141dc55ff\"},\"/static/avatar-frames/thumbnails/12.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802154688\",\"sha256\":\"b16c7497dd09c78ef135677a936fb1d2f46047694665245e4c73b673f2adc5f2\"},\"/static/avatar-frames/13.gif\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802227339\",\"sha256\":\"3a80ea21f9ab575c36cacde4d3497b69da6ded402c723c28dce3fe7d5d9df82f\"},\"/static/avatar-frames/thumbnails/13.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802816390\",\"sha256\":\"3f10ddc3641a933a4d7ad8017bc0f4734c1893d465e218c62741cc7e9f5a1844\"},\"/static/avatar-frames/14.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802958281\",\"sha256\":\"d5f49e1f4190b90d5c378808d182c600b63b2c6f325dc461773a08c011fd1344\"},\"/static/avatar-frames/thumbnails/14.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803065782\",\"sha256\":\"a723ff95174b5ecc70cfe8b1c761c41d97052622aa469023df5946f7ec42d6e4\"},\"/static/avatar-frames/15.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803153573\",\"sha256\":\"0e139149eec4905d116837a5c6501b6ff0fef549d5afc7778f05c68bf295df06\"},\"/static/avatar-frames/thumbnails/15.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803248864\",\"sha256\":\"705036da8a756e2b345a406a9f91a96df640dc0811a5a68ad186cbfa69ef26c7\"},\"/static/avatar-frames/16.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803321275\",\"sha256\":\"937ca6efd3303aad5a8463e637d1761e73f908e49b0093efab8c5879cb56626f\"},\"/static/avatar-frames/thumbnails/16.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803395216\",\"sha256\":\"0e6b2b46eacbd14a0c1c55e5280379ee693b265b371616942c4430de90953583\"},\"/static/avatar-frames/17.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803475767\",\"sha256\":\"164e15866f44d50b5a488c5c98ebb4387c314044263a36f2897a90bbc98b4f13\"},\"/static/avatar-frames/thumbnails/17.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803549098\",\"sha256\":\"e57078f04ec6bde991a265858cb7cf8c004fe57fbbc3d3addebfda5a3dcbdb21\"},\"/static/avatar-frames/18.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803620139\",\"sha256\":\"035bf7f5d6fbf8bfde7b1428ad8d50c4742db4b1b1f488692df870512c3b99b9\"},\"/static/avatar-frames/thumbnails/18.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803701720\",\"sha256\":\"eda4633bce44e9b4d796767e8f4fbc6de8757d8201dbe6404d18fac0a7ee8886\"},\"/static/avatar-frames/19.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803770011\",\"sha256\":\"95ff8306f2543e346b6766f96c025b73905a38d7f695c7115babf6dab31f134f\"},\"/static/avatar-frames/thumbnails/19.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803853632\",\"sha256\":\"0ca3bc3e9bef6fa1a804913930e1c971f648bfecf4e6502774d84f26d1791c96\"},\"/static/avatar-frames/20.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803926573\",\"sha256\":\"1835d65a5196a8faf04bddcd5a34ca88afb816900b9b3431467560c7f78e5ce9\"},\"/static/avatar-frames/thumbnails/20.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803999254\",\"sha256\":\"65c8d8e10e9314999357c9005178a1e95447a207a327e39289f225e8642e9eab\"},\"/static/avatar-frames/21.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804069495\",\"sha256\":\"3c0517040d5d0f84f59b8c02806245578e1e49d6da40ecd159bf435d0d64eeaf\"},\"/static/avatar-frames/thumbnails/21.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804145966\",\"sha256\":\"1ebd42a6894db3ccb507e0f564202167aa8598d25db96ca18491faad78e5005a\"},\"/static/avatar-frames/22.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804215297\",\"sha256\":\"ac9a53a0bb2bd441dce582b4c2fffedb73758f4e5c77fb1f59d100c63c6e4a1b\"},\"/static/avatar-frames/thumbnails/22.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804352118\",\"sha256\":\"afac522db0bc6461a77c1688a4bdacbd01a8192d57a123efe0f57afc18f87cc9\"},\"/static/avatar-frames/23.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804427609\",\"sha256\":\"341945ec5d00c2ecfb13e90be18d5fcd724707ab683683551d5e2e0ac9445313\"},\"/static/avatar-frames/thumbnails/23.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804498530\",\"sha256\":\"68ce2759f34de87dc2e83f82f0547937509867069f54904927b5317a2445adca\"},\"/static/avatar-frames/24.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804568651\",\"sha256\":\"863fb9046ad64c1405fd2d7a62fa90ecfa323a6fe6a2c791c08f76232c6d5f62\"},\"/static/avatar-frames/thumbnails/24.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804642472\",\"sha256\":\"4eeaf6dd92715b3362c516876089661e8c6b7f81feb9011062e3a13ab292e815\"},\"/static/avatar-frames/25.gif\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804711343\",\"sha256\":\"c32bd21af603206e394569b4f44b9b5c9e0051a820032352aff1bf02cc4b7054\"},\"/static/avatar-frames/thumbnails/25.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135805709654\",\"sha256\":\"bde48d523eb95c573dfbae88014ffeb56d3826667c502a34d3a7281b976a7362\"},\"/static/avatar-frames/26.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135805785385\",\"sha256\":\"5da0d5e5a9debe7b336c211560c35abb9b165b5b89d17f290fb6fd25522550ca\"},\"/static/avatar-frames/thumbnails/26.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135805862856\",\"sha256\":\"d57c2561d013293c736d576657c51d6cb0100f7f993b7c2a1014a7cadd58ae95\"},\"/static/avatar-frames/28.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135805932527\",\"sha256\":\"437b179375cad3b47ef1d35446330e3241ca9c1d5b135f66ffe45eed0dda107b\"},\"/static/avatar-frames/thumbnails/28.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135806015188\",\"sha256\":\"7ee8c37eca2a8157c035096e4aea2fecadc68bc4f2dd8702cae903b74baf0038\"}}");

/***/ }),

/***/ 143:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAvatar_vue_vue_type_style_index_0_id_2e738078_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(130);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAvatar_vue_vue_type_style_index_0_id_2e738078_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAvatar_vue_vue_type_style_index_0_id_2e738078_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAvatar_vue_vue_type_style_index_0_id_2e738078_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAvatar_vue_vue_type_style_index_0_id_2e738078_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 144:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-avatar[data-v-2e738078] { position: relative; display: block; width: 40px; height: 40px; flex: none; overflow: visible;\n}\n.avatar-visual[data-v-2e738078] { position: absolute; left: 50%; top: 50%; width: 100%; height: 100%; transform-origin: center;\n}\n.avatar-photo[data-v-2e738078] { position: absolute; z-index: 1; display: block; border-radius: 50%; object-fit: cover; background: #eee; transform: translate(-50%, -50%);\n}\n.avatar-frame[data-v-2e738078] { position: absolute; inset: 0; z-index: 2; display: block; width: 100%; height: 100%; object-fit: contain; pointer-events: none;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 145:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentItem_vue_vue_type_style_index_0_id_6495a15b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(131);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentItem_vue_vue_type_style_index_0_id_6495a15b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentItem_vue_vue_type_style_index_0_id_6495a15b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentItem_vue_vue_type_style_index_0_id_6495a15b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentItem_vue_vue_type_style_index_0_id_6495a15b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 146:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.manga-comment-item[data-v-6495a15b] { padding: 16px 0; border-bottom: 1px solid #f0e9e2;\n}\n.manga-comment-item.highlight[data-v-6495a15b] { background: #fff8f2; border-radius: 8px;\n}\n.reply-highlight[data-v-6495a15b] { background:#fff0d9; border-radius:5px; padding:10px !important; outline:1px solid #ebd9b8;\n}.image-entry[data-v-6495a15b]{display:flex;flex-direction:column;gap:4px;align-items:start}.image-save[data-v-6495a15b]{border:0;background:none;font-size:10px;color:#aa9477;cursor:pointer;padding:0}.image-save[data-v-6495a15b]:disabled{opacity:.5}\n.comment-main[data-v-6495a15b] { display: flex; gap: 12px;\n}\n.comment-avatar[data-v-6495a15b] { width: 40px; height: 40px; flex: none;\n}\n.comment-body[data-v-6495a15b] { flex: 1; min-width: 0;\n}\n.comment-head[data-v-6495a15b] { display: flex; align-items: center; gap: 8px; flex-wrap: wrap;\n}\n.comment-author[data-v-6495a15b] { font-size: 14px; font-weight: 600; color: #333; text-decoration: none;\n}\n.comment-author[data-v-6495a15b]:hover,.reply-author[data-v-6495a15b]:hover { color: #947358; text-decoration: underline;\n}.folded-comment[data-v-6495a15b] { color: #999; font-size: 13px; font-style: italic; margin: 8px 0;\n}\n.image-button[data-v-6495a15b] { border: 0; padding: 0; background: transparent; cursor: pointer; border-radius: 6px;\n}.image-button img[data-v-6495a15b] { display: block;\n}.image-button[data-v-6495a15b]:focus-visible { outline: 2px solid #947358; outline-offset: 3px;\n}\n.author-badge[data-v-6495a15b] { font-size: 11px; color: #c14a16; background: #fff1e8; border-radius: 8px; padding: 1px 8px;\n}\n.comment-time[data-v-6495a15b] { font-size: 12px; color: #aaa;\n}\n.comment-excerpt[data-v-6495a15b] { margin-top: 6px; padding: 6px 10px; background: #f7f3ef; border-left: 3px solid #d8c9bd; color: #888; font-size: 13px; border-radius: 0 6px 6px 0;\n}\n.comment-text[data-v-6495a15b] { margin-top: 6px; color: #444; line-height: 1.7; font-size: 14px; white-space: pre-line; word-break: break-word;\n}\n.comment-images[data-v-6495a15b] { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;\n}\n.comment-image[data-v-6495a15b] { width: 96px; height: 96px; object-fit: cover; border-radius: 6px; cursor: pointer;\n}\n.comment-image.small[data-v-6495a15b] { width: 72px; height: 72px;\n}\n.comment-actions[data-v-6495a15b] { display: flex; gap: 18px; margin-top: 10px;\n}\n.act[data-v-6495a15b] { display: inline-flex; align-items: center; gap: 5px; background: none; border: none; color: #999; font-size: 13px; cursor: pointer; padding: 0;\n}\n.act[data-v-6495a15b]:hover { color: #947358;\n}\n.act.liked[data-v-6495a15b] { color: #e0524d;\n}\n.act.danger[data-v-6495a15b]:hover { color: #e0524d;\n}\n.reply-list[data-v-6495a15b] { margin-top: 12px; padding: 10px 14px; background: #faf7f4; border-radius: 8px;\n}\n.reply-item[data-v-6495a15b] { padding: 8px 0;\n}\n.reply-item + .reply-item[data-v-6495a15b] { border-top: 1px solid #f0e9e2;\n}\n.reply-head[data-v-6495a15b] { display: flex; align-items: center; gap: 8px; flex-wrap: wrap;\n}\n.reply-author[data-v-6495a15b] { font-size: 13px; font-weight: 600; color: #555; text-decoration: none;\n}\n.reply-target[data-v-6495a15b] { font-size: 12px; color: #947358;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 147:
/***/ (function(module) {

module.exports = JSON.parse("[\"😀\",\"😃\",\"😄\",\"😁\",\"😆\",\"😅\",\"😂\",\"🤣\",\"😊\",\"😇\",\"🙂\",\"🙃\",\"😉\",\"😌\",\"😍\",\"🥰\",\"😘\",\"😗\",\"😙\",\"😚\",\"😋\",\"😛\",\"😝\",\"😜\",\"🤪\",\"🤨\",\"🧐\",\"🤓\",\"😎\",\"🤩\",\"🥳\",\"😏\",\"😒\",\"😞\",\"😔\",\"😟\",\"😕\",\"🙁\",\"☹️\",\"😣\",\"😖\",\"😫\",\"😩\",\"🥺\",\"😢\",\"😭\",\"😤\",\"😠\",\"😡\",\"🤬\",\"🤯\",\"😳\",\"🥵\",\"🥶\",\"😱\",\"😨\",\"😰\",\"😥\",\"😓\",\"🤗\",\"🤔\",\"🤭\",\"🤫\",\"🤥\",\"😶\",\"😐\",\"😑\",\"😬\",\"🙄\",\"😯\",\"😦\",\"😧\",\"😮\",\"😲\",\"🥱\",\"😴\",\"🤤\",\"😪\",\"😵\",\"🤐\",\"🥴\",\"🤢\",\"🤮\",\"🤧\",\"😷\",\"🤒\",\"🤕\",\"🤑\",\"🤠\",\"😈\",\"👿\",\"👹\",\"👺\",\"🤡\",\"💩\",\"👻\",\"💀\",\"☠️\",\"👽\",\"👾\",\"🤖\",\"🎃\",\"😺\",\"😸\",\"😹\",\"😻\",\"😼\",\"😽\",\"🙀\",\"😿\",\"😾\",\"👋\",\"🤚\",\"🖐\",\"✋\",\"🖖\",\"👌\",\"🤌\",\"🤏\",\"✌️\",\"🤞\",\"🤟\",\"🤘\",\"🤙\",\"👈\",\"👉\",\"👆\",\"🖕\",\"👇\",\"☝️\",\"👍\",\"👎\",\"✊\",\"👊\",\"🤛\",\"🤜\",\"👏\",\"🙌\",\"👐\",\"🤲\",\"🤝\",\"🙏\",\"✍️\",\"💅\",\"🤳\",\"💪\",\"🦾\",\"🦵\",\"🦿\",\"🦶\",\"👣\",\"👂\",\"🦻\",\"👃\",\"🫀\",\"🫁\",\"🧠\",\"🦷\",\"🦴\",\"👀\",\"👁\",\"👅\",\"👄\",\"💋\",\"🩸\",\"🔥\",\"✨\",\"🌟\",\"💫\",\"💬\"]");

/***/ }),

/***/ 148:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(132);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 149:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-emoji-picker[data-v-e43c8880]{display:inline-flex}.emoji-trigger[data-v-e43c8880]{display:inline-flex;align-items:center;gap:5px;background:none;border:0;color:#947358;font:inherit;font-size:13px;cursor:pointer;padding:0}.emoji-trigger[data-v-e43c8880]:disabled{opacity:.5;cursor:default}.emoji-tabs[data-v-e43c8880]{display:flex;gap:8px;border-bottom:1px solid #e8e2d8;padding-bottom:12px;margin-bottom:16px}.emoji-tabs button[data-v-e43c8880],.categories button[data-v-e43c8880],.upload-trigger[data-v-e43c8880]{font:inherit;font-size:13px;border:1px solid #e6ddcf;border-radius:6px;padding:7px 12px;background:#fff;color:#89775e;cursor:pointer}.emoji-tabs button.active[data-v-e43c8880],.categories button.active[data-v-e43c8880]{background:#ecf0df;color:#7a8e50;border-color:#dbe4c6}.emoji-grid[data-v-e43c8880]{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:6px;max-height:420px;overflow:auto}.emoji-grid button[data-v-e43c8880]{border:0;background:#faf8f3;padding:8px 0;border-radius:7px;font-size:25px;cursor:pointer}.emoji-grid button[data-v-e43c8880]:hover{background:#eeeadf}.sticker-toolbar[data-v-e43c8880]{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin-bottom:18px}.categories[data-v-e43c8880]{display:flex;gap:6px;flex-wrap:wrap}.categories button[data-v-e43c8880]{font-size:12px;padding:6px 9px}.sticker-grid[data-v-e43c8880]{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;max-height:440px;overflow:auto;padding:1px}.sticker-card[data-v-e43c8880]{min-width:0}.sticker-image[data-v-e43c8880]{position:relative;display:block;width:100%;aspect-ratio:1;background:#faf8f4;border:1px solid #eee8df;border-radius:8px;padding:6px;cursor:pointer}.sticker-image img[data-v-e43c8880]{width:100%;height:100%;object-fit:contain}.privacy-badge[data-v-e43c8880]{position:absolute;right:4px;bottom:4px;background:#fff9;color:#9c8f7d;border-radius:3px;font-size:10px;padding:2px 4px}.sticker-actions[data-v-e43c8880]{display:flex;gap:7px;align-items:center;justify-content:center;padding:6px 0}.sticker-actions button[data-v-e43c8880]{padding:0;border:0;background:none;font-size:11px;color:#9c8566;cursor:pointer}.sticker-actions .manage[data-v-e43c8880]{font-size:18px;line-height:12px}.empty[data-v-e43c8880]{padding:40px 12px;text-align:center;color:#aa9c89;font-size:13px}.error[data-v-e43c8880]{font-size:13px;line-height:1.8;color:#b45b48;margin:12px 0}.error button[data-v-e43c8880]{border:0;background:none;color:inherit;text-decoration:underline;cursor:pointer}.load-more[data-v-e43c8880]{display:block;margin:18px auto 0;background:none;border:0;color:#8f7657;cursor:pointer}.hint[data-v-e43c8880]{font-size:13px;color:#9e8c75;line-height:1.8}.upload-file[data-v-e43c8880]{display:inline-flex;position:relative;border:1px dashed #d6cab7;padding:16px 25px;cursor:pointer;margin:12px 0}.upload-file input[data-v-e43c8880]{position:absolute;inset:0;width:100%;opacity:0;cursor:pointer}.upload-preview[data-v-e43c8880]{display:block;max-width:180px;max-height:180px;object-fit:contain;margin-bottom:16px}.upload-privacy[data-v-e43c8880]{display:flex;gap:6px;align-items:center;font-size:13px;color:#93816a;margin-top:10px}button[data-v-e43c8880]:focus-visible{outline:2px solid #839455;outline-offset:3px}button[data-v-e43c8880]:disabled{cursor:default;opacity:.5}@media(max-width:600px){.emoji-grid[data-v-e43c8880]{grid-template-columns:repeat(7,minmax(0,1fr))}.sticker-grid[data-v-e43c8880]{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.sticker-actions[data-v-e43c8880]{gap:10px}}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 150:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentComposer_vue_vue_type_style_index_0_id_6cd2cb9a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(133);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentComposer_vue_vue_type_style_index_0_id_6cd2cb9a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentComposer_vue_vue_type_style_index_0_id_6cd2cb9a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentComposer_vue_vue_type_style_index_0_id_6cd2cb9a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentComposer_vue_vue_type_style_index_0_id_6cd2cb9a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.manga-composer[data-v-6cd2cb9a] { border-top: 1px solid #f0e9e2; padding-top: 12px;\n}\n.reply-hint[data-v-6cd2cb9a] { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #947358; margin-bottom: 8px;\n}\n.cancel-reply[data-v-6cd2cb9a] { background: none; border: none; color: #999; cursor: pointer; font-size: 12px;\n}\n.cancel-reply[data-v-6cd2cb9a]:hover { color: #e0524d;\n}\n.composer-input[data-v-6cd2cb9a] { width: 100%; box-sizing: border-box; resize: vertical; border: 1px solid #e6d8cf; border-radius: 8px; padding: 10px 12px; font-size: 14px; color: #333; font-family: inherit; outline: none;\n}\n.composer-input[data-v-6cd2cb9a]:focus { border-color: #947358;\n}\n.composer-images[data-v-6cd2cb9a] { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;\n}\n.upload-item[data-v-6cd2cb9a] { position: relative;\n}\n.upload-preview[data-v-6cd2cb9a] { width: 64px; height: 64px; object-fit: cover; border-radius: 6px;\n}\n.remove-image[data-v-6cd2cb9a] { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border: none; border-radius: 50%; background: rgba(0, 0, 0, 0.6); color: #fff; cursor: pointer; line-height: 1;\n}\n.composer-actions[data-v-6cd2cb9a] { display: flex; align-items: center; gap: 14px; margin-top: 10px;\n}\n.upload-btn[data-v-6cd2cb9a] { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; color: #947358; cursor: pointer; user-select: none;\n}\n.upload-btn.disabled[data-v-6cd2cb9a] { color: #ccc; cursor: not-allowed;\n}\n.counter[data-v-6cd2cb9a] { font-size: 12px; color: #bbb; margin-left: auto;\n}\n.submit-btn[data-v-6cd2cb9a] { background: #947358; border: none; color: #fff; border-radius: 18px; padding: 8px 24px; font-size: 14px; cursor: pointer;\n}\n.submit-btn[data-v-6cd2cb9a]:hover { background: #704c35;\n}\n.submit-btn[data-v-6cd2cb9a]:disabled { opacity: 0.5; cursor: not-allowed;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 152:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentPanel_vue_vue_type_style_index_0_id_24ac5079_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(134);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentPanel_vue_vue_type_style_index_0_id_24ac5079_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentPanel_vue_vue_type_style_index_0_id_24ac5079_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentPanel_vue_vue_type_style_index_0_id_24ac5079_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentPanel_vue_vue_type_style_index_0_id_24ac5079_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.inline-comments[data-v-24ac5079] { border: 1px solid #e9e4dd; border-radius: 12px; background: #fff; overflow: hidden;\n}\n.inline-title[data-v-24ac5079] { margin: 0; padding: 22px 24px 16px; font-size: 18px; color: #453b31;\n}\n.inline-comments .panel-body[data-v-24ac5079] { height: auto;\n}\n.inline-comments .panel-scroll[data-v-24ac5079] { max-height: 640px; min-height: 140px;\n}\n.inline-comments .panel-composer[data-v-24ac5079] { border-top: 1px solid #f0ece6; margin-top: 12px;\n}\n.panel-body[data-v-24ac5079] { display: flex; flex-direction: column; height: 100%; box-sizing: border-box;\n}\n.panel-scroll[data-v-24ac5079] { flex: 1; min-height: 0; overflow-y: auto; padding: 0 20px;\n}\n.empty[data-v-24ac5079] { text-align: center; color: #999; padding: 60px 0;\n}\n.load-more[data-v-24ac5079] { display: block; width: 100%; padding: 14px; background: none; border: none; color: #947358; font-size: 14px; cursor: pointer;\n}\n.load-more[data-v-24ac5079]:disabled { color: #ccc;\n}\n.scope-excerpt[data-v-24ac5079] { color: #8f765f; background: #faf6ef; padding: 14px; border-left: 3px solid #947358; font-size: 13px; line-height: 1.8; white-space: pre-wrap;\n}.load-error[data-v-24ac5079] { color: #ba6755; font-size: 13px; padding: 20px 0;\n}.load-error button[data-v-24ac5079] { color: inherit; border: 0; background: none; cursor: pointer; text-decoration: underline;\n}\n.panel-composer[data-v-24ac5079] { flex: none; padding: 12px 20px 20px;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 154:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaCommentPanel.vue?vue&type=template&id=24ac5079&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c(_vm.inline ? 'section' : 'el-drawer', {
    tag: "component",
    class: {
      'inline-comments': _vm.inline
    },
    attrs: {
      "title": _vm.title,
      "visible": _vm.visible,
      "custom-class": "reading-drawer",
      "direction": "rtl",
      "size": "min(540px, 100%)",
      "wrapper-closable": true
    },
    on: {
      "update:visible": _vm.onVisibleChange,
      "open": _vm.onOpen
    }
  }, [_vm.inline ? _c('h3', {
    staticClass: "inline-title"
  }, [_vm._v(_vm._s(_vm.title))]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "panel-body"
  }, [_c('div', {
    ref: "scroll",
    staticClass: "panel-scroll"
  }, [_vm.paragraphText ? _c('blockquote', {
    staticClass: "scope-excerpt"
  }, [_vm._v(_vm._s(_vm.paragraphText))]) : _vm._e(), _vm._v(" "), _vm.error ? _c('p', {
    staticClass: "load-error",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v(_vm._s(_vm.error) + " "), _c('button', {
    on: {
      "click": function ($event) {
        return _vm.load(_vm.failedPage);
      }
    }
  }, [_vm._v("重试")])]) : _vm._e(), _vm._v(" "), _vm.loading && !_vm.comments.length ? _c('p', {
    staticClass: "empty",
    attrs: {
      "role": "status"
    }
  }, [_vm._v("正在加载评论…")]) : _vm._e(), _vm._v(" "), !_vm.comments.length && !_vm.loading && !_vm.error ? _c('div', {
    staticClass: "empty"
  }, [_vm._v("还没有评论，来抢第一个沙发")]) : _vm._e(), _vm._v(" "), _vm._l(_vm.comments, function (item) {
    return _c('manga-comment-item', {
      key: item.commentId,
      attrs: {
        "comment": item,
        "data-comment-id": item.commentId,
        "highlight": String(item.commentId) === String(_vm.anchorId),
        "anchor-id": _vm.anchorId,
        "work-author-id": _vm.workAuthorId
      },
      on: {
        "reply": _vm.setReplyTarget,
        "praise": _vm.togglePraise,
        "remove": _vm.removeComment,
        "remove-reply": _vm.removeReply
      }
    });
  }), _vm._v(" "), _vm.hasMore ? _c('button', {
    staticClass: "load-more",
    attrs: {
      "disabled": _vm.loading
    },
    on: {
      "click": _vm.loadMore
    }
  }, [_vm._v("\n        " + _vm._s(_vm.loading ? '加载中…' : '加载更多') + "\n      ")]) : _vm._e()], 2), _vm._v(" "), _c('div', {
    staticClass: "panel-composer"
  }, [_c('manga-comment-composer', {
    ref: "composer",
    attrs: {
      "reply-to": _vm.replyTarget,
      "submitting": _vm.submitting
    },
    on: {
      "submit": _vm.submit,
      "cancel-reply": function ($event) {
        _vm.replyTarget = null;
      }
    }
  })], 1)])]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/manga/MangaCommentPanel.vue?vue&type=template&id=24ac5079&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaCommentItem.vue?vue&type=template&id=6495a15b&scoped=true
var MangaCommentItemvue_type_template_id_6495a15b_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "manga-comment-item",
    class: {
      highlight: _vm.highlight
    }
  }, [_vm._ssrNode("<div class=\"comment-main\" data-v-6495a15b>", "</div>", [_c('nuxt-link', {
    staticClass: "comment-avatar",
    attrs: {
      "to": `/users/${_vm.comment.userId}`,
      "aria-label": `查看 ${_vm.comment.userName || '读者'} 的主页`
    }
  }, [_c('ReaderAvatar', {
    attrs: {
      "src": _vm.comment.avatarUrl || '',
      "frame": _vm.comment.avatarFrame
    }
  })], 1), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"comment-body\" data-v-6495a15b>", "</div>", [_vm._ssrNode("<div class=\"comment-head\" data-v-6495a15b>", "</div>", [_c('nuxt-link', {
    staticClass: "comment-author",
    attrs: {
      "to": `/users/${_vm.comment.userId}`
    }
  }, [_vm._v(_vm._s(_vm.comment.userName || '匿名'))]), _vm._ssrNode(" " + (_vm.isWorkAuthor ? "<span class=\"author-badge\" data-v-6495a15b>作者</span>" : "<!---->") + " <span class=\"comment-time\" data-v-6495a15b>" + _vm._ssrEscape(_vm._s(_vm.comment.time)) + "</span>")], 2), _vm._ssrNode(" " + (_vm.isFolded ? "<p class=\"folded-comment\" data-v-6495a15b>该评论已被收起</p>" : "<!---->") + " " + (!_vm.isFolded && _vm.comment.excerpt ? "<div class=\"comment-excerpt\" data-v-6495a15b>" + _vm._ssrEscape("「" + _vm._s(_vm.comment.excerpt) + "」") + "</div>" : "<!---->") + " " + (!_vm.isFolded ? "<div class=\"comment-text\" data-v-6495a15b>" + _vm._ssrEscape(_vm._s(_vm.comment.content)) + "</div>" : "<!---->") + " " + (!_vm.isFolded && _vm.comment.images && _vm.comment.images.length ? "<div class=\"comment-images\" data-v-6495a15b>" + _vm._ssrList(_vm.comment.images, function (img, i) {
    return "<div class=\"image-entry\" data-v-6495a15b><button" + _vm._ssrAttr("aria-label", `查看配图 ${i + 1}`) + " class=\"image-button\" data-v-6495a15b><img" + _vm._ssrAttr("src", img) + " alt=\"评论配图\" loading=\"lazy\" class=\"comment-image\" data-v-6495a15b></button><button" + _vm._ssrAttr("disabled", !!_vm.savingSticker[img]) + " class=\"image-save\" data-v-6495a15b>" + _vm._ssrEscape(_vm._s(_vm.savingSticker[img] ? '收藏中…' : '收藏为表情包')) + "</button></div>";
  }) + "</div>" : "<!---->") + " "), _vm._ssrNode("<div class=\"comment-actions\" data-v-6495a15b>", "</div>", [_vm._ssrNode("<button" + _vm._ssrAttr("aria-pressed", _vm.comment.praiseType === 0) + _vm._ssrAttr("aria-label", `${_vm.comment.praiseType === 0 ? '取消点赞评论' : '点赞评论'}，${_vm.comment.likeNum || 0} 个赞`) + _vm._ssrClass("act", {
    liked: _vm.comment.praiseType === 0
  }) + " data-v-6495a15b>", "</button>", [_c('SiteIcon', {
    attrs: {
      "name": "heart",
      "filled": _vm.comment.praiseType === 0
    }
  }), _vm._ssrNode(" <span data-v-6495a15b>" + _vm._ssrEscape(_vm._s(_vm.comment.likeNum || 0)) + "</span>")], 2), _vm._ssrNode(" <button class=\"act\" data-v-6495a15b>\n          回复\n        </button> " + (_vm.comment.canModerate ? "<button class=\"act danger\" data-v-6495a15b>删除</button>" : "<!---->"))], 2), _vm._ssrNode(" "), _vm.comment.replies && _vm.comment.replies.length ? _vm._ssrNode("<div class=\"reply-list\" data-v-6495a15b>", "</div>", _vm._l(_vm.comment.replies, function (reply) {
    return _vm._ssrNode("<div" + _vm._ssrAttr("data-comment-id", reply.commentId) + _vm._ssrClass("reply-item", {
      'reply-highlight': String(reply.commentId) === String(_vm.anchorId)
    }) + " data-v-6495a15b>", "</div>", [_vm._ssrNode("<div class=\"reply-head\" data-v-6495a15b>", "</div>", [_c('nuxt-link', {
      staticClass: "reply-author",
      attrs: {
        "to": `/users/${reply.userId}`
      }
    }, [_vm._v(_vm._s(reply.userName || '匿名'))]), _vm._ssrNode(" " + (reply.targetUserName ? "<span class=\"reply-target\" data-v-6495a15b>" + _vm._ssrEscape("回复 " + _vm._s(reply.targetUserName)) + "</span>" : "<!---->") + " <span class=\"comment-time\" data-v-6495a15b>" + _vm._ssrEscape(_vm._s(reply.time)) + "</span>")], 2), _vm._ssrNode(" <div class=\"comment-text\" data-v-6495a15b>" + _vm._ssrEscape(_vm._s(reply.content)) + "</div> " + (reply.images && reply.images.length ? "<div class=\"comment-images\" data-v-6495a15b>" + _vm._ssrList(reply.images, function (img, i) {
      return "<div class=\"image-entry\" data-v-6495a15b><button" + _vm._ssrAttr("aria-label", `查看回复配图 ${i + 1}`) + " class=\"image-button\" data-v-6495a15b><img" + _vm._ssrAttr("src", img) + " alt=\"回复配图\" loading=\"lazy\" class=\"comment-image small\" data-v-6495a15b></button><button" + _vm._ssrAttr("disabled", !!_vm.savingSticker[img]) + " class=\"image-save\" data-v-6495a15b>收藏为表情包</button></div>";
    }) + "</div>" : "<!---->") + " <div class=\"comment-actions\" data-v-6495a15b><button class=\"act\" data-v-6495a15b>回复</button> " + (reply.canModerate ? "<button class=\"act danger\" data-v-6495a15b>删除</button>" : "<!---->") + "</div>")], 2);
  }), 0) : _vm._e()], 2)], 2)]);
};
var MangaCommentItemvue_type_template_id_6495a15b_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/manga/MangaCommentItem.vue?vue&type=template&id=6495a15b&scoped=true

// EXTERNAL MODULE: ./components/ui/SiteIcon.vue + 5 modules
var SiteIcon = __webpack_require__(122);

// EXTERNAL MODULE: ./components/read/ReaderAvatar.vue + 4 modules
var ReaderAvatar = __webpack_require__(141);

// EXTERNAL MODULE: ./utils/reader-stickers.js
var reader_stickers = __webpack_require__(128);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaCommentItem.vue?vue&type=script&lang=js




/* harmony default export */ var MangaCommentItemvue_type_script_lang_js = ({
  name: 'MangaCommentItem',
  components: {
    SiteIcon: SiteIcon["a" /* default */],
    ReaderAvatar: ReaderAvatar["a" /* default */]
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    highlight: {
      type: Boolean,
      default: false
    },
    anchorId: {
      type: [String, Number],
      default: 0
    },
    workAuthorId: {
      type: [String, Number],
      default: null
    }
  },
  data: () => ({
    savingSticker: {},
    stickerVersion: 0
  }),
  beforeDestroy() {
    this.stickerVersion++;
  },
  computed: {
    isFolded() {
      return Number(this.comment.praiseType) === 1;
    },
    isWorkAuthor() {
      return this.workAuthorId != null && String(this.comment.userId) === String(this.workAuthorId);
    }
  },
  methods: {
    async saveSticker(url) {
      const token = Object(reading["c" /* readingToken */])(),
        version = this.stickerVersion;
      if (!token) {
        this.$message.info('登录后可以收藏评论配图为表情包');
        return;
      }
      if (this.savingSticker[url]) return;
      this.$set(this.savingSticker, url, true);
      try {
        await Object(reader_stickers["f" /* saveImageAsReaderSticker */])(url, token);
        if (version === this.stickerVersion && token === Object(reading["c" /* readingToken */])()) this.$message.success('已添加到表情包收藏');
      } catch (error) {
        if (version === this.stickerVersion && token === Object(reading["c" /* readingToken */])()) this.$message.error(error.message || '表情包收藏失败，请重试');
      } finally {
        if (version === this.stickerVersion) this.$set(this.savingSticker, url, false);
      }
    },
    preview(images, index) {
      if (this.$preview) this.$preview(images, index);else window.open(images[index], '_blank');
    }
  }
});
// CONCATENATED MODULE: ./components/manga/MangaCommentItem.vue?vue&type=script&lang=js
 /* harmony default export */ var manga_MangaCommentItemvue_type_script_lang_js = (MangaCommentItemvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/manga/MangaCommentItem.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(145)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  manga_MangaCommentItemvue_type_script_lang_js,
  MangaCommentItemvue_type_template_id_6495a15b_scoped_true_render,
  MangaCommentItemvue_type_template_id_6495a15b_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "6495a15b",
  "5a32505e"
  
)

/* harmony default export */ var MangaCommentItem = (component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaCommentComposer.vue?vue&type=template&id=6cd2cb9a&scoped=true
var MangaCommentComposervue_type_template_id_6cd2cb9a_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "manga-composer"
  }, [_vm._ssrNode((_vm.replyTo ? "<div class=\"reply-hint\" data-v-6cd2cb9a>" + _vm._ssrEscape("\n    回复 @" + _vm._s(_vm.replyTo.targetUserName || '') + "\n    ") + "<button class=\"cancel-reply\" data-v-6cd2cb9a>取消</button></div>" : "<!---->") + " <div class=\"composer-row\" data-v-6cd2cb9a><textarea" + _vm._ssrAttr("placeholder", _vm.replyTo ? '写下你的回复…' : '发条友善的评论…') + " maxlength=\"300\" rows=\"3\" class=\"composer-input\" data-v-6cd2cb9a>" + _vm._ssrEscape(_vm._s(_vm.content)) + "</textarea></div> " + (_vm.images.length ? "<div class=\"composer-images\" data-v-6cd2cb9a>" + _vm._ssrList(_vm.images, function (img, i) {
    return "<div class=\"upload-item\" data-v-6cd2cb9a><img" + _vm._ssrAttr("src", img) + " class=\"upload-preview\" data-v-6cd2cb9a> <button class=\"remove-image\" data-v-6cd2cb9a>×</button></div>";
  }) + "</div>" : "<!---->") + " "), _vm._ssrNode("<div class=\"composer-actions\" data-v-6cd2cb9a>", "</div>", [_c('ReaderEmojiPicker', {
    attrs: {
      "disabled": _vm.submitting || _vm.uploading
    },
    on: {
      "select": _vm.appendEmoji
    }
  }), _vm._ssrNode(" "), _vm._ssrNode("<label" + _vm._ssrClass("upload-btn", {
    disabled: _vm.uploading
  }) + " data-v-6cd2cb9a>", "</label>", [_vm._ssrNode("<input type=\"file\" accept=\"image/*\" multiple=\"multiple\" hidden=\"hidden\"" + _vm._ssrAttr("disabled", _vm.uploading || _vm.images.length >= 3) + " data-v-6cd2cb9a> "), _c('SiteIcon', {
    attrs: {
      "name": "image"
    }
  }), _vm._ssrNode(" <span data-v-6cd2cb9a>" + _vm._ssrEscape(_vm._s(_vm.uploading ? '上传中…' : '图片')) + "</span>")], 2), _vm._ssrNode(" <span class=\"counter\" data-v-6cd2cb9a>" + _vm._ssrEscape(_vm._s(_vm.content.length) + "/300") + "</span> <button" + _vm._ssrAttr("disabled", _vm.submitting || !_vm.content.trim() || _vm.uploading) + " class=\"submit-btn\" data-v-6cd2cb9a>" + _vm._ssrEscape("\n      " + _vm._s(_vm.submitting ? '发送中…' : '发送') + "\n    ") + "</button>")], 2)], 2);
};
var MangaCommentComposervue_type_template_id_6cd2cb9a_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/manga/MangaCommentComposer.vue?vue&type=template&id=6cd2cb9a&scoped=true

// EXTERNAL MODULE: ./common/manga-comment-api.js
var manga_comment_api = __webpack_require__(124);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderEmojiPicker.vue?vue&type=template&id=e43c8880&scoped=true
var ReaderEmojiPickervue_type_template_id_e43c8880_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "reader-emoji-picker"
  }, [_vm._ssrNode("<button type=\"button\"" + _vm._ssrAttr("disabled", _vm.disabled) + " class=\"emoji-trigger\" data-v-e43c8880>", "</button>", [_c('SiteIcon', {
    attrs: {
      "name": "smiley"
    }
  }), _vm._ssrNode(" <span data-v-e43c8880>表情</span>")], 2), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "title": "表情与表情包",
      "visible": _vm.visible,
      "width": "min(690px, 94vw)",
      "append-to-body": ""
    },
    on: {
      "update:visible": function ($event) {
        _vm.visible = $event;
      }
    }
  }, [_c('div', {
    staticClass: "emoji-tabs",
    attrs: {
      "role": "tablist",
      "aria-label": "表情类型"
    }
  }, _vm._l(_vm.tabs, function (item) {
    return _c('button', {
      key: item.id,
      class: {
        active: _vm.tab === item.id
      },
      attrs: {
        "role": "tab",
        "aria-selected": _vm.tab === item.id
      },
      on: {
        "click": function ($event) {
          return _vm.changeTab(item.id);
        }
      }
    }, [_vm._v(_vm._s(item.label))]);
  }), 0), _vm._v(" "), _vm.tab === 'emoji' ? _c('div', {
    staticClass: "emoji-grid"
  }, _vm._l(_vm.emojis, function (emoji) {
    return _c('button', {
      key: emoji,
      attrs: {
        "aria-label": `插入 ${emoji}`
      },
      on: {
        "click": function ($event) {
          return _vm.selectEmoji(emoji);
        }
      }
    }, [_vm._v(_vm._s(emoji))]);
  }), 0) : _c('div', [_c('div', {
    staticClass: "sticker-toolbar"
  }, [_vm.tab === 'sticker' ? _c('div', {
    staticClass: "categories",
    attrs: {
      "aria-label": "表情包分类"
    }
  }, _vm._l(_vm.categories, function (item) {
    return _c('button', {
      key: item.id,
      class: {
        active: _vm.category === item.id
      },
      attrs: {
        "aria-pressed": _vm.category === item.id
      },
      on: {
        "click": function ($event) {
          return _vm.changeCategory(item.id);
        }
      }
    }, [_vm._v(_vm._s(item.label))]);
  }), 0) : _vm._e(), _c('button', {
    staticClass: "upload-trigger",
    attrs: {
      "disabled": !_vm.account
    },
    on: {
      "click": _vm.openUpload
    }
  }, [_vm._v("＋ 上传表情包")])]), _vm._v(" "), !_vm.account ? _c('p', {
    staticClass: "empty"
  }, [_vm._v("登录后可以选择和收藏表情包。")]) : _vm.loading && !_vm.items.length ? _c('p', {
    staticClass: "empty",
    attrs: {
      "role": "status"
    }
  }, [_vm._v("正在加载表情包…")]) : !_vm.items.length && !_vm.error ? _c('p', {
    staticClass: "empty"
  }, [_vm._v(_vm._s(_vm.tab === 'favorite' ? '暂无收藏，可在表情包卡片上选择收藏。' : '这个分类还没有表情包。'))]) : _vm._e(), _vm._v(" "), _vm.error ? _c('p', {
    staticClass: "error",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v(_vm._s(_vm.error) + " "), _c('button', {
    on: {
      "click": function ($event) {
        return _vm.load(_vm.failedPage);
      }
    }
  }, [_vm._v("重试")])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "sticker-grid"
  }, _vm._l(_vm.items, function (item) {
    return _c('article', {
      key: item.sticker_id,
      staticClass: "sticker-card"
    }, [_c('button', {
      staticClass: "sticker-image",
      attrs: {
        "aria-label": `插入表情包 ${item.sticker_id}`
      },
      on: {
        "click": function ($event) {
          return _vm.selectSticker(item);
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.url,
        "alt": "表情包",
        "loading": "lazy"
      }
    }), item.is_private ? _c('span', {
      staticClass: "privacy-badge"
    }, [_vm._v("私密")]) : _vm._e()]), _vm._v(" "), _c('div', {
      staticClass: "sticker-actions"
    }, [_c('button', {
      attrs: {
        "disabled": !!_vm.pending[item.sticker_id]
      },
      on: {
        "click": function ($event) {
          return _vm.favorite(item);
        }
      }
    }, [_vm._v(_vm._s(item.is_favorite ? '已收藏' : '收藏'))]), _c('button', {
      attrs: {
        "disabled": !!_vm.pending[item.sticker_id]
      },
      on: {
        "click": function ($event) {
          return _vm.preview(item);
        }
      }
    }, [_vm._v("预览")]), _vm.isOwner(item) ? _c('el-dropdown', {
      attrs: {
        "trigger": "click"
      },
      on: {
        "command": function ($event) {
          return _vm.command($event, item);
        }
      }
    }, [_c('button', {
      staticClass: "manage",
      attrs: {
        "disabled": !!_vm.pending[item.sticker_id],
        "aria-label": `管理表情包 ${item.sticker_id}`
      }
    }, [_vm._v("⋯")]), _c('el-dropdown-menu', {
      attrs: {
        "slot": "dropdown"
      },
      slot: "dropdown"
    }, [_c('el-dropdown-item', {
      attrs: {
        "command": 'privacy'
      }
    }, [_vm._v(_vm._s(item.is_private ? '设为公开' : '设为私密'))]), _c('el-dropdown-item', {
      attrs: {
        "command": "delete"
      }
    }, [_vm._v("删除表情包")])], 1)], 1) : _vm._e()], 1)]);
  }), 0), _vm._v(" "), _vm.page < _vm.pages && _vm.account ? _c('button', {
    staticClass: "load-more",
    attrs: {
      "disabled": _vm.loading
    },
    on: {
      "click": function ($event) {
        return _vm.load(_vm.page + 1);
      }
    }
  }, [_vm._v(_vm._s(_vm.loading ? '加载中…' : '加载更多'))]) : _vm._e()])]), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "title": "上传表情包",
      "visible": _vm.uploadVisible,
      "width": "min(460px, 94vw)",
      "append-to-body": ""
    },
    on: {
      "update:visible": function ($event) {
        _vm.uploadVisible = $event;
      }
    }
  }, [_c('p', {
    staticClass: "hint"
  }, [_vm._v("上传后可以在评论中使用。公开表情包会出现在其他读者的表情列表中。")]), _vm._v(" "), _c('label', {
    staticClass: "upload-file"
  }, [_c('input', {
    attrs: {
      "type": "file",
      "accept": "image/*",
      "disabled": _vm.uploading || _vm.saving
    },
    on: {
      "change": _vm.chooseFile
    }
  }), _vm._v(_vm._s(_vm.uploading ? '图片上传中…' : '选择图片'))]), _vm._v(" "), _vm.uploadUrl ? _c('img', {
    staticClass: "upload-preview",
    attrs: {
      "src": _vm.uploadUrl,
      "alt": "待保存的表情包"
    }
  }) : _vm._e(), _vm._v(" "), _c('label', {
    staticClass: "upload-privacy"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.isPrivate,
      expression: "isPrivate"
    }],
    attrs: {
      "type": "checkbox",
      "disabled": _vm.saving
    },
    domProps: {
      "checked": Array.isArray(_vm.isPrivate) ? _vm._i(_vm.isPrivate, null) > -1 : _vm.isPrivate
    },
    on: {
      "change": function ($event) {
        var $$a = _vm.isPrivate,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.isPrivate = $$a.concat([$$v]));
          } else {
            $$i > -1 && (_vm.isPrivate = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.isPrivate = $$c;
        }
      }
    }
  }), _vm._v(" 仅自己可见")]), _vm.uploadError ? _c('p', {
    staticClass: "error",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v(_vm._s(_vm.uploadError))]) : _vm._e(), _vm._v(" "), _c('span', {
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "disabled": _vm.saving
    },
    on: {
      "click": function ($event) {
        _vm.uploadVisible = false;
      }
    }
  }, [_vm._v("取消")]), _c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.saving,
      "disabled": !_vm.uploadUrl || _vm.uploading
    },
    on: {
      "click": _vm.saveUpload
    }
  }, [_vm._v("保存表情包")])], 1)])], 2);
};
var ReaderEmojiPickervue_type_template_id_e43c8880_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderEmojiPicker.vue?vue&type=template&id=e43c8880&scoped=true

// EXTERNAL MODULE: ./config/reader/emojis.json
var emojis = __webpack_require__(147);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderEmojiPicker.vue?vue&type=script&lang=js





/* harmony default export */ var ReaderEmojiPickervue_type_script_lang_js = ({
  components: {
    SiteIcon: SiteIcon["a" /* default */]
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    visible: false,
    tab: 'emoji',
    category: 'all',
    emojis: emojis,
    items: [],
    account: null,
    page: 0,
    pages: 1,
    failedPage: 1,
    loading: false,
    error: '',
    version: 0,
    pending: {},
    uploadVisible: false,
    uploadUrl: '',
    uploadError: '',
    uploading: false,
    saving: false,
    isPrivate: false,
    uploadVersion: 0,
    tabs: [{
      id: 'emoji',
      label: 'Emoji'
    }, {
      id: 'sticker',
      label: '表情包'
    }, {
      id: 'favorite',
      label: '收藏'
    }],
    categories: [{
      id: 'all',
      label: '全部'
    }, {
      id: 'my',
      label: '我上传的'
    }, {
      id: 'public',
      label: '公开'
    }, {
      id: 'logwood',
      label: '原木娘专属'
    }]
  }),
  watch: {
    visible(value) {
      if (!value) this.close();
    },
    uploadVisible(value) {
      if (!value) this.resetUpload();
    }
  },
  mounted() {
    window.addEventListener('storage', this.checkAccount);
    window.addEventListener('focus', this.checkAccount);
  },
  beforeDestroy() {
    this.version++;
    this.uploadVersion++;
    window.removeEventListener('storage', this.checkAccount);
    window.removeEventListener('focus', this.checkAccount);
  },
  methods: {
    isOwner(item) {
      return item.user_id > 0 && item.user_id === Object(reader_stickers["h" /* stickerUserId */])();
    },
    checkAccount() {
      if (Object(reading["c" /* readingToken */])() !== this.account) {
        this.version++;
        this.account = Object(reading["c" /* readingToken */])();
        this.items = [];
        this.page = 0;
        this.pages = 1;
        this.loading = false;
        this.pending = {};
        this.error = '';
        this.uploadVisible = false;
        this.resetUpload();
        if (this.visible && this.tab !== 'emoji' && this.account) this.load(1);
      }
    },
    open() {
      if (this.disabled) return;
      this.checkAccount();
      this.visible = true;
      if (this.tab !== 'emoji' && this.account) this.load(1);
    },
    close() {
      this.version++;
      this.loading = false;
      this.uploadVisible = false;
      this.resetUpload();
    },
    changeTab(tab) {
      this.tab = tab;
      this.version++;
      this.items = [];
      this.page = 0;
      this.pages = 1;
      this.error = '';
      this.loading = false;
      if (tab !== 'emoji' && this.account) this.load(1);
    },
    changeCategory(category) {
      this.category = category;
      this.version++;
      this.items = [];
      this.page = 0;
      this.pages = 1;
      this.error = '';
      this.loading = false;
      if (this.account) this.load(1);
    },
    async load(page = 1) {
      this.checkAccount();
      if (!this.account || this.tab === 'emoji' || this.loading) return;
      const version = ++this.version,
        token = this.account;
      this.loading = true;
      this.error = '';
      this.failedPage = page;
      try {
        const result = await Object(reader_stickers["d" /* fetchReaderStickers */])({
          favorites: this.tab === 'favorite',
          category: this.category,
          page
        }, token);
        if (version !== this.version || token !== Object(reading["c" /* readingToken */])()) return;
        const items = page === 1 ? result.items : this.items.concat(result.items);
        this.items = items.filter((item, i) => items.findIndex(row => row.sticker_id === item.sticker_id) === i);
        this.page = page;
        this.pages = result.pages;
      } catch (error) {
        if (version === this.version && token === Object(reading["c" /* readingToken */])()) this.error = error.message;
      } finally {
        if (version === this.version) this.loading = false;
      }
    },
    selectEmoji(content) {
      if (this.disabled) return;
      this.$emit('select', {
        type: 'emoji',
        content
      });
      this.visible = false;
    },
    selectSticker(item) {
      this.checkAccount();
      if (!this.account || this.disabled || !this.items.some(row => row.sticker_id === item.sticker_id)) return;
      this.$emit('select', {
        type: 'sticker',
        content: item.url,
        sticker_id: item.sticker_id
      });
      this.visible = false;
    },
    preview(item) {
      if (this.$preview) this.$preview([item.url], 0);
    },
    async favorite(item) {
      this.checkAccount();
      if (!this.account || this.pending[item.sticker_id]) return;
      const token = this.account,
        version = this.version;
      this.$set(this.pending, item.sticker_id, true);
      try {
        await Object(reader_stickers["c" /* favoriteReaderSticker */])(item.sticker_id, !item.is_favorite, token);
        if (token !== Object(reading["c" /* readingToken */])() || version !== this.version) return;
        item.is_favorite = !item.is_favorite;
        if (this.tab === 'favorite' && !item.is_favorite) this.items = this.items.filter(row => row.sticker_id !== item.sticker_id);
      } catch (error) {
        if (token === Object(reading["c" /* readingToken */])() && version === this.version) this.error = error.message;
      } finally {
        if (token === this.account) this.$set(this.pending, item.sticker_id, false);
      }
    },
    async command(command, item) {
      this.checkAccount();
      if (!this.account || !this.isOwner(item) || this.pending[item.sticker_id]) return;
      const token = this.account,
        version = this.version;
      const message = command === 'delete' ? '删除此表情包及其收藏记录？' : item.is_private ? '设为公开后，其他读者可以查看、收藏和使用这个表情包。' : '设为私密后，仅你可以查看这个表情包。';
      try {
        await this.$confirm(message, '表情包管理', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        });
      } catch (_) {
        return;
      }
      if (token !== Object(reading["c" /* readingToken */])() || version !== this.version) return;
      this.$set(this.pending, item.sticker_id, true);
      try {
        if (command === 'delete') await Object(reader_stickers["b" /* deleteReaderSticker */])(item.sticker_id, token);else await Object(reader_stickers["e" /* privacyReaderSticker */])(item.sticker_id, !item.is_private, token);
        if (token !== Object(reading["c" /* readingToken */])() || version !== this.version) return;
        this.$message.success(command === 'delete' ? '表情包已删除' : '可见范围已更新');
        this.loading = false;
        await this.load(1);
      } catch (error) {
        if (token === Object(reading["c" /* readingToken */])() && version === this.version) this.error = error.message;
      } finally {
        if (token === Object(reading["c" /* readingToken */])()) this.$set(this.pending, item.sticker_id, false);
      }
    },
    resetUpload() {
      this.uploadVersion++;
      this.uploadUrl = '';
      this.uploadError = '';
      this.uploading = false;
      this.saving = false;
      this.isPrivate = false;
    },
    openUpload() {
      this.checkAccount();
      if (!this.account) return;
      this.resetUpload();
      this.uploadVisible = true;
    },
    async chooseFile(event) {
      const file = (event.target.files || [])[0];
      event.target.value = '';
      if (!file || this.uploading || this.saving) return;
      this.checkAccount();
      if (!this.account) return;
      const token = this.account,
        version = ++this.uploadVersion;
      this.uploading = true;
      this.uploadError = '';
      this.uploadUrl = '';
      try {
        if (!/^image\//.test(file.type) || file.size > 10 * 1024 * 1024) throw new Error('请选择 10MB 以内的图片');
        const url = await Object(manga_comment_api["j" /* uploadMangaCommentImage */])(file);
        if (version === this.uploadVersion && token === Object(reading["c" /* readingToken */])()) this.uploadUrl = url;
      } catch (error) {
        if (version === this.uploadVersion && token === Object(reading["c" /* readingToken */])()) this.uploadError = error.message;
      } finally {
        if (version === this.uploadVersion) this.uploading = false;
      }
    },
    async saveUpload() {
      this.checkAccount();
      if (!this.account || !this.uploadUrl || this.uploading || this.saving) return;
      const token = this.account,
        version = this.uploadVersion;
      this.saving = true;
      this.uploadError = '';
      try {
        await Object(reader_stickers["a" /* createReaderSticker */])(this.uploadUrl, this.isPrivate, token);
        if (version !== this.uploadVersion || token !== Object(reading["c" /* readingToken */])()) return;
        this.$message.success('表情包已保存');
        this.uploadVisible = false;
        if (this.tab !== 'emoji') await this.load(1);
      } catch (error) {
        if (version === this.uploadVersion && token === Object(reading["c" /* readingToken */])()) this.uploadError = error.message;
      } finally {
        if (version === this.uploadVersion) this.saving = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderEmojiPicker.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderEmojiPickervue_type_script_lang_js = (ReaderEmojiPickervue_type_script_lang_js); 
// CONCATENATED MODULE: ./components/read/ReaderEmojiPicker.vue



function ReaderEmojiPicker_injectStyles (context) {
  
  var style0 = __webpack_require__(148)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var ReaderEmojiPicker_component = Object(componentNormalizer["a" /* default */])(
  read_ReaderEmojiPickervue_type_script_lang_js,
  ReaderEmojiPickervue_type_template_id_e43c8880_scoped_true_render,
  ReaderEmojiPickervue_type_template_id_e43c8880_scoped_true_staticRenderFns,
  false,
  ReaderEmojiPicker_injectStyles,
  "e43c8880",
  "6e6fa0ba"
  
)

/* harmony default export */ var ReaderEmojiPicker = (ReaderEmojiPicker_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaCommentComposer.vue?vue&type=script&lang=js





/* harmony default export */ var MangaCommentComposervue_type_script_lang_js = ({
  name: 'MangaCommentComposer',
  components: {
    SiteIcon: SiteIcon["a" /* default */],
    ReaderEmojiPicker: ReaderEmojiPicker
  },
  props: {
    replyTo: {
      type: Object,
      default: null
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: '',
      images: [],
      uploading: false,
      uploadVersion: 0
    };
  },
  beforeDestroy() {
    this.uploadVersion++;
  },
  methods: {
    appendEmoji(data) {
      if (this.submitting || this.uploading || !data) return;
      if (data.type === 'sticker') {
        const url = Object(reader_stickers["g" /* stickerUrl */])(data.content);
        if (!Object(reading["c" /* readingToken */])()) {
          this.$message.info('请先登录后使用表情包');
          return;
        }
        if (this.images.length >= 3) {
          this.$message.info('最多添加 3 张配图或表情包');
          return;
        }
        if (url) this.images.push(url);
        return;
      }
      const input = this.$refs.input,
        start = input ? input.selectionStart : this.content.length,
        end = input ? input.selectionEnd : start;
      const text = String(data.content || ''),
        value = this.content.slice(0, start) + text + this.content.slice(end);
      if (value.length > 300) {
        this.$message.info('评论最多 300 字');
        return;
      }
      this.content = value;
      this.$nextTick(() => {
        if (input) {
          input.focus();
          input.setSelectionRange(start + text.length, start + text.length);
        }
      });
    },
    async onPickFiles(e) {
      const files = Array.from(e.target.files || []);
      e.target.value = '';
      if (!files.length || this.uploading || this.submitting) return;
      if (!Object(reading["c" /* readingToken */])()) {
        this.$message.info('请先登录后再上传评论配图');
        return;
      }
      const version = ++this.uploadVersion,
        account = Object(reading["c" /* readingToken */])();
      this.uploading = true;
      try {
        for (const file of files) {
          if (this.images.length >= 3 || version !== this.uploadVersion || account !== Object(reading["c" /* readingToken */])()) break;
          const url = await Object(manga_comment_api["j" /* uploadMangaCommentImage */])(file);
          if (version !== this.uploadVersion || account !== Object(reading["c" /* readingToken */])()) return;
          this.images.push(url);
        }
      } catch (err) {
        if (version === this.uploadVersion && account === Object(reading["c" /* readingToken */])()) this.$message.error('图片上传失败，请稍后重试');
      } finally {
        if (version === this.uploadVersion) this.uploading = false;
      }
    },
    removeImage(i) {
      this.images.splice(i, 1);
    },
    submit() {
      if (!this.content.trim() || this.content.length > 300 || this.submitting || this.uploading) return;
      this.$emit('submit', {
        content: this.content.trim(),
        images: this.images.slice()
      });
    },
    reset() {
      this.uploadVersion++;
      this.uploading = false;
      this.content = '';
      this.images = [];
    },
    focus() {
      this.$nextTick(() => {
        if (this.$refs.input) this.$refs.input.focus();
      });
    }
  }
});
// CONCATENATED MODULE: ./components/manga/MangaCommentComposer.vue?vue&type=script&lang=js
 /* harmony default export */ var manga_MangaCommentComposervue_type_script_lang_js = (MangaCommentComposervue_type_script_lang_js); 
// CONCATENATED MODULE: ./components/manga/MangaCommentComposer.vue



function MangaCommentComposer_injectStyles (context) {
  
  var style0 = __webpack_require__(150)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var MangaCommentComposer_component = Object(componentNormalizer["a" /* default */])(
  manga_MangaCommentComposervue_type_script_lang_js,
  MangaCommentComposervue_type_template_id_6cd2cb9a_scoped_true_render,
  MangaCommentComposervue_type_template_id_6cd2cb9a_scoped_true_staticRenderFns,
  false,
  MangaCommentComposer_injectStyles,
  "6cd2cb9a",
  "4d28766b"
  
)

/* harmony default export */ var MangaCommentComposer = (MangaCommentComposer_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaCommentPanel.vue?vue&type=script&lang=js




const PAGE_SIZE = 10;
/* harmony default export */ var MangaCommentPanelvue_type_script_lang_js = ({
  name: 'MangaCommentPanel',
  components: {
    MangaCommentItem: MangaCommentItem,
    MangaCommentComposer: MangaCommentComposer
  },
  props: {
    inline: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    novelId: {
      type: [String, Number],
      required: true
    },
    // 0 表示作品级评论，>0 表示具体话的评论
    articleId: {
      type: [String, Number],
      default: 0
    },
    paragraphId: {
      type: [String, Number],
      default: 0
    },
    paragraphText: {
      type: String,
      default: ''
    },
    scopeTitle: {
      type: String,
      default: ''
    },
    anchorId: {
      type: [String, Number],
      default: 0
    },
    workAuthorId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      comments: [],
      page: 1,
      hasMore: false,
      loading: false,
      submitting: false,
      replyTarget: null,
      amount: 0,
      version: 0,
      failedPage: 1,
      error: '',
      praisePending: {},
      loadedScope: ''
    };
  },
  computed: {
    title() {
      const scope = this.scopeTitle || (Number(this.paragraphId) > 0 ? '段落评论' : Number(this.articleId) > 0 ? '章节评论' : '作品评论');
      return this.amount ? `${scope} · ${this.amount} 条` : scope;
    }
  },
  watch: {
    novelId() {
      this.resetScope();
    },
    articleId() {
      this.resetScope();
    },
    paragraphId() {
      this.resetScope();
    },
    anchorId() {
      if (this.visible) this.onOpen();
    }
  },
  mounted() {
    if (this.visible) this.onOpen();
    window.addEventListener('focus', this.checkAccount);
    window.addEventListener('storage', this.checkAccount);
  },
  beforeDestroy() {
    this.version++;
    window.removeEventListener('focus', this.checkAccount);
    window.removeEventListener('storage', this.checkAccount);
  },
  methods: {
    checkAccount() {
      if (this.scopeKey() !== this.loadedScope) this.resetScope();
    },
    scopeKey() {
      return `${this.novelId}:${this.articleId}:${this.paragraphId}:${Object(reading["c" /* readingToken */])() || 'guest'}`;
    },
    resetScope() {
      this.version++;
      this.comments = [];
      this.amount = 0;
      this.page = 1;
      this.hasMore = false;
      this.loading = false;
      this.replyTarget = null;
      this.error = '';
      if (this.$refs.composer) this.$refs.composer.reset();
      if (this.visible) this.onOpen();
    },
    onVisibleChange(val) {
      this.$emit('update:visible', val);
    },
    async onOpen() {
      const scope = this.scopeKey();
      if (scope !== this.loadedScope) {
        this.comments = [];
        this.amount = 0;
        if (this.$refs.composer) this.$refs.composer.reset();
        this.loadedScope = scope;
      }
      this.replyTarget = null;
      await Promise.all([this.loadAmount(), this.load(1)]);
    },
    requireLogin() {
      try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token && token.tk) return true;
      } catch (e) {}
      this.$message.info('请先登录');
      return false;
    },
    async load(page = 1) {
      const version = ++this.version,
        scope = this.scopeKey();
      this.loading = true;
      this.error = '';
      this.failedPage = page;
      try {
        const list = await Object(manga_comment_api["e" /* fetchMangaComments */])("https://api.loghome.ink", {
          novelId: this.novelId,
          articleId: Number(this.articleId) || 0,
          paragraphId: Number(this.paragraphId) || 0,
          page,
          pageSize: PAGE_SIZE
        });
        if (version !== this.version || scope !== this.scopeKey()) return;
        const combined = page === 1 ? list : this.comments.concat(list);
        this.comments = combined.filter((item, index) => combined.findIndex(row => String(row.commentId) === String(item.commentId)) === index);
        this.hasMore = list.length === PAGE_SIZE;
        this.page = page;
        if (page === 1 && Number(this.anchorId) > 0) {
          if (!this.comments.some(row => String(row.commentId) === String(this.anchorId) || (row.replies || []).some(reply => String(reply.commentId) === String(this.anchorId)))) {
            const target = await Object(manga_comment_api["d" /* fetchMangaCommentById */])("https://api.loghome.ink", this.anchorId);
            if (version !== this.version || scope !== this.scopeKey()) return;
            if (target && String(target.novelId) === String(this.novelId) && (!Number(this.articleId) || Number(target.articleId) === Number(this.articleId)) && (!Number(this.paragraphId) || Number(target.paragraphId) === Number(this.paragraphId))) {
              const index = this.comments.findIndex(row => String(row.commentId) === String(target.commentId));
              if (index === -1) this.comments.unshift(target);else this.$set(this.comments, index, target);
            }
          }
          this.$nextTick(() => {
            if (version !== this.version || scope !== this.scopeKey()) return;
            const target = this.$refs.scroll && this.$refs.scroll.querySelector(`[data-comment-id="${Number(this.anchorId)}"]`);
            if (target) target.scrollIntoView({
              block: 'nearest'
            });
          });
        }
      } catch (e) {
        if (version === this.version && scope === this.scopeKey()) this.error = Object(manga_comment_api["f" /* getMangaCommentErrorMessage */])(e, '评论加载失败，请重试');
      } finally {
        if (version === this.version) this.loading = false;
      }
    },
    async loadAmount() {
      const scope = this.scopeKey();
      try {
        const amount = await Object(manga_comment_api["c" /* fetchMangaCommentAmount */])("https://api.loghome.ink", this.novelId, Number(this.articleId) || undefined, Number(this.paragraphId) || undefined);
        if (scope === this.scopeKey()) this.amount = amount;
      } catch (e) {/* The list request presents its own retry state. */}
    },
    loadMore() {
      if (this.loading) return;
      this.load(this.page + 1);
    },
    setReplyTarget(target) {
      if (!this.requireLogin()) return;
      this.replyTarget = target;
      if (this.$refs.composer) this.$refs.composer.focus();
    },
    async submit(payload) {
      if (!this.requireLogin() || this.submitting) return;
      const scope = this.scopeKey();
      this.submitting = true;
      try {
        if (this.replyTarget) {
          await Object(manga_comment_api["i" /* replyMangaComment */])("https://api.loghome.ink", {
            novelId: this.novelId,
            articleId: Number(this.articleId) || 0,
            rootCommentId: this.replyTarget.rootCommentId,
            replyToCommentId: this.replyTarget.replyToCommentId,
            content: payload.content,
            images: payload.images
          });
        } else {
          await Object(manga_comment_api["h" /* publishMangaComment */])("https://api.loghome.ink", {
            novelId: this.novelId,
            articleId: Number(this.articleId) || 0,
            paragraphId: Number(this.paragraphId) || 0,
            content: payload.content,
            images: payload.images
          });
        }
        if (scope !== this.scopeKey()) return;
        this.$refs.composer.reset();
        this.replyTarget = null;
        this.$message.success('发表成功');
        await Promise.all([this.load(1), this.loadAmount()]);
        this.$emit('changed');
      } catch (e) {
        if (scope === this.scopeKey()) this.$message.error(Object(manga_comment_api["f" /* getMangaCommentErrorMessage */])(e, '评论发送失败，请稍后重试'));
      } finally {
        this.submitting = false;
      }
    },
    async togglePraise(comment) {
      if (!this.requireLogin() || this.praisePending[comment.commentId]) return;
      this.$set(this.praisePending, comment.commentId, true);
      const scope = this.scopeKey();
      const type = comment.praiseType === 0 ? 3 : 0;
      const previous = comment.praiseType;
      try {
        await Object(manga_comment_api["g" /* praiseMangaComment */])("https://api.loghome.ink", comment.commentId, type);
        if (scope !== this.scopeKey()) return;
        comment.praiseType = type;
        comment.likeNum = Math.max(0, (Number(comment.likeNum) || 0) + (previous === 0 ? -1 : 1));
      } catch (e) {
        if (scope === this.scopeKey()) this.$message.error(Object(manga_comment_api["f" /* getMangaCommentErrorMessage */])(e, '操作失败，请稍后重试'));
      } finally {
        this.$set(this.praisePending, comment.commentId, false);
      }
    },
    removeComment(comment) {
      const scope = this.scopeKey();
      this.$confirm('确定删除这条评论吗？', '删除评论', {
        type: 'warning'
      }).then(async () => {
        try {
          if (scope !== this.scopeKey()) return;
          await Object(manga_comment_api["a" /* deleteMangaComment */])("https://api.loghome.ink", comment.commentId);
          if (scope !== this.scopeKey()) return;
          this.comments = this.comments.filter(item => item.commentId !== comment.commentId);
          this.amount = Math.max(0, this.amount - 1);
          this.$message.success('已删除');
          this.$emit('changed');
        } catch (e) {
          this.$message.error(Object(manga_comment_api["f" /* getMangaCommentErrorMessage */])(e, '删除失败，请稍后重试'));
        }
      }).catch(() => {});
    },
    removeReply({
      rootCommentId,
      reply
    }) {
      const scope = this.scopeKey();
      this.$confirm('确定删除这条回复吗？', '删除回复', {
        type: 'warning'
      }).then(async () => {
        try {
          if (scope !== this.scopeKey()) return;
          await Object(manga_comment_api["a" /* deleteMangaComment */])("https://api.loghome.ink", reply.commentId);
          if (scope !== this.scopeKey()) return;
          const root = this.comments.find(item => item.commentId === rootCommentId);
          if (root) root.replies = root.replies.filter(item => item.commentId !== reply.commentId);
          this.$message.success('已删除');
          this.$emit('changed');
        } catch (e) {
          this.$message.error(Object(manga_comment_api["f" /* getMangaCommentErrorMessage */])(e, '删除失败，请稍后重试'));
        }
      }).catch(() => {});
    }
  }
});
// CONCATENATED MODULE: ./components/manga/MangaCommentPanel.vue?vue&type=script&lang=js
 /* harmony default export */ var manga_MangaCommentPanelvue_type_script_lang_js = (MangaCommentPanelvue_type_script_lang_js); 
// CONCATENATED MODULE: ./components/manga/MangaCommentPanel.vue



function MangaCommentPanel_injectStyles (context) {
  
  var style0 = __webpack_require__(152)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var MangaCommentPanel_component = Object(componentNormalizer["a" /* default */])(
  manga_MangaCommentPanelvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  MangaCommentPanel_injectStyles,
  "24ac5079",
  "15fabcc9"
  
)

/* harmony default export */ var MangaCommentPanel = __webpack_exports__["a"] = (MangaCommentPanel_component.exports);

/***/ }),

/***/ 168:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return mangaPages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return mangaPageSource; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return readMangaPreferences; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return saveMangaPreferences; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return loadPublicManga; });
/* harmony import */ var _reader_world__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(138);

function mangaPages(content) {
  let parsed = content;
  if (typeof content === 'string') {
    try {
      parsed = JSON.parse(content);
    } catch (_) {
      return [];
    }
  }
  if (!parsed || !Array.isArray(parsed.pages)) return [];
  // Preserve page indices even when an asset is malformed: danmus/progress use these indices.
  return parsed.pages.map(value => {
    const page = value && typeof value === 'object' ? value : {
      url: value
    };
    const dimension = v => Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : 0;
    return {
      ...page,
      url: Object(_reader_world__WEBPACK_IMPORTED_MODULE_0__[/* worldImage */ "d"])(page.url),
      readingUrl: Object(_reader_world__WEBPACK_IMPORTED_MODULE_0__[/* worldImage */ "d"])(page.readingUrl || page.reader_url || page.reading_url),
      thumb: Object(_reader_world__WEBPACK_IMPORTED_MODULE_0__[/* worldImage */ "d"])(page.thumb),
      width: dimension(page.width),
      height: dimension(page.height)
    };
  });
}
function mangaPageSource(page, quality = 'standard', retry = 0) {
  if (!page) return '';
  const source = quality === 'original' ? page.url : page.readingUrl || page.url;
  if (!source || !retry) return source || '';
  const url = new URL(source, 'https://loghome.ink');
  url.searchParams.set('mret', String(retry));
  return source.startsWith('/') ? url.pathname + url.search + url.hash : url.href;
}
function readMangaPreferences(storage) {
  let value;
  try {
    value = JSON.parse(storage.getItem('MangaReaderSettings'));
  } catch (_) {}
  value = value && typeof value === 'object' ? value : {};
  return {
    mode: ['strip', 'paged'].includes(value.mode) ? value.mode : null,
    direction: value.direction === 'rtl' ? 'rtl' : 'ltr',
    background: ['white', 'warm', 'black'].includes(value.background) ? value.background : 'white',
    quality: value.quality === 'original' ? 'original' : 'standard',
    danmu: value.danmu !== false
  };
}
function saveMangaPreferences(storage, value) {
  try {
    storage.setItem('MangaReaderSettings', JSON.stringify(value));
    return true;
  } catch (_) {
    return false;
  }
}
async function loadPublicManga({
  params,
  query = {},
  $api,
  error,
  redirect
}) {
  const id = Number(params.articleId);
  if (!Number.isSafeInteger(id) || id <= 0) return error({
    statusCode: 404,
    message: '章节不存在或不可阅读'
  });
  try {
    const response = await $api.reader.article(id),
      articleData = response && response[0];
    if (!articleData || Number(articleData.article_id) !== id || Number(articleData.is_draft) === 1) return error({
      statusCode: 404,
      message: '章节不存在或不可阅读'
    });
    if (!['mangaPage', 'mangaStrip'].includes(articleData.article_type)) return redirect(`/article/${id}`);
    if (query.novelId && Number(query.novelId) !== Number(articleData.novel_id)) return error({
      statusCode: 404,
      message: '话数不属于当前作品'
    });
    const [books, catalog] = await Promise.all([$api.reader.book(articleData.novel_id), $api.reader.chapters(articleData.novel_id)]),
      workInfo = books && books[0];
    if (!workInfo || workInfo.novel_type !== 'manga' || Number(workInfo.novel_id) !== Number(articleData.novel_id)) return error({
      statusCode: 404,
      message: '漫画不存在或不可阅读'
    });
    const pages = mangaPages(articleData.content),
      articles = (catalog || []).filter(a => ['mangaPage', 'mangaStrip'].includes(a.article_type) && Number(a.is_draft) !== 1),
      currentIdx = articles.findIndex(a => Number(a.article_id) === id);
    if (currentIdx < 0) return error({
      statusCode: 404,
      message: '话数不在公开目录中'
    });
    return {
      articleId: id,
      articleData,
      novelId: articleData.novel_id,
      workInfo,
      novelName: workInfo.name,
      workAuthorId: workInfo.author_id || workInfo.auther_id,
      articles,
      currentIdx,
      pages,
      currentPage: query.edge === 'end' ? Math.max(0, pages.length - 1) : Math.min(Math.max(0, Math.floor(Number(query.pageIdx) || 0)), Math.max(0, pages.length - 1)),
      ...( true ? {
        mode: articleData.article_type === 'mangaPage' ? 'paged' : 'strip'
      } : undefined),
      loading: false,
      loadError: pages.length ? '' : '本话暂无可阅读页面',
      ssrReady: true
    };
  } catch (failure) {
    var _failure$response;
    return error({
      statusCode: failure.status || ((_failure$response = failure.response) === null || _failure$response === void 0 ? void 0 : _failure$response.status) || 503,
      message: '漫画暂时无法加载，请稍后重试'
    });
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)["URL"]))

/***/ }),

/***/ 169:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(201);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("3ab6a2e4", content, true, context)
};

/***/ }),

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaReaderImage_vue_vue_type_style_index_0_id_13417fc8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(169);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaReaderImage_vue_vue_type_style_index_0_id_13417fc8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaReaderImage_vue_vue_type_style_index_0_id_13417fc8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaReaderImage_vue_vue_type_style_index_0_id_13417fc8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaReaderImage_vue_vue_type_style_index_0_id_13417fc8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 201:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-image[data-v-13417fc8] { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; user-select: none;\n}\n.zoom-img[data-v-13417fc8] { max-width: 100%; max-height: 100%; object-fit: contain; transform-origin: center center; will-change: transform; cursor: grab;\n}\n.reader-image:active .zoom-img[data-v-13417fc8] { cursor: grabbing;\n}\n.placeholder[data-v-13417fc8] { color: #999; font-size: 14px;\n}\n.image-state[data-v-13417fc8] { position:absolute; padding:12px 16px; border-radius:8px; background:#ffffffed; color:#80684e; font-size:13px;\n}\n.image-state button[data-v-13417fc8] { margin-left:8px; border:0; background:transparent; color:inherit; text-decoration:underline; cursor:pointer;\n}\n.reset-btn[data-v-13417fc8] { position: absolute; top: 16px; right: 16px; z-index: 2; padding: 6px 14px; border: none; border-radius: 16px; background: rgba(17, 17, 17, 0.8); color: #fff; font-size: 13px; cursor: pointer;\n}\n.reset-btn[data-v-13417fc8]:hover { background: rgba(17, 17, 17, 0.95);\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 223:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaReaderImage.vue?vue&type=template&id=13417fc8&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    ref: "surface",
    staticClass: "reader-image",
    on: {
      "wheel": function ($event) {
        $event.preventDefault();
        return _vm.onWheel.apply(null, arguments);
      },
      "mousedown": _vm.onMouseDown,
      "dblclick": _vm.toggleZoom
    }
  }, [_vm._ssrNode((_vm.src ? "<img" + _vm._ssrAttr("src", _vm.imageSource) + _vm._ssrAttr("alt", _vm.alt) + " draggable=\"false\" class=\"zoom-img\"" + _vm._ssrStyle(null, _vm.imgStyle, null) + " data-v-13417fc8>" : "<!---->") + " " + (!_vm.src ? "<div class=\"placeholder\" data-v-13417fc8>图片资料不可用</div>" : _vm.failed ? "<div role=\"alert\" class=\"image-state\" data-v-13417fc8>图片加载失败 <button data-v-13417fc8>重新加载</button></div>" : _vm.loading ? "<div role=\"status\" class=\"image-state\" data-v-13417fc8>图片加载中…</div>" : "<!---->") + " " + (_vm.zoom > 1 ? "<button class=\"reset-btn\" data-v-13417fc8>" + _vm._ssrEscape(_vm._s(_vm.zoom.toFixed(1)) + "× · 复位") + "</button>" : "<!---->"))]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/manga/MangaReaderImage.vue?vue&type=template&id=13417fc8&scoped=true

// EXTERNAL MODULE: ./utils/manga-content.js
var manga_content = __webpack_require__(168);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaReaderImage.vue?vue&type=script&lang=js

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
/* harmony default export */ var MangaReaderImagevue_type_script_lang_js = ({
  name: 'MangaReaderImage',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: '漫画页面'
    },
    resetKey: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      zoom: 1,
      x: 0,
      y: 0,
      dragging: false,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      moved: false,
      loading: Boolean(this.src),
      failed: false,
      retries: 0
    };
  },
  computed: {
    imageSource() {
      return Object(manga_content["b" /* mangaPageSource */])({
        url: this.src
      }, 'original', this.retries);
    },
    imgStyle() {
      return {
        transform: `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.zoom})`
      };
    }
  },
  watch: {
    resetKey() {
      this.reset();
    },
    src() {
      this.reset();
      this.retries = 0;
      this.failed = false;
      this.loading = Boolean(this.src);
    }
  },
  mounted() {
    window.addEventListener('resize', this.bound);
    const image = this.$refs.image;
    if (image && image.complete && image.naturalWidth) {
      this.loading = false;
      this.bound();
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.bound);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.$emit('interaction', false);
  },
  methods: {
    onLoad(e) {
      this.loading = false;
      this.failed = false;
      this.bound();
      this.$emit('load', {
        width: e.target.naturalWidth,
        height: e.target.naturalHeight
      });
    },
    onError() {
      this.loading = false;
      this.failed = true;
      this.$emit('error');
    },
    retry() {
      this.retries++;
      this.failed = false;
      this.loading = true;
      this.reset();
    },
    reset() {
      this.onMouseUp();
      this.zoom = 1;
      this.x = 0;
      this.y = 0;
      this.$emit('interaction', false);
    },
    bound() {
      const el = this.$refs.surface;
      if (!el) return;
      const image = this.$refs.image;
      const maxX = Math.max(0, ((image ? image.clientWidth : el.clientWidth) * this.zoom - el.clientWidth) / 2),
        maxY = Math.max(0, ((image ? image.clientHeight : el.clientHeight) * this.zoom - el.clientHeight) / 2);
      this.x = clamp(this.x, -maxX, maxX);
      this.y = clamp(this.y, -maxY, maxY);
    },
    onWheel(e) {
      var _this$$refs$surface;
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const next = clamp(this.zoom + delta * this.zoom, 1, 5);
      if (next === this.zoom) return;
      const rect = (_this$$refs$surface = this.$refs.surface) === null || _this$$refs$surface === void 0 ? void 0 : _this$$refs$surface.getBoundingClientRect(),
        px = rect && Number.isFinite(e.clientX) ? e.clientX - rect.left - rect.width / 2 : 0,
        py = rect && Number.isFinite(e.clientY) ? e.clientY - rect.top - rect.height / 2 : 0,
        ratio = next / this.zoom;
      this.x = px - (px - this.x) * ratio;
      this.y = py - (py - this.y) * ratio;
      this.zoom = next;
      if (this.zoom === 1) {
        this.x = 0;
        this.y = 0;
      }
      this.bound();
      this.$emit('interaction', this.zoom > 1);
    },
    toggleZoom() {
      if (this.zoom > 1) this.reset();else {
        this.zoom = 2;
        this.bound();
        this.$emit('interaction', true);
      }
    },
    onMouseDown(e) {
      if (e.button !== 0 || this.zoom <= 1) return;
      this.dragging = true;
      this.moved = false;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.originX = this.x;
      this.originY = this.y;
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
      e.preventDefault();
    },
    onMouseMove(e) {
      if (!this.dragging) return;
      this.x = this.originX + (e.clientX - this.startX);
      this.y = this.originY + (e.clientY - this.startY);
      this.bound();
      if (Math.abs(e.clientX - this.startX) > 4 || Math.abs(e.clientY - this.startY) > 4) this.moved = true;
    },
    onMouseUp() {
      this.dragging = false;
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
    }
  }
});
// CONCATENATED MODULE: ./components/manga/MangaReaderImage.vue?vue&type=script&lang=js
 /* harmony default export */ var manga_MangaReaderImagevue_type_script_lang_js = (MangaReaderImagevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/manga/MangaReaderImage.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(200)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  manga_MangaReaderImagevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "13417fc8",
  "1996ecb8"
  
)

/* harmony default export */ var MangaReaderImage = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 259:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(351);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("473f155e", content, true, context)
};

/***/ }),

/***/ 260:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(353);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("f5c5d6c6", content, true, context)
};

/***/ }),

/***/ 261:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(355);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("16b59d8c", content, true, context)
};

/***/ }),

/***/ 350:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaIcon_vue_vue_type_style_index_0_id_4859ea2d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaIcon_vue_vue_type_style_index_0_id_4859ea2d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaIcon_vue_vue_type_style_index_0_id_4859ea2d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaIcon_vue_vue_type_style_index_0_id_4859ea2d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaIcon_vue_vue_type_style_index_0_id_4859ea2d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 351:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.manga-icon[data-v-4859ea2d] { display: inline-block; width: 1.1em; height: 1.1em; flex: none; vertical-align: -0.16em;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 352:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaDanmuLayer_vue_vue_type_style_index_0_id_57a5297b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(260);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaDanmuLayer_vue_vue_type_style_index_0_id_57a5297b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaDanmuLayer_vue_vue_type_style_index_0_id_57a5297b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaDanmuLayer_vue_vue_type_style_index_0_id_57a5297b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaDanmuLayer_vue_vue_type_style_index_0_id_57a5297b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 353:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.danmu-layer[data-v-57a5297b] { position: absolute; inset: 0; z-index: 30; overflow: hidden; pointer-events: none;\n}\n.danmu-item[data-v-57a5297b] { position: absolute; left: 100%; white-space: nowrap; padding: 2px 10px; border-radius: 6px; color: #fff; font-size: 16px; font-weight: 600; line-height: 1.5; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85), 0 0 5px rgba(0, 0, 0, 0.45); animation-name: danmu-roll-57a5297b; animation-timing-function: linear; animation-fill-mode: both; will-change: transform;\n}\n.danmu-item.self[data-v-57a5297b] { color: #5fc3f3; border: 1px solid rgba(95, 195, 243, 0.65); background: rgba(0, 0, 0, 0.3);\n}\n.danmu-item.moderatable[data-v-57a5297b] { pointer-events: auto; cursor: default;\n}\n.danmu-item.paused[data-v-57a5297b] { animation-play-state: paused;\n}\n.danmu-del[data-v-57a5297b] { opacity:0; margin-left: 8px; width: 18px; height: 18px; padding: 0; border: none; border-radius: 50%; background: rgba(0, 0, 0, 0.55); color: #fff; font-size: 14px; line-height: 1; cursor: pointer; vertical-align: middle;\n}\n.danmu-item:hover .danmu-del[data-v-57a5297b],.danmu-item:focus-within .danmu-del[data-v-57a5297b]{opacity:1}.danmu-del[data-v-57a5297b]:focus-visible{outline:2px solid #fff}.danmu-del[data-v-57a5297b]:hover { background: #e0524d;\n}\n@keyframes danmu-roll-57a5297b {\nfrom { transform: translateX(0);\n}\nto { transform: translateX(calc(-100vw - 100%));\n}\n}\n@media (prefers-reduced-motion: reduce) {\n.danmu-item[data-v-57a5297b] { animation-duration: 0.01s !important; animation-delay: 0s !important; opacity: 0;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 354:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_articleId_vue_vue_type_style_index_0_id_9edeed2c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(261);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_articleId_vue_vue_type_style_index_0_id_9edeed2c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_articleId_vue_vue_type_style_index_0_id_9edeed2c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_articleId_vue_vue_type_style_index_0_id_9edeed2c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_articleId_vue_vue_type_style_index_0_id_9edeed2c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 355:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.manga-reader[data-v-9edeed2c] {\r\n  position: fixed;\r\n  inset: 0;\r\n  display: flex;\r\n  flex-direction: column;\r\n  background: #fff;\r\n  overflow: hidden;\n}\n.reader-warm[data-v-9edeed2c] { background: #f6efdf;\n}\n.reader-black[data-v-9edeed2c] { background: #101113;\n}\r\n\r\n/* 顶栏 */\n.top-bar[data-v-9edeed2c] {\r\n  flex: none;\r\n  display: flex;\r\n  align-items: center;\r\n  height: 56px;\r\n  padding: 0 12px;\r\n  background: rgba(255, 255, 255, 0.96);\r\n  border-bottom: 1px solid #e6d8cf;\r\n  z-index: 40;\n}\n.reader-black .top-bar[data-v-9edeed2c] { background: rgba(24, 26, 29, 0.96); border-bottom-color: #2c2f33;\n}\n.bar-icon[data-v-9edeed2c] {\r\n  display: grid;\r\n  place-items: center;\r\n  width: 40px;\r\n  height: 40px;\r\n  flex: none;\r\n  border: none;\r\n  background: none;\r\n  color: #704c35;\r\n  font-size: 20px;\r\n  cursor: pointer;\r\n  border-radius: 8px;\n}\n.bar-icon[data-v-9edeed2c]:hover { background: #f3ece6;\n}\n.reader-black .bar-icon[data-v-9edeed2c] { color: #d8d2cc;\n}\n.reader-black .bar-icon[data-v-9edeed2c]:hover { background: #2c2f33;\n}\n.bar-title[data-v-9edeed2c] { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; text-align: center;\n}\n.bar-novel[data-v-9edeed2c] { font-size: 15px; font-weight: 700; color: #3a2b21; max-width: 60vw; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;\n}\n.bar-episode[data-v-9edeed2c] { margin-top: 2px; font-size: 12px; color: #947358;\n}\n.reader-black .bar-novel[data-v-9edeed2c] { color: #ece7e1;\n}\n.reader-black .bar-episode[data-v-9edeed2c] { color: #9a938b;\n}\r\n\r\n/* 阅读区 */\n.reader-stage[data-v-9edeed2c] { position: relative; flex: 1; min-height: 0; overflow: hidden;\n}\n.strip-scroll[data-v-9edeed2c] { width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; position: relative;\n}\n.strip-page[data-v-9edeed2c] { position:relative; width: 100%; max-width:900px; margin:auto; display: flex; justify-content: center;\n}\n.strip-img[data-v-9edeed2c] { width: 100%; height:auto; object-fit:contain; max-width:900px; display:block;\n}\n.episode-end[data-v-9edeed2c] { padding: 40px 20px 60px; text-align: center;\n}\n.end-next[data-v-9edeed2c] {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  gap: 6px;\r\n  padding: 12px 28px;\r\n  border: none;\r\n  border-radius: 100px;\r\n  background: #947358;\r\n  color: #fff;\r\n  font-size: 15px;\r\n  font-weight: 700;\r\n  cursor: pointer;\n}\n.end-next[data-v-9edeed2c]:hover { background: #7d5f47;\n}\n.end-tip[data-v-9edeed2c] { color: #a99; font-size: 14px;\n}\n.reader-black .end-tip[data-v-9edeed2c] { color: #7a736b;\n}\n.paged-area[data-v-9edeed2c] { width: 100%; height: 100%; display: flex; align-items: stretch;\n}\n.paged-frame[data-v-9edeed2c] { position: relative; flex: 1; min-width: 0; display: flex; align-items: center; justify-content: center;\n}\n.page-arrow[data-v-9edeed2c] {\r\n  flex: none;\r\n  width: 64px;\r\n  border: none;\r\n  background: transparent;\r\n  color: #947358;\r\n  font-size: 26px;\r\n  cursor: pointer;\r\n  transition: background 0.2s;\n}\n.page-arrow[data-v-9edeed2c]:hover:not(:disabled) { background: rgba(148, 115, 88, 0.08);\n}\n.page-arrow[data-v-9edeed2c]:disabled { opacity: 0.25; cursor: default;\n}\n.reader-black .page-arrow[data-v-9edeed2c] { color: #cfc7be;\n}\n.page-retry[data-v-9edeed2c] {\r\n  margin: 40px auto;\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n  padding: 12px 24px;\r\n  border: 1px solid #e6d8cf;\r\n  border-radius: 12px;\r\n  background: #fff1e8;\r\n  color: #947358;\r\n  font-size: 14px;\r\n  cursor: pointer;\n}\n.page-retry.paged[data-v-9edeed2c] { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin: 0;\n}\n.floating-page[data-v-9edeed2c] {\r\n  position: absolute;\r\n  right: 20px;\r\n  bottom: 16px;\r\n  z-index: 35;\r\n  padding: 6px 14px;\r\n  border-radius: 100px;\r\n  background: rgba(19, 22, 25, 0.72);\r\n  color: #fff;\r\n  font-size: 13px;\r\n  font-variant-numeric: tabular-nums;\n}\r\n\r\n/* 底栏 */\n.bottom-bar[data-v-9edeed2c] {\r\n  flex: none;\r\n  padding: 10px 20px 12px;\r\n  background: rgba(255, 255, 255, 0.96);\r\n  border-top: 1px solid #e6d8cf;\r\n  z-index: 40;\n}\n.reader-black .bottom-bar[data-v-9edeed2c] { background: rgba(24, 26, 29, 0.96); border-top-color: #2c2f33;\n}\n.danmu-row[data-v-9edeed2c] { display: flex; align-items: center; gap: 10px; margin-bottom: 8px;\n}\n.danmu-toggle[data-v-9edeed2c] {\r\n  display: grid;\r\n  place-items: center;\r\n  width: 38px;\r\n  height: 38px;\r\n  flex: none;\r\n  border: none;\r\n  border-radius: 50%;\r\n  background: #f3ece6;\r\n  color: #947358;\r\n  font-size: 18px;\r\n  cursor: pointer;\n}\n.danmu-toggle.off[data-v-9edeed2c] { color: #b6aca2; opacity: 0.6;\n}\n.reader-black .danmu-toggle[data-v-9edeed2c] { background: #2c2f33;\n}\n.danmu-input[data-v-9edeed2c] {\r\n  flex: 1;\r\n  min-width: 0;\r\n  height: 38px;\r\n  padding: 0 16px;\r\n  border: 1px solid #e6d8cf;\r\n  border-radius: 100px;\r\n  background: #fff;\r\n  color: #3a2b21;\r\n  font-size: 14px;\r\n  outline: none;\n}\n.danmu-input[data-v-9edeed2c]:focus { border-color: #947358;\n}\n.reader-black .danmu-input[data-v-9edeed2c] { background: #1b1d20; border-color: #2c2f33; color: #ece7e1;\n}\n.danmu-sync[data-v-9edeed2c] {\r\n  flex: none;\r\n  height: 38px;\r\n  padding: 0 16px;\r\n  border: 1px solid #e6d8cf;\r\n  border-radius: 100px;\r\n  background: #fff;\r\n  color: #947358;\r\n  font-size: 13px;\r\n  cursor: pointer;\r\n  white-space: nowrap;\n}\n.danmu-sync.on[data-v-9edeed2c] { background: #fff1e8; border-color: #d9b79c; font-weight: 600;\n}\n.reader-black .danmu-sync[data-v-9edeed2c] { background: #1b1d20; border-color: #2c2f33;\n}\n.danmu-send[data-v-9edeed2c] {\r\n  flex: none;\r\n  height: 38px;\r\n  padding: 0 22px;\r\n  border: none;\r\n  border-radius: 100px;\r\n  background: #947358;\r\n  color: #fff;\r\n  font-size: 14px;\r\n  font-weight: 600;\r\n  cursor: pointer;\n}\n.danmu-send[data-v-9edeed2c]:disabled { opacity: 0.5; cursor: default;\n}\n.danmu-send[data-v-9edeed2c]:hover:not(:disabled) { background: #7d5f47;\n}\n.progress-row[data-v-9edeed2c] { display: flex; align-items: center; gap: 14px; padding: 0 4px;\n}\n.progress-label[data-v-9edeed2c] { flex: none; font-size: 13px; color: #947358; font-variant-numeric: tabular-nums; min-width: 84px;\n}\n.reader-black .progress-label[data-v-9edeed2c] { color: #9a938b;\n}\n.progress-slider[data-v-9edeed2c] { flex:1; min-width:0; width:100%; height:28px; accent-color:#947358; cursor:pointer;\n}\n.reader-actions[data-v-9edeed2c] { display: flex; align-items: center; justify-content: space-around; margin-top: 6px;\n}\n.act-btn[data-v-9edeed2c] {\r\n  text-decoration:none;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  gap: 3px;\r\n  padding: 6px 14px;\r\n  border: none;\r\n  background: none;\r\n  color: #704c35;\r\n  font-size: 12px;\r\n  cursor: pointer;\r\n  border-radius: 8px;\n}\n.act-btn[data-v-9edeed2c]:hover:not(:disabled) { background: #f3ece6;\n}\n.act-btn[data-v-9edeed2c]:disabled { opacity: 0.35; cursor: default;\n}\n.act-btn .manga-icon[data-v-9edeed2c] { font-size: 20px;\n}\n.reader-black .act-btn[data-v-9edeed2c] { color: #d8d2cc;\n}\n.reader-black .act-btn[data-v-9edeed2c]:hover:not(:disabled) { background: #2c2f33;\n}\r\n\r\n/* 目录 */\n.catalog-list[data-v-9edeed2c] { padding: 0 8px;\n}\n.catalog-row[data-v-9edeed2c] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 10px;\r\n  width: 100%;\r\n  padding: 14px 16px;\r\n  border: none;\r\n  border-bottom: 1px solid #f0e7df;\r\n  background: none;\r\n  text-align: left;\r\n  font-size: 14px;\r\n  color: #3a2b21;\r\n  cursor: pointer;\n}\n.catalog-row[data-v-9edeed2c]:hover { background: #faf6f2;\n}\n.catalog-row.current[data-v-9edeed2c] { color: #947358; background: #fff1e8; font-weight: 700;\n}\n.catalog-no[data-v-9edeed2c] { flex: none; width: 40px; color: #a99; font-variant-numeric: tabular-nums;\n}\n.catalog-name[data-v-9edeed2c] { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;\n}\r\n\r\n/* 设置面板 */\n.settings-panel[data-v-9edeed2c] { padding: 4px 2px;\n}\n.setting-head[data-v-9edeed2c] { font-size: 15px; font-weight: 700; color: #3a2b21; margin-bottom: 8px;\n}\n.setting-label[data-v-9edeed2c] { font-size: 12px; color: #947358; font-weight: 600; margin: 12px 0 6px;\n}\r\n\r\n/* 遮罩 */\n.state-mask[data-v-9edeed2c] {\r\n  position: absolute;\r\n  inset: 0;\r\n  z-index: 60;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  justify-content: center;\r\n  gap: 18px;\r\n  background: #f5f2ef;\r\n  color: #704c35;\r\n  font-size: 15px;\n}\n.state-actions[data-v-9edeed2c] { display: flex; gap: 12px;\n}\n.state-btn[data-v-9edeed2c] {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  gap: 6px;\r\n  padding: 10px 22px;\r\n  border: 1px solid #e6d8cf;\r\n  border-radius: 100px;\r\n  background: #fff;\r\n  color: #947358;\r\n  font-size: 14px;\r\n  cursor: pointer;\n}\n.state-btn[data-v-9edeed2c]:hover { background: #fff1e8;\n}\n.strip-zoom[data-v-9edeed2c]{position:absolute;right:10px;top:10px;padding:8px;border:0;border-radius:6px;background:#2229;color:#fff;cursor:pointer}.strip-zoom-surface[data-v-9edeed2c]{height:76vh}.reader-error[data-v-9edeed2c]{font-size:12px;color:#b65f46;line-height:1.6;margin:4px 0 8px}.reader-error button[data-v-9edeed2c]{border:0;background:none;color:inherit;text-decoration:underline;cursor:pointer}.bottom-bar[data-v-9edeed2c]{display:grid;grid-template-columns:minmax(240px,1fr) auto;gap:0 24px}.danmu-row[data-v-9edeed2c],.reader-error[data-v-9edeed2c]{grid-column:1/-1}.reader-actions[data-v-9edeed2c]{gap:8px;margin-top:0}.act-btn[data-v-9edeed2c]{flex-direction:row;white-space:nowrap;padding:8px}.reader-actions .act-btn .manga-icon[data-v-9edeed2c]{font-size:18px}.bar-icon[data-v-9edeed2c]:focus-visible,.act-btn[data-v-9edeed2c]:focus-visible,.page-arrow[data-v-9edeed2c]:focus-visible{outline:2px solid #947358;outline-offset:-2px}@media(max-width:950px){.bottom-bar[data-v-9edeed2c]{display:block}.reader-actions[data-v-9edeed2c]{margin-top:6px}.act-btn[data-v-9edeed2c]{flex-direction:column}.page-arrow[data-v-9edeed2c]{width:42px}}@media(max-width:600px){.bottom-bar[data-v-9edeed2c]{padding:8px 10px}.danmu-row[data-v-9edeed2c]{gap:6px}.danmu-sync[data-v-9edeed2c]{padding:0 10px}.danmu-send[data-v-9edeed2c]{padding:0 14px}.act-btn[data-v-9edeed2c]{font-size:11px;padding:6px}.bar-novel[data-v-9edeed2c]{max-width:68vw}}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 405:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/manga/read/_articleId.vue?vue&type=template&id=9edeed2c&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "manga-reader",
    class: 'reader-' + _vm.readerBackground
  }, [_vm._ssrNode("<div class=\"top-bar\" data-v-9edeed2c>", "</div>", [_vm._ssrNode("<button type=\"button\" title=\"返回\" class=\"bar-icon\" data-v-9edeed2c>", "</button>", [_c('manga-icon', {
    attrs: {
      "name": "back"
    }
  })], 1), _vm._ssrNode(" <div class=\"bar-title\" data-v-9edeed2c><h1 class=\"bar-novel\" data-v-9edeed2c>" + _vm._ssrEscape(_vm._s(_vm.novelName) + " · " + _vm._s(_vm.articleData ? _vm.articleData.title : '漫画阅读')) + "</h1> <span class=\"bar-episode\" data-v-9edeed2c>" + _vm._ssrEscape("第 " + _vm._s(_vm.currentEpisodeNo) + " 话 / 共 " + _vm._s(_vm.articles.length) + " 话") + "</span></div> "), _c('el-popover', {
    attrs: {
      "placement": "bottom-end",
      "width": "280",
      "trigger": "click",
      "popper-class": "reader-settings-pop"
    },
    model: {
      value: _vm.settingsVisible,
      callback: function ($$v) {
        _vm.settingsVisible = $$v;
      },
      expression: "settingsVisible"
    }
  }, [_c('div', {
    staticClass: "settings-panel"
  }, [_c('div', {
    staticClass: "setting-head"
  }, [_vm._v("阅读设置")]), _vm._v(" "), _c('div', {
    staticClass: "setting-label"
  }, [_vm._v("阅读方式")]), _vm._v(" "), _c('el-radio-group', {
    attrs: {
      "size": "mini"
    },
    on: {
      "change": _vm.onModeChange
    },
    model: {
      value: _vm.mode,
      callback: function ($$v) {
        _vm.mode = $$v;
      },
      expression: "mode"
    }
  }, [_c('el-radio-button', {
    attrs: {
      "label": "strip"
    }
  }, [_vm._v("上下滚动")]), _vm._v(" "), _c('el-radio-button', {
    attrs: {
      "label": "paged"
    }
  }, [_vm._v("左右翻页")])], 1), _vm._v(" "), _vm.mode === 'paged' ? [_c('div', {
    staticClass: "setting-label"
  }, [_vm._v("翻页方向")]), _vm._v(" "), _c('el-radio-group', {
    attrs: {
      "size": "mini"
    },
    on: {
      "change": _vm.savePreferences
    },
    model: {
      value: _vm.readingDirection,
      callback: function ($$v) {
        _vm.readingDirection = $$v;
      },
      expression: "readingDirection"
    }
  }, [_c('el-radio-button', {
    attrs: {
      "label": "ltr"
    }
  }, [_vm._v("从左到右")]), _vm._v(" "), _c('el-radio-button', {
    attrs: {
      "label": "rtl"
    }
  }, [_vm._v("从右到左")])], 1)] : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "setting-label"
  }, [_vm._v("阅读背景")]), _vm._v(" "), _c('el-radio-group', {
    attrs: {
      "size": "mini"
    },
    on: {
      "change": _vm.savePreferences
    },
    model: {
      value: _vm.readerBackground,
      callback: function ($$v) {
        _vm.readerBackground = $$v;
      },
      expression: "readerBackground"
    }
  }, [_c('el-radio-button', {
    attrs: {
      "label": "white"
    }
  }, [_vm._v("白色")]), _vm._v(" "), _c('el-radio-button', {
    attrs: {
      "label": "warm"
    }
  }, [_vm._v("暖色")]), _vm._v(" "), _c('el-radio-button', {
    attrs: {
      "label": "black"
    }
  }, [_vm._v("黑色")])], 1), _vm._v(" "), _c('div', {
    staticClass: "setting-label"
  }, [_vm._v("图片清晰度")]), _vm._v(" "), _c('el-radio-group', {
    attrs: {
      "size": "mini"
    },
    on: {
      "change": _vm.onQualityChange
    },
    model: {
      value: _vm.imageQuality,
      callback: function ($$v) {
        _vm.imageQuality = $$v;
      },
      expression: "imageQuality"
    }
  }, [_c('el-radio-button', {
    attrs: {
      "label": "standard"
    }
  }, [_vm._v("流畅")]), _vm._v(" "), _c('el-radio-button', {
    attrs: {
      "label": "original"
    }
  }, [_vm._v("原图")])], 1), _vm._v(" "), _vm.preferenceError ? _c('p', {
    staticClass: "reader-error",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v("偏好未能保存，当前设置仍可使用。")]) : _vm._e()], 2), _vm._v(" "), _c('button', {
    staticClass: "bar-icon",
    attrs: {
      "slot": "reference",
      "type": "button",
      "title": "阅读设置"
    },
    slot: "reference"
  }, [_c('manga-icon', {
    attrs: {
      "name": "settings"
    }
  })], 1)])], 2), _vm._ssrNode(" "), _vm._ssrNode("<div tabindex=\"0\" aria-label=\"漫画阅读区，左右键翻页\" class=\"reader-stage\" data-v-9edeed2c>", "</div>", [_vm.mode === 'strip' ? _vm._ssrNode("<div class=\"strip-scroll\" data-v-9edeed2c>", "</div>", [_vm._l(_vm.pages, function (page, idx) {
    return _vm._ssrNode("<div class=\"strip-page\"" + _vm._ssrStyle(null, _vm.pageStyle(page), null) + " data-v-9edeed2c>", "</div>", [!_vm.pageErrors[idx] ? _vm._ssrNode("<img" + _vm._ssrAttr("src", _vm.pageSrc(page, idx)) + " loading=\"lazy\" draggable=\"false\"" + _vm._ssrAttr("alt", `${_vm.novelName} · ${_vm.articleData ? _vm.articleData.title : ''} · 第 ${idx + 1} 页`) + " class=\"strip-img\" data-v-9edeed2c>", "</img>") : _vm._ssrNode("<button type=\"button\" class=\"page-retry\" data-v-9edeed2c>", "</button>", [_c('manga-icon', {
      attrs: {
        "name": "retry"
      }
    }), _vm._ssrNode(_vm._ssrEscape(" 第 " + _vm._s(idx + 1) + " 页加载失败，重试\n        "))], 2), _vm._ssrNode(" "), _vm.pageSrc(page, idx) ? _vm._ssrNode("<button" + _vm._ssrAttr("aria-label", `放大第 ${idx + 1} 页`) + " class=\"strip-zoom\" data-v-9edeed2c>", "</button>", [_c('manga-icon', {
      attrs: {
        "name": "zoom"
      }
    })], 1) : _vm._e()], 2);
  }), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"episode-end\" data-v-9edeed2c>", "</div>", [_vm.hasNextEpisode ? _vm._ssrNode("<button type=\"button\" class=\"end-next\" data-v-9edeed2c>", "</button>", [_vm._ssrNode("\n          阅读下一话 "), _c('manga-icon', {
    attrs: {
      "name": "next"
    }
  })], 2) : _vm._ssrNode("<span class=\"end-tip\" data-v-9edeed2c>本话完 · 感谢阅读</span>")])], 2) : _vm._ssrNode("<div class=\"paged-area\" data-v-9edeed2c>", "</div>", [_vm._ssrNode("<button type=\"button\"" + _vm._ssrAttr("disabled", _vm.readingDirection === 'rtl' ? !_vm.canGoNext : !_vm.canGoPrev) + _vm._ssrAttr("aria-label", _vm.readingDirection === 'rtl' ? '下一页' : '上一页') + " class=\"page-arrow left\" data-v-9edeed2c>", "</button>", [_c('manga-icon', {
    attrs: {
      "name": "previous"
    }
  })], 1), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"paged-frame\" data-v-9edeed2c>", "</div>", [_vm.currentPageObj ? _c('manga-reader-image', {
    key: _vm.articleId + '-' + _vm.currentPage + '-' + (_vm.retryCount[_vm.currentPage] || 0),
    attrs: {
      "src": _vm.pageSrc(_vm.currentPageObj, _vm.currentPage),
      "alt": `${_vm.novelName} · ${_vm.articleData ? _vm.articleData.title : ''} · 第 ${_vm.currentPage + 1} 页`,
      "reset-key": _vm.zoomResetKey
    },
    on: {
      "interaction": function ($event) {
        _vm.zoomed = $event;
      },
      "error": function ($event) {
        return _vm.onPageError(_vm.currentPage);
      }
    }
  }) : _vm._e(), _vm._ssrNode(" "), _vm.pageErrors[_vm.currentPage] ? _vm._ssrNode("<button type=\"button\" class=\"page-retry paged\" data-v-9edeed2c>", "</button>", [_c('manga-icon', {
    attrs: {
      "name": "retry"
    }
  }), _vm._ssrNode(" 本页加载失败，重试\n        ")], 2) : _vm._e()], 2), _vm._ssrNode(" "), _vm._ssrNode("<button type=\"button\"" + _vm._ssrAttr("disabled", _vm.readingDirection === 'rtl' ? !_vm.canGoPrev : !_vm.canGoNext) + _vm._ssrAttr("aria-label", _vm.readingDirection === 'rtl' ? '上一页' : '下一页') + " class=\"page-arrow right\" data-v-9edeed2c>", "</button>", [_c('manga-icon', {
    attrs: {
      "name": "next"
    }
  })], 1)], 2), _vm._ssrNode(" "), _vm.danmuEnabled && _vm.stripPreview === null && !_vm.zoomed && _vm.currentPageDanmus.length ? _c('manga-danmu-layer', {
    key: 'danmu-' + _vm.articleId + '-' + _vm.currentPage + '-' + _vm.danmuReplayTick,
    attrs: {
      "danmus": _vm.currentPageDanmus,
      "current-user-id": _vm.currentUserId,
      "work-author-id": _vm.workAuthorId
    },
    on: {
      "remove": _vm.removeDanmu
    }
  }) : _vm._e(), _vm._ssrNode(" " + (_vm.mode === 'paged' && _vm.pages.length ? "<div class=\"floating-page\" data-v-9edeed2c>" + _vm._ssrEscape(_vm._s(_vm.currentPage + 1) + " / " + _vm._s(_vm.pages.length)) + "</div>" : "<!---->"))], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"bottom-bar\" data-v-9edeed2c>", "</div>", [_vm._ssrNode("<div class=\"danmu-row\" data-v-9edeed2c>", "</div>", [_vm._ssrNode("<button type=\"button\"" + _vm._ssrAttr("aria-label", _vm.danmuEnabled ? '关闭弹幕' : '开启弹幕') + _vm._ssrClass("danmu-toggle", {
    off: !_vm.danmuEnabled
  }) + " data-v-9edeed2c>", "</button>", [_c('manga-icon', {
    attrs: {
      "name": "danmu"
    }
  })], 1), _vm._ssrNode(" <input type=\"text\" maxlength=\"100\" placeholder=\"发条弹幕见证此刻...\"" + _vm._ssrAttr("disabled", _vm.danmuSending) + _vm._ssrAttr("value", _vm.danmuInput) + " class=\"danmu-input\" data-v-9edeed2c> <button type=\"button\"" + _vm._ssrAttr("aria-pressed", _vm.danmuSyncComment) + " aria-label=\"同时发送为本话评论\"" + _vm._ssrClass("danmu-sync", {
    on: _vm.danmuSyncComment
  }) + " data-v-9edeed2c>\n        同步评论\n      </button> <button type=\"button\"" + _vm._ssrAttr("disabled", _vm.danmuSending || !_vm.danmuInput.trim()) + " class=\"danmu-send\" data-v-9edeed2c>发送</button>")], 2), _vm._ssrNode(" " + (_vm.danmuError ? "<p role=\"alert\" class=\"reader-error\" data-v-9edeed2c>" + _vm._ssrEscape(_vm._s(_vm.danmuError) + " ") + "<button" + _vm._ssrAttr("disabled", _vm.danmuLoading) + " data-v-9edeed2c>刷新弹幕</button></p>" : "<!---->") + " " + (_vm.progressError ? "<p role=\"alert\" class=\"reader-error\" data-v-9edeed2c>" + _vm._ssrEscape(_vm._s(_vm.progressError) + " ") + "<button" + _vm._ssrAttr("disabled", _vm.progressWrites > 0) + " data-v-9edeed2c>重试保存</button></p>" : "<!---->") + " <div class=\"progress-row\" data-v-9edeed2c><span class=\"progress-label\" data-v-9edeed2c>" + _vm._ssrEscape(_vm._s(_vm.progressLabel)) + "</span> <input type=\"range\" aria-label=\"漫画页码\" min=\"1\"" + _vm._ssrAttr("max", Math.max(1, _vm.pages.length)) + _vm._ssrAttr("aria-valuetext", _vm.progressLabel) + _vm._ssrAttr("disabled", _vm.pages.length < 2) + _vm._ssrAttr("value", _vm.currentPage + 1) + " class=\"progress-slider\" data-v-9edeed2c></div> "), _vm._ssrNode("<div class=\"reader-actions\" data-v-9edeed2c>", "</div>", [_vm._ssrNode("<button type=\"button\" class=\"act-btn\" data-v-9edeed2c>", "</button>", [_c('manga-icon', {
    attrs: {
      "name": "list"
    }
  }), _vm._ssrNode("<span data-v-9edeed2c>目录</span>")], 2), _vm._ssrNode(" "), _vm._ssrNode("<button type=\"button\" class=\"act-btn\" data-v-9edeed2c>", "</button>", [_c('manga-icon', {
    attrs: {
      "name": "comment"
    }
  }), _vm._ssrNode("<span data-v-9edeed2c>" + _vm._ssrEscape(_vm._s(_vm.commentAmount ? '评论 ' + _vm.commentAmount : '评论')) + "</span>")], 2), _vm._ssrNode(" "), _vm.hasPrevEpisode ? _c('nuxt-link', {
    staticClass: "act-btn",
    attrs: {
      "to": `/manga/read/${_vm.articles[_vm.currentIdx - 1].article_id}?novelId=${_vm.novelId}`,
      "rel": "prev"
    },
    nativeOn: {
      "click": function ($event) {
        $event.preventDefault();
        return _vm.prevEpisode.apply(null, arguments);
      }
    }
  }, [_c('manga-icon', {
    attrs: {
      "name": "previous"
    }
  }), _c('span', [_vm._v("上一话")])], 1) : _c('button', {
    staticClass: "act-btn",
    attrs: {
      "disabled": ""
    }
  }, [_c('manga-icon', {
    attrs: {
      "name": "previous"
    }
  }), _c('span', [_vm._v("上一话")])], 1), _vm._ssrNode(" "), _c('nuxt-link', {
    staticClass: "act-btn",
    attrs: {
      "to": `/manga/${_vm.novelId}`
    }
  }, [_c('manga-icon', {
    attrs: {
      "name": "list"
    }
  }), _c('span', [_vm._v("作品详情")])], 1), _vm._ssrNode(" "), _vm.hasNextEpisode ? _c('nuxt-link', {
    staticClass: "act-btn",
    attrs: {
      "to": `/manga/read/${_vm.articles[_vm.currentIdx + 1].article_id}?novelId=${_vm.novelId}`,
      "rel": "next"
    },
    nativeOn: {
      "click": function ($event) {
        $event.preventDefault();
        return _vm.nextEpisode.apply(null, arguments);
      }
    }
  }, [_c('manga-icon', {
    attrs: {
      "name": "next"
    }
  }), _c('span', [_vm._v("下一话")])], 1) : _c('button', {
    staticClass: "act-btn",
    attrs: {
      "disabled": ""
    }
  }, [_c('manga-icon', {
    attrs: {
      "name": "next"
    }
  }), _c('span', [_vm._v("下一话")])], 1), _vm._ssrNode(" "), _vm._ssrNode("<button type=\"button\" class=\"act-btn\" data-v-9edeed2c>", "</button>", [_c('manga-icon', {
    attrs: {
      "name": "zoom"
    }
  }), _vm._ssrNode("<span data-v-9edeed2c>复位</span>")], 2)], 2)], 2), _vm._ssrNode(" "), _c('el-drawer', {
    attrs: {
      "title": "漫画目录",
      "visible": _vm.openCatalog,
      "direction": "rtl",
      "size": "min(420px, 94vw)",
      "custom-class": "catalog-drawer"
    },
    on: {
      "update:visible": function ($event) {
        _vm.openCatalog = $event;
      }
    }
  }, [_c('div', {
    staticClass: "catalog-list"
  }, _vm._l(_vm.articles, function (item, idx) {
    return _c('nuxt-link', {
      key: item.article_id,
      staticClass: "catalog-row",
      class: {
        current: idx === _vm.currentIdx
      },
      attrs: {
        "to": `/manga/read/${item.article_id}?novelId=${_vm.novelId}`
      },
      nativeOn: {
        "click": function ($event) {
          $event.preventDefault();
          return _vm.jumpToEpisode(idx);
        }
      }
    }, [_c('span', {
      staticClass: "catalog-no"
    }, [_vm._v(_vm._s(item.article_chapter))]), _vm._v(" "), _c('span', {
      staticClass: "catalog-name"
    }, [_vm._v(_vm._s(item.title))]), _vm._v(" "), idx === _vm.currentIdx ? _c('manga-icon', {
      attrs: {
        "name": "check"
      }
    }) : _vm._e()], 1);
  }), 1)]), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "visible": _vm.stripPreview !== null,
      "title": "漫画页面 · 滚轮缩放，拖动查看",
      "width": "94vw",
      "top": "3vh",
      "append-to-body": ""
    },
    on: {
      "update:visible": _vm.closeStripPreview
    }
  }, [_c('div', {
    staticClass: "strip-zoom-surface"
  }, [_vm.stripPreview !== null && _vm.pages[_vm.stripPreview] ? _c('MangaReaderImage', {
    attrs: {
      "src": _vm.pageSrc(_vm.pages[_vm.stripPreview], _vm.stripPreview),
      "alt": `第 ${_vm.stripPreview + 1} 页`
    }
  }) : _vm._e()], 1)]), _vm._ssrNode(" "), _c('manga-comment-panel', {
    key: 'cmt-' + _vm.articleId,
    attrs: {
      "visible": _vm.commentVisible,
      "novel-id": _vm.novelId,
      "article-id": _vm.articleId,
      "work-author-id": _vm.workAuthorId,
      "anchor-id": _vm.initialCommentId
    },
    on: {
      "update:visible": function ($event) {
        _vm.commentVisible = $event;
      },
      "changed": _vm.loadCommentAmount
    }
  }), _vm._ssrNode(" "), _vm.loading ? _vm._ssrNode("<div class=\"state-mask\" data-v-9edeed2c>", "</div>", [_vm._ssrNode("正在加载漫画…")], 2) : _vm.loadError ? _vm._ssrNode("<div class=\"state-mask\" data-v-9edeed2c>", "</div>", [_vm._ssrNode("<span data-v-9edeed2c>" + _vm._ssrEscape(_vm._s(_vm.loadError)) + "</span> "), _vm._ssrNode("<div class=\"state-actions\" data-v-9edeed2c>", "</div>", [_vm._ssrNode("<button type=\"button\" class=\"state-btn\" data-v-9edeed2c>", "</button>", [_c('manga-icon', {
    attrs: {
      "name": "retry"
    }
  }), _vm._ssrNode(" 重试")], 2), _vm._ssrNode(" <button type=\"button\" class=\"state-btn\" data-v-9edeed2c>返回</button>")], 2)], 2) : _vm._e()], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/manga/read/_articleId.vue?vue&type=template&id=9edeed2c&scoped=true

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/login-return.js
var login_return = __webpack_require__(135);

// EXTERNAL MODULE: ./utils/reading-history.js
var reading_history = __webpack_require__(35);

// EXTERNAL MODULE: ./utils/reader-comment-links.js
var reader_comment_links = __webpack_require__(127);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(34);

// EXTERNAL MODULE: ./utils/manga-content.js
var manga_content = __webpack_require__(168);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaIcon.vue?vue&type=template&id=4859ea2d&scoped=true
var MangaIconvue_type_template_id_4859ea2d_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('svg', {
    staticClass: "manga-icon",
    attrs: {
      "viewBox": "0 0 24 24",
      "xmlns": "http://www.w3.org/2000/svg",
      "fill": _vm.isFilled ? 'currentColor' : 'none',
      "stroke": "currentColor",
      "stroke-width": "1.8",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      "focusable": "false"
    }
  }, [_vm._ssrNode(_vm._ssrList(_vm.iconPaths, function (path, index) {
    return "<path" + _vm._ssrAttr("d", path) + " data-v-4859ea2d></path>";
  }) + " " + (_vm.name === 'settings' ? "<circle cx=\"12\" cy=\"12\" r=\"3.2\" data-v-4859ea2d></circle>" : "<!---->"))]);
};
var MangaIconvue_type_template_id_4859ea2d_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/manga/MangaIcon.vue?vue&type=template&id=4859ea2d&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaIcon.vue?vue&type=script&lang=js
const icons = {
  back: ['m15 18-6-6 6-6'],
  next: ['m9 18 6-6-6-6'],
  previous: ['m15 18-6-6 6-6'],
  add: ['M12 5v14', 'M5 12h14'],
  close: ['M18 6 6 18', 'M6 6l12 12'],
  edit: ['M14.5 5.5 18.5 9.5', 'M4 20l4.5-1 10-10a2.8 2.8 0 0 0-4-4l-10 10z'],
  book: ['M3 5a2 2 0 0 1 2-2h7v17H5a2 2 0 0 0-2 2V5z', 'M21 5a2 2 0 0 0-2-2h-7v17h7a2 2 0 0 1 2 2V5z'],
  image: ['M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z', 'M3 17l5-5 4 4 3-3 6 6', 'M16.5 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'],
  upload: ['M12 16V4', 'm7 9 5-5 5 5', 'M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3'],
  settings: ['M10 2h4l.6 2.4 1.2.5 2.1-1.3 2.8 2.8-1.3 2.1.5 1.2L22 10v4l-2.4.6-.5 1.2 1.3 2.1-2.8 2.8-2.1-1.3-1.2.5L14 22h-4l-.6-2.4-1.2-.5-2.1 1.3-2.8-2.8 1.3-2.1-.5-1.2L2 14v-4l2.4-.6.5-1.2-1.3-2.1 2.8-2.8 2.1 1.3 1.2-.5z'],
  preview: ['M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  star: ['m12 2.5 3 6.2 6.8 1-4.9 4.8 1.2 6.8-6.1-3.2-6.1 3.2 1.2-6.8-4.9-4.8 6.8-1z'],
  starFilled: ['m12 2.5 3 6.2 6.8 1-4.9 4.8 1.2 6.8-6.1-3.2-6.1 3.2 1.2-6.8-4.9-4.8 6.8-1z'],
  sort: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  drag: ['M9 5h.01', 'M15 5h.01', 'M9 12h.01', 'M15 12h.01', 'M9 19h.01', 'M15 19h.01'],
  trash: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 14h10l1-14', 'M10 11v6', 'M14 11v6'],
  swap: ['M3 7h17', 'm16 3 4 4-4 4', 'M21 17H4', 'm8 13-4 4 4 4'],
  retry: ['M20 11a8 8 0 1 0-2.2 6.5', 'M20 5v6h-6'],
  list: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  zoom: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'm17 17 5 5', 'M8 11h6', 'M11 8v6'],
  check: ['m4 12 5 5L20 6'],
  lock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 1 1 8 0v4'],
  users: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4 21v-2a8 8 0 0 1 16 0v2', 'M18 5a3 3 0 0 1 0 6'],
  palette: ['M12 2a10 10 0 1 0 0 20h2a2 2 0 0 0 1-3.7 2 2 0 0 1 .9-3.8H18A4 4 0 0 0 22 10 9 9 0 0 0 12 2z', 'M6 11h.01', 'M9 6h.01', 'M15 6h.01'],
  comment: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  danmu: ['M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z', 'M8 9.5h8', 'M8 12.5h5'],
  heart: ['M20.8 5.6a5.4 5.4 0 0 0-7.7 0L12 6.7l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-7.7a5.4 5.4 0 0 0 0-7.7z'],
  heartFilled: ['M20.8 5.6a5.4 5.4 0 0 0-7.7 0L12 6.7l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-7.7a5.4 5.4 0 0 0 0-7.7z']
};
/* harmony default export */ var MangaIconvue_type_script_lang_js = ({
  name: 'MangaIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    iconPaths() {
      return icons[this.name] || icons.image;
    },
    isFilled() {
      return this.name === 'starFilled' || this.name === 'heartFilled';
    }
  }
});
// CONCATENATED MODULE: ./components/manga/MangaIcon.vue?vue&type=script&lang=js
 /* harmony default export */ var manga_MangaIconvue_type_script_lang_js = (MangaIconvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/manga/MangaIcon.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(350)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  manga_MangaIconvue_type_script_lang_js,
  MangaIconvue_type_template_id_4859ea2d_scoped_true_render,
  MangaIconvue_type_template_id_4859ea2d_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "4859ea2d",
  "06696746"
  
)

/* harmony default export */ var MangaIcon = (component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaDanmuLayer.vue?vue&type=template&id=57a5297b&scoped=true
var MangaDanmuLayervue_type_template_id_57a5297b_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "danmu-layer",
    attrs: {
      "aria-label": "本页弹幕"
    }
  }, [_vm._ssrNode(_vm._ssrList(_vm.items, function (item) {
    return "<span" + _vm._ssrClass("danmu-item", {
      self: item.self,
      moderatable: item.moderatable,
      paused: item.key === _vm.hoverId || item.key === _vm.focusId
    }) + _vm._ssrStyle(null, {
      top: item.top + '%',
      animationDuration: item.duration + 's',
      animationDelay: item.delay + 's'
    }, null) + " data-v-57a5297b>" + _vm._ssrEscape("\n    " + _vm._s(item.content) + "\n    ") + (item.moderatable ? "<button" + _vm._ssrAttr("aria-label", `删除弹幕：${item.content}`) + " class=\"danmu-del\" data-v-57a5297b>×</button>" : "<!---->") + "</span>";
  }))]);
};
var MangaDanmuLayervue_type_template_id_57a5297b_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/manga/MangaDanmuLayer.vue?vue&type=template&id=57a5297b&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaDanmuLayer.vue?vue&type=script&lang=js
// 漫画弹幕漂浮层：父组件通过 :key 在切页/重放时重建本组件以重启动画。
// 覆盖整个阅读区（absolute），pointer-events none 不拦截阅读操作；
// 桌面端 hover 暂停并显示删除按钮（作者可删本作品任意弹幕，用户可删自己的）。
const LANE_COUNT = 8;
/* harmony default export */ var MangaDanmuLayervue_type_script_lang_js = ({
  name: 'MangaDanmuLayer',
  props: {
    danmus: {
      type: Array,
      default: () => []
    },
    currentUserId: {
      type: [String, Number],
      default: null
    },
    workAuthorId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      hoverId: null,
      focusId: null
    };
  },
  computed: {
    items() {
      return this.danmus.map((danmu, index) => {
        const lane = index % LANE_COUNT;
        const self = this.currentUserId != null && String(danmu.userId) === String(this.currentUserId);
        const moderatable = self || this.currentUserId != null && this.workAuthorId != null && String(this.currentUserId) === String(this.workAuthorId);
        return {
          key: danmu.danmuId,
          danmuId: danmu.danmuId,
          content: danmu.content,
          self,
          moderatable,
          top: 4 + lane * (86 / (LANE_COUNT - 1)),
          duration: 10 + Number(danmu.danmuId) % 4,
          delay: Math.floor(index / LANE_COUNT) * 2.4 + Number(danmu.danmuId) % 8 * .1
        };
      });
    }
  }
});
// CONCATENATED MODULE: ./components/manga/MangaDanmuLayer.vue?vue&type=script&lang=js
 /* harmony default export */ var manga_MangaDanmuLayervue_type_script_lang_js = (MangaDanmuLayervue_type_script_lang_js); 
// CONCATENATED MODULE: ./components/manga/MangaDanmuLayer.vue



function MangaDanmuLayer_injectStyles (context) {
  
  var style0 = __webpack_require__(352)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var MangaDanmuLayer_component = Object(componentNormalizer["a" /* default */])(
  manga_MangaDanmuLayervue_type_script_lang_js,
  MangaDanmuLayervue_type_template_id_57a5297b_scoped_true_render,
  MangaDanmuLayervue_type_template_id_57a5297b_scoped_true_staticRenderFns,
  false,
  MangaDanmuLayer_injectStyles,
  "57a5297b",
  "69d73188"
  
)

/* harmony default export */ var MangaDanmuLayer = (MangaDanmuLayer_component.exports);
// EXTERNAL MODULE: ./components/manga/MangaReaderImage.vue + 4 modules
var MangaReaderImage = __webpack_require__(223);

// EXTERNAL MODULE: ./components/manga/MangaCommentPanel.vue + 19 modules
var MangaCommentPanel = __webpack_require__(154);

// EXTERNAL MODULE: ./common/manga-comment-api.js
var manga_comment_api = __webpack_require__(124);

// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__(11);
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_);

// CONCATENATED MODULE: ./common/manga-danmu-api.js


function session() {
  try {
    return JSON.parse(window.localStorage.getItem('token')) || {};
  } catch (_) {
    return {};
  }
}
const positive = value => Number.isSafeInteger(Number(value)) && Number(value) > 0;
function headers(expected = Object(reading["c" /* readingToken */])()) {
  if (!expected) throw Error('请先登录后再操作');
  if (expected !== Object(reading["c" /* readingToken */])()) throw Error('账号已变化，请重新操作');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${expected}`
  };
}
function currentDanmuUserId() {
  const id = session().id;
  return positive(id) ? Number(id) : null;
}
function getMangaDanmuErrorMessage(error, fallback = '弹幕发送失败，请稍后重试') {
  var _error$response;
  const data = error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.data;
  return (data === null || data === void 0 ? void 0 : data.message) || (data === null || data === void 0 ? void 0 : data.msg) || (error === null || error === void 0 ? void 0 : error.message) || fallback;
}
function model(item, novelId, articleId) {
  if (!item || !positive(item.danmu_id) || !positive(item.user_id) || !Number.isSafeInteger(Number(item.page_idx)) || Number(item.page_idx) < 0 || typeof item.content !== 'string' || !item.content.trim() || item.novel_id != null && Number(item.novel_id) !== Number(novelId) || item.article_id != null && Number(item.article_id) !== Number(articleId)) return null;
  return {
    danmuId: Number(item.danmu_id),
    userId: Number(item.user_id),
    pageIdx: Number(item.page_idx),
    content: item.content,
    time: item.danmu_time
  };
}
async function fetchMangaDanmus(baseUrl, novelId, articleId) {
  var _response$data;
  const response = await external_axios_default.a.get(`${baseUrl}/community/manga_danmus`, {
    params: {
      id: novelId,
      articleId
    }
  });
  if (!Array.isArray(response.data)) throw Error(((_response$data = response.data) === null || _response$data === void 0 ? void 0 : _response$data.msg) || '弹幕数据格式无效');
  return response.data.map(row => model(row, novelId, articleId)).filter(Boolean);
}
async function sendMangaDanmu(baseUrl, {
  novelId,
  articleId,
  pageIdx,
  content
}, token = Object(reading["c" /* readingToken */])()) {
  var _response$data2;
  if (!positive(novelId) || !positive(articleId) || !Number.isSafeInteger(Number(pageIdx)) || Number(pageIdx) < 0 || typeof content !== 'string' || !content.trim() || content.trim().length > 100) throw Error('弹幕内容或页码无效');
  const response = await external_axios_default.a.post(`${baseUrl}/community/manga_danmu`, {
      novel_id: novelId,
      article_id: articleId,
      page_idx: pageIdx,
      content: content.trim()
    }, {
      headers: headers(token)
    }),
    row = model(response.data, novelId, articleId);
  if (!row || row.pageIdx !== Number(pageIdx)) throw Error(((_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : _response$data2.msg) || '服务未确认弹幕，请刷新后核对');
  return row;
}
async function deleteMangaDanmu(baseUrl, danmuId, token = Object(reading["c" /* readingToken */])()) {
  var _response$data3, _response$data4;
  if (!positive(danmuId)) throw Error('弹幕不存在');
  const response = await external_axios_default.a.get(`${baseUrl}/community/delete_manga_danmu`, {
    params: {
      id: danmuId
    },
    headers: headers(token)
  });
  if (((_response$data3 = response.data) === null || _response$data3 === void 0 ? void 0 : _response$data3.msg) !== 'success') throw Error(((_response$data4 = response.data) === null || _response$data4 === void 0 ? void 0 : _response$data4.msg) || '删除未成功');
  return response.data;
}
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/manga/read/_articleId.vue?vue&type=script&lang=js












const _articleIdvue_type_script_lang_js_baseUrl = "https://api.loghome.ink";
/* harmony default export */ var _articleIdvue_type_script_lang_js = ({
  name: 'MangaReaderPage',
  components: {
    MangaIcon: MangaIcon,
    MangaDanmuLayer: MangaDanmuLayer,
    MangaReaderImage: MangaReaderImage["a" /* default */],
    MangaCommentPanel: MangaCommentPanel["a" /* default */]
  },
  layout: 'empty',
  async asyncData(context) {
    const result = await Object(manga_content["a" /* loadPublicManga */])(context);
    if (result && result.articleData) result.initialCommentId = Object(reader_comment_links["a" /* readingCommentId */])(context.query);
    return result;
  },
  head() {
    return Object(reading_seo["d" /* readingHead */])({
      title: `${this.articleData ? this.articleData.title : '漫画阅读'} - ${this.novelName} - 原木社区`,
      description: this.workInfo && this.workInfo.content,
      path: `/manga/read/${this.articleId || this.$route.params.articleId}`,
      image: this.workInfo && this.workInfo.picUrl,
      type: 'article'
    });
  },
  data() {
    return {
      articleId: null,
      ssrReady: false,
      lastCountedArticleId: null,
      initialCommentId: 0,
      novelId: null,
      novelName: '漫画',
      workInfo: null,
      workAuthorId: null,
      articles: [],
      currentIdx: -1,
      articleData: null,
      pages: [],
      mode: 'strip',
      readingDirection: 'ltr',
      readerBackground: 'white',
      imageQuality: 'standard',
      userModeChosen: false,
      currentPage: 0,
      loading: true,
      loadError: '',
      loadRequestId: 0,
      requestedIdx: -1,
      pageErrors: {},
      retryCount: {},
      zoomed: false,
      zoomResetKey: 0,
      preloadedChapter: null,
      // 进度
      progressTimer: null,
      // 评论
      commentVisible: false,
      commentAmount: 0,
      // 弹幕
      danmuEnabled: true,
      danmuList: [],
      danmuInput: '',
      danmuSending: false,
      danmuSyncComment: false,
      danmuReplayTick: 0,
      // 目录
      openCatalog: false,
      settingsVisible: false,
      preferenceError: false,
      progressDirty: true,
      progressError: '',
      progressWrites: 0,
      account: null,
      identityVersion: 0,
      danmuVersion: 0,
      commentVersion: 0,
      danmuLoading: false,
      danmuError: '',
      sessionUserId: null,
      navigating: false,
      stripPreview: null
    };
  },
  computed: {
    currentEpisodeNo() {
      if (this.currentIdx >= 0 && this.articles[this.currentIdx]) return this.articles[this.currentIdx].article_chapter;
      return '-';
    },
    hasPrevEpisode() {
      return this.currentIdx > 0;
    },
    hasNextEpisode() {
      return this.currentIdx >= 0 && this.currentIdx < this.articles.length - 1;
    },
    progressLabel() {
      if (!this.pages.length) return '-';
      return `${Math.min(this.currentPage, this.pages.length - 1) + 1} / ${this.pages.length} 页`;
    },
    currentPageObj() {
      return this.pages[this.currentPage] || null;
    },
    canGoPrev() {
      return this.currentPage > 0 || this.hasPrevEpisode;
    },
    canGoNext() {
      return this.currentPage < this.pages.length - 1 || this.hasNextEpisode;
    },
    currentPageDanmus() {
      return this.danmuList.filter(item => item.pageIdx === this.currentPage);
    },
    currentUserId() {
      return this.sessionUserId;
    }
  },
  mounted() {
    this.account = Object(reading["c" /* readingToken */])();
    this.sessionUserId = currentDanmuUserId();
    this.loadPreferences();
    this.activateEpisode();
    window.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('pagehide', this.onBeforeUnload);
    window.addEventListener('focus', this.checkAccount);
    window.addEventListener('storage', this.checkAccount);
  },
  beforeRouteUpdate(to, from, next) {
    this.syncProgress(true);
    next();
  },
  watch: {
    '$route.query'(query) {
      this.initialCommentId = Object(reader_comment_links["a" /* readingCommentId */])(query);
      if (this.initialCommentId) this.commentVisible = true;
      if (query.pageIdx !== undefined && this.pages.length) {
        this.currentPage = Math.min(this.pages.length - 1, Math.max(0, Math.floor(Number(query.pageIdx) || 0)));
        if (this.mode === 'strip') this.$nextTick(() => this.seekStripPage(this.currentPage));
      }
    },
    'articleData.article_id'(id, previous) {
      if (id && String(id) !== String(previous)) this.activateEpisode();
    }
  },
  beforeDestroy() {
    clearTimeout(this.progressTimer);
    this.progressTimer = null;
    this.syncProgress(true);
    this.loadRequestId++;
    this.danmuVersion++;
    this.commentVersion++;
    this.identityVersion++;
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('pagehide', this.onBeforeUnload);
    window.removeEventListener('focus', this.checkAccount);
    window.removeEventListener('storage', this.checkAccount);
  },
  methods: {
    onBeforeUnload() {
      this.syncProgress(true);
    },
    getToken: reading["c" /* readingToken */],
    checkAccount() {
      const token = Object(reading["c" /* readingToken */])();
      if (token === this.account) return false;
      this.account = token;
      this.identityVersion++;
      this.sessionUserId = currentDanmuUserId();
      clearTimeout(this.progressTimer);
      this.progressTimer = null;
      this.progressDirty = false;
      this.progressError = '';
      this.progressWrites = 0;
      this.danmuVersion++;
      this.danmuInput = '';
      this.danmuSending = false;
      this.danmuSyncComment = false;
      this.danmuError = '';
      this.commentVisible = false;
      this.loadDanmus();
      return true;
    },
    currentScope(version, token, id) {
      return version === this.identityVersion && token === Object(reading["c" /* readingToken */])() && Number(id) === Number(this.articleId);
    },
    activateEpisode() {
      clearTimeout(this.progressTimer);
      this.progressTimer = null;
      this.loadRequestId++;
      this.danmuVersion++;
      this.commentVersion++;
      this.navigating = false;
      this.pageErrors = {};
      this.retryCount = {};
      this.preloadedChapter = null;
      this.stripPreview = null;
      this.resetZoom();
      this.danmuInput = '';
      this.danmuSending = false;
      this.danmuError = '';
      this.commentAmount = 0;
      this.danmuList = [];
      if (!this.userModeChosen) this.mode = this.articleData.article_type === 'mangaPage' ? 'paged' : 'strip';
      if (this.articleId !== this.lastCountedArticleId) {
        this.lastCountedArticleId = this.articleId;
        this.$api.statistics.novelClicked(this.articleId).catch(() => {});
      }
      this.loadDanmus();
      this.loadCommentAmount();
      this.progressDirty = true;
      this.syncProgress(true);
      if (this.mode === 'strip') this.$nextTick(() => this.seekStripPage(this.currentPage));
      if (this.initialCommentId) this.commentVisible = true;
    },
    loadPreferences() {
      const value = Object(manga_content["d" /* readMangaPreferences */])(localStorage);
      if (value.mode) {
        this.mode = value.mode;
        this.userModeChosen = true;
      }
      this.readingDirection = value.direction;
      this.readerBackground = value.background;
      this.imageQuality = value.quality;
      this.danmuEnabled = value.danmu;
    },
    savePreferences() {
      this.preferenceError = !Object(manga_content["e" /* saveMangaPreferences */])(localStorage, {
        mode: this.mode,
        direction: this.readingDirection,
        background: this.readerBackground,
        quality: this.imageQuality,
        danmu: this.danmuEnabled
      });
    },
    onQualityChange() {
      this.pageErrors = {};
      this.retryCount = {};
      this.preloadedChapter = null;
      this.resetZoom();
      this.savePreferences();
      if (this.mode === 'strip') this.$nextTick(() => this.seekStripPage(this.currentPage));
    },
    onModeChange() {
      this.resetZoom();
      this.userModeChosen = true;
      this.savePreferences();
      if (this.mode === 'strip') this.$nextTick(() => this.seekStripPage(this.currentPage));
    },
    resetZoom() {
      this.zoomed = false;
      this.zoomResetKey += 1;
    },
    // Episode changes use Nuxt's public SSR loader; client and server enforce the same scope.
    async openArticle(articleId, pageIdx, episodeIdx, edge) {
      if (this.navigating) return;
      if (Number(articleId) === Number(this.articleId)) {
        this.goToPage(pageIdx);
        return;
      }
      const target = this.articles[episodeIdx];
      if (!target || Number(target.article_id) !== Number(articleId)) return;
      this.syncProgress(true);
      this.navigating = true;
      try {
        await this.$router.push({
          path: `/manga/read/${articleId}`,
          query: {
            novelId: this.novelId,
            ...(edge ? {
              edge
            } : {
              pageIdx
            })
          }
        });
      } catch (error) {
        if (error.name !== 'NavigationDuplicated') this.$message.error(error.message || '话数切换失败');
      } finally {
        this.navigating = false;
      }
    },
    retryEpisode() {
      this.$nuxt.refresh();
    },
    parseMangaContent: manga_content["c" /* mangaPages */],
    pageSrc(page, idx) {
      return Object(manga_content["b" /* mangaPageSource */])(page, this.imageQuality, this.retryCount[idx]);
    },
    pageStyle(page) {
      return {
        aspectRatio: page.width && page.height ? `${page.width}/${page.height}` : undefined,
        minHeight: page.width && page.height ? '0' : '240px'
      };
    },
    openStripPreview(idx) {
      this.currentPage = idx;
      this.stripPreview = idx;
      this.scheduleSync();
    },
    closeStripPreview() {
      const idx = this.stripPreview;
      this.stripPreview = null;
      if (idx !== null) {
        this.currentPage = idx;
        this.$nextTick(() => this.seekStripPage(idx));
      }
    },
    onPageError(idx) {
      this.$set(this.pageErrors, idx, true);
    },
    retryPage(idx) {
      this.$set(this.pageErrors, idx, false);
      this.$set(this.retryCount, idx, (this.retryCount[idx] || 0) + 1);
    },
    // ===== 条漫滚动 =====
    onStripScroll() {
      if (this.loading || this.mode !== 'strip' || this.stripPreview !== null) return;
      const el = this.$refs.stripScroll;
      if (!el) return;
      const focus = el.scrollTop + el.clientHeight * 0.4;
      const els = el.querySelectorAll('.strip-page');
      let idx = 0;
      for (let i = 0; i < els.length; i++) {
        if (els[i].offsetTop <= focus) idx = i;else break;
      }
      if (idx !== this.currentPage) {
        this.currentPage = idx;
        this.scheduleSync();
      }
    },
    seekStripPage(idx) {
      const el = this.$refs.stripScroll;
      if (!el) return;
      const target = el.querySelectorAll('.strip-page')[idx];
      if (target) el.scrollTop = target.offsetTop;
    },
    // ===== 页漫翻页 =====
    stepPage(delta) {
      const dirDelta = this.readingDirection === 'rtl' ? -delta : delta;
      this.goToPage(this.currentPage + dirDelta);
    },
    goToPage(idx) {
      this.resetZoom();
      if (!Number.isFinite(Number(idx)) || !this.pages.length) return;
      idx = Math.floor(Number(idx));
      if (idx < 0) {
        if (this.hasPrevEpisode) this.prevEpisode(true);
        return;
      }
      if (idx >= this.pages.length) {
        if (this.hasNextEpisode) this.nextEpisode();else this.$message.info('已是最后一页');
        return;
      }
      this.currentPage = idx;
      this.$nextTick(() => {
        var _this$$refs$stage;
        return (_this$$refs$stage = this.$refs.stage) === null || _this$$refs$stage === void 0 ? void 0 : _this$$refs$stage.focus();
      });
      this.scheduleSync();
    },
    onPageSlider(value) {
      this.resetZoom();
      const idx = Math.min(this.pages.length - 1, Math.max(0, Math.floor(Number(value) || 1) - 1));
      this.currentPage = idx;
      if (this.mode === 'strip') this.seekStripPage(idx);
      this.scheduleSync();
    },
    // ===== 话数切换 =====
    prevEpisode(fromEnd = false) {
      if (!this.hasPrevEpisode) {
        this.$message.info('已经是第一话了');
        return;
      }
      const idx = this.currentIdx - 1;
      this.openArticle(this.articles[idx].article_id, 0, idx, fromEnd === true ? 'end' : null);
    },
    nextEpisode() {
      if (!this.hasNextEpisode) {
        this.$message.info('已经是最后一话了');
        return;
      }
      const idx = this.currentIdx + 1;
      this.openArticle(this.articles[idx].article_id, 0, idx);
    },
    jumpToEpisode(idx) {
      this.openCatalog = false;
      if (idx === this.currentIdx) return;
      this.openArticle(this.articles[idx].article_id, 0, idx);
    },
    async preloadNextEpisode() {
      if (!this.hasNextEpisode) return;
      const id = this.articles[this.currentIdx + 1].article_id,
        version = this.loadRequestId,
        quality = this.imageQuality;
      if (this.preloadedChapter === id) return;
      this.preloadedChapter = id;
      try {
        const rows = await this.$api.reader.article(id),
          article = rows && rows[0];
        if (version !== this.loadRequestId || quality !== this.imageQuality) return;
        if (!article || Number(article.article_id) !== Number(id) || Number(article.novel_id) !== Number(this.novelId) || Number(article.is_draft) === 1) throw Error('Unavailable');
        const first = Object(manga_content["c" /* mangaPages */])(article.content)[0];
        if (first) {
          const image = new Image();
          image.src = Object(manga_content["b" /* mangaPageSource */])(first, quality);
        }
      } catch (_) {
        if (version === this.loadRequestId) this.preloadedChapter = null;
      }
    },
    scheduleSync() {
      this.checkAccount();
      this.progressDirty = true;
      this.syncProgress(false);
      if (this.currentPage >= this.pages.length - 2) this.preloadNextEpisode();
      clearTimeout(this.progressTimer);
      this.progressTimer = setTimeout(() => {
        this.progressTimer = null;
        this.progressDirty = true;
        this.syncProgress(true);
      }, 1500);
    },
    async syncProgress(force) {
      var _this$articles$this$c;
      if (this.checkAccount() || !this.progressDirty || !this.articleData || !this.novelId || !this.pages.length) return;
      const token = Object(reading["c" /* readingToken */])(),
        version = this.identityVersion,
        id = this.articleId,
        payload = {
          novel_id: Number(this.novelId),
          article_id: Number(id),
          article_chapter: Number((_this$articles$this$c = this.articles[this.currentIdx]) === null || _this$articles$this$c === void 0 ? void 0 : _this$articles$this$c.article_chapter) || null,
          page_idx: Math.min(Math.max(0, Math.floor(this.currentPage)), this.pages.length - 1)
        };
      Object(reading_history["d" /* recordLocalReading */])(this.workInfo || {
        novel_id: Number(this.novelId),
        name: this.novelName,
        novel_type: 'manga'
      }, {
        last_article_id: payload.article_id,
        last_article_chapter: payload.article_chapter,
        last_page_idx: payload.page_idx
      });
      if (!force) return;
      this.progressDirty = false;
      if (!token) return;
      this.progressWrites++;
      try {
        await this.$api.reading.saveProgress(payload);
        if (this.currentScope(version, token, id)) this.progressError = '';
      } catch (_) {
        if (this.currentScope(version, token, id)) {
          this.progressDirty = true;
          this.progressError = '云端进度保存失败，本机进度已保留。';
        }
      } finally {
        if (version === this.identityVersion) this.progressWrites = Math.max(0, this.progressWrites - 1);
      }
    },
    // ===== 评论 =====
    openCommentPanel() {
      this.commentVisible = true;
    },
    async loadCommentAmount() {
      const version = ++this.commentVersion,
        id = this.articleId;
      try {
        const count = await Object(manga_comment_api["c" /* fetchMangaCommentAmount */])(_articleIdvue_type_script_lang_js_baseUrl, this.novelId, id);
        if (version === this.commentVersion && Number(id) === Number(this.articleId)) this.commentAmount = count;
      } catch (_) {}
    },
    toggleDanmu() {
      this.danmuEnabled = !this.danmuEnabled;
      this.savePreferences();
    },
    async loadDanmus() {
      const version = ++this.danmuVersion,
        id = this.articleId;
      this.danmuLoading = true;
      this.danmuError = '';
      try {
        const list = await fetchMangaDanmus(_articleIdvue_type_script_lang_js_baseUrl, this.novelId, id);
        if (version === this.danmuVersion && Number(id) === Number(this.articleId)) this.danmuList = list;
      } catch (error) {
        if (version === this.danmuVersion) this.danmuError = getMangaDanmuErrorMessage(error, '弹幕加载失败');
      } finally {
        if (version === this.danmuVersion) this.danmuLoading = false;
      }
    },
    requireLogin() {
      this.checkAccount();
      if (Object(reading["c" /* readingToken */])()) return true;
      this.$router.push({
        path: '/login',
        query: {
          redirect: Object(login_return["a" /* loginReturnPath */])(this.$route.fullPath)
        }
      });
      return false;
    },
    async submitDanmu() {
      if (!this.requireLogin() || this.danmuSending) return;
      const content = this.danmuInput.trim();
      if (!content || content.length > 100) return;
      const token = Object(reading["c" /* readingToken */])(),
        version = this.identityVersion,
        id = this.articleId,
        novelId = this.novelId,
        pageIdx = this.currentPage,
        epoch = this.loadRequestId,
        sync = this.danmuSyncComment;
      this.danmuSending = true;
      this.danmuError = '';
      const current = () => this.currentScope(version, token, id) && epoch === this.loadRequestId;
      try {
        const danmu = await sendMangaDanmu(_articleIdvue_type_script_lang_js_baseUrl, {
          novelId,
          articleId: id,
          pageIdx,
          content
        }, token);
        if (!current()) return;
        this.danmuList = this.danmuList.filter(item => item.danmuId !== danmu.danmuId).concat(danmu);
        this.danmuInput = '';
        this.danmuReplayTick++;
        if (sync) {
          try {
            if (!current()) return;
            await Object(manga_comment_api["h" /* publishMangaComment */])(_articleIdvue_type_script_lang_js_baseUrl, {
              novelId,
              articleId: id,
              content,
              images: []
            });
            if (!current()) return;
            this.loadCommentAmount();
            this.$message.success('弹幕已发送，并同步为本话评论');
          } catch (error) {
            if (current()) this.danmuError = '弹幕已发送；' + Object(manga_comment_api["f" /* getMangaCommentErrorMessage */])(error, '同步评论失败');
          }
        }
      } catch (error) {
        if (current()) this.danmuError = getMangaDanmuErrorMessage(error);
      } finally {
        if (current()) this.danmuSending = false;
      }
    },
    async removeDanmu(danmuId) {
      if (!this.requireLogin()) return;
      const target = this.danmuList.find(item => Number(item.danmuId) === Number(danmuId));
      if (!target || ![target.userId, this.workAuthorId].some(id => id != null && String(id) === String(this.currentUserId))) return;
      const token = Object(reading["c" /* readingToken */])(),
        version = this.identityVersion,
        id = this.articleId,
        epoch = this.loadRequestId;
      try {
        await this.$confirm('确定删除这条弹幕吗？', '删除弹幕', {
          type: 'warning'
        });
        if (!this.currentScope(version, token, id) || epoch !== this.loadRequestId) return;
        await deleteMangaDanmu(_articleIdvue_type_script_lang_js_baseUrl, danmuId, token);
        if (!this.currentScope(version, token, id) || epoch !== this.loadRequestId) return;
        this.danmuList = this.danmuList.filter(item => item.danmuId !== danmuId);
        this.danmuReplayTick++;
        this.$message.success('已删除');
      } catch (error) {
        if (error !== 'cancel' && error !== 'close' && this.currentScope(version, token, id)) this.danmuError = getMangaDanmuErrorMessage(error, '删除失败');
      }
    },
    // ===== 交互 =====
    handleKeydown(e) {
      var _e$target;
      const modal = () => document.querySelector('.el-dialog__wrapper:not([style*="display: none"]),.el-message-box__wrapper:not([style*="display: none"]),.image-preview-container');
      if (e.key === 'Escape') {
        if (this.stripPreview !== null) this.closeStripPreview();else if (modal()) return;else if (this.settingsVisible) this.settingsVisible = false;else if (this.commentVisible) this.commentVisible = false;else if (this.openCatalog) this.openCatalog = false;else if (this.zoomed) this.resetZoom();
        return;
      }
      const tag = e.target && e.target.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(tag) || (_e$target = e.target) !== null && _e$target !== void 0 && _e$target.isContentEditable || e.ctrlKey || e.metaKey || e.altKey || this.zoomed || this.commentVisible || this.openCatalog || this.settingsVisible || this.stripPreview !== null || modal() || this.mode !== 'paged') return;
      if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
        this.stepPage(1);
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        e.preventDefault();
        this.stepPage(-1);
      } else if (e.key === ' ') {
        e.preventDefault();
        this.goToPage(this.currentPage + 1);
      }
    },
    goBack() {
      if (this.novelId) {
        this.$router.push(`/manga/${this.novelId}`);
      } else {
        this.$router.back();
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/manga/read/_articleId.vue?vue&type=script&lang=js
 /* harmony default export */ var read_articleIdvue_type_script_lang_js = (_articleIdvue_type_script_lang_js); 
// CONCATENATED MODULE: ./pages/manga/read/_articleId.vue



function _articleId_injectStyles (context) {
  
  var style0 = __webpack_require__(354)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var _articleId_component = Object(componentNormalizer["a" /* default */])(
  read_articleIdvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  _articleId_injectStyles,
  "9edeed2c",
  "5823f04a"
  
)

/* harmony default export */ var _articleId = __webpack_exports__["default"] = (_articleId_component.exports);

/***/ })

};;
//# sourceMappingURL=_articleId.js.map