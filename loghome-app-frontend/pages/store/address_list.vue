<template>
	<view class="address-page" v-dark>
		<view class="page-intro">
			<!-- <view class="page-title">收货地址</view> -->
			<!-- <view class="page-caption">
				{{ selectMode ? '选择这次兑换的送达地址' : '管理常用地址，让喜欢的好物顺利抵达。' }}
			</view> -->
		</view>
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
						<view class="action" @tap.stop="editAddress(item)">
							<store-icon name="pen" :size="28" />
							编辑
						</view>
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
					<store-icon name="plus" :size="34" />
					{{ selectMode ? '新增地址并继续' : '新增收货地址' }}
				</button>
			</view>
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
			addresses: [],
			selectMode: false,
			loading: false,
			loadError: '',
			processingAction: '',
		}
	},
	computed: {
		isLoggedIn() {
			return !!this.authToken
		},
	},
	onLoad(options) {
		this.authToken = this.getToken()
		if (options && options.select === '1') {
			this.selectMode = true
		}
	},
	onShow() {
		this.authToken = this.getToken()
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
			return [item.province || '', item.city || '', item.district || '', item.detail || ''].join('')
		},
		fetchAddresses() {
			const tk = this.getToken()
			if (!tk) return
			this.loading = true
			this.loadError = ''
			axios
				.get(this.$baseUrl + '/store/addresses', {
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + tk,
					},
				})
				.then((res) => {
					if (res.data && res.data.code === 200) {
						this.addresses = res.data.data || []
						this.loadError = ''
					} else {
						this.loadError = res.data.msg || '地址加载失败，请稍后重试'
					}
				})
				.catch((error) => {
					this.loadError = error.response?.data?.msg || '地址加载失败，请稍后重试'
				})
				.finally(() => {
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
			axios
				.post(
					this.$baseUrl + `/store/addresses/${item.address_id}/default`,
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
						uni.showToast({ title: '已设为默认地址', icon: 'success' })
						this.fetchAddresses()
					} else {
						uni.showToast({ title: res.data.msg || '设置失败', icon: 'none' })
					}
				})
				.catch((error) => {
					uni.showToast({ title: error.response?.data?.msg || '设置失败', icon: 'none' })
				})
				.finally(() => {
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
					axios
						.delete(this.$baseUrl + `/store/addresses/${item.address_id}`, {
							headers: {
								'Content-Type': 'application/json',
								Authorization: 'Bearer ' + tk,
							},
						})
						.then((res) => {
							if (res.data && res.data.code === 200) {
								uni.showToast({ title: '地址已删除', icon: 'success' })
								this.fetchAddresses()
							} else {
								uni.showToast({ title: res.data.msg || '删除失败', icon: 'none' })
							}
						})
						.catch((error) => {
							uni.showToast({ title: error.response?.data?.msg || '删除失败', icon: 'none' })
						})
						.finally(() => {
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
@import '../../styles/store.scss';
.address-page {
	padding-bottom: calc(168rpx + var(--loghome-safe-bottom, 0px));
}
.select-banner {
	padding: 20rpx 28rpx;
	margin: 0 32rpx 24rpx;
	border-radius: 14rpx;
	background: var(--store-accent-soft);
	color: var(--store-accent);
	font-size: 24rpx;
}
.address-card {
	margin: 0 32rpx 24rpx;
	padding: 28rpx;
	border: 1rpx solid var(--store-line);
	border-radius: 22rpx;
	background: var(--store-surface);
}
.row {
	display: flex;
	gap: 18rpx;
	align-items: baseline;
	flex-wrap: wrap;
}
.name {
	font-size: 31rpx;
	font-weight: 650;
}
.phone {
	color: var(--store-muted);
	font-size: 26rpx;
}
.default-tag {
	font-size: 21rpx;
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
	background: var(--store-accent-soft);
	color: var(--store-accent);
}
.detail {
	padding: 16rpx 0 20rpx;
	font-size: 27rpx;
	overflow-wrap: anywhere;
}
.actions {
	border-top: 1rpx solid var(--store-line);
	padding-top: 8rpx;
	display: flex;
	justify-content: flex-end;
	gap: 28rpx;
}
.action {
	min-height: 80rpx;
	display: flex;
	align-items: center;
	font-size: 25rpx;
	color: var(--store-accent);
}
.action.danger {
	color: var(--store-danger);
}
.add-btn {
	width: 100%;
}
.action,
.add-btn {
	gap: 10rpx;
}
.address-card {
	border-radius: 22rpx;
	box-shadow: var(--store-shadow);
}
</style>
