<template>
	<view>
		<view class="list-content">
			<view class="list">
				<view class="li " @click="autoSaveSet">
					<view class="text">本地备份设置</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view>
<!-- 				<view class="li " @click="readerSet">
					<view class="text">阅读器设置</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view> -->
			</view>
			<view class="list">
				<!-- <view class="li " @click="pushSet">
					<view class="text">消息推送设置</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view> -->
				<view class="li " @click="changePwd">
					<view class="text">修改密码</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view>
				<view class="li " @click="activateAccount">
					<view class="text">账号绑定</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view>
			</view>
			<view class="list">
				<view class="li noborder" @click="logout">
					<view class="text" style="color:red">登出</view>
					<image class="to" src="../../static/user/to.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				user:{}
			}
		},
		onShow() {
		},
		methods: {
			logout(){
				uni.showModal({
				    title: '提示',
				    content: '确定要登出吗？',
					confirmColor:"#EA7034",
				    success: function (res) {
				        if (res.confirm) {
				            window.localStorage.removeItem('token');
							window.localStorage.setItem('messages',[]);
				            uni.switchTab({
				            	url: '../library'
				            });	
				        } else if (res.cancel) {
				        }
				    }
				});

			},
			changePwd(){
				uni.navigateTo({
					url: './changePwd'
				});	
			},
			autoSaveSet(){
				uni.navigateTo({
					url: '../settings/autoSaveSettings'
				});	
			},
			activateAccount(){
				uni.navigateTo({
					url: "./activateAccount"
				})
			},
			pushSet(){
				uni.navigateTo({
					url: "../settings/pushSettings"
				})
			},
			readerSet(){
				uni.navigateTo({
					url: "../settings/readerSettings"
				})
			}
		}
	}
</script>

<style scoped lang="scss">

.text{
	font-size: 30rpx;
	width: 100%;
}		

page{
	background-color: #f2f2f2;
	font-size: 30upx;
}
.list-content{
	background: #fff;
	margin-top:20upx;
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
		padding:0 4%;
		border-bottom:1px solid rgb(255, 248, 234);
		display:flex;
		align-items:center;
	&.noborder{
		border-bottom:0
		}
		.icon{
			flex-shrink:0;
			width:50upx;
			height:50upx;
			image{
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
