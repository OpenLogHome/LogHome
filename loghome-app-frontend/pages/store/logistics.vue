<template>
	<view class="logistics-page" v-dark>
		<view v-if="!isLoggedIn" class="page-state">
			<text>登录后即可查看订单物流</text
			><view class="state-action" @tap="goLogin">去登录</view>
		</view>
		<view v-else-if="loading && !order" class="page-state"
			>正在加载物流信息...</view
		>
		<view v-else-if="error" class="page-state">
			<text>{{ error }}</text
			><view class="state-action" @tap="loadLogistics">重新加载</view>
		</view>
		<template v-else-if="order">
			<view class="shipment-card">
				<view class="shipment-heading"
					><view class="shipment-icon"
						><store-icon name="package" :size="44" /></view
					><view
						><view class="shipment-title">{{ shipmentTitle }}</view
						><view class="shipment-caption">{{
							order.shipping_company || '快递公司待补充'
						}}</view></view
					></view
				>
				<view class="tracking-row"
					><text class="tracking-number">{{
						order.tracking_number || '待生成快递单号'
					}}</text
					><button
						v-if="order.tracking_number"
						class="copy-btn"
						@tap="copyTracking"
					>
						复制
					</button></view
				>
				<view class="shipment-meta">订单号 {{ order.order_no }}</view>
				<view v-if="order.shipped_at" class="shipment-meta"
					>发货时间 {{ formatTime(order.shipped_at) }}</view
				>
			</view>
			<view class="product-card"
				><image
					v-if="order.product_cover"
					class="product-cover"
					:src="order.product_cover"
					mode="aspectFill"
				/><view class="product-info"
					><view class="product-title">{{ order.product_title }}</view
					><view class="product-variant">{{
						order.variant_label || '默认规格'
					}}</view></view
				></view
			>
			<view class="trace-card">
				<view class="trace-heading"
					><text>物流动态</text
					><button class="refresh-btn" :disabled="loading" @tap="refreshQuery">
						{{ loading ? '更新中' : '刷新' }}
					</button></view
				>
				<view v-if="logistics.message" class="trace-notice">{{
					logistics.message
				}}</view>
				<view v-if="logistics.events.length" class="timeline">
					<view
						v-for="(event, index) in logistics.events"
						:key="index"
						:class="['trace-item', index === 0 ? 'latest' : '']"
					>
						<view class="trace-dot" /><view class="trace-context">{{
							event.context
						}}</view
						><view class="trace-time">{{ event.time }}</view>
					</view>
				</view>
				<view v-else class="trace-empty"
					><store-icon name="clock" :size="48" tone="muted" /><text>{{
						emptyMessage
					}}</text></view
				>
				<view v-if="logistics.checked_at" class="update-note"
					>查询时间 {{ formatTime(logistics.checked_at)
					}}<text v-if="logistics.cached"> · 已缓存</text></view
				>
				<view v-if="logistics.next_query_at" class="update-note"
					>下次更新 {{ formatTime(logistics.next_query_at) }}</view
				>
				<view v-if="logistics.stale && logistics.last_success_at" class="update-note"
					>上次取得记录 {{ formatTime(logistics.last_success_at) }}</view
				>
			</view>
			<view
				v-if="order.product_type === 'physical' && order.tracking_number"
				class="public-card"
			>
				<view class="public-title">查件入口</view>
				<view class="public-caption"
					>查询链接已携带本单单号与快递公司，无需重新输入。部分快递需验证码或手机号核验。</view
				>
				<button
					class="public-btn"
					@tap="openPublic"
				>
					在浏览器中查件 <store-icon name="arrow" :size="28" />
				</button>
			</view>
		</template>
	</view>
