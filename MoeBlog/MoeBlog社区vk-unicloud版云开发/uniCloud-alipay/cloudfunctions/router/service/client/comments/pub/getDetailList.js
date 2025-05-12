'use strict';
module.exports = {
	/**
	 * 查询二级详情评论数据
	 * @url client/comments/pub/getDetailList 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let pageIndex=event.data.pageIndex
		let index=1
		if (pageIndex == 1) {
		  try {
		    var res1 = await vk.baseDao.selects({
		      dbName: "MoeBlog-comments",
		      pageIndex: data.pageIndex,
		      whereJson: {
		        art_id: data.art_id,
		        _id: data.comments_id
		      },
		      foreignDB: [
		        {
		          dbName: "uni-id-users",
		          localKey: "user_id",
		          foreignKey: "_id",
		          as: "userinfo",
		          limit: 1,
		          fieldJson: {
		            _id: true,
		            username: true,
		            nickname: true,
		            avatar: true,
		            gxqm: true
		          }
		        }
		      ]
		    });
		    // 处理查询结果
		  } catch (error) {
		    // 处理错误
			return {
				code:-1,
				msg:"错误",
				err:error
			}
		  }
		}
		let res2=await vk.baseDao.selects({
			dbName:"MoeBlog-comments",
			pageIndex:data.pageIndex,
			whereJson:{
				art_id:data.art_id,
				parent_id:data.comments_id
			},
			foreignDB: [
			   {
			     dbName: "uni-id-users",
			     localKey: "user_id",
			     foreignKey: "_id",
			     as: "userinfo",
			     limit: 1,
				 fieldJson:{
					 _id:true,
					 username:true,
					 nickname:true,
					 avatar:true,
					 gxqm:true
				 }
			   }
			 ]
		})
		if(pageIndex==1){
			return {
				code:0,
				msg:"查询二级评论成功",
				result1:res1,
				result2:res2,
				data:data.pageIndex,
				pageI:event.data.pageIndex
			}
		}else{
			return {
				code:0,
				msg:"查询二级评论成功",
				result2:res2,
				data:data.pageIndex,
				pageI:event.data.pageIndex
			}
		}
		

		
	}
}
