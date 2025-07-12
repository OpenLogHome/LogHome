<template>
	<view class="exchange" v-dark>
		<view class="title" v-dark>
			<img src="../../static/resources/log.png"></img>
			<text class="text">余额：</text>
			<text class="num">{{resources.log}}</text>
		</view>
        
        <view class="title peeled-balance" v-dark>
			<img src="../../static/resources/cropped_log.webp"></img>
			<text class="text">去皮原木：</text>
			<text class="num">{{resources.cropped_log || 0}}</text>
		</view>

		<view class="exchange-card" v-dark>
            <view class="card-title">去皮原木兑换</view>
            <view class="exchange-form">
                <view class="input-group">
                    <text class="label">兑换数量：</text>
                    <input 
                        type="number" 
                        v-model="exchangeAmount" 
                        class="input" 
                        placeholder="请输入要兑换的去皮原木数量"
                    />
                </view>
                
                <view class="info-row">
                    <text class="info-text">兑换比例：1去皮原木 = 1.25原木（小数部分舍去）</text>
                </view>
                
                <view class="result-row">
                    <text class="result-label">预计获得：</text>
                    <text class="result-value">{{calculatedResult}} 原木</text>
                </view>
            </view>
            
            <button class="exchange-btn" @tap="exchangeLogs" :disabled="!canExchange">
                确认兑换
            </button>
            
            <view class="exchange-notice">
                <text>* 去皮原木是高级资源，兑换后不可逆，请谨慎操作</text>
            </view>
		</view>

		<view class="tip" v-dark>
			<p class="titl" v-dark>温馨提示</p>
			<view>
				<text>1、去皮原木是社区高级资源，由用户打赏获得，可用于提现</text>
			</view>
			<view>
				<text>2、兑换比例为 1:1.25，即1个去皮原木可兑换1.25个普通原木（不足1原木的部分将被舍去）</text>
			</view>
			<view>
				<text>3、兑换操作不可逆，请合理规划资源使用</text>
			</view>
			<view>
				<text>4、如有任何问题，请联系官方微信客服：</text>
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
				resources: {
					log: 0,
                    cropped_log: 0
				},
                exchangeAmount: ''
			};
		},
		computed: {
            calculatedResult() {
                const amount = parseFloat(this.exchangeAmount) || 0;
                return Math.floor(amount * 1.25);
            },
            canExchange() {
                const amount = parseFloat(this.exchangeAmount) || 0;
                return amount > 0 && amount <= (this.resources.cropped_log || 0);
            }
        },
		mounted() {
			this.refreshResources();
		},
		methods: {
			refreshResources() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				axios.get(this.$baseUrl + '/resource/get_resources', {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
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
            exchangeLogs() {
                const amount = parseFloat(this.exchangeAmount);
                if (!amount || amount <= 0) {
                    uni.showToast({
                        title: '请输入有效的兑换数量',
                        icon: 'none'
                    });
                    return;
                }
                
                if (amount > (this.resources.cropped_log || 0)) {
                    uni.showToast({
                        title: '去皮原木余额不足',
                        icon: 'none'
                    });
                    return;
                }
                
                uni.showModal({
                    title: '确认兑换',
                    content: `确定要将 ${amount} 去皮原木兑换为 ${Math.floor(amount * 1.25)} 原木吗？不足1原木的部分将被舍去。兑换后不可撤销。`,
                    success: (res) => {
                        if (res.confirm) {
                            this.submitExchange(amount);
                        }
                    }
                });
            },
            submitExchange(amount) {
                uni.showLoading({
                    title: '兑换中...'
                });
                
                let tk = JSON.parse(window.localStorage.getItem('token'));
                if (tk) tk = tk.tk;
                
                axios.post(this.$baseUrl + '/payment/exchange_logs', {
                    cropped_log_amount: amount
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + tk
                    }
                }).then((res) => {
                    uni.hideLoading();
                    if (res.data.code === 200) {
                        uni.showToast({
                            title: '兑换成功',
                            icon: 'success'
                        });
                        this.exchangeAmount = '';
                        this.refreshResources();
                    } else {
                        uni.showToast({
                            title: res.data.msg || '兑换失败',
                            icon: 'none'
                        });
                    }
                }).catch((error) => {
                    uni.hideLoading();
                    uni.showToast({
                        title: error.response?.data?.msg || '兑换失败',
                        icon: 'none'
                    });
                });
            }
		}
	};
