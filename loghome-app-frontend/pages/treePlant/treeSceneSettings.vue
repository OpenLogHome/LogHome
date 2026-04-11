<template>
    <view class="page">
        <view class="settings-list">
            <view class="setting-item" @click="openTreeSceneThemePicker">
                <view class="setting-main">
                    <view class="setting-title-row">
                        <text class="setting-title">树场主题</text>
                        <text class="limited-badge">限免</text>
                    </view>
                </view>
                <view class="setting-side">
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

export default {
    data() {
        return {
            treePlantLowPerformance: false,
            treeSceneTheme: DEFAULT_TREE_PLANT_SCENE_THEME,
            isUpdatingTheme: false,
        }
    },
    computed: {
        treeSceneThemeLabel() {
            const currentTheme = TREE_PLANT_SCENE_THEMES.find((item) => item.key === this.treeSceneTheme)
            return currentTheme ? currentTheme.label : '橡岛晴岚'
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
        openTreeSceneThemePicker() {
            uni.showActionSheet({
                itemList: TREE_PLANT_SCENE_THEMES.map((item) => item.label),
                success: (res) => {
                    const selectedTheme = TREE_PLANT_SCENE_THEMES[Number(res && res.tapIndex)]
                    if (!selectedTheme) return

                    const nextTheme = normalizeTreePlantSceneTheme(selectedTheme.key)
                    if (nextTheme === this.treeSceneTheme || this.isUpdatingTheme) return

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
            })
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
    },
}
</script>

<style scoped lang="scss">
.page {
    min-height: 100vh;
    background-color: #f2f2f2;
    padding-top: 20upx;
}

.settings-list {
    background: #fff;
    border-top: 1px solid rgb(255, 248, 234);
    border-bottom: 1px solid rgb(255, 248, 234);
}

.setting-item {
    width: 92%;
    min-height: 100upx;
    padding: 0 4%;
    border-bottom: 1px solid rgb(255, 248, 234);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
    background: #fff;
}

.setting-item:last-child {
    border-bottom: 0;
}

.setting-item:active {
    background: #fafafa;
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
    color: #666;
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

.setting-value {
    max-width: 260rpx;
    font-size: 24rpx;
    line-height: 1.4;
    color: #999;
    font-weight: 700;
    text-align: right;
}
</style>
