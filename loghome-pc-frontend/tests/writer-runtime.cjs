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
