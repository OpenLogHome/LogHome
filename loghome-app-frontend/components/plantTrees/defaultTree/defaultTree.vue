<template>
	<view class="outer" :class="{ night: nightMode }">
		<img src="../../../static/plantTrees/defaultTree/static/cloud.png" alt="" class="back" />
		<view class="night-overlay" v-if="nightMode"></view>
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
		props: {
			state: {
				type: Object,
				default() {
					return {}
				}
			},
			nightMode: {
				type: Boolean,
				default: false,
			}
		},
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
			z-index: 3;
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
			transition: filter 0.4s ease;
		}
		&.night {
			background: linear-gradient(180deg, #071329 0%, #172f3d 68%, #152820 100%);
			.back {
				filter: brightness(0.38) saturate(0.72) hue-rotate(12deg) contrast(1.08);
			}
			.tree {
				filter: brightness(0.7) saturate(0.82) contrast(1.1) drop-shadow(0 14rpx 18rpx rgba(0, 0, 0, 0.38));
			}
		}
		.night-overlay {
			position: absolute;
			inset: 0;
			z-index: 2;
			pointer-events: none;
			background: linear-gradient(180deg, rgba(4, 14, 34, 0.58), rgba(16, 36, 48, 0.28) 62%, rgba(12, 28, 22, 0.46));
			&::before {
				content: "";
				position: absolute;
				left: 10%;
				top: 12%;
				width: 5rpx;
				height: 5rpx;
				background: #e6f0ff;
				box-shadow: 90rpx 46rpx #d7e7ff, 190rpx -18rpx #ffffff, 300rpx 62rpx #cbdcff, 430rpx 8rpx #eef6ff, 520rpx 82rpx #d7e7ff, 610rpx 26rpx #ffffff;
			}
			&::after {
				content: "";
				position: absolute;
				right: 12%;
				top: 8%;
				width: 76rpx;
				height: 76rpx;
				border-radius: 4rpx;
				background: #dce8f7;
				box-shadow: 0 0 34rpx rgba(190, 216, 250, 0.42);
			}
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
