'use strict';
module.exports = {
	/**
	 * 用户更改自己的文章
	 * @url client/art/kh/upList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		if(data.user_id!=uid){
			return {
				code:-1,
				msg:"用户ID不一致"
			}
		}
		let res=await vk.baseDao.update({
			dbName:"MoeBlog-article",
			whereJson:{
				_id:data._id,
				user_id:uid,
			},
			dataJson:{
				...data
			}
		})

		return {
			code:0,
			msg:"修改文章成功",
			result:res
		};
	}
}
