<template>
	<view v-if="certifications && certifications.length" class="certifications-row">
		<view class="cert-slot" :class="'cert-' + (selectedCert.variant || 'gold')">
			<view class="cert-badge" :class="badgeClass(selectedCert)" @click="onBadgeTap">
				<view class="cert-shine-wrap"><view class="cert-shine"></view></view>
				<view class="cert-particles"></view>
				<view v-if="isEnder(selectedCert)" class="cert-eyes">
					<view class="cert-eye"></view>
					<view class="cert-eye"></view>
				</view>
				<text class="cert-title">{{ selectedCert.title }}</text>
			</view>
			<view v-if="popupOpen" class="cert-popup-mask" @click="closePopup"></view>
			<view v-if="popupOpen" class="cert-popup">
				<view class="cert-popup-title">{{ $t('me.profile.certPopupTitle') }}</view>
				<view v-for="(cert, idx) in certifications" :key="idx" class="cert-badge cert-mini" :class="'cert-' + (cert.variant || 'gold')">
					<view class="cert-shine-wrap"><view class="cert-shine"></view></view>
					<view class="cert-particles"></view>
					<view v-if="isEnder(cert)" class="cert-eyes">
						<view class="cert-eye"></view>
						<view class="cert-eye"></view>
					</view>
					<text class="cert-title">{{ cert.title }}</text>
				</view>
			</view>
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
		},
		displayIndex: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			popupOpen: false
		};
	},
	computed: {
		selectedCert() {
			return this.certifications[this.displayIndex] || this.certifications[0];
		},
		hasMultiple() {
			return this.certifications.length > 1;
		}
	},
	watch: {
		certifications() {
			this.popupOpen = false;
		}
	},
	methods: {
		badgeClass(cert) {
			return ['cert-' + ((cert && cert.variant) || 'gold'), { 'cert-clickable': this.hasMultiple }];
		},
		isEnder(cert) {
			return cert && cert.variant === 'ender';
		},
		onBadgeTap() {
			if (!this.hasMultiple) return;
			this.popupOpen = !this.popupOpen;
		},
		closePopup() {
			this.popupOpen = false;
		}
	}
};
</script>

<style lang="scss" scoped>
@property --cert-melt {
	syntax: '<percentage>';
	inherits: false;
	initial-value: -30%;
}

.certifications-row {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin: 14rpx 50rpx 0;
}

.cert-slot {
	position: relative;
	display: inline-flex;
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

	.cert-particles {
		display: none;
		position: absolute;
		inset: 0;
		border-radius: inherit;
		overflow: hidden;
		pointer-events: none;
		z-index: 1;
	}
}

.cert-clickable {
	cursor: pointer;
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
	--cert-popup-bg: rgba(42, 33, 18, 0.96);
	--cert-popup-edge: rgba(212, 160, 23, 0.5);
}

.cert-silver {
	--cert-edge: #9aa4ad;
	--cert-bright: #e6ecf2;
	--cert-text: #e8eef4;
	--cert-glow: rgba(190, 205, 220, 0.4);
	--cert-popup-bg: rgba(30, 34, 39, 0.96);
	--cert-popup-edge: rgba(154, 164, 173, 0.5);
}

.cert-bronze {
	--cert-edge: #b06a2a;
	--cert-bright: #e8a860;
	--cert-text: #ffd9ae;
	--cert-glow: rgba(220, 140, 60, 0.4);
	--cert-popup-bg: rgba(44, 30, 18, 0.96);
	--cert-popup-edge: rgba(176, 106, 42, 0.5);
}

.cert-blue {
	--cert-edge: #2f7fd4;
	--cert-bright: #7cc4ff;
	--cert-text: #cfe8ff;
	--cert-glow: rgba(80, 160, 255, 0.4);
	--cert-popup-bg: rgba(20, 30, 44, 0.96);
	--cert-popup-edge: rgba(47, 127, 212, 0.5);
}

.cert-green {
	--cert-edge: #2f9e44;
	--cert-bright: #8ce99a;
	--cert-text: #d3f9d8;
	--cert-glow: rgba(80, 200, 120, 0.4);
	--cert-popup-bg: rgba(22, 38, 26, 0.96);
	--cert-popup-edge: rgba(47, 158, 68, 0.5);
}

.cert-purple {
	--cert-edge: #7048e8;
	--cert-bright: #b197fc;
	--cert-text: #e5dbff;
	--cert-glow: rgba(150, 110, 255, 0.4);
	--cert-popup-bg: rgba(34, 26, 52, 0.96);
	--cert-popup-edge: rgba(112, 72, 232, 0.5);

	.cert-particles {
		display: block;
		background-image:
			radial-gradient(circle, rgba(235, 215, 255, 1) 0 2.2rpx, rgba(160, 104, 255, 0.4) 3.6rpx, transparent 5.2rpx),
			radial-gradient(circle, rgba(200, 150, 255, 0.95) 0 1.8rpx, transparent 3.4rpx),
			radial-gradient(circle, rgba(130, 80, 230, 0.85) 0 1.5rpx, transparent 2.8rpx),
			radial-gradient(circle, rgba(225, 200, 255, 0.9) 0 1.2rpx, transparent 2.4rpx);
		background-size: 60rpx 30rpx, 44rpx 26rpx, 72rpx 34rpx, 36rpx 20rpx;
		animation: cert-particle-flow 2.4s linear infinite;
	}
}

