const DEFAULT_MEDAL_IMAGE = '/static/icons/icon_my_name_tag.png'

function toBool(value, fallback = false) {
	if (typeof value === 'boolean') return value
	if (value === 1 || value === '1') return true
	if (value === 0 || value === '0') return false
	return fallback
}

export function resolveAchievementBadgeVisual(badge) {
	if (!badge) {
		return {
			medal_image: DEFAULT_MEDAL_IMAGE,
			shine: false,
		}
	}

	return {
		medal_image:
			badge.badge_image_url ||
			badge.medal_image ||
			badge.badge_image ||
			DEFAULT_MEDAL_IMAGE,
		shine: toBool(badge.badge_shine, false),
	}
}

export function enrichAchievementBadge(badge) {
	if (!badge) return badge
	return {
		...badge,
		visual: resolveAchievementBadgeVisual(badge),
	}
}
