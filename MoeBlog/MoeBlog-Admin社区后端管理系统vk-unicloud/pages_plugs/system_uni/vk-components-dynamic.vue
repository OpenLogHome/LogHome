<template>
	<view class="page-body">
		<!-- 页面内容开始 -->
		<!-- 表格搜索组件开始 -->
		<vk-data-table-query
			v-model="queryForm1.formData"
			:columns="queryForm1.columns"
			@search="search"
		>
			<template slot="right-btns">
				<el-button type="success" icon="el-icon-circle-plus-outline" @click="addBtn">
					添加
				</el-button>
			</template>
		</vk-data-table-query>
		<!-- 表格搜索组件结束 -->

		<!-- 表格组件开始 -->
		<vk-data-table
			ref="table1"
			:action="table1.action"
			:columns="table1.columns"
			:query-form-param="queryForm1"
			:right-btns="['detail_auto', 'update', 'delete']"
			:row-no="true"
			:pagination="true"
			@update="updateBtn"
			@delete="deleteBtn"
			@current-change="currentChange"
			@selection-change="selectionChange"
		>
			<!-- 排序值 -->
			<template v-slot:sort="{ row, column, index }">
				<el-input v-model="row.sort" size="mini" @change="sortChange($event, row)"/>
			</template>
		</vk-data-table>
		<!-- 表格组件结束 -->

		<!-- 添加或编辑的弹窗开始 -->
		<vk-data-dialog
			v-model="form1.props.show"
			:title="form1.props.title"
			width="800px"
			mode="form"
		>
			<vk-data-form
				ref="form1"
				v-model="form1.data"
				:rules="form1.props.rules"
				:action="form1.props.action"
				:form-type="form1.props.formType"
				:columns='form1.props.columns'
				label-width="100px"
				@success="form1.props.show = false;refresh();"
			></vk-data-form>
		</vk-data-dialog>
		<!-- 添加或编辑的弹窗结束 -->

		<!-- 页面内容结束 -->
	</view>
</template>

<script>
var that;													// 当前页面对象
var vk = uni.vk;									// vk实例
var originalForms = {}; 					// 表单初始化数据

var typeData = [
	{ value: "image", label: "图片" },
	{ value: "swiper", label: "图片轮播" },
	{ value: "grid-btn", label: "宫格按钮" },
	{ value: "notice", label: "通知" },
	{ value: "text", label: "文本" },
	{ value: "rich-text", label: "富文本" },
	{ value: "button", label: "按钮" },
	{ value: "custom", label: "自定义" }
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
				action: "admin/system_uni/components-dynamic/sys/getList",
				// 表格字段显示规则
				columns: [
					{ key: "sort", title: "排序值", type: "number", width: 100, sortable: "custom" },
					{ key: "data_id", title: "组件数据id", type: "text", width: 200 },
					{ key: "title", title: "数据标题", type: "text", width: 200 },
					{ key: "description", title: "数据描述", type: "textarea" },
					{ key: "data", title: "组件数据", type: "json", width: 200 },
					{
					  key: "show", title: "是否显示", type: "switch",
					  activeValue: true,
					  inactiveValue: false,
					  width: 80,
					  watch: (res) => {
					    let { value, row, change } = res;
					    vk.callFunction({
					      url: "admin/system_uni/components-dynamic/sys/update",
					      title: "请求中...",
					      data: {
					        _id: row._id,
					        show: value
					      },
					      success: data => {
					        change(value); // 这一步是让表格行内的开关改变显示状态
					      }
					    });
					  }
					},
					{
						key: "type", title: "type", type: "select", width: 120,
						data: typeData
					},
					{ key: "name", title: "name", type: "text", width: 120 },
					{ key: "_add_time", title: "添加时间", type: "time", width: 200 },
					{ key: "_add_time", title: "距离现在", type: "dateDiff", width: 120 }
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
					{ key: "data_id", title: "组件数据ID", type: "text", width: 180, mode: "%%" },
					{ key: "title", title: "数据标题", type: "text", width: 180, mode: "%%" },
					{
						key: "type", title: "type", type: "select", width: 160, mode: "=",
						data: [
							{ value: "", label: "全部" },
							...typeData
						]
					},
					{ key: "name", title: "name", type: "text", width: 160, mode: "%%" },
					{ key: "_add_time", title: "添加时间", type: "datetimerange", width: 380, mode: "[]" }
				]
			},
			form1: {
				// 表单请求数据，此处可以设置默认值
				data: {
					sort: 0,
					show: true
				},
				// 表单属性
				props: {
					// 表单请求地址
					action: "",
					// 表单字段显示规则
					columns: [
						{ key:"", title:"基础", type:"bar-title" },
						{ key: "data_id", title: "组件数据id", type: "text", show: ["add"] },
						{ key: "title", title: "数据标题", type: "text" },
						{ key: "data", title: "组件数据", type: "json" },
						{ key: "description", title: "数据描述", type: "textarea" },
						{ key:"", title:"扩展", type:"bar-title" },
						{ key: "sort", title: "排序值", type: "number" },
						{ key: "show", title: "是否显示", type: "switch", activeValue: true, inactiveValue: false },
						{
							key: "type", title: "type", type: "select",
							data: typeData
						},
						{ key: "name", title: "name", type: "text", tips:"同一页面可以设置相同的name" },
					],
					// 表单验证规则
					rules: {
						title: [{ required: true, message: "数据标题不能为空", trigger: "blur" }],
						data_id: [{ required: true, message: "组件数据id不能为空", trigger: "change" }]
					},
					// add 代表添加 update 代表修改
					formType: "",
					// 是否显示表单的弹窗
					show: false
				}
			},
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
		// 显示添加页面
		addBtn() {
			that.resetForm();
			that.form1.props.action = "admin/system_uni/components-dynamic/sys/add";
			that.form1.props.formType = "add";
			that.form1.props.title = "添加";
			that.form1.props.show = true;
		},
		// 显示修改页面
		updateBtn({ item }) {
			that.form1.props.action = "admin/system_uni/components-dynamic/sys/update";
			that.form1.props.formType = "update";
			that.form1.props.title = "编辑";
			that.form1.props.show = true;
			that.form1.data = item;
		},
		// 删除按钮
		deleteBtn({ item, deleteFn }) {
			deleteFn({
				action: "admin/system_uni/components-dynamic/sys/delete",
				data: {
					_id: item._id
				}
			});
		},
		// 修改排序值
		sortChange(sort, item){
			vk.callFunction({
				url: 'admin/system_uni/components-dynamic/sys/update',
				data: {
					_id: item._id,
					sort: Number(sort)
				},
				success: (data) => {

				}
			});
		},
	},
	watch: {

	},
	// 计算属性
	computed: {

	}
};
</script>
<style lang="scss" scoped>

</style>
