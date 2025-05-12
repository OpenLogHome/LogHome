 /**
 * Minecraft风格的用户昵称生成器
 * 生成"形容词+MC名词"的组合
 */

// 积极的形容词列表
const positiveAdjectives = [
    "闪耀的", "快乐的", "坚强的", "勇敢的", "智慧的",
    "友善的", "强大的", "耐心的", "灵活的", "冷静的",
    "忠诚的", "热情的", "善良的", "幸运的", "机智的",
    "勤劳的", "可靠的", "敏捷的", "温暖的", "和平的",
    "活力的", "创意的", "安静的", "欢乐的", "美丽的",
    "优雅的", "专注的", "聪明的", "持久的", "精准的",
    "高效的", "自信的", "谦虚的", "稳定的", "迅速的"
];

// Minecraft中的名词
const minecraftNouns = [
    "史蒂夫", "末影人", "creeper", "凋零", "僵尸",
    "骷髅", "蜘蛛", "末影龙", "女巫", "守卫者",
    "村民", "铁傀儡", "雪傀儡", "猪灵", "烈焰人",
    "恶魂", "史莱姆", "岩浆怪", "凋灵骷髅", "蝙蝠",
    "苦力怕", "鸡", "牛", "猪", "羊",
    "兔子", "狼", "豹猫", "马", "鹦鹉",
    "红石", "钻石", "铁锭", "金锭", "绿宝石",
    "煤炭", "青金石", "下界合金", "石头", "木头",
    "工作台", "熔炉", "附魔台", "末影箱", "潜影盒",
    "地狱门", "传送门", "信标", "火把", "开关"
];

/**
 * 获取数组中的随机元素
 * @param {Array} array 数组
 * @returns {*} 随机元素
 */
function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

/**
 * 生成一个随机的Minecraft风格昵称
 * 格式为"积极形容词+MC名词"
 * @returns {string} 生成的昵称
 */
function generateRandomUsername() {
    const adjective = getRandomElement(positiveAdjectives);
    const noun = getRandomElement(minecraftNouns);
    return adjective + noun;
}

module.exports = {
    generateRandomUsername
};