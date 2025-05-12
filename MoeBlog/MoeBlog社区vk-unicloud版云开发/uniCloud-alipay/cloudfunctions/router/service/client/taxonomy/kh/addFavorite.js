'use strict';
module.exports = {
	/**
	 * 用户添加分类收藏
	 * @url client/taxonomy/kh/addFavorite 前端调用的url参数地址
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
					fans_count: _.inc(1)
					}
				});
		let res=await vk.baseDao.add({
			dbName:"MoeBlog-taxonomy-favorite",
			dataJson:{
				taxonomy_id:data.id,
				user_id:uid
			}
		})
		
		return {
			code:0,
			msg:"添加分类收藏成功",
			result:res
		}
	}
}
