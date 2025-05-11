'use strict';
module.exports = {
	/**
	 * 获取模板列表
	 * @url template/openapi/weixin/pub/getTemplateList 前端调用的url参数地址
	 * data 请求参数 说明
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util } = event;
		let { config, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: 'ok' };
		// 业务逻辑开始-----------------------------------------------------------
		res = await vk.openapi.weixin.request({
			method: "get",
			url: "wxaapi/newtmpl/gettemplate",
			data: {

			}
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
