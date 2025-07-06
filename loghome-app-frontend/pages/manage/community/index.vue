<template>
	<view class="container">
		<zetank-backBar title="社区管理"></zetank-backBar>
		
		<view class="list-content">
			<view class="list">
				<navigator url="./circles">
					<view class="li">
						<view class="icon">
							<!-- <img src="../../../static/icons/icon_circle.png"/> -->
						</view>
						<view class="text">圈子管理</view>
						<img class="to" src="../../../static/user/to.png"/>
					</view>
				</navigator>
				
				<navigator url="./posts">
					<view class="li">
						<view class="icon">
							<!-- <img src="../../../static/icons/icon_posts.png"/> -->
						</view>
						<view class="text">帖子管理</view>
						<img class="to" src="../../../static/user/to.png"/>
					</view>
				</navigator>
				
				<navigator url="./reports">
					<view class="li noborder">
						<view class="icon">
							<!-- <img src="../../../static/icons/icon_report.png"/> -->
						</view>
						<view class="text">举报处理</view>
						<img class="to" src="../../../static/user/to.png"/>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
		}
	},
	onShow() {
		// 检查管理员权限
		let tk = JSON.parse(window.localStorage.getItem('token'));
		if (tk) tk = tk.tk;
		if (!tk) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateTo({
					url: '../../users/login'
				});
			}, 1500);
			return;
		}
		
		// 检查是否是管理员
		let userInfo = JSON.parse(window.localStorage.getItem('LogHomeUserInfo'));
		if (!userInfo || userInfo.is_admin != 1) {
			uni.showToast({
				title: '无权限访问',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #f2f2f2;
}

.list-content {
	margin-top: 20rpx;
}

.list {
	background: #fff;
	
	.li {
		width: 92%;
		height: 100upx;
		padding: 0 4%;
		border-bottom: 1px solid #eee;
		display: flex;
		align-items: center;
		
		&.noborder {
			border-bottom: 0;
		}
		
		.icon {
			flex-shrink: 0;
			width: 50upx;
			height: 50upx;
			
			img {
				width: 50upx;
				height: 50upx;
			}
		}
		
		.text {
			padding-left: 20upx;
			width: 100%;
			color: #666;
			font-size: 30rpx;
		}
		
		.to {
			flex-shrink: 0;
			width: 40upx;
			height: 40upx;
		}
	}
}
</style> 