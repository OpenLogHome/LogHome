/**
 * 村庄建造系统数据配置（原木保卫战）
 * 依据 village-building-design.md 录入：
 * - 12 种建筑的等级表（TH 需求 / 建造材料 / 产出 / 工位）
 * - 大本营 1-8 级升级材料与前置条件
 * - 各大本营等级的建筑数量上限
 * - 资源表（九类常规资源 + 绿宝石特殊货币）
 * 中英文名直接内置于配置，组件按 $i18n.locale 取用。
 */

// ---------------- 资源 ----------------
export const RESOURCES = {
	// 木材
	log: { zh: '原木', en: 'Log', cat: 'wood' },
	plank: { zh: '木板', en: 'Plank', cat: 'wood' },
	// 石材
	cobble: { zh: '圆石', en: 'Cobblestone', cat: 'stone' },
	stone: { zh: '石头', en: 'Stone', cat: 'stone' },
	blackstone: { zh: '黑石', en: 'Blackstone', cat: 'stone' },
	// 矿物金属
	charcoal: { zh: '木炭', en: 'Charcoal', cat: 'mineral' },
	rawIron: { zh: '粗铁', en: 'Raw Iron', cat: 'mineral' },
	iron: { zh: '铁锭', en: 'Iron Ingot', cat: 'mineral' },
	gold: { zh: '金锭', en: 'Gold Ingot', cat: 'mineral' },
	diamond: { zh: '钻石', en: 'Diamond', cat: 'mineral' },
	// 特殊矿物
	lapis: { zh: '青金石', en: 'Lapis Lazuli', cat: 'special' },
	obsidian: { zh: '黑曜石', en: 'Obsidian', cat: 'special' },
	// 功能杂项
	sand: { zh: '沙子', en: 'Sand', cat: 'misc' },
	glass: { zh: '玻璃', en: 'Glass', cat: 'misc' },
	bed: { zh: '床', en: 'Bed', cat: 'misc' },
	book: { zh: '书本', en: 'Book', cat: 'misc' },
	pumpkin: { zh: '南瓜', en: 'Pumpkin', cat: 'misc' },
	flint: { zh: '打火石', en: 'Flint & Steel', cat: 'misc' },
	// 下界材料
	blazePowder: { zh: '烈焰粉', en: 'Blaze Powder', cat: 'nether' },
	quartz: { zh: '石英', en: 'Quartz', cat: 'nether' },
	netherite: { zh: '下界合金锭', en: 'Netherite Ingot', cat: 'nether' },
	netherStar: { zh: '下界之星', en: 'Nether Star', cat: 'nether' },
	// 农产品
	wheat: { zh: '小麦', en: 'Wheat', cat: 'farm' },
	carrot: { zh: '胡萝卜', en: 'Carrot', cat: 'farm' },
	potato: { zh: '马铃薯', en: 'Potato', cat: 'farm' },
	beetroot: { zh: '甜菜根', en: 'Beetroot', cat: 'farm' },
	melon: { zh: '西瓜', en: 'Melon Slice', cat: 'farm' },
	sugarcane: { zh: '甘蔗', en: 'Sugarcane', cat: 'farm' },
	apple: { zh: '苹果', en: 'Apple', cat: 'farm' },
	// 畜产品
	rawMeat: { zh: '生肉', en: 'Raw Meat', cat: 'ranch' },
	chicken: { zh: '生鸡肉', en: 'Raw Chicken', cat: 'ranch' },
	leather: { zh: '皮革', en: 'Leather', cat: 'ranch' },
	wool: { zh: '羊毛', en: 'Wool', cat: 'ranch' },
	milk: { zh: '牛奶', en: 'Milk', cat: 'ranch' },
	egg: { zh: '鸡蛋', en: 'Egg', cat: 'ranch' },
	// 加工食品
	bread: { zh: '面包', en: 'Bread', cat: 'food' },
	cake: { zh: '蛋糕', en: 'Cake', cat: 'food' },
	goldenApple: { zh: '金苹果', en: 'Golden Apple', cat: 'food' },
	// 药水（酿造室各类药水合并计数）
	potion: { zh: '药水', en: 'Potion', cat: 'brew' },
	// 装备（村民可装备：武器加战力、盔甲减夜袭受伤；产线待接，暂用开发者控制台发放）
	woodSword: { zh: '木剑', en: 'Wooden Sword', cat: 'equip' },
	stoneSword: { zh: '石剑', en: 'Stone Sword', cat: 'equip' },
	ironSword: { zh: '铁剑', en: 'Iron Sword', cat: 'equip' },
	diamondSword: { zh: '钻石剑', en: 'Diamond Sword', cat: 'equip' },
	leatherArmor: { zh: '皮革甲', en: 'Leather Armor', cat: 'equip' },
	ironArmor: { zh: '铁甲', en: 'Iron Armor', cat: 'equip' },
	diamondArmor: { zh: '钻石甲', en: 'Diamond Armor', cat: 'equip' },
	// 特殊货币
	emerald: { zh: '绿宝石', en: 'Emerald', cat: 'currency' },
	rotten: { zh: '腐肉', en: 'Rotten Flesh', cat: 'misc' }
}

