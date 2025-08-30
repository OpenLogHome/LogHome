<template>
	<view class="content">
		<view class="time-machine-container">
			<!-- 左侧列表区域 -->
			<view class="history-list">
				<view class="list-header">
					<text class="header-title">历史记录</text>
					<text class="record-count" v-if="historyRecords.length > 0">{{ historyRecords.length }} 条</text>
				</view>
				<scroll-view scroll-y class="record-list">
					<view 
						v-for="(item, index) in historyRecords" 
						:key="item.id || index" 
						class="record-item"
						:class="{'selected': selectedRecordIndex === index}"
						@click="selectRecord(index)"
					>
						<view class="record-title">{{ item.title }}</view>
						<view class="record-info">
							<text class="record-time">{{ item.create_time }}</text>
							<text class="record-source">{{ item.source }}</text>
							<text class="record-count">{{ getTextCount(item.content) }}字 {{ getImageCount(item.content) }}图</text>
						</view>
					</view>
					<view class="no-records" v-if="historyRecords.length === 0">
						<text>暂无历史记录</text>
					</view>
				</scroll-view>
			</view>
			
			<!-- 右侧预览区域 -->
			<view class="content-preview">
				<view class="preview-header" v-if="selectedRecord">
					<text class="preview-title">{{ selectedRecord.title }}</text>
					<view class="preview-info">
						<text>{{ selectedRecord.create_time }}</text>
						<text>{{ getTextCount(selectedRecord.content) }}字 {{ getImageCount(selectedRecord.content) }}图</text>
					</view>
					<view class="action-buttons">
						<button class="action-btn copy-btn" @click="copyToClipboard">复制到剪贴板</button>
						<button class="action-btn restore-btn" @click="restoreVersion">恢复此版本</button>
					</view>
				</view>
				<scroll-view scroll-y class="preview-content" v-if="selectedRecord">
					<view class="rich-content">
						<block v-for="(block, blockIndex) in parsedContent" :key="blockIndex">
							<image v-if="block.type === 'image'" :src="block.img" mode="widthFix" class="content-image"></image>
							<text v-else-if="block.type === 'text'" class="content-text">{{ block.value }}</text>
						</block>
					</view>
				</scroll-view>
				<view class="no-selection" v-else>
					<text>请从左侧选择一个历史版本</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import axios from 'axios'
import { writerArticleDB } from "../../lib/db.js"
import { getServerTime } from "../../lib/utils.js"

