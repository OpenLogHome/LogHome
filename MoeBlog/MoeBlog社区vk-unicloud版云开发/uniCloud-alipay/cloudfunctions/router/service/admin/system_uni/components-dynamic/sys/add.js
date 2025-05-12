module.exports = {
	/**
	 * 添加
	 * @url admin/system_uni/components-dynamic/sys/add 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} data_id 	组件数据id
	 * @param {String} title 		数据标题
	 * @param {Object} data 			组件数据
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
			data_id,
			data: dynamicData,
			title,
			description,
			type,
			sort = 0,
			show = true,
			name
		} = data;

		// 参数非空检测
		if (vk.pubfn.isNull(data_id)) return { code: -1, msg: 'data_id不能为空' };

		let dbName = "vk-components-dynamic";
		// 检测key是否已存在
		let num = await vk.baseDao.count({
			dbName: dbName,
			whereJson: {
				data_id,
			}
		});
		if (num > 0) {
			return { code: -1, msg: `组件数据id不能重复!` };
		}
		// 执行数据库API请求
		res.id = await vk.baseDao.add({
			dbName,
			dataJson: {
				data: dynamicData,
				data_id,
				title,
				description,
				type,
				sort,
				show,
				name
			}
		});
		return res;
	}

}
