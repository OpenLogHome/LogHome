const vk = require('vk-unicloud');
const config = require('uni-config-center')({
	pluginId: 'vk-unicloud'
}).config;

module.exports = {
	/**
	 * 通过跨站token获取UniCloud登录token
	 * @url user/pub/unicloud_token_by_cross_site 前端调用的url参数地址
	 * @description 通过跨站token获取UniCloud登录token
	 * data 请求参数 说明
	 * @param {String} token 跨站token
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token UniCloud登录token
	 * @param {String} tokenExpired token过期时间
	 */
	main: async (event) => {
		let { data = {}, util, originalParam } = event;
		let { uniID, config, pubFun, vk, db, _ } = util;
		let res = { code: 0, msg: "ok" };
		
		// 业务逻辑开始-----------------------------------------------------------
		try {
			// 获取跨站token
			const crossSiteToken = data.token;
			if (!crossSiteToken) {
				return { code: -1, msg: "无效的跨站点令牌" };
			}

			// 发送请求到外部服务器验证token
			const response = await uniCloud.httpclient.request(
				`${config.vk.service.externalServerUrl}/users/unicloud_token_by_cross_site?token=${crossSiteToken}`,
				{
					dataType: 'json',
					timeout: 5000
				}
			);

			// 检查响应状态
			if (response.status === 200 && response.data) {
				// 返回UniCloud登录token
				res = {
					code: 0,
					msg: "登录成功",
					...response.data
				};

				// 日志服务
				const loginLogService = vk.require("service/user/util/login_log");
				await loginLogService.add({
					type: "login",
					login_type: "cross_site",
					user_id: response.data.userId,
					context: originalParam.context
				}, util);

			} else {
				return {
					code: -1,
					msg: "验证失败",
					error: response.data
				};
			}
		} catch (err) {
			console.error(err);
			return { code: -1, msg: err.message || "验证失败" };
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}