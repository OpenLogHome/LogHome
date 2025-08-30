<template>
	<uni-popup ref="popup" type="center" :mask-click="false">
		<view class="conflict-dialog">
			<view class="dialog-header">
				<text class="dialog-title">{{ title }}</text>
				<text class="dialog-subtitle">请选择要保留的版本</text>
			</view>
			
			<view class="dialog-content">
				<!-- 本地版本卡片 -->
				<view class="version-card" :class="{ 'newer': local.isNewer }" @click="selectVersion('local')">
					<view class="card-header">
						<text class="card-title">本地版本</text>
						<text v-if="local.isNewer" class="newer-badge">更新</text>
					</view>
					<view class="card-time">{{ local.time }}</view>
					<view class="card-stats">
						<text class="stat-item">{{ local.textCount }} 字</text>
						<text class="stat-item">{{ local.imageCount }} 图片</text>
					</view>
					<view class="select-button local">选择本地版本</view>
				</view>
				
				<!-- 云端版本卡片 -->
				<view class="version-card" :class="{ 'newer': cloud.isNewer }" @click="selectVersion('cloud')">
					<view class="card-header">
						<text class="card-title">云端版本</text>
						<text v-if="cloud.isNewer" class="newer-badge">更新</text>
					</view>
					<view class="card-time">{{ cloud.time }}</view>
					<view class="card-stats">
						<text class="stat-item">{{ cloud.textCount }} 字</text>
						<text class="stat-item">{{ cloud.imageCount }} 图片</text>
					</view>
					<view class="select-button cloud">选择云端版本</view>
				</view>
			</view>
			
			<!-- <view class="dialog-footer">
				<view class="cancel-button" @click="cancel">取消</view>
			</view> -->
		</view>
	</uni-popup>
</template>

<script>
export default {
	name: 'ConflictDialog',
	data() {
		return {
			title: '版本冲突',
			type: '',
			local: {
				time: '',
				isNewer: false,
				textCount: 0,
				imageCount: 0
			},
			cloud: {
				time: '',
				isNewer: false,
				textCount: 0,
				imageCount: 0
			},
			callback: null
		};
	},
	methods: {
		show(options) {
			this.title = options.title || '版本冲突';
			this.type = options.type || 'conflict';
			this.local = options.local || this.local;
			this.cloud = options.cloud || this.cloud;
			this.callback = options.callback || null;
			this.$refs.popup.open();
		},
		selectVersion(version) {
			this.$refs.popup.close();
			if (this.callback) {
				this.callback(version);
			}
		},
		cancel() {
			this.$refs.popup.close();
			if (this.callback) {
				this.callback('cancel');
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.conflict-dialog {
	width: 650rpx;
	background-color: #fff;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
}

.dialog-header {
	padding: 30rpx;
	background-color: #f8f8f8;
	border-bottom: 1rpx solid #eee;
}

.dialog-title {
	display: block;
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.dialog-subtitle {
	display: block;
	font-size: 28rpx;
	color: #666;
}

.dialog-content {
	padding: 30rpx;
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.version-card {
	background-color: #f9f9f9;
	border-radius: 12rpx;
	padding: 24rpx;
	border: 2rpx solid #eee;
	transition: all 0.3s;
}

.version-card.newer {
	border-color: #4CAF50;
	background-color: rgba(76, 175, 80, 0.05);
}

.version-card:active {
	transform: scale(0.98);
	opacity: 0.9;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.newer-badge {
	background-color: #4CAF50;
	color: white;
	font-size: 24rpx;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
}

.card-time {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 16rpx;
}

.card-stats {
	display: flex;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.stat-item {
	font-size: 28rpx;
	color: #666;
	background-color: rgba(0, 0, 0, 0.05);
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
}

.select-button {
	text-align: center;
	padding: 16rpx;
	border-radius: 8rpx;
	font-size: 28rpx;
	font-weight: bold;
	color: white;
	margin-top: 10rpx;
}

.select-button.local {
	background-color: #2196F3;
}

.select-button.cloud {
	background-color: #FF9800;
}

.dialog-footer {
	padding: 20rpx 30rpx;
	border-top: 1rpx solid #eee;
	display: flex;
	justify-content: center;
}

.cancel-button {
	padding: 16rpx 30rpx;
	border-radius: 8rpx;
	font-size: 28rpx;
	color: #666;
	background-color: #f2f2f2;
	text-align: center;
}

.cancel-button:active {
	background-color: #e0e0e0;
}
</style>