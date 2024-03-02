import Vue from 'vue';

export default Vue.directive('reload-img', async function (el, binding) {//指令名称为：reload-img
	resetImgUrl(el,el.src,Number(binding.value));
})

function resetImgUrl(imgObj,imgSrc,maxErrorNum)
{  
	if(maxErrorNum > 0){  
		imgObj.onerror = function(){  
			resetImgUrl(imgObj,imgSrc,maxErrorNum-1);
			uni.showToast({
			  	title: `正在处理图片，请耐心等待`,
			  	icon:'none',
			  	duration: 2000,
				icon:"loading"
			});
			imgObj.style.height = 0;
		};  
		setTimeout(function(){  
			imgObj.src=imgSrc;
			imgObj.style.height = "auto";
		},1000);  
	}else{
		imgObj.onerror=null;
		imgObj.src="http://img.codesocean.top/image/1649432857796";
	}  
}