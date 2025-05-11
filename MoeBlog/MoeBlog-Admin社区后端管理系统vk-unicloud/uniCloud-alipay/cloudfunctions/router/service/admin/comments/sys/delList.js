'use strict';
module.exports = {
	/**
	 * 删除某个评论列表
	 * @url admin/comments/sys/delList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.deleteById({
			dbName:"MoeBlog-comments",
			id:data._id
		})
		return {
			code:0,
			msg:"删除评论成功",
			result:res
		};
	}
}
