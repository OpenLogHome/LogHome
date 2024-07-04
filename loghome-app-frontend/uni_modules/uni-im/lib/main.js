import utils from '@/uni_modules/uni-im/common/utils.js';
import MsgManager from './MsgManager.js';
import createObservable from './createObservable';

const db = uniCloud.database();
const uniImCo = uniCloud.importObject("uni-im-co", {
	customUI: true
})

function current_uid() {
	return uniCloud.getCurrentUserInfo().uid
}

const state = createObservable({
	// 会话数据
	conversation: {
		dataList: [],
		hasMore: true,
		loading: false // 加锁防止意外重复请求时出错
	},
	// 正在对话的会话id
	currentConversationId: false,
	// 全局响应式心跳，用于更新消息距离当前时长 等
	heartbeat: '',
	// 好友列表
	friend: {
		dataList: [],
		hasMore: true
	},
	// 群列表
	group: {
		dataList: [],
		hasMore: true
	},
	// 系统通知消息
	notification: {
		dataList: [],
		hasMore: true
	},
	//存储所有出现过的用户信息，包括群好友信息
	usersInfo: {},
	//是否为pc宽屏
	isWidescreen: false,
	//系统信息
	systemInfo: {},
	// #ifndef H5
	indexDB: false,
	// #endif
	audioContext: false,
	// sqlite数据库是否已经打开
	dataBaseIsOpen: false,
	// 记录socket连接次数（用于处理，断开重连）
	socketOpenIndex: 0
})

