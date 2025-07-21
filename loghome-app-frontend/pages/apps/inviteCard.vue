<template>
	<view class="invite-card-container" v-dark>
		<view class="header">
			<view class="title">邀请好友加入原木社区</view>
			<view class="subtitle">每邀请一位好友加入，双方均可获得奖励</view>
		</view>
		
		<view class="card">
			<view class="card-header">
				<view class="user-info">
					<log-image class="avatar" :src="userInfo.avatar_url || '../static/user/defaultAvatar.jpg'" mode="aspectFill"></log-image>
					<view class="name">{{userInfo.name}}</view>
				</view>
				<view class="slogan">邀请你加入原木社区</view>
			</view>
			
			<view class="code-section">
				<view class="code-label">我的邀请码</view>
				<view class="code-value">{{inviteCode}}</view>
			</view>
			
			<view class="share-section">
				<view class="share-btn" @click="copyShareLink">
					<uni-icons type="paperplane" size="20"></uni-icons>
					<text>复制分享链接</text>
				</view>
			</view>
		</view>
		
		<view class="stats-card">
			<view class="stats-title">我的邀请数据</view>
			<view class="stats-grid">
				<view class="stats-item">
					<view class="stats-value">{{inviteStats.totalNew || 0}}</view>
					<view class="stats-label">累计邀请新用户</view>
				</view>
				<view class="stats-item">
					<view class="stats-value">{{inviteStats.totalReturn || 0}}</view>
					<view class="stats-label">累计邀请回归</view>
				</view>
				<view class="stats-item">
					<view class="stats-value">{{inviteStats.monthNew || 0}}/10</view>
					<view class="stats-label">本月新用户</view>
				</view>
				<view class="stats-item">
					<view class="stats-value">{{inviteStats.monthReturn || 0}}/10</view>
					<view class="stats-label">本月回归用户</view>
				</view>
			</view>
		</view>
		
		<view class="rewards-card">
			<view class="rewards-title">邀请奖励</view>
			<view class="rewards-content">
				<view class="reward-item">
					<uni-icons type="checkmarkempty" size="18" color="#67C23A"></uni-icons>
					<text>邀请新用户：双方各获得1000原木</text>
				</view>
				<view class="reward-item">
					<uni-icons type="checkmarkempty" size="18" color="#67C23A"></uni-icons>
					<text>邀请老用户回归：双方各获得500原木</text>
				</view>
				<view class="reward-item">
					<uni-icons type="info" size="18" color="#E6A23C"></uni-icons>
					<text>每位用户最多可填写两次邀请码</text>
				</view>
				<view class="reward-item">
					<uni-icons type="info" size="18" color="#E6A23C"></uni-icons>
					<text>每月邀请上限：10位新用户 + 10位回归用户</text>
				</view>
			</view>
		</view>
		
		<view class="enter-code-section">
			<view class="enter-code-btn" @click="navigateToEnterCode">
				我有邀请码，立即填写
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'
import LogImage from '../../components/LogImage.vue'
import uniIcons from '../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue'

