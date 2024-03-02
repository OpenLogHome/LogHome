<template>
	<view v-if="isPopup">
		<view v-if="isShowMask" class="mask" @tap="hiddenPopup"></view>
		<view v-if="location == 'bottom'" class="popup-bottom w-100 bg-color-white" :style="style">
			<slot name="content"></slot>
		</view>
		<view v-if="location == 'middle'" class="popup-middle bg-color-white">
			<slot name="content"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			height: {
				type: Number,
				default: 556
			},
			/* 弹出层位置 */
			location: {
				type: String,
				default: 'bottom'
			},
			/* 是否圆角 */
			isCircleAngle: {
				type: Boolean,
				default: true
			},
			/* 是否显示蒙版 */
			isShowMask: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			style() {
				let circleAngle = `border-radius:0px 0px 0px 0px;`;
				if (this.isCircleAngle) {
					circleAngle = `border-radius:10px 10px 0px 0px;`;
				}
				return `height: ${this.height}rpx;${circleAngle}`
			}
		},
		data() {
			return {
				isPopup: false
			}
		},
		methods: {
			hiddenPopup() {
				this.isPopup = false;
			}
		},
	}
</script>

<style scoped>
	.mask{
		background-color: rgba(0,0,0,0.2);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
	}
	.popup-bottom{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
		animation:show .5s;
	}
	.popup-middle{
		border-radius:0px;
		width: 716rpx;
		margin-left: 17rpx;
		margin-right: 17rpx;
		position: fixed;
		left: 0;
		right: 0;
		top: 300rpx;
		z-index: 9999;
		animation:opcity .25s;
	}
	@keyframes show
	{
		from {bottom: -556rpx;}
		to {bottom: 0;}
	}
	@keyframes hidden
	{
		from {bottom: 0;}
		to {bottom: -556rpx;}
	}
	@keyframes opcity
	{
		from {opacity: 0;}
		to {opacity: 1;}
	}
</style>
