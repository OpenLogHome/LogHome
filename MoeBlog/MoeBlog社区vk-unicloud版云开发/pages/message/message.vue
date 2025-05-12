<template>
	<view class="msg">
		<view class="msg-ctx">
			<view class="msg-head">
				<view class="msg-head-item item1" @click="Tolike">
					<view class="msg-img">
						<image src="/static/img/zan.png"></image>
					</view>
					<text>喜欢</text>
				</view>
				<view class="msg-head-item item2" @click="Tofans">
					<view class="msg-img">
						<image src="/static/img/user.png"></image>
					</view>
					<text>关注</text>
				</view>
				<view class="msg-head-item item3" @click="Tocomments">
					<view class="msg-img">
						<image src="/static/img/msg.png"></image>
					</view>
					<text>评论</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue"
function Tocomments(){
	vk.navigateTo('/pages/comments_detail/comments_content');
}
function Tolike(){
	vk.navigateTo("/pages/my/pubMyArt")
}
function Tofans(){
	vk.navigateTo('/pages/my/myFans?type='+"follower_id")
}
</script>

<style lang="scss">
	page{
		background: #F5F5F5;
	}
	.msg{
		padding: 25rpx;
		.msg-ctx{
			.msg-head{
				@include flex;
				justify-content: space-between;
				padding: 0 50rpx;
				.msg-head-item{
					.msg-img{
						padding:18rpx;
						border-radius: 15rpx;
						@include flex-center;
						image{
							width: 45rpx;
							height: 45rpx;
						}
					}
					text{
						padding: 15rpx 0;
						font-size: 28rpx;
						color: #BDBDBD;
					}
					&.item1{
						.msg-img{
							background: #FF5267;
						}
					}
					&.item2{
						.msg-img{
							background: #3395FF;
						}
					}
					&.item3{
						.msg-img{
							background: #27E4A7;
						}
					}
					@include flex;
					flex-direction: column;
				}
			}
		}
	}

</style>
