<template>
	<view class="outer">
		<lgd-tab class="tab" :firstTab="firstTab" :tabValue="tabValue" @getIndex="changeTab" textColor="#2d2d2d"
			:tabBadge="tabBadge" ref="tabs" />
		<div class="list" v-show="curTabIndex == 0">
			<div class="users" v-for="item in shownMessages" v-show="item.message_type == 'notification'">
				<navigator class="avators" :url="'../users/personalPage?id='+item.from_id">
					<img :src="item.avatar_url" alt="" onerror="onerror=null;src='../static/user/defaultAvatar.jpg'">
				</navigator>
				<navigator class="users" :url="item.router ? '../' + item.router : './'">
					<div class="personInfo">
						<div class="name">{{item.name}}</div>
						<div class="time">{{utc2beijing(item.time)}}</div>
						<div class="motto">{{item.message_content}}</div>
					</div>
				</navigator>
			</div>
		</div>
		<contacts v-show="curTabIndex == 1"></contacts>
	</view>
</template>

<script>
	import contacts from "../../uni_modules/uni-im/pages/index/index.nvue";
	import axios from 'axios'
	export default {
		components: {
			contacts
		},
		data() {
			return {
				id: -1,
				user: {},
				isMe: false,
				curTabIndex: 0,
				follows: [],
				messages: [],
				tabBadge: [false, false],
				shownMessages: [],
				page: 0,
				pageDOM: undefined,
				firstTab: 0,
				tabValue: [
					"通知消息", "私信"
				],
			}
		},
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url: './send_mail'
			});
		},
		onLoad() {
			let _this = this;
		},
		onShow() {
			this.refreshMessages();
		},
		methods: {
			refreshMessages() {
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if (tk) tk = tk.tk;;
				let _this = this;
				if (tk == null) {
					uni.navigateTo({
						url: './users/login?msg=' + 'unAuthorized'
					});
					return;
				}
				//验活
				axios.get(this.$baseUrl + '/users/userprofile', {
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					_this.user = JSON.parse(JSON.stringify(res.data));
					axios.get(this.$baseUrl + '/users/get_history_message', {
						headers: {
							'Content-Type': 'application/json', //设置请求头请求格式为JSON
							'Authorization': tk //设置token 其中K名要和后端协调好
						}
					}).then((res) => {
						window.localStorage.setItem('messages', JSON.stringify(res.data));
						let messages = JSON.parse(window.localStorage.getItem('messages'));
						let myMessage = [];
						//设置所有消息为已读
						for (let i = 0; i < messages.length; i++) {
							if (messages[i].to_id == _this.user.user_id) {
								if(messages[i].is_read == 0){
									messages[i].is_read = 1;
									if(messages[i].message_type == 'im'){
										console.log("true");
										_this.tabBadge[1] = true;
									}
								}
								myMessage.push(messages[i])
							}
						}
						_this.messages = myMessage;
						_this.shownMessages = _this.messages.splice(0, 100);
						window.localStorage.setItem("messages", JSON.stringify(_this.shownMessages));
						uni.hideTabBarRedDot({
							index: 3
						})
					});
				}).catch(function(error) {
					if (error.message == "Request failed with status code 401") {
						window.localStorage.removeItem('token');
						uni.navigateTo({
							url: './users/login'
						});
					} else if (error.name == "SyntaxError") {
						uni.showModal({
							title: '异常提示',
							content: '发生异常，我们已为您修复，相关信息将复制到您的剪贴板，建议您反馈到“意见反馈”栏目。',
							success(res) {
								uni.setClipboardData({
									data: window.localStorage.getItem('messages'),
									success: function() {
										console.log('success');
									}
								})
								window.localStorage.removeItem('messages')
							}
						});
					}
				})
			},
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
				return beijing_datetime; // 2017-03-31 16:02:06
			},
			changeTab(index) {
				this.curTabIndex = index;
				if (index == 1) {
					
				} else {
					this.refreshMessages();
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.outer {
		background-color: #ffffff;
	}

	.users {
		width: 100vw;
		display: flex;
		position: relative;

		img {
			height: 100rpx;
			border: #cacaca 1rpx solid;
			border-radius: 7rpx;
			margin: 15rpx;
		}

		.personInfo {
			position: relative;
			border-bottom: #cacaca solid 1px;

			.time {
				font-size: 30rpx;
				position: absolute;
				right: 15rpx;
				top: 20rpx;
			}
		}

		.name {
			margin-top: 20rpx;
			font-size: 32rpx;
			height: 40rpx;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			color: rgb(180, 111, 88);
		}

		.motto {
			color: rgb(97, 97, 97);
			width: 80vw;
			margin-top: 8rpx;
			font-size: 28rpx;
			margin-bottom: 10rpx;
		}

		.button {
			position: absolute;
			right: 30rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>