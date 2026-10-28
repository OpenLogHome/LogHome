(function(){
'use strict';

/* ==========================================================
   CONFIG —— 全部数值来自参考图 1080×1440 的实测
   ========================================================== */
var W = 1080, H = 1440;
var PAD_X        = 108;      // 左右边距，10%
var BASE_FS      = 120;      // 基准字号
var LINE_RATIO   = 1.3083;   // 行距 157 / 120
var BASELINE_OFF = 1.025;    // 基线距行框顶 = 1.025em
var BLOCK_CY     = 0.475;    // 文字块垂直中心
var MIN_FS       = 40;
var HL_TOP = 0.98, HL_BOT = 0.175;   // 团块笔触相对基线的上下延伸
var MK_TOP = 0.90, MK_BOT = 0.15;    // 马克笔笔触相对基线的上下延伸
// 每种字体的描边系数：黑体靠描边补 Heavy 字重，行楷手写笔画细，描粗了会糊成一团
var STICKER_FS = 1000;   // 贴纸基准字号，1.0 档≈参考图里那只大问号
var SANS_STACK = '"PingFang SC","PingFang HK","Hiragino Sans GB","Source Han Sans SC",' +
                 '"Noto Sans CJK SC","Noto Sans SC","Heiti SC","Microsoft YaHei",sans-serif';
// 彩色 emoji 专用栈：Windows/macOS/Linux 各自的彩色 emoji 字体都兜住
var EMOJI_STACK = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji","Segoe UI Symbol",sans-serif';
// probe = 用来判断本机到底装没装的具体字体名（不含 sans-serif 这种兜底名，
// 否则安卓上每一项都会「可用」，实际全部回退成同一个思源黑体）
var FONTS = [
  { k:'sans',  n:'黑体', w:900, stroke:0.025, probe:[],
    stack: SANS_STACK },
  { k:'round', n:'圆体', w:700, stroke:0.016,
    probe:['Yuanti SC','YuantiSC-Regular','Yuanti TC','Hiragino Maru Gothic ProN'],
    stack:'"Yuanti SC","Yuanti TC","Hiragino Maru Gothic ProN","Yuanti",sans-serif' },
  { k:'song',  n:'宋体', w:700, stroke:0.020,
    probe:['Songti SC','SongtiSC-Regular','STSong','Songti TC',
           'Noto Serif CJK SC','Source Han Serif SC','SimSun'],
    stack:'"Songti SC","Songti TC","Noto Serif CJK SC","Source Han Serif SC","STSong","SimSun",serif' },
  { k:'kai',   n:'楷体', w:700, stroke:0.009,
    probe:['Kaiti SC','KaitiSC-Regular','STKaiti','Kaiti TC','KaiTi'],
    stack:'"Kaiti SC","Kaiti TC","STKaiti","KaiTi",serif' },
  { k:'hand',  n:'手札', w:400, stroke:0.005,
    probe:['Hannotate SC','HannotateSC-W5','HanziPen SC','HanziPenSC-W3','Hannotate TC'],
    stack:'"Hannotate SC","HanziPen SC","Hannotate TC",cursive' },
  { k:'xing',  n:'行楷', w:400, stroke:0.003,
    probe:['Xingkai SC','XingkaiSC-Bold','STXingkai','Xingkai TC'],
    stack:'"Xingkai SC","Xingkai TC","STXingkai",cursive' },
  { k:'li',    n:'报隶', w:400, stroke:0.008,
    probe:['Baoli SC','BaoliSC-Regular','STBaoliSC-Regular','Baoli TC'],
    stack:'"Baoli SC","Baoli TC","STBaoli",serif' },
  { k:'wei',   n:'魏碑', w:400, stroke:0.006,
    probe:['Weibei SC','WeibeiSC-Bold','Weibei TC'],
    stack:'"Weibei SC","Weibei TC",serif' }
];
var MAXW = W - PAD_X * 2;
// 文字块以 BLOCK_CY 为中心，可用高度是中心到上下边距的两倍
var MAXH = 2 * (H * 0.475 - PAD_X);
var EMO = /\p{Extended_Pictographic}/u;
var STORE_KEY = 'xhs-cover-v1';

var SWATCHES = ['#F2F9FF','#FFF7EA','#FFF0F1','#EDFBF0','#F4F0FF','#F5F3EE','#EAF6F6','#FFFFFF'];
var HL_SWATCHES = ['#FBEA54','#FFC46B','#FFAFC5','#B8EB8C','#9AD8F5','#CDB4F6'];
var BRUSHES = [{ k:'blob', n:'团块' }, { k:'marker', n:'马克笔' }];
// ts = 缩略图里的取景比例：太小纹样会糊成一片，颗粒必须 1:1 才看得见
var TEXTURES = [
  { k:'',      n:'无'   },
  { k:'grain', n:'颗粒', ts:1    },
  { k:'dots',  n:'波点', ts:0.42 },
  { k:'grid',  n:'网格', ts:0.42 },
  { k:'rule',  n:'横线', ts:0.42 },
  { k:'diag',  n:'斜纹', ts:0.42 },
  { k:'check', n:'方格', ts:0.34 },
  { k:'cross', n:'十字', ts:0.42 },
  { k:'wave',  n:'波浪', ts:0.42 },
  { k:'weave', n:'麻布', ts:0.55 },
  { k:'star',  n:'星点', ts:0.60 }
];
var SK_PRESETS = ['?','!','¥','★','♥','＋','🔥','✨','💡','🍀'];
var SK_LAYOUTS = [
  { k:'diagonal', n:'原图' },
  { k:'three',    n:'三点' },
  { k:'scatter',  n:'散布' },
  { k:'random',   n:'随机' }
];
// [中心x比例, 中心y比例, 尺寸系数, 旋转角度]
// diagonal 一组是照着参考图逐个量出来的：三只完整 + 两只出血
var LAYOUT_POS = {
  diagonal: [[ 0.592, 0.321, 1.17,   8],
             [ 0.190, 0.711, 0.97,  -8],
             [ 0.672, 0.824, 0.63,  12],
             [-0.130, 0.100, 1.00, -14],
             [ 1.070, 0.700, 0.70,  10]],
  three:    [[0.16,0.20,0.95,-12],[0.82,0.47,1.15,9],[0.46,0.86,0.72,16]],
  scatter:  [[0.13,0.13,0.52,-14],[0.63,0.11,0.40,12],[0.88,0.38,0.58,-6],
             [0.20,0.50,0.36,20],[0.52,0.71,0.60,-16],[0.84,0.90,0.46,8]]
};

var DEFAULT_STATE = {
  text : '写文字\n封面生成小工具\n想怎么生成\n就怎么生成🎉',
  hl   : [],
  hlColors : {},
  font : 'sans',
  hlColor: '#FBEA54',
  brush: 'blob',
  bg   : '#F2F9FF',
  texture: 'grain',
  sk   : { ch:'?', layout:'diagonal', size:1, rot:1, opa:1, seed:20260827 }
};

/* ==========================================================
   工具：随机 / 颜色
   ========================================================== */
function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function clamp(v,a,b){ return v < a ? a : v > b ? b : v; }

function hex2rgb(h){
  h = String(h).replace('#','');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  var n = parseInt(h,16) || 0;
  return [n>>16 & 255, n>>8 & 255, n & 255];
}
function rgb2hex(r,g,b){
  return '#' + [r,g,b].map(function(v){
    return clamp(Math.round(v),0,255).toString(16).padStart(2,'0');
  }).join('');
}
function rgb2hsl(r,g,b){
  r/=255; g/=255; b/=255;
  var mx = Math.max(r,g,b), mn = Math.min(r,g,b), d = mx-mn, h = 0, s = 0, l = (mx+mn)/2;
  if (d) {
    s = d / (1 - Math.abs(2*l - 1));
    if (mx === r)      h = ((g-b)/d) % 6;
    else if (mx === g) h = (b-r)/d + 2;
    else               h = (r-g)/d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, s*100, l*100];
}
function hsl2hex(h,s,l){
  h = ((h % 360) + 360) % 360; s = clamp(s,0,100)/100; l = clamp(l,0,100)/100;
  var c = (1 - Math.abs(2*l - 1)) * s, x = c * (1 - Math.abs((h/60) % 2 - 1)), m = l - c/2, r, g, b;
  if (h < 60)       { r=c; g=x; b=0; }
  else if (h < 120) { r=x; g=c; b=0; }
  else if (h < 180) { r=0; g=c; b=x; }
  else if (h < 240) { r=0; g=x; b=c; }
  else if (h < 300) { r=x; g=0; b=c; }
  else              { r=c; g=0; b=x; }
  return rgb2hex((r+m)*255, (g+m)*255, (b+m)*255);
}
/* 由底色派生文字色与贴纸色：同色相，明度分档 —— 换任何底色都协调 */
function derive(bg){
  var c = rgb2hsl.apply(null, hex2rgb(bg)), h = c[0], s = c[1], l = c[2];
  if (l > 55) {
    return {
      text   : hsl2hex(h - 8, clamp(s * 0.62, 16, 62), 18),
      sticker: hsl2hex(h - 12, clamp(s * 0.70, 0, 100), l - 3.6),
      texture: hsl2hex(h - 12, clamp(s * 0.75, 0, 100), l - 6.5)
    };
  }
  return {
    text   : hsl2hex(h, clamp(s * 0.30, 0, 42), 96),
    sticker: hsl2hex(h, s, clamp(l + 8, 0, 100)),
    texture: hsl2hex(h, s, clamp(l + 11, 0, 100))
  };
}

/* ==========================================================
   状态
   ========================================================== */
var state = load();
function load(){
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      var s = JSON.parse(raw);
      if (s && typeof s.text === 'string') {
        s.sk = Object.assign({}, DEFAULT_STATE.sk, s.sk || {});
        // 老版本只有「颗粒质感」开关，迁移到纹理
        if (typeof s.texture !== 'string') s.texture = s.grain === false ? '' : 'grain';
        if (typeof s.font !== 'string') s.font = 'sans';
        // 老版本高亮共用一个颜色，迁移成逐字符颜色
        if (Array.isArray(s.hl) && s.hl.length && (!s.hlColors || typeof s.hlColors !== 'object' || Array.isArray(s.hlColors))) {
          var hc = {};
          s.hl.forEach(function(i){ hc[i] = s.hlColor || '#FBEA54'; });
          s.hlColors = hc;
        }
        return Object.assign({}, DEFAULT_STATE, s);
      }
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
var saveTimer = null;
function persist(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(function(){
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }, 250);
}

/* ==========================================================
   字符切分（emoji 不被拆碎）
   ========================================================== */
var segmenter = (window.Intl && Intl.Segmenter) ? new Intl.Segmenter('zh', { granularity:'grapheme' }) : null;
function graphemes(s){
  if (segmenter) {
    var out = [], it = segmenter.segment(s);
    for (var v of it) out.push(v.segment);
    return out;
  }
  return Array.from(s);
}

/* ==========================================================
   文字排版引擎 —— 锁定参考图比例，超长自动等比缩小
   ========================================================== */
var cv  = document.getElementById('cv');
var ctx = cv.getContext('2d');
var LAST = { lines: [], fs: BASE_FS };

/* 本机是否真的装了这个字体。
   坑：不能只量宽度——汉字在几乎所有中文字体里都是精确 1em 等宽，
   宋体和黑体的「永」宽度一模一样，光看宽度会把装着的字体判成没装
   （iOS 上就是这样只认出 2 种）。所以改为比对墨迹包围盒
   actualBoundingBox*，字形长得不一样它就不一样。 */
var probeCtx = document.createElement('canvas').getContext('2d');
var NO_SUCH_FONT = 'ZzNoSuchFamilyZz';
function fontSig(family, base){
  probeCtx.font = '96px "' + family + '",' + base;
  var m = probeCtx.measureText('永国永A'), out = [m.width];
  ['actualBoundingBoxAscent', 'actualBoundingBoxDescent',
   'actualBoundingBoxLeft', 'actualBoundingBoxRight'].forEach(function(k){
    out.push(typeof m[k] === 'number' ? m[k] : 0);
  });
  return out.map(function(v){ return Math.round(v * 50); }).join(',');
}
/* 判定分两路，命中任意一路就算可用（宁可多列，也别把装着的字体藏掉）：
   1) 以黑体栈为兜底作对比——直接回答「选了它画面会不会变」，
      这是真正要紧的问题，也绕开了 serif 兜底恰好就是宋体之类的巧合；
   2) 再和三种通用兜底比一遍，作为补充。 */
function fontInstalled(name){
  if (fontSig(name, SANS_STACK) !== fontSig(NO_SUCH_FONT, SANS_STACK)) return true;
  var bases = ['monospace', 'serif', 'sans-serif'];
  for (var i = 0; i < bases.length; i++) {
    if (fontSig(name, bases[i]) !== fontSig(NO_SUCH_FONT, bases[i])) return true;
  }
  return false;
}
// 黑体永远保留（它就是系统默认），其余按本机实际字库过滤
var AVAIL_FONTS = FONTS.filter(function(f){
  if (!f.probe.length) return true;
  return f.probe.some(fontInstalled);
});

function curFont(){
  for (var i = 0; i < AVAIL_FONTS.length; i++) if (AVAIL_FONTS[i].k === state.font) return AVAIL_FONTS[i];
  return AVAIL_FONTS[0];
}
function fontStr(fs){
  var f = curFont();
  return f.w + ' ' + fs.toFixed(2) + 'px ' + f.stack;
}

function layout(){
  var raw = state.text.length ? state.text : ' ';
  var srcLines = raw.split('\n');

  // 先按基准字号量一次每个字的宽度，之后按比例换算（canvas 字度量随字号线性变化）
  ctx.font = fontStr(BASE_FS);
  var src = [], idx = 0;
  srcLines.forEach(function(ln, li){
    src.push(graphemes(ln).map(function(ch){
      return { ch: ch, idx: idx++, w0: ctx.measureText(ch).width };
    }));
    if (li < srcLines.length - 1) idx++;   // 换行符也占一个索引
  });

  // 安全换行：手动换行为主，单行实在放不下时才在字间断开
  function wrapAll(fs){
    var ratio = fs / BASE_FS, limit = MAXW * 0.995, out = [];
    src.forEach(function(arr){
      if (!arr.length) { out.push([]); return; }
      var cur = [], w = 0;
      for (var i = 0; i < arr.length; i++) {
        var cw = arr[i].w0 * ratio;
        if (cur.length && w + cw > limit) {
          var cut = cur.length;
          // 尽量不从英文单词中间断开
          if (isWord(arr[i].ch) && isWord(cur[cut - 1].ch)) {
            var k = cut - 1;
            while (k > 0 && isWord(cur[k - 1].ch) && cut - k < 12) k--;
            if (k > 0) cut = k;
          }
          out.push(cur.slice(0, cut));
          cur = cur.slice(cut);
          w = 0;
          for (var j = 0; j < cur.length; j++) w += cur[j].w0 * ratio;
        }
        cur.push(arr[i]); w += cw;
      }
      out.push(cur);
    });
    return out;
  }
  function isWord(ch){ return /[A-Za-z0-9]/.test(ch); }

  // 找到既不出血、又尽量接近参考图字号的尺寸
  var fs = BASE_FS, lines = wrapAll(fs);
  for (var it = 0; it < 24; it++) {
    var h = lines.length * fs * LINE_RATIO;
    if (h <= MAXH || fs <= MIN_FS) break;
    fs = Math.max(MIN_FS, fs * Math.sqrt(MAXH / h) * 0.985);
    lines = wrapAll(fs);
  }

  // 用最终字号定位每一个字
  ctx.font = fontStr(fs);
  var lineH = fs * LINE_RATIO;
  var top = H * BLOCK_CY - lines.length * lineH / 2;
  lines.forEach(function(arr, li){
    var boxTop = top + li * lineH, base = boxTop + fs * BASELINE_OFF, x = PAD_X;
    arr.forEach(function(c){
      c.w = ctx.measureText(c.ch).width;
      c.x = x; c.base = base; c.boxTop = boxTop; c.lineH = lineH;
      x += c.w;
    });
  });

  LAST = { lines: lines, fs: fs };
  return LAST;
}

/* ==========================================================
   贴纸层
   ========================================================== */
function stickerItems(){
  if (state.sk.layout === 'random') {
    var r = mulberry32(state.sk.seed), n = 3 + Math.floor(r() * 3), out = [];
    for (var i = 0; i < n; i++) {
      out.push([0.08 + r() * 0.84, 0.10 + r() * 0.80, 0.50 + r() * 0.85, (r() * 2 - 1) * 22]);
    }
    return out;
  }
  return LAYOUT_POS[state.sk.layout] || LAYOUT_POS.diagonal;
}
function drawStickers(d){
  var t = (state.sk.ch || '').trim();
  if (!t) return;
  var colored = EMO.test(t);
  // ★ ♥ 这类符号默认按文本呈现渲染成单色细线，补 VS16 强制走彩色 emoji 字体
  if (colored && !/\uFE0F|\u200D/.test(t)) t += '\uFE0F';
  var items = stickerItems();
  ctx.save();
  ctx.globalAlpha = state.sk.opa;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = d.sticker;
  for (var i = 0; i < items.length; i++) {
    var p = items[i], fs = STICKER_FS * p[2] * state.sk.size;
    ctx.save();
    ctx.translate(p[0] * W, p[1] * H);
    ctx.rotate(p[3] * state.sk.rot * Math.PI / 180);
    // emoji 字体放最前，彩色字符优先命中；非 emoji 仍走中文字体栈
    ctx.font = (colored ? '400 ' + fs.toFixed(1) + 'px ' + EMOJI_STACK + ',' + SANS_STACK
                        : '900 ' + fs.toFixed(1) + 'px ' + SANS_STACK);
    ctx.fillText(t, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

/* ==========================================================
   颗粒质感（生成一次后缓存）
   ========================================================== */
/* 每种纹理画在 1080×1440 离屏画布上，按 (纹理, 颜色) 缓存 */
var TEX_DRAW = {
  // 颗粒：参考图那种纸面细白点，比底色亮
  grain: function(g){
    var r = mulberry32(1357), n = Math.round(W * H * 0.010);
    for (var i = 0; i < n; i++) {
      var big = r() > 0.86;
      g.fillStyle = 'rgba(255,255,255,' + (big ? 0.55 + r() * 0.45 : 0.16 + r() * 0.26).toFixed(2) + ')';
      g.fillRect(r() * W, r() * H, big ? 2 : 1, big ? 2 : 1);
    }
  },
  dots: function(g, color){
    g.fillStyle = color;
    var step = 76, row = 0;
    for (var y = step / 2; y < H + step; y += step, row++) {
      for (var x = (row % 2 ? step / 2 : 0); x < W + step; x += step) {
        g.beginPath(); g.arc(x, y, 9, 0, 6.2832); g.fill();
      }
    }
  },
  grid: function(g, color){
    g.strokeStyle = color; g.lineWidth = 3;
    for (var x = 90; x < W; x += 90) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    for (var y = 90; y < H; y += 90) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  },
  rule: function(g, color){
    g.strokeStyle = color; g.lineWidth = 3;
    for (var y = 72; y < H; y += 108) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  },
  diag: function(g, color){
    g.save();
    g.globalAlpha = 0.85; g.strokeStyle = color; g.lineWidth = 16;
    g.translate(W / 2, H / 2); g.rotate(-Math.PI / 4); g.translate(-W, -H);
    for (var x = 0; x < W * 2; x += 62) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H * 2); g.stroke(); }
    g.restore();
  },
  check: function(g, color){
    g.save();
    g.globalAlpha = 0.45; g.fillStyle = color;
    var sz = 120, row = 0;
    for (var y = 0; y < H; y += sz, row++)
      for (var x = (row % 2 ? sz : 0); x < W; x += sz * 2) g.fillRect(x, y, sz, sz);
    g.restore();
  },
  cross: function(g, color){
    var r = mulberry32(77), step = 132, row = 0;
    g.strokeStyle = color; g.lineWidth = 7; g.lineCap = 'round';
    for (var y = 60; y < H + step; y += step, row++)
      for (var x = (row % 2 ? step / 2 : 0) + 50; x < W + step; x += step) {
        g.save(); g.translate(x, y); g.rotate((r() * 2 - 1) * 0.5);
        g.beginPath();
        g.moveTo(-20, 0); g.lineTo(20, 0); g.moveTo(0, -20); g.lineTo(0, 20);
        g.stroke(); g.restore();
      }
  },
  wave: function(g, color){
    g.strokeStyle = color; g.lineWidth = 7; g.lineCap = 'round';
    for (var y = 60; y < H + 60; y += 92) {
      g.beginPath();
      for (var x = 0; x <= W; x += 8) {
        var yy = y + Math.sin(x / 118) * 13;
        if (x === 0) g.moveTo(x, yy); else g.lineTo(x, yy);
      }
      g.stroke();
    }
  },
  weave: function(g, color){
    g.save();
    g.globalAlpha = 0.8; g.strokeStyle = color; g.lineWidth = 2;
    var d = 20, i;
    for (i = -H; i < W; i += d) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + H, H); g.stroke(); }
    for (i = 0; i < W + H; i += d) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i - H, H); g.stroke(); }
    g.restore();
  },
  star: function(g, color){
    var r = mulberry32(918);
    g.fillStyle = color;
    for (var i = 0; i < 46; i++) {
      var sz = 16 + r() * 22;
      g.save();
      g.translate(r() * W, r() * H);
      g.rotate(r() * 1.2 - 0.6);
      g.beginPath();
      g.moveTo(0, -sz);
      g.quadraticCurveTo(sz * 0.16, -sz * 0.16, sz, 0);
      g.quadraticCurveTo(sz * 0.16, sz * 0.16, 0, sz);
      g.quadraticCurveTo(-sz * 0.16, sz * 0.16, -sz, 0);
      g.quadraticCurveTo(-sz * 0.16, -sz * 0.16, 0, -sz);
      g.fill();
      g.restore();
    }
  }
};

