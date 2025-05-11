'use strict';
module.exports = {
	/**
	 * 查询二级圈子分类
	 * @url admin/art/sys/getTaxonomy 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.select({
			dbName:"MoeBlog-taxonomy",
			pageSize:1000,
			whereJson:{
				parent_id: _.neq(""),
				Audit:0,
				status:true
			},
			getMain:true
		})
		return {
			code:0,
			msg:"查询当前分类成功",
			result:res
		};
	}
}
