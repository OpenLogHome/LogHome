// Uses a disposable local Hocuspocus server and mocked HTTP; never connects to real work.
const assert = require("node:assert/strict"),
  path = require("node:path");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE ||
  "playwright");
const backend = path.resolve(__dirname, "../../loghome-ai-backend");
const { Server } = require(path.join(
  backend,
  "node_modules/@hocuspocus/server"
));
const Y = require(path.join(backend, "node_modules/yjs"));
const { prosemirrorJSONToYDoc, yDocToProsemirrorJSON } = require(path.join(
  backend,
  "node_modules/y-prosemirror"
));
const schema = require(path.join(backend, "utils/writerCollaborationSchema"));
const base = process.env.WRITER_TEST_URL || "http://127.0.0.1:3117";
const access = {
  can_view_articles: true,
  can_edit_draft: true,
  can_add_article: true,
  can_delete_article: true,
  can_sort_article: true,
  can_publish_article: true,
  is_owner: true,
};
const novel = {
  novel_id: 7,
  name: "协作测试作品",
  novel_type: "fiction",
  author_id: 99,
  is_personal: 1,
};
const content = JSON.stringify([
  { type: "text", id: 42, value: "共享文档初稿。" },
]);
const collaboration = {
  mode: "realtime_crdt",
  document_name: "article:10:v1",
  revision: 1,
  can_edit: true,
};
const article = {
  article_id: 10,
  novel_id: 7,
  title: "共同写作",
  article_type: "richtext",
  is_draft: 1,
  content,
  current_access: access,
  collaboration,
  novel_info: novel,
};
const seed = prosemirrorJSONToYDoc(
  schema,
  {
    type: "doc",
    content: [
      {
        type: "paragraph",
        attrs: { legacyId: 42 },
        content: [{ type: "text", text: "共享文档初稿。" }],
      },
    ],
  },
  "body"
);
seed.getText("title").insert(0, "共同写作");
let range = 256,
  checkpoints = 0,
  chat = 0;
const writes = [],
  errors = [];