</template>
<script>
import axios from 'axios'
import darkModeMixin from '@/mixins/dark-mode.js'
import StoreIcon from '@/components/StoreIcon.vue'
import { getTrackingLinks } from '@/common/store-tracking-links.js'
import { loadStoreLogistics } from '@/common/store-logistics.js'
export default {
	mixins: [darkModeMixin],
	components: { StoreIcon },
	data() {
		return {
			orderId: null,
			authToken: null,
			order: null,
			logistics: { events: [] },
			loading: false,
			error: '',
		}
	},
	computed: {
		isLoggedIn() {
			return !!this.authToken
		},
		trackingLinks() {
			return getTrackingLinks(this.order || {})
		},
		emptyMessage() {
			if (this.logistics.status === 'not_shipped') return '发货后可查看物流动态'
			if (this.logistics.status === 'no_records')
				return '服务方暂未查到记录，可能尚未揽收'
			if (this.logistics.status === 'unavailable')
				return '本次查询未成功，请在浏览器中查件'
			return '请在浏览器中查看物流'
		},
		shipmentTitle() {
			if (this.order.product_type !== 'physical') return '虚拟商品无需配送'
			if (!this.order.tracking_number) return '等待商家发货'
			return this.logistics.status === 'ok'
				? this.logistics.state_text
				: '商品已发货'
		},
	},
	onLoad(options) {
		this.orderId = Number(options.order_id)
		this.authToken = this.getToken()
		if (this.isLoggedIn) this.loadLogistics()
	},
	onShow() {
		this.authToken = this.getToken()
		if (this.isLoggedIn && !this.order && !this.loading) this.loadLogistics()
	},
	onPullDownRefresh() {
		if (this.isLoggedIn) this.loadLogistics()
		else uni.stopPullDownRefresh()
	},
	methods: {
		getToken() {
			try {
				return JSON.parse(window.localStorage.getItem('token'))?.tk || null
			} catch (_) {
				return null
			}
		},
		goLogin() {
			uni.navigateTo({ url: '/pages/users/login?msg=store' })
		},
		async loadLogistics() {
			if (this.loading || !this.isLoggedIn) {
				uni.stopPullDownRefresh()
				return
			}
			if (!Number.isSafeInteger(this.orderId) || this.orderId <= 0) {
				this.error = '订单不存在'
				uni.stopPullDownRefresh()
				return
			}
			this.loading = true
			this.error = ''
			try {
				const data = await loadStoreLogistics({
					request: (...args) => axios.get(...args),
					baseUrl: this.$baseUrl,
					orderId: this.orderId,
					token: this.getToken(),
					bridge: window.jsBridge,
				})
				this.order = data.order
				this.logistics = data.logistics
			} catch (e) {
				this.error =
					e.response?.data?.msg || e.message || '物流信息加载失败，请稍后重试'
			} finally {
				this.loading = false
				uni.stopPullDownRefresh()
			}
		},
		formatTime(value) {
			if (!value) return ''
			const d = new Date(value)
			if (Number.isNaN(d.getTime())) return String(value)
			return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
				2,
				'0'
			)}-${String(d.getDate()).padStart(2, '0')} ${String(
				d.getHours()
			).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
		},
		copyTracking() {
			if (!this.order?.tracking_number) return
			uni.setClipboardData({
				data: this.order.tracking_number,
				fail: () =>
					uni.showToast({ title: '复制失败，请手动复制单号', icon: 'none' }),
			})
		},
		refreshQuery() {
			this.loadLogistics()
		},
		openExternal(url) {
			if (!url) return
			if (window.jsBridge && window.jsBridge.inApp)
				window.jsBridge.openInBrowser(url)
			else window.open(url, '_blank', 'noopener,noreferrer')
		},
		openPublic() {
			this.openExternal(this.trackingLinks.queryUrl)
		},
	},
}
</script>
<style lang="scss" scoped>
@import '../../styles/store.scss';
.logistics-page {
	padding: 28rpx 28rpx calc(48rpx + var(--loghome-safe-bottom, 0px));
}
.shipment-card,
.product-card,
.trace-card,
.public-card {
	background: var(--store-surface);
	border: 1rpx solid var(--store-line);
	border-radius: 24rpx;
	margin-bottom: 24rpx;
	padding: 32rpx;
}
.shipment-heading {
	display: flex;
	align-items: center;
	gap: 22rpx;
	margin-bottom: 28rpx;
}
.shipment-icon {
	width: 88rpx;
	height: 88rpx;
	background: var(--store-primary-soft);
	border-radius: 24rpx;
	color: var(--store-primary);
	display: flex;
	align-items: center;
	justify-content: center;
}
.shipment-title {
	font-size: 38rpx;
	font-weight: 650;
	line-height: 1.3;
}
.shipment-caption {
	font-size: 26rpx;
	color: var(--store-muted);
	margin-top: 8rpx;
}
.tracking-row {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 20rpx;
}
.tracking-number {
	font-size: 30rpx;
	font-weight: 600;
	overflow-wrap: anywhere;
	flex: 1;
	min-width: 0;
}
.copy-btn,
.refresh-btn {
	font-size: 24rpx;
	line-height: 1.5;
	margin: 0;
	padding: 8rpx 18rpx;
	color: var(--store-primary);
	background: var(--store-primary-soft);
	border-radius: 12rpx;
	flex-shrink: 0;
}
.shipment-meta,
.update-note {
	font-size: 22rpx;
	color: var(--store-muted);
	line-height: 1.8;
	overflow-wrap: anywhere;
}
.product-card {
	display: flex;
	gap: 22rpx;
	padding: 24rpx;
	align-items: center;
}
.product-cover {
	width: 110rpx;
	height: 110rpx;
	border-radius: 16rpx;
	flex-shrink: 0;
	background: var(--store-soft);
}
.product-info {
	min-width: 0;
}
.product-title {
	font-weight: 550;
	font-size: 27rpx;
	line-height: 1.5;
}
.product-variant {
	font-size: 24rpx;
	color: var(--store-muted);
	margin-top: 10rpx;
}
.trace-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 30rpx;
	font-weight: 600;
	margin-bottom: 30rpx;
}
.trace-notice {
	padding: 20rpx 24rpx;
	border-radius: 14rpx;
	background: var(--store-soft);
	color: var(--store-muted);
	font-size: 25rpx;
	margin-bottom: 24rpx;
	line-height: 1.7;
}
.timeline {
	padding-left: 16rpx;
}
.trace-item {
	position: relative;
	border-left: 2rpx solid var(--store-line);
	padding: 0 0 40rpx 32rpx;
	color: var(--store-muted);
}
.trace-item:last-child {
	border-left-color: transparent;
	padding-bottom: 24rpx;
}
.trace-dot {
	position: absolute;
	left: -9rpx;
	top: 9rpx;
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background: var(--store-line);
}
.latest {
	color: var(--store-text);
}
.latest .trace-dot {
	background: var(--store-primary);
	box-shadow: 0 0 0 6rpx var(--store-primary-soft);
}
.trace-context {
	font-size: 27rpx;
	line-height: 1.7;
	overflow-wrap: anywhere;
}
.trace-time {
	margin-top: 12rpx;
	font-size: 22rpx;
	color: var(--store-muted);
}
.trace-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 18rpx;
	padding: 32rpx 0 48rpx;
	color: var(--store-muted);
	font-size: 25rpx;
}
.public-title {
	font-size: 28rpx;
	font-weight: 600;
}
.public-caption {
	margin: 14rpx 0 24rpx;
	font-size: 25rpx;
	line-height: 1.7;
	color: var(--store-muted);
}
.public-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	font-size: 26rpx;
	line-height: 1.5;
	padding: 24rpx;
	background: var(--store-primary);
	color: var(--store-on-primary);
	border-radius: 16rpx;
}
</style>
