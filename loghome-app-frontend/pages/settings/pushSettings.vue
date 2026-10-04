<template>
	<view class="outer" v-dark>
		<div class="description">
			<div style=" background-color:var(--card-background); padding:50rpx; font-size: 35rpx;" data-new-gr-c-s-check-loaded="14.1001.0" data-gr-ext-installed=""><p>
				<strong>{{ $t('settings.push.bindQqTitle') }}</strong>
			</p>
			<p style="">
				{{ $t('settings.push.bindQqDesc') }}
			</p>
			<p style="margin-top: 20rpx;">
				{{ $t('settings.push.bindingCodeLabel') }}<text style="color:#EA7034;font-weight:bold;user-select:text" @click="copyCode">{{bindingCode || $t('settings.push.loadingCode')}}</text>
				<text style="color:var(--text-color-secondary); font-size: 24rpx; margin-left: 20rpx; border: 1px solid var(--border-color); padding: 2rpx 10rpx; border-radius: 6rpx;" @click="copyCode">{{ $t('settings.push.copy') }}</text>
				<text style="color:var(--text-color-secondary); font-size: 24rpx; margin-left: 20rpx; border: 1px solid var(--border-color); padding: 2rpx 10rpx; border-radius: 6rpx;" @click="refreshCode">{{ $t('settings.push.refresh') }}</text>
			</p>
			<p style="">
				{{ $t('settings.push.bindHowto') }}
			</p>
			</div>
		</div>
				<div class="list-content">
			<view class="list">
				<view class="li " @click="autoSaveSet">
					<view class="text">{{ $t('settings.push.statusPrefix') }}{{ pushStatus == 1 ? $t('settings.push.statusEnabled') : $t('settings.push.statusDisabled') }}</view>
					<img class="to" src="../../static/user/to.png"></img>
				</view>
				<view class="li" v-if="pushStatus == 1">
					<view class="text" style="display: flex; justify-content: space-between; align-items: center;">
						<text>{{ $t('settings.push.receiveWindow') }}</text>
						<view style="display: flex; align-items: center;">
							<picker mode="time" :value="pushStartTime" @change="bindStartTimeChange">
								<view class="time-picker">{{pushStartTime}}</view>
							</picker>
							<text style="margin: 0 10rpx;">-</text>
							<picker mode="time" :value="pushEndTime" @change="bindEndTimeChange">
								<view class="time-picker">{{pushEndTime}}{{isNextDay ? ' ' + $t('settings.push.nextDay') : ''}}</view>
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
				bindingCode: '', //绑定码，为空时模板显示 loadingCode 占位文案
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
					success: () => {
						uni.showToast({
							title: this.$t('settings.push.copySuccess'),
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
							title: this.$t('settings.push.refreshSuccess'),
							icon: 'none'
						});
					}
				}).catch(() => {
					uni.showToast({
						title: this.$t('settings.push.getCodeFailed'),
						icon:'none',
						duration: 2000
					});
				})
			},
			refreshCode() {
				let _this = this;
				uni.showModal({
					title: this.$t('common.prompt'),
					content: this.$t('settings.push.refreshConfirm'),
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
						title: this.$t('common.settingSuccess'),
						icon: 'none'
					});
				}).catch((error) => {
					uni.showToast({
						title: this.$t('settings.push.settingFailed'),
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
				    itemList: [this.$t('settings.push.enable'), this.$t('settings.push.disable')],
				    success: function (res) {
				        if(res.tapIndex == 0) {
							// 启用
							_this.updatePushStatus(1);
						} else if(res.tapIndex == 1) {
							// 禁用 - 弹窗确认
							uni.showModal({
								title: _this.$t('common.prompt'),
								content: _this.$t('settings.push.disableConfirm'),
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
