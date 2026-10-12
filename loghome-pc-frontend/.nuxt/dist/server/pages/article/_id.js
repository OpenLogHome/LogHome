exports.ids = [2];
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

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URLSearchParams) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return normalizeReaderPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return initialReaderPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return pageCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return pageAtCoordinate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return textReaderResumeUrl; });
function normalizeReaderPosition(value = {}) {
  var _value$paragraphId, _value$charOffset, _value$pageIndex;
  const integer = value => Number.isSafeInteger(Number(value)) && Number(value) >= 0 ? Number(value) : 0;
  return {
    paragraphId: integer((_value$paragraphId = value.paragraphId) !== null && _value$paragraphId !== void 0 ? _value$paragraphId : value.last_paragraph_id),
    charOffset: integer((_value$charOffset = value.charOffset) !== null && _value$charOffset !== void 0 ? _value$charOffset : value.last_char_offset),
    pageIndex: integer((_value$pageIndex = value.pageIndex) !== null && _value$pageIndex !== void 0 ? _value$pageIndex : value.last_page_idx)
  };
}
function initialReaderPosition(query = {}, saved, articleId) {
  if (Number(query.paragraphId) > 0) return normalizeReaderPosition({
    paragraphId: query.paragraphId,
    charOffset: query.charOffset
  });
  if (query.edge === 'end') return {
    paragraphId: 0,
    charOffset: 0,
    pageIndex: Number.MAX_SAFE_INTEGER
  };
  if (query.start === '1') return normalizeReaderPosition();
  if (query.pageIdx != null) return normalizeReaderPosition({
    pageIndex: query.pageIdx
  });
  if (saved && Number(saved.last_article_id) === Number(articleId)) return normalizeReaderPosition(saved);
  return normalizeReaderPosition({
    pageIndex: query.pageIdx
  });
}
function pageCount(scrollWidth, width, gap = 40) {
  return Math.max(1, Math.ceil((scrollWidth + gap - 1) / (width + gap)));
}
function pageAtCoordinate(coordinate, origin, currentPage, width, gap = 40) {
  return Math.max(0, Math.floor((coordinate - origin + currentPage * (width + gap) + .5) / (width + gap)));
}
function textReaderResumeUrl(record) {
  const id = Number(record && record.last_article_id);
  if (!(id > 0)) return '';
  const position = normalizeReaderPosition(record);
  const params = new URLSearchParams({
    resume: '1'
  });
  if (position.paragraphId) {
    params.set('paragraphId', position.paragraphId);
    if (position.charOffset) params.set('charOffset', position.charOffset);
  } else params.set('pageIdx', position.pageIndex);
  return `/article/${id}?${params}`;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)["URLSearchParams"]))

/***/ }),

/***/ 163:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MEMBER_THEMES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return THEME_NAMES; });
/* unused harmony export PREFERENCE_KEY */
/* unused harmony export THEME_MEMORY_KEY */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DEFAULT_PREFERENCES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return normalizePreferences; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return readPreferences; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return savePreferences; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return readerThemeMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return readReaderTheme; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return rememberReaderTheme; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return membershipTier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return canUseBackground; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return safeFontUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return readerFonts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return fontIdentity; });
/* harmony import */ var _config_reader_themes_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(170);
var _config_reader_themes_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(170, 1);
/* harmony reexport (default from named exports) */ __webpack_require__.d(__webpack_exports__, "o", function() { return _config_reader_themes_json__WEBPACK_IMPORTED_MODULE_0__; });
/* harmony import */ var _config_reader_fonts_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(202);
var _config_reader_fonts_json__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(202, 1);



const MEMBER_THEMES = ['wavechaser', 'powderblue', 'qingyun', 'sunburst', 'thorncrown', 'chocolate'];
const THEME_NAMES = {
  white: '蛙鸣白',
  yellow: '原木黄',
  green: '草原绿',
  blue: '晴空蓝',
  purple: '末地紫',
  pink: '桃花粉',
  black: '虚空黑',
  wavechaser: '追波',
  powderblue: '粉蓝',
  qingyun: '青云',
  sunburst: '艳阳',
  thorncrown: '荆棘冠',
  chocolate: '巧克力',
  blockepoch: '方块纪元'
};
const PREFERENCE_KEY = 'loghome:reader:preferences:v1';
const THEME_MEMORY_KEY = 'loghome:reader:theme-memory:v1';
const DEFAULT_PREFERENCES = Object.freeze({
  mode: 'page',
  theme: 'white',
  font: 'default',
  fontSize: 22,
  lineHeight: 1.8,
  backgroundSkinKey: '',
  width: 860
});
const THEME_ALIASES = {
  light: 'white',
  sepia: 'yellow',
  dark: 'black'
};
function normalizePreferences(value = {}) {
  if (!value || typeof value !== 'object') value = {};
  const theme = THEME_ALIASES[value.theme] || value.theme;
  const bounded = (input, min, max, fallback) => Number.isFinite(Number(input)) && input !== '' && input != null ? Math.max(min, Math.min(max, Number(input))) : fallback;
  return {
    mode: value.mode === 'text' ? 'text' : 'page',
    theme: Object.prototype.hasOwnProperty.call(_config_reader_themes_json__WEBPACK_IMPORTED_MODULE_0__, theme) ? theme : 'white',
    font: typeof value.font === 'string' && value.font.length <= 64 ? value.font : 'default',
    fontSize: Math.round(bounded(value.fontSize, 14, 36, DEFAULT_PREFERENCES.fontSize)),
    lineHeight: bounded(value.lineHeight, 1.3, 2.5, 1.8),
    backgroundSkinKey: typeof value.backgroundSkinKey === 'string' ? value.backgroundSkinKey.slice(0, 64) : '',
    width: Math.round(bounded(value.width, 620, 1120, DEFAULT_PREFERENCES.width))
  };
}
function readPreferences(storage) {
  try {
    const saved = storage.getItem(PREFERENCE_KEY);
    if (saved) return normalizePreferences(JSON.parse(saved));
    // Preserve existing desktop choices on upgrade; do not import mobile rpx as desktop pixels.
    const oldFont = storage.getItem('reading_font_family');
    return normalizePreferences({
      mode: storage.getItem('readerProps'),
      theme: storage.getItem('reading_theme'),
      fontSize: storage.getItem('reading_font_size'),
      font: ['serif', 'sans-serif'].includes(oldFont) ? oldFont : 'default'
    });
  } catch (_) {
    return {
      ...DEFAULT_PREFERENCES
    };
  }
}
function savePreferences(storage, value) {
  try {
    storage.setItem(PREFERENCE_KEY, JSON.stringify(normalizePreferences(value)));
    return true;
  } catch (_) {
    return false;
  }
}
function readerThemeMode(selection) {
  const theme = _config_reader_themes_json__WEBPACK_IMPORTED_MODULE_0__[selection && selection.theme] || _config_reader_themes_json__WEBPACK_IMPORTED_MODULE_0__.white;
  if (typeof theme.isBlack === 'boolean') return theme.isBlack ? 'dark' : 'light';
  const value = String(theme.backgroundColor || '').replace(/^#/, '');
  const hex = value.length === 3 ? value.split('').map(char => char + char).join('') : value.slice(0, 6);
  if (!/^[0-9a-f]{6}$/i.test(hex)) return 'light';
  const channels = [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16) / 255).map(channel => channel <= .04045 ? channel / 12.92 : Math.pow((channel + .055) / 1.055, 2.4));
  return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2] < .35 ? 'dark' : 'light';
}
function themeSelection(value) {
  if (!value || typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(_config_reader_themes_json__WEBPACK_IMPORTED_MODULE_0__, value.theme)) return null;
  return {
    theme: value.theme,
    backgroundSkinKey: typeof value.backgroundSkinKey === 'string' ? value.backgroundSkinKey.slice(0, 64) : ''
  };
}
function readReaderTheme(storage, mode) {
  const fallback = {
    theme: mode === 'dark' ? 'black' : 'white',
    backgroundSkinKey: ''
  };
  try {
    const memory = JSON.parse(storage.getItem(THEME_MEMORY_KEY) || '{}');
    const selected = themeSelection(memory && memory[mode]);
    return selected && readerThemeMode(selected) === mode ? selected : fallback;
  } catch (_) {
    return fallback;
  }
}
function rememberReaderTheme(storage, selection) {
  const selected = themeSelection(selection);
  if (!selected) return false;
  try {
    let memory;
    try {
      memory = JSON.parse(storage.getItem(THEME_MEMORY_KEY) || '{}');
    } catch (_) {}
    const light = themeSelection(memory && memory.light),
      dark = themeSelection(memory && memory.dark);
    memory = {};
    if (light && readerThemeMode(light) === 'light') memory.light = light;
    if (dark && readerThemeMode(dark) === 'dark') memory.dark = dark;
    memory[readerThemeMode(selected)] = selected;
    storage.setItem(THEME_MEMORY_KEY, JSON.stringify(memory));
    return true;
  } catch (_) {
    return false;
  }
}
function membershipTier(response) {
  const status = response && response.data ? response.data : response;
  const tier = status && status.active && status.subscription && status.subscription.membership_type;
  return ['standard', 'super'].includes(tier) ? tier : '';
}
function canUseBackground(required, tier) {
  if (!required || required === 'none') return true;
  return required === 'standard' ? ['standard', 'super'].includes(tier) : required === 'super' && tier === 'super';
}
function safeFontUrl(value) {
  return typeof value === 'string' && /^https?:\/\/[^\s"\\]+$/i.test(value) ? value : '';
}
function readerFonts(serverFonts) {
  if (!Array.isArray(serverFonts)) return JSON.parse(JSON.stringify(_config_reader_fonts_json__WEBPACK_IMPORTED_MODULE_1__));
  const fonts = {
    default: _config_reader_fonts_json__WEBPACK_IMPORTED_MODULE_1__.default
  };
  serverFonts.forEach(item => {
    if (!item || !item.font_key || !item.font_name || !safeFontUrl(item.regular_url)) return;
    // An enabled server list is authoritative, including an intentionally empty list.
    const key = String(item.font_key).slice(0, 64);
    if (['__proto__', 'constructor', 'prototype', 'default'].includes(key)) return;
    fonts[key] = {
      name: String(item.font_name).slice(0, 64),
      version: String(item.font_version || '1'),
      regular: {
        url: item.regular_url
      },
      bold: safeFontUrl(item.bold_url) ? {
        url: item.bold_url
      } : null
    };
  });
  return fonts;
}
function fontIdentity(key, config) {
  const source = `${key}|${config.version}|${config.regular && config.regular.url}|${config.bold && config.bold.url}`;
  let hash = 2166136261;
  for (let index = 0; index < source.length; index++) hash = Math.imul(hash ^ source.charCodeAt(index), 16777619);
  return `LogHomeReader${(hash >>> 0).toString(16)}`;
}

/***/ }),

/***/ 170:
/***/ (function(module) {

module.exports = JSON.parse("{\"white\":{\"backgroundColor\":\"#FEFEFC\",\"fontColor\":\"#292927\",\"secondaryFontColor\":\"#757571\",\"lineColor\":\"#656560\",\"isBlack\":false},\"green\":{\"backgroundColor\":\"#F5FAF4\",\"fontColor\":\"#395744\",\"secondaryFontColor\":\"#708572\",\"lineColor\":\"#4F7C5B\",\"isBlack\":false},\"yellow\":{\"backgroundColor\":\"#FCF8EF\",\"fontColor\":\"#5C4B3B\",\"secondaryFontColor\":\"#867565\",\"lineColor\":\"#9B6E3B\",\"isBlack\":false},\"blue\":{\"backgroundColor\":\"#F4FAFC\",\"fontColor\":\"#27566B\",\"secondaryFontColor\":\"#64808E\",\"lineColor\":\"#356F88\",\"isBlack\":false},\"purple\":{\"backgroundColor\":\"#FAF7FC\",\"fontColor\":\"#57445F\",\"secondaryFontColor\":\"#827387\",\"lineColor\":\"#765983\",\"isBlack\":false},\"pink\":{\"backgroundColor\":\"#FBF6F8\",\"fontColor\":\"#664858\",\"secondaryFontColor\":\"#8A707B\",\"lineColor\":\"#9D6578\",\"isBlack\":false},\"black\":{\"backgroundColor\":\"#22272E\",\"fontColor\":\"#D9DEE7\",\"secondaryFontColor\":\"#B5BECB\",\"lineColor\":\"#E6CDA6\",\"isBlack\":true},\"wavechaser\":{\"backgroundColor\":\"#E84F89\",\"fontColor\":\"#32101F\",\"secondaryFontColor\":\"#6B2844\",\"lineColor\":\"#7A1F48\",\"isBlack\":false},\"powderblue\":{\"backgroundColor\":\"#ACE5E2\",\"fontColor\":\"#244244\",\"secondaryFontColor\":\"#547477\",\"lineColor\":\"#387A7B\",\"isBlack\":false},\"qingyun\":{\"backgroundColor\":\"#313B3E\",\"fontColor\":\"#E7EEEF\",\"secondaryFontColor\":\"#B8C4C6\",\"lineColor\":\"#86D2D1\",\"isBlack\":true},\"sunburst\":{\"backgroundColor\":\"#FCD23C\",\"fontColor\":\"#493900\",\"secondaryFontColor\":\"#705A00\",\"lineColor\":\"#8C6500\",\"isBlack\":false},\"thorncrown\":{\"backgroundColor\":\"#7D2120\",\"fontColor\":\"#F6E8E5\",\"secondaryFontColor\":\"#D8B7B2\",\"lineColor\":\"#F1BA80\",\"isBlack\":true},\"chocolate\":{\"backgroundColor\":\"#380001\",\"fontColor\":\"#F4E7E1\",\"secondaryFontColor\":\"#CDB7AF\",\"lineColor\":\"#D5A26A\",\"isBlack\":true},\"blockepoch\":{\"backgroundColor\":\"#DCE3C2\",\"fontColor\":\"#273421\",\"secondaryFontColor\":\"#58684D\",\"lineColor\":\"#A6382C\",\"isBlack\":false}}");

/***/ }),

/***/ 171:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(204);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("2426c898", content, true, context)
};

/***/ }),

/***/ 172:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(206);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("112e4ff4", content, true, context)
};

/***/ }),

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(208);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("2c975779", content, true, context)
};

/***/ }),

/***/ 175:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(212);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("692a0944", content, true, context)
};

/***/ }),

/***/ 176:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(214);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("55737f6e", content, true, context)
};

/***/ }),

/***/ 202:
/***/ (function(module) {

module.exports = JSON.parse("{\"default\":{\"name\":\"系统默认\",\"family\":\"\",\"familyBold\":\"\",\"version\":\"1\"},\"方正书宋\":{\"name\":\"方正书宋\",\"family\":\"FangZhengShuSongJianTi\",\"familyBold\":\"FangZhengShuSongJianTi\",\"version\":\"20260318\",\"regular\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841456048\",\"format\":\"ttf\"},\"bold\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841456048\",\"format\":\"ttf\"}},\"思源黑体\":{\"name\":\"思源黑体\",\"family\":\"SourceHanSansSCRegular\",\"familyBold\":\"SourceHanSansSCBold\",\"version\":\"20260318\",\"regular\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841455677\",\"format\":\"otf\"},\"bold\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841453935\",\"format\":\"otf\"}},\"方正楷体\":{\"name\":\"方正楷体\",\"family\":\"FangZhengKaiTiJianTi\",\"familyBold\":\"FangZhengKaiTiJianTi\",\"version\":\"20260318\",\"regular\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841453504\",\"format\":\"ttf\"},\"bold\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841453504\",\"format\":\"ttf\"}},\"霞鹜文楷\":{\"name\":\"霞鹜文楷\",\"family\":\"LXGWWenKaiRegular\",\"familyBold\":\"LXGWWenKaiMedium\",\"version\":\"20260318\",\"regular\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841453453\",\"format\":\"ttf\"},\"bold\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841454916\",\"format\":\"ttf\"}}}");

/***/ }),