</script>

<style lang="scss" scoped>
	.exchange {
		width: 100%;
		background-color: #f5f5f5;
		padding-bottom: 30rpx;
		
		&.dark-mode {
			background-color: #1e1e1e;
		}

		.title {
			display: flex;
			align-items: center;
			padding: 30rpx 50rpx;
			background-color: #ffffff;
            margin-bottom: 2rpx;

			>img {
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
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
            
            &.peeled-balance {
                margin-top: 2rpx;
                
                .num {
                    color: #3a8c34;
                }
            }
		}
		
		.title.dark-mode {
			background-color: #000000;
			>text {
				color: #eaeaea;
			}
		}
        
        .exchange-card {
            margin: 30rpx;
            background-color: #ffffff;
            border-radius: 12rpx;
            padding: 30rpx;
            box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
            
            &.dark-mode {
                background-color: #000000;
            }
            
            .card-title {
                font-size: 32rpx;
                font-weight: 600;
                color: #333;
                margin-bottom: 30rpx;
                text-align: center;
                
                &.dark-mode {
                    color: #eaeaea;
                }
            }
            
            .exchange-form {
                margin-bottom: 30rpx;
                
                .input-group {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20rpx;
                    
                    .label {
                        width: 160rpx;
                        font-size: 28rpx;
                        color: #666;
                        
                        &.dark-mode {
                            color: #eaeaea;
                        }
                    }
                    
                    .input {
                        flex: 1;
                        height: 80rpx;
                        background-color: #f8f8f8;
                        border-radius: 8rpx;
                        padding: 0 20rpx;
                        font-size: 28rpx;
                        
                        &.dark-mode {
                            background-color: #333;
                            color: #eaeaea;
                        }
                    }
                }
                
                .info-row {
                    margin-bottom: 20rpx;
                    
                    .info-text {
                        font-size: 26rpx;
                        color: #999;
                        
                        &.dark-mode {
                            color: #999;
                        }
                    }
                }
                
                .result-row {
                    display: flex;
                    align-items: center;
                    margin-top: 30rpx;
                    
                    .result-label {
                        font-size: 28rpx;
                        color: #666;
                        
                        &.dark-mode {
                            color: #eaeaea;
                        }
                    }
                    
                    .result-value {
                        font-size: 32rpx;
                        color: #ff4141;
                        font-weight: 600;
                    }
                }
            }
            
            .exchange-btn {
                width: 100%;
                height: 80rpx;
                background: #ff6a5f;
                border-radius: 8rpx;
                color: #ffffff;
                font-size: 30rpx;
                font-weight: 600;
                line-height: 80rpx;
                text-align: center;
                margin-bottom: 20rpx;
                
                &:disabled {
                    background: #ccc;
                }
            }
            
            .exchange-notice {
                text-align: center;
                font-size: 24rpx;
                color: #999;
                
                &.dark-mode {
                    color: #999;
                }
            }
        }

		.tip {
			background: #ffffff;
			margin: 30rpx;
            border-radius: 12rpx;
			padding: 30rpx;
            box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
			
			&.dark-mode {
				background-color: #000000;
			}

			.titl {
				font-size: 30rpx;
				font-weight: 600;
				color: #666666;
				line-height: 40rpx;
				margin-bottom: 20rpx;
				
				&.dark-mode {
					color: #eaeaea;
				}
			}

			>view {
				margin-bottom: 10rpx;
                
				>text {
					font-size: 26rpx;
					color: #999999;
					line-height: 36rpx;
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