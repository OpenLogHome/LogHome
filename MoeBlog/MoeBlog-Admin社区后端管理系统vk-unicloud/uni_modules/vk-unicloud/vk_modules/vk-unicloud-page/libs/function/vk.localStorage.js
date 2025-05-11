/**
 * vk依赖扩展 - localStorage 本地缓存
 * pub - 公共的可随时删除的缓存
 * kh - 跟登录账号有关联的缓存
 * sys - 系统级缓存 - 一般不删除
 * 
 * 储存缓存
 * vk.setStorageSync(key, data);
 * 获取缓存
 * vk.getStorageSync(key);
 */
const storage = {};
/**
 * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
 * @param {String} key 本地缓存中的指定的 key
 * @param {Any} data 需要存储的内容，只支持原生类型、及能够通过 JSON.stringify 序列化的对象
 */
storage.setStorageSync = function(key, data) {
	uni.setStorageSync(key, data);
	watchLocalStorage({ type: "set", key, data });
};

/**
 * 从本地缓存中异步获取指定 key 对应的内容。
 * @param {String} key 本地缓存中的指定的 key
 */
storage.getStorageSync = function(key) {
	let data = uni.getStorageSync(key);
	// get 没有必要监听
	// watchLocalStorage({ type:"get", key, data });
	return data;
};

/**
 * 同步获取当前 storage 的相关信息。
 */
storage.getStorageInfoSync = function() {
	let info = uni.getStorageInfoSync();
	let sizeInfo = calcSize(Number(info.currentSize), 1024, 3, ["KB", "MB", "GB"]);
	info.sizeInfo = sizeInfo;
	return info;
};

/**
 * 从本地缓存中同步移除指定 key。
 * @param {String} key 本地缓存中的指定的 key
 */
storage.removeStorageSync = function(key) {
	uni.removeStorageSync(key);
	watchLocalStorage({ type: "remove", key });
};
/**
 * 从本地缓存中异步移除指定 key。
 */
storage.removeStorage = function(obj) {
	uni.removeStorage({
		key: obj.key,
		success: (res) => {
			watchLocalStorage({ type: "remove", key: obj.key });
			if (obj.success) obj.success(res);
		},
		fail: obj.fail,
		complete: obj.complete
	});
};

/**
 * 同步清理本地数据缓存。若key有值,则清除键值为指定字符串开头的缓存
 * @param {String} key 本地缓存中的指定的 key
 * vk.clearStorageSync();
 */
storage.clearStorageSync = function(key) {
	if (key) {
		let { keys } = uni.getStorageInfoSync();
		if (keys) {
			keys.map((keyName) => {
				if (keyName.indexOf(key) == 0) {
					storage.removeStorage({
						key: keyName
					});
				}
			});
		}
	} else {
		uni.clearStorage();
		watchLocalStorage({ type: "clear" });
	}
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

function watchLocalStorage(obj) {
	if (typeof storage.watch === "function") {
		storage.watch(obj);
	}
}