const assert = require("node:assert/strict");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE ||
  "playwright");
const { api } = require("./writer-browser.cjs");
const base = process.env.WRITER_TEST_URL || "http://127.0.0.1:3117";
let rows = Array.from({ length: 30 }, (_, index) => ({
  statistic_date: new Date(Date.UTC(2026, 8, 10 + index, 16)).toISOString(),
  clicks: 22000 + index * 93,
  nices: 850 + index * 6,
  likes: 19,
  comments: 500 + index * 8,
  shares: 27 + index,
  tippings: 7000 + index * 20,
})).reverse();
async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1600, height: 1150 },
    });
    await context.addInitScript(() => {
      localStorage.setItem(
        "token",
        JSON.stringify({ tk: "writer-test-only-token", id: 99 })
      );
      localStorage.setItem(
        "loghome:writer:panel-widths",
        JSON.stringify({ right: 500 })
      );
    });
    await context.route("**/*", (route) =>
      new URL(route.request().url()).pathname.endsWith(
        "/get_novel_specific_statistics"
      )
        ? route.fulfill({
            json: rows,
            headers: { "access-control-allow-origin": "*" },
          })
        : api(route)
    );
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "/write/edit/7?article=10");
    await page.locator(".ProseMirror").waitFor();
    await page.getByRole("button", { name: "阅读统计", exact: true }).click();
    await page.locator(".statistic-chart").first().waitFor();
    assert.equal(await page.locator(".statistic-plot svg").count(), 6);
    assert.equal(await page.locator(".writer-tools table").count(), 0);
    assert.equal(
      await page.locator(".statistics-metric strong").first().innerText(),
      "24,697"
    );
    assert.ok(
      (await page.locator(".statistics-summary-heading").innerText()).includes(
        "2026-10-10"
      )
    );
    const chart = page.locator(".statistic-plot svg").first();
    await chart.focus();
    await chart.press("Home");
    assert.ok(
      (await page.locator(".statistic-readout").first().innerText()).includes(
        "2026-09-11"
      )
    );
    await chart.press("ArrowRight");
    assert.ok(
      (await page.locator(".statistic-readout").first().innerText()).includes(
        "2026-09-12"
      )
    );
    await chart.press("End");
    assert.ok(
      (await page.locator(".statistic-readout").first().innerText()).includes(
        "24,697"
      )
    );
    await page
      .locator(".workspace-tool-panel")
      .screenshot({ path: "/tmp/loghome-statistics-light.png" });
    await page.getByRole("button", { name: "写作偏好", exact: true }).click();
    await page
      .getByRole("group", { name: "写作主题", exact: true })
      .getByRole("button", { name: "深色", exact: true })
      .click();
    await page.getByRole("button", { name: "阅读统计", exact: true }).click();
    await page.locator(".statistic-chart").first().waitFor();
    await page
      .locator(".workspace-tool-panel")
      .screenshot({ path: "/tmp/loghome-statistics-dark.png" });
    const handle = page.getByRole("separator", {
      name: "调整工具面板宽度",
      exact: true,
    });
    await handle.focus();
    await handle.press("Home");
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".statistic-plot svg")].every(
        (svg) =>
          Math.abs(
            svg.viewBox.baseVal.width - svg.getBoundingClientRect().width
          ) < 1
      )
    );
    assert.ok(
      await page
        .locator(".writer-panel-body")
        .evaluate((node) => node.scrollWidth <= node.clientWidth)
    );
    rows = [rows[0]];
    await page
      .getByRole("button", { name: "刷新工具数据", exact: true })
      .click();
    await page.locator(".statistic-chart").first().waitFor();
    assert.equal(
      await page.locator(".statistic-plot").first().locator("circle").count(),
      2
    );
    assert.ok(
      (await page.locator(".statistics-summary").innerText()).includes(
        "暂无对比数据"
      )
    );
    rows = [];
    await page
      .getByRole("button", { name: "刷新工具数据", exact: true })
      .click();
    await page.getByText("暂无阅读统计", { exact: true }).waitFor();
    assert.deepEqual(errors, []);
    console.log(
      "Writer statistics checks passed: six charts, real dates, sorted snapshots, keyboard readout, dark theme, resize, single-point and empty states."
    );
  } finally {
    await browser.close();
  }
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
