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

			runCloud,
			cloudPathAsRealPath = true,
		} = obj;
		let vk = uni.vk;
		// 生成文件名
		if (!cloudPath) cloudPath = createFileName(obj);
		return new Promise((resolve, reject) => {
			// 上传
			runCloud.uploadFile({
				filePath,
				cloudPath,
				fileType,
				cloudPathAsRealPath,
				onUploadProgress: (progressEvent) => {
					let percentCompleted = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					if (typeof obj.onUploadProgress == "function") {
						obj.onUploadProgress({
							total: progressEvent.total,
							loaded: progressEvent.loaded,
							progress: percentCompleted
						});
					}
				},
				success: (res) => {
					resolve(res);
				},
				fail: (err) => {
					reject(err);
				}
			});
		})
		.then((res) => {
			return new Promise((resolve, reject) => {
				// 获取临时URL，公共读的临时URL是永久的
				uniCloud.getTempFileURL({
					fileList: [res.fileID],
					success: (data) => {
						let { fileID, tempFileURL } = data.fileList[0];
						res = {
							filePath, // 本地文件路径
							cloudPath: getCloudPath(tempFileURL), // 云端文件路径
							fileID, // 云端文件ID
							fileURL: tempFileURL, // 云端文件URL
							url: tempFileURL, // 云端文件URL，与fileURL一致
						}
						resolve(res);
					},
					fail: (err) => {
						reject(err);
					}
				});
			});
		})
	}
}

export default new CloudStorage();

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
	let oldName = index + "." + suffix;
	// 注意：小程序无法获取到 file.name
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
	// 目录名
	let newFilePath = "";
	if (cloudDirectory) {
		// 如果自定义了上传目录，则使用自定义的上传目录
		if (cloudDirectory.lastIndexOf("/") !== cloudDirectory.length - 1) {
			cloudDirectory = cloudDirectory + "/";
		}
		newFilePath = cloudDirectory;
	} else {
		// 否则，使用年月日作为上传目录
		newFilePath = dateYYYYMMDD + "/";
	}
	// 文件名  = 时间戳后8位  - 随机数8位  + 原本文件名
	let fileName = dateTimeEnd8 + "-" + randomNumber + "-" + oldName;
	// 文件云端路径 = 目录名  + 文件名
	let cloudPath = newFilePath + fileName;
	return cloudPath;
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