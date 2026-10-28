<template>
	<view class="membership-subpage">
		<view class="subpage-header">
			<view class="subpage-header__back" @tap="goBack"><view class="subpage-header__back-icon"></view></view>
			<text class="subpage-header__title">{{ $t('membership.common.redeemCode') }}</text>
			<view class="subpage-header__spacer"></view>
		</view>

		<view class="subpage-content">
			<view class="subpage-hero">
				<view class="subpage-hero__icon">
					<image src="/static/membership/icons/redeem-ticket.svg" mode="aspectFit"></image>
				</view>
				<view class="subpage-hero__copy">
					<text class="subpage-hero__eyebrow">REDEEM PASS</text>
					<text class="subpage-hero__title">{{ $t('membership.redeem.heroTitle') }}</text>
					<text class="subpage-hero__description">{{ $t('membership.redeem.heroDesc') }}</text>
				</view>
			</view>

			<view class="subpage-panel redeem-panel">
				<text class="panel-title">{{ $t('membership.redeem.formTitle') }}</text>
				<text class="panel-description">{{ $t('membership.redeem.formDesc') }}</text>

				<view class="redeem-input" :class="{ 'redeem-input--focused': focused }">
					<input
						:value="code"
						maxlength="32"
						:placeholder="$t('membership.redeem.placeholder')"
						placeholder-style="color:#7f7062"
						@input="handleCodeInput"
						@focus="focused = true"
						@blur="focused = false"
					/>
					<view v-if="code" class="redeem-input__clear" @tap="code = ''">×</view>
				</view>

				<view class="code-status" v-if="code">
					<text :class="{ 'code-status--valid': canRedeem }">
						{{ canRedeem ? $t('membership.redeem.valid') : $t('membership.redeem.tooShort') }}
					</text>
					<text>{{ normalizedLength }}/32</text>
				</view>

				<view class="primary-action" :class="{ 'primary-action--disabled': !canRedeem || submitting }" @tap="submitRedeem">
					{{ submitting ? $t('membership.redeem.submitting') : $t('membership.redeem.submit') }}
				</view>
			</view>

			<view class="subpage-panel">
				<text class="panel-title">{{ $t('membership.redeem.instructionsTitle') }}</text>
				<view class="info-list">
					<view class="info-item">
						<text class="info-item__index">1</text>
						<text>{{ $t('membership.redeem.instructions.oneTime') }}</text>
					</view>
					<view class="info-item">
						<text class="info-item__index">2</text>
						<text>{{ $t('membership.redeem.instructions.extend') }}</text>
					</view>
					<view class="info-item">
						<text class="info-item__index">3</text>
						<text>{{ $t('membership.redeem.instructions.source') }}</text>
					</view>
				</view>
			</view>

			<view class="subpage-panel redeem-records">
				<view class="redeem-records__heading">
					<text class="panel-title">{{ $t('membership.redeem.historyTitle') }}</text>
					<text class="redeem-records__count">{{ $tc('membership.redeem.historyCount', redeemHistory.length, { count: redeemHistory.length }) }}</text>
				</view>
				<view v-if="loadingHistory" class="record-empty">
					<text class="record-empty__title">{{ $t('membership.redeem.loadingHistory') }}</text>
				</view>
				<view v-else-if="redeemHistory.length === 0" class="record-empty">
					<text class="record-empty__title">{{ $t('membership.redeem.emptyTitle') }}</text>
					<text class="record-empty__description">{{ $t('membership.redeem.emptyDesc') }}</text>
				</view>
				<view v-else class="record-list">
					<view v-for="item in redeemHistory" :key="item.redemption_id" class="record-item">
						<view class="record-item__badge">{{ item.membership_type === 'super' ? 'S' : 'L' }}</view>
						<view class="record-item__copy">
							<text class="record-item__title">{{ $t('membership.redeem.recordTitle', { tier: tierName(item.membership_type), days: item.duration_days }) }}</text>
							<text class="record-item__meta">{{ item.code_hint }} · {{ formatDate(item.redeemed_at) }}</text>
						</view>
						<text class="record-item__status">{{ $t('membership.redeem.statusRedeemed') }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	getMembershipErrorMessage,
	getMembershipRedeemHistory,
	redeemMembership
} from '@/common/membership-api.js';

