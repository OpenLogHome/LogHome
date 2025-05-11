let vk = {};
let counterNum = 0;
let uniCloudEnvs = {}; // uniCloud 环境列表
let lastToLoginTime = 0;

import cloudStorage from '../../libs/cloud-storage/index.js'

class CallFunctionUtil {
	constructor() {
		this.config = {
			// 是否开启测试环境的云函数，true：使用测试环境，false：使用正式环境，默认true
			isTest: false,
			// 设为false可关闭打印日志
			debug: true,
			// 云函数路由（主函数名）
			functionName: "router",
			// 云函数路由（开发测试函数名）
			testFunctionName: "router-test",
			// 云函数url化后对应的url地址
			functionNameToUrl: {
				"router": "https://xxxxxxx.bspapp.com/http/router",
				"router-test": "https://xxxxxxx.bspapp.com/http/router"
			},
			// vk.callFunction的isRequest的默认值
			isRequestDefault: false,
			// 默认时区（中国为8）
			targetTimezone: 8,
			// 客户端登录页面地址
			login: {
				url: '/pages_template/uni-id/login/index/index'
			},
			// 请求配置
			request: {
				// 公共请求参数(每次请求都会带上的参数)
				dataParam: {}
			},
			// 日志风格
			logger: {
				colorArr: [
					"#0095ff",
					"#67C23A"
				]
			},
			// 缓存键名 - token（请勿修改）
			uniIdTokenKeyName: "uni_id_token",
			// 缓存键名 - token过期时间（请勿修改）
			uniIdTokenExpiredKeyName: "uni_id_token_expired",
			// 缓存键名 - 当前登录用户信息（请勿修改）
			uniIdUserInfoKeyName: "uni_id_user_info",
			// 缓存键名 - 公共请求参数（请勿修改）
			requestGlobalParamKeyName: "vk_request_global_param",
			// 监听token刷新事件的事件名
			onRefreshTokenEventName: "onRefreshToken",
			// 自定义组件配置
			components: {}
		}
		/**
		 * 获取我的token
		 * vk.getToken();
		 */
		this.getToken = (res = {}) => {
			let config = this.config;
			return vk.getStorageSync(config.uniIdTokenKeyName) || undefined;
		}
		/**
		 * 保存新的token
		 * 可通过下方的代码监听token的改变（写在app.vue的onLaunch内）
		vk.$on('onRefreshToken',(data) => {
			console.log('token改变监听：', data);
		});
		 */
		this.saveToken = (res = {}) => {
			let config = this.config;
			let nowToken = vk.getStorageSync(config.uniIdTokenKeyName);
			if (nowToken === res.token) {
				return false;
			}
			vk.setStorageSync(config.uniIdTokenKeyName, res.token);
			vk.setStorageSync(config.uniIdTokenExpiredKeyName, res.tokenExpired);
			this.emitRefreshToken(res); // 触发token刷新事件
			if (this.config.debug) console.log("--------【token已更新】--------");
			return true;
		}
		// 删除token，并删除userInfo缓存
		this.deleteToken = () => {
			let config = this.config;
			vk.removeStorageSync(config.uniIdTokenKeyName);
			vk.removeStorageSync(config.uniIdTokenExpiredKeyName);
			this.deleteUserInfo();
			this.emitRefreshToken(); // 触发token刷新事件
			if (this.config.debug) console.log("--------【token已删除】--------");
		}
		// 更新userInfo缓存
		this.updateUserInfo = (res = {}) => {
			let config = this.config;
			let {
				userInfo = {}
			} = res;
			if (typeof vk.setVuex === "function") {
				// 有安装vuex则使用vuex
				vk.setVuex('$user.userInfo', userInfo);
			} else {
				// 否则使用本地缓存
				vk.setStorageSync(config.uniIdUserInfoKeyName, userInfo);
			}
			//if (this.config.debug) console.log("--------【用户信息已更新】--------");
		}
		// 删除userInfo缓存
		this.deleteUserInfo = (res = {}) => {
			let {
				log = true
			} = res;
			let config = this.config;
			if (typeof vk.setVuex === "function") {
				// 有安装vuex则使用vuex
				vk.setVuex('$user.userInfo', {});
				vk.setVuex('$user.permission', []);
				vk.removeStorageSync(config.uniIdUserInfoKeyName);
			} else {
				// 否则使用本地缓存
				vk.removeStorageSync(config.uniIdUserInfoKeyName);
			}
			if (this.config.debug && log) console.log("--------【用户信息已删除】--------");
		}
		// 检查token是否有效(本地版)
		// let valid = vk.callFunctionUtil.checkToken();
		this.checkToken = (res = {}) => {
			let config = this.config;
			let token = uni.getStorageSync(config.uniIdTokenKeyName);
			let tokenExpired = uni.getStorageSync(config.uniIdTokenExpiredKeyName);
			let valid = false;
			if (token && tokenExpired && tokenExpired > Date.now()) {
				valid = true;
			}
			return valid;
		}
		/**
		 * 触发监听token更新事件
		 */
		this.emitRefreshToken = (data = {}) => {
			let config = this.config;
			return vk.$emit(config.onRefreshTokenEventName, data); // 触发token刷新事件
		}
		/**
		 * 监听token更新事件
		 */
		this.onRefreshToken = (callback) => {
			let config = this.config;
			return vk.$on(config.onRefreshTokenEventName, callback);
		}
		/**
		 * 移除token更新事件
		 */
		this.offRefreshToken = (callback) => {
			let config = this.config;
			return vk.$off(config.onRefreshTokenEventName, callback);
		}
		/**
		 * 修改请求配置中的公共请求参数
		 * 若把shop-manage改成*则代表全局
			vk.callFunctionUtil.updateRequestGlobalParam({
				"shop-manage":{
					regExp:"^xxx/kh/",
					data:{
						shop_id : shop_id
					}
				}
			});
			对应的callFunction中增加参数globalParamName:"shop-manage"
			vk.callFunction({
				url: 'xxx/xxxxxx',
				title: '请求中...',
				globalParamName:"shop-manage",// 如果设置了正则规则,则不需要此参数
				data: {},
				success(data) {
				}
			});
		 */
		this.updateRequestGlobalParam = (data = {}, setKey) => {
			let config = this.config;
			if (setKey) {
				// 覆盖对象
				config.request.dataParam = data;
			} else {
				// 覆盖参数（有就覆盖，没有则新增）
				let dataParam = uni.getStorageSync(config.requestGlobalParamKeyName) || {};
				config.request.dataParam = Object.assign(dataParam, data);
			}
			vk.setStorageSync(config.requestGlobalParamKeyName, config.request.dataParam);
		}
		/**
		 * 获取请求配置中的公共请求参数
			vk.callFunctionUtil.getRequestGlobalParam();
		 */
		this.getRequestGlobalParam = (globalParamName = "*") => {
			let config = this.config;
			let data = config.request.dataParam;
			if (!data || JSON.stringify(data) === "{}") {
				data = uni.getStorageSync(config.requestGlobalParamKeyName) || {};
				config.request.dataParam = data;
			}
			let param = data[globalParamName] || {};
			return JSON.parse(JSON.stringify(param));
		}
		/**
		 * 删除请求配置中的公共请求参数
		 * globalParamName 不传代表删除所有
			vk.callFunctionUtil.deleteRequestGlobalParam(globalParamName);
		 */
		this.deleteRequestGlobalParam = (globalParamName) => {
			let config = this.config;
			let globalParam = uni.getStorageSync(config.requestGlobalParamKeyName) || {};
			if (globalParamName) {
				delete globalParam[globalParamName];
			} else {
				globalParam = {};
			}
			config.request.dataParam = globalParam;
			vk.setStorageSync(config.requestGlobalParamKeyName, globalParam);
		}
		// 拦截器
		this.interceptor = {
			// 拦截1301、1302错误码（非法token和token失效）
			login: (obj = {}) => {
				let nowTime = Date.now();
				if (nowTime - lastToLoginTime < 300) {
					return false;
				}
				lastToLoginTime = nowTime;
				let {
					params,
					res
				} = obj;
				let config = this.config;
				let callFunction = this.callFunction;
				if (config.debug) console.log("跳登录页面");
				let { tokenExpiredAutoDelete = true } = config;
				if (tokenExpiredAutoDelete) this.deleteToken();
				setTimeout(() => {
					if (config.login.url) {
						let currentPage = getCurrentPages()[getCurrentPages().length - 1];
						if (currentPage && currentPage.route && "/" + currentPage.route === config.login.url) {
							return false;
						}
						// 此处代码是为了防止首页启动时检测和正常检测冲突-----------------------------------------------------------
						if (vk.navigate.isOnLaunchToLogin) {
							setTimeout(() => {
								vk.navigate.isOnLaunchToLogin = false;
							}, 500);
							return false;
						}
						// 此处代码是为了防止首页启动时检测和正常检测冲突-----------------------------------------------------------
						uni.navigateTo({
							url: config.login.url,
							events: {
								// 监听登录成功后的事件
								loginSuccess: (data) => {
									let num = 2;
									let pages = getCurrentPages();
									if (pages.length >= num) {
										let that = pages[pages.length - num];
										if (typeof that.onLoad == "function") {
											// 重新执行页面onLoad函数
											that.onLoad(that.options);
										} else if (typeof that.init == "function") {
											// 重新执行页面初始化函数
											that.init(that.options);
										} else {
											// 重新执行一次云函数调用（还是让用户自己点比较好）
											// callFunction(params);
										}
									} else {
										// 重新执行一次云函数调用（还是让用户自己点比较好）
										// callFunction(params);
									}
								}
							}
						});
					} else {
						if (params.needAlert) {
							vk.alert(res.result.msg);
						}
					}
				}, 0);
			},
			// 全局请求失败拦截器
			fail: (obj = {}) => {
				return true;
			}
		}
		/**
		 * 云函数请求封装 - 统一入口
		 * 文档 [https://vkdoc.fsq.pub/client/pages/callFunction.html](https://vkdoc.fsq.pub/client/pages/callFunction.html)
		 * @description 通过云函数路由，1个云函数实现多个云函数的效果。
		 * @param {Object}   obj
		 * @param {String}   obj.name       大云函数名称（默认router）
		 * @param {String}   obj.url        请求路径
		 * @param {Object}   obj.data       请求参数，如 { a:1, b:"2" } 云函数内可通过 let { a, b } = data; 获取参数
		 * @param {String}   obj.title      遮罩层提示语，为空或不传则代表不显示遮罩层。
		 * @param {Boolean|Object}  obj.loading    若设置为false，即使title有值也不显示遮罩层 文档 [https://vkdoc.fsq.pub/client/pages/callFunction.html#loading](https://vkdoc.fsq.pub/client/pages/callFunction.html#loading)
		 * @param {Boolean}   [obj.loading=true] - 默认值 true，显示遮罩层
		 * @param {Boolean}   [obj.loading=false] - 可选值 false，不显示遮罩层
		 * @param {Object}    [obj.loading={ that: this, name: "loading2"}] 高级用法，在组件里使用时必须使用此方式传入this和name参数
		 * @param {Boolean}  obj.isRequest  是否使用云函数url化地址访问云函数，默认false
		 * @param {String}   obj.env        云空间环境 文档：https://vkdoc.fsq.pub/client/question/q9.html#%E5%89%8D%E7%AB%AF%E8%AF%B7%E6%B1%82%E5%A4%9A%E6%9C%8D%E5%8A%A1%E7%A9%BA%E9%97%B4
		 * @param {Boolean}  obj.needAlert  为true代表请求错误时，会有弹窗提示，默认为true
		 * @param {Boolean}   [obj.needAlert=true] - 默认值 true，请求错误时，会有弹窗提示
		 * @param {Boolean}   [obj.needAlert=false] - 可选值 false，请求错误时，没有弹窗提示
		 * @param {Number}   obj.retryCount 系统异常重试机制（表单提交时慎用，建议只用在查询请求中，即无任何数据库修改的请求中）
		 * @param {Boolean}   obj.encrypt 是否加密请求
		 * @param {Function} obj.success    请求成功时，执行的回调函数
		 * @param {Function} obj.fail  	 	  请求失败时，执行的回调函数
		 * @param {Function} obj.complete   无论请求成功与否，都会执行的回调函数
		 */
		this.callFunction = (obj = {}) => {
			let that = this;
			let { config } = that;
			let {
				url,
				data = {},
				globalParamName
			} = obj;

			if (!url) {
				vk.toast('vk.callFunction的url参数不能为空');
				return;
			}

			if (obj.retryCount) {
				// 系统异常重试机制（表单提交时慎用，建议只用在查询请求中，即无任何数据库修改的请求中）
				return that.callFunctionRetry(obj);
			}
			// 去除值为 undefined 的参数
			if (typeof data === "object") {
				obj.data = vk.pubfn.copyObject(data);
			}
			// 注入自定义全局参数开始-----------------------------------------------------------
			let globalParam = uni.getStorageSync(config.requestGlobalParamKeyName) || {};
			// 根据正则规格自动匹配全局请求参数
			for (let i in globalParam) {
				let customDate = globalParam[i];
				if (customDate.regExp) {
					if (typeof customDate.regExp === "object") {
						// 数组形式
						for (let i = 0; i < customDate.regExp.length; i++) {
							let regExp = new RegExp(customDate.regExp[i]);
							if (regExp.test(url)) {
								obj.data = Object.assign(customDate.data, obj.data);
								break;
							}
						}
					} else {
						// 字符串形式
						let regExp = new RegExp(customDate.regExp);
						if (regExp.test(url)) {
							obj.data = Object.assign(customDate.data, obj.data);
						}
					}
				}
			}
			// 根据指定globalParamName匹配全局请求参数
			let customDate = that.getRequestGlobalParam(globalParamName);
			if (customDate && JSON.stringify(customDate) !== "{}") {
				if (customDate.regExp) {
					obj.data = Object.assign(customDate.data, obj.data); // 新版本
				} else {
					obj.data = Object.assign(customDate, obj.data); // 兼容旧版本
				}
			}
			// 注入自定义全局参数结束-----------------------------------------------------------
			// 若执行的函数不是pub类型函数，先本地判断下token，可以提高效率。
			let needCheckToken = false;
			let isCloudObject = url.indexOf(".") > -1 ? true : false;
			if (isCloudObject) {
				// 云对象模式有权重之分
				// 获云对象函数权限类型
				let cloudObjectRule = that.getCloudObjectRule(url);
				if (cloudObjectRule.type !== "pub") {
					needCheckToken = true;
				}
			} else {
				// 云函数模式无权重之分，只要含kh或sys目录则需要检测token
				if (url.indexOf("/kh/") > -1 || url.indexOf("/sys/") > -1) {
					needCheckToken = true;
				}
			}
			if (needCheckToken) {
				if (!vk.checkToken()) {
					// 若本地token校验未通过，则直接执行 login 拦截器函数
					return new Promise((resolve, reject) => {
						// 执行 login 拦截器函数（跳转到页面页面）
						let res = { code: 30204, msg: "本地token校验未通过" };
						let params = obj;
						if (typeof that.interceptor.login === "function") {
							that.interceptor.login({
								res,
								params,
								vk
							});
						}
						reject(res);
					});
				}
			}
			if (typeof obj.isRequest === "undefined") {
				obj.isRequest = config.isRequestDefault;
			}

			// 判断是否需要加密请求开始-----------------------------------------------------------
			let encryptRequestConfig = {};
			if (typeof vk.getVuex === "function") {
				encryptRequestConfig = vk.getVuex("$app.config.checkEncryptRequest") || {};
			} else {
				let lifeData = vk.getStorageSync("lifeData") || {};
				encryptRequestConfig = vk.pubfn.getData(lifeData, "$app.config.checkEncryptRequest") || {};
			}
			if (encryptRequestConfig.mode === 1) {
				let list = encryptRequestConfig.list || [];
				for (let i = 0; i < list.length; i++) {
					let regExp = new RegExp(list[i]);
					if (regExp.test(url)) {
						obj.encrypt = true;
						break;
					}
				}
			}
			// 判断是否需要加密请求结束-----------------------------------------------------------

			// 执行请求
			if (obj.isRequest) {
				return that.runRequest(obj);
			} else {
				return that.runCallFunction(obj);
			}
		}

		// 设置全局默认配置
		this.setConfig = (customConfig = {}) => {
			for (let key in customConfig) {
				if (key === "vk") {
					vk = customConfig[key];
				} else if (key === "interceptor") {
					this.interceptor = Object.assign(this.interceptor, customConfig[key]);
					this.config.interceptor = customConfig[key];
				} else if (key === "myfn") {
					vk.myfn = customConfig[key];
				} else if (key === "loginPagePath") {
					// 兼容老版本
					this.config.login.url = customConfig[key];
				} else if (key === "uniCloud") {
					let uniCloudConfig = customConfig[key];
					if (uniCloudConfig && uniCloudConfig.envs) {
						for (let envKey in uniCloudConfig.envs) {
							let envItem = uniCloudConfig.envs[envKey];
							if (envItem && envItem.provider && envItem.spaceId) {
								let initConifg = {
									provider: envItem.provider,
									spaceId: envItem.spaceId
								};
								if (envItem.provider === "aliyun") {
									initConifg.clientSecret = envItem.clientSecret;
								} else if (envItem.provider === "alipay") {
									initConifg.spaceAppId = envItem.spaceAppId;
									initConifg.accessKey = envItem.accessKey;
									initConifg.secretKey = envItem.secretKey;
								}
								if (envItem.endpoint) initConifg.endpoint = envItem.endpoint;
								uniCloudEnvs[envKey] = uniCloud.init(initConifg);
							}
						}
					}
				} else if (typeof customConfig[key] === "object" && typeof this.config[key] === "object") {
					this.config[key] = Object.assign(this.config[key], customConfig[key]);
				} else if (typeof customConfig[key] !== "undefined") {
					this.config[key] = customConfig[key];
				}
			}
		}
		/**
		 * 获取vk前端配置
		 * 示例
		 * vk.callFunctionUtil.getConfig();
		 * vk.callFunctionUtil.getConfig("login.url");
		 */
		this.getConfig = (key) => {
			let config = this.config;
			if (key) {
				return vk.pubfn.getData(config, key);
			} else {
				return config;
			}
		}

		// 初始化
		this.init = (obj = {}) => {
			vk = obj.vk;
		}
		/**
		 * 上传文件 vk.uploadFile
		 * 文档：[https://vkdoc.fsq.pub/client/pages/uploadFile.html](https://vkdoc.fsq.pub/client/pages/uploadFile.html)
		 * @param {Object} 	obj													上传时的loading提示语
		 * @param {String} 	obj.title										上传时的loading提示语
		 * @param {String} 	obj.file										要上传的文件对象，file与filePath二选一即可
		 * @param {String} 	obj.filePath								要上传的文件路径，file与filePath二选一即可
		 * @param {String} 	obj.provider								云存储供应商，支持：unicloud、aliyun、qiniu
		 * @param {String} 	obj.cloudPath								指定上传后的云端文件路径（不指定会自动生成）cloudPath优先级大于cloudDirectory
		 * @param {String} 	obj.cloudDirectory					指定上传后的云端文件目录
		 * @param {String} 	obj.needSave								是否需要将图片信息保存到admin素材库
		 * @param {String} 	obj.category_id							素材库分类id，当needSave为true时生效
		 * @param {String} 	obj.uniCloud								上传到其他空间时使用，uniCloud和env二选一即可（仅provider是unicloud时支持）
		 * @param {String} 	obj.env											上传到其他空间时使用，uniCloud和env二选一即可（仅provider是unicloud时支持）
		 * @param {String} 	obj.cloudPathAsRealPath			阿里云目录支持，需HBX3.8.5以上版本才支持（仅provider是unicloud时支持）
		 * @param {String} 	obj.cloudPathRemoveChinese	删除文件名中的中文，默认为true
		 * @param {String} 	obj.errorToast							异常时是否用toast代替alert，默认为false
		 * @param {String} 	obj.needAlert								异常时是否需要alert，默认为false
		 * @param {Function} obj.onUploadProgress				监听上传进度回调
		 * @param {Function} obj.success								上传成功时，执行的回调函数
		 * @param {Function} obj.fail  	 								上传失败时，执行的回调函数
		 * @param {Function} obj.complete 							无论上传成功与否，都会执行的回调函数
		 */
		this.uploadFile = (obj = {}) => {
			let that = this;
			let config = that.config;
			if (!obj.filePath && obj.file && obj.file.path) obj.filePath = obj.file.path;
			if (obj.errorToast) obj.needAlert = false;
			// 获取文件类型(image:图片 video:视频 other:其他)
			obj.fileType = that.getFileType(obj);
			// 获取文件后缀名
			obj.suffix = that.getFileSuffix(obj);
			if (typeof obj.encrypt === "undefined") {
				obj.encrypt = vk.pubfn.getData(config, "service.cloudStorage.encrypt") || false;
			}
			if (typeof obj.env === "undefined") {
				obj.env = vk.pubfn.getData(config, "service.cloudStorage.env") || "default";
			}
			let {
				title,
				file = {},
				filePath,
				provider,
				cloudPath,
				cloudDirectory,
				needSave = false,
				category_id,
				uniCloud: myCloud,
				env,
				cloudPathAsRealPath = true, // 阿里云目录支持，需HBX3.8.5以上版本才支持
				cloudPathRemoveChinese = true, // 删除文件名中的中文
				errorToast,
				needAlert,
				fileType,
				suffix,
				encrypt
			} = obj;
			if (!provider) {
				let aliyunOSS = vk.pubfn.getData(config, "service.aliyunOSS");
				let defaultProvider = vk.pubfn.getData(config, "service.cloudStorage.defaultProvider") || "unicloud";
				if (aliyunOSS && aliyunOSS.isDefault) {
					// 兼容旧版
					provider = "aliyun";
				} else {
					// 新版
					provider = defaultProvider;
				}
			}
			obj.provider = provider;
			obj.runCloud = myCloud || uniCloudEnvs[env];
			let Logger = {};
			Logger.startTime = Date.now();
			Logger.filePath = filePath;
			let promiseRes = new Promise((resolve, reject) => {
				if (title) vk.showLoading(title, "request");
				cloudStorage[provider].uploadFile(obj)
					.then((res) => {
						// 返回值统一增加provider
						res.provider = provider;
						Logger.result = res;
						if (typeof obj.success == "function") obj.success(res);
						resolve(res);
						if (needSave) {
							// 保存文件记录到数据库
							let fileURL = res.fileURL.split("?")[0];
							vk.userCenter.addUploadRecord({
								encrypt: obj.encrypt,
								data: {
									url: fileURL,
									name: file.name || this.getFileName(res.cloudPath),
									size: file.size,
									file_id: res.fileID,
									provider,
									category_id,
								},
								filePath,
								fileType,
								success: () => {
									if (typeof obj.addSuccess == "function") obj.addSuccess(res);
								},
								fail: (err) => {
									if (typeof obj.addFail === "function") obj.addFail(err);
								},
								complete: () => {
									if (typeof obj.addComplete === "function") obj.addComplete();
								}
							});
						}
					})
					.catch((err) => {
						Logger.error = err;
						let errMsg = err.msg || err.errMsg || err.message || "";
						if (errMsg.indexOf('fail url not in domain list') > -1) {
							vk.toast('上传域名未在白名单中');
						} else {
							if (errorToast) {
								vk.toast(errMsg);
							} else if (needAlert) {
								vk.alert(errMsg);
							}
						}
						if (typeof obj.fail === "function") obj.fail(err);
						reject(err);
					})
					.finally(() => {
						if (title) vk.hideLoading("request");
						let config = this.config;
						Logger.endTime = Date.now();
						Logger.runTime = (Logger.endTime - Logger.startTime);
						let colorArr = config.logger.colorArr;
						let colorStr = colorArr[counterNum % colorArr.length];
						counterNum++;
						const providerObj = {
							"unicloud": "内置存储",
							"extStorage": "扩展存储",
							"aliyun": "阿里云oss"
						};
						let providerName = providerObj[provider] || provider;
						console.log(`%c--------【开始】【${providerName}-文件上传】--------`, 'color: ' + colorStr + ';font-size: 12px;font-weight: bold;');
						console.log("【本地文件】: ", Logger.filePath);
						console.log("【返回数据】: ", Logger.result);
						console.log("【预览地址】: ", Logger.result && Logger.result.url);
						console.log("【上传耗时】: ", Logger.runTime, "毫秒");
						console.log("【上传时间】: ", vk.pubfn.timeFormat(Logger.startTime, "yyyy-MM-dd hh:mm:ss"));
						if (Logger.error) console.error("【error】:", Logger.error);
						console.log(`%c--------【结束】【${providerName}-文件上传】--------`, 'color: ' + colorStr + ';font-size: 12px;font-weight: bold;');
						if (typeof obj.complete == "function") obj.complete();
					});
			});
			promiseRes.catch((err) => {});
			return promiseRes;
		}
	}
	// 云函数普通请求
	runCallFunction(obj = {}) {
		let that = this;
		let config = that.config;
		let {
			url,
			data,
			title,
			loading,
			isRequest,
			name,
			complete,
			uniCloud: myCloud,
			env = "default",
			secretType,
			encrypt,
			timeout
		} = obj;
		let Logger = {};
		if (title) vk.showLoading(title, "request");
		if (loading) Logger.loading = vk.setLoading(true, loading);
		if (!name) name = config.isTest ? config.testFunctionName : config.functionName;
		obj.name = name;
		if (config.debug) Logger.params = typeof data == "object" ? JSON.parse(JSON.stringify(data)) : data;
		let promiseAction = new Promise(function(resolve, reject) {
			if (config.debug) Logger.startTime = Date.now();
			let runCloud = myCloud || uniCloudEnvs[env] || uniCloud;
			let decryptFn;
			if (encrypt) {
				let encryptRes = vk.crypto.encryptCallFunction(data);
				data = encryptRes.data;
				decryptFn = encryptRes.decrypt;
			}
			runCloud.callFunction({
				name: name,
				timeout,
				data: {
					$url: url,
					data: data,
					encrypt
				},
				secretType,
				success(res = {}) {
					if (typeof decryptFn === "function") {
						res.result = decryptFn(res.result);
					}
					that.callFunctionSuccess({
						res: res.result,
						params: obj,
						Logger,
						resolve,
						reject
					});
				},
				fail(res) {
					that.callFunctionFail({
						res,
						params: obj,
						Logger,
						reject,
						sysFail: true
					});
				},
				complete(res) {
					that.callFunctionComplete({
						res,
						params: obj,
						Logger
					});
				}
			});
		});
		promiseAction.catch(error => {});
		return promiseAction;
	}

