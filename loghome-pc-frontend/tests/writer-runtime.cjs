const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm");
const babel = require("@babel/core"),
  compiler = require("vue-template-compiler/build.js");
const { test } = require("node:test");
const root = path.resolve(__dirname, ".."),
  cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {},
    filename = path.join(root, file);
  let source = fs.readFileSync(filename, "utf8");
  if (file.endsWith(".vue"))
    source = compiler.parseComponent(source).script.content;
  const code = babel.transformSync(source, {
    configFile: false,
    babelrc: false,
    plugins: ["@babel/plugin-transform-modules-commonjs"],
  }).code;
  cache.set(file, exports);
  vm.runInNewContext(
    code,
    {
      exports,
      console,
      window: { localStorage: { getItem: () => null } },
      Date,
      Blob,
      TextDecoder,
      DOMException,
      URLSearchParams,
      process,
      setInterval,
      clearInterval,
      setTimeout,
      clearTimeout,
      require(specifier) {
        if (specifier.endsWith(".vue")) return {};
        if (!specifier.startsWith(".") && !specifier.startsWith("~/"))
          return require(specifier);
        const target = specifier.startsWith("~/")
          ? specifier.slice(2)
          : path.posix.join(path.posix.dirname(file), specifier);
        return load(/\.(js|json|vue)$/.test(target) ? target : target + ".js");
      },
    },
    { filename }
  );
  return exports;
}
const plain = (value) => JSON.parse(JSON.stringify(value));
const codec = load("utils/writer/legacy-adapter.js");
const { WriterSession } = load("utils/writer/session.js");
const { writerSignature, writerTime } = load("utils/writer/drafts.js");
function fixture(options = {}) {
  const reader = {
    article_id: 10,
    novel_id: 7,
    title: "第一章",
    content: JSON.stringify([{ type: "text", value: "旧正文", id: 42 }]),
    current_access: { can_edit_draft: true },
    ...options.reader,
  };
  let remote = plain(reader),
    backup = null,
    writes = [];
  const api = {
    get: async (name) =>
      name === "get_article" ? plain(reader) : plain(remote),
    post: async (name, body) => {
      writes.push({ name, body: plain(body) });
      if (options.fail === name) throw new Error("模拟断网");
      if (name === "upload_article_writer")
        remote = { ...remote, ...plain(body) };
      return { writer_snapshot: { create_time: "20261010103000" } };
    },
  };
  const drafts = {
    read: async () => options.local || null,
    persist: async (account, article, baseline) => {
      backup = { account, ...plain(article), baseline };
    },
  };
  const states = [];
  const session = new WriterSession({
    api,
    drafts,
    identity: { id: 99, token: "test" },
    onState: (state) => states.push(state),
  });
  return {
    session,
    writes,
    states,
    api,
    get backup() {
      return backup;
    },
    setRemote(value) {
      remote = value;
    },
  };
}
test("legacy document round trip preserves paragraph ids, image order and multiline text", () => {
  const blocks = [
    { type: "text", id: 42, value: "段落一\n下一行" },
    { type: "image", img: "https://example.test/p.png" },
    { type: "text", id: 7, value: "段落二" },
  ];
  assert.deepEqual(
    plain(codec.docToLegacyBlocks(codec.legacyBlocksToDoc(blocks))),
    blocks
  );
  const doc = codec.legacyBlocksToDoc(blocks);
  doc.content.push({
    type: "paragraph",
    content: [{ type: "text", text: "新段落" }],
  });
  const result = plain(codec.docToLegacyBlocks(doc));
  assert.equal(result[0].id, 42);
  assert.equal(result[2].id, 7);
  assert.ok(result[3].id > 42);
});
test("duplicate ids are repaired without renumbering first existing anchors", () => {
  const result = plain(
    codec.docToLegacyBlocks({
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { legacyId: 12 },
          content: [{ type: "text", text: "原段" }],
        },
        {
          type: "paragraph",
          attrs: { legacyId: 12 },
          content: [{ type: "text", text: "拆分段" }],
        },
      ],
    })
  );
  assert.equal(result[0].id, 12);
  assert.notEqual(result[1].id, 12);
});
test("writer times use Shanghai timezone regardless of host", () =>
  assert.equal(writerTime(new Date("2026-10-10T00:00:00Z")), "20261010080000"));
