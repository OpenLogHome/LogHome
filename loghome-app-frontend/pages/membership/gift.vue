<template>
	<view class="membership-subpage" :class="{ 'membership-subpage--super': selectedTier === 'super' }">
		<view class="subpage-header">
			<view class="subpage-header__back" @tap="goBack"><view class="subpage-header__back-icon"></view></view>
			<text class="subpage-header__title">赠送好友</text>
			<view class="subpage-header__spacer"></view>
		</view>

		<view class="subpage-content">
			<view class="subpage-hero">
				<view class="subpage-hero__icon">
					<image src="/static/membership/icons/gift-pass.svg" mode="aspectFit"></image>
				</view>
				<view class="subpage-hero__copy">
					<text class="subpage-hero__eyebrow">GIFT A PASS</text>
					<text class="subpage-hero__title">把成长送给好友</text>
					<text class="subpage-hero__description">选择通行证与时长，权益将直接发放给对方</text>
				</view>
			</view>

			<view class="subpage-panel">
				<text class="panel-title">选择通行证</text>
				<view class="tier-grid">
					<view
						v-for="tier in tiers"
						:key="tier.key"
						class="tier-card"
						:class="{ 'tier-card--selected': selectedTier === tier.key }"
						@tap="selectTier(tier.key)"
					>
						<image class="tier-card__logo" :src="tier.logo" mode="aspectFit"></image>
						<view class="tier-card__copy">
							<text class="tier-card__name">{{ tier.name }}</text>
							<text class="tier-card__description">{{ tier.description }}</text>
						</view>
						<view class="tier-card__radio"><view></view></view>
					</view>
				</view>

				<view class="field-group">
					<view class="field-label">
						<text>赠送时长</text>
						<text class="field-label__hint">年卡更划算</text>
					</view>
					<view class="period-grid">
						<view
							v-for="period in activeTier.plans"
							:key="period.key"
							class="period-card"
							:class="{ 'period-card--selected': selectedPeriod === period.key }"
							@tap="selectedPeriod = period.key"
						>
							<text class="period-card__name">{{ period.name }}</text>
							<view class="period-card__price">
								<image src="/static/resources/log.png" mode="aspectFit"></image>
								<text>{{ period.price }}</text>
								<text class="period-card__unit">原木</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="subpage-panel">
				<text class="panel-title">选择好友</text>
				<text class="panel-description">关注的人与关注你的粉丝都会显示在好友选择器中</text>

				<view class="field-group">
					<view class="field-label">
						<text>接收好友</text>
						<text class="field-label__hint">必填</text>
					</view>
					<view class="friend-control" @tap="openFriendPicker">
						<image
							v-if="selectedFriend"
							class="friend-control__avatar"
							:src="selectedFriend.avatar_url || defaultAvatar"
							mode="aspectFill"
						></image>
						<view v-else class="friend-control__placeholder-icon">+</view>
						<view class="friend-control__copy">
							<text class="friend-control__name">{{ selectedFriend ? selectedFriend.name : '从好友列表中选择' }}</text>
							<text class="friend-control__meta">
								{{ selectedFriend ? `ID:${selectedFriend.user_id} · ${relationLabel(selectedFriend)}` : '关注与粉丝共 ' + friends.length + ' 人' }}
							</text>
						</view>
						<text class="friend-control__arrow">›</text>
					</view>
				</view>

				<view class="field-group">
					<view class="field-label">
						<text>赠言</text>
						<text class="field-label__hint">{{ message.length }}/60</text>
					</view>
					<textarea
						class="gift-message"
						v-model="message"
						maxlength="60"
						placeholder="写一句想对好友说的话"
						placeholder-style="color:#7f7062"
					></textarea>
				</view>
			</view>

			<view class="gift-summary">
				<view>
					<text class="gift-summary__label">应付</text>
					<text class="gift-summary__detail">{{ activeTier.name }} · {{ activePlan.name }}</text>
				</view>
				<view class="gift-summary__price">
					<image src="/static/resources/log.png" mode="aspectFit"></image>
					<text>{{ activePlan.price }}</text>
					<text class="gift-summary__unit">原木</text>
				</view>
			</view>

			<view class="primary-action" :class="{ 'primary-action--disabled': !canSubmit }" @tap="submitGift">
				{{ submitting ? '处理中...' : '确认赠送' }}
			</view>
			<text class="gift-agreement" @tap="gotoRules">赠送即表示同意《原木通行证赠送规则》</text>
		</view>

		<view v-if="friendPickerVisible" class="friend-picker-mask" @tap="closeFriendPicker">
			<view class="friend-picker" @tap.stop>
				<view class="friend-picker__handle"></view>
				<view class="friend-picker__header">
					<view>
						<text class="friend-picker__title">选择赠送好友</text>
						<text class="friend-picker__count">共 {{ friends.length }} 人</text>
					</view>
					<view class="friend-picker__close" @tap="closeFriendPicker">×</view>
				</view>
				<view class="friend-search">
					<text class="friend-search__icon">⌕</text>
					<input v-model="friendKeyword" placeholder="搜索昵称或用户 ID" placeholder-style="color:#7f7062" />
					<text v-if="friendKeyword" class="friend-search__clear" @tap="friendKeyword = ''">×</text>
				</view>
				<scroll-view class="friend-list" scroll-y>
					<view v-if="loadingFriends" class="friend-empty">正在加载好友...</view>
					<view v-else-if="filteredFriends.length === 0" class="friend-empty">
						<text>{{ friends.length ? '没有找到匹配的好友' : '关注或粉丝列表中还没有好友' }}</text>
					</view>
					<view
						v-for="friend in filteredFriends"
						:key="friend.user_id"
						class="friend-row"
						:class="{ 'friend-row--selected': selectedFriend && selectedFriend.user_id === friend.user_id }"
						@tap="selectFriend(friend)"
					>
						<image class="friend-row__avatar" :src="friend.avatar_url || defaultAvatar" mode="aspectFill"></image>
						<view class="friend-row__copy">
							<text class="friend-row__name">{{ friend.name }}</text>
							<text class="friend-row__meta">ID:{{ friend.user_id }} · {{ relationLabel(friend) }}</text>
						</view>
						<view class="friend-row__check"><view></view></view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	createMembershipRequestId,
	getMembershipErrorMessage,
	getMembershipGiftFriends,
	getMembershipPlans,
	giftMembership
} from '@/common/membership-api.js';

