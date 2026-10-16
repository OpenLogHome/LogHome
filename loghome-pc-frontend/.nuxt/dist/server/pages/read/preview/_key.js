exports.ids = [51];
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

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MEMBER_THEMES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return THEME_NAMES; });
/* unused harmony export PREFERENCE_KEY */
/* unused harmony export THEME_MEMORY_KEY */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DEFAULT_PREFERENCES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return normalizePreferences; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return readPreferences; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return savePreferences; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return readerThemeMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return readReaderTheme; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return rememberReaderTheme; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return membershipTier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return canUseBackground; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return safeFontUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return readerFonts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return fontIdentity; });
/* unused harmony export READER_SITE_THEME_KEY */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return readerFollowsSiteTheme; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return saveReaderThemeFollowing; });
/* harmony import */ var _config_reader_themes_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(217);
var _config_reader_themes_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(217, 1);
/* harmony reexport (default from named exports) */ __webpack_require__.d(__webpack_exports__, "q", function() { return _config_reader_themes_json__WEBPACK_IMPORTED_MODULE_0__; });
/* harmony import */ var _config_reader_fonts_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(265);
var _config_reader_fonts_json__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(265, 1);



const MEMBER_THEMES = ["wavechaser", "powderblue", "qingyun", "sunburst", "thorncrown", "chocolate"];
const THEME_NAMES = {
  white: "蛙鸣白",
  yellow: "原木黄",
  green: "草原绿",
  blue: "晴空蓝",
  purple: "末地紫",
  pink: "桃花粉",
  black: "虚空黑",
  wavechaser: "追波",
  powderblue: "粉蓝",
  qingyun: "青云",
  sunburst: "艳阳",
  thorncrown: "荆棘冠",
  chocolate: "巧克力",
  blockepoch: "方块纪元"
};
const PREFERENCE_KEY = "loghome:reader:preferences:v1";
const THEME_MEMORY_KEY = "loghome:reader:theme-memory:v1";
const DEFAULT_PREFERENCES = Object.freeze({
  mode: "page",
  theme: "white",
  font: "default",
  fontSize: 22,
  lineHeight: 1.8,
  backgroundSkinKey: "",
  width: 860
});
const THEME_ALIASES = {
  light: "white",
  sepia: "yellow",
  dark: "black"
};
function normalizePreferences(value = {}) {
  if (!value || typeof value !== "object") value = {};
  const theme = THEME_ALIASES[value.theme] || value.theme;
  const bounded = (input, min, max, fallback) => Number.isFinite(Number(input)) && input !== "" && input != null ? Math.max(min, Math.min(max, Number(input))) : fallback;
  return {
    mode: value.mode === "text" ? "text" : "page",
    theme: Object.prototype.hasOwnProperty.call(_config_reader_themes_json__WEBPACK_IMPORTED_MODULE_0__, theme) ? theme : "white",
    font: typeof value.font === "string" && value.font.length <= 64 ? value.font : "default",
    fontSize: Math.round(bounded(value.fontSize, 14, 36, DEFAULT_PREFERENCES.fontSize)),
    lineHeight: bounded(value.lineHeight, 1.3, 2.5, 1.8),
    backgroundSkinKey: typeof value.backgroundSkinKey === "string" ? value.backgroundSkinKey.slice(0, 64) : "",
    width: Math.round(bounded(value.width, 620, 1120, DEFAULT_PREFERENCES.width))
  };
}
function readPreferences(storage) {
  try {
    const saved = storage.getItem(PREFERENCE_KEY);
    if (saved) return normalizePreferences(JSON.parse(saved));
    // Preserve existing desktop choices on upgrade; do not import mobile rpx as desktop pixels.
    const oldFont = storage.getItem("reading_font_family");
    return normalizePreferences({
      mode: storage.getItem("readerProps"),
      theme: storage.getItem("reading_theme"),
      fontSize: storage.getItem("reading_font_size"),
      font: ["serif", "sans-serif"].includes(oldFont) ? oldFont : "default"
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
  if (typeof theme.isBlack === "boolean") return theme.isBlack ? "dark" : "light";
  const value = String(theme.backgroundColor || "").replace(/^#/, "");
  const hex = value.length === 3 ? value.split("").map(char => char + char).join("") : value.slice(0, 6);
  if (!/^[0-9a-f]{6}$/i.test(hex)) return "light";
  const channels = [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16) / 255).map(channel => channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2] < 0.35 ? "dark" : "light";
}
function themeSelection(value) {
  if (!value || typeof value !== "object" || !Object.prototype.hasOwnProperty.call(_config_reader_themes_json__WEBPACK_IMPORTED_MODULE_0__, value.theme)) return null;
  return {
    theme: value.theme,
    backgroundSkinKey: typeof value.backgroundSkinKey === "string" ? value.backgroundSkinKey.slice(0, 64) : ""
  };
}
function readReaderTheme(storage, mode) {
  const fallback = {
    theme: mode === "dark" ? "black" : "white",
    backgroundSkinKey: ""
  };
  try {
    const memory = JSON.parse(storage.getItem(THEME_MEMORY_KEY) || "{}");
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
      memory = JSON.parse(storage.getItem(THEME_MEMORY_KEY) || "{}");
    } catch (_) {}
    const light = themeSelection(memory && memory.light),
      dark = themeSelection(memory && memory.dark);
    memory = {};
    if (light && readerThemeMode(light) === "light") memory.light = light;
    if (dark && readerThemeMode(dark) === "dark") memory.dark = dark;
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
  return ["standard", "super"].includes(tier) ? tier : "";
}
function canUseBackground(required, tier) {
  if (!required || required === "none") return true;
  return required === "standard" ? ["standard", "super"].includes(tier) : required === "super" && tier === "super";
}
function safeFontUrl(value) {
  return typeof value === "string" && /^https?:\/\/[^\s"\\]+$/i.test(value) ? value : "";
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
    if (["__proto__", "constructor", "prototype", "default"].includes(key)) return;
    fonts[key] = {
      name: String(item.font_name).slice(0, 64),
      version: String(item.font_version || "1"),
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
const READER_SITE_THEME_KEY = "loghome:reader:follow-site-theme";
function readerFollowsSiteTheme(storage) {
  try {
    const marker = storage.getItem(READER_SITE_THEME_KEY);
    if (marker === "1" || marker === "0") return marker === "1";
    return !storage.getItem(PREFERENCE_KEY) && !storage.getItem("reading_theme");
  } catch (_) {
    return true;
  }
}
function saveReaderThemeFollowing(storage, follows) {
  try {
    storage.setItem(READER_SITE_THEME_KEY, follows ? "1" : "0");
    return true;
  } catch (_) {
    return false;
  }
}

/***/ }),

/***/ 215:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return mangaPages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return mangaPageSource; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return readMangaPreferences; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return saveMangaPreferences; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return loadPublicManga; });
/* harmony import */ var _reader_world__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(173);

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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URL"]))

/***/ }),

/***/ 216:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(264);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("3ab6a2e4", content, true, context)
};

/***/ }),