test("saving writes a writer draft with its session and leaves published content unchanged", async () => {
  const f = fixture();
  await f.session.open(10);
  f.session.article.content = '[{"type":"text","value":"新正文","id":42}]';
  await f.session.save();
  const upload = f.writes.find((w) => w.name === "upload_article_writer");
  assert.equal(upload.body.edit_session_id, f.session.sessionId);
  assert.equal(upload.body.is_fast_save, true);
  assert.ok(!f.writes.some((w) => w.name === "modify_article"));
  assert.equal(f.backup.account, 99);
  await f.session.close();
});
test("remote conflict blocks upload and preserves the local version", async () => {
  const f = fixture();
  await f.session.open(10);
  f.session.article.title = "本机标题";
  f.setRemote({ ...f.session.article, title: "其他作者标题" });
  await assert.rejects(f.session.save(), (error) => Boolean(error.remote));
  assert.equal(f.backup.title, "本机标题");
  assert.ok(!f.writes.some((w) => w.name === "upload_article_writer"));
  await f.session.close();
});
test("network failure retains account-scoped draft and reports offline state", async () => {
  const f = fixture({ fail: "upload_article_writer" });
  await f.session.open(10);
  f.session.article.title = "断网前修改";
  await assert.rejects(f.session.save(), /模拟断网/);
  assert.equal(f.backup.title, "断网前修改");
  assert.equal(f.states.at(-1).status, "offline");
  await f.session.close();
});
test("denied edit lock keeps chapter read-only and never uploads", async () => {
  const f = fixture({ fail: "claim_article_edit_lock" });
  const result = await f.session.open(10);
  assert.equal(result.readonly, true);
  await assert.rejects(f.session.save(), /不可写入/);
  assert.ok(!f.writes.some((w) => w.name === "upload_article_writer"));
  await f.session.close();
});
test("local draft divergence is returned for explicit version choice", async () => {
  const f = fixture({ local: { title: "离线写作", content: "[]" } });
  const result = await f.session.open(10);
  assert.equal(result.local.title, "离线写作");
  assert.equal(f.session.article.title, "第一章");
  await f.session.close();
});
test("in-flight upload does not mark later keystrokes as synced", async () => {
  const f = fixture();
  await f.session.open(10);
  const post = f.api.post;
  let release;
  f.api.post = async (name, body) => {
    if (name === "upload_article_writer")
      await new Promise((resolve) => {
        release = resolve;
      });
    return post(name, body);
  };
  f.session.article.title = "第一修改";
  const pending = f.session.save();
  while (!release) await new Promise((resolve) => setTimeout(resolve, 1));
  f.session.article.title = "第二修改";
  release();
  await pending;
  assert.equal(f.states.at(-1).status, "pending");
  assert.notEqual(writerSignature(f.session.article), f.session.baseline);
  await f.session.close();
});
test("unchanged manual and periodic snapshots keep local history without cloud round trips", async () => {
  const f = fixture();
  await f.session.open(10);
  f.api.get = async () => { throw new Error("unchanged saves must not download drafts"); };
  await f.session.save(true);
  await f.session.save(false);
  assert.ok(!f.writes.some((w) => w.name === "upload_article_writer"));
  assert.equal(f.backup.title, "第一章");
  await f.session.close();
});
test("conditional saves send acknowledged metadata, avoid full preflight downloads, and advance their baseline", async () => {
  const f = fixture({ reader: { content_hash: "old-hash", supports_conditional_save: true } });
  await f.session.open(10);
  f.api.get = async () => { throw new Error("save must use a single upload request"); };
  const post = f.api.post;
  f.api.post = async (name, body) => {
    const result = await post(name, body);
    return name === "upload_article_writer"
      ? { writer_snapshot: { content_hash: "saved-hash", title: body.title } } : result;
  };
  f.session.article.title = "第一次修改";
  await f.session.save();
  f.session.article.title = "第二次修改";
  await f.session.save();
  const uploads = f.writes.filter((w) => w.name === "upload_article_writer");
  assert.deepEqual(uploads[0].body.base_writer, { content_hash: "old-hash", title: "第一章" });
  assert.deepEqual(uploads[1].body.base_writer, { content_hash: "saved-hash", title: "第一次修改" });
  await f.session.close();
});
test("server-side revision conflict fetches the remote version only on conflict and retains local edits", async () => {
  const f = fixture({ reader: { content_hash: "old-hash", supports_conditional_save: true } });
  await f.session.open(10);
  const post = f.api.post;
  f.api.post = async (name, body) => {
    if (name !== "upload_article_writer") return post(name, body);
    const error = new Error("云端内容已变化");
    error.data = { code: "writer_revision_conflict" };
    throw error;
  };
  const remote = { ...f.session.article, title: "云端修改", content_hash: "remote-hash" };
  f.setRemote(remote);
  f.session.article.title = "本机修改";
  await assert.rejects(f.session.save(), (error) => error.remote.title === "云端修改");
  assert.equal(f.states.at(-1).status, "conflict");
  assert.equal(f.backup.title, "本机修改");
  f.session.adoptRemote(remote);
  assert.equal(f.session.baseWriter.content_hash, "remote-hash");
  await f.session.close();
});
test("overlapping saves serialize even while the local backup is pending", async () => {
  const f = fixture();
  await f.session.open(10);
  const persist = f.session.drafts.persist;
  let release;
  const paused = new Promise((resolve) => { release = resolve; });
  f.session.drafts.persist = async (...args) => { await paused; return persist(...args); };
  f.session.article.title = "只上传一次";
  const first = f.session.save(), second = f.session.save();
  release();
  await Promise.all([first, second]);
  assert.equal(f.writes.filter((w) => w.name === "upload_article_writer").length, 1);
  await f.session.close();
});
test("NDJSON stream survives split Unicode and missing final newline", async () => {
  const { consumeWriterStream } = load("utils/writer/ndjson.js"),
    encoded = new TextEncoder().encode(
      '{"type":"delta","content":"故事🌲"}\n{"type":"done"}'
    ),
    events = [];
  const response = new Response(
    new ReadableStream({
      start(controller) {
        for (let i = 0; i < encoded.length; i += 3)
          controller.enqueue(encoded.slice(i, i + 3));
        controller.close();
      },
    })
  );
  await consumeWriterStream(response, (event) => events.push(event));
  assert.deepEqual(plain(events), [
    { type: "delta", content: "故事🌲" },
    { type: "done" },
  ]);
});
test("partial smart correction preserves finished paragraphs on a dropped stream", async () => {
  const { readWriterCorrectionStream } = load(
    "utils/writer/correction-stream.js"
  );
  const paragraphs = [
    { paragraph_index: 1, text: "甲", paragraph_hash: "a" },
    { paragraph_index: 2, text: "乙", paragraph_hash: "b" },
  ];
  const response = new Response(
    '{"type":"meta","batched":true}\n{"type":"paragraph_result","result":{"paragraph_index":1,"paragraph_hash":"a","original_text":"甲","corrected_text":"甲","has_issue":false,"fragments":[]}}\n'
  );
  const result = await readWriterCorrectionStream(response, {
    paragraphs,
    onEvent: () => null,
  });
  assert.equal(result.paragraph_results[0].original_text, "甲");
  assert.ok(result.paragraph_results[1].error);
});
test("all native writer templates compile; no hybrid iframe remains", () => {
  for (const file of fs
    .readdirSync(path.join(root, "components/write"))
    .filter((file) => file.endsWith(".vue"))) {
    const source = fs.readFileSync(
        path.join(root, "components/write", file),
        "utf8"
      ),
      sfc = compiler.parseComponent(source);
    assert.deepEqual(compiler.compile(sfc.template.content).errors, [], file);
  }
  const route = fs.readFileSync(
    path.join(root, "pages/write/edit/_id.vue"),
    "utf8"
  );
  assert.ok(!route.includes("iframe"));
  assert.ok(!route.includes("mobileUrl"));
});

