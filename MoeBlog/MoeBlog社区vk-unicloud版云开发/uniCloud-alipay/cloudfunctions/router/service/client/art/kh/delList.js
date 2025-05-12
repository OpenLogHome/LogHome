'use strict';
module.exports = {
	/**
	 * XXXnameXXX
	 * @url client/art/kh/delList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		if(uid!=data.user_id){
			return {
				code:-1,
				msg:"当前用户登陆与账号不一致"
			}
		}
		let res=await vk.baseDao.del({
			dbName:"MoeBlog-article",
			whereJson:{
				user_id:uid,
				_id:data._id
			}
		})
		return {
			code:0,
			msg:"删除当前文章成功",
			result:res
		};
	}
}