/***/ 217:
/***/ (function(module) {

module.exports = JSON.parse("{\"white\":{\"backgroundColor\":\"#FEFEFC\",\"fontColor\":\"#292927\",\"secondaryFontColor\":\"#757571\",\"lineColor\":\"#656560\",\"isBlack\":false},\"green\":{\"backgroundColor\":\"#F5FAF4\",\"fontColor\":\"#395744\",\"secondaryFontColor\":\"#708572\",\"lineColor\":\"#4F7C5B\",\"isBlack\":false},\"yellow\":{\"backgroundColor\":\"#FCF8EF\",\"fontColor\":\"#5C4B3B\",\"secondaryFontColor\":\"#867565\",\"lineColor\":\"#9B6E3B\",\"isBlack\":false},\"blue\":{\"backgroundColor\":\"#F4FAFC\",\"fontColor\":\"#27566B\",\"secondaryFontColor\":\"#64808E\",\"lineColor\":\"#356F88\",\"isBlack\":false},\"purple\":{\"backgroundColor\":\"#FAF7FC\",\"fontColor\":\"#57445F\",\"secondaryFontColor\":\"#827387\",\"lineColor\":\"#765983\",\"isBlack\":false},\"pink\":{\"backgroundColor\":\"#FBF6F8\",\"fontColor\":\"#664858\",\"secondaryFontColor\":\"#8A707B\",\"lineColor\":\"#9D6578\",\"isBlack\":false},\"black\":{\"backgroundColor\":\"#22272E\",\"fontColor\":\"#D9DEE7\",\"secondaryFontColor\":\"#B5BECB\",\"lineColor\":\"#E6CDA6\",\"isBlack\":true},\"wavechaser\":{\"backgroundColor\":\"#E84F89\",\"fontColor\":\"#32101F\",\"secondaryFontColor\":\"#6B2844\",\"lineColor\":\"#7A1F48\",\"isBlack\":false},\"powderblue\":{\"backgroundColor\":\"#ACE5E2\",\"fontColor\":\"#244244\",\"secondaryFontColor\":\"#547477\",\"lineColor\":\"#387A7B\",\"isBlack\":false},\"qingyun\":{\"backgroundColor\":\"#313B3E\",\"fontColor\":\"#E7EEEF\",\"secondaryFontColor\":\"#B8C4C6\",\"lineColor\":\"#86D2D1\",\"isBlack\":true},\"sunburst\":{\"backgroundColor\":\"#FCD23C\",\"fontColor\":\"#493900\",\"secondaryFontColor\":\"#705A00\",\"lineColor\":\"#8C6500\",\"isBlack\":false},\"thorncrown\":{\"backgroundColor\":\"#7D2120\",\"fontColor\":\"#F6E8E5\",\"secondaryFontColor\":\"#D8B7B2\",\"lineColor\":\"#F1BA80\",\"isBlack\":true},\"chocolate\":{\"backgroundColor\":\"#380001\",\"fontColor\":\"#F4E7E1\",\"secondaryFontColor\":\"#CDB7AF\",\"lineColor\":\"#D5A26A\",\"isBlack\":true},\"blockepoch\":{\"backgroundColor\":\"#DCE3C2\",\"fontColor\":\"#273421\",\"secondaryFontColor\":\"#58684D\",\"lineColor\":\"#A6382C\",\"isBlack\":false}}");

/***/ }),

/***/ 218:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(267);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("2426c898", content, true, context)
};

/***/ }),

/***/ 219:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(269);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("112e4ff4", content, true, context)
};

/***/ }),

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(271);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("2c975779", content, true, context)
};

/***/ }),

