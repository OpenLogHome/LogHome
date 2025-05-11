'use strict';
module.exports = {
	/**
	 * XXXnameXXX
	 * @url admin/taxonomy/sys/getList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		
		let res=await vk.baseDao.getTableData({
			dbName:"MoeBlog-taxonomy",
			data:{
				...data
			},
			foreignDB: [
			    {
			      dbName: "uni-id-users",
			      localKey: "uid",
			      foreignKey: "_id",
			      as: "userinfo",
			      limit: 1
			    }
			],
			whereJson: {
			      parent_id: _.in([null, ""]) // 筛选parent_id为空（即一级目录）的数据
			}
		})
		return {
			code:0,
			msg:"查询一级分类成功",
			result:res
		}
	}
}
