<template>
	<view class="Skeleton-item">
		<view class="banner">
			
		</view>
		<view class="list">
			<view class="list-item" v-for="(item,index) in 10" :key="index">
				<view class="list-item-1"></view>
				<view class="list-item-2"></view>
			</view>
		</view>
		<view class="art">
			<view class="art-item" v-for="(items,indexs) in 4" :key="indexs">
				<view class="art-item-1"></view>
				<view class="art-item-2"></view>
				<view class="art-item-3">
					<view class="art-item-3-avatar"></view>
					<view class="art-item-3-name"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	
</script>

<style lang="scss">
      .Skeleton-item{
		  padding: 25rpx;
		  .banner{
			  width: 100%;
			  height: 280rpx;
			  background: #F1F2F4;
			  border-radius: 15rpx;
			  padding: 15rpx 0;
		  }
		  .list{
			  padding: 15rpx;
			  @include flex;
			  flex-wrap: wrap;
			  .list-item{
				  @include flex-center;
				  flex-direction: column;
				  width: 19%;
				  margin: 25rpx calc(5% / 10);
				  .list-item-1{
					  width: 80rpx;
					  height: 80rpx;
					  background: #F1F2F4;
					  border-radius: 50%;
					  margin: 10rpx 0;
				  }
				  .list-item-2{
				  	  width: 80rpx;
					  height: 20rpx;
					  background: #F1F2F4;
					  margin: 10rpx 0;
				  }
			  }
		  }
		  .art{
			  padding: 15rpx 0;
			  @include flex;
			  flex-wrap: wrap;
			  .art-item{
				  width: 48%;
				  margin: 15rpx calc(4% / 4);
				  .art-item-1{
					  height: 280rpx;
					  background: #F1F2F4;
					  border-radius: 15rpx;
					  margin: 10rpx 0;
				  }
				  .art-item-2{
				  	 height: 35rpx;
					 background: #F1F2F4;
					 border-radius: 5rpx;	
					 margin: 10rpx 0;
				  }
				  .art-item-3{
					  @include flex;
					  .art-item-3-avatar{
						  width: 50rpx;
						  height: 50rpx;
						  border-radius: 50%;
						  background: #F1F2F4;
					  }
					  .art-item-3-name{
						  flex: 1;
						  width: 100%;
						  height: 50rpx;
						  background: #F1F2F4;
						  margin-left: 25rpx;
						  border-radius: 5rpx;
					  }
				  }
			  }
		  }
	  }
	  .Skeleton-item::before{
		 content: ''; /* 伪元素需要的内容为空 */
		  position: absolute; /* 使伪元素相对于.skeleton定位 */
		  top: 0; /* 从顶部开始 */
		  left: 0; /* 从左侧开始 */
		  width: 100%; /* 占满骨架屏宽度 */
		  height: 100%; /* 占满骨架屏高度 */
		  background-color: #fff; /* 动画颜色，一般为白色 */
		  animation: skeleton-loading 1.5s ease-in-out infinite; /* 应用动画 */  
	  }
	  @keyframes skeleton-loading {
	    0% {
	      transform: scaleX(0); /* 初始状态宽度为0 */
	      opacity: 1; /* 初始不透明度 */
	    }
	    50% {
	      opacity: 0.5; /* 动画过程中变为半透明 */
	    }
	    100% {
	      transform: scaleX(1); /* 宽度拉伸至满 */
	      opacity: 0; /* 结束时完全透明 */
	    }
	  }
</style>