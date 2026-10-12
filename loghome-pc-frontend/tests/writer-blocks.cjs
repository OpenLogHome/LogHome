// Block UI uses real ProseMirror transactions; manuscript APIs are mocked.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE ||
  "playwright");
const { api } = require("./writer-browser.cjs");
const base = process.env.WRITER_TEST_URL || "http://127.0.0.1:3117";
(async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: 1500, height: 950 },
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
    page.on("pageerror", (e) => {
      errors.push(e.message);
      console.error(e.message);
    });
    await page.goto(base + "/write/edit/7?article=10");
    await page.locator(".ProseMirror").waitFor();
    const reset = async () => {
      await page.evaluate(() => {
        const c = document.querySelector(".native-editor").__vue__;
        c.editor.commands.setContent({
          type: "doc",
          content: [
            {
              type: "paragraph",
              attrs: { legacyId: 10 },
              content: [{ type: "text", text: "第一段" }],
            },
            {
              type: "paragraph",
              attrs: { legacyId: 20 },
              content: [{ type: "text", text: "第二段" }],
            },
            { type: "image", attrs: { src: "https://fixture.test/image.png" } },
            {
              type: "paragraph",
              attrs: { legacyId: 30 },
              content: [{ type: "text", text: "第三段" }],
            },
          ],
        });
      });
      await page.waitForTimeout(550);
    };
    const state = () =>
      page.evaluate(() => {
        const e = document.querySelector(".native-editor").__vue__.editor;
        return {
          nodes: e.getJSON().content,
          offset: e.state.selection.$from.parentOffset,
          selection: e.state.selection.constructor.name,
        };
      });
    const menu = async (index) => {
      await page.locator(".ProseMirror > *").nth(index).hover();
      await page
        .getByRole("button", { name: "段落操作与拖拽", exact: true })
        .click();
      await page
        .getByRole("group", { name: "段落操作", exact: true })
        .waitFor();
    };
    const action = async (label) =>
      page
        .getByRole("group", { name: "段落操作", exact: true })
        .getByRole("button", { name: label, exact: true })
        .click();
    await reset();
    await page.locator(".ProseMirror p").first().hover();
    for (const [fontSize, lineHeight] of [
      [18, 1.9],
      [28, 2.4],
      [14, 1.4],
    ]) {
      await page.evaluate(
        ({ fontSize, lineHeight }) => {
          const root = document.querySelector(".writer-workspace").__vue__;
          root.preferences.fontSize = fontSize;
          root.preferences.lineHeight = lineHeight;
        },
        { fontSize, lineHeight }
      );
      await page.waitForFunction(() => {
        const paragraph = document.querySelector(".ProseMirror p");
        const handle = document.querySelector(".block-handle");
        if (!handle) return false;
        const p = paragraph.getBoundingClientRect(),
          h = handle.getBoundingClientRect();
        return (
          Math.abs(
            h.top +
              h.height / 2 -
              (p.top + parseFloat(getComputedStyle(paragraph).lineHeight) / 2)
          ) < 1
        );
      });
    }
    await page.evaluate(() => {
      const root = document.querySelector(".writer-workspace").__vue__;
      root.preferences.fontSize = 18;
      root.preferences.lineHeight = 1.9;
    });
    await menu(1);
    await action("复制一份");
    let s = await state();
    assert.equal(s.nodes.length, 5);
    assert.equal(s.nodes[2].content[0].text, "第二段");
    assert.equal(s.nodes[1].attrs.legacyId, 20);
    assert.equal(s.nodes[2].attrs.legacyId, null);
    await page.keyboard.press("ControlOrMeta+z");
    assert.equal((await state()).nodes.length, 4);
    await page.keyboard.press("ControlOrMeta+Shift+z");
    assert.equal((await state()).nodes.length, 5);
    await reset();
    await menu(1);
    await action("在上方新增段落");
    s = await state();
    assert.equal(s.nodes[1].content[0].text, "　　");
    assert.equal(s.offset, 2);
    await page.keyboard.type("新段");
    assert.equal((await state()).nodes[1].content[0].text, "　　新段");
    await reset();
    await menu(1);
    await action("上移");
    s = await state();
    assert.deepEqual(
      s.nodes.slice(0, 2).map((n) => n.attrs.legacyId),
      [20, 10]
    );
    await menu(0);
    await action("下移");
    assert.deepEqual(
      (await state()).nodes.slice(0, 2).map((n) => n.attrs.legacyId),
      [10, 20]
    );
    await menu(2);
    await action("删除");
    assert.equal(
      (await state()).nodes.some((n) => n.type === "image"),
      false
    );
    await reset();
    await menu(0);
    await action("选中此段");
    assert.equal((await state()).selection, "NodeSelection");
    // Pointer drag of a paragraph beyond an image block.
    await page.locator(".ProseMirror > *").nth(0).hover();
    const handle = await page
      .getByRole("button", { name: "段落操作与拖拽", exact: true })
      .boundingBox();
    const last = await page.locator(".ProseMirror > *").nth(3).boundingBox();
    await page.mouse.move(handle.x + 12, handle.y + 12);
    await page.mouse.down();
    await page.mouse.move(last.x + 30, last.y + last.height - 2, { steps: 8 });
    await page.locator(".block-drop-line").waitFor();
    await page.mouse.up();
    s = await state();
    assert.equal(s.nodes.at(-1).attrs.legacyId, 10);
    assert.equal(s.nodes[1].type, "image");
    await page.keyboard.press("ControlOrMeta+z");
    assert.equal((await state()).nodes[0].attrs.legacyId, 10);
    // Image duplication stays an image; deleting the only remaining block stays editable.
    await reset();
    await menu(2);
    await action("复制一份");
    assert.equal(
      (await state()).nodes.filter((n) => n.type === "image").length,
      2
    );
    await page.evaluate(() =>
      document
        .querySelector(".native-editor")
        .__vue__.editor.commands.setContent({
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "唯一段落" }],
            },
          ],
        })
    );
    await menu(0);
    await action("删除");
    s = await state();
    assert.equal(s.nodes.length, 1);
    assert.equal(s.nodes[0].type, "paragraph");
    await page.evaluate(
      () =>
        (document.querySelector(".writer-workspace").__vue__.preferences.theme =
          "dark")
    );
    await page.locator(".writer-workspace.theme-dark").waitFor();
    await menu(0);
    await page.screenshot({ path: "/tmp/loghome-writer-blocks.png" });
    await page
      .getByRole("group", { name: "段落操作" })
      .getByRole("button", { name: "在下方新增段落", exact: true })
      .focus();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".block-action-menu").count(), 0);
    await menu(0);
    await page.keyboard.press("End");
    assert.equal(
      await page.evaluate(() => document.activeElement.textContent.trim()),
      "删除"
    );
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "JSON 源码", exact: true }).click();
    assert.equal(await page.locator(".writer-block-controls").count(), 0);
    await page.getByRole("button", { name: "返回正文", exact: true }).click();
    await page.locator(".ProseMirror").waitFor();
    await menu(0);
    await page.evaluate(() =>
      document
        .querySelector(".native-editor")
        .__vue__.editor.commands.insertContent("外部修改")
    );
    assert.equal(await page.locator(".block-action-menu").count(), 0);
    assert.deepEqual(errors, []);
    console.log(
      "PASS block insertion/indent, duplication/IDs, menu move, delete, selection, image support, pointer drag, undo/redo, dark theme and Escape"
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
