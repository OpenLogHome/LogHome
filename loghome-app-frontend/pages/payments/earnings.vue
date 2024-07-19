<template>
	<view class="wp">
		<view class="header">
			<div class="b">
				<img src="@/static/resources/cropped_log.webp" alt="">
				<p>{{resources.cropped_log}}</p>
			</div>
			<div class="recordBtn" @click="recordDrawer = true">
				服务记录
			</div>
			<view class="txt-xh">
				<view class="h3">
					¥{{moneyEarnings}}
				</view>
				<text>可提现金额(元)</text>
				<view class="s2" @click="showHelp">?</view>
			</view>
		</view>
		<view class="boe">
			<view class="m-about">
				<view class="h3">
					提现金额
				</view>
				<view class="num">
					<view class="desc">￥</view> <text @click="moneyAmount = moneyEarnings">全部提现</text>
					<input class="inp" placeholder="请输入金额" type="number" v-model="moneyAmount">
				</view>
				<view class="num">
					<text></text>
					<input class="inp" placeholder="请输入微信号，客服将通过您留的微信号联系您" v-model="wechat">
				</view>
				<view class="g-queding-kx">
					<view class="txt">
						<view class="s1" @click="sendRequest">提现</view>
					</view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="txt-xh1">
				<view class="tit">
					<view class="h3">
						说明：
					</view>
					<view class="info">
						1.<text>可提现金额</text>=去皮原木余额 / 100
					</view>
					<view class="info">
						2.<text>每次提现收取 </text> 2%手续费，如提现100元，实际到账98元，手续费最低0.1元
					</view>
					<view class="info">
						3.<text>请确保您留下的微信号畅通， </text> 客服将通过您留下的微信号在5个工作日内联系您
					</view>
					<view class="info">
						4.<text>如果遇到问题请联系官方微信客服，客服微信号： </text> LogHomeCommunity
					</view>
				</view>
			</view>
		</view>
		<el-drawer title="服务记录" :visible.sync="recordDrawer" direction="btt" size="90%">
			<div class="outer" style="margin: 0 30rpx" v-for="record in records" :key="record.service_id">
				<el-card class="box-card" style="margin-bottom: 30rpx;">
					<div slot="header" class="clearfix">
						<span>提现 {{record.money_amount}} 元 {{utc2beijing(record.start_time)}}</span>
					</div>
					<div class="text">
						微信账户：{{record.wechat}}
					</div>
					<div class="text">
						状态：{{record.result}}
					</div>
				</el-card>
			</div>
		</el-drawer>
	</view>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				recordDrawer: false,
				moneyEarnings: 0,
				resources: {
					cropped_log: 0
				},
				moneyAmount: "",
				wechat: "",
				records: [

				]
			}
		},
		methods: {
			utc2beijing(utc_datetime) {
				// 转为正常的时间格式 年-月-日 时:分:秒
				var T_pos = utc_datetime.indexOf('T');
				var Z_pos = utc_datetime.indexOf('Z');
				var year_month_day = utc_datetime.substr(0, T_pos);
				var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
				var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06

				// 处理成为时间戳
				timestamp = new Date(Date.parse(new_datetime));
				timestamp = timestamp.getTime();
				timestamp = timestamp / 1000;

				// 增加8个小时，北京时间比utc时间多八个时区
				var timestamp = timestamp + 8 * 60 * 60;

				// 时间戳转为时间
				var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString("chinese", {
					hour12: false
				}).replace(/年|月/g, "-").replace(/日/g, " ");
				return beijing_datetime; // 2017-03-31 16:02:06
			},
			bankNum(num) {
				if (isNaN(num)) {
					return num
				} else {
					var s = num.toFixed(2).toString();
					var result = s.substring(0, s.indexOf(".") + 3);
					return result
				}
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
					this.moneyEarnings = this.bankNum(this.resources.cropped_log / 100);
					console.log(this.moneyEarnings);
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
			// 1. 校验只能输入数字和小数点
			checkInputAmount(amount) {
				let pattern = /^[0-9]+(\.[0-9]{1,2})?$/;
				if (!pattern.test(amount)) {
					return false;
				}
				return true;
			},
			// 2. 校验金额是否超出限定范围
			checkAmountInRange(amount, min, max) {
				if (Number(amount) > Number(max) || Number(amount) < Number(min)) {
					return false;
				}
				return true;
			},
			sendRequest() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				if (!this.checkInputAmount(this.moneyAmount) || !this.checkAmountInRange(this.moneyAmount, 0.11, this
						.moneyEarnings)) {
					uni.showModal({
						title: '提示',
						content: '请输入正确的金额',
						confirmColor: "#ff6a5f",
						showCancel: false
					});
					return;
				}
				if (this.wechat == "") {
					uni.showModal({
						title: '提示',
						content: '请输入用于提现的微信号',
						confirmColor: "#ff6a5f",
						showCancel: false
					});
					return;
				}
				uni.showModal({
					title: '确认发起提现',
					content: `提现金额：${this.moneyAmount}，提现至微信：${this.wechat}，确认要发起提现吗？`,
					confirmColor: "#ff6a5f",
					showCancel: true,
					success: (res) => {
						if (res.confirm) {
							axios.get(this.$baseUrl +
								`/payment/request_earning_service?money_amount=${this.moneyAmount}&wechat=${this.wechat}`, {
									headers: {
										'Content-Type': 'application/json', //设置请求头请求格式为JSON
										'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
									}
								}).then((res) => {
								this.getRecords();
								uni.showToast({
									title: "提现服务已发起，请保持微信畅通",
									icon: 'none',
									duration: 2000
								});
							}).catch(function(error) {
								console.log(error);
								if (error.response.data.msg) {
									uni.showToast({
										title: error.response.data.msg,
										icon: 'none',
										duration: 2000
									});
								} else {
									uni.showToast({
										title: error.toString(),
										icon: 'none',
										duration: 2000
									});
								}

							}).then(function() {
								uni.hideLoading();
							})
						}
					}
				});

			},
			getRecords() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/payment/get_earning_service_records', {
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					this.records = res.data;
					this.records.reverse();
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
			showHelp(){
				uni.showToast({
					title: "作者收到的作品打赏都将被转化为去皮原木，可用于提现",
					icon: 'none',
					duration: 2000
				});
			}
		},
		mounted() {
			this.refreshResources();
			this.getRecords();
		}
	}
