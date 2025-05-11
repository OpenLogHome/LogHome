'use strict';
module.exports = {
	/**
	 * 查询当前用户的圈子信息
	 * @url client/taxonomy/kh/getSquareAll 前端调用的url参数地址
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
				user_id:uid,
				status:true,
				Audit:data.Audit,
				parent_id:_.neq("")
			},
			fieldJson:{
				_id:true,
				avatarUrl:true,
				backgroundUrl:true,
				name:true,
				description:true,
				Audit:true
			}
		})
		return {
			code:0,
			msg:"查询当前创建的圈子成功",
			result:res
		};
	}
}
