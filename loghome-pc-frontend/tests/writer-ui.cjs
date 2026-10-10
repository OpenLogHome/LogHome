// Long catalog and populated/empty/error panels; all service requests are mocked.
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE ||
  "playwright");
const base = process.env.WRITER_TEST_URL || "http://localhost:3000";
process.env.WRITER_TEST_URL = base;
const { api, reader, writers, novel, access } = require("./writer-browser.cjs");
const out =
  process.env.WRITER_SCREENSHOT_DIR ||
  path.resolve(__dirname, "../../_tmp/writer-polish");
for (let i = 4; i <= 116; i++) {
  const article = {
    ...reader.get(11),
    article_id: 100 + i,
    article_chapter: i,
    title:
      i === 4
        ? "第一卷 方块与言灵术的世界，以及远行者未完的故事"
        : `第 ${i} 章 · 森林与远方的故事`,
    article_type: i === 4 ? "spliter" : "richtext",
    index_is_current: i % 3 === 0,
    writer_index_is_current: i % 2 === 0,
  };
  reader.set(article.article_id, article);
  writers.set(article.article_id, {
    ...article,
    collaboration: { mode: "legacy_lock" },
  });
}
let empty = false,
  fail = false;
const settingsWrites = [];
let failSetting = false;
const settingEndpoints = [
  "set_novel_status",
  "set_novel_update_status",
  "set_novel_reader_ai_setting",
];
const holds = new Map();
function holdRequest(name) {
  let entered, release;
  const started = new Promise((resolve) => {
    entered = resolve;
  });
  const resumed = new Promise((resolve) => {
    release = resolve;
  });
  const hold = { started, resumed, entered, release };
  holds.set(name, hold);
  return hold;
}
async function routeApi(route) {
  const url = new URL(route.request().url()),
    name = url.pathname.split("/").pop();
  if (settingEndpoints.includes(name) && route.request().method() === "POST") {
    const body = route.request().postDataJSON();
    settingsWrites.push({ name, body });
    if (!failSetting) Object.assign(novel, body);
    return route.fulfill({
      status: failSetting ? 503 : 200,
      contentType: "application/json",
      body: JSON.stringify({ msg: failSetting ? "状态保存失败" : "ok" }),
      headers: { "access-control-allow-origin": "*" },
    });
  }
  if (name === "modify_novel" && route.request().method() === "POST") {
    const { name: workName, content } = route.request().postDataJSON();
    Object.assign(novel, { name: workName, content });
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ msg: "ok" }),
      headers: { "access-control-allow-origin": "*" },
    });
  }
  if (url.origin === new URL(base).origin || route.request().method() !== "GET")
    return api(route);
  const shouldFail = name === "get_novel_specific_statistics" && fail;
  const hold = holds.get(name);
  if (hold) {
    holds.delete(name);
    hold.entered();
    await hold.resumed;
  }
  if (shouldFail)
    return route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ msg: "统计服务暂时不可用" }),
    });
  const fixtures = {
    get_novel_collaboration_info: {
      novel: { ...novel, owner_name: "林间作者" },
      access,
      collaborators: empty
        ? []
        : [
            {
              user_id: 15,
              name: "青禾",
              status: "accepted",
              can_edit_article: 1,
              can_publish_article: 0,
            },
            {
              user_id: 16,
              name: "远方的旅人",
              status: "pending",
              can_edit_article: 1,
            },
          ],
    },
    get_novel_specific_statistics: empty
      ? []
      : [
          {
            date: "2026-10-08",
            clicks: 1826,
            nices: 42,
            likes: 27,
            comments: 16,
            shares: 9,
            tippings: 3,
          },
        ],
    get_scheduled_tasks: empty
      ? []
      : [
          {
            task_id: 8,
            novel_id: 7,
            article_title: "第三章 · 深林的灯",
            publish_time: "20261012183000",
          },
        ],
    get_articles_deleted: empty
      ? []
      : [{ article_id: 88, title: "删去的序章" }],
    get_article_feedbacks: empty
      ? []
      : [
          {
            feedback_id: 1,
            username: "读者青禾",
            status: 0,
            feedback_content: "这里的时间似乎与上一章不同，可以再检查一下吗？",
            paragraph_text: "旅人走过了三天的森林。",
          },
        ],
    get_novel_tags: [
      { tag_id: 1, tag_name: "冒险" },
      { tag_id: 2, tag_name: "奇幻" },
    ],
    get_novel_indexing_status: {
      status: "pending",
      queue: { status: "pending" },
    },
    get_article_history: empty
      ? []
      : Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          title: `初稿 · 第 ${i + 1} 次修订`,
          content: reader.get(10).content,
          create_time: "20261009080000",
          editor_name: "林间作者",
        })),
  };
  if (name in fixtures)
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(fixtures[name]),
      headers: { "access-control-allow-origin": "*" },
    });
  return api(route);
}
async function run() {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await context.addInitScript(() =>
    localStorage.setItem(
      "token",
      JSON.stringify({ tk: "writer-ui-fixture", id: 99 })
    )
  );
  await context.route("**/*", routeApi);
  async function snapshot(name) {
    await page.screenshot({
      path: path.join(out, name + ".png"),
      animations: "disabled",
    });
  }
  async function geometry() {
    return page.evaluate(() => {
      const rect = (s) => {
        const r = document.querySelector(s).getBoundingClientRect();
        return {
          top: r.top,
          bottom: r.bottom,
          width: r.width,
          height: r.height,
        };
      };
      return {
        viewport: innerHeight,
        document: document.documentElement.scrollHeight,
        body: document.body.scrollHeight,
        root: rect(".writer-workspace"),
        footer: rect(".editor-statusbar"),
        catalog: rect(".catalog-list"),
      };
    });
  }
  async function contained() {
    const g = await geometry();
    assert.ok(
      g.document <= g.viewport + 1 && g.body <= g.viewport + 1,
      JSON.stringify(g)
    );
    assert.ok(
      g.footer.bottom <= g.viewport + 1,
      "Editor statusbar must remain inside viewport"
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth
      ),
      false
    );
  }
  async function tool(label) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await page.locator(".writer-tools .writer-panel-body").waitFor();
    await page.waitForFunction(
      () => !document.querySelector(".writer-tools .panel-loading")
    );
  }
  try {
    await page.goto(base + "/write/edit/7");
    await page.locator(".catalog-item").nth(115).waitFor({ state: "attached" });
    await snapshot("empty-long-catalog");
    if (process.env.WRITER_UI_BASELINE) {
      console.log("BASELINE EMPTY", await geometry());
      await page.locator(".catalog-entry").first().click();
      await page.locator(".ProseMirror").waitFor();
      console.log("BASELINE EDITOR", await geometry());
      return;
    }
    await contained();
    assert.equal(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).overflowY
      ),
      "hidden"
    );
    const volume = page.locator(".catalog-item.volume");
    await volume.hover();
    const button = volume.locator(".catalog-menu");
    const menuBox = await button.boundingBox(),
      rowBox = await volume.boundingBox();
    assert.equal(menuBox.width, 28);
    assert.equal(menuBox.height, 28);
    assert.ok(menuBox.x + menuBox.width <= rowBox.x + rowBox.width - 5);
    await button.click();
    await page.locator(".writer-popover:visible").waitFor();
    await snapshot("chapter-menu");
    await page.keyboard.press("Escape");
    await page.locator(".catalog-entry").first().click();
    await page.locator(".ProseMirror").waitFor();
    await contained();
    for (const label of [
      "写作偏好",
      "云端时间机器",
      "本机备份",
      "读者纠错",
      "写作日历",
      "阅读统计",
      "定时发布",
      "作品索引",
      "协作者管理",
    ]) {
      await tool(label);
      await contained();
      if (label === "阅读统计") {
        assert.equal(
          await page
            .locator(".tool-metrics")
            .evaluate((el) => getComputedStyle(el).display),
          "grid"
        );
        const cards = page.locator(".tool-metrics > span");
        const first = await cards.nth(0).boundingBox(),
          second = await cards.nth(1).boundingBox();
        assert.equal(first.y, second.y);
        assert.ok(second.x > first.x);
      }
      if (label === "云端时间机器") {
        const header = page.locator(".writer-tools .writer-panel-header");
        const initial = await header.boundingBox();
        await page
          .locator(".writer-tools .writer-panel-body")
          .evaluate((el) => {
            el.scrollTop = el.scrollHeight;
          });
        assert.deepEqual(await header.boundingBox(), initial);
        await contained();
        await page
          .locator(".writer-tools .writer-panel-body")
          .evaluate((el) => {
            el.scrollTop = 0;
          });
      }
      if (label === "读者纠错") await page.locator(".feedback-quote").waitFor();
      await snapshot(label);
      await page
        .getByRole("button", { name: "关闭工具面板", exact: true })
        .click();
      assert.equal(
        await page.locator(".workspace-tool-panel").isVisible(),
        false
      );
      assert.equal(
        await page
          .getByRole("button", { name: label, exact: true })
          .evaluate((el) => el === document.activeElement),
        true
      );
    }
    await tool("回收站");
    await snapshot("回收站");
    await page
      .getByRole("button", { name: "关闭工具面板", exact: true })
      .click();
    await page.getByRole("button", { name: /作品设置/, exact: false }).click();
    await page.locator(".writer-tools").getByLabel("作品名").waitFor();
    await snapshot("作品设置");
    await contained();
    const workName = page.locator(".writer-tools").getByLabel("作品名");
    const saveSettings = page.getByRole("button", {
      name: "保存资料",
      exact: true,
    });
    assert.equal(await saveSettings.isDisabled(), true);
    await workName.fill("方块世界的旅人 · 修订");
    assert.equal(await saveSettings.isEnabled(), true);
    await page
      .getByRole("button", { name: "刷新工具数据", exact: true })
      .click();
    await page
      .locator(".el-message-box")
      .getByRole("button", { name: "取消", exact: true })
      .click();
    assert.equal(await workName.inputValue(), "方块世界的旅人 · 修订");
    await saveSettings.click();
    await page.waitForFunction(() =>
      document
        .querySelector(".workspace-identity strong")
        .textContent.includes("修订")
    );
    assert.equal(await workName.inputValue(), "方块世界的旅人 · 修订");
    assert.equal(await saveSettings.isDisabled(), true);
    const statusDialog = page.locator(".el-message-box:visible");
    const settingSwitch = (label) =>
      page
        .locator(".setting-row")
        .filter({ hasText: label })
        .locator('input[type="checkbox"]');
    for (const label of ["已经完结", "作品公开"]) {
      const control = settingSwitch(label);
      const original = await control.isChecked();
      for (const dismissal of ["cancel", "close", "escape"]) {
        const before = settingsWrites.length;
        await control.click();
        await statusDialog.waitFor();
        assert.equal(
          await control.isChecked(),
          original,
          "Confirmation must keep the saved state visible"
        );
        assert.equal(await control.isDisabled(), true);
        if (dismissal === "cancel")
          await statusDialog
            .getByRole("button", { name: "取消", exact: true })
            .click();
        else if (dismissal === "close")
          await statusDialog.locator(".el-message-box__headerbtn").click();
        else await page.keyboard.press("Escape");
        await statusDialog.waitFor({ state: "hidden" });
        assert.equal(
          await control.isChecked(),
          original,
          `${label}: ${dismissal} must restore the saved state`
        );
        assert.equal(
          settingsWrites.length,
          before,
          "Dismissal must not submit settings"
        );
      }
    }
    async function waitSetting(label, checked) {
      await page.waitForFunction(
        ({ label, checked }) => {
          const row = [...document.querySelectorAll(".setting-row")].find(
            (row) => row.querySelector("strong").textContent === label
          );
          const input = row && row.querySelector("input");
          return input && !input.disabled && input.checked === checked;
        },
        { label, checked }
      );
    }
    async function saveSwitch(
      label,
      endpoint,
      expected,
      failure = false,
      confirm = true
    ) {
      failSetting = failure;
      const response = page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname.endsWith("/" + endpoint) &&
          response.status() === (failure ? 503 : 200)
      );
      await settingSwitch(label).click();
      if (confirm) {
        await statusDialog.waitFor();
        await statusDialog
          .getByRole("button", { name: "确定", exact: true })
          .click();
      }
      await response;
      await waitSetting(label, expected);
      failSetting = false;
    }
    for (const [label, endpoint, key] of [
      ["已经完结", "set_novel_update_status", "is_complete"],
      ["作品公开", "set_novel_status", "is_personal"],
    ]) {
      await saveSwitch(label, endpoint, true);
      assert.equal(
        settingsWrites.at(-1).body[key],
        key === "is_complete" ? 1 : 0
      );
      await saveSwitch(label, endpoint, true, true);
      await settingSwitch(label).click();
      await statusDialog.waitFor();
      await statusDialog
        .getByRole("button", { name: "取消", exact: true })
        .click();
      await statusDialog.waitFor({ state: "hidden" });
      assert.equal(
        await settingSwitch(label).isChecked(),
        true,
        "Cancellation must also preserve an enabled state"
      );
      await saveSwitch(label, endpoint, false);
      assert.equal(
        settingsWrites.at(-1).body[key],
        key === "is_complete" ? 0 : 1
      );
    }
    await saveSwitch(
      "读者 AI 助手",
      "set_novel_reader_ai_setting",
      true,
      true,
      false
    );
    await saveSwitch(
      "读者 AI 助手",
      "set_novel_reader_ai_setting",
      false,
      false,
      false
    );
    assert.equal(settingsWrites.at(-1).body.disable_reader_ai, 1);
    await saveSwitch(
      "读者 AI 助手",
      "set_novel_reader_ai_setting",
      true,
      false,
      false
    );
    assert.equal(settingsWrites.at(-1).body.disable_reader_ai, 0);
    await page.getByRole("button", { name: "AI 助手", exact: true }).click();
    await page.locator(".writer-ai").waitFor();
    await page.getByRole("button", { name: "续写情节", exact: true }).click();
    assert.ok(
      (await page.getByRole("textbox", { name: "写作助手指令" }).inputValue())
        .length > 0
    );
    await snapshot("助手空状态");
    await contained();
    await page.getByRole("button", { name: "实时协作", exact: true }).click();
    await snapshot("协作空状态");
    await contained();
    // Two loads in the same panel: a chapter change starts a newer request.
    fail = true;
    const old = holdRequest("get_novel_specific_statistics");
    await page.getByRole("button", { name: "阅读统计", exact: true }).click();
    await old.started;
    fail = false;
    const current = holdRequest("get_novel_specific_statistics");
    await page.locator(".catalog-entry").nth(1).click();
    await current.started;
    const oldResponse = page.waitForResponse(
      (r) =>
        r.url().includes("get_novel_specific_statistics") && r.status() === 503
    );
    old.release();
    await oldResponse;
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        )
    );
    assert.equal(
      await page.locator(".writer-tools .panel-loading").isVisible(),
      true
    );
    assert.equal(await page.locator(".writer-tools .panel-error").count(), 0);
    current.release();
    await page.locator(".tool-metrics").waitFor();
    fail = false;
    empty = true;
    await tool("读者纠错");
    await snapshot("反馈空状态");
    fail = true;
    await tool("阅读统计");
    await page.getByRole("button", { name: "重试", exact: true }).waitFor();
    await snapshot("工具错误状态");
    fail = false;
    await page.getByRole("button", { name: "重试", exact: true }).click();
    await page.getByText("暂无阅读统计", { exact: true }).waitFor();
    for (const size of [
      { width: 1024, height: 768 },
      { width: 900, height: 600 },
      { width: 1440, height: 500 },
    ]) {
      await page.setViewportSize(size);
      await contained();
      await snapshot(`viewport-${size.width}-${size.height}`);
    }
    await page.getByRole("link", { name: "返回创作中心", exact: true }).click();
    await page.waitForURL(base + "/write");
    await page.waitForFunction(
      () =>
        !document.body.classList.contains("writer-route-active") &&
        !document.documentElement.classList.contains("writer-route-active")
    );
    assert.notEqual(
      await page.evaluate(() => getComputedStyle(document.body).overflowY),
      "hidden"
    );
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify(
        {
          passed: true,
          longCatalog: 116,
          panels: 13,
          staleRequests: "passed",
          settingsSwitches: "passed",
          routeScrollRestored: true,
          viewports: 4,
          pageErrors: errors,
          screenshots: out,
        },
        null,
        2
      )
    );
  } catch (error) {
    await snapshot("failure");
    throw error;
  } finally {
    await browser.close();
  }
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