/***/ 263:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaReaderImage_vue_vue_type_style_index_0_id_13417fc8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(216);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaReaderImage_vue_vue_type_style_index_0_id_13417fc8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaReaderImage_vue_vue_type_style_index_0_id_13417fc8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaReaderImage_vue_vue_type_style_index_0_id_13417fc8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaReaderImage_vue_vue_type_style_index_0_id_13417fc8_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 264:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-image[data-v-13417fc8] { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; user-select: none;\n}\n.zoom-img[data-v-13417fc8] { max-width: 100%; max-height: 100%; object-fit: contain; transform-origin: center center; will-change: transform; cursor: grab;\n}\n.reader-image:active .zoom-img[data-v-13417fc8] { cursor: grabbing;\n}\n.placeholder[data-v-13417fc8] { color: #999; font-size: 14px;\n}\n.image-state[data-v-13417fc8] { position:absolute; padding:12px 16px; border-radius:8px; background:#ffffffed; color:#80684e; font-size:13px;\n}\n.image-state button[data-v-13417fc8] { margin-left:8px; border:0; background:transparent; color:inherit; text-decoration:underline; cursor:pointer;\n}\n.reset-btn[data-v-13417fc8] { position: absolute; top: 16px; right: 16px; z-index: 2; padding: 6px 14px; border: none; border-radius: 16px; background: rgba(17, 17, 17, 0.8); color: #fff; font-size: 13px; cursor: pointer;\n}\n.reset-btn[data-v-13417fc8]:hover { background: rgba(17, 17, 17, 0.95);\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 265:
/***/ (function(module) {

module.exports = JSON.parse("{\"default\":{\"name\":\"系统默认\",\"family\":\"\",\"familyBold\":\"\",\"version\":\"1\"},\"方正书宋\":{\"name\":\"方正书宋\",\"family\":\"FangZhengShuSongJianTi\",\"familyBold\":\"FangZhengShuSongJianTi\",\"version\":\"20260318\",\"regular\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841456048\",\"format\":\"ttf\"},\"bold\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841456048\",\"format\":\"ttf\"}},\"思源黑体\":{\"name\":\"思源黑体\",\"family\":\"SourceHanSansSCRegular\",\"familyBold\":\"SourceHanSansSCBold\",\"version\":\"20260318\",\"regular\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841455677\",\"format\":\"otf\"},\"bold\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841453935\",\"format\":\"otf\"}},\"方正楷体\":{\"name\":\"方正楷体\",\"family\":\"FangZhengKaiTiJianTi\",\"familyBold\":\"FangZhengKaiTiJianTi\",\"version\":\"20260318\",\"regular\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841453504\",\"format\":\"ttf\"},\"bold\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841453504\",\"format\":\"ttf\"}},\"霞鹜文楷\":{\"name\":\"霞鹜文楷\",\"family\":\"LXGWWenKaiRegular\",\"familyBold\":\"LXGWWenKaiMedium\",\"version\":\"20260318\",\"regular\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841453453\",\"format\":\"ttf\"},\"bold\":{\"url\":\"https://storage.codesocean.top/api/resource/download/177381841454916\",\"format\":\"ttf\"}}}");

/***/ }),

/***/ 266:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderContent_vue_vue_type_style_index_0_id_a73249e0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(218);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderContent_vue_vue_type_style_index_0_id_a73249e0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderContent_vue_vue_type_style_index_0_id_a73249e0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderContent_vue_vue_type_style_index_0_id_a73249e0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderContent_vue_vue_type_style_index_0_id_a73249e0_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 267:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-highlight[data-v-a73249e0] { text-decoration: underline; text-decoration-color: #b19158; text-underline-offset: 5px;\n}.reader-speaking[data-v-a73249e0] { background: #e5ecd7; border-radius: 3px;\n}.vocabulary-card[data-v-a73249e0] { margin: 20px 0;\n}.vocabulary-image[data-v-a73249e0] { max-width: 100%; max-height: 420px; object-fit: contain; display: block; margin: 0 auto 24px; cursor: zoom-in;\n}dl[data-v-a73249e0] { display: grid; grid-template-columns: minmax(70px, 160px) minmax(0,1fr); gap: 12px; border: 1px solid #dfd5c9; border-radius: 8px; padding: 20px; font-size: .8em;\n}dt[data-v-a73249e0] { font-weight: 600;\n}dd[data-v-a73249e0] { white-space: pre-wrap; overflow-wrap: anywhere;\n}.vocabulary-relations[data-v-a73249e0] { border-top: 1px solid #dfd5c9; padding-top: 20px;\n}.vocabulary-relations h3[data-v-a73249e0] { font-size: .85em; margin-bottom: 14px;\n}.vocabulary-relations a[data-v-a73249e0] { display: inline-flex; gap: 10px; margin: 5px; padding: 7px 12px; border: 1px solid #dfd5c9; border-radius: 6px; font-size: .8em; color: inherit; text-decoration: none;\n}.vocabulary-relations small[data-v-a73249e0] { opacity: .65;\n}button[data-v-a73249e0]:focus-visible,a[data-v-a73249e0]:focus-visible { outline: 2px solid #947358;\n}\n.reader-content .paragraph-comment-icon[data-v-a73249e0] { display: inline-flex; align-items: center; justify-content: center; gap: 4px; height: 28px; padding: 4px 8px; margin-left: 8px; border: 1px solid transparent; border-radius: 6px; background: rgba(121, 87, 60, .08); color: var(--reader-secondary, #79573c); font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 12px; font-weight: 500; line-height: 1; font-variant-numeric: tabular-nums; white-space: nowrap; vertical-align: middle; cursor: pointer; text-indent: 0; transition: background-color .15s;\n}\n.paragraph-comment-icon .site-icon[data-v-a73249e0] { width: 16px; height: 16px;\n}\n.reader-content .paragraph-comment-icon[data-v-a73249e0]:hover { background: rgba(121, 87, 60, .16); color: inherit;\n}\n.reader-content .paragraph-comment-icon[data-v-a73249e0]:focus-visible { outline: 2px solid var(--reader-secondary, #79573c); outline-offset: 2px;\n}\n@media(prefers-reduced-motion:reduce) {\n.reader-content .paragraph-comment-icon[data-v-a73249e0] { transition: none;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 268:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPager_vue_vue_type_style_index_0_id_1bdf15ee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(219);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPager_vue_vue_type_style_index_0_id_1bdf15ee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPager_vue_vue_type_style_index_0_id_1bdf15ee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPager_vue_vue_type_style_index_0_id_1bdf15ee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPager_vue_vue_type_style_index_0_id_1bdf15ee_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 269:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-viewport[data-v-1bdf15ee] { width: calc(100% - 80px); margin: 0 auto;\n}.reader-prose[data-v-1bdf15ee] { padding: 28px 0 45px !important; margin: 0 auto; overflow-wrap: anywhere;\n}.is-paged .reader-viewport[data-v-1bdf15ee] { overflow: hidden;\n}.is-paged .reader-prose[data-v-1bdf15ee] { padding: 0 !important; margin: 0; column-fill: auto; will-change: transform;\n}.reader-prose[data-v-1bdf15ee] .article-paragraph { orphans: 2; widows: 2;\n}.is-paged .reader-prose[data-v-1bdf15ee] .vocabulary-image { max-height: calc(var(--reader-page-height) * .5);\n}.is-paged .reader-prose[data-v-1bdf15ee] .article-image { margin: 0 0 12px !important; break-inside: avoid; display: flex; justify-content: center;\n}\n.is-paged .reader-prose[data-v-1bdf15ee] .article-image img { max-height: calc(var(--reader-page-height) - 50px); max-width: 100% !important; object-fit: contain; display: block; margin: 0;\n}.page-navigation[data-v-1bdf15ee] { display: flex; align-items: center; justify-content: center; gap: 24px; padding: 22px 20px 8px;\n}button[data-v-1bdf15ee] { border: 1px solid #a7947b; border-radius: 5px; background: transparent; color: inherit; padding: 9px 18px; cursor: pointer; white-space: nowrap;\n}button[data-v-1bdf15ee]:disabled { opacity: .4; cursor: default;\n}.page-progress[data-v-1bdf15ee] { display: flex; gap: 10px; align-items: center; font-size: 12px;\n}.page-progress input[data-v-1bdf15ee] { width: 160px; accent-color: #947358;\n}.page-hint[data-v-1bdf15ee] { font-size: 11px; color: var(--reader-secondary); text-align: center; margin: 8px 15px 0; padding-bottom: 20px;\n}button[data-v-1bdf15ee]:focus-visible,input[data-v-1bdf15ee]:focus-visible { outline: 2px solid var(--reader-line); outline-offset: 2px;\n}@media(max-width:700px) {\n.reader-viewport[data-v-1bdf15ee] { width: calc(100% - 40px);\n}.page-navigation[data-v-1bdf15ee] { gap: 8px; padding: 16px 10px 8px;\n}.page-progress[data-v-1bdf15ee] { flex-direction: column; gap: 5px;\n}.page-progress input[data-v-1bdf15ee] { width: 100px;\n}button[data-v-1bdf15ee] { padding: 8px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 270:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderSettings_vue_vue_type_style_index_0_id_1368486d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(220);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderSettings_vue_vue_type_style_index_0_id_1368486d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderSettings_vue_vue_type_style_index_0_id_1368486d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderSettings_vue_vue_type_style_index_0_id_1368486d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderSettings_vue_vue_type_style_index_0_id_1368486d_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 271:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.reader-settings-shell[data-v-1368486d] { display: flex; flex-direction: column; flex: 1; min-height: 0; height: 100%; overflow: hidden;\n}\n.reader-settings[data-v-1368486d] { flex: 1; min-height: 0; padding: 0 24px 30px; overflow-y: auto; color: #433b35; font-size: 14px;\n}section[data-v-1368486d] { border-bottom: 1px solid #eae5df; padding-bottom: 22px; margin-bottom: 20px;\n}h3[data-v-1368486d] { font-size: 15px; display: flex; justify-content: space-between; align-items: center; margin: 5px 0 18px;\n}h3 small[data-v-1368486d] { font-weight: 400; font-size: 12px;\n}button[data-v-1368486d] { cursor: pointer; border: 1px solid #ded8cf; background: #fff; color: inherit; border-radius: 6px; padding: 8px 12px;\n}button[data-v-1368486d]:disabled { opacity: .5; cursor: default;\n}button[aria-pressed=\"true\"][data-v-1368486d] { border-color: #806649; box-shadow: inset 0 0 0 1px #806649;\n}.setting-row[data-v-1368486d] { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin: 14px 0;\n}.stepper[data-v-1368486d],.options[data-v-1368486d] { display: flex; align-items: center; gap: 6px;\n}output[data-v-1368486d] { font-variant-numeric: tabular-nums; font-size: 12px;\n}.stepper output[data-v-1368486d] { width: 58px; text-align: center;\n}.width-control[data-v-1368486d] { display: flex; align-items: center; gap: 10px; min-width: 0;\n}.width-control input[data-v-1368486d] { width: 130px; accent-color: #806649;\n}.font-grid[data-v-1368486d] { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px;\n}.font-grid button[data-v-1368486d] { display: flex; flex-direction: column; gap: 8px; text-align: left; padding: 12px;\n}.font-grid span[data-v-1368486d],small[data-v-1368486d] { color: #85776b; font-size: 12px;\n}.themes[data-v-1368486d] { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px;\n}.themes button[data-v-1368486d] { display: flex; justify-content: space-between; align-items: center; padding: 12px 8px;\n}.skin-grid[data-v-1368486d] { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px;\n}.skin-grid button[data-v-1368486d] { padding: 0 0 8px; overflow: hidden; min-width: 0;\n}.skin-preview[data-v-1368486d] { width: 100%; height: 65px; object-fit: cover;\n}.plain[data-v-1368486d] { display: flex; align-items: center; justify-content: center; font-size: 22px; color: #6a624c;\n}.skin-grid span[data-v-1368486d],.skin-grid small[data-v-1368486d] { display: block; font-size: 12px; margin: 5px 2px 0;\n}.refresh[data-v-1368486d] { border: 0; padding: 4px; background: none; color: #806649; font-size: 12px; text-decoration: underline;\n}.error[data-v-1368486d] { color: #a44735; font-size: 12px; line-height: 1.7; margin: 12px 0;\n}.reset[data-v-1368486d] { width: 100%;\n}button[data-v-1368486d]:focus-visible,input[data-v-1368486d]:focus-visible { outline: 2px solid #806649; outline-offset: 2px;\n}@media(max-width:400px) {\n.reader-settings[data-v-1368486d] { padding: 0 14px 24px;\n}.themes[data-v-1368486d] { grid-template-columns: repeat(2,minmax(0,1fr));\n}.width-control input[data-v-1368486d] { width: 95px;\n}\n}\n.settings-feedback[data-v-1368486d] { flex: none; display: flex; align-items: center; gap: 12px; padding: 16px 24px calc(16px + env(safe-area-inset-bottom, 0px)); border-top: 1px solid var(--reading-line, #e4e3de); background: var(--reading-hover, #f5f4f0); color: var(--reading-ink, #302f2a);\n}\n.settings-feedback > i[data-v-1368486d] { align-self: flex-start; margin-top: 2px; color: var(--reading-accent, #79573c); font-size: 17px;\n}\n.feedback-copy[data-v-1368486d] { flex: 1; min-width: 0;\n}\n.feedback-copy strong[data-v-1368486d] { display: block; margin-bottom: 4px; font-size: 13px; font-weight: 600;\n}\n.feedback-copy p[data-v-1368486d] { margin: 0; color: var(--reading-secondary, #615e57); font-size: 12px; line-height: 1.7; overflow-wrap: anywhere;\n}\n.membership-action[data-v-1368486d] { flex: none; min-height: 38px; padding: 8px 12px; border-color: var(--reading-line, #e4e3de); color: var(--reading-accent, #79573c); font: inherit; font-size: 13px; white-space: nowrap;\n}\n.membership-action[data-v-1368486d]:hover { border-color: var(--reading-accent, #79573c); background: var(--reading-surface, #fff);\n}\n@media(max-width:400px) {\n.settings-feedback[data-v-1368486d] { padding-left: 14px; padding-right: 14px; gap: 8px;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 281:
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
var SiteIcon = __webpack_require__(150);

// EXTERNAL MODULE: ./utils/reader-paragraphs.js
var reader_paragraphs = __webpack_require__(45);

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
  
  var style0 = __webpack_require__(266)
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
var reader_position = __webpack_require__(192);

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
  
  var style0 = __webpack_require__(268)
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

/***/ 291:
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
var manga_content = __webpack_require__(215);

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
  
  var style0 = __webpack_require__(263)
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

/***/ 292:
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
var reader_preferences = __webpack_require__(201);

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
      return reader_preferences["q" /* themes */][this.value.theme] || reader_preferences["q" /* themes */].white;
    },
    options() {
      return Object.keys(reader_preferences["q" /* themes */]).filter(key => key !== 'blockepoch').map(key => ({
        key,
        name: reader_preferences["c" /* THEME_NAMES */][key],
        ...reader_preferences["q" /* themes */][key],
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
  
  var style0 = __webpack_require__(270)
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

/***/ 296:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reader-preferences.js
var reader_preferences = __webpack_require__(201);

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
  const url = Object(reader_preferences["n" /* safeFontUrl */])(asset && asset.url);
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
      readerUsesSiteTheme: false,
      readerFonts: Object(reader_preferences["k" /* readerFonts */])(),
      readerSkins: [],
      readerTier: "",
      readerResourcesLoading: false,
      readerResourceError: "",
      readerFontError: "",
      readerFontStates: {},
      readerFontFamily: "",
      readerLockedMessage: "",
      readerStorageError: false,
      readerResourceVersion: 0,
      readerFontVersion: 0,
      readerPreferenceRevision: 0
    };
  },
  computed: {
    readerTheme() {
      return reader_preferences["q" /* themes */][this.readerPreferences.theme] || reader_preferences["q" /* themes */].white;
    },
    readerNightMode() {
      return Object(reader_preferences["l" /* readerThemeMode */])(this.readerPreferences) === "dark";
    },
    currentReaderSkin() {
      return this.readerSkins.find(skin => skin.skin_key === this.readerPreferences.backgroundSkinKey && !skin.is_locked) || null;
    },
    readerAppearance() {
      const skinStyle = createBackgroundSkinStyle(this.currentReaderSkin);
      if (this.currentReaderSkin && ["obsidian_orbit", "ember_library"].includes(this.currentReaderSkin.skin_key)) skinStyle.backgroundSize = "100% 100%";
      return {
        backgroundColor: this.readerTheme.backgroundColor,
        color: this.readerTheme.fontColor,
        "--reader-secondary": this.readerTheme.secondaryFontColor,
        "--reader-line": this.readerTheme.lineColor,
        ...skinStyle
      };
    },
    readerTypography() {
      const system = '"PingFang SC", "Helvetica Neue", "Microsoft YaHei", Arial, sans-serif';
      const font = this.readerPreferences.font;
      const family = font === "serif" ? '"Songti SC", SimSun, serif' : font === "sans-serif" ? '"Heiti SC", "Microsoft YaHei", sans-serif' : this.readerFontFamily ? `"${this.readerFontFamily}", ${system}` : system;
      return {
        fontSize: `${this.readerPreferences.fontSize}px`,
        lineHeight: this.readerPreferences.lineHeight,
        fontFamily: family,
        maxWidth: `${this.readerPreferences.width}px`
      };
    }
  },
  watch: {
    "$theme.resolved"() {
      this.applySiteReaderTheme();
    }
  },
  mounted() {
    const restored = Object(reader_preferences["h" /* readPreferences */])({
      getItem: key => window.localStorage.getItem(key)
    });
    this.readerPreferences = {
      ...restored,
      theme: reader_preferences["b" /* MEMBER_THEMES */].includes(restored.theme) || restored.theme === "blockepoch" ? "white" : restored.theme,
      backgroundSkinKey: ""
    };
    this.readerUsesSiteTheme = Object(reader_preferences["j" /* readerFollowsSiteTheme */])(window.localStorage);
    this.applySiteReaderTheme();
    this.refreshReaderResources(this.readerUsesSiteTheme ? {
      ...restored,
      theme: this.readerPreferences.theme
    } : restored);
    window.addEventListener("focus", this.onReaderAccountFocus);
    window.addEventListener("storage", this.onReaderStorage);
    window.addEventListener("auth-state-changed", this.onReaderAccountFocus);
  },
  beforeDestroy() {
    this.readerResourceVersion++;
    this.readerFontVersion++;
    window.removeEventListener("focus", this.onReaderAccountFocus);
    window.removeEventListener("storage", this.onReaderStorage);
    window.removeEventListener("auth-state-changed", this.onReaderAccountFocus);
  },
  methods: {
    applySiteReaderTheme() {
      if (!this.readerUsesSiteTheme || !this.$theme) return;
      this.readerPreferences = {
        ...this.readerPreferences,
        theme: this.$theme.resolved === "dark" ? "black" : "white",
        backgroundSkinKey: ""
      };
    },
    onReaderStorage(event) {
      if (event.key === "token") this.refreshReaderResources();
    },
    onReaderAccountFocus() {
      this.refreshReaderResources();
    },
    async refreshReaderResources(restored) {
      const version = ++this.readerResourceVersion,
        token = Object(reading["c" /* readingToken */])(),
        revision = this.readerPreferenceRevision;
      const wanted = restored && typeof restored === "object" && !restored.type ? restored : {
        ...this.readerPreferences
      };
      this.readerTier = "";
      this.readerResourcesLoading = true;
      this.readerResourceError = "";
      this.readerLockedMessage = "";
      // Until the new account's permission is known, protected appearances are not rendered.
      if (reader_preferences["b" /* MEMBER_THEMES */].includes(this.readerPreferences.theme) || this.readerPreferences.theme === "blockepoch") this.readerPreferences = {
        ...this.readerPreferences,
        theme: "white"
      };
      this.readerSkins = this.readerSkins.map(skin => ({
        ...skin,
        is_locked: !Object(reader_preferences["d" /* canUseBackground */])(skin.required_membership, "")
      }));
      const results = await Promise.allSettled([this.$api.reader.fonts(), this.$api.reader.backgrounds(), token ? this.$api.reader.membership() : Promise.resolve(null)]);
      if (version !== this.readerResourceVersion) return;
      if (token !== Object(reading["c" /* readingToken */])()) return this.refreshReaderResources();
      const [fontResult, skinResult, memberResult] = results;
      this.readerTier = memberResult.status === "fulfilled" ? Object(reader_preferences["f" /* membershipTier */])(memberResult.value) : "";
      if (fontResult.status === "fulfilled" && Array.isArray(fontResult.value)) this.readerFonts = Object(reader_preferences["k" /* readerFonts */])(fontResult.value);
      if (skinResult.status === "fulfilled" && Array.isArray(skinResult.value)) this.readerSkins = skinResult.value.map(skin => normalizeBackgroundSkin({
        ...skin,
        is_locked: !Object(reader_preferences["d" /* canUseBackground */])(skin.required_membership, this.readerTier)
      }, key => Boolean(reader_preferences["q" /* themes */][key]))).filter(Boolean);else this.readerSkins = [];
      const failures = [];
      if (fontResult.status === "rejected") failures.push("字体配置暂不可用，使用内置配置。");
      if (skinResult.status === "rejected") failures.push("背景配置加载失败，请刷新重试。");
      if (memberResult.status === "rejected") failures.push("通行证权限暂不可用，请刷新重试。");
      this.readerResourceError = failures.join(" ");
      this.readerResourcesLoading = false;
      const next = Object(reader_preferences["g" /* normalizePreferences */])(revision === this.readerPreferenceRevision ? wanted : this.readerPreferences);
      if (reader_preferences["b" /* MEMBER_THEMES */].includes(next.theme) && !Object(reader_preferences["d" /* canUseBackground */])("standard", this.readerTier)) next.theme = "white";
      const selectedSkin = this.readerSkins.find(skin => skin.skin_key === next.backgroundSkinKey && !skin.is_locked);
      if (selectedSkin) next.theme = selectedSkin.theme_key;else {
        next.backgroundSkinKey = "";
        if (next.theme === "blockepoch") next.theme = "white";
      }
      if (!this.readerFonts[next.font] && !["serif", "sans-serif"].includes(next.font)) next.font = "default";
      this.readerPreferences = next;
      this.applySiteReaderTheme();
      // Failed configuration requests should not erase a saved appearance for the next online visit.
      if (!failures.length) this.persistReaderPreferences();
      await this.selectReaderFont(next.font, false);
    },
    persistReaderPreferences() {
      const storage = {
        getItem: key => window.localStorage.getItem(key),
        setItem: (key, value) => window.localStorage.setItem(key, value)
      };
      const followed = Object(reader_preferences["p" /* saveReaderThemeFollowing */])(storage, this.readerUsesSiteTheme);
      const saved = Object(reader_preferences["o" /* savePreferences */])(storage, this.readerPreferences),
        remembered = Object(reader_preferences["m" /* rememberReaderTheme */])(storage, this.readerPreferences);
      this.readerStorageError = !saved || !remembered || !followed;
    },
    toggleReaderNightMode() {
      const storage = {
        getItem: key => window.localStorage.getItem(key),
        setItem: (key, value) => window.localStorage.setItem(key, value)
      };
      Object(reader_preferences["m" /* rememberReaderTheme */])(storage, this.readerPreferences);
      const mode = this.readerNightMode ? "light" : "dark",
        selection = Object(reader_preferences["i" /* readReaderTheme */])(storage, mode);
      let skin = selection.backgroundSkinKey && this.readerSkins.find(item => item.skin_key === selection.backgroundSkinKey && !item.is_locked && Object(reader_preferences["d" /* canUseBackground */])(item.required_membership, this.readerTier));
      if (skin && Object(reader_preferences["l" /* readerThemeMode */])({
        theme: skin.theme_key
      }) !== mode) skin = null;
      if (skin) selection.theme = skin.theme_key;else selection.backgroundSkinKey = "";
      if (selection.theme === "blockepoch" && !skin || reader_preferences["b" /* MEMBER_THEMES */].includes(selection.theme) && !Object(reader_preferences["d" /* canUseBackground */])("standard", this.readerTier)) selection.theme = mode === "dark" ? "black" : "white";
      this.readerLockedMessage = "";
      this.changeReaderPreferences({
        ...this.readerPreferences,
        ...selection
      });
    },
    changeReaderPreferences(value) {
      if (value.theme !== this.readerPreferences.theme || value.backgroundSkinKey !== this.readerPreferences.backgroundSkinKey) this.readerUsesSiteTheme = false;
      this.readerPreferenceRevision++;
      this.readerPreferences = Object(reader_preferences["g" /* normalizePreferences */])(value);
      this.persistReaderPreferences();
    },
    selectReaderTheme(key) {
      if (!reader_preferences["q" /* themes */][key] || key === "blockepoch") return;
      if (reader_preferences["b" /* MEMBER_THEMES */].includes(key) && !Object(reader_preferences["d" /* canUseBackground */])("standard", this.readerTier)) return this.explainReaderLock("standard");
      this.readerLockedMessage = "";
      this.changeReaderPreferences({
        ...this.readerPreferences,
        theme: key,
        backgroundSkinKey: ""
      });
    },
    selectReaderSkin(key) {
      const skin = this.readerSkins.find(item => item.skin_key === key);
      if (key && !skin) return;
      if (skin && skin.is_locked) return this.explainReaderLock(skin.required_membership);
      this.readerLockedMessage = "";
      this.changeReaderPreferences({
        ...this.readerPreferences,
        backgroundSkinKey: skin ? key : "",
        theme: skin ? skin.theme_key : this.readerPreferences.theme === "blockepoch" ? "white" : this.readerPreferences.theme
      });
    },
    explainReaderLock(tier) {
      this.readerLockedMessage = tier === "super" ? "此背景需要有效的超级原木通行证。" : "此背景需要有效的原木通行证或超级原木通行证。";
    },
    async selectReaderFont(key, persist = true) {
      const version = ++this.readerFontVersion;
      this.readerFontError = "";
      if (key === "default" || ["serif", "sans-serif"].includes(key)) {
        this.readerFontFamily = "";
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
      this.$set(this.readerFontStates, key, "loading");
      try {
        const family = await loadReaderFont(key, config);
        this.$set(this.readerFontStates, key, "ready");
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
        this.$set(this.readerFontStates, key, "failed");
        if (version !== this.readerFontVersion) return;
        this.readerFontError = error.message;
        if (!persist) {
          this.readerFontFamily = "";
          this.readerPreferences = {
            ...this.readerPreferences,
            font: "default"
          };
        }
      }
    },
    resetReaderPreferences() {
      this.readerFontVersion++;
      this.readerPreferenceRevision++;
      this.readerFontFamily = "";
      this.readerFontError = "";
      this.readerLockedMessage = "";
      this.readerPreferences = {
        ...reader_preferences["a" /* DEFAULT_PREFERENCES */]
      };
      this.readerUsesSiteTheme = true;
      this.applySiteReaderTheme();
      this.persistReaderPreferences();
    },
    openReaderMembership() {
      this.$openMobileWindow("/pages/membership/index", {
        title: "原木通行证"
      });
    }
  }
});

/***/ }),

