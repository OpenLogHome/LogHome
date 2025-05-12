// 页面初始化标记
let firstPageShow = true;

// 创建虚拟页面元素的函数
const createVirtualPage = () => {
	// #ifdef H5
	try {
		if (!document.getElementById('page2')) {
			const virtualPage = document.createElement('uni-page2');
			virtualPage.id = 'page2';
			document.body.appendChild(virtualPage);
		}
		return true;
	} catch (error) {
		console.error('创建虚拟页面失败:', error);
		return false;
	}
	// #endif
}

export const pageShow = (mode, duration)=>{
	// #ifdef H5
	setTimeout(()=>{//等待页面渲染完成，否则在页面后退时找不到元素
		const classList = document.querySelector('uni-page')?.classList;
		if (!classList) return;
		
		const className = "animation-"+(mode?mode+"-":"");
		if(duration){
			classList.add(className+"before");
			setTimeout(()=>{//等待初始样式完成渲染，transform与transition同时出现会立即执行css动画
				classList.add(className+"in", className+"after", "animation-show");
				setTimeout(()=>{
					classList.remove(className+"in", className+"after", className+"before");
				}, duration)
			},20)
		}else{//跳过动画
			classList.add("animation-show");
		}
	},20)
	// #endif
}

export const pageHide = (mode, duration)=>{
	// #ifdef H5
	const classList = document.querySelector('uni-page')?.classList;
	if (!classList) return;
	
	const className = "animation-"+(mode?mode+"-":"");
	if(duration){
		classList.add(className+"out", className+"base");
		setTimeout(() => {//等待初始样式完成渲染
			classList.remove("animation-show");
			classList.add(className+"before");
			setTimeout(()=>{
				classList.remove(className+"out", className+"base", className+"before");
			}, duration)
		}, 20)
	}else{//跳过动画
		classList.remove("animation-show");
	}
	// #endif
}

// 增强版页面展示动画，参考Vue2版本
export const enhancedPageShow = (next, animationTime = 400) => {
	// #ifdef H5
	try {
		// 确保虚拟页面已创建
		createVirtualPage();
		
		// 异步获取元素，确保DOM已经更新
		setTimeout(() => {
			try {
				// 获取页面元素
				const page2 = document.getElementById('page2');
				const uniPage = document.querySelector('uni-page');
				
				// 检查元素是否存在
				if (!page2 || !uniPage) {
					console.warn('页面元素不存在，跳过动画');
					next && next();
					return;
				}
				
				// 填充虚拟页
				page2.innerHTML = uniPage.innerHTML;
				
				// 调整虚拟页样式
				const page2_class = page2.classList;
				
				// 保持滚动高度
				let sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
				const pageWrapper = page2.querySelector('uni-page-wrapper');
				
				if (pageWrapper) {
					pageWrapper.style.cssText = 'margin-top:-' + sh + 'px';
				}
				
				// 显示虚拟页面
				page2_class.add('animation-show');
				
				// 调整真实页样式 - 先隐藏
				const page1_class = uniPage.classList;
				
				// 调用next，执行页面跳转
				next && next();
				
				// 等待新页面加载
				setTimeout(() => {
					// 获取新页面
					const newPage = document.querySelector('uni-page');
					if (!newPage) {
						console.warn('新页面元素不存在，跳过动画');
						return;
					}
					
					const newPageClass = newPage.classList;
					
					// 设置新页面初始状态
					newPageClass.add('animation-before');
					
					setTimeout(() => {
						// 显示新页面并添加动画
						page2_class.add('animation-low');
						
						setTimeout(() => {
							newPageClass.add('animation-in', 'animation-after', 'animation-show');
							page2_class.add('animation-in', 'animation-enter');
							
							// 动画结束
							setTimeout(() => {
								newPageClass.remove('animation-in', 'animation-before', 'animation-after');
								page2_class.remove('animation-show', 'animation-low', 'animation-in', 'animation-enter');
								page2.innerHTML = '';
							}, animationTime);
						}, 10);
					}, 10);
				}, 10);
			} catch (error) {
				console.error('增强页面动画处理出错:', error);
				next && next();
			}
		}, 10);
	} catch (error) {
		console.error('增强页面动画出错:', error);
		next && next();
	}
	// #endif
}

