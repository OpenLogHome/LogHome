export function parseLegacyContent(content) {
  if (Array.isArray(content)) {
    return normalizeLegacyBlocks(content);
  }

  if (!content || typeof content !== "string") {
    return [{ type: "text", value: "" }];
  }

  try {
    const parsed = JSON.parse(content);
    return normalizeLegacyBlocks(parsed);
  } catch (error) {
    console.error("Failed to parse legacy writer content:", error);
    return [{ type: "text", value: "" }];
  }
}

export function stringifyLegacyContent(blocks) {
  return normalizeLegacyContentForStorage(
    JSON.stringify(normalizeLegacyBlocks(blocks))
  );
}

export function normalizeLegacyContentForStorage(content) {
  const blocks = parseRawLegacyBlocks(content);
  if (!blocks) {
    return typeof content === "string"
      ? content
      : JSON.stringify(normalizeLegacyBlocks(content));
  }

  const repaired = repairLegacyBlockIdsForStorage(blocks);
  if (repaired.changed || typeof content !== "string") {
    return JSON.stringify(repaired.blocks);
  }
  return content;
}

export function getLegacyContentComparableSignature(content) {
  return JSON.stringify(
    parseLegacyContent(content).map((block) => {
      if (block.type === "image") {
        return {
          type: "image",
          img: block.img || "",
        };
      }

      return {
        type: "text",
        value: block.value || "",
      };
    })
  );
}

export function areLegacyContentsEquivalent(leftContent, rightContent) {
  return (
    getLegacyContentComparableSignature(leftContent) ===
    getLegacyContentComparableSignature(rightContent)
  );
}

export function normalizeLegacyBlocks(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return [{ type: "text", value: "" }];
  }

  return blocks.map((block) => {
    if (block && block.type === "image" && block.img) {
      return {
        type: "image",
        img: block.img,
      };
    }

    const normalizedBlock = {
      type: "text",
      value: block && typeof block.value === "string" ? block.value : "",
    };

    const blockId = normalizeBlockId(block);
    if (blockId !== null) {
      normalizedBlock.id = blockId;
    }

    return normalizedBlock;
  });
}

export function countLegacyContent(blocks) {
  const normalized = normalizeLegacyBlocks(blocks);

  return normalized.reduce(
    (acc, block) => {
      if (block.type === "image") {
        acc.imageCount += 1;
      } else {
        acc.textCount += block.value.length;
      }
      return acc;
    },
    { textCount: 0, imageCount: 0 }
  );
}

export function legacyBlocksToDoc(blocks) {
  const normalized = normalizeLegacyBlocks(blocks);
  const content = normalized.map((block) => {
    if (block.type === "image") {
      return {
        type: "image",
        attrs: {
          src: block.img,
        },
      };
    }

    return {
      type: "paragraph",
      attrs: buildParagraphAttrs(block),
      content: textToParagraphContent(block.value),
    };
  });

  return {
    type: "doc",
    content: content.length > 0 ? content : [{ type: "paragraph" }],
  };
}

export function docToLegacyBlocks(doc) {
  const blocks = [];
  const content = doc && Array.isArray(doc.content) ? doc.content : [];

  content.forEach((node) => {
    collectLegacyBlocks(node, blocks);
  });

  return assignMissingLegacyIds(normalizeLegacyBlocks(blocks));
}

export function formatLegacyBlocks(blocks, options = {}) {
  const normalized = normalizeLegacyBlocks(blocks);
  const indent = typeof options.indent === "string" ? options.indent : "　　";
  const addParagraphSpacing = Boolean(options.addParagraphSpacing);
  const formatted = [];

  normalized.forEach((block) => {
    if (block.type === "image") {
      formatted.push(block);
      if (addParagraphSpacing) {
        formatted.push({ type: "text", value: "" });
      }
      return;
    }

    const trimmed = block.value.trim();
    if (trimmed) {
      const nextBlock = {
        type: "text",
        value: indent + trimmed,
      };
      if (block.id !== undefined) {
        nextBlock.id = block.id;
      }
      formatted.push(nextBlock);
      if (addParagraphSpacing) {
        formatted.push({ type: "text", value: "" });
      }
    }
  });

  while (formatted.length > 1) {
    const last = formatted[formatted.length - 1];
    if (last.type === "text" && last.value === "") {
      formatted.pop();
      continue;
    }
    break;
  }

  return normalizeLegacyBlocks(formatted);
}

function textToParagraphContent(value) {
  if (!value) {
    return [];
  }

  const parts = String(value).split("\n");
  const content = [];

  parts.forEach((part, index) => {
    if (part) {
      content.push({
        type: "text",
        text: part,
      });
    }

    if (index !== parts.length - 1) {
      content.push({
        type: "hardBreak",
      });
    }
  });

  return content;
}

