'use strict';
module.exports = {
	/**
	 * code2Session
	 * @url template/openapi/douyin/pub/code2Session 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			code,
			anonymousCode
		} = data;
		let code2SessionRes = await vk.openapi.douyin.auth.code2Session({
			code,
			anonymousCode,
			needKey: true
		});
		if (code2SessionRes.code !== 0) {
			return code2SessionRes;
		}
		console.log('code2SessionRes: ', code2SessionRes);
		res.openid = code2SessionRes.openid;
		res.anonymousOpenid = code2SessionRes.anonymousOpenid;
		res.unionid = code2SessionRes.unionid;
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}