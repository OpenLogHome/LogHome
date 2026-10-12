// Focus controls against mocked manuscript services.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE ||
  "playwright");
const { api } = require("./writer-browser.cjs");
(async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: 1400, height: 900 },
    });
    await context.addInitScript(() =>
      localStorage.setItem(
        "token",
        JSON.stringify({ tk: "writer-test-only-token", id: 99 })
      )
    );
    await context.route("**/*", api);
    const page = await context.newPage();
    await page.goto(
      (process.env.WRITER_TEST_URL || "http://127.0.0.1:3117") +
        "/write/edit/7?article=10"
    );
    await page.locator(".ProseMirror").waitFor();
    await page.getByRole("button", { name: "专注", exact: true }).click();
    await page.mouse.move(700, 400);
    const header = page.locator(".workspace-header"),
      chrome = page.locator(".editor-chrome"),
      footer = page.locator(".editor-statusbar");
    await page.waitForTimeout(220);
    assert.equal(await header.isVisible(), false);
    assert.equal(await chrome.isVisible(), false);
    assert.equal(await footer.isVisible(), false);
    const before = await page.locator(".editor-scroll").boundingBox();
    await page.mouse.move(700, 20);
    await header.waitFor();
    await chrome.waitFor();
    assert.equal(await footer.isVisible(), false);
    assert.deepEqual(
      await page.locator(".editor-scroll").boundingBox(),
      before
    );
    await page.mouse.move(700, 400);
    await page.waitForTimeout(220);
    assert.equal(await header.isVisible(), false);
    await page.mouse.move(700, 880);
    await footer.waitFor();
    assert.deepEqual(
      await page.locator(".editor-scroll").boundingBox(),
      before
    );
    await page.mouse.move(700, 400);
    await page.waitForTimeout(220);
    assert.equal(await footer.isVisible(), false);
    await page.keyboard.press("ControlOrMeta+f");
    await page.locator(".find-bar input").first().waitFor();
    await chrome.waitFor();
    await page.mouse.move(700, 450);
    assert.equal(await chrome.isVisible(), true);
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(220);
    assert.equal(await page.locator(".writer-workspace.focused").count(), 0);
    assert.equal(await header.isVisible(), true);
    assert.equal(await chrome.isVisible(), true);
    assert.equal(await footer.isVisible(), true);
    console.log(
      "PASS 24px top/bottom reveal, hide, no layout shift, Ctrl+F and Escape"
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
