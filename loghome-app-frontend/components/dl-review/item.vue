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
						>
							<log-image :src="image" mode="aspectFill"></log-image>
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
							>
								<log-image :src="image" mode="aspectFill"></log-image>
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
		},
		components: {
			dnIcon,
			followBtn
		},
		data() {
			return {
				praiseType: 3,
				article: {},
				currentUserId: undefined
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
		z-index: 100;
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
</style>