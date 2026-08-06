<template>
    <view class="page" v-dark>
        <view class="settings-list">
            <view class="setting-item" @click="openTreeSceneThemePicker">
                <view class="setting-main">
                    <view class="setting-title-row">
                        <text class="setting-title">树场主题</text>
                        <text class="limited-badge">2款免费</text>
                    </view>
                </view>
                <view class="setting-side">
                    <view class="current-theme-preview" :style="currentThemePreviewStyle">
                        <view class="current-theme-preview__ground"></view>
                        <view class="current-theme-preview__trunk"></view>
                        <view class="current-theme-preview__crown"></view>
                    </view>
                    <text class="setting-value">{{treeSceneThemeLabel}}</text>
                    <uni-icons type="right" size="16" color="#999999"></uni-icons>
                </view>
            </view>

            <view class="setting-item switch-item">
                <view class="setting-main">
                    <text class="setting-title">低性能树场</text>
                </view>
                <switch :checked="treePlantLowPerformance" color="#6aa84f" @change="handleTreePlantPerformanceChange" />
            </view>

            <view class="setting-item switch-item">
                <view class="setting-main">
                    <text class="setting-title">关闭树场提醒</text>
                    <text class="setting-desc">开启后不再推送树场相关消息通知</text>
                </view>
                <switch
                    :checked="treePlantNotificationsDisabled"
                    color="#6aa84f"
                    @change="handleTreePlantNotificationChange"
                />
            </view>
        </view>

        <view v-if="themePickerVisible" class="theme-picker-mask" @tap="closeTreeSceneThemePicker">
            <view class="theme-picker" @tap.stop>
                <view class="theme-picker__handle"></view>
                <view class="theme-picker__header">
                    <view>
                        <text class="theme-picker__title">选择树场主题</text>
                        <text class="theme-picker__subtitle">预览并选择你喜欢的树场风景</text>
                    </view>
                    <view class="theme-picker__close" @tap="closeTreeSceneThemePicker">×</view>
                </view>

                <scroll-view scroll-y class="theme-picker__scroll">
                    <view class="theme-grid">
                        <view
                            v-for="theme in themeOptions"
                            :key="theme.key"
                            class="theme-card"
                            :class="{
                                'theme-card--selected': theme.key === treeSceneTheme,
                                'theme-card--locked': theme.locked,
                            }"
                            @tap="selectTreeSceneTheme(theme)"
                        >
                            <view class="theme-card__preview" :style="{ background: theme.preview.sky }">
                                <view class="preview-sun" :style="{ background: theme.preview.sun }"></view>
                                <view class="preview-cloud preview-cloud--one"></view>
                                <view class="preview-cloud preview-cloud--two"></view>
                                <view class="preview-hill" :style="{ background: theme.preview.hill }"></view>
                                <view class="preview-island" :style="{ background: theme.preview.ground }"></view>
                                <view class="preview-tree">
                                    <view class="preview-tree__trunk" :style="{ background: theme.preview.trunk }"></view>
                                    <view
                                        class="preview-tree__crown"
                                        :class="'preview-tree__crown--' + theme.key"
                                        :style="{ background: theme.preview.leaf, borderColor: theme.preview.accent }"
                                    ></view>
                                </view>
                                <view v-if="theme.locked" class="theme-card__lock"><text>🔒</text></view>
                                <view v-else-if="theme.key === treeSceneTheme" class="theme-card__check">✓</view>
                            </view>
                            <view class="theme-card__meta">
                                <text class="theme-card__name">{{theme.label}}</text>
                                <text v-if="theme.free" class="theme-card__badge theme-card__badge--free">免费</text>
                                <text v-else class="theme-card__badge">通行证</text>
                            </view>
                        </view>
                    </view>
                    <view class="theme-picker__membership-tip">
                        <text>{{membershipActive ? '原木通行证权益已生效，全部主题均可使用' : '开通原木通行证或超级原木通行证，解锁更多树场主题'}}</text>
                        <text v-if="!membershipActive" class="theme-picker__membership-link" @tap="goToMembership">查看通行证</text>
                    </view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script>
