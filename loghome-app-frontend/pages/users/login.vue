<template>
	<view class="login-page">
		<view class="login-stage" :class="{ 'is-english': isEnglish }">
			<image class="forest-scene" src="/static/login/forest-bookshop.webp" mode="aspectFill" aria-hidden="true" />

			<view class="login-header">
				<button class="back-button" role="button" tabindex="0" :aria-label="$t('common.back')" @click="goBack" @keydown.enter.prevent="goBack" @keydown.space.prevent="goBack">
					<uni-icons type="left" size="25" color="#fffdf0" />
				</button>
				<view class="brand" :aria-label="$t('auth.brand.name')">
					<image class="brand-logo" src="/static/logo.png" mode="aspectFit" aria-hidden="true" />
					<image class="brand-wordmark" src="/static/login/brand-wordmark.png" mode="aspectFit" aria-hidden="true" />
				</view>
			</view>

			<view class="welcome-copy">
				<view class="welcome-title" role="heading" aria-level="1">
					<text class="headline-line">{{ $t('auth.login.headlineTop') }}</text>
					<text class="headline-line">{{ $t('auth.login.headlinePrefix') }}<text class="growth-word">{{ $t('auth.login.headlineGrowth') }}</text>{{ $t('auth.login.headlineEnd') }}</text>
				</view>
				<text class="community-description">{{ $t('auth.login.communityDescription') }}</text>
			</view>

			<view class="login-actions">
				<button class="email-login" role="button" tabindex="0" @click="gotoLoginEmail" @keydown.enter.prevent="gotoLoginEmail" @keydown.space.prevent="gotoLoginEmail">
					<image class="button-skin" src="/static/login/pixel-login-button.webp" mode="scaleToFill" aria-hidden="true" />
					<view class="button-content">
						<uni-icons type="email-filled" size="26" color="#153d21" aria-hidden="true" />
						<text>{{ $t('auth.login.withEmail') }}</text>
					</view>
					<view class="button-arrow" aria-hidden="true"><uni-icons type="right" size="22" color="#153d21" /></view>
				</button>
				<view class="privacy-row" :class="{ shake: noActivated }">
					<checkbox-group class="privacy-checkbox" @change="selectCk">
						<label class="privacy-choice" role="checkbox" tabindex="0" :aria-checked="checked ? 'true' : 'false'"
							@keydown.enter.prevent="toggleAgreement" @keydown.space.prevent="toggleAgreement">
							<checkbox value="yes" :checked="checked" color="#397a42" aria-hidden="true" tabindex="-1" />
							<text>{{ $t('auth.login.agreeShort') }}</text>
						</label>
					</checkbox-group>
					<navigator class="privacy-link" url="../static/privacyAgreement" open-type="navigate">{{ $t('auth.login.privacyShort') }}</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return { checked: false, noActivated: false, agreementTimer: null }
	},
	computed: {
		isEnglish() { return String(this.$i18n.locale).startsWith('en') }
	},
	onLoad(params = {}) {
		if (params.msg !== undefined) {
			uni.showToast({ title: this.$t('common.needLogin'), icon: 'none', duration: 2000 })
		}
		if (typeof window !== 'undefined') window.sessionStorage.removeItem('uni_token')
	},
	onUnload() { this.clearAgreementTimer() },
	beforeDestroy() { this.clearAgreementTimer() },
	methods: {
		goBack() {
			const bridge = typeof window !== 'undefined' ? window.jsBridge : null
			if ((bridge && bridge.inApp && bridge.nativeRouterAvailable) || getCurrentPages().length > 1) {
				uni.navigateBack({ delta: 1 })
			} else {
				uni.reLaunch({ url: '/pages/library' })
			}
		},
		gotoLoginEmail() {
			if (this.checked) {
				uni.navigateTo({ url: './login_page_email' })
				return
			}
			uni.showToast({ title: this.$t('auth.login.agreeRequired'), icon: 'none', duration: 2000 })
			this.clearAgreementTimer()
			this.noActivated = true
			this.agreementTimer = setTimeout(() => {
				this.noActivated = false
				this.agreementTimer = null
			}, 600)
		},
		selectCk(event) {
			this.checked = event.detail.value.includes('yes')
			if (this.checked) {
				this.clearAgreementTimer()
				this.noActivated = false
			}
		},
		toggleAgreement() {
			this.selectCk({ detail: { value: this.checked ? [] : ['yes'] } })
		},
		clearAgreementTimer() {
			if (this.agreementTimer !== null) clearTimeout(this.agreementTimer)
			this.agreementTimer = null
		}
	}
}
</script>