function collectLegacyBlocks(node, blocks) {
  if (!node) {
    return;
  }

  if (node.type === "image" && node.attrs && node.attrs.src) {
    blocks.push({
      type: "image",
      img: node.attrs.src,
    });
    return;
  }

  if (isTextBlockNode(node.type)) {
    const block = {
      type: "text",
      value: extractText(node),
    };
    const blockId = normalizeBlockId(node && node.attrs);
    if (blockId !== null) {
      block.id = blockId;
    }
    blocks.push(block);
    return;
  }

  const children = Array.isArray(node.content) ? node.content : [];
  children.forEach((child) => collectLegacyBlocks(child, blocks));
}

function isTextBlockNode(type) {
  return ["paragraph", "heading", "blockquote", "codeBlock"].includes(type);
}

function extractText(node) {
  if (!node) {
    return "";
  }

  if (node.type === "text") {
    return node.text || "";
  }

  if (node.type === "hardBreak") {
    return "\n";
  }

  const children = Array.isArray(node.content) ? node.content : [];
  return children.map((child) => extractText(child)).join("");
}

function normalizeBlockId(block) {
  if (!block) {
    return null;
  }

  const rawId =
    block.id ??
    block.paragraph_id ??
    block.legacyId ??
    block.legacy_id ??
    null;

  if (rawId === null || rawId === undefined || rawId === "") {
    return null;
  }

  const normalizedId = Number(rawId);
  if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
    return null;
  }

  return normalizedId;
}

function parsePositiveBlockId(rawId) {
  if (rawId === null || rawId === undefined || rawId === "") {
    return null;
  }

  const normalizedId = Number(rawId);
  return Number.isInteger(normalizedId) && normalizedId > 0
    ? normalizedId
    : null;
}

function parseRawLegacyBlocks(content) {
  if (Array.isArray(content)) {
    return content;
  }

  if (!content || typeof content !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
}

function isTextStorageBlock(block) {
  return (
    block &&
    typeof block === "object" &&
    !Array.isArray(block) &&
    block.type === "text"
  );
}

function getEffectiveStorageBlockId(block) {
  return (
    parsePositiveBlockId(block && block.id) ||
    parsePositiveBlockId(block && block.paragraph_id) ||
    parsePositiveBlockId(block && block.legacyId) ||
    parsePositiveBlockId(block && block.legacy_id)
  );
}

function repairLegacyBlockIdsForStorage(blocks) {
  if (!Array.isArray(blocks)) {
    return {
      blocks: [{ type: "text", value: "", id: 1 }],
      changed: true,
    };
  }

  if (blocks.length === 0) {
    return {
      blocks,
      changed: false,
    };
  }

  const idCounts = new Map();
  blocks.forEach((block) => {
    if (!isTextStorageBlock(block)) {
      return;
    }

    const blockId = getEffectiveStorageBlockId(block);
    if (blockId) {
      idCounts.set(blockId, (idCounts.get(blockId) || 0) + 1);
    }
  });

  const hasDuplicateIds = Array.from(idCounts.values()).some(
    (count) => count > 1
  );
  if (hasDuplicateIds) {
    let nextId = 1;
    return {
      changed: true,
      blocks: blocks.map((block) => {
        if (!isTextStorageBlock(block)) {
          return block;
        }

        const fixedBlock = {
          ...block,
          id: nextId,
        };
        nextId += 1;
        return fixedBlock;
      }),
    };
  }

  let maxId = 0;
  blocks.forEach((block) => {
    if (!isTextStorageBlock(block)) {
      return;
    }

    const blockId = getEffectiveStorageBlockId(block);
    if (blockId && blockId > maxId) {
      maxId = blockId;
    }
  });

  let changed = false;
  const repairedBlocks = blocks.map((block) => {
    if (!isTextStorageBlock(block)) {
      return block;
    }

    const blockId = parsePositiveBlockId(block.id);
    if (blockId) {
      return block;
    }

    const fallbackId =
      parsePositiveBlockId(block.paragraph_id) ||
      parsePositiveBlockId(block.legacyId) ||
      parsePositiveBlockId(block.legacy_id);
    if (fallbackId) {
      changed = true;
      return {
        ...block,
        id: fallbackId,
      };
    }

    maxId += 1;
    changed = true;
    return {
      ...block,
      id: maxId,
    };
  });

  return {
    blocks: repairedBlocks,
    changed,
  };
}

function buildParagraphAttrs(block) {
  const blockId = normalizeBlockId(block);
  if (blockId === null) {
    return {};
  }

  return {
    legacyId: blockId,
  };
}

function assignMissingLegacyIds(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return [{ type: "text", value: "", id: 1 }];
  }

  return normalizeLegacyBlocks(repairLegacyBlockIdsForStorage(blocks).blocks);
}
