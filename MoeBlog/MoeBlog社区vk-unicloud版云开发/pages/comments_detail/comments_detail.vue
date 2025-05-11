<template>
	<view class="comments-detail">
		<view class="comments-current" v-if="'art_id' in commentCurrent">
			<comment-list-item :item="commentCurrent"></comment-list-item>
		</view>
		<view class="comments-list">
			<view class="comments-list-I" v-for="(item,index) in commentsData" :key="item._id">
				<comment-list-item :item="item"></comment-list-item>
			</view>
		</view>
		<view class="comments-send">
			<comments-send-item :artInfo="commentInfo" @popColse="popColse" @commentSc="commentSc"></comments-send-item>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
import {onLoad,onReachBottom} from "@dcloudio/uni-app"
import {avatar,username,gxqm} from "@/utils/utils.js"
import {apiGetCommentsDetail} from "@/api/api.js"
onLoad((item)=>{
	let obj=JSON.parse(item.item)
	artId.value=obj.art_id
	commentsId.value=obj.comments_id
	commentInfo.value.username=obj.username
	commentInfo.value.artid=obj.art_id
	commentInfo.value.parent_id=obj.comments_id
	console.log(commentInfo.value)
	getCommentsDetail()
})
onReachBottom(()=>{
	pageIndex.value+=1
	if(commentStatus.value==true){
		return
	}
	getCommentsDetail()
})
const commentInfo=ref({
	artid:"",//传文章ID
	level:1,//文章的层级
	parent_id:"",
	username:""
})
const commentStatus=ref(false)
const pageIndex=ref(1)
const artId=ref("")
const commentsId=ref("")
const commentsData=ref([])
const commentCurrent=ref({})
const userText=ref("")
function getCommentsDetail(){
	let data={
		art_id:artId.value,
		comments_id:commentsId.value,
		pageIndex:pageIndex.value
	}
	apiGetCommentsDetail(data).then(res=>{
		if(res.result2.rows.length==0){
			commentStatus.value=true
		}
		commentCurrent.value=res.result1.rows[0]
		console.log(res.result1.rows[0])
		
		let newArr=[...commentsData.value,...res.result2.rows]
		commentsData.value=newArr
		console.log(commentsData.value)
	})
}
function popColse(){
	//发送成功的回调
	
}
function commentSc(item){
	commentsData.value.push(item)
	console.log(item)
}
</script>

<style lang="scss">
      .comments-detail{
		  padding: 25rpx;
		  .comments-current{
			  
		  }
		  .comments-list{
			  .comments-list-I{
				padding-left: 50rpx;  
			  }
		  }
		  .comments-send{
			  :deep(.comments-C){
				  image{
					  width: 50rpx;
					  height: 50rpx;
					  border-radius: 50%;
				  }
			  }
		  }
	  }
</style>
