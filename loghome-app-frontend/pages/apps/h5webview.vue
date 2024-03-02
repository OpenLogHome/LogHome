<template>
  <div>
   <iframe 
        id="iframe" :src="url" frameborder="0" class="pc iframe"  scrolling="auto">
    </iframe>
  </div>
 
</template>
 
<script>
import {FramePostman} from '../../lib/framepostman.js';
export default {
  data () {
    return {
      url: "",
	  baseUrl:undefined
    }
  },
  onLoad(params){
	if(params.url){
		this.url = params.url;
	}
	if(params.title){
		uni.setNavigationBarTitle({
			title:params.title
		})
	}
	if(params.baseUrl){
		this.baseUrl = params.baseUrl
	}
  },
  onShow() {
  },
  mounted(){
	  setTimeout(()=>{
		  const postman = new FramePostman({
		  	element: document.getElementById('iframe'),
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