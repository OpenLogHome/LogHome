<template>
	<view class="outer">
		<div class="content">
			<div class="underBar"></div>
			<img class="logo" src="@/static/logo.png" @click="gotoTestUrl"></img>
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

			<div class="certification" style="margin-top: 200rpx; text-align: center;">
				<a href="https://www.12377.cn/" target="_blank" style="
				                        background: #fff;
				                        display: inline-block;
				                        padding: 5px 8px;
				                        border: 1px solid #eee;
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
	height: 100%;
	overflow: hidden;
	background-color: #FCF3E0;
}

.content {
	display: flex;
	position: absolute;
	width: 100vw;
	height: 100%;
	z-index: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	width: 200rpx !important;
	height: 200rpx !important;
}

.text-area {
	display: flex;
	margin-top: 50rpx;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.title {
	font-size: 50rpx;
	font-weight: bold;
	color: #8f8f94;
}

.subtitle {
	font-size: 40rpx;
	font-weight: bold;
	color: #8f8f94;
}

.version {
	font-size: 35rpx;
	color: #8f8f94;
}

div.underBar {
	height: 150rpx
}

div.team {
	font-size: 35rpx;
	color: #8f8f94;
	margin: 60rpx;
}

span.name {
	margin-left: 50rpx;
}

.button {
	height: 20px;
	width: 70%;
	margin-top: 15px;
	font-size: 16px;
	font-weight: bold;
	text-align: center;
	line-height: 38px;
	border-radius: 5px;
	color: rgb(180, 111, 88);

}

div.back {
	position: absolute;
	z-index: 0;
	bottom: 0;
}
</style>
