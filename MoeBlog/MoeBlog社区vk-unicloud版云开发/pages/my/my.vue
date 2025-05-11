<template>
	<z-paging ref="paging" v-model="artData" @query="queryList">
		<view class="my">
			<view class="userinfo">
				<view class="userinfo-ctx">
					<view class="userinfo-bj">
						<image mode="aspectFill" :src="background(vk.getVuex('$user.userInfo'))"></image>
					</view>
					<view class="info">
						<view class="info-ctx">
							<view class="info-top" @click="openPopup">
								<view class="iconS"></view>
								<view class="iconS"></view>
								<view class="iconS"></view>
							</view>
							<view class="info-center" @click="ToUsercenter">
								<view class="info-center-left">
									<view class="avatar">
										<view class="avatar-img">
											<avatar-item height="180" width="180"></avatar-item>
										</view>
										<view class="name">
											<view class="nameT">昵称:<text>{{username(vk.getVuex('$user.userInfo'))}}</text></view>
											<view class="gender">
												性别:<image :src="`../../static/img/${genderFn(userinfo.gender)}.png`">
												</image>
											</view>
											<view class="signT">签名:<text>{{gxqm(vk.getVuex('$user.userInfo'))}}</text></view>
											<!-- <view class="timer">
											{{vk.pubfn.timeFormat(userinfo.register_date,"yyyy-MM-dd")}}注册
										</view> -->
										</view>
									</view>
								</view>
								<view class="info-center-right">
									<u-icon name="arrow-right" size="35"></u-icon>
								</view>
							</view>
							<view class="info-bottom">
								<view class="info-bottom-item" @click="TomyFans('following')">
									<view>{{userNum.followerNum}}</view>
									<view>关注</view>
								</view>
								<view class="info-bottom-item" @click="TomyFans('fans')">
									<view>{{userNum.followingNum}}</view>
									<view>粉丝</view>
								</view>
								<view class="info-bottom-item" @click="TolikeArt">
									<view>{{userNum.likeNum}}</view>
									<view>喜欢</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="name">
				<image mode="aspectFill" src="/static/img/art_icon.png"></image>
				最新动态
			</view>
			<view class="art">
				<view class="art-C">
					<art-item v-for="item in artData" :key="item._id" :item="item"></art-item>
				</view>
			</view>
			<view class="leftPopup">
				<u-popup v-model="popupStatus" mode="left" :mask="true" z-index="99">
					<view class="popCtx">
						<view class="popItem" @click="TouserInfo">
							<view class="img">
								<image mode="aspectFill" :src="avatar(vk.getVuex('$user.userInfo'))"></image>
							</view>
							<view class="name">{{username(vk.getVuex('$user.userInfo'))}}</view>
							<view class="icon">
								<u-icon name="arrow-right" size="35"></u-icon>
							</view>
						</view>
						<scroll-view class="scroll" scroll-y>
							<u-cell-group class="cell" title="我的" :title-style="{height:'50px'}" border>
								<u-cell-item @click="ToUsercenter" icon="edit-pen" title="编辑资料"></u-cell-item>
								<u-cell-item @click="ToMyArt" icon="order" title="我的文章"></u-cell-item>
								<u-cell-item @click="TomyFans('fans')" icon="eye" title="我的粉丝"></u-cell-item>
								<u-cell-item @click="TomyFans('following')" icon="man-add" :border-bottom="false"
									title="我的关注"></u-cell-item>
							</u-cell-group>

							<u-cell-group class="cell" title="更多" :title-style="{height:'50px'}" border>
								<u-cell-item @click="ToMysquare" icon="grid" title="我的圈子"></u-cell-item>
								<u-cell-item icon="account" title="用户协议"></u-cell-item>
								<u-cell-item icon="eye" title="联系我们"></u-cell-item>
								<u-cell-item @click="ToMyAbout" icon="man-add" :border-bottom="false"
									title="关于我们"></u-cell-item>
								<u-cell-item v-if="vk.getVuex('$user.userInfo.role[0]') == 'admin'" @click="ToAdmin"
									icon="setting" :border-bottom="false" title="后台管理"></u-cell-item>
							</u-cell-group>

							<view class="btn" @click="logout">
								<button>退出登陆</button>
							</view>
						</scroll-view>
					</view>
				</u-popup>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
	import { ref } from "vue"
	import { onLoad, onShow, onReachBottom } from "@dcloudio/uni-app"
	import { username, avatar, gxqm, background } from "@/utils/utils.js"
	import { apiGetUserArt, apiGetUserFansNum } from "@/api/api.js"
	import { getCurrentInstance } from "vue";
	const { proxy } = getCurrentInstance();

	onLoad(() => {
		getUserFansNum()
	})
	onShow(() => {
		if (!vk.checkToken()) {
			// token无效
			vk.navigateTo('/pages/auth/auth');
		} else {
			// token有效
			userinfo.value = vk.getVuex('$user.userInfo')
		}
	})
	onReachBottom(() => {
		
	})
	const popupStatus = ref(false)
	const userinfo = ref({})
	const userNum = ref({
		followerNum: 0,
		followingNum: 0,
		likeNum: 0
	})
	const paging=ref(null)
	const artData = ref([])
	const loading = ref(true)

	function TolikeArt() {
		vk.navigateTo("/pages/my/pubMyArt")
	}

	function genderFn(num) {
		if (!("gender" in userinfo.value)) {
			return "Genderunknown"
		}
		switch (num) {
			case 0:
				return "man"
				break;
			case 1:
				return "woman"
				break;
		}
	}

	function queryList(pageNo, pageSize) {
		let data={pageNo, pageSize,Audit: 0}
		apiGetUserArt(data).then(res => {
			paging.value.complete(res.result)
		})
	}

	function TouserInfo() {
		proxy.$framePostman.send({ type: 'USER_PAGE', id: vk.getVuex('$user.userInfo')._id });
	}

	function tabChange(e) {
		tabCurrent.value = e
		pageIndex.value = 1
	}

	function openPopup() {
		//打开popup弹窗
		popupStatus.value = true
		console.log(popupStatus.value)
	}

	function closePopup() {
		// popupStatus.value=false
		//关闭popup弹窗
	}

	function logout() {
		//退出登陆账号
		vk.userCenter.logout({
			success: (data) => {
				// 退出登录成功后的逻辑
				vk.reLaunch('/pages/auth/auth');
			}
		});
	}

	function getUserFansNum() {
		apiGetUserFansNum().then(res => {
			userNum.value.followerNum = res.follower_Num
			userNum.value.followingNum = res.following_Num
			userNum.value.likeNum = res.like_Num
		})
	}

	function ToUsercenter() {
		vk.navigateTo("/pages/my/userCenter")
	}

	function ToMyArt() {
		vk.navigateTo("/pages/my/myArt")
	}

	function ToMysquare() {
		vk.navigateTo('/pages/square/Mysquare');
	}

	function TomyFans(e) {
		vk.navigateTo('/pages/my/myFans?type=' + e);
	}

	function ToMyAbout() {
		vk.navigateTo('/pages/my/myAbout')
	}

	function ToAdmin() {
		vk.navigateTo('/pages/Admin/Admin')
	}