	// 云函数url化请求
	runRequest(obj = {}) {
		let that = this;
		let config = that.config;
		let {
			url,
			data,
			title,
			loading,
			name,
			complete,
			encrypt,
			timeout
		} = obj;
		if (typeof obj.needAlert === "undefined") obj.needAlert = true;
		if (!name) name = config.isTest ? config.testFunctionName : config.functionName;
		obj.name = name;
		let functionUrl = config.functionNameToUrl[name];
		let Logger = {};
		if (config.debug) Logger.params = typeof data == "object" ? JSON.parse(JSON.stringify(data)) : data;
		let uniIdToken = uni.getStorageSync(config.uniIdTokenKeyName);
		let tokenExpired = uni.getStorageSync(config.uniIdTokenExpiredKeyName);
		if (title) vk.showLoading(title, "request");
		if (loading) Logger.loading = vk.setLoading(true, loading);
		let promiseAction = new Promise((resolve, reject) => {
			if (config.debug) Logger.startTime = Date.now();
			// 拼接functionUrl和url
			let requestUrl = functionUrl;
			if (url.indexOf("/") !== 0 && requestUrl.lastIndexOf("/") !== requestUrl.length - 1) {
				requestUrl += "/";
			}
			requestUrl += url;

			let decryptFn;
			if (encrypt) {
				let encryptRes = vk.crypto.encryptCallFunction(data);
				data = encryptRes.data;
				decryptFn = encryptRes.decrypt;
			}

			const sysInfo = uni.getSystemInfoSync();
			// 设置请求头，并将值为undefined的属性删除
			let header = JSON.parse(JSON.stringify({
				"content-type": "application/json;charset=utf8",
				"vk-encrypt": encrypt ? "true" : undefined,
				"uni-id-token": uniIdToken,
				"vk-appid": sysInfo.appId,
				"vk-platform": sysInfo.uniPlatform,
				"vk-locale": sysInfo.appLanguage,
				"vk-device-id": sysInfo.deviceId,
				"vk-os": sysInfo.osName,
				"vk-app-name": sysInfo.appName ? encodeURIComponent(sysInfo.appName) : undefined,
				"vk-app-version": sysInfo.appVersion,
				"vk-app-version-code": sysInfo.appVersionCode,
				"vk-browser-name": sysInfo.browserName ? encodeURIComponent(sysInfo.browserName) : undefined,
				"vk-browser-version": sysInfo.browserVersion,
				"vk-app-wgt-version": sysInfo.appWgtVersion,
				"vk-device-brand": sysInfo.deviceBrand,
				"vk-device-model": sysInfo.deviceModel,
				"vk-device-type": sysInfo.deviceType,
				"vk-uni-compile-version": sysInfo.uniCompileVersion,
				"vk-uni-runtime-version": sysInfo.uniRuntimeVersion,
				"vk-uni-compiler-version": sysInfo.uniCompilerVersion,
			}));

			uni.request({
				method: "POST",
				url: requestUrl,
				timeout,
				header,
				data,
				success: (res = {}) => {
					if (typeof decryptFn === "function") {
						res.data = decryptFn(res.data);
					}
					that.callFunctionSuccess({
						res: res.data,
						params: obj,
						Logger,
						resolve,
						reject
					});
				},
				fail: (res) => {
					that.callFunctionFail({
						res,
						params: obj,
						Logger,
						reject,
						sysFail: true
					});
				},
				complete: (res) => {
					that.callFunctionComplete({
						res,
						params: obj,
						Logger
					});
				}
			});
		});
		promiseAction.catch(error => {});
		return promiseAction;
	}