export default {
	data() {
		return {
			selectedTier: 'standard',
			selectedPeriod: 'month',
			friends: [],
			selectedFriend: null,
			friendPickerVisible: false,
			friendKeyword: '',
			loadingFriends: false,
			defaultAvatar: '/static/user/defaultAvatar.jpg',
			message: '',
			submitting: false,
			tiers: [
				{
					key: 'standard',
					name: '原木通行证',
					description: '轻享成长权益',
					logo: '/static/membership/loghome-pass.png',
					plans: [
						{ key: 'month', name: '一个月', price: 660 },
						{ key: 'year', name: '一年', price: 7200 }
					]
				},
				{
					key: 'super',
					name: '超级原木通行证',
					description: '完整会员权益',
					logo: '/static/membership/loghome-super-pass.png',
					plans: [
						{ key: 'month', name: '一个月', price: 880 },
						{ key: 'year', name: '一年', price: 9600 }
					]
				}
			]
		};
	},
	computed: {
		activeTier() {
			return this.tiers.find((tier) => tier.key === this.selectedTier) || this.tiers[0];
		},
		activePlan() {
			return this.activeTier.plans.find((plan) => plan.key === this.selectedPeriod) || this.activeTier.plans[0];
		},
		filteredFriends() {
			const keyword = this.friendKeyword.trim().toLowerCase();
			if (!keyword) return this.friends;
			return this.friends.filter((friend) =>
				String(friend.name || '').toLowerCase().includes(keyword) ||
				String(friend.user_id).includes(keyword)
			);
		},
		canSubmit() {
			return Boolean(this.selectedFriend && this.selectedFriend.user_id);
		}
	},
	onLoad(options) {
		if (options && options.tier === 'super') this.selectedTier = 'super';
		this.loadMembershipPlans();
		this.loadGiftFriends();
	},
	methods: {
		goBack() {
			uni.navigateBack({ delta: 1 });
		},
		gotoRules() {
			uni.navigateTo({ url: '/pages/membership/rules' });
		},
		selectTier(tier) {
			this.selectedTier = tier;
		},
		relationLabel(friend) {
			if (friend && friend.is_following && friend.is_follower) return '互相关注';
			if (friend && friend.is_following) return '我关注的';
			return '关注我的';
		},
		openFriendPicker() {
			this.friendPickerVisible = true;
			if (!this.loadingFriends && this.friends.length === 0) this.loadGiftFriends();
		},
		closeFriendPicker() {
			this.friendPickerVisible = false;
			this.friendKeyword = '';
		},
		selectFriend(friend) {
			this.selectedFriend = friend;
			this.closeFriendPicker();
		},
		async loadGiftFriends() {
			if (this.loadingFriends) return;
			this.loadingFriends = true;
			try {
				this.friends = await getMembershipGiftFriends(this.$baseUrl);
				if (this.selectedFriend) {
					this.selectedFriend = this.friends.find((friend) => friend.user_id === this.selectedFriend.user_id) || null;
				}
			} catch (error) {
				uni.showToast({ title: getMembershipErrorMessage(error, '好友列表加载失败'), icon: 'none' });
			} finally {
				this.loadingFriends = false;
			}
		},
		async loadMembershipPlans() {
			try {
				const serverTiers = await getMembershipPlans(this.$baseUrl);
				serverTiers.forEach((serverTier) => {
					const localTier = this.tiers.find((tier) => tier.key === serverTier.key);
					if (!localTier) return;
					serverTier.plans.forEach((serverPlan) => {
						const localKey = serverPlan.billing_cycle === 'monthly' ? 'month' : 'year';
						const localPlan = localTier.plans.find((plan) => plan.key === localKey);
						if (localPlan) localPlan.price = Number(serverPlan.cost_log);
					});
				});
			} catch (error) {
				console.log('加载赠送方案失败，继续使用本地价格。', error);
			}
		},
		showConfirm(options) {
			return new Promise((resolve) => {
				uni.showModal({
					...options,
					success: (result) => resolve(Boolean(result.confirm)),
					fail: () => resolve(false)
				});
			});
		},
		async submitGift() {
			if (this.submitting) return;
			if (!this.canSubmit) {
				uni.showToast({ title: '请先选择赠送好友', icon: 'none' });
				return;
			}
			const confirmed = await this.showConfirm({
				title: '确认赠送',
				content: `向 ${this.selectedFriend.name}（ID:${this.selectedFriend.user_id}）赠送${this.activeTier.name}（${this.activePlan.name}），将扣除${this.activePlan.price}原木。`,
				confirmText: '确认赠送'
			});
			if (!confirmed) return;

			this.submitting = true;
			try {
				const data = await giftMembership(this.$baseUrl, {
					beneficiary_user_id: Number(this.selectedFriend.user_id),
					membership_type: this.selectedTier,
					billing_cycle: this.selectedPeriod === 'month' ? 'monthly' : 'yearly',
					message: this.message.trim(),
					client_request_id: createMembershipRequestId('gift')
				});
				uni.showModal({
					title: data.replayed ? '赠送已处理' : '赠送成功',
					content: `会员权益已发放给 ID:${data.beneficiary.user_id}${data.redstone_granted ? `，并赠送${data.redstone_granted}红石` : ''}。`,
					showCancel: false,
					success: () => uni.navigateBack({ delta: 1 })
				});
			} catch (error) {
				uni.showToast({ title: getMembershipErrorMessage(error), icon: 'none', duration: 2200 });
			} finally {
				this.submitting = false;
			}
		}
	}
};
</script>

