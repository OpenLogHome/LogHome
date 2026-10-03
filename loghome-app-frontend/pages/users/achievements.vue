<template>
	<view class="page" v-dark>
		<view class="hero-card">
			<view class="hero-title">原木勋章墙</view>

			<view class="hero-stat-row">
				<view class="stat-item">
					<text class="stat-value">{{summary.total_unlocked || 0}}</text>
					<text class="stat-label">已解锁</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-value">{{list.length}}</text>
					<text class="stat-label">可展示</text>
				</view>
			</view>

			<view class="selected-panel" @tap="goToBadgeDetail(summary.selected_badge)">
				<view class="selected-header">
					<view class="selected-title">当前名牌勋章</view>
					<view class="selected-badge-count" v-if="summary.total_unlocked">共{{summary.total_unlocked}}枚</view>
				</view>
				<view class="selected-content">
					<honor-badge
						v-if="summary.selected_badge"
						:badge="summary.selected_badge"
						:showTitle="true"
						size="lg"
						:scale="1.4"
					/>
					<view v-else class="selected-empty">
						<view class="selected-empty-icon">🏅</view>
						<view class="selected-empty-text">你还没有设置展示勋章</view>
					</view>
				</view>
			</view>
		</view>

		<view class="category-summary">
			<view
				v-for="section in categorizedSections"
				:key="section.key"
				class="category-summary-item"
			>
				<view class="category-summary-name">{{section.title}}</view>
				<view class="category-summary-text">{{section.summaryText}}</view>
			</view>
		</view>

		<view class="title-card">
			<view class="title-card-head">
				<view class="title-card-main">
					<view class="title-card-title">我的称号</view>
					<view class="title-card-hint">解锁带有词条的勋章后，可组合一个形容词词条和一个名词词条</view>
				</view>
				<view class="title-visibility">
					<text class="title-visibility-text">{{ titleForm.is_visible ? '展示中' : '默认不展示' }}</text>
					<switch
						class="title-visibility-switch"
						color="#c78742"
						:checked="titleForm.is_visible"
						@change="onTitleVisibleChange"
					/>
				</view>
			</view>

			<view class="title-preview-box">
				<view class="title-preview-label">称号预览</view>
				<view class="title-preview-text" :class="{ empty: !titlePreviewText }">
					{{ titlePreviewText || '暂未组合称号' }}
				</view>
			</view>

			<view class="title-picker-grid">
				<picker
					mode="selector"
					:range="adjectivePickerLabels"
					:value="selectedAdjectiveIndex"
					:disabled="adjectiveTermOptions.length <= 1"
					@change="onAdjectiveChange"
				>
					<view class="title-picker-card" :class="{ disabled: adjectiveTermOptions.length <= 1 }">
						<view class="title-picker-label">形容词词条</view>
						<view class="title-picker-value">
							{{ selectedAdjectiveOption.text || '不使用形容词' }}
						</view>
						<view class="title-picker-source">
							{{ selectedAdjectiveOption.sourceTitle || (adjectiveTermOptions.length > 1 ? '点击切换' : '暂无可用词条') }}
						</view>
					</view>
				</picker>

				<picker
					mode="selector"
					:range="nounPickerLabels"
					:value="selectedNounIndex"
					:disabled="nounTermOptions.length <= 1"
					@change="onNounChange"
				>
					<view class="title-picker-card" :class="{ disabled: nounTermOptions.length <= 1 }">
						<view class="title-picker-label">名词词条</view>
						<view class="title-picker-value">
							{{ selectedNounOption.text || '不使用名词' }}
						</view>
						<view class="title-picker-source">
							{{ selectedNounOption.sourceTitle || (nounTermOptions.length > 1 ? '点击切换' : '暂无可用词条') }}
						</view>
					</view>
				</picker>
			</view>

			<view class="title-available-tip">{{ titleAvailableTip }}</view>

			<view
				class="title-save-btn"
				:class="{ loading: titleSaving }"
				@tap="saveTitleProfile"
			>
				{{ titleSaving ? '保存中...' : '保存称号设置' }}
			</view>
		</view>

		<view
			v-for="section in categorizedSections"
			:key="section.key"
			class="category-section"
		>
			<view class="list-head category-head">
				<view class="category-head-main">
					<view class="list-title">{{section.title}}</view>
					<view class="list-hint">{{section.description}}</view>
				</view>
				<view class="category-count">
					{{section.totalCount > 0 ? (section.unlocked.length + ' / ' + section.totalCount) : '未开放'}}
				</view>
			</view>

			<view v-if="section.unlocked.length > 0" class="wall-grid">
				<view
					v-for="item in section.unlocked"
					:key="'unlocked-' + section.key + '-' + item.achievement_id"
					class="wall-item"
					:class="{ selected: item.is_selected }"
					@tap="goToBadgeDetail(item)"
				>
					<view class="wall-medal">
						<honor-badge :badge="item" size="lg" />
					</view>
					<view class="wall-name">{{item.title}}</view>
					<view class="wall-meta">
						<view class="wall-selected" v-if="item.is_selected">展示中</view>
						<view class="wall-time">{{formatTime(item.granted_at)}}</view>
					</view>
				</view>
			</view>

			<view v-else class="empty-card category-empty-card">
				<view class="empty-title">{{section.emptyUnlockedTitle}}</view>
				<view class="empty-desc">{{section.emptyUnlockedDesc}}</view>
			</view>

			<view class="subsection-head" v-if="section.locked.length > 0">
				<view class="subsection-title">待解锁</view>
			</view>

			<view v-if="section.locked.length > 0" class="wall-grid locked-grid">
				<view
					v-for="item in section.locked"
					:key="'locked-' + section.key + '-' + item.achievement_id"
					class="wall-item locked"
					@tap="goToBadgeDetail(item)"
				>
					<view class="wall-medal locked-medal">
						<honor-badge :badge="item" size="lg" :locked="true" />
					</view>
					<view class="wall-name locked-name">{{item.title}}</view>
					<view class="wall-meta">
						<view class="wall-locked-hint">待解锁 · 查看条件</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'
