'use strict';
module.exports = {
	/**
	 * 用户更改信息
	 * @url client/user/kh/upList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.updateById({
			 dbName: "uni-id-users",
			 id: uid,
			 dataJson:{
				 ...data
			 }
		})
		return {
			code:0,
			msg:"更新用户信息成功",
			result:res
		};
	}
}