	// 云函数请求成功时执行
	callFunctionSuccess(obj) {
		let that = this;
		let config = that.config;
		let {
			res = {},
				params,
				Logger,
				resolve,
				reject
		} = obj;
		let {
			title,
			loading,
			success
		} = params;
		if (title) vk.hideLoading("request");
		if (loading) {
			vk.setLoading(false, Logger.loading);
			Logger.loading = null;
		}
		if (typeof res.code === "undefined" && typeof res.errCode !== "undefined") res.code = res.errCode;
		let code = res.code;
		if (config.debug) Logger.result = typeof res == "object" ? JSON.parse(JSON.stringify(res)) : res;
		if (code == 0 || res.key == 1 || (code == undefined && res.uid)) {
			if (res.vk_uni_token) that.saveToken(res.vk_uni_token);
			if (res.userInfo && res.needUpdateUserInfo) that.updateUserInfo(res);
			if (typeof success == "function") success(res);
			resolve(res);
		} else if ([1301, 1302, 30201, 30202, 30203, 30204].indexOf(code) > -1 && res.msg.indexOf("token") > -1) {
			// 执行 login 拦截器函数（跳转到页面页面）
			if (typeof that.interceptor.login === "function") {
				that.interceptor.login({
					res,
					params,
					vk
				});
			}
			reject(res);
		} else {
			that.callFunctionFail({
				res,
				params,
				Logger,
				reject
			});
		}
	}