test("corrupt content is rejected before claiming a lock or touching server drafts", async () => {
  const f = fixture({ reader: { content: "{broken" } });
  await assert.rejects(f.session.open(10), /无法解析/);
  assert.equal(f.writes.length, 0);
  await f.session.close();
});
test("writer content validation accepts real text/image/vocabulary formats and rejects other objects", () => {
  const { validateWriterContent } = load("utils/writer/validate.js");
  validateWriterContent({
    article_type: "richtext",
    content:
      '[{"type":"text","value":"正文","id":42},{"type":"image","img":"https://fixture.test/a.png"}]',
  });
  validateWriterContent({
    article_type: "worldVocabulary",
    content: '{"desc":"角色","attributes":[],"relations":[]}',
  });
  assert.throws(() => validateWriterContent({ content: "{}" }), /段落格式/);
  assert.throws(
    () =>
      validateWriterContent({
        article_type: "worldVocabulary",
        content: '{"attributes":{}}',
      }),
    /词条数据/
  );
});
test("assistant stream merger handles cumulative updates, overlap and repeated replay", () => {
  const { mergeWriterStreamText: merge } = load("utils/writer/stream-text.js");
  assert.equal(merge("旅人", "旅人出发"), "旅人出发");
  assert.equal(merge("旅人出发", "出发"), "旅人出发");
  assert.equal(merge("旅人出发", "发往森林"), "旅人出发往森林");
  assert.equal(merge("旅人", "打开地图"), "旅人打开地图");
});

