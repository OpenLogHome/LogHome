<template>
	<view class="log-guide" :class="{ 'log-guide--dark': isDarkMode }">
		<view class="guide-nav">
			<button class="back-button" aria-label="返回" @click="goBack"><uni-icons type="back" size="26rpx" :color="isDarkMode ? '#eee8dd' : '#403a31'" /></button>
			<text class="nav-title">如何获取原木</text>
			<view class="nav-spacer"></view>
		</view>
		<scroll-view class="guide-scroll" scroll-y :show-scrollbar="false">
		<view class="guide-body">
			<view class="guide-intro">
				<text class="eyebrow">原木娘的小课堂</text>
				<text class="intro-title">攒一点原木，为喜欢的作品加油</text>
				<text class="intro-copy">种一棵树、补充余额，或参与社区活动，找到适合你的获取方式。</text>
				<image class="guide-illustration" src="/static/images/get-logs-guide.png" mode="aspectFit" aria-label="原木娘种树、充值和参与社区活动的配图" />
				<view class="illustration-labels"><text>种树收获</text><text>原木充值</text><text>活动奖励</text></view>
			</view>

			<view class="channel-card" v-for="channel in channels" :key="channel.id" :class="'channel-' + channel.id">
				<view class="channel-heading">
					<text class="channel-number">{{ channel.number }}</text>
					<text class="channel-title">{{ channel.title }}</text>
					<text class="channel-tag">{{ channel.tag }}</text>
				</view>
				<text class="channel-description">{{ channel.description }}</text>
				<view class="channel-steps"><text v-for="(step, index) in channel.steps" :key="step">{{ index + 1 }}. {{ step }}</text></view>
				<button class="channel-action" @click="openChannel(channel)"><text>{{ channel.action }}</text><uni-icons type="right" size="26rpx" :color="isDarkMode ? '#e8e0d1' : '#526846'" /></button>
			</view>

			<view class="guide-note">
				<image src="/static/resources/log.png" class="note-log" mode="aspectFit" />
				<view><text class="note-title">把原木送给喜欢的创作者</text><text class="note-copy">获取原木后，回到作品页选择礼物，就能为喜欢的作品打赏。树场收益、充值额度及活动奖励以对应页面说明为准。</text></view>
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
					id: 'tree', number: '01', title: '原木树场种树', tag: '日常积累',
					description: '从一棵小树苗开始，在自己的树场里培育树木，成熟后收获原木。',
					steps: ['进入原木树场，种下树苗', '根据树场提示培育树木，等待成熟', '收获树木，原木会加入你的余额'],
					action: '去树场种树', url: '/pages/treePlant/treeplant'
				},
				{
					id: 'recharge', number: '02', title: '原木充值', tag: '直接补充',
					description: '想及时支持喜欢的作品，可以通过充值补充原木余额。',
					steps: ['进入充值页面，选择合适的原木额度', '确认订单并按照页面提示完成支付', '支付成功后，查看原木余额及订单记录', '你的充值也将被用于社区维护与运营'],
					action: '前往原木充值', url: '/pages/payments/recharge'
				},
				{
					id: 'activity', number: '03', title: '参与社区活动', tag: '一起参与',
					description: '关注社区活动公告，参与设有原木奖励的活动，收获创作与交流的乐趣。',
					steps: ['查看活动消息，了解正在开展的活动', '阅读参与条件、截止时间及奖励说明', '按照活动规则参与，奖励以活动公告为准'],
					action: '查看活动消息', url: '/pages/community/activityMessages'
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
