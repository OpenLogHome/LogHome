<template>
	<view class="content">
		<followBtn class="followButton" :targetId="reviewMsg.userId" v-show="componentMode == false"></followBtn>
		<view class="cenHost">
			<view class="cenHeadImgContent" @click="gotoPersonalPage(reviewMsg.userId)">
				<log-image class="headImg" :src="reviewMsg.headImgSrc"></log-image>
			</view>
			<view class="cenHostMsgContent">
				<view class="viewMb viewMb-space-between">
					<view>
						<text class="textSize">{{reviewMsg.userName}}</text>
						<!-- 粉丝排名标牌 -->
						<text class="fan-rank-badge" v-if="fanRank" @click="gotoNovelFans()">{{fanRank}}</text>
					</view>
				</view>
				<view class="viewMb">
					<text class="cenHostMsg4 textCenMsg">{{reviewMsg.sendTime}}</text>
				</view>
				<view class="cenHostReview viewMb">
					<xzj-readMore class="textSendMsg" hideLineNum="3" showHeight="100"
					:showMenu="false" @active="openFatherReview">
						{{praiseType == 1 ? '该评论被折叠' : reviewMsg.sendMsg}}
					</xzj-readMore>
					
					<!-- 显示评论附带的图片 -->
					<view class="comment-images" v-if="reviewMsg.media_urls && reviewMsg.media_urls.length > 0 && praiseType != 1">
						<view 
							class="comment-image-item" 
							v-for="(image, index) in reviewMsg.media_urls" 
							:key="index"
							@tap="previewImage(index, reviewMsg.media_urls)"
							@longpress="showImageOptionsMenu(image)"
						>
							<log-image :src="image" mode="aspectFill" style="width: 100%; height: 100%;"></log-image>
						</view>
					</view>
					
					<div v-if="reviewMsg.article_id != 0 && (!paragraphMode) && praiseType != 1"
						style="background-color: #e6e6e6; padding: 10px; margin: 5px 0; font-size: 14px;"
						@click="navToChapter">
						<svg t="1708145570940" class="icon" viewBox="0 0 1024 1024" version="1.1"
							xmlns="http://www.w3.org/2000/svg" p-id="2306" width="14" height="14"
							style="margin: 0 5px 0 0;">
							<path d="M128 472.896h341.344v341.344H128zM128 472.896L272.096 192h110.08l-144.128 280.896z"
								fill="#8a8a8a" p-id="2307"></path>
							<path d="M544 472.896h341.344v341.344H544zM544 472.896L688.096 192h110.08l-144.128 280.896z"
								fill="#8a8a8a" p-id="2308"></path>
						</svg>
						来自章节 {{article.title}}
						<div class="cento" v-if="reviewMsg.cento" style="margin-top: 10rpx; color: #4b4b4b;">
							{{reviewMsg.cento.paragraph}}
						</div>
					</div>
				</view>
				<view class="iconRow">
					<div class="left">
						<view @click.prevent="praise(0)">
							<dnIcon type="haoping" :color="praiseType == 0?'#ff6d00':'#C0C0C0'"></dnIcon>
							<text style="padding-left: 5px;">{{reviewMsg.likeNum}}</text>
						</view>
						<view @click.prevent="praise(1)" style="transform: scaleY(-1);">
							<dnIcon type="haoping" :color="praiseType == 1?'#ff6d00':'#C0C0C0'"></dnIcon>
						</view>
					</div>
					<div class="right" v-show="!(praiseType == 1)">
						<view @click="openFatherReview">回复</view>
						<view @click="handleDeleteReview(reviewMsg.comment_id)" 
						v-show="reviewMsg.author_id == currentUserId||reviewMsg.userId == currentUserId">删除</view>
					</div>
				</view>
				<view class="threeReviewContent" v-if="reviewMsg.reviewLess.length && praiseType != 1">
					<view class="threeReviewVueText" v-for="(reKey, key) in reviewMsg.reviewLess" :key="key">
						<xzj-readMore class="textSendMsg" hideLineNum="2" showHeight="100" 
							:showMenu="true" @active="openChildReview(key)"
							@menu="openSubMenu($event, reKey.comment_id, reKey.userId, key)">
							<span style="color:#929292">{{reKey.userName}}</span>
							<text class="defaultBlack">回复</text>
							<span style="color:#929292">{{reKey.targetUserName}}</span>
							:{{reKey.sendMsg}}
						</xzj-readMore>
						
						<!-- 显示回复中的图片 -->
						<view class="comment-images small" v-if="reKey.media_urls && reKey.media_urls.length > 0">
							<view 
								class="comment-image-item" 
								v-for="(image, index) in reKey.media_urls" 
								:key="index"
								@tap="previewImage(index, reKey.media_urls)"
								@longpress="showImageOptionsMenu(image)"
							>
								<log-image :src="image" mode="aspectFill" style="width: 100%; height: 100%;"></log-image>
							</view>
						</view>
					</view>
					<view class="reviewNumContent" v-if="reviewMsg.reviewNum > 3">
						<text>共{{reviewMsg.reviewNum}}条回复</text>
						<dnIcon type="tiaozhuan" size="12" style="margin-left: 5px;"></dnIcon>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 图片长按菜单 -->
		<uni-popup ref="imageOptionsPopup" type="center">
			<view class="popup-content">
				<view class="popup-item" @tap="saveAsSticker">
					<uni-icons type="star" size="20" color="#EA7034"></uni-icons>
					<text>收藏为表情</text>
				</view>
				<view class="popup-item cancel" @tap="hideImageOptionsMenu">
					<text>取消</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import dnIcon from '../dn-icon/dn-icon.vue';
	import followBtn from '../follow.vue'
	import axios from 'axios'
	export default {
		name: 'review',
		props: {
			reviewMsg: [Object],
			paragraphMode: false,
			componentMode: false,
			fanRanks: {
				type: Object,
				default: () => ({
					totalRanks: [],
					monthlyRanks: []
				})
			},
			novelId: {
				default: 0
			}
		},
		components: {
			dnIcon,
			followBtn
		},
		data() {
			return {
				praiseType: 3,
				article: {},
				currentUserId: undefined,
				currentImageUrl: '', // 当前长按选中的图片URL
				showImageOptions: false // 控制图片操作菜单显示
			}
		},
		computed: {
			// 计算粉丝排名标牌显示内容
			fanRank() {
				if (!this.fanRanks || !this.reviewMsg) return null;
				
				let totalRank = null;
				let monthlyRank = null;
				
				// 查找总榜排名
				const totalRankInfo = this.fanRanks.totalRanks.find(
					rank => rank.user_id === this.reviewMsg.userId
				);
				if (totalRankInfo && totalRankInfo.rank_num <= 10) {
					totalRank = `粉丝总榜第${totalRankInfo.rank_num}名`;
				}
				
				// 查找月榜排名
				const monthlyRankInfo = this.fanRanks.monthlyRanks.find(
					rank => rank.user_id === this.reviewMsg.userId
				);
				if (monthlyRankInfo && monthlyRankInfo.rank_num <= 10) {
					monthlyRank = `粉丝月榜第${monthlyRankInfo.rank_num}名`;
				}
				
				// 优先显示更高的排名
				if (totalRank && monthlyRank) {
					const totalRankNum = totalRankInfo.rank_num;
					const monthlyRankNum = monthlyRankInfo.rank_num;
					
					return totalRankNum <= monthlyRankNum ? totalRank : monthlyRank;
				}
				
				return totalRank || monthlyRank;
			}
		},
		mounted() {
			this.refresh();
			let tk = JSON.parse(window.localStorage.getItem('token'));
			this.currentUserId = tk.id;
		},
		methods: {
			previewImage(current, urls) {
				// 图片预览
				uni.previewImage({
					current: current,
					urls: urls,
					indicator: 'number'
				});
			},
			refresh() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				let _this = this;
				axios.get(this.$baseUrl + '/community/get_comment_praise_status?essay_comment_id=' + this.reviewMsg
					.comment_id, {
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': "Bearer " + tk //设置token 其中K名要和后端协调好
						}
					}).then((res) => {
					if (res.data.length > 0) {
						_this.praiseType = res.data[0].type;
					} else {
						_this.praiseType = 3;
					}
				}).catch(function(error) {

				})
				// 加载章节信息
				console.log(this.reviewMsg);
				if (this.reviewMsg.article_id != 0) {
					axios.get(this.$baseUrl + '/articles/get_article_info?id=' + this.reviewMsg.article_id).then((res) => {
						this.article = res.data[0];
					}).catch(function(error) {
						console.log(error);
						if (error) {
							// uni.showToast({
							// 	title: "获取文章信息失败",
							// 	icon: 'none',
							// 	duration: 2000
							// });
						}
					}).then(function() {
						uni.hideLoading();
					})
				}
			},
			openFatherReview() {
				let event = {
					review: this.reviewMsg,
					father: this.reviewMsg.comment_id
				}
				this.$emit('childReview', event);
			},
			openChildReview(item) {
				let event = {
					review: this.reviewMsg.reviewLess[item],
					father: this.reviewMsg.comment_id
				}
				this.$emit('childReview', event);
			},
			praise(type) {
				let submitType = 0;
				if (type == this.praiseType) {
					submitType = 3;
				} else {
					submitType = type;
				}
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				axios.post(this.$baseUrl + '/community/praise_on_comment', {
						essay_comment_id: _this.reviewMsg.comment_id,
						type: submitType

					}, {
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					}, )
					.then(function(response) {
						let changeNum = 0;
						if(_this.praiseType == 0){ // 原本处于点赞状态
							changeNum = -1;
						} else if(_this.praiseType == 1){ // 原本处于点踩状态
							if(submitType == 3) {
								changeNum = 0;
							} else {
								changeNum = (submitType == 0 ? 1 : -1);
							}
						} else { // 原本处于未点赞/未点踩状态
							changeNum = (submitType == 0 ? 1 : 0);
						}
						_this.refresh();
						_this.$emit('changePraise', {id: _this.reviewMsg.comment_id, changeNum: changeNum});
					})
					.catch(function(error) {
						console.log(error);
						if (error) {
							uni.showToast({
								title: "操作失败",
								icon: 'none',
								duration: 2000
							});
						}
					});
			},
			// 为评论回复设计的subMenu
			openSubMenu(e, id, userId, idx) {
				let itemList = ["回复"]
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));
				var myUserId, token;
				if (tk) {
					token = tk.token;
					myUserId = tk.id;
				}
				if (this.reviewMsg.author_id == myUserId //如果是自己的小说 
					||
					userId == myUserId) //或者评论人是自己
				{
					itemList.push("删除")
				}
				{
					uni.showActionSheet({
						itemList,
						success: function(res) {
							if (itemList[res.tapIndex] == "删除") {
								_this.handleDeleteReview(id);
							} else if(itemList[res.tapIndex] == "回复"){
								_this.openChildReview(idx);
							}
						},
						fail: function(res) {
							console.log(res.errMsg);
						}
					});
				}
			},
			handleDeleteReview(id) {
				let _this = this;
				uni.showLoading({
					title: '删除中'
				});
				uni.showModal({
					title: '提示',
					content: '要删除此条评论吗？',
					confirmColor: "#EA7034",
					success: function(res) {
						if (res.confirm) {
							let tk = JSON.parse(window.localStorage.getItem(
								'token'));
							if (tk) tk = tk.tk;
							axios.get(_this.$baseUrl +
								'/community/delete_comment?id=' + id, {
									headers: {
										'Content-Type': 'application/json', //设置请求头请求格式为JSON
										'Authorization': 'Bearer ' +
											tk //设置token 其中K名要和后端协调好
									}
								},
							)
							.then(function(response) {
								uni.showToast({
									title: "删除成功",
									icon: 'none',
									duration: 2000
								});
								_this.refresh();
								_this.$emit('deleteComment', id);
								uni.hideLoading();
							})
							.catch(function(error) {
								console.log(error);
								uni.hideLoading();
								if (error) {	
									uni.showToast({
										title: "操作失败",
										icon: 'none',
										duration: 2000
									});
								}
							});
						} else if (res.cancel) {
							uni.hideLoading();
						}
					}
				});
			},
			navToChapter() {
				console.log(this.reviewMsg.cento);
				uni.navigateTo({
					url: '../../pages/readers/newReader/article?id=' + this.reviewMsg.article_id + '&paragraphId=' + this.reviewMsg.cento.paragraph_id
				});
			
			},
			gotoPersonalPage(userId) {
				this.$emit("navigate")
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/users/personalPage?id=" + userId
					})
				}, this.componentMode ? 500 : 0);
			},
			gotoNovelFans() {
				uni.navigateTo({
					url: '/pages/readers/novel_fans?id=' + this.novelId
				})
			},
			// 显示图片操作菜单
			showImageOptionsMenu(imageUrl) {
				this.currentImageUrl = imageUrl;
				this.$refs.imageOptionsPopup.open();
			},
			// 隐藏图片操作菜单
			hideImageOptionsMenu() {
				this.$refs.imageOptionsPopup.close();
			},
			// 收藏图片为表情包
			async saveAsSticker() {
				if (!this.currentImageUrl) {
					uni.showToast({
						title: '图片地址无效',
						icon: 'none'
					});
					return;
				}
				
				try {
					uni.showLoading({ title: '收藏中...' });
					
					const token = JSON.parse(window.localStorage.getItem('token'))?.tk;
					if (!token) {
						uni.showToast({
							title: '请先登录',
							icon: 'none'
						});
						return;
					}
					
					// 检查图片是否已存在对应的sticker
					const checkRes = await axios.get(this.$baseUrl + '/community/stickers', {
						params: { url: this.currentImageUrl },
						headers: { 'Authorization': 'Bearer ' + token }
					});
					
					let stickerId = null;
					let needCreateSticker = false;
					
					if (checkRes.data && checkRes.data.length > 0) {
						// 图片已存在对应的sticker
						const existingSticker = checkRes.data[0];
						const userId = JSON.parse(window.localStorage.getItem('token')).id;
						
						if (existingSticker.is_private === 0) {
							// 公开的，直接收藏
							stickerId = existingSticker.sticker_id;
						} else if (existingSticker.user_id === userId) {
							// 私密的，但是是自己的，直接收藏
							stickerId = existingSticker.sticker_id;
						} else {
							// 私密的，且不是自己的，需要重新创建
							needCreateSticker = true;
						}
					} else {
						// 图片不存在对应的sticker，需要创建
						needCreateSticker = true;
					}
					
					// 如果需要创建新的sticker
					if (needCreateSticker) {
						const createRes = await axios.post(this.$baseUrl + '/community/stickers', {
							url: this.currentImageUrl,
							is_private: false // 默认创建为公开的
						}, {
							headers: { 'Authorization': 'Bearer ' + token }
						});
						
						stickerId = createRes.data.sticker_id;
					}
					
					// 收藏sticker
					if (stickerId) {
						// 检查是否已收藏
						const favoritesRes = await axios.get(this.$baseUrl + '/community/stickers/favorites', {
							headers: { 'Authorization': 'Bearer ' + token }
						});
						
						// 适配新的API返回结构，data.stickers 是表情列表
						const stickers = favoritesRes.data.stickers || favoritesRes.data;
						const isAlreadyFavorite = Array.isArray(stickers) && stickers.some(item => item.sticker_id === stickerId);
						
						if (!isAlreadyFavorite) {
							await axios.post(this.$baseUrl + '/community/stickers/favorites', {
								sticker_id: stickerId
							}, {
								headers: { 'Authorization': 'Bearer ' + token }
							});
						}
						
						uni.showToast({
							title: '已添加到表情收藏',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: '收藏失败',
							icon: 'none'
						});
					}
					
				} catch (error) {
					console.error('收藏失败:', error);
					uni.showToast({
						title: '收藏失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
					this.hideImageOptionsMenu();
				}
			}
		},
	}
