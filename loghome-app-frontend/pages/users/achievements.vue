<template>
	<view class="page" v-dark>
		<view class="hero-card">
			<view class="hero-title">原木勋章墙</view>
			<view class="hero-subtitle">官方授予勋章，展示你在原木社区的独特身份</view>

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

		<view class="list-head">
			<view class="list-title">已获得勋章</view>
		</view>

		<view v-if="list.length === 0" class="empty-card">
			<view class="empty-title">暂未获得荣誉勋章</view>
			<view class="empty-desc">继续参与社区活动，等待官方授予</view>
		</view>

		<view v-if="list.length > 0" class="wall-grid">
			<view
				v-for="item in list"
				:key="item.achievement_id"
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

		<view class="list-head" v-if="lockedList.length > 0">
			<view class="list-title locked-title">未获得勋章</view>
		</view>

		<view v-if="lockedList.length > 0" class="wall-grid locked-grid">
			<view
				v-for="item in lockedList"
				:key="item.achievement_id"
				class="wall-item locked"
			>
				<view class="wall-medal locked-medal">
					<honor-badge :badge="item" size="lg" :locked="true" />
				</view>
				<view class="wall-name locked-name">{{item.title}}</view>
				<view class="wall-meta">
					<view class="wall-locked-hint">待解锁</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'
import darkModeMixin from '@/mixins/dark-mode.js'
import HonorBadge from '../../components/honor-badge.vue'

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
		}
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
				const allDefinitions = (definitionsRes.data && definitionsRes.data.list) || [];
				const unlockedIds = new Set(this.list.map(item => item.achievement_id));
				this.lockedList = allDefinitions.filter(item => !unlockedIds.has(item.achievement_id));
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
</style>
