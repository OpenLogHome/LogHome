'use strict';
module.exports = {
	/**
	 * 重新执行回调通知
	 * @url admin/system_uni/pay-orders/sys/afreshNotice 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			_id, // 订单id
		} = data;

		let dbName = "vk-pay-orders";

		// 获取异步回调配置
		let spaceId = originalParam.context.SPACEINFO.spaceId; // 服务空间ID
		let currentNotifyUrl = getNotifyUrl(config, spaceId);
		if (!currentNotifyUrl || currentNotifyUrl.indexOf("http") !== 0) {
			return { code: -1, msg: "请先配置正确的异步回调URL，参考配置文档：https://vkdoc.fsq.pub/vk-uni-pay/config.html" }
		}

		// 获取订单信息
		let orderInfo = await vk.baseDao.findById({
			dbName,
			id: _id
		});
		if (vk.pubfn.isNull(orderInfo)) return { code: -1, msg: "订单不存在" };
		if (orderInfo.status !== 1) return { code: -1, msg: "订单状态错误" };
		if (orderInfo.user_order_success) return { code: -1, msg: "无需重新通知" };

		// 先将订单的状态改为未支付（重新回调需要）
		let updateNum = await vk.baseDao.update({
			dbName,
			whereJson: {
				_id,
				status: 1
			},
			dataJson: {
				status: 0,
				user_order_success: _.remove()
			}
		});

		if (!updateNum) {
			return { code: -1, msg: "订单状态错误" };
		}

		let { original_data, out_trade_no } = orderInfo;
		try {
			// 执行回调
			let requestRes = await vk.request({
				url: `${currentNotifyUrl}${original_data.path}`,
				method: "POST",
				dataType: "text",
				header: original_data.headers,
				content: original_data.body
			});
		} catch (err) {}
		// 再次获取订单信息，判断是否回调成功
		let payOrderInfo = await vk.baseDao.findById({
			dbName,
			id: _id
		});
		if (payOrderInfo.status === 1) {
			// 等待回调全部执行完成，最大等待20秒
			let await_max_time = 20;
			if (typeof payOrderInfo.user_order_success == "undefined") {
				let whileTime = 0; // 当前循环已执行的时间（毫秒）
				let whileInterval = 1000; // 每次循环间隔时间（毫秒）
				let maxTime = await_max_time * 1000; // 循环执行时间超过此值则退出循环（毫秒）
				while (typeof payOrderInfo.user_order_success == "undefined" && whileTime <= maxTime) {
					await vk.pubfn.sleep(whileInterval);
					whileTime += whileInterval;
					// 查询最新的订单信息
					payOrderInfo = await vk.baseDao.findById({
						dbName,
						id: _id
					});
				}
			}
		}
		// 还原部分信息（如支付时间不可被重新回调修改）
		await vk.baseDao.updateById({
			dbName,
			id: _id,
			dataJson: {
				status: orderInfo.status,
				pay_date: orderInfo.pay_date,
				original_data: orderInfo.original_data,
			}
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
// 获取异步回调配置
function getNotifyUrl(config, spaceId) {
	const payConifg = config["uni-pay"];
	const { notifyUrl } = payConifg;
	let currentNotifyUrl = notifyUrl[spaceId]; // 异步回调地址
	// 兼容正式版阿里云与公测版阿里云spaceId开始-----------------------------------------------------------
	if (!currentNotifyUrl) {
		if (spaceId.indexOf("mp-") === 0) {
			currentNotifyUrl = notifyUrl[spaceId.substring(3)];
		} else {
			currentNotifyUrl = notifyUrl[`mp-${spaceId}`];
		}
	}
	// 兼容正式版阿里云与公测版阿里云spaceId结束-----------------------------------------------------------
	return currentNotifyUrl;
}