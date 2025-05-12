'use strict';
module.exports = {
	/**
	 * XXXnameXXX
	 * @url client/taxonomy/kh/delFavorite 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let count1= await vk.baseDao.updateAndReturn({
				dbName: "MoeBlog-taxonomy",
				whereJson: {
					_id: data.taxonomy_id
				},
				dataJson: {
					fans_count: _.inc(-1)
				}
				});
		let res=await vk.baseDao.del({
			dbName:"MoeBlog-taxonomy-favorite",
			whereJson:{
				user_id:data.user_id,
				_id:data._id
			}
		})
		return {
			code:0,
			msg:"删除关注成功",
			result:res
		};
	}
}
