<template>
	<view class="privacy-page" v-dark>
		<view class="intro">{{ $t('settings.privacy.intro') }}</view>
		<view v-if="loading" class="status">{{ $t('settings.privacy.loading') }}</view>
		<view v-else-if="!ready" class="status">
			<view>{{ $t('settings.privacy.loadFailed') }}</view>
			<button class="retry" @click="loadSettings">{{ $t('settings.privacy.retry') }}</button>
		</view>
		<template v-else>
			<view class="privacy-card">
				<view class="section-title">{{ $t('settings.privacy.listsTitle') }}</view>
				<view class="hint">{{ $t('settings.privacy.listsHint') }}</view>
				<radio-group @change="form.follow_list_visibility = $event.detail.value">
					<label v-for="option in listOptions" :key="option" class="option" :class="{ selected: form.follow_list_visibility === option }">
						<text>{{ $t('settings.privacy.lists.' + option) }}</text>
						<radio :value="option" :checked="form.follow_list_visibility === option" :disabled="saving" color="#EA7034" />
					</label>
				</radio-group>
			</view>
			<view class="privacy-card">
				<view class="section-title">{{ $t('settings.privacy.messagesTitle') }}</view>
				<view class="hint">{{ $t('settings.privacy.messagesHint') }}</view>
				<radio-group @change="form.direct_message_policy = $event.detail.value">
					<label v-for="option in messageOptions" :key="option" class="option" :class="{ selected: form.direct_message_policy === option }">
						<text>{{ $t('settings.privacy.messages.' + option) }}</text>
						<radio :value="option" :checked="form.direct_message_policy === option" :disabled="saving" color="#EA7034" />
					</label>
				</radio-group>
			</view>
			<button class="save" :loading="saving" :disabled="saving || !changed" @click="saveSettings">{{ $t('settings.privacy.save') }}</button>
			<view class="footnote">{{ $t('settings.privacy.savedHint') }}</view>
		</template>
	</view>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			form: { follow_list_visibility: 'public', direct_message_policy: 'default' },
			original: '', loading: true, ready: false, saving: false,
			listOptions: ['public', 'following_only', 'fans_only', 'private'],
			messageOptions: ['default', 'following', 'mutual', 'none']
		}
	},
	computed: {
		changed() { return JSON.stringify(this.form) !== this.original }
	},
	onLoad() { this.loadSettings() },
	methods: {
		requestOptions() {
			const token = JSON.parse(window.localStorage.getItem('token') || 'null')
			if (!token || !token.tk) throw new Error('LOGIN_REQUIRED')
			return { headers: { Authorization: 'Bearer ' + token.tk }, timeout: 15000 }
		},
		async loadSettings() {
			this.loading = true
			this.ready = false
			try {
				const { data } = await axios.get(this.$baseUrl + '/users/privacy_settings', this.requestOptions())
				this.form = { follow_list_visibility: data.follow_list_visibility, direct_message_policy: data.direct_message_policy }
				this.original = JSON.stringify(this.form)
				this.ready = true
			} catch (error) {
				this.showError(error, 'loadFailed')
			} finally { this.loading = false }
		},
		async saveSettings() {
			if (!this.ready || this.saving || !this.changed) return
			this.saving = true
			try {
				const { data } = await axios.post(this.$baseUrl + '/users/privacy_settings', this.form, this.requestOptions())
				this.form = { follow_list_visibility: data.follow_list_visibility, direct_message_policy: data.direct_message_policy }
				this.original = JSON.stringify(this.form)
				uni.showToast({ title: this.$t('settings.privacy.saved'), icon: 'none' })
			} catch (error) { this.showError(error, 'saveFailed') } finally { this.saving = false }
		},
		showError(error, key) {
			const loginRequired = error.message === 'LOGIN_REQUIRED' || (error.response && error.response.status === 401)
			uni.showToast({ title: this.$t('settings.privacy.' + (loginRequired ? 'loginRequired' : key)), icon: 'none' })
		}
	}
}
</script>

<style scoped lang="scss">
.privacy-page { min-height: 100vh; box-sizing: border-box; padding: 28rpx 28rpx calc(36rpx + env(safe-area-inset-bottom)); background: var(--background-color-secondary); color: var(--text-color-regular); }
.intro, .hint, .footnote { font-size: 26rpx; line-height: 1.6; color: var(--text-color-secondary); }
.intro { margin: 0 8rpx 24rpx; }
.privacy-card { padding: 30rpx; margin-bottom: 24rpx; border-radius: 24rpx; background: var(--card-background); }
.section-title { font-size: 32rpx; font-weight: 600; margin-bottom: 12rpx; }
.hint { margin-bottom: 20rpx; }
.option { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; min-height: 88rpx; padding: 8rpx 20rpx; margin-top: 12rpx; border: 1px solid var(--border-color); border-radius: 14rpx; font-size: 28rpx; box-sizing: border-box; }
.option.selected { border-color: #EA7034; background: rgba(234, 112, 52, .07); }
.save, .retry { background: #EA7034; color: white; font-size: 30rpx; border-radius: 16rpx; }
.save[disabled] { opacity: .5; }
.footnote { margin-top: 16rpx; text-align: center; }
.status { padding: 60rpx 20rpx; text-align: center; font-size: 28rpx; }
.retry { margin-top: 24rpx; }
</style>
