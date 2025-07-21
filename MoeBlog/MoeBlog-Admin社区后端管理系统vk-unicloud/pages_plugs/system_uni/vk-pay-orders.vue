<template>
	<view class="page-body">
		<!-- 页面内容开始 -->

		<!-- 表格搜索组件开始 -->
		<vk-data-table-query
			v-model="queryForm1.formData"
			:columns="queryForm1.columns"
			:main-columns="['out_trade_no', 'transaction_id', 'type', 'status', '_add_time']"
			@search="search"
		></vk-data-table-query>
		<!-- 表格搜索组件结束 -->
		<!-- 表格组件开始 -->
		<vk-data-table
			ref="table1"
			:action="table1.action"
			:columns="table1.columns"
			:query-form-param="queryForm1"
			:right-btns="['detail_auto']"
			:row-no="false"
			:pagination="true"
			@current-change="currentChange"
			@selection-change="selectionChange"
		>
			<template v-slot:button1="{ row }">
				<view v-if="row.status <= 0">-</view>
				<el-tag type="success" effect="dark" v-else-if="row.user_order_success">成功</el-tag>
				<el-button type="danger" size="mini" v-else-if="row.status === 1" @click="afreshNotice(row)">重新推送</el-button>
				<view v-else-if="row.refund_fee>0">失败，但已退款</view>
				<view v-else>未知</view>
			</template>
		</vk-data-table>
		<!-- 表格组件结束 -->
		<!-- 页面内容结束 -->
	</view>
</template>

<script>
var that;													// 当前页面对象
var vk = uni.vk;									// vk实例
var originalForms = {}; 					// 表单初始化数据

const payTypeData = [
	{ label: "官方渠道 - 微信 - 小程序", value: "wxpay_mp-weixin", tagType: "success" },
	{ label: "官方渠道 - 微信 - APP", value: "wxpay_app-plus", tagType: "success" },
	{ label: "官方渠道 - 微信 - H5", value: "wxpay_h5", tagType: "success" },
	{ label: "官方渠道 - 微信 - MWEB", value: "wxpay_mweb", tagType: "success" },
	{ label: "官方渠道 - 微信 - 公众号", value: "wxpay_h5-weixin", tagType: "success" },
	{ label: "官方渠道 - 支付宝 - 小程序", value: "alipay_mp-alipay", tagType: "primary" },
	{ label: "官方渠道 - 支付宝 - APP", value: "alipay_app-plus", tagType: "primary" },
	{ label: "官方渠道 - 支付宝 - H5", value: "alipay_h5", tagType: "primary" },

	{ label: "VksPay - 微信 - 小程序", value: "vkspay_mp-weixin", tagType: "success" },
	{ label: "VksPay - 微信 - APP", value: "vkspay_app-plus", tagType: "success" },
	{ label: "VksPay - 微信 - H5", value: "vkspay_h5", tagType: "success" }, // 收银台接口 公众号、H5、MWEB、PC扫码均为H5
	{ label: "VksPay - 微信 - MWEB", value: "vkspay_mweb", tagType: "success" },
	{ label: "VksPay - 微信 - 公众号", value: "vkspay_h5-weixin", tagType: "success" },
	{ label: "VksPay - 支付宝 - 小程序", value: "vkspay_mp-alipay", tagType: "primary" },
	{ label: "VksPay - 支付宝 - APP", value: "vkspay_app-plus", tagType: "primary" },
	{ label: "VksPay - 支付宝 - H5", value: "vkspay_h5", tagType: "primary" },

];
const orderTypeData = [
	{ label: "商品订单", value: "goods"  },
	{ label: "充值订单", value: "recharge" },
	{ label: "VIP购买订单", value: "vip" },
	{ label: "其他订单", value: "other" }
];

const statusData = [
	{ label: "已关闭", value: -1, tagType: "info" },
	{ label: "未支付", value: 0, tagType: "info" },
	{ label: "已支付", value: 1, tagType: "success" },
	{ label: "已部分退款", value: 2, tagType: "warning" },
	{ label: "已全额退款", value: 3, tagType: "danger" },
];

