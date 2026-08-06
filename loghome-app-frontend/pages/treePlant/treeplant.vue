
<template>
	<view class="outer">
		<view class="bg-gradient"></view>
		<zetank-backBar textcolor="#fff" :showLeft="true" :showTitle="false" :navTitle="navTitleText"></zetank-backBar>

        <button class="tree-settings-entry" @click="openTreeSceneSettings">
            <uni-icons type="gear-filled" size="18" color="rgba(231, 236, 242, 0.92)"></uni-icons>
        </button>

		<view class="balance-bar" :style="{top: 'calc(20rpx + var(--loghome-safe-top, 0px))'}">
			<view class="res-item">
				<image src="../../static/resources/log.png" mode="aspectFit"></image>
				<text>{{resources.log}}</text>
			</view>
			<view class="res-item">
				<image src="../../static/resources/apple.png" mode="aspectFit"></image>
				<text>{{resources.apple}}</text>
			</view>
			<view class="res-item">
				<image src="../../static/resources/cropped_log.webp" mode="aspectFit"></image>
				<text>{{resources.cropped_log}}</text>
			</view>
		</view>

		<view class="screen" :style="{height: 'calc(100vh - ' + (scenePanelHeight - 5) + 'px)'}">
			<view
                v-if="isTreeSceneResolved"
                v-bind:is="activeTreeComponent"
                :state="state"
                :scene-theme="treeSceneTheme"
                :night-mode="isDarkTreeScene"
                @scene-unavailable="handleThreeTreeUnavailable"
            ></view>
            <view v-else class="scene-loading">
                <view class="scene-loading-pill">树场加载中</view>
            </view>
            <view class="orb-layer" v-if="isTreeSceneResolved && (expOrbs.length > 0 || orbBursts.length > 0)">
                <view
                    class="exp-orb"
                    v-for="orb in expOrbs"
                    :key="orb.orb_id"
                    :class="['state-' + (orb.uiState || 'idle'), { random: orb.spawn_type === 'random' }]"
                    :style="getOrbStyle(orb)"
                    @click.stop="collectExpOrb(orb)"
                >
                    <view class="orb-halo"></view>
                    <view class="orb-ring"></view>
                    <text class="orb-spark spark-a">✦</text>
                    <text class="orb-spark spark-b">✦</text>
                    <text class="orb-spark spark-c">✦</text>
                    <text class="orb-value">+{{orb.reward}}</text>
                </view>
                <view
                    class="orb-burst"
                    v-for="burst in orbBursts"
                    :key="burst.id"
                    :style="getBurstStyle(burst)"
                >
                    <view class="burst-ring"></view>
                    <text class="burst-spark spark-a">✦</text>
                    <text class="burst-spark spark-b">✦</text>
                    <text class="burst-text">{{burst.text}}</text>
                </view>
            </view>
		</view>

		<view class="visit-entry-btn" :style="{top: 'calc(250rpx + var(--loghome-safe-top, 0px))'}" @tap.stop.prevent="handleVisitEntryTap">
            <text class="entry-emoji">🦝</text>
            <view class="entry-text">
                <text>串</text>
                <text>门</text>
            </view>
            <view class="entry-badge" v-if="canStealTargetCount > 0">{{canStealTargetCount}}</view>
        </view>

		<view class="btns" :style="{bottom: (panelHeight + 20) + 'px'}">
			<button
                v-if="isViewingFriendTree"
                type="default"
                class="mainBtn visit-steal"
                :disabled="!canStealVisitedTree"
                :class="{ disabled: !canStealVisitedTree }"
                @click="collectAllExpOrbs"
            >
				{{visitPrimaryButtonText}}
			</button>
			<button v-else-if="btnText" type="default" class="mainBtn" @click="handleMainBtnClick" :class="{harvest: state.tree_status == '结果'}">
				{{btnText}}
			</button>
            <view class="orb-actions visit-actions" v-if="isViewingFriendTree">
                <button class="small-btn back" @click="leaveFriendVisit">返回我的树场</button>
            </view>
            <view class="orb-actions" v-else-if="state.tree_status != '未种植'">
                <button class="small-btn collect" @click="collectAllExpOrbs" :disabled="isCollectingOrbs || expOrbs.length === 0">一键收集经验</button>
            </view>
		</view>

        <view class="bottom-sheet" :class="{dragging: isDragging}" :style="{height: panelHeight + 'px'}">
            <view class="drag-handle-area" @touchstart="handleDragStart" @touchmove="handleDragMove" @touchend="handleDragEnd" @touchcancel="handleDragEnd">
                <view class="drag-handle"></view>
                <view class="growth-card" v-if="!isViewingFriendTree && state.tree_status != '未种植' && state.tree_status != '结果'">
                    <view class="growth-header">
                        <view class="growth-title">
                            <text class="icon">🌲</text>
                            <text class="label">成长值</text>
                        </view>
                        <text class="val">{{Math.floor(growth_val)}}/{{max_growth}}</text>
                    </view>
                    <view class="progress-track">
                        <view class="progress-bar" :style="{width: (Math.min(growth_val, max_growth) / max_growth * 100) + '%'}">
                            <view class="glare"></view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="sheet-content">
                <scroll-view scroll-y="true" class="sheet-scroll">
                    <template v-if="isViewingFriendTree">
                        <view class="visit-scene-card">
                            <view class="visit-scene-head">
                                <user-avatar
                                    v-if="visitScene.target_avatar_url"
                                    :src="visitScene.target_avatar_url"
                                    :frame="visitScene.target_avatar_frame"
                                    :visual-scale="visitScene.target_avatar_frame ? 1.2 : 1"
                                    class="visit-avatar"
                                />
                                <view v-else class="visit-avatar placeholder">{{getUserInitial(visitScene.target_name)}}</view>
                                <view class="visit-copy">
                                    <text class="visit-name">{{visitScene.target_name || '好友'}}</text>
                                </view>
                            </view>
                            <view class="visit-scene-stats">
                                <view class="visit-stat">
                                    <text class="num">{{visitScene.pending_reward_total || 0}}</text>
                                    <text class="label">待偷成长值</text>
                                </view>
                                <view class="visit-stat">
                                    <text class="num">{{visitScene.remaining_steal_reward || 0}}</text>
                                    <text class="label">剩余可偷</text>
                                </view>
                                <view class="visit-stat">
                                    <text class="num">{{expOrbs.length}}</text>
                                    <text class="label">经验球</text>
                                </view>
                            </view>
                            <view class="visit-scene-tip">{{visitScene.steal_tip || '点击树上的经验球即可偷取，也可以点一键偷取。'}}</view>
                        </view>
                    </template>

                    <template v-else>
                    <view class="membership-boost-card" :class="{ active: hasTaskRewardBoost }">
                        <image
                            v-if="hasTaskRewardBoost"
                            :src="rewardBenefits.membership_type === 'super' ? '/static/membership/loghome-super-pass.png' : '/static/membership/loghome-pass.png'"
                            mode="aspectFit"
                        ></image>
                        <view class="membership-boost-icon" v-else>🌱</view>
                        <view class="membership-boost-copy">
                            <text class="membership-boost-title">{{rewardBenefits.membership_name || '普通用户'}}</text>
                            <text class="membership-boost-desc" v-if="hasTaskRewardBoost">每日任务与经验任务成长值均享 {{taskRewardMultiplierText}} 加成</text>
                            <text class="membership-boost-desc" v-else>开通通行证可享每日任务与经验任务 1.2× / 2× 加成</text>
                        </view>
                        <text class="membership-boost-rate" v-if="hasTaskRewardBoost">{{taskRewardMultiplierText}}</text>
                    </view>
                    <view class="sheet-header">
                        <text class="title">📋 每日任务</text>
                        <view class="task-summary" v-if="tasks.length > 0">{{completedTaskCount}}/{{tasks.length}}</view>
                    </view>
                    <view class="task-list">
                        <view class="task-item" v-for="task in tasks" :key="task.task_code">
                            <view class="task-icon">
                                <image v-if="task.icon" :src="task.icon" mode="aspectFit"></image>
                                <text v-else>🌱</text>
                            </view>
                            <view class="task-content">
                                <view class="task-name">{{task.task_name}}</view>
                                <view class="task-desc">{{task.task_desc}}</view>
                            </view>
                            <view class="task-action">
                                <view class="reward-tag">+{{task.growth_reward}} XP</view>
                                <view class="reward-boost-detail" v-if="Number(task.reward_multiplier || 1) > 1">基础 {{task.base_growth_reward}} × {{task.reward_multiplier}}</view>
                                <button
                                    v-if="task.task_name.includes('签到')"
                                    class="do-btn"
                                    size="mini"
                                    :disabled="task.status == 'completed'"
                                    @click="doTask(task)"
                                >
                                    {{task.status == 'completed' ? '已完成' : '领取'}}
                                </button>
                                <button v-else-if="task.status == 'completed'" class="do-btn" size="mini" disabled>已完成</button>
                            </view>
                        </view>
                        <view class="empty-tip" v-if="tasks.length === 0"><text>💤 暂无任务，休息一下吧~</text></view>
                    </view>

                    <view class="sheet-header exp-header">
                        <text class="title">🪄 经验任务</text>
                        <view class="task-summary" v-if="expTasks.length > 0">{{completedExpTaskCount}}/{{expTasks.length}}</view>
                    </view>
                    <view class="task-list exp-task-list">
                        <view class="task-item" v-for="task in expTasks" :key="task.task_code">
                            <view class="task-icon">
                                <text v-if="!task.icon">✨</text>
                                <image v-else :src="task.icon" mode="aspectFit"></image>
                            </view>
                            <view class="task-content">
                                <view class="task-name">{{task.task_name}}</view>
                                <view class="task-desc">{{task.task_desc}}</view>
                                <view class="task-progress">{{task.progress_text}} · {{task.completed_times}}/{{task.daily_limit}} 次</view>
                            </view>
                            <view class="task-action">
                                <view class="reward-tag">成长值 +{{task.exp_reward}}</view>
                                <view class="reward-boost-detail" v-if="Number(task.reward_multiplier || 1) > 1">基础 {{task.base_exp_reward}} × {{task.reward_multiplier}}</view>
                                <view class="auto-status" :class="{ done: task.status === 'completed' }">{{getExpTaskStatusText(task)}}</view>
                            </view>
                        </view>
                        <view class="empty-tip" v-if="expTasks.length === 0"><text>🫧 暂无经验任务</text></view>
                    </view>
                    </template>
                </scroll-view>
            </view>
        </view>

        <view class="result-modal-mask" v-if="showResultModal" @click="closeResultModal">
            <view class="result-modal" @click.stop>
                <view class="result-header"><text>🎉 收获颇丰 🎉</text></view>
                <view class="result-body">
                    <view class="reward-item" v-if="harvestResult.log > 0">
                        <image src="../../static/resources/log.png" mode="aspectFit"></image>
                        <text>原木 x {{harvestResult.log}}</text>
                    </view>
                    <view class="reward-item" v-if="harvestResult.apple > 0">
                        <image src="../../static/resources/apple.png" mode="aspectFit"></image>
                        <text>苹果 x {{harvestResult.apple}}</text>
                    </view>
                </view>
                <button class="confirm-btn" @click="closeResultModal">开心收下</button>
            </view>
        </view>

        <view class="visit-panel-mask" v-if="showVisitPanel" :class="{ active: visitPanelActive }" @click="closeVisitPanel">
            <view class="visit-panel" :class="{ active: visitPanelActive }" @click.stop>
                <view class="visit-panel-header">
                    <view class="visit-panel-title">
                        <text class="emoji">🦝</text>
                        <text class="title">树场串门</text>
                    </view>
                    <button class="visit-close-btn" @click="closeVisitPanel">收起</button>
                </view>

                <view class="visit-panel-scroll">
                    <view class="visit-section">
                        <view class="sheet-header steal-header">
                            <text class="title">👥 好友列表</text>
                            <view class="task-summary" v-if="stealTargets.length > 0">{{stealTargets.length}} 位好友</view>
                        </view>
                        <view class="steal-list">
                            <view class="steal-item" v-for="friend in stealTargets" :key="friend.user_id">
                                <view class="friend-avatar-wrap">
                                    <user-avatar v-if="friend.avatar_url" :src="friend.avatar_url" :frame="friend.avatar_frame"
                                        :visual-scale="friend.avatar_frame ? 1.2 : 1" class="friend-avatar" />
                                    <view v-else class="friend-avatar placeholder">{{getUserInitial(friend.name)}}</view>
                                    <view class="friend-status" :class="friend.steal_status">{{friend.steal_status_text}}</view>
                                </view>
                                <view class="friend-content">
                                    <view class="friend-name-row">
                                        <text class="friend-name">{{friend.name}}</text>
                                    </view>
                                    <view class="friend-meta">未收成长值 {{friend.pending_reward_total}} · 经验球 {{friend.pending_orb_count}}</view>
                                </view>
                                <view class="friend-action">
                                    <view class="steal-reward-chip" v-if="friend.remaining_steal_reward > 0">可偷 {{friend.remaining_steal_reward}}</view>
                                    <button
                                        class="steal-btn"
                                        size="mini"
                                        :class="{ ready: canStealFriend(friend) }"
                                        :disabled="!canStealFriend(friend)"
                                        @click="handleStealFriend(friend)"
                                    >
                                        {{getStealButtonText(friend)}}
                                    </button>
                                </view>
                            </view>
                            <view class="empty-tip" v-if="stealTargets.length === 0"><text>🌿 暂时还没有可串门的好友树场</text></view>
                        </view>
                    </view>

                    <view class="visit-section">
                        <view class="sheet-header steal-log-header">
                            <text class="title">📜 串门记录</text>
                            <view class="task-summary" v-if="stolenLogs.length > 0">{{stolenLogs.length}} 条记录</view>
                        </view>
                        <view class="steal-log-list">
                            <view class="steal-log-item" v-for="log in stolenLogs" :key="log.record_id">
                                <image v-if="log.thief_avatar_url" :src="log.thief_avatar_url" mode="aspectFill" class="log-avatar"></image>
                                <view v-else class="log-avatar placeholder">{{getUserInitial(log.thief_name)}}</view>
                                <view class="log-content">
                                    <view class="log-title">
                                        <text class="log-name">{{log.thief_name || '好友'}}</text>
                                        <text class="log-time">{{formatStealTime(log.created_at)}}</text>
                                    </view>
                                    <view class="log-desc">顺走了你 {{log.reward}} 点成长值，动了 {{log.orb_count_affected}} 个经验球</view>
                                </view>
                            </view>
                            <view class="empty-tip" v-if="stolenLogs.length === 0"><text>🛡️ 还没有新的串门记录</text></view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <task-reward-modal ref="taskRewardModal" @harvest="handleHarvestFromModal"></task-reward-modal>
	</view>
