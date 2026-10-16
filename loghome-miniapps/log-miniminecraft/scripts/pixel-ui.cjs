// The export has no React source tree. Adapt DOM JSX at creation time (never
// observe/mutate the live DOM), keeping refs, event handlers, keys and geometry.
function logPixelProps(type, props) {
 if (!props || typeof type !== 'string' || !/^(div|span|p|h[1-6]|button|input|textarea|select|label|section|header|footer|nav|ul|li|a|progress)$/.test(type)) return props;
 const original = props.style || {}, style = {...original}, classes = ['mc-ui'];
 const background = String(original.background || original.backgroundColor || '');
 const full = original.position === 'fixed' && original.inset === 0;
 const image = /url\(/.test(background) || /url\(/.test(original.backgroundImage || '');
 const micro = parseFloat(original.height) <= 6;
 const surface = !image && !micro && background && background !== 'transparent' && (original.borderRadius !== undefined || original.backdropFilter || /gradient/.test(background));
 if (surface) {
  const alpha = background.match(/rgba\([^)]*,\s*([\d.]+)\)/);
  classes.push(full ? (alpha && +alpha[1] < .9 ? 'mc-overlay' : 'mc-screen') : 'mc-panel');
 }
 const button = type === 'button' || (original.cursor === 'pointer' && props.onClick && !full);
 if (button) {
  classes.push('mc-button');
  if (/4fc3f7|2196f3|4caf50|2e7d32|00bcd4|76,\s*175,\s*80|33,\s*150,\s*243/.test(background)) classes.push('mc-accent');
  if (/f44336|e53935|ef4444|ff5252|244,\s*67,\s*54/.test(background)) classes.push('mc-danger');
 }
 if (original.position === 'absolute' && original.backgroundColor === 'white' && original.width === '18px' && original.height === '18px') classes.push('mc-switch-thumb');
 if (['input','textarea','select'].includes(type)) classes.push('mc-input');
 if (props['data-slot-index'] !== undefined && original.width && original.height) {
  classes.push('mc-slot');
  // Derive selection from the existing stateful border; do not introduce state.
  if (/4caf50|76,\s*175,\s*80/.test(original.border || '')) classes.push('mc-slot-selected');
  if (/2196f3/.test(original.border || '')) classes.push('mc-slot-target');
 }
 if (original.touchAction === 'none' && original.borderRadius === '50%' && type === 'div' && !full) classes.push('mc-stick');
 if (original.borderRadius === '50%' && /rgba\(255,\s*255,\s*255,\s*0\.[68]\)/.test(background) && parseFloat(original.width) <= 60) classes.push('mc-stick-thumb');
 if (original.pointerEvents === 'none' && original.position === 'fixed' && background && original.maxWidth) classes.push('mc-tooltip');
 if (props['aria-pressed'] === true || props['aria-selected'] === true) classes.push('mc-selected');
 // Keep semantic colour on tiny bars, status text and thumbnails. Only known
// cyan/blue interface accents change to the warmer Minecraft palette.
 if (/^#(4fc3f7|00bcd4|8cddff|38bdf8)$/i.test(style.color || '')) style.color = '#e7d99b';
 if (style.backdropFilter) style.backdropFilter = 'none';
 if (style.WebkitBackdropFilter) style.WebkitBackdropFilter = 'none';
 if (style.borderRadius !== undefined) style.borderRadius = 0;
 if (style.boxShadow) style.boxShadow = 'none';
 if (style.textShadow) style.textShadow = '2px 2px 0 #20201e';
 const result = {...props, className: [props.className, ...classes].filter(Boolean).join(' '), style};
 // Keep keyboard/focus order consistent with the pause menu's visual order.
 if (props.className === 'pause-settings-scroll' && Array.isArray(props.children)) {
  const heading = child => child?.props?.className?.includes('mc-pause-heading');
  const actions = child => child?.props?.className?.includes('mc-pause-actions');
  result.children = [...props.children.filter(heading), ...props.children.filter(actions), ...props.children.filter(child=>!heading(child)&&!actions(child))];
 }
 const labels = {'pause-button':'暂停游戏','jump-button':'跳跃 / 上升','sneak-button':'潜行 / 下降','fog-toggle-pause':'雾效','auto-jump-toggle-pause':'自动跳跃','water-reflection-toggle-pause':'水面反射','light-shadows-toggle-pause':'光源阴影','chunk-load-toggle-pause':'加载区块','chunk-unload-toggle-pause':'卸载区块','show-body-toggle-pause':'显示身体','collision-toggle-pause':'碰撞体显示'};
 if (labels[props['data-testid']]) result['aria-label'] = labels[props['data-testid']];
 if (type === 'button' && /toggle-pause$/.test(props['data-testid'] || '') && original.width === '44px') {
  result.role = 'switch';
  result['aria-checked'] = /4fc3f7/.test(background);
 }
 return result;
}

function logCreatePixelRuntime(runtime) {
 const wrapped = {...runtime};
 for (const method of ['jsx','jsxs']) {
  const create = runtime[method];
  wrapped[method] = (type, props, key) => create(type, logPixelProps(type, props), key);
 }
 return wrapped;
}

// A shared 16 × 16 grid: solid cells, no stroked curves, no extra image requests.
function logPixelIconNode(name, fallback) {
 const cache = logPixelIconNode.cache || (logPixelIconNode.cache = Object.create(null));
 if (cache[name]) return cache[name];
 const shapes = {
  pause: ['M4 3h3v10H4zM10 3h3v10h-3z'],
  play: ['M4 2h2v1h2v2h2v2h2v2h-2v2H8v2H6v1H4z'],
  up: ['M7 2h2v2h2v2h2v2H9v6H7V8H3V6h2V4h2z'],
  down: ['M7 2h2v6h4v2h-2v2H9v2H7v-2H5v-2H3V8h4z'],
  sneak: ['M6 1h4v4H6zM4 6h6v4h3v4h-2v-2H8v-2H6v4H4V9H2V7h2z'],
  check: ['M2 8h2v2h2V8h2V6h2V4h2V2h2v4h-2v2h-2v2H8v2H6v2H4v-2H2z'],
  x: ['M2 2h2v2h2v2h4V4h2V2h2v2h-2v2h-2v4h2v2h2v2h-2v-2h-2v-2H6v2H4v2H2v-2h2v-2h2V6H4V4H2z'],
  plus: ['M6 2h4v4h4v4h-4v4H6v-4H2V6h4z'],
  chat: ['M2 2h12v10H6v2H4v-2H2zM4 4v6h8V4z'],
  settings: ['M6 1h4v2h3v3h2v4h-2v3h-3v2H6v-2H3v-3H1V6h2V3h3zM6 6v4h4V6z'],
  save: ['M2 1h10v2h2v12H2zM4 2v4h7V2zM4 9v5h8V9z'],
  trash: ['M5 1h6v2h3v2H2V3h3zM3 6h10v8H3zM5 7v5h2V7zM9 7v5h2V7z'],
  box: ['M2 2h12v12H2zM4 4v8h8V4zM6 2h4v5H6z'],
  world: ['M4 1h8v2h2v2h1v6h-1v2h-2v2H4v-2H2v-2H1V5h1V3h2zM4 3v3h3v4h3v3h2V9h2V6h-4V3z'],
  tree: ['M6 1h4v2h2v2h2v6H9v4H7v-4H2V5h2V3h2z'],
  user: ['M5 1h6v6H5zM3 9h10v6H3z'],
  users: ['M2 2h5v5H2zM9 2h5v5H9zM1 9h6v6H1zM9 9h6v6H9z'],
  sun: ['M7 0h2v3H7zM7 13h2v3H7zM0 7h3v2H0zM13 7h3v2h-3zM2 2h2v2H2zM12 2h2v2h-2zM2 12h2v2H2zM12 12h2v2h-2zM5 5h6v6H5z'],
  moon: ['M6 1h4v2H7v6h2v2h5v2h-2v2H5v-2H3v-2H1V5h2V3h3z'],
  cloud: ['M5 3h6v2h3v2h1v6H1V7h2V5h2z'],
  water: ['M7 1h2v3h2v3h2v5h-2v2H5v-2H3V7h2V4h2z'],
  zap: ['M7 1h6L9 7h4l-2 3H9l-2 5H5l2-6H3z'],
  heart: ['M2 2h4v2h4V2h4v2h1v5h-2v2h-2v2H9v2H7v-2H5v-2H3V9H1V4h1z'],
  food: ['M5 2h6v2h3v7h-3v2H6v2H2v-4h3V9H3V5h2z'],
  eye: ['M4 3h8v2h2v2h2v2h-2v2h-2v2H4v-2H2V9H0V7h2V5h2zM4 5v6h8V5zM6 6h4v4H6z'],
  grid: ['M1 1h4v4H1zM6 1h4v4H6zM11 1h4v4h-4zM1 6h4v4H1zM6 6h4v4H6zM11 6h4v4h-4zM1 11h4v4H1zM6 11h4v4H6zM11 11h4v4h-4z'],
  tool: ['M9 1h5v2h-3v3h3V3h2v5h-6v2H8v2H6v2H4v2H1v-3h2v-2h2V9h2V7h2z'],
  sword: ['M12 1h3v3h-2v2h-2v2H9v2H7v2l2 2-2 2-3-3-2 2-2-2 2-2-2-2 2-2 2 2 2-2h2V5h2V3h2z'],
  fire: ['M7 1h2v3h2v3h2v6h-2v2H5v-2H3V7h2v3h2z'],
  gamepad: ['M3 3h10v2h2v9h-4v-2H5v2H1V5h2zM4 5v2H2v2h2v2h2V9h2V7H6V5zM11 6h2v2h-2zM9 9h2v2H9z'],
  arrow: ['M6 2h2v2H6v2H4v1h10v2H4v1h2v2h2v2H6v-2H4v-2H2V6h2V4h2z'],
  send: ['M1 1h2v1h3v1h3v1h3v1h3v2h-2v2h-2v2H9v2H7v2H5V9H1zM5 7v2h2V7h2V5H7v2z'],
  lock: ['M4 1h8v6h2v8H2V7h2zM6 3v4h4V3zM7 9v4h2V9z'],
  flag: ['M2 1h2v14H2zM4 2h10v7H4z'],
  clock: ['M4 1h8v2h2v2h1v6h-1v2h-2v2H4v-2H2v-2H1V5h1V3h2zM4 3v2H3v6h1v2h8v-2h1V5h-1V3zM7 4h2v4h3v2H7z'],
  info: ['M6 1h4v3H6zM6 6h4v9H6z'],
  refresh: ['M4 2h7v2h2V2h2v6H9V6h2V4H5v2H3v5h2v2h6v-2h2v2h-2v2H4v-2H2v-2H1V6h1V4h2z'],
  dots: ['M6 1h4v3H6zM6 6h4v3H6zM6 11h4v3H6z'],
  folder: ['M1 2h6v2h8v10H1zM3 6v6h10V6z'],
  image: ['M1 1h14v14H1zM3 3v8h2V9h2V7h2v2h2v2h2V3zM4 4h3v3H4z'],
  dice: ['M1 1h14v14H1zM3 3v3h3V3zM10 3v3h3V3zM6 6v4h4V6zM3 10v3h3v-3zM10 10v3h3v-3z'],
  crosshair: ['M7 0h2v5H7zM7 11h2v5H7zM0 7h5v2H0zM11 7h5v2h-5zM7 7h2v2H7z'],
  crown: ['M1 3h2v2h2V3h2V1h2v2h2v2h2V3h2v10H1zM3 11h10V9H3z'],
  terminal: ['M1 2h14v12H1zM3 4v2h2v2H3v2h2V8h2V6H5V4zM8 10h5V8H8z']
  ,copy: ['M1 1h10v2H3v8H1zM5 5h10v10H5zM7 7v6h6V7z']
  ,helmet: ['M4 2h8v2h2v10h-4v-4H6v4H2V4h2z']
  ,armor: ['M1 2h4v2h6V2h4v5h-3v8H4V7H1z']
  ,leggings: ['M3 1h10v14H9V7H7v8H3z']
  ,boots: ['M2 2h4v8h2v5H1v-5h1zM10 2h4v8h1v5H9v-5h1z']
  ,animal: ['M1 2h3v2h8V2h3v11H1zM3 6h2v2H3zM11 6h2v2h-2zM6 9v2h4V9z']
 };
 const aliases = {'message-circle':'chat','settings-2':'settings','trash-2':'trash','package':'box','archive':'box','database':'save','map':'world','map-pin':'flag','gamepad-2':'gamepad','accessibility':'user','gauge':'clock','cloud-fog':'cloud','cloud-sun':'cloud','sunset':'sun','droplets':'water','square-pen':'tool','sparkles':'sun','hash':'grid','grid-3x3':'grid','arrow-left':'arrow','chevron-right':'arrow','chevrons-up':'up','download':'down','upload':'up','log-out':'send','folder-open':'folder','ellipsis-vertical':'dots','loader':'refresh','refresh-cw':'refresh','rotate-ccw':'refresh','lock-open':'lock','triangle-alert':'info','maximize-2':'grid','move':'crosshair','dice-5':'dice'};
 const paths = shapes[aliases[name] || name];
 if (!paths) return fallback;
 return cache[name] = paths.map((d, i) => ['path', {d, transform:'scale(1.5)', fill:'currentColor', fillRule:'evenodd', stroke:'none', shapeRendering:'crispEdges', key:'pixel-'+i}]);
}

function logPixelText(text) {
 // Called only for static UI literals patched below, never player/chat/save text.
 if (typeof text !== 'string') return text;
 const names = {'⬆':'up','⬇':'down','🤫':'sneak','🎮':'gamepad','⚙':'settings','💾':'save','🗑':'trash','📦':'box','🌍':'world','🌐':'world','🌳':'tree','🌲':'tree','☀':'sun','🌙':'moon','☁':'cloud','🌊':'water','⚡':'zap','❤':'heart','🍖':'food','👁':'eye','🔧':'tool','⛏':'tool','⚔':'sword','🔥':'fire','💬':'chat','👤':'user','👥':'users','📱':'gamepad','📋':'save','📜':'save','📥':'down','📤':'up','✅':'check','✓':'check','✕':'x','✗':'x','❌':'x','⚠':'info','✨':'sun','🎲':'dice','🖼':'image','🧱':'box','🪵':'tree','🚩':'flag','🪖':'helmet','👕':'armor','👖':'leggings','👢':'boots','💡':'sun','🔔':'info','🎨':'tool','✏':'tool','🧩':'box','📅':'clock','🔄':'refresh','💨':'cloud','🌧':'cloud','🌤':'sun','⛈':'zap','❄':'cloud','🌱':'tree','🌿':'tree','🍃':'tree','➕':'plus','📚':'save','📝':'save','🚪':'send','💎':'box','🏃':'user','👆':'up','🔼':'up','🔽':'down','🔒':'lock','🔊':'chat','🔨':'tool','🪓':'tool','🗺':'world','🗃':'folder','📭':'folder','📷':'image','🐾':'animal'};
 return String(text).split(/([\u{1F300}-\u{1FAFF}\u2600-\u27BF\u2B00-\u2BFF]\uFE0F?)/u).filter(Boolean).map((part, i) => {
  if (!/^[\u{1F300}-\u{1FAFF}\u2600-\u27BF\u2B00-\u2BFF]/u.test(part)) return part;
  const key = part.replace(/\uFE0F/g,''), icon = names[key] || (/[\u{1F400}-\u{1F43E}]/u.test(key) ? 'animal' : 'box');
  return reactExports.createElement('svg', {key:i, className:'mc-pixel-icon', viewBox:'0 0 24 24', 'aria-hidden':true, focusable:false}, ...logPixelIconNode(icon, []).map(([type, attrs]) => reactExports.createElement(type, attrs)));
 });
}

function patchPixelUi(source) {
 function replace(before, after) {
  if (source.split(before).length !== 2) throw Error('Pixel UI boundary changed: '+before);
  source = source.replace(before, after);
 }
 replace('var jsxRuntimeExports=requireJsxRuntime(),','var jsxRuntimeExports=logCreatePixelRuntime(requireJsxRuntime()),');
 replace('iconNode:e,className:mergeClasses(', 'iconNode:logPixelIconNode(n,e),className:mergeClasses(');
 replace('style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",padding:"16px 4px 12px"','className:"mc-pause-heading",style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",padding:"16px 4px 12px"');
 replace('style:{padding:"0 0 16px 0",display:"flex",flexDirection:"column",gap:"8px"}','className:"mc-pause-actions",style:{padding:"0 0 16px 0",display:"flex",flexDirection:"column",gap:"8px"}');
 replace('children:m?`📦 ${m.name}${m.id===DEFAULT_MOD_PACK_ID?" （只读）":""}`:"🧩 模组"','children:m?[logPixelText("📦 "),m.name,m.id===DEFAULT_MOD_PACK_ID?" （只读）":""]:logPixelText("🧩 模组")');
 // Remove the animated title's CSS blur, gradient clipping and frame callback.
 const start=source.indexOf('function GradientText('), end=source.indexOf('const startScreenBg=',start);
 if(start<0||end<0)throw Error('Pixel title boundary changed');
 source=source.slice(0,start)+'function GradientText({children:n}){return jsxRuntimeExports.jsx("span",{className:"mc-title",children:n})}'+source.slice(end);
 const emoji=/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\u2B00-\u2BFF]/u;
 source=source.replace(/children:("(?:\\.|[^"\\])*")/g,(whole,literal)=>emoji.test(literal)?'children:logPixelText('+literal+')':whole);
 // Conditional HUD labels and adjacent static strings in child arrays.
 for(const [before,after]of [
  ['children:e?"⬇️":"🤫"','children:logPixelText(e?"⬇️":"🤫")'],
 ])replace(before,after);
 source=source.replace(/(children:\[)("(?:\\.|[^"\\])*")(?=[,\]])/g,(whole,prefix,literal)=>emoji.test(literal)?prefix+'logPixelText('+literal+')':whole);
 source=source.replace(/children:(!?[\w$.]+(?:===?(?:"(?:\\.|[^"\\])*"|[\w$.]+)|[<>]=?\d+)?\?("(?:\\.|[^"\\])*"):("(?:\\.|[^"\\])*"))/g,(whole,expression)=>emoji.test(expression)?'children:logPixelText('+expression+')':whole);
 source=source.replace(/children:(!?[\w$.]+)&&("(?:\\.|[^"\\])*")/g,(whole,condition,literal)=>emoji.test(literal)?'children:'+condition+'&&logPixelText('+literal+')':whole);
 // Resource/mod icon fields are display metadata, never names or chat content.
 source=source.replace(/children:([\w$.]+\.icon)(?=[,}])/g,'children:logPixelText($1)');
 // Equipment placeholder icons, and the furnace's two static state labels.
 const inventoryStart=source.indexOf('const InventoryUI='),inventoryEnd=source.indexOf('commandRegistry=new Map',inventoryStart);
 if(inventoryStart<0||inventoryEnd<0)throw Error('Pixel inventory boundary changed');
 let inventory=source.slice(inventoryStart,inventoryEnd);
 inventory=inventory.replaceAll('children:ke})','children:logPixelText(ke)})').replace('children:Pe.burnTime>0?"🔥":"💨"','children:logPixelText(Pe.burnTime>0?"🔥":"💨")');
 source=source.slice(0,inventoryStart)+inventory+source.slice(inventoryEnd);
 return source+'\n'+[logPixelProps,logCreatePixelRuntime,logPixelIconNode,logPixelText].map(fn=>fn.toString()).join('\n')+'\n';
}
module.exports={patchPixelUi,logPixelProps,logPixelIconNode};
