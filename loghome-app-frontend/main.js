import App from './App'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-theme/index.css';
import 'element-theme/dark-theme.css'; // 导入Element UI深色模式样式
import SlideVerify from 'vue-monoplasty-slide-verify';
import LogImage from "./components/LogImage";
import UserAvatar from "./components/UserAvatar";
import darkNavigationMixin from './mixins/dark-navigation.vue';
import localizedNavigationMixin from './mixins/localized-navigation.js';
import { installNativeRouter } from './common/native-router';
import { installAiNavigationGuard, syncAiPreference, AI_DISABLED_STORAGE_KEY } from './common/ai-preference.js';
import aiAssistanceMixin from './mixins/ai-assistance.js';
import { relativeTime } from './common/datetime.js';
import i18n from './i18n';
import { resolveEffectiveLanguage } from './i18n/resolve.js';

// 导入自定义指令
import './plugins/directives'

// 注册全局modal组件
import chunLeiModal from '@/components/chunLei-modal/chunLei-modal.vue'
Vue.component('chunLei-modal',chunLeiModal);
Vue.component('log-image', LogImage);
Vue.component('user-avatar', UserAvatar);

// 注册主题切换组件
import ThemeSwitch from '@/components/theme-switch.vue';
Vue.component('theme-switch', ThemeSwitch);

const BASE_URL_PRODUCTION = "https://api.loghome.ink"
const BASE_URL_DEV = "http://127.0.0.1:9000"
const BASE_URL_EMULATOR_DEV = "http://10.0.2.2:9000"
const READER_AI_BASE_URL_PRODUCTION = "https://ai.loghome.ink"
const READER_AI_BASE_URL_DEV = "http://127.0.0.1:9101"
const READER_AI_BASE_URL_EMULATOR_DEV = "http://10.0.2.2:9101"
const COLLABORATION_WS_URL_PRODUCTION = "wss://ai.loghome.ink"
const COLLABORATION_WS_URL_DEV = "ws://127.0.0.1:9102"
const COLLABORATION_WS_URL_EMULATOR_DEV = "ws://10.0.2.2:9102"

// const STORE_BASE_URL_PRODUCTION = "http://store.codesocean.top"
// const STORE_BASE_URL_DEV = "http://localhost:5173"

Vue.use(SlideVerify);
Vue.use(ElementUI);

// #ifndef VUE3
import Vue from 'vue'

//引入vuex
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.prototype.$baseUrl = BASE_URL_PRODUCTION;
Vue.prototype.$readerAiBaseUrl = READER_AI_BASE_URL_PRODUCTION;
Vue.prototype.$collaborationWsUrl = COLLABORATION_WS_URL_PRODUCTION;
// Vue.prototype.$storeBaseUrl = STORE_BASE_URL_PRODUCTION;
Vue.prototype.$isFromLogin = false; 
Vue.prototype.$backupResources = {
	bookCover:"https://s4.ax1x.com/2022/01/13/7lYAlq.png"
}
Vue.prototype.$moveVerifyImgs = [
	"http://img.codesocean.top/image/1659258683578",
	"http://img.codesocean.top/image/1659258624240",
	"http://img.codesocean.top/image/1659258624590",
	"http://img.codesocean.top/image/1659258587988",
	"http://img.codesocean.top/image/1659258650055",
	"http://img.codesocean.top/image/1659258617179",
	"http://img.codesocean.top/image/1659258665241",
	"http://img.codesocean.top/image/1659258634882",
	"http://img.codesocean.top/image/1659258578726",
	"http://img.codesocean.top/image/1659258679756",
	"http://img.codesocean.top/image/1659258675041",
	"http://img.codesocean.top/image/1659258574112",
]
Vue.prototype.$previewImg = function(urls){
	uni.previewImage({
		urls: urls
	});
}

Array.prototype.insert = function(index, value){
    this.splice(index,0, value);
}