export default {
	data() {
		return {
			novelId: 0,
			articleId: 0,
			historyRecords: [],
			selectedRecordIndex: -1,
			selectedRecord: null,
			novel: {}
		}
	},
	onLoad(option) {
		uni.showLoading({
			title: '加载历史记录中'
		});
		
		if (JSON.stringify(option) == "{}") {
			uni.showToast({
				title: "参数错误",
				icon: 'none',
				duration: 2000
			});
			return;
		}
		
		this.articleId = option.id;
		this.novelId = option.novelId;
		this.loadHistoryRecords();
	},
	computed: {
		parsedContent() {
			if (!this.selectedRecord || !this.selectedRecord.content) return [];
			
			try {
				return JSON.parse(this.selectedRecord.content);
			} catch (e) {
				console.error('解析内容失败:', e);
				return [{ type: 'text', value: '内容解析失败' }];
			}
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
	
	    // 时间戳转为时间，格式为YYYYMMDDhhmmss
	    var date = new Date(parseInt(timestamp) * 1000);
	    var year = date.getFullYear();
	    var month = (date.getMonth() + 1).toString().padStart(2, '0');
	    var day = date.getDate().toString().padStart(2, '0');
	    var hours = date.getHours().toString().padStart(2, '0');
	    var minutes = date.getMinutes().toString().padStart(2, '0');
	    var seconds = date.getSeconds().toString().padStart(2, '0');
	    
	    var beijing_datetime = year + month + day + hours + minutes + seconds;
	    return beijing_datetime; // 例如：20170331160206
	},
		async loadHistoryRecords() {
			try {
				// 1. 加载本地IndexedDB中的历史记录
				const localRecords = await this.loadLocalRecords();
				
				// 2. 加载云端历史记录
				const cloudRecords = await this.loadCloudRecords();

				const readerRecords = await this.loadReaderVersion();

				console.log(localRecords, cloudRecords, readerRecords);
				
				// 3. 合并相同记录并按时间排序
				// 创建一个Map用于检测重复记录
				const recordMap = new Map();
				let mergedRecords = [];
				
				// 处理本地记录
				localRecords.forEach(localRecord => {
					const key = `${localRecord.create_time}-${localRecord.title}-${localRecord.content}`;
					recordMap.set(key, { record: localRecord, sources: ['本地备份'] });
				});
				
				// 处理云端记录，检查是否有相同记录
				cloudRecords.forEach(cloudRecord => {
					const key = `${cloudRecord.create_time}-${cloudRecord.title}-${cloudRecord.content}`;
					
					if (recordMap.has(key)) {
						// 如果有相同记录，合并来源
						const existingEntry = recordMap.get(key);
						existingEntry.sources.push('云端备份');
						existingEntry.record.source = '本地&云端';
						// 保留云端记录的is_slow_save标记
						existingEntry.record.is_slow_save = true;
					} else {
						// 如果没有相同记录，添加到Map
						recordMap.set(key, { record: cloudRecord, sources: ['云端备份'] });
					}
				});
				
				// 将Map转换为数组
				recordMap.forEach(entry => {
					mergedRecords.push(entry.record);
				});

				mergedRecords = mergedRecords.concat(readerRecords);
				
				// 按时间降序排列（最新的在前面）
				this.historyRecords = mergedRecords.sort((a, b) => {
					return b.create_time - a.create_time;
				});
				
				// 4. 如果有记录，默认选中第一条
				if (this.historyRecords.length > 0) {
					this.selectRecord(0);
				}
			} catch (error) {
				console.error('加载历史记录失败:', error);
				uni.showToast({
					title: '加载历史记录失败',
					icon: 'none',
					duration: 2000
				});
			} finally {
				uni.hideLoading();
			}
		},

		async loadReaderVersion() {
			try {
				// 从云端API加载历史记录
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				
				const response = await axios.get(
					this.$baseUrl + '/essays/get_article?id=' + this.articleId,
					{
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk
						}
					}
				);
				
				// 添加来源标记
				return response.data.map(record => ({
					...record,
					source: '发布版本',
					create_time: this.utc2beijing(record.update_time),
					is_slow_save: true // 云端备份视为完整备份
				}));
			} catch (error) {
				console.error('加载发布版本记录失败:', error);
				return [];
			}
		},
		
		async loadLocalRecords() {
			try {
				// 从IndexedDB加载本地历史记录
				const records = await writerArticleDB.articles
					.where('article_id')
					.equals(Number(this.articleId))
					.toArray();
				
				// 添加来源标记
				return records.map(record => ({
					...record,
					source: '本地备份',
					id: record.id // 确保有唯一ID
				}));
			} catch (error) {
				console.error('加载本地历史记录失败:', error);
				return [];
			}
		},
		
		async loadCloudRecords() {
			try {
				// 从云端API加载历史记录
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				
				const response = await axios.get(
					this.$baseUrl + '/essays/get_article_history?id=' + this.articleId,
					{
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + tk
						}
					}
				);
				
				// 添加来源标记
				return response.data.map(record => ({
					...record,
					source: '云端备份',
					create_time: record.create_time,
					is_slow_save: true // 云端备份视为完整备份
				}));
			} catch (error) {
				console.error('加载云端历史记录失败:', error);
				return [];
			}
		},
		
		selectRecord(index) {
			this.selectedRecordIndex = index;
			this.selectedRecord = this.historyRecords[index];
		},
		
		getTextCount(contentString) {
			try {
				const content = JSON.parse(contentString);
				let count = 0;
				
				content.forEach(item => {
					if (item.type === 'text') {
						count += item.value.length;
					}
				});
				
				return count;
			} catch (e) {
				return 0;
			}
		},
		
		getImageCount(contentString) {
			try {
				const content = JSON.parse(contentString);
				let count = 0;
				
				content.forEach(item => {
					if (item.type === 'image') {
						count++;
					}
				});
				
				return count;
			} catch (e) {
				return 0;
			}
		},
		
		copyToClipboard() {
			if (!this.selectedRecord) return;
			
			// 提取纯文本内容
			let textContent = '';
			try {
				const content = JSON.parse(this.selectedRecord.content);
				content.forEach(item => {
					if (item.type === 'text') {
						textContent += item.value + '\n\n';
					}
				});
			} catch (e) {
				textContent = '内容解析失败';
			}
			
			uni.setClipboardData({
				data: textContent,
				success: () => {
					uni.showToast({
						title: '内容已复制到剪贴板',
						icon: 'success',
						duration: 2000
					});
				}
			});
		},
		
		restoreVersion() {
			if (!this.selectedRecord) return;
			
			uni.showModal({
				title: '恢复版本',
				content: '确定要恢复到此版本吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							uni.showLoading({
								title: '正在恢复'
							});
							
							// 获取当前服务器时间
							const currentServerTime = await getServerTime();
							
							// 更新云端内容
							let tk = JSON.parse(window.localStorage.getItem('token'));
							if (tk) tk = tk.tk;
							
							// 发送请求
							let res = axios.post(this.$baseUrl + '/essays/upload_article_writer',
								{
									article_id: this.articleId,
									title: this.selectedRecord.title,
									content: this.selectedRecord.content,
									create_time: currentServerTime,
									novel_id: this.novelId,
									is_fast_save: false,
									is_force: true
								},
								{
									headers: {
										'Content-Type': 'application/json', //设置请求头请求格式为JSON
										'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
									}
								}
							);

							writerArticleDB.articles.add({
								article_id: Number(this.articleId),
								title: this.selectedRecord.title,
								content: this.selectedRecord.content,
								create_time: currentServerTime,
								is_slow_save: true // 标记为慢保存
							});
							
							uni.hideLoading();
							uni.showToast({
								title: '版本已恢复',
								icon: 'success',
								duration: 2000
							});

							uni.redirectTo({
								url: '/pages/writers/chapterEditor?id=' + this.articleId
							});
						} catch (error) {
							console.error('恢复版本失败:', error);
							uni.hideLoading();
							uni.showToast({
								title: '恢复版本失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				}
			});
		}
	}
}
</script>

