<template>
	<z-paging ref="paging" v-model="commentsData" @query="queryList">
		<view class="comments_content">
			<view class="comments-C">
				<view class="comments-I" v-for="item in commentsData" :key="item._id" @click="ToArt(item.art_info._id)">
					<view class="user">
						<view class="avatar">
							<image mode="aspectFill" :src="avatar(item.userinfo)"></image>
						</view>
						<view class="name">{{username(item.userinfo)}}</view>
						<view class="level">
							用户{{item.parent_id!=""?"回复":"评论"}}了你的{{item.parent_id!=""?"评论":"动态"}}
						</view>
					</view>
					<view class="content">
						<view class="text">
							{{item.content}}
						</view>
						<view class="img">
							<image v-if="'coverImg' in item.art_info" mode="aspectFill"
								:src="item.art_info.coverImg[0]"></image>
						</view>
					</view>
					<view class="timer">
						{{vk.pubfn.timeFormat(item._add_time,"yyyy-MM-dd hh:mm")}}
					</view>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
	import { ref } from "vue"
	import { onLoad, onReachBottom } from "@dcloudio/uni-app"
	import { apiGetUserComments } from "@/api/api.js"
	import { username, avatar } from "@/utils/utils"
	onLoad(() => {

	})
	onReachBottom(() => {

	})
	const paging = ref(null)
	const commentsData = ref([])

	function queryList(pageNo, pageSize) {
		let data = { pageNo, pageSize }
		apiGetUserComments(data).then(res => {
			paging.value.complete(res.result.rows)
		})
	}

	function ToArt(id) {
		vk.navigateTo('/pages/art/art?id=' + id);
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.comments_content {
		.comments-C {
			padding: 0 25rpx;

			.comments-I {
				margin: 25rpx 0;
				width: 100%;
				background: #F8F8F8;
				border-radius: 10rpx;
				padding: 25rpx;

				.user {
					@include flex;

					.avatar {
						image {
							height: 50rpx;
							width: 50rpx;
							border-radius: 50%;
						}
					}

					.name {
						padding-left: 15rpx;
						font-size: 28rpx;
						font-weight: 550;
					}

					.level {
						padding-left: 35rpx;
						font-size: 26rpx;
						color: #BDBDBD;
					}
				}

				.content {
					padding: 10rpx 0;
					@include flex;
					align-items: flex-start;

					.text {
						width: 80%;
						@include ellipsis(3)
					}

					.img {
						width: 20%;
						height: 100rpx;
						padding-left: 10rpx;

						image {
							height: 110rpx;
							width: 110rpx;
							border-radius: 10rpx;
						}
					}
				}

				.timer {
					//padding-top: 25rpx;
					color: #BDBDBD;
				}
			}
		}
	}
</style>