<template>
	<view :style="{
		'--statusBarHeight': 0 + 'px',
	}" v-dark>
		<view class="theme-switch-wrapper">
			<theme-switch></theme-switch>
			<view class="theme-switch-label">{{ themeModeLabel }}</view>
		</view>
		<view class="header">
			<view class="bg">
				<log-image class="info-cover" :src="user.top_pic_url"
					onerror="onerror=null;src='https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg'"></log-image>
				<div class="box-shadow" @click="change_top_pic"></div>
				<view class="box">
					<view class="box-hd">
						<navigator url="./users/change_user_info">
							<view class="avator">
								<log-image :src="user.avatar_url"
									onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
							</view>
						</navigator>
						<view class="user-name">
							<view class="user-name-row">
								<span>{{user.name}}</span>
								<span class="user_id">ID:{{user.user_id}}</span>
								<view
									v-if="user.selected_badge"
									class="name-badge-tap"
									@tap="goToBadgeDetail(user.selected_badge)"
									@click="goToBadgeDetail(user.selected_badge)"
								>
									<honor-badge class="name-badge" :badge="user.selected_badge" size="name" scale="1.5"/>
								</view>
								<view v-if="user.display_title" class="user-title-chip">
									{{user.display_title}}
								</view>
							</view>
						</view>
						<view class="motto">{{user.motto}}</view>
					</view>
					<view class="box-bd">
						<view class="item" @tap="gotoActivate"
							v-show="user.email == 'unbind'">
							<view class="icon activate"><log-image src="../static/icons/icon_activate.png"/></view>
							<view class="text" style="color:rgb(255, 141, 47);font-weight: bold;">绑定邮箱</view>
						</view>
						<view class="item" @tap="user_profile">
							<view class="icon"><img src="../static/icons/icon_my_name_tag.png"/></view>
							<view class="text">名片</view>
						</view>
						<view class="item" @tap="gotoMessages">
							<view class="icon" :class="{'newMessage': hasNewMessage || hasNewPrivateMessage}">
								<img src="../static/icons/icon_info.png"/>
							</view>
							<view class="text">消息</view>
						</view>
						<view class="item" @tap="gotoFriends">
							<view class="icon"><img src="../static/icons/icon_friends.png"/></view>
							<view class="text">好友</view>
						</view>
						<view class="item" @tap="gotoSettings">
							<view class="icon" style="transform: scale(0.9);"><img
									src="../static/icons/icon_setting.png"/></view>
							<view class="text">设置</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="list-content">
			<view class="list">
				<navigator url="./treePlant/treeplant">
					<view class="li noborder">
						<el-badge is-dot :hidden="!((treeState == '未种植' || treeState == '结果') || !isSignedToday)">
							<view class="icon">
								<img src="../static/icons/icon_treecut1.png"/></img>
							</view>
						</el-badge>
						<view class="text tree-growth-text">
							<view class="title-row">
								<text>原木树场</text>
								<text v-if="!isSignedToday" style="font-size: 24rpx; color: #ff6a5f; margin-left: 10rpx; font-weight: normal;">可签到</text>
							</view>
							<view
								class="growth-bar-wrapper"
								v-if="treeState && treeState !== '未种植' && treeMaxGrowth > 0"
							>
								<view class="growth-bar-track">
									<view
										class="growth-bar-inner"
										:style="{ width: treeGrowthPercent + '%' }"
									></view>
								</view>
								<text class="growth-val">
									{{ Math.floor(treeGrowthVal) }}/{{ treeMaxGrowth }}
								</text>
							</view>
						</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
				<navigator url="./users/achievements">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/cridit_sys_icon.png"></img>
						</view>
						<view class="text">原木勋章墙</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
				<navigator url="./apps/inviteCard">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_share.png"></img>
						</view>
						<view class="text">邀请好友</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
				<navigator url="./payments/recharge">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/cridit_icon.png"></img>
						</view>
						<view class="text">原木充值</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
				<navigator url="./payments/earnings">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_sponsored.png"></img>
						</view>
						<view class="text">余额提现</view>
						<text style="width: 150rpx; color: #ff6a5f">{{earningsMoney}} 元</text>
					</view>
				</navigator>
				<navigator url="./store/index">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/store.png"></img>
						</view>
						<view class="text">原木商城</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
			</view>
			<view class="list">
				<!-- <navigator url="./users/user_credit">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_sponsored.png"></img>
						</view>
						<view class="text">我的信誉</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator> -->
				<navigator url="./apps/about">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_about_us.png"></img>
						</view>
						<view class="text">关于社区</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
				<!-- <navigator url="./apps/faqs/faq">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_report.png"></img>
						</view>
						<view class="text">意见反馈</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator> -->
				<navigator url="./manage/index" v-if="user.is_admin == 1">
					<view class="li noborder">
						<view class="icon">
							<img src="../static/icons/icon_treecut3.png"></img>
						</view>
						<view class="text">平台管理</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
				<navigator url="./users/clientSet">
					<view class="li noborder">
						<view class="icon">
							<img src="../static/icons/icon_setting.png"></img>
						</view>
						<view class="text">设置</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
			</view>
			<view class="blank_box"></view>
		</view>
	</view>