// ---------------- 食物：饱食/心情/食用优先级 ----------------
// 村民饱食低于 EAT_THRESHOLD 自动进食：优先吃 tier 最低的食物（省着高级食物涨心情），
// 腐肉优先级最低（其他食物耗尽才吃），食用后进入饥饿buff：额外饱食消耗持续 hunger 小时
export const FOODS = {
	rotten:      { sat: 20, mood: -8, tier: 0, hunger: 6 },
	chicken:     { sat: 10, mood: -4, tier: 1 },
	rawMeat:     { sat: 12, mood: -4, tier: 1 },
	beetroot:    { sat: 10, mood: 2,  tier: 2 },
	melon:       { sat: 10, mood: 3,  tier: 2 },
	carrot:      { sat: 15, mood: 2,  tier: 2 },
	potato:      { sat: 15, mood: 2,  tier: 2 },
	apple:       { sat: 20, mood: 4,  tier: 3 },
	bread:       { sat: 40, mood: 6,  tier: 3 },
	cake:        { sat: 80, mood: 15, tier: 5 },
	goldenApple: { sat: 100, mood: 30, tier: 6 }
}
// 饱食低于该值自动进食
export const EAT_THRESHOLD = 30
// 饥饿buff期间的额外饱食消耗/小时
export const HUNGER_EXTRA = 4
// 心情效率：平均心情 > MOOD_GOOD 产出 +15%，< MOOD_BAD 产出 -15%
export const MOOD_GOOD = 80
export const MOOD_BAD = 30
export const MOOD_FACTOR = 0.15

// ---------------- 村民装备 ----------------
// 三种装备位：武器（民兵参战，Σ 攻击计入夜袭战力）/ 盔甲（夜袭受伤减免）/ 回复（金苹果·药水，点击装备位即使用回血）
// 名称/图标字/颜色取 RESOURCES 同名条目；装备即从仓库移入村民，卸下/村民死亡返还仓库
export const EQUIP_SLOTS = [
	{ key: 'weapon', zh: '武器', en: 'Weapon' },
	{ key: 'armor', zh: '盔甲', en: 'Armor' },
	{ key: 'restore', zh: '回复', en: 'Restore' }
]
export const EQUIP_ITEMS = {
	woodSword: { slot: 'weapon', atk: 5 },
	stoneSword: { slot: 'weapon', atk: 12 },
	ironSword: { slot: 'weapon', atk: 25 },
	diamondSword: { slot: 'weapon', atk: 50 },
	leatherArmor: { slot: 'armor', def: 4 },
	ironArmor: { slot: 'armor', def: 12 },
	diamondArmor: { slot: 'armor', def: 25 },
	goldenApple: { slot: 'restore', heal: 50 },
	potion: { slot: 'restore', heal: 30 }
}

// 装备耐久（点）：材料档次越高越耐久；远征/传送门驻守按小时磨损，归零即损毁不返还。
// 磨损速率：远征 = 路线损毁率 ×100 点/h；传送门驻守 = PORTAL_WORK.wearPerH 点/h。
// 卸下/村内死亡返还视为入库整修，耐久重置为满（装备时按满值重新计）。
export const EQUIP_DUR = {
	woodSword: 60, stoneSword: 130, ironSword: 260, diamondSword: 520,
	leatherArmor: 60, ironArmor: 200, diamondArmor: 400
}
// 下界传送门驻守危险：队员每小时生命损耗 / 装备磨损（点）
export const PORTAL_WORK = { hpPerH: 2, wearPerH: 2 }

// ---------------- 合成台（参照 Minecraft 工作台配方） ----------------
// 只收「仓库可存材料」的配方：无工作台配方的材料搁置（圆石→石头走窑炉燃料、沙→玻璃/粗铁→铁锭
// 走铁匠铺熔炼、下界材料走远征产出、药水走酿造室，均不入合成台）。
// 武器在 MC 中为 2 材料 + 1 木棍，本游戏无木棍 → 用木板替代（木剑整体简化为 4 木板）。
export const CRAFT_RECIPES = [
	{ id: 'plank', in: { log: 1 }, out: { plank: 4 } },
	{ id: 'woodSword', in: { plank: 4 }, out: { woodSword: 1 } },
	{ id: 'stoneSword', in: { cobble: 2, plank: 1 }, out: { stoneSword: 1 } },
	{ id: 'ironSword', in: { iron: 2, plank: 1 }, out: { ironSword: 1 } },
	{ id: 'diamondSword', in: { diamond: 2, plank: 1 }, out: { diamondSword: 1 } },
	{ id: 'leatherArmor', in: { leather: 8 }, out: { leatherArmor: 1 } },
	{ id: 'ironArmor', in: { iron: 8 }, out: { ironArmor: 1 } },
	{ id: 'diamondArmor', in: { diamond: 8 }, out: { diamondArmor: 1 } },
	{ id: 'bed', in: { wool: 3, plank: 3 }, out: { bed: 1 } },
	{ id: 'book', in: { leather: 1, sugarcane: 3 }, out: { book: 1 } },
	{ id: 'goldenApple', in: { gold: 8, apple: 1 }, out: { goldenApple: 1 } },
	{ id: 'cake', in: { milk: 3, egg: 1, wheat: 3, sugarcane: 2 }, out: { cake: 1 } }
]

