'use strict';

const { relative } = require("path");

module.exports = {
	/**
	 * 查询轮播图数据
	 * @url client/banner/pub/getList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let res=await vk.baseDao.select({
			dbName:"MoeBlog-banner",
			fieldJson:{
				_id:true,
				bannerfile:true,
				title:true,
				open_url:true
			}
		})
		return {
			code:0,
			msg:"查询轮播图成功",
			result:res
		}
	}
}
