const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const {createTemplates} = require('../src/templates.cjs');
const {BOOK_RATIO, BOOK_SIZE} = require('../src/book-format.cjs');
function patch(source, before, after) {
  if (source.split(before).length !== 2) throw new Error('导出文件补丁边界不匹配：' + before.slice(0, 80));
  return source.replace(before, after);
}
const runtime = 'const loghomeBookFormat=(()=>{const module={exports:{}};\n' + fs.readFileSync(path.join(root,'src/book-format.cjs'),'utf8') + '\nreturn module.exports;})();\n' +
  'const loghomeCanvasControls=(()=>{const module={exports:{}};\n' + fs.readFileSync(path.join(root,'src/canvas-controls.cjs'),'utf8') + '\nreturn module.exports;})();\n';
let index = fs.readFileSync(path.join(root, 'vendor/assets/index-DJH4ljDL.js'), 'utf8');
index = patch(index, 'G(`h1`,null,`封面编辑台`,-1)', 'G(`h1`,null,`书籍封面生成器`, -1)');
index = patch(index, '`COVER DESK / 0.1`', '`BOOK COVER / 高级版`');
index = patch(index, '下一张爆款封面，', '下一本好书，');
index = patch(index, 'G(`h2`,null,`选择画布`)', 'G(`h2`,null,`选择模板`)');
const catalogStart = 'Pg=[{id:`editorial`';
const catalogEnd = '];function Fg(e)';
const start = index.indexOf(catalogStart), end = index.indexOf(catalogEnd, start);
if (start < 0 || end < 0 || index.indexOf(catalogStart, start + 1) !== -1) throw new Error('模板目录边界不匹配');
index = index.slice(0, start) + 'Pg=' + JSON.stringify(createTemplates()) + index.slice(end + 1);
index = patch(index, 'a=F(`editorial`)', 'a=F(`book-minimal`)');
index = patch(index, 'a.value=`editorial`,r.value=!0', 'a.value=`book-minimal`,r.value=!0');
index = patch(index, 'dg={"3:4":{width:1080,height:1440},"9:16":{width:1080,height:1920}}',
  'dg=' + JSON.stringify({[BOOK_RATIO]:BOOK_SIZE}));
index = patch(index, 'i=F(`3:4`)', `i=F(${JSON.stringify(BOOK_RATIO)})`);
index = patch(index, 's=J(()=>i.value===`3:4`?`小红书标准封面`:`沉浸式长图封面`)', 's=J(()=>`封面画布`)');
index = patch(index, '` · 导出宽度 1080px`', '` · ${bookCanvasSize.value.width} × ${bookCanvasSize.value.height} px`');
const ratioStart = index.indexOf('G(`div`,F_,['), ratioEnd = index.indexOf('G(`p`,I_,',ratioStart);
if (ratioStart<0 || ratioEnd<0) throw new Error('画布比例选择边界不匹配');
index = index.slice(0,ratioStart) + index.slice(ratioEnd);
index = patch(index, '![`3:4`,`9:16`].includes(t.document.ratio)', '!loghomeBookFormat.validSize(t.document.size)');
index = patch(index, 'builtinId:ug}),n}var Cg=', 'builtinId:ug}),n.document.canvasVersion===2||delete n.thumbnail,n.document=loghomeBookFormat.normalizeDocument(n.document),n.document?n:null}var Cg=');
index = patch(index, 'function vg(e){return{schemaVersion:1,ratio:e,size:{...dg[e]},background:{type:`color`,color:`#f7f7f2`},elements:[]}}',
  'function vg(){return loghomeBookFormat.createDocument()}');
