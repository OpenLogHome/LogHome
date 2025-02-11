<template>
	<view class="buy">
		<view class="title">
			<img src="../../static/resources/log.png"></img>
			<text class="text">余额：</text>
			<text class="num">{{resources.log}}</text>
		</view>

		<view class="title" style="margin-bottom: 15rpx">
			<text class="text">你的原木个人支付码：</text>
			<text class="num">{{pay_code}}</text>
			<el-button size="small" type="danger" style="margin-left: 20rpx" @click="copyPayCode">点击复制</el-button>
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
			<text class="titl">温馨提示</text>
			<view>
				<text>1、捐赠对应数额，将获得社区给予的</text>
				<text>原木</text>
			</view>
			<view>
				<text>2、请在网络状态良好的情况下进行捐赠，为了保证捐赠顺利，请耐心等待捐赠，不要进行其他操作</text>
			</view>
			<view>
				<text>3、您的每一笔捐赠我们都将记录在案，并用于</text>
				<text>支持社区运营和发展</text>
			</view>
			<view>
				<text>4、在支付过程中遇到任何问题（如原木未到账等问题），请联系官方微信客服：</text>
				<text>LogHomeCommunity</text>
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
			this.getPayCode();
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
			getPayCode() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/payment/get_user_pay_code', {
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					this.pay_code = res.data;
					console.log(res.data);
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
			getPaymentUrl() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/payment/get_payment_url?money=' + this.list[this.num].money + "&log=" + this
					.list[this.num].number, {
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					}).then((res) => {
					this.$alert(`<view class="title" style="margin: 15rpx 0;"> <img src="https://img.codesocean.top/image/1697538884315"
							style="width: 100%">
							</view>`, '重要提示', {
						dangerouslyUseHTMLString: true,
						confirmButtonText:"理解，请继续"
					}).then(() => {
						if (this.jsBridge && this.jsBridge.inApp) {
							this.jsBridge.openInBrowser(res.data);
						} else {
							window.open(res.data);
						}
					});
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(function() {
					uni.hideLoading();
				})
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
			padding: 42rpx 0 20rpx 50rpx;
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

		.tip {
			height: 394rpx;
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

				&:nth-child(4) {
					>text:nth-child(2) {
						color: #ff6a5f;
						font-weight: 600;
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