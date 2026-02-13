<template>
	<view class="address-form-page" v-dark>
		<view class="form-card">
			<view class="form-item">
				<text class="label">姓名</text>
				<input class="input" v-model="form.receiver_name" placeholder="请输入收货人姓名" />
			</view>
			<view class="form-item">
				<text class="label">手机号</text>
				<input class="input" v-model="form.receiver_phone" placeholder="请输入手机号" type="number" />
			</view>
			<view class="form-item">
				<text class="label">省市区</text>
				<picker mode="region" @change="onRegionChange" :value="region">
					<view class="picker-value">{{ regionDisplay }}</view>
				</picker>
			</view>
			<view class="form-item">
				<text class="label">详细地址</text>
				<input class="input" v-model="form.detail" placeholder="街道门牌号" />
			</view>
			<view class="form-item switch-item">
				<text class="label">设为默认地址</text>
				<switch :checked="form.is_default" @change="onDefaultChange" />
			</view>
		</view>
		<view class="bottom-bar">
			<button class="save-btn" @tap="saveAddress">保存</button>
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
			addressId: null,
			form: {
				receiver_name: '',
				receiver_phone: '',
				province: '',
				city: '',
				district: '',
				detail: '',
				is_default: false,
			},
			region: [],
		}
	},
	computed: {
		regionDisplay() {
			if (!this.region || this.region.length === 0) return '请选择省市区'
			return this.region.join('')
		},
	},
	onLoad(options) {
		if (options.address_id) {
			this.addressId = options.address_id
			this.fetchAddressDetail()
		}
	},
	methods: {
		getToken() {
			let tk = JSON.parse(window.localStorage.getItem('token'))
			if (tk) tk = tk.tk
			return tk
		},
		fetchAddressDetail() {
			const tk = this.getToken()
			if (!tk) return
			axios.get(this.$baseUrl + `/store/addresses/${this.addressId}`, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then((res) => {
				if (res.data && res.data.code === 200) {
					const data = res.data.data
					this.form = {
						receiver_name: data.receiver_name,
						receiver_phone: data.receiver_phone,
						province: data.province,
						city: data.city,
						district: data.district,
						detail: data.detail,
						is_default: data.is_default === 1,
					}
					this.region = [data.province, data.city, data.district].filter(Boolean)
				}
			})
		},
		onRegionChange(e) {
			this.region = e.detail.value
			this.form.province = this.region[0]
			this.form.city = this.region[1]
			this.form.district = this.region[2]
		},
		onDefaultChange(e) {
			this.form.is_default = e.detail.value
		},
		saveAddress() {
			if (!this.form.receiver_name || !this.form.receiver_phone || !this.form.detail) {
				uni.showToast({ title: '请完善地址信息', icon: 'none' })
				return
			}
			if (!/^\d{5,20}$/.test(this.form.receiver_phone)) {
				uni.showToast({ title: '手机号格式不正确', icon: 'none' })
				return
			}
			const tk = this.getToken()
			if (!tk) return
			const payload = {
				receiver_name: this.form.receiver_name,
				receiver_phone: this.form.receiver_phone,
				province: this.form.province,
				city: this.form.city,
				district: this.form.district,
				detail: this.form.detail,
				is_default: this.form.is_default ? 1 : 0,
			}
			const request = this.addressId
				? axios.put(this.$baseUrl + `/store/addresses/${this.addressId}`, payload, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk,
					},
				})
				: axios.post(this.$baseUrl + '/store/addresses', payload, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk,
					},
				})
			request.then((res) => {
				if (res.data && res.data.code === 200) {
					uni.showToast({ title: '保存成功', icon: 'success' })
					setTimeout(() => {
						uni.navigateBack()
					}, 500)
				} else {
					uni.showToast({ title: res.data.msg || '保存失败', icon: 'none' })
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.address-form-page {
	min-height: 100vh;
	background-color: #f6f6f6;
	padding: 24rpx 30rpx 140rpx;
	&.dark-mode {
		background-color: #111111;
	}
}

.form-card {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 20rpx;
	&.dark-mode {
		background-color: #000000;
	}
	.form-item {
		display: flex;
		align-items: center;
		padding: 16rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
		.label {
			width: 160rpx;
			font-size: 26rpx;
			color: #666666;
		}
		.input {
			flex: 1;
			font-size: 26rpx;
			color: #333333;
		}
		.picker-value {
			font-size: 26rpx;
			color: #333333;
		}
	}
	.form-item:last-child {
		border-bottom: none;
	}
	.switch-item {
		justify-content: space-between;
	}
	&.dark-mode {
		.label,
		.input,
		.picker-value {
			color: #eaeaea;
		}
	}
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
	.save-btn {
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
