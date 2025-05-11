module.exports = {
	/**
	 * 多表查询
	 * @url template/db_api/pub/selects_inviter_uid 前端调用的url参数地址
	 * data 请求参数 说明
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { uniID, pubFun, vk, db, _, $ } = util;
		let { uid } = data;
		let res = { code: 0, msg: 'ok' };
		// 业务逻辑开始-----------------------------------------------------------
		/**
		 * 此为演示 使用数组下标对应的值进行连表，如用户表根据inviter_uid的第一个值进行连表查出第一个上级的用户信息
		 */
		res = await vk.baseDao.selects({
			dbName: "uni-id-users",
			getCount: false,
			pageIndex: 1,
			pageSize: 5,
			fieldJson: {
				token: false,
				password: false
			},
			// 副表列表
			foreignDB: [{
				dbName: "uni-id-users",
				localKey: $.arrayElemAt(['$inviter_uid', 0]),
				foreignKey: "_id",
				as: "inviterUserInfo",
				limit: 1,
				fieldJson: {
					token: false,
					password: false
				},
			}]
		});
		console.log(11, res.rows);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
