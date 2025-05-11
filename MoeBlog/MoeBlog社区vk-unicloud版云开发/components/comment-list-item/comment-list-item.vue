<template>
	<view class="comments-list">
		<view class="comments-C">
			<view class="comments-C-I">
				<view class="comments-C-I-L">
					<image mode="aspectFill" :src="avatar(prpop.item.userinfo)"></image>
				</view>
				<view class="comments-C-I-C">
					<view class="name">{{username(prpop.item.userinfo)}}</view>
					<view class="gxqm">{{gxqm(prpop.item.userinfo)}}</view>
					<view class="content">{{prpop.item.content}}</view>
					<view class="timer">
						<view class="time">{{prpop.item._add_time_str.slice(0,10)}}</view>
						<view class="text">回复</view>
					</view>
					<view class="more" v-if="'children' in prpop.item && prpop.item.children.length!=0" @click.stop="Tocomments({comments_id:prpop.item._id,art_id:prpop.item.art_id})">
						<text>共{{prpop.item.children.length}}条评论</text>
						<uni-icons type="right" size="18"></uni-icons>
					</view>
					<view class="hr"></view>
				</view>
				<view class="comments-C-I-R" v-if="user_id == prpop.item.user_id" @click.stop="Delcomment(prpop.item._id)">
					删除
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from "vue";
import {avatar,username,gxqm} from "@/utils/utils.js"
import { apiDelComments } from "@/api/api";
	const prpop=defineProps(["item"])
	const emit=defineEmits(["delComment"])
	const user_id=ref(vk.getVuex('$user.userInfo')._id)
    function Tocomments(obj){
		obj.username=prpop.item.content
		let data=JSON.stringify(obj)
		vk.navigateTo('/pages/comments_detail/comments_detail?item='+data);
	}
	function Delcomment(id){
		// 简写
		vk.confirm("是否删除此评论", (res) => {
		  if (res.confirm) {
		    // 点击确定按钮后的回调
			let data={
				_id:prpop.item._id,
				art_id:prpop.item.art_id
			}
			if(prpop.item.parent_id != ""){
				data.parent_id=prpop.item.parent_id
			}
			apiDelComments(data).then(res=>{
				emit("delComment",prpop.item._id)
				console.log(res)
			})
		  }
		});
	}
</script>

<style lang="scss">
	.comments-list {
		.comments-C {
			.comments-C-I {
				display: flex;
				padding-bottom: 50rpx;

				.comments-C-I-L {
					width: 10%;

					image {
						width: 75rpx;
						height: 75rpx;
						border-radius: 50%;
					}
				}

				.comments-C-I-C {
					width: 80%;
					padding-left: 25rpx;

					.name {
						font-size: 32rpx;
						font-weight: 550;
					}

					.gxqm {
						color: #BDBDBD;
						font-size: 26rpx;
						padding-top: 3rpx;
					}

					.content {
						padding: 20rpx 0;
						font-size: 32rpx;
					}

					.timer {
						color: #9E9E9E;
						@include flex;

						.time {}

						.text {
							padding-left: 25rpx;
						}
					}
					.more{
						@include flex;
						padding: 15rpx 0;
						font-weight: 550;
						text{
							padding-right: 15rpx;
						}
					}

					.hr {
						width: 100%;
						padding: 10rpx 0;
						border-bottom: 1rpx solid #eee;
					}
				}
				.comments-C-I-R{
					width: 10%;
					color: #F44336;
				}
			}
		}
	}
</style>