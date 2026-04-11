<template>
	<view class="page" v-dark :style="{ '--statusBarHeight': 0 + 'px' }">
		<zetank-backBar
			:bgColor="backBarBgColor"
			:textcolor="backBarTextColor"
			:showLeft="scrollTop < 200"
			:showHome="scrollTop < 200"
			:showTitle="false"
			navTitle="勋章详情"
		></zetank-backBar>

		<view
			class="medal-hero"
			:style="heroGradientStyle"
		>
			<view v-if="showHeroEffects" class="ambient-glow ambient-glow-1"></view>
			<view v-if="showHeroEffects" class="ambient-glow ambient-glow-2"></view>
			<view v-if="showHeroEffects" class="ambient-glow ambient-glow-3"></view>

			<view v-if="showHeroEffects" class="particle-container">
				<view v-for="i in 12" :key="i" class="particle" :style="getParticleStyle(i)"></view>
			</view>

			<view
				class="medal-3d-container"
				:class="{ 'has-badge': badge }"
				@pointerdown.stop.prevent="onTouchStart"
				@pointermove.stop.prevent="onTouchMove"
				@pointerup.stop="onTouchEnd"
				@pointercancel.stop="onTouchEnd"
				@touchstart.stop="onTouchStart"
				@touchmove.stop.prevent="onTouchMove"
				@touchend.stop="onTouchEnd"
				@touchcancel.stop="onTouchEnd"
				@mousedown.stop.prevent="onTouchStart"
				@mouseup.stop="onTouchEnd"
				@mouseleave.stop="onTouchEnd"
			>
				<view class="medal-halo" v-if="badge && showHeroEffects"></view>
				<view class="medal-halo medal-halo-2" v-if="badge && showHeroEffects"></view>
				<view class="medal-shadow" :style="medalShadowStyle" v-if="badge"></view>
				<view
					class="medal-3d"
					:class="{ 'is-locked-medal': isLockedBadge }"
					:style="medal3dStyle"
					v-if="badge"
					@longpress="onMedalLongPress"
				>
					<view class="medal-face medal-front" :class="{ 'is-locked-front': isLockedBadge }">
						<img class="medal-image" :src="visual.medal_image" mode="aspectFit"></img>
					</view>
					<view class="medal-face medal-back" :class="{ 'is-locked-back': isLockedBadge }"></view>
					<view v-if="visual.shine && showHeroEffects" class="medal-glow" :style="{ opacity: glowIntensity }"></view>
					<view v-if="visual.shine && showHeroEffects" class="shine-effect"></view>
				</view>
				<view v-else class="medal-placeholder">
					<view class="placeholder-ring"></view>
					<text class="placeholder-text">NO BADGE</text>
				</view>
			</view>

			<view class="hero-text" v-if="badge">
				<text class="hero-subtitle" :class="{ 'is-locked-subtitle': isLockedBadge }">{{ heroSubtitleText }}</text>
			</view>
		</view>

		<view class="info-card" :class="{ 'card-visible': cardVisible }">
			<view class="card-shine-line"></view>
			<view class="info-header">
				<view class="header-accent"></view>
				<text class="info-name">{{ (badge && badge.title) || 'Official Badge' }}</text>
				<view class="header-accent"></view>
			</view>
			<view class="info-desc">
				{{ (badge && badge.description) || 'Official Honor Badge' }}
			</view>
			<view v-if="badge && badge.title_term_text" class="title-term-card">
				<view class="title-term-label">解锁词条</view>
				<view class="title-term-value">{{ formatTitleTermType(badge.title_term_type) }} · {{ badge.title_term_text }}</view>
				<view class="title-term-desc">获得该勋章后，即可将这个词条加入你的个人称号组合。</view>
			</view>
			<view class="info-divider">
				<view class="divider-line"></view>
				<view class="divider-diamond"></view>
				<view class="divider-line"></view>
			</view>
			<view v-if="isLockedBadge" class="locked-detail">
				<view class="locked-status-row">
					<text class="locked-status-tag">{{ lockedStatusTag }}</text>
					<text class="locked-status-text">{{ lockedProgressSummary }}</text>
				</view>

				<view v-if="lockedProgressLoading" class="locked-loading">
					正在计算当前进度...
				</view>

				<view v-else class="locked-sections">
					<view class="locked-section">
						<text class="locked-section-title">获得条件</text>

						<view
							v-for="(group, groupIndex) in lockedConditionGroups"
							:key="'group-' + groupIndex"
							class="locked-group-card"
						>
							<view class="locked-group-head">
								<text class="locked-group-title">{{ getLockedGroupTitle(groupIndex) }}</text>
								<text class="locked-group-state" :class="{ matched: group.matched }">
									{{ group.matched ? '已达成' : '进行中' }}
								</text>
							</view>

							<view
								v-for="condition in group.conditions"
								:key="condition.condition_id"
								class="locked-condition"
							>
								<view class="locked-condition-top">
									<text class="locked-condition-name">{{ formatMetric(condition.metric_code) }}</text>
									<text class="locked-condition-progress">{{ formatConditionProgress(condition) }}</text>
								</view>
								<text class="locked-condition-rule">{{ formatConditionRule(condition) }}</text>
								<view class="locked-progress-track">
									<view
										class="locked-progress-fill"
										:class="{ matched: condition.matched }"
										:style="{ width: formatProgressPercent(condition.progress_ratio) }"
									></view>
								</view>
							</view>
						</view>

						<view v-if="lockedConditionGroups.length === 0" class="locked-empty-card">
							{{ lockedRequirementText }}
						</view>
					</view>

					<view class="locked-section">
						<text class="locked-section-title">当前进度</text>
						<view class="locked-progress-note">
							{{ lockedProgressDetail }}
						</view>
					</view>
				</view>
			</view>
			<view v-else class="info-meta">
				<view class="meta-item">
					<text class="meta-label">获得日期</text>
					<text class="meta-value">{{ formatTime(badge.granted_at) }}</text>
				</view>
				<view class="meta-item">
					<text class="meta-label">获得途径</text>
					<text class="meta-value">{{ formatGrantSource(badge.grant_source) }}</text>
				</view>
			</view>
			<view class="badge-actions" v-if="canOperateBadge">
				<view class="badge-action-hint">
					{{ isSelected ? '该勋章当前正在展示' : '可将该勋章设为头像旁展示' }}
				</view>
				<view
					class="badge-action-btn"
					:class="{
						'is-set': !isSelected && !actionLoading,
						'is-cancel': isSelected && !actionLoading,
						'is-loading': actionLoading
					}"
					@tap="toggleShowcaseBadge"
				>
					{{ actionButtonText }}
				</view>
			</view>
			<view class="card-footer">
				<view class="footer-accent"></view>
			</view>
		</view>

		<view class="bottom-fade"></view>
	</view>
