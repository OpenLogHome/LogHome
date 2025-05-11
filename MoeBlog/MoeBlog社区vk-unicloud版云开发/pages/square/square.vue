<template>
	<z-paging ref="paging" v-model="squareList" @query="queryList">
		<view class="square">
			<view class="name">圈子文章</view>
			<view class="square-C">
				<view class="square-I mgt25 bdr15" v-for="item in squareList" :key="item._id">
					<view class="square-info" @click="Tosquare(item._id)" >
						<view class="square-info-L">
							<view class="square-name">
								<image src="../../static/img/square.png"></image>
								<text>{{item.name}}</text>
							</view>
							<view class="square-desc">
								<text>{{item.count || 0}}动态</text> <text>{{item.fans_count || 0}}用户</text>
							</view>
						</view>
						<view class="square-info-R">
							<image mode="aspectFill" :src="item.avatarUrl"></image>
						</view>
					</view>
					<view class="square-art" v-if="item.artList.length!=0">
						<view class="square-art-I" v-for="items in item.artList" @click="ToArt(items._id)">
							<view class="square-art-L">
								<view class="userinfo">
									<image :src="avatar(items.userinfo)" mode="aspectFill"></image>
									<text>{{username(items.userinfo)}}</text>
								</view>
								<view class="title">{{items.title}}</view>
								<view class="content">
									{{items.content}}
								</view>
								<view class="btm">
									<text>发布于 {{items._add_time_str.slice(0,10)}}</text>
								</view>
							</view>
							<view class="square-art-R" v-if="items.coverImg.length!=0">
								<image :src="items.coverImg[0]" mode="aspectFill"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
	import { ref, onMounted, onUnmounted, computed } from "vue"
	import { onLoad, onReachBottom, onShareTimeline, onShareAppMessage } from "@dcloudio/uni-app"
	import { apiGetSquare } from "@/api/api.js"
	import { username, avatar } from "@/utils/utils"
	
	onLoad(() => {
		
	})
	onReachBottom(() => {
		
	})
	onShareAppMessage((res) => {

	})
	//分享盆友圈
	onShareTimeline((res) => {

	})
	const squareList = ref([])
	const loading = ref(false)
	const paging=ref(null)

	function queryList(pageNo, pageSize) {
		let obj={pageNo,pageSize}
		console.log(obj)
		apiGetSquare(obj).then(res => {
			paging.value.complete(res.result.rows)
		})
	}

	function ToAllSquare() {
		vk.navigateTo('/pages/square/allSquare');
	}

	function Tosquare(id) {
		if (id === '') {
			return 0;
		}
		vk.navigateTo('/pages/square/squareInfo?id=' + id);
	}

	function ToArt(id) {
		vk.navigateTo('/pages/art/art?id=' + id);
	}
</script>

<style lang="scss">
	page {
		box-sizing: border-box;
	}

	.square {
		.name {
			padding: 0 25rpx;
			font-size: 28rpx;
			font-weight: 550;
			border-left: 5rpx solid black;
		}

		.square-C {
			padding: 0 25rpx;

			.square-I {
				background-position: center;
				background-repeat: no-repeat;
				background-size: cover;
				.square-info {
					@include flex;
					padding: 35rpx 25rpx;
					background-color: rgba(255, 255, 255, 0.3);
					backdrop-filter: blur(5rpx);
					.square-info-L {
						margin-right: auto;
						width: 80%;

						.square-name {
							@include flex;
							height: fit-content;
							box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
							width: fit-content;
							border-radius: 35rpx;
							padding: 10rpx 20rpx;
							@include flex;
							margin-right: auto;
							font-size: 25rpx;
							margin-bottom: 25rpx;

							image {
								height: 36rpx;
								width: 36rpx;
							}

							text {
								padding-left: 5rpx;
							}
						}

						.square-desc {
							padding-right: 25rpx;
							@include ellipsis(2);
							font-size: 26rpx;

							text {
								padding: 0 10rpx;
							}
						}
					}

					.square-info-R {
						width: 20%;

						image {
							width: 120rpx;
							height: 120rpx;
							border-radius: 50%;
						}
					}
				}

				.square-art {
					.square-art-I {
						margin: 15rpx 0;
						background: #F8F8F8;
						padding: 15rpx;
						@include flex;
						box-sizing: border-box;
						align-items: flex-start;

						.square-art-L {
							width: 75%;

							.userinfo {
								@include flex;

								image {
									height: 50rpx;
									width: 50rpx;
									border-radius: 50%;
									margin-right: 15rpx;
								}

								text {
									font-size: 28rpx;
									font-weight: 550;
								}
							}

							.title {
								margin: 10rpx 0;
								@include ellipsis(2);
								font-size: 25rpx;
								font-weight: 550;
							}

							.content {
								margin: 10rpx 0;
								@include ellipsis(2);
								margin-right: 15rpx;
								font-size: 25rpx;
							}

							.btm {
								padding-top: 15rpx;
								font-size: 22rpx;
								color: #9E9E9E;

								text {
									margin-right: 25rpx;
								}
							}
						}

						.square-art-R {
							width: 25%;
							padding-top: 15rpx;

							image {
								width: 160rpx;
								height: 160rpx;
								border-radius: 10rpx;
							}
						}
					}
				}
			}
		}
	}
</style>