test("writer route renders on a server without crypto and defers editor imports to the browser", async () => {
  const Vue = require("vue");
  const { createRenderer } = require("vue-server-renderer");
  const sfc = compiler.parseComponent(
    fs.readFileSync(path.join(root, "pages/write/edit/_id.vue"), "utf8")
  );
  const code = babel.transformSync(sfc.script.content, {
    configFile: false,
    babelrc: false,
    plugins: ["@babel/plugin-transform-modules-commonjs"],
  }).code;
  function evaluate(client) {
    const exports = {};
    // No crypto/window globals; loading the editor on the server is the regression.
    vm.runInNewContext(code, {
      exports,
      process: { client, server: !client },
      require(specifier) {
        assert.fail(`Route eagerly loaded browser dependency: ${specifier}`);
      },
    });
    return exports.default;
  }
  const serverRoute = evaluate(false);
  const render = compiler.compileToFunctions(sfc.template.content);
  const app = new Vue({
    ...serverRoute,
    ...render,
    components: {
      ...serverRoute.components,
      "client-only": require("vue-client-only"),
    },
    beforeCreate() {
      this.$route = { params: { id: "7" } };
    },
  });
  const html = await createRenderer().renderToString(app);
  assert.match(html, /正在准备写作工作台/);
  assert.equal(typeof evaluate(true).components.WriterWorkspace, "function");
});

test("version previews render stored prose and vocabulary without mutating snapshots or exposing malformed JSON", () => {
  const { writerVersionPreview, versionImageSource } = load(
    "utils/writer/version-preview.js"
  );
  const article = {
    article_type: "richtext",
    content: JSON.stringify([
      { type: "text", id: 42, value: "第一段。\n第二行😀" },
      { type: "image", img: "https://fixture.test/image.png" },
    ]),
  };
  const original = JSON.stringify(article),
    preview = writerVersionPreview(article);
  assert.equal(preview.blocks[0].value, "第一段。\n第二行😀");
  assert.equal(preview.imageCount, 1);
  assert.equal(preview.textCount, Array.from(preview.blocks[0].value).length);
  assert.equal(JSON.stringify(article), original);
  const vocabulary = writerVersionPreview({
    article_type: "worldVocabulary",
    content: JSON.stringify({
      desc: "简介",
      attributes: [null, { name: "职业", content: "制图师" }],
      relations: [{ id: 8, name: "森林", relation: "故乡" }],
    }),
  });
  assert.equal(vocabulary.blocks[0].value, "简介");
  assert.equal(vocabulary.vocabulary.attributes.length, 1);
  assert.equal(vocabulary.vocabulary.relations[0].name, "森林");
  for (const content of ['[{"type":', '{"unsupported": true}']) {
    const invalid = writerVersionPreview({ article_type: "richtext", content });
    assert.ok(invalid.error);
    assert.equal(invalid.blocks.length, 0);
  }
  assert.equal(versionImageSource("javascript:alert(1)"), "");
});

