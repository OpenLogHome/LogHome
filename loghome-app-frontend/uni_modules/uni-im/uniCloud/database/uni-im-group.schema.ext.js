// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
const db = uniCloud.database();

module.exports = {
	trigger: {
		async afterCreate({
			addDataList,
			clientInfo,
			result
		}){
			if(addDataList.length>1){
				throw('禁止批量创建')
			}
			// console.log(result);
			let res = await db.collection('uni-im-group').doc(result.id).get()
			let data = res.data[0]
			// console.log(data)
			
			const dbJQL = uniCloud.databaseForJQL({
				clientInfo,
			})

			// 添加操作权限
			dbJQL.setUser({
				uid: data.user_id, // 建议此处使用真实uid
				role: ['admin'], // 指定当前执行用户的角色为admin。如果只希望指定为admin身份，可以删除uid和permission节点
				permission: []
			})

			res = await dbJQL.collection('uni-im-group-member').add({
				"group_id":data._id,
				"user_id":data.user_id,
				"role":['creator','admin']
			})
			// console.log({res});
		},
		async beforeCreate({addDataList}){
		},
		async beforeDelete({where,userInfo,triggerContext}){
			if(!triggerContext){
				throw new Error('执行删除群失败！你的HBuilderX版本过低，请使用3.6.16及以上版本')
			}
			
			let {data:[groupInfo]} = await db.collection('uni-im-group').doc(where._id).get()
			triggerContext.groupInfo = groupInfo
			console.log('beforeDelete',where);
			let {data:[has]} = await db.collection('uni-im-conversation')
										.where({
											group_id:where._id,
											user_id:userInfo._id
										})
										.get()
			if(!has){
				throw new Error('限群创建者操作')
			}
		},
		async afterDelete({where,clientInfo,triggerContext}){
			console.log('beforeDelete',where,triggerContext);
			const group_id = where._id
			// 删除相关会话
			let res = await db.collection('uni-im-conversation').where({group_id}).remove()
			// 删除相关加群申请数据
			res = await db.collection('uni-im-group-join').where({group_id}).remove()
			
			// 通知所有群成员，注意：需要群成员列表清空之前发 要不然就收不到了
			let title = "群聊被解散通知",
				content = `群聊"${triggerContext.groupInfo.name}"已被解散`,
				pushParam = {
					payload: {
						"type": "uni-im-notification",
						"subType": "uni-im-group-cancellation",
						"data": {
							group_id
						},
						unique:group_id
					},
					title, // "收到im消息，离线时显示的标题",
					content //"离线时显示的内容"
				}
			const uniImCo = uniCloud.importObject("uni-im-co")
			res = await uniImCo.sendMsgToGroup({pushParam,appId:clientInfo.appId})
			// console.log(res);
			
			// 删除相关群成员数据（注意：要先发群通知再解散，要不然消息发布出去“无法指定接收消息的人”）
			res = await db.collection('uni-im-group-member').where({group_id}).remove()
			console.log('beforeDelete',res);
		}
	}
}
