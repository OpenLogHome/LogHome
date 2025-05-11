module.exports = {
	/**
	 * 修改基础信息
	 * @url admin/system/menu/sys/updateBase 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} _id 							_id
	 * @param {Number} sort 						排序
	 * @param {Boolean} enable 					是否启用
	 * @param {Boolean} hidden_menu 		是否隐藏（左侧菜单中不显示）
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			_id,
			sort,
			enable,
			hidden_menu
		} = data;
		if (vk.pubfn.isNull(_id)) return { code: -1, msg: "_id不能为空" };

		let dbName = "opendb-admin-menus";

		// 执行数据库API请求
		res.num = await vk.baseDao.updateById({
			dbName,
			id: _id,
			dataJson: {
				sort,
				enable,
				hidden_menu
			},
		});
		return res;
	}

}