'use strict';
module.exports = {
	/**
	 * 用户添加评论
	 * @url client/comments/kh/addList 前端调用的url参数地址
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
					comment_count: _.inc(1)
				}
				});
		let res=await vk.baseDao.add({
			dbName:"MoeBlog-comments",
			dataJson:{
				...data,
				user_id:uid
			}
		})

		return {
			code:0,
			msg:"评论成功",
			result:res
		}
	}
}
