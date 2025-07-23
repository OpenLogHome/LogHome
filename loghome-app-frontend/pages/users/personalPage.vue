<template>
	<view style="background-color: #FFFFFF">
		<!-- 后台按钮组件 -->
		<zetank-backBar textcolor="#000" :showLeft="topNum == 0" :showTitle="false" navTitle='标题'></zetank-backBar>
		<!-- 用户背景封面 -->
		<log-image class="info-cover" @tap="change_top_pic" :src="user.top_pic_url"
		onerror="onerror=null;src='https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg'"></log-image>
		
		<springBack :top="`calc(300rpx + ${0 + 'px'})`">
			<!-- 右侧悬浮按钮 -->
			<view class="rightBtnGroup">
				<followBtn :targetId="Number(uid)" v-show="uid != myUserInfo.user_id"/>
				<navigator url="./change_user_info" v-show="uid == myUserInfo.user_id">
					<div class="button">编辑资料</div>
				</navigator>
				<div class="button" v-show="uid != myUserInfo.user_id" @click="gotoPrivateMessage">私信</div>
			</view>
			
			<!-- 用户头像关注 -->
			<view class="u-flex-wrap"
				style="padding-top: 18rpx;padding-bottom: 18rpx;position: relative;align-items: center;display: flex;flex-direction: row;justify-content: flex-end;">
				<view class="info-avatar" @click="$previewImg([user.avatar_url])">
					<log-image :src="user.avatar_url" onerror="onerror=null;src='../static/user/defaultAvatar.jpg'"/>
				</view>
				<view style="margin-right: 50rpx;">
					<view v-if='!showedit' style="height: 45rpx;"></view>
				</view>
			</view>
			<!-- 用户名 -->
			<view style="display: flex;align-items: center;margin-left: 50rpx;margin-top: 28rpx;">
				<text style="font-size: 40rpx;color: #111111;font-weight: bold;margin-right: 10rpx;">{{user.name}}</text>
				
			</view>
			
			<view class="moreInfo" style="margin-left: 50rpx;margin-top: 18rpx;">
				<span class="user_id">ID:{{uid}}</span>
				<!-- <span class="user_group" :class="group2class[user.user_group]">{{user.user_group}}</span> -->
				<groupLabel v-for="user_group in user.user_group" :userGroup="user_group"></groupLabel>
				<span class="admin_title" v-show="user.is_admin">
					<img src="../../static/icons/admin.gif" alt="" style="width:45rpx;margin-left: 10rpx;"/>社区管理员</span>
			</view>
	
			<!-- 简介-->
			<view style="font-size: 28rpx;color: #555555;margin:20rpx 50rpx;">
				<text style="margin-right: 20rpx;">{{user.motto==''?'暂无简介':user.motto}}</text>
			</view>
			<view style="display: flex;align-items: center;margin-left: 50rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
				<navigator :url="'../community/friends?id=' + uid + '&tab=1'">
					<text
						style="font-size: 40rpx;font-weight: bold;color: #555555;margin-right: 18rpx;">{{fans}}</text><text
						style="font-size: 28rpx;color: gray;margin-right: 28rpx;">粉丝</text>
				</navigator>
				<navigator :url="'../community/friends?id=' + uid + '&tab=0'">
					<text
						style="font-size: 40rpx;font-weight: bold;color: #555555;margin-right: 18rpx;">{{follows}}</text><text
						style="font-size: 28rpx;color: gray;margin-right: 28rpx;">关注</text>
				</navigator>
			
	<!-- 			<text
					style="font-size: 40rpx;font-weight: bold;color: #555555;margin-right: 18rpx;">{{likes}}</text><text
					style="font-size: 28rpx;color: gray;margin-right: 28rpx;">点赞</text> -->
			
			</view>
	
			<view id="tabbar" :class="isFixed?'tabbar-fixed':''" 
				style="align-items: stretch;height: 90rpx;line-height: 90rpx; display: flex;
				flex-direction: row;justify-content: space-around; margin:0 80rpx;">
				<view style="font-size: 32rpx;font-weight: bold;text-align: center;width: 128rpx;"
					:class="current == 0?'tabbarsh':'notabbarsh'" @tap="fnBarClick(0)">作品</view>
				<view style="font-size: 32rpx;font-weight: bold;text-align: center;width: 128rpx;"
					:class="current == 1?'tabbarsh':'notabbarsh'" @tap="fnBarClick(1)">动态</view>
				<view style="font-size: 32rpx;font-weight: bold;text-align: center;width: 128rpx;"
					:class="current == 2?'tabbarsh':'notabbarsh'" @tap="fnBarClick(2)">世界</view>
			</view>
	
			<!-- 导航显示内容 -->
			<swiper class="content-swiper" 
				:current="current"
				@change="swiperChange"
				:indicator-dots="false"
				:autoplay="false"
				:duration="300"
				:circular="false"
				:style="swiperStyle">
				<swiper-item>
					<div class="bookcase tabpage">
						<bookInCase v-for="item in booksOnShow" :bookName="item.name" :picUrl="item.picUrl" :key="item.novel_id"
									@click.native="readBook(item.novel_id)" v-show="!item.is_personal"></bookInCase>
					</div>
				</swiper-item>
				<swiper-item>
					<div class="post-list tabpage" @scrolltolower="loadMorePosts">
						<view class="post-item" v-for="(post, index) in userPosts" :key="index" @tap="navigateToPost(post.post_id)">
							<view class="post-header">
								<view class="post-circle" @tap.stop="navigateToCircle(post.circle_id)">
									{{post.circle_name}}
								</view>
								<view class="post-time">{{formatTime(post.create_time)}}</view>
							</view>
							<view class="post-content">
								<text class="post-title">{{post.title}}</text>
								<text class="post-text">{{post.content}}</text>
							</view>
							<!-- 图片展示 -->
							<view class="post-images" v-if="post.media_urls && post.media_urls.length > 0">
								<view class="image-grid" :class="'grid-' + (post.media_urls.length > 3 ? 'multi' : post.media_urls.length)">
									<image 
										v-for="(img, imgIndex) in post.media_urls.slice(0, 9)" 
										:key="imgIndex" 
										:src="img" 
										mode="aspectFill" 
										class="post-image"
										@tap.stop="previewImage(post.media_urls, imgIndex)"
									></image>
									<view class="image-count" v-if="post.media_urls.length > 9">+{{post.media_urls.length - 9}}</view>
								</view>
							</view>
							<view class="post-footer">
								<view class="post-action">
									<uni-icons type="chat" size="18" color="#666"></uni-icons>
									<text>{{post.comment_count || 0}}</text>
								</view>
								<view class="post-action">
									<uni-icons type="heart" size="18" color="#666"></uni-icons>
									<text>{{post.like_count || 0}}</text>
								</view>
							</view>
						</view>
						<view class="no-data" v-if="userPosts.length === 0">
							<text>暂无动态</text>
						</view>
						<uni-load-more :status="postsLoadingStatus"></uni-load-more>
					</div>
				</swiper-item>
				<swiper-item>
					<div class="bookcase tabpage">
						<bookInCase v-for="item in worldsOnShow" :bookName="item.name" :picUrl="item.picUrl" :key="item.world_id"
									@click.native="readBook(item.novel_id)"></bookInCase>
					</div>
				</swiper-item>
			</swiper>
		</springBack>
	</view>