/***/ 355:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(502);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("045c06d3", content, true, context)
};

/***/ }),

/***/ 356:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(504);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("fcc03f10", content, true, context)
};

/***/ }),

/***/ 500:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(URL) {/* unused harmony export PREVIEW_PREFIX */
/* unused harmony export PREVIEW_MAX_AGE */
/* unused harmony export normalizePreview */
/* unused harmony export clearExpiredPreviews */
/* unused harmony export storeReaderPreview */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return readReaderPreview; });
/* unused harmony export trustedPreviewMessage */
/* harmony import */ var _reading_history__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41);

const PREVIEW_PREFIX = 'loghome:reader:preview:';
const PREVIEW_MAX_AGE = 24 * 60 * 60 * 1000;
const MAX_BYTES = 8 * 1024 * 1024;
function normalizePreview(value) {
  if (!value || !value.article || typeof value.article !== 'object' || !value.novel || typeof value.novel !== 'object') throw new Error('预览数据不完整');
  const article = JSON.parse(JSON.stringify(value.article)),
    novel = JSON.parse(JSON.stringify(value.novel));
  if (!Number.isSafeInteger(Number(article.article_id)) || !(Number(article.article_id) > 0) || !Number.isSafeInteger(Number(novel.novel_id)) || !(Number(novel.novel_id) > 0) || Number(article.novel_id) !== Number(novel.novel_id) || !['richtext', 'text', 'worldOutline', 'worldVocabulary', 'mangaPage', 'mangaStrip'].includes(article.article_type)) throw new Error('预览章节不属于当前作品或类型不支持');
  if (typeof article.content !== 'string' && !Array.isArray(article.content) && (!article.content || typeof article.content !== 'object')) throw new Error('预览正文不完整');
  if (JSON.stringify({
    article,
    novel
  }).length > MAX_BYTES) throw new Error('预览内容过大');
  article.is_draft = 1;
  return {
    article,
    novel
  };
}
function clearExpiredPreviews(storage, now = Date.now()) {
  for (let i = storage.length - 1; i >= 0; i--) {
    const key = storage.key(i);
    if (!key || !key.startsWith(PREVIEW_PREFIX)) continue;
    try {
      const value = JSON.parse(storage.getItem(key));
      if (!value || value.version !== 1 || !Number.isFinite(value.createdAt) || value.createdAt > now + 60000 || now - value.createdAt > PREVIEW_MAX_AGE) storage.removeItem(key);
    } catch (_) {
      storage.removeItem(key);
    }
  }
}
function storeReaderPreview(value, environment = {}) {
  const storage = environment.storage || window.localStorage,
    now = environment.now == null ? Date.now() : environment.now;
  const preview = normalizePreview(value);
  const key = environment.key || (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : `${now.toString(36)}_${Math.random().toString(36).slice(2)}`);
  clearExpiredPreviews(storage, now);
  storage.setItem(PREVIEW_PREFIX + key, JSON.stringify({
    ...preview,
    version: 1,
    createdAt: now,
    account: environment.account || Object(_reading_history__WEBPACK_IMPORTED_MODULE_0__[/* readingAccountKey */ "c"])()
  }));
  return key;
}
function readReaderPreview(key, environment = {}) {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(String(key || ''))) return null;
  const storage = environment.storage || window.localStorage,
    now = environment.now == null ? Date.now() : environment.now;
  try {
    const value = JSON.parse(storage.getItem(PREVIEW_PREFIX + key) || 'null');
    if (!value || value.version !== 1 || !Number.isFinite(value.createdAt) || value.createdAt > now + 60000 || now - value.createdAt > PREVIEW_MAX_AGE) {
      storage.removeItem(PREVIEW_PREFIX + key);
      return null;
    }
    if (value.account !== (environment.account || Object(_reading_history__WEBPACK_IMPORTED_MODULE_0__[/* readingAccountKey */ "c"])())) return null;
    return {
      ...normalizePreview(value),
      createdAt: value.createdAt,
      account: value.account
    };
  } catch (_) {
    return null;
  }
}
// Only the current editor frame at the configured origin can submit a draft.
function trustedPreviewMessage(event, frameWindow, mobileUrl, workId) {
  if (!event || event.source !== frameWindow || !frameWindow || !event.data || event.data.type !== 'reader_preview' || event.data.source !== 'chapterEditor') return null;
  try {
    if (event.origin !== new URL(mobileUrl).origin) return null;
    const preview = normalizePreview(event.data.data);
    return Number(preview.novel.novel_id) === Number(workId) ? preview : null;
  } catch (_) {
    return null;
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)["URL"]))

