// Real editor transactions and pointer events; backend requests are mocked.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE ||
  "playwright");
const { api } = require("./writer-browser.cjs");
const base = process.env.WRITER_TEST_URL || "http://127.0.0.1:3117";
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
    await page.goto(base + "/write/edit/7?article=10");
    await page.locator(".ProseMirror").waitFor();
    const state = () =>
      page.evaluate(() => {
        const editor = document.querySelector(".native-editor").__vue__.editor;
        return {
          doc: editor.getJSON(),
          selected: editor.state.selection.$from.parent.type.name,
          offset: editor.state.selection.$from.parentOffset,
        };
      });
    const reset = () =>
      page.evaluate(() => {
        const editor = document.querySelector(".native-editor").__vue__.editor;
        editor.commands.setContent({
          type: "doc",
          content: [
            { type: "image", attrs: { src: "https://fixture.test/image.png" } },
          ],
        });
      });
    await reset();
    const tail = page.getByRole("button", {
      name: "在图片后继续输入",
      exact: true,
    });
    await tail.waitFor();
    assert.equal((await state()).doc.content.length, 1);
    await page.locator(".ProseMirror img").click();
    assert.equal((await state()).doc.content.length, 1);
    await tail.click();
    let current = await state();
    assert.deepEqual(
      current.doc.content.map((node) => node.type),
      ["image", "paragraph"]
    );
    assert.equal(current.doc.content[1].content[0].text, "　　");
    assert.equal(current.selected, "paragraph");
    assert.equal(current.offset, 2);
    assert.equal(await tail.count(), 0);
    await page.keyboard.type("图片后正文");
    assert.equal(
      (await state()).doc.content[1].content[0].text,
      "　　图片后正文"
    );
    await reset();
    // Separate the fixture replacement from the user's undo group.
    await page.waitForTimeout(550);
    await tail.click();
    await page.keyboard.press("ControlOrMeta+z");
    assert.deepEqual(
      (await state()).doc.content.map((node) => node.type),
      ["image"]
    );
    await tail.waitFor();
    // Hit the editable body's blank space below a short final image.
    const image = await page.locator(".ProseMirror img").boundingBox();
    const body = await page.locator(".ProseMirror").boundingBox();
    await page.mouse.click(body.x + 30, image.y + image.height + 30);
    current = await state();
    assert.deepEqual(
      current.doc.content.map((node) => node.type),
      ["image", "paragraph"]
    );
    assert.equal(current.offset, 2);
    await page.evaluate(() =>
      document.querySelector(".native-editor").__vue__.appendImageParagraph()
    );
    assert.equal((await state()).doc.content.length, 2);
    await reset();
    await page.evaluate(() => {
      const component = document.querySelector(".native-editor").__vue__;
      component.$props.disabled = true;
      component.appendImageParagraph();
    });
    assert.equal((await state()).doc.content.length, 1);
    console.log(
      "PASS image-tail affordance, untouched image document, cursor indentation, typing, undo, blank-space click, duplicate and readonly guards"
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
