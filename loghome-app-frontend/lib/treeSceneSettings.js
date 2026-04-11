const TREE_PLANT_LOW_PERFORMANCE_KEY = 'loghomeTreePlantLowPerformance'
const DEFAULT_TREE_PLANT_SCENE_THEME = 'oak_island'
const TREE_PLANT_SCENE_THEMES = [
    { key: 'oak_island', label: '橡岛晴岚' },
    { key: 'birch_blossom', label: '白桦花涧' },
    { key: 'snow_spruce', label: '雪杉云境' },
    { key: 'sakura_grove', label: '樱庭春晓' },
    { key: 'savanna_acacia', label: '金合旷野' },
    { key: 'swamp_redwood', label: '红杉泽影' },
]

function normalizeBoolean(value) {
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value === 1
    if (typeof value === 'string') {
        return value === '1' || value === 'true' || value === 'yes' || value === 'on'
    }
    return false
}

function readStorageValue(key) {
    try {
        if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
            const value = uni.getStorageSync(key)
            if (value !== '' && value !== null && value !== undefined) return value
        }
    } catch (e) {}

    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem(key)
        }
    } catch (e) {}

    return ''
}

function writeStorageValue(key, value) {
    const normalizedValue = value ? '1' : '0'

    try {
        if (typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function') {
            uni.setStorageSync(key, normalizedValue)
        }
    } catch (e) {}

    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(key, normalizedValue)
        }
    } catch (e) {}
}

function normalizeTreePlantSceneTheme(value) {
    const normalized = typeof value === 'string' ? value.trim() : ''
    return TREE_PLANT_SCENE_THEMES.some((item) => item.key === normalized)
        ? normalized
        : DEFAULT_TREE_PLANT_SCENE_THEME
}

export function isTreePlantLowPerformanceMode() {
    return normalizeBoolean(readStorageValue(TREE_PLANT_LOW_PERFORMANCE_KEY))
}

export function setTreePlantLowPerformanceMode(enabled) {
    writeStorageValue(TREE_PLANT_LOW_PERFORMANCE_KEY, !!enabled)
}

export function isBrowserH5TreeSceneEnvironment() {
    if (typeof window === 'undefined') return false
    return true
}

export function canUseHighQualityTreeScene() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false

    try {
        const canvas = document.createElement('canvas')
        const gl =
            canvas.getContext('webgl2') ||
            canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl')

        return !!(window.WebGLRenderingContext && gl)
    } catch (e) {
        return false
    }
}

export function shouldUseTreePlant3DScene() {
    return isBrowserH5TreeSceneEnvironment() && !isTreePlantLowPerformanceMode() && canUseHighQualityTreeScene()
}

export const shouldUseVoxelTreeScene = shouldUseTreePlant3DScene

export {
    DEFAULT_TREE_PLANT_SCENE_THEME,
    TREE_PLANT_LOW_PERFORMANCE_KEY,
    TREE_PLANT_SCENE_THEMES,
    normalizeTreePlantSceneTheme,
}
