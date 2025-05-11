<template>
	<view class="push">
		<view class="push-bj">
			<image mode="aspectFill" src="https://img.dashi109.top/imgs/7540e126-8977-40bb-b78a-fc9fecde0c5a.png"></image>
		</view>
		<view class="push-C">
			<view class="push-ctx">
				<view class="push-I" @click="ToArt">
					<image src="https://img.dashi109.top/imgs/wordai.png" mode="aspectFill"></image>
					<view class="title">发动态</view>
					<view class="desc">分享灵感和日常,记录美好生活</view>
				</view>
				<view class="push-I" @click="ToNewSquare">
					<image src="https://img.dashi109.top/imgs/work ai.png" mode="aspectFill"></image>
					<view class="title">建圈子</view>
					<view class="desc">创建自己的圈子,找到志同道合的朋友</view>
				</view>
			</view>
			<view class="triangle-up"></view>
		</view>
	</view>
</template>

<script setup>
import {onMounted, ref} from "vue"
onMounted(()=>{
	// getData()
})
function getData(){
	
}
function ToArt(){
	vk.navigateTo('/pages/art/addArt');
}
function ToNewSquare(){
	vk.navigateTo('/pages/square/addSquare');
}
</script>

<style lang="scss">
	page{
		box-sizing: border-box;
	}
      .push{
		  box-sizing: border-box;
		 .push-bj {
		    position: fixed; // 确保背景图层固定，铺满整个视口
		    top: 0;
		    left: 0;
		    right: 0;
		    bottom: 0;
		    overflow: hidden; // 隐藏可能产生的滚动条
		    z-index: -1; // 确保背景图片在最底层，不影响其他元素布局
		
		    image {
		      width: 100%;
		      height: 100%;
		    }
		  }
		  .push-C{
			  position: absolute;
			  bottom: 50rpx;
			  padding: 0 50rpx;
			  left: 0;
			  right: 0;
			  margin: 0 auto;
			  @keyframes scaleAnimation {
			    0%, 100% {
			      transform: scale(1); // 初始状态和结束状态，恢复正常大小
			    }
			    50% {
			      transform: scale(1.1); // 中间状态，放大10%
			    }
			  }
			  animation: scaleAnimation 3s ease-in-out infinite; // 动画名称、时长、速度曲线、循环次数
			  .push-ctx{
				  width: 100%;
				  height: 30vh;
				  background: rgba(255,255,255,0.9);
				  backdrop-filter: blur(15rpx);
				  border-radius: 25rpx;
				  padding: 25rpx;
				  display: flex;
				  image{
					  height: 60%;
					  width: 100%;
					  border-radius: 35rpx;
				  }
				  .push-I{
					  width: 50%;
					  padding:15rpx 25rpx;
					  @include flex;
					  flex-direction: column;
					  .title{
						  padding: 25rpx 0;
						  font-size: 32rpx;
						  font-weight: 550;
					  }
					  .desc{
						  color: #9E9E9E;
						  font-size: 26rpx;
					  }
				  }
			  }
			  .triangle-up{
				  width: 0;
				  height: 0;
				  border-left: 25rpx solid transparent;
				  border-right: 25rpx solid transparent;
				  border-top: 35rpx solid rgba(255,255,255,0.6); /* 更改颜色以适应设计需求 */
				  position: absolute;
				  bottom: -25rpx;
				  left: 0;
				  right: 0;
				  margin: 0 auto;
			  }
		  }
	  }
</style>
