'use strict';
module.exports = {
	/**
	 * 查询当前文章页的评论
	 * @url client/comments/pub/getList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.selects({
			dbName:"MoeBlog-comments",
			whereJson:{
				art_id:data.art_id
			},
			getCount:true,
			pageIndex:data.pageIndex,
		    foreignDB: [
		        {
		          dbName: "uni-id-users",
		          localKey: "user_id",
		          foreignKey: "_id",
		          as: "userinfo",
		          limit: 1,
				  fieldJson:{
					  _id:true,
					  nickname:true,
					  username:true,
					  avatar:true,
					  gxqm:true
				  }
		        }
		    ]
		})
		return {
			code:0,
			msg:"查询当前文章评论成功",
			result:res
		}
	}
}
