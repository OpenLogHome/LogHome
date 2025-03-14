<template>
	<view class="outer">
		<lgd-tab class="tab" 
			:firstTab="firstTab" 
			:tabValue="tabValue" 
			@getIndex="changeTab" 
			textColor="#2d2d2d" 
			ref="tabs"
			:showBadge="true"
			:badgeIndexes="badgeIndexes"
			@tabClicked="handleTabClicked"/>
		
		<!-- 消息栏目 -->
		<view class="list" v-show="curTabIndex == 0">
			<div class="users" v-for="item in shownMessages">
				<navigator class="avators" :url="'../users/personalPage?id='+item.from_id">
					<log-image :src="item.avatar_url" alt=""
					onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
				</navigator>
				<navigator class="users" :url="item.router ? '../' + item.router : './'">
					<div class="personInfo" style="display: flex; flex-direction: column; justify-content: center;">
						<div class="name_time" style="display: flex; justify-content: space-between;">
							<div class="name">{{item.name}}</div>
							<div class="time" style="margin-right: 20rpx;">{{utc2beijing(item.time)}}</div>
						</div>
						<div class="motto">{{item.message_content}}</div>
					</div>
				</navigator>
			</div>
		</view>
		
		<!-- 私信栏目 -->
		<view class="list" v-show="curTabIndex == 1">
			<div class="users" v-for="item in chatFriends" @click="navigateToChat(item)">
				<view class="avators">
					<log-image :src="item.avatar_url" alt=""
					onerror="onerror=null;src='../static/user/defaultAvatar.jpg'" />
					<view v-if="item.unread_count > 0" class="unread-badge">{{item.unread_count}}</view>
				</view>
				<div class="personInfo">
					<div class="name-row">
						<div class="name">{{item.name}}</div>
						<div class="time">{{utc2beijing(item.last_message_time)}}</div>
					</div>
					<div class="motto">{{item.last_message_content}}</div>
				</div>
			</div>
		</view>
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
				tabValue: ["消息", "私信"],
				firstTab: 0,
				id: -1,
				user: {},
				isMe: false,
				curTabIndex: 0,
				follows: [],
				messages: [],
				shownMessages: [],
				chatFriends: [], // 私信好友列表
				page: 0,
				pageDOM: undefined,
				badgeIndexes: [] // 需要显示小红点的tab索引
			}
		},
		// onNavigationBarButtonTap(e){
		// 	uni.navigateTo({
		// 		url: './send_mail'
		// 	});
		// },
		onLoad(){
			let _this = this;
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
							messages[i].is_read = 1;
							myMessage.push(messages[i])
						}
					}
					_this.messages = myMessage;
					_this.shownMessages = _this.messages.splice(0,100);
					window.localStorage.setItem("messages",JSON.stringify(_this.shownMessages));
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
		}
	}
</script>

<style scoped lang="less">
	.outer{
		background-color: #ffffff;
		padding-top: 4px;
		
		.tab{
			height: 40px;
			width: 100vw;
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
			
			.name-row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20rpx;
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
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		
		.button{
			position: absolute;
			right: 30rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>
