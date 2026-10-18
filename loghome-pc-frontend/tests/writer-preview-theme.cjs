// Mock manuscripts and speech so theme checks never save, publish or play audio.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE || "playwright");
const base = process.env.WRITER_TEST_URL || "http://localhost:3000";
process.env.WRITER_TEST_URL = base;
const { api } = require("./writer-browser.cjs");

async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: "zh-CN" });
    await context.addInitScript(() => {
      localStorage.setItem("token", JSON.stringify({ tk: "preview-theme-test", id: 99 }));
      localStorage.setItem("loghome.theme", "light");
      localStorage.setItem("loghome:writer:preferences", JSON.stringify({ theme: "dark" }));
      localStorage.setItem("loghome:reader:preferences:v1", JSON.stringify({ theme: "black", mode: "text" }));
      localStorage.setItem("loghome:reader:follow-site-theme", "0");
      Object.defineProperty(window, "SpeechSynthesisUtterance", { value: class { constructor(text) { this.text = text; } } });
      Object.defineProperty(window, "speechSynthesis", { value: {
        getVoices: () => [], addEventListener() {}, removeEventListener() {}, cancel() {},
        speak(utterance) { setTimeout(() => utterance.onstart?.(), 0); },
      } });
    });
    const mutations = [];
    await context.route("**/*", async (route) => {
      if (route.request().method() === "POST") mutations.push(new URL(route.request().url()).pathname);
      return api(route);
    });
    const page = await context.newPage(), errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "/write/edit/7?article=10");
    await page.locator(".ProseMirror").waitFor();
    const before = mutations.length;
    await page.locator(".workspace-header").getByRole("button", { name: "预览", exact: true }).click();
    const preview = page.locator(".preview-reader");
    await page.locator(".preview-reader.is-night").waitFor();
    await preview.getByRole("button", { name: "听书预览", exact: true }).click();
    await preview.locator(".reader-speaking").waitFor();
    await preview.getByRole("button", { name: "音色与设置", exact: true }).click();
    async function appearance() {
      return page.evaluate(() => {
        const style = (selector) => {
          const value = getComputedStyle(document.querySelector(selector));
          return { background: value.backgroundColor, color: value.color, scheme: value.colorScheme };
        };
        return { shell: style(".preview-reader"), toolbar: style(".preview-toolbar"),
          button: style(".preview-title button"), player: style(".preview-reader .audio-player"),
          select: style(".preview-reader .audio-settings select"), highlight: style(".reader-speaking") };
      });
    }
    const dark = await appearance();
    assert.equal(dark.shell.background, "rgb(27, 32, 38)");
    for (const key of ["toolbar", "button", "player", "select"]) {
      assert.equal(dark[key].background, "rgb(41, 47, 55)", key);
      assert.equal(dark[key].scheme, "dark", key);
    }
    assert.equal(dark.player.color, "rgb(217, 222, 231)");
    assert.equal(dark.highlight.background, "rgb(56, 72, 61)");
    assert.equal(dark.highlight.color, "rgb(217, 222, 231)");
    await page.evaluate(() => window.$nuxt.$theme.set("dark"));
    assert.deepEqual(await appearance(), dark);
    await page.screenshot({ path: "/tmp/loghome-writer-preview-dark.png" });

    await preview.getByRole("button", { name: "阅读设置", exact: true }).click();
    const settings = page.locator(".reading-preview-settings");
    await page.locator(".reading-preview-settings.is-night").waitFor();
    await page.waitForFunction(() => {
      const box = document.querySelector(".reading-preview-settings").getBoundingClientRect();
      return box.width > 100 && box.left >= 0 && box.right <= innerWidth + 1;
    });
    assert.equal(await settings.evaluate((node) => getComputedStyle(node).backgroundColor), "rgb(41, 47, 55)");
    assert.equal(await settings.locator(".font-grid button").first().evaluate((node) => getComputedStyle(node).backgroundColor), "rgb(41, 47, 55)");
    await page.screenshot({ path: "/tmp/loghome-writer-preview-settings-dark.png", animations: "disabled" });
    await settings.getByRole("button", { name: "蛙鸣白", exact: true }).click();
    await page.locator(".reading-preview-settings:not(.is-night)").waitFor();
    await settings.getByRole("button", { name: "close 阅读设置" }).click();
    const light = await appearance();
    assert.equal(light.toolbar.background, "rgb(255, 255, 255)");
    assert.equal(light.player.background, "rgb(255, 255, 255)");
    assert.equal(light.player.color, "rgb(48, 47, 42)");
    assert.equal(light.highlight.background, "rgb(229, 236, 215)");
    await preview.getByRole("button", { name: "阅读设置", exact: true }).click();
    await settings.getByRole("button", { name: "虚空黑", exact: true }).click();
    await page.locator(".reading-preview-settings.is-night").waitFor();
    await settings.getByRole("button", { name: "close 阅读设置" }).click();
    await page.setViewportSize({ width: 900, height: 700 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: "/tmp/loghome-writer-preview-dark-narrow.png" });
    assert.deepEqual(mutations.slice(before), []);
    assert.deepEqual(errors, []);
    console.log("PASS preview dark shell/toolbar/buttons, narration highlight/player/selects, body-mounted settings, independent reader theme changes, light theme, narrow layout and no manuscript/progress writes");
  } finally { await browser.close(); }
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
