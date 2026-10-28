<template>
	<view class="export-page" v-dark>
		<view class="export-card">
			<view class="book-name">{{ novelName || '作品' }}</view>
			<view class="description">将作品保存为电子书，方便离线阅读和备份。</view>
			<view class="field-label">导出格式</view>
			<view class="format-options">
				<button v-for="format in ['pdf', 'epub']" :key="format" class="format-option"
					:class="{ selected: exportFormat === format }" :disabled="exporting"
					@click="exportFormat = format">{{ format.toUpperCase() }}</button>
			</view>
			<view class="description">PDF 保留固定排版，EPUB 适合电子书阅读器。</view>
			<view class="export-actions">
				<button class="primary-button" :disabled="exporting || !novelId" :loading="exporting && activeType === 'published'"
					@click="exportNovel('published')">导出读者版本</button>
				<view class="version-hint">包含已发布章节，使用读者当前可见的内容。</view>
				<button class="secondary-button" :disabled="exporting || !novelId" :loading="exporting && activeType === 'draft'"
					@click="exportNovel('draft')">导出存稿版本</button>
				<view class="version-hint">包含草稿及已发布章节，使用已保存到云端的最新内容。</view>
			</view>
			<view v-if="exporting" class="status-message" role="status">正在生成电子书，请稍候。内容较多时可能需要几分钟。</view>
			<view v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</view>
			<view v-if="downloadUrl && !exporting" class="download-result">
				<view class="download-name">{{ downloadFileName }}</view>
				<button class="primary-button" @click="downloadFile">下载电子书</button>
				<view class="version-hint">下载链接 15 分钟内有效，失效后请重新导出。</view>
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			novelId: 0,
			novelName: '',
			exportFormat: 'pdf',
			exporting: false,
			activeType: '',
			errorMessage: '',
			downloadUrl: '',
			downloadFileName: '',
			disposed: false,
		}
	},
	onLoad(params) {
		const id = Number(params.id)
		if (!Number.isSafeInteger(id) || id <= 0) {
			this.errorMessage = '作品信息无效，请返回作品目录后重试。'
			return
		}
		this.novelId = id
		if (params.name) {
			try { this.novelName = decodeURIComponent(params.name) } catch (_) { this.novelName = params.name }
		}
		if (!this.novelName) this.loadNovelName()
	},
	onUnload() {
		this.disposed = true
		this.downloadUrl = ''
	},
	methods: {
		getAuthToken() {
			try {
				const token = JSON.parse(window.localStorage.getItem('token'))
				return token && token.tk
			} catch (_) {
				return null
			}
		},
		async loadNovelName() {
			try {
				const response = await axios.get(this.$baseUrl + '/essays/get_novel_by_id', { params: { id: this.novelId } })
				if (!this.disposed) this.novelName = (response.data[0] || {}).name || ''
			} catch (_) {
				// The export request still checks the work and author permissions.
			}
		},
		async getErrorMessage(error) {
			const response = error && error.response
			let data = response && response.data
			if (typeof Blob !== 'undefined' && data instanceof Blob) {
				try { data = JSON.parse(await data.text()) } catch (_) { data = null }
			}
			if (response && response.status === 401) return '登录已过期，请重新登录后导出。'
			if (data && typeof data.msg === 'string') return data.msg
			if (data && typeof data.message === 'string') return data.message
			if (response && response.status === 403) return '只有作品作者可以导出电子书。'
			if (error && error.code === 'ECONNABORTED') return '生成电子书超时，请稍后重试。'
			return '导出失败，请检查网络后重试。'
		},
		async exportNovel(exportType) {
			if (this.exporting || !this.novelId || !['published', 'draft'].includes(exportType)) return
			const token = this.getAuthToken()
			if (!token) {
				this.errorMessage = '请先登录后再导出电子书。'
				return
			}
			const format = this.exportFormat
			if (!['pdf', 'epub'].includes(format)) return
			const novelName = this.novelName || '作品' + this.novelId
			this.exporting = true
			this.activeType = exportType
			this.errorMessage = ''
			this.downloadUrl = ''
			this.downloadFileName = ''
			try {
				const response = await axios.get(this.$baseUrl + '/essays/export_novel', {
					params: { id: this.novelId, export_type: exportType, export_format: format, download_mode: 'url' },
					headers: { Authorization: 'Bearer ' + token },
					timeout: 300000,
				})
				if (this.disposed) return
				const data = response.data
				if (response.status !== 200 || !data || typeof data.download_url !== 'string' || !data.download_url) {
					throw { response }
				}
				// Only download from the configured API; authentication is never placed in the URL.
				const apiUrl = new URL(this.$baseUrl)
				const downloadUrl = new URL(data.download_url, this.$baseUrl.replace(/\/+$/, '') + '/')
				if (!['https:', 'http:'].includes(downloadUrl.protocol) || downloadUrl.origin !== apiUrl.origin) {
					throw new Error('Invalid download URL')
				}
				const defaultFileName = novelName + '-' + (exportType === 'published' ? '读者版' : '存稿版') + '.' + format
				const fileName = typeof data.filename === 'string' && data.filename.endsWith('.' + format)
					? data.filename : defaultFileName
				this.downloadFileName = fileName.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_')
				this.downloadUrl = downloadUrl.href
			} catch (error) {
				const message = await this.getErrorMessage(error)
				if (!this.disposed) this.errorMessage = message
			} finally {
				if (!this.disposed) this.exporting = false
			}
		},
		async downloadFile() {
			if (!this.downloadUrl || this.exporting) return
			this.errorMessage = ''
			try {
				const bridge = window.jsBridge
				if (bridge && bridge.inApp && typeof bridge.openInBrowser === 'function') {
					const opened = await bridge.openInBrowser(this.downloadUrl)
					if (opened === false) throw new Error('Browser unavailable')
				} else {
					const link = document.createElement('a')
					link.href = this.downloadUrl
					link.download = this.downloadFileName
					link.target = '_blank'
					link.rel = 'noopener noreferrer'
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link)
				}
			} catch (_) {
				if (!this.disposed) this.errorMessage = '无法打开下载，请重试或使用浏览器导出。'
			}
		},
	},
}
</script>

