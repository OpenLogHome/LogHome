<template>
	<view class="art">
		<view v-if="artStatus">
			<Skeleton-item></Skeleton-item>
		</view>
		<view class="art-ctx" v-else>
			<view class="user" @click="ToUserinfo(artData.userinfo._id)">
				<view class="user-R" v-if="artData.userinfo">
					<image :src="avatar(artData.userinfo)" mode="aspectFill"></image>
					<view class="user-R-info">
						<view class="name">{{username(artData.userinfo)}}</view>
						<view class="gxqm">{{gxqm(artData.userinfo)}}</view>
					</view>
				</view>
				<view class="user-L">
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view style="height: 124rpx;"></view>
			<view class="art-C" v-if="!artData.Carousel">
				<view class="title">{{artData.title}}</view>
				<view class="content">{{artData.content}}</view>
				<view class="img" v-if="artData.coverVideo.length==0">
					<view class="imgRow">
						<u-row class="row">
							<u-col class="col" v-for="(item,index) in artData.coverImg" :span="spanNum(index)" :class="imgClass(index)" :key="index">
								<image @click="imgPrv(index)" mode="aspectFill" :src="item"></image>
							</u-col>
						</u-row>
					</view>
				</view>
				<view class="tv" v-else>
					<video :src="artData.coverVideo"></video>
				</view>
				<view class="timer">
					发布于: {{artData._add_time_str.slice(0,10)}}
				</view>
				<view class="artinfo">
					<view class="artinfo-item">
						<image mode="aspectFill" src="/static/img/look.png"></image>
						{{artData.view_count}}
					</view>
					<view class="artinfo-item">
						<image mode="aspectFill" src="/static/img/comments.png"></image>
						{{artData.comment_count}}
					</view>
					<view class="artinfo-item">
						<image mode="aspectFill" src="/static/img/like.png"></image>
						{{artData.like_count}}
					</view>
				</view>
			</view>
			<view class="art-B" v-else>
				<swiper v-if="artData.coverImg.length!=0 && artData.coverVideo.length==0" class="swiper" indicator-dots :circular="true" indicator-active-color="#ffffff">
					<swiper-item class="swiper-item" v-for="(items,indexs) in artData.coverImg" :key="indexs">
						<image @click="imgPrv(indexs)" mode="aspectFill" :src="items"></image>
					</swiper-item>
				</swiper>
				<view class="tv" v-if="artData.coverVideo.length!=0">
					<video :src="artData.coverVideo[0]"></video>
				</view>
				<view class="title">
					{{artData.title}}
				</view>
				<view class="content">{{artData.content}}</view>
				<view class="timer">
					发布于: {{artData._add_time_str.slice(0,10)}}
				</view>
				<view class="artinfo">
					<view class="artinfo-item">
						<image mode="aspectFill" src="/static/img/look.png"></image>
						{{artData.view_count}}
					</view>
					<view class="artinfo-item">
						<image mode="aspectFill" src="/static/img/comments.png"></image>
						{{artData.comment_count}}
					</view>
					<view class="artinfo-item">
						<image mode="aspectFill" src="/static/img/like.png"></image>
						{{artData.like_count}}
					</view>
				</view>
			</view>
			
			<view class="share">
				<view class="share-item" @click="Tosquare(artData.taxonmoy_id)">
					<view>
						<image mode="aspectFill" src="../../static/img/square.png"></image>
				    </view>
					<view class="share-item-text">{{artData.taxonmoy_info.name}}</view>
				</view>
				<!-- <view class="share-item" @click="shareWx">
					<view>
						<image mode="aspectFill" src="../../static/img/wx.png"></image>
                    </view>
					<button open-type="share" class="share-item-text">分享好友</button>
				</view>
				<view class="share-item" @click="sharePyq">
					<view>
						<image mode="aspectFill" src="../../static/img/pyq.png"></image>
					</view>
					<button open-type="share" class="share-item-text">分享微信</button>
				</view> -->
			</view>
			<view class="comments">
				<view class="comments-H">全部评论</view>
				<view v-if="commentsData.length!=0">
					<view @click="openComments(itemss)" v-for="(itemss,index) in commentsData" >
						<comment-list-item @delComment="delComment" :item="itemss" :key="itemss._id"></comment-list-item>
					</view>
				</view>
				<view v-else>
					<Empty-item mode="comments"></Empty-item>
				</view>
			</view>
			<view class="comments-content">
				<comments-send-item ref="commentsPop" :artInfo="commentInfo" @popColse="popColse" @commentSc="commentSc"></comments-send-item>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref,computed,nextTick} from "vue"
