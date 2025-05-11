'use strict';
module.exports = {
	/**
	 * 修改用户文章
	 * @url admin/art/sys/upList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let count=data.Audit==0?1:-1
		let count1=await vk.baseDao.updateAndReturn({
				dbName:"MoeBlog-taxonomy",
				 whereJson: {
				    _id: data.taxonmoy_id
				},
				dataJson:{
					ArtCount: _.inc(count)
				}
		})
		let res=await vk.baseDao.update({
			dbName:"MoeBlog-article",
			dataJson:{
				...data
			},
			whereJson:{
				_id:data._id
			}
		})
		return {
			code:0,
			msg:"修改成功",
			result:res,
		};
	}
}
