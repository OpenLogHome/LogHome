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
			<swiper class="banner" indicator-dots autoplay circular v-if="mediaList.length > 0">
				<swiper-item v-for="(item, index) in mediaList" :key="index">
					<image :src="item" mode="aspectFill" class="banner-image"></image>
				</swiper-item>
			</swiper>
			<view v-else class="banner banner-empty">
				<text>暂无商品图片</text>
			</view>

			<view class="product-info">
				<view class="title-row">
					<view class="title">{{ product.title }}</view>
					<view class="status-tag" v-if="isSoldOut">已兑完</view>
				</view>
				<view class="summary" v-if="product.summary">{{ product.summary }}</view>
				<view class="price-row">
					<image src="../../static/resources/cropped_log.webp" mode="aspectFit" style="width: 40rpx; height: 40rpx;"></image>
					<image src="../../static/resources/log.png" mode="aspectFit" style="width: 40rpx; height: 40rpx;"></image>
					<text class="price">{{ product.price }}</text>
				</view>
				<view class="meta-list">
					<view class="meta-item">
						<text class="meta-label">商品类型</text>
						<text class="meta-value">{{ product.type === 'physical' ? '实物商品' : '虚拟权益' }}</text>
					</view>
					<view class="meta-item" v-if="product.type === 'physical'">
						<text class="meta-label">库存</text>
						<text class="meta-value">{{ product.stock > 0 ? `剩余 ${product.stock} 件` : '已兑完' }}</text>
					</view>
					<view class="meta-item" v-if="product.shipping_desc">
						<text class="meta-label">发放说明</text>
						<text class="meta-value">{{ product.shipping_desc }}</text>
					</view>
				</view>
			</view>

			<view class="balance-card">
				<template v-if="isLoggedIn">
					<view class="balance-head">
						<text class="balance-label">当前可用资产</text>
						<text class="balance-value">{{ totalBalance }}</text>
					</view>
					<view class="balance-detail">
						<text>原木 {{ resources.log || 0 }}</text>
						<text>去皮 {{ resources.cropped_log || 0 }}</text>
					</view>
					<view class="balance-tip">{{ balanceTip }}</view>
				</template>
				<template v-else>
					<view class="balance-label">登录后可直接兑换</view>
					<view class="balance-tip">现在可以先看商品详情，登录后会显示你的可兑换余额。</view>
					<view class="balance-login" @tap="goLogin">去登录</view>
				</template>
			</view>

			<view class="section-card" v-if="product.description">
				<view class="section-title">商品详情</view>
				<rich-text class="rich-content" :nodes="product.description"></rich-text>
			</view>

			<view class="section-card" v-else>
				<view class="section-title">商品详情</view>
				<view class="empty-copy">暂未补充更多说明</view>
			</view>

			<view class="bottom-bar">
				<view class="bottom-copy">
					<view class="bottom-price">{{ product.price || '--' }}</view>
					<view class="bottom-hint">{{ actionHint }}</view>
				</view>
				<button class="exchange-btn" :disabled="actionDisabled" @tap="goCheckout">
					{{ actionText }}
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
			mediaList: [],
			loadingProduct: false,
			loadError: '',
		}
	},
	computed: {
		isLoggedIn() {
			return !!this.getToken()
		},
		totalBalance() {
			return Number(this.resources.log || 0) + Number(this.resources.cropped_log || 0)
		},
		isSoldOut() {
			return this.product.type === 'physical' && Number(this.product.stock) <= 0
		},
		hasEnoughBalance() {
			return this.totalBalance >= Number(this.product.price || 0)
		},
		canExchange() {
			if (!this.product.id) return false
			if (this.product.status !== 'on') return false
			if (this.isSoldOut) return false
			if (!this.isLoggedIn) return false
			return this.hasEnoughBalance
		},
		actionDisabled() {
			if (this.loadingProduct) return true
			if (!this.product.id) return true
			if (this.product.status !== 'on') return true
			if (this.isSoldOut) return true
			if (!this.isLoggedIn) return false
			return !this.hasEnoughBalance
		},
		actionText() {
			if (this.loadingProduct) return '加载中...'
			if (!this.product.id) return '商品不可用'
			if (this.product.status !== 'on') return '商品已下架'
			if (this.isSoldOut) return '已兑完'
			if (!this.isLoggedIn) return '登录后兑换'
			if (!this.hasEnoughBalance) return '余额不足'
			return '立即兑换'
		},
		actionHint() {
			if (!this.product.id) return '商品信息暂不可用'
			if (this.product.type === 'physical') {
				if (this.isSoldOut) return '库存兑完后将无法继续下单'
				return '下单后请确认收货地址'
			}
			if (!this.isLoggedIn) return '登录后可直接完成兑换'
			return '兑换完成后会自动发放'
		},
		balanceTip() {
			if (!this.product.id) return '加载商品后可查看可兑换状态'
			if (this.hasEnoughBalance) return '当前余额充足，可以直接兑换'
			return `还差 ${Math.max(Number(this.product.price || 0) - this.totalBalance, 0)} 原木`
		},
	},
	onLoad(options) {
		this.productId = options.product_id
		this.fetchProduct()
		this.fetchResources()
	},
	onShow() {
		this.fetchResources()
	},
	onPullDownRefresh() {
		this.retryLoad()
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
			axios.get(this.$baseUrl + '/store/products/' + this.productId)
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
				}).catch((error) => {
					this.product = {}
					this.mediaList = []
					this.loadError = error.response?.data?.msg || '商品加载失败，请稍后重试'
				}).finally(() => {
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
			if (!this.isLoggedIn) {
				this.goLogin()
				return
			}
			if (!this.canExchange) {
				uni.showToast({ title: '余额不足', icon: 'none' })
				return
			}
			uni.navigateTo({
				url: `/pages/store/checkout?product_id=${this.productId}`,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.detail-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #fff8f4 0%, #f6f6f6 320rpx);
	padding-bottom: 160rpx;
	&.dark-mode {
		background: #111111;
	}
}

.page-state {
	margin-top: 180rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 26rpx;
	color: #9a9a9a;
	.state-action {
		margin-top: 20rpx;
		padding: 12rpx 20rpx;
		border-radius: 999rpx;
		background: rgba(255, 106, 95, 0.1);
		color: #ff6a5f;
	}
}

.banner {
	height: 460rpx;
	.banner-image {
		width: 100%;
		height: 460rpx;
	}
}

.banner-empty {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #aaaaaa;
	background: #f2f2f2;
}

.product-info,
.balance-card,
.section-card {
	margin: 24rpx 24rpx 0;
	padding: 24rpx;
	background: #ffffff;
	border-radius: 24rpx;
	box-shadow: 0 10rpx 28rpx rgba(0, 0, 0, 0.04);
	&.dark-mode {
		background: #000000;
		box-shadow: none;
	}
}

.title-row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 20rpx;
}

.title {
	flex: 1;
	font-size: 36rpx;
	font-weight: 700;
	color: #222222;
	line-height: 1.5;
}

.status-tag {
	padding: 8rpx 16rpx;
	border-radius: 999rpx;
	background: rgba(255, 138, 0, 0.12);
	color: #ff8a00;
	font-size: 22rpx;
	white-space: nowrap;
}

.summary {
	margin-top: 14rpx;
	font-size: 26rpx;
	line-height: 1.7;
	color: #7d7d7d;
}

.price-row {
	margin-top: 18rpx;
	display: flex;
	align-items: center;
	gap: 8rpx;
	.price {
		font-size: 34rpx;
		font-weight: 700;
		color: #ff6a5f;
	}
}

.meta-list {
	margin-top: 20rpx;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.meta-item,
.balance-head,
.balance-detail {
	display: flex;
	justify-content: space-between;
	gap: 20rpx;
}

.meta-label,
.balance-label {
	font-size: 24rpx;
	color: #9a9a9a;
}

.meta-value,
.balance-value {
	font-size: 24rpx;
	color: #333333;
	text-align: right;
}

.balance-value {
	font-size: 40rpx;
	font-weight: 700;
	color: #ff6a5f;
}

.balance-detail {
	margin-top: 14rpx;
	font-size: 24rpx;
	color: #7f7f7f;
}

.balance-tip {
	margin-top: 16rpx;
	font-size: 23rpx;
	line-height: 1.6;
	color: #b08d84;
}

.balance-login {
	margin-top: 18rpx;
	display: inline-flex;
	padding: 12rpx 20rpx;
	border-radius: 999rpx;
	background: rgba(255, 106, 95, 0.1);
	color: #ff6a5f;
	font-size: 24rpx;
	font-weight: 600;
}

.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 18rpx;
}

.rich-content,
.empty-copy {
	font-size: 26rpx;
	line-height: 1.8;
	color: #5f5f5f;
	word-break: break-word;
}

.bottom-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom));
	background: rgba(255, 255, 255, 0.96);
	backdrop-filter: blur(12rpx);
	box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
	&.dark-mode {
		background: rgba(0, 0, 0, 0.95);
	}
}

.bottom-copy {
	flex: 1;
	min-width: 0;
}

.bottom-price {
	font-size: 34rpx;
	font-weight: 700;
	color: #ff6a5f;
}

.bottom-hint {
	margin-top: 6rpx;
	font-size: 22rpx;
	line-height: 1.5;
	color: #8f8f8f;
}

.exchange-btn {
	width: 260rpx;
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 16rpx;
	background: #ff6a5f;
	color: #ffffff;
	font-size: 30rpx;
	font-weight: 600;
}

.exchange-btn:disabled {
	background: #cccccc;
}

.detail-page.dark-mode {
	.title,
	.meta-value,
	.section-title {
		color: #ededed;
	}
	.summary,
	.rich-content,
	.empty-copy,
	.bottom-hint {
		color: #c7c7c7;
	}
	.meta-label,
	.balance-label,
	.balance-detail {
		color: #9d9d9d;
	}
}
</style>
