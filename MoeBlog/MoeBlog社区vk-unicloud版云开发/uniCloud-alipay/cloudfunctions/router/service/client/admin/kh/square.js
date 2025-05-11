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
		let userInfo = await this.getUserInfo();
		if(userInfo.role[0]!="admin")
		return {
			code:-1,
			msg:"请登陆管理员账号"
		}
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
	 * 获取列表
	 * @url client/admin/kh/square.getList 前端调用的url参数地址
	 */
	getList: async function(data) {
		let res=await vk.baseDao.select({
			dbName:"MoeBlog-taxonomy",
			pageSize:1000,
			whereJson:{
				status:true,
				Audit:data.Audit,
				parent_id:_.neq("")
			},
			fieldJson:{
				_id:true,
				avatarUrl:true,
				backgroundUrl:true,
				name:true,
				description:true,
				Audit:true
			}
		})
		return {
			code:0,
			msg:"查询当前创建的圈子成功",
			result:res
		};
	},
	/**
	 * 获取列表
	 * @url client/admin/kh/square.upList 前端调用的url参数地址
	 */
	upList: async function(data) {
		let res=await vk.baseDao.update({
			dbName:"MoeBlog-taxonomy",
			whereJson:{
				_id:data._id
			},
			dataJson:{
				Audit:data.Audit
			}
		})
		return {
			code:0,
			msg:"修改成功"
		}
	}
};

module.exports = cloudObject;
