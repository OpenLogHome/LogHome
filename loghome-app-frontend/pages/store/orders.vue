<template>
	<view class="orders-page" v-dark>
		<view class="page-intro">
			<!-- <view class="page-title">我的订单</view>
			<view class="page-caption">每一次热爱的兑换，都在这里。</view> -->
		</view>
		<view v-if="!isLoggedIn" class="page-state">
			<text>登录后即可查看兑换记录与物流状态</text>
			<view class="state-action" @tap="goLogin">去登录</view>
		</view>

		<template v-else>
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

			<view v-if="loading && orders.length === 0" class="page-state">
				<text>正在加载订单...</text>
			</view>

			<view v-else-if="fetchError" class="page-state">
				<text>{{ fetchError }}</text>
				<view class="state-action" @tap="refreshOrders">重新加载</view>
			</view>

			<template v-else>
				<view class="order-card" v-for="item in orders" :key="item.id">
					<view class="order-header">
						<text class="time">{{ formatTime(item.created_at) }}</text>
						<view class="status" :class="statusClass(item.status)">
							<store-icon
								:name="
									item.status === 'completed'
										? 'check-circle'
										: item.status === 'shipped'
										? 'package'
										: 'clock'
								"
								:size="28"
							/>
							<text>{{ statusText(item.status) }}</text>
						</view>
					</view>

					<view class="order-body">
						<image class="cover" :src="item.product_cover" mode="aspectFill"></image>
						<view class="info">
							<view class="title">{{ item.product_title }}</view>
							<view v-if="item.variant_label" class="variant-label">{{ item.variant_label }}</view>
							<view class="hint">{{ statusHint(item) }}</view>
							<view
								class="code-preview"
								v-if="item.product_type === 'virtual' && item.tracking_number"
							>
								兑换码：{{ item.tracking_number }}
							</view>
						</view>
					</view>

					<view class="address" v-if="item.product_type === 'physical'">
						<text>{{ item.receiver_name }} {{ item.receiver_phone }}</text>
						<text>{{ formatAddress(item) }}</text>
					</view>

					<view class="order-footer">
						<view class="amount">
							<view class="price-row">
								<text>合计</text>
								<text class="order-price">
									{{ item.price }}
									<text class="currency-unit">原木</text>
								</text>
							</view>
							<text class="detail" v-if="item.pay_log !== undefined">
								原木 {{ item.pay_log }} · 去皮原木 {{ item.pay_cropped_log }}
							</text>
						</view>

						<view class="actions">
							<view
								v-if="item.product_type === 'virtual' && item.status === 'completed'"
								class="btn"
								@tap="copyCode(item)"
							>
								复制兑换码
							</view>
							<view
								v-if="item.product_type === 'physical' && item.status === 'pending'"
								class="btn disabled"
							>
								等待发货
							</view>
							<view
								v-if="item.product_type === 'physical' && ['shipped', 'completed'].includes(item.status)"
								class="shipping-actions"
							>
								<view class="tracking">{{ item.shipping_company || '快递' }}：{{ item.tracking_number || '-' }}</view>
								<view class="btn" @tap="viewLogistics(item)">查看物流</view>
								<view class="btn" @tap="copyTracking(item)">复制单号</view>
								<view
									v-if="item.status === 'shipped'"
									:class="['btn', 'primary', confirmingOrderId === item.id ? 'disabled' : '']"
									@tap="confirmReceipt(item)"
								>
									{{ confirmingOrderId === item.id ? '确认中...' : '确认收货' }}
								</view>
							</view>
							<view
								v-if="item.product_type === 'physical' && item.status === 'completed'"
								class="btn disabled"
							>
								已完成
							</view>
						</view>
					</view>
				</view>

				<view class="empty" v-if="!loading && orders.length === 0">
					<text>{{ emptyText }}</text>
					<view class="state-action" @tap="goShopping">去商城逛逛</view>
				</view>

				<view class="list-status" v-if="orders.length > 0">
					<text v-if="loading">加载更多订单中...</text>
					<text v-else-if="finished">没有更多订单了</text>
				</view>
			</template>
		</template>
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
				{ label: '全部订单', value: 'all' },
				{ label: '待发货', value: 'pending' },
				{ label: '发货 / 完成', value: 'shipped' },
			],
			activeTab: 0,
			page: 1,
			pageSize: 10,
			total: 0,
			orders: [],
			loading: false,
			finished: false,
			fetchError: '',
			confirmingOrderId: null,
		}
	},
	computed: {
		isLoggedIn() {
			return !!this.authToken
		},
		emptyText() {
			if (this.activeTab === 1) return '当前没有待发货或处理中订单'
			if (this.activeTab === 2) return '当前没有已发货或已完成订单'
			return '还没有兑换记录'
		},
	},
	onLoad() {
		this.authToken = this.getToken()
		if (this.isLoggedIn) {
			this.refreshOrders()
		}
	},
	onShow() {
		this.authToken = this.getToken()
		if (this.isLoggedIn && this.orders.length === 0 && !this.loading) {
			this.refreshOrders()
		}
	},
	onPullDownRefresh() {
		if (!this.isLoggedIn) {
			uni.stopPullDownRefresh()
			return
		}
		this.refreshOrders()
	},
	onReachBottom() {
		if (this.finished || this.loading || !this.isLoggedIn) return
		this.page += 1
		this.fetchOrders()
	},
	methods: {
		goShopping() {
			uni.navigateTo({ url: '/pages/store/index' })
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
		changeTab(index) {
			if (this.activeTab === index) return
			this.activeTab = index
			this.refreshOrders()
		},
		refreshOrders() {
			this.page = 1
			this.orders = []
			this.finished = false
			this.fetchError = ''
			this.fetchOrders()
		},
		fetchOrders() {
			const tk = this.getToken()
			if (!tk || this.loading) return
			this.loading = true
			axios
				.get(this.$baseUrl + '/store/orders', {
					params: {
						status: this.tabs[this.activeTab].value,
						page: this.page,
						pageSize: this.pageSize,
					},
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + tk,
					},
				})
				.then((res) => {
					if (res.data && res.data.code === 200) {
						const list = res.data.data.list || []
						this.total = res.data.data.total || 0
						this.orders = this.orders.concat(list)
						this.finished = this.orders.length >= this.total
						this.fetchError = ''
					} else {
						this.fetchError = res.data.msg || '订单加载失败，请稍后重试'
					}
				})
				.catch((error) => {
					this.fetchError = error.response?.data?.msg || '订单加载失败，请稍后重试'
				})
				.finally(() => {
					this.loading = false
					uni.stopPullDownRefresh()
				})
		},
		statusText(status) {
			if (status === 'pending') return '待发货'
			if (status === 'shipped') return '已发货'
			if (status === 'completed') return '已完成'
			if (status === 'canceled' || status === 'cancelled') return '已取消'
			return status
		},
		statusClass(status) {
			if (status === 'pending') return 'pending'
			if (status === 'shipped') return 'shipped'
			if (status === 'completed') return 'completed'
			if (status === 'canceled' || status === 'cancelled') return 'canceled'
			return ''
		},
		statusHint(item) {
			if (item.product_type === 'virtual') {
				return item.status === 'completed' ? '权益已自动发放，可直接复制兑换码' : '处理中'
			}
			if (item.status === 'pending') return item.shipping_desc || '商家正在准备发货'
			if (item.status === 'shipped') return '商品已发出，请留意物流动态'
			if (item.status === 'completed') return '订单已完成，感谢支持'
			return '订单状态已更新'
		},
		formatAddress(item) {
			return [
				item.receiver_province || '',
				item.receiver_city || '',
				item.receiver_district || '',
				item.receiver_detail || '',
			].join('')
		},
		copyCode(item) {
			if (!item.tracking_number) {
				uni.showToast({ title: '暂无兑换码', icon: 'none' })
				return
			}
			uni.setClipboardData({
				data: item.tracking_number,
				success: () => {
					uni.showToast({ title: '已复制', icon: 'success' })
				},
			})
		},
		viewLogistics(item) {
			uni.navigateTo({url: '/pages/store/logistics?order_id=' + item.id})
		},
		copyTracking(item) {
			if (!item.tracking_number) {
				uni.showToast({ title: '暂无单号', icon: 'none' })
				return
			}
			uni.setClipboardData({
				data: item.tracking_number,
				success: () => {
					uni.showToast({ title: '已复制', icon: 'success' })
				},
			})
		},
		confirmReceipt(item) {
			if (this.confirmingOrderId === item.id) return
			const tk = this.getToken()
			if (!tk) {
				this.goLogin()
				return
			}
			uni.showModal({
				title: '确认收货',
				content: '确认已收到商品吗？',
				success: (result) => {
					if (!result.confirm) return
					this.confirmingOrderId = item.id
					axios
						.post(
							this.$baseUrl + `/store/orders/${item.id}/confirm`,
							{},
							{
								headers: {
									'Content-Type': 'application/json',
									Authorization: 'Bearer ' + tk,
								},
							}
						)
						.then((res) => {
							if (res.data && res.data.code === 200) {
								uni.showToast({ title: '已确认', icon: 'success' })
								this.refreshOrders()
							} else {
								uni.showToast({ title: res.data.msg || '操作失败', icon: 'none' })
							}
						})
						.catch((error) => {
							uni.showToast({ title: error.response?.data?.msg || '操作失败', icon: 'none' })
						})
						.finally(() => {
							this.confirmingOrderId = null
						})
				},
			})
		},
		formatTime(time) {
			if (!time) return '-'
			const date = new Date(time)
			const y = date.getFullYear()
			const m = String(date.getMonth() + 1).padStart(2, '0')
			const d = String(date.getDate()).padStart(2, '0')
			const h = String(date.getHours()).padStart(2, '0')
			const mm = String(date.getMinutes()).padStart(2, '0')
			return `${y}-${m}-${d} ${h}:${mm}`
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../styles/store.scss';
.order-card {
	margin: 0 32rpx 24rpx;
	padding: 28rpx;
	background: var(--store-surface);
	border: 1rpx solid var(--store-line);
	border-radius: 22rpx;
}
.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid var(--store-line);
}
.time {
	font-size: 23rpx;
	color: var(--store-muted);
}
.status {
	color: var(--store-accent);
	font-size: 23rpx;
	font-weight: 600;
	background: var(--store-accent-soft);
	padding: 6rpx 14rpx;
	border-radius: 8rpx;
}
.status.completed {
	color: var(--store-success);
	background: var(--store-soft);
}
.status.canceled {
	color: var(--store-muted);
	background: var(--store-soft);
}
.order-body {
	display: flex;
	gap: 24rpx;
	margin-top: 24rpx;
	align-items: flex-start;
}
.cover {
	width: 144rpx;
	height: 144rpx;
	border-radius: 14rpx;
	background: #fff;
	flex-shrink: 0;
}
.info {
	flex: 1;
	min-width: 0;
}
.title {
	font-size: 28rpx;
	font-weight: 600;
	line-height: 1.5;
}
.variant-label {
	display: inline-block;
	margin-top: 10rpx;
	font-size: 23rpx;
	color: var(--store-muted);
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
	background: var(--store-soft);
}
.hint {
	margin-top: 12rpx;
	color: var(--store-muted);
	font-size: 23rpx;
}
.code-preview {
	font-size: 23rpx;
	overflow-wrap: anywhere;
	margin-top: 12rpx;
	color: var(--store-accent);
}
.address {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	padding: 18rpx 20rpx;
	margin-top: 24rpx;
	background: var(--store-soft);
	border-radius: 12rpx;
	color: var(--store-muted);
	font-size: 23rpx;
	overflow-wrap: anywhere;
}
.order-footer {
	margin-top: 24rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid var(--store-line);
}
.price-row {
	justify-content: flex-end;
	font-size: 24rpx;
}
.order-price {
	font-size: 33rpx;
	font-weight: 650;
}
.detail {
	display: block;
	text-align: right;
	margin-top: 6rpx;
	color: var(--store-muted);
	font-size: 22rpx;
}
.actions {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	gap: 14rpx;
	margin-top: 20rpx;
}
.btn {
	min-height: 80rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 14rpx 24rpx;
	border: 1rpx solid var(--store-line);
	border-radius: 14rpx;
	font-size: 25rpx;
	color: var(--store-text);
}
.btn.primary {
	background: var(--store-primary);
	color: var(--store-on-primary);
	border-color: var(--store-primary);
}
.btn.disabled {
	background: var(--store-soft);
	color: var(--store-muted);
}
.shipping-actions {
	display: flex;
	gap: 12rpx;
	flex-wrap: wrap;
	justify-content: flex-end;
}
.tracking {
	width: 100%;
	color: var(--store-muted);
	font-size: 23rpx;
	overflow-wrap: anywhere;
	text-align: right;
}
.status {
	display: flex;
	align-items: center;
	gap: 8rpx;
}
.order-card {
	box-shadow: var(--store-shadow);
}
</style>
