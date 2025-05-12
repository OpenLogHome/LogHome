export function username(item){
	//默认昵称
	return item.nickname || item.username || "默认昵称"
}
export function avatar(item){
	//默认头像
	return item.avatar || '/static/img/user-default.png'
}
export function gxqm(item){
	//返回个性签名
	return item.gxqm || "此人还没有个性签名"
}
export function gender(item){
	//返回性别
	return item.gender || 2
}
export function background(item){
	//返回用户背景图
	return item.background || '/static/img/default-bg.jpg'
}
export function frame(item){
	return item.frame || 25
}