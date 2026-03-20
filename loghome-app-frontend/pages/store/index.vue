<template>
	<view class="store-page" v-dark>
		<view class="store-header">
			<view class="header-title">积分商城</view>
			<view class="header-action" @tap="goOrders">兑换记录</view>
		</view>
		<view class="balance-bar">
			<view class="balance-total">
				<text class="label">可用资产</text>
				<text class="value">{{ totalBalance }}</text>
			</view>
			<view class="balance-detail">
				<text>原木: {{ resources.log || 0 }}</text>
				<text>去皮: {{ resources.cropped_log || 0 }}</text>
			</view>
		</view>
		<view class="tab-bar">
			<view
				v-for="(tab, index) in tabs"
				:key="tab.value"
				:class="['tab-item', activeTab === index ? 'active' : '']"
				@tap="changeTab(index)"
			>
				{{ tab.label }}
			</view>
		</view>
		<view class="product-grid" v-if="products.length > 0">
			<view class="product-card" v-for="item in products" :key="item.id" @tap="goDetail(item)">
				<image class="cover" :src="item.cover_url" mode="aspectFill"></image>
				<view class="title">{{ item.title }}</view>
				<view class="tags">
					<text class="tag" v-if="item.type === 'physical'">实物</text>
					<text class="tag warning" v-if="showStockWarning(item)">仅剩 {{ item.stock }} 件</text>
				</view>
				<view class="price-row">
					<image src="../../static/resources/cropped_log.webp" mode="aspectFit" style="width: 40rpx; height: 40rpx;"></image>
					<image src="../../static/resources/log.png" mode="aspectFit" style="width: 40rpx; height: 40rpx;"></image>
					<text class="price">
						{{ item.price }}
					</text>
				</view>
				<view class="shipping" v-if="item.shipping_desc">{{ item.shipping_desc }}</view>
			</view>
		</view>
		<view class="empty" v-if="!loading && products.length === 0">
			<text>商品正在补货中...</text>
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
			tabs: [
				{ label: '全部', value: 'all' },
				{ label: '虚拟权益', value: 'virtual' },
				{ label: '实物周边', value: 'physical' },
			],
			activeTab: 0,
			page: 1,
			pageSize: 10,
			total: 0,
			products: [],
			loading: false,
			finished: false,
			resources: {
				log: 0,
				cropped_log: 0,
			},
		}
	},
	computed: {
		totalBalance() {
			return (Number(this.resources.log || 0) + Number(this.resources.cropped_log || 0)) || 0
		},
	},
	onLoad() {
		this.refreshAll()
	},
	onPullDownRefresh() {
		this.refreshAll()
	},
	onReachBottom() {
		if (this.finished || this.loading) return
		this.page += 1
		this.fetchProducts()
	},
	methods: {
		changeTab(index) {
			if (this.activeTab === index) return
			this.activeTab = index
			this.refreshProducts()
		},
		refreshAll() {
			this.refreshProducts()
			this.fetchResources()
		},
		refreshProducts() {
			this.page = 1
			this.products = []
			this.finished = false
			this.fetchProducts()
		},
		fetchResources() {
			let tk = JSON.parse(window.localStorage.getItem('token'))
			if (tk) tk = tk.tk
			if (!tk) {
				return
			}
			axios.get(this.$baseUrl + '/resource/get_resources', {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then((res) => {
				this.resources = res.data[0] || { log: 0, cropped_log: 0 }
			}).catch(() => {})
		},
		fetchProducts() {
			if (this.loading) return
			this.loading = true
			const type = this.tabs[this.activeTab].value
			axios.get(this.$baseUrl + '/store/products', {
				params: {
					type,
					page: this.page,
					pageSize: this.pageSize,
				},
			}).then((res) => {
				if (res.data && res.data.code === 200) {
					const list = res.data.data.list || []
					this.total = res.data.data.total || 0
					this.products = this.products.concat(list)
					if (this.products.length >= this.total) {
						this.finished = true
					}
				}
			}).finally(() => {
				this.loading = false
				uni.stopPullDownRefresh()
			})
		},
		showStockWarning(item) {
			return item.type === 'physical' && Number(item.stock) > 0 && Number(item.stock) <= 10
		},
		goDetail(item) {
			uni.navigateTo({
				url: `/pages/store/detail?product_id=${item.id}`,
			})
		},
		goOrders() {
			uni.navigateTo({
				url: '/pages/store/orders',
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.store-page {
	min-height: 100vh;
	background-color: #f6f6f6;
	padding-bottom: 30rpx;
	&.dark-mode {
		background-color: #111111;
	}
}

.store-header {
	position: sticky;
	top: 0;
	z-index: 20;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 40rpx 20rpx;
	background-color: #ffffff;
	&.dark-mode {
		background-color: #000000;
	}
	.header-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #222222;
	}
	.header-action {
		font-size: 28rpx;
		color: #ff6a5f;
	}
	&.dark-mode {
		.header-title {
			color: #eaeaea;
		}
	}
}

.balance-bar {
	margin: 20rpx 30rpx 20rpx;
	padding: 24rpx 28rpx;
	background-color: #ffffff;
	border-radius: 16rpx;
	&.dark-mode {
		background-color: #000000;
	}
	.balance-total {
		display: flex;
		align-items: baseline;
		.label {
			font-size: 26rpx;
			color: #888888;
			margin-right: 16rpx;
		}
		.value {
			font-size: 42rpx;
			font-weight: 700;
			color: #ff6a5f;
		}
	}
	.balance-detail {
		margin-top: 10rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999999;
	}
}

.tab-bar {
	display: flex;
	justify-content: space-around;
	padding: 0 20rpx 20rpx;
	.tab-item {
		font-size: 28rpx;
		color: #666666;
		padding: 10rpx 18rpx;
		border-radius: 20rpx;
	}
	.tab-item.active {
		background-color: #ff6a5f;
		color: #ffffff;
	}
	&.dark-mode {
		.tab-item {
			color: #cfcfcf;
		}
	}
}

.product-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 0 24rpx;
}

.product-card {
	width: 48%;
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 16rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	&.dark-mode {
		background-color: #000000;
	}
	.cover {
		width: 100%;
		height: 220rpx;
		border-radius: 12rpx;
	}
	.title {
		margin-top: 12rpx;
		font-size: 28rpx;
		font-weight: 600;
		color: #333333;
		line-height: 36rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.tags {
		margin-top: 8rpx;
		display: flex;
		flex-wrap: wrap;
		gap: 8rpx;
		.tag {
			font-size: 22rpx;
			color: #ff6a5f;
			background-color: rgba(255, 106, 95, 0.1);
			padding: 4rpx 10rpx;
			border-radius: 12rpx;
		}
		.tag.warning {
			color: #ff8a00;
			background-color: rgba(255, 138, 0, 0.12);
		}
	}
	.price-row {
		margin-top: 10rpx;
		display: flex;
		align-items: center;
		gap: 8rpx;
		.price {
			font-size: 30rpx;
			font-weight: 700;
			color: #ff6a5f;
		}
	}
	.shipping {
		margin-top: 6rpx;
		font-size: 22rpx;
		color: #9a9a9a;
	}
	&.dark-mode {
		.title {
			color: #eaeaea;
		}
	}
}

.empty {
	margin-top: 120rpx;
	text-align: center;
	color: #9a9a9a;
	font-size: 26rpx;
}
</style>
