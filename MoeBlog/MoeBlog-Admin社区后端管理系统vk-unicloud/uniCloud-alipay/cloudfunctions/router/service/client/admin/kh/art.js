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
		let { uid } = this.getClientInfo();
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
	 * @url client/admin/kh/art.getList 前端调用的url参数地址
	 */
	getList: async function(data) {
		let { uid } = this.getClientInfo(); // 获取客户端信息
		let res=await vk.baseDao.selects({
			dbName:"MoeBlog-article",
			getMain: true, 
			pageIndex: data.pageNo,
			pageSize: data.pageSize,
			whereJson:{
				Audit:data.Audit,
				art_status:true
			},
			foreignDB: [
			    {
			      dbName:"uni-id-users",
			      localKey:"user_id",
			      foreignKey:"_id",
			      as:"userInfo",
			      limit:1,
			      fieldJson: {
			    	  nickname:true,
			    	  _id:true,
			    	  avatar:true,
			    	  username:true,
					  gxqm:true
			      }
			    },
			    {
			      dbName:"MoeBlog-taxonomy",
			      localKey:"taxonmoy_id",
			      foreignKey:"_id",
			      as:"taxonomy",
			      limit:1,
			      fieldJson: {
			    	  _id:true,
			    	  name:true
			      }
			    }
			  ],
			sortArr: [
			    { name: "_add_time", type: "desc" }
			]  
		})
		return {
			code:0,
			msg:"查询文章成功",
			result:res
		}
	},
	/**
	 * 修改文章
	 * @url client/admin/kh/art.upList 前端调用的url参数地址
	 */
	upList: async function(data){
		let count=await vk.baseDao.updateById({
			dbName:"MoeBlog-taxonomy",
			id:data.taxonmoy_id,
			dataJson:{
				ArtCount:data.Audit==0?_.inc(1):data.Audit==2?_.inc(-1):_.inc(0)
			}
		})
		let res=await vk.baseDao.updateById({
			dbName:"MoeBlog-article",
			id:data._id,
			dataJson:{
				Audit:data.Audit
			}
		})
		return {
			code:0,
			msg:"修改成功",
			res,
			count
		}
	}
};

module.exports = cloudObject;