import axios from 'axios'
import {
    DEFAULT_TREE_PLANT_SCENE_THEME,
    isTreePlantLowPerformanceMode,
    normalizeTreePlantSceneTheme,
    setTreePlantLowPerformanceMode,
    TREE_PLANT_SCENE_THEMES,
} from '../../lib/treeSceneSettings'

const FREE_TREE_SCENE_THEME_KEYS = ['oak_island', 'birch_blossom']
const TREE_SCENE_THEME_PREVIEWS = {
    oak_island: {
        sky: 'linear-gradient(180deg, #79d5ff 0%, #dff4bd 100%)', sun: '#fff1a6', hill: '#94cf75',
        ground: '#70bf47', trunk: '#8f5b31', leaf: '#3f9f48', accent: '#91dd72',
    },
    birch_blossom: {
        sky: 'linear-gradient(180deg, #9fe7ff 0%, #f8f0d5 100%)', sun: '#fff0bd', hill: '#a5d894',
        ground: '#91cd68', trunk: '#f4f1e8', leaf: '#74b95c', accent: '#fff0df',
    },
    snow_spruce: {
        sky: 'linear-gradient(180deg, #6dafff 0%, #edf7ff 100%)', sun: '#f8fcff', hill: '#cadff3',
        ground: '#eef7ff', trunk: '#6d4a2e', leaf: '#2d5845', accent: '#dff5ff',
    },
    sakura_grove: {
        sky: 'linear-gradient(180deg, #8ed8ff 0%, #ffe0ee 65%, #ffecc9 100%)', sun: '#ffe3ba', hill: '#b8d8aa',
        ground: '#83c863', trunk: '#99654a', leaf: '#f3aacd', accent: '#ffe1ef',
    },
    savanna_acacia: {
        sky: 'linear-gradient(180deg, #7dcfff 0%, #ffe29d 62%, #e8bb63 100%)', sun: '#ffd36d', hill: '#c4ad54',
        ground: '#b5ae4e', trunk: '#7a4f27', leaf: '#687f39', accent: '#e2d477',
    },
    swamp_redwood: {
        sky: 'linear-gradient(180deg, #70acad 0%, #a9d2bd 62%, #6d9574 100%)', sun: '#d8f4cc', hill: '#5f8368',
        ground: '#50754d', trunk: '#8c432e', leaf: '#304f3f', accent: '#77a087',
    },
}

