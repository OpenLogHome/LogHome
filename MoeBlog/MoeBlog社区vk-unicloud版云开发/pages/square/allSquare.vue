<template>
	<view class="allSquare">
		<square-item type="into"></square-item>
		<view class="add" @click="ToAdd">
			+
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
function ToAdd() {
	vk.navigateTo('/pages/square/addSquare');
}
</script>

<style lang="scss">
	.allSquare{
		background: #f8f8f8;
		.add {
			position: fixed;
			bottom: 100rpx;
			right: 60rpx;
			background: #6C8FF1;
			height: 80rpx;
			width: 80rpx;
			border-radius: 50%;
			@include flex-center;
			font-size: 52rpx;
			color: #fff;
		}
	}

</style>
