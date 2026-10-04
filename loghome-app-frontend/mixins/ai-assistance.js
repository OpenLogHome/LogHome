import { syncAiPreference } from '@/common/ai-preference.js'

export default {
	computed: {
		aiAssistanceEnabled() { return !this.$store.state.aiAssistanceDisabled }
	},
	onShow() { syncAiPreference(this.$store) },
	methods: {
		// 防止收藏链接、外部深链或已经打开的 AI 页面绕过隐藏入口。
		ensureAiPageAllowed() {
			syncAiPreference(this.$store)
			if (this.aiAssistanceEnabled) return true
			uni.showToast({ title: this.$t('settings.ai.disabledNotice'), icon: 'none' })
			if (typeof getCurrentPages === 'function' && getCurrentPages().length > 1) {
				uni.navigateBack({ delta: 1 })
			} else {
				uni.switchTab({ url: '/pages/me' })
			}
			return false
		}
	}
}
