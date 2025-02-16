<template>
	<div class="outer" :style="{'--statusBarHeight': jsBridge.inApp ? jsBridge.statusBarHeight + 'px' : 0 + 'px'}">
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
					style="font-size: 28rpx; height:50rpx; line-height: height:50rpx; margin:10rpx;color: #666666;">
					最近更新：{{utc2beijing(world.update_time)}}
				</div>
			</div>
			<div class="desc">
				{{world.content}}
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
						<el-collapse style="margin-top: 20rpx;" :accordion="true" @change="outlineAccordianChange"
							v-show="worldOutlines.length != 0">
							<el-collapse-item v-for="outline in worldOutlines" name="1" :key="outline.article_id"
								:title="outline.title" :name="outline.article_id">
								{{outline.content}}
								<el-button type="primary" round size="mini" style="margin-left: 15rpx;"
									@click="gotoArticle(outline.article_id)">全屏阅读</el-button>
							</el-collapse-item>
						</el-collapse>
						<div class="nothing" v-show="worldOutlines.length == 0"
							style="display:flex; flex-direction: column; align-items: center; justify-content: center; margin: 100rpx 0;">
							<img src="../../static/nothing.png" alt="" style="width: 15vw; margin: 25rpx 0;" />
							<div style="color:#777777; font-size: 25rpx;">这是一片什么都没有的荒原</div>
						</div>
						<div class="title" style="margin-top: 30rpx;">
							<div class="line"></div>
							<span>世界词条</span>
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
		
<!-- 		<div class="content">
			评论区
		</div> -->
	</div>
</template>

<script>
	import axios from "axios";
	export default {
		data() {
			return {
				options: {},
				world: {},
				worldOutlines: [],
				worldVoabs: [],
				myUserInfo: {},
				assoNovels: []
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
			getWorldInfo() {
				if (this.options.id) {
					axios.get(this.$baseUrl + '/world/get_world_by_id?world_id=' + this.options.id).then((res) => {
						this.world = res.data[0];
						this.getArticles(this.world.novel_id, this.world.world_id)
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
							item.content = "加载中"
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
				axios.get(this.$baseUrl + '/articles/get_article?id=' + activeName).then((res) => {
					for (let item of this.worldOutlines) {
						if (item.article_id == activeName) {
							let articleContent = JSON.parse(res.data[0].content);
							let textContent = "";
							for(let paragraph of articleContent) {
								if(paragraph.type == 'text') {
									textContent += paragraph.value + "\n";
								}
							}
							item.content = textContent;
						}
					}
					this.$forceUpdate();
				}).catch(function(error) {
					uni.showToast({
						title: error.toString(),
						icon: 'none',
						duration: 2000
					});
				})
			},
			gotoArticle(uid) {
				uni.navigateTo({
					url: "../readers/article?id=" + uid
				})
			}
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
	}
</style>