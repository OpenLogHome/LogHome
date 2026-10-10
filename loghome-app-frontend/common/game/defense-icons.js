// Shared pixel sprites for the village map, toolbar and inventory.
// Every resource has an explicit silhouette; variants share the same material palette.
const aliases = {
  base: 'castle', dorm: 'house', warehouse: 'house', food: 'food', ground: 'farm', ug: 'basement',
  expedition: 'sword', raid: 'zombie', collect: 'log', upgrade: 'arrow', hammer: 'pickaxe',
  friends: 'house', journal: 'book', clock: 'clock', wall: 'wall',
  sand: 'quartz', plank: 'log', cobble: 'stonegen', stone: 'stonegen', blackstone: 'coal', charcoal: 'coal',
  rawIron: 'ingot', iron: 'ingot', steel: 'ingot', lapis: 'diamond', obsidian: 'coal',
  glass: 'quartz', bed: 'house', pumpkin: 'carrot', flint: 'flame', blazePowder: 'flame',
  netherite: 'coal', netherStar: 'star', wheat: 'wheat', potato: 'food', beetroot: 'carrot',
  melon: 'apple', sugarcane: 'farm', rawMeat: 'meat', chicken: 'meat', leather: 'leatherArmor',
  wool: 'quartz', egg: 'quartz', honeycomb: 'gold', bread: 'food', cookedFood: 'food',
  cake: 'food', goldenApple: 'gold', rotten: 'meat'
}
export function defenseIcon(name) {
  return '/static/icons/log-defense/' + (aliases[name] || name || 'rock') + '.svg'
}
