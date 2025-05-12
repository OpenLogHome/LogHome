'use strict';
module.exports = {
	/**
	 * 获取文章详情
	 * @url client/art/pub/getArtDetail 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
	    let { data = {}, userInfo, util, filterResponse, originalParam } = event;
	    let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
	    let { uid } = data;
	
	    // 更新文章流量的通用函数
	    const updateArticleViewCount = async (articleId) => {
	        await vk.baseDao.updateAndReturn({
	            dbName: "MoeBlog-article",
	            whereJson: { _id: articleId },
	            dataJson: { view_count: _.inc(1) }
	        });
	    };
	
	    // 构建foreignDB数组的通用函数
	    const buildForeignDBArray = (isUserLoggedIn, articleId, userId) => {
	        let foreignDBArray = [
	            {
	                dbName: "uni-id-users",
	                localKey: "user_id",
	                foreignKey: "_id",
	                as: "userinfo",
	                limit: 1,
	                fieldJson: { _id: true, username: true, nickname: true, avatar: true, gxqm: true }
	            },
	            {
	                dbName: "MoeBlog-taxonomy",
	                localKey: "taxonmoy_id",
	                foreignKey: "_id",
	                as: "taxonmoy_info",
	                limit: 1,
	                fieldJson: { name: true, _id: true }
	            }
	        ];
	
	        if (isUserLoggedIn) {
	            foreignDBArray.push({
	                dbName: "MoeBlog-likes",
	                localKey: "_id",
	                foreignKey: "art_id",
	                as: "like_info",
	                limit: 1,
	                fieldJson: { user_id: true, _id: true },
	                whereJson: { user_id: userId ? userId : "" }
	            });
	        }
	
	        return foreignDBArray;
	    };
	
	    // 更新文章流量
	    await updateArticleViewCount(data.id);
	
	    // 查询文章数据
	    let res = await vk.baseDao.selects({
	        dbName: "MoeBlog-article",
	        whereJson: { _id: data.id },
	        foreignDB: buildForeignDBArray(!!userInfo, data.id, uid)
	    });
	
	    return {
	        code: 0,
	        msg: userInfo ? "查询文章数据成功" : "用户未登陆",
	        result: res
	    };
	}
}
