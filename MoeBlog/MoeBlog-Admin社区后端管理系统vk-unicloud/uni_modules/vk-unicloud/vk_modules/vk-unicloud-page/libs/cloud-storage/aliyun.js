/**
 * 阿里云oss
 */
class CloudStorage {
	constructor() {
		this.counterNum = 0;
	}

	uploadFile(obj = {}) {
		let {
			filePath,
			fileType,
			suffix,
			name = "file",
			header = {
				"x-oss-forbid-overwrite": true,
			},
			index = 0,
			file = {},
			cloudPathRemoveChinese = true, // 删除文件名中的中文
			cloudDirectory,
		} = obj;
		let vk = uni.vk;
		let fileNameObj = createFileName(obj);
		let cloudStorageConfig = getConfig();
		let fileName = fileNameObj.fileFullName;
		let formData = vk.pubfn.copyObject(cloudStorageConfig.uploadData);
		formData["key"] = fileName; // 存储在oss的文件路径
		/**
		 * 特别说明
		 * 若已知本地图片,则使用formData["name"] = filePath
		 * 若已知base64,则是用formData["file"] = file;// file base64字符串转成blob对象
		 */
		if (filePath.indexOf(";base64,") > -1) {
			formData["file"] = dataURLtoBlob(filePath);
		} else {
			formData["name"] = filePath;
		}
		return new Promise((resolve, reject) => {
			let uploadTask = uni.uploadFile({
				url: cloudStorageConfig.action,
				filePath,
				name,
				header,
				formData: formData,
				success: (res) => {
					if (![200, 201].includes(res.statusCode)) {
						reject(res);
					} else {
						// 上传成功
						let fileURL = fileNameObj.url;
						res = {
							filePath, // 本地文件路径
							cloudPath: getCloudPath(fileURL), // 云端文件路径
							fileID: fileURL, // 云端文件ID
							fileURL: fileURL, // 云端文件URL
							url: fileURL, // 云端文件URL，与fileURL一致
						};
						resolve(res);
					}
				},
				fail: (err) => {
					reject(err);
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
	}
}

export default new CloudStorage();

// 获取配置
function getConfig() {
	let vk = uni.vk;
	let cloudStorageConfig = vk.getConfig("service.cloudStorage.aliyun") || vk.getConfig("service.cloudStorageConfig");
	let configData = {};
	if (cloudStorageConfig && cloudStorageConfig.uploadData && cloudStorageConfig.uploadData.OSSAccessKeyId) {
		try {
			// 只有开启按userId分组且开启了vk的vuex功能，才可以自动按userId分组
			if (cloudStorageConfig.groupUserId && typeof vk.getVuex === "function") {
				let userInfo = vk.getVuex("$user.userInfo");
				if (vk.pubfn.isNotNull(userInfo) && userInfo._id) {
					cloudStorageConfig.dirname += `/${userInfo._id}`;
				}
			}
		} catch (err) {}
		configData = {
			uploadData: {
				OSSAccessKeyId: cloudStorageConfig.uploadData.OSSAccessKeyId,
				policy: cloudStorageConfig.uploadData.policy,
				signature: cloudStorageConfig.uploadData.signature,
				success_action_status: 200,
				key: "test.png"
			},
			action: cloudStorageConfig.action,
			dirname: cloudStorageConfig.dirname,
			host: cloudStorageConfig.host,
		};
	}
	return configData;
}

// 生成文件名
function createFileName(obj = {}) {
	let {
		filePath,
		fileType,
		suffix,
		index = 0,
		file = {},
		cloudPath,
		cloudPathRemoveChinese = true, // 删除文件名中的中文
		cloudDirectory,
	} = obj;
	let vk = uni.vk;
	let cloudStorageConfig = getConfig();
	let dirname = cloudStorageConfig.dirname;
	let host = cloudStorageConfig.host;
	let fileObj = {};

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
	}
	// 文件名 = 时间戳后8位 - 随机数8位 + 后缀名
	let fileNickName = dateTimeEnd8 + randomNumber + "-" + oldName;
	// 文件相对路径 = 业务目录 + 文件名
	let fileRelativePath = servicePath + fileNickName;
	if (cloudPath) {
		fileRelativePath = cloudPath;
	}
	// 文件名全称（包含文件路径） = 根目录 + 文件相对路径
	let fileFullName = dirname + "/" + fileRelativePath;
	// 外网地址 = 外网域名 + 文件名全称
	let url = host + "/" + fileFullName;
	fileObj.url = url;
	fileObj.fileFullName = fileFullName;
	fileObj.fileNickName = fileNickName;
	return fileObj;
}

function dataURLtoBlob(dataurl) {
	let arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}

function getCloudPath(url) {
	let cloudPath = "";
	const match = url.match(/(?:https?:\/\/)?([^/]+)(\/.*)/);
	if (match && match[2]) {
		const extractedPath = match[2];
		if (extractedPath.indexOf("//") === 0) {
			cloudPath = extractedPath.substring(2);
		} else {
			cloudPath = extractedPath.substring(1);
		}
	}
	return cloudPath;
}