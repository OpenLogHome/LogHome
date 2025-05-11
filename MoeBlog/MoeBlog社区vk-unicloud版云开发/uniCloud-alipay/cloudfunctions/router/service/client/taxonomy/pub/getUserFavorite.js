'use strict';
module.exports = {
	/**
	 * 查询用户关注
	 * @url client/taxonomy/pub/getUserFavorite 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let user = await vk.baseDao.select({
			dbName:"MoeBlog-taxonomy-favorite",
			pageIndex: data.pageIndex,
			pageSize: 10,
			whereJson:{
				taxonomy_id:data.id,
			},
			getCount:true,
			getMain:true,
			fieldJson: {
			    user_id: true
			}
		})
		let userArr=user.map(item=>item.user_id)
		let res=await vk.baseDao.select({
			dbName:"uni-id-users",
			whereJson:{
				_id:{$in:userArr}
			},
			fieldJson:{
				_id:true,
				username:true,
				nickname:true,
				avatar:true
			}
		})
		return {
			code:0,
			msg:"查询当前关注此分类成功",
			result:res
		};
	}
}
