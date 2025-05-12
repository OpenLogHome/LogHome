<template>
	<view class="page-body">
		<el-button type="success" size="small" icon="el-icon-circle-plus-outline" @click="addBtn">添加</el-button>
		<!-- 弹窗开始 -->
		<vk-data-dialog v-model="TaxonomyForm.props.show" title="添加圈子信息" width="600px" mode="form">
			<vk-data-form ref="TaxonomyForm" v-model="TaxonomyForm.data" :rules="TaxonomyForm.props.rules"
				:action="TaxonomyForm.props.action" :form-type="TaxonomyForm.props.formType"
				:columns='TaxonomyForm.props.columns' :loading.sync="TaxonomyForm.props.loading" :label-width="100"
				width="100%" label-position="left" size="medium" :disabled="false" @success="formSc"
				@cancel="formCa"></vk-data-form>
		</vk-data-dialog>
		<!-- 弹窗结束 -->

		<vk-data-table 
		    :data="TaxonomyTable.data" 
			:columns="TaxonomyTable.columns"
			:right-btns="['detail_auto','update','delete']"
			:action="TaxonomyTable.action"
			@success="tableSc"
			@delete="tableDel"
			@update="tableUp"
			pagination 
			ref="table"></vk-data-table>

	</view>
</template>
<script>
	var that; // 当前页面对象
	var vk = uni.vk; // vk实例
	export default {
		data() {
			return {
				// 表单相关开始-----------------------------------------------------------
				TaxonomyForm: {
					// 表单请求数据，此处可以设置默认值
					data: {
						"name": "",
						"status": true,
						"parent_id": "",
						"sort": 0,
					},
					// 表单属性   
					props: {
						// 表单提交地址
						action: '',
						// 表单字段显示规则
						columns: [{
								"key": "name",
								"title": "圈子名称",
								"type": "text",
								"placeholder": "请输入一级圈子名称",
								"clearable": true,
								"showLabel": true
							},
							{
								"key": "sort",
								"title": "圈子排序",
								"type": "text",
								"placeholder": "请输入圈子排序 数值越大越靠前显示",
								"clearable": true,
								"showLabel": true
							}, {
								"key": "status",
								"title": "是否启用",
								"type": "switch",
								"showLabel": true,
								"activeValue": true
							}
						],
						// 表单验证规则
						rules: {
							"name": [{
								"required": true,
								"message": "圈子名称不能为空",
								"trigger": "change"
							}]
						},
						// 自定义表单类型，如：add 代表添加 update 代表修改，可以为空
						formType: "",
						// 是否显示表单的弹窗
						show: false,
						// 表单是否在请求中
						loading: false
					},
				},
				TaxonomyTable: {
					// 表格数据
					data: [],
					// 表格字段显示规则
					columns: [
						{ 
						    key: "userinfo", title: "创建人信息", type: "object", minWidth: 200, align:"left",
						      columns:[
						        { key: "_id", title: "ID", type: "text" },
						        { key: "avatar", title: "头像", type: "avatar" },
						        { key: "nickname", title: "昵称", type: "text" },
						    ],
						},
						{
							key: "name",
							title: "圈子名称",
							type: "text",
							minWidth: 200
						},
						{
							key: "status",
							title: "圈子状态",
							type: "switch",
							minWidth: 200
						},
						{
							key:"_add_time",
							title:"发布时间",
							type:"time", width:160, 
							sortable:"custom"
						},
					],
					action:"admin/taxonomy/sys/getList"
				}
			}
		},
		// 监听-页面每次【加载时】执行(如:前进)
		onLoad(options = {}) {
			that = this;
			vk = that.vk;
			that.options = options;
			that.init(options);
		},
		created() {},
		mounted() {},
		methods: {
			// 页面数据初始化函数
			init(options) {},
			formSc() {
				this.refresh()
			},
			formCa() {
				console.log("关闭了");
			},
			addBtn() {
				this.TaxonomyForm.props.show = true
				this.TaxonomyForm.props.action="admin/taxonomy/sys/addList"
				this.TaxonomyForm.data={
						"name": "",
						"status": true,
						"parent_id": "",
						"sort": 0
				}
				this.TaxonomyForm.props.formType="add"
			},
			tableSc(e){
				this.TaxonomyTable.data=e.data.result.rows
			},
			refresh(){
				this.$refs.table.refresh();
			},
			tableUp(e){
				this.TaxonomyForm.props.show=true
				this.TaxonomyForm.props.formType="update"
				this.TaxonomyForm.props.action="admin/taxonomy/sys/upList"
				this.TaxonomyForm.data=e.item
			},
			tableDel({item,deleteFn}){
				//右侧删除事件 删除当前表单数据源 物理删除
				deleteFn({
					action:"admin/taxonomy/sys/delList",
					data:{
						_id:item._id
					}
				})
				this.refresh()
			}
		},
		// 监听器
		watch: {},
		// 过滤器
		filters: {},
		// 计算属性
		computed: {},
	}
</script>
<style lang="scss" scoped>
	.el-upload__tip {
		line-height: 1.2;
	}
</style>