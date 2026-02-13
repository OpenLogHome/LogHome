<template>
	<view class="reward-modal-mask" v-if="visible" @click="close" @touchmove.stop.prevent>
		<view class="reward-modal" :class="{show: visible}" @click.stop>
			<view class="light-bg"></view>
			<view class="icon-container" v-if="icon">
				<image class="icon-image" :src="icon" mode="aspectFit"></image>
			</view>
			<view class="title">任务完成!</view>
			<view class="task-name" v-if="taskName">{{taskName}}</view>
			<view class="reward-content">
				<text class="label">成长值</text>
				<text class="value">+{{reward}}</text>
			</view>
			<view class="growth-line">
				<view class="growth-label-row">
					<text class="label">当前成长值</text>
					<text class="value">{{currentGrowth}}/{{maxGrowth}}</text>
				</view>
				<view class="growth-bar">
					<view class="growth-bar-inner" :style="{ width: progressPercent + '%' }"></view>
				</view>
			</view>
			<button class="harvest-btn" v-if="canHarvest" @click.stop="handleHarvest">前往收获</button>
			<button class="confirm-btn" v-else @click="close">
				太棒了<text v-if="countdown > 0">({{countdown}})</text>
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'TaskRewardModal',
		data() {
			return {
				visible: false,
				reward: 0,
				taskName: '',
				icon: '',
				currentGrowth: 0,
				maxGrowth: 100,
				canHarvest: false,
				animatedProgress: 0,
				countdown: 0,
				countdownTimer: null
			}
		},
		computed: {
			progressPercent() {
				if (!this.maxGrowth || this.maxGrowth <= 0) return 0
				const val = (this.animatedProgress / this.maxGrowth) * 100
				if (val < 0) return 0
				if (val > 100) return 100
				return val
			}
		},
		methods: {
			show(options = {}) {
				this.reward = options.reward || 0
				this.taskName = options.taskName || ''
				this.icon = options.icon || ''
				this.currentGrowth = typeof options.currentGrowth === 'number' ? options.currentGrowth : 0
				this.maxGrowth = typeof options.maxGrowth === 'number' ? options.maxGrowth : 100
				this.canHarvest = !!options.canHarvest
				this.animatedProgress = 0
				this.countdown = 0
				this.visible = true
				if (this.countdownTimer) {
					clearInterval(this.countdownTimer)
					this.countdownTimer = null
				}
				this.$nextTick(() => {
					this.animatedProgress = this.currentGrowth
				})
				if (!this.canHarvest) {
					this.countdown = 3
					this.countdownTimer = setInterval(() => {
						if (this.countdown > 0) {
							this.countdown--
						}
						if (this.countdown <= 0) {
							clearInterval(this.countdownTimer)
							this.countdownTimer = null
							this.close()
						}
					}, 1000)
				}
			},
			close() {
				this.visible = false
				if (this.countdownTimer) {
					clearInterval(this.countdownTimer)
					this.countdownTimer = null
				}
				this.countdown = 0
				this.$emit('close')
			},
			handleHarvest() {
				this.$emit('harvest')
				this.close()
			}
		}
	}
</script>

<style scoped lang="scss">
	.reward-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.7);
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
        
		.reward-modal {
			width: 500rpx;
			background: #fff;
			border: 6rpx solid #333;
			border-radius: 40rpx;
			padding: 50rpx 40rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			transform: scale(0.8);
			opacity: 0;
			transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

			&.show {
				transform: scale(1);
				opacity: 1;
			}

			.light-bg {
				position: absolute;
				top: 50%;
				left: 50%;
				width: 600rpx;
				height: 600rpx;
				background: radial-gradient(circle, rgba(255,235,59,0.4) 0%, rgba(255,255,255,0) 70%);
				transform: translate(-50%, -50%);
				z-index: -1;
				animation: rotate 10s linear infinite;
			}

			.icon-container {
				width: 120rpx;
				height: 120rpx;
				background: #fff9c4;
				border: 4rpx solid #333;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 30rpx;
				box-shadow: 0 6rpx 0 #fbc02d;
			}

			.icon-image {
				width: 80rpx;
				height: 80rpx;
			}

			.title {
				font-size: 40rpx;
				font-weight: 900;
				color: #f57f17;
				margin-bottom: 10rpx;
				text-shadow: 2rpx 2rpx 0 #333;
				-webkit-text-stroke: 1rpx #333;
			}

			.task-name {
				font-size: 28rpx;
				color: #666;
				margin-bottom: 30rpx;
				font-weight: bold;
			}

			.reward-content {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				background: #e1f5fe;
				padding: 15rpx 30rpx;
				border-radius: 20rpx;
				border: 3rpx solid #333;

				.label {
					font-size: 32rpx;
					color: #333;
					font-weight: 800;
					margin-right: 15rpx;
				}

				.value {
					font-size: 40rpx;
					color: #0288d1;
					font-weight: 900;
				}
			}

			.growth-line {
				width: 100%;
				margin-bottom: 30rpx;

				.growth-label-row {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;

					.label {
						font-size: 28rpx;
						color: #555;
					}

					.value {
						font-size: 32rpx;
						color: #333;
						font-weight: 700;
					}
				}

				.growth-bar {
					width: 100%;
					height: 18rpx;
					background: #eee;
					border-radius: 999rpx;
					overflow: hidden;
					border: 2rpx solid #bbb;

					.growth-bar-inner {
						height: 100%;
						background: linear-gradient(90deg, #4caf50, #81c784);
						width: 0;
						transition: width 0.5s ease-out;
					}
				}
			}

			.harvest-btn {
				width: 100%;
				height: 80rpx;
				line-height: 76rpx;
				background: #ffca28;
				color: #4e342e;
				border-radius: 40rpx;
				font-size: 32rpx;
				font-weight: 800;
				border: 4rpx solid #8d6e63;
				box-shadow: 0 6rpx 0 #8d6e63;
				margin-bottom: 20rpx;

				&:active {
					transform: translateY(6rpx);
					box-shadow: none;
				}
			}

			.confirm-btn {
				width: 100%;
				height: 80rpx;
				line-height: 76rpx;
				background: #4cd964;
				color: #fff;
				border-radius: 40rpx;
				font-size: 32rpx;
				font-weight: 800;
				border: 4rpx solid #1b5e20;
				box-shadow: 0 6rpx 0 #1b5e20;

				&:active {
					transform: translateY(6rpx);
					box-shadow: none;
				}
			}
		}
	}
    
    @keyframes rotate {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }
</style>
