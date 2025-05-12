'use strict';
module.exports = {
	/**
	 * 添加文章
	 * @url admin/art/sys/addList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		if(data.Audit==0){
			let count1=await vk.baseDao.updateAndReturn({
				dbName:"MoeBlog-taxonomy",
					whereJson: {
					_id: data.taxonmoy_id
				},
				dataJson:{
					count: _.inc(1)
				}
			})
		}
		let res=await vk.baseDao.add({
			dbName:"MoeBlog-article",
			dataJson:{
				...data,
				user_id:uid,
				view_count:0,
				coverVideo:[]
			},
			getMain:true
		})
		return {
			code:0,
			msg:"添加文章成功",
			result:res
		};
	}
}
