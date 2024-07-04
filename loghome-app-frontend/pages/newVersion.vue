<template>
	<div class="outer">
		<zetank-backBar textcolor="#000" :showLeft="scrollTop < 200" :showHome="scrollTop < 200" :showTitle="false"
			navTitle='标题'></zetank-backBar>
		<div class="mask">
		</div>
		<img src="https://storage.codesocean.top/api/resource/get/171708788569700" alt="" class="topImg"/>
		<div class="content">
			<div class="title">
				{{msg}}
			</div>
			<div class="subtitle">
				{{versionData.version}}&nbsp;&nbsp;|&nbsp;&nbsp;{{utc2beijing(versionData.update_time)}} 发布
			</div>
			<div class="content" v-html="versionData.version_info">
				
			</div>
		</div>
		<div class="fixedFunction" v-show="msg=='发现新版本'">
			<el-button style="font-size: 30rpx;" @click="copyUrl">复制下载链接</el-button>
			<el-button style="font-size: 30rpx; font-weight: bold; width: 100%;" type="primary" @click="handleDownloadNewVersion">下载新版本</el-button>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return {
				scrollTop: 0,
				versionData: {},
				msg: "发现新版本"
			}
		},
		methods:{
			utc2beijing(utc_datetime) {
				// 转为正常的时间格式 年-月-日 时:分:秒
				var T_pos = utc_datetime.indexOf('T');
				var Z_pos = utc_datetime.indexOf('Z');
				var year_month_day = utc_datetime.substr(0, T_pos);
				var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
				var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06
			
				// 处理成为时间戳
				timestamp = new Date(Date.parse(new_datetime));
				timestamp = timestamp.getTime();
				timestamp = timestamp / 1000;
			
				// 增加8个小时，北京时间比utc时间多八个时区
				var timestamp = timestamp + 8 * 60 * 60;
			
				// 时间戳转为时间
				var beijing_datetime = this.timeConvert(new Date(parseInt(timestamp) * 1000))
				return beijing_datetime;
			},
			handleDownloadNewVersion(){
				uni.navigateTo({
					url: "./apps/openInBrowser?url=" + this.versionData.update_url
				})
			},
			copyUrl(){
				uni.setClipboardData({
					data: this.versionData.update_url
				})
			}
		},
		onPageScroll(res) {
			this.scrollTop = res.scrollTop; //距离页面顶部距离
		},
		onLoad(){
			let _this = this;
			let isApp = this.jsBridge.inApp;
			if(!isApp) return;
			let appVersion = this.$store.state.appVersion;
			axios.get(this.$baseUrl + '/app/get_app_update', {}).then((res) => {
				this.versionData = res.data[0]
				console.log(this.versionData);
				if(res.data[0].version > appVersion){
					this.msg = "发现新版本"
				} else if(res.data[0].version < appVersion){
					this.msg = "正在使用内测版本"
				} else {
					this.msg = "当前已是最新版本"
				}
			}).catch(function (error) {
				uni.showToast({
					title: error.toString(),
					icon:'none',
					duration: 2000
				});
			}).then(function(){
				uni.hideLoading();
			})
		},
	}
</script>

<style>
	.outer{
		background-color: #F2F2F2;
		padding: 0 0 100rpx 0;
	}
	.topImg{
		width: 100vw;
		height: 40vh;
		object-fit: cover;
	}
	.mask{
		background: linear-gradient(to bottom, #F2F2F200, #F2F2F2);
		width: 100vw;
		height: 10vh;
		position: absolute;
		top: 30vh;
	}
	.content{
		padding: 0 60rpx;
		.title{
			font-size: 50rpx;
			font-weight: bold;
		}
		.subtitle{
			margin-top: 15rpx;
			color: #444;
		}
		.content{
			padding: 30rpx 0;
			color: #444;
		}
	}
	.fixedFunction{
		position: fixed;
		width: calc(100vw - 100rpx);
		height: 85rpx;
		bottom: 0;
		display: flex;
		padding: 30rpx 50rpx;
		justify-content: space-around;
		background-color: #F2F2F2;
	}
</style>