<style scoped>
.content {
	width: 100%;
	height: calc(100vh - 44px);
	background-color: #f8f8f8;
}

.time-machine-container {
	display: flex;
	height: 100%;
	width: 100%;
}

/* 左侧列表样式 */
.history-list {
	width: 33%;
	height: 100%;
	background-color: #fff;
	border-right: 1px solid #eaeaea;
	display: flex;
	flex-direction: column;
}

.list-header {
	padding: 20rpx;
	border-bottom: 1px solid #eaeaea;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.header-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.record-count {
	font-size: 24rpx;
	color: #999;
}

.record-list {
	flex: 1;
	overflow-y: auto;
}

.record-item {
	padding: 20rpx;
	border-bottom: 1px solid #eaeaea;
	position: relative;
}

.record-item.selected {
	background-color: #f0f7ff;
	border-left: 4rpx solid #1875F0;
}

.record-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.record-info {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
}

.record-time, .record-source, .record-count {
	font-size: 24rpx;
	color: #999;
}

.record-tag {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	background-color: #e6f7ff;
	color: #1890ff;
	font-size: 20rpx;
	padding: 4rpx 10rpx;
	border-radius: 10rpx;
}

.no-records {
	padding: 40rpx;
	text-align: center;
	color: #999;
}

/* 右侧预览样式 */
.content-preview {
	width: 67%;
	height: 100%;
	background-color: #fff;
	display: flex;
	flex-direction: column;
}

.preview-header {
	padding: 20rpx;
	border-bottom: 1px solid #eaeaea;
}

.preview-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.preview-info {
	display: flex;
	gap: 20rpx;
	font-size: 24rpx;
	color: #999;
	margin-bottom: 20rpx;
}

.action-buttons {
	display: flex;
	gap: 20rpx;
}

.action-btn {
	font-size: 28rpx;
	padding: 10rpx 30rpx;
	border-radius: 8rpx;
}

.copy-btn {
	background-color: #f0f0f0;
	color: #333;
}

.restore-btn {
	background-color: #1875F0;
	color: #fff;
}

.preview-content {
	flex: 1;
	overflow-y: auto;
	/* padding: 20rpx; */
}

.rich-content {
	padding: 20rpx;
	background-color: #fff;
}

.content-text {
	font-size: 30rpx;
	line-height: 1.6;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.content-image {
	max-width: 100%;
	margin: 20rpx 0;
	border-radius: 8rpx;
}

.no-selection {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	color: #999;
	font-size: 28rpx;
}
</style>