export default {
    data() {
        return {
            treePlantLowPerformance: false,
            treePlantNotificationsDisabled: false,
            treeSceneTheme: DEFAULT_TREE_PLANT_SCENE_THEME,
            themePickerVisible: false,
            membershipActive: false,
            membershipLoaded: false,
            isLoadingMembership: false,
            isUpdatingTheme: false,
            isUpdatingNotificationSettings: false,
        }
    },
    computed: {
        treeSceneThemeLabel() {
            const currentTheme = TREE_PLANT_SCENE_THEMES.find((item) => item.key === this.treeSceneTheme)
            return currentTheme ? currentTheme.label : '橡岛晴岚'
        },
        themeOptions() {
            return TREE_PLANT_SCENE_THEMES.map((theme) => {
                const free = FREE_TREE_SCENE_THEME_KEYS.includes(theme.key)
                return {
                    ...theme,
                    free,
                    locked: !free && !this.membershipActive,
                    preview: TREE_SCENE_THEME_PREVIEWS[theme.key] || TREE_SCENE_THEME_PREVIEWS.oak_island,
                }
            })
        },
        currentThemePreviewStyle() {
            const preview = TREE_SCENE_THEME_PREVIEWS[this.treeSceneTheme] || TREE_SCENE_THEME_PREVIEWS.oak_island
            return {
                background: preview.sky,
                '--preview-ground': preview.ground,
                '--preview-trunk': preview.trunk,
                '--preview-leaf': preview.leaf,
            }
        },
    },
    onShow() {
        this.refreshSettings()
    },
    methods: {
        getAuthHeaders() {
            let tk = JSON.parse(window.localStorage.getItem('token'))
            if (tk) tk = tk.tk
            return {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + tk,
            }
        },
        refreshSettings() {
            this.treePlantLowPerformance = isTreePlantLowPerformanceMode()
            this.refreshTreeNotificationSettings()
            this.refreshMembershipStatus()
            axios
                .get(this.$baseUrl + '/treePlant/get_treePlant_of', { headers: this.getAuthHeaders() })
                .then((res) => {
                    const rows = Array.isArray(res.data) ? res.data : []
                    const currentTree = rows.length > 0 ? rows[0] : null
                    this.treeSceneTheme = normalizeTreePlantSceneTheme(currentTree && currentTree.treeType)
                })
                .catch((error) => {
                    this.treeSceneTheme = DEFAULT_TREE_PLANT_SCENE_THEME
                    const msg = error.response ? error.response.data.msg : error.toString()
                    uni.showToast({ title: msg, icon: 'none' })
                })
        },
        refreshTreeNotificationSettings() {
            axios
                .get(this.$baseUrl + '/treePlant/notification_settings', { headers: this.getAuthHeaders() })
                .then((res) => {
                    this.treePlantNotificationsDisabled = !!(res.data && res.data.notifications_disabled)
                })
                .catch((error) => {
                    const msg = error.response ? error.response.data.msg : error.toString()
                    uni.showToast({ title: msg, icon: 'none' })
                })
        },
        refreshMembershipStatus() {
            if (this.isLoadingMembership) return this.isLoadingMembership

            this.isLoadingMembership = axios
                .get(this.$baseUrl + '/membership/subscription', { headers: this.getAuthHeaders() })
                .then((res) => {
                    const status = res.data && res.data.data
                    this.membershipActive = !!(status && status.active)
                    return this.membershipActive
                })
                .catch(() => {
                    this.membershipActive = false
                    return false
                })
                .finally(() => {
                    this.membershipLoaded = true
                    this.isLoadingMembership = false
                })

            return this.isLoadingMembership
        },
        openTreeSceneThemePicker() {
            this.themePickerVisible = true
            if (!this.membershipLoaded) this.refreshMembershipStatus()
        },
        closeTreeSceneThemePicker() {
            if (!this.isUpdatingTheme) this.themePickerVisible = false
        },
        async selectTreeSceneTheme(selectedTheme) {
            if (!selectedTheme || this.isUpdatingTheme) return

            const isFreeTheme = FREE_TREE_SCENE_THEME_KEYS.includes(selectedTheme.key)
            if (!isFreeTheme && this.isLoadingMembership) {
                await this.isLoadingMembership
            } else if (!isFreeTheme && !this.membershipLoaded) {
                await this.refreshMembershipStatus()
            }
            if (!isFreeTheme && !this.membershipActive) {
                uni.showModal({
                    title: '通行证专属主题',
                    content: `${selectedTheme.label}仅限原木通行证或超级原木通行证用户使用。`,
                    confirmText: '查看通行证',
                    success: (result) => {
                        if (result.confirm) this.goToMembership()
                    },
                })
                return
            }

            const nextTheme = normalizeTreePlantSceneTheme(selectedTheme.key)
            if (nextTheme === this.treeSceneTheme) {
                this.themePickerVisible = false
                return
            }

            this.isUpdatingTheme = true
            uni.showLoading({ title: '切换场景中' })
            axios
                .post(
                    this.$baseUrl + '/treePlant/set_tree_scene_theme',
                    { tree_type: nextTheme },
                    { headers: this.getAuthHeaders() }
                )
                .then((response) => {
                    const resolvedTheme = normalizeTreePlantSceneTheme(response.data && response.data.tree_type)
                    const currentTheme = TREE_PLANT_SCENE_THEMES.find((item) => item.key === resolvedTheme)
                    this.treeSceneTheme = resolvedTheme
                    this.themePickerVisible = false
                    uni.showToast({
                        title: `已切换为${currentTheme ? currentTheme.label : selectedTheme.label}`,
                        icon: 'none',
                        duration: 1800,
                    })
                })
                .catch((error) => {
                    const msg = error.response ? error.response.data.msg : error.toString()
                    uni.showToast({ title: msg, icon: 'none' })
                })
                .finally(() => {
                    uni.hideLoading()
                    this.isUpdatingTheme = false
                })
        },
        goToMembership() {
            this.themePickerVisible = false
            uni.navigateTo({ url: '/pages/membership/index' })
        },
        handleTreePlantPerformanceChange(e) {
            const enabled = !!(e && e.detail && e.detail.value)
            this.treePlantLowPerformance = enabled
            setTreePlantLowPerformanceMode(enabled)
            uni.showToast({
                title: enabled ? '树场已切换为经典模式' : '树场已切换为高质量 3D 模式',
                icon: 'none',
                duration: 1800,
            })
        },
        handleTreePlantNotificationChange(e) {
            if (this.isUpdatingNotificationSettings) return

            const previousValue = this.treePlantNotificationsDisabled
            const disabled = !!(e && e.detail && e.detail.value)
            this.treePlantNotificationsDisabled = disabled
            this.isUpdatingNotificationSettings = true

            axios
                .post(
                    this.$baseUrl + '/treePlant/notification_settings',
                    { notifications_disabled: disabled },
                    { headers: this.getAuthHeaders() }
                )
                .then((res) => {
                    const resolvedDisabled = !!(res.data && res.data.notifications_disabled)
                    this.treePlantNotificationsDisabled = resolvedDisabled
                    uni.showToast({
                        title: resolvedDisabled ? '已关闭树场提醒' : '已开启树场提醒',
                        icon: 'none',
                        duration: 1800,
                    })
                })
                .catch((error) => {
                    this.treePlantNotificationsDisabled = previousValue
                    const msg = error.response ? error.response.data.msg : error.toString()
                    uni.showToast({ title: msg, icon: 'none' })
                })
                .finally(() => {
                    this.isUpdatingNotificationSettings = false
                })
        },
    },
}
</script>

