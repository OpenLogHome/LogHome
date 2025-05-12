module.exports = {
	/**
	 * 重置密码
	 * @url user/kh/resetPwd 前端调用的url参数地址
	 * @description 重置当前登录用户的密码为123456
	 * data 请求参数 说明
	 * @param {String} uid 当前登录用户id（可信任，仅kh目录下的函数有此值）
	 * @param {String} password 重置后的密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { util, data={} } = event;
		let { uniID } = util;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		// 注意：虽然uid是从data中获取的，但无论前端uid传什么，最终uid都是当前登录用户的_id，因此不会出现A把B的密码改了的情况。
		let { uid, password= '123456' } = data;
		res = await uniID.resetPwd({ uid, password });
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