export default {
	data() {
		// 页面数据变量
		return {
			// 页面是否请求中或努力加载中
			loading: false,
			// init请求返回的数据
			data: {},
			// 表格相关开始 -----------------------------------------------------------
			table1: {
				// 表格数据请求地址
				action: "admin/system_uni/pay-orders/sys/getList",
				// 表格字段显示规则
				columns: [
					{ key: "button1", title: "回调通知状态", type: "text", width: 120, fixed:"right" },
					{ key: "out_trade_no", title: "商户订单号", type: "text", width: 200 },
					{ key: "type", title: "订单类型", type: "select", width: 100,
						data: orderTypeData
					},
					{
						key: "pay_type", title: "支付类型", type: "tag", width: 180,
						data: payTypeData
					},
					{ key: "status", title: "订单状态", type: "tag", width: 110,
						data: statusData
					},
					{ key: "create_date", title: "创建时间", type: "time", width: 160 },
					{ key: "pay_date", title: "支付时间", type: "time", width: 160 },
					{ key: "total_fee", title: "总金额", type: "money", width: 110 },
					{ key: "refund_fee", title: "总退款金额", type: "money", width: 110, defaultValue:"-" },
					{ key: "refund_num", title: "退款次数", type: "number", width: 80, defaultValue:"-" },
					{ key: "transaction_id", title: "支付平台订单号", type: "text", width: 260, defaultValue:"-" },
					{ key: "openid", title: "用户openid", type: "text", width: 280, show: ["detail"] },
					{
						key: "refund_list", title: "退款详情", type: "table", width: 360, show: ["detail"],
						columns:[
							{ key: "out_refund_no", title: "退款单号", type: "text", minWidth: 200 },
							{ key: "refund_date", title: "退款时间", type: "time", width: 180 },
							{ key: "refund_fee", title: "退款金额", type: "money", width: 140 },
							{ key: "refund_desc", title: "退款备注", type: "text", minWidth: 180 },
						]
					},
					{ key: "original_data", title: "原始数据", type: "json", width: 300, show: ["detail"] },
					//{ key: "wxpay_info", title: "微信支付特有数据", type: "json", width: 360, show: ["detail"] },
					//{ key: "alipay_info", title: "支付宝支付特有数据", type: "json", width: 300, show: ["detail"] },
				],
				// 多选框选中的值
				multipleSelection: [],
				// 当前高亮的记录
				selectItem: ""
			},
			// 表格相关结束 -----------------------------------------------------------
			// 表单相关开始 -----------------------------------------------------------
			// 查询表单请求数据
			queryForm1: {
				// 查询表单数据源，可在此设置默认值
				formData: {},
				// 查询表单的字段规则 fieldName:指定数据库字段名,不填默认等于key
				columns: [
					{ key: "out_trade_no", title: "商户订单号", type: "text", width:150, mode: "%%", },
					{ key: "transaction_id", title: "支付平台订单号", type: "text", width:150, mode: "%%", },
					{
						key: "type", title: "订单类型", type: "select", width:150, mode: "=",
						data: orderTypeData
					},
					{ key: "status", title: "订单状态", type: "select", width: 150, mode: "=",
						data: statusData
					},
					{ key: "_add_time", title: "添加时间", type: "datetimerange", width:340, mode: "[]" },
					{
						key: "pay_type", title: "支付类型", type: "select", mode: "=",
						data: payTypeData
					},
					{ key: "total_fee_min", title: "金额范围", type: "money", mode: ">=", fieldName:"total_fee" },
					{ key: "total_fee_max", title: "-", type: "money", mode: "<=", fieldName:"total_fee" }
				]
			}
			// 表单相关结束 -----------------------------------------------------------
		};
	},
	// 监听 - 页面每次【加载时】执行(如：前进)
	onLoad(options = {}) {
		that = this;
		vk = that.vk;
		that.options = options;
		that.init(options);
	},
	// 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
	onReady() {},
	// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
	onShow() {},
	// 监听 - 页面每次【隐藏时】执行(如：返回)
	onHide() {},
	// 函数
	methods: {
		// 页面数据初始化函数
		init(options) {
			originalForms["form1"] = vk.pubfn.copyObject(that.form1);
		},
		// 页面跳转
		pageTo(path) {
			vk.navigateTo(path);
		},
		// 表单重置
		resetForm() {
			vk.pubfn.resetForm(originalForms, that);
		},
		// 搜索
		search(obj) {
			that.$refs.table1.query(obj);
		},
		// 刷新
		refresh() {
			that.$refs.table1.refresh();
		},
		// 获取当前选中的行的数据
		getCurrentRow() {
			return that.$refs.table1.getCurrentRow();
		},
		// 监听 - 行的选中高亮事件
		currentChange(val) {
			that.table1.selectItem = val;
		},
		// 当选择项发生变化时会触发该事件
		selectionChange(list) {
			that.table1.multipleSelection = list;
		},
		// 重新推送
		afreshNotice(row){
			vk.callFunction({
				url: 'admin/system_uni/pay-orders/sys/afreshNotice',
				title: '请求中...',
				data: {
					_id: row._id
				},
				success: (data) => {
					// 刷新数据
					that.refresh();
				}
			});
		}
	},
	watch: {},
	// 计算属性
	computed: {}
};
</script>
<style lang="scss" scoped>

</style>