<style scoped lang="scss">
.page {
    min-height: 100vh;
    background-color: var(--background-color-secondary);
    padding-top: 20upx;
}

.settings-list {
    background: var(--card-background);
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
}

.setting-item {
    width: 92%;
    min-height: 100upx;
    padding: 0 4%;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
    background: var(--card-background);
}

.setting-item:last-child {
    border-bottom: 0;
}

.setting-item:active {
    background: var(--background-color-secondary);
}

.setting-item.switch-item {
    padding-top: 12upx;
    padding-bottom: 12upx;
}

.setting-main {
    flex: 1;
    min-width: 0;
}

.setting-title-row {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.setting-title {
    display: block;
    font-size: 30rpx;
    line-height: 1.4;
    color: var(--text-color-regular);
}

.setting-desc {
    display: block;
    margin-top: 6rpx;
    font-size: 24rpx;
    line-height: 1.4;
    color: var(--text-color-secondary);
}

.limited-badge {
    flex-shrink: 0;
    padding: 4rpx 12rpx;
    border-radius: 999rpx;
    background: #ff5a5f;
    color: #fff;
    font-size: 20rpx;
    line-height: 1.3;
    font-weight: 700;
}

.setting-side {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.current-theme-preview {
    position: relative;
    width: 66rpx;
    height: 46rpx;
    overflow: hidden;
    flex-shrink: 0;
    border: 2rpx solid rgba(255, 255, 255, 0.92);
    border-radius: 10rpx;
    box-shadow: 0 2rpx 10rpx rgba(54, 76, 43, 0.14);
}

.current-theme-preview__ground {
    position: absolute;
    right: -8rpx;
    bottom: -16rpx;
    left: -8rpx;
    height: 30rpx;
    border-radius: 50%;
    background: var(--preview-ground);
}

.current-theme-preview__trunk {
    position: absolute;
    z-index: 1;
    bottom: 9rpx;
    left: 31rpx;
    width: 6rpx;
    height: 20rpx;
    background: var(--preview-trunk);
}

.current-theme-preview__crown {
    position: absolute;
    z-index: 2;
    top: 8rpx;
    left: 20rpx;
    width: 28rpx;
    height: 23rpx;
    border-radius: 50% 50% 43% 43%;
    background: var(--preview-leaf);
}

.setting-value {
    max-width: 260rpx;
    font-size: 24rpx;
    line-height: 1.4;
    color: var(--text-color-secondary);
    font-weight: 700;
    text-align: right;
}

.theme-picker-mask {
    position: fixed;
    z-index: 999;
    inset: 0;
    display: flex;
    align-items: flex-end;
    background: rgba(15, 25, 18, 0.46);
    backdrop-filter: blur(4rpx);
}

.theme-picker {
    width: 100%;
    max-height: 88vh;
    overflow: hidden;
    border-radius: 34rpx 34rpx 0 0;
    background: var(--background-color-tertiary);
    box-shadow: 0 -16rpx 50rpx rgba(23, 48, 27, 0.18);
}

.theme-picker__handle {
    width: 72rpx;
    height: 8rpx;
    margin: 16rpx auto 4rpx;
    border-radius: 999rpx;
    background: #d5dccf;
}

.theme-picker__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18rpx 34rpx 24rpx;
}

.theme-picker__title,
.theme-picker__subtitle {
    display: block;
}

.theme-picker__title {
    color: var(--text-color-primary);
    font-size: 34rpx;
    font-weight: 700;
}

.theme-picker__subtitle {
    margin-top: 7rpx;
    color: var(--text-color-secondary);
    font-size: 23rpx;
}

.theme-picker__close {
    width: 58rpx;
    height: 58rpx;
    border-radius: 50%;
    background: var(--background-color-tertiary);
    color: var(--text-color-regular);
    font-size: 42rpx;
    line-height: 54rpx;
    text-align: center;
}

.theme-picker__scroll {
    height: min(690rpx, 72vh);
}

.theme-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22rpx;
    padding: 0 28rpx;
}

