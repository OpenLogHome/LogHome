<template>
	<view class="empty-item">
		<view class="empty-I">
			<image mode="widthFix" :src="`https://404.kim/api/img/${mode}-empty.png`"></image>
			<text>{{retrunStr()}}</text>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
const {mode} = defineProps({
  mode: {
    type: String,
    default: 'data'
  }
});
function retrunStr(){
	switch(mode){
		case "comments":
		    return "暂无评论，快来抢沙发吧"
			break;
		case "art":
			return "暂无文章，快去发布一篇"
			break;
		case "like":
			return "暂无喜欢，快去收藏一篇"
			break;
		case "square":
			return "暂无圈子，快去创建一个吧"
			break;
		case "user":
			return "暂无关注粉丝或关注"
			break;
		case "none":
			return "暂无内容"
			break;	
		default:
		    return "数据"
	}
}

</script>

<style lang="scss">
      .empty-item{
		  height: 350rpx;
		  width: 100%;
		 // padding-bottom: 50rpx;
		  @include flex-center;
		  .empty-I{
			  width: 60%;
			  @include flex-center;
			  flex-direction: column;
			  image{
				  width: 100%;
				  height: 256rpx;
			  }
			  text{
				  color: #cdcdcd;
				  padding: 50rpx 0;
				  font-size: 32rpx;
			  }
		  }
	  }
</style>