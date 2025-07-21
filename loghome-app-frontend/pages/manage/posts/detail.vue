<template>
	<view class="container">
		<view class="content">
			<view class="post-info">
				<view class="title">{{post.title}}</view>
				<view class="meta">
					<text class="author">作者: {{post.author_name || '管理员'}}</text>
					<text class="time" v-if="post.create_time">发布时间: {{formatTime(post.create_time)}}</text>
				</view>
			</view>
			
			<view class="post-content">
				<view class="content-title">帖子内容</view>
				<view class="text-content" v-html="post.content"></view>
			</view>
			
			<view class="action-buttons">
				<button class="btn edit" @click="editPost">编辑帖子</button>
				<button class="btn delete" @click="deletePost">删除帖子</button>
			</view>
		</view>
		
		<!-- 编辑弹窗 -->
		<view class="modal" v-if="showModal">
			<view class="modal-mask" @click="closeModal"></view>
			<view class="modal-content">
				<view class="modal-header">
					<view class="modal-title">编辑帖子</view>
					<view class="modal-close" @click="closeModal">×</view>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<view class="label">标题</view>
						<view class="input">
							<input type="text" v-model="editForm.title" placeholder="请输入标题" />
						</view>
					</view>
					<view class="form-item">
						<view class="label">内容</view>
						<view class="input">
							<view class="editor-container">
								<editor id="editor-content" class="rich-editor" :read-only="false" 
									show-img-size show-img-toolbar show-img-resize
									@ready="onEditorReady" placeholder="请输入内容..."></editor>
								<view class="editor-toolbar">
									<view class="toolbar-item" @click="formatBold">
										<text class="iconfont">B</text>
									</view>
									<view class="toolbar-item" @click="formatItalic">
										<text class="iconfont">I</text>
									</view>
									<view class="toolbar-item" @click="formatHeader">
										<text class="iconfont">H</text>
									</view>
									<view class="toolbar-item" @click="insertImage">
										<text class="iconfont">图片</text>
									</view>
									<view class="toolbar-item" @click="formatColor">
										<text class="iconfont">颜色</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="modal-footer">
					<view class="btn cancel" @click="closeModal">取消</view>
					<view class="btn confirm" @click="savePost">保存</view>
				</view>
			</view>
		</view>
		
		<!-- 确认删除弹窗 -->
		<view class="modal" v-if="showDeleteConfirm">
			<view class="modal-mask" @click="closeDeleteConfirm"></view>
			<view class="modal-content confirm-modal">
				<view class="modal-header">
					<view class="modal-title">确认删除</view>
					<view class="modal-close" @click="closeDeleteConfirm">×</view>
				</view>
				<view class="modal-body">
					<view class="confirm-text">确定要删除这篇帖子吗？此操作不可恢复。</view>
				</view>
				<view class="modal-footer">
					<view class="btn cancel" @click="closeDeleteConfirm">取消</view>
					<view class="btn delete" @click="confirmDelete">删除</view>
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
			post: {},
			showModal: false,
			showDeleteConfirm: false,
			editForm: {
				title: '',
				content: ''
			},
			submitting: false,
			editorCtx: null
		}
	},
	onLoad(options) {
		if (options.id) {
			this.loadPost(options.id)
		} else {
			uni.showToast({
				title: '参数错误',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		}
	},
	methods: {
		async loadPost(id) {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				uni.showLoading({
					title: '努力加载中'
				})
				
				const res = await axios.get(this.$baseUrl + '/manage/posts/get_post_by_id', {
					params: {
						post_id: id
					},
					headers: {
						'Authorization': tk
					}
				})
				
				if (res.data && res.data.length > 0) {
					this.post = res.data[0]
					
					// 如果有作者ID，获取作者信息
					if (this.post.author_id && this.post.author_id > 0) {
						try {
							const userRes = await axios.get(this.$baseUrl + '/manage/users/get_user_by_id', {
								params: {
									user_id: this.post.author_id
								},
								headers: {
									'Authorization': tk
								}
							})
							if (userRes.data && userRes.data.length > 0) {
								this.post.author_name = userRes.data[0].name
							}
						} catch (e) {
							console.error('获取用户信息失败', e)
						}
					}
				} else {
					uni.showToast({
						title: '帖子不存在',
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				}
				
				uni.hideLoading()
			} catch (e) {
				uni.hideLoading()
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		},
		editPost() {
			this.editForm = {
				title: this.post.title,
				content: this.post.content
			}
			this.showModal = true
			
			// 等待编辑器准备好后设置内容
			setTimeout(() => {
				if (this.editorCtx) {
					this.editorCtx.setContents({html: this.post.content || ''})
				}
			}, 300)
		},
		deletePost() {
			this.showDeleteConfirm = true
		},
		closeModal() {
			this.showModal = false
		},
		closeDeleteConfirm() {
			this.showDeleteConfirm = false
		},
		async savePost() {
			if (this.submitting) return
			
			// 表单验证
			if (!this.editForm.title.trim()) {
				uni.showToast({
					title: '请输入标题',
					icon: 'none'
				})
				return
			}
			
			try {
				// 获取编辑器内容
				const html = await this.getEditorContent()
				if (!html) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					})
					return
				}
				
				this.submitting = true
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				
				await axios.post(this.$baseUrl + '/manage/posts/edit_post', {
					post_id: this.post.post_id,
					title: this.editForm.title,
					content: html
				}, {
					headers: {
						'Authorization': tk
					}
				})
				
				uni.showToast({
					title: '编辑成功'
				})
				
				// 更新本地数据
				this.post.title = this.editForm.title
				this.post.content = html
				
				this.closeModal()
			} catch (e) {
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				})
			} finally {
				this.submitting = false
			}
		},
		async confirmDelete() {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				
				// 注意：后端需要添加删除帖子的接口
				await axios.post(this.$baseUrl + '/manage/posts/delete_post', {
					post_id: this.post.post_id
				}, {
					headers: {
						'Authorization': tk
					}
				})
				
				uni.showToast({
					title: '删除成功'
				})
				
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			} catch (e) {
				uni.showToast({
					title: '删除失败',
					icon: 'none'
				})
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
		},
		// 富文本编辑器相关方法
		onEditorReady() {
			uni.createSelectorQuery()
				.select('#editor-content')
				.context((res) => {
					this.editorCtx = res.context
					if (this.post.content) {
						this.editorCtx.setContents({html: this.post.content})
					}
				})
				.exec()
		},
		formatBold() {
			this.editorCtx.format('bold')
		},
		formatItalic() {
			this.editorCtx.format('italic')
		},
		formatHeader() {
			this.editorCtx.format('header', 'H2')
		},
		formatColor() {
			this.editorCtx.format('foreColor', '#F44336')
		},
		insertImage() {
			uni.chooseImage({
				count: 1,
				success: (res) => {
					uni.showLoading({
						title: '上传中'
					})
					// 这里应该有上传图片的逻辑，上传成功后插入图片
					// 示例仅作演示，实际应该上传到服务器
					setTimeout(() => {
						this.editorCtx.insertImage({
							src: res.tempFilePaths[0],
							alt: '图片',
							width: '100%'
						})
						uni.hideLoading()
					}, 1000)
				}
			})
		},
		getEditorContent() {
			return new Promise((resolve, reject) => {
				this.editorCtx.getContents({
					success: (res) => {
						resolve(res.html)
					},
					fail: (err) => {
						reject(err)
					}
				})
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

.post-info {
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

.post-content {
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
		white-space: pre-wrap;
		color: #333;
        img{
            width: calc(100% - 40rpx) !important;
        }
	}
}

.action-buttons {
	display: flex;
	justify-content: space-between;
	margin-top: 30rpx;
	
	.btn {
		flex: 1;
		margin: 0 10rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		font-size: 30rpx;
		color: #fff;
		
		&.edit {
			background-color: #2196F3;
		}
		
		&.delete {
			background-color: #F44336;
		}
	}
}

.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;
	
	.modal-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
	}
	
	.modal-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 90%;
		max-width: 650rpx;
		background: #fff;
		border-radius: 10rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		
		&.confirm-modal {
			max-width: 500rpx;
		}
		
		.modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1px solid #eee;
			width: 100%;
			box-sizing: border-box;
			
			.modal-title {
				font-size: 32rpx;
				font-weight: bold;
			}
			
			.modal-close {
				font-size: 40rpx;
				color: #999;
				line-height: 1;
			}
		}
		
		.modal-body {
			padding: 30rpx;
			max-height: 60vh;
			overflow-y: auto;
			width: 100%;
			box-sizing: border-box;
			
			.confirm-text {
				font-size: 30rpx;
				color: #333;
				text-align: center;
				padding: 20rpx 0;
			}
			
			.form-item {
				margin-bottom: 20rpx;
				width: 100%;
				
				.label {
					font-size: 28rpx;
					color: #333;
					margin-bottom: 10rpx;
				}
				
				.input {
					width: 100%;
					
					input {
						width: 100%;
						height: 80rpx;
						background: #f5f5f5;
						padding: 0 20rpx;
						border-radius: 6rpx;
						font-size: 28rpx;
						box-sizing: border-box;
					}
					
					textarea {
						width: 100%;
						height: 300rpx;
						background: #f5f5f5;
						padding: 20rpx;
						border-radius: 6rpx;
						font-size: 28rpx;
						box-sizing: border-box;
					}
					
					.word-count {
						text-align: right;
						font-size: 24rpx;
						color: #999;
						margin-top: 10rpx;
					}
				}
			}
		}
		
		.modal-footer {
			display: flex;
			border-top: 1px solid #eee;
			width: 100%;
			
			.btn {
				flex: 1;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				font-size: 30rpx;
				
				&.cancel {
					color: #666;
					background: #f5f5f5;
				}
				
				&.confirm {
					color: #fff;
					background: #007AFF;
				}
				
				&.delete {
					color: #fff;
					background: #F44336;
				}
			}
		}
	}
}

.editor-container {
	position: relative;
	width: 100%;
	height: 400rpx;
	background: #f5f5f5;
	border-radius: 6rpx;
}

.rich-editor {
	width: 100%;
	height: 350rpx;
	background: #f5f5f5;
	padding: 20rpx;
	box-sizing: border-box;
	font-size: 28rpx;
}

.editor-toolbar {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 50rpx;
	background: #e0e0e0;
	display: flex;
	padding: 0 10rpx;
}

.toolbar-item {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 50rpx;
	font-size: 24rpx;
}

.toolbar-item:active {
	background: #d0d0d0;
}
</style> 