var THUMB_TS = {};
TEXTURES.forEach(function(o){ if (o.ts) THUMB_TS[o.k] = o.ts; });

var texCache = {};
function textureCanvas(key, color){
  var ck = key + '|' + color;
  if (texCache[ck]) return texCache[ck];
  var c = document.createElement('canvas');
  c.width = W; c.height = H;
  TEX_DRAW[key](c.getContext('2d'), color);
  var keys = Object.keys(texCache);
  if (keys.length > 5) delete texCache[keys[0]];
  texCache[ck] = c;
  return c;
}
// 颗粒是白点，压在深色底上要收一收
function grainAlpha(bg){
  return rgb2hsl.apply(null, hex2rgb(bg))[2] > 55 ? 1 : 0.32;
}
/* 缩略图是「标签」不是「预览」：52px 里正图那种 6% 的色差根本看不出来，
   所以缩略图统一用一档更重的颜色，让整条列表能一眼扫过去 */
function thumbTint(bg){
  var c = rgb2hsl.apply(null, hex2rgb(bg)), h = c[0], s = c[1], l = c[2];
  return l > 55 ? hsl2hex(h - 12, clamp(s * 0.80, 0, 100), l - 13)
                : hsl2hex(h, s, clamp(l + 20, 0, 100));
}

