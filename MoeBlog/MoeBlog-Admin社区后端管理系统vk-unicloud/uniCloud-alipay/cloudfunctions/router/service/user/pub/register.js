module.exports = {
	/**
	 * 用户注册(账号+密码)
	 * @url user/pub/register 前端调用的url参数地址
	 * @description 用户注册(账号+密码)
	 * data 请求参数 说明
	 * @param {String} username 用户名，唯一
	 * @param {String} password 密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 注册完成自动登录之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 * @param {Object} userInfo 用户信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: -1, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		if (typeof data.username === "number") data.username = String(data.username).trim();
		if (typeof data.password === "number") data.password = String(data.password).trim();
		
		let {
			username,
			password,
			needPermission,
			myInviteCode
		} = data;

		// 验证规则开始 -----------------------------------------------------------
		let rules = {
			username: [
				{ required: true, validator: vk.pubfn.validator("username"), message: '用户名以字母开头，长度在3~32之间，只能包含字母、数字和下划线', trigger: ['blur', 'change'] }
			],
			password: [
				{ validator: vk.pubfn.validator("password"), message: '密码长度在6~18之间，只能包含字母、数字和下划线', trigger: 'blur' }
			]
		};
		// 验证规则结束 -----------------------------------------------------------
		// 开始进行验证
		let formRulesRes = vk.pubfn.formValidate({
			data: data,
			rules: rules
		});
		if (formRulesRes.code !== 0) {
			// 表单验证未通过
			return formRulesRes;
		}
		// 表单验证通过，下面写自己的业务逻辑
		res = await uniID.register({
			username,
			password,
			needPermission,
			myInviteCode
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}