</template>

<script>
import axios from 'axios'
import defaultTree from '../../components/plantTrees/defaultTree/defaultTree.vue'
import threeOakTree from '../../components/plantTrees/threeOakTree/threeOakTree.vue'
import TaskRewardModal from '../../components/TaskRewardModal.vue'
import {
    canUseHighQualityTreeScene,
    DEFAULT_TREE_PLANT_SCENE_THEME,
    isTreePlantLowPerformanceMode,
    normalizeTreePlantSceneTheme,
    shouldUseTreePlant3DScene,
    TREE_PLANT_SCENE_THEMES,
} from '../../lib/treeSceneSettings'

const createDefaultStealSummary = () => ({
    has_active_tree: false,
    can_be_stolen: false,
    my_pending_orb_count: 0,
    my_pending_reward_total: 0,
    can_steal_count: 0,
    today_i_stole_count: 0,
    today_i_stole_reward: 0,
    today_stolen_me_count: 0,
    today_stolen_me_reward: 0,
    steal_warn_threshold: 3,
})

const createDefaultVisitScene = () => ({
    active: false,
    target_user_id: 0,
    target_name: '',
    target_avatar_url: '',
    target_avatar_frame: null,
    has_active_tree: false,
    need_own_tree: false,
    can_steal: false,
    pending_orb_count: 0,
    pending_reward_total: 0,
    total_steal_reward: 0,
    remaining_steal_reward: 0,
    today_stolen_reward: 0,
    steal_tip: '',
    tree: null,
})

