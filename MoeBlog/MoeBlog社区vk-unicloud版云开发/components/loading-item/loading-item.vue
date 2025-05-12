<template>
	<view class="loding">
		<view class="lodingT" v-if="!prpop.status"><u-loading color="#29B6F6" mode="circle" size="40"></u-loading>    数据加载中···</view>
		<view class="lodingF" v-else>没有更多数据了</view>
	</view>
</template>

<script setup>
	const prpop=defineProps(["status"])
</script>

<style lang="scss">
     .loding{
     	@include flex-center;
     	padding: 25rpx 0;
     }
</style>