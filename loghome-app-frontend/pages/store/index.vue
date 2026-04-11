<template>
	<view class="store-page" v-dark>
		<view class="store-header">
			<view>
				<view class="header-title">积分商城</view>
				<view class="header-subtitle">用原木兑换社区权益与限定周边</view>
			</view>
			<view class="header-action" @tap="handleHeaderAction">
				{{ isLoggedIn ? '兑换记录' : '去登录' }}
			</view>
		</view>

		<view class="balance-bar">
			<view v-if="isLoggedIn" class="balance-inner">
				<view class="balance-main">
					<view class="balance-total">
						<text class="label">可用资产</text>
						<text class="value">{{ totalBalance }}</text>
					</view>
					<view class="balance-tip">兑换时会优先扣除去皮原木</view>
				</view>
				<view class="balance-icons">
					<view class="currency-pill">
						<image class="currency-icon" src="../../static/resources/log.png" mode="aspectFit"></image>
						<view class="currency-copy">
							<text class="currency-name">原木</text>
							<text class="currency-value">{{ resources.log || 0 }}</text>
						</view>
					</view>
					<view class="currency-pill strong">
						<image class="currency-icon" src="../../static/resources/cropped_log.webp" mode="aspectFit"></image>
						<view class="currency-copy">
							<text class="currency-name">去皮</text>
							<text class="currency-value">{{ resources.cropped_log || 0 }}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="guest-balance">
				<view class="guest-title">登录后查看余额并直接兑换</view>
				<view class="guest-desc">商品可以先浏览，决定好再登录也不晚。</view>
				<view class="guest-btn" @tap="goLogin">立即登录</view>
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

		<view v-if="loading && products.length === 0" class="loading-box">
			<text>正在加载商品...</text>
		</view>

		<view class="product-grid" v-else-if="products.length > 0">
			<view class="product-card" v-for="item in products" :key="item.id" @tap="goDetail(item)">
				<view class="cover-wrap">
					<image class="cover" :src="item.cover_url" mode="aspectFill"></image>
					<view class="cover-badge" v-if="isSoldOut(item)">已兑完</view>
				</view>
				<view class="title">{{ item.title }}</view>
				<view class="summary" v-if="item.summary">{{ item.summary }}</view>
				<view class="tags">
					<text class="tag" v-if="item.type === 'physical'">实物</text>
					<text class="tag" v-else>虚拟</text>
					<text class="tag warning" v-if="showStockWarning(item)">仅剩 {{ item.stock }} 件</text>
				</view>
				<view class="price-row">
					<image src="../../static/resources/cropped_log.webp" mode="aspectFit" style="width: 40rpx; height: 40rpx;"></image>
					<image src="../../static/resources/log.png" mode="aspectFit" style="width: 40rpx; height: 40rpx;"></image>
					<text class="price">{{ item.price }}</text>
				</view>
				<view class="shipping" v-if="item.shipping_desc">{{ item.shipping_desc }}</view>
				<view class="hint">{{ cardHint(item) }}</view>
			</view>
		</view>

		<view class="empty" v-else>
			<text>{{ emptyStateText }}</text>
			<view v-if="loadError" class="empty-action" @tap="refreshProducts">重新加载</view>
		</view>

		<view class="list-status" v-if="products.length > 0">
			<text v-if="loading">加载更多商品中...</text>
			<text v-else-if="finished">已经到底了</text>
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
			loadError: '',
			resources: {
				log: 0,
				cropped_log: 0,
			},
		}
	},
	computed: {
		totalBalance() {
			return Number(this.resources.log || 0) + Number(this.resources.cropped_log || 0)
		},
		isLoggedIn() {
			return !!this.getToken()
		},
		emptyStateText() {
			if (this.loadError) return this.loadError
			return '商品正在补货中...'
		},
	},
	onLoad() {
		this.refreshAll()
	},
	onShow() {
		this.fetchResources()
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
		handleHeaderAction() {
			if (this.isLoggedIn) {
				this.goOrders()
				return
			}
			this.goLogin()
		},
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
			this.loadError = ''
			this.fetchProducts()
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
					this.finished = this.products.length >= this.total
					this.loadError = ''
				} else {
					this.loadError = res.data.msg || '商品加载失败，请下拉重试'
				}
			}).catch(() => {
				this.loadError = '商品加载失败，请下拉重试'
			}).finally(() => {
				this.loading = false
				uni.stopPullDownRefresh()
			})
		},
		showStockWarning(item) {
			return item.type === 'physical' && Number(item.stock) > 0 && Number(item.stock) <= 10
		},
		isSoldOut(item) {
			return item.type === 'physical' && Number(item.stock) <= 0
		},
		cardHint(item) {
			if (this.isSoldOut(item)) return '当前库存已兑完'
			if (item.type === 'physical') return '填写地址后发货'
			return '兑换后自动发放'
		},
		goDetail(item) {
			uni.navigateTo({
				url: `/pages/store/detail?product_id=${item.id}`,
			})
		},
		goOrders() {
			if (!this.isLoggedIn) {
				this.goLogin()
				return
			}
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
	background: linear-gradient(180deg, #fff6f2 0%, #f6f6f6 260rpx);
	padding-bottom: 40rpx;
	&.dark-mode {
		background: #111111;
	}
}

.store-header {
	position: sticky;
	top: 0;
	z-index: 20;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 32rpx 20rpx;
	background: rgba(255, 255, 255, 0.94);
	backdrop-filter: blur(12rpx);
	&.dark-mode {
		background: rgba(0, 0, 0, 0.9);
	}
	.header-title {
		font-size: 38rpx;
		font-weight: 700;
		color: #222222;
	}
	.header-subtitle {
		margin-top: 6rpx;
		font-size: 24rpx;
		color: #8f7c74;
	}
	.header-action {
		font-size: 26rpx;
		color: #ff6a5f;
		padding: 12rpx 20rpx;
		border-radius: 999rpx;
		background: rgba(255, 106, 95, 0.12);
	}
	&.dark-mode {
		.header-title {
			color: #f1f1f1;
		}
		.header-subtitle {
			color: #b8a9a4;
		}
	}
}

.balance-bar {
	margin: 20rpx 24rpx;
	padding: 26rpx 28rpx;
	background: linear-gradient(135deg, #ffffff 0%, #fff1eb 100%);
	border-radius: 24rpx;
	box-shadow: 0 14rpx 40rpx rgba(255, 106, 95, 0.08);
	&.dark-mode {
		background: #000000;
		box-shadow: none;
	}
	.balance-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24rpx;
	}
	.balance-main {
		flex: 1;
		min-width: 0;
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
			font-size: 46rpx;
			font-weight: 700;
			color: #ff6a5f;
		}
	}
	.balance-tip {
		margin-top: 14rpx;
		font-size: 22rpx;
		color: #a8867a;
	}
	.balance-icons {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
		flex-shrink: 0;
	}
	.currency-pill {
		min-width: 180rpx;
		display: flex;
		align-items: center;
		gap: 12rpx;
		padding: 12rpx 16rpx;
		border-radius: 18rpx;
		background: rgba(255, 255, 255, 0.72);
		box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.4);
	}
	.currency-pill.strong {
		background: rgba(255, 106, 95, 0.12);
	}
	.currency-icon {
		width: 44rpx;
		height: 44rpx;
		flex-shrink: 0;
	}
	.currency-copy {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.currency-name {
		font-size: 20rpx;
		line-height: 1.2;
		color: #9a847b;
	}
	.currency-value {
		margin-top: 4rpx;
		font-size: 28rpx;
		font-weight: 700;
		line-height: 1.2;
		color: #2f2f2f;
	}
}

