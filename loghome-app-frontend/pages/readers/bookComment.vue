<template>
	<view class="commentOuter" :style="{ '--statusBarHeight': 0 + 'px' }">
		<z-paging ref="paging" v-model="reviews" @onRefresh="pullDown" @query="refreshPage"
			:customOperationText="componentMode ? '收起' : '刷新'"
			:style="{ 'marginTop': `${componentMode ? '20vh' : (0 + 'px')}` }"
			:default-page-size="componentMode ? 10 : 10">
			<nothing :msg="'还没有评论哦\n快来抢沙发吧~'" slot="empty" height="calc(80vh - 55rpx - 124px)"></nothing>
			<div v-if="paragraphId !== undefined"
				style="background-color: #e6e6e6; padding: 10px; margin: 0 0 5px 0; font-size: 14px;"
				@click="navToChapter">
				<svg t="1708145570940" class="icon" viewBox="0 0 1024 1024" version="1.1"
					xmlns="http://www.w3.org/2000/svg" p-id="2306" width="14" height="14" style="margin: 0 5px 0 0;">
					<path d="M128 472.896h341.344v341.344H128zM128 472.896L272.096 192h110.08l-144.128 280.896z"
						fill="#8a8a8a" p-id="2307"></path>
					<path d="M544 472.896h341.344v341.344H544zM544 472.896L688.096 192h110.08l-144.128 280.896z"
						fill="#8a8a8a" p-id="2308"></path>
				</svg>
				<div class="cento" style="margin-top: 10rpx; color: #4b4b4b; padding: 0 30rpx; ">
					{{ paragraph }}
				</div>
			</div>
			<view class="comments">
				<commentItem v-for="item in reviews" :reviewMsg="item" :key="item.essay_comment_id"
					:componentMode="componentMode" @childReview="childReview($event)" :id="'comment_' + item.comment_id"
					@changePraise="changePraise($event)" @deleteComment="deleteComment($event)" class="comment_item" :class="{highlight_comment: preLoadCommentId == item.comment_id}"
					:paragraphMode="paragraphId != undefined" @navigate="$emit('navigate')" :fanRanks="fanRanks" :novelId="novelId"></commentItem>
			</view>
			<view class="blank_box"></view>
		</z-paging>

		<view class="reply">
			<!-- 回复状态提示条 -->
			<view class="reply-status" v-if="replyToId !== -1">
				<text class="reply-status-text">回复 {{replyToUserName}}</text>
				<view class="cancel-reply-btn" @tap="cancelReply">
					<uni-icons type="closeempty" size="20" color="#999"></uni-icons>
				</view>
			</view>
			
			<div class="reply-row">
				<textarea type="text" auto-height :placeholder="commentPlaceholder" maxlength="300"
					v-model="commentText" @focus="textFocus" @blur="textBlur"></textarea>

				<view class="icon-row">
					<view class="emoji-icon">
						<emoji-picker @select="onEmojiSelect"></emoji-picker>
					</view>
					<view class="image-icon" @tap="toggleImageUpload">
						<uni-icons type="image" size="30" color="#666666"></uni-icons>
					</view>
					<view class="send-icon">
						<uni-icons type="redo-filled" size="30" color="#EA7034" @click="submitComment"
							:focus="isFocus"></uni-icons>
					</view>
				</view>
			</div>

			<!-- 图片预览和上传区域 -->
			<view class="image-upload-area" v-if="media_urls.length > 0 && isFocus">
				<view class="image-grid">
					<view class="image-item" v-for="(image, index) in media_urls" :key="index">
						<log-image :src="image" mode="aspectFill" style="width: 100%; height: 100%;"></log-image>
						<view class="delete-btn" @tap.stop="deleteImage(index)">
							<uni-icons type="closeempty" size="20" color="#fff"></uni-icons>
						</view>
					</view>
					<view class="upload-btn" v-if="media_urls.length < 3 && isFocus" @tap="chooseImage">
						<uni-icons type="plusempty" size="30" color="#999"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		

	</view>
</template>

