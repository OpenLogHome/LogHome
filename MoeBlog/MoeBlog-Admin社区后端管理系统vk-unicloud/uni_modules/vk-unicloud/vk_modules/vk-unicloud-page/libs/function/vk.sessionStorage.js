/**
 * vk依赖扩展 - sessionStorage 本地会话缓存（仅H5可用）
 * sessionStorage 属性允许你访问一个，对应当前源的 session Storage 对象。
 * 它与 localStorage 相似，不同之处在于 localStorage 里面存储的数据没有过期时间设置
 * 而存储在 sessionStorage 里面的数据在页面会话结束时会被清除。
 * pub - 公共的可随时删除的缓存
 * kh - 跟登录账号有关联的缓存
 * sys - 系统级缓存 - 一般不删除
 *
 * 储存缓存
 * vk.setSessionStorageSync(key, data);
 * 获取缓存
 * vk.getSessionStorageSync(key);
 */
const storage = {};
/**
 * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
 * @param {String} key 本地缓存中的指定的 key
 * @param {Any} data 需要存储的内容，只支持原生类型、及能够通过 JSON.stringify 序列化的对象
 * vk.setSessionStorageSync(key, data);
 */
storage.setSessionStorageSync = function(key, data = "") {
	// #ifdef H5
	let type = typeof data;
	let value = {
		type: typeof data,
		data: data
	};
	sessionStorage.setItem(key, JSON.stringify(value));
	watchSessionStorage({ type: "set", key, data });
	// #endif

	// #ifndef H5
	console.warn("非H5环境不支持此API");
	// #endif
};

/**
 * 从本地缓存中异步获取指定 key 对应的内容。
 * @param {String} key 本地缓存中的指定的 key
 * vk.getSessionStorageSync(key);
 */
storage.getSessionStorageSync = function(key) {
	// #ifdef H5
	let data;
	try {
		let value = JSON.parse(sessionStorage.getItem(key));
		data = value.data;
	} catch (err) {
		data = sessionStorage.getItem(key);
	}
	// get 没有必要监听
	// watchSessionStorage({ type:"get", key, data });
	return data;
	// #endif

	// #ifndef H5
	console.warn("非H5环境不支持此API");
	// #endif
};

/**
 * 从本地缓存中同步移除指定 key。
 * @param {String} key 本地缓存中的指定的 key
 * vk.removeSessionStorageSync(key);
 */
storage.removeSessionStorageSync = function(key) {
	// #ifdef H5
	sessionStorage.removeItem(key);
	watchSessionStorage({ type: "remove", key });
	// #endif

	// #ifndef H5
	console.warn("非H5环境不支持此API");
	// #endif
};

/**
 * 同步清理本地数据缓存。若key有值,则清除键值为指定字符串开头的缓存
 * @param {String} key 本地缓存中的指定的 key
 * vk.clearSessionStorageSync();
 */
storage.clearSessionStorageSync = function(key) {
	// #ifdef H5
	if (key) {
		let keys = Object.keys(sessionStorage);
		if (keys) {
			keys.map((keyName) => {
				if (keyName.indexOf(key) == 0) {
					sessionStorage.removeItem(keyName);
				}
			});
		}
	} else {
		sessionStorage.clear();
		watchSessionStorage({ type: "clear" });
	}
	// #endif

	// #ifndef H5
	console.warn("非H5环境不支持此API");
	// #endif
};

export default storage;



/**
 * 单位进制换算
 * length	换算前大小
 * ary		进制,如KB-MB-GB,进制1024
 * precision	数值精度
 * arr		进制的数组,如["B","KB","MB","GB"]
 * calcSize(length,1024,3,["B","KB","MB","GB"]);
 */
function calcSize(length = 0, ary, precision, arr) {
	let size = parseFloat(length);
	let mySize = 0;
	let type = "";
	if (size < ary || arr.length <= 1) {
		type = arr[0];
		mySize = parseFloat(size.toFixed(precision));
	} else {
		for (let i = 1; i < arr.length; i++) {
			let g = arr[i];
			size = size / ary;
			if (size < ary) {
				type = g;
				mySize = parseFloat(size.toFixed(precision));
				break;
			}
		}
	}
	return {
		size: mySize,
		type: type,
		title: mySize + " " + type
	}
};

function watchSessionStorage(obj) {
	if (typeof storage.watch === "function") {
		storage.watch(obj);
	}
}
