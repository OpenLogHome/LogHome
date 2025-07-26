<template>
	<view class="content" v-dark :style="{'--statusBarHeight': 0 + 'px'}">
		<div class="gift_box" id="gift_box">
			<img class="gift_background" id="gift_background" src="../../static/bg.png"></img>
			<log-image class="gift" id="gift" :src="giftImage"></log-image>
		</div>
		<nothing :msg="'这本书还没有发布哦'" v-show="bookInfo.is_personal==undefined||bookInfo.is_personal==1"></nothing>
		<!-- 后台按钮组件 -->
		<zetank-backBar textcolor="#000" :showLeft="scrollTop < 200" :showHome="scrollTop < 200" :showTitle="false"
			navTitle='标题'></zetank-backBar>
		<view class="l-body" v-show="bookInfo.is_personal!=undefined||bookInfo.is_personal==0">
			<view class="l-dl">
				<div class="l-dt">
					<log-image class="l-dt":src="bookInfo.picUrl" mode="aspectFill"
						onerror="onerror=null;src='https://s2.loli.net/2021/12/06/iTkPD6cudGrsEKR.png'"
						@click="$previewImg([bookInfo.picUrl])">
					</log-image>
					<div class="book-id-tag">ID {{bookInfo.novel_id}}</div>
				</div>
				<view class="l-dd">
					<view class="l-dd-title">
						{{bookInfo.name}}
					</view>
					<view class="l-dd-sub">
						<view class="author" @click="gotoUserProfile(bookInfo.auther_id)">
							<log-image :src="bookInfo.auther_avatar" alt="" class="auther_avatar"
								onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
							<div class="auther_name">{{bookInfo.author_name}}<uni-icons type="forward" size="18"
									style="color:#dddddd"></uni-icons></div>
						</view>
					</view>
					<view class="tags" v-if="tags.length > 0">
						<div class="tag" v-for="(item,index) in tags" :key="item.tag_id"
							:class="{'activity':item.is_activity_tag}">
							{{item.tag_name}}
						</div>
					</view>
					<div class="notag" v-else>
						<div class="tag">
							作品未添加标签
						</div>
					</div>
					<view class="l-dd-footer">
						<span>共 {{articleLength}} 章 总计 {{bookInfo.text_count}} 字 </span>
						<br>
						<span>阅读：{{bookInfo.clicks}}</span>

						<span v-if="bookInfo.likes">收藏：{{bookInfo.likes.length}}</span>
						<span>{{bookInfo.is_complete==1?"已完结":"连载中"}}</span>
						<br>

						<span v-if="bookInfo.is_complete==0">最近更新 {{utc2beijing(bookInfo.update_time)}}</span>
					</view>
				</view>
			</view>

			<div class="novel_Rank" v-show="novelRank.onRank">
				<navigator url="./collections?title=原木力爆棚">
					实时原木力榜第
					<span style="font-size: 40rpx; line-height: 100%; padding:0 10rpx;">
						<countTo :startVal="999" :endVal="novelRank.rank" :duration="1500"></countTo>
					</span>
					位
				</navigator>
				<navigator url="./collections?title=原木力爆棚" style="font-size: 40rpx; transform: translateY(-5rpx);">
					<countTo :startVal="0" :endVal="novelRank.ranking" :duration="1500"></countTo>
				</navigator>
			</div>

			<div class="book-bg">
				<div class="image">
					<log-image class="img":src="bookInfo.picUrl" mode="scaleToFill" style="width: 100%; height: 100%; transform: scale(1.2);"
						onerror="onerror=null;src='https://s2.loli.net/2021/12/06/iTkPD6cudGrsEKR.png'">
					</log-image>
				</div>
			</div>

			<springBack :top="`calc(${novelRank.onRank ? '675rpx' : '550rpx'} + ${0 + 'px'})`">

				<div class="b-content" style="padding:32rpx;">
					<p class="l-dd-content" @click="showDescription(bookInfo.content)">
						{{bookInfo.content}}
					</p>

					<view class="l-body-select">
						<transition name="newBee">
							<img src="../../static/detail/newBee.png" alt="" class="newBee"
								v-show="showNiubeeAnimation"/>
						</transition>
						<view class="l-body-tab" @tap="nice" v-show="!niceStatus">
							<img class="l-icon-share l-icon-share-2" src="../../static/icons/icon_nice.png" mode="">
							</img>{{nice_amount}} 赞
						</view>
						<view class="l-body-tab" @tap="nice" v-show="niceStatus">
							<img class="l-icon-share l-icon-share-2" src="../../static/icons/icon_niced.png" mode="">
							</img>{{nice_amount}} 赞
						</view>
						<view class="l-body-tab" @tap="shareBook">
							<img class="l-icon-share l-icon-share-2" src="../../static/icons/icon_share.png" mode="">
							</img>分享
						</view>
						<view class="l-body-tab" @tap="addToBookcase" v-show="isInBookcase == false">
							<img class="l-icon-share l-icon-share-3" src="../../static/icons/icon_add.png" mode="">
							</img>加入书架
						</view>
						<view class="l-body-tab" @tap="removeFromBookcase" v-show="isInBookcase == true">
							<img class="l-icon-share l-icon-share-3" src="../../static/icons/icon_add.png" mode="">
							</img>从书架中移除
						</view>
						<view class="l-body-tab" @tap="navtoSection">
							<img class="l-icon-share l-icon-share-4" src="../../static/icons/icon_index.png" mode="">
							</img>目录
						</view>

					</view>

					<view class="l-list" @click="startReading" v-show="articleLength">
						<view class="l-h3">
							<text class="l-h3-title">正在阅读 - {{Math.min((historyShown/articleLength*100),100).toFixed(0)}}%</text>
						</view>
						<view class="processlist">
							<view class="l-list-content">
								<view class="l-list-sub-content">
									<view class="l-list-c-head">
										{{progressArticle.title}}
									</view>
									<view class="l-list-c-body" v-if="progressArticle.article_type=='spliter'">
										分卷
									</view>
									<view class="l-list-c-body" v-else-if="!progressArticle.content">
										努力加载中
									</view>
									<view class="l-list-c-body"
										v-else-if="progressArticle.content && progressArticle.article_type=='text'">
										{{progressArticle.content}}
									</view>
									<view class="l-list-c-body"
										v-else-if="progressArticle.content && progressArticle.article_type=='richtext'">
										{{richtext2text(progressArticle.content)}}
									</view>

									<view class="l-list-c-foot">
										<view class="l-list-c-foot-l">
											<text
												class="l-list-c-foot-l-name">第{{historyShown}}章，共{{articleLength}}章</text>
										</view>
									</view>
								</view>
								<view class="l-list-content bg" ref="processBar">
								</view>
							</view>
						</view>
					</view>


					<view class="l-list">
						<view class="l-h3">
							<text class="l-h3-title">世界设定</text>
						</view>
						<div class="worlds">
							<div class="nothing" v-show="worlds.length == 0"
								style="display:flex; flex-direction: column; align-items: center; justify-content: center; margin: 70rpx 0;">
								<img src="../../static/nothing.png" alt="" style="width: 15vw; margin: 25rpx 0;"/>
								<div style="color:#777777; font-size: 25rpx;">这是一片什么都没有的荒原</div>
							</div>
							<div v-for="novel in worlds" :key="novel.novel_id" style="position:relative;">
								<navigator :url="'./bookInfo?id=' +  novel.novel_id" open-type="navigate" class="books">
									<log-image :src="novel.picUrl + '?thumbnail=1'" alt=""
										:onerror="`onerror=null;src='`+ $backupResources.bookCover +`'`"
										style="border-radius: 10rpx; transform:scale(.90)"/>
									<div class="bookInfo" style="margin-left:10rpx;">
										<div class="world-title">
											{{novel.name}}
											<el-tag type="warning" v-show="novel.novel_type == 'world'" effect="dark"
												style="margin-left:10rpx; transform:translateY(-5rpx)"
												size="mini">世界设定</el-tag>
										</div>
										<view class="author">
											<log-image :src="novel.avatar_url" alt="" class="auther_avatar"
												onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
											<div class="auther_name">{{novel.user_name}}</div>
										</view>
										<div class="description">{{novel.content}}</div>
									</div>
								</navigator>
							</div>
						</div>

					</view>

					<view class="l-list">
						<view class="l-h3">
							<text class="l-h3-title">最新评论</text>
							<navigator :url="'./bookComment?id=' + uid">
								<view class="l-h3-more">全部评论(共 {{commentAmount}} 条)<img class="l-icon-more"
										src="../../static/l-icon-more.png" mode="widthFix"></img>
								</view>
							</navigator>
						</view>

						<view class="l-list-content noprocess" v-show="commentInfo.length == 0">
							<view class="l-list-sub-content" @tap="navtoComment"
								style="display:flex;justify-content: center;">
								<view class="l-list-d-body" style="font-size: 30rpx;">
									<!-- <img src="../../static/icons/enderman.png" alt=""
									style="width:100rpx; height:100rpx;margin-right: 20rpx;"> -->
									这本书还没有评论哦，快去抢沙发
								</view>
							</view>
						</view>

						<view class="l-list-content noprocess" v-for="item in commentInfo" :key="item.essay_comment_id">
							<view class="l-list-sub-content" @tap="navtoComment">
								<view class="l-list-c-body" style="font-size: 30rpx;">
									{{item.content}}
								</view>
								<view class="l-list-c-foot" style="font-size: 30rpx;">
									<view class="l-list-c-foot-l">
										<text class="l-list-c-foot-l-name">{{item.name}}</text>
									</view>
									<view class="l-list-c-foot-r">
										<img class="l-icon-like" src="../../static/detail/l-icon-like.png" mode="">
										</img>
										{{item.likeNum}}
									</view>
								</view>
							</view>
						</view>

					</view>
					<view class="l-list">
						<view class="l-h3">
							<text class="l-h3-title">粉丝榜</text>
							<navigator :url="'./novel_fans?id=' + uid">
								<view class="l-h3-more">查看粉丝榜<img class="l-icon-more"
										src="../../static/l-icon-more.png" mode="widthFix"></img>
								</view>
							</navigator>
						</view>

						<div class="fans_rank">
							<div class="second" v-if="fanInfo[1]">
								<div class="rank-container">
									<log-image :src="fanInfo[1].avatar_url" alt="" class="avatar"/>
									<img src="../../static/rank/NO2.png" alt="" class="rank"/>
									<div class="crown-glow silver"></div>
									<div class="description">
										<p class="name">{{fanInfo[1].user_name}}</p>
										<p class="value"><span class="value-icon">💫</span> {{fanInfo[1].fans_value}}</p>
									</div>
								</div>
							</div>
							<div class="first" v-if="fanInfo[0]">
								<div class="rank-container">
									<log-image :src="fanInfo[0].avatar_url" alt="" class="avatar"/>
									<img src="../../static/rank/NO1.png" alt="" class="rank"/>
									<div class="crown-glow gold"></div>
									<div class="description">
										<p class="name">{{fanInfo[0].user_name}}</p>
										<p class="value"><span class="value-icon">✨</span> {{fanInfo[0].fans_value}}</p>
									</div>
								</div>
							</div>
							<div class="third" v-if="fanInfo[2]">
								<div class="rank-container">
									<log-image :src="fanInfo[2].avatar_url" alt="" class="avatar"/>
									<img src="../../static/rank/NO3.png" alt="" class="rank"/>
									<div class="crown-glow bronze"></div>
									<div class="description">
										<p class="name">{{fanInfo[2].user_name}}</p>
										<p class="value"><span class="value-icon">⭐</span> {{fanInfo[2].fans_value}}</p>
									</div>
								</div>
							</div>
						</div>
					</view>

					<!-- 4-10名粉丝列表 -->
					<div class="fans-list-container" v-if="fanInfo.length > 3">
						<div class="fans-list-item" v-for="(fan, index) in fanInfo.slice(3, 10)" :key="index">
							<div class="fans-rank">{{index + 4}}</div>
							<log-image :src="fan.avatar_url" alt="" class="fans-avatar"/>
							<div class="fans-info">
								<div class="fans-name">{{fan.user_name}}</div>
								<div class="fans-message" v-if="fan.message">{{fan.message}}</div>
							</div>
							<div class="fans-value"><span class="fans-value-icon">🔸</span>{{fan.fans_value}}</div>
						</div>
					</div>
					<!-- <view class="l-list">
						<view class="l-h3">
							<text class="l-h3-title">作品图册</text>
							<navigator :url="'./bookComment?id=' + uid">
								<view class="l-h3-more">全部图片<log-image class="l-icon-more"
										src="../../static/l-icon-more.png" mode="widthFix"></log-image>
								</view>
							</navigator>
						</view>
						
						<view class="l-list-content noprocess" v-show="novel_pics.length == 0">
							<view class="l-list-sub-content" style="display:flex;justify-content: center;">
								<view class="l-list-d-body" style="font-size: 30rpx;">
									空空如也
								</view>
							</view>
						</view>
					
						<view class="pics" style="margin:15rpx 0;" v-show="novel_pics.length != 0">
							<el-carousel :interval="5000" type="card" arrow="always" style="z-index:0">
								<el-carousel-item v-for="item in novel_pics" :key="item">
								  <el-image
										style="border-radius: 15rpx;"
										:src="bookInfo.picUrl"
										fit="contain"></el-image>
								</el-carousel-item>
							</el-carousel>
						</view>
					
					</view> -->
					<div class="blank_box"></div>
				</div>


			</springBack>

		</view>

		<view class="l-body-fixed" v-show="bookInfo.is_personal==0">
			<view class="l-handle-btn l-look-btn" @tap="tip">
				打赏
			</view>
			<view class="l-handle-btn l-buy-btn" v-show="this.history == 1" @tap="startReading">
				立即阅读
			</view>
			<view class="l-handle-btn l-buy-btn" v-show="this.history != 1" @tap="startReading">
				继续阅读
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="tippingBar">
				<tippingBar :novel_id="uid" @tip="runGiftAnimation($event)"></tippingBar>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import nothing from '../../components/nothing.vue'
	import axios from 'axios'
	import tippingBar from "../../components/tipping/tippingBar.vue"
	import springBack from '../../components/springBack.vue'
	import html2canvas from 'html2canvas'
	import countTo from "vue-count-to"
	import darkModeMixin from '@/mixins/dark-mode.js'
	export default {
		components: {
			nothing,
			tippingBar,
			springBack,
			countTo
		},
		mixins: [darkModeMixin],
		data() {
			return {
				uid: 0,
				bookInfo: {},
				articles: [],
				isInBookcase: false,
				reading_progress: 0,
				options: {},
				history: 1,
				progressArticle: {},
				commentInfo: [],
				niceStatus: false,
				nice_amount: 0,
				showNiubeeAnimation: false,
				commentAmount: 0,
				novel_pics: [],
				tags: [],
				fanInfo: [],
				scrollTop: 0,
				novelRank: {
					onRank: false,
					rank: 0,
					ranking: 999
				},
				worldLoadTime: 0,
				worlds: [],
				giftImage: ""
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
				return beijing_datetime;
			},

			navtoComment() {
				uni.navigateTo({
					url: `/pages/readers/bookComment?id=` + this.uid
				})
			},
			navtoSection() {
				uni.navigateTo({
					url: "./allArticles?id=" + this.uid
				})
			},
			addToBookcase() {
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;
				axios.post(this.$baseUrl + '/bookcase/like_novel', {
						novel_id: this.uid
					}, {
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
						}
					}, )
					.then(function(response) {
						uni.showToast({
							title: "成功添加到书架",
							icon: 'none',
							duration: 2000
						});
						_this.isInBookcase = true;
					})
					.catch(function(error) {
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
				axios.get(this.$baseUrl + "/community/novel_commonts_amount?id=" + this.uid)
					.then((res) => {
						var commentAmountObject = res.data[0]
						this.commentAmount = commentAmountObject["COUNT(*)"];
					}).catch(err => {
						uni.showToast({
							title: error.toString(),
							icon: 'none',
							duration: 2000
						});
					})
			},
			getNices() {
				axios.get(this.$baseUrl + "/library/get_nices_by_id?id=" + this.uid)
					.then((res) => {
						this.nice_amount = res.data[0].nices;
					}).catch(err => {
						uni.showToast({
							title: error.toString(),
							icon: 'none',
							duration: 2000
						});
					})
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				if (tk) {
					axios.get(this.$baseUrl + '/library/get_nice_status?id=' + this.uid, {
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
					}).catch(function(error) {
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
					axios.get(this.$baseUrl + '/library/nice_novel?id=' + this.uid, {
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': "Bearer " + tk //设置token 其中K名要和后端协调好
						}
					}).then((res) => {
						if (!_this.niceStatus) {
							_this.showNiubeeAnimation = true;
						}
						_this.getNices();
					}).catch(function(error) {
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
									novel_id: this.uid
								}, {
									headers: {
										'Content-Type': 'application/json', //设置请求头请求格式为JSON
										'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
									}
								}, )
								.then(function(response) {
									uni.showToast({
										title: "已从书架移除",
										icon: 'none',
										duration: 2000
									});
									_this.isInBookcase = false;
								})
								.catch(function(error) {
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
			startReading() {
				const uid = this.uid;
				let _this = this;
				let articles = this.articles;
				console.log(articles);
				if (articles.length == 0) {
					uni.showToast({
						title: "本书还没有章节哦",
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if (_this.history == 1) {
					console.log(articles);
					uni.navigateTo({
						url: './newReader/article?id=' + articles[0].article_id + "&novelId=" + this.uid
					})
					return;
				} else {
					let toId = this.articles[0].article_id;
					articles.forEach(item => {
						if (item.article_chapter == _this.history) {
							toId = item.article_id
							return;
						}
					})
					uni.navigateTo({
						url: './newReader/article?id=' + toId + "&novelId=" + this.uid
					})
				}
			},
			showDescription(content) {
				uni.showModal({
					content: content,
					showCancel: false,
					confirmText: '关闭',
					confirmColor: "#EA7034"
				});
			},
			shareBook() {
				let content = "我正在原木社区读《" + this.bookInfo.name + "》，你也一起来看看吧！\n" +
					"https://loghome.codesocean.top/#/pages/readers/bookInfo?id=" + this.uid +
					"\n用浏览器打开链接，或在原木社区APP中搜索代码 " + this.uid + " 即可查看哦！";
				uni.setClipboardData({
					data: content,
					success: function() {
						// console.log('success');
					}
				})
			},
			gotoUserProfile(id) {
				uni.navigateTo({
					url: "../users/personalPage?id=" + id
				})
			},
			tip() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.id;
				if (tk == this.bookInfo.auther_id) {
					uni.showToast({
						title: "不能给自己的书打赏哦",
						icon: 'none',
						duration: 2000
					});
				} else {
					this.$refs.popup.open('bottom')
				}
			},
			get_novel_pics() {
				axios.get(this.$baseUrl + "/library/get_novel_pics?novel_id=" + this.uid)
					.then((res) => {
						this.novel_pics = res.data;
						// console.log(res.data);
					}).catch(err => {
						uni.showToast({
							title: error.toString(),
							icon: 'none',
							duration: 2000
						});
					})
			},
			getNovelTags() {
				let _this = this;
				axios.get(_this.$baseUrl + '/library/get_novel_tags?novel_id=' + this.uid, {}).then((res) => {
					_this.tags = res.data;
					// console.log(_this.tags);
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				}).then(function() {})
			},
			getFansStatistics() {
				axios.get(this.$baseUrl + "/library/get_all_novel_fans?novel_id=" + this.uid)
					.then((res) => {
						this.fanInfo = res.data;
					}).catch(err => {
						uni.showToast({
							title: error.toString(),
							icon: 'none',
							duration: 2000
						});
					})
			},
			richtext2text(richtext) {
				if (richtext) {
					let richArr = JSON.parse(richtext);
					let richStr = "";
					for (let item of richArr) {
						if (item.type == "text") richStr = richStr + item.value + "\n";
						if (item.type == "image") richStr = richStr + "[图片]\n";
					}
					return richStr;
				} else {
					return "努力加载中";
				}
			},
			checkNovelRank() {
				axios.get(this.$baseUrl + '/library/recommand/check_novel_rank?id=' + this.uid, {}).then((res) => {
					if (res.data.length > 0) {
						console.log(res.data[0]);
						this.novelRank.onRank = true;
						this.novelRank.rank = res.data[0].rank;
						this.novelRank.ranking = res.data[0].ranking;
					}
				}).catch(function(error) {
					uni.showToast({
						title: "获取小说排位信息失败",
						icon: 'none',
						duration: 2000
					});
				})
			},
			addReaderHistory(bookInfo) {
				let readerHistory = JSON.parse(window.localStorage.getItem("loghomeReaderHistory"));
				if (readerHistory != null) {
					readerHistory = readerHistory.filter(item => {
						if (item.novel_id == bookInfo.novel_id) {

						} else {
							return item;
						}
					})
					readerHistory.push(bookInfo);
					window.localStorage.setItem("loghomeReaderHistory", JSON.stringify(readerHistory));
				}
			},
			getWorlds() {
				// 获取关联世界
				axios.get(this.$baseUrl + '/world/get_asso_world_by_novel_id?novel_id=' + this.uid).then((
					res) => {
					this.worlds = res.data;
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
			async getBookInfo() {
				uni.showLoading({
					title: '努力加载中'
				});
				try{
					let res = await axios.get(this.$baseUrl + '/library/get_novel_by_id?id=' + this.uid, {})
					return res.data[0];
				} catch(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				} finally {
					uni.hideLoading();
				}
			}
		},
		onPageScroll(res) {
			this.scrollTop = res.scrollTop; //距离页面顶部距离
		},
		onLoad(option) {
			this.options = option;
			let _this = this;
			setTimeout(() => {
				let newBee = document.querySelector('.newBee');
				newBee.addEventListener("animationend", function() {
					_this.showNiubeeAnimation = false;
				});
			}, 100);
		},
		async onShow(option) {
			uni.showLoading({
				title: '努力加载中'
			});
			
			this.uid = this.options.id;

			let bookInfo = await this.getBookInfo();
			// 如果是设定书，则应当跳转到世界设定查看页面
			if (bookInfo.novel_type == "world") {
				if (this.worldLoadTime == 0) {
					setTimeout(() => {
						uni.redirectTo({
							url: "/pages/worlds/worldPage?novel_id=" + this.uid
						})
						this.worldLoadTime++;
					}, 350)
				} else {
					uni.navigateBack();
				}
				return;
			} else {
				this.bookInfo = bookInfo;
			}

			uni.setNavigationBarTitle({
				title: "书籍详情"
			});
			this.checkNovelRank();
			this.addReaderHistory(bookInfo);
		
			this.getNices();
			this.getCommentNum();
			this.get_novel_pics();
			this.getNovelTags();
			this.getFansStatistics();
			this.getWorlds();

			//本地阅读记录管理
			let readingHistory = window.localStorage.getItem("ReaderHistory_" + this.uid);
			if (readingHistory != null) {
				this.history = readingHistory;
			} else {

			}

			if (JSON.stringify(option) == "{}") {
				uni.showToast({
					title: "undefined",
					icon: 'none',
					duration: 2000
				});
				return;
			}

			axios.get(this.$baseUrl + '/library/get_articles?id=' + this.uid, {}).then((res) => {
				_this.articles = res.data;
				console.log("articles", _this.articles);
				// console.log(this.articles);
				if (_this.articles.length != 0) {
					_this.progressArticle = _this.articles[0];
					let nflag = true;
					_this.articles.forEach(item => {
						if (item.article_chapter == _this.history) {
							_this.progressArticle = item;
							return;
						}
					})

					//处理进度条动画
					setTimeout(() => {
						_this.$refs.processBar.$el.style.width = Math.min(_this.historyShown / _this
							.articleLength * 100, 100) + '%';
					}, 500)

					axios.get(this.$baseUrl + '/articles/get_article?id=' + _this.progressArticle.article_id, {})
						.then((res) => {
							_this.progressArticle = res.data[0];
							// console.log(_this.progressArticle)
						}).catch(function(error) {
							_this.progressArticle = {
								title: "哎呀，章节走丢了...",
								content: "哎呀，章节走丢了..."
							};
							uni.showToast({
								title: "哎呀，章节走丢了...",
								icon: 'none',
								duration: 2000
							});
						}).then(function() {
							uni.hideLoading();
						})
				}
			}).catch(function(error) {
				uni.showToast({
					title: "章节走丢了...",
					icon: 'none',
					duration: 2000
				});
			}).then(function() {
				uni.hideLoading();
			})
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
					if (item.novel_id == _this.uid) {
						_this.isInBookcase = true;
					}
				})
			}).catch(function(error) {
				if (error.message == "Request failed with status code 401") {
					window.localStorage.removeItem('token');
					uni.navigateTo({
						url: './users/login'
					});
				}
			})


			axios.get(this.$baseUrl + "/community/novel_commonts_all?id=" + this.uid)
				.then((res) => {
					let data = res.data;
					data = data.slice(0, 3);
					this.commentInfo = data;
				}).catch(err => {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				})


		},
		computed: {
			articleLength() {
				return this.articles.length;
			},
			//真正的阅读进度
			historyShown() {
				let his = 0;
				for (let item of this.articles) {
					his++;
					if (item.article_chapter == this.history) {
						return his;
					}
				}
				return this.history;
			}
		}
	}
</script>

<style scoped lang="scss">
	.article {
		padding-left: 10rpx;
		font-size: 30rpx;
	}

	.article div.title {
		color: #ffffff;
		line-height: 50rpx;
	}


	.content {
		padding-bottom: 500rpx;
	}

	.l-body-fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 90rpx;
		display: flex;
		width: 100vw;
		padding: 0 0;
		z-index: 4;
		align-items: center;
		white-space: nowrap;
		background-color: rgb(255, 248, 234);
		justify-content: space-between;
		
		.dark-mode & {
			background-color: var(--background-color-secondary);
		}
	}

	.l-look-btn {
		width: 40%;
		color: white;
		background-color: rgb(255, 0, 127);
	}

	.l-buy-btn {
		color: white;
		width: 60%;
		background-color: rgb(234, 112, 52);
	}

	.l-handle-btn {
		font-size: 35rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 90rpx;
	}

	.l-dl {
		margin-top: 180rpx;
		padding: var(--statusBarHeight) 32rpx;
		display: flex;
		width: calc(100vw - 64rpx);
		height: 320rpx;
		position: absolute;
		z-index: 2;
	}

	.l-dt {
		width: 230rpx;
		height: 100%;
		border-radius: 0rpx;
		margin-right: 30rpx;
		position: relative;
	}

	.book-id-tag {
		position: absolute;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		color: #ffffff;
		font-size: 20rpx;
		padding: 4rpx 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.l-dd {
		display: flex;
		padding-bottom: 12rpx;
		flex-direction: column;
		color: #eeeeee;
		max-height: 330rpx;
		overflow-y: scroll;

		* {
			margin: 5rpx 0;
		}
		
		.dark-mode & {
			color: var(--text-color-primary);
		}
	}

	.l-dd-title {
		font: bold 42rpx normal;
	}

	.l-dd-sub {
		color: #95A1A6;
		font: 28rpx/38rpx normal;
	}

	.author {
		position: relative;
		margin-top: 5rpx;
		margin-bottom: 5rpx;
		transform: scale(.95);
		transform-origin: left;
	}

	.author .auther_avatar {
		position: absolute;
		top: -8rpx;
		left: 0rpx;
		height: 50rpx;
		width: 50rpx;
		border-radius: 0rpx;
	}

	.author .auther_name {
		font-size: 32rpx;
		color: #eeeeee;
		margin-left: 60rpx;
		
		.dark-mode & {
			color: var(--text-color-primary);
		}
	}

	.l-dd-content {
		margin-top: 20rpx;
		width: 100%;
		color: #777777;
		font: 30rpx normal;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		white-space: pre-wrap;
		overflow: hidden;
		
		.dark-mode & {
			color: var(--text-color-regular);
		}
	}

	.tags,
	.notag {
		display: flex;
	}

	.tags {
		overflow-x: auto;
		align-items: center;
		height: 60rpx;
		margin: 10rpx 0;
		flex-shrink: 0;
	}

	.tags .tag {
		color: #A2A1B4;
		background-color: #eeeeee;
		height: 46rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		padding: 0 10upx;
		border-radius: 0upx;
		margin-right: 10upx;
		margin-top: 10rpx;
		flex-shrink: 0;
	}

	.tag.activity {
		color: #ec8600;
		background-color: #ffcfa5;
	}

	.notag .tag {
		color: #eeeeee;
		background-color: #eeeeee00;
		border: solid 2px #eeeeee;
		height: 46rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		padding: 0 10upx;
		border-radius: 0upx;
		margin-right: 10upx;
		margin-top: 10rpx;
	}


	.l-dd-footer {
		font-size: 28rpx;
		color: #dddddd;
	}


	.l-dd-footer span {
		margin-right: 20rpx;
	}

	.l-dd-view-footer {
		width: 100%;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		-webkit-line-clamp: 2;
	}

	.l-dd-img {
		width: 40rpx;
		height: 40rpx;
		border-radius: 0%;
		margin-right: 6rpx;
	}

	.l-icon-star {
		width: 30rpx;
		height: 28rpx;
		margin-right: 4rpx;
	}

	.l-dd-grade {
		color: #F9174D;
		margin-left: 28rpx;
		font-size: 40rpx;
	}

	.l-icon-share {
		margin-right: 18rpx;
		width: 60rpx;
		height: 60rpx;
	}

	.l-body-select {
		margin-top: 20rpx;
		position: relative;
	}

	.l-body-tab,
	.l-body-select {
		display: flex;
		width: 100%;
		flex-flow: wrap;
	}

	.l-body-tab {
		padding: 20rpx 0;
		font-size: 35rpx;
		flex: 1 0 50%;
		transition: all .1s;
		align-items: center;
	}

	.l-body-tab:active {
		background-color: #d8d8dc;
		transform: scale(0.9);
	}

	.l-list {
		padding-top: 40rpx;
	}

	.l-h3 {
		display: flex;
		align-items: center;
		justify-content: space-between;
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

	/* list */

	.l-list-view {
		padding-top: 40rpx;
		color: #7E7F94;
	}

	.l-icon-like,
	.l-icon-star-blank {
		width: 22rpx;
		height: 20rpx;
		margin-right: 4rpx;
	}

	.l-icon-like {
		margin-right: 12rpx;
	}

	.processlist {
		position: relative;
	}

	.l-list-content {
		position: relative;
		box-sizing: border-box;
		border: 2px rgba(202, 202, 202, 0) solid;
		background-color: rgba(202, 202, 202, 0.1);
		border-radius: 0rpx;
		padding: 35rpx 32rpx;
		margin-top: 32rpx;
		
		.dark-mode & {
			background-color: var(--card-background);
			border: 2px rgba(60, 60, 60, 0) solid;
		}
	}

	.l-list-content.bg {
		padding: 0;
		width: 0;
		background-color: rgba(202, 202, 202, 0.2);
		border: 2px rgba(255, 255, 255, 0.0) solid;
		position: absolute;
		top: -32.5rpx;
		left: 0;
		height: 100%;
		transition: width 1s;
	}


	.l-list-content.noprocess {
		background-color: rgba(202, 202, 202, 0.2);
		
		.dark-mode & {
			background-color: var(--card-background);
		}
	}

	.l-list-c-foot-l-name {
		margin-right: 20rpx;
	}

	.l-list-c-head {
		font-size: 32rpx;
		padding-bottom: 25rpx;
		
		.dark-mode & {
			color: var(--text-color-primary);
		}
	}

	.l-list-c-body {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		color: #95A1A6;
		font-size: 24rpx;
		margin-bottom: 35rpx;
		
		.dark-mode & {
			color: var(--text-color-regular);
		}
	}

	.l-list-d-body {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		color: #95A1A6;
		font-size: 24rpx;
	}

	.l-list-c-foot {
		color: #95A1A6;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.l-list {
		.worlds {
			.books {
				height: 260rpx;
				width: calc(100vw - 70rpx);
				margin: 10rpx 0;
				display: flex;
				background-color: rgb(255, 255, 255);
				border-radius: 10rpx;
				
				.dark-mode & {
					background-color: var(--card-background);
				}


				img {
					height: 260rpx;
					width: 200rpx;
					border-radius: 10rpx 0 0 10rpx;
					margin: 0rpx;
					flex-shrink: 0;
				}

				.bookInfo {
					margin-left: 30rpx;
					margin-top: 22rpx;

					.world-title {
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
						
						.dark-mode & {
							color: var(--text-color-primary);
						}
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
							
							.dark-mode & {
								color: var(--text-color-regular);
							}
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
						
						.dark-mode & {
							color: var(--text-color-regular);
						}
					}


				}

			}
		}
	}

	page,
	uni-page {
		background-color: rgb(255, 248, 234);
		color: rgb(113, 52, 24);
		font-size: 28rpx;
		padding-top: 0;
		margin-top: 0;
		
		.dark-mode & {
			background-color: var(--background-color-secondary);
			color: var(--text-color-primary);
		}
	}

	/* init button */

	uni-button,
	button {
		margin: 0;
		padding: 0;
		color: rgb(113, 52, 24);
		background-color: #000000;
	}

	uni-button:after,
	button:after {
		border: none;
		width: 100%;
		height: 100%;
	}

	.button-hover {
		color: inherit;
		background-color: inherit;
	}

	/* init img */
	uni-image>img,
	img {
		vertical-align: middle;
	}

	.content {
		position: relative;
		
		&.dark-mode {
			background-color: var(--background-color-secondary);
		}
	}


	.l-body {
		padding: 0 0;

		.book-bg {
			position: absolute;
			width: 100vw;
			height: 100vh;
			overflow: hidden;
			background-size: 100%;

			.image {
				filter: blur(30px) brightness(0.6);
				background-color: #00000000;
				transform: translateZ(0);
				width: 100vw;
				height: calc(500rpx + var(--statusBarHeight) + 135rpx + 120px);
				position: absolute;
				
				.dark-mode & {
					filter: blur(30px) brightness(0.4);
				}
			}
		}

		.novel_Rank {
			position: absolute;
			z-index: 5;
			background-color: #00000077;
			padding: 0 30rpx;
			width: calc(100vw - 120rpx);
			margin: 35rpx 30rpx;
			border-radius: 0rpx;
			height: 100rpx;
			top: calc(500rpx + var(--statusBarHeight));
			display: flex;
			color: #dfdfdf;
			font-size: 30rpx;
			line-height: 100rpx;
			justify-content: space-between;
		}
	}

	@keyframes niubi {
		0% {
			transform: scale(0);
			opacity: 1;
		}

		50% {
			transform: scale(1);
		}

		90% {
			transform: scale(1);
			opacity: 1;
		}

		99% {
			transform: scale(1);
			opacity: 0;
		}

		100% {
			transform: scale(0);
			opacity: 0;
		}
	}

	.newBee {
		position: absolute;
		z-index: 100;
		width: 90rpx;
		left: -10rpx;
		top: -40rpx;
		transform: scale(0);
	}

	.newBee-enter-active {
		animation: niubi 2s;
	}


	.l-icon-more {
		width: 30rpx;
		/* height: 27rpx; */
		vertical-align: middle;
		margin-left: 12rpx;
	}


	view.tippingBar {
		background-color: white;
		width: 100vw;
		box-shadow: -10px 0px 10px rgba(113, 52, 24, .3);
		
		.dark-mode & {
			background-color: var(--card-background);
			box-shadow: -10px 0px 10px rgba(0, 0, 0, .3);
		}
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

			img.rank {
				position: absolute;
				height: 20vw;
				z-index: 1;
				transform: translateY(-10rpx);
			}

			img.avatar {
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

			img.avatar {
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

		.second, .third {
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

	.blank_box {
		height: calc(125rpx + 400rpx);
	}

	.gift_box {
		width: 200px;
		height: 200px;
		position: fixed;
		left: calc(50vw - 100px);
		top: 110vh;
		z-index: 10086;
	}

	.gift_background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.gift {
		position: absolute;
		top: 20%;
		left: 20%;
		width: 60%;
		height: 60%;
	}
</style>