<template>
	<view class="container" v-dark>
		<view class="header">
			<view class="title">{{ $t('settings.storageManage.title') }}</view>
		</view>

		<view class="storage-info">
			<view class="storage-item" v-for="(item, index) in storageItems" :key="index">
				<view class="item-header">
					<view class="item-title">{{ $t(item.nameKey) }}</view>
					<view class="item-size">{{ formatSize(item.size) }}</view>
				</view>
				<view class="item-desc">{{ $t(item.descKey) }}</view>
				<view class="item-actions">
					<button class="action-btn" @click="clearAll(item.id)">{{ $t('settings.storageManage.clearAll') }}</button>
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
					nameKey: 'settings.storageManage.articleName',
					descKey: 'settings.storageManage.articleDesc',
					size: 0,
					db: articleDB
				},
				{
					id: 'img',
					nameKey: 'settings.storageManage.imgName',
					descKey: 'settings.storageManage.imgDesc',
					size: 0,
					db: imgDB
				},
				{
					id: 'writer',
					nameKey: 'settings.storageManage.writerName',
					descKey: 'settings.storageManage.writerDesc',
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
				title: this.$t('settings.storageManage.warning'),
				content: this.$t('settings.storageManage.clearConfirm'),
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
									title: this.$t('settings.storageManage.clearDone'),
									icon: 'success'
								});
							} catch (error) {
								console.error('清理数据库出错:', error);
								uni.showToast({
									title: this.$t('settings.storageManage.clearFailed'),
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
	border-bottom: 1px solid var(--border-color);
	margin-bottom: 30rpx;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: var(--text-color-primary);
}

.storage-info {
	padding: 10rpx;
}

.storage-item {
	background-color: var(--card-background);
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
	color: var(--text-color-primary);
}

.item-size {
	font-size: 28rpx;
	color: #EA7034;
	font-weight: bold;
}

.item-desc {
	font-size: 26rpx;
	color: var(--text-color-regular);
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