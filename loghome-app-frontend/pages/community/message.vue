<template>
	<view class="outer">
		<!-- 顶部导航按钮 -->
		<view class="top-nav">
			<view class="nav-button" @click="navigateToNotification">
				<text>系统通知</text>
				<view v-if="unreadNotifications" class="unread-dot"></view>
			</view>
			<view class="nav-button" @click="navigateToPrivateMessage">
				<text>私信</text>
				<view v-if="unreadPrivateMessages" class="unread-dot"></view>
			</view>
		</view>

		<!-- 互动消息分类 -->
		<lgd-tab class="tab" 
			:firstTab="firstTab" 
			:tabValue="['评论', '@我的', '赞与收藏']" 
			@getIndex="changeTab" 
			textColor="#2d2d2d" 
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
				unreadPrivateMessages: 0
			}
		},
		computed: {
			filteredMessages() {
				const messageTypes = {
					0: 'comment',
					1: 'mention',
					2: 'like_collect'
				};
				console.log(messageTypes[this.curTabIndex], this.messages);
				return this.messages.filter(msg => 
					msg.message_type === messageTypes[this.curTabIndex]
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
			axios.get( this.$baseUrl + '/users/userprofile', {
				headers: { 
				     'Content-Type': 'application/json',//设置请求头请求格式为JSON
				     'Authorization': tk //设置token 其中K名要和后端协调好
				}
			}).then((res) => {
				_this.user = JSON.parse(JSON.stringify(res.data));
				_this.id = _this.user.user_id;
				
				// 获取系统消息
				axios.get( this.$baseUrl + '/users/get_history_message', {
					headers: { 
					     'Content-Type': 'application/json',//设置请求头请求格式为JSON
					     'Authorization': tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					window.localStorage.setItem('messages',JSON.stringify(res.data));
					let messages = JSON.parse(window.localStorage.getItem('messages'));
					let myMessage = [];
					//设置所有消息为已读
					for(let i = 0 ; i < messages.length ; i ++){
						if(messages[i].to_id == _this.user.user_id){
							// messages[i].is_read = 1;
							myMessage.push(messages[i])
						}
					}
					_this.messages = myMessage;
					window.localStorage.setItem("messages",JSON.stringify(_this.messages));
					uni.hideTabBarRedDot({
						index: 3
					});
				});
				
				// 获取私信好友列表
				_this.fetchChatFriends();
				
				// 检查是否有未读私信，如果有则显示小红点
				this.checkUnreadMessages();
			}).catch(function(error) {
				if(error.message == "Request failed with status code 401"){
					window.localStorage.removeItem('token');
					uni.navigateTo({
						url: './users/login'
					});
				} else if(error.name == "SyntaxError"){
					uni.showModal({
						title: '异常提示',
						content: '发生异常，我们已为您修复，相关信息将复制到您的剪贴板，建议您反馈到"意见反馈"栏目。',
						success(res) {
							uni.setClipboardData({
								data: window.localStorage.getItem('messages'),
								success: function () {
								    console.log('success');
								}
							})
							window.localStorage.removeItem('messages')
						}
					  });
				}
			})
		},
		mounted() {
			this.$refs.tabs.clickTab(this.firstTab);
		},
		methods:{
			navigateToNotification() {
				uni.navigateTo({
					url: './notification'
				});
			},
			navigateToPrivateMessage() {
				uni.navigateTo({
					url: './private-message'
				});
			},
			// 检查是否有未读私信
			checkUnreadMessages() {
				let unreadPrivateMessages = window.localStorage.getItem('unreadPrivateMessages');
				if (unreadPrivateMessages && parseInt(unreadPrivateMessages) > 0) {
					// 如果有未读私信，在私信tab上显示小红点
					this.badgeIndexes = [1]; // 1是私信tab的索引
				} else {
					this.badgeIndexes = [];
				}
				this.$forceUpdate();
			},
			
			// 处理tab点击事件
			handleTabClicked(index) {
				// 如果点击的是私信tab，清除小红点
				if (index === 1) {
					this.badgeIndexes = [];
				}
			},
			
			changeTab(index){ 
				this.curTabIndex = index;
				if(index == 1){
					this.fetchChatFriends();
					// 切换到私信tab时，清除小红点
					this.badgeIndexes = [];
				}
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
			// 跳转到聊天页面
			navigateToChat(friend) {
				uni.navigateTo({
					url: './chat?id=' + friend.user_id
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
		padding: 20rpx 0;
		border-bottom: 1px solid #eee;
		
		.nav-button {
			position: relative;
			padding: 15rpx 40rpx;
			font-size: 28rpx;
			color: #333;
			
			.unread-dot {
				position: absolute;
				top: 0;
				right: 0;
				width: 16rpx;
				height: 16rpx;
				background-color: #ff4d4f;
				border-radius: 50%;
			}
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
			
			.unread-badge {
				position: absolute;
				top: 10rpx;
				right: 10rpx;
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
			// overflow: hidden;
			// text-overflow: ellipsis;
			// white-space: nowrap;
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
