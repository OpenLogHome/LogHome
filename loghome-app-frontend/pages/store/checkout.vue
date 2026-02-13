<template>
	<view class="checkout-page" v-dark>
		<view class="product-card">
			<image class="cover" :src="product.cover_url" mode="aspectFill"></image>
			<view class="info">
				<view class="title">{{ product.title }}</view>
				<view class="price">🪵 {{ product.price }}</view>
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
		<view class="summary-card">
			<view class="row">
				<text>商品价格</text>
				<text>🪵 {{ product.price }}</text>
			</view>
			<view class="row">
				<text>支付方式</text>
				<text>自动扣除（优先去皮原木）</text>
			</view>
			<view class="row" v-if="product.price">
				<text>预计扣除</text>
				<text>{{ payCropped }} 去皮 + {{ payLog }} 原木</text>
			</view>
		</view>
		<view class="bottom-bar">
			<button class="confirm-btn" :disabled="!canSubmit" @tap="submitOrder">确认下单</button>
		</view>
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
		}
	},
	computed: {
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
	},
	onLoad(options) {
		this.productId = options.product_id
		this.fetchProduct()
		this.fetchResources()
	},
	onShow() {
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
		fetchResources() {
			const tk = this.getToken()
			if (!tk) return
			axios.get(this.$baseUrl + '/resource/get_resources', {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then((res) => {
				this.resources = res.data[0] || { log: 0, cropped_log: 0 }
			}).catch(() => {})
		},
		fetchProduct() {
			axios.get(this.$baseUrl + '/store/products/' + this.productId)
				.then((res) => {
					if (res.data && res.data.code === 200) {
						this.product = res.data.data
						if (this.product.type === 'physical') {
							this.fetchDefaultAddress()
						}
					}
				})
		},
		fetchDefaultAddress() {
			const tk = this.getToken()
			if (!tk) return
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
			if (!this.canSubmit) return
			const tk = this.getToken()
			if (!tk) return
			uni.showLoading({ title: '下单中...' })
			axios.post(this.$baseUrl + '/store/orders', {
				product_id: this.productId,
				address_id: this.address ? this.address.address_id : null,
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
				uni.hideLoading()
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.checkout-page {
	min-height: 100vh;
	background-color: #f6f6f6;
	padding: 24rpx 30rpx 140rpx;
	&.dark-mode {
		background-color: #111111;
	}
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
	.price {
		margin-top: 12rpx;
		font-size: 28rpx;
		color: #ff6a5f;
		font-weight: 600;
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
	padding: 20rpx 30rpx;
	background-color: #ffffff;
	box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
	&.dark-mode {
		background-color: #000000;
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
</style>