<style scoped lang="scss">
.export-page {
	min-height: 100vh;
	box-sizing: border-box;
	padding: 32rpx;
	background: var(--background-color-secondary, #fff8ea);
	color: var(--text-color-primary, #333);
}
.export-card {
	max-width: 640px;
	margin: 0 auto;
	padding: 36rpx;
	border-radius: 20rpx;
	background: var(--card-background, #fff);
}
.book-name { font-size: 38rpx; font-weight: 600; overflow-wrap: anywhere; }
.description, .version-hint { color: var(--text-color-regular, #777); font-size: 26rpx; line-height: 1.7; margin-top: 16rpx; }
.field-label { font-size: 30rpx; margin: 36rpx 0 20rpx; }
.format-options { display: flex; gap: 20rpx; }
.format-option { flex: 1; margin: 0; font-size: 28rpx; background: var(--background-color-secondary, #f7f5f0); color: inherit; }
.format-option.selected { color: #b46f58; background: rgba(180, 111, 88, 0.14); outline: 1px solid #b46f58; }
.export-actions { margin-top: 36rpx; }
.primary-button, .secondary-button { font-size: 30rpx; border-radius: 12rpx; }
.primary-button { color: #fff; background: #b46f58; }
.secondary-button { margin-top: 30rpx; color: #b46f58; background: rgba(180, 111, 88, 0.12); }
.status-message, .error-message { margin-top: 30rpx; font-size: 28rpx; line-height: 1.7; }
.error-message { color: #c64e3d; }
.download-result { margin-top: 36rpx; padding-top: 24rpx; border-top: 1px solid rgba(128, 128, 128, 0.2); }
.download-name { margin-bottom: 20rpx; font-size: 28rpx; overflow-wrap: anywhere; }
</style>
