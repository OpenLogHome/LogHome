'use strict';
module.exports = {
	/**
	 * 添加用户对用户的关注
	 * @url client/user/kh/addLike 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		if(uid!=data.follower_id){
			data.follower_id=uid
		}
		let res=await vk.baseDao.add({
			dbName:"MoeBlog-UserLike",
			dataJson:{
				follower_id :data.follower_id,
				following_id:data.following_id
			}
		})
		return {
			code:0,
			msg:"添加关注成功",
			result:res
		}
	}
}
