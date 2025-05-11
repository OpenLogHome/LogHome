<template>
	<view class="avatar-item">
		<view class="avatar-item-C" >
			<view class="avatar-item-C-img" :style="{ width: `${props.width}rpx`, height: `${props.height}rpx`,backgroundImage:`url('https://img.dashi109.top/avatar/${props.frame}.png')` }">
				<image class="img2" mode="aspectFill" :style="{ width: `${props.width / 1.8}rpx`, height: `${props.height / 1.8}rpx` }" :src="props.avatar"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {defineProps, onMounted} from "vue"
	import { avatar,frame } from "../../utils/utils";
	const props=defineProps({
		height:{
			type:Number,
			default(){
				return 180 
			}
		},
		width:{
			type:Number,
			default(){
				return 180 
			}
		},
		avatar:{
			type:String,
			default(){
				return avatar(vk.getVuex('$user.userInfo'))
			}
		},
		frame:{
			type:String,
			default(){
				return frame(vk.getVuex('$user.userInfo'))
			}
		}
	})
	onMounted(()=>{
		console.log(props)
	})
</script>

<style lang="scss" scoped>
	.avatar-item{
		.avatar-item-C{
			position: relative;
			.avatar-item-C-img{
				background-position: center center;
				background-size: cover;
				background-repeat: no-repeat;
				display: flex;
				align-items: center;
				justify-content: center;
				.img2{
					border-radius: 50%;
				}
			}
		}
	}
</style>