'use strict';
module.exports = {
	/**
	 * 查询轮播图列表
	 * @url admin/banner/sys/getList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let res=await vk.baseDao.getTableData({
			dbName:"MoeBlog-banner",
			data:{
				pageIndex:data.pageIndex,
				pageSize:data.pageSize
			}
		})

		return {
			code:0,
			msg:"查询轮播图成功",
			result:res
		}
	}
}
