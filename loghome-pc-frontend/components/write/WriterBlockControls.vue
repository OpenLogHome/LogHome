<template>
  <div class="writer-block-controls" @keydown.esc.stop.prevent="close">
    <div v-if="block && !disabled" class="block-handle" :style="handleStyle">
      <button
        type="button"
        aria-label="在此段后新增段落"
        title="新增段落"
        @mousedown.prevent
        @click="act('after')"
      >
        <i class="el-icon-plus" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="段落操作与拖拽"
        title="拖动排序，点击打开段落操作"
        @pointerdown="startDrag"
        @click="toggleMenu"
      >
        <svg
          width="12"
          height="18"
          viewBox="0 0 12 18"
          aria-hidden="true"
          focusable="false"
        >
          <g fill="currentColor">
            <circle cx="3" cy="3" r="1.4" />
            <circle cx="9" cy="3" r="1.4" />
            <circle cx="3" cy="9" r="1.4" />
            <circle cx="9" cy="9" r="1.4" />
            <circle cx="3" cy="15" r="1.4" />
            <circle cx="9" cy="15" r="1.4" />
          </g>
        </svg>
      </button>
    </div>
    <div
      v-if="menu && block && !disabled"
      class="block-action-menu"
      :style="menuStyle"
      role="group"
      aria-label="段落操作"
      @keydown="menuKey"
    >
      <button
        v-for="item in actions"
        :key="item.key"
        type="button"
        @mousedown.prevent
        @click="act(item.key)"
      >
        <svg
          class="block-action-icon"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          shape-rendering="crispEdges"
          aria-hidden="true"
          focusable="false"
        >
          <path :d="actionIcons[item.key]" fill="currentColor" />
        </svg>
        <span>{{ item.label }}</span>
      </button>
    </div>
    <div
      v-if="drop"
      class="block-drop-line"
      :style="dropStyle"
      aria-hidden="true"
    />
    <span class="writer-sr-only" role="status">{{ announcement }}</span>
  </div>
