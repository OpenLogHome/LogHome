<template>
	<view class="outer" v-dark>
		<view class="content">
			<view class="header">
				<img class="icon" src="../../static/icons/lab.svg" mode="aspectFit"></img>
				<view class="title">{{ $t('me.service.lab') }}</view>
				<view class="desc">{{ $t('me.service.labPage.desc') }}</view>
			</view>
			<view class="list">
				<navigator url="./logDefense">
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
	data() {
		return {}
	},
	methods: {}
}
</script>

<style lang="scss" scoped>
.outer {
	min-height: 100%;
	background-color: #fcf4e1;

	&.dark-mode {
		background-color: #171e19;
	}
}

.content {
	display: flex;
	box-sizing: border-box;
	width: 100%;
	padding: 40rpx 32rpx calc(28rpx + var(--loghome-safe-bottom, env(safe-area-inset-bottom, 0px)));
	flex-direction: column;
	align-items: center;
}

.header {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 32rpx;
	text-align: center;
}

.icon {
	width: 104rpx;
	height: 104rpx;
	image-rendering: pixelated;
}

.title {
	font-size: 40rpx;
	font-weight: bold;
	color: #393d33;
	line-height: 1.3;

	.dark-mode & { color: #eeeae0; }
}

.desc {
	font-size: 26rpx;
	color: #6d7267;
	line-height: 1.6;
	max-width: 560rpx;

	.dark-mode & { color: #acb7a9; }
}

.list {
	display: flex;
	width: 100%;
	max-width: 640rpx;
	flex-direction: column;
	border-radius: 24rpx;
	overflow: hidden;
	background: rgba(255, 255, 255, 0.6);
	box-shadow: 0 8rpx 32rpx rgba(98, 105, 89, 0.10);

	.dark-mode & {
		background: rgba(35, 44, 37, 0.9);
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.25);
	}

	navigator + navigator .li {
		border-top: 1rpx solid rgba(98, 105, 89, 0.15);
	}
}

.li {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 28rpx 28rpx;
}

.li-icon {
	flex: 0 0 auto;

	img {
		display: block;
		width: 76rpx;
		height: 76rpx;
		border-radius: 12rpx;
	}
}

.li-main {
	flex: 1 1 auto;
	min-width: 0;
}

.li-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #393d33;
	line-height: 1.35;

	.dark-mode & { color: #eeeae0; }
}

.li-sub {
	margin-top: 6rpx;
	font-size: 24rpx;
	color: #6d7267;
	line-height: 1.5;

	.dark-mode & { color: #acb7a9; }
}

.to {
	flex: 0 0 auto;
}

.hint {
	margin-top: 24rpx;
	font-size: 22rpx;
	color: #a09a89;
	line-height: 1.6;
	text-align: center;

	.dark-mode & { color: #7d887e; }
}
</style>
