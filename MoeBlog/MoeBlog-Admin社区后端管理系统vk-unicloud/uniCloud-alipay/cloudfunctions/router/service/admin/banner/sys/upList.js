'use strict';
module.exports = {
	/**
	 * 更新轮播图数据
	 * @url admin/banner/sys/upList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let res=await vk.baseDao.updateById({
			dbName:"MoeBlog-banner",
			id:event.data._id,
			dataJson:{
				...event.data
			}
		})
		return {
			code:0,
			msg:"修改轮播图壁纸成功",
			result:res
		}
	}
}