/* 缩略图和正图共用同一批绘制函数，缩放后取正中一块取景 */
function drawThumb(tc, key, bg, color){
  var g = tc.getContext('2d'), tw = tc.width, th = tc.height;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, tw, th);
  g.fillStyle = bg;
  g.fillRect(0, 0, tw, th);
  if (!key || !TEX_DRAW[key]) return;
  g.save();
  g.beginPath(); g.rect(0, 0, tw, th); g.clip();
  if (key === 'grain') {
    // 白色细点在小图里等于没有，缩略图改画同色系的密点来表意
    var r = mulberry32(4242), n = Math.round(tw * th * 0.10);
    g.fillStyle = color;
    for (var i = 0; i < n; i++) {
      g.globalAlpha = 0.35 + r() * 0.5;
      g.fillRect(r() * tw, r() * th, 1, 1);
    }
  } else {
    var ts = THUMB_TS[key] || 0.42;
    g.translate(-(W * ts - tw) / 2, -(H * ts - th) / 2);
    g.scale(ts, ts);
    TEX_DRAW[key](g, color);
  }
  g.restore();
}

function drawTexture(d){
  var key = state.texture;
  if (!key || !TEX_DRAW[key]) return;
  var grainy = key === 'grain';
  ctx.save();
  ctx.globalAlpha = grainy ? grainAlpha(state.bg) : 1;
  ctx.drawImage(textureCanvas(key, grainy ? '#FFFFFF' : d.texture), 0, 0);
  ctx.restore();
}

