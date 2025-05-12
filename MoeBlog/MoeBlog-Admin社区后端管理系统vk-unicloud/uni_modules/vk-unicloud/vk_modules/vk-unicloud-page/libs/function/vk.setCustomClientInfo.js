/**
 * setCustomClientInfo 设置自定义clientInfo字段
 * 调用示例
vk.setCustomClientInfo({
	a: 1,
	b: "2"
});
 */

function setCustomClientInfo(data) {
	if (Object.prototype.toString.call(data) !== "[object Object]") {
		console.warn("setCustomClientInfo(data)的参数data必须是一个对象");
		return;
	}
	uniCloud.setCustomClientInfo({
		customInfo: data
	});
}

export default setCustomClientInfo;