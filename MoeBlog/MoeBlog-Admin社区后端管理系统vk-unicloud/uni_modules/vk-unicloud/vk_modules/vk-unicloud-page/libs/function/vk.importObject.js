/**
 * 导出云对象实例
 * @param {String} name 云对象路径，如：client/pub
 * @param {Object} importObjectOptions - 导入云对象的选项
 * @param {boolean} importObjectOptions.easy - 是否采用简单模式（默认为false）
 * @param {Object|function} importObjectOptions.data - 默认请求参数，可以是对象或函数
 * @returns {Proxy} - 云对象实例的代理对象
 * @example const pubObject = uni.vk.importObject('client/pub'); // 导入云对象
 * 注意，只能在声明 async 的函数内使用，如：
async test(){
	let res = await pubObject.getList({
		title: "请求中",
		data: {
			a: 1,
			b: "2"
		}
	});
}
 */
let importObject = function(name, importObjectOptions = {}) {
	const newObj = new Proxy(importObject, {
		get: function(target, key, receiver) {
			/**
			 * 导出云对象内的某个方法
			 * @param {Object}   data      请求参数，如 { a:1, b:"2" } 云对象内可通过 let { a, b } = data; 获取参数
			 * @param {String}   title     遮罩层提示语，为空或不传则代表不显示遮罩层。
			 * @param {Boolean}  needAlert 为true代表请求错误时，会有弹窗提示。默认为true
			 * @param {Object}   loading   与title二选一，格式为 { name: "loading", that: that }  name是变量名，that是数据源，当发起请求时，自动that[name] = true; 请求结束后，自动that[name] = false;
			 */
			return async function(options = {}) {
				// 如果importObjectOptions中指定了easy为true，代表options的值就是请求参数
				if (importObjectOptions.easy) {
					options = {
						data: options
					}
				}
				// 如果importObjectOptions中指定了data，代表有默认请求参数，需要加到请求参数中
				if (importObjectOptions.data) {
					if (typeof importObjectOptions.data === "function") {
						options.data = Object.assign({}, importObjectOptions.data(), options.data)
					} else {
						options.data = Object.assign({}, importObjectOptions.data, options.data)
					}
				}
				return uni.vk.callFunction({
					...importObjectOptions,
					...options,
					url: `${name}.${key}`
				});
			}
		},
		// set: function(target, key, value, receiver) {
		// 	console.log("set");
		// 	console.log("target",target);
		// 	console.log("key",key);
		// 	console.log("value",value);
		// 	console.log("receiver", receiver);
		// },
	});
	return newObj;
};

export default importObject;