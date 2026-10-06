<template>
	<view class="content" v-dark>
		<followBtn class="followButton" :targetId="reviewMsg.userId" v-show="componentMode == false"></followBtn>
		<view class="cenHost">
			<view class="cenHeadImgContent" @click="gotoPersonalPage(reviewMsg.userId)">
				<user-avatar class="headImg" :src="reviewMsg.headImgSrc" :frame="reviewMsg.avatarFrame"
					:visual-scale="reviewMsg.avatarFrame ? 1.2 : 1" />
			</view>
			<view class="cenHostMsgContent">
				<view class="viewMb viewMb-space-between">
					<view>
						<text class="textSize">{{reviewMsg.userName}}</text>
						<!-- 粉丝排名标签 -->
						<text class="fan-rank-badge" v-if="fanRank" @click="gotoNovelFans()">{{fanRank}}</text>
					</view>
				</view>
				<view class="viewMb">
					<text class="cenHostMsg4 textCenMsg">{{reviewMsg.sendTime}}</text>
				</view>
				<view class="cenHostReview viewMb">
					<xzj-readMore class="textSendMsg" hideLineNum="3" showHeight="100"
					:showMenu="false" @active="openFatherReview">
						<span class="msg-text">
							{{praiseType == 1 ? '该评论被折叠' : reviewMsg.sendMsg}}
						</span>
					</xzj-readMore>
					
					<!-- 显示评论附带的图片-->
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
					
					<div class="comment-source" v-if="reviewMsg.article_id != 0 && (!paragraphMode) && praiseType != 1" @click="navToChapter">
						<svg t="1708145570940" class="icon" viewBox="0 0 1024 1024" version="1.1"
							xmlns="http://www.w3.org/2000/svg" p-id="2306" width="14" height="14"
							style="margin: 0 5px 0 0;">
							<path d="M128 472.896h341.344v341.344H128zM128 472.896L272.096 192h110.08l-144.128 280.896z"
								fill="currentColor" p-id="2307"></path>
							<path d="M544 472.896h341.344v341.344H544zM544 472.896L688.096 192h110.08l-144.128 280.896z"
								fill="currentColor" p-id="2308"></path>
						</svg>
						<span class="comment-source-title">来自章节 {{ reviewMsg.article_title || article.title }}</span>
						<div class="cento" v-if="reviewMsg.cento">
							{{reviewMsg.cento.paragraph}}
						</div>
					</div>
				</view>
				<view class="iconRow">
					<div class="left">
						<view @click.prevent="praise(0)">
							<dnIcon type="haoping" :color="praiseType == 0 ? 'var(--manga-accent, #c14a16)' : 'var(--manga-muted, #9aa1a9)'"></dnIcon>
							<text class="like-count" :class="{ liked: praiseType == 0 }">{{reviewMsg.likeNum}}</text>
						</view>
						<view @click.prevent="praise(1)" style="transform: scaleY(-1);">
							<dnIcon type="haoping" :color="praiseType == 1 ? 'var(--manga-accent, #c14a16)' : 'var(--manga-muted, #9aa1a9)'"></dnIcon>
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
							<span class="reply-name">{{reKey.userName}}</span>
							<text class="reply-arrow">回复</text>
							<span class="reply-name">{{reKey.targetUserName}}</span>
							<span class="reply-body">:{{reKey.sendMsg}}</span>
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
						<text>查看{{reviewMsg.reviewNum}}条回复</text>
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
					<text>收藏为表情包</text>
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
	import darkModeMixin from '@/mixins/dark-mode.js'
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
		mixins: [darkModeMixin],
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
			// 计算粉丝排名标签显示内容
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
			this.currentUserId = tk ? tk.id : undefined;
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
				if (this.reviewMsg.author_id == myUserId 
					||
					userId == myUserId) 
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
					content: '要删除此评论吗？',
					confirmColor: "#EA7034",
					success: function(res) {
						if (res.confirm) {
							let tk = JSON.parse(window.localStorage.getItem(
								'token'));
							if (tk) tk = tk.tk;
							axios.get(_this.$baseUrl +
								'/community/delete_comment?id=' + id, {
									headers: {
										'Content-Type': 'application/json', 
										'Authorization': 'Bearer ' +
											tk 
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
				const readerProps = window.localStorage.getItem("readerProps");
				const isPageReader = readerProps !== "text";
				const paragraphId = this.reviewMsg?.cento?.paragraph_id;
				let url = isPageReader
					? `/pages/readers/newReader/article?id=${this.reviewMsg.article_id}`
					: `/pages/readers/article_rich?id=${this.reviewMsg.article_id}`;
				if (paragraphId) {
					url += `&paragraphId=${paragraphId}`;
				}
				uni.navigateTo({ url });
			
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
					
					// 适配不同的API返回结构，data.stickers 是数组
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
			},
			refresh() {
				const tokenInfo = JSON.parse(window.localStorage.getItem('token') || 'null');
				const token = tokenInfo ? tokenInfo.tk : '';

				if (this.reviewMsg && this.reviewMsg.praiseType !== undefined && this.reviewMsg.praiseType !== null) {
					this.praiseType = this.reviewMsg.praiseType;
				} else if (token) {
					axios.get(this.$baseUrl + '/community/get_comment_praise_status?essay_comment_id=' + this.reviewMsg.comment_id, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': "Bearer " + token
						}
					}).then((res) => {
						if (res.data.length > 0) {
							this.praiseType = res.data[0].type;
						} else {
							this.praiseType = 3;
						}
					}).catch(() => {
						this.praiseType = 3;
					});
				} else {
					this.praiseType = 3;
				}

				if (this.reviewMsg.article_id != 0) {
					if (this.reviewMsg.article_title) {
						this.article = {
							...this.article,
							title: this.reviewMsg.article_title
						};
					} else {
						axios.get(this.$baseUrl + '/articles/get_article_info?id=' + this.reviewMsg.article_id).then((res) => {
							this.article = res.data[0];
						}).catch((error) => {
							console.log(error);
						});
					}
				}
			},
			praise(type) {
				let submitType = 0;
				if (type == this.praiseType) {
					submitType = 3;
				} else {
					submitType = type;
				}
				let tk = JSON.parse(window.localStorage.getItem('token') || 'null');
				if (tk) tk = tk.tk;
				axios.post(this.$baseUrl + '/community/praise_on_comment', {
					essay_comment_id: this.reviewMsg.comment_id,
					type: submitType
				}, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tk
					}
				}).then(() => {
					let changeNum = 0;
					if (this.praiseType == 0) {
						changeNum = -1;
					} else if (this.praiseType == 1) {
						if (submitType == 3) {
							changeNum = 0;
						} else {
							changeNum = (submitType == 0 ? 1 : -1);
						}
					} else {
						changeNum = (submitType == 0 ? 1 : 0);
					}
					this.praiseType = submitType == 3 ? 3 : submitType;
					this.$emit('changePraise', { id: this.reviewMsg.comment_id, changeNum: changeNum });
				}).catch((error) => {
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
			handleDeleteReview(id) {
				uni.showLoading({
					title: 'Deleting'
				});
				uni.showModal({
					title: 'Notice',
					content: 'Delete this comment?',
					confirmColor: "#EA7034",
					success: (res) => {
						if (res.confirm) {
							let tk = JSON.parse(window.localStorage.getItem('token') || 'null');
							if (tk) tk = tk.tk;
							axios.get(this.$baseUrl + '/community/delete_comment?id=' + id, {
								headers: {
									'Content-Type': 'application/json',
									'Authorization': 'Bearer ' + tk
								}
							}).then(() => {
								uni.showToast({
									title: 'Deleted',
									icon: 'none',
									duration: 2000
								});
								this.$emit('deleteComment', id);
								uni.hideLoading();
							}).catch((error) => {
								console.log(error);
								uni.hideLoading();
								if (error) {
									uni.showToast({
									title: 'Failed',
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
			}
		},
	}
</script>

<style scoped lang="scss">
// 书评样式对齐漫画评论区设计语言（common/manga-theme.scss 的 --manga-* 变量），
// 变量在本组件兜底定义，保证脱离 bookComment 页面时配色依然正确
.content {
	--manga-bg: #f4f5f6;
	--manga-card: #fff;
	--manga-text: #252b30;
	--manga-muted: #656c74;
	--manga-line: #e5e8eb;
	--manga-accent: #c14a16;
	--manga-tint: #fff1e8;

	width: 100%;
	box-sizing: border-box;
	padding: 26rpx 24rpx 0;
	background-color: var(--manga-card);
	color: var(--manga-text);

	&.dark-mode {
		--manga-bg: #16191c;
		--manga-card: #24282c;
		--manga-text: #f4f5f6;
		--manga-muted: #b6bdc3;
		--manga-line: #41474c;
		--manga-accent: #ffae77;
		--manga-tint: #392a22;
	}
}

.cenHost {
	display: flex;
	gap: 18rpx;
	padding-bottom: 26rpx;
	border-bottom: 1rpx solid var(--manga-line);
}

.cenHeadImgContent {
	flex: none;
	width: 72rpx;
	height: 72rpx;
}

.headImg {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
}

.cenHostMsgContent {
	flex: 1;
	min-width: 0;
}

.viewMb {
	margin-bottom: 0;
}

.viewMb-space-between {
	display: flex;
	justify-content: space-between;
}

.textSize {
	font-size: 26rpx;
	font-weight: 700;
	color: var(--manga-text);
	margin-right: 10rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

// 粉丝排名标签：与漫画评论徽标一致，tint 底 + accent 字的胶囊
.fan-rank-badge {
	display: inline-block;
	flex: none;
	padding: 3rpx 12rpx;
	border-radius: 100rpx;
	background: var(--manga-tint);
	color: var(--manga-accent);
	font-size: 20rpx;
	font-weight: 600;
	margin-left: 8rpx;
	vertical-align: middle;
}

.textCenMsg {
	display: block;
	margin-top: 2rpx;
	color: var(--manga-muted);
	font-size: 21rpx;
}

.cenHostReview {
	margin-top: 12rpx;
}

.textSendMsg {
	font-size: 27rpx;
	position: relative;
	width: 100%;
	color: var(--manga-text);
}

.msg-text {
	font-size: 27rpx;
	line-height: 1.65;
	color: var(--manga-text);
	white-space: pre-line;
	word-break: break-word;

	.dark-mode & {
		color: var(--manga-text);
	}
}

.comment-images {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin: 16rpx 0 0;

	&.small {
		margin-top: 12rpx;
	}

	.comment-image-item {
		width: 168rpx;
		height: 168rpx;
		border-radius: 12rpx;
		overflow: hidden;
		background: var(--manga-bg);

		log-image {
			width: 100%;
			height: 100%;
		}
	}

	&.small .comment-image-item {
		width: 140rpx;
		height: 140rpx;
	}
}

// 来自章节：漫画评论的"来源"条样式
.comment-source {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8rpx;
	margin: 14rpx 0 0;
	padding: 10rpx 16rpx;
	border-radius: 12rpx;
	background: var(--manga-bg);
	color: var(--manga-muted);
	font-size: 22rpx;
	line-height: 1.5;

	&:active {
		color: var(--manga-accent);
	}

	.icon {
		flex: none;
		color: inherit;
	}

	.cento {
		width: 100%;
		margin-top: 4rpx;
		color: var(--manga-muted);
		font-size: 22rpx;
	}
}

.cento {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
}

.iconRow {
	display: flex;
	align-items: center;
	margin-top: 14rpx;
	color: var(--manga-muted);
	font-size: 23rpx;

	.left {
		display: flex;
		align-items: center;
		gap: 28rpx;

		view {
			display: flex;
			align-items: center;
		}
	}

	.like-count {
		padding-left: 8rpx;
		color: var(--manga-muted);

		&.liked {
			color: var(--manga-accent);
			font-weight: 600;
		}
	}

	.right {
		display: flex;
		align-items: center;
		margin-left: auto;
		gap: 28rpx;

		view {
			padding: 8rpx 0;
		}
	}
}

// 回复列表：漫画评论的灰底圆角容器
.threeReviewContent {
	margin-top: 14rpx;
	padding: 14rpx 18rpx;
	border-radius: 14rpx;
	background: var(--manga-bg);
}

.threeReviewVueText {
	font-size: 24rpx;
	line-height: 1.6;
	color: var(--manga-text);
	padding: 8rpx 0;
	word-break: break-word;
}

.reply-name {
	color: var(--manga-accent);
	font-weight: 600;
}

.reply-arrow {
	margin: 0 6rpx;
	color: var(--manga-muted);
}

.reply-body {
	color: var(--manga-text);
}

.reviewNumContent {
	color: var(--manga-accent);
	font-size: 23rpx;
	font-weight: 600;
	padding: 10rpx 0 2rpx;
}

.followButton {
	position: absolute;
	right: 25rpx;
	top: 25rpx;
	z-index: 50;
}

.comment_item {
	transition: filter 0.3s ease;
}

.highlight_comment {
	filter: brightness(0.9);
}

// 图片长按菜单
.popup-content {
	background-color: var(--manga-card);
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
	color: var(--manga-text);
	border-bottom: 1rpx solid var(--manga-line);

	&:last-child {
		border-bottom: none;
	}

	&.cancel {
		color: var(--manga-muted);
		margin-top: 20rpx;
		border-top: 20rpx solid var(--manga-bg);
	}

	text {
		margin-left: 20rpx;
	}
}
</style>