</template>

<script>
	import bookInCase from '../../components/book_in_case.vue'
	import followBtn from '../../components/follow.vue'
	import groupLabel from "../usergroup/groupLabel.vue"
	import springBack from '../../components/springBack.vue'
	import axios from 'axios'
	import moment from 'moment'
	export default {
		components:{
			bookInCase,followBtn,springBack,groupLabel
		},
		data() {
			return {
				uid: -1,
				membertype: '',
				showedit: true, //信息编辑按钮
				// 是否固定导航
				isFixed: false,
				// 距离顶部达到导航距离
				topNum: 0,
				// 选中 
				current: 0,
				// 导航距离顶部
				tabbarTop: 0,
				clickRefresh: false,
				// 刷新间隔
				timeOutUserInfo: 0,
				// 激活顶部导航关联页状态
				status: {
					publish: true,
					praise: false,
				},
				toTop: {
					offset: 300,
					duration: 300,
					zIndex: 9990,
				 right: 30,
					bottom: 150,
					safearea: false,
					width: 72,
					radius: "50%",
					left: null
				},
				topImgSrc: "https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg",
				user: {},
				booksOnShow:[],
				myUserInfo:{},
				likes:0,
				follows:0,
				fans:0,
				group2class:{
					"社区奠基人":"founder",
					"原木体验官":"copemate",
					"用户":'nonTitle',
					"社区管理员":'nonTitle',
					"系统消息":'nonTitle'
				},
				worldsOnShow: [],
				// 用户帖子列表
				userPosts: [],
				// 帖子加载状态
				postsLoadingStatus: 'more',
				// 帖子分页
				postsPage: 1,
				postsPageSize: 10,
				postsHasMore: true,
				// swiper高度样式对象
				swiperStyle: {
					height: 'auto'
				},
			}
		},
		onLoad(option) {
			this.uid = option.uid
			// 等待0.3秒页面渲染,$nextTick使用不能准确
			let uid = uni.getStorageSync('uid')
			if (uid === option.uid) {
				this.showedit = true
			}

			// 页面加载完成后初始化swiper高度
			setTimeout(() => {
				this.updateSwiperHeight();
			}, 500);
		},
		methods: {
				/// 顶部导航选项点击
				fnBarClick(current) {
					// console.log(current);
					// 是否当前项点击
					if (this.current == current) {
						this.timeOutUserInfo += 1;
						// 是否为刷新值和连续点击2次
						// console.log('timeOutUserInfo',this.timeOutUserInfo);
						if (!this.clickRefresh && this.timeOutUserInfo >= 2) {
							// 刷新值开
							// console.log('点击了两下');
							this.clickRefresh = true;
							// 获取新数据
							if (current === 1) {
								// 重置帖子分页并重新加载
								this.postsPage = 1;
								this.postsHasMore = true;
								this.loadUserPosts();
							}

							// 定时器重置
							this.timeOutUserInfo = setTimeout(() => {
								// 清除定时器
								// console.log('5秒后清除定时器');
								clearTimeout(this.timeOutUserInfo)
								// 连续触发记录重置
								this.timeOutUserInfo = 0;
								// 5秒后刷新值关
								this.clickRefresh = false;
							}, 5000);
						}
					} else {
						// 改变顶部导航选中
						this.current = current;
						// 获取新数据
						if (current === 1 && this.userPosts.length === 0) {
							// 加载用户帖子
							this.loadUserPosts();
						}

						// 清除定时器
						clearTimeout(this.timeOutUserInfo)
						// 连续触发记录重置
						this.timeOutUserInfo = 0;
						// 刷新值关
						this.clickRefresh = false;
						
						// 更新swiper高度
						setTimeout(() => {
							this.updateSwiperHeight();
						}, 500);
					}
				},
				
				// swiper滑动切换事件
				swiperChange(e) {
					const current = e.detail.current;
					// 更新当前选中的选项卡
					this.current = current;
					
					// 清除定时器
					clearTimeout(this.timeOutUserInfo);
					// 连续触发记录重置
					this.timeOutUserInfo = 0;
					// 刷新值关
					this.clickRefresh = false;
					
					// 如果切换到动态标签页，加载用户帖子
					if (current === 1 && this.userPosts.length === 0) {
						this.loadUserPosts();
					}
					
					// 更新swiper高度
					this.$nextTick(() => {
						this.updateSwiperHeight();
					});
				},
				
				// 更新swiper高度
				updateSwiperHeight() {
					// 获取当前激活的swiper-item索引
					const currentIndex = this.current;
					// 直接通过 document 查询 bookcase 元素
					const tabpages = document.querySelectorAll('.tabpage');
					if (!tabpages || tabpages.length === 0 || !tabpages[currentIndex]) return;
					const contentHeight = tabpages[currentIndex].scrollHeight;
					if (!contentHeight) return;
					const actualHeight = Math.max(contentHeight, 200);
					console.log(actualHeight);
					this.swiperStyle = {
						height: actualHeight + 'px'
					};
				},
			readBook(novel_id) {
				if(novel_id > 0) {
					uni.navigateTo({
						url:'../readers/bookInfo?id=' +  novel_id
					})
				}
			},
			change_top_pic(){
				if(this.uid == this.myUserInfo.user_id){
					uni.navigateTo({
						url:"./top_pic_upload?noneAnimation=1"
					})
				} else {
					this.$previewImg([this.user.top_pic_url])
				}
			},
			gotoPrivateMessage(){
				uni.navigateTo({
					url: '/pages/community/chat?id=' + this.uid
				});
			},
			onLoad(params) {
				this.uid = params.id;
				
				// 页面加载完成后初始化swiper高度
				setTimeout(() => {
					this.updateSwiperHeight();
				}, 500);
			},
			onShow(params) {
				let _this = this;
				axios.get(this.$baseUrl + '/users/user_profile_of?id=' + this.uid, {}).then((res) => {
					_this.user = JSON.parse(JSON.stringify(res.data))[0];
					_this.user.user_group = _this.user.user_group.split(',');
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
				
				axios.get(this.$baseUrl + '/library/get_novel_by_user_id?id=' + this.uid, {
				}).then((res) => {
					_this.booksOnShow=res.data;
					console.log(_this.booksOnShow)
					// 数据加载完成后，更新swiper高度
					_this.$nextTick(() => {
						_this.updateSwiperHeight();
					});
				}).catch(function(error) {
					uni.showToast({
						title: "作品信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
				
				
				//检测是否与个人相关
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
				if(tk == null){
					return;
				}
				//验活
				axios.get( this.$baseUrl + '/users/userprofile', {
					headers: { 
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					_this.myUserInfo = JSON.parse(JSON.stringify(res.data));
					console.log(_this.myUserInfo)
				}).catch(function(error) {
					if(error.message == "Request failed with status code 401"){
						window.localStorage.removeItem('token');
					}
				})
				
				
				axios.get(_this.$baseUrl + '/community/get_fans_of?id=' + _this.uid, {}).then((res) => {
					_this.fans = JSON.parse(JSON.stringify(res.data)).length;
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
				
				axios.get(_this.$baseUrl + '/community/get_follows_of?id=' + _this.uid, {}).then((res) => {
					_this.follows = JSON.parse(JSON.stringify(res.data)).length;
				}).catch(function(error) {
					uni.showToast({
						title: "用户信息加载失败",
						icon: 'none',
						duration: 2000
					})
				})
				
				axios.get(this.$baseUrl + '/world/get_worlds_by_author?user_id=' + _this.uid, {
				}).then((res) => {
					_this.worldsOnShow = res.data;
					// 数据加载完成后，更新swiper高度
					_this.$nextTick(() => {
						_this.updateSwiperHeight();
					});
				}).catch(function(error) {
					uni.showToast({
						title: "世界信息加载失败",
						icon: 'none',
						duration: 2000
					})
				});
				
				// 如果当前是动态标签页，加载用户帖子
				if (this.current === 1) {
					this.loadUserPosts();
				}
			},
			
			// 加载用户帖子
			async loadUserPosts() {
				if (!this.postsHasMore || this.postsLoadingStatus === 'loading') return;
				
				this.postsLoadingStatus = 'loading';
				try {
					const res = await axios.get(this.$baseUrl + '/community/posts/list', {
						params: {
							page: this.postsPage,
							pageSize: this.postsPageSize,
							user_id: this.uid
						}
					});
					
					if (res.data && res.data.list) {
						const newPosts = res.data.list.map(post => {
							if (post.media_urls && typeof post.media_urls === 'string') {
								try {
									post.media_urls = JSON.parse(post.media_urls);
								} catch (e) {
									post.media_urls = [];
								}
							}
							return post;
						});
						
						// 更新帖子列表
						if (this.postsPage === 1) {
							this.userPosts = newPosts;
						} else {
							this.userPosts = [...this.userPosts, ...newPosts];
						}
						
						this.postsPage++;
						this.postsHasMore = this.userPosts.length < res.data.total;
						this.postsLoadingStatus = this.postsHasMore ? 'more' : 'noMore';
						
						// 更新swiper高度
						this.$nextTick(() => {
							this.updateSwiperHeight();
						});
					}
				} catch (error) {
					console.error('加载用户帖子失败', error);
					this.postsLoadingStatus = 'more';
					uni.showToast({
						title: "加载用户动态失败",
						icon: 'none',
						duration: 2000
					});
				}
			},
			
			// 加载更多帖子
			loadMorePosts() {
				if (this.postsHasMore) {
					this.loadUserPosts();
				}
			},
			
			// 格式化时间
			formatTime(time) {
				const now = moment();
				const postTime = moment(time);
				const diff = now.diff(postTime, 'minutes');
				
				if (diff < 1) return '刚刚';
				if (diff < 60) return `${diff}分钟前`;
				
				const hourDiff = now.diff(postTime, 'hours');
				if (hourDiff < 24) return `${hourDiff}小时前`;
				
				const dayDiff = now.diff(postTime, 'days');
				if (dayDiff < 30) return `${dayDiff}天前`;
				
				return postTime.format('YYYY-MM-DD');
			},
			
			// 导航到帖子详情
			navigateToPost(postId) {
				uni.navigateTo({ url: `/pages/community/postDetail?id=${postId}` });
			},
			
			// 导航到圈子详情
			navigateToCircle(circleId) {
				if (!circleId || circleId === 0) {
					uni.showToast({
						title: '圈子不存在',
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({ url: `/pages/community/circle?id=${circleId}` });
			},
			
			// 预览图片
			previewImage(images, index) {
				uni.previewImage({
					urls: images,
					current: images[index]
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info-cover {
		position:absolute;
		display: block;
		width: 100vw;
		height:100vw;
		background-color: #FFFFFF;
	}

	.info-avatar {
		position: absolute;
		left: 0;
		top: -120rpx;
		margin-left: 50rpx;
		width: 160upx;
		height: 160upx;
	}

	.info-avatar img {
		border-radius: 8rpx;
		width: 100%;
		height: 100%;
	}

	.tabbarsh {
		color: rgb(180, 111, 88);
		border-bottom: 4rpx rgb(180, 111, 88) solid;
	}
	
	// 帖子列表样式
	.post-list {
		padding: 20rpx;
		
		.post-item {
			background: #fff;
			border-radius: 12rpx;
			padding: 30rpx;
			margin-bottom: 20rpx;
			border: 1px solid #f0f0f0;

			.post-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;

				.post-circle {
					font-size: 24rpx;
					color: #EA7034;
					background: rgba(234, 112, 52, 0.1);
					padding: 4rpx 16rpx;
					border-radius: 20rpx;
				}
				
				.post-time {
					font-size: 24rpx;
					color: #999;
				}
			}

			.post-content {
				.post-title {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 10rpx;
					display: block;
				}

				.post-text {
					font-size: 28rpx;
					color: #666;
					line-height: 1.6;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
					overflow: hidden;
				}
			}

			.post-images {
				margin: 20rpx 0;

				.image-grid {
					display: flex;
					flex-wrap: wrap;

					&.grid-1 .post-image {
						width: 400rpx;
						height: 300rpx;
					}

					&.grid-2 .post-image,
					&.grid-3 .post-image,
					&.grid-multi .post-image {
						width: calc(33.33% - 10rpx);
						height: 200rpx;
						margin: 5rpx;
					}

					.post-image {
						border-radius: 8rpx;
					}
					
					.image-count {
						position: absolute;
						right: 10rpx;
						bottom: 10rpx;
						background: rgba(0, 0, 0, 0.5);
						color: #fff;
						font-size: 24rpx;
						padding: 4rpx 12rpx;
						border-radius: 20rpx;
					}
				}
			}

			.post-footer {
				display: flex;
				justify-content: space-around;
				padding-top: 20rpx;
				border-top: 1rpx solid #f0f0f0;

				.post-action {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: #666;

					text {
						margin-left: 8rpx;

						&.liked {
							color: #EA7034;
						}
					}
				}
			}
		}
		
		.no-data {
			text-align: center;
			padding: 40rpx 0;
			color: #999;
			font-size: 28rpx;
		}
	}

	.notabbarsh {
		color: #555555;
	}

	.tabbar-fixed {
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		top: 0rpx;
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		z-index: 300;
		background: #ffffff;
		margin-bottom: 0;
	}
	
	.content-swiper {
		width: 100%;
		display: flex;
		flex-direction: column;
		height: auto;
		min-height: 200rpx;
	}
	
	.content-swiper swiper-item {
		height: auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: visible;
	}
	
	.content-swiper .uni-swiper-item {
		height: auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: visible;
	}
	
	.bookcase {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: center;
		flex-flow: wrap;
		padding-bottom:40rpx;
		font-size:30rpx;
		width: 100%;
		height: auto;
		min-height: 200rpx;
		overflow-y: visible;
	}
	
	.rightBtnGroup{
		position:absolute;
		right:35rpx;
		margin-top: 10px;
		display: flex;
	}
	
	.button {
		height: 68rpx;
		width: 150rpx;
		font-size: 14px;
		text-align: center;
		line-height: 30px;
		border-radius: 5px;
		color: #ffffff;
		background-color: rgb(180, 111, 88);
		margin-left: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.user_id{
		color:#808080;
		font-size:20rpx;
		background-color: #c8c8c8;
		padding:5rpx;
		line-height: 40rpx;
		border-radius: 10rpx;
	}
	.user_group{
		font-size:20rpx;
		padding:5rpx;
		line-height: 40rpx; 
		margin-left:10rpx;
		border-radius: 10rpx;
	}
	
	.admin_title{
		font-size:20rpx;
		padding:5rpx;
		line-height: 40rpx; 
		margin-left:10rpx;
		border-radius: 10rpx;
		background: #55aaff;
		color:white;
		margin-left: 25rpx;
		padding: 5rpx 7.5rpx 5rpx 30rpx;
		text-align: right;
		position:relative;
		img{
			position:absolute;
			left:-25rpx;
			top:-7.5rpx;
		}
	}
	
	.user_group.nonTitle{
		display:none;
	}
	
	@keyframes gradient-move {
		0% {
			background-position: 0% 0;
		}
	
		50% {
			background-position: 100% 0;
		}
	
		100% {
			background-position: 0% 0;
		}
	}
</style>