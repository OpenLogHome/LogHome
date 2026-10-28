<template>
	<view class="log-guide" :class="{ 'log-guide--dark': isDarkMode }">
		<view class="guide-nav">
			<button class="back-button" :aria-label="$t('payments.logs.back')" @click="goBack"><uni-icons type="back" size="26rpx" :color="isDarkMode ? '#eee8dd' : '#403a31'" /></button>
			<text class="nav-title">{{ $t('payments.logs.title') }}</text>
			<view class="nav-spacer"></view>
		</view>
		<scroll-view class="guide-scroll" scroll-y :show-scrollbar="false">
		<view class="guide-body">
			<view class="guide-intro">
				<text class="eyebrow">{{ $t('payments.logs.eyebrow') }}</text>
				<text class="intro-title">{{ $t('payments.logs.introTitle') }}</text>
				<text class="intro-copy">{{ $t('payments.logs.introCopy') }}</text>
				<image class="guide-illustration" src="/static/images/get-logs-guide.png" mode="aspectFit" :aria-label="$t('payments.logs.illustrationAlt')" />
				<view class="illustration-labels"><text>{{ $t('payments.logs.labelHarvest') }}</text><text>{{ $t('payments.logs.labelTopUp') }}</text><text>{{ $t('payments.logs.labelRewards') }}</text></view>
			</view>

			<view class="channel-card" v-for="channel in channels" :key="channel.id" :class="'channel-' + channel.id">
				<view class="channel-heading">
					<text class="channel-number">{{ channel.number }}</text>
					<text class="channel-title">{{ $t(channel.titleKey) }}</text>
					<text class="channel-tag">{{ $t(channel.tagKey) }}</text>
				</view>
				<text class="channel-description">{{ $t(channel.descriptionKey) }}</text>
				<view class="channel-steps"><text v-for="(stepKey, index) in channel.stepKeys" :key="stepKey">{{ index + 1 }}. {{ $t(stepKey) }}</text></view>
				<button class="channel-action" @click="openChannel(channel)"><text>{{ $t(channel.actionKey) }}</text><uni-icons type="right" size="26rpx" :color="isDarkMode ? '#e8e0d1' : '#526846'" /></button>
			</view>

			<view class="guide-note">
				<image src="/static/resources/log.png" class="note-log" mode="aspectFit" />
				<view><text class="note-title">{{ $t('payments.logs.noteTitle') }}</text><text class="note-copy">{{ $t('payments.logs.noteCopy') }}</text></view>
			</view>
		</view>
		</scroll-view>
	</view>
</template>

<script>
import darkModeMixin from '@/mixins/dark-mode.js'

export default {
	mixins: [darkModeMixin],
	data() {
		return {
			channels: [
				{
					id: 'tree', number: '01',
					titleKey: 'payments.logs.tree.title', tagKey: 'payments.logs.tree.tag',
					descriptionKey: 'payments.logs.tree.description',
					stepKeys: ['payments.logs.tree.step1', 'payments.logs.tree.step2', 'payments.logs.tree.step3'],
					actionKey: 'payments.logs.tree.action', url: '/pages/treePlant/treeplant'
				},
				{
					id: 'recharge', number: '02',
					titleKey: 'payments.logs.recharge.title', tagKey: 'payments.logs.recharge.tag',
					descriptionKey: 'payments.logs.recharge.description',
					stepKeys: ['payments.logs.recharge.step1', 'payments.logs.recharge.step2', 'payments.logs.recharge.step3', 'payments.logs.recharge.step4'],
					actionKey: 'payments.logs.recharge.action', url: '/pages/payments/recharge'
				},
				{
					id: 'activity', number: '03',
					titleKey: 'payments.logs.activity.title', tagKey: 'payments.logs.activity.tag',
					descriptionKey: 'payments.logs.activity.description',
					stepKeys: ['payments.logs.activity.step1', 'payments.logs.activity.step2', 'payments.logs.activity.step3'],
					actionKey: 'payments.logs.activity.action', url: '/pages/community/activityMessages'
				}
			]
		};
	},
	onUnload() {
		const channel = this.getOpenerEventChannel();
		if (channel && channel.emit) channel.emit('log-guide-return');
	},
	methods: {
		goBack() { uni.navigateBack(); },
		openChannel(channel) { uni.navigateTo({ url: channel.url }); }
	}
}
</script>

