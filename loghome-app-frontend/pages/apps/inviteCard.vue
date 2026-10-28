<template>
	<view class="invite-card-container" v-dark>
		<view class="header">
			<view class="title">{{ $t('apps.invite.cardTitle') }}</view>
			<view class="subtitle">{{ $t('apps.invite.cardSubtitle') }}</view>
		</view>
		
		<view class="card">
			<view class="card-header">
				<view class="user-info">
					<user-avatar class="avatar" :src="userInfo.avatar_url" :frame="userInfo.avatar_frame"
						:visual-scale="userInfo.avatar_frame ? 1.2 : 1" />
					<view class="name">{{userInfo.name}}</view>
				</view>
				<view class="slogan">{{ $t('apps.invite.cardSlogan') }}</view>
			</view>
			
			<view class="code-section">
				<view class="code-label">{{ $t('apps.invite.myCode') }}</view>
				<view class="code-value">{{inviteCode}}</view>
			</view>
			
			<view class="share-section">
				<view class="share-btn" @click="copyShareLink">
					<uni-icons type="paperplane" size="20"></uni-icons>
					<text>{{ $t('apps.invite.copyShare') }}</text>
				</view>
			</view>
		</view>
		
		<view class="stats-card">
			<view class="stats-title">{{ $t('apps.invite.myStats') }}</view>
			<view class="stats-grid">
				<view class="stats-item">
					<view class="stats-value">{{inviteStats.totalNew || 0}}</view>
					<view class="stats-label">{{ $t('apps.invite.statTotalNew') }}</view>
				</view>
				<view class="stats-item">
					<view class="stats-value">{{inviteStats.totalReturn || 0}}</view>
					<view class="stats-label">{{ $t('apps.invite.statTotalReturn') }}</view>
				</view>
				<view class="stats-item">
					<view class="stats-value">{{inviteStats.monthNew || 0}}/{{monthlyLimit}}</view>
					<view class="stats-label">{{ $t('apps.invite.statMonthNew') }}</view>
				</view>
				<view class="stats-item">
					<view class="stats-value">{{inviteStats.monthReturn || 0}}/{{monthlyLimit}}</view>
					<view class="stats-label">{{ $t('apps.invite.statMonthReturn') }}</view>
				</view>
			</view>
		</view>
		
		<view class="rewards-card">
			<view class="rewards-title">{{ $t('apps.invite.rewardsTitle') }}</view>
			<view class="rewards-content">
				<view class="reward-item">
					<uni-icons type="checkmarkempty" size="18" color="#67C23A"></uni-icons>
					<text>{{ $t('apps.invite.rewardNew', { amount: newUserReward }) }}</text>
				</view>
				<view class="reward-item">
					<uni-icons type="checkmarkempty" size="18" color="#67C23A"></uni-icons>
					<text>{{ $t('apps.invite.rewardReturn', { amount: returnUserReward }) }}</text>
				</view>
				<view class="reward-item">
					<uni-icons type="info" size="18" color="#E6A23C"></uni-icons>
					<text>{{ $t('apps.invite.rewardTwice') }}</text>
				</view>
				<view class="reward-item">
					<uni-icons type="info" size="18" color="#E6A23C"></uni-icons>
					<text>{{ $t('apps.invite.rewardMonthlyLimit', { limit: monthlyLimit }) }}</text>
				</view>
			</view>
		</view>
		
		<view class="enter-code-section">
			<view class="enter-code-btn" @click="navigateToEnterCode">
				{{ $t('apps.invite.enterCode') }}
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
			newUserReward: 1000,
			returnUserReward: 500,
			monthlyLimit: 10,
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
					title: this.$t('apps.invite.loadUserFailed'),
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
					if (res.data.new_user_reward !== undefined) {
						this.newUserReward = res.data.new_user_reward
						this.returnUserReward = res.data.return_user_reward
						this.monthlyLimit = res.data.monthly_limit
					}
				}
			} catch (error) {
				console.error('获取邀请码失败', error)
				uni.showToast({
					title: this.$t('apps.invite.loadCodeFailed'),
					icon: 'none'
				})
			}
		},
		copyShareLink() {
			const shareText = this.$t('apps.invite.shareText', { code: this.inviteCode })
			uni.setClipboardData({
				data: shareText,
				success: () => {
					uni.showToast({
						title: this.$t('apps.invite.shareCopied'),
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
