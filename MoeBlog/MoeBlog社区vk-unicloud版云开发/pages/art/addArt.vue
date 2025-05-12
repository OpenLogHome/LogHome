<template>
	<view class="addArt">
		<view class="addArt-C">
			<view class="addArt-I">
				<view class="head">
					<view class="reset" @click="reset">重置</view>
					<u-button @click="posts" size="mini" type="primary" class="addArt-btn">发布</u-button>
				</view>
			</view>
			<view class="addArt-I">
				<input v-model="artCtx.title" placeholder="请输入标题" class="title" />
			</view>
			<view class="addArt-I">
				<textarea v-model="artCtx.content" auto-height maxlength="-1" class="content"
					placeholder="输入要发布的内容"></textarea>
			</view>
			<view class="addArt-I">
				<view class="upIcon">
					<view class="upimg" @click="switchIcon('img')">
						<uni-icons type="images" size="33" :color="currentIcon === 'img' ? '#03A9F4' : ''"></uni-icons>
					</view>
					<view class="uptv" @click="switchIcon('tv')">
						<uni-icons type="videocam" size="33" :color="currentIcon === 'tv' ? '#03A9F4' : ''"></uni-icons>
					</view>
				</view>
				<view class="upBtn">
					<view class="img" v-if="currentIcon === 'img'">
						<uni-file-picker ref="files" v-model="imageValue" :auto-upload="false" fileMediatype="image"
							mode="grid" file-extname="png,jpg" @select="selectImage" @delete="del" :limit="9" title="上传图片">
							<uni-icons type="plusempty" size="20"></uni-icons>
						</uni-file-picker>
					</view>
					<view class="tv" v-if="currentIcon === 'tv'">
						<uni-file-picker ref="files" v-model="videoValue" :auto-upload="false" fileMediatype="video"
							@select="selectVideo" @delete="delTv" :limit="1">
							<view class="tvCss">+</view>
						</uni-file-picker>
					</view>
				</view>
			</view>
			<view class="addArt-I">
				<view class="cell">
					<view class="cell-item" @click="openPop">
						<view class="cell-L">
							<u-icon class="iconL" name="moments" color="#16D46B" size="38"></u-icon>
							{{ selText }}
						</view>
						<view class="cell-R">{{ squareText }}<u-icon class="iconR" name="arrow-right"
								size="28"></u-icon></view>
					</view>
					<!-- <view class="cell-item">
						<view class="cell-L">显示文章</view>
						<view class="cell-R">
							<switch :checked="artCtx.art_status" @change="switchS"></switch>
						</view>
					</view> -->
					<!-- <view class="cell-item">
						<view class="cell-L">轮播图展示图片</view>
						<view class="cell-R">
							<switch :checked="artCtx.Carousel" @change="switchC"></switch>
						</view>
					</view> -->
				</view>
			</view>
		</view>
		<u-popup mode="bottom" v-model="popStatus">
			<view class="popup-ctx">
				<view class="pop-title">选择圈子</view>
				<square-item type="sel" @callBack="callBack"></square-item>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import { onLoad } from "@dcloudio/uni-app";
	import { apiAddArt, apiUpArt, apiGetArtDetail } from "@/api/api.js";
	import { getCheck } from "@/utils/check.js";

	const imageValue = ref([]);
	const videoValue = ref([]);
	const files = ref(null);
	const popStatus = ref(false);
	const squareText = ref("");
	const selText = ref("未选择");
	const artCtx = ref({
		title: "",
		user_id: "",
		taxonmoy_id: "",
		content: "",
		art_status: true,
		view_count: 0,
		is_sticky: false,
		coverImg: [],
		coverVideo: [],
		Carousel: false,
	});
	const currentIcon = ref("img");
	const update = ref(false);
	const id = ref(0);

	onLoad(async (e) => {
		if (e && e.id) {
			id.value = e.id;
			const res = await apiGetArtDetail({ id: id.value });
			Object.assign(artCtx.value, res.result.rows[0]);
			selText.value = res.result.rows[0].taxonmoy_info.name;
			imageValue.value = res.result.rows[0].coverImg.map(item => ({ url: item }));
			videoValue.value = res.result.rows[0].coverVideo.map(item => ({
				url: item,
				name: "视频",
			}));
			update.value = true;
		}
		if(e.item){
			let item = JSON.parse(e.item)
			artCtx.value.taxonmoy_id = item.id;
			squareText.value = item.name;
		}
		getUser();
	});

	function TvSc(e) {
		// 视频上传成功回调
		artCtx.value.coverVideo = e.tempFiles[0].url;
	}

	function getUser() {
		vk.userCenter.getCurrentUserInfo({
			success: data => {
				artCtx.value.user_id = data.userInfo._id;
			},
		});
	}

	function del(e) {
		imageValue.value = imageValue.value.filter(item => item.url !== e.tempFilePath);
	}

	function posts() {
		if (!artCtx.value.title) {
			vk.toast('文章标题不能为空');
			return;
		}
		if (!artCtx.value.taxonmoy_id) {
			vk.toast('至少选择一个分类目录');
			return;
		}
		post();
	}

	function openPop() {
		popStatus.value = true;
	}

	function callBack(item) {
		popStatus.value = false;
		squareText.value = item.name;
		selText.value = "已选择";
		artCtx.value.taxonmoy_id = item.id;
	}

	function switchIcon(icon) {
		currentIcon.value = icon;
		if (icon === "img") {
			artCtx.value.coverImg = [];
		} else if (icon === "tv") {
			artCtx.value.coverVideo = "";
		}
	}

	function reset() {
		artCtx.value.content = "";
	}

	async function post() {
		const obj = {
			title: artCtx.value.title,
			content: artCtx.value.content,
			openid: vk.getVuex('$user.userInfo')?.wx_openid?.['mp-weixin'] || "",
			scene: 1,
		};

		if (update.value) {
			const checkRes = await getCheck(obj);
			if (checkRes.isT) {
				artCtx.value.coverImg = imageValue.value.map(item => item.url);
				await apiUpArt(artCtx.value);
				vk.toast('文章修改成功,即将跳转首页');
				setTimeout(() => {
					vk.navigateTo('/pages/index/index');
				}, 1000);
			} else {
				vk.toast(checkRes.msg);
			}
		} else {
			const checkRes = await getCheck(obj);
			if (checkRes.isT) {
				artCtx.value.coverImg = imageValue.value.map(item => item.url);
				await apiAddArt(artCtx.value);
				vk.toast('发布成功');
				setTimeout(() => {
					uni.navigateBack(1);
				}, 1000);
			} else {
				vk.toast(checkRes.msg);
			}
		}
	}

	function switchC(e) {
		artCtx.value.Carousel = e.detail.value;
	}

	function switchS(e) {
		artCtx.value.art_status = e.detail.value;
	}

	async function selectImage(e) {
		// 处理图片选择
		for (let file of e.tempFiles) {
			await uploadFile(file, 'image');
		}
	}

	async function selectVideo(e) {
		// 处理视频选择
		await uploadFile(e.tempFiles[0], 'video');
	}

	async function uploadFile(file, type) {
		try {
			const res = await vk.uploadFile({
				title: "文件上传中...",
				file: file,
				provider: "extStorage", // 指定使用七牛云存储
				success: (res) => {
					if (type === 'image') {
						imageValue.value.push({
							url: res.url,
							name: file.name
						});
					} else if (type === 'video') {
						videoValue.value = [{
							url: res.url,
							name: file.name
						}];
						TvSc({ tempFiles: [{ url: res.url }] });
					}
				}
			});
		} catch (err) {
			vk.toast('上传失败，请重试');
		}
	}