<style lang="scss">
@import './subpage.scss';

.tier-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12rpx;
	margin-top: 22rpx;
}

.tier-card {
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	min-width: 0;
	min-height: 116rpx;
	padding: 16rpx;
	border: 1rpx solid var(--border);
	border-radius: 20rpx;
	background: rgba(0, 0, 0, 0.1);
	transition: border-color 0.2s ease, background 0.2s ease;

	&--selected {
		border-color: var(--accent);
		background: var(--accent-soft);
	}

	&__logo {
		flex-shrink: 0;
		width: 52rpx;
		height: 52rpx;
		image-rendering: pixelated;
	}

	&__copy {
		flex: 1;
		min-width: 0;
		margin-left: 10rpx;
	}

	&__name,
	&__description {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__name {
		font-size: 20rpx;
		font-weight: 650;
	}

	&__description {
		margin-top: 5rpx;
		font-size: 16rpx;
		color: var(--text-muted);
	}

	&__radio {
		position: absolute;
		right: 9rpx;
		top: 9rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 22rpx;
		height: 22rpx;
		border: 1rpx solid var(--border);
		border-radius: 50%;

		view {
			width: 10rpx;
			height: 10rpx;
			border-radius: 50%;
			background: transparent;
		}
	}

	&--selected &__radio view {
		background: var(--accent);
	}
}

.period-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12rpx;
}

