/**
 * 函数 - 弹窗
 */
const localeObj = {
	title: {
		"zh-Hans": "提示",
		"zh-Hant": "提示",
		"en": "Tips"
	},
	confirmText: {
		"zh-Hans": "确定",
		"zh-Hant": "確定",
		"en": "OK"
	},
	cancelText: {
		"zh-Hans": "取消",
		"zh-Hant": "取消",
		"en": "Cancel"
	},
	placeholderText: {
		"zh-Hans": "请输入",
		"zh-Hant": "請輸入",
		"en": "Please enter"
	}
};

let loadingCounterObj = {};

function getLocale() {
	let vk = uni.vk;
	let locale = vk.getLocale();
	if (["zh-Hans", "zh-Hant", "en"].indexOf(locale) === -1) {
		locale = "en";
	}
	return locale;
}
export default {
	/**
	vk.alert("内容");
	vk.alert("内容", "提示", "好的", () => {

	});
	 */
	alert: function(a = " ", b, c, d) {
		let vk = uni.vk;
		let locale = getLocale();
		let obj = {
			title: localeObj.title[locale],
			confirmText: localeObj.confirmText[locale],
			placeholderText: localeObj.placeholderText[locale],
			content: a,
			showCancel: false,
			fail: (err) => {
				console.error('alert-err: ', err);
			}
		};
		if (typeof d === 'function') {
			obj.title = b;
			obj.confirmText = c;
			obj.success = d;
		} else if (typeof c === 'function') {
			obj.title = b;
			obj.success = c;
		} else if (typeof b === 'function') {
			obj.success = b;
		} else if (b != undefined) {
			obj.title = b;
			if (c != undefined) {
				obj.confirmText = c;
			}
		}
		if (typeof obj.content === 'number') {
			obj.content = obj.content + "";
		} else if (typeof obj.content === 'object') {
			obj.content = JSON.stringify(obj.content);
		}
		if (obj.confirmText && obj.confirmText.length > 4) {
			obj.confirmText = obj.confirmText.substring(0, 4); // 对齐微信小程序按钮最多4个字
		}
		return uni.showModal(obj);
	},
	/**
	vk.confirm("内容","提示","确定","取消",(res) => {
		if(res.confirm){

		}
	});
	 */
	confirm: function(a, b, c, d, e) {
		let vk = uni.vk;
		let locale = getLocale();
		let obj = {
			showCancel: true,
			// #ifndef MP-ALIPAY
			cancelColor: "#999999",
			// #endif
			title: localeObj.title[locale],
			confirmText: localeObj.confirmText[locale],
			cancelText: localeObj.cancelText[locale],
			placeholderText: localeObj.placeholderText[locale],
		};
		if (typeof a === "object") {
			obj = a;
		} else {
			if (typeof a === "string") {
				obj.content = a;
			}
			if (typeof e === 'function') {
				obj.title = b;
				obj.confirmText = c;
				obj.cancelText = d;
				obj.success = e;
			} else if (typeof d === 'function') {
				obj.title = b;
				obj.confirmText = c;
				obj.success = d;
			} else if (typeof c === 'function') {
				obj.title = b;
				obj.success = c;
			} else if (typeof b === 'function') {
				obj.success = b;
			} else if (b != undefined) {
				obj.title = b;
				if (c != undefined) {
					obj.confirmText = c;
				}
			}
		}
		if (obj.confirmText && obj.confirmText.length > 4) {
			obj.confirmText = obj.confirmText.substring(0, 4); // 对齐微信小程序按钮最多4个字
		}
		if (obj.cancelText && obj.cancelText.length > 4) {
			obj.cancelText = obj.cancelText.substring(0, 4); // 对齐微信小程序按钮最多4个字
		}
		return uni.showModal(obj);
	},
	/**
	vk.prompt("请输入", "提示", "确定", "取消", (res) => {
		if (res.confirm) {
			console.log(res.content);
		}
	}, "输入框内初始内容");
	 */
	prompt: function(a, b, c, d, e, f) {
		let vk = uni.vk;
		let locale = getLocale();
		let obj = {
			showCancel: true,
			editable: true,
			cancelColor: "#999999",
			title: localeObj.title[locale],
			confirmText: localeObj.confirmText[locale],
			cancelText: localeObj.cancelText[locale],
			placeholderText: localeObj.placeholderText[locale],
		};
		if (typeof a === "object") {
			obj = a;
		} else {
			if (typeof a === "string") {
				obj.placeholderText = a;
			}
			if (typeof e === 'function') {
				obj.title = b;
				obj.confirmText = c;
				obj.cancelText = d;
				obj.success = e;
				obj.content = f;
			} else if (typeof d === 'function') {
				obj.title = b;
				obj.confirmText = c;
				obj.success = d;
				obj.content = e;
			} else if (typeof c === 'function') {
				obj.title = b;
				obj.success = c;
				obj.content = d;
			} else if (typeof b === 'function') {
				obj.success = b;
				obj.content = c;
			}
		}
		if (obj.confirmText && obj.confirmText.length > 4) {
			obj.confirmText = obj.confirmText.substring(0, 4); // 对齐微信小程序按钮最多4个字
		}
		if (obj.cancelText && obj.cancelText.length > 4) {
			obj.cancelText = obj.cancelText.substring(0, 4); // 对齐微信小程序按钮最多4个字
		}
		// #ifndef MP-ALIPAY
		if (!obj.content) {
			obj.content = "";
		}
		return uni.showModal(obj);
		// #endif
		// #ifdef MP-ALIPAY
		return uni.prompt({
			title: obj.title,
			placeholder: obj.placeholderText,
			okButtonText: obj.confirmText,
			cancelButtonText: obj.cancelText,
			inputValue: obj.content,
			cancelColor: obj.cancelColor,
			confirmColor: obj.confirmColor,
			success: (res) => {
				let confirm = res.ok;
				let data = {
					confirm,
					cancel: !confirm,
				};
				if (confirm) {
					data.content = res.inputValue;
				}
				obj.success(data);
			},
			fail: obj.fail,
			complete: obj.complete,
		});
		// #endif

	},
	/**
	vk.toast("提示内容","none");
	 */
	toast: function(a, b, c, d, e) {
		let vk = uni.vk;
		if (typeof a === 'number') {
			a = a.toString();
		} else if (typeof a === 'object') {
			a = JSON.stringify(a);
		}
		let title = a;
		let icon = "none";
		let image = "";
		let mask = false;
		let duration = 1500;
		let fn;

		if (typeof e !== "undefined") {
			if (typeof e == "function") fn = e;
			if (typeof e == "number") duration = e;
			if (typeof e == "boolean") mask = e;
		}
		if (typeof d !== "undefined") {
			if (typeof d == "function") fn = d;
			if (typeof d == "number") duration = d;
			if (typeof d == "boolean") mask = d;
		}
		if (typeof c !== "undefined") {
			if (typeof c == "function") fn = c;
			if (typeof c == "number") duration = c;
			if (typeof c == "boolean") mask = c;
		}

		if (typeof b !== "undefined") {
			if (typeof b == "function") fn = b;
			if (typeof b == "number") duration = b;
			if (typeof b == "boolean") mask = b;
			if (typeof b == 'string') {
				if (b == "ok") b = "success";
				if (b == "success" || b == "loading" || b == "none" || b == "error") {
					icon = b;
				} else {
					image = b;
				}
			}
		}
		return uni.showToast({
			title: title,
			icon: icon,
			// #ifndef MP-ALIPAY
			image: image,
			mask: mask,
			// #endif
			duration: duration,
			success: function(res) {
				if (typeof fn === 'function') {
					setTimeout(function() {
						fn(res);
					}, duration);
				}
			}
		});
	},
	/**
	 * 操作菜单
	 let sheetList = ['位置', '@好友'];
	 vk.showActionSheet({
	 	title: '',
	 	list: sheetList,
	 	color: '#000000',
	 	success: res => {
	 		if (sheetList[res.index] == '位置') {

	 		} else if (sheetList[res.index] == '@好友') {

	 		}
	 	}
	 });
	 */
	showActionSheet: function(object) {
		let vk = uni.vk;
		let title = object.title;
		let list = object.list;
		let color = object.color || "#000000";
		let success = object.success;
		let fail = object.fail;
		let complete = object.complete;
		return uni.showActionSheet({
			itemList: list,
			// #ifndef MP-ALIPAY
			itemColor: color,
			// #endif
			success: function(res) {
				let index = res.tapIndex;
				let text = list[index];
				let g = { index, text };
				//console.log(g);
				if (typeof success == "function") success(g);
			},
			fail: function(res) {
				//console.log(res);
				if (typeof fail == "function") fail(res);
			},
			complete: function(res) {
				if (typeof complete == "function") complete(res);
			}
		});
	},
	showLoading: function(obj = {}, name) {
		if (typeof obj == "string") {
			let title = obj;
			obj = {
				title: title,
				mask: true
			};
		}
		if (obj && typeof obj.mask === "undefined") {
			obj.mask = true;
		}
		uni.showLoading(obj);
		if (name) {
			if (typeof loadingCounterObj[name] !== "number") loadingCounterObj[name] = 0;
			loadingCounterObj[name]++;
		}
	},
	hideLoading: function(name) {
		if (name && loadingCounterObj[name] > 0) {
			loadingCounterObj[name]--;
			if (loadingCounterObj[name] <= 0) {
				loadingCounterObj[name] = 0;
				uni.hideLoading();
			}
		} else {
			uni.hideLoading();
		}
	},
	// 设置当前页面的loading变量的值
	setLoading: function(loading = true, obj = true) {
		try {
			let vk = uni.vk;
			if (typeof obj === "boolean") {
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				let that = page.$vm;
				let name = "loading";
				updateCustomLoading({ loading, name, that });
				return { that, name };
			} else if (typeof obj === "object") {
				let { data, name, that } = obj;
				if (!data) data = that;
				updateCustomLoading({ loading, name, that: data });
				return { that, name };
			} else if (typeof obj === "string") {
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				let that = page.$vm;
				let name = obj;
				updateCustomLoading({ loading, name, that });
				return { that, name };
			}
		} catch (err) {}
	},
}

function updateCustomLoading(obj = {}) {
	let vk = uni.vk;
	let {
		loading,
		name,
		that
	} = obj;
	const keyName = "___loadingCounterObj";
	if (!that[keyName]) that[keyName] = {};
	if (typeof that[keyName][name] !== "number") that[keyName][name] = 0;
	if (loading) {
		that[keyName][name]++;
		vk.pubfn.setData(that, name, loading);
	} else {
		that[keyName][name]--;
		if (that[keyName][name] <= 0) {
			that[keyName][name] = 0;
			vk.pubfn.setData(that, name, loading);
		}
	}
}