</template>
<script>
import { NodeSelection, TextSelection } from "@tiptap/pm/state";
import { closeHistory } from "@tiptap/pm/history";
export default {
  props: { editor: Object, disabled: Boolean },
  data: () => ({
    block: null,
    menu: false,
    drop: null,
    announcement: "",
    actionIcons: Object.freeze({
      before: "M7 1h2v2h2v2H9v2H7V5H5V3h2zM2 9h12v2H2zM2 13h9v2H2z",
      after: "M2 1h12v2H2zM2 5h9v2H2zM7 9h2v2h2v2H9v2H7v-2H5v-2h2z",
      select:
        "M1 1h5v2H3v3H1zM10 1h5v5h-2V3h-3zM1 10h2v3h3v2H1zM13 10h2v5h-5v-2h3zM5 5h6v2H5zM5 9h6v2H5z",
      duplicate: "M1 1h9v3H8V3H3v7h1v2H1zM5 5h10v10H5zM7 7v6h6V7z",
      up: "M7 1h2v2h2v2h2v2H9v6H7V7H3V5h2V3h2zM3 14h10v2H3z",
      down: "M3 0h10v2H3zM7 3h2v6h4v2h-2v2H9v2H7v-2H5v-2H3V9h4z",
      delete: "M6 1h4v2h4v2H2V3h4zM3 6h2v7h6V6h2v7h-2v2H5v-2H3zM7 6h2v6H7z",
    }),
    actions: [
      { key: "before", label: "在上方新增段落" },
      { key: "after", label: "在下方新增段落" },
      { key: "select", label: "选中此段" },
      { key: "duplicate", label: "复制一份" },
      { key: "up", label: "上移" },
      { key: "down", label: "下移" },
      { key: "delete", label: "删除" },
    ],
  }),
  computed: {
    handleStyle() {
      return {
        left: Math.max(4, this.block.left - 52) + "px",
        top: this.block.top + "px",
      };
    },
    menuStyle() {
      return {
        left:
          Math.max(8, Math.min(this.block.left - 52, window.innerWidth - 190)) +
          "px",
        top:
          Math.max(8, Math.min(this.block.top + 28, window.innerHeight - 290)) +
          "px",
      };
    },
    dropStyle() {
      return {
        left: this.drop.left + "px",
        top: this.drop.top + "px",
        width: this.drop.width + "px",
      };
    },
  },
  watch: {
    disabled(value) {
      if (value) this.close();
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (!this._isBeingDestroyed) this.bindEditor();
    });
  },
  beforeDestroy() {
    this.blockObserver?.disconnect();
    this.close();
    this.body?.removeEventListener("mousemove", this.hover);
    this.editor.off("selectionUpdate", this.selection);
    this.editor.off("transaction", this.transaction);
    this.scroller?.removeEventListener("scroll", this.reposition);
    window.removeEventListener("resize", this.close);
    document.removeEventListener("pointerdown", this.outside, true);
    document.removeEventListener("keydown", this.escape, true);
  },
  methods: {
    bindEditor() {
      this.body = this.editor.view.dom;
      this.scroller = this.body.closest(".editor-scroll");
      this.body.addEventListener("mousemove", this.hover);
      this.editor.on("selectionUpdate", this.selection);
      this.editor.on("transaction", this.transaction);
      this.scroller.addEventListener("scroll", this.reposition, {
        passive: true,
      });
      window.addEventListener("resize", this.close);
      document.addEventListener("pointerdown", this.outside, true);
      document.addEventListener("keydown", this.escape, true);
    },
    escape(event) {
      if (event.key !== "Escape" || (!this.menu && !this.drag)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.close();
      this.editor.view.focus();
    },

    blocks() {
      const rows = [];
      this.editor.state.doc.forEach((node, pos) => {
        const dom = this.editor.view.nodeDOM(pos);
        if (dom && dom.getBoundingClientRect)
          rows.push({ node, pos, dom, rect: dom.getBoundingClientRect() });
      });
      return rows;
    },
    show(row) {
      if (!row || this.disabled) {
        this.block = null;
        return;
      }
      const bounds = this.scroller.getBoundingClientRect();
      if (row.rect.bottom < bounds.top || row.rect.top > bounds.bottom) {
        this.block = null;
        return;
      }
      const dom = row.dom || this.editor.view.nodeDOM(row.pos);
      const node = row.node || this.editor.state.doc.nodeAt(row.pos);
      let top = row.rect.top;
      if (node?.isTextblock && dom) {
        const style = getComputedStyle(dom);
        const lineHeight =
          parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
        top +=
          (parseFloat(style.borderTopWidth) || 0) +
          (parseFloat(style.paddingTop) || 0) +
          (lineHeight - 28) / 2;
        // Do not pin the handle to the viewport when its first line has scrolled away.
        if (top + 14 < bounds.top || top + 14 > bounds.bottom) {
          this.block = null;
          return;
        }
      }
      if (dom && this.observedBlock !== dom && window.ResizeObserver) {
        this.blockObserver?.disconnect();
        this.blockObserver = new ResizeObserver(this.reposition);
        this.blockObserver.observe(dom);
        this.observedBlock = dom;
      }
      this.block = {
        pos: row.pos,
        left: row.rect.left,
        top,
      };
    },
    hover(event) {
      if (this.menu || this.drag || this.disabled || event.buttons) return;
      let dom = event.target;
      while (dom && dom !== this.body && dom.parentElement !== this.body)
        dom = dom.parentElement;
      if (dom && dom !== this.body) {
        const resolved = this.editor.state.doc.resolve(
          this.editor.view.posAtDOM(dom, 0)
        );
        const pos = resolved.depth ? resolved.before(1) : resolved.pos;
        this.show({ pos, dom, rect: dom.getBoundingClientRect() });
        return;
      }
      const rows = this.blocks();
      this.show(
        rows.find(
          (row) => row.dom === event.target || row.dom.contains(event.target)
        ) ||
          rows.find(
            (row) =>
              row.rect.top <= event.clientY && row.rect.bottom >= event.clientY
          )
      );
    },
    selection() {
      if (this.menu || this.drag) return;
      const pos = this.editor.state.selection.from;
      this.show(
        this.blocks().find(
          (row) => pos >= row.pos && pos < row.pos + row.node.nodeSize
        )
      );
    },
    reposition() {
      if (this.block)
        this.show(this.blocks().find((row) => row.pos === this.block.pos));
      if (this.drag?.started) this.findDrop();
    },
    transaction({ transaction }) {
      if (transaction.docChanged) this.close();
    },
    outside(event) {
      if (!this.$el.contains(event.target)) this.close();
    },
    close() {
      this.blockObserver?.disconnect();
      this.observedBlock = null;
      this.endDrag();
      this.menu = false;
      this.block = null;
    },
    toggleMenu() {
      if (Date.now() < (this.ignoreClickUntil || 0)) return;
      this.menu = !this.menu;
      if (this.menu)
        this.$nextTick(() =>
          this.$el
            .querySelector(".block-action-menu button")
            ?.focus({ preventScroll: true })
        );
    },
    menuKey(event) {
      if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const buttons = [...event.currentTarget.querySelectorAll("button")];
      const index = buttons.indexOf(document.activeElement);
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
          ? buttons.length - 1
          : (index + (event.key === "ArrowUp" ? -1 : 1) + buttons.length) %
            buttons.length;
      buttons[next]?.focus({ preventScroll: true });
    },
    paragraph() {
      return this.editor.schema.nodes.paragraph.create(
        null,
        this.editor.schema.text("　　")
      );
    },
    dispatch(tr) {
      this.editor.view.dispatch(closeHistory(tr).scrollIntoView());
      this.editor.view.focus();
    },
    act(action) {
      if (!this.block || this.disabled || !this.editor.isEditable) return;
      const rows = this.blocks(),
        index = rows.findIndex((row) => row.pos === this.block.pos),
        row = rows[index];
      if (!row) return this.close();
      if (action === "up" || action === "down") {
        const target =
          action === "up"
            ? rows[index - 1]?.pos
            : rows[index + 1]
            ? rows[index + 1].pos + rows[index + 1].node.nodeSize
            : undefined;
        if (target !== undefined) this.move(row, target);
        return;
      }
      let tr = this.editor.state.tr;
      if (action === "select") {
        tr.setSelection(NodeSelection.create(tr.doc, row.pos));
      } else if (action === "delete") {
        tr.delete(row.pos, row.pos + row.node.nodeSize);
        if (!tr.doc.childCount) tr.insert(0, this.paragraph());
        tr.setSelection(
          TextSelection.near(
            tr.doc.resolve(Math.min(row.pos, tr.doc.content.size))
          )
        );
      } else {
        const pos = action === "before" ? row.pos : row.pos + row.node.nodeSize;
        const node =
          action === "duplicate"
            ? row.node.type.create(
                { ...row.node.attrs, legacyId: null },
                row.node.content,
                row.node.marks
              )
            : this.paragraph();
        tr.insert(pos, node);
        tr.setSelection(
          node.isTextblock
            ? TextSelection.create(
                tr.doc,
                pos + 1 + (action === "duplicate" ? node.content.size : 2)
              )
            : NodeSelection.create(tr.doc, pos)
        );
      }
      this.close();
      this.dispatch(tr);
    },
    move(row, target) {
      const end = row.pos + row.node.nodeSize;
      if (target >= row.pos && target <= end) return;
      const tr = this.editor.state.tr.delete(row.pos, end);
      const pos = target > end ? target - row.node.nodeSize : target;
      tr.insert(pos, row.node);
      tr.setSelection(
        row.node.isTextblock
          ? TextSelection.create(tr.doc, pos + 1)
          : NodeSelection.create(tr.doc, pos)
      );
      this.close();
      this.dispatch(tr);
      this.announcement = "段落位置已调整";
    },
    startDrag(event) {
      if (event.button !== 0 || this.disabled || !this.block) return;
      event.preventDefault();
      this.drag = {
        pos: this.block.pos,
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        startX: event.clientX,
        startY: event.clientY,
        started: false,
      };
      document.addEventListener("pointermove", this.dragMove, {
        passive: false,
      });
      document.addEventListener("pointerup", this.finishDrag);
      document.addEventListener("pointercancel", this.close);
      window.addEventListener("blur", this.close);
    },
    dragMove(event) {
      if (!this.drag || event.pointerId !== this.drag.pointerId) return;
      this.drag.x = event.clientX;
      this.drag.y = event.clientY;
      if (
        !this.drag.started &&
        Math.hypot(
          this.drag.x - this.drag.startX,
          this.drag.y - this.drag.startY
        ) < 5
      )
        return;
      event.preventDefault();
      if (!this.drag.started) {
        this.drag.started = true;
        this.menu = false;
        this.frame = requestAnimationFrame(this.autoScroll);
      }
      this.findDrop();
    },
    findDrop() {
      const { x, y } = this.drag,
        bounds = this.scroller.getBoundingClientRect(),
        rows = this.blocks();
      if (
        x < bounds.left ||
        x > bounds.right ||
        y < bounds.top ||
        y > bounds.bottom ||
        !rows.length
      ) {
        this.drop = null;
        return;
      }
      const row =
        rows.find((item) => y < item.rect.top + item.rect.height / 2) ||
        rows[rows.length - 1];
      const after = y >= row.rect.top + row.rect.height / 2;
      this.drop = {
        pos: after ? row.pos + row.node.nodeSize : row.pos,
        left: row.rect.left,
        top: after ? row.rect.bottom : row.rect.top,
        width: row.rect.width,
      };
    },
    autoScroll(time) {
      if (!this.drag?.started) return;
      const bounds = this.scroller.getBoundingClientRect(),
        y = this.drag.y;
      if (
        this.drag.x >= bounds.left &&
        this.drag.x <= bounds.right &&
        y >= bounds.top &&
        y <= bounds.bottom
      ) {
        const speed = y < bounds.top + 44 ? -1 : y > bounds.bottom - 44 ? 1 : 0;
        this.scroller.scrollTop +=
          speed * Math.min(32, time - (this.lastTime || time)) * 0.5;
        this.findDrop();
      }
      this.lastTime = time;
      this.frame = requestAnimationFrame(this.autoScroll);
    },
    finishDrag(event) {
      if (!this.drag || event.pointerId !== this.drag.pointerId) return;
      const started = this.drag.started,
        row = this.blocks().find((row) => row.pos === this.drag.pos),
        target = this.drop?.pos;
      this.endDrag();
      if (started) {
        this.ignoreClickUntil = Date.now() + 400;
        if (
          row &&
          target !== undefined &&
          !this.disabled &&
          this.editor.isEditable
        )
          this.move(row, target);
      }
    },
    endDrag() {
      document.removeEventListener("pointermove", this.dragMove);
      document.removeEventListener("pointerup", this.finishDrag);
      document.removeEventListener("pointercancel", this.close);
      window.removeEventListener("blur", this.close);
      cancelAnimationFrame(this.frame);
      this.lastTime = null;
      this.drag = null;
      this.drop = null;
    },
  },
};
</script>
<style scoped>
.block-handle {
  position: fixed;
  display: flex;
  z-index: 15;
  gap: 2px;
}
.block-handle button {
  display: grid;
  place-items: center;
  width: 24px;
  height: 28px;
  min-height: 28px;
  line-height: 1;
  padding: 0;
  color: var(--writer-muted);
  background: var(--writer-panel);
  border: 0;
  border-radius: 4px;
}
.block-handle button:last-child {
  cursor: grab;
}
.block-handle button:hover {
  color: var(--writer-text);
  background: var(--writer-hover);
}
.block-action-menu {
  position: fixed;
  z-index: 30;
  width: 180px;
  padding: 6px;
  background: var(--writer-panel);
  border: 1px solid var(--writer-border);
  border-radius: 6px;
  box-shadow: 0 8px 24px #0002;
}
.block-action-menu button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  font-size: 12px;
  padding: 8px;
}
.block-action-icon {
  display: block;
  flex: 0 0 16px;
  color: var(--writer-muted);
}
.block-drop-line {
  position: fixed;
  z-index: 20;
  height: 2px;
  background: var(--writer-accent);
  pointer-events: none;
}
</style>