</template>

<script>
import zetankBackBar from '@/uni_modules/zetank-backBar/components/zetank-backBar/zetank-backBar.vue'
import darkModeMixin from '@/mixins/dark-mode.js'
import axios from 'axios'

export default {
	components: {
		zetankBackBar,
	},
	mixins: [darkModeMixin],
	data() {
		return {
			badge: null,
			scrollTop: 0,
			rotateY: 0,
			rotateX: 0,
			animationTimer: null,
			isDragging: false,
			isLongPressing: false,
			lastTouchX: 0,
			lastTouchY: 0,
			velocityX: 0,
			velocityY: 0,
			autoRotateTimer: null,
			cardVisible: false,
			longPressTimer: null,
			medalScale: 1,
			glowIntensity: 1,
			ownerId: 0,
			currentUserId: 0,
			isOwner: false,
			isSelected: false,
			actionLoading: false,
			momentumFrameId: null,
			isPageActive: false,
			mouseMoveHandler: null,
			mouseUpHandler: null,
			pointerMoveHandler: null,
			pointerUpHandler: null,
			isLocked: false,
			lockedProgressLoading: false,
			lockedProgress: null,
		}
	},
	onLoad(options) {
		if (options && options.owner_id) {
			const parsedOwnerId = Number(options.owner_id)
			if (Number.isFinite(parsedOwnerId) && parsedOwnerId > 0) {
				this.ownerId = parsedOwnerId
			}
		}
		if (options && options.is_selected !== undefined) {
			this.isSelected = String(options.is_selected) === '1'
		}
		if (options && options.locked !== undefined) {
			this.isLocked = String(options.locked) === '1'
		}
		if (options && options.badge) {
			try {
				this.badge = JSON.parse(decodeURIComponent(options.badge))
			} catch (e) {
				this.badge = null
			}
		}
		if (!this.badge) {
			const cachedBadge = uni.getStorageSync('badgeDetailPayload')
			if (cachedBadge) {
				this.badge = cachedBadge
			}
		}
		if (!this.ownerId) {
			const cachedOwnerId = Number(uni.getStorageSync('badgeDetailOwnerId'))
			if (Number.isFinite(cachedOwnerId) && cachedOwnerId > 0) {
				this.ownerId = cachedOwnerId
			}
		}
		if (this.badge && this.badge.is_locked !== undefined) {
			this.isLocked = !!this.badge.is_locked
		}
		if (this.badge && this.isLocked) {
			this.badge.is_locked = true
		}
		if (this.badge && this.badge.is_selected !== undefined) {
			this.isSelected = !!this.badge.is_selected
		}
		setTimeout(() => {
			this.cardVisible = true
		}, 400)
	},
	async onShow() {
		this.isPageActive = true
		await Promise.all([
			this.resolveOwnerState(),
			this.ensureLockedProgress(),
		])
		if (!this.isDragging) {
			this.startAutoRotate()
		}
	},
	onHide() {
		this.isPageActive = false
		this.clearTouchState()
		this.stopAutoRotate()
		this.cancelMomentum()
		this.detachMouseListeners()
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop
	},
	onUnload() {
		this.isPageActive = false
		this.clearTouchState()
		this.stopAutoRotate()
		this.cancelMomentum()
		this.detachMouseListeners()
	},
	computed: {
		visual() {
			if (!this.badge) return { medal_image: '', shine: false }
			return {
				medal_image:
					this.badge.badge_image_url ||
					this.badge.medal_image ||
					this.badge.badge_image ||
					'/static/icons/icon_my_name_tag.png',
				shine: this.badge.badge_shine === true || this.badge.badge_shine === 1,
			}
		},
		backBarBgColor() {
			return 'rgba(0, 0, 0, 0.6)'
		},
		backBarTextColor() {
			return '#fff'
		},
		isLockedBadge() {
			return !!(this.isLocked || (this.badge && this.badge.is_locked))
		},
		showHeroEffects() {
			return !this.isLockedBadge
		},
		heroSubtitleText() {
			return this.isLockedBadge ? 'LOCKED' : 'HONOR'
		},
		heroGradientStyle() {
			if (this.isLockedBadge) {
				return {
					background: 'linear-gradient(180deg, #111418 0%, #252b33 50%, #101318 100%)',
				}
			}
			return {
				background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
			}
		},
		medal3dStyle() {
			return {
				transform: `rotateY(${this.rotateY}deg) rotateX(${this.rotateX}deg) scale(${this.medalScale})`,
			}
		},
		medalShadowStyle() {
			const shadowX = this.rotateY * 0.3
			const shadowY = Math.abs(this.rotateX) * 0.5 + (this.isLongPressing ? -20 : 0)
			const baseAlpha = 0.5 + (this.isLongPressing ? 0.2 : 0)
			const blur = 80 + (this.isLongPressing ? 40 : 0)
			return {
				transform: `translateX(${shadowX}rpx) translateY(${shadowY}rpx)`,
				opacity: baseAlpha,
				filter: `blur(${blur}rpx)`,
			}
		},
		canOperateBadge() {
			return !!(this.isOwner && this.badge && this.badge.achievement_id && !this.isLockedBadge)
		},
		actionButtonText() {
			if (this.actionLoading) return this.isSelected ? '取消中...' : '设置中...'
			return this.isSelected ? '取消展示' : '设为展示'
		},
		lockedConditionGroups() {
			if (!this.lockedProgress || !Array.isArray(this.lockedProgress.group_results)) return []
			return this.lockedProgress.group_results
		},
		lockedTotalConditionCount() {
			return this.lockedConditionGroups.reduce((total, group) => {
				return total + ((group && Array.isArray(group.conditions)) ? group.conditions.length : 0)
			}, 0)
		},
		lockedMatchedConditionCount() {
			return this.lockedConditionGroups.reduce((total, group) => {
				const conditions = Array.isArray(group && group.conditions) ? group.conditions : []
				return total + conditions.filter(item => item && item.matched).length
			}, 0)
		},
		lockedStatusTag() {
			if (this.lockedProgress && this.lockedProgress.matched) {
				return this.badge && this.badge.grant_type === 'rule_review' ? '待审核发放' : '条件已满足'
			}
			return '未获得'
		},
		lockedRequirementText() {
			if (this.badge && this.badge.rule_summary) {
				return this.badge.rule_summary
			}
			if (this.badge && this.badge.grant_type === 'manual') {
				return '该勋章由官方根据活动、身份或贡献情况发放。'
			}
			if (this.badge && this.badge.grant_type === 'rule_review') {
				return '满足规则后，还需要等待审核通过后发放。'
			}
			return '满足对应规则后即可获得该勋章。'
		},
		lockedValidWindowText() {
			const startText = this.badge && this.badge.valid_from ? this.formatTime(this.badge.valid_from) : ''
			const endText = this.badge && this.badge.valid_to ? this.formatTime(this.badge.valid_to) : ''
			if (startText && endText) return `${startText} 至 ${endText}`
			if (startText) return `${startText} 起`
			if (endText) return `截止 ${endText}`
			return '当前有效时间范围'
		},
		lockedProgressSummary() {
			if (this.lockedProgressLoading) {
				return '正在加载当前进度'
			}
			if (this.lockedProgress && this.lockedProgress.reason === 'out_of_valid_window') {
				return `当前不在统计时间内，进度按 ${this.lockedValidWindowText} 统计`
			}
			if (this.lockedProgress && this.lockedProgress.matched) {
				if (this.badge && this.badge.grant_type === 'rule_review') {
					return '你已满足获得条件，等待审核发放。'
				}
				return '你已满足获得条件，等待系统发放。'
			}
			if (this.lockedTotalConditionCount > 0) {
				return `已完成 ${this.lockedMatchedConditionCount}/${this.lockedTotalConditionCount} 项条件`
			}
			if (this.badge && this.badge.grant_type === 'manual') {
				return '该勋章由官方发放，暂无可量化进度。'
			}
			return '暂时没有可展示的进度数据。'
		},
		lockedProgressDetail() {
			if (this.lockedProgressLoading) {
				return '正在根据你的当前数据计算解锁进度。'
			}
			if (this.lockedProgress && this.lockedProgress.reason === 'out_of_valid_window') {
				return `当前页面展示的是 ${this.lockedValidWindowText} 这段有效时间内累计的进度。`
			}
			if (this.lockedProgress && this.lockedProgress.matched) {
				if (this.badge && this.badge.grant_type === 'rule_review') {
					return '规则条件已经满足，当前处于等待审核或人工发放状态。'
				}
				return '规则条件已经满足，等待系统完成发放即可点亮。'
			}
			if (this.lockedTotalConditionCount > 0) {
				return `继续完成剩余条件即可解锁，当前共满足 ${this.lockedMatchedConditionCount} 项。`
			}
			return this.lockedRequirementText
		},
	},
	methods: {
		getToken() {
			try {
				const tk = JSON.parse(window.localStorage.getItem('token'))
				if (tk && tk.tk) return tk.tk
			} catch (e) {}
			return ''
		},
		getAuthHeaders() {
			const tk = this.getToken()
			return {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + tk,
			}
		},
		async ensureLockedProgress() {
			if (!this.isLockedBadge || !this.badge || !this.badge.achievement_id || this.lockedProgressLoading) {
				return
			}
			const cachedAchievementId = Number(this.lockedProgress && this.lockedProgress.achievement && this.lockedProgress.achievement.achievement_id)
			const currentAchievementId = Number(this.badge && this.badge.achievement_id)
			if (cachedAchievementId > 0 && cachedAchievementId === currentAchievementId) {
				return
			}
			if (!this.getToken()) return

			this.lockedProgressLoading = true
			try {
				const res = await axios.get(this.$baseUrl + '/users/achievement_progress', {
					params: {
						achievement_id: this.badge.achievement_id,
					},
					headers: this.getAuthHeaders(),
				})
				this.lockedProgress = res.data && res.data.result ? res.data.result : null
				if (this.lockedProgress && this.lockedProgress.achievement) {
					this.badge = {
						...this.badge,
						...this.lockedProgress.achievement,
						is_locked: true,
					}
				}
			} catch (e) {
				this.lockedProgress = null
			} finally {
				this.lockedProgressLoading = false
			}
		},
		async getCurrentUserId() {
			try {
				const localData = window.localStorage.getItem('LogHomeUserInfo')
				if (localData) {
					const parsed = JSON.parse(localData)
					const localUid = Number(parsed && parsed.user_id)
					if (Number.isFinite(localUid) && localUid > 0) {
						return localUid
					}
				}
			} catch (e) {}

			const tk = this.getToken()
			if (!tk) return 0
			try {
				const res = await axios.get(this.$baseUrl + '/users/userprofile', {
					headers: {
						'Content-Type': 'application/json',
						Authorization: tk,
					},
				})
				const uid = Number(res.data && res.data.user_id)
				if (Number.isFinite(uid) && uid > 0) {
					return uid
				}
			} catch (e) {}
			return 0
		},
		async resolveOwnerState() {
			if (!this.badge) {
				this.isOwner = false
				return
			}
			this.currentUserId = await this.getCurrentUserId()
			if (!this.currentUserId) {
				this.isOwner = false
				return
			}
			if (this.ownerId > 0) {
				this.isOwner = this.currentUserId === Number(this.ownerId)
			} else if (this.badge && this.badge.is_selected !== undefined) {
				// `is_selected` is only returned by current user's achievement list.
				this.isOwner = true
			} else {
				this.isOwner = false
			}
			if (this.isOwner && !this.isLockedBadge) {
				await this.refreshSelectedState()
			}
		},
		async refreshSelectedState() {
			try {
				const res = await axios.get(this.$baseUrl + '/users/achievements_summary', {
					headers: this.getAuthHeaders(),
				})
				const selected = res.data && res.data.selected_badge
				const selectedId = Number(selected && selected.achievement_id)
				const currentId = Number(this.badge && this.badge.achievement_id)
				if (Number.isFinite(selectedId) && Number.isFinite(currentId) && selectedId === currentId) {
					this.isSelected = true
				} else {
					this.isSelected = false
				}
			} catch (e) {}
		},
		async toggleShowcaseBadge() {
			if (!this.canOperateBadge || this.actionLoading) return
			this.actionLoading = true
			try {
				await axios.post(
					this.$baseUrl + '/users/select_badge',
					{
						achievement_id: this.isSelected ? null : this.badge.achievement_id,
					},
					{
						headers: this.getAuthHeaders(),
					},
				)
				this.isSelected = !this.isSelected
				if (this.badge) {
					this.badge.is_selected = this.isSelected
				}
				uni.showToast({
					title: this.isSelected ? '已设为展示' : '已取消展示',
					icon: 'none',
				})
			} catch (e) {
				uni.showToast({
					title: '操作失败',
					icon: 'none',
				})
			} finally {
				this.actionLoading = false
			}
		},
		getPointFromEvent(event) {
			if (!event) return null
			if (event.touches && event.touches[0]) {
				return {
					x: event.touches[0].clientX,
					y: event.touches[0].clientY,
				}
			}
			if (event.changedTouches && event.changedTouches[0]) {
				return {
					x: event.changedTouches[0].clientX,
					y: event.changedTouches[0].clientY,
				}
			}
			if (typeof event.clientX === 'number' && typeof event.clientY === 'number') {
				return {
					x: event.clientX,
					y: event.clientY,
				}
			}
			return null
		},
		attachMouseListeners() {
			if (typeof window === 'undefined') return
			if (this.mouseMoveHandler || this.mouseUpHandler) return
			this.mouseMoveHandler = (evt) => this.onTouchMove(evt)
			this.mouseUpHandler = () => this.onTouchEnd()
			window.addEventListener('mousemove', this.mouseMoveHandler)
			window.addEventListener('mouseup', this.mouseUpHandler)
		},
		attachPointerListeners() {
			if (typeof window === 'undefined') return
			if (this.pointerMoveHandler || this.pointerUpHandler) return
			this.pointerMoveHandler = (evt) => this.onTouchMove(evt)
			this.pointerUpHandler = () => this.onTouchEnd()
			window.addEventListener('pointermove', this.pointerMoveHandler)
			window.addEventListener('pointerup', this.pointerUpHandler)
			window.addEventListener('pointercancel', this.pointerUpHandler)
		},
		detachMouseListeners() {
			if (typeof window === 'undefined') return
			if (this.mouseMoveHandler) {
				window.removeEventListener('mousemove', this.mouseMoveHandler)
				this.mouseMoveHandler = null
			}
			if (this.mouseUpHandler) {
				window.removeEventListener('mouseup', this.mouseUpHandler)
				this.mouseUpHandler = null
			}
			if (this.pointerMoveHandler) {
				window.removeEventListener('pointermove', this.pointerMoveHandler)
				this.pointerMoveHandler = null
			}
			if (this.pointerUpHandler) {
				window.removeEventListener('pointerup', this.pointerUpHandler)
				window.removeEventListener('pointercancel', this.pointerUpHandler)
				this.pointerUpHandler = null
			}
		},
		clearTouchState(resetVelocity = true) {
			if (this.longPressTimer) {
				clearTimeout(this.longPressTimer)
				this.longPressTimer = null
			}
			this.isDragging = false
			this.isLongPressing = false
			this.medalScale = 1
			if (resetVelocity) {
				this.velocityX = 0
				this.velocityY = 0
			}
			this.detachMouseListeners()
		},
		cancelMomentum() {
			if (this.momentumFrameId === null || this.momentumFrameId === undefined) return
			if (typeof cancelAnimationFrame === 'function') {
				cancelAnimationFrame(this.momentumFrameId)
			} else {
				clearTimeout(this.momentumFrameId)
			}
			this.momentumFrameId = null
		},
		scheduleFrame(callback) {
			if (typeof requestAnimationFrame === 'function') {
				this.momentumFrameId = requestAnimationFrame(callback)
				return
			}
			this.momentumFrameId = setTimeout(callback, 16)
		},
		getParticleStyle(index) {
			const angle = (index / 12) * 360
			const radius = 120 + (index % 3) * 30
			const size = 2 + (index % 3) * 2
			const duration = 3 + (index % 4) * 1.5
			const delay = (index % 4) * 0.5
			return {
				'--angle': `${angle}deg`,
				'--radius': `${radius}rpx`,
				'--size': `${size}px`,
				'--duration': `${duration}s`,
				'--delay': `${delay}s`,
			}
		},
		startAutoRotate() {
			if (!this.badge || !this.isPageActive) return
			this.stopAutoRotate()
			this.cancelMomentum()
			let step = 0
			this.autoRotateTimer = setInterval(() => {
				if (!this.isPageActive || this.isDragging || this.isLongPressing) return
				step += 0.008
				this.rotateY = Math.sin(step) * 12
				this.rotateX = Math.sin(step * 0.7) * 5
				this.glowIntensity = 1 + Math.sin(step * 2) * 0.2
			}, 16)
		},
		stopAutoRotate() {
			if (this.autoRotateTimer) {
				clearInterval(this.autoRotateTimer)
				this.autoRotateTimer = null
			}
		},
		onTouchStart(e) {
			if (!this.badge) return
			const point = this.getPointFromEvent(e)
			if (!point) return
			if (e && e.cancelable && typeof e.preventDefault === 'function') {
				e.preventDefault()
			}
			this.cancelMomentum()
			this.clearTouchState()
			this.isDragging = true
			this.lastTouchX = point.x
			this.lastTouchY = point.y
			this.velocityX = 0
			this.velocityY = 0
			this.stopAutoRotate()
			if (e && e.type === 'pointerdown') {
				this.attachPointerListeners()
			} else if (e && e.type === 'mousedown') {
				this.attachMouseListeners()
			}
			this.longPressTimer = setTimeout(() => {
				this.isLongPressing = true
				this.medalScale = 1.15
				this.$forceUpdate()
			}, 500)
		},
		onTouchMove(e) {
			if (!this.badge || !this.isDragging) return
			const point = this.getPointFromEvent(e)
			if (!point) return
			if (e && e.cancelable && typeof e.preventDefault === 'function') {
				e.preventDefault()
			}
			if (this.longPressTimer) {
				clearTimeout(this.longPressTimer)
				this.longPressTimer = null
			}
			const currentX = point.x
			const currentY = point.y
			const deltaX = currentX - this.lastTouchX
			const deltaY = currentY - this.lastTouchY
			this.velocityX = deltaX * 0.4
			this.velocityY = deltaY * 0.3
			this.rotateY += deltaX * 0.5
			this.rotateX -= deltaY * 0.3
			if (this.rotateY > 70) this.rotateY = 70
			if (this.rotateY < -70) this.rotateY = -70
			if (this.rotateX > 45) this.rotateX = 45
			if (this.rotateX < -45) this.rotateX = -45
			this.lastTouchX = currentX
			this.lastTouchY = currentY
		},
		onTouchEnd() {
			if (!this.badge) return
			this.clearTouchState(false)
			if (Math.abs(this.velocityX) > 0.5 || Math.abs(this.velocityY) > 0.5) {
				this.applyMomentum()
			} else {
				this.velocityX = 0
				this.velocityY = 0
				this.startAutoRotate()
			}
		},
		applyMomentum() {
			this.cancelMomentum()
			if (!this.badge || !this.isPageActive) {
				this.startAutoRotate()
				return
			}
			let remainingVelX = this.velocityX
			let remainingVelY = this.velocityY
			const decay = 0.94
			const momentumStep = () => {
				if (!this.isPageActive || (Math.abs(remainingVelX) < 0.1 && Math.abs(remainingVelY) < 0.1) || this.isDragging) {
					this.cancelMomentum()
					this.startAutoRotate()
					return
				}
				this.rotateY += remainingVelX
				this.rotateX -= remainingVelY
				if (this.rotateY > 70) {
					this.rotateY = 70
					remainingVelX *= -0.3
				}
				if (this.rotateY < -70) {
					this.rotateY = -70
					remainingVelX *= -0.3
				}
				if (this.rotateX > 45) {
					this.rotateX = 45
					remainingVelY *= -0.3
				}
				if (this.rotateX < -45) {
					this.rotateX = -45
					remainingVelY *= -0.3
				}
				remainingVelX *= decay
				remainingVelY *= decay
				this.scheduleFrame(momentumStep)
			}
			momentumStep()
		},
		formatGrantSource(source) {
			if (source === 'official_auto') return '官方自动发放'
			if (source === 'legacy_user_group_migration') return '历史荣誉迁移'
			return '官方发放'
		},
		formatTitleTermType(type) {
			if (type === 'adjective') return '形容词词条'
			if (type === 'noun') return '名词词条'
			return '称号词条'
		},
		formatMetric(metricCode) {
			const metricMap = {
				read_seconds: '累计阅读时长（秒）',
				write_seconds: '累计写作时长（秒）',
				community_post_count: '累计发帖数',
				comment_count: '累计评论数',
			}
			return metricMap[metricCode] || metricCode || '进度指标'
		},
		formatPeriod(periodType) {
			const periodMap = {
				lifetime: '累计',
				month: '本月',
				quarter: '本季度',
				year: '本年',
			}
			return periodMap[periodType] || periodType || '累计'
		},
		formatConditionNumber(value) {
			const n = Number(value)
			if (!Number.isFinite(n)) return '0'
			if (Math.abs(n - Math.round(n)) < 0.001) {
				return String(Math.round(n))
			}
			return n.toFixed(2)
		},
		formatConditionProgress(condition) {
			if (!condition) return '0 / 0'
			return `${this.formatConditionNumber(condition.current_value)} / ${this.formatConditionNumber(condition.threshold_value)}`
		},
		formatConditionRule(condition) {
			if (!condition) return this.lockedRequirementText
			return `${this.formatMetric(condition.metric_code)} / ${this.formatPeriod(condition.period_type)}，需 ${condition.comparator || '>='} ${this.formatConditionNumber(condition.threshold_value)}`
		},
		formatProgressPercent(value) {
			const ratio = Number(value)
			if (!Number.isFinite(ratio)) return '0%'
			const percent = Math.max(0, Math.min(100, Math.round(ratio * 100)))
			return `${percent}%`
		},
		getLockedGroupTitle(groupIndex) {
			if (this.lockedConditionGroups.length > 1) {
				return `解锁路径 ${groupIndex + 1}`
			}
			return '解锁条件'
		},
		formatTime(value) {
			if (!value) return '未知'
			const d = new Date(value)
			if (Number.isNaN(d.getTime())) return '未知'
			const y = d.getFullYear()
			const m = String(d.getMonth() + 1).padStart(2, '0')
			const day = String(d.getDate()).padStart(2, '0')
			return `${y}年${m}月${day}日`
		},
		onMedalLongPress() {
			this.isLongPressing = true
			this.medalScale = 1.2
		},
		goBack() {
			uni.navigateBack()
		},
	},
}
</script>

