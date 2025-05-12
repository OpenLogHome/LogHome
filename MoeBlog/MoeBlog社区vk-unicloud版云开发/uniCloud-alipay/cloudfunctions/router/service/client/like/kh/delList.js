'use strict';
module.exports = {
	/**
	 * XXXnameXXX
	 * @url client/like/kh/delList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let count1= await vk.baseDao.updateAndReturn({
				dbName: "MoeBlog-article",
				whereJson: {
					_id:data.art_id
				},
				dataJson: {
					like_count: _.inc(-1)
				}
				});
		let res=await vk.baseDao.del({
			dbName:"MoeBlog-likes",
			whereJson:{
				art_id:data.art_id,
				user_id:uid
			}
		})
		return {
			code:0,
			msg:"删除点赞成功",
			result:res
		}
	}
}
