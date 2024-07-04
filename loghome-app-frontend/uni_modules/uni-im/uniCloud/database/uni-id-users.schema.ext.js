// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
const db = uniCloud.database();
const dbCmd = db.command
module.exports = {
	trigger: {
		async afterReadAsSecondaryCollection(e) {
			await afterReadAction(e, true)
		},
		async afterRead(e) {
			await afterReadAction(e)
		}
	}
}

async function afterReadAction({
	field,
	result,
	userInfo: currentUserInfo,
	primaryCollection
} = {}, asSecondaryCollection = false) {
	if (result && field && field.includes("nickname")) {
		//uni-im 处理查询nickname，但值为空的情况
		let {
			data
		} = result
		
    if( !Array.isArray(data) ){
      // 说明走了 getOne
      data = [data]
    }
    
		// 为联查 且为副表时的字段
		if (asSecondaryCollection && typeof(data[0]) == "object") {
			let foreignKeysObj = {
				"uni-im-group-member":"user_id",
				"uni-im-friend":"friend_uid"
			}
			let foreignKey = foreignKeysObj[primaryCollection]
			
			if(foreignKey in data[0]){
				data = data.map(item => item[foreignKey][0])
			}else{
        return console.log('触发器uni-id-users.schema.ext.js，未在当前操作生效。如需应用此触发器，请补充：主表表名及其foreignKey的值，到触发器uni-id-users.schema.ext.js的变量foreignKeysObj内');
			}
		}

		// console.log('data',data);
		if (!Array.isArray(data)) {
			data = [data]
		}
		// 记录没有nickname的用户id
		let user_ids = [],
			usersInfo = {};
		data.forEach(item => {
			if (item && !item.nickname) {
				user_ids.push(item._id)
			}
		})
		if (user_ids.length) {
			console.info('注意：uni-im项目用户数据依赖nickname。有' + user_ids.length +
				`个用户数据 nickname 的值为空，已多执行一次数据库查询：将此用户的“用户名”或“邮箱”或“手机号”脱敏后，作为nickname输出。请引导用户完善nickname，减少查库次数`)
			let res = await db.collection('uni-id-users')
				.where({
					_id: dbCmd.in(user_ids)
				})
				.field({
					username: true,
					email: true,
					mobile: true
				})
				.limit(1000)
				.get()
			usersInfo = res.data.reduce((sum, current) => {
				sum[current._id] = current
				return sum
			}, {})
		}

		let isUniImAdmin = currentUserInfo.role.includes('uni-im-admin') || currentUserInfo.role.includes('admin')

		data.forEach(item => {
			if (!item.nickname) {
				let userInfo = usersInfo[item._id]
				// 管理员可以看到不打码的
				if (isUniImAdmin) {
					item.nickname = userInfo.username || userInfo.email || userInfo.mobile
				}else{
					item.nickname = hideUsernameStr(userInfo.username) || hideEmailStr(userInfo.email) ||
											hideMobileStr(userInfo.mobile)
				}
			}else if(!isUniImAdmin && item.nickname.includes('@')){
				// 禁止昵称用邮箱 脱敏处理
				item.nickname = hideEmailStr(item.nickname)
			}

			// 特殊处理某个用户xxx
			if (item._id == "xxx") {
				item.nickname = "xxx"
				item.avatar_file = {
					url: "xxx"
				}
			}

		})

		function hideUsernameStr(username) {
			if (username == undefined) {
				return false
			}
			let length = username.length
			let n = parseInt(length / 2.5) * 2
			return username.substr(0, length - n) + '**' + username.substr(-1 * n / 2)
		}

		function hideEmailStr(email) {
			if (email == undefined) {
				return false
			}
			const content = email.split("@")
			return content[0].substr(0, content[0].length - 2) + '**' + content[1]
		}

		function hideMobileStr(mobile) {
			if (mobile == undefined) {
				return false
			}
			return mobile.substr(0, 3) + '****' + mobile.substr(-1 * 4)
		}
	}
}