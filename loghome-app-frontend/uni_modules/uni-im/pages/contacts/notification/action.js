const db = uniCloud.database();
export default async function({
	subType,
	confirm,
	cancel,
	item
},callback) {
	console.log({
		subType,
		confirm,
		cancel,
		item
	})
	switch (subType) {
		case 'uni-im-friend-invite':
			uni.showLoading({
				mask:false
			})
			return db.collection("uni-im-friend-invite")
					.doc(item.payload.data._id)
					.update({
						state:confirm?100:-100
					})
					.then((res) => {
						uni.hideLoading()
						callback()
					}).catch((err) => {
						console.log(err);
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					})
			break;
		case 'uni-im-group-join-request':
			uni.showLoading({
				mask:false
			})
			let res = await db.collection('uni-im-group-join')
							.where({
								_id:item.payload.data.doc_id
							})
							.update({
								state:confirm?100:-100
							})
							.then((res) => {
								uni.hideLoading()
								callback()
							}).catch((err) => {
								console.log(err);
								uni.showModal({
									content: err.message || '请求服务失败',
									showCancel: false
								})
							})
			break;
		default:
			console.log({subType})
			break;
	}
}
