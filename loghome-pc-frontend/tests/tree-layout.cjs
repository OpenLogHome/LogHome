// Long friend lists and all tree interactions use fictional, intercepted data.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE || "playwright");
const base = process.env.WRITER_TEST_URL || "http://localhost:3000";
process.env.WRITER_TEST_URL = base;
const { api } = require("./writer-browser.cjs");
const tree = { plant_id: 7, tree_status: "开花", treeType: "oak_island", growth_val: 45,
  max_growth: 100, is_gotten: 0, exp_feature_enabled: true,
  reward_benefits: { membership_name: "超级原木通行证", multiplier: 2 },
  exp_orbs: Array.from({ length: 5 }, (_, i) => ({ orb_id: i + 1, reward: i % 2 + 1 })),
  tasks: [
    { task_code: "daily_checkin", task_name: "每日签到", task_desc: "每天签到获得成长值", growth_reward: 20, status: "pending" },
    { task_code: "daily_like_novel", task_name: "每日点赞", task_desc: "为任意作品点赞获得成长值", growth_reward: 30, status: "pending" },
  ],
  exp_tasks: [{ task_code: "read_seconds", task_name: "每日阅读", task_desc: "认真阅读喜欢的作品", exp_reward: 10,
    completed_times: 0, daily_limit: 3, progress_text: "0 / 30 分钟", status: "pending" }],
};
const friends = Array.from({ length: 36 }, (_, i) => ({ user_id: i + 101,
  name: i === 35 ? "最后一位好友 · 很长的名字也应该完整显示" : `测试好友 ${i + 1}`,
  has_active_tree: i === 35 || i % 7 !== 0, avatar_url: "" }));
async function run() {
  const browser = await chromium.launch({ headless: true, args: ["--enable-unsafe-swiftshader"] });
  try {
    const context = await browser.newContext({ viewport: { width: 1760, height: 1000 }, locale: "zh-CN" });
    await context.addInitScript(() => {
      localStorage.setItem("token", JSON.stringify({ tk: "tree-layout-fixture", id: 99 }));
      localStorage.setItem("loghome.theme", "dark");
      localStorage.setItem("loghomeTreePlantLowPerformance", "1");
    });
    const writes = [], errors = [];
    let friendCount = friends.length;
    await context.route("**/*", async (route) => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin === new URL(base).origin || request.method() === "OPTIONS") return api(route);
      if (request.method() !== "GET") writes.push(url.pathname);
      const name = url.pathname.split("/").pop();
      let data;
      if (name === "get_treePlant_of") data = [tree];
      if (name === "steal_dashboard") data = { steal_feature_enabled: true, steal_targets: friends.slice(0, friendCount), recent_steal_logs: [] };
      if (name === "subscription") data = { data: { active: true, subscription: { membership_type: "super" } } };
      if (name === "notification_settings") data = { notifications_disabled: false };
      if (name === "get_resources") data = [{ log: 14677, apple: 12688 }];
      if (name === "visit_friend_tree") {
        const friend = friends.find((row) => row.user_id === Number(url.searchParams.get("target_user_id")));
        data = { target_user_id: friend.user_id, target_name: friend.name,
          tree: { ...tree, growth_val: 20 }, can_steal: false, steal_tip: "测试好友树场" };
      }
      if (data !== undefined) return route.fulfill({ json: data, headers: { "access-control-allow-origin": "*" } });
      return api(route);
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "/me/tree");
    await page.locator(".tree-classic").waitFor();
    await page.locator(".tree-card h2").waitFor();
    async function geometry() {
      return page.evaluate(() => {
        const box = (selector) => document.querySelector(selector).getBoundingClientRect();
        const scene = box(".tree-scene-panel"), rewards = box(".reader-rewards"),
          sidebar = box(".tree-sidebar"), list = document.querySelector(".tree-friends-list");
        return { gap: rewards.top - scene.bottom, sceneHeight: scene.height,
          sidebarHeight: sidebar.height, listHeight: list.clientHeight,
          listContent: list.scrollHeight, rewardsTop: rewards.top + scrollY,
          overflow: document.documentElement.scrollWidth > innerWidth };
      });
    }
    const initial = await geometry();
    assert.ok(initial.gap >= 0 && initial.gap < 40, JSON.stringify(initial));
    assert.ok(initial.listHeight > 60 && initial.listHeight < 400);
    assert.ok(initial.listContent > initial.listHeight * 5);
    assert.equal(initial.overflow, false);
    await page.screenshot({ path: "/tmp/loghome-tree-layout-dark.png", animations: "disabled" });
    const list = page.getByRole("region", { name: "好友树场", exact: true });
    await list.focus();
    await page.keyboard.press("End");
    await page.waitForFunction(() => {
      const list = document.querySelector(".tree-friends-list");
      return list.scrollTop >= list.scrollHeight - list.clientHeight - 2;
    });
    await list.locator(".social-list-row").last().getByRole("button", { name: "串门", exact: true }).click();
    await page.getByRole("button", { name: "返回自己的树场", exact: true }).waitFor();
    assert.equal(await page.locator(".reader-rewards").isVisible(), false);
    await page.getByRole("button", { name: "返回自己的树场", exact: true }).click();
    await page.locator(".reader-rewards").waitFor();
    friendCount = 2;
    await page.locator(".workspace-actions .el-button").click();
    await page.waitForFunction(() => document.querySelectorAll(".tree-friends-list .social-list-row").length === 2);
    assert.ok(Math.abs((await geometry()).rewardsTop - initial.rewardsTop) < 2);

    friendCount = friends.length;
    await page.locator(".workspace-actions .el-button").click();
    await page.waitForFunction(() => document.querySelectorAll(".tree-friends-list .social-list-row").length === 36);
    await page.getByRole("switch", { name: "高质量 3D", exact: true }).click();
    await page.locator(".oak-tree-3d, .tree-classic").waitFor();
    assert.ok((await geometry()).gap < 40);
    await page.screenshot({ path: "/tmp/loghome-tree-layout-3d.png", animations: "disabled" });
    await page.evaluate(() => window.$nuxt.$theme.set("light"));
    for (const width of [1440, 1120, 1024, 700, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const value = await geometry();
      assert.equal(value.overflow, false, `horizontal overflow at ${width}`);
      assert.ok(value.listHeight > 30 && value.listHeight <= 400, `${width}: ${JSON.stringify(value)}`);
      if (width > 1100) assert.ok(value.gap < 40, `${width}: ${JSON.stringify(value)}`);
    }
    await page.screenshot({ path: "/tmp/loghome-tree-layout-narrow.png", animations: "disabled" });
    assert.deepEqual(writes, []);
    assert.deepEqual(errors, []);
    console.log("PASS long/short friend lists cannot push down rewards, bounded keyboard-scrollable list, last-friend visit/return, classic/3D modes, light/dark themes, desktop/tablet/narrow layout and no reward mutations");
  } finally { await browser.close(); }
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
