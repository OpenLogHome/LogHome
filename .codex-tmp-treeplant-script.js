
import axios from 'axios'
import defaultTree from '../../components/plantTrees/defaultTree/defaultTree.vue'
import threeOakTree from '../../components/plantTrees/threeOakTree/threeOakTree.vue'
import TaskRewardModal from '../../components/TaskRewardModal.vue'
import {
    DEFAULT_TREE_PLANT_SCENE_THEME,
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
            if (Number(friend.remaining_steal_reward || 0) > 0 && Number(friend.today_stolen_reward || 0) > 0) return '继续串门'
            return '去串门'
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
        handleThreeTreeUnavailable() {
            if (!this.useThreeTreeScene) return
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
        this.useThreeTreeScene = shouldUseTreePlant3DScene()
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
