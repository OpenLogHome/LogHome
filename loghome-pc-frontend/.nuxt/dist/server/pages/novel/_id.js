exports.ids = [41];
exports.modules = {

/***/ 150:
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
  
  var style0 = __webpack_require__(157)
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

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(158);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("ca2f1c12", content, true, context)
};

/***/ }),

/***/ 153:
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
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
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

/***/ 156:
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URL"]))

/***/ }),

/***/ 157:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(151);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_SiteIcon_vue_vue_type_style_index_0_id_6a890970_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.site-icon[data-v-6a890970] { display: inline-block; width: 1.125em; height: 1.125em; flex: none; vertical-align: -0.18em;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 164:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(178);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("7e210ac6", content, true, context)
};

/***/ }),

/***/ 165:
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URL"]))

/***/ }),

/***/ 166:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(183);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("6e3b9593", content, true, context)
};

/***/ }),

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(185);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("12716518", content, true, context)
};

/***/ }),

/***/ 168:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(187);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("6efdea43", content, true, context)
};

/***/ }),

/***/ 169:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(189);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("ce121144", content, true, context)
};

/***/ }),

/***/ 172:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(194);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("ed252e78", content, true, context)
};

/***/ }),

/***/ 173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return worldImage; });
/* unused harmony export worldVocabulary */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return worldGraph; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return filterWorldNodes; });
/* unused harmony export loadWorldVocabularies */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return loadPublicWorld; });
/* harmony import */ var _reader_comment_links__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40);

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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URL"]))

/***/ }),

/***/ 176:
/***/ (function(module) {

module.exports = JSON.parse("[\"😀\",\"😃\",\"😄\",\"😁\",\"😆\",\"😅\",\"😂\",\"🤣\",\"😊\",\"😇\",\"🙂\",\"🙃\",\"😉\",\"😌\",\"😍\",\"🥰\",\"😘\",\"😗\",\"😙\",\"😚\",\"😋\",\"😛\",\"😝\",\"😜\",\"🤪\",\"🤨\",\"🧐\",\"🤓\",\"😎\",\"🤩\",\"🥳\",\"😏\",\"😒\",\"😞\",\"😔\",\"😟\",\"😕\",\"🙁\",\"☹️\",\"😣\",\"😖\",\"😫\",\"😩\",\"🥺\",\"😢\",\"😭\",\"😤\",\"😠\",\"😡\",\"🤬\",\"🤯\",\"😳\",\"🥵\",\"🥶\",\"😱\",\"😨\",\"😰\",\"😥\",\"😓\",\"🤗\",\"🤔\",\"🤭\",\"🤫\",\"🤥\",\"😶\",\"😐\",\"😑\",\"😬\",\"🙄\",\"😯\",\"😦\",\"😧\",\"😮\",\"😲\",\"🥱\",\"😴\",\"🤤\",\"😪\",\"😵\",\"🤐\",\"🥴\",\"🤢\",\"🤮\",\"🤧\",\"😷\",\"🤒\",\"🤕\",\"🤑\",\"🤠\",\"😈\",\"👿\",\"👹\",\"👺\",\"🤡\",\"💩\",\"👻\",\"💀\",\"☠️\",\"👽\",\"👾\",\"🤖\",\"🎃\",\"😺\",\"😸\",\"😹\",\"😻\",\"😼\",\"😽\",\"🙀\",\"😿\",\"😾\",\"👋\",\"🤚\",\"🖐\",\"✋\",\"🖖\",\"👌\",\"🤌\",\"🤏\",\"✌️\",\"🤞\",\"🤟\",\"🤘\",\"🤙\",\"👈\",\"👉\",\"👆\",\"🖕\",\"👇\",\"☝️\",\"👍\",\"👎\",\"✊\",\"👊\",\"🤛\",\"🤜\",\"👏\",\"🙌\",\"👐\",\"🤲\",\"🤝\",\"🙏\",\"✍️\",\"💅\",\"🤳\",\"💪\",\"🦾\",\"🦵\",\"🦿\",\"🦶\",\"👣\",\"👂\",\"🦻\",\"👃\",\"🫀\",\"🫁\",\"🧠\",\"🦷\",\"🦴\",\"👀\",\"👁\",\"👅\",\"👄\",\"💋\",\"🩸\",\"🔥\",\"✨\",\"🌟\",\"💫\",\"💬\"]");

/***/ }),

/***/ 177:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(164);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderEmojiPicker_vue_vue_type_style_index_0_id_e43c8880_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 178:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-emoji-picker[data-v-e43c8880]{display:inline-flex}.emoji-trigger[data-v-e43c8880]{display:inline-flex;align-items:center;gap:5px;background:none;border:0;color:#947358;font:inherit;font-size:13px;cursor:pointer;padding:0}.emoji-trigger[data-v-e43c8880]:disabled{opacity:.5;cursor:default}.emoji-tabs[data-v-e43c8880]{display:flex;gap:8px;border-bottom:1px solid #e8e2d8;padding-bottom:12px;margin-bottom:16px}.emoji-tabs button[data-v-e43c8880],.categories button[data-v-e43c8880],.upload-trigger[data-v-e43c8880]{font:inherit;font-size:13px;border:1px solid #e6ddcf;border-radius:6px;padding:7px 12px;background:#fff;color:#89775e;cursor:pointer}.emoji-tabs button.active[data-v-e43c8880],.categories button.active[data-v-e43c8880]{background:#ecf0df;color:#7a8e50;border-color:#dbe4c6}.emoji-grid[data-v-e43c8880]{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:6px;max-height:420px;overflow:auto}.emoji-grid button[data-v-e43c8880]{border:0;background:#faf8f3;padding:8px 0;border-radius:7px;font-size:25px;cursor:pointer}.emoji-grid button[data-v-e43c8880]:hover{background:#eeeadf}.sticker-toolbar[data-v-e43c8880]{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin-bottom:18px}.categories[data-v-e43c8880]{display:flex;gap:6px;flex-wrap:wrap}.categories button[data-v-e43c8880]{font-size:12px;padding:6px 9px}.sticker-grid[data-v-e43c8880]{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;max-height:440px;overflow:auto;padding:1px}.sticker-card[data-v-e43c8880]{min-width:0}.sticker-image[data-v-e43c8880]{position:relative;display:block;width:100%;aspect-ratio:1;background:#faf8f4;border:1px solid #eee8df;border-radius:8px;padding:6px;cursor:pointer}.sticker-image img[data-v-e43c8880]{width:100%;height:100%;object-fit:contain}.privacy-badge[data-v-e43c8880]{position:absolute;right:4px;bottom:4px;background:#fff9;color:#9c8f7d;border-radius:3px;font-size:10px;padding:2px 4px}.sticker-actions[data-v-e43c8880]{display:flex;gap:7px;align-items:center;justify-content:center;padding:6px 0}.sticker-actions button[data-v-e43c8880]{padding:0;border:0;background:none;font-size:11px;color:#9c8566;cursor:pointer}.sticker-actions .manage[data-v-e43c8880]{font-size:18px;line-height:12px}.empty[data-v-e43c8880]{padding:40px 12px;text-align:center;color:#aa9c89;font-size:13px}.error[data-v-e43c8880]{font-size:13px;line-height:1.8;color:#b45b48;margin:12px 0}.error button[data-v-e43c8880]{border:0;background:none;color:inherit;text-decoration:underline;cursor:pointer}.load-more[data-v-e43c8880]{display:block;margin:18px auto 0;background:none;border:0;color:#8f7657;cursor:pointer}.hint[data-v-e43c8880]{font-size:13px;color:#9e8c75;line-height:1.8}.upload-file[data-v-e43c8880]{display:inline-flex;position:relative;border:1px dashed #d6cab7;padding:16px 25px;cursor:pointer;margin:12px 0}.upload-file input[data-v-e43c8880]{position:absolute;inset:0;width:100%;opacity:0;cursor:pointer}.upload-preview[data-v-e43c8880]{display:block;max-width:180px;max-height:180px;object-fit:contain;margin-bottom:16px}.upload-privacy[data-v-e43c8880]{display:flex;gap:6px;align-items:center;font-size:13px;color:#93816a;margin-top:10px}button[data-v-e43c8880]:focus-visible{outline:2px solid #839455;outline-offset:3px}button[data-v-e43c8880]:disabled{cursor:default;opacity:.5}@media(max-width:600px){.emoji-grid[data-v-e43c8880]{grid-template-columns:repeat(7,minmax(0,1fr))}.sticker-grid[data-v-e43c8880]{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.sticker-actions[data-v-e43c8880]{gap:10px}}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 179:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderEmojiPicker.vue?vue&type=template&id=e43c8880&scoped=true
var render = function render() {
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
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderEmojiPicker.vue?vue&type=template&id=e43c8880&scoped=true

// EXTERNAL MODULE: ./components/ui/SiteIcon.vue + 5 modules
var SiteIcon = __webpack_require__(150);

// EXTERNAL MODULE: ./config/reader/emojis.json
var emojis = __webpack_require__(176);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reader-stickers.js
var reader_stickers = __webpack_require__(156);

// EXTERNAL MODULE: ./common/manga-comment-api.js
var manga_comment_api = __webpack_require__(153);

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
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderEmojiPicker.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(177)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderEmojiPickervue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "e43c8880",
  "6e6fa0ba"
  
)

/* harmony default export */ var ReaderEmojiPicker = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 180:
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
var avatar_frame_assets = __webpack_require__(181);

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
  
  var style0 = __webpack_require__(182)
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

/***/ 181:
/***/ (function(module) {

module.exports = JSON.parse("{\"/static/avatar-frames/01.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800369649\",\"sha256\":\"ce59220f4debd13c08bf5fcb29484f21a4f85ac0844c41f38e23d8108ed504ca\"},\"/static/avatar-frames/thumbnails/01.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800483750\",\"sha256\":\"eead1d8d88321ff861e09bc7f1d114574a87f18d9915d12ae88523d28fb152b6\"},\"/static/avatar-frames/02.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800558341\",\"sha256\":\"edefcf69c2b1fdf40de7f229017f5e70c49d058109a52174730cbcbf69fbb2e5\"},\"/static/avatar-frames/thumbnails/02.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800650582\",\"sha256\":\"11d901b50ebd4bb8f79daa992b90eba780b78fc88b283c009c081aa63bdd3387\"},\"/static/avatar-frames/03.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800736493\",\"sha256\":\"c6837726690eb409a4152f647f72e2fca966c2b3168c11503c0f15d35ec99f1c\"},\"/static/avatar-frames/thumbnails/03.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800813294\",\"sha256\":\"ada3a8d02e6737d9aea25f941db84e058be890a0b7ed463bd45acb5a3a9e83a4\"},\"/static/avatar-frames/05.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800890855\",\"sha256\":\"04670e3f3d808c573ee501deb23e0cad453b1a8341669fc9ed2d48ac29c1a335\"},\"/static/avatar-frames/thumbnails/05.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135800974676\",\"sha256\":\"db259e2cd0275cbae3449e8295ebba1d2fb8161c987058ed7954d0ea681ea454\"},\"/static/avatar-frames/07.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801045407\",\"sha256\":\"4261daa030658b80254383431e976875acc7c26b4e2a3d85bc9a9142d07252ef\"},\"/static/avatar-frames/thumbnails/07.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801125278\",\"sha256\":\"d287c540d44e961db5fbb1adc21a67f42f663062b0728938defafcf7c2b544dd\"},\"/static/avatar-frames/08.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801195919\",\"sha256\":\"e7b7c658d58aa7e722d402308d78d2c62c8a6ee0d25770cd61ec164acdbb7d99\"},\"/static/avatar-frames/thumbnails/08.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801273850\",\"sha256\":\"ba7e816e430b0ebe79c7ecc3480574cc62549e4f1df21feb3520c3725bdbea67\"},\"/static/avatar-frames/09.gif\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801342821\",\"sha256\":\"bff230fd73b4ba3cb9a885feb4bd7ad9921a330ff6aafd631b6f9fa9a2c8d8b1\"},\"/static/avatar-frames/thumbnails/09.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801689572\",\"sha256\":\"dde24e974b0db48571aaf6169da80f58723ecddf49ca813941de0b2b2e145878\"},\"/static/avatar-frames/10.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801760083\",\"sha256\":\"57fc88b0ea94d5bc911dafdc15d0dfecdbcc3e8f155128ce7e4423e2f8ed6ad0\"},\"/static/avatar-frames/thumbnails/10.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801843074\",\"sha256\":\"96162b1c531adbb5b14166da265841a82449190fd99df08f98829a2d507314fa\"},\"/static/avatar-frames/11.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801917835\",\"sha256\":\"43aed01404240f52c64aa9f396d87077a157800ef77eb29a57ff6c3c75edc33d\"},\"/static/avatar-frames/thumbnails/11.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135801994086\",\"sha256\":\"0a460abb68075d1d40f4d1fe3e5cab219cf8b7a65ff6393048d689a4e5ec5971\"},\"/static/avatar-frames/12.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802065877\",\"sha256\":\"b3752dbc232a81a41b94f7d61dbca6ee00c54a1b0dcf8d0d21570c0141dc55ff\"},\"/static/avatar-frames/thumbnails/12.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802154688\",\"sha256\":\"b16c7497dd09c78ef135677a936fb1d2f46047694665245e4c73b673f2adc5f2\"},\"/static/avatar-frames/13.gif\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802227339\",\"sha256\":\"3a80ea21f9ab575c36cacde4d3497b69da6ded402c723c28dce3fe7d5d9df82f\"},\"/static/avatar-frames/thumbnails/13.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802816390\",\"sha256\":\"3f10ddc3641a933a4d7ad8017bc0f4734c1893d465e218c62741cc7e9f5a1844\"},\"/static/avatar-frames/14.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135802958281\",\"sha256\":\"d5f49e1f4190b90d5c378808d182c600b63b2c6f325dc461773a08c011fd1344\"},\"/static/avatar-frames/thumbnails/14.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803065782\",\"sha256\":\"a723ff95174b5ecc70cfe8b1c761c41d97052622aa469023df5946f7ec42d6e4\"},\"/static/avatar-frames/15.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803153573\",\"sha256\":\"0e139149eec4905d116837a5c6501b6ff0fef549d5afc7778f05c68bf295df06\"},\"/static/avatar-frames/thumbnails/15.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803248864\",\"sha256\":\"705036da8a756e2b345a406a9f91a96df640dc0811a5a68ad186cbfa69ef26c7\"},\"/static/avatar-frames/16.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803321275\",\"sha256\":\"937ca6efd3303aad5a8463e637d1761e73f908e49b0093efab8c5879cb56626f\"},\"/static/avatar-frames/thumbnails/16.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803395216\",\"sha256\":\"0e6b2b46eacbd14a0c1c55e5280379ee693b265b371616942c4430de90953583\"},\"/static/avatar-frames/17.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803475767\",\"sha256\":\"164e15866f44d50b5a488c5c98ebb4387c314044263a36f2897a90bbc98b4f13\"},\"/static/avatar-frames/thumbnails/17.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803549098\",\"sha256\":\"e57078f04ec6bde991a265858cb7cf8c004fe57fbbc3d3addebfda5a3dcbdb21\"},\"/static/avatar-frames/18.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803620139\",\"sha256\":\"035bf7f5d6fbf8bfde7b1428ad8d50c4742db4b1b1f488692df870512c3b99b9\"},\"/static/avatar-frames/thumbnails/18.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803701720\",\"sha256\":\"eda4633bce44e9b4d796767e8f4fbc6de8757d8201dbe6404d18fac0a7ee8886\"},\"/static/avatar-frames/19.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803770011\",\"sha256\":\"95ff8306f2543e346b6766f96c025b73905a38d7f695c7115babf6dab31f134f\"},\"/static/avatar-frames/thumbnails/19.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803853632\",\"sha256\":\"0ca3bc3e9bef6fa1a804913930e1c971f648bfecf4e6502774d84f26d1791c96\"},\"/static/avatar-frames/20.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803926573\",\"sha256\":\"1835d65a5196a8faf04bddcd5a34ca88afb816900b9b3431467560c7f78e5ce9\"},\"/static/avatar-frames/thumbnails/20.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135803999254\",\"sha256\":\"65c8d8e10e9314999357c9005178a1e95447a207a327e39289f225e8642e9eab\"},\"/static/avatar-frames/21.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804069495\",\"sha256\":\"3c0517040d5d0f84f59b8c02806245578e1e49d6da40ecd159bf435d0d64eeaf\"},\"/static/avatar-frames/thumbnails/21.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804145966\",\"sha256\":\"1ebd42a6894db3ccb507e0f564202167aa8598d25db96ca18491faad78e5005a\"},\"/static/avatar-frames/22.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804215297\",\"sha256\":\"ac9a53a0bb2bd441dce582b4c2fffedb73758f4e5c77fb1f59d100c63c6e4a1b\"},\"/static/avatar-frames/thumbnails/22.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804352118\",\"sha256\":\"afac522db0bc6461a77c1688a4bdacbd01a8192d57a123efe0f57afc18f87cc9\"},\"/static/avatar-frames/23.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804427609\",\"sha256\":\"341945ec5d00c2ecfb13e90be18d5fcd724707ab683683551d5e2e0ac9445313\"},\"/static/avatar-frames/thumbnails/23.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804498530\",\"sha256\":\"68ce2759f34de87dc2e83f82f0547937509867069f54904927b5317a2445adca\"},\"/static/avatar-frames/24.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804568651\",\"sha256\":\"863fb9046ad64c1405fd2d7a62fa90ecfa323a6fe6a2c791c08f76232c6d5f62\"},\"/static/avatar-frames/thumbnails/24.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804642472\",\"sha256\":\"4eeaf6dd92715b3362c516876089661e8c6b7f81feb9011062e3a13ab292e815\"},\"/static/avatar-frames/25.gif\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135804711343\",\"sha256\":\"c32bd21af603206e394569b4f44b9b5c9e0051a820032352aff1bf02cc4b7054\"},\"/static/avatar-frames/thumbnails/25.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135805709654\",\"sha256\":\"bde48d523eb95c573dfbae88014ffeb56d3826667c502a34d3a7281b976a7362\"},\"/static/avatar-frames/26.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135805785385\",\"sha256\":\"5da0d5e5a9debe7b336c211560c35abb9b165b5b89d17f290fb6fd25522550ca\"},\"/static/avatar-frames/thumbnails/26.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135805862856\",\"sha256\":\"d57c2561d013293c736d576657c51d6cb0100f7f993b7c2a1014a7cadd58ae95\"},\"/static/avatar-frames/28.png\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135805932527\",\"sha256\":\"437b179375cad3b47ef1d35446330e3241ca9c1d5b135f66ffe45eed0dda107b\"},\"/static/avatar-frames/thumbnails/28.webp\":{\"url\":\"https://storage.codesocean.top/api/resource/get/179135806015188\",\"sha256\":\"7ee8c37eca2a8157c035096e4aea2fecadc68bc4f2dd8702cae903b74baf0038\"}}");

/***/ }),

/***/ 182:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAvatar_vue_vue_type_style_index_0_id_2e738078_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(166);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAvatar_vue_vue_type_style_index_0_id_2e738078_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAvatar_vue_vue_type_style_index_0_id_2e738078_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAvatar_vue_vue_type_style_index_0_id_2e738078_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAvatar_vue_vue_type_style_index_0_id_2e738078_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-avatar[data-v-2e738078] { position: relative; display: block; width: 40px; height: 40px; flex: none; overflow: visible;\n}\n.avatar-visual[data-v-2e738078] { position: absolute; left: 50%; top: 50%; width: 100%; height: 100%; transform-origin: center;\n}\n.avatar-photo[data-v-2e738078] { position: absolute; z-index: 1; display: block; border-radius: 50%; object-fit: cover; background: #eee; transform: translate(-50%, -50%);\n}\n.avatar-frame[data-v-2e738078] { position: absolute; inset: 0; z-index: 2; display: block; width: 100%; height: 100%; object-fit: contain; pointer-events: none;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 184:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentItem_vue_vue_type_style_index_0_id_6495a15b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(167);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentItem_vue_vue_type_style_index_0_id_6495a15b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentItem_vue_vue_type_style_index_0_id_6495a15b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentItem_vue_vue_type_style_index_0_id_6495a15b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentItem_vue_vue_type_style_index_0_id_6495a15b_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 185:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.manga-comment-item[data-v-6495a15b] { padding: 16px 0; border-bottom: 1px solid #f0e9e2;\n}\n.manga-comment-item.highlight[data-v-6495a15b] { background: #fff8f2; border-radius: 8px;\n}\n.reply-highlight[data-v-6495a15b] { background:#fff0d9; border-radius:5px; padding:10px !important; outline:1px solid #ebd9b8;\n}.image-entry[data-v-6495a15b]{display:flex;flex-direction:column;gap:4px;align-items:start}.image-save[data-v-6495a15b]{border:0;background:none;font-size:10px;color:#aa9477;cursor:pointer;padding:0}.image-save[data-v-6495a15b]:disabled{opacity:.5}\n.comment-main[data-v-6495a15b] { display: flex; gap: 12px;\n}\n.comment-avatar[data-v-6495a15b] { width: 40px; height: 40px; flex: none;\n}\n.comment-body[data-v-6495a15b] { flex: 1; min-width: 0;\n}\n.comment-head[data-v-6495a15b] { display: flex; align-items: center; gap: 8px; flex-wrap: wrap;\n}\n.comment-author[data-v-6495a15b] { font-size: 14px; font-weight: 600; color: #333; text-decoration: none;\n}\n.comment-author[data-v-6495a15b]:hover,.reply-author[data-v-6495a15b]:hover { color: #947358; text-decoration: underline;\n}.folded-comment[data-v-6495a15b] { color: #999; font-size: 13px; font-style: italic; margin: 8px 0;\n}\n.image-button[data-v-6495a15b] { border: 0; padding: 0; background: transparent; cursor: pointer; border-radius: 6px;\n}.image-button img[data-v-6495a15b] { display: block;\n}.image-button[data-v-6495a15b]:focus-visible { outline: 2px solid #947358; outline-offset: 3px;\n}\n.author-badge[data-v-6495a15b] { font-size: 11px; color: #c14a16; background: #fff1e8; border-radius: 8px; padding: 1px 8px;\n}\n.comment-time[data-v-6495a15b] { font-size: 12px; color: #aaa;\n}\n.comment-excerpt[data-v-6495a15b] { margin-top: 6px; padding: 6px 10px; background: #f7f3ef; border-left: 3px solid #d8c9bd; color: #888; font-size: 13px; border-radius: 0 6px 6px 0;\n}\n.comment-text[data-v-6495a15b] { margin-top: 6px; color: #444; line-height: 1.7; font-size: 14px; white-space: pre-line; word-break: break-word;\n}\n.comment-images[data-v-6495a15b] { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;\n}\n.comment-image[data-v-6495a15b] { width: 96px; height: 96px; object-fit: cover; border-radius: 6px; cursor: pointer;\n}\n.comment-image.small[data-v-6495a15b] { width: 72px; height: 72px;\n}\n.comment-actions[data-v-6495a15b] { display: flex; gap: 18px; margin-top: 10px;\n}\n.act[data-v-6495a15b] { display: inline-flex; align-items: center; gap: 5px; background: none; border: none; color: #999; font-size: 13px; cursor: pointer; padding: 0;\n}\n.act[data-v-6495a15b]:hover { color: #947358;\n}\n.act.liked[data-v-6495a15b] { color: #e0524d;\n}\n.act.danger[data-v-6495a15b]:hover { color: #e0524d;\n}\n.reply-list[data-v-6495a15b] { margin-top: 12px; padding: 10px 14px; background: #faf7f4; border-radius: 8px;\n}\n.reply-item[data-v-6495a15b] { padding: 8px 0;\n}\n.reply-item + .reply-item[data-v-6495a15b] { border-top: 1px solid #f0e9e2;\n}\n.reply-head[data-v-6495a15b] { display: flex; align-items: center; gap: 8px; flex-wrap: wrap;\n}\n.reply-author[data-v-6495a15b] { font-size: 13px; font-weight: 600; color: #555; text-decoration: none;\n}\n.reply-target[data-v-6495a15b] { font-size: 12px; color: #947358;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 186:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentComposer_vue_vue_type_style_index_0_id_6cd2cb9a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(168);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentComposer_vue_vue_type_style_index_0_id_6cd2cb9a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentComposer_vue_vue_type_style_index_0_id_6cd2cb9a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentComposer_vue_vue_type_style_index_0_id_6cd2cb9a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentComposer_vue_vue_type_style_index_0_id_6cd2cb9a_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 187:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.manga-composer[data-v-6cd2cb9a] { border-top: 1px solid #f0e9e2; padding-top: 12px;\n}\n.reply-hint[data-v-6cd2cb9a] { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #947358; margin-bottom: 8px;\n}\n.cancel-reply[data-v-6cd2cb9a] { background: none; border: none; color: #999; cursor: pointer; font-size: 12px;\n}\n.cancel-reply[data-v-6cd2cb9a]:hover { color: #e0524d;\n}\n.composer-input[data-v-6cd2cb9a] { width: 100%; box-sizing: border-box; resize: vertical; border: 1px solid #e6d8cf; border-radius: 8px; padding: 10px 12px; font-size: 14px; color: #333; font-family: inherit; outline: none;\n}\n.composer-input[data-v-6cd2cb9a]:focus { border-color: #947358;\n}\n.composer-images[data-v-6cd2cb9a] { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;\n}\n.upload-item[data-v-6cd2cb9a] { position: relative;\n}\n.upload-preview[data-v-6cd2cb9a] { width: 64px; height: 64px; object-fit: cover; border-radius: 6px;\n}\n.remove-image[data-v-6cd2cb9a] { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border: none; border-radius: 50%; background: rgba(0, 0, 0, 0.6); color: #fff; cursor: pointer; line-height: 1;\n}\n.composer-actions[data-v-6cd2cb9a] { display: flex; align-items: center; gap: 14px; margin-top: 10px;\n}\n.upload-btn[data-v-6cd2cb9a] { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; color: #947358; cursor: pointer; user-select: none;\n}\n.upload-btn.disabled[data-v-6cd2cb9a] { color: #ccc; cursor: not-allowed;\n}\n.counter[data-v-6cd2cb9a] { font-size: 12px; color: #bbb; margin-left: auto;\n}\n.submit-btn[data-v-6cd2cb9a] { background: #947358; border: none; color: #fff; border-radius: 18px; padding: 8px 24px; font-size: 14px; cursor: pointer;\n}\n.submit-btn[data-v-6cd2cb9a]:hover { background: #704c35;\n}\n.submit-btn[data-v-6cd2cb9a]:disabled { opacity: 0.5; cursor: not-allowed;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 188:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentPanel_vue_vue_type_style_index_0_id_24ac5079_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(169);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentPanel_vue_vue_type_style_index_0_id_24ac5079_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentPanel_vue_vue_type_style_index_0_id_24ac5079_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentPanel_vue_vue_type_style_index_0_id_24ac5079_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaCommentPanel_vue_vue_type_style_index_0_id_24ac5079_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 189:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.inline-comments[data-v-24ac5079] { border: 1px solid #e9e4dd; border-radius: 12px; background: #fff; overflow: hidden;\n}\n.inline-title[data-v-24ac5079] { margin: 0; padding: 22px 24px 16px; font-size: 18px; color: #453b31;\n}\n.inline-comments .panel-body[data-v-24ac5079] { height: auto;\n}\n.inline-comments .panel-scroll[data-v-24ac5079] { max-height: 640px; min-height: 140px;\n}\n.inline-comments .panel-composer[data-v-24ac5079] { border-top: 1px solid #f0ece6; margin-top: 12px;\n}\n.panel-body[data-v-24ac5079] { display: flex; flex-direction: column; height: 100%; box-sizing: border-box;\n}\n.panel-scroll[data-v-24ac5079] { flex: 1; min-height: 0; overflow-y: auto; padding: 0 20px;\n}\n.empty[data-v-24ac5079] { text-align: center; color: #999; padding: 60px 0;\n}\n.load-more[data-v-24ac5079] { display: block; width: 100%; padding: 14px; background: none; border: none; color: #947358; font-size: 14px; cursor: pointer;\n}\n.load-more[data-v-24ac5079]:disabled { color: #ccc;\n}\n.scope-excerpt[data-v-24ac5079] { color: #8f765f; background: #faf6ef; padding: 14px; border-left: 3px solid #947358; font-size: 13px; line-height: 1.8; white-space: pre-wrap;\n}.load-error[data-v-24ac5079] { color: #ba6755; font-size: 13px; padding: 20px 0;\n}.load-error button[data-v-24ac5079] { color: inherit; border: 0; background: none; cursor: pointer; text-decoration: underline;\n}\n.panel-composer[data-v-24ac5079] { flex: none; padding: 12px 20px 20px;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 190:
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
var SiteIcon = __webpack_require__(150);

// EXTERNAL MODULE: ./components/read/ReaderAvatar.vue + 4 modules
var ReaderAvatar = __webpack_require__(180);

// EXTERNAL MODULE: ./utils/reader-stickers.js
var reader_stickers = __webpack_require__(156);

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
  
  var style0 = __webpack_require__(184)
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
var manga_comment_api = __webpack_require__(153);

// EXTERNAL MODULE: ./components/read/ReaderEmojiPicker.vue + 4 modules
var ReaderEmojiPicker = __webpack_require__(179);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaCommentComposer.vue?vue&type=script&lang=js





/* harmony default export */ var MangaCommentComposervue_type_script_lang_js = ({
  name: 'MangaCommentComposer',
  components: {
    SiteIcon: SiteIcon["a" /* default */],
    ReaderEmojiPicker: ReaderEmojiPicker["a" /* default */]
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
  
  var style0 = __webpack_require__(186)
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
  
  var style0 = __webpack_require__(188)
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

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/LogPowerWordmark.vue?vue&type=template&id=026f4e20&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "log-power-wordmark",
    class: {
      'is-fallback': _vm.failed
    },
    attrs: {
      "role": "img",
      "aria-label": "原木力"
    }
  }, [_vm._ssrNode(!_vm.failed ? "<img src=\"/brand/log-power-wordmark.png\" alt aria-hidden=\"true\" data-v-026f4e20>" : "<span data-v-026f4e20>原木力</span>")]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/LogPowerWordmark.vue?vue&type=template&id=026f4e20&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/LogPowerWordmark.vue?vue&type=script&lang=js
/* harmony default export */ var LogPowerWordmarkvue_type_script_lang_js = ({
  name: 'LogPowerWordmark',
  data() {
    return {
      failed: false
    };
  }
});
// CONCATENATED MODULE: ./components/LogPowerWordmark.vue?vue&type=script&lang=js
 /* harmony default export */ var components_LogPowerWordmarkvue_type_script_lang_js = (LogPowerWordmarkvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/LogPowerWordmark.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(193)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_LogPowerWordmarkvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "026f4e20",
  "3afa3e90"
  
)

/* harmony default export */ var LogPowerWordmark = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 192:
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URLSearchParams"]))

/***/ }),

/***/ 193:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(172);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_LogPowerWordmark_vue_vue_type_style_index_0_id_026f4e20_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.log-power-wordmark[data-v-026f4e20] {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  width: 3.8em;\r\n  height: 1em;\r\n  vertical-align: -0.16em;\r\n  flex-shrink: 0;\r\n  line-height: 1;\r\n  letter-spacing: normal;\r\n  position: relative;\r\n  /* Let the rising arrow extend above the text line without clipping. */\r\n  overflow: visible;\n}\n.log-power-wordmark img[data-v-026f4e20] {\r\n  display: block;\r\n  width: 100%;\r\n  /* Align the letter bodies with adjacent text; the arrow rises above them.\r\n     Canvas: 2051 × 767; letter-body vertical center: 364px. */\r\n  height: 142.1%;\r\n  position: absolute;\r\n  left: 0;\r\n  top: 50%;\r\n  transform: translateY(-47.46%);\r\n  object-fit: contain;\n}\n.log-power-wordmark.is-fallback[data-v-026f4e20] {\r\n  width: auto;\r\n  height: auto;\r\n  position: static;\r\n  overflow: visible;\r\n  vertical-align: baseline;\r\n  line-height: inherit;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 197:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(225);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("0ee1f774", content, true, context)
};

/***/ }),

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(228);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("5d8aae37", content, true, context)
};

