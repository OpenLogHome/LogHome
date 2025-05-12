/**
 * WebSocket连接池
 */
const WebSocketPool = {
	connections: [],
	// 根据url获取连接
	getConnection(obj = {}) {
		let { url, channel } = obj;
		return this.connections.find(item => item.url === url && item.channel === channel);
	},
	// 预添加连接
	preAddConnection(obj = {}) {
		let { url, channel } = obj;
		let resolveFun;
		let rejectFun;
		const awaitConnect = new Promise((resolve, reject) => {
			resolveFun = resolve;
			rejectFun = reject;
		});
		this.connections.push({
			url,
			channel,
			awaitConnect,
			resolve: resolveFun,
			reject: rejectFun
		});
	},
	// 添加连接
	addConnection(connection = {}) {
		// 移除预添加的连接
		const index = this.connections.findIndex(item => item.url === connection.url && item.channel === connection.channel);
		// 添加连接
		this.connections.push(connection);
		if (index > -1) {
			const { resolve } = this.connections[index];
			resolve(connection);
			this.connections.splice(index, 1);
		}
	},
	// 移除连接
	removeConnection(obj = {}) {
		let { url, channel } = obj;
		const index = this.connections.findIndex(item => item.url === url && item.channel === channel);
		if (index > -1) {
			this.connections.splice(index, 1);
		}
	}
		
};
/**
 * 连接 WebSocket 的函数
 */
async function connectWebSocket(obj = {}) {
	const vk = uni.vk;
	let {
		name,
		url,
		data,
		title,
		encrypt,
		channel = "default", // 渠道\频道，用于连接同一个云对象时，标识不同的 WebSocket 连接
		cache = true, // 如果传入cache为true，则相同的channel会缓存连接，避免重复创建
	} = obj;
	if (!name) {
		name = vk.getConfig("functionName");
	}
	if (!url) {
		throw new Error("请传入 WebSocket 的 url 参数");
	}
	if (cache) {
		// 判断是否已经存在连接
		let connection = WebSocketPool.getConnection({ url, channel });
		// 如果已经存在连接，则直接返回
		if (connection) {
			await connection.awaitConnect;
			connection = WebSocketPool.getConnection({ url, channel });
			return connection;
		}
		// 因为创建 WebSocket 连接是异步的，所以这里需要提前加入到连接池中，避免重复创建
		WebSocketPool.preAddConnection({ url, channel });
	}
	
	let webSocket;
	if (title) vk.showLoading(title);
	if (url.indexOf("wss://") === 0) {
		webSocket = uni.connectSocket({
			url,
			header: {
				"content-type": "application/json"
			},
			complete: () => {}
		});
		// 从url中获取?后面名为url的参数的值
		let urlObj = vk.pubfn.queryStringToJson(url.split("?")[1]);
		url = urlObj.url;
	} else {
		if (typeof uniCloud.connectWebSocket === "undefined") {
			if (title) vk.hideLoading();
			let errMsg = "当前环境不支持WebSocket";
			vk.toast(errMsg);
			throw new Error(errMsg + `（仅支付宝云支持）`);
		}
		webSocket = await uniCloud.connectWebSocket({
			name,
			query: {
				url
			}
		});
	}
	
	// 创建vkWebSocket实例对象
	const vkWebSocket = new WebSocketService({
		webSocket,
		url,
		data,
		title,
		encrypt,
		channel
	});
	
	if (cache) {
		// 添加到连接池
		WebSocketPool.addConnection(vkWebSocket);
	}
	
	return vkWebSocket;
}

