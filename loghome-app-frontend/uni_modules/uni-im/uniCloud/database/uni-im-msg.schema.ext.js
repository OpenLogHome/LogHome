// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
const db = uniCloud.database();
module.exports = {   
    trigger: {
		async beforeRead({clientInfo,where,userInfo}){
			// console.log('where',where);
			const {conversation_id,to_uid} = where
			if(conversation_id || to_uid){
				if(to_uid == userInfo.uid){
					//查发给当前用户的数据
				}else if(conversation_id){
					// console.log('conversation_id',conversation_id);
					const dbJQL = uniCloud.databaseForJQL({
						clientInfo,
						skipTrigger: true
					})
					
					//判断当前用户id是否有这个会话，否则无权接收此消息
					let {data:conversations} = await dbJQL.collection('uni-im-conversation')
														.where(`"id" == "${conversation_id}" && "user_id" == $cloudEnv_uid`)
														.get()
					// console.log('conversations',conversations);
					if(conversations.length === 0){
						throw new Error('会话id无效，或此会话你无权服务，即：user_id不等于当前用户')
					}
					// if(conversations[0].type == 2){ //2是群聊
					// 	let {group_id} = conversations[0]
					// 	let res = await dbJQL.collection('uni-im-group-member')
					// 						.where(`"group_id" == "${group_id}" && "user_id" == $cloudEnv_uid`)
					// 						.get()
					// 	if(res.data.length == 0){
					// 		throw new Error('不是此群人员，不能读取')
					// 	}
					// }
				}else{
					throw new Error('uni-im-msg触发器：查询条件会话id或者to_uid错误')
				}
			}else{
				throw new Error('触发器限制了，查询条件必须包含会话id或者to_uid。如果要增加其他查询方式，请自己扩充')
			}
		}
    }
}
