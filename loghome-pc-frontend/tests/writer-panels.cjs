// Real pointer and keyboard resizing; backend APIs are intercepted.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE ||
  "playwright");
const { api } = require("./writer-browser.cjs");
const base = process.env.WRITER_TEST_URL || "http://127.0.0.1:3117";
async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1600, height: 1000 },
    });
    await context.addInitScript(() =>
      localStorage.setItem(
        "token",
        JSON.stringify({ tk: "writer-test-only-token", id: 99 })
      )
    );
    await context.route("**/*", api);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "/write/edit/7?article=10");
    await page.locator(".ProseMirror").waitFor();
    await page.getByRole("button", { name: "写作偏好", exact: true }).click();
    const left = page.getByRole("separator", {
      name: "调整目录面板宽度",
      exact: true,
    });
    const right = page.getByRole("separator", {
      name: "调整工具面板宽度",
      exact: true,
    });
    async function width(selector) {
      return Math.round((await page.locator(selector).boundingBox()).width);
    }
    async function drag(handle, dx, cancel = false) {
      const box = await handle.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + 100);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + dx, box.y + 100, {
        steps: 6,
      });
      if (cancel) await page.keyboard.press("Escape");
      await page.mouse.up();
    }
    assert.equal(await width(".workspace-catalog"), 264);
    assert.equal(await width(".workspace-tool-panel"), 340);
    await drag(left, 100);
    assert.equal(await width(".workspace-catalog"), 364);
    await drag(right, -100);
    assert.equal(await width(".workspace-tool-panel"), 440);
    assert.deepEqual(
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem("loghome:writer:panel-widths"))
      ),
      { left: 364, right: 440 }
    );
    await drag(right, -60, true);
    assert.equal(await width(".workspace-tool-panel"), 440);
    assert.equal(
      await page.locator(".writer-workspace.resizing-panel").count(),
      0
    );
    await left.focus();
    await left.press("ArrowRight");
    assert.equal(await width(".workspace-catalog"), 374);
    await right.focus();
    await right.press("ArrowLeft");
    assert.equal(await width(".workspace-tool-panel"), 450);
    await page.reload();
    await page.locator(".ProseMirror").waitFor();
    await page.getByRole("button", { name: "写作偏好", exact: true }).click();
    assert.equal(await width(".workspace-catalog"), 374);
    assert.equal(await width(".workspace-tool-panel"), 450);
    await drag(left, 900);
    assert.equal(
      await width(".workspace-catalog"),
      Number(await left.getAttribute("aria-valuemax"))
    );
    await drag(right, -900);
    assert.ok((await width(".workspace-editor")) >= 320);
    await drag(left, -900);
    assert.equal(await width(".workspace-catalog"), 180);
    await drag(right, 900);
    assert.equal(await width(".workspace-tool-panel"), 260);
    await left.dblclick();
    await right.dblclick();
    assert.equal(await width(".workspace-catalog"), 264);
    assert.equal(await width(".workspace-tool-panel"), 340);
    await page.getByRole("button", { name: "专注", exact: true }).click();
    assert.equal(await left.isVisible(), false);
    assert.equal(await right.isVisible(), false);
    await page.getByRole("button", { name: "退出专注", exact: true }).click();
    await page
      .getByRole("button", { name: "关闭工具面板", exact: true })
      .click();
    assert.equal(await right.isVisible(), false);
    await page.getByRole("button", { name: "写作偏好", exact: true }).click();
    assert.equal(await width(".workspace-tool-panel"), 340);
    await drag(left, 200);
    await drag(right, -200);
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.waitForFunction(
      () => document.querySelector(".workspace-editor").clientWidth >= 320
    );
    assert.ok((await width(".workspace-editor")) >= 320);
    assert.ok(
      await page.evaluate(
        () =>
          document.querySelector(".workspace-body").scrollWidth <=
          document.querySelector(".workspace-body").clientWidth
      )
    );
    await page.setViewportSize({ width: 800, height: 900 });
    await right.focus();
    await right.press("Home");
    assert.equal(await width(".workspace-tool-panel"), 260);
    await page.keyboard.press("Tab");
    assert.deepEqual(errors, []);
    console.log(
      "Writer panel checks passed: both drag directions, limits, keyboard, cancellation, persistence, reset, focus mode, hidden panels and narrow windows."
    );
  } finally {
    await browser.close();
  }
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
