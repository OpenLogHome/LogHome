<template>
	<view class="addSquare">
		<view class="addSquare-C">
			<view class="bj-C">
				<view class="bg">
					<image v-if="squareInfo.backgroundUrl" mode="aspectFill" :src="squareInfo.backgroundUrl.path"></image>
				</view>
				<view class="avatar">
					<view class="avatar-C">
						<view class="avatar-I">
							<view class="icon" v-if="!squareInfo.avatarUrl">
								<uni-icons type="camera" size="30"></uni-icons>
							</view>
							<image v-else mode="aspectFill" :src="squareInfo.avatarUrl.path"></image>
						</view>
						<view class="info">
							<view class="title">
								{{squareInfo.name}}
							</view>
							<view class="desc">
								{{squareInfo.description}}
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="infos">
				<view class="info-I">
					<view class="name"><text>*</text>圈子头像:</view>
					<view class="R">
						<u-button @click="avatarFn" size="mini" type="success">点击上传头像</u-button>
					</view>
				</view>

				<view class="info-I">
					<view class="name"><text>*</text>圈子背景:</view>
					<view class="R">
						<u-button @click="bgFn" size="mini" type="success">点击上传背景</u-button>
					</view>
				</view>

				<view class="info-I">
					<view class="name"><text>*</text>圈子名称:</view>
					<view class="R">
						<input v-model="squareInfo.name" placeholder="请输入圈子名称" />
					</view>
				</view>

				<view class="info-I">
					<view class="name"><text>*</text>圈子简介:</view>
					<view class="R">
						<textarea v-model="squareInfo.description" placeholder="请输入圈子简介" />
					</view>
				</view>

				<view class="info-I" @click="OpenSel">
					<view class="name"><text>*</text>选择父圈子:</view>
					<view class="R tax">
						{{squareSel}}>
					</view>
				</view>

			</view>

			<view class="text">
				请认真仔细阅读<text @click="goToAgreement">《圈主协议》</text>，若所见圈子内涉及时政，色
				情，暴力，无资质荐股，推币等违法内容传播，官方将立即永
				久封停留子和账号，请各用户自觉博守国家法律和平台规则。
			</view>

			<view class="btn">
				<u-button @click="sub" type="primary">申请创建</u-button>
			</view>

			<u-select @cancel="Cancel" @confirm="Sel" v-model="squareT" :list="squareList"></u-select>
		</view>
	</view>
</template>

