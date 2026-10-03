<template>
	<view
		v-if="normalizedTier"
		class="membership-badge"
		:class="[
			'membership-badge--' + normalizedTier,
			'membership-badge--' + size,
			{ 'membership-badge--icon-only': !showLabel }
		]"
		:title="label"
	>
		<image class="membership-badge__icon" :src="icon" mode="aspectFit"></image>
		<text v-if="showLabel" class="membership-badge__label">{{ label }}</text>
	</view>
</template>

<script>
export default {
	name: 'MembershipBadge',
	props: {
		tier: {
			type: [String, Number, Object],
			default: '',
		},
		size: {
			type: String,
			default: 'sm',
		},
		showLabel: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		normalizedTier() {
			const source = this.tier && typeof this.tier === 'object'
				? this.tier.type || this.tier.membership_type || this.tier.level
				: this.tier;
			const value = String(source || '').trim().toLowerCase();
			if (value === 'super' || value === '2' || value.indexOf('超级') !== -1) return 'super';
			if (value === 'standard' || value === '1' || value.indexOf('原木') !== -1) return 'standard';
			return '';
		},
		label() {
			return this.normalizedTier === 'super' ? '超级通行证会员' : '通行证会员';
		},
		icon() {
			return this.normalizedTier === 'super'
				? '/static/membership/loghome-super-pass.png'
				: '/static/membership/loghome-pass.png';
		},
	},
};
</script>

<style scoped lang="scss">
.membership-badge {
	display: inline-flex;
	align-items: center;
	flex-shrink: 0;
	box-sizing: border-box;
	max-width: 100%;
	border: 1rpx solid rgba(145, 91, 40, .18);
	border-radius: 999rpx;
	white-space: nowrap;
	vertical-align: middle;
	background: linear-gradient(135deg, rgba(255, 244, 219, .96), rgba(239, 211, 158, .82));
	box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, .66);
}

.membership-badge--super {
	border-color: rgba(226, 176, 78, .32);
	color: #ffe3a1;
	background: linear-gradient(135deg, #203c58, #10283e);
	box-shadow: inset 0 1rpx 0 rgba(255, 232, 178, .2), 0 3rpx 8rpx rgba(15, 35, 53, .14);
}

.membership-badge--standard {
	color: #89501f;
}

.membership-badge__icon {
	flex-shrink: 0;
	image-rendering: pixelated;
}

.membership-badge__label {
	overflow: hidden;
	font-weight: 650;
	line-height: 1;
	text-overflow: ellipsis;
}

.membership-badge--xs {
	height: 31rpx;
	padding: 2rpx 8rpx 2rpx 3rpx;
	font-size: 17rpx;
	gap: 3rpx;
}

.membership-badge--xs .membership-badge__icon {
	width: 26rpx;
	height: 26rpx;
}

.membership-badge--sm {
	height: 38rpx;
	padding: 2rpx 10rpx 2rpx 3rpx;
	font-size: 19rpx;
	gap: 5rpx;
}

.membership-badge--sm .membership-badge__icon {
	width: 33rpx;
	height: 33rpx;
}

.membership-badge--md {
	height: 46rpx;
	padding: 3rpx 14rpx 3rpx 4rpx;
	font-size: 22rpx;
	gap: 7rpx;
}

.membership-badge--md .membership-badge__icon {
	width: 39rpx;
	height: 39rpx;
}

.membership-badge--icon-only {
	justify-content: center;
	width: auto;
	padding-right: 3rpx;
}

.membership-badge--icon-only.membership-badge--xs { width: 31rpx; padding: 2rpx; }
.membership-badge--icon-only.membership-badge--sm { width: 38rpx; padding: 2rpx; }
.membership-badge--icon-only.membership-badge--md { width: 46rpx; padding: 3rpx; }
</style>