	// 云函数请求失败时执行
	callFunctionFail(obj) {
		let that = this;
		let config = that.config;
		let { globalErrorCode = {} } = config;
		let {
			res = {},
				params,
				Logger,
				reject,
				sysFail
		} = obj;
		let {
			title,
			loading,
			errorToast,
			noAlert,
			needAlert,
			fail,
		} = params;
		// 只有是系统异常时才进行重试
		if (params.needRetry) {
			if (sysFail || (res.code && [90001].indexOf(res.code) > -1)) {
				if (!obj.hookResult || (typeof obj.hookResult === "function" && !obj.hookResult(err))) {
					Logger.sysFail = true;
					if (typeof params.retry == "function") params.retry(res, params);
					// 自2.19.4版本开始，新增了loading计数器的概念，故重试会增加loading计数器，所以这里需要减去一次loading计数器
					if (title) vk.hideLoading("request");
					if (loading) vk.setLoading(false, Logger.loading);
					return false;
				}
			}
		}

		if (typeof noAlert !== "undefined") needAlert = !noAlert;
		if (typeof needAlert === "undefined") {
			needAlert = (typeof fail === "function") ? false : true;
		}
		if (errorToast) needAlert = false;
		if (title) vk.hideLoading("request");
		if (loading) {
			vk.setLoading(false, Logger.loading);
			Logger.loading = null;
		}
		let errMsg = "";
		let sysErr = false;
		if (res.msg) {
			errMsg = res.msg;
		} else if (res.errMsg) {
			errMsg = res.errMsg;
		} else if (res.message) {
			errMsg = res.message;
		} else {
			sysErr = true;
			errMsg = JSON.stringify(res);
		}
		if (typeof errMsg !== "string") errMsg = JSON.stringify(errMsg);
		if (!errMsg) errMsg = "";
		if (res.code >= 90001 && errMsg.indexOf("数据库") > -1) {
			sysErr = true;
		} else if ([404, 500].indexOf(res.code) > -1 && errMsg.indexOf("云函数") > -1) {
			sysErr = true;
		} else if (res.code === "SYS_ERR" && ["request:fail", "request:fail "].indexOf(errMsg) > -1) {
			sysErr = true;
		} else if ((res.code === 501 && errMsg.indexOf("timeout for 10000ms") > -1) || (res.code === "SYS_ERR" && errMsg.indexOf(": request:ok") > -1)) {
			errMsg = globalErrorCode["cloudfunction-unusual-timeout"] || "请求超时，但请求还在执行，请重新进入页面。";
		} else if (typeof errMsg.toLowerCase === "function" && (errMsg.toLowerCase().indexOf("timeout") > -1 || errMsg.toLowerCase().indexOf("etimedout") > -1)) {
			sysErr = true;
			errMsg = globalErrorCode["cloudfunction-timeout"] || "请求超时，请重试！";
			// 所有正常请求超时的情况都不需要弹框
			needAlert = false;
			errorToast = false;
		} else if (errMsg.indexOf("reaches burst limit") > -1) {
			errMsg = globalErrorCode["cloudfunction-reaches-burst-limit"] || "系统繁忙，请稍后再试。";
		} else if (res.code === "InternalServerError") {
			sysErr = true;
		} else if (res.code === "SYS_ERR" && errMsg.indexOf("似乎已断开与互联网的连接") > -1) {
			errMsg = globalErrorCode["cloudfunction-network-unauthorized"];
			sysErr = true;
			needAlert = false;
			// #ifdef APP-PLUS
			vk.pubfn.debounce(() => {
				vk.alert(errMsg, "提示", "确定", () => {
					vk.navigateToHome();
				});
			}, 2000, false, "cloudfunction-network-unauthorized");
			// #endif
		} else if (typeof res.error === "object" && res.success === false) {
			res = {
				code: res.error.code || -1,
				msg: res.error.message || res.error.msg || res.error.errMsg || "未知错误"
			}
		}
		let runKey = true;
		if (typeof that.interceptor.fail == "function") {
			runKey = that.interceptor.fail({
				vk,
				res: res,
				params: params
			});
			if (runKey === undefined) runKey = true;
		}
		if (runKey) {
			Logger.error = res;
			if (errorToast) vk.toast(errMsg, "none");
			if (needAlert && vk.pubfn.isNotNull(errMsg)) {
				if (sysErr) {
					let toastMsg = globalErrorCode["cloudfunction-system-error"] || "网络开小差了！";
					vk.toast(toastMsg, "none");
				} else {
					vk.alert(errMsg);
				}
			}
			if (typeof fail == "function") fail(res);
		}
		if (typeof reject == "function") reject(res);
	}

