'use strict';
module.exports = {
	/**
	 * 查询当前用户点赞喜欢的文章
	 * @url client/art/kh/getUserLikeArt 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let like=await vk.baseDao.select({
			dbName:"MoeBlog-likes",
			getMain:true,
			pageIndex:data.pageNo,
			pageSize:data.pageSize,
			whereJson:{
				user_id:uid
			},
			fieldJson:{
				art_id:true
			}
		})
		let likeArr=like.map(item=>{
			return item.art_id
		})
		let res=await vk.baseDao.selects({
			dbName:"MoeBlog-article",
			getMain: true, 
			pageIndex: data.pageNo,
			pageSize: data.pageSize,
			whereJson:{
				_id:{$in:likeArr},
				Audit:0
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
			msg:"查询当前用户点赞的文章成功",
			result:res
		};
	}
}