/***/ 203:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderContent_vue_vue_type_style_index_0_id_a73249e0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(171);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderContent_vue_vue_type_style_index_0_id_a73249e0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderContent_vue_vue_type_style_index_0_id_a73249e0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderContent_vue_vue_type_style_index_0_id_a73249e0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderContent_vue_vue_type_style_index_0_id_a73249e0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 204:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-highlight[data-v-a73249e0] { text-decoration: underline; text-decoration-color: #b19158; text-underline-offset: 5px;\n}.reader-speaking[data-v-a73249e0] { background: #e5ecd7; border-radius: 3px;\n}.vocabulary-card[data-v-a73249e0] { margin: 20px 0;\n}.vocabulary-image[data-v-a73249e0] { max-width: 100%; max-height: 420px; object-fit: contain; display: block; margin: 0 auto 24px; cursor: zoom-in;\n}dl[data-v-a73249e0] { display: grid; grid-template-columns: minmax(70px, 160px) minmax(0,1fr); gap: 12px; border: 1px solid #dfd5c9; border-radius: 8px; padding: 20px; font-size: .8em;\n}dt[data-v-a73249e0] { font-weight: 600;\n}dd[data-v-a73249e0] { white-space: pre-wrap; overflow-wrap: anywhere;\n}.vocabulary-relations[data-v-a73249e0] { border-top: 1px solid #dfd5c9; padding-top: 20px;\n}.vocabulary-relations h3[data-v-a73249e0] { font-size: .85em; margin-bottom: 14px;\n}.vocabulary-relations a[data-v-a73249e0] { display: inline-flex; gap: 10px; margin: 5px; padding: 7px 12px; border: 1px solid #dfd5c9; border-radius: 6px; font-size: .8em; color: inherit; text-decoration: none;\n}.vocabulary-relations small[data-v-a73249e0] { opacity: .65;\n}button[data-v-a73249e0]:focus-visible,a[data-v-a73249e0]:focus-visible { outline: 2px solid #947358;\n}\n.reader-content .paragraph-comment-icon[data-v-a73249e0] { display: inline-flex; align-items: center; justify-content: center; gap: 4px; height: 28px; padding: 4px 8px; margin-left: 8px; border: 1px solid transparent; border-radius: 6px; background: rgba(121, 87, 60, .08); color: var(--reader-secondary, #79573c); font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 12px; font-weight: 500; line-height: 1; font-variant-numeric: tabular-nums; white-space: nowrap; vertical-align: middle; cursor: pointer; text-indent: 0; transition: background-color .15s;\n}\n.paragraph-comment-icon .site-icon[data-v-a73249e0] { width: 16px; height: 16px;\n}\n.reader-content .paragraph-comment-icon[data-v-a73249e0]:hover { background: rgba(121, 87, 60, .16); color: inherit;\n}\n.reader-content .paragraph-comment-icon[data-v-a73249e0]:focus-visible { outline: 2px solid var(--reader-secondary, #79573c); outline-offset: 2px;\n}\n@media(prefers-reduced-motion:reduce) {\n.reader-content .paragraph-comment-icon[data-v-a73249e0] { transition: none;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 205:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPager_vue_vue_type_style_index_0_id_1bdf15ee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(172);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPager_vue_vue_type_style_index_0_id_1bdf15ee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPager_vue_vue_type_style_index_0_id_1bdf15ee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPager_vue_vue_type_style_index_0_id_1bdf15ee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPager_vue_vue_type_style_index_0_id_1bdf15ee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 206:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-viewport[data-v-1bdf15ee] { width: calc(100% - 80px); margin: 0 auto;\n}.reader-prose[data-v-1bdf15ee] { padding: 28px 0 45px !important; margin: 0 auto; overflow-wrap: anywhere;\n}.is-paged .reader-viewport[data-v-1bdf15ee] { overflow: hidden;\n}.is-paged .reader-prose[data-v-1bdf15ee] { padding: 0 !important; margin: 0; column-fill: auto; will-change: transform;\n}.reader-prose[data-v-1bdf15ee] .article-paragraph { orphans: 2; widows: 2;\n}.is-paged .reader-prose[data-v-1bdf15ee] .vocabulary-image { max-height: calc(var(--reader-page-height) * .5);\n}.is-paged .reader-prose[data-v-1bdf15ee] .article-image { margin: 0 0 12px !important; break-inside: avoid; display: flex; justify-content: center;\n}\n.is-paged .reader-prose[data-v-1bdf15ee] .article-image img { max-height: calc(var(--reader-page-height) - 50px); max-width: 100% !important; object-fit: contain; display: block; margin: 0;\n}.page-navigation[data-v-1bdf15ee] { display: flex; align-items: center; justify-content: center; gap: 24px; padding: 22px 20px 8px;\n}button[data-v-1bdf15ee] { border: 1px solid #a7947b; border-radius: 5px; background: transparent; color: inherit; padding: 9px 18px; cursor: pointer; white-space: nowrap;\n}button[data-v-1bdf15ee]:disabled { opacity: .4; cursor: default;\n}.page-progress[data-v-1bdf15ee] { display: flex; gap: 10px; align-items: center; font-size: 12px;\n}.page-progress input[data-v-1bdf15ee] { width: 160px; accent-color: #947358;\n}.page-hint[data-v-1bdf15ee] { font-size: 11px; color: var(--reader-secondary); text-align: center; margin: 8px 15px 0; padding-bottom: 20px;\n}button[data-v-1bdf15ee]:focus-visible,input[data-v-1bdf15ee]:focus-visible { outline: 2px solid var(--reader-line); outline-offset: 2px;\n}@media(max-width:700px) {\n.reader-viewport[data-v-1bdf15ee] { width: calc(100% - 40px);\n}.page-navigation[data-v-1bdf15ee] { gap: 8px; padding: 16px 10px 8px;\n}.page-progress[data-v-1bdf15ee] { flex-direction: column; gap: 5px;\n}.page-progress input[data-v-1bdf15ee] { width: 100px;\n}button[data-v-1bdf15ee] { padding: 8px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 207:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderSettings_vue_vue_type_style_index_0_id_1368486d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(173);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderSettings_vue_vue_type_style_index_0_id_1368486d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderSettings_vue_vue_type_style_index_0_id_1368486d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderSettings_vue_vue_type_style_index_0_id_1368486d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderSettings_vue_vue_type_style_index_0_id_1368486d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 208:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-settings-shell[data-v-1368486d] { display: flex; flex-direction: column; flex: 1; min-height: 0; height: 100%; overflow: hidden;\n}\n.reader-settings[data-v-1368486d] { flex: 1; min-height: 0; padding: 0 24px 30px; overflow-y: auto; color: #433b35; font-size: 14px;\n}section[data-v-1368486d] { border-bottom: 1px solid #eae5df; padding-bottom: 22px; margin-bottom: 20px;\n}h3[data-v-1368486d] { font-size: 15px; display: flex; justify-content: space-between; align-items: center; margin: 5px 0 18px;\n}h3 small[data-v-1368486d] { font-weight: 400; font-size: 12px;\n}button[data-v-1368486d] { cursor: pointer; border: 1px solid #ded8cf; background: #fff; color: inherit; border-radius: 6px; padding: 8px 12px;\n}button[data-v-1368486d]:disabled { opacity: .5; cursor: default;\n}button[aria-pressed=\"true\"][data-v-1368486d] { border-color: #806649; box-shadow: inset 0 0 0 1px #806649;\n}.setting-row[data-v-1368486d] { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin: 14px 0;\n}.stepper[data-v-1368486d],.options[data-v-1368486d] { display: flex; align-items: center; gap: 6px;\n}output[data-v-1368486d] { font-variant-numeric: tabular-nums; font-size: 12px;\n}.stepper output[data-v-1368486d] { width: 58px; text-align: center;\n}.width-control[data-v-1368486d] { display: flex; align-items: center; gap: 10px; min-width: 0;\n}.width-control input[data-v-1368486d] { width: 130px; accent-color: #806649;\n}.font-grid[data-v-1368486d] { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px;\n}.font-grid button[data-v-1368486d] { display: flex; flex-direction: column; gap: 8px; text-align: left; padding: 12px;\n}.font-grid span[data-v-1368486d],small[data-v-1368486d] { color: #85776b; font-size: 12px;\n}.themes[data-v-1368486d] { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px;\n}.themes button[data-v-1368486d] { display: flex; justify-content: space-between; align-items: center; padding: 12px 8px;\n}.skin-grid[data-v-1368486d] { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px;\n}.skin-grid button[data-v-1368486d] { padding: 0 0 8px; overflow: hidden; min-width: 0;\n}.skin-preview[data-v-1368486d] { width: 100%; height: 65px; object-fit: cover;\n}.plain[data-v-1368486d] { display: flex; align-items: center; justify-content: center; font-size: 22px; color: #6a624c;\n}.skin-grid span[data-v-1368486d],.skin-grid small[data-v-1368486d] { display: block; font-size: 12px; margin: 5px 2px 0;\n}.refresh[data-v-1368486d] { border: 0; padding: 4px; background: none; color: #806649; font-size: 12px; text-decoration: underline;\n}.error[data-v-1368486d] { color: #a44735; font-size: 12px; line-height: 1.7; margin: 12px 0;\n}.reset[data-v-1368486d] { width: 100%;\n}button[data-v-1368486d]:focus-visible,input[data-v-1368486d]:focus-visible { outline: 2px solid #806649; outline-offset: 2px;\n}@media(max-width:400px) {\n.reader-settings[data-v-1368486d] { padding: 0 14px 24px;\n}.themes[data-v-1368486d] { grid-template-columns: repeat(2,minmax(0,1fr));\n}.width-control input[data-v-1368486d] { width: 95px;\n}\n}\n.settings-feedback[data-v-1368486d] { flex: none; display: flex; align-items: center; gap: 12px; padding: 16px 24px calc(16px + env(safe-area-inset-bottom, 0px)); border-top: 1px solid var(--reading-line, #e4e3de); background: var(--reading-hover, #f5f4f0); color: var(--reading-ink, #302f2a);\n}\n.settings-feedback > i[data-v-1368486d] { align-self: flex-start; margin-top: 2px; color: var(--reading-accent, #79573c); font-size: 17px;\n}\n.feedback-copy[data-v-1368486d] { flex: 1; min-width: 0;\n}\n.feedback-copy strong[data-v-1368486d] { display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600;\n}\n.feedback-copy p[data-v-1368486d] { margin: 0; color: var(--reading-secondary, #615e57); font-size: 12px; line-height: 1.7; overflow-wrap: anywhere;\n}\n.membership-action[data-v-1368486d] { flex: none; min-height: 38px; padding: 8px 12px; border-color: var(--reading-line, #e4e3de); color: var(--reading-accent, #79573c); font: inherit; font-size: 13px; white-space: nowrap;\n}\n.membership-action[data-v-1368486d]:hover { border-color: var(--reading-accent, #79573c); background: var(--reading-surface, #fff);\n}\n@media(max-width:400px) {\n.settings-feedback[data-v-1368486d] { padding-left: 14px; padding-right: 14px; gap: 8px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 211:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ChapterCatalog_vue_vue_type_style_index_0_id_67243c9c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(175);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ChapterCatalog_vue_vue_type_style_index_0_id_67243c9c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ChapterCatalog_vue_vue_type_style_index_0_id_67243c9c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ChapterCatalog_vue_vue_type_style_index_0_id_67243c9c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ChapterCatalog_vue_vue_type_style_index_0_id_67243c9c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 212:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\nheader[data-v-67243c9c] { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; font-size: 13px; color: var(--reading-muted, #73716a); flex-wrap: wrap;\n}\nheader label[data-v-67243c9c], header div[data-v-67243c9c] { display: flex; align-items: center; gap: 10px; flex-wrap: wrap;\n}\ninput[data-v-67243c9c] { font: inherit; color: var(--reading-ink, #302f2a); background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de); padding: 10px 12px; border-radius: 6px; width: 220px; max-width: 100%;\n}\nbutton[data-v-67243c9c] { font: inherit; border: 1px solid var(--reading-line, #e4e3de); padding: 9px 12px; border-radius: 6px; background: var(--reading-surface, #fff); color: var(--reading-accent, #79573c); cursor: pointer;\n}\n.volume[data-v-67243c9c] { margin-bottom: 28px;\n}\n.volume-title[data-v-67243c9c] { border: none; background: var(--reading-hover, #f5f4f0); width: 100%; text-align: left; margin-bottom: 10px; font-size: 14px; font-weight: 600; padding: 14px 16px;\n}\n.volume-title small[data-v-67243c9c] { float: right; font-size: 12px; color: var(--reading-muted, #73716a); font-weight: 400;\n}\n.chapter-grid[data-v-67243c9c] { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px 24px;\n}\n.chapter-grid a[data-v-67243c9c] { min-width: 0; padding: 14px 16px; color: var(--reading-ink, #302f2a); text-decoration: none; border-radius: 6px; transition: background .18s ease;\n}\n.chapter-grid a[data-v-67243c9c]:hover { background: var(--reading-hover, #f5f4f0);\n}\n.chapter-grid a.current[data-v-67243c9c] { background: var(--reading-tint, #eee7de); color: var(--reading-accent, #79573c);\n}\n.chapter-label[data-v-67243c9c] { font-size: 14px; line-height: 1.7; overflow-wrap: anywhere;\n}\n.chapter-detail[data-v-67243c9c] { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 7px; font-size: 12px; color: var(--reading-muted, #73716a); font-variant-numeric: tabular-nums;\n}\n.chapter-detail small[data-v-67243c9c] { font-size: 11px;\n}\n.empty[data-v-67243c9c] { padding: 40px 16px; text-align: center; color: var(--reading-muted, #73716a); font-size: 14px;\n}\nbutton[data-v-67243c9c]:focus-visible,a[data-v-67243c9c]:focus-visible,input[data-v-67243c9c]:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px;\n}\n@media(max-width:700px) {\n.chapter-grid[data-v-67243c9c] { grid-template-columns: 1fr;\n}\n}\n@media(prefers-reduced-motion:reduce) {\n.chapter-grid a[data-v-67243c9c] { transition: none;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 213:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookExcerpts_vue_vue_type_style_index_0_id_78460448_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(176);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookExcerpts_vue_vue_type_style_index_0_id_78460448_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookExcerpts_vue_vue_type_style_index_0_id_78460448_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookExcerpts_vue_vue_type_style_index_0_id_78460448_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookExcerpts_vue_vue_type_style_index_0_id_78460448_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.book-excerpts[data-v-78460448] { padding: 24px; background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de); border-radius: 12px;\n}\nheader[data-v-78460448] { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 24px; flex-wrap: wrap;\n}\nh2[data-v-78460448] { color: var(--reading-ink, #302f2a); font-size: 20px; font-weight: 600;\n}\nheader div[data-v-78460448] { display: flex; gap: 6px; flex-wrap: wrap;\n}\nbutton[data-v-78460448] { padding: 9px 12px; border: 1px solid var(--reading-line, #e4e3de); border-radius: 6px; background: none; color: var(--reading-accent, #79573c); cursor: pointer; font: inherit; font-size: 13px;\n}\nbutton.active[data-v-78460448] { background: var(--reading-accent, #79573c); border-color: var(--reading-accent, #79573c); color: white;\n}\nbutton[data-v-78460448]:disabled { opacity: .5;\n}\n.empty[data-v-78460448] { padding: 40px 16px; text-align: center; color: var(--reading-muted, #73716a); font-size: 14px; line-height: 1.8;\n}\n.notice[data-v-78460448] { color: #9d503b; font-size: 13px; margin-bottom: 16px; line-height: 1.8;\n}\n.excerpts-grid[data-v-78460448] { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 20px;\n}\narticle[data-v-78460448] { padding: 24px; background: var(--reading-hover, #f5f4f0); border: 0; border-radius: 8px; min-width: 0;\n}\na[data-v-78460448] { color: inherit; text-decoration: none;\n}\nblockquote[data-v-78460448] { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 15px; line-height: 1.95; color: var(--reading-ink, #302f2a); border-left: 2px solid var(--reading-accent, #79573c); padding-left: 18px;\n}\narticle p[data-v-78460448], .excerpt-actions[data-v-78460448] { color: var(--reading-muted, #73716a); font-size: 12px; line-height: 1.8; margin-top: 20px;\n}\n.excerpt-actions[data-v-78460448] { display: flex; justify-content: flex-end;\n}\n.excerpt-actions button[data-v-78460448] { border: 0; font-size: 12px; padding: 4px 0;\n}\nbutton[data-v-78460448]:focus-visible,a[data-v-78460448]:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px;\n}\n@media(max-width:700px) {\n.excerpts-grid[data-v-78460448] { grid-template-columns: 1fr;\n}\n.book-excerpts[data-v-78460448] { padding: 20px 16px;\n}\narticle[data-v-78460448] { padding: 20px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 217:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderPager.vue?vue&type=template&id=1bdf15ee&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "reader-pager",
    class: {
      'is-paged': _vm.paged
    },
    attrs: {
      "data-paragraph-anchor": _vm.position.paragraphId,
      "data-char-offset": _vm.position.charOffset,
      "data-page-index": _vm.index
    }
  }, [_vm._ssrNode("<div tabindex=\"0\" role=\"region\" aria-label=\"章节正文\" class=\"reader-viewport\"" + _vm._ssrStyle(null, _vm.viewportStyle, null) + " data-v-1bdf15ee>", "</div>", [_vm._ssrNode("<div class=\"article-content reader-prose\"" + _vm._ssrStyle(null, _vm.proseStyle, null) + " data-v-1bdf15ee>", "</div>", [_c('ReaderContent', {
    attrs: {
      "article": _vm.article,
      "highlights": _vm.highlights,
      "counts": _vm.counts,
      "speaking-id": _vm.speakingId
    },
    on: {
      "paragraph-menu": function ($event) {
        return _vm.$emit('paragraph-menu', $event);
      },
      "comment": function ($event) {
        return _vm.$emit('comment', $event);
      },
      "layout": _vm.scheduleLayout
    }
  })], 1)]), _vm._ssrNode(" " + (_vm.paged ? "<nav aria-label=\"正文翻页\" class=\"page-navigation\" data-v-1bdf15ee><button" + _vm._ssrAttr("disabled", _vm.index <= 0 && !_vm.hasPrevious) + " data-v-1bdf15ee>← 上一页</button> <div class=\"page-progress\" data-v-1bdf15ee><span aria-live=\"polite\" data-v-1bdf15ee>" + _vm._ssrEscape(_vm._s(_vm.index + 1) + " / " + _vm._s(_vm.total) + " 页") + "</span><input aria-label=\"本章阅读进度\" type=\"range\" min=\"0\"" + _vm._ssrAttr("max", _vm.total - 1) + _vm._ssrAttr("value", _vm.index) + " data-v-1bdf15ee></div> <button" + _vm._ssrAttr("disabled", _vm.index >= _vm.total - 1 && !_vm.hasNext && !_vm.canFinish) + " data-v-1bdf15ee>" + _vm._ssrEscape(_vm._s(_vm.index >= _vm.total - 1 && !_vm.hasNext && _vm.canFinish ? '已读至最后 →' : '下一页 →')) + "</button></nav>" : "<!---->") + " " + (_vm.paged ? "<p class=\"page-hint\" data-v-1bdf15ee></p>" : "<!---->"))], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderPager.vue?vue&type=template&id=1bdf15ee&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderContent.vue?vue&type=template&id=a73249e0&scoped=true
var ReaderContentvue_type_template_id_a73249e0_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "reader-content"
  }, [_vm._ssrNode((_vm.article.article_type === 'worldVocabulary' ? "<section class=\"vocabulary-card\" data-v-a73249e0>" + (_vm.safeImage(_vm.vocabulary.pic) ? "<img" + _vm._ssrAttr("src", _vm.safeImage(_vm.vocabulary.pic)) + _vm._ssrAttr("alt", _vm.article.title) + " class=\"vocabulary-image\" data-v-a73249e0>" : "<!---->") + " " + (_vm.vocabulary.attributes && _vm.vocabulary.attributes.length ? "<dl data-v-a73249e0>" + _vm._ssrList(_vm.vocabulary.attributes, function (attribute, index) {
    return "<dt data-v-a73249e0>" + _vm._ssrEscape(_vm._s(attribute.name)) + "</dt><dd data-v-a73249e0>" + _vm._ssrEscape(_vm._s(attribute.content)) + "</dd>";
  }) + "</dl>" : "<!---->") + "</section>" : "<!---->") + " "), _vm._l(_vm.paragraphs, function (paragraph, index) {
    return [paragraph.type === 'text' ? _vm._ssrNode("<p" + _vm._ssrAttr("id", `paragraph-${paragraph.id}`) + _vm._ssrAttr("data-paragraph-id", paragraph.id) + _vm._ssrAttr("data-paragraph-text", encodeURIComponent(paragraph.value)) + _vm._ssrClass("article-paragraph", {
      'reader-highlight': _vm.highlights.some(item => Number(item.paragraph_id) === paragraph.id),
      'reader-speaking': Number(_vm.speakingId) === paragraph.id
    }) + " data-v-a73249e0>", "</p>", [_vm._ssrNode("<span class=\"paragraph-text\" data-v-a73249e0>" + _vm._ssrEscape(_vm._s(paragraph.value)) + "</span>"), _vm.counts[paragraph.id] ? _vm._ssrNode("<button type=\"button\"" + _vm._ssrAttr("aria-label", `查看本段 ${_vm.counts[paragraph.id]} 条评论`) + " class=\"paragraph-comment-icon\" data-v-a73249e0>", "</button>", [_c('SiteIcon', {
      attrs: {
        "name": "comment"
      }
    }), _vm._ssrNode("<span data-v-a73249e0>" + _vm._ssrEscape(_vm._s(_vm.counts[paragraph.id])) + "</span>")], 2) : _vm._e()], 2) : paragraph.type === 'image' && _vm.safeImage(paragraph.img || paragraph.value) ? _vm._ssrNode("<figure class=\"article-image\" data-v-a73249e0><img" + _vm._ssrAttr("src", _vm.safeImage(paragraph.img || paragraph.value)) + " alt=\"文章插图\" loading=\"lazy\" data-v-a73249e0></figure>") : _vm._e()];
  }), _vm._ssrNode(" "), _vm.vocabulary.relations && _vm.vocabulary.relations.length ? _vm._ssrNode("<section class=\"vocabulary-relations\" data-v-a73249e0>", "</section>", [_vm._ssrNode("<h3 data-v-a73249e0>关联词条</h3>"), _vm._l(_vm.vocabulary.relations, function (relation, index) {
    return _c('nuxt-link', {
      key: index,
      attrs: {
        "to": `/article/${Number(relation.id)}`
      }
    }, [_vm._v(_vm._s(relation.name) + " "), _c('small', [_vm._v(_vm._s(relation.relation))]), _vm._v(" →")]);
  })], 2) : _vm._e()], 2);
};
var ReaderContentvue_type_template_id_a73249e0_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderContent.vue?vue&type=template&id=a73249e0&scoped=true

// EXTERNAL MODULE: ./components/ui/SiteIcon.vue + 5 modules
var SiteIcon = __webpack_require__(122);

// EXTERNAL MODULE: ./utils/reader-paragraphs.js
var reader_paragraphs = __webpack_require__(37);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderContent.vue?vue&type=script&lang=js


