<template>
	<view class="page-body">
		<el-button type="success" size="small" icon="el-icon-circle-plus-outline" @click="addBtn">添加</el-button>
		<!-- 弹窗开始 -->
		<vk-data-dialog v-model="taxForm.props.show" title="表单标题" width="600px" mode="form">
			<vk-data-form ref="taxForm" v-model="taxForm.data" :rules="taxForm.props.rules"
				:action="taxForm.props.action" :form-type="taxForm.props.formType" :columns='taxForm.props.columns'
				:loading.sync="taxForm.props.loading" :label-width="100" width="100%" label-position="left"
				size="medium" :disabled="false" @success="formSuccess" @cancel="onCancel"></vk-data-form>
		</vk-data-dialog>
		<!-- 弹窗结束 -->
		
		<vk-data-table 
		    :data="taxTable.data" 
			:columns="taxTable.columns"
			:action="taxTable.action"
			:right-btns="['detail_auto','update','delete']"
			@success="tableSc"
			@update="tableUp"
			@delete="tableDel"
			ref="table"
		></vk-data-table>
	</view>
</template>
<script>
	var that; // 当前页面对象
	var vk = uni.vk; // vk实例
	export default {
		data() {
			return {
				// 表单相关开始-----------------------------------------------------------
				taxForm: {
					// 表单请求数据，此处可以设置默认值
					data: {
						"sort": 0,
						"status": true
					},
					// 表单属性   
					props: {
						// 表单提交地址
						action: '',
						// 表单字段显示规则
						columns: [{
							"key": "name",
							"title": "分类名称",
							"type": "text",
							"placeholder": "请输入首页展示的分类名称",
							"clearable": true,
							"showLabel": true
						}, {
							"key": "taxonomy_id",
							"title": "选择分类",
							"type": "remote-select",
							"placeholder": "请选择选择分类",
							"action": "admin/index/sys/index_taxonomy.getTax",
							"clearable": true,
							"showLabel": true,
							"showAll": true,
							"props": { list: "result", value: "_id", label: "name" },
						}, {
							"key": "sort",
							"title": "排序",
							"type": "text",
							"placeholder": "请输入排序",
							"clearable": true,
							"showLabel": true,
							"prepend": "值越大越靠前"
						}, {
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
								"message": "分类名称不能为空",
								"trigger": "change"
							}],
							"taxonomy_id": [{
								"required": true,
								"message": "选择分类不能为空",
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
				taxTable:{
					data:[],
					columns:[
						{key:"name" , title:"显示名字" , type:"text" , minWidth:200},
						{key:"taxonomyName.name" , title:"绑定分类" , type:"text" , minWidth:200},
						{key:"sort" , title:"排序" , type:"text" , minWidth:200},
						{key:"status" , title:"是否启用" , type:"switch" , minWidth:200},
					],
					action:"admin/index/sys/index_taxonomy.getList"
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
			formSuccess() {
				console.log("表单提交了");
				this.taxForm.props.show=false
				this.refresh()
			},
			onCancel() {
				console.log("关闭了");
				this.taxForm.props.show=false
				this.taxForm.data={
					"sort": 0,
					"status": true
				}
			},
			addBtn(){
				this.taxForm.props.show=true
				this.taxForm.props.action="admin/index/sys/index_taxonomy.addList"
			},
			tableSc(e){
				this.taxTable.data=e.data.result
				console.log(e)
			},
			tableUp(e){
				//点击表格的编辑
				this.taxForm.data=e.item
				delete this.taxForm.data.taxonomyName
				delete this.taxForm.data.pl_table_level
				this.taxForm.props.show=true
				this.taxForm.props.action="admin/index/sys/index_taxonomy.upList"
			},
			tableDel({item,deleteFn}){
				console.log(item._id)
				// 点击表格的删除
				deleteFn({
					action:"admin/index/sys/index_taxonomy.delList",
					data:{
						id:item._id
					}
				})
				this.refresh()
			},
			refresh(){
				this.$refs.table.refresh();
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
</style>