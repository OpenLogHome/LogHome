'use strict';
module.exports = {
	/**
	 * 获取推荐的圈子分类
	 * @url client/taxonomy/pub/getCommend 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = await vk.baseDao.selects({
		  dbName: "MoeBlog-taxonomy",
		  whereJson: {
		    is_sticky: true,
		    Audit: 0
		  },
		  getMain:true,
		  fieldJson: {
		    _id: true,
		    name: true,
		    avatarUrl: true,
		    backgroundUrl: true,
			count:true
		  },
		  limit: 4,
		  sortArr: [
		    { "name": "sort", "type": "desc" }
		  ]
		});
		return {
		  code: 0,
		  msg: "查询热门置顶圈子成功",
		  result: res
		};
	}
}
