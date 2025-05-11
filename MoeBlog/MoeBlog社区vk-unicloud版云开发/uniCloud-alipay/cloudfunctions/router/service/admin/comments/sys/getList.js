'use strict';
module.exports = {
	/**
	 * 查询评论列表
	 * @url admin/comments/sys/getList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.getTableData({
			dbName:"MoeBlog-comments",
			data:{
				...data
			},
			foreignDB: [
			    {
			      dbName: "uni-id-users",
			      localKey: "user_id",
			      foreignKey: "_id",
			      as: "userinfo",
			      limit: 1,
			      fieldJson:{
			    	  _id:true,
			    	  username:true,
			    	  avatar:true
			      }
			    },
				{
				  dbName: "MoeBlog-article",
				  localKey: "art_id",
				  foreignKey: "_id",
				  as: "artinfo",
				  limit: 1,
				  fieldJson:{
				  	title:true
				  }
				}
			  ]
		})
		return {
			code:0,
			msg:"查询评论列表成功",
			result:res
		}
	}
}
