<template>
	<view class="user-item">
		<view class="user-item-C" @click="ToUserInfo()">
			<view class="avatar">
				<image mode="aspectFill" :src="avatar(prpop.item.userinfo || prpop.item)"></image>
			</view>
			<view class="name">{{username(prpop.item.userinfo || prpop.item)}}</view>
			<view class="icon"><u-icon name="arrow-right"></u-icon></view>
		</view>
	</view>
</template>

<script setup>
	import {ref} from "vue"
	import { username,avatar } from '../../utils/utils';
	import { getCurrentInstance } from "vue";
	const { proxy } = getCurrentInstance();
	const prpop=defineProps(["item"])
	const id=ref("")
	function ToUserInfo(){
		if("userinfo" in prpop.item){
			id.value=prpop.item.userinfo._id
		}else{
			id.value=prpop.item._id
		}		
		proxy.$framePostman.send({ type: 'USER_PAGE', id: id.value });
	}
</script>

<style lang="scss">
      .user-item{
		  .user-item-C{
			  @include flex;
			  padding-bottom: 15rpx;
			  border-bottom: 1rpx solid #eee;
			  margin: 20rpx 0;
			  .avatar{
				  image{
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;  
				  }
			  }
			  .name{
				  padding: 0 25rpx;
				  font-size: 32rpx;
				  font-weight: 550;
			  }
			  .icon{
				  margin-left: auto;
			  }
		  }
	  }
</style>