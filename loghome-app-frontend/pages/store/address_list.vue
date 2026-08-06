<template>
	<view class="address-page" v-dark>
		<view v-if="!isLoggedIn" class="page-state">
			<text>登录后才能管理收货地址</text>
			<view class="state-action" @tap="goLogin">去登录</view>
		</view>

		<template v-else>
			<view class="select-banner" v-if="selectMode">
				<text>选择一个收货地址用于当前订单</text>
			</view>

			<view v-if="loading && addresses.length === 0" class="page-state">
				<text>正在加载地址...</text>
			</view>

			<view v-else-if="loadError" class="page-state">
				<text>{{ loadError }}</text>
				<view class="state-action" @tap="fetchAddresses">重新加载</view>
			</view>

			<template v-else>
				<view
					class="address-card"
					v-for="item in addresses"
					:key="item.address_id"
					@tap="handleSelect(item)"
				>
					<view class="row">
						<view class="name">{{ item.receiver_name }}</view>
						<view class="phone">{{ item.receiver_phone }}</view>
						<view class="default-tag" v-if="item.is_default">默认</view>
					</view>
					<view class="detail">{{ formatAddress(item) }}</view>
					<view class="actions">
						<view class="action" @tap.stop="setDefault(item)" v-if="!item.is_default">
							{{ processingAction === `default-${item.address_id}` ? '设置中...' : '设为默认' }}
						</view>
						<view class="action" @tap.stop="editAddress(item)">编辑</view>
						<view class="action danger" @tap.stop="deleteAddress(item)">
							{{ processingAction === `delete-${item.address_id}` ? '删除中...' : '删除' }}
						</view>
					</view>
				</view>

				<view class="empty" v-if="!loading && addresses.length === 0">
					<text>{{ selectMode ? '先新增一个地址再完成下单' : '暂无收货地址' }}</text>
				</view>
			</template>

			<view class="bottom-bar">
				<button class="add-btn" @tap="addAddress">
					{{ selectMode ? '新增地址并继续' : '新增收货地址' }}
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
			addresses: [],
			selectMode: false,
			loading: false,
			loadError: '',
			processingAction: '',
		}
	},
	computed: {
		isLoggedIn() {
			return !!this.getToken()
		},
	},
	onLoad(options) {
		if (options && options.select === '1') {
			this.selectMode = true
		}
	},
	onShow() {
		if (this.isLoggedIn) {
			this.fetchAddresses()
		}
	},
	onPullDownRefresh() {
		if (!this.isLoggedIn) {
			uni.stopPullDownRefresh()
			return
		}
		this.fetchAddresses()
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
		formatAddress(item) {
			return [
				item.province || '',
				item.city || '',
				item.district || '',
				item.detail || '',
			].join('')
		},
		fetchAddresses() {
			const tk = this.getToken()
			if (!tk) return
			this.loading = true
			this.loadError = ''
			axios.get(this.$baseUrl + '/store/addresses', {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then((res) => {
				if (res.data && res.data.code === 200) {
					this.addresses = res.data.data || []
					this.loadError = ''
				} else {
					this.loadError = res.data.msg || '地址加载失败，请稍后重试'
				}
			}).catch((error) => {
				this.loadError = error.response?.data?.msg || '地址加载失败，请稍后重试'
			}).finally(() => {
				this.loading = false
				uni.stopPullDownRefresh()
			})
		},
		addAddress() {
			uni.navigateTo({
				url: '/pages/store/address_form',
			})
		},
		editAddress(item) {
			uni.navigateTo({
				url: `/pages/store/address_form?address_id=${item.address_id}`,
			})
		},
		setDefault(item) {
			const tk = this.getToken()
			if (!tk || this.processingAction) return
			this.processingAction = `default-${item.address_id}`
			axios.post(this.$baseUrl + `/store/addresses/${item.address_id}/default`, {}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then((res) => {
				if (res.data && res.data.code === 200) {
					uni.showToast({ title: '已设为默认地址', icon: 'success' })
					this.fetchAddresses()
				} else {
					uni.showToast({ title: res.data.msg || '设置失败', icon: 'none' })
				}
			}).catch((error) => {
				uni.showToast({ title: error.response?.data?.msg || '设置失败', icon: 'none' })
			}).finally(() => {
				this.processingAction = ''
			})
		},
		deleteAddress(item) {
			uni.showModal({
				title: '确认删除',
				content: '确定删除该地址吗？',
				success: (result) => {
					if (!result.confirm) return
					const tk = this.getToken()
					if (!tk || this.processingAction) return
					this.processingAction = `delete-${item.address_id}`
					axios.delete(this.$baseUrl + `/store/addresses/${item.address_id}`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk,
						},
					}).then((res) => {
						if (res.data && res.data.code === 200) {
							uni.showToast({ title: '地址已删除', icon: 'success' })
							this.fetchAddresses()
						} else {
							uni.showToast({ title: res.data.msg || '删除失败', icon: 'none' })
						}
					}).catch((error) => {
						uni.showToast({ title: error.response?.data?.msg || '删除失败', icon: 'none' })
					}).finally(() => {
						this.processingAction = ''
					})
				},
			})
		},
		handleSelect(item) {
			if (!this.selectMode) return
			window.localStorage.setItem('store_selected_address', String(item.address_id))
			uni.navigateBack()
		},
	},
}
</script>