</script>

<style lang="scss">
	page {
		box-sizing: border-box;
	}

	.addArt {
		.addArt-C {
			padding: 0 25rpx;

			.addArt-I {
				padding: 25rpx 0;

				.cell {
					.cell-item {
						@include flex;
						padding: 26rpx 32rpx;

						.cell-L {
							@include flex;

							.iconL {
								padding-right: 15rpx;
							}
						}

						.cell-R {
							@include flex;
							margin-left: auto;

							.iconR {
								padding-right: 15rpx;
							}
						}
					}
				}

				.head {
					display: flex;
					width: 100%;
					justify-content: space-between;
					align-items: center;
					.addArt-btn {
						margin: 0;
					}
				}

				.title {
					input {
						// padding-left: 20rpx;
						// border-left: 3px solid #2979FF;
						font-size: 30rpx;
						font-weight: 550;
					}
				}

				.content {
					min-height: 350rpx;

					.textarea {
						width: 100%;
						border: 1px solid #BDBDBD;
						box-sizing: border-box;
						font-size: 27rpx;
						font-weight: 550;
						border: none;
						height: 450rpx;
					}
				}

				.upIcon {
					@include flex;

					.upimg {
						margin: 0 20rpx;
					}

					.uptv {
						margin: 0 20rpx;
					}
				}

				.upBtn {
					margin: 25rpx 0;

					.img {}

					.tv {
						.tvCss {
							padding: 100rpx 0;
							@include flex-center;
							background: #BDBDBD;
							font-size: 60rpx;
						}
					}
				}
			}
		}

		.popup {
			.popup-ctx {
				height: 90vh;
				width: 100vw;

				.pop-title {
					@include flex-center;
					padding: 25rpx 0;
					font-size: 28rpx;
					font-weight: 550;
				}
			}
		}
	}
</style>