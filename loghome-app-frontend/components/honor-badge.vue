<template>
	<view
		v-if="badge"
		class="honor-badge"
		:class="[sizeClass, { 'show-title': showTitle, 'with-shine': visual.shine, 'is-locked': locked }]"
		:style="rootStyle"
		@tap="handleTap"
		@click="handleClick"
	>
		<view class="medal-wrap" :style="medalWrapStyle">
			<img class="medal-image" :src="visual.medal_image" mode="aspectFit"></img>
			<view v-if="visual.shine && !locked" class="medal-shine-mask">
				<view class="medal-shine"></view>
			</view>
		</view>
		<view v-if="showTitle" class="badge-text">
			<text class="badge-title">{{badge.title || '官方荣誉'}}</text>
		</view>
	</view>
</template>

<script>
import { resolveAchievementBadgeVisual } from '../lib/achievementBadgeVisual.js'

export default {
	name: 'HonorBadge',
	props: {
		badge: {
			type: Object,
			default: null,
		},
		showTitle: {
			type: Boolean,
			default: false,
		},
		size: {
			type: String,
			default: 'md',
		},
		scale: {
			type: [Number, String],
			default: 1,
		},
		locked: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		visual() {
			return resolveAchievementBadgeVisual(this.badge)
		},
		rootStyle() {
			const n = Number(this.scale)
			const safeScale = Number.isFinite(n) && n > 0 ? n : 1
			return {
				transform: `scale(${safeScale})`,
			}
		},
		medalWrapStyle() {
			const src = (this.visual && this.visual.medal_image) || ''
			if (!src) return {}
			return {
				'--medal-mask-image': `url("${src}")`,
			}
		},
		sizeClass() {
			if (this.size === 'sm') return 'is-sm'
			if (this.size === 'name') return 'is-name'
			if (this.size === 'lg') return 'is-lg'
			return 'is-md'
		}
	},
	methods: {
		handleTap(event) {
			this.$emit('tap', event)
		},
		handleClick(event) {
			this.$emit('click', event)
		},
	},
}
</script>

<style scoped lang="scss">
.honor-badge {
	display: inline-flex;
	align-items: center;
	gap: 12rpx;
	padding: 4rpx 0;
}

.medal-wrap {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 0;
	overflow: visible;
	border: none;
	box-shadow: none;
	background: transparent;
}

.medal-image {
	width: 100%;
	height: 100%;
	display: block;
}

.medal-shine-mask {
	position: absolute;
	inset: 0;
	overflow: hidden;
	pointer-events: none;
}

.medal-shine {
	position: absolute;
	top: -25%;
	left: -130%;
	width: 56%;
	height: 150%;
	background: linear-gradient(
		120deg,
		rgba(255, 255, 255, 0),
		rgba(255, 255, 255, 0.85),
		rgba(255, 255, 255, 0)
	);
	transform: rotate(20deg);
	animation: badge-shine 2.6s ease-in-out infinite;
	mix-blend-mode: screen;
}

/* Crop shine by PNG alpha channel so transparent areas won't glow. */
@supports ((-webkit-mask-image: url("")) or (mask-image: url(""))) {
	.medal-shine-mask {
		-webkit-mask-image: var(--medal-mask-image);
		-webkit-mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-image: var(--medal-mask-image);
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
	}
}

.badge-title {
	color: inherit;
	font-size: 22rpx;
	font-weight: 600;
	line-height: 1.2;
}

.badge-text {
	display: inline-flex;
	flex-direction: column;
	justify-content: center;
}

.with-shine .medal-image {
	filter: drop-shadow(0 0 8rpx rgba(255, 255, 255, 0.5));
}

.is-sm .medal-wrap {
	width: 40rpx;
	height: 40rpx;
}

.is-name .medal-wrap {
	width: 44rpx;
	height: 44rpx;
}

.is-md .medal-wrap {
	width: 52rpx;
	height: 52rpx;
}

.is-lg .medal-wrap {
	width: 68rpx;
	height: 68rpx;
}

.is-sm.show-title .medal-wrap,
.is-md.show-title .medal-wrap {
	width: 56rpx;
	height: 56rpx;
}

.is-lg.show-title .medal-wrap {
	width: 74rpx;
	height: 74rpx;
}

@keyframes badge-shine {
	0% {
		left: -130%;
	}
	50% {
		left: 160%;
	}
	100% {
		left: 160%;
	}
}

.is-locked .medal-wrap {
	opacity: 0.5;
	filter: grayscale(100%);
}

.is-locked .badge-title {
	color: #9a9a9a;
}
</style>
