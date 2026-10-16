const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {logPixelProps,logPixelIconNode,patchPixelUi}=require('../scripts/pixel-ui.cjs');
test('pixel UI keeps touch geometry, handlers, refs and player text without mutating React props',()=>{
 const handler=()=>{},ref={current:null},style={position:'fixed',bottom:'64px',right:'20px',width:'70px',height:'70px',transform:'translateX(5px)',touchAction:'none',borderRadius:'50%',backdropFilter:'blur(8px)',backgroundColor:'rgba(76, 175, 80, 0.6)'};
 const props={ref,onTouchStart:handler,children:'玩家 🎮 自定义名称',style,'data-testid':'jump-button'},result=logPixelProps('button',props);
 assert.equal(result.ref,ref);assert.equal(result.onTouchStart,handler);assert.equal(result.children,props.children);
 for(const key of ['bottom','right','width','height','transform','touchAction'])assert.equal(result.style[key],style[key]);
 assert.equal(result.style.backdropFilter,'none');assert.equal(result.style.borderRadius,0);
 assert.equal(style.backdropFilter,'blur(8px)');assert.equal(style.borderRadius,'50%');
 assert.equal(logPixelProps('canvas',props),props);assert.equal(logPixelProps('img',props),props);
 const graphics={props:{className:'quality'}},heading={props:{className:'mc-pause-heading'}},actions={props:{className:'mc-pause-actions'}};
 const children=[graphics,heading,actions];
 assert.deepEqual(logPixelProps('div',{className:'pause-settings-scroll',children}).children,[heading,actions,graphics]);
 assert.deepEqual(children,[graphics,heading,actions]);
});
test('selected slots and switches retain state, while drag wrappers do not become extra slots',()=>{
 const props={'data-slot-index':0,style:{width:'38px',height:'38px',border:'2px solid #4caf50'}};
 assert.match(logPixelProps('div',props).className,/mc-slot-selected/);
 assert.doesNotMatch(logPixelProps('div',{'data-slot-index':0}).className,/mc-slot/);
 for(const [backgroundColor,checked]of [['#4fc3f7',true],['rgba(255,255,255,.15)',false]]){
  const result=logPixelProps('button',{'data-testid':'fog-toggle-pause',style:{width:'44px',backgroundColor}});
  assert.equal(result.role,'switch');assert.equal(result['aria-checked'],checked);assert.equal(result['aria-label'],'雾效');
 }
});
test('all exported Lucide controls use solid pixel geometry',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../vendor/game.bundle.js'),'utf8');
 for(const [,name]of source.matchAll(/createLucideIcon\("([^"]+)"/g)){
  const nodes=logPixelIconNode(name,null);assert.ok(nodes?.length,name);
  for(const [type,attrs]of nodes){assert.equal(type,'path');assert.equal(attrs.shapeRendering,'crispEdges');assert.equal(attrs.stroke,'none')}
 }
 assert.throws(()=>patchPixelUi('export {}'),/boundary changed/);
});