import {onLoad,onReachBottom,onShareTimeline,onShareAppMessage} from "@dcloudio/uni-app"
import {apiGetArtDetail,apiGetComments} from "@/api/api.js"
import {avatar,username,gxqm} from "@/utils/utils.js"
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
onLoad((id)=>{
	artId.value=id.id
	commentInfo.value.artid=id.id
	getArtDetail()
	getComments()
})
onReachBottom(()=>{
	if(commentsT.value){
		return
	}
	commentsIndex.value+=1
	getComments()
})
const artId=ref("")
const commentsPop=ref(null)
const commentInfo=ref({
	artid:artId.value,//传文章ID
	level:0,//文章的层级
	parent_id:"",
	username:"",
	commentsN:0,
	commentsL:""
})
const artData=ref({})
const artStatus=ref(true)
const commentsIndex=ref(1)
const commentsData=ref([])
const commentsT=ref(false)
const commentsNum=ref(null)
const commentsLike=ref("")
function imgPrv(index){
	uni.previewImage({
		urls:artData.value.coverImg,
		current:index
	})
}
function ToUserinfo(id){
	proxy.$framePostman.send({ type: 'USER_PAGE', id: id });
}
function getArtDetail(){
	let obj={
		id:artId.value,
		need_user_info:true
	}
	apiGetArtDetail(obj).then(res=>{
		artStatus.value=false
		if(res.result.rows[0].like_info&&res.result.rows[0].like_info._id&&res.result.rows[0].like_info.user_id==vk.getVuex('$user.userInfo')._id){
			console.log("存在点赞")
			commentInfo.value.like_info=res.result.rows[0].like_info._id
		}else{
			commentInfo.value.like_info=""
		}
		artData.value=res.result.rows[0]
		console.log(artData.value.coverVideo.length==0 && artData.value.coverImg.length==0)
		uni.setNavigationBarTitle({
			title:res.result.rows[0].title || "暂无标题"
		})
	})
}
function spanNum(index){
	switch(index){
		case 0:
		   return 12
		   break;
		case 1 : case 2:
		   return 6
		   break;
		default:
		   return 4
		   break;
	}
}
function imgClass(index){
	switch(index){
		case 0:
		    return "col"
			break;
		case 1 : case 2:
		   return "col-6"
		   break;
		default:
		   return "col-4"
		   break;
	}
}
function getComments(){
	//获取当前文章的所有评论
	let data={
		pageIndex:commentsIndex.value,
		art_id:artId.value
	}
	apiGetComments(data).then(res=>{
		if(commentsIndex.value==1){
			commentsNum.value=res.result.total
			commentInfo.value.commentsN=res.result.total
		}
		if(res.result.rows.length==0){
			commentsT.value=true
			return
		}
		let level1 = res.result.rows.filter(item => item.parent_id == "" || item.parent_id == null).map(item=>{
			return {
				...item,
				children:[]
			}
		})
		level1.forEach(item=>{
			res.result.rows.forEach(items=>{
				if(item._id==items.parent_id){
					item.children.push(items)
				}
			})
		})
		commentsData.value=[...commentsData.value,...level1]
	})
}
  function openComments(item){
	//点击打开子组件的弹窗 并传递消息进去
		commentInfo.value.parent_id=item._id
		commentInfo.value.username=username(item.userinfo)
		commentInfo.value.level=1
		if(commentsPop.value){
			commentsPop.value.openPop()
		}
}
function popColse(t){
	if(!t){
		commentsLike.value=""
	}else{
		commentsLike.value="1"
	}
	//子组件的关闭信息
	commentInfo.value={
		artid:artId.value,//传文章ID
		level:0,//文章的层级
		parent_id:"",
		username:"",
		commentsN:commentsNum.value,
		commentsL:commentsLike.value
	}
}
function commentSc(item){
	//评论成功后的回调
	commentsNum.value+=1
	if(item.parent_id.length==0){
		commentsData.value.push(item)
	}else{
		commentsData.value.forEach(items=>{
			if(items._id==item.parent_id){
				items.children.push(items)
			}
		})
	}
	popColse()
}
function Tosquare(id){
	vk.navigateTo('/pages/square/squareInfo?id='+id);
}
function delComment(e){
	commentsNum.value-=1
	let index = commentsData.value.findIndex(item=>item._id == e)
	commentsData.value.splice(index,1)
}
function shareWx(){
	//分享微信
	
}
function sharePyq(){
	//分享朋友圈
}
</script>