.theme-card {
    overflow: hidden;
    border: 4rpx solid transparent;
    border-radius: 22rpx;
    background: var(--card-background);
    box-shadow: 0 8rpx 24rpx rgba(54, 78, 52, 0.09);
    transition: transform 0.16s ease;
}

.theme-card:active {
    transform: scale(0.98);
}

.theme-card--selected {
    border-color: #6a9f52;
    box-shadow: 0 8rpx 26rpx rgba(73, 126, 57, 0.2);
}

.theme-card__preview {
    position: relative;
    height: 190rpx;
    overflow: hidden;
}

.preview-sun {
    position: absolute;
    top: 22rpx;
    right: 28rpx;
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    box-shadow: 0 0 28rpx currentColor;
}

.preview-cloud {
    position: absolute;
    width: 52rpx;
    height: 14rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.58);
}

.preview-cloud::before,
.preview-cloud::after {
    position: absolute;
    bottom: 3rpx;
    border-radius: 50%;
    background: inherit;
    content: '';
}

.preview-cloud::before {
    left: 9rpx;
    width: 20rpx;
    height: 20rpx;
}

.preview-cloud::after {
    right: 8rpx;
    width: 16rpx;
    height: 16rpx;
}

.preview-cloud--one {
    top: 42rpx;
    left: 24rpx;
}

.preview-cloud--two {
    top: 75rpx;
    right: 42rpx;
    transform: scale(0.72);
    opacity: 0.68;
}

