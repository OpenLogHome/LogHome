'use strict';
module.exports = {
	/**
	 * 查询用户中心的某个用户文章
	 * @url client/art/pub/getUserArt 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.selects({
			dbName:"MoeBlog-article",
			//getMain: true, 
			getCount:true,
			pageIndex: data.pageNo,
			pageSize: data.pageSize,
			whereJson:{
				user_id:data._id
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
			    },
				{
				  dbName:"MoeBlog-comments",
				  localKey:"_id",
				  foreignKey:"art_id",
				  as:"commentsNum",
				  fieldJson:{
					  _id:true
				  }
				},
				{
				  dbName:"MoeBlog-likes",
				  localKey:"_id",
				  foreignKey:"art_id",
				  as:"likeNum",
				  fieldJson:{
					  _id:true
				  }
				}
			  ],
			sortArr: [
			    { name: "_add_time", type: "desc" }
			]  
		})
		
		return {
			code:0,
			msg:"查询用户中心的文章成功",
			result:res
		};
	}
}
