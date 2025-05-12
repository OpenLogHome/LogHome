'use strict';
module.exports = {
	/**
	 * 创建二级分类申请
	 * @url client/taxonomy/kh/addSquare 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 * Audit 0是已通过  1是审核中 2是为通过  默认为1 审核中
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.add({
			dbName:"MoeBlog-taxonomy",
			dataJson:{
				sort:0,
				status:true,
				...data,
				Audit:1,
				ArtCount:0,
				fans_count:0,
				user_id:uid
			}
		})
		return {
			code:0,
			msg:"发送创建成功",
			result:res
		};
	}
}
