// All manuscript APIs are mocked; only browser-local appearance preferences change.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE || "playwright");
const { api } = require("./writer-browser.cjs");
const base = process.env.WRITER_TEST_URL || "http://localhost:3000";
const palettes = {
  light: { label: "浅色", background: "rgb(255, 255, 255)", text: "rgb(55, 53, 47)", accent: "#216da0" },
  sepia: { label: "纸张", background: "rgb(251, 245, 232)", text: "rgb(81, 69, 54)", accent: "#216da0" },
  dark: { label: "深色", background: "rgb(32, 32, 32)", text: "rgb(233, 232, 228)", accent: "#79b9df" },
};

async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, colorScheme: "dark" });
    await context.addInitScript(() => {
      localStorage.setItem("token", JSON.stringify({ tk: "writer-test-only-token", id: 99 }));
      if (!localStorage.getItem("loghome.theme")) localStorage.setItem("loghome.theme", "dark");
      if (!localStorage.getItem("loghome:writer:preferences"))
        localStorage.setItem("loghome:writer:preferences", JSON.stringify({ theme: "light" }));
    });
    await context.route("**/*", api);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const assertLayout = async () => {
      assert.equal(await page.locator(".writer-layout").count(), 1);
      assert.equal(await page.locator(".empty-layout, .navbar, .global-theme-switch, .mobile-download-button").count(), 0);
      const box = await page.locator(".writer-page").boundingBox();
      assert.deepEqual(box, { x: 0, y: 0, width: 1440, height: 960 });
    };
    await page.goto(base + "/write/edit/7?article=10");
    await page.locator(".ProseMirror").waitFor();
    await assertLayout();
    await page.getByRole("button", { name: "写作偏好", exact: true }).click();
    const themes = page.getByRole("group", { name: "写作主题", exact: true });
    for (const [theme, palette] of Object.entries(palettes)) {
      await themes.getByRole("button", { name: palette.label, exact: true }).click();
      await page.locator(`.writer-workspace.theme-${theme}`).waitFor();
      const appearances = [];
      for (const siteTheme of ["dark", "light"]) {
        await page.evaluate(value => window.$nuxt.$theme.set(value), siteTheme);
        await page.waitForFunction(value => document.documentElement.dataset.siteTheme === value, siteTheme);
        await page.evaluate(() => {
          const workspace = document.querySelector(".writer-workspace").__vue__;
          workspace.writerConfirm("测试写作主题隔离", "写作确认").catch(() => {});
        });
        const dialog = page.locator(`.el-message-box.writer-dialog.theme-${theme}`);
        await dialog.waitFor();
        const appearance = await page.evaluate(() => {
          const workspace = document.querySelector(".writer-workspace");
          const dialog = document.querySelector(".el-message-box.writer-dialog");
          const style = node => {
            const value = getComputedStyle(node);
            return { background: value.backgroundColor, color: value.color, border: value.borderColor };
          };
          return {
            dialog: style(dialog), content: style(dialog.querySelector(".el-message-box__content")),
            button: style(dialog.querySelector(".el-button--primary")),
            workspace: style(workspace),
            accent: getComputedStyle(workspace).getPropertyValue("--writer-accent").trim(),
            placeholder: getComputedStyle(document.querySelector(".chapter-title"), "::placeholder").color,
            colorScheme: getComputedStyle(workspace).colorScheme,
          };
        });
        assert.equal(appearance.dialog.background, palette.background);
        assert.equal(appearance.dialog.color, palette.text);
        assert.equal(appearance.workspace.color, palette.text);
        assert.equal(appearance.accent, palette.accent);
        assert.equal(appearance.colorScheme, theme === "dark" ? "dark" : "light");
        appearances.push(appearance);
        await dialog.locator(".el-message-box__btns .el-button").first().click();
        await dialog.waitFor({ state: "hidden" });
      }
      assert.deepEqual(appearances[0], appearances[1], `${theme} must not follow the global theme`);
    }
    await themes.getByRole("button", { name: "纸张", exact: true }).click();
    await page.evaluate(() => window.$nuxt.$theme.set("dark"));
    await page.reload();
    await page.locator(".writer-workspace.theme-sepia .ProseMirror").waitFor();
    await assertLayout();
    assert.equal(await page.evaluate(() => localStorage.getItem("loghome.theme")), "dark");
    await page.screenshot({ path: "/tmp/loghome-writer-isolation.png" });

    await page.evaluate(() => window.$nuxt.$router.push("/login"));
    await page.locator(".login-container").waitFor();
    await page.waitForFunction(() => !document.documentElement.classList.contains("writer-route-active"));
    assert.equal(await page.locator(".mobile-download-button").isVisible(), true);
    assert.equal(await page.locator(".login-container").evaluate(node => getComputedStyle(node).backgroundColor), "rgb(30, 28, 25)");
    await page.evaluate(() => window.$nuxt.$router.push("/write/edit/7?article=10"));
    await page.locator(".writer-workspace.theme-sepia .ProseMirror").waitFor();
    await assertLayout();
    assert.deepEqual(errors, []);
    console.log("PASS full-screen writer layout; independent light/sepia/dark controls and appended dialogs under both global themes; persistence and route cleanup");
  } finally {
    await browser.close();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
