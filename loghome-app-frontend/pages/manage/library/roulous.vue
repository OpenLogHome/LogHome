<template>
	<view class="container" v-dark>
		<view class="content">
			<view class="header">
				<view class="title">{{ $t('manage.banners.title') }}</view>
				<view class="add-btn" @click="addBanner">{{ $t('manage.banners.add') }}</view>
			</view>

			<view class="banner-list">
				<view class="banner-item" v-for="(banner, index) in banners" :key="banner.id">
					<view class="banner-image">
						<image :src="banner.image" mode="aspectFill"></image>
					</view>
					<view class="banner-info">
						<view class="banner-title">{{banner.title}}</view>
						<view class="banner-name">{{banner.name}}</view>
						<view class="banner-link">{{ $t('manage.banners.link', { link: banner.navigate_to }) }}</view>
						<view class="banner-status">
							{{ $t('manage.common.status') }}: <text :class="{active: banner.isValid == 1}">{{banner.isValid == 1 ? $t('manage.common.enabled') : $t('manage.common.disabled')}}</text>
						</view>
					</view>
					<view class="banner-actions">
						<view class="action-btn edit" @click="editBanner(banner)">{{ $t('common.edit') }}</view>
						<view class="action-btn" :class="banner.isValid == 1 ? 'disable' : 'enable'" @click="toggleStatus(banner)">
							{{banner.isValid == 1 ? $t('manage.common.disable') : $t('manage.common.enable')}}
						</view>
					</view>
				</view>
			</view>

			<view class="no-data" v-if="banners.length === 0">
				{{ $t('manage.banners.empty') }}
			</view>
		</view>

		<!-- 编辑弹窗 -->
		<view class="modal" v-if="showModal">
			<view class="modal-mask" @click="closeModal"></view>
			<view class="modal-content">
				<view class="modal-header">
					<view class="modal-title">{{currentBanner.id ? $t('manage.banners.edit') : $t('manage.banners.add')}}</view>
					<view class="modal-close" @click="closeModal">×</view>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<view class="label">{{ $t('manage.common.title') }}</view>
						<view class="input">
							<input type="text" v-model="currentBanner.title" :placeholder="$t('common.inputTitle')" />
						</view>
					</view>
					<view class="form-item">
						<view class="label">{{ $t('manage.banners.name') }}</view>
						<view class="input">
							<input type="text" v-model="currentBanner.name" :placeholder="$t('manage.banners.enterName')" />
						</view>
					</view>
					<view class="form-item">
						<view class="label">{{ $t('manage.banners.imageUrl') }}</view>
						<view class="input">
							<input type="text" v-model="currentBanner.image" :placeholder="$t('manage.banners.enterImageUrl')" />
						</view>
					</view>
					<view class="form-item">
						<view class="label">{{ $t('manage.banners.targetUrl') }}</view>
						<view class="input">
							<input type="text" v-model="currentBanner.navigate_to" :placeholder="$t('manage.banners.enterTargetUrl')" />
						</view>
					</view>
					<view class="form-item">
						<view class="label">{{ $t('manage.common.status') }}</view>
						<view class="input">
							<switch :checked="currentBanner.isValid == 1" @change="handleStatusChange" color="#007AFF" />
							<text class="status-text">{{currentBanner.isValid == 1 ? $t('manage.common.enabled') : $t('manage.common.disabled')}}</text>
						</view>
					</view>
				</view>
				<view class="modal-footer">
					<view class="btn cancel" @click="closeModal">{{ $t('common.cancel') }}</view>
					<view class="btn confirm" @click="saveBanner">{{ $t('common.save') }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			banners: [],
			showModal: false,
			currentBanner: {
				id: null,
				title: '',
				name: '',
				image: '',
				navigate_to: '',
				isValid: 1
			},
			submitting: false
		}
	},
	onShow() {
		this.loadBanners()
	},
	methods: {
		async loadBanners() {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				uni.showLoading({
					title: this.$t('common.loading')
				})

				const res = await axios.get(this.$baseUrl + '/manage/library/get_library_roulous_chart', {
					headers: {
						'Authorization': tk
					}
				})

				this.banners = res.data
				uni.hideLoading()
			} catch (e) {
				uni.hideLoading()
				uni.showToast({
					title: this.$t('common.loadFailed'),
					icon: 'none'
				})
			}
		},
		addBanner() {
			this.currentBanner = {
				id: null,
				title: '',
				name: '',
				image: '',
				navigate_to: '',
				isValid: 1
			}
			this.showModal = true
		},
		editBanner(banner) {
			this.currentBanner = JSON.parse(JSON.stringify(banner))
			this.showModal = true
		},
		closeModal() {
			this.showModal = false
		},
		handleStatusChange(e) {
			this.currentBanner.isValid = e.detail.value ? 1 : 0
		},
		async toggleStatus(banner) {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk

				await axios.post(this.$baseUrl + '/manage/library/edit_library_roulous_chart', {
					id: banner.id,
					isValid: banner.isValid == 1 ? 0 : 1
				}, {
					headers: {
						'Authorization': tk
					}
				})

				uni.showToast({
					title: banner.isValid == 1 ? this.$t('manage.common.disabled') : this.$t('manage.common.enabled'),
					icon: 'none'
				})

				// 更新本地数据
				banner.isValid = banner.isValid == 1 ? 0 : 1
			} catch (e) {
				uni.showToast({
					title: this.$t('common.operationFailed'),
					icon: 'none'
				})
			}
		},
		async saveBanner() {
			if (this.submitting) return

			// 表单验证
			if (!this.currentBanner.title.trim()) {
				uni.showToast({
					title: this.$t('common.inputTitle'),
					icon: 'none'
				})
				return
			}

			if (!this.currentBanner.name.trim()) {
				uni.showToast({
					title: this.$t('manage.banners.enterName'),
					icon: 'none'
				})
				return
			}

			if (!this.currentBanner.image.trim()) {
				uni.showToast({
					title: this.$t('manage.banners.enterImageUrl'),
					icon: 'none'
				})
				return
			}

			if (!this.currentBanner.navigate_to.trim()) {
				uni.showToast({
					title: this.$t('manage.banners.enterTargetUrl'),
					icon: 'none'
				})
				return
			}

			try {
				this.submitting = true
				let tk = JSON.parse(window.localStorage.getItem('token')).tk

				await axios.post(this.$baseUrl + '/manage/library/edit_library_roulous_chart', {
					id: this.currentBanner.id,
					title: this.currentBanner.title,
					name: this.currentBanner.name,
					image: this.currentBanner.image,
					navigate_to: this.currentBanner.navigate_to,
					isValid: this.currentBanner.isValid
				}, {
					headers: {
						'Authorization': tk
					}
				})

				uni.showToast({
					title: this.currentBanner.id ? this.$t('manage.common.updated') : this.$t('manage.common.added')
				})

				this.closeModal()
				this.loadBanners()
			} catch (e) {
				uni.showToast({
					title: this.$t('common.saveFailed'),
					icon: 'none'
				})
			} finally {
				this.submitting = false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background-color: var(--background-color-secondary);
	min-height: 100vh;
}

.content {
	padding: 20rpx;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: var(--text-color-primary);
	}

	.add-btn {
		padding: 10rpx 30rpx;
		background: #007AFF;
		color: #fff;
		border-radius: 30rpx;
		font-size: 28rpx;
	}
}

