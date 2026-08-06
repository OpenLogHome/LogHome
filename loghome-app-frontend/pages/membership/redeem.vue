<template>
	<view class="membership-subpage">
		<view class="subpage-header">
			<view class="subpage-header__back" @tap="goBack"><view class="subpage-header__back-icon"></view></view>
			<text class="subpage-header__title">会员兑换码</text>
			<view class="subpage-header__spacer"></view>
		</view>

		<view class="subpage-content">
			<view class="subpage-hero">
				<view class="subpage-hero__icon">
					<image src="/static/membership/icons/redeem-ticket.svg" mode="aspectFit"></image>
				</view>
				<view class="subpage-hero__copy">
					<text class="subpage-hero__eyebrow">REDEEM PASS</text>
					<text class="subpage-hero__title">兑换通行证</text>
					<text class="subpage-hero__description">输入有效兑换码，会员权益将发放到当前账号</text>
				</view>
			</view>

			<view class="subpage-panel redeem-panel">
				<text class="panel-title">填写兑换码</text>
				<text class="panel-description">兑换码不区分大小写，短横线可以省略</text>

				<view class="redeem-input" :class="{ 'redeem-input--focused': focused }">
					<input
						:value="code"
						maxlength="32"
						placeholder="例如 LOGPASS-2026-XXXX"
						placeholder-style="color:#7f7062"
						@input="handleCodeInput"
						@focus="focused = true"
						@blur="focused = false"
					/>
					<view v-if="code" class="redeem-input__clear" @tap="code = ''">×</view>
				</view>

				<view class="code-status" v-if="code">
					<text :class="{ 'code-status--valid': canRedeem }">
						{{ canRedeem ? '格式正确，可以继续兑换' : '兑换码至少需要 8 个字符' }}
					</text>
					<text>{{ normalizedLength }}/32</text>
				</view>

				<view class="primary-action" :class="{ 'primary-action--disabled': !canRedeem || submitting }" @tap="submitRedeem">
					{{ submitting ? '正在兑换...' : '验证并兑换' }}
				</view>
			</view>

			<view class="subpage-panel">
				<text class="panel-title">兑换说明</text>
				<view class="info-list">
					<view class="info-item">
						<text class="info-item__index">1</text>
						<text>每个兑换码只能使用一次，兑换后无法转移到其他账号。</text>
					</view>
					<view class="info-item">
						<text class="info-item__index">2</text>
						<text>如当前已有会员，兑换时长会根据兑换码规则顺延或升级。</text>
					</view>
					<view class="info-item">
						<text class="info-item__index">3</text>
						<text>请通过原木社区官方活动或可信赠送者获取兑换码。</text>
					</view>
				</view>
			</view>

			<view class="subpage-panel redeem-records">
				<view class="redeem-records__heading">
					<text class="panel-title">兑换记录</text>
					<text class="redeem-records__count">{{ redeemHistory.length }} 条</text>
				</view>
				<view v-if="loadingHistory" class="record-empty">
					<text class="record-empty__title">正在加载兑换记录...</text>
				</view>
				<view v-else-if="redeemHistory.length === 0" class="record-empty">
					<text class="record-empty__title">暂无兑换记录</text>
					<text class="record-empty__description">成功兑换后的通行证会显示在这里</text>
				</view>
				<view v-else class="record-list">
					<view v-for="item in redeemHistory" :key="item.redemption_id" class="record-item">
						<view class="record-item__badge">{{ item.membership_type === 'super' ? 'S' : 'L' }}</view>
						<view class="record-item__copy">
							<text class="record-item__title">{{ tierName(item.membership_type) }} · {{ item.duration_days }}天</text>
							<text class="record-item__meta">{{ item.code_hint }} · {{ formatDate(item.redeemed_at) }}</text>
						</view>
						<text class="record-item__status">已兑换</text>
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
			return type === 'super' ? '超级原木通行证' : '原木通行证';
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
				uni.showToast({ title: '请填写有效兑换码', icon: 'none' });
				return;
			}
			this.submitting = true;
			try {
				const data = await redeemMembership(this.$baseUrl, this.code);
				this.code = '';
				await this.loadRedeemHistory();
				uni.showModal({
					title: data.replayed ? '兑换已处理' : '兑换成功',
					content: `${this.tierName(data.membership_type)}已增加${data.duration_days}天有效期。`,
					showCancel: false,
					confirmText: '知道了'
				});
			} catch (error) {
				uni.showToast({ title: getMembershipErrorMessage(error, '兑换失败，请稍后重试'), icon: 'none', duration: 2400 });
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