/***/ }),

/***/ 199:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(230);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("76dbbce6", content, true, context)
};

/***/ }),

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(232);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("5e095338", content, true, context)
};

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* unused harmony export activityNewsLink */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return normalizeActivities; });
/* unused harmony export activityMessageLink */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return activityMessagePage; });
/* harmony import */ var _social_links__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
/* harmony import */ var _reading_discovery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _reader_comment_links__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(40);
/* harmony import */ var _reading_seo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(39);




function safeLink(raw, mobileBase) {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  if (!value || /[\\\u0000-\u001f]/.test(value)) return null;
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (url.username || url.password) return null;
      if (url.origin === _reading_seo__WEBPACK_IMPORTED_MODULE_3__[/* SITE_ORIGIN */ "a"]) return {
        href: url.pathname + url.search + url.hash,
        external: false
      };
      if (url.origin === new URL(mobileBase).origin && url.hash.startsWith('#/pages/')) return Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_1__[/* discoveryLink */ "g"])(url.hash.slice(1), mobileBase);
      return {
        href: url.href,
        external: true
      };
    } catch (_) {
      return null;
    }
  }
  return Object(_reading_discovery__WEBPACK_IMPORTED_MODULE_1__[/* discoveryLink */ "g"])(value, mobileBase);
}
function activityNewsLink(news, mobileBase = 'https://m.loghome.ink') {
  return safeLink(news && news.pc_link, mobileBase) || safeLink(news && news.mobile_link, mobileBase);
}
function normalizeActivities(rows, mobileBase = 'https://m.loghome.ink') {
  if (!Array.isArray(rows)) throw Error('活动资讯返回数据无效');
  const seen = new Set();
  return rows.filter(row => {
    const id = Number(row && row.tag_id);
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id)) return false;
    seen.add(id);
    return true;
  }).map(row => ({
    ...row,
    tag_id: Number(row.tag_id),
    news: (Array.isArray(row.news) ? row.news : []).filter(news => news && typeof news.title === 'string').map(news => ({
      ...news,
      link: activityNewsLink(news, mobileBase)
    }))
  }));
}
function activityMessageLink(router, mobileBase = 'https://m.loghome.ink') {
  const raw = String(router || '').trim();
  if (!raw || raw === '/' || raw === 'None' || /^[a-z][a-z\d+.-]*:|^\/\/|[\\\u0000-\u001f]/i.test(raw)) return null;
  const route = raw.replace(/^(?:\.\.?\/)+/, '').replace(/^\/?(?:#\/)?(?:pages\/)?/, '');
  const reading = Object(_reader_comment_links__WEBPACK_IMPORTED_MODULE_2__[/* readingMessageTarget */ "c"])(route);
  if (reading) return {
    href: reading.path,
    external: false
  };
  const post = route.match(/^community\/postDetail\?id=([1-9]\d*)(?:&|$)/);
  if (post) return {
    href: `/community/post/${Number(post[1])}`,
    external: false
  };
  if (route === 'community/activityMessages') return {
    href: '/read/activities',
    external: false
  };
  const social = Object(_social_links__WEBPACK_IMPORTED_MODULE_0__[/* socialMessageTarget */ "a"])(route);
  if (social && !social.mobile) return {
    href: social.path,
    external: false
  };
  return safeLink(`/pages/${route}`, mobileBase);
}
function activityMessagePage(result, page, amount = 20, mobileBase = 'https://m.loghome.ink') {
  if (!result || result.msg !== 'ok' || result.page !== page || result.amount !== amount || !Number.isSafeInteger(result.total) || result.total < 0 || !Array.isArray(result.messages) || result.messages.length > amount) throw Error('活动消息返回数据无效，请刷新重试');
  const seen = new Set();
  const messages = result.messages.map(row => {
    const id = Number(row && row.message_id);
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id) || row.message_type !== 'activity') throw Error('活动消息返回数据无效，请刷新重试');
    seen.add(id);
    return {
      ...row,
      message_id: id,
      message_content: String(row.message_content || ''),
      bg_url: /^https?:\/\//i.test(String(row.bg_url || '')) ? row.bg_url : '',
      link: activityMessageLink(row.router, mobileBase)
    };
  });
  return {
    total: result.total,
    messages
  };
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URL"]))

/***/ }),

/***/ 222:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(275);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("692a0944", content, true, context)
};

/***/ }),

/***/ 223:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(277);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("55737f6e", content, true, context)
};

/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NovelFansList_vue_vue_type_style_index_0_id_bd889b00_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(197);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NovelFansList_vue_vue_type_style_index_0_id_bd889b00_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NovelFansList_vue_vue_type_style_index_0_id_bd889b00_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NovelFansList_vue_vue_type_style_index_0_id_bd889b00_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NovelFansList_vue_vue_type_style_index_0_id_bd889b00_prod_lang_scss_scoped_true__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 225:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "@keyframes spin-bd889b00{to{transform:rotate(360deg)}}.fans-toolbar[data-v-bd889b00]{display:flex;gap:8px;margin-bottom:14px}.fans-toolbar button[data-v-bd889b00],.fan-message button[data-v-bd889b00],.fans-more[data-v-bd889b00]{font:inherit;font-size:12px;border:1px solid #e5d8c9;border-radius:5px;color:#947358;background:#fff;padding:7px 12px;cursor:pointer}.fans-toolbar button.active[data-v-bd889b00]{background:#947358;color:#fff}.fans-toolbar button[data-v-bd889b00]:disabled{opacity:.5}.fans-error[data-v-bd889b00]{color:#ba6654;font-size:13px;margin-bottom:10px}.fans-empty[data-v-bd889b00]{color:#aaa;text-align:center;padding:20px}.fans-more[data-v-bd889b00]{display:block;margin:20px auto}.fans-ranking[data-v-bd889b00]{width:100%;position:relative;margin-bottom:20px}.fans-ranking .loading-wrapper[data-v-bd889b00]{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px}.fans-ranking .loading-wrapper .loading-spinner[data-v-bd889b00]{width:30px;height:30px;border:3px solid rgba(148,115,88,.2);border-top-color:#947358;border-radius:50%;animation:spin-bd889b00 1s linear infinite;margin-bottom:10px}.fans-ranking .loading-wrapper p[data-v-bd889b00]{color:#888;font-size:14px}.fans-ranking .fans-list-wrapper[data-v-bd889b00]{width:100%;position:relative}.fans-ranking .fans-list-wrapper .fans-list[data-v-bd889b00]{width:100%}.fans-ranking .fans-list-wrapper .fans-list .fan-item[data-v-bd889b00]{display:flex;align-items:center;padding:15px 10px;border-bottom:1px solid #f5f5f5}.fans-ranking .fans-list-wrapper .fans-list .fan-item[data-v-bd889b00]:last-child{border-bottom:none}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank[data-v-bd889b00]{width:40px;display:flex;justify-content:center;align-items:center}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-number[data-v-bd889b00]{font-size:16px;font-weight:bold;color:#666}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-first[data-v-bd889b00],.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-second[data-v-bd889b00],.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-third[data-v-bd889b00]{width:24px;height:24px;display:flex;justify-content:center;align-items:center;color:#fff;font-weight:bold;font-size:14px;border-radius:50%}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-first[data-v-bd889b00]{background-color:#ff6b6b}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-second[data-v-bd889b00]{background-color:#ffb347}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-rank .rank-third[data-v-bd889b00]{background-color:#59c2a7}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-avatar[data-v-bd889b00]{margin:0 15px}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-avatar img[data-v-bd889b00]{width:50px;height:50px;border-radius:50%;object-fit:cover;cursor:pointer;transition:transform .2s}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-avatar img[data-v-bd889b00]:hover{transform:scale(1.05)}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details[data-v-bd889b00]{flex:1}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details .fan-info[data-v-bd889b00]{display:flex;justify-content:space-between;margin-bottom:8px}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details .fan-info .fan-name[data-v-bd889b00]{font-weight:bold;color:#ea7034;cursor:pointer}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details .fan-info .fan-name[data-v-bd889b00]:hover{text-decoration:underline}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details .fan-info .fan-value[data-v-bd889b00]{font-weight:bold;color:#ea7034}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details .fan-message[data-v-bd889b00]{padding:8px 12px;background-color:rgba(234,112,52,.1);border-radius:8px;font-size:14px;color:#666;position:relative}.fans-ranking .fans-list-wrapper .fans-list .fan-item .fan-details .fan-message[data-v-bd889b00]:before{content:\"\";position:absolute;top:-8px;left:15px;border-width:0 8px 8px;border-style:solid;border-color:rgba(0,0,0,0) rgba(0,0,0,0) rgba(234,112,52,.1)}.fans-ranking .fans-list-wrapper .my-info-wrapper[data-v-bd889b00]{position:sticky;bottom:0;left:0;width:100%;z-index:10}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info-rank[data-v-bd889b00]{background-color:rgba(0,0,0,.8);color:#fff;padding:6px 15px;border-top-right-radius:20px;font-size:14px;display:inline-block}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info[data-v-bd889b00]{display:flex;align-items:center;background-color:rgba(0,0,0,.8);padding:10px 15px}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info .my-avatar[data-v-bd889b00]{margin-right:15px}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info .my-avatar img[data-v-bd889b00]{width:40px;height:40px;border-radius:50%;object-fit:cover}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info .my-details[data-v-bd889b00]{display:flex;flex:1;justify-content:space-between;align-items:center}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info .my-details .my-name[data-v-bd889b00]{color:#fff;font-weight:bold}.fans-ranking .fans-list-wrapper .my-info-wrapper .my-info .my-details .my-value[data-v-bd889b00]{color:#ea7034;font-weight:bold}.fans-ranking .view-more-wrapper[data-v-bd889b00]{text-align:right;margin-top:15px}.fans-ranking .view-more-wrapper .view-more-link[data-v-bd889b00]{color:#666;text-decoration:none;font-size:14px;padding:5px}.fans-ranking .view-more-wrapper .view-more-link[data-v-bd889b00]:hover{color:#ea7034}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 226:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(279);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("342c18ef", content, true, context)
};

