'use strict';
module.exports = {
	/**
	 * 查询当前关注圈子的用户
	 * @url client/taxonomy/pub/getSquareUser 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.selects({
			dbName:"MoeBlog-taxonomy-favorite",
			getMain:true,
			pageIndex:data.pageNo,
			pageSize:data.pageSize,
			whereJson:{
				taxonomy_id:data.square_id
			},
			fieldJson:{
				user_id:true
			}
		})
		let userArr=res.map(item=>item.user_id)
		let userItem=await vk.baseDao.select({
			dbName:"uni-id-users",
			whereJson:{
				_id:_.in(userArr)
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
			msg:"查询当前关注分类成功",
			result:userItem
		};
	}
}
