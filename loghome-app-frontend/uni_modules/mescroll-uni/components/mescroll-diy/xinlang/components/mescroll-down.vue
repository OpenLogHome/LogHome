<!-- 下拉刷新区域 -->
<template>
	<view v-if="mOption.use" class="mescroll-downwarp" :style="{'background':mOption.bgColor,'color':mOption.textColor}">
		<view class="downwarp-content">
			<view v-if="isDownLoading" class="downwarp-progress"></view>
			<view v-else class="downwarp-arrow" :style="{ transform: downRotate }"></view>
			<view class="downwarp-tip">{{ downText }}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		option: Object, // down的配置项
		type: Number // 下拉状态（inOffset：1， outOffset：2， showLoading：3， endDownScroll：4）
	},
	computed: {
		// 支付宝小程序需写成计算属性,prop定义default仍报错
		mOption() {
			return this.option || {};
		},
		// 是否在努力加载中
		isDownLoading() {
			return this.type === 3;
		},
		// 旋转的角度
		downRotate() {
			return this.type === 2 ? 'rotate(-180deg)' : 'rotate(0deg)';
		},
		// 文本提示
		downText() {
			switch (this.type) {
				case 1:
					return this.mOption.textInOffset;
				case 2:
					return this.mOption.textOutOffset;
				case 3:
					return this.mOption.textLoading;
				case 4:
					return this.mOption.textLoading;
				default:
					return this.mOption.textInOffset;
			}
		}
	}
};
</script>

<style>
@import '../../../mescroll-uni/components/mescroll-down.css';
@import './mescroll-down.css';
</style>
