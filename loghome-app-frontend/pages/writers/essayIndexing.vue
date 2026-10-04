<template>
	<view v-if="aiAssistanceEnabled" v-dark>
		<view class="list-content">
			<view class="list">
				<view class="li high noborder">
					<view class="text index-progress-text">
						<view class="index-progress-header">
							<view class="index-progress-head">
								<view class="index-progress-title">全文智能索引</view>
								<view class="index-progress-state">{{ indexQueueStatusText }} <span v-if="indexQueueDetailText">，{{ indexQueueDetailText }}</span></view>
							</view>
							<view
								class="index-progress-action"
								:class="{ disabled: indexingActionLoading }"
								@click="requestNovelIndexingNow"
							>
								{{ indexingActionLoading ? '提交中' : '立即索引' }}
							</view>
						</view>
						<view class="index-progress-bar" v-if="indexProgress.total > 0">
							<view
								class="index-progress-bar-fill"
								:style="{ width: indexProgressPercent + '%' }"
							></view>
						</view>
						<view class="index-progress-meta" v-if="indexProgress.total > 0">
							正式版：{{ indexProgress.outdated }} 章过期，{{ indexProgress.pending }} 章未索引
						</view>
						<view class="index-progress-meta" v-if="authorDraftIndexProgress.total > 0">
							作者存稿版：{{ authorDraftIndexProgress.outdated }} 章过期，{{ authorDraftIndexProgress.pending }} 章未索引
						</view>
						<view class="index-progress-lists" v-if="indexIssueGroups.length > 0">
							<view class="index-progress-list-group" v-for="group in indexIssueGroups" :key="group.key">
								<view class="index-progress-list-title">{{ group.title }}</view>
								<view
									class="index-progress-list-item"
									v-for="(article, index) in group.items"
									:key="group.key + '-' + (article.article_id || index)"
								>
									<view class="index-progress-list-index">{{ index + 1 }}.</view>
									<view class="index-progress-list-text">{{ getIndexGroupArticleTitle(group.key, article, index) }}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import axios from 'axios'
	import darkModeMixin from '@/mixins/dark-mode.js'
	export default {
		data() {
			return {
				id: -1,
				articles: [],
				indexingStatus: {
					status: 'none',
					queue: null,
				},
				indexingActionLoading: false,
				indexStatusPollTimer: null,
			}
		},
		mixins: [darkModeMixin],
		watch: {
			aiAssistanceEnabled(enabled) { if (!enabled) this.stopIndexStatusPolling(); }
		},
		computed: {
			indexableArticles() {
				return (this.articles || []).filter((article) => {
					return article.article_type === 'richtext' && Number(article.is_draft) !== 1;
				});
			},
			authorDraftIndexableArticles() {
				return this.indexableArticles.filter((article) => this.hasDistinctAuthorDraft(article));
			},
			pendingIndexArticles() {
				return this.indexableArticles.filter((article) => {
					return !article.index_update_time;
				});
			},
			outdatedIndexArticles() {
				return this.indexableArticles.filter((article) => {
					return !!article.index_update_time && Number(article.index_is_current) !== 1;
				});
			},
			pendingAuthorDraftIndexArticles() {
				return this.authorDraftIndexableArticles.filter((article) => {
					return !(article.article_writer && article.article_writer.index_update_time);
				});
			},
			outdatedAuthorDraftIndexArticles() {
				return this.authorDraftIndexableArticles.filter((article) => {
					return !!(article.article_writer && article.article_writer.index_update_time)
						&& Number(article.article_writer.index_is_current) !== 1;
				});
			},
			indexProgress() {
				const progress = {
					total: 0,
					indexed: 0,
					outdated: 0,
					pending: 0,
				};

				const indexableArticles = this.indexableArticles;

				progress.total = indexableArticles.length;

				indexableArticles.forEach((article) => {
					if (!article.index_update_time) {
						progress.pending += 1;
						return;
					}

					if (Number(article.index_is_current) === 1) {
						progress.indexed += 1;
						return;
					}

					progress.outdated += 1;
				});

				return progress;
			},
			indexProgressPercent() {
				if (!this.indexProgress.total) {
					return 0;
				}
				return Math.round((this.indexProgress.indexed / this.indexProgress.total) * 100);
			},
			authorDraftIndexProgress() {
				const progress = {
					total: 0,
					indexed: 0,
					outdated: 0,
					pending: 0,
				};

				const indexableArticles = this.authorDraftIndexableArticles;
				progress.total = indexableArticles.length;

				indexableArticles.forEach((article) => {
					const writerArticle = article.article_writer || {};
					if (!writerArticle.index_update_time) {
						progress.pending += 1;
						return;
					}

					if (Number(writerArticle.index_is_current) === 1) {
						progress.indexed += 1;
						return;
					}

					progress.outdated += 1;
				});

				return progress;
			},
			indexIssueGroups() {
				const groups = [];
				if (this.pendingIndexArticles.length > 0) {
					groups.push({
						key: 'reader-pending',
						title: '正式版未索引章节',
						items: this.pendingIndexArticles,
					});
				}
				if (this.outdatedIndexArticles.length > 0) {
					groups.push({
						key: 'reader-outdated',
						title: '正式版过期章节',
						items: this.outdatedIndexArticles,
					});
				}
				if (this.pendingAuthorDraftIndexArticles.length > 0) {
					groups.push({
						key: 'author-pending',
						title: '作者存稿未索引章节',
						items: this.pendingAuthorDraftIndexArticles,
					});
				}
				if (this.outdatedAuthorDraftIndexArticles.length > 0) {
					groups.push({
						key: 'author-outdated',
						title: '作者存稿过期章节',
						items: this.outdatedAuthorDraftIndexArticles,
					});
				}
				return groups;
			},
			indexQueueStatusText() {
				const status = this.indexingStatus && this.indexingStatus.status;
				if (status === 'queued') {
					return '排队中';
				}
				if (status === 'indexing') {
					return '正在索引';
				}
				return '无索引计划';
			},
			indexQueueDetailText() {
				const queue = this.indexingStatus && this.indexingStatus.queue;
				const status = this.indexingStatus && this.indexingStatus.status;

				if (!queue) {
					return '';
				}

				if (status === 'indexing') {
					if (queue.current_article_title) {
						return '当前章节：' + queue.current_article_title;
					}
					if (queue.total_chapters > 0) {
						return '本轮任务 ' + queue.completed_chapters + ' / ' + queue.total_chapters;
					}
				}

				if (status === 'queued' && queue.pending_chapters > 0) {
					if (Number(queue.ahead_count || 0) > 0) {
						return '前方还有 ' + queue.ahead_count + ' 本作品，待处理 ' + queue.pending_chapters + ' 项';
					}
					return '即将开始，待处理 ' + queue.pending_chapters + ' 项';
				}

				return '';
			},
		},
		onLoad(params) {
			if (!this.aiAssistanceEnabled) return;
			this.id = params.id;
			this.refreshPage();
		},
		onShow() {
			if (!this.ensureAiPageAllowed()) return;
			this.refreshPage();
			this.startIndexStatusPolling();
		},
		onHide() {
			this.stopIndexStatusPolling();
		},
		onUnload() {
			this.stopIndexStatusPolling();
		},
		methods: {
			getTokenInfo() {
				let token = JSON.parse(window.localStorage.getItem('token'));
				return token || null;
			},
			getAuthToken() {
				const token = this.getTokenInfo();
				return token ? token.tk : null;
			},
			async loadArticles() {
				const tk = this.getAuthToken();
				const res = await axios.get(this.$baseUrl + '/essays/get_articles?id=' + this.id, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				});
				return res.data || [];
			},
			async loadIndexingStatus() {
				const tk = this.getAuthToken();
				const res = await axios.get(this.$baseUrl + '/essays/get_novel_indexing_status?novel_id=' + this.id, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				});
				return res.data || {
					status: 'none',
					queue: null,
				};
			},
			parseTime(value) {
				if (!value) {
					return 0;
				}
				if (value instanceof Date) {
					return Number.isNaN(value.getTime()) ? 0 : value.getTime();
				}

				if (typeof value === 'number') {
					return Number.isFinite(value) ? value : 0;
				}

				const rawValue = String(value).trim();
				if (!rawValue) {
					return 0;
				}

				let parsed = new Date(rawValue).getTime();
				if (!Number.isNaN(parsed)) {
					return parsed;
				}

				parsed = new Date(rawValue.replace(' ', 'T')).getTime();
				if (!Number.isNaN(parsed)) {
					return parsed;
				}

				parsed = new Date(rawValue.replace(/-/g, '/')).getTime();
				return Number.isNaN(parsed) ? 0 : parsed;
			},
			hasDistinctAuthorDraft(article) {
				const writerArticle = article && article.article_writer ? article.article_writer : null;
				if (!writerArticle) {
					return false;
				}

				return String(writerArticle.content_hash || '') !== String(article.content_hash || '')
					|| String(writerArticle.title || '') !== String(article.title || '');
			},
			getArticleDisplayTitle(article, index) {
				const title = article && article.title ? String(article.title).trim() : '';
				if (title) {
					return title;
				}
				return '未命名章节 ' + (index + 1);
			},
			getAuthorDraftDisplayTitle(article, index) {
				const writerArticle = article && article.article_writer ? article.article_writer : null;
				const title = writerArticle && writerArticle.title ? String(writerArticle.title).trim() : '';
				if (title) {
					return title;
				}
				return this.getArticleDisplayTitle(article, index);
			},
			getIndexGroupArticleTitle(groupKey, article, index) {
				if (String(groupKey || '').indexOf('author-') === 0) {
					return this.getAuthorDraftDisplayTitle(article, index);
				}
				return this.getArticleDisplayTitle(article, index);
			},
			async refreshIndexingStatus(silent = false) {
				if (!this.aiAssistanceEnabled) return;
				try {
					this.indexingStatus = await this.loadIndexingStatus();
				} catch (error) {
					if (!silent) {
						uni.showToast({
							title: error.toString(),
							icon: 'none',
							duration: 2000
						});
					}
				}
			},
			startIndexStatusPolling() {
				this.stopIndexStatusPolling();
				if (!this.aiAssistanceEnabled) return;
				this.indexStatusPollTimer = setInterval(() => {
					this.refreshIndexingStatus(true);
				}, 10000);
			},
			stopIndexStatusPolling() {
				if (this.indexStatusPollTimer) {
					clearInterval(this.indexStatusPollTimer);
					this.indexStatusPollTimer = null;
				}
			},
			async requestNovelIndexingNow() {
				if (!this.aiAssistanceEnabled) return;
				if (this.indexingActionLoading) {
					return;
				}

				const tk = this.getAuthToken();
				this.indexingActionLoading = true;
				try {
					const res = await axios.post(this.$baseUrl + '/essays/request_novel_indexing',
						{
							novel_id: this.id
						},
						{
							headers: {
								'Content-Type': 'application/json',
								'Authorization': 'Bearer ' + tk
							}
						}
					);

					this.indexingStatus = res.data || this.indexingStatus;
					uni.showToast({
						title: '已加入索引队列',
						icon: 'none',
						duration: 2000
					});
				} catch (error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				} finally {
					this.indexingActionLoading = false;
				}
			},
			refreshPage() {
				Promise.all([
					this.loadArticles(),
					this.loadIndexingStatus(),
				]).then(([articles, indexingStatus]) => {
					this.articles = articles;
					this.indexingStatus = indexingStatus;
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(function() {})
			},
		}
	}