	// 云函数请求完成后执行
	callFunctionComplete(obj) {
		let that = this;
		let config = that.config;
		let {
			res = {},
				params,
				Logger
		} = obj;
		let {
			name,
			url,
			isRequest,
			complete,
			debug: debugLog,
			encrypt
		} = params;
		if (params.needRetry && Logger.sysFail) {
			return false;
		}
		if (typeof debugLog === "undefined") debugLog = config.debug;
		if (debugLog) {
			Logger.endTime = Date.now();
			if (isRequest) {
				Logger.label = "【url化】";
			} else {
				Logger.label = "";
			}
			Logger.runTime = (Logger.endTime - Logger.startTime);
			let colorArr = config.logger.colorArr;
			let colorStr = colorArr[counterNum % colorArr.length];
			counterNum++;
			let functionType = url.indexOf(".") > -1 ? "云对象" : "云函数";
			if (encrypt) {
				functionType = functionType + "加密";
			}
			console.log(`%c--------【开始】${Logger.label}【${functionType}请求】【${name}】【${url}】--------`, `color: ${colorStr};font-size: 12px;font-weight: bold;`);
			console.log("【请求参数】: ", Logger.params);
			console.log("【返回数据】: ", Logger.result);
			console.log("【总体耗时】: ", Logger.runTime, "毫秒【含页面渲染】");
			console.log("【请求时间】: ", vk.pubfn.timeFormat(Logger.startTime, "yyyy-MM-dd hh:mm:ss"));
			if (Logger.error) {
				let errorLog = console.warn || console.error;
				if (Logger.error.err && Logger.error.err.stack) {
					console.error("【Error】: ", Logger.error);
					console.error("【Stack】: ", Logger.error.err.stack);
				} else if (Logger.error.stack) {
					console.error("【Error】: ", `${Logger.error.code} ${Logger.error.message}`);
				} else {
					errorLog("【Error】: ", Logger.error);
					if ((typeof Logger.error === "object" && typeof Logger.error.code === "undefined" && typeof Logger.error.success !== "boolean") || (typeof Logger.error !== "object")) {
						errorLog("【提示】: ", "返回数据必须是对象，且至少需要返回 { code: 0 }，请查看VK框架响应体规范 https://vkdoc.fsq.pub/client/uniCloud/cloudfunctions/resformat.html");
					}
				}
			}
			console.log(`%c--------【结束】${Logger.label}【${functionType}请求】【${name}】【${url}】--------`, `color: ${colorStr};font-size: 12px;font-weight: bold;`);
			Logger = null; // 释放内存
		}
		if (typeof complete == "function") complete(res);
	}