/***/ }),

/***/ 227:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookTools_vue_vue_type_style_index_0_id_f000e35e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(198);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookTools_vue_vue_type_style_index_0_id_f000e35e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookTools_vue_vue_type_style_index_0_id_f000e35e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookTools_vue_vue_type_style_index_0_id_f000e35e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookTools_vue_vue_type_style_index_0_id_f000e35e_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 228:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.book-tools[data-v-f000e35e] { display: inline-flex; gap: 8px;\n}button[data-v-f000e35e] { background: #fff; color: #947358; border: 1px solid #e5d8c9; padding: 9px 16px; border-radius: 6px; cursor: pointer; font: inherit; font-size: 13px;\n}.hint[data-v-f000e35e] { color: #998d80; font-size: 12px; line-height: 1.8; margin-bottom: 14px;\n}textarea[data-v-f000e35e] { box-sizing: border-box; width: 100%; padding: 12px; font: inherit; line-height: 1.8; border: 1px solid #e5d8c9; border-radius: 6px; resize: vertical;\n}.field[data-v-f000e35e] { display: grid; gap: 10px; margin-bottom: 20px;\n}.error[data-v-f000e35e] { color: #c05243; margin-top: 12px; font-size: 13px;\n}.reward[data-v-f000e35e] { color: #6b8651; margin-top: 12px; font-size: 13px;\n}\n.book-tools[data-v-f000e35e]{flex-wrap:wrap}.power-link[data-v-f000e35e]{background:#fff;color:#947358;border:1px solid #e5d8c9;padding:9px 16px;border-radius:6px;font-size:13px;text-decoration:none;line-height:normal}.power-link[data-v-f000e35e]:focus-visible{outline:2px solid #947358;outline-offset:2px}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderTipDialog_vue_vue_type_style_index_0_id_30b4bfe0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(199);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderTipDialog_vue_vue_type_style_index_0_id_30b4bfe0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderTipDialog_vue_vue_type_style_index_0_id_30b4bfe0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderTipDialog_vue_vue_type_style_index_0_id_30b4bfe0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderTipDialog_vue_vue_type_style_index_0_id_30b4bfe0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 230:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".reader-tip[data-v-30b4bfe0]{display:inline-flex}.tip-trigger[data-v-30b4bfe0],.reload[data-v-30b4bfe0]{border:1px solid #e0d6c7;border-radius:6px;padding:9px 16px;background:#fff;color:#947358;font:inherit;font-size:13px;cursor:pointer}.tip-status[data-v-30b4bfe0],.tip-error[data-v-30b4bfe0]{font-size:13px;line-height:1.8;color:#9e8a6e;margin-bottom:12px}.tip-error[data-v-30b4bfe0]{color:#b96550}.resource-balances[data-v-30b4bfe0]{display:flex;align-items:center;gap:20px;padding:14px 16px;border-radius:8px;background:#f8f6f0;font-size:13px;color:#9f8b70}.resource-balances strong[data-v-30b4bfe0]{color:#746046;margin-left:8px}.resource-balances a[data-v-30b4bfe0]{margin-left:auto;color:#869655;font-size:12px;text-decoration:none}.gift-grid[data-v-30b4bfe0]{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:20px 0}.gift-grid button[data-v-30b4bfe0]{border:1px solid #e5ddcf;border-radius:9px;background:#fff;padding:12px 8px;display:flex;align-items:center;flex-direction:column;gap:8px;color:#8b7559;font:inherit;font-size:13px;cursor:pointer}.gift-grid button.selected[data-v-30b4bfe0]{background:#f0f4e5;border-color:#a6b57f}.gift-grid img[data-v-30b4bfe0]{height:48px;width:48px;object-fit:contain}.gift-grid small[data-v-30b4bfe0]{font-size:11px;color:#a99576}.amount-row[data-v-30b4bfe0]{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin:18px 0}.amount-row label[data-v-30b4bfe0]{font-size:13px;color:#9d8a6f}.amount-row input[data-v-30b4bfe0]{width:75px;border:1px solid #dfd5c6;border-radius:5px;padding:7px;margin-left:8px;font:inherit;color:#857058}.quick-amounts[data-v-30b4bfe0]{display:flex;gap:5px;flex-wrap:wrap}.quick-amounts button[data-v-30b4bfe0]{border:1px solid #e3dccf;background:#fff;border-radius:5px;color:#998368;font-size:11px;cursor:pointer;padding:6px 8px}.tip-message[data-v-30b4bfe0]{display:grid;gap:8px;font-size:13px;color:#9c8a70}.tip-message textarea[data-v-30b4bfe0]{font:inherit;font-size:13px;box-sizing:border-box;width:100%;resize:vertical;line-height:1.8;border:1px solid #e0d6c8;border-radius:7px;padding:10px;color:#7d674b}.tip-total[data-v-30b4bfe0]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;border-top:1px solid #ece5d9;margin-top:18px;padding:18px 0;font-size:13px;color:#968165}.tip-total strong[data-v-30b4bfe0]{color:#82974f;font-size:20px;margin-left:10px}.tip-total small[data-v-30b4bfe0]{margin-left:auto;font-size:11px;color:#b19e81}button[data-v-30b4bfe0]:disabled{opacity:.5;cursor:default}button[data-v-30b4bfe0]:focus-visible{outline:2px solid #8fa365;outline-offset:2px}@media(max-width:600px){.gift-grid[data-v-30b4bfe0]{grid-template-columns:repeat(3,minmax(0,1fr))}.resource-balances[data-v-30b4bfe0]{gap:12px;flex-wrap:wrap}.resource-balances a[data-v-30b4bfe0]{margin-left:0}}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 231:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookSupport_vue_vue_type_style_index_0_id_5b70907c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(200);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookSupport_vue_vue_type_style_index_0_id_5b70907c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookSupport_vue_vue_type_style_index_0_id_5b70907c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookSupport_vue_vue_type_style_index_0_id_5b70907c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookSupport_vue_vue_type_style_index_0_id_5b70907c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 232:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".book-support[data-v-5b70907c]{margin-top:22px}.support-actions[data-v-5b70907c]{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.support-utilities[data-v-5b70907c]{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:10px}.support-actions>button[data-v-5b70907c]{padding:9px 16px;background:#fff;color:#947358;border:1px solid #e3d7c7;border-radius:6px;cursor:pointer;font:inherit;font-size:13px}.support-actions>button.active[data-v-5b70907c]{background:#edf1e2;border-color:#d5dfc2;color:#7c9053}button[data-v-5b70907c]:disabled{opacity:.5;cursor:default}.support-error[data-v-5b70907c]{font-size:12px;line-height:1.8;color:#b4614e;margin-top:12px}.support-error a[data-v-5b70907c]{color:inherit;margin-left:8px}.support-error button[data-v-5b70907c]{border:0;background:none;color:inherit;text-decoration:underline;cursor:pointer}.task-reward[data-v-5b70907c]{margin-top:14px;display:flex;gap:10px;align-items:center;background:#eff4e3;border:1px solid #dae5c8;border-radius:7px;padding:10px 14px;font-size:12px;color:#7d9150}.task-reward>a[data-v-5b70907c]{margin-left:auto;color:inherit;text-decoration:none}.task-reward>button[data-v-5b70907c]{border:0;background:none;color:#a1af7d;cursor:pointer;font-size:18px}button[data-v-5b70907c]:focus-visible,a[data-v-5b70907c]:focus-visible{outline:2px solid #809455;outline-offset:3px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/BookSupport.vue?vue&type=template&id=5b70907c&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "book-support"
  }, [_vm._ssrNode("<div class=\"support-actions\" data-v-5b70907c>", "</div>", [_vm._t("primary"), _vm._ssrNode(" <button" + _vm._ssrAttr("disabled", _vm.loading || _vm.savingShelf) + _vm._ssrAttr("aria-pressed", _vm.favorite) + _vm._ssrClass(null, {
    active: _vm.favorite
  }) + " data-v-5b70907c>" + _vm._ssrEscape("\n      " + _vm._s(_vm.savingShelf ? '处理中…' : _vm.favorite ? '已收藏' : '收藏') + "\n    ") + "</button> <button" + _vm._ssrAttr("disabled", _vm.loading || _vm.savingLike) + _vm._ssrAttr("aria-pressed", _vm.liked) + _vm._ssrClass(null, {
    active: _vm.liked
  }) + " data-v-5b70907c>" + _vm._ssrEscape("\n      " + _vm._s(_vm.savingLike ? '处理中…' : _vm.liked ? '已赞' : '点赞') + " · " + _vm._s(_vm.likes) + "\n    ") + "</button> "), _c('ReaderTipDialog', {
    attrs: {
      "book": _vm.book
    },
    on: {
      "tipped": function ($event) {
        return _vm.$emit('tipped', $event);
      }
    }
  })], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"support-utilities\" data-v-5b70907c>", "</div>", [_c('BookTools', {
    attrs: {
      "book": _vm.book
    }
  }), _vm._ssrNode(" "), _vm._t("secondary")], 2), _vm._ssrNode(" "), _vm.error ? _vm._ssrNode("<p role=\"alert\" class=\"support-error\" data-v-5b70907c>", "</p>", [_vm._ssrNode(_vm._ssrEscape("\n    " + _vm._s(_vm.error) + "\n    ")), _vm.authExpired ? _c('nuxt-link', {
    attrs: {
      "to": _vm.loginUrl
    }
  }, [_vm._v("重新登录")]) : _c('button', {
    attrs: {
      "disabled": _vm.loading
    },
    on: {
      "click": _vm.load
    }
  }, [_vm._v("重试")])], 2) : _vm._e(), _vm._ssrNode(" "), _vm.task ? _vm._ssrNode("<div role=\"status\" class=\"task-reward\" data-v-5b70907c>", "</div>", [_vm._ssrNode("<span data-v-5b70907c>每日点赞任务已完成" + (typeof _vm.task.reward === 'number' ? "<span data-v-5b70907c>" + _vm._ssrEscape(" · 获得 " + _vm._s(_vm.task.reward) + " 点成长值") + "</span>" : "<!---->") + "</span> "), _vm.task.tree_status === '结果' ? _c('nuxt-link', {
    attrs: {
      "to": _vm.harvestLink
    }
  }, [_vm._v("前往收获 →")]) : _vm._e(), _vm._ssrNode(" <button aria-label=\"关闭任务奖励提示\" data-v-5b70907c>×</button>")], 2) : _vm._e()], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/BookSupport.vue?vue&type=template&id=5b70907c&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/BookTools.vue?vue&type=template&id=f000e35e&scoped=true
var BookToolsvue_type_template_id_f000e35e_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "book-tools"
  }, [_vm._ssrNode("<button data-v-f000e35e>分享作品</button>"), _c('nuxt-link', {
    staticClass: "power-link",
    attrs: {
      "to": `/read/power/${_vm.book.novel_id}`
    }
  }, [_vm._v("原木力说明")]), _vm._ssrNode("<button data-v-f000e35e>举报</button> "), _c('el-dialog', {
    attrs: {
      "custom-class": "reading-dialog",
      "title": "分享作品",
      "visible": _vm.shareVisible,
      "width": "min(520px, 94vw)",
      "append-to-body": ""
    },
    on: {
      "update:visible": function ($event) {
        _vm.shareVisible = $event;
      }
    }
  }, [_c('p', {
    staticClass: "hint"
  }, [_vm._v("分享链接可以直接用浏览器打开；口令也可在原木社区 APP 中识别，有效期为 30 天。")]), _c('textarea', {
    attrs: {
      "readonly": "",
      "rows": "5",
      "aria-label": "分享内容"
    },
    domProps: {
      "value": _vm.shareText
    }
  }), _vm.shareError ? _c('p', {
    staticClass: "error",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v(_vm._s(_vm.shareError))]) : _vm._e(), _vm.rewardMessage ? _c('p', {
    staticClass: "reward"
  }, [_vm._v(_vm._s(_vm.rewardMessage) + " "), _c('nuxt-link', {
    attrs: {
      "to": "/read/rewards"
    }
  }, [_vm._v("查看阅读奖励 →")])], 1) : _vm._e(), _vm._v(" "), _c('span', {
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('el-button', {
    on: {
      "click": _vm.copyShare
    }
  }, [_vm._v("复制" + _vm._s(_vm.code ? '口令与链接' : '链接'))]), _c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.creating,
      "disabled": !!_vm.code
    },
    on: {
      "click": _vm.createCode
    }
  }, [_vm._v(_vm._s(_vm.code ? `口令 ${_vm.code}` : '生成分享口令'))])], 1)]), _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "custom-class": "reading-dialog",
      "title": "举报作品",
      "visible": _vm.reportVisible,
      "width": "min(520px, 94vw)",
      "append-to-body": ""
    },
    on: {
      "update:visible": function ($event) {
        _vm.reportVisible = $event;
      }
    }
  }, [_c('label', {
    staticClass: "field"
  }, [_vm._v("举报原因 "), _c('el-select', {
    attrs: {
      "placeholder": "请选择原因"
    },
    model: {
      value: _vm.reason,
      callback: function ($$v) {
        _vm.reason = $$v;
      },
      expression: "reason"
    }
  }, _vm._l(_vm.reasons, function (item) {
    return _c('el-option', {
      key: item,
      attrs: {
        "label": item,
        "value": item
      }
    });
  }), 1)], 1), _c('label', {
    staticClass: "field"
  }, [_vm._v("补充说明 "), _c('el-input', {
    attrs: {
      "type": "textarea",
      "rows": 4,
      "maxlength": "200",
      "show-word-limit": "",
      "placeholder": "说明具体问题，便于核实处理"
    },
    model: {
      value: _vm.detail,
      callback: function ($$v) {
        _vm.detail = $$v;
      },
      expression: "detail"
    }
  })], 1), _vm.reportError ? _c('p', {
    staticClass: "error",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v(_vm._s(_vm.reportError))]) : _vm._e(), _vm._v(" "), _c('span', {
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('el-button', {
    on: {
      "click": function ($event) {
        _vm.reportVisible = false;
      }
    }
  }, [_vm._v("取消")]), _c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.reporting,
      "disabled": !_vm.reason || _vm.reason === '其他' && !_vm.detail.trim()
    },
    on: {
      "click": _vm.report
    }
  }, [_vm._v("提交举报")])], 1)])], 2);
};
var BookToolsvue_type_template_id_f000e35e_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/BookTools.vue?vue&type=template&id=f000e35e&scoped=true

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(39);

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(11);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/BookTools.vue?vue&type=script&lang=js