export default {
    components: {
        defaultTree,
        threeOakTree,
        TaskRewardModal,
    },
    created() {
        this.orbTimerHandles = Object.create(null)
        this.orbBurstTimers = Object.create(null)
        this.orbBurstSeed = 0
    },
    beforeDestroy() {
        this.clearAllOrbEffects()
        this.clearVisitPanelTimer()
    },
    beforeUnmount() {
        this.clearAllOrbEffects()
        this.clearVisitPanelTimer()
    },
    data() {
        return {
            plant_time: Date.now(),
            is_gotten: 0,
            state: {},
            btnText: '',
            useThreeTreeScene: false,
            treeSceneTheme: DEFAULT_TREE_PLANT_SCENE_THEME,
            isTreeSceneResolved: false,
            resources: {
                log: 0,
                apple: 0,
                cropped_log: 0,
            },
            tasks: [],
            expTasks: [],
            expOrbs: [],
            orbBursts: [],
            growth_val: 0,
            max_growth: 100,
            rewardBenefits: {
                membership_type: '',
                membership_name: '普通用户',
                multiplier: 1,
                active: false,
            },
            showResultModal: false,
            harvestResult: {
                log: 0,
                apple: 0,
            },
            isDragging: false,
            panelHeight: 0,
            scenePanelHeight: 0,
            screenHeight: 0,
            startY: 0,
            startHeight: 0,
            isCollectingOrbs: false,
            orbEnterDuration: 680,
            orbCollectDuration: 460,
            batchCollectStagger: 70,
            stealFeatureEnabled: false,
            stealSummary: createDefaultStealSummary(),
            stealTargets: [],
            stolenLogs: [],
            isStealing: false,
            visitScene: createDefaultVisitScene(),
            showVisitPanel: false,
            visitPanelActive: false,
            visitPanelTimer: null,
            visitPanelAnimationDuration: 260,
        }
    },
    computed: {
        activeTreeComponent() {
            return this.useThreeTreeScene ? 'threeOakTree' : 'defaultTree'
        },
        isDarkTreeScene() {
            return !!(this.$store && this.$store.state && this.$store.state.isDarkMode)
        },
        isViewingFriendTree() {
            return !!(this.visitScene && this.visitScene.active && Number(this.visitScene.target_user_id))
        },
        navTitleText() {
            if (this.isViewingFriendTree) {
                const targetName = this.visitScene.target_name || '好友'
                return `${targetName}的树场`
            }
            return this.treeSceneThemeLabel
        },
        treeSceneThemeLabel() {
            if (!this.isTreeSceneResolved) return '树场'
            const currentTheme = TREE_PLANT_SCENE_THEMES.find((item) => item.key === this.treeSceneTheme)
            return currentTheme ? currentTheme.label : '橡岛晴岚'
        },
        completedTaskCount() {
            return this.tasks.filter((t) => t.status === 'completed').length
        },
        completedExpTaskCount() {
            return this.expTasks.filter((t) => Number(t.completed_times || 0) >= Number(t.daily_limit || 0)).length
        },
        hasTaskRewardBoost() {
            return Number(this.rewardBenefits && this.rewardBenefits.multiplier || 1) > 1
        },
        taskRewardMultiplierText() {
            const multiplier = Number(this.rewardBenefits && this.rewardBenefits.multiplier || 1)
            return `${Number.isInteger(multiplier) ? multiplier.toFixed(0) : multiplier.toFixed(1)}×`
        },
        heightLevels() {
            if (!this.screenHeight) return [0, 0, 0]
            return [this.screenHeight * 0.2, this.screenHeight * 0.4, this.screenHeight * 0.6]
        },
        canStealTargetCount() {
            return this.stealTargets.filter((item) => item.can_steal).length
        },
        canStealVisitedTree() {
            if (!this.isViewingFriendTree) return false
            if (this.isCollectingOrbs) return false
            if (this.visitScene.need_own_tree) return false
            if (Number(this.visitScene.remaining_steal_reward || 0) <= 0) return false
            return this.expOrbs.length > 0
        },
        visitPrimaryButtonText() {
            if (!this.isViewingFriendTree) return ''
            if (this.isCollectingOrbs) return '偷取中'
            if (this.visitScene.need_own_tree) return '先种树'
            if (Number(this.visitScene.remaining_steal_reward || 0) <= 0) return '今日已偷完'
            if (this.expOrbs.length === 0) return '没有可偷经验球'
            return '⚡ 一键偷取'
        },
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
        wait(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms)
            })
        },
        clearVisitPanelTimer() {
            if (!this.visitPanelTimer) return
            clearTimeout(this.visitPanelTimer)
            this.visitPanelTimer = null
        },
        clearOrbTimer(orbId) {
            const timerKey = String(orbId)
            if (!this.orbTimerHandles || !this.orbTimerHandles[timerKey]) return
            clearTimeout(this.orbTimerHandles[timerKey])
            delete this.orbTimerHandles[timerKey]
        },
        setOrbState(orbId, uiState) {
            const targetId = Number(orbId)
            const index = this.expOrbs.findIndex((item) => Number(item.orb_id) === targetId)
            if (index === -1) return
            this.expOrbs.splice(index, 1, {
                ...this.expOrbs[index],
                uiState,
            })
        },
        scheduleOrbState(orbId, uiState, delay) {
            const timerKey = String(orbId)
            this.clearOrbTimer(timerKey)
            this.orbTimerHandles[timerKey] = setTimeout(() => {
                this.setOrbState(orbId, uiState)
                delete this.orbTimerHandles[timerKey]
            }, delay)
        },
        buildOrbModel(orb, existingOrb, animateEnter = false) {
            const model = {
                ...orb,
                reward: Number(orb && orb.reward ? orb.reward : 0),
                pos_x: Number(orb && orb.pos_x ? orb.pos_x : 50),
                pos_y: Number(orb && orb.pos_y ? orb.pos_y : 45),
                uiState: existingOrb && existingOrb.uiState === 'entering'
                    ? 'entering'
                    : (animateEnter ? 'entering' : 'idle'),
            }
            if (model.uiState === 'entering') {
                this.scheduleOrbState(model.orb_id, 'idle', this.orbEnterDuration)
            }
            return model
        },
        syncExpOrbs(orbs, options = {}) {
            const nextOrbs = Array.isArray(orbs) ? orbs : []
            const existingMap = new Map(this.expOrbs.map((item) => [Number(item.orb_id), item]))
            this.expOrbs = nextOrbs.map((orb) => {
                const existingOrb = existingMap.get(Number(orb.orb_id))
                const animateEnter = !!options.animateNew && !existingOrb
                return this.buildOrbModel(orb, existingOrb, animateEnter)
            })

            const nextIds = new Set(this.expOrbs.map((item) => String(item.orb_id)))
            Object.keys(this.orbTimerHandles || {}).forEach((key) => {
                if (!nextIds.has(key)) this.clearOrbTimer(key)
            })
        },
        startOrbCollectAnimation(orb) {
            if (!orb) return
            this.clearOrbTimer(orb.orb_id)
            this.setOrbState(orb.orb_id, 'collecting')
        },
        resetOrbState(orbId) {
            this.clearOrbTimer(orbId)
            this.setOrbState(orbId, 'idle')
        },
        emitOrbBurst(orb, text, delay = 0) {
            if (!orb) return
            const burstId = `burst-${Date.now()}-${this.orbBurstSeed++}`
            const driftX = ((Number(orb.orb_id || 0) % 5) - 2) * 18
            const driftY = -100 - ((Number(orb.orb_id || 0) % 4) * 10)
            const spawnBurst = () => {
                this.orbBursts = this.orbBursts.concat({
                    id: burstId,
                    pos_x: Number(orb.pos_x || 50),
                    pos_y: Number(orb.pos_y || 45),
                    text,
                    driftX,
                    driftY,
                })
                this.orbBurstTimers[burstId] = setTimeout(() => {
                    this.orbBursts = this.orbBursts.filter((item) => item.id !== burstId)
                    delete this.orbBurstTimers[burstId]
                }, 900)
            }

            if (delay > 0) {
                this.orbBurstTimers[burstId] = setTimeout(() => {
                    delete this.orbBurstTimers[burstId]
                    spawnBurst()
                }, delay)
                return
            }

            spawnBurst()
        },
        clearAllOrbEffects() {
            Object.keys(this.orbTimerHandles || {}).forEach((key) => {
                clearTimeout(this.orbTimerHandles[key])
            })
            Object.keys(this.orbBurstTimers || {}).forEach((key) => {
                clearTimeout(this.orbBurstTimers[key])
            })
            this.orbTimerHandles = Object.create(null)
            this.orbBurstTimers = Object.create(null)
            this.orbBursts = []
        },
        getOrbStyle(orb) {
            const orbId = Number(orb.orb_id || 0)
            return {
                left: (orb.pos_x || 50) + '%',
                top: (orb.pos_y || 45) + '%',
                '--orb-delay': ((orbId % 10) * 0.12) + 's',
                '--orb-tilt': (((orbId % 5) - 2) * 5) + 'deg',
            }
        },
        getBurstStyle(burst) {
            return {
                left: (burst.pos_x || 50) + '%',
                top: (burst.pos_y || 45) + '%',
                '--burst-drift-x': (burst.driftX || 0) + 'rpx',
                '--burst-drift-y': (burst.driftY || -110) + 'rpx',
            }
        },
        getExpTaskStatusText(task) {
            const completedTimes = Number(task && task.completed_times ? task.completed_times : 0)
            const dailyLimit = Number(task && task.daily_limit ? task.daily_limit : 0)
            if (task && task.status === 'completed') return '已自动完成'
            if (completedTimes > 0 && dailyLimit > 0) return `已自动结算 ${completedTimes}/${dailyLimit}`
            if (task && Number(task.available_claim_times || 0) > 0) return '待自动结算'
            return '进行中'
        },
        syncStealDashboard(payload) {
            const data = payload && typeof payload === 'object' ? payload : {}
            this.stealFeatureEnabled = !!data.steal_feature_enabled
            this.stealSummary = {
                ...createDefaultStealSummary(),
                ...data,
            }
            this.stealTargets = Array.isArray(data.steal_targets) ? data.steal_targets : []
            this.stolenLogs = Array.isArray(data.recent_steal_logs) ? data.recent_steal_logs : []
        },
        resetVisitScene() {
            this.visitScene = createDefaultVisitScene()
        },
        applyOwnTreePayload(data) {
            this.resetVisitScene()
            if (data) {
                const resolvedTheme = normalizeTreePlantSceneTheme(data.treeType)
                this.treeSceneTheme = resolvedTheme
                this.plant_time = data.plant_time
                this.is_gotten = data.is_gotten
                this.state = {
                    ...data,
                    treeType: resolvedTheme,
                }
                this.tasks = data.tasks || []
                this.expTasks = data.exp_tasks || []
                this.rewardBenefits = data.reward_benefits || {
                    membership_type: '', membership_name: '普通用户', multiplier: 1, active: false,
                }
                this.syncExpOrbs(data.exp_orbs || [], { animateNew: false })
                this.growth_val = data.growth_val || 0
                this.max_growth = data.max_growth || 100
            } else {
                this.treeSceneTheme = DEFAULT_TREE_PLANT_SCENE_THEME
                this.plant_time = Date.now()
                this.is_gotten = 0
                this.state = {
                    tree_status: '未种植',
                    treeType: DEFAULT_TREE_PLANT_SCENE_THEME,
                }
                this.tasks = []
                this.expTasks = []
                this.rewardBenefits = {
                    membership_type: '', membership_name: '普通用户', multiplier: 1, active: false,
                }
                this.syncExpOrbs([], { animateNew: false })
                this.growth_val = 0
                this.max_growth = 100
            }
            this.handleData()
            this.isTreeSceneResolved = true
            this.$forceUpdate()
        },
        applyVisitScenePayload(payload) {
            const scene = payload && typeof payload === 'object' ? payload : {}
            const tree = scene.tree && typeof scene.tree === 'object' ? scene.tree : null
            const resolvedTheme = normalizeTreePlantSceneTheme(tree && tree.treeType)

            this.visitScene = {
                ...createDefaultVisitScene(),
                ...scene,
                active: true,
                target_user_id: Number(scene.target_user_id || scene.user_id || 0),
                tree: tree
                    ? {
                        ...tree,
                        treeType: resolvedTheme,
                    }
                    : null,
            }
            this.treeSceneTheme = resolvedTheme
            this.plant_time = tree && tree.plant_time ? tree.plant_time : Date.now()
            this.is_gotten = tree && typeof tree.is_gotten !== 'undefined' ? tree.is_gotten : 0
            this.state = tree
                ? {
                    ...tree,
                    treeType: resolvedTheme,
                }
                : {
                    tree_status: '未种植',
                    treeType: resolvedTheme,
                }
            this.tasks = []
            this.expTasks = []
            this.rewardBenefits = {
                membership_type: '', membership_name: '普通用户', multiplier: 1, active: false,
            }
            this.syncExpOrbs(tree && Array.isArray(tree.exp_orbs) ? tree.exp_orbs : [], { animateNew: false })
            this.growth_val = tree && typeof tree.growth_val === 'number' ? tree.growth_val : 0
            this.max_growth = tree && tree.max_growth ? tree.max_growth : 100
            this.handleData()
            this.isTreeSceneResolved = true
            this.$forceUpdate()
        },
        refreshStealDashboard(silent = true) {
            axios
                .get(this.$baseUrl + '/treePlant/steal_dashboard', { headers: this.getAuthHeaders() })
                .then((res) => {
                    this.syncStealDashboard(res.data || {})
                })
                .catch((error) => {
                    this.syncStealDashboard({ steal_feature_enabled: false })
                    if (!silent) {
                        const msg = error.response ? error.response.data.msg : error.toString()
                        uni.showToast({ title: msg, icon: 'none' })
                    }
                })
        },
        canStealFriend(friend) {
            if (!friend || this.isStealing) return false
            return !!friend.has_active_tree
        },
        getStealButtonText(friend) {
            if (!friend || !friend.has_active_tree) return '未种植'
            if (this.isStealing) return '切换中'
            return '串门'
        },
        getUserInitial(name) {
            if (!name) return '友'
            return String(name).trim().slice(0, 1).toUpperCase()
        },
        formatStealTime(value) {
            if (!value) return '刚刚'
            const ts = new Date(value).getTime()
            if (!Number.isFinite(ts)) return String(value)
            const diff = Date.now() - ts
            if (diff < 60 * 1000) return '刚刚'
            if (diff < 60 * 60 * 1000) return Math.max(Math.floor(diff / (60 * 1000)), 1) + ' 分钟前'
            if (diff < 24 * 60 * 60 * 1000) return Math.max(Math.floor(diff / (60 * 60 * 1000)), 1) + ' 小时前'
            const date = new Date(ts)
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            return `${month}-${day} ${hours}:${minutes}`
        },
        openTreeSceneSettings() {
            uni.navigateTo({
                url: '/pages/treePlant/treeSceneSettings',
            })
        },
        handleVisitEntryTap() {
            this.openVisitPanel()
        },
        loadVisitScene(friend, options = {}) {
            const targetUserId = Number(
                friend && (friend.user_id || friend.target_user_id || friend.targetUserId)
                    ? (friend.user_id || friend.target_user_id || friend.targetUserId)
                    : this.visitScene.target_user_id
            )
            if (!targetUserId) return

            this.isStealing = true
            this.isTreeSceneResolved = false
            if (options.closePanel !== false) {
                this.closeVisitPanel()
            }
            uni.showLoading({ title: options.loadingTitle || '串门中' })
            axios
                .get(this.$baseUrl + '/treePlant/visit_friend_tree?target_user_id=' + targetUserId, { headers: this.getAuthHeaders() })
                .then((res) => {
                    this.applyVisitScenePayload(res.data || {})
                    this.refreshStealDashboard()
                })
                .catch((error) => {
                    this.isTreeSceneResolved = true
                    const msg = error.response ? error.response.data.msg : error.toString()
                    uni.showToast({ title: msg, icon: 'none' })
                })
                .finally(() => {
                    uni.hideLoading()
                    this.isStealing = false
                })
        },
        leaveFriendVisit() {
            if (!this.isViewingFriendTree) return
            this.isTreeSceneResolved = false
            this.resetVisitScene()
            uni.showLoading({ title: '返回中' })
            this.refreshPage({ forceOwn: true })
        },
        openVisitPanel() {
            this.clearVisitPanelTimer()
            if (!this.showVisitPanel) {
                this.showVisitPanel = true
                this.visitPanelActive = false
                this.visitPanelTimer = setTimeout(() => {
                    this.visitPanelActive = true
                    this.visitPanelTimer = null
                }, 20)
            } else if (!this.visitPanelActive) {
                this.visitPanelTimer = setTimeout(() => {
                    this.visitPanelActive = true
                    this.visitPanelTimer = null
                }, 20)
            }
            this.refreshStealDashboard(false)
        },
        closeVisitPanel() {
            if (!this.showVisitPanel) return
            this.clearVisitPanelTimer()
            this.visitPanelActive = false
            this.visitPanelTimer = setTimeout(() => {
                this.showVisitPanel = false
                this.visitPanelTimer = null
            }, this.visitPanelAnimationDuration)
        },
        handleStealFriend(friend) {
            if (!friend) return
            if (!friend.has_active_tree) {
                uni.showToast({ title: '对方还没种树，暂时没有可串门的树场', icon: 'none' })
                return
            }
            if (this.isStealing) return
            this.loadVisitScene(friend)
        },
        refreshPage(options = {}) {
            axios
                .get(this.$baseUrl + '/treePlant/get_treePlant_of', { headers: this.getAuthHeaders() })
                .then((res) => {
                    const rows = Array.isArray(res.data) ? res.data : []
                    this.applyOwnTreePayload(rows.length > 0 ? rows[0] : null)
                    this.refreshStealDashboard()
                })
                .catch((error) => {
                    if (!this.isTreeSceneResolved) {
                        this.applyOwnTreePayload(null)
                    }
                    const msg = error.response ? error.response.data.msg : error.toString()
                    uni.showToast({ title: msg, icon: 'none', duration: 2000 })
                })
                .then(() => {
                    uni.hideLoading()
                })
        },
        handleData() {
            if (this.isViewingFriendTree) {
                this.btnText = ''
                return
            }
            if (this.state.tree_status == '未种植') {
                this.btnText = '🌱 种下树苗'
            } else if (this.state.tree_status == '结果') {
                this.btnText = '🪓 收获'
            } else {
                this.btnText = ''
            }
        },
        handleMainBtnClick() {
            if (!this.btnText) return
            if (this.btnText.includes('种下树苗')) {
                this.plantTree()
            } else if (this.btnText.includes('收获')) {
                this.gotTree()
            }
        },
        handleThreeTreeUnavailable(reason) {
            if (!this.useThreeTreeScene) return
            try {
                console.info(
                    '[TREE3D_FALLBACK]' +
                        JSON.stringify({
                            reason: reason || 'scene_unavailable',
                            href: typeof window !== 'undefined' && window.location ? window.location.href : '',
                        })
                )
            } catch (e) {}
            this.useThreeTreeScene = false
            uni.showToast({
                title: '当前环境无法启用高质量 3D，已切回经典模式',
                icon: 'none',
                duration: 2200,
            })
        },
        doTask(task) {
            if (task.status == 'completed') return
            if (!task.task_name.includes('签到')) {
                uni.showToast({ title: '请前往对应功能区完成任务', icon: 'none' })
                return
            }

            uni.showLoading({ title: '领取中' })
            axios
                .post(this.$baseUrl + '/treePlant/do_task', { task_code: task.task_code }, { headers: this.getAuthHeaders() })
                .then((res) => {
                    const reward = res.data && res.data.reward ? res.data.reward : 0
                    const growth = res.data && typeof res.data.growth_val === 'number' ? res.data.growth_val : this.growth_val
                    const status = res.data && res.data.tree_status ? res.data.tree_status : this.state.tree_status
                    if (this.$refs.taskRewardModal) {
                        this.$refs.taskRewardModal.show({
                            reward,
                            taskName: task.task_name,
                            icon: task.icon,
                            currentGrowth: growth,
                            maxGrowth: this.max_growth || 100,
                            canHarvest: status === '结果',
                        })
                    }
                    this.refreshPage()
                })
                .catch((error) => {
                    const msg = error.response ? error.response.data.msg : error.toString()
                    uni.showToast({ title: msg, icon: 'none' })
                })
                .then(() => {
                    uni.hideLoading()
                })
        },
        collectExpOrb(orb) {
            if (this.isViewingFriendTree) {
                this.stealVisitOrb(orb)
                return
            }
            if (!orb || this.isCollectingOrbs || orb.uiState === 'collecting') return
            this.isCollectingOrbs = true
            this.startOrbCollectAnimation(orb)
            Promise.all([
                axios.post(this.$baseUrl + '/treePlant/collect_exp_orb', { orb_id: orb.orb_id }, { headers: this.getAuthHeaders() }),
                this.wait(this.orbCollectDuration),
            ])
                .then(([res]) => {
                    const reward = res.data && typeof res.data.reward === 'number' ? res.data.reward : Number(orb.reward || 0)
                    this.growth_val = res.data && typeof res.data.growth_val === 'number' ? res.data.growth_val : this.growth_val
                    this.state.tree_status = res.data && res.data.tree_status ? res.data.tree_status : this.state.tree_status
                    this.syncExpOrbs(
                        res.data && Array.isArray(res.data.exp_orbs)
                            ? res.data.exp_orbs
                            : this.expOrbs.filter((o) => o.orb_id !== orb.orb_id),
                        { animateNew: false }
                    )
                    this.emitOrbBurst(orb, `+${reward} XP`)
                    this.refreshStealDashboard()
                    uni.showToast({ title: `+${reward} 经验`, icon: 'none' })
                    this.handleData()
                })
                .catch((error) => {
                    this.resetOrbState(orb.orb_id)
                    const msg = error.response ? error.response.data.msg : error.toString()
                    uni.showToast({ title: msg, icon: 'none' })
                })
                .finally(() => {
                    this.isCollectingOrbs = false
                })
        },
        stealVisitOrb(orb) {
            if (!orb || this.isCollectingOrbs || orb.uiState === 'collecting') return
            if (!this.isViewingFriendTree || !this.visitScene.target_user_id) return
            if (this.visitScene.need_own_tree) {
                uni.showToast({ title: '先种下自己的树苗，再来好友树场串门', icon: 'none' })
                return
            }
            if (Number(this.visitScene.remaining_steal_reward || 0) <= 0) {
                uni.showToast({ title: '今天在这位好友树场已经偷满了', icon: 'none' })
                return
            }

            this.isCollectingOrbs = true
            this.startOrbCollectAnimation(orb)
            Promise.all([
                axios.post(
                    this.$baseUrl + '/treePlant/steal_friend_energy',
                    {
                        target_user_id: this.visitScene.target_user_id,
                        orb_id: orb.orb_id,
                    },
                    { headers: this.getAuthHeaders() }
                ),
                this.wait(this.orbCollectDuration),
            ])
                .then(([res]) => {
                    const reward = Number(res.data && res.data.reward ? res.data.reward : Number(orb.reward || 0))
                    if (res.data && res.data.visit_scene) {
                        this.applyVisitScenePayload(res.data.visit_scene)
                    }
                    if (res.data && res.data.steal_dashboard) {
                        this.syncStealDashboard(res.data.steal_dashboard)
                    } else {
                        this.refreshStealDashboard()
                    }
                    this.emitOrbBurst(orb, `偷走 ${reward}`)
                    uni.showToast({
                        title: `从${res.data.target_name || this.visitScene.target_name || '好友'}那顺走 ${reward} 点成长值`,
                        icon: 'none',
                        duration: 2200,
                    })
                })
                .catch((error) => {
                    this.resetOrbState(orb.orb_id)
                    const msg = error.response ? error.response.data.msg : error.toString()
                    uni.showToast({ title: msg, icon: 'none' })
                })
                .finally(() => {
                    this.isCollectingOrbs = false
                })
        },
        collectAllExpOrbs() {
            if (this.isViewingFriendTree) {
                this.stealAllVisitedOrbs()
                return
            }
            if (this.isCollectingOrbs || this.expOrbs.length === 0) return
            this.isCollectingOrbs = true
            const orbsToCollect = this.expOrbs.slice()
            const animateOrbs = orbsToCollect.slice(0, 12)
            const collectTimers = []
            animateOrbs.forEach((item, index) => {
                const timer = setTimeout(() => {
                    this.startOrbCollectAnimation(item)
                }, index * this.batchCollectStagger)
                collectTimers.push(timer)
            })
            Promise.all([
                axios.post(this.$baseUrl + '/treePlant/collect_all_exp_orbs', {}, { headers: this.getAuthHeaders() }),
                this.wait(this.orbCollectDuration + Math.max(animateOrbs.length - 1, 0) * this.batchCollectStagger),
            ])
                .then(([res]) => {
                    animateOrbs.forEach((item, index) => {
                        this.emitOrbBurst(item, `+${item.reward} XP`, index * 60)
                    })
                    this.growth_val = res.data && typeof res.data.growth_val === 'number' ? res.data.growth_val : this.growth_val
                    this.state.tree_status = res.data && res.data.tree_status ? res.data.tree_status : this.state.tree_status
                    this.syncExpOrbs(res.data && Array.isArray(res.data.exp_orbs) ? res.data.exp_orbs : [], { animateNew: false })
                    this.refreshStealDashboard()
                    uni.showToast({ title: `收集 ${res.data.collect_count || 0} 个经验球`, icon: 'none' })
                    this.handleData()
                })
                .catch((error) => {
                    collectTimers.forEach((timer) => clearTimeout(timer))
                    orbsToCollect.forEach((item) => {
                        this.resetOrbState(item.orb_id)
                    })
                    const msg = error.response ? error.response.data.msg : error.toString()
                    uni.showToast({ title: msg, icon: 'none' })
                })
                .finally(() => {
                    collectTimers.forEach((timer) => clearTimeout(timer))
                    this.isCollectingOrbs = false
                })
        },
        stealAllVisitedOrbs() {
            if (this.isCollectingOrbs || !this.isViewingFriendTree || this.expOrbs.length === 0) return
            if (this.visitScene.need_own_tree) {
                uni.showToast({ title: '先种下自己的树苗，再来好友树场串门', icon: 'none' })
                return
            }
            if (Number(this.visitScene.remaining_steal_reward || 0) <= 0) {
                uni.showToast({ title: '今天在这位好友树场已经偷满了', icon: 'none' })
                return
            }

            this.isCollectingOrbs = true
            const orbsToCollect = this.expOrbs.slice()
            const animateOrbs = []
            let remainingQuota = Number(this.visitScene.remaining_steal_reward || 0)

            for (const item of orbsToCollect.slice(0, 12)) {
                if (remainingQuota <= 0) break
                animateOrbs.push(item)
                const orbReward = Number(item.reward || 0)
                remainingQuota -= Math.min(orbReward, remainingQuota)
            }

            const collectTimers = []
            animateOrbs.forEach((item, index) => {
                const timer = setTimeout(() => {
                    this.startOrbCollectAnimation(item)
                }, index * this.batchCollectStagger)
                collectTimers.push(timer)
            })

            Promise.all([
                axios.post(
                    this.$baseUrl + '/treePlant/steal_friend_energy',
                    { target_user_id: this.visitScene.target_user_id },
                    { headers: this.getAuthHeaders() }
                ),
                this.wait(this.orbCollectDuration + Math.max(animateOrbs.length - 1, 0) * this.batchCollectStagger),
            ])
                .then(([res]) => {
                    animateOrbs.forEach((item, index) => {
                        this.emitOrbBurst(item, `偷取`, index * 60)
                    })
                    if (res.data && res.data.visit_scene) {
                        this.applyVisitScenePayload(res.data.visit_scene)
                    }
                    if (res.data && res.data.steal_dashboard) {
                        this.syncStealDashboard(res.data.steal_dashboard)
                    } else {
                        this.refreshStealDashboard()
                    }
                    uni.showToast({
                        title: `从${res.data.target_name || this.visitScene.target_name || '好友'}那顺走 ${res.data.reward || 0} 点成长值`,
                        icon: 'none',
                        duration: 2200,
                    })
                })
                .catch((error) => {
                    collectTimers.forEach((timer) => clearTimeout(timer))
                    animateOrbs.forEach((item) => {
                        this.resetOrbState(item.orb_id)
                    })
                    const msg = error.response ? error.response.data.msg : error.toString()
                    uni.showToast({ title: msg, icon: 'none' })
                })
                .finally(() => {
                    collectTimers.forEach((timer) => clearTimeout(timer))
                    this.isCollectingOrbs = false
                })
        },
        handleHarvestFromModal() {
            this.gotTree()
        },
        plantTree() {
            uni.showLoading({ title: '播种中' })
            axios
                .get(
                    this.$baseUrl + '/treePlant/plant_tree?tree_type=' + encodeURIComponent(this.treeSceneTheme),
                    { headers: this.getAuthHeaders() }
                )
                .then(() => {
                    this.refreshPage()
                    uni.showToast({ title: '已种下树苗', icon: 'none', duration: 2000 })
                })
                .catch(() => {
                    uni.showToast({ title: '系统繁忙', icon: 'none', duration: 2000 })
                })
                .then(() => {
                    uni.hideLoading()
                })
        },
        gotTree() {
            uni.showLoading({ title: '收获中' })
            const collectPendingOrbs = this.expOrbs.length > 0
                ? axios
                    .post(this.$baseUrl + '/treePlant/collect_all_exp_orbs', {}, { headers: this.getAuthHeaders() })
                    .then((res) => {
                        this.growth_val = res.data && typeof res.data.growth_val === 'number' ? res.data.growth_val : this.growth_val
                        this.state.tree_status = res.data && res.data.tree_status ? res.data.tree_status : this.state.tree_status
                        this.syncExpOrbs(res.data && Array.isArray(res.data.exp_orbs) ? res.data.exp_orbs : [], { animateNew: false })
                    })
                : Promise.resolve()

            collectPendingOrbs
                .then(() => axios.get(this.$baseUrl + '/treePlant/got_tree', { headers: this.getAuthHeaders() }))
                .then((res) => {
                    const msg = res.data || ''
                    const logMatch = msg.match(/原木\s*×\s*(\d+)/)
                    const appleMatch = msg.match(/苹果\s*×\s*(\d+)/)
                    this.harvestResult.log = logMatch ? parseInt(logMatch[1]) : 0
                    this.harvestResult.apple = appleMatch ? parseInt(appleMatch[1]) : 0
                    this.showResultModal = true
                    this.refreshPage()
                    this.refreshResources()
                })
                .catch(() => {
                    uni.showToast({ title: '收获失败', icon: 'none', duration: 2000 })
                })
                .then(() => {
                    uni.hideLoading()
                })
        },
        closeResultModal() {
            this.showResultModal = false
        },
        refreshResources() {
            axios
                .get(this.$baseUrl + '/resource/get_resources', { headers: this.getAuthHeaders() })
                .then((res) => {
                    this.resources = res.data[0]
                    this.$forceUpdate()
                })
                .catch((error) => {
                    console.error(error)
                })
        },
        handleDragStart(e) {
            this.isDragging = true
            this.startY = e.touches[0].clientY
            this.startHeight = this.panelHeight
        },
        handleDragMove(e) {
            if (!this.isDragging) return
            let deltaY = this.startY - e.touches[0].clientY
            let newHeight = this.startHeight + deltaY
            const minH = this.heightLevels[0]
            const maxH = this.heightLevels[2]
            if (newHeight < minH - 50) newHeight = minH - 50
            if (newHeight > maxH + 50) newHeight = maxH + 50
            this.panelHeight = newHeight
        },
        handleDragEnd() {
            const current = this.panelHeight
            let closest = this.heightLevels[0]
            let minDiff = Math.abs(current - closest)
            this.heightLevels.forEach((level) => {
                const diff = Math.abs(current - level)
                if (diff < minDiff) {
                    minDiff = diff
                    closest = level
                }
            })
            this.panelHeight = closest
            this.scenePanelHeight = closest
            this.isDragging = false
        },
        applyPageSystemUiStyle(color = '#C0E7FE') {
            if (window.jsBridge && window.jsBridge.inApp && window.jsBridge.setSystemUIStyle) {
                window.jsBridge.setSystemUIStyle(color)
            }
        },
        resetPageSystemUiStyle() {
            if (window.jsBridge && window.jsBridge.inApp && window.jsBridge.setSystemUIStyle) {
                window.jsBridge.setSystemUIStyle('#FFFFFF')
            }
        },
    },
    onShow() {
        this.applyPageSystemUiStyle()
        const treeSceneDiagnostics = {
            href: typeof window !== 'undefined' && window.location ? window.location.href : '',
            lowPerformanceMode: isTreePlantLowPerformanceMode(),
            canUseHighQuality: canUseHighQualityTreeScene(),
            shouldUse3D: shouldUseTreePlant3DScene(),
        }
        try {
            console.info('[TREE3D_ENTRY]' + JSON.stringify(treeSceneDiagnostics))
        } catch (e) {}
        this.useThreeTreeScene = treeSceneDiagnostics.shouldUse3D
        this.treeSceneTheme = DEFAULT_TREE_PLANT_SCENE_THEME
        this.isTreeSceneResolved = false
        uni.showLoading({ title: '加载中' })
        const res = uni.getSystemInfoSync()
        this.screenHeight = res.windowHeight
        this.panelHeight = this.screenHeight * 0.4
        this.scenePanelHeight = this.panelHeight
        if (this.isViewingFriendTree && this.visitScene.target_user_id) {
            this.loadVisitScene(this.visitScene, { closePanel: false, loadingTitle: '加载中' })
        } else {
            this.refreshPage()
        }
        this.refreshResources()
    },
    onUnload() {
        this.resetPageSystemUiStyle()
    },
}
</script>

