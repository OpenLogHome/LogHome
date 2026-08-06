<template>
	<!-- 播放器界面和操作均由 Android 原生层接管；此组件只同步段落高亮。 -->
	<div class="audiobook-highlight-bridge" aria-hidden="true"></div>
</template>

<script>
export default {
	name: 'AudiobookPlayer',
	props: {
		articleIds: {
			type: Array,
			default: () => []
		},
		articles: {
			type: Array,
			default: () => []
		},
		playlistKey: {
			type: String,
			default: ''
		},
		coverUrl: {
			type: String,
			default: ''
		},
		bookTitle: {
			type: String,
			default: ''
		},
		startArticleId: {
			default: ''
		}
	},
	data() {
		return {
			lastProgressKey: ''
		};
	},
	mounted() {
		window.addEventListener('loghome:audiobook-progress', this.handleNativeProgress);
		this.syncNativeProgress();
	},
	beforeDestroy() {
		window.removeEventListener('loghome:audiobook-progress', this.handleNativeProgress);
	},
	methods: {
		async syncNativeProgress() {
			if (!window.jsBridge || !window.jsBridge.getPlaybackProgress) return;
			try {
				const result = await window.jsBridge.getPlaybackProgress();
				const progress = typeof result === 'string' ? JSON.parse(result) : result;
				this.applyNativeProgress(progress || {});
			} catch (error) {
				console.warn('syncNativeAudiobookProgress failed', error);
			}
		},
		async openNativePlayer(startParagraphId = null) {
			if (!window.jsBridge || !window.jsBridge.openNativeAudiobookPlayer) {
				uni.showToast({
					title: '当前版本不支持原生听书播放器',
					icon: 'none'
				});
				return false;
			}

			const articleIds = this.articleIds
				.map(id => String(id))
				.filter(Boolean);
			if (articleIds.length === 0) {
				uni.showToast({ title: '没有可播放的章节', icon: 'none' });
				return false;
			}

			try {
				const payload = {
					articleIds,
					startArticleId: String(this.startArticleId || articleIds[0]),
					startParagraphId: startParagraphId == null ? null : String(startParagraphId),
					bookTitle: this.bookTitle || '',
					coverUrl: this.coverUrl || '',
					playlistKey: this.playlistKey || ''
				};
				if (this.articles.length > 0) {
					payload.articles = this.articles;
				}
				await window.jsBridge.openNativeAudiobookPlayer(payload);
				return true;
			} catch (error) {
				console.error('openNativeAudiobookPlayer failed', error);
				uni.showToast({
					title: '无法打开听书播放器，请稍后重试',
					icon: 'none'
				});
				return false;
			}
		},
		handleNativeProgress(event) {
			const detail = event && event.detail ? event.detail : {};
			this.applyNativeProgress(detail);
		},
		applyNativeProgress(detail) {
			if (detail.articleId == null || detail.paragraphId == null) return;
			const progressKey = `${detail.articleId}:${detail.paragraphId}`;
			if (progressKey === this.lastProgressKey) return;
			this.lastProgressKey = progressKey;
			this.$emit('change', {
				articleId: String(detail.articleId),
				paragraphId: String(detail.paragraphId)
			});
		}
	}
};
</script>

<style scoped>
.audiobook-highlight-bridge {
	display: none;
}
</style>
