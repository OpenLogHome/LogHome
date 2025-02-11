<template>
	<view :style="{'--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
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
							<span>{{user.name}}</span>
							<span class="user_id">ID:{{user.user_id}}</span>
							<groupLabel v-for="user_group in user.user_group" :userGroup="user_group"></groupLabel>
						</view>
						<view class="motto">{{user.motto}}</view>
					</view>
					<view class="box-bd">
						<view class="item" @tap="gotoActivate"
							v-show="user.oicq_account == 'unbind' && user.mobile == 'unbind'">
							<view class="icon activate"><log-image src="../static/icons/icon_activate.png"/></view>
							<view class="text" style="color:rgb(255, 141, 47);font-weight: bold;">激活账号</view>
						</view>
						<view class="item" @tap="user_profile">
							<view class="icon"><img src="../static/icons/icon_my_name_tag.png"/></view>
							<view class="text">名片</view>
						</view>
						<view class="item" @tap="gotoMessages">
							<view class="icon" :class="{'newMessage':hasNewMessage}">
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
						<el-badge is-dot :hidden="!(treeState == '未种植' || treeState == '结果')">
							<view class="icon">
								<img src="../static/icons/icon_treecut1.png"/></img>
							</view>
						</el-badge>
						<view class="text">原木树场</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
				<navigator url="./payments/recharge">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/cridit_icon.png"></img>
						</view>
						<view class="text">支持社区</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
				<navigator url="./payments/earnings">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/cridit_sys_icon.png"></img>
						</view>
						<view class="text">余额提现</view>
						<text style="width: 150rpx; color: #ff6a5f">{{earningsMoney}} 元</text>
					</view>
				</navigator>
				</navigator>
			</view>
			<view class="list">
				<navigator url="./users/user_credit">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_sponsored.png"></img>
						</view>
						<view class="text">我的信誉</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
				<navigator url="./apps/about">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_about_us.png"></img>
						</view>
						<view class="text">关于社区</view>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
				<navigator url="./apps/faqs/faq">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_report.png"></img>
						</view>
						<view class="text">意见反馈</view>
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
	import axios from 'axios'
	import groupLabel from './usergroup/groupLabel.vue';
	export default {
		data() {
			return {
				user: {},
				hasNewMessage: false,
				treeState: "None",
				earningsMoney: 0.00
			}
		},
		components: {groupLabel},
		onShow() {
			uni.showLoading({
				title: '加载中'
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
				return;
			}
			//获取用户资料
			axios.get(this.$baseUrl + '/users/userprofile', {
				headers: {
					'Content-Type': 'application/json', //设置请求头请求格式为JSON
					'Authorization': tk //设置token 其中K名要和后端协调好
				}
			}).then((res) => {
				_this.user = JSON.parse(JSON.stringify(res.data));
				_this.user.user_group = _this.user.user_group.split(",");
				if (window.localStorage.getItem('messages') == "") {
					window.localStorage.setItem('messages', "[]");
				}
				//检查是否有新消息
				let curMessage = JSON.parse(window.localStorage.getItem('messages'));
				for (let item of curMessage) {
					if (item.is_read == 0 && item.to_id == _this.user.user_id) {
						this.hasNewMessage = true;
						return;
					}
				}
				this.hasNewMessage = false;
				uni.hideTabBarRedDot({
					index: 3
				})

				//检查账号激活状态
				if (_this.user.oicq_account == 'unbind' && _this.user.mobile == 'unbind') {
					uni.showModal({
						title: '提示',
						content: '你的账号尚未激活，为了保护你的账号安全和确保不间断使用，请尽快激活账号。',
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
						this.treeState = res.data[0].tree_status;
					} else {
						this.treeState = "未种植";
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
	}

	page {
		background-color: #f2f2f2;
		font-size: 30upx;
		color: rgb(25, 25, 25);
	}

	.header {
		background: #fff;
		height: 290upx;
		width: 100vw;
		padding-bottom: 110upx;
		padding-top: var(--statusBarHeight);

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
			}

			.user_id {
				color: #000000;
				font-size: 25rpx;
				background-color: #00000066;
				padding: 10rpx;
				line-height: 40rpx;
				border-radius: 10rpx;
				margin-left: 15rpx;
			}

			.motto {
				margin: 15rpx 0 15rpx 0;
				font-size: 28rpx;
				color: #444444;
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
	}

	.list {
		width: 100%;
		margin-bottom: 8px;
		background: #fff;

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