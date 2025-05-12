'use strict';
module.exports = {
	/**
	 * 获取支付宝小程序码
	 * @url template/openapi/alipay/pub/getMiniCode 前端调用的url参数地址
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
			page,
			scene
		} = data;
		res = await vk.openapi.alipay.acode.getMiniCode(data);
		res.base64 = res.qr_code_url_circle_white; // 兼容其他小程序的返回字段
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}