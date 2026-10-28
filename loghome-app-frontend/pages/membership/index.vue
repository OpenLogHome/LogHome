<template>
	<view class="pass-page" :class="'pass-page--' + activePass.theme">
		<view class="page-orb page-orb--one"></view>
		<view class="page-orb page-orb--two"></view>

		<view class="top-bar">
			<view class="top-bar__button" @tap="goBack">
				<view class="top-bar__back"></view>
			</view>
			<view class="top-bar__heading">
				<text class="top-bar__title">{{ $t('membership.pass.title') }}</text>
			</view>
			<view class="top-bar__button top-bar__rules" @tap="showRules">{{ $t('membership.common.rules') }}</view>
		</view>

		<swiper
			class="pass-swiper"
			:current="activeIndex"
			previous-margin="46rpx"
			next-margin="46rpx"
			:duration="360"
			@change="handlePassChange"
		>
			<swiper-item v-for="(pass, index) in passes" :key="pass.key">
				<view
					class="pass-card"
					:class="[
						'pass-card--' + pass.theme,
						{ 'pass-card--active': activeIndex === index }
					]"
					@tap="selectPass(index)"
				>
					<view class="pass-card__shine"></view>
					<view class="pass-card__rings"></view>
					<view class="pass-card__top">
						<view class="pass-card__brand">
							<image class="pass-card__logo" :src="pass.logo" mode="aspectFit"></image>
							<view>
								<text class="pass-card__eyebrow">{{ $t(pass.eyebrowKey) }}</text>
								<text class="pass-card__name">{{ $t(pass.nameKey) }}</text>
							</view>
						</view>
						<text class="pass-card__status">
							{{ $t(memberTier === pass.key ? 'membership.pass.currentMember' : pass.cardTagKey) }}
						</text>
					</view>
					<view class="pass-card__body">
						<text class="pass-card__slogan">{{ $t(pass.sloganKey) }}</text>
						<text class="pass-card__summary">{{ $t(pass.summaryKey) }}</text>
					</view>
					<view class="pass-card__features">
						<text v-for="featureKey in pass.featureKeys" :key="featureKey">{{ $t(featureKey) }}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>

		<view class="swiper-indicator">
			<view
				v-for="(pass, index) in passes"
				:key="pass.key"
				class="swiper-indicator__dot"
				:class="{ 'swiper-indicator__dot--active': activeIndex === index }"
				@tap="selectPass(index)"
			></view>
			<text>{{ $t(activePass.nameKey) }}</text>
		</view>

		<view class="page-content" :key="activePass.key">
			<view class="benefit-panel panel">
				<view class="panel-heading">
					<view class="panel-heading__icon">
						<image :src="activePass.logo" mode="aspectFit"></image>
					</view>
					<view class="panel-heading__copy">
						<text class="panel-heading__title">{{ $t(activePass.benefitTitleKey) }}</text>
						<text class="panel-heading__subtitle">{{ $t('membership.pass.benefitsSubtitle') }}</text>
					</view>
					<text class="panel-heading__count">{{ $t('membership.pass.benefitCount', { count: activePass.benefits.length }) }}</text>
				</view>

				<view class="benefit-list">
					<view class="benefit-item" v-for="benefit in activePass.benefits" :key="benefit.titleKey">
						<view class="benefit-item__check">✓</view>
						<view class="benefit-item__copy">
							<text class="benefit-item__title">{{ $t(benefit.titleKey) }}</text>
							<text class="benefit-item__description">{{ $t(benefit.descriptionKey) }}</text>
						</view>
						<text v-if="benefit.tagKey" class="benefit-item__tag">{{ $t(benefit.tagKey) }}</text>
					</view>
				</view>
			</view>

			<view class="purchase-section">
				<view class="section-heading">
					<view>
						<text class="section-heading__title">{{ purchaseSectionTitle }}</text>
						<text v-if="purchaseSectionSubtitle" class="section-heading__subtitle">
							{{ purchaseSectionSubtitle }}
						</text>
					</view>
				</view>

				<view v-if="isStandardToSuperUpgrade" class="upgrade-quote">
					<template v-if="upgradeQuote">
						<view class="upgrade-quote__top">
							<view class="upgrade-quote__badge">UP</view>
							<view class="upgrade-quote__copy">
								<text class="upgrade-quote__title">{{ $t('membership.pass.upgrade.title') }}</text>
								<text class="upgrade-quote__description">
									{{ $t('membership.pass.upgrade.days', { days: upgradeQuote.remaining_days }) }}
								</text>
							</view>
						</view>
						<view class="upgrade-quote__details">
							<view>
								<text>{{ $t('membership.pass.upgrade.difference') }}</text>
								<text class="upgrade-quote__value">{{ $t('membership.pass.upgrade.logAmount', { amount: upgradeQuote.cost_log }) }}</text>
							</view>
							<view>
								<text>{{ $t('membership.pass.upgrade.period') }}</text>
								<text class="upgrade-quote__value">{{ $t('membership.pass.upgrade.until', { date: formatMembershipDate(upgradeQuote.expires_at) }) }}</text>
							</view>
							<view>
								<text>{{ $t('membership.pass.upgrade.autoRenew') }}</text>
								<text class="upgrade-quote__value">{{ $t(upgradeQuote.auto_renew ? 'membership.pass.upgrade.keepOn' : 'membership.pass.upgrade.keepOff') }}</text>
							</view>
						</view>
						<text class="upgrade-quote__formula">
							{{ $t('membership.pass.upgrade.formula', { period: $t(upgradeQuote.billing_cycle === 'monthly' ? 'membership.pass.upgrade.cycleMonth' : 'membership.pass.upgrade.cycleYear'), amount: upgradeQuote.cycle_difference_log }) }}
						</text>
					</template>
					<view v-else class="upgrade-quote__loading">{{ $t('membership.pass.upgrade.loading') }}</view>
				</view>

				<view v-else-if="isViewingCurrentMembership" class="renewal-status">
					<view
						class="renewal-status__icon"
						:class="{ 'renewal-status__icon--enabled': currentSubscription.auto_renew }"
					>
						{{ currentSubscription.auto_renew ? '✓' : '—' }}
					</view>
					<view class="renewal-status__copy">
						<text class="renewal-status__title">
							{{ $t(currentSubscription.auto_renew ? 'membership.pass.renewal.on' : 'membership.pass.renewal.off') }}
						</text>
						<text class="renewal-status__description">
							{{ renewalStatusDescription }}
						</text>
					</view>
				</view>

				<view v-else class="plan-grid">
					<view
						v-for="(plan, index) in activePass.plans"
						:key="plan.key"
						class="plan-card"
						:class="{ 'plan-card--selected': selectedPlanIndex === index }"
						@tap="selectPlan(index)"
					>
						<text v-if="plan.tagKey" class="plan-card__tag">{{ $t(plan.tagKey) }}</text>
						<text class="plan-card__name">{{ $t(plan.nameKey) }}</text>
						<view class="plan-card__price">
							<image class="plan-card__currency-icon" src="/static/resources/log.png" mode="aspectFit"></image>
							<text class="plan-card__number">{{ plan.price }}</text>
							<text class="plan-card__currency">{{ $t('membership.common.logUnit') }}</text>
						</view>
						<text class="plan-card__unit">{{ $t(plan.unitKey) }}</text>
						<text class="plan-card__note">{{ $t(plan.noteKey) }}</text>
					</view>
				</view>
			</view>

			<view class="more-panel panel">
				<view class="more-panel__heading">
					<text class="more-panel__title">{{ $t('membership.pass.more.title') }}</text>
				</view>
				<view class="more-panel__options">
					<view class="more-option" @tap="gotoMembershipTool('redeem')">
						<image class="more-option__icon" src="/static/membership/icons/redeem-ticket.svg" mode="aspectFit"></image>
						<text>{{ $t('membership.common.redeemCode') }}</text>
					</view>
					<view class="more-option" @tap="gotoMembershipTool('gift')">
						<image class="more-option__icon" src="/static/membership/icons/gift-pass.svg" mode="aspectFit"></image>
						<text>{{ $t('membership.common.giftFriend') }}</text>
					</view>
				</view>
			</view>

			<view class="agreement" @tap="showRules">
				{{ $t('membership.pass.agreement') }}
			</view>
		</view>

		<view class="purchase-dock">
			<view class="purchase-dock__copy">
				<text class="purchase-dock__label">{{ purchaseDockLabel }}</text>
				<view class="purchase-dock__price">
					<image class="purchase-dock__currency-icon" src="/static/resources/log.png" mode="aspectFit"></image>
					<text class="purchase-dock__number">{{ purchaseDockPrice }}</text>
					<text class="purchase-dock__unit">{{ purchaseDockUnit }}</text>
				</view>
			</view>
			<view
				class="purchase-dock__button"
				:class="{ 'purchase-dock__button--disabled': isDowngradeBlocked }"
				@tap="handlePurchase"
			>
				{{ purchaseButtonText }}
			</view>
		</view>
	</view>
