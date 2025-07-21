<template>
	<view class="content" v-dark :style="{'--statusBarHeight': 0 + 'px'}">
		<div class="header">
			<div class="article-info">
				<h3 class="article-title">{{ articleInfo.title }}</h3>
				<div class="feedback-count">
					共有 <span class="count">{{ feedbacks.length }}</span> 条错误反馈
				</div>
			</div>
			
			<div class="filter-options">
				<el-radio-group v-model="statusFilter" size="mini" @change="filterFeedbacks">
					<el-radio-button label="all">全部</el-radio-button>
					<el-radio-button label="0">未处理</el-radio-button>
					<el-radio-button label="1">已处理</el-radio-button>
				</el-radio-group>
			</div>
		</div>
		
		<div class="feedback-list">
			<div v-if="filteredFeedbacks.length === 0" class="no-data">
				暂无错误反馈
			</div>
			
			<div v-for="(feedback, index) in filteredFeedbacks" :key="feedback.feedback_id" class="feedback-item">
				<div class="feedback-header">
					<div class="user-info">
						<log-image :src="feedback.avatar_url || '../../static/user/default_avatar.png'" mode="aspectFill" class="avatar"></log-image>
						<span class="username">{{ feedback.username }}</span>
					</div>
					<div class="feedback-time">{{ utc2beijing(feedback.create_time) }}</div>
				</div>
				
				<div class="paragraph-content">
					<div class="label">问题段落:</div>
					<div class="text">{{ feedback.paragraph_text }}</div>
				</div>
				
				<div class="feedback-content">
					<div class="label">反馈内容:</div>
					<div class="text">{{ feedback.feedback_content }}</div>
				</div>
				
				<div class="feedback-actions">
					<el-button 
						size="mini" 
						:type="feedback.status === 0 ? 'primary' : 'success'"
						@click="handleFeedbackStatus(feedback)">
						{{ feedback.status === 0 ? '标记为已处理' : '标记为未处理' }}
					</el-button>
					
					<el-button 
						size="mini" 
						type="warning"
						@click="gotoEditor(feedback)">
						编辑章节
					</el-button>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
import axios from 'axios'
import LogImage from '../../components/LogImage.vue'

