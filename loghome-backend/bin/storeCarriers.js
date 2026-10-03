// 快递100公司编码；其他公司可手动填写名称并使用公共查件入口。
module.exports = [
	['shunfeng', '顺丰速运'],
	['zhongtong', '中通快递'],
	['yuantong', '圆通速递'],
	['yunda', '韵达快递'],
	['shentong', '申通快递'],
	['jtexpress', '极兔速递'],
	['jd', '京东物流'],
	['ems', 'EMS'],
	['youzhengguonei', '邮政快递包裹'],
	['debangkuaidi', '德邦快递'],
	['debangwuliu', '德邦物流'],
	['huitongkuaidi', '百世快递'],
	['danniao', '菜鸟速递'],
	['kuayue', '跨越速运'],
	['annengwuliu', '安能快运'],
].map(([code, name]) => ({ code, name }));