</script>

<style lang="scss">
	.my {
		.userinfo {
			.userinfo-ctx {
				position: relative;

				.userinfo-bj {
					height: 480rpx;
					width: 100%;

					image {
						height: 480rpx;
						width: 100%;
					}
				}

				.info {
					width: 100%;
					height: 480rpx;
					position: absolute;
					top: 0;
					left: 0;
					background: rgba(0, 0, 0, 0.1);
					padding: 25rpx;

					.info-ctx {
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						height: 100%;

						.info-top {
							height: 33%;
							width: fit-content;
							@include flex;
							align-items: flex-start;
							padding-top: 25rpx;

							.iconS {
								height: 15rpx;
								width: 15rpx;
								border-radius: 50%;
								margin: 0 4rpx;
							}

							.iconS:nth-child(1) {
								background: #FC5F56;
							}

							.iconS:nth-child(2) {
								background: #F9BE37;
							}

							.iconS:nth-child(3) {
								background: #20C637;
							}
						}

						.info-center {
							height: 33%;
							@include flex;
							padding-left: 25rpx;

							.info-center-left {
								.avatar {
									@include flex;

									.avatar-img {
										// width: 130rpx;
										// height: 130rpx;
										// image{
										// 	width: 130rpx;
										// 	height: 130rpx;
										// 	border-radius: 50%;
										// }
									}

									.name {
										font-size: 33rpx;
										color: #fff;
										// font-weight: 550;
										padding: 0 25rpx;
										display: flex;
										flex-direction: column;
										align-items: flex-start;

										.nameT {
											font-weight: 550;

											text {
												padding-left: 15rpx;
											}
										}

										.signT {
											color: #eee;
											@include ellipsis(2);
											font-size: 27rpx;
											font-weight: 550;

											text {
												padding-left: 10rpx;
											}
										}

										.gender {
											@include flex;
											padding: 15rpx 0;
											font-size: 27rpx;

											image {
												padding-left: 25rpx;
												width: 32rpx;
												height: 32rpx;
											}
										}

										.timer {
											// padding: 10rpx 0;
											color: #eee;
											font-size: 27rpx;
										}
									}
								}

							}

							.info-center-right {
								margin-left: auto;
								width: 20%;
								display: flex;
								justify-content: flex-end;
							}
						}

						.info-bottom {
							height: 33%;
							@include flex-center;
							align-items: flex-end;
							color: #fff;
							font-size: 27rpx;
							font-weight: 550;

							.info-bottom-item {
								@include flex;
								// flex-direction: column;
								padding: 0 50rpx;
							}
						}
					}
				}
			}
		}

		.name {
			padding: 25rpx 25rpx 0 25rpx;
			font-weight: 550;
			font-size: 32rpx;
			@include flex;

			image {
				height: 52rpx;
				width: 52rpx;
				padding-right: 15rpx;
			}
		}

		.art {
			padding: 0 25rpx;

			.art-c {}
		}

		.leftPopup {
			box-sizing: border-box;

			.popCtx {
				height: 100vh;
				width: 75vw;
				background: #F7F7F7;
				padding: 0 25rpx;
				/* #ifdef H5 */
				padding-top: 88rpx;
				padding-left: 25rpx;
				padding-right: 25rpx;
				height: calc(100vh - 88rpx);

				/* #endif */
				.popItem {
					@include flex;

					.img {
						image {
							height: 70rpx;
							width: 70rpx;
							border-radius: 50%;
						}
					}

					.name {
						padding: 0 25rpx;
						font-weight: 550;
					}

					.icon {
						margin-left: auto;
					}
				}

				.scroll {
					height: 80vh;
					/* #ifdef MP */
					height: 90vh;

					/* #endif */
					.cell {
						border-radius: 15rpx;
						background: #fff;
						margin-top: 25px;
					}

					.btn {
						padding: 50rpx 0;

						button {
							background: #FF2B2B;
							border-radius: 15rpx;
							color: #fff;
							font-weight: 550;
						}
					}
				}
			}
		}
	}
</style>