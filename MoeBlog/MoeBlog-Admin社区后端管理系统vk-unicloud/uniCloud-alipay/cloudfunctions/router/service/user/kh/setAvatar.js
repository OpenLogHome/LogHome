module.exports = {
	/**
	 * 设置头像
	 * @url user/kh/setAvatar 前端调用的url参数地址
	 * @description 设置当前登录用户的头像
	 * data 请求参数 说明
	 * @param {String} avatar 用户头像URL
	 * @param {Boolean} deleteOldFile 是否同时删除云储存内的头像文件
	 * @param {String} provider 头像文件所在的云存储供应商 默认是unicloud内置存储
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始----------------------------------------------------------- 
		let { avatar, deleteOldFile, provider = "unicloud" } = data;
		// 设置头像
		res = await uniID.setAvatar(event.data);
		// 判断是否需要删除旧头像的云储存文件
		if (res.code === 0 && deleteOldFile && userInfo.avatar) {
			try {
				await deleteFile({
					provider,
					url
				});
			} catch (err) {
				res.deleteFileErr = err;
			}
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}

async function deleteFile(data = {}) {
	let { provider = "unicloud", url } = data;
	// 提取域名
	let domain = getDomain(url);
	// 当前是通过指定的provider来判断，也可以在此根据domain判断
	if (provider === "extStorage") {
		if (typeof uniCloud.getExtStorageManager === "undefined") {
			return { code: -1, msg: "请右键云函数-管理依赖-添加扩展库uni-cloud-ext-storage（需要HBX版本>=3.99）添加后需重启项目" };
		}
		const extStorageManager = uniCloud.getExtStorageManager({
			provider: "qiniu", // 此处固定qiniu
			domain
		});
		await extStorageManager.deleteFile({
			fileList: [url],
		});
	} else if (provider === "unicloud") {
		await uniCloud.deleteFile({
			fileList: [url]
		});
	} else if (provider === "aliyun") {
		// 阿里云OSS删除文件暂未封装，可自己实现
	}
}

function getDomain(url) {
	// 使用正则表达式匹配域名部分
	const match = url.match(/^(?:https?:\/\/)?([^\/]+)\//);
	// 如果有匹配的结果
	if (match && match[1]) {
		// 返回匹配的域名部分
		return match[1];
	}
	// 如果没有匹配结果，返回空字符串或者可以根据需求进行其他处理
	return "";
}