</template>
<script>
	// VUE2
	import axios from 'axios'
	import HonorBadge from '../components/honor-badge.vue';
	import darkModeMixin from '@/mixins/dark-mode.js'
	export default {
		data() {
			return {
				user: {},
				hasNewMessage: false,
				hasNewPrivateMessage: false,
				treeState: "None",
				treeGrowthVal: 0,
				treeMaxGrowth: 0,
				earningsMoney: 0.00,
				isSignedToday: true
			}
		},
		computed: {
			treeGrowthPercent() {
				if (!this.treeMaxGrowth || this.treeMaxGrowth <= 0) return 0;
				const val = this.treeGrowthVal || 0;
				const percent = val / this.treeMaxGrowth * 100;
				return Math.max(0, Math.min(100, percent));
			},
			themeModeLabel() {
				const mode = this.$store.state.themeMode || 'system';
				if (mode === 'dark') return '深色';
				if (mode === 'light') return '浅色';
				return '跟随系统';
			}
		},
		components: {HonorBadge},
		mixins: [darkModeMixin],
		onShow() {
			uni.showLoading({
				title: '努力加载中'
			});
			// 用于判断是否从登录页返回，是的话则直接退回首页。
			if (this.$isFromLogin) {
				this.$isFromLogin = false;
				uni.switchTab({
					url: './library'
				})
				return;
			}

			// 检查token，没有token就需要登录
			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;
			let _this = this;
			if (tk == null) {
				this.$isFromLogin = true;
				uni.navigateTo({
					url: './users/login?msg=' + 'unAuthorized'
				});
				uni.hideLoading();
				return;
			}
			//获取用户资料
			axios.get(this.$baseUrl + '/users/userprofile', {
				headers: {
					'Content-Type': 'application/json', //设置请求头请求格式为JSON
					'Authorization': tk //设置token 其中K名要和后端协调好
				}
			}).then((res) => {
				console.log('userprofile', res.data);
				_this.user = JSON.parse(JSON.stringify(res.data));
				if (window.localStorage.getItem('messages') == "") {
					window.localStorage.setItem('messages', "[]");
				}
				//检查是否有新消息
				let curMessage = JSON.parse(window.localStorage.getItem('messages'));
				for (let item of curMessage) {
					if (item.is_read == 0 && item.to_id == _this.user.user_id) {
						this.hasNewMessage = true;
						break;
					}
				}
				
				// 检查是否有未读私信
				let unreadPrivateMessages = window.localStorage.getItem('unreadPrivateMessages');
				this.hasNewPrivateMessage = unreadPrivateMessages && parseInt(unreadPrivateMessages) > 0;
				
				// 如果没有未读系统消息和私信，隐藏小红点
				if (!this.hasNewMessage && !this.hasNewPrivateMessage) {
					uni.hideTabBarRedDot({
						index: 3
					});
				}

				//检查账号邮箱绑定状态
				if (_this.user.email == 'unbind') {
					uni.showModal({
						title: '提示',
						content: '你的账号尚未绑定邮箱，为了保护你的账号安全和确保不间断使用，请尽快绑定电子邮箱账号。',
						cancelText: "下次再说",
						confirmText: "前往",
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: './users/activateAccount'
								})
							} else if (res.cancel) {

							}
						}
					});
				}
				// 做下本地缓存，在网络不佳的情况下先获取本地数据
				window.localStorage.setItem("LogHomeUserInfo", JSON.stringify(res.data));
			}).catch(function(error) {
				uni.hideLoading();
				// 如果鉴权失败说明token失效，则重新登录
				if (error.message == "Request failed with status code 401") {
					window.localStorage.removeItem('token');
					this.$isFromLogin = true;
					uni.navigateTo({
						url: './users/login?msg=' + 'unAuthorized'
					});
				} else {
					//在网络不佳的情况下先获取本地数据
					let localData = window.localStorage.getItem("LogHomeUserInfo");
					if (localData) {
						localData = JSON.parse(localData);
						_this.user = localData;
					}
				}
			})

			this.checkTreePlant();
			this.refreshResources();
		},
		methods: {
			user_profile() {
				uni.navigateTo({
					url: "./users/personalPage?id=" + this.user.user_id
				})
			},
			gotoFriends() {
				uni.navigateTo({
					url: "./community/friends"
				})
			},
			gotoSettings() {
				uni.navigateTo({
					url: "./users/clientSet"
				})
			},
			gotoMessages() {
				uni.navigateTo({
					url: "./community/message"
				})
				this.hasNewMessage = false;
				this.hasNewPrivateMessage = false;
			},
			gotoActivate() {
				uni.navigateTo({
					url: "./users/activateAccount"
				})
			},
			gotoDonate() {
				uni.navigateTo({
					url: "./users/donate"
				})
			},
			gotoStore() {
				const storeUrl = this.$storeBaseUrl + '/cross_site_login?redirect=/products';
				uni.navigateTo({
					url: './apps/h5webview?url=' + encodeURIComponent(storeUrl) + '&title=原木购'
				})
			},
			goToBadgeDetail(badge) {
				if (!badge) return
				uni.setStorageSync('badgeDetailPayload', badge)
				const ownerId = Number(this.user && this.user.user_id)
				if (Number.isFinite(ownerId) && ownerId > 0) {
					uni.setStorageSync('badgeDetailOwnerId', ownerId)
				}
				let encodedBadge = ''
				try {
					encodedBadge = encodeURIComponent(JSON.stringify(badge))
				} catch (e) {
					encodedBadge = ''
				}
				const query = []
				if (encodedBadge) query.push('badge=' + encodedBadge)
				if (Number.isFinite(ownerId) && ownerId > 0) query.push('owner_id=' + ownerId)
				query.push('is_selected=1')
				uni.navigateTo({
					url: '/pages/users/badgeDetail' + (query.length ? ('?' + query.join('&')) : ''),
					fail() {
						uni.navigateTo({
							url: Number.isFinite(ownerId) && ownerId > 0
								? '/pages/users/badgeDetail?owner_id=' + ownerId
								: '/pages/users/badgeDetail'
						})
					}
				})
			},
			checkTreePlant() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/treePlant/get_treePlant_of', {
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					if (res.data.length > 0) {
						const data = res.data[0];
						this.treeState = data.tree_status;
						this.treeGrowthVal = data.growth_val || 0;
						this.treeMaxGrowth = data.max_growth || 0;
						
						// Check sign-in status
						const tasks = data.tasks || [];
						const signInTask = tasks.find(t => t.task_name && t.task_name.includes('签到'));
						if (signInTask && signInTask.status !== 'completed') {
							this.isSignedToday = false;
						} else {
							this.isSignedToday = true;
						}
					} else {
						this.treeState = "未种植";
						this.treeGrowthVal = 0;
						this.treeMaxGrowth = 0;
						this.isSignedToday = true;
					}
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(function() {
					uni.hideLoading();
				})
			},
			change_top_pic() {
				uni.navigateTo({
					url: "./users/top_pic_upload?noneAnimation=1"
				})
			},
			bankNum(num) {
				if (isNaN(num)) {
					return num
				} else {
					var s = num.toFixed(2).toString();
					var result = s.substring(0, s.indexOf(".") + 3);
					return result
				}
			},
			refreshResources() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				axios.get(this.$baseUrl + '/resource/get_resources', {
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					this.resources = res.data[0];
					console.log(this.resources)
					this.earningsMoney = this.bankNum(this.resources.cropped_log / 100);
					this.$forceUpdate();
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(function() {
					uni.hideLoading();
				})
			}
		}
	}