// 增强版页面隐藏动画，参考Vue2版本
export const enhancedPageHide = (next, animationTime = 400) => {
	// #ifdef H5
	try {
		// 确保虚拟页面已创建
		createVirtualPage();
		
		// 异步获取元素，确保DOM已经更新
		setTimeout(() => {
			try {
				// 获取页面元素
				const page2 = document.getElementById('page2');
				const uniPage = document.querySelector('uni-page');
				
				// 检查元素是否存在
				if (!page2 || !uniPage) {
					console.warn('页面元素不存在，跳过动画');
					next && next();
					return;
				}
				
				// 填充虚拟页
				page2.innerHTML = uniPage.innerHTML;
				
				// 调整虚拟页样式
				const page2_class = page2.classList;
				
				// 保持滚动高度
				let sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
				const pageWrapper = page2.querySelector('uni-page-wrapper');
				
				if (pageWrapper) {
					pageWrapper.style.cssText = 'margin-top:-' + sh + 'px';
				}
				
				page2_class.add('animation-high', 'animation-show');
				
				// 调整真实页样式
				next && next();
				
				setTimeout(() => {
					// 获取新页面
					const newPage = document.querySelector('uni-page');
					if (!newPage) {
						console.warn('新页面元素不存在，跳过动画');
						return;
					}
					
					// 动画起点
					const page1_class = newPage.classList;
					page1_class.add('animation-enter', 'animation-show');
					
					// 动画开始
					setTimeout(() => {
						page1_class.add('animation-in', 'animation-after');
						page2_class.add('animation-in', 'animation-before');
						
						// 动画结束
						setTimeout(() => {
							page1_class.remove('animation-in', 'animation-after', 'animation-enter');
							page2_class.remove('animation-show', 'animation-high', 'animation-in', 'animation-before');
							page2.innerHTML = '';
						}, animationTime);
					}, 10);
				}, 10);
			} catch (error) {
				console.error('增强页面隐藏动画处理出错:', error);
				next && next();
			}
		}, 10);
	} catch (error) {
		console.error('增强页面隐藏动画出错:', error);
		next && next();
	}
	// #endif
}

export default function(options={}){
	// #ifdef H5
	const {durationIn=300, durationOut=300, mode="", auto=true, except=[], enhanced=true, framePostman} = options;
	
	// 如果是增强版动画，则在页面加载时创建虚拟页面元素
	if (enhanced && firstPageShow) {
		// 预创建虚拟页
		setTimeout(() => {
			createVirtualPage();
			// 首次加载时显示页面
			const page1_class = document.querySelector('uni-page')?.classList;
			if (page1_class) {
				page1_class.add('animation-show');
			}
		}, 100);
		firstPageShow = false;
	} else if (!enhanced && firstPageShow) {
		// 基础版动画首次加载
		pageShow(mode, durationIn);
		firstPageShow = false;
	}
	
	const interceptorList = ["navigateTo", "redirectTo", "reLaunch", "switchTab", "navigateBack"];
	
	for(const item of interceptorList){
		let itemOption, itemMode, itemDurationIn, itemDurationOut;
		uni.addInterceptor(item, {
			invoke(e){//调用前拦截
				itemOption = e.animation||{};
				itemMode = itemOption.mode||mode;
				itemDurationIn = itemOption.durationIn||durationIn;
				itemDurationOut = itemOption.durationOut||durationOut;
				
				if(except.includes(item)){//排除拦截
					return true;
				}
				
				// 使用基础动画或增强动画
				if (!enhanced) {
					pageHide(itemMode, itemDurationOut);
				} else {
					// 特殊处理tabBar切换和重定向
					if (item === 'switchTab' || item === 'redirectTo' || (e.url && e.url.includes('noneAnimation'))) {
						return true;
					}
					
					// 页面回退动画
					if (item === 'navigateBack') {
						return new Promise(function(resolve, reject){
							enhancedPageHide(() => resolve(e), itemDurationOut);
						});
					}
					
					// 页面跳转动画
					return new Promise(function(resolve, reject){
						enhancedPageShow(() => resolve(e), itemDurationOut);
					});
				}
				
				return new Promise(function(resolve, reject){
					setTimeout(()=>{//等待出动画完成
						resolve(e);
					}, itemDurationOut);
				});
			},
			success(e){
				setTimeout(() => {
					framePostman.send({type: "REFRESH_TABBAR", currentUrl: document.baseURI});
				}, 11);
				if(auto && !enhanced){//自动开启进动画（基础版）
					pageShow(itemMode, itemDurationIn);
				}
			},
			fail(err){//页面跳转出错，须还原
				if (!enhanced) {
					pageShow("", 0);
				} else {
					const page1_class = document.querySelector('uni-page')?.classList;
					if (page1_class) {
						page1_class.add('animation-show');
					}
				}
				console.log(err);
			}
		});
	}
	
	//监听浏览器前进返回操作，开启自动后有效
	if(auto){
		window.addEventListener("popstate",(e)=>{
			if (!enhanced) {
				pageShow(mode, durationIn);
			} else {
				setTimeout(() => {
					const page1_class = document.querySelector('uni-page')?.classList;
					if (page1_class) {
						page1_class.add('animation-show');
					}
				}, 20);
			}
		});
	}
	
	return {
		_pageShow: function(itemOption={}){
			if (!enhanced) {
				pageShow(itemOption.mode||mode, itemOption.duration||durationIn);
			} else {
				enhancedPageShow(null, itemOption.duration||durationIn);
			}
		},
		_pageHide: function(itemOption={}){
			if (!enhanced) {
				pageHide(itemOption.mode||mode, itemOption.duration||durationOut);
			} else {
				enhancedPageHide(null, itemOption.duration||durationOut);
			}
		}
	}
	// #endif
}