'use strict';
module.exports = {
	/**
	 * 查询当前用户的关注或者粉丝的数量
	 * @url client/user/kh/getUserFansNum 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let follower_Num=await vk.baseDao.count({
			dbName:"MoeBlog-UserLike",
			whereJson:{
				follower_id:uid
			}
		})
		let following_Num=await vk.baseDao.count({
			dbName:"MoeBlog-UserLike",
			whereJson:{
				following_id:uid
			}
		})
		
		let like_Num=await vk.baseDao.count({
			dbName:"MoeBlog-likes",
			whereJson:{
				user_id:uid
			}
		})
		
		return {
		  code: 0,
		  msg: "查询粉丝和关注成功",
		  follower_Num,
		  following_Num,
		  like_Num
		};
	}
}