export default {
	data() {
		return {
			code: '',
			focused: false,
			submitting: false,
			loadingHistory: false,
			redeemHistory: []
		};
	},
	onLoad() {
		this.loadRedeemHistory();
	},
	computed: {
		normalizedCode() {
			return this.code.replace(/-/g, '');
		},
		normalizedLength() {
			return this.code.length;
		},
		canRedeem() {
			return this.normalizedCode.length >= 8 && this.normalizedCode.length <= 32;
		}
	},
	methods: {
		goBack() {
			uni.navigateBack({ delta: 1 });
		},
		handleCodeInput(event) {
			this.code = String(event.detail.value || '')
				.toUpperCase()
				.replace(/[^A-Z0-9-]/g, '')
				.slice(0, 32);
			return this.code;
		},
		tierName(type) {
			return type === 'super'
				? this.$t('membership.pass.tier.super.name')
				: this.$t('membership.pass.tier.standard.name');
		},
		formatDate(value) {
			if (!value) return '';
			const date = new Date(value);
			if (Number.isNaN(date.getTime())) return '';
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
		},
		async loadRedeemHistory() {
			this.loadingHistory = true;
			try {
				const data = await getMembershipRedeemHistory(this.$baseUrl);
				this.redeemHistory = data.list || [];
			} catch (error) {
				console.log('加载会员兑换记录失败。', error);
			} finally {
				this.loadingHistory = false;
			}
		},
		async submitRedeem() {
			if (this.submitting) return;
			if (!this.canRedeem) {
				uni.showToast({ title: this.$t('membership.redeem.invalidToast'), icon: 'none' });
				return;
			}
			this.submitting = true;
			try {
				const data = await redeemMembership(this.$baseUrl, this.code);
				this.code = '';
				await this.loadRedeemHistory();
				uni.showModal({
					title: data.replayed
						? this.$t('membership.redeem.alreadyProcessed')
						: this.$t('membership.redeem.successTitle'),
					content: this.$t('membership.redeem.successContent', {
						tier: this.tierName(data.membership_type),
						days: data.duration_days
					}),
					showCancel: false,
					confirmText: this.$t('membership.redeem.gotIt')
				});
			} catch (error) {
				uni.showToast({ title: getMembershipErrorMessage(error, this.$t('membership.redeem.failed')), icon: 'none', duration: 2400 });
			} finally {
				this.submitting = false;
			}
		}
	}
};
</script>

<style lang="scss">
@import './subpage.scss';

.redeem-panel {
	padding-top: 28rpx;
}

.redeem-input {
	display: flex;
	align-items: center;
	box-sizing: border-box;
	height: 96rpx;
	margin-top: 25rpx;
	padding: 0 22rpx;
	border: 1rpx solid var(--border);
	border-radius: 20rpx;
	background: rgba(0, 0, 0, 0.14);
	transition: border-color 0.2s ease, box-shadow 0.2s ease;

	&--focused {
		border-color: var(--accent);
		box-shadow: 0 0 0 4rpx var(--accent-soft);
	}

	input {
		flex: 1;
		min-width: 0;
		height: 96rpx;
		font-size: 25rpx;
		font-weight: 600;
		letter-spacing: 2rpx;
		color: var(--text-primary);
	}

	&__clear {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 42rpx;
		height: 42rpx;
		margin-left: 12rpx;
		border-radius: 50%;
		font-size: 28rpx;
		line-height: 1;
		color: var(--text-muted);
		background: rgba(255, 255, 255, 0.07);
	}
}

.code-status {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 10rpx;
	font-size: 17rpx;
	color: var(--text-muted);

	&--valid {
		color: #74c995;
	}
}

.redeem-records {
	&__heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__count {
		font-size: 17rpx;
		color: var(--text-muted);
	}
}

.record-list {
	margin-top: 18rpx;
}

.record-item {
	display: flex;
	align-items: center;
	min-height: 82rpx;
	padding: 10rpx 0;
	border-bottom: 1rpx solid var(--border);

	&:last-child {
		border-bottom: 0;
	}

	&__badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 52rpx;
		height: 52rpx;
		border-radius: 15rpx;
		font-size: 21rpx;
		font-weight: 800;
		color: #3a2418;
		background: var(--accent);
	}

	&__copy {
		flex: 1;
		min-width: 0;
		margin-left: 14rpx;
	}

	&__title,
	&__meta {
		display: block;
	}

	&__title {
		font-size: 20rpx;
		font-weight: 600;
		color: var(--text-primary);
	}

	&__meta {
		margin-top: 4rpx;
		font-size: 16rpx;
		color: var(--text-muted);
	}

	&__status {
		font-size: 17rpx;
		color: #74c995;
	}
}

.record-empty {
	padding: 38rpx 0 20rpx;
	text-align: center;

	&__title,
	&__description {
		display: block;
	}

	&__title {
		font-size: 20rpx;
		color: var(--text-secondary);
	}

	&__description {
		margin-top: 5rpx;
		font-size: 17rpx;
		color: var(--text-muted);
	}
}
</style>
