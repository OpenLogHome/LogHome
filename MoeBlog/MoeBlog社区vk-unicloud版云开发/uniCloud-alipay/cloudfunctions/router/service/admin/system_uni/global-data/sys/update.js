const formRules = require('../util/formRules.js');
module.exports = {
	/**
	 * 修改
	 * @url admin/system_uni/global-data/sys/update 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} key 			键名
	 * @param {any} value 			键值
	 * @param {time} expired_at 过期时间
	 * @param {any} comment 		备注
	 * @param {String} _id 			id
	 * res 返回参数说明
	 * @param {Number} code			错误码，0表示成功
	 * @param {String} msg			详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			_id,
			key,
			value,
			expired_at,
			comment
		} = data;
		if (typeof expired_at !== "undefined" && !expired_at) expired_at = 0;
		// 参数合法校验
		let formRulesRes = await formRules.update(event);
		if (formRulesRes.code !== 0) {
			return formRulesRes;
		}
		let dbName = "vk-global-data";
		// 执行数据库API请求
		res.num = await vk.baseDao.update({
			dbName: dbName,
			whereJson: {
				_id: key
			},
			dataJson: {
				value,
				expired_at,
				comment
			}
		});

		return res;
	}

}