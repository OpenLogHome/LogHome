<template>
	<view class="statistics-container">
		<!-- 核心数据展示 -->
		<view class="core-metrics">
			<view class="metrics-title">
				<text>核心数据</text>
			</view>
			<view class="metrics-grid">
				<view class="metric-item">
					<text class="metric-value">{{ coreData.views || 0 }}</text>
					<text class="metric-label">阅读量</text>
				</view>
				<view class="metric-item">
					<text class="metric-value">{{ coreData.likes || 0 }}</text>
					<text class="metric-label">点赞</text>
				</view>
				<view class="metric-item">
					<text class="metric-value">{{ coreData.favorites || 0 }}</text>
					<text class="metric-label">收藏</text>
				</view>
				<view class="metric-item">
					<text class="metric-value">{{ coreData.comments || 0 }}</text>
					<text class="metric-label">评论</text>
				</view>
				<view class="metric-item">
					<text class="metric-value">{{ coreData.shares || 0 }}</text>
					<text class="metric-label">分享</text>
				</view>
				<view class="metric-item">
					<text class="metric-value">{{ coreData.tips || 0 }}</text>
					<text class="metric-label">打赏</text>
				</view>
			</view>
		</view>

		<!-- 趋势图表 -->
		<view class="trend-section">
			<view class="trend-title">
				<text>近30天阅读趋势</text>
				<text class="trend-subtitle">每日更新</text>
			</view>
			<view class="chart-container">
				<canvas canvas-id="readChart" id="readChart" class="charts"></canvas>
			</view>
		</view>

		<!-- 互动数据趋势 -->
		<view class="trend-section">
			<view class="trend-title">
				<text>点赞趋势</text>
				<text class="trend-subtitle">每日更新</text>
			</view>
			<view class="chart-container">
				<canvas canvas-id="likesChart" id="likesChart" class="charts"></canvas>
			</view>
		</view>

		<view class="trend-section">
			<view class="trend-title">
				<text>收藏趋势</text>
				<text class="trend-subtitle">每日更新</text>
			</view>
			<view class="chart-container">
				<canvas canvas-id="favoritesChart" id="favoritesChart" class="charts"></canvas>
			</view>
		</view>

		<view class="trend-section">
			<view class="trend-title">
				<text>评论趋势</text>
				<text class="trend-subtitle">每日更新</text>
			</view>
			<view class="chart-container">
				<canvas canvas-id="commentsChart" id="commentsChart" class="charts"></canvas>
			</view>
		</view>

		<view class="trend-section">
			<view class="trend-title">
				<text>打赏趋势</text>
				<text class="trend-subtitle">每日更新</text>
			</view>
			<view class="chart-container">
				<canvas canvas-id="tipsChart" id="tipsChart" class="charts"></canvas>
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'
import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js'
var readChartInstance = {};
var likesChartInstance = {};
var favoritesChartInstance = {};
var commentsChartInstance = {};
var tipsChartInstance = {};

