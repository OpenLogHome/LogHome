<template>
	<view class="outer">
		<div class="info">
			<p>亲爱的朋友，欢迎你加入原木社区大家庭！</p>
			<p>为确保社区稳定运行，我们需要你绑定账号，为了保证不间断的使用，请任选以下账号绑定与激活方式：</p>
		</div>
		<view class="list">
			<view class="li " @click="gotoMobileActivate">
				<view class="text">通过手机号绑定</view>
				<view  v-show="user.mobile != 'unbind'">{{user.mobile}}</view>
				<img class="to" src="../../static/user/to.png"  v-show="user.mobile == 'unbind'"></img>
			</view>
		</view>
		<view class="list">
			<view class="li" @click="gotoOicqActivate">
				<view class="text">通过QQ号绑定</view>
				<view  v-show="user.oicq_account != 'unbind'">{{user.oicq_account}}</view>
				<img class="to" src="../../static/user/to.png" v-show="user.oicq_account == 'unbind'"></img>
			</view>
		</view>
		<div class="info">
			<p>我们暂时不支持解绑账号，如有相关诉求请至反馈中心反馈，我们的客服将协助你解决相关问题。</p>
		</div>
		<!-- <div class="button" @click="goAnyWay">以游客身份继续使用</div> -->
	</view>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return{
				code:"",
				user:{}
			}
		},
		methods:{
			gotoOicqActivate(){
				if(this.user.oicq_account != 'unbind') return;
				uni.navigateTo({
					url:"./activateAccount_oicq"
				})
			},
			gotoMobileActivate(){
				if(this.user.mobile != 'unbind') return;
				uni.navigateTo({
					url:"./activateAccount_mobile"
				})
			}
		},
		onShow(){
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
			axios.get( this.$baseUrl + '/users/userprofile', {
				headers: { 
				     'Content-Type': 'application/json',//设置请求头请求格式为JSON
				     'Authorization': tk //设置token 其中K名要和后端协调好
				}
			}).then((res) => {
				_this.user = JSON.parse(JSON.stringify(res.data));
			}).catch(function(error) {
				if(error.message == "Request failed with status code 401"){
					window.localStorage.removeItem('token');
					uni.navigateTo({
						url: './users/login?msg=' + 'unAuthorized'
					});
				}
			})
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		.info{
			padding :30rpx;
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
	.list{
		width:100%;
		border-bottom:15upx solid #f2f2f2;
		background: #fff;
		&:last-child{
			border: none;
		}
		.li{
			width:92%;
			height:100upx;
			font-size:30rpx;
			padding:0 4%;
			border-bottom:1px solid #f2f2f2;
			display:flex;
			align-items:center;
		&.noborder{
			border-bottom:0
			}
			.icon{
				flex-shrink:0;
				width:50upx;
				height:50upx;
				img{
					width:50upx;
					height:50upx;
				}
			}
			.text{
				padding-left:20upx;
				width:100%;
				color:#666;
			}
			.to{
				flex-shrink:0;
				width:40upx;
				height:40upx;
			}
		}
	}
</style>