</script>

<style scoped>
	.content {
		width: 100%;
		overflow: hidden;
		position: relative;
	}

	.cenHost-Content {
		position: relative;
		width: 100%;
	}

	.cr-title {
		width: 100%;
		height: 30px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px 0 10px;
		box-sizing: border-box;
		background-color: #ffffff;
	}

	.childReview {
		position: absolute;
		margin: auto;
		width: 100%;
		height: 100%;
		top: 0px;
		background-color: #F9F9F9;
		display: flex;
		flex-direction: column;
	}

	.headImg {
		width: 30px;
		height: 30px;
		border-radius: 8rpx;
	}

	.textSendMsg {
		font-size: 14px;
		position: relative;
		width: 100%;
	}

	.textSize {
		font-size: 13px;
		color: #808080;
		margin-right: 10px;
	}

	.textCenMsg {
		color: #999999;
		font-size: 12px;
	}

	.defaultBlack {
		color: #000000;
	}


	.viewMb-space-between {
		display: flex;
		justify-content: space-between;
	}

	.viewMb {
		margin-bottom: 5px;
	}

	.followText {
		font-size: 14px;
		margin-right: 8px;
	}

	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #ffffff;
	}

	.cenHost {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		border-bottom: 1px solid #e1e1e1;
		margin-top: 5px;
		overflow: hidden;
		/* max-height:600rpx; */
	}

	.cenHostMsgContent {
		width: calc(100% - 30rpx);
		margin: 5px 10px 10px 10px;
		/* height:30rpx; */
	}

	.cenHeadImgContent {
		height: 100%;
		margin: 10px;
		height: 30rpx;
	}

	.cenHostMsg1 {}

	.cenHostMsg2 {
		background-color: #ff6d00;
		color: #FFFFFF;
		font-size: 10px;
	}

	.cenHostMsg3 {
		color: #999999;
		margin-right: 10px;
	}

	.cenHostMsg4 {
		color: #999999;
	}

	.iconRow {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 10px;
		color: #999999;
		font-size: 12px;
		.left{
			display: flex;
			view{
				margin-right: 40rpx;
			}
		}
		.right {
			display: flex;
			view{
				margin-left: 40rpx;
			}
		}
	}

	.threeReviewContent {
		background-color: #f2f2f2;
		margin-top: 10px;
		margin-bottom: 10px;
		padding: 8px;
	}

	.threeReviewVueText {
		font-size: 14px;
		color: #ff6d00;
		margin: 8px;
		overflow: hidden;
		position: relative;
		width: calc(100% - 16px);
	}

	.reviewNumContent {
		color: #ff6d00;
		font-size: 12px;
		margin-left: 8px;
	}

	.followButton {
		position: absolute;
		right: 25rpx;
		top: 25rpx;
		z-index: 50;
	}
	
	.cento{
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
}