/* harmony default export */ var BookToolsvue_type_script_lang_js = ({
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    shareVisible: false,
    reportVisible: false,
    shareText: '',
    code: '',
    creating: false,
    reporting: false,
    reason: '',
    detail: '',
    reasons: ['违法违规', '色情低俗', '抄袭侵权', '人身攻击', '垃圾广告', '其他'],
    shareError: '',
    reportError: '',
    rewardMessage: '',
    version: 0,
    account: null
  }),
  watch: {
    'book.novel_id'() {
      this.version++;
      this.shareVisible = false;
      this.reportVisible = false;
      this.code = '';
      this.shareText = '';
      this.reason = '';
      this.detail = '';
      this.creating = this.reporting = false;
      this.shareError = this.reportError = this.rewardMessage = '';
    }
  },
  mounted() {
    this.account = Object(reading["c" /* readingToken */])();
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
      if (this.account !== Object(reading["c" /* readingToken */])()) {
        this.account = Object(reading["c" /* readingToken */])();
        this.version++;
        this.shareVisible = this.reportVisible = false;
        this.creating = this.reporting = false;
        this.code = this.shareText = this.detail = this.reason = this.shareError = this.reportError = this.rewardMessage = '';
      }
    },
    linkText() {
      return `我正在原木社区读《${this.book.name}》，你也一起来看看吧！\n${reading_seo["a" /* SITE_ORIGIN */]}${Object(reading_discovery["n" /* workUrl */])(this.book)}\n用浏览器打开链接，或复制口令打开原木社区 APP 即可查看。`;
    },
    openShare() {
      this.checkAccount();
      this.shareError = '';
      this.shareText = this.code ? this.shareText : this.linkText();
      this.shareVisible = true;
    },
    async copyShare() {
      try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(this.shareText);else {
          const input = document.createElement('textarea');
          input.value = this.shareText;
          input.style.position = 'fixed';
          input.style.opacity = '0';
          document.body.appendChild(input);
          input.select();
          try {
            if (!document.execCommand('copy')) throw new Error('复制失败，请手动选择分享内容复制。');
          } finally {
            input.remove();
          }
        }
        this.$message.success('分享内容已复制');
      } catch (error) {
        this.shareError = error.message || '复制失败，请手动复制。';
        return false;
      }
      return true;
    },
    async createCode() {
      this.checkAccount();
      if (this.creating || this.code) return;
      const token = Object(reading["c" /* readingToken */])();
      if (!token) {
        this.shareError = '登录后可以生成分享口令。';
        return;
      }
      const version = this.version;
      this.creating = true;
      this.shareError = '';
      this.rewardMessage = '';
      try {
        const page = this.book.novel_type === 'manga' ? 'readers/mangaInfo' : 'readers/bookInfo';
        const response = await this.$api.reader.share({
          share_type: 'book',
          share_content: `《${this.book.name}》- ${this.book.author_name || this.book.user_name || '佚名'}`,
          target_url: `/pages/${page}?id=${this.book.novel_id}`,
          share_message: this.linkText(),
          expires_hours: 24 * 30
        });
        if (version !== this.version || token !== Object(reading["c" /* readingToken */])()) return;
        if (!response.success || !response.code || !response.share_text) throw new Error(response.msg || '口令生成失败。');
        this.code = response.code;
        this.shareText = response.share_text;
        if (await this.copyShare()) {
          if (version !== this.version || token !== Object(reading["c" /* readingToken */])()) return;
          try {
            const task = await this.$api.reader.shareTask();
            if (!task || task.msg !== 'Task completed' || typeof task.reward !== 'number' || !Number.isFinite(task.reward)) throw new Error('Unconfirmed task result');
            if (version === this.version && token === Object(reading["c" /* readingToken */])()) this.rewardMessage = `每日分享任务已完成${typeof task.reward === 'number' ? `，获得 ${task.reward} 点成长值` : ''}。`;
          } catch (error) {
            if (!/already completed|已完成/i.test(error.message) && version === this.version) this.rewardMessage = '口令已生成；分享任务奖励暂未领取，可在任务页查看。';
          }
        }
      } catch (error) {
        if (version === this.version && token === Object(reading["c" /* readingToken */])()) this.shareError = error.message;
      } finally {
        if (version === this.version) this.creating = false;
      }
    },
    async report() {
      this.checkAccount();
      if (this.reporting || !this.reason || this.reason === '其他' && !this.detail.trim()) return;
      const token = Object(reading["c" /* readingToken */])();
      if (!token) {
        this.reportError = '请先登录后再举报。';
        return;
      }
      const version = this.version;
      this.reporting = true;
      this.reportError = '';
      try {
        await this.$api.reader.report({
          novel_id: this.book.novel_id,
          reason: this.reason,
          detail: this.detail.trim()
        });
        if (version === this.version && token === Object(reading["c" /* readingToken */])()) {
          this.$message.success('举报已提交');
          this.reportVisible = false;
          this.detail = '';
          this.reason = '';
        }
      } catch (error) {
        if (version === this.version && token === Object(reading["c" /* readingToken */])()) this.reportError = error.message;
      } finally {
        if (version === this.version) this.reporting = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/BookTools.vue?vue&type=script&lang=js
 /* harmony default export */ var read_BookToolsvue_type_script_lang_js = (BookToolsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/BookTools.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(227)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_BookToolsvue_type_script_lang_js,
  BookToolsvue_type_template_id_f000e35e_scoped_true_render,
  BookToolsvue_type_template_id_f000e35e_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "f000e35e",
  "7fbf0c38"
  
)

/* harmony default export */ var BookTools = (component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderTipDialog.vue?vue&type=template&id=30b4bfe0&scoped=true
var ReaderTipDialogvue_type_template_id_30b4bfe0_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "reader-tip"
  }, [_vm._ssrNode("<button class=\"tip-trigger\" data-v-30b4bfe0>打赏</button>"), _c('el-dialog', {
    attrs: {
      "custom-class": "reading-dialog",
      "title": `支持《${_vm.book.name}》`,
      "visible": _vm.visible,
      "width": "min(630px, 94vw)",
      "append-to-body": "",
      "close-on-click-modal": !_vm.submitting,
      "close-on-press-escape": !_vm.submitting,
      "show-close": !_vm.submitting
    },
    on: {
      "update:visible": function ($event) {
        _vm.visible = $event;
      }
    }
  }, [_vm.loading ? _c('p', {
    staticClass: "tip-status",
    attrs: {
      "role": "status"
    }
  }, [_vm._v("正在确认礼物与资源余额…")]) : _vm._e(), _vm.error ? _c('p', {
    staticClass: "tip-error",
    attrs: {
      "role": "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), !_vm.ready && !_vm.loading ? _c('button', {
    staticClass: "reload",
    on: {
      "click": _vm.load
    }
  }, [_vm._v("重新加载")]) : _vm._e(), _vm._v(" "), _vm.ready ? [_c('div', {
    staticClass: "resource-balances"
  }, [_c('span', [_vm._v("原木 "), _c('strong', [_vm._v(_vm._s(_vm.balances.log))])]), _c('span', [_vm._v("苹果 "), _c('strong', [_vm._v(_vm._s(_vm.balances.apple))])]), _c('nuxt-link', {
    attrs: {
      "to": _vm.resourceGuide
    }
  }, [_vm._v("如何获取原木")])], 1), _c('div', {
    staticClass: "gift-grid",
    attrs: {
      "aria-label": "选择礼物"
    }
  }, _vm._l(_vm.gifts, function (gift) {
    return _c('button', {
      key: gift.item_name,
      class: {
        selected: _vm.selectedName === gift.item_name
      },
      attrs: {
        "aria-pressed": _vm.selectedName === gift.item_name,
        "disabled": _vm.submitting || _vm.completed
      },
      on: {
        "click": function ($event) {
          _vm.selectedName = gift.item_name;
        }
      }
    }, [_vm.safeImage(gift.img_url) ? _c('img', {
      attrs: {
        "src": _vm.safeImage(gift.img_url),
        "alt": ""
      }
    }) : _vm._e(), _c('span', [_vm._v(_vm._s(gift.item_name))]), _c('small', [_vm._v(_vm._s(gift.item_cost) + " " + _vm._s(Number(gift.is_log_free) === 1 ? '苹果' : '原木'))])]);
  }), 0), _vm._v(" "), _c('div', {
    staticClass: "amount-row"
  }, [_c('label', [_vm._v("数量 "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.amount,
      expression: "amount",
      modifiers: {
        "number": true
      }
    }],
    attrs: {
      "type": "number",
      "min": "1",
      "max": "9999",
      "step": "1",
      "disabled": _vm.submitting || _vm.completed
    },
    domProps: {
      "value": _vm.amount
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.amount = _vm._n($event.target.value);
      },
      "blur": function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _c('div', {
    staticClass: "quick-amounts"
  }, _vm._l([1, 5, 10, 66, 99, 520], function (value) {
    return _c('button', {
      key: value,
      attrs: {
        "disabled": _vm.submitting || _vm.completed
      },
      on: {
        "click": function ($event) {
          _vm.amount = value;
        }
      }
    }, [_vm._v("×" + _vm._s(value))]);
  }), 0)]), _c('label', {
    staticClass: "tip-message"
  }, [_vm._v("粉丝留言 "), _c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.message,
      expression: "message"
    }],
    attrs: {
      "maxlength": "50",
      "rows": "2",
      "disabled": _vm.submitting || _vm.completed,
      "placeholder": "写下对作品的支持，最多 50 字"
    },
    domProps: {
      "value": _vm.message
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.message = $event.target.value;
      }
    }
  })]), _c('div', {
    staticClass: "tip-total"
  }, [_c('span', [_vm._v("总计 "), _c('strong', [_vm._v(_vm._s(_vm.total))]), _vm._v(" " + _vm._s(_vm.resource === 'apple' ? '苹果' : '原木'))]), _vm.resource === 'log' ? _c('small', [_vm._v("作者获得 " + _vm._s(Math.floor(_vm.total / 2)) + " 原木收益")]) : _vm._e()]), _vm.uncertain ? _c('p', {
    staticClass: "tip-error"
  }, [_vm._v("请求结果未确认，请先查看余额和粉丝榜，确认后再操作。")]) : _vm._e(), _vm.notice ? _c('p', {
    staticClass: "tip-status"
  }, [_vm._v(_vm._s(_vm.notice))]) : _vm._e()] : _vm._e(), _vm._v(" "), _c('span', {
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "disabled": _vm.submitting
    },
    on: {
      "click": function ($event) {
        _vm.visible = false;
      }
    }
  }, [_vm._v("关闭")]), _c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.submitting,
      "disabled": !_vm.ready || _vm.loading || !_vm.validAmount || !_vm.selected || _vm.uncertain || _vm.completed
    },
    on: {
      "click": _vm.confirm
    }
  }, [_vm._v("确认打赏")])], 1)], 2)], 2);
};
var ReaderTipDialogvue_type_template_id_30b4bfe0_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderTipDialog.vue?vue&type=template&id=30b4bfe0&scoped=true

// EXTERNAL MODULE: ./utils/reader-world.js
var reader_world = __webpack_require__(173);

// EXTERNAL MODULE: ./utils/login-return.js
var login_return = __webpack_require__(165);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderTipDialog.vue?vue&type=script&lang=js



