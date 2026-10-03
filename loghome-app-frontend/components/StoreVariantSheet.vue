<template>
	<view v-if="visible" class="variant-overlay">
		<view class="variant-mask" @tap="$emit('close')" @touchmove.stop.prevent @wheel.stop.prevent />
		<view class="variant-sheet" role="dialog" aria-modal="true" aria-label="选择商品规格" @tap.stop>
			<view class="sheet-handle" />
			<button class="sheet-close" aria-label="关闭规格选择" @tap="$emit('close')">
				<store-icon name="close" :size="34" tone="muted" />
			</button>
			<view class="sheet-product">
				<image v-if="cover" class="sheet-cover" :src="cover" mode="aspectFit" />
				<view v-else class="sheet-cover sheet-placeholder">原木好物</view>
				<view class="sheet-copy">
					<view class="sheet-price">
						{{ selected ? selected.price : product.price }}
						<text class="sheet-price-unit">原木{{ selected ? '' : '起' }}</text>
					</view>
					<view class="sheet-stock">
						{{ selected ? '库存 ' + selected.stock + ' 件' : '价格随规格变化' }}
					</view>
					<view class="sheet-selected">
						{{ selected ? '已选：' + selected.label : '请选择商品规格' }}
					</view>
				</view>
			</view>
			<view class="sheet-heading">选择规格</view>
			<scroll-view
				class="sheet-options"
				scroll-y
				:style="{ height: variants.length > 4 ? '460rpx' : '300rpx' }"
			>
				<store-variant-picker
					:variants="variants"
					:selected-id="selectedId"
					:disabled="disabled"
					@select="$emit('select', $event)"
				/>
			</scroll-view>
			<view class="sheet-quantity">
				<text>本次兑换</text>
				<text>1 件</text>
			</view>
			<view class="sheet-footer">
				<button
					class="sheet-confirm"
					:disabled="disabled || !selected || Number(selected.stock) <= 0"
					@tap="$emit('confirm')"
				>
					{{ selected ? confirmText : '请选择规格' }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import StoreVariantPicker from '@/components/StoreVariantPicker.vue'
import StoreIcon from '@/components/StoreIcon.vue'
export default {
	name: 'StoreVariantSheet',
	components: { StoreVariantPicker, StoreIcon },
	props: {
		visible: { type: Boolean, default: false },
		product: { type: Object, default: () => ({}) },
		variants: { type: Array, default: () => [] },
		selectedId: { type: [Number, String], default: null },
		disabled: { type: Boolean, default: false },
		confirmText: { type: String, default: '确认规格' },
	},
	computed: {
		selected() {
			return (
				this.variants.find(
					(row) => Number(row.id) === Number(this.selectedId) && row.status !== 'off'
				) || null
			)
		},
		cover() {
			return (this.selected && this.selected.cover_url) || this.product.cover_url
		},
	},
}
</script>

<style lang="scss" scoped>
.variant-overlay {
	position: fixed;
	inset: 0;
	z-index: 90;
}
.variant-mask {
	position: absolute;
	inset: 0;
	background: rgba(22, 26, 32, 0.48);
}
.variant-sheet {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	max-width: 1080px;
	max-height: 88vh;
	border-radius: 32rpx 32rpx 0 0;
	padding: 20rpx 32rpx 0;
	background: var(--store-surface, #fff);
	color: var(--store-text, #252830);
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}
.sheet-handle {
	width: 64rpx;
	height: 6rpx;
	border-radius: 8rpx;
	background: var(--store-line);
	margin: 0 auto 24rpx;
}
.sheet-close {
	position: absolute;
	top: 24rpx;
	right: 20rpx;
	width: 60rpx;
	height: 60rpx;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 0;
	border-radius: 50%;
	background: var(--store-soft);
	color: var(--store-muted);
	font-size: 46rpx;
	line-height: 72rpx;
	margin: 0;
}
.sheet-close::after,
.sheet-confirm::after {
	border: 0;
}
.sheet-product {
	display: flex;
	align-items: center;
	gap: 24rpx;
	padding-right: 48rpx;
}
.sheet-cover {
	width: 168rpx;
	height: 168rpx;
	border-radius: 16rpx;
	background: #fff;
	border: 1rpx solid var(--store-line);
	flex-shrink: 0;
}
.sheet-placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--store-muted);
	font-size: 24rpx;
}
.sheet-copy {
	flex: 1;
	min-width: 0;
}
.sheet-price {
	color: var(--store-accent);
	font-size: 42rpx;
	font-weight: 650;
}
.sheet-price-unit {
	margin-left: 8rpx;
	font-size: 24rpx;
	font-weight: 400;
}
.sheet-stock {
	color: var(--store-muted);
	font-size: 23rpx;
	margin-top: 6rpx;
}
.sheet-selected {
	font-size: 25rpx;
	margin-top: 8rpx;
	overflow-wrap: anywhere;
}
.sheet-heading {
	font-size: 28rpx;
	font-weight: 600;
	margin: 28rpx 0 20rpx;
}
.sheet-options {
	width: 100%;
	max-height: 38vh;
	flex: 0 1 auto;
	min-height: 0;
}
.sheet-handle,
.sheet-product,
.sheet-heading,
.sheet-quantity,
.sheet-footer {
	flex-shrink: 0;
}
.sheet-quantity {
	display: flex;
	justify-content: space-between;
	font-size: 26rpx;
	padding: 24rpx 0;
	border-top: 1rpx solid var(--store-line);
}
.sheet-footer {
	padding: 12rpx 0 calc(24rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0px)));
}
.sheet-confirm {
	width: 100%;
	margin: 0;
	padding: 20rpx;
	min-height: 88rpx;
	border: 0;
	border-radius: 16rpx;
	background: var(--store-primary);
	color: var(--store-on-primary);
	line-height: 1.5;
	font-size: 29rpx;
	font-weight: 600;
}
.sheet-confirm:disabled {
	color: var(--store-muted);
	background: var(--store-soft);
}
</style>