// 添加请求拦截器
let _this = this;
axios.interceptors.request.use(function (config) {
    // APP版本包含在请求头
	let env = window.jsBridge && jsBridge.inApp;
    if(env){
		let chrArr = String(jsBridge.appVersion).split('');
    	store.state.appVersion = jsBridge.appVersion;
		store.state.appVersionStr = `Beta ${chrArr[0]}.${chrArr[1]}.${chrArr[2]}`;
		config.headers.appVersion = `Beta ${chrArr[0]}.${chrArr[1]}.${chrArr[2]}`;
    } else {
		config.headers.appVersion = "WebBrowser";
	}
	// 设备指纹包含在请求头
	//获取localStorage中的设备指纹
	let deviceFingerprint = localStorage.getItem("LogHomeDeviceFingerprint");
	//如果存在设备指纹，则向云端验证设备指纹合法性，包括：检查指纹是否存在、检查指纹对应的设备型号是否一致。
	if(deviceFingerprint != undefined){
		config.headers.deviceFingerprint = deviceFingerprint;
	}
	// 界面语言包含在请求头（i18n，后端按此返回本地化文案）
	config.headers['X-Lang'] = resolveEffectiveLanguage();
    return config;
}, function (error) { 
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
	// 对响应数据做点什么
	return response;
}, function (error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});


//IndexedDB-------------------------------------------------------------
window.localStorage.setItem("IndexedDB","enabled");
let dbStatus = window.localStorage.getItem("IndexedDB");
if(!dbStatus || (dbStatus && dbStatus == "enabled")){
	//如果是初次加载或者db被启动
	var db; // 全局的indexedDB数据库实例。
	
	//1\. 获取IDBFactory接口实例
	var indexedDB =
	  window.indexedDB ||
	  window.webkitIndexedDB ||
	  window.mozIndexedDB ||
	  window.msIndexedDB;
	
	if (!indexedDB) {
		alert('你的环境不支持本地存储，本地备份功能将无法使用。');
		window.localStorage.setItem("IndexedDB","disabled");
	} else {
		window.localStorage.setItem("IndexedDB","enabled");
		
		//获取本地数据库持久化存储
		let dbStatus = window.localStorage.getItem("IndexedDB");
		
		let version = 20220406;
		Vue.prototype.$DBVersion = version;
		
		var db;
		
		// 2\. 通过IDBFactory接口的open方法打开一个indexedDB的数据库实例
		// 第一个参数： 数据库的名字，第二个参数：数据库的版本。返回值是一个：IDBRequest实例,此实例有onerror和onsuccess事件。
		let IDBOpenDBRequest = indexedDB.open('LogCommunity', version);
		
		// 第一次打开成功后或者版本有变化自动执行以下事件：一般用于初始化数据库。
		IDBOpenDBRequest.onupgradeneeded = function(e) {
		  console.log('数据库版本更改： ' + version);
		  db = e.target.result; // 获取到 demoDB对应的 IDBDatabase实例,也就是我们的数据库。
		  if (!db.objectStoreNames.contains("articleBackup")) {
		    //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
		    // objectStore就相当于数据库中的一张表。IDBObjectStore类型。
		    var objectStore = db.createObjectStore("articleBackup", {
		      keyPath: 'history_id',
			  autoIncrement: true
		    });
			
			//指定可以被索引的字段，unique字段是否唯一。类型： IDBIndex
			objectStore.createIndex('article_id', 'article_id', {
			  unique: false
			});
		    objectStore.createIndex('article_title', 'article_title', {
		      unique: false
		    });
		    objectStore.createIndex('article_content', 'article_content', {
		      unique: false
		    });
			objectStore.createIndex('text_count', 'text_count', {
			  unique: false
			});
			objectStore.createIndex('time', 'time', {
			  unique: false
			});
		  }
		  
		  if (!db.objectStoreNames.contains("localArticles")) {
		    //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
		    // objectStore就相当于数据库中的一张表。IDBObjectStore类型。
		    var objectStore = db.createObjectStore("localArticles", {
				keyPath: 'article_id',
		    });
		  			
			//指定可以被索引的字段，unique字段是否唯一。类型： IDBIndex
		    objectStore.createIndex('article_title', 'article_title', {
		      unique: false
		    });
		    objectStore.createIndex('article_content', 'article_content', {
		      unique: false
		    });
			objectStore.createIndex('time', 'time', {
			  unique: false
			});
		  }
		  
		  if (!db.objectStoreNames.contains("offlineArticleCache")) {
		      //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
		      // objectStore就相当于数据库中的一张表。IDBObjectStore类型。
		      var objectStore = db.createObjectStore("offlineArticleCache", {
		  		keyPath: 'article_id',
		      });
		    			
		  	//指定可以被索引的字段，unique字段是否唯一。类型： IDBIndex
			  objectStore.createIndex('article_chapter', 'article_chapter', {
			    unique: false
			  });
			  objectStore.createIndex('novel_id', 'novel_id', {
			    unique: false
			  });
			objectStore.createIndex('time', 'time', {
			  unique: false
			});
			objectStore.createIndex('article_type', 'article_type', {
			  unique: false
			});
		}
		  
		  console.log('数据库版本更改完成');
		}
		
	}
	
} else {
	
}