/* harmony default export */ var ReaderTipDialogvue_type_script_lang_js = ({
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    visible: false,
    ready: false,
    loading: false,
    submitting: false,
    gifts: [],
    selectedName: '',
    balances: {
      log: 0,
      apple: 0
    },
    profile: null,
    amount: 1,
    message: '',
    error: '',
    notice: '',
    uncertain: false,
    completed: false,
    version: 0,
    account: null
  }),
  computed: {
    selected() {
      return this.gifts.find(item => item.item_name === this.selectedName);
    },
    validAmount() {
      return Number.isSafeInteger(Number(this.amount)) && Number(this.amount) > 0 && Number(this.amount) <= 9999;
    },
    resource() {
      return this.selected && Number(this.selected.is_log_free) === 1 ? 'apple' : 'log';
    },
    total() {
      return this.selected && this.validAmount ? Number(this.selected.item_cost) * Number(this.amount) : 0;
    },
    resourceGuide() {
      return '/read/resources';
    }
  },
  watch: {
    visible(value) {
      if (!value) this.reset();
    },
    'book.novel_id'() {
      this.visible = false;
      this.reset();
    }
  },
  mounted() {
    this.account = Object(reading["c" /* readingToken */])();
    window.addEventListener('focus', this.checkAccount);
    window.addEventListener('storage', this.checkAccount);
  },
  beforeDestroy() {
    this.version++;
    window.removeEventListener('focus', this.checkAccount);
    window.removeEventListener('storage', this.checkAccount);
  },
  methods: {
    safeImage: reader_world["d" /* worldImage */],
    current(version, token, id) {
      return version === this.version && token === Object(reading["c" /* readingToken */])() && Number(id) === Number(this.book.novel_id) && this.visible;
    },
    checkAccount() {
      if (this.account !== Object(reading["c" /* readingToken */])()) {
        this.account = Object(reading["c" /* readingToken */])();
        this.visible = false;
        this.reset();
      }
    },
    reset() {
      this.version++;
      this.ready = false;
      this.loading = false;
      this.submitting = false;
      this.gifts = [];
      this.balances = {
        log: 0,
        apple: 0
      };
      this.profile = null;
      this.message = '';
      this.amount = 1;
      this.selectedName = '';
      this.error = this.notice = '';
      this.uncertain = false;
      this.completed = false;
    },
    open() {
      this.checkAccount();
      if (!Object(reading["c" /* readingToken */])()) {
        this.$router.push({
          path: '/login',
          query: {
            redirect: Object(login_return["a" /* loginReturnPath */])(this.$route.fullPath)
          }
        });
        return;
      }
      this.reset();
      this.account = Object(reading["c" /* readingToken */])();
      this.visible = true;
      this.load();
    },
    async load() {
      if (this.loading || this.submitting || !Object(reading["c" /* readingToken */])()) return;
      const version = ++this.version,
        token = Object(reading["c" /* readingToken */])(),
        id = this.book.novel_id;
      this.loading = true;
      this.ready = false;
      this.error = '';
      try {
        const [gifts, balances, profile, fan] = await Promise.all([this.$api.reader.gifts(), this.$api.reader.balances(), this.$api.reader.profile(), this.$api.reader.ownFanMessage(id).catch(() => null)]);
        if (!this.current(version, token, id)) return;
        const person = Array.isArray(profile) ? profile[0] : profile;
        if (!person || !person.user_id) throw new Error('无法确认当前账号，请重新登录');
        if (Number(person.user_id) === Number(this.book.author_id || this.book.auther_id || this.book.creator_id)) throw new Error('不能给自己的作品打赏');
        const balance = Array.isArray(balances) ? balances[0] : balances;
        if (!balance || !Number.isFinite(Number(balance.log)) || !Number.isFinite(Number(balance.apple))) throw new Error('资源余额加载失败');
        this.profile = person;
        this.balances = {
          log: Number(balance.log),
          apple: Number(balance.apple)
        };
        this.gifts = (Array.isArray(gifts) ? gifts : []).filter(g => g && g.item_name && Number.isSafeInteger(Number(g.item_cost)) && Number(g.item_cost) > 0).sort((a, b) => Number(a.sort_id) - Number(b.sort_id));
        if (!this.gifts.length) throw new Error('暂无可用礼物');
        this.selectedName = this.gifts[0].item_name;
        this.message = fan && fan.success ? String(fan.message || '').slice(0, 50) : '';
        this.ready = true;
      } catch (error) {
        if (this.current(version, token, id)) this.error = error.message || '打赏信息加载失败';
      } finally {
        if (version === this.version) this.loading = false;
      }
    },
    async confirm() {
      if (this.submitting || !this.ready || !this.selected || !this.validAmount || this.uncertain || this.completed) return;
      const token = Object(reading["c" /* readingToken */])(),
        version = this.version,
        id = this.book.novel_id;
      if (!token || token !== this.account) {
        this.checkAccount();
        return;
      }
      const gift = this.selected,
        amount = Number(this.amount),
        resource = this.resource,
        total = this.total;
      if (this.balances[resource] < total) {
        this.error = `${resource === 'apple' ? '苹果' : '原木'}余额不足`;
        return;
      }
      this.submitting = true;
      this.error = this.notice = '';
      const message = this.message.trim();
      try {
        const result = await this.$api.reader.tip({
          from_id: Number(this.profile.user_id),
          novel_id: Number(id),
          item_name: gift.item_name,
          item_amount: amount,
          item_cost: Number(gift.item_cost),
          resource_name: resource,
          message
        });
        if (!this.current(version, token, id)) return;
        if (result !== 'success' && (!result || result.success !== true)) {
          this.uncertain = true;
          throw new Error('服务未确认打赏结果，请先核对余额与粉丝榜');
        }
        this.balances[resource] = result && typeof result.balance === 'number' ? result.balance : Math.max(0, this.balances[resource] - total);
        this.$emit('tipped', {
          gift,
          amount,
          total,
          resource
        });
        this.$message.success(`已打赏 ${amount} 个${gift.item_name}`);
        this.notice = '打赏已完成。';
        this.completed = true;
        if (result === 'success' && message) {
          try {
            const saved = await this.$api.reader.fanMessage(id, message);
            if (!saved.success) throw new Error('留言未保存');
          } catch (_) {
            if (this.current(version, token, id)) this.notice = '打赏已完成；留言未保存，可在粉丝榜中编辑。';
          }
        }
      } catch (error) {
        if (this.current(version, token, id)) {
          this.error = error.message || '打赏请求失败';
          if (!error.status) this.uncertain = true;
        }
      } finally {
        if (version === this.version) this.submitting = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderTipDialog.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderTipDialogvue_type_script_lang_js = (ReaderTipDialogvue_type_script_lang_js); 
// CONCATENATED MODULE: ./components/read/ReaderTipDialog.vue



function ReaderTipDialog_injectStyles (context) {
  
  var style0 = __webpack_require__(229)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var ReaderTipDialog_component = Object(componentNormalizer["a" /* default */])(
  read_ReaderTipDialogvue_type_script_lang_js,
  ReaderTipDialogvue_type_template_id_30b4bfe0_scoped_true_render,
  ReaderTipDialogvue_type_template_id_30b4bfe0_scoped_true_staticRenderFns,
  false,
  ReaderTipDialog_injectStyles,
  "30b4bfe0",
  "43b0e99c"
  
)

/* harmony default export */ var ReaderTipDialog = (ReaderTipDialog_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/BookSupport.vue?vue&type=script&lang=js




/* harmony default export */ var BookSupportvue_type_script_lang_js = ({
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  components: {
    BookTools: BookTools,
    ReaderTipDialog: ReaderTipDialog
  },
  data: () => ({
    favorite: false,
    liked: false,
    likes: 0,
    loading: false,
    savingShelf: false,
    savingLike: false,
    error: '',
    task: null,
    account: null,
    authExpired: false,
    version: 0
  }),
  computed: {
    harvestLink() {
      return '/read/rewards';
    },
    loginUrl() {
      return {
        path: '/login',
        query: {
          redirect: Object(login_return["a" /* loginReturnPath */])(this.$route.fullPath)
        }
      };
    }
  },
  watch: {
    'book.novel_id'() {
      this.reset();
      this.load();
    }
  },
  mounted() {
    this.account = Object(reading["c" /* readingToken */])();
    this.load();
    window.addEventListener('focus', this.checkAccount);
    window.addEventListener('storage', this.checkAccount);
    window.addEventListener('auth-state-changed', this.checkAccount);
  },
  beforeDestroy() {
    this.version++;
    window.removeEventListener('focus', this.checkAccount);
    window.removeEventListener('storage', this.checkAccount);
    window.removeEventListener('auth-state-changed', this.checkAccount);
  },
  methods: {
    current(version, token, id) {
      return version === this.version && token === Object(reading["c" /* readingToken */])() && Number(id) === Number(this.book.novel_id);
    },
    reset() {
      this.version++;
      this.favorite = this.liked = false;
      this.likes = 0;
      this.error = '';
      this.authExpired = false;
      this.task = null;
      this.loading = this.savingLike = this.savingShelf = false;
    },
    checkAccount() {
      const token = Object(reading["c" /* readingToken */])();
      if (token !== this.account) {
        this.account = token;
        this.reset();
        this.$emit('account-change');
        this.load();
      }
    },
    requireLogin() {
      this.checkAccount();
      if (Object(reading["c" /* readingToken */])() && !this.authExpired) return true;
      this.$router.push(this.loginUrl);
      return false;
    },
    async load() {
      if (this.savingLike || this.savingShelf) return;
      const version = ++this.version,
        token = Object(reading["c" /* readingToken */])(),
        id = this.book.novel_id;
      this.account = token;
      this.loading = true;
      this.error = '';
      this.authExpired = false;
      try {
        const [amount, shelf, status] = await Promise.allSettled([this.$api.reader.niceAmount(id), token ? this.$api.reading.getShelf() : Promise.resolve([]), token ? this.$api.reader.niceStatus(id) : Promise.resolve([])]);
        if (!this.current(version, token, id)) return;
        if (amount.status === 'fulfilled') this.likes = Math.max(0, Number(amount.value && amount.value[0] && amount.value[0].nices) || 0);
        this.favorite = shelf.status === 'fulfilled' && Array.isArray(shelf.value) && shelf.value.some(item => Number(item.novel_id) === Number(id));
        this.liked = status.status === 'fulfilled' && Number(status.value && status.value[0] && status.value[0].nices) === 1;
        const failures = [amount, shelf, status].filter(result => result.status === 'rejected');
        const expired = failures.find(result => this.unauthorized(result.reason));
        if (expired) this.supportFailure(expired.reason, '作品支持状态加载失败');else if (failures.length) this.error = '部分作品支持状态未能加载，请重试。';
        this.$emit('liked', {
          liked: this.liked,
          count: this.likes
        });
      } catch (error) {
        if (this.current(version, token, id)) this.supportFailure(error, '作品支持状态加载失败');
      } finally {
        if (version === this.version) this.loading = false;
      }
    },
    unauthorized(error) {
      return [401, 403].includes(error && (error.status || error.response && error.response.status));
    },
    supportFailure(error, fallback) {
      if (this.unauthorized(error)) {
        this.authExpired = true;
        this.favorite = this.liked = false;
        this.task = null;
        this.error = '登录状态已过期，请重新登录后收藏或点赞。';
      } else this.error = error.message || fallback;
    },
    async toggleFavorite() {
      if (!this.requireLogin() || this.loading || this.savingShelf) return;
      const version = this.version,
        token = Object(reading["c" /* readingToken */])(),
        id = this.book.novel_id,
        previous = this.favorite;
      if (previous) {
        try {
          await this.$confirm('确定将这部作品移出书架？', '取消收藏', {
            type: 'warning'
          });
        } catch (_) {
          return;
        }
        if (!this.current(version, token, id)) return;
      }
      this.savingShelf = true;
      this.error = '';
      try {
        await (previous ? this.$api.reading.removeFavorite(id) : this.$api.reading.addFavorite(id));
        if (!this.current(version, token, id)) return;
        this.favorite = !previous;
        this.$message.success(previous ? '已从书架移除' : '已加入书架');
        this.$emit('changed');
      } catch (error) {
        if (this.current(version, token, id)) this.supportFailure(error, '收藏操作失败');
      } finally {
        if (version === this.version) this.savingShelf = false;
      }
    },
    async toggleLike() {
      if (!this.requireLogin() || this.loading || this.savingLike) return;
      const version = this.version,
        token = Object(reading["c" /* readingToken */])(),
        id = this.book.novel_id,
        wasLiked = this.liked;
      this.savingLike = true;
      this.error = '';
      try {
        await this.$api.reader.nice(id);
        if (!this.current(version, token, id)) return;
        const [status, amount] = await Promise.all([this.$api.reader.niceStatus(id), this.$api.reader.niceAmount(id)]);
        if (!this.current(version, token, id)) return;
        this.liked = Number(status && status[0] && status[0].nices) === 1;
        this.likes = Math.max(0, Number(amount && amount[0] && amount[0].nices) || 0);
        this.$emit('liked', {
          liked: this.liked,
          count: this.likes
        });
        if (!wasLiked && this.liked) {
          try {
            const task = await this.$api.reader.likeTask();
            if (this.current(version, token, id)) {
              if (!task || task.msg !== 'Task completed' || typeof task.reward !== 'number' || !Number.isFinite(task.reward)) throw new Error('Unconfirmed task result');
              this.task = task;
            }
          } catch (error) {
            if (this.current(version, token, id) && !/already completed|已完成/i.test(error.message)) this.error = '点赞已成功，任务奖励暂未确认，可在任务页查看';
          }
        }
      } catch (error) {
        if (this.current(version, token, id)) this.supportFailure(error, '点赞操作失败');
      } finally {
        if (version === this.version) this.savingLike = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/BookSupport.vue?vue&type=script&lang=js
 /* harmony default export */ var read_BookSupportvue_type_script_lang_js = (BookSupportvue_type_script_lang_js); 
// CONCATENATED MODULE: ./components/read/BookSupport.vue



function BookSupport_injectStyles (context) {
  
  var style0 = __webpack_require__(231)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var BookSupport_component = Object(componentNormalizer["a" /* default */])(
  read_BookSupportvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  BookSupport_injectStyles,
  "5b70907c",
  "32bb1d98"
  
)

/* harmony default export */ var BookSupport = __webpack_exports__["a"] = (BookSupport_component.exports);

/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/NovelFansList.vue?vue&type=template&id=bd889b00&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "fans-ranking"
  }, [_vm._ssrNode("<div class=\"fans-toolbar\" data-v-bd889b00><button" + _vm._ssrClass(null, {
    active: _vm.period === 'total'
  }) + " data-v-bd889b00>总榜</button><button" + _vm._ssrClass(null, {
    active: _vm.period === 'month'
  }) + " data-v-bd889b00>月榜</button><button" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-bd889b00>刷新</button></div> " + (_vm.loadError ? "<p role=\"alert\" class=\"fans-error\" data-v-bd889b00>" + _vm._ssrEscape(_vm._s(_vm.loadError) + " ") + "<button data-v-bd889b00>重试</button></p>" : "<!---->") + " " + (_vm.loading ? "<div class=\"loading-wrapper\" data-v-bd889b00><div class=\"loading-spinner\" data-v-bd889b00></div> <p data-v-bd889b00>正在加载粉丝榜...</p></div>" : "<div class=\"fans-list-wrapper\" data-v-bd889b00><div class=\"fans-list\" data-v-bd889b00>" + _vm._ssrList(_vm.visibleFans, function (fan, index) {
    return "<div class=\"fan-item\" data-v-bd889b00><div class=\"fan-rank\" data-v-bd889b00><div" + _vm._ssrClass(null, index <= 2 ? _vm.rankClasses[index] : 'rank-number') + " data-v-bd889b00>" + _vm._ssrEscape("\n            " + _vm._s(index + 1) + "\n          ") + "</div></div> <div class=\"fan-avatar\" data-v-bd889b00><img" + _vm._ssrAttr("src", fan.avatar_url) + " alt=\"头像\" data-v-bd889b00></div> <div class=\"fan-details\" data-v-bd889b00><div class=\"fan-info\" data-v-bd889b00><span class=\"fan-name\" data-v-bd889b00>" + _vm._ssrEscape(_vm._s(fan.user_name)) + "</span> <span class=\"fan-value\" data-v-bd889b00>" + _vm._ssrEscape(_vm._s(fan.fans_value)) + "</span></div> " + (fan.message || _vm.isMe(fan) ? "<div class=\"fan-message\" data-v-bd889b00>" + _vm._ssrEscape("\n            " + _vm._s(fan.message || '写下支持留言') + " ") + (_vm.isMe(fan) ? "<button data-v-bd889b00>编辑留言</button>" : "<!---->") + "</div>" : "<!---->") + "</div></div>";
  }) + "</div> " + (!_vm.fanInfo.length && !_vm.loadError ? "<p class=\"fans-empty\" data-v-bd889b00>" + _vm._ssrEscape("本" + _vm._s(_vm.period === 'month' ? '月' : '作品') + "还没有粉丝上榜") + "</p>" : "<!---->") + " " + (_vm.limit > 0 && _vm.fanInfo.length > _vm.limit ? "<button class=\"fans-more\" data-v-bd889b00>" + _vm._ssrEscape(_vm._s(_vm.showAll ? '收起' : `完整粉丝榜（${_vm.fanInfo.length} 人）`)) + "</button>" : "<!---->") + " " + (_vm.isLogin && _vm.myInfo.name ? "<div class=\"my-info-wrapper\" data-v-bd889b00><div class=\"my-info-rank\" data-v-bd889b00>" + _vm._ssrEscape("\n        " + _vm._s(_vm.myInfo.rank) + "\n      ") + "</div> <div class=\"my-info\" data-v-bd889b00><div class=\"my-avatar\" data-v-bd889b00><img" + _vm._ssrAttr("src", _vm.myInfo.avatar_url) + " alt=\"我的头像\" data-v-bd889b00></div> <div class=\"my-details\" data-v-bd889b00><span class=\"my-name\" data-v-bd889b00>" + _vm._ssrEscape(_vm._s(_vm.myInfo.name)) + "</span> <span class=\"my-value\" data-v-bd889b00>" + _vm._ssrEscape(_vm._s(_vm.myInfo.fans_value)) + "</span></div></div></div>" : "<!---->") + "</div>"))]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/NovelFansList.vue?vue&type=template&id=bd889b00&scoped=true

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/NovelFansList.vue?vue&type=script&lang=js

/* harmony default export */ var NovelFansListvue_type_script_lang_js = ({
  props: {
    novelId: {
      type: [Number, String],
      required: true
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      loading: true,
      fanInfo: [],
      myInfo: {
        rank: '未上榜',
        fans_value: 0,
        name: '',
        avatar_url: ''
      },
      rankClasses: ['rank-first', 'rank-second', 'rank-third'],
      isLogin: false,
      userInfo: null,
      period: 'total',
      showAll: false,
      loadError: '',
      version: 0,
      account: null
    };
  },
  computed: {
    visibleFans() {
      return this.limit > 0 && !this.showAll ? this.fanInfo.slice(0, this.limit) : this.fanInfo;
    }
  },
  watch: {
    novelId() {
      this.fanInfo = [];
      this.showAll = false;
      this.getFansList();
    },
    period() {
      this.fanInfo = [];
      this.showAll = false;
      this.getFansList();
    }
  },
  mounted() {
    this.account = Object(reading["c" /* readingToken */])();
    this.getFansList();
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
      const token = Object(reading["c" /* readingToken */])();
      if (token !== this.account) {
        this.account = token;
        this.userInfo = null;
        this.isLogin = !!token;
        this.getFansList();
      }
    },
    async getFansList() {
      const version = ++this.version,
        token = Object(reading["c" /* readingToken */])();
      this.account = token;
      this.loading = true;
      this.loadError = '';
      this.isLogin = !!token;
      this.myInfo = {
        rank: '未上榜',
        fans_value: 0,
        name: '',
        avatar_url: ''
      };
      this.userInfo = null;
      try {
        const [fans, user] = await Promise.all([this.$api.reader.fans(this.novelId, this.period), token ? this.$api.reader.profile().catch(() => null) : Promise.resolve(null)]);
        if (version !== this.version || token !== Object(reading["c" /* readingToken */])()) return;
        this.fanInfo = Array.isArray(fans) ? fans : [];
        this.userInfo = user;
        if (user) {
          const index = this.fanInfo.findIndex(fan => String(fan.user_id) === String(user.user_id));
          this.myInfo = {
            ...user,
            rank: index < 0 ? '未上榜' : `第 ${index + 1} 名`,
            fans_value: index < 0 ? 0 : this.fanInfo[index].fans_value
          };
        }
      } catch (error) {
        if (version === this.version) this.loadError = error.message || '粉丝榜加载失败';
      } finally {
        if (version === this.version) this.loading = false;
      }
    },
    isMe(fan) {
      return this.account === Object(reading["c" /* readingToken */])() && this.userInfo && String(fan.user_id) === String(this.userInfo.user_id);
    },
    async editMessage(fan) {
      if (!this.isMe(fan)) return;
      const version = this.version,
        token = Object(reading["c" /* readingToken */])();
      try {
        const {
          value
        } = await this.$prompt('写下对作品的支持留言', '粉丝留言', {
          inputValue: fan.message || '',
          inputType: 'textarea',
          inputValidator: value => String(value || '').length <= 200 || '留言最多 200 字'
        });
        if (version !== this.version || token !== Object(reading["c" /* readingToken */])()) return;
        const response = await this.$api.reader.fanMessage(this.novelId, String(value || '').trim());
        if (version !== this.version || token !== Object(reading["c" /* readingToken */])()) return;
        if (!response.success) throw new Error(response.msg || '留言更新失败');
        fan.message = String(value || '').trim();
        this.$message.success('留言已更新');
      } catch (error) {
        if (error !== 'cancel' && error !== 'close' && version === this.version) this.$message.error(error.message || '留言更新失败');
      }
    },
    gotoUserProfile(userId) {
      this.$router.push(`/users/${userId}`);
    }
  }
});
// CONCATENATED MODULE: ./components/NovelFansList.vue?vue&type=script&lang=js
 /* harmony default export */ var components_NovelFansListvue_type_script_lang_js = (NovelFansListvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/NovelFansList.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(224)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_NovelFansListvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "bd889b00",
  "0a23dedc"
  
)

/* harmony default export */ var NovelFansList = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 274:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ChapterCatalog_vue_vue_type_style_index_0_id_67243c9c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(222);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ChapterCatalog_vue_vue_type_style_index_0_id_67243c9c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ChapterCatalog_vue_vue_type_style_index_0_id_67243c9c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ChapterCatalog_vue_vue_type_style_index_0_id_67243c9c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ChapterCatalog_vue_vue_type_style_index_0_id_67243c9c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 275:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\nheader[data-v-67243c9c] { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; font-size: 13px; color: var(--reading-muted, #73716a); flex-wrap: wrap;\n}\nheader label[data-v-67243c9c], header div[data-v-67243c9c] { display: flex; align-items: center; gap: 10px; flex-wrap: wrap;\n}\ninput[data-v-67243c9c] { font: inherit; color: var(--reading-ink, #302f2a); background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de); padding: 10px 12px; border-radius: 6px; width: 220px; max-width: 100%;\n}\nbutton[data-v-67243c9c] { font: inherit; border: 1px solid var(--reading-line, #e4e3de); padding: 9px 12px; border-radius: 6px; background: var(--reading-surface, #fff); color: var(--reading-accent, #79573c); cursor: pointer;\n}\n.volume[data-v-67243c9c] { margin-bottom: 28px;\n}\n.volume-title[data-v-67243c9c] { border: none; background: var(--reading-hover, #f5f4f0); width: 100%; text-align: left; margin-bottom: 10px; font-size: 14px; font-weight: 600; padding: 14px 16px;\n}\n.volume-title small[data-v-67243c9c] { float: right; font-size: 12px; color: var(--reading-muted, #73716a); font-weight: 400;\n}\n.chapter-grid[data-v-67243c9c] { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px 24px;\n}\n.chapter-grid a[data-v-67243c9c] { min-width: 0; padding: 14px 16px; color: var(--reading-ink, #302f2a); text-decoration: none; border-radius: 6px; transition: background .18s ease;\n}\n.chapter-grid a[data-v-67243c9c]:hover { background: var(--reading-hover, #f5f4f0);\n}\n.chapter-grid a.current[data-v-67243c9c] { background: var(--reading-tint, #eee7de); color: var(--reading-accent, #79573c);\n}\n.chapter-label[data-v-67243c9c] { font-size: 14px; line-height: 1.7; overflow-wrap: anywhere;\n}\n.chapter-detail[data-v-67243c9c] { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 7px; font-size: 12px; color: var(--reading-muted, #73716a); font-variant-numeric: tabular-nums;\n}\n.chapter-detail small[data-v-67243c9c] { font-size: 11px;\n}\n.empty[data-v-67243c9c] { padding: 40px 16px; text-align: center; color: var(--reading-muted, #73716a); font-size: 14px;\n}\nbutton[data-v-67243c9c]:focus-visible,a[data-v-67243c9c]:focus-visible,input[data-v-67243c9c]:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px;\n}\n@media(max-width:700px) {\n.chapter-grid[data-v-67243c9c] { grid-template-columns: 1fr;\n}\n}\n@media(prefers-reduced-motion:reduce) {\n.chapter-grid a[data-v-67243c9c] { transition: none;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 276:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookExcerpts_vue_vue_type_style_index_0_id_78460448_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(223);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookExcerpts_vue_vue_type_style_index_0_id_78460448_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookExcerpts_vue_vue_type_style_index_0_id_78460448_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookExcerpts_vue_vue_type_style_index_0_id_78460448_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BookExcerpts_vue_vue_type_style_index_0_id_78460448_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 277:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.book-excerpts[data-v-78460448] { padding: 24px; background: var(--reading-surface, #fff); border: 1px solid var(--reading-line, #e4e3de); border-radius: 12px;\n}\nheader[data-v-78460448] { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 24px; flex-wrap: wrap;\n}\nh2[data-v-78460448] { color: var(--reading-ink, #302f2a); font-size: 20px; font-weight: 600;\n}\nheader div[data-v-78460448] { display: flex; gap: 6px; flex-wrap: wrap;\n}\nbutton[data-v-78460448] { padding: 9px 12px; border: 1px solid var(--reading-line, #e4e3de); border-radius: 6px; background: none; color: var(--reading-accent, #79573c); cursor: pointer; font: inherit; font-size: 13px;\n}\nbutton.active[data-v-78460448] { background: var(--reading-accent, #79573c); border-color: var(--reading-accent, #79573c); color: white;\n}\nbutton[data-v-78460448]:disabled { opacity: .5;\n}\n.empty[data-v-78460448] { padding: 40px 16px; text-align: center; color: var(--reading-muted, #73716a); font-size: 14px; line-height: 1.8;\n}\n.notice[data-v-78460448] { color: #9d503b; font-size: 13px; margin-bottom: 16px; line-height: 1.8;\n}\n.excerpts-grid[data-v-78460448] { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 20px;\n}\narticle[data-v-78460448] { padding: 24px; background: var(--reading-hover, #f5f4f0); border: 0; border-radius: 8px; min-width: 0;\n}\na[data-v-78460448] { color: inherit; text-decoration: none;\n}\nblockquote[data-v-78460448] { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 15px; line-height: 1.95; color: var(--reading-ink, #302f2a); border-left: 2px solid var(--reading-accent, #79573c); padding-left: 18px;\n}\narticle p[data-v-78460448], .excerpt-actions[data-v-78460448] { color: var(--reading-muted, #73716a); font-size: 12px; line-height: 1.8; margin-top: 20px;\n}\n.excerpt-actions[data-v-78460448] { display: flex; justify-content: flex-end;\n}\n.excerpt-actions button[data-v-78460448] { border: 0; font-size: 12px; padding: 4px 0;\n}\nbutton[data-v-78460448]:focus-visible,a[data-v-78460448]:focus-visible { outline: 2px solid var(--reading-accent, #79573c); outline-offset: 3px;\n}\n@media(max-width:700px) {\n.excerpts-grid[data-v-78460448] { grid-template-columns: 1fr;\n}\n.book-excerpts[data-v-78460448] { padding: 20px 16px;\n}\narticle[data-v-78460448] { padding: 20px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 278:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaborativeAuthors_vue_vue_type_style_index_0_id_a6b5353c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(226);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaborativeAuthors_vue_vue_type_style_index_0_id_a6b5353c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaborativeAuthors_vue_vue_type_style_index_0_id_a6b5353c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaborativeAuthors_vue_vue_type_style_index_0_id_a6b5353c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaborativeAuthors_vue_vue_type_style_index_0_id_a6b5353c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 279:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.collaborative-authors[data-v-a6b5353c] { margin: 22px 0; padding: 18px 20px; border: 1px solid #eee7df; border-radius: 10px; background: #fff;\n}\nh3[data-v-a6b5353c] { font-size: 15px; color: #65513d; margin-bottom: 12px;\n}.authors[data-v-a6b5353c] { display: flex; flex-wrap: wrap; gap: 12px;\n}.authors a[data-v-a6b5353c] { display: flex; gap: 9px; align-items: center; text-decoration: none; color: #72604e; font-size: 13px; padding: 7px 12px; background: #faf7f1; border-radius: 6px;\n}.authors img[data-v-a6b5353c] { width: 29px; height: 29px; object-fit: cover; border-radius: 50%;\n}small[data-v-a6b5353c] { font-size: 10px; color: #ad8e62;\n}p[data-v-a6b5353c] { font-size: 12px; color: #999;\n}button[data-v-a6b5353c] { border: 0; background: none; color: #947358; cursor: pointer;\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 293:
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
var reading_discovery = __webpack_require__(11);

// EXTERNAL MODULE: ./common/manga-comment-api.js
var manga_comment_api = __webpack_require__(153);

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
  
  var style0 = __webpack_require__(274)
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

/***/ 294:
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
  
  var style0 = __webpack_require__(276)
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

/***/ 295:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/CollaborativeAuthors.vue?vue&type=template&id=a6b5353c&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.authors.length > 1 || _vm.error ? _c('section', {
    staticClass: "collaborative-authors"
  }, [_vm._ssrNode("<h3 data-v-a6b5353c>联合创作</h3> " + (_vm.error ? "<p data-v-a6b5353c>协作者暂时未能加载。<button data-v-a6b5353c>重试</button></p>" : "<!---->") + " "), _vm._ssrNode("<div class=\"authors\" data-v-a6b5353c>", "</div>", _vm._l(_vm.authors, function (author) {
    return _c('nuxt-link', {
      key: author.user_id,
      attrs: {
        "to": `/users/${author.user_id}`
      }
    }, [_c('img', {
      attrs: {
        "src": author.avatar_url || '/default-avatar.png',
        "alt": ""
      }
    }), _c('span', [_vm._v(_vm._s(author.name))]), author.is_owner ? _c('small', [_vm._v("所有者")]) : _vm._e()]);
  }), 1)], 2) : _vm._e();
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/CollaborativeAuthors.vue?vue&type=template&id=a6b5353c&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/CollaborativeAuthors.vue?vue&type=script&lang=js
/* harmony default export */ var CollaborativeAuthorsvue_type_script_lang_js = ({
  props: {
    novelId: {
      type: [Number, String],
      required: true
    }
  },
  data: () => ({
    authors: [],
    error: false,
    version: 0
  }),
  async fetch() {
    await this.load();
  },
  watch: {
    novelId() {
      this.authors = [];
      this.load();
    }
  },
  beforeDestroy() {
    this.version++;
  },
  methods: {
    async load() {
      const version = ++this.version;
      this.error = false;
      try {
        const data = await this.$api.reader.authors(this.novelId);
        if (version === this.version) this.authors = data.authors || [];
      } catch (_) {
        if (version === this.version) this.error = true;
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/CollaborativeAuthors.vue?vue&type=script&lang=js
 /* harmony default export */ var read_CollaborativeAuthorsvue_type_script_lang_js = (CollaborativeAuthorsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/CollaborativeAuthors.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(278)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_CollaborativeAuthorsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "a6b5353c",
  "22b9e871"
  
)

/* harmony default export */ var CollaborativeAuthors = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 369:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(531);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("4e2f8555", content, true, context)
};

/***/ }),

/***/ 370:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(533);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("2854f0eb", content, true, context)
};

/***/ }),

/***/ 529:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/bg.a726195.png";

/***/ }),

/***/ 530:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiEntry_vue_vue_type_style_index_0_id_89adde12_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(369);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiEntry_vue_vue_type_style_index_0_id_89adde12_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiEntry_vue_vue_type_style_index_0_id_89adde12_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiEntry_vue_vue_type_style_index_0_id_89adde12_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderAiEntry_vue_vue_type_style_index_0_id_89adde12_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 531:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".reader-ai-entry[data-v-89adde12]{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:6px;border:1px solid #dfe5d1;color:#7c8b51;background:#f7faef;font-size:13px;text-decoration:none}.reader-ai-entry[data-v-89adde12]:hover{background:#edf3de}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 532:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_13a8d496_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(370);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_13a8d496_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_13a8d496_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_13a8d496_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_2_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_13a8d496_prod_lang_scss__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 533:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "@keyframes spin{to{transform:rotate(360deg)}}@keyframes niubi{0%{transform:scale(0);opacity:1}50%{transform:scale(1)}90%{transform:scale(1);opacity:1}99%{transform:scale(1);opacity:0}100%{transform:scale(0);opacity:0}}.novel-page{max-width:1000px;margin:0 auto;padding:0 20px}.novel-page .loading-container,.novel-page .error-container{display:flex;align-items:center;justify-content:center;flex-direction:column;padding:50px;text-align:center}.novel-page .back-button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;font-size:14px;background-color:#947358;color:#fff;text-decoration:none;margin-top:20px;border:none}.novel-page .novel-container{background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);padding:20px;position:relative}.novel-page .novel-container .novel-header{display:flex;margin-bottom:30px}@media(max-width: 768px){.novel-page .novel-container .novel-header{flex-direction:column;align-items:center;text-align:center}}.novel-page .novel-container .novel-header .novel-cover{border:0;padding:0;cursor:zoom-in;width:200px;height:280px;background-size:cover;background-position:center;border-radius:8px;margin-right:30px;flex-shrink:0;box-shadow:0 4px 8px rgba(0,0,0,.15);position:relative}@media(max-width: 768px){.novel-page .novel-container .novel-header .novel-cover{margin-right:0;margin-bottom:20px}}.novel-page .novel-container .novel-header .book-id-tag{position:absolute;right:0;bottom:0;background-color:rgba(0,0,0,.6);color:#fff;font-size:12px;padding:2px 6px}.novel-page .novel-container .novel-header .novel-info{flex:1}.novel-page .novel-container .novel-header .novel-info .novel-title{font-size:22px;font-weight:bold;color:#333;margin-bottom:12px}.novel-page .novel-container .novel-header .novel-info .novel-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info{display:flex;align-items:center;justify-content:center;cursor:pointer}.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info .author-avatar,.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info .author-avatar-placeholder{width:30px;height:30px;border-radius:50%;margin-right:10px}.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info .author-avatar{object-fit:cover}.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info .author-avatar-placeholder{display:flex;align-items:center;justify-content:center;background-color:#947358;color:#fff;font-weight:bold}.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info .author-name{font-size:16px;color:#666}.novel-page .novel-container .novel-header .novel-info .novel-meta .author-info .author-name:hover{color:#947358}.novel-page .novel-container .novel-header .novel-info .novel-meta .novel-type{font-size:14px;padding:4px 10px;background-color:rgba(148,115,88,.1);color:#947358;border-radius:20px}.novel-page .novel-container .novel-header .novel-info .novel-stats{display:flex;margin-bottom:14px;flex-wrap:wrap}.novel-page .novel-container .novel-header .novel-info .novel-stats .stat-item{display:flex;flex-direction:column;align-items:center;margin-right:30px;margin-bottom:10px}.novel-page .novel-container .novel-header .novel-info .novel-stats .stat-item:last-child{margin-right:0}.novel-page .novel-container .novel-header .novel-info .novel-stats .stat-item .stat-icon{font-size:20px;margin-bottom:4px}.novel-page .novel-container .novel-header .novel-info .novel-stats .stat-item .stat-value{font-size:16px;font-weight:bold;color:#333;margin-bottom:2px}.novel-page .novel-container .novel-header .novel-info .novel-stats .stat-item .stat-label{font-size:12px;color:#666}.novel-page .novel-container .novel-header .novel-info .novel-tags{margin-bottom:16px}.novel-page .novel-container .novel-header .novel-info .novel-tags a{text-decoration:none}.novel-page .novel-container .novel-header .novel-info .novel-tags .tag{display:inline-block;padding:5px 11px;background-color:rgba(148,115,88,.1);color:#947358;border-radius:20px;font-size:14px;margin-right:8px;margin-bottom:8px}.novel-page .novel-container .novel-header .novel-info .novel-tags .tag.activity{color:#ec8600;background-color:#ffcfa5}.novel-page .novel-container .novel-header .novel-info .novel-actions{display:flex;flex-wrap:wrap}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;font-size:14px;margin-right:12px;margin-bottom:10px;min-width:90px}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.primary{background-color:#79573c;color:#fff;border:none}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.primary:hover{background-color:rgb(103.953038674,74.7430939227,51.546961326)}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.reading-button{min-width:150px;position:relative;padding:10px 16px}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.reading-button .reading-info{display:flex;flex-direction:column;align-items:center}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.reading-button .reading-info span{font-weight:bold;font-size:16px}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.reading-button .reading-info small{font-size:12px;opacity:.8;margin-top:2px}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.reading-button .progress-indicator{position:absolute;bottom:0;left:0;width:100%;height:4px;background-color:rgba(0,0,0,.1);border-radius:0 0 4px 4px;overflow:hidden}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button.reading-button .progress-indicator .progress-bar{height:100%;background-color:hsla(0,0%,100%,.7);transition:width .5s ease}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button:not(.primary){background-color:rgba(0,0,0,0);border:1px solid #947358;color:#947358}.novel-page .novel-container .novel-header .novel-info .novel-actions .action-button:not(.primary):hover{background-color:rgba(148,115,88,.05)}.novel-page .novel-container .novel-rank{display:flex;justify-content:space-between;align-items:center;background-color:rgba(0,0,0,.05);border-radius:8px;padding:15px 20px;margin-bottom:20px}.novel-page .novel-container .novel-rank .rank-info{color:#947358;text-decoration:none;font-size:16px}.novel-page .novel-container .novel-rank .rank-info .rank-number{font-size:20px;font-weight:bold;margin:0 5px}.novel-page .novel-container .novel-rank .rank-value{font-size:20px;font-weight:bold;color:#79573c;text-decoration:none}.novel-page .novel-container .novel-content{margin-top:20px}.novel-page .novel-container .novel-content .content-tabs{display:flex;border-bottom:1px solid #eee;margin-bottom:20px;overflow-x:auto}.novel-page .novel-container .novel-content .content-tabs .tab-button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;font-size:14px;background:none;border:none;border-bottom:2px solid rgba(0,0,0,0);color:#666;padding:10px 20px;margin-right:10px;border-radius:0;white-space:nowrap}.novel-page .novel-container .novel-content .content-tabs .tab-button.active{color:#947358;border-bottom-color:#947358}.novel-page .novel-container .novel-content .tab-content{min-height:200px}.novel-page .novel-container .novel-content .tab-content .empty-content{color:#888;font-style:italic;text-align:center;padding:30px 0}.novel-page .novel-container .novel-content .tab-content .intro-content{line-height:1.8;color:#333;white-space:pre-line}.novel-page .novel-container .novel-content .tab-content .worlds-content{margin:15px 0}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:20px}@media(max-width: 768px){.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid{grid-template-columns:1fr}}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card{background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);transition:transform .2s,box-shadow .2s;position:relative;display:flex;height:140px}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card:hover{transform:translateY(-3px);box-shadow:0 5px 15px rgba(0,0,0,.15)}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-cover{width:100px;height:100%;background-size:cover;background-position:center}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info{flex:1;padding:15px;overflow:hidden}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info .world-title{font-size:16px;font-weight:bold;margin:0 0 10px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info .world-title .world-tag{font-size:12px;background-color:#faad14;color:#fff;padding:2px 6px;border-radius:4px;margin-left:8px;font-weight:normal;vertical-align:middle}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info .world-author{display:flex;align-items:center;margin-bottom:10px}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info .world-author .world-author-avatar{width:20px;height:20px;border-radius:50%;margin-right:6px}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info .world-author .world-author-name{font-size:12px;color:#666}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-info .world-description{font-size:12px;color:#888;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;margin:0}.novel-page .novel-container .novel-content .tab-content .worlds-content .worlds-grid .world-card .world-link{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1}.novel-page .novel-container .novel-content .tab-content .fans-content{margin:15px 0}.novel-page .novel-container .novel-content .tab-content .activities-content{margin:15px 0}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group{background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);transition:transform .2s,box-shadow .2s;padding:15px;margin-bottom:15px}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group:hover{transform:translateY(-3px);box-shadow:0 5px 15px rgba(0,0,0,.15)}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-group-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:10px;border-bottom:1px solid #f5f5f5}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-group-head .activity-group-name{font-size:15px;font-weight:bold;color:#333}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-group-head .activity-group-status{font-size:12px;padding:2px 10px;border-radius:999px}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-group-head .activity-group-status.ongoing{color:#fff;background-color:#ea7034}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-group-head .activity-group-status.ended{color:#666;background-color:#f5f5f5}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-news-item{display:flex;align-items:center;justify-content:space-between;padding:10px 4px;border-bottom:1px solid #f5f5f5;cursor:pointer;transition:background-color .2s}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-news-item:hover{background-color:#f5f5f5}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-news-item .activity-news-item-title{font-size:14px;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-news-item .activity-news-item-arrow{flex-shrink:0;margin-left:12px;color:#888}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity{display:flex;align-items:center;justify-content:space-between;padding-top:12px;margin-top:4px}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity .activity-popularity-info{display:flex;flex-direction:column;min-width:0}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity .activity-popularity-info .activity-popularity-count{font-size:14px;font-weight:bold;color:#ea7034}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity .activity-popularity-info .activity-popularity-reason{margin-top:4px;font-size:12px;color:#666}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity .activity-popularity-btn{flex-shrink:0;padding:6px 20px;border-radius:999px;border:none;font-size:13px;font-weight:bold;color:#fff;background:linear-gradient(135deg, #ff8c42 0%, #ea7034 100%);cursor:pointer;transition:all .2s ease}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity .activity-popularity-btn:hover{opacity:.9}.novel-page .novel-container .novel-content .tab-content .activities-content .activity-group .activity-popularity .activity-popularity-btn.disabled{color:#666;background:#f5f5f5;cursor:not-allowed}.novel-page .novel-container .novel-content .tab-content .chapters-content .chapter-list{display:flex;flex-direction:column}.novel-page .novel-container .novel-content .tab-content .chapters-content .chapter-list .chapter-item{display:flex;align-items:center;padding:10px 15px;border-bottom:1px solid #f5f5f5;text-decoration:none;color:#333;transition:background-color .2s}.novel-page .novel-container .novel-content .tab-content .chapters-content .chapter-list .chapter-item:hover{background-color:#f5f5f5}.novel-page .novel-container .novel-content .tab-content .chapters-content .chapter-list .chapter-item .chapter-number{flex:0 0 50px;color:#947358;font-weight:bold}.novel-page .novel-container .novel-content .tab-content .chapters-content .chapter-list .chapter-item .chapter-title{flex:1}.novel-page .novel-container .novel-content .tab-content .chapters-content .chapter-list .chapter-item .chapter-date{color:#888;font-size:12px}.novel-page .novel-container .novel-content .tab-content .comments-content .comment-list .comment-item{background-color:rgba(148,115,88,.05);border-radius:8px;padding:15px;margin-bottom:15px}.novel-page .novel-container .novel-content .tab-content .comments-content .comment-list .comment-item .comment-content{font-size:14px;line-height:1.6;margin-bottom:10px}.novel-page .novel-container .novel-content .tab-content .comments-content .comment-list .comment-item .comment-footer{display:flex;justify-content:space-between;font-size:12px;color:#666}.novel-page .novel-container .novel-content .tab-content .comments-content .comment-list .comment-item .comment-footer .comment-likes{display:flex;align-items:center}.novel-page .novel-container .novel-content .tab-content .comments-content .comment-list .comment-item .comment-footer .comment-likes .like-icon{margin-right:5px;color:#ff6b6b}.novel-page .novel-container .novel-content .tab-content .comments-content .view-all-comments{display:block;text-align:center;color:#947358;text-decoration:none;padding:10px;border-top:1px solid #eee;margin-top:20px;cursor:pointer}.novel-page .novel-container .novel-content .tab-content .comments-content .view-all-comments:hover{background-color:rgba(148,115,88,.05)}.novel-page .recommended-novels{margin-top:40px}.novel-page .recommended-novels .section-title{font-size:20px;margin-bottom:20px;color:#704c35}.novel-page .recommended-novels .novels-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(160px, 1fr));gap:20px}@media(max-width: 576px){.novel-page .recommended-novels .novels-grid{grid-template-columns:repeat(2, 1fr);gap:10px}}.novel-page .recommended-novels .novels-grid .mini-novel-card{position:relative;border-radius:6px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.1);transition:transform .2s,box-shadow .2s}.novel-page .recommended-novels .novels-grid .mini-novel-card:hover{transform:translateY(-5px);box-shadow:0 5px 15px rgba(0,0,0,.15)}.novel-page .recommended-novels .novels-grid .mini-novel-card .mini-novel-cover{height:200px;background-size:cover;background-position:center}.novel-page .recommended-novels .novels-grid .mini-novel-card .mini-novel-info{padding:10px}.novel-page .recommended-novels .novels-grid .mini-novel-card .mini-novel-info .mini-novel-title{font-size:14px;font-weight:bold;margin-bottom:5px;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.novel-page .recommended-novels .novels-grid .mini-novel-card .mini-novel-info .mini-novel-author{font-size:12px;color:#666;margin:0}.novel-page .recommended-novels .novels-grid .mini-novel-card .mini-novel-link{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1}.gift-box{width:200px;height:200px;position:fixed;left:calc(50% - 100px);top:110vh;z-index:9999;pointer-events:none}.gift-background{position:absolute;top:0;left:0;width:100%;height:100%}.gift{position:absolute;top:20%;left:20%;width:60%;height:60%}.tipping-popup{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000}.tipping-popup .tipping-content{background-color:#fff;border-radius:8px;width:90%;max-width:520px;max-height:86vh;overflow-y:auto;padding:20px}.tipping-popup .tipping-content h3{font-size:18px;margin:0 0 20px 0;text-align:center;color:#79573c}.tipping-popup .tipping-content .res-icon{display:inline-block;width:16px;height:16px;border-radius:3px;vertical-align:-3px}.tipping-popup .tipping-content .res-icon.res-log{background:#a1662f}.tipping-popup .tipping-content .res-icon.res-apple{background:#d94a3d;border-radius:50%}.tipping-popup .tipping-content .tipping-balance{display:flex;justify-content:flex-end;gap:16px;margin-bottom:12px;font-size:13px;color:#333}.tipping-popup .tipping-content .tipping-balance .balance-item{display:inline-flex;align-items:center;gap:4px}.tipping-popup .tipping-content .tipping-options{display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-bottom:16px}.tipping-popup .tipping-content .tipping-options .tipping-item{display:flex;flex-direction:column;align-items:center;padding:8px 4px;border:2px solid rgba(200,200,200,.5);border-radius:8px;cursor:pointer;transition:all .2s}.tipping-popup .tipping-content .tipping-options .tipping-item:hover{border-color:rgba(255,112,67,.5)}.tipping-popup .tipping-content .tipping-options .tipping-item.selected{border-color:#ff7043;background-color:#fff8ea}.tipping-popup .tipping-content .tipping-options .tipping-item .item-name{font-size:12px;color:#795548;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.tipping-popup .tipping-content .tipping-options .tipping-item .item-image{width:44px;height:44px;object-fit:contain}.tipping-popup .tipping-content .tipping-options .tipping-item .item-cost{display:inline-flex;align-items:center;gap:3px;margin-top:4px;font-size:12px;font-weight:bold;color:#ea7034}.tipping-popup .tipping-content .tipping-amount{display:flex;align-items:center;gap:8px;margin-bottom:16px}.tipping-popup .tipping-content .tipping-amount .amount-label{font-size:14px;color:#795548}.tipping-popup .tipping-content .tipping-amount .amount-btn{width:28px;height:28px;border:none;border-radius:50%;background-color:rgba(234,112,52,.85);color:#fff;font-size:16px;line-height:1;cursor:pointer}.tipping-popup .tipping-content .tipping-amount .amount-input{width:64px;height:28px;text-align:center;border:1px dashed rgba(200,200,200,.8);border-radius:14px;font-size:14px}.tipping-popup .tipping-content .tipping-amount .amount-quick{margin-left:auto;font-size:12px;color:#947358;cursor:pointer}.tipping-popup .tipping-content .tipping-amount .amount-quick:hover{color:#ea7034}.tipping-popup .tipping-content .tipping-message{position:relative;margin-bottom:16px}.tipping-popup .tipping-content .tipping-message textarea{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid rgba(200,200,200,.6);border-radius:8px;font-size:13px;resize:vertical}.tipping-popup .tipping-content .tipping-message .message-counter{position:absolute;right:8px;bottom:6px;font-size:11px;color:#999}.tipping-popup .tipping-content .tipping-total{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-bottom:16px;font-size:14px;color:#795548}.tipping-popup .tipping-content .tipping-total strong{color:#ea7034;font-size:18px}.tipping-popup .tipping-content .tipping-total .tip-hint{margin-left:auto;font-size:12px;color:#999}.tipping-popup .tipping-content .tipping-buttons{display:flex;justify-content:space-between}.tipping-popup .tipping-content .tipping-buttons button{padding:8px 16px;border-radius:4px;cursor:pointer;transition:all .3s ease;font-size:14px;min-width:100px}.tipping-popup .tipping-content .tipping-buttons button:first-child{background-color:#f5f5f5;color:#333}.tipping-popup .tipping-content .tipping-buttons button:last-child{background-color:#79573c;color:#fff}.tipping-popup .tipping-content .tipping-buttons button:last-child:disabled{opacity:.6;cursor:not-allowed}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 560:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/novel/_id.vue?vue&type=template&id=13a8d496
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "novel-page"
  }, [_vm.error ? _vm._ssrNode("<div class=\"error-container\">", "</div>", [_vm._ssrNode("<p>" + _vm._ssrEscape(_vm._s(_vm.error)) + "</p> "), _c('nuxt-link', {
    staticClass: "back-button",
    attrs: {
      "to": "/read"
    }
  }, [_vm._v("返回小说列表")])], 2) : _vm._e(), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"novel-container\">", "</div>", [_vm._ssrNode("<div id=\"gift-box\" class=\"gift-box\"><img id=\"gift-background\"" + _vm._ssrAttr("src", __webpack_require__(529)) + " class=\"gift-background\"> <img id=\"gift\"" + _vm._ssrAttr("src", _vm.giftImage) + " class=\"gift\"></div> "), _vm._ssrNode("<div class=\"novel-header\">", "</div>", [_vm._ssrNode("<button" + _vm._ssrAttr("disabled", !_vm.novel.picUrl) + " aria-label=\"预览作品封面\" class=\"novel-cover\"" + _vm._ssrStyle(null, _vm.novel.picUrl ? {
    backgroundImage: `url(${_vm.novel.picUrl})`
  } : {
    backgroundColor: `hsl(${_vm.novel.novel_id * 30 % 360}, 70%, 80%)`
  }, null) + "><span class=\"book-id-tag\">" + _vm._ssrEscape("ID " + _vm._s(_vm.novel.novel_id)) + "</span></button> "), _vm._ssrNode("<div class=\"novel-info\">", "</div>", [_vm._ssrNode("<h1 class=\"novel-title\">" + _vm._ssrEscape(_vm._s(_vm.novel.name)) + "</h1> <div class=\"novel-meta\"><div class=\"author-info\">" + (_vm.novel.auther_avatar ? "<img" + _vm._ssrAttr("src", _vm.novel.auther_avatar) + " alt=\"作者头像\" class=\"author-avatar\">" : "<div class=\"author-avatar-placeholder\">" + _vm._ssrEscape(_vm._s(_vm.novel.author_name ? _vm.novel.author_name.charAt(0) : '作') + "\n            ") + "</div>") + " <span class=\"author-name\">" + _vm._ssrEscape(_vm._s(_vm.novel.author_name || '佚名')) + "</span></div></div> <div class=\"novel-stats\"><div class=\"stat-item\"><span class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.formatNumber(_vm.novel.clicks || 0))) + "</span> <span class=\"stat-label\">阅读量</span></div> <div class=\"stat-item\"><span class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.formatNumber(_vm.nice_amount || 0))) + "</span> <span class=\"stat-label\">喜欢</span></div> <div class=\"stat-item\"><span class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.formatNumber(_vm.novel.text_count || 0))) + "</span> <span class=\"stat-label\">字数</span></div> <div class=\"stat-item\"><span class=\"stat-value\">" + _vm._ssrEscape(_vm._s(_vm.novel.is_complete == 1 ? "已完结" : "连载中")) + "</span> <span class=\"stat-label\">状态</span></div></div> "), _vm._ssrNode("<div class=\"novel-tags\">", "</div>", _vm._l(_vm.tags, function (tag) {
    return _c('nuxt-link', {
      key: tag.tag_id,
      staticClass: "tag",
      class: {
        activity: Number(tag.is_activity_tag) === 1
      },
      attrs: {
        "to": `/tag/collections?tag_id=${tag.tag_id}`
      }
    }, [_vm._v(_vm._s(tag.tag_name))]);
  }), 1), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"novel-actions\">", "</div>", [_c('BookSupport', {
    staticClass: "inline-support",
    attrs: {
      "book": _vm.novel
    },
    on: {
      "liked": _vm.onSupportLike,
      "tipped": _vm.onSupportTip,
      "account-change": _vm.onSupportAccount
    }
  }, [_vm.readableChapters.length > 0 ? _c('button', {
    staticClass: "action-button primary reading-button",
    attrs: {
      "slot": "primary"
    },
    on: {
      "click": _vm.startReading
    },
    slot: "primary"
  }, [_c('div', {
    staticClass: "reading-info"
  }, [_c('span', [_vm._v(_vm._s(_vm.historyShown > 1 ? '继续阅读' : '开始阅读'))]), _vm._v(" "), _vm.historyShown > 1 ? _c('small', [_vm._v("已读 " + _vm._s(Math.min(_vm.historyShown / _vm.readableChapters.length * 100, 100).toFixed(0)) + "%")]) : _vm._e()]), _vm._v(" "), _vm.historyShown > 1 ? _c('div', {
    staticClass: "progress-indicator"
  }, [_c('div', {
    staticClass: "progress-bar",
    style: {
      width: `${Math.min(_vm.historyShown / _vm.readableChapters.length * 100, 100)}%`
    }
  })]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c('ReaderAiEntry', {
    attrs: {
      "slot": "secondary",
      "book": _vm.novel
    },
    slot: "secondary"
  })], 1)], 1)], 2)], 2), _vm._ssrNode(" "), _c('CollaborativeAuthors', {
    attrs: {
      "novel-id": _vm.novel.novel_id
    }
  }), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"novel-rank\"" + _vm._ssrStyle(null, null, {
    display: _vm.novelRank.onRank ? '' : 'none'
  }) + ">", "</div>", [_c('nuxt-link', {
    staticClass: "rank-info",
    attrs: {
      "to": "/read/rank?board=logpower"
    }
  }, [_vm._v("\n        实时"), _c('LogPowerWordmark'), _vm._v("榜第\n        "), _c('span', {
    staticClass: "rank-number"
  }, [_vm._v(_vm._s(_vm.novelRank.rank))]), _vm._v("\n        位\n      ")], 1), _vm._ssrNode(" "), _c('nuxt-link', {
    staticClass: "rank-value",
    attrs: {
      "to": `/read/power/${_vm.novel.novel_id}`,
      "aria-label": "查看原木力分项说明"
    }
  }, [_vm._v("\n        " + _vm._s(_vm.novelRank.ranking) + " "), _c('span', {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("ⓘ")])])], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"novel-content\">", "</div>", [_vm._ssrNode("<div class=\"content-tabs\"><button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'intro'
  }) + ">\n          作品简介\n        </button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'chapters'
  }) + ">" + _vm._ssrEscape("\n          章节目录 (" + _vm._s(_vm.readableChapters.length) + ")\n        ") + "</button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'comments'
  }) + ">" + _vm._ssrEscape("\n          读者评论 (" + _vm._s(_vm.commentAmount) + ")\n        ") + "</button> <button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'excerpts'
  }) + ">书摘</button> " + (_vm.worlds.length > 0 ? "<button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'worlds'
  }) + ">" + _vm._ssrEscape("\n          世界设定 (" + _vm._s(_vm.worlds.length) + ")\n        ") + "</button>" : "<!---->") + " " + (_vm.fanInfo.length > 0 ? "<button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'fans'
  }) + ">\n          粉丝榜\n        </button>" : "<!---->") + " " + (_vm.activityNewsList.length > 0 || _vm.activityNewsError ? "<button" + _vm._ssrClass("tab-button", {
    active: _vm.activeTab === 'activities'
  }) + ">" + _vm._ssrEscape("\n          创作活动 (" + _vm._s(_vm.activityNewsList.length) + ")\n        ") + "</button>" : "<!---->") + "</div> "), _vm._ssrNode("<div class=\"tab-content\">", "</div>", [_vm._ssrNode("<div class=\"intro-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.activeTab === 'intro' ? '' : 'none'
  }) + ">" + (_vm.novel.content ? "<p>" + _vm._ssrEscape(_vm._s(_vm.novel.content)) + "</p>" : "<p class=\"empty-content\">暂无简介</p>") + "</div> "), _vm._ssrNode("<div class=\"chapters-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.activeTab === 'chapters' ? '' : 'none'
  }) + ">", "</div>", [_c('ChapterCatalog', {
    attrs: {
      "chapters": _vm.chapters,
      "current-chapter": _vm.history,
      "novel-id": _vm.novel.novel_id
    }
  })], 1), _vm._ssrNode(" "), _vm.activeTab === 'excerpts' ? _vm._ssrNode("<div class=\"excerpts-content\">", "</div>", [_c('BookExcerpts', {
    attrs: {
      "novel-id": _vm.novel.novel_id
    }
  })], 1) : _vm._e(), _vm._ssrNode(" "), _vm.activeTab === 'comments' ? _vm._ssrNode("<div class=\"comments-content\">", "</div>", [_c('MangaCommentPanel', {
    ref: "bookReviews",
    attrs: {
      "inline": "",
      "visible": true,
      "novel-id": _vm.novel.novel_id,
      "work-author-id": _vm.novel.author_id || _vm.novel.auther_id,
      "anchor-id": _vm.commentAnchor
    },
    on: {
      "changed": _vm.getCommentNum
    }
  })], 1) : _vm._e(), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"worlds-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.activeTab === 'worlds' ? '' : 'none'
  }) + ">", "</div>", [_vm._ssrNode("<div class=\"worlds-grid\">", "</div>", _vm._l(_vm.worlds, function (world) {
    return _vm._ssrNode("<div class=\"world-card\">", "</div>", [_vm._ssrNode((world.picUrl ? "<div class=\"world-cover\"" + _vm._ssrStyle(null, `background-image: url(${world.picUrl})`, null) + "></div>" : "<div class=\"world-cover\"" + _vm._ssrStyle(null, `background-color: hsl(${world.novel_id * 30 % 360}, 70%, 80%)`, null) + "></div>") + " <div class=\"world-info\"><h4 class=\"world-title\">" + _vm._ssrEscape("\n                  " + _vm._s(world.name) + "\n                  ") + (world.novel_type == 'world' ? "<span class=\"world-tag\">世界设定</span>" : "<!---->") + "</h4> <div class=\"world-author\">" + (world.avatar_url ? "<img" + _vm._ssrAttr("src", world.avatar_url) + " alt=\"作者头像\" class=\"world-author-avatar\">" : "<!---->") + " <span class=\"world-author-name\">" + _vm._ssrEscape(_vm._s(world.user_name)) + "</span></div> <p class=\"world-description\">" + _vm._ssrEscape(_vm._s(world.content)) + "</p></div> "), _c('nuxt-link', {
      staticClass: "world-link",
      attrs: {
        "to": _vm.workUrl(world)
      }
    })], 2);
  }), 0)]), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"fans-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.activeTab === 'fans' ? '' : 'none'
  }) + ">", "</div>", [_c('NovelFansList', {
    ref: "fansList",
    attrs: {
      "novelId": _vm.novel.novel_id,
      "limit": 3
    }
  })], 1), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"activities-content\"" + _vm._ssrStyle(null, null, {
    display: _vm.activeTab === 'activities' ? '' : 'none'
  }) + ">", "</div>", [_vm._ssrNode((_vm.activityNewsError ? "<p role=\"alert\">" + _vm._ssrEscape(_vm._s(_vm.activityNewsError) + " ") + "<button" + _vm._ssrAttr("disabled", _vm.activityNewsLoading) + ">重试</button></p>" : "<!---->") + " "), _vm._l(_vm.activityNewsList, function (activity) {
    return _vm._ssrNode("<div class=\"activity-group\">", "</div>", [_vm._ssrNode("<div class=\"activity-group-head\">", "</div>", [_c('nuxt-link', {
      staticClass: "activity-group-name",
      attrs: {
        "to": `/tag/collections?tag_id=${activity.tag_id}`
      }
    }, [_vm._v(_vm._s(activity.activity_name))]), _vm._ssrNode(" <span" + _vm._ssrClass("activity-group-status", activity.is_active == 1 ? 'ongoing' : 'ended') + ">" + _vm._ssrEscape("\n                " + _vm._s(activity.is_active == 1 ? '进行中' : '已结束') + "\n              ") + "</span>")], 2), _vm._ssrNode(" "), _vm._l(activity.news, function (news, newsIndex) {
      return [news.link && !news.link.external ? _c('nuxt-link', {
        key: newsIndex,
        staticClass: "activity-news-item",
        attrs: {
          "to": news.link.href
        }
      }, [_c('span', {
        staticClass: "activity-news-item-title"
      }, [_vm._v(_vm._s(news.title))]), _c('span', {
        staticClass: "activity-news-item-arrow"
      }, [_vm._v("›")])]) : news.link ? _c('a', {
        key: newsIndex,
        staticClass: "activity-news-item",
        attrs: {
          "href": news.link.href,
          "target": "_blank",
          "rel": "noopener noreferrer"
        }
      }, [_c('span', {
        staticClass: "activity-news-item-title"
      }, [_vm._v(_vm._s(news.title))]), _c('span', {
        staticClass: "activity-news-item-arrow"
      }, [_vm._v("↗")])]) : _c('span', {
        key: newsIndex,
        staticClass: "activity-news-item"
      }, [_vm._v(_vm._s(news.title) + " · 暂未开放")])];
    }), _vm._ssrNode(" " + (activity.popularity && activity.popularity.enabled ? "<div class=\"activity-popularity\"><div class=\"activity-popularity-info\"><span class=\"activity-popularity-count\">" + _vm._ssrEscape("人气票 " + _vm._s(activity.popularity.votes)) + "</span> " + (_vm.popularityHint(activity) ? "<span class=\"activity-popularity-reason\">" + _vm._ssrEscape(_vm._s(_vm.popularityHint(activity))) + "</span>" : "<!---->") + "</div> <button" + _vm._ssrAttr("disabled", _vm.isVotingPopularity || _vm.popularityBtnDisabled(activity)) + _vm._ssrClass("activity-popularity-btn", {
      disabled: _vm.popularityBtnDisabled(activity)
    }) + ">" + _vm._ssrEscape("\n                " + _vm._s(_vm.popularityBtnText(activity)) + "\n              ") + "</button></div>" : "<!---->"))], 2);
  })], 2)], 2)], 2)], 2), _vm._ssrNode(" "), !_vm.error ? _vm._ssrNode("<div class=\"recommended-novels\">", "</div>", [_vm._ssrNode("<h2 class=\"section-title\">推荐阅读</h2> "), _vm._ssrNode("<div class=\"novels-grid\">", "</div>", _vm._l(_vm.recommendedNovels, function (novel) {
    return _vm._ssrNode("<div class=\"mini-novel-card\">", "</div>", [_vm._ssrNode((novel.picUrl ? "<div class=\"mini-novel-cover\"" + _vm._ssrStyle(null, `background-image: url(${novel.picUrl})`, null) + "></div>" : "<div class=\"mini-novel-cover\"" + _vm._ssrStyle(null, `background-color: hsl(${novel.novel_id * 30 % 360}, 70%, 80%)`, null) + "></div>") + " <div class=\"mini-novel-info\"><h3 class=\"mini-novel-title\">" + _vm._ssrEscape(_vm._s(novel.name)) + "</h3> <p class=\"mini-novel-author\">" + _vm._ssrEscape(_vm._s(novel.author_name || '佚名')) + "</p></div> "), _c('nuxt-link', {
      staticClass: "mini-novel-link",
      attrs: {
        "to": _vm.workUrl(novel)
      }
    })], 2);
  }), 0)], 2) : _vm._e()], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/novel/_id.vue?vue&type=template&id=13a8d496

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reader-comment-links.js
var reader_comment_links = __webpack_require__(40);