// Apply the same units to newly added text, shapes and photos.
for (const [begin,end] of [['function hg(', 'function gg('],['function gg(', 'function _g('],['function _g(', 'function vg(']]) {
  const first=index.indexOf(begin), last=index.indexOf(end,first);
  if (first<0 || last<0) throw new Error('新增元素边界不匹配：' + begin);
  const factory=index.slice(first,last);
  if (!factory.includes('return{') || !factory.endsWith('}}')) throw new Error('新增元素结构不匹配');
  index=index.slice(0,first)+factory.replace('return{','return loghomeBookFormat.fromDesignElement({').slice(0,-2)+'})}'+index.slice(last);
}
index = patch(index, '__name:`HomeView`,setup(e){let t=Sh()',
  '__name:`HomeView`,setup(e){const bookSettings=loghomeCanvasControls(K,loghomeBookFormat),bookCanvasWidth=F(998),bookCanvasHeight=F(1292),bookCanvasError=J(()=>loghomeBookFormat.sizeError(bookCanvasWidth.value,bookCanvasHeight.value)),bookCanvasSize=J(()=>bookCanvasError.value?loghomeBookFormat.BOOK_SIZE:{width:Number(bookCanvasWidth.value),height:Number(bookCanvasHeight.value)}),bookTemplateGroup=F(`all`),bookTemplates=J(()=>Pg.filter(template=>bookTemplateGroup.value===`all`||template.category.startsWith(bookTemplateGroup.value)));let t=Sh()');
index = patch(index, 'G(`p`,I_,k(s.value)',
  'K(bookSettings,{width:bookCanvasWidth.value,height:bookCanvasHeight.value,error:bookCanvasError.value,onChange:values=>{bookCanvasWidth.value=values.width;bookCanvasHeight.value=values.height},onReset:()=>{bookCanvasWidth.value=998;bookCanvasHeight.value=1292}}),G(`p`,I_,k(s.value)');
index = patch(index, 'async function l(){if(!o.value){', 'async function l(){if(!o.value&&!bookCanvasError.value){');
index = patch(index, 'e?bg(e.documents[i.value]):vg(i.value)', 'loghomeBookFormat.createDocument(e?.documents["499:646"],bookCanvasSize.value)');
index = patch(index, 'class:`primary-button`,disabled:o.value,onClick:l', 'class:`primary-button`,disabled:o.value||!!bookCanvasError.value,onClick:l');
index = patch(index, 'document:e.documents[i.value]', 'document:loghomeBookFormat.fitDocument(e.documents["499:646"],bookCanvasSize.value)');
index = patch(index, 'G(`div`,B_,[', 'G(`div`,{...B_,style:{aspectRatio:bookCanvasSize.value.width+`/`+bookCanvasSize.value.height}},[');
index = patch(index, 'G(`div`,R_,[', 'G(`div`,{...R_,style:{aspectRatio:bookCanvasSize.value.width+`/`+bookCanvasSize.value.height}},[');
index = patch(index, 'class:ge([`history-thumb`,e.document.ratio===`9:16`?`is-long`:``])',
  'class:`history-thumb`,style:{height:`auto`,aspectRatio:e.document.size.width+`/`+e.document.size.height}');
index = patch(index, 'Kr(I(Pg),e=>', 'Kr(I(bookTemplates),e=>');
index = patch(index, 'G(`div`,L_,[',
  'G(`div`,{class:`book-template-filters`,role:`group`,"aria-label":`模板分类`},[[`all`,`全部 · 17`],[`经典`,`经典 · 9`],[`艺术`,`艺术 · 8`]].map(([value,label])=>G(`button`,{type:`button`,class:{active:bookTemplateGroup.value===value},"aria-pressed":bookTemplateGroup.value===value,onClick:()=>bookTemplateGroup.value=value},label))),G(`div`,L_,[');
// Keep the card preview faithful to the editable canvas, including local artwork.
index = patch(index, 'i.fontWeight=e.fontWeight,i.lineHeight=e.lineHeight',
  'i.fontFamily=e.fontFamily||`PingFang SC, Microsoft YaHei, sans-serif`,i.fontWeight=e.fontWeight,i.lineHeight=e.lineHeight');
index = patch(index, 'i.background=e.placeholderColor,i.border=`1px dashed rgba(23,23,23,.35)`',
  'i.background=e.placeholderColor,i.border=e.builtinSrc?`none`:`1px dashed rgba(23,23,23,.35)`,e.builtinSrc&&(i.backgroundImage=`url("${e.builtinSrc}")`,i.backgroundSize=`100% 100%`,i.backgroundRepeat=`no-repeat`)');