/* ==========================================================
   黄色高亮块 —— 手绘感 blob，同行连续选中自动连成一片
   ========================================================== */
function blobPath(c, x, y, w, h, seed){
  var r = mulberry32(seed);
  var cx = x + w / 2, cy = y + h / 2, a = w / 2, b = h / 2, n = 2.6, N = 16, pts = [], i;
  for (i = 0; i < N; i++) {
    var t = i / N * Math.PI * 2, ct = Math.cos(t), st = Math.sin(t);
    var k = 1 + (r() * 2 - 1) * 0.06;
    pts.push([
      cx + Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n) * a * k,
      cy + Math.sign(st) * Math.pow(Math.abs(st), 2 / n) * b * k
    ]);
  }
  c.moveTo(pts[0][0], pts[0][1]);
  for (i = 0; i < N; i++) {
    var p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
    c.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
      p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
      p2[0], p2[1]
    );
  }
  c.closePath();
}
/* 马克笔：整段一道横扫，笔头斜切、上下边缘轻微起伏 */
function markerPath(c, x0, x1, yTop, h, seed){
  var r = mulberry32(seed);
  var lead = h * (0.06 + r() * 0.05), tail = h * (0.09 + r() * 0.07);
  var xa = x0 - lead, xb = x1 + tail, yb = yTop + h;
  var slant = h * 0.19, amp = h * 0.055;
  var m1 = xa + (xb - xa) * 0.34, m2 = xa + (xb - xa) * 0.71;
  c.moveTo(xa + slant, yTop + amp * (r() * 2 - 1) * 0.5);
  c.bezierCurveTo(m1, yTop - amp, m2, yTop + amp, xb, yTop + amp * 0.5);
  c.lineTo(xb - slant, yb - amp * 0.4);
  c.bezierCurveTo(m2, yb + amp, m1, yb - amp, xa, yb);
  c.closePath();
}