const catalog = load("utils/writer/catalog.js");
const catalogFixture = [
  { article_id: 1, article_type: "text" },
  { article_id: 2, article_type: "spliter" },
  { article_id: 3, article_type: "text" },
  { article_id: 4, article_type: "text" },
  { article_id: 5, article_type: "spliter" },
  { article_id: 6, article_type: "text" },
  { article_id: 7, article_type: "spliter" },
];
const catalogIds = (rows) => plain(rows.map((row) => row.article_id));
test("folded volumes hide only their children; filtered matches retain volume context", () => {
  assert.deepEqual(
    catalogIds(
      catalog.catalogRows(catalogFixture, [2, 5]).map((row) => row.item)
    ),
    [1, 2, 5, 7]
  );
  const rows = catalog.catalogRows(catalogFixture, [2], new Set([4]));
  assert.deepEqual(catalogIds(rows.map((row) => row.item)), [2, 4]);
  assert.equal(rows[0].count, 2);
  assert.equal(rows[1].parent, 2);
  assert.deepEqual(
    catalogIds(
      catalog.catalogRows(catalogFixture, [], new Set()).map((row) => row.item)
    ),
    []
  );
});
test("catalog moves are complete permutations; chapters cross volumes and volumes retain children", () => {
  const before = JSON.stringify(catalogFixture);
  assert.deepEqual(
    catalogIds(catalog.moveCatalog(catalogFixture, 3, 5, "after").rows),
    [1, 2, 4, 5, 3, 6, 7]
  );
  const volume = catalog.moveCatalog(catalogFixture, 2, 6, "after");
  assert.deepEqual(catalogIds(volume.rows), [1, 5, 6, 2, 3, 4, 7]);
  assert.equal(volume.markerId, 6);
  assert.deepEqual(
    catalogIds(catalog.moveCatalog(catalogFixture, 5, 3, "before").rows),
    [1, 5, 6, 2, 3, 4, 7]
  );
  assert.equal(catalog.moveCatalog(catalogFixture, 2, 4, "after"), null);
  assert.equal(catalog.moveCatalog(catalogFixture, 3, 4, "before"), null);
  assert.equal(catalog.moveCatalog(catalogFixture, 99, 4, "after"), null);
  assert.equal(JSON.stringify(catalogFixture), before);
});

test("statistics use actual Shanghai dates and sort the latest 30 calendar days", () => {
  const { statisticDate, normalizeStatistics } = load(
    "utils/writer/statistics.js"
  );
  assert.equal(statisticDate("2026-09-10T16:00:00.000Z"), "2026-09-11");
  assert.equal(statisticDate("2026-09-11 00:00:00"), "2026-09-11");
  assert.equal(statisticDate("2026-02-30"), "");
  const rows = Array.from({ length: 32 }, (_, index) => ({
    date: new Date(Date.UTC(2026, 8, index + 1)).toISOString(),
    clicks: String(index),
  })).reverse();
  const result = normalizeStatistics(rows);
  assert.equal(result.length, 30);
  assert.equal(result[0].date, "2026-09-03");
  assert.equal(result[29].date, "2026-10-02");
  assert.equal(result[29].clicks, 31);
});
test("statistics distinguish snapshot comparisons from yesterday and retain missing values", () => {
  const { normalizeStatistics, metricChange } = load(
    "utils/writer/statistics.js"
  );
  const rows = normalizeStatistics([
    { date: "2026-10-01", clicks: 10 },
    { date: "2026-10-04", clicks: 8, nices: "" },
  ]);
  assert.equal(rows[1].nices, null);
  assert.deepEqual(plain(metricChange(rows, "clicks")), {
    value: -2,
    label: "较上次",
  });
  assert.equal(metricChange(rows, "nices"), null);
  assert.equal(metricChange(rows.slice(0, 1), "clicks"), null);
});
test("statistics charts keep date spacing, break at missing metrics, and handle zero/single snapshots", () => {
  const { normalizeStatistics, chartGeometry } = load(
    "utils/writer/statistics.js"
  );
  const rows = normalizeStatistics([
    { date: "2026-10-01", clicks: 0 },
    { date: "2026-10-02" },
    { date: "2026-10-05", clicks: 4 },
  ]);
  const chart = chartGeometry(rows, "clicks", 300);
  assert.equal(
    chart.points[1].x - chart.points[0].x,
    (chart.right - chart.left) / 4
  );
  assert.equal(chart.points[1].y, null);
  assert.equal((chart.path.match(/M/g) || []).length, 2);
  assert.ok(!chart.path.includes("NaN"));
  const single = chartGeometry(rows.slice(0, 1), "clicks", 210);
  assert.equal(single.points[0].x, (single.left + single.right) / 2);
  assert.equal(single.points[0].y, single.bottom);
  assert.equal(chartGeometry([], "clicks").path, "");
});

