<template>
	<view class="outer" :style="{'height': height}">
		<img src="../static/images/icon_nothing.png" alt=""/>
		<p class="text">{{msg}}</p>
	</view>
</template>

<script>
	export default{
		props:{
			msg:{
				default:"空空如也"
			},
			height: {
				default: 'calc(100vh - 44px)'
			}
		}
	}
</script>

<style scoped lang="less">
	view.outer{
		display:flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height:calc(100vh - 88rpx);
		img{
			width:50%;
		}
		p{
			margin:50rpx;
			font-size: 40rpx;
			font-weight: bold;
			color:#EA7034;
			text-align: center;
			white-space: pre-wrap;
		}
	}
</style>
