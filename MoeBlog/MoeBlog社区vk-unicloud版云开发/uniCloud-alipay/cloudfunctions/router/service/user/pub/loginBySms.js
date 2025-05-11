module.exports = {
	/**
	 * 手机号登陆(手机号+手机验证码)
	 * @url user/pub/loginBySms 前端调用的url参数地址
	 * @description 手机号登陆(手机号+手机验证码)
	 * data 请求参数 说明
	 * @param {String} mobile 手机号
	 * @param {String} code 验证码
	 * @param {String} type 指定操作类型，不传：存在则登录不存在则注册 login：只能登录 register：只能注册 
	 * @param {String} password 密码，当前用户为新注册时生效
	 * @param {String} inviteCode 邀请人的邀请码，当前用户为新注册时生效
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
			mobile,
			code,
			type,
			password,
			inviteCode,
			myInviteCode,
			needPermission
		} = data;
		res = await uniID.loginBySms({
			mobile,
			code,
			type,
			password,
			inviteCode,
			myInviteCode,
			needPermission
		});
		// 修改用户昵称为:手机尾号xxxx用户
		if (res.token) {
			if (!res.msg) {
				res.msg = res.type === "register" ? "注册成功" : "登录成功";
			}
			let mobileStr = mobile.substring(7);
			await vk.baseDao.update({
				dbName: "uni-id-users",
				whereJson: {
					_id: res.uid,
					nickname: null
				},
				dataJson: {
					nickname: `手机尾号${mobileStr}用户`
				}
			});
			// 日志服务
			const loginLogService = vk.require("service/user/util/login_log");
			await loginLogService.add({
				type: "login",
				login_type: "sms",
				user_id: res.uid,
				context: originalParam.context
			}, util);
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}