import darkModeMixin from '@/mixins/dark-mode.js'
import HonorBadge from '../../components/honor-badge.vue'

const ACHIEVEMENT_CATEGORY_CONFIG = [
	{
		key: 'monthly',
		title: '每月限定',
		description: '每个月都会专门设计一个荣誉勋章，完成指定目标即可获得。',
		emptyUnlockedTitle: '暂未获得每月限定勋章',
		emptyUnlockedDesc: '每月限定勋章会按月更新，完成当月目标后即可点亮。',
	},
	{
		key: 'official',
		title: '官方发放',
		description: '官方特别授予的身份荣誉，例如奠基人、体验官等。',
		emptyUnlockedTitle: '暂未获得官方发放荣誉',
		emptyUnlockedDesc: '持续参与社区建设，等待官方授予专属荣誉。',
	},
	{
		key: 'growth',
		title: '成长任务',
		description: '通过累计阅读、写作、发帖、评论等成长行为逐步解锁。',
		emptyUnlockedTitle: '暂未获得成长任务勋章',
		emptyUnlockedDesc: '继续积累阅读、写作、发帖和评论数据，逐步解锁成长荣誉。',
	},
];

export default {
	components: {
		HonorBadge,
	},
	mixins: [darkModeMixin],
	data() {
		return {
			summary: {},
			list: [],
			lockedList: [],
			loading: false,
			currentUserId: 0,
			titleSaving: false,
			titleForm: {
				adjective_achievement_id: null,
				noun_achievement_id: null,
				is_visible: false,
			},
		}
	},
	computed: {
		categorizedSections() {
			const unlockedMap = this.groupAchievementsByCategory(this.list);
			const lockedMap = this.groupAchievementsByCategory(this.lockedList);
			return ACHIEVEMENT_CATEGORY_CONFIG.map((section) => {
				const unlocked = unlockedMap[section.key] || [];
				const locked = lockedMap[section.key] || [];
				return {
					...section,
					unlocked,
					locked,
					totalCount: unlocked.length + locked.length,
					summaryText: this.formatSectionSummary(unlocked.length, locked.length),
				};
			});
		},
		adjectiveTermOptions() {
			const options = (this.list || [])
				.filter(item => item && item.title_term_type === 'adjective' && item.title_term_text)
				.map(item => ({
					achievement_id: item.achievement_id,
					text: item.title_term_text,
					sourceTitle: item.title,
					label: `${item.title_term_text} · ${item.title}`,
				}));
			return [{
				achievement_id: null,
				text: '',
				sourceTitle: '',
				label: '不使用形容词',
			}].concat(options);
		},
		nounTermOptions() {
			const options = (this.list || [])
				.filter(item => item && item.title_term_type === 'noun' && item.title_term_text)
				.map(item => ({
					achievement_id: item.achievement_id,
					text: item.title_term_text,
					sourceTitle: item.title,
					label: `${item.title_term_text} · ${item.title}`,
				}));
			return [{
				achievement_id: null,
				text: '',
				sourceTitle: '',
				label: '不使用名词',
			}].concat(options);
		},
		adjectivePickerLabels() {
			return this.adjectiveTermOptions.map(item => item.label);
		},
		nounPickerLabels() {
			return this.nounTermOptions.map(item => item.label);
		},
		selectedAdjectiveIndex() {
			const targetId = Number(this.titleForm.adjective_achievement_id);
			const index = this.adjectiveTermOptions.findIndex(item => Number(item.achievement_id) === targetId);
			return index >= 0 ? index : 0;
		},
		selectedNounIndex() {
			const targetId = Number(this.titleForm.noun_achievement_id);
			const index = this.nounTermOptions.findIndex(item => Number(item.achievement_id) === targetId);
			return index >= 0 ? index : 0;
		},
		selectedAdjectiveOption() {
			return this.adjectiveTermOptions[this.selectedAdjectiveIndex] || this.adjectiveTermOptions[0] || {};
		},
		selectedNounOption() {
			return this.nounTermOptions[this.selectedNounIndex] || this.nounTermOptions[0] || {};
		},
		titlePreviewText() {
			return `${this.selectedAdjectiveOption.text || ''}${this.selectedNounOption.text || ''}`.trim();
		},
		titleAvailableTip() {
			const adjectiveCount = Math.max(0, this.adjectiveTermOptions.length - 1);
			const nounCount = Math.max(0, this.nounTermOptions.length - 1);
			if (adjectiveCount === 0 && nounCount === 0) {
				return '当前还没有可用词条，获得已配置词条的勋章后即可组合称号。';
			}
			return `已解锁 ${adjectiveCount} 个形容词词条，${nounCount} 个名词词条。`;
		},
	},
	onShow() {
		this.syncCurrentUserId();
		this.loadData();
	},
	methods: {
		syncCurrentUserId() {
			try {
				const localData = window.localStorage.getItem('LogHomeUserInfo');
				if (!localData) return;
				const parsed = JSON.parse(localData);
				const uid = Number(parsed && parsed.user_id);
				if (Number.isFinite(uid) && uid > 0) {
					this.currentUserId = uid;
				}
			} catch (e) {}
		},
		getToken() {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) return tk.tk;
				return '';
			} catch (e) {
				return '';
			}
		},
		getAuthHeaders() {
			const tk = this.getToken();
			return {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + tk,
			};
		},
		async loadData() {
			if (this.loading) return;
			const tk = this.getToken();
			if (!tk) {
				uni.navigateTo({
					url: './login?msg=unAuthorized',
				});
				return;
			}

			this.loading = true;
			try {
				const [summaryRes, listRes, definitionsRes] = await Promise.all([
					axios.get(this.$baseUrl + '/users/achievements_summary', {
						headers: this.getAuthHeaders(),
					}),
					axios.get(this.$baseUrl + '/users/achievements', {
						headers: this.getAuthHeaders(),
					}),
					axios.get(this.$baseUrl + '/users/achievements_definitions', {
						headers: this.getAuthHeaders(),
					}),
				]);
				this.summary = summaryRes.data || {};
				this.list = (listRes.data && listRes.data.list) || [];
				this.syncTitleForm(this.summary.title_profile);
				const allDefinitions = (definitionsRes.data && definitionsRes.data.list) || [];
				const unlockedIds = new Set(this.list.map(item => item.achievement_id));
				this.lockedList = allDefinitions
					.filter(item => !unlockedIds.has(item.achievement_id))
					.map(item => ({
						...item,
						is_locked: true,
					}));
				if (!this.currentUserId) {
					try {
						const profileRes = await axios.get(this.$baseUrl + '/users/userprofile', {
							headers: {
								'Content-Type': 'application/json',
								Authorization: this.getToken(),
							},
						})
						const uid = Number(profileRes.data && profileRes.data.user_id)
						if (Number.isFinite(uid) && uid > 0) {
							this.currentUserId = uid
						}
					} catch (e) {}
				}
			} catch (e) {
				uni.showToast({
					title: '加载失败',
					icon: 'none',
				});
			} finally {
				this.loading = false;
			}
		},
		syncTitleForm(profile) {
			this.titleForm = {
				adjective_achievement_id: profile && profile.adjective_achievement_id ? Number(profile.adjective_achievement_id) : null,
				noun_achievement_id: profile && profile.noun_achievement_id ? Number(profile.noun_achievement_id) : null,
				is_visible: !!(profile && profile.is_visible),
			};
		},
		onAdjectiveChange(event) {
			const index = Number(event && event.detail && event.detail.value);
			const option = this.adjectiveTermOptions[index] || this.adjectiveTermOptions[0];
			this.titleForm.adjective_achievement_id = option && option.achievement_id ? option.achievement_id : null;
		},
		onNounChange(event) {
			const index = Number(event && event.detail && event.detail.value);
			const option = this.nounTermOptions[index] || this.nounTermOptions[0];
			this.titleForm.noun_achievement_id = option && option.achievement_id ? option.achievement_id : null;
		},
		onTitleVisibleChange(event) {
			this.titleForm.is_visible = !!(event && event.detail && event.detail.value);
		},
		persistUserTitleCache(titleProfile) {
			try {
				const localData = window.localStorage.getItem('LogHomeUserInfo');
				if (!localData) return;
				const parsed = JSON.parse(localData);
				parsed.title_profile = titleProfile;
				parsed.display_title = titleProfile && titleProfile.display_text ? titleProfile.display_text : '';
				window.localStorage.setItem('LogHomeUserInfo', JSON.stringify(parsed));
			} catch (e) {}
		},
		async saveTitleProfile() {
			if (this.titleSaving) return;
			this.titleSaving = true;
			try {
				const res = await axios.post(
					this.$baseUrl + '/users/title_profile',
					{
						adjective_achievement_id: this.titleForm.adjective_achievement_id,
						noun_achievement_id: this.titleForm.noun_achievement_id,
						is_visible: this.titleForm.is_visible,
					},
					{
						headers: this.getAuthHeaders(),
					},
				);
				const titleProfile = res.data && res.data.title_profile ? res.data.title_profile : null;
				this.summary = {
					...(this.summary || {}),
					title_profile: titleProfile,
				};
				this.syncTitleForm(titleProfile);
				this.persistUserTitleCache(titleProfile);
				uni.showToast({
					title: '称号已保存',
					icon: 'none',
				});
			} catch (e) {
				uni.showToast({
					title: '保存失败',
					icon: 'none',
				});
			} finally {
				this.titleSaving = false;
			}
		},
		goToBadgeDetail(badge) {
			if (!badge) return
			uni.setStorageSync('badgeDetailPayload', badge)
			if (this.currentUserId > 0) {
				uni.setStorageSync('badgeDetailOwnerId', this.currentUserId)
			}
			const query = []
			const encodedBadge = encodeURIComponent(JSON.stringify(badge))
			if (encodedBadge) query.push('badge=' + encodedBadge)
			if (this.currentUserId > 0) query.push('owner_id=' + this.currentUserId)
			query.push('is_selected=' + (badge.is_selected ? '1' : '0'))
			query.push('locked=' + (badge.is_locked ? '1' : '0'))
			const fullQuery = query.length ? ('?' + query.join('&')) : ''
			uni.navigateTo({
				url: '/pages/users/badgeDetail' + fullQuery,
				fail: () => {
					const fallback = this.currentUserId > 0
						? ('/pages/users/badgeDetail?owner_id=' + this.currentUserId)
						: '/pages/users/badgeDetail'
					uni.navigateTo({
						url: fallback,
					})
				},
			})
		},
		formatTime(value) {
			if (!value) return '';
			const d = new Date(value);
			if (Number.isNaN(d.getTime())) return '';
			const y = d.getFullYear();
			const m = String(d.getMonth() + 1).padStart(2, '0');
			const day = String(d.getDate()).padStart(2, '0');
			return `${y}年${m}月${day}日`;
		},
		groupAchievementsByCategory(list) {
			return (list || []).reduce((acc, item) => {
				const categoryKey = this.getAchievementCategory(item);
				if (!acc[categoryKey]) {
					acc[categoryKey] = [];
				}
				acc[categoryKey].push(item);
				return acc;
			}, {});
		},
		getAchievementCategory(item) {
			if (!item) return 'official';

			const explicitCategory = item.category_key || item.category || item.achievement_category;
			if (explicitCategory) {
				if (explicitCategory === 'monthly_limited') return 'monthly';
				if (ACHIEVEMENT_CATEGORY_CONFIG.some(section => section.key === explicitCategory)) {
					return explicitCategory;
				}
			}

			const keyText = String(item.achievement_key || '').toLowerCase();
			const titleText = String(item.title || '').toLowerCase();
			const descText = String(item.description || '').toLowerCase();
			const sourceText = String(item.grant_source || '').toLowerCase();
			const modeText = String(item.grant_mode || '').toLowerCase();
			const combinedText = `${keyText} ${titleText} ${descText} ${sourceText} ${modeText}`;

			if (
				this.matchesMonthlyCategory(combinedText) ||
				/[0-9]{4}年[0-9]{1,2}月/.test(String(item.title || '')) ||
				/[0-9]{4}-[0-9]{1,2}/.test(String(item.achievement_key || ''))
			) {
				return 'monthly';
			}

			if (this.matchesGrowthCategory(combinedText)) {
				return 'growth';
			}

			return 'official';
		},
		matchesMonthlyCategory(text) {
			return [
				'monthly',
				'month',
				'every_month',
				'calendar_month',
				'每月',
				'月度',
				'本月',
				'当月',
				'限定',
			].some(keyword => text.includes(keyword));
		},
		matchesGrowthCategory(text) {
			return [
				'growth',
				'task',
				'mission',
				'read',
				'reading',
				'write',
				'writing',
				'post',
				'comment',
				'duration',
				'time',
				'streak',
				'累计',
				'成长',
				'任务',
				'阅读',
				'写作',
				'发帖',
				'评论',
				'时长',
				'连续',
			].some(keyword => text.includes(keyword));
		},
		formatSectionSummary(unlockedCount, lockedCount) {
			const totalCount = unlockedCount + lockedCount;
			if (totalCount === 0) {
				return '暂未开放';
			}
			if (lockedCount === 0) {
				return `已解锁 ${unlockedCount} 枚`;
			}
			return `已解锁 ${unlockedCount} 枚，待解锁 ${lockedCount} 枚`;
		},
	},
}
</script>

