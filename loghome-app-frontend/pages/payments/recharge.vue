<template>
	<view class="buy">
		<view class="title">
			<img src="../../static/resources/log.png"></img>
			<text class="text">余额：</text>
			<text class="num">{{resources.log}}</text>
		</view>

		<view class="quick-links">
			<navigator url="/pages/payments/order_history">
				<view class="quick-link-item">
					<!-- <image class="icon" src="../../static/icons/icon_history.png" mode="aspectFit"></image> -->
					<text>历史订单</text>
					<image class="to" src="../../static/user/to.png"></image>
				</view>
			</navigator>
			<navigator url="/pages/payments/gift_code">
				<view class="quick-link-item">
					<!-- <image class="icon" src="../../static/icons/icon_gift.png" mode="aspectFit"></image> -->
					<text>礼品码兑换</text>
					<image class="to" src="../../static/user/to.png"></image>
				</view>
			</navigator>
		</view>

		<view class="number">
			<view class="list">
				<view :class="num == index ? 'item real' : 'item'" v-for="(item, index) in list" :key="index"
					@click="pick(index)">
					<view class="card">
						<view class="top">
							<text>{{ item.number }}</text>
							<img src="../../static/resources/log.png"></img>
						</view>
						<text class="money">{{ item.money }}元</text>
					</view>
					<view v-if="index === 2" class="recommend">
						<text>推荐</text>
					</view>
				</view>
			</view>
			<view class="sure" @click="getPaymentUrl">
				<text>确定捐赠</text>
			</view>
		</view>

		<view class="tip">
			<p class="titl" style="padding-bottom: 6rpx;">温馨提示</p>
			<view>
				<text>1、捐赠对应数额，将获得社区给予的</text>
				<text>原木</text>
			</view>
			<view>
				<text>2、我们使用由 <span>
					<img src="static/images/afdian_logo.png" alt="" style="width: 30rpx; height: 30rpx;"> 爱发电
				</span> 提供的支付服务来收取捐赠，请</text>
				<text>不要修改跳转后的链接和订单号</text>
				<text>，否则我们将无法收到捐赠</text>
			</view>
			<view>
				<text>3、您的每笔捐赠我们都将记录在案，并用于</text>
				<text>支持社区运营和发展</text>
			</view>
			<view>
				<text>4、在支付过程中遇到任何问题（如原木未到账等问题），请联系官方微信客服：</text>
				<text>CodesOcean</text>
			</view>
		</view>
	</view>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				num: 0,
				list: [{
						number: '300',
						money: '3',
					},
					{
						number: '520',
						money: '5',
					},
					{
						number: '1725',
						money: '15',
					},
					{
						number: '3840',
						money: '32',
					},
					{
						number: '8840',
						money: '68',
					},
				],
				resources: {
					log: 0
				},
				pay_code: ""
			};
		},
		created() {},
		mounted() {
			this.refreshResources();
		},
		methods: {
			pick(index) {
				this.num = index;
			},
			copyPayCode() {
				uni.setClipboardData({
					data: this.pay_code,
					success: function() {
						// console.log('success');
					}
				})
			},
			refreshResources() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/resource/get_resources', {
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					this.resources = res.data[0];
					this.$forceUpdate();
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(function() {
					uni.hideLoading();
				})
			},
			getPaymentUrl: async function() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				const log_amount = this.list[this.num].number;
				const pay_amount = this.list[this.num].money;
				try {
					// 1. 创建订单
					const orderRes = await axios.post(this.$baseUrl + '/payment/create_order', {
						log_amount,
						pay_amount
					}, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk
						}
					});
					if (!orderRes.data || orderRes.data.code !== 200) {
						uni.showToast({ title: '订单创建失败', icon: 'none' });
						return;
					}
					const payment_id = orderRes.data.data.payment_id;

					// 2. 获取支付链接
					const payUrlRes = await axios.get(this.$baseUrl + '/payment/get_payment_url?money=' + pay_amount + '&log=' + log_amount + '&payment_id=' + payment_id, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk
						}
					});

					// 3. 跳转到跳转支付页
					uni.navigateTo({
						url: `/pages/payments/jump_to_pay?pay_url=${encodeURIComponent(payUrlRes.data)}&payment_id=${payment_id}`
					});
				} catch (error) {
					uni.showToast({ title: error.toString(), icon: 'none' });
				} finally {
					uni.hideLoading();
				}
			}
		},
	};
