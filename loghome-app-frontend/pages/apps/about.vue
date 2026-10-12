<template>
	<view class="outer" v-dark>
		<div class="content">
			<div class="main">
				<img class="logo" src="@/static/logo.png" />
				<view class="text-area">
					<div class="title">{{ title }}</div>
					<!-- <div class="version">公测版本，不提供长期支持</div> -->
					<div class="version" v-show="$store.state.appVersion">APP版本：{{ this.$store.state.appVersion }}</div>
				</view>
				<div class="team">

				</div>
				<!-- 			<div class="button" @click="gotoUpdateIntro">社区更新机制</div> -->
				<div class="button" @click="gotoContentAgreement">用户内容上传协议</div>
				<div class="button" @click="gotoPrivacyAgreement">用户隐私政策</div>
				<div class="button" @click="gotoGrandUsers">社区荣誉用户</div>
				<div class="button" @click="showDevInfo">显示调试信息</div>
			</div>

			<div class="certification">
				<a class="certification-link" target="_blank" href="https://www.12377.cn/">
					<img src="../../static/buliang.svg" alt="" />
					<span>网上有害信息举报专区</span>
				</a>
				<a class="certification-link" target="_blank" href="https://beian.miit.gov.cn/#/Integrated/index">苏ICP备2021006745号-1</a>
				<a class="certification-link" target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=34010402703554">
					<img src="../../static/batb.png" alt="" />
					<span>皖公网安备 34010402703554号</span>
				</a>
			</div>
		</div>
		<div class="back">
			<img :src="aboutBackground" alt="" />
		</div>
	</view>
</template>

<script>
import darkModeMixin from '@/mixins/dark-mode.js'

export default {
	mixins: [darkModeMixin],
	computed: {
		aboutBackground() {
			return this.isDarkMode ? '/static/about_bg-night.png' : '/static/about_bg.jpg'
		}
	},
	watch: {
		isDarkMode() { this.$nextTick(this.updateAboutNavigation) }
	},
	onShow() { this.updateAboutNavigation() },
	onReady() { this.updateAboutNavigation() },
	data() {
		return {
			title: '原木社区',
		}
	},
	onLoad() {

	},
	methods: {
		updateAboutNavigation() {
			uni.setNavigationBarColor({
				frontColor: this.isDarkMode ? '#ffffff' : '#000000',
				backgroundColor: this.isDarkMode ? '#171e19' : '#fcf4e1'
			})
		},
		gotoUpdateIntro() {
			uni.navigateTo({
				url: "../static/updateIntro"
			})
		},
		gotoContentAgreement() {
			uni.navigateTo({
				url: "../static/contentAgreement"
			})
		},
		gotoPrivacyAgreement() {
			uni.navigateTo({
				url: "../static/privacyAgreement"
			})
		},
		gotoGrandUsers() {
			uni.navigateTo({
				url: "../static/grandUsers"
			})
		},
		showDevInfo() {
			console.log(window.jsBridge)
			if (window.jsBridge && window.jsBridge.inApp) {
				uni.showModal({
					title: "调试信息",
					content: JSON.stringify(window.jsBridge),
					showCancel: false
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.outer {
	position: relative;
	height: 100%;
	overflow: hidden;
	/* 上部背景色与 about_bg.jpg 顶边均色(#fcf4e1)完全一致，与贴底图片无缝衔接 */
	background-color: #fcf4e1;
	isolation: isolate;

	&.dark-mode {
		background-color: #171e19;
		color: #eeeae0;
	}
}

.content {
	display: flex;
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	z-index: 1;
	flex-direction: column;
	align-items: center;
	padding: clamp(72rpx, 8vh, 120rpx) 40rpx calc(28rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0px)));
	overflow-y: auto;
	overflow-x: hidden;
}

.logo {
	flex: 0 0 auto;
	width: 176rpx !important;
	height: 176rpx !important;
	border-radius: 36rpx;
	box-shadow: 0 16rpx 44rpx rgba(255, 92, 54, 0.16);
}

.text-area {
	display: flex;
	margin-top: 28rpx;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 8rpx;
}

.title {
	font-size: 46rpx;
	font-weight: bold;
	color: #393d33;
	line-height: 1.25;
	.dark-mode & { color: #eeeae0; }
}

.subtitle {
	font-size: 40rpx;
	font-weight: bold;
	color: #8f8f94;
}

.version {
	font-size: 28rpx;
	color: #6d7267;
	line-height: 1.4;
	.dark-mode & { color: #acb7a9; }
}

div.team {
	flex: 0 0 clamp(36rpx, 5vh, 72rpx);
}

span.name {
	margin-left: 50rpx;
}

.button {
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	min-height: 60rpx;
	width: 70%;
	margin-top: 8rpx;
	padding: 8rpx 18rpx;
	font-size: 30rpx;
	font-weight: bold;
	text-align: center;
	line-height: 1.35;
	border-radius: 12rpx;
	color: var(--brand-text-color);
	.dark-mode & { color: #b9d3bd; }
	&:active { background: rgba(98, 136, 99, .12); }
}

/* 主内容组（logo/标题/按钮）在备案信息上方的剩余空间内垂直居中 */
.main {
	flex: 1 1 auto;
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.certification {
	flex: 0 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	max-width: 100%;
	padding: 12rpx 18rpx;
	border-radius: 16rpx;
	text-align: center;
	background: rgba(252, 244, 225, .8);
	.dark-mode & { background: rgba(23, 30, 25, .85); }
}
.certification-link {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	max-width: 100%;
	font-size: 23rpx;
	line-height: 1.5;
	text-decoration: none;
	color: #626959;
	.dark-mode & { color: #b7c0b1; }
	img { flex-shrink: 0; width: 28rpx; height: 28rpx; object-fit: contain; }
	span { min-width: 0; overflow-wrap: anywhere; }
}

div.back {
	position: absolute;
	inset: 0;
	z-index: 0;
	overflow: hidden;
	display: flex;
	align-items: flex-end;

	/* 贴底展示，保持原始宽高比，不拉伸 */
	img {
		display: block;
		width: 100%;
		height: auto;
		max-height: 100%;
		object-fit: contain;
		object-position: bottom;
	}

}
.outer.dark-mode .back img {
	-webkit-mask-image: linear-gradient(to bottom, transparent, #000 15%);
	mask-image: linear-gradient(to bottom, transparent, #000 15%);
}
</style>