class WebSocketService {
	constructor(obj = {}) {
		let {
			webSocket,
			url,
			data,
			title,
			encrypt,
			channel
		} = obj;
		this.webSocket = webSocket;
		this.url = url;
		this.data = data;
		this.encrypt = encrypt;
		this.channel = channel;
		this.cid = "";
		this.isLoading = title ? true : false;
		this.status = 0;
		this.awaitConnect = new Promise((resolve, reject) => {
			this.success = resolve;
		});
		this.encryptMode = "aes-256-ecb";
		this.callbackStack = {
			onOpen: [],
			onMessage: [],
			onClose: [],
			onError: [],
			onVkMessage: []
		};
		this.init();
	}
	// 初始化
	init() {
		const vk = uni.vk;
		this.webSocket.onOpen(() => {
			this.status = 1;
			this.send({
				data: {
					"vkWebSocket": {
						type: "connect",
						data: this.data
					}
				}
			});
		});

		this.webSocket.onMessage(event => {
			// 处理data
			let data = event.data;
			try {
				data = JSON.parse(data);
			} catch (err) {}
			// 判断是否需要解密
			if (data.encrypt) {
				// 简易版解密
				data = vk.crypto.aes.decrypt({
					mode: this.encryptMode,
					data: data.data,
					key: vk.crypto.md5(data.timeStamp)
				});
			}
			// 判断是否是vk框架发出的系统级错误消息
			if (data.vkWebSocket) {
				if (this.isLoading) {
					vk.hideLoading();
					this.isLoading = false;
				}
				if (data.vkWebSocket.type === "error") {
					let err = data.vkWebSocket.data;
					if ([1301, 1302, 30201, 30202, 30203, 30204].indexOf(err.code) > -1 && err.msg.indexOf("token") > -1) {
						// uniIdToken失效触发
						console.warn("【WebSocketInvalidToken】: ", err);
						this.emitEvent("onVkMessage", {
							type: "invalidToken",
							err
						});
						return;
					}
					if (err && err.stack) {
						// 云函数执行异常触发
						console.error("【WebSocketError】: ", err);
						console.error("【WebSocketStack】: ", err.stack);
					} else {
						// code非0触发
						console.warn("【WebSocketError】: ", err);
					}
					this.emitEvent("onVkMessage", {
						type: "error",
						err
					});
					return;
				} else if (data.vkWebSocket.type === "connect") {
					// 保存cid到本地缓存
					this.status = 2;
					this.success();
					this.cid = data.vkWebSocket.data.cid;
					this.emitEvent("onOpen", data.vkWebSocket.data);
					return;
				} else if (data.vkWebSocket.type === "forceLogout") {
					// 强制用户退出登录
					this.emitEvent("onVkMessage", {
						type: "forceLogout",
						data: data.vkWebSocket.data
					});
					return;
				}
			}
			// 正常的消息
			this.emitEvent("onMessage", data);
		});

		this.webSocket.onClose(event => {
			this.emitEvent("onClose", event);
			this.close();
		});

		this.webSocket.onError(event => {
			this.emitEvent("onError", event);
		});
	}

	// 监听连接建立事件
	onOpen(callback) {
		if (this.status === 2) {
			callback({
				cid: this.cid
			});
		} else {
			this.onEvent("onOpen", callback);
		}
	}

	// 监听消息事件
	onMessage(callback) {
		this.onEvent("onMessage", callback);
	}

	// 监听连接关闭事件
	onClose(callback) {
		this.onEvent("onClose", callback);
	}

	// 监听连接错误事件
	onError(callback) {
		this.onEvent("onError", callback);
	}

	// 监听vk框架事件
	onVkMessage(callback) {
		this.onEvent("onVkMessage", callback);
	}

	// 监听事件
	onEvent(name, callback) {
		this.callbackStack[name].push(callback);
	}

	// 触发事件
	emitEvent(name, data) {
		this.callbackStack[name].forEach(callback => {
			callback(data);
		});
	}

	// 关闭连接
	close(obj = {}) {
		// 从连接池中移除
		WebSocketPool.removeConnection(this);
		// 关闭 WebSocket 连接
		if (this.webSocket) {
			this.webSocket.close(obj);
		} 
		this.webSocket = null;
		this.url = null;
		this.data = null;
		this.encrypt = null;
		this.cid = null;
		this.isLoading = null;
		this.status = null;
		this.awaitConnect = null;
		this.encryptMode = null;
		// 清空回调
		for (let i in this.callbackStack) {
			this.callbackStack[i] = [];
		}
	}

	// 发送消息
	async send(obj = {}) {
		let {
			data
		} = obj;

		if (!this.status) {
			await this.awaitConnect;
		}

		const vk = uni.vk;
		const uniIdToken = vk.getToken();
		const sysInfo = uni.getSystemInfoSync();

		const clientInfo = {
			appid: sysInfo.appId,
			platform: sysInfo.uniPlatform,
			locale: sysInfo.language,
			os: sysInfo.osName,
			deviceId: sysInfo.deviceId,
			userAgent: sysInfo.ua
		};

		let clientData = {
			url: this.url,
			channel: this.channel,
			uniIdToken,
			clientInfo,
			data
		};
		let sendData = {
			data: clientData,
			deviceId: sysInfo.deviceId
		};
		let encrypt = this.encrypt;
		if (encrypt) {
			// 简易版加密
			clientData.timeStamp = Date.now();
			clientData = vk.crypto.aes.encrypt({
				mode: this.encryptMode,
				data: clientData,
				key: vk.crypto.md5(sysInfo.deviceId)
			});
			sendData.encrypt = true;
		}

		sendData.deviceId = sysInfo.deviceId;
		sendData.data = clientData;
		return this.webSocket.send({
			...obj,
			data: JSON.stringify(sendData)
		});
	}

}
export default connectWebSocket;