/* harmony default export */ var ReaderContentvue_type_script_lang_js = ({
  components: {
    SiteIcon: SiteIcon["a" /* default */]
  },
  props: {
    article: {
      type: Object,
      required: true
    },
    highlights: {
      type: Array,
      default: () => []
    },
    counts: {
      type: Object,
      default: () => ({})
    },
    speakingId: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    paragraphs() {
      return Object(reader_paragraphs["a" /* readerParagraphs */])(this.article.content, this.article.article_type);
    },
    vocabulary() {
      if (this.article.article_type !== 'worldVocabulary') return {};
      try {
        const content = typeof this.article.content === 'string' ? JSON.parse(this.article.content) : this.article.content;
        return content && typeof content === 'object' ? content : {};
      } catch (_) {
        return {};
      }
    }
  },
  beforeDestroy() {
    this.cancelTouch();
  },
  methods: {
    safeImage(value) {
      return typeof value === 'string' && (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value)) ? value : '';
    },
    preview(src) {
      if (this.$preview) this.$preview([src], 0);
    },
    menu(event) {
      this.cancelTouch();
      this.$emit('paragraph-menu', {
        event,
        element: event.currentTarget
      });
    },
    touchStart(event) {
      this.cancelTouch();
      const element = event.currentTarget;
      this.touchTimer = setTimeout(() => {
        this.$emit('paragraph-menu', {
          event: {
            clientX: element.getBoundingClientRect().left,
            clientY: element.getBoundingClientRect().top
          },
          element
        });
      }, 500);
    },
    cancelTouch() {
      clearTimeout(this.touchTimer);
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderContent.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderContentvue_type_script_lang_js = (ReaderContentvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderContent.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(203)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderContentvue_type_script_lang_js,
  ReaderContentvue_type_template_id_a73249e0_scoped_true_render,
  ReaderContentvue_type_template_id_a73249e0_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "a73249e0",
  "9e37d6b0"
  
)

/* harmony default export */ var ReaderContent = (component.exports);
// EXTERNAL MODULE: ./utils/reader-position.js
var reader_position = __webpack_require__(156);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderPager.vue?vue&type=script&lang=js


/* harmony default export */ var ReaderPagervue_type_script_lang_js = ({
  components: {
    ReaderContent: ReaderContent
  },
  props: {
    article: {
      type: Object,
      required: true
    },
    typography: {
      type: Object,
      required: true
    },
    paged: Boolean,
    highlights: {
      type: Array,
      default: () => []
    },
    counts: {
      type: Object,
      default: () => ({})
    },
    speakingId: [String, Number],
    initialPosition: {
      type: Object,
      default: () => ({})
    },
    hasPrevious: Boolean,
    hasNext: Boolean,
    canFinish: Boolean,
    chapterPercent: [String, Number],
    navigationBlocked: Boolean
  },
  data() {
    return {
      index: 0,
      total: 1,
      height: 450,
      width: 860,
      gap: 40,
      position: Object(reader_position["b" /* normalizeReaderPosition */])(this.initialPosition),
      pendingPosition: null,
      generation: 0,
      mountedReady: false,
      layingOut: false
    };
  },
  computed: {
    viewportStyle() {
      return {
        maxWidth: this.typography.maxWidth,
        height: this.paged ? `${this.height}px` : 'auto',
        '--reader-page-height': `${this.height}px`
      };
    },
    proseStyle() {
      const {
        maxWidth,
        ...style
      } = this.typography;
      return this.paged ? {
        ...style,
        height: `${this.height}px`,
        width: `${this.width}px`,
        columnWidth: `${this.width}px`,
        columnGap: `${this.gap}px`,
        transform: `translate3d(${-this.index * (this.width + this.gap)}px,0,0)`
      } : style;
    }
  },
  mounted() {
    this.mountedReady = true;
    this.scheduleLayout(this.initialPosition);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('scroll', this.onScroll, {
      passive: true
    });
    window.addEventListener('keydown', this.onKey);
    if (document.fonts) document.fonts.addEventListener('loadingdone', this.onResize);
  },
  watch: {
    paged(value) {
      this.layingOut = true;
      this.$nextTick(() => {
        // A scroll-mode paragraph may be far down the document. Bring the page
        // viewport back below the sticky toolbar before measuring its height.
        if (value && this.$refs.viewport.getBoundingClientRect().top < this.readingTop()) this.alignViewport();
        this.scheduleLayout();
      });
    },
    typography: {
      deep: true,
      handler() {
        this.scheduleLayout();
      }
    },
    counts: {
      deep: true,
      handler() {
        this.scheduleLayout();
      }
    },
    initialPosition: {
      deep: true,
      handler(value) {
        this.scheduleLayout(value);
      }
    },
    'article.article_id'() {
      this.index = 0;
      this.position = Object(reader_position["b" /* normalizeReaderPosition */])(this.initialPosition);
      this.scheduleLayout(this.initialPosition);
    }
  },
  beforeDestroy() {
    this.generation++;
    cancelAnimationFrame(this.layoutFrame);
    cancelAnimationFrame(this.scrollFrame);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('keydown', this.onKey);
    if (document.fonts) document.fonts.removeEventListener('loadingdone', this.onResize);
  },
  methods: {
    onResize() {
      this.scheduleLayout();
    },
    scheduleLayout(wanted) {
      if (!this.mountedReady) return;
      const position = wanted && typeof wanted === 'object' && !wanted.type ? Object(reader_position["b" /* normalizeReaderPosition */])(wanted) : {
        ...(this.pendingPosition || this.position)
      };
      // Font/height/count changes in the same hydration tick must not overwrite
      // an incoming resume anchor or the previous chapter's end-page request.
      this.pendingPosition = position;
      this.layingOut = true;
      const generation = ++this.generation;
      cancelAnimationFrame(this.layoutFrame);
      this.$nextTick(() => {
        if (generation !== this.generation) return;
        const viewport = this.$refs.viewport;
        if (!viewport) return;
        this.width = viewport.clientWidth;
        const line = parseFloat(this.typography.fontSize) * Number(this.typography.lineHeight);
        const usable = Math.max(240, window.innerHeight - Math.max(100, viewport.getBoundingClientRect().top) - 100);
        this.height = Math.floor(Math.min(1000, usable) / line) * line;
        this.$nextTick(() => {
          if (generation !== this.generation) return;
          this.layoutFrame = requestAnimationFrame(() => {
            if (generation !== this.generation || !this.$refs.prose) return;
            this.total = this.paged ? Object(reader_position["d" /* pageCount */])(this.$refs.prose.scrollWidth, this.width, this.gap) : 1;
            this.restore(position);
          });
        });
      });
    },
    paragraph(id) {
      return this.$refs.prose && this.$refs.prose.querySelector(`[data-paragraph-id="${Number(id)}"]`);
    },
    characterPage(element, offset) {
      const text = element.querySelector('.paragraph-text');
      if (!text || !text.firstChild || !text.textContent.length) return this.elementPage(element);
      const start = Math.max(0, Math.min(text.textContent.length - 1, Number(offset) || 0));
      const range = document.createRange();
      range.setStart(text.firstChild, start);
      range.setEnd(text.firstChild, start + 1);
      const rect = range.getBoundingClientRect();
      return Object(reader_position["c" /* pageAtCoordinate */])(rect.left, this.$refs.viewport.getBoundingClientRect().left, this.index, this.width, this.gap);
    },
    elementPage(element) {
      const rect = element.getClientRects()[0] || element.getBoundingClientRect();
      return Object(reader_position["c" /* pageAtCoordinate */])(rect.left, this.$refs.viewport.getBoundingClientRect().left, this.index, this.width, this.gap);
    },
    restore(position) {
      const generation = this.generation;
      const normalized = Object(reader_position["b" /* normalizeReaderPosition */])(position),
        element = normalized.paragraphId ? this.paragraph(normalized.paragraphId) : null;
      if (this.paged) {
        this.index = Math.max(0, Math.min(this.total - 1, element ? this.characterPage(element, normalized.charOffset) : normalized.pageIndex));
        this.$refs.viewport.scrollLeft = 0;
        this.$nextTick(() => {
          if (generation !== this.generation) return;
          this.finishRestore(normalized, element);
        });
      } else {
        this.index = 0;
        this.total = 1;
        this.$nextTick(() => {
          if (generation !== this.generation) return;
          if (element) this.scrollToCharacter(element, normalized.charOffset);
          this.finishRestore(normalized, element);
        });
      }
    },
    finishRestore(position, element) {
      var _element$querySelecto;
      this.pendingPosition = null;
      this.layingOut = false;
      if (!element) return this.capture();
      // Preserve the requested text anchor even when the containing page starts
      // earlier, so repeated width/font changes cannot drift backwards.
      const length = ((_element$querySelecto = element.querySelector('.paragraph-text')) === null || _element$querySelecto === void 0 ? void 0 : _element$querySelecto.textContent.length) || 0;
      this.position = {
        ...position,
        charOffset: Math.min(position.charOffset, Math.max(0, length - 1)),
        pageIndex: this.index
      };
      this.$emit('position', this.position);
    },
    scrollToCharacter(element, offset) {
      const text = element.querySelector('.paragraph-text');
      if (text && text.firstChild && text.textContent.length) {
        const start = Math.min(text.textContent.length - 1, Math.max(0, Number(offset) || 0)),
          range = document.createRange();
        range.setStart(text.firstChild, start);
        range.setEnd(text.firstChild, start + 1);
        window.scrollBy({
          top: range.getBoundingClientRect().top - this.readingTop(),
          behavior: 'auto'
        });
      } else element.scrollIntoView({
        block: 'start'
      });
    },
    readingTop() {
      var _document$querySelect;
      return Math.max(110, (((_document$querySelect = document.querySelector('.article-header')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.getBoundingClientRect().bottom) || 100) + 15);
    },
    alignViewport() {
      const viewport = this.$refs.viewport;
      if (viewport) window.scrollBy({
        top: viewport.getBoundingClientRect().top - this.readingTop(),
        behavior: 'auto'
      });
    },
    capture() {
      if (!this.$refs.prose) return this.position;
      const paragraphs = [...this.$refs.prose.querySelectorAll('[data-paragraph-id]')];
      const element = this.paged ? paragraphs.find(paragraph => {
        const text = paragraph.querySelector('.paragraph-text'),
          length = text && text.textContent.trimEnd().length;
        return length && this.characterPage(paragraph, 0) <= this.index && this.characterPage(paragraph, length - 1) >= this.index;
      }) : paragraphs.find(paragraph => paragraph.getBoundingClientRect().bottom > this.readingTop());
      if (!element) {
        this.position = {
          paragraphId: 0,
          charOffset: 0,
          pageIndex: this.index
        };
        this.$emit('position', this.position);
        return this.position;
      }
      const text = element.querySelector('.paragraph-text');
      let low = 0,
        high = text ? text.textContent.length : 0;
      if (text && text.firstChild) {
        while (low < high) {
          const middle = Math.floor((low + high) / 2),
            range = document.createRange();
          range.setStart(text.firstChild, middle);
          range.setEnd(text.firstChild, Math.min(middle + 1, text.textContent.length));
          const rect = range.getBoundingClientRect();
          const before = this.paged ? this.characterPage(element, middle) < this.index : rect.bottom <= this.readingTop();
          if (before) low = middle + 1;else high = middle;
        }
      }
      this.position = {
        paragraphId: Number(element.dataset.paragraphId),
        charOffset: low,
        pageIndex: this.index
      };
      this.$emit('position', this.position);
      return this.position;
    },
    goPage(index) {
      this.index = Math.max(0, Math.min(this.total - 1, Number(index) || 0));
      this.$nextTick(() => {
        this.$refs.viewport.scrollLeft = 0;
        this.capture();
      });
    },
    turn(delta) {
      if (this.navigationBlocked) return;
      const next = this.index + delta;
      if (next < 0) {
        if (this.hasPrevious) this.$emit('boundary', 'prev');
        return;
      }
      if (next >= this.total) {
        if (this.hasNext) this.$emit('boundary', 'next');else if (this.canFinish) this.$emit('finish');
        return;
      }
      this.goPage(next);
    },
    jump(id, offset = 0) {
      if (this.paged) this.alignViewport();
      this.scheduleLayout({
        paragraphId: Number(id),
        charOffset: offset
      });
    },
    onScroll() {
      if (this.paged || this.layingOut) return;
      cancelAnimationFrame(this.scrollFrame);
      this.scrollFrame = requestAnimationFrame(() => this.capture());
    },
    onKey(event) {
      var _window$getSelection;
      if (!this.paged || this.navigationBlocked || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
      if (event.target.closest('input,textarea,select,button,[contenteditable="true"],[role="dialog"]') || (_window$getSelection = window.getSelection()) !== null && _window$getSelection !== void 0 && _window$getSelection.toString()) return;
      if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        this.turn(-1);
      } else if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        this.turn(1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        this.goPage(event.key === 'Home' ? 0 : this.total - 1);
      }
    },
    touchStart(event) {
      if (event.touches.length === 1) this.touchOrigin = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    },
    touchEnd(event) {
      var _window$getSelection2;
      const origin = this.touchOrigin;
      this.touchOrigin = null;
      if (!this.paged || !origin || event.changedTouches.length !== 1 || (_window$getSelection2 = window.getSelection()) !== null && _window$getSelection2 !== void 0 && _window$getSelection2.toString()) return;
      const delta = event.changedTouches[0].clientX - origin.x;
      if (Math.abs(delta) > 50 && Math.abs(event.changedTouches[0].clientY - origin.y) < 50) this.turn(delta > 0 ? -1 : 1);
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderPager.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderPagervue_type_script_lang_js = (ReaderPagervue_type_script_lang_js); 
// CONCATENATED MODULE: ./components/read/ReaderPager.vue



function ReaderPager_injectStyles (context) {
  
  var style0 = __webpack_require__(205)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var ReaderPager_component = Object(componentNormalizer["a" /* default */])(
  read_ReaderPagervue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  ReaderPager_injectStyles,
  "1bdf15ee",
  "0884969c"
  
)

/* harmony default export */ var ReaderPager = __webpack_exports__["a"] = (ReaderPager_component.exports);

/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderSettings.vue?vue&type=template&id=1368486d&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('el-drawer', {
    attrs: {
      "custom-class": "reading-drawer reading-settings-drawer",
      "title": "阅读设置",
      "visible": _vm.visible,
      "size": "min(480px, 100%)",
      "append-to-body": ""
    },
    on: {
      "update:visible": function ($event) {
        return _vm.$emit('update:visible', $event);
      }
    }
  }, [_c('div', {
    staticClass: "reader-settings-shell"
  }, [_c('div', {
    staticClass: "reader-settings"
  }, [_c('section', [_c('h3', [_vm._v("排版")]), _vm._v(" "), _c('div', {
    staticClass: "setting-row"
  }, [_c('span', [_vm._v("阅读模式")]), _c('div', {
    staticClass: "options"
  }, [_c('button', {
    attrs: {
      "aria-pressed": _vm.value.mode === 'page'
    },
    on: {
      "click": function ($event) {
        return _vm.change({
          mode: 'page'
        });
      }
    }
  }, [_vm._v("翻页")]), _c('button', {
    attrs: {
      "aria-pressed": _vm.value.mode === 'text'
    },
    on: {
      "click": function ($event) {
        return _vm.change({
          mode: 'text'
        });
      }
    }
  }, [_vm._v("滚动")])])]), _vm._v(" "), _c('div', {
    staticClass: "setting-row"
  }, [_c('span', [_vm._v("字号")]), _c('div', {
    staticClass: "stepper"
  }, [_c('button', {
    attrs: {
      "aria-label": "减小字号",
      "disabled": _vm.value.fontSize <= 14
    },
    on: {
      "click": function ($event) {
        return _vm.change({
          fontSize: _vm.value.fontSize - 1
        });
      }
    }
  }, [_vm._v("A−")]), _c('output', [_vm._v(_vm._s(_vm.value.fontSize) + " px")]), _c('button', {
    attrs: {
      "aria-label": "增大字号",
      "disabled": _vm.value.fontSize >= 36
    },
    on: {
      "click": function ($event) {
        return _vm.change({
          fontSize: _vm.value.fontSize + 1
        });
      }
    }
  }, [_vm._v("A＋")])])]), _vm._v(" "), _c('div', {
    staticClass: "setting-row"
  }, [_c('span', [_vm._v("行距")]), _c('div', {
    staticClass: "options"
  }, _vm._l([1.5, 1.7, 1.8, 2], function (height) {
    return _c('button', {
      key: height,
      attrs: {
        "aria-pressed": _vm.value.lineHeight === height
      },
      on: {
        "click": function ($event) {
          return _vm.change({
            lineHeight: height
          });
        }
      }
    }, [_vm._v(_vm._s(height))]);
  }), 0)]), _vm._v(" "), _c('div', {
    staticClass: "setting-row"
  }, [_c('label', {
    attrs: {
      "for": "reader-width"
    }
  }, [_vm._v("正文宽度")]), _c('div', {
    staticClass: "width-control"
  }, [_c('input', {
    attrs: {
      "id": "reader-width",
      "type": "range",
      "min": "620",
      "max": "1120",
      "step": "20"
    },
    domProps: {
      "value": _vm.value.width
    },
    on: {
      "input": function ($event) {
        _vm.change({
          width: Number($event.target.value)
        });
      }
    }
  }), _c('output', [_vm._v(_vm._s(_vm.value.width) + " px")])])])]), _vm._v(" "), _c('section', [_c('h3', [_vm._v("字体 "), _vm.resourcesLoading ? _c('small', [_vm._v("配置加载中…")]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "font-grid"
  }, [_vm._l(_vm.fonts, function (font, key) {
    return _c('button', {
      key: key,
      attrs: {
        "aria-pressed": _vm.value.font === key,
        "disabled": _vm.fontStates[key] === 'loading'
      },
      on: {
        "click": function ($event) {
          return _vm.$emit('font', key);
        }
      }
    }, [_c('strong', [_vm._v(_vm._s(font.name))]), _c('span', [_vm._v(_vm._s(_vm.fontStates[key] === 'loading' ? '正在下载…' : _vm.fontStates[key] === 'failed' ? '加载失败，点击重试' : _vm.value.font === key ? '当前字体' : '山川湖海，落笔成诗。'))])]);
  }), _vm._l(_vm.legacyFonts, function (font) {
    return _c('button', {
      key: font.key,
      attrs: {
        "aria-pressed": _vm.value.font === font.key
      },
      on: {
        "click": function ($event) {
          return _vm.$emit('font', font.key);
        }
      }
    }, [_c('strong', [_vm._v(_vm._s(font.name))]), _c('span', [_vm._v("使用本机字体")])]);
  })], 2), _vm._v(" "), _vm.fontError ? _c('p', {
    staticClass: "error",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v(_vm._s(_vm.fontError))]) : _vm._e()]), _vm._v(" "), _c('section', [_c('h3', [_vm._v("纯色主题")]), _vm._v(" "), _c('div', {
    staticClass: "themes"
  }, _vm._l(_vm.options, function (option) {
    return _c('button', {
      key: option.key,
      style: {
        backgroundColor: option.backgroundColor,
        color: option.fontColor
      },
      attrs: {
        "aria-label": `${option.name}${option.locked ? '，通行证专享' : ''}`,
        "aria-pressed": _vm.value.theme === option.key && !_vm.value.backgroundSkinKey
      },
      on: {
        "click": function ($event) {
          return _vm.$emit('theme', option.key);
        }
      }
    }, [_c('span', [_vm._v(_vm._s(option.name))]), option.locked ? _c('i', {
      staticClass: "el-icon-lock",
      attrs: {
        "aria-hidden": "true"
      }
    }) : _vm._e()]);
  }), 0)]), _vm._v(" "), _c('section', [_c('h3', [_vm._v("背景皮肤 "), _c('button', {
    staticClass: "refresh",
    attrs: {
      "disabled": _vm.resourcesLoading
    },
    on: {
      "click": function ($event) {
        return _vm.$emit('refresh');
      }
    }
  }, [_vm._v("刷新配置")])]), _vm._v(" "), _vm.resourceError ? _c('p', {
    staticClass: "error",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v(_vm._s(_vm.resourceError))]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "skin-grid"
  }, [_c('button', {
    attrs: {
      "aria-pressed": !_vm.value.backgroundSkinKey
    },
    on: {
      "click": function ($event) {
        return _vm.$emit('skin', '');
      }
    }
  }, [_c('div', {
    staticClass: "skin-preview plain",
    style: {
      backgroundColor: _vm.theme.backgroundColor
    }
  }, [_vm._v("Aa")]), _c('span', [_vm._v("纯色背景")])]), _vm._l(_vm.skins, function (skin) {
    return _c('button', {
      key: skin.skin_key,
      attrs: {
        "aria-pressed": _vm.value.backgroundSkinKey === skin.skin_key
      },
      on: {
        "click": function ($event) {
          return _vm.$emit('skin', skin.skin_key);
        }
      }
    }, [_c('img', {
      staticClass: "skin-preview",
      attrs: {
        "src": skin.image_url,
        "alt": "",
        "loading": "lazy"
      }
    }), _c('span', [_vm._v(_vm._s(skin.skin_name) + " "), skin.is_locked ? _c('i', {
      staticClass: "el-icon-lock",
      attrs: {
        "aria-hidden": "true"
      }
    }) : _vm._e()]), skin.is_locked ? _c('small', [_vm._v(_vm._s(skin.required_membership === 'super' ? '超级通行证专享' : '通行证专享'))]) : _vm._e()]);
  })], 2)]), _vm._v(" "), _vm.storageError ? _c('p', {
    staticClass: "error",
    attrs: {
      "role": "status"
    }
  }, [_vm._v("浏览器无法保存设置，本次阅读仍可使用。")]) : _vm._e(), _vm._v(" "), _c('button', {
    staticClass: "reset",
    on: {
      "click": function ($event) {
        return _vm.$emit('reset');
      }
    }
  }, [_vm._v("恢复默认设置")])]), _vm._v(" "), _vm.lockedMessage ? _c('div', {
    staticClass: "settings-feedback",
    attrs: {
      "role": "status",
      "aria-live": "polite",
      "aria-atomic": "true"
    }
  }, [_c('i', {
    staticClass: "el-icon-lock",
    attrs: {
      "aria-hidden": "true"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "feedback-copy"
  }, [_c('strong', [_vm._v("通行证专享")]), _c('p', [_vm._v(_vm._s(_vm.lockedMessage))])]), _vm._v(" "), _c('button', {
    staticClass: "membership-action",
    on: {
      "click": function ($event) {
        return _vm.$emit('membership');
      }
    }
  }, [_vm._v("查看通行证")])]) : _vm._e()])]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderSettings.vue?vue&type=template&id=1368486d&scoped=true

// EXTERNAL MODULE: ./utils/reader-preferences.js
var reader_preferences = __webpack_require__(163);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderSettings.vue?vue&type=script&lang=js

/* harmony default export */ var ReaderSettingsvue_type_script_lang_js = ({
  props: {
    visible: Boolean,
    value: {
      type: Object,
      required: true
    },
    fonts: {
      type: Object,
      required: true
    },
    skins: {
      type: Array,
      default: () => []
    },
    tier: String,
    fontStates: {
      type: Object,
      default: () => ({})
    },
    fontError: String,
    resourceError: String,
    lockedMessage: String,
    resourcesLoading: Boolean,
    storageError: Boolean
  },
  computed: {
    theme() {
      return reader_preferences["o" /* themes */][this.value.theme] || reader_preferences["o" /* themes */].white;
    },
    options() {
      return Object.keys(reader_preferences["o" /* themes */]).filter(key => key !== 'blockepoch').map(key => ({
        key,
        name: reader_preferences["c" /* THEME_NAMES */][key],
        ...reader_preferences["o" /* themes */][key],
        locked: reader_preferences["b" /* MEMBER_THEMES */].includes(key) && !Object(reader_preferences["d" /* canUseBackground */])('standard', this.tier)
      }));
    },
    legacyFonts() {
      return [{
        key: 'serif',
        name: '本机宋体'
      }, {
        key: 'sans-serif',
        name: '本机黑体'
      }];
    }
  },
  methods: {
    change(patch) {
      this.$emit('input', {
        ...this.value,
        ...patch
      });
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderSettings.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderSettingsvue_type_script_lang_js = (ReaderSettingsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderSettings.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(207)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderSettingsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "1368486d",
  "5c83d604"
  
)

/* harmony default export */ var ReaderSettings = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ChapterCatalog.vue?vue&type=template&id=67243c9c&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "chapter-catalog"
  }, [_vm._ssrNode("<header data-v-67243c9c><label data-v-67243c9c>查找章节 <input type=\"search\" placeholder=\"章节名或章节号\"" + _vm._ssrAttr("value", _vm.keyword) + " data-v-67243c9c></label><div data-v-67243c9c><button data-v-67243c9c>" + _vm._ssrEscape(_vm._s(_vm.reversed ? '倒序 ↓' : '正序 ↑')) + "</button>" + (_vm.currentChapter ? "<button data-v-67243c9c>定位续读</button>" : "<!---->") + "<span data-v-67243c9c>" + _vm._ssrEscape(_vm._s(_vm.readable.length) + " 章") + "</span></div></header> " + (!_vm.readable.length ? "<p class=\"empty\" data-v-67243c9c>暂无已发布章节</p>" : !_vm.groups.length ? "<p class=\"empty\" data-v-67243c9c>没有匹配的章节</p>" : "<!---->") + " "), _vm._l(_vm.groups, function (group) {
    return _vm._ssrNode("<section class=\"volume\" data-v-67243c9c>", "</section>", [_vm._ssrNode("<button" + _vm._ssrAttr("aria-expanded", !_vm.collapsed[group.key]) + " class=\"volume-title\" data-v-67243c9c>" + _vm._ssrEscape(_vm._s(_vm.collapsed[group.key] ? '▸' : '▾') + " " + _vm._s(group.title) + " ") + "<small data-v-67243c9c>" + _vm._ssrEscape(_vm._s(group.chapters.length) + " 章") + "</small></button> "), _vm._ssrNode("<div class=\"chapter-grid\"" + _vm._ssrStyle(null, null, {
      display: !_vm.collapsed[group.key] ? '' : 'none'
    }) + " data-v-67243c9c>", "</div>", _vm._l(group.chapters, function (chapter) {
      return _c('nuxt-link', {
        key: chapter.article_id,
        ref: String(chapter.article_chapter) === String(_vm.currentChapter) ? 'current' : undefined,
        refInFor: true,
        class: {
          current: String(chapter.article_chapter) === String(_vm.currentChapter)
        },
        attrs: {
          "to": `/article/${chapter.article_id}?start=1`
        },
        nativeOn: {
          "click": function ($event) {
            return _vm.$emit('navigate', chapter);
          }
        }
      }, [_c('span', {
        staticClass: "chapter-label"
      }, [_vm._v(_vm._s(chapter.article_chapter) + " · " + _vm._s(chapter.title))]), _c('span', {
        staticClass: "chapter-detail"
      }, [_c('time', [_vm._v(_vm._s(_vm.dateText(chapter.update_time)))]), _vm.amounts[chapter.article_id] ? _c('small', [_vm._v(_vm._s(_vm.amounts[chapter.article_id]) + " 条评论")]) : _vm._e(), String(chapter.article_chapter) === String(_vm.currentChapter) ? _c('small', [_vm._v("续读")]) : _vm._e()])]);
    }), 1)], 2);
  })], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ChapterCatalog.vue?vue&type=template&id=67243c9c&scoped=true

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(10);

// EXTERNAL MODULE: ./common/manga-comment-api.js
var manga_comment_api = __webpack_require__(124);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ChapterCatalog.vue?vue&type=script&lang=js


/* harmony default export */ var ChapterCatalogvue_type_script_lang_js = ({
  props: {
    chapters: {
      type: Array,
      default: () => []
    },
    currentChapter: {
      type: [String, Number],
      default: 0
    },
    novelId: {
      type: [String, Number],
      required: true
    }
  },
  data: () => ({
    keyword: '',
    reversed: false,
    collapsed: {},
    amounts: {},
    version: 0
  }),
  computed: {
    readable() {
      return this.chapters.filter(chapter => chapter.article_type !== 'spliter');
    },
    groups() {
      const groups = [];
      let group = {
        key: 'main',
        title: '正文',
        chapters: []
      };
      for (const chapter of this.chapters) {
        if (chapter.article_type === 'spliter') {
          if (group.chapters.length) groups.push(group);
          group = {
            key: String(chapter.article_id),
            title: chapter.title,
            chapters: []
          };
        } else group.chapters.push(chapter);
      }
      if (group.chapters.length) groups.push(group);
      const needle = this.keyword.trim().toLowerCase();
      const filtered = groups.map(item => ({
        ...item,
        chapters: item.chapters.filter(chapter => !needle || String(chapter.title || '').toLowerCase().includes(needle) || String(chapter.article_chapter).includes(needle))
      })).filter(item => item.chapters.length);
      return this.reversed ? filtered.reverse().map(item => ({
        ...item,
        chapters: item.chapters.slice().reverse()
      })) : filtered;
    }
  },
  mounted() {
    this.loadAmounts();
  },
  watch: {
    novelId() {
      this.amounts = {};
      this.loadAmounts();
    }
  },
  beforeDestroy() {
    this.version++;
  },
  methods: {
    dateText: reading_discovery["f" /* dateText */],
    async loadAmounts() {
      const version = ++this.version;
      try {
        const amounts = await Object(manga_comment_api["b" /* fetchMangaArticleCommentAmounts */])("https://api.loghome.ink", this.novelId);
        if (version === this.version) this.amounts = amounts;
      } catch (_) {}
    },
    locate() {
      this.keyword = '';
      this.collapsed = {};
      this.$nextTick(() => {
        const ref = this.$refs.current;
        const item = Array.isArray(ref) ? ref[0] : ref;
        if (item && item.$el) item.$el.scrollIntoView({
          block: 'center',
          behavior: 'smooth'
        });
      });
    }
  }
});
// CONCATENATED MODULE: ./components/read/ChapterCatalog.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ChapterCatalogvue_type_script_lang_js = (ChapterCatalogvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ChapterCatalog.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(211)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ChapterCatalogvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "67243c9c",
  "eb254fec"
  
)

/* harmony default export */ var ChapterCatalog = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 226:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/BookExcerpts.vue?vue&type=template&id=78460448&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "book-excerpts"
  }, [_vm._ssrNode("<header data-v-78460448><h2 data-v-78460448>书摘</h2><div data-v-78460448>" + _vm._ssrList(_vm.tabs, function (item) {
    return "<button" + _vm._ssrAttr("aria-pressed", _vm.tab === item.key) + _vm._ssrClass(null, {
      active: _vm.tab === item.key
    }) + " data-v-78460448>" + _vm._ssrEscape(_vm._s(item.label)) + "</button>";
  }) + "<button" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-78460448>刷新</button></div></header> "), _vm.error ? _vm._ssrNode("<p role=\"alert\" class=\"notice\" data-v-78460448>", "</p>", [_vm._ssrNode(_vm._ssrEscape(_vm._s(_vm.error) + " ")), (!_vm.loggedIn || _vm.authExpired) && _vm.tab === 'my' ? _c('nuxt-link', {
    attrs: {
      "to": _vm.loginUrl
    }
  }, [_vm._v("登录")]) : _c('button', {
    on: {
      "click": _vm.load
    }
  }, [_vm._v("重试")])], 2) : _vm._e(), _vm._ssrNode(" "), !_vm.items.length && !_vm.error ? _vm._ssrNode("<p class=\"empty\" data-v-78460448>", "</p>", [_vm._ssrNode(_vm._ssrEscape(_vm._s(_vm.loading ? '正在加载书摘…' : _vm.tab === 'my' ? '阅读时右键段落，添加划线即可收藏为书摘。' : '暂无热门书摘。')))], 2) : _vm._ssrNode("<div class=\"excerpts-grid\" data-v-78460448>", "</div>", _vm._l(_vm.items, function (excerpt, index) {
    return _vm._ssrNode("<article data-v-78460448>", "</article>", [_c('nuxt-link', {
      attrs: {
        "to": `/article/${excerpt.article_id}?paragraphId=${excerpt.paragraph_id}`
      },
      nativeOn: {
        "click": function ($event) {
          return _vm.navigateExcerpt($event, excerpt);
        }
      }
    }, [_c('blockquote', [_vm._v(_vm._s(excerpt.paragraph))]), _c('p', [_vm._v("第 " + _vm._s(excerpt.article_chapter) + " 章 · " + _vm._s(excerpt.title || excerpt.article_title))])]), _vm._ssrNode(" <div class=\"excerpt-actions\" data-v-78460448>" + (_vm.tab === 'hot' ? "<span data-v-78460448>" + _vm._ssrEscape(_vm._s(excerpt.highlight_count || 0) + " 次划线 · " + _vm._s(excerpt.comment_count || 0) + " 条段评") + "</span>" : "<!---->") + (_vm.tab === 'my' ? "<button" + _vm._ssrAttr("disabled", !!_vm.removing) + " data-v-78460448>移除划线</button>" : "<!---->") + "</div>")], 2);
  }), 0)], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/BookExcerpts.vue?vue&type=template&id=78460448&scoped=true

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/BookExcerpts.vue?vue&type=script&lang=js

/* harmony default export */ var BookExcerptsvue_type_script_lang_js = ({
  props: {
    novelId: {
      type: [Number, String],
      required: true
    }
  },
  data: () => ({
    tabs: [{
      key: 'my',
      label: '我的书摘'
    }, {
      key: 'hot',
      label: '热门书摘'
    }],
    tab: 'hot',
    items: [],
    loading: false,
    error: '',
    loggedIn: false,
    authExpired: false,
    removing: null,
    version: 0,
    removeVersion: 0,
    accountToken: null,
    accountEpoch: 0
  }),
  computed: {
    loginUrl() {
      return {
        path: '/login',
        query: {
          redirect: this.$route.fullPath
        }
      };
    }
  },
  async fetch() {
    await this.load();
  },
  mounted() {
    this.checkAccount();
    window.addEventListener('storage', this.checkAccount);
    window.addEventListener('focus', this.checkAccount);
    window.addEventListener('auth-state-changed', this.checkAccount);
  },
  watch: {
    tab() {
      this.resetScope();
      this.load();
    },
    novelId() {
      this.resetScope();
      this.load();
    }
  },
  beforeDestroy() {
    this.resetScope();
    window.removeEventListener('storage', this.checkAccount);
    window.removeEventListener('focus', this.checkAccount);
    window.removeEventListener('auth-state-changed', this.checkAccount);
  },
  methods: {
    navigateExcerpt(event, excerpt) {
      if (event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      this.$emit('navigate', excerpt);
    },
    resetScope() {
      this.version++;
      this.removeVersion++;
      this.items = [];
      this.error = '';
      this.loading = false;
      this.removing = null;
      this.authExpired = false;
    },
    checkAccount() {
      const token = Object(reading["c" /* readingToken */])();
      if (token === this.accountToken) return;
      this.accountToken = token;
      this.accountEpoch++;
      this.loggedIn = !!token;
      this.resetScope();
      const tab = token ? 'my' : 'hot';
      if (tab !== this.tab) this.tab = tab;else this.load();
    },
    currentScope(token, epoch, novelId, tab) {
      return token === Object(reading["c" /* readingToken */])() && epoch === this.accountEpoch && String(novelId) === String(this.novelId) && tab === this.tab;
    },
    async load() {
      const version = ++this.version,
        token = Object(reading["c" /* readingToken */])(),
        epoch = this.accountEpoch,
        novelId = this.novelId,
        tab = this.tab;
      const current = () => version === this.version && this.currentScope(token, epoch, novelId, tab);
      this.loading = true;
      this.error = '';
      this.loggedIn = !!token;
      this.authExpired = false;
      try {
        const items = await (tab === 'my' ? this.$api.reader.excerpts(novelId) : this.$api.reader.hotExcerpts(novelId));
        if (!Array.isArray(items)) throw new Error('书摘数据暂不可用，请重试。');
        if (current()) this.items = items;
      } catch (error) {
        if (current()) {
          this.error = error.message || '书摘加载失败。';
          if (tab === 'my' && [401, 403].includes(error.status)) {
            this.items = [];
            this.authExpired = true;
            this.error = '登录状态已过期，请重新登录后查看我的书摘。';
          }
        }
      } finally {
        if (current()) this.loading = false;
      }
    },
    async remove(excerpt) {
      if (this.removing || this.tab !== 'my' || !Object(reading["c" /* readingToken */])()) return;
      const token = Object(reading["c" /* readingToken */])(),
        epoch = this.accountEpoch,
        novelId = this.novelId,
        tab = this.tab,
        version = ++this.removeVersion;
      const current = () => version === this.removeVersion && this.currentScope(token, epoch, novelId, tab);
      this.removing = excerpt.article_cento_id;
      try {
        await this.$confirm('移除这条划线书摘？', '移除书摘', {
          type: 'warning'
        });
        if (!current()) return;
        await this.$api.reader.unhighlight(excerpt.article_cento_id);
        if (!current()) return;
        await this.load();
        if (current()) this.$emit('changed');
      } catch (error) {
        if (current() && error !== 'cancel' && error !== 'close') {
          this.error = error.message || '移除失败，请重试。';
          if ([401, 403].includes(error.status)) {
            this.items = [];
            this.authExpired = true;
            this.error = '登录状态已过期，请重新登录后查看我的书摘。';
          }
        }
      } finally {
        if (current()) this.removing = null;
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/BookExcerpts.vue?vue&type=script&lang=js
 /* harmony default export */ var read_BookExcerptsvue_type_script_lang_js = (BookExcerptsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/BookExcerpts.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(213)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_BookExcerptsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "78460448",
  "fb125fce"
  
)

/* harmony default export */ var BookExcerpts = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 228:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reader-preferences.js
var reader_preferences = __webpack_require__(163);

// CONCATENATED MODULE: ./utils/reader-backgrounds.js
const BACKGROUND_SIZE_VALUES = ["cover", "contain", "auto"];
const BACKGROUND_POSITION_VALUES = ["center", "top", "bottom", "left", "right", "top center", "bottom center"];
const BACKGROUND_REPEAT_VALUES = ["no-repeat", "repeat", "repeat-x", "repeat-y"];
const REQUIRED_MEMBERSHIP_VALUES = ["none", "standard", "super"];
function getAllowedValue(value, allowedValues, fallback) {
  const normalized = String(value || "").trim().toLowerCase();
  return allowedValues.includes(normalized) ? normalized : fallback;
}
function getBackgroundOverlayColor(value) {
  const color = String(value || "").trim();
  return /^(#[0-9a-f]{3,8}|rgba?\([\d\s,.%]+\))$/i.test(color) ? color : "rgba(255, 255, 255, 0.62)";
}
function getSafeBackgroundImageUrl(value) {
  const imageUrl = String(value || "").trim();
  if (!/^(https?:\/\/|\/static\/)/i.test(imageUrl)) {
    return "";
  }
  return /["\\\n\r\f]/.test(imageUrl) ? "" : imageUrl;
}
function normalizeBackgroundSkin(item, hasTheme) {
  if (!item || typeof item !== "object") {
    return null;
  }
  const skinKey = String(item.skin_key || "").trim();
  const skinName = String(item.skin_name || "").trim();
  const imageUrl = getSafeBackgroundImageUrl(item.image_url);
  if (!skinKey || !skinName || !imageUrl) {
    return null;
  }
  const requestedTheme = String(item.theme_key || "").trim();
  const themeKey = typeof hasTheme === "function" && hasTheme(requestedTheme) ? requestedTheme : "yellow";
  const requiredMembership = getAllowedValue(item.required_membership, REQUIRED_MEMBERSHIP_VALUES, "none");
  return {
    skin_key: skinKey.slice(0, 64),
    skin_name: skinName.slice(0, 64),
    theme_key: themeKey,
    image_url: imageUrl,
    overlay_color: getBackgroundOverlayColor(item.overlay_color),
    background_size: getAllowedValue(item.background_size, BACKGROUND_SIZE_VALUES, "cover"),
    background_position: getAllowedValue(item.background_position, BACKGROUND_POSITION_VALUES, "center"),
    background_repeat: getAllowedValue(item.background_repeat, BACKGROUND_REPEAT_VALUES, "no-repeat"),
    required_membership: requiredMembership,
    is_locked: requiredMembership === "none" ? Boolean(item.is_locked) : item.is_locked !== false
  };
}
function createBackgroundSkinStyle(skin) {
  if (!skin) {
    return {};
  }
  const imageUrl = getSafeBackgroundImageUrl(skin.image_url);
  if (!imageUrl) {
    return {};
  }
  const overlayColor = getBackgroundOverlayColor(skin.overlay_color);
  return {
    backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url("${imageUrl}")`,
    backgroundSize: skin.background_size || "cover",
    backgroundPosition: skin.background_position || "center",
    backgroundRepeat: skin.background_repeat || "no-repeat",
    backgroundAttachment: "fixed"
  };
}
// CONCATENATED MODULE: ./utils/reader-font-loader.js

const pending = new Map();
let database;
function openFontCache() {
  if (database) return database;
  database = new Promise(resolve => {
    if (typeof indexedDB === "undefined") return resolve(null);
    let request;
    try {
      request = indexedDB.open("loghome-reader-fonts", 1);
    } catch (_) {
      return resolve(null);
    }
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("assets")) request.result.createObjectStore("assets");
    };
    request.onsuccess = () => {
      request.result.onversionchange = () => {
        request.result.close();
        database = null;
      };
      resolve(request.result);
    };
    request.onerror = request.onblocked = () => {
      resolve(null);
      database = null;
    };
  });
  return database;
}
async function cachedAsset(key, value) {
  const db = await openFontCache();
  if (!db) return null;
  return new Promise(resolve => {
    try {
      const tx = db.transaction("assets", value ? "readwrite" : "readonly");
      const request = value ? tx.objectStore("assets").put(value, key) : tx.objectStore("assets").get(key);
      let result;
      request.onsuccess = () => {
        result = request.result;
      };
      tx.oncomplete = () => resolve(value || result || null);
      tx.onerror = tx.onabort = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  });
}
async function loadAsset(identity, asset, weight, environment, downloads, report) {
  const url = Object(reader_preferences["m" /* safeFontUrl */])(asset && asset.url);
  if (!url) throw new Error("字体资源地址无效");
  const cacheKey = `${identity}:${url}`;
  if (!downloads.has(cacheKey)) downloads.set(cacheKey, (async () => {
    let bytes = await cachedAsset(cacheKey);
    if (bytes) {
      report({
        loaded: bytes.byteLength,
        total: bytes.byteLength,
        done: true
      });
      return bytes;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);
    try {
      // A changed server version gets a new identity and revalidates the resource URL.
      const response = await environment.fetch(url, {
        cache: "no-cache",
        signal: controller.signal
      });
      if (!response.ok) throw new Error("字体下载失败，请重试");
      const length = Number(response.headers && response.headers.get("content-length"));
      const total = length > 0 && !response.headers.get("content-encoding") ? length : null;
      report({
        loaded: 0,
        total,
        done: false
      });
      if (response.body && response.body.getReader) {
        const reader = response.body.getReader(),
          chunks = [];
        let loaded = 0;
        while (true) {
          const {
            done,
            value
          } = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.byteLength;
          report({
            loaded,
            total,
            done: false
          });
        }
        const buffer = new Uint8Array(loaded);
        let offset = 0;
        for (const chunk of chunks) {
          buffer.set(chunk, offset);
          offset += chunk.byteLength;
        }
        bytes = buffer.buffer;
      } else bytes = await response.arrayBuffer();
      if (!bytes.byteLength) throw new Error("字体文件为空");
      report({
        loaded: bytes.byteLength,
        total: bytes.byteLength,
        done: true
      });
      await cachedAsset(cacheKey, bytes);
    } catch (error) {
      throw new Error(error.name === "AbortError" ? "字体下载超时，请重试" : "字体下载失败，请检查网络后重试");
    } finally {
      clearTimeout(timer);
    }
    return bytes;
  })());
  const bytes = await downloads.get(cacheKey);
  try {
    const face = new environment.FontFace(identity, bytes, {
      weight,
      style: "normal",
      display: "swap"
    });
    await face.load();
    environment.fonts.add(face);
  } catch (_) {
    // Do not trap the user on a corrupt cached file on every retry.
    const db = await openFontCache();
    if (db) {
      try {
        db.transaction("assets", "readwrite").objectStore("assets").delete(cacheKey);
      } catch (_) {}
    }
    throw new Error("字体文件无法加载，请重试或选择系统字体");
  }
}
function loadReaderFont(key, config, environment = {
  fetch: (...args) => window.fetch(...args),
  FontFace: window.FontFace,
  fonts: document.fonts
}, onProgress) {
  if (key === "default") return Promise.resolve("");
  if (!environment.FontFace || !environment.fonts) return Promise.reject(new Error("此浏览器无法加载在线字体，请选择系统字体"));
  const identity = Object(reader_preferences["e" /* fontIdentity */])(key, config);
  let entry = pending.get(identity);
  if (!entry) {
    entry = {
      listeners: new Set(),
      state: {
        phase: "downloading",
        loaded: 0,
        total: null,
        percent: null
      }
    };
    pending.set(identity, entry);
    const emit = state => {
      entry.state = state;
      entry.listeners.forEach(listener => listener(state));
    };
    entry.promise = (async () => {
      const downloads = new Map();
      const assets = [config.regular];
      if (config.bold && config.bold.url !== config.regular.url) assets.push(config.bold);
      const states = assets.map(() => ({
        loaded: 0,
        total: null,
        done: false
      }));
      const report = index => state => {
        if (entry.state.phase === "error") return;
        states[index] = state;
        const loaded = states.reduce((sum, item) => sum + item.loaded, 0);
        const total = states.every(item => item.total !== null) ? states.reduce((sum, item) => sum + item.total, 0) : null;
        const done = states.every(item => item.done);
        emit({
          phase: done ? "loading" : "downloading",
          loaded,
          total,
          percent: total ? Math.min(done ? 100 : 99, Math.floor(loaded / total * 100)) : null
        });
      };
      await Promise.all(assets.map((asset, index) => loadAsset(identity, asset, index ? "700" : "400", environment, downloads, report(index))));
      if (assets.length === 1) await loadAsset(identity, config.regular, "700", environment, downloads, report(0));
      emit({
        ...entry.state,
        phase: "ready",
        percent: 100
      });
      return identity;
    })().catch(error => {
      emit({
        ...entry.state,
        phase: "error"
      });
      pending.delete(identity);
      throw error;
    });
  }
  if (onProgress) {
    entry.listeners.add(onProgress);
    onProgress(entry.state);
  }
  return entry.promise.finally(() => {
    if (onProgress) entry.listeners.delete(onProgress);
  });
}
// CONCATENATED MODULE: ./mixins/reader-preferences.js




/* harmony default export */ var mixins_reader_preferences = __webpack_exports__["a"] = ({
  data() {
    return {
      readerPreferences: {
        ...reader_preferences["a" /* DEFAULT_PREFERENCES */]
      },
      readerFonts: Object(reader_preferences["j" /* readerFonts */])(),
      readerSkins: [],
      readerTier: '',
      readerResourcesLoading: false,
      readerResourceError: '',
      readerFontError: '',
      readerFontStates: {},
      readerFontFamily: '',
      readerLockedMessage: '',
      readerStorageError: false,
      readerResourceVersion: 0,
      readerFontVersion: 0,
      readerPreferenceRevision: 0
    };
  },
  computed: {
    readerTheme() {
      return reader_preferences["o" /* themes */][this.readerPreferences.theme] || reader_preferences["o" /* themes */].white;
    },
    readerNightMode() {
      return Object(reader_preferences["k" /* readerThemeMode */])(this.readerPreferences) === 'dark';
    },
    currentReaderSkin() {
      return this.readerSkins.find(skin => skin.skin_key === this.readerPreferences.backgroundSkinKey && !skin.is_locked) || null;
    },
    readerAppearance() {
      const skinStyle = createBackgroundSkinStyle(this.currentReaderSkin);
      if (this.currentReaderSkin && ['obsidian_orbit', 'ember_library'].includes(this.currentReaderSkin.skin_key)) skinStyle.backgroundSize = '100% 100%';
      return {
        backgroundColor: this.readerTheme.backgroundColor,
        color: this.readerTheme.fontColor,
        '--reader-secondary': this.readerTheme.secondaryFontColor,
        '--reader-line': this.readerTheme.lineColor,
        ...skinStyle
      };
    },
    readerTypography() {
      const system = '"PingFang SC", "Helvetica Neue", "Microsoft YaHei", Arial, sans-serif';
      const font = this.readerPreferences.font;
      const family = font === 'serif' ? '"Songti SC", SimSun, serif' : font === 'sans-serif' ? '"Heiti SC", "Microsoft YaHei", sans-serif' : this.readerFontFamily ? `"${this.readerFontFamily}", ${system}` : system;
      return {
        fontSize: `${this.readerPreferences.fontSize}px`,
        lineHeight: this.readerPreferences.lineHeight,
        fontFamily: family,
        maxWidth: `${this.readerPreferences.width}px`
      };
    }
  },
  mounted() {
    const restored = Object(reader_preferences["h" /* readPreferences */])({
      getItem: key => window.localStorage.getItem(key)
    });
    this.readerPreferences = {
      ...restored,
      theme: reader_preferences["b" /* MEMBER_THEMES */].includes(restored.theme) || restored.theme === 'blockepoch' ? 'white' : restored.theme,
      backgroundSkinKey: ''
    };
    this.refreshReaderResources(restored);
    window.addEventListener('focus', this.onReaderAccountFocus);
    window.addEventListener('storage', this.onReaderStorage);
    window.addEventListener('auth-state-changed', this.onReaderAccountFocus);
  },
  beforeDestroy() {
    this.readerResourceVersion++;
    this.readerFontVersion++;
    window.removeEventListener('focus', this.onReaderAccountFocus);
    window.removeEventListener('storage', this.onReaderStorage);
    window.removeEventListener('auth-state-changed', this.onReaderAccountFocus);
  },
  methods: {
    onReaderStorage(event) {
      if (event.key === 'token') this.refreshReaderResources();
    },
    onReaderAccountFocus() {
      this.refreshReaderResources();
    },
    async refreshReaderResources(restored) {
      const version = ++this.readerResourceVersion,
        token = Object(reading["c" /* readingToken */])(),
        revision = this.readerPreferenceRevision;
      const wanted = restored && typeof restored === 'object' && !restored.type ? restored : {
        ...this.readerPreferences
      };
      this.readerTier = '';
      this.readerResourcesLoading = true;
      this.readerResourceError = '';
      this.readerLockedMessage = '';
      // Until the new account's permission is known, protected appearances are not rendered.
      if (reader_preferences["b" /* MEMBER_THEMES */].includes(this.readerPreferences.theme) || this.readerPreferences.theme === 'blockepoch') this.readerPreferences = {
        ...this.readerPreferences,
        theme: 'white'
      };
      this.readerSkins = this.readerSkins.map(skin => ({
        ...skin,
        is_locked: !Object(reader_preferences["d" /* canUseBackground */])(skin.required_membership, '')
      }));
      const results = await Promise.allSettled([this.$api.reader.fonts(), this.$api.reader.backgrounds(), token ? this.$api.reader.membership() : Promise.resolve(null)]);
      if (version !== this.readerResourceVersion) return;
      if (token !== Object(reading["c" /* readingToken */])()) return this.refreshReaderResources();
      const [fontResult, skinResult, memberResult] = results;
      this.readerTier = memberResult.status === 'fulfilled' ? Object(reader_preferences["f" /* membershipTier */])(memberResult.value) : '';
      if (fontResult.status === 'fulfilled' && Array.isArray(fontResult.value)) this.readerFonts = Object(reader_preferences["j" /* readerFonts */])(fontResult.value);
      if (skinResult.status === 'fulfilled' && Array.isArray(skinResult.value)) this.readerSkins = skinResult.value.map(skin => normalizeBackgroundSkin({
        ...skin,
        is_locked: !Object(reader_preferences["d" /* canUseBackground */])(skin.required_membership, this.readerTier)
      }, key => Boolean(reader_preferences["o" /* themes */][key]))).filter(Boolean);else this.readerSkins = [];
      const failures = [];
      if (fontResult.status === 'rejected') failures.push('字体配置暂不可用，使用内置配置。');
      if (skinResult.status === 'rejected') failures.push('背景配置加载失败，请刷新重试。');
      if (memberResult.status === 'rejected') failures.push('通行证权限暂不可用，请刷新重试。');
      this.readerResourceError = failures.join(' ');
      this.readerResourcesLoading = false;
      const next = Object(reader_preferences["g" /* normalizePreferences */])(revision === this.readerPreferenceRevision ? wanted : this.readerPreferences);
      if (reader_preferences["b" /* MEMBER_THEMES */].includes(next.theme) && !Object(reader_preferences["d" /* canUseBackground */])('standard', this.readerTier)) next.theme = 'white';
      const selectedSkin = this.readerSkins.find(skin => skin.skin_key === next.backgroundSkinKey && !skin.is_locked);
      if (selectedSkin) next.theme = selectedSkin.theme_key;else {
        next.backgroundSkinKey = '';
        if (next.theme === 'blockepoch') next.theme = 'white';
      }
      if (!this.readerFonts[next.font] && !['serif', 'sans-serif'].includes(next.font)) next.font = 'default';
      this.readerPreferences = next;
      // Failed configuration requests should not erase a saved appearance for the next online visit.
      if (!failures.length) this.persistReaderPreferences();
      await this.selectReaderFont(next.font, false);
    },
    persistReaderPreferences() {
      const storage = {
        getItem: key => window.localStorage.getItem(key),
        setItem: (key, value) => window.localStorage.setItem(key, value)
      };
      const saved = Object(reader_preferences["n" /* savePreferences */])(storage, this.readerPreferences),
        remembered = Object(reader_preferences["l" /* rememberReaderTheme */])(storage, this.readerPreferences);
      this.readerStorageError = !saved || !remembered;
    },
    toggleReaderNightMode() {
      const storage = {
        getItem: key => window.localStorage.getItem(key),
        setItem: (key, value) => window.localStorage.setItem(key, value)
      };
      Object(reader_preferences["l" /* rememberReaderTheme */])(storage, this.readerPreferences);
      const mode = this.readerNightMode ? 'light' : 'dark',
        selection = Object(reader_preferences["i" /* readReaderTheme */])(storage, mode);
      let skin = selection.backgroundSkinKey && this.readerSkins.find(item => item.skin_key === selection.backgroundSkinKey && !item.is_locked && Object(reader_preferences["d" /* canUseBackground */])(item.required_membership, this.readerTier));
      if (skin && Object(reader_preferences["k" /* readerThemeMode */])({
        theme: skin.theme_key
      }) !== mode) skin = null;
      if (skin) selection.theme = skin.theme_key;else selection.backgroundSkinKey = '';
      if (selection.theme === 'blockepoch' && !skin || reader_preferences["b" /* MEMBER_THEMES */].includes(selection.theme) && !Object(reader_preferences["d" /* canUseBackground */])('standard', this.readerTier)) selection.theme = mode === 'dark' ? 'black' : 'white';
      this.readerLockedMessage = '';
      this.changeReaderPreferences({
        ...this.readerPreferences,
        ...selection
      });
    },
    changeReaderPreferences(value) {
      this.readerPreferenceRevision++;
      this.readerPreferences = Object(reader_preferences["g" /* normalizePreferences */])(value);
      this.persistReaderPreferences();
    },
    selectReaderTheme(key) {
      if (!reader_preferences["o" /* themes */][key] || key === 'blockepoch') return;
      if (reader_preferences["b" /* MEMBER_THEMES */].includes(key) && !Object(reader_preferences["d" /* canUseBackground */])('standard', this.readerTier)) return this.explainReaderLock('standard');
      this.readerLockedMessage = '';
      this.changeReaderPreferences({
        ...this.readerPreferences,
        theme: key,
        backgroundSkinKey: ''
      });
    },
    selectReaderSkin(key) {
      const skin = this.readerSkins.find(item => item.skin_key === key);
      if (key && !skin) return;
      if (skin && skin.is_locked) return this.explainReaderLock(skin.required_membership);
      this.readerLockedMessage = '';
      this.changeReaderPreferences({
        ...this.readerPreferences,
        backgroundSkinKey: skin ? key : '',
        theme: skin ? skin.theme_key : this.readerPreferences.theme === 'blockepoch' ? 'white' : this.readerPreferences.theme
      });
    },
    explainReaderLock(tier) {
      this.readerLockedMessage = tier === 'super' ? '此背景需要有效的超级原木通行证。' : '此背景需要有效的原木通行证或超级原木通行证。';
    },
    async selectReaderFont(key, persist = true) {
      const version = ++this.readerFontVersion;
      this.readerFontError = '';
      if (key === 'default' || ['serif', 'sans-serif'].includes(key)) {
        this.readerFontFamily = '';
        this.readerPreferences = {
          ...this.readerPreferences,
          font: key
        };
        if (persist) {
          this.readerPreferenceRevision++;
          this.persistReaderPreferences();
        }
        return;
      }
      const config = this.readerFonts[key];
      if (!config) return;
      this.$set(this.readerFontStates, key, 'loading');
      try {
        const family = await loadReaderFont(key, config);
        this.$set(this.readerFontStates, key, 'ready');
        if (version !== this.readerFontVersion) return;
        this.readerFontFamily = family;
        this.readerPreferences = {
          ...this.readerPreferences,
          font: key
        };
        if (persist) {
          this.readerPreferenceRevision++;
          this.persistReaderPreferences();
        }
      } catch (error) {
        this.$set(this.readerFontStates, key, 'failed');
        if (version !== this.readerFontVersion) return;
        this.readerFontError = error.message;
        if (!persist) {
          this.readerFontFamily = '';
          this.readerPreferences = {
            ...this.readerPreferences,
            font: 'default'
          };
        }
      }
    },
    resetReaderPreferences() {
      this.readerFontVersion++;
      this.readerPreferenceRevision++;
      this.readerFontFamily = '';
      this.readerFontError = '';
      this.readerLockedMessage = '';
      this.readerPreferences = {
        ...reader_preferences["a" /* DEFAULT_PREFERENCES */]
      };
      this.persistReaderPreferences();
    },
    openReaderMembership() {
      this.$openMobileWindow('/pages/membership/index', {
        title: '原木通行证'
      });
    }
  }
});

/***/ }),

/***/ 272:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(378);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("7b5a4df3", content, true, context)
};

/***/ }),

/***/ 273:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(380);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("5cca3412", content, true, context)
};

/***/ }),

/***/ 274:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(382);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("3b995e9c", content, true, context)
};

/***/ }),

/***/ 275:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(384);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("6fe06c85", content, true, context)
};

/***/ }),

/***/ 276:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(386);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("4ba1e846", content, true, context)
};

/***/ }),

/***/ 277:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(388);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("27636407", content, true, context)
};

/***/ }),

/***/ 377:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderNavigation_vue_vue_type_style_index_0_id_40608b75_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(272);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderNavigation_vue_vue_type_style_index_0_id_40608b75_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderNavigation_vue_vue_type_style_index_0_id_40608b75_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderNavigation_vue_vue_type_style_index_0_id_40608b75_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderNavigation_vue_vue_type_style_index_0_id_40608b75_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 378:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-navigation[data-v-40608b75] { padding: 0 24px 28px; height: 100%; overflow-y: auto;\n}.chapter-seek[data-v-40608b75] { border: 1px solid #e3d9cd; background: #fbf8f2; border-radius: 8px; padding: 18px; margin-bottom: 24px; color: #705b45;\n}.chapter-seek h3[data-v-40608b75] { font-size: 15px; margin-bottom: 14px;\n}.chapter-progress[data-v-40608b75] { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 13px;\n}.progress-value[data-v-40608b75] { font-variant-numeric: tabular-nums;\n}.chapter-seek p[data-v-40608b75] { font-size: 12px; margin: 14px 0 0;\n}button[data-v-40608b75] { background: #fff; color: #947358; border: 1px solid #d8cdbb; border-radius: 4px; padding: 7px 12px; margin-top: 14px; cursor: pointer;\n}button[data-v-40608b75]:focus-visible { outline: 2px solid #947358;\n}@media(max-width:700px) {\n.reader-navigation[data-v-40608b75] { padding: 0 14px 22px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 379:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderFeedback_vue_vue_type_style_index_0_id_d144cce4_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(273);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderFeedback_vue_vue_type_style_index_0_id_d144cce4_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderFeedback_vue_vue_type_style_index_0_id_d144cce4_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderFeedback_vue_vue_type_style_index_0_id_d144cce4_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderFeedback_vue_vue_type_style_index_0_id_d144cce4_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 380:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\nblockquote[data-v-d144cce4] { color: #8f765f; background: #faf6ef; padding: 14px; border-left: 3px solid #947358; font-size: 13px; line-height: 1.8; white-space: pre-wrap; margin-bottom: 20px; max-height: 160px; overflow: auto;\n}.error[data-v-d144cce4] { color: #c05243; margin-top: 12px; font-size: 13px;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 381:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_75d133b0_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(274);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_75d133b0_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_75d133b0_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_75d133b0_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_75d133b0_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 382:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "@keyframes spin{to{transform:rotate(360deg)}}@keyframes slideDown{from{transform:translateY(-100%)}to{transform:translateY(0)}}@keyframes slideUp{from{transform:translateY(0)}to{transform:translateY(-100%)}}.article-page{max-width:1200px;margin:0 auto;padding:0;min-height:100vh;background-color:#f8f9fa}.article-page .loading-container,.article-page .error-container{display:flex;align-items:center;justify-content:center;flex-direction:column;min-height:300px;text-align:center;padding:50px}.article-page .loading-spinner{width:50px;height:50px;border:5px solid rgba(148,115,88,.2);border-top-color:#947358;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px}.article-page .back-button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;border:none;font-size:14px;background-color:#947358;color:#fff;padding:10px 20px;margin-top:20px}.article-page .article-container{position:relative}.article-page .article-header{background-color:hsla(0,0%,100%,.98);box-shadow:0 2px 8px rgba(0,0,0,.1);position:sticky;top:0;z-index:100;transition:transform .3s ease}.article-page .article-header.sticky .header-content{padding:10px 20px;display:flex;align-items:center;justify-content:space-between;max-width:1200px;margin:0 auto}.article-page .article-header.hidden{transform:translateY(-100%)}.article-page .novel-info{display:flex;align-items:center;justify-content:space-between;flex:1}.article-page .novel-title{color:#947358;font-size:18px;font-weight:bold;cursor:pointer;margin-right:20px}.article-page .novel-title:hover{text-decoration:underline}.article-page .reading-controls{margin-left:20px;display:flex;gap:20px;align-items:center}.article-page .reading-controls .control-item{display:flex;align-items:center}.article-page .reading-controls .control-item .control-label{color:#666;margin-right:8px;font-size:14px}.article-page .reading-controls .control-item .control-buttons{display:flex}.article-page .reading-controls .control-item .control-buttons button{padding:5px 10px;border:1px solid #ddd;background:none;margin:0 2px;cursor:pointer;border-radius:3px;font-size:14px}.article-page .reading-controls .control-item .control-buttons button.active{background-color:#947358;color:#fff;border-color:#947358}.article-page .theme-controls{display:flex;gap:8px}.article-page .theme-btn{width:24px;height:24px;border-radius:50%;cursor:pointer;border:2px solid rgba(0,0,0,0)}.article-page .theme-btn.active{border-color:#947358}.article-page .theme-btn.light{background-color:#fff;border:1px solid #ddd}.article-page .theme-btn.sepia{background-color:#f8f0e0}.article-page .theme-btn.dark{background-color:#282c35}.article-page .article-content-wrapper{padding:0;background-color:#fff;margin:0 auto}.article-page .article-content-wrapper.light{background-color:#fff;color:#333}.article-page .article-content-wrapper.sepia{background-color:#f8f0e0;color:#5b4636}.article-page .article-content-wrapper.dark{background-color:#282c35;color:#bbb}.article-page .article-title-container{text-align:center;padding:40px 20px 20px}.article-page .article-title-container .article-title{font-size:28px;font-weight:bold;margin-bottom:10px}.article-page .article-title-container .article-meta{font-size:14px}.article-page .article-title-container .article-meta span{margin:0 10px}.article-page .article-content{padding:30px 60px 60px;width:100%;line-height:1.8}.article-page .article-content p{margin-bottom:1.5em}.article-page .article-content .article-image{margin:2em 0;text-align:center}.article-page .article-content .article-image img{max-width:60%;height:auto;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.1)}.article-page .article-content .article-paragraph{transition:background-color .3s;border-radius:4px;padding:5px;position:relative}.article-page .article-content .article-paragraph.selected{background-color:rgba(148,115,88,.1)}.article-page .article-content .article-paragraph:hover{background-color:rgba(148,115,88,.05)}.article-page .empty-content{color:#888;font-style:italic;text-align:center;padding:60px 0}.article-page .article-footer{padding:20px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #eee;margin-top:50px;background-color:hsla(0,0%,100%,.95)}.article-page .chapter-nav{display:flex;gap:10px}.article-page .chapter-nav button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;border:none;font-size:14px}.article-page .chapter-nav button.nav-btn{background-color:#f5f5f5;color:#333}.article-page .chapter-nav button.nav-btn:hover:not(:disabled){background-color:#e9e9e9}.article-page .chapter-nav button.nav-btn:disabled{opacity:.5;cursor:not-allowed}.article-page .chapter-nav button.chapter-btn{background-color:#947358;color:#fff}.article-page .chapter-nav button.chapter-btn:hover{background-color:hsl(27,25.4237288136%,36.2745098039%)}.article-page .nav-icon{font-size:16px}.article-page .like-btn{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;border:none;font-size:14px;display:flex;align-items:center;gap:8px;background-color:#fff0f0;color:#ff6b6b;border:1px solid #ff6b6b}.article-page .like-btn:hover{background-color:#ffe0e0}.article-page .like-btn.active{background-color:#ff6b6b;color:#fff}.article-page .like-icon{font-size:16px}.article-page .chapter-nav a{text-decoration:none;display:inline-flex;align-items:center}.article-page .paragraph-floating-panel{position:fixed;background-color:hsla(0,0%,100%,.95);padding:10px;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.15);z-index:1000;display:flex}.article-page .paragraph-floating-panel .panel-button{display:flex;flex-direction:column;align-items:center;padding:8px 12px;cursor:pointer;margin:0 5px;transition:all .2s}.article-page .paragraph-floating-panel .panel-button i{font-size:20px;margin-bottom:5px;color:#947358}.article-page .paragraph-floating-panel .panel-button span{font-size:12px;color:#333}.article-page .paragraph-floating-panel .panel-button:hover{background-color:rgba(148,115,88,.1);border-radius:5px}.article-page .paragraph-comment-drawer{position:fixed;top:0;right:0;bottom:0;width:100%;max-width:450px;background-color:#fff;box-shadow:-5px 0 15px rgba(0,0,0,.1);z-index:1001;transform:translateX(100%);transition:transform .3s ease;display:flex;flex-direction:column}.article-page .paragraph-comment-drawer.active{transform:translateX(0)}.article-page .paragraph-comment-drawer .drawer-header{padding:15px 20px;background-color:#947358;color:#fff;display:flex;align-items:center;justify-content:space-between}.article-page .paragraph-comment-drawer .drawer-header h3{margin:0;font-size:16px}.article-page .paragraph-comment-drawer .drawer-header .close-btn{background:none;border:none;color:#fff;font-size:24px;cursor:pointer;padding:0;line-height:1}.article-page .paragraph-comment-drawer .drawer-content{padding:20px;flex:1;overflow-y:auto}.article-page .paragraph-comment-drawer .drawer-content .paragraph-text{margin-bottom:20px}.article-page .paragraph-comment-drawer .drawer-content .paragraph-text blockquote{border-left:4px solid #947358;padding:10px 15px;background-color:rgba(148,115,88,.05);margin:0 0 20px 0;font-style:italic;color:#666}.article-page .paragraph-comment-drawer .drawer-content .comment-input{margin-bottom:30px}.article-page .paragraph-comment-drawer .drawer-content .comment-input textarea{width:100%;padding:12px;border:1px solid #ddd;border-radius:4px;resize:vertical;margin-bottom:10px}.article-page .paragraph-comment-drawer .drawer-content .comment-input textarea:focus{border-color:#947358;outline:none}.article-page .paragraph-comment-drawer .drawer-content .comment-input button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;border:none;font-size:14px;background-color:#947358;color:#fff;float:right}.article-page .paragraph-comment-drawer .drawer-content .comment-input button:hover{background-color:hsl(27,25.4237288136%,36.2745098039%)}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list{clear:both}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .empty-comments{padding:30px 0;text-align:center;color:#888;font-style:italic}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item{display:flex;padding:15px 0;border-bottom:1px solid #f5f5f5}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item:last-child{border-bottom:none}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item .comment-avatar{width:36px;height:36px;border-radius:50%;background-color:#947358;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;margin-right:12px;flex-shrink:0}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item .comment-content{flex:1}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item .comment-content .comment-header{margin-bottom:5px}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item .comment-content .comment-header .comment-username{font-weight:bold;margin-right:10px}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item .comment-content .comment-header .comment-time{font-size:12px;color:#888}.article-page .paragraph-comment-drawer .drawer-content .paragraph-comments-list .paragraph-comment-item .comment-content .comment-text{line-height:1.5}@media(max-width: 900px){.article-page .article-header .header-content{flex-direction:column;gap:10px}.article-page .novel-info{width:100%}.article-page .reading-controls{width:100%;justify-content:space-between}.article-page .article-content{padding:20px 30px}.article-page .paragraph-comment-drawer{width:100%}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 383:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(275);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_1_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 384:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-control-btn[data-v-75d133b0] { border: 1px solid #ded4c5; background: #fff; color: #806649; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 13px; white-space: nowrap;\n}\n.article-page .chapter-nav a[data-v-75d133b0] { text-decoration: none; color: #806649;\n}\n.article-page .header-content[data-v-75d133b0] { flex-wrap: wrap; gap: 12px;\n}.article-page .novel-info[data-v-75d133b0] { flex-wrap: wrap; gap: 8px;\n}.reading-controls[data-v-75d133b0] { gap: 8px; flex-wrap: wrap; margin-left: 0;\n}\n.reader-excerpts[data-v-75d133b0] { padding: 0 22px 28px; height: 100%; overflow-y: auto;\n}\n.reader-highlight-status[data-v-75d133b0] { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; padding: 12px 20px; font-size: 13px;\n}\n.reader-highlight-status a[data-v-75d133b0] { color: inherit; text-decoration: underline;\n}\n.article-page .article-content[data-v-75d133b0] { margin: 0 auto; overflow-wrap: anywhere;\n}.article-meta[data-v-75d133b0] { color: var(--reader-secondary);\n}.article-content-wrapper[data-v-75d133b0] .reader-highlight { text-decoration-color: var(--reader-line);\n}\n.article-content-wrapper[data-v-75d133b0] .article-paragraph { margin-bottom: 1.2em; white-space: pre-wrap;\n}.article-content-wrapper[data-v-75d133b0] .reader-speaking { background: rgba(170,160,90,.22);\n}\n.block-epoch-skin .article-title-container[data-v-75d133b0] { margin: 18px; border: 3px solid #6b7551; background: rgba(239,244,216,.78); box-shadow: 5px 5px 0 #273421;\n}.block-epoch-skin .article-title[data-v-75d133b0] { font-family: ui-monospace, Consolas, monospace;\n}\n@media(max-width:700px) {\n.article-page .article-content[data-v-75d133b0] { padding: 22px 20px 40px;\n}.reader-control-btn[data-v-75d133b0] { padding: 8px;\n}.article-page .novel-info[data-v-75d133b0] { width: 100%;\n}.article-page .novel-title[data-v-75d133b0] { font-size: 16px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 385:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_2_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(276);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_2_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_2_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_2_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_2_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 386:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reading-page-mode .article-footer[data-v-75d133b0] { display: none;\n}.chapter-reviews[data-v-75d133b0] { margin-top: 28px;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 387:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_3_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(277);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_3_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_3_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_3_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_3_id_75d133b0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 388:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.article-page .article-header[data-v-75d133b0] { top: 60px;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 407:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/_id.vue?vue&type=template&id=75d133b0&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "article-page",
    class: {
      'reading-page-mode': _vm.readerReady && _vm.readerPreferences.mode === 'page'
    }
  }, [_vm.loading ? _vm._ssrNode("<div class=\"loading-container\" data-v-75d133b0>", "</div>", [_vm._ssrNode("<div class=\"loading-spinner\" data-v-75d133b0></div> <p data-v-75d133b0>正在加载内容...</p>")], 2) : _vm.error ? _vm._ssrNode("<div class=\"error-container\" data-v-75d133b0><p data-v-75d133b0>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> <button class=\"back-button\" data-v-75d133b0>返回</button></div>") : _vm._ssrNode("<div class=\"article-container\" data-v-75d133b0>", "</div>", [_vm._ssrNode("<div class=\"article-header sticky\" data-v-75d133b0>", "</div>", [_vm._ssrNode("<div class=\"header-content\" data-v-75d133b0>", "</div>", [_vm._ssrNode("<div class=\"novel-info\" data-v-75d133b0>", "</div>", [_c('nuxt-link', {
    staticClass: "novel-title",
    attrs: {
      "to": _vm.workUrl(_vm.novel)
    }
  }, [_vm._v(_vm._s(_vm.novel.name))]), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"chapter-nav\" data-v-75d133b0>", "</div>", [_vm.hasPrevious ? _c('nuxt-link', {
    staticClass: "nav-btn",
    attrs: {
      "to": `/article/${_vm.chapters[_vm.currentChapterIndex - 1].article_id}`,
      "rel": "prev"
    }
  }, [_c('span', {
    staticClass: "nav-icon"
  }, [_vm._v("←")]), _vm._v(" 上一章")]) : _c('button', {
    staticClass: "nav-btn",
    attrs: {
      "disabled": ""
    }
  }, [_vm._v("← 上一章")]), _vm._ssrNode(" <button class=\"chapter-btn\" data-v-75d133b0><span class=\"nav-icon\" data-v-75d133b0>≡</span> 目录</button> "), _vm.hasNext ? _c('nuxt-link', {
    staticClass: "nav-btn",
    attrs: {
      "to": `/article/${_vm.chapters[_vm.currentChapterIndex + 1].article_id}`,
      "rel": "next"
    }
  }, [_vm._v("下一章 "), _c('span', {
    staticClass: "nav-icon"
  }, [_vm._v("→")])]) : _vm.canFinish ? _c('nuxt-link', {
    staticClass: "nav-btn",
    attrs: {
      "to": `/read/end/${_vm.novel.novel_id}`
    }
  }, [_vm._v("已读至最后 →")]) : _c('button', {
    staticClass: "nav-btn",
    attrs: {
      "disabled": ""
    }
  }, [_vm._v("下一章 →")])], 2)], 2), _vm._ssrNode(" <div class=\"reading-controls\" data-v-75d133b0><button class=\"reader-control-btn\" data-v-75d133b0><i aria-hidden=\"true\" class=\"el-icon-collection\" data-v-75d133b0></i> 书摘</button> <button" + _vm._ssrAttr("aria-label", _vm.readerNightMode ? '切换到日间阅读' : '切换到夜间阅读') + _vm._ssrAttr("aria-pressed", _vm.readerNightMode ? 'true' : 'false') + " class=\"reader-control-btn\" data-v-75d133b0><i aria-hidden=\"true\"" + _vm._ssrClass(null, _vm.readerNightMode ? 'el-icon-sunny' : 'el-icon-moon') + " data-v-75d133b0></i>" + _vm._ssrEscape(" " + _vm._s(_vm.readerNightMode ? '日间' : '夜间')) + "</button> <button class=\"reader-control-btn\" data-v-75d133b0><i aria-hidden=\"true\" class=\"el-icon-headset\" data-v-75d133b0></i> 听书</button> <button class=\"reader-control-btn\" data-v-75d133b0><i aria-hidden=\"true\" class=\"el-icon-setting\" data-v-75d133b0></i> 阅读设置</button> <button class=\"reader-control-btn\" data-v-75d133b0><i aria-hidden=\"true\" class=\"el-icon-chat-line-round\" data-v-75d133b0></i> 章节评论</button></div>")], 2)]), _vm._ssrNode(" "), _vm._ssrNode("<div" + _vm._ssrClass("article-content-wrapper", {
    'reader-dark': _vm.readerTheme.isBlack,
    'block-epoch-skin': _vm.currentReaderSkin && _vm.currentReaderSkin.skin_key === 'block_epoch'
  }) + _vm._ssrStyle(null, _vm.readerAppearance, null) + " data-v-75d133b0>", "</div>", [_vm._ssrNode("<div class=\"article-title-container\" data-v-75d133b0><h1 class=\"article-title\" data-v-75d133b0>" + _vm._ssrEscape(_vm._s(_vm.article.title)) + "</h1> <div class=\"article-meta\" data-v-75d133b0><span data-v-75d133b0>" + _vm._ssrEscape("作者: " + _vm._s(_vm.novel.author_name || '佚名')) + "</span> <span data-v-75d133b0>" + _vm._ssrEscape("更新: " + _vm._s(_vm.formatDate(_vm.article.update_time))) + "</span> <span data-v-75d133b0>" + _vm._ssrEscape("字数: " + _vm._s(_vm.formatNumber(_vm.article.text_count || 0))) + "</span></div></div> "), _c('ReaderPager', {
    ref: "pager",
    attrs: {
      "article": _vm.article,
      "typography": _vm.readerTypography,
      "paged": _vm.readerReady && _vm.readerPreferences.mode === 'page',
      "counts": _vm.paragraphCommentsCount,
      "highlights": _vm.highlights,
      "speaking-id": _vm.audioSpeakingId,
      "initial-position": _vm.readerInitialPosition,
      "has-previous": _vm.hasPrevious,
      "has-next": _vm.hasNext,
      "can-finish": _vm.canFinish,
      "chapter-percent": _vm.chapterPercent,
      "navigation-blocked": _vm.readerSettingsVisible || _vm.readerNavigationVisible || _vm.readerExcerptsVisible || _vm.showCommentDrawer || _vm.feedbackVisible || _vm.selectionMode
    },
    on: {
      "paragraph-menu": function ($event) {
        return _vm.handleParagraphRightClick($event.event, $event.element);
      },
      "comment": _vm.openParagraphCommentWindow,
      "position": _vm.onReaderPosition,
      "boundary": _vm.navigatePageBoundary,
      "finish": _vm.finishReading
    }
  }), _vm._ssrNode(" "), _vm.highlightError ? _vm._ssrNode("<div role=\"status\" class=\"reader-highlight-status\" data-v-75d133b0>", "</div>", [_vm._ssrNode("<span data-v-75d133b0>" + _vm._ssrEscape(_vm._s(_vm.highlightError)) + "</span> "), _vm.highlightAuthExpired ? _c('nuxt-link', {
    attrs: {
      "to": {
        path: '/login',
        query: {
          redirect: _vm.$route.fullPath
        }
      }
    }
  }, [_vm._v("重新登录")]) : _c('button', {
    staticClass: "reader-control-btn",
    on: {
      "click": _vm.loadHighlights
    }
  }, [_vm._v("重试划线")])], 2) : _vm._e(), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"article-footer\" data-v-75d133b0>", "</div>", [_vm._ssrNode("<div class=\"chapter-nav\" data-v-75d133b0>", "</div>", [_vm.hasPrevious ? _c('nuxt-link', {
    staticClass: "nav-btn",
    attrs: {
      "to": `/article/${_vm.chapters[_vm.currentChapterIndex - 1].article_id}`,
      "rel": "prev"
    }
  }, [_c('span', {
    staticClass: "nav-icon"
  }, [_vm._v("←")]), _vm._v(" 上一章")]) : _c('button', {
    staticClass: "nav-btn",
    attrs: {
      "disabled": ""
    }
  }, [_vm._v("← 上一章")]), _vm._ssrNode(" "), _c('nuxt-link', {
    staticClass: "chapter-btn",
    attrs: {
      "to": _vm.workUrl(_vm.novel)
    }
  }, [_c('span', {
    staticClass: "nav-icon"
  }, [_vm._v("≡")]), _vm._v(" 目录")]), _vm._ssrNode(" "), _vm.hasNext ? _c('nuxt-link', {
    staticClass: "nav-btn",
    attrs: {
      "to": `/article/${_vm.chapters[_vm.currentChapterIndex + 1].article_id}`,
      "rel": "next"
    }
  }, [_vm._v("下一章 "), _c('span', {
    staticClass: "nav-icon"
  }, [_vm._v("→")])]) : _vm.canFinish ? _c('nuxt-link', {
    staticClass: "nav-btn",
    attrs: {
      "to": `/read/end/${_vm.novel.novel_id}`
    }
  }, [_vm._v("已读至最后 →")]) : _c('button', {
    staticClass: "nav-btn",
    attrs: {
      "disabled": ""
    }
  }, [_vm._v("下一章 →")])], 2)])], 2), _vm._ssrNode(" "), _c('MangaCommentPanel', {
    ref: "chapterReviews",
    staticClass: "chapter-reviews",
    attrs: {
      "inline": "",
      "visible": true,
      "novel-id": _vm.novel.novel_id,
      "article-id": _vm.article.article_id,
      "work-author-id": _vm.novel.author_id || _vm.novel.auther_id,
      "scope-title": "章节评论"
    },
    on: {
      "changed": function ($event) {
        return _vm.onCommentsChanged('inline');
      }
    }
  }), _vm._ssrNode(" " + (_vm.selectionMode && _vm.selectedParagraph ? "<div class=\"paragraph-floating-panel\"" + _vm._ssrStyle(null, {
    left: _vm.panelPosition.x + 'px',
    top: _vm.panelPosition.y + 'px'
  }, null) + " data-v-75d133b0><div class=\"panel-button\" data-v-75d133b0><i class=\"el-icon-document-copy\" data-v-75d133b0></i> <span data-v-75d133b0>复制</span></div> <div class=\"panel-button\" data-v-75d133b0><i class=\"el-icon-chat-line-round\" data-v-75d133b0></i> <span data-v-75d133b0>评论</span></div> <div class=\"panel-button\" data-v-75d133b0><i class=\"el-icon-collection-tag\" data-v-75d133b0></i><span data-v-75d133b0>" + _vm._ssrEscape(_vm._s(_vm.selectedHighlight ? '取消划线' : '划线书摘')) + "</span></div> <div class=\"panel-button\" data-v-75d133b0><i class=\"el-icon-edit-outline\" data-v-75d133b0></i><span data-v-75d133b0>反馈错误</span></div> <div class=\"panel-button\" data-v-75d133b0><i class=\"el-icon-headset\" data-v-75d133b0></i><span data-v-75d133b0>从此处听书</span></div></div>" : "<!---->") + " "), _vm.showCommentDrawer ? _c('MangaCommentPanel', {
    attrs: {
      "visible": _vm.showCommentDrawer,
      "novel-id": _vm.novel.novel_id,
      "article-id": _vm.article.article_id,
      "paragraph-id": _vm.currentParagraphId || 0,
      "paragraph-text": _vm.paragraphCommentText,
      "work-author-id": _vm.novel.author_id || _vm.novel.auther_id,
      "anchor-id": _vm.commentAnchor
    },
    on: {
      "update:visible": function ($event) {
        _vm.showCommentDrawer = $event;
      },
      "changed": function ($event) {
        return _vm.onCommentsChanged('drawer');
      }
    }
  }) : _vm._e(), _vm._ssrNode(" "), _vm.readerNavigationVisible ? _c('ReaderNavigation', {
    attrs: {
      "visible": _vm.readerNavigationVisible,
      "chapters": _vm.chapterEntries || _vm.chapters,
      "current": _vm.article,
      "novel-id": _vm.novel.novel_id,
      "can-undo": !!_vm.readerJumpUndo
    },
    on: {
      "update:visible": function ($event) {
        _vm.readerNavigationVisible = $event;
      },
      "catalog-navigate": _vm.recordReaderChapterJump,
      "undo": _vm.undoReaderChapterJump
    }
  }) : _vm._e(), _vm._ssrNode(" "), _vm.readerExcerptsVisible ? _c('el-drawer', {
    attrs: {
      "custom-class": "reading-drawer",
      "title": "划线书摘",
      "visible": _vm.readerExcerptsVisible,
      "size": "min(860px, 100%)",
      "append-to-body": "",
      "destroy-on-close": ""
    },
    on: {
      "update:visible": function ($event) {
        _vm.readerExcerptsVisible = $event;
      }
    }
  }, [_c('div', {
    staticClass: "reader-excerpts"
  }, [_c('BookExcerpts', {
    attrs: {
      "novel-id": _vm.novel.novel_id
    },
    on: {
      "navigate": function ($event) {
        _vm.readerExcerptsVisible = false;
      },
      "changed": _vm.loadHighlights
    }
  })], 1)]) : _vm._e(), _vm._ssrNode(" "), _vm.readerSettingsVisible ? _c('ReaderSettings', {
    attrs: {
      "visible": _vm.readerSettingsVisible,
      "value": _vm.readerPreferences,
      "fonts": _vm.readerFonts,
      "skins": _vm.readerSkins,
      "tier": _vm.readerTier,
      "font-states": _vm.readerFontStates,
      "font-error": _vm.readerFontError,
      "resource-error": _vm.readerResourceError,
      "locked-message": _vm.readerLockedMessage,
      "resources-loading": _vm.readerResourcesLoading,
      "storage-error": _vm.readerStorageError
    },
    on: {
      "update:visible": function ($event) {
        _vm.readerSettingsVisible = $event;
      },
      "input": _vm.changeReaderPreferences,
      "font": _vm.selectReaderFont,
      "theme": _vm.selectReaderTheme,
      "skin": _vm.selectReaderSkin,
      "refresh": _vm.refreshReaderResources,
      "membership": _vm.openReaderMembership,
      "reset": _vm.resetReaderPreferences
    }
  }) : _vm._e(), _vm._ssrNode(" "), _vm.feedbackParagraph ? _c('ReaderFeedback', {
    key: _vm.feedbackParagraph.id,
    attrs: {
      "visible": _vm.feedbackVisible,
      "article-id": _vm.article.article_id,
      "paragraph-id": _vm.feedbackParagraph.id,
      "paragraph-text": _vm.feedbackParagraph.text
    },
    on: {
      "update:visible": function ($event) {
        _vm.feedbackVisible = $event;
      }
    }
  }) : _vm._e()], 2)]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/article/_id.vue?vue&type=template&id=75d133b0&scoped=true

// EXTERNAL MODULE: ./utils/reading-history.js
var reading_history = __webpack_require__(35);

// EXTERNAL MODULE: ./utils/reader-position.js
var reader_position = __webpack_require__(156);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reader-comment-links.js
var reader_comment_links = __webpack_require__(127);

// EXTERNAL MODULE: ./utils/reader-paragraphs.js
var reader_paragraphs = __webpack_require__(37);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(34);

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(10);

// EXTERNAL MODULE: ./components/read/ReaderPager.vue + 9 modules
var ReaderPager = __webpack_require__(217);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderNavigation.vue?vue&type=template&id=40608b75&scoped=true
var ReaderNavigationvue_type_template_id_40608b75_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('el-drawer', {
    attrs: {
      "custom-class": "reading-drawer",
      "title": "目录与进度",
      "visible": _vm.visible,
      "size": "min(720px, 100%)",
      "append-to-body": ""
    },
    on: {
      "update:visible": function ($event) {
        return _vm.$emit('update:visible', $event);
      }
    }
  }, [_c('div', {
    staticClass: "reader-navigation"
  }, [_c('section', {
    staticClass: "chapter-seek"
  }, [_c('h3', [_vm._v(_vm._s(_vm.current.title))]), _vm._v(" "), _c('div', {
    staticClass: "chapter-progress"
  }, [_c('span', [_vm._v("全书进度")]), _c('span', {
    staticClass: "progress-value"
  }, [_vm._v(_vm._s(_vm.percentage) + "%")])]), _vm._v(" "), _vm.readable.length ? _c('p', [_vm._v("第 " + _vm._s(_vm.currentIndex + 1) + " / " + _vm._s(_vm.readable.length) + " 章")]) : _vm._e(), _vm._v(" "), _vm.canUndo ? _c('button', {
    on: {
      "click": function ($event) {
        return _vm.$emit('undo');
      }
    }
  }, [_vm._v("撤销上次章节跳转")]) : _vm._e()]), _vm._v(" "), _c('ChapterCatalog', {
    attrs: {
      "chapters": _vm.chapters,
      "novel-id": _vm.novelId,
      "current-chapter": _vm.current.article_chapter
    },
    on: {
      "navigate": function ($event) {
        return _vm.$emit('catalog-navigate', $event);
      }
    }
  })], 1)]);
};
var ReaderNavigationvue_type_template_id_40608b75_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderNavigation.vue?vue&type=template&id=40608b75&scoped=true

// EXTERNAL MODULE: ./components/read/ChapterCatalog.vue + 4 modules
var ChapterCatalog = __webpack_require__(225);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderNavigation.vue?vue&type=script&lang=js

/* harmony default export */ var ReaderNavigationvue_type_script_lang_js = ({
  components: {
    ChapterCatalog: ChapterCatalog["a" /* default */]
  },
  props: {
    visible: Boolean,
    chapters: {
      type: Array,
      required: true
    },
    current: {
      type: Object,
      required: true
    },
    novelId: [String, Number],
    canUndo: Boolean
  },
  computed: {
    readable() {
      return this.chapters.filter(chapter => chapter.article_type !== 'spliter');
    },
    currentIndex() {
      return Math.max(0, this.readable.findIndex(chapter => Number(chapter.article_id) === Number(this.current.article_id)));
    },
    percentage() {
      return this.readable.length ? ((this.currentIndex + 1) / this.readable.length * 100).toFixed(1) : '0';
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderNavigation.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderNavigationvue_type_script_lang_js = (ReaderNavigationvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderNavigation.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(377)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderNavigationvue_type_script_lang_js,
  ReaderNavigationvue_type_template_id_40608b75_scoped_true_render,
  ReaderNavigationvue_type_template_id_40608b75_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "40608b75",
  "04d3b535"
  
)

/* harmony default export */ var ReaderNavigation = (component.exports);
// EXTERNAL MODULE: ./mixins/reader-preferences.js + 2 modules
var reader_preferences = __webpack_require__(228);

// EXTERNAL MODULE: ./components/read/ReaderSettings.vue + 4 modules
var ReaderSettings = __webpack_require__(224);

// EXTERNAL MODULE: ./components/read/BookExcerpts.vue + 4 modules
var BookExcerpts = __webpack_require__(226);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderFeedback.vue?vue&type=template&id=d144cce4&scoped=true
var ReaderFeedbackvue_type_template_id_d144cce4_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('el-dialog', {
    attrs: {
      "custom-class": "reading-dialog",
      "title": "反馈文本错误",
      "visible": _vm.visible,
      "width": "min(520px, 94vw)",
      "append-to-body": ""
    },
    on: {
      "update:visible": function ($event) {
        return _vm.$emit('update:visible', $event);
      }
    }
  }, [_c('blockquote', [_vm._v(_vm._s(_vm.paragraphText))]), _c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 4,
      "maxlength": "500",
      "show-word-limit": "",
      "placeholder": "请说明错别字、标点或其他问题，以及建议修改的内容"
    },
    model: {
      value: _vm.content,
      callback: function ($$v) {
        _vm.content = $$v;
      },
      expression: "content"
    }
  }), _vm.error ? _c('p', {
    staticClass: "error",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), _vm._v(" "), _c('span', {
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('el-button', {
    on: {
      "click": function ($event) {
        return _vm.$emit('update:visible', false);
      }
    }
  }, [_vm._v("取消")]), _c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.sending,
      "disabled": !_vm.content.trim()
    },
    on: {
      "click": _vm.submit
    }
  }, [_vm._v("提交反馈")])], 1)], 1);
};
var ReaderFeedbackvue_type_template_id_d144cce4_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderFeedback.vue?vue&type=template&id=d144cce4&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderFeedback.vue?vue&type=script&lang=js

/* harmony default export */ var ReaderFeedbackvue_type_script_lang_js = ({
  props: {
    visible: Boolean,
    articleId: {
      type: [Number, String],
      required: true
    },
    paragraphId: {
      type: [Number, String],
      required: true
    },
    paragraphText: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    content: '',
    error: '',
    sending: false,
    version: 0
  }),
  beforeDestroy() {
    this.version++;
  },
  methods: {
    async submit() {
      if (this.sending || !this.content.trim()) return;
      const token = Object(reading["c" /* readingToken */])();
      if (!token) {
        this.error = '登录后可以向作者反馈文本错误。';
        return;
      }
      const version = this.version;
      this.sending = true;
      this.error = '';
      try {
        await this.$api.reader.feedback({
          article_id: Number(this.articleId),
          paragraph_id: Number(this.paragraphId),
          feedback_content: this.content.trim()
        });
        if (version === this.version && token === Object(reading["c" /* readingToken */])()) {
          this.$message.success('反馈已提交，感谢你帮助完善作品');
          this.$emit('update:visible', false);
          this.content = '';
        }
      } catch (error) {
        if (version === this.version && token === Object(reading["c" /* readingToken */])()) this.error = error.message;
      } finally {
        if (version === this.version) this.sending = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderFeedback.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderFeedbackvue_type_script_lang_js = (ReaderFeedbackvue_type_script_lang_js); 
// CONCATENATED MODULE: ./components/read/ReaderFeedback.vue



function ReaderFeedback_injectStyles (context) {
  
  var style0 = __webpack_require__(379)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var ReaderFeedback_component = Object(componentNormalizer["a" /* default */])(
  read_ReaderFeedbackvue_type_script_lang_js,
  ReaderFeedbackvue_type_template_id_d144cce4_scoped_true_render,
  ReaderFeedbackvue_type_template_id_d144cce4_scoped_true_staticRenderFns,
  false,
  ReaderFeedback_injectStyles,
  "d144cce4",
  "5466f734"
  
)

/* harmony default export */ var ReaderFeedback = (ReaderFeedback_component.exports);
// EXTERNAL MODULE: ./components/manga/MangaCommentPanel.vue + 19 modules
var MangaCommentPanel = __webpack_require__(154);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/_id.vue?vue&type=script&lang=js














/* harmony default export */ var _idvue_type_script_lang_js = ({
  components: {
    ReaderPager: ReaderPager["a" /* default */],
    ReaderNavigation: ReaderNavigation,
    ReaderFeedback: ReaderFeedback,
    MangaCommentPanel: MangaCommentPanel["a" /* default */],
    ReaderSettings: ReaderSettings["a" /* default */],
    BookExcerpts: BookExcerpts["a" /* default */]
  },
  mixins: [reader_preferences["a" /* default */]],
  async asyncData({
    params,
    $api,
    error
  }) {
    try {
      // 获取章节内容
      const article = await $api.reader.article(params.id);
      if (!article || article.length === 0) {
        return error({
          statusCode: 404,
          message: '找不到该章节'
        });
      }
      const articleData = article[0];

      // 获取小说信息
      const novel = await $api.reader.book(articleData.novel_id);
      if (!novel || novel.length === 0) {
        return error({
          statusCode: 404,
          message: '找不到该小说'
        });
      }

      // 获取章节列表
      const chapterEntries = await $api.reader.chapters(articleData.novel_id);
      const chapters = chapterEntries.filter(chapter => chapter.article_type !== 'spliter');

      // 找到当前章节的索引
      const currentChapterIndex = chapters.findIndex(chapter => Number(chapter.article_id) === Number(articleData.article_id));
      return {
        article: articleData,
        novel: novel[0],
        chapterEntries,
        chapters: chapters || [],
        currentChapterIndex,
        loading: false,
        error: null
      };
    } catch (err) {
      console.error('加载章节内容失败', err);
      return error({
        statusCode: err.status || 503,
        message: err.status === 404 ? '章节不存在或不可阅读' : '加载章节内容失败，请稍后重试'
      });
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      highlights: [],
      highlightBusy: false,
      highlightError: '',
      highlightAuthExpired: false,
      highlightVersion: 0,
      highlightOperationVersion: 0,
      readerIdentityVersion: 0,
      feedbackVisible: false,
      feedbackParagraph: null,
      paragraphVersion: 0,
      isLiked: false,
      readerReady: false,
      readerInitialPosition: {},
      readerPosition: {},
      readerNavigationVisible: false,
      readerJumpUndo: null,
      readerProgressAccount: null,
      readerSettingsVisible: false,
      readerExcerptsVisible: false,
      audioSpeakingId: 0,
      audioProgressKey: '',
      audioRouteRequested: 0,
      showHeader: true,
      lastScrollPosition: 0,
      // 段落评论相关
      selectionMode: false,
      selectedParagraph: null,
      panelPosition: {
        x: 0,
        y: 0
      },
      paragraphComments: {},
      showCommentDrawer: false,
      currentParagraphId: null,
      paragraphCommentText: '',
      // 段落评论数量
      paragraphCommentsCount: {}
    };
  },
  computed: {
    commentAnchor() {
      return Object(reader_comment_links["a" /* readingCommentId */])(this.$route.query);
    },
    chapterPercent() {
      return this.chapters.length ? ((this.currentChapterIndex + 1) / this.chapters.length * 100).toFixed(1) : '0';
    },
    canFinish() {
      return this.currentChapterIndex >= 0 && this.currentChapterIndex === this.chapters.length - 1;
    },
    hasPrevious() {
      return this.currentChapterIndex > 0;
    },
    hasNext() {
      return this.currentChapterIndex >= 0 && this.currentChapterIndex < this.chapters.length - 1;
    },
    paragraphs() {
      return Object(reader_paragraphs["a" /* readerParagraphs */])(this.article.content, this.article.article_type);
    },
    selectedHighlight() {
      return this.selectedParagraph && this.highlights.find(item => Number(item.paragraph_id) === Number(this.selectedParagraph.id));
    }
  },
  head() {
    return Object(reading_seo["d" /* readingHead */])({
      title: `${this.article.title || '章节'} - ${this.novel.name || '阅读'} - 原木社区`,
      description: this.paragraphs.filter(item => item.type === 'text').map(item => item.value).join(' ').slice(0, 150),
      path: `/article/${this.article.article_id}`,
      image: this.novel.picUrl,
      type: 'article'
    });
  },
  mounted() {
    this.initializeReaderPosition();
    window.addEventListener('focus', this.checkReaderProgressAccount);
    window.addEventListener('storage', this.checkReaderProgressAccount);
    window.addEventListener('auth-state-changed', this.checkReaderProgressAccount);
    if (this.$readerAudio) {
      this.unsubscribeAudio = this.$readerAudio.subscribe(this.onReaderAudioProgress);
      this.onReaderAudioProgress(this.$readerAudio.state);
    }
    this.recordRead();
    // 保存阅读历史

    // 添加段落长按事件监听
    this.loadHighlights();
    this.openNotificationComment();

    // 添加点击空白区域关闭菜单的监听器
    document.addEventListener('click', this.handleDocumentClick);

    // 添加滚动事件监听
    window.addEventListener('scroll', this.handleScroll);

    // 获取段落评论数量
    this.fetchParagraphCommentsCount();
  },
  beforeRouteUpdate(to, from, next) {
    this.saveReaderHistory(true);
    next();
  },
  beforeRouteLeave(to, from, next) {
    this.saveReaderHistory(true);
    next();
  },
  watch: {
    '$route.query'(query, previous) {
      if (this.$route.params.id && Number(this.$route.params.id) !== Number(this.article.article_id)) return;
      if (['paragraphId', 'charOffset', 'edge', 'start', 'pageIdx'].some(key => query[key] !== previous[key])) this.initializeReaderPosition();
      if (Object(reader_comment_links["a" /* readingCommentId */])(query) !== Object(reader_comment_links["a" /* readingCommentId */])(previous)) this.openNotificationComment();
    },
    'article.article_id'(id, previous) {
      if (!id || String(id) === String(previous)) return;
      this.audioProgressKey = '';
      this.audioSpeakingId = 0;
      this.clearSelection();
      this.highlights = [];
      this.paragraphCommentsCount = {};
      this.showCommentDrawer = false;
      this.feedbackVisible = false;
      this.feedbackParagraph = null;
      this.initializeReaderPosition();
      this.recordRead();
      this.loadHighlights();
      this.fetchParagraphCommentsCount();
      this.openNotificationComment();
      if (this.$readerAudio) this.onReaderAudioProgress(this.$readerAudio.state);
    }
  },
  beforeDestroy() {
    this.saveReaderHistory(true);
    clearTimeout(this.readerSaveTimer);
    window.removeEventListener('focus', this.checkReaderProgressAccount);
    window.removeEventListener('storage', this.checkReaderProgressAccount);
    window.removeEventListener('auth-state-changed', this.checkReaderProgressAccount);
    this.resetReaderHighlightScope();
    if (this.unsubscribeAudio) this.unsubscribeAudio();
    this.paragraphVersion++;
    // 移除滚动事件监听
    window.removeEventListener('scroll', this.handleScroll);
    // 移除点击监听
    document.removeEventListener('click', this.handleDocumentClick);
  },
  methods: {
    openReaderExcerpts() {
      this.clearSelection();
      this.readerSettingsVisible = false;
      this.readerNavigationVisible = false;
      this.showCommentDrawer = false;
      this.readerExcerptsVisible = true;
    },
    openNotificationComment() {
      if (!this.commentAnchor) return;
      const id = Number(this.$route.query.paragraphId),
        paragraph = this.paragraphs.find(item => item.id === id);
      this.currentParagraphId = paragraph ? id : 0;
      this.paragraphCommentText = paragraph ? paragraph.value : '';
      this.showCommentDrawer = true;
    },
    workUrl: reading_discovery["n" /* workUrl */],
    openReaderAudio(paragraphId) {
      var _this$paragraphs$find;
      if (!this.$readerAudio) return;
      const paragraphs = [...document.querySelectorAll('[data-paragraph-id]')];
      const visible = paragraphs.find(element => element.getBoundingClientRect().bottom > 120 && element.getBoundingClientRect().top < window.innerHeight);
      const start = paragraphId == null ? Number(visible && visible.dataset.paragraphId) || ((_this$paragraphs$find = this.paragraphs.find(row => row.type === 'text' && row.value.trim())) === null || _this$paragraphs$find === void 0 ? void 0 : _this$paragraphs$find.id) : paragraphId;
      this.$readerAudio.open(this.novel, this.chapters, this.article, start);
      this.clearSelection();
    },
    onReaderAudioProgress(state) {
      this.audioSpeakingId = state.visible && state.speechStarted && Number(state.chapterId) === Number(this.article.article_id) ? state.paragraphId : 0;
      if (!state.visible || !state.speechStarted || !state.follow || Number(state.bookId) !== Number(this.novel.novel_id)) return;
      if (Number(state.chapterId) !== Number(this.article.article_id)) {
        if (state.status === 'playing' && this.audioRouteRequested !== state.chapterId) {
          this.audioRouteRequested = state.chapterId;
          Promise.resolve().then(() => this.$router.push(`/article/${state.chapterId}`)).catch(() => {
            this.audioRouteRequested = 0;
          });
        }
        return;
      }
      this.audioRouteRequested = 0;
      const key = `${state.chapterId}:${state.paragraphId}`;
      if (key === this.audioProgressKey) return;
      this.audioProgressKey = key;
      this.$nextTick(() => {
        const paragraph = document.getElementById(`paragraph-${state.paragraphId}`);
        if (paragraph && this.$refs.pager) this.$refs.pager.jump(state.paragraphId);
      });
    },
    // 记录阅读行为
    async recordRead() {
      if (this.article.article_id) {
        try {
          await this.$api.statistics.novelClicked(this.article.article_id);
        } catch (error) {
          console.error('记录阅读行为失败', error);
        }
      }
    },
    // Save stable local anchors alongside the existing cloud chapter/page protocol.
    saveReaderHistory(forceCloud = false) {
      if (Object(reading["c" /* readingToken */])() !== this.readerProgressAccount) return;
      if (!this.novel || !this.novel.novel_id || !this.article.article_id) return;
      const position = Object(reader_position["b" /* normalizeReaderPosition */])(this.readerPosition);
      const progress = {
        last_article_id: Number(this.article.article_id),
        last_article_chapter: Number(this.article.article_chapter) || 0,
        last_page_idx: position.pageIndex,
        last_paragraph_id: position.paragraphId,
        last_char_offset: position.charOffset
      };
      Object(reading_history["d" /* recordLocalReading */])(this.novel, progress);
      if (forceCloud || Date.now() - (this.lastReaderCloudSave || 0) > 10000) {
        this.lastReaderCloudSave = Date.now();
        this.$api.reading.saveProgress({
          novel_id: Number(this.novel.novel_id),
          article_id: progress.last_article_id,
          page_idx: position.pageIndex
        }).catch(() => {});
      }
    },
    initializeReaderPosition() {
      clearTimeout(this.readerSaveTimer);
      this.readerProgressAccount = Object(reading["c" /* readingToken */])();
      this.lastReaderCloudSave = 0;
      this.resetReaderHighlightScope();
      this.readerInitialPosition = Object(reader_position["a" /* initialReaderPosition */])(this.$route.query, Object(reading_history["b" /* localReadingProgress */])(this.novel.novel_id), this.article.article_id);
      this.readerPosition = this.readerInitialPosition;
      this.readerReady = true;
      this.readerNavigationVisible = false;
      this.readerExcerptsVisible = false;
      try {
        this.readerJumpUndo = JSON.parse(sessionStorage.getItem(this.readerUndoKey()) || 'null');
      } catch (_) {
        this.readerJumpUndo = null;
      }
    },
    checkReaderProgressAccount() {
      if (this.readerProgressAccount === Object(reading["c" /* readingToken */])()) return false;
      this.initializeReaderPosition();
      this.highlights = [];
      this.clearSelection();
      this.showCommentDrawer = false;
      this.feedbackVisible = false;
      this.loadHighlights();
      return true;
    },
    onReaderPosition(position) {
      this.readerPosition = position;
      clearTimeout(this.readerSaveTimer);
      this.readerSaveTimer = setTimeout(() => this.saveReaderHistory(), 500);
    },
    readerUndoKey() {
      return `loghome:reader:undo:${Object(reading_history["c" /* readingAccountKey */])()}:${this.novel.novel_id}`;
    },
    recordReaderChapterJump() {
      const position = this.$refs.pager ? this.$refs.pager.capture() : this.readerPosition;
      this.readerJumpUndo = {
        articleId: Number(this.article.article_id),
        ...position
      };
      try {
        sessionStorage.setItem(this.readerUndoKey(), JSON.stringify(this.readerJumpUndo));
      } catch (_) {}
      this.readerNavigationVisible = false;
      this.saveReaderHistory(true);
    },
    undoReaderChapterJump() {
      const previous = this.readerJumpUndo;
      if (!previous) return;
      this.readerJumpUndo = null;
      this.readerNavigationVisible = false;
      try {
        sessionStorage.removeItem(this.readerUndoKey());
      } catch (_) {}
      this.$router.push(`/article/${previous.articleId}?paragraphId=${previous.paragraphId || 0}&charOffset=${previous.charOffset || 0}&pageIdx=${previous.pageIndex || 0}`);
    },
    finishReading() {
      if (!this.canFinish) return;
      this.saveReaderHistory(true);
      this.$router.push(`/read/end/${this.novel.novel_id}`);
    },
    navigatePageBoundary(direction) {
      const chapter = this.chapters[this.currentChapterIndex + (direction === 'prev' ? -1 : 1)];
      if (!chapter) return;
      this.saveReaderHistory(true);
      this.$router.push(`/article/${chapter.article_id}?${direction === 'prev' ? 'edge=end' : 'start=1'}`);
    },
    // 滚动事件处理
    handleScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

      // 上滚显示，下滚隐藏
      if (currentScrollPosition < this.lastScrollPosition) {
        this.showHeader = true;
      } else if (currentScrollPosition > 50) {
        this.showHeader = false;
      }
      this.lastScrollPosition = currentScrollPosition;
    },
    // 切换点赞状态
    toggleLike() {
      this.isLiked = !this.isLiked;
      // 这里应该调用API保存点赞状态
    },
    // 章节导航
    navigateChapter(direction) {
      if (direction === 'prev' && this.hasPrevious) {
        const prevChapter = this.chapters[this.currentChapterIndex - 1];
        this.$router.push(`/article/${prevChapter.article_id}`);
      } else if (direction === 'next' && this.hasNext) {
        const nextChapter = this.chapters[this.currentChapterIndex + 1];
        this.$router.push(`/article/${nextChapter.article_id}`);
      }
    },
    // 返回小说详情页
    goToNovelDetail() {
      this.$router.push(`/novel/${this.article.novel_id}`);
    },
    // 返回上一页
    goBack() {
      this.$router.back();
    },
    // 格式化数字
    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
      }
      return num;
    },
    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    onCommentsChanged(source) {
      this.fetchParagraphCommentsCount();
      this.loadHighlights();
      if (source === 'drawer' && this.$refs.chapterReviews) this.$refs.chapterReviews.onOpen();
    },
    async fetchParagraphCommentsCount() {
      const version = ++this.paragraphVersion,
        articleId = this.article.article_id;
      try {
        const rows = await this.$api.reader.paragraphAmounts(articleId, this.paragraphs.filter(item => item.type === 'text').map(item => item.id));
        if (version !== this.paragraphVersion || articleId !== this.article.article_id) return;
        const counts = {};
        for (const row of rows || []) counts[row.paragraph_id] = Number(row.count) || 0;
        this.paragraphCommentsCount = counts;
      } catch (_) {/* Existing counts remain available. */}
    },
    openParagraphCommentWindow(paragraphId) {
      const id = Number(paragraphId),
        paragraph = this.paragraphs.find(item => item.id === id);
      this.currentParagraphId = id || 0;
      this.paragraphCommentText = paragraph ? paragraph.value : '';
      this.showCommentDrawer = true;
      if (this.selectionMode) this.clearSelection();
    },
    resetReaderHighlightScope() {
      this.readerIdentityVersion++;
      this.highlightVersion++;
      this.highlightOperationVersion++;
      this.highlights = [];
      this.highlightBusy = false;
      this.highlightError = '';
      this.highlightAuthExpired = false;
    },
    readerHighlightScope() {
      return {
        identity: this.readerIdentityVersion,
        token: Object(reading["c" /* readingToken */])(),
        articleId: this.article.article_id
      };
    },
    currentReaderHighlightScope(scope) {
      return scope.identity === this.readerIdentityVersion && scope.token === Object(reading["c" /* readingToken */])() && scope.token === this.readerProgressAccount && scope.articleId === this.article.article_id;
    },
    async loadHighlights() {
      if (this.checkReaderProgressAccount()) return;
      const scope = this.readerHighlightScope(),
        version = ++this.highlightVersion;
      this.highlightError = '';
      this.highlightAuthExpired = false;
      if (!scope.token) {
        this.highlights = [];
        return;
      }
      try {
        const rows = await this.$api.reader.highlights(scope.articleId);
        if (!this.currentReaderHighlightScope(scope) || version !== this.highlightVersion) return;
        if (!Array.isArray(rows)) throw new Error('划线书摘数据暂不可用');
        this.highlights = rows;
      } catch (error) {
        if (!this.currentReaderHighlightScope(scope) || version !== this.highlightVersion) return;
        this.highlightAuthExpired = [401, 403].includes(Number(error.status || error.response && error.response.status));
        if (this.highlightAuthExpired) this.highlights = [];
        this.highlightError = this.highlightAuthExpired ? '登录状态已过期，请重新登录后查看或收藏划线书摘。' : '划线书摘加载失败，本页仍可阅读。';
      }
    },
    async toggleHighlight() {
      if (this.checkReaderProgressAccount()) return;
      if (!this.selectedParagraph || this.highlightBusy) return;
      if (!Object(reading["c" /* readingToken */])()) {
        this.$message.info('登录后可以收藏划线书摘');
        return;
      }
      if (this.highlightAuthExpired) {
        this.$message.info('登录状态已过期，请重新登录后收藏划线书摘');
        return;
      }
      const paragraph = this.selectedParagraph,
        existing = this.selectedHighlight;
      const scope = this.readerHighlightScope(),
        operation = ++this.highlightOperationVersion;
      const current = () => this.currentReaderHighlightScope(scope) && operation === this.highlightOperationVersion;
      this.highlightVersion++;
      this.highlightBusy = true;
      this.highlightError = '';
      try {
        if (existing) await this.$api.reader.unhighlight(existing.article_cento_id);else await this.$api.reader.highlight({
          article_id: scope.articleId,
          paragraph_id: Number(paragraph.id),
          paragraph: paragraph.text
        });
        if (!current()) return;
        if (this.selectedParagraph === paragraph) this.clearSelection();
        await this.loadHighlights();
      } catch (error) {
        if (!current()) return;
        this.highlightAuthExpired = [401, 403].includes(Number(error.status || error.response && error.response.status));
        if (this.highlightAuthExpired) {
          this.highlights = [];
          this.highlightError = '登录状态已过期，请重新登录后查看或收藏划线书摘。';
        }
        this.$message.error(this.highlightAuthExpired ? this.highlightError : error.message || '划线操作失败');
      } finally {
        if (current()) this.highlightBusy = false;
      }
    },
    openFeedback() {
      if (!this.selectedParagraph) return;
      this.feedbackParagraph = {
        id: Number(this.selectedParagraph.id),
        text: this.selectedParagraph.text
      };
      this.feedbackVisible = true;
      this.clearSelection();
    },
    // 处理段落右键点击
    handleParagraphRightClick(event, paragraph) {
      // 清除之前的选择
      this.clearSelection();

      // 设置当前选中段落
      const paragraphId = paragraph.dataset.paragraphId;
      const paragraphText = decodeURIComponent(paragraph.dataset.paragraphText);
      this.selectedParagraph = {
        id: paragraphId,
        text: paragraphText,
        element: paragraph
      };

      // 高亮显示选中段落
      paragraph.classList.add('selected');

      // 计算菜单位置 - 在鼠标右键位置显示
      this.panelPosition = {
        x: Math.max(20, Math.min(event.clientX, window.innerWidth - 300)),
        y: Math.max(8, Math.min(event.clientY, window.innerHeight - 230))
      };
      this.selectionMode = true;
    },
    // 处理段落长按 - 保留此方法以便在触摸设备上仍然可以响应长按
    handleParagraphLongPress(event, paragraph) {
      event.preventDefault();

      // 清除之前的选择
      this.clearSelection();

      // 设置当前选中段落
      const paragraphId = paragraph.dataset.paragraphId;
      const paragraphText = decodeURIComponent(paragraph.dataset.paragraphText);
      this.selectedParagraph = {
        id: paragraphId,
        text: paragraphText,
        element: paragraph
      };

      // 高亮显示选中段落
      paragraph.classList.add('selected');

      // 计算面板位置
      const rect = paragraph.getBoundingClientRect();
      const x = (rect.left + rect.right) / 2 - 150; // 面板宽度的一半
      const y = rect.bottom + 10;
      this.panelPosition = {
        x: Math.max(20, Math.min(x, window.innerWidth - 300)),
        y: Math.min(y, window.innerHeight - 100)
      };
      this.selectionMode = true;
    },
    // 清除选择
    clearSelection() {
      if (this.selectedParagraph) {
        this.selectedParagraph.element.classList.remove('selected');
        this.selectedParagraph = null;
      }
      this.selectionMode = false;
    },
    // 复制段落内容
    handleCopy() {
      if (!this.selectedParagraph) return;
      const textToCopy = `${this.selectedParagraph.text}\n\n—— 摘自《${this.novel.name}》`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.$message.success('内容已复制');
        this.clearSelection();
      }).catch(() => {
        this.$message.error('复制失败');
      });
    },
    // 处理文档点击事件，关闭菜单
    handleDocumentClick(event) {
      // 如果点击的不是段落或菜单内部元素，则关闭菜单
      if (this.selectionMode && !event.target.closest('.paragraph-floating-panel') && !event.target.closest('.article-paragraph.selected')) {
        this.clearSelection();
      }
    }
  }
});
// CONCATENATED MODULE: ./pages/article/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var article_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// CONCATENATED MODULE: ./pages/article/_id.vue



function _id_injectStyles (context) {
  
  var style0 = __webpack_require__(381)
if (style0.__inject__) style0.__inject__(context)
var style1 = __webpack_require__(383)
if (style1.__inject__) style1.__inject__(context)
var style2 = __webpack_require__(385)
if (style2.__inject__) style2.__inject__(context)
var style3 = __webpack_require__(387)
if (style3.__inject__) style3.__inject__(context)

}

/* normalize component */

var _id_component = Object(componentNormalizer["a" /* default */])(
  article_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  _id_injectStyles,
  "75d133b0",
  "2a5b2ce4"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (_id_component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map