	// 获取文件后缀名
	getFileSuffix(obj = {}) {
		let {
			file,
			filePath,
			suffix = "png"
		} = obj;
		if (filePath) {
			let suffixName = filePath.substring(filePath.lastIndexOf(".") + 1);
			if (suffixName && suffixName.length < 5) suffix = suffixName;
		}
		if (file) {
			if (file.path) {
				let suffixName = file.path.substring(file.path.lastIndexOf(".") + 1);
				if (suffixName && suffixName.length < 5) suffix = suffixName;
			}
			if (file.name) {
				let suffixName = file.name.substring(file.name.lastIndexOf(".") + 1);
				if (suffixName && suffixName.length < 5) suffix = suffixName;
			}
		}
		return suffix;
	}

	// 获取文件类型
	getFileType(obj = {}) {
		let {
			file,
			filePath
		} = obj;
		let fileType = "other";
		let suffix = this.getFileSuffix(obj);
		if (["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp"].indexOf(suffix) > -1) {
			fileType = "image";
		} else if (["avi", "mp3", "mp4", "3gp", "mov", "rmvb", "rm", "flv", "mkv"].indexOf(suffix) > -1) {
			fileType = "video";
		}
		return fileType;
	}

	// 获取文件名
	getFileName(cloudPath = "") {
		// 使用split方法分割字符串
		let parts = cloudPath.split('/');
		// 返回最后一个部分（即文件名）
		return parts[parts.length - 1];
	}

