<template>
	<view class="address-form-page" v-dark>
		<view class="page-intro">
			<view class="page-title">{{ addressId ? '编辑地址' : '新增地址' }}</view>
			<view class="page-caption">请填写准确的收货信息，便于商品配送。</view>
		</view>
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
						<text class="label">收货人</text>
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
							type="text"
							inputmode="tel"
						/>
					</view>
					<view class="form-item">
						<text class="label">省市区</text>
						<picker
							mode="multiSelector"
							:range="regionColumns"
							:value="regionIndices"
							:disabled="submitting"
							@columnchange="onRegionColumnChange"
							@change="onRegionChange"
							@cancel="resetRegionPicker"
						>
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
						<view>
							<view class="label">设为默认地址</view>
							<view class="field-hint">下次兑换时优先使用此地址</view>
						</view>
						<switch color="#264d3c" :checked="form.is_default" @change="onDefaultChange" />
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
import {
	createRegionOptions,
	getRegionPickerState,
	findRegionIndices,
} from '@/common/address-region-picker.js'

export default {
	mixins: [darkModeMixin],
	data() {
		return {
			authToken: null,
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
			regionOptions: createRegionOptions(),
			regionIndices: [0, 0, 0],
			loadingDetail: false,
			submitting: false,
		}
	},
	computed: {
		regionColumns() {
			return getRegionPickerState(this.regionOptions, this.regionIndices).columns
		},
		isLoggedIn() {
			return !!this.authToken
		},
		regionDisplay() {
			if (!this.region || this.region.length === 0) return '请选择省市区'
			return this.region.join('')
		},
	},
	onLoad(options) {
		this.authToken = this.getToken()
		if (options.address_id) {
			this.addressId = options.address_id
			if (this.isLoggedIn) {
				this.fetchAddressDetail()
			}
		}
	},
	onShow() {
		this.authToken = this.getToken()
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
			axios
				.get(this.$baseUrl + `/store/addresses/${this.addressId}`, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + tk,
					},
				})
				.then((res) => {
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
						this.region = [data.province || '', data.city || '', data.district || '']
						this.resetRegionPicker()
					} else {
						uni.showToast({ title: res.data.msg || '地址加载失败', icon: 'none' })
					}
				})
				.catch((error) => {
					uni.showToast({ title: error.response?.data?.msg || '地址加载失败', icon: 'none' })
				})
				.finally(() => {
					this.loadingDetail = false
					uni.stopPullDownRefresh()
				})
		},
		resetRegionPicker() {
			this.regionOptions = createRegionOptions(this.region)
			this.regionIndices = findRegionIndices(this.regionOptions, this.region)
		},
		onRegionColumnChange(e) {
			const column = Number(e.detail.column)
			const value = Number(e.detail.value)
			if (![0, 1, 2].includes(column) || this.regionIndices[column] === value) return
			const indices = this.regionIndices.slice()
			indices[column] = value
			for (let next = column + 1; next < 3; next += 1) indices[next] = 0
			this.regionIndices = getRegionPickerState(this.regionOptions, indices).indices
		},
		onRegionChange(e) {
			const state = getRegionPickerState(this.regionOptions, e.detail.value)
			this.regionIndices = state.indices
			this.region = state.names
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
			if (this.region.length !== 3 || !this.region.every(Boolean)) {
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
							Authorization: 'Bearer ' + tk,
						},
				  })
				: axios.post(this.$baseUrl + '/store/addresses', payload, {
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + tk,
						},
				  })
			request
				.then((res) => {
					if (res.data && res.data.code === 200) {
						uni.showToast({ title: '保存成功', icon: 'success' })
						setTimeout(() => {
							uni.navigateBack()
						}, 500)
					} else {
						uni.showToast({ title: res.data.msg || '保存失败', icon: 'none' })
					}
				})
				.catch((error) => {
					uni.showToast({ title: error.response?.data?.msg || '保存失败', icon: 'none' })
				})
				.finally(() => {
					this.submitting = false
				})
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../styles/store.scss';
.address-form-page {
	padding-bottom: calc(168rpx + var(--loghome-safe-bottom, 0px));
}
.form-card {
	margin: 0 32rpx 24rpx;
	padding: 4rpx 28rpx;
	border-radius: 22rpx;
	box-shadow: var(--store-shadow);
	background: var(--store-surface);
	border: 1rpx solid var(--store-line);
}
.form-item {
	display: flex;
	align-items: center;
	min-height: 112rpx;
	gap: 24rpx;
	padding: 24rpx 0;
	border-bottom: 1rpx solid var(--store-line);
}
.form-item:last-child {
	border-bottom: 0;
}
.label {
	min-width: 140rpx;
	font-size: 27rpx;
	font-weight: 500;
}
.input,
.textarea,
picker {
	flex: 1;
	min-width: 0;
	color: var(--store-text);
	font-size: 27rpx;
	background: transparent;
}
.input {
	min-height: 72rpx;
}
.textarea-item {
	align-items: flex-start;
}
.textarea {
	min-height: 140rpx;
	width: 100%;
	padding-top: 4rpx;
	line-height: 1.7;
}
.picker-value {
	min-height: 72rpx;
	display: flex;
	align-items: center;
	padding-right: 28rpx;
}
.placeholder,
.field-hint {
	color: var(--store-muted);
}
.field-hint {
	margin-top: 8rpx;
	font-size: 23rpx;
}
.switch-item {
	justify-content: space-between;
}
.save-btn {
	width: 100%;
}
</style>