index = patch(index, 'e.type===`image`?(U(),W(`span`,sg))', 'e.type===`image`&&!e.builtinSrc?(U(),W(`span`,sg))');
index = patch(index, 'borderRadius:e.type===`image`&&e.clipShape===`circle`?`50%`:`${Math.min(18,e.radius/8)}px`',
  'borderRadius:e.type===`shape`&&e.shape===`circle`||e.type===`image`&&e.clipShape===`circle`?`50%`:`${e.radius/n*100}cqi`,border:e.type===`shape`&&e.strokeWidth?`${e.strokeWidth/n*100}cqi solid ${e.stroke}`:undefined,boxSizing:`border-box`');
index = patch(index, 'width:`${e.width/n*100}%`,height:`${e.height/r*100}%`',
  'width:`${e.width*(e.scaleX??1)/n*100}%`,height:`${e.height*(e.scaleY??1)/r*100}%`');
index = runtime + index;
let editor = fs.readFileSync(path.join(root, 'vendor/assets/EditorView-BBdfO0G6.js'), 'utf8');
const unit = value => String(value*BOOK_SIZE.width/1080);
editor = patch(editor, 't.left=e===`circle`?400:230,t.top=420', `t.left=e===\`circle\`?${unit(400)}:${unit(230)},t.top=${unit(420)}`);
editor = patch(editor, 'left:410,top:390,width:260,height:260', `left:${unit(410)},top:${unit(390)},width:${unit(260)},height:${unit(260)}`);
editor = patch(editor, 't.left=tt===`avatar`?360:160,t.top=tt===`avatar`?430:500',
  `t.left=tt===\`avatar\`?${unit(360)}:${unit(160)},t.top=tt===\`avatar\`?${unit(430)}:${unit(500)}`);
editor = patch(editor, 'n.left+=36,n.top+=36', `n.left+=${unit(36)},n.top+=${unit(36)}`);
editor = patch(editor, 'type:`range`,min:`24`,max:`220`,value:H.value.fontSize', 'type:`range`,min:`10`,max:Math.max(220,Math.ceil(Math.max(k.value.document.size.width,k.value.document.size.height)/3)),value:H.value.fontSize');
editor = patch(editor, 'async function G(e){if(!k.value)return;let t=',
  'async function G(e){if(!k.value)return;e=loghomeBookFormat.adaptElement(e,k.value.document.size);let t=');
editor = patch(editor, 'n.elements.push(t),await U(n,t.id)', 'n.elements.push(loghomeBookFormat.adaptElement(t,k.value.document.size)),await U(n,t.id)');
editor = patch(editor, 'pe(t.documents[k.value.document.ratio])', 'loghomeBookFormat.fitDocument(t.documents["499:646"],k.value.document.size)');
editor = patch(editor, 'document:e.documents[st.value.ratio]', 'document:loghomeBookFormat.fitDocument(e.documents["499:646"],st.value.size)');
editor = patch(editor, 'C(`div`,null,[d(le,{document:', 'C(`div`,{style:{aspectRatio:st.value.size.width+`/`+st.value.size.height}},[d(le,{document:');
editor = patch(editor, 'resizeTo(e,t){let n=', 'resizeTo(e,t,force=!1){let n=');
editor = patch(editor, '(!this.lastAvailableWidth||n)&&', '(!this.lastAvailableWidth||n||force)&&');
editor = patch(editor, 'k.value.document=i,Ve.value=t,gt()', 'k.value.document=i,Ve.value=t,loghomeRefit(r,i),gt()');
// Undo/redo used to drop the selection while leaving the bottom properties panel open (empty ELEMENT shell).
// Keep the selection when the element still exists after the restore, otherwise close the panel.
editor = patch(editor, 'async function W(){if(!k.value)return;let e=Ze.undo(k.value.document);e&&await U(e,null,!1)}',
  'async function W(){if(!k.value)return;let e=Ze.undo(k.value.document);if(!e)return;let t=Ve.value&&e.elements.some(n=>n.id===Ve.value)?Ve.value:null;await U(e,t,!1);t||(A.value=null),clearTimeout(loghomeLiveTimer),loghomeLiveBase=null}');
