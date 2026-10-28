const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const mobile = readJson("config/i18n/mobile-messages.json");
const desktopEnglish = readJson("config/i18n/desktop-en.json");
const pc = readJson("config/i18n/pc-messages.json");
const localizedDocuments = [
  ["config/home-copy.json", "config/i18n/home-copy.en.json"],
];
const sourceRoots = ["pages", "components", "layouts", "mixins", "plugins", "utils"];
const extensions = new Set([".vue", ".js"]);
const failures = [];
const warnings = [];

function flatJsonKeys(file) {
  const seen = new Map();
  const duplicates = [];
  fs.readFileSync(path.join(root, file), "utf8")
    .split(/\r?\n/)
    .forEach((line, index) => {
      const match = line.match(/^  "((?:[^"\\]|\\.)+)"\s*:/);
      if (!match) return;
      const key = JSON.parse(`"${match[1]}"`);
      if (seen.has(key)) duplicates.push(`${key} (lines ${seen.get(key)} and ${index + 1})`);
      else seen.set(key, index + 1);
    });
  return duplicates;
}

for (const duplicate of flatJsonKeys("config/i18n/desktop-en.json"))
  failures.push(`Duplicate desktop dictionary key: ${duplicate}`);

function walk(directory, result = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, result);
    else if (extensions.has(path.extname(entry.name))) result.push(target);
  }
  return result;
}

function normalized(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

const normalizedDesktop = new Set(Object.keys(desktopEnglish).map(normalized));
function hasTranslation(key) {
  const mobileKey = mobile.sourceKeys[key] || key;
  return Boolean(
    Object.prototype.hasOwnProperty.call(pc.en, mobileKey) ||
      Object.prototype.hasOwnProperty.call(desktopEnglish, key) ||
      normalizedDesktop.has(normalized(key)) ||
      Object.prototype.hasOwnProperty.call(mobile.en, mobileKey)
  );
}

function interpolation(value) {
  return [...String(value).matchAll(/\{\{?(\w+)\}?\}/g)]
    .map((match) => match[1])
    .sort()
    .join(",");
}

function documentShape(value, prefix = "", result = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => documentShape(item, `${prefix}[${index}]`, result));
  } else if (value && typeof value === "object") {
    Object.keys(value)
      .sort()
      .forEach((key) => documentShape(value[key], prefix ? `${prefix}.${key}` : key, result));
  } else {
    result.push(`${prefix}:${typeof value}`);
  }
  return result;
}

for (const [sourceFile, translatedFile] of localizedDocuments) {
  const sourceShape = documentShape(readJson(sourceFile)).join("\n");
  const translatedShape = documentShape(readJson(translatedFile)).join("\n");
  if (sourceShape !== translatedShape)
    failures.push(`Localized document shape differs: ${sourceFile} / ${translatedFile}`);
}

const zhKeys = Object.keys(pc["zh-CN"]);
const enKeys = Object.keys(pc.en);
for (const key of zhKeys.filter((key) => !Object.prototype.hasOwnProperty.call(pc.en, key)))
  failures.push(`PC English dictionary is missing: ${key}`);
for (const key of enKeys.filter((key) => !Object.prototype.hasOwnProperty.call(pc["zh-CN"], key)))
  failures.push(`PC Chinese dictionary is missing: ${key}`);
for (const key of zhKeys.filter((key) => Object.prototype.hasOwnProperty.call(pc.en, key))) {
  if (interpolation(pc["zh-CN"][key]) !== interpolation(pc.en[key]))
    failures.push(`Interpolation differs for: ${key}`);
}

const files = sourceRoots.flatMap((directory) => walk(path.join(root, directory)));
for (const file of walk(path.join(root, "plugins/api"))) {
  const source = fs.readFileSync(file, "utf8");
  if (/\bfetch\s*\(/.test(source) && !/localizedFetch\s+as\s+fetch/.test(source))
    failures.push(`${path.relative(root, file)} uses fetch without the localized request wrapper`);
}
const literalCalls = [];
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const call = /\$t\s*\(\s*(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
  let match;
  while ((match = call.exec(source))) {
    const key = match[2].replace(/\\n/g, "\n");
    literalCalls.push({ file: path.relative(root, file), key });
    if (!hasTranslation(key))
      failures.push(`${path.relative(root, file)} uses untranslated key: ${normalized(key)}`);
  }
}

const used = new Set(
  literalCalls
    .map(({ key }) => mobile.sourceKeys[key] || key)
    .filter((key) => Object.prototype.hasOwnProperty.call(pc.en, key))
);
for (const key of enKeys.filter((key) => !used.has(key)))
  warnings.push(`PC dictionary key is not referenced literally: ${key}`);

console.log(
  `i18n audit: ${files.length} source files, ${literalCalls.length} literal $t calls, ${
    new Set(literalCalls.map(({ key }) => key)).size
  } unique keys, ${enKeys.length} semantic PC keys`
);
if (warnings.length) {
  console.log(`WARN ${warnings.length} non-blocking findings`);
  warnings.slice(0, 20).forEach((warning) => console.log(`  - ${warning}`));
  if (warnings.length > 20) console.log(`  - … ${warnings.length - 20} more`);
}
if (failures.length) {
  console.error(`FAIL ${failures.length} i18n findings`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exitCode = 1;
} else {
  console.log("PASS dictionary parity, interpolation parity and literal translation coverage");
}
