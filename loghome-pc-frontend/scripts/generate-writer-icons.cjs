// Keep the icon font's semantic class names; change only the writing UI's visuals.
const fs = require("node:fs");
const path = require("node:path");
const icons = require("../config/writer/pixel-icons.json");
const scope =
  ":is(.writer-workspace, .writer-dialog, .writer-notice, .writer-popover)";
let css = `/* Generated from config/writer/pixel-icons.json by scripts/generate-writer-icons.cjs. */
${scope} i[class*="el-icon-"] {
  display: inline-block;
  width: 1em;
  height: 1em;
  line-height: 1;
  vertical-align: -0.1em;
  flex-shrink: 0;
}
${scope} i[class*="el-icon-"]::before {
  content: "" !important;
  display: block;
  width: 100%;
  height: 100%;
  background: currentColor;
  -webkit-mask: var(--writer-pixel-icon) center / contain no-repeat;
  mask: var(--writer-pixel-icon) center / contain no-repeat;
}
`;
for (const [name, d] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path d="${d}"/></svg>`;
  css += `${scope} .el-icon-${name} { --writer-pixel-icon: url("data:image/svg+xml,${encodeURIComponent(
    svg
  )}"); }\n`;
}
css += `${scope} .el-icon-loading { animation: writer-pixel-spin 1.2s steps(8, end) infinite; }
@keyframes writer-pixel-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { ${scope} .el-icon-loading { animation: none; } }
`;
fs.writeFileSync(
  path.join(__dirname, "../assets/css/writer-pixel-icons.css"),
  css
);
