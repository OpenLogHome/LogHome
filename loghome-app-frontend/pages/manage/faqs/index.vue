<template>
	<view class="container">		
		<view class="content">
			<view class="filter-bar">
				<view class="filter-item" :class="{active: filterType === 'all'}" @click="setFilter('all')">全部</view>
				<view class="filter-item" :class="{active: filterType === 'unsolved'}" @click="setFilter('unsolved')">未解决</view>
				<view class="filter-item" :class="{active: filterType === 'typical'}" @click="setFilter('typical')">典型问题</view>
			</view>
			
			<view class="pagination" v-if="totalPages > 0">
				<view class="page-btn" :class="{disabled: currentPage === 1}" @click="prevPage">上一页</view>
				<view class="page-num">{{currentPage}} / {{totalPages}}</view>
				<view class="page-btn" :class="{disabled: currentPage === totalPages}" @click="nextPage">下一页</view>
			</view>

			<view class="faq-list">
				<view class="faq-item" v-for="faq in faqs" :key="faq.faq_id" @click="viewFaq(faq)">
					<view class="faq-main">
						<view class="faq-title">{{faq.faq_title}}</view>
						<view class="faq-info">
							<text class="user-name">提问者: {{faq.name}}</text>
							<text class="time">{{formatTime(faq.create_time)}}</text>
						</view>
					</view>
					<view class="faq-status">
						<text class="status" :class="{solved: faq.solved === 1, unsolved: faq.solved === 0}">
							{{faq.solved === 1 ? '已解决' : '未解决'}}
						</text>
						<text class="typical" v-if="faq.is_typical === 1">典型</text>
					</view>
				</view>
			</view>
			
			<view class="pagination" v-if="totalPages > 0">
				<view class="page-btn" :class="{disabled: currentPage === 1}" @click="prevPage">上一页</view>
				<view class="page-num">{{currentPage}} / {{totalPages}}</view>
				<view class="page-btn" :class="{disabled: currentPage === totalPages}" @click="nextPage">下一页</view>
			</view>
			
			<view class="no-data" v-if="faqs.length === 0">
				暂无FAQ数据
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			faqs: [],
			currentPage: 1,
			totalPages: 0,
			pageSize: 20,
			filterType: 'all', // 'all', 'unsolved', 'typical'
			totalFaqs: 0,
			unsolvedFaqs: 0,
			typicalFaqs: 0
		}
	},
	onShow() {
		this.loadFaqs()
		this.loadCounts()
	},
	methods: {
		async loadCounts() {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				
				// 获取总数
				const totalRes = await axios.get(this.$baseUrl + '/manage/faqs/get_faqs_amount', {
					headers: {
						'Authorization': tk
					}
				})
				this.totalFaqs = totalRes.data[0].count
				
				// 获取未解决数量
				const unsolvedRes = await axios.get(this.$baseUrl + '/manage/faqs/get_faqs_amount_to_solve', {
					headers: {
						'Authorization': tk
					}
				})
				this.unsolvedFaqs = unsolvedRes.data[0].count
				
				// 获取典型问题数量
				const typicalRes = await axios.get(this.$baseUrl + '/manage/faqs/get_faqs_amount_typical', {
					headers: {
						'Authorization': tk
					}
				})
				this.typicalFaqs = typicalRes.data[0].count
			} catch (e) {
				uni.showToast({
					title: '加载统计数据失败',
					icon: 'none'
				})
			}
		},
		async loadFaqs() {
			try {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk
				uni.showLoading({
					title: '加载中'
				})
				
				// 获取总数
				let countUrl = '/manage/faqs/get_faqs_amount'
				if (this.filterType === 'unsolved') {
					countUrl = '/manage/faqs/get_faqs_amount_to_solve'
				} else if (this.filterType === 'typical') {
					countUrl = '/manage/faqs/get_faqs_amount_typical'
				}
				
				const countRes = await axios.get(this.$baseUrl + countUrl, {
					headers: {
						'Authorization': tk
					}
				})
				this.totalPages = Math.ceil(countRes.data[0].count / this.pageSize)
				
				// 构建查询参数
				let params = {
					page: this.currentPage
				}
				
				if (this.filterType === 'unsolved') {
					params.filter = 'unsolved'
				} else if (this.filterType === 'typical') {
					params.filter = 'typical'
				}
				
				// 获取列表
				const res = await axios.get(this.$baseUrl + '/manage/faqs/get_all_faqs', {
					params: params,
					headers: {
						'Authorization': tk
					}
				})
				this.faqs = res.data
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
		viewFaq(faq) {
			uni.navigateTo({
				url: './detail?id=' + faq.faq_id
			})
		},
		prevPage() {
			if (this.currentPage > 1) {
				this.currentPage--
				this.loadFaqs()
			}
		},
		nextPage() {
			if (this.currentPage < this.totalPages) {
				this.currentPage++
				this.loadFaqs()
			}
		},
		setFilter(type) {
			this.filterType = type
			this.currentPage = 1
			this.loadFaqs()
		},
		formatTime(time) {
			if (!time) return ''
			const date = new Date(time)
			return date.getFullYear() + '-' + 
				   (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
				   date.getDate().toString().padStart(2, '0')
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

.filter-bar {
	display: flex;
	background: #fff;
	padding: 20rpx;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	
	.filter-item {
		padding: 10rpx 30rpx;
		margin-right: 20rpx;
		border-radius: 30rpx;
		font-size: 28rpx;
		color: #666;
		background: #f5f5f5;
		
		&.active {
			background: #007AFF;
			color: #fff;
		}
	}
}

.faq-list {
	.faq-item {
		background: #fff;
		padding: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.faq-main {
			flex: 1;
			min-width: 0;
			
			.faq-title {
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			
			.faq-info {
				font-size: 26rpx;
				color: #666;
				
				.user-name {
					margin-right: 20rpx;
				}
			}
		}
		
		.faq-status {
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			
			.status {
				padding: 4rpx 20rpx;
				border-radius: 20rpx;
				font-size: 24rpx;
				color: #fff;
				margin-bottom: 10rpx;
				
				&.solved {
					background-color: #4CAF50;
				}
				
				&.unsolved {
					background-color: #FF9800;
				}
			}
			
			.typical {
				padding: 4rpx 20rpx;
				border-radius: 20rpx;
				font-size: 24rpx;
				color: #fff;
				background-color: #9C27B0;
			}
		}
	}

	.faq-item:active {
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