.comment-images {
	display: flex;
	flex-wrap: wrap;
	margin: 10rpx 0;
	
	&.small {
		margin: 5rpx 0;
	}
	
	.comment-image-item {
		width: 180rpx;
		height: 180rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		border-radius: 8rpx;
		overflow: hidden;
		
		log-image {
			width: 100%;
			height: 100%;
		}
		
		&:nth-child(3n) {
			margin-right: 0;
		}
	}
	
	&.small .comment-image-item {
		width: 140rpx;
		height: 140rpx;
	}
}

/* 粉丝排名标牌样式 */
	.fan-rank-badge {
		display: inline-block;
		background: linear-gradient(135deg, #ff9800, #ff5722);
		color: #fff;
		font-size: 10px;
		padding: 2px 6px;
		border-radius: 10px;
		margin-left: 5px;
		vertical-align: middle;
		font-weight: bold;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}
	
	/* 图片长按菜单样式 */
	.popup-content {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 40rpx 0;
		width: calc(100vw - 100rpx);
	}
	
	.popup-item {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 0;
		font-size: 32rpx;
		color: #333;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.popup-item:last-child {
		border-bottom: none;
	}
	
	.popup-item.cancel {
		color: #999;
		margin-top: 20rpx;
		border-top: 20rpx solid #f8f8f8;
	}
	
	.popup-item text {
		margin-left: 20rpx;
	}
</style>