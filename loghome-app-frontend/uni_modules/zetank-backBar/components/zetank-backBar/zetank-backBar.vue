<template>
	<view class="top_nav" :style="{background:bgColor, '--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
		<view class="toBar" :style="'height:'+toBarHeight">
			<view>
				<block v-if="showLeft == true">
					<div @tap="toback" class="left_img" color="#ffffff"></div>
					<uni-icons type="left" class="icon-fanhui left_icon" @tap="toback" size="24" color="#fff">
					</uni-icons>
				</block>
			</view>
			
			<view>
				<block v-if="showHome == true">
					<div @tap="tohome" class="left_img left_img2" color="#ffffff"></div>
					<uni-icons type="home" class="icon-fanhui left_icon left_icon2" @tap="tohome" size="24" color="#fff">
					</uni-icons>
				</block>
			</view>

			<!-- #ifndef H5 -->
			<text class="title" :style="'color:' + textcolor + ';' + 'background' + bgColor"
				v-if="showTitle == true">{{navTitle}}</text>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<text class="title bolds" :style="'color:' + textcolor" v-if="showTitle == true">{{navTitle}}</text>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {

			};
		},
		computed: {
			statusBarHeight() {
				return '0px'
			},
			toBarHeight() {
				return '0px'
			}
		},
		components: {},
		props: {
			textcolor: {
				type: String,
				default: '#fff'
			},
			bgColor: {
				type: String,
				default: '#ffffff'
			},
			showTitle: {
				type: Boolean,
				default: true
			},
			showLeft: {
				type: Boolean,
				default: false
			},
			showHome: {
				type: Boolean,
				default: false
			},
			navTitle: {
				type: String,
				default: '登录'
			},
			leftBg: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			toback() {
				if(getCurrentPages().length == 1) {
					uni.reLaunch({
						url: "/pages/library"
					})
				} else {
					uni.navigateBack();
				}
			},
			tohome() {
				uni.reLaunch({
					url:"/pages/library"
				})
			}
		}
	};
</script>
<style lang="scss" scoped>
	.status_bar {
		width: 100vw;
		overflow: hidden;
		display: block;
	}

	.toBar {
		width: 100vw;
		position: relative;
		display: flex;
		align-items: center;
	}

	.left_icon {
		font-size: 32upx;
		position: absolute;
		left: 32.5upx;
		top: -15rpx;
		width: 60upx;
		height: 60upx;
		z-index: 110;
		line-height: 60upx;
	}
	
	.left_icon2 {
		left: 140upx;
	}

	.toBar .title {
		text-align: center;
		color: #fff;
		font-size: 30upx;
		display: block;
		margin: 0 auto;
		font-size: 40rpx;
	}

	.left_img {
		width: 50upx;
		height: 50upx;
		position: absolute;
		padding: 16upx;
		left: 25upx;
		top: 15upx;
		transform: translateY(-50%);
		z-index: 100;
		background-color: rgba(0, 0, 0, 0.4);
		border-radius: 10rpx;
	}
	
	.left_img2 {
		left: 130upx;
	}

	.bolds {
		font-weight: bold;
	}

	.top_nav {
		position: fixed;
		top: calc(60upx + var(--statusBarHeight));
		left: 15upx;
		z-index: 80;
	}
</style>
