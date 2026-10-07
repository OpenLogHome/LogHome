<template>
	<div class="fans_rank" :class="{ 'fans_rank--empty': fanInfo.length === 0, 'fans_rank--compact': fanInfo.length > 0 && fanInfo.length < 3 }" v-dark>
		<view v-if="fanInfo.length === 0" class="fans-empty" role="status">
			<text class="fans-empty-title">暂无贡献记录</text>
			<text class="fans-empty-hint">成为第一位支持这部作品的读者吧</text>
		</view>
		<view v-else-if="fanInfo.length < 3" class="fans-compact-list">
			<view v-for="(fan, index) in fanInfo" :key="fan.user_id || index" class="fans-compact-row" :class="'compact-medal-' + index">
				<text class="compact-rank">{{ index + 1 }}</text>
				<view class="compact-avatar-wrap">
					<user-avatar :src="fan.avatar_url" :frame="fan.avatar_frame" class="compact-avatar"
						:visual-scale="fan.avatar_frame ? 1.15 : 1" />
					<image class="compact-medal" :src="'/static/fans/medal-' + index + '.svg'" mode="aspectFit" />
				</view>
				<view class="compact-info">
					<text class="compact-name">{{ fan.user_name }}</text>
					<text class="compact-message" v-if="fan.message">{{ fan.message }}</text>
				</view>
				<view class="compact-score">
					<text class="compact-value">{{ fan.fans_value }}</text>
					<text class="compact-unit">贡献值</text>
				</view>
			</view>
		</view>
		<div v-else class="fans-podium">
			<div class="podium-card podium-2" v-if="fanInfo[1]">
				<view class="podium-badge"><text class="podium-badge-top">TOP</text><text class="podium-badge-no">2</text></view>
				<view class="podium-avatar-wrap">
					<user-avatar :src="fanInfo[1].avatar_url" :frame="fanInfo[1].avatar_frame" class="podium-avatar"
						:visual-scale="fanInfo[1].avatar_frame ? 1.15 : 1" />
				</view>
				<view class="podium-name">{{ fanInfo[1].user_name }}</view>
				<view class="podium-score">{{ fanInfo[1].fans_value }}<text class="podium-score-unit">贡献值</text></view>
			</div>
			<div class="podium-card podium-1" v-if="fanInfo[0]">
				<view class="podium-badge"><text class="podium-badge-top">TOP</text><text class="podium-badge-no">1</text></view>
				<view class="podium-avatar-wrap">
					<user-avatar :src="fanInfo[0].avatar_url" :frame="fanInfo[0].avatar_frame" class="podium-avatar"
						:visual-scale="fanInfo[0].avatar_frame ? 1.15 : 1" />
				</view>
				<view class="podium-name">{{ fanInfo[0].user_name }}</view>
				<view class="podium-score">{{ fanInfo[0].fans_value }}<text class="podium-score-unit">贡献值</text></view>
			</div>
			<div class="podium-card podium-3" v-if="fanInfo[2]">
				<view class="podium-badge"><text class="podium-badge-top">TOP</text><text class="podium-badge-no">3</text></view>
				<view class="podium-avatar-wrap">
					<user-avatar :src="fanInfo[2].avatar_url" :frame="fanInfo[2].avatar_frame" class="podium-avatar"
						:visual-scale="fanInfo[2].avatar_frame ? 1.15 : 1" />
				</view>
				<view class="podium-name">{{ fanInfo[2].user_name }}</view>
				<view class="podium-score">{{ fanInfo[2].fans_value }}<text class="podium-score-unit">贡献值</text></view>
			</div>
		</div>

		<div class="fans-table" v-if="fanInfo.length > 3">
			<div class="fans-table-head">
				<text class="th-rank">排名</text>
				<text class="th-name">用户名</text>
				<text class="th-value">贡献值</text>
			</div>
			<div class="fans-list-item" v-for="(fan, index) in fanInfo.slice(3, 10)" :key="index">
				<div class="fans-rank">{{ String(index + 4).padStart(2, '0') }}</div>
				<log-image :src="fan.avatar_url" alt="" class="fans-avatar" />
				<div class="fans-info">
					<view class="fans-name-row">
						<div class="fans-name">{{ fan.user_name }}</div>
					</view>
					<div class="fans-message" v-if="fan.message">{{ fan.message }}</div>
				</div>
				<div class="fans-value">{{ fan.fans_value }}</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'FansContributionBoard',
	props: {
		fanInfo: { type: Array, default: () => [] }
	}
};
</script>

