module.exports = {
	/**
	 * 修改登录密码
	 * @url user/kh/updatePwd 前端调用的url参数地址
	 * @description 修改当前登录用户的登录密码
	 * data 请求参数 说明
	 * @param {String} oldPassword 旧密码
	 * @param {String} newPassword 新密码
	 * @param {String} passwordConfirmation 确认新密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util } = event;
		let { uniID } = util;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		if (userInfo.disable_update_password) {
			return { code: -1, msg: "该账号不支持修改密码。" };
		}
		res = await uniID.updatePwd(data);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
