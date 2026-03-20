<template>
	<view class="orders-page" v-dark>
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
		<view class="order-card" v-for="item in orders" :key="item.id">
			<view class="order-header">
				<text class="time">{{ formatTime(item.created_at) }}</text>
				<text class="status" :class="statusClass(item.status)">{{ statusText(item) }}</text>
			</view>
			<view class="order-body">
				<image class="cover" :src="item.product_cover" mode="aspectFill"></image>
				<view class="info">
					<view class="title">{{ item.product_title }}</view>
					<view class="shipping" v-if="item.product_type === 'physical' && item.status === 'pending'">
						{{ item.shipping_desc }}
					</view>
				</view>
			</view>
			<view class="address" v-if="item.product_type === 'physical'">
				<text>{{ item.receiver_name }} {{ item.receiver_phone }}</text>
				<text>{{ item.receiver_province }}{{ item.receiver_city }}{{ item.receiver_district }}{{ item.receiver_detail }}</text>
			</view>
			<view class="order-footer">
				<view class="amount">
					<view class="price-row">
						<text>合计：</text>
						<image src="../../static/resources/cropped_log.webp" mode="aspectFit" style="width: 32rpx; height: 32rpx;"></image>
						<image src="../../static/resources/log.png" mode="aspectFit" style="width: 32rpx; height: 32rpx;"></image>
						<text>{{ item.price }}</text>
					</view>
					<text class="detail" v-if="item.pay_log !== undefined">
						原木-{{ item.pay_log }} 去皮-{{ item.pay_cropped_log }}
					</text>
				</view>
				<view class="actions">
					<view v-if="item.product_type === 'virtual' && item.status === 'completed'" class="btn" @tap="copyCode(item)">
						复制兑换码
					</view>
					<view v-if="item.product_type === 'physical' && item.status === 'pending'" class="btn disabled">
						等待发货
					</view>
					<view v-if="item.product_type === 'physical' && item.status === 'shipped'" class="shipping-actions">
						<view class="tracking">
							单号：{{ item.tracking_number || '-' }}
						</view>
						<view class="btn" @tap="copyTracking(item)">复制单号</view>
						<view class="btn primary" @tap="confirmReceipt(item)">确认收货</view>
					</view>
					<view v-if="item.product_type === 'physical' && item.status === 'completed'" class="btn disabled">
						已完成
					</view>
				</view>
			</view>
		</view>
		<view class="empty" v-if="!loading && orders.length === 0">
			<text>暂无订单</text>
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
		}
	},
	onLoad() {
		this.refreshOrders()
	},
	onPullDownRefresh() {
		this.refreshOrders()
	},
	onReachBottom() {
		if (this.finished || this.loading) return
		this.page += 1
		this.fetchOrders()
	},
	methods: {
		getToken() {
			let tk = JSON.parse(window.localStorage.getItem('token'))
			if (tk) tk = tk.tk
			return tk
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
			this.fetchOrders()
		},
		fetchOrders() {
			const tk = this.getToken()
			if (!tk) return
			if (this.loading) return
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
					if (this.orders.length >= this.total) {
						this.finished = true
					}
				}
			}).finally(() => {
				this.loading = false
				uni.stopPullDownRefresh()
			})
		},
		statusText(item) {
			if (item.status === 'pending') return '待发货'
			if (item.status === 'shipped') return '已发货'
			if (item.status === 'completed') return '已完成'
			if (item.status === 'canceled') return '已取消'
			return item.status
		},
		statusClass(status) {
			if (status === 'pending') return 'pending'
			if (status === 'shipped') return 'shipped'
			if (status === 'completed') return 'completed'
			return ''
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
			const tk = this.getToken()
			if (!tk) return
			uni.showModal({
				title: '确认收货',
				content: '确认已收到商品吗？',
				success: (res) => {
					if (!res.confirm) return
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
					})
				},
			})
		},
		formatTime(time) {
			if (!time) return ''
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
	background-color: #f6f6f6;
	padding: 20rpx 20rpx 40rpx;
	&.dark-mode {
		background-color: #111111;
	}
}

.tab-bar {
	display: flex;
	justify-content: space-around;
	margin-bottom: 20rpx;
	.tab-item {
		font-size: 28rpx;
		color: #666666;
		padding: 10rpx 20rpx;
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

.order-card {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	&.dark-mode {
		background-color: #000000;
	}
	.order-header {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999999;
		margin-bottom: 12rpx;
		.status {
			font-weight: 600;
		}
		.status.pending {
			color: #ff8a00;
		}
		.status.shipped {
			color: #2d8cf0;
		}
		.status.completed {
			color: #3a8c34;
		}
	}
	.order-body {
		display: flex;
		align-items: center;
		.cover {
			width: 100rpx;
			height: 100rpx;
			border-radius: 12rpx;
			margin-right: 16rpx;
		}
		.info {
			flex: 1;
		}
		.title {
			font-size: 28rpx;
			color: #333333;
			font-weight: 600;
			margin-bottom: 8rpx;
		}
		.shipping {
			font-size: 24rpx;
			color: #999999;
		}
	}
	.address {
		margin-top: 12rpx;
		font-size: 24rpx;
		color: #777777;
		display: flex;
		flex-direction: column;
		gap: 4rpx;
	}
	.order-footer {
		margin-top: 16rpx;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
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
				text {
					font-size: 24rpx;
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
			.btn {
				padding: 6rpx 16rpx;
				border-radius: 16rpx;
				font-size: 24rpx;
				color: #ff6a5f;
				border: 1rpx solid #ff6a5f;
			}
			.btn.primary {
				background-color: #ff6a5f;
				color: #ffffff;
			}
			.btn.disabled {
				color: #999999;
				border-color: #cccccc;
			}
			.shipping-actions {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				gap: 10rpx;
				.tracking {
					font-size: 22rpx;
					color: #777777;
				}
			}
		}
	}
	&.dark-mode {
		.order-body .title {
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