// ---------------- 建筑 ----------------
// levels[i] 为第 i+1 级：th = 大本营需求，cost = 建造/升级材料
// slots = 各级工位数；prod = 各级每小时产出（kitchen 特殊：面包消耗小麦）
// occ = 各级占地格数（缺省 1）：升到多格等级需占用相邻空地，收纳/拆除后释放
// desc = 各级功能描述（无产出的建筑用）
export const BUILDINGS = [
	{
		key: 'dorm', zh: '村民住所', en: 'Villager House', char: '住', color: '#C59A67', isDorm: true,
		slots: [0, 0, 0, 0, 0, 0],
		levels: [
			{ th: 1, cost: { log: 30, plank: 20 }, cap: 1 },
			{ th: 2, cost: { plank: 60, cobble: 50 }, cap: 2 },
			{ th: 3, cost: { stone: 80, iron: 30, glass: 20 }, cap: 4 },
			{ th: 5, cost: { stone: 150, iron: 80, bed: 10 }, cap: 8 },
			{ th: 7, cost: {gold: 35, emerald: 50}, cap: 16 },
			{ th: 7, cost: { diamond: 80, emerald: 150, netherite: 10 }, cap: 32 }
		]
	},
	{
		key: 'lumber', zh: '伐木场', en: 'Lumber Mill', char: '木', color: '#8B5E34',
		slots: [1, 2, 2, 3, 4], occ: [1, 1, 1, 1, 2], workerZh: '伐木工', workerEn: 'Lumberjack',
		levels: [
			{ th: 1, cost: { log: 50, plank: 30 }, prod: { log: 60, apple: 10 } },
			{ th: 1, cost: { plank: 100, iron: 20 }, prod: { log: 120, apple: 20 } },
			{ th: 3, cost: { stone: 150, iron: 60 }, prod: { log: 220, apple: 40 } },
			{ th: 5, cost: {iron: 180, gold: 20}, prod: { log: 400, apple: 70 } },
			{ th: 6, cost: {gold: 40, diamond: 9}, prod: { log: 700, apple: 120 } }
		]
	},
	{
		key: 'stonegen', zh: '刷石机', en: 'Cobble Generator', char: '石', color: '#7D7D7D',
		slots: [1, 2, 2, 3, 4], occ: [1, 1, 1, 1, 2], workerZh: '采石工', workerEn: 'Miner',
		levels: [
			{ th: 1, cost: { cobble: 60, log: 30 }, prod: { cobble: 80 } },
			{ th: 1, cost: { cobble: 120, iron: 25 }, prod: { cobble: 160, stone: 20 } },
			{ th: 4, cost: { stone: 250, iron: 90 }, prod: { cobble: 300, stone: 60 } },
			{ th: 5, cost: {iron: 200, gold: 20}, prod: { cobble: 550, stone: 120, rawIron: 8 } },
			{ th: 7, cost: {gold: 45, diamond: 10}, prod: { cobble: 900, stone: 240, blackstone: 30, rawIron: 15 } }
		]
	},
	{
		key: 'farm', zh: '农田', en: 'Farm', char: '农', color: '#7CBD56',
		slots: [1, 2, 3, 3, 4], occ: [1, 1, 1, 2, 2], workerZh: '农夫', workerEn: 'Farmer',
		levels: [
			{ th: 1, cost: { plank: 40, cobble: 30 }, prod: { wheat: 100 } },
			{ th: 2, cost: { plank: 80, iron: 20 }, prod: { wheat: 140, carrot: 80 } },
			{ th: 3, cost: { stone: 140, iron: 50, sand: 30 }, prod: { wheat: 200, carrot: 110, potato: 80, sugarcane: 20 } },
			{ th: 4, cost: { stone: 250, iron: 100 }, prod: { wheat: 260, carrot: 150, potato: 110, beetroot: 60, melon: 40 } },
			{ th: 6, cost: {gold: 40, diamond: 7}, prod: { wheat: 520, carrot: 300, potato: 220, beetroot: 120, melon: 80, sugarcane: 40, pumpkin: 40 } }
		]
	},
	{
		key: 'ranch', zh: '牧场', en: 'Ranch', char: '牧', color: '#D0A35C',
		slots: [1, 1, 2, 2, 3], occ: [1, 1, 1, 2, 2], workerZh: '牧民', workerEn: 'Herder',
		levels: [
			{ th: 2, cost: { plank: 100, cobble: 80, wheat: 100 }, prod: { rawMeat: 60, leather: 15 } },
			{ th: 2, cost: { cobble: 150, iron: 30 }, prod: { rawMeat: 80, leather: 20, wool: 30 } },
			{ th: 3, cost: { stone: 180, iron: 70 }, prod: { rawMeat: 100, leather: 25, wool: 40, chicken: 40, egg: 25 } },
			{ th: 5, cost: { stone: 300, iron: 150 }, prod: { rawMeat: 150, leather: 38, wool: 60, chicken: 60, egg: 38, milk: 30 } },
			{ th: 7, cost: {gold: 50, emerald: 60}, prod: { rawMeat: 300, leather: 75, wool: 120, chicken: 120, egg: 75, milk: 60 } }
		]
	},
	{
		key: 'smith', zh: '铁匠铺', en: 'Smithy', char: '铁', color: '#B06239',
		slots: [1, 2, 2, 3, 3], workerZh: '铁匠', workerEn: 'Blacksmith',
		levels: [
			{ th: 2, cost: { cobble: 100, log: 60, charcoal: 20 }, prod: { charcoal: 20, iron: 10, glass: 5 }, consumes: { log: 20 }, desc: '原木→木炭，熔炼粗铁→铁锭；沙子→玻璃' },
			{ th: 2, cost: { stone: 120, iron: 40 }, prod: { charcoal: 30, iron: 15, glass: 8 }, consumes: { log: 30 }, desc: '效率+50%' },
			{ th: 3, cost: { stone: 220, iron: 120 }, prod: { charcoal: 50, iron: 25, glass: 12 }, consumes: { log: 50 }, desc: '效率+66%' },
			{ th: 5, cost: {iron: 250, gold: 30, diamond: 5}, prod: { charcoal: 70, iron: 35, glass: 18 }, consumes: { log: 70 }, desc: '解锁砂轮：返还附魔经验' },
			{ th: 6, cost: {gold: 55, diamond: 15}, prod: { charcoal: 90, iron: 50, glass: 25 }, consumes: { log: 90 }, desc: '解锁锻造台：下界合金锭升级装备' }
		]
	},
	{
		key: 'watchtower', zh: '瞭望塔', en: 'Watchtower', char: '塔', color: '#8F8F94',
		slots: [1, 2, 2, 3, 3], workerZh: '弓箭手', workerEn: 'Archer',
		levels: [
			{ th: 2, cost: { cobble: 80, log: 40 }, atk: 10, def: 20, desc: '驻守弓箭村民，抵御僵尸夜袭' },
			{ th: 2, cost: { stone: 100, iron: 30 }, atk: 18, def: 35, desc: '射程+1格，伤害提升' },
			{ th: 4, cost: { stone: 200, iron: 100 }, atk: 30, def: 55, desc: '解锁铁傀儡组装台（铁锭×36+南瓜×1）' },
			{ th: 5, cost: {iron: 250, gold: 30}, atk: 50, def: 85, desc: '可组装2尊铁傀儡，塔顶伤害×2' },
			{ th: 7, cost: {gold: 55, diamond: 15}, atk: 80, def: 130, desc: '解锁雪傀儡哨戒，夜袭强度减半' }
		]
	},
	{
		key: 'kitchen', zh: '厨房', en: 'Kitchen', char: '厨', color: '#D08A5C',
		slots: [1, 1, 2, 2, 3], workerZh: '厨师', workerEn: 'Cook',
		levels: [
			{ th: 3, cost: { plank: 120, cobble: 100, iron: 30 }, prod: { bread: 10 }, consumes: { wheat: 30 }, desc: '制作面包（小麦×3→面包）' },
			{ th: 3, cost: { stone: 150, iron: 60 }, prod: { bread: 15 }, consumes: { wheat: 45 }, desc: '制作汤类，村民效率+10%' },
			{ th: 4, cost: { stone: 250, iron: 100 }, prod: { bread: 25, cake: 3 }, consumes: { wheat: 85 }, desc: '制作蛋糕、派，村民心情解锁' },
			{ th: 5, cost: {iron: 200, gold: 25}, prod: { bread: 35, cake: 5, goldenApple: 0.5 }, consumes: { wheat: 120 }, desc: '制作金苹果（金锭×8+苹果）' },
			{ th: 7, cost: {gold: 55, emerald: 80}, prod: { bread: 50, cake: 8, goldenApple: 1 }, consumes: { wheat: 170 }, desc: '制作附魔金苹果（需下界材料）' }
		]
	},
	{
		key: 'heal', zh: '治疗站', en: 'Healing Station', char: '医', color: '#E08E8E',
		slots: [1, 1, 2, 2, 2], workerZh: '医师', workerEn: 'Healer',
		levels: [
			{ th: 4, cost: { stone: 200, iron: 80, wool: 30 }, desc: '治疗1名受伤村民/小时' },
			{ th: 4, cost: { stone: 300, iron: 120 }, desc: '治疗2人/小时，恢复腐化村民' },
			{ th: 5, cost: { iron: 250, gold: 80, goldenApple: 5 }, desc: '治疗铁傀儡，解除中毒/凋零' },
			{ th: 6, cost: {gold: 45, diamond: 10}, desc: '治疗速度×2，村民最大生命+20%' },
			{ th: 7, cost: {diamond: 20, emerald: 100}, desc: '复活阵亡村民（绿宝石×20/人）' }
		]
	},
	{
		key: 'brew', zh: '酿造室', en: 'Brewing Room', char: '酿', color: '#A06AD0',
		slots: [1, 1, 2, 2, 2], workerZh: '酿造师', workerEn: 'Brewer',
		levels: [
			{ th: 5, cost: { stone: 300, iron: 150, blazePowder: 5 }, prod: { potion: 2 }, desc: '酿造治疗药水、夜视药水' },
			{ th: 5, cost: { stone: 400, gold: 80 }, prod: { potion: 4 }, desc: '酿造力量/迅捷药水（供瞭望塔驻军）' },
			{ th: 6, cost: { gold: 150, diamond: 30 }, prod: { potion: 7 }, desc: '酿造抗火药水（下界远征必备）' },
			{ th: 6, cost: {diamond: 20, emerald: 80}, prod: { potion: 10 }, desc: '酿造再生/缓降药水' },
			{ th: 7, cost: {diamond: 30, netherite: 5}, prod: { potion: 15 }, desc: '酿造幸运药水：全村产出+25%（1小时）' }
		]
	},
	{
		key: 'enchant', zh: '附魔台', en: 'Enchanting Table', char: '附', color: '#5C6BD0',
		slots: [1, 1, 1, 2, 2], workerZh: '附魔师', workerEn: 'Enchanter',
		levels: [
			{ th: 6, cost: { diamond: 10, obsidian: 20, book: 15 }, desc: '附魔 I 级：工具/武器/护甲' },
			{ th: 6, cost: { diamond: 30, emerald: 60 }, desc: '附魔 II 级，解锁书架增益' },
			{ th: 7, cost: { diamond: 60, lapis: 100 }, desc: '附魔 III 级，村民可穿戴附魔装备' },
			{ th: 7, cost: { emerald: 150, netherite: 10 }, desc: '附魔 IV 级，铁傀儡附魔（荆棘）' },
			{ th: 8, cost: { emerald: 250, netherStar: 1 }, desc: '附魔 V 级，解锁经验修补' }
		]
	},
	{
		key: 'portal', zh: '下界传送门', en: 'Nether Portal', char: '门', color: '#6B4BB8',
		slots: [2, 2, 3, 3, 4], workerZh: '远征队员', workerEn: 'Expeditioner',
		levels: [
			{ th: 4, cost: { obsidian: 14, flint: 1, emerald: 200 }, prod: { quartz: 2, blazePowder: 0.5 }, desc: '开启下界远征（每次消耗打火石耐久）；队员驻守缓慢产出下界材料，每小时 -2 生命、装备磨损 2 点' },
			{ th: 7, cost: { obsidian: 28, diamond: 80 }, prod: { quartz: 4, blazePowder: 1, obsidian: 0.3 }, desc: '远征次数×3，解锁下界要塞探索；驻守产出提升' },
			{ th: 8, cost: { netherite: 20, netherStar: 1 }, prod: { quartz: 6, blazePowder: 2, obsidian: 0.6, netherite: 0.1 }, desc: '远征次数×5；驻守产下界合金碎片' }
		]
	},
	{
		key: 'basement', zh: '地下室入口', en: 'Basement Entrance', char: '地', color: '#6B4B36',
		slots: [0, 0, 0, 0, 0], workerZh: '', workerEn: '',
		levels: [
			{ th: 3, cost: { log: 100, cobble: 100 }, desc: '开启地下层，可清理碎石扩展地下空间', descEn: 'Opens the underground level. Clear rubble to expand it' }
		]
	}
]

