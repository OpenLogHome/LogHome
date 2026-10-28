// 后端仍以中文标签名作为稳定值；这里只负责把内置官方标签转换为展示文案。
// 自定义标签、活动标签和未来新增标签均原样回退，避免翻译影响接口参数。
const OFFICIAL_TAG_KEYS = Object.freeze({
	'中篇小说': 'novella',
	'工具书': 'reference',
	'电竞': 'esports',
	'性转': 'genderSwap',
	'重生': 'rebirth',
	'转生': 'reincarnation',
	'耽美': 'boysLove',
	'纯爱': 'pureLove',
	'惊悚': 'thriller',
	'悬疑': 'mystery',
	'克苏鲁': 'lovecraftian',
	'设定集': 'lore',
	'同人二创': 'fanWorks',
	'长篇小说': 'novel',
	'百合': 'girlsLove',
	'非MC': 'nonMinecraft',
	'科幻': 'sciFi',
	'轻小说': 'lightNovel',
	'穿越': 'transmigration',
	'玄幻': 'easternFantasy',
	'作品集': 'anthology',
	'时光剪影': 'snapshotsInTime',
	'创意': 'creative',
	'随笔': 'essays',
	'散文': 'prose',
	'文集': 'collection',
	'短篇小说': 'shortStory',
	'我的世界': 'minecraft',
	'奇幻': 'fantasy',
})

export function getOfficialTagLabel(tagName, translate) {
	const rawName = String(tagName == null ? '' : tagName)
	const key = OFFICIAL_TAG_KEYS[rawName]
	return key && typeof translate === 'function'
		? translate(`common.officialTags.${key}`)
		: rawName
}

export function matchesOfficialTag(tagName, keyword, translate) {
	const needle = String(keyword == null ? '' : keyword).trim().toLocaleLowerCase()
	if (!needle) return true
	const rawName = String(tagName == null ? '' : tagName).toLocaleLowerCase()
	const displayName = getOfficialTagLabel(tagName, translate).toLocaleLowerCase()
	return rawName.includes(needle) || displayName.includes(needle)
}
