<template>
	<div class="outer" :style="{'--statusBarHeight': 0 + 'px'}">
		<div class="gift_box" id="gift_box">
			<img class="gift_background" id="gift_background" src="../../static/bg.png"></img>
			<log-image class="gift" id="gift" :src="giftImage"></log-image>
		</div>
		<div class="top">
			<zetank-backBar textcolor="#000" :showLeft="true" :showHome="true" :showTitle="false"
				navTitle='标题'></zetank-backBar>
			<div class="title">
				{{world.name}}
			</div>
			<div class="info">
				<view class="author" @click="gotoUserProfile(world.creator_id)">
					<log-image :src="world.avatar_url" alt="" class="auther_avatar"
						onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
					<div class="auther_name">{{world.user_name}}<uni-icons type="forward" size="18"
							style="color:#666666"></uni-icons>
					</div>
				</view>
				<div class="recentUpdate"
					style="font-size: 28rpx; height:50rpx; line-height: 50rpx; margin:10rpx;color: #666666;">
					最近更新：{{utc2beijing(world.update_time)}}
				</div>
			</div>
			<div class="desc">
				{{world.content}}
			</div>
			<div class="buttons">
				<div class="button" @click="nice()">
					<img v-if="niceStatus" src="../../static/icons/icon_niced.png" mode="widthFix">
					<img v-else src="../../static/icons/icon_nice.png" mode="widthFix">
					<div class="text">{{nice_amount}} 赞</div>
				</div>
				<div class="button" @click="isInBookcase?removeFromBookcase():addToBookcase()">
					<img v-if="isInBookcase" src="../../static/icons/icon_add.png" mode="widthFix">
					<img v-else src="../../static/icons/icon_add.png" mode="widthFix">
					<div class="text">{{isInBookcase?'已收藏':'收藏'}}</div>
				</div>
				<div class="button" @click="tip()">
					<img src="../../static/icons/icon_sponsored.png" mode="widthFix">
					<div class="text">打赏</div>
				</div>
				<div class="button" @click="shareBook()">
					<img src="../../static/icons/icon_share.png" mode="widthFix">
					<div class="text">分享</div>
				</div>
			</div>
			<div class="enterButton" @click="editWorld(world.novel_id)"
				v-show="this.myUserInfo.user_id == world.creator_id">编辑设定</div>
		</div>
		<div class="content">
			<el-tabs :lazy="true">
				<el-tab-pane>
					<span class="paneLabel" slot="label">世界设定</span>
					<div class="worldContent">
						<div class="title" style="margin-top: 10rpx;">
							<div class="line"></div>
							<span>世界大纲</span>
						</div>
						<el-collapse style="margin-top: 20rpx;" :accordion="true" :value="''"
							v-show="worldOutlines.length != 0" class="collapse2list">
							<el-collapse-item v-for="outline in worldOutlines" name="1" :key="outline.article_id" 
								:title="outline.title" :name="outline.article_id" :disabled="true" style="color: black !important;" @click.native="gotoArticle(outline.article_id)">
							</el-collapse-item>
						</el-collapse>
						<div class="nothing" v-show="worldOutlines.length == 0"
							style="display:flex; flex-direction: column; align-items: center; justify-content: center; margin: 100rpx 0;">
							<img src="../../static/nothing.png" alt="" style="width: 15vw; margin: 25rpx 0;" />
							<div style="color:#777777; font-size: 25rpx;">这是一片什么都没有的荒原</div>
						</div>
						<div class="title" style="margin-top: 30rpx; display: flex; justify-content: space-between; align-items: center;">
							<div style="display: flex; align-items: center;">
								<div class="line"></div>
								<span>世界词条</span>
							</div>
							<div @click="gotoRelations()" style="font-size: 26rpx; color: #6e3b24; margin-right: 20rpx; font-weight: bold;">
								查看关系网
							</div>
						</div>
						<div class="vocabs" style="margin-top: 20rpx;">
							<el-tag v-for="item of worldVoabs" style="margin-right: 20rpx; margin-bottom: 20rpx;"
								@click="gotoArticle(item.article_id)">{{item.title}}</el-tag>
						</div>
						<div class="nothing" v-show="worldVoabs.length == 0"
							style="display:flex; flex-direction: column; align-items: center; justify-content: center; margin: 100rpx 0;">
							<img src="../../static/nothing.png" alt="" style="width: 15vw; margin: 25rpx 0;" />
							<div style="color:#777777; font-size: 25rpx;">这是一片什么都没有的荒原</div>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane>
					<span class="paneLabel" slot="label">关联作品</span>
					<div v-for="novel in assoNovels" :key="novel.novel_id" v-show="assoNovels.length != 0">
						<navigator :url="'../readers/bookInfo?id=' +  novel.novel_id" open-type="navigate" class="books">
							<log-image :src="novel.picUrl + '?thumbnail=1'" alt=""
								:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`"
								style="border-radius: 10rpx; transform:scale(.90)" />
							<div class="bookInfo" style="margin-left:10rpx;">
								<div class="title">
									{{novel.name}}
									<el-tag type="warning" v-show="novel.novel_type == 'world'" effect="dark"
										style="margin-left:10rpx; transform:translateY(-5rpx)" size="mini">世界设定</el-tag>
								</div>
								<view class="author">
									<log-image :src="novel.avatar_url" alt="" class="auther_avatar"
										onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
									<div class="auther_name">{{novel.user_name}}</div>
								</view>
								<div class="description">{{novel.content}}</div>
							</div>
						</navigator>
					</div>
					<div class="nothing" v-show="assoNovels.length == 0"
						style="display:flex; flex-direction: column; align-items: center; justify-content: center; margin: 30rpx 0;">
						<img src="../../static/nothing.png" alt="" style="width: 15vw; margin: 25rpx 0;" />
						<div style="color:#777777">这是一片什么都没有的荒原</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		
		<div class="content" style="padding-bottom: 50rpx;">
			<view class="l-list" style="margin-bottom: 30rpx;">
				<view class="l-h3">
					<text class="l-h3-title">粉丝榜</text>
					<navigator :url="'../readers/novel_fans?id=' + world.novel_id">
						<view class="l-h3-more">查看粉丝榜<img class="l-icon-more" src="../../static/l-icon-more.png"
								mode="widthFix"></img>
						</view>
					</navigator>
				</view>

				<div class="fans_rank">
					<div class="second" v-if="fanInfo[1]">
						<div class="rank-container">
							<log-image :src="fanInfo[1].avatar_url" alt="" class="avatar" />
							<img src="../../static/rank/NO2.png" alt="" class="rank" />
							<div class="crown-glow silver"></div>
							<div class="description">
								<p class="name">{{ fanInfo[1].user_name }}</p>
								<p class="value"><span class="value-icon">💫</span> {{ fanInfo[1].fans_value }}
								</p>
							</div>
						</div>
					</div>
					<div class="first" v-if="fanInfo[0]">
						<div class="rank-container">
							<log-image :src="fanInfo[0].avatar_url" alt="" class="avatar" />
							<img src="../../static/rank/NO1.png" alt="" class="rank" />
							<div class="crown-glow gold"></div>
							<div class="description">
								<p class="name">{{ fanInfo[0].user_name }}</p>
								<p class="value"><span class="value-icon">✨</span> {{ fanInfo[0].fans_value }}</p>
							</div>
						</div>
					</div>
					<div class="third" v-if="fanInfo[2]">
						<div class="rank-container">
							<log-image :src="fanInfo[2].avatar_url" alt="" class="avatar" />
							<img src="../../static/rank/NO3.png" alt="" class="rank" />
							<div class="crown-glow bronze"></div>
							<div class="description">
								<p class="name">{{ fanInfo[2].user_name }}</p>
								<p class="value"><span class="value-icon">⭐</span> {{ fanInfo[2].fans_value }}</p>
							</div>
						</div>
					</div>
				</div>
			</view>

			<!-- 4-10名粉丝列表 -->
			<div class="fans-list-container" v-if="fanInfo.length > 3" style="margin-bottom: 30rpx;">
				<div class="fans-list-item" v-for="(fan, index) in fanInfo.slice(3, 10)" :key="index">
					<div class="fans-rank">{{ index + 4 }}</div>
					<log-image :src="fan.avatar_url" alt="" class="fans-avatar" />
					<div class="fans-info">
						<div class="fans-name">{{ fan.user_name }}</div>
						<div class="fans-message" v-if="fan.message">{{ fan.message }}</div>
					</div>
					<div class="fans-value"><span class="fans-value-icon">🔸</span>{{ fan.fans_value }}</div>
				</div>
			</div>

			<view class="l-h3">
				<text class="l-h3-title">评论</text>
				<view @click="navtoComment()">
					<view class="l-h3-more">全部(共 {{ commentAmount }} 条)<img class="l-icon-more"
							src="../../static/l-icon-more.png" mode="widthFix"></img>
					</view>
				</view>
			</view>
			<view class="l-comments">
				<div class="nothing" v-show="commentInfo.length == 0"
					style="display:flex; flex-direction: column; align-items: center; justify-content: center; margin: 30rpx 0;">
					<img src="../../static/nothing.png" alt="" style="width: 10vw; margin: 25rpx 0;" />
					<div style="color:#777777; font-size: 25rpx;">还没有人评论哦</div>
				</div>
				<view class="l-comment-list" v-for="(item, index) in commentInfo" :key="index">
					<view class="l-comment-list-header">
						<log-image class="l-comment-list-header-avatar" :src="item.avatar_url" mode="scaleToFill"
							@click="gotoUserProfile(item.user_id)"></log-image>
						<view class="l-comment-list-header-name">
							{{ item.name }}
						</view>
						<view class="l-comment-list-header-time">
							{{ utc2beijing(item.comment_time) }}
						</view>
					</view>
					<view class="l-comment-list-body">
						{{ item.content }}
					</view>
				</view>
			</view>
		</div>
		<uni-popup ref="popup" type="bottom">
			<view class="tippingBar">
				<tippingBar :novel_id="world.novel_id" @tip="runGiftAnimation($event)"></tippingBar>
			</view>
		</uni-popup>
	</div>
</template>

<script>
	import axios from "axios";
	import tippingBar from "../../components/tipping/tippingBar.vue"
	import nothing from '../../components/nothing.vue'
	export default {
		components: {
			tippingBar,
			nothing
		},
		data() {
			return {
				options: {},
				world: {},
				worldOutlines: [],
				worldVoabs: [],
				myUserInfo: {},
				assoNovels: [],
				niceStatus: false,
				nice_amount: 0,
				isInBookcase: false,
				commentInfo: [],
				commentAmount: 0,
				giftImage: "",
				fanInfo: [],
			}
		},
		methods: {
			utc2beijing(utc_datetime) {
				if (utc_datetime == undefined) return;
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
				return beijing_datetime;
			},
			getFansStatistics() {
				axios.get(this.$baseUrl + "/library/get_all_novel_fans?novel_id=" + this.world.novel_id)
					.then((res) => {
						this.fanInfo = res.data;
					}).catch(err => {
						// uni.showToast({
						// 	title: err.toString(),
						// 	icon: 'none',
						// 	duration: 2000
						// });
					})
			},
			getWorldInfo() {
				if (this.options.id) {
					axios.get(this.$baseUrl + '/world/get_world_by_id?world_id=' + this.options.id).then((res) => {
						this.world = res.data[0];
						this.getArticles(this.world.novel_id, this.world.world_id)
						this.getNices();
						this.getCommentNum();
						this.getComments();
						this.checkBookcase();
						this.getFansStatistics();
					}).catch(function(error) {
						uni.showToast({
							title: error.toString(),
							icon: 'none',
							duration: 2000
						});
					}).then(function() {
						uni.hideLoading();
					})
				} else if (this.options.novel_id) {
					axios.get(this.$baseUrl + '/world/get_world_by_novel_id?novel_id=' + this.options.novel_id).then((
						res) => {
							// console.log(res.data);
							this.world = res.data[0];
							this.getArticles(this.world.novel_id, this.world.world_id)
							this.getNices();
							this.getCommentNum();
							this.getComments();
							this.checkBookcase();
							this.getFansStatistics();
						}).catch(function(error) {
						uni.showToast({
							title: error.toString(),
							icon: 'none',
							duration: 2000
						});
					}).then(function() {
						uni.hideLoading();
					})
				}

			},
			gotoUserProfile(id) {
				uni.navigateTo({
					url: "../users/personalPage?id=" + id
				})
			},
			getArticles(uid, worldId) {
				let _this = this;
				_this.worldOutlines = [];
				_this.worldVoabs = [];
				axios.get(this.$baseUrl + '/library/get_articles?id=' + uid, {}).then((res) => {
					// console.log(res.data);
					for (let item of res.data) {
						if (item.article_type == "worldOutline") {
							_this.worldOutlines.push(item);
							item.content = "努力加载中"
						} else if (item.article_type == "worldVocabulary") {
							_this.worldVoabs.push(item);
						}
					}
					this.$forceUpdate()
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(function() {
					uni.hideLoading();
				})
				this.getAssoNovels();
			},
			getAssoNovels() {
				// 获取关联世界
				axios.get(this.$baseUrl + '/world/get_asso_world_by_world_id?world_id=' + this.world.world_id).then((
					res) => {
					console.log(res.data);
					this.assoNovels = res.data;
				}).catch(function(error) {
					if (error.message == "Request failed with status code 401") {
						window.localStorage.removeItem('token');
						this.$isFromLogin = true;
						uni.navigateTo({
							url: './users/login?msg=' + 'unAuthorized'
						});
					} else {
						uni.showToast({
							title: "获取关联世界设定失败",
							icon: 'none',
							duration: 2000
						});
					}
				}).then(function() {
					uni.hideLoading();
				})
			},
			editWorld(uid) {
				uni.navigateTo({
					url: "../writers/allArticles?id=" + uid + '&worldId=' + this.world.world_id
				})
			},
			outlineAccordianChange(activeName) {
				if (activeName == "") return;
				this.gotoArticle(activeName);
				// axios.get(this.$baseUrl + '/articles/get_article?id=' + activeName).then((res) => {
				// 	for (let item of this.worldOutlines) {
				// 		if (item.article_id == activeName) {
				// 			let articleContent = JSON.parse(res.data[0].content);
				// 			let textContent = "";
				// 			for(let paragraph of articleContent) {
				// 				if(paragraph.type == 'text') {
				// 					textContent += paragraph.value + "\n";
				// 				}
				// 			}
				// 			item.content = textContent;
				// 		}
				// 	}
				// 	this.$forceUpdate();
				// }).catch(function(error) {
				// 	uni.showToast({
				// 		title: error.toString(),
				// 		icon: 'none',
				// 		duration: 2000
				// 	});
				// })
			},
			gotoArticle(uid) {
				uni.navigateTo({
					url: '../readers/newReader/article?id=' + uid + "&novelId=" + this.world.novel_id
				})
			},
			gotoRelations() {
				uni.navigateTo({
					url: '../worlds/worldRelations?novel_id=' + this.world.novel_id
				})
			},
			navtoComment() {
				uni.navigateTo({
					url: `/pages/readers/bookComment?id=` + this.world.novel_id
				})
			}, 
			addToBookcase() {
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				axios.post(this.$baseUrl + '/bookcase/like_novel', {
					novel_id: this.world.novel_id
				}, {
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				},)
					.then(function (response) {
						uni.showToast({
							title: "成功添加到书架",
							icon: 'none',
							duration: 2000
						});
						_this.isInBookcase = true;
					})
					.catch(function (error) {
						if (error.message == "Request failed with status code 401") {
							window.localStorage.removeItem('token');
							uni.navigateTo({
								url: '../users/login'
							});
						}
						if (error) {
							uni.showToast({
								title: "添加失败",
								icon: 'none',
								duration: 2000
							});
						}
					});
			},
			getCommentNum() {
				axios.get(this.$baseUrl + "/community/novel_commonts_amount?id=" + this.world.novel_id)
					.then((res) => {
						var commentAmountObject = res.data[0]
						this.commentAmount = commentAmountObject["COUNT(*)"];
					}).catch(err => {
						// uni.showToast({
						// 	title: err.toString(),
						// 	icon: 'none',
						// 	duration: 2000
						// });
					})
			},
			getNices() {
				axios.get(this.$baseUrl + "/library/get_nices_by_id?id=" + this.world.novel_id)
					.then((res) => {
						this.nice_amount = res.data[0].nices;
					}).catch(err => {
						// uni.showToast({
						// 	title: err.toString(),
						// 	icon: 'none',
						// 	duration: 2000
						// });
					})
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				if (tk) {
					axios.get(this.$baseUrl + '/library/get_nice_status?id=' + this.world.novel_id, {
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': "Bearer " + tk //设置token 其中K名要和后端协调好
						}
					}).then((res) => {
						if (res.data[0].nices == 1) {
							_this.niceStatus = true;
						} else {
							_this.niceStatus = false;
						}
					}).catch(function (error) {
						if (error.message == "Request failed with status code 401") {
							window.localStorage.removeItem('token');
							uni.navigateTo({
								url: '../users/login?msg=' + 'unAuthorized'
							});
						}
					})
				}
			},
			nice() {
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				if (tk) {
					axios.get(this.$baseUrl + '/library/nice_novel?id=' + this.world.novel_id, {
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': "Bearer " + tk //设置token 其中K名要和后端协调好
						}
					}).then((res) => {
						_this.getNices();
					}).catch(function (error) {
						if (error.message == "Request failed with status code 401") {
							window.localStorage.removeItem('token');
							uni.navigateTo({
								url: '../users/login?msg=' + 'unAuthorized'
							});
						}
					})
				} else {
					uni.navigateTo({
						url: '../users/login?msg=' + 'unAuthorized'
					});
				}
			},
			removeFromBookcase() {
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				uni.showModal({
					title: '提示',
					content: '确定取消收藏吗？',
					cancelText: "我再想想", // 取消按钮的文字  
					confirmText: "狠心取消", // 确认按钮的文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f59037',
					cancelColor: '#343434',
					success: (res) => {
						if (res.confirm) {
							axios.post(this.$baseUrl + '/bookcase/remove_like_novel', {
								novel_id: this.world.novel_id
							}, {
								headers: {
									'Content-Type': 'application/json', //设置请求头请求格式为JSON
									'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
								}
							},)
								.then(function (response) {
									uni.showToast({
										title: "已从书架移除",
										icon: 'none',
										duration: 2000
									});
									_this.isInBookcase = false;
								})
								.catch(function (error) {
									console.log(error);
									if (error) {
										uni.showToast({
											title: "移除失败",
											icon: 'none',
											duration: 2000
										});
									}
								});
						}
					}
				})
			},
			shareBook() {
				this.createShareCode();
			},
			traditionalShare() {
				let content = "我正在原木社区浏览世界《" + this.world.name + "》，你也一起来看看吧！\n" +
					"https://loghome.ink/novel/" + this.world.novel_id +
					"\n用浏览器打开链接，或复制这段文本打开原木社区APP即可查看哦！";
				return content;
			},
			createShareCode() {
				uni.showLoading({
					title: '创建口令中...'
				});

				const shareContent = `《${this.world.name}》- ${this.world.user_name}`;
				const targetUrl = `/pages/readers/bookInfo?id=${this.world.novel_id}`;

				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (!tk || !tk.tk) {
					uni.hideLoading();
					uni.showToast({
						title: '请先登录',
						icon: 'none',
						duration: 2000
					});
					return;
				}

				axios.post(this.$baseUrl + '/library/create_share_code', {
					share_type: 'book',
					share_content: shareContent,
					target_url: targetUrl,
					share_message: this.traditionalShare(),
					expires_hours: 24 * 30 // 30天有效期
				}, {
					headers: {
						'Authorization': 'Bearer ' + tk.tk
					}
				}).then((res) => {
					uni.hideLoading();

					if (res.data.success) {
						// 复制口令到剪贴板
						this.$bus.$emit("clipboardChange", res.data.share_text)
						uni.setClipboardData({
							data: res.data.share_text,
							success: () => {
								uni.showModal({
									title: '口令创建成功',
									content: `口令：${res.data.code}\n\n口令已复制到剪贴板，分享给好友即可！`,
									showCancel: false,
									confirmText: '知道了'
								});
							}
						});
					} else {
						uni.showToast({
							title: res.data.msg || '口令创建失败',
							icon: 'none',
							duration: 2000
						});
					}
				}).catch((error) => {
					uni.hideLoading();
					console.error('创建口令失败:', error);
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none',
						duration: 2000
					});
				});
			},
			tip() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.id;
				if (tk == this.world.creator_id) {
					uni.showToast({
						title: "不能给自己的书打赏哦",
						icon: 'none',
						duration: 2000
					});
				} else {
					console.log(this.$refs.popup)
					this.$refs.popup.open('bottom')
				}
			},
			runGiftAnimation(ev) {
				this.giftImage = ev.img_url;
				setTimeout(() => {
					let giftAnimation = [{
						top: "110vh",
						transform: "scale(0.1, 0.1)"
					},
					{
						top: "16vh",
						transform: "scale(0.6, 0.6)",
						offset: 0.16
					},
					{
						top: "37vh",
						transform: "scale(0.9, 0.9)",
						offset: 0.28
					},
					{
						top: "36vh",
						transform: "scale(0.8, 0.8)",
						offset: 0.32
					}, ,
					{
						top: "36vh",
						transform: "scale(0.8, 0.8)",
						offset: 0.48
					},
					{
						top: "36vh",
						transform: "scale(1.0, 1.0)",
						offset: 0.72
					},
					{
						top: "36vh",
						transform: "scale(1.0, 1.0)"
					}
					];
					let giftAnimTiming = {
						duration: 4000,
						iteration: 1,
						easing: "ease-out"
					};
					let giftBackgroundAnimation = [{
						transform: "scale(0.2, 0.2)"
					},
					{
						transform: "scale(0.2, 0.2)",
						filter: "drop-shadow(0px 0px 0px rgba(255, 199, 101, 0.6)) brightness(0.0)",
						offset: 0.56
					},
					{
						transform: "scale(1.4, 1.4)",
						filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(1.0)",
						offset: 0.72
					},
					{
						transform: "scale(1.2, 1.2) rotate(30deg)",
						filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(0.9)",
						offset: 0.79
					},
					{
						transform: "scale(1.4, 1.4) rotate(60deg)",
						filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(0.8)",
						offset: 0.86
					},
					{
						transform: "scale(1.2, 1.2) rotate(90deg)",
						filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(0.9)",
						offset: 0.93
					},
					{
						transform: "scale(1.4, 1.4) rotate(120deg)",
						filter: "drop-shadow(0px 0px 10px rgba(255, 199, 101, 0.6)) brightness(1.0)"
					}
					];
					let giftBgAnimTiming = {
						duration: 4000,
						iteration: 1,
						easing: "ease-out"
					};
					document.getElementById("gift_box").animate(giftAnimation, giftAnimTiming);
					document.getElementById("gift_background").animate(giftBackgroundAnimation, giftBgAnimTiming);
				})
			},
			checkBookcase() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				let _this = this;
				axios.get(this.$baseUrl + '/bookcase/get_likes_of', {
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					// console.log(res.data);
					res.data.forEach(item => {
						if (item.novel_id == _this.world.novel_id) {
							_this.isInBookcase = true;
						}
					})
				}).catch(function (error) {
					if (error.message == "Request failed with status code 401") {
						window.localStorage.removeItem('token');
						uni.navigateTo({
							url: '../users/login'
						});
					}
				})
			},
			getComments() {
				axios.get(this.$baseUrl + "/community/novel_commonts_all?id=" + this.world.novel_id)
					.then((res) => {
						let data = res.data;
						data = data.slice(0, 3);
						this.commentInfo = data;
					}).catch(err => {
						// uni.showToast({
						// 	title: err.toString(),
						// 	icon: 'none',
						// 	duration: 2000
						// });
					})
			},
		},
		onLoad(option) {
			this.options = option;
			let _this = this;
			//检测是否与个人相关
			let tk = JSON.parse(window.localStorage.getItem('token'));
			if (tk) tk = tk.tk;;
			if (tk == null) {
				return;
			}
			//验活
			axios.get(this.$baseUrl + '/users/userprofile', {
				headers: {
					'Content-Type': 'application/json', //设置请求头请求格式为JSON
					'Authorization': tk //设置token 其中K名要和后端协调好
				}
			}).then((res) => {
				_this.myUserInfo = JSON.parse(JSON.stringify(res.data));
				// console.log(_this.myUserInfo)
			}).catch(function(error) {
				if (error.message == "Request failed with status code 401") {
					window.localStorage.removeItem('token');
				}
			})
		},
		onShow() {
			this.getWorldInfo();
		}
	}
</script>

<style scoped lang="scss">
	.outer {
		.top {
			background-color: white;
			border-bottom: 1rpx solid #e1e1e1;
			padding: 10rpx 40rpx;
			background-image: linear-gradient(to top, #ffffff, #fff2d0);
			padding-top: calc(10rpx + var(--statusBarHeight));

			.title {
				margin-top: 140rpx;
				font-size: 50rpx;
				font-weight: bold;
				background-image: linear-gradient(to right, black, rgb(188, 102, 101));
				-webkit-background-clip: text;
				color: transparent;
				letter-spacing: -1px;
			}

			.info {
				display: flex;

				.author {
					position: relative;
					margin-top: 10rpx;
					margin-bottom: 10rpx;
					transform: scale(.95);
					transform-origin: left;
				}

				.author .auther_avatar {
					position: absolute;
					left: 0rpx;
					height: 50rpx;
					width: 50rpx;
					border-radius: 0rpx;
				}

				.author .auther_name {
					font-size: 30rpx;
					color: #666666;
					margin-left: 60rpx;
				}
			}

			.desc {
				font-size: 26rpx;
				color: #333333;
				margin: 0 0 10rpx 0;
			}

			.enterButton {
				width: 100%;
				border: 1rpx solid #4c4c4c55;
				border-radius: 30rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #4c4c4cee;
				margin: 15rpx 0;
				transition: all .3s;
				font-size: 26rpx;
			}

			.enterButton:active {
				transform: scale(0.95);
				background-color: #4c4c4c22;
			}
		}

		.content {
			background-color: white;
			margin-top: 15rpx;
			padding: 15rpx 40rpx;
			border-top: 1rpx solid #e1e1e1;

			.paneLabel {
				font-size: 30rpx;
			}

			.worldContent {
				.title {
					display: flex;

					.line {
						width: 10rpx;
						margin: 10rpx 0;
						height: 32rpx;
						background-color: #683938;
					}

					span {
						font-size: 32rpx;
						margin-left: 13rpx;
						color: #4f2b2a;
						font-weight: bold;
					}
				}
			}

			.books {
				height: 260rpx;
				width: calc(100vw - 80rpx);
				display: flex;
				background-color: rgb(255, 255, 255);
				border-radius: 10rpx;
				margin-left: -10rpx;
			
			
				img {
					height: 260rpx;
					width: 200rpx;
					border-radius: 10rpx 0 0 10rpx;
					margin: 0rpx;
					flex-shrink: 0;
				}
				.bookInfo {
					margin-left: 50rpx;
					margin-top: 20rpx;

					.title {
						font-size: 34rpx;
						height: 42rpx;
						margin-bottom: 10rpx;
						overflow: hidden;
						display: -webkit-box;
						font-weight: bold;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						color: rgb(45, 45, 45);
						margin: 5rpx;
					}

					.author {
						position: relative;
						margin-top: 15rpx;
						margin-bottom: 10rpx;
						display: flex;

						.auther_avatar {
							position: absolute;
							top: 0rpx;
							left: 5rpx;
							height: 35rpx;
							width: 35rpx;
							border-radius: 5rpx;
						}

						.auther_name {
							font-size: 25rpx;
							// font-weight: bold;
							color: rgb(45, 45, 45);
							overflow: hidden;
							margin-left: 45rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
						}
					}

					.description {
						font-size: 25rpx;
						color: rgb(142, 130, 109);
						margin: 5rpx 0;
						overflow: hidden;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
					}


				}
			}


		}
		/* New Styles */
		.buttons {
			display: flex;
			justify-content: space-around;
			margin-top: 30rpx;
			margin-bottom: 20rpx;
			padding: 0 20rpx;
		}

		.button {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
		}

		.button img {
			width: 60rpx;
			height: 60rpx;
			margin-bottom: 10rpx;
		}

		.button .text {
			font-size: 24rpx;
			color: #666666;
		}

		.l-h3 {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;
			margin-top: 15rpx;
		}

		.l-h3-title {
			font: bold 36rpx normal;
		}

		.l-h3-more {
			font-size: 30rpx;
			display: flex;
			align-items: center;
			color: #7E7F94;
		}

		.l-icon-more {
			width: 30rpx;
			vertical-align: middle;
			margin-left: 12rpx;
		}

		.l-comments {
			padding: 0 10rpx;
		}

		.l-comment-list {
			padding: 20rpx 0;
			border-bottom: 1rpx solid #eeeeee;
		}

		.l-comment-list-header {
			display: flex;
			align-items: center;
			margin-bottom: 15rpx;
		}

		.l-comment-list-header-avatar {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}

		.l-comment-list-header-name {
			font-size: 28rpx;
			color: #333333;
			font-weight: bold;
			flex: 1;
		}

		.l-comment-list-header-time {
			font-size: 24rpx;
			color: #999999;
		}

		.l-comment-list-body {
			font-size: 28rpx;
			color: #666666;
			line-height: 1.6;
		}

		/* Gift Box Styles */
		.gift_box {
			position: fixed;
			width: 100vw;
			height: 100vh;
			top: 0;
			left: 0;
			pointer-events: none;
			z-index: 1000;
		}

		.gift_background {
			position: absolute;
			width: 100vw;
			height: 100vh;
			z-index: 998;
			transform: scale(0.2, 0.2);
			opacity: 0;
			top: 0;
			left: 0;
		}

		.gift {
			position: absolute;
			z-index: 999;
			width: 400rpx;
			height: 400rpx;
			left: calc(50vw - 200rpx);
			top: 110vh;
		}

		.fans_rank {
			display: flex;
			justify-content: center;
			padding: 40rpx 20rpx 0 20rpx;
			// background-color: rgba(202, 202, 202, 0.1);
			border-radius: 16rpx;
			margin-top: 32rpx;
			position: relative;
			overflow: hidden;

			.dark-mode & {
				background-color: var(--card-background);
			}

			div {
				position: relative;
				width: 30%;
				margin: 0 10rpx;
				display: flex;
				justify-content: center;

				.rank-container {
					position: relative;
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 100%;
					min-height: 300rpx;
					padding: 20rpx 0;
				}

				.rank {
					position: absolute;
					height: 20vw;
					z-index: 1;
					transform: translateY(-10rpx);
				}

				.avatar {
					height: 15vw;
					width: 15vw;
					position: relative;
					z-index: 2;
					border-radius: 50%;
					border: 4rpx solid #ffffff;
					box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
					object-fit: cover;
				}

				.crown-glow {
					position: absolute;
					width: 16vw;
					height: 16vw;
					border-radius: 50%;
					z-index: 0;
					opacity: 0.6;
					filter: blur(10rpx);
					transform: translateY(3rpx);
				}

				.crown-glow.gold {
					background: radial-gradient(circle, #ffd700 10%, transparent 70%);
				}

				.crown-glow.silver {
					background: radial-gradient(circle, #c0c0c0 10%, transparent 70%);
				}

				.crown-glow.bronze {
					background: radial-gradient(circle, #cd7f32 10%, transparent 70%);
				}

				div.description {
					display: flex;
					flex-direction: column;
					align-items: center;
					position: relative;
					margin-top: 20rpx;
					padding: 15rpx 10rpx;
					width: 100%;
					background-color: rgba(255, 255, 255, 0.1);
					border-radius: 12rpx;
					z-index: 3;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

					.dark-mode & {
						background-color: var(--card-background);
						box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
					}

					p.name {
						font-size: 28rpx;
						font-weight: 600;
						margin-bottom: 10rpx;
						color: #333;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						max-width: 100%;

						.dark-mode & {
							color: var(--text-color-primary);
						}
					}

					p.value {
						font-size: 30rpx;
						color: #EA7034;
						display: flex;
						align-items: center;
						justify-content: center;

						.value-icon {
							margin-right: 6rpx;
							font-size: 32rpx;
						}
					}
				}
			}

			.first {
				transform: translateY(-20rpx);
				z-index: 3;

				.rank-container {
					transform: scale(1.1);
				}

				.avatar {
					box-shadow: 0 6rpx 16rpx rgba(255, 180, 0, 0.3);
					border: 4rpx solid #ffd700;
				}

				div.description {
					background-color: rgba(255, 245, 214, 0.7);
				}

				p.value {
					font-weight: bold;
				}
			}

			.second,
			.third {
				z-index: 2;

				div.description {
					background-color: rgba(255, 255, 255, 0.6);
				}
			}
		}

		.fans-list-container {
			display: flex;
			flex-direction: column;
			margin-top: -30rpx;
			padding: 10rpx 20rpx;
			background-color: rgba(202, 202, 202, 0.1);
			border-radius: 16rpx;
			overflow: hidden;

			.dark-mode & {
				background-color: var(--card-background);
			}

			.fans-list-item {
				display: flex;
				align-items: center;
				padding: 8rpx 0;
				border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
				position: relative;

				&:last-child {
					border-bottom: none;
				}

				.fans-rank {
					font-size: 22rpx;
					font-weight: bold;
					color: #EA7034;
					width: 34rpx;
					height: 34rpx;
					line-height: 34rpx;
					text-align: center;
					margin-right: 10rpx;
					background-color: rgba(234, 112, 52, 0.1);
					border-radius: 50%;
					flex-shrink: 0;
				}

				.fans-avatar {
					height: 30rpx;
					width: 30rpx;
					border-radius: 50%;
					border: 1rpx solid #ffffff;
					box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.1);
					margin-right: 10rpx;
					flex-shrink: 0;
				}

				.fans-info {
					display: flex;
					flex-direction: column;
					justify-content: center;
					flex-grow: 1;
					overflow: hidden;

					.fans-name {
						font-size: 24rpx;
						color: #333;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						max-width: 150rpx;

						.dark-mode & {
							color: var(--text-color-primary);
						}
					}

					.fans-message {
						font-size: 20rpx;
						color: #795548;
						max-width: 180rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						margin-top: 2rpx;

						.dark-mode & {
							color: var(--text-color-secondary);
						}
					}
				}

				.fans-value {
					font-size: 24rpx;
					color: #EA7034;
					display: flex;
					align-items: center;
					margin-left: auto;
					font-weight: bold;
					padding-left: 10rpx;

					.fans-value-icon {
						margin-right: 4rpx;
						font-size: 22rpx;
					}
				}
			}
		}

		view.tippingBar {
			background-color: white;
			width: 100vw;
			box-shadow: -10px 0px 10px rgba(113, 52, 24, .3);
		}
	}
</style>