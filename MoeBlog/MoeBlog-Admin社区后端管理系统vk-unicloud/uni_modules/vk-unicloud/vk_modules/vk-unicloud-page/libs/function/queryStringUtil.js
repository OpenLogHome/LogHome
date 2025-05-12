/**
 * 对象转url参数
 * @param {*} data,对象
 */
function jsonToQueryString(data = {}, arrayFormat = 'brackets') {
	let newData = JSON.parse(JSON.stringify(data));
	let _result = []
	if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets';
	for (let key in newData) {
		let value = newData[key]
		// 去掉为空的参数
		if (['', undefined, null].indexOf(value) >= 0) {
			continue;
		}
		// 如果值为数组，另行处理
		if (value.constructor === Array) {
			// e.g. {ids: [1, 2, 3]}
			switch (arrayFormat) {
				case 'indices':
					// 结果: ids[0]=1&ids[1]=2&ids[2]=3
					for (let i = 0; i < value.length; i++) {
						_result.push(key + '[' + i + ']=' + value[i])
					}
					break;
				case 'brackets':
					// 结果: ids[]=1&ids[]=2&ids[]=3
					value.forEach(_value => {
						_result.push(key + '[]=' + _value)
					})
					break;
				case 'repeat':
					// 结果: ids=1&ids=2&ids=3
					value.forEach(_value => {
						_result.push(key + '=' + _value)
					})
					break;
				case 'comma':
					// 结果: ids=1,2,3
					let commaStr = "";
					value.forEach(_value => {
						commaStr += (commaStr ? "," : "") + _value;
					})
					_result.push(key + '=' + commaStr)
					break;
				default:
					value.forEach(_value => {
						_result.push(key + '[]=' + _value)
					})
			}
		} else {
			_result.push(key + '=' + value)
		}
	}
	return _result.length ? _result.join('&') : ''
}

/**
 * URL参数转JSON对象
 * @param {string} query, URL查询字符串
 * @param {string} arrayFormat, 数组格式模式
 * @returns {Object}
 */
function queryStringToJson(query = '', arrayFormat = 'brackets') {

	let json = {};
	let params = query.replace(/^\?/, '').split('&'); // 移除可能的?并按&分割

	params.forEach(param => {
		let [key, value] = param.split('=');
		value = decodeURIComponent(value); // 解码URL编码的值

		// 处理数组格式
		if (key.match(/\[\]$/) || key.match(/\[\d+\]$/)) {
			// 处理brackets和indices模式
			let arrayKey;
			if (arrayFormat === "brackets") {
				arrayKey = key.replace(/\[]$/, '');
			} else if (arrayFormat === "indices") {
				arrayKey = key.replace(/\[\d+\]$/, '');
			}
			if (!json[arrayKey]) json[arrayKey] = [];
			if (arrayFormat === 'indices') {
				let index = key.match(/\[(\d+)\]/)[1];
				json[arrayKey][index] = value;
			} else {
				json[arrayKey].push(value);
			}
		} else {
			// 对于repeat和comma模式，我们需要特殊处理
			if (!json[key]) {
				json[key] = arrayFormat === 'comma' ? [] : value;
			}

			if (arrayFormat === 'comma') {
				// 如果值包含逗号，将其分割为数组
				if (value.includes(',')) {
					json[key] = value.split(',').map(item => decodeURIComponent(item));
				} else {
					json[key] = value;
				}
			} else if (arrayFormat === 'repeat' && json[key] !== value) {
				if (!Array.isArray(json[key])) {
					json[key] = [json[key]];
				}
				json[key].push(value);
			}
		}
	});

	// 对于repeat模式，我们需要将重复的键转换为数组
	if (arrayFormat === 'repeat') {
		for (let key in json) {
			if (json[key].constructor === Array && json[key].length === 1) {
				json[key] = json[key][0];
			}
		}
	}

	return json;
}

export default {
	jsonToQueryString,
	queryStringToJson
};