</template>

<script>
import {
	createMembershipRequestId,
	getMembershipErrorMessage,
	getMembershipPlans,
	getMembershipStatus,
	subscribeMembership,
	updateMembershipAutoRenew
} from '@/common/membership-api.js';

export default {
	data() {
		return {
			activeIndex: 0,
			selectedPlanIndex: 1,
			memberTier: '',
			currentSubscription: null,
			upgradeQuote: null,
			logBalance: null,
			submitting: false,
			passes: [
				{
					key: 'standard',
					theme: 'standard',
					nameKey: 'membership.pass.tier.standard.name',
					eyebrowKey: 'membership.pass.tier.standard.eyebrow',
					cardTagKey: 'membership.pass.tier.standard.tag',
					logo: '/static/membership/loghome-pass.png',
					sloganKey: 'membership.pass.tier.standard.slogan',
					summaryKey: 'membership.pass.tier.standard.summary',
					featureKeys: [
						'membership.pass.tier.standard.features.badge',
						'membership.pass.tier.standard.features.growth',
						'membership.pass.tier.standard.features.redstone'
					],
					defaultPlan: 1,
					benefitTitleKey: 'membership.pass.tier.standard.benefitTitle',
					benefits: [
						{
							titleKey: 'membership.pass.tier.standard.benefits.badge.title',
							descriptionKey: 'membership.pass.tier.standard.benefits.badge.desc'
						},
						{
							titleKey: 'membership.pass.tier.standard.benefits.growth.title',
							descriptionKey: 'membership.pass.tier.standard.benefits.growth.desc',
							tagKey: 'membership.pass.tier.standard.benefits.growth.tag'
						},
						{
							titleKey: 'membership.pass.tier.standard.benefits.redstone.title',
							descriptionKey: 'membership.pass.tier.standard.benefits.redstone.desc',
							tagKey: 'membership.pass.tier.standard.benefits.redstone.tag'
						},
						{
							titleKey: 'membership.pass.tier.standard.benefits.enhance.title',
							descriptionKey: 'membership.pass.tier.standard.benefits.enhance.desc'
						}
					],
					plans: [
						{
							key: 'month',
							nameKey: 'membership.pass.tier.standard.plan.month.name',
							price: '660',
							unitKey: 'membership.pass.tier.standard.plan.month.unit',
							noteKey: 'membership.pass.tier.standard.plan.month.note'
						},
						{
							key: 'year',
							nameKey: 'membership.pass.tier.standard.plan.year.name',
							price: '7200',
							unitKey: 'membership.pass.tier.standard.plan.year.unit',
							noteKey: 'membership.pass.tier.standard.plan.year.note',
							tagKey: 'membership.pass.tier.standard.plan.year.tag'
						}
					]
				},
				{
					key: 'super',
					theme: 'super',
					nameKey: 'membership.pass.tier.super.name',
					eyebrowKey: 'membership.pass.tier.super.eyebrow',
					cardTagKey: 'membership.pass.tier.super.tag',
					logo: '/static/membership/loghome-super-pass.png',
					sloganKey: 'membership.pass.tier.super.slogan',
					summaryKey: 'membership.pass.tier.super.summary',
					featureKeys: [
						'membership.pass.tier.super.features.badge',
						'membership.pass.tier.super.features.growth',
						'membership.pass.tier.super.features.redstone'
					],
					defaultPlan: 1,
					benefitTitleKey: 'membership.pass.tier.super.benefitTitle',
					benefits: [
						{
							titleKey: 'membership.pass.tier.super.benefits.badge.title',
							descriptionKey: 'membership.pass.tier.super.benefits.badge.desc',
							tagKey: 'membership.pass.tier.super.benefits.badge.tag'
						},
						{
							titleKey: 'membership.pass.tier.super.benefits.growth.title',
							descriptionKey: 'membership.pass.tier.super.benefits.growth.desc',
							tagKey: 'membership.pass.tier.super.benefits.growth.tag'
						},
						{
							titleKey: 'membership.pass.tier.super.benefits.redstone.title',
							descriptionKey: 'membership.pass.tier.super.benefits.redstone.desc',
							tagKey: 'membership.pass.tier.super.benefits.redstone.tag'
						},
						{
							titleKey: 'membership.pass.tier.super.benefits.standard.title',
							descriptionKey: 'membership.pass.tier.super.benefits.standard.desc'
						},
						{
							titleKey: 'membership.pass.tier.super.benefits.newFeatures.title',
							descriptionKey: 'membership.pass.tier.super.benefits.newFeatures.desc'
						}
					],
					plans: [
						{
							key: 'month',
							nameKey: 'membership.pass.tier.super.plan.month.name',
							price: '880',
							unitKey: 'membership.pass.tier.super.plan.month.unit',
							noteKey: 'membership.pass.tier.super.plan.month.note'
						},
						{
							key: 'year',
							nameKey: 'membership.pass.tier.super.plan.year.name',
							price: '9600',
							unitKey: 'membership.pass.tier.super.plan.year.unit',
							noteKey: 'membership.pass.tier.super.plan.year.note',
							tagKey: 'membership.pass.tier.super.plan.year.tag'
						}
					]
				}
			]
		};
	},
	computed: {
		activePass() {
			return this.passes[this.activeIndex] || this.passes[0];
		},
		selectedPlan() {
			return this.activePass.plans[this.selectedPlanIndex] || this.activePass.plans[0];
		},
		isViewingCurrentMembership() {
			return Boolean(this.currentSubscription && this.currentSubscription.membership_type === this.activePass.key);
		},
		isStandardToSuperUpgrade() {
			return Boolean(
				this.currentSubscription &&
				this.currentSubscription.membership_type === 'standard' &&
				this.activePass.key === 'super'
			);
		},
		isDowngradeBlocked() {
			return Boolean(
				this.currentSubscription &&
				this.currentSubscription.membership_type === 'super' &&
				this.activePass.key === 'standard'
			);
		},
		purchaseSectionTitle() {
			if (this.isStandardToSuperUpgrade) return this.$t('membership.pass.section.upgradeTitle');
			if (this.isViewingCurrentMembership) return this.$t('membership.pass.section.renewalTitle');
			return this.$t('membership.pass.section.chooseTitle');
		},
		purchaseSectionSubtitle() {
			if (this.isStandardToSuperUpgrade) return this.$t('membership.pass.section.upgradeSubtitle');
			if (this.isViewingCurrentMembership) {
				return this.$t('membership.pass.section.currentExpires', {
					date: this.formatMembershipDate(this.currentSubscription.expires_at)
				});
			}
			return '';
		},
		renewalStatusDescription() {
			if (!this.currentSubscription) return '';
			if (this.currentSubscription.auto_renew) {
				const price = this.currentSubscription.renewal_cost_log || this.currentSubscription.cost_log;
				return this.$t('membership.pass.renewal.autoDesc', { price });
			}
			return this.$t('membership.pass.renewal.expiresDesc', {
				date: this.formatMembershipDate(this.currentSubscription.expires_at)
			});
		},
		purchaseDockLabel() {
			if (this.isStandardToSuperUpgrade) return this.$t('membership.pass.dock.upgrade');
			if (this.isViewingCurrentMembership) {
				return this.currentSubscription.auto_renew
					? this.$t('membership.pass.renewal.nextPrice')
					: this.$t('membership.pass.renewal.reopenPrice');
			}
			if (this.isDowngradeBlocked) return this.$t('membership.pass.dock.downgradeBlocked');
			return this.$t(this.selectedPlan.nameKey);
		},
		purchaseDockPrice() {
			if (this.isStandardToSuperUpgrade) return this.upgradeQuote ? this.upgradeQuote.cost_log : '—';
			if (this.isViewingCurrentMembership) {
				return this.currentSubscription.renewal_cost_log || this.currentSubscription.cost_log;
			}
			return this.selectedPlan.price;
		},
		purchaseDockUnit() {
			return this.isViewingCurrentMembership
				? this.$t('membership.pass.dock.perPeriod')
				: this.$t('membership.common.logUnit');
		},
		purchaseButtonText() {
			if (this.submitting) return this.$t('membership.pass.button.processing');
			if (this.isDowngradeBlocked) return this.$t('membership.pass.button.downgradeBlocked');
			if (this.isStandardToSuperUpgrade) {
				return this.upgradeQuote
					? this.$t('membership.pass.button.confirmUpgrade')
					: this.$t('membership.pass.button.calculating');
			}
			if (this.isViewingCurrentMembership) {
				return this.currentSubscription.auto_renew
					? this.$t('membership.pass.button.turnOffAuto')
					: this.$t('membership.pass.button.turnOnAuto');
			}
			return this.$t('membership.pass.button.activateNow');
		}
	},
	onLoad(options) {
		const requestedTier = options && options.tier === 'super' ? 'super' : 'standard';
		this.memberTier = this.readMembershipTier();
		if (options && options.tier) {
			this.activeIndex = requestedTier === 'super' ? 1 : 0;
		} else if (this.memberTier === 'super') {
			this.activeIndex = 1;
		}
		this.selectedPlanIndex = this.activePass.defaultPlan;
		this.loadMembershipPlans();
	},
	onShow() {
		this.loadMembershipStatus();
	},
	methods: {
		goBack() {
			uni.navigateBack({ delta: 1 });
		},
		handlePassChange(event) {
			const nextIndex = Number(event.detail.current) || 0;
			this.activeIndex = nextIndex;
			this.selectedPlanIndex = this.passes[nextIndex].defaultPlan;
		},
		selectPass(index) {
			if (this.activeIndex === index) return;
			this.activeIndex = index;
			this.selectedPlanIndex = this.passes[index].defaultPlan;
		},
		selectPlan(index) {
			this.selectedPlanIndex = index;
		},
		async loadMembershipPlans() {
			try {
				const serverTiers = await getMembershipPlans(this.$baseUrl);
				serverTiers.forEach((serverTier) => {
					const localTier = this.passes.find((pass) => pass.key === serverTier.key);
					if (!localTier) return;
					serverTier.plans.forEach((serverPlan) => {
						const localKey = serverPlan.billing_cycle === 'monthly' ? 'month' : 'year';
						const localPlan = localTier.plans.find((plan) => plan.key === localKey);
						if (localPlan) localPlan.price = String(serverPlan.cost_log);
					});
				});
			} catch (error) {
				console.log('加载会员方案失败，继续使用本地价格。', error);
			}
		},
		async loadMembershipStatus() {
			try {
				const status = await getMembershipStatus(this.$baseUrl);
				this.currentSubscription = status.subscription || null;
				this.upgradeQuote = status.upgrade_quote || null;
				this.memberTier = status.subscription ? status.subscription.membership_type : '';
				this.logBalance = Number(status.log_balance || 0);
			} catch (error) {
				if (getMembershipErrorMessage(error) !== '请先登录后再操作') {
					console.log('加载会员状态失败。', error);
				}
			}
		},
		showConfirm(options) {
			return new Promise((resolve) => {
				uni.showModal({
					...options,
					success: (result) => resolve(Boolean(result.confirm)),
					fail: () => resolve(false)
				});
			});
		},
		readMembershipTier() {
			let user = null;
			try {
				const uniValue = uni.getStorageSync('LogHomeUserInfo');
				if (uniValue) user = typeof uniValue === 'string' ? JSON.parse(uniValue) : uniValue;
				if (!user && typeof window !== 'undefined') {
					const localValue = window.localStorage.getItem('LogHomeUserInfo');
					if (localValue) user = JSON.parse(localValue);
				}
			} catch (error) {
				user = null;
			}
			if (!user) return '';

			const membership = user.membership && typeof user.membership === 'object' ? user.membership : {};
			const rawLevel = membership.type || membership.level || user.membership_type ||
				user.membership_level || user.member_type || user.vip_level || '';
			const level = String(rawLevel).toLowerCase();
			if (rawLevel === 2 || level === '2' || level === 'super' || level === 'premium' ||
				level === 'super_pass') return 'super';
			if (rawLevel === 1 || level === '1' || level === 'standard' || level === 'pass' ||
				level === 'log_pass') return 'standard';
			return '';
		},
		showRules() {
			uni.navigateTo({ url: '/pages/membership/rules' });
		},
		gotoMembershipTool(type) {
			const routes = {
				redeem: '/pages/membership/redeem',
				gift: '/pages/membership/gift?tier=' + this.activePass.key
			};
			if (!routes[type]) return;
			uni.navigateTo({ url: routes[type] });
		},
		formatMembershipDate(value) {
			if (!value) return '—';
			const date = new Date(value);
			if (Number.isNaN(date.getTime())) return '—';
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		},
		async handlePurchase() {
			if (this.submitting) return;
			if (this.isDowngradeBlocked) {
				uni.showToast({ title: this.$t('membership.pass.toast.downgradeBlocked'), icon: 'none' });
				return;
			}

			if (this.isViewingCurrentMembership) {
				const nextEnabled = !this.currentSubscription.auto_renew;
				const confirmed = await this.showConfirm({
					title: this.$t('membership.pass.renewal.manageTitle'),
					content: nextEnabled
						? this.$t('membership.pass.renewal.onContent', {
							price: this.currentSubscription.renewal_cost_log || this.currentSubscription.cost_log
						})
						: this.$t('membership.pass.renewal.offContent'),
					confirmText: nextEnabled
						? this.$t('membership.pass.renewal.enable')
						: this.$t('membership.pass.renewal.disable')
				});
				if (!confirmed) return;
				this.submitting = true;
				try {
					const data = await updateMembershipAutoRenew(this.$baseUrl, nextEnabled);
					this.currentSubscription = data.subscription;
					uni.showToast({
						title: nextEnabled
							? this.$t('membership.pass.renewal.enabledToast')
							: this.$t('membership.pass.renewal.disabledToast'),
						icon: 'none'
					});
				} catch (error) {
					uni.showToast({ title: getMembershipErrorMessage(error), icon: 'none' });
				} finally {
					this.submitting = false;
				}
				return;
			}

			if (this.isStandardToSuperUpgrade) {
				if (!this.upgradeQuote) {
					uni.showToast({ title: this.$t('membership.pass.upgrade.unavailable'), icon: 'none' });
					return;
				}
				const confirmed = await this.showConfirm({
					title: this.$t('membership.pass.upgrade.confirmTitle'),
					content: this.$t('membership.pass.upgrade.confirmContent', {
						days: this.upgradeQuote.remaining_days,
						cost: this.upgradeQuote.cost_log,
						state: this.upgradeQuote.auto_renew
							? this.$t('membership.pass.upgrade.keepOn')
							: this.$t('membership.pass.upgrade.keepOff')
					}),
					confirmText: this.$t('membership.pass.upgrade.confirm')
				});
				if (!confirmed) return;

				this.submitting = true;
				try {
					const data = await subscribeMembership(this.$baseUrl, {
						membership_type: 'super',
						billing_cycle: this.currentSubscription.billing_cycle,
						auto_renew: Boolean(this.currentSubscription.auto_renew),
						client_request_id: createMembershipRequestId('upgrade')
					});
					this.currentSubscription = data.subscription;
					this.upgradeQuote = null;
					this.memberTier = data.subscription.membership_type;
					this.logBalance = Number(data.log_balance || 0);
					const charged = data.upgrade ? data.upgrade.cost_log : data.subscription.cost_log;
					const redstoneGift = Number(data.redstone_granted || 0);
					uni.showToast({
						title: redstoneGift
							? this.$t('membership.pass.upgrade.successGift', { amount: charged, redstone: redstoneGift })
							: this.$t('membership.pass.upgrade.success', { amount: charged }),
						icon: 'none',
						duration: 2600
					});
				} catch (error) {
					uni.showToast({ title: getMembershipErrorMessage(error), icon: 'none', duration: 2200 });
				} finally {
					this.submitting = false;
				}
				return;
			}

			const autoRenew = this.selectedPlan.key === 'month';
			const confirmed = await this.showConfirm({
				title: this.$t('membership.pass.activate.title', { name: this.$t(this.activePass.nameKey) }),
				content: autoRenew
					? this.$t('membership.pass.activate.contentAuto', { price: this.selectedPlan.price })
					: this.$t('membership.pass.activate.content', { price: this.selectedPlan.price }),
				confirmText: this.$t('membership.pass.activate.confirm')
			});
			if (!confirmed) return;

			this.submitting = true;
			try {
				const data = await subscribeMembership(this.$baseUrl, {
					membership_type: this.activePass.key,
					billing_cycle: this.selectedPlan.key === 'month' ? 'monthly' : 'yearly',
					auto_renew: autoRenew,
					client_request_id: createMembershipRequestId('subscribe')
				});
				this.currentSubscription = data.subscription;
				this.memberTier = data.subscription.membership_type;
				this.logBalance = Number(data.log_balance || 0);
				const redstoneGift = Number(data.redstone_granted || 0);
				uni.showToast({
					title: data.replayed
						? this.$t('membership.pass.activate.processed')
						: (redstoneGift
							? this.$t('membership.pass.activate.successGift', { redstone: redstoneGift })
							: this.$t('membership.pass.activate.success')),
					icon: 'none',
					duration: 2400
				});
			} catch (error) {
				uni.showToast({ title: getMembershipErrorMessage(error), icon: 'none', duration: 2200 });
			} finally {
				this.submitting = false;
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background: #16281c;
}

/* 原木通行证（standard）：绿色系 */
.pass-page {
	--page-bg: #16281c;
	--page-bg-deep: #0d1a13;
	--text-primary: #e6f5ea;
	--text-secondary: #b7cebd;
	--text-muted: #7e9487;
	--accent: #8fd6a2;
	--accent-strong: #4fa96b;
	--accent-soft: rgba(126, 198, 143, 0.14);
	--accent-bright: #c4ead0;
	--panel: rgba(255, 255, 255, 0.065);
	--panel-strong: rgba(255, 255, 255, 0.1);
	--border: rgba(190, 225, 204, 0.14);
	--dock: rgba(13, 26, 19, 0.93);

	position: relative;
	box-sizing: border-box;
	min-height: 100vh;
	padding-bottom: calc(154rpx + var(--loghome-safe-bottom, 0px));
	overflow: hidden;
	color: var(--text-primary);
	background:
		radial-gradient(circle at 82% 7%, rgba(83, 158, 102, 0.2), transparent 28%),
		linear-gradient(155deg, var(--page-bg), var(--page-bg-deep) 72%);
	transition: color 0.35s ease, background 0.35s ease;

	/* 超级原木通行证：深蓝色系 */
	&--super {
		--page-bg: #14243a;
		--page-bg-deep: #09121f;
		--text-primary: #dcebf8;
		--text-secondary: #b9c5d5;
		--text-muted: #7e8da2;
		--accent: #8fc2f0;
		--accent-strong: #4f92cf;
		--accent-soft: rgba(126, 178, 226, 0.14);
		--accent-bright: #a8cdf0;
		--panel: rgba(119, 156, 199, 0.09);
		--panel-strong: rgba(119, 156, 199, 0.14);
		--border: rgba(187, 211, 239, 0.14);
		--dock: rgba(9, 18, 31, 0.94);

		background:
			radial-gradient(circle at 82% 7%, rgba(58, 112, 172, 0.26), transparent 30%),
			linear-gradient(155deg, var(--page-bg), var(--page-bg-deep) 72%);
	}
}

.page-orb {
	position: absolute;
	border-radius: 50%;
	filter: blur(4rpx);
	pointer-events: none;

	&--one {
		right: -180rpx;
		top: 430rpx;
		width: 430rpx;
		height: 430rpx;
		background: rgba(126, 198, 143, 0.05);
	}

	&--two {
		left: -230rpx;
		top: 1120rpx;
		width: 500rpx;
		height: 500rpx;
		background: rgba(105, 158, 216, 0.05);
	}
}

.pass-page--super .page-orb--one {
	background: rgba(90, 150, 210, 0.06);
}

.top-bar {
	position: relative;
	z-index: 5;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	padding: calc(var(--loghome-safe-top, 0px) + 18rpx) 28rpx 12rpx;

	&__button {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72rpx;
		height: 72rpx;
		border: 1rpx solid var(--border);
		border-radius: 50%;
		color: var(--accent);
		background: rgba(255, 255, 255, 0.045);
	}

	&__back {
		box-sizing: border-box;
		width: 20rpx;
		height: 20rpx;
		border-left: 4rpx solid currentColor;
		border-bottom: 4rpx solid currentColor;
		transform: translateX(4rpx) rotate(45deg);
	}

	&__heading {
		flex: 1;
		min-width: 0;
		text-align: center;
	}

	&__title,
	&__subtitle {
		display: block;
	}

	&__title {
		font-size: 30rpx;
		font-weight: 650;
		letter-spacing: 2rpx;
	}

	&__subtitle {
		margin-top: 4rpx;
		font-size: 18rpx;
		color: var(--text-muted);
	}

	&__rules {
		font-size: 21rpx;
		font-weight: 600;
	}
}

.hero-copy {
	position: relative;
	z-index: 2;
	padding: 26rpx 48rpx 18rpx;

	&__eyebrow,
	&__title,
	&__description {
		display: block;
	}

	&__eyebrow {
		font-size: 17rpx;
		font-weight: 700;
		letter-spacing: 6rpx;
		color: var(--accent);
		opacity: 0.72;
	}

	&__title {
		margin-top: 12rpx;
		font-size: 42rpx;
		font-weight: 700;
		letter-spacing: 2rpx;
	}

	&__description {
		margin-top: 8rpx;
		font-size: 22rpx;
		color: var(--text-secondary);
	}
}

.pass-swiper {
	position: relative;
	z-index: 2;
	height: 348rpx;

	swiper-item {
		box-sizing: border-box;
		padding: 8rpx 9rpx 22rpx;
	}
}

.pass-card {
	position: relative;
	box-sizing: border-box;
	height: 100%;
	padding: 26rpx 28rpx 0rpx 28rpx;
	border: 1rpx solid rgba(199, 235, 212, 0.24);
	border-radius: 30rpx;
	overflow: hidden;
	color: #e6f7ec;
	background: linear-gradient(138deg, #3d6b4a 0%, #2a4d38 52%, #1a2f24 100%);
	box-shadow: 0 24rpx 50rpx rgba(0, 0, 0, 0.22);
	transform: scale(0.94);
	opacity: 0.76;
	transition: transform 0.34s ease, opacity 0.34s ease;

	&--active {
		transform: scale(1);
		opacity: 1;
	}

	&--super {
		border-color: rgba(158, 199, 240, 0.32);
		color: #dcebf8;
		background: linear-gradient(138deg, #294a70 0%, #172f4b 52%, #0c1b2d 100%);
	}

	&__shine {
		position: absolute;
		right: -80rpx;
		top: -140rpx;
		width: 360rpx;
		height: 360rpx;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.16), transparent 66%);
	}

	&__rings {
		position: absolute;
		right: -72rpx;
		bottom: -150rpx;
		width: 330rpx;
		height: 330rpx;
		border: 1rpx solid rgba(255, 255, 255, 0.12);
		border-radius: 50%;
		box-shadow: 0 0 0 28rpx rgba(255, 255, 255, 0.025), 0 0 0 62rpx rgba(255, 255, 255, 0.025);
	}

	&__top,
	&__body,
	&__features {
		position: relative;
		z-index: 1;
	}

	&__top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	&__brand {
		display: flex;
		align-items: center;
		min-width: 0;
	}

	&__logo {
		flex-shrink: 0;
		width: 82rpx;
		height: 82rpx;
		margin-right: 16rpx;
		image-rendering: pixelated;
		filter: drop-shadow(0 8rpx 12rpx rgba(0, 0, 0, 0.2));
	}

	&__eyebrow,
	&__name {
		display: block;
	}

	&__eyebrow {
		font-size: 18rpx;
		letter-spacing: 3rpx;
		opacity: 0.68;
	}

	&__name {
		margin-top: 6rpx;
		font-size: 31rpx;
		font-weight: 700;
		white-space: nowrap;
	}

	&__status {
		flex-shrink: 0;
		margin-left: 12rpx;
		padding: 7rpx 13rpx;
		border: 1rpx solid rgba(255, 255, 255, 0.2);
		border-radius: 999rpx;
		font-size: 18rpx;
		background: rgba(255, 255, 255, 0.07);
	}

	&__body {
		margin-top: 30rpx;
	}

	&__slogan,
	&__summary {
		display: block;
	}

	&__slogan {
		font-size: 34rpx;
		font-weight: 650;
		letter-spacing: 1rpx;
	}

	&__summary {
		margin-top: 9rpx;
		font-size: 20rpx;
		opacity: 0.7;
	}

	&__features {
		display: flex;
		align-items: center;
		margin-top: 26rpx;

		text {
			position: relative;
			font-size: 20rpx;
			opacity: 0.88;

			& + text {
				margin-left: 24rpx;

				&::before {
					content: '';
					position: absolute;
					left: -13rpx;
					top: 50%;
					width: 3rpx;
					height: 3rpx;
					border-radius: 50%;
					background: currentColor;
				}
			}
		}
	}
}

.swiper-indicator {
	position: relative;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 48rpx;
	color: var(--text-muted);

	&__dot {
		width: 10rpx;
		height: 10rpx;
		margin-right: 9rpx;
		border-radius: 999rpx;
		background: rgba(255, 255, 255, 0.18);
		transition: width 0.3s ease, background 0.3s ease;

		&--active {
			width: 30rpx;
			background: var(--accent);
		}
	}

	> text {
		margin-left: 9rpx;
		font-size: 19rpx;
	}
}

.page-content {
	position: relative;
	z-index: 2;
	padding: 18rpx 32rpx 0;
	animation: content-enter 0.34s ease both;
}

.panel {
	border: 1rpx solid var(--border);
	border-radius: 28rpx;
	background: linear-gradient(145deg, var(--panel-strong), var(--panel));
	box-shadow: 0 18rpx 40rpx rgba(0, 0, 0, 0.12);
	backdrop-filter: blur(18rpx);
}

.panel-heading {
	display: flex;
	align-items: center;
	padding: 26rpx 26rpx 22rpx;

	&__icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 66rpx;
		height: 66rpx;
		border-radius: 20rpx;
		background: var(--accent-soft);

		image {
			width: 54rpx;
			height: 54rpx;
			image-rendering: pixelated;
		}
	}

	&__copy {
		flex: 1;
		min-width: 0;
		margin-left: 16rpx;
	}

	&__title,
	&__subtitle {
		display: block;
	}

	&__title {
		font-size: 29rpx;
		font-weight: 650;
	}

	&__subtitle {
		margin-top: 4rpx;
		font-size: 18rpx;
		color: var(--text-muted);
	}

	&__count {
		flex-shrink: 0;
		padding: 6rpx 12rpx;
		border-radius: 999rpx;
		font-size: 18rpx;
		color: var(--accent);
		background: var(--accent-soft);
	}
}

.benefit-list {
	padding: 0 24rpx 15rpx;
}

.benefit-item {
	display: flex;
	align-items: center;
	min-height: 96rpx;
	border-top: 1rpx solid var(--border);

	&__check {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38rpx;
		height: 38rpx;
		border-radius: 50%;
		font-size: 21rpx;
		font-weight: 700;
		color: var(--page-bg-deep);
		background: var(--accent);
	}

	&__copy {
		flex: 1;
		min-width: 0;
		padding: 16rpx 14rpx;
	}

	&__title,
	&__description {
		display: block;
	}

	&__title {
		font-size: 24rpx;
		font-weight: 600;
	}

	&__description {
		margin-top: 5rpx;
		font-size: 19rpx;
		line-height: 1.45;
		color: var(--text-muted);
	}

	&__tag {
		flex-shrink: 0;
		padding: 5rpx 10rpx;
		border-radius: 8rpx;
		font-size: 17rpx;
		font-weight: 600;
		color: var(--accent);
		background: var(--accent-soft);
	}
}

.purchase-section {
	margin-top: 34rpx;
}

.section-heading {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	padding: 0 4rpx 15rpx;

	&__title,
	&__subtitle {
		display: block;
	}

	&__title {
		font-size: 29rpx;
		font-weight: 650;
	}

	&__subtitle {
		margin-top: 5rpx;
		font-size: 17rpx;
		color: var(--text-muted);
	}

	&__tip {
		flex-shrink: 0;
		font-size: 18rpx;
		color: var(--accent);
	}
}

.plan-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 14rpx;
}

.upgrade-quote,
.renewal-status {
	box-sizing: border-box;
	border: 1rpx solid var(--border);
	border-radius: 24rpx;
	background: linear-gradient(145deg, var(--panel-strong), var(--panel));
	box-shadow: 0 14rpx 30rpx rgba(0, 0, 0, 0.1);
}

.upgrade-quote {
	padding: 25rpx;

	&__top {
		display: flex;
		align-items: center;
	}

	&__badge {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 62rpx;
		height: 62rpx;
		border-radius: 19rpx;
		font-size: 20rpx;
		font-weight: 800;
		letter-spacing: 1rpx;
		color: var(--page-bg-deep);
		background: linear-gradient(135deg, var(--accent-bright), var(--accent-strong));
	}

	&__copy {
		flex: 1;
		min-width: 0;
		margin-left: 16rpx;
	}

	&__title,
	&__description,
	&__formula,
	&__value {
		display: block;
	}

	&__title {
		font-size: 25rpx;
		font-weight: 650;
	}

	&__description {
		margin-top: 5rpx;
		font-size: 18rpx;
		color: var(--text-muted);
	}

	&__details {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10rpx;
		margin-top: 22rpx;

		> view {
			min-width: 0;
			padding: 15rpx 13rpx;
			border-radius: 15rpx;
			font-size: 16rpx;
			color: var(--text-muted);
			background: rgba(0, 0, 0, 0.1);
		}
	}

	&__value {
		margin-top: 6rpx;
		overflow: hidden;
		font-size: 19rpx;
		font-weight: 600;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--text-primary);
	}

	&__formula {
		margin-top: 15rpx;
		font-size: 17rpx;
		line-height: 1.5;
		color: var(--accent);
	}

	&__loading {
		padding: 30rpx 8rpx;
		font-size: 20rpx;
		text-align: center;
		color: var(--text-muted);
	}
}

