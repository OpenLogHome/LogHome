<template>
	<view class="outer" v-dark>
		<div class="description">
			<div style=" background-color:var(--card-background); padding:50rpx; font-size: 35rpx;" data-new-gr-c-s-check-loaded="14.1001.0" data-gr-ext-installed=""><p>
				<strong>绑定QQ</strong>
			</p>
			<p style="">
				您可以绑定QQ，从而接收系统消息推送。
			</p>
			<p style="margin-top: 20rpx;">
				您的绑定码是：<text style="color:#EA7034;font-weight:bold;user-select:text" @click="copyCode">{{bindingCode}}</text>
				<text style="color:var(--text-color-secondary); font-size: 24rpx; margin-left: 20rpx; border: 1px solid var(--border-color); padding: 2rpx 10rpx; border-radius: 6rpx;" @click="copyCode">复制</text>
				<text style="color:var(--text-color-secondary); font-size: 24rpx; margin-left: 20rpx; border: 1px solid var(--border-color); padding: 2rpx 10rpx; border-radius: 6rpx;" @click="refreshCode">刷新</text>
			</p>
			<p style="">
				请将此绑定码发送至原木社区用户交流群（701928273）的原木娘（2917117044），即可自动完成账号绑定。
			</p>
			</div>
		</div>
				<div class="list-content">
			<view class="list">
				<view class="li " @click="autoSaveSet">
					<view class="text">状态：{{pushStatus == 1 ? "启用" : "停用"}}</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view>
				<view class="li" v-if="pushStatus == 1">
					<view class="text" style="display: flex; justify-content: space-between; align-items: center;">
						<text>接收时间段</text>
						<view style="display: flex; align-items: center;">
							<picker mode="time" :value="pushStartTime" @change="bindStartTimeChange">
								<view class="time-picker">{{pushStartTime}}</view>
							</picker>
							<text style="margin: 0 10rpx;">-</text>
							<picker mode="time" :value="pushEndTime" @change="bindEndTimeChange">
								<view class="time-picker">{{pushEndTime}}{{isNextDay ? ' (次日)' : ''}}</view>
							</picker>
						</view>
					</view>
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
				EditorAutoSaveProps:{},
				bindingCode: '加载中...',
				pushStartTime: '00:00',
				pushEndTime: '23:59'
			}
		},
		onLoad(){
			this.refreshPushStatus();
			this.getBindingCode();
		},
		computed: {
			isNextDay() {
				return this.pushEndTime < this.pushStartTime;
			}
		},
		methods:{
			copyCode(){
				uni.setClipboardData({
					data: this.bindingCode,
					success: function () {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						});
					}
				});
			},
			getBindingCode(refresh = false){
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if(tk) tk = tk.tk;
				let url = this.$baseUrl + '/users/get_binding_code';
				if(refresh) {
					url += '?refresh=true';
				}
				axios.get(url,
					{
						headers: {
							 'Content-Type': 'application/json',
							 'Authorization': 'Bearer ' + tk
						}
					}
				).then((res) => {
					this.bindingCode = res.data.binding_code;
					this.pushStartTime = res.data.push_start_time || '00:00';
					this.pushEndTime = res.data.push_end_time || '23:59';
					if(refresh) {
						uni.showToast({
							title: '刷新成功',
							icon: 'none'
						});
					}
				}).catch(function (error) {
					uni.showToast({
						title: '获取绑定码失败',
						icon:'none',
						duration: 2000
					});
				})
			},
			refreshCode() {
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '确定要刷新绑定码吗？',
					success: function (res) {
						if (res.confirm) {
							_this.getBindingCode(true);
						}
					}
				});
			},
			bindStartTimeChange: function(e) {
				this.pushStartTime = e.detail.value;
				this.updatePushTime();
			},
			bindEndTimeChange: function(e) {
				this.pushEndTime = e.detail.value;
				this.updatePushTime();
			},
			updatePushTime() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if(tk) tk = tk.tk;
				axios.post(this.$baseUrl + '/users/update_push_time',
					{
						start_time: this.pushStartTime,
						end_time: this.pushEndTime
					},
					{
						headers: {
							 'Content-Type': 'application/json',
							 'Authorization': 'Bearer ' + tk
						}
					}
				).then((res) => {
					uni.showToast({
						title: '设置成功',
						icon: 'none'
					});
				}).catch((error) => {
					uni.showToast({
						title: '设置失败',
						icon:'none',
						duration: 2000
					});
				})
			},
			updatePushStatus(status) {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if(tk) tk = tk.tk;
				axios.get(this.$baseUrl + '/users/push_set?status=' + status,
					{
						headers: {
							 'Content-Type': 'application/json',
							 'Authorization': 'Bearer ' + tk
						}
					}
				).then((res) => {
					console.log(res);
					this.refreshPushStatus();
				}).catch((error) => {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(() => {
					uni.hideLoading();
				})
			},
			autoSaveSet(){
				let _this = this;
				uni.showActionSheet({
				    itemList: ['启用',"禁用"],
				    success: function (res) {
				        if(res.tapIndex == 0) {
							// 启用
							_this.updatePushStatus(1);
						} else if(res.tapIndex == 1) {
							// 禁用 - 弹窗确认
							uni.showModal({
								title: '提示',
								content: '关闭后将无法及时收到重要消息通知，确定要关闭吗？',
								success: function (res) {
									if (res.confirm) {
										_this.updatePushStatus(0);
									}
								}
							});
						}
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

	.time-picker{
		border: 1px solid var(--border-color);
		padding: 8rpx 16rpx;
		border-radius: 8rpx;
		background-color: var(--background-color-secondary);
		font-size: 28rpx;
		color: var(--text-color-primary);
	}

	.list-content{
		background: var(--card-background);
		margin-top:20upx;
	}
	.list{
		width:100%;
		border-bottom:15upx solid  var(--border-color);
		background: var(--card-background);
		&:last-child{
			border: none;
		}
		.li{
			width:92%;
			height:100upx;
			padding:0 4%;
			border-bottom:1px solid var(--border-color);
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
				color:var(--text-color-regular);
			}
			.to{
				flex-shrink:0;
				width:40upx;
				height:40upx;
			}
		}
	}
</style>
