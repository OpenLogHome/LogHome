import { request } from "@/utils/request.js";
// API函数集合

// 轮播图管理
export function apiGetBanner() {
    // 获取轮播图
    return request({ url: "client/banner/pub/getList" });
}

// 圈子分类管理
export function apiGetSquareCommend(){
	//获取热门推荐置顶圈子 默认四条
	return request({url:"client/taxonomy/pub/getCommend"})
}
export function apiGetTaxonomy() {
    // 获取圈子分类
    return request({ url: "client/taxonomy/pub/getList" });
}
export function apiAddTaxonomyFavorite(data) {
    // 用户添加分类进收藏
    return request({ url: "client/taxonomy/kh/addFavorite", data });
}
export function apiGetTaxonomyUser(data) {
    // 查询关注了此分类的用户
    return request({ url: "client/taxonomy/pub/getUserFavorite", data });
}
export function apiGetTaxonomyUserCurrent() {
    // 查询当前用户关注了的分类
    return request({ url: "client/taxonomy/kh/getUserFavoriteCurrent" });
}
export function apiGetSquareDetail(data) {
    // 获取当前圈子分类的详细信息
    return request({ url: "client/taxonomy/pub/getDetailList", data });
}
export function apiGetSquareAll(data) {
    // 查询当前用户的创建的圈子信息 包括 已审核 未通过 已通过
    return request({ url: "client/taxonomy/kh/getSquareAll", data });
}
export function apiDelTaxonomyFavorite(data) {
    // 删除当前用户某个分类的关注
    return request({ url: "client/taxonomy/kh/delFavorite", data });
}
export function apiAddSquare(data) {
    // 用户添加二级分类发送请求
    return request({ url: "client/taxonomy/kh/addSquare", data });
}
export function apiGetSquare1() {
    // 查询分类的一级分类
    return request({ url: "client/taxonomy/pub/getLevel1" });
}
export function apiGetSquare(data){
	// 查询分类的显示信息  圈子square
	return request({ url: "client/taxonomy/pub/getSquare",data});
}
export function apiGetSquareUser(data) {
    // 查询当前关注圈子的用户
    return request({ url: "client/taxonomy/pub/getSquareUser", data });
}

// 文章管理
export function apiAddArt(data) {
    // 用户发布文章
    return request({ url: "client/art/kh/addList", data });
}
export function apiGetArt(data) {
    // 获取所有用户文章
    return request({ url: "client/art/pub/getList", data });
}
export function apiGetUserArt(data) {
    // 获取当前登陆用户后的文章
    return request({ url: "client/art/kh/getUserArt", data });
}
export function apiGetArtDetail(data) {
    // 查询当前文章的详情
    return request({ url: "client/art/pub/getArtDetail", data });
}
export function apiUpArt(data) {
    // 当前登陆用户修改自己的某个文章
    return request({ url: "client/art/kh/upList", data });
}
export function apiDelUserArt(data) {
    // 删除当前用户的自己选的某一篇文章
    return request({ url: "client/art/kh/delList", data });
}
export function apiGerSquareArt(data) {
    // 获取当前圈子下的文章 
    return request({ url: "client/art/pub/getTaxonomyArt", data });
}

// 用户互动管理
export function apiAddComments(data) {
    // 用户发布评论
    return request({ url: "client/comments/kh/addList", data });
}
export function apiDelComments(data){
	//用户删除当前评论
	return request({url:"client/comments/kh/delList",data})
}
export function apiGetComments(data) {
    // 查询当前文章的评论
    return request({ url: "client/comments/pub/getList", data });
}
export function apiGetUserComments(data) {
    // 查询当前用户发布的文章的被评论的所有内容
    return request({ url: "client/comments/kh/getUserComments", data });
}
export function apiGetCommentsDetail(data) {
    // 查询当前文章的评论  二级详情页面
    return request({ url: "client/comments/pub/getDetailList", data });
}
export function apiAddUserLikeArt(data) {
    // 用户添加文章喜欢或点赞
    return request({ url: "client/like/kh/addList", data });
}
export function apiDelUserLikeArt(data) {
    // 删除当前用户点赞的当前文章
    return request({ url: "client/like/kh/delList", data });
}
export function apiGetUserLikeArt(data) {
    // 查询当前用户点赞喜欢的文章
    return request({ url: "client/art/kh/getUserLikeArt", data });
}
export function apiAddUserLike(data) {
    // 用户对用户添加关注
    return request({ url: "client/user/kh/addLike", data });
}
export function apiDelUserLike(data) {
    // 删除当前用户对用户添加关注
    return request({ url: "client/user/kh/delLike", data });
}
export function apiGetUserFans(data) {
    // 查询当前用户的关注或者粉丝
    return request({ url: "client/user/kh/getUserFans", data });
}
export function apiGetUserFansNum() {
    // 查询当前用户的关注或者粉丝的数量
    return request({ url: "client/user/kh/getUserFansNum" });
}
export function apiUpUserInfo(data) {
    // 用户中心更改信息
    return request({ url: "client/user/kh/upList", data });
}
export function apiGetUserInfo(data) {
    // 查询用户中心的某个用户信息
    return request({ url: "client/user/pub/getList", data });
}
export function apiGetUserArtList(data) {
    // 查询用户中心的某个用户的文章信息
    return request({ url: "client/art/pub/getUserArt", data });
}
export function apiGetIndexTax(){
	//查询首页分类列表所展示的文字
	return request({url:"client/index_taxonomy/pub/getList"})
}
export function apiGetSearch(data){
	//搜索文章
	return request({url:"client/art/pub/getSearch",data})
}

//后台管理Admin
export function apiGetAdminArt(data){
	//获取文章
	return request({url:"client/admin/kh/art.getList",data})
}
export function apiUpAdminArt(data){
	//修改文章
	return request({url:"client/admin/kh/art.upList",data})
}

export function apiGetAdminSquare(data){
	//获取圈子分类信息
	return request({url:"client/admin/kh/square.getList",data})
}
export function apiUpAdminSquare(data){
	//获取圈子分类信息
	return request({url:"client/admin/kh/square.upList",data})
}