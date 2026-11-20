<template>
	<view v-if="certifications && certifications.length" class="certifications-row">
		<view v-for="(cert, idx) in certifications" :key="idx" class="cert-badge" :class="'cert-' + (cert.variant || 'gold')">
			<view class="cert-shine-wrap"><view class="cert-shine"></view></view>
			<text class="cert-prefix">{{ $t('me.profile.certifiedPrefix') }}</text>
			<text class="cert-title">{{ cert.title }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'UserCertifications',
	props: {
		certifications: {
			type: Array,
			default: () => []
		}
	}
};
</script>

<style lang="scss" scoped>
.certifications-row {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin: 14rpx 50rpx 0;
}

.cert-badge {
	--cert-edge: #d4a017;
	--cert-bright: #ffd76a;
	--cert-text: #ffe9a8;
	--cert-glow: rgba(255, 196, 64, 0.45);
	position: relative;
	display: inline-flex;
	align-items: center;
	gap: 4rpx;
	max-width: 100%;
	box-sizing: border-box;
	padding: 10rpx 22rpx;
	border-radius: 12rpx;
	border: 2rpx solid var(--cert-edge);
	background: linear-gradient(180deg, #2a2118 0%, #17120c 100%);
	box-shadow: 0 0 12rpx var(--cert-glow), inset 0 1rpx 0 rgba(255, 255, 255, 0.15);

	&::before,
	&::after {
		content: '✦';
		position: absolute;
		font-size: 18rpx;
		line-height: 1;
		color: var(--cert-bright);
		text-shadow: 0 0 6rpx var(--cert-glow);
		animation: cert-twinkle 2.2s ease-in-out infinite;
		pointer-events: none;
	}

	&::before {
		top: -8rpx;
		right: 14rpx;
	}

	&::after {
		bottom: -8rpx;
		left: 18rpx;
		animation-delay: 1.1s;
	}

	.cert-prefix {
		position: relative;
		z-index: 2;
		font-size: 22rpx;
		color: var(--cert-text);
		opacity: 0.75;
	}

	.cert-title {
		position: relative;
		z-index: 2;
		font-size: 24rpx;
		font-weight: 700;
		line-height: 1.35;
		color: var(--cert-text);
	}

	.cert-shine-wrap {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		overflow: hidden;
		pointer-events: none;
	}

	.cert-shine {
		position: absolute;
		top: 0;
		left: 0;
		width: 60%;
		height: 100%;
		background: linear-gradient(105deg, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%);
		transform: translateX(-150%) skewX(-18deg);
		animation: cert-shine 3.4s ease-in-out infinite;
	}
}

@keyframes cert-shine {
	0% {
		transform: translateX(-150%) skewX(-18deg);
	}
	45% {
		transform: translateX(280%) skewX(-18deg);
	}
	100% {
		transform: translateX(280%) skewX(-18deg);
	}
}

@keyframes cert-twinkle {
	0%,
	100% {
		opacity: 0;
		transform: scale(0.6);
	}
	50% {
		opacity: 1;
		transform: scale(1);
	}
}

.cert-gold {
	--cert-edge: #d4a017;
	--cert-bright: #ffd76a;
	--cert-text: #ffe9a8;
	--cert-glow: rgba(255, 196, 64, 0.45);
}

.cert-silver {
	--cert-edge: #9aa4ad;
	--cert-bright: #e6ecf2;
	--cert-text: #e8eef4;
	--cert-glow: rgba(190, 205, 220, 0.4);
}

.cert-bronze {
	--cert-edge: #b06a2a;
	--cert-bright: #e8a860;
	--cert-text: #ffd9ae;
	--cert-glow: rgba(220, 140, 60, 0.4);
}

.cert-stone {
	--cert-edge: #7f8878;
	--cert-bright: #cfd8c6;
	--cert-text: #e4ead9;
	--cert-glow: rgba(150, 170, 140, 0.28);
}

.cert-blue {
	--cert-edge: #2f7fd4;
	--cert-bright: #7cc4ff;
	--cert-text: #cfe8ff;
	--cert-glow: rgba(80, 160, 255, 0.4);
}

.cert-green {
	--cert-edge: #2f9e44;
	--cert-bright: #8ce99a;
	--cert-text: #d3f9d8;
	--cert-glow: rgba(80, 200, 120, 0.4);
}

.cert-purple {
	--cert-edge: #7048e8;
	--cert-bright: #b197fc;
	--cert-text: #e5dbff;
	--cert-glow: rgba(150, 110, 255, 0.4);
}

@media (prefers-reduced-motion: reduce) {
	.cert-badge::before,
	.cert-badge::after,
	.cert-shine {
		animation: none;
	}

	.cert-badge::before,
	.cert-badge::after {
		opacity: 0.8;
	}
}
</style>