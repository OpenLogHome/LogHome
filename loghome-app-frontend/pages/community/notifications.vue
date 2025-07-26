<template>
	<view class="outer" v-dark>
		<!-- 消息栏目 -->
		<view class="list">
			<div class="users" v-for="item in notifications">
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

		<div class="nouser" v-if="notifications.length == 0" :style="{
			display: 'flex', 
			justifyContent: 'center', 
			alignItems: 'center', 
			height: '300rpx', 
			backgroundColor: $store.state.isDarkMode ? 'var(--background-color)' : '#F2F2F2', 
			color: $store.state.isDarkMode ? 'var(--text-color-regular)' : '#333'
		}">
			暂无系统通知
		</div>
	</view>
</template>

<script>
	import axios from 'axios'
	import darkModeMixin from '@/mixins/dark-mode.js'
	export default{
		mixins: [darkModeMixin],
		data(){
			return{
				id: -1,
				user: {},
				notifications: [], // 系统通知列表
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
					let notifications = [];
					
					// 筛选系统通知消息
					for(let i = 0 ; i < messages.length ; i ++){
						if(messages[i].to_id == _this.user.user_id && messages[i].message_type === 'notification'){
							// 标记为已读
							messages[i].is_read = 1;
							notifications.push(messages[i]);
						}
					}
					
					_this.notifications = notifications;
					window.localStorage.setItem("messages",JSON.stringify(messages));
					
					// 清除系统通知的小红点
					window.localStorage.setItem('unreadNotifications', '0');
				});
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
		
		&.dark-mode {
			background-color: var(--background-color);
		}
	}
	
	.users {
		width: 100vw;
		display: flex;
		position: relative;
		
		.dark-mode & {
			background-color: var(--background-color-secondary);
		}
		
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
			
			.dark-mode & {
				border-bottom: #444 solid 1px;
			}
			
			.name_time {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 15rpx;
				padding-right: 15rpx;
			}
			
			.time{
				font-size: 30rpx;
				color: #999;
				
				.dark-mode & {
					color: #777;
				}
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
			
			.dark-mode & {
				color: rgb(220, 151, 128);
			}
		}
		
		.motto{
			color: rgb(97, 97, 97);
			width: 80vw;
			margin-top: 8rpx;
			font-size: 28rpx;
			margin-bottom: 10rpx;
			
			.dark-mode & {
				color: var(--text-color-regular);
			}
		}
	}
</style>