.renewal-status {
	display: flex;
	align-items: center;
	min-height: 132rpx;
	padding: 22rpx 24rpx;

	&__icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 58rpx;
		height: 58rpx;
		border-radius: 18rpx;
		font-size: 25rpx;
		font-weight: 700;
		color: var(--text-muted);
		background: rgba(255, 255, 255, 0.055);

		&--enabled {
			color: #12271b;
			background: #75ce95;
		}
	}

	&__copy {
		flex: 1;
		min-width: 0;
		margin-left: 18rpx;
	}

	&__title,
	&__description {
		display: block;
	}

	&__title {
		font-size: 25rpx;
		font-weight: 650;
	}

	&__description {
		margin-top: 7rpx;
		font-size: 18rpx;
		line-height: 1.5;
		color: var(--text-muted);
	}
}

.plan-card {
	position: relative;
	box-sizing: border-box;
	min-height: 210rpx;
	padding: 24rpx 22rpx 20rpx;
	border: 1rpx solid var(--border);
	border-radius: 24rpx;
	background: var(--panel);
	transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;

	&--selected {
		border-color: var(--accent);
		background: var(--accent-soft);
		box-shadow: inset 0 0 0 1rpx var(--accent-soft), 0 14rpx 28rpx rgba(0, 0, 0, 0.12);
		transform: translateY(-2rpx);
	}

	&__tag {
		position: absolute;
		right: 14rpx;
		top: 14rpx;
		padding: 5rpx 9rpx;
		border-radius: 7rpx;
		font-size: 16rpx;
		font-weight: 600;
		color: var(--page-bg-deep);
		background: var(--accent);
	}

	&__name,
	&__unit,
	&__note {
		display: block;
	}

	&__name {
		font-size: 25rpx;
		font-weight: 600;
	}

	&__price {
		display: flex;
		align-items: baseline;
		margin-top: 17rpx;
		color: var(--accent);
	}

	&__currency {
		margin-left: 8rpx;
		font-size: 18rpx;
		font-weight: 500;
	}

	&__currency-icon {
		flex-shrink: 0;
		width: 28rpx;
		height: 28rpx;
	}

	&__number {
		margin-left: 6rpx;
		font-size: 38rpx;
		font-weight: 700;
		letter-spacing: 1rpx;
	}

	&__unit {
		margin-top: 5rpx;
		font-size: 18rpx;
		color: var(--text-secondary);
	}

	&__note {
		margin-top: 9rpx;
		font-size: 17rpx;
		color: var(--text-muted);
	}
}

