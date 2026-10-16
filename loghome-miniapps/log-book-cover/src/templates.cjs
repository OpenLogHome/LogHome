// Book layouts inspired by loghome-scf-subtasks/loghome-cover-maker/cover-maker.html.
// Artwork is local SVG; titles, authors, rules and frames remain editable layers.
const SERIF = 'Songti SC, STSong, SimSun, serif';
const SANS = 'PingFang SC, Microsoft YaHei, sans-serif';
const MONO = 'Menlo, Consolas, monospace';
const {BOOK_RATIO, DESIGN_HEIGHT, normalizeDocument} = require('./book-format.cjs');
const svg = body => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">${body}</svg>`);
const arts = {
  mountains: svg(`<circle cx="650" cy="200" r="97" fill="#b9533c"/>
    <path d="M0 640 220 240 440 640 650 355 900 720V900H0Z" fill="#bec5b3"/>
    <path d="M0 740 270 470 470 750 705 510 900 760V900H0Z" fill="#6e8475"/>
    <path d="M0 870 260 690 460 850 690 680 900 820V900H0Z" fill="#334e45"/>
    <path d="M70 775Q300 710 410 790T840 810" fill="none" stroke="#f2ead7" stroke-width="3"/>`),
  bauhaus: svg(`<path fill="#d2b77e" d="M20 20h860v860H20z"/>
    <circle cx="450" cy="450" r="330" fill="#c64d34"/>
    <path d="M450 120a330 330 0 0 1 0 660Z" fill="#183d65"/>
    <path d="M120 450h660v165H120z" fill="#1c282a"/>
    <path d="M120 615h165v165H120zM615 120h165v165H615z" fill="#f4edda"/>
    <circle cx="450" cy="450" r="120" fill="#e9bc4a"/>
    <path d="M40 40h820v820H40z" fill="none" stroke="#1c282a" stroke-width="3"/>`),
  cyanotype: svg(`<g fill="none" stroke="#e8f0df" stroke-linecap="round">
    <path d="M440 880Q380 480 470 65M440 660 210 430M430 540 670 310M442 375 285 180M440 760 705 565" stroke-width="6"/>
    ${[[218,430,-48],[290,510,-42],[350,590,-36],[653,320,46],[588,390,46],[520,455,46],[286,190,-32],[349,280,-32],[702,570,55],[605,645,55]].map(([x,y,a]) => `<ellipse cx="${x}" cy="${y}" rx="47" ry="118" transform="rotate(${a} ${x} ${y})" fill="#e8f0df" fill-opacity=".12" stroke-width="3"/>`).join('')}
    <circle cx="720" cy="140" r="53" stroke-width="2"/><path d="M60 60h80M60 60v80M840 840h-80M840 840v-80" stroke-width="2"/></g>`),
  botanical: svg(`<g stroke="#435c44" fill="none" stroke-width="4">
    <path d="M460 825Q390 540 475 135M444 640 260 445M437 510 650 325M452 385 320 235"/>
    <path d="M260 445Q110 300 245 220Q345 330 260 445Z" fill="#7c8e5d"/>
    <path d="M330 515Q180 420 190 345Q340 340 330 515Z" fill="#a9aa73"/>
    <path d="M650 325Q730 120 800 215Q810 330 650 325Z" fill="#788f78"/>
    <path d="M540 425Q590 250 660 295Q680 400 540 425Z" fill="#a9aa73"/>
    <path d="M320 235Q205 125 280 75Q385 120 320 235Z" fill="#788f78"/>
    <path d="M475 185Q430 25 520 40Q580 130 475 185Z" fill="#a9aa73"/>
    <path d="M70 850h760" stroke="#a2987c" stroke-width="2"/></g>
    <g fill="#ac6849"><circle cx="414" cy="670" r="12"/><circle cx="393" cy="691" r="9"/><circle cx="422" cy="702" r="8"/></g>`),
  colorfield: svg(`<defs><linearGradient id="a" x2="0" y2="1"><stop stop-color="#b4382b"/><stop offset="1" stop-color="#dc7150"/></linearGradient></defs>
    <path d="M40 30Q450 5 865 40L848 405Q420 430 45 395Z" fill="url(#a)"/>
    <path d="M45 445Q480 420 850 450L870 855Q450 880 30 850Z" fill="#283b4f"/>
    <path d="M50 420Q450 390 850 425" stroke="#dcb481" stroke-width="13" fill="none"/>
    <path d="M40 30h825v825H40z" fill="none" stroke="#e8c9a1" stroke-width="24" stroke-opacity=".18"/>`),
  woodcut: svg(`<circle cx="650" cy="230" r="130" fill="#d17242"/>
    <path d="M0 650 190 260 385 665 590 340 900 760V900H0Z" fill="#233c48"/>
    <g fill="none" stroke="#eadbc0" stroke-width="4">
    ${Array.from({length:14},(_,i)=>`<path d="M${30+i*12} ${630-i*22} 190 ${295+i*18} ${370-i*6} ${650+i*10}"/>`).join('')}
    ${Array.from({length:13},(_,i)=>`<path d="M0 ${760+i*13}Q180 ${660+i*13} 390 ${780+i*9}T900 ${760+i*13}"/>`).join('')}</g>`),
  doorway: svg(`<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#333d72"/><stop offset="1" stop-color="#cc8b7c"/></linearGradient></defs>
    <path d="M180 840V365a270 270 0 0 1 540 0v475Z" fill="#bcb0a2"/>
    <path d="M215 840V365a235 235 0 0 1 470 0v475Z" fill="url(#sky)"/>
    <circle cx="535" cy="350" r="91" fill="#f5d6a0"/>
    <path d="M215 655Q380 540 685 680V840H215" fill="#63697d"/>
    <path d="M215 735Q440 630 685 750V840H215" fill="#354d5b"/>
    <path d="M450 840 385 900H840L625 840Z" fill="#9f725d"/>
    <path d="M180 840h540" stroke="#ece2d1" stroke-width="8"/>`),
  orbit: svg(`<g fill="none" stroke="#beab7c" stroke-width="2">
    <ellipse cx="450" cy="450" rx="385" ry="185" transform="rotate(-35 450 450)"/>
    <ellipse cx="450" cy="450" rx="385" ry="185" transform="rotate(35 450 450)"/>
    <circle cx="450" cy="450" r="275"/><path d="M450 65v770M65 450h770" stroke-opacity=".4"/></g>
    <circle cx="450" cy="450" r="137" fill="#bb6a48"/>
    <path d="M450 313a137 137 0 0 1 0 274Z" fill="#e0b879"/>
    <circle cx="188" cy="312" r="25" fill="#d4ccaa"/><circle cx="732" cy="591" r="13" fill="#d4ccaa"/>`)
};
function createTemplates() {
  const templates = [];
  function add(id, name, category, accent, description, design) {
    const documents = {};
    for (const [ratio,h] of [[BOOK_RATIO,DESIGN_HEIGHT]]) {
      let serial = 0;
      const elements = [];
      const base = (type,name,x,y,w,height,extra={}) => {
        const item = {id:`${id}-${ratio.replace(':','-')}-${++serial}`,type,name,left:x,top:y,width:w,height,
          scaleX:1,scaleY:1,angle:0,opacity:1,fill:'#222720',stroke:'transparent',strokeWidth:0,radius:0,...extra};
        elements.push(item); return item;
      };
      const text = (name,value,x,y,w,size,extra={}) => base('text',name,x,y,w,size*value.split('\n').length*1.4,
        {text:value,fontSize:size,fontFamily:SERIF,fontWeight:400,textAlign:'left',lineHeight:1.18,backgroundColor:'transparent',padding:0,...extra});
      const rect = (name,x,y,w,height,color,extra={}) => base('shape',name,x,y,w,height,{shape:'rect',fill:color,...extra});
      const circle = (name,x,y,d,color,extra={}) => base('shape',name,x,y,d,d,{shape:'circle',fill:color,radius:d/2,...extra});
      const art = (name,key,x,y,w,height) => {
        const source = decodeURIComponent(arts[key].slice(arts[key].indexOf(',') + 1))
          .replace('width="900" height="900"', `width="${w}" height="${height}" preserveAspectRatio="none"`);
        return base('image',name,x,y,w,height,{builtinSrc:'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source),clipShape:'none',placeholderColor:'transparent'});
      };
      const title = (value,y,size=110,color='#222720',extra={}) => text('书名',value,120,y,840,size,{fill:color,textAlign:'center',fontWeight:600,...extra});
      const author = (y,color='#222720',extra={}) => text('作者','匿名作家 著',120,y,840,32,{fill:color,textAlign:'center',...extra});
      const label = (value,y,color='#777366',extra={}) => text('副标题',value,120,y,840,27,{fontFamily:SANS,fill:color,textAlign:'center',...extra});
      const background = design({h,ratio,text,rect,circle,art,title,author,label});
      documents[ratio] = normalizeDocument({schemaVersion:1,ratio,size:{width:1080,height:h},background:typeof background==='string'?{type:'color',color:background}:background,elements});
    }
    templates.push({id,name,category,accent,description,documents});
  }
  add('book-minimal','极简白','经典 · 文学','#222720','参考旧版极简白：细边框、留白与居中书名',({h,rect,title,author,label})=>{
    rect('细边框',65,65,950,h-130,'transparent',{stroke:'#292c27',strokeWidth:3});
    label('L I T E R A T U R E',190); title('未闻花名',h*.37,112); label('把平凡的日子，写成一首诗',h*.53);
    rect('短横线',490,h*.65,100,3,'#292c27'); author(h-240); return '#faf9f4';
  });
  add('book-crimson','经典红','经典 · 长篇','#7f252a','参考旧版经典红：酒红、双线框与金色衬线字',({h,rect,title,author,label})=>{
    rect('外金框',52,52,976,h-104,'transparent',{stroke:'#cfb481',strokeWidth:3});
    rect('内金框',68,68,944,h-136,'transparent',{stroke:'#cfb481',strokeWidth:1});
    label('长 篇 小 说',210,'#cfb481'); title('长夜\n与黎明',h*.29,126,'#ead9ac');
    rect('分隔线',390,h-400,300,2,'#cfb481'); author(h-285,'#ead9ac'); return '#7f252a';
  });
  add('book-midnight','午夜蓝','经典 · 科幻','#172a43','参考旧版午夜蓝：深蓝夜色与偏左排版',({h,circle,rect,text,author})=>{
    circle('远月',650,100,300,'#ced9de',{opacity:.15});
    text('卷标','LETTERS FROM THE STARS',100,210,850,27,{fontFamily:MONO,fill:'#8bacc0'});
    text('书名','星河\n来信',100,h*.27,850,152,{fontWeight:700,fill:'#f2f1e8',lineHeight:1.16});
    rect('蓝色短线',100,h-400,160,6,'#7cacc4'); author(h-300,'#bfcdd5',{textAlign:'left',left:100});
    return {type:'gradient',from:'#0f1c31',to:'#344e65',angle:180};
  });
  add('book-japanese','日系轻','经典 · 青春','#d9786f','参考旧版日系轻：暖白纸面、朱红圆与轻盈字距',({h,circle,title,author,text})=>{
    circle('朱红日轮',205,h*.27,670,'#d9786f'); title('夏日\n来信',h*.34,120,'#fff7e5');
    text('竖排副题','风\n从\n海\n边\n来',925,150,60,28,{fill:'#746858',textAlign:'center'});
    author(h-185,'#514c40'); return '#f6f0dc';
  });
  add('book-digital','科技感','经典 · 科幻','#a1dbb2','参考旧版科技感：网格、终端绿与等宽字体',({h,rect,text,title,author,label})=>{
    for(let x=80;x<=1000;x+=92) rect('纵向网格',x,80,1,h-160,'#214735');
    for(let y=80;y<h-80;y+=92) rect('横向网格',80,y,920,1,'#214735');
    text('系统编号','ARCHIVE / 2086.01',120,170,840,27,{fontFamily:MONO,fill:'#78ae8f'});
    rect('标题底板',90,h*.32,900,390,'#0a1d18'); title('未来边界',h*.36,116,'#adf0be',{fontFamily:SANS});
    label('当记忆成为可以改写的代码',h*.36+190,'#86bea1'); author(h-220,'#adf0be',{fontFamily:MONO}); return '#0a1713';
  });
  add('book-nature','自然绿','经典 · 自然','#48684d','参考旧版自然绿：植物轮廓与自然配色',({h,text,art,author})=>{
    text('书名','林间\n慢行',115,180,800,130,{fill:'#284936',fontWeight:600});
    art('植物图版','botanical',280,h*.39,730,h*.43); author(h-175,'#284936',{textAlign:'left'}); return '#e5eadb';
  });
  add('book-sunset','夕阳变','经典 · 散文','#ca7659','参考旧版夕阳变：暖色渐变与纸白书签',({h,rect,title,author,label})=>{
    rect('纸白书签',105,100,870,h-200,'#faf2e1'); label('ESSAYS / 随笔集',225,'#9a604d');
    title('落日\n之前',h*.30,124,'#9e4d3b'); label('那些还没来得及说的话',h*.61,'#9a604d'); author(h-265,'#9e4d3b');
    return {type:'gradient',from:'#edc7a0',to:'#ba5947',angle:180};
  });
  add('book-mystery','悬疑黑','经典 · 悬疑','#b64235','参考旧版悬疑黑：炭黑、红线与悬念',({h,rect,text,author,label})=>{
    label('A SUSPENSE NOVEL',180,'#b5afa5'); text('书名','第七个\n雨夜',110,h*.28,860,142,{fill:'#e9e3d7',fontWeight:700});
    rect('红色裂隙',90,h*.62,910,7,'#b64235',{angle:-8}); author(h-250,'#b5afa5'); return '#201f20';
  });
  add('book-academic','学术风','经典 · 非虚构','#374151','参考旧版学术风：信息层级、横线与严谨排版',({h,rect,text,author})=>{
    rect('顶线',100,145,880,8,'#374151'); text('丛书名','思想与生活 · 研究丛书',100,205,880,30,{fill:'#586170'});
    text('书名','理解\n时间',100,340,880,146,{fill:'#303c4a',fontWeight:600});
    text('副标题','关于秩序、记忆与日常的思考',100,740,880,34,{fill:'#68717a'});
    author(h-310,'#374151',{left:100,textAlign:'left'}); rect('底线',100,h-160,880,3,'#374151'); return '#f1eee7';
  });
  add('art-mountains','山月留白','艺术 · 东方','#3c5b4d','山形、远月与东方留白',({h,art,text,author,label})=>{
    text('书名','山\n月\n记',785,130,160,108,{fill:'#31483f',textAlign:'center',lineHeight:1.3});
    label('MOUNTAINS & MOON',200,'#8b8772',{left:110,width:600,textAlign:'left',fontSize:24});
    art('山月图景','mountains',60,h*.34,900,h*.49); author(h-155,'#31483f',{left:110,textAlign:'left'}); return '#ede8d8';
  });
  add('art-bauhaus','几何构成','艺术 · 包豪斯','#c64d34','红蓝黄几何构成与现代主义字版',({h,art,text,author})=>{
    text('系列号','FORM / 01',90,100,900,26,{fontFamily:MONO});
    text('书名','秩序之外',90,190,900,118,{fontFamily:SANS,fontWeight:800});
    art('几何构成','bauhaus',90,h*.31,900,h*.49); author(h-150,'#222720',{fontFamily:SANS,textAlign:'left',left:90}); return '#eae1cc';
  });
  add('art-cyanotype','蓝晒诗集','艺术 · 蓝晒','#153e73','普鲁士蓝与植物的光影印记',({h,art,title,author,label})=>{
    label('CYANOTYPE / POEMS',100,'#b8d1d4'); title('光的标本',205,106,'#f0f0dc');
    art('蓝晒植物','cyanotype',90,h*.28,900,h*.53); author(h-155,'#d8e4db'); return '#163f76';
  });
  add('art-botanical','植物手记','艺术 · 博物','#697a50','奶油纸色、植物标本与博物图鉴',({h,art,text,author,rect})=>{
    text('书名','草木\n有信',100,135,680,114,{fill:'#3b513c',lineHeight:1.12});
    text('图版编号','HERBARIUM\nPLATE NO. 028',710,160,260,24,{fontFamily:MONO,fill:'#8b826c',textAlign:'right',lineHeight:1.5});
    art('植物标本','botanical',130,h*.29,820,h*.53); rect('分隔线',100,h-220,880,2,'#a89f83'); author(h-160,'#536247',{textAlign:'left',left:100}); return '#f1ebd8';
  });
  add('art-colorfield','色域回声','艺术 · 抽象','#b9513d','不规则色块与画廊式留白',({h,art,title,author,label})=>{
    label('A STUDY IN SILENCE',100,'#7b5e4b'); art('抽象色域','colorfield',115,220,850,h*.53);
    title('寂静的回声',h*.76,88,'#493d35',{fontWeight:400}); author(h-140,'#7b5e4b'); return '#e5c8a2';
  });
  add('art-woodcut','版画山海','艺术 · 版画','#233c48','木刻排线、赭红太阳与山海层次',({h,art,text,author,label})=>{
    text('书名','山海\n之间',100,110,880,126,{fill:'#233c48',fontWeight:700,lineHeight:1.12});
    art('山海版画','woodcut',70,h*.32,940,h*.51); author(h-140,'#233c48',{textAlign:'left',left:100});
    label('LAND / SEA',h-140,'#a05f3e',{left:730,width:250,textAlign:'right',fontFamily:MONO,fontSize:23}); return '#eadbc0';
  });
  add('art-doorway','梦境之门','艺术 · 超现实','#67506c','拱门、远山与不合时序的月亮',({h,art,title,author,label})=>{
    label('SOMEWHERE, BEYOND THE EVERYDAY',100,'#8c7167',{fontSize:22});
    title('梦的入口',200,105,'#51485d'); art('梦境拱门','doorway',90,h*.27,900,h*.57); author(h-145,'#76645d'); return '#e7dccc';
  });
  add('art-orbit','星轨档案','艺术 · 天文','#beab7c','复古天文线图与黄铜色几何',({h,art,title,author,label})=>{
    label('THE CELESTIAL ARCHIVE',100,'#beab7c',{fontFamily:MONO}); title('环绕时间',210,100,'#e9dfbd');
    art('星轨图','orbit',90,h*.29,900,h*.51); author(h-150,'#c5b58a'); return '#1e3339';
  });
  return templates;
}
module.exports = {createTemplates, SERIF, SANS};
