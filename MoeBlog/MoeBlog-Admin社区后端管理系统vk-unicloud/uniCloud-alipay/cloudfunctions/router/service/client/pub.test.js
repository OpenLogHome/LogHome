/**
 * 此为云对象模式，可以在这一个对象中写多个函数，具体文档请查看
 * https://vkdoc.fsq.pub/client/uniCloud/cloudfunctions/cloudObject.html
 */
'use strict';
var vk; // 全局vk实例
// 涉及的表名
const dbName = {
	//test: "vk-test", // 测试表
};

var db = uniCloud.database(); // 全局数据库引用
var _ = db.command; // 数据库操作符
var $ = _.aggregate; // 聚合查询操作符
/**
 * 权限注意：访问以下链接查看
 * 文档地址：https://vkdoc.fsq.pub/client/uniCloud/cloudfunctions/cloudObject.html#内置权限
 */
var cloudObject = {
	isCloudObject: true, // 标记为云对象模式
	/**
	 * 请求前处理，主要用于调用方法之前进行预处理，一般用于拦截器、统一的身份验证、参数校验、定义全局对象等。
	 * 文档地址：https://vkdoc.fsq.pub/client/uniCloud/cloudfunctions/cloudObject.html#before-预处理
	 */
	_before: async function() {
		vk = this.vk; // 将vk定义为全局对象
		// let { customUtil, uniID, config, pubFun } = this.getUtil(); // 获取工具包
	},
	/**
	 * 请求后处理，主要用于处理本次调用方法的返回结果或者抛出的错误
	 * 文档地址：https://vkdoc.fsq.pub/client/uniCloud/cloudfunctions/cloudObject.html#after-后处理
	 */
	_after: async function(options) {
		let { err, res } = options;
		if (err) {
			return; // 如果方法抛出错误，直接return;不处理
		}
		return res;
	},
	/**
	 * 模板函数
	 * @url client/pub.test.getInfo 前端调用的url参数地址
	 */
	getInfo: async function(data) {
		let { uid } = this.getClientInfo(); // 获取客户端信息
		let userInfo = await this.getUserInfo(); // 获取当前登录的用户信息
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		console.log("getInfo请求参数", data);
		res.userInfo = userInfo; // 返回前端当前登录的用户信息
		
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	},
	/**
	 * 模板函数
	 * @url client/pub.test.getList 前端调用的url参数地址
	 */
	getList: async function(data) {
		let { uid, filterResponse, originalParam } = this.getClientInfo(); // 获取客户端信息
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		console.log("getList请求参数", data);


		// 业务逻辑结束-----------------------------------------------------------
		return res;
	},
	/**
	 * 云对象调用自身函数
	 * @url client/pub.test.test1 前端调用的url参数地址
	 */
	test1: async function(data) {
		let { uid, filterResponse, originalParam } = this.getClientInfo(); // 获取客户端信息
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		console.log("test1请求参数", data);
		let res1 = await this.getInfo(data);
		console.log("res1", res1);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	},
	/**
	 * 云对象调用任意云对象或云函数
	 * @url client/pub.test.test2 前端调用的url参数地址
	 */
	test2: async function(data) {
		let { uid, filterResponse, originalParam } = this.getClientInfo(); // 获取客户端信息
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		console.log("test2请求参数", data);
		let callRes = await vk.callFunction({
			url: 'client/pub.test.getInfo',
			clientInfo: this.getClientInfo(),
			data: {
				a:1
			},
		});
		console.log("callRes", callRes);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
};

module.exports = cloudObject;
