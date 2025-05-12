'use strict';
module.exports = {
	/**
	 * 查询一级分类的信息
	 * @url client/taxonomy/pub/getLevel1 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.select({
			dbName:"MoeBlog-taxonomy",
			pageSzie:1000,
			whereJson:{
				parent_id:"",
				status:true
			},
			fieldJson:{
				_id:true,
				name:true
			}
		})
		return {
			code:0,
			msg:"查询一级分类信息成功",
			result:res
		};
	}
}
