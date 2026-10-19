// Read-only browser audit. Every service request is intercepted; no real account is used.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE || "playwright");
const base = process.env.WRITER_TEST_URL || "http://localhost:3000";
const profile = { user_id: 99, name: "测试作者", email: "fixture@example.test", motto: "一起创作", avatar_url: "" };
const friend = { user_id: 7, follow_id: 7, name: "测试好友", motto: "一起来读书", avatar_url: "" };
const tiers = ["standard", "super"].map((key, index) => ({ key, name: index ? "超级原木通行证" : "原木通行证", plans: [
  { billing_cycle: "monthly", name: "连续包月", cost_log: index ? 880 : 660 },
  { billing_cycle: "yearly", name: "购买年卡", cost_log: index ? 9600 : 7200 },
] }));
const product = { id: 1, title: "测试商品", summary: "供样式检查使用", type: "virtual", price: 100, stock: 10, has_variants: true, variants: [
  { id: 1, label: "标准款", price: 100, stock: 10, status: "on" },
  { id: 2, label: "进阶款", price: 200, stock: 5, status: "on" },
  { id: 3, label: "售罄款", price: 300, stock: 0, status: "on" },
] };
const badge = { achievement_id: 1, title: "测试勋章", description: "认真阅读，记录成长", is_selectable: true };
const messages = [1, 2].map(message_id => ({ message_id, from_id: 7, name: "测试好友", message_type: "comment", message_content: "回复了你的内容", time: new Date(Date.now() - message_id * 60000).toISOString(), is_read: 1, router: "readers/bookInfo?id=7" }));

function fixture(url) {
  const path = url.pathname;
  if (path === "/store/products/1") return { data: product };
  if (path === "/store/products") return { data: { list: [product], total: 1 } };
  if (path === "/store/addresses") return { data: [] };
  if (path === "/avatar-frames") return { data: { selected_frame_id: null, frames: [
    { frame_id: 1, name: "免费挂件", required_tier: "free", can_use: true },
    { frame_id: 2, name: "通行证挂件", required_tier: "super", can_use: false },
  ] } };
  if (path === "/community/posts/detail/1") return { post_id: 1, title: "测试帖子", content: "这是一段帖子正文，用于检查夜间文字。", user_id: 7, name: "测试好友", create_time: new Date().toISOString(), media_urls: [], like_count: 0, comment_count: 0 };
  const map = {
    userprofile: profile, user_profile_of: [friend],
    get_resources: [{ log: 20000, cropped_log: 100 }],
    plans: { data: tiers }, subscription: { data: { subscription: null, log_balance: 20000 } },
    "gift-friends": { data: { list: [friend] } }, "redeem-history": { data: { list: [], total: 0 } },
    achievements_summary: { selected_badge: badge, title_profile: {} }, achievements: { list: [badge] },
    achievements_definitions: { list: [badge, { ...badge, achievement_id: 2, title: "待解锁勋章" }] },
    achievement_progress: { result: { group_results: [{ matched: false, conditions: [{ condition_id: 1, metric_code: "read_seconds", current_value: 20, threshold_value: 100, progress_ratio: .2 }] }] } },
    get_fans_of: [friend], get_follows_of: [friend], privacy_settings: {},
    get_history_message: messages, chat_friends: { data: [] },
    message_history: [{ id: 1, sender_id: 7, receiver_id: 99, message_content: "你好，欢迎阅读。", send_time: new Date().toISOString(), is_read: 1 }],
    list: { list: [], total: 0 }, status: { liked: false },
    get_logpower_details: { novel_id: 7, novel_type: "novel", name: "测试作品", clicks: 100, nices: 10, bookmarks: 3, comments: 2, tips: 1, score: 1500, ranked_score: 1400, days_diff: 0, generated_at: Date.now(), update_time: new Date().toISOString() },
  };
  return map[path.split("/").pop()] || { msg: "ok", code: 0, data: [] };
}

// Audit rendered text against its actual ancestor background; artwork and icons are excluded.
async function contrastIssues(page, selector) {
  return page.locator(selector).evaluateAll(roots => {
    const rgb = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const lum = color => color.map(x => { x /= 255; return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; }).reduce((sum, x, i) => sum + x * [.2126, .7152, .0722][i], 0);
    const results = [];
    for (const root of roots) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent.trim(), element = node.parentElement;
        if (!text || /^(I|SVG|SCRIPT|STYLE)$/.test(element.tagName)) continue;
        const rect = element.getBoundingClientRect(), style = getComputedStyle(element);
        if (!rect.width || !rect.height || style.visibility !== "visible") continue;
        let background = element, color = null, artwork = false;
        while (background) {
          const current = getComputedStyle(background);
          if (current.backgroundImage !== "none") { artwork = true; break; }
          if (!/rgba\([^)]*,\s*0\)$/.test(current.backgroundColor) && current.backgroundColor !== "transparent") { color = current.backgroundColor; break; }
          background = background.parentElement;
        }
        if (artwork || !color) continue;
        const foreground = rgb(style.color), behind = rgb(color);
        if (foreground.length !== 3 || behind.length !== 3) continue;
        const a = lum(foreground), b = lum(behind), ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
        const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700);
        if (ratio < (large ? 3 : 4.5)) results.push({ text: text.slice(0, 45), selector: element.tagName + "." + element.className, color: style.color, background: color, ratio: Number(ratio.toFixed(2)) });
      }
    }
    return results;
  });
}

