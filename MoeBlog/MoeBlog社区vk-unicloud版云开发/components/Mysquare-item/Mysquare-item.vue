<template>
	<view class="Mysquare-item">
		<view class="Mysquare-C">
			<view class="bg">
				<image mode="aspectFill" :src="prpop.item.backgroundUrl"></image>
			</view>
			<view class="art-head-L" v-if="IsAdmin">
				<view class="art-head-L-c" @click.stop="OpensheetFn">
					<view class="iconS"></view>
					<view class="iconS"></view>
					<view class="iconS"></view>
				</view>
			</view>
			<view class="info">
				<view class="info-C">
					<view class="avatar">
						<image mode="aspectFill" :src="prpop.item.avatarUrl"></image>
					</view>
					<view class="name">
						<view class="title">{{prpop.item.name}}</view>
						<view class="desc">{{prpop.item.description}}</view>
					</view>
					<view class="status">
						<view :class="prpop.item.Audit==0?'s':(prpop.item.Audit==1?'p':'e')">{{textFn()}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<u-action-sheet @click="sheetFn" :safe-area-inset-bottom="true" z-index="9999" border-radius="25" :list="sheetList" v-model="actionSheet"></u-action-sheet>
</template>

<script setup>
	import {ref} from "vue"
	import {apiUpAdminSquare} from "@/api/api.js"
	const prpop=defineProps(["item"])
	const actionSheet=ref(true)
	const emit=defineEmits(['refresh'])
	const sheetList=ref([
		{
			text: '通过审核',
			disabled:prpop.item.Audit==0
		},
		{
			text: '退回审核',
			color:"#F44336",
			disabled:prpop.item.Audit==2
	   }])
	   const IsAdmin=ref(false)
	   IsAdmin.value=uniCloud.getCurrentUserInfo().role.indexOf('admin')>-1
	function textFn(){
		switch(prpop.item.Audit){
			case 0:
			   return "已通过"
			   break;
			case 1:
			   return "审核中"
			   break;
			case 2:
			   return "未通过"
			   break;
		}
	}
	function cssFn(){
		switch(prpop.item.Audit){
			case 0:
			   return 'success'
			   break;
			case 1:
			   return 'primary'
			   break;
			case 2:
			   return 'error'
			   break;
		}
	}
	function OpensheetFn(){
		actionSheet.value=true
	}
	function refresh(){
		emit('refresh',true)
	}
	function sheetFn(e){
		if(e==1){
			//退回审核的操作
			let data={
				_id:prpop.item._id,
				Audit:2
			}
			apiUpAdminSquare(data).then(res=>{
				refresh()
			})
		}
		if(e==0){
			//审核成功的操作
			let data={
				_id:prpop.item._id,
				Audit:0
			}
			apiUpAdminSquare(data).then(res=>{
				refresh()
			})
		}
	}
</script>

<style lang="scss"> 
page{
	box-sizing: border-box;
}
      .Mysquare-item{
		  .Mysquare-C{
			  position: relative;
			  padding:15rpx 25rpx;
			  border-radius: 25rpx;
			  height: 350rpx;
			  width: 100%;
			  z-index: 101;
			  .bg{
				  border-radius: 25rpx;
				  height: calc(350rpx - 50rpx); /* 减去上下padding */
				  width: calc(100% - 50rpx); /* 减去左右padding，注意百分比宽度需特殊处理 */
				  background: #eee;
				  position: absolute;
				  margin: auto;
				  z-index: 1;
				  image{
					  width: 100%;
					  height: calc(350rpx - 50rpx);
					  border-radius: 25rpx;
				  }
			  }
			  .art-head-L{
				  width: 10%;
				  position: absolute;
				  top: 25rpx;
				  right: 50rpx;
				  z-index: 999;
				  .art-head-L-c{
				  	width: 100%;
				  	@include flex;
				  	justify-content: flex-end;
				  	height: 30rpx;
				  	.iconS{
						height: 8rpx;
						width: 8rpx;
				  		border-radius: 50%;
				  		margin: 0 4rpx;
						background: #333333;
				  	}
				  }
			  }
			  .info{
				  position: relative;
				  z-index: 99;
				  @include flex-center;
				  height: calc(350rpx - 50rpx);
				  width: 100%;
				  background: rgba(0,0,0,0.1);
				  backdrop-filter: blur(2rpx);
				  border-radius: 25rpx;
				  .info-C{
					  @include flex;
					  height: 100%;
					  .avatar{
						  padding: 0 15rpx;
						  image{
							  height: 150rpx;
							  width: 150rpx;
							  border-radius: 50%;
						  }
					  }
					  .name{
						  @include flex;
						  flex-direction: column;
						  align-items: flex-start;
						  color: #fff;
						  .title{
							  font-size: 32rpx;
							  font-weight: 550;
							  margin-bottom: 10rpx;
						  }
						  .desc{
							  @include ellipsis(2);
							  font-size: 26rpx;
						  }
					  }
					  .status{
						  margin-left: auto;
						  padding: 15rpx;
						  white-space: nowrap;
						  .s{
							background: #19BE6B;
							padding: 10rpx 15rpx;
							font-size: 22rpx;
							border-radius: 5rpx;
							color: #fff;
						  }
						  .p
						  {
							background: #2979FF;
							padding: 10rpx 15rpx;
							font-size: 22rpx;
							border-radius: 5rpx;
							color: #fff;  
						  }
						  .e{
							background: #FA3534;
							padding: 10rpx 15rpx;
							font-size: 22rpx;
							border-radius: 5rpx;
							color: #fff;  
						  }
					  }
				  }
			  }
		  }
	  }
</style>