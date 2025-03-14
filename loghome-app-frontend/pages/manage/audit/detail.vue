<template>
	<view class="container">
		<view class="content">
			<view class="article-info">
				<view class="title">{{article.title}}</view>
				<view class="meta">
					<text class="novel">{{novelInfo.name}}</text>
					<text class="author">作者: {{novelInfo.author_name}}</text>
					<text class="word-count">字数: {{article.text_count}}</text>
				</view>
			</view>
			
			<view class="article-content">
				<template v-if="article.content">
					<view v-for="(item, index) in parsedContent" :key="index">
						<view v-if="item.type === 'text'" class="text-content">{{item.value}}</view>
						<view v-else-if="item.type === 'image'" class="image-content">
							<image :src="item.img" mode="widthFix" @click="previewImage(item.img)" class="content-image"/>
						</view>
					</view>
				</template>
				<template v-else>
					<view class="text-content">{{article.content}}</view>
				</template>
			</view>
			
			<view class="audit-form">
				<view class="form-item">
					<view class="label">审核结果</view>
					<view class="input">
						<radio-group @change="handleMethodChange">
							<label class="radio">
								<radio value="通过" :checked="handleMethod === '通过'"/>通过
							</label>
							<label class="radio">
								<radio value="打回草稿" :checked="handleMethod === '打回草稿'"/>退回稿件
							</label>
						</radio-group>
					</view>
				</view>
				
				<view class="form-item" v-if="handleMethod === '通过'">
					<view class="label">警告信息</view>
					<view class="input">
						<radio-group @change="handleWarnChange">
							<label class="radio-warn" v-for="(warn, index) in warnOptions" :key="index">
								<radio :value="warn" :checked="warnInfo === warn"/>{{warn === 'None' ? '无' : warn}}
							</label>
						</radio-group>
					</view>
				</view>
				
				<view class="submit">
					<button @click="submitAudit" :disabled="submitting">提交审核</button>
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
			article: {},
			novelInfo: {},
			handleMethod: '通过',
			warnInfo: 'None',
			submitting: false,
			warnOptions: [
				'None',
				'该稿件疑似使用人工智能合成，请仔细甄别。',
				'该稿件含有危险行为，请勿轻易模仿。',
				'该稿件内容仅供娱乐，请勿过分解读。',
				'该稿件内容可能引人不适，请谨慎阅读。',
				'请理性适度消费。',
				'该稿件包含的个人观点仅供参考。'
			]
		}
	},
	computed: {
		parsedContent() {
			try {
				return this.article.content ? JSON.parse(this.article.content) : []
			} catch (e) {
				return []
			}
		}
	},
	onLoad(options) {
		this.loadArticle(options.id)
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		async loadNovelInfo(novel_id) {
			try {
				const res = await axios.get(this.$baseUrl + '/library/get_novel_by_id', {
					params: {
						id: novel_id
					}
				})
				this.novelInfo = res.data[0]
			} catch (e) {
				uni.showToast({
					title: '获取作品信息失败',
					icon: 'none'
				})
			}
		},
		async loadArticle(id) {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				
				const res = await axios.get(this.$baseUrl + '/manage/audit/get_article_by_id', {
					params: {
						id: id
					},
					headers: {
						'Authorization': tk
					}
				})
				this.article = res.data[0]
				// 加载作品信息
				if (this.article.novel_id) {
					await this.loadNovelInfo(this.article.novel_id)
				}
			} catch (e) {
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		},
		handleMethodChange(e) {
			this.handleMethod = e.detail.value
		},
		handleWarnChange(e) {
			this.warnInfo = e.detail.value
		},
		async submitAudit() {
			if (this.submitting) return
			
			try {
				this.submitting = true
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				
				await axios.post(this.$baseUrl + '/manage/audit/submit_result', {
					article_id: this.article.article_id,
					handleMethod: this.handleMethod,
					warnInfo: this.warnInfo
				}, {
					headers: {
						'Authorization': tk
					}
				})
				
				uni.showToast({
					title: '审核成功'
				})
				
				setTimeout(() => {
					uni.navigateBack()
				}, 500)
				
			} catch (e) {
				uni.showToast({
					title: '提交失败',
					icon: 'none'
				})
			} finally {
				this.submitting = false
			}
		},
		previewImage(url) {
			uni.previewImage({
				urls: [url],
				current: url
			})
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

.article-info {
	background: #fff;
	padding: 30rpx;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	
	.meta {
		font-size: 26rpx;
		color: #666;
		
		text {
			margin-right: 20rpx;
		}
	}
}

.article-content {
	background: #fff;
	padding: 30rpx;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	
	.text-content {
		font-size: 30rpx;
		line-height: 1.8;
		margin-bottom: 20rpx;
		white-space: pre-wrap;
		color: #333;
	}
	
	.image-content {
		margin: 20rpx 0;
		display: flex;
		justify-content: center;
		
		.content-image {
			width: 80%;
			max-height: 400rpx;
			object-fit: contain;
			border-radius: 8rpx;
			cursor: pointer;
			
			&:hover {
				opacity: 0.9;
			}
		}
	}
}

.audit-form {
	background: #fff;
	padding: 30rpx;
	border-radius: 10rpx;
	
	.form-item {
		margin-bottom: 30rpx;
		
		.label {
			font-size: 30rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		
		.input {
			.radio {
				margin-right: 30rpx;
			}
			
			.radio-warn {
				display: block;
				margin-bottom: 20rpx;
				font-size: 28rpx;
				color: #333;
				
				radio {
					margin-right: 10rpx;
					transform: scale(0.8);
				}
			}
		}
	}
	
	.submit {
		button {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			background: #007AFF;
			color: #fff;
			border-radius: 40rpx;
			font-size: 30rpx;
			
			&:disabled {
				background: #999;
			}
		}
	}
}
</style> 