export const BUILDING_MAP = BUILDINGS.reduce((m, b) => { m[b.key] = b; return m }, {})

// ---------------- 大本营升级表（index = 当前等级，升到 index+1） ----------------
export const TH_LEVELS = [
	// TH0：初始状态，什么都不解锁；升至 TH1 时发放初始物资
	{ cost: {}, req: [], unlockZh: '发放初始物资，开放建造', unlockEn: 'Starting supplies granted, building unlocked' },
	{ cost: { log: 150, cobble: 150 }, req: [['lumber', 2], ['stonegen', 2]], unlockZh: '铁匠铺、瞭望塔、牧场', unlockEn: 'Smithy, Watchtower, Ranch' },
	{ cost: { plank: 250, stone: 200, iron: 50 }, req: [['smith', 2], ['watchtower', 2]], unlockZh: '厨房', unlockEn: 'Kitchen' },
	{ cost: { stone: 350, iron: 150, charcoal: 100 }, req: [['kitchen', 2], ['dorm', 3]], unlockZh: '治疗站、下界传送门', unlockEn: 'Healing Station, Nether Portal' },
	{ cost: { iron: 300, gold: 100, diamond: 20 }, req: [['heal', 2], ['ranch', 3]], unlockZh: '酿造室', unlockEn: 'Brewing Room' },
	{ cost: { gold: 250, diamond: 50, emerald: 100 }, req: [['brew', 2], ['watchtower', 4]], unlockZh: '附魔台', unlockEn: 'Enchanting Table' },
	{ cost: { diamond: 100, emerald: 200, netherite: 10 }, req: [['enchant', 2], ['kitchen', 4]], unlockZh: '下界要塞探索', unlockEn: 'Nether Fortress route' },
	{ cost: { emerald: 400, netherite: 30, netherStar: 1 }, req: [['portal', 1], ['dorm', 6]], unlockZh: '全建筑等级上限提升', unlockEn: 'All building level caps raised' }
]

