<template>
	<view class="enter-code-container" v-dark>
		<view class="header">
			<view class="title">{{ $t('apps.invite.enterTitle') }}</view>
			<view class="subtitle">{{ $t('apps.invite.enterSubtitle') }}</view>
		</view>
		
		<view class="form-card" :class="{ 'loading-overlay': isLoading }">
			<view class="form-item">
				<view class="label">{{ $t('apps.invite.codeLabel') }}</view>
				<input class="input" type="text" v-model="inviteCode" :placeholder="$t('apps.invite.codePlaceholder')" maxlength="6" />
			</view>
			
			<view class="form-item">
				<view class="label">{{ $t('apps.invite.typeLabel') }}</view>
				<view class="radio-group">
					<view class="radio-item" 
						:class="{ active: inviteType === 'new', disabled: !eligibility.newUserEligible }" 
						@click="selectInviteType('new')">
						<view class="radio-circle">
							<view class="radio-inner" v-if="inviteType === 'new'"></view>
						</view>
						<text>{{ $t('apps.invite.newUser') }}</text>
						<text class="status-text" v-if="!eligibility.newUserEligible">{{ $t('apps.invite.ineligible') }}</text>
					</view>
					<view class="radio-item" 
						:class="{ active: inviteType === 'return', disabled: !eligibility.returnUserEligible }" 
						@click="selectInviteType('return')">
						<view class="radio-circle">
							<view class="radio-inner" v-if="inviteType === 'return'"></view>
						</view>
						<text>{{ $t('apps.invite.returnUser') }}</text>
						<text class="status-text" v-if="!eligibility.returnUserEligible">{{ $t('apps.invite.ineligible') }}</text>
					</view>
				</view>
			</view>
			
			<view class="submit-btn" :class="{ disabled: !isFormValid || isLoading }" @click="submitInviteCode">
				{{ isLoading ? $t('apps.invite.checking') : $t('apps.invite.submit') }}
			</view>
		</view>
		
		<view class="info-card">
			<view class="info-title">{{ $t('apps.invite.instructions') }}</view>
			<view class="info-content">
				<view class="info-item">
					<uni-icons type="checkmarkempty" size="16" color="#67C23A"></uni-icons>
					<text>{{ $t('apps.invite.newUserRule') }}</text>
				</view>
				<view class="info-item">
					<uni-icons type="checkmarkempty" size="16" color="#67C23A"></uni-icons>
					<text>{{ $t('apps.invite.returnUserRule') }}</text>
				</view>
				<view class="info-item">
					<uni-icons type="checkmarkempty" size="16" color="#67C23A"></uni-icons>
					<text>{{ $t('apps.invite.newUserReward', { amount: newUserReward }) }}</text>
				</view>
				<view class="info-item">
					<uni-icons type="checkmarkempty" size="16" color="#67C23A"></uni-icons>
					<text>{{ $t('apps.invite.returnUserReward', { amount: returnUserReward }) }}</text>
				</view>
			</view>
		</view>
		
		<view class="get-code-section">
			<view class="get-code-btn" @click="navigateToInviteCard">
				{{ $t('apps.invite.getMyCode') }}
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'
import uniIcons from '../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue'

