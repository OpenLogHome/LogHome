<template>
	<view class="outer">
		<div class="description">
			<div style=" background-color:#ffffff; padding:50rpx; font-size: 35rpx;" data-new-gr-c-s-check-loaded="14.1001.0" data-gr-ext-installed=""><p>
				<strong>关于消息推送：</strong>
			</p>
			<p style="text-indent:2em;">
				为了保持软件的纯净，原木社区不接入任何安卓厂商的推送SDK，但您也可能因此错过一些重要消息。
			</p>
			<p style="text-indent:2em;">
				因此，可以通过我们内置的“消息推送”功能，通过您绑定的QQ接收消息推送。
			</p>
			</div>
		</div>
		<div class="list-content">
			<view class="list">
				<view class="li " @click="autoSaveSet">
					<view class="text">状态：{{pushStatus == 1 ? "启用" : "停用"}}</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view>
			</view>
		</div>
	</view>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return{
				pushStatus:0,
				EditorAutoSaveProps:{}
			}
		},
		onLoad(){
			this.refreshPushStatus();
		},
		methods:{
			autoSaveSet(){
				let _this = this;
				uni.showActionSheet({
				    itemList: ['启用',"禁用"],
				    success: function (res) {
						let status = 0;
				        if(res.tapIndex == 0) {
							status = 1;
						}
						if(res.tapIndex == 1) {
							status = 0;
						}
						let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
						axios.get(_this.$baseUrl + '/users/push_set?status=' + status,
							{
								headers: {
									 'Content-Type': 'application/json',//设置请求头请求格式为JSON
									 'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
								}
							}
						).then((res) => {
							console.log(res);
							_this.refreshPushStatus();
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
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			refreshPushStatus(){
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/users/push_status',
					{
						headers: {
							 'Content-Type': 'application/json',//设置请求头请求格式为JSON
							 'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					}
				).then((res) => {
					this.pushStatus = res.data[0].push_set_status;
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){
					uni.hideLoading();
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
	
	.list-content{
		background: #fff;
		margin-top:20upx;
	}
	.list{
		width:100%;
		border-bottom:15upx solid  rgb(255, 248, 234);
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
