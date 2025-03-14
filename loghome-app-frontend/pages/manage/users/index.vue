<template>
	<view class="container">		
		<view class="content">
			<view class="header">
				<view class="title">用户管理</view>
				<view class="stats">
					<text>总用户数：{{totalUsers}}</text>
				</view>
			</view>
			
			<view class="pagination" v-if="totalPages > 0">
				<view class="page-btn" :class="{disabled: currentPage === 1}" @click="prevPage">上一页</view>
				<view class="page-num">{{currentPage}} / {{totalPages}}</view>
				<view class="page-btn" :class="{disabled: currentPage === totalPages}" @click="nextPage">下一页</view>
			</view>

			<view class="user-list">
				<view class="user-item" v-for="user in users" :key="user.user_id">
					<view class="user-main">
						<view class="user-info">
							<view class="user-name">{{user.name}}</view>
							<view class="user-email">{{user.email}}</view>
						</view>
						<view class="user-meta">
							<view class="meta-item">
								<text class="label">注册时间：</text>
								<text class="value">{{formatTime(user.create_time)}}</text>
							</view>
							<view class="meta-item">
								<text class="label">最后登录：</text>
								<text class="value">{{formatTime(user.last_login_time)}}</text>
							</view>
							<view class="meta-item">
								<text class="label">身份：</text>
								<text class="value">{{user.is_admin ? '管理员' : '普通用户'}}</text>
							</view>
						</view>
					</view>
					<view class="user-actions">
						<view class="action-btn" :class="user.activated ? 'disable' : 'enable'" @click="toggleUserStatus(user)">
							{{user.activated ? '禁用' : '启用'}}
						</view>
						<view class="action-btn message" @click="sendMessage(user)">发消息</view>
					</view>
				</view>
			</view>
			
			<view class="pagination" v-if="totalPages > 0">
				<view class="page-btn" :class="{disabled: currentPage === 1}" @click="prevPage">上一页</view>
				<view class="page-num">{{currentPage}} / {{totalPages}}</view>
				<view class="page-btn" :class="{disabled: currentPage === totalPages}" @click="nextPage">下一页</view>
			</view>
			
			<view class="no-data" v-if="users.length === 0">
				暂无用户数据
			</view>
		</view>
		
		<!-- 发送消息弹窗 -->
		<view class="modal" v-if="showMessageModal">
			<view class="modal-mask" @click="closeMessageModal"></view>
			<view class="modal-content">
				<view class="modal-header">
					<view class="modal-title">发送消息</view>
					<view class="modal-close" @click="closeMessageModal">×</view>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<view class="label">收件人</view>
						<view class="input">
							<input type="text" :value="currentUser ? currentUser.name : ''" disabled />
						</view>
					</view>
					<view class="form-item">
						<view class="label">消息内容</view>
						<view class="input">
							<textarea v-model="messageContent" placeholder="请输入消息内容" maxlength="500" />
							<view class="word-count">{{messageContent.length}}/500</view>
						</view>
					</view>
				</view>
				<view class="modal-footer">
					<view class="btn cancel" @click="closeMessageModal">取消</view>
					<view class="btn confirm" @click="submitMessage">发送</view>
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
			users: [],
			currentPage: 1,
			totalPages: 0,
			totalUsers: 0,
			pageSize: 20,
			showMessageModal: false,
			currentUser: null,
			messageContent: '',
			submitting: false
		}
	},
	onShow() {
		this.loadUsers()
	},
	methods: {
		async loadUsers() {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				uni.showLoading({
					title: '加载中'
				})
				
				// 获取总数
				const countRes = await axios.get(this.$baseUrl + '/manage/users/get_user_amount', {
					headers: {
						'Authorization': tk
					}
				})
				this.totalUsers = countRes.data[0].count
				this.totalPages = Math.ceil(this.totalUsers / this.pageSize)
				
				// 获取列表
				const res = await axios.get(this.$baseUrl + '/manage/users/get_users', {
					params: {
						page: this.currentPage
					},
					headers: {
						'Authorization': tk
					}
				})
				
				this.users = res.data
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				uni.hideLoading()
			} catch (e) {
				uni.hideLoading()
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		},
		async toggleUserStatus(user) {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				
				await axios.post(this.$baseUrl + '/manage/users/user_activating_set', {
					user_id: user.user_id,
					activate: user.activated ? 0 : 1
				}, {
					headers: {
						'Authorization': tk
					}
				})
				
				uni.showToast({
					title: user.activated ? '已禁用' : '已启用',
					icon: 'none'
				})
				
				// 更新本地数据
				user.activated = !user.activated
			} catch (e) {
				uni.showToast({
					title: '操作失败',
					icon: 'none'
				})
			}
		},
		sendMessage(user) {
			this.currentUser = user
			this.messageContent = ''
			this.showMessageModal = true
		},
		closeMessageModal() {
			this.showMessageModal = false
			this.currentUser = null
			this.messageContent = ''
		},
		async submitMessage() {
			if (this.submitting) return
			
			if (!this.messageContent.trim()) {
				uni.showToast({
					title: '请输入消息内容',
					icon: 'none'
				})
				return
			}
			
			try {
				this.submitting = true
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				let userInfo = JSON.parse(window.localStorage.getItem('LogHomeUserInfo'))
				
				await axios.post(this.$baseUrl + '/manage/users/send_message', {
					from_id: userInfo.user_id,
					to_id: this.currentUser.user_id,
					msg: "通过管理员通道向您发送了消息：" + this.messageContent,
					navigate_to: ''
				}, {
					headers: {
						'Authorization': tk
					}
				})
				
				uni.showToast({
					title: '发送成功'
				})
				
				this.closeMessageModal()
			} catch (e) {
				uni.showToast({
					title: '发送失败',
					icon: 'none'
				})
			} finally {
				this.submitting = false
			}
		},
		prevPage() {
			if (this.currentPage > 1) {
				this.currentPage--
				this.loadUsers()
			}
		},
		nextPage() {
			if (this.currentPage < this.totalPages) {
				this.currentPage++
				this.loadUsers()
			}
		},
		formatTime(time) {
			if (!time) return '未知'
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

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
	
	.stats {
		font-size: 28rpx;
		color: #666;
	}
}

.user-list {
	.user-item {
		background: #fff;
		padding: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.user-main {
			flex: 1;
			min-width: 0;
			
			.user-info {
				margin-bottom: 10rpx;
				
				.user-name {
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 5rpx;
				}
				
				.user-email {
					font-size: 26rpx;
					color: #666;
				}
			}
			
			.user-meta {
				font-size: 26rpx;
				color: #666;
				
				.meta-item {
					margin-bottom: 5rpx;
					
					.label {
						color: #999;
					}
				}
			}
		}
		
		.user-actions {
			display: flex;
			flex-direction: column;
			margin-left: 20rpx;
			
			.action-btn {
				padding: 6rpx 20rpx;
				border-radius: 30rpx;
				font-size: 24rpx;
				color: #fff;
				margin-bottom: 10rpx;
				text-align: center;
				min-width: 100rpx;
				
				&.disable {
					background-color: #FF9800;
				}
				
				&.enable {
					background-color: #4CAF50;
				}
				
				&.message {
					background-color: #2196F3;
				}
			}
		}
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
						height: 200rpx;
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
			}
		}
	}
}
</style> 