.guest-balance {
	.guest-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #2a2a2a;
	}
	.guest-desc {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #8c7b74;
		line-height: 1.6;
	}
	.guest-btn {
		margin-top: 20rpx;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 14rpx 24rpx;
		border-radius: 999rpx;
		background: #ff6a5f;
		color: #ffffff;
		font-size: 24rpx;
		font-weight: 600;
	}
}

.store-page.dark-mode {
	.balance-bar {
		.currency-pill {
			background: #151515;
			box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.06);
		}
		.currency-pill.strong {
			background: rgba(255, 106, 95, 0.16);
		}
		.currency-name {
			color: #ac958e;
		}
		.currency-value {
			color: #f1f1f1;
		}
	}
}

.tab-bar {
	display: flex;
	padding: 0 20rpx 20rpx;
	gap: 12rpx;
	.tab-item {
		flex: 1;
		text-align: center;
		font-size: 27rpx;
		color: #666666;
		padding: 16rpx 0;
		border-radius: 18rpx;
		background: rgba(255, 255, 255, 0.7);
	}
	.tab-item.active {
		background: #ff6a5f;
		color: #ffffff;
		box-shadow: 0 8rpx 18rpx rgba(255, 106, 95, 0.2);
	}
	&.dark-mode {
		.tab-item {
			background: #1b1b1b;
			color: #d6d6d6;
		}
	}
}

