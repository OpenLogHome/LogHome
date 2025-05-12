'use strict';
module.exports = {
	/**
	 * 查询当前分类的详情信息 包过当前用户是否已关注
	 * @url client/taxonomy/pub/getDetailList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.selects({
			getMain: true,
			dbName:"MoeBlog-taxonomy",
			whereJson:{
				_id:data.id
			},
			fieldJson:{
				_id:true,
				name:true,
				ArtCount:true,
				fans_count:true,
				description:true,
				avatarUrl:true,
				backgroundUrl:true
			},
			foreignDB: [
			    {
			      dbName: "MoeBlog-taxonomy-favorite",
			      localKey: "_id",
			      foreignKey: "taxonomy_id",
			      as: "FavoriteInfo",
			      limit: 1,
				  whereJson:{
				  	 user_id:data.user_id!=""?data.user_id:''		  
				  },
				  fieldJson:{
					  _id:true
				  }
			    }
			  ]
		})
		return {
			code:0,
			msg:"查询当前圈子分类信息成功",
			result:res
		};
	}
}
