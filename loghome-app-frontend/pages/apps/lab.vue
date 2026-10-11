<template>
	<view class="outer" v-dark>
		<view class="content">
			<view class="header">
				<view class="icon-wrap"><image class="icon" src="/static/icons/lab.svg" mode="aspectFit" /></view>
				<view class="header-copy">
					<view class="title">{{ $t('me.service.labPage.title') }}</view>
					<view class="desc">{{ $t('me.service.labPage.desc') }}</view>
				</view>
			</view>
			<view class="list">
				<navigator url="./miniapp?id=log-defence">
					<view class="li">
						<view class="li-icon">
							<img src="../../static/icons/enderman.png"></img>
						</view>
						<view class="li-main">
							<view class="li-title">{{ $t('me.service.labGame') }}</view>
							<view class="li-sub">{{ $t('me.labGamePage.intro') }}</view>
						</view>
						<view class="to"><text class="ui-chevron" aria-hidden="true"></text></view>
					</view>
				</navigator>
			</view>
			<view class="hint">{{ $t('me.service.labPage.hint') }}</view>
		</view>
	</view>
</template>

<script>
import darkModeMixin from '@/mixins/dark-mode.js'

export default {
	mixins: [darkModeMixin],
	data() { return {} },
	methods: {}
}
</script>

<style lang="scss" scoped>
.outer {
	min-height: 100vh;
	background: #ffffff;
	font-size: 26rpx;
	&.dark-mode { background: #1c211c; }
}
.content {
	box-sizing: border-box;
	width: 100%;
	max-width: 750rpx;
	margin: 0 auto;
	padding: 32rpx 28rpx calc(40rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0rpx)));
}
.header {
	display: flex;
	align-items: center;
	gap: 24rpx;
	padding: 28rpx 24rpx;
	margin-bottom: 28rpx;
	border-radius: 24rpx;
	background: linear-gradient(125deg, #faf6ec, #f0f6e9);
	.dark-mode & { background: linear-gradient(125deg, #363126, #293729); }
}
.icon-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100rpx;
	height: 100rpx;
	flex-shrink: 0;
	background: rgba(255, 255, 255, 0.65);
	border-radius: 20rpx;
	.dark-mode & { background: rgba(255, 255, 255, 0.06); }
}
.icon { width: 76rpx; height: 76rpx; image-rendering: pixelated; }
.header-copy { flex: 1; min-width: 0; }
.title, .li-title {
	font-size: 26rpx;
	font-weight: 700;
	color: #393d33;
	line-height: 1.5;
	.dark-mode & { color: #eeeae0; }
}
.desc, .li-sub {
	margin-top: 10rpx;
	font-size: 26rpx;
	color: #6d7267;
	line-height: 1.65;
	.dark-mode & { color: #b4c0b1; }
}
.list {
	border: 1rpx solid #e6eadd;
	border-radius: 22rpx;
	overflow: hidden;
	background: #fcfdfa;
	.dark-mode & { background: #263026; border-color: #3b4837; }
	navigator + navigator .li { border-top: 1rpx solid rgba(98, 105, 89, 0.15); }
}
.li { display: flex; align-items: center; gap: 22rpx; padding: 28rpx 24rpx; }
.li:active { background: rgba(110, 135, 88, 0.08); }
.li-icon {
	flex-shrink: 0;
	padding: 12rpx;
	border-radius: 16rpx;
	background: #eef2e7;
	.dark-mode & { background: #344030; }
	img { display: block; width: 60rpx; height: 60rpx; border-radius: 8rpx; image-rendering: pixelated; }
}
.li-main { flex: 1; min-width: 0; }
.to { flex-shrink: 0; padding: 8rpx; }
.ui-chevron { display: block; width: 12rpx; height: 12rpx; border-top: 3rpx solid #929b87; border-right: 3rpx solid #929b87; transform: rotate(45deg); }
.hint {
	margin-top: 24rpx;
	padding: 0 12rpx;
	font-size: 26rpx;
	color: #818775;
	line-height: 1.7;
	.dark-mode & { color: #a1ae9b; }
}
</style>
