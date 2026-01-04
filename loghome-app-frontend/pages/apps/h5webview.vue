<template>
  <div>
   <iframe 
        id="iframe" :src="url" frameborder="0" class="pc iframe"  scrolling="auto">
    </iframe>
  </div>
 
</template>
 
<script>
import {FramePostman} from '../../lib/framepostman.js';
import axios from 'axios';
export default {
  data () {
    return {
      url: "",
	  baseUrl:undefined
    }
  },
  onLoad(params){
	let targetUrl = "";
	if(params.url){
		targetUrl = params.url;
	}
	if(params.title){
		uni.setNavigationBarTitle({
			title:params.title
		})
	}
	if(params.baseUrl){
		this.baseUrl = params.baseUrl
	}

	// 尝试获取跨站登录token
	let tk = null;
	try {
		let tokenObj = JSON.parse(window.localStorage.getItem('token'));
		if(tokenObj) tk = tokenObj.tk;
	} catch (e) {
		console.log(e);
	}

	if(tk){
		axios.get(this.$baseUrl + '/users/generate_cross_site_token', {
			headers: { 
				'Authorization': tk 
			}
		}).then((res) => {
			if(res.status === 200 && res.data.crossSiteToken){
				let separator = targetUrl.includes('?') ? '&' : '?';
				this.url = targetUrl + separator + 'crossSiteToken=' + res.data.crossSiteToken;
			} else {
				this.url = targetUrl;
			}
		}).catch((e)=>{
			console.log("Cross site token generation failed", e);
			this.url = targetUrl;
		});
	} else {
		this.url = targetUrl;
	}
  },
  onShow() {
  },
  mounted(){
	  setTimeout(()=>{
		  const postman = new FramePostman({
		  	element: document.getElementById('iframe'),
			token: "loghome",
		  	info: {
		  		app: 'loghome-app',
		  		version: '1.0'
		  	}
		  })
		  
		  postman.listen((msg, e) => {
		  	console.log("gotMsg",msg)
			let msgSplit = msg.msg.split(" ");
			switch(msgSplit[0]){
				case "NovelDetail":
					console.log("跳转到书籍详情页面",msgSplit[1]);
					uni.navigateTo({
						url:'../readers/bookInfo?id=' +  msgSplit[1]
					})
					break;
				case "OpenInBrowser":
					console.log("跳转到浏览器",msgSplit[1]);
					uni.navigateTo({
						url:'./openInBrowser?url=' +  msgSplit[1]
					})
					break;
				case "NavigateBack":
					console.log("返回上一页");
					uni.navigateBack()
					break;
				default:
					uni.showToast({
						title: "错误500：未知页面指令",
						icon:'none',
						duration: 2000
					});
			}
		  })
	  })
  },
  methods: {
    
  }
 
}
</script>
 
<style scoped lang='scss'>
.iframe {
    width: 100vw;
    height: calc(100vh - 44px);
    background: #fff;
}
</style>