export default {
	components: {
		LogImage,
		uniIcons
	},
	data() {
		return {
			userInfo: {},
			inviteCode: '',
			inviteStats: {
				totalNew: 0,
				totalReturn: 0,
				monthNew: 0,
				monthReturn: 0
			}
		}
	},
	onLoad() {
		this.getUserInfo()
		this.getInviteCode()
	},
	methods: {
		async getUserInfo() {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token'))
				if (tk) tk = tk.tk
				
				const res = await axios.get(this.$baseUrl + '/users/userprofile', {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': tk
					}
				})
				
				this.userInfo = res.data
			} catch (error) {
				console.error('获取用户信息失败', error)
				uni.showToast({
					title: '获取用户信息失败',
					icon: 'none'
				})
			}
		},
		async getInviteCode() {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token'))
				if (tk) tk = tk.tk
				
				const res = await axios.get(this.$baseUrl + '/app/get_invite_code', {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				})
				
				if (res.data) {
					this.inviteCode = res.data.invite_code
					this.inviteStats = {
						totalNew: res.data.new_user_count,
						totalReturn: res.data.return_user_count,
						monthNew: res.data.last_month_new_count,
						monthReturn: res.data.last_month_return_count
					}
				}
			} catch (error) {
				console.error('获取邀请码失败', error)
				uni.showToast({
					title: '获取邀请码失败',
					icon: 'none'
				})
			}
		},
		copyShareLink() {
			const shareText = `我邀请你加入原木社区，邀请码是${this.inviteCode}`
			uni.setClipboardData({
				data: shareText,
				success: () => {
					uni.showToast({
						title: '分享链接已复制',
						icon: 'success'
					})
				}
			})
		},
		navigateToEnterCode() {
			uni.navigateTo({
				url: './enterInviteCode'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.invite-card-container {
	min-height: calc(100vh - 44px - 60rpx);
	padding: 30rpx;
	background-color: #f5f5f5;
	
	.header {
		margin-bottom: 40rpx;
		
		.title {
			font-size: 40rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 10rpx;
		}
		
		.subtitle {
			font-size: 28rpx;
			color: #666;
		}
	}
	
	.card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.card-header {
			margin-bottom: 30rpx;
			
			.user-info {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				
				.avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
				
				.name {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
				}
			}
			
			.slogan {
				font-size: 36rpx;
				color: #333;
				font-weight: 500;
			}
		}
		
		.code-section {
			background-color: #f9f9f9;
			padding: 20rpx;
			border-radius: 12rpx;
			margin-bottom: 30rpx;
			
			.code-label {
				font-size: 28rpx;
				color: #666;
				margin-bottom: 10rpx;
			}
			
			.code-value {
				font-size: 50rpx;
				font-weight: bold;
				color: #EA7034;
				text-align: center;
				letter-spacing: 5rpx;
				margin: 10rpx 0;
			}
			
			.copy-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #EA7034;
				
				text {
					margin-left: 10rpx;
				}
			}
		}
		
		.share-section {
			.share-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 80rpx;
				background-color: #EA7034;
				color: #fff;
				border-radius: 40rpx;
				font-size: 32rpx;
				
				text {
					margin-left: 10rpx;
				}
			}
		}
	}
	
	.stats-card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.stats-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
		
		.stats-grid {
			display: flex;
			flex-wrap: wrap;
			
			.stats-item {
				width: 50%;
				text-align: center;
				margin-bottom: 20rpx;
				
				.stats-value {
					font-size: 40rpx;
					font-weight: bold;
					color: #EA7034;
				}
				
				.stats-label {
					font-size: 26rpx;
					color: #666;
					margin-top: 5rpx;
				}
			}
		}
	}
	
	.rewards-card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.rewards-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
		
		.rewards-content {
			.reward-item {
				display: flex;
				align-items: center;
				margin-bottom: 15rpx;
				
				text {
					font-size: 28rpx;
					color: #666;
					margin-left: 10rpx;
				}
			}
		}
	}
	
	.enter-code-section {
		margin: 40rpx 0;
		
		.enter-code-btn {
			height: 90rpx;
			background-color: #f0f0f0;
			color: #333;
			border-radius: 45rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
		}
	}
}

/* 深色模式样式 */
.invite-card-container.dark-mode {
	background-color: #1a1a1a;
	
	.header {
		.title {
			color: #e0e0e0;
		}
		
		.subtitle {
			color: #aaa;
		}
	}
	
	.card, .stats-card, .rewards-card {
		background-color: #2a2a2a;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.2);
		
		.card-header {
			.user-info {
				.name {
					color: #e0e0e0;
				}
			}
			
			.slogan {
				color: #e0e0e0;
			}
		}
		
		.code-section {
			background-color: #333;
			
			.code-label {
				color: #aaa;
			}
		}
	}
	
	.stats-card {
		.stats-title {
			color: #e0e0e0;
		}
		
		.stats-grid {
			.stats-item {
				.stats-label {
					color: #aaa;
				}
			}
		}
	}
	
	.rewards-card {
		.rewards-title {
			color: #e0e0e0;
		}
		
		.rewards-content {
			.reward-item {
				text {
					color: #aaa;
				}
			}
		}
	}
	
	.enter-code-section {
		.enter-code-btn {
			background-color: #333;
			color: #e0e0e0;
		}
	}
}
</style> 