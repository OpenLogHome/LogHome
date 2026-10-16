// Inventory tooltips outlive the panel, so unmounting a hovered slot cannot be
// relied on to deliver mouseleave. All panel modes share these lifecycle paths.
function patchInventory(source) {
 const start=source.indexOf('const InventoryUI=reactExports.forwardRef(');
 const end=source.indexOf('commandRegistry=new Map',start);
 if(start<0||end<0)throw Error('Inventory lifecycle boundary changed');
 let inventory=source.slice(start,end);
 for(const [before,after]of [
  ['containerState.barrelPos=null,l(!1),S(!1)', 'containerState.barrelPos=null,_(null),l(!1),S(!1)'],
  ['mt=reactExports.useCallback((J,ee,ke)=>{containerState.isOpen=!0', 'mt=reactExports.useCallback((J,ee,ke)=>{_(null),containerState.isOpen=!0']
 ]){
  if(inventory.split(before).length!==2)throw Error('Inventory hover boundary changed: '+before);
  inventory=inventory.replace(before,after);
 }
 return source.slice(0,start)+inventory+source.slice(end);
}
module.exports={patchInventory};
