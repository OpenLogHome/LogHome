'use strict';
module.exports = {
	/**
	 * 查询首页分类的列表
	 * @url client/index_taxonomy/pub/getList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.select({
			dbName:"MoeBlog-index_taxonomy",
			getMain:true,
			whereJson:{
				status:true
			},
			fieldJson:{
				_id:true,
				name:true,
				taxonomy_id:true
			}
		})
		return {
			code:0,
			msg:"查询首页分类列表成功",
			result:res
		};
	}
}
