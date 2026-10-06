<template>
	<view class="commentOuter" :class="{ 'component-mode': componentMode }" :style="{ '--statusBarHeight': 0 + 'px' }" v-dark>
		<z-paging ref="paging" v-model="reviews" @onRefresh="pullDown" @query="refreshPage"
			:customOperationText="componentMode ? '收起' : '刷新'"
			:fixed="!componentMode"
			:style="{ 'marginTop': '0px', 'height': componentMode ? '100%' : 'auto' }"
			:default-page-size="componentMode ? 10 : 10">
			<nothing :msg="'还没有评论哦\n快来抢沙发吧~'" slot="empty" height="calc(80vh - 55rpx - 124px)"></nothing>
			<div v-if="paragraphId !== undefined" class="cento-banner" @click="navToChapter">
				<svg t="1708145570940" class="icon" viewBox="0 0 1024 1024" version="1.1"
					xmlns="http://www.w3.org/2000/svg" p-id="2306" width="14" height="14" style="margin: 0 5px 0 0;">
					<path d="M128 472.896h341.344v341.344H128zM128 472.896L272.096 192h110.08l-144.128 280.896z"
						fill="currentColor" p-id="2307"></path>
					<path d="M544 472.896h341.344v341.344H544zM544 472.896L688.096 192h110.08l-144.128 280.896z"
						fill="currentColor" p-id="2308"></path>
				</svg>
				<div class="cento">
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
					<uni-icons type="closeempty" size="20" color="var(--manga-muted, #656c74)"></uni-icons>
				</view>
			</view>
			
			<div class="reply-row">
				<textarea class="reply-input" type="text" auto-height :placeholder="commentPlaceholder" maxlength="300"
					v-model="commentText" @focus="textFocus" @blur="textBlur"></textarea>

				<view class="icon-row">
					<view class="emoji-icon">
						<emoji-picker @select="onEmojiSelect"></emoji-picker>
					</view>
					<view class="image-icon" @tap="toggleImageUpload">
						<uni-icons type="image" size="30" color="var(--manga-muted, #656c74)"></uni-icons>
					</view>
					<button class="send-btn" type="button" :disabled="isSubmitting || !commentText" @click="submitComment">{{ isSubmitting ? '发布中' : '发布' }}</button>
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
import darkModeMixin from '@/mixins/dark-mode.js'
export default {
	components: {
		commentItem, nothing, emojiPicker
	},
	mixins: [darkModeMixin],
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
			isSubmitting: false,
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
			this.applyCommentContext(this.componentData);
			// 获取粉丝排名
			if (this.novelId) {
				this.fetchFanRanks();
			}
		}
	},
	onLoad(params) {
		if (params.comment_id !== undefined) {
			this.preLoadCommentId = params.comment_id;
		}
		if (!this.componentMode) {
			this.applyCommentContext(params);
			if (params.articleId !== undefined) {
				uni.setNavigationBarTitle({
					title: "章节评论"
				})
				if (params.paragraphId !== undefined) {
					uni.setNavigationBarTitle({
						title: "段落评论"
					})
				}
			}
			if (params.extraId !== undefined) {
				this.extraCommentId = params.extraId;
			}
			// 获取粉丝排名
			if (this.novelId) {
				this.fetchFanRanks();
			}
		}
	},
	methods: {
		applyCommentContext(data = {}) {
			this.novelId = data.novelId !== undefined ? data.novelId : data.id;
			this.articleId = data.articleId !== undefined ? data.articleId : undefined;
			this.paragraphId = data.paragraphId !== undefined ? data.paragraphId : undefined;
			if (data.paragraphText !== undefined) {
				this.paragraph = data.paragraphText;
			} else if (data.paragraphId === undefined) {
				this.paragraph = undefined;
			}
			if (this.paragraphId !== undefined && (this.paragraph === undefined || this.paragraph === null || this.paragraph === '')) {
				this.loadParagraphInfo();
			}
		},
		getParagraphIdentity(item) {
			if (!item) {
				return undefined;
			}
			const paragraphId = item.id !== undefined ? item.id : item.paragraph_id;
			if (paragraphId === undefined || paragraphId === null || paragraphId === '') {
				return undefined;
			}
			return Number(paragraphId);
		},
		emitCommentChanged(delta = 0) {
			this.$emit('commentChanged', {
				novelId: this.novelId,
				articleId: this.articleId,
				paragraphId: this.paragraphId,
				delta: Number(delta) || 0
			});
		},
		getParagraphValue(item) {
			if (!item) {
				return undefined;
			}
			if (Array.isArray(item.value)) {
				return item.value.join('');
			}
			return item.value;
		},
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
		getTokenInfo() {
			try {
				return JSON.parse(window.localStorage.getItem('token'));
			} catch (e) {
				return null;
			}
		},
		async fetchPraiseStatusMap(commentIds) {
			const tokenInfo = this.getTokenInfo();
			if (!tokenInfo || !tokenInfo.tk || !commentIds.length) {
				return {};
			}
			try {
				const res = await axios.get(this.$baseUrl + '/community/get_comment_praise_statuses', {
					params: {
						comment_ids: commentIds.join(',')
					},
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + tokenInfo.tk
					}
				});
				let praiseStatusMap = {};
				for (let item of (res.data || [])) {
					praiseStatusMap[item.novel_comment_id] = Number(item.type);
				}
				return praiseStatusMap;
			} catch (e) {
				return null;
			}
		},
		buildCommentItem(item, praiseStatusMap = {}) {
			const praiseStatusesLoaded = praiseStatusMap !== null;
			praiseStatusMap = praiseStatusMap || {};
			const hasPraiseStatus = Object.prototype.hasOwnProperty.call(
				praiseStatusMap,
				item.essay_comment_id
			);
			const praiseType = hasPraiseStatus ? praiseStatusMap[item.essay_comment_id] : 3;
			const replies = Array.isArray(item.replies) ? item.replies : [];
			let userNameMap = {
				[item.essay_comment_id]: item.name
			};
			for (let reply of replies) {
				userNameMap[reply.essay_comment_id] = reply.name;
			}

			return {
				author_id: item.author_id,
				comment_id: item.essay_comment_id,
				headImgSrc: item.avatar_url,
				avatarFrame: item.avatar_frame || null,
				userName: item.name,
				userId: item.user_id,
				sendTime: this.utc2beijing(item.comment_time),
				sendMsg: item.content,
				likeNum: Math.max(
					Number(item.likeNum) || 0,
					praiseStatusesLoaded && Number(praiseType) === 0 ? 1 : 0
				),
				reviewLess: replies.map((reply) => ({
					comment_id: reply.essay_comment_id,
					userName: reply.name,
					userId: reply.user_id,
					targetUserName: userNameMap[reply.reply_to_id] || item.name,
					sendMsg: reply.content,
					article_id: reply.article_id,
					media_urls: reply.media_urls || []
				})),
				reviewNum: replies.length,
				article_id: item.article_id,
				article_title: item.article_title || '',
				cento_id: item.cento_id,
				cento: item.cento,
				media_urls: item.media_urls || [],
				...(praiseStatusesLoaded ? {
					praiseType
				} : {})
			}
		},
		async refreshPage(pageNo, pageSize) {
			await this.delay();
			if (this.$refs.paging == undefined) return;
			uni.showLoading({
				title: '努力加载中'
			});
			let data = [];
			// fast 接口单请求返回根评论 + 内嵌回复 + 点赞数 + 引文，避免逐条拉回复的瀑布
			await axios.get(this.$baseUrl + "/community/novel_commonts_all_fast?id=" + this.novelId
				+ "&page=" + pageNo + "&pageSize=" + pageSize + ((this.articleId != undefined) ? `&articleId=${this.articleId}` : '')
				+ ((this.paragraphId != undefined) ? `&paragraphId=${this.paragraphId}` : ''))
				.then((res) => {
					data = res.data || [];
					if (this.paragraphId !== undefined) {
						data = data.filter((item) => item.cento && item.cento.paragraph_id == this.paragraphId);
					}
				}).catch((err) => {
					uni.showToast({
						title: "评论信息获取失败",
						icon: 'none',
						duration: 2000
					});
				})
			const praiseStatusMap = await this.fetchPraiseStatusMap(
				data.map((item) => item.essay_comment_id)
			);
			const reviews = data.map((item) => this.buildCommentItem(item, praiseStatusMap));
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
		async loadComment(commentId) {
			const [commentRes, replyRes] = await Promise.all([
				axios.get(this.$baseUrl + "/community/novel_comment_from_comment_id?comment_id=" + commentId),
				axios.get(this.$baseUrl + "/community/novel_commonts_reply_to?id=" + commentId),
			]);
			let data = commentRes.data;
			if (data.length > 0) {
				const rootComment = data[0];
				rootComment.replies = replyRes.data || [];
				const praiseStatusMap = await this.fetchPraiseStatusMap([rootComment.essay_comment_id]);
				this.$refs.paging.addDataFromTop([this.buildCommentItem(rootComment, praiseStatusMap)], true, true);
			}
		},
		async submitComment() {
			if (this.commentText == "" || this.isSubmitting) return;
			this.isSubmitting = true;
			uni.showLoading({
				title: '发送中...',
				mask: true
			});
			let tk = JSON.parse(window.localStorage.getItem('token')); if (tk) tk = tk.tk;;
			try {
				// 发表根评论
				if (this.replyToId == -1) {
					const response = await axios.post(this.$baseUrl + '/community/comment_on_novel',
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
					);
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
						avatarFrame: item.avatar_frame || null,
						userName: item.name,
						userId: item.user_id,
						sendTime: this.utc2beijing(item.comment_time),
						sendMsg: item.content,
						likeNum: item.likeNum,
						reviewLess: [],
						reviewNum: 0,
						article_id: item.article_id,
						article_title: item.article_title || '',
						cento_id: item.cento_id,
						cento: item.cento,
						media_urls: this.media_urls || [],
						praiseType: 3
					}
					this.$refs.paging.addDataFromTop([commentItem], true, true);
					this.commentText = "";
					this.media_urls = []; // 清空已上传图片
					this.isFocus = false; // 关闭焦点状态
					this.emitCommentChanged(1);
				} else {
					// 发表回复
					const response = await axios.post(this.$baseUrl + '/community/reply_to_novel_comment',
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
					);
					uni.showToast({
						title: "发表成功",
						icon: 'none',
						duration: 2000
					});
					// this.refreshPage(1,10);
					for (let item of this.reviews) {
						let items = [item, ...item.reviewLess];
						for (let subItem of items) {
							if (subItem.comment_id == response.data.reply_to_id) {
								console.log("reply_to", subItem);
								item.reviewLess.push({
									comment_id: response.data.essay_comment_id,
									userName: response.data.name,
									userId: response.data.user_id,
									targetUserName: this.replyToUserName,
									sendMsg: response.data.content,
									article_id: item.article_id,
									media_urls: this.media_urls || []
								});
								break;
							}
						}
					}
					this.$forceUpdate();
					this.commentText = "";
					this.media_urls = []; // 清空已上传图片
					// 重置回复状态
					this.cancelReply();
					this.emitCommentChanged(1);
				}
			} catch (error) {
				if (error) {
					uni.showToast({
						title: "发表失败",
						icon: 'none',
						duration: 2000
					});
				}
			} finally {
				this.isSubmitting = false;
				uni.hideLoading();
			}
		},
		loadParagraphInfo() {
			const targetParagraphId = Number(this.paragraphId);
			if (!this.articleId || !Number.isFinite(targetParagraphId)) {
				this.paragraph = undefined;
				return;
			}
			axios.get(this.$baseUrl + '/articles/get_article?id=' + this.articleId).then((res) => {
				let article = res.data[0] || {};
				let content = article.content;
				if (typeof content === 'string') {
					content = JSON.parse(content);
				}
				if (!Array.isArray(content)) {
					content = [];
				}
				const targetParagraph = content.find((item) => {
					return item && (!item.type || item.type === 'text') && this.getParagraphIdentity(item) === targetParagraphId;
				});
				this.paragraph = this.getParagraphValue(targetParagraph);
			}).catch((error) => {
				console.log(error);
				this.paragraph = undefined;
				if (error) {
					// uni.showToast({
					// 	title: "获取文章信息失败",
					// 	icon: 'none',
					// 	duration: 2000
					// });
				}
			}).then(() => {
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
					item.likeNum = Math.max(
						0,
						(Number(item.likeNum) || 0) + (Number(ev.changeNum) || 0)
					);
				}
			}
		},
		deleteComment(id) {
			for (let item of this.reviews) {
				if (item.comment_id == id) {
					this.reviews.splice(this.reviews.indexOf(item), 1);
					console.log("delete", item);
					this.emitCommentChanged(-1);
					break;
				}
				for (let subItem of item.reviewLess) {
					if (subItem.comment_id == id) {
						item.reviewLess.splice(item.reviewLess.indexOf(subItem), 1);
						console.log("delete", subItem);
						this.emitCommentChanged(-1);
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
@import '@/common/manga-theme.scss';

.commentOuter {
	@include manga-theme;

	height: 100%;

	&.component-mode {
		min-height: 0;
	}

	// 段落评论顶部的原文引用条
	.cento-banner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8rpx;
		margin: 20rpx 24rpx 10rpx;
		padding: 10rpx 16rpx;
		border-radius: 12rpx;
		background: var(--manga-card);
		border: 1rpx solid var(--manga-line);
		color: var(--manga-muted);
		font-size: 22rpx;

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

	.reply {
		position: fixed;
		bottom: 0;
		width: 100vw;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		z-index: 50;
		background: var(--manga-card);
		border-top: 1rpx solid var(--manga-line);

		.reply-status {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 16rpx;
			margin: 14rpx 20rpx 0;
			padding: 12rpx 18rpx;
			border-radius: 12rpx;
			background: var(--manga-bg);

			.reply-status-text {
				min-width: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: var(--manga-muted);
				font-size: 23rpx;
			}

			.cancel-reply-btn {
				flex: none;
				padding: 5rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.reply-row {
			display: flex;
			align-items: flex-end;
			gap: 12rpx;
			padding: 20rpx 20rpx 0;
		}

		.reply-input {
			box-sizing: border-box;
			flex: 1;
			min-width: 0;
			min-height: 88rpx;
			max-height: 240rpx;
			padding: 18rpx 22rpx;
			border: 1rpx solid var(--manga-line);
			border-radius: 16rpx;
			background: var(--manga-bg);
			color: var(--manga-text);
			font-size: 26rpx;
			line-height: 1.6;
		}

		.icon-row {
			display: flex;
			align-items: center;
			gap: 12rpx;
			padding: 10rpx 20rpx 20rpx;

			.emoji-icon,
			.image-icon {
				width: 76rpx;
				height: 76rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--manga-muted);
			}

			.image-icon {
				margin-left: auto;
			}
		}

		.send-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 108rpx;
			height: 76rpx;
			padding: 0 22rpx;
			border-radius: 100rpx;
			background: var(--manga-action);
			color: #fff;
			font-size: 25rpx;
			font-weight: 700;
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
			border-radius: 12rpx;
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
			background-color: var(--manga-bg);
			display: flex;
			justify-content: center;
			align-items: center;
			border: 2rpx dashed var(--manga-line);
		}
	}

	.comments {
		padding-bottom: 20rpx;
	}

	.comment_item {
		transition: filter 0.3s ease;
	}

	// 命中的评论：漫画评论的高亮为 tint 底圆角
	.comments .comment_item.highlight_comment {
		background: var(--manga-tint);
		border-radius: 16rpx;
	}

	.blank_box {
		height: calc(125rpx + 150rpx);
		/* 增加底部留白高度，以适应图片上传区域 */
	}
}
</style>
