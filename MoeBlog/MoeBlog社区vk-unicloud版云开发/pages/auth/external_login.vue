<template>
	<view class="external-login">
		<view class="loading" v-if="isLoading">
			<view class="spinner">
				<view class="bounce1"></view>
				<view class="bounce2"></view>
				<view class="bounce3"></view>
			</view>
			<view class="loading-text">登录中，请稍候...</view>
		</view>
		<view class="success" v-if="loginSuccess">
			<view class="icon">
				<uni-icons type="checkmarkempty" size="50" color="#07C160"></uni-icons>
			</view>
			<view class="success-text">登录成功</view>
		</view>
		<view class="error" v-if="loginError">
			<view class="icon">
				<uni-icons type="closeempty" size="50" color="#FF0000"></uni-icons>
			</view>
			<view class="error-text">登录失败</view>
			<view class="error-message">{{ errorMessage }}</view>
			<view class="button" @click="toLoginPage">返回登录页</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const loginSuccess = ref(false)
const loginError = ref(false)
const errorMessage = ref('')

onMounted(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const token = currentPage.$page?.options?.token
	
	if (token) {
		verifyToken(token)
	} else {
		isLoading.value = false
		loginError.value = true
		errorMessage.value = '未接收到有效的登录信息'
	}
})

function verifyToken(token) {
	vk.userCenter.loginByCrossSite({
		data: {
			token: token
		},
		success: (data) => {
			if (data.token) {
				// 保存token
				uni.setStorageSync('uni_id_token', data.token)
				uni.setStorageSync('uni_id_token_expired', data.tokenExpired)

                // 更新用户信息
                let user = vk.getVuex('$user.userInfo');
				vk.setVuex('$user.userInfo', {...user, ...data.userInfo});
				
				// 显示成功信息
				isLoading.value = false
				loginSuccess.value = true
				
				// 直接跳转到主页
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/index/index'
					})
				}, 500) // 短暂延迟以确保用户能看到成功提示
			} else {
				throw new Error('获取登录令牌失败')
			}
		},
		fail: (err) => {
			console.error(err)
			isLoading.value = false
			loginError.value = true
			errorMessage.value = err.msg || '登录令牌无效或已过期，请重新登录'
		}
	})
}

function toLoginPage() {
	uni.navigateTo({
		url: '/pages/auth/auth'
	})
}
</script>

<style lang="scss">
.external-login {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	padding: 0 40rpx;
	text-align: center;
	
	.loading, .success, .error {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin-top: 200rpx;
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
		background-color: #07C160;
	}
	
	.button:active {
		opacity: 0.8;
	}
	
	/* 加载动画 */
	.spinner {
		margin: 40rpx auto;
		width: 150rpx;
		text-align: center;
	}

	.spinner > view {
		width: 30rpx;
		height: 30rpx;
		background-color: #07C160;
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
}
</style> 