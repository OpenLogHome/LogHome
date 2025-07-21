// 加载模块 - 中间件 请勿改动此文件-----------------------------------
const modulesPath = __dirname + "/modules";
const fs = require('fs');
const fileList = fs.readdirSync(modulesPath);
var moduleList = [];
var modulesNames = [];

fileList.map((file, index) => {
	if (file.indexOf(".js") > -1) {
		modulesNames.push(file.substring(0, file.length - 3));
	}
});

modulesNames.map((modulesName, index) => {
	try {
		let moduleItem = require(modulesPath + "/" + modulesName);
		moduleItem.map((item) => {
			item.modulesName = modulesName;
		});
		moduleList.push(moduleItem);
	} catch (err) {
		console.error(`【异常】努力加载中间件【${modulesName}】异常，请检查！↓↓↓请查看下方的错误提示↓↓↓`);
		console.error(err);
		console.error(`【异常】努力加载中间件【${modulesName}】异常，请检查！↑↑↑请查看上方的错误提示↑↑↑`);
	}
});

var middlewareList = [];
moduleList.map((moduleItem, index) => {
	middlewareList = middlewareList.concat(moduleItem);
});
module.exports = middlewareList;
// 加载模块 - 中间件 请勿改动此文件-----------------------------------