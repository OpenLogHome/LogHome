<template>
	<view class="outer">
		<div class="info">
			<p>亲爱的朋友，欢迎你加入原木社区大家庭！</p>
			<p>你的账号尚待激活，为了保证不间断的使用，请按照以下步骤激活你的账号：</p>
			<p>1.点击下方验证框复制验证码</p>
			<div class="bordered verifyCode" @mousedown="copyCode" @longtap="copyCode">
				{{code}}
			</div>
			<p>2.加入原木社区任意用户QQ群</p>
			<div class="bordered groups">
				<p>原木社区用户群列表：</p>
				<p>原木社区用户交流群：644467605</p>
				<p v-show="false">原木社区公测小组：931304998</p>
				<p>原木文社总群：464239748</p>
			</div>
			<p>3.将验证码<span style="font-weight:bold;color:rgb(180, 111, 88)">通过私聊</span>发送给群内我们的原木社区管理员“苦力怕君”</p>
			<p><span style="font-weight:bold;color:rgb(180, 111, 88)">友情提示：切勿将验证码发送至公开群中，请务必通过私聊发送。</span></p>
			<p>此操作会将你与发送验证消息的QQ号绑定，一个QQ号可绑定多个社区账号。</p>
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
					title: "获取验证码失败",
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
			color: #606063;
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
