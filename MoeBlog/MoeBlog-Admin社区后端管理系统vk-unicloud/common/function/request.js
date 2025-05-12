const request=({url,data={}})=>{
	return new Promise((resolve,reject)=>{
		vk.callFunction({
		  url,
		  title:'请求中...',
		  data:{
		    ...data
		  }
		}).then((res) => {
		  resolve(res) 
		}).catch((err) => {
		  reject(err)
		});
	})
}
export default request