// ---------------- 各大本营等级建筑数量上限（TH1-8） ----------------
// 每种建筑全图仅可建造 1 座
const QUOTA_ONE = [1, 1, 1, 1, 1, 1, 1, 1]
export const TH_QUOTA = {
	dorm: QUOTA_ONE,
	watchtower: QUOTA_ONE,
	lumber: QUOTA_ONE,
	stonegen: QUOTA_ONE,
	smith: QUOTA_ONE,
	farm: QUOTA_ONE,
	ranch: QUOTA_ONE,
	kitchen: QUOTA_ONE,
	heal: QUOTA_ONE,
	brew: QUOTA_ONE,
	enchant: QUOTA_ONE,
	portal: QUOTA_ONE,
	basement: QUOTA_ONE
}

// ---------------- 地下层 ----------------
// 只能建在地上、无法放置到地下的建筑
export const GROUND_ONLY = ['lumber', 'farm', 'ranch', 'dorm', 'watchtower', 'basement']
// 地下空地清理：花费绿宝石 + 等待清理时间（默认仅入口正下方 1 格可用，其余 8 格待清理）
export const UG_CLEAR_COST = { emerald: 10 }
export const UG_CLEAR_MIN = 30

// ---------------- 建筑收纳 ----------------
// 把已建建筑收进仓库腾出地块：首次免费，之后每次花费绿宝石；
// 收纳的建筑（保留等级/耐久/囤积）随时可在「建筑列表」里重新放置（放置免费）
export const STORAGE_COST = { emerald: 20 }

// ---------------- 大本营防御力（index = 大本营等级） ----------------
export const BASE_DEF = [0, 20, 35, 55, 85, 130, 200, 300, 450]

