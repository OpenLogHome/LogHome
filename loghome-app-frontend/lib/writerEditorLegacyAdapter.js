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
  return JSON.stringify(normalizeLegacyBlocks(blocks));
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

    return {
      type: "text",
      value: block && typeof block.value === "string" ? block.value : "",
    };
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

  return normalizeLegacyBlocks(blocks);
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
      formatted.push({
        type: "text",
        value: indent + trimmed,
      });
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
    blocks.push({
      type: "text",
      value: extractText(node),
    });
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