<style lang="scss" scoped>
       .art{
		   .art-ctx{
			   .user{
				   @include flex;
				   padding: 15rpx 25rpx;
				   position: fixed;
				   left: 0;
				   right: 0;
				   background: rgba(255,255,255,0.4);
				   backdrop-filter: blur(25rpx);
				   z-index: 99;
				   .user-R{
					   @include flex;
					   image{
						   width: 80rpx;
						   height: 80rpx;
						   border-radius: 50%;
					   }
					   .user-R-info{
						   padding-left: 25rpx;
						   .name{
							   font-size: 30rpx;
							   font-weight: 550;
							   padding: 5rpx 0;
						   }
						   .gxqm{
							   font-size: 26rpx;
							   @include ellipsis(1);
							   color: #BDBDBD;
						   }
					   }
				   }
				   .user-L{
					   margin-left: auto;
				   }
			   }
			   .art-C{
				   .content{
					   padding: 0 25rpx;
				   }
				   .title{
					   font-size: 35rpx;
					   font-weight: 550;
					   padding:15rpx 25rpx;
				   }
				   .img{
					   padding: 15rpx 25rpx;
					   .imgRow{
						   .row{
							   .col{
								   image{
									   height: 380rpx;
									   width: 100%;
									   border-radius: 15rpx;
								   }
							   }
							   .col-4{
								   image{
								   	   height: 230rpx;
								   	   width: 100%;
								   	   border-radius: 15rpx;
									   padding: 5rpx 0;
								   }
							   }
							   .col-6{
								   image{
								   	   height: 280rpx;
								   	   width: 100%;
								   	   border-radius: 15rpx;
								   	   padding: 5rpx 0;
								   }
							   }
						   }
					   }
				   }
				   .tv{
					   padding: 25rpx;
					   video{
						   width: 100%;
						   border-radius: 25rpx;
					   }
				   }
				   .timer{
					   padding: 0 25rpx;
					   color: #9E9E9E;
					  
				   }
				   .artinfo{
				   	   @include flex;
					   color: #9E9E9E;
					   padding: 15rpx 0;
				   	   image{
				   		   height: 54rpx;
				   		   width: 54rpx;
				   	   }
				   	   .artinfo-item{
				   		   padding:0 25rpx;
				   		   @include flex;
				   	   }
				   }
			   }
			   .art-B{
				   .swiper{
				   	    height: 60vh;
				   	    width: 100%;
						:deep(.uni-swiper-dot){
							border-radius: 0;
							height: 5px;
							width: 62rpx;
							border-radius: 3rpx;
							background: rgba(255,255,255,0.6);
						}
				   	    .swiper-item{
				   		    image{
				   			    height: 60vh;
				   			    width: 100%;
				   		    }
				   	    }
				   }
				   .tv{
						padding: 25rpx;
						video{
							width: 100%;
							height: 920rpx;
							border-radius: 25rpx;
						}
				   }
				   .content{
				   		padding: 0 25rpx;
				   }
				   .title{
				   		font-size: 35rpx;
				   		font-weight: 550;
				   		padding:15rpx 25rpx;
				   }
				   .timer{
					   padding: 25rpx;
					   color: #9E9E9E;
				   }
				   .artinfo{
					   @include flex;
					   color: #9E9E9E;
					   image{
						   height: 54rpx;
						   width: 54rpx;
					   }
					   .artinfo-item{
						   padding:0 25rpx;
						    @include flex;
					   }
				   }
			   }
			   .share{
				   @include flex-center;
				   justify-content: flex-start;
				   padding: 25rpx 15rpx;
				   .share-item{
					   @include flex;
					   flex-wrap: nowrap;
					   width: fit-content;
					   padding: 10rpx 25rpx;
					   margin: 0 15rpx;
					   background: #eee;
					   border-radius: 35rpx;
					   box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
					   button:after {
					     border: none;
					     background: none;
						 padding: 0;
						 margin: 0;
						 height: fit-content;
					   }
					   .share-item-text{
						   @include ellipsis(1);
						   height: fit-content;
						   font-size: 24rpx;
						   border: none;
						   background-color: transparent;
						   line-height: 24rpx;
						   padding: 0;
						   margin: 0;
						   outline: none;
						     /* 根据需要还可以移除其他默认样式，例如文本装饰、字体大小、颜色等 */
						   text-decoration: none;
					   }
					   image{
						   height: 42rpx;
						   width: 42rpx;
					   }
					   view{
						   @include flex-center;
						   padding: 0 2rpx;
					   }
				   }
				   
			   }
			   .comments{
				    padding: 20rpx 25rpx;
					.comments-H{
						font-size: 35rpx;
						font-weight: 550;
						padding: 25rpx 0;
					}
					.comments-C{
						.comments-C-I{
							display: flex;
							padding-bottom: 50rpx;
							.comments-C-I-L{
								width: 10%;
								image{
									width: 75rpx;
									height: 75rpx;
									border-radius: 50%;
								}
							}
							.comments-C-I-R{
								width: 90%;
								padding-left: 25rpx;
								.name{
									font-size: 32rpx;
									font-weight: 550;
								}
								.gxqm{
									color: #BDBDBD;
									font-size: 26rpx;
									padding-top: 3rpx;
								}
								.content{
									padding: 20rpx 0;
									font-size: 32rpx;
								}
								.timer{
									color: #9E9E9E;
									@include flex;
									.time{
															   
									}
									.text{
										padding-left: 25rpx;					   
									}
								}
								.hr{
									width: 100%;
									padding: 10rpx 0;
									border-bottom: 1rpx solid #eee;
								}
							}
						}
					}
			   }
			   .comments-content{
				   
			   }
		   }
	   }
</style>
