'use strict';
module.exports = {
	/**
	 * 获取支付宝小程序码
	 * @url user/kh/getAlipayMiniCode 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} page         必须是已经发布的小程序存在的页面（否则报错），例如 pages/index/index, 根路径前不要填加 /,不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
	 * @param {String} scene        最大32个可见字符，只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~，其它字符请自行编码为合法字符（因不支持%，中文无法使用 urlencode 处理，请使用其他编码方式）
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
		res.base64 = res.qr_code_url_circle_blue; // 兼容其他小程序的返回字段
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
