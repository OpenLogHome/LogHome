'use strict';
var vk; // 全局vk实例
// 涉及的表名

var db = uniCloud.database(); // 全局数据库引用
var _ = db.command; // 数据库操作符
var $ = _.aggregate; // 聚合查询操作符

var cloudObject = {
	isCloudObject: true, // 标记为云对象模式
	_before: async function() {
		vk = this.vk; // 将vk定义为全局对象
		// let { customUtil, uniID, config, pubFun } = this.getUtil(); // 获取工具包
	},
	_after: async function(options) {
		let { err, res } = options;
		if (err) {
			return; // 如果方法抛出错误，直接return;不处理
		}
		return res;
	},
	/**
	 * 获取列表
	 * 查询二级分类列表
	 * @url admin/index/sys/index_taxonomy.getTax 前端调用的url参数地址
	 */
	getTax: async function(data) {
		let { uid } = this.getClientInfo(); // 获取客户端信息
		let res=await vk.baseDao.select({
			dbName:"MoeBlog-taxonomy",
			getMain:true,
			whereJson:{
				parent_id: _.neq("")
			},
			fieldJson:{
				_id:true,
				name:true
			}
		})
		
		return {
			code:0,
			msg:"查询二级分类列表成功",
			result:res
		};
	},
	
	/**
	 * 获取列表
	 * 添加首页分类显示
	 * @url admin/index/sys/index_taxonomy.addList 前端调用的url参数地址
	 */
	addList: async function(data) {
		let { uid } = this.getClientInfo(); // 获取客户端信息
		let res=await vk.baseDao.add({
			dbName:"MoeBlog-index_taxonomy",
			dataJson:{
				...data
			}
		})
		
		return {
			code:0,
			msg:"添加首页分类显示成功",
			result:res
		};
	},
	
	/**
	 * 获取列表
	 * 查询首页分类显示
	 * @url admin/index/sys/index_taxonomy.getList 前端调用的url参数地址
	 */
	getList: async function(data) {
		let { uid } = this.getClientInfo(); // 获取客户端信息
		let res=await vk.baseDao.getTableData({
			dbName:"MoeBlog-index_taxonomy",
			data:{
				...data
			},
			getMain:true,
			foreignDB: [
			    {
			      dbName: "MoeBlog-taxonomy",
			      localKey: "taxonomy_id",
			      foreignKey: "_id",
			      as: "taxonomyName",
			      limit: 1,
				  fieldJson:{
					  _id:true,
					  name:true
				  }
			    }
			  ]
		})
		
		return {
			code:0,
			msg:"查询首页分类显示成功",
			result:res
		};
	},
	
	/**
	 * 获取列表
	 * 修改首页分类显示
	 * @url admin/index/sys/index_taxonomy.upList 前端调用的url参数地址
	 */
	upList: async function(data) {
		let { uid } = this.getClientInfo(); // 获取客户端信息
		let res=await vk.baseDao.update({
			dbName:"MoeBlog-index_taxonomy",
			dataJson:{
				...data
			},
			getMain:true,
			whereJson:{
				_id:data._id
			}
		})
		
		return {
			code:0,
			msg:"修改首页分类显示成功",
			result:res
		};
	},
	
	/**
	 * 获取列表
	 * 删除首页分类显示
	 * @url admin/index/sys/index_taxonomy.delList 前端调用的url参数地址
	 */
	delList: async function(data) {
		let { uid } = this.getClientInfo(); // 获取客户端信息
		let res=await vk.baseDao.deleteById({
			dbName:"MoeBlog-index_taxonomy",
			id:data.id
		})
		
		return {
			code:0,
			msg:"删除首页分类显示成功",
			result:res
		};
	},

};

module.exports = cloudObject;