.banner-list {
	.banner-item {
		background: var(--card-background);
		padding: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		display: flex;
		flex-wrap: wrap;

		.banner-image {
			width: 200rpx;
			height: 120rpx;
			margin-right: 20rpx;
			flex-shrink: 0;

			image {
				width: 100%;
				height: 100%;
				border-radius: 6rpx;
			}
		}

		.banner-info {
			flex: 1;
			min-width: 0;
			overflow: hidden;

			.banner-title {
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.banner-name, .banner-link {
				font-size: 26rpx;
				color: var(--text-color-regular);
				margin-bottom: 6rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.banner-status {
				font-size: 26rpx;
				color: var(--text-color-regular);

				text {
					color: var(--text-color-secondary);

					&.active {
						color: #4CAF50;
					}
				}
			}
		}

		.banner-actions {
			display: flex;
			flex-direction: column;
			justify-content: center;
			margin-left: 20rpx;
			flex-shrink: 0;

			.action-btn {
				padding: 6rpx 20rpx;
				border-radius: 30rpx;
				font-size: 24rpx;
				color: #fff;
				margin-bottom: 10rpx;
				text-align: center;
				min-width: 80rpx;

				&.edit {
					background-color: #2196F3;
				}

				&.disable {
					background-color: #FF9800;
				}

				&.enable {
					background-color: #4CAF50;
				}
			}
		}
	}
}

.no-data {
	text-align: center;
	color: var(--text-color-secondary);
	margin-top: 100rpx;
}

.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;

	.modal-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
	}

	.modal-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 90%;
		max-width: 650rpx;
		background: var(--card-background);
		border-radius: 10rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		.modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1px solid var(--border-color);
			width: 100%;
			box-sizing: border-box;

			.modal-title {
				font-size: 32rpx;
				font-weight: bold;
			}

			.modal-close {
				font-size: 40rpx;
				color: var(--text-color-secondary);
				line-height: 1;
			}
		}

		.modal-body {
			padding: 30rpx;
			max-height: 60vh;
			overflow-y: auto;
			width: 100%;
			box-sizing: border-box;

			.form-item {
				margin-bottom: 20rpx;
				width: 100%;

				.label {
					font-size: 28rpx;
					color: var(--text-color-primary);
					margin-bottom: 10rpx;
				}

				.input {
					width: 100%;

					input {
						width: 100%;
						height: 80rpx;
						background: var(--background-color-secondary);
						padding: 0 20rpx;
						border-radius: 6rpx;
						font-size: 28rpx;
						box-sizing: border-box;
					}

					.status-text {
						margin-left: 20rpx;
						font-size: 28rpx;
						color: var(--text-color-regular);
					}
				}
			}
		}

		.modal-footer {
			display: flex;
			border-top: 1px solid var(--border-color);
			width: 100%;

			.btn {
				flex: 1;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				font-size: 30rpx;

				&.cancel {
					color: var(--text-color-regular);
					background: var(--background-color-secondary);
				}

				&.confirm {
					color: #fff;
					background: #007AFF;
				}
			}
		}
	}
}
</style>
