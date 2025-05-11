<template>
	<view class="skeletion-item1">
		<view class="skeletion-C" v-for="(item,index) in num" :key="index">
			<view class="sl-L">
				<view class="sl-L-A"></view>
			</view>
			<view class="sl-R">
				<view class="sl-R-I"></view>
				<view class="sl-R-I"></view>
				<view class="sl-R-I"></view>
				<view class="sl-R-I"></view>
			</view>
		</view>
	</view>
</template>

<script setup>
	defineProps({
		num:Number,
		default(){
			return 1
		}
	})
	
</script>

<style lang="scss">
	@mixin pulse-animation($duration: 1s, $delay: 0s) {
	  animation: pulse $duration ease-in-out infinite both;
	  animation-delay: $delay;
	}
	
	@keyframes pulse {
	  0%, 100% { opacity: 1; }
	  50% { opacity: 0.5; }
	}
	.skeletion-item1{
		.skeletion-C{
			@include flex;
			align-items: flex-start;
			padding: 15rpx 0;
			.sl-L{
				width: 20%;
				@include flex;
				justify-content: center;
				.sl-L-A{
					height: 70rpx;
					width: 70rpx;
					background: #eee;
					border-radius: 50%;
					@include pulse-animation(2s, 0s); /* 第一个元素立即开始闪烁 */
				}
			}
			.sl-R{
				width: 80%;
				.sl-R-I{
					margin: 15rpx 0;
					height: 30rpx;
					background: #E0E0E0;
				}
				&:nth-child(1) { @include pulse-animation(2s, 0.5s); } /* 第二个元素稍后开始闪烁 */
				&:nth-child(2) { @include pulse-animation(2s, 1s); } /* 以此类推，每个元素依次延后 */
				&:nth-child(3) { @include pulse-animation(2s, 1.5s); }
				&:nth-child(4) { @include pulse-animation(2s, 2s); }
				.sl-R-I:nth-child(1){
					width: 50%;
				}
				.sl-R-I:nth-child(2){
					width: 70%;
				}
				.sl-R-I:nth-child(3){
					width: 60%;
				}
				.sl-R-I:nth-child(4){
					width: 90%;
				}
			}
		}
	}

</style>