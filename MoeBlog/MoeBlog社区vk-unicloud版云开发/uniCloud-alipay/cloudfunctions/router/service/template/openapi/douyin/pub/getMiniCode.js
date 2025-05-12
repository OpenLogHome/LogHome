'use strict';
module.exports = {
	/**
	 * 获取抖音小程序码
	 * @url template/openapi/douyin/pub/getMiniCode 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} path  小程序页面路径
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			path
		} = data;

		res = await vk.openapi.douyin.acode.getMiniCode({
			path
		});
		if (typeof res === "object" && res.code) {
			return res;
		}
		try {
			// 二进制转base64
			let base64 = Buffer.from(res, 'binary').toString('base64');
			return {
				code: 0,
				base64: `data:image/png;base64,${base64}`
			};
		} catch (err) {
			// 转base64失败
			return {
				code: -1,
				msg: "生成小程序码失败",
				err: {
					message: err.message,
					stack: err.stack
				}
			};
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}