/***/ }),

/***/ 501:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaDraftPreview_vue_vue_type_style_index_0_id_a0e566a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(355);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaDraftPreview_vue_vue_type_style_index_0_id_a0e566a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaDraftPreview_vue_vue_type_style_index_0_id_a0e566a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaDraftPreview_vue_vue_type_style_index_0_id_a0e566a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_MangaDraftPreview_vue_vue_type_style_index_0_id_a0e566a2_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 502:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".manga-draft[data-v-a0e566a2]{background:#fff;color:#765f48}.draft-warm[data-v-a0e566a2]{background:#f6efdf}.draft-black[data-v-a0e566a2]{background:#111315;color:#d7d1c9}.manga-draft header[data-v-a0e566a2]{display:flex;align-items:center;gap:16px;padding:14px 20px;border-bottom:1px solid #e5ddcf}.manga-draft header>div[data-v-a0e566a2]{flex:1}.manga-draft strong[data-v-a0e566a2]{font-size:17px}.manga-draft small[data-v-a0e566a2]{display:block;font-size:11px;margin-top:8px;color:#a2937f}.manga-draft button[data-v-a0e566a2]{border:1px solid #ddd3c6;border-radius:6px;background:#fff;color:#80684e;cursor:pointer;padding:8px 14px;font:inherit;font-size:12px}.draft-settings[data-v-a0e566a2]{display:flex;gap:18px;flex-wrap:wrap;align-items:center;padding:15px 20px;font-size:12px}.draft-settings select[data-v-a0e566a2],footer input[data-v-a0e566a2]{font:inherit;color:#80684e;border:1px solid #ddd3c6;border-radius:5px;background:#fff;padding:6px;margin-left:6px}footer input[data-v-a0e566a2]{width:60px}.draft-strip[data-v-a0e566a2]{height:65vh;overflow:auto;position:relative}.draft-strip-page[data-v-a0e566a2]{max-width:900px;margin:auto;position:relative}.draft-strip-page img[data-v-a0e566a2]{display:block;width:100%;height:auto}.draft-strip-page button[data-v-a0e566a2]{position:absolute;right:10px;top:10px;background:#fffe}.draft-paged[data-v-a0e566a2]{display:flex;height:65vh;min-height:300px}.draft-paged>button[data-v-a0e566a2]{border:0;background:transparent;font-size:36px;flex:none;width:55px}.manga-draft footer[data-v-a0e566a2]{display:flex;gap:24px;align-items:center;padding:16px 20px;font-size:12px}.manga-draft footer>span[data-v-a0e566a2]:last-child{margin-left:auto;color:#a2937f}.empty[data-v-a0e566a2]{text-align:center;padding:80px}.draft-image-dialog[data-v-a0e566a2]{height:76vh}.manga-draft button[data-v-a0e566a2]:disabled{opacity:.3;cursor:default}.manga-draft button[data-v-a0e566a2]:focus-visible{outline:2px solid #947358}@media(max-width:700px){.draft-settings[data-v-a0e566a2]{gap:10px}.manga-draft footer[data-v-a0e566a2]{flex-wrap:wrap;gap:12px}.manga-draft footer>span[data-v-a0e566a2]:last-child{margin-left:0}}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 503:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPreview_vue_vue_type_style_index_0_id_ba0fb2ae_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(356);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPreview_vue_vue_type_style_index_0_id_ba0fb2ae_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPreview_vue_vue_type_style_index_0_id_ba0fb2ae_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPreview_vue_vue_type_style_index_0_id_ba0fb2ae_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ReaderPreview_vue_vue_type_style_index_0_id_ba0fb2ae_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 504:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.preview-reader[data-v-ba0fb2ae] { background: #f5f5f5; min-height: 100vh; color: #4c453c;\n}.preview-toolbar[data-v-ba0fb2ae] { display: flex; align-items: center; gap: 16px; padding: 16px 28px; background: #fff; border-bottom: 1px solid #e5ded4; position: sticky; top: 0; z-index: 5;\n}.preview-toolbar span[data-v-ba0fb2ae] { color: #9a8771; font-size: 13px; flex: 1;\n}.preview-body[data-v-ba0fb2ae] { max-width: 1200px; margin: 24px auto; padding-bottom: 100px;\n}.preview-title[data-v-ba0fb2ae] { text-align: center; padding: 22px 20px;\n}.preview-title h1[data-v-ba0fb2ae] { font-size: 26px;\n}.preview-title p[data-v-ba0fb2ae] { color: var(--reader-secondary); font-size: 13px; margin: 15px 0;\n}button[data-v-ba0fb2ae] { padding: 8px 14px; border: 1px solid #d2c4b2; background: #fff; color: #80644a; border-radius: 5px; margin: 0 4px; cursor: pointer;\n}button[data-v-ba0fb2ae]:focus-visible { outline: 2px solid #947358;\n}.preview-error[data-v-ba0fb2ae] { padding: 70px 25px; text-align: center;\n}.preview-body[data-v-ba0fb2ae] .article-paragraph { margin: 0 0 1.2em; white-space: pre-wrap;\n}.preview-body[data-v-ba0fb2ae] .article-image { text-align: center;\n}.preview-body[data-v-ba0fb2ae] .article-image img { max-width: 100%;\n}@media(max-width:700px) {\n.preview-toolbar[data-v-ba0fb2ae] { padding: 14px; gap: 8px; flex-wrap: wrap;\n}.preview-toolbar span[data-v-ba0fb2ae] { font-size: 11px;\n}.preview-body[data-v-ba0fb2ae] { margin: 12px auto;\n}\n}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 553:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/preview/_key.vue?vue&type=template&id=d4d98452
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('ReaderPreview', {
    key: _vm.$route.params.key,
    attrs: {
      "preview-key": _vm.$route.params.key
    },
    on: {
      "close": _vm.returnToEditor
    }
  });
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/read/preview/_key.vue?vue&type=template&id=d4d98452

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderPreview.vue?vue&type=template&id=ba0fb2ae&scoped=true
var ReaderPreviewvue_type_template_id_ba0fb2ae_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "preview-reader"
  }, [_vm._ssrNode("<header class=\"preview-toolbar\" data-v-ba0fb2ae><strong data-v-ba0fb2ae>阅读预览</strong><span data-v-ba0fb2ae>未保存草稿 · 仅本机可见</span><button data-v-ba0fb2ae>返回编辑器</button></header> "), _vm.failure ? _vm._ssrNode("<div role=\"alert\" class=\"preview-error\" data-v-ba0fb2ae>", "</div>", [_vm._ssrNode("<h2 data-v-ba0fb2ae>预览已失效</h2><p data-v-ba0fb2ae>" + _vm._ssrEscape(_vm._s(_vm.failure)) + "</p><button data-v-ba0fb2ae>返回编辑器重新预览</button>")], 2) : _vm.payload ? [_vm.isManga ? _c('MangaDraftPreview', {
    attrs: {
      "article": _vm.payload.article,
      "novel-name": _vm.payload.novel.name
    },
    on: {
      "close": function ($event) {
        return _vm.$emit('close');
      }
    }
  }) : _c('div', {
    staticClass: "preview-body",
    style: _vm.readerAppearance
  }, [_c('div', {
    staticClass: "preview-title"
  }, [_c('h1', [_vm._v(_vm._s(_vm.payload.article.title))]), _c('p', [_vm._v(_vm._s(_vm.payload.novel.name) + " · 不计阅读量、经验或阅读进度")]), _c('button', {
    on: {
      "click": function ($event) {
        _vm.settingsVisible = true;
      }
    }
  }, [_vm._v("阅读设置")]), _c('button', {
    on: {
      "click": _vm.listen
    }
  }, [_vm._v("听书预览")])]), _vm._v(" "), _c('ReaderPager', {
    ref: "pager",
    attrs: {
      "article": _vm.payload.article,
      "typography": _vm.readerTypography,
      "paged": _vm.ready && _vm.readerPreferences.mode === 'page',
      "initial-position": {},
      "navigation-blocked": _vm.settingsVisible,
      "speaking-id": _vm.audioState.paragraphId,
      "chapter-percent": 100
    }
  })], 1), _vm._ssrNode(" "), !_vm.isManga && _vm.settingsVisible ? _c('ReaderSettings', {
    attrs: {
      "visible": _vm.settingsVisible,
      "value": _vm.readerPreferences,
      "fonts": _vm.readerFonts,
      "font-states": _vm.readerFontStates,
      "skins": _vm.readerSkins,
      "tier": _vm.readerTier,
      "resources-loading": _vm.readerResourcesLoading,
      "resource-error": _vm.readerResourceError,
      "font-error": _vm.readerFontError,
      "locked-message": _vm.readerLockedMessage,
      "storage-error": _vm.readerStorageError
    },
    on: {
      "update:visible": function ($event) {
        _vm.settingsVisible = $event;
      },
      "input": _vm.changeReaderPreferences,
      "theme": _vm.selectReaderTheme,
      "membership": _vm.openReaderMembership,
      "reset": _vm.resetReaderPreferences,
      "font": _vm.selectReaderFont,
      "skin": _vm.selectReaderSkin,
      "refresh": _vm.refreshReaderResources
    }
  }) : _vm._e(), _vm._ssrNode(" "), _vm.player ? _c('ReaderAudioPlayer', {
    attrs: {
      "controller": _vm.player,
      "private-playback": ""
    }
  }) : _vm._e()] : _vm._ssrNode("<p role=\"status\" class=\"preview-error\" data-v-ba0fb2ae>正在加载本机预览…</p>")], 2);
};
var ReaderPreviewvue_type_template_id_ba0fb2ae_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/ReaderPreview.vue?vue&type=template&id=ba0fb2ae&scoped=true