<style scoped lang="scss">
.page {
	padding: 24rpx 24rpx 30rpx;
	background: linear-gradient(180deg, #f4eee5 0%, #f7f8fb 34%, #f6f7fb 100%);
	min-height: calc(100vh - 44px - 48rpx);

	.dark-mode & {
		background: linear-gradient(180deg, #161a20 0%, #0f1318 100%);
	}
}

.hero-card {
	background: linear-gradient(140deg, #3d2c1f 0%, #503624 44%, #714627 100%);
	border-radius: 24rpx;
	padding: 26rpx 24rpx 24rpx;
	box-shadow: 0 18rpx 36rpx rgba(60, 33, 14, 0.2);
	color: #f7e9d2;
}

.hero-title {
	font-size: 38rpx;
	font-weight: 700;
	letter-spacing: 1rpx;
}

.hero-subtitle {
	margin-top: 8rpx;
	font-size: 23rpx;
	color: rgba(247, 233, 210, 0.85);
}

.hero-stat-row {
	margin-top: 22rpx;
	padding: 18rpx 20rpx;
	border-radius: 16rpx;
	background: rgba(255, 255, 255, 0.1);
	display: flex;
	align-items: center;
}

.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-value {
	font-size: 46rpx;
	font-weight: 700;
	line-height: 1.05;
	color: #ffe6ad;
}

.stat-label {
	margin-top: 6rpx;
	font-size: 22rpx;
	color: rgba(255, 241, 218, 0.88);
}

.stat-divider {
	width: 2rpx;
	height: 56rpx;
	background: rgba(255, 255, 255, 0.25);
}

.selected-panel {
	margin-top: 20rpx;
	padding: 20rpx 24rpx;
	border-radius: 18rpx;
	background: rgba(255, 255, 255, 0.12);
	border: 1rpx solid rgba(255, 255, 255, 0.14);
	cursor: pointer;
}

.selected-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.selected-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #fbe7bf;
}

.selected-badge-count {
	font-size: 22rpx;
	color: rgba(255, 241, 218, 0.7);
	padding: 6rpx 16rpx;
	background: rgba(255, 255, 255, 0.08);
	border-radius: 999rpx;
}

.selected-content {
	margin-top: 16rpx;
	min-height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 8rpx 0;
}

.selected-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
}

.selected-empty-icon {
	font-size: 56rpx;
	opacity: 0.7;
}

.selected-empty-text {
	font-size: 25rpx;
	color: rgba(255, 241, 218, 0.75);
}

.list-head {
	margin: 24rpx 4rpx 14rpx;
}

.category-summary {
	margin-top: 24rpx;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 12rpx;
}

.title-card {
	margin-top: 24rpx;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 22rpx;
	padding: 22rpx 20rpx 20rpx;
	border: 1rpx solid rgba(173, 131, 85, 0.16);
	box-shadow: 0 10rpx 24rpx rgba(69, 45, 20, 0.08);

	.dark-mode & {
		background: rgba(28, 34, 41, 0.94);
		border-color: rgba(255, 210, 150, 0.14);
		box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.24);
	}
}