<style scoped lang="scss">
.page {
	min-height: 100vh;
	background: #050505;
	overflow-x: hidden;
}

.medal-hero {
	position: relative;
	padding: 120rpx 0 80rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 50vh;
	overflow: hidden;
}

.ambient-glow {
	position: absolute;
	border-radius: 50%;
	pointer-events: none;
}

.ambient-glow-1 {
	width: 500rpx;
	height: 500rpx;
	background: radial-gradient(circle, rgba(200, 160, 80, 0.15) 0%, transparent 70%);
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	animation: ambient-pulse 4s ease-in-out infinite;
}

.ambient-glow-2 {
	width: 350rpx;
	height: 350rpx;
	background: radial-gradient(circle, rgba(255, 200, 100, 0.1) 0%, transparent 60%);
	top: 20%;
	right: 10%;
	animation: ambient-float 6s ease-in-out infinite;
}

.ambient-glow-3 {
	width: 280rpx;
	height: 280rpx;
	background: radial-gradient(circle, rgba(180, 140, 60, 0.08) 0%, transparent 60%);
	bottom: 15%;
	left: 15%;
	animation: ambient-float 8s ease-in-out infinite reverse;
}

@keyframes ambient-pulse {
	0%, 100% {
		opacity: 0.6;
		transform: translate(-50%, -50%) scale(1);
	}
	50% {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1.15);
	}
}

