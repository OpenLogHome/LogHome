'use strict';
module.exports = {
	/**
	 * 查询当前用户关注了的分类
	 * @url client/taxonomy/kh/getUserFavoriteCurrent 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let taxonomy=await vk.baseDao.select({
			dbName:"MoeBlog-taxonomy-favorite",
			whereJson:{
				user_id:uid
			},
			getMain:true,
			pageSize:-1,
			fieldJson:{
				taxonomy_id:true
			}
		})
		let taxonomyArr=taxonomy.map(item=>item.taxonomy_id)
		let res=await vk.baseDao.select({
			dbName:"MoeBlog-taxonomy",
			getMain:true,
			pageSize:-1,
			whereJson:{
				_id:{$in:taxonomyArr},
				status:true
			},
			fieldJson:{
				_id:true,
				name:true,
				avatarUrl:true,
				description:true
			}
		})
		return {
			code:0,
			msg:"查询当前用户关注分类成功",
			result:res
		};
	}
}
