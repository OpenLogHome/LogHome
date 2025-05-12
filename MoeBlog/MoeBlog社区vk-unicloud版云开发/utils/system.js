const SystemInfo=uni.getSystemInfoSync()
export const safeHeight = ()=>{
	return SystemInfo.statusBarHeight || 15
}
export const MenuHeight=()=>{
	if(uni.getMenuButtonBoundingClientRect){
		let {height,top} = uni.getMenuButtonBoundingClientRect()
		return (top-safeHeight())*2+height
	}else{
		return 40
	}
}
export const MenuWidth=()=>{
	if(uni.getMenuButtonBoundingClientRect){
		let {width} = uni.getMenuButtonBoundingClientRect()
		return width*2
	}
}
export const BarHeight=()=> MenuHeight()+safeHeight()