// EXTERNAL MODULE: ./utils/reader-preview.js
var reader_preview = __webpack_require__(500);

// EXTERNAL MODULE: ./plugins/api/reading.js
var reading = __webpack_require__(1);

// EXTERNAL MODULE: ./utils/reader-audio.js
var reader_audio = __webpack_require__(53);

// EXTERNAL MODULE: ./mixins/reader-preferences.js + 2 modules
var reader_preferences = __webpack_require__(296);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaDraftPreview.vue?vue&type=template&id=a0e566a2&scoped=true
var MangaDraftPreviewvue_type_template_id_a0e566a2_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "manga-draft",
    class: `draft-${_vm.background}`
  }, [_vm._ssrNode("<header data-v-a0e566a2><div data-v-a0e566a2><strong data-v-a0e566a2>" + _vm._ssrEscape(_vm._s(_vm.article.title || '漫画草稿')) + "</strong><small data-v-a0e566a2>" + _vm._ssrEscape(_vm._s(_vm.novelName) + " · 未保存草稿 · 不计阅读进度或经验") + "</small></div><button data-v-a0e566a2>返回编辑器</button></header>"), _vm._ssrNode("<div class=\"draft-settings\" data-v-a0e566a2>", "</div>", [_vm._ssrNode("<label data-v-a0e566a2>", "</label>", [_vm._ssrNode("阅读方式 "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.mode,
      expression: "mode"
    }],
    on: {
      "change": [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.mode = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.changeMode]
    }
  }, [_c('option', {
    attrs: {
      "value": "strip"
    }
  }, [_vm._v("上下滚动")]), _c('option', {
    attrs: {
      "value": "paged"
    }
  }, [_vm._v("左右翻页")])])], 2), _vm._ssrNode("<label data-v-a0e566a2>", "</label>", [_vm._ssrNode("翻页方向 "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.direction,
      expression: "direction"
    }],
    on: {
      "change": [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.direction = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.save]
    }
  }, [_c('option', {
    attrs: {
      "value": "ltr"
    }
  }, [_vm._v("从左到右")]), _c('option', {
    attrs: {
      "value": "rtl"
    }
  }, [_vm._v("从右到左")])])], 2), _vm._ssrNode("<label data-v-a0e566a2>", "</label>", [_vm._ssrNode("背景 "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.background,
      expression: "background"
    }],
    on: {
      "change": [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.background = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.save]
    }
  }, [_c('option', {
    attrs: {
      "value": "white"
    }
  }, [_vm._v("白色")]), _c('option', {
    attrs: {
      "value": "warm"
    }
  }, [_vm._v("暖色")]), _c('option', {
    attrs: {
      "value": "black"
    }
  }, [_vm._v("黑色")])])], 2), _vm._ssrNode("<label data-v-a0e566a2>", "</label>", [_vm._ssrNode("图片清晰度 "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.quality,
      expression: "quality"
    }],
    on: {
      "change": [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.quality = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.save]
    }
  }, [_c('option', {
    attrs: {
      "value": "standard"
    }
  }, [_vm._v("流畅")]), _c('option', {
    attrs: {
      "value": "original"
    }
  }, [_vm._v("原图")])])], 2), _vm._ssrNode(_vm.storageError ? "<span role=\"alert\" data-v-a0e566a2>偏好未能保存</span>" : "<!---->")], 2), _vm._ssrNode(" "), !_vm.pages.length ? _vm._ssrNode("<p class=\"empty\" data-v-a0e566a2>", "</p>", [_vm._ssrNode("当前草稿尚无漫画页面。")], 2) : [_vm.mode === 'strip' ? _vm._ssrNode("<div class=\"draft-strip\" data-v-a0e566a2>", "</div>", [_vm._ssrNode(_vm._ssrList(_vm.pages, function (page, index) {
    return "<div class=\"draft-strip-page\"" + _vm._ssrStyle(null, {
      aspectRatio: page.width && page.height ? `${page.width}/${page.height}` : undefined
    }, null) + " data-v-a0e566a2>" + (_vm.source(page) ? "<img" + _vm._ssrAttr("src", _vm.source(page)) + _vm._ssrAttr("alt", `第 ${index + 1} 页`) + " loading=\"lazy\" data-v-a0e566a2>" : "<p data-v-a0e566a2>" + _vm._ssrEscape("第 " + _vm._s(index + 1) + " 页图片资料不可用") + "</p>") + (_vm.source(page) ? "<button" + _vm._ssrAttr("aria-label", `放大第 ${index + 1} 页`) + " data-v-a0e566a2>放大</button>" : "<!---->") + "</div>";
  }))], 2) : _vm._ssrNode("<div class=\"draft-paged\" data-v-a0e566a2>", "</div>", [_vm._ssrNode("<button" + _vm._ssrAttr("disabled", _vm.direction === 'rtl' ? _vm.index >= _vm.pages.length - 1 : _vm.index === 0) + _vm._ssrAttr("aria-label", _vm.direction === 'rtl' ? '下一页' : '上一页') + " data-v-a0e566a2>‹</button>"), _c('MangaReaderImage', {
    key: _vm.index,
    attrs: {
      "src": _vm.source(_vm.pages[_vm.index]),
      "alt": `第 ${_vm.index + 1} 页`
    },
    on: {
      "interaction": function ($event) {
        _vm.zoomed = $event;
      }
    }
  }), _vm._ssrNode("<button" + _vm._ssrAttr("disabled", _vm.direction === 'rtl' ? _vm.index === 0 : _vm.index >= _vm.pages.length - 1) + _vm._ssrAttr("aria-label", _vm.direction === 'rtl' ? '上一页' : '下一页') + " data-v-a0e566a2>›</button>")], 2), _vm._ssrNode("<footer data-v-a0e566a2><label data-v-a0e566a2>页码 <input type=\"number\" min=\"1\"" + _vm._ssrAttr("max", _vm.pages.length) + _vm._ssrAttr("value", _vm.pageNumber) + " data-v-a0e566a2></label><span data-v-a0e566a2>" + _vm._ssrEscape(_vm._s(_vm.index + 1) + " / " + _vm._s(_vm.pages.length) + " 页") + "</span><span data-v-a0e566a2>滚轮缩放，双击放大，拖动查看</span></footer>")], _vm._ssrNode(" "), _c('el-dialog', {
    attrs: {
      "visible": _vm.openImage !== null,
      "title": "漫画草稿 · 图片预览",
      "width": "94vw",
      "top": "3vh",
      "append-to-body": ""
    },
    on: {
      "update:visible": function ($event) {
        _vm.openImage = null;
      }
    }
  }, [_c('div', {
    staticClass: "draft-image-dialog"
  }, [_vm.openImage !== null ? _c('MangaReaderImage', {
    attrs: {
      "src": _vm.source(_vm.pages[_vm.openImage]),
      "alt": `第 ${_vm.openImage + 1} 页`
    }
  }) : _vm._e()], 1)])], 2);
};
var MangaDraftPreviewvue_type_template_id_a0e566a2_scoped_true_staticRenderFns = [];

