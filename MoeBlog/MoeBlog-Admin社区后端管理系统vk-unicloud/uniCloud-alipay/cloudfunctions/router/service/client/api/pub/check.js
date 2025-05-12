'use strict';
module.exports = {
	/**
	 * 微信文本验证
	 * @url client/api/pub/check 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let msgSecCheckRes = await vk.openapi.weixin.security.msgSecCheck({
		  content: data.content, // 文本内容，不可超过500KB
		  openid: data.openid, // 用户的小程序openid
		  scene: 2, // 场景值（建议为2或3）
		  version: 2, // 接口版本号（建议为2）
		  title:data.title?data.title:''
		});
		
		return {
			code:0,
			msg:"获取成功",
			msgSecCheckRes
		};
	}
}
