const BACKGROUND_SIZE_VALUES = ["cover", "contain", "auto"];
const BACKGROUND_POSITION_VALUES = [
	"center",
	"top",
	"bottom",
	"left",
	"right",
	"top center",
	"bottom center"
];
const BACKGROUND_REPEAT_VALUES = ["no-repeat", "repeat", "repeat-x", "repeat-y"];
const REQUIRED_MEMBERSHIP_VALUES = ["none", "standard", "super"];

function getAllowedValue(value, allowedValues, fallback) {
	const normalized = String(value || "").trim().toLowerCase();
	return allowedValues.includes(normalized) ? normalized : fallback;
}

export function getBackgroundOverlayColor(value) {
	const color = String(value || "").trim();
	return /^(#[0-9a-f]{3,8}|rgba?\([\d\s,.%]+\))$/i.test(color)
		? color
		: "rgba(255, 255, 255, 0.62)";
}

export function getSafeBackgroundImageUrl(value) {
	const imageUrl = String(value || "").trim();
	if (!/^(https?:\/\/|\/static\/)/i.test(imageUrl)) {
		return "";
	}
	return /["\\\n\r\f]/.test(imageUrl) ? "" : imageUrl;
}

export function normalizeBackgroundSkin(item, hasTheme) {
	if (!item || typeof item !== "object") {
		return null;
	}

	const skinKey = String(item.skin_key || "").trim();
	const skinName = String(item.skin_name || "").trim();
	const imageUrl = getSafeBackgroundImageUrl(item.image_url);
	if (!skinKey || !skinName || !imageUrl) {
		return null;
	}

	const requestedTheme = String(item.theme_key || "").trim();
	const themeKey = typeof hasTheme === "function" && hasTheme(requestedTheme)
		? requestedTheme
		: "yellow";
	const requiredMembership = getAllowedValue(
		item.required_membership,
		REQUIRED_MEMBERSHIP_VALUES,
		"none"
	);

	return {
		skin_key: skinKey.slice(0, 64),
		skin_name: skinName.slice(0, 64),
		theme_key: themeKey,
		image_url: imageUrl,
		overlay_color: getBackgroundOverlayColor(item.overlay_color),
		background_size: getAllowedValue(item.background_size, BACKGROUND_SIZE_VALUES, "cover"),
		background_position: getAllowedValue(item.background_position, BACKGROUND_POSITION_VALUES, "center"),
		background_repeat: getAllowedValue(item.background_repeat, BACKGROUND_REPEAT_VALUES, "no-repeat"),
		required_membership: requiredMembership,
		is_locked: requiredMembership === "none"
			? Boolean(item.is_locked)
			: item.is_locked !== false
	};
}

export function createBackgroundSkinStyle(skin) {
	if (!skin) {
		return {};
	}
	const imageUrl = getSafeBackgroundImageUrl(skin.image_url);
	if (!imageUrl) {
		return {};
	}
	const overlayColor = getBackgroundOverlayColor(skin.overlay_color);
	return {
		backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url("${imageUrl}")`,
		backgroundSize: skin.background_size || "cover",
		backgroundPosition: skin.background_position || "center",
		backgroundRepeat: skin.background_repeat || "no-repeat",
		backgroundAttachment: "fixed"
	};
}