.loading-box,
.empty,
.list-status {
	text-align: center;
	font-size: 26rpx;
	color: #9a9a9a;
}

.loading-box,
.empty {
	margin-top: 120rpx;
}

.empty-action {
	margin: 20rpx auto 0;
	display: inline-flex;
	padding: 12rpx 20rpx;
	border-radius: 999rpx;
	background: rgba(255, 106, 95, 0.1);
	color: #ff6a5f;
}

.product-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 0 24rpx;
}

.product-card {
	width: 48%;
	background: #ffffff;
	border-radius: 22rpx;
	padding: 16rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.06);
	&.dark-mode {
		background: #000000;
	}
	.cover-wrap {
		position: relative;
	}
	.cover {
		width: 100%;
		height: 220rpx;
		border-radius: 16rpx;
		background: #f1f1f1;
	}
	.cover-badge {
		position: absolute;
		right: 12rpx;
		top: 12rpx;
		padding: 6rpx 14rpx;
		border-radius: 999rpx;
		background: rgba(34, 34, 34, 0.78);
		color: #ffffff;
		font-size: 22rpx;
	}
	.title {
		margin-top: 14rpx;
		font-size: 28rpx;
		font-weight: 600;
		color: #333333;
		line-height: 36rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.summary {
		margin-top: 10rpx;
		font-size: 23rpx;
		line-height: 34rpx;
		color: #8a8a8a;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		min-height: 68rpx;
	}
	.tags {
		margin-top: 10rpx;
		display: flex;
		flex-wrap: wrap;
		gap: 8rpx;
		.tag {
			font-size: 22rpx;
			color: #ff6a5f;
			background: rgba(255, 106, 95, 0.1);
			padding: 4rpx 10rpx;
			border-radius: 12rpx;
		}
		.tag.warning {
			color: #ff8a00;
			background: rgba(255, 138, 0, 0.12);
		}
	}
	.price-row {
		margin-top: 14rpx;
		display: flex;
		align-items: center;
		gap: 8rpx;
		.price {
			font-size: 30rpx;
			font-weight: 700;
			color: #ff6a5f;
		}
	}
	.shipping,
	.hint {
		font-size: 22rpx;
		line-height: 32rpx;
	}
	.shipping {
		margin-top: 8rpx;
		color: #8f8f8f;
	}
	.hint {
		margin-top: 6rpx;
		color: #b08d84;
	}
	&.dark-mode {
		.title {
			color: #ededed;
		}
		.summary {
			color: #b8b8b8;
		}
		.shipping {
			color: #a0a0a0;
		}
		.hint {
			color: #b4a39f;
		}
	}
}

.list-status {
	padding: 8rpx 0 20rpx;
}
</style>
