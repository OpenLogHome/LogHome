<script>
	import axios from 'axios'
	import h5PageAnimation from './components/h5-page-animation/';
	export default {
		mixins: [h5PageAnimation],
		onShow: function() {
			
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			utc2timestamp(utc_datetime) {
			    // 转为正常的时间格式 年-月-日 时:分:秒
			    var T_pos = utc_datetime.indexOf('T');
			    var Z_pos = utc_datetime.indexOf('Z');
			    var year_month_day = utc_datetime.substr(0,T_pos);
			    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
			    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
			
			    // 处理成为时间戳
			    timestamp = new Date(Date.parse(new_datetime));
			    timestamp = timestamp.getTime();
			    timestamp = timestamp/1000;
			
			    // 增加8个小时，北京时间比utc时间多八个时区
			    var timestamp = timestamp+8*60*60;
				return timestamp;
			},
			initializeHistory(){
				let readerHistory = window.localStorage.getItem("loghomeReaderHistory");
				if(readerHistory == null){
					readerHistory = [];
					window.localStorage.setItem("loghomeReaderHistory",JSON.stringify(readerHistory));
				}
			},
			heartbeatInit(){
				//heartBeat
				let _this = this;
				// 心跳，用于保持登陆状态、同步获取最新消息
				function heartBeat(){
					var baseUrl = _this.$baseUrl;
					let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;
					if(tk == null) return;
					// 1. 执行心跳设施
					axios.get(baseUrl + '/users/heartBeat', {
						headers: {
						     'Content-Type': 'application/json',
						     'Authorization': 'Bearer '  + tk 
						}
					}).then((res) => {
						window.localStorage.setItem('token', JSON.stringify(res.data.token));
						// 获取本地消息记录中的新消息
						let curMessage = JSON.parse(window.localStorage.getItem('messages'));
						if(curMessage == null){
							window.localStorage.setItem('messages',JSON.stringify(res.data.messages));
						}else {
							// 检查是否有新消息，如果有新消息的话，就把新消息保存到本地消息库中
							let newMessages = res.data.messages;
							if(newMessages.length > 0) {
								newMessages = newMessages.concat(curMessage);
								window.localStorage.setItem('messages',JSON.stringify(newMessages));
							}
						}
						// 检查本地消息库中的消息是否都被阅读过，如果有未读消息则使小红点亮起。
						curMessage = JSON.parse(window.localStorage.getItem('messages'));
						for(let item of curMessage){
							if(item.is_read == 0){
								uni.showTabBarRedDot({
									index: 3
								})
							}
						}
					}).catch(function(error) {
						console.log(error);
					})
				}
				
				// 应用启动时立即执行一次心跳，检查登陆状态
				heartBeat();
				// 之后每10秒执行一次心跳
				setInterval(heartBeat,10000);
			},
			editorInit(){
				let _this = this;
				//这里初始化并进行编辑器自动保存的相关工作
				let EditorAutoSaveProps = window.localStorage.getItem("EditorAutoSave");
				if(EditorAutoSaveProps){
					EditorAutoSaveProps = JSON.parse(EditorAutoSaveProps);
				} else {
					EditorAutoSaveProps = {
						timeSpan:5,
						maxAmount:100
					}
					window.localStorage.setItem("EditorAutoSave",JSON.stringify(EditorAutoSaveProps));
				}
				
				setInterval(()=>{
					this.$bus.$emit("AutoSave");
					// console.log("本地保存");
				},EditorAutoSaveProps.timeSpan*1000*60);
			}
		},
		mounted(){
			this.initializeHistory();
			//检测是否为电脑打开
			var os = function() {
			    var ua = navigator.userAgent,
			        isWindowsPhone = /(?:Windows Phone)/.test(ua),
			        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
			        isAndroid = /(?:Android)/.test(ua),
			        isFireFox = /(?:Firefox)/.test(ua),
			        isChrome = /(?:Chrome|CriOS)/.test(ua),
			        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
			        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
			        isPc = !isPhone && !isAndroid && !isSymbian;
			    return {
			        isTablet: isTablet,
			        isPhone: isPhone,
			        isAndroid: isAndroid,
			        isPc: isPc
			    };
			}();
			
			//如果是平板或手机打开则跳转到手机模式
			if(os.isAndroid || os.isPhone) {
				
			} else if(os.isTablet || os.isPc) {
				let mobileRunnerEnv = sessionStorage.getItem("MobileRunnerEnv");
				if(mobileRunnerEnv == undefined){
					window.location.href="/pc"
				}
			}
		
			// 获取整站设置状态，并决定应用哪些，比如是否开启全局灰色模式等。
			axios.get(this.$baseUrl + '/app/get_site_set', {}).then((res) => {
				if(res.data.mourn == 1){
					let bodyDOM = document.querySelector("html");
					bodyDOM.classList.add("mourn");
				}
			}).catch(function (error) {
				uni.showToast({
					title: error.toString(),
					icon:'none',
					duration: 2000
				});
			})
			
			// 获取顶栏状态
			this.$router.afterEach((to, from, next) => {
				if(this.jsBridge && this.jsBridge.inApp) {
					setTimeout(() => {
						const uniPageHead = document.querySelectorAll("uni-page-head");
						for(let item of uniPageHead) {
							if(!item.classList.contains("heightChanged")) {
								item.style.height = item.getBoundingClientRect().height + this.jsBridge.statusBarHeight + `px`;
								item.classList.add("heightChanged");
								let innerUniPageHead = document.querySelector(".uni-page-head");
								item.style.backgroundColor = innerUniPageHead.style.backgroundColor;
								innerUniPageHead.style.transform = `translateY(${this.jsBridge.statusBarHeight}px)`
								document.styleSheets[0].insertRule(`.uni-page-head::before { content: ""; 
																	 background-color: inherit;
																	 height: ${this.jsBridge.statusBarHeight + 1}px;
																	 top: -${this.jsBridge.statusBarHeight}px}`, 0);
							}
						}
						const pageWrapper = document.querySelectorAll("uni-page-wrapper");
						for(let item of pageWrapper) {
							item.style.height = item.getBoundingClientRect().height - this.jsBridge.statusBarHeight + `px`;
						}
					})
					
					// 状态栏颜色调节
					let navigationbarColorExceptions = [
						{
							path:"/pages/readers/bookInfo",
							isDark: true
						},
						{
							path:"/pages/readers/newReader/article"
						},
					]
					this.jsBridge.ready(function(){
						for(let item of navigationbarColorExceptions){
							if(item.path == to.path){
								if(item.isDark) jsBridge.setStatusBarStyle(item.isDark);
								return;
							}
						}
						jsBridge.setStatusBarStyle(false);
					})
				}
			})
			
			window.onresize = () => {
				if(this.jsBridge && this.jsBridge.inApp) {
					setTimeout(() => {
						const pageWrapper = document.querySelectorAll("uni-page-wrapper");
						for(let item of pageWrapper) {
							item.style.height = window.innerHeight - 44 - this.jsBridge.statusBarHeight + `px`;
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import './common/user_group.scss';
	*{
		font-family: "Noto Sans SC","思源黑体 CN","Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
		-webkit-user-drag: none;
	}
	img{
		max-width: 100vw;
	}
	.el-message-box {
		width: 80vw !important;
	}
	.el-drawer.bookMenu{
		background-color: transparent;
	}
	.bookMenu section.el-drawer__body{
		background-color: #000000aa !important;
	}
	html.mourn{
		-webkit-filter: grayscale(100%); 
		-moz-filter: grayscale(100%); 
		-ms-filter: grayscale(100%); 
		-o-filter: grayscale(100%); 
		_filter:none; 
	}
	
	@font-face {
	  font-family: 'iconfont';
	  src: url('./static/iconfont/iconfont.woff2?t=1720186927006') format('woff2'),
	         url('./static/iconfont/iconfont.woff?t=1720186927006') format('woff'),
	         url('./static/iconfont/iconfont.ttf?t=1720186927006') format('truetype');
	}
	.iconfont {
	  font-family: "iconfont" !important;
	  font-size: 16px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	
	.popup{
		position:absolute;
		width:100vw;
		height:100vh;
	}
	
	/*每个页面公共css */
	@import './common/aliIcon.css';
	/* 自定义公共样式 */
	@import './common/main.css';

	
	/*滚动条整体粗细样式*/
	// ::-webkit-scrollbar {
	//     /*高宽分别对应横竖滚动条的尺寸*/
	//     width: 5px;
	//     height: 5px;
	// 	z-index:1919810;
	// }
	
	// /*滚动条里面小方块*/
	// ::-webkit-scrollbar-thumb {
	//     border-radius: 0 !important;
	//     box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
	// }
	
	// /*滚动条轨道*/
	// ::-webkit-scrollbar-track {
	//     border-radius: 0 !important;
	//     box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
	//     background: #713418 !important;
	// }
	
	//tab-bar阴影
		
	div.uni-tabbar, uni-page-head, uni-page, uni-page2{
		box-shadow:
		  0px 0px 2.2px rgba(0, 0, 0, 0.02),
		  0px 0px 5.3px rgba(0, 0, 0, 0.028),
		  0px 0px 10px rgba(0, 0, 0, 0.035),
		  0px 0px 17.9px rgba(0, 0, 0, 0.042),
		  0px 0px 33.4px rgba(0, 0, 0, 0.05),
		  0px 0px 80px rgba(0, 0, 0, 0.07)
		;
		
	}
	
	.uni-tabbar{
		padding-bottom: 5px !important;
		// backdrop-filter: blur(100px) !important;
	}
	
	.uni-page-head{
		overflow: visible !important;
		// backdrop-filter: blur(100px) !important;
	}
	
	.uni-page-head:before{
		content: "";
		display: block;
		width: 100vw;
		position: absolute;
		left: 0;
		// backdrop-filter: blur(100px) !important;
	}
	
	uni-page,uni-page2{
		background-color:#F2f2f2;
	}
	
	.el-container{
		display:none !important;
	}
	
	.middleBar{
		.textarea{
			.ql-editor{
				padding: 30rpx 0;
			}
		}
	}


</style>
