'use strict';
module.exports = {
	/**
	 * 更新一级分类
	 * @url admin/taxonomy/sys/upList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		
		let res=await vk.baseDao.updateById({
			dbName:"MoeBlog-taxonomy",
			id:data._id,
			dataJson:{
				...data
			}
		})
		return{
			code:0,
			msg:"修改一级分类成功",
			result:res
		}
	}
}