<style scoped lang="scss">
.login-page {
	min-height: 100vh;
	background: #12342e;
}
.login-stage {
	position: relative;
	width: 100%;
	max-width: 560px;
	height: 100vh;
	height: 100svh;
	min-height: 640px;
	margin: 0 auto;
	overflow: hidden;
	background: #f8f8f8;
	color: #fffdf0;
	font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.forest-scene {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	animation: forest-glow 8s ease-in-out infinite;
}
.login-header {
	position: absolute;
	top: calc(3.5% + var(--loghome-safe-top, 0px));
	left: 0;
	right: 0;
	height: 34px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.back-button {
	position: absolute;
	left: 4%;
	top: -5px;
	width: 44px;
	height: 44px;
	padding: 0;
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: transparent;
	border-radius: 8px;
	line-height: 1;
}
.back-button::after, .email-login::after { border: 0; }
.back-button:focus-visible, .email-login:focus-visible, .privacy-link:focus-visible, .privacy-choice:focus-visible {
	outline: 2px solid #8fdf70;
	outline-offset: 4px;
}
.brand {
	display: flex;
	align-items: center;
	gap: 6px;
}
.brand-logo { width: 30px; height: 30px; }
.brand-wordmark {
	width: 82px;
	height: 27px;
	// Supplied orange-on-white lettering: white ink on black, then screen out black.
	filter: grayscale(1) invert(1) brightness(3);
	mix-blend-mode: screen;
}
.welcome-copy {
	position: absolute;
	top: calc(10.1% + var(--loghome-safe-top, 0px));
	left: 6.7%;
	right: 6.7%;
}
.welcome-title {
	font-size: clamp(29px, 9.9vw, 48px);
	font-weight: 900;
	letter-spacing: -0.035em;
	line-height: 1.18;
	text-shadow: 0 2px 8px rgba(5, 35, 27, 0.14);
}
.headline-line { display: block; white-space: nowrap; }
.growth-word { color: #8fdf70; }
.community-description {
	display: block;
	margin-top: 8px;
	font-size: clamp(12px, 3.38vw, 17px);
	font-weight: 600;
	line-height: 1.6;
	color: #d4f4b8;
}
.login-actions {
	position: absolute;
	left: 5.5%;
	right: 5.5%;
	bottom: calc(4.7% + var(--loghome-safe-bottom, 0px));
}
.email-login {
	position: relative;
	width: 100%;
	height: 60px;
	height: clamp(56px, 7.1svh, 64px);
	padding: 0;
	margin: 0;
	overflow: hidden;
	background: transparent;
	border-radius: 0;
	color: #153d21;
	transition: transform 140ms ease;
}
.email-login:active { transform: translateY(3px) scale(0.99); }
.button-skin {
	position: absolute;
	// Crop transparent padding using the generated skin's measured visible bounds.
	width: 106.4%;
	height: 194.1%;
	left: -3.2%;
	top: -45.9%;
	pointer-events: none;
}
.button-content {
	position: relative;
	z-index: 1;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16px;
	padding-bottom: 3px;
	box-sizing: border-box;
	font-size: clamp(19px, 5.1vw, 26px);
	font-weight: 800;
	line-height: 1.25;
}
.button-arrow {
	position: absolute;
	z-index: 1;
	right: 18px;
	top: 0;
	height: calc(100% - 3px);
	display: flex;
	align-items: center;
}
.privacy-row {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	min-height: 44px;
	margin-top: 14px;
	color: #70747a;
	font-size: 12px;
	line-height: 1.6;
}
.privacy-choice {
	display: flex;
	align-items: center;
	min-height: 44px;
	gap: 4px;
}
.privacy-choice checkbox {
	transform: scale(0.75);
	transform-origin: center;
}
.privacy-link {
	display: inline-flex;
	align-items: center;
	min-height: 44px;
	color: #23633d;
	font-weight: 500;
}
.is-english {
	.welcome-title { font-size: clamp(23px, 6.3vw, 34px); letter-spacing: -0.035em; }
	.headline-line { white-space: normal; }
	.community-description { max-width: 300px; }
	.button-content { font-size: 18px; gap: 12px; }
	.privacy-row { column-gap: 4px; }
}
.shake { animation: agreement-shake 360ms ease-in-out; }
@keyframes forest-glow {
	0%, 100% { filter: brightness(1); }
	50% { filter: brightness(1.035); }
}
@keyframes agreement-shake {
	0%, 100% { transform: translateX(0); }
	25%, 75% { transform: translateX(-4px); }
	50% { transform: translateX(4px); }
}
@media (prefers-reduced-motion: reduce) {
	.forest-scene, .shake { animation: none; }
	.email-login { transition: none; }
}
@media (min-width: 560px) {
	.welcome-title { font-size: 48px; }
	.community-description { font-size: 17px; }
}
</style>
