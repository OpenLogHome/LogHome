<template>
	<view class="detail-page" v-dark>
		<swiper class="banner" indicator-dots autoplay circular v-if="mediaList.length > 0">
			<swiper-item v-for="(item, index) in mediaList" :key="index">
				<image :src="item" mode="aspectFill" class="banner-image"></image>
			</swiper-item>
		</swiper>
		<view class="product-info">
			<view class="title">{{ product.title }}</view>
			<view class="price">🪵 {{ product.price }}</view>
			<view class="stock" v-if="product.type === 'physical'">库存：{{ product.stock }}</view>
			<view class="shipping" v-if="product.shipping_desc">{{ product.shipping_desc }}</view>
		</view>
		<view class="description" v-if="product.description">
			<text>{{ product.description }}</text>
		</view>
		<view class="bottom-bar">
			<button class="exchange-btn" :disabled="!canExchange" @tap="goCheckout">
				{{ canExchange ? '立即兑换' : '余额不足' }}
			</button>
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
			mediaList: [],
		}
	},
	computed: {
		totalBalance() {
			return Number(this.resources.log || 0) + Number(this.resources.cropped_log || 0)
		},
		canExchange() {
			if (!this.product || !this.product.price) return false
			if (this.product.stock !== undefined && this.product.stock <= 0) return false
			return this.totalBalance >= Number(this.product.price)
		},
	},
	onLoad(options) {
		this.productId = options.product_id
		this.fetchProduct()
		this.fetchResources()
	},
	methods: {
		fetchResources() {
			let tk = JSON.parse(window.localStorage.getItem('token'))
			if (tk) tk = tk.tk
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
						let list = []
						if (this.product.cover_url) list.push(this.product.cover_url)
						if (this.product.media_urls) {
							try {
								const extra = JSON.parse(this.product.media_urls)
								if (Array.isArray(extra)) {
									list = list.concat(extra)
								}
							} catch (e) {}
						}
						this.mediaList = list
					}
				})
		},
		goCheckout() {
			if (!this.canExchange) return
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
	background-color: #f6f6f6;
	padding-bottom: 140rpx;
	&.dark-mode {
		background-color: #111111;
	}
}

.banner {
	height: 420rpx;
	.banner-image {
		width: 100%;
		height: 420rpx;
	}
}

.product-info {
	margin: 24rpx 30rpx 0;
	padding: 24rpx;
	background-color: #ffffff;
	border-radius: 16rpx;
	&.dark-mode {
		background-color: #000000;
	}
	.title {
		font-size: 34rpx;
		font-weight: 600;
		color: #222222;
	}
	.price {
		margin-top: 16rpx;
		font-size: 32rpx;
		color: #ff6a5f;
		font-weight: 700;
	}
	.stock {
		margin-top: 8rpx;
		font-size: 24rpx;
		color: #888888;
	}
	.shipping {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #999999;
	}
	&.dark-mode {
		.title {
			color: #eaeaea;
		}
	}
}

.description {
	margin: 20rpx 30rpx;
	padding: 24rpx;
	background-color: #ffffff;
	border-radius: 16rpx;
	font-size: 26rpx;
	line-height: 40rpx;
	color: #666666;
	&.dark-mode {
		background-color: #000000;
		color: #cfcfcf;
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
	.exchange-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 12rpx;
		background-color: #ff6a5f;
		color: #ffffff;
		font-size: 30rpx;
		font-weight: 600;
	}
	.exchange-btn:disabled {
		background-color: #cccccc;
	}
}
</style>