</script>

<style scoped lang="scss">

.text{
	font-size: 30rpx;
	width: 100%;
	
	.dark-mode & {
		color: var(--text-color-primary);
	}
}		

.index-progress-text {
	display: block !important;
	padding-top: 28rpx;
	padding-bottom: 28rpx;
}

.index-progress-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16rpx;
}

.index-progress-head {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.index-progress-title {
	font-size: 32rpx;
	font-weight: 600;

	.dark-mode & {
		color: var(--text-color-primary);
	}
}

.index-progress-state {
	font-size: 24rpx;

	.dark-mode & {
		color: var(--text-color-secondary);
	}
}

.index-progress-action {
	flex-shrink: 0;
	padding: 10rpx 18rpx;
	border: 1px solid #d8cabd;
	border-radius: 999rpx;
	font-size: 24rpx;
	line-height: 1;

	.dark-mode & {
		border-color: var(--border-color);
		color: var(--text-color-regular);
	}
}

.index-progress-action.disabled {
	opacity: 0.6;
}

.index-progress-summary {
	margin-top: 10rpx;
	font-size: 28rpx;

	.dark-mode & {
		color: var(--text-color-regular);
	}
}

.index-progress-queue {
	margin-top: 10rpx;
	font-size: 24rpx;
	line-height: 1.6;

	.dark-mode & {
		color: var(--text-color-secondary);
	}
}

.index-progress-bar {
	margin-top: 18rpx;
	height: 12rpx;
	border-radius: 999rpx;
	overflow: hidden;
	background-color: #efe7de;

	.dark-mode & {
		background-color: rgba(255, 255, 255, 0.08);
	}
}

.index-progress-bar-fill {
	height: 100%;
	border-radius: 999rpx;
	background-color: #8f735e;
}

.index-progress-meta {
	margin-top: 14rpx;
	font-size: 24rpx;
	line-height: 1.6;
	color: #8f7968;

	.dark-mode & {
		color: var(--text-color-secondary);
	}
}

.index-progress-lists {
	margin-top: 18rpx;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.index-progress-list-group {
	padding: 20rpx 24rpx;
	border-radius: 20rpx;
	background-color: #f7f0e8;

	.dark-mode & {
		background-color: rgba(255, 255, 255, 0.06);
	}
}

.index-progress-list-title {
	font-size: 24rpx;
	font-weight: 600;
	color: #7c6553;

	.dark-mode & {
		color: var(--text-color-primary);
	}
}

.index-progress-list-item {
	margin-top: 12rpx;
	display: flex;
	align-items: flex-start;
	gap: 10rpx;
}

.index-progress-list-index {
	flex-shrink: 0;
	font-size: 24rpx;
	line-height: 1.6;
	color: #8f7968;

	.dark-mode & {
		color: var(--text-color-secondary);
	}
}

.index-progress-list-text {
	flex: 1;
	font-size: 24rpx;
	line-height: 1.6;
	color: #8f7968;
	word-break: break-all;

	.dark-mode & {
		color: var(--text-color-secondary);
	}
}

page{
	background-color:rgb(255, 248, 234);
	font-size: 30upx;
	
	&.dark-mode {
		background-color: var(--background-color-secondary);
	}
}
.list-content{
	background: #fff;
	margin-top:20upx;
	
	.dark-mode & {
		background: var(--card-background);
	}
}
.list{
	width:100%;
	border-bottom:15upx solid #f2f2f2;
	background: #fff;
	
	.dark-mode & {
		background: var(--card-background);
		border-bottom:15upx solid var(--border-color);
	}
	
	&:last-child{
		border: none;
	}
	.li{
		width:92%;
		height:100upx;
		padding:0 4%;
		border-bottom:1px solid rgb(255, 248, 234);
		display:flex;
		align-items:center;
		
		.dark-mode & {
			border-bottom:1px solid var(--border-color);
		}
		
		&.noborder{
			border-bottom:0
		}
		.icon{
			flex-shrink:0;
			width:50upx;
			height:50upx;
			img{
				width:50upx;
				height:50upx;
			}
		}
		.text{
			display: flex;
			flex-wrap: wrap;
			padding-left:20upx;
			width:100%;
			color:#666;
			
			.dark-mode & {
				color: var(--text-color-regular);
			}
		}
		.to{
			flex-shrink:0;
			width:40upx;
			height:40upx;
		}
	}
	.li.high{
		height:auto;
		min-height:100upx;
	}
}
</style>