<style scoped lang="scss">
.fans_rank {
	padding: 30rpx 24rpx 34rpx;
	border-radius: 20rpx;
	margin-top: 32rpx;
	position: relative;
	// overflow: hidden;
	// background: linear-gradient(180deg, rgba(245, 246, 247, 0.6) 0%, rgba(250, 250, 250, 0.3) 100%);
	// box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

	.dark-mode & {
		background-color: var(--card-background);
	}
}

.fans_rank--empty {
	margin-top: 0;
	padding: 32rpx 24rpx;
}

.fans_rank--compact {
	margin-top: 20rpx;
	padding: 0 0 16rpx;
}

.fans-compact-list {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.fans-compact-row {
	position: relative;
	display: flex;
	align-items: center;
	gap: 18rpx;
	min-height: 128rpx;
	padding: 16rpx 18rpx 16rpx 58rpx;
	box-sizing: border-box;
	border-radius: 16rpx;
	background: linear-gradient(100deg, #fff2c1, rgba(255, 255, 255, 0));
}

.compact-rank {
	position: absolute;
	left: 12rpx;
	bottom: 4rpx;
	font-size: 88rpx;
	line-height: 1;
	font-style: italic;
	font-weight: 900;
	color: #e8ad47;
	opacity: .32;
}

.compact-avatar-wrap {
	position: relative;
	flex: none;
	width: 80rpx;
	height: 80rpx;
}

.compact-avatar { width: 100%; height: 100%; }

.compact-medal {
	position: absolute;
	width: 116rpx;
	height: 116rpx;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	pointer-events: none;
}

.compact-info {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.compact-name, .compact-message {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.compact-name { font-size: 28rpx; line-height: 38rpx; color: #aa792f; }
.compact-message { font-size: 22rpx; line-height: 32rpx; color: #a38351; }
.compact-score { flex: none; display: flex; align-items: baseline; gap: 4rpx; white-space: nowrap; }
.compact-value { font-size: 30rpx; line-height: 38rpx; font-weight: 800; font-style: italic; color: #555; }
.compact-unit { font-size: 19rpx; color: #999; }

.compact-medal-1 {
	background: linear-gradient(100deg, #edf2ff, rgba(255, 255, 255, 0));
	.compact-rank { color: #a6bbe6; }
	.compact-name { color: #333; }
	.compact-message { color: #9297a0; }
}

.dark-mode {
	.fans-compact-row { background: linear-gradient(100deg, rgba(143, 108, 39, .26), transparent); }
	.compact-medal-1 { background: linear-gradient(100deg, rgba(86, 113, 158, .26), transparent); }
	.compact-name { color: #efd09d; }
	.compact-medal-1 .compact-name, .compact-value { color: #e0e5ed; }
	.compact-message, .compact-unit { color: #aab0ba; }
}

.fans-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	text-align: center;
	line-height: 1.5;
}

.fans-empty-title {
	font-size: 27rpx;
	color: var(--text-color-secondary, #7e7f94);
}

.fans-empty-hint {
	font-size: 23rpx;
	color: var(--text-color-secondary, #7e7f94);
	opacity: 0.8;
}

/* TOP3 渐变卡片：TOP2 青绿 / TOP1 橙金（居中抬升）/ TOP3 青蓝 */
.fans-podium {
	display: flex;
	justify-content: center;
	align-items: flex-end;
	gap: 14rpx;
}

.podium-card {
	position: relative;
	flex: 1 1 0;
	min-width: 0;
	padding: 46rpx 18rpx 26rpx;
	border-radius: 24rpx;
	text-align: center;
	overflow: visible;
}

.podium-2 {
	background: linear-gradient(180deg, #d9f3e6 0%, #c2e8d6 58%, #cdeee0 100%);
	box-shadow: 0 10rpx 26rpx rgba(96, 190, 148, 0.18);
}

.podium-1 {
	transform: translateY(-24rpx);
	padding-top: 60rpx;
	z-index: 2;
	background: linear-gradient(180deg, #ffe3c2 0%, #fdd2a4 58%, #ffdfc0 100%);
	box-shadow: 0 12rpx 30rpx rgba(244, 166, 94, 0.24);
}

.podium-3 {
	background: linear-gradient(180deg, #d6ecf8 0%, #c2e2f4 58%, #cfe9f6 100%);
	box-shadow: 0 10rpx 26rpx rgba(96, 158, 214, 0.18);
}

.podium-badge {
	position: absolute;
	top: -16rpx;
	left: 18rpx;
	z-index: 3;
	display: inline-flex;
	align-items: center;
	gap: 6rpx;
	padding: 8rpx 18rpx 8rpx 14rpx;
	border-radius: 999rpx;
	background: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.podium-badge-top {
	font-size: 17rpx;
	font-weight: 700;
	letter-spacing: 1rpx;
	color: #8a8f98;
}

.podium-badge-no {
	font-size: 24rpx;
	font-weight: 800;
	color: #2c3038;
}

.podium-1 .podium-badge-no {
	color: #e07a2f;
}

.podium-2 .podium-badge-no {
	color: #3fa876;
}

.podium-3 .podium-badge-no {
	color: #4a90c9;
}

.podium-avatar-wrap {
	position: relative;
	display: flex;
	justify-content: center;
}

.podium-avatar {
	height: 120rpx;
	width: 120rpx;
	position: relative;
	z-index: 2;
	border-radius: 50%;
	border: 5rpx solid #ffffff;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.14);
	object-fit: cover;
	overflow: visible;
}

.podium-1 .podium-avatar {
	height: 132rpx;
	width: 132rpx;
}

.podium-name {
	margin-top: 16rpx;
	font-size: 26rpx;
	font-weight: 700;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	.dark-mode & {
		color: var(--text-color-primary);
	}
}

.podium-score {
	margin-top: 14rpx;
	font-size: 34rpx;
	font-weight: 800;
	line-height: 1;
	color: #4a5160;
	font-family: 'Avenir Next', 'DIN Alternate', sans-serif;
}

.podium-score-unit {
	margin-left: 8rpx;
	font-size: 20rpx;
	font-weight: 500;
	color: #9aa1ad;
}

/* 4 名以后：表头 + 编号行 */
.fans-table {
	margin-top: 30rpx;
}

.fans-table-head {
	display: flex;
	align-items: center;
	padding: 0 6rpx 14rpx;
	font-size: 24rpx;
	color: #9aa1ad;

	.th-rank {
		width: 96rpx;
	}

	.th-name {
		flex: 1;
	}

	.th-value {
		width: 110rpx;
		text-align: right;
	}
}

.fans-list-item {
	display: flex;
	align-items: center;
	padding: 18rpx 6rpx;
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
	position: relative;
	transition: all 0.2s ease;

	&:last-child {
		border-bottom: none;
	}

	&:active {
		background-color: rgba(0, 0, 0, 0.02);
	}

	.fans-rank {
		width: 96rpx;
		flex-shrink: 0;
		font-size: 34rpx;
		font-weight: 700;
		color: #4a5160;
		font-family: 'Avenir Next', 'DIN Alternate', sans-serif;
	}

	.fans-avatar {
		height: 72rpx;
		width: 72rpx;
		border-radius: 50%;
		border: 2rpx solid #ffffff;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.fans-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex-grow: 1;
		overflow: hidden;

		.fans-name-row {
			display: flex;
			align-items: center;
			gap: 12rpx;
			min-width: 0;
		}

		.fans-name {
			font-size: 27rpx;
			font-weight: 600;
			color: #333;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: 280rpx;

			.dark-mode & {
				color: var(--text-color-primary);
			}
		}

		.fans-message {
			font-size: 21rpx;
			color: #795548;
			max-width: 300rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin-top: 4rpx;

			.dark-mode & {
				color: var(--text-color-secondary);
			}
		}
	}

	.fans-value {
		width: 110rpx;
		flex-shrink: 0;
		text-align: right;
		font-size: 26rpx;
		color: #4a5160;
		font-weight: 600;
	}
}

/* 暗色模式：卡片与行底色 */
.dark-mode {
	.podium-2 {
		background: linear-gradient(180deg, rgba(46, 74, 62, 0.98), rgba(34, 56, 47, 0.96));
	}

	.podium-1 {
		background: linear-gradient(180deg, rgba(84, 58, 34, 0.98), rgba(66, 45, 27, 0.96));
	}

	.podium-3 {
		background: linear-gradient(180deg, rgba(38, 58, 76, 0.98), rgba(28, 44, 58, 0.96));
	}

	.podium-badge {
		background: rgba(255, 255, 255, 0.1);
	}

	.podium-name {
		color: var(--text-color-primary);
	}

	.podium-score {
		color: #c3cad6;
	}

	.fans-table-head {
		color: #7d8794;
	}

	.fans-list-item {
		border-color: rgba(255, 255, 255, 0.06);

		.fans-rank {
			color: #c3cad6;
		}

		.fans-value {
			color: #c3cad6;
		}
	}
}

</style>
