<template>
	<view class="myAbout">
		<view class="logo">
			<view class="logo-C">
				<image mode="aspectFill" src="../../static/img/default-bg.jpg"></image>
				<view class="appName">Moe论坛</view>
				<view class="version">Version 1.0.0</view>
			</view>
		</view>
		<view class="desc">
			Moe论坛 是一款由风华绝代打造的校内社交小程序，在这里
			可以交流学习、吃瓜、社交、找对象、失物招领等功能一
			应俱全!可以更轻松地结交新朋友!让你更方便地在校园
			里享受互助互爱的美好
		</view>
		<view class="cell">
			<u-cell-group>
				<u-cell-item title="用户协议"></u-cell-item>
				<u-cell-item title="隐私政策"></u-cell-item>
				<u-cell-item title="联系我们"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"

</script>

<style lang="scss">
	.myAbout{
		padding: 0 25rpx;
		.logo{
			.logo-C{
				padding-bottom: 25rpx;
				height: 480rpx;
				width: 100%;
				@include flex-center;
				flex-direction: column;
				.appName{
					font-size: 36rpx;
					padding-top: 25rpx;
					padding-bottom: 10rpx;
					font-weight: 550;
				}
				.version{
					font-size: 26rpx;
				}
				image{
					width: 170rpx;
					height: 170rpx;
					border-radius: 50%;
				}
			}
		}
		.desc{
			letter-spacing: 5rpx;
			font-size: 32rpx;
			line-height: 70rpx;
			padding-bottom: 50rpx;
		}
	}

</style>