</script>

<style scoped>
	.recordBtn {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		height: 60rpx;
		width: 160rpx;
		background-color: #ffffff44;
		border: 1rpx solid #ffffffee;
		color: #fff;
		font-size: 28rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 30rpx;
	}


	.header {
		background-color: #ff6a5f;
		position: relative;
		height: 400rpx;
	}

	.txt-xh {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateY(-55%) translateX(-50%);
	}

	.txt-xh .h3 {
		font-weight: bold;
		color: #fff;
		margin-bottom: 5rpx;
		font-size: 70rpx;
	}

	.txt-xh text {
		color: #fff;
		font-size: 30rpx;
	}

	.txt-xh .s2 {
		border: 1px solid #fff;
		border-radius: 50%;
		display: inline-block;
		margin-left: 15rpx;
		font-size: 14rpx;
		width: 30rpx;
		height: 30rpx;
		text-align: center;
		line-height: 30rpx;
		color: white;
	}

	.m-about {
		margin: 0 40rpx;
		padding: 20rpx 40rpx;
		margin-top: -80rpx;
		background-color: #fff;
		border-radius: 10rpx;
		position: relative;
		z-index: 99;
		box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
		margin-bottom: 140rpx;
	}

	.m-about .h3 {
		font-size: 28rpx;
		margin-bottom: 25rpx;
	}

	.m-about .num {
		margin-bottom: 35rpx;
		border-bottom: 1px solid #f2f2f2;
	}

	.m-about .num .desc {
		float: left;
		font-size: 24rpx;
		margin-bottom: 15rpx;
	}

	.m-about .num text {
		float: right;
		color: #ff6a5f;
		font-size: 24rpx;
		margin-bottom: 15rpx;
	}

	.m-about .boe {
		overflow: hidden;
		margin-bottom: 100rpx;
		color: #666666;
		font-size: 24rpx;
	}

	.m-about .boe text {
		float: left;
	}

	.m-about .boe .s1 {
		float: right;
	}

	uni-input {
		height: 1.4em;
		font-size: 24rpx;
		line-height: 1.4em;
		margin-bottom: 15rpx;
	}

	.g-queding-kx {
		text-align: center;
		background-color: #ff6a5f;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		border-radius: 10rpx;
		color: #fff;
		width: 100%;
	}

	.txt-xh1 {
		padding: 0 60rpx;
	}

	.txt-xh1 .h3 {
		display: block;
		font-size: 24rpx;
		margin-bottom: 20rpx;
	}

	.txt-xh1 .info {
		display: inline-block;
		font-size: 24rpx;
		letter-spacing: 1rpx;
		margin-bottom: 15rpx;
	}

	.txt-xh1 .info text {
		color: #000;
	}

	.txt-xh1 .info {
		color: #666666;

	}

	.txt-xh1 .desc {
		font-size: 28rpx;
		color: #ff6a5f;
		margin-bottom: 20rpx;
		margin-top: 5rpx;

	}

	.txt-xh1 .desc text {
		margin-right: 85rpx;

	}

	.b {
		width: 160rpx;
		height: 60rpx;
		border-radius: 30rpx;
		margin-bottom: 25rpx;
		background-color: #ffffff44;
		border: 1rpx solid #ffffffee;
		z-index: 5;
		display: flex;
		line-height: 60rpx;
		color: white;
		font-size: 32rpx;
		position: absolute;
		left: 30rpx;
		top: 30rpx;
	}

	.b img {
		height: 40rpx;
		margin: 10rpx;
		margin-left: 25rpx;
	}
</style>