function drawHighlights(L){
  if (!state.hl.length) return;
  var colors = state.hlColors || {};
  var set = new Set(state.hl);
  var marker = state.brush === 'marker';
  ctx.save();
  if (marker) ctx.globalAlpha = 0.9;   // 马克笔透一点，压到贴纸上更像真笔
  L.lines.forEach(function(line){
    var i = 0;
    while (i < line.length) {
      if (!set.has(line[i].idx)) { i++; continue; }
      // 每段高亮用它被刷上时的颜色，同行连续同色才连成一片
      var color = colors[line[i].idx] || state.hlColor;
      var j = i;
      while (j + 1 < line.length && set.has(line[j + 1].idx) &&
             (colors[line[j + 1].idx] || state.hlColor) === color) j++;
      ctx.fillStyle = color;
      ctx.beginPath();
      if (marker) {
        var a = line[i], z = line[j];
        markerPath(ctx, a.x, z.x + z.w, a.base - L.fs * MK_TOP,
                   L.fs * (MK_TOP + MK_BOT), a.idx * 9173 + 41);
      } else {
        for (var k = i; k <= j; k++) {
          var c = line[k], pad = c.w * 0.005;
          blobPath(ctx, c.x - pad, c.base - L.fs * HL_TOP, c.w + pad * 2,
                   L.fs * (HL_TOP + HL_BOT), c.idx * 9173 + 41);
        }
      }
      ctx.fill();
      i = j + 1;
    }
  });
  ctx.restore();
}

