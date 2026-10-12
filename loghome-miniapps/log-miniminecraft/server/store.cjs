const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const STORES = new Set(['saves','saveList','modPacks','customBlocks','customItems','customCreatures','modAssets','craftingRecipes','smeltingRecipes','fuels']);
class HttpError extends Error { constructor(status,message){super(message);this.status=status;} }
function validateState(state,maxBytes) {
 if(!state||typeof state!=='object'||Array.isArray(state)||state.schema!==1||!state.stores||typeof state.stores!=='object'||Array.isArray(state.stores))throw new HttpError(400,'Invalid save snapshot');
 let count=0;
 for(const [store,records] of Object.entries(state.stores)) {
  if(!STORES.has(store)||!Array.isArray(records))throw new HttpError(400,'Invalid save store');
  const ids=new Set();
  for(const record of records){const key=record?.[store==='saveList'?'key':(['saves','modPacks'].includes(store)?'id':'_compositeKey')];if(typeof key!=='string'||!key||key.length>512||ids.has(key))throw new HttpError(400,'Invalid or duplicate record key');ids.add(key);if(++count>100000)throw new HttpError(413,'Too many save records');}
 }
 const serialized=JSON.stringify(state);if(Buffer.byteLength(serialized)>maxBytes)throw new HttpError(413,'存档超过账号容量上限');return serialized;
}
class SaveStore {
 constructor(dir,maxBytes=50*1024*1024){this.dir=path.resolve(dir);this.maxBytes=maxBytes;this.locks=new Map();}
 file(user){if(!Number.isSafeInteger(user)||user<=0)throw new HttpError(400,'Invalid account');return path.join(this.dir,user+'.json');}
 async read(user){try{return JSON.parse(await fs.readFile(this.file(user),'utf8'));}catch(e){if(e.code==='ENOENT')return{revision:0,updatedAt:null,state:{schema:1,stores:{}}};throw e;}}
 async write(user,revision,state){
  if(!Number.isSafeInteger(revision)||revision<0)throw new HttpError(400,'Invalid revision');
  validateState(state,this.maxBytes);
  const previous=this.locks.get(user)||Promise.resolve();
  const operation=previous.catch(()=>{}).then(async()=>{
   const current=await this.read(user);if(current.revision!==revision)throw new HttpError(409,'存档已被另一窗口更新，请重新打开游戏');
   await fs.mkdir(this.dir,{recursive:true,mode:0o700});
   const result={revision:revision+1,updatedAt:new Date().toISOString(),state};
   const file=this.file(user),temp=file+'.'+crypto.randomUUID()+'.tmp';let handle;
   try {handle=await fs.open(temp,'wx',0o600);await handle.writeFile(JSON.stringify(result));await handle.sync();await handle.close();handle=null;
    if(current.revision>0)await fs.copyFile(file,file+'.bak');
    await fs.rename(temp,file);return result;
   }finally{await handle?.close();await fs.rm(temp,{force:true});}
  });
  this.locks.set(user,operation);try{return await operation;}finally{if(this.locks.get(user)===operation)this.locks.delete(user);}
 }
}
module.exports={SaveStore,HttpError,validateState};
