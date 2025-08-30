<template>
	<view class="container">
		<view class="header">
			<view class="title">空间占用管理</view>
		</view>

		<view class="storage-info">
			<view class="storage-item" v-for="(item, index) in storageItems" :key="index">
				<view class="item-header">
					<view class="item-title">{{ item.name }}</view>
					<view class="item-size">{{ formatSize(item.size) }}</view>
				</view>
				<view class="item-desc">{{ item.description }}</view>
				<view class="item-actions">
					<button class="action-btn" @click="clearAll(item.id)">清空全部</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { articleDB, imgDB, writerArticleDB } from '../../lib/db.js';

export default {
	data() {
		return {
			storageItems: [
				{
					id: 'article',
					name: '阅读器数据库',
					description: '存储已下载的小说和章节内容',
					size: 0,
					db: articleDB
				},
				{
					id: 'img',
					name: '图片缓存数据库',
					description: '存储已缓存的图片数据',
					size: 0,
					db: imgDB
				},
				{
					id: 'writer',
					name: '写作备份数据库',
					description: '存储本地备份的章节历史记录',
					size: 0,
					db: writerArticleDB
				}
			]
		}
	},
	onShow() {
		this.calculateStorageSizes();
	},
	methods: {
		async calculateStorageSizes() {
			for (let item of this.storageItems) {
				item.size = await this.getDBSize(item.db);
			}
		},
		async getDBSize(db) {
			let totalSize = 0;

			// 获取数据库中所有表
			const tables = db.tables;

			for (const table of tables) {
				const allItems = await table.toArray();

				for (const item of allItems) {
					totalSize += this.getObjectSize(item);
				}
			}

			return totalSize;
		},
		getObjectSize(obj) {
			let str = JSON.stringify(obj);

			// 处理Blob对象
			if (obj.img_blob instanceof Blob) {
				return obj.img_blob.size;
			}

			// 普通对象使用字符串长度估算
			return str.length;
		},
		formatSize(bytes) {
			if (bytes === 0) return '0 B';

			const k = 1024;
			const sizes = ['B', 'KB', 'MB', 'GB'];
			const i = Math.floor(Math.log(bytes) / Math.log(k));

			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
		},
		async clearAll(dbId) {
			uni.showModal({
				title: '警告',
				content: '确定要清空所有数据吗？此操作不可恢复！',
				confirmColor: '#EA7034',
				success: async (res) => {
					if (res.confirm) {
						const item = this.storageItems.find(item => item.id === dbId);
						if (item) {
							try {
								// 清空数据库中的所有表
								for (const table of item.db.tables) {
									await table.clear();
								}

								// 更新存储大小
								item.size = 0;

								uni.showToast({
									title: '清理完成',
									icon: 'success'
								});
							} catch (error) {
								console.error('清理数据库出错:', error);
								uni.showToast({
									title: '清理失败',
									icon: 'none'
								});
							}
						}
					}
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	position: relative;
}

.header {
	padding: 20rpx 0;
	border-bottom: 1px solid #eee;
	margin-bottom: 30rpx;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.storage-info {
	padding: 10rpx;
}

.storage-item {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.item-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.item-size {
	font-size: 28rpx;
	color: #EA7034;
	font-weight: bold;
}

.item-desc {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 20rpx;
}

.item-actions {
	display: flex;
	justify-content: space-between;
}

.action-btn {
	background-color: #EA7034;
	color: #fff;
	font-size: 26rpx;
	padding: 10rpx 20rpx;
	border-radius: 6rpx;
	width: 48%;
	text-align: center;
	height: 70rpx;
	line-height: 50rpx;
}
</style>