const routes = [
  ["/membership/rules", ".price-card", ".rules-content"],
  ["/membership/gift", ".gift-form", ".gift-form"],
  ["/membership/redeem", ".redeem-form, .social-panel", ".workspace-main"],
  ["/me/wallet", ".recharge-plans button", ".wallet-balances, .recharge-plans"],
  ["/me/frames", ".frame-option.locked", ".frame-grid, .frame-preview"],
  ["/me/achievements", ".badge-option", ".achievement-overview, .badge-grid"],
  ["/me/messages", ".message-target", ".message-layout"],
  ["/me/friends", ".user-card", ".user-grid"],
  ["/me/settings", ".profile-form", ".settings-page"],
  ["/store", ".product-card", ".product-grid, .store-categories"],
  ["/store/1", ".product-variants button", ".product-summary"],
  ["/community/chat?id=7", ".message-bubble", ".chat-page"],
  ["/community/post/1", ".post-text", ".post-detail, .comments-section"],
  ["/read/resources", ".channels article", ".resources-guide"],
  ["/read/power/7", ".power-card", ".power-page"],
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, colorScheme: "dark" });
    await context.addInitScript(() => {
      localStorage.setItem("token", JSON.stringify({ id: 99, tk: "theme-audit-only" }));
      if (!localStorage.getItem("loghome.theme")) localStorage.setItem("loghome.theme", "dark");
    });
    await context.route("**/*", async route => {
      const url = new URL(route.request().url());
      if (url.origin === new URL(base).origin) return route.continue();
      // No external request is allowed through, including background read-state updates.
      return route.fulfill({ json: fixture(url), headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" } });
    });
    const page = await context.newPage();
    await page.goto(base + "/membership/rules");
    const failures = [];
    const check = async (theme, path, area) => {
      const issues = await contrastIssues(page, area);
      if (issues.length) failures.push({ theme, path, issues });
      console.log(`${issues.length ? "FAIL" : "PASS"} ${theme} ${path} (${issues.length} low-contrast text fragments)`);
    };
    for (const theme of ["dark", "light"]) {
      await page.evaluate(theme => window.$nuxt.$theme.set(theme), theme);
      for (const [path, ready, area] of routes) {
        await page.evaluate(path => Promise.resolve(window.$nuxt.$router.push(path)).catch(() => {}), path);
        await page.waitForFunction(path => window.$nuxt.$route.fullPath === path, path);
        await page.locator(ready).first().waitFor({ timeout: 15000 });
        if (path === "/me/wallet") await page.locator(".recharge-plans button").nth(1).click();
        if (path === "/me/frames") await page.locator(".frame-option").nth(1).click();
        if (path === "/me/friends") await page.locator(".user-card").first().hover();
        if (path === "/store/1") await page.locator(".product-variants button").nth(1).click();
        // Element UI transitions between enabled/disabled and focus colors.
        await page.waitForTimeout(200);
        await check(theme, path, area);
        if (path === "/me/messages") {
          await page.locator(".message-group .row-main .el-button").first().click();
          await page.locator(".group-history").waitFor();
          await check(theme, path + " expanded history", ".group-history");
        }
        if (path === "/me/achievements") {
          await page.locator(".social-tabs button").nth(1).click();
          await page.locator(".badge-option").first().click();
          await page.locator(".badge-condition-group").waitFor();
          await page.waitForTimeout(200);
          await check(theme, path + " locked badge dialog", ".el-dialog:visible");
          await page.locator(".el-dialog:visible .el-dialog__headerbtn").click();
          await page.locator(".el-dialog:visible").waitFor({ state: "hidden" });
        }
        if (path === "/community/post/1") {
          await page.locator(".emoji-trigger").click();
          await page.locator(".emoji-tabs").waitFor();
          await check(theme, path + " emoji dialog", ".emoji-tabs");
          await page.locator(".el-dialog:visible .el-dialog__headerbtn").click();
          await page.locator(".el-dialog:visible").waitFor({ state: "hidden" });
        }
        if (theme === "dark" && path === "/membership/rules") await page.locator(".rules-content").screenshot({ path: "/tmp/loghome-rules-night-audit.png" });
      }
    }
    assert.deepEqual(failures, []);
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
