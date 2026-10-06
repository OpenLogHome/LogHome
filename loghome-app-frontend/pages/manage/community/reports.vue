<template>
	<view class="container" v-dark>
		<zetank-backBar title="举报处理"></zetank-backBar>

		<view class="filter-bar">
			<view class="filter-tabs">
				<view class="tab" :class="{ active: !reviewMode && status === 0 }" @click="switchStatus(0)">待处理</view>
				<view class="tab" :class="{ active: !reviewMode && status === 1 }" @click="switchStatus(1)">已处理</view>
				<view class="tab" :class="{ active: !reviewMode && status === 2 }" @click="switchStatus(2)">已忽略</view>
				<view class="tab review" :class="{ active: reviewMode }" @click="switchReviewMode">重新审核</view>
			</view>
			<picker v-if="!reviewMode" :range="typeOptions" range-key="label" @change="onTypeChange">
				<view class="type-picker">{{ currentTypeLabel }} ▾</view>
			</picker>
		</view>

		<view class="report-list" v-if="!reviewMode">
			<view class="report-item" v-for="item in reports" :key="item.report_id">
				<view class="report-head">
					<text class="type-tag" :class="'type-' + item.target_type">{{ typeLabel(item.target_type) }}</text>
					<text class="reporter">举报人：{{ item.reporter_name || '匿名' }}</text>
					<text class="time">{{ formatTime(item.create_time) }}</text>
				</view>
				<view class="reason">原因：{{ item.reason }}</view>
				<view class="target" v-if="item.target_info">
					<text class="target-label">{{ targetLabel(item.target_type) }}：</text>
					<text class="target-content">{{ targetSummary(item) }}</text>
					<text class="banned-tag" v-if="isWorkType(item.target_type) && Number(item.target_info.is_banned) === 1">已下架</text>
				</view>
				<view class="target" v-else>
					<text class="target-label">{{ targetLabel(item.target_type) }}：</text>
					<text class="target-content target-missing">内容不存在或已删除</text>
				</view>
				<view class="review-info" v-if="item.status != 0">
					处理人：{{ item.reviewer_name || '-' }} · {{ formatTime(item.review_time) }}
					<text v-if="item.review_comment"> · 备注：{{ item.review_comment }}</text>
				</view>
				<view class="report-actions" v-if="item.status == 0">
					<view class="action-btn ignore" @click="handleReport(item, 'ignore')">忽略</view>
					<view class="action-btn confirm" @click="handleReport(item, 'handle')">{{ handleActionLabel(item.target_type) }}</view>
				</view>
			</view>
		</view>

		<view class="no-data" v-if="!reviewMode && reports.length === 0">暂无举报记录</view>

		<view class="pagination" v-if="!reviewMode && totalPages > 1">
			<view class="page-btn" :class="{ disabled: currentPage === 1 }" @click="prevPage">上一页</view>
			<view class="page-num">{{ currentPage }} / {{ totalPages }}</view>
			<view class="page-btn" :class="{ disabled: currentPage === totalPages }" @click="nextPage">下一页</view>
		</view>

		<view class="report-list" v-if="reviewMode">
			<view class="report-item" v-for="item in resubmits" :key="item.novel_id">
				<view class="report-head">
					<text class="type-tag">{{ item.novel_type === 'manga' ? '漫画' : '小说' }}</text>
					<text class="reporter">作者：{{ item.author_name || '未知' }}</text>
					<text class="time">{{ formatTime(item.update_time) }}</text>
				</view>
				<view class="reason">《{{ item.name }}》申请恢复上架</view>
				<view class="target" v-if="item.ban_info">
					<text class="target-label">当初下架原因：</text>
					<text class="target-content">{{ item.ban_info.reason || '违反社区规则' }}{{ item.ban_info.review_comment ? '（' + item.ban_info.review_comment + '）' : '' }}</text>
				</view>
				<view class="report-actions">
					<view class="action-btn ignore" @click="rejectResubmit(item)">保持下架</view>
					<view class="action-btn approve" @click="approveResubmit(item)">恢复上架</view>
				</view>
			</view>
		</view>

		<view class="no-data" v-if="reviewMode && resubmits.length === 0">暂无重新审核申请</view>

		<view class="modal" v-if="rejectModal.show">
			<view class="modal-mask" @click="closeRejectModal"></view>
			<view class="modal-content">
				<view class="modal-title">保持下架</view>
				<view class="modal-text">驳回《{{ rejectModal.item.name }}》的重新上架申请，作品将保持下架状态。</view>
				<textarea class="modal-input" v-model="rejectModal.reason" placeholder="驳回原因（将通知作者）"
					maxlength="200" />
				<view class="modal-actions">
					<view class="action-btn ignore" @click="closeRejectModal">取消</view>
					<view class="action-btn confirm" @click="confirmReject">确认驳回</view>
				</view>
			</view>
		</view>

		<view class="modal" v-if="handleModal.show">
			<view class="modal-mask" @click="closeHandleModal"></view>
			<view class="modal-content">
				<view class="modal-title">{{ handleModal.title }}</view>
				<view class="modal-text">{{ handleModal.text }}</view>
				<textarea v-if="handleModal.action === 'handle'" class="modal-input" v-model="handleModal.reason"
					placeholder="处理备注（选填）" maxlength="200" />
				<view class="modal-actions">
					<view class="action-btn ignore" @click="closeHandleModal">取消</view>
					<view class="action-btn confirm" @click="confirmHandle">{{ handleModal.action === 'ignore' ? '忽略' : '确认' }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'

const TYPE_LABELS = {
	post: '帖子',
	comment: '评论',
	user: '用户',
	novel: '小说',
	manga: '漫画'
}

export default {
	data() {
		return {
			reports: [],
			status: 0,
			targetType: '',
			currentPage: 1,
			totalPages: 0,
			pageSize: 20,
			reviewMode: false,
			resubmits: [],
			rejectModal: {
				show: false,
				item: null,
				reason: ''
			},
			typeOptions: [
				{ label: '全部类型', value: '' },
				{ label: '帖子', value: 'post' },
				{ label: '评论', value: 'comment' },
				{ label: '用户', value: 'user' },
				{ label: '小说', value: 'novel' },
				{ label: '漫画', value: 'manga' }
			],
			handleModal: {
				show: false,
				action: 'ignore',
				title: '',
				text: '',
				reason: '',
				report: null
			}
		}
	},
	computed: {
		currentTypeLabel() {
			const option = this.typeOptions.find((item) => item.value === this.targetType)
			return option ? option.label : '全部类型'
		}
	},
	onShow() {
		let tk = JSON.parse(window.localStorage.getItem('token'));
		if (tk) tk = tk.tk;
		if (!tk) {
			uni.showToast({ title: '请先登录', icon: 'none' });
			setTimeout(() => {
				uni.navigateTo({ url: '../../users/login' });
			}, 1500);
			return;
		}

		let userInfo = JSON.parse(window.localStorage.getItem('LogHomeUserInfo'));
		if (!userInfo || userInfo.is_admin != 1) {
			uni.showToast({ title: '无权限访问', icon: 'none' });
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
			return;
		}

		this.loadReports()
	},
	methods: {
		authHeaders() {
			let tk = JSON.parse(window.localStorage.getItem('token'))
			return { Authorization: tk.tk }
		},
		switchStatus(status) {
			this.status = status
			this.reviewMode = false
			this.currentPage = 1
			this.loadReports()
		},
		switchReviewMode() {
			this.reviewMode = true
			this.loadResubmits()
		},
		onTypeChange(e) {
			this.targetType = this.typeOptions[Number(e.detail.value)].value
			this.currentPage = 1
			this.loadReports()
		},
		async loadReports() {
			try {
				uni.showLoading({ title: '努力加载中' })
				const res = await axios.get(this.$baseUrl + '/manage/community/reports/list', {
					params: {
						status: this.status,
						target_type: this.targetType,
						page: this.currentPage,
						pageSize: this.pageSize
					},
					headers: this.authHeaders()
				})
				this.reports = res.data.list || []
				this.totalPages = Math.ceil((res.data.total || 0) / this.pageSize)
				uni.hideLoading()
			} catch (e) {
				uni.hideLoading()
				uni.showToast({ title: '加载失败', icon: 'none' })
			}
		},
		prevPage() {
			if (this.currentPage <= 1) return
			this.currentPage--
			this.loadReports()
		},
		nextPage() {
			if (this.currentPage >= this.totalPages) return
			this.currentPage++
			this.loadReports()
		},
		async loadResubmits() {
			try {
				uni.showLoading({ title: '努力加载中' })
				const res = await axios.get(this.$baseUrl + '/manage/community/resubmits/list', {
					headers: this.authHeaders()
				})
				this.resubmits = res.data.list || []
				uni.hideLoading()
			} catch (e) {
				uni.hideLoading()
				uni.showToast({ title: '加载失败', icon: 'none' })
			}
		},
		approveResubmit(item) {
			uni.showModal({
				title: '恢复上架',
				content: `确定要让《${item.name}》恢复上架吗？`,
				success: (res) => {
					if (!res.confirm) return
					this.submitResubmit(item, 'approve', '')
				}
			})
		},
		rejectResubmit(item) {
			this.rejectModal = { show: true, item, reason: '' }
		},
		closeRejectModal() {
			this.rejectModal.show = false
		},
		confirmReject() {
			const { item, reason } = this.rejectModal
			this.rejectModal.show = false
			this.submitResubmit(item, 'reject', reason)
		},
		async submitResubmit(item, action, reason) {
			try {
				uni.showLoading({ title: '提交中' })
				await axios.post(this.$baseUrl + '/manage/community/resubmits/' + action, {
					novel_id: item.novel_id,
					reason
				}, { headers: this.authHeaders() })
				uni.hideLoading()
				uni.showToast({ title: '操作成功', icon: 'none' })
				this.loadResubmits()
			} catch (e) {
				uni.hideLoading()
				const msg = (e.response && e.response.data && e.response.data.msg) || '操作失败'
				uni.showToast({ title: msg, icon: 'none' })
			}
		},
		typeLabel(type) {
			return TYPE_LABELS[type] || type
		},
		targetLabel(type) {
			if (type === 'post') return '被举报帖子'
			if (type === 'comment') return '被举报评论'
			if (type === 'user') return '被举报用户'
			return '被举报作品'
		},
		isWorkType(type) {
			return type === 'novel' || type === 'manga'
		},
		targetSummary(item) {
			const info = item.target_info || {}
			if (item.target_type === 'post') return info.title || '(无标题)'
			if (item.target_type === 'comment') return info.content || ''
			if (this.isWorkType(item.target_type)) {
				const name = info.name || '(未命名作品)'
				return info.author_name ? `${name}（作者：${info.author_name}）` : name
			}
			return `ID ${item.target_id}`
		},
		handleActionLabel(type) {
			if (type === 'post') return '删除帖子'
			if (type === 'comment') return '删除评论'
			if (this.isWorkType(type)) return '下架作品'
			return '确认处理'
		},
		formatTime(value) {
			if (!value) return ''
			return String(value).replace('T', ' ').slice(0, 16)
		},
		handleReport(item, action) {
			const texts = {
				ignore: { title: '忽略举报', text: '忽略后该举报将被关闭，不会对目标内容做任何处理。' },
				handle: {
					post: { title: '删除帖子', text: '确定要删除被举报的帖子吗？删除后读者将无法再看到它。' },
					comment: { title: '删除评论', text: '确定要删除被举报的评论吗？删除后读者将无法再看到它。' },
					novel: { title: '下架作品', text: '确定要下架被举报的作品吗？下架后读者端将不再展示该作品。' },
					manga: { title: '下架作品', text: '确定要下架被举报的漫画吗？下架后读者端将不再展示该漫画。' },
					user: { title: '确认处理', text: '确定要将这条举报标记为已处理吗？' }
				}
			}
			const info = action === 'ignore' ? texts.ignore : texts.handle[item.target_type] || texts.handle.user
			this.handleModal = {
				show: true,
				action,
				title: info.title,
				text: info.text,
				reason: '',
				report: item
			}
		},
		closeHandleModal() {
			this.handleModal.show = false
		},
		confirmHandle() {
			const { action, report, reason } = this.handleModal
			this.handleModal.show = false
			this.submitHandle(report, action, reason)
		},
		async submitHandle(item, action, reason) {
			try {
				uni.showLoading({ title: '提交中' })
				await axios.post(this.$baseUrl + '/manage/community/reports/handle', {
					report_id: item.report_id,
					action,
					reason
				}, { headers: this.authHeaders() })
				uni.hideLoading()
				uni.showToast({ title: '操作成功', icon: 'none' })
				this.loadReports()
			} catch (e) {
				uni.hideLoading()
				uni.showToast({ title: '操作失败', icon: 'none' })
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: var(--background-color-secondary);
	color: var(--text-color-primary);
	padding-bottom: 40rpx;
}

.filter-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 20rpx;
	padding: 0 4%;
}

.filter-tabs {
	display: flex;
	gap: 16rpx;

	.tab {
		padding: 12rpx 28rpx;
		border-radius: 100rpx;
		background: var(--card-background);
		color: var(--text-color-regular);
		font-size: 26rpx;

		&.active {
			background: #8bc34a;
			color: #ffffff;
			font-weight: 600;
		}

		&.review.active {
			background: #ff9800;
		}
	}
}

.type-picker {
	padding: 12rpx 24rpx;
	border-radius: 100rpx;
	background: var(--card-background);
	color: var(--text-color-regular);
	font-size: 26rpx;
}

.modal {
	position: fixed;
	inset: 0;
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;

	.modal-mask {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
	}

	.modal-content {
		position: relative;
		width: 600rpx;
		box-sizing: border-box;
		padding: 36rpx 32rpx 28rpx;
		border-radius: 20rpx;
		background: var(--card-background);
		color: var(--text-color-primary);

		.modal-title {
			font-size: 32rpx;
			font-weight: 700;
			text-align: center;
		}

		.modal-text {
			margin-top: 24rpx;
			font-size: 27rpx;
			line-height: 1.6;
			color: var(--text-color-regular);
		}

		.modal-input {
			box-sizing: border-box;
			width: 100%;
			height: 140rpx;
			margin-top: 24rpx;
			padding: 18rpx;
			border-radius: 12rpx;
			background: var(--background-color-secondary);
			font-size: 26rpx;
			color: var(--text-color-primary);
		}

		.modal-actions {
			display: flex;
			justify-content: flex-end;
			gap: 20rpx;
			margin-top: 30rpx;

			.action-btn {
				padding: 12rpx 36rpx;
				border-radius: 100rpx;
				font-size: 26rpx;

				&.ignore {
					background: var(--background-color-secondary);
					color: var(--text-color-regular);
				}

				&.confirm {
					background: #f44336;
					color: #ffffff;
				}
			}
		}
	}
}

.report-list {
	margin-top: 20rpx;
	padding: 0 4%;
}

.report-item {
	margin-bottom: 20rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	background: var(--card-background);

	.report-head {
		display: flex;
		align-items: center;
		gap: 16rpx;
		flex-wrap: wrap;
		font-size: 24rpx;
		color: var(--text-color-secondary);

		.time {
			margin-left: auto;
		}
	}

	.type-tag {
		padding: 4rpx 16rpx;
		border-radius: 8rpx;
		background: rgba(139, 195, 74, 0.15);
		color: #689f38;
		font-weight: 600;

		&.type-post,
		&.type-comment {
			background: rgba(33, 150, 243, 0.15);
			color: #1976d2;
		}

		&.type-user {
			background: rgba(255, 152, 0, 0.15);
			color: #ef6c00;
		}
	}

	.reason {
		margin-top: 16rpx;
		font-size: 28rpx;
		font-weight: 600;
		color: var(--text-color-primary);
	}

	.target {
		margin-top: 12rpx;
		font-size: 26rpx;
		color: var(--text-color-regular);

		.target-label {
			color: var(--text-color-secondary);
		}

		.target-missing {
			color: var(--text-color-secondary);
			font-style: italic;
		}

		.banned-tag {
			margin-left: 12rpx;
			padding: 2rpx 12rpx;
			border-radius: 8rpx;
			background: rgba(244, 67, 54, 0.12);
			color: #d32f2f;
			font-size: 22rpx;
		}
	}

	.review-info {
		margin-top: 12rpx;
		font-size: 24rpx;
		color: var(--text-color-secondary);
	}

	.report-actions {
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
		margin-top: 20rpx;

		.action-btn {
			padding: 12rpx 36rpx;
			border-radius: 100rpx;
			font-size: 26rpx;

			&.ignore {
				background: var(--background-color-secondary);
				color: var(--text-color-regular);
			}

			&.confirm {
				background: #f44336;
				color: #ffffff;
			}

			&.approve {
				background: #4caf50;
				color: #ffffff;
			}
		}
	}
}

.no-data {
	padding: 120rpx 0;
	text-align: center;
	color: var(--text-color-secondary);
	font-size: 28rpx;
}

.pagination {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 24rpx;
	margin-top: 30rpx;

	.page-btn {
		padding: 12rpx 32rpx;
		border-radius: 100rpx;
		background: var(--card-background);
		color: var(--text-color-regular);
		font-size: 26rpx;

		&.disabled {
			opacity: 0.4;
		}
	}

	.page-num {
		font-size: 26rpx;
		color: var(--text-color-regular);
	}
}
</style>
