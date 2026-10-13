const {STARTUP_ASSETS}=require('../server/static-assets.cjs');
async function checkDeployment(address){
 const base=new URL(address);if(!['http:','https:'].includes(base.protocol))throw Error('Use an HTTP(S) deployment URL');
 if(!base.pathname.endsWith('/'))base.pathname+='/';base.search='';base.hash='';
 const failures=[];
 for(const asset of STARTUP_ASSETS){
  const url=new URL(asset,base);
  try{
   const response=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(15000)});
   const type=response.headers.get('content-type')||'';
   const expected=asset.endsWith('.js')?/(?:java|ecma)script/i:asset.endsWith('.css')?/text\/css/i:/text\/html/i;
   if(!response.ok||!expected.test(type)||response.headers.get('content-length')==='0')failures.push(`${url.href}: HTTP ${response.status}, ${type}`);
  }catch(error){failures.push(`${url.href}: ${error.message}`)}
 }
 if(failures.length)throw Error('部署资源检查失败：\n'+failures.join('\n'));
 return base.href;
}
if(require.main===module){const address=process.argv[2];if(!address){console.error('Usage: npm run check:deployment -- https://miniapps.loghome.ink/log-miniminecraft/');process.exitCode=1}else checkDeployment(address).then(base=>console.log('部署启动资源检查通过：'+base)).catch(error=>{console.error(error.message);process.exitCode=1})}
module.exports={checkDeployment};
