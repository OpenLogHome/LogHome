<template>
	<z-paging ref="paging" v-model="artData" @query="queryList">
		<view class="userinfo">
			<view class="userinfo-ctx">
				<view class="userinfo-bj">
					<image mode="aspectFill" :src="background(userinfo)"></image>
					<!-- <view class="back" >
					<u-icon @click="Toindex" name="arrow-left"></u-icon>
				</view> -->
				</view>
				<view class="userinfo-C">
					<view class="userinfo-H">
						<view class="avatar">
							<avatar-item :height="220" :width="220" :avatar="avatar(userinfo)"
								:frame="frame(userinfo)"></avatar-item>
						</view>
						<view class="info">
							<view class="name info-I">
								{{username(userinfo)}}
								<image mode="aspectFill" :src="`../../static/img/${Gender()}.png`"></image>
							</view>
							<view class="gender info-I">

							</view>
							<view class="timer info-I">{{vk.pubfn.timeFormat(userinfo.register_date,"yyyy-MM-dd")}}注册
							</view>
						</view>
						<view class="gz" @click="userLikeFn" v-if="user_id != current_user_id">
							<u-tag :text="userFollower.isT?'已关注':'关注'" shape="square" />
						</view>
					</view>
					<view class="infos">
						<view class="infos-I">
							<text>{{userinfoNum.concernNum}}</text>关注
						</view>
						<view class="infos-I">
							<text>{{userinfoNum.fansNum}}</text>粉丝
						</view>
						<view class="infos-I">
							<text>{{userinfoNum.artNum}}</text>帖子
						</view>
					</view>
					<view class="gxqm">
						<text>个性签名</text>
						{{gxqm(userinfo)}}
					</view>
				</view>

				<view class="art">
					<view class="title">
						<image mode="aspectFill" src="/static/img/art_icon.png"></image>
						最新动态
					</view>
					<view class="art-C">
						<art-item v-for="item in artData" :key="item._id" :item="item"></art-item>
					</view>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
	import { ref } from "vue"
	import { onLoad, onReachBottom } from "@dcloudio/uni-app"
	import { apiGetUserInfo, apiGetUserArtList, apiAddUserLike, apiDelUserLike } from "@/api/api.js"
	import { avatar, username, gxqm, background, gender, frame } from "@/utils/utils.js"
	onLoad((id) => {
		user_id.value = id.id
		getUserInfo()
	})
	onReachBottom(() => {
		
	})
	const user_id = ref("")
	const current_user_id = ref(vk.getVuex('$user.userInfo')._id || "")
	const userinfo = ref({})
	const artData = ref([])
	const paging=ref(null)
	const userFollower = ref({
		_id: "",
		isT: false
	})
	const userinfoNum = ref({
		artNum: "", //文章总数
		fansNum: "", //粉丝总数
		concernNum: "" //关注总数
	})

	function getUserInfo() {
		let data = {
			id: user_id.value,
			currentUserId: vk.getVuex('$user.userInfo')._id ? vk.getVuex('$user.userInfo')._id : ''
		}
		//查询用户信息
		apiGetUserInfo(data).then(res => {
			userinfo.value = res.result.rows[0]
			userinfoNum.value.fansNum = res.followingNum
			userinfoNum.value.concernNum = res.followerNum
			if ("LikeInfo" in res.result.rows[0]) {
				userFollower.value._id = res.result.rows[0].LikeInfo._id
				userFollower.value.isT = true
			}
		})
	}

	function Toindex() {
		console.log(123)
		vk.navigateTo('/pages/index/index');
	}

	function queryList(pageNo, pageSize) {
		let data = {
			pageNo,
			pageSize,
			_id: user_id.value
		}
		//查询用户的文章信息
		apiGetUserArtList(data).then(res => {
			userinfoNum.value.artNum = res.result.total
			paging.value.complete(res.result.rows)
		})
	}

	function Gender() {
		if (!("gender" in userinfo.value)) {
			return "Genderunknown"
		}
		switch (userinfo.value.gender) {
			case 0:
				return "man"
				break;
			case 1:
				return "woman"
				break;
		}
	}

	function userLikeFn() {
		let data = {
			follower_id: vk.getVuex('$user.userInfo')._id, //关注人的ID
			following_id: user_id.value //被关注人的ID
		}
		if (userFollower.value.isT) {
			//已经关注 点击取消关注
			apiDelUserLike({ id: userFollower.value._id }).then(res => {
				userFollower.value.isT = false
				userFollower.value._id = ""
				userinfoNum.value.fansNum -= 1
			})
		} else {
			//当前用户对此还没有关注 点击关注
			if (!vk.checkToken()) {
				// token无效
				vk.toast("请登陆后在操作")
				return
			}
			if (data.follower_id.length != 0 && data.following_id.length != 0) {
				apiAddUserLike(data).then(res => {
					userFollower.value._id = res.result
					userFollower.value.isT = true
					userinfoNum.value.fansNum += 1
				})
			} else {
				vk.toast('请登陆');
			}
		}
	}
</script>

<style lang="scss">
	.userinfo {
		.userinfo-ctx {
			position: relative;

			.userinfo-bj {
				position: relative;
				z-index: -1;
				height: 520rpx;
				width: 100%;

				image {
					height: 480rpx;
					width: 100%;
				}

				.back {
					position: absolute;
					top: 70rpx;
					left: 50rpx;
					width: 60rpx;
					height: 60rpx;
					@include flex-center;
					background: #fff;
					border-radius: 50%;
				}
			}

			.userinfo-C {
				position: relative;
				z-index: 99;
				margin-top: -100rpx;
				width: 100%;
				background: #fff;
				border-top-left-radius: 35rpx;
				border-top-right-radius: 35rpx;
				padding: 25rpx;

				//border-bottom: 3px solid #eee;
				.userinfo-H {
					@include flex;
					padding: 0 25rpx;

					.avatar {
						padding: 25rpx 0;

						image {
							height: 150rpx;
							width: 150rpx;
							border-radius: 50%;
						}
					}

					.info {
						padding: 0 25rpx;
						@include flex;
						align-items: flex-start;
						flex-direction: column;

						.info-I {
							padding: 5rpx 0;
						}

						.name {
							font-size: 35rpx;
							font-weight: 550;
							@include flex;

							image {
								height: 28rpx;
								width: 28rpx;
								padding-left: 25rpx;
							}
						}

						.timer {
							color: #bdbdbd;
						}
					}

					.gz {
						margin-left: auto;
					}
				}

				.infos {
					@include flex;

					.infos-I {
						width: 33%;
						@include flex-center;

						text {
							font-size: 32rpx;
							font-weight: 550;
						}
					}
				}

				.gxqm {
					padding: 35rpx 25rpx 0 25rpx;
					@include flex;

					text {
						color: #bdbdbd;
						font-size: 25rpx;
						padding: 10rpx 20rpx;
						background: #eee;
						border-radius: 15px;
						margin-right: 15rpx;
					}
				}
			}

			.art {
				padding: 25rpx;

				.title {
					@include flex;
					font-size: 32rpx;
					font-weight: 550;

					image {
						height: 48rpx;
						width: 48rpx;
						padding-right: 15rpx;
					}
				}
			}
		}
	}
</style>