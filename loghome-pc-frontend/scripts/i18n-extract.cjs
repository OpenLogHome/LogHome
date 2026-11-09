const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const roots = ["pages", "components", "layouts", "mixins", "plugins", "utils"];
const extensions = new Set([".vue", ".js"]);
const rows = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (extensions.has(path.extname(entry.name))) inspect(target);
  }
}

function inspect(file) {
  const source = fs.readFileSync(file, "utf8");
  const lines = source.split(/\r?\n/);
  let inBlockComment = false;
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("<!--") || trimmed.startsWith("/*")) inBlockComment = true;
    const comment = inBlockComment || trimmed.startsWith("//") || trimmed.startsWith("*");
    if (!comment && /[\u3400-\u9fff]/.test(line) && !/\$t\s*\(/.test(line)) {
      rows.push({ file: path.relative(root, file), line: index + 1, text: trimmed });
    }
    if (trimmed.includes("-->") || trimmed.includes("*/")) inBlockComment = false;
  });
}

roots.forEach((directory) => walk(path.join(root, directory)));
const domains = new Map();
for (const row of rows) {
  const parts = row.file.split(path.sep);
  const domain = parts[0] === "pages" || parts[0] === "components" ? parts.slice(0, 2).join("/") : parts[0];
  domains.set(domain, (domains.get(domain) || 0) + 1);
}
console.log(`Potential untranslated Chinese lines: ${rows.length}`);
for (const [domain, count] of [...domains.entries()].sort((a, b) => b[1] - a[1]))
  console.log(`${String(count).padStart(5)}  ${domain}`);
if (process.argv.includes("--details"))
  rows.forEach((row) => console.log(`${row.file}:${row.line}: ${row.text}`));
