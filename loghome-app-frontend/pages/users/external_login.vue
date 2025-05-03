<template>
	<view class="container">
		<div class="loading" v-if="isLoading">
			<img src="../../static/loading.gif" alt="loading" class="loading-image" v-if="false">
			<div class="spinner">
				<div class="bounce1"></div>
				<div class="bounce2"></div>
				<div class="bounce3"></div>
			</div>
			<div class="loading-text">登录中，请稍候...</div>
		</div>
		<div class="success" v-if="loginSuccess">
			<div class="icon">
				<i class="el-icon-check"></i>
			</div>
			<div class="success-text">登录成功</div>
			<div class="redirect-text">{{ countDown/1000 }}秒后{{ redirectTo ? '跳转到指定页面' : '返回个人中心' }}</div>
		</div>
		<div class="error" v-if="loginError">
			<div class="icon">
				<i class="el-icon-close"></i>
			</div>
			<div class="error-text">登录失败</div>
			<div class="error-message">{{ errorMessage }}</div>
			<div class="button" @click="toLoginPage">返回登录页</div>
		</div>
	</view>
</template>

<script>
	import axios from 'axios'
	
	export default {
		data() {
			return {
				isLoading: true,
				loginSuccess: false,
				loginError: false,
				errorMessage: '',
				countDown: 0,
				countDownTimer: null,
				token: '',
				redirectTo: '' // 用于存储跳转目标路径
			}
		},
		onLoad(option) {
			// 从URL中获取token参数和redirectTo参数
			if (option.token) {
				this.token = option.token;
				
				// 获取跳转地址参数
				if (option.redirectTo) {
					this.redirectTo = decodeURIComponent(option.redirectTo);
				}
				
				this.verifyToken();
			} else {
				this.isLoading = false;
				this.loginError = true;
				this.errorMessage = '未接收到有效的登录信息';
			}
			
			if (option.hideback) {
				console.log("hideback");
				window.sessionStorage.setItem("hideBack", "true");
			}
		},
		methods: {
			verifyToken() {
				console.log("token", this.token);
				// 首先通过短时token获取JWT token
				axios.get(this.$baseUrl + '/users/token_by_cross_site', {
					params: {
						token: this.token
					}
				}).then(res => {
					if (res.data && res.data.token) {
						// 保存JWT token到localStorage
						window.localStorage.setItem('token', JSON.stringify(res.data.token));
						
						// 显示成功信息
						this.isLoading = false;
						this.loginSuccess = true;
						
						// 开始倒计时
						this.startCountDown();
					} else {
						throw new Error('获取登录令牌失败');
					}
				}).catch(error => {
					console.log(error);
					this.isLoading = false;
					this.loginError = true;
					this.errorMessage = error.response && error.response.data && error.response.data.msg 
						? error.response.data.msg 
						: '登录令牌无效或已过期，请重新登录';
				});
			},
			startCountDown() {
				this.countDownTimer = setInterval(() => {
					this.countDown--;
					if (this.countDown <= 0) {
						clearInterval(this.countDownTimer);
						
						// 根据redirectTo参数决定跳转位置
						if (this.redirectTo) {
							
							// 判断跳转类型
							if (this.redirectTo.startsWith('/pages/me') || 
								this.redirectTo.startsWith('/pages/library') || this.redirectTo.startsWith('/pages/essays') || 
								this.redirectTo.startsWith('/pages/bookcase/index')) {
								// tabBar页面使用switchTab
								uni.switchTab({
									url: this.redirectTo
								});
							} else {
								// 非tabBar页面使用navigateTo
								console.log(this.redirectTo)
								uni.redirectTo({
									url: this.redirectTo,
									fail: () => {
										console.error('导航失败，返回个人中心');
										uni.switchTab({
											url: '../me'
										});
									}
								});
							}
						} else {
							// 默认跳转到个人中心页
							uni.switchTab({
								url: '../me'
							});
						}
					}
				}, 1);
			},
			toLoginPage() {
				uni.navigateTo({
					url: './login'
				});
			}
		},
		onUnload() {
			// 清除定时器
			if (this.countDownTimer) {
				clearInterval(this.countDownTimer);
			}
		}
	}
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		padding: 0 40rpx;
		text-align: center;
	}
	
	.loading, .success, .error {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin-top: 200rpx;
	}
	
	.loading-image {
		width: 120rpx;
		height: 120rpx;
		margin-bottom: 40rpx;
	}
	
	.loading-text, .success-text, .error-text {
		font-size: 36rpx;
		margin-bottom: 20rpx;
		color: #333;
		font-weight: bold;
	}
	
	.redirect-text, .error-message {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 40rpx;
	}
	
	.icon {
		margin-bottom: 40rpx;
	}
	
	.icon img {
		width: 120rpx;
		height: 120rpx;
	}
	
	.button {
		height: 80rpx;
		width: 60%;
		margin-top: 60rpx;
		font-size: 32rpx;
		text-align: center;
		font-weight: bold;
		line-height: 80rpx;
		border-radius: 10rpx;
		color: #ffffff;
		border: 5rpx rgb(180, 111, 88) solid;
		box-sizing: border-box;
		background-color: rgb(180, 111, 88);
	}
	
	.button:active {
		background-color: rgb(225, 139, 110);
	}
	
	/* 加载动画 */
	.spinner {
		margin: 40rpx auto;
		width: 150rpx;
		text-align: center;
	}

	.spinner > div {
		width: 30rpx;
		height: 30rpx;
		background-color: rgb(180, 111, 88);
		border-radius: 100%;
		display: inline-block;
		margin: 0 10rpx;
		animation: sk-bouncedelay 1.4s infinite ease-in-out both;
	}

	.spinner .bounce1 {
		animation-delay: -0.32s;
	}

	.spinner .bounce2 {
		animation-delay: -0.16s;
	}

	@keyframes sk-bouncedelay {
		0%, 80%, 100% { 
			transform: scale(0);
		} 40% { 
			transform: scale(1.0);
		}
	}
</style> 