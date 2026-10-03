<template>
	<view v-dark>
		<view class="theme-switch-wrapper">
			<theme-switch></theme-switch>
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
								<user-avatar :src="user.avatar_url" :frame="user.avatar_frame" :animate="true" :visual-scale="user.avatar_frame ? 1.35 : 1" />
							</view>
						</navigator>
						<view class="profile-copy">
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
							<view class="motto">{{user.motto || '用文字记录生活与想象'}}</view>
						</view>
					</view>
					<view
						class="membership-card"
						:class="'membership-card--' + membershipInfo.theme"
						@tap="gotoMembership"
					>
						<view class="membership-card__main">
							<view class="membership-card__glow"></view>
							<view class="membership-card__lines"></view>
							<view class="membership-card__content">
								<view class="membership-card__brand">
									<view class="membership-card__mark">
										<image class="membership-card__logo" :src="membershipInfo.logo" mode="aspectFit"></image>
									</view>
									<view class="membership-card__heading">
										<view class="membership-card__title-row">
											<text class="membership-card__title">{{ membershipInfo.title }}</text>
											<text class="membership-card__status">{{ membershipInfo.status }}</text>
										</view>
										<text class="membership-card__description">
											{{ membershipInfo.meta }} · {{ membershipInfo.description }}
										</text>
									</view>
								</view>
								<view class="membership-card__action">
									<text>{{ membershipInfo.action }}</text>
								</view>
							</view>
						</view>
						<view class="membership-card__promo">
							<view class="membership-card__promo-main">
								<view class="membership-card__promo-icon">✦</view>
								<text>{{ membershipInfo.promo }}</text>
							</view>
							<view class="membership-card__promo-link">
								<text>{{ membershipInfo.promoAction }}</text>
								<text class="membership-card__arrow">›</text>
							</view>
						</view>
					</view>
					<view class="security-banner" v-if="user.email == 'unbind'" @tap="gotoActivate">
						<view class="security-banner__icon">!</view>
						<view class="security-banner__content">
							<text class="security-banner__title">绑定邮箱，保护账号安全</text>
							<text class="security-banner__description">完成绑定后可及时找回账号</text>
						</view>
						<text class="security-banner__action">去绑定 ›</text>
					</view>
					<view class="box-bd">
						<view class="item" @tap="user_profile">
							<view class="icon"><img src="../static/icons/icon_my_name_tag.png"/></view>
							<view class="item-copy">
								<view class="text">名片</view>
								<view class="subtext">个人主页与资料</view>
							</view>
						</view>
						<view class="item" @tap="gotoMessages">
							<view class="icon" :class="{'newMessage': hasNewMessage || hasNewPrivateMessage}">
								<img src="../static/icons/icon_info.png"/>
							</view>
							<view class="item-copy">
								<view class="text">消息</view>
								<view class="subtext">私信与系统通知</view>
							</view>
						</view>
						<view class="item" @tap="gotoFriends">
							<view class="icon"><img src="../static/icons/icon_friends.png"/></view>
							<view class="item-copy">
								<view class="text">好友</view>
								<view class="subtext">好友与关注动态</view>
							</view>
						</view>
						<view class="item" @tap="gotoSettings">
							<view class="icon"><img
									src="../static/icons/icon_setting.png"/></view>
							<view class="item-copy">
								<view class="text">设置</view>
								<view class="subtext">偏好与账号管理</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="list-content">
			<!-- <view class="section-title">我的服务</view> -->
			<view class="list">
				<navigator url="./treePlant/treeplant">
					<view class="li">
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
				<navigator url="./redstone/index">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/redstone-muted.svg"></img>
						</view>
						<view class="text">红石中心</view>
						<text class="service-balance service-balance--redstone">
							{{ redstoneBalance === null ? '--' : redstoneBalance }} 红石
						</text>
						<img class="to" src="../static/user/to.png"></img>
					</view>
				</navigator>
				<navigator url="./payments/earnings">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_sponsored.png"></img>
						</view>
						<view class="text">余额提现</view>
						<text class="service-balance service-balance--earnings">{{earningsMoney}} 元</text>
						<img class="to" src="../static/user/to.png"></img>
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
			<!-- <view class="section-title">更多</view> -->
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
	import { getRedstoneAccount } from '@/common/redstone-api.js'
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
				redstoneBalance: null,
				isSignedToday: true
			}
		},
		computed: {
			membershipInfo() {
				const membership = this.user && this.user.membership && typeof this.user.membership === 'object'
					? this.user.membership
					: {};
				const rawLevel = membership.type || membership.level || this.user.membership_type ||
					this.user.membership_level || this.user.member_type || this.user.vip_level || 0;
				const normalizedLevel = String(rawLevel).toLowerCase();
				const isSuper = rawLevel === 2 || normalizedLevel === '2' || normalizedLevel === 'super' || normalizedLevel === 'premium' ||
					normalizedLevel === 'super_pass' || normalizedLevel.indexOf('超级') !== -1;
				const isStandard = rawLevel === 1 || normalizedLevel === '1' || normalizedLevel === 'standard' || normalizedLevel === 'pass' ||
					normalizedLevel === 'log_pass' || normalizedLevel.indexOf('原木通行证') !== -1;
				const expiry = membership.expire_at || membership.expires_at || membership.expired_at ||
					this.user.membership_expire_at || this.user.member_expire_at || this.user.vip_expire_at;
				let expiryTime = 0;
				if (expiry) {
					expiryTime = typeof expiry === 'number' && expiry < 1000000000000
						? expiry * 1000
						: new Date(expiry).getTime();
				}
				const explicitlyInactive = membership.active === false || this.user.membership_active === false;
				const isActive = (isSuper || isStandard) && !explicitlyInactive && (!expiryTime || expiryTime > Date.now());

				if (!isActive) {
					return {
						theme: 'inactive',
						title: '原木通行证',
						status: '未开通',
						logo: '/static/membership/loghome-pass.png',
						meta: '两档会员可选',
						description: '专属标识、成长加速',
						action: '立即开通',
						promo: '升级超级原木通行证，尊享全部权益',
						promoAction: '了解更多'
					};
				}

				let expiryText = '长期有效';
				if (expiryTime) {
					const expiryDate = new Date(expiryTime);
					expiryText = '有效期至 ' + expiryDate.getFullYear() + '.' +
						('0' + (expiryDate.getMonth() + 1)).slice(-2) + '.' +
						('0' + expiryDate.getDate()).slice(-2);
				}

				return {
					theme: isSuper ? 'super' : 'standard',
					title: isSuper ? '超级原木通行证' : '原木通行证',
					status: '已开通',
					logo: isSuper ? '/static/membership/loghome-super-pass.png' : '/static/membership/loghome-pass.png',
					meta: expiryText,
					description: isSuper ? '双倍成长、全部权益' : '成长加速、会员权益',
					action: '查看权益',
					promo: isSuper ? '超级会员专属权益已全部生效' : '升级超级原木通行证，解锁更多权益',
					promoAction: isSuper ? '权益详情' : '立即升级'
				};
			},
			treeGrowthPercent() {
				if (!this.treeMaxGrowth || this.treeMaxGrowth <= 0) return 0;
				const val = this.treeGrowthVal || 0;
				const percent = val / this.treeMaxGrowth * 100;
				return Math.max(0, Math.min(100, percent));
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
			this.refreshRedstoneBalance();
		},
		methods: {
			gotoMembership() {
				const tier = this.membershipInfo.theme === 'super' ? 'super' : 'standard';
				uni.navigateTo({
					url: '/pages/membership/index?tier=' + tier
				});
			},
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
			},
			async refreshRedstoneBalance() {
				try {
					const account = await getRedstoneAccount(this.$baseUrl);
					this.redstoneBalance = Number(account.redstone_balance || 0);
				} catch (error) {
					this.redstoneBalance = null;
					console.log('加载红石余额失败。', error);
				}
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
		position: absolute;
		z-index: 100;
		right: 28rpx;
		top: calc(24rpx + var(--loghome-safe-top, 0px));
	}

	page {
		background-color: #f5f3ef;
		font-size: 30upx;
		color: rgb(25, 25, 25);
		
		.dark-mode & {
			background-color: var(--background-color);
			color: var(--text-color-primary);
		}
	}

		.header {
			position: relative;
			width: 100vw;
			background: #f5f3ef;
			overflow: hidden;

		.dark-mode & {
			background: var(--background-color);
		}

			.bg {
				--profile-cover-height: 585rpx;
				position: relative;
				width: 100%;
				height: auto;
				padding-top: calc(250rpx + var(--loghome-safe-top, 0px));

			.info-cover {
				position: absolute;
				left: 0;
				top: 0;
				width: 100vw;
				height: var(--profile-cover-height);
				z-index: 0;
				object-fit: cover;
				object-position: center 38%;
			}

			.box-shadow {
				position: absolute;
				left: 0;
				top: 0;
				width: 100vw;
				height: var(--profile-cover-height);
				z-index: 1;
				background: linear-gradient(to bottom, rgba(245, 243, 239, 0.18) 0%, rgba(245, 243, 239, 0.34) 34%, rgba(245, 243, 239, 0.66) 62%, rgba(245, 243, 239, 0.94) 88%, #f5f3ef 100%);

				.dark-mode & {
					background: linear-gradient(to bottom, rgba(0, 0, 0, 0.22) 0%, rgba(18, 18, 18, 0.4) 34%, rgba(18, 18, 18, 0.72) 64%, rgba(18, 18, 18, 0.95) 88%, var(--background-color) 100%);
				}
			}
		}
	}

	.box {
		position: relative;
		z-index: 2;
		width: 100vw;
		height: auto;
		padding-bottom: 28rpx;

		.box-hd {
			display: flex;
			align-items: center;
			margin: 0 28rpx;

			navigator {
				flex-shrink: 0;
			}

			.profile-copy {
				flex: 1;
				min-width: 0;
				margin-left: 20rpx;
			}

			.avator {
				width: 144rpx;
				height: 144rpx;
				background: transparent;
				overflow: visible;
			}

			.user-name {
				min-width: 0;
				font-size: 36rpx;
				font-weight: 700;
				color: #2f2924;

				.dark-mode & {
					color: var(--text-color-primary);
				}

				.user-name-row {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
				}

				.user-name-row > span:first-child {
					max-width: 260rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.name-badge {
					margin-left: 12rpx;
					transform: translateY(0);
				}

				.name-badge-tap {
					display: inline-flex;
					align-items: center;
					margin-left: 12rpx;
				}

				.user-title-chip {
					max-width: 220rpx;
					margin: 8rpx 0 0 12rpx;
					padding: 5rpx 12rpx;
					border-radius: 999rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 20rpx;
					line-height: 1.2;
					font-weight: 500;
					color: #fff4df;
					background: linear-gradient(120deg, rgba(143, 92, 49, 0.94), rgba(103, 61, 31, 0.94));
				}
			}

			.user_id {
				margin-left: 12rpx;
				padding: 5rpx 10rpx;
				border-radius: 999rpx;
				font-size: 20rpx;
				line-height: 1.2;
				font-weight: 500;
				color: #66584d;
				background: rgba(255, 255, 255, 0.66);

				.dark-mode & {
					color: #ded2c8;
					background: rgba(255, 255, 255, 0.1);
				}
			}

			.motto {
				max-width: 470rpx;
				margin-top: 10rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 24rpx;
				color: #74695f;

				.dark-mode & {
					color: var(--text-color-regular);
				}
			}
		}

		.box-bd {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12rpx;
			margin: 18rpx 28rpx 0;
			padding: 0;

			.item {
				display: flex;
				box-sizing: border-box;
				align-items: center;
				min-width: 0;
				min-height: 106rpx;
				margin: 0;
				padding: 17rpx 16rpx;
				border: 1rpx solid rgba(111, 80, 53, 0.05);
				border-radius: 22rpx;
				background: rgba(255, 255, 255, 0.94);
				box-shadow: 0 9rpx 24rpx rgba(78, 61, 47, 0.08);
				backdrop-filter: blur(10rpx);

				.dark-mode & {
					border-color: rgba(255, 255, 255, 0.05);
					background: rgba(38, 38, 38, 0.94);
					box-shadow: 0 9rpx 24rpx rgba(0, 0, 0, 0.2);
				}

				.icon {
					flex-shrink: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 58rpx;
					height: 58rpx;
					border: 1rpx solid rgba(139, 94, 53, 0.06);
					border-radius: 50%;
					background: linear-gradient(145deg, #fbf4eb, #f4e8da);
					box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.82), 0 5rpx 12rpx rgba(100, 68, 40, 0.05);

					.dark-mode & {
						border-color: rgba(222, 177, 127, 0.08);
						background: linear-gradient(145deg, rgba(196, 151, 101, 0.18), rgba(119, 82, 49, 0.13));
						box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.04), 0 5rpx 12rpx rgba(0, 0, 0, 0.12);
					}

					img {
						width: 34rpx;
						height: 34rpx;
					}
				}

				&:nth-child(2) .icon {
					background: linear-gradient(145deg, #f9eee8, #f2dfd6);
				}

				&:nth-child(3) .icon {
					background: linear-gradient(145deg, #eef5ea, #e0ecdc);
				}

				&:nth-child(4) .icon {
					background: linear-gradient(145deg, #edf1f6, #dfe6ef);
				}

				.dark-mode & .icon {
					border-color: rgba(222, 177, 127, 0.08);
					background: linear-gradient(145deg, rgba(196, 151, 101, 0.18), rgba(119, 82, 49, 0.13));
				}

				.icon.newMessage {
					animation: new-message 1.8s infinite;
				}

				.item-copy {
					flex: 1;
					min-width: 0;
					margin-left: 14rpx;
				}

				.text {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 26rpx;
					font-weight: 600;
					color: #443c36;

					.dark-mode & {
						color: var(--text-color-primary);
					}
				}

				.subtext {
					margin-top: 4rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 18rpx;
					color: #9a8f84;

					.dark-mode & {
						color: var(--text-color-secondary);
					}
				}
			}
		}
	}

	.security-banner {
		display: flex;
		align-items: center;
		margin: 14rpx 28rpx 0;
		padding: 16rpx 20rpx;
		border: 1rpx solid rgba(219, 145, 65, 0.18);
		border-radius: 20rpx;
		color: #714621;
		background: #fff6e8;

		.dark-mode & {
			border-color: rgba(222, 166, 101, 0.18);
			color: #f1c894;
			background: rgba(151, 94, 40, 0.16);
		}

		&__icon {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 38rpx;
			height: 38rpx;
			margin-right: 14rpx;
			border-radius: 50%;
			font-size: 23rpx;
			font-weight: 700;
			color: #fff;
			background: #dd8a3e;
		}

		&__content {
			flex: 1;
			min-width: 0;
		}

		&__title,
		&__description {
			display: block;
		}

		&__title {
			font-size: 23rpx;
			font-weight: 600;
		}

		&__description {
			margin-top: 3rpx;
			font-size: 19rpx;
			opacity: 0.7;
		}

		&__action {
			flex-shrink: 0;
			margin-left: 14rpx;
			font-size: 21rpx;
			font-weight: 600;
		}
	}

	.membership-card {
		position: relative;
		box-sizing: border-box;
		margin: 20rpx 28rpx 0;
		padding: 0;
		border: 0;
		border-radius: 24rpx;
		overflow: hidden;
		background: #fff7e9;
		box-shadow: 0 12rpx 30rpx rgba(72, 45, 27, 0.12);
		z-index: 3;

		.dark-mode & {
			background: #332c26;
			box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.24);
		}

		&__main {
			position: relative;
			box-sizing: border-box;
			padding: 24rpx 24rpx 22rpx;
			color: #ffedca;
			background: linear-gradient(135deg, #704832 0%, #4d3023 56%, #34231d 100%);
		}

		&--standard &__main {
			background: linear-gradient(135deg, #8b5b3b 0%, #603c29 56%, #3e2920 100%);
		}

		&--super &__main {
			color: #ffe6aa;
			background: linear-gradient(135deg, #263b55 0%, #172b43 56%, #0d1d30 100%);
		}

		&__glow {
			position: absolute;
			right: -44rpx;
			top: -100rpx;
			width: 240rpx;
			height: 240rpx;
			border-radius: 50%;
			background: rgba(255, 232, 188, 0.1);
		}

		&__lines {
			position: absolute;
			right: -24rpx;
			top: -50rpx;
			width: 230rpx;
			height: 230rpx;
			opacity: 0.16;
			transform: rotate(18deg);
			background: repeating-linear-gradient(90deg, transparent 0, transparent 10rpx, rgba(255, 255, 255, 0.24) 11rpx, transparent 12rpx);
		}

		&__content {
			position: relative;
			z-index: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		&__brand {
			flex: 1;
			min-width: 0;
			display: flex;
			align-items: center;
		}

		&__mark {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 64rpx;
			height: 64rpx;
			margin-right: 15rpx;
		}

		&__logo {
			display: block;
			width: 100%;
			height: 100%;
			image-rendering: pixelated;
		}

		&__heading {
			flex: 1;
			min-width: 0;
		}

		&__title-row {
			display: flex;
			align-items: center;
		}

		&__title {
			flex: 1;
			min-width: 0;
			max-width: 300rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 28rpx;
			line-height: 1.25;
			font-weight: 700;
		}

		&__status {
			flex-shrink: 0;
			margin-left: 11rpx;
			padding: 3rpx 9rpx;
			border: 1rpx solid rgba(255, 235, 197, 0.5);
			border-radius: 7rpx;
			font-size: 18rpx;
			line-height: 1.2;
			font-weight: 400;
			background: rgba(255, 255, 255, 0.06);
		}

		&__description {
			display: block;
			max-width: 400rpx;
			margin-top: 8rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 21rpx;
			line-height: 1.25;
			opacity: 0.68;
		}

		&__action {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: 16rpx;
			padding: 13rpx 19rpx;
			border-radius: 999rpx;
			font-size: 22rpx;
			font-weight: 600;
			color: #4c321f;
			background: #ffe0a0;
		}

		&__promo {
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 15rpx 22rpx;
			font-size: 21rpx;
			color: #69452e;

			.dark-mode & {
				color: #ead0a5;
			}
		}

		&__promo-main {
			flex: 1;
			min-width: 0;
			display: flex;
			align-items: center;

			> text {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		&__promo-icon {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 36rpx;
			height: 36rpx;
			margin-right: 12rpx;
			border-radius: 9rpx;
			font-size: 18rpx;
			color: #fff7e7;
			background: linear-gradient(145deg, #e99559, #d06e3c);
		}

		&__promo-link {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			margin-left: 18rpx;
			opacity: 0.68;
		}

		&__arrow {
			margin-left: 7rpx;
			font-size: 30rpx;
			line-height: 20rpx;
		}
	}

	.list-content {
		position: relative;
		z-index: 2;
		padding-top: 4rpx;
		background: #f5f3ef;

		.dark-mode & {
			background: var(--background-color);
		}

		.blank_box {
			height: calc(125rpx + 80rpx);
		}
	}

	.section-title {
		margin: 18rpx 28rpx 12rpx;
		font-size: 25rpx;
		font-weight: 600;
		letter-spacing: 1rpx;
		color: #4d443d;

		.dark-mode & {
			color: var(--text-color-primary);
		}
	}

	.list {
		margin: 0 28rpx 24rpx;
		border-radius: 24rpx;
		overflow: hidden;
		background: #fff;
		box-shadow: 0 10rpx 28rpx rgba(78, 61, 47, 0.07);

		.dark-mode & {
			background: var(--background-color-secondary);
			box-shadow: 0 10rpx 28rpx rgba(0, 0, 0, 0.18);
		}

		> navigator:last-child .li {
			border-bottom: 0;
		}

		.li {
			display: flex;
			align-items: center;
			box-sizing: border-box;
			width: 100%;
			min-height: 96rpx;
			padding: 0 22rpx;
			border-bottom: 1rpx solid #f1ebe4;

			.dark-mode & {
				border-bottom-color: rgba(255, 255, 255, 0.07);
			}

			&.noborder {
				border-bottom: 0;
			}

			.icon {
				flex-shrink: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 44rpx;
				height: 44rpx;

				img {
					width: 44rpx;
					height: 44rpx;
				}
			}

			.text {
				flex: 1;
				width: auto;
				padding-left: 18rpx;
				font-size: 27rpx;
				font-weight: 500;
				color: #5f554d;

				.dark-mode & {
					color: var(--text-color-regular);
				}
			}

			.service-balance {
				flex-shrink: 0;
				margin-left: 16rpx;
				font-size: 25rpx;
				line-height: 1;
				text-align: right;
				white-space: nowrap;
			}

			.service-balance--earnings {
				color: #ff6a5f;
			}

			.service-balance--redstone {
				color: #a55b4e;

				.dark-mode & {
					color: #d7a299;
				}
			}

			.service-balance + .to {
				margin-left: 14rpx;
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
					padding: 4rpx 12rpx;
					border-radius: 20rpx;
					font-size: 22rpx;
					color: #2e7d32;
					background-color: #e8f5e9;
				}

				.growth-bar-wrapper {
					display: flex;
					align-items: center;
					margin-top: 8rpx;
				}

				.growth-bar-track {
					flex: 1;
					height: 8rpx;
					margin-right: 12rpx;
					border-radius: 999rpx;
					overflow: hidden;
					background-color: #eee;

					.dark-mode & {
						background-color: rgba(255, 255, 255, 0.1);
					}
				}

				.growth-bar-inner {
					height: 100%;
					background-color: #81c784;
					transition: width 0.4s ease-out;
				}

				.growth-val {
					font-size: 20rpx;
					color: #999;
				}
			}

			.to {
				flex-shrink: 0;
				width: 32rpx;
				height: 32rpx;
				opacity: 0.5;
			}
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
