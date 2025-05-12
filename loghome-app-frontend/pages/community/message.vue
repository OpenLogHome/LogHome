<template>
	<view class="outer">
		<!-- 顶部导航按钮 -->
		<view class="top-nav">
			<div class="nav-button" @click="navigateToNotification">
				<img src="../../static/notification.png" alt="" class="nav-button-icon">
				<text>系统通知</text>
				<view v-if="unreadNotifications > 0" class="unread-badge">{{unreadNotifications}}</view>
			</div>
			<div class="nav-button" @click="navigateToPrivateMessage">
				<img src="../../static/private_message.png" alt="" class="nav-button-icon">
				<text>私信</text>
				<view v-if="unreadPrivateMessages > 0" class="unread-badge">{{unreadPrivateMessages}}</view>
			</div>
		</view>

		<!-- 互动消息分类 -->
		<lgd-tab class="tab" 
			:firstTab="firstTab" 
			:tabValue="['评论', '@我的', '赞与收藏']" 
			@getIndex="changeTab" 
			:textColor="$store.state.isDarkMode ? '#ffffff' : '#2d2d2d'"
			:showBadge="true"
			:badgeIndexes="badgeIndexes"
			ref="tabs"/>
		
		<!-- 消息列表 -->
		<view class="list">
			<div class="users" v-for="item in filteredMessages">
				<div class="avators" @click="navigateTo('../users/personalPage?id='+item.from_id)">
					<log-image :src="item.avatar_url" alt=""
					onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
				</div>
				<div class="users" @click="navigateTo(item.router ? '../' + item.router : './')">
					<div class="personInfo">
						<div class="name_time">
							<div class="name">{{item.name}}</div>
							<div class="time">{{utc2beijing(item.time)}}</div>
						</div>
						<div class="motto">{{item.message_content}}</div>
					</div>
				</div>
			</div>
		</view>

		<div class="nouser" v-if="filteredMessages.length == 0" style="display: flex; 
			justify-content: center; align-items: center; height: 300rpx; background-color: #F2F2F2; color: #333">
			暂无消息
		</div>
	</view>
</template>

<script>
	import followBtn from '../../components/follow.vue'
	import axios from 'axios'
	export default{
		components:{
			followBtn
		},
		data(){
			return{
				tabValue: ["评论", "@我的", "赞与收藏"],
				firstTab: 0,
				id: -1,
				user: {},
				curTabIndex: 0,
				messages: [],
				unreadNotifications: 0,
				unreadPrivateMessages: 0,
				badgeIndexes: [], // 需要显示小红点的tab索引
				unreadCounts: [0, 0, 0], // 各分类未读消息数量
				messageTypes:{
					0: 'comment',
					1: 'mention',
					2: 'like_collect'
				}
			}
		},
		computed: {
			filteredMessages() {
				return this.messages.filter(msg => 
					msg.message_type === this.messageTypes[this.curTabIndex]
				);
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
				title: '加载中',
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
					
					for(let i = 0 ; i < messages.length ; i ++){
						if(messages[i].to_id == _this.user.user_id){
							myMessage.push(messages[i]);
							
							// 统计各类型未读消息数量
							if(messages[i].is_read === 0) {
								if(messages[i].message_type === 'notification') {
									unreadNotifications++;
								} else if(messages[i].message_type === 'comment') {
									unreadCounts[0]++;
								} else if(messages[i].message_type === 'mention') {
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
					
					// 更新小红点显示
					_this.updateBadgeIndexes();
					
					window.localStorage.setItem("messages",JSON.stringify(_this.messages));
					uni.hideTabBarRedDot({
						index: 3
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
		mounted() {
			this.$refs.tabs.clickTab(this.firstTab);
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
			// 检查是否有未读私信
			checkUnreadPrivateMessages() {
				let unreadPrivateMessages = window.localStorage.getItem('unreadPrivateMessages');
				this.unreadPrivateMessages = parseInt(unreadPrivateMessages) || 0;
			},
			
			changeTab(index){ 
				this.curTabIndex = index;
				let messages = window.localStorage.getItem("messages");
				for(let i = 0 ; i < messages.length ; i ++){
					if(messages[i].message_type === this.messageTypes[index]){
						messages[i].is_read = 1;
					}
				}
				window.localStorage.setItem("messages",JSON.stringify(messages));
				// 更新本地未读计数
				this.unreadCounts[index] = 0;
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
		background-color: #ffffff;
		padding-top: 4px;
	}
	
	.top-nav {
		padding: 0rpx 0;
		border-bottom: 1px solid #eee;
		width: 100vw;
		
		.nav-button {
			position: relative;
			padding: 30rpx 40rpx;
			font-size: 28rpx;
			color: #000000;
			width: calc(100% - 80rpx);
			display: flex;
			align-items: center;
			transition: all .3s;
			.nav-button-icon{
				width: 80rpx;
				height: 80rpx;
				margin-right: 24rpx;
			}

			text{
				font-size: 30rpx;
			}
			
			.unread-badge {
				position: relative;
				right: -25rpx;
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
			transform: scale(0.98);
		}
	}
	
	.users {
		width: 100vw;
		display: flex;
		position: relative;
		
		.avators {
			position: relative;
			
			img {
				height: 100rpx;
				border: #cacaca 1rpx solid;
				border-radius: 7rpx;
				margin: 15rpx;
			}
		}
		
		.personInfo{
			position: relative;
			border-bottom: #cacaca solid 1px;
			flex: 1;

			.name_time{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 15rpx;
				padding-right: 15rpx;
			}
			
			.time{
				font-size: 30rpx;
				color: #999;
			}
		}
		
		.name {
			font-size: 32rpx;
			height: 40rpx;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			color: rgb(180, 111, 88);
		}
		
		.motto{
			color: rgb(97, 97, 97);
			width: 80vw;
			margin-top: 8rpx;
			font-size: 28rpx;
			margin-bottom: 10rpx;
		}
	}

	.users:active{
		background-color: #e3e3e3;
	}
	
	.tab {
		margin-top: 15rpx;
		margin-bottom: 15rpx;
		height: 40px;
		width: 100vw;
	}
</style>
