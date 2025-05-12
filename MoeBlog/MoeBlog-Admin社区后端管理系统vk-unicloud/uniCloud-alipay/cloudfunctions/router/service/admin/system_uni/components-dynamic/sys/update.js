module.exports = {
	/**
	 * 修改
	 * @url admin/system_uni/components-dynamic/sys/update 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} data_id 			组件数据id
	 * @param {String} title 				数据标题
	 * @param {Object} data 					组件数据
	 * @param {Object} description 	数据描述
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
			data_id,
			data: dynamicData,
			title,
			description,
			type,
			sort,
			show,
			name
		} = data;

		// 参数非空检测
		if (vk.pubfn.isNull(_id)) return { code: -1, msg: 'id不能为空' };

		let dbName = "vk-components-dynamic";

		if (vk.pubfn.isNotNull(data_id)) {
			// 检测data_id是否已存在
			let num = await vk.baseDao.count({
				dbName,
				whereJson: {
					data_id,
					_id: _.neq(_id)
				}
			});
			if (num > 0) {
				return { code: -1, msg: `组件数据id不能重复!` };
			}
		}
		// 执行数据库API请求
		res.num = await vk.baseDao.updateById({
			dbName,
			id: _id,
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