export default {
	name: 'NovelStatistics',
	data() {
		return {
			novel_id: -1,
			totalViews: 0,
			coreData: {
				views: 0,
				likes: 0,
				favorites: 0,
				comments: 0,
				shares: 0,
				tips: 0
			}
		}
	},
	methods: {
		async fetchStatistics() {
			try {
				const res = await axios.get(this.$baseUrl + '/articles/get_novel_specific_statistics?novel_id=' + this.novel_id)
				if (!res.data || !res.data.length) return

				const statistics = res.data
				const dateLabels = this.generateDateLabels(30)

				// 处理核心数据
				const latestData = statistics[statistics.length - 1]
				this.coreData = {
					views: latestData.clicks || 0,
					likes: latestData.nices || 0,
					favorites: latestData.likes || 0,
					comments: latestData.comments || 0,
					shares: latestData.shares || 0,
					tips: latestData.tippings || 0
				}

				// 计算总阅读量
				this.totalViews = statistics.reduce((sum, item) => sum + (item.clicks || 0), 0)

				// 绘制阅读量趋势图
				this.drawReadChart(dateLabels, statistics.map(item => item.clicks || 0))

				// 绘制各个互动数据趋势图
				this.drawLikesChart(dateLabels, statistics.map(item => item.nices || 0))
				this.drawFavoritesChart(dateLabels, statistics.map(item => item.likes || 0))
				this.drawCommentsChart(dateLabels, statistics.map(item => item.comments || 0))
				this.drawTipsChart(dateLabels, statistics.map(item => item.tippings || 0))

			} catch (error) {
				console.error(error)
				uni.showToast({
					title: '获取统计数据失败',
					icon: 'none'
				})
			}
		},
		generateDateLabels(days) {
			const labels = []
			const today = new Date()

			for (let i = days - 1; i >= 0; i--) {
				const date = new Date(today - i * 24 * 60 * 60 * 1000)
				const month = (date.getMonth() + 1).toString().padStart(2, '0')
				const day = date.getDate().toString().padStart(2, '0')
				labels.push(`${month}-${day}`)
			}

			return labels
		},
		drawReadChart(categories, data) {
			const ctx = uni.createCanvasContext('readChart', this)
			readChartInstance = new uCharts({
				type: 'line',
				context: ctx,
				width: uni.upx2px(700),
				height: uni.upx2px(500),
				categories: categories,
				dataLabel: false,
				series: [{
					name: '阅读量',
					data: data,
					color: '#ea7034',
					type: 'line',
					style: 'curve',
					pointShape: 'circle',
					format: () => '',
					textSize: 0,
					labelText: ''
				}],
				padding: [15, 15, 15, 15],
				legend: { show: false },
				xAxis: {
					disableGrid: true,
					// rotateLabel: true,
					fontColor: '#666666',
					fontSize: 12,
					labelCount: 5,
					boundaryGap: 'justify'
				},
				yAxis: {
					gridType: 'dash',
					dashLength: 4,
					data: [{ min: 0 }],
					fontColor: '#666666',
					fontSize: 12,
					format: 'integer'
				},
				extra: {
					line: {
						width: 2,
						activeType: 'hollow',
						linearType: 'none',
						showLabel: false,
						labelShow: false,
						label: {
							show: false,
							position: 'top',
							fontSize: 0,
							format: () => ''
						}
					},
					tooltip: {
						showBox: true,
						showArrow: false,
						showCategory: true,
						borderWidth: 0,
						borderRadius: 4,
						borderColor: '#000000',
						borderOpacity: 0.1,
						bgColor: '#000000',
						bgOpacity: 0.7,
						gridType: 'dash',
						dashLength: 4,
						gridColor: '#cccccc',
						fontColor: '#FFFFFF',
						splitLine: false,
						horizentalLine: false,
						xAxisLabel: false,
						yAxisLabel: false,
						labelBgColor: 'transparent',
						labelBgOpacity: 0.7,
						labelFontColor: '#666666'
					}
				}
			});
		},
		drawLikesChart(categories, data) {
			const ctx = uni.createCanvasContext('likesChart', this)
			likesChartInstance = new uCharts({
				type: 'line',
				context: ctx,
				width: uni.upx2px(700),
				height: uni.upx2px(500),
				categories: categories,
				dataLabel: false,
				series: [{
					name: '点赞',
					data: data,
					color: '#ff6b6b',
					type: 'line',
					style: 'curve',
					pointShape: 'circle'
				}],
				padding: [15, 15, 15, 15],
				legend: { show: false },
				xAxis: {
					disableGrid: true,
					fontColor: '#666666',
					fontSize: 12,
					labelCount: 5,
					boundaryGap: 'justify'
				},
				yAxis: {
					gridType: 'dash',
					dashLength: 4,
					data: [{ min: 0 }],
					fontColor: '#666666',
					fontSize: 12,
					format: 'integer'
				},
				extra: {
					line: {
						width: 2,
						activeType: 'hollow',
						linearType: 'none'
					}
				}
			});
		},
		drawFavoritesChart(categories, data) {
			const ctx = uni.createCanvasContext('favoritesChart', this)
			favoritesChartInstance = new uCharts({
				type: 'line',
				context: ctx,
				width: uni.upx2px(700),
				height: uni.upx2px(500),
				categories: categories,
				dataLabel: false,
				series: [{
					name: '收藏',
					data: data,
					color: '#ffd93d',
					type: 'line',
					style: 'curve',
					pointShape: 'circle'
				}],
				padding: [15, 15, 15, 15],
				legend: { show: false },
				xAxis: {
					disableGrid: true,
					fontColor: '#666666',
					fontSize: 12,
					labelCount: 5,
					boundaryGap: 'justify'
				},
				yAxis: {
					gridType: 'dash',
					dashLength: 4,
					data: [{ min: 0 }],
					fontColor: '#666666',
					fontSize: 12,
					format: 'integer'
				},
				extra: {
					line: {
						width: 2,
						activeType: 'hollow',
						linearType: 'none'
					}
				}
			});
		},
		drawCommentsChart(categories, data) {
			const ctx = uni.createCanvasContext('commentsChart', this)
			commentsChartInstance = new uCharts({
				type: 'line',
				context: ctx,
				width: uni.upx2px(700),
				height: uni.upx2px(500),
				categories: categories,
				dataLabel: false,
				series: [{
					name: '评论',
					data: data,
					color: '#6c5ce7',
					type: 'line',
					style: 'curve',
					pointShape: 'circle'
				}],
				padding: [15, 15, 15, 15],
				legend: { show: false },
				xAxis: {
					disableGrid: true,
					fontColor: '#666666',
					fontSize: 12,
					labelCount: 5,
					boundaryGap: 'justify'
				},
				yAxis: {
					gridType: 'dash',
					dashLength: 4,
					data: [{ min: 0 }],
					fontColor: '#666666',
					fontSize: 12,
					format: 'integer'
				},
				extra: {
					line: {
						width: 2,
						activeType: 'hollow',
						linearType: 'none'
					}
				}
			});
		},
		drawTipsChart(categories, data) {
			const ctx = uni.createCanvasContext('tipsChart', this)
			tipsChartInstance = new uCharts({
				type: 'line',
				context: ctx,
				width: uni.upx2px(700),
				height: uni.upx2px(500),
				categories: categories,
				dataLabel: false,
				series: [{
					name: '打赏',
					data: data,
					color: '#a8e6cf',
					type: 'line',
					style: 'curve',
					pointShape: 'circle'
				}],
				padding: [15, 15, 15, 15],
				legend: { show: false },
				xAxis: {
					disableGrid: true,
					fontColor: '#666666',
					fontSize: 12,
					labelCount: 5,
					boundaryGap: 'justify'
				},
				yAxis: {
					gridType: 'dash',
					dashLength: 4,
					data: [{ min: 0 }],
					fontColor: '#666666',
					fontSize: 12,
					format: 'integer'
				},
				extra: {
					line: {
						width: 2,
						activeType: 'hollow',
						linearType: 'none'
					}
				}
			});
		}
	},
	onLoad(params) {
		if (params.id) {
			this.novel_id = params.id
			this.fetchStatistics()
		} else {
			uni.navigateBack()
		}
	},
	onReady() {
		if (this.novel_id !== -1) {
			this.fetchStatistics()
		}
	},
	onResize() {
		if (readChartInstance) readChartInstance.resize()
		if (likesChartInstance) likesChartInstance.resize()
		if (favoritesChartInstance) favoritesChartInstance.resize()
		if (commentsChartInstance) commentsChartInstance.resize()
		if (tipsChartInstance) tipsChartInstance.resize()
	}
}
</script>