<style scoped lang="scss">
.outer {
    position: relative;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    .bg-gradient {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, #81d4fa 0%, #a5d6a7 100%);
        z-index: -1;
    }

    .balance-bar {
        position: absolute;
        right: 20rpx;
        display: flex;
        flex-direction: column;
        gap: 15rpx;
        z-index: 10;

        .res-item {
            background: #fff;
            padding: 10rpx 20rpx;
            border-radius: 30rpx;
            display: flex;
            align-items: center;
            border: 3rpx solid #333;
            box-shadow: 4rpx 4rpx 0 rgba(0, 0, 0, 0.2);

            image {
                width: 40rpx;
                height: 40rpx;
                margin-right: 15rpx;
            }
            text {
                font-size: 28rpx;
                font-weight: 800;
                color: #333;
            }
        }
    }

    .tree-settings-entry {
        position: absolute;
        top: calc(60upx + var(--loghome-safe-top, 0px) - 26upx);
        left: 134upx;
        z-index: 82;
        width: 82upx;
        height: 82upx;
        margin: 0;
        padding: 0;
        border-radius: 10rpx;
        border: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: none;

        &::after {
            border: none;
        }

        &:active {
            transform: translateY(1px);
            background: rgba(0, 0, 0, 0.48);
        }
    }

    .screen {
        width: 100vw;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        .scene-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            position: absolute;
            inset: 0;
            z-index: 4;

            .scene-loading-pill {
                padding: 16rpx 28rpx;
                border-radius: 999rpx;
                background: rgba(255, 255, 255, 0.72);
                border: 2rpx solid rgba(93, 64, 55, 0.16);
                color: #5d4037;
                font-size: 24rpx;
                font-weight: 700;
                letter-spacing: 1rpx;
                backdrop-filter: blur(8rpx);
            }
        }

        .orb-layer {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 16;

            .exp-orb {
                position: absolute;
                transform: translate(-50%, -50%);
                width: 96rpx;
                height: 96rpx;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 28%, #fffdf0 0%, #fff59d 22%, #ffd54f 58%, #fb8c00 100%);
                border: 4rpx solid #5d4037;
                box-shadow: 0 10rpx 0 rgba(93, 64, 55, 0.35), 0 18rpx 28rpx rgba(255, 183, 77, 0.45);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                pointer-events: auto;
                overflow: visible;
                animation: orbFloat 2.6s var(--orb-delay) ease-in-out infinite, orbGlow 3.4s var(--orb-delay) ease-in-out infinite;

                &.random {
                    background: radial-gradient(circle at 30% 28%, #f3fff9 0%, #c8f7e4 24%, #80cbc4 60%, #26a69a 100%);
                    box-shadow: 0 10rpx 0 rgba(38, 166, 154, 0.28), 0 18rpx 28rpx rgba(77, 208, 225, 0.36);
                }

                &.state-entering {
                    animation: orbEnter 0.68s cubic-bezier(0.21, 1.2, 0.34, 1) forwards;
                }

                &.state-collecting {
                    pointer-events: none;
                    animation: orbCollect 0.46s cubic-bezier(0.22, 0.9, 0.28, 1) forwards;
                }

                &:active {
                    filter: brightness(1.08) saturate(1.08);
                }

                .orb-halo {
                    position: absolute;
                    inset: -16rpx;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(255, 241, 118, 0.55) 0%, rgba(255, 241, 118, 0.1) 55%, rgba(255, 241, 118, 0) 75%);
                    animation: haloPulse 2.8s ease-in-out infinite;
                }

                .orb-ring {
                    position: absolute;
                    inset: 6rpx;
                    border-radius: 50%;
                    border: 3rpx solid rgba(255, 255, 255, 0.78);
                    opacity: 0.88;
                }

                .orb-spark {
                    position: absolute;
                    font-size: 18rpx;
                    color: rgba(255, 255, 255, 0.95);
                    text-shadow: 0 0 10rpx rgba(255, 255, 255, 0.65);
                    animation: sparkTwinkle 1.8s ease-in-out infinite;

                    &.spark-a {
                        top: 10rpx;
                        right: 16rpx;
                    }

                    &.spark-b {
                        left: 14rpx;
                        bottom: 16rpx;
                        font-size: 16rpx;
                        animation-delay: .45s;
                    }

                    &.spark-c {
                        left: 18rpx;
                        top: 16rpx;
                        font-size: 14rpx;
                        animation-delay: .9s;
                    }
                }

                .orb-value {
                    position: relative;
                    z-index: 1;
                    font-size: 28rpx;
                    line-height: 1;
                    font-weight: 800;
                    color: #4e342e;
                    text-shadow: 0 2rpx 0 rgba(255, 255, 255, 0.38);
                }
            }

            .orb-burst {
                position: absolute;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 24;
                animation: burstRise 0.88s ease-out forwards;

                .burst-ring {
                    position: absolute;
                    inset: -28rpx;
                    border-radius: 50%;
                    border: 4rpx solid rgba(255, 248, 196, 0.82);
                    animation: burstRing 0.88s ease-out forwards;
                }

                .burst-spark {
                    position: absolute;
                    font-size: 24rpx;
                    color: #fff8e1;
                    text-shadow: 0 0 12rpx rgba(255, 248, 196, 0.72);

                    &.spark-a {
                        top: -22rpx;
                        left: -30rpx;
                    }

                    &.spark-b {
                        top: -30rpx;
                        right: -24rpx;
                        animation: sparkTwinkle 0.75s ease-out;
                    }
                }

                .burst-text {
                    position: relative;
                    z-index: 1;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8rpx 18rpx;
                    border-radius: 999rpx;
                    background: rgba(93, 64, 55, 0.88);
                    color: #fff8e1;
                    border: 2rpx solid rgba(255, 248, 196, 0.85);
                    font-size: 22rpx;
                    font-weight: 800;
                    white-space: nowrap;
                }
            }
        }

    }

    .visit-entry-btn {
        position: absolute;
        right: 20rpx;
        z-index: 70;
        width: 110rpx;
        min-height: 156rpx;
        padding: 18rpx 0 16rpx 0;
        box-sizing: border-box;
        border-radius: 34rpx 0 0 34rpx;
        border: 4rpx solid #3e2723;
        background: linear-gradient(180deg, #fff4c4 0%, #ffca28 100%);
        box-shadow: 0 8rpx 0 rgba(62, 39, 35, 0.9), 0 18rpx 30rpx rgba(62, 39, 35, 0.18);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6rpx;
        pointer-events: auto;

        .entry-emoji {
            font-size: 34rpx;
            line-height: 1;
        }

        .entry-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2rpx;

            text {
                font-size: 24rpx;
                line-height: 1.2;
                font-weight: 900;
                color: #4e342e;
            }
        }

        .entry-badge {
            min-width: 42rpx;
            height: 42rpx;
            padding: 0 10rpx;
            border-radius: 999rpx;
            background: #ff7043;
            border: 2rpx solid #3e2723;
            color: #fff8e1;
            font-size: 22rpx;
            font-weight: 900;
            line-height: 38rpx;
            text-align: center;
        }

        &:active {
            transform: translateY(4rpx);
            box-shadow: 0 4rpx 0 rgba(62, 39, 35, 0.9), 0 12rpx 24rpx rgba(62, 39, 35, 0.15);
        }

    }

    .btns {
        width: 100vw;
        position: absolute;
        left: 0;
        height: 240rpx;
        z-index: 20;
        pointer-events: none;

        .mainBtn {
            pointer-events: auto;
            position: absolute;
            bottom: 110rpx;
            left: 50vw;
            transform: translateX(-50%);
            height: 100rpx;
            width: 350rpx;
            border-radius: 50rpx;
            background-color: #ffab91;
            font-size: 36rpx;
            line-height: 100rpx;
            font-weight: bold;
            color: #3e2723;
            transition: all .1s;
            border: 4rpx solid #3e2723;
            box-shadow: 0 8rpx 0 #3e2723;

            &.harvest {
                background-color: #ffd54f;
                animation: pulse 2s infinite;
            }

            &.visit-steal {
                background: linear-gradient(180deg, #fff59d 0%, #ffca28 100%);
            }

            &.disabled,
            &[disabled] {
                background: #cfd8dc;
                color: #607d8b;
                border-color: #607d8b;
                box-shadow: none;
            }

            &:active {
                transform: translateX(-50%) translateY(4rpx);
                box-shadow: 0 4rpx 0 #3e2723;
            }
        }

        .orb-actions {
            pointer-events: auto;
            position: absolute;
            bottom: 16rpx;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 16rpx;

            .small-btn {
                margin: 0;
                padding: 0 24rpx;
                height: 64rpx;
                line-height: 58rpx;
                font-size: 24rpx;
                border-radius: 32rpx;
                border: 3rpx solid #3e2723;
                box-shadow: 0 6rpx 0 #3e2723;
                color: #3e2723;
                font-weight: 800;
                &.collect {
                    background: #ffe082;
                }
                &[disabled] {
                    background: #cfd8dc;
                    color: #546e7a;
                    box-shadow: none;
                    border-color: #607d8b;
                }

                &.back {
                    background: #eceff1;
                }
            }
        }
    }

    .bottom-sheet {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff9c4;
        border-top: 4rpx solid #333;
        border-radius: 30rpx 30rpx 0 0;
        z-index: 50;
        display: flex;
        flex-direction: column;
        transition: height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

        &.dragging {
            transition: none;
        }

        .drag-handle-area {
            width: 100%;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 18rpx 30rpx 24rpx 30rpx;
            box-sizing: border-box;

            .drag-handle {
                width: 80rpx;
                height: 10rpx;
                background: #d7ccc8;
                border: 2rpx solid #8d6e63;
                border-radius: 5rpx;
                margin-bottom: 18rpx;
            }

            .growth-card {
                width: 100%;
                box-sizing: border-box;
                background: #e1f5fe;
                border: 3rpx solid #333;
                border-radius: 20rpx;
                padding: 20rpx;
                box-shadow: 4rpx 4rpx 0 #333;

                .growth-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10rpx;

                    .growth-title {
                        display: flex;
                        align-items: center;
                        .icon { margin-right: 10rpx; }
                        .label {
                            font-size: 28rpx;
                            font-weight: 800;
                            color: #333;
                        }
                    }

                    .val {
                        font-size: 28rpx;
                        font-weight: 800;
                        color: #0277bd;
                    }
                }

                .progress-track {
                    width: 100%;
                    height: 24rpx;
                    background: #fff;
                    border: 3rpx solid #333;
                    border-radius: 12rpx;
                    overflow: hidden;

                    .progress-bar {
                        height: 100%;
                        background: #4fc3f7;
                        border-right: 2rpx solid #333;
                        position: relative;
                        transition: width 0.5s ease-out;

                        .glare {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                            animation: glare 2s infinite;
                        }
                    }
                }
            }
        }

        .sheet-content {
            flex: 1;
            min-height: 0;
            padding: 0 30rpx 30rpx 30rpx;
            box-sizing: border-box;
            overflow: hidden;

            .sheet-scroll {
                height: 100%;
            }

            .visit-scene-card {
                background: #fffef7;
                border: 3rpx solid #333;
                border-radius: 24rpx;
                padding: 24rpx;
                margin-bottom: 22rpx;
                box-shadow: 4rpx 4rpx 0 rgba(158, 158, 158, 0.35);

                .visit-scene-head {
                    display: flex;
                    align-items: center;
                    gap: 18rpx;
                    margin-bottom: 20rpx;
                }

                .visit-avatar {
                    width: 92rpx;
                    height: 92rpx;
                    border-radius: 50%;
                    border: 3rpx solid #333;
                    background: #fff8e1;
                    flex-shrink: 0;

                    &.placeholder {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 34rpx;
                        font-weight: 900;
                        color: #5d4037;
                        background: linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%);
                    }
                }

                .visit-copy {
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 8rpx;
                }

                .visit-name {
                    font-size: 32rpx;
                    font-weight: 900;
                    color: #333;
                }

                .visit-scene-stats {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 14rpx;
                    margin-bottom: 18rpx;
                }

                .visit-stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 120rpx;
                    border-radius: 20rpx;
                    border: 2rpx solid #d7ccc8;
                    background: #fffaf0;
                    padding: 12rpx;
                    text-align: center;

                    .num {
                        font-size: 34rpx;
                        font-weight: 900;
                        color: #e65100;
                        line-height: 1.1;
                    }

                    .label {
                        margin-top: 8rpx;
                        font-size: 20rpx;
                        line-height: 1.35;
                        color: #6d4c41;
                        font-weight: 700;
                    }
                }

                .visit-scene-tip {
                    font-size: 22rpx;
                    line-height: 1.6;
                    color: #6d4c41;
                    background: #fff8e1;
                    border: 2rpx dashed #ffcc80;
                    border-radius: 18rpx;
                    padding: 16rpx 18rpx;
                }
            }

            .steal-overview-card {
                background: linear-gradient(135deg, #fff3e0 0%, #ffe082 100%);
                border: 3rpx solid #333;
                border-radius: 24rpx;
                padding: 24rpx;
                margin-bottom: 24rpx;
                box-shadow: 4rpx 4rpx 0 rgba(62, 39, 35, 0.25);

                .overview-main {
                    display: flex;
                    justify-content: space-between;
                    gap: 24rpx;
                    align-items: flex-start;
                }

                .overview-copy {
                    flex: 1;

                    .overview-title {
                        display: flex;
                        align-items: center;
                        margin-bottom: 10rpx;

                        .icon {
                            margin-right: 10rpx;
                            font-size: 34rpx;
                        }

                        .label {
                            font-size: 30rpx;
                            font-weight: 900;
                            color: #4e342e;
                        }
                    }

                    .overview-desc {
                        font-size: 24rpx;
                        line-height: 1.5;
                        color: #5d4037;
                        font-weight: 700;
                    }
                }

                .overview-badges {
                    display: flex;
                    flex-direction: column;
                    gap: 12rpx;
                    align-items: flex-end;

                    .overview-badge {
                        min-width: 150rpx;
                        text-align: center;
                        padding: 10rpx 16rpx;
                        border-radius: 999rpx;
                        border: 2rpx solid #333;
                        font-size: 22rpx;
                        font-weight: 800;
                        color: #4e342e;

                        &.warm {
                            background: #ffcc80;
                        }

                        &.cool {
                            background: #d1f2ff;
                        }
                    }
                }

                .overview-foot {
                    margin-top: 18rpx;
                    padding-top: 18rpx;
                    border-top: 2rpx dashed rgba(93, 64, 55, 0.35);
                    font-size: 22rpx;
                    line-height: 1.5;
                    color: #6d4c41;
                    font-weight: 700;
                }
            }

            .steal-list {
                margin-bottom: 20rpx;

                .steal-item {
                    display: flex;
                    align-items: center;
                    padding: 20rpx;
                    background: #fffef7;
                    border: 3rpx solid #333;
                    border-radius: 22rpx;
                    margin-bottom: 18rpx;
                    box-shadow: 4rpx 4rpx 0 rgba(158, 158, 158, 0.35);

                    .friend-avatar-wrap {
                        position: relative;
                        margin-right: 18rpx;

                        .friend-avatar {
                            width: 92rpx;
                            height: 92rpx;
                            border-radius: 50%;
                            border: 3rpx solid #333;
                            background: #fff8e1;

                            &.placeholder {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 34rpx;
                                font-weight: 900;
                                color: #5d4037;
                                background: linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%);
                            }
                        }

                        .friend-status {
                            position: absolute;
                            left: 50%;
                            bottom: -12rpx;
                            transform: translateX(-50%);
                            min-width: 104rpx;
                            padding: 4rpx 10rpx;
                            border-radius: 999rpx;
                            border: 2rpx solid #333;
                            background: #e0e0e0;
                            text-align: center;
                            font-size: 18rpx;
                            font-weight: 900;
                            color: #5d4037;

                            &.ready {
                                background: #c5e1a5;
                                color: #1b5e20;
                            }

                            &.stolen_today {
                                background: #d7ccc8;
                            }

                            &.not_ready {
                                background: #ffe0b2;
                            }

                            &.no_tree {
                                background: #cfd8dc;
                                color: #546e7a;
                            }
                        }
                    }

                    .friend-content {
                        flex: 1;
                        min-width: 0;

                        .friend-name-row {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-bottom: 8rpx;
                            gap: 12rpx;

                            .friend-name {
                                font-size: 28rpx;
                                color: #333;
                                font-weight: 900;
                            }
                        }

                        .friend-meta {
                            font-size: 22rpx;
                            color: #616161;
                            margin-bottom: 6rpx;
                        }

                        .friend-tip {
                            font-size: 20rpx;
                            line-height: 1.45;
                            color: #8d6e63;
                        }
                    }

                    .friend-action {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        gap: 12rpx;
                        margin-left: 14rpx;

                        .steal-reward-chip {
                            padding: 4rpx 12rpx;
                            border-radius: 999rpx;
                            background: #fff8e1;
                            color: #e65100;
                            border: 2rpx solid #ffb300;
                            font-size: 20rpx;
                            font-weight: 900;
                        }

                        .steal-btn {
                            margin: 0;
                            min-width: 132rpx;
                            height: 64rpx;
                            line-height: 58rpx;
                            border-radius: 32rpx;
                            border: 3rpx solid #5d4037;
                            background: #d7ccc8;
                            color: #5d4037;
                            font-size: 24rpx;
                            font-weight: 900;
                            box-shadow: none;

                            &.ready {
                                background: #ffca28;
                                color: #4e342e;
                                box-shadow: 0 4rpx 0 #5d4037;
                            }

                            &[disabled] {
                                background: #eceff1;
                                border-color: #90a4ae;
                                color: #78909c;
                                box-shadow: none;
                            }
                        }
                    }
                }

                .empty-tip {
                    text-align: center;
                    color: #8d6e63;
                    padding: 24rpx 0 12rpx 0;
                    font-weight: 800;
                }
            }

            .steal-log-list {
                margin-bottom: 22rpx;

                .steal-log-item {
                    display: flex;
                    align-items: center;
                    padding: 18rpx 20rpx;
                    background: #ffffff;
                    border: 3rpx solid #333;
                    border-radius: 20rpx;
                    margin-bottom: 16rpx;
                    box-shadow: 4rpx 4rpx 0 rgba(176, 190, 197, 0.45);

                    .log-avatar {
                        width: 74rpx;
                        height: 74rpx;
                        border-radius: 50%;
                        border: 3rpx solid #333;
                        margin-right: 18rpx;
                        background: #fff8e1;

                        &.placeholder {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 28rpx;
                            font-weight: 900;
                            color: #5d4037;
                            background: linear-gradient(135deg, #ffe082 0%, #ffb74d 100%);
                        }
                    }

                    .log-content {
                        flex: 1;
                        min-width: 0;

                        .log-title {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-bottom: 6rpx;
                            gap: 12rpx;

                            .log-name {
                                font-size: 26rpx;
                                color: #333;
                                font-weight: 900;
                            }

                            .log-time {
                                font-size: 20rpx;
                                color: #8d6e63;
                                white-space: nowrap;
                            }
                        }

                        .log-desc {
                            font-size: 22rpx;
                            line-height: 1.45;
                            color: #616161;
                        }
                    }
                }

                .empty-tip {
                    text-align: center;
                    color: #8d6e63;
                    padding: 22rpx 0 10rpx 0;
                    font-weight: 800;
                }
            }

            .membership-boost-card {
                display: flex;
                align-items: center;
                gap: 16rpx;
                margin-bottom: 22rpx;
                padding: 18rpx 20rpx;
                border: 3rpx solid #8d6e63;
                border-radius: 20rpx;
                color: #5d4037;
                background: linear-gradient(135deg, #f7f0e7, #efe2d3);
                box-shadow: 4rpx 4rpx 0 rgba(93, 64, 55, 0.16);

                &.active {
                    border-color: #b37a24;
                    background: linear-gradient(135deg, #fff4d5, #f3d59a);
                }

                image,
                .membership-boost-icon {
                    flex-shrink: 0;
                    width: 58rpx;
                    height: 58rpx;
                }

                .membership-boost-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40rpx;
                }

                .membership-boost-copy {
                    flex: 1;
                    min-width: 0;
                }

                .membership-boost-title,
                .membership-boost-desc {
                    display: block;
                }

                .membership-boost-title {
                    font-size: 26rpx;
                    font-weight: 900;
                }

                .membership-boost-desc {
                    margin-top: 5rpx;
                    font-size: 20rpx;
                    line-height: 1.35;
                    color: #795548;
                }

                .membership-boost-rate {
                    flex-shrink: 0;
                    padding: 7rpx 13rpx;
                    border: 2rpx solid #8d5d14;
                    border-radius: 999rpx;
                    font-size: 24rpx;
                    font-weight: 900;
                    color: #6d4308;
                    background: rgba(255, 255, 255, 0.48);
                }
            }

            .sheet-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20rpx;

                &.exp-header {
                    margin-top: 10rpx;
                }

                .title {
                    font-size: 32rpx;
                    font-weight: 900;
                    color: #5d4037;
                }
                .task-summary {
                    font-size: 24rpx;
                    color: #5d4037;
                    background: #ffe082;
                    padding: 5rpx 15rpx;
                    border: 2rpx solid #333;
                    border-radius: 20rpx;
                    font-weight: bold;
                }
            }

            .task-list {
                .task-item {
                    display: flex;
                    align-items: center;
                    padding: 20rpx;
                    background: #fff;
                    border: 3rpx solid #333;
                    border-radius: 20rpx;
                    margin-bottom: 20rpx;
                    box-shadow: 4rpx 4rpx 0 #e0e0e0;

                    .task-icon {
                        width: 80rpx;
                        height: 80rpx;
                        background: #f1f8e9;
                        border: 2rpx solid #333;
                        border-radius: 20rpx;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 20rpx;
                        font-size: 40rpx;
                    }

                    .task-content {
                        flex: 1;
                        .task-name {
                            font-size: 28rpx;
                            font-weight: 800;
                            color: #333;
                            margin-bottom: 5rpx;
                        }
                        .task-desc {
                            font-size: 22rpx;
                            color: #757575;
                        }
                        .task-progress {
                            margin-top: 4rpx;
                            font-size: 20rpx;
                            color: #616161;
                        }
                    }

                    .task-action {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;

                        .reward-tag {
                            font-size: 20rpx;
                            color: #f57f17;
                            margin-bottom: 10rpx;
                            background: #fff9c4;
                            padding: 2rpx 10rpx;
                            border: 2rpx solid #fbc02d;
                            border-radius: 8rpx;
                            font-weight: bold;
                        }

                        .reward-boost-detail {
                            margin: -4rpx 0 9rpx;
                            font-size: 18rpx;
                            font-weight: 700;
                            color: #a56b13;
                        }

                        .auto-status {
                            font-size: 22rpx;
                            color: #455a64;
                            background: #eceff1;
                            padding: 6rpx 16rpx;
                            border: 2rpx solid #90a4ae;
                            border-radius: 999rpx;
                            font-weight: 700;

                            &.done {
                                color: #1b5e20;
                                background: #dcedc8;
                                border-color: #7cb342;
                            }
                        }

                        .do-btn {
                            margin: 0;
                            background: #66bb6a;
                            color: white;
                            font-size: 24rpx;
                            border-radius: 15rpx;
                            padding: 0 20rpx;
                            height: 60rpx;
                            line-height: 56rpx;
                            border: 3rpx solid #1b5e20;
                            box-shadow: 0 4rpx 0 #1b5e20;
                            font-weight: bold;

                            &[disabled] {
                                background: #bdbdbd;
                                border-color: #616161;
                                box-shadow: none;
                                color: #616161;
                            }
                        }
                    }
                }

                .empty-tip {
                    text-align: center;
                    color: #8d6e63;
                    padding: 30rpx 0;
                    font-weight: bold;
                }
            }
        }
    }

    .result-modal-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;

        .result-modal {
            width: 600rpx;
            background: #fff;
            border: 6rpx solid #333;
            border-radius: 40rpx;
            padding: 40rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 12rpx 12rpx 0 rgba(0, 0, 0, 0.3);

            .result-header {
                margin-bottom: 40rpx;
                text {
                    font-size: 44rpx;
                    font-weight: 900;
                    color: #f57f17;
                }
            }

            .result-body {
                display: flex;
                gap: 40rpx;
                margin-bottom: 50rpx;

                .reward-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: #fff9c4;
                    padding: 20rpx;
                    border: 3rpx solid #333;
                    border-radius: 20rpx;

                    image {
                        width: 100rpx;
                        height: 100rpx;
                        margin-bottom: 15rpx;
                    }
                    text {
                        font-size: 32rpx;
                        color: #333;
                        font-weight: 800;
                    }
                }
            }

            .confirm-btn {
                width: 80%;
                height: 90rpx;
                line-height: 84rpx;
                background: #ffca28;
                color: #3e2723;
                border-radius: 45rpx;
                font-size: 36rpx;
                font-weight: 900;
                border: 4rpx solid #3e2723;
                box-shadow: 0 6rpx 0 #3e2723;
            }
        }
    }

    .visit-panel-mask {
        position: fixed;
        inset: 0;
        z-index: 180;
        background: rgba(44, 32, 24, 0.34);
        display: flex;
        justify-content: flex-end;
        opacity: 0;
        transition: opacity 0.26s ease;

        &.active {
            opacity: 1;
        }

        .visit-panel {
            width: 82vw;
            max-width: 720rpx;
            height: 100vh;
            background: linear-gradient(180deg, #fffef5 0%, #fff4d6 100%);
            border-left: 4rpx solid #3e2723;
            box-shadow: -18rpx 0 42rpx rgba(62, 39, 35, 0.22);
            display: flex;
            flex-direction: column;
            padding-top: calc(24rpx + var(--loghome-safe-top, 0px));
            transform: translateX(100%);
            transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
            will-change: transform;
        }

        &.active .visit-panel {
            transform: translateX(0);
        }

        .visit-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16rpx;
            padding: 12rpx 24rpx 22rpx 24rpx;
            border-bottom: 3rpx solid rgba(62, 39, 35, 0.14);

            .visit-panel-title {
                display: flex;
                gap: 14rpx;
                align-items: center;
                min-width: 0;

                .emoji {
                    font-size: 40rpx;
                    line-height: 1;
                }

                .title {
                    font-size: 34rpx;
                    font-weight: 900;
                    color: #4e342e;
                }
            }

            .visit-close-btn {
                margin: 0;
                min-width: 110rpx;
                height: 64rpx;
                line-height: 58rpx;
                border-radius: 999rpx;
                border: 3rpx solid #5d4037;
                background: #fff3e0;
                color: #5d4037;
                font-size: 24rpx;
                font-weight: 900;
                box-shadow: 0 4rpx 0 rgba(93, 64, 55, 0.85);
            }
        }

        .visit-panel-scroll {
            flex: 1;
            overflow: auto;
            padding: 24rpx;
        }

        .visit-section {
            margin-bottom: 24rpx;
        }

        .sheet-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20rpx;

            .title {
                font-size: 32rpx;
                font-weight: 900;
                color: #5d4037;
            }

            .task-summary {
                font-size: 24rpx;
                color: #5d4037;
                background: #ffe082;
                padding: 5rpx 15rpx;
                border: 2rpx solid #333;
                border-radius: 20rpx;
                font-weight: bold;
            }
        }

        .steal-list {
            margin-bottom: 20rpx;

            .steal-item {
                display: flex;
                align-items: center;
                padding: 20rpx;
                background: #fffef7;
                border: 3rpx solid #333;
                border-radius: 22rpx;
                margin-bottom: 18rpx;
                box-shadow: 4rpx 4rpx 0 rgba(158, 158, 158, 0.35);

                .friend-avatar-wrap {
                    position: relative;
                    margin-right: 18rpx;

                    .friend-avatar {
                        width: 92rpx;
                        height: 92rpx;
                        border-radius: 50%;
                        border: 3rpx solid #333;
                        background: #fff8e1;

                        &.placeholder {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 34rpx;
                            font-weight: 900;
                            color: #5d4037;
                            background: linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%);
                        }
                    }

                    .friend-status {
                        position: absolute;
                        left: 50%;
                        bottom: -12rpx;
                        transform: translateX(-50%);
                        min-width: 104rpx;
                        padding: 4rpx 10rpx;
                        border-radius: 999rpx;
                        border: 2rpx solid #333;
                        background: #e0e0e0;
                        text-align: center;
                        font-size: 18rpx;
                        font-weight: 900;
                        color: #5d4037;

                        &.ready {
                            background: #c5e1a5;
                            color: #1b5e20;
                        }

                        &.stolen_today {
                            background: #d7ccc8;
                        }

                        &.not_ready {
                            background: #ffe0b2;
                        }

                        &.no_tree {
                            background: #cfd8dc;
                            color: #546e7a;
                        }
                    }
                }

                .friend-content {
                    flex: 1;
                    min-width: 0;

                    .friend-name-row {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 8rpx;
                        gap: 12rpx;

                        .friend-name {
                            font-size: 28rpx;
                            color: #333;
                            font-weight: 900;
                        }
                    }

                    .friend-meta {
                        font-size: 22rpx;
                        color: #616161;
                        margin-bottom: 6rpx;
                    }
                }

                .friend-action {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 12rpx;
                    margin-left: 14rpx;

                    .steal-reward-chip {
                        padding: 4rpx 12rpx;
                        border-radius: 999rpx;
                        background: #fff8e1;
                        color: #e65100;
                        border: 2rpx solid #ffb300;
                        font-size: 20rpx;
                        font-weight: 900;
                    }

                    .steal-btn {
                        margin: 0;
                        min-width: 132rpx;
                        height: 64rpx;
                        line-height: 58rpx;
                        border-radius: 32rpx;
                        border: 3rpx solid #5d4037;
                        background: #d7ccc8;
                        color: #5d4037;
                        font-size: 24rpx;
                        font-weight: 900;
                        box-shadow: none;

                        &.ready {
                            background: #ffca28;
                            color: #4e342e;
                            box-shadow: 0 4rpx 0 #5d4037;
                        }

                        &[disabled] {
                            background: #eceff1;
                            border-color: #90a4ae;
                            color: #78909c;
                            box-shadow: none;
                        }
                    }
                }
            }

            .empty-tip {
                text-align: center;
                color: #8d6e63;
                padding: 24rpx 0 12rpx 0;
                font-weight: 800;
            }
        }

        .steal-log-list {
            margin-bottom: 22rpx;

            .steal-log-item {
                display: flex;
                align-items: center;
                padding: 18rpx 20rpx;
                background: #ffffff;
                border: 3rpx solid #333;
                border-radius: 20rpx;
                margin-bottom: 16rpx;
                box-shadow: 4rpx 4rpx 0 rgba(176, 190, 197, 0.45);

                .log-avatar {
                    width: 74rpx;
                    height: 74rpx;
                    border-radius: 50%;
                    border: 3rpx solid #333;
                    margin-right: 18rpx;
                    background: #fff8e1;

                    &.placeholder {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 28rpx;
                        font-weight: 900;
                        color: #5d4037;
                        background: linear-gradient(135deg, #ffe082 0%, #ffb74d 100%);
                    }
                }

                .log-content {
                    flex: 1;
                    min-width: 0;

                    .log-title {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 6rpx;
                        gap: 12rpx;

                        .log-name {
                            font-size: 26rpx;
                            color: #333;
                            font-weight: 900;
                        }

                        .log-time {
                            font-size: 20rpx;
                            color: #8d6e63;
                            white-space: nowrap;
                        }
                    }

                    .log-desc {
                        font-size: 22rpx;
                        line-height: 1.45;
                        color: #616161;
                    }
                }
            }

            .empty-tip {
                text-align: center;
                color: #8d6e63;
                padding: 22rpx 0 10rpx 0;
                font-weight: 800;
            }
        }

    }
}