<script>
import nothing from '../../components/nothing.vue'
import axios from 'axios'
import commentItem from "../../components/dl-review/item.vue"
import emojiPicker from '../../components/emoji-picker/emoji-picker.vue'
export default {
	components: {
		commentItem, nothing, emojiPicker
	},
	data() {
		return {
			novelId: 0,
			preLoadCommentId: undefined,
			reviews: [],
			commentText: "",
			commentPlaceholder: "发一条友善的评论",
			replyToId: -1,
			isFocus: false,
			fatherId: -1,
			replyToUserName: "",
			articleId: undefined,
			paragraphId: undefined,
			paragraph: undefined,
			extraCommentId: undefined,
			media_urls: [], // 存储图片URL
			fanRanks: {
				totalRanks: [],
				monthlyRanks: []
			}
		}
	},
	props: {
		componentMode: {
			default: false
		},
		componentData: {
			default: {}
		}
	},
	mounted() {
		if (this.componentMode) {
			console.log(this.componentMode, this.componentData);
			this.novelId = this.componentData.novelId;
			if (this.componentData.articleId !== undefined) {
				this.articleId = this.componentData.articleId;
				if (this.componentData.paragraphId !== undefined) {
					this.paragraphId = this.componentData.paragraphId;
					this.loadParagraphInfo();
				}
			}
			// 获取粉丝排名
			this.fetchFanRanks();
		}
	},
	onLoad(params) {
		if (params.comment_id !== undefined) {
			this.preLoadCommentId = params.comment_id;
		}
		if (!this.componentMode) {
			this.novelId = params.id;
			if (params.articleId !== undefined) {
				this.articleId = params.articleId;
				uni.setNavigationBarTitle({
					title: "章节评论"
				})
				if (params.paragraphId !== undefined) {
					this.paragraphId = params.paragraphId;
					this.loadParagraphInfo();
					uni.setNavigationBarTitle({
						title: "段落评论"
					})
				}
			}
			if (params.extraId !== undefined) {
				this.extraCommentId = params.extraId;
			}
			// 获取粉丝排名
			this.fetchFanRanks();
		}
	},
	methods: {
		utc2beijing(utc_datetime) {
			// 转为正常的时间格式 年-月-日 时:分:秒
			var T_pos = utc_datetime.indexOf('T');
			var Z_pos = utc_datetime.indexOf('Z');
			var year_month_day = utc_datetime.substr(0, T_pos);
			var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
			var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06

			// 处理成为时间戳
			timestamp = new Date(Date.parse(new_datetime));
			timestamp = timestamp.getTime();
			timestamp = timestamp / 1000;

			// 增加8个小时，北京时间比utc时间多八个时区
			var timestamp = timestamp + 8 * 60 * 60;

			// 时间戳转为时间
			var beijing_datetime = this.timeConvert(new Date(parseInt(timestamp) * 1000))
			return beijing_datetime; // 2017-03-31 16:02:06
		},
		// 获取粉丝排名数据
		fetchFanRanks() {
			axios.get(this.$baseUrl + '/community/get_novel_fan_ranks', {
				params: { novel_id: this.novelId }
			})
			.then((res) => {
				this.fanRanks = res.data;
			})
			.catch((error) => {
				console.log('获取粉丝排名失败', error);
			});
		},
		pullDown() {
			if (this.componentMode) {
				this.$emit("hide");
			}
		},
		async delay() {
			return new Promise((resolve) => {
				this.$nextTick(() => {
					resolve();
				})
			})
		},
		async loadComment(commentId) {
			let res = await axios.get(this.$baseUrl + "/community/novel_comment_from_comment_id?comment_id=" + commentId);
			let data = res.data;
			if (data.length > 0) {
				let commentItem = {
					author_id: data[0].author_id,
					comment_id: data[0].essay_comment_id,
					headImgSrc: data[0].avatar_url,
					userName: data[0].name,
					userId: data[0].user_id,
					sendTime: this.utc2beijing(data[0].comment_time),
					sendMsg: data[0].content,
					likeNum: data[0].likeNum,
					reviewLess: [],
					reviewNum: 0,
					article_id: data[0].article_id,
					cento_id: data[0].cento_id,
					cento: data[0].cento,
					media_urls: data[0].media_urls || []
				}
				// 加载回复
				await axios.get(this.$baseUrl + "/community/novel_commonts_reply_to?id=" + commentId)
					.then((res) => {
						let data = res.data;
						for (let item of data) {
							commentItem.reviewLess.push({
								comment_id: item.essay_comment_id,
								userName: item.name,
								userId: item.user_id,
								targetUserName: data[0].name,
								sendMsg: item.content,
								article_id: item.article_id,
								media_urls: item.media_urls || []
							});
						}
					})
				this.$refs.paging.addDataFromTop([commentItem], true, true);
			}
		},
		async refreshPage(pageNo, pageSize) {
			await this.delay();
			if (this.$refs.paging == undefined) return;
			uni.showLoading({
				title: '努力加载中'
			});
			let reviewDatas = [];
			let _this = this;
			await axios.get(this.$baseUrl + "/community/novel_commonts_all?id=" + this.novelId
				+ "&page=" + pageNo + "&pageSize=" + pageSize + ((this.articleId != undefined) ? `&articleId=${this.articleId}` : '')
				+ ((this.paragraphId != undefined) ? `&paragraphId=${this.paragraphId}` : ''))
				.then(async (res) => {
					let data = res.data;
					console.log(data)
					if (_this.paragraphId !== undefined) {
						data = data.filter((item) => {
							return item.cento && item.cento.paragraph_id == _this.paragraphId
						})
					}
					for (let item of data) {
						reviewDatas.push(item)
						await axios.get(this.$baseUrl + "/community/novel_commonts_reply_to?id=" + item.essay_comment_id)
							.then((res) => {
								let data = res.data;
								for (let subItem of data) {
									reviewDatas.push(subItem)
								}

							}).catch((err) => {
								uni.showToast({
									title: "评论信息获取失败",
									icon: 'none',
									duration: 2000
								});
							})
					}
				}).catch((err) => {
					uni.showToast({
						title: "评论信息获取失败",
						icon: 'none',
						duration: 2000
					});
				})

			function findTargetUserName(reply_to_id) {
				for (let item of reviewDatas) {
					if (item.essay_comment_id == reply_to_id) {
						return item.name;
					}
				}
			}
			let reviews = [];
			for (let item of reviewDatas) {
				// console.log(item);
				if (item.father_comment_id == -1) {
					console.log(item);
					let commentItem = {
						author_id: item.author_id,
						comment_id: item.essay_comment_id,
						headImgSrc: item.avatar_url,
						userName: item.name,
						userId: item.user_id,
						sendTime: _this.utc2beijing(item.comment_time),
						sendMsg: item.content,
						likeNum: item.likeNum,
						reviewLess: [],
						reviewNum: 0,
						article_id: item.article_id,
						cento_id: item.cento_id,
						cento: item.cento,
						media_urls: item.media_urls || []
					}

					for (let subItem of reviewDatas) {
						if (subItem.father_comment_id == item.essay_comment_id) {
							commentItem.reviewLess.push({
								comment_id: subItem.essay_comment_id,
								userName: subItem.name,
								userId: subItem.user_id,
								targetUserName: findTargetUserName(subItem.reply_to_id),
								sendMsg: subItem.content,
								article_id: item.article_id,
								media_urls: subItem.media_urls || []
							})
						}
					}
					reviews.push(commentItem);
					// console.log("commentItem",commentItem);
				}
			}
			this.$refs.paging.complete(reviews);
			uni.hideLoading();

			if (this.preLoadCommentId !== undefined && pageNo == 1) {
				for (let item of reviews) {
					if (item.comment_id == this.preLoadCommentId) {
						setTimeout(() => {
							this.$refs.paging.scrollIntoViewById('comment_' + item.comment_id, 0, true);
						}, 100);
						setTimeout(() => {
							this.preLoadCommentId = -1;
						}, 1000);
						return;
					}
				}
				await this.loadComment(this.preLoadCommentId);
				setTimeout(() => {
					this.preLoadCommentId = -1;
				}, 1000);
			}
		},
		submitComment() {
			let _this = this;
			if (this.commentText == "") return;
			let tk = JSON.parse(window.localStorage.getItem('token')); if (tk) tk = tk.tk;;
			//console.log(tk);
			// 发表根评论
			if (this.replyToId == -1) {
				axios.post(this.$baseUrl + '/community/comment_on_novel',
					{
						novel_id: this.novelId,
						content: this.commentText,
						article_id: this.articleId != undefined ? this.articleId : 0,
						paragraph_id: this.paragraphId != undefined ? this.paragraphId : -1,
						media_urls: this.media_urls
					},
					{
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					},
				)
					.then(function (response) {
						uni.showToast({
							title: "发表成功",
							icon: 'none',
							duration: 2000
						});
						let item = response.data;
						let commentItem = {
							author_id: item.author_id,
							comment_id: item.essay_comment_id,
							headImgSrc: item.avatar_url,
							userName: item.name,
							userId: item.user_id,
							sendTime: _this.utc2beijing(item.comment_time),
							sendMsg: item.content,
							likeNum: item.likeNum,
							reviewLess: [],
							reviewNum: 0,
							article_id: item.article_id,
							cento_id: item.cento_id,
							cento: item.cento,
							media_urls: _this.media_urls || []
						}
						_this.$refs.paging.addDataFromTop([commentItem], true, true);
					_this.commentText = "";
					_this.media_urls = []; // 清空已上传图片
					_this.isFocus = false; // 关闭焦点状态
					})
					.catch(function (error) {
						if (error) {
							uni.showToast({
								title: "发表失败",
								icon: 'none',
								duration: 2000
							});
						}
					});
			} else {
				// 发表回复
				axios.post(this.$baseUrl + '/community/reply_to_novel_comment',
					{
						essay_comment_id: this.replyToId,
						novel_id: this.novelId,
						content: this.commentText,
						fatherId: this.fatherId,
						article_id: this.articleId != undefined ? this.articleId : 0,
						media_urls: this.media_urls
					},
					{
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					},
				)
					.then(function (response) {
						uni.showToast({
							title: "发表成功",
							icon: 'none',
							duration: 2000
						});
						// _this.refreshPage(1,10);
						for (let item of _this.reviews) {
							let items = [item, ...item.reviewLess];
							for (let subItem of items) {
								if (subItem.comment_id == response.data.reply_to_id) {
									console.log("reply_to", subItem);
									item.reviewLess.push({
										comment_id: response.data.essay_comment_id,
										userName: response.data.name,
										userId: response.data.user_id,
										targetUserName: _this.replyToUserName,
										sendMsg: response.data.content,
										article_id: item.article_id,
										media_urls: _this.media_urls || []
									});
									break;
								}
							}
						}
						_this.$forceUpdate();
					_this.commentText = "";
					_this.media_urls = []; // 清空已上传图片
					// 重置回复状态
					_this.cancelReply();
					})
					.catch(function (error) {
						if (error) {
							uni.showToast({
								title: "发表失败",
								icon: 'none',
								duration: 2000
							});
						}
					});
			}
		},
		loadParagraphInfo() {
			axios.get(this.$baseUrl + '/articles/get_article?id=' + this.articleId).then((res) => {
				let article = res.data[0];
				article.content = JSON.parse(article.content);
				for (let item of article.content) {
					if (item.id == this.paragraphId) {
						this.paragraph = item.value;
						break;
					}
				}
			}).catch(function (error) {
				console.log(error);
				if (error) {
					// uni.showToast({
					// 	title: "获取文章信息失败",
					// 	icon: 'none',
					// 	duration: 2000
					// });
				}
			}).then(function () {
			})
		},
		childReview(item) {
			this.replyToId = item.review.comment_id;
			this.fatherId = item.father;
			this.replyToUserName = item.review.userName;
			this.commentPlaceholder = "回复 " + item.review.userName + "：";
			this.isFocus = true;
			document.querySelector("textarea").focus();
		},
		cancelReply() {
			this.replyToId = -1;
			this.fatherId = -1;
			this.replyToUserName = "";
			this.commentPlaceholder = "发一条友善的评论";
			if (this.media_urls.length === 0) {
				this.isFocus = false;
			}
		},
		textFocus() {
			this.isFocus = true;
		},
		textBlur() {
			// 延迟关闭，确保能点击上传按钮和其他操作
			setTimeout(() => {
				// 只有在非回复状态且没有图片时才关闭焦点状态
				if (this.replyToId === -1 && this.media_urls.length === 0) {
					this.isFocus = false;
				}
			}, 300)
		},
		changePraise(ev) {
			for (let item of this.reviews) {
				if (item.comment_id == ev.id) {
					item.likeNum = item.likeNum + ev.changeNum;
				}
			}
		},
		deleteComment(id) {
			for (let item of this.reviews) {
				if (item.comment_id == id) {
					this.reviews.splice(this.reviews.indexOf(item), 1);
					console.log("delete", item);
					break;
				}
				for (let subItem of item.reviewLess) {
					if (subItem.comment_id == id) {
						item.reviewLess.splice(item.reviewLess.indexOf(subItem), 1);
						console.log("delete", subItem);
						break;
					}
				}
			}
			this.$forceUpdate();
		},
		toggleImageUpload() {
			if (this.media_urls.length < 3) {
				this.chooseImage();
			}
		},
		async chooseImage() {
			try {
				const res = await uni.chooseImage({
					count: 3 - this.media_urls.length,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera']
				})

				uni.showLoading({ title: '正在上传图片...' })

				for (let tempFile of res[1].tempFilePaths) {
					const uploadRes = await this.uploadFile(tempFile)
					this.media_urls.push(uploadRes.url)
				}
				this.isFocus = true;

				uni.hideLoading()
			} catch (error) {
				uni.hideLoading()
				console.error('上传图片失败', error)
				uni.showToast({
					title: '上传图片失败',
					icon: 'none'
				})
			}
		},
		async uploadFile(filePath) {
			return new Promise((resolve, reject) => {
				uni.showToast({
					title: "图片上传中",
					icon: 'loading',
					duration: 2000
				});
				uni.uploadFile({
					url: 'https://storage.codesocean.top/api/resource/upload?container=172018735018984',
					filePath: filePath,
					name: 'file',
					header: {
						ServiceKey: "a24785bedb466b9733dd317771d4b69c08da07fd"
					},
					success: (uploadRes) => {
						try {
							const data = JSON.parse(uploadRes.data);
							resolve({
								url: "https://storage.codesocean.top/api/resource/get/" + data.data.resource_id
							});
						} catch (e) {
							reject(e);
						}
					},
					fail: (error) => {
						reject(error);
					}
				});
			});
		},
		deleteImage(index) {
			this.media_urls.splice(index, 1);
		},
		// 处理表情选择
		onEmojiSelect(data) {
			if (data.type === 'emoji') {
				// 直接插入Emoji表情
				this.commentText += data.content;
			} else if (data.type === 'sticker') {
				// 直接将表情包作为图片添加到 media_urls 中
				this.media_urls.push(data.content);
				// 确保焦点状态
				this.isFocus = true;
			}
		},

	}
}
</script>

