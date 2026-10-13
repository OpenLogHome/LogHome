const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http');
const {build}=require('../scripts/build.cjs'),{createServer}=require('../server/index.cjs');
const {GAME_BUNDLE,validateStaticAssets}=require('../server/static-assets.cjs');
const {checkDeployment}=require('../scripts/check-deployment.cjs');
test('failed module imports distinguish deployment errors from game runtime errors',async()=>{
 const source=fs.readFileSync(path.join(__dirname,'../src/bootstrap.js'),'utf8');
 const handler=source.match(/\.catch\((async error=>\{[\s\S]*?\n  \})\);/)[1];
 const original=new Error('game initialization error');
 for(const [status,type,expected]of [[404,'application/json',/HTTP 404/],[200,'text/html',/响应类型错误/],[200,'text/javascript',original]]){
  const diagnose=require('node:vm').runInNewContext('('+handler+')',{URL,AbortSignal,Error,base:new URL('https://example.test/log-miniminecraft/'),fetch:async()=>({ok:status===200,status,headers:{get:()=>type}})});
  await assert.rejects(diagnose(original),expected===original?error=>error===original:expected);
 }
});
test('clean build serves the module imported by bootstrap and detects a removed deployed bundle',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'miniminecraft-deploy-')),output=path.join(dir,'dist');
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));build(output);
 const server=createServer({publicDir:output,dataDir:path.join(dir,'players')});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const base=`http://127.0.0.1:${server.address().port}/log-miniminecraft/`;
 assert.equal(await checkDeployment(base),base);
 const bootstrap=await (await fetch(base+'bootstrap.js')).text();
 const entry=bootstrap.match(/await import\('([^']+)'\)/)[1];
 const response=await fetch(new URL(entry,base));assert.equal(response.status,200);
 assert.match(response.headers.get('content-type'),/javascript/);
 assert.match(await response.text(),/clientExports\.createRoot\(rootElement\)/);
 fs.unlinkSync(path.join(output,GAME_BUNDLE));
 await assert.rejects(checkDeployment(base),/index-B8uuzVI-\.js: HTTP 404/);
 assert.throws(()=>createServer({publicDir:output,dataDir:path.join(dir,'players')}),/Incomplete MiniMinecraft build/);
});
test('public source assets cannot be mistaken for a complete production build',()=>{
 assert.throws(()=>validateStaticAssets(path.join(__dirname,'../public')),/Run npm run build/);
});
test('deployment check rejects HTML fallbacks returned with HTTP 200 for JavaScript',async t=>{
 const server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end('<html>fallback</html>')});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));
 await assert.rejects(checkDeployment(`http://127.0.0.1:${server.address().port}/log-miniminecraft/`),/bootstrap\.js: HTTP 200, text\/html/);
});