	// 获取云对象权限类型
	// 文档：https://vkdoc.fsq.pub/client/uniCloud/cloudfunctions/cloudObject.html#内置权限
	getCloudObjectRule(url) {
		let directoryIndex = url.lastIndexOf("/");
		let cloudObjectUrl = url.substring(directoryIndex + 1);
		let lastIndex = cloudObjectUrl.lastIndexOf(".");
		// 云对象目录名
		let cloudObjectDirectory = url.substring(0, directoryIndex);
		// 云对象目录数组结构
		let cloudObjectDirectoryArray = cloudObjectDirectory.split("/");
		// 云对象名
		let cloudObjectName = cloudObjectUrl.substring(0, lastIndex);
		// 云对象内函数名
		let functionName = cloudObjectUrl.substring(lastIndex + 1);

		// 默认权重0，kh类型
		let rule = {
			type: "kh",
			weight: 0
		}
		// 权重1：判断目录
		if (cloudObjectDirectoryArray.indexOf("sys") > -1) {
			rule.type = "sys";
			rule.weight = 1;
		} else if (cloudObjectDirectoryArray.indexOf("kh") > -1) {
			rule.type = "kh";
			rule.weight = 1;
		} else if (cloudObjectDirectoryArray.indexOf("pub") > -1) {
			rule.type = "pub";
			rule.weight = 1;
		}
		// 权重2：判断云对象名
		if (cloudObjectName.indexOf("sys.") === 0 || cloudObjectName === "sys") {
			rule.type = "sys";
			rule.weight = 2;
		} else if (cloudObjectName.indexOf("kh.") === 0 || cloudObjectName === "kh") {
			rule.type = "kh";
			rule.weight = 2;
		} else if (cloudObjectName.indexOf("pub.") === 0 || cloudObjectName === "pub") {
			rule.type = "pub";
			rule.weight = 2;
		}
		// 权重3：判断函数名
		if (functionName.indexOf("sys_") === 0) {
			rule.type = "sys";
			rule.weight = 3;
		} else if (functionName.indexOf("kh_") === 0) {
			rule.type = "kh";
			rule.weight = 3;
		} else if (functionName.indexOf("pub_") === 0) {
			rule.type = "pub";
			rule.weight = 3;
		}
		// 判断是否私有函数
		if (functionName.indexOf("_") === 0) {
			rule.type = "private";
			rule.weight = 99;
		}
		return rule;
	}

