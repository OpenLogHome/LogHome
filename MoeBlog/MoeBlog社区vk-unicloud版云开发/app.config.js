// 引入自定义公共函数
import myPubFunction from '@/common/function/myPubFunction.js'
export default {
	// 开发模式启用调式模式(请求时会打印日志)
	debug: process.env.NODE_ENV !== 'production',
	// 主云函数名称
	functionName: "router",
	// 登录页面路径
	login: {
		url: '/pages/auth/auth'
	},
	// 首页页面路径
	index: {
		url: '/pages/index/index'
	},
	// 404 Not Found 错误页面路径
	error: {
		url: '/pages/index/index'
	},
	// 前端默认时区（中国为8）
	targetTimezone:8, 
	// 日志风格
	logger: {
		colorArr: [
			"#0095f8",
			"#67C23A"
		]
	},
	/**
	 * app主题颜色
	 * vk.getVuex('$app.color.main')
	 * vk.getVuex('$app.color.secondary')
	 */
	color: {
		main: "#ff4444",
		secondary: "#555555"
	},
	// 需要检查是否登录的页面列表
	checkTokenPages: {
		/**
		 * 如果 mode = 0 则代表自动检测
		 * 如果 mode = 1 则代表list内的页面需要登录，不在list内的页面不需要登录
		 * 如果 mode = 2 则代表list内的页面不需要登录，不在list内的页面需要登录
		 * 注意1: list内是通配符表达式，非正则表达式
		 * 注意2: 需要使用 vk.navigateTo 代替 uni.navigateTo 进行页面跳转才会生效
		 * 注意3: 想要让 tabbar 页面必须登录才能访问，则需要手动在页面的onLoad里加 vk.pubfn.checkLogin();
		 * 在无需登录的页面上执行kh或sys函数，也会自动判断是否登录，未登录会自动跳登录页面，登录成功后会自动返回本来要跳转的页面。
		 */
		mode: 1,
		list: [
			"/pages/my/my"
		]
	},
	// 需要检查是否可以分享的页面列表(仅小程序有效)
	checkSharePages: {
		/**
		 * 如果 mode = 0 则不做处理
		 * 如果 mode = 1 则代表list内的页面可以被分享，不在list内的页面不可以被分享
		 * 如果 mode = 2 则代表list内的页面不可以被分享，不在list内的页面可以被分享
		 * 注意: list内是通配符表达式，非正则表达式
		 */
		mode: 0,
		// ['shareAppMessage', 'shareTimeline'],
		menus: ['shareAppMessage'],
		list: [
			"/pages/index/*",
			"/pages/goods/*",
			"/pages_template/*",
		]
	},
	// 静态文件的资源URL地址
	staticUrl: {
		// Logo
		logo: '/static/logo.png',
	},
	// 自定义公共函数，myPubFunction内的函数可通过vk.myfn.xxx() 调用
	myfn: myPubFunction,
	// 第三方服务配置
	service: {
		// 云储存相关配置
		cloudStorage: {
			/**
			 * vk.uploadFile 接口默认使用哪个存储
			 * unicloud 空间内置存储（默认）
			 * extStorage 扩展存储
			 * aliyun 阿里云oss 
			 */
			defaultProvider: "extStorage",
			// 空间内置存储
			unicloud: {
				// 暂无配置项
			},
			// 扩展存储配置
			extStorage: {
				provider: "qiniu", // qiniu: 扩展存储-七牛云
				// 根目录名称（如果改了这里的dirname，则云函数user/pub/getUploadFileOptionsForExtStorage内判断的目录权限也要改，否则无法上传）
				dirname: "public",
				// 用于鉴权的云函数地址（一般不需要改这个参数）
				authAction: "user/pub/getUploadFileOptionsForExtStorage",
				// 自定义域名，如：cdn.example.com（填你在扩展存储绑定的域名）
				domain: "https://moeblogqiniu.codesocean.top",
				// 上传时，是否按用户id进行分组储存
				groupUserId: false,
			},
			// 阿里云oss
			// 密钥和签名信息（由于签名的获取比较麻烦,建议初学者使用上传到unicloud或extStorage的方案，上传到阿里云OSS是给有特殊需求的用户使用）
			// 相关文档 : https://help.aliyun.com/document_detail/31925.html?spm=a2c4g.11186623.6.1757.b7987d9czoFCVu
			aliyun: {
				// 密钥和签名信息
				uploadData: {
					OSSAccessKeyId: "",
					policy: "",
					signature: "",
				},
				// oss上传地址
				action: "https://xxx.oss-cn-hangzhou.aliyuncs.com",
				// 根目录名称
				dirname: "public",
				// oss外网访问地址，也可以是阿里云cdn地址
				host: "https://xxx.xxx.com",
				// 上传时，是否按用户id进行分组储存
				groupUserId: false,
			}
		}
	},
	// 全局异常码，可以自定义提示结果
	globalErrorCode: {
		// 阿里云10秒非正常超时，其实请求还在执行（且一般已经成功了，但前端接受不到成功结果）
		"cloudfunction-unusual-timeout": "请求超时，但请求还在执行，请重新进入页面。",
		// 请求超时（真正的请求超时）
		"cloudfunction-timeout": "请求超时，请重试！",
		// 不在预期内的异常（如数据库异常、云函数编译异常等）
		"cloudfunction-system-error": "网络开小差了！"
	},
	// 自定义拦截器
	interceptor: {

		// login:function(obj){
		// 	let { vk, params, res } = obj;
		// 	//console.log("params:",params);
		// 	//console.log("res:",res);
		// 	if(!params.noAlert){
		// 		vk.alert(res.msg);
		// 	}
		// 	console.log("跳自己的登录页面");
		// 	// 上方代码可自己修改，写成你自己的逻辑处理。
		// },

		// fail:function(obj){
		// 	let { vk, params, res } = obj;
		// 	//console.log("params:",params);
		// 	//console.log("res:",res);
		// 	return false;// 返回false则取消框架内置fail的逻辑,返回true则会继续执行框架内置fail的逻辑
		// 	// 上方代码可自己修改，写成你自己的逻辑处理。
		// }

	}
}
