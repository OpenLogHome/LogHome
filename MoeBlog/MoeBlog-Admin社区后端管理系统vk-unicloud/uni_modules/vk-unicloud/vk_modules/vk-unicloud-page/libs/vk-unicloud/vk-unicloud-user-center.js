/**
 * unicloud-user-center 接口类（uni-id封装）
 * author	VK
 */
import callFunctionUtil from './vk-unicloud-callFunctionUtil.js'
let { callFunction, config, saveToken, deleteToken } = callFunctionUtil;
import debounce from '../function/debounce.js'

const debounceTime = 1000; // 防抖时长

const localeObj = {
	"zh-Hans": {
		"loading": "请求中...",
		"login": "登录中...",
		"register": "注册中...",
		"create": "生成中...",
	},
	"zh-Hant": {
		"loading": "請求中...",
		"login": "登入中...",
		"register": "注册中...",
		"create": "生成中...",
	},
	"en": {
		"loading": "loading...",
		"login": "login...",
		"register": "register...",
		"create": "create...",
	}
};

function addLoading(obj, title) {
	if (typeof obj.loading === "undefined" && !obj.title && title) {
		let locale;
		if (typeof uni.vk !== "undefined") {
			locale = localeObj[uni.vk.pubfn.getLocale()];
		} else {
			locale = localeObj["zh-Hans"];
		}
		if (!locale) locale = localeObj["en"];
		obj.title = locale[title] || "loading...";
	}
	return obj;
}

function addAppid(obj) {
	if (!obj.data) obj.data = {};
	if (!obj.data.appid) {
		// #ifdef MP-WEIXIN || MP-ALIPAY
		obj.data.appid = uni.getAccountInfoSync().miniProgram.appId;
		// #endif
		// #ifdef MP-TOUTIAO
		obj.data.appid = uni.getEnvInfoSync().microapp.appId;
		// #endif
	}
	return obj;
}