const methods = {
	/**
	 * 会话对象
	 * data:会话对象数据模型（conversationDatas是原始数据，data为经过转化的数据）
	 * loadMore：加载更多数据方法
	 */
	conversation: {
		// 撤回消息，参数： 消息id 会话id ，操作者id
		async revokeMsg({
			msg_id,
			_id,
			conversation_id,
			user_id = false,
			create_time
		}) {
			if (_id) {
				msg_id = _id
			}

			// console.log({
			// 	msg_id,
			// 	conversation_id,
			// 	user_id
			// });
			// console.log('msg_id---',msg_id);

			// userId为操作者id，false表示当前用户操作的。需要广播同步给其他人。收到其他人的撤回指令，会带上触发者的id
			if (!user_id) { // 为空表示当前用户就是操作者
				try {
					let res = await uniImCo.revokeMsg(msg_id)
					// console.log('res', res);
				} catch (err) {
					console.log('err', err);
					return uni.showToast({
						title: err.message,
						icon: 'none'
					});
				}
			}

			let conversation = await this.get(conversation_id)

			// 处理列表显示
			let msgList = conversation.msgList
			let index = msgList.findIndex(item => item._id == msg_id)
			// console.log('index',index);
			if (index != -1) {
				let msg = msgList[index]
				// console.log(111111112222,JSON.stringify(msg));
				msg.is_revoke = true
				msg.body = '[此消息已被撤回]'
				conversation.msgList.splice(index, 1, Object.assign({}, msg))
				// console.log('conversation.msgList', conversation.msgList);
			}

			// 删除本地存储中的数据
			let localMsgs = await conversation.msgManager.localMsg.get({
				"minTime": create_time - 1,
				"maxTime": create_time + 1
			})
			let localMsg = localMsgs.find(item => item._id == msg_id)
			// console.log('res查本地存储中是否有这条消息',localMsgs,localMsg);
			if (localMsg) {
				localMsg.is_revoke = true
				localMsg.body = '[此消息已被撤回]'
				conversation.msgManager.localMsg.update(localMsg.unique_id, localMsg)
			}
		},
		async get(param) {
			/**
			 *  字符串	会话id
			 * 	数组		一组会话id（暂不支持）
			 * 	对象类型	会话对方信息（用于如果本地不存在则需要自动创建的场景），包括：{friend_uid,to_uid,from_uid,group_id,user_info}
			 */
			let conversationId = false
			if (param) {
				if (typeof param == 'object') {
					let {
						friend_uid,
						user_id,
						group_id,
						conversation_id
					} = param
					conversationId = conversation_id
					if (user_id) {
						friend_uid = user_id
						param.friend_uid = user_id
					}
					if (!conversationId) {
						if (!group_id && !friend_uid) {
							console.log('param---------', param);
							throw new Error("会话对象不详，请检查参数", param)
						}
						conversationId = utils.getConversationId(friend_uid || group_id, friend_uid ? 'single' : 'group')
					}
				} else if (typeof param == 'string') {
					conversationId = param
				} else {
					throw new Error("会话对象不详，请检查参数", param)
				}
			}
			let conversationDatas = state.conversation.dataList
			if (conversationId) {
				conversationDatas = conversationDatas.filter(i => i.id == conversationId)
				if (conversationDatas.length == 0) {
					// 本地没有没有就联网查找
					let conversationData = await this.loadMore(conversationId)
					if (conversationData) {
						conversationDatas = [conversationData]
					} else {
						if (param.group_id) {
							throw new Error("未找到此群会话")
						}
						if (typeof param != 'object') {
							console.log('param', param);
							throw new Error("参数错误")
						}
						// 非群会话，网络也没有就本地创建一个
						if (!param.user_info) {
							let res = await uniCloud.database()
								.collection('uni-id-users')
								.doc(param.friend_uid)
								.field('_id,nickname,avatar_file')
								.get()
							console.log('user_info', res)
							param.user_info = res.result.data[0]
							// console.log('param.user_info', param.user_info);
							if (!param.user_info) {
								throw new Error("用户查找失败")
							}
						}
						let conversationData = {
							group_id: param.group_id,
							friend_uid: param.friend_uid,
							unread_count: 0
						}

						try {
							const db = uniCloud.database();
							let res = await db.collection('uni-im-conversation').add(conversationData)
							// console.log('res',res)
						} catch (e) {
							throw new Error(e)
						}

						conversationData = Object.assign(conversationData, {
							user_id: current_uid(),
							id: conversationId,
							user_info: param.user_info,
							type: param.friend_uid ? 1 : 2,
							msgList: [],
							update_time: Date.now()
						})

						this.add(conversationData)
						conversationDatas.push(conversationData)
					}
				}
			}

			// console.log('conversationDatas---',conversationDatas,param);
			// console.log('conversationDatas---',conversationDatas.length,param);

			// console.log('999conversationDatas',conversationDatas,conversationId);
			if (conversationId) {
				let conversationData = conversationDatas[0]

				// 指定获取某个id的群会话时，判断如果群会话的 群成员为空就从云端拉取
				if (conversationData.group_id && Object.keys(conversationData.group_member).length == 0) {
					let res = await db.collection(
							db.collection('uni-im-group-member').where({
								group_id: conversationData.group_id
							}).getTemp(),
							db.collection('uni-id-users').field('_id,nickname,avatar_file').getTemp()
						)
						.limit(1000)
						.get()
					let group_member = {}
					
					res.result.data.forEach(item => {
						let usersInfo = item.user_id[0]
						group_member[usersInfo._id] = usersInfo
					})
					methods.mergeUsersInfo(group_member)
					conversationData.group_member = group_member
					// console.log('conversationData.group_member', conversationData.group_member)
				}

				// console.log('conversationData*-*--*-**-',conversationData)
				// #ifdef APP
				if (!conversationData.isInit) {
					conversationData.msgManager = new MsgManager(conversationData)
				}
				// #endif
				return conversationData
			} else {
				return conversationDatas
			}
		},
		async loadMore(conversation_id) {
			// console.log('loadMore-----','loadMore')
			if (!conversation_id) {
				// console.log('state.conversation.loading',state.conversation.loading)
				//上一次正在调用，下一次不能马上开始
				if (state.conversation.loading) {
					// console.log('加载中')
					return []
				} else {
					state.conversation.loading = true
				}
			}

			let conversationDatas = await this.get()
			let lastConversation = conversationDatas[conversationDatas.length - 1]
			// console.log('conversationDatas.length',conversationDatas.length,lastConversation)
			let maxUpdateTime = lastConversation ? lastConversation.update_time : ''
			if (conversation_id) {
				// 已有会话id的情况下，不设置更新时间条件
				maxUpdateTime = ''
			}
			let res = {
				data: []
			}
			try {
				res = await uniImCo.getConversationList({
					maxUpdateTime,
					limit: 30,
					conversation_id
				})
			} catch (e) {
				console.log(e)
				if (!conversation_id) {
					state.conversation.loading = false
				}
			}

			if (res.data.length) {
				// console.log('getConversationList res', res, {
				// 	maxUpdateTime,
				// 	limit: 30,
				// 	conversation_id
				// });
				this.add(res.data)
			}
			if (!conversation_id) {
				state.conversation.loading = false
				state.conversation.hasMore = (res.data.length == 30)

				/**
				 * 处理云端任务，比如撤回消息等
				 */
				let whereString = "user_id == $cloudEnv_uid"
				let group_ids = res.data.filter(item => item.group_id).map(i => i.group_id) || []
				if (group_ids.length) {
					whereString = `(user_id == $cloudEnv_uid || "group_id" in ${JSON.stringify(group_ids)})`
				}
				let lastTaskTime = uni.getStorageSync('uni-im-lastTaskTime')
				// console.log('lastTaskTime',lastTaskTime);
				if (lastTaskTime) {
					whereString += `&& "create_time" > ${lastTaskTime}`
				}
				db.collection('uni-im-task')
					.where(whereString)
					.orderBy('create_time desc')
					.get()
					.then((e) => {
						// console.log('uni-im-task', e.result.data);
						if (e.result.data.length) {
							e.result.data.forEach(item => {
								if (item.type == "revoke_msg") {
									this.revokeMsg(item.payload)
								}
							})
							uni.setStorageSync('uni-im-lastTaskTime', e.result.data[0].create_time)
						}
					})
					.catch(e => {
						console.error(e);
					})
				return res.data
			} else {
				return res.data[0]
			}
		},
		add(data) {
			if (!Array.isArray(data)) {
				data = [data]
			}
			data.forEach(item => {
				// 服务端联查到的数据，群和用户信息是数组。这里兼容 客户端add时可直接传object
				if (Array.isArray(item.user_info)) {
					item.user_info = item.user_info[0]
				}
				if (Array.isArray(item.group_info)) {
					item.group_info = item.group_info[0]
					if (item.group_id) {
						if (!item.group_member) {
							item.group_member = {}
						}
						if (item.group_info.introduction === undefined) {
							item.group_info.introduction = ''
						}
						if (item.group_info.avatar_file === undefined) {
							item.group_info.avatar_file = {
								url: ""
							}
						}
					}
				}

				// item.chatText = ""
				// item.isInit	= false
				// item.title = ""
				// item.avatar_file = {}

				item = Object.assign(item, {
					isInit: false,
					title: "",
					chatText: "",
					avatar_file: {},
					call_list: []
				})

				if (item.user_info) {
					Object.defineProperties(item, {
						title: {
							get() {
								return item.user_info.nickname
							}
						},
						avatar_file: {
							get() {
								return item.user_info.avatar_file
							}
						},
						group_info: {
							value: false
						}
					})
				} else if (item.group_info) {
					Object.defineProperties(item, {
						title: {
							get() {
								return item.group_info.name
							}
						},
						avatar_file: {
							get() {
								return item.group_info.avatar_file
							}
						},
						user_info: {
							value: false
						}
					})
				} else {
					console.error('会话列表失效，疑似关联用户/群被删除(请改为软删除避免系统异常）：', JSON.stringify(item));
				}

				let update_time = item.update_time
				Object.defineProperties(item, {
					last_msg_note: {
						get() {
							let last_msg_note = "暂无记录"
							let last_msg = item.msgList[item.msgList.length - 1]
							// console.log('---last_msg',last_msg)
							if (item.chatText && state.currentConversationId != item.id) {
								last_msg = {
									body: "[uni-im-draft]" + item.chatText,
									type: 'text',
									create_time: Date.now()
								}
							}
							if (last_msg) {
								last_msg_note = '[多媒体]'
								if (last_msg.type == 'text') {
									last_msg_note = last_msg.body.toString()
									last_msg_note = last_msg_note.replace(/[\r\n]/g, "");
									last_msg_note = last_msg_note.slice(0, 30)
								}
								if (last_msg.is_revoke) {
									last_msg_note = "消息已被撤回"
								}
								if (last_msg.is_delete) {
									last_msg_note = "消息已被删除"
								}
							}
							return last_msg_note
						}
					},
					update_time: {
						get() {
							let last_msg = item.msgList[item.msgList.length - 1]
							if (last_msg) {
								return last_msg.create_time
							} else {
								return update_time
							}
						}
					}
				})

				// 把user_info统一存到一个对象
				let {
					user_info,
					group_member
				} = item
				let usersInfo = {}
				if (user_info) {
					usersInfo[user_info._id] = user_info
				}
				methods.mergeUsersInfo(usersInfo)
				item.msgManager = new MsgManager(item)
				// console.log('state.conversation.dataList',state.conversation.dataList);

				let initMsg = (msgList) => {
					for (let i = 0; i < msgList.length; i++) {
						let msg = msgList[i]
						if (msg && typeof msg == 'object') {
							if (!('is_delete' in msg)) {
								msg.is_delete = false
							}
						}
					}

					let methodsList = ['push', 'unshift']
					// #ifdef VUE2
					let arr_methods = Object.create(Array.prototype);
					methodsList.forEach(methods => {
						arr_methods[methods] = function() {
							// console.log(`使用的是${methods}方法`)
							initMsg(arguments)
							Array.prototype[methods].apply(this, arguments)
						}
					})
					// #endif

					// #ifdef VUE3
					methodsList.forEach(methods => {
						msgList[methods] = function() {
							// console.log(`使用的是${methods}方法`)
							initMsg(arguments)
							Array.prototype[methods].apply(this, arguments)
						}
					});
					// #endif
					return msgList
				}
				initMsg(item.msgList);

				item.msgList.clear = function() {
					// console.log('clear');
					// #ifdef VUE3
					this.length = 0
					// #endif

					// #ifdef VUE2
					item.msgList = []
					initMsg(item.msgList)
					// #endif
				}

				// #ifdef VUE3
				Object.defineProperty(item, 'msgList', {
					writable: false
				})
				// #endif

				// 判断是否存在，再新增。
				if (!state.conversation.dataList.find(conversation => conversation.id == item.id)) {
					state.conversation.dataList.push(item)
				} else {
					// console.log('重复新增已存在的会话', item)
				}
			})

			// console.log('存到storage',state.conversation)
			// 存到storage
			uni.setStorage({
				key: 'uni-im-conversation' + '_uid:' + current_uid(),
				data: state.conversation
			})
			return data
		},
		// 统计所有消息的未读数
		unreadCount() {
			let conversationDatas = state.conversation.dataList
			return conversationDatas.reduce((sum, item, index, array) => sum + item.unread_count, 0)
		},
		remove(id) {
			let index = state.conversation.dataList.findIndex(i => i.id == id)
			state.conversation.dataList.splice(index, 1)
		}
	},
	/**
	 * 系统消息
	 */
	notification: {
		get: ({
			type,
			excludeType
		} = {}) => {
			const notificationDatas = state.notification.dataList
			if (notificationDatas) {
				return notificationDatas.reduce((sum, item) => {
					// 指定需要的类型
					if (type) {
						//兼容字符串和数组
						typeof type == 'string' ? type = [type] : ''
						if (type.includes(item.payload.subType)) {
							sum.push(item)
						}
						// 排查指定的类型
					} else if (excludeType) {
						//兼容字符串和数组
						typeof excludeType == 'string' ? excludeType = [excludeType] : ''
						if (!excludeType.includes(item.payload.subType)) {
							sum.push(item)
						}
					} else {
						sum.push(item)
					}
					return sum
				}, [])
			} else {
				return false
			}
		},
		async loadMore() {
			let res = await db.collection('uni-im-notification')
				.aggregate()
				.match('"payload.type" == "uni-im-notification" && "user_id" == $cloudEnv_uid')
				.sort({
					create_time: -1
				})
				.limit(1000)
				.end()
			this.add(res.result.data)
			this.hasMore == (res.result.data.length != 0)
		},
		add(datas) {
			if (!Array.isArray(datas)) {
				datas = [datas]
			}

			let notificationDatas = datas.concat(state.notification.dataList)
			// 正序，实现时间大的覆盖时间小的
			notificationDatas.sort((a, b) => a.create_time - b.create_time)
			// console.log('notificationDatas',notificationDatas);
			let obj = {}
			for (var i = 0; i < notificationDatas.length; i++) {
				let item = notificationDatas[i]
				// 去重操作
				let {
					subType,
					unique
				} = item.payload
				obj[unique ? (subType + "_" + unique) : (Date.now() + "_" + i)] = item
			}
			let dataList = []
			for (let key in obj) {
				let item = obj[key]
				dataList.push(item)
			}
			// 倒序 实现，最新的消息在最上面
			dataList.sort((a, b) => b.create_time - a.create_time)
			// console.log('dataList',dataList)
			state.notification.dataList = dataList
		},
		unreadCount(param = {}) {
			let notificationDatas = this.get(param)
			let unreadCount = notificationDatas.reduce((sum, item, index, array) => {
				if (!item.is_read) {
					sum++
				}
				return sum
			}, 0)

			// console.log('最新的未读数:', unreadCount, data);
			// 注意：在非tabbar页面无法设置 badge
			// if (unreadCount === 0) {
			// 	uni.removeTabBarBadge({
			// 		index: 2,
			// 		complete: (e) => {
			// 			// console.log(e)
			// 		}
			// 	})
			// } else {
			// 	uni.setTabBarBadge({
			// 		index: 2,
			// 		text: unreadCount + '',
			// 		complete: (e) => {
			// 			// console.log(e)
			// 		}
			// 	})
			// }
			
			if (unreadCount) {
				return unreadCount + ''
			} else {
				return ''
			}
		}
	},
	friend: {
		get() {
			return state.friend.dataList
		},
		async loadMore({
			friend_uid
		} = {}) {
			let whereString = '"user_id" == $cloudEnv_uid'
			if (friend_uid) {
				whereString += `&& "friend_uid" == "${friend_uid}"`
				// console.log('whereString',whereString);
			}
			let res = await db.collection(
					db.collection('uni-im-friend').where(whereString).field('friend_uid,mark,class_name')
					.getTemp(),
					db.collection('uni-id-users').field('_id,nickname,avatar_file').getTemp()
				)
				.limit(500)
				.get()
			let data = res.result.data
			// console.log('data',data);
			data.forEach((item, index) => {
				data[index] = item.friend_uid[0]
				let uid = data[index]._id
				if (!state.usersInfo[uid]) {
					state.usersInfo[uid] = item.friend_uid[0]
				}
			})
			state.friend.hasMore = data.length == 500
			state.friend.dataList.push(...data)
		},
		remove(friend_uid) {
			let friendList = state.friend.dataList
			let index = friendList.findIndex(i => i._id == friend_uid)
			friendList.splice(index, 1)
		}
	},
	group: {
		get() {
			return state.group.dataList
		},
		async loadMore({
			group_id
		} = {}) {
			let whereString = '"user_id" == $cloudEnv_uid '
			if (group_id) {
				whereString += `&& "group_id" == "${group_id}"`
			}
			// console.log('whereString',whereString)
			let res = await db.collection(
					db.collection('uni-im-group-member').where(whereString).getTemp(),
					db.collection('uni-im-group').getTemp()
				)
				.limit(500)
				.get()
			res.result.data.map(item => {
				item.group_info = item.group_id[0]
				delete item.group_id
				return item
			})
			// 过滤掉已经被删除的群
			res.result.data = res.result.data.filter(item=>item.group_info)
			
			state.group.hasMore = res.result.data.length == 500
			if (group_id) {
				state.group.dataList.push(...res.result.data)
			} else {
				state.group.dataList = res.result.data
			}
		},
		remove({
			group_id
		}) {
			let groupList = state.group.dataList
			let index = groupList.findIndex(i => i.group_info._id == group_id)
			// console.log('index',group_id,index,groupList)
			if (index != -1) {
				groupList.splice(index, 1)
				// console.log('state.group.dataList',state.group.dataList)
			}
		},
	},
	mergeUsersInfo(usersInfo) {
		state.usersInfo = Object.assign({}, state.usersInfo, usersInfo)
	},
	async clearUnreadCount(conversation_id) {
		let conversation = await this.conversation.get(conversation_id)
		setTimeout(function() {
			conversation.unread_count = 0
		}, 10);
		// 触发器会触发消息表的 is_read = true
		uniCloud.database()
			.collection('uni-im-conversation')
			.where({
				user_id: current_uid(),
				id: conversation_id
			})
			.update({
				"unread_count": 0
			}).then(e => {
				console.log('设置为已读', e.result.updated);
			})
	}
}

const mapState = function(keys = []) {
	let obj = {}
	keys.forEach((key) => {
		let keyName = key,
			keyCName = false
		if (key.includes(' as ')) {
			let _key = key.trim().split(' as ')
			keyName = _key[0]
			keyCName = _key[1]
		}
		obj[keyCName || keyName] = function() {
			return state[keyName]
		}
	})
	return obj
}

export default deepAssign(state, methods, {
	mapState
})



/**
 *深度合并多个对象的方法
 */
function deepAssign() {
	let len = arguments.length,
		target = arguments[0]
	if (!isPlainObject(target)) {
		target = {}
	}
	for (let i = 1; i < len; i++) {
		let source = arguments[i]
		if (isPlainObject(source)) {
			for (let s in source) {
				if (s === '__proto__' || target === source[s]) {
					continue
				}
				if (isPlainObject(source[s])) {
					target[s] = deepAssign(target[s], source[s])
				} else {
					target[s] = source[s]
				}
			}
		}
	}
	return target
}
/**
 *判断对象是否是一个纯粹的对象
 */
function isPlainObject(obj) {
	return typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]'
}