
<template>
	<view class="outer" :style="{'--statusBarHeight': 0 + 'px'}">
		<view class="bg-gradient"></view>
		<zetank-backBar textcolor="#fff" :showLeft="true" :showTitle="false" navTitle="原木树场"></zetank-backBar>

        <view class="balance-bar" :style="{top: 'calc(20rpx + var(--statusBarHeight))'}">
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

		<view class="screen" :style="{height: 'calc(100vh - ' + (panelHeight - 5) + 'px)'}">
			<view v-bind:is="treeType" :state="state"></view>
            <view class="orb-layer" v-if="expOrbs.length > 0 || orbBursts.length > 0">
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

		<view class="btns" :style="{bottom: (panelHeight + 20) + 'px'}">
			<button v-if="btnText" type="default" class="mainBtn" @click="handleMainBtnClick" :class="{harvest: state.tree_status == '结果'}">
				{{btnText}}
			</button>
            <view class="orb-actions" v-if="state.tree_status != '未种植'">
                <button class="small-btn collect" @click="collectAllExpOrbs" :disabled="isCollectingOrbs || expOrbs.length === 0">一键收集经验</button>
            </view>
		</view>

        <view class="bottom-sheet" :class="{dragging: isDragging}" :style="{height: panelHeight + 'px'}">
            <view class="drag-handle-area" @touchstart="handleDragStart" @touchmove="handleDragMove" @touchend="handleDragEnd">
                <view class="drag-handle"></view>
            </view>

            <view class="sheet-content">
                <view class="growth-card" v-if="state.tree_status != '未种植' && state.tree_status != '结果'">
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

                <view class="sheet-header">
                    <text class="title">📋 每日任务</text>
                    <view class="task-summary" v-if="tasks.length > 0">{{completedTaskCount}}/{{tasks.length}}</view>
                </view>
                <view scroll-y="true" class="task-list">
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
                            <view class="auto-status" :class="{ done: task.status === 'completed' }">{{getExpTaskStatusText(task)}}</view>
                        </view>
                    </view>
                    <view class="empty-tip" v-if="expTasks.length === 0"><text>🫧 暂无经验任务</text></view>
                </view>
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

        <task-reward-modal ref="taskRewardModal" @harvest="handleHarvestFromModal"></task-reward-modal>
	</view>
</template>

<script>
import axios from 'axios'
import defaultTree from '../../components/plantTrees/defaultTree/defaultTree.vue'
import TaskRewardModal from '../../components/TaskRewardModal.vue'

export default {
    components: {
        defaultTree,
        TaskRewardModal,
    },
    created() {
        this.orbTimerHandles = Object.create(null)
        this.orbBurstTimers = Object.create(null)
        this.orbBurstSeed = 0
    },
    beforeDestroy() {
        this.clearAllOrbEffects()
    },
    beforeUnmount() {
        this.clearAllOrbEffects()
    },
    data() {
        return {
            treeType: 'defaultTree',
            plant_time: Date.now(),
            is_gotten: 0,
            state: {},
            btnText: '',
            selectedTreeType: 'defaultTree',
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
            showResultModal: false,
            harvestResult: {
                log: 0,
                apple: 0,
            },
            isDragging: false,
            panelHeight: 0,
            screenHeight: 0,
            startY: 0,
            startHeight: 0,
            isCollectingOrbs: false,
            orbEnterDuration: 680,
            orbCollectDuration: 460,
            batchCollectStagger: 70,
        }
    },
    computed: {
        completedTaskCount() {
            return this.tasks.filter((t) => t.status === 'completed').length
        },
        completedExpTaskCount() {
            return this.expTasks.filter((t) => Number(t.completed_times || 0) >= Number(t.daily_limit || 0)).length
        },
        heightLevels() {
            if (!this.screenHeight) return [0, 0, 0]
            return [this.screenHeight * 0.2, this.screenHeight * 0.4, this.screenHeight * 0.6]
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
                uiState: existingOrb ? existingOrb.uiState || 'idle' : (animateEnter ? 'entering' : 'idle'),
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
        refreshPage() {
            axios
                .get(this.$baseUrl + '/treePlant/get_treePlant_of', { headers: this.getAuthHeaders() })
                .then((res) => {
                    if (res.data.length > 0) {
                        const data = res.data[0]
                        this.treeType = data.treeType
                        this.plant_time = data.plant_time
                        this.is_gotten = data.is_gotten
                        this.state = data
                        this.tasks = data.tasks || []
                        this.expTasks = data.exp_tasks || []
                        this.syncExpOrbs(data.exp_orbs || [], { animateNew: false })
                        this.growth_val = data.growth_val || 0
                        this.max_growth = data.max_growth || 100
                    } else {
                        this.treeType = 'defaultTree'
                        this.plant_time = Date.now()
                        this.is_gotten = 0
                        this.state = { tree_status: '未种植' }
                        this.tasks = []
                        this.expTasks = []
                        this.syncExpOrbs([], { animateNew: false })
                        this.growth_val = 0
                        this.max_growth = 100
                    }
                    this.handleData()
                    this.$forceUpdate()
                })
                .catch((error) => {
                    uni.showToast({ title: error.toString(), icon: 'none', duration: 2000 })
                })
                .then(() => {
                    uni.hideLoading()
                })
        },
        handleData() {
            if (this.treeType !== 'defaultTree') return
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
        collectAllExpOrbs() {
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
        handleHarvestFromModal() {
            this.gotTree()
        },
        plantTree() {
            uni.showLoading({ title: '播种中' })
            axios
                .get(this.$baseUrl + '/treePlant/plant_tree?tree_type=' + this.selectedTreeType, { headers: this.getAuthHeaders() })
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
            this.isDragging = false
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
        uni.showLoading({ title: '加载中' })
        const res = uni.getSystemInfoSync()
        this.screenHeight = res.windowHeight
        this.panelHeight = this.screenHeight * 0.4
        this.refreshPage()
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
            height: 50rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            .drag-handle {
                width: 80rpx;
                height: 10rpx;
                background: #d7ccc8;
                border: 2rpx solid #8d6e63;
                border-radius: 5rpx;
            }
        }

        .sheet-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: auto;
            padding: 0 30rpx 30rpx 30rpx;

            .growth-card {
                background: #e1f5fe;
                border: 3rpx solid #333;
                border-radius: 20rpx;
                padding: 20rpx;
                margin-bottom: 25rpx;
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