<style lang="scss" scoped>
.commentOuter {
	background-color: rgb(255, 248, 234);

	.cento {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}

	.reply {
		position: fixed;
		background-color: #f2f2f2;
		border-top: 1rpx rgb(195, 195, 195) solid;
		bottom: 0;
		width: 100vw;
		display: flex;
		flex-direction: column;
		z-index: 50;

		.reply-status {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx 20rpx;
			background-color: #e8f4fd;
			border-bottom: 1rpx solid #d0d0d0;
			
			.reply-status-text {
				font-size: 28rpx;
				color: #666;
			}
			
			.cancel-reply-btn {
				padding: 5rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.reply-row {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		textarea {
			margin: 20rpx;
			padding: 20rpx;
			border-radius: 15rpx;
			background-color: rgba(127, 127, 127, 0.2);
			font-size: 35rpx;
			line-height: 35rpx;
			color: rgb(113, 113, 113)
		}

		.image-upload-area {
			padding: 10rpx 20rpx;
		}

		.image-grid {
			display: flex;
			flex-wrap: wrap;
			margin: -5rpx;
		}

		.image-item,
		.upload-btn {
			width: calc(33.33% - 10rpx);
			height: 150rpx;
			margin: 5rpx;
			border-radius: 8rpx;
			overflow: hidden;
			position: relative;
		}

		.image-item log-image {
			width: 100%;
			height: 100%;
		}

		.delete-btn {
			position: absolute;
			top: 5rpx;
			right: 5rpx;
			width: 30rpx;
			height: 30rpx;
			background-color: rgba(0, 0, 0, 0.5);
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.upload-btn {
			background-color: #f8f8f8;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 2rpx dashed #ddd;
		}

		.icon-row {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 0 20rpx 20rpx 20rpx;
			margin-top: 10rpx;

			.emoji-icon {
				width: 40rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
			}

			.image-icon {
				width: 40rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
			}

			.send-icon {
				height: 100%;
				padding-top: 5rpx;
			}
		}
	}

	.comment_item {
		transition: filter 0.3s ease;
	}

	.highlight_comment {
		filter: brightness(0.9);
	}

	.blank_box {
		height: calc(125rpx + 150rpx);
		/* 增加底部留白高度，以适应图片上传区域 */
	}
}
</style>
