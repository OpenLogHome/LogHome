const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
function patch(source, before, after) {
  if (source.split(before).length !== 2) throw new Error('导出文件补丁边界不匹配：' + before.slice(0, 80));
  return source.replace(before, after);
}
let html = fs.readFileSync(path.join(root, 'vendor/index.html'), 'utf8');
html = patch(html, '<title>封面文字图生成器</title>', '<title>帖子封面生成器</title>');
html = patch(html, '</head>', '<link rel="stylesheet" href="./loghome.css">\n</head>');
html = patch(html, '<div class="stage">', '<header class="app-title">帖子封面生成器</header>\n  <div class="stage">');
html = patch(html, '<script src="./app.js"></script>', `<dialog id="exportPreview" aria-labelledby="exportTitle">
  <div class="export-toolbar"><h2 id="exportTitle">封面预览</h2><button id="closePreview" type="button">返回编辑</button></div>
  <p>可下载 PNG，也可长按图片保存或截图。</p>
  <img id="exportImage" alt="帖子封面预览">
  <a id="downloadImage" download="帖子封面.png">下载 PNG 图片</a>
</dialog>
<script src="./config.js"></script>
<script src="./app.js"></script>
<script src="./bridge.js"></script>`);
let script = fs.readFileSync(path.join(root, 'vendor/app.js'), 'utf8');
script = patch(script, "var STORE_KEY = 'xhs-cover-v1';", "var STORE_KEY = 'loghome-post-cover-v1';");
script = patch(script, "try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}", "try { flushDraft(); } catch (e) { toast('草稿保存失败，请导出图片后再退出'); }");
const exportStart = script.indexOf('// 大图先落成临时文件');
const exportEnd = script.indexOf('   面板交互', exportStart);
const boundary = script.lastIndexOf('/* ===', exportEnd);
if (exportStart < 0 || exportEnd < 0 || boundary < exportStart) throw new Error('导出功能边界不匹配');
script = script.slice(0, exportStart) + fs.readFileSync(path.join(root, 'public/export.js'), 'utf8') + '\n\n' + script.slice(boundary);
fs.mkdirSync(path.join(root, 'dist'), {recursive:true});
fs.writeFileSync(path.join(root, 'dist/index.html'), html);
fs.writeFileSync(path.join(root, 'dist/app.js'), script);
for (const file of ['bridge.js','loghome.css']) fs.copyFileSync(path.join(root, 'public', file), path.join(root, 'dist', file));
console.log('帖子封面生成器构建完成');
