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
			<view
				class="address-card"
				v-if="product.type === 'physical'"
				@tap="isLoggedIn ? chooseAddress() : goLogin()"
			>
				<view class="address-icon"><store-icon name="pin" :size="38" tone="brand" /></view>
				<view class="address-copy">
					<view class="section-title">收货地址</view>
					<view v-if="address">
						<view class="address-line">
							<text class="name">{{ address.receiver_name }}</text>
							<text class="phone">{{ address.receiver_phone }}</text>
						</view>
						<view class="address-detail">
							{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
						</view>
					</view>
					<view v-else class="address-empty">
						{{ isLoggedIn ? '请添加收货地址' : '登录后选择收货地址' }}
					</view>
				</view>
				<store-icon class="address-arrow" name="chevron" :size="30" tone="muted" />
			</view>
			<view class="product-card" v-if="product.id">
				<image
					class="cover"
					:src="(selectedVariant && selectedVariant.cover_url) || product.cover_url"
					mode="aspectFit"
				/>
				<view class="info">
					<view class="title">{{ product.title }}</view>
					<view class="selected-spec">
						{{
							selectedVariant
								? selectedVariant.label
								: product.has_variants
								? '请选择商品规格'
								: '默认规格'
						}}
					</view>
					<view class="product-subtotal">
						<view class="price-row">
							<text class="price">{{ displayPrice }}</text>
							<text class="currency-unit">原木{{ needsVariant ? '起' : '' }}</text>
						</view>
						<text class="quantity">× 1</text>
					</view>
				</view>
			</view>
			<view class="spec-change" v-if="product.has_variants" @tap="openVariantSheet">
				<text>商品规格</text>
				<text class="spec-change-action">{{ needsVariant ? '请选择' : '更换规格' }}</text>
				<store-icon name="chevron" :size="28" tone="muted" />
			</view>
			<store-variant-sheet
				:visible="variantExpanded"
				:product="product"
				:variants="product.variants || []"
				:selected-id="variantId"
				:disabled="submitting || loadingProduct"
				@select="chooseVariant"
				@close="variantExpanded = false"
				@confirm="variantExpanded = false"
			/>

			<view class="summary-card" v-if="product.id">
				<view class="section-title">兑换明细</view>
				<view class="row">
					<text>商品价格</text>
					<view class="price-row-small">
						<text>{{ needsVariant ? '待选择规格' : displayPrice + ' 原木' }}</text>
					</view>
				</view>

				<view class="row">
					<text>订单说明</text>
					<text>{{ product.type === 'physical' ? '提交后等待发货' : '提交后自动发放' }}</text>
				</view>
				<view class="row" v-if="product.shipping_desc">
					<text>发放说明</text>
					<text>{{ product.shipping_desc }}</text>
				</view>
			</view>
			<view class="summary-card payment-card" v-if="product.id">
				<view class="section-title">原木支付</view>
				<view class="payment-method">
					<view class="payment-icon"><store-icon name="wallet" :size="38" tone="brand" /></view>
					<view class="payment-copy">
						<view>优先使用去皮原木</view>
						<view class="payment-caption">
							{{
								isLoggedIn
									? '可用 ' +
									  (resources.cropped_log || 0) +
									  ' 去皮原木 · ' +
									  (resources.log || 0) +
									  ' 原木'
									: '登录后查看可用余额'
							}}
						</view>
					</view>
					<store-icon name="check-circle" :size="38" tone="brand" />
				</view>
				<view class="row payment-total" v-if="displayPrice && !needsVariant">
					<text>本次扣除</text>
					<text>{{ payCropped }} 去皮 + {{ payLog }} 原木</text>
				</view>
				<view class="payment-caption" v-else>选择规格后计算扣款明细</view>
			</view>

			<view class="bottom-bar">
				<view class="bottom-copy">
					<view class="bottom-label">合计 · 1 件商品</view>
					<view class="bottom-price">
						{{ needsVariant ? '--' : displayPrice }}
						<text class="currency-unit">原木</text>
					</view>
				</view>
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
import StoreIcon from '@/components/StoreIcon.vue'
import StoreVariantSheet from '@/components/StoreVariantSheet.vue'

export default {
	mixins: [darkModeMixin],
	components: { StoreVariantSheet, StoreIcon },
	data() {
		return {
			authToken: null,
			productId: null,
			variantId: null,
			variantExpanded: false,
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
		selectedVariant() {
			return (
				(this.product.variants || []).find(
					(row) => Number(row.id) === Number(this.variantId) && row.status !== 'off'
				) || null
			)
		},
		displayPrice() {
			return this.selectedVariant
				? Number(this.selectedVariant.price)
				: Number(this.product.price || 0)
		},
		displayStock() {
			return this.selectedVariant
				? Number(this.selectedVariant.stock)
				: Number(this.product.stock || 0)
		},
		needsVariant() {
			return !!this.product.has_variants && !this.selectedVariant
		},

		isLoggedIn() {
			return !!this.authToken
		},
		totalBalance() {
			return Number(this.resources.log || 0) + Number(this.resources.cropped_log || 0)
		},
		payCropped() {
			const price = Number(this.displayPrice || 0)
			return Math.min(Number(this.resources.cropped_log || 0), price)
		},
		payLog() {
			const price = Number(this.displayPrice || 0)
			return price - this.payCropped
		},
		canSubmit() {
			if (this.needsVariant || this.displayStock <= 0) return false
			if (!this.displayPrice) return false
			if (this.totalBalance < Number(this.displayPrice)) return false
			if (this.product.type === 'physical' && !this.address) return false
			return true
		},
		submitDisabled() {
			if (this.submitting || this.loadingProduct) return true
			if (this.loadError) return true
			if (!this.displayPrice) return true
			if (this.needsVariant) return false
			if (!this.isLoggedIn) return false
			return !this.canSubmit
		},
		submitButtonText() {
			if (this.submitting) return '提交中...'
			if (this.loadError) return '商品不可下单'
			if (this.needsVariant) return '请选择规格'
			if (this.displayStock <= 0) return '已兑完'
			if (!this.displayPrice) return '商品信息加载中'
			if (!this.isLoggedIn) return '登录后下单'
			if (this.product.type === 'physical' && !this.address) return '请选择地址'
			if (this.totalBalance < Number(this.displayPrice)) return '余额不足'
			return '确认兑换'
		},
	},
	onLoad(options) {
		this.authToken = this.getToken()
		this.productId = options.product_id
		this.variantId = Number(options.variant_id) || null
		this.submitRequestId = this.createRequestId()
		this.refreshCheckout()
	},
	onBackPress() {
		if (this.variantExpanded) {
			this.variantExpanded = false
			return true
		}
		return false
	},
	onPullDownRefresh() {
		this.refreshCheckout()
	},
	onShow() {
		this.authToken = this.getToken()
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
		openVariantSheet() {
			if (!this.submitting && !this.loadingProduct) this.variantExpanded = true
		},
		chooseVariant(variant) {
			if (this.submitting || variant.status === 'off' || Number(variant.stock) <= 0) return
			this.variantId = variant.id
			this.submitRequestId = this.createRequestId()
		},

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
			axios
				.get(this.$baseUrl + '/resource/get_resources', {
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + tk,
					},
				})
				.then((res) => {
					this.resources = res.data[0] || { log: 0, cropped_log: 0 }
				})
				.catch(() => {
					this.resources = { log: 0, cropped_log: 0 }
				})
		},
		fetchProduct() {
			this.loadingProduct = true
			this.loadError = ''
			axios
				.get(this.$baseUrl + '/store/products/' + this.productId)
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
				})
				.catch((error) => {
					this.product = {}
					this.address = null
					this.loadError = error.response?.data?.msg || '商品不存在或已下架'
				})
				.finally(() => {
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
			axios
				.get(this.$baseUrl + '/store/addresses/default', {
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + tk,
					},
				})
				.then((res) => {
					if (res.data && res.data.code === 200) {
						this.address = res.data.data
					}
				})
		},
		fetchAddressById(addressId) {
			const tk = this.getToken()
			if (!tk) return
			axios
				.get(this.$baseUrl + `/store/addresses/${addressId}`, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + tk,
					},
				})
				.then((res) => {
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
			if (this.submitting || this.loadingProduct || this.loadError) return
			if (this.needsVariant) {
				this.openVariantSheet()
				return
			}
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
			axios
				.post(
					this.$baseUrl + '/store/orders',
					{
						product_id: this.productId,
						variant_id: this.selectedVariant ? this.selectedVariant.id : null,
						address_id: this.address ? this.address.address_id : null,
						client_request_id: requestId,
					},
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + tk,
						},
					}
				)
				.then((res) => {
					if (res.data && res.data.code === 200) {
						uni.showToast({ title: '下单成功', icon: 'success' })
						uni.redirectTo({
							url: '/pages/store/orders',
						})
					} else {
						uni.showToast({ title: res.data.msg || '下单失败', icon: 'none' })
					}
				})
				.catch((error) => {
					uni.showToast({ title: error.response?.data?.msg || '下单失败', icon: 'none' })
				})
				.finally(() => {
					this.submitting = false
					uni.hideLoading()
				})
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../styles/store.scss';
.checkout-page {
	padding-top: 24rpx;
	padding-bottom: calc(168rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0px)));
}
.notice-card {
	margin: 0 24rpx 20rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	background: var(--store-accent-soft);
	color: var(--store-accent);
	font-size: 25rpx;
}
.notice-card.error {
	color: var(--store-danger);
	background: var(--store-soft);
}
.product-card,
.address-card,
.summary-card {
	margin: 0 24rpx 20rpx;
	padding: 28rpx;
	background: var(--store-surface);
	border-radius: 22rpx;
	border: 1rpx solid var(--store-line);
	box-shadow: var(--store-shadow);
}
.address-card {
	display: flex;
	align-items: center;
	gap: 20rpx;
	position: relative;
	overflow: hidden;
	padding-bottom: 28rpx;
}
.address-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 68rpx;
	height: 68rpx;
	flex-shrink: 0;
	border-radius: 20rpx;
	background: var(--store-primary-soft);
}
.address-copy {
	flex: 1;
	min-width: 0;
}
.address-copy .section-title {
	font-size: 25rpx;
	margin-bottom: 12rpx;
}
.address-arrow {
	color: var(--store-muted);
	font-size: 36rpx;
}
.address-line {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	align-items: baseline;
}
.name {
	font-size: 30rpx;
	font-weight: 600;
}
.phone {
	font-size: 25rpx;
	color: var(--store-muted);
}
.address-detail {
	margin-top: 10rpx;
	font-size: 24rpx;
	line-height: 1.7;
	overflow-wrap: anywhere;
}
.address-empty {
	color: var(--store-muted);
	font-size: 25rpx;
	padding: 8rpx 0;
}
.product-card {
	display: flex;
	align-items: flex-start;
	gap: 24rpx;
	margin-bottom: 0;
	border-radius: 22rpx 22rpx 0 0;
	border-bottom: 0;
}
.cover {
	width: 168rpx;
	height: 168rpx;
	border-radius: 12rpx;
	flex-shrink: 0;
	background: #fff;
}
.info {
	flex: 1;
	min-width: 0;
}
.title {
	font-size: 27rpx;
	font-weight: 600;
	line-height: 1.5;
}
.selected-spec {
	font-size: 23rpx;
	color: var(--store-muted);
	margin: 10rpx 0 16rpx;
}
.product-subtotal {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 8rpx;
}
.price-row {
	gap: 0;
	flex-wrap: wrap;
}
.price {
	font-size: 32rpx;
}
.currency-unit,
.quantity {
	font-size: 22rpx;
	color: var(--store-muted);
}
.row {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 28rpx;
	font-size: 25rpx;
	padding: 14rpx 0;
}
.row > text:first-child {
	color: var(--store-muted);
	flex-shrink: 0;
}
.row > text:last-child {
	text-align: right;
}
.payment-total {
	border-top: 1rpx solid var(--store-line);
	padding-top: 24rpx;
	margin-top: 24rpx;
	font-weight: 600;
}
.spec-change {
	margin: 0 24rpx 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24rpx;
	min-height: 88rpx;
	padding: 16rpx 28rpx;
	border-top: 1rpx solid var(--store-line);
	border-radius: 0 0 22rpx 22rpx;
	border: 1rpx solid var(--store-line);
	border-top: 1rpx solid var(--store-line);
	background: var(--store-surface);
	font-size: 24rpx;
}
.spec-change-action {
	color: var(--store-primary);
	flex: 1;
	text-align: right;
}
.payment-method {
	display: flex;
	align-items: center;
	gap: 18rpx;
	font-size: 27rpx;
}
.payment-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12rpx;
	width: 64rpx;
	height: 64rpx;
	color: var(--store-primary);
	background: var(--store-primary-soft);
}
.payment-copy {
	flex: 1;
	min-width: 0;
}
.payment-caption {
	color: var(--store-muted);
	font-size: 22rpx;
	margin-top: 8rpx;
}
.payment-check {
	color: var(--store-primary);
	font-size: 32rpx;
}
.confirm-btn {
	min-width: 260rpx;
}
.payment-icon {
	background: var(--store-primary-soft);
	border-radius: 18rpx;
}
.address-copy .section-title {
	color: var(--store-muted);
	font-size: 23rpx;
	font-weight: 500;
}
.payment-card .section-title {
	font-size: 28rpx;
}
</style>