.period-card {
	box-sizing: border-box;
	padding: 18rpx;
	border: 1rpx solid var(--border);
	border-radius: 18rpx;
	background: rgba(0, 0, 0, 0.1);

	&--selected {
		border-color: var(--accent);
		background: var(--accent-soft);
	}

	&__name {
		display: block;
		font-size: 20rpx;
		font-weight: 600;
	}

	&__price {
		display: flex;
		align-items: center;
		margin-top: 8rpx;
		font-size: 27rpx;
		font-weight: 700;
		color: var(--accent);

		image {
			width: 26rpx;
			height: 26rpx;
			margin-right: 6rpx;
		}
	}

	&__unit {
		margin-left: 6rpx;
		font-size: 16rpx;
		font-weight: 500;
	}
}

.friend-control {
	display: flex;
	align-items: center;
	box-sizing: border-box;
	min-height: 96rpx;
	padding: 14rpx 18rpx;
	border: 1rpx solid var(--border);
	border-radius: 20rpx;
	background: rgba(0, 0, 0, 0.12);

	&__avatar,
	&__placeholder-icon {
		flex-shrink: 0;
		width: 62rpx;
		height: 62rpx;
		border-radius: 17rpx;
	}

	&__avatar {
		background: rgba(255, 255, 255, 0.08);
	}

	&__placeholder-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
		font-weight: 300;
		color: var(--accent);
		background: var(--accent-soft);
	}

	&__copy {
		flex: 1;
		min-width: 0;
		margin-left: 15rpx;
	}

	&__name,
	&__meta {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__name {
		font-size: 23rpx;
		font-weight: 650;
		color: var(--text-primary);
	}

	&__meta {
		margin-top: 5rpx;
		font-size: 17rpx;
		color: var(--text-muted);
	}

	&__arrow {
		margin-left: 12rpx;
		font-size: 42rpx;
		line-height: 1;
		color: var(--text-muted);
	}
}

.friend-picker-mask {
	position: fixed;
	z-index: 1000;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: flex-end;
	background: rgba(4, 3, 3, 0.68);
	backdrop-filter: blur(5rpx);
}

