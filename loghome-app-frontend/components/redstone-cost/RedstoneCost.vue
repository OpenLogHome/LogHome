<template>
	<view v-if="aiAssistanceEnabled" class="redstone-cost" :class="{ 'redstone-cost--icon-only': iconOnly }">
		<view class="redstone-cost__trigger" :class="{ 'redstone-cost__trigger--icon-only': iconOnly }" @tap.stop="toggleTooltip">
			<image class="redstone-cost__icon" src="/static/icons/redstone.svg" mode="aspectFit"></image>
			<text v-if="!iconOnly">{{ prefix }} {{ cost }} 红石</text>
		</view>
		<view v-if="visible" class="redstone-cost__backdrop" @tap.stop="closeTooltip"></view>
		<view v-if="visible" class="redstone-cost__tooltip" @tap.stop>
			<view class="redstone-cost__tooltip-head">
				<text>我的红石</text>
				<text class="redstone-cost__balance">{{ loading ? '查询中…' : balanceText }}</text>
			</view>
			<text v-if="!loading && (!hideCostDetail || !enough)" class="redstone-cost__tip">
				{{ hideCostDetail ? '当前红石余额不足' : (enough ? `本次操作将消耗 ${cost} 红石` : `还差 ${shortfall} 红石`) }}
			</text>
			<view v-if="!loading && !enough" class="redstone-cost__actions">
				<view class="redstone-cost__action redstone-cost__action--primary" @tap.stop="gotoExchange">兑换红石</view>
				<view class="redstone-cost__action" @tap.stop="gotoMembership">开通通行证</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getRedstoneAccount } from '@/common/redstone-api.js';
import { navigateToMembership, navigateToRedstoneExchange } from '@/common/redstone-ui.js';

export default {
	name: 'RedstoneCost',
	props: {
		cost: { type: Number, default: 1 },
		prefix: { type: String, default: '本次消耗' },
		iconOnly: { type: Boolean, default: false },
		hideCostDetail: { type: Boolean, default: false },
	},
	data() {
		return { visible: false, loading: false, balance: null };
	},
	computed: {
		balanceText() {
			return this.balance === null ? '暂时无法查询' : `${this.balance} 红石`;
		},
		enough() {
			return this.balance === null || Number(this.balance) >= Number(this.cost || 0);
		},
		shortfall() {
			return Math.max(0, Number(this.cost || 0) - Number(this.balance || 0));
		},
	},
	methods: {
		async toggleTooltip() {
			if (!this.aiAssistanceEnabled) return;
			this.visible = !this.visible;
			if (!this.visible) return;
			this.loading = true;
			try {
				const account = await getRedstoneAccount(this.$baseUrl);
				this.balance = Number(account.redstone_balance || 0);
			} catch (error) {
				this.balance = null;
			} finally {
				this.loading = false;
			}
		},
		closeTooltip() {
			this.visible = false;
		},
		gotoExchange() {
			this.closeTooltip();
			navigateToRedstoneExchange();
		},
		gotoMembership() {
			this.closeTooltip();
			navigateToMembership();
		},
	},
};
</script>

<style scoped lang="scss">
.redstone-cost { position: relative; display: inline-flex; align-items: center; overflow: visible; }
.redstone-cost__trigger { display: inline-flex; align-items: center; gap: 6rpx; padding: 8rpx 12rpx; border: 1rpx solid rgba(186, 66, 60, .18); border-radius: 999rpx; font-size: 19rpx; line-height: 1; white-space: nowrap; color: #9d3e37; background: rgba(190, 67, 59, .08); }
.redstone-cost__trigger--icon-only { padding: 4rpx; border: 0; background: transparent; }
.redstone-cost__icon { width: 27rpx; height: 27rpx; image-rendering: pixelated; }
.redstone-cost--icon-only .redstone-cost__icon { width: 31rpx; height: 31rpx; }
.redstone-cost__backdrop { position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 998; background: transparent; }
.redstone-cost__tooltip { position: absolute; right: 0; bottom: calc(100% + 14rpx); z-index: 999; box-sizing: border-box; width: 350rpx; padding: 19rpx; border: 1rpx solid rgba(126, 84, 54, .12); border-radius: 18rpx; color: #47372d; background: rgba(255, 252, 247, .98); box-shadow: 0 16rpx 42rpx rgba(61, 39, 25, .18); }
.redstone-cost__tooltip::after { content: ''; position: absolute; right: 22rpx; bottom: -8rpx; width: 16rpx; height: 16rpx; transform: rotate(45deg); background: rgba(255, 252, 247, .98); }
.redstone-cost__tooltip-head { display: flex; align-items: center; justify-content: space-between; font-size: 21rpx; color: #77665b; }
.redstone-cost__balance { font-size: 26rpx; font-weight: 750; color: #9d3e37; }
.redstone-cost__tip { display: block; margin-top: 11rpx; font-size: 19rpx; color: #8a776b; }
.redstone-cost__actions { display: grid; grid-template-columns: 1fr 1fr; gap: 9rpx; margin-top: 15rpx; }
.redstone-cost__action { display: flex; align-items: center; justify-content: center; height: 54rpx; border: 1rpx solid rgba(126, 84, 54, .18); border-radius: 12rpx; font-size: 19rpx; color: #6e5443; background: #f7eee4; }
.redstone-cost__action--primary { border-color: transparent; color: #fff7ef; background: #a44b3f; }
</style>
