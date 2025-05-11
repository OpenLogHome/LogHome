/**
 * 扩展存储
 */
class CloudStorage {
	constructor() {
		this.counterNum = 0;
	}
	// 上传文件
	uploadFile(obj = {}) {
		let {
			filePath,
			fileType,
			suffix,
			index = 0,
			file = {},
			cloudPath,
			cloudPathRemoveChinese = true, // 删除文件名中的中文
			cloudDirectory,
			encrypt,
			runCloud,
		} = obj;
		let vk = uni.vk;
		// 生成文件名
		if (!cloudPath) cloudPath = createFileName(obj);
		// 获取配置
		let cloudStorageConfig = getConfig();
		return new Promise((resolve, reject) => {
			vk.callFunction({
				url: cloudStorageConfig.authAction,
				debug: false,
				encrypt,
				uniCloud: runCloud,
				data: {
					cloudPath,
					provider: cloudStorageConfig.provider,
					domain: cloudStorageConfig.domain
				},
				success: (res) => {
					resolve(res);
				},
				fail: (res) => {
					reject(res);
				}
			});
		}).then((uploadFileOptionsRes) => {
			return new Promise((resolve, reject) => {
				let uploadTask = uni.uploadFile({
					...uploadFileOptionsRes.uploadFileOptions,
					filePath, // 本地文件路径
					success: (uploadFileRes) => {
						if (![200, 201].includes(uploadFileRes.statusCode)) {
							reject(uploadFileRes);
						} else {
							// 上传成功
							let extendInfo = {};
							try {
								if (cloudStorageConfig.provider === "qiniu") {
									extendInfo = JSON.parse(uploadFileRes.data);
									if (!isNaN(extendInfo.width)) extendInfo.width = Number(extendInfo.width);
									if (!isNaN(extendInfo.height)) extendInfo.height = Number(extendInfo.height);
									if (!isNaN(extendInfo.size)) extendInfo.size = Number(extendInfo.size);
								}
							} catch(err){
								console.error('err: ', err)
							}
							const { cloudPath, fileID, fileURL } = uploadFileOptionsRes;
							const res = {
								filePath, // 本地文件路径
								cloudPath, // 文件云端路径
								fileID, // 文件ID
								fileURL, // 云端文件URL
								url: fileURL, // 云端文件URL，与fileURL一致
								extendInfo,
							};
							resolve(res);
						}
					},
					fail: (res) => {
						reject(res);
					}
				});
				uploadTask.onProgressUpdate((res) => {
					if (res.progress > 0) {
						if (typeof obj.onUploadProgress === "function") obj.onUploadProgress({
							total: res.totalBytesExpectedToSend,
							loaded: res.totalBytesSent,
							progress: res.progress
						});
					}
				});
			});
		})
	}
}

export default new CloudStorage();

// 获取配置
function getConfig() {
	return uni.vk.getConfig("service.cloudStorage.extStorage");
}

// 生成文件名
function createFileName(obj = {}) {
	let {
		file,
		filePath,
		suffix,
		index = 0,
		cloudPathRemoveChinese = true,
		cloudDirectory
	} = obj;
	let vk = uni.vk;
	let cloudStorageConfig = getConfig();
	let dirname = cloudStorageConfig.dirname;
	let oldName = index + "." + suffix;
	if (file && file.name) {
		let suffixName = file.name.substring(file.name.lastIndexOf(".") + 1);
		if (suffixName && suffixName.length < 5) oldName = file.name;
		// 只保留["数字","英文",".","-"]
		if (cloudPathRemoveChinese) {
			oldName = oldName.replace(/[^a-zA-Z.-d]/g, '');
		}
		if (oldName.indexOf(".") == 0) oldName = "0" + oldName;
	}
	let date = new Date();
	let dateYYYYMMDD = vk.pubfn.timeFormat(date, "yyyy/MM/dd");
	let dateTime = date.getTime().toString(); // 时间戳
	// 时间戳后8位
	let dateTimeEnd8 = dateTime.substring(dateTime.length - 8, dateTime.length);
	let randomNumber = vk.pubfn.random(8); // 8位随机数
	// 文件路径 = 固定路径名 + 业务路径

	// 业务路径
	let servicePath = "";
	if (cloudDirectory) {
		// 如果自定义了上传目录，则使用自定义的上传目录
		if (cloudDirectory.lastIndexOf("/") !== cloudDirectory.length - 1) {
			cloudDirectory = cloudDirectory + "/";
		}
		servicePath = cloudDirectory;
	} else {
		// 否则，使用年月日作为上传目录
		servicePath = dateYYYYMMDD + "/";
		try {
			// 只有开启按userId分组且开启了vk的vuex功能，才可以自动按userId分组
			if (cloudStorageConfig.groupUserId && typeof vk.getVuex === "function") {
				let userInfo = vk.getVuex("$user.userInfo");
				if (vk.pubfn.isNotNull(userInfo) && userInfo._id) {
					servicePath = `${userInfo._id}/${servicePath}`;
				}
			}
		} catch (err) {}
	}
	// 文件名 = 时间戳后8位 - 随机数8位 + 后缀名
	let fileName = dateTimeEnd8 + randomNumber + "-" + oldName;
	// 文件相对路径 = 业务目录 + 文件名
	let fileRelativePath = servicePath + fileName;
	// 文件名全称（包含文件路径） = 根目录 + 文件相对路径
	let cloudPath = dirname + "/" + fileRelativePath;
	return cloudPath;
}