@keyframes pulse {
    0% { transform: translateX(-50%) scale(1); }
    50% { transform: translateX(-50%) scale(1.05); }
    100% { transform: translateX(-50%) scale(1); }
}

@keyframes glare {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

@keyframes orbFloat {
    0% { transform: translate(-50%, -50%) translateY(0); }
    50% { transform: translate(-50%, -50%) translateY(-12rpx); }
    100% { transform: translate(-50%, -50%) translateY(0); }
}

@keyframes orbGlow {
    0%, 100% { filter: saturate(1) brightness(1); }
    50% { filter: saturate(1.08) brightness(1.08); }
}

@keyframes orbEnter {
    0% {
        opacity: 0;
        transform: translate(-50%, calc(-50% + 30rpx)) scale(0.35);
    }
    65% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.12);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

@keyframes orbCollect {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    30% {
        opacity: 1;
        transform: translate(-50%, calc(-50% - 10rpx)) scale(1.18);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, calc(-50% - 82rpx)) scale(0.18) rotate(var(--orb-tilt));
    }
}

@keyframes haloPulse {
    0%, 100% { opacity: 0.55; transform: scale(0.92); }
    50% { opacity: 0.9; transform: scale(1.08); }
}

@keyframes sparkTwinkle {
    0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
    50% { opacity: 1; transform: scale(1.18) rotate(16deg); }
}

@keyframes burstRise {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
    }
    18% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(calc(-50% + var(--burst-drift-x)), calc(-50% + var(--burst-drift-y))) scale(1.08);
    }
}

@keyframes burstRing {
    0% {
        opacity: 0.8;
        transform: scale(0.35);
    }
    100% {
        opacity: 0;
        transform: scale(1.5);
    }
}

</style>
