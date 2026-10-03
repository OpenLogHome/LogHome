<template>
	<view class="detail-page" v-dark>
		<view v-if="loadingProduct && !product.id" class="page-state">
			<text>正在加载商品详情...</text>
		</view>

		<view v-else-if="loadError" class="page-state">
			<text>{{ loadError }}</text>
			<view class="state-action" @tap="retryLoad">重新加载</view>
		</view>

		<template v-else>
			<view class="gallery">
				<swiper
					class="banner"
					indicator-dots
					circular
					:autoplay="false"
					@change="galleryIndex = $event.detail.current"
					v-if="mediaList.length > 0"
				>
					<swiper-item v-for="(item, index) in mediaList" :key="index">
						<image
							:src="item"
							mode="aspectFit"
							class="banner-image"
							@tap="previewImage(item)"
						></image>
					</swiper-item>
				</swiper>
				<view v-else class="banner banner-empty">
					<store-icon name="package" :size="84" tone="muted" />
					<text>暂无商品图片</text>
				</view>

				<view v-if="mediaList.length" class="gallery-count">
					{{ galleryIndex + 1 }} / {{ mediaList.length }}
				</view>
			</view>
			<view class="product-info">
				<view class="price-row">
					<text class="price">{{ displayPrice }}</text>
					<text class="currency-unit">原木{{ needsVariant ? '起' : '' }}</text>
					<text class="price-note">去皮原木同价</text>
				</view>
				<view class="product-eyebrow">
					{{ product.category || (product.type === 'physical' ? '实物周边' : '社区权益') }}
				</view>
				<view class="title-row">
					<view class="title">{{ product.title }}</view>
					<view class="status-tag" v-if="isSoldOut">已兑完</view>
				</view>
				<view class="summary" v-if="product.summary">{{ product.summary }}</view>
			</view>
			<view class="selection-card">
				<view v-if="product.has_variants" class="selection-row" @tap="openVariantSheet">
					<text class="meta-label">已选</text>
					<view class="selection-copy">
						<view>{{ selectedVariant ? selectedVariant.label : '请选择商品规格' }}</view>
						<view class="selection-hint">
							{{ availableVariantCount }} 种规格可选 · 本次兑换 1 件
						</view>
					</view>
					<store-icon class="selection-arrow" name="chevron" :size="30" tone="muted" />
				</view>
				<view v-else class="selection-row">
					<text class="meta-label">数量</text>
					<view class="selection-copy">1 件</view>
				</view>
				<view class="selection-row">
					<text class="meta-label">{{ product.type === 'physical' ? '发货' : '发放' }}</text>
					<view class="selection-copy">
						{{
							product.shipping_desc ||
							(product.type === 'physical' ? '兑换后由管理员安排发货' : '兑换成功后自动发放')
						}}
					</view>
				</view>
				<view v-if="product.type === 'physical' && selectedVariant" class="selection-row">
					<text class="meta-label">库存</text>
					<view class="selection-copy">
						{{ displayStock > 0 ? displayStock + ' 件' : '已兑完' }}
					</view>
				</view>
			</view>
			<view class="balance-card">
				<template v-if="isLoggedIn">
					<view class="balance-head">
						<text class="balance-label">可用 {{ totalBalance }} 原木</text>
						<text class="balance-tip">{{ balanceTip }}</text>
					</view>
					<view class="balance-detail">优先扣除去皮原木，不足部分由原木补齐</view>
				</template>
				<view v-else class="balance-head" @tap="goLogin">
					<text class="balance-label">登录查看余额，兑换心仪好物</text>
					<view class="balance-tip login-action">
						<text>去登录</text>
						<store-icon name="chevron" :size="26" />
					</view>
				</view>
			</view>

			<view class="section-card" v-if="product.description">
				<view class="section-title">商品详情</view>
				<rich-text class="rich-content" :nodes="product.description"></rich-text>
			</view>

			<view class="section-card" v-else>
				<view class="section-title">商品详情</view>
				<view class="empty-copy">暂未补充更多说明</view>
			</view>

			<view class="bottom-bar detail-actions">
				<button class="order-shortcut" @tap="goOrders">
					<store-icon name="orders" :size="38" />
					<text>订单</text>
				</button>
				<view class="bottom-copy">
					<view class="bottom-price">
						{{ displayPrice || '--' }}
						<text class="currency-unit">原木{{ needsVariant ? '起' : '' }}</text>
					</view>
				</view>
				<button class="exchange-btn" :disabled="actionDisabled" @tap="goCheckout">
					{{ actionText }}
				</button>
			</view>
			<store-variant-sheet
				:visible="variantSheetVisible"
				:product="product"
				:variants="product.variants || []"
				:selected-id="variantId"
				:disabled="loadingProduct"
				:confirm-text="
					isLoggedIn ? (hasEnoughBalance ? '确认规格并兑换' : '余额不足') : '登录后兑换'
				"
				@select="chooseVariant"
				@close="variantSheetVisible = false"
				@confirm="confirmVariant"
			/>
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
			variantSheetVisible: false,
			product: {},
			resources: {
				log: 0,
				cropped_log: 0,
			},
			mediaList: [],
			galleryIndex: 0,
			loadingProduct: false,
			loadError: '',
		}
	},
	computed: {
		availableVariantCount() {
			return (this.product.variants || []).filter((row) => row.status !== 'off').length
		},
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
		isSoldOut() {
			return this.product.type === 'physical' && Number(this.displayStock) <= 0
		},
		hasEnoughBalance() {
			return this.totalBalance >= Number(this.displayPrice || 0)
		},
		canExchange() {
			if (!this.product.id) return false
			if (this.product.status !== 'on') return false
			if (this.isSoldOut || this.needsVariant) return false
			if (!this.isLoggedIn) return false
			return this.hasEnoughBalance
		},
		actionDisabled() {
			if (this.loadingProduct) return true
			if (!this.product.id) return true
			if (this.product.status !== 'on') return true
			if (this.isSoldOut) return true
			if (this.needsVariant) return false
			if (!this.isLoggedIn) return false
			return !this.hasEnoughBalance
		},
		actionText() {
			if (this.loadingProduct) return '加载中...'
			if (!this.product.id) return '商品不可用'
			if (this.product.status !== 'on') return '商品已下架'
			if (this.isSoldOut) return '已兑完'
			if (this.needsVariant) return '请选择规格'
			if (!this.isLoggedIn) return '登录后兑换'
			if (!this.hasEnoughBalance) return '余额不足'
			return '立即兑换'
		},
		actionHint() {
			if (!this.product.id) return '商品信息暂不可用'
			if (this.needsVariant) return '请选择具体规格，兑换价和库存随规格变化'
			if (this.product.type === 'physical') {
				if (this.isSoldOut) return '库存兑完后将无法继续下单'
				return '下单后请确认收货地址'
			}
			if (!this.isLoggedIn) return '登录后可直接完成兑换'
			return '兑换完成后会自动发放'
		},
		balanceTip() {
			if (!this.product.id) return '加载中'
			if (this.needsVariant) return '请选择规格'
			if (this.hasEnoughBalance) return '余额充足'
			return `还差 ${Math.max(Number(this.displayPrice || 0) - this.totalBalance, 0)} 原木`
		},
	},
	onLoad(options) {
		this.authToken = this.getToken()
		this.productId = options.product_id
		this.variantId = Number(options.variant_id) || null
		this.fetchProduct()
		this.fetchResources()
	},
	onShow() {
		this.authToken = this.getToken()
		this.fetchResources()
	},
	onBackPress() {
		if (this.variantSheetVisible) {
			this.variantSheetVisible = false
			return true
		}
		return false
	},
	onPullDownRefresh() {
		this.retryLoad()
	},
	methods: {
		openVariantSheet() {
			if (!this.loadingProduct && this.product.has_variants) this.variantSheetVisible = true
		},
		confirmVariant() {
			if (!this.selectedVariant || this.isSoldOut) return
			if (this.isLoggedIn && !this.hasEnoughBalance) {
				uni.showToast({ title: '余额不足，可选择其他规格', icon: 'none' })
				return
			}
			this.variantSheetVisible = false
			this.goCheckout()
		},
		goOrders() {
			if (!this.isLoggedIn) {
				this.goLogin()
				return
			}
			uni.navigateTo({ url: '/pages/store/orders' })
		},
		previewImage(current) {
			uni.previewImage({ current, urls: this.mediaList })
		},
		chooseVariant(variant) {
			if (this.loadingProduct || variant.status === 'off' || Number(variant.stock) <= 0) return
			this.variantId = variant.id
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
		parseMediaList(product) {
			const dedup = []
			const append = (url) => {
				if (!url || dedup.includes(url)) return
				dedup.push(url)
			}
			append(product.cover_url)
			if (product.media_urls) {
				try {
					const extra = JSON.parse(product.media_urls)
					if (Array.isArray(extra)) {
						extra.forEach(append)
					}
				} catch (e) {}
			}
			return dedup
		},
		fetchProduct() {
			this.loadingProduct = true
			this.loadError = ''
			axios
				.get(this.$baseUrl + '/store/products/' + this.productId)
				.then((res) => {
					if (res.data && res.data.code === 200) {
						this.product = res.data.data
						this.mediaList = this.parseMediaList(this.product)
						this.loadError = ''
					} else {
						this.product = {}
						this.mediaList = []
						this.loadError = res.data.msg || '商品不存在或已下架'
					}
				})
				.catch((error) => {
					this.product = {}
					this.mediaList = []
					this.loadError = error.response?.data?.msg || '商品加载失败，请稍后重试'
				})
				.finally(() => {
					this.loadingProduct = false
					uni.stopPullDownRefresh()
				})
		},
		retryLoad() {
			this.fetchProduct()
			this.fetchResources()
		},
		goCheckout() {
			if (!this.product.id || this.loadingProduct) return
			if (this.product.status !== 'on' || this.isSoldOut) return
			if (this.needsVariant) {
				this.openVariantSheet()
				return
			}
			if (!this.isLoggedIn) {
				this.goLogin()
				return
			}
			if (!this.canExchange) {
				uni.showToast({ title: '余额不足', icon: 'none' })
				return
			}
			uni.navigateTo({
				url: `/pages/store/checkout?product_id=${this.productId}${
					this.selectedVariant ? '&variant_id=' + this.selectedVariant.id : ''
				}`,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../styles/store.scss';
.detail-page {
	padding-bottom: calc(156rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0px)));
}
.gallery {
	position: relative;
	background: #fff;
}
.banner,
.banner-image {
	height: 750rpx;
	width: 100%;
}
.banner-empty {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #8a8e97;
	background: #f4f5f6;
}
.gallery-count {
	position: absolute;
	right: 24rpx;
	bottom: 24rpx;
	padding: 4rpx 16rpx;
	border-radius: 999rpx;
	background: rgba(25, 39, 30, 0.55);
	color: #fff;
	font-size: 22rpx;
}
.product-info {
	background: var(--store-surface);
	padding: 24rpx 32rpx 30rpx;
}
.price-row {
	gap: 0;
	flex-wrap: wrap;
}
.price {
	font-size: 46rpx;
}
.price-note {
	margin-left: 20rpx;
	font-size: 21rpx;
	color: var(--store-accent);
	background: var(--store-accent-soft);
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
}
.product-eyebrow {
	color: var(--store-muted);
	font-size: 22rpx;
	margin: 12rpx 0;
}
.title-row {
	display: flex;
	align-items: flex-start;
	gap: 20rpx;
}
.title {
	flex: 1;
	font-size: 31rpx;
	font-weight: 600;
	line-height: 1.5;
	overflow-wrap: anywhere;
}
.status-tag {
	white-space: nowrap;
	font-size: 22rpx;
	padding: 6rpx 14rpx;
	border-radius: 8rpx;
	background: var(--store-soft);
	color: var(--store-muted);
}
.summary {
	margin-top: 12rpx;
	color: var(--store-muted);
	font-size: 25rpx;
}
.selection-card,
.balance-card,
.section-card {
	margin: 20rpx 24rpx 0;
	padding: 24rpx 28rpx;
	background: var(--store-surface);
	border-radius: 22rpx;
	border: 1rpx solid var(--store-line);
}
.selection-row {
	min-height: 72rpx;
	display: flex;
	align-items: baseline;
	gap: 24rpx;
	padding: 14rpx 0;
	font-size: 25rpx;
}
.meta-label {
	color: var(--store-muted);
	flex-shrink: 0;
	width: 64rpx;
}
.selection-copy {
	flex: 1;
	min-width: 0;
	overflow-wrap: anywhere;
}
.selection-hint {
	color: var(--store-muted);
	font-size: 22rpx;
	margin-top: 8rpx;
}
.selection-arrow {
	color: var(--store-muted);
	font-size: 32rpx;
}
.balance-head {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	flex-wrap: wrap;
	gap: 8rpx;
}
.balance-label {
	font-size: 24rpx;
}
.balance-tip {
	color: var(--store-primary);
	font-size: 23rpx;
}
.balance-detail {
	color: var(--store-muted);
	font-size: 22rpx;
	margin-top: 10rpx;
}
.section-card {
	padding-top: 28rpx;
}
.rich-content,
.empty-copy {
	font-size: 26rpx;
	line-height: 1.8;
	overflow-wrap: anywhere;
}
.rich-content {
	display: block;
	overflow: hidden;
}
.order-shortcut {
	min-width: 76rpx;
	min-height: 88rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	background: transparent;
	color: var(--store-muted);
	margin: 0;
	padding: 0 8rpx;
	font-size: 21rpx;
	line-height: 1.4;
	border: 0;
}
.order-symbol {
	font-size: 38rpx;
	color: var(--store-text);
}
.detail-actions {
	gap: 24rpx;
}
.detail-actions .bottom-price {
	font-size: 32rpx;
}
.detail-actions .currency-unit {
	font-size: 21rpx;
}
.exchange-btn {
	min-width: 260rpx;
}
@media (min-width: 768px) {
	.banner,
	.banner-image {
		height: 800rpx;
	}
}
.balance-card {
	background: var(--store-primary-soft);
	border-color: transparent;
}
.banner-empty {
	flex-direction: column;
	gap: 24rpx;
}
.section-card .section-title {
	font-size: 28rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid var(--store-line);
}
.login-action {
	display: flex;
	align-items: center;
	gap: 8rpx;
}
</style>