.title-card-head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16rpx;
}

.title-card-main {
	flex: 1;
}

.title-card-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #2f241a;

	.dark-mode & {
		color: #eadcc8;
	}
}

.title-card-hint {
	margin-top: 8rpx;
	font-size: 22rpx;
	line-height: 1.5;
	color: #8a7969;

	.dark-mode & {
		color: #b0a392;
	}
}

.title-visibility {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8rpx;
}

.title-visibility-text {
	font-size: 22rpx;
	color: #7e5f3d;

	.dark-mode & {
		color: #f0d9b6;
	}
}

.title-preview-box {
	margin-top: 18rpx;
	padding: 18rpx 20rpx;
	border-radius: 18rpx;
	background: linear-gradient(135deg, #f7efe0 0%, #fff9f1 100%);

	.dark-mode & {
		background: linear-gradient(135deg, #302417 0%, #3b2b1d 100%);
	}
}

.title-preview-label {
	font-size: 21rpx;
	color: #8e7d69;

	.dark-mode & {
		color: #b9ab98;
	}
}

.title-preview-text {
	margin-top: 10rpx;
	font-size: 34rpx;
	font-weight: 700;
	color: #5a3b1f;
	line-height: 1.4;

	.dark-mode & {
		color: #ffe3b8;
	}
}

.title-preview-text.empty {
	color: #a8998c;
	font-weight: 600;

	.dark-mode & {
		color: #8c8175;
	}
}

.title-picker-grid {
	margin-top: 16rpx;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12rpx;
}

.title-picker-card {
	min-height: 132rpx;
	padding: 18rpx 18rpx 16rpx;
	border-radius: 18rpx;
	background: #fff;
	border: 1rpx solid rgba(173, 131, 85, 0.16);

	.dark-mode & {
		background: #212831;
		border-color: rgba(255, 210, 150, 0.14);
	}
}

.title-picker-card.disabled {
	opacity: 0.65;
}

.title-picker-label {
	font-size: 21rpx;
	color: #8e7d69;

	.dark-mode & {
		color: #b6aa9b;
	}
}

.title-picker-value {
	margin-top: 12rpx;
	font-size: 28rpx;
	font-weight: 700;
	color: #2f241a;
	line-height: 1.35;

	.dark-mode & {
		color: #eee0ce;
	}
}

.title-picker-source {
	margin-top: 10rpx;
	font-size: 20rpx;
	color: #9a8c81;
	line-height: 1.4;

	.dark-mode & {
		color: #988d80;
	}
}

.title-available-tip {
	margin-top: 14rpx;
	font-size: 21rpx;
	line-height: 1.5;
	color: #8a7969;

	.dark-mode & {
		color: #b0a392;
	}
}

.title-save-btn {
	margin-top: 18rpx;
	height: 78rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	font-weight: 700;
	color: #fff;
	background: linear-gradient(120deg, #c48a43 0%, #a96a2f 100%);
	box-shadow: 0 10rpx 24rpx rgba(169, 106, 47, 0.22);
}

.title-save-btn.loading {
	opacity: 0.7;
}

.category-summary-item {
	background: rgba(255, 255, 255, 0.75);
	border: 1rpx solid rgba(173, 131, 85, 0.14);
	border-radius: 18rpx;
	padding: 18rpx 16rpx;
	box-shadow: 0 8rpx 20rpx rgba(69, 45, 20, 0.06);

	.dark-mode & {
		background: rgba(31, 37, 44, 0.92);
		border-color: rgba(255, 210, 150, 0.12);
		box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.22);
	}
}

.category-summary-name {
	font-size: 24rpx;
	font-weight: 700;
	color: #3f2f22;

	.dark-mode & {
		color: #eadbc8;
	}
}

.category-summary-text {
	margin-top: 8rpx;
	font-size: 21rpx;
	line-height: 1.45;
	color: #8b7d72;

	.dark-mode & {
		color: #b2a698;
	}
}

.category-section {
	margin-top: 10rpx;
}

.category-head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16rpx;
}

.category-head-main {
	flex: 1;
}

.category-count {
	flex-shrink: 0;
	margin-top: 4rpx;
	padding: 8rpx 18rpx;
	border-radius: 999rpx;
	font-size: 21rpx;
	font-weight: 600;
	color: #7b5a36;
	background: rgba(214, 166, 82, 0.12);

	.dark-mode & {
		color: #f0dcb9;
		background: rgba(255, 214, 153, 0.12);
	}
}

.list-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #2c221a;

	.dark-mode & {
		color: #e5dccf;
	}
}