@keyframes ambient-float {
	0%, 100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-20rpx);
	}
}

.particle-container {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.particle {
	position: absolute;
	width: var(--size);
	height: var(--size);
	background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
	border-radius: 50%;
	animation: particle-orbit var(--duration) linear infinite;
	animation-delay: var(--delay);
	opacity: 0;
}

@keyframes particle-orbit {
	0% {
		transform: rotate(var(--angle)) translateX(var(--radius)) rotate(calc(-1 * var(--angle)));
		opacity: 0;
	}
	10% {
		opacity: 0.8;
	}
	90% {
		opacity: 0.8;
	}
	100% {
		transform: rotate(calc(var(--angle) + 360deg)) translateX(var(--radius)) rotate(calc(-1 * var(--angle) - 360deg));
		opacity: 0;
	}
}

.medal-3d-container {
	perspective: 1400rpx;
	width: 480rpx;
	height: 480rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	z-index: 2;
	user-select: none;
	-webkit-user-select: none;
	touch-action: none;
	-ms-touch-action: none;
}

.medal-shadow {
	position: absolute;
	width: 300rpx;
	height: 300rpx;
	border-radius: 50%;
	background: radial-gradient(circle, rgba(0, 0, 0, 0.6) 0%, transparent 70%);
	transition: all 0.15s ease-out;
	pointer-events: none;
	z-index: -1;
}

.medal-halo {
	position: absolute;
	width: 400rpx;
	height: 400rpx;
	border-radius: 50%;
	border: 2rpx solid rgba(255, 200, 100, 0.2);
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	animation: halo-rotate 20s linear infinite;
	pointer-events: none;
}

.medal-halo::before {
	content: '';
	position: absolute;
	inset: 8rpx;
	border-radius: 50%;
	border: 1rpx solid rgba(255, 180, 80, 0.15);
}

.medal-halo-2 {
	width: 460rpx;
	height: 460rpx;
	border-color: rgba(255, 200, 100, 0.08);
	animation-direction: reverse;
	animation-duration: 30s;
}

@keyframes halo-rotate {
	from {
		transform: translate(-50%, -50%) rotate(0deg);
	}
	to {
		transform: translate(-50%, -50%) rotate(360deg);
	}
}

.medal-3d {
	width: 340rpx;
	height: 340rpx;
	position: relative;
	transform-style: preserve-3d;
	transition: transform 0.08s ease-out;
	opacity: 0;
	animation: medal-entrance-fade 0.6s ease-out forwards;
}

.medal-3d:active {
	filter: brightness(1.08);
}

.medal-3d.is-locked-medal .medal-image {
	filter: grayscale(100%) brightness(0.82);
}

@keyframes medal-entrance-fade {
	0% {
		opacity: 0;
		filter: blur(8rpx);
	}
	100% {
		opacity: 1;
		filter: blur(0);
	}
}

.medal-face {
	position: absolute;
	inset: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	backface-visibility: hidden;
	border-radius: 50%;
}

.medal-front {
	background: linear-gradient(145deg, rgba(70, 55, 35, 0.9) 0%, rgba(45, 35, 20, 0.95) 100%);
	box-shadow:
		0 40rpx 100rpx rgba(0, 0, 0, 0.7),
		inset 0 4rpx 30rpx rgba(255, 215, 150, 0.15),
		inset 0 -4rpx 20rpx rgba(0, 0, 0, 0.3),
		inset 4rpx 0 20rpx rgba(255, 215, 150, 0.05),
		inset -4rpx 0 20rpx rgba(0, 0, 0, 0.2);
	border: 4rpx solid rgba(255, 200, 100, 0.25);
}

.medal-front.is-locked-front {
	background: linear-gradient(145deg, rgba(78, 82, 88, 0.92) 0%, rgba(48, 53, 60, 0.95) 100%);
	border-color: rgba(214, 220, 228, 0.18);
}

.medal-back {
	background: linear-gradient(145deg, rgba(30, 25, 15, 0.95) 0%, rgba(20, 15, 10, 0.98) 100%);
	box-shadow:
		inset 0 4rpx 30rpx rgba(0, 0, 0, 0.5),
		inset 0 -4rpx 20rpx rgba(255, 200, 100, 0.05);
	border: 4rpx solid rgba(180, 140, 60, 0.2);
	transform: rotateY(180deg);
}

.medal-back.is-locked-back {
	background: linear-gradient(145deg, rgba(36, 40, 45, 0.96) 0%, rgba(23, 27, 31, 0.98) 100%);
	border-color: rgba(173, 181, 189, 0.16);
}

.medal-image {
	width: 82%;
	height: 82%;
	filter: drop-shadow(0 10rpx 30rpx rgba(0, 0, 0, 0.5));
}

.medal-glow {
	position: absolute;
	inset: -60rpx;
	border-radius: 50%;
	background: radial-gradient(circle, rgba(255, 180, 50, 0.5) 0%, rgba(255, 150, 50, 0.3) 40%, transparent 70%);
	animation: pulse-glow 2.5s ease-in-out infinite;
	pointer-events: none;
	z-index: -1;
}

@keyframes pulse-glow {
	0%, 100% {
		opacity: 0.6;
		transform: scale(1);
	}
	50% {
		opacity: 1;
		transform: scale(1.1);
	}
}

.shine-effect {
	position: absolute;
	inset: 0;
	border-radius: 50%;
	background: linear-gradient(
		135deg,
		transparent 0%,
		transparent 40%,
		rgba(255, 255, 255, 0.3) 50%,
		transparent 60%,
		transparent 100%
	);
	animation: shine-sweep 3s ease-in-out infinite;
	pointer-events: none;
}

@keyframes shine-sweep {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.medal-placeholder {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 340rpx;
	height: 340rpx;
	position: relative;
}

.placeholder-ring {
	position: absolute;
	width: 280rpx;
	height: 280rpx;
	border-radius: 50%;
	border: 3rpx dashed rgba(255, 200, 100, 0.2);
	animation: placeholder-pulse 2s ease-in-out infinite;
}

@keyframes placeholder-pulse {
	0%, 100% {
		opacity: 0.3;
		transform: scale(1);
	}
	50% {
		opacity: 0.6;
		transform: scale(1.05);
	}
}

.placeholder-text {
	font-size: 28rpx;
	color: rgba(255, 200, 100, 0.3);
	letter-spacing: 8rpx;
	margin-top: 20rpx;
}

.hero-text {
	margin-top: 40rpx;
	opacity: 0;
	animation: hero-text-entrance 0.8s ease-out 0.5s forwards;
}

@keyframes hero-text-entrance {
	0% {
		opacity: 0;
		transform: translateY(20rpx);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

.hero-subtitle {
	font-size: 24rpx;
	color: rgba(255, 200, 100, 0.4);
	letter-spacing: 12rpx;
	font-weight: 300;
}

.hero-subtitle.is-locked-subtitle {
	color: rgba(214, 220, 228, 0.46);
}

.info-card {
	position: relative;
	margin: -40rpx 28rpx 28rpx;
	padding: 44rpx 36rpx;
	background: linear-gradient(
		180deg,
		rgba(30, 25, 18, 0.95) 0%,
		rgba(20, 16, 12, 0.98) 100%
	);
	border-radius: 36rpx;
	box-shadow:
		0 30rpx 80rpx rgba(0, 0, 0, 0.6),
		inset 0 1rpx 0 rgba(255, 200, 100, 0.1);
	border: 1rpx solid rgba(255, 200, 100, 0.08);
	opacity: 0;
	transform: translateY(40rpx);
	transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
	overflow: hidden;
}

.info-card.card-visible {
	opacity: 1;
	transform: translateY(0);
}

.card-shine-line {
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 2rpx;
	background: linear-gradient(90deg, transparent, rgba(255, 200, 100, 0.3), transparent);
	animation: card-shine 4s ease-in-out infinite;
}

@keyframes card-shine {
	0% {
		left: -100%;
	}
	50%, 100% {
		left: 100%;
	}
}

.info-header {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20rpx;
	margin-bottom: 24rpx;
}

.header-accent {
	width: 60rpx;
	height: 2rpx;
	background: linear-gradient(90deg, transparent, rgba(255, 200, 100, 0.4));
}

.header-accent:last-child {
	background: linear-gradient(90deg, rgba(255, 200, 100, 0.4), transparent);
}

.info-name {
	font-size: 42rpx;
	font-weight: 700;
	color: #f5e6d0;
	text-align: center;
	letter-spacing: 3rpx;
	text-shadow: 0 4rpx 20rpx rgba(255, 200, 100, 0.2);
}

.info-desc {
	font-size: 26rpx;
	color: #b8a898;
	line-height: 1.8;
	text-align: center;
	margin-top: 16rpx;
	padding: 0 16rpx;
}

.title-term-card {
	margin-top: 22rpx;
	padding: 22rpx 24rpx;
	border-radius: 26rpx;
	background: rgba(255, 255, 255, 0.06);
	border: 1rpx solid rgba(255, 200, 100, 0.08);
}

.title-term-label {
	font-size: 22rpx;
	color: #bfa78b;
	letter-spacing: 1rpx;
}

.title-term-value {
	margin-top: 10rpx;
	font-size: 30rpx;
	font-weight: 700;
	line-height: 1.45;
	color: #f4dfbf;
}

.title-term-desc {
	margin-top: 10rpx;
	font-size: 22rpx;
	line-height: 1.6;
	color: #a79279;
}

.info-divider {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	margin: 32rpx 0;
}

.divider-line {
	width: 80rpx;
	height: 1rpx;
	background: linear-gradient(90deg, transparent, rgba(207, 143, 63, 0.5), transparent);
}

.divider-diamond {
	width: 10rpx;
	height: 10rpx;
	background: #cf8f3f;
	transform: rotate(45deg);
}

.info-meta {
	margin-top: 8rpx;
	padding-top: 24rpx;
	border-top: 1rpx solid rgba(255, 200, 100, 0.06);
}

.locked-detail {
	margin-top: 8rpx;
	padding-top: 24rpx;
	border-top: 1rpx solid rgba(255, 255, 255, 0.06);
}

.locked-status-row {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 14rpx;
}

.locked-status-tag {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 8rpx 18rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
	font-weight: 600;
	color: #e9edf2;
	background: rgba(255, 255, 255, 0.1);
	border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.locked-status-text {
	font-size: 24rpx;
	line-height: 1.7;
	color: #c3ccd6;
}

.locked-loading {
	margin-top: 24rpx;
	padding: 26rpx 24rpx;
	border-radius: 22rpx;
	background: rgba(255, 255, 255, 0.06);
	font-size: 24rpx;
	color: #aab4bf;
	text-align: center;
}

.locked-sections {
	margin-top: 24rpx;
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.locked-section {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.locked-section-title {
	font-size: 24rpx;
	font-weight: 700;
	letter-spacing: 1rpx;
	color: #f0e5d5;
}

.locked-group-card,
.locked-empty-card,
.locked-progress-note {
	padding: 22rpx 24rpx;
	border-radius: 24rpx;
	background: rgba(255, 255, 255, 0.06);
	border: 1rpx solid rgba(255, 255, 255, 0.06);
}

.locked-group-card + .locked-group-card {
	margin-top: 8rpx;
}

.locked-group-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16rpx;
}

.locked-group-title {
	font-size: 24rpx;
	font-weight: 600;
	color: #f2e7d6;
}

.locked-group-state {
	font-size: 21rpx;
	color: #b4bec8;
}

.locked-group-state.matched {
	color: #ffe0a7;
}

.locked-condition {
	margin-top: 18rpx;
}

.locked-condition-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 14rpx;
}

.locked-condition-name {
	font-size: 23rpx;
	font-weight: 600;
	color: #e8edf2;
}

.locked-condition-progress {
	flex-shrink: 0;
	font-size: 22rpx;
	color: #ced7df;
}

.locked-condition-rule {
	display: block;
	margin-top: 8rpx;
	font-size: 21rpx;
	line-height: 1.6;
	color: #9fabb7;
}

.locked-progress-track {
	margin-top: 14rpx;
	height: 10rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.08);
	overflow: hidden;
}

.locked-progress-fill {
	height: 100%;
	border-radius: inherit;
	background: linear-gradient(90deg, #8f98a3 0%, #c4ccd4 100%);
}

.locked-progress-fill.matched {
	background: linear-gradient(90deg, #d9a95f 0%, #f4d497 100%);
}

.locked-empty-card,
.locked-progress-note {
	font-size: 23rpx;
	line-height: 1.7;
	color: #bbc6d0;
}

.meta-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16rpx 0;
	transition: background 0.3s ease;
}

.meta-item + .meta-item {
	border-top: 1rpx dashed rgba(255, 200, 100, 0.05);
}

.meta-label {
	font-size: 22rpx;
	color: #8a7a6a;
	letter-spacing: 1rpx;
}

.meta-value {
	font-size: 24rpx;
	color: #e0d4c4;
	font-weight: 500;
	letter-spacing: 1rpx;
}

.badge-actions {
	margin-top: 22rpx;
	padding-top: 22rpx;
	border-top: 1rpx solid rgba(255, 200, 100, 0.08);
}

.badge-action-hint {
	font-size: 22rpx;
	color: #b9a88f;
	text-align: center;
}

.badge-action-btn {
	margin: 14rpx auto 0;
	width: 280rpx;
	height: 72rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 25rpx;
	font-weight: 700;
	letter-spacing: 1rpx;
}

.badge-action-btn.is-set {
	color: #fff;
	background: linear-gradient(120deg, #cf8f3f 0%, #b77134 100%);
	box-shadow: 0 8rpx 24rpx rgba(183, 113, 52, 0.35);
}

.badge-action-btn.is-cancel {
	color: #f2dfc5;
	background: rgba(255, 255, 255, 0.1);
	border: 1rpx solid rgba(255, 200, 100, 0.35);
}

.badge-action-btn.is-loading {
	color: #9b8a73;
	background: rgba(255, 255, 255, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.14);
}

.card-footer {
	margin-top: 24rpx;
	display: flex;
	justify-content: center;
}

.footer-accent {
	width: 120rpx;
	height: 4rpx;
	background: linear-gradient(90deg, transparent, rgba(207, 143, 63, 0.4), transparent);
	border-radius: 2rpx;
}

.bottom-fade {
	height: 60rpx;
	background: linear-gradient(180deg, transparent, rgba(5, 5, 5, 0.8));
	margin-top: -30rpx;
}
</style>
