exports.ids = [47];
exports.modules = {

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

/***/ 614:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/comment/_id.vue?vue&type=template&id=6c929565
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "comment-navigation"
  }, [_vm._ssrNode("正在定位评论…")]);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/comment/_id.vue?vue&type=template&id=6c929565

// EXTERNAL MODULE: ./common/manga-comment-api.js
var manga_comment_api = __webpack_require__(153);

// EXTERNAL MODULE: ./utils/reader-comment-links.js
var reader_comment_links = __webpack_require__(40);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(39);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/comment/_id.vue?vue&type=script&lang=js



/* harmony default export */ var _idvue_type_script_lang_js = ({
  async asyncData({
    params,
    query,
    $api,
    error,
    redirect
  }) {
    const id = Number(params.id);
    if (!Number.isSafeInteger(id) || id <= 0) return error({
      statusCode: 404,
      message: '评论不存在'
    });
    try {
      const comment = await Object(manga_comment_api["d" /* fetchMangaCommentById */])("https://api.loghome.ink", id);
      if (!comment || Number(query.novelId) > 0 && Number(query.novelId) !== Number(comment.novelId)) return error({
        statusCode: 404,
        message: '评论不存在或不属于本作品'
      });
      const books = await $api.reader.book(comment.novelId),
        book = books && books[0];
      if (!book) return error({
        statusCode: 404,
        message: '作品不存在或不可阅读'
      });
      return redirect(302, Object(reader_comment_links["b" /* readingCommentTarget */])(comment, book, id));
    } catch (failure) {
      var _failure$response;
      return error({
        statusCode: failure.status || ((_failure$response = failure.response) === null || _failure$response === void 0 ? void 0 : _failure$response.status) || 503,
        message: '暂时无法定位评论，请稍后重试'
      });
    }
  },
  head() {
    return Object(reading_seo["d" /* readingHead */])({
      title: '定位评论 - 原木社区',
      path: `/read/comment/${this.$route.params.id}`,
      noindex: true
    });
  }
});
// CONCATENATED MODULE: ./pages/read/comment/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var comment_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/read/comment/_id.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  comment_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  "64b0aaad"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map