'use strict';
module.exports = {
	/**
	 * 查询分类的信息列表
	 * @url client/taxonomy/pub/getSquare 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.selects({
			dbName:"MoeBlog-taxonomy",
			whereJson:{
				Audit:0,
				parent_id:_.neq('')
			},
			fieldJson:{
				_id:true,
				name:true,
				avatarUrl:true,
				backgroundUrl:true,
				description:true,
				fans_count:true,
				count:true
			},
			pageIndex:data.pageNo,
			pageSize:data.pageSize,
			foreignDB: [
			    {
			      dbName: "MoeBlog-article",
			      localKey: "_id",
			      foreignKey: "taxonmoy_id",
			      as: "artList",
			      limit:2,
				  whereJson:{
				  	Audit:0
				  },
				  fieldJson:{
					  _id:true,
					  title:true,
					  content:true,
					  coverImg:true,
					  user_id:true,
					  _add_time_str:true
				  },
				  foreignDB:[
					  {
						dbName:"uni-id-users",
						localKey: "user_id",
						foreignKey: "_id",
						as:"userinfo",
						limit:1,
						fieldJson:{
							_id:true,
							nickname:true,
							username:true,
							avatar:true
						}
					  }
				  ]
			    }
			  ]  
		})
		
		return {
			code:0,
			msg:"查询圈子成功",
			result:res
		}
	}
}
