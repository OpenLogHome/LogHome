<template>
	<view class="container">
		<view class="content">
			<view class="faq-info">
				<view class="title">{{faq.faq_title}}</view>
				<view class="meta">
					<text class="user">提问者: {{faq.user_name || '未知用户'}}</text>
					<text class="time">{{formatTime(faq.create_time)}}</text>
				</view>
			</view>
			
			<view class="faq-content">
				<view class="content-title">问题内容</view>
				<view class="text-content">{{faq.faq_content}}</view>
			</view>
			
			<view class="faq-answer" v-if="faq.solved === 1">
				<view class="content-title">回复内容</view>
				<view class="text-content">{{faq.answer}}</view>
				<view class="answer-info">
					<text class="admin">回复者: 管理员</text>
					<text class="time">{{formatTime(faq.answer_time)}}</text>
				</view>
			</view>
			
			<view class="handle-form">
				<view class="form-item">
					<view class="label">设为典型问题</view>
					<view class="input">
						<switch :checked="isTypical" @change="handleTypicalChange" color="#007AFF" />
					</view>
				</view>
				
				<view class="form-item">
					<view class="label">回复内容</view>
					<view class="input">
						<textarea v-model="answerContent" placeholder="请输入回复内容" maxlength="2000" />
						<view class="word-count">{{answerContent.length}}/2000</view>
					</view>
				</view>
				
				<view class="submit">
					<button @click="submitAnswer" :disabled="submitting || !answerContent.trim()">提交回复</button>
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
			faq: {},
			isTypical: false,
			answerContent: '',
			submitting: false
		}
	},
	onLoad(options) {
		this.loadFaq(options.id)
	},
	methods: {
		async loadFaq(id) {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				
				const res = await axios.get(this.$baseUrl + '/manage/faqs/get_faq_by_id', {
					params: {
						faq_id: id
					},
					headers: {
						'Authorization': tk
					}
				})
				
				if (res.data && res.data.length > 0) {
					this.faq = res.data[0]
					this.isTypical = this.faq.is_typical === 1
					
					// 如果已经有回复，则填充回复内容
					if (this.faq.answer) {
						this.answerContent = this.faq.answer
					}
					
					// 获取用户名
					try {
						const userRes = await axios.get(this.$baseUrl + '/manage/users/get_user_by_id', {
							params: {
								user_id: this.faq.user_id
							},
							headers: {
								'Authorization': tk
							}
						})
						if (userRes.data && userRes.data.length > 0) {
							this.faq.user_name = userRes.data[0].name
                            this.$forceUpdate();
						}
					} catch (e) {
						console.error('获取用户信息失败', e)
					}
				}
			} catch (e) {
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		},
		handleTypicalChange(e) {
			this.isTypical = e.detail.value
			this.updateTypical()
		},
		async updateTypical() {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				
				await axios.post(this.$baseUrl + '/manage/faqs/set_typical', {
					faq_id: this.faq.faq_id,
					is_typical: this.isTypical ? 1 : 0
				}, {
					headers: {
						'Authorization': tk
					}
				})
				
				uni.showToast({
					title: this.isTypical ? '已设为典型问题' : '已取消典型问题',
					icon: 'none'
				})
			} catch (e) {
				uni.showToast({
					title: '操作失败',
					icon: 'none'
				})
			}
		},
		async submitAnswer() {
			if (this.submitting || !this.answerContent.trim()) return
			
			try {
				this.submitting = true
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				let userInfo = JSON.parse(window.localStorage.getItem('LogHomeUserInfo'))
				
				await axios.post(this.$baseUrl + '/manage/faqs/submit_answer', {
					faq_id: this.faq.faq_id,
					answer: this.answerContent,
					me_id: userInfo.user_id
				}, {
					headers: {
						'Authorization': tk
					}
				})
				
				uni.showToast({
					title: '回复成功'
				})
				
				// 更新本地数据
				this.faq.solved = 1
				this.faq.answer = this.answerContent
				this.faq.answer_time = new Date()
				
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
				
			} catch (e) {
				uni.showToast({
					title: '提交失败',
					icon: 'none'
				})
			} finally {
				this.submitting = false
			}
		},
		formatTime(time) {
			if (!time) return ''
			const date = new Date(time)
			return date.getFullYear() + '-' + 
				   (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
				   date.getDate().toString().padStart(2, '0') + ' ' +
				   date.getHours().toString().padStart(2, '0') + ':' +
				   date.getMinutes().toString().padStart(2, '0')
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

.faq-info {
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

.faq-content, .faq-answer {
	background: #fff;
	padding: 30rpx;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	
	.content-title {
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		color: #333;
	}
	
	.text-content {
		font-size: 30rpx;
		line-height: 1.8;
		margin-bottom: 20rpx;
		white-space: pre-wrap;
		color: #333;
	}
	
	.answer-info {
		font-size: 26rpx;
		color: #666;
		text-align: right;
		
		text {
			margin-left: 20rpx;
		}
	}
}

.handle-form {
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
			textarea {
				width: calc(100% - 40rpx);
				height: 300rpx;
				background: #f5f5f5;
				padding: 20rpx;
				border-radius: 10rpx;
				font-size: 28rpx;
			}
			
			.word-count {
				text-align: right;
				font-size: 24rpx;
				color: #999;
				margin-top: 10rpx;
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