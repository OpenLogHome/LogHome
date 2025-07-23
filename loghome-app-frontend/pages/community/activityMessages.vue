<template>
	<view class="outer">
		<!-- 消息列表 -->
		<view class="activity-list">
			<div class="activity-card" v-for="item in displayMessages" :key="item.message_id" @click="navigateTo(item.router ? '../' + item.router : './')">
				<!-- 背景图片 -->
				<div class="card-image" v-if="item.bg_url">
					<log-image :src="item.bg_url" alt="活动背景" mode="aspectFill" />
				</div>
				<!-- 消息内容 -->
				<div class="card-content">
					<div class="message-content">{{item.message_content}}</div>
					<div class="message-time">{{utc2beijing(item.time)}}</div>
				</div>
			</div>
		</view>

		<div class="nouser" v-if="activityMessages.length == 0" style="display: flex; 
			justify-content: center; align-items: center; height: 300rpx; background-color: #F2F2F2; color: #333">
			暂无活动消息
		</div>
	</view>
</template>

<script>
	import axios from 'axios'
	export default{
		data(){
			return{
				id: -1,
				user: {},
				activityMessages: [], // 活动消息列表
				windowHeight: 0, // 窗口高度
			}
		},
		computed: {
			// 显示消息，新消息显示在下方
			displayMessages() {
				// 对消息进行排序，按时间从旧到新排序
				return [...this.activityMessages].sort((a, b) => {
					return new Date(a.time) - new Date(b.time);
				});
			}
		},
		onLoad() {
			// 获取窗口高度
			const info = uni.getSystemInfoSync();
			this.windowHeight = info.windowHeight;
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
				
				// 获取活动消息
				axios.get( this.$baseUrl + '/users/get_history_message', {
					headers: { 
					     'Content-Type': 'application/json',
					     'Authorization': tk
					}
				}).then((res) => {
					let messages = res.data;
					let activityMessages = [];
					
					// 筛选活动消息
					for(let i = 0 ; i < messages.length ; i ++){
						if(messages[i].to_id == _this.user.user_id && messages[i].message_type === 'activity'){
							// 标记为已读
							messages[i].is_read = 1;
							activityMessages.push(messages[i]);
						}
					}
					
					_this.activityMessages = activityMessages;
					window.localStorage.setItem("messages",JSON.stringify(messages));
					
					// 清除活动消息的小红点
					window.localStorage.setItem('unreadActivityMessages', '0');
					uni.hideLoading();
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
			timeConvert(date) {
				// 计算相对时间
				const now = new Date();
				const diff = now - date; // 时间差（毫秒）
				
				// 转换为秒
				const seconds = Math.floor(diff / 1000);
				
				// 小于1分钟
				if (seconds < 60) {
					return '刚刚';
				}
				
				// 小于1小时
				if (seconds < 3600) {
					return Math.floor(seconds / 60) + '分钟前';
				}
				
				// 小于24小时
				if (seconds < 86400) {
					return Math.floor(seconds / 3600) + '小时前';
				}
				
				// 小于30天
				if (seconds < 2592000) {
					return Math.floor(seconds / 86400) + '天前';
				}
				
				// 小于12个月
				if (seconds < 31536000) {
					return Math.floor(seconds / 2592000) + '个月前';
				}
				
				// 大于等于12个月
				return Math.floor(seconds / 31536000) + '年前';
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
		background-color: #F2F2F2;
		min-height: calc(100vh - 44px); /* 确保最小高度占满屏幕 */
		display: flex;
		flex-direction: column;
	}
	
	.activity-list {
		padding: 20rpx;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end; /* 内容靠下排布 */
	}
	
	.activity-card {
		margin-bottom: 30rpx;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		background-color: #fff;
		transition: all 0.3s;
		
		&:active {
			transform: scale(0.98);
			box-shadow: 0 1rpx 5rpx rgba(0, 0, 0, 0.1);
		}
		
		.card-image {
			width: 100%;
			height: 300rpx;
			overflow: hidden;
			
			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
		
		.card-content {
			padding: 24rpx;
			position: relative;
			
			.message-content {
				font-size: 30rpx;
				color: #333;
				line-height: 1.5;
				margin-bottom: 20rpx;
			}
			
			.message-time {
				font-size: 24rpx;
				color: #999;
				text-align: right;
			}
		}
	}
	
	.nouser {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>