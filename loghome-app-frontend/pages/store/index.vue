<template>
	<view class="store-page" v-dark>
		<view class="store-welcome">
			<view class="welcome-tools">
				<view class="welcome-brand">
					<store-icon name="log" tone="brand" :size="36" />
					<text>{{ $t('store.index.brandTagline') }}</text>
				</view>
				<view class="welcome-actions">
					<button class="header-action" @tap="handleHeaderAction">
						<store-icon :name="isLoggedIn ? 'orders' : 'wallet'" :size="30" />
						<text>{{ isLoggedIn ? $t('store.common.orders') : $t('store.common.login') }}</text>
					</button>
					<button v-if="isLoggedIn" class="header-action" @tap="goAddresses">
						<store-icon name="pin" :size="30" />
						<text>{{ $t('store.index.addresses') }}</text>
					</button>
				</view>
			</view>
			<view class="balance-bar">
				<view class="balance-decoration"><store-icon name="log" :size="156" /></view>
				<template v-if="isLoggedIn">
					<view class="balance-label">
						<store-icon name="wallet" :size="30" />
						<text>{{ $t('store.index.availableBalance') }}</text>
					</view>
					<view class="balance-main">
						<text class="balance-value">{{ totalBalance }}</text>
						<text class="balance-unit">{{ $t('store.common.logUnit') }}</text>
					</view>
					<view class="balance-detail">
						<view>
							<text>{{ $t('store.common.logUnit') }}</text>
							<text class="balance-subvalue">{{ resources.log || 0 }}</text>
						</view>
						<view>
							<text>{{ $t('store.common.croppedLog') }}</text>
							<text class="balance-subvalue">{{ resources.cropped_log || 0 }}</text>
						</view>
					</view>
				</template>
				<view v-else class="guest-balance" @tap="goLogin">
					<view class="balance-label">{{ $t('store.index.guestSlogan') }}</view>
					<view class="guest-title">{{ $t('store.index.guestTitle') }}</view>
					<view class="guest-desc">
						<text>{{ $t('store.index.guestDesc') }}</text>
						<store-icon name="arrow" :size="32" />
					</view>
				</view>
			</view>
		</view>
		<view class="category-panel">
			<scroll-view class="category-scroll" scroll-x>
				<view class="category-list">
					<button
						v-for="category in categories"
						:key="category.value"
						:class="['category-chip', activeCategory === category.value ? 'active' : '']"
						:aria-pressed="activeCategory === category.value"
						@tap="changeCategory(category.value)"
					>
						<view class="category-icon"><store-icon :name="category.icon" :size="44" /></view>
						<text>{{ $t(category.labelKey) }}</text>
					</button>
				</view>
			</scroll-view>
		</view>
		<view class="catalog-heading">
			<view>
				<text class="section-title">{{ $t('store.index.discover') }}</text>
				<text class="catalog-subtitle">{{ $t('store.index.discoverSubtitle') }}</text>
			</view>
			<text class="catalog-count">{{ $t('store.index.itemCount', { count: total }) }}</text>
		</view>
		<view class="tab-bar">
			<view
				v-for="(tab, index) in tabs"
				:key="tab.value"
				:class="['tab-item', activeTab === index ? 'active' : '']"
				@tap="changeTab(index)"
			>
				{{ $t(tab.labelKey) }}
			</view>
		</view>
		<view v-if="loading && products.length === 0" class="loading-box">
			<view class="skeleton-grid">
				<view v-for="n in 4" :key="n" class="skeleton-card">
					<view class="skeleton-cover" />
					<view class="skeleton-line" />
					<view class="skeleton-line short" />
				</view>
			</view>
		</view>
		<view class="product-grid" v-else-if="products.length > 0">
			<view class="product-card" v-for="item in products" :key="item.id" @tap="goDetail(item)">
				<view class="cover-wrap">
					<image
						v-if="item.cover_url"
						class="cover"
						:src="item.cover_url"
						mode="aspectFit"
						lazy-load
					/>
					<view v-else class="cover empty-cover">
						<store-icon name="package" :size="72" tone="muted" />
						<text>{{ $t('store.common.logGoods') }}</text>
					</view>
					<view class="cover-badge" v-if="isSoldOut(item)">{{ $t('store.index.soldOutBadge') }}</view>
					<view class="cover-category" v-else>
						{{ item.category || (item.type === 'physical' ? $t('store.common.physicalCategory') : $t('store.common.virtualCategory')) }}
					</view>
				</view>
				<view class="product-copy">
					<view class="title">{{ item.title }}</view>
					<view class="summary" v-if="item.summary">{{ item.summary }}</view>
					<view class="price-row">
						<text class="price">{{ item.price }}</text>
						<text class="currency-unit">{{ item.has_variants ? $t('store.common.logFrom') : $t('store.common.logUnit') }}</text>
					</view>
					<view class="card-bottom">
						<text class="hint">
							{{ showStockWarning(item) ? $t('store.index.stockLeft', { count: item.stock }) : cardHint(item) }}
						</text>
						<view class="card-arrow"><store-icon name="arrow" :size="26" /></view>
					</view>
				</view>
			</view>
		</view>
		<view class="empty" v-else>
			<view class="empty-icon"><store-icon name="package" :size="72" tone="muted" /></view>
			<text>{{ emptyStateText }}</text>
			<view v-if="loadError" class="empty-action" @tap="refreshProducts">{{ $t('store.common.reload') }}</view>
		</view>
		<view class="list-status" v-if="products.length > 0">
			<text v-if="loading">{{ $t('store.index.loadingMore') }}</text>
			<view v-else-if="loadError">
				<text>{{ loadError }}</text>
				<view class="empty-action" @tap="fetchProducts(page + 1)">{{ $t('store.index.retryLoad') }}</view>
			</view>
			<text v-else-if="finished">{{ $t('store.index.allLoaded') }}</text>
		</view>
	</view>
