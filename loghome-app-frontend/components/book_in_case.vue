<template>
	<div class="outer">
		<div class="book">
			<img :src="picUrl  + '?thumbnail=1' " alt="" :style="{display: picUrl=='' ? 'none' : 'block'}"
			onerror="onerror=null;src='https://s2.loli.net/2021/12/06/iTkPD6cudGrsEKR.png'">
		</div>
		<div :class="{nameTag:true,empty:bookName==''}">
			{{bookName}}
		</div>
	</div>

</template>

<script>
	export default{
		props:{
			bookName:{
				type: String,
				default:""
			},
			picUrl:{
				type:String,
				default:""
			}
		}
	}
</script>

<style scoped lang="less">
	div.outer{
		margin:20rpx;
		margin-top:20rpx;
		div.book{
			height:240rpx;
			width:180rpx;
			background-color: #d3d3d3;
			margin-bottom:20rpx;
			border-radius: 7rpx;
			img{
				height:100%;
				width:100%;
				border-radius: 7rpx;
			}
		}
		div.nameTag{
			width:180rpx;
			height:60rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow:hidden;
			text-align: center;
			color:#535353;
			line-height: 30rpx;
			font-size:28rpx !important;
		}
		div.nameTag.empty{
			margin-bottom: 30rpx;
			height:30rpx;
			width:180rpx;
			background-color: #d3d3d3;
			border-radius: 7rpx;
		}
	}
</style>
