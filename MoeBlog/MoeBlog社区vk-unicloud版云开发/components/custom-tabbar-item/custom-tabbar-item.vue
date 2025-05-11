<template>
	<view class="custom-tabbar">
		<view :style="{height:safeHeight() + 'rpx'}"></view>
		<view class="custom-tabbar-ctx" :style="{height:MenuHeight()+'px'}">
			<!-- <view class="tabbar-ctx-item">
				<image src="/static/logos.png"></image>
				<text>萌Blog</text>
			</view> -->
			<view class="tabbar-ctx-item item1" :style="{width:MenuWidth()+'px'}">
				<slot name="custom"></slot>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {ref,computed} from "vue"
	import {onLoad} from "@dcloudio/uni-app"
	import {safeHeight,MenuHeight,MenuWidth} from "@/utils/system.js"
	onLoad(()=>{
		
	})
	computed(()=>{
		
	})
</script>

<style lang="scss" scoped>
    .custom-tabbar{
		background: rgba(255,255,255);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		margin: auto;
		padding: 0 25rpx;
		padding-bottom: 15rpx;
		z-index: 99;
		box-shadow:
			0px 0px 5.3px rgba(0, 0, 0, 0.028),
			0px 0px 17.9px rgba(0, 0, 0, 0.042),
			0px 0px 80px rgba(0, 0, 0, 0.07)
		;
		.custom-tabbar-ctx{
			@include flex;
			.tabbar-ctx-item{
				@include flex;
				image{
					height: 70rpx;
					width: 70rpx;
					border-radius: 50%;
				}
				text{
					margin-left: 15rpx;
					font-size: 35rpx;
					font-weight: 550;
				}
			}
			.item1{
				margin-left: 25rpx;
			}
		}
	}
</style>