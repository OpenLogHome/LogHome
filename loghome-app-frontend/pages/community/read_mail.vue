<template>
	<view>
		<view class="mail_head">
			<view class="mail_title">{{mail.title}}</view>
			<view class="sender">
				<log-image class="user_avatar" :src="mail.from.avatar_url"></log-image>
				<view class="user_name">{{mail.from.user_name}}</view>
			</view>
			<view class="decoration_line"></view>
		</view>
		<view class="mail_content">{{mail.content}}</view>
	</view>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				mail: {
					id: 0,
					title: "努力加载中",
					from: {
						user_id: -1,
						user_name: "努力加载中",
						avatar_url: ""
					},
					content: "努力加载中"
				}
			}
		},
		onLoad(params){
			if(params.id){
				this.mail.id = params.id;
			}
		},
		onShow(){
			this.refreshPage();
		},
		methods: {
			refreshPage() {
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/community/get_mail?message_id=' + this.mail.id, 
				{
					headers: {
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}
				).then((res) => {
					if(res.data.length > 0){
						let first_n = res.data[0].message_content.indexOf("\n");
						_this.mail.title = res.data[0].message_content.substr(0,first_n);
						_this.mail.content = res.data[0].message_content.substr(first_n,res.data[0].message_content.length);
						_this.mail.from = res.data[0];
					} else {
						uni.showToast({
							title: "消息获取失败",
							icon: 'none',
							duration: 2000
						})
					}
				}).catch(function (error) {
					if(error.message == "Request failed with status code 401"){
						window.localStorage.removeItem('token');
						this.$isFromLogin = true;
						uni.navigateTo({
							url: './users/login?msg=' + 'unAuthorized'
						});
					} else {
						uni.showToast({
							title: "消息获取失败",
							icon: 'none',
							duration: 2000
						})
					}
				}).then(function(){
					uni.hideLoading();
				})
			},
		}
	}
</script>

<style lang="less">
	.mail_head{
		border-top: solid #cacaca 1px;
		.decoration_line{
			border-bottom: #7f7356 4px solid;
			border-right: #472100 30rpx solid;
			margin: 16px 0;
			width: 500rpx;
		}
		.mail_title{
			width: 696rpx;
			margin: 10px 20rpx;
			padding: 0 12rpx;
			font-size: 24px;
			font-weight: bold;
			color: #713418;
			height: 30px;
		}
		.sender{
			padding: 0 30rpx;
			font-size: 18px;
			color: #808080;
			position: relative;
			.user_avatar{
				width: 28px;
				height: 28px;
				border-radius: 8px;
			}
			.user_name{
				display: inline-block;
				position: absolute;
				margin: auto 15rpx;
			}
		}
	}
	
	.mail_content{
		width: 696rpx;
		margin: 20rpx auto;
		padding: 0 12rpx;
		font-size: 18px;
		height: 36vh;
	}

</style>
