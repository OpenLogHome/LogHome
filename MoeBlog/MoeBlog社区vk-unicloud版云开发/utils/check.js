export function getCheck(datas) {
	return new Promise((resolve, reject) => {
		let data = {
			isT: false,
			msg: ""
		}
		// #ifdef H5
		data.isT=true
		resolve(data)
		return
		// #endif
		// #ifdef APP-PLUS
		data.isT=true
		resolve(data)
		return
		// #endif
		if(datas.openid==""){
			data.isT=true
			resolve(data)
			return
		}
		vk.callFunction({
			url: 'client/api/pub/check',
			title: '请求中...',
			data: {
				...datas
			},
			success: (res) => {
				switch (res.msgSecCheckRes.result.label) {
					case 100:
						data.isT = true;
						break;
					case 10001:
						data.msg = "广告";
						break;
					case 20001:
						data.msg = "时政";
						break;
					case 20002:
						data.msg = "色情";
						break;
					case 20003:
						data.msg = "辱骂";
						break;
					case 20006:
						data.msg = "违法犯罪";
						break;
					case 20008:
						data.msg = "欺诈";
						break;
					case 20012:
						data.msg = "低俗";
						break;
					case 20013:
						data.msg = "版权";
						break;
					case 21000:
						data.msg = "其他";
						break;
					default:
						data.msg = "";
						break;
				}
				resolve(data)
			}
		})
	})
}