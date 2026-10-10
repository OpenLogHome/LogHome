<template>
	<view v-dark class="me-page">
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
									<span class="user-name-text">{{user.name}}</span>
									<span class="user_id">ID:{{user.user_id}}</span>
								</view>
								<view v-if="user.selected_badge || user.display_title" class="user-accolades">
									<view
										v-if="user.selected_badge"
										class="name-badge-tap"
										@tap="goToBadgeDetail(user.selected_badge)"
										@click="goToBadgeDetail(user.selected_badge)"
									>
										<honor-badge class="name-badge" :badge="user.selected_badge" size="name" scale="1.2"/>
									</view>
									<view v-if="user.display_title" class="user-title-chip">
										{{user.display_title}}
									</view>
								</view>
							</view>
							<view class="motto">{{user.motto || $t('me.mottoDefault')}}</view>
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
									<text class="ui-chevron" aria-hidden="true"></text>
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
								<text class="membership-card__arrow ui-chevron" aria-hidden="true"></text>
							</view>
						</view>
					</view>
					<view class="security-banner" v-if="user.email == 'unbind'" @tap="gotoActivate">
						<view class="security-banner__icon">!</view>
						<view class="security-banner__content">
							<text class="security-banner__title">{{ $t('me.security.title') }}</text>
							<text class="security-banner__description">{{ $t('me.security.desc') }}</text>
						</view>
						<text class="security-banner__action">{{ $t('me.security.action') }}</text>
					</view>
					<view class="box-bd">
						<view class="item" @tap="user_profile">
							<view class="icon"><img src="../static/icons/icon_my_name_tag.png"/></view>
							<view class="item-copy">
								<view class="text"><text class="shortcut-title">{{ $t('me.quick.card') }}</text><text class="shortcut-arrow ui-chevron" aria-hidden="true"></text></view>
								<view class="subtext">{{ $t('me.quick.cardSub') }}</view>
							</view>
						</view>
						<view class="item" @tap="gotoMessages">
							<view class="icon" :class="{'newMessage': hasNewMessage || hasNewPrivateMessage}">
								<img src="../static/icons/icon_info.png"/>
							</view>
							<view class="item-copy">
								<view class="text"><text class="shortcut-title">{{ $t('me.quick.message') }}</text><text class="shortcut-arrow ui-chevron" aria-hidden="true"></text></view>
								<view class="subtext">{{ $t('me.quick.messageSub') }}</view>
							</view>
						</view>
						<view class="item" @tap="gotoFriends">
							<view class="icon"><img src="../static/icons/icon_friends.png"/></view>
							<view class="item-copy">
								<view class="text"><text class="shortcut-title">{{ $t('me.quick.friend') }}</text><text class="shortcut-arrow ui-chevron" aria-hidden="true"></text></view>
								<view class="subtext">{{ $t('me.quick.friendSub') }}</view>
							</view>
						</view>
						<view class="item" @tap="gotoSettings">
							<view class="icon"><img
									src="../static/icons/icon_setting.png"/></view>
							<view class="item-copy">
								<view class="text"><text class="shortcut-title">{{ $t('me.quick.settings') }}</text><text class="shortcut-arrow ui-chevron" aria-hidden="true"></text></view>
								<view class="subtext">{{ $t('me.quick.settingsSub') }}</view>
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
								<text>{{ $t('me.service.treeScene') }}</text>
								<text v-if="!isSignedToday" class="checkin-hint">{{ $t('me.service.checkin') }}</text>
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
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
					</view>
				</navigator>
				<navigator v-if="user.is_admin == 1" url="./apps/lab">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/lab.svg"></img>
						</view>
						<view class="text">{{ $t('me.service.lab') }}</view>
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
					</view>
				</navigator>
				<navigator url="./users/achievements">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/cridit_sys_icon.png"></img>
						</view>
						<view class="text">{{ $t('me.service.badges') }}</view>
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
					</view>
				</navigator>
				<navigator url="./apps/inviteCard">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_share.png"></img>
						</view>
						<view class="text">{{ $t('me.service.invite') }}</view>
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
					</view>
				</navigator>
				<navigator url="./payments/recharge">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/cridit_icon.png"></img>
						</view>
						<view class="text">{{ $t('me.service.recharge') }}</view>
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
					</view>
				</navigator>
				<navigator v-if="aiAssistanceEnabled" url="./redstone/index">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/redstone-muted.svg"></img>
						</view>
						<view class="text">{{ $t('me.service.redstone') }}</view>
						<text class="service-balance service-balance--redstone">
							{{ redstoneBalance === null ? '--' : redstoneBalance }} {{ $t('me.unit.redstone') }}
						</text>
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
					</view>
				</navigator>
				<navigator url="./payments/earnings">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_sponsored.png"></img>
						</view>
						<view class="text">{{ $t('me.service.withdraw') }}</view>
						<text class="service-balance service-balance--earnings">{{earningsMoney}} {{ $t('me.unit.yuan') }}</text>
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
					</view>
				</navigator>
				<navigator url="./store/index">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/store.png"></img>
						</view>
						<view class="text">{{ $t('me.service.store') }}</view>
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
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
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
					</view>
				</navigator> -->
				<navigator url="./apps/about">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_about_us.png"></img>
						</view>
						<view class="text">{{ $t('me.service.about') }}</view>
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
					</view>
				</navigator>
				<!-- <navigator url="./apps/faqs/faq">
					<view class="li">
						<view class="icon">
							<img src="../static/icons/icon_report.png"></img>
						</view>
						<view class="text">意见反馈</view>
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
					</view>
				</navigator> -->
				<navigator url="./manage/index" v-if="user.is_admin == 1">
					<view class="li noborder">
						<view class="icon">
							<img src="../static/icons/icon_treecut3.png"></img>
						</view>
						<view class="text">{{ $t('me.service.manage') }}</view>
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
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
						title: this.$t('me.pass.inactiveTitle'),
						status: this.$t('me.pass.notActivated'),
						logo: '/static/membership/loghome-pass.png',
						meta: this.$t('me.pass.inactiveMeta'),
						description: this.$t('me.pass.inactiveDesc'),
						action: this.$t('me.pass.activate'),
						promo: this.$t('me.pass.inactivePromo'),
						promoAction: this.$t('me.pass.learnMore')
					};
				}

				let expiryText = this.$t('me.pass.permanent');
				if (expiryTime) {
					const expiryDate = new Date(expiryTime);
					expiryText = this.$t('me.pass.expires', {
						date: expiryDate.getFullYear() + '.' +
							('0' + (expiryDate.getMonth() + 1)).slice(-2) + '.' +
							('0' + expiryDate.getDate()).slice(-2)
					});
				}

				return {
					theme: isSuper ? 'super' : 'standard',
					title: isSuper ? this.$t('me.pass.superTitle') : this.$t('me.pass.standardTitle'),
					status: this.$t('me.pass.activated'),
					logo: isSuper ? '/static/membership/loghome-super-pass.png' : '/static/membership/loghome-pass.png',
					meta: expiryText,
					description: isSuper ? this.$t('me.pass.superDesc') : this.$t('me.pass.standardDesc'),
					action: this.$t('me.pass.viewBenefits'),
					promo: isSuper ? this.$t('me.pass.superPromo') : this.$t('me.pass.standardPromo'),
					promoAction: isSuper ? this.$t('me.pass.benefitDetails') : this.$t('me.pass.upgradeNow')
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
				title: this.$t('common.loading')
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
					url: './apps/h5webview?url=' + encodeURIComponent(storeUrl) + '&title=' + encodeURIComponent(this.$t('me.storeWebTitle'))
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
				if (!this.aiAssistanceEnabled) { this.redstoneBalance = null; return; }
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
.me-page {
	--me-bg: #f8f5ee; --me-surface: #fff; --me-text: #302e28;
	--me-muted: #89857d; --me-line: #f0ede7; --me-danger: #c65e49;
	--me-shadow: 0 10rpx 30rpx rgba(69,55,34,.045);
	min-height: 100vh; background: var(--me-bg); color: var(--me-text);
	font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
	line-height: 1.5;
	&.dark-mode, .dark-mode & {
		--me-bg: #1e1e1e; --me-surface: #252525; --me-text: #e5e5e5;
		--me-muted: #909399; --me-line: #3a3a3a; --me-danger: #ff8f82;
		--me-shadow: 0 10rpx 30rpx rgba(0,0,0,.12);
	}
}
.theme-switch-wrapper {
	position: absolute; z-index: 10; right: 28rpx;
	top: calc(28rpx + var(--loghome-safe-top, 0px));
}
.header { position: relative; width: 100%; background: var(--me-bg); }
.header .bg {
	--profile-cover-height: calc(430rpx + var(--loghome-safe-top, 0px));
	position: relative; padding-top: calc(174rpx + var(--loghome-safe-top, 0px));
	.info-cover, .box-shadow { position: absolute; top: 0; left: 0; width: 100%; height: var(--profile-cover-height); }
	.info-cover { object-fit: cover; object-position: center 38%; }
	.box-shadow {
		z-index: 1;
		background: linear-gradient(180deg, rgba(248,245,238,.06), rgba(248,245,238,.2) 40%, rgba(248,245,238,.85) 82%, var(--me-bg));
		.dark-mode & { background: linear-gradient(180deg, rgba(30,30,30,.2), rgba(30,30,30,.45) 40%, rgba(30,30,30,.9) 82%, var(--me-bg)); }
	}
}
.box { position: relative; z-index: 2; padding-bottom: 24rpx; }
.box-hd {
	display: flex; align-items: center; min-height: 148rpx; margin: 0 28rpx;
	navigator { flex-shrink: 0; }
	.avator { width: 144rpx; height: 144rpx; overflow: visible; }
	.profile-copy { flex: 1; min-width: 0; margin-left: 34rpx; }
	.user-name { min-width: 0; font-size: 36rpx; font-weight: 700; }
	.user-name-row { display: flex; align-items: center; gap: 12rpx; min-width: 0; }
	.user-name-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.user_id {
		flex-shrink: 0; padding: 3rpx 12rpx; border-radius: 999rpx;
		font-size: 20rpx; font-weight: 500; color: #74654d; background: #fff7e9;
		.dark-mode & { color: #e4d4b9; background: #3b362c; }
	}
	.user-accolades { display: flex; align-items: center; min-width: 0; min-height: 52rpx; gap: 10rpx; margin-top: 8rpx; }
	.name-badge-tap { display: flex; align-items: center; justify-content: center; flex: 0 0 52rpx; height: 52rpx; }
	.name-badge { display: flex; transform-origin: center; }
	.user-title-chip {
		min-width: 0; max-width: 280rpx; padding: 5rpx 14rpx; border-radius: 999rpx;
		font-size: 20rpx; font-weight: 500; color: #fff4df; background: #936339;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	.motto {
		margin-top: 10rpx; font-size: 23rpx; color: #68665d;
		display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
		.dark-mode & { color: #b8b8b8; }
	}
}
.membership-card {
	position: relative; margin: 24rpx 28rpx 0; border-radius: 24rpx; overflow: hidden;
	background: #fff8e9; box-shadow: var(--me-shadow);
	.dark-mode & { background: #342f24; }
	&__main { position: relative; padding: 26rpx 22rpx; color: #fff0cb; background: linear-gradient(120deg, #5f6f4b, #344936); }
	/* 原木通行证：绿色系 */
	&--standard &__main { background: linear-gradient(120deg, #3d7a4f, #24523a); }
	/* 超级原木通行证：深蓝色系 */
	&--super &__main { color: #d9e8f7; background: linear-gradient(120deg, #2a4a70, #14304e 65%, #1e4263); }
	&--standard &__status { border-color: rgba(214, 240, 222, .6); }
	&--super &__status { border-color: rgba(168, 205, 240, .6); }
	&--standard &__action { color: #1d4a2c; background: linear-gradient(120deg, #c4ead0, #9dd8b0); }
	&--super &__action { color: #10304e; background: linear-gradient(120deg, #a8cdf0, #7fb2e0); }
	&--standard &__glow { background: rgba(150, 220, 172, .09); }
	&--super &__glow { background: rgba(126, 178, 226, .09); }
	&--standard &__lines { background: repeating-linear-gradient(115deg, transparent 0, transparent 15rpx, #bfe3ca 16rpx, transparent 17rpx); }
	&--super &__lines { background: repeating-linear-gradient(115deg, transparent 0, transparent 15rpx, #a8cdf0 16rpx, transparent 17rpx); }
	&--standard &__promo { color: #46694f; .dark-mode & { color: #cfe4d8; } }
	&--super &__promo { color: #3e5d7e; .dark-mode & { color: #c5d9ec; } }
	&--standard &__promo-icon { background: #4fa96b; }
	&--super &__promo-icon { background: #4f92cf; }
	&--standard { background: #f2faf4; .dark-mode & { background: #243128; } }
	&--super { background: #f0f6fb; .dark-mode & { background: #22303f; } }
	&__glow { position: absolute; right: -30rpx; top: -100rpx; width: 250rpx; height: 250rpx; border-radius: 50%; background: rgba(230,219,144,.07); }
	&__lines { position: absolute; right: 0; top: 0; width: 190rpx; height: 100%; opacity: .07; background: repeating-linear-gradient(115deg, transparent 0, transparent 15rpx, #ecdda9 16rpx, transparent 17rpx); }
	&__content, &__brand { position: relative; display: flex; align-items: center; }
	&__content { z-index: 1; justify-content: space-between; }
	&__brand { flex: 1; min-width: 0; }
	&__mark { flex-shrink: 0; width: 64rpx; height: 72rpx; margin-right: 14rpx; }
	&__logo { display: block; width: 100%; height: 100%; image-rendering: pixelated; }
	&__heading { flex: 1; min-width: 0; }
	&__title-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6rpx 8rpx; }
	&__title { font-size: 27rpx; line-height: 1.3; font-weight: 700; }
	&__status { padding: 2rpx 8rpx; border: 1rpx solid rgba(255,232,179,.65); border-radius: 9rpx; font-size: 17rpx; line-height: 1.3; white-space: nowrap; }
	&__description { display: block; margin-top: 9rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 20rpx; opacity: .78; }
	&__action {
		flex-shrink: 0; display: flex; align-items: center; justify-content: center; gap: 10rpx;
		margin-left: 14rpx; padding: 13rpx 18rpx; border-radius: 999rpx; font-size: 22rpx; font-weight: 600;
		color: #47331e; background: linear-gradient(120deg, #ffe6aa, #f5d28a);
	}
	&__promo { display: flex; align-items: center; justify-content: space-between; gap: 14rpx; padding: 15rpx 22rpx; font-size: 20rpx; color: #795533; .dark-mode & { color: #e6cfab; } }
	&__promo-main { flex: 1; min-width: 0; display: flex; align-items: center; > text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } }
	&__promo-icon { display: flex; align-items: center; justify-content: center; flex: 0 0 36rpx; height: 36rpx; margin-right: 12rpx; border-radius: 9rpx; color: #fff; background: #df963e; }
	&__promo-link { display: flex; align-items: center; gap: 10rpx; flex-shrink: 0; opacity: .85; }
}
.box-bd {
	display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14rpx; margin: 20rpx 28rpx 0;
	.item {
		display: flex; align-items: center; min-width: 0; min-height: 110rpx;
		box-sizing: border-box; padding: 20rpx; border-radius: 22rpx;
		background: var(--me-surface); box-shadow: var(--me-shadow);
		&:active { background: var(--me-line); }
		.icon { position: relative; flex: 0 0 60rpx; height: 60rpx; display: flex; align-items: center; justify-content: center; border-radius: 22rpx; background: #fcf3e5; img { width: 36rpx; height: 36rpx; image-rendering: pixelated; } }
		&:nth-child(2) .icon { background: #fbefe8; }
		&:nth-child(3) .icon { background: #eaf4e7; }
		&:nth-child(4) .icon { background: #eaf0f6; }
		.dark-mode & .icon { background: #323232; }
		.icon.newMessage img { animation: mail-bounce 1s ease-in-out infinite; transform-origin: 50% 100%; }
		@media (prefers-reduced-motion: reduce) { .icon.newMessage img { animation: none; } }
		.item-copy { flex: 1; min-width: 0; margin-left: 16rpx; }
		.text { display: flex; align-items: center; gap: 12rpx; font-size: 27rpx; font-weight: 600; }
		.shortcut-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
		.subtext { margin-top: 4rpx; font-size: 18rpx; color: var(--me-muted); }
		.subtext { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
		.shortcut-arrow { width: 8rpx; height: 8rpx; color: #a4a79a; }
	}
}
.security-banner {
	display: flex; align-items: center; gap: 14rpx; margin: 16rpx 28rpx 0; padding: 16rpx 20rpx;
	border: 1rpx solid #ecd9b9; border-radius: 20rpx; color: #80552c; background: #fff5e2;
	.dark-mode & { color: #e8c69c; background: #382e20; border-color: #514431; }
	&__icon { flex: 0 0 36rpx; height: 36rpx; border-radius: 50%; text-align: center; line-height: 36rpx; font-weight: 700; color: #fff; background: #d9923d; }
	&__content { flex: 1; min-width: 0; }
	&__title, &__description { display: block; }
	&__title { font-size: 23rpx; font-weight: 600; }
	&__description { font-size: 19rpx; opacity: .8; }
	&__action { flex-shrink: 0; font-size: 21rpx; font-weight: 600; }
}
@keyframes mail-bounce {
	0%, 100% { transform: translateY(0) scale(1, 1); }
	30% { transform: translateY(-10rpx) rotate(-8deg); }
	45% { transform: translateY(0) scale(1.08, .9); }
	60% { transform: translateY(-4rpx) rotate(4deg); }
	75% { transform: translateY(0) scale(1, 1); }
}
.list-content { position: relative; z-index: 2; padding-top: 0; background: var(--me-bg); }
.blank_box { height: calc(160rpx + var(--loghome-safe-bottom, 0px)); }
.list {
	margin: 0 28rpx 24rpx; border-radius: 24rpx; overflow: hidden; background: var(--me-surface); box-shadow: var(--me-shadow);
	> navigator:last-child .li { border-bottom: 0; }
	.li {
		display: flex; align-items: center; box-sizing: border-box; width: 100%; min-height: 86rpx;
		padding: 14rpx 22rpx; border-bottom: 1rpx solid var(--me-line);
		&:active { background: var(--me-line); }
		&.noborder { border-bottom: 0; }
		.icon { flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 48rpx; height: 48rpx; img { width: 44rpx; height: 44rpx; object-fit: contain; image-rendering: pixelated; } }
		.text { flex: 1; min-width: 0; padding-left: 20rpx; font-size: 27rpx; font-weight: 600; overflow-wrap: break-word; }
		.service-balance { flex-shrink: 0; margin-left: 14rpx; font-size: 25rpx; font-weight: 500; color: var(--me-danger); white-space: nowrap; font-variant-numeric: tabular-nums; }
		.to { display: flex; align-items: center; justify-content: center; flex: 0 0 26rpx; height: 32rpx; margin-left: 16rpx; color: #acafa6; }
		.tree-growth-text { display: flex; flex-direction: column; padding-top: 4rpx; padding-bottom: 4rpx; }
		.title-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8rpx; }
		.checkin-hint { font-size: 20rpx; color: var(--me-danger); font-weight: 400; }
		.growth-bar-wrapper { display: flex; align-items: center; margin-top: 10rpx; }
		.growth-bar-track { flex: 1; height: 12rpx; margin-right: 12rpx; border-radius: 999rpx; overflow: hidden; background: var(--me-line); }
		.growth-bar-inner { height: 100%; border-radius: inherit; background: linear-gradient(90deg, #81c792, #65b87b); transition: width .4s ease-out; }
		.growth-val { flex-shrink: 0; font-size: 21rpx; font-weight: 400; color: var(--me-muted); font-variant-numeric: tabular-nums; }
	}
}
.ui-chevron { display: inline-block; flex-shrink: 0; width: 10rpx; height: 10rpx; border-top: 2rpx solid currentColor; border-right: 2rpx solid currentColor; transform: rotate(45deg); }
@media (max-width: 360px) {
	.membership-card__mark { width: 52rpx; margin-right: 10rpx; }
	.membership-card__title { font-size: 25rpx; }
	.membership-card__action { padding: 12rpx 14rpx; font-size: 20rpx; }
	.membership-card__promo { font-size: 18rpx; gap: 8rpx; }
	.box-bd .item { padding: 18rpx 16rpx; .icon { flex-basis: 52rpx; height: 52rpx; } .item-copy { margin-left: 12rpx; } }
}
@media (prefers-reduced-motion: reduce) { .list .li .growth-bar-inner { transition: none; } }
</style>