@keyframes cert-particle-flow {
	from {
		background-position: 0 0, 0 0, 0 0, 0 0;
	}
	to {
		background-position: -60rpx 6rpx, 44rpx -4rpx, -72rpx -6rpx, 36rpx 5rpx;
	}
}

.cert-ender {
	--cert-edge: #8a5cf6;
	--cert-bright: #d0b3ff;
	--cert-text: #efe6ff;
	--cert-glow: rgba(160, 104, 255, 0.55);
	--cert-popup-bg: rgba(36, 26, 56, 0.96);
	--cert-popup-edge: rgba(138, 92, 246, 0.55);

	.cert-title {
		text-shadow: 0 0 8rpx rgba(10, 6, 20, 0.9), 0 1rpx 2rpx rgba(0, 0, 0, 0.8);
		--cert-melt: -30%;
		-webkit-mask-image: radial-gradient(circle at 50% 50%, transparent 0 var(--cert-melt), rgba(0, 0, 0, 0.35) calc(var(--cert-melt) + 14%), #000 calc(var(--cert-melt) + 34%));
		mask-image: radial-gradient(circle at 50% 50%, transparent 0 var(--cert-melt), rgba(0, 0, 0, 0.35) calc(var(--cert-melt) + 14%), #000 calc(var(--cert-melt) + 34%));
		animation: cert-melt 11s ease-in-out infinite;
	}
}

.cert-eyes {
	position: absolute;
	inset: 0;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	pointer-events: none;
	animation: cert-eyes-flood 11s ease-in-out infinite;

	.cert-eye {
		width: 26rpx;
		height: 10rpx;
		border-radius: 3rpx;
		background: radial-gradient(ellipse at center, #ffffff 0 30%, #e6d4ff 55%, #b48cf0 82%, #9a6cf0 100%);
		animation: cert-eye-glow 11s ease-in-out infinite, cert-eye-blink 11s ease-in-out infinite;
	}
}

@keyframes cert-eyes-flood {
	0%,
	40% {
		opacity: 0.3;
	}
	52%,
	80% {
		opacity: 0.95;
	}
	92%,
	100% {
		opacity: 0.3;
	}
}

@keyframes cert-eye-glow {
	0%,
	42% {
		box-shadow: 0 0 4rpx rgba(190, 140, 255, 0.3);
	}
	54%,
	78% {
		box-shadow:
			0 0 10rpx 8rpx rgba(210, 175, 250, 0.75),
			0 0 30rpx 18rpx rgba(225, 200, 255, 0.55),
			0 0 60rpx 30rpx rgba(160, 104, 255, 0.4);
	}
	90%,
	100% {
		box-shadow: 0 0 4rpx rgba(190, 140, 255, 0.3);
	}
}

@keyframes cert-eye-blink {
	0%,
	38% {
		transform: scaleY(0.12);
	}
	44%,
	86% {
		transform: scaleY(1);
	}
	91%,
	100% {
		transform: scaleY(0.12);
	}
}

@keyframes cert-melt {
	0%,
	46% {
		--cert-melt: -30%;
		opacity: 1;
		filter: blur(0);
	}
	62%,
	78% {
		--cert-melt: 175%;
		opacity: 0;
		filter: blur(6rpx);
	}
	92%,
	100% {
		--cert-melt: -30%;
		opacity: 1;
		filter: blur(0);
	}
}

.cert-popup-mask {
	position: fixed;
	inset: 0;
	z-index: 25;
}

.cert-popup {
	position: absolute;
	left: calc(100% + 16rpx);
	top: -10rpx;
	z-index: 26;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12rpx;
	min-width: 280rpx;
	max-width: 440rpx;
	padding: 18rpx;
	border-radius: 16rpx;
	background: var(--cert-popup-bg, rgba(30, 24, 44, 0.96));
	border: 2rpx solid var(--cert-popup-edge, rgba(160, 120, 255, 0.5));
	box-shadow: 0 0 16rpx var(--cert-glow), 0 12rpx 32rpx rgba(0, 0, 0, 0.35);
}

.cert-popup-title {
	font-size: 22rpx;
	color: var(--cert-bright, #cbb8ff);
}

.cert-mini {
	.cert-title {
		font-size: 22rpx;
	}

	.cert-eye {
		width: 22rpx;
		height: 8rpx;
	}
}

@media (prefers-reduced-motion: reduce) {
	.cert-badge::before,
	.cert-badge::after,
	.cert-shine,
	.cert-purple .cert-particles,
	.cert-eyes,
	.cert-eye,
	.cert-ender .cert-title {
		animation: none;
	}

	.cert-eyes {
		opacity: 0.85;
	}

	.cert-ender .cert-title {
		-webkit-mask-image: none;
		mask-image: none;
		opacity: 1;
	}

	.cert-badge::before,
	.cert-badge::after {
		opacity: 0.8;
	}
}
</style>