</template>

<script>
import axios from 'axios'
import darkModeMixin from '@/mixins/dark-mode.js'
import StoreIcon from '@/components/StoreIcon.vue'

export default {
	mixins: [darkModeMixin],
	components: { StoreIcon },
	data() {
		return {
			authToken: null,
			tabs: [
				{ labelKey: 'store.index.tabAll', value: 'all' },
				{ labelKey: 'store.index.tabVirtual', value: 'virtual' },
				{ labelKey: 'store.index.tabPhysical', value: 'physical' },
			],
			activeTab: 0,
			activeCategory: '',
			categories: [
				{ labelKey: 'store.index.categoryAll', value: '', icon: 'grid' },
				{ labelKey: 'store.index.categoryMinecraft', value: 'Minecraft', icon: 'cube' },
				{ labelKey: 'store.index.categoryWriting', value: '写作', icon: 'pen' },
			],
			requestVersion: 0,
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
			return !!this.authToken
		},
		emptyStateText() {
			if (this.loadError) return this.loadError
			return this.activeCategory || this.activeTab
				? this.$t('store.index.emptyFiltered')
				: this.$t('store.index.emptyAll')
		},
	},
	onLoad() {
		this.authToken = this.getToken()
		this.refreshAll()
	},
	onShow() {
		this.authToken = this.getToken()
		this.fetchResources()
	},
	onPullDownRefresh() {
		this.refreshAll()
	},
	onReachBottom() {
		if (this.finished || this.loading) return
		this.fetchProducts(this.page + 1)
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
		changeCategory(value) {
			if (this.activeCategory === value) return
			this.activeCategory = value
			this.refreshProducts()
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
			this.requestVersion += 1
			this.loading = false
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
		fetchProducts(page = this.page) {
			if (this.loading) return
			this.loading = true
			const type = this.tabs[this.activeTab].value
			const version = this.requestVersion
			axios
				.get(this.$baseUrl + '/store/products', {
					params: {
						type,
						page,
						category: this.activeCategory || undefined,
						pageSize: this.pageSize,
					},
				})
				.then((res) => {
					if (version !== this.requestVersion) return
					if (res.data && res.data.code === 200) {
						const list = res.data.data.list || []
						this.total = res.data.data.total || 0
						this.products = this.products.concat(list)
						this.page = page
						this.finished = this.products.length >= this.total
						this.loadError = ''
					} else {
						this.loadError = res.data.msg || this.$t('store.index.loadFailed')
					}
				})
				.catch(() => {
					if (version !== this.requestVersion) return
					this.loadError = this.$t('store.index.loadFailed')
				})
				.finally(() => {
					if (version !== this.requestVersion) return
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
			if (this.isSoldOut(item)) return this.$t('store.index.hintSoldOut')
			if (item.type === 'physical') {
				return item.has_variants
					? this.$t('store.index.hintMultiVariant')
					: this.$t('store.index.hintPhysical')
			}
			return this.$t('store.index.hintAutoDeliver')
		},
		goDetail(item) {
			uni.navigateTo({
				url: `/pages/store/detail?product_id=${item.id}`,
			})
		},
		goAddresses() {
			uni.navigateTo({ url: '/pages/store/address_list' })
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
@import '../../styles/store.scss';
.store-welcome {
	padding: 20rpx 28rpx 0;
}
.welcome-tools,
.welcome-actions,
.welcome-brand {
	display: flex;
	align-items: center;
}
.welcome-tools {
	justify-content: space-between;
	margin-bottom: 16rpx;
	gap: 16rpx;
}
.welcome-brand {
	gap: 12rpx;
	font-size: 25rpx;
	font-weight: 600;
	letter-spacing: 1rpx;
}
.welcome-actions {
	gap: 10rpx;
}
.header-action {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin: 0;
	padding: 12rpx 16rpx;
	min-height: 72rpx;
	border: 1rpx solid var(--store-line);
	border-radius: 999rpx;
	background: var(--store-surface);
	color: var(--store-text);
	font-size: 23rpx;
	line-height: 1.4;
}
.balance-bar {
	position: relative;
	overflow: hidden;
	padding: 24rpx 30rpx 20rpx;
	color: #fff;
	background: linear-gradient(115deg, #264d3c, #345c4a);
	border-radius: 24rpx;
	box-shadow: 0 10rpx 24rpx rgba(38, 77, 60, 0.12);
}
.dark-mode .balance-bar {
	background: linear-gradient(115deg, #284a39, #385b47);
	box-shadow: none;
}
.balance-decoration {
	position: absolute;
	right: 24rpx;
	top: 18rpx;
	color: #fff;
	opacity: 0.075;
	transform: rotate(-12deg);
	pointer-events: none;
}
.balance-label {
	display: flex;
	align-items: center;
	gap: 10rpx;
	color: #d2dfd6;
	font-size: 23rpx;
	position: relative;
}
.balance-main {
	display: flex;
	align-items: baseline;
	gap: 14rpx;
	margin-top: 6rpx;
	position: relative;
}
.balance-value {
	font-size: 60rpx;
	font-weight: 650;
	line-height: 1.2;
	letter-spacing: -1rpx;
	font-variant-numeric: tabular-nums;
}
.balance-unit {
	font-size: 23rpx;
	color: #d2dfd6;
}
.balance-detail {
	display: flex;
	gap: 32rpx;
	border-top: 1rpx solid rgba(255, 255, 255, 0.14);
	padding-top: 16rpx;
	margin-top: 18rpx;
	position: relative;
}
.balance-detail > view {
	display: flex;
	align-items: baseline;
	gap: 14rpx;
	color: #c8d8cf;
	font-size: 22rpx;
}
.balance-subvalue {
	color: #fff;
	font-size: 25rpx;
	font-weight: 550;
}
.guest-title {
	margin: 10rpx 0 18rpx;
	font-size: 38rpx;
	font-weight: 600;
	letter-spacing: 1rpx;
}
.guest-desc {
	display: flex;
	align-items: center;
	gap: 16rpx;
	font-size: 23rpx;
	color: #dae5de;
}
.category-panel {
	padding: 0 28rpx;
}
// uni-app's inner scroll containers need a bounded height.
.category-scroll {
	width: 100%;
	height: 160rpx;
	max-height: 160rpx;
	white-space: nowrap;
}
.category-list {
	height: 160rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
	gap: 20rpx;
}
.category-chip {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10rpx;
	min-width: 136rpx;
	padding: 8rpx;
	margin: 0;
	border: 0;
	border-radius: 0;
	background: transparent;
	color: var(--store-muted);
	font-size: 23rpx;
	line-height: 1.4;
}
.category-icon {
	width: 68rpx;
	height: 68rpx;
	border-radius: 20rpx;
	background: var(--store-surface);
	border: 1rpx solid var(--store-line);
	color: var(--store-muted);
	display: flex;
	align-items: center;
	justify-content: center;
}
.category-chip.active {
	color: var(--store-primary);
	font-weight: 600;
}
.category-chip.active .category-icon {
	color: var(--store-primary);
	background: var(--store-primary-soft);
	border-color: var(--store-primary-soft);
}
.catalog-heading {
	padding: 8rpx 28rpx 16rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16rpx;
}
.catalog-heading > view {
	display: flex;
	align-items: baseline;
	gap: 16rpx;
}
.catalog-heading .section-title {
	font-size: 32rpx;
	margin: 0;
	letter-spacing: 0.5rpx;
}
.catalog-subtitle,
.catalog-count {
	color: var(--store-muted);
	font-size: 21rpx;
}
.tab-bar {
	padding: 0 28rpx 20rpx;
	gap: 14rpx;
}
.tab-item {
	flex: none;
	padding: 10rpx 24rpx;
	min-height: 60rpx;
	border-radius: 999rpx;
	font-size: 23rpx;
	background: var(--store-surface);
	border: 1rpx solid var(--store-line);
}
.tab-item.active {
	background: var(--store-primary);
	color: var(--store-on-primary);
	border-color: var(--store-primary);
	font-weight: 500;
}
.product-grid,
.skeleton-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	padding: 0 28rpx;
	gap: 20rpx;
}
.product-card {
	min-width: 0;
	overflow: hidden;
	background: var(--store-surface);
	border: 1rpx solid var(--store-line);
	border-radius: 24rpx;
	box-shadow: var(--store-shadow);
}
.cover-wrap {
	position: relative;
	background: #fff;
	border-bottom: 1rpx solid var(--store-line);
}
.cover {
	display: block;
	width: 100%;
	height: 336rpx;
}
.empty-cover {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 18rpx;
	color: var(--store-muted);
	background: var(--store-soft);
	font-size: 23rpx;
}
.cover-category,
.cover-badge {
	position: absolute;
	top: 16rpx;
	left: 16rpx;
	padding: 5rpx 12rpx;
	font-size: 19rpx;
	border-radius: 8rpx;
	background: rgba(255, 255, 255, 0.92);
	color: #465246;
	border: 1rpx solid rgba(70, 82, 70, 0.06);
}
.cover-badge {
	background: rgba(44, 49, 44, 0.82);
	color: #fff;
}
.product-copy {
	padding: 18rpx 20rpx 16rpx;
}
.title {
	font-size: 26rpx;
	font-weight: 550;
	line-height: 1.5;
	min-height: 78rpx;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
.summary {
	font-size: 22rpx;
	color: var(--store-muted);
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	margin-top: 8rpx;
}
.price-row {
	gap: 0;
	flex-wrap: wrap;
	margin-top: 16rpx;
}
.price {
	font-size: 35rpx;
	font-weight: 650;
}
.currency-unit {
	font-size: 20rpx;
}
.card-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8rpx;
	margin-top: 12rpx;
}
.hint {
	font-size: 20rpx;
	color: var(--store-muted);
}
.card-arrow {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 42rpx;
	height: 42rpx;
	border-radius: 50%;
	color: var(--store-primary);
	background: var(--store-primary-soft);
}
.empty-icon {
	margin-bottom: 24rpx;
}
.loading-box {
	margin-top: 0;
}
.skeleton-card {
	background: var(--store-surface);
	border-radius: 24rpx;
	overflow: hidden;
	padding-bottom: 24rpx;
}
.skeleton-cover {
	height: 336rpx;
	background: var(--store-soft);
}
.skeleton-line {
	height: 24rpx;
	margin: 20rpx;
	background: var(--store-soft);
	border-radius: 8rpx;
}
.skeleton-line.short {
	width: 45%;
}
@media (min-width: 768px) {
	.product-grid,
	.skeleton-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.cover {
		height: 360rpx;
	}
}
@media (min-width: 1024px) {
	.product-grid,
	.skeleton-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}
</style>
