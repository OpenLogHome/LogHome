// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
const db = uniCloud.database()
let t = Date.now() + parseInt(Math.random() * 999999)

module.exports = {
	trigger: {
		async beforeCreate({
			addDataList,
			clientInfo
		}) {
			const dbJQL = uniCloud.databaseForJQL({
				clientInfo,
			})
			if (addDataList.length === 1) {
				let [{
					group_id
				}] = addDataList
				// 1. 群是否存在，并获取群信息
				let res = await db.collection('uni-im-group').doc(group_id).get()
				if (res.data.length == 0) {
					throw new Error('非法群id')
				}
				// console.log('res.data', res.data);
				const groupInfo = res.data[0]
				
				if (groupInfo.join_option == "disableApply") {
					throw new Error('此群禁止任何人申请加入')
				}else{
					//到after中处理
				}

				// 2. 判断是不是本身已经是群成员
				res = await dbJQL.collection('uni-im-group-member')
					.where(`"group_id" == "${group_id}" && "user_id" == $cloudEnv_uid`)
					.get()
				if (res.data.length != 0) {
					throw new Error('已经是群成员')
				}
			} else {
				throw new Error('非法参数')
			}
		},
		async afterCreate({
			addDataList,
			clientInfo,
			result
		}) {
			let [{
				_id,user_id,group_id,message
			}] = addDataList

			// console.log('addDataList',addDataList);
			// console.log('clientInfo',clientInfo);
			let res = await db.collection('uni-im-group').doc(group_id).get()
			if (res.data.length == 0) {
				throw new Error('非法群id')
			}
			const groupInfo = res.data[0]
			const dbJQL = uniCloud.databaseForJQL({
				clientInfo
			})
			
			if (groupInfo.join_option == "freeAccess") {
				dbJQL.setUser({
					uid: user_id, // 建议此处使用真实uid
					role: ['admin'], // 指定当前执行用户的角色为admin。如果只希望指定为admin身份，可以删除uid和permission节点
					permission: []
				})
				//直接给通过
				await dbJQL.collection('uni-im-group-join').where({
					user_id,group_id
				}).update({
					state: 100
				})
			} else if(groupInfo.join_option == "needPermission"){
				let {
					data: [userInfo]
				} = await dbJQL.collection('uni-id-users')
					.where(`"_id" == $cloudEnv_uid`)
					.field('nickname,_id,avatar_file')
					.get()
				console.log(userInfo);
				let title = userInfo.nickname,
					content = "申请加入 "+groupInfo.name +	"\n" + message
				let pushParam = {
					"user_id": groupInfo.user_id, //群创建人id，后续升级为所有群管理员id
					"payload": {
						type: "uni-im-notification", // im消息通知，比如加好友请求，有用户退群等
						subType: "uni-im-group-join-request", // 通知子类型（可选）
						confirmText: "同意", // 确认按钮的文字（可选）
						cancelText: "拒绝", // 取消按钮的文字（可选）
						state: false, // 是否已经处理过 false 未处理，confirm：已确认，cancel：已拒绝（可选）
						unique: userInfo._id + '_' + groupInfo._id, // 去重字段，比如同一个用户重复申请加好友，通知数据始终只显示一条，但是会通知多次（可选）
						data: { // 自定义的其他参数（可选）
							userInfo,
							groupInfo,
							doc_id:result.id
						},
						avatar_file: userInfo.avatar_file, // 头像或图标的图片地址，支持Base64
					},
					title,
					content
				}
				// console.log(123, pushParam);
				//发消息通知群主，有用户申请加入群聊
				const uniImCo = uniCloud.importObject("uni-im-co")
				res = await uniImCo.sendPushMsg(pushParam,clientInfo.appId)
				// console.log(8989989, res);
				
				// 删除之前提交的
				// res = await db.collection('uni-im-group-join')
				// 	.where({
				// 		group_id,
				// 		user_id: userInfo._id
				// 	})
				// 	.remove()
				// console.log('res 把旧的删了',res);
			}
		},
		async beforeRead({
			where,
			clientInfo
		}) {
			//获取自己的加群列表不走clientDB

			/*
			// let {group_id} = where
			console.log('where:',where)
			let {data:[item]} = await db.collection('uni-im-group-member').where({group_id}).get()
			if(!item.role.includes('admin')){
				throw new Error('仅群管理员可见')
			}
			where.group_id*/
		},
		async beforeUpdate({
			where,
			updateData,
			clientInfo,
			userInfo
		}) {
			// console.log(123,'where',where)
			if (updateData.state == 100) {
				let {
					data: [item]
				} = await db.collection('uni-im-group-join').where(where).get()
				// console.log(item,clientInfo);
				const {
					user_id,
					group_id
				} = item
				
				// console.log({group_id,user_id});
				
				// 判断操作者，必须是管理员（由触发器触发时会设置role为admin）或者群管理员
				if(!userInfo.role.includes('admin') ){
					let res = await db.collection('uni-im-group-member')
													.where({group_id,user_id:userInfo.uid})
													.get()
					console.log('---',res.data);
					if( !(res.data[0] && res.data[0].role.includes('admin')) ){
						throw Error('没有权限')
					}
				}
				
				const dbJQL = uniCloud.databaseForJQL({
					clientInfo,
					// skipTrigger: 
				})
				// 添加操作权限
				dbJQL.setUser({
					uid: userInfo.uid, // 建议此处使用真实uid
					role: ['admin'], // 指定当前执行用户的角色为admin。如果只希望指定为admin身份，可以删除uid和permission节点
					permission: []
				})
				
				//成为群成员
				let res = await dbJQL.collection('uni-im-group-member').add({
					group_id,
					user_id,
				})
				// console.log('next', {
				// 	res,
				// 	updateData
				// });
			}
		}
	}
}
