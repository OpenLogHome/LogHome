const debug = process.env.NODE_ENV !== 'production';
//const debug = true; // 强制debug，vk发布演示站时使用
var devPages;
try {
	// 只在开发环境中才会被HBX打包的页面
	devPages = require('./pages-dev.json');
} catch (err) {}
module.exports = function(pagesJson) {
	try {
		let newDevPages = JSON.parse(JSON.stringify(devPages));
		if (debug && newDevPages) {
			for (let keyName in newDevPages) {
				let item = newDevPages[keyName]
				if (Object.prototype.toString.call(item) === "[object Array]") {
					pagesJson[keyName].push(...item);
				} else if (Object.prototype.toString.call(item) === '[object Object]') {
					pagesJson[keyName] = Object.assign(pagesJson[keyName], item);
				}
			}
			// 检查所有pagesJson.subPackages内的root的值，将其去重
			let subPackages = [];
			pagesJson.subPackages.forEach((pages) => {
				let findIndex = subPackages.findIndex((findItem) => {
					return findItem.root === pages.root;
				});
				if (findIndex === -1) {
					subPackages.push(pages);
				} else {
					subPackages[findIndex] = pages;
				}
			});
			pagesJson.subPackages = subPackages;
		}
	} catch (err) {
		console.log(err);
	}
	return pagesJson;
}