// ---------------- 城墙（环绕九宫格一圈，共 16 段，逐段建造/升级/修补） ----------------
// 每段独立等级与耐久；防御力按 耐久/100 折算计入村庄总防御；
// 修补：1 点耐久 = 圆石×1
export const WALL = {
	zh: '城墙', en: 'Wall', char: '墙',
	// 三档材质：木 → 石 → 铁（name/char/color 随材质展示）
	levels: [
		{ name: '木墙', nameEn: 'Wooden Wall', char: '木', th: 1, cost: { log: 60 }, def: 8, color: '#9A6B3F' },
		{ name: '石墙', nameEn: 'Stone Wall', char: '石', th: 2, cost: { stone: 80, cobble: 40 }, def: 20, color: '#8A8A8A' },
		{ name: '铁墙', nameEn: 'Iron Wall', char: '铁', th: 4, cost: { iron: 60, stone: 120 }, def: 40, color: '#AEB6C2' }
	]
}
// 城墙段数：4 段整边（index 0=上 1=右 2=下 3=左），每段横贯一边，四角由上下两段包边自动融合
export const WALL_RING_NUM = 4

// ---------------- 僵尸夜袭强度（index = 大本营等级），随大本营升级提高 ----------------
export const ZOMBIE_POWER = [0, 10, 16, 24, 34, 46, 60, 78, 100]

// ---------------- 僵尸夜袭 ----------------
// 北京时间 18:00 ~ 次日 06:00；掉落进临时仓库，最多累积 8 小时收益，超出部分丢弃
// 攻击力越大掉落越多；夜袭同时损耗防御设施耐久（防御力越高损耗越慢）
export const RAID = {
	startHour: 18,
	endHour: 6,
	tempMaxHours: 8,
	rottenBase: 6,       // 无防御时的腐肉基础掉落 / 小时
	rottenPerPower: 1.2, // 每点攻击力加成 / 小时（攻击力 = Σ 瞭望塔 atk × 驻军 × 耐久）
	ironBase: 0.05,      // 铁锭小概率掉落期望 / 小时
	ironPerPower: 0.005,
	bookBase: 0.1,       // 书本小概率掉落期望 / 小时
	flintBase: 0.04,     // 打火石小概率掉落期望 / 小时（1 个 = 8 次远征耐久）
	lapisBase: 0.02,     // 青金石小概率掉落期望 / 小时
	wearTower: 2,        // 瞭望塔耐久损耗 / 小时（夜袭期间）
	wearBase: 1.5,       // 大本营耐久损耗 / 小时（夜袭期间）
	wearWall: 2,         // 每段城墙耐久损耗 / 小时（夜袭期间，仅已建段）
	villDmg: 8,          // 村民每小时受伤上限（僵尸强度完全压制防御时）；实际伤害 = 上限 × 强度占比
	baseLoss: 2,         // 大本营耐久被打穿时损失的村民数（瞭望塔被打穿则驻军全灭）
	// ---- 尸潮预告（每晚小概率：某时刻起强度增幅的尸潮自东/西方向来袭）----
	forecastChance: 0.3,    // 每晚出现尸潮预告的概率（进夜袭窗口后判定一次）
	forecastHour: 20,       // 尸潮来袭时间（北京时间，自该时刻起当夜持续到窗口结束）
	forecastMultMin: 1.5,   // 尸潮强度增幅下限（×基础僵尸强度）
	forecastMultMax: 2.0,   // 上限
	hordeWallWear: 3,       // 预告方向城墙的额外耐久损耗/小时（尸潮时段内）
	breachBuildDmg: 12,     // 预告城墙被攻破：全部建筑耐久削减（大本营另计）
	breachBaseDmg: 18,      // 预告城墙被攻破：大本营耐久削减
	breachVillDmg: 15,      // 预告城墙被攻破：每名在村村民受伤（远征中的除外）
	breachDebuffHours: 24,  // 消极怠工时长
	breachDebuffMul: 0.7    // 消极怠工期间产出倍率
}

// ---------------- 夜袭挑战模式 ----------------
// 玩家可选开启（每晚 22:00 开波前）：共 7 波尸潮按时间表来袭，强度阶梯上升；
// 每波固定北京时间 22:00 开战，相邻波次间隔一天（次日晚十点），最后两波仅隔一小时。
// 每波「防守表现」= 我方战防 ÷（该波强度 + 我方战防），表现越好稀有掉落越多（<0.25 只有腐肉垫底）。
// TH ≥ bossTh 时第七波替换为血潮 Boss（有名字/血条，击杀有首杀奖励，窗口结束未击杀则逃跑并受罚）。
export const RAID_WAVES = {
	count: 7,
	startHour: 22,        // 每波固定北京时间 22:00 开战
	dayInterval: 1,       // 相邻波次间隔一天（次日 22:00 下一波）
	lastGapMin: 60,       // 最后两波（第六、七波）间隔一小时
	mults: [0.6, 0.8, 1.05, 1.3, 1.6, 1.9, 2.2], // 各波强度 = 基础僵尸强度 × 倍率（第 7 波 TH 达标时为 Boss）
	perfGood: 0.6,        // 防守表现 ≥ 此值拿满该波稀有掉落
	perfBad: 0.25,        // 低于此值只有腐肉垫底
	bossTh: 7,            // 大本营达到该等级后第七波替换为血潮 Boss
	bossHpPerPower: 2,    // Boss 血量 = 基础僵尸强度 × 该系数
	bossNames: ['猩红伯爵', '血月屠夫', '腐潮君王', '赤瞳猎手', '哀嚎血兽'],
	firstKill: { netherStar: 1, emerald: 150 }, // 血潮首杀奖励（全局一次性）
	// 每波基础稀有掉落（实际数量 × 防守表现）
	loot: [
		{ charcoal: 6, iron: 2 },
		{ charcoal: 8, iron: 3, quartz: 2 },
		{ iron: 5, quartz: 4, gold: 1 },
		{ quartz: 6, gold: 2, obsidian: 2 },
		{ gold: 4, obsidian: 3, diamond: 1 },
		{ obsidian: 5, diamond: 2, blazePowder: 2 },
		{ diamond: 5, blazePowder: 8, netherite: 2 }
	]
}