.preview-hill {
    position: absolute;
    right: -28rpx;
    bottom: 20rpx;
    width: 210rpx;
    height: 82rpx;
    border-radius: 55% 0 0;
    opacity: 0.62;
    transform: rotate(-6deg);
}

.preview-island {
    position: absolute;
    right: 28rpx;
    bottom: -34rpx;
    left: 28rpx;
    height: 102rpx;
    border-radius: 50% 50% 42% 42%;
    box-shadow: inset 0 -28rpx 0 rgba(77, 52, 31, 0.45);
}

.preview-tree {
    position: absolute;
    z-index: 2;
    bottom: 40rpx;
    left: 50%;
    width: 108rpx;
    height: 118rpx;
    transform: translateX(-50%);
}

.preview-tree__trunk {
    position: absolute;
    bottom: 0;
    left: 46rpx;
    width: 19rpx;
    height: 68rpx;
    border-radius: 5rpx;
    box-shadow: inset -6rpx 0 rgba(0, 0, 0, 0.13);
}

.preview-tree__crown {
    position: absolute;
    top: 7rpx;
    left: 9rpx;
    width: 92rpx;
    height: 76rpx;
    box-sizing: border-box;
    border: 8rpx solid;
    border-radius: 48% 52% 43% 48%;
    box-shadow: inset -12rpx -8rpx rgba(0, 0, 0, 0.1);
}

.preview-tree__crown--birch_blossom {
    border-style: dotted;
}

.preview-tree__crown--snow_spruce {
    top: 0;
    left: 15rpx;
    width: 82rpx;
    height: 91rpx;
    border-width: 9rpx 5rpx 4rpx;
    border-radius: 50% 50% 20% 20%;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
}

.preview-tree__crown--sakura_grove {
    width: 100rpx;
    border-radius: 55% 45% 58% 42%;
}

.preview-tree__crown--savanna_acacia {
    top: 25rpx;
    left: 0;
    width: 108rpx;
    height: 49rpx;
    border-radius: 55% 55% 42% 42%;
}

.preview-tree__crown--swamp_redwood {
    top: 0;
    left: 22rpx;
    width: 68rpx;
    height: 92rpx;
    border-radius: 48% 48% 30% 30%;
}

.theme-card__lock {
    position: absolute;
    inset: 0;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(19, 30, 23, 0.28);
    backdrop-filter: blur(2rpx);
}

.theme-card__lock text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 62rpx;
    height: 62rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.62);
    border-radius: 50%;
    background: rgba(29, 40, 31, 0.56);
    font-size: 28rpx;
}

.theme-card__check {
    position: absolute;
    top: 14rpx;
    right: 14rpx;
    z-index: 4;
    width: 42rpx;
    height: 42rpx;
    border: 3rpx solid #fff;
    border-radius: 50%;
    background: #5f9749;
    color: #fff;
    font-size: 26rpx;
    font-weight: 700;
    line-height: 39rpx;
    text-align: center;
    box-shadow: 0 4rpx 10rpx rgba(37, 78, 28, 0.25);
}

.theme-card__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8rpx;
    padding: 18rpx 16rpx;
}

.theme-card__name {
    overflow: hidden;
    color: var(--text-color-primary);
    font-size: 27rpx;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.theme-card__badge {
    flex-shrink: 0;
    padding: 4rpx 10rpx;
    border-radius: 999rpx;
    background: var(--background-color-tertiary);
    color: var(--accent-text-color);
    font-size: 19rpx;
    line-height: 1.35;
}

.theme-card__badge--free {
    background: var(--background-color-tertiary);
    color: var(--success-text-color);
}

.theme-picker__membership-tip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
    margin: 24rpx 28rpx 50rpx;
    padding: 20rpx 22rpx;
    border-radius: 18rpx;
    background: var(--background-color-tertiary);
    color: var(--text-color-regular);
    font-size: 22rpx;
    line-height: 1.5;
}

.theme-picker__membership-link {
    flex-shrink: 0;
    color: var(--success-text-color);
    font-weight: 700;
}
</style>
