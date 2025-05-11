'use strict';
module.exports = {
	/**
	 * XXXnameXXX
	 * @url template/db_api/pub/tree 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		res = await vk.baseDao.getTableData({
			dbName: "opendb-admin-menus",
			whereJson:{
				enable: true,
				parent_id: null
			},
			// 树状结构参数
			treeProps: {
				id: "menu_id",          // 唯一标识字段，默认为 _id
				parent_id: "parent_id", // 父级标识字段，默认为 parent_id
				children: "children",   // 自定义返回的下级字段名，默认为 children
				level: 3,               // 查询返回的树的最大层级。超过设定层级的节点不会返回。默认10级，最大15，最小1
				limit: 500,             // 每一级最大返回的数据。
				whereJson: {
					enable: true
				}
			}
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
