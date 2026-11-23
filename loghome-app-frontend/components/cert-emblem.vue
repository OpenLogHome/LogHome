<template>
	<view class="cert-emblem" :class="'emblem-' + variant">
		<text class="emblem-icon">{{ icon }}</text>
	</view>
</template>

<script>
const ICONS = {
	gold: '🏆',
	silver: '🥈',
	bronze: '🥉',
	green: '🌾',
	blue: '🎖️',
	purple: '🏅',
	ender: '👁️'
};
export default {
	name: 'CertEmblem',
	props: {
		variant: {
			type: String,
			default: 'gold'
		}
	},
	computed: {
		icon() {
			return ICONS[this.variant] || ICONS.gold;
		}
	}
};
</script>

<style lang="scss" scoped>
.cert-emblem {
	--em-edge: #d4a017;
	--em-glow: rgba(255, 196, 64, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	border: 3rpx solid var(--em-edge);
	background: radial-gradient(circle at 35% 30%, #3a2f20 0%, #17120c 70%);
	box-shadow: 0 0 14rpx var(--em-glow), inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
	animation: emblem-bob 2.6s ease-in-out infinite;

	.emblem-icon {
		font-size: 30rpx;
		line-height: 1;
	}
}

.emblem-gold {
	--em-edge: #d4a017;
	--em-glow: rgba(255, 196, 64, 0.5);
}

.emblem-silver {
	--em-edge: #9aa4ad;
	--em-glow: rgba(190, 205, 220, 0.45);
}

.emblem-bronze {
	--em-edge: #b06a2a;
	--em-glow: rgba(220, 140, 60, 0.45);
}

.emblem-green {
	--em-edge: #2f9e44;
	--em-glow: rgba(80, 200, 120, 0.45);
}

.emblem-blue {
	--em-edge: #2f7fd4;
	--em-glow: rgba(80, 160, 255, 0.45);
}

.emblem-purple {
	--em-edge: #7048e8;
	--em-glow: rgba(150, 110, 255, 0.45);
}

.emblem-ender {
	--em-edge: #8a5cf6;
	--em-glow: rgba(160, 104, 255, 0.6);
}

@keyframes emblem-bob {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-6rpx);
	}
}

@media (prefers-reduced-motion: reduce) {
	.cert-emblem {
		animation: none;
	}
}
</style>
