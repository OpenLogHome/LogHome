<template>
	<view class="avatar">
		<view class="avatar-C">
			<view class="avatar-C-H">
				<avatar-item :height="280" :width="280" :frame="String(frameIndex)"></avatar-item>
				<view class="avatar-C-H-B">
					<u-tag text="保存" @click="EditInfo"></u-tag>
				</view>
			</view>
			<view class="avatar-C-C">
				<view class="avatar-C-C-I" v-for="(item,index) in avatarList" :key="index" :class="index+1==frameIndex?'active':''">
					<image @click="selIndex(index+1)" mode="aspectFill" :src="item"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {onMounted, ref} from "vue"
import { avatar,frame } from "../../utils/utils";
import {apiUpUserInfo} from "@/api/api.js"
const avatarList=ref([])
const frameIndex=ref(frame(vk.getVuex('$user.userInfo')))
onMounted(()=>{
	setAvatar()
})
function EditInfo(){
	let obj={
		frame:frameIndex.value
	}
	apiUpUserInfo(obj).then(res=>{
		if(res.code==0){
			uni.showToast({
				title:"修改头像框成功",
				icon:"none"
			})
			vk.setVuex('$user.userInfo.frame', frameIndex.value);
			setTimeout(()=>{
				vk.reLaunch('/pages/my/userCenter');
			},1500)
		}
		console.log(res)
	})
}
function setAvatar(){
	for(let i=1;i<=28;i++){
		let str=`https://img.dashi109.top/avatar/${i}.png`;
		avatarList.value.push(str)
	}
}
function selIndex(index){
	frameIndex.value=index
}
</script>

<style lang="scss" scoped>
	.avatar{
		padding-bottom: 50rpx;
		.avatar-C{
			.avatar-C-H{
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 50rpx 0;
				position: relative;
				.avatar-C-H-B{
					position: absolute;
					right: 50rpx;
					top: 50rpx;
					// width: fit-content;
					// height: fit-content;
				}
			}
			.avatar-C-C{
				display: flex;
				flex-wrap: wrap;
				.avatar-C-C-I{
					width: 22%;
					height: fit-content;
					margin: calc(12% / 8);
					display: flex;
					align-items: center;
					&.active{
						border: 1rpx solid #F8BBD0;
						border-radius: 25rpx;
					}
					image{
						width: 180rpx;
						height: 180rpx;
						border-radius: 50%;
					}
				}
			}
		}
	}

</style>
