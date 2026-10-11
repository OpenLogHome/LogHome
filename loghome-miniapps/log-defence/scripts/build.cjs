const fs=require('node:fs/promises');const path=require('node:path');const esbuild=require('esbuild');const sass=require('sass');
const root=path.resolve(__dirname,'..');
(async()=>{
 const out=path.join(root,'dist');await fs.rm(out,{recursive:true,force:true});await fs.mkdir(out,{recursive:true});await fs.cp(path.join(root,'public'),out,{recursive:true});
 const source=await fs.readFile(path.join(root,'src/Game.vue'),'utf8');const style=source.match(/<style[^>]*>([\s\S]*?)<\/style>/)[1];
 const css=sass.compileString(style,{loadPaths:[path.join(root,'src')],silenceDeprecations:['import','global-builtin','color-functions','legacy-js-api']}).css.replace(/(-?\d*\.?\d+)rpx\b/g,(_,n)=>`calc(var(--rpx) * ${n})`);
 await fs.writeFile(path.join(out,'game.css'),css);
 await esbuild.build({entryPoints:[path.join(root,'src/main.js')],bundle:true,minify:true,outfile:path.join(out,'app.js'),define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'vue-sfc',setup(build){build.onLoad({filter:/Game\.vue$/},async args=>{const s=await fs.readFile(args.path,'utf8');const template=s.match(/<template>([\s\S]*?)<\/template>\s*<script>/)[1];const script=s.match(/<script>([\s\S]*?)<\/script>/)[1].replace('export default','const component =');return {contents:script+'\ncomponent.template='+JSON.stringify(template)+';\nexport default component;',resolveDir:path.dirname(args.path),loader:'js'};});}}]});
 await fs.writeFile(path.join(out,'index.html'),'<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="referrer" content="no-referrer"><title>原木保卫战</title><link rel="stylesheet" href="game.css"><link rel="stylesheet" href="app.css"></head><body><div id="status">正在连接原木社区…</div><div id="app"></div><script src="app.js"></script></body></html>');console.log('Built standalone game into dist/');
})().catch(e=>{console.error(e);process.exit(1)});
