<template>
	<view class="checkout-page" v-dark>
		<view v-if="loadingProduct && !product.id" class="page-state">
			<text>正在加载结算信息...</text>
		</view>

		<view v-else-if="loadError && !product.id" class="page-state">
			<text>{{ loadError }}</text>
			<view class="state-action" @tap="refreshCheckout">重新加载</view>
		</view>

		<template v-else>
			<view class="notice-card error" v-if="loadError">
				<text>{{ loadError }}</text>
			</view>
			<view class="notice-card" v-if="!isLoggedIn">
				<text>登录后才能提交兑换订单，地址和余额也会在登录后自动加载。</text>
				<view class="notice-action" @tap="goLogin">去登录</view>
			</view>
			<view class="product-card" v-if="product.id">
				<image class="cover" :src="product.cover_url" mode="aspectFill"></image>
				<view class="info">
					<view class="title">{{ product.title }}</view>
					<view class="price-row">
						<image src="../../static/resources/cropped_log.webp" mode="aspectFit" style="width: 40rpx; height: 40rpx;"></image>
						<image src="../../static/resources/log.png" mode="aspectFit" style="width: 40rpx; height: 40rpx;"></image>
						<text class="price">
							{{ product.price }}
						</text>
					</view>
				</view>
			</view>
			<view class="address-card" v-if="product.type === 'physical'">
				<view v-if="address">
					<view class="address-line">
						<text class="name">{{ address.receiver_name }}</text>
						<text class="phone">{{ address.receiver_phone }}</text>
					</view>
					<view class="address-detail">
						{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
					</view>
					<view class="address-actions">
						<view class="action" @tap="chooseAddress">更换地址</view>
						<view class="action" @tap="manageAddress">管理</view>
					</view>
				</view>
				<view class="address-empty" v-else>
					<view class="add-btn" @tap="manageAddress">+ 添加收货地址</view>
				</view>
			</view>
			<view class="summary-card" v-if="product.id">
				<view class="row">
					<text>商品价格</text>
					<view class="price-row-small">
						<image src="../../static/resources/cropped_log.webp" mode="aspectFit" style="width: 32rpx; height: 32rpx;"></image>
						<image src="../../static/resources/log.png" mode="aspectFit" style="width: 32rpx; height: 32rpx;"></image>
						<text>{{ product.price }}</text>
					</view>
				</view>
				<view class="row">
					<text>支付方式</text>
					<text>自动扣除（优先去皮原木）</text>
				</view>
				<view class="row">
					<text>订单说明</text>
					<text>{{ product.type === 'physical' ? '提交后等待发货' : '提交后自动发放' }}</text>
				</view>
				<view class="row" v-if="product.price">
					<text>预计扣除</text>
					<text>{{ payCropped }} 去皮 + {{ payLog }} 原木</text>
				</view>
			</view>
			<view class="bottom-bar">
				<button class="confirm-btn" :disabled="submitDisabled" @tap="submitOrder">
					{{ submitButtonText }}
				</button>
			</view>
		</template>
	</view>
</template>

<script>
import axios from 'axios'
import darkModeMixin from '@/mixins/dark-mode.js'

export default {
	mixins: [darkModeMixin],
	data() {
		return {
			productId: null,
			product: {},
			resources: {
				log: 0,
				cropped_log: 0,
			},
			address: null,
			submitting: false,
			submitRequestId: '',
			loadError: '',
			loadingProduct: false,
		}
	},
	computed: {
		isLoggedIn() {
			return !!this.getToken()
		},
		totalBalance() {
			return Number(this.resources.log || 0) + Number(this.resources.cropped_log || 0)
		},
		payCropped() {
			const price = Number(this.product.price || 0)
			return Math.min(Number(this.resources.cropped_log || 0), price)
		},
		payLog() {
			const price = Number(this.product.price || 0)
			return price - this.payCropped
		},
		canSubmit() {
			if (!this.product.price) return false
			if (this.totalBalance < Number(this.product.price)) return false
			if (this.product.type === 'physical' && !this.address) return false
			return true
		},
		submitDisabled() {
			if (this.submitting) return true
			if (this.loadError) return true
			if (!this.product.price) return true
			if (!this.isLoggedIn) return false
			return !this.canSubmit
		},
		submitButtonText() {
			if (this.submitting) return '提交中...'
			if (this.loadError) return '商品不可下单'
			if (!this.product.price) return '商品信息加载中'
			if (!this.isLoggedIn) return '登录后下单'
			if (this.product.type === 'physical' && !this.address) return '请选择地址'
			if (this.totalBalance < Number(this.product.price)) return '余额不足'
			return '确认下单'
		},
	},
	onLoad(options) {
		this.productId = options.product_id
		this.submitRequestId = this.createRequestId()
		this.refreshCheckout()
	},
	onPullDownRefresh() {
		this.refreshCheckout()
	},
	onShow() {
		this.fetchResources()
		const selectedId = window.localStorage.getItem('store_selected_address')
		if (selectedId) {
			window.localStorage.removeItem('store_selected_address')
			this.fetchAddressById(selectedId)
			return
		}
		if (this.product.type === 'physical') {
			this.fetchDefaultAddress()
		}
	},
	methods: {
		getToken() {
			let tk = JSON.parse(window.localStorage.getItem('token'))
			if (tk) tk = tk.tk
			return tk
		},
		goLogin() {
			uni.navigateTo({
				url: '/pages/users/login?msg=store',
			})
		},
		createRequestId() {
			return ['store', Date.now().toString(36), Math.random().toString(36).slice(2, 10)].join('_')
		},
		fetchResources() {
			const tk = this.getToken()
			if (!tk) {
				this.resources = { log: 0, cropped_log: 0 }
				return
			}
			axios.get(this.$baseUrl + '/resource/get_resources', {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then((res) => {
				this.resources = res.data[0] || { log: 0, cropped_log: 0 }
			}).catch(() => {
				this.resources = { log: 0, cropped_log: 0 }
			})
		},
		fetchProduct() {
			this.loadingProduct = true
			this.loadError = ''
			axios.get(this.$baseUrl + '/store/products/' + this.productId)
				.then((res) => {
					if (res.data && res.data.code === 200) {
						this.product = res.data.data
						this.loadError = ''
						if (this.product.type === 'physical') {
							this.fetchDefaultAddress()
						} else {
							this.address = null
						}
					} else {
						this.product = {}
						this.address = null
						this.loadError = res.data.msg || '商品不存在或已下架'
					}
				}).catch((error) => {
					this.product = {}
					this.address = null
					this.loadError = error.response?.data?.msg || '商品不存在或已下架'
				}).finally(() => {
					this.loadingProduct = false
					uni.stopPullDownRefresh()
				})
		},
		refreshCheckout() {
			this.fetchProduct()
			this.fetchResources()
		},
		fetchDefaultAddress() {
			const tk = this.getToken()
			if (!tk) {
				this.address = null
				return
			}
			axios.get(this.$baseUrl + '/store/addresses/default', {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then((res) => {
				if (res.data && res.data.code === 200) {
					this.address = res.data.data
				}
			})
		},
		fetchAddressById(addressId) {
			const tk = this.getToken()
			if (!tk) return
			axios.get(this.$baseUrl + `/store/addresses/${addressId}`, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then((res) => {
				if (res.data && res.data.code === 200) {
					this.address = res.data.data
				}
			})
		},
		manageAddress() {
			uni.navigateTo({
				url: '/pages/store/address_list?select=1',
			})
		},
		chooseAddress() {
			this.manageAddress()
		},
		submitOrder() {
			if (this.submitting) return
			const tk = this.getToken()
			if (!tk) {
				this.goLogin()
				return
			}
			if (!this.canSubmit) {
				uni.showToast({ title: this.submitButtonText, icon: 'none' })
				return
			}
			const requestId = this.submitRequestId || this.createRequestId()
			this.submitRequestId = requestId
			this.submitting = true
			uni.showLoading({ title: '下单中...' })
			axios.post(this.$baseUrl + '/store/orders', {
				product_id: this.productId,
				address_id: this.address ? this.address.address_id : null,
				client_request_id: requestId,
			}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then((res) => {
				if (res.data && res.data.code === 200) {
					uni.showToast({ title: '下单成功', icon: 'success' })
					uni.redirectTo({
						url: '/pages/store/orders',
					})
				} else {
					uni.showToast({ title: res.data.msg || '下单失败', icon: 'none' })
				}
			}).catch((error) => {
				uni.showToast({ title: error.response?.data?.msg || '下单失败', icon: 'none' })
			}).finally(() => {
				this.submitting = false
				uni.hideLoading()
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.checkout-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #fff8f4 0%, #f6f6f6 220rpx);
	padding: 24rpx 30rpx 140rpx;
	&.dark-mode {
		background: #111111;
	}
}

.page-state {
	margin-top: 180rpx;
	text-align: center;
	font-size: 26rpx;
	color: #9a9a9a;
}

.state-action {
	margin: 20rpx auto 0;
	display: inline-flex;
	padding: 12rpx 20rpx;
	border-radius: 999rpx;
	background: rgba(255, 106, 95, 0.1);
	color: #ff6a5f;
}

.notice-card {
	margin-bottom: 20rpx;
	padding: 20rpx 22rpx;
	border-radius: 18rpx;
	background: rgba(255, 106, 95, 0.08);
	font-size: 24rpx;
	line-height: 1.6;
	color: #9a6e63;
	.notice-action {
		margin-top: 14rpx;
		display: inline-flex;
		padding: 10rpx 18rpx;
		border-radius: 999rpx;
		background: #ff6a5f;
		color: #ffffff;
	}
}

.notice-card.error {
	background: rgba(255, 77, 79, 0.08);
	color: #b34a4c;
}

.product-card {
	display: flex;
	background-color: #ffffff;
	padding: 20rpx;
	border-radius: 16rpx;
	align-items: center;
	margin-bottom: 20rpx;
	&.dark-mode {
		background-color: #000000;
	}
	.cover {
		width: 120rpx;
		height: 120rpx;
		border-radius: 12rpx;
		margin-right: 20rpx;
	}
	.info {
		flex: 1;
	}
	.title {
		font-size: 30rpx;
		font-weight: 600;
		color: #333333;
	}
	.price-row {
		margin-top: 12rpx;
		display: flex;
		align-items: center;
		gap: 8rpx;
		.price {
			font-size: 28rpx;
			font-weight: 700;
			color: #ff6a5f;
		}
	}
	&.dark-mode {
		.title {
			color: #eaeaea;
		}
	}
}

.address-card {
	background-color: #ffffff;
	padding: 20rpx;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	&.dark-mode {
		background-color: #000000;
	}
	.address-line {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 8rpx;
	}
	.address-detail {
		font-size: 24rpx;
		color: #777777;
		margin-bottom: 12rpx;
	}
	.address-actions {
		display: flex;
		gap: 20rpx;
		.action {
			font-size: 24rpx;
			color: #ff6a5f;
		}
	}
	.address-empty {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 120rpx;
		.add-btn {
			font-size: 26rpx;
			color: #ff6a5f;
		}
	}
	&.dark-mode {
		.address-line {
			color: #eaeaea;
		}
	}
}

.summary-card {
	background-color: #ffffff;
	padding: 20rpx;
	border-radius: 16rpx;
	&.dark-mode {
		background-color: #000000;
	}
	.row {
		display: flex;
		justify-content: space-between;
		font-size: 26rpx;
		color: #555555;
		margin-bottom: 12rpx;
		align-items: center;
	}
	.price-row-small {
		display: flex;
		align-items: center;
		gap: 6rpx;
		text {
			font-size: 26rpx;
			color: #ff6a5f;
			font-weight: 600;
		}
	}
	&.dark-mode {
		.row {
			color: #cfcfcf;
		}
	}
}

.bottom-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 20rpx 30rpx calc(20rpx + env(safe-area-inset-bottom));
	background: rgba(255, 255, 255, 0.96);
	backdrop-filter: blur(12rpx);
	box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
	&.dark-mode {
		background: rgba(0, 0, 0, 0.95);
	}
	.confirm-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 12rpx;
		background-color: #ff6a5f;
		color: #ffffff;
		font-size: 30rpx;
		font-weight: 600;
	}
	.confirm-btn:disabled {
		background-color: #cccccc;
	}
}

.checkout-page.dark-mode {
	.notice-card {
		background: #1b1b1b;
		color: #d0b1a8;
	}
	.notice-card.error {
		background: #221516;
		color: #e1aaaa;
	}
}
</style>