// CONCATENATED MODULE: ./components/manga/MangaDraftPreview.vue?vue&type=template&id=a0e566a2&scoped=true

// EXTERNAL MODULE: ./components/manga/MangaReaderImage.vue + 4 modules
var MangaReaderImage = __webpack_require__(291);

// EXTERNAL MODULE: ./utils/manga-content.js
var manga_content = __webpack_require__(215);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/manga/MangaDraftPreview.vue?vue&type=script&lang=js


/* harmony default export */ var MangaDraftPreviewvue_type_script_lang_js = ({
  components: {
    MangaReaderImage: MangaReaderImage["a" /* default */]
  },
  props: {
    article: {
      type: Object,
      required: true
    },
    novelName: {
      type: String,
      default: '漫画'
    },
    initialPage: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      mode: this.article.article_type === 'mangaPage' ? 'paged' : 'strip',
      direction: 'ltr',
      background: 'white',
      quality: 'standard',
      index: Math.max(0, this.initialPage),
      pageNumber: Math.max(0, this.initialPage) + 1,
      zoomed: false,
      openImage: null,
      storageError: false
    };
  },
  computed: {
    pages() {
      return Object(manga_content["c" /* mangaPages */])(this.article.content);
    }
  },
  mounted() {
    const p = Object(manga_content["d" /* readMangaPreferences */])(localStorage);
    if (p.mode) this.mode = p.mode;
    this.direction = p.direction;
    this.background = p.background;
    this.quality = p.quality;
    this.index = Math.min(this.index, Math.max(0, this.pages.length - 1));
    this.pageNumber = this.index + 1;
    window.addEventListener('keydown', this.key);
    if (this.mode === 'strip') this.$nextTick(this.seek);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.key);
  },
  methods: {
    scroll() {
      const strip = this.$refs.strip;
      if (!strip || this.openImage !== null) return;
      const focus = strip.scrollTop + strip.clientHeight * .4;
      const rows = strip.querySelectorAll('.draft-strip-page');
      let index = 0;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].offsetTop <= focus) index = i;else break;
      }
      this.index = index;
      this.pageNumber = index + 1;
    },
    source(page) {
      return Object(manga_content["b" /* mangaPageSource */])(page, this.quality);
    },
    save() {
      const old = Object(manga_content["d" /* readMangaPreferences */])(localStorage);
      this.storageError = !Object(manga_content["e" /* saveMangaPreferences */])(localStorage, {
        mode: this.mode,
        direction: this.direction,
        background: this.background,
        quality: this.quality,
        danmu: old.danmu
      });
    },
    changeMode() {
      this.save();
      this.zoomed = false;
      if (this.mode === 'strip') this.$nextTick(this.seek);
    },
    seek() {
      var _this$$refs$strip;
      this.index = Math.min(Math.max(0, Math.floor(Number(this.pageNumber) || 1) - 1), Math.max(0, this.pages.length - 1));
      this.pageNumber = this.index + 1;
      const target = (_this$$refs$strip = this.$refs.strip) === null || _this$$refs$strip === void 0 ? void 0 : _this$$refs$strip.querySelectorAll('.draft-strip-page')[this.index];
      if (target) this.$refs.strip.scrollTop = target.offsetTop;
    },
    step(delta) {
      const next = this.index + (this.direction === 'rtl' ? -delta : delta);
      if (next < 0 || next >= this.pages.length) return;
      this.index = next;
      this.pageNumber = next + 1;
    },
    key(event) {
      var _event$target, _event$target2;
      if (this.mode !== 'paged' || this.zoomed || this.openImage !== null || event.ctrlKey || event.metaKey || event.altKey || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes((_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.tagName) || (_event$target2 = event.target) !== null && _event$target2 !== void 0 && _event$target2.isContentEditable) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        this.step(event.key === 'ArrowRight' ? 1 : -1);
      }
    }
  }
});
// CONCATENATED MODULE: ./components/manga/MangaDraftPreview.vue?vue&type=script&lang=js
 /* harmony default export */ var manga_MangaDraftPreviewvue_type_script_lang_js = (MangaDraftPreviewvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/manga/MangaDraftPreview.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(501)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  manga_MangaDraftPreviewvue_type_script_lang_js,
  MangaDraftPreviewvue_type_template_id_a0e566a2_scoped_true_render,
  MangaDraftPreviewvue_type_template_id_a0e566a2_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "a0e566a2",
  "af42906a"
  
)