const server = new Server({
  port: 3118,
  address: "127.0.0.1",
  quiet: true,
  unloadImmediately: false,
  stopOnSignals: false,
  async onAuthenticate({ token }) {
    if (!token.startsWith("fixture-")) throw Error("denied");
    return { userId: Number(token.slice(8)) };
  },
  async onLoadDocument({ document }) {
    Y.applyUpdate(document, Y.encodeStateAsUpdate(seed));
    return document;
  },
  onStateless({ payload, document, connection, context }) {
    const e = JSON.parse(payload);
    if (e.type === "collaboration_chat_history_request")
      connection.sendStateless(
        JSON.stringify({ type: "collaboration_chat_history", messages: [] })
      );
    if (e.type === "collaboration_chat_send") {
      chat++;
      document.broadcastStateless(
        JSON.stringify({
          type: "collaboration_chat_message",
          message: {
            id: chat,
            name: "测试作者",
            content: e.content,
            user_id: connection.context.userId,
          },
        })
      );
    }
  },
});
async function api(route) {
  const req = route.request(),
    url = new URL(req.url()),
    name = url.pathname.split("/").pop();
  if (url.origin === new URL(base).origin) return route.continue();
  if (req.method() === "OPTIONS")
    return route.fulfill({
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "*",
        "access-control-allow-methods": "GET, POST, OPTIONS",
      },
    });
  let body = {};
  try {
    body = req.postDataJSON() || {};
  } catch (_) {}
  if (req.method() === "POST") writes.push({ name, body });
  let data = {};
  switch (name) {
    case "get_novel_by_id":
      data = [novel];
      break;
    case "get_novel_collaboration_info":
      data = { novel, access, collaborators: [] };
      break;
    case "get_articles":
      data = [{ ...article, collaboration_mode: "realtime_crdt" }];
      break;
    case "get_article":
      data = [article];
      break;
    case "get_article_writer":
      data = article;
      break;
    case "paragraph-id-range":
      data = { data: { start: range, end: range + 255 } };
      range += 256;
      break;
    case "status":
      data = { data: collaboration };
      break;
    case "checkpoint":
      checkpoints++;
      data = {
        data: { revision: checkpoints + 1, collab_revision: checkpoints + 1 },
      };
      break;
    case "get_writer_background_skins":
      data = [];
      break;
    case "subscription":
      data = { data: { active: false } };
      break;
    default:
      data = { msg: "ok" };
  }
  return route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(data),
    headers: { "access-control-allow-origin": "*" },
  });
}
async function run() {
  await server.listen();
  const browser = await chromium.launch({ headless: true });
  let pages = [];
  try {
    const contexts = await Promise.all(
      [99, 100].map(async (id) => {
        const c = await browser.newContext({
          viewport: { width: 1440, height: 960 },
        });
        await c.addInitScript(
          ({ id }) => {
            localStorage.setItem(
              "token",
              JSON.stringify({ tk: "fixture-" + id, id })
            );
            localStorage.setItem(
              "loghomeCollaborationWsUrl",
              "ws://127.0.0.1:3118"
            );
          },
          { id }
        );
        await c.route("**/*", api);
        return c;
      })
    );
    pages = await Promise.all(contexts.map((c) => c.newPage()));
    for (const p of pages) p.on("pageerror", (e) => errors.push(e.message));
    await Promise.all(
      pages.map((p) => p.goto(base + "/write/edit/7?article=10"))
    );
    await Promise.all(
      pages.map((p) => p.locator(".ProseMirror").waitFor({ timeout: 30000 }))
    );
    assert.equal(
      await pages[0].locator(".ProseMirror").innerText(),
      "共享文档初稿。"
    );
    assert.equal(await pages[0].locator(".ProseMirror p").count(), 1);
    await pages[0].locator(".ProseMirror").fill("两端同步的新内容。");
    await pages[1].waitForFunction(() =>
      document
        .querySelector(".ProseMirror")
        .textContent.includes("两端同步的新内容")
    );
    await pages[1].locator(".chapter-title").fill("双方一致的标题");
    await pages[0].waitForFunction(
      () => document.querySelector(".chapter-title").value === "双方一致的标题"
    );
    await Promise.all(
      pages.map((p) =>
        p.getByRole("button", { name: "实时协作", exact: true }).click()
      )
    );
    await pages[0].waitForFunction(
      () => document.querySelectorAll(".presence-item").length === 2
    );
    await pages[0]
      .getByRole("textbox", { name: "协作聊天", exact: true })
      .fill("我们一起完成这一章。");
    await pages[0]
      .locator(".collaboration-panel")
      .getByRole("button", { name: "发送", exact: true })
      .click();
    await pages[1].waitForFunction(() =>
      document
        .querySelector(".collaboration-messages")
        .textContent.includes("一起完成")
    );
    assert.equal(chat, 1);
    await pages[0].locator('button[title="Ctrl / ⌘ S"]').click();
    await pages[0].waitForTimeout(200);
    assert.ok(checkpoints > 0);
    await pages[0]
      .locator(".workspace-header")
      .getByRole("button", { name: "发布", exact: true })
      .click();
    await pages[0]
      .getByRole("button", { name: "确认发布", exact: true })
      .click();
    await pages[0].waitForTimeout(200);
    assert.ok(
      writes.some(
        (w) => w.name === "modify_article" && Number(w.body.collab_revision) > 0
      )
    );
    server.hocuspocus.closeConnections("article:10:v1");
    await Promise.all(
      pages.map((p) =>
        p.waitForFunction(
          () =>
            document.querySelectorAll(".presence-item").length === 2 &&
            document
              .querySelector(".save-indicator")
              .textContent.includes("已同步"),
          {},
          { timeout: 15000 }
        )
      )
    );
    await pages[1].locator(".ProseMirror").fill("重连后继续共同写作。");
    await pages[0].waitForFunction(() =>
      document.querySelector(".ProseMirror").textContent.includes("重连后继续")
    );
    assert.ok(
      !writes.some((w) =>
        ["claim_article_edit_lock", "upload_article_writer"].includes(w.name)
      )
    );
    const doc = server.hocuspocus.documents.get("article:10:v1"),
      json = yDocToProsemirrorJSON(doc, "body");
    assert.equal(json.content[0].attrs.legacyId, 42);
    assert.equal(doc.getText("title").toString(), "双方一致的标题");
    await pages[0].screenshot({
      path: path.resolve(
        __dirname,
        "../../_tmp/writer-migration/writer-collaboration.png"
      ),
    });
    collaboration.can_edit = false;
    server.hocuspocus.closeConnections("article:10:v1");
    await Promise.all(
      pages.map((p) =>
        p.waitForFunction(() =>
          document.querySelector(".save-indicator").textContent.includes("只读")
        )
      )
    );
    assert.equal(
      await pages[0].locator(".ProseMirror").getAttribute("contenteditable"),
      "false"
    );
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify(
        {
          passed: true,
          flows: [
            "initial remote seed",
            "two-client body sync",
            "shared title",
            "presence",
            "chat broadcast",
            "checkpoint",
            "legacy paragraph anchors",
            "publish revision",
            "reconnect",
            "revoked permissions",
          ],
          checkpoints,
          pageErrors: errors,
        },
        null,
        2
      )
    );
  } catch (e) {
    console.error("Realtime browser errors:", errors);
    console.error(
      "Server rooms:",
      [...server.hocuspocus.documents].map(([name, doc]) => ({
        name,
        connections: doc.getConnectionsCount(),
      }))
    );
    for (const p of pages)
      console.error((await p.locator("body").innerText()).slice(0, 2500));
    throw e;
  } finally {
    await browser.close();
    await server.destroy();
    seed.destroy();
  }
}
run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
