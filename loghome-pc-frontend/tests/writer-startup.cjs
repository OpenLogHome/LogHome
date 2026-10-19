// Real new-tab and cold-load checks with isolated manuscript APIs.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE || "playwright");
const base = process.env.WRITER_TEST_URL || "http://localhost:3000";
process.env.WRITER_TEST_URL = base;
const { api, novel } = require("./writer-browser.cjs");
function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}
const chunk = (request, name) => new URL(request.url()).pathname.endsWith(`/${name}.js`);
async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "zh-CN" });
    await context.addInitScript(() => {
      // A new tab briefly starts as an opaque document before navigating.
      try {
        localStorage.setItem("token", JSON.stringify({ tk: "startup-fixture", id: 99 }));
        localStorage.setItem("loghome:writer:preferences", JSON.stringify({ theme: "dark" }));
      } catch (_) {}
    });
    const workspace = deferred(), editor = deferred(), requests = [], errors = [];
    context.on("page", (page) => page.on("pageerror", (error) => errors.push(error.message)));
    await context.route("**/*", async (route) => {
      const request = route.request();
      requests.push(request.url());
      if (chunk(request, "writer-workspace")) { await workspace.promise; return route.continue(); }
      if (chunk(request, "writer-editor")) { await editor.promise; return route.continue(); }
      if (new URL(request.url()).pathname.endsWith("/get_novels_of"))
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([novel]),
          headers: { "access-control-allow-origin": "*" } });
      return api(route);
    });
    const center = await context.newPage();
    await center.goto(base + "/write");
    const start = center.getByRole("link", { name: "开始写作", exact: true });
    await start.waitFor();
    assert.equal(await start.getAttribute("target"), "_blank");
    const warm = center.waitForRequest((request) => chunk(request, "writer-workspace"));
    await start.hover();
    await warm;
    const opened = context.waitForEvent("page");
    await start.click();
    const page = await opened;
    await page.waitForLoadState("domcontentloaded");
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.getByText("正在准备写作工作台…", { exact: true }).waitFor();
    assert.equal(await page.locator(".writer-workspace").count(), 0);
    assert.equal(await page.locator(".writer-startup").evaluate((node) => getComputedStyle(node).backgroundColor), "rgb(32, 32, 32)");
    assert.equal(new URL(center.url()).pathname, "/write");
    // A paused script may also keep document.fonts.ready pending. Capture the
    // actual compositor frame without waiting for unrelated font readiness.
    const capture = await context.newCDPSession(page);
    const frame = await capture.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("/tmp/loghome-writer-startup-delayed.png", Buffer.from(frame.data, "base64"));
    await capture.detach();
    workspace.resolve();
    await page.locator(".writer-workspace").waitFor();
    await page.locator(".writer-startup").waitFor({ state: "detached" });
    await page.locator('.catalog-item[data-article-id="10"]').waitFor();
    for (const name of ["writer-editor", "writer-ai", "writer-reader-preview", "writer-collaboration", "writer-manga"])
      assert.ok(!requests.some((url) => new URL(url).pathname.endsWith(`/${name}.js`)), `${name} must not block startup`);
    const editorRequest = page.waitForRequest((request) => chunk(request, "writer-editor"));
    await page.locator('.catalog-item[data-article-id="10"] .catalog-entry').click();
    await editorRequest;
    await page.locator(".workspace-editor .writer-async-notice").waitFor();
    assert.equal(await page.locator(".catalog-list").isVisible(), true);
    editor.resolve();
    await page.locator(".ProseMirror").waitFor();
    await page.locator(".workspace-header").getByRole("button", { name: "预览", exact: true }).click();
    await page.locator(".preview-reader").waitFor();
    await page.getByRole("button", { name: "返回编辑器", exact: true }).click();

    const failedContext = await browser.newContext({ locale: "zh-CN" });
    await failedContext.addInitScript(() => localStorage.setItem("token", JSON.stringify({ tk: "startup-retry", id: 99 })));
    let failed = false;
    await failedContext.route("**/*", (route) => {
      if (!failed && chunk(route.request(), "writer-workspace")) {
        failed = true;
        return route.abort("failed");
      }
      return api(route);
    });
    const retry = await failedContext.newPage();
    await retry.goto(base + "/write/edit/7", { waitUntil: "domcontentloaded" });
    await retry.getByText("工作台暂时未能打开", { exact: true }).waitFor();
    await retry.getByRole("button", { name: "重新加载", exact: true }).click();
    await retry.locator(".writer-workspace").waitFor();
    assert.equal(failed, true);

    const noJs = await browser.newContext({ javaScriptEnabled: false });
    const serverPage = await noJs.newPage();
    await serverPage.goto(base + "/write/edit/7");
    await serverPage.getByText("正在准备写作工作台…", { exact: true }).waitFor();
    await serverPage.getByRole("link", { name: "返回创作中心", exact: true }).waitFor();
    assert.deepEqual(errors, []);
    console.log("PASS SSR startup without JavaScript, intent preload, real new tab under delayed JS, themed persistent loading, deferred editor/features, preview, failed chunk retry and preserved original tab");
  } finally { await browser.close(); }
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
