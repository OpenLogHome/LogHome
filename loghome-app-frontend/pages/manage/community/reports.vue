<template>
	<view class="container" v-dark>
		<zetank-backBar :title="$t('manage.sections.reports')"></zetank-backBar>

		<view class="filter-bar">
			<view class="filter-tabs">
				<view class="tab" :class="{ active: !reviewMode && status === 0 }" @click="switchStatus(0)">{{ $t('manage.reports.pending') }}</view>
				<view class="tab" :class="{ active: !reviewMode && status === 1 }" @click="switchStatus(1)">{{ $t('manage.reports.handled') }}</view>
				<view class="tab" :class="{ active: !reviewMode && status === 2 }" @click="switchStatus(2)">{{ $t('manage.reports.ignored') }}</view>
				<view class="tab review" :class="{ active: reviewMode }" @click="switchReviewMode">{{ $t('manage.reports.reviewAgain') }}</view>
			</view>
			<picker v-if="!reviewMode" :range="typeOptions" range-key="label" @change="onTypeChange">
				<view class="type-picker">{{ currentTypeLabel }} ▾</view>
			</picker>
		</view>

		<view class="report-list" v-if="!reviewMode">
			<view class="report-item" v-for="item in reports" :key="item.report_id">
				<view class="report-head">
					<text class="type-tag" :class="'type-' + item.target_type">{{ typeLabel(item.target_type) }}</text>
					<text class="reporter">{{ $t('manage.reports.reporter', { name: item.reporter_name || $t('manage.reports.anonymous') }) }}</text>
					<text class="time">{{ formatTime(item.create_time) }}</text>
				</view>
				<view class="reason">{{ $t('manage.reports.reason', { reason: item.reason }) }}</view>
				<view class="target" v-if="item.target_info">
					<text class="target-label">{{ targetLabel(item.target_type) }}：</text>
					<text class="target-content">{{ targetSummary(item) }}</text>
					<text class="banned-tag" v-if="isWorkType(item.target_type) && Number(item.target_info.is_banned) === 1">{{ $t('manage.reports.removed') }}</text>
				</view>
				<view class="target" v-else>
					<text class="target-label">{{ targetLabel(item.target_type) }}：</text>
					<text class="target-content target-missing">{{ $t('manage.reports.missing') }}</text>
				</view>
				<view class="review-info" v-if="item.status != 0">
					{{ $t('manage.reports.reviewedBy', { name: item.reviewer_name || '-', time: formatTime(item.review_time) }) }}
					<text v-if="item.review_comment"> · {{ $t('manage.reports.note', { note: item.review_comment }) }}</text>
				</view>
				<view class="report-actions" v-if="item.status == 0">
					<view class="action-btn ignore" @click="handleReport(item, 'ignore')">{{ $t('manage.reports.ignore') }}</view>
					<view class="action-btn confirm" @click="handleReport(item, 'handle')">{{ handleActionLabel(item.target_type) }}</view>
				</view>
			</view>
		</view>

		<view class="no-data" v-if="!reviewMode && reports.length === 0">{{ $t('manage.reports.empty') }}</view>

		<view class="pagination" v-if="!reviewMode && totalPages > 1">
			<view class="page-btn" :class="{ disabled: currentPage === 1 }" @click="prevPage">{{ $t('common.prev') }}</view>
			<view class="page-num">{{ currentPage }} / {{ totalPages }}</view>
			<view class="page-btn" :class="{ disabled: currentPage === totalPages }" @click="nextPage">{{ $t('common.next') }}</view>
		</view>

		<view class="report-list" v-if="reviewMode">
			<view class="report-item" v-for="item in resubmits" :key="item.novel_id">
				<view class="report-head">
					<text class="type-tag">{{ item.novel_type === 'manga' ? $t('manage.reports.manga') : $t('manage.reports.novel') }}</text>
					<text class="reporter">{{ $t('manage.reports.author', { name: item.author_name || $t('manage.reports.unknown') }) }}</text>
					<text class="time">{{ formatTime(item.update_time) }}</text>
				</view>
				<view class="reason">{{ $t('manage.reports.appeal', { name: item.name }) }}</view>
				<view class="target" v-if="item.ban_info">
					<text class="target-label">{{ $t('manage.reports.originalReason') }}</text>
					<text class="target-content">{{ item.ban_info.reason || $t('manage.reports.ruleViolation') }}{{ item.ban_info.review_comment ? ' (' + item.ban_info.review_comment + ')' : '' }}</text>
				</view>
				<view class="report-actions">
					<view class="action-btn ignore" @click="rejectResubmit(item)">{{ $t('manage.reports.keepRemoved') }}</view>
					<view class="action-btn approve" @click="approveResubmit(item)">{{ $t('manage.reports.restore') }}</view>
				</view>
			</view>
		</view>

		<view class="no-data" v-if="reviewMode && resubmits.length === 0">{{ $t('manage.reports.noAppeals') }}</view>

		<view class="modal" v-if="rejectModal.show">
			<view class="modal-mask" @click="closeRejectModal"></view>
			<view class="modal-content">
				<view class="modal-title">{{ $t('manage.reports.rejectTitle') }}</view>
				<view class="modal-text">{{ $t('manage.reports.rejectText', { name: rejectModal.item.name }) }}</view>
				<textarea class="modal-input" v-model="rejectModal.reason" :placeholder="$t('manage.reports.rejectPlaceholder')"
					maxlength="200" />
				<view class="modal-actions">
					<view class="action-btn ignore" @click="closeRejectModal">{{ $t('common.cancel') }}</view>
					<view class="action-btn confirm" @click="confirmReject">{{ $t('manage.reports.reject') }}</view>
				</view>
			</view>
		</view>

		<view class="modal" v-if="handleModal.show">
			<view class="modal-mask" @click="closeHandleModal"></view>
			<view class="modal-content">
				<view class="modal-title">{{ handleModal.title }}</view>
				<view class="modal-text">{{ handleModal.text }}</view>
				<textarea v-if="handleModal.action === 'handle'" class="modal-input" v-model="handleModal.reason"
					:placeholder="$t('manage.reports.reviewNote')" maxlength="200" />
				<view class="modal-actions">
					<view class="action-btn ignore" @click="closeHandleModal">{{ $t('common.cancel') }}</view>
					<view class="action-btn confirm" @click="confirmHandle">{{ handleModal.action === 'ignore' ? $t('manage.reports.ignore') : $t('manage.reports.confirm') }}</view>
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
		typeOptions() {
			return [
				{ label: this.$t('manage.reports.allTypes'), value: '' },
				{ label: this.$t('manage.reports.post'), value: 'post' },
				{ label: this.$t('manage.reports.comment'), value: 'comment' },
				{ label: this.$t('manage.reports.user'), value: 'user' },
				{ label: this.$t('manage.reports.novel'), value: 'novel' },
				{ label: this.$t('manage.reports.manga'), value: 'manga' }
			]
		},
		currentTypeLabel() {
			const option = this.typeOptions.find((item) => item.value === this.targetType)
			return option ? option.label : this.$t('manage.reports.allTypes')
		}
	},
	onShow() {
		let tk = JSON.parse(window.localStorage.getItem('token'));
		if (tk) tk = tk.tk;
		if (!tk) {
			uni.showToast({ title: this.$t('manage.access.signInRequired'), icon: 'none' });
			setTimeout(() => {
				uni.navigateTo({ url: '../../users/login' });
			}, 1500);
			return;
		}

		let userInfo = JSON.parse(window.localStorage.getItem('LogHomeUserInfo'));
		if (!userInfo || userInfo.is_admin != 1) {
			uni.showToast({ title: this.$t('manage.access.forbidden'), icon: 'none' });
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
				uni.showLoading({ title: this.$t('common.loading') })
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
				uni.showToast({ title: this.$t('common.loadFailed'), icon: 'none' })
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
				uni.showLoading({ title: this.$t('common.loading') })
				const res = await axios.get(this.$baseUrl + '/manage/community/resubmits/list', {
					headers: this.authHeaders()
				})
				this.resubmits = res.data.list || []
				uni.hideLoading()
			} catch (e) {
				uni.hideLoading()
				uni.showToast({ title: this.$t('common.loadFailed'), icon: 'none' })
			}
		},
		approveResubmit(item) {
			uni.showModal({
				title: this.$t('manage.reports.restoreTitle'),
				content: this.$t('manage.reports.restoreConfirm', { name: item.name }),
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
				uni.showLoading({ title: this.$t('common.processing') })
				await axios.post(this.$baseUrl + '/manage/community/resubmits/' + action, {
					novel_id: item.novel_id,
					reason
				}, { headers: this.authHeaders() })
				uni.hideLoading()
				uni.showToast({ title: this.$t('manage.reports.actionSuccess'), icon: 'none' })
				this.loadResubmits()
			} catch (e) {
				uni.hideLoading()
				uni.showToast({ title: this.$t('common.operationFailed'), icon: 'none' })
			}
		},
		typeLabel(type) {
			const keys = { post: 'post', comment: 'comment', user: 'user', novel: 'novel', manga: 'manga' }
			return keys[type] ? this.$t('manage.reports.' + keys[type]) : type
		},
		targetLabel(type) {
			if (type === 'post') return this.$t('manage.reports.reportedPost')
			if (type === 'comment') return this.$t('manage.reports.reportedComment')
			if (type === 'user') return this.$t('manage.reports.reportedUser')
			return this.$t('manage.reports.reportedWork')
		},
		isWorkType(type) {
			return type === 'novel' || type === 'manga'
		},
		targetSummary(item) {
			const info = item.target_info || {}
			if (item.target_type === 'post') return info.title || this.$t('manage.reports.untitled')
			if (item.target_type === 'comment') return info.content || ''
			if (this.isWorkType(item.target_type)) {
				const name = info.name || this.$t('manage.reports.unnamedWork')
				return info.author_name ? `${name} (${this.$t('manage.common.author', { name: info.author_name })})` : name
			}
			return `ID ${item.target_id}`
		},
		handleActionLabel(type) {
			if (type === 'post') return this.$t('manage.reports.deletePost')
			if (type === 'comment') return this.$t('manage.reports.deleteComment')
			if (this.isWorkType(type)) return this.$t('manage.reports.removeWork')
			return this.$t('manage.reports.handleReport')
		},
		formatTime(value) {
			if (!value) return ''
			return String(value).replace('T', ' ').slice(0, 16)
		},
		handleReport(item, action) {
			const texts = {
				ignore: { title: this.$t('manage.reports.ignoreTitle'), text: this.$t('manage.reports.ignoreText') },
				handle: {
					post: { title: this.$t('manage.reports.deletePost'), text: this.$t('manage.reports.deletePostText') },
					comment: { title: this.$t('manage.reports.deleteComment'), text: this.$t('manage.reports.deleteCommentText') },
					novel: { title: this.$t('manage.reports.removeWork'), text: this.$t('manage.reports.removeNovelText') },
					manga: { title: this.$t('manage.reports.removeWork'), text: this.$t('manage.reports.removeMangaText') },
					user: { title: this.$t('manage.reports.handleReport'), text: this.$t('manage.reports.handleUserText') }
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
				uni.showLoading({ title: this.$t('common.processing') })
				await axios.post(this.$baseUrl + '/manage/community/reports/handle', {
					report_id: item.report_id,
					action,
					reason
				}, { headers: this.authHeaders() })
				uni.hideLoading()
				uni.showToast({ title: this.$t('manage.reports.actionSuccess'), icon: 'none' })
				this.loadReports()
			} catch (e) {
				uni.hideLoading()
				uni.showToast({ title: this.$t('common.operationFailed'), icon: 'none' })
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
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	margin-top: 20rpx;
	padding: 0 4%;
}

.filter-tabs {
	display: flex;
	width: 100%;
	gap: 8rpx;

	.tab {
		flex: 1;
		padding: 12rpx 10rpx;
		border-radius: 100rpx;
		background: var(--card-background);
		color: var(--text-color-regular);
		font-size: 24rpx;
		text-align: center;
		white-space: nowrap;

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
	margin-top: 16rpx;
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
