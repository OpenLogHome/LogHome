<template>
	<view class="container" v-dark>
		<view class="content">
			<view class="pagination" v-if="totalPages > 0">
				<view class="page-btn" :class="{disabled: currentPage === 1}" @click="prevPage">{{ $t('common.prev') }}</view>
				<view class="page-num">{{currentPage}} / {{totalPages}}</view>
				<view class="page-btn" :class="{disabled: currentPage === totalPages}" @click="nextPage">{{ $t('common.next') }}</view>
			</view>

			<view class="article-list">
				<view class="article-item" v-for="article in articles" :key="article.article_id" @click="viewArticle(article)">
					<view class="article-main">
						<view class="article-title">{{article.title}}</view>
						<view class="article-info">
							<text class="novel-name">{{article.novel_name}}</text>
							<text class="author">{{ $t('manage.common.author', { name: article.author_name }) }}</text>
						</view>
					</view>
					<view class="article-status">
						<text>{{auditStatusLabel(article.audit_status)}}</text>
					</view>
				</view>
			</view>

			<view class="pagination" v-if="totalPages > 0">
				<view class="page-btn" :class="{disabled: currentPage === 1}" @click="prevPage">{{ $t('common.prev') }}</view>
				<view class="page-num">{{currentPage}} / {{totalPages}}</view>
				<view class="page-btn" :class="{disabled: currentPage === totalPages}" @click="nextPage">{{ $t('common.next') }}</view>
			</view>

			<view class="no-data" v-if="articles.length === 0">
				{{ $t('manage.audit.empty') }}
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			articles: [],
			currentPage: 1,
			totalPages: 0,
			pageSize: 20
		}
	},
	onShow() {
		this.loadArticles()
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		async loadArticles() {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				uni.showLoading({
					title: this.$t('common.loading')
				})
				// 获取总数
				const countRes = await axios.get(this.$baseUrl + '/manage/audit/get_articles_to_audit_amount', {
					headers: {
						'Authorization': tk
					}
				})
				this.totalPages = Math.ceil(countRes.data[0].count / this.pageSize)

				// 获取列表
				const res = await axios.get(this.$baseUrl + '/manage/audit/get_articles_to_audit', {
					params: {
						page: this.currentPage
					},
					headers: {
						'Authorization': tk
					}
				})
				this.articles = res.data
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				uni.hideLoading()
			} catch (e) {
				uni.hideLoading()
				uni.showToast({
					title: this.$t('common.loadFailed'),
					icon: 'none'
				})
			}
		},
		viewArticle(article) {
			uni.navigateTo({
				url: './detail?id=' + article.article_id
			})
		},
		auditStatusLabel(status) {
			const keys = {
				'低质灌水': 'lowQuality',
				'暴恐违禁': 'violence',
				'文本色情': 'sexual',
				'政治敏感': 'political',
				'恶意推广': 'promotion',
				'低俗辱骂': 'abuse',
				'违法违规类': 'illegal',
				'暴力血腥类': 'violence',
				'色情低俗类': 'sexual',
				'政治敏感类': 'political',
				'恶意营销类': 'promotion',
				'低俗辱骂类': 'abuse'
			}
			try {
				const flags = Array.isArray(status) ? status : JSON.parse(status)
				if (!Array.isArray(flags)) throw new Error('Not an audit flag list')

				const scores = flags.reduce((result, flag) => {
					const key = keys[flag['类型']]
					if (key) result[key] = Math.max(result[key] || 0, Number(flag['分数']) || 0)
					return result
				}, {})

				const labels = Object.keys(scores).map(key => {
					return this.$t('manage.audit.status.' + key) + (scores[key] ? ' ' + scores[key] : '')
				})
				return labels.length ? labels.join(' · ') : this.$t('manage.audit.status.flagged')
			} catch (e) {
				return keys[status] ? this.$t('manage.audit.status.' + keys[status]) : this.$t('manage.audit.status.flagged')
			}
		},
		prevPage() {
			if (this.currentPage > 1) {
				this.currentPage--
				this.loadArticles()
			}
		},
		nextPage() {
			if (this.currentPage < this.totalPages) {
				this.currentPage++
				this.loadArticles()
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

.article-list {
	.article-item {
		background: var(--card-background);
		padding: 15rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		display: block;

		.article-main {
			display: block;
			margin-bottom: 10rpx;
			min-width: 0;

			.article-title {
				font-size: 32rpx;
				font-weight: bold;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 100%;
			}

			.article-info {
				font-size: 26rpx;
				color: var(--text-color-regular);
				margin-top: 8rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 100%;

				.novel-name {
					margin-right: 20rpx;
				}
			}
		}

		.article-status {
			display: inline-block;
			max-width: 100%;
			padding: 4rpx 16rpx;
			border-radius: 20rpx;
			font-size: 24rpx;
			color: #fff;
			line-height: 1.45;
			white-space: normal;
			word-break: break-word;
			background-color: #777;
		}
	}

	.article-item:active {
		background-color: var(--background-color-secondary);
	}
}

.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 30rpx 0;

	.page-btn {
		padding: 10rpx 30rpx;
		background: var(--card-background);
		border-radius: 30rpx;
		margin: 0 20rpx;

		&.disabled {
			color: var(--text-color-secondary);
		}
	}

	.page-num {
		font-size: 28rpx;
		color: var(--text-color-regular);
	}
}

.no-data {
	text-align: center;
	color: var(--text-color-secondary);
	margin-top: 100rpx;
}
</style>
