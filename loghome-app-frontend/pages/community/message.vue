<template>
	<view class="outer" v-dark>
		<!-- 顶部导航按钮 -->
		<view class="top-nav">
			<div class="nav-button" @click="navigateToNotification">
				<img src="../../static/user/bell.png" alt="" class="nav-button-icon" />
				<text>系统通知</text>
				<view v-if="unreadNotifications > 0" class="unread-badge">{{unreadNotifications}}</view>
			</div>
			<div class="nav-button" @click="navigateToPrivateMessage">
				<img src="../../static/user/post.png" alt="" class="nav-button-icon" />
				<text>私信</text>
				<view v-if="unreadPrivateMessages > 0" class="unread-badge">{{unreadPrivateMessages}}</view>
			</div>
			<div class="nav-button" @click="navigateToActivityMessage">
				<img src="../../static/user/megaphone.png" alt="" class="nav-button-icon" />
				<text>活动消息</text>
				<view v-if="unreadActivityMessages > 0" class="unread-badge">{{unreadActivityMessages}}</view>
			</div>
		</view>

		<!-- 互动消息分类 -->
		<lgd-tab class="tab" 
			:firstTab="firstTab" 
			:tabValue="tabValue" 
			@getIndex="changeTab" 
			:textColor="$store.state.isDarkMode ? '#ffffff' : '#2d2d2d'"
			:showBadge="true"
			:badgeIndexes="badgeIndexes"
			ref="tabs"/>
		
		<!-- 三个分类始终保留在横向分页轨道中，手势拖动时由原生 swiper 跟手。 -->
		<swiper
			class="message-swiper"
			:current="curTabIndex"
			:duration="280"
			:circular="false"
			@change="handleSwiperChange"
		>
			<swiper-item v-for="(group, pageIndex) in messageGroups" :key="messageTypes[pageIndex]">
				<scroll-view class="message-page" scroll-y :show-scrollbar="false">
					<view v-if="group.length" class="message-list">
						<view
							class="message-item"
							v-for="(item, itemIndex) in group"
							:key="item.message_id || item.id || `${messageTypes[pageIndex]}-${itemIndex}`"
						>
							<view class="avatar-wrap" @click.stop="navigateTo('../users/personalPage?id=' + item.from_id)">
								<user-avatar class="message-avatar" :src="item.avatar_url" :frame="item.avatar_frame"
									:visual-scale="item.avatar_frame ? 1.25 : 1" />
							</view>
							<view class="message-main" @click="navigateTo(item.router ? '../' + item.router : './')">
								<view class="name-time">
									<text class="name">{{item.name}}</text>
									<text class="time">{{utc2beijing(item.time)}}</text>
								</view>
								<text class="message-content">{{item.message_content}}</text>
							</view>
						</view>
					</view>
					<view v-else class="empty-state">
						<view class="empty-state-icon">◎</view>
						<text class="empty-state-title">暂无消息</text>
						<text class="empty-state-subtitle">新的互动消息会显示在这里</text>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import axios from 'axios'
	import darkModeMixin from '@/mixins/dark-mode.js'
	export default{
		mixins: [darkModeMixin],
		data(){
			return{
				tabValue: ["评论", "关注", "赞与收藏"],
				firstTab: 0,
				id: -1,
				user: {},
				curTabIndex: 0,
				messages: [],
				unreadNotifications: 0,
				unreadPrivateMessages: 0,
				unreadActivityMessages: 0, // 新增：未读活动消息数量
				badgeIndexes: [], // 需要显示小红点的tab索引
				unreadCounts: [0, 0, 0], // 各分类未读消息数量
				messageTypes:{
					0: 'comment',
					1: 'followed',
					2: 'like_collect'
		}
			}
		},
		computed: {
			messageGroups() {
				return this.tabValue.map((item, index) => this.messages.filter(msg =>
					msg.message_type === this.messageTypes[index]
				));
			}
		},
		onShow(){
			let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;;
			let _this = this;
			if(tk == null){
				uni.navigateTo({
					url: './users/login?msg=' + 'unAuthorized'
				});
				return;
			}
			//验活
			uni.showLoading({
				title: '努力加载中',
				mask: true
			});
			axios.get( this.$baseUrl + '/users/userprofile', {
				headers: { 
				     'Content-Type': 'application/json',
				     'Authorization': tk
				}
			}).then((res) => {
				_this.user = JSON.parse(JSON.stringify(res.data));
				_this.id = _this.user.user_id;
				
				// 获取系统消息
				axios.get( this.$baseUrl + '/users/get_history_message', {
					headers: { 
					     'Content-Type': 'application/json',
					     'Authorization': tk
					}
				}).then((res) => {
					let messages = res.data;
					let myMessage = [];
					// 统计未读消息
					let unreadCounts = [0, 0, 0];
					let unreadNotifications = 0;
					let unreadActivityMessages = 0; // 新增：未读活动消息计数
					
					for(let i = 0 ; i < messages.length ; i ++){
						if(messages[i].to_id == _this.user.user_id){
							myMessage.push(messages[i]);
							
							// 统计各类型未读消息数量
							if(messages[i].is_read === 0) {
								if(messages[i].message_type === 'notification') {
									unreadNotifications++;
								} else if(messages[i].message_type === 'activity') { // 新增：活动消息类型
									unreadActivityMessages++;
								} else if(messages[i].message_type === 'comment') {
									unreadCounts[0]++;
								} else if(messages[i].message_type === 'followed') {
									unreadCounts[1]++;
								} else if(messages[i].message_type === 'like_collect') {
									unreadCounts[2]++;
								}
							}
						}
					}
					
					_this.messages = myMessage;
					_this.unreadCounts = unreadCounts;
					_this.unreadNotifications = unreadNotifications;
					_this.unreadActivityMessages = unreadActivityMessages; // 新增：设置未读活动消息数量
					
					window.localStorage.setItem("messages",JSON.stringify(_this.messages));
					// 当前分页已经呈现在用户眼前，加载完成后直接按已读处理。
					_this.markTabAsRead(_this.curTabIndex);
					window.localStorage.setItem('unreadActivityMessages', unreadActivityMessages.toString()); // 新增：保存未读活动消息数量
					uni.hideTabBarRedDot({
						index: 4
					});
					uni.hideLoading();
				});
				
				// 获取私信好友列表
				_this.fetchChatFriends();
				
				// 检查是否有未读私信
				this.checkUnreadPrivateMessages();
			}).catch(function(error) {
				if(error.message == "Request failed with status code 401"){
					window.localStorage.removeItem('token');
					uni.navigateTo({
						url: './users/login'
					});
				}
			})
		},
		methods:{
			// 更新小红点显示
			updateBadgeIndexes() {
				this.badgeIndexes = this.unreadCounts.map((count, index) => count > 0 ? index : -1).filter(index => index !== -1);
			},
			
			navigateToNotification() {
				uni.navigateTo({
					url: './notifications'
				});
			},
			navigateToPrivateMessage() {
				uni.navigateTo({
					url: './privateMessages'
				});
			},
			navigateToActivityMessage() {
				uni.navigateTo({
					url: './activityMessages'
				});
			},
			// 检查是否有未读私信
			checkUnreadPrivateMessages() {
				let unreadPrivateMessages = window.localStorage.getItem('unreadPrivateMessages');
				this.unreadPrivateMessages = parseInt(unreadPrivateMessages) || 0;
			},
			
			changeTab(index){
				const nextIndex = Math.max(0, Math.min(this.tabValue.length - 1, Number(index) || 0));
				this.curTabIndex = nextIndex;
				this.markTabAsRead(nextIndex);
			},

			handleSwiperChange(event) {
				const detail = event && event.detail ? event.detail : {};
				const nextIndex = Math.max(0, Math.min(
					this.tabValue.length - 1,
					Number(detail.current) || 0
				));
				this.curTabIndex = nextIndex;
				this.markTabAsRead(nextIndex);

				// 手势切页后同步上方标签和下划线；点击标签触发的切页无需重复调用。
				this.$nextTick(() => {
					const tabs = this.$refs.tabs;
					if (tabs && tabs.tIndex !== nextIndex) {
						tabs.clickTab(nextIndex);
					}
				});
			},

			markTabAsRead(index) {
				const messageType = this.messageTypes[index];
				if (!messageType) return;

				this.messages = this.messages.map((message) =>
					message.message_type === messageType
						? { ...message, is_read: 1 }
						: message
				);
				window.localStorage.setItem("messages", JSON.stringify(this.messages));

				this.$set(this.unreadCounts, index, 0);
				this.updateBadgeIndexes();
			},
			
			// 获取私信好友列表
			fetchChatFriends() {
				let tk = JSON.parse(window.localStorage.getItem('token')).tk;
				let _this = this;
				
				axios.get(this.$baseUrl + '/community/chat_friends', {
					headers: { 
						'Authorization': 'Bearer ' + tk
					}
				}).then((res) => {
					// 按未读消息数量和最后消息时间排序
					let friends = res.data;
					friends.sort((a, b) => {
						// 首先按未读消息数量排序（降序）
						if (b.unread_count !== a.unread_count) {
							return b.unread_count - a.unread_count;
						}
						// 然后按最后消息时间排序（降序）
						return new Date(b.last_message_time) - new Date(a.last_message_time);
					});
					
					_this.chatFriends = friends;
				}).catch((error) => {
					console.error('获取私信好友列表失败', error);
				});
			},
			
			utc2beijing(utc_datetime) {
			    // 转为正常的时间格式 年-月-日 时:分:秒
			    var T_pos = utc_datetime.indexOf('T');
			    var Z_pos = utc_datetime.indexOf('Z');
			    var year_month_day = utc_datetime.substr(0,T_pos);
			    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
			    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
			
			    // 处理成为时间戳
			    timestamp = new Date(Date.parse(new_datetime));
			    timestamp = timestamp.getTime();
			    timestamp = timestamp/1000;
			
			    // 增加8个小时，北京时间比utc时间多八个时区
			    var timestamp = timestamp+8*60*60;
			
			    // 时间戳转为时间
				var beijing_datetime = this.timeConvert(new Date(parseInt(timestamp) * 1000))
			    return beijing_datetime; // 2017-03-31 16:02:06
			},
			navigateTo(url) {
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.outer{
		display: flex;
		flex-direction: column;
		height: 100vh;
		height: 100dvh;
		box-sizing: border-box;
		overflow: hidden;
		background-color: #ffffff;
		padding-top: 4px;
		
		&.dark-mode {
			background-color: var(--background-color);
		}
	}
	
	.top-nav {
		flex: 0 0 auto;
		padding: 0;
		border-bottom: 1px solid #eee;
		width: 100%;
		box-sizing: border-box;
		
		.dark-mode & {
			border-bottom: 1px solid #333;
		}
		
		.nav-button {
			position: relative;
			padding: 30rpx 40rpx;
			font-size: 28rpx;
			color: #000000;
			width: 100%;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			transition: background-color .18s ease, transform .18s ease;
			
			.dark-mode & {
				color: var(--text-color-primary);
			}
			.nav-button-icon{
				width: 80rpx;
				height: 80rpx;
				margin-right: 24rpx;
			}

			text {
				font-size: 30rpx;
				
				.dark-mode & {
					color: var(--text-color-primary);
				}
			}
			
			.unread-badge {
				margin-left: 18rpx;
				background-color: #ff4d4f;
				color: white;
				font-size: 24rpx;
				min-width: 32rpx;
				height: 32rpx;
				border-radius: 16rpx;
				text-align: center;
				line-height: 32rpx;
				padding: 0 6rpx;
			}
		}

		.nav-button:active{
			transform: scale(0.99);
			background-color: rgba(0, 0, 0, 0.035);

			.dark-mode & {
				background-color: rgba(255, 255, 255, 0.05);
			}
		}
	}

	.tab {
		flex: 0 0 40px;
		height: 40px;
		width: 100%;
		margin: 15rpx 0;
	}

	.message-swiper {
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
		overflow: hidden;
	}

	.message-page {
		display: block;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background-color: #fff;
		overflow-anchor: none;
		-webkit-overflow-scrolling: touch;

		.dark-mode & {
			background-color: var(--background-color);
		}
	}

	.message-list {
		width: 100%;
		padding-bottom: calc(24rpx + var(--loghome-safe-bottom, 0px));
		box-sizing: border-box;
	}

	.message-item {
		width: 100%;
		display: flex;
		align-items: stretch;
		position: relative;
		padding-left: 14rpx;
		box-sizing: border-box;
		background-color: #fff;
		transition: background-color .16s ease;
		
		.dark-mode & {
			background-color: var(--background-color-secondary);
		}
	}

	.message-item:active {
		background-color: #f1efec;

		.dark-mode & {
			background-color: #343434;
		}
	}

	.avatar-wrap {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		flex: 0 0 126rpx;
		padding: 15rpx 10rpx 15rpx 0;
		box-sizing: border-box;

		.message-avatar {
			width: 100rpx;
			height: 100rpx;
		}
	}

	.message-main {
		flex: 1;
		min-width: 0;
		padding: 15rpx 22rpx 18rpx 0;
		box-sizing: border-box;
		border-bottom: 1px solid #e0ddd9;

		.dark-mode & {
			border-bottom-color: #444;
		}
	}

	.name-time {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		min-width: 0;
		gap: 20rpx;
	}

	.name {
		min-width: 0;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 32rpx;
		font-weight: 600;
		line-height: 42rpx;
		color: rgb(180, 111, 88);

		.dark-mode & {
			color: rgb(220, 151, 128);
		}
	}

	.time {
		flex-shrink: 0;
		font-size: 24rpx;
		line-height: 36rpx;
		color: #999;

		.dark-mode & {
			color: #858585;
		}
	}

	.message-content {
		display: -webkit-box;
		margin-top: 8rpx;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #616161;

		.dark-mode & {
			color: var(--text-color-regular);
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 360rpx;
		color: #777;

		.dark-mode & {
			color: var(--text-color-regular);
		}
	}

	.empty-state-icon {
		font-size: 72rpx;
		line-height: 1;
		opacity: .34;
	}

	.empty-state-title {
		margin-top: 24rpx;
		font-size: 30rpx;
		font-weight: 600;
	}

	.empty-state-subtitle {
		margin-top: 10rpx;
		font-size: 24rpx;
		opacity: .68;
	}
</style>