<style scoped lang="scss">
.log-guide {
	--guide-bg: #ffffff;
	--guide-text: #38382f;
	--guide-muted: #737669;
	--guide-border: #e5e9de;
	--guide-card: #f7f9f3;
	--guide-accent: #526846;
	--guide-badge: #e8eedf;
	display: flex;
	flex-direction: column;
	height: 100vh;
	height: 100dvh;
	min-height: 0;
	overflow: hidden;
	box-sizing: border-box;
	background: var(--guide-bg);
	color: var(--guide-text);
	font-size: 26rpx;
	line-height: 1.7;
	&--dark {
		--guide-bg: #20231e;
		--guide-text: #eee8dd;
		--guide-muted: #b8bcaf;
		--guide-border: #3c4435;
		--guide-card: #2a3025;
		--guide-accent: #b6cd9e;
		--guide-badge: #394630;
	}
}
.guide-nav {
	flex-shrink: 0;
	box-sizing: border-box;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: calc(12rpx + var(--loghome-safe-top, 0rpx)) 20rpx 12rpx;
	background: var(--guide-bg);
	border-bottom: 1rpx solid var(--guide-border);
}
.back-button, .nav-spacer { width: 64rpx; height: 64rpx; flex-shrink: 0; }
.back-button { display: flex; align-items: center; justify-content: center; margin: 0; padding: 0; background: transparent; border-radius: 0; &::after { border: 0; } }
.nav-title { font-size: 26rpx; font-weight: 700; }
.guide-scroll { flex: 1; height: 0; min-height: 0; width: 100%; }
.guide-body { box-sizing: border-box; padding: 32rpx 28rpx calc(40rpx + var(--loghome-safe-bottom, 0rpx)); }
.guide-intro { margin-bottom: 32rpx; }
.eyebrow { display: block; color: var(--guide-accent); font-weight: 600; margin-bottom: 12rpx; }
.intro-title { display: block; font-weight: 800; margin-bottom: 12rpx; }
.intro-copy { display: block; color: var(--guide-muted); }
.guide-illustration { display: block; width: 100%; height: 240rpx; margin-top: 20rpx; border-radius: 20rpx; background: #fffaf0; }
.illustration-labels { display: flex; justify-content: space-around; margin-top: 12rpx; color: var(--guide-accent); font-weight: 600; }
.channel-card { margin-bottom: 24rpx; padding: 26rpx; border: 1rpx solid var(--guide-border); border-radius: 20rpx; background: var(--guide-card); }
.channel-heading { display: flex; align-items: center; flex-wrap: wrap; gap: 12rpx; margin-bottom: 16rpx; }
.channel-number { display: inline-flex; align-items: center; justify-content: center; width: 48rpx; height: 48rpx; flex-shrink: 0; border-radius: 8rpx; background: var(--guide-badge); color: var(--guide-accent); font-weight: 800; }
.channel-title { font-weight: 700; }
.channel-tag { margin-left: auto; color: var(--guide-muted); }
.channel-description { display: block; }
.channel-steps { display: flex; flex-direction: column; gap: 8rpx; margin: 18rpx 0 22rpx; color: var(--guide-muted); }
.channel-action { display: flex; align-items: center; justify-content: space-between; width: 100%; margin: 0; padding: 12rpx 18rpx; min-height: 76rpx; font-size: 26rpx; line-height: 1.5; font-weight: 600; color: var(--guide-accent); background: var(--guide-bg); border-radius: 12rpx; &::after { border: 1rpx solid var(--guide-border); border-radius: 12rpx; } }
.channel-action:active { opacity: 0.75; }
.guide-note { display: flex; gap: 16rpx; padding: 12rpx 8rpx; }
.note-log { width: 40rpx; height: 40rpx; margin-top: 4rpx; flex-shrink: 0; image-rendering: pixelated; }
.note-title { display: block; font-weight: 600; margin-bottom: 8rpx; }
.note-copy { display: block; color: var(--guide-muted); }
</style>
