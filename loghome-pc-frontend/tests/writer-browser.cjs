// Integration harness: all APIs are intercepted, so no real account or work is modified.
const assert = require("node:assert/strict");
const path = require("node:path"),
  fs = require("node:fs");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE ||
  "playwright");
const base = process.env.WRITER_TEST_URL || "http://127.0.0.1:3117";
const access = {
  can_view_articles: true,
  can_edit_draft: true,
  can_add_article: true,
  can_delete_article: true,
  can_sort_article: true,
  can_publish_article: true,
  is_owner: true,
  can_manage_collaborators: true,
};
const novel = {
  novel_id: 7,
  name: "方块世界的旅人",
  content: "从一封远方的信开始，一段关于森林与归途的故事。",
  author_id: 99,
  novel_type: "fiction",
  is_personal: 1,
  is_complete: 0,
};
const text = (value) => JSON.stringify([{ type: "text", value, id: 42 }]);
const reader = new Map([
  [
    10,
    {
      article_id: 10,
      novel_id: 7,
      article_chapter: 1,
      title: "第一章 · 林间来信",
      content: text(
        "清晨的雾沿着木屋缓慢升起。\n旅人把信放在桌上，窗外的森林传来鸟鸣。"
      ),
      article_type: "richtext",
      is_draft: 1,
      text_count: 39,
      current_access: access,
      novel_info: novel,
    },
  ],
  [
    11,
    {
      article_id: 11,
      novel_id: 7,
      article_chapter: 2,
      title: "第二章 · 远方的灯",
      content: text("夜色笼罩群山，远处仍有灯火。"),
      article_type: "richtext",
      is_draft: 0,
      text_count: 17,
      current_access: access,
      novel_info: novel,
    },
  ],
  [
    12,
    {
      article_id: 12,
      novel_id: 7,
      article_chapter: 3,
      title: "人物 · 青禾",
      content: JSON.stringify({
        desc: "住在森林边缘的年轻旅人",
        attributes: [{ id: 1, name: "职业", content: "制图师" }],
        relations: [],
      }),
      article_type: "worldVocabulary",
      is_draft: 1,
      current_access: access,
      novel_info: novel,
    },
  ],
  [
    20,
    {
      article_id: 20,
      novel_id: 8,
      article_chapter: 1,
      title: "第一话 · 旅途",
      content: JSON.stringify({
        pages: [
          {
            id: "p1",
            url: "https://fixture.test/page.png",
            thumb: "https://fixture.test/page.png",
            width: 600,
            height: 900,
          },
        ],
      }),
      article_type: "mangaPage",
      is_draft: 1,
      manga_revision: "revision-1",
      current_access: access,
    },
  ],
]);
const writers = new Map(
  [...reader]
    .filter(([id]) => id < 20)
    .map(([id, article]) => [
      id,
      { ...article, collaboration: { mode: "legacy_lock" } },
    ])
);
const writes = [],
  errors = [];
let failSave = false,
  uploads = 0;