// ---------------- 下界远征 ----------------
// 三条危险度递增的路线：派出村民远征，按时长结算奖励；可提前召回（奖励 = 已进行比例 × EXP_RECALL_RATIO）
// 出发按「每名村民 × 时长」一次性支付口粮（饱食度，按食物优先级折算仓库食物）
// risk = 每名村民每小时受伤（受盔甲减免）；wear = 武器/盔甲每小时损毁概率；回复位物品在受伤时有概率被用掉（抵消伤害）
// loot = 每名村民每小时的基础掉落期望（结算时 ±15% 随机浮动）
export const EXPEDITION_ROUTES = [
	{
		key: 'ashPath', danger: 1, th: 4,
		zh: '灰烬小径', en: 'Ashen Path',
		partyMin: 1, partyMax: 4,
		hours: [2, 4, 8],
		satPerHour: 4, risk: 2, wear: 0.02,
		guardExp: 5,
		loot: { quartz: 0.4, charcoal: 1.2, gold: 0.12, obsidian: 0.1 }
	},
	{
		key: 'lavaCross', danger: 2, th: 6,
		zh: '熔岩渡口', en: 'Lava Crossing',
		partyMin: 2, partyMax: 6,
		hours: [4, 8, 12],
		satPerHour: 5, risk: 4, wear: 0.025,
		guardExp: 8,
		loot: { quartz: 0.9, gold: 0.4, obsidian: 0.3, diamond: 0.12, blazePowder: 0.12 }
	},
	{
		key: 'fortress', danger: 3, th: 7,
		zh: '下界要塞', en: 'Nether Fortress',
		partyMin: 3, partyMax: 8,
		hours: [8, 12, 24],
		satPerHour: 6, risk: 3.5, wear: 0.03,
		guardExp: 12,
		loot: { blazePowder: 0.5, quartz: 1.2, diamond: 0.25, netherite: 0.07, netherStar: 0.004 }
	}
]
export function expRoute(key) {
	return EXPEDITION_ROUTES.find(r => r.key === key) || null
}

// ---------------- 村民职业轨道（经验/等级） ----------------
// 劳作 = 伐木场/采石场，技工 = 厨房/铁匠铺/附魔台：在岗工作每小时涨经验；
// 护卫 = 瞭望塔驻军：经验只在下界远征中获取（route.guardExp × 小时）
export const VILL_TRACKS = {
	labor: { zh: '劳作', en: 'Labor', builds: ['lumber', 'stonegen'], expH: 10 },
	tech: { zh: '技工', en: 'Artisan', builds: ['kitchen', 'smith', 'enchant'], expH: 10 },
	guard: { zh: '护卫', en: 'Guard', builds: ['watchtower'], expH: 0 }
}
// 建筑类型 → 所属轨道（无所属返回 null）
export function trackOfBuild(type) {
	for (const key in VILL_TRACKS) { if (VILL_TRACKS[key].builds.indexOf(type) >= 0) return key }
	return null
}
// 各级累计经验阈值（index = level - 1），满级 5：Lv2 100 / Lv3 250 / Lv4 500 / Lv5 1000
export const TRACK_LV_EXP = [0, 100, 250, 500, 1000]
// 累计经验 → 当前等级
export function trackLevel(exp) {
	let lv = 1
	for (let i = 1; i < TRACK_LV_EXP.length; i++) { if (exp >= TRACK_LV_EXP[i]) lv = i + 1 }
	return lv
}
// 每级效率加成：该村民所在工位产出 +5% ×（等级 - 1），Lv5 = +20%（按小队均值并入产出效率）
export const TRACK_LV_BONUS = 0.05
export function trackBonus(lv) { return TRACK_LV_BONUS * (Math.max(1, lv) - 1) }
// 护卫等级的远征收益：减伤（并入受伤减免分母）+15/级，战利品 +6% × 队伍平均加成系数
export const GUARD_EXPED = { dmgDefPerLv: 15, lootPerLv: 0.06 }


// 产出效率：基础产出 ×（30% + 70% × 已用工位 ÷ 总工位）
export function efficiency(used, total) {
	if (total <= 0) return 0.3
	return 0.3 + 0.7 * Math.min(1, used / total)
}

// ---------------- 产出囤积（部落冲突式收集） ----------------
// 有产出的建筑不直接入库，产出囤积在建筑内，玩家点击收集后才转入仓库
// 囤积上限 = 满编每小时产出 × COLLECT_CAP_HOURS（超出不累计，离线挂机囤满即停）
export const COLLECT_CAP_HOURS = 2

// 一键收集解锁的大本营等级（此前隐藏该入口）
export const QUICK_COLLECT_TH = 5

export function collectCap(def, level) {
	const cur = def && def.levels[level - 1]
	if (!cur || !cur.prod) return null
	const cap = {}
	Object.keys(cur.prod).forEach(id => { cap[id] = Math.ceil(cur.prod[id] * COLLECT_CAP_HOURS) })
	return cap
}

