<template>
	<view class="address-form-page" v-dark>
		<view v-if="!isLoggedIn" class="page-state">
			<text>登录后才能编辑收货地址</text>
			<view class="state-action" @tap="goLogin">去登录</view>
		</view>

		<template v-else>
			<view v-if="loadingDetail" class="page-state">
				<text>正在加载地址信息...</text>
			</view>

			<template v-else>
				<view class="form-card">
					<view class="form-item">
						<text class="label">姓名</text>
						<input
							class="input"
							v-model.trim="form.receiver_name"
							maxlength="20"
							placeholder="请输入收货人姓名"
						/>
					</view>
					<view class="form-item">
						<text class="label">手机号</text>
						<input
							class="input"
							v-model.trim="form.receiver_phone"
							maxlength="20"
							placeholder="请输入手机号"
							type="number"
						/>
					</view>
					<view class="form-item">
						<text class="label">省市区</text>
						<picker mode="region" @change="onRegionChange" :value="region">
							<view :class="['picker-value', region.length === 0 ? 'placeholder' : '']">
								{{ regionDisplay }}
							</view>
						</picker>
					</view>
					<view class="form-item textarea-item">
						<text class="label">详细地址</text>
						<textarea
							class="textarea"
							v-model.trim="form.detail"
							maxlength="120"
							auto-height
							placeholder="街道、楼栋、门牌号等"
						/>
					</view>
					<view class="form-item switch-item">
						<text class="label">设为默认地址</text>
						<switch :checked="form.is_default" @change="onDefaultChange" />
					</view>
				</view>

				<view class="bottom-bar">
					<button class="save-btn" :disabled="submitting" @tap="saveAddress">
						{{ submitting ? '保存中...' : '保存地址' }}
					</button>
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
			loadingDetail: false,
			submitting: false,
		}
	},
	computed: {
		isLoggedIn() {
			return !!this.getToken()
		},
		regionDisplay() {
			if (!this.region || this.region.length === 0) return '请选择省市区'
			return this.region.join('')
		},
	},
	onLoad(options) {
		if (options.address_id) {
			this.addressId = options.address_id
			if (this.isLoggedIn) {
				this.fetchAddressDetail()
			}
		}
	},
	onShow() {
		if (this.addressId && this.isLoggedIn && !this.loadingDetail && !this.form.receiver_name) {
			this.fetchAddressDetail()
		}
	},
	onPullDownRefresh() {
		if (!this.addressId || !this.isLoggedIn) {
			uni.stopPullDownRefresh()
			return
		}
		this.fetchAddressDetail()
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
		fetchAddressDetail() {
			const tk = this.getToken()
			if (!tk) return
			this.loadingDetail = true
			axios.get(this.$baseUrl + `/store/addresses/${this.addressId}`, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + tk,
				},
			}).then((res) => {
				if (res.data && res.data.code === 200) {
					const data = res.data.data
					this.form = {
						receiver_name: data.receiver_name || '',
						receiver_phone: data.receiver_phone || '',
						province: data.province || '',
						city: data.city || '',
						district: data.district || '',
						detail: data.detail || '',
						is_default: data.is_default === 1,
					}
					this.region = [data.province, data.city, data.district].filter(Boolean)
				} else {
					uni.showToast({ title: res.data.msg || '地址加载失败', icon: 'none' })
				}
			}).catch((error) => {
				uni.showToast({ title: error.response?.data?.msg || '地址加载失败', icon: 'none' })
			}).finally(() => {
				this.loadingDetail = false
				uni.stopPullDownRefresh()
			})
		},
		onRegionChange(e) {
			this.region = e.detail.value
			this.form.province = this.region[0] || ''
			this.form.city = this.region[1] || ''
			this.form.district = this.region[2] || ''
		},
		onDefaultChange(e) {
			this.form.is_default = e.detail.value
		},
		saveAddress() {
			if (this.submitting) return
			if (!this.isLoggedIn) {
				this.goLogin()
				return
			}
			if (!this.form.receiver_name || !this.form.receiver_phone || !this.form.detail) {
				uni.showToast({ title: '请完善地址信息', icon: 'none' })
				return
			}
			if (this.region.length === 0) {
				uni.showToast({ title: '请选择省市区', icon: 'none' })
				return
			}
			if (!/^\d{5,20}$/.test(this.form.receiver_phone)) {
				uni.showToast({ title: '手机号格式不正确', icon: 'none' })
				return
			}
			const tk = this.getToken()
			if (!tk) return
			this.submitting = true
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
			}).catch((error) => {
				uni.showToast({ title: error.response?.data?.msg || '保存失败', icon: 'none' })
			}).finally(() => {
				this.submitting = false
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.address-form-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #fff8f4 0%, #f6f6f6 220rpx);
	padding: 24rpx 30rpx 140rpx;
	&.dark-mode {
		background: #111111;
	}
}

.page-state {
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

.form-card {
	background: #ffffff;
	border-radius: 22rpx;
	padding: 20rpx;
	box-shadow: 0 8rpx 26rpx rgba(0, 0, 0, 0.05);
	&.dark-mode {
		background: #000000;
		box-shadow: none;
	}
}

.form-item {
	display: flex;
	align-items: center;
	padding: 18rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
	.label {
		width: 160rpx;
		font-size: 26rpx;
		color: #666666;
	}
	.input,
	.picker-value,
	.textarea {
		flex: 1;
		font-size: 26rpx;
		color: #333333;
	}
	.picker-value.placeholder {
		color: #b1b1b1;
	}
}

.textarea-item {
	align-items: flex-start;
	.label {
		padding-top: 8rpx;
	}
}

.textarea {
	min-height: 120rpx;
	line-height: 1.6;
}

.form-item:last-child {
	border-bottom: none;
}

.switch-item {
	justify-content: space-between;
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
	.save-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 14rpx;
		background: #ff6a5f;
		color: #ffffff;
		font-size: 30rpx;
		font-weight: 600;
	}
	.save-btn:disabled {
		background: #cccccc;
	}
}

.address-form-page.dark-mode {
	.label,
	.input,
	.picker-value,
	.textarea {
		color: #ededed;
	}
	.picker-value.placeholder {
		color: #8f8f8f;
	}
}
</style>