const png =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=";
async function api(route) {
  const request = route.request(),
    url = new URL(request.url()),
    name = url.pathname.split("/").pop(),
    query = Object.fromEntries(url.searchParams);
  if (url.origin === new URL(base).origin) return route.continue();
  if (request.method() === "OPTIONS")
    return route.fulfill({
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "*",
        "access-control-allow-methods": "GET, POST, OPTIONS",
      },
    });
  if (/\.(png|jpg|webp)$/.test(url.pathname))
    return route.fulfill({
      status: 200,
      contentType: "image/png",
      body: Buffer.from(png, "base64"),
      headers: { "access-control-allow-origin": "*" },
    });
  let body = {};
  try {
    body = request.postDataJSON() || {};
  } catch (_) {}
  if (request.method() === "POST") writes.push({ name, body });
  const id = Number(query.id || body.article_id);
  let data = {},
    status = 200,
    contentType = "application/json";
  const current =
    Number(query.novel_id || query.id) === 8
      ? { ...novel, novel_id: 8, name: "森林漫画", novel_type: "manga" }
      : novel;
  switch (name) {
    case "get_novel_by_id":
    case "get_manga":
      data = [current];
      break;
    case "get_novel_collaboration_info":
      data = { novel: current, access, collaborators: [] };
      break;
    case "get_articles":
      data = [...reader.values()]
        .filter((a) => a.novel_id === Number(query.id))
        .map((a) => ({
          ...a,
          content: undefined,
          collaboration_mode: "legacy_lock",
          writer_title: writers.get(a.article_id)?.title,
        }));
      break;
    case "get_articles_search_snapshot":
      data = [...reader.values()]
        .filter((a) => a.novel_id === 7)
        .map((a) => ({
          article_id: a.article_id,
          published: { title: a.title, content: a.content },
          latest_writer: writers.get(a.article_id),
        }));
      break;
    case "get_article":
      data = [reader.get(id)];
      break;
    case "get_article_writer":
      data = writers.get(id) || null;
      break;
    case "claim_article_edit_lock":
    case "heartbeat_article_edit_lock":
    case "release_article_edit_lock":
      data = {
        msg: "ok",
        lock: { name: "测试作者", session_id: body.session_id },
      };
      break;
    case "upload_article_writer":
      if (failSave) {
        status = 503;
        data = { msg: "模拟离线，保留本机草稿" };
        break;
      }
      writers.set(id, { ...writers.get(id), ...body });
      data = {
        writer_snapshot: {
          create_time: body.create_time,
          updated_at: "2026-10-10T03:00:00Z",
        },
      };
      break;
    case "modify_article":
      reader.set(id, {
        ...reader.get(id),
        ...body,
        content:
          typeof body.content === "string"
            ? body.content
            : JSON.stringify(body.content),
        manga_revision: id === 20 ? "revision-" + Date.now() : undefined,
      });
      data = { msg: "ok" };
      break;
    case "upload_manga_page":
      uploads++;
      if (uploads === 1) {
        status = 503;
        data = { msg: "模拟第一次上传失败" };
        break;
      }
      data = {
        url: `https://fixture.test/upload-${uploads}.png`,
        pages: [
          {
            url: `https://fixture.test/upload-${uploads}.png`,
            thumb: `https://fixture.test/upload-${uploads}.png`,
            readingUrl: `https://fixture.test/reading-${uploads}.png`,
            width: 600,
            height: 900,
          },
        ],
      };
      break;
    case "get_article_history":
      data = [
        {
          id: 1,
          title: "初稿",
          content: text("历史记录里的第一句话。"),
          create_time: "20261009080000",
          editor_name: "测试作者",
        },
      ];
      break;
    case "get_article_text_correction":
      data = {
        paragraph_results: [],
        corrections: [],
        errors: [],
        summary: { paragraph_count: 1 },
      };
      break;
    case "writer_novel_ai_assist_stream":
      contentType = "application/x-ndjson";
      data =
        JSON.stringify({
          type: "delta",
          event_id: 1,
          content: "<draft>旅人推开门，晨光照亮了新的地图。</draft>",
        }) +
        "\n" +
        JSON.stringify({ type: "done", event_id: 2 }) +
        "\n";
      break;
    case "get_scheduled_tasks":
      data = [];
      break;
    case "get_articles_deleted":
    case "get_article_feedbacks":
    case "get_novel_tags":
    case "get_novel_specific_statistics":
      data = [];
      break;
    case "get_novel_writing_calendar":
      data = {
        from: "2026-10-01",
        to: "2026-10-10",
        summary: {
          active_days: 3,
          current_streak: 2,
          total_written_chars: 1800,
        },
        days: [
          {
            date: "2026-10-10",
            level: 3,
            written_chars: 800,
            active_seconds: 900,
          },
        ],
      };
      break;
    case "userprofile":
      data = { user_id: 99, name: "测试作者" };
      break;
    case "get_writer_background_skins":
      data = [];
      break;
    default:
      data = { msg: "ok" };
  }
  await route.fulfill({
    status,
    contentType,
    body: typeof data === "string" ? data : JSON.stringify(data),
    headers: { "access-control-allow-origin": "*" },
  });
}
async function run() {
  const browser = await chromium.launch({ headless: true }),
    context = await browser.newContext({
      viewport: { width: 1440, height: 960 },
    }),
    page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await context.addInitScript(() =>
    localStorage.setItem(
      "token",
      JSON.stringify({ tk: "writer-test-only-token", id: 99 })
    )
  );
  await context.route("**/*", api);
  const out =
    process.env.WRITER_SCREENSHOT_DIR ||
    path.resolve(__dirname, "../../_tmp/writer-migration");
  fs.mkdirSync(out, { recursive: true });
  try {
    await page.goto(base + "/write/edit/7?article=10");
    await page.locator(".ProseMirror").waitFor({ timeout: 30000 });
    assert.equal(await page.locator("iframe").count(), 0);
    assert.equal(
      await page.locator(".chapter-title").inputValue(),
      "第一章 · 林间来信"
    );
    await page.locator(".chapter-title").fill("第一章 · 本机修改");
    await page.locator(".ProseMirror").fill("清晨，新故事从这里开始。");
    await page
      .locator(".workspace-header")
      .locator('button[title="Ctrl / ⌘ S"]')
      .click();
    await page.waitForFunction(() =>
      document.querySelector(".save-indicator").textContent.includes("已同步")
    );
    assert.ok(
      writes.some(
        (w) =>
          w.name === "upload_article_writer" &&
          w.body.title === "第一章 · 本机修改"
      )
    );
    assert.equal(reader.get(10).title, "第一章 · 林间来信");
    await page.getByRole("button", { name: "写作偏好", exact: true }).click();
    await page
      .getByRole("textbox", { name: "自定义快捷输入", exact: true })
      .fill("，|。|“”|《》");
    await page
      .getByRole("textbox", { name: "自定义快捷输入", exact: true })
      .blur();
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-desktop.png"),
    });
    await page
      .locator(".writer-tools")
      .getByText("主题", { exact: false })
      .locator("select")
      .selectOption("dark");
    // Allow color-only feedback to settle before visual inspection.
    await page.waitForTimeout(200);
    const darkStyles = await page.evaluate(() => {
      const style = (selector) =>
        getComputedStyle(document.querySelector(selector));
      return {
        body: style(".ProseMirror").color,
        button: style(".workspace-header button").color,
        selected: style(".catalog-item.selected").backgroundColor,
      };
    });
    assert.deepEqual(darkStyles, {
      body: "rgb(233, 232, 228)",
      button: "rgb(233, 232, 228)",
      selected: "rgb(54, 54, 52)",
    });
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-dark.png"),
    });
    await page
      .locator(".workspace-header")
      .getByRole("button", { name: "发布", exact: true })
      .click();
    const darkDialog = page
      .locator(".writer-dialog.theme-dark")
      .filter({ hasText: "检查与发布" });
    await darkDialog.waitFor();
    assert.equal(
      await darkDialog.evaluate(
        (node) => getComputedStyle(node).backgroundColor
      ),
      "rgb(32, 32, 32)"
    );
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-publish-dark.png"),
    });
    await darkDialog.locator(".el-dialog__headerbtn").click();
    await page
      .locator(".writer-tools")
      .getByText("主题", { exact: false })
      .locator("select")
      .selectOption("sepia");
    await page.waitForTimeout(200);
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-sepia.png"),
    });
    await page
      .locator(".writer-tools")
      .getByText("主题", { exact: false })
      .locator("select")
      .selectOption("light");
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "新建章节", exact: true }).click();
    await page
      .locator(".writer-dialog.theme-light")
      .filter({ hasText: "新建内容" })
      .waitFor();
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-create.png"),
    });
    await page
      .locator(".writer-dialog.theme-light")
      .filter({ hasText: "新建内容" })
      .locator(".el-dialog__headerbtn")
      .click();
    await page
      .locator(".workspace-header")
      .getByRole("button", { name: "专注", exact: true })
      .click();
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-focus.png"),
    });
    await page.keyboard.press("Escape");
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth
      ),
      false
    );
    await page
      .locator(".workspace-header")
      .getByRole("button", { name: /预览/ })
      .click();
    await page.locator(".writer-reader-preview").waitFor();
    assert.ok(
      (await page.locator(".writer-reader-preview").innerText()).includes(
        "清晨"
      )
    );
    await page
      .locator(".writer-reader-preview .el-dialog__headerbtn")
      .click()
      .catch(async () => page.keyboard.press("Escape"));
    await page
      .locator(".workspace-header")
      .getByRole("button", { name: "发布", exact: true })
      .click();
    await page.getByRole("dialog").filter({ hasText: "检查与发布" }).waitFor();
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-publish.png"),
    });
    await page.getByRole("button", { name: "基础校对", exact: true }).click();
    await page.getByRole("button", { name: "确认发布", exact: true }).click();
    await page.waitForTimeout(300);
    assert.ok(
      writes.some((w) => w.name === "modify_article" && w.body.is_draft === 0)
    );
    assert.equal(reader.get(10).title, "第一章 · 本机修改");
    await page.getByRole("button", { name: "AI 助手", exact: true }).click();
    await page.getByRole("textbox", { name: "写作助手指令" }).fill("续写一句");
    await page
      .locator(".writer-ai")
      .getByRole("button", { name: "发送", exact: true })
      .click();
    await page
      .locator(".el-message-box")
      .getByRole("button", { name: "确定", exact: true })
      .click();
    await page.getByRole("button", { name: "预览采用", exact: true }).waitFor();
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-ai.png"),
    });
    await page.getByRole("button", { name: "预览采用", exact: true }).click();
    await page.getByRole("button", { name: "插入到光标", exact: true }).click();
    assert.ok(
      (await page.locator(".ProseMirror").innerText()).includes("新的地图")
    );
    await page
      .locator(".workspace-header")
      .locator('button[title="Ctrl / ⌘ S"]')
      .click();
    await page.waitForFunction(() =>
      document.querySelector(".save-indicator").textContent.includes("已同步")
    );
    writers.set(10, { ...writers.get(10), title: "云端的新标题" });
    await page.locator(".chapter-title").fill("不同的本机标题");
    await page
      .locator(".workspace-header")
      .locator('button[title="Ctrl / ⌘ S"]')
      .click();
    await page
      .getByRole("button", { name: "使用云端版本", exact: true })
      .waitFor();
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-conflict.png"),
    });
    await page
      .getByRole("button", { name: "使用云端版本", exact: true })
      .click();
    assert.equal(
      await page.locator(".chapter-title").inputValue(),
      "云端的新标题"
    );
    await page
      .getByRole("textbox", { name: "搜索章节", exact: true })
      .fill("远处");
    await page.waitForTimeout(600);
    assert.ok(
      (await page.locator(".catalog-list").innerText()).includes("远方")
    );
    await page.getByRole("textbox", { name: "搜索章节", exact: true }).fill("");
    await page
      .getByRole("button", { name: "云端时间机器", exact: true })
      .click();
    await page.getByRole("button", { name: "查看版本", exact: true }).click();
    await page
      .getByRole("dialog")
      .filter({ hasText: "历史版本内容" })
      .waitFor();
    assert.ok(
      (
        await page
          .getByRole("dialog")
          .filter({ hasText: "历史版本内容" })
          .innerText()
      ).includes("历史记录")
    );
    await page
      .getByRole("dialog")
      .filter({ hasText: "历史版本内容" })
      .locator(".el-dialog__headerbtn")
      .click();
    await page.getByRole("button", { name: "写作日历", exact: true }).click();
    await page.locator(".writing-calendar span").first().waitFor();
    await page.getByRole("button", { name: "阅读统计", exact: true }).click();
    await page.locator(".writer-tools").getByText("暂无阅读统计").waitFor();
    await page.getByRole("button", { name: "作品索引", exact: true }).click();
    await page
      .getByRole("button", { name: "更新作品索引", exact: true })
      .click();
    await page.waitForTimeout(150);
    assert.ok(
      writes.some(
        (w) => w.name === "request_novel_indexing" && w.body.novel_id === 7
      )
    );
    await page.getByRole("button", { name: "JSON 源码", exact: true }).click();
    await page
      .getByRole("textbox", { name: "章节 JSON 源码", exact: true })
      .fill(
        JSON.stringify([
          { type: "text", id: 42, value: "源码编辑后的有效段落。" },
        ])
      );
    await page.getByRole("button", { name: "应用源码", exact: true }).click();
    assert.ok(
      (await page.locator(".ProseMirror").innerText()).includes("有效段落")
    );
    await page.locator(".catalog-entry").filter({ hasText: "青禾" }).click();
    await page.locator(".vocabulary-editor").waitFor();
    assert.ok(
      (await page.locator(".vocabulary-editor").innerText()).includes("属性")
    );
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-1024.png"),
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth
      ),
      false
    );
    await page.setViewportSize({ width: 900, height: 768 });
    await page.getByRole("button", { name: "写作偏好", exact: true }).click();
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-900.png"),
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth
      ),
      false
    );
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto(base + "/write/edit/8?article=20");
    await page.locator(".manga-writer").waitFor();
    assert.ok(
      (await page.locator(".manga-writer").innerText()).includes("1 页")
    );
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-manga.png"),
    });
    await page
      .locator('.manga-upload-toolbar input[type="file"]')
      .setInputFiles([
        {
          name: "page-10.png",
          mimeType: "image/png",
          buffer: Buffer.from(png, "base64"),
        },
        {
          name: "page-2.png",
          mimeType: "image/png",
          buffer: Buffer.from(png, "base64"),
        },
      ]);
    await page.getByRole("button", { name: "重试", exact: true }).waitFor();
    await page.getByRole("button", { name: "重试", exact: true }).click();
    await page.waitForFunction(
      () => document.querySelectorAll(".manga-page-grid article").length === 3
    );
    assert.ok(
      (
        await page
          .locator(".manga-page-grid article")
          .nth(1)
          .locator("img")
          .getAttribute("src")
      ).includes("upload-3")
    );
    assert.ok(
      (
        await page
          .locator(".manga-page-grid article")
          .nth(2)
          .locator("img")
          .getAttribute("src")
      ).includes("upload-2")
    );
    await page.getByRole("button", { name: "保存并发布", exact: true }).click();
    await page.waitForTimeout(300);
    assert.ok(
      writes.some(
        (w) =>
          w.name === "modify_article" &&
          w.body.expected_manga_revision === "revision-1"
      )
    );
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify(
        {
          passed: true,
          flows: [
            "native editing",
            "safe save",
            "reader preview",
            "publish",
            "AI stream and adoption",
            "cloud conflict",
            "full-text search",
            "vocabulary",
            "1024px layout",
            "manga revision",
            "manga ordered retry",
            "history preview",
            "calendar and statistics",
            "indexing",
            "JSON source",
            "dark theme and shortcuts",
          ],
          screenshots: out,
          apiWrites: writes.length,
          pageErrors: errors,
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error("Browser errors:", errors);
    console.error(
      "API writes:",
      writes.map((w) => w.name)
    );
    console.error((await page.locator("body").innerText()).slice(0, 3000));
    await page.screenshot({
      animations: "disabled",
      path: path.join(out, "writer-failure.png"),
    });
    throw error;
  } finally {
    await browser.close();
  }
}
module.exports = { api, reader, writers, novel, access };
if (require.main === module) {
  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
