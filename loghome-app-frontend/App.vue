<script>
	import axios from 'axios'
	import h5PageAnimation from './components/h5-page-animation/';
	import '@/common/theme.scss';
	export default {
		mixins: [h5PageAnimation],
		onShow: function() {
			
		},
		onHide: function() {
			console.log('App Hide')
		},
		onLaunch: function() {
			console.log('App Launch');
			// #ifdef H5
			this.initTheme();
			// #endif
			this.globalLoadingDom = document.getElementById("global-loading-box");
			// 覆写uni.showLoading方法
			uni.showLoading = (options) => {
				this.globalLoadingDom.classList.add("show");
				let callable = (func) => {
					if(typeof func == "function"){
						return func;
					}
					return () => {};
				}
				if(options.success && callable(options.success)){
					options.success(callable(options.success));
				}
				if(options.title) {
					let titleDom = this.globalLoadingDom.querySelector(".title");
					titleDom.textContent = options.title;
				} else {
					let titleDom = this.globalLoadingDom.querySelector(".title");
					titleDom.textContent = "努力加载中";
				}
			}
			uni.hideLoading = () => {
				setTimeout(() => {
					this.globalLoadingDom.classList.remove("show");
				}, 300);
			}
		},
		data() {
			return {
				globalLoadingDom: undefined
			}
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
						// 更新token
						if(res.data && res.data.token && res.data.token.tk) {
							window.localStorage.setItem('token', JSON.stringify(res.data.token));
						}
						
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
						
						// 2. 检查是否有未读私信
						axios.get(baseUrl + '/community/unread_messages_count', {
							headers: {
								'Content-Type': 'application/json',
								'Authorization': 'Bearer ' + tk
							}
						}).then((unreadRes) => {
							// 保存未读私信数量到本地存储
							window.localStorage.setItem('unreadPrivateMessages', unreadRes.data.count);
							
							// 检查本地消息库中的消息是否都被阅读过，或者是否有未读私信
							// 如果有未读消息或未读私信则使小红点亮起
							curMessage = JSON.parse(window.localStorage.getItem('messages'));
							let hasUnreadSystemMessage = false;
							for(let item of curMessage){
								if(item.is_read == 0){
									hasUnreadSystemMessage = true;
									break;
								}
							}
							
							let hasUnreadPrivateMessage = unreadRes.data.count > 0;
							
							if(hasUnreadSystemMessage || hasUnreadPrivateMessage){
								uni.showTabBarRedDot({
									index: 4
								});
							} else {
								uni.hideTabBarRedDot({
									index: 4
								});
							}
						}).catch(function(error) {
							console.log('获取未读私信数量失败', error);
						});
					}).catch(function(error) {
						console.log(error);
					})
				}
				
				// 应用启动时立即执行一次心跳，检查登陆状态
				heartBeat();
				// 之后每30秒执行一次心跳
				setInterval(heartBeat,30000);
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
			},
			updateNavidationBarTheme(){
				if(this.$store.state.isDarkMode) {
					uni.setTabBarStyle({
						color: "#7A7E83",
						selectedColor: "#d3442b",
						borderStyle: "white",
						backgroundColor: "#000000",
					})
					uni.setNavigationBarColor({
						backgroundColor: "#000000",
					})
				} else {
					uni.setTabBarStyle({
						color: "#7A7E83",
						selectedColor: "#d3442b",
						borderStyle: "white",
						backgroundColor: "#ffffff",
					})
					uni.setNavigationBarColor({
						backgroundColor: "#ffffff",
					})
				}
			},
			updatePageState() {
				this.updateNavidationBarTheme();
				if(this.$store.state.isDarkMode) {
					document.body.classList.add('dark-mode');
				} else {
					document.body.classList.remove('dark-mode');
				}
			},
			// 初始化主题模式
			initTheme() {
				// 获取保存的主题模式
				const savedTheme = window.localStorage.getItem('themeMode');
				
				// 检查系统是否处于深色模式
				const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
				
				// 优先使用保存的主题模式，如果没有保存过则使用系统主题模式
				if (savedTheme === 'dark' || (savedTheme !== 'light' && prefersDarkMode)) {
					document.documentElement.classList.add('dark-mode');
					this.$store.state.isDarkMode = true;
					this.updatePageState();
				} else {
					document.documentElement.classList.remove('dark-mode');
					this.$store.state.isDarkMode = false;
					this.updatePageState();
				}
				
				// 监听系统主题变化，如果用户没有手动设置过主题模式
				if (!savedTheme) {
					window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
						if (e.matches) {
							document.documentElement.classList.add('dark-mode');
							this.$store.state.isDarkMode = true;
							this.updatePageState();
						} else {
							document.documentElement.classList.remove('dark-mode');
							this.$store.state.isDarkMode = false;
							this.updatePageState();
						}
					});
				}
			},
			// 切换主题模式
			toggleTheme() {
				const isDarkMode = document.documentElement.classList.contains('dark-mode');
				if (isDarkMode) {
					document.documentElement.classList.remove('dark-mode');
					window.localStorage.setItem('themeMode', 'light');
					this.$store.state.isDarkMode = false;
					this.updatePageState();
				} else {
					document.documentElement.classList.add('dark-mode');
					window.localStorage.setItem('themeMode', 'dark');
					this.$store.state.isDarkMode = true;
					this.updatePageState();
				}
			},
		},
		mounted(){
			this.initializeHistory();
			this.initTheme(); // 初始化主题
			//检测是否为电脑打开
			// var os = function() {
			//     var ua = navigator.userAgent,
			//         isWindowsPhone = /(?:Windows Phone)/.test(ua),
			//         isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
			//         isAndroid = /(?:Android)/.test(ua),
			//         isFireFox = /(?:Firefox)/.test(ua),
			//         isChrome = /(?:Chrome|CriOS)/.test(ua),
			//         isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
			//         isPhone = /(?:iPhone)/.test(ua) && !isTablet,
			//         isPc = !isPhone && !isAndroid && !isSymbian;
			//     return {
			//         isTablet: isTablet,
			//         isPhone: isPhone,
			//         isAndroid: isAndroid,
			//         isPc: isPc
			//     };
			// }();
			
			//如果是平板或手机打开则跳转到手机模式
			// if(os.isAndroid || os.isPhone) {
				
			// } else if(os.isTablet || os.isPc) {
			// 	let mobileRunnerEnv = sessionStorage.getItem("MobileRunnerEnv");
			// 	if(mobileRunnerEnv == undefined){
			// 		window.location.href="/pc"
			// 	}
			// }
		
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
				if(window.jsBridge && window.jsBridge.inApp) {
					// setTimeout(() => {
					// 	const uniPageHead = document.querySelectorAll("uni-page-head");
					// 	for(let item of uniPageHead) {
					// 		if(!item.classList.contains("heightChanged")) {
					// 			item.style.setProperty("height", `${window.jsBridge.statusBarHeight + 44}px`, "important")
					// 			// item.style.height = item.getBoundingClientRect().height + window.jsBridge.statusBarHeight + `px`;
					// 			item.classList.add("heightChanged");
					// 			let innerUniPageHead = document.querySelector(".uni-page-head");
					// 			item.style.backgroundColor = innerUniPageHead.style.backgroundColor;
					// 			innerUniPageHead.style.transform = `translateY(${window.jsBridge.statusBarHeight}px)`;
					// 			console.log("innerUniPageHeadHeight", innerUniPageHead.getBoundingClientRect().height)
					// 			innerUniPageHead.style.setProperty("height", "44px", "important");
					// 			innerUniPageHead.style.setProperty("padding", "7px 0", "important");
					// 			document.styleSheets[0].insertRule(`.uni-page-head::before { content: ""; 
					// 												 background-color: inherit;
					// 												 height: ${window.jsBridge.statusBarHeight + 1}px;
					// 												 top: -${window.jsBridge.statusBarHeight}px}`, 0);
					// 		} //inherit
					// 	}
					// 	const pageWrapper = document.querySelectorAll("uni-page-wrapper");
					// 	for(let item of pageWrapper) {
					// 		item.style.height = item.getBoundingClientRect().height - window.jsBridge.statusBarHeight + `px`;
					// 	}
					// })
					
					// 状态栏颜色调节
					let navigationbarColorExceptions = [
						{
							path:"/pages/readers/bookInfo",
							backgroundColor: "#252525",
						},
					]
					window.jsBridge.ready(() => {
						for(let item of navigationbarColorExceptions){
							if(item.path == to.path){
								window.jsBridge.setSystemUIStyle(item.backgroundColor);
								return;
							}
						}
						window.jsBridge.setSystemUIStyle(this.$store.state.isDarkMode ? "#252525" : "#ffffff");
					})
				}
				
				if(window.sessionStorage.getItem("hideBack") == "true") {
					setTimeout(() => {
						let backBtn = document.querySelector(".uni-page-head-hd");
						console.log(backBtn);
						backBtn.style.display = "none";
					})
				}
			})
			
			window.onresize = () => {
				if(window.jsBridge && window.jsBridge.inApp) {
					// setTimeout(() => {
					// 	const pageWrapper = document.querySelectorAll("uni-page-wrapper");
					// 	for(let item of pageWrapper) {
					// 		item.style.height = window.innerHeight - 44 - window.jsBridge.statusBarHeight + `px`;
					// 	}
					// })
				}
			}

			this.heartbeatInit();
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
			0px 0px 5.3px rgba(0, 0, 0, 0.028),
			0px 0px 17.9px rgba(0, 0, 0, 0.042),
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
	
	uni-actionsheet{
		z-index: 999 !important;
	}
	
	.el-drawer__wrapper{
		z-index: 998 !important;
	}
	
	.v-modal{
		z-index: 997 !important;
	}
	
	uni-modal{
		z-index: 999 !important;
	}

	.el-collapse.collapse2list{
		.el-collapse-item__header{
			color: #333333 !important;
		}
	}

	#global-loading-box{
		width: 200rpx;
		padding-bottom: 10rpx;
		border-radius: 40rpx;
		.title{
			color: white;
			font-size: 22rpx;
			text-align: center;
			margin-top: 0;
			transform: translateY(-30rpx);
		}
	}


	#global-loading-box.show{
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}

</style>
