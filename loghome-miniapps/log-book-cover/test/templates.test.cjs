const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {createTemplates} = require('../src/templates.cjs');
const {BOOK_RATIO,BOOK_SIZE,normalizeDocument,fromDesignElement,fitDocument,createDocument,validSize,sizeError,adaptElement} = require('../src/book-format.cjs');
test('all 17 book templates double the original resolution without changing aspect ratio', () => {
  assert.deepEqual(BOOK_SIZE,{width:998,height:1292});
  assert.equal(BOOK_SIZE.width/BOOK_SIZE.height,499/646);
  const templates = createTemplates();
  assert.equal(templates.length, 17);
  assert.equal(templates.filter(t => t.id.startsWith('art-')).length, 8);
  assert.equal(new Set(templates.map(t => t.id)).size, templates.length);
  for (const template of templates) {
    assert.deepEqual(Object.keys(template.documents),[BOOK_RATIO]);
    for (const [ratio,doc] of Object.entries(template.documents)) {
    assert.equal(doc.schemaVersion, 1);
    assert.equal(doc.ratio, ratio);
    assert.deepEqual(doc.size, BOOK_SIZE);
    assert.equal(new Set(doc.elements.map(e => e.id)).size, doc.elements.length);
    for (const name of ['书名','作者']) assert.ok(doc.elements.some(e => e.type==='text' && e.name===name && e.text));
    for (const e of doc.elements) {
      assert.ok(e.left>=0 && e.top>=0 && e.width>0 && e.height>0);
      assert.ok(e.left+e.width*(e.scaleX??1)<=doc.size.width+.1 && e.top+e.height*(e.scaleY??1)<=doc.size.height+.1, `${template.name}/${ratio}/${e.name} outside canvas`);
      if(e.type==='image') {
        assert.match(e.builtinSrc, /^data:image\/svg\+xml;charset=utf-8,/);
        const svg = decodeURIComponent(e.builtinSrc.split(',')[1]);
        assert.ok(svg.includes(`width="${e.width}" height="${e.height}"`));
        assert.doesNotMatch(svg, /<script|<foreignObject|\shref=|url\(https?:/);
      }
    }
  }
  }
});
test('built application uses the book catalog and book default while retaining saved project storage', () => {
  const source = fs.readFileSync(path.join(__dirname, '../dist/assets/index-DJH4ljDL.js'),'utf8');
  const start = source.indexOf('Pg=[{"id":"book-minimal"');
  const end = source.indexOf(';function Fg(e)',start);
  assert.ok(start>0 && end>start);
  assert.deepEqual(JSON.parse(source.slice(start+3,end)),createTemplates());
  assert.match(source,/a=F\(`book-minimal`\)/);
  assert.match(source,/a\.value=`book-minimal`,r\.value=!0/);
  assert.match(source,/Qg\(`xhs-cover-helper`,1/);
  assert.doesNotMatch(source,/name:`好物推荐`|name:`探店美食`/);
  assert.match(source,/i=F\("499:646"\)/);
  assert.match(source,/bookCanvasWidth=F\(998\),bookCanvasHeight=F\(1292\)/);
  assert.match(source,/bookCanvasError\.value/);
  assert.doesNotMatch(source,/G\(`div`,F_,\[|沉浸式长图封面|导出宽度 1080px/);
  const context=vm.createContext({crypto:{randomUUID:()=> 'test'}});
  const prefix=source.slice(0,source.indexOf('function e(e)'));
  const first=source.indexOf('dg={'),last=source.indexOf('function yg(',first);
  vm.runInContext(prefix+'var '+source.slice(first,last),context);
  const blank=JSON.parse(vm.runInContext('JSON.stringify(vg("499:646"))',context));
  assert.deepEqual(blank.size,BOOK_SIZE);
  for(const factory of ['hg("新文字")','gg("rect")','gg("circle")','_g("photo")']) {
    const element=JSON.parse(vm.runInContext('JSON.stringify('+factory+')',context));
    assert.ok(element.left+element.width*element.scaleX<=998);
    assert.ok(element.top+element.height*element.scaleY<=1292);
  }
});
test('PNG export repaints after clearing selection before encoding the canvas', async () => {
  const source=fs.readFileSync(path.join(__dirname,'../dist/assets/EditorView-BBdfO0G6.js'),'utf8');
  const start=source.indexOf('async exportPngAndRelease(){'), end=source.indexOf('toThumbnail(){',start);
  const order=[];
  const methods=vm.runInNewContext('({' + source.slice(start,end) + '})', {
    hc:1,mc:6000,ac:async promise=>promise,bc:async ()=>{order.push('encode');return {type:'image/png'};}
  });
  await methods.exportPngAndRelease.call({canvas:{discardActiveObject(){order.push('discard');},renderAll(){order.push('render');},
    lowerCanvasEl:{width:998,height:1292},upperCanvasEl:{width:998,height:1292}},
    document:{size:BOOK_SIZE},dispose:async()=>{order.push('dispose');}});
  assert.deepEqual(order,['discard','render','encode','dispose']);
});
test('legacy projects upgrade to 2× resolution once without losing layers or stretching images', () => {
  for(const [ratio,width,height] of [['3:4',1080,1440],['9:16',1080,1920],['499:646',499,646]]) {
    const input={schemaVersion:1,ratio,size:{width,height},background:{type:'color',color:'#ffffff'},elements:[
      {id:'title',type:'text',name:'书名',left:100,top:200,width:800,height:160,fontSize:100,scaleX:1,scaleY:1,strokeWidth:4,text:'原有书名'},
      {id:'photo',type:'image',name:'原有照片',assetId:'kept-asset',left:200,top:500,width:600,height:600,scaleX:1,scaleY:1}
    ]};
    const before=structuredClone(input), converted=normalizeDocument(input), scale=Math.min(998/width,1292/height);
    assert.deepEqual(input,before);
    assert.deepEqual(converted.size,BOOK_SIZE); assert.equal(converted.ratio,BOOK_RATIO);
    assert.equal(converted.elements[0].text,'原有书名');
    assert.equal(converted.elements[0].fontSize,100*scale);
    assert.equal(converted.elements[1].assetId,'kept-asset');
    assert.equal(converted.elements[1].width,600);
    assert.equal(converted.elements[1].scaleX,scale);assert.equal(converted.elements[1].scaleY,scale);
    assert.deepEqual(normalizeDocument(converted),converted);
  }
  assert.equal(normalizeDocument({schemaVersion:1,size:{width:0,height:100},elements:[]}),null);
  const newText=fromDesignElement({type:'text',left:180,top:260,width:720,height:180,fontSize:92});
  assert.ok(newText.fontSize<86 && newText.fontSize>85);
});
test('custom dimensions survive save/reload, template replacement and new element insertion', () => {
  const template=createTemplates()[0].documents[BOOK_RATIO];
  for(const size of [{width:800,height:1200},{width:1200,height:800},{width:1500,height:1500},{width:128,height:4096}]) {
    const custom=createDocument(template,size), blank=createDocument(undefined,size);
    assert.deepEqual(custom.size,size); assert.deepEqual(blank.size,size);
    assert.equal(custom.canvasVersion,2);
    assert.deepEqual(normalizeDocument(JSON.parse(JSON.stringify(custom))),custom);
    assert.deepEqual(fitDocument(createTemplates()[10].documents[BOOK_RATIO],custom.size).size,size);
    const element=adaptElement(fromDesignElement({type:'shape',left:180,top:260,width:620,height:240,scaleX:1,scaleY:1}),size);
    assert.ok(element.left>=0 && element.top>=0);
    assert.ok(element.left+element.width<=size.width+.01 && element.top+element.height<=size.height+.01);
  }
  assert.deepEqual(fitDocument(template,BOOK_SIZE),template);
  assert.equal(createDocument(undefined,{width:1200,height:800}).ratio,'3:2');
});
test('custom dimensions reject fractions, blanks, non-numeric values and oversized canvases', () => {
  for(const width of [0,127,4097,800.5,NaN,Infinity]) {
    assert.equal(validSize({width,height:1000}),false);
    assert.throws(()=>createDocument(undefined,{width,height:1000}));
  }
  for(const width of ['', 'abc','800.5','4097']) assert.ok(sizeError(width,1000));
  assert.equal(sizeError('998','1292'),'');
  assert.equal(normalizeDocument({canvasVersion:2,schemaVersion:1,size:{width:9999,height:1000},elements:[]}),null);
});