// EXTERNAL MODULE: ./utils/reader-position.js
var reader_position = __webpack_require__(192);

// EXTERNAL MODULE: ./utils/reading-history.js
var reading_history = __webpack_require__(41);

// EXTERNAL MODULE: ./components/LogPowerWordmark.vue + 4 modules
var LogPowerWordmark = __webpack_require__(191);

// EXTERNAL MODULE: ./components/NovelFansList.vue + 4 modules
var NovelFansList = __webpack_require__(235);

// EXTERNAL MODULE: ./components/read/CollaborativeAuthors.vue + 4 modules
var CollaborativeAuthors = __webpack_require__(295);

// EXTERNAL MODULE: ./components/read/ChapterCatalog.vue + 4 modules
var ChapterCatalog = __webpack_require__(293);

// EXTERNAL MODULE: ./components/read/BookExcerpts.vue + 4 modules
var BookExcerpts = __webpack_require__(294);

// EXTERNAL MODULE: ./components/read/BookSupport.vue + 14 modules
var BookSupport = __webpack_require__(233);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderAiEntry.vue?vue&type=template&id=89adde12&scoped=true
var ReaderAiEntryvue_type_template_id_89adde12_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.enabled && Number(_vm.book.disable_reader_ai) !== 1 ? _c('nuxt-link', {
    staticClass: "reader-ai-entry",
    attrs: {
      "to": `/read/ask/${_vm.book.novel_id}`
    }
  }, [_c('SiteIcon', {
    attrs: {
      "name": "sparkle"
    }
  }), _c('span', [_vm._v("向原木娘提问")])], 1) : _vm._e();
};
var ReaderAiEntryvue_type_template_id_89adde12_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderAiEntry.vue?vue&type=template&id=89adde12&scoped=true

