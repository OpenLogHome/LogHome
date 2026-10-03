<template>
	<view class="redstone-page">
		<view class="page-glow page-glow--one"></view>
		<view class="page-glow page-glow--two"></view>

		<view class="top-bar">
			<view class="top-bar__back" @tap="goBack"><view class="top-bar__back-icon"></view></view>
			<text class="top-bar__title">红石中心</text>
			<view class="top-bar__rules" @tap="gotoRules">规则</view>
		</view>

		<view class="page-content">
			<view class="balance-card">
				<view class="balance-card__shine"></view>
				<view class="balance-card__heading">
					<view class="balance-card__icon">
						<image src="/static/icons/redstone.svg" mode="aspectFit"></image>
					</view>
					<view>
						<text class="balance-card__eyebrow">AI ENERGY</text>
						<text class="balance-card__title">我的红石</text>
					</view>
				</view>
				<view class="balance-card__amount">
					<text v-if="accountLoading">--</text>
					<text v-else-if="accountLoadFailed" class="balance-card__retry" @tap="loadAccount">重新加载</text>
					<text v-else>{{ account.redstone_balance }}</text>
					<text v-if="!accountLoadFailed" class="balance-card__unit">红石</text>
				</view>
				<text class="balance-card__description">用于 AI 阅读、AI 创作及其他智能功能</text>
				<view v-if="!accountLoading && !accountLoadFailed" class="balance-card__breakdown">
					<text>赠送 {{ account.expiring_balance || 0 }}</text>
					<text>永久 {{ account.permanent_balance || 0 }}</text>
					<text v-if="account.next_expiration_at">最近 {{ formatDate(account.next_expiration_at) }} 到期</text>
				</view>
			</view>

			<view class="panel exchange-panel">
				<view class="panel-heading">
					<view>
						<text class="panel-heading__title">兑换红石</text>
						<text class="panel-heading__subtitle">固定汇率：10 原木 = 1 红石</text>
					</view>
					<text class="panel-heading__balance">原木 {{ account.log_balance }}</text>
				</view>

				<view class="amount-input" :class="{ 'amount-input--focused': focused }">
					<image src="/static/icons/redstone.svg" mode="aspectFit"></image>
					<input
						:value="amount"
						type="number"
						maxlength="6"
						placeholder="输入红石数量"
						placeholder-style="color:#826e6d"
						@input="handleAmountInput"
						@focus="focused = true"
						@blur="focused = false"
					/>
					<text>红石</text>
				</view>

				<view class="quick-grid">
					<view
						v-for="item in quickAmounts"
						:key="item"
						class="quick-item"
						:class="{ 'quick-item--active': Number(amount) === item }"
						@tap="amount = String(item)"
					>
						{{ item }}
					</view>
				</view>

				<view class="exchange-summary">
					<text>需要支付</text>
					<view>
						<image src="/static/resources/log.png" mode="aspectFit"></image>
						<text>{{ logCost }}</text>
						<text class="exchange-summary__unit">原木</text>
					</view>
				</view>
				<view
					class="primary-button"
					:class="{ 'primary-button--disabled': !canExchange || submitting }"
					@tap="submitExchange"
				>
					{{ submitting ? '兑换处理中…' : canExchange ? '确认兑换' : '请输入兑换数量' }}
				</view>
				<text v-if="validAmount && !hasEnoughLogs" class="balance-warning">原木余额不足</text>
			</view>

			<view class="panel membership-panel">
				<view class="panel-heading">
					<view>
						<text class="panel-heading__title">通行证每月赠送</text>
						<text class="panel-heading__subtitle">普通用户每月 6 红石；通行证月付开通或续费到账，年付按月到账；赠送红石有效期 3 个月</text>
					</view>
				</view>
				<view class="membership-grants">
					<view>
						<image src="/static/membership/loghome-pass.png" mode="aspectFit"></image>
						<view>
							<text>原木通行证</text>
							<text class="membership-grants__amount">100 红石</text>
						</view>
					</view>
					<view>
						<image src="/static/membership/loghome-super-pass.png" mode="aspectFit"></image>
						<view>
							<text>超级原木通行证</text>
							<text class="membership-grants__amount">200 红石</text>
						</view>
					</view>
				</view>
				<view class="membership-link" @tap="gotoMembership">
					<text>查看原木通行证</text>
					<text>›</text>
				</view>
			</view>

			<view class="panel ai-panel">
				<view class="panel-heading">
					<view>
						<text class="panel-heading__title">红石可以做什么？</text>
						<text class="panel-heading__subtitle">红石是原木社区 AI 功能的主要消耗资产</text>
					</view>
				</view>
				<view class="ai-list">
					<view v-for="item in aiUses" :key="item.title" class="ai-item">
						<view class="ai-item__icon">{{ item.icon }}</view>
						<view>
							<text class="ai-item__title">{{ item.title }}</text>
							<text class="ai-item__description">{{ item.description }}</text>
						</view>
					</view>
				</view>
				<text class="ai-panel__note">各项功能的具体消耗以使用页面提示为准。</text>
			</view>

			<view v-if="transactions.length" class="panel records-panel">
				<view class="panel-heading">
					<view>
						<text class="panel-heading__title">最近记录</text>
						<text class="panel-heading__subtitle">赠送、兑换与 AI 功能消费账单</text>
					</view>
				</view>
				<view class="record-list">
					<view v-for="item in transactions" :key="item.transaction_id" class="record-item">
						<view>
							<text class="record-item__title">{{ transactionTitle(item) }}</text>
							<text class="record-item__time">{{ transactionMeta(item) }}</text>
						</view>
						<text class="record-item__amount" :class="{ 'record-item__amount--spent': item.amount < 0 }">
							{{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	createRedstoneRequestId,
	exchangeRedstone,
	getRedstoneAccount,
	getRedstoneErrorMessage,
	getRedstoneTransactions
} from '@/common/redstone-api.js';

export default {
	data() {
		return {
			account: { log_balance: 0, redstone_balance: 0, permanent_balance: 0, expiring_balance: 0 },
			accountLoading: true,
			accountLoadFailed: false,
			amount: '',
			focused: false,
			submitting: false,
			quickAmounts: [10, 50, 100, 300],
			transactions: [],
			aiUses: [
				{ icon: '阅', title: '问问原木娘', description: '普通问答 1 红石，深度思考 2 红石' },
				{ icon: '写', title: '笔泡 AI 助手', description: '普通 1 红石，深度思考 2 红石' },
				{ icon: '像', title: '图像生成与智能纠错', description: '图像生成 5 红石，智能纠错通行证免费、普通用户 2 红石' }
			]
		};
	},
	computed: {
		validAmount() {
			const value = Number(this.amount);
			return Number.isInteger(value) && value > 0;
		},
		logCost() {
			return this.validAmount ? Number(this.amount) * 10 : 0;
		},
		hasEnoughLogs() {
			return this.account.log_balance >= this.logCost;
		},
		canExchange() {
			return this.validAmount && this.hasEnoughLogs;
		}
	},
	onShow() {
		this.loadData();
	},
	methods: {
		goBack() {
			uni.navigateBack({ delta: 1 });
		},
		gotoMembership() {
			uni.navigateTo({ url: '/pages/membership/index' });
		},
		gotoRules() {
			uni.navigateTo({ url: '/pages/membership/rules' });
		},
		handleAmountInput(event) {
			this.amount = String(event.detail.value || '').replace(/\D/g, '').slice(0, 6);
			return this.amount;
		},
		async loadData() {
			await Promise.all([this.loadAccount(), this.loadTransactions()]);
		},
		async loadAccount() {
			this.accountLoading = true;
			this.accountLoadFailed = false;
			try {
				const account = await getRedstoneAccount(this.$baseUrl);
				if (!account || !Number.isFinite(Number(account.redstone_balance))) {
					throw new Error('红石账户数据格式异常');
				}
				this.account = {
					log_balance: Number(account.log_balance || 0),
					redstone_balance: Number(account.redstone_balance || 0),
					permanent_balance: Number(account.permanent_balance || 0),
					expiring_balance: Number(account.expiring_balance || 0),
					next_expiration_at: account.next_expiration_at || null
				};
			} catch (error) {
				console.log('加载红石账户失败。', error);
				this.accountLoadFailed = true;
				uni.showToast({ title: getRedstoneErrorMessage(error, '红石余额加载失败'), icon: 'none' });
			} finally {
				this.accountLoading = false;
			}
		},
		async loadTransactions() {
			try {
				const history = await getRedstoneTransactions(this.$baseUrl, 1, 8);
				this.transactions = history && Array.isArray(history.list) ? history.list : [];
			} catch (error) {
				console.log('加载红石流水失败。', error);
			}
		},
		async submitExchange() {
			if (this.submitting || !this.canExchange) return;
			const confirmed = await new Promise((resolve) => {
				uni.showModal({
					title: '确认兑换红石',
					content: `将消耗 ${this.logCost} 原木，兑换 ${Number(this.amount)} 红石。兑换所得红石永久有效，兑换后不可撤销。`,
					confirmText: '确认兑换',
					success: (result) => resolve(Boolean(result.confirm)),
					fail: () => resolve(false)
				});
			});
			if (!confirmed) return;

			this.submitting = true;
			try {
				const result = await exchangeRedstone(
					this.$baseUrl,
					Number(this.amount),
					createRedstoneRequestId()
				);
				this.account.log_balance = result.log_balance;
				this.account.redstone_balance = result.redstone_balance;
				this.amount = '';
				uni.showToast({ title: `已到账 ${result.redstone_amount} 红石`, icon: 'none' });
				this.loadData();
			} catch (error) {
				uni.showToast({ title: getRedstoneErrorMessage(error), icon: 'none', duration: 2200 });
			} finally {
				this.submitting = false;
			}
		},
		transactionTitle(item) {
			if (item.transaction_type === 'ai_usage' && item.description) return item.description;
			const labels = {
				membership_grant: '通行证赠送',
				membership_upgrade_grant: '升级通行证补赠',
				annual_refresh: '年付会员每月赠送',
				monthly_free_grant: '普通用户每月赠送',
				log_exchange: '原木兑换',
				ai_usage: 'AI 功能消耗',
				admin_adjustment: '系统调整',
				refund: '退款返还',
				expiration: '赠送红石过期'
			};
			return labels[item.transaction_type] || item.description || '红石到账';
		},
		transactionMeta(item) {
			const created = this.formatTime(item.created_at);
			if (Number(item.amount) > 0 && item.expires_at) {
				return `${created} · ${this.formatDate(item.expires_at)} 到期`;
			}
			if (Number(item.amount) > 0 && item.transaction_type === 'log_exchange') {
				return `${created} · 永久有效`;
			}
			return created;
		},
		formatDate(value) {
			const date = new Date(value);
			if (Number.isNaN(date.getTime())) return '';
			const pad = (number) => String(number).padStart(2, '0');
			return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
		},
		formatTime(value) {
			const date = new Date(value);
			if (Number.isNaN(date.getTime())) return '';
			const pad = (number) => String(number).padStart(2, '0');
			return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
		}
	}
};
</script>

<style lang="scss">
page {
	background: #170d0f;
}

.redstone-page {
	--accent: #f06a6e;
	--accent-light: #ff9b91;
	--text: #fff0e7;
	--secondary: #cbb5ae;
	--muted: #8f7774;
	--border: rgba(255, 193, 180, 0.13);
	--panel: rgba(255, 255, 255, 0.055);
	position: relative;
	box-sizing: border-box;
	min-height: 100vh;
	overflow: hidden;
	color: var(--text);
	background: radial-gradient(circle at 85% 4%, rgba(190, 54, 65, 0.2), transparent 28%), linear-gradient(160deg, #211114, #10090b 72%);
}

.page-glow {
	position: absolute;
	border-radius: 50%;
	pointer-events: none;
	filter: blur(6rpx);

	&--one { right: -180rpx; top: 520rpx; width: 420rpx; height: 420rpx; background: rgba(224, 70, 78, 0.055); }
	&--two { left: -220rpx; top: 1420rpx; width: 460rpx; height: 460rpx; background: rgba(244, 148, 113, 0.035); }
}

.top-bar {
	position: relative;
	z-index: 2;
	display: flex;
	align-items: center;
	padding: calc(var(--loghome-safe-top, 0px) + 18rpx) 28rpx 14rpx;

	&__back, &__rules { width: 72rpx; height: 72rpx; }
	&__back { display: flex; align-items: center; justify-content: center; border: 1rpx solid var(--border); border-radius: 50%; color: var(--accent-light); background: rgba(255,255,255,.035); }
	&__back-icon { box-sizing: border-box; width: 20rpx; height: 20rpx; border-left: 4rpx solid currentColor; border-bottom: 4rpx solid currentColor; transform: translateX(4rpx) rotate(45deg); }
	&__title { flex: 1; text-align: center; font-size: 30rpx; font-weight: 650; letter-spacing: 2rpx; }
	&__rules { display: flex; align-items: center; justify-content: center; font-size: 22rpx; color: var(--secondary); }
}

.page-content { position: relative; z-index: 1; padding: 14rpx 32rpx calc(50rpx + var(--loghome-safe-bottom, 0px)); }

.balance-card {
	position: relative;
	box-sizing: border-box;
	min-height: 280rpx;
	padding: 28rpx;
	overflow: hidden;
	border: 1rpx solid rgba(255, 174, 161, 0.2);
	border-radius: 30rpx;
	background: linear-gradient(135deg, #7d252c, #40181d 55%, #251216);
	box-shadow: 0 24rpx 50rpx rgba(0, 0, 0, 0.24);

	&__shine { position: absolute; right: -90rpx; top: -120rpx; width: 330rpx; height: 330rpx; border-radius: 50%; background: radial-gradient(circle, rgba(255,174,156,.26), transparent 66%); }
	&__heading { position: relative; display: flex; align-items: center; }
	&__icon { display: flex; align-items: center; justify-content: center; width: 68rpx; height: 68rpx; border-radius: 20rpx; background: rgba(255,255,255,.1); }
	&__icon image { width: 56rpx; height: 56rpx; image-rendering: pixelated; }
	&__heading > view:last-child { margin-left: 15rpx; }
	&__eyebrow, &__title, &__description { display: block; }
	&__eyebrow { font-size: 16rpx; letter-spacing: 4rpx; color: #ffb0a5; }
	&__title { margin-top: 3rpx; font-size: 25rpx; font-weight: 650; }
	&__amount { position: relative; display: flex; align-items: baseline; margin-top: 30rpx; font-size: 58rpx; font-weight: 750; }
	&__unit { margin-left: 10rpx; font-size: 21rpx; font-weight: 500; color: #ffc1b6; }
	&__retry { font-size: 25rpx; font-weight: 650; color: #ffd1c8; }
	&__description { position: relative; margin-top: 8rpx; font-size: 19rpx; color: rgba(255,239,231,.68); }
	&__breakdown { position: relative; display: flex; flex-wrap: wrap; gap: 8rpx 18rpx; margin-top: 12rpx; font-size: 16rpx; color: rgba(255,239,231,.62); }
}

.panel { margin-top: 24rpx; border: 1rpx solid var(--border); border-radius: 26rpx; background: linear-gradient(145deg, rgba(255,255,255,.075), var(--panel)); box-shadow: 0 16rpx 36rpx rgba(0,0,0,.12); }
.panel-heading { display: flex; align-items: flex-start; justify-content: space-between; padding: 25rpx 25rpx 20rpx; }
.panel-heading__title, .panel-heading__subtitle { display: block; }
.panel-heading__title { font-size: 27rpx; font-weight: 650; }
.panel-heading__subtitle { margin-top: 5rpx; font-size: 17rpx; line-height: 1.45; color: var(--muted); }
.panel-heading__balance { flex-shrink: 0; margin-left: 12rpx; padding: 7rpx 11rpx; border-radius: 999rpx; font-size: 17rpx; color: #f1c783; background: rgba(241,199,131,.1); }

.exchange-panel { padding-bottom: 24rpx; }
.amount-input { display: flex; align-items: center; height: 88rpx; margin: 0 24rpx; padding: 0 20rpx; border: 1rpx solid var(--border); border-radius: 19rpx; background: rgba(0,0,0,.16); transition: border-color .2s ease, box-shadow .2s ease; }
.amount-input--focused { border-color: var(--accent); box-shadow: 0 0 0 4rpx rgba(240,106,110,.1); }
.amount-input image { width: 40rpx; height: 40rpx; }
.amount-input input { flex: 1; height: 88rpx; margin: 0 12rpx; font-size: 29rpx; font-weight: 650; color: var(--text); }
.amount-input > text { font-size: 19rpx; color: var(--secondary); }
.quick-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 9rpx; margin: 14rpx 24rpx 0; }
.quick-item { padding: 13rpx 0; border: 1rpx solid var(--border); border-radius: 13rpx; font-size: 19rpx; text-align: center; color: var(--secondary); background: rgba(255,255,255,.025); }
.quick-item--active { border-color: var(--accent); color: #ffb0a5; background: rgba(240,106,110,.1); }
.exchange-summary { display: flex; align-items: center; justify-content: space-between; margin: 20rpx 24rpx 0; padding-top: 18rpx; border-top: 1rpx solid var(--border); font-size: 19rpx; color: var(--muted); }
.exchange-summary > view { display: flex; align-items: center; font-size: 29rpx; font-weight: 700; color: #f2ca89; }
.exchange-summary image { width: 29rpx; height: 29rpx; margin-right: 6rpx; }
.exchange-summary__unit { margin-left: 6rpx; font-size: 17rpx; font-weight: 500; }
.primary-button { display: flex; align-items: center; justify-content: center; height: 78rpx; margin: 20rpx 24rpx 0; border-radius: 999rpx; font-size: 25rpx; font-weight: 700; color: #2a1114; background: linear-gradient(100deg, #ffb2a5, #e95560); box-shadow: 0 12rpx 24rpx rgba(128,30,39,.25); }
.primary-button--disabled { color: #806d6c; background: rgba(255,255,255,.07); box-shadow: none; }
.balance-warning { display: block; margin-top: 11rpx; font-size: 17rpx; text-align: center; color: #ff7778; }

.membership-grants { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11rpx; padding: 0 22rpx; }
.membership-grants > view { display: flex; align-items: center; min-width: 0; padding: 16rpx; border-radius: 17rpx; background: rgba(0,0,0,.13); }
.membership-grants image { flex-shrink: 0; width: 48rpx; height: 48rpx; image-rendering: pixelated; }
.membership-grants > view > view { min-width: 0; margin-left: 9rpx; }
.membership-grants text { display: block; overflow: hidden; font-size: 17rpx; text-overflow: ellipsis; white-space: nowrap; color: var(--secondary); }
.membership-grants__amount { margin-top: 4rpx; font-size: 21rpx !important; font-weight: 700; color: #ff9e96 !important; }
.membership-link { display: flex; align-items: center; justify-content: space-between; margin: 18rpx 22rpx 0; padding: 17rpx 3rpx 20rpx; border-top: 1rpx solid var(--border); font-size: 19rpx; color: var(--secondary); }
.membership-link text:last-child { font-size: 32rpx; color: var(--muted); }

.ai-list { padding: 0 22rpx; }
.ai-item { display: flex; align-items: center; min-height: 94rpx; border-top: 1rpx solid var(--border); }
.ai-item__icon { flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 44rpx; height: 44rpx; border-radius: 14rpx; font-size: 19rpx; font-weight: 650; color: #ffaaa0; background: rgba(240,106,110,.11); }
.ai-item > view:last-child { margin-left: 14rpx; }
.ai-item__title, .ai-item__description { display: block; }
.ai-item__title { font-size: 22rpx; font-weight: 600; }
.ai-item__description { margin-top: 4rpx; font-size: 17rpx; color: var(--muted); }
.ai-panel__note { display: block; padding: 13rpx 22rpx 22rpx; font-size: 16rpx; color: var(--muted); }

.record-list { padding: 0 22rpx 12rpx; }
.record-item { display: flex; align-items: center; justify-content: space-between; min-height: 86rpx; border-top: 1rpx solid var(--border); }
.record-item__title, .record-item__time { display: block; }
.record-item__title { font-size: 20rpx; }
.record-item__time { margin-top: 4rpx; font-size: 16rpx; color: var(--muted); }
.record-item__amount { font-size: 24rpx; font-weight: 700; color: #ff8c87; }
.record-item__amount--spent { color: var(--secondary); }
</style>