/* ==========================================================
   文字层：描边 + 填充 模拟 Heavy 字重；emoji 保留原色
   ========================================================== */
function drawText(L, d){
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = fontStr(L.fs);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = L.fs * curFont().stroke;
  ctx.fillStyle = d.text;
  ctx.strokeStyle = d.text;
  L.lines.forEach(function(line){
    line.forEach(function(c){
      if (c.ch === ' ' || c.ch === '\t') return;
      if (!EMO.test(c.ch)) ctx.strokeText(c.ch, c.x, c.base);
      ctx.fillText(c.ch, c.x, c.base);
    });
  });
  ctx.restore();
}

/* ==========================================================
   主渲染：底色 → 贴纸 → 颗粒 → 高亮 → 文字
   ========================================================== */
function render(){
  var d = derive(state.bg);
  var L = layout();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = state.bg;
  ctx.fillRect(0, 0, W, H);
  drawStickers(d);
  drawTexture(d);
  drawHighlights(L);
  drawText(L, d);
}

/* ==========================================================
   点 / 划 选高亮
   ========================================================== */
function toDesign(e){
  var r = cv.getBoundingClientRect();
  return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H];
}
function hitChar(x, y){
  for (var i = 0; i < LAST.lines.length; i++) {
    var line = LAST.lines[i];
    for (var j = 0; j < line.length; j++) {
      var c = line[j];
      if (x >= c.x - 2 && x <= c.x + c.w + 2 && y >= c.boxTop && y <= c.boxTop + c.lineH) return c;
    }
  }
  return null;
}
var painting = false, paintTo = true;
function applyPaint(c){
  var set = new Set(state.hl);
  if (!state.hlColors || typeof state.hlColors !== 'object' || Array.isArray(state.hlColors)) state.hlColors = {};
  var prevColor = state.hlColors[c.idx];
  if (paintTo) { set.add(c.idx); state.hlColors[c.idx] = state.hlColor; }
  else { set.delete(c.idx); delete state.hlColors[c.idx]; }
  var next = Array.from(set).sort(function(a, b){ return a - b; });
  if (next.length !== state.hl.length || next.some(function(v, i){ return v !== state.hl[i]; }) || state.hlColors[c.idx] !== prevColor) {
    state.hl = next;
    render();
  }
}
cv.addEventListener('pointerdown', function(e){
  var p = toDesign(e), c = hitChar(p[0], p[1]);
  if (!c) return;
  e.preventDefault();
  painting = true;
  // 未高亮 → 添加；同色再刷 → 擦除；异色再刷 → 用新颜色替换
  paintTo = !(state.hl.indexOf(c.idx) !== -1 &&
              String(state.hlColors[c.idx] || '').toUpperCase() === state.hlColor.toUpperCase());
  if (cv.setPointerCapture) { try { cv.setPointerCapture(e.pointerId); } catch (err) {} }
  applyPaint(c);
});
cv.addEventListener('pointermove', function(e){
  if (!painting) return;
  e.preventDefault();
  var p = toDesign(e), c = hitChar(p[0], p[1]);
  if (c) applyPaint(c);
});
function endPaint(){ if (painting) { painting = false; persist(); } }
cv.addEventListener('pointerup', endPaint);
cv.addEventListener('pointercancel', endPaint);
cv.addEventListener('contextmenu', function(e){ e.preventDefault(); });

/* ==========================================================
   编辑文本时平移高亮索引（公共前缀 / 后缀 diff）
   ========================================================== */
function remapHighlight(oldText, newText, hl){
  if (!hl.length) { if (state.hlColors) state.hlColors = {}; return hl; }
  var o = graphemes(oldText), n = graphemes(newText);
  var p = 0;
  while (p < o.length && p < n.length && o[p] === n[p]) p++;
  var s = 0;
  while (s < o.length - p && s < n.length - p && o[o.length - 1 - s] === n[n.length - 1 - s]) s++;
  var delta = n.length - o.length, out = [], colors = state.hlColors || {}, outC = {};
  hl.forEach(function(i){
    if (i < p) { out.push(i); outC[i] = colors[i]; }
    else if (i >= o.length - s) { out.push(i + delta); outC[i + delta] = colors[i]; }
  });
  state.hlColors = outC;
  return out;
}

/* ==========================================================
   导出：writeTempFile 换本地路径 → 存入系统相册（JSBridge）
   ========================================================== */
var toastTimer = null;
function toast(msg){
  var el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ el.classList.remove('on'); }, 1900);
}
// 大图先落成临时文件，避免超长 base64 上行；无此能力或落文件失败时退回 data:uri
function toFilePath(mt, dataUrl){
  if (typeof mt.writeTempFile !== 'function') return Promise.resolve(dataUrl);
  // canvas.toDataURL() 返回完整 data:uri，writeTempFile 要求原样传入，不可截取
  return mt.writeTempFile({ data: dataUrl }).then(function(res){
    return (res && res.filePath) || dataUrl;
  }, function(){ return dataUrl; });
}

