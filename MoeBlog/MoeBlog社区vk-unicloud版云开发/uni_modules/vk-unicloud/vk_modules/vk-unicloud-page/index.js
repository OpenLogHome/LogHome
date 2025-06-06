/**
 * vk-unicloud框架客户端(前端)
 * author	VK
 */
import userCenter         from './libs/vk-unicloud/vk-unicloud-user-center'
import callFunctionUtil   from './libs/vk-unicloud/vk-unicloud-callFunctionUtil'
import pubfn              from './libs/function/index'
import modal              from './libs/function/modal'
import navigate           from './libs/function/vk.navigate'
import localStorage       from './libs/function/vk.localStorage'
import sessionStorage     from './libs/function/vk.sessionStorage'
import openapi            from './libs/openapi/index'
import requestUtil        from './libs/function/vk.request'
import importObject       from './libs/function/vk.importObject'
import filters            from './libs/function/vk.filters'
import eventManager       from './libs/function/vk.eventManager'

import mixin              from './libs/mixin/mixin.js'
import initPermission     from './libs/function/permission'
import storeMixin         from './libs/store/mixin/mixin'
import initGlobalError    from './libs/store/libs/error'
import consoleLog         from './libs/install/console.log'
import updateManager      from './libs/function/updateManager.js'

// #ifdef H5
import h5                 from './libs/function/vk.h5'
// #endif



var vk = {
	userCenter,
	callFunctionUtil,
	/**
	 * 发起一个云函数请求
	 */
	callFunction:     callFunctionUtil.callFunction,
	getToken:         callFunctionUtil.getToken,
	checkToken:       callFunctionUtil.checkToken,
	uploadFile:       callFunctionUtil.uploadFile,
	getConfig:        callFunctionUtil.getConfig,
	emitRefreshToken: callFunctionUtil.emitRefreshToken,
	onRefreshToken:   callFunctionUtil.onRefreshToken,
	offRefreshToken:  callFunctionUtil.offRefreshToken,
	pubfn,

	// #ifdef H5
	h5,
	// #endif

	alert:             modal.alert,
	toast:             modal.toast,
	confirm:           modal.confirm,
	prompt:            modal.prompt,
	showActionSheet:   modal.showActionSheet,
	showLoading:       modal.showLoading,
	hideLoading:       modal.hideLoading,
	setLoading:        modal.setLoading,

	navigate,
	// 保留当前页面,并进行页面跳转
	navigateTo:              navigate.navigateTo,
	// 关闭当前页面,并进行页面跳转
	redirectTo:              navigate.redirectTo,
	// 并关闭所有页面,并进行页面跳转
	reLaunch:                navigate.reLaunch,
	// 并关闭所有非tab页面,并进行tab面跳转
	switchTab:               navigate.switchTab,
	// 页面返回
	navigateBack:            navigate.navigateBack,
	// 跳转到首页
	navigateToHome:          navigate.navigateToHome,
	// 跳转到登录页
	navigateToLogin:         navigate.navigateToLogin,
	// 跳转到小程序
	navigateToMiniProgram:   navigate.navigateToMiniProgram,
	// 触发全局的自定义事件，附加参数都会传给监听器回调函数。
	$emit:                   navigate.$emit,
	// 监听全局的自定义事件，事件由 uni.$emit 触发，回调函数会接收事件触发函数的传入参数。
	$on:                     navigate.$on,
	// 触发全局的自定义事件，附加参数都会传给监听器回调函数。
	$once:                   navigate.$once,
	// 移除全局自定义事件监听器。
	$off:                    navigate.$off,
	// 本地持久
	localStorage:            localStorage,
	// 本地会话缓存
	sessionStorage:          sessionStorage,

	// 获取应用语言列表
	getLocaleList:           pubfn.getLocaleList,
	// 获取应用当前语言
	getLocale:               pubfn.getLocale,
	// 获取应用当前语言对象
	getLocaleObject:         pubfn.getLocaleObject,
	// 设置应用当前语言
	setLocale:               pubfn.setLocale,


	// 本地持久缓存
	...localStorage,
	// 本地会话缓存
	...sessionStorage,
	// 更新管理器
	updateManager,
	// 开放API
	openapi,
	// 请求库
	requestUtil,
	// 发起URL请求
	request: requestUtil.request,
	// 导出云对象
	importObject,
	// 事件管理
	...eventManager
};
// vk实例初始化
vk.init = function(obj = {}) {
	let {
		Vue, // Vue实例
		config, // 配置
		store, // vuex简写法则(新版本无需传store)
	} = obj;
	if (typeof store !== "undefined") {
		// 兼容旧版本
		Vue.use(store);
	} else {
		// 新版本无需传store
		Vue.mixin(storeMixin);
		if (config.globalError) {
			Vue.use(initGlobalError);
		}
	}
	// 自定义云函数路由配置
	vk.callFunctionUtil.setConfig(config);
	// 重写 console.log
	Vue.use(consoleLog);
};

vk.getGlobalObject = function() {
	if (typeof globalThis === "object") return globalThis;
	if (typeof self === "object") return self;
	if (typeof window === "object") return window;
	if (typeof global === "object") return global;
};
// 加载拓展功能
vk.use = function(obj, util) {
	for (let name in obj) {
		if (obj[name] && typeof obj[name].init === "function") {
			obj[name].init(util);
		}
		vk[name] = obj[name];
	}
};

const install = (Vue, config) => {
	// 全局混入
	Vue.mixin(mixin);
	// #ifndef VUE3
	// 加载全局过滤器开始
	for (let i in filters) {
		Vue.filter(i, filters[i]);
	}
	Vue.prototype.vk = vk;
	Vue.prototype.$fn = vk.pubfn;

	// #endif

	// #ifdef VUE3
	// 将vk挂载到Vue实例
	Vue.config.globalProperties.vk = vk;
	Vue.config.globalProperties.$fn = vk.pubfn;
	// #endif

	// 将vk挂载到uni对象
	if (typeof uni == "object") uni.vk = vk;
	// 将vk挂载到全局
	let vkGlobalThis = vk.getGlobalObject();
	if (typeof vkGlobalThis == "object") vkGlobalThis.vk = vk;
	let util = { vk };
	// 加载插件
	vk.use({
		callFunctionUtil: vk.callFunctionUtil,
		openapi: vk.openapi
	}, util);
	initPermission(Vue);
	// 初始化并加载vk配置
	if (config) {
		vk.init({
			Vue,               // Vue实例
			config,	           // 配置
		});
	}
}

export default {
	install
}