<script setup>
	import {apiGetSquare1,apiAddSquare} from "@/api/api.js"
	import {ref} from "vue"
	import {onLoad} from "@dcloudio/uni-app"
	onLoad(() => {
		getSquare()
	})
	const squareSel = ref("选择圈子")
	const squareT = ref(false)
	const squareList = ref([])
	const squareData = ref({})
	const squareInfo = ref({
		description: "",
		name: "",
		avatarUrl: null,
		backgroundUrl: null,
		parent_id: ""
	})


	function avatarFn() {
		uni.chooseImage({
			count: 1, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: function(res) {
				squareInfo.value.avatarUrl = res.tempFiles[0]
			}
		});
	}

	function bgFn() {
		uni.chooseImage({
			count: 1, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: function(res) {
				squareInfo.value.backgroundUrl = res.tempFiles[0]
			}
		});
	}

	function getSquare() {
		apiGetSquare1().then(res => {
			squareData.value = res.result.rows
			squareData.value.forEach((item, index) => {
				let obj = {
					value: item._id,
					label: item.name,
				}
				squareList.value.push(obj)
			})
		})
	}

	function OpenSel() {
		squareT.value = true
	}

	function Sel(e) {
		console.log(e)
		squareInfo.value.parent_id = e[0].value
		squareSel.value = e[0].label
	}

	function sub() {
		if (!vk.checkToken()) {
		  // token无效
		  vk.navigateTo('/pages/auth/auth')
		}
		let isT = isAllPropertiesFilled(squareInfo)
		if (isT) {
			Upimg().then(res=>{
				apiAddSquare(squareInfo.value).then(res=>{
					vk.toast("申请圈子分类成功,等待管理员审核")
					setTimeout(()=>{
						vk.navigateTo('/pages/square/square');
					},1500)
					console.log(res)
				})
			})
		} else {
			vk.toast('请检测所有带*的号是否输入完毕 包过头像和背景');
		}
	}

	function Cancel() {

	}

	function isAllPropertiesFilled(objRef) {
		const obj = objRef.value;
		return Object.values(obj).every(value => value !== undefined && value !== null && value !== "" && !(Array.isArray(
			value) ? value.length === 0 : false));
		// 判断非空对象、非空字符串、非数组为空数组
	}
	async function Upimg() {
		for (let i = 0; i < 2; i++) {
			await vk.uploadFile({
				title: "图片上传中...",
				file: i==0?squareInfo.value.avatarUrl:squareInfo.value.backgroundUrl,
				success: (res) => {
					// 上传成功
					let url = res.url;
					if(i==0){
						let arr=[url]
						squareInfo.value.avatarUrl=arr
					}else{
						let arr=[url]
						squareInfo.value.backgroundUrl=arr
					}
				},
				fail: (err) => {
					// 上传失败

				}
			});
		}
	}

	function goToAgreement() {
		// 实现跳转到《圈主协议》的逻辑
		uni.navigateTo({
			url: '/pages/userinfo/GroupOwnerAgreement'
		});
	}
</script>

<style lang="scss">
	page {
		box-sizing: border-box;
	}

	.addSquare {
		.addSquare-C {
			padding: 25rpx;

			.bj-C {
				box-sizing: border-box;
				position: relative;
				width: 100%;
				height: 350rpx;
				background: rgba(0, 0, 0, 0.1);
				border-radius: 25rpx;

				.bg {
					top: 0;
					position: absolute;
					height: 350rpx;
					width: 100%;
					background: #686868;
					border-radius: 25rpx;
					z-index: -1;

					image {
						width: 100%;
						height: 350rpx;
					}
				}

				.avatar {
					position: relative;
					z-index: 9;
					height: 350rpx;
					width: 100%;
					padding: 0 25rpx;
					@include flex;

					.avatar-C {
						@include flex;

						.avatar-I {
							height: 180rpx;
							width: 180rpx;
							border-radius: 50%;
							background: #f7f7f7;

							.icon {
								width: 180rpx;
								height: 100%;
								@include flex-center;
							}

							image {
								height: 180rpx;
								width: 180rpx;
								border-radius: 50%;
							}
						}

						.info {
							padding-left: 25rpx;
							height: 180rpx;
							width: 100%;

							.title {
								font-size: 35rpx;
								font-weight: 550;
								@include ellipsis(1);
								margin: 15rpx 0;
								color: #fff
							}

							.desc {
								@include ellipsis(2);
								font-size: 30rpx;
								color: #fff
							}
						}
					}
				}
			}

			.infos {
				.info-I {
					@include flex;
					padding: 25rpx 0;
					border-bottom: 1px solid #eee;
					box-sizing: border-box;

					.name {
						font-size: 26rpx;
						font-weight: 550;
						padding-right: 50rpx;
						width: 30%;
						white-space: nowrap;
						@include flex;

						text {
							padding: 0 5rpx;
							color: red;
							font-size: 28rpx;
						}
					}

					.R {
						width: 70%;

						textarea {
							width: 90%;
							height: 220rpx;
						}
					}

					.tax {
						@include flex;
						justify-content: flex-end;
						padding: 0 25rpx;
					}
				}
			}

			.text {
				padding-top: 50rpx;
				font-size: 24rpx;
				color: #BDBDBD;

				text {
					color: #2FA5FF;
				}
			}

			.btn {
				margin-top: 100rpx;
			}
		}
	}
</style>