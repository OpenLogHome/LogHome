'use strict';
module.exports = {
	/**
	 * XXXnameXXX
	 * @url admin/taxonomy/sys/addList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		
		let res=await vk.baseDao.add({
			dbName:"MoeBlog-taxonomy",
			dataJson:{
				...data,
				Audit:0
			}
		})
		return {
			code:0,
			msg:"添加一级分类成功",
			result:res
		};
	}
}
