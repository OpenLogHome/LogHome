<template>
	<view class="exchange" v-dark>
		<view class="title" v-dark>
			<img src="../../static/resources/log.png"></img>
			<text class="text">{{ $t('payments.exchange.balance') }}</text>
			<text class="num">{{resources.log}}</text>
		</view>
        
        <view class="title peeled-balance" v-dark>
			<img src="../../static/resources/cropped_log.webp"></img>
			<text class="text">{{ $t('payments.exchange.peeledLog') }}</text>
			<text class="num">{{resources.cropped_log || 0}}</text>
		</view>

		<view class="exchange-card" v-dark>
            <view class="card-title">{{ $t('payments.exchange.cardTitle') }}</view>
            <view class="exchange-form">
                <view class="input-group">
                    <text class="label">{{ $t('payments.exchange.amountLabel') }}</text>
                    <input 
                        type="number" 
                        v-model="exchangeAmount" 
                        class="input" 
                        :placeholder="$t('payments.exchange.amountPlaceholder')"
                    />
                </view>
                
                <view class="info-row">
                    <text class="info-text">{{ $t('payments.exchange.rate') }}</text>
                </view>
                
                <view class="result-row">
                    <text class="result-label">{{ $t('payments.exchange.estimated') }}</text>
                    <text class="result-value">{{ $t('payments.exchange.resultLogs', { amount: calculatedResult }) }}</text>
                </view>
            </view>
            
            <button class="exchange-btn" @tap="exchangeLogs" :disabled="!canExchange">
                {{ $t('payments.exchange.confirm') }}
            </button>
            
            <view class="exchange-notice">
                <text>{{ $t('payments.exchange.notice') }}</text>
            </view>
		</view>

		<view class="tip" v-dark>
			<p class="titl" v-dark>{{ $t('payments.exchange.tipsTitle') }}</p>
			<view>
				<text>{{ $t('payments.exchange.tip1') }}</text>
			</view>
			<view>
				<text>{{ $t('payments.exchange.tip2') }}</text>
			</view>
			<view>
				<text>{{ $t('payments.exchange.tip3') }}</text>
			</view>
			<view>
				<text>{{ $t('payments.exchange.tip4') }}</text>
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
                        title: this.$t('payments.exchange.invalidAmount'),
                        icon: 'none'
                    });
                    return;
                }
                
                if (amount > (this.resources.cropped_log || 0)) {
                    uni.showToast({
                        title: this.$t('payments.exchange.insufficient'),
                        icon: 'none'
                    });
                    return;
                }
                
                uni.showModal({
                    title: this.$t('payments.exchange.confirm'),
                    content: this.$t('payments.exchange.confirmContent', { amount, logs: Math.floor(amount * 1.25) }),
                    success: (res) => {
                        if (res.confirm) {
                            this.submitExchange(amount);
                        }
                    }
                });
            },
            submitExchange(amount) {
                uni.showLoading({
                    title: this.$t('payments.exchange.redeeming')
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
                            title: this.$t('payments.exchange.success'),
                            icon: 'success'
                        });
                        this.exchangeAmount = '';
                        this.refreshResources();
                    } else {
                        uni.showToast({
                            title: res.data.msg || this.$t('payments.exchange.failed'),
                            icon: 'none'
                        });
                    }
                }).catch((error) => {
                    uni.hideLoading();
                    uni.showToast({
                        title: error.response?.data?.msg || this.$t('payments.exchange.failed'),
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