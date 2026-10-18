// Account-scoped in-memory working copy; durable progress lives on the game server.
const values=new Map();let changed=()=>{};
export const gameStorage={
 getItem:key=>values.has(key)?values.get(key):null,
 setItem(key,value){values.set(key,String(value));if(key!=='LogHomeUserInfo')changed();},
 removeItem(key){values.delete(key);changed();}
};
export function hydrate(state,user,onChange){values.clear();if(state)values.set('LogHomeArenaState',JSON.stringify(state));values.set('LogHomeUserInfo',JSON.stringify({user_id:user.id,name:user.name}));changed=onChange;}
export function snapshot(){const raw=gameStorage.getItem('LogHomeArenaState');return raw?JSON.parse(raw):null;}
