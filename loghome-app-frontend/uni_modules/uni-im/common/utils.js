// #ifdef VUE2
import Vue from 'vue'
// #endif

import md5 from '@/uni_modules/uni-im/common/md5'
import toFriendlyTime from '@/uni_modules/uni-im/common/toFriendlyTime.js';
import appEvent from '@/uni_modules/uni-im/common/appEvent.js';
import {
	store as uniIdStore,
	mutations as uniIdMutations
} from '@/uni_modules/uni-id-pages/common/store.js';
import uniIm from '@/uni_modules/uni-im/lib/main.js';

// #ifdef H5
import initIndexDB from '@/uni_modules/uni-im/common/initIndexDB.js';
initIndexDB(event => {
	// console.log('event.target.result',event.target.result);
	uniIm.indexDB = event.target.result
})
// #endif

// #ifdef APP
import sqlite from '@/uni_modules/uni-im/common/sqlite.js';
sqlite.init()
// #endif

const uniIdCo = uniCloud.importObject("uni-id-co", {
	customUI: true
})
const db = uniCloud.database();
let appIsShow = true;
let getCloudMsgIng = false
let socketIsClose = true
export default {
	init() {
		// #ifdef APP
		getApp().globalData.sqlite = sqlite
		// #endif
		
		uniIm.socketOpenIndex = 0
		uni.onSocketClose(function(res) {
			socketIsClose = true
			console.log('WebSocket 已关闭！');
		});
		uni.onSocketOpen(function(res) {
			console.log('WebSocket连接已打开！');
			socketIsClose = false
			// 记录socket连接次数
			uniIm.socketOpenIndex++
			if (uniIm.socketOpenIndex > 1) {
				// 获取socket断开后丢失的数据
				getCloudMsg()
			}
		});
		
		appEvent.onAppShow(async () => {
			// 获取socket断开后丢失的数据
			getCloudMsg()
		})
		
		// 获得云端数据，适用于：socket突然断开丢失，或者应用iOS切到后台拿不到透传等场景使用 获取丢失的数据
		function getCloudMsg(){
			if(getCloudMsgIng){
				return // 防止重复发起，比如即被切换到后台，socket又断开的场景
			}
			getCloudMsgIng = true
			// 下一个事件循环执行
			setTimeout(async () => {
				// 根据本地会话的最大更新时间，查询云端数据
				let maxConversation = (await uniIm.conversation.get())[0]
				// console.log({maxConversation});
				if (!maxConversation) {
					getCloudMsgIng = false
					return
				}
				let res = await db.collection('uni-im-msg')
					.where({
						to_uid: uniCloud.getCurrentUserInfo().uid,
						create_time: db.command.gt(maxConversation.update_time)
					})
					.get()
				console.log('getCloudMsg res',maxConversation.update_time,res.result.data);
				let clodMsgData = {}
				res.result.data.forEach(item => {
					if (clodMsgData[item.conversation_id]) {
						clodMsgData[item.conversation_id].push(item)
					} else {
						clodMsgData[item.conversation_id] = [item]
					}
				})
			
				for (let conversation_id in clodMsgData) {
					let conversation = await uniIm.conversation.get(conversation_id)
					let msg = clodMsgData[conversation_id]
					if (msg.length) {
						conversation.msgList.push(...msg)
						conversation.msgManager.localMsg.add(msg)
						conversation.unread_count += msg.length
					}
				}
				getCloudMsgIng = false
				// console.log('获取切到后台后socket离线丢失的数据 res',data);
			},0);
		}

		//监听im消息
		this.listenImMsg()

		//时间戳心跳（定时器）用于刷新：消息或会话与当前的时间差
		setInterval(() => {
			uniIm.heartbeat = Date.now()
		}, 1000)

		// 监听窗口变化
		// #ifdef H5
		window.addEventListener('resize', () => {
			setIsWidescreen()
		})

		function setIsWidescreen() {
			let oldState = uniIm.isWidescreen
			uniIm.isWidescreen = window.innerWidth > 960
			if (oldState == false && uniIm.isWidescreen == true) {
				// if (!window.location.href.includes('/uni_modules/uni-im/pages/index/index')) {
				// 	console.log('uni-im检测到窗口由小屏切为大屏。')
				// 	uni.showModal({
				// 		content: '检测到你的窗口已改成pc模式，是否切换显示模式',
				// 		cancelText: "不用了",
				// 		confirmText: "立即切换",
				// 		complete(e) {
				// 			if (e.confirm) {
				// 				uni.switchTab({
				// 					url: "/uni_modules/uni-im/pages/index/index",
				// 					success() {
				// 						window.location.reload()
				// 					}
				// 				})
				// 			}
				// 		}
				// 	});
				// }
			}
		}
		setIsWidescreen()
		// #endif

		const audioContext = uni.createInnerAudioContext()
		let _audioContext = {}
		Object.defineProperty(_audioContext,'src',{
			set(url) {
				audioContext.src = url
			},
			get() {
				return audioContext.src
			}
		})
		uniIm.audioContext = new Proxy(_audioContext,{
			get(target,propKey,receiver){
				return audioContext[propKey]
			}
		})
		
		uniIm.systemInfo = uni.getSystemInfoSync()

		// 初始化uniIm依赖的全局变量
		function initData() {
			uniIm.conversation.dataList = []
			
			// let storageConversation = uni.getStorageSync('uni-im-conversation' + '_uid:' + uniCloud.getCurrentUserInfo().uid)
			// if(storageConversation && storageConversation.dataList.length){
			// 	uniIm.conversation.add(storageConversation.dataList)
			// }

			uniIm.notification.dataList = []
			uniIm.notification.loadMore()

			uniIm.friend.dataList = []
			uniIm.friend.loadMore()

			uniIm.group.dataList = []
			uniIm.group.loadMore()

			let userInfo = {}
			userInfo[uniIdStore.userInfo._id] = uniIdStore.userInfo
			uniIm.mergeUsersInfo(userInfo)
		}
		// 如果已经登录就直接初始化数据
		if (uniCloud.getCurrentUserInfo().tokenExpired > Date.now()) {
			setTimeout(initData, 0)
		}
		// 登录成功后 初始化数据
		uni.$on('uni-id-pages-login-success', async () => {
			initData()
		})

		uni.onPushMessage(async res => {
			if (res.data.payload.type == 'uni-im-notification') {
				console.log('uni-im-notification-res.data', res.data);
				res.data.create_time = Date.now()
				if (typeof res.data.is_read == 'undefined') {
					res.data.is_read = false
				}
				console.log('res.data notification.add', res.data)
				res.data._id = res.data.payload.notificationId
				const notificationData = res.data
				delete res.data.payload.notificationId
				delete res.data.unipush_version
				uniIm.notification.add(res.data)
			}
		});

		// 通过拦截器监听路由变化，解决在非tabbar页面，无法设置TabBarBadge的问题
		['navigateTo', 'redirectTo', 'reLaunch', 'switchTab', 'navigateBack'].forEach((item) => {
			uni.addInterceptor(item, {
				success: event => {
					// 更新底部选项卡角标值
					updateTabBarBadge()
				}
			})
		})
		
		// #ifdef MP-WEIXIN
		// 微信的隐式API 监听路由变化
		wx.onAppRoute((res) => {
		   // console.log('跳转', res)
		   // 更新底部选项卡角标值
		   updateTabBarBadge()
		})
		// #endif
		
		// 更新底部选项卡角标值
		function updateTabBarBadge(){
			// setTimeout(() => {
			// 	// console.log('updateTabBarBadge');
			// 	/**
			// 	 * 默认每次路由发生变化都会更新updateTabBarBadge的值
			// 	 * 你可以根据自己的项目情况优化，比如首页就是tabbar的可以判断getCurrentPages().length 的长度决定是否继续
			// 	 */
				
			// 	let unread_count = uniIm.notification.unreadCount()
			// 	// console.log({unread_count});
			// 	set(2,unread_count)
				
			// 	// 获取未读会话消息总数
			// 	unread_count = uniIm.conversation.unreadCount()
			// 	// console.log({unread_count});
			// 	set(0,unread_count)
				
			// 	// 设置底部选项卡角标值
			// 	function set(index,number){
			// 		if (number == 0) {
			// 			uni.removeTabBarBadge({
			// 				index,
			// 				complete: (e) => {
			// 					// console.log(e)
			// 				}
			// 			})
			// 		} else {
			// 			uni.setTabBarBadge({
			// 				index,
			// 				text: number + '',
			// 				complete: (e) => {
			// 					// console.log(e)
			// 				}
			// 			})
			// 		}
			// 	}
			// }, 300);
		}

		uni.$on('uni-id-pages-logout', () => {
			uniIm.conversation.dataList = []
			uniIm.conversation.hasMore = true

			uniIm.notification.dataList = []
			uniIm.notification.hasMore = true

			uniIm.friend.dataList = []
			uniIm.friend.hasMore = true

			uniIm.group.dataList = []
			uniIm.group.hasMore = true

			uniIm.currentConversationId = false
		})

		// #ifdef H5
		uni.addInterceptor('switchTab', {
			invoke: (e) => {
				if (e.url.includes('/uni_modules/uni-im/pages/index/index')) {
					if (uniIm.matches) {
						let param = getUrlParam(e.url)
						// console.log('param----',param);
						uni.$emit('uni-im-toChat', param)
					}
				}
			}
		})

		function getUrlParam(url) {
			let u = url.split("?");
			if (typeof(u[1]) == "string") {
				u = u[1].split("&");
				let get = {};
				for (let i in u) {
					let j = u[i].split("=");
					get[j[0]] = j[1];
				}
				return get;
			} else {
				return {};
			}
		};
		// #endif


		appEvent.onAppHide(async () => {
			appIsShow = false
		})
		appEvent.onAppShow(async () => {
			appIsShow = true
			// #ifdef APP
			//清理系统通知栏消息和app角标
			this.clearPushNotify()
			// #endif
		})
	},
	getConversationId(id, type = 'single') { //single,group
		if (type == 'single') {
			let current_uid = uniCloud.getCurrentUserInfo().uid
			if (!current_uid) {
				console.error('错误current_uid不能为空', current_uid);
			}
			let param = [id, current_uid]
			return 'single_' + md5(param.sort().toString())
		} else {
			return 'group_' + id
		}
	},
	messagecb: undefined,
	getMessageCb(cb) {
		this.messagecb = cb;
	},
	listenImMsg() {
		uni.onPushMessage(async res => {
			console.log('收到消息', res);
			// console.log('收到消息 onPushMessage===================',res.type, res.data,uniIm.currentConversationId );
			const {
				payload
			} = res.data
			if (payload.type == "uni-im") {
				const msg = payload.data
				// console.log({msg});
				// 超长文本传输时的id
				if (msg.LongMsg) {
					const db = uniCloud.database();
					let res = await db.collection('uni-im-msg')
						.where({
							"_id": msg._id,
							"conversation_id": msg.conversation_id // conversation_id 必传否则会被触发器拦截
						})
						.get()
					// console.log(res);
					if (res.result.code == 0) {
						payload.data.body = res.result.data[0].body
					} else {
						console.error('超长文本类型消息查库失败', msg._id);
					}
				}
				// console.log('payload------', payload.device_id, uni.getSystemInfoSync().deviceId);
				if (payload.device_id == uni.getSystemInfoSync().deviceId) {
					if(this.messagecb) this.messagecb(res);
					return console.log('当前设备发的消息，不用接收；忽略');
				}

				if (res.type == 'receive') {
					// console.log(777);
					const {
						conversation_id,
						group_id
					} = msg
					// console.log('msgmsgmsgmsgmsg.msg',msg);
					
					// #ifdef APP
					let currentPages = getCurrentPages()
					let topViewRoute = currentPages[currentPages.length - 1].route
					// console.log('topViewRoute',topViewRoute);
					let pathList = [
						'uni_modules/uni-im/pages/chat/chat',
						'uni_modules/uni-im/pages/index/index',
						'uni_modules/uni-im/pages/userList/userList',
						'uni_modules/uni-im/pages/contacts/contacts'
					]
					if (!appIsShow || !pathList.includes(topViewRoute)) {
						// console.log('payload',payload);
						let {
							content,
							data,
							title,
							avatar_file
						} = payload
						let url = avatar_file ? avatar_file.url : ''
						let icon = '_www/uni_modules/uni-im/static/avatarUrl.png'
						//安卓才有头像功能，再执行下载
						if (uni.getSystemInfoSync().platform == "android") {
							if (avatar_file) {
								let downloadFileRes = await uni.downloadFile({
									url: avatar_file.url
								});
								icon = downloadFileRes[1]?.tempFilePath
							}
						}
						plus.push.createMessage(content, payload, {
							title,
							icon
						})
					} else if (conversation_id != uniIm.currentConversationId) {
						// uni.showToast({
						// 	title: '收到新消息请注意查看',
						// 	icon: 'none'
						// });
					}
					// #endif
					let conversation = await uniIm.conversation.get(conversation_id)
					let msgList = conversation.msgList
					/**
					 * 排除会话中已包含此消息的情况
					 */
					let lastMsg = [...msgList].pop()
					if(lastMsg && lastMsg._id != msg._id){
						msgList.push(msg)
						conversation.unread_count++
					}
					// 如果socket已经关闭的情况下收到消息，说明消息来源浏览器页签之间通讯 不需要重复存库
					if(!socketIsClose){
						conversation.msgManager.localMsg.add(msg)
					}
					// console.log(29292929,msg)
					//限制群聊才有回复提示
					if (msg.group_id && msg.about_msg_id) {
						let current_uid = uniCloud.getCurrentUserInfo().uid
						let aboutMsg = msgList.find(i => i._id == msg.about_msg_id)
						if(aboutMsg && aboutMsg.from_uid == current_uid){
							conversation.call_list.push(msg._id)
							console.log('conversation.call_list', conversation.call_list);
						}
					}

					// console.log({
					// 	conversation_id,
					// 	action:'push',
					// 	data:msg
					// });

					if (msg.action == "join-group-notice") {
						console.log('"join-group-notice"', msg);
						let conversation = await uniIm.conversation.get(msg.conversation_id)
						console.log('"join-group-notice"conversation', conversation);
						if (conversation) {
							let userList = msg.body.user_list
							if (userList && Object.keys(conversation.group_member)) {
								for (let i = 0; i < userList.length; i++) {
									// #ifdef VUE3
									conversation.group_member[userList[i]._id] = userList[i]
									// #endif

									// #ifdef VUE2
									Vue.set(conversation.group_member, userList[i]._id, userList[i])
									// #endif
								}
								console.log('add user to group_member', conversation.group_member)
							}
							// 记录用户数据到内存
							// console.log('conversation.group_member',conversation.group_member);
							uniIm.mergeUsersInfo(conversation.group_member)

							// 如果我的群列表没有这个群，则加上
							let hasIsGroup = uniIm.group.dataList.find(i => i.group_info._id == group_id)
							if (!hasIsGroup) {
								await uniIm.group.loadMore({
									group_id
								})
							}
						}
					}


				} else {
					let currentPages = getCurrentPages()
					let topViewRoute = currentPages[currentPages.length - 1].route
					// console.log('topViewRoute',topViewRoute);
					if (topViewRoute == 'uni_modules/uni-im/pages/chat/chat') {
						uni.redirectTo({
							url: '/uni_modules/uni-im/pages/chat/chat?conversation_id=' + msg.conversation_id,
							complete(e) {
								console.log(e);
							}
						})
					} else {
						uni.navigateTo({
							url: '/uni_modules/uni-im/pages/chat/chat?conversation_id=' + msg.conversation_id,
							complete(e) {
								console.log(e);
							}
						})
					}
				}
			} else if (payload.type == "uni-im-group-exit" || payload.type == "uni-im-group-expel" ||
				payload.subType == 'uni-im-group-expel') {
				// 用户退群
				// 群聊天记录加上 xxx 退群
				let {
					timestamp,
					group_id
				} = payload.data
				let conversation_id = 'group_' + group_id

				let noticeBody = res.data.content
				let conversation = await uniIm.conversation.get(conversation_id)
				let msg = {
					conversation_id,
					group_id,
					client_create_time: Date.now(),
					create_time: Date.now(),
					type: 'system',
					body: noticeBody
				}
				conversation.msgList.push(msg)
				// 如果socket已经关闭的情况下收到消息，说明消息来源浏览器页签之间通讯 不需要重复存库
				if(!socketIsClose){
					conversation.msgManager.localMsg.add(msg)
				}

				// 如果是当前用户退群，就将群会话从列表移除
				if (payload.data.user_id == uniCloud.getCurrentUserInfo().uid) {
					let currentConversationId = uniIm.currentConversationId
					//如果已经打开此群聊，或在此群聊的设置页面
					let topPageInfo = getTopPageInfo()

					// #ifdef VUE2
					let {
						route,
						options
					} = topPageInfo
					// #endif

					// #ifdef VUE3
					let {
						route,
						options
					} = topPageInfo.$page
					// #endif
					if (route == "uni_modules/uni-im/pages/group/info") {
						currentConversationId = options.conversation_id
					}
					if (currentConversationId == ('group_' + payload.data.group_id)) {
						uni.navigateBack({
							delta: 2
						})
					}
					setTimeout(() => {
						uniIm.conversation.remove(conversation_id)
						uniIm.group.remove({
							group_id: payload.data.group_id
						})
					}, 1000);
				} else {
					let data = await uniIm.conversation.get(conversation_id)
					// console.error(11111,data)
					// #ifdef VUE3
					delete data.group_member[payload.data.user_id]
					// #endif

					// #ifdef VUE2
					Vue.delete(data.group_member, payload.data.user_id)
					// #endif
				}
			} else if (payload.type == "uni-im-group-join-request") {
				console.log('有用户申请加入群聊');
				// uni.showToast({
				// 	title: '有用户申请加入群聊',
				// 	icon: 'none'
				// });
			} else if (payload.type == "uni-im-notification" && payload.subType ==
				'uni-im-group-cancellation') {
				// 群解散
				let {
					group_id
				} = payload.data
				let conversationId = 'group_' + group_id
				//如果已经打开此群聊，或在此群聊的设置页面
				let currentConversationId = uniIm.currentConversationId
				//如果已经打开此群聊，或在此群聊的设置页面
				let topPageInfo = getTopPageInfo()

				// #ifdef VUE2
				let {
					route,
					options
				} = topPageInfo
				// #endif

				// #ifdef VUE3
				let {
					route,
					options
				} = topPageInfo.$page
				// #endif

				if (route == "uni_modules/uni-im/pages/group/info") {
					currentConversationId = options.conversation_id
				}
				if (currentConversationId == conversationId) {
					uni.navigateBack({
						delta: 2
					})
				}
				setTimeout(() => {
					uniIm.conversation.remove(conversationId)
					uniIm.group.remove({
						group_id
					})
				}, 1000);
			} else if (payload.type == "uni-im-notification" && payload.subType == "uni-im-friend-add") {
				// console.log('加好友的申请通过');
				let {
					from_uid,
					to_uid
				} = payload.data;
				let friend_uid = from_uid == uniCloud.getCurrentUserInfo().uid ? to_uid : from_uid
				await uniIm.conversation.get({
					friend_uid
				})
				uniIm.friend.loadMore({
					friend_uid
				})

			} else if (payload.type == "uni-im-notification" && payload.subType == "uni-im-friend-delete") {
				let {
					from_uid,
					to_uid
				} = payload.data;
				let friend_uid = from_uid == uniCloud.getCurrentUserInfo().uid ? to_uid : from_uid
				uniIm.conversation.remove(payload.data.conversationId)
				uniIm.friend.remove(friend_uid)
			} else if (payload.type == "uni-im-revoke-msg") {
				let conversation = await uniIm.conversation.revokeMsg(payload.data)
				uni.setStorageSync('uni-im-lastTaskTime', payload.data.taskCreateTime)
			}
		})
	},
	toFriendlyTime(timestamp) {
		// 加上一个*0的数,用于刷新视图中的时间 并无运算意义
		if (timestamp - Date.now() < 3600 * 1000 * 2) {
			timestamp += uniIm.heartbeat * 0
		}
		if (!timestamp) {
			return '';
		}
		// return timestamp

		return toFriendlyTime(timestamp)
	},
	// #ifdef APP
	clearPushNotify() {
		plus.push.clear()
		plus.runtime.setBadgeNumber(0)
	},
	// #endif
	async login({
		token,
		tokenExpired
	}) {
		uni.setStorage({
			key: "uni_id_token_expired",
			data: tokenExpired
		})
		uni.setStorage({
			key: "uni_id_token",
			data: token
		})

		uni.getPushClientId({
			success: async function(e) {
				// console.log(e)
				let pushClientId = e.cid
				// console.log(pushClientId);
				let res = await uniIdCo.setPushCid({
					pushClientId
				})
				// console.log('getPushClientId', res);
			},
			fail(e) {
				console.log(e)
			}
		})
		await uniIdMutations.updateUserInfo()
		uni.$emit('uni-id-pages-login-success')
	}
}

function getTopPageInfo() {
	let pages = getCurrentPages();
	return pages[pages.length - 1];
}