export default {
	components: {
		uniIcons
	},
	data() {
		return {
			inviteCode: '',
			inviteType: '', // 'new' or 'return'
			eligibility: {
				newUserEligible: false,
				returnUserEligible: false
			},
			newUserReward: 1000,
			returnUserReward: 500,
			isLoading: true
		}
	},
	computed: {
		isFormValid() {
			return this.inviteCode.length === 6 && this.inviteType !== '';
		}
	},
	mounted() {
		this.checkEligibility();
	},
	methods: {
		async checkEligibility() {
			try {
				this.isLoading = true;
				let tk = JSON.parse(window.localStorage.getItem('token'))
				if (tk) tk = tk.tk
				
				const res = await axios.get(this.$baseUrl + '/app/check_invite_eligibility', {
					headers: {
						'Authorization': 'Bearer ' + tk
					}
				});
				
				this.eligibility = res.data;
				
				if (res.data.new_user_reward !== undefined) {
					this.newUserReward = res.data.new_user_reward
					this.returnUserReward = res.data.return_user_reward
				}
				
				// 自动选择第一个有资格的类型
				if (this.eligibility.newUserEligible) {
					this.inviteType = 'new';
				} else if (this.eligibility.returnUserEligible) {
					this.inviteType = 'return';
				}
				
				// 如果都没有资格，显示提示
				if (!this.eligibility.newUserEligible && !this.eligibility.returnUserEligible) {
					uni.showToast({
						title: this.$t('apps.invite.noEligibility'),
						icon: 'none',
						duration: 3000
					});
				}
			} catch (error) {
				console.error('检查邀请资格失败', error);
				uni.showToast({
					title: this.$t('apps.invite.checkFailed'),
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},
		selectInviteType(type) {
			// 只能选择有资格的类型
			if (type === 'new' && this.eligibility.newUserEligible) {
				this.inviteType = 'new';
			} else if (type === 'return' && this.eligibility.returnUserEligible) {
				this.inviteType = 'return';
			} else {
				// 显示无资格提示
				const typeText = type === 'new' ? this.$t('apps.invite.newUserType') : this.$t('apps.invite.returnUserType');
				uni.showToast({
					title: this.$t('apps.invite.noEligibilityForType', { type: typeText }),
					icon: 'none'
				});
			}
		},
		async submitInviteCode() {
			if (!this.isFormValid) {
				return;
			}
			
			try {
				let tk = JSON.parse(window.localStorage.getItem('token'))
				if (tk) tk = tk.tk
				
				const res = await axios.post(this.$baseUrl + '/app/use_invite_code', {
					invite_code: this.inviteCode,
					invite_type: this.inviteType
				}, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				})
				
				if (res.data.success) {
					uni.showToast({
						title: this.$t('apps.invite.success'),
						icon: 'success'
					})
					
					// 延迟后返回上一页或首页
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 1500)
				} else {
					uni.showToast({
						title: res.data.msg || this.$t('apps.invite.failed'),
						icon: 'none'
					})
				}
			} catch (error) {
				console.error('使用邀请码失败', error)
				let errorMsg = this.$t('apps.invite.failed')
				
				if (error.response && error.response.data && error.response.data.msg) {
					errorMsg = error.response.data.msg
				}
				
				uni.showToast({
					title: errorMsg,
					icon: 'none'
				})
			}
		},
		navigateToInviteCard() {
			uni.navigateTo({
				url: './inviteCard'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.enter-code-container {
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
	
	.form-card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		position: relative;
		
		&.loading-overlay::after {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(255, 255, 255, 0.6);
			z-index: 10;
			border-radius: 16rpx;
			pointer-events: none;
		}
		
		.form-item {
			margin-bottom: 30rpx;
			
			.label {
				font-size: 30rpx;
				color: #333;
				margin-bottom: 15rpx;
				font-weight: 500;
			}
			
			.input {
				height: 90rpx;
				background-color: #f5f5f5;
				border-radius: 8rpx;
				padding: 0 20rpx;
				font-size: 32rpx;
				color: #333;
				letter-spacing: 5rpx;
			}
			
			.radio-group {
				display: flex;
				flex-direction: column;
				
				.radio-item {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;
					padding: 20rpx;
					border-radius: 8rpx;
					background-color: #f5f5f5;
					position: relative;
					
					&.active {
						background-color: #FFF0E6;
					}
					
					&.disabled {
						opacity: 0.6;
						background-color: #e9e9e9;
						cursor: not-allowed;
					}
					
					.radio-circle {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						border: 2rpx solid #ccc;
						margin-right: 20rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						
						.radio-inner {
							width: 24rpx;
							height: 24rpx;
							border-radius: 50%;
							background-color: #EA7034;
						}
					}
					
					&.active .radio-circle {
						border-color: #EA7034;
					}
					
					text {
						font-size: 30rpx;
						color: #333;
					}
					
					.status-text {
						font-size: 26rpx;
						color: #F56C6C;
						margin-left: 20rpx;
					}
				}
			}
		}
		
		.tips {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			
			text {
				font-size: 26rpx;
				color: #E6A23C;
				margin-left: 10rpx;
				flex: 1;
			}
		}
		
		.submit-btn {
			height: 90rpx;
			background-color: #EA7034;
			color: #fff;
			border-radius: 45rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			font-weight: 500;
			
			&.disabled {
				background-color: #ccc;
				opacity: 0.7;
			}
		}
	}
	
	.info-card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.info-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
		
		.info-content {
			.info-item {
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
	
	.get-code-section {
		margin: 40rpx 0;
		
		.get-code-btn {
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
.enter-code-container.dark-mode {
	background-color: #1a1a1a;
	
	.header {
		.title {
			color: #e0e0e0;
		}
		
		.subtitle {
			color: #aaa;
		}
	}
	
	.form-card, .info-card {
		background-color: #2a2a2a;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.2);
		
		.form-item {
			.label {
				color: #e0e0e0;
			}
			
			.input {
				background-color: #333;
				color: #e0e0e0;
			}
			
			.radio-group {
				.radio-item {
					background-color: #333;
					
					&.active {
						background-color: #4D2E1D;
					}
					
					text {
						color: #e0e0e0;
					}
				}
			}
		}
	}
	
	.info-card {
		.info-title {
			color: #e0e0e0;
		}
		
		.info-content {
			.info-item {
				text {
					color: #aaa;
				}
			}
		}
	}
	
	.get-code-section {
		.get-code-btn {
			background-color: #333;
			color: #e0e0e0;
		}
	}
}
</style>
