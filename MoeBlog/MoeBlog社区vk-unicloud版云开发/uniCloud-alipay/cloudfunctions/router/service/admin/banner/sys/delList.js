'use strict';
module.exports = {
	/**
	 * 删除当前的轮播图
	 * @url admin/banner/sys/delList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let {_id}=event.data
		let res=await vk.baseDao.deleteById({
			dbName:"MoeBlog-banner",
			id:_id
		})
		return {
			code:0,
			msg:"删除轮播图成功",
			result:res
		}
	}
}
