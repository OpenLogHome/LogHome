import request from "@/common/function/request.js"

//查询首页的统计
export const getIndexCount=(data)=>{
	return request({url:"admin/index/sys/index.getList",data})
}

//查询最新上传的壁纸和头像
export const getImgList=(data)=>{
	return request({url:"admin/index/sys/index.getImgList",data})
}

//查询分类的占比
export const getCate=(data)=>{
	return request({url:"admin/index/sys/index.getCategoryNum",data})
}

//查询每月注册的人数
export const getUserCount=(data)=>{
	return request({url:"admin/index/sys/index.getUserCount",data})
}