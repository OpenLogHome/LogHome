'use strict';
module.exports = {
	/**
	 * XXXnameXXX
	 * @url admin/banner/sys/addList 前端调用的url参数地址
	 * data 请求参数
	 * 添加轮播图列表
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let res=await vk.baseDao.add({
			dbName:"MoeBlog-banner",
			dataJson:{
				...data
			}
		})
		return {
			code:0,
			msg:"添加轮播图成功",
			result:res
		}
	}
}
