<template>
	<view class="container">		
		<view class="content">
			<view class="pagination" v-if="totalPages > 0">
				<view class="page-btn" :class="{disabled: currentPage === 1}" @click="prevPage">上一页</view>
				<view class="page-num">{{currentPage}} / {{totalPages}}</view>
				<view class="page-btn" :class="{disabled: currentPage === totalPages}" @click="nextPage">下一页</view>
			</view>

			<view class="article-list">
				<view class="article-item" v-for="article in articles" :key="article.article_id" @click="viewArticle(article)">
					<view class="article-main">
						<view class="article-title">{{article.title}}</view>
						<view class="article-info">
							<text class="novel-name">{{article.novel_name}}</text>
							<text class="author">作者: {{article.author_name}}</text>
						</view>
					</view>
					<view class="article-status" :class="article.audit_status">
						<text>{{article.audit_status}}</text>
					</view>
				</view>
			</view>
			
			<view class="pagination" v-if="totalPages > 0">
				<view class="page-btn" :class="{disabled: currentPage === 1}" @click="prevPage">上一页</view>
				<view class="page-num">{{currentPage}} / {{totalPages}}</view>
				<view class="page-btn" :class="{disabled: currentPage === totalPages}" @click="nextPage">下一页</view>
			</view>
			
			<view class="no-data" v-if="articles.length === 0">
				暂无待审核文章
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
					title: '努力加载中'
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
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		},
		viewArticle(article) {
			uni.navigateTo({
				url: './detail?id=' + article.article_id
			})
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
	background-color: #f2f2f2;
	min-height: 100vh;
}

.content {
	padding: 20rpx;
}

.article-list {
	.article-item {
		background: #fff;
		padding: 15rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.article-main {
			display: flex;
			align-items: center;
			margin-bottom: 10rpx;
			flex: 1;
			min-width: 0;
			
			.article-title {
				font-size: 32rpx;
				font-weight: bold;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 70%;
			}
			
			.article-info {
				font-size: 26rpx;
				color: #666;
				margin-left: 20rpx;
				flex-shrink: 0;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 40%;
				
				.novel-name {
					margin-right: 20rpx;
				}
			}
		}
		
		.article-status {
			flex-shrink: 0;
			padding: 4rpx 20rpx;
			border-radius: 20rpx;
			font-size: 24rpx;
			color: #fff;
			background-color: #999;
			margin-left: 15rpx;
			
			&.低质灌水 { background-color: #ff9800; }
			&.暴恐违禁 { background-color: #f44336; }
			&.文本色情 { background-color: #e91e63; }
			&.政治敏感 { background-color: #9c27b0; }
			&.恶意推广 { background-color: #673ab7; }
			&.低俗辱骂 { background-color: #3f51b5; }
		}
	}

	.article-item:active {
		background-color: #f2f2f2;
	}
}

.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 30rpx 0;
	
	.page-btn {
		padding: 10rpx 30rpx;
		background: #fff;
		border-radius: 30rpx;
		margin: 0 20rpx;
		
		&.disabled {
			color: #999;
		}
	}
	
	.page-num {
		font-size: 28rpx;
		color: #666;
	}
}

.no-data {
	text-align: center;
	color: #999;
	margin-top: 100rpx;
}
</style> 