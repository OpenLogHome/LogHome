import Paragraph from "@tiptap/extension-paragraph";
import { Extension } from "@tiptap/vue-2";
import { Plugin, PluginKey } from "@tiptap/pm/state";
const LegacyParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...(this.parent ? this.parent() : {}),
      legacyId: {
        default: null,
        parseHTML: (element) => {
          const rawId = element.getAttribute("data-legacy-id");
          if (rawId === null || rawId === undefined || rawId === "") {
            return null;
          }
          const normalizedId = Number(rawId);
          return Number.isFinite(normalizedId) && normalizedId > 0
            ? normalizedId
            : null;
        },
        renderHTML: (attributes) => {
          const normalizedId = Number(attributes.legacyId);
          if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
            return {};
          }
          return {
            "data-legacy-id": String(normalizedId),
          };
        },
      },
    };
  },
});

const ParagraphIdPluginKey = new PluginKey("writerRealtimeParagraphIds");

function createRealtimeParagraphIdExtension(allocateId, requestMoreIds) {
  return Extension.create({
    name: "writerRealtimeParagraphIds",
    priority: 1100,
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: ParagraphIdPluginKey,
          appendTransaction(transactions, oldState, newState) {
            const shouldInspect = transactions.some(
              (transaction) =>
                transaction.docChanged ||
                transaction.getMeta(ParagraphIdPluginKey)
            );
            if (!shouldInspect) return null;

            const usedIds = new Set();
            const repairs = [];
            newState.doc.descendants((node, pos) => {
              if (node.type.name !== "paragraph") return true;
              const id = Number(node.attrs && node.attrs.legacyId);
              if (Number.isInteger(id) && id > 0 && !usedIds.has(id)) {
                usedIds.add(id);
                return false;
              }

              const replacementId = allocateId(usedIds);
              if (!replacementId) {
                requestMoreIds();
                return false;
              }
              usedIds.add(replacementId);
              repairs.push({ pos, node, id: replacementId });
              return false;
            });

            if (!repairs.length) return null;
            const transaction = newState.tr;
            repairs.forEach(({ pos, node, id }) => {
              transaction.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                legacyId: id,
              });
            });
            transaction.setMeta(ParagraphIdPluginKey, "assigned");
            transaction.setMeta("addToHistory", false);
            return transaction;
          },
        }),
      ];
    },
  });
}

export {
  LegacyParagraph,
  ParagraphIdPluginKey,
  createRealtimeParagraphIdExtension,
};
