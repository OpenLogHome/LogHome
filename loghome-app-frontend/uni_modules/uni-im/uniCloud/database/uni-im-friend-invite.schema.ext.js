// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
const db = uniCloud.database();
module.exports = {
	trigger: {
		async beforeCreate({
			addDataList,
			userInfo,
			clientInfo
		}) {
			if(!userInfo.role.includes('admin')){
				throw new Error('没有权限操作')
			}
			/*
			if (addDataList.length === 1) {
				const [{
					from_uid,
					to_uid,
					message
				}] = addDataList
				if (userInfo.uid == to_uid) {
					throw new Error('不能加自己为好友')
				}
				let {
					data: [has]
				} = await db.collection('uni-im-friend').where({
					user_id: from_uid,
					friend_uid: to_uid
				}).get()
				
				console.error(has)
				if (has) {
					throw new Error('已经是好友')
				}

				let res = await db.collection('uni-im-friend-invite').where({
					from_uid,
					to_uid
				}).get()
				if (res.data.length) {
					const dbJQL = uniCloud.databaseForJQL({
						clientInfo
					})
					dbJQL.setUser({
						uid: from_uid, // 建议此处使用真实uid
						role: ['admin'], // 指定当前执行用户的角色为admin。如果只希望指定为admin身份，可以删除uid和permission节点
						permission: []
					})
					await dbJQL.collection('uni-im-friend-invite').where({
						from_uid,
						to_uid
					}).update(addDataList[0])

					throw new Error('alreadyExists')
				}
			} else {
				throw new Error('参数错误')
			}
			*/
		},
		async afterCreate({
			result,
			addDataList: [addData]
		}) {
			//发消息通知 被邀请加好友的用户
			// addData._id = result.id
			let {
				to_uid: user_id,
				message
			} = addData
			await NotifyUsers({
				user_id,
				message,
				doc_id: result.id
			})
		},
		async beforeUpdate({
			where,
			updateData,
			userInfo
		}) {
			// schema权限已经控制，只能由被邀请人操作。或者admin用户操作
		},
		async afterUpdate({
			result,
			updateData,
			clientInfo,
			where
		}) {
			console.error(result.updated);
			if(result.updated === 0){
				console.log('没有更新');
				return
			}
			if (updateData.state == 100) { // cancel
				let {
					data: [friendInviteData]
				} = await db.collection('uni-im-friend-invite')
							.doc(where._id)
							.get()
				// console.log(friendInviteData);
				const {
					from_uid,
					to_uid
				} = friendInviteData
				
				// 把相关的重复的加好友请求都设置为通过
				await db.collection('uni-im-friend-invite')
						.where(
							db.command.or([
								{
									"from_uid":to_uid,
									"to_uid":from_uid
								},
								{
									to_uid,
									from_uid
								}
							])
						)
						.update({
							state:100
						})
			
				const dbJQL = uniCloud.databaseForJQL({
					clientInfo
				})
			
				dbJQL.setUser({
					uid: to_uid, // 建议此处使用真实uid
					role: ['admin'], // 指定当前执行用户的角色为admin。如果只希望指定为admin身份，可以删除uid和permission节点
					permission: []
				})
			
				let res = await dbJQL.collection('uni-im-friend').add({
					friend_uid: from_uid
				})
				
				// console.log(res.data);
			}
		}
	}
}

async function NotifyUsers({
	user_id,
	message,
	doc_id
}) {
	console.error('此逻辑已经废除')
	throw new Error("次方法已废除")
	let title = '好友请求通知',
		content = '好友请求通知'
	let pushParam = {
		user_id,
		payload: {
			type: "uni-im-notification", // im消息通知，比如加好友请求，有用户退群等
			subType: "uni-im-friend-invite", // 通知子类型（可选）
			title: "用户名xxx，申请加你为好友", // 标题 
			content: message || "附加信息：xxx", // 描述
			createTime: Date.now(), // 创建时间
			confirmText: "同意", // 确认按钮的文字（可选）
			cancelText: "拒绝", // 取消按钮的文字（可选）
			state: false, // 是否已经处理过 false 未处理，confirm：已确认，cancel：已拒绝（可选）
			unique: "from_uid", // 去重字段，比如同一个用户重复申请加好友，通知数据始终只显示一条，但是会通知多次（可选）
			data: { // 自定义的其他参数（可选）
				"_id": doc_id,
				"from_uid": "xxx"
			}
		},
		title, // "收到im消息，离线时显示的标题",
		content, //"离线时显示的内容"
		path: false
	}

	const uniImCo = uniCloud.importObject("uni-im-co")
	res = await uniImCo.sendPushMsg(pushParam,clientInfo.appId)
	return res
}