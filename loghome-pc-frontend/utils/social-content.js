const allowed = new Set([
  "P",
  "DIV",
  "SPAN",
  "BR",
  "H2",
  "H3",
  "H4",
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "UL",
  "OL",
  "LI",
  "BLOCKQUOTE",
  "A",
  "IMG",
  "TABLE",
  "THEAD",
  "TBODY",
  "TR",
  "TD",
  "TH",
]);
const discarded = new Set([
  "SCRIPT",
  "STYLE",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "FORM",
  "INPUT",
  "BUTTON",
  "SVG",
  "MATH",
  "LINK",
  "META",
]);
function safeUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim())
    ? value.trim()
    : "";
}
// Product descriptions share the mobile rich-text semantics, with a strict attribute allowlist.
export function productDescriptionHtml(value) {
  if (typeof DOMParser === "undefined" || typeof value !== "string") return "";
  const parsed = new DOMParser().parseFromString(value, "text/html");
  const clean = (node) => {
    if (node.nodeType === 3) return document.createTextNode(node.textContent);
    if (node.nodeType !== 1 || discarded.has(node.tagName))
      return document.createDocumentFragment();
    const target = allowed.has(node.tagName)
      ? document.createElement(node.tagName.toLowerCase())
      : document.createDocumentFragment();
    if (node.tagName === "IMG") {
      const src = safeUrl(node.getAttribute("src"));
      if (!src) return document.createDocumentFragment();
      target.setAttribute("src", src);
      target.setAttribute("alt", node.getAttribute("alt") || "商品介绍");
      target.setAttribute("loading", "lazy");
    }
    if (node.tagName === "A") {
      const href = safeUrl(node.getAttribute("href"));
      if (href) {
        target.setAttribute("href", href);
        target.setAttribute("target", "_blank");
        target.setAttribute("rel", "noopener noreferrer");
      }
    }
    if (node.tagName === "TD" || node.tagName === "TH") {
      ["colspan", "rowspan"].forEach((key) => {
        const size = Number(node.getAttribute(key));
        if (Number.isInteger(size) && size > 0 && size <= 20)
          target.setAttribute(key, String(size));
      });
    }
    Array.from(node.childNodes).forEach((child) =>
      target.appendChild(clean(child))
    );
    return target;
  };
  const container = document.createElement("div");
  Array.from(parsed.body.childNodes).forEach((node) =>
    container.appendChild(clean(node))
  );
  return container.innerHTML;
}
