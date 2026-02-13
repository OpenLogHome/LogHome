<template>
	<view class="address-page" v-dark>
		<view class="address-card" v-for="item in addresses" :key="item.address_id" @tap="handleSelect(item)">
			<view class="row">
				<view class="name">{{ item.receiver_name }}</view>
				<view class="phone">{{ item.receiver_phone }}</view>
				<view class="default-tag" v-if="item.is_default">默认</view>
			</view>
			<view class="detail">
				{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}
			</view>
			<view class="actions">
				<view class="action" @tap.stop="setDefault(item)" v-if="!item.is_default">设为默认</view>
				<view class="action" @tap.stop="editAddress(item)">编辑</view>
				<view class="action danger" @tap.stop="deleteAddress(item)">删除</view>
			</view>
		</view>
		<view class="empty" v-if="addresses.length === 0">
			<text>暂无收货地址</text>
		</view>
		<view class="bottom-bar">
			<button class="add-btn" @tap="addAddress">新增地址</button>
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
			addresses: [],
			selectMode: false,
		}
	},
	onLoad(options) {
		if (options && options.select === '1') {
			this.selectMode = true
		}
	},
	onShow() {
		this.fetchAddresses()
	},
	methods: {
		getToken() {
			let tk = JSON.parse(window.localStorage.getItem('token'))
			if (tk) tk = tk.tk
			return tk
		},
		fetchAddresses() {
			const tk = this.getToken()
			if (!tk) return
			axios.get(this.$baseUrl + '/store/addresses', {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then((res) => {
				if (res.data && res.data.code === 200) {
					this.addresses = res.data.data || []
				}
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
			if (!tk) return
			axios.post(this.$baseUrl + `/store/addresses/${item.address_id}/default`, {}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then(() => {
				this.fetchAddresses()
			})
		},
		deleteAddress(item) {
			uni.showModal({
				title: '确认删除',
				content: '确定删除该地址吗？',
				success: (res) => {
					if (!res.confirm) return
					const tk = this.getToken()
					if (!tk) return
					axios.delete(this.$baseUrl + `/store/addresses/${item.address_id}`, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk,
						},
					}).then(() => {
						this.fetchAddresses()
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
	background-color: #f6f6f6;
	padding: 24rpx 30rpx 140rpx;
	&.dark-mode {
		background-color: #111111;
	}
}

.address-card {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	&.dark-mode {
		background-color: #000000;
	}
	.row {
		display: flex;
		align-items: center;
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
			background-color: rgba(255, 106, 95, 0.12);
			padding: 2rpx 10rpx;
			border-radius: 10rpx;
		}
	}
	.detail {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #777777;
	}
	.actions {
		margin-top: 14rpx;
		display: flex;
		gap: 20rpx;
		.action {
			font-size: 24rpx;
			color: #ff6a5f;
		}
		.action.danger {
			color: #ff4d4f;
		}
	}
	&.dark-mode {
		.row .name {
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
	.add-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 12rpx;
		background-color: #ff6a5f;
		color: #ffffff;
		font-size: 30rpx;
		font-weight: 600;
	}
}
</style>
