'use strict';
module.exports = {
	/**
	 * 添加发布文章
	 * @url client/art/kh/addList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.add({
			dbName:"MoeBlog-article",
			dataJson:{
				...data,
				user_id:uid,
				Audit:0,
				comment_count:0,
				like_count:0
			}
		})
		return {
			code:0,
			msg:"发布文章成功",
			result:res
		};
	}
}
