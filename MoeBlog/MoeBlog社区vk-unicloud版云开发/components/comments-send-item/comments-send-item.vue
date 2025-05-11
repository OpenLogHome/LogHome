<template>
	<view class="comments-item" @click="openPop">
		<view class="comments-L">
			<text>善语结善缘，恶语伤人心</text>
		</view>
		<view class="comments-R" >
			<view class="comments-R-I">
				<uni-icons type="chat" size="30"></uni-icons>
				<text>{{artInfo.artInfo.commentsN}}</text>
			</view>
			<view class="comments-R-I" @click.stop="likeFun">
				<uni-icons v-if="likeStatus" type="heart-filled" color="red" size="30"></uni-icons>
				<uni-icons v-else type="heart" size="30"></uni-icons>
			</view>
		</view>
	</view>
	<view class="popup">
		<u-popup @close="popColse" closeable mode="bottom" v-model="popStatus" class="upopup" border-radius="15" close-icon-pos="top-left">
			<view class="popup-C">
				<view class="popup-H">
					<view class="H-title">回复帖子</view>
				</view>
				<view class="send-C">
					<view class="ipt"><textarea v-model="info.content" :auto-height="true" :placeholder="plhtext"/></view>
					<view class="btn"><u-button @click="send" type="primary">发送</u-button></view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
import { ref,nextTick,watch,defineEmits} from 'vue';
import {apiAddComments,apiAddUserLikeArt,apiDelUserLikeArt} from "@/api/api.js"
import { avatar, gxqm, username } from '../../utils/utils';
import { getCheck } from "@/utils/check.js"
const artInfo = defineProps(["artInfo"])
const popStatus=ref(false)
const plhtext=ref("善语结善缘，恶语伤人心")
const emit=defineEmits(['popColse','commentSc'])
const likeStatus=ref(false)

if(artInfo.artInfo.like_info.length!=0){
	likeStatus.value=true
}
console.log(artInfo.artInfo)
console.log(likeStatus.value)
const info=ref({
		content:"",
		art_id:artInfo.artInfo.artid,
		level:artInfo.artInfo.level,
		parent_id:artInfo.artInfo.parent_id
})
function send(){
		if (!vk.checkToken()) {
		  // token无效
		  vk.toast("请登录后再评论");
		} else {
		 // token有效
		   if(info.value.art_id.length!=0 && info.value.content.length!=0 && info.value.level<2){
			   let obj={
			   	content:info.value.content,
			   	openid:vk.getVuex('$user.userInfo').wx_openid?.['mp-weixin'] || "",
			   	scene:1
			   }
			   getCheck(obj).then(res=>{
			   	if(res.isT){
			   		AddComments()
			   	}else{
			   		vk.toast(res.msg);
			   	}
			   })
		   }else{
			    vk.toast("请输入评论内容");
		   }
		}
	}
	function AddComments(){
		apiAddComments(info.value).then(res=>{
			let infos={
				_id:res.result,
				content:info.value.content,
				userinfo:{
					username:username(vk.getVuex('$user.userInfo')),
					avatar:avatar(vk.getVuex('$user.userInfo')),
					_id:vk.getVuex('$user.userInfo')._id,
					gxqm:gxqm(vk.getVuex('$user.userInfo'))
				},
				_add_time_str:"刚刚",
				parent_id:info.value.parent_id
			}
			emit("commentSc",infos)
			info.value.content=""
			popColse()
		})
	}
   async function openPop() {
	   info.value.art_id=artInfo.artInfo.artid
	   info.value.level=artInfo.artInfo.level
	   info.value.parent_id=artInfo.artInfo.parent_id
     await nextTick(() => {
       plhtext.value = `回复@ ${artInfo.artInfo.username}`;
       if (artInfo.artInfo.username.length === 0) {
         plhtext.value = "善语结善缘 恶语伤人心";
       }
       popStatus.value = true;
     });
   }
   function popColse(){
	   popStatus.value=false
	   emit("popColse")
	}
	function likeFun(){
		//用户点赞表
		likeStatus.value=!likeStatus.value
		vk.pubfn.debounce(() => {
		  let data={
			  art_id:info.value.art_id
		  }
		  if(!likeStatus.value){
			//如果用户已点赞  那就取消删除点赞记录
			apiDelUserLikeArt(data).then(res=>{
				emit("popColse",false)
				console.log(res)
			})
		  }else{
			//如果用户没点赞  那就添加点赞记录
			apiAddUserLikeArt(data).then(res=>{
				emit("popColse",true)
				console.log(res)
			})  
		  }
		}, 3000, true,);
	}
	defineExpose({openPop})
</script>

<style lang="scss">
       .comments-item{
		   position: fixed;
		   bottom: 0;
		   left: 0;
		   right: 0;
		   padding: 25rpx;
		   background: rgba(255,255,255,0.5);
		   backdrop-filter: blur(15rpx);
		   @include flex;
		   z-index: 99;
		   .comments-L{
			   width: 65%;
			   background: #F8F8F8;
			   padding: 20rpx 0;
			   padding-left: 25rpx;
			   border-radius: 10rpx;
		   }
		   .comments-R{
			   margin-left: 25rpx;
			   width: 35%;
			   @include flex;
			   justify-content: flex-end;
			   .comments-R-I{
				   padding: 0 25rpx;
				   @include flex;
				   text{
					   padding: 0 5rpx;
				   }
			   }
		   }
	   }
	   .popup{
	   	 .upopup{
	   		 .popup-C{
	   			width: 100vw;
	   			height: fit-content;
	   			background: #fff; 
				padding: 25rpx 25rpx 50rpx 25rpx;
				.popup-H{
					@include flex;
					position: relative;
					padding: 25rpx 0;
					.H-title{
						position: absolute;
						left: 0;
						right: 0;
						margin: 0 auto;
						@include flex-center;
						font-size: 32rpx;
						font-weight: 550;
					}
					.H-icon{
							
					}
				}
				.send-C{
					padding: 25rpx 0;
					@include flex;
					.ipt{
						width: 80%;
						textarea{
							background: #F8F8F8;
							padding: 20rpx 0;
							padding-left: 25rpx;
							border-radius: 15rpx;
						}
					}
					.btn{
						width: 20%;
						margin-left: 25rpx;
					}
					
				}
	   		}
	   	 }
	   }
</style>