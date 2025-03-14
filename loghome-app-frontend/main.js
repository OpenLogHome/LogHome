import App from './App'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-theme/index.css';
import SlideVerify from 'vue-monoplasty-slide-verify';
import LogImage from "./components/LogImage";

// 注册全局modal组件
import chunLeiModal from '@/components/chunLei-modal/chunLei-modal.vue'
Vue.component('chunLei-modal',chunLeiModal);
Vue.component('log-image', LogImage);

const BASE_URL_PRODUCTION = "https://loghomeService.codesocean.top"
const BASE_URL_DEV = "http://127.0.0.1:8081"

Vue.use(SlideVerify);
Vue.use(ElementUI);

// #ifndef VUE3
import Vue from 'vue'

//引入vuex
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.prototype.$baseUrl = BASE_URL_PRODUCTION;
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
    	store.state.appVersion = `Beta ${chrArr[0]}.${chrArr[1]}.${chrArr[2]}`;
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

Vue.prototype.timeConvert = function getDateDiff(dateTimeStamp) {
    // 时间字符串转时间戳
    var timestamp = new Date(dateTimeStamp).getTime();
    
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var year = day * 365;
    var now = new Date().getTime();
    var diffValue = now - timestamp;
    var result;
    if (diffValue < 0) {
        return;
    }
    var yearC = diffValue / year;
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (yearC >= 1) {
        result = "" + parseInt(yearC) + "年前";
    } else if (monthC >= 1) {
        result = "" + parseInt(monthC) + "个月前";
    } else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
    } else
        result = "刚刚";
    return result;
}


// inapp注入 开发阶段用，结束后移除
let inDev = false;
if(inDev && !window.jsBridge) {
	window.jsBridge = {
		inApp: true,
		statusBarHeight: 30,
		appVersion: "250",
		ready(callback) {
			callback();
		},
		setNavigationBarVisible(status) {
			console.log("setNavigationBarVisible", status)
		},
		setStatusBarStyle(status) {
			console.log("setStatusBarStyle", status)
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
	}
}



if(window.jsBridge && window.jsBridge.inApp) {
	let app = document.querySelector("uni-app");
	if(app) {
		app.classList.add("in-app");
	}
}

if(window.jsBridge) {
	// console.log(123);
	// jsBridge.ready(() => {
	// 	// jsBridge.setOptions({
	// 	// 	statusBarColor: "#fff2d9",
	// 	// 	statusBarBlackText:true
	// 	// });
	// });
	// console.log("jsBridge", jsBridge.statusBarHeight)
} else {
	window.jsBridge = {
		inApp: false
	}
}
Vue.prototype.jsBridge = window.jsBridge;


let clipBoardContent = "";

//原木口令检测
// setInterval(()=>{
// 	if (jsBridge.inApp) {
// 	  jsBridge.getClipboardText(function(text) {
// 	    alert(text);
// 	  });
// 	}
// },3000)


Vue.config.productionTip = false;
App.mpType = 'app'

const app = new Vue({
    ...App,
	store,
	beforeCreate(){
		Vue.prototype.$bus = this;
	}
})
app.$mount()
// #endif