// 非小红书容器（普通浏览器）：降级为下载，不支持则提示长按保存
function saveInBrowser(dataUrl){
  var a = document.createElement('a');
  if (!('download' in a)) { toast('请长按图片保存'); return; }
  a.href = dataUrl;
  a.download = '小红书封面.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  toast('已下载图片');
}

document.getElementById('save').addEventListener('click', function(){
  render();
  var dataUrl = cv.toDataURL('image/png');
  var mt = window.xhs && window.xhs.miniTool;
  if (!mt || typeof mt.saveImageToPhotosAlbum !== 'function') {
    saveInBrowser(dataUrl);
    return;
  }
  toast('正在生成图片…');
  toFilePath(mt, dataUrl).then(function(filePath){
    return mt.saveImageToPhotosAlbum({ filePath: filePath });
  }).then(function(){
    toast('已保存到相册');
  }, function(err){
    toast('保存失败：' + ((err && err.errMsg) || '请重试'));
  });
});

/* ==========================================================
   面板交互
   ========================================================== */
var $ = function(id){ return document.getElementById(id); };

// 分段切换
Array.prototype.forEach.call(document.querySelectorAll('.tabs button'), function(b){
  b.addEventListener('click', function(){
    document.querySelectorAll('.tabs button').forEach(function(x){ x.classList.remove('on'); });
    document.querySelectorAll('.panel').forEach(function(x){ x.classList.remove('on'); });
    b.classList.add('on');
    document.querySelector('.panel[data-panel="' + b.dataset.tab + '"]').classList.add('on');
    // 面板刚显示出来才量得到宽度，横滑条的定位要等这时候再算
    if (b.dataset.tab === 'b') syncTexture();
    if (b.dataset.tab === 't') syncFont();
  });
});

// 文案
var ta = $('text');
ta.value = state.text;
ta.addEventListener('input', function(){
  state.hl = remapHighlight(state.text, ta.value, state.hl);
  state.text = ta.value;
  render(); persist();
});
$('clearHl').addEventListener('click', function(){
  state.hl = []; state.hlColors = {}; render(); persist(); toast('已清除高亮');
});

// 色板（背景色与高亮色共用同一套控件）
function makeSwatchRow(wrap, colors, onPick, getCurrent){
  colors.forEach(function(hex){
    var b = document.createElement('button');
    b.className = 'sw';
    b.style.background = hex;
    b.dataset.hex = hex;
    b.addEventListener('click', function(){ onPick(hex); });
    wrap.appendChild(b);
  });
  var custom = document.createElement('button');
  custom.className = 'sw custom';
  var picker = document.createElement('input');
  picker.type = 'color';
  custom.appendChild(picker);
  wrap.appendChild(custom);
  picker.addEventListener('input', function(){ onPick(picker.value.toUpperCase()); });
  return function sync(){
    var cur = getCurrent(), known = false;
    wrap.querySelectorAll('.sw[data-hex]').forEach(function(b){
      var on = b.dataset.hex.toUpperCase() === cur.toUpperCase();
      b.classList.toggle('on', on);
      if (on) known = true;
    });
    custom.classList.toggle('on', !known);
    custom.style.background = known ? '' : cur;
    picker.value = /^#[0-9a-f]{6}$/i.test(cur) ? cur : colors[0];
  };
}
var syncBgRow = makeSwatchRow($('swatches'), SWATCHES, function(hex){
  state.bg = hex; syncBgRow(); paintThumbs(); render(); persist();
}, function(){ return state.bg; });

var syncHlRow = makeSwatchRow($('hlSwatches'), HL_SWATCHES, function(hex){
  state.hlColor = hex; syncHlRow(); render(); persist();
}, function(){ return state.hlColor; });

// 字体：样张就用字体名本身，选什么样子一眼可见
var fontWrap = $('fontlist');
AVAIL_FONTS.forEach(function(f){
  var b = document.createElement('button');
  b.className = 'chip';
  b.textContent = f.n;
  b.dataset.k = f.k;
  b.style.fontFamily = f.stack;
  b.addEventListener('click', function(){
    state.font = f.k; syncFont(); render(); persist();
  });
  fontWrap.appendChild(b);
});
$('fontNote').textContent = AVAIL_FONTS.length > 1
  ? '本机可用 ' + AVAIL_FONTS.length + ' 种'
  : '本机仅系统黑体';

function syncFont(){
  var cur = null;
  fontWrap.querySelectorAll('.chip').forEach(function(b){
    var on = b.dataset.k === curFont().k;
    b.classList.toggle('on', on);
    if (on) cur = b;
  });
  if (cur && fontWrap.clientWidth) {
    var l = cur.offsetLeft, r = l + cur.offsetWidth;
    if (l < fontWrap.scrollLeft) fontWrap.scrollLeft = Math.max(0, l - 12);
    else if (r > fontWrap.scrollLeft + fontWrap.clientWidth)
      fontWrap.scrollLeft = r - fontWrap.clientWidth + 12;
  }
}

// 笔触
var brushWrap = $('hlBrush');
BRUSHES.forEach(function(o){
  var b = document.createElement('button');
  b.className = 'chip';
  b.textContent = o.n;
  b.dataset.k = o.k;
  b.addEventListener('click', function(){
    state.brush = o.k; syncBrush(); render(); persist();
  });
  brushWrap.appendChild(b);
});
function syncBrush(){
  brushWrap.querySelectorAll('.chip').forEach(function(b){
    b.classList.toggle('on', b.dataset.k === state.brush);
  });
}

