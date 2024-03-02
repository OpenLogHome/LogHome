<template>
	<view>
		<view class="position-fixed" style="top: 0;left: 0;right: 0;z-index: 9999;">
			<view class="w-100" :style="'background-color:'+ statusColor +';height:' + topStatusHeight + 'px;'"></view>
			<view class="flex pt-1" :style="'color:'+ statusColor +';'" 
			style="width: 700rpx;padding-left: 25rpx;padding-right: 25rpx;height: 80rpx;background-color: #FFFFFF;">
				<view class="flex align-center" :class="isSearch ? 'leftReturn2' : 'leftReturn'" @tap="clickLeft">
					<text class="icon iconfont font-title" :class="isSearch?'font-title':'h5 mb-1'" :style="'color:'+ leftRightColor">&#xe635;</text>
					<text v-if="isSearch == false" class="h4 mb-1 ml-1" :style="'color:'+ leftRightColor">返回</text>
				</view>
				<view class="flex centerTitle just-content-center text-ellipsis pl-2" :style="'color:'+ titleColor">
					<slot name="pageTitle"></slot>
				</view>
				<view class="flex rightBtn just-content-center align-center mb-1" :style="'color:'+ leftRightColor">
					<slot name="right-text"></slot>
				</view>
			</view>
		</view>
		<view :style="placeHeight" class="w-100"></view>
	</view>
</template>

<script>
	export default {
		props: {
			statusColor: {
				type: String,
				default: '#FFFFFF;'
			},
			titleColor: {
				type: String,
				default: '#333333;'
			},
			leftRightColor: {
				type: String,
				default: '#333333;'
			},
			/* 是否是搜索导航栏 */
			isSearch: {
				type: Boolean,
				default: false
			},
			/* 当前页面是否为添加数据 */
			isAddDataPage: {
				type: Boolean,
				default: false
			},
		},
		computed: {
			placeHeight() {
				return `height: ${(this.topStatusHeight + this.topTitle) - 1}px`
			}
		},
		data() {
			return {
				topStatusHeight: 0,
				
				/* 头部title高度 */
				topTitle: 0,
			}
		},
		methods: {
			clickLeft(){
				uni.navigateBack({
					delta:1
				})
			}
		},
		created() {
			// #ifdef APP-PLUS || APP-PLUS-NVUE
			this.topStatusHeight = plus.navigator.getStatusbarHeight();
			// #endif
			// #ifdef MP-WEIXIN
			uni.getSystemInfo({
				success: (res) => {
					console.log(res);
					this.topStatusHeight = res.statusBarHeight;
				}
			})
			// #endif
			this.topTitle = uni.upx2px(90);
		}
	}
</script>
 
<style lang="scss">
	.place{
		height: 100rpx;
	}
	.leftReturn{
		width: 120rpx;
	}
	.leftReturn2{
		width: 40rpx;
	}
	.centerTitle{
		// width: 440rpx;
		flex: 1;
	}
	.rightBtn{
		width: 140rpx;
	}
</style>
