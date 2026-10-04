<template>
	<view class="outer" v-dark>
		<div class="content">
			<img class="logo" src="@/static/logo.png" @click="gotoTestUrl" />
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

			<div class="certification">
				<a href="https://www.12377.cn/" target="_blank" style="
				                        background: var(--card-background);
				                        display: inline-block;
				                        padding: 5px 8px;
				                        border: 1px solid var(--border-color);
				                        border-radius: 5px;
				                        margin: 5px 0;
										text-decoration:none;
										color:#939393;
										vertical-align: middle;
										font-size: 30rpx;
				                    "><log-image src="https://dn-tystatic.qbox.me/img/buliang.png" style="
				                        margin-right: 5px;
				                        width: 35rpx;
				                        height: 35rpx;" />网上有害信息举报专区</a>

				<div style="font-size:30rpx;text-decoration:none;height:20px;line-height:20px;color:#939393;
				margin-bottom:10rpx;">
					<a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/index" style="font-size:30rpx;text-decoration:none;height:20px;line-height:20px;color:#939393;
					margin-bottom:10rpx;">
						<p>苏ICP备2021006745号-1</p>
					</a>

				</div>
				<img src="../../static/batb.png" alt="" />
				<a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=34010402703554"
					style="font-size:30rpx;display:inline-block;text-decoration:none;height:20px;line-height:20px;">
					<p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">皖公网安备
						34010402703554号</p>
				</a>
			</div>
		</div>
		<div class="back">
			<img src="../../static/about_bg.jpg" alt="" />
		</div>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '原木社区',
		}
	},
	onLoad() {

	},
	methods: {
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
		gotoTestUrl() {
			uni.navigateTo({
				url: "./audio_test"
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
	background-color: var(--background-color-secondary);
	isolation: isolate;
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
	color: #8f8f94;
	line-height: 1.25;
}

.subtitle {
	font-size: 40rpx;
	font-weight: bold;
	color: #8f8f94;
}

.version {
	font-size: 28rpx;
	color: #8f8f94;
	line-height: 1.4;
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
}

.certification {
	flex: 0 0 auto;
	margin-top: auto;
	padding-top: clamp(48rpx, 8vh, 120rpx);
	text-align: center;
}

div.back {
	position: absolute;
	inset: 0;
	z-index: 0;
	overflow: hidden;

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: fill;
	}
}
</style>
