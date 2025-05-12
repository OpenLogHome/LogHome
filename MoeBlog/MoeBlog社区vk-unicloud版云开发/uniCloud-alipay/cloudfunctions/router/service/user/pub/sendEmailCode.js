var vkmail;
try {
	vkmail = require('vk-mail');
} catch (err) {
	console.error("请先添加公共模块：vk-mail（右键对应的云函数，点击管理公共模块或扩展库依赖，勾选vk-mail依赖）");
}
var everyDaylimit = 30; // 限制同一个邮箱每天次数
module.exports = {
	/**
	 * 发送邮箱验证码
	 * @url user/pub/sendEmailCode 前端调用的url参数地址
	 * @description 发送邮箱验证码
	 * data 请求参数 说明
	 * @param {String} email 邮箱
	 * @param {String} type  验证码类型
	 * @param {String} serviceType 邮件服务类型，默认为qq
	 * @param {Boolean|String} checkUserExist 是否需要检测邮箱对应的账号是否存在或不存在，默认不检测，若为exists代表邮箱必须已注册，若为!exists代表邮箱必须未注册
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, util } = event;
		let { uniID, config } = util;
		let {
			email,
			type,
			serviceType = "qq",
			checkUserExist = false
		} = data;
		let res = { code: 0, msg: 'ok' };
		// 业务逻辑开始-----------------------------------------------------------
		if (!vkmail) {
			return { code: -1, msg: "请先添加公共模块：vk-mail（右键对应的云函数，点击管理公共模块或扩展库依赖，勾选vk-mail依赖）" };
		}
		// 参数非空检测
		let nullKey = vk.pubfn.isNullOneByObject({ email, type });
		if (nullKey) return { code: -1, msg: '参数 ' + nullKey + ' 不能为空' };

		if (!vk.pubfn.test(email, "email")) return { code: -1, msg: "邮箱格式错误" };
		if (vk.pubfn.isNull(type)) return { code: -1, msg: "type不能为空" };

		if (checkUserExist) {
			let dcloud_appid = originalParam.context.appId;
			// 检测邮箱对应的账号是否存在
			let num = await vk.daoCenter.userDao.count({
				email,
				dcloud_appid: _.or(_.eq(dcloud_appid), _.exists(false))
			});
			if (checkUserExist === true || checkUserExist === "exists") {
				// 邮箱必须已注册用户，如果邮箱未注册，则不发短信
				if (num === 0) {
					return { code: -1, msg: `邮箱：${email} 未注册`, notExists: true };
				}
			} else if (checkUserExist === "!exists") {
				// 邮箱必须未注册用户，如果邮箱已注册，则不发短信
				if (num > 0) {
					return { code: -1, msg: `邮箱：${email} 已注册`, exists: true };
				}
			}
		}

		// 针对同一个邮箱，发送验证码每天有次数限制
		const cacheKey = `sys.sendEmailCode.everyDaylimit-${email}`;
		let currNum = await vk.globalDataCache.get(cacheKey);
		if (!currNum) currNum = 0;
		if (currNum >= everyDaylimit) {
			return { code: -1, msg: "此邮箱今日已超最大次数限制，请明日再试" };
		}

		let code = vk.pubfn.random(6, "0123456789");
		let param = {
			code,
			type,
			email
		};
		// 发送验证码开始
		let emailConfig = config.vk.service.email;
		// 如果配置设置了过期时间，则使用配置的过期时间，否则默认180秒
		param.expiresIn = emailConfig.codeExpiresIn || 180;
		let emailService = vkmail.createTransport({
			"host": emailConfig[serviceType].host,
			"port": emailConfig[serviceType].port,
			"secure": emailConfig[serviceType].secure, // use SSL
			"auth": emailConfig[serviceType].auth
		});
		try {
			// 发送邮件
			await emailService.sendMail({
				"from": emailConfig[serviceType].auth.user,
				"to": data.email,
				"cc": emailConfig[serviceType].auth.user, // 由于邮件可能会被当成垃圾邮件，但只要把邮件抄送给自己一份，就不会被当成垃圾邮件。
				"subject": data.subject || `验证码是${code}`, // 邮件的标题
				"text": `您的验证码是${code}，打死也不要告诉别人哦！`, // 邮件的内容
			});
			// 发送验证码成功后，设置验证码
			await uniID.setVerifyCode(param);

			currNum++;
			let { startTime } = vk.pubfn.getDayOffsetStartAndEnd(1, new Date());
			let second = vk.pubfn.toDecimal((startTime - Date.now()) / 1000, 0)
			await vk.globalDataCache.set(cacheKey, currNum, second);
		} catch (err) {
			console.error(err);
			return { code: -1, msg: "邮件发送失败", err };
		}
		// 发送验证码结束

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}