/* harmony default export */ var MangaDraftPreview = (component.exports);
// EXTERNAL MODULE: ./components/read/ReaderPager.vue + 9 modules
var ReaderPager = __webpack_require__(281);

// EXTERNAL MODULE: ./components/read/ReaderSettings.vue + 4 modules
var ReaderSettings = __webpack_require__(292);

// EXTERNAL MODULE: ./components/read/ReaderAudioPlayer.vue + 4 modules
var ReaderAudioPlayer = __webpack_require__(69);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/ReaderPreview.vue?vue&type=script&lang=js








/* harmony default export */ var ReaderPreviewvue_type_script_lang_js = ({
  components: {
    MangaDraftPreview: MangaDraftPreview,
    ReaderPager: ReaderPager["a" /* default */],
    ReaderSettings: ReaderSettings["a" /* default */],
    ReaderAudioPlayer: ReaderAudioPlayer["a" /* default */]
  },
  mixins: [reader_preferences["a" /* default */]],
  props: {
    previewKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      payload: null,
      failure: '',
      ready: false,
      settingsVisible: false,
      player: null,
      audioState: Object(reader_audio["b" /* createAudioState */])()
    };
  },
  computed: {
    isManga() {
      return this.payload && /^manga/.test(this.payload.article.article_type);
    }
  },
  mounted() {
    this.validate();
    this.ready = true;
    window.addEventListener('focus', this.validate);
    window.addEventListener('storage', this.validate);
    this.expiryTimer = setInterval(this.validate, 60000);
  },
  beforeDestroy() {
    clearInterval(this.expiryTimer);
    window.removeEventListener('focus', this.validate);
    window.removeEventListener('storage', this.validate);
    if (this.player) this.player.destroy();
  },
  methods: {
    validate() {
      const value = Object(reader_preview["a" /* readReaderPreview */])(this.previewKey);
      if (!value) {
        this.failure = '预览超过 24 小时、账号已切换或本机数据不可用。请回到编辑器生成新的预览。';
        this.payload = null;
        this.settingsVisible = false;
        if (this.player) this.player.close();
        return;
      }
      if (!this.payload) this.payload = value;
    },
    async listen() {
      if (!this.payload || this.isManga) return;
      if (!this.player) {
        // A separate queue prevents draft narration from writing real book progress.
        if (this.$readerAudio) this.$readerAudio.pause();
        this.player = new reader_audio["a" /* ReaderAudio */](this.audioState, {
          synthesis: window.speechSynthesis,
          Utterance: window.SpeechSynthesisUtterance,
          article: async () => [],
          token: reading["c" /* readingToken */],
          privatePlayback: true,
          now: Date.now,
          setTimeout: (fn, ms) => window.setTimeout(fn, ms),
          clearTimeout: id => window.clearTimeout(id)
        });
        this.player.saveSettings = () => {};
        this.player.subscribe(state => {
          if (state.follow && state.paragraphId && this.$refs.pager) this.$refs.pager.jump(state.paragraphId);
        });
      }
      const position = this.$refs.pager && this.$refs.pager.position;
      await this.player.open(this.payload.novel, [this.payload.article], this.payload.article, position && position.paragraphId || 1);
    }
  }
});
// CONCATENATED MODULE: ./components/read/ReaderPreview.vue?vue&type=script&lang=js
 /* harmony default export */ var read_ReaderPreviewvue_type_script_lang_js = (ReaderPreviewvue_type_script_lang_js); 
// CONCATENATED MODULE: ./components/read/ReaderPreview.vue



function ReaderPreview_injectStyles (context) {
  
  var style0 = __webpack_require__(503)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var ReaderPreview_component = Object(componentNormalizer["a" /* default */])(
  read_ReaderPreviewvue_type_script_lang_js,
  ReaderPreviewvue_type_template_id_ba0fb2ae_scoped_true_render,
  ReaderPreviewvue_type_template_id_ba0fb2ae_scoped_true_staticRenderFns,
  false,
  ReaderPreview_injectStyles,
  "ba0fb2ae",
  "7b1f8477"
  
)

/* harmony default export */ var ReaderPreview = (ReaderPreview_component.exports);
// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(39);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/read/preview/_key.vue?vue&type=script&lang=js


/* harmony default export */ var _keyvue_type_script_lang_js = ({
  components: {
    ReaderPreview: ReaderPreview
  },
  head() {
    return Object(reading_seo["d" /* readingHead */])({
      title: '本机阅读预览 - 原木社区',
      description: '本机草稿阅读预览',
      path: '/read/preview',
      noindex: true
    });
  },
  methods: {
    returnToEditor() {
      this.$router.back();
    }
  }
});
// CONCATENATED MODULE: ./pages/read/preview/_key.vue?vue&type=script&lang=js
 /* harmony default export */ var preview_keyvue_type_script_lang_js = (_keyvue_type_script_lang_js); 
// CONCATENATED MODULE: ./pages/read/preview/_key.vue





/* normalize component */

var _key_component = Object(componentNormalizer["a" /* default */])(
  preview_keyvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  "362638f4"
  
)

/* harmony default export */ var _key = __webpack_exports__["default"] = (_key_component.exports);

/***/ })

};;
//# sourceMappingURL=_key.js.map