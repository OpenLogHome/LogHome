'use strict';
module.exports = {
	/**
	 * 获取公众号jsapi签名
	 * @url user/pub/getWeiXinJsapiSign 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} url 浏览器上的地址，前端直接用 let url = window.location.href 即可获取
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------

		let {
			appid,
			url
		} = data;
		
		/**
		 * 支持多公众号
		 * 此处data可以额外接收appid和appsecret参数（appid可以从前端传，而appsecret可以配置在全局配置中common/uni-config-center/vk-unicloud/index.js）
		 * 如果不传appid，则默认使用uni-id的配置信息
		 */
		
		// 如果需要自己从数据库获取，则打开下方注释，动态赋值appid和appsecret即可支持多公众号
		// data.appid = "xxxx";
		// data.appsecret = "xxxx";

		res = await vk.openapi.weixin.h5.auth.getJsapiSign(data);

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}