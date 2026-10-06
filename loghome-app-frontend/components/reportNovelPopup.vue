<template>
	<uni-popup ref="popup" type="bottom">
		<view class="report-sheet" v-dark>
			<view class="report-title">举报作品</view>
			<view class="report-sub">请选择举报原因，管理员核实后将进行处理</view>
			<view class="reason-list">
				<view class="reason-item" v-for="item in reasons" :key="item" :class="{ active: reason === item }"
					@click="reason = item">
					{{ item }}
				</view>
			</view>
			<textarea class="report-textarea" v-model="detail" :placeholder="detailPlaceholder" maxlength="200" />
			<view class="report-count">{{ detail.length }}/200</view>
			<button class="report-submit" :disabled="submitting" @click="submit">
				{{ submitting ? '提交中…' : '提交举报' }}
			</button>
		</view>
	</uni-popup>
</template>

<script>
import axios from 'axios'

export default {
	name: 'reportNovelPopup',
	data() {
		return {
			novelId: 0,
			reason: '',
			detail: '',
			submitting: false,
			reasons: ['违法违规', '色情低俗', '抄袭侵权', '人身攻击', '垃圾广告', '其他']
		}
	},
	computed: {
		detailPlaceholder() {
			return this.reason === '其他' ? '请补充说明（必填）' : '补充说明（选填）'
		}
	},
	methods: {
		open(novelId) {
			this.novelId = Number(novelId) || 0
			this.reason = ''
			this.detail = ''
			this.submitting = false
			this.$nextTick(() => {
				this.$refs.popup.open('bottom')
			})
		},
		close() {
			this.$refs.popup.close()
		},
		getAuthHeaders() {
			let token = null
			try {
				token = JSON.parse(window.localStorage.getItem('token'))
			} catch (e) {
				token = null
			}
			return token && token.tk ? { Authorization: 'Bearer ' + token.tk } : null
		},
		submit() {
			if (this.submitting) return
			if (!this.novelId) {
				uni.showToast({ title: '作品信息缺失', icon: 'none' })
				return
			}
			if (!this.reason) {
				uni.showToast({ title: '请选择举报原因', icon: 'none' })
				return
			}
			if (this.reason === '其他' && !this.detail.trim()) {
				uni.showToast({ title: '请填写补充说明', icon: 'none' })
				return
			}
			const headers = this.getAuthHeaders()
			if (!headers) {
				uni.showToast({ title: '请先登录', icon: 'none' })
				return
			}
			this.submitting = true
			axios.post(this.$baseUrl + '/essays/report_novel', {
				novel_id: this.novelId,
				reason: this.reason,
				detail: this.detail.trim()
			}, { headers: { ...headers, 'Content-Type': 'application/json' } }).then(() => {
				uni.showToast({ title: '举报成功，感谢您的反馈', icon: 'none' })
				this.$emit('reported')
				this.close()
			}).catch((e) => {
				const msg = (e.response && e.response.data && e.response.data.msg) || '举报失败，请稍后重试'
				uni.showToast({ title: msg, icon: 'none' })
			}).finally(() => {
				this.submitting = false
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.report-sheet {
	padding: 40rpx 32rpx calc(40rpx + env(safe-area-inset-bottom));
	border-radius: 24rpx 24rpx 0 0;
	background: var(--card-background, #ffffff);
	color: var(--text-color-primary, #333333);
}

.report-title {
	font-size: 34rpx;
	font-weight: 700;
	text-align: center;
}

.report-sub {
	margin: 12rpx 0 28rpx;
	font-size: 24rpx;
	color: var(--text-color-secondary, #999999);
	text-align: center;
}

.reason-list {
	display: flex;
	flex-wrap: wrap;
	gap: 18rpx;
}

.reason-item {
	padding: 14rpx 28rpx;
	border-radius: 100rpx;
	border: 1rpx solid var(--border-color, #e5e5e5);
	background: var(--background-color-secondary, #f5f5f5);
	font-size: 26rpx;
	color: var(--text-color-regular, #666666);

	&.active {
		border-color: #8bc34a;
		background: rgba(139, 195, 74, 0.15);
		color: #689f38;
		font-weight: 600;
	}
}

.report-textarea {
	box-sizing: border-box;
	width: 100%;
	height: 160rpx;
	margin-top: 28rpx;
	padding: 20rpx;
	border-radius: 16rpx;
	background: var(--background-color-secondary, #f5f5f5);
	font-size: 26rpx;
	color: var(--text-color-primary, #333333);
}

.report-count {
	margin-top: 8rpx;
	text-align: right;
	font-size: 22rpx;
	color: var(--text-color-secondary, #999999);
}

.report-submit {
	margin-top: 24rpx;
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 100rpx;
	background: #8bc34a;
	color: #ffffff;
	font-size: 30rpx;
	font-weight: 600;
}
</style>