export default {
	components: {
		LogImage
	},
	data() {
		return {
			articleId: -1,
			articleInfo: {},
			feedbacks: [],
			filteredFeedbacks: [],
			statusFilter: 'all'
		}
	},
	onLoad(option) {
		if (option.id) {
			this.articleId = option.id
			this.loadArticleInfo()
			this.loadFeedbacks()
		} else {
			uni.showToast({
				title: '参数错误',
				icon: 'none'
			})
		}
	},
	methods: {
		utc2beijing(utc_datetime) {
			// 转为正常的时间格式 年-月-日 时:分:秒
			var T_pos = utc_datetime.indexOf('T');
			var Z_pos = utc_datetime.indexOf('Z');
			var year_month_day = utc_datetime.substr(0,T_pos);
			var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
			var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
		
			// 处理成为时间戳
			timestamp = new Date(Date.parse(new_datetime));
			timestamp = timestamp.getTime();
			timestamp = timestamp/1000;
		
			// 增加8个小时，北京时间比utc时间多八个时区
			var timestamp = timestamp+8*60*60;
		
			// 时间戳转为时间
			var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString("chinese",{ hour12: false }).replace(/年|月/g, "-").replace(/日/g, " ");
			return beijing_datetime; // 2017-03-31 16:02:06
		},
		async loadArticleInfo() {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				
				const res = await axios.get(this.$baseUrl + '/essays/get_article', {
					params: { id: this.articleId },
					headers: {
						'Authorization': 'Bearer ' + tk
					}
				})
				
				if (res.data && res.data.length > 0) {
					this.articleInfo = res.data[0]
				}
			} catch (err) {
				console.error(err)
				uni.showToast({
					title: '获取文章信息失败',
					icon: 'none'
				})
			}
		},
		async loadFeedbacks() {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				
				const res = await axios.get(this.$baseUrl + '/essays/get_article_feedbacks', {
					params: { id: this.articleId },
					headers: {
						'Authorization': 'Bearer ' + tk
					}
				})
				
				this.feedbacks = res.data || []
				this.filterFeedbacks()
			} catch (err) {
				console.error(err)
				uni.showToast({
					title: '获取反馈列表失败',
					icon: 'none'
				})
			}
		},
		filterFeedbacks() {
			if (this.statusFilter === 'all') {
				this.filteredFeedbacks = [...this.feedbacks]
			} else {
				this.filteredFeedbacks = this.feedbacks.filter(
					item => item.status === parseInt(this.statusFilter)
				)
			}
		},
		async handleFeedbackStatus(feedback) {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				
				const newStatus = feedback.status === 0 ? 1 : 0
				
				const res = await axios.post(
					this.$baseUrl + '/essays/update_feedback_status',
					{
						feedback_id: feedback.feedback_id,
						status: newStatus
					},
					{
						headers: {
							'Authorization': 'Bearer ' + tk
						}
					}
				)
				
				if (res.data) {
					feedback.status = newStatus
					uni.showToast({
						title: newStatus === 1 ? '已标记为处理完成' : '已标记为未处理',
						icon: 'none'
					})
				}
			} catch (err) {
				console.error(err)
				uni.showToast({
					title: '操作失败',
					icon: 'none'
				})
			}
		},
		gotoEditor(feedback) {
			uni.navigateTo({
				url: `./chapterEditor?id=${this.articleId}&paragraph_id=${feedback.paragraph_id}`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.content {
	background-color: #f7f7f7;
	min-height: 100vh;
	padding-bottom: 30rpx;
	
	.header {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
		
		.article-info {
			margin-bottom: 20rpx;
			
			.article-title {
				font-size: 36rpx;
				color: #333;
				margin-bottom: 10rpx;
				font-weight: bold;
			}
			
			.feedback-count {
				font-size: 28rpx;
				color: #666;
				
				.count {
					color: #ff6b6b;
					font-weight: bold;
				}
			}
		}
	}
	
	.feedback-list {
		padding: 0 20rpx;
		
		.no-data {
			text-align: center;
			color: #999;
			font-size: 28rpx;
			padding: 100rpx 0;
		}
		
		.feedback-item {
			background-color: #fff;
			border-radius: 12rpx;
			padding: 30rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
			
			.feedback-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;
				
				.user-info {
					display: flex;
					align-items: center;
					
					.avatar {
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
						margin-right: 15rpx;
					}
					
					.username {
						font-size: 28rpx;
						color: #333;
						font-weight: 500;
					}
				}
				
				.feedback-time {
					font-size: 24rpx;
					color: #999;
				}
			}
			
			.paragraph-content, .feedback-content {
				margin-bottom: 20rpx;
				
				.label {
					font-size: 26rpx;
					color: #666;
					margin-bottom: 10rpx;
					font-weight: 500;
				}
				
				.text {
					font-size: 28rpx;
					line-height: 1.5;
					color: #333;
					background-color: #f8f9fa;
					padding: 20rpx;
					border-radius: 8rpx;
					border-left: 6rpx solid #eee;
				}
			}
			
			.paragraph-content .text {
				border-left-color: #b8c4ce;
			}
			
			.feedback-content .text {
				border-left-color: #ff9f43;
			}
			
			.feedback-actions {
				display: flex;
				justify-content: flex-end;
				gap: 15rpx;
				margin-top: 20rpx;
			}
		}
	}
}

.content.dark-mode {
	background-color: #1a1a1a;
	
	.header {
		background-color: #222;
		
		.article-info {
			.article-title {
				color: #eee;
			}
			
			.feedback-count {
				color: #bbb;
			}
		}
	}
	
	.feedback-list {
		.no-data {
			color: #777;
		}
		
		.feedback-item {
			background-color: #222;
			box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
			
			.feedback-header {
				.user-info {
					.username {
						color: #ddd;
					}
				}
				
				.feedback-time {
					color: #777;
				}
			}
			
			.paragraph-content, .feedback-content {
				.label {
					color: #aaa;
				}
				
				.text {
					color: #ddd;
					background-color: #333;
					border-left-color: #444;
				}
			}
			
			.paragraph-content .text {
				border-left-color: #4a5568;
			}
			
			.feedback-content .text {
				border-left-color: #d35400;
			}
		}
	}
}
</style> 