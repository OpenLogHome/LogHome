<template>
	<view class="rank-container" v-dark>
		<view class="rank-header">
			<image class="header-bg" src="../../static/bg.png" mode="aspectFill"></image>
			<view class="header-content">
				<view class="title">🌲 原木力爆棚榜 🌲</view>
				<view class="subtitle">看看谁是原木社区最具能量的作品！</view>
				<view class="update-time">更新时间：{{currentTime}}</view>
			</view>
		</view>

		<view class="rank-list" v-if="showList">
			<view class="rank-item" v-for="(item, index) in books" :key="item.novel_id" 
				:class="['rank-' + (index + 1), {'top-three': index < 3}]"
				@click="goBook(item.novel_id)">
				
				<view class="rank-badge" v-if="index < 3">
					<image v-if="index === 0" src="../../static/rank/NO1.png" mode="widthFix" class="badge-img"></image>
					<image v-else-if="index === 1" src="../../static/rank/NO2.png" mode="widthFix" class="badge-img"></image>
					<image v-else-if="index === 2" src="../../static/rank/NO3.png" mode="widthFix" class="badge-img"></image>
				</view>
				<view class="rank-num" v-else>{{index + 1}}</view>

				<view class="book-cover-box">
					<log-image :src="item.picUrl" class="book-cover"
						:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`"/>
				</view>

				<view class="book-info">
					<view class="book-name">{{item.name}}</view>
					<view class="book-author">
						<log-image :src="item.avatar_url" class="author-avatar"
							onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
						<text>{{item.user_name}}</text>
					</view>
					<view class="book-desc">{{item.content}}</view>
				</view>

				<view class="power-score">
					<view class="score-label">原木力</view>
					<view class="score-val">
						<text class="fire">🔥</text>
						{{Math.floor(item.ranking || 0)}}
					</view>
				</view>
			</view>
		</view>
        
        <view class="loading-state" v-else>
            <text>正在通过原木力探测器搜索...</text>
        </view>
	</view>
</template>

<script>
	import axios from 'axios'
    import darkModeMixin from '@/mixins/dark-mode.js'

	export default {
        mixins: [darkModeMixin],
		data() {
			return {
				books: [],
				showList: false,
				currentTime: ''
			}
		},
		onLoad() {
			this.updateTime();
			this.refreshCollections();
		},
        onPullDownRefresh() {
			this.updateTime();
            this.refreshCollections();
        },
		methods: {
			updateTime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const hour = String(now.getHours()).padStart(2, '0');
				const minute = String(now.getMinutes()).padStart(2, '0');
				this.currentTime = `${year}-${month}-${day} ${hour}:${minute}`;
			},
			refreshCollections() {
				let _this = this;
                // 原木力爆棚对应的 title 是 "原木力爆棚"
				axios.get(_this.$baseUrl + '/library/recommand/get_library_recommend_titles?title=原木力爆棚&page=1&amount=50', {})
                .then((res) => {
					_this.books = res.data;
                    // 确保按 ranking 排序（虽然后端应该排好了，但前端保险起见）
                    _this.books.sort((a, b) => (b.ranking || 0) - (a.ranking || 0));
					_this.showList = true;
                    uni.stopPullDownRefresh();
				}).catch(function(error) {
					uni.showToast({
						title: '获取榜单失败',
						icon: 'none',
						duration: 2000
					});
                    uni.stopPullDownRefresh();
				})
			},
			goBook(id) {
				uni.navigateTo({
					url: './bookInfo?id=' + id
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.rank-container {
		min-height: 100vh;
		background-color: #f5f7fa;
        padding-bottom: 40rpx;
        
        &.dark-mode {
            background-color: #121212;
            .rank-header .title { color: #fff; }
            .rank-header .subtitle { color: #ccc; }
            .rank-item { background-color: #1e1e1e; }
            .book-name { color: #eee; }
            .book-author { color: #aaa; }
            .book-desc { color: #888; }
            .rank-num { color: #666; }
        }
	}

	.rank-header {
		position: relative;
		height: 300rpx;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
        background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%);

		.header-bg {
			position: absolute;
			width: 100%;
			height: 100%;
			opacity: 0.3;
            z-index: 0;
		}

		.header-content {
			position: relative;
			z-index: 1;
			text-align: center;
			
			.title {
				font-size: 50rpx;
				font-weight: 900;
				color: #EA7034;
				text-shadow: 2rpx 2rpx 4rpx rgba(255, 255, 255, 0.8);
                margin-bottom: 10rpx;
                letter-spacing: 2rpx;
			}
			
			.update-time {
				font-size: 24rpx;
				color: #fff;
				margin-top: 10rpx;
				opacity: 0.9;
				text-shadow: 1rpx 1rpx 2rpx rgba(0,0,0,0.2);
			}
			
			.subtitle {
				font-size: 28rpx;
				color: #885544;
                background-color: rgba(255,255,255,0.6);
                padding: 5rpx 20rpx;
                border-radius: 30rpx;
			}
		}
	}

	.rank-list {
		padding: 20rpx;
		position: relative;
		z-index: 2;
	}

	.rank-item {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
		display: flex;
		align-items: center;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
		position: relative;
        transition: transform 0.1s;
        
        &:active {
            transform: scale(0.98);
        }

		&.top-three {
            border: 2rpx solid transparent;
            background-image: linear-gradient(#fff, #fff), linear-gradient(to right, #ffd700, #ff8c00);
            background-origin: border-box;
            background-clip: content-box, border-box;
            
            &.dark-mode {
                background-image: linear-gradient(#1e1e1e, #1e1e1e), linear-gradient(to right, #ffd700, #ff8c00);
            }
		}
        
        &.rank-1 {
             transform: scale(1.02);
             box-shadow: 0 8rpx 24rpx rgba(255, 215, 0, 0.2);
        }
	}

	.rank-badge {
		position: absolute;
		top: -10rpx;
		left: -10rpx;
		width: 60rpx;
        z-index: 10;
		
		.badge-img {
			width: 100%;
		}
	}

    .rank-num {
        font-size: 36rpx;
        font-weight: bold;
        color: #999;
        width: 50rpx;
        text-align: center;
        margin-right: 10rpx;
        font-style: italic;
    }

	.book-cover-box {
		width: 140rpx;
		height: 186rpx;
		flex-shrink: 0;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.1);
        margin-right: 24rpx;
        
        .book-cover {
            width: 100%;
            height: 100%;
        }
	}

	.book-info {
		flex: 1;
		overflow: hidden;
        margin-right: 20rpx;
		
		.book-name {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 12rpx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
		}
		
		.book-author {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #666;
			margin-bottom: 12rpx;
			
			.author-avatar {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				margin-right: 8rpx;
			}
		}
		
		.book-desc {
			font-size: 24rpx;
			color: #999;
			line-height: 1.4;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}

	.power-score {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
        min-width: 120rpx;
		
		.score-label {
			font-size: 20rpx;
			color: #EA7034;
            margin-bottom: 4rpx;
            background: rgba(234, 112, 52, 0.1);
            padding: 2rpx 8rpx;
            border-radius: 8rpx;
		}
		
		.score-val {
			font-size: 36rpx;
			font-weight: bold;
			color: #EA7034;
            display: flex;
            align-items: center;
            
            .fire {
                font-size: 28rpx;
                margin-right: 4rpx;
            }
		}
	}
    
    .loading-state {
        padding: 100rpx;
        text-align: center;
        color: #999;
        font-size: 28rpx;
    }
</style>
