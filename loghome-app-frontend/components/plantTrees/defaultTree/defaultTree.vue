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
		height:100vh;
		width:100vw;
		position:relative;
		overflow: hidden;
		img.tree{
			width:80vw;
			position:absolute;
			left:calc(50vw - 40vw);
			bottom:15vh;
			animation: tree-float 5s linear infinite;
		}
		img.back{
			width:100vw;
			left:0;
			top:0;
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