editor = patch(editor, 'async function vt(){if(!k.value)return;let e=Ze.redo(k.value.document);e&&await U(e,null,!1)}',
  'async function vt(){if(!k.value)return;let e=Ze.redo(k.value.document);if(!e)return;let t=Ve.value&&e.elements.some(n=>n.id===Ve.value)?Ve.value:null;await U(e,t,!1);t||(A.value=null),clearTimeout(loghomeLiveTimer),loghomeLiveBase=null}');
// Property edits apply live on `input` events; a continuous gesture (typing, slider drag, color picking)
// is coalesced into a single history entry pushed 400ms after the gesture ends.
editor = patch(editor, 'async function K(e){if(!k.value||!H.value)return;let t=pe(k.value.document),n=t.elements.find(e=>e.id===H.value?.id);n&&(Object.assign(n,e),await U(t,n.id))}',
`let loghomeLiveBase=null,loghomeLiveTimer=null,loghomeLiveFocus=null;
function loghomeRecordFocus(){let ael=document.activeElement;if(!ael||!ael.closest||!ael.closest(\`.tool-panel\`))return loghomeLiveFocus=null;let start=null,end=null;try{start=ael.selectionStart,end=ael.selectionEnd}catch{}const controls=Array.from(document.querySelectorAll(\`.tool-panel textarea,.tool-panel input,.tool-panel select\`));loghomeLiveFocus={index:controls.indexOf(ael),start,end}}
function loghomeRestoreFocus(){let f=loghomeLiveFocus;if(!f||f.index<0)return;let ael=document.activeElement;if(ael&&ael!==document.body&&ael.closest&&ael.closest(\`.tool-panel\`))return;const controls=document.querySelectorAll(\`.tool-panel textarea,.tool-panel input,.tool-panel select\`);const target=controls[f.index];if(!target)return;target.focus({preventScroll:!0});try{f.start!=null&&target.setSelectionRange&&target.setSelectionRange(f.start,f.end)}catch{}}
// The panel subtree gets re-created after each commit (including the debounced save that follows),
// so keep re-anchoring focus/caret for a short window instead of a single restore.
function loghomeKeepFocus(){loghomeRestoreFocus();let n=0;const iv=setInterval(()=>{loghomeRestoreFocus();if(++n>=12)clearInterval(iv)},50)}
async function K(e){if(!k.value||!H.value)return;let t=pe(k.value.document),n=t.elements.find(e=>e.id===H.value?.id);if(!n)return;loghomeLiveBase||(loghomeLiveBase=x(k.value.document)),loghomeRecordFocus(),Object.assign(n,e),await U(t,n.id,!1),loghomeKeepFocus(),clearTimeout(loghomeLiveTimer),loghomeLiveTimer=setTimeout(()=>{loghomeLiveBase&&(Ze.push(loghomeLiveBase),P.value++,loghomeLiveBase=null)},400)}`);
editor = patch(editor, 'n&&Ze.push(r),P.value++,k.value.document=i',
  'n&&(clearTimeout(loghomeLiveTimer),loghomeLiveBase=null,Ze.push(r)),P.value++,k.value.document=i');
for (const handler of [20, 21, 22, 23, 24, 26, 27, 31, 32, 33, 34, 35]) {
  editor = patch(editor, `onChange:a[${handler}]||=e=>K(`, `onInput:a[${handler}]||=e=>K(`);
}
editor = patch(editor, '__name:`EditorView`,props:{id:{}},setup(n){let f=n',
  '__name:`EditorView`,props:{id:{}},setup(n){const bookSettings=loghomeCanvasControls(d,loghomeBookFormat),bookEditWidth=s(998),bookEditHeight=s(1292),bookSizeError=p(()=>loghomeBookFormat.sizeError(bookEditWidth.value,bookEditHeight.value));let f=n');
