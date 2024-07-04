// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
const db = uniCloud.database();
module.exports = {
	trigger: {
		async beforeRead({
			where,
			userInfo
		}) {
			if (where.user_id != userInfo.uid) {
				if (where.group_id) {
					let res = await db.collection('uni-im-group-member')
						.where({
							group_id: where.group_id,
							user_id: userInfo.uid
						})
						.get()
					console.log(res);
					if (res.data.length === 0) {
						throw new Error('不是群成员，不能查询')
					}
				}
			}
		},
		async afterCreate({
			addDataList: [addData],
			clientInfo
		}) {
			// 仅管理员可操作

			// console.log('addData', addData);
			let {
				group_id,
				user_id
			} = addData

			// 1. 群是否存在
			let res = await db.collection('uni-im-group').doc(group_id).get()
			if (res.data.length == 0) {
				throw new Error('非法群id')
			}
			// console.log('res.data', res.data);
			const groupInfo = res.data[0]

			res = await db.collection('uni-im-conversation').add({
				group_id,
				id: 'group_' + group_id,
				user_id,
				type: 2,
				unread_count: 0,
				update_time: Date.now()
			})
			// console.log('add uni-im-conversation:', res);

			const uniImCo = uniCloud.importObject("uni-im-co")
			
			const dbJQL = uniCloud.databaseForJQL({
				clientInfo
			})

			//推送时带上userInfo节省客户端查库
			let {
				data: [userInfo]
			} = await dbJQL.collection('uni-id-users')
				.doc(user_id)
				.field('_id,nickname,avatar_file')
				.get()
			// 通知用户
			let title = "新用户加群通知",
				content = "新用户加群通知",
				pushParam = {
					payload: {
						"type": "uni-im",
						"data": {
							type: "system",
							action: "join-group-notice",
							from_uid: "system",
							//是否已读，默认为：false
							is_read: false,
							//创建时间
							create_time: Date.now(),
							conversation_id: "group_" + group_id,
							group_id,
							body: {
								user_list: [userInfo]
							}
						},
						title, // "收到im消息，在线时显示的标题",
						content, // "在线时显示的副标题",
					},
					title, // "收到im消息，离线时显示的标题",
					content //"离线时显示的内容"
				}
			
			//发消息通知所有群成员，有用户申请加入群聊
			res = await uniImCo.sendMsgToGroup({
				pushParam,
				appId:clientInfo.appId
			})
			// console.log(8989989, res);
		},
		async beforeDelete({
			where,
			userInfo,
			triggerContext
		}) {
			console.log('where---', where);
			let {
				group_id,
				user_id
			} = where

			//查群相关信息
			let res = await db.collection('uni-im-group').doc(group_id).get()
			
			if(!triggerContext){
				throw new Error('执行删除群失败！你的HBuilderX版本过低，请使用3.6.16及以上版本')
			}
			triggerContext.groupInfo = res.data[0]
			
			console.log(res.data[0]);
			console.log(res.data[0].user_id);

			if (
				!(res.data[0].user_id == userInfo.uid || userInfo.uid == user_id)
			) {
				throw Error('限群主和自己操作退群')
			}

			console.log(res.data, {
				group_id,
				user_id: user_id
			});
			if (res.data[0].user_id == user_id) {
				throw Error('群主不能退群')
			}
		},
		async afterDelete({
			where,
			userInfo,
			clientInfo,
			triggerContext
		}) {
			console.error('2 where---', where);
			let {
				group_id,
				user_id
			} = where

			// 删除相关会话数据
			let res = await db.collection('uni-im-conversation').where({
				group_id,
				user_id
			}).remove()
			console.error('Delete uni-im-conversation:', res, where);
			const dbJQL = uniCloud.databaseForJQL({
				clientInfo
			})
			let {
				data: [currentUserInfo]
			} = await dbJQL.collection('uni-id-users')
				.doc(user_id)
				.field('_id,nickname,avatar_file')
				.get()

			let title, content, type;
			//自己操作的是 主动退出的 否则是被踢掉的
			if (userInfo.uid == user_id) {
				title = '用户退群通知'
				content = currentUserInfo.nickname + ' 已退出群聊'
				type = "uni-im-group-exit"
			} else {
				title = '用户被踢出群聊通知'
				content = currentUserInfo.nickname + ' 已被踢出群聊'
				type = "uni-im-group-expel"
			}
			let pushParam = {
				payload: {
					data: {
						user_id,
						group_id,
						timestamp: Date.now()
					},
					type
				},
				title, // "收到im消息，离线时显示的标题",
				content, //"离线时显示的内容"
			}
			console.error(123, pushParam);
			const uniImCo = uniCloud.importObject("uni-im-co")
			//通知所有群成员，有用户退群
			res = await uniImCo.sendMsgToGroup({
				pushParam,
				appId:clientInfo.appId
			})

			//通知 被出群的用户(此时他已经不是群成员，收不到sendMsgToGroup的通知)
			pushParam.content = (userInfo.uid == user_id ? '你已退出"':'你已被踢出"') + triggerContext.groupInfo.name +'"群'
			pushParam.user_id = user_id
			pushParam.payload.type = "uni-im-notification" // im消息通知，比如加好友请求，有用户退群等
			pushParam.payload.subType = "uni-im-group-expel" // 通知子类型（可选）
			pushParam.payload.state = false // 是否已经处理过 false 未处理，confirm：已确认，cancel：已拒绝（可选）
			pushParam.payload.unique = user_id + '_' + group_id
			res = await uniImCo.sendPushMsg(pushParam,clientInfo.appId)
		}
	}
}
