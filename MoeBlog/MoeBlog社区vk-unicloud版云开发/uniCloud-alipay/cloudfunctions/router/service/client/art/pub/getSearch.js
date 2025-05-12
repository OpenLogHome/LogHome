'use strict';
module.exports = {
	/**
	 * 搜索文章
	 * @url client/art/pub/getSearch 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res=await vk.baseDao.selects({
			dbName:"MoeBlog-article",
			getMain: true,
			pageIndex: data.pageIndex,
			pageSize: 10,
			whereJson:{
				Audit:0,
				art_status:true,
				$or: [
				    { title: new RegExp(data.text) },
				    { content: new RegExp(data.text) }
				]
			},
			foreignDB:[
			    {
			      dbName:"uni-id-users",
			      localKey:"user_id",
			      foreignKey:"_id",
			      as:"userInfo",
			      limit:1,
				  fieldJson: {
					  nickname:true,
					  _id:true,
					  avatar:true,
					  username:true,
					  gxqm:true
				  }
			    },
				{
				  dbName:"MoeBlog-taxonomy",
				  localKey:"taxonmoy_id",
				  foreignKey:"_id",
				  as:"taxonomy",
				  limit:1,
				  fieldJson: {
					  _id:true,
					  name:true
				  }
				}
			],
			sortArr: [
			    { name: "_add_time", type: "desc" }
			]  
		})
		return {
			code:0,
			msg:"搜索文章成功",
			result:res
		}
	}
}
