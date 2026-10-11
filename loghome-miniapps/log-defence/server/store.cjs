const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
function validateState(state) {
 if (!state || typeof state !== 'object' || Array.isArray(state)) throw new HttpError(400, 'Invalid save');
 if (typeof state.baseName !== 'string' || state.baseName.length > 48) throw new HttpError(400, 'Invalid base name');
 const v=state.village;
 if (!v || typeof v !== 'object' || Array.isArray(v) || !Number.isInteger(v.baseLevel) || v.baseLevel<0 || v.baseLevel>8) throw new HttpError(400,'Invalid village');
 for(const key of ['plots','ugPlots']) if(!Array.isArray(v[key]) || v[key].length!==9) throw new HttpError(400,'Invalid plots');
 if(!Array.isArray(v.villagers) || v.villagers.length>256) throw new HttpError(400,'Invalid villagers');
 if(!v.resources || typeof v.resources!=='object' || Array.isArray(v.resources) || Object.values(v.resources).some(n=>typeof n!=='number'||!Number.isFinite(n)||n<0)) throw new HttpError(400,'Invalid resources');
 function visit(value, depth=0) {
  if(depth>32) throw new HttpError(400,'Save too deep');
  if(typeof value==='number' && !Number.isFinite(value)) throw new HttpError(400,'Invalid number');
  if(value && typeof value==='object') for(const [key,child] of Object.entries(value)) {
   if(['__proto__','prototype','constructor'].includes(key)) throw new HttpError(400,'Invalid key');visit(child,depth+1);
  }
 }
 visit(state);if(Buffer.byteLength(JSON.stringify(state))>512*1024) throw new HttpError(413,'Save too large');
}
class JsonStore {
 constructor(directory) { this.directory=path.resolve(directory);this.locks=new Map(); }
 file(id) { if(!Number.isSafeInteger(id)||id<=0) throw new Error('Invalid verified user ID');return path.join(this.directory,`${id}.json`); }
 async read(id) {
  try { const value=JSON.parse(await fs.readFile(this.file(id),'utf8'));
   if(value.userId!==id || !Number.isSafeInteger(value.revision) || value.revision<1) throw new Error('Invalid stored envelope');
   validateState(value.state);return value;
  } catch(e) { if(e.code==='ENOENT') return {userId:id,revision:0,state:null};throw new HttpError(500,'Stored save is damaged; restore from backup'); }
 }
 async write(id, revision, state) {
  validateState(state);if(!Number.isSafeInteger(revision)||revision<0) throw new HttpError(400,'Invalid revision');
  const previous=this.locks.get(id)||Promise.resolve();
  const task=previous.catch(()=>{}).then(async()=>{
   const current=await this.read(id);if(current.revision!==revision) throw new HttpError(409,'Save conflict: reopen the game to load the latest progress');
   await fs.mkdir(this.directory,{recursive:true,mode:0o700});
   const file=this.file(id),tmp=file+`.${crypto.randomBytes(8).toString('hex')}.tmp`;
   const next={schemaVersion:1,userId:id,revision:revision+1,updatedAt:new Date().toISOString(),state};
   try {
    const handle=await fs.open(tmp,'wx',0o600);try {await handle.writeFile(JSON.stringify(next));await handle.sync();}finally{await handle.close();}
    if(current.revision) await fs.copyFile(file,file+'.bak');
    await fs.rename(tmp,file);return next;
   } finally {await fs.rm(tmp,{force:true});}
  });
  this.locks.set(id,task);try{return await task;}finally{if(this.locks.get(id)===task)this.locks.delete(id);}
 }
}
module.exports={JsonStore,HttpError,validateState};
