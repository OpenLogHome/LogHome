exports.ids = [38];
exports.modules = {

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

/***/ 174:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(210);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("143ca612", content, true, context)
};

/***/ }),

/***/ 209:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorldVocabularyBrowser_vue_vue_type_style_index_0_id_79e26019_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(174);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorldVocabularyBrowser_vue_vue_type_style_index_0_id_79e26019_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorldVocabularyBrowser_vue_vue_type_style_index_0_id_79e26019_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorldVocabularyBrowser_vue_vue_type_style_index_0_id_79e26019_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_WorldVocabularyBrowser_vue_vue_type_style_index_0_id_79e26019_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 210:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "\n.world-browser[data-v-79e26019]{min-width:0}.vocabulary-toolbar[data-v-79e26019]{display:flex;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:0 0 20px}.search[data-v-79e26019]{display:grid;gap:7px;flex:1;min-width:190px;max-width:360px;font-size:12px;color:#8c7a64}.search input[data-v-79e26019]{width:100%;box-sizing:border-box;border:1px solid #ded5c8;border-radius:7px;padding:10px 12px;font:inherit;font-size:14px;color:#655944;background:#fff}.filters[data-v-79e26019]{display:flex;gap:6px;flex-wrap:wrap}.filters button[data-v-79e26019],.graph-tools button[data-v-79e26019],.vocabulary-entry button[data-v-79e26019]{border:1px solid #e4ddcf;border-radius:6px;background:#fff;color:#8d7759;padding:8px 11px;font:inherit;font-size:12px;cursor:pointer}.filters .active[data-v-79e26019]{background:#eaf0dd;color:#738748;border-color:#d6e0bf}button[data-v-79e26019]:disabled{opacity:.45;cursor:default}.result-count[data-v-79e26019]{font-size:12px;color:#a09687;margin-left:auto;line-height:34px}.load-status[data-v-79e26019],.load-error[data-v-79e26019]{font-size:12px;line-height:1.8;margin:10px 0 16px;color:#a18e70}.load-error[data-v-79e26019]{color:#b3624c}.load-error button[data-v-79e26019]{background:none;border:0;color:inherit;text-decoration:underline;cursor:pointer}.network-layout[data-v-79e26019]{display:grid;grid-template-columns:minmax(0,1fr) 265px;border:1px solid #e5ddcd;border-radius:12px;overflow:hidden;margin-bottom:28px}.network-main[data-v-79e26019]{min-width:0;background:#faf9f5}.graph-tools[data-v-79e26019]{display:flex;align-items:center;gap:6px;padding:14px 18px;position:relative;z-index:1}.graph-tools span[data-v-79e26019]{margin-right:auto;font-size:12px;color:#a2927a}.world-network[data-v-79e26019]{display:block;width:100%;aspect-ratio:10/7;touch-action:none;background-image:radial-gradient(#ddd5c5 1px,transparent 1px);background-size:22px 22px}.dim[data-v-79e26019]{opacity:.15}.node-ring[data-v-79e26019]{stroke:#d5cab3;stroke-width:2}.selected .node-ring[data-v-79e26019]{stroke:#7e9655;stroke-width:4}.world-graph-node[data-v-79e26019]{cursor:grab}.world-graph-node[data-v-79e26019]:active{cursor:grabbing}.world-graph-node:focus .node-ring[data-v-79e26019]{stroke:#7e9655;stroke-width:4}.node-initial[data-v-79e26019]{font-size:22px;fill:#88765b}.node-title[data-v-79e26019]{font-size:16px;fill:#6e614e;paint-order:stroke;stroke:#faf9f5;stroke-width:5px}.relation-label[data-v-79e26019]{font-size:13px;fill:#9b896b;paint-order:stroke;stroke:#faf9f5;stroke-width:4px}.graph-hint[data-v-79e26019]{padding:0 18px 16px;font-size:11px;color:#aa9b83;line-height:1.8}.selected-vocabulary[data-v-79e26019]{padding:24px;border-left:1px solid #e5ddcd;min-width:0;max-height:650px;overflow:auto;background:#fff;overflow-wrap:anywhere}.eyebrow[data-v-79e26019]{font-size:11px;letter-spacing:2px;color:#a5967e}.selected-vocabulary h3[data-v-79e26019]{font-size:20px;margin:10px 0 16px;color:#665a45}.selected-vocabulary p[data-v-79e26019]{font-size:13px;line-height:1.8;color:#a09077;white-space:pre-wrap}.selected-vocabulary dl[data-v-79e26019]{font-size:12px;margin:18px 0}.selected-vocabulary dt[data-v-79e26019]{color:#a39378;margin-top:12px}.selected-vocabulary dd[data-v-79e26019]{margin:5px 0 0;color:#6f624b;white-space:pre-wrap}.read-vocabulary[data-v-79e26019]{display:inline-block;margin:18px 0;color:#7b9054;font-size:13px;text-decoration:none}.selected-vocabulary h4[data-v-79e26019]{font-size:13px;color:#938169;margin:16px 0}.selected-vocabulary ul[data-v-79e26019]{list-style:none;padding:0}.selected-vocabulary li[data-v-79e26019]{border-bottom:1px solid #eee8df;padding:9px 0;display:grid;gap:5px}.selected-vocabulary li button[data-v-79e26019]{text-align:left;border:0;background:none;color:#7c8d51;font:inherit;font-size:12px;cursor:pointer;padding:0}.selected-vocabulary li span[data-v-79e26019]{font-size:11px;color:#b09f83}.vocabulary-list-header[data-v-79e26019]{display:flex;justify-content:space-between;align-items:center;margin:12px 0 18px}.vocabulary-list-header h3[data-v-79e26019]{font-size:17px;color:#7a6850}.vocabulary-list-header a[data-v-79e26019]{font-size:13px;color:#859555;text-decoration:none}.vocabulary-grid[data-v-79e26019]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.vocabulary-entry[data-v-79e26019]{min-width:0;border:1px solid #e7e0d5;border-radius:9px;background:#fff;overflow:hidden}.vocabulary-entry a[data-v-79e26019]{display:flex;gap:12px;padding:16px;text-decoration:none;min-width:0;color:inherit}.vocabulary-entry img[data-v-79e26019],.entry-initial[data-v-79e26019]{width:42px;height:42px;border-radius:8px;object-fit:cover;flex-shrink:0}.entry-initial[data-v-79e26019]{display:flex;align-items:center;justify-content:center;background:#edf0e2;color:#8a9a60;font-size:20px}.vocabulary-entry a div[data-v-79e26019]{min-width:0}.vocabulary-entry h4[data-v-79e26019]{font-size:14px;color:#776247;margin:1px 0 7px;overflow-wrap:anywhere}.vocabulary-entry p[data-v-79e26019]{font-size:12px;color:#a79781;line-height:1.7;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:0}.vocabulary-entry small[data-v-79e26019]{font-size:10px;color:#afa087;display:block;margin-top:8px}.vocabulary-entry>button[data-v-79e26019]{display:block;font-size:11px;margin:0 16px 14px}.empty[data-v-79e26019]{font-size:13px;text-align:center;padding:40px;color:#a69982}button[data-v-79e26019]:focus-visible,input[data-v-79e26019]:focus-visible,a[data-v-79e26019]:focus-visible,svg[data-v-79e26019]:focus-visible{outline:2px solid #8a9b62;outline-offset:3px}@media(max-width:1000px){.vocabulary-grid[data-v-79e26019]{grid-template-columns:repeat(2,minmax(0,1fr))}.network-layout[data-v-79e26019]{grid-template-columns:1fr}.selected-vocabulary[data-v-79e26019]{border-left:0;border-top:1px solid #e5ddcd;max-height:300px}.graph-hint[data-v-79e26019]{font-size:12px}}@media(max-width:600px){.vocabulary-grid[data-v-79e26019]{grid-template-columns:1fr}.result-count[data-v-79e26019]{margin-left:0}.vocabulary-toolbar[data-v-79e26019]{gap:10px}.vocabulary-entry a[data-v-79e26019]{padding:14px}}\r\n", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 218:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./components/read/WorldVocabularyBrowser.vue?vue&type=template&id=79e26019&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('section', {
    staticClass: "world-browser"
  }, [_vm._ssrNode("<div class=\"vocabulary-toolbar\" data-v-79e26019><label class=\"search\" data-v-79e26019><span data-v-79e26019>搜索词条</span><input type=\"search\" placeholder=\"名称、说明或属性\"" + _vm._ssrAttr("value", _vm.search) + " data-v-79e26019></label><div aria-label=\"词条筛选\" class=\"filters\" data-v-79e26019>" + _vm._ssrList(_vm.filters, function (option) {
    return "<button" + _vm._ssrAttr("disabled", option.id === 'isolated' && !_vm.complete) + _vm._ssrAttr("aria-pressed", _vm.kind === option.id) + _vm._ssrClass(null, {
      active: _vm.kind === option.id
    }) + " data-v-79e26019>" + _vm._ssrEscape(_vm._s(option.label)) + "</button>";
  }) + "</div><span class=\"result-count\" data-v-79e26019>" + _vm._ssrEscape(_vm._s(_vm.matches.length) + " / " + _vm._s(_vm.graph.nodes.length) + " 个词条") + "</span></div> " + (_vm.loading ? "<p role=\"status\" class=\"load-status\" data-v-79e26019>" + _vm._ssrEscape("正在加载词条资料 " + _vm._s(_vm.loadedCount) + " / " + _vm._s(_vm.articles.length)) + "</p>" : "<!---->") + (_vm.failedIds.length ? "<p role=\"alert\" class=\"load-error\" data-v-79e26019>" + _vm._ssrEscape(_vm._s(_vm.failedIds.length) + " 个词条资料加载失败，目录仍可浏览。") + "<button" + _vm._ssrAttr("disabled", _vm.loading) + " data-v-79e26019>重试</button></p>" : "<!---->") + " "), _vm.network && _vm.graph.nodes.length ? _vm._ssrNode("<div class=\"network-layout\" data-v-79e26019>", "</div>", [_vm._ssrNode("<div class=\"network-main\" data-v-79e26019><div class=\"graph-tools\" data-v-79e26019><span data-v-79e26019>" + _vm._ssrEscape(_vm._s(_vm.graph.links.length) + " 条关系") + "</span><button aria-label=\"放大关系图\" data-v-79e26019>＋</button><button aria-label=\"缩小关系图\" data-v-79e26019>－</button><button data-v-79e26019>重置视图</button></div><svg viewBox=\"0 0 1000 700\" aria-label=\"词条关系图，可拖动和缩放\" tabindex=\"0\" class=\"world-network\" data-v-79e26019><defs data-v-79e26019><marker" + _vm._ssrAttr("id", _vm.markerId) + " viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\" data-v-79e26019><path d=\"M 0 0 L 10 5 L 0 10 z\" fill=\"#a8997d\" data-v-79e26019></path></marker>" + _vm._ssrList(_vm.graph.nodes, function (node) {
    return "<clipPath" + _vm._ssrAttr("id", _vm.clipId(node.id)) + " data-v-79e26019><circle r=\"26\" data-v-79e26019></circle></clipPath>";
  }) + "</defs> <g" + _vm._ssrAttr("transform", `translate(${_vm.panX},${_vm.panY}) scale(${_vm.zoom})`) + " data-v-79e26019>" + _vm._ssrList(_vm.edges, function (edge) {
    return "<g" + _vm._ssrClass(null, {
      dim: !_vm.edgeMatches(edge)
    }) + " data-v-79e26019><path" + _vm._ssrAttr("d", edge.path) + " fill=\"none\" stroke=\"#b6aa91\" stroke-width=\"1.4\"" + _vm._ssrAttr("marker-end", `url(#${_vm.markerId})`) + " data-v-79e26019></path><text" + _vm._ssrAttr("x", edge.x) + _vm._ssrAttr("y", edge.y - 5) + " text-anchor=\"middle\" class=\"relation-label\" data-v-79e26019>" + _vm._ssrEscape(_vm._s(edge.label)) + "</text></g>";
  }) + " " + _vm._ssrList(_vm.graph.nodes, function (node) {
    return "<a" + _vm._ssrAttr("href", `/article/${node.id}`) + _vm._ssrAttr("aria-label", `${node.title}，${node.degree} 条关系`) + _vm._ssrAttr("transform", _vm.nodeTransform(node.id)) + _vm._ssrClass("world-graph-node", {
      selected: _vm.selectedId === node.id,
      dim: !_vm.matchingIds.has(node.id)
    }) + " data-v-79e26019><title data-v-79e26019>" + _vm._ssrEscape(_vm._s(node.title)) + "</title><circle r=\"30\"" + _vm._ssrAttr("fill", node.degree ? '#edf0df' : '#f6eee1') + " class=\"node-ring\" data-v-79e26019></circle>" + (node.pic && !_vm.imageErrors[node.id] ? "<image" + _vm._ssrAttr("href", node.pic) + " x=\"-26\" y=\"-26\" width=\"52\" height=\"52\"" + _vm._ssrAttr("clip-path", `url(#${_vm.clipId(node.id)})`) + " preserveAspectRatio=\"xMidYMid slice\" data-v-79e26019></image>" : "<text text-anchor=\"middle\" dominant-baseline=\"central\" class=\"node-initial\" data-v-79e26019>" + _vm._ssrEscape(_vm._s(node.title.slice(0, 1))) + "</text>") + "<text y=\"49\" text-anchor=\"middle\" class=\"node-title\" data-v-79e26019>" + _vm._ssrEscape(_vm._s(_vm.shortTitle(node.title))) + "</text></a>";
  }) + "</g></svg><p class=\"graph-hint\" data-v-79e26019>拖动词条或空白处，滚轮缩放。点击词条查看资料，右侧可打开正文。</p></div> "), _vm._ssrNode("<aside class=\"selected-vocabulary\" data-v-79e26019>", "</aside>", [_vm.selected ? [_vm._ssrNode("<span class=\"eyebrow\" data-v-79e26019>词条资料</span><h3 data-v-79e26019>" + _vm._ssrEscape(_vm._s(_vm.selected.title)) + "</h3><p data-v-79e26019>" + _vm._ssrEscape(_vm._s(_vm.selected.desc || (_vm.selected.loaded ? '暂无词条说明' : '资料加载中…'))) + "</p>" + (_vm.selected.attributes.length ? "<dl data-v-79e26019>" + _vm._ssrList(_vm.selected.attributes, function (attr, index) {
    return "<dt data-v-79e26019>" + _vm._ssrEscape(_vm._s(attr.name)) + "</dt><dd data-v-79e26019>" + _vm._ssrEscape(_vm._s(attr.content)) + "</dd>";
  }) + "</dl>" : "<!---->")), _c('nuxt-link', {
    staticClass: "read-vocabulary",
    attrs: {
      "to": `/article/${_vm.selected.id}`
    }
  }, [_vm._v("阅读完整词条 →")]), _vm._ssrNode("<h4 data-v-79e26019>" + _vm._ssrEscape("关联词条（" + _vm._s(_vm.selectedEdges.length) + "）") + "</h4><ul data-v-79e26019>" + _vm._ssrList(_vm.selectedEdges, function (edge) {
    return "<li data-v-79e26019><button data-v-79e26019>" + _vm._ssrEscape(_vm._s(edge.incoming ? '←' : '→') + " " + _vm._s(edge.other.title)) + "</button><span data-v-79e26019>" + _vm._ssrEscape(_vm._s(edge.label || '关联')) + "</span></li>";
  }) + "</ul>" + (!_vm.selectedEdges.length ? "<p data-v-79e26019>" + _vm._ssrEscape(_vm._s(_vm.complete ? '这个词条尚未建立关系。' : '其余关系资料尚在加载。')) + "</p>" : "<!---->"))] : _vm._ssrNode("<p data-v-79e26019>选择图中的词条，查看说明、属性和关系。</p>")], 2)], 2) : _vm._e(), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"vocabulary-list-header\" data-v-79e26019>", "</div>", [_vm._ssrNode("<h3 data-v-79e26019>" + _vm._ssrEscape(_vm._s(_vm.network ? '词条目录' : '世界词条')) + "</h3>"), !_vm.network ? _c('nuxt-link', {
    attrs: {
      "to": `/world/relations/${_vm.novelId}`
    }
  }, [_vm._v("查看关系网 →")]) : _vm._e()], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"vocabulary-grid\" data-v-79e26019>", "</div>", _vm._l(_vm.matches, function (node) {
    return _vm._ssrNode("<article class=\"vocabulary-entry\" data-v-79e26019>", "</article>", [_c('nuxt-link', {
      attrs: {
        "to": `/article/${node.id}`
      }
    }, [node.pic && !_vm.imageErrors[node.id] ? _c('img', {
      attrs: {
        "src": node.pic,
        "alt": node.title,
        "loading": "lazy"
      },
      on: {
        "error": function ($event) {
          return _vm.$set(_vm.imageErrors, node.id, true);
        }
      }
    }) : _c('span', {
      staticClass: "entry-initial"
    }, [_vm._v(_vm._s(node.title.slice(0, 1)))]), _c('div', [_c('h4', [_vm._v(_vm._s(node.title))]), _c('p', [_vm._v(_vm._s(node.desc || '查看完整词条'))]), node.loaded ? _c('small', [_vm._v(_vm._s(node.attributes.length) + " 项属性 · " + _vm._s(node.degree) + " 条关系")]) : _vm._e()])]), _vm._ssrNode(_vm.network ? "<button data-v-79e26019>在图中定位</button>" : "<!---->")], 2);
  }), 0), _vm._ssrNode(!_vm.matches.length ? "<p class=\"empty\" data-v-79e26019>" + _vm._ssrEscape(_vm._s(_vm.articles.length ? '没有符合筛选条件的词条。' : '这个世界尚未添加词条。')) + "</p>" : "<!---->")], 2);
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./components/read/WorldVocabularyBrowser.vue?vue&type=template&id=79e26019&scoped=true