.more-panel {
	margin-top: 26rpx;
	padding: 24rpx;

	&__heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__title {
		font-size: 27rpx;
		font-weight: 600;
	}

	&__options {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10rpx;
		margin-top: 20rpx;
	}
}

.more-option {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 112rpx;
	border-radius: 18rpx;
	font-size: 18rpx;
	color: var(--text-secondary);
	background: rgba(255, 255, 255, 0.035);

	&__icon {
		display: block;
		width: 42rpx;
		height: 42rpx;
		margin-bottom: 9rpx;
	}
}

.agreement {
	padding: 28rpx 10rpx 10rpx;
	font-size: 17rpx;
	line-height: 1.55;
	text-align: center;
	color: var(--text-muted);
}

.purchase-dock {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 20;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	padding: 18rpx 30rpx calc(18rpx + var(--loghome-safe-bottom, 0px));
	border-top: 1rpx solid var(--border);
	background: var(--dock);
	box-shadow: 0 -12rpx 36rpx rgba(0, 0, 0, 0.22);
	backdrop-filter: blur(22rpx);

	&__copy {
		flex: 1;
		min-width: 0;
	}

	&__label {
		display: block;
		font-size: 19rpx;
		color: var(--text-secondary);
	}

	&__price {
		display: flex;
		align-items: baseline;
		margin-top: 2rpx;
		font-size: 21rpx;
		color: var(--accent);
	}

	&__currency-icon {
		flex-shrink: 0;
		align-self: center;
		width: 30rpx;
		height: 30rpx;
	}

	&__number {
		margin-left: 6rpx;
		font-size: 34rpx;
		font-weight: 700;
	}

	&__unit {
		margin-left: 7rpx;
		font-size: 18rpx;
		font-weight: 500;
	}

	&__button {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 286rpx;
		height: 82rpx;
		border-radius: 999rpx;
		font-size: 27rpx;
		font-weight: 700;
		letter-spacing: 1rpx;
		color: var(--page-bg-deep);
		background: linear-gradient(100deg, var(--accent-bright), var(--accent-strong));
		box-shadow: 0 12rpx 26rpx rgba(0, 0, 0, 0.18);

		&--disabled {
			color: var(--text-muted);
			background: rgba(255, 255, 255, 0.09);
			box-shadow: none;
		}
	}
}

@keyframes content-enter {
	from {
		opacity: 0;
		transform: translateY(12rpx);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
