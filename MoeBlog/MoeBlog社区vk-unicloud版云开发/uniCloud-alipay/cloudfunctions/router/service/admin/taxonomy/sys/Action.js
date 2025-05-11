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
		let {
			err,
			res
		} = options;
		if (err) {
			return; // 如果方法抛出错误，直接return;不处理
		}
		return res;
	},
	/**
	 * 获取列表
	 * @url admin/taxonomy/sys/Action.getList 前端调用的url参数地址
	 */
	getList: async function(data) {
		let res = await vk.baseDao.getTableData({
			dbName: "MoeBlog-taxonomy",
			data: {
				...data,
				artCount:0
			},
			whereJson: {
				parent_id: _.neq("")
			},
			foreignDB: [{
					dbName: "uni-id-users",
					localKey: "user_id",
					foreignKey: "_id",
					as: "userinfo",
					limit: 1,
					fieldJson: {
					    _id: true,
					    avatar: true,
						nickname:true
					}
				},
				{
					dbName: "MoeBlog-taxonomy", 
					localKey: "parent_id", 
					foreignKey: "_id", 
					as: "parent", 
					limit: 1 ,
					fieldJson: { 
					    _id: true,
					    name: true
					}
				}
			],
			 sortArr: [
			    { name: "parent._id", type: "desc" }
			  ]
		})
		return {
			code: 0,
			msg: "查询二级分类信息成功",
			result: res
		};
	},
	/**
	 * 获取列表
	 * @url admin/taxonomy/sys/Action.getTaxList 查询当前一级分类
	 */
	getTaxList: async function(data) {
		let res = await vk.baseDao.select({
			dbName: "MoeBlog-taxonomy",
			whereJson: {
				parent_id: _.in([null, ""])
			},
			pageSize:1000,
			pageNum:1
		})
		return {
			code: 0,
			msg: "查询一级分类成功",
			result: res.rows
		}
	},

	/**
	 * 获取列表
	 * @url admin/taxonomy/sys/Action.addList 添加二级分类
	 */
	addList: async function(data) {
		let res = await vk.baseDao.add({
			dbName: "MoeBlog-taxonomy",
			dataJson: {
				...data
			}
		})
		return {
			code: 0,
			msg: "添加二级分类成功",
			result: res
		}
	},
	
	/**
	 * 获取列表
	 * @url admin/taxonomy/sys/Action.upList 修改二级分类
	 */
	upList:async function(data){
		let res=await vk.baseDao.updateById({
			dbName:"MoeBlog-taxonomy",
			id:data._id,
			dataJson:{
				...data
			}
		})
		return{
			code:0,
			msg:"修改二级分类成功",
			result:res
		}
	},
	
	/**
	 * 获取列表
	 * @url admin/taxonomy/sys/Action.delList 删除二级分类
	 */
	delList:async function(data){
		let res=await vk.baseDao.deleteById({
			dbName:"MoeBlog-taxonomy",
			id:data._id
		})
		return {
			code:0,
			msg:"删除轮播图成功",
			result:res
		}
	}
};

module.exports = cloudObject;