<style lang="scss" scoped>
.statistics-container {
	padding: 20rpx;
	background-color: #f8f9fa;
	min-height: 100vh;

	.overview-section {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;

		.status-card,
		.total-card,
		.ratio-card {
			background: #fff;
			padding: 30rpx;
			border-radius: 12rpx;
			flex: 1;
			margin: 0 10rpx;
			box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

			.status-label,
			.total-label,
			.ratio-label {
				font-size: 24rpx;
				color: #666;
				display: block;
				margin-bottom: 10rpx;
			}

			.status-value,
			.total-value,
			.ratio-value {
				font-size: 40rpx;
				font-weight: bold;
				color: #333;

				&.normal {
					color: #20bf6b;
				}
			}
		}
	}

	.core-metrics {
		background: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.metrics-title {
			font-size: 32rpx;
			color: #333;
			margin-bottom: 30rpx;
			font-weight: bold;
		}

		.metrics-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 30rpx;

			.metric-item {
				text-align: center;
				padding: 20rpx;
				background: #f8f9fa;
				border-radius: 8rpx;

				.metric-value {
					font-size: 40rpx;
					font-weight: bold;
					color: #333;
					display: block;
					margin-bottom: 10rpx;
				}

				.metric-label {
					font-size: 24rpx;
					color: #666;
				}
			}
		}
	}

	.trend-section {
		background: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.trend-title {
			font-size: 32rpx;
			color: #333;
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: bold;

			.trend-subtitle {
				font-size: 24rpx;
				color: #999;
				font-weight: normal;
			}
		}

		.chart-container {
			height: 500rpx;
			width: 100%;
			margin-top: 20rpx;

			.charts {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>