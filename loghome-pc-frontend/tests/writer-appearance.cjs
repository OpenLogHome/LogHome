// All APIs are mocked: no real account, work or preferences are changed.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE ||
  "playwright");
const { api } = require("./writer-browser.cjs");
const base = process.env.WRITER_TEST_URL || "http://127.0.0.1:3117";
const skins = [
  {
    skin_key: "forest",
    skin_name: "林间晨光",
    image_url: "https://fixture.test/forest.png",
    required_membership: "none",
  },
  {
    skin_key: "night",
    skin_name: "静谧夜空",
    image_url: "https://fixture.test/night.png",
    required_membership: "none",
  },
  {
    skin_key: "premium",
    skin_name: "典藏书房",
    image_url: "https://fixture.test/premium.png",
    required_membership: "super",
  },
];
async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1600, height: 1050 },
      colorScheme: "dark",
    });
    const errors = [];
    await context.addInitScript(() =>
      localStorage.setItem(
        "token",
        JSON.stringify({ tk: "writer-test-only-token", id: 99 })
      )
    );
    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith("/get_writer_background_skins"))
        return route.fulfill({
          json: skins,
          headers: { "access-control-allow-origin": "*" },
        });
      if (url.hostname === "fixture.test")
        return route.fulfill({
          contentType: "image/svg+xml",
          body: '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g"><stop stop-color="#163947"/><stop offset="1" stop-color="#b6cb9e"/></linearGradient></defs><path fill="url(#g)" d="M0 0h600v400H0z"/><path fill="#305249" d="M0 400 120 170 230 400 400 100 600 400z"/></svg>',
        });
      return api(route);
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "/write/edit/7?article=10");
    await page.locator(".ProseMirror").waitFor();
    await page.locator(".writer-workspace.theme-dark").waitFor();
    await page.getByRole("button", { name: "写作偏好", exact: true }).click();
    const themes = page.getByRole("group", { name: "写作主题", exact: true });
    assert.equal(
      await themes
        .getByRole("button", { name: "跟随系统", exact: true })
        .getAttribute("aria-pressed"),
      "true"
    );
    assert.equal(
      await page.locator('.quick-input-bar button[title="破折号"]').innerText(),
      "——"
    );
    assert.equal(
      await page
        .locator(".quick-input-bar button")
        .filter({ hasText: "，" })
        .count(),
      0
    );
    await page.emulateMedia({ colorScheme: "light" });
    await page.locator(".writer-workspace.theme-light").waitFor();
    await themes.getByRole("button", { name: "纸张", exact: true }).click();
    await page.emulateMedia({ colorScheme: "dark" });
    await page.locator(".writer-workspace.theme-sepia").waitFor();
    assert.equal(
      await page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("loghome:writer:preferences")).theme
      ),
      "sepia"
    );

    await page.locator(".writer-font-picker summary").click();
    await page
      .getByRole("group", { name: "正文字体", exact: true })
      .getByRole("button", { name: "宋体 / 衬线", exact: false })
      .click();
    assert.equal(
      await page.locator(".writer-font-picker").getAttribute("open"),
      null
    );
    assert.equal(
      await page.evaluate(
        () =>
          getComputedStyle(document.querySelector(".ProseMirror")).fontFamily
      ),
      "serif"
    );
    await page
      .getByRole("group", { name: "常用符号", exact: true })
      .getByRole("button", { name: "乘号", exact: true })
      .click();
    assert.equal(
      await page.locator('.quick-input-bar button[title="乘号"]').count(),
      0
    );
    await page
      .getByRole("button", { name: "恢复推荐符号", exact: true })
      .click();
    assert.equal(
      await page.locator('.quick-input-bar button[title="乘号"]').count(),
      1
    );
    await page.evaluate(() => {
      const editor = document.querySelector(".native-editor").__vue__.editor;
      editor.commands.setContent("<p>正文</p>");
      editor.commands.setTextSelection({ from: 1, to: 3 });
    });
    await page.locator('.quick-input-bar button[title="单书名号"]').click();
    assert.equal(await page.locator(".ProseMirror").innerText(), "〈正文〉");

    await page.keyboard.press("Control+f");
    await page
      .getByRole("textbox", { name: "查找文本", exact: true })
      .waitFor();
    await page.waitForFunction(
      () => document.activeElement.getAttribute("aria-label") === "查找文本"
    );
    assert.equal(
      await page
        .getByRole("textbox", { name: "查找文本", exact: true })
        .evaluate((node) => node === document.activeElement),
      true
    );
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".find-bar").count(), 0);
    await page.keyboard.press("Control+f");
    await page
      .getByRole("button", { name: "关闭查找替换", exact: true })
      .click();
    assert.equal(await page.locator(".find-bar").count(), 0);
    await page.getByRole("button", { name: "查找替换", exact: true }).click();
    await page.getByRole("button", { name: "查找替换", exact: true }).click();
    assert.equal(await page.locator(".find-bar").count(), 0);

    await page
      .getByRole("button", { name: "选择写作背景", exact: true })
      .click();
    const picker = page.locator(".writer-background-dialog");
    await picker.waitFor();
    assert.equal(
      await picker
        .getAttribute("class")
        .then((value) => value.includes("theme-sepia")),
      true
    );
    await picker.getByRole("button", { name: "林间晨光", exact: true }).click();
    await page.locator(".editor-scroll.has-background-skin").waitFor();
    assert.equal(
      await page
        .locator(".writer-paper")
        .evaluate((node) => getComputedStyle(node).backgroundColor),
      "rgba(0, 0, 0, 0)"
    );
    assert.ok(
      await page
        .locator(".editor-scroll")
        .evaluate((node) =>
          getComputedStyle(node).backgroundImage.includes("forest.png")
        )
    );
    await picker
      .getByRole("button", { name: "典藏书房，需要通行证", exact: true })
      .click();
    assert.equal(
      await page
        .locator('.background-card[aria-label="林间晨光"]')
        .getAttribute("aria-pressed"),
      "true"
    );
    await picker.getByRole("button", { name: "完成", exact: true }).click();
    await picker.waitFor({ state: "hidden" });
    await page.screenshot({ path: "/tmp/loghome-writer-appearance-light.png" });
    await themes.getByRole("button", { name: "深色", exact: true }).click();
    await page.locator(".writer-workspace.theme-dark").waitFor();
    assert.ok(
      await page
        .locator(".editor-scroll")
        .evaluate((node) =>
          getComputedStyle(node).backgroundImage.includes("25, 25, 25")
        )
    );
    await page
      .getByRole("button", { name: "选择写作背景", exact: true })
      .click();
    await page.locator(".writer-background-dialog.theme-dark").waitFor();
    await picker.getByRole("button", { name: "纯色背景", exact: true }).click();
    assert.equal(
      await page.locator(".editor-scroll.has-background-skin").count(),
      0
    );
    await page.keyboard.press("Escape");
    await picker.waitFor({ state: "hidden" });
    await page.screenshot({ path: "/tmp/loghome-writer-appearance-dark.png" });
    await page.reload();
    await page.locator(".ProseMirror").waitFor();
    await page.locator(".writer-workspace.theme-dark").waitFor();
    await page.emulateMedia({ colorScheme: "light" });
    assert.equal(await page.locator(".writer-workspace.theme-dark").count(), 1);
    assert.deepEqual(errors, []);
    console.log(
      "Writer appearance checks passed: system/manual themes, persistence, fonts, symbols, paired insertion, find close/focus, skin previews and membership lock."
    );
  } finally {
    await browser.close();
  }
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