editor = patch(editor, 'C(`nav`,Hc,[',
  'C(`nav`,Hc,[C(`button`,{class:b({active:A.value===`size`}),onClick:()=>{bookEditWidth.value=k.value.document.size.width;bookEditHeight.value=k.value.document.size.height;A.value=`size`}},[C(`span`,{class:`book-size-icon`,"aria-hidden":`true`},`↔`),C(`span`,null,`尺寸`)]),');
editor = patch(editor, 'l(A.value===`templates`?`更换模板`:', 'l(A.value===`size`?`画布尺寸`:A.value===`templates`?`更换模板`:');
editor = patch(editor, 'A.value===`templates`&&st.value?(u()',
  'A.value===`size`?(u(),S(`div`,{class:`book-size-panel panel-scroll`},[d(bookSettings,{width:bookEditWidth.value,height:bookEditHeight.value,error:bookSizeError.value,onChange:values=>{bookEditWidth.value=values.width;bookEditHeight.value=values.height},onReset:()=>{bookEditWidth.value=998;bookEditHeight.value=1292}}),C(`p`,null,`内容将等比缩放并居中，尺寸更改可撤销。`),C(`button`,{class:`primary-button`,disabled:!!bookSizeError.value,onClick:loghomeResizeCanvas},`应用尺寸`)])):A.value===`templates`&&st.value?(u()');
editor = patch(editor, 'async function _t(){',
  'function loghomeRefit(before,after){if(F&&D.value&&(before.size.width!==after.size.width||before.size.height!==after.size.height)){F.resizeTo(Math.max(240,D.value.clientWidth-28),Math.max(300,D.value.clientHeight-28),!0);q()}}async function loghomeResizeCanvas(){if(!k.value||bookSizeError.value)return;try{await U(loghomeBookFormat.fitDocument(k.value.document,{width:Number(bookEditWidth.value),height:Number(bookEditHeight.value)}),null);A.value=null;await _t()}catch{ve(`画布尺寸修改失败，请重试`)}}async function _t(){');
editor = patch(editor, 'fontFamily:`PingFang SC, Microsoft YaHei, sans-serif`,fontSize:e.fontSize',
  'fontFamily:e.fontFamily||`PingFang SC, Microsoft YaHei, sans-serif`,fontSize:e.fontSize');
// Discarding a selection schedules a repaint; PNG encoding needs that repaint now.
editor = patch(editor, 'exportPngAndRelease(){this.canvas.discardActiveObject();',
  'exportPngAndRelease(){this.canvas.discardActiveObject();this.canvas.renderAll();');
// Keep saves inside the editor's own store and await the actual IndexedDB write.
editor = patch(editor, 'async function _t(){',
  'const loghomeHooks={save:_t,back:yt};window.__loghomeCover=loghomeHooks;a(()=>{if(window.__loghomeCover===loghomeHooks)delete window.__loghomeCover});async function _t(){');
const staging = path.join(root, 'dist.next');
fs.rmSync(staging, {recursive:true, force:true});
fs.cpSync(path.join(root, 'vendor'), staging, {recursive:true});
fs.cpSync(path.join(root, 'public'), staging, {recursive:true});
fs.writeFileSync(path.join(staging, 'assets/index-DJH4ljDL.js'), index);
fs.writeFileSync(path.join(staging, 'assets/EditorView-BBdfO0G6.js'), runtime + editor);
let html = fs.readFileSync(path.join(staging, 'index.html'), 'utf8');
html = patch(html, '<title>封面编辑台</title>', '<title>书籍封面生成器（高级版）</title>');
html = patch(html, '<script type="module" crossorigin src="./assets/index-DJH4ljDL.js"></script>',
  '<script src="./config.js"></script>\n    <script type="module" src="./bridge.js"></script>\n    <link rel="stylesheet" href="./loghome.css">');
fs.writeFileSync(path.join(staging, 'index.html'), html);
fs.rmSync(path.join(root, 'dist'), {recursive:true, force:true});
fs.renameSync(staging, path.join(root, 'dist'));
console.log('书籍封面生成器（高级版）构建完成');
