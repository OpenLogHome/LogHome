module.exports = {
	/**
	 * 用户登录（邮箱+验证码登录）
	 * @url user/pub/loginByEmail 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} email 邮箱
	 * @param {String} code 邮箱收到的验证码
	 * @param {String} type 指定操作类型，不传：存在则登录不存在则注册 login：只能登录 register：只能注册 
	 * @param {String} password 密码，当前用户为新注册时生效
	 * @param {String} myInviteCode 设置当前注册用户自己的邀请码，当前用户为新注册时生效（不传会自动生成）
	 * @param {Boolean} needPermission 设置为true时会在checkToken时返回用户权限（permission），如果是在admin端，需传true
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	main: async (event) => {
		let { data = {}, util, originalParam } = event;
		let { uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		let {
			email,
			code,
			type,
			password,
			needPermission,
			myInviteCode
		} = data;
		res = await uniID.loginByEmail({
			email,
			code,
			type,
			password,
			myInviteCode,
			needPermission
		});
		if (res.token) {
			if (!res.msg) {
				res.msg = res.type === "register" ? "注册成功" : "登录成功";
			}
			// 日志服务
			const loginLogService = vk.require("service/user/util/login_log");
			await loginLogService.add({
				type: "login",
				login_type: "email",
				user_id: res.uid,
				context: originalParam.context
			}, util);
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}