// 纹理：横向滚动的缩略图列表
var texWrap = $('texture');
var texItems = [];
var TDPR = Math.min(window.devicePixelRatio || 1, 3);
TEXTURES.forEach(function(o){
  var b = document.createElement('button');
  b.className = 'tex';
  b.dataset.k = o.k;
  var box = document.createElement('i');
  var tc = document.createElement('canvas');
  tc.width = Math.round(52 * TDPR);
  tc.height = Math.round(69 * TDPR);
  box.appendChild(tc);
  var lab = document.createElement('span');
  lab.textContent = o.n;
  b.appendChild(box); b.appendChild(lab);
  b.addEventListener('click', function(){
    state.texture = o.k; syncTexture(); render(); persist();
  });
  texWrap.appendChild(b);
  texItems.push({ k: o.k, el: b, cv: tc });
});

// 纹理色随底色走，所以换底色要重画整条缩略图
function paintThumbs(){
  var tint = thumbTint(state.bg);
  texItems.forEach(function(t){ drawThumb(t.cv, t.k, state.bg, tint); });
}

function syncTexture(){
  var cur = null;
  texItems.forEach(function(t){
    var on = t.k === state.texture;
    t.el.classList.toggle('on', on);
    if (on) cur = t.el;
  });
  // 选中项被滚出视野时拉回来（只动这条容器，不动页面）
  // 面板隐藏时量不到宽度，等切过来再算
  if (cur && texWrap.clientWidth) {
    var l = cur.offsetLeft, r = l + cur.offsetWidth;
    if (l < texWrap.scrollLeft) texWrap.scrollLeft = Math.max(0, l - 12);
    else if (r > texWrap.scrollLeft + texWrap.clientWidth)
      texWrap.scrollLeft = r - texWrap.clientWidth + 12;
  }
}

// 贴纸
var skChar = $('skChar');
skChar.value = state.sk.ch;
skChar.addEventListener('input', function(){
  state.sk.ch = skChar.value;
  syncSkPresets(); render(); persist();
});
var presetWrap = $('skPresets');
SK_PRESETS.forEach(function(ch){
  var b = document.createElement('button');
  b.className = 'chip g';
  b.textContent = ch;
  b.dataset.ch = ch;
  b.addEventListener('click', function(){
    state.sk.ch = ch; skChar.value = ch;
    syncSkPresets(); render(); persist();
  });
  presetWrap.appendChild(b);
});
var noneBtn = document.createElement('button');
noneBtn.className = 'chip';
noneBtn.textContent = '无';
noneBtn.addEventListener('click', function(){
  state.sk.ch = ''; skChar.value = '';
  syncSkPresets(); render(); persist();
});
presetWrap.appendChild(noneBtn);
function syncSkPresets(){
  presetWrap.querySelectorAll('.chip[data-ch]').forEach(function(b){
    b.classList.toggle('on', b.dataset.ch === state.sk.ch);
  });
  noneBtn.classList.toggle('on', !state.sk.ch.trim());
}

var layWrap = $('skLayout');
SK_LAYOUTS.forEach(function(o){
  var b = document.createElement('button');
  b.className = 'chip';
  b.textContent = o.n;
  b.dataset.k = o.k;
  b.addEventListener('click', function(){
    if (state.sk.layout === 'random' && o.k === 'random') state.sk.seed = Date.now() & 0x7fffffff;
    state.sk.layout = o.k;
    syncLayout(); render(); persist();
  });
  layWrap.appendChild(b);
});
// 「换一批」是动作不是状态，永远不高亮
var shuffleChip = document.createElement('button');
shuffleChip.className = 'chip';
shuffleChip.textContent = '换一批';
shuffleChip.addEventListener('click', reshuffle);
layWrap.appendChild(shuffleChip);

function syncLayout(){
  layWrap.querySelectorAll('.chip[data-k]').forEach(function(b){
    b.classList.toggle('on', b.dataset.k === state.sk.layout);
  });
}

function bindRange(id, label, key, div){
  var el = $(id), out = $(label);
  el.value = Math.round(state.sk[key] * 100);
  out.textContent = el.value + '%';
  el.addEventListener('input', function(){
    state.sk[key] = +el.value / 100;
    out.textContent = el.value + '%';
    render(); persist();
  });
}
bindRange('skSize', 'vSize', 'size');
bindRange('skRot',  'vRot',  'rot');
bindRange('skOpa',  'vOpa',  'opa');

function reshuffle(){
  state.sk.layout = 'random';
  state.sk.seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) & 0x7fffffff;
  syncLayout(); render(); persist();
}

$('reset').addEventListener('click', function(){
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  // 按钮写着「清空」，那就真的清空文案，给一张干净的底
  state.text = '';
  state.hl = [];
  syncAll(); render(); persist(); toast('已清空');
});

function syncAll(){
  ta.value = state.text;
  skChar.value = state.sk.ch;
  paintThumbs(); syncTexture();
  $('skSize').value = Math.round(state.sk.size * 100); $('vSize').textContent = Math.round(state.sk.size * 100) + '%';
  $('skRot').value  = Math.round(state.sk.rot * 100);  $('vRot').textContent  = Math.round(state.sk.rot * 100) + '%';
  $('skOpa').value  = Math.round(state.sk.opa * 100);  $('vOpa').textContent  = Math.round(state.sk.opa * 100) + '%';
  syncBgRow(); syncHlRow(); syncFont(); syncBrush(); syncSkPresets(); syncLayout();
}

/* ==========================================================
   启动
   ========================================================== */
syncAll();
render();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
window.addEventListener('orientationchange', function(){ setTimeout(render, 260); });
document.addEventListener('gesturestart', function(e){ e.preventDefault(); });
})();
