'use strict';
module.exports = {
	/**
	 * 获取扩展存储上传参数
	 * @url user/pub/getUploadFileOptionsForExtStorage 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------

		let {
			cloudPath, // 文件路径
			domain, // 域名
			provider = "qiniu",
		} = data;
		if (!cloudPath) {
			return { code: -1, msg: "cloudPath不能为空" };
		}
		// 可以在此先判断下此路径是否允许上传等逻辑
		if (cloudPath.indexOf("public/") !== 0) {
			return { code: -1, msg: "仅能上传到public目录" };
		}
		if (typeof uniCloud.getExtStorageManager === "undefined") {
			return { code: -1, msg: "请右键云函数-管理依赖-添加扩展库uni-cloud-ext-storage（需要HBX版本>=3.99）添加后需重启项目" };
		}
		// 然后获取 extStorageManager 对象实例
		const extStorageManager = uniCloud.getExtStorageManager({
			provider,
			domain,
		});
		// 最后调用 extStorageManager.getUploadFileOptions
		let uploadFileOptionsRes = extStorageManager.getUploadFileOptions({
			cloudPath,
			allowUpdate: false, // 是否允许覆盖更新，如果返回前端，建议设置false，代表仅新增，不可覆盖
		});
		// 业务逻辑结束-----------------------------------------------------------
		return {
			...uploadFileOptionsRes,
			code: 0
		};
	}
}