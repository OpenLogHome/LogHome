const {HttpError}=require('./store.cjs');
async function authorizeWithLoghome(ticket, baseUrl, options={}) {
 let base;try{base=new URL(baseUrl);}catch{throw new HttpError(503,'原木鉴权服务地址配置错误');}if(!['https:','http:'].includes(base.protocol)) throw new HttpError(503,'原木鉴权服务地址配置错误');
 const requestFetch=options.fetch||fetch;
 async function request(route,stage,requestOptions={}) {
  for(let attempt=0;attempt<2;attempt++) {
   let response;
   try {response=await requestFetch(new URL(route,base),{...requestOptions,redirect:'error',signal:AbortSignal.timeout(options.timeoutMs||10000)});}
   catch(error) {
    if(attempt===0)continue;
    const timeout=['TimeoutError','AbortError'].includes(error.name);
    const failure=new HttpError(timeout?504:502,timeout?'原木账号验证超时，请重新加载重试':'无法连接原木鉴权服务，请检查游戏服务器网络和 LOGHOME_API_URL');
    failure.diagnostic={stage,code:error.cause?.code||error.name};throw failure;
   }
   if(!response.ok) {
    if(response.status>=500&&attempt===0){await response.body?.cancel();continue;}
    const failure=new HttpError([400,401,403].includes(response.status)?401:502,[400,401,403].includes(response.status)?'原木登录票据无效或已过期，请重新加载':'原木鉴权服务暂不可用，请稍后重新加载');
    failure.diagnostic={stage,upstreamStatus:response.status};throw failure;
   }
   try {return await response.json();}
   catch {const failure=new HttpError(502,'原木鉴权服务返回了无效数据，请检查 LOGHOME_API_URL');failure.diagnostic={stage,code:'INVALID_JSON'};throw failure;}
  }
 }
 const exchange=await request('/users/token_by_cross_site?token='+encodeURIComponent(ticket),'exchange');
 const token=exchange?.token?.tk;if(!token) throw new HttpError(401,'原木登录票据无效或已过期，请重新加载');
 const profile=await request('/users/userprofile','profile',{headers:{Authorization:token}});
 const id=Number(profile?.user_id);if(!Number.isSafeInteger(id)||id<=0) throw new HttpError(401,'原木账号验证失败，请重新加载');
 return {id,name:String(profile.name||'原木玩家'),isAdmin:profile.is_admin===1};
}

module.exports={authorizeWithLoghome};