Vue.prototype.timeConvert = function timeConvert(dateTimeStamp) {
	// i18n：相对时间格式化迁移至 common/datetime.js（zh 输出与旧实现一致）
	return relativeTime(dateTimeStamp);
}


// inapp注入 开发阶段用，结束后移除
let inDev = false;
if(inDev && !window.jsBridge) {
	window.jsBridge = {
		inApp: true,
		statusBarHeight: 30,
		appVersion: "269",
		ready(callback) {
			callback();
		},
		setNavigationBarVisible(status) {
			console.log("setNavigationBarVisible", status)
		},
		setSystemUIStyle(bgColor) {
			console.log("setSystemUIStyle", bgColor)
		},
		getBatteryLevel() {
			return new Promise((resolve, reject) => {
				resolve(50);
			});
		},
		getBatteryState() {
			return new Promise((resolve, reject) => {
				resolve(false);
			});
		},
		enableVolumeKeyListener() {
			console.log("enableVolumeKeyListener")
			// return window.flutter_inappwebview.callHandler('enableVolumeKeyListener');
		},
		disableVolumeKeyListener() {
			console.log("disableVolumeKeyListener")
			// return window.flutter_inappwebview.callHandler('disableVolumeKeyListener');
		},
			hotUpdateAssets(url, version) {
				console.log("hotUpdateAssets", url, version)
			},
			downloadFont(fontKey, fontUrl, fontFormat, fontVersion) {
				console.log("downloadFont", fontKey, fontUrl, fontFormat, fontVersion)
				return Promise.resolve(fontUrl);
			},
			nativeRouterAvailable: false,
			nativeNavigateTo(payload) {
				console.log("nativeNavigateTo", payload)
				return Promise.resolve({ ok: false, reason: "dev mock" });
			},
			nativeRedirectTo(payload) {
				console.log("nativeRedirectTo", payload)
				return Promise.resolve({ ok: false, reason: "dev mock" });
			},
			nativeReLaunch(payload) {
				console.log("nativeReLaunch", payload)
				return Promise.resolve({ ok: false, reason: "dev mock" });
			},
			nativeSwitchTab(payload) {
				console.log("nativeSwitchTab", payload)
				return Promise.resolve({ ok: false, reason: "dev mock" });
			},
			nativeNavigateBack(payload) {
				console.log("nativeNavigateBack", payload)
				return Promise.resolve({ ok: false, reason: "dev mock" });
			},
		}
	}



if(window.jsBridge && window.jsBridge.inApp) {
	let app = document.querySelector("uni-app");
	if(app) {
		app.classList.add("in-app");
	}
}

if(window.jsBridge) {
} else {
	window.jsBridge = {
		inApp: false
	}
}

Vue.prototype.jsBridge = window.jsBridge;
if (typeof uni !== 'undefined') {
	installNativeRouter(uni);
	installAiNavigationGuard(uni, store, () => uni.showToast({ title: i18n.t('settings.ai.disabledNotice'), icon: 'none' }));
}

window.addEventListener('storage', (event) => {
	if (event.key === AI_DISABLED_STORAGE_KEY || event.key === null) syncAiPreference(store);
});


let clipBoardContent = "";

//原木口令检测
// setInterval(()=>{
// 	if (jsBridge.inApp) {
// 	  jsBridge.getClipboardText(function(text) {
// 	    alert(text);
// 	  });
// 	}
// },3000)

Vue.mixin(darkNavigationMixin);
Vue.mixin(localizedNavigationMixin);
Vue.mixin(aiAssistanceMixin);

Vue.config.productionTip = false;
App.mpType = 'app'

const app = new Vue({
    ...App,
	store,
	i18n,
	beforeCreate(){
		Vue.prototype.$bus = this;
	}
})
app.$mount()
// #endif
