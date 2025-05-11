<template>
	<view class="page-body">
		<el-button class="btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="addBtn">添加</el-button>
		<vk-data-table-query
		  v-model="queryForm.formData"
		  :columns="queryForm.columns"
		  @search="search"
		></vk-data-table-query>
		<!-- 弹窗开始 -->
		<vk-data-dialog v-model="TaxonomyForm.props.show" title="添加二级分类" width="600px" mode="form">
			<vk-data-form ref="TaxonomyForm" v-model="TaxonomyForm.data" :rules="TaxonomyForm.props.rules"
				:action="TaxonomyForm.props.action" :form-type="TaxonomyForm.props.formType"
				:columns='TaxonomyForm.props.columns' :loading.sync="TaxonomyForm.props.loading" :label-width="100" width="100%"
				label-position="left" size="medium" :disabled="false" @success="formSc" @cancel="formCa"></vk-data-form>
		</vk-data-dialog>
		<!-- 弹窗结束 -->
		<vk-data-table
		    :data="TaxonomyTable.data" 
			:columns="TaxonomyTable.columns"
			:right-btns="['detail_auto','update','delete']"
			:query-form-param="queryForm"
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
			queryForm:{
				formData:{},
				columns:[
				    { 
						key:"Audit", title:"审核情况", type:"select", width:150, mode:"=",placeholder:"请选择审核情况",
						data:[
						    { value:0, label:"已审核" },
						    { value:1, label:"审核中" },
							{ value:2, label:"退回审核" },
						]
					},
				],
			},
			TaxonomyForm: {
				// 表单请求数据，此处可以设置默认值
				data: {
					"artCount": 0,
					"name": "",
					"parent_id": "",
					"avatarUrl": null,
					"backgroundUrl": null,
					"sort": 0,
					"status": true,
					"is_sticky":false
				},
				// 表单属性   
				props: {
					// 表单提交地址
					action: 'admin/taxonomy/sys/Action.addList',
					// 表单字段显示规则
					columns: [{
						"key": "name",
						"title": "圈子名称",
						"type": "text",
						"placeholder": "请输入二级圈子名称",
						"clearable": true,
						"showLabel": true
					}, {
						"key": "description",
						"title": "圈子描述",
						"type": "text",
						"placeholder": "请输入圈子描述",
						"clearable": true,
						"showLabel": true
					}, {
						"key": "parent_id",
						"title": "一级分类",
						"type": "remote-select",
						"placeholder": "请选择一级分类",
						"showAll": true,
						"multipleLimit": "1",
						"action": "admin/taxonomy/sys/Action.getTaxList",
						"props": { list: "result", value: "_id", label: "name" },
						 dataPreprocess: (list) => {
							return list;
						  }
					}, {
						"key": "avatarUrl",
						"title": "圈子头像",
						"type": "file-select",
						"showLabel": true,
						"limit": 1,
						"multiple": false,
						"listType": "picture",
						"fileSize": 5,
						"sizeUnit": "MB"
					}, 
					{
						"key":"Audit",
						"title":"是否审核",
						"type":"select",
						 "data":[
						        { value:0, label:"已审核" },
						        { value:1, label:"审核中" },
								{ value:2, label:"退回审核" }
						    ],
						"showLabel": true,
						"activeValue": true
					},
					{
						"key": "backgroundUrl",
						"title": "圈子背景",
						"type": "file-select",
						"showLabel": true,
						"limit": 1,
						"multiple": false,
						"listType": "picture",
						"fileSize": 5,
						"sizeUnit": "MB"
					}, {
						"key": "sort",
						"title": "圈子排序",
						"type": "text",
						"placeholder": "请输入圈子排序 数值越大越靠前显示",
						"clearable": true,
						"showLabel": true
					},
					{
						"key": "artCount",
						"title": "文章篇数",
						"type": "text",
						"placeholder": "0",
						"disabled": true,
						"showLabel": true,
						"readonly": true
					},
					{
						"key": "is_sticky",
						"title": "推荐圈子",
						"type": "switch",
						"placeholder": "推荐圈子",
						"clearable": true,
						"showLabel": true
					},
					{
						"key": "status",
						"title": "是否启用",
						"type": "switch",
						"showLabel": true,
						"activeValue": true
					}],
					// 表单验证规则
					rules: {
						"name": [{
							"required": true,
							"message": "圈子名称不能为空",
							"trigger": "change"
						}],
						"description": [{
							"required": true,
							"message": "圈子描述不能为空",
							"trigger": "change"
						}],
						"parent_id": [{
							"required": true,
							"message": "一级分类不能为空",
							"trigger": "change"
						}],
						"avatarUrl": [{
							"required": true,
							"message": "圈子头像不能为空",
							"trigger": "change"
						}],
						"backgroundUrl": [{
							"required": true,
							"message": "圈子背景不能为空",
							"trigger": "change"
						}],
						"Audit": [{
							"required": true,
							"message": "是否为审核 0代表已审核 1代表审核中 2代表审核已退回",
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
					    key: "userinfo", title: "创建人", type: "object", minWidth: 100, align:"left",
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
						key:"Audit",
						title:"是否已审核",
						type:"tag",
						minWidth:200,
						defaultValue:0,
						data:[
						    { value:1, label:"审核中",tagType:"info"},
						    { value:2, label:"已退回",tagType:"danger" },
						    { value:0, label:"已审核",tagType:"success" },
						]
					},
					{
						key: "description",
						title: "圈子描述",
						type: "text",
						minWidth: 200
					},
					{
						key: "artCount",
						title: "文章总数",
						type: "text",
						minWidth: 200
					},
					{
						key: "fans_count",
						title: "粉丝总数",
						type: "text",
						minWidth: 200
					},
					{
						key: "parent.name",
						title: "圈子分类",
						type: "text",
						minWidth: 200
					},
					{
						key: "avatarUrl",
						title: "圈子头像",
						type: "image",
						minWidth: 200,
						shape:"circle"
					},
					{
						key: "backgroundUrl",
						title: "圈子背景",
						type: "image",
						minWidth: 200
					},
					{
						key: "name",
						title: "圈子名称",
						type: "text",
						minWidth: 200
					},
					{
						key: "is_sticky",
						title: "推荐圈子",
						type: "switch",
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
				action:"admin/taxonomy/sys/Action.getList"
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
			this.TaxonomyForm.data={
					"name": "",
					"status": true,
					"parent_id": "",
					"sort": 0,
					"parent_id":""
			}
			this.TaxonomyForm.props.action="admin/taxonomy/sys/Action.addList"
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
			this.TaxonomyForm.props.action="admin/taxonomy/sys/Action.upList"
			this.TaxonomyForm.data=e.item
			delete this.TaxonomyForm.data.parent
			delete this.TaxonomyForm.data.userinfo
			console.log(this.TaxonomyForm.data)
		},
		tableDel({item,deleteFn}){
			//右侧删除事件 删除当前表单数据源 物理删除
			deleteFn({
				action:"admin/taxonomy/sys/Action.delList",
				data:{
					_id:item._id
				}
			})
			this.refresh()
		},
		search(e){
			console.log(e)
			that.$refs.table.search()
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
.btn{
	margin-bottom: 50rpx;
}

</style>