.friend-picker {
	box-sizing: border-box;
	width: 100%;
	padding: 12rpx 28rpx calc(28rpx + var(--loghome-safe-bottom, 0px));
	border: 1rpx solid var(--border);
	border-bottom: 0;
	border-radius: 34rpx 34rpx 0 0;
	color: var(--text-primary);
	background: #281c17;
	box-shadow: 0 -20rpx 60rpx rgba(0, 0, 0, 0.36);

	&__handle {
		width: 72rpx;
		height: 7rpx;
		margin: 0 auto 20rpx;
		border-radius: 999rpx;
		background: rgba(255, 255, 255, 0.18);
	}

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__title,
	&__count {
		display: block;
	}

	&__title {
		font-size: 29rpx;
		font-weight: 700;
	}

	&__count {
		margin-top: 4rpx;
		font-size: 17rpx;
		color: var(--text-muted);
	}

	&__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 52rpx;
		height: 52rpx;
		border-radius: 50%;
		font-size: 33rpx;
		color: var(--text-secondary);
		background: rgba(255, 255, 255, 0.07);
	}
}

.friend-search {
	display: flex;
	align-items: center;
	height: 76rpx;
	margin-top: 22rpx;
	padding: 0 18rpx;
	border: 1rpx solid var(--border);
	border-radius: 18rpx;
	background: rgba(0, 0, 0, 0.14);

	&__icon {
		font-size: 30rpx;
		color: var(--text-muted);
	}

	input {
		flex: 1;
		height: 76rpx;
		margin-left: 12rpx;
		font-size: 21rpx;
		color: var(--text-primary);
	}

	&__clear {
		font-size: 27rpx;
		color: var(--text-muted);
	}
}

.friend-list {
	height: min(650rpx, 55vh);
	margin-top: 14rpx;
}

.friend-row {
	display: flex;
	align-items: center;
	box-sizing: border-box;
	min-height: 94rpx;
	padding: 13rpx 10rpx;
	border-bottom: 1rpx solid rgba(255, 255, 255, 0.055);

	&__avatar {
		flex-shrink: 0;
		width: 64rpx;
		height: 64rpx;
		border-radius: 18rpx;
		background: rgba(255, 255, 255, 0.08);
	}

	&__copy {
		flex: 1;
		min-width: 0;
		margin-left: 15rpx;
	}

	&__name,
	&__meta {
		display: block;
	}

	&__name {
		font-size: 23rpx;
		font-weight: 600;
	}

	&__meta {
		margin-top: 4rpx;
		font-size: 17rpx;
		color: var(--text-muted);
	}

	&__check {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30rpx;
		height: 30rpx;
		border: 1rpx solid var(--border);
		border-radius: 50%;

		view {
			width: 14rpx;
			height: 14rpx;
			border-radius: 50%;
		}
	}

	&--selected &__check view {
		background: var(--accent);
	}
}

.friend-empty {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 260rpx;
	font-size: 20rpx;
	color: var(--text-muted);
}

.gift-message {
	box-sizing: border-box;
	width: 100%;
	height: 150rpx;
	padding: 18rpx 20rpx;
	border: 1rpx solid var(--border);
	border-radius: 18rpx;
	font-size: 22rpx;
	line-height: 1.5;
	color: var(--text-primary);
	background: rgba(0, 0, 0, 0.12);
}

.gift-summary {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 24rpx;
	padding: 22rpx 24rpx;
	border: 1rpx solid var(--border);
	border-radius: 22rpx;
	background: var(--panel);

	&__label,
	&__detail {
		display: block;
	}

	&__label {
		font-size: 19rpx;
		color: var(--text-muted);
	}

	&__detail {
		margin-top: 5rpx;
		font-size: 20rpx;
		color: var(--text-secondary);
	}

	&__price {
		display: flex;
		align-items: center;
		font-size: 34rpx;
		font-weight: 700;
		color: var(--accent);

		image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 6rpx;
		}
	}

	&__unit {
		margin-left: 7rpx;
		font-size: 18rpx;
		font-weight: 500;
	}
}

.gift-agreement {
	display: block;
	margin-top: 16rpx;
	font-size: 17rpx;
	text-align: center;
	color: var(--text-muted);
}
</style>
