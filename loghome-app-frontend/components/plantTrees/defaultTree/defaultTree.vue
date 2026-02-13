<template>
	<view class="outer">
		<img src="../../../static/plantTrees/defaultTree/static/cloud.png" alt="" class="back">
		<log-image :src="state2imgs[state.tree_status]" mode="" class="tree"></log-image>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				state2imgs:{
					'未种植':"http://img.codesocean.top/image/1649508466666",
					'种植':"http://img.codesocean.top/image/1649508553504",
					'开花':"http://img.codesocean.top/image/1649508536162",
					'结果':"http://img.codesocean.top/image/1649508476761",
					'收获':"http://img.codesocean.top/image/1649508490522",
				},
			}
		},
		props:[
			"state"
		],
		watch:{
		}
	}
</script>

<style scoped lang="scss">
	.outer{
		height: 100%;
		width: 100%;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		.tree{
			width: 80vw;
			position: relative;
			z-index: 2;
			animation: tree-float 5s linear infinite;
			margin-top: 10vh; // 稍微向下偏移，让它在屏幕中下部
		}
		.back{
			width: 100vw;
			height: 100vh;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 1;
			object-fit: cover;
		}
	}
	@keyframes tree-float {
		0% {
			transform:translate(0,0rpx);
		}
	
		50% {
			transform:translate(0,-20rpx);
		}
	
		100% {
			transform:translate(0,0rpx);
		}
	}
</style>