test("catalog badges detect nested writer snapshots and title-only edits without marking drafts", () => {
  const { normalizeCatalogArticle, hasUnpublishedCatalogChanges } = load(
    "utils/writer/catalog.js"
  );
  const published = {
    article_id: 18,
    article_type: "richtext",
    is_draft: 0,
    title: "原题",
    content_hash: "published",
  };
  const nested = {
    ...published,
    article_writer: { title: "修改后的题目", content_hash: "published" },
  };
  assert.equal(hasUnpublishedCatalogChanges(nested), true);
  assert.equal(normalizeCatalogArticle(nested).writer_title, "修改后的题目");
  assert.equal(
    hasUnpublishedCatalogChanges({
      ...published,
      article_writer: { title: "原题", content_hash: "edited" },
    }),
    true
  );
  assert.equal(
    hasUnpublishedCatalogChanges({
      ...published,
      article_writer: { title: "原题", content_hash: "published" },
    }),
    false
  );
  assert.equal(hasUnpublishedCatalogChanges({ ...nested, is_draft: 1 }), false);
  assert.equal(
    hasUnpublishedCatalogChanges({ ...nested, article_type: "spliter" }),
    false
  );
  assert.equal(hasUnpublishedCatalogChanges(published), false);
  assert.equal(
    hasUnpublishedCatalogChanges({
      ...published,
      writer_content_hash: "edited",
    }),
    true
  );
  assert.equal(
    hasUnpublishedCatalogChanges({ ...nested, local_writer_modified: false }),
    false
  );
});
test("catalog counts prefer live drafts, including empty drafts, without counting images or vocabulary metadata", () => {
  const { normalizeCatalogArticle, catalogTextCount, writerTextCount } = load("utils/writer/catalog.js");
  const article = { article_type: "richtext", text_count: 6000,
    article_writer: { text_count: 10 } };
  assert.equal(catalogTextCount(normalizeCatalogArticle(article)), 10);
  assert.equal(catalogTextCount({ ...article, local_writer_text_count: 0 }), 0);
  assert.equal(catalogTextCount({ text_count: 6000, article_writer: { text_count: 0 } }), 0);
  assert.equal(catalogTextCount({ text_count: 6000 }), 6000);
  assert.equal(catalogTextCount({ text_count: 6000, article_writer: { text_count: null } }), 6000);
  assert.equal(writerTextCount({ article_type: "richtext", content: JSON.stringify([
    { type: "text", value: "最新草稿" }, { type: "image", img: "https://fixture.test/image.png" },
    { type: "text", value: "第二段" }
  ]) }), 7);
  assert.equal(writerTextCount({ article_type: "worldOutline", content: "[]" }), 0);
  assert.equal(writerTextCount({ article_type: "worldVocabulary", content: JSON.stringify({
    desc: "词条简介", attributes: [{ content: "属性不计入正文字数" }]
  }) }), 4);
  assert.equal(writerTextCount({ article_type: "richtext", content: "invalid" }), null);
});
test("saving and adopting author drafts preserve the separate published comparison baseline", async () => {
  const f = fixture();
  await f.session.open(10);
  const published = f.session.publishedSignature;
  f.session.article.title = "保存后的作者稿件";
  await f.session.save();
  assert.equal(f.session.publishedSignature, published);
  assert.notEqual(f.session.baseline, published);
  f.session.adoptRemote({
    title: "另一位作者的编辑",
    content: f.session.article.content,
  });
  assert.equal(f.session.publishedSignature, published);
  await f.session.close();
});
