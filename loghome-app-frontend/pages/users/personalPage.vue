<template>
	<view class="page-root" v-dark>
		<!-- 后台按钮组件 -->
		<zetank-backBar :textcolor="isDarkMode ? '#e5e5e5' : '#000'" :showLeft="topNum == 0" :showTitle="false" navTitle='标题'></zetank-backBar>
		<!-- 用户背景封面（只保留内容面板上方的可见区域，避免面板内容较短时封面从下方露出） -->
		<view class="info-cover-wrap" :style="coverWrapStyle" @tap="change_top_pic">
			<log-image class="info-cover" :src="user.top_pic_url"
			onerror="onerror=null;src='https://i.loli.net/2021/11/29/BxFmtyrS7GolgqM.jpg'"></log-image>
		</view>
		
		<springBack class="profile-content-sheet" top="calc(300rpx + var(--loghome-safe-top, 0px))" @cover-move="onCoverMove">
			<!-- 右侧悬浮按钮 -->
			<view class="rightBtnGroup">
				<followBtn :targetId="Number(uid)" v-show="uid != myUserInfo.user_id"/>
				<navigator url="./change_user_info" v-show="uid == myUserInfo.user_id">
					<div class="button">{{ $t('me.profile.editProfile') }}</div>
				</navigator>
				<div class="button" v-show="uid != myUserInfo.user_id" @click="gotoPrivateMessage">{{ $t('me.profile.sendDm') }}</div>
			</view>
			
			<!-- 用户头像关注 -->
			<view class="u-flex-wrap"
				style="padding-top: 18rpx;padding-bottom: 18rpx;position: relative;align-items: center;display: flex;flex-direction: row;justify-content: flex-end;">
				<view
					class="info-avatar"
					:class="{ 'info-avatar--framed': user.avatar_frame }"
					@click="$previewImg([user.avatar_url])"
				>
					<user-avatar :src="user.avatar_url" :frame="user.avatar_frame" :animate="true" :visual-scale="user.avatar_frame ? 1.5 : 1" />
				</view>
				<view style="margin-right: 50rpx;">
					<view v-if='!showedit' style="height: 45rpx;"></view>
				</view>
			</view>
			<!-- 用户名 -->
			<view class="profile-name-row">
				<text :style="'font-size: 40rpx;color: ' + (isDarkMode ? '#e5e5e5' : '#111111') + ';font-weight: bold;margin-right: 10rpx;'">{{user.name}}</text>
				<view
					v-if="user.is_admin"
					class="admin-badge-tap"
					@tap="toggleAdminTip"
					@click="toggleAdminTip"
				>
					<img class="admin-badge-icon" src="../../static/icons/admin.gif" alt="" />
					<view v-if="showAdminTip" class="admin-badge-tip" @tap.stop @click.stop>
						<text>{{ $t('me.profile.admin') }}</text>
					</view>
				</view>
			</view>

			<view class="moreInfo" style="margin-left: 50rpx;margin-top: 18rpx; display: flex;align-items: center;">
				<span class="user_id">ID:{{uid}}</span>
				<view
					v-if="user.selected_badge"
					class="profile-badge-tap"
					@tap="goToBadgeDetail(user.selected_badge)"
					@click="goToBadgeDetail(user.selected_badge)"
				>
					<honor-badge :badge="user.selected_badge" size="sm" class="profile-badge" scale="1.2" />
				</view>
				<view v-if="user.display_title" class="profile-title-chip">
					{{user.display_title}}
				</view>
				<membership-badge :tier="user.membership_type" size="md" :show-label="true" style="margin-left: 15rpx;"/>
			</view>
	
			<!-- 简介-->
			<view :style="'font-size: 28rpx;color: ' + (isDarkMode ? '#b8b8b8' : '#555555') + ';margin:20rpx 50rpx;'">
				<text style="margin-right: 20rpx;">{{user.motto==''?$t('me.profile.noMotto'):user.motto}}</text>
			</view>
			<view style="display: flex;align-items: center;margin-left: 50rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
				<navigator :url="'../community/friends?id=' + uid + '&tab=1'">
					<text
						:style="'font-size: 40rpx;font-weight: bold;color: ' + (isDarkMode ? '#e5e5e5' : '#555555') + ';margin-right: 18rpx;'">{{fans}}</text><text
						:style="'font-size: 28rpx;color: ' + (isDarkMode ? '#999' : 'gray') + ';margin-right: 28rpx;'">{{ $t('me.profile.followers') }}</text>
				</navigator>
				<navigator :url="'../community/friends?id=' + uid + '&tab=0'">
					<text
						:style="'font-size: 40rpx;font-weight: bold;color: ' + (isDarkMode ? '#e5e5e5' : '#555555') + ';margin-right: 18rpx;'">{{follows}}</text><text
						:style="'font-size: 28rpx;color: ' + (isDarkMode ? '#999' : 'gray') + ';margin-right: 28rpx;'">{{ $t('me.profile.following') }}</text>
				</navigator>
			
	<!-- 			<text
					style="font-size: 40rpx;font-weight: bold;color: #555555;margin-right: 18rpx;">{{likes}}</text><text
					style="font-size: 28rpx;color: gray;margin-right: 28rpx;">点赞</text> -->
			
			</view>
	
			<view id="tabbar" :class="isFixed?'tabbar-fixed':''" 
				style="align-items: stretch;height: 90rpx;line-height: 90rpx; display: flex;
				flex-direction: row;justify-content: space-around; margin:0 80rpx;">
				<view style="font-size: 32rpx;font-weight: bold;text-align: center;width: 128rpx;"
					:class="current == 0?'tabbarsh':'notabbarsh'" @tap="fnBarClick(0)">{{ $t('me.profile.tabWorks') }}</view>
				<view style="font-size: 32rpx;font-weight: bold;text-align: center;width: 128rpx;"
					:class="current == 1?'tabbarsh':'notabbarsh'" @tap="fnBarClick(1)">{{ $t('me.profile.tabPosts') }}</view>
				<view style="font-size: 32rpx;font-weight: bold;text-align: center;width: 128rpx;"
					:class="current == 2?'tabbarsh':'notabbarsh'" @tap="fnBarClick(2)">{{ $t('me.profile.tabWorlds') }}</view>
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
						<view class="empty-hint" v-if="booksOnShow.filter(function(b) { return !b.is_personal; }).length === 0">
							<img class="empty-hint-img" src="../../static/loggirl-404-empty-chest.png" alt="" />
							<text class="empty-hint-text">{{ $t('me.profile.noWorks') }}</text>
						</view>
						<bookInCase v-for="item in booksOnShow" :bookName="item.name" :picUrl="item.picUrl" :key="item.novel_id"
									@click.native="readBook(item.novel_id)" v-show="!item.is_personal"></bookInCase>
					</div>
				</swiper-item>
				<swiper-item>
					<div class="post-list tabpage">
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
									<uni-icons type="chat" size="18" :color="isDarkMode ? '#b8b8b8' : '#666'"></uni-icons>
									<text>{{post.comment_count || 0}}</text>
								</view>
								<view class="post-action">
									<uni-icons type="heart" size="18" :color="isDarkMode ? '#b8b8b8' : '#666'"></uni-icons>
									<text>{{post.like_count || 0}}</text>
								</view>
							</view>
						</view>
						<view class="empty-hint" v-if="userPosts.length === 0">
							<img class="empty-hint-img" src="../../static/loggirl-404-empty-chest.png" alt="" />
							<text class="empty-hint-text">{{ $t('me.profile.noPosts') }}</text>
						</view>
						<uni-load-more v-if="userPosts.length > 0" :status="postsLoadingStatus"></uni-load-more>
					</div>
				</swiper-item>
				<swiper-item>
					<div class="bookcase tabpage">
						<view class="empty-hint" v-if="worldsOnShow.length === 0">
							<img class="empty-hint-img" src="../../static/loggirl-404-empty-chest.png" alt="" />
							<text class="empty-hint-text">{{ $t('me.profile.noWorlds') }}</text>
						</view>
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
	import springBack from '../../components/springBack.vue'
	import HonorBadge from '../../components/honor-badge.vue'
	import MembershipBadge from '../../components/membership-badge.vue'
	import darkModeMixin from '@/mixins/dark-mode.js'
	import axios from 'axios'
	import { postTimeText } from '@/common/datetime.js'
	import i18n from '@/i18n/index.js'
	export default {
		components:{
			bookInCase,followBtn,springBack,HonorBadge,MembershipBadge
		},
		mixins: [darkModeMixin],
		data() {
			return {
				uid: -1,
				membertype: '',
				showedit: true, //信息编辑按钮
				showAdminTip: false, //管理员徽标 tooltip
				adminTipTimer: null,
				coverDy: 0, // springBack 下拉位移，背景图跟随拉伸
				coverDyAnimated: false, // 回弹时高度是否用过渡动画
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
		onReachBottom() {
			// 动态列表跟随页面滚动，普通 div 不会触发 scrolltolower。
			if (this.current === 1) {
				this.loadMorePosts();
			}
		},
		computed: {
			coverWrapStyle() {
				// 拖动中高度跟手（无过渡）；松手后用与面板一致的 0.2s ease-out 回弹，
				// 避免封面瞬间弹回而面板还在回滑，中途露出白缝
				return {
					height: 'calc(300rpx + var(--loghome-safe-top, 0px) + ' + this.coverDy + 'px)',
					transition: this.coverDyAnimated ? 'height 0.2s ease-out' : 'none',
				};
			},
		},
		methods: {
			// springBack 下拉时背景图跟随拉伸：露出被遮住的图片下半段，与面板底边无缝衔接
			onCoverMove(dy) {
				const value = Number(dy) || 0;
				if (value > 0) {
					// 拖动中：跟手，无过渡
					this.coverDyAnimated = false;
					this.coverDy = value;
				} else {
					// 松手回弹：高度用过渡动画归零，与面板回滑同步
					this.coverDyAnimated = true;
					this.coverDy = 0;
				}
			},
			// 管理员徽标 tooltip：点击显示"社区管理员"，3 秒后自动消失
			toggleAdminTip() {
				if (this.showAdminTip) {
					this.showAdminTip = false;
					clearTimeout(this.adminTipTimer);
					this.adminTipTimer = null;
					return;
				}
				this.showAdminTip = true;
				clearTimeout(this.adminTipTimer);
				this.adminTipTimer = setTimeout(() => {
					this.showAdminTip = false;
					this.adminTipTimer = null;
				}, 3000);
			},
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
			goToBadgeDetail(badge) {
				if (!badge) return
				uni.setStorageSync('badgeDetailPayload', badge)
				const ownerId = Number(this.uid)
				if (Number.isFinite(ownerId) && ownerId > 0) {
					uni.setStorageSync('badgeDetailOwnerId', ownerId)
				}
				let encodedBadge = ''
				try {
					encodedBadge = encodeURIComponent(JSON.stringify(badge))
				} catch (e) {
					encodedBadge = ''
				}
				const query = []
				if (encodedBadge) query.push('badge=' + encodedBadge)
				if (Number.isFinite(ownerId) && ownerId > 0) query.push('owner_id=' + ownerId)
				query.push('is_selected=1')
				uni.navigateTo({
					url: '/pages/users/badgeDetail' + (query.length ? ('?' + query.join('&')) : ''),
					fail() {
						uni.navigateTo({
							url: Number.isFinite(ownerId) && ownerId > 0
								? '/pages/users/badgeDetail?owner_id=' + ownerId
								: '/pages/users/badgeDetail'
						})
					}
				})
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
				}).catch(function(error) {
					uni.showToast({
						title: i18n.t('me.profile.userLoadFailed'),
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
						title: i18n.t('me.profile.worksLoadFailed'),
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
				
				
				axios.get(_this.$baseUrl + '/community/social_counts?id=' + _this.uid).then((res) => {
					_this.fans = Number(res.data.fans);
					_this.follows = Number(res.data.follows);
				}).catch(function(error) {
					uni.showToast({ title: i18n.t('me.profile.userLoadFailed'), icon: 'none' });
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
						title: i18n.t('me.profile.worldsLoadFailed'),
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
						title: i18n.t('me.profile.postsLoadFailed'),
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
			
			// 格式化时间（i18n：统一走 common/datetime.js，zh 输出与原实现一致）
			formatTime(time) {
				return postTimeText(time);
			},
			
			// 导航到帖子详情
			navigateToPost(postId) {
				uni.navigateTo({ url: `/pages/community/postDetail?id=${postId}` });
			},
			
			// 导航到圈子详情
			navigateToCircle(circleId) {
				if (!circleId || circleId === 0) {
					uni.showToast({
						title: this.$t('me.profile.circleGone'),
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
	.profile-content-sheet:not(.dark-mode) {
		background: #ffffff;
	}
	/* 页面子元素均为绝对定位脱流，根容器需自身撑满视口涂底色，
	   否则内容面板下方会露出 WebView 底层背景色 */
	.page-root {
		min-height: 100vh;
		background-color: #FFFFFF;

		&.dark-mode {
			background-color: var(--background-color-secondary);
		}
	}

	.info-cover-wrap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: calc(300rpx + var(--loghome-safe-top, 0px));
		overflow: hidden;
	}

	.info-cover {
		display: block;
		width: 100vw;
		height:100vw;
		background-color: #FFFFFF;

		.dark-mode & {
			background-color: #252525;
		}
	}

	.info-avatar {
		position: absolute;
		left: 0;
		top: -144rpx;
		margin-left: 50rpx;
		width: 190upx;
		height: 190upx;
	}

	.info-avatar--framed {
		top: -148rpx;
	}

	.profile-name-row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8rpx;
		margin-left: 50rpx;
		margin-top: 28rpx;
		padding-right: 36rpx;
	}

	.profile-badge {
		transform: translateY(2rpx);
	}

	.profile-badge-tap {
		display: inline-flex;
		align-items: center;
		margin: 0 5rpx 0 15rpx;
	}

	.profile-title-chip {
		margin-left: 12rpx;
		padding: 7rpx 16rpx;
		border-radius: 999rpx;
		font-size: 22rpx;
		line-height: 1.2;
		max-width: 320rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #fff3df;
		background: linear-gradient(120deg, rgba(160, 104, 54, 0.94) 0%, rgba(117, 69, 33, 0.94) 100%);
		box-shadow: 0 8rpx 18rpx rgba(117, 69, 33, 0.18);
	}

	.tabbarsh {
		color: rgb(180, 111, 88);
		border-bottom: 4rpx rgb(180, 111, 88) solid;
		
		.dark-mode & {
			color: #d1a980;
			border-bottom: 4rpx #d1a980 solid;
		}
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
			
			.dark-mode & {
				background: #252525;
				border: 1px solid #3a3a3a;
			}

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
					
					.dark-mode & {
						background: rgba(234, 112, 52, 0.2);
					}
				}
				
				.post-time {
					font-size: 24rpx;
					color: #999;
					
					.dark-mode & {
						color: #777;
					}
				}
			}

			.post-content {
				.post-title {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 10rpx;
					display: block;
					
					.dark-mode & {
						color: #e5e5e5;
					}
				}

				.post-text {
					font-size: 28rpx;
					color: #666;
					line-height: 1.6;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
					overflow: hidden;
					
					.dark-mode & {
						color: #b8b8b8;
					}
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
				
				.dark-mode & {
					border-top: 1rpx solid #3a3a3a;
				}

				.post-action {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: #666;
					
					.dark-mode & {
						color: #b8b8b8;
					}

					text {
						margin-left: 8rpx;

						&.liked {
							color: #EA7034;
						}
					}
				}
			}
		}
		
	}

	.empty-hint {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 60rpx 0;

		.empty-hint-img {
			width: 220rpx;
			max-width: 50%;
			margin: 25rpx 0;
		}

		.empty-hint-text {
			color: #777777;
			font-size: 25rpx;

			.dark-mode & {
				color: var(--text-color-regular);
			}
		}
	}

	.notabbarsh {
		color: #555555;
		
		.dark-mode & {
			color: #b8b8b8;
		}
	}

		.tabbar-fixed {
			position: fixed;
			left: 0;
			right: 0;
			top: var(--loghome-safe-top, 0px);
		z-index: 300;
		background: #ffffff;
		margin-bottom: 0;
		
		.dark-mode & {
			background: #252525;
		}
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
		align-items: center;
	}

	.button {
		height: 60rpx;
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
		
		.dark-mode & {
			background-color: #8a5a47;
		}
	}
	
	.user_id{
		color:#808080;
		font-size:20rpx;
		background-color: #c8c8c8;
		padding:5rpx 10rpx;
		line-height: 40rpx;
		border-radius: 10rpx;
		
		.dark-mode & {
			color: #e0e0e0;
			background-color: #505050;
		}
	}
	.admin-badge-tap {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-right: 4rpx;

		.admin-badge-icon {
			width: 48rpx;
			height: 48rpx;
		}

		/* 点击徽标弹出的 tooltip 气泡 */
		.admin-badge-tip {
			position: absolute;
			width: max-content;
			left: 50%;
			bottom: calc(100% + 14rpx);
			transform: translateX(-50%);
			background: rgba(30, 34, 40, 0.92);
			color: #fff;
			font-size: 22rpx;
			line-height: 32rpx;
			padding: 8rpx 20rpx;
			border-radius: 10rpx;
			white-space: nowrap;
			z-index: 50;
			box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.2);
			animation: admin-tip-in 0.18s ease-out;

			text {
				white-space: nowrap;
				word-break: normal;
			}

			/* 气泡小三角 */
			&::after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: -10rpx;
				transform: translateX(-50%);
				border: 10rpx solid transparent;
				border-top-color: rgba(30, 34, 40, 0.92);
				border-bottom: none;
			}
		}
	}

	@keyframes admin-tip-in {
		0% {
			opacity: 0;
			transform: translateX(-50%) translateY(8rpx);
		}

		100% {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
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
