'use strict';
module.exports = {
	/**
	 * 获取圈子列表
	 * @url client/square/pub/getList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		
		let res=await vk.baseDao.selects({
			dbName:"MoeBlog-taxonomy",
			whereJson:{
				Audit:0
			},
			pageSize:1000,
			pageNum:1,
			fieldJson:{
				  _id:true,
				  name:true,
				  description:true,
				  avatarUrl:true,
				  backgroundUrl:true,
				  count:true,
				  parent_id:true,
				  fans_count:true
			}
		})
		
		return {
			code:0,
			msg:"查询圈子成功",
			result:res
		}
	}
}
