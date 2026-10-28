<template>
	<view class="rules-page">
		<view class="rules-glow rules-glow--one"></view>
		<view class="rules-glow rules-glow--two"></view>

		<view class="rules-header">
			<view class="rules-header__back" @tap="goBack"><view class="rules-header__back-icon"></view></view>
			<text class="rules-header__title">{{ $t('membership.rules.title') }}</text>
			<view class="rules-header__spacer"></view>
		</view>

		<view class="rules-content">
			<view class="rules-hero">
				<view class="rules-hero__marks">
					<image src="/static/membership/loghome-pass.png" mode="aspectFit"></image>
					<image src="/static/icons/redstone.svg" mode="aspectFit"></image>
				</view>
				<text class="rules-hero__eyebrow">LOGHOME PASS · SERVICE RULES</text>
				<text class="rules-hero__title">{{ $t('membership.rules.heroTitle') }}</text>
				<text class="rules-hero__description">{{ $t('membership.rules.heroDesc') }}</text>
				<text class="rules-hero__date">{{ $t('membership.rules.heroDate') }}</text>
			</view>

			<view class="rules-section">
				<view class="rules-section__heading"><text>01</text><view><text>{{ $t('membership.rules.sections.plans.title') }}</text><text>{{ $t('membership.rules.sections.plans.subtitle') }}</text></view></view>
				<view class="price-grid">
					<view class="price-card">
						<image src="/static/membership/loghome-pass.png" mode="aspectFit"></image>
						<text class="price-card__name">{{ $t('membership.pass.tier.standard.name') }}</text>
						<text>{{ $t('membership.rules.sections.plans.monthly') }}</text><text>{{ $t('membership.rules.sections.plans.annual') }}</text>
					</view>
					<view class="price-card price-card--super">
						<image src="/static/membership/loghome-super-pass.png" mode="aspectFit"></image>
						<text class="price-card__name">{{ $t('membership.pass.tier.super.name') }}</text>
						<text>{{ $t('membership.rules.sections.plans.superMonthly') }}</text><text>{{ $t('membership.rules.sections.plans.superAnnual') }}</text>
					</view>
				</view>
				<view class="rule-list">
					<view><text>•</text><text>{{ $t('membership.rules.sections.plans.rule1') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.plans.rule2') }}</text></view>
				</view>
			</view>

			<view class="rules-section">
				<view class="rules-section__heading"><text>02</text><view><text>{{ $t('membership.rules.sections.upgrade.title') }}</text><text>{{ $t('membership.rules.sections.upgrade.subtitle') }}</text></view></view>
				<view class="rule-list">
					<view><text>•</text><text>{{ $t('membership.rules.sections.upgrade.rule1') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.upgrade.rule2') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.upgrade.rule3') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.upgrade.rule4') }}</text></view>
				</view>
			</view>

			<view class="rules-section">
				<view class="rules-section__heading"><text>03</text><view><text>{{ $t('membership.rules.sections.grant.title') }}</text><text>{{ $t('membership.rules.sections.grant.subtitle') }}</text></view></view>
				<view class="grant-grid">
					<view><text>{{ $t('membership.rules.sections.grant.regular') }}</text><text>6</text><text>{{ $t('membership.rules.sections.grant.perMonth') }}</text></view>
					<view><text>{{ $t('membership.pass.tier.standard.name') }}</text><text>100</text><text>{{ $t('membership.rules.sections.grant.perCycle') }}</text></view>
					<view><text>{{ $t('membership.rules.sections.grant.superShort') }}</text><text>200</text><text>{{ $t('membership.rules.sections.grant.perCycle') }}</text></view>
				</view>
				<view class="rule-list">
					<view><text>•</text><text>{{ $t('membership.rules.sections.grant.rule1') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.grant.rule2') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.grant.rule3') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.grant.rule4') }}</text></view>
				</view>
			</view>

			<view class="rules-section rules-section--redstone">
				<view class="rules-section__heading"><text>04</text><view><text>{{ $t('membership.rules.sections.exchange.title') }}</text><text>{{ $t('membership.rules.sections.exchange.subtitle') }}</text></view></view>
				<view class="exchange-rate"><image src="/static/resources/log.png" mode="aspectFit"></image><text>{{ $t('membership.rules.sections.exchange.tenLog') }}</text><text>=</text><image src="/static/icons/redstone.svg" mode="aspectFit"></image><text>{{ $t('membership.rules.sections.exchange.oneRedstone') }}</text></view>
				<view class="usage-list">
					<view><text>{{ $t('membership.rules.sections.exchange.askTitle') }}</text><text>{{ $t('membership.rules.sections.exchange.askCost') }}</text></view>
					<view><text>{{ $t('membership.rules.sections.exchange.bipaoTitle') }}</text><text>{{ $t('membership.rules.sections.exchange.bipaoCost') }}</text></view>
					<view><text>{{ $t('membership.rules.sections.exchange.correctionTitle') }}</text><text>{{ $t('membership.rules.sections.exchange.correctionCost') }}</text></view>
				</view>
				<view class="rule-list">
					<view><text>•</text><text>{{ $t('membership.rules.sections.exchange.rule1') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.exchange.rule2') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.exchange.rule3') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.exchange.rule4') }}</text></view>
				</view>
				<view v-if="aiAssistanceEnabled" class="section-link" @tap="gotoRedstone"><text>{{ $t('membership.rules.sections.exchange.goto') }}</text><text class="ui-chevron" aria-hidden="true"></text></view>
			</view>

			<view class="rules-section">
				<view class="rules-section__heading"><text>05</text><view><text>{{ $t('membership.rules.sections.gifts.title') }}</text><text>{{ $t('membership.rules.sections.gifts.subtitle') }}</text></view></view>
				<view class="rule-list">
					<view><text>•</text><text>{{ $t('membership.rules.sections.gifts.rule1') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.gifts.rule2') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.gifts.rule3') }}</text></view>
				</view>
			</view>

			<view class="rules-section">
				<view class="rules-section__heading"><text>06</text><view><text>{{ $t('membership.rules.sections.exclusive.title') }}</text><text>{{ $t('membership.rules.sections.exclusive.subtitle') }}</text></view></view>
				<view class="rule-list">
					<view><text>•</text><text>{{ $t('membership.rules.sections.exclusive.rule1') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.exclusive.rule2') }}</text></view>
					<view><text>•</text><text>{{ $t('membership.rules.sections.exclusive.rule3') }}</text></view>
				</view>
			</view>

			<view class="rules-note">{{ $t('membership.rules.note') }}</view>
		</view>
	</view>
</template>

<script>
export default {
	methods: {
		goBack() { uni.navigateBack({ delta: 1 }); },
		gotoRedstone() { uni.navigateTo({ url: '/pages/redstone/index' }); },
	},
};
</script>

<style scoped lang="scss">
page { background: #120d0b; }
.rules-page { --accent: #efc57e; --text: #fff3df; --secondary: #cbb8a0; --muted: #927f6d; --border: rgba(255,225,181,.13); position: relative; box-sizing: border-box; min-height: 100vh; overflow: hidden; color: var(--text); background: radial-gradient(circle at 84% 3%, rgba(172,105,48,.2), transparent 27%), linear-gradient(158deg,#241813,#120d0b 70%); }
.rules-glow { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(8rpx); }
.rules-glow--one { top: 650rpx; right: -180rpx; width: 420rpx; height: 420rpx; background: rgba(205,139,67,.055); }
.rules-glow--two { top: 1900rpx; left: -230rpx; width: 480rpx; height: 480rpx; background: rgba(127,70,40,.08); }
.rules-header { position: relative; z-index: 3; display: flex; align-items: center; box-sizing: border-box; padding: calc(var(--loghome-safe-top, 0px) + 18rpx) 28rpx 14rpx; }
.rules-header__back,.rules-header__spacer { flex-shrink: 0; width: 72rpx; height: 72rpx; }
.rules-header__back { display: flex; align-items: center; justify-content: center; border: 1rpx solid var(--border); border-radius: 50%; color: var(--accent); background: rgba(255,255,255,.04); }
.rules-header__back-icon { box-sizing: border-box; width: 20rpx; height: 20rpx; border-left: 4rpx solid currentColor; border-bottom: 4rpx solid currentColor; transform: translateX(4rpx) rotate(45deg); }
.rules-header__title { flex: 1; min-width: 0; font-size: 30rpx; font-weight: 680; letter-spacing: 2rpx; text-align: center; }
.rules-content { position: relative; z-index: 2; padding: 14rpx 30rpx calc(52rpx + var(--loghome-safe-bottom, 0px)); }
.rules-hero { position: relative; padding: 30rpx; overflow: hidden; border: 1rpx solid rgba(243,203,134,.18); border-radius: 28rpx; background: linear-gradient(135deg,rgba(111,67,33,.7),rgba(48,31,22,.92)); box-shadow: 0 22rpx 46rpx rgba(0,0,0,.2); }
.rules-hero__marks { display: flex; align-items: center; gap: 9rpx; }
.rules-hero__marks image { width: 58rpx; height: 58rpx; image-rendering: pixelated; }
.rules-hero__marks image:last-child { width: 47rpx; height: 47rpx; }
.rules-hero__eyebrow,.rules-hero__title,.rules-hero__description,.rules-hero__date { display: block; }
.rules-hero__eyebrow { margin-top: 20rpx; font-size: 15rpx; letter-spacing: 3rpx; color: #e5b96f; }
.rules-hero__title { margin-top: 9rpx; font-size: 36rpx; font-weight: 760; }
.rules-hero__description { margin-top: 12rpx; font-size: 21rpx; line-height: 1.65; color: var(--secondary); }
.rules-hero__date { margin-top: 20rpx; font-size: 17rpx; color: var(--muted); }
.rules-section { margin-top: 18rpx; padding: 24rpx; border: 1rpx solid var(--border); border-radius: 24rpx; background: rgba(255,255,255,.05); }
.rules-section--redstone { background: linear-gradient(145deg,rgba(106,34,35,.22),rgba(255,255,255,.045)); }
.rules-section__heading { display: flex; align-items: center; padding-bottom: 19rpx; border-bottom: 1rpx solid var(--border); }
.rules-section__heading > text { display: flex; align-items: center; justify-content: center; width: 48rpx; height: 48rpx; border-radius: 14rpx; font-size: 18rpx; font-weight: 750; color: #2c1c12; background: var(--accent); }
.rules-section__heading > view { margin-left: 14rpx; }
.rules-section__heading > view text { display: block; }
.rules-section__heading > view text:first-child { font-size: 25rpx; font-weight: 680; }
.rules-section__heading > view text:last-child { margin-top: 4rpx; font-size: 17rpx; color: var(--muted); }
.price-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11rpx; margin-top: 18rpx; }
.price-card { display: flex; flex-direction: column; padding: 17rpx; border-radius: 18rpx; background: rgba(115,70,37,.23); }
.price-card--super { background: rgba(44,74,108,.25); }
.price-card image { width: 48rpx; height: 48rpx; }
.price-card text { margin-top: 7rpx; font-size: 18rpx; color: var(--secondary); }
.price-card__name { margin: 9rpx 0 2rpx !important; font-size: 22rpx !important; font-weight: 650; color: var(--text) !important; }
.rule-list { margin-top: 16rpx; }
.rule-list > view { display: flex; align-items: flex-start; margin-top: 13rpx; font-size: 20rpx; line-height: 1.65; color: var(--secondary); }
.rule-list > view > text:first-child { flex-shrink: 0; margin-right: 10rpx; color: var(--accent); }
.grant-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8rpx; margin-top: 18rpx; }
.grant-grid > view { padding: 14rpx 6rpx; border-radius: 16rpx; text-align: center; background: rgba(0,0,0,.16); }
.grant-grid text { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 16rpx; color: var(--muted); }
.grant-grid text:nth-child(2) { margin: 7rpx 0 3rpx; font-size: 29rpx; font-weight: 760; color: #efc57e; }
.exchange-rate { display: flex; align-items: center; justify-content: center; gap: 9rpx; margin-top: 18rpx; padding: 16rpx; border-radius: 17rpx; font-size: 22rpx; font-weight: 650; color: #f3d39a; background: rgba(0,0,0,.17); }
.exchange-rate image { width: 34rpx; height: 34rpx; image-rendering: pixelated; }
.usage-list { margin-top: 13rpx; }
.usage-list > view { display: flex; align-items: center; justify-content: space-between; min-height: 62rpx; border-bottom: 1rpx solid var(--border); font-size: 19rpx; color: var(--secondary); }
.usage-list > view text:last-child { margin-left: 18rpx; text-align: right; color: #e8bc76; }
.section-link { display: flex; align-items: center; justify-content: space-between; margin-top: 18rpx; padding: 16rpx 2rpx 2rpx; border-top: 1rpx solid var(--border); font-size: 20rpx; color: var(--accent); }
.section-link text:last-child { font-size: 31rpx; }
.rules-note { margin-top: 20rpx; padding: 0 12rpx; font-size: 17rpx; line-height: 1.65; text-align: center; color: var(--muted); }
.ui-chevron { display: inline-block; flex: none; width: 10rpx; height: 10rpx; border-top: 2rpx solid currentColor; border-right: 2rpx solid currentColor; transform: rotate(45deg); }
</style>
