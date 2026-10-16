const composite = new Set(['customBlocks','customItems','customCreatures','modAssets','craftingRecipes','smeltingRecipes','fuels']);
function keyFor(store,value){return value[store==='saveList'?'key':composite.has(store)?'_compositeKey':'id'];}
function toBase64(bytes){let text='';for(let i=0;i<bytes.length;i+=32768)text+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(text);}
function fromBase64(value){const text=atob(value);return Uint8Array.from(text,c=>c.charCodeAt(0));}
export async function encode(value){
 if(value instanceof Uint8Array)return {__logMinecraftType:'bytes',data:toBase64(value)};
 if(value instanceof ArrayBuffer)return {__logMinecraftType:'bytes',data:toBase64(new Uint8Array(value))};
 if(value instanceof Blob)return {__logMinecraftType:'blob',mime:value.type,data:toBase64(new Uint8Array(await value.arrayBuffer()))};
 if(Array.isArray(value))return Promise.all(value.map(encode));
 if(value&&typeof value==='object')return Object.fromEntries(await Promise.all(Object.entries(value).map(async([k,v])=>[k,await encode(v)])));
 return value;
}
export function decode(value){
 if(value?.__logMinecraftType==='bytes')return fromBase64(value.data);
 if(value?.__logMinecraftType==='blob')return new Blob([fromBase64(value.data)],{type:value.mime});
 if(Array.isArray(value))return value.map(decode);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,decode(v)]));
 return value;
}
export class CloudStorage {
 constructor(request,status=()=>{}){this.request=request;this.status=status;this.stores=new Map();this.revision=0;this.queue=Promise.resolve();this.stopped=false;}
 async load(){const saved=await this.request('snapshot');this.revision=saved.revision;for(const[store,rows]of Object.entries(saved.state.stores)){this.stores.set(store,new Map(rows.map(raw=>{const value=decode(raw);return[keyFor(store,value),value];})));}}
 map(store){if(!this.stores.has(store))this.stores.set(store,new Map());return this.stores.get(store);}
 async snapshot(){return {schema:1,stores:Object.fromEntries(await Promise.all([...this.stores].map(async([name,rows])=>[name,await Promise.all([...rows.values()].map(encode))])))};}
 mutate(action){
  const run=this.queue.catch(()=>{}).then(async()=>{
   if(this.stopped)throw Error('存档已停止，请从原木重新打开游戏');
   const previous=new Map([...this.stores].map(([name,rows])=>[name,new Map(rows)]));
   try{await action();this.status('正在保存云存档…');const state=await this.snapshot();const saved=await this.request('snapshot',{method:'PUT',body:JSON.stringify({revision:this.revision,state})});this.revision=saved.revision;this.status('');return true;}
   catch(error){this.stores=previous;if(error.status===409||error.status===401)this.stopped=true;this.status(error.message+'；本次修改尚未保存，请在游戏内重试或重新打开。',true);throw error;}
  });this.queue=run;return run;
 }
 async getItem(store,key){return structuredClone(this.map(store).get(key)??null);}
 async getAllItems(store){return structuredClone([...this.map(store).values()]);}
 async getByIndex(store,index,value){return (await this.getAllItems(store)).filter(row=>row[index]===value);}
 setItem(store,value){return this.mutate(()=>{this.map(store).set(keyFor(store,value),structuredClone(value));});}
 setAllItems(store,values){return this.mutate(()=>{for(const value of values)this.map(store).set(keyFor(store,value),structuredClone(value));});}
 removeItem(store,key){return this.mutate(()=>this.map(store).delete(key));}
 removeAllItems(store,keys){return this.mutate(()=>{for(const key of keys)this.map(store).delete(key);});}
 removeByIndex(store,index,value){return this.mutate(()=>{for(const[key,row]of this.map(store))if(row[index]===value)this.map(store).delete(key);});}
 clearStore(store){return this.mutate(()=>this.map(store).clear());}
 async moveToTrash(id,entry){return this.mutate(()=>{const previous=this.map('saveList').get('trash')?.list||[];this.map('saveList').set('trash',{key:'trash',list:[structuredClone(entry),...previous]});this.map('saves').delete(id);});}
 restoreFromTrash(id,data){return this.mutate(()=>{this.map('saves').set(data.id,structuredClone(data));const trash=this.map('saveList').get('trash')?.list||[];this.map('saveList').set('trash',{key:'trash',list:trash.filter(row=>row.meta.id!==id)});});}
 clearAll(){return this.mutate(()=>this.stores.clear());}
 flush(){return this.queue;}
}