export default {
	/**
	 * 用户注册(用户名+密码)
	 * data 请求参数 说明
	 * @param {String} username 用户名
	 * @param {String} password 密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 注册完成自动登录之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 * @param {Object} userInfo 用户信息
	 * @param {String} uid 用户ID
	 */
	register(obj = {}) {
		return debounce(() => {
			addLoading(obj, "register");
			return callFunction({
				...obj,
				url: 'user/pub/register'
			});
		}, debounceTime, true, "login");
	},
	/**
	 * 用户登录(用户名+密码)
	 * data 请求参数 说明
	 * @param {String} username 用户名
	 * @param {String} password 密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 注册完成自动登录之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 * @param {Object} userInfo 用户信息
	 * @param {String} uid 用户ID
	 */
	login(obj = {}) {
		return debounce(() => {
			addLoading(obj, "login");
			return callFunction({
				...obj,
				url: 'user/pub/login'
			});
		}, debounceTime, true, "login");
	},
	/**
	 * 登出(退出)
	 * data 请求参数 说明
	 * 无
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	logout(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			return callFunction({
				...obj,
				url: 'user/pub/logout',
				success(res) {
					deleteToken();
					if (typeof obj.success == "function") obj.success(res);
				}
			});
		}, debounceTime, true, "logout");
	},
	/**
	 * 修改密码
	 * @description 修改成功后，需要重新登录获取新的token
	 * data 请求参数 说明
	 * @param {String} oldPassword 旧密码
	 * @param {String} newPassword 新密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	updatePwd(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/updatePwd',
		});
	},
	/**
	 * 重置密码
	 * data 请求参数 说明
	 * @param {String} password 重置后的密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	resetPwd(obj) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/resetPwd',
		});
	},
	/**
	 * 设置头像
	 * data 请求参数 说明
	 * @param {String} avatar 头像地址
	 * @param {Boolean} deleteOldFile 是否同时删除云储存内的头像文件
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	setAvatar(obj = {}) {
		addLoading(obj, "loading");
		//obj.isRequest = true;
		return callFunction({
			...obj,
			url: 'user/kh/setAvatar',
		});
	},
	/**
	 * 设置昵称等用户展示的个人信息
	 * data 请求参数 说明
	 * @param {String} nickname 昵称
	 * @param {String} avatar 头像
	 * @param {Number} gender 性别
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	updateUser(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/updateUser'
		});
	},
	/**
	 * 获取用户最新信息
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 错误信息
	 * @param {Object} userInfo 用户信息
	 */
	getCurrentUserInfo(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/getMyUserInfo',
		});
	},
	/**
	 * token校验
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} uid 当前token对应的用户uid
	 * @param {Object} userInfo 当前用户信息
	 * @param {Array} role 当前用户角色
	 * @param {Array} permission 当前用户权限
	 */
	checkToken(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/pub/checkToken',
		});
	},
	/**
	 * 绑定手机号
	 * data 请求参数 说明
	 * @param {String} mobile 手机号
	 * @param {String} code 手机收到的验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindMobile(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			return callFunction({
				...obj,
				url: 'user/kh/bindMobile',
			});
		}, debounceTime, true, "bindMobile");
	},
	/**
	 * 解绑手机号
	 * data 请求参数 说明
	 * @param {String} mobile 手机号
	 * @param {String} code 手机收到的验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	unbindMobile(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			return callFunction({
				...obj,
				url: 'user/kh/unbindMobile',
			});
		}, debounceTime, true, "unbindMobile");
	},
	/**
	 * 绑定新的手机号（换绑手机号）
	 * data 请求参数 说明
	 * @param {String} oldMobile 旧手机号码
	 * @param {String} oldMobileCode 旧手机收到的验证码
	 * @param {String} mobile 新手机号码
	 * @param {String} code 新手机收到的验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindNewMobile(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			return callFunction({
				...obj,
				url: 'user/kh/bindNewMobile',
			});
		}, debounceTime, true, "bindNewMobile");
	},
	/**
	 * 手机号登录(手机号+手机验证码)
	 * data 请求参数 说明
	 * @param {String} mobile 手机号
	 * @param {String} code 验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 注册完成自动登录之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginBySms(obj = {}) {
		return debounce(() => {
			addLoading(obj, "login");
			return callFunction({
				url: 'user/pub/loginBySms',
				...obj
			});
		}, debounceTime, true, "login");
	},
	/**
	 * 发送手机号验证码
	 * data 请求参数 说明
	 * @param {String} mobile 手机号
	 * @param {String} type  验证码类型
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {Object} requestRes 原始返回数据
	 * @param {Object} requestParam 包含服务供应商和发送的手机号
	 */
	sendSmsCode(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			return callFunction({
				...obj,
				url: 'user/pub/sendSmsCode',
			});
		}, debounceTime, true, "sendSmsCode");
	},
	/**
	 * APP端 手机一键登录
	 * data 请求参数 说明
	 * @param {String} access_token 			uni.login登录成功后，返回的access_token参数
	 * @param {String} openid 						uni.login登录成功后，返回的openid参数
	 * @param {String} type 							指定操作类型，可选值为login、register，不传此参数时表现为手机号已注册则登录，手机号未注册则进行注册
	 * @param {String} password 					密码，type为register时生效
	 * @param {String} inviteCode 				邀请人的邀请码，type为register时生效
	 * @param {String} myInviteCode 			设置当前注册用户自己的邀请码，type为register时生效
	 * res 返回参数说明
	 * @param {Number} code			错误码，0表示成功
	 * @param {String} msg				详细信息
	 * @param {String} uid 			当前token对应的用户uid
	 * @param {String} type			操作类型，login为登录、register为注册
	 * @param {String} mobile		登录者手机号
	 * @param {String} userInfo	用户全部信息
	 * @param {String} token			登录成功之后返回的token信息
	 * @param {String} tokenExpired		token过期时间
	 */
	loginByUniverify(obj = {}) {
		addLoading(obj, "login");
		if (typeof obj.needAlert === "undefined") obj.needAlert = true;
		// #ifdef APP-PLUS
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'univerify',
				univerifyStyle: obj.univerifyStyle,
				success: (res) => {
					let dataJson = Object.assign(obj.data, res.authResult);
					callFunction({
						url: 'user/pub/loginByUniverify',
						...obj,
						data: dataJson,
						success: (res) => {
							if (typeof obj.success === "function") obj.success(res);
							resolve(res);
						},
						fail: (err) => {
							if (typeof obj.fail === "function") obj.fail(err);
							reject(err);
						}
					});
				},
				fail: (err) => {
					if (typeof obj.fail === "function") obj.fail(err);
					reject(err);
				},
				complete: (res) => {
					uni.vk.hideLoading();
				}
			});
		});
		// #endif
		// #ifndef APP-PLUS
		uni.vk.toast("请在APP中使用本机号码一键登录", "none");
		// #endif
	},

	/**
	 * 绑定邮箱
	 * data 请求参数 说明
	 * @param {String} email 邮箱
	 * @param {String} code  邮箱收到的验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindEmail(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			return callFunction({
				...obj,
				url: 'user/kh/bindEmail',
			});
		}, debounceTime, true, "bindEmail");
	},
	/**
	 * 解绑邮箱
	 * @param {String} email 邮箱
	 * @param {String} code  邮箱收到的验证码
	 */
	unbindEmail(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			return callFunction({
				...obj,
				url: 'user/kh/unbindEmail',
			});
		}, debounceTime, true, "unbindEmail");
	},
	/**
	 * 绑定新的邮箱（换绑邮箱）
	 * @param {String} oldEmail 旧邮箱码
	 * @param {String} oldEmailCode 旧邮箱收到的验证码
	 * @param {String} email 新邮箱码
	 * @param {String} code 新邮箱收到的验证码
	 */
	bindNewEmail(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			return callFunction({
				...obj,
				url: 'user/kh/bindNewEmail',
			});
		}, debounceTime, true, "bindNewEmail");
	},
	/**
	 * 邮箱登录(邮箱+邮箱验证码)
	 * data 请求参数 说明
	 * @param {String} email 邮箱
	 * @param {String} code  邮箱收到的验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 注册完成自动登录之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByEmail(obj = {}) {
		return debounce(() => {
			addLoading(obj, "login");
			return callFunction({
				url: 'user/pub/loginByEmail',
				...obj
			});
		}, debounceTime, true, "login");
	},
	/**
	 * 发送邮件验证码
	 * data 请求参数 说明
	 * @param {String} email 邮箱
	 * @param {String} type  验证码类型
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} email 手机号
	 * @param {String} verifyCode 验证码
	 */
	sendEmailCode(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			return callFunction({
				...obj,
				url: 'user/pub/sendEmailCode',
			});
		}, debounceTime, true, "sendEmailCode");
	},
	/**
	 * 根据邮箱+验证码重置密码
	 * data 请求参数 说明
	 * @param {String} password 重置后的密码
	 * @param {String} code 验证码
	 * @param {String} email 邮箱号码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	resetPasswordByEmail(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			return callFunction({
				...obj,
				url: 'user/pub/resetPasswordByEmail',
			});
		}, debounceTime, true, "resetPasswordByEmail");
	},
	/**
	 * 设置验证码
	 * @description 设置验证码(此接口正式环境不要暴露,故写在了sys目录下)
	 * data 请求参数 说明
	 * @param {String} email  邮箱
	 * @param {String} mobile 手机号
	 * @param {String} type  验证码类型
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} email 邮箱
	 * @param {String} mobile 手机号
	 * @param {String} verifyCode 验证码(uni 1.1.2开始不再返回verifyCode)
	 */
	setVerifyCode(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/sys/setVerifyCode',
		});
	},
	/**
	 * 微信登录获取用户code
	 */
	getWeixinCode(data = {}) {
		return new Promise((resolve, reject) => {
			let { encryptedKey } = data;
			if (encryptedKey) {
				resolve();
				return;
			}
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				success(res) {
					resolve(res.code)
				},
				fail(err) {
					reject(new Error('微信登录失败'))
				}
			})
			// #endif
			// #ifdef APP-PLUS
			plus.oauth.getServices((services) => {
				let weixinAuthService = services.find((service) => {
					return service.id === 'weixin';
				});
				if (weixinAuthService) {
					weixinAuthService.authorize(function(res) {
						resolve(res.code);
					}, function(err) {
						console.log(err);
						reject(new Error('微信登录失败'));
					});
				}
			});
			// #endif
			// #ifdef H5
			resolve();
			// #endif
		})
	},
	/**
	 * 用户登录(微信授权)
	 * @description 用户登录(微信授权)
	 * data 请求参数 说明
	 * @param {String} code 微信登录返回的code
	 * @param {String} platform 客户端类型：mp-weixin、app-plus，默认uni-id会自动取客户端类型，但是在云函数url化等场景无法取到客户端类型，可以使用此参数指定
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByWeixin(obj = {}) {
		let that = this;
		return debounce(() => {
			addLoading(obj, "login");
			addAppid(obj);
			let { data = {} } = obj;
			return that.getWeixinCode(data).then((code) => {
				// #ifdef H5
				// H5平台需要区分环境（如微信公众号？网页H5?）
				data.vk_platform = uni.vk.h5.getEnv();
				// #endif
				return callFunction({
					url: 'user/pub/loginByWeixin',
					...obj,
					data: {
						code,
						...data
					}
				});
			});
		}, debounceTime, true, "login");
	},
	/**
	 * 获取微信openid
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} openid 用户openid
	 * @param {String} unionid 用户unionid，可以取到此值时返回
	 * @param {String} sessionKey 客户端为微信小程序时返回
	 * @param {String} accessToken 客户端为APP时返回
	 * @param {String} expiresIn 客户端为APP时返回，accessToken 接口调用凭证超时时间，单位（秒）
	 * @param {String} refreshToken 客户端为APP时返回，用于刷新accessToken
	 */
	code2SessionWeixin(obj = {}) {
		let that = this;
		addLoading(obj, "loading");
		addAppid(obj);
		let { data = {} } = obj;
		return that.getWeixinCode(data).then((code) => {
			return callFunction({
				...obj,
				url: 'user/pub/code2SessionWeixin',
				data: {
					code,
					...data,
				}
			});
		});
	},
	/**
	 * 绑定微信
	 * @description 将当前登录用户绑定微信
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindWeixin(obj = {}) {
		let that = this;
		return debounce(() => {
			addLoading(obj, "loading");
			addAppid(obj);
			let { data = {} } = obj;
			return that.getWeixinCode(data).then((code) => {
				// #ifdef H5
				// H5平台需要区分环境（如微信公众号？网页H5?）
				data.vk_platform = uni.vk.h5.getEnv();
				// #endif
				return callFunction({
					...obj,
					url: 'user/kh/bindWeixin',
					data: {
						code,
						...data
					}
				});
			});
		}, debounceTime, true, "bindWeixin");
	},
	/**
	 * 解绑微信
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	unbindWeixin(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			addAppid(obj);
			let { data = {} } = obj;
			// #ifdef H5
			// H5平台需要区分环境（如微信公众号？网页H5?）
			data.vk_platform = uni.vk.h5.getEnv();
			obj.data = data;
			// #endif
			return callFunction({
				...obj,
				url: 'user/kh/unbindWeixin',
			});
		}, debounceTime, true, "unbindWeixin");
	},
	/**
	 * 获取小程序绑定的手机号
	 * data 请求参数
	 * @param {String} encryptedData
	 * @param {String} iv
	 * @param {String} sessionKey
	 */
	getPhoneNumber(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			addAppid(obj);
			return callFunction({
				...obj,
				url: 'user/pub/getPhoneNumber'
			});
		}, debounceTime, true, "getPhoneNumber");
	},
	/**
	 * 通过微信小程序绑定的手机号登录
	 * data 请求参数 说明
	 * @param {String} encryptedData
	 * @param {String} iv
	 * @param {String} sessionKey
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByWeixinPhoneNumber(obj = {}) {
		return debounce(() => {
			addLoading(obj, "login");
			addAppid(obj);
			return callFunction({
				url: 'user/pub/loginByWeixinPhoneNumber',
				...obj
			});
		}, debounceTime, true, "login");
	},
	/**
	 * 生成微信小程序码
	 * @param {String} scene        自定义参数最大32个可见字符 只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~
	 * @param {String} page         必须是已经发布的小程序存在的页面（否则报错），例如 pages/index/index, 根路径前不要填加 /,不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
	 * @param {number} width        二维码的宽度，单位 px，最小 280px，最大 1280px
	 * @param {boolean} auto_color  自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调，默认 false
	 * @param {Object} line_color   auto_color 为 false 时生效，使用 rgb 设置颜色 例如 {"r":"xxx","g":"xxx","b":"xxx"} 十进制表示
	 * @param {boolean} is_hyaline  是否需要透明底色，为 true 时，生成透明底色的小程序
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	getWeixinMPqrcode(obj = {}) {
		addLoading(obj, "create");
		addAppid(obj);
		// 如果env_version传auto，则自动获取当前小程序版本
		if (obj.data && obj.data.env_version === "auto") {
			obj.data.env_version = vk.pubfn.getMiniProgramEnvVersion();
		}
		return callFunction({
			...obj,
			url: 'user/kh/getWeixinMPqrcode',
		});
	},
	/**
	 * 生成微信小程序scheme码
	 * data 请求参数 说明
	 * @param {String} path    小程序页面路径
	 * @param {String} query   小程序页面参数
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	getWeixinMPscheme(obj = {}) {
		addLoading(obj, "create");
		addAppid(obj);
		// 如果env_version传auto，则自动获取当前小程序版本
		if (obj.data && obj.data.env_version === "auto") {
			obj.data.env_version = vk.pubfn.getMiniProgramEnvVersion();
		}
		return callFunction({
			...obj,
			url: 'user/kh/getWeixinMPscheme',
		});
	},
	/**
	 * 生成微信小程序url链接
	 * data 请求参数 说明
	 * @param {String} path    小程序页面路径
	 * @param {String} query   小程序页面参数
	 * @param {String} env_version  默认值"release"。要打开的小程序版本。正式版为 "release"，体验版为"trial"，开发版为"develop"，仅在微信外打开时生效
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	getWeixinMPurl(obj = {}) {
		addLoading(obj, "create");
		addAppid(obj);
		// 如果env_version传auto，则自动获取当前小程序版本
		if (obj.data && obj.data.env_version === "auto") {
			obj.data.env_version = vk.pubfn.getMiniProgramEnvVersion();
		}
		return callFunction({
			...obj,
			url: 'user/kh/getWeixinMPurl',
		});
	},
	/**
	 * 获取公众号jsapi签名
	 * @param {String} url 浏览器上的地址，不传则自动获取
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	getWeiXinJsapiSign(obj = {}) {
		// 此接口仅微信公众号可调用
		// #ifdef H5
		let env = vk.h5.getEnv();
		if (env === "h5-weixin") {
			if (!obj.data) {
				obj.data = {};
			}
			if (!obj.data.url) {
				obj.data.url = window.location.href.split('#')[0];
			}
			return callFunction({
				...obj,
				url: 'user/pub/getWeiXinJsapiSign',
			});
		}
		// #endif
	},
	/**
	 * 获取支付宝code
	 */
	getAlipayCode() {
		// #ifdef APP-PLUS || MP-ALIPAY
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'alipay',
				success(res) {
					resolve(res.code);
				},
				fail(err) {
					reject(new Error('支付宝登录失败'));
				}
			});
		});
		// #endif
	},
	/**
	 * 支付宝登录
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByAlipay(obj = {}) {
		let that = this;
		return debounce(() => {
			addLoading(obj, "login");
			addAppid(obj);
			let { data = {} } = obj;
			return that.getAlipayCode().then((code) => {
				return callFunction({
					url: 'user/pub/loginByAlipay',
					...obj,
					data: {
						...data,
						code: code
					}
				});
			});
		}, debounceTime, true, "login");
	},
	/**
	 * 获取支付宝openid
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} openid 用户openid
	 * @param {String} accessToken 客户端为APP时返回
	 * @param {String} expiresIn 客户端为APP时返回，accessToken 接口调用凭证超时时间，单位（秒）
	 * @param {String} refreshToken 客户端为APP时返回，用于刷新accessToken
	 * @param {String} reExpiresIn refreshToken超时时间，单位（秒）
	 */
	code2SessionAlipay(obj = {}) {
		let that = this;
		addLoading(obj, "loading");
		addAppid(obj);
		let { data = {} } = obj;
		return that.getAlipayCode().then((code) => {
			return callFunction({
				...obj,
				url: 'user/pub/code2SessionAlipay',
				data: {
					...data,
					code: code
				}
			});
		});
	},
	/**
	 * 绑定支付宝
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindAlipay(obj = {}) {
		let that = this;
		return debounce(() => {
			addLoading(obj, "loading");
			addAppid(obj);
			let { data = {} } = obj;
			return that.getAlipayCode().then((code) => {
				return callFunction({
					...obj,
					url: 'user/kh/bindAlipay',
					data: {
						...data,
						code: code
					}
				});
			});
		}, debounceTime, true, "bindAlipay");
	},
	/**
	 * 解绑支付宝
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	unbindAlipay(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			addAppid(obj);
			return callFunction({
				...obj,
				url: 'user/kh/unbindAlipay',
			});
		}, debounceTime, true, "unbindAlipay");
	},
	/**
	 * 生成支付宝小程序码
	 * @param {String} page         必须是已经发布的小程序存在的页面（否则报错），例如 pages/index/index, 根路径前不要填加 /,不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
	 * @param {String} scene        最大32个可见字符，只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~，其它字符请自行编码为合法字符（因不支持%，中文无法使用 urlencode 处理，请使用其他编码方式）
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	getAlipayMiniCode(obj = {}) {
		addLoading(obj, "create");
		addAppid(obj);
		return callFunction({
			...obj,
			url: 'user/kh/getAlipayMiniCode',
		});
	},
	/**
	 * 密码加密测试(暂不用)
	 */
	encryptPwd(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/sys/encryptPwd',
		});
	},
	// 1.1.2新增
	/**
	 * 设置用户邀请码(自动生成)
	 * @description 针对未生成邀请码的用户使用此方法生成邀请码(自动生成)
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} myInviteCode 最终设置的邀请码
	 */
	setUserInviteCode(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/setUserInviteCode',
		});
	},
	/**
	 * 用户接受邀请
	 * @description 此接口用于在注册之后再填写邀请码的场景，多数情况下不会用到此接口而是在注册时填写邀请码
	 * data 请求参数 说明
	 * @param {String} inviteCode 邀请人的邀请码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	acceptInvite(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/acceptInvite',
		});
	},
	/**
	 * 获取接受邀请的用户清单
	 * data 请求参数 说明
	 * @param {Number}         pageIndex 当前页码
	 * @param {Number}         pageSize  每页显示数量
	 * @param {Array<Object>}  sortRule  排序规则
	 * @param {object}         formData  查询条件数据源
	 * @param {Array<Object>}  columns   查询条件规则
	 * res 返回参数说明
	 * @param {Number}         code      错误码，0表示成功
	 * @param {String}         msg       详细信息
	 */
	getInvitedUser(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/getInvitedUser',
		});
	},
	/**
	 * 根据手机验证码重置账号密码
	 * data 请求参数 说明
	 * @param {String} password 重置后的密码
	 * @param {String} code 验证码
	 * @param {String} mobile 手机号
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	resetPasswordByMobile(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/pub/resetPasswordByMobile',
		});
	},
	/**
	 * 获取我拥有的菜单列表
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} menus 树形结构的菜单
	 * @param {String} menuList 数组结构的菜单
	 * @param {String} userInfo 用户信息
	 */
	getMenu(obj = {}) {
		return callFunction({
			...obj,
			url: 'user/kh/getMenu'
		});
	},
	/**
	 * 添加文件上传记录
	 * data 请求参数 说明
	 * @param {String} url					文件外网访问url
	 * @param {String} name 				文件名
	 * @param {Number} size				文件大小
	 * @param {String} file_id			文件id
	 * @param {String} provider		供应商
	 * @param {String} category_id 分类ID
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	addUploadRecord(obj = {}) {
		let { fileType, filePath } = obj;
		if (fileType === "image") {
			uni.getImageInfo({
				src: filePath,
				success: function(res) {
					return callFunction({
						...obj,
						url: 'user/kh/addUploadRecord',
						data: {
							...obj.data,
							orientation: res.orientation,
							width: res.width,
							height: res.height
						}
					});
				},
				fail: function(err) {
					console.error(err)
				}
			});
		} else if (fileType === "video") {
			uni.getVideoInfo({
				src: filePath,
				success: function(res) {
					let duration = Number(res.duration) || 0;
					duration = parseFloat(duration.toFixed(3));
					return callFunction({
						...obj,
						url: 'user/kh/addUploadRecord',
						data: {
							...obj.data,
							duration,
							width: res.width,
							height: res.height
						}
					});
				},
				fail: function(err) {
					console.error(err)
				}
			});
		} else {
			return callFunction({
				...obj,
				url: 'user/kh/addUploadRecord'
			});
		}
	},
	/**
	 * 获取QQ code
	 */
	getQQCode() {
		// #ifdef APP-PLUS || MP-QQ
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'qq',
				success(res) {
					// #ifdef APP-PLUS
					resolve({
						accessToken: res.authResult.access_token,
					})
					// #endif
					// #ifdef MP-QQ
					resolve({
						code: res.code,
					})
					// #endif
				},
				fail(err) {
					reject(new Error('QQ登录失败'));
				}
			});
		});
		// #endif
	},
	/**
	 * QQ登录
	 * data 请求参数 说明
	 * @param {String} type 可传login或register，若为login：则不存在不会自动注册，若为register，则用户存在会报错，不传，则存在自动登录，不存在，则注册。
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByQQ(obj = {}) {
		let that = this;
		return debounce(() => {
			addLoading(obj, "login");
			let { data = {} } = obj;
			return that.getQQCode().then(({ code, accessToken } = {}) => {
				return callFunction({
					url: 'user/pub/loginByQQ',
					...obj,
					data: {
						...data,
						code,
						accessToken
					}
				});
			});
		}, debounceTime, true, "login");
	},
	/**
	 * 绑定QQ
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindQQ(obj = {}) {
		let that = this;
		return debounce(() => {
			addLoading(obj, "loading");
			let { data = {} } = obj;
			return that.getQQCode().then(({ code, accessToken } = {}) => {
				return callFunction({
					...obj,
					url: 'user/kh/bindQQ',
					data: {
						...data,
						code,
						accessToken
					}
				});
			});
		}, debounceTime, true, "bindQQ");
	},
	/**
	 * 解绑QQ
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	unbindQQ(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			return callFunction({
				...obj,
				url: 'user/kh/unbindQQ',
			});
		}, debounceTime, true, "unbindQQ");
	},
	/**
	 * 获取抖音openid
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} openid 用户openid
	 * @param {String} unionid 用户unionid，可以取到此值时返回
	 */
	code2SessionQQ(obj = {}) {
		let that = this;
		addLoading(obj, "loading");
		let { data = {} } = obj;
		return that.getQQCode(data).then(({ code, accessToken }) => {
			return callFunction({
				...obj,
				url: 'user/pub/code2SessionQQ',
				data: {
					code,
					...data,
				}
			});
		});
	},
	/**
	 * 生成qq小程序码
	 * @param {String} path         必须是已经发布的小程序存在的页面（否则报错），例如 pages/index/index, 根路径前不要填加 /,不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	getQQMiniCode(obj = {}) {
		addLoading(obj, "create");
		return callFunction({
			...obj,
			url: 'user/kh/getQQMiniCode',
		});
	},
	/**
	 * App升级中心 - 检测是当前版本是否需要升级
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	checkVersion(obj = {}) {
		return callFunction({
			...obj,
			url: 'user/pub/checkVersion',
		});
	},
	/**
	 * 用户登录，使用token登录，仅为了实现当token过期时间设置很长时，做用户登录统计会有问题，因此需要每天执行一次token登录来增加登录日志，方便做用户每日登录统计
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	loginByToken(obj = {}) {
		const vk = uni.vk;
		if (!vk.checkToken()) {
			// token无效，则无需执行
			return;
		}
		// 获取最新一次执行时间
		const keyName = "pub-vk.userCenter.loginByToken";
		let time = vk.getStorageSync(keyName) || 0;
		const { todayStart, todayEnd } = vk.pubfn.getCommonTime();
		if (time >= todayStart && time <= todayEnd) {
			// 如果今日执行过，则无需执行
			// console.log("今日执行过loginByToken")
			return;
		}
		// 执行
		return callFunction({
			...obj,
			url: 'user/pub/loginByToken',
			success: (res) => {
				if (typeof obj.success === "function") obj.success(res);
				// 记录最新一次执行时间
				vk.setStorageSync(keyName, Date.now());
			}
		});
	},
	/**
	 * 抖音登录获取用户code
	 */
	getDouyinCode(data = {}) {
		return new Promise((resolve, reject) => {
			let { encryptedKey } = data;
			if (encryptedKey) {
				resolve();
				return;
			}
			// #ifndef MP-TOUTIAO
			vk.toast("请在抖音小程序中打开");
			return;
			// #endif

			// #ifdef MP-TOUTIAO
			uni.login({
				provider: '',
				success(res) {
					resolve(res.code)
				},
				fail(err) {
					reject(new Error('抖音登录失败'))
				}
			})
			// #endif
		})
	},
	/**
	 * 用户登录(抖音登录)
	 * @description 用户登录(抖音登录)
	 * data 请求参数 说明
	 * @param {String} code 抖音登录返回的code
	 * @param {String} platform 客户端类型：mp-weixin、app-plus，默认uni-id会自动取客户端类型，但是在云函数url化等场景无法取到客户端类型，可以使用此参数指定
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByDouyin(obj = {}) {
		let that = this;
		return debounce(() => {
			addLoading(obj, "login");
			addAppid(obj);
			let { data = {} } = obj;
			return that.getDouyinCode(data).then((code) => {
				return callFunction({
					url: 'user/pub/loginByDouyin',
					...obj,
					data: {
						code,
						...data
					}
				});
			});
		}, debounceTime, true, "login");
	},
	/**
	 * 绑定抖音
	 * @description 将当前登录用户绑定抖音
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindDouyin(obj = {}) {
		let that = this;
		return debounce(() => {
			addLoading(obj, "loading");
			addAppid(obj);
			let { data = {} } = obj;
			return that.getDouyinCode(data).then((code) => {
				return callFunction({
					...obj,
					url: 'user/kh/bindDouyin',
					data: {
						code,
						...data
					}
				});
			});
		}, debounceTime, true, "bindDouyin");
	},
	/**
	 * 解绑抖音
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	unbindDouyin(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			addAppid(obj);
			let { data = {} } = obj;
			return callFunction({
				...obj,
				url: 'user/kh/unbindDouyin',
			});
		}, debounceTime, true, "unbindDouyin");
	},
	/**
	 * 通过抖音小程序绑定的手机号登录
	 * data 请求参数 说明
	 * @param {String} encryptedData
	 * @param {String} iv
	 * @param {String} sessionKey
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByDouyinPhoneNumber(obj = {}) {
		return debounce(() => {
			addLoading(obj, "login");
			addAppid(obj);
			return callFunction({
				url: 'user/pub/loginByDouyinPhoneNumber',
				...obj
			});
		}, debounceTime, true, "login");
	},
	/**
	 * 获取抖音openid
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} openid 用户openid
	 * @param {String} unionid 用户unionid，可以取到此值时返回
	 */
	code2SessionDouyin(obj = {}) {
		let that = this;
		addLoading(obj, "loading");
		addAppid(obj);
		let { data = {} } = obj;
		return that.getDouyinCode(data).then((code) => {
			return callFunction({
				...obj,
				url: 'user/pub/code2SessionDouyin',
				data: {
					code,
					...data,
				}
			});
		});
	},
	/**
	 * 生成抖音小程序码
	 * @param {String} path         必须是已经发布的小程序存在的页面（否则报错），例如 pages/index/index, 根路径前不要填加 /,不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	getDouyinMiniCode(obj = {}) {
		addLoading(obj, "create");
		addAppid(obj);
		return callFunction({
			...obj,
			url: 'user/kh/getDouyinMiniCode',
		});
	},
	/**
	 * 华为登录获取用户code
	 */
	getHuaweiCode(data = {}) {
		return new Promise((resolve, reject) => {
			let { encryptedKey } = data;
			if (encryptedKey) {
				resolve();
				return;
			}
			// #ifndef MP-HARMONY || APP-HARMONY
			vk.toast("请在鸿蒙系统中打开");
			return;
			// #endif

			// #ifdef MP-HARMONY || APP-HARMONY
			uni.login({
				success(res) {
					resolve(res.code)
				},
				fail(err) {
					console.error('华为登录失败: ', err)
					reject(new Error('华为登录失败'))
				}
			})
			// #endif
		})
	},
	/**
	 * 用户登录（华为账号登录）
	 * data 请求参数 说明
	 * @param {String} code 登录返回的code
	 * @param {String} platform 客户端类型：mp-weixin、app-plus，默认uni-id会自动取客户端类型，但是在云函数url化等场景无法取到客户端类型，可以使用此参数指定
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByHuawei(obj = {}) {
		let that = this;
		return debounce(() => {
			addLoading(obj, "login");
			addAppid(obj);
			let { data = {} } = obj;
			return that.getHuaweiCode(data).then((code) => {
				return callFunction({
					url: 'user/pub/loginByHuawei',
					...obj,
					data: {
						code,
						...data
					}
				});
			});
		}, debounceTime, true, "login");
	},
	/**
	 * 绑定华为账号
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindHuawei(obj = {}) {
		let that = this;
		return debounce(() => {
			addLoading(obj, "loading");
			addAppid(obj);
			let { data = {} } = obj;
			return that.getHuaweiCode(data).then((code) => {
				return callFunction({
					...obj,
					url: 'user/kh/bindHuawei',
					data: {
						code,
						...data
					}
				});
			});
		}, debounceTime, true, "bindHuawei");
	},
	/**
	 * 解绑华为账号
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	unbindHuawei(obj = {}) {
		return debounce(() => {
			addLoading(obj, "loading");
			addAppid(obj);
			let { data = {} } = obj;
			return callFunction({
				...obj,
				url: 'user/kh/unbindHuawei',
			});
		}, debounceTime, true, "unbindHuawei");
	},
	/**
	 * 通过华为账号绑定的手机号登录
	 * data 请求参数 说明
	 * @param {String} encryptedData
	 * @param {String} iv
	 * @param {String} sessionKey
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByHuaweiPhoneNumber(obj = {}) {
		return debounce(() => {
			addLoading(obj, "login");
			addAppid(obj);
			return callFunction({
				url: 'user/pub/loginByHuaweiPhoneNumber',
				...obj
			});
		}, debounceTime, true, "login");
	},
	/**
	 * 获取华为openid
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} openid 用户openid
	 * @param {String} unionid 用户unionid，可以取到此值时返回
	 */
	code2SessionHuawei(obj = {}) {
		let that = this;
		addLoading(obj, "loading");
		addAppid(obj);
		let { data = {} } = obj;
		return that.getHuaweiCode(data).then((code) => {
			return callFunction({
				...obj,
				url: 'user/pub/code2SessionHuawei',
				data: {
					code,
					...data,
				}
			});
		});
	},
	/**
	 * 苹果登录获取用户userInfo
	 */
	getAppleCode(data = {}) {
		return new Promise(async (resolve, reject) => {
			try {
				let { encryptedKey } = data;
				if (encryptedKey) {
					resolve();
					return;
				}
				const provider = 'apple';
				const loginRes = await uni.login({
					provider
				});
				const getUserInfoRes = await uni.getUserInfo({
					provider
				});
				resolve(getUserInfoRes.userInfo);
			} catch (err) {
				console.error('苹果登录失败: ', err);
				reject(err);
				return;
			}
		});
	},
	/**
	 * 用户登录（苹果账号登录）
	 * data 请求参数 说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByApple(obj = {}) {
		let that = this;
		return debounce(() => {
			addLoading(obj, "login");
			addAppid(obj);
			let { data = {} } = obj;
			return that.getAppleCode(data).then((userInfo) => {
				return callFunction({
					url: 'user/pub/loginByApple',
					...obj,
					data: {
						identityToken: userInfo.identityToken,
						fullName: userInfo.fullName,
						...data
					}
				});
			});
		}, debounceTime, true, "login");
	}
};