</script>

<style lang="scss" scoped>
	.buy {
		width: 100%;
		height: 100%;

		.title {
			display: flex;
			align-items: center;
			padding: 42rpx 0 40rpx 50rpx;
			background-color: #ffffff;

			>img {
				width: 32rpx;
				height: 32rpx;
				margin-right: 6rpx;
			}

			>text {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
				line-height: 40rpx;
			}

			.num {
				color: #ff4141;
			}
		}

		.number {
			width: 100%;
			height: 700rpx;
			background-color: #ffffff;
			margin-top: 18rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.list {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 38rpx 40rpx 66rpx 40rpx;

				.item {
					width: 194rpx;
					height: 194rpx;
					background: #ffffff;
					box-shadow: 0rpx 0rpx 6rpx 0rpx rgba(0, 0, 0, 0.1);
					margin-bottom: 44rpx;
					display: flex;

					.card {
						width: 194rpx;
						height: 194rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;

						.top {
							display: flex;
							align-items: center;

							>text {
								font-size: 32rpx;
								font-family: PingFangSC-Semibold, PingFang SC;
								font-weight: 600;
								color: #666666;
								line-height: 44rpx;
								margin-right: 12rpx;
							}

							>img {
								width: 30rpx;
								height: 30rpx;
							}
						}

						.money {
							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #999999;
							line-height: 34rpx;
							margin-top: 12rpx;
						}
					}

					.recommend {
						width: 112rpx;
						height: 36rpx;
						background: #f3f2ea;
						border-radius: 8rpx 0rpx 8rpx 0rpx;
						position: absolute;
						text-align: center;
						margin-top: -18rpx;

						>text {
							font-size: 20rpx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #666666;
							line-height: 36rpx;
						}
					}
				}

				.real {
					border: 2rpx solid #f88700;
				}

				&:after {
					content: '';
					width: 194rpx;
				}
			}

			.sure {
				width: 582rpx;
				height: 80rpx;
				background: #ff6a5f;
				border-radius: 5rpx;
				text-align: center;

				>text {
					font-size: 28rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 600;
					color: #ffffff;
					line-height: 80rpx;
				}
			}
		}

		.quick-links {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin: 18rpx 0 0 0;
			background: #fff;
			padding: 0 40rpx;

			.quick-link-item {
				width: 100%;
				height: 110rpx;
				background: #fff;
				display: flex;
				align-items: center;
				padding: 0 20rpx;
				margin-bottom: 0;

				.icon {
					width: 32rpx;
					height: 32rpx;
					margin-right: 12rpx;
				}
				text {
					flex: 1;
					font-size: 30rpx;
					color: #666;
				}
				.to {
					width: 32rpx;
					height: 32rpx;
					margin-right: 20rpx;
				}
			}
		}

		.tip {
			// height: 394rpx;
			background: #ffffff;
			margin-top: 18rpx;
			padding: 40rpx;

			.titl {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 600;
				color: #666666;
				line-height: 40rpx;
				margin-bottom: 6rpx;
				padding-bottom: 20rpx;
			}

			>view {
				>text {
					font-size: 22rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					color: #999999;
					line-height: 32rpx;
				}

				&:nth-child(2) {
					>text:nth-child(2) {
						color: #ff6a5f;
						font-weight: 600;
					}
				}

				&:nth-child(3) {
					>text:nth-child(2) {
						color: #ff6a5f;
						font-weight: 600;
					}

					span{
						color: #8B63DB;
					}
				}

				&:nth-child(5) {
					>text:nth-child(2) {
						color: #ff6a5f;
						font-weight: 600;
						border-bottom: 2rpx solid #ff6a5f;
					}
				}
			}
		}
	}
</style>