	// 系统异常重试机制（表单提交时慎用，建议只用在查询请求中，即无任何数据库修改的请求中）
	callFunctionRetry(obj = {}) {
		let { retryCount } = obj;
		delete obj.retryCount;
		return new Promise((resolve, reject) => {
			this.callRetryFn(obj, resolve, reject, retryCount);
		});
	}
	// 重试实现
	callRetryFn(obj, resolve, reject, retryCount) {
		let debug = this.config.debug;
		return this.callFunction({
			...obj,
			needRetry: retryCount ? true : false, // 判断是否需要重试
			retry: (err) => {
				obj.runCount = obj.runCount ? obj.runCount + 1 : 1;
				obj.needRetry = retryCount > obj.runCount ? true : false; // 判断是否需要重试
				let errMsg = err.message ? `异常信息：${err.message}` : "";
				if (debug) console.log(`【请求失败】正在第【${obj.runCount}】次重试：${obj.url}`);
				if (obj.retryInterval) {
					setTimeout(() => {
						this._callRetryFn(obj, resolve, reject, retryCount);
					}, obj.retryInterval);
				} else {
					// 如果无延迟，则不写setTimeout，因为setTimeout 即使time为0，也有一定延迟。
					this._callRetryFn(obj, resolve, reject, retryCount);
				}
			}
		}).then(resolve).catch(reject);
	}

	_callRetryFn(obj, resolve, reject, retryCount) {
		if (obj.runCount < retryCount) {
			this.callRetryFn(obj, resolve, reject, retryCount);
		} else {
			this.callFunction(obj).then(resolve).catch(reject);
		}
	}

}

export default new CallFunctionUtil
