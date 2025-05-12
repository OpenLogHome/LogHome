'use strict';
module.exports = {
	/**
	 * 查询当前用户发布的文章的所有评论
	 * @url client/comments/kh/getUserComments 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let articleIds = await vk.baseDao.selects({
		  dbName: "MoeBlog-article",
		  getMain:true,
		  pageIndex:data.pageNo,
		  pageSize:data.pageSize,
		  fieldJson: {
		    _id: true
		  },
		  whereJson: {
		    user_id: uid
		  }
		});
		
		// 提取文章ID数组
		articleIds = articleIds.map(item => item._id);
		
		// 第二步：查询与这些文章相关的所有评论
		let comments = await vk.baseDao.selects({
		  dbName: "MoeBlog-comments",
		  whereJson: {
		    art_id: _.in(articleIds) // 使用 _.in 来匹配多个文章ID
		  },
		  pageIndex:data.pageNo,
		  pageSize:data.pageSize,
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
					nickname:true,
					avatar:true
				}
		      },
			  {
			    dbName: "MoeBlog-article",
			    localKey: "art_id",
			    foreignKey: "_id",
			    as: "art_info",
				fieldJson:{
					title:true,
					coverImg:true
				},
			    limit: 1
			  }
		    ],
			 sortArr: [{ "name":"_add_time", "type":"desc" }]
		});
		return {
			code:0,
			msg:"查询当前用户的文章评论成功",
			result:comments
		};
	}
}
