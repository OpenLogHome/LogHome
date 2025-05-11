'use strict';
module.exports = {
	/**
	 * 查询用户中心的某个用户详细信息
	 * @url client/user/pub/getList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let {data = {}, userInfo, util, filterResponse, originalParam} = event;
		let {customUtil,uniID,config,pubFun,vk,db,_} = util;
		let {uid} = data;
		
		let res = await vk.baseDao.selects({
			dbName: "uni-id-users",
			whereJson: {
				_id: data.id
			},
			fieldJson: {
				_id: true,
				username: true,
				nickname: true,
				background: true,
				gxqm: true,
				avatar: true,
				register_date:true,
				gender:true
			},
			foreignDB: [
			    {
			      dbName: "MoeBlog-UserLike",
			      localKey: "_id",
			      foreignKey: "following_id",
			      as: "LikeInfo",
			      limit: 1,
				  whereJson:{
					 follower_id:data.currentUserId?data.currentUserId:''
				  },
				  fieldJson:{
					  _id:true
				  }
			    }
			]
		})
		let followerNum=await vk.baseDao.count({
			dbName:"MoeBlog-UserLike",
			whereJson:{
				follower_id:data.id
			}
		})
		let followingNum=await vk.baseDao.count({
			dbName:"MoeBlog-UserLike",
			whereJson:{
				following_id:data.id
			}
		})
		return {
			code:0,
			msg:"查询用户信息成功",
			result: res,
			followerNum,
			followingNum,
		};
	}
}