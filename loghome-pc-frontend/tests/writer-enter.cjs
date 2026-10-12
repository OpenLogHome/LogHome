// Exercise real keyboard events against the editor; all backend calls are mocked.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.WRITER_PLAYWRIGHT_MODULE ||
  "playwright");
const { api } = require("./writer-browser.cjs");
const base = process.env.WRITER_TEST_URL || "http://127.0.0.1:3117";

async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    await context.addInitScript(() =>
      localStorage.setItem(
        "token",
        JSON.stringify({ tk: "writer-test-only-token", id: 99 })
      )
    );
    await context.route("**/*", api);
    const page = await context.newPage();
    await page.goto(base + "/write/edit/7?article=10");
    const input = page.locator(".ProseMirror");
    await input.waitFor();
    async function reset(text, from, to = from) {
      await page.evaluate(
        ({ text, from, to }) => {
          const editor =
            document.querySelector(".native-editor").__vue__.editor;
          editor.commands.setContent({
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: text ? [{ type: "text", text }] : [],
              },
            ],
          });
          editor.commands.setTextSelection({ from, to });
          editor.commands.focus();
        },
        { text, from, to }
      );
    }
    async function state() {
      return page.evaluate(() => {
        const editor = document.querySelector(".native-editor").__vue__.editor;
        return {
          paragraphs: editor
            .getJSON()
            .content.map((node) =>
              (node.content || []).map((child) => child.text || "\n").join("")
            ),
          offset: editor.state.selection.$from.parentOffset,
        };
      });
    }

    await reset("正文", 3);
    await input.press("Enter");
    assert.deepEqual(await state(), {
      paragraphs: ["正文", "　　"],
      offset: 2,
    });
    await input.press("Enter");
    assert.deepEqual(await state(), {
      paragraphs: ["正文", "　　", "　　"],
      offset: 2,
    });

    await reset("前文后文", 3);
    // Separate fixture replacement from the keystroke's undo history group.
    await page.waitForTimeout(550);
    await input.press("Enter");
    assert.deepEqual(await state(), {
      paragraphs: ["前文", "　　后文"],
      offset: 2,
    });
    await page
      .locator('.editor-toolbar button[title="撤销 Ctrl / ⌘ Z"]')
      .click();
    assert.deepEqual(await state(), { paragraphs: ["前文后文"], offset: 2 });

    await reset("　　正文", 1);
    await input.press("Enter");
    assert.deepEqual(await state(), {
      paragraphs: ["", "　　正文"],
      offset: 2,
    });

    await reset("前选中后", 2, 4);
    await input.press("Enter");
    assert.deepEqual(await state(), {
      paragraphs: ["前", "　　后"],
      offset: 2,
    });

    await reset("正文", 3);
    await input.press("Shift+Enter");
    assert.deepEqual(await state(), { paragraphs: ["正文\n"], offset: 3 });

    await reset("", 1);
    await input.press("Enter");
    assert.deepEqual(await state(), { paragraphs: ["", "　　"], offset: 2 });
    console.log(
      "Writer Enter checks passed: end, repeated, middle, undo, existing indent, selection, Shift+Enter, empty paragraph."
    );
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
