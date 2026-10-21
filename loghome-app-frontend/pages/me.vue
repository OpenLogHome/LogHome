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
				</view>
			</view>
		</view>

		<view class="page-content">
			<view v-if="user.email == 'unbind'" class="security-banner" role="button" @tap="gotoActivate">
				<image src="/static/icons/icon_activate.png" mode="aspectFit" />
				<view><text class="security-title">{{ $t('me.security.title') }}</text><text class="security-description">{{ $t('me.security.desc') }}</text></view>
				<text>{{ $t('me.security.action') }}</text>
			</view>

			<view class="box-bd">
				<view class="item" role="button" @tap="user_profile">
					<view class="icon"><image src="/static/icons/icon_my_name_tag.png" mode="aspectFit" /></view>
					<text>{{ $t('me.quick.card') }}</text>
				</view>
				<view class="item" role="button" @tap="gotoFriends">
					<view class="icon"><image src="/static/icons/icon_friends.png" mode="aspectFit" /></view>
					<text>{{ $t('me.quick.friend') }}</text>
				</view>
				<view class="item" role="button" @tap="gotoMessages">
					<view class="icon" :class="{ 'newMessage': hasNewMessage || hasNewPrivateMessage }"><image src="/static/icons/icon_info.png" mode="aspectFit" /></view>
					<text>{{ $t('me.quick.message') }}</text>
				</view>
				<view class="item" role="button" @tap="gotoSettings">
					<view class="icon"><image src="/static/icons/icon_setting.png" mode="aspectFit" /></view>
					<text>{{ $t('me.quick.settings') }}</text>
				</view>
			</view>

			<view class="panel wallet-panel">
				<view class="section-heading"><text class="section-title">{{ $t('me.layout.wallet') }}</text><navigator class="section-link" url="/pages/payments/recharge"><text>{{ $t('me.service.recharge') }}</text><uni-icons type="right" size="12" color="currentColor" /></navigator></view>
				<view class="wallet-grid">
					<navigator class="wallet-item" url="/pages/treePlant/treeplant">
						<view class="wallet-value">
							<view class="tree-progress-text" role="progressbar" :aria-label="$t('me.service.treeScene')" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="treeState === 'None' ? undefined : treeGrowthPercent">
								<text>{{ treeState === 'None' ? '--' : Math.floor(treeGrowthPercent) }}</text><text v-if="treeState !== 'None'" class="wallet-unit">%</text>
								<view v-if="treeState !== 'None'" class="tree-progress-fill" :style="{ clipPath: 'inset(' + (100 - treeGrowthPercent) + '% 0 0 0)' }" aria-hidden="true">
									<text>{{ Math.floor(treeGrowthPercent) }}</text><text class="wallet-unit">%</text>
								</view>
								<view v-if="treeState !== 'None' && treeGrowthPercent > 0" class="tree-progress-particles" :style="{ top: (100 - treeGrowthPercent) + '%' }" aria-hidden="true">
									<view v-for="particle in 5" :key="particle" class="tree-progress-particle"></view>
								</view>
							</view>
						</view>
						<text class="wallet-label">{{ $t('me.service.treeScene') }}</text>
						<text class="wallet-hint" :class="{ 'wallet-checkin': !isSignedToday }">{{ $t(isSignedToday ? 'me.layout.viewTree' : 'me.service.checkin') }}</text>
					</navigator>
					<navigator class="wallet-item" url="/pages/payments/recharge"><text class="wallet-value">{{ resources === null ? '--' : (resources.log || 0) }}</text><text class="wallet-label">{{ $t('me.layout.logBalance') }}</text><text class="wallet-hint">{{ $t('me.layout.logHint') }}</text></navigator>
					<navigator v-if="aiAssistanceEnabled" class="wallet-item" url="/pages/redstone/index"><text class="wallet-value">{{ redstoneBalance === null ? '--' : redstoneBalance }}</text><text class="wallet-label">{{ $t('me.service.redstone') }}</text><text class="wallet-hint">{{ $t('me.layout.redstoneHint') }}</text></navigator>
					<navigator class="wallet-item" url="/pages/payments/earnings"><view class="wallet-value">{{ earningsMoney === null ? '--' : earningsMoney }}<text class="wallet-unit">{{ $t('me.unit.yuan') }}</text></view><text class="wallet-label">{{ $t('me.service.withdraw') }}</text><text class="wallet-hint">{{ $t('me.layout.earningsHint') }}</text></navigator>
				</view>
			</view>

			<view class="panel services-panel">
				<view class="section-heading"><text class="section-title">{{ $t('me.layout.moreServices') }}</text></view>
				<view class="service-grid">
					<navigator class="grid-item" url="/pages/bookcase/index"><image src="/static/icons/ender-chest.svg" mode="aspectFit" /><text>{{ $t('me.service.collection') }}</text></navigator>
					<navigator class="grid-item" url="/pages/users/achievements"><image src="/static/icons/cridit_sys_icon.png" mode="aspectFit" /><text>{{ $t('me.service.badges') }}</text></navigator>
					<navigator class="grid-item" url="/pages/store/index"><image src="/static/icons/store.png" mode="aspectFit" /><text>{{ $t('me.service.store') }}</text></navigator>
					<navigator class="grid-item" url="/pages/store/orders"><image src="/static/icons/icon_my_info.png" mode="aspectFit" /><text>{{ $t('me.layout.orders') }}</text></navigator>
					<navigator class="grid-item" url="/pages/apps/inviteCard"><image src="/static/icons/icon_share.png" mode="aspectFit" /><text>{{ $t('me.service.invite') }}</text></navigator>
					<navigator class="grid-item" url="/pages/apps/lab"><image src="/static/icons/lab.svg" mode="aspectFit" /><text>{{ $t('me.service.lab') }}</text></navigator>
					<navigator class="grid-item" url="/pages/apps/about"><image src="/static/icons/icon_about_us.png" mode="aspectFit" /><text>{{ $t('me.service.about') }}</text></navigator>
					<navigator v-if="user.is_admin == 1" class="grid-item" url="/pages/manage/index"><image src="/static/icons/icon_treecut3.png" mode="aspectFit" /><text>{{ $t('me.service.manage') }}</text></navigator>
				</view>
			</view>
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
				earningsMoney: null,
				resources: null,
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
				const isSuper = rawLevel === 2 || normalizedLevel === '2' || normalizedLevel === 'super' ||
					normalizedLevel === 'premium' || normalizedLevel === 'super_pass';
				const isStandard = rawLevel === 1 || normalizedLevel === '1' || normalizedLevel === 'standard' ||
					normalizedLevel === 'pass' || normalizedLevel === 'log_pass';
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
					this.resources = res.data[0] || {};
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
	--me-bg: #F8F8F8; --me-surface: #fff; --me-text: #302e28;
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
		background: linear-gradient(180deg, rgba(248,248,248,.06), rgba(248,248,248,.2) 40%, rgba(248,248,248,.85) 82%, var(--me-bg));
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
	display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
	padding: 24rpx 8rpx; border-radius: 18rpx; background: var(--me-surface);
	.item {
		display: flex; flex-direction: column; align-items: center; justify-content: center;
		min-width: 0; min-height: 100rpx; gap: 16rpx; text-align: center;
		&:active { opacity: .65; }
		.icon { width: 48rpx; height: 48rpx; image { display: block; width: 100%; height: 100%; image-rendering: pixelated; } }
		.icon.newMessage image { animation: mail-bounce 1s ease-in-out infinite; transform-origin: 50% 100%; }
		@media (prefers-reduced-motion: reduce) { .icon.newMessage image { animation: none; } }
	}
}
@keyframes mail-bounce {
	0%, 100% { transform: translateY(0) scale(1, 1); }
	30% { transform: translateY(-10rpx) rotate(-8deg); }
	45% { transform: translateY(0) scale(1.08, .9); }
	60% { transform: translateY(-4rpx) rotate(4deg); }
	75% { transform: translateY(0) scale(1, 1); }
}
.ui-chevron { display: inline-block; flex-shrink: 0; width: 10rpx; height: 10rpx; border-top: 2rpx solid currentColor; border-right: 2rpx solid currentColor; transform: rotate(45deg); }
.page-content { padding: 0 28rpx; }
.panel { display: block; margin-top: 18rpx; border-radius: 18rpx; background: var(--me-surface); overflow: hidden; }
.service-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-item { display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 0; min-height: 110rpx; gap: 16rpx; text-align: center; image { width: 48rpx; height: 48rpx; object-fit: contain; image-rendering: pixelated; } text { padding: 0 4rpx; overflow-wrap: anywhere; } }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; padding: 24rpx 24rpx 0; }
.section-title { font-size: 29rpx; font-weight: 600; }
.section-link { display: flex; align-items: center; gap: 5rpx; font-size: 21rpx; color: var(--me-muted); }
.wallet-grid { display: flex; padding: 30rpx 12rpx 28rpx; }
.wallet-item { flex: 1; min-width: 0; text-align: center; padding: 0 6rpx; }
.wallet-value { display: block; min-height: 54rpx; font-size: 37rpx; line-height: 1.4; font-weight: 600; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.wallet-unit { font-size: 20rpx; margin-left: 3rpx; font-weight: 400; }
.tree-progress-text { position: relative; display: inline-block; isolation: isolate; }
.tree-progress-text > text { position: relative; z-index: 1; }
.tree-progress-fill {
	position: absolute; inset: 0; z-index: 2; color: #8FDF70; pointer-events: none;
}
.tree-progress-particles {
	position: absolute; left: 0; right: 0; height: 0; z-index: 0;
	pointer-events: none;
}
.tree-progress-particle {
	position: absolute; bottom: 0; width: 8rpx; height: 8rpx;
	background: #8FDF70; opacity: 0;
	animation: tree-progress-splash 1.6s linear infinite;
	&:nth-child(1) { left: 12%; --splash-direction: -.8; animation-delay: -.2s; }
	&:nth-child(2) { left: 32%; --splash-direction: -.4; width: 6rpx; height: 6rpx; animation-duration: 1.85s; animation-delay: -.95s; }
	&:nth-child(3) { left: 50%; --splash-direction: .1; animation-duration: 1.5s; animation-delay: -.6s; }
	&:nth-child(4) { left: 68%; --splash-direction: .8; width: 6rpx; height: 6rpx; animation-duration: 1.75s; animation-delay: -1.2s; }
	&:nth-child(5) { left: 85%; --splash-direction: .3; animation-duration: 2s; animation-delay: -1.7s; }
}
@keyframes tree-progress-splash {
	0% { opacity: 0; transform: translate3d(0, 0, 0) scale(1); }
	12% { opacity: .9; }
	70% { opacity: .65; }
	100% { opacity: 0; transform: translate3d(calc(var(--splash-direction, 0) * 14rpx), -38rpx, 0) scale(.65); }
}
@media (prefers-reduced-motion: reduce) {
	.tree-progress-particles { display: none; }
}
.wallet-label { display: block; margin-top: 8rpx; }
.box-bd .item > text, .wallet-label, .grid-item > text { font-size: 24rpx; font-weight: 400; line-height: 1.5; }
.wallet-hint { display: block; margin-top: 7rpx; font-size: 20rpx; color: var(--me-muted); }
.service-grid { padding: 12rpx 8rpx 18rpx; row-gap: 12rpx; .grid-item { padding: 14rpx 0; } }
.security-banner { display: flex; align-items: center; gap: 14rpx; margin: 0 0 18rpx; padding: 18rpx; border-radius: 16rpx; background: var(--me-soft); color: var(--me-accent); font-size: 20rpx; image { width: 40rpx; height: 40rpx; flex-shrink: 0; } > view { flex: 1; min-width: 0; } > text { flex-shrink: 0; } }
.security-title, .security-description { display: block; }
.security-title { font-size: 22rpx; font-weight: 500; }
.security-description { margin-top: 4rpx; font-size: 19rpx; opacity: .8; }

.me-page { --me-accent: #805b35; --me-soft: #f8f1e5; padding-bottom: calc(160rpx + var(--loghome-safe-bottom, 0px)); }
.me-page.dark-mode, .dark-mode .me-page { --me-accent: #e1c49e; --me-soft: #373127; }
.box-bd { margin: 0; }
.wallet-checkin { color: var(--me-danger); }
.grid-item:active, .wallet-item:active { opacity: .65; }
@media (max-width: 360px) {
	.membership-card__mark { width: 52rpx; margin-right: 10rpx; }
	.membership-card__title { font-size: 25rpx; }
	.membership-card__action { padding: 12rpx 14rpx; font-size: 20rpx; }
	.membership-card__promo { font-size: 18rpx; gap: 8rpx; }
	.wallet-value { font-size: 33rpx; }
}
</style>