</script>


<style scoped lang="scss">
	.text {
		font-size: 30rpx;
		width: 100%;
		
		.dark-mode & {
			color: var(--text-color-regular);
		}
	}
	
	.theme-switch-wrapper {
		position: fixed;
		z-index: 100;
		right: 30rpx;
		top: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
	}
	
	.theme-switch-label {
		font-size: 22rpx;
		padding: 6rpx 14rpx;
		border-radius: 999rpx;
		background-color: var(--card-background);
		color: var(--text-color-regular);
		box-shadow: 0 6rpx 16rpx var(--shadow-color);
	}

	page {
		background-color: #f2f2f2;
		font-size: 30upx;
		color: rgb(25, 25, 25);
		
		.dark-mode & {
			background-color: var(--background-color);
			color: var(--text-color-primary);
		}
	}

	.header {
		background: #fff;
		height: 290upx;
		width: 100vw;
		padding-bottom: 110upx;
		padding-top: var(--statusBarHeight);
		
		.dark-mode & {
			background: var(--background-color-secondary);
		}

		.bg {
			width: 100%;
			height: 200upx;
			padding-top: 200upx;
			// background-color:rgb(180, 111, 88);

			.info-cover {
				position: absolute;
				left: 0;
				top: 0;
				width: 100vw;
				height: calc(575rpx + var(--statusBarHeight));
				z-index: 0;
			}

			.box-shadow {
				position: absolute;
				left: 0;
				top: 0;
				width: calc(100vw);
				height: calc(575rpx + var(--statusBarHeight));
				z-index: 1;
				background: linear-gradient(to bottom, #f2f2f233, #f2f2f255, #f2f2f277, #f2f2f2bb, #f2f2f2dd, #ffffffee, #ffffffff);
				
				.dark-mode & {
					background: linear-gradient(to bottom, #00000033, #00000055, #00000077, #000000bb, #000000dd, #1c1c1cee, #1c1c1cff);
				}
			}
		}
	}

	.box {
		width: 100vw;
		height: 360rpx;
		margin: 0 auto;
		position: relative;
		z-index: 2;

		.box-hd {
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			margin-left: 40rpx;

			.avator {
				width: 160upx;
				height: 160upx;
				background: #fff;
				border: 5upx solid #fff;
				border-radius: 10rpx;
				margin-top: -80upx;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.user-name {
				width: 100%;
				margin-top: 15rpx;
				font-size: 40rpx;
				font-weight: bold;
				// display: flex;
				// flex-direction: column;
				
				.dark-mode & {
					color: var(--text-color-primary);
				}

				.user-name-row {
					display: inline-flex;
					align-items: center;
				}

				.name-badge {
					margin-left: 20rpx;
					transform: translateY(0);
				}

				.name-badge-tap {
					display: inline-flex;
					align-items: center;
				}

				.user-title-chip {
					margin-left: 16rpx;
					padding: 8rpx 18rpx;
					border-radius: 999rpx;
					font-size: 24rpx;
					line-height: 1.2;
					max-width: 320rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: #fff4df;
					background: linear-gradient(120deg, rgba(160, 104, 54, 0.92) 0%, rgba(117, 69, 33, 0.92) 100%);
					box-shadow: 0 8rpx 18rpx rgba(117, 69, 33, 0.18);
				}
			}

			.user_id {
				color: #000000;
				font-size: 25rpx;
				background-color: #00000066;
				padding: 10rpx;
				line-height: 40rpx;
				border-radius: 10rpx;
				margin-left: 15rpx;
				
				.dark-mode & {
					color: #ffffff;
					background-color: #ffffff33;
				}
			}

			.motto {
				margin: 15rpx 0 15rpx 0;
				font-size: 28rpx;
				color: #444444;
				
				.dark-mode & {
					color: var(--text-color-regular);
				}
			}
		}

		.box-bd {
			display: flex;
			flex-wrap: nowrap;
			flex-direction: row;
			justify-content: center;

			.item {
				flex: 1 1 auto;
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				justify-content: center;
				border-right: 1px solid #cccccc;
				margin: 15upx 0;
				
				.dark-mode & {
					border-right: 1px solid #444444;
				}

				&:last-child {
					border: none;
				}

				.icon {
					width: 60upx;
					height: 60upx;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.icon.newMessage {
					animation: new-message 1.8s infinite;
				}

				.icon.activate {
					animation: activate 1.8s infinite;
				}

				.text {
					font-size: 25rpx;
					width: 100%;
					text-align: center;
					margin-top: 10upx;
					
					.dark-mode & {
						color: var(--text-color-regular);
					}
				}
			}
		}
	}

	.list-content {
		background: #fff;
		margin-top: 192rpx;

		.blank_box {
			height: calc(125rpx + 100rpx);
		}

		background-color: #f2f2f2;
		position: relative;
		z-index: 2;
		
		.dark-mode & {
			background: var(--background-color-secondary);
			background-color: var(--background-color);
		}
	}

	.list {
		width: 100%;
		margin-bottom: 8px;
		background: #fff;
		
		.dark-mode & {
			background: var(--background-color-secondary);
		}

		&:last-child {
			border: none;
		}

		.li {
				width: 92%;
				height: 100upx;
				padding: 0 4%;
				border-bottom: 1px solid rgb(255, 248, 234);
				display: flex;
				align-items: center;
				
				.dark-mode & {
					border-bottom: 1px solid #333333;
				}

			&.noborder {
				border-bottom: 0
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
				
				.dark-mode & {
					color: var(--text-color-regular);
				}
			}

			.tree-growth-text {
				display: flex;
				flex-direction: column;

				.title-row {
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.status-tag {
					flex-shrink: 0;
					font-size: 22rpx;
					padding: 4rpx 12rpx;
					border-radius: 20rpx;
					background-color: #e8f5e9;
					color: #2e7d32;
				}

				.growth-bar-wrapper {
					margin-top: 10rpx;
					display: flex;
					align-items: center;
				}

				.growth-bar-track {
					flex: 1;
					height: 10rpx;
					background-color: #eeeeee;
					border-radius: 999rpx;
					overflow: hidden;
					margin-right: 12rpx;
				}

				.growth-bar-inner {
					height: 100%;
					background-color: #81c784;
					transition: width 0.4s ease-out;
				}

				.growth-val {
					font-size: 22rpx;
					color: #999999;
				}
			}

			.to {
				flex-shrink: 0;
				width: 40upx;
				height: 40upx;
			}
		}
	}


	@keyframes activate {
		0% {
			filter: brightness(120%);
			transform: translateY(0%);
		}

		10% {
			filter: brightness(120%);
			transform: translateY(-30%);
		}

		20% {
			filter: brightness(100%);
			transform: translateY(-0%);
		}

		30% {
			filter: brightness(120%);
			transform: translateY(-10%);
		}

		40% {
			filter: brightness(100%);
			transform: translateY(-0%);
		}
	}

	@keyframes new-message {
		0% {
			transform: translateY(0%);
		}

		10% {
			transform: translateY(-30%);
		}

		20% {
			transform: translateY(-0%);
		}

		30% {
			transform: translateY(-10%);
		}

		40% {
			transform: translateY(-0%);
		}
	}
</style>