.list-hint {
	margin-top: 6rpx;
	font-size: 22rpx;
	color: #8e7d69;

	.dark-mode & {
		color: #a79a8b;
	}
}

.empty-card {
	background: #fff;
	border-radius: 18rpx;
	padding: 38rpx 26rpx;
	border: 2rpx dashed #e2d2be;

	.dark-mode & {
		background: #1f252c;
		border-color: #3b454f;
	}
}

.category-empty-card {
	margin-top: 2rpx;
}

.subsection-head {
	margin: 16rpx 4rpx 12rpx;
}

.subsection-title {
	display: inline-flex;
	align-items: center;
	padding: 6rpx 16rpx;
	border-radius: 999rpx;
	font-size: 21rpx;
	color: #8e7d69;
	background: rgba(142, 125, 105, 0.1);

	.dark-mode & {
		color: #b9ac9d;
		background: rgba(185, 172, 157, 0.12);
	}
}

.empty-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #5f4b3c;

	.dark-mode & {
		color: #e6d6c4;
	}
}

.empty-desc {
	margin-top: 10rpx;
	font-size: 24rpx;
	color: #8b7d72;

	.dark-mode & {
		color: #b2a698;
	}
}

.wall-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 14rpx;
}

.wall-item {
	background: linear-gradient(180deg, #fff8ef 0%, #fff 100%);
	border-radius: 18rpx;
	padding: 18rpx 14rpx 16rpx;
	border: 1rpx solid rgba(173, 131, 85, 0.18);
	box-shadow: 0 8rpx 18rpx rgba(69, 45, 20, 0.08);
	display: flex;
	flex-direction: column;
	align-items: center;

	.dark-mode & {
		background: linear-gradient(180deg, #222a33 0%, #1b222a 100%);
		border-color: rgba(255, 210, 150, 0.18);
		box-shadow: 0 10rpx 18rpx rgba(0, 0, 0, 0.28);
	}
}

.wall-item.selected {
	border-color: rgba(214, 166, 82, 0.58);
	box-shadow: 0 10rpx 24rpx rgba(153, 104, 47, 0.18);
}

.wall-medal {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.wall-name {
	margin-top: 14rpx;
	font-size: 25rpx;
	font-weight: 600;
	color: #2a221d;
	text-align: center;
	line-height: 1.3;

	.dark-mode & {
		color: #efe5d8;
	}
}

.wall-meta {
	margin-top: 10rpx;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.wall-selected {
	font-size: 20rpx;
	color: #fff;
	background: linear-gradient(120deg, #cf8f3f 0%, #b77134 100%);
	padding: 6rpx 14rpx;
	border-radius: 999rpx;
}

.wall-time {
	font-size: 21rpx;
	color: #8e7f75;
	text-align: center;

	.dark-mode & {
		color: #baae9f;
	}
}

.wall-desc-card {
	margin-top: 14rpx;
	background: #fff;
	border-radius: 16rpx;
	padding: 18rpx 20rpx;
	border: 1rpx solid rgba(173, 131, 85, 0.14);

	.dark-mode & {
		background: #1e252d;
		border-color: rgba(255, 210, 150, 0.14);
	}
}

.wall-desc-title {
	font-size: 24rpx;
	font-weight: 600;
	color: #55402f;

	.dark-mode & {
		color: #dbc7af;
	}
}

.wall-desc-text {
	margin-top: 8rpx;
	font-size: 22rpx;
	line-height: 1.5;
	color: #8b7d72;

	.dark-mode & {
		color: #b2a698;
	}
}

.locked-title {
	color: #8e7d69;

	.dark-mode & {
		color: #a79a8b;
	}
}

.locked-grid {
	margin-top: 2rpx;
	opacity: 0.85;
}

.wall-item.locked {
	background: linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%);
	border-color: rgba(150, 150, 150, 0.25);
	box-shadow: 0 6rpx 14rpx rgba(0, 0, 0, 0.06);
	opacity: 0.75;

	.dark-mode & {
		background: linear-gradient(180deg, #2a2f36 0%, #23282f 100%);
		border-color: rgba(100, 100, 100, 0.25);
		box-shadow: 0 8rpx 14rpx rgba(0, 0, 0, 0.3);
	}
}

.locked-medal {
	opacity: 0.5;
	filter: grayscale(100%);
}

.locked-name {
	color: #9a9a9a;

	.dark-mode & {
		color: #7a7a7a;
	}
}

.wall-locked-hint {
	font-size: 20rpx;
	color: #aaa;
	background: #e5e5e5;
	padding: 6rpx 14rpx;
	border-radius: 999rpx;

	.dark-mode & {
		color: #888;
		background: #3a3f46;
	}
}

@media screen and (max-width: 768px) {
	.category-summary {
		grid-template-columns: 1fr;
	}

	.title-picker-grid {
		grid-template-columns: 1fr;
	}
}
</style>