// EXTERNAL MODULE: ./components/ui/SiteIcon.vue + 5 modules
var SiteIcon = __webpack_require__(150);

// EXTERNAL MODULE: ./utils/reader-ai.js
var reader_ai = __webpack_require__(42);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderAiEntry.vue?vue&type=script&lang=js


/* harmony default export */ var ReaderAiEntryvue_type_script_lang_js = ({
  components: {
    SiteIcon: SiteIcon["a" /* default */]
  },
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    enabled: false
  }),
  mounted() {
    this.sync();
    window.addEventListener('storage', this.sync);
    window.addEventListener('focus', this.sync);
    window.addEventListener(reader_ai["a" /* AI_PREFERENCE_EVENT */], this.sync);
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.sync);
    window.removeEventListener('focus', this.sync);
    window.removeEventListener(reader_ai["a" /* AI_PREFERENCE_EVENT */], this.sync);
  },
  methods: {
    sync() {
      this.enabled = !Object(reader_ai["m" /* readerAiDisabled */])();
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderAiEntry.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderAiEntryvue_type_script_lang_js = (ReaderAiEntryvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/ReaderAiEntry.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(530)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_ReaderAiEntryvue_type_script_lang_js,
  ReaderAiEntryvue_type_template_id_89adde12_scoped_true_render,
  ReaderAiEntryvue_type_template_id_89adde12_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "89adde12",
  "8086f64e"
  
)

/* harmony default export */ var ReaderAiEntry = (component.exports);
// EXTERNAL MODULE: ./components/manga/MangaCommentPanel.vue + 14 modules
var MangaCommentPanel = __webpack_require__(190);

// EXTERNAL MODULE: ./utils/reading-discovery.js
var reading_discovery = __webpack_require__(11);

// EXTERNAL MODULE: ./utils/reader-activities.js
var reader_activities = __webpack_require__(208);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(39);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/novel/_id.vue?vue&type=script&lang=js















/* harmony default export */ var _idvue_type_script_lang_js = ({
  components: {
    LogPowerWordmark: LogPowerWordmark["a" /* default */],
    NovelFansList: NovelFansList["a" /* default */],
    CollaborativeAuthors: CollaborativeAuthors["a" /* default */],
    ChapterCatalog: ChapterCatalog["a" /* default */],
    BookExcerpts: BookExcerpts["a" /* default */],
    BookSupport: BookSupport["a" /* default */],
    ReaderAiEntry: ReaderAiEntry,
    MangaCommentPanel: MangaCommentPanel["a" /* default */]
  },
  async asyncData({
    params,
    query = {},
    $api,
    error,
    redirect
  }) {
    try {
      // 获取小说详情 - 用于SEO的服务端渲染
      const novel = await $api.reader.book(params.id);
      if (!novel || novel.length === 0) {
        return error({
          statusCode: 404,
          message: '找不到该小说'
        });
      }
      const novelData = novel[0];
      const anchor = Object(reader_comment_links["a" /* readingCommentId */])(query);
      const commentQuery = anchor ? `?preLoadCommentId=${anchor}` : '';

      // 如果是设定书，则应当跳转到世界设定查看页面
      if (novelData.novel_type === "world") {
        return redirect(`/world/${novelData.novel_id}${commentQuery}`);
      }

      // 如果是漫画，跳转到漫画详情页
      if (novelData.novel_type === "manga") {
        return redirect(`/manga/${novelData.novel_id}${commentQuery}`);
      }

      // Independent public data loads in parallel; optional activity failure
      // must not turn an otherwise readable book into an error page.
      const loadActivities = async () => {
        try {
          return {
            activityNews: Object(reader_activities["b" /* normalizeActivities */])(await $api.reader.activities(novelData.novel_id), "https://m.loghome.ink"),
            activityNewsError: ''
          };
        } catch (_) {
          return {
            activityNews: [],
            activityNewsError: '活动资讯暂时无法加载，请重试。'
          };
        }
      };
      const [chapters, tags, {
        activityNews,
        activityNewsError
      }] = await Promise.all([$api.reader.chapters(novelData.novel_id), $api.novels.getNovelTags(novelData.novel_id), loadActivities()]);

      // 返回服务端渲染所需的数据
      return {
        error: null,
        novel: novelData,
        chapters: chapters || [],
        tags: tags || [],
        activityNews,
        activityNewsError
      };
    } catch (err) {
      console.error('服务端获取小说数据失败', err);
      return error({
        statusCode: err.status || 503,
        message: err.status === 404 ? '作品不存在或不可阅读' : '加载小说数据失败，请稍后重试'
      });
    }
  },
  data() {
    return {
      error: null,
      activeTab: 'intro',
      liking: false,
      isInBookcase: false,
      recommendedNovels: [],
      continueProgress: null,
      history: 1,
      progressArticle: {},
      commentAmount: 0,
      niceStatus: false,
      nice_amount: 0,
      fanInfo: [],
      novelRank: {
        onRank: false,
        rank: 0,
        ranking: 0
      },
      worlds: [],
      giftImage: "",
      userInfo: null,
      isLogin: false,
      activityNews: [],
      activityNewsError: '',
      activityNewsLoading: false,
      activityNewsVersion: 0,
      activityAccountEpoch: 0,
      popularityVersion: 0,
      votingVersion: 0,
      popularityStatus: {},
      isVotingPopularity: false
    };
  },
  head() {
    var _this$novel, _this$novel2;
    return Object(reading_seo["d" /* readingHead */])({
      title: (_this$novel = this.novel) !== null && _this$novel !== void 0 && _this$novel.name ? `${this.novel.name} - 原木社区` : '小说详情 - 原木社区',
      description: (_this$novel2 = this.novel) === null || _this$novel2 === void 0 ? void 0 : _this$novel2.content,
      path: `/novel/${this.novel.novel_id}`,
      image: this.novel.picUrl,
      type: 'book',
      schema: Object(reading_seo["b" /* bookSchema */])(this.novel, `/novel/${this.novel.novel_id}`)
    });
  },
  computed: {
    commentAnchor() {
      return Object(reader_comment_links["a" /* readingCommentId */])(this.$route.query);
    },
    readableChapters() {
      return this.chapters.filter(chapter => chapter.article_type !== 'spliter');
    },
    articleLength() {
      return this.chapters.length;
    },
    activityNewsList() {
      return this.activityNews.filter(activity => activity.news && activity.news.length > 0 || activity.popularity && activity.popularity.enabled);
    },
    historyShown() {
      const index = this.readableChapters.findIndex(item => String(item.article_chapter) === String(this.history));
      return index >= 0 ? index + 1 : 1;
    }
  },
  watch: {
    commentAnchor(id) {
      if (id) this.activeTab = 'comments';
    }
  },
  async mounted() {
    if (this.commentAnchor) this.activeTab = 'comments';
    // 检查登录状态
    this.checkLoginStatus();
    // 如果已登录，获取用户信息
    if (this.isLogin) {
      await this.getUserInfo();
    }
    // 补充其他客户端数据
    await this.fetchClientData();
  },
  methods: {
    workUrl: reading_discovery["n" /* workUrl */],
    previewCover() {
      if (this.novel.picUrl && this.$preview) this.$preview([this.novel.picUrl], 0);
    },
    async fetchClientData() {
      await Promise.allSettled([this.loadRecommendations(), this.getNices(), this.getCommentNum(), this.getFansStatistics(), this.getWorlds(), this.checkNovelRank(), this.checkBookcaseStatus(), this.getPopularityStatus(), this.getReadingProgress()]);
      this.addReaderHistory(this.novel);
    },
    async loadRecommendations() {
      const allNovels = await this.$api.novels.getAllNovels();
      this.recommendedNovels = (Array.isArray(allNovels) ? allNovels : []).filter(n => String(n.novel_id) !== String(this.novel.novel_id)).sort(() => 0.5 - Math.random()).slice(0, 6);
    },
    async getNovelTags() {
      try {
        this.tags = (await this.$api.novels.getNovelTags(this.novel.novel_id)) || [];
      } catch (_) {}
    },
    async getCommentNum() {
      try {
        const res = await this.$api.community.getNovelCommentsAmount(this.novel.novel_id);
        if (res && res.length) this.commentAmount = Number(res[0]['COUNT(*)']) || 0;
      } catch (_) {}
    },
    async getNices() {
      const token = Object(reading["c" /* readingToken */])(),
        novelId = this.novel.novel_id;
      try {
        const [amount, status] = await Promise.all([this.$api.reader.niceAmount(novelId), token ? this.$api.reader.niceStatus(novelId) : Promise.resolve([])]);
        if (novelId !== this.novel.novel_id || token !== Object(reading["c" /* readingToken */])()) return;
        this.nice_amount = Number((amount[0] || {}).nices) || 0;
        this.niceStatus = Number((status[0] || {}).nices) === 1;
      } catch (_) {/* Keep the last successful state; mutations show failures. */}
    },
    // 检查小说排行
    async checkNovelRank() {
      try {
        const ranks = await this.$api.novels.checkNovelRank(this.novel.novel_id);
        if (ranks && ranks.length > 0) {
          this.novelRank.onRank = true;
          this.novelRank.rank = ranks[0].rank;
          this.novelRank.ranking = ranks[0].ranking;
        }
      } catch (error) {
        console.error('获取排行信息失败', error);
      }
    },
    // 获取粉丝统计
    async getFansStatistics() {
      try {
        // 只检查是否存在粉丝，详细数据由NovelFansList组件获取
        const fans = await this.$api.novels.getNovelFans(this.novel.novel_id);
        this.fanInfo = fans && fans.length > 0 ? [{}] : []; // 只需要知道是否有数据
      } catch (error) {
        console.error('获取粉丝统计失败', error);
        this.fanInfo = [];
      }
    },
    // 获取关联世界
    async getWorlds() {
      try {
        const worlds = await this.$api.worlds.getAssoWorldByNovelId(this.novel.novel_id);
        this.worlds = worlds || [];
      } catch (error) {
        console.error('获取关联世界失败', error);
      }
    },
    // 获取创作活动新闻
    async getNovelActivityNews() {
      const id = this.novel.novel_id,
        version = ++this.activityNewsVersion;
      this.activityNewsLoading = true;
      try {
        const list = Object(reader_activities["b" /* normalizeActivities */])(await this.$api.reader.activities(id), "https://m.loghome.ink");
        if (id !== this.novel.novel_id || version !== this.activityNewsVersion) return;
        this.activityNews = list;
        this.activityNewsError = '';
      } catch (error) {
        if (id === this.novel.novel_id && version === this.activityNewsVersion) this.activityNewsError = error.message || '活动资讯暂时无法加载，请重试。';
      } finally {
        if (id === this.novel.novel_id && version === this.activityNewsVersion) this.activityNewsLoading = false;
      }
    },
    // 获取当前用户在各活动中的人气票状态
    async getPopularityStatus() {
      const token = Object(reading["c" /* readingToken */])(),
        id = this.novel.novel_id,
        epoch = this.activityAccountEpoch,
        version = ++this.popularityVersion;
      if (!token) {
        this.popularityStatus = {};
        return;
      }
      try {
        const list = await this.$api.popularity.getNovelStatus(id);
        if (token !== Object(reading["c" /* readingToken */])() || id !== this.novel.novel_id || epoch !== this.activityAccountEpoch || version !== this.popularityVersion) return;
        const map = {};
        (Array.isArray(list) ? list : []).forEach(item => {
          map[item.tag_id] = item;
        });
        this.popularityStatus = map;
      } catch (error) {
        if (token === Object(reading["c" /* readingToken */])() && id === this.novel.novel_id && epoch === this.activityAccountEpoch && version === this.popularityVersion) this.popularityStatus = {};
      }
    },
    popularityStatusOf(activity) {
      return this.popularityStatus[activity.tag_id] || null;
    },
    popularityBtnText(activity) {
      const status = this.popularityStatusOf(activity);
      return status && status.voted_this_novel ? '已投' : '投人气票';
    },
    popularityBtnDisabled(activity) {
      const status = this.popularityStatusOf(activity);
      // 未登录时按钮仍可点击（引导登录），登录后由服务端状态决定
      return !!status && !status.can_vote;
    },
    popularityHint(activity) {
      const status = this.popularityStatusOf(activity);
      if (!status) return '';
      if (status.voted_this_novel) return '';
      if (!status.can_vote) return status.reason;
      return `剩余 ${status.remaining} 票`;
    },
    // 投人气票
    async voteActivity(activity) {
      if (!localStorage.getItem('token')) {
        this.$router.push('/login');
        return;
      }
      const status = this.popularityStatusOf(activity);
      if (status && !status.can_vote) {
        this.$message.info(status.reason || '暂时无法投票');
        return;
      }
      if (this.isVotingPopularity) return;
      const token = Object(reading["c" /* readingToken */])(),
        id = this.novel.novel_id,
        epoch = this.activityAccountEpoch,
        version = ++this.votingVersion;
      const current = () => token === Object(reading["c" /* readingToken */])() && id === this.novel.novel_id && epoch === this.activityAccountEpoch && version === this.votingVersion;
      this.isVotingPopularity = true;
      try {
        await this.$api.popularity.vote(id, activity.tag_id);
        if (!current()) return;
        this.$message.success('已为本书投出 1 票');
        this.getPopularityStatus();
        this.getNovelActivityNews();
      } catch (error) {
        if (!current()) return;
        this.$message.error(error.message || '投票失败，请稍后重试');
        this.getPopularityStatus();
      } finally {
        if (current()) this.isVotingPopularity = false;
      }
    },
    // 检查收藏状态
    async checkBookcaseStatus() {
      if (!localStorage.getItem("token")) return;
      try {
        const likes = await this.$api.bookcase.getLikesOf();
        if (likes) {
          this.isInBookcase = likes.some(item => item.novel_id === this.novel.novel_id);
        }
      } catch (error) {
        console.error('获取收藏状态失败', error);
      }
    },
    // 获取阅读进度
    async getReadingProgress() {
      const token = Object(reading["c" /* readingToken */])(),
        novelId = this.novel.novel_id;
      const local = Object(reading_history["b" /* localReadingProgress */])(novelId, token);
      this.continueProgress = local;
      if (local && local.last_article_chapter) this.history = Number(local.last_article_chapter);
      try {
        const response = await this.$api.reading.getProgress(novelId);
        if (token !== Object(reading["c" /* readingToken */])() || novelId !== this.novel.novel_id) return;
        const cloud = Array.isArray(response) ? response[0] : response;
        if (cloud && cloud.last_article_chapter && (!local || !local.last_read_time || new Date(cloud.last_read_time) >= new Date(local.last_read_time))) {
          this.history = Number(cloud.last_article_chapter);
          this.continueProgress = cloud;
        }
      } catch (_) {/* Resume from local progress when offline. */}

      // 获取当前阅读章节的内容
      if (this.chapters.length > 0) {
        let currentChapter = this.chapters[0];

        // 查找历史阅读章节
        for (const chapter of this.chapters) {
          if (chapter.article_chapter == this.history) {
            currentChapter = chapter;
            break;
          }
        }

        // 获取章节内容
        this.getChapterContent(currentChapter.article_id);
      }
    },
    // 获取章节内容
    async getChapterContent(articleId) {
      try {
        const article = await this.$api.articles.getArticle(articleId);
        if (article && article.length > 0) {
          this.progressArticle = article[0];
        }
      } catch (error) {
        console.error('获取章节内容失败', error);
        this.progressArticle = {
          title: "章节加载失败",
          content: "无法加载章节内容"
        };
      }
    },
    // 添加阅读历史
    addReaderHistory(book) {
      Object(reading_history["d" /* recordLocalReading */])(book);
    },
    // 检查登录状态
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLogin = !!token;
      return this.isLogin;
    },
    // 获取用户信息
    async getUserInfo() {
      const token = Object(reading["c" /* readingToken */])();
      if (!token) return null;
      try {
        if (!this.userInfo) {
          const userInfoResponse = await this.$api.users.getUserProfile();
          if (userInfoResponse && token === Object(reading["c" /* readingToken */])()) {
            this.userInfo = userInfoResponse;
          }
        }
        return this.userInfo;
      } catch (error) {
        console.error('获取用户信息失败', error);
        return null;
      }
    },
    // 开始阅读
    startReading() {
      if (this.readableChapters.length === 0) {
        this.$message.info("本书还没有章节");
        return;
      }
      const stored = this.continueProgress || Object(reading_history["b" /* localReadingProgress */])(this.novel.novel_id);
      const target = this.readableChapters.find(chapter => stored && Number(chapter.article_id) === Number(stored.last_article_id)) || this.readableChapters.find(chapter => String(chapter.article_chapter) === String(this.history)) || this.readableChapters[0];
      const href = stored && Number(stored.last_article_id) === Number(target.article_id) ? Object(reader_position["e" /* textReaderResumeUrl */])(stored) : `/article/${target.article_id}?start=1`;
      this.$router.push(href);
    },
    // 切换收藏状态
    async toggleLike() {
      if (!localStorage.getItem("token")) {
        this.$router.push('/login');
        return;
      }
      try {
        if (this.isInBookcase) {
          // 取消收藏
          await this.$api.bookcase.removeLikeNovel(this.novel.novel_id);
          this.$message.success("已从书架移除");
        } else {
          // 添加收藏
          await this.$api.bookcase.likeNovel(this.novel.novel_id);
          this.$message.success("成功添加到书架");
        }
        this.isInBookcase = !this.isInBookcase;
      } catch (error) {
        console.error('切换收藏状态失败', error);
        this.$message.error("操作失败，请稍后重试");
      }
    },
    async nice() {
      if (!Object(reading["c" /* readingToken */])()) {
        this.$router.push('/login');
        return;
      }
      if (this.liking) return;
      this.liking = true;
      try {
        await this.$api.reader.nice(this.novel.novel_id);
        await this.getNices();
      } catch (error) {
        this.$message.error(error.message || '操作失败，请稍后重试');
      } finally {
        this.liking = false;
      }
    },
    // 打赏功能
    onSupportAccount() {
      this.activityAccountEpoch++;
      this.votingVersion++;
      this.isVotingPopularity = false;
      this.userInfo = null;
      this.popularityStatus = {};
      this.checkLoginStatus();
      this.getUserInfo();
      this.getPopularityStatus();
      this.getReadingProgress();
    },
    onSupportLike(state) {
      this.nice_amount = state.count;
      this.niceStatus = state.liked;
    },
    onSupportTip(result) {
      this.runGiftAnimation(result.gift.img_url);
      this.getFansStatistics();
      if (this.$refs.fansList) this.$refs.fansList.getFansList();
    },
    // 打赏动画
    runGiftAnimation(imgUrl = "/gift.png") {
      this.giftImage = imgUrl;
      setTimeout(() => {
        // 礼物动画
        const giftAnimation = [{
          top: "110vh",
          transform: "scale(0.1, 0.1)"
        }, {
          top: "16vh",
          transform: "scale(0.6, 0.6)",
          offset: 0.16
        }, {
          top: "37vh",
          transform: "scale(0.9, 0.9)",
          offset: 0.28
        }, {
          top: "36vh",
          transform: "scale(0.8, 0.8)",
          offset: 0.32
        }, {
          top: "36vh",
          transform: "scale(0.8, 0.8)",
          offset: 0.48
        }, {
          top: "36vh",
          transform: "scale(1.0, 1.0)",
          offset: 0.72
        }, {
          top: "36vh",
          transform: "scale(1.0, 1.0)"
        }];
        const giftAnimTiming = {
          duration: 4000,
          iteration: 1,
          easing: "ease-out"
        };

        // 背景动画
        const giftBackgroundAnimation = [{
          transform: "scale(0.2, 0.2)"
        }, {
          transform: "scale(0.2, 0.2)",
          filter: "drop-shadow(0px 0px 0px rgba(255, 199, 101, 0.6)) brightness(0.0)",
          offset: 0.56
        }, {
          transform: "scale(1.4, 1.4)",
          filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(1.0)",
          offset: 0.72
        }, {
          transform: "scale(1.2, 1.2) rotate(30deg)",
          filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(0.9)",
          offset: 0.79
        }, {
          transform: "scale(1.4, 1.4) rotate(60deg)",
          filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(0.8)",
          offset: 0.86
        }, {
          transform: "scale(1.2, 1.2) rotate(90deg)",
          filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(0.9)",
          offset: 0.93
        }, {
          transform: "scale(1.4, 1.4) rotate(120deg)",
          filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(1.0)"
        }];
        const giftBgAnimTiming = {
          duration: 4000,
          iteration: 1,
          easing: "ease-out"
        };
        document.getElementById("gift-box").animate(giftAnimation, giftAnimTiming);
        document.getElementById("gift-background").animate(giftBackgroundAnimation, giftBgAnimTiming);
      }, 100);
    },
    // 分享小说
    shareBook() {
      const content = `我正在原木社区读《${this.novel.name}》，你也一起来看看吧！\nhttps://loghome.ink/novel/${this.novel.novel_id}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(content).then(() => this.$message.success("分享链接已复制到剪贴板")).catch(() => this.$message.error("复制失败，请手动复制"));
      } else {
        // 兼容旧浏览器
        const textarea = document.createElement('textarea');
        textarea.value = content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.$message.success("分享链接已复制到剪贴板");
      }
    },
    // 跳转到用户主页
    gotoUserProfile(userId) {
      this.$router.push(`/users/${userId}`);
    },
    // 显示简介
    showDescription(content) {
      this.$modal.show('dialog', {
        title: '作品简介',
        text: content,
        buttons: [{
          title: '关闭',
          handler: () => this.$modal.hide('dialog')
        }]
      });
    },
    // 富文本转纯文本
    richtext2text(richtext) {
      if (!richtext) return '努力加载中';
      try {
        const richArr = JSON.parse(richtext);
        let richStr = "";
        for (const item of richArr) {
          if (item.type === "text") richStr += item.value + "\n";
          if (item.type === "image") richStr += "[图片]\n";
        }
        return richStr;
      } catch (error) {
        console.error('解析富文本失败', error);
        return '无法解析内容';
      }
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
    // UTC时间转北京时间
    utc2beijing(utc_datetime) {
      if (!utc_datetime) return '';

      // 转为正常的时间格式 年-月-日 时:分:秒
      const T_pos = utc_datetime.indexOf('T');
      const Z_pos = utc_datetime.indexOf('Z');
      const year_month_day = utc_datetime.substr(0, T_pos);
      const hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
      const new_datetime = year_month_day + " " + hour_minute_second;

      // 处理成为时间戳
      let timestamp = new Date(Date.parse(new_datetime)).getTime() / 1000;

      // 增加8个小时，北京时间比utc时间多八个时区
      timestamp = timestamp + 8 * 60 * 60;

      // 时间戳转为时间
      const date = new Date(timestamp * 1000);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  }
});
// CONCATENATED MODULE: ./pages/novel/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var novel_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// CONCATENATED MODULE: ./pages/novel/_id.vue



function _id_injectStyles (context) {
  
  var style0 = __webpack_require__(532)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var _id_component = Object(componentNormalizer["a" /* default */])(
  novel_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  _id_injectStyles,
  null,
  "0eeca558"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (_id_component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map