<template>
	<view class="variant-picker">
		<view v-if="!availableVariants.length" class="variant-empty">暂无可兑换规格</view>
		<view class="variant-grid">
			<button
				v-for="variant in availableVariants"
				:key="variant.id"
				class="variant-option"
				:class="{ selected: Number(selectedId) === Number(variant.id) }"
				:disabled="disabled || Number(variant.stock) <= 0"
				:aria-pressed="Number(selectedId) === Number(variant.id)"
				@tap="$emit('select', variant)"
			>
				<text class="variant-label">{{ variant.label }}</text>
				<text class="variant-price">
					{{ variant.price }} 原木
					<text v-if="Number(variant.stock) <= 0">· 已兑完</text>
				</text>
				<store-icon
					v-if="Number(selectedId) === Number(variant.id)"
					class="variant-check"
					name="check"
					:size="26"
					tone="brand"
				/>
			</button>
		</view>
	</view>
</template>

<script>
import StoreIcon from '@/components/StoreIcon.vue'
export default {
	name: 'StoreVariantPicker',
	components: { StoreIcon },
	props: {
		variants: { type: Array, default: () => [] },
		selectedId: { type: [Number, String], default: null },
		disabled: { type: Boolean, default: false },
	},
	computed: {
		availableVariants() {
			return this.variants.filter((variant) => variant.status !== 'off')
		},
	},
}
</script>

<style lang="scss" scoped>
.variant-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	padding-bottom: 20rpx;
}
.variant-empty {
	padding: 24rpx 0;
	color: var(--store-muted);
	font-size: 25rpx;
}
.variant-option {
	width: calc(50% - 8rpx);
	box-sizing: border-box;
	margin: 0;
	padding: 18rpx 32rpx 18rpx 18rpx;
	position: relative;
	border: 2rpx solid var(--store-line, #e5e9e2);
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	text-align: left;
	line-height: 1.5;
	background: var(--store-surface, #fff);
	font-size: 25rpx;
	color: var(--store-text, #252e28);
}
.variant-option::after {
	border: none;
}
.variant-option.selected {
	border-color: var(--store-primary, #264d3c);
	background: var(--store-primary-soft, #eaf0e8);
	color: var(--store-primary, #264d3c);
}
.variant-option:disabled {
	opacity: 0.45;
}
.variant-label {
	overflow-wrap: anywhere;
}
.variant-price {
	font-size: 22rpx;
	color: var(--store-muted, #8a8e97);
}
.variant-option.selected .variant-price {
	color: var(--store-primary);
}
.variant-check {
	position: absolute;
	right: 12rpx;
	bottom: 16rpx;
}
</style>