// EXTERNAL MODULE: ./utils/reader-world.js
var reader_world = __webpack_require__(138);

// CONCATENATED MODULE: ./utils/world-graph-layout.js
// Deterministic SVG layout; local-grid collision keeps each animation step bounded.
function graphPositions(nodes) {
  return nodes.map((node, index) => {
    const angle = index * 2.399963229728653,
      radius = nodes.length < 2 ? 0 : Math.min(285, 70 * Math.sqrt(index + 1));
    return {
      id: node.id,
      x: 500 + Math.cos(angle) * radius,
      y: 350 + Math.sin(angle) * radius,
      vx: 0,
      vy: 0
    };
  });
}
function graphStep(points, links, pinned, iteration = 0) {
  const byId = new Map(points.map(point => [point.id, point])),
    cells = new Map(),
    forces = new Map(points.map(point => [point.id, {
      x: (500 - point.x) * .0008,
      y: (350 - point.y) * .0008
    }]));
  for (const point of points) {
    const key = `${Math.floor(point.x / 100)}:${Math.floor(point.y / 100)}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(point);
  }
  for (const point of points) {
    const cx = Math.floor(point.x / 100),
      cy = Math.floor(point.y / 100);
    for (let x = cx - 1; x <= cx + 1; x++) for (let y = cy - 1; y <= cy + 1; y++) for (const other of cells.get(`${x}:${y}`) || []) {
      if (point.id >= other.id) continue;
      let dx = point.x - other.x,
        dy = point.y - other.y;
      if (!dx && !dy) dx = .5;
      const distance = Math.max(1, Math.hypot(dx, dy)),
        strength = Math.min(4, Math.max(0, 170 - distance) * .025);
      const a = forces.get(point.id),
        b = forces.get(other.id);
      a.x += dx / distance * strength;
      a.y += dy / distance * strength;
      b.x -= dx / distance * strength;
      b.y -= dy / distance * strength;
    }
  }
  for (const link of links) {
    const a = byId.get(link.source),
      b = byId.get(link.target);
    if (!a || !b || a === b) continue;
    const dx = b.x - a.x,
      dy = b.y - a.y,
      distance = Math.max(1, Math.hypot(dx, dy)),
      force = (distance - 230) * .006;
    const fa = forces.get(a.id),
      fb = forces.get(b.id);
    fa.x += dx / distance * force;
    fa.y += dy / distance * force;
    fb.x -= dx / distance * force;
    fb.y -= dy / distance * force;
  }
  const cooling = Math.max(.15, 1 - iteration / 240);
  for (const point of points) {
    if (point.id === pinned) {
      point.vx = point.vy = 0;
      continue;
    }
    const force = forces.get(point.id);
    point.vx = (point.vx + force.x * cooling) * .8;
    point.vy = (point.vy + force.y * cooling) * .8;
    point.x = Math.max(45, Math.min(955, point.x + point.vx));
    point.y = Math.max(45, Math.min(655, point.y + point.vy));
  }
  return points;
}
function graphEdge(source, target) {
  if (!source || !target) return {
    path: '',
    x: 0,
    y: 0
  };
  if (source.id === target.id) return {
    path: `M ${source.x - 12} ${source.y - 20} C ${source.x - 65} ${source.y - 105}, ${source.x + 65} ${source.y - 105}, ${source.x + 12} ${source.y - 20}`,
    x: source.x,
    y: source.y - 75
  };
  const dx = target.x - source.x,
    dy = target.y - source.y,
    d = Math.max(1, Math.hypot(dx, dy)),
    sx = source.x + dx / d * 28,
    sy = source.y + dy / d * 28,
    tx = target.x - dx / d * 32,
    ty = target.y - dy / d * 32,
    cx = (sx + tx) / 2 - dy * .14,
    cy = (sy + ty) / 2 + dx * .14;
  return {
    path: `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`,
    x: (sx + 2 * cx + tx) / 4,
    y: (sy + 2 * cy + ty) / 4
  };
}
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./components/read/WorldVocabularyBrowser.vue?vue&type=script&lang=js


/* harmony default export */ var WorldVocabularyBrowservue_type_script_lang_js = ({
  props: {
    articles: {
      type: Array,
      default: () => []
    },
    novelId: {
      type: [Number, String],
      required: true
    },
    network: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rows: this.articles.slice(),
      search: '',
      kind: 'all',
      loading: false,
      failedIds: [],
      version: 0,
      loadedCount: 0,
      imageErrors: {},
      selectedId: 0,
      points: graphPositions(Object(reader_world["c" /* worldGraph */])(this.articles).nodes),
      zoom: 1,
      panX: 0,
      panY: 0,
      drag: null,
      dragMoved: false,
      iteration: 0,
      filters: [{
        id: 'all',
        label: '全部'
      }, {
        id: 'connected',
        label: '有关联'
      }, {
        id: 'isolated',
        label: '独立词条'
      }, {
        id: 'pictured',
        label: '有插图'
      }]
    };
  },
  computed: {
    graph() {
      return Object(reader_world["c" /* worldGraph */])(this.rows);
    },
    matches() {
      return Object(reader_world["a" /* filterWorldNodes */])(this.graph.nodes, {
        search: this.search,
        kind: this.kind
      });
    },
    matchingIds() {
      return new Set(this.matches.map(node => node.id));
    },
    complete() {
      return !this.loading && !this.failedIds.length && this.graph.nodes.every(node => node.loaded);
    },
    selected() {
      return this.graph.nodes.find(node => node.id === this.selectedId);
    },
    markerId() {
      return `world-arrow-${this.novelId}`;
    },
    positionMap() {
      return new Map(this.points.map(point => [point.id, point]));
    },
    edges() {
      return this.graph.links.map(link => ({
        ...link,
        ...graphEdge(this.positionMap.get(link.source), this.positionMap.get(link.target))
      }));
    },
    selectedEdges() {
      return this.graph.links.filter(edge => edge.source === this.selectedId || edge.target === this.selectedId).map(edge => ({
        ...edge,
        incoming: edge.target === this.selectedId,
        other: this.graph.nodes.find(node => node.id === (edge.source === this.selectedId ? edge.target : edge.source))
      }));
    }
  },
  watch: {
    articles() {
      this.resetData();
    },
    novelId() {
      this.resetData();
    },
    graph() {
      this.syncPoints();
    },
    network(value) {
      if (value) this.animate();else this.stopAnimation();
    }
  },
  mounted() {
    this.loadDetails();
    if (this.network) this.animate();
  },
  beforeDestroy() {
    this.version++;
    this.stopAnimation();
    this.drag = null;
  },
  methods: {
    resetData() {
      this.version++;
      this.stopAnimation();
      this.rows = this.articles.slice();
      this.failedIds = [];
      this.imageErrors = {};
      this.selectedId = 0;
      this.loadedCount = 0;
      this.loading = false;
      this.kind = 'all';
      this.resetView();
      this.points = graphPositions(Object(reader_world["c" /* worldGraph */])(this.rows).nodes);
      this.loadDetails();
    },
    async loadDetails(retry = false) {
      if (this.loading) return;
      const version = ++this.version,
        novelId = Number(this.novelId);
      this.loading = true;
      const pending = this.articles.filter(article => retry ? this.failedIds.includes(Number(article.article_id)) : !this.rows.some(row => Number(row.article_id) === Number(article.article_id) && Object.prototype.hasOwnProperty.call(row, 'content')));
      this.failedIds = retry ? this.failedIds.filter(id => !pending.some(row => Number(row.article_id) === id)) : [];
      for (let i = 0; i < pending.length; i += 5) {
        const batch = await Promise.all(pending.slice(i, i + 5).map(async article => {
          try {
            const response = await this.$api.reader.article(article.article_id),
              detail = response && response[0];
            if (!detail || Number(detail.article_id) !== Number(article.article_id) || Number(detail.novel_id) !== novelId || detail.article_type !== 'worldVocabulary' || Number(detail.is_draft) === 1) throw new Error('词条不可阅读');
            return {
              detail
            };
          } catch (_) {
            return {
              failed: Number(article.article_id)
            };
          }
        }));
        if (version !== this.version || novelId !== Number(this.novelId)) return;
        for (const result of batch) {
          if (result.failed) this.failedIds.push(result.failed);else {
            const index = this.rows.findIndex(row => Number(row.article_id) === Number(result.detail.article_id));
            if (index >= 0) this.$set(this.rows, index, {
              ...result.detail
            });
          }
        }
        this.loadedCount = this.rows.filter(row => Object.prototype.hasOwnProperty.call(row, 'content')).length;
      }
      if (version === this.version) this.loading = false;
    },
    syncPoints() {
      const old = this.positionMap;
      this.points = graphPositions(this.graph.nodes).map(point => old.get(point.id) || point);
      if (this.network) this.animate();
    },
    stopAnimation() {
      if (this.frame) cancelAnimationFrame(this.frame);
      this.frame = null;
    },
    animate() {
      this.stopAnimation();
      if (!this.network || !this.points.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.iteration = 0;
      const step = () => {
        this.frame = null;
        if (!this.network) return;
        graphStep(this.points, this.graph.links, this.drag && this.drag.id, this.iteration++);
        if (this.iteration < 240) this.frame = requestAnimationFrame(step);
      };
      this.frame = requestAnimationFrame(step);
    },
    nodeTransform(id) {
      const point = this.positionMap.get(id);
      return point ? `translate(${point.x},${point.y})` : '';
    },
    clipId(id) {
      return `world-node-${this.novelId}-${id}`;
    },
    shortTitle(title) {
      return title.length > 12 ? title.slice(0, 11) + '…' : title;
    },
    edgeMatches(edge) {
      return this.matchingIds.has(edge.source) || this.matchingIds.has(edge.target);
    },
    zoomBy(factor, x = 500, y = 350) {
      const next = Math.max(.35, Math.min(3, this.zoom * factor)),
        ratio = next / this.zoom;
      this.panX = x + (this.panX - x) * ratio;
      this.panY = y + (this.panY - y) * ratio;
      this.zoom = next;
    },
    resetView() {
      this.zoom = 1;
      this.panX = this.panY = 0;
    },
    svgPoint(event) {
      const rect = this.$refs.svg.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * 1000 / rect.width,
        y: (event.clientY - rect.top) * 700 / rect.height
      };
    },
    wheel(event) {
      const point = this.svgPoint(event);
      this.zoomBy(event.deltaY < 0 ? 1.1 : 1 / 1.1, point.x, point.y);
    },
    startPan(event) {
      var _event$currentTarget$, _event$currentTarget;
      if (event.button !== 0) return;
      const point = this.svgPoint(event);
      this.drag = {
        id: 0,
        x: point.x,
        y: point.y,
        panX: this.panX,
        panY: this.panY
      };
      this.dragMoved = false;
      (_event$currentTarget$ = (_event$currentTarget = event.currentTarget).setPointerCapture) === null || _event$currentTarget$ === void 0 ? void 0 : _event$currentTarget$.call(_event$currentTarget, event.pointerId);
    },
    startDrag(event, id) {
      var _event$currentTarget$2, _event$currentTarget2;
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const point = this.svgPoint(event),
        node = this.positionMap.get(id);
      this.drag = {
        id,
        x: point.x,
        y: point.y,
        nodeX: node.x,
        nodeY: node.y
      };
      this.dragMoved = false;
      (_event$currentTarget$2 = (_event$currentTarget2 = event.currentTarget).setPointerCapture) === null || _event$currentTarget$2 === void 0 ? void 0 : _event$currentTarget$2.call(_event$currentTarget2, event.pointerId);
    },
    movePointer(event) {
      if (!this.drag) return;
      const point = this.svgPoint(event),
        dx = point.x - this.drag.x,
        dy = point.y - this.drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) this.dragMoved = true;
      if (this.drag.id) {
        const node = this.positionMap.get(this.drag.id);
        node.x = Math.max(40, Math.min(960, this.drag.nodeX + dx / this.zoom));
        node.y = Math.max(40, Math.min(660, this.drag.nodeY + dy / this.zoom));
      } else {
        this.panX = this.drag.panX + dx;
        this.panY = this.drag.panY + dy;
      }
    },
    endPointer() {
      if (!this.drag) return;
      this.drag = null;
      this.animate();
    },
    clickNode(event, id) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (this.dragMoved) {
        this.dragMoved = false;
        return;
      }
      this.selectedId = id;
    },
    selectAndFocus(id) {
      this.selectedId = id;
      const point = this.positionMap.get(id);
      this.panX = 500 - point.x * this.zoom;
      this.panY = 350 - point.y * this.zoom;
      this.$nextTick(() => {
        var _this$$refs$svg;
        return (_this$$refs$svg = this.$refs.svg) === null || _this$$refs$svg === void 0 ? void 0 : _this$$refs$svg.focus();
      });
    },
    graphKey(event) {
      if (event.target !== event.currentTarget) return;
      const movement = {
        ArrowLeft: [30, 0],
        ArrowRight: [-30, 0],
        ArrowUp: [0, 30],
        ArrowDown: [0, -30]
      }[event.key];
      if (movement) {
        event.preventDefault();
        this.panX += movement[0];
        this.panY += movement[1];
      } else if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        this.zoomBy(1.2);
      } else if (event.key === '-') {
        event.preventDefault();
        this.zoomBy(1 / 1.2);
      } else if (event.key === 'Home') {
        event.preventDefault();
        this.resetView();
      }
    }
  }
});
// CONCATENATED MODULE: ./components/read/WorldVocabularyBrowser.vue?vue&type=script&lang=js
 /* harmony default export */ var read_WorldVocabularyBrowservue_type_script_lang_js = (WorldVocabularyBrowservue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/read/WorldVocabularyBrowser.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(209)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  read_WorldVocabularyBrowservue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "79e26019",
  "53bd7a24"
  
)

/* harmony default export */ var WorldVocabularyBrowser = __webpack_exports__["a"] = (component.exports);

/***/ }),

/***/ 267:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(368);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(5).default
module.exports.__inject__ = function (context) {
  add("1fed04a1", content, true, context)
};

/***/ }),

/***/ 367:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_3cd7436c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(267);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_3cd7436c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_3cd7436c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_3cd7436c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_3cd7436c_prod_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 368:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(4);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".world-relations[data-v-3cd7436c]{max-width:1360px;box-sizing:border-box;margin:auto;padding:32px 40px 60px}.world-relations>header[data-v-3cd7436c]{margin-bottom:28px}.world-relations>header a[data-v-3cd7436c]{font-size:13px;color:#8d9d60;text-decoration:none}.world-relations h1[data-v-3cd7436c]{font-size:28px;font-weight:500;color:#776247;line-height:1.5;margin:18px 0 12px}.world-relations header p[data-v-3cd7436c]{font-size:13px;color:#a28e6f;line-height:1.8}@media(max-width:800px){.world-relations[data-v-3cd7436c]{padding:24px 20px}.world-relations h1[data-v-3cd7436c]{font-size:23px}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 443:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/vue-loader/lib??vue-loader-options!./pages/world/relations/_id.vue?vue&type=template&id=3cd7436c&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.world ? _c('main', {
    staticClass: "world-relations"
  }, [_vm._ssrNode("<header data-v-3cd7436c>", "</header>", [_c('nuxt-link', {
    attrs: {
      "to": `/world/${_vm.world.novel_id}`
    }
  }, [_vm._v("← 返回世界设定")]), _vm._ssrNode("<h1 data-v-3cd7436c>" + _vm._ssrEscape(_vm._s(_vm.world.name) + " · 词条关系网") + "</h1><p data-v-3cd7436c>浏览世界中的人物、事物与联系，选择词条可以查看属性和完整正文。</p>")], 2), _c('WorldVocabularyBrowser', {
    attrs: {
      "articles": _vm.worldVocabs,
      "novel-id": _vm.world.novel_id,
      "network": ""
    }
  })], 1) : _vm._e();
};
var staticRenderFns = [];

// CONCATENATED MODULE: ./pages/world/relations/_id.vue?vue&type=template&id=3cd7436c&scoped=true

// EXTERNAL MODULE: ./components/read/WorldVocabularyBrowser.vue + 5 modules
var WorldVocabularyBrowser = __webpack_require__(218);

// EXTERNAL MODULE: ./utils/reader-world.js
var reader_world = __webpack_require__(138);

// EXTERNAL MODULE: ./utils/reading-seo.js
var reading_seo = __webpack_require__(34);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/world/relations/_id.vue?vue&type=script&lang=js



/* harmony default export */ var _idvue_type_script_lang_js = ({
  components: {
    WorldVocabularyBrowser: WorldVocabularyBrowser["a" /* default */]
  },
  data: () => ({
    world: null,
    worldVocabs: []
  }),
  async asyncData(context) {
    return Object(reader_world["b" /* loadPublicWorld */])(context, true);
  },
  head() {
    const path = `/world/relations/${this.world ? this.world.novel_id : this.$route.params.id}`;
    return Object(reading_seo["d" /* readingHead */])({
      title: this.world ? `${this.world.name} - 词条关系网 - 原木社区` : '词条关系网 - 原木社区',
      description: this.world && this.world.content,
      path,
      schema: this.world ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: this.world.name + '词条关系',
        itemListElement: this.worldVocabs.map((word, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: word.title,
          url: reading_seo["a" /* SITE_ORIGIN */] + `/article/${word.article_id}`
        }))
      } : undefined
    });
  }
});
// CONCATENATED MODULE: ./pages/world/relations/_id.vue?vue&type=script&lang=js
 /* harmony default export */ var relations_idvue_type_script_lang_js = (_idvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/world/relations/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(367)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  relations_idvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "3cd7436c",
  "77f56dc5"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map