<style lang="scss" scoped>
.address-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #fff8f4 0%, #f6f6f6 220rpx);
	padding: 24rpx 30rpx 140rpx;
	&.dark-mode {
		background: #111111;
	}
}

.page-state,
.empty {
	margin-top: 140rpx;
	text-align: center;
	color: #9a9a9a;
	font-size: 26rpx;
}

.state-action {
	margin: 20rpx auto 0;
	display: inline-flex;
	padding: 12rpx 20rpx;
	border-radius: 999rpx;
	background: rgba(255, 106, 95, 0.1);
	color: #ff6a5f;
}

.select-banner {
	margin-bottom: 18rpx;
	padding: 16rpx 20rpx;
	border-radius: 18rpx;
	background: rgba(255, 106, 95, 0.08);
	color: #ff6a5f;
	font-size: 24rpx;
}

.address-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 8rpx 26rpx rgba(0, 0, 0, 0.05);
	&.dark-mode {
		background: #000000;
		box-shadow: none;
	}
}

.row {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 16rpx;
	.name {
		font-size: 28rpx;
		font-weight: 600;
		color: #333333;
	}
	.phone {
		font-size: 26rpx;
		color: #666666;
	}
	.default-tag {
		font-size: 22rpx;
		color: #ff6a5f;
		background: rgba(255, 106, 95, 0.12);
		padding: 4rpx 10rpx;
		border-radius: 10rpx;
	}
}

.detail {
	margin-top: 12rpx;
	font-size: 24rpx;
	line-height: 1.6;
	color: #777777;
}

.actions {
	margin-top: 16rpx;
	display: flex;
	gap: 20rpx;
	flex-wrap: wrap;
	.action {
		font-size: 24rpx;
		color: #ff6a5f;
	}
	.action.danger {
		color: #ff4d4f;
	}
}

.bottom-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 20rpx 30rpx calc(20rpx + var(--loghome-safe-bottom, 0px));
	background: rgba(255, 255, 255, 0.96);
	backdrop-filter: blur(12rpx);
	box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
	&.dark-mode {
		background: rgba(0, 0, 0, 0.95);
	}
	.add-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 14rpx;
		background: #ff6a5f;
		color: #ffffff;
		font-size: 30rpx;
		font-weight: 600;
	}
}

.address-page.dark-mode {
	.row .name {
		color: #ededed;
	}
	.row .phone,
	.detail {
		color: #b9b9b9;
	}
}
</style>
