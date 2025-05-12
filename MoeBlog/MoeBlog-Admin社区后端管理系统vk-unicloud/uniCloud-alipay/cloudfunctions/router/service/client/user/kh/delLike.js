'use strict';
module.exports = {
	/**
	 * XXXnameXXX
	 * @url client/user/kh/delLike 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.deleteById({
			dbName:"MoeBlog-UserLike",
			id:data.id
		})
		return {
			code:0,
			msg:"删除当前点赞成功",
			result:res
		};
	}
}
