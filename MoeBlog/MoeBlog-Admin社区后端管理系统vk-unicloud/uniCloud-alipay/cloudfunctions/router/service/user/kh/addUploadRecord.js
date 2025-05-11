module.exports = {
	/**
	 * 添加文件上传记录
	 * @url user/kh/addUploadRecord 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} url					文件外网访问url
	 * @param {String} name 				文件名
	 * @param {Number} size					文件大小
	 * @param {String} file_id			文件id
	 * @param {String} provider			供应商
	 * @param {String} category_id	分类ID
	 * @param {Number} width				图片\视频的宽度
	 * @param {Number} height				图片\视频的高度
	 * @param {Number} orientation	图片\视频的旋转方向
	 * @param {Number} duration			视频的总时长
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			url,
			name: original_name,
			size,
			provider,
			file_id,
			category_id,
			width,
			height,
			orientation,
			duration
		} = data;
		let type = "other";

		if (vk.pubfn.test(url, "image")) {
			type = "image";
		} else if (vk.pubfn.test(url, "video")) {
			type = "video";
		} else if (vk.pubfn.test(url, "audio")) {
			type = "video"; // 这里audio也分类为video
		}

		if (vk.pubfn.isNull(original_name)) original_name = url;
		let dataJson = {
			user_id: uid,
			sort: 0,
			status: 0,
			type,
			url,
			display_name: original_name,
			original_name,
			size,
			file_id,
			provider,
			width,
			height,
			orientation,
			duration
		};
		if (vk.pubfn.isNotNull(category_id)) {
			dataJson["category_id"] = category_id;
		}
		await vk.baseDao.add({
			dbName: "vk-files",
			dataJson
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}