// ---------------- 建造/升级耗时（秒，参照部落冲突：等级越高耗时越久） ----------------
// 建筑第 n 级的建造/升级耗时（新建 = Lv1；升级到 Lv.n 用同一曲线）
export const BUILD_TIME = [60, 180, 600, 1800, 7200, 14400]
export function buildTimeSec(level) {
	return BUILD_TIME[(level || 1) - 1] || BUILD_TIME[BUILD_TIME.length - 1]
}
// 大本营升级耗时（index = 目标等级，Lv1 无需建造；城墙参照部落冲突为瞬时，不计时）
export const TH_BUILD_TIME = [0, 0, 120, 600, 1800, 3600, 7200, 14400]
export function thBuildTimeSec(level) {
	return TH_BUILD_TIME[level] || 0
}

// ---------------- 建筑工工位 ----------------
// 大本营等级决定建筑工数量（index = 大本营等级）：
// 同时施工（新建 / 升级 / 大本营升级）的总数不得超过工位数；
// 工位占满后新任务自动排队，工位空出后按下单顺序自动开工（材料下单时扣除）。
export const BUILDER_SLOTS = [0, 1, 2, 2, 3, 3, 4, 4, 5]
export function builderSlots(th) {
	return BUILDER_SLOTS[th || 1] || 1
}

// ---------------- 铁匠铺燃料 ----------------
// 燃料值由原木/木炭转化而来（木炭转化值更高，对齐 MC 燃烧值），铁匠铺产出消耗燃料值；
// 燃料池不足时按玩家选定的燃料来源（默认木炭）自动转化补足
// 铁匠铺合成配方：产出 1 个所需材料（玻璃=沙子烧制、铁锭=粗铁熔炼，MC 配方；床已移至合成台）
export const SMITH_CRAFT = {
	glass: { sand: 1 },
	iron: { rawIron: 1 }
}
// 流浪商人：每天随机时刻到访、停留 hours 小时；售卖列表 goods（stock 每日库存、cost 单价结算）
export const TRADER = { hours: 6, goods: [{ id: 'sand', stock: 24, cost: { charcoal: 5 } }] }
// 打火石耐久：1 个打火石 = 8 次远征
export const FLINT_DUR = 8

export const FUEL_VALUE = { log: 2, charcoal: 8 }
export const FUEL_COST = { charcoal: 1, iron: 2, glass: 1 } // 每产出 1 个消耗的燃料值
export const FUEL_ADD_NUM = 10                              // 手动「补充燃料」一次转化的燃料个数

// ---------------- 堆叠上限（我的世界规则） ----------------
// 默认 64/组；个别物品按 MC 逻辑覆盖：鸡蛋 16、蛋糕/床/牛奶/打火石不可堆叠（按 1 计），
// 药水在 MC 中不可堆叠，此处资源为合并计数，折中按 16/组
export const STACK_DEFAULT = 64
export const STACK = {
	egg: 16, potion: 16,
	cake: 1, bed: 1, milk: 1, flint: 1
}

export function stackOf(id) {
	return STACK[id] || STACK_DEFAULT
}

// ---------------- 仓库格子容量 ----------------
// 仓库按格计容：每格存放同一物品的一组（stack）；同种物品可占多格；
// 绿宝石为货币不占格。格子数随大本营等级提升。
export const WH_SLOTS_BASE = 10
export const WH_SLOTS_PER_TH = 6

export function whSlots(th) {
	return WH_SLOTS_BASE + WH_SLOTS_PER_TH * (th || 1)
}

// 初始资源（升至 TH1 时一次性发放：足够盖满 TH1 四件套并培养 2 名村民）
export const START_RESOURCES = {
	log: 200, plank: 100, cobble: 100, wheat: 50, emerald: 100
}

// ---------------- 大本营等级主题色（index = 等级，基地底色随升级变动） ----------------
export const TH_COLORS = [null, '#6fae4e', '#a5793f', '#8d968c', '#9aa3ad', '#cf9a2e', '#c05650', '#4fb3c4', '#5a4a75']

// ---------------- 各资源最早可获取的大本营等级 ----------------
// 推导顺序：建筑产出的 th → 首次被 cost/consumes 需求的 th → 非建筑产出兜底表（夜袭/厨房/远征）
export const RES_TH = (() => {
	const m = {}
	BUILDINGS.forEach(b => b.levels.forEach(lv => {
		const th = lv.th || 1
		if (lv.prod) Object.keys(lv.prod).forEach(id => { if (m[id] === undefined || th < m[id]) m[id] = th })
	}))
	BUILDINGS.forEach(b => b.levels.forEach(lv => {
		const th = lv.th || 1
		;['cost', 'consumes'].forEach(k => {
			if (lv[k]) Object.keys(lv[k]).forEach(id => { if (m[id] === undefined || th < m[id]) m[id] = th })
		})
	}))
	Object.keys(START_RESOURCES).forEach(id => { if (m[id] === undefined || 1 < m[id]) m[id] = 1 })
	// 夜袭掉落（腐肉/书本/打火石）TH1 即有；南瓜随农场 Lv5；粗铁/石英来自下界远征
	const fallback = { rotten: 1, book: 1, flint: 1, lapis: 7, pumpkin: 4, rawIron: 7, quartz: 7, sand: 1 }
	Object.keys(fallback).forEach(id => { if (m[id] === undefined || fallback[id] < m[id]) m[id] = fallback[id] })
	return m
})()
