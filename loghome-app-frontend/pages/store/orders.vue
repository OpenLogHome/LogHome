<template>
	<view class="orders-page" v-dark>
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
						<text class="status" :class="statusClass(item.status)">{{ statusText(item.status) }}</text>
					</view>

					<view class="order-body">
						<image class="cover" :src="item.product_cover" mode="aspectFill"></image>
						<view class="info">
							<view class="title">{{ item.product_title }}</view>
							<view class="hint">{{ statusHint(item) }}</view>
							<view class="code-preview" v-if="item.product_type === 'virtual' && item.tracking_number">
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
								<image src="../../static/resources/cropped_log.webp" mode="aspectFit" style="width: 32rpx; height: 32rpx;"></image>
								<image src="../../static/resources/log.png" mode="aspectFit" style="width: 32rpx; height: 32rpx;"></image>
								<text>{{ item.price }}</text>
							</view>
							<text class="detail" v-if="item.pay_log !== undefined">
								原木 -{{ item.pay_log }} 去皮 -{{ item.pay_cropped_log }}
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
								v-if="item.product_type === 'physical' && item.status === 'shipped'"
								class="shipping-actions"
							>
								<view class="tracking">单号：{{ item.tracking_number || '-' }}</view>
								<view class="btn" @tap="copyTracking(item)">复制单号</view>
								<view
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

export default {
	mixins: [darkModeMixin],
	data() {
		return {
			tabs: [
				{ label: '全部', value: 'all' },
				{ label: '待发货/处理中', value: 'pending' },
				{ label: '已发货/已完成', value: 'shipped' },
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
			return !!this.getToken()
		},
		emptyText() {
			if (this.activeTab === 1) return '当前没有待发货或处理中订单'
			if (this.activeTab === 2) return '当前没有已发货或已完成订单'
			return '还没有兑换记录'
		},
	},
	onLoad() {
		if (this.isLoggedIn) {
			this.refreshOrders()
		}
	},
	onShow() {
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
			axios.get(this.$baseUrl + '/store/orders', {
				params: {
					status: this.tabs[this.activeTab].value,
					page: this.page,
					pageSize: this.pageSize,
				},
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then((res) => {
				if (res.data && res.data.code === 200) {
					const list = res.data.data.list || []
					this.total = res.data.data.total || 0
					this.orders = this.orders.concat(list)
					this.finished = this.orders.length >= this.total
					this.fetchError = ''
				} else {
					this.fetchError = res.data.msg || '订单加载失败，请稍后重试'
				}
			}).catch((error) => {
				this.fetchError = error.response?.data?.msg || '订单加载失败，请稍后重试'
			}).finally(() => {
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
					axios.post(this.$baseUrl + `/store/orders/${item.id}/confirm`, {}, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk,
						},
					}).then((res) => {
						if (res.data && res.data.code === 200) {
							uni.showToast({ title: '已确认', icon: 'success' })
							this.refreshOrders()
						} else {
							uni.showToast({ title: res.data.msg || '操作失败', icon: 'none' })
						}
					}).catch((error) => {
						uni.showToast({ title: error.response?.data?.msg || '操作失败', icon: 'none' })
					}).finally(() => {
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
.orders-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #fff8f4 0%, #f6f6f6 240rpx);
	padding: 20rpx 20rpx 40rpx;
	&.dark-mode {
		background: #111111;
	}
}

.page-state,
.empty,
.list-status {
	text-align: center;
	font-size: 26rpx;
	color: #9a9a9a;
}

.page-state,
.empty {
	margin-top: 140rpx;
}

.state-action {
	margin: 20rpx auto 0;
	display: inline-flex;
	padding: 12rpx 20rpx;
	border-radius: 999rpx;
	background: rgba(255, 106, 95, 0.1);
	color: #ff6a5f;
}

.tab-bar {
	display: flex;
	gap: 12rpx;
	margin-bottom: 20rpx;
	.tab-item {
		flex: 1;
		text-align: center;
		font-size: 28rpx;
		color: #666666;
		padding: 14rpx 20rpx;
		border-radius: 18rpx;
		background: rgba(255, 255, 255, 0.8);
	}
	.tab-item.active {
		background: #ff6a5f;
		color: #ffffff;
	}
	&.dark-mode {
		.tab-item {
			background: #1b1b1b;
			color: #d2d2d2;
		}
	}
}

.order-card {
	background: #ffffff;
	border-radius: 22rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 8rpx 26rpx rgba(0, 0, 0, 0.05);
	&.dark-mode {
		background: #000000;
		box-shadow: none;
	}
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 24rpx;
	color: #999999;
	margin-bottom: 14rpx;
	.status {
		padding: 6rpx 14rpx;
		border-radius: 999rpx;
		font-weight: 600;
	}
	.status.pending {
		color: #ff8a00;
		background: rgba(255, 138, 0, 0.12);
	}
	.status.shipped {
		color: #2d8cf0;
		background: rgba(45, 140, 240, 0.12);
	}
	.status.completed {
		color: #3a8c34;
		background: rgba(58, 140, 52, 0.12);
	}
	.status.canceled {
		color: #9f9f9f;
		background: rgba(160, 160, 160, 0.12);
	}
}

.order-body {
	display: flex;
	align-items: center;
	.cover {
		width: 110rpx;
		height: 110rpx;
		border-radius: 16rpx;
		margin-right: 18rpx;
		background: #f1f1f1;
	}
	.info {
		flex: 1;
		min-width: 0;
	}
	.title {
		font-size: 28rpx;
		color: #333333;
		font-weight: 600;
		line-height: 1.5;
	}
	.hint,
	.code-preview {
		margin-top: 8rpx;
		font-size: 23rpx;
		line-height: 1.6;
	}
	.hint {
		color: #888888;
	}
	.code-preview {
		color: #ff6a5f;
		word-break: break-all;
	}
}

.address {
	margin-top: 14rpx;
	padding: 16rpx;
	border-radius: 16rpx;
	background: #f8f8f8;
	font-size: 24rpx;
	color: #777777;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.order-footer {
	margin-top: 16rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 20rpx;
}

.amount {
	font-size: 24rpx;
	color: #555555;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	.price-row {
		display: flex;
		align-items: center;
		gap: 6rpx;
		text:last-child {
			font-size: 26rpx;
			color: #ff6a5f;
			font-weight: 600;
		}
	}
	.detail {
		color: #999999;
		font-size: 22rpx;
	}
}

.actions {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	align-items: flex-end;
}

.btn {
	padding: 8rpx 18rpx;
	border-radius: 999rpx;
	font-size: 24rpx;
	color: #ff6a5f;
	border: 1rpx solid #ff6a5f;
}

.btn.primary {
	background: #ff6a5f;
	color: #ffffff;
}

.btn.disabled {
	color: #999999;
	border-color: #d7d7d7;
	background: transparent;
}

.shipping-actions {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 10rpx;
}

.tracking {
	font-size: 22rpx;
	color: #777777;
	word-break: break-all;
	text-align: right;
}

.list-status {
	padding-bottom: 16rpx;
}

.orders-page.dark-mode {
	.order-body .title,
	.amount {
		color: #ededed;
	}
	.order-body .hint,
	.address,
	.amount .detail,
	.tracking {
		color: #b9b9b9;
	}
	.address {
		background: #151515;
	}
}
</style>
