<template>
	<view class="outer" v-dark>
		<div class="info">
			<p>{{ $t('settings.activate.welcome') }}</p>
			<p>{{ $t('settings.activate.oicqIntro') }}</p>
			<p>{{ $t('settings.activate.oicqStep1') }}</p>
			<div class="bordered verifyCode" @mousedown="copyCode" @longtap="copyCode">
				{{code}}
			</div>
			<p>{{ $t('settings.activate.oicqStep2') }}</p>
			<div class="bordered groups">
				<p>{{ $t('settings.activate.oicqGroupList') }}</p>
				<p>{{ $t('settings.activate.oicqGroupMain') }}</p>
				<p v-show="false">{{ $t('settings.activate.oicqGroupBeta') }}</p>
				<p>{{ $t('settings.activate.oicqGroupWriter') }}</p>
			</div>
			<p>{{ $t('settings.activate.oicqStep3Prefix') }}<span style="font-weight:bold;color:var(--brand-text-color)">{{ $t('settings.activate.oicqStep3Via') }}</span>{{ $t('settings.activate.oicqStep3Suffix') }}</p>
			<p><span style="font-weight:bold;color:var(--brand-text-color)">{{ $t('settings.activate.oicqTip') }}</span></p>
			<p>{{ $t('settings.activate.oicqBindNote') }}</p>
		</div>
		<!-- <div class="button" @click="goAnyWay">以游客身份继续使用</div> -->
	</view>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return{
				code:""
			}
		},
		methods:{
			copyCode(){
				uni.setClipboardData({
					data: this.code,
					success: function () {
					    console.log('success');
					}
				})
			},
			goAnyWay(){
				uni.reLaunch({
					url:"../me"
				})
			}
		},
		mounted(){
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			let _this = this;
			if(tk == null){
				this.$isFromLogin = true;
				uni.navigateTo({
					url: './users/login?msg=' + 'unAuthorized'
				});
				return;
			}
			//验活
			axios.get( this.$baseUrl + '/users/get_verify_code', {
				headers: {
				     'Content-Type': 'application/json',//设置请求头请求格式为JSON
				     'Authorization': tk //设置token 其中K名要和后端协调好
				}
			}).then((res) => {
				_this.code = res.data;
			}).catch(function(error) {
				uni.showToast({
					title: _this.$t('settings.activate.getCodeFailed'),
					icon: 'none',
					duration: 2000
				});
			})
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		padding:30rpx;
		.info{
			font-size:30rpx;
			line-height:60rpx;
			color: var(--text-color-regular);
			div.bordered{
				border: 2px solid #606063;;
			}
			div.verifyCode{
				line-height:120rpx;
				text-align: center;
				font-size: 80rpx;
				height:120rpx;
			}
			div.groups{
				padding:20rpx;
			}
		}
		.button{
			height: 40px;
			width: 80%;
			margin-top: 30px;
			margin-left: 10%;
			font-size: 16px;

			font-weight: bold;
			line-height: 38px;
			border-radius: 5px;
			text-align:center;
			color: #ffffff;
			background-color: rgb(180, 111, 88);

		}

		.button:active {
			background-color:rgb(225, 139, 110);
		}
	}
</style>
