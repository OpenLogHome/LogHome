<template>
	<view class="page-body">
		<el-button style="margin: 50rpx 0;" type="success" size="small" icon="el-icon-circle-plus-outline" @click="addBtn">添加</el-button>
		
		<vk-data-table-query
		  v-model="query.formData"
		  :columns="query.columns"
		  @search="search"
		></vk-data-table-query>
		
		<el-dialog :visible.sync="ArtForm.props.show" width="60%">
			<vk-data-form ref="ArtForm" v-model="ArtForm.data" :rules="ArtForm.props.rules"
				:action="ArtForm.props.action" :form-type="ArtForm.props.formType" :columns='ArtForm.props.columns'
				:loading.sync="ArtForm.props.loading" :label-width="100" width="100%" label-position="left"
				size="medium" :disabled="false" @success="formSuccess" @cancel="onCancel">
			</vk-data-form>
		</el-dialog>

		<vk-data-table 
			:data="ArtTable.data" 
			:columns="ArtTable.columns"
			:right-btns="['detail_auto','update','delete']"
			:action="ArtTable.action"
			:query-form-param="query"
			get-count="auto"
			@success="tabSc"
			@update="tabUp"
			@delete="tabDel"
			pagination
			ref="ArtTable"
		>
		</vk-data-table>
	</view>
</template>
<script>
	var that; // 当前页面对象
	var vk = uni.vk; // vk实例
	export default {
		data() {
			return {
				// 表单相关开始-----------------------------------------------------------
				ArtForm: {
					// 表单请求数据，此处可以设置默认值
					data: {
						"coverImg": [],
						"Audit": 1,
						"art_status": true,
						"is_sticky": false
					},
					// 表单属性   
					props: {
						// 表单提交地址
						action: 'admin/art/sys/addList',
						// 表单字段显示规则
						columns: [{
							"key": "title",
							"title": "文章标题",
							"type": "text",
							"placeholder": "请输入单行文本文章标题",
							"clearable": true,
							"showLabel": true
						}, {
							"key": "taxonmoy_id",
							"title": "圈子分类",
							"type": "remote-select",
							"placeholder": "请选择圈子分类",
							"clearable": true,
							"showLabel": true,
							"action": "admin/art/sys/getTaxonomy",
							"props": {
								list: "result",
								value: "_id",
								label: "name"
							},
							"showAll": true
						}, {
							"key": "coverImg",
							"title": "文章图片",
							"type": "file-select",
							"showLabel": true,
							"limit": 9,
							"listType": "picture",
							"fileSize": 5,
							"sizeUnit": "MB",
							"multiple": true, 
							"multipleLimit": 12
						}, {
							"key": "content",
							"title": "文章内容",
							"type": "textarea",
							"placeholder": "请输入文章内容",
							"showLabel": true,
							"autosize": {
								"minRows": 4,
								"maxRows": 4
							}
						}, {
							"key": "Audit",
							"title": "是否审核",
							"type": "select",
							"placeholder": "请选择是否审核",
							"clearable": true,
							"showLabel": true,
							"data": [{
								"label": "已审核",
								"value": 0
							}, {
								"label": "审核中",
								"value": 1
							}, {
								"label": "已退回",
								"value": 2
							}]
						}, {
							"key": "art_status",
							"title": "文章状态",
							"type": "switch",
							"showLabel": true,
							"activeValue": true
						}, {
							"key": "is_sticky",
							"title": "是否置顶",
							"type": "switch",
							"showLabel": true,
							"activeValue": true
						}],
						// 表单验证规则
						rules: {
							"title": [{
								"required": true,
								"message": "文章标题不能为空",
								"trigger": "change"
							}],
							"taxonmoy_id": [{
								"required": true,
								"message": "圈子分类不能为空",
								"trigger": "change"
							}],
							"Audit": [{
								"required": true,
								"message": "是否审核不能为空",
								"trigger": "change"
							}],
							"art_status": [{
								"required": true,
								"message": "文章状态不能为空",
								"trigger": "change"
							}],
							"is_sticky": [{
								"required": true,
								"message": "是否置顶不能为空",
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
				ArtTable: {
					// 表格数据
					data: [],
					// 表格字段显示规则
					columns: [{
						key: "userinfo",
						title: "用户详情",
						type: "object",
						minWidth: 200,
						align:"center",
						columns:[
						    { key: "_id", title: "ID", type: "text" },
						    { key: "username", title: "账号", type: "text" },
							{ key: "avatar", title: "头像", type: "avatar" },
						]
					},
					{
						key: "title",
						title: "文章标题",
						type: "text",
						minWidth: 200
					},
					{
						key: "Audit",
						title: "是否审核",
						type: "tag",
						width: 200,
						data:[
							{ value:1, label:"审核中",tagType:"info"},
						    { value:2, label:"已退回",tagType:"danger" },
						    { value:0, label:"已审核",tagType:"success" },
						]
					},
					{
						key: "content",
						title: "文章内容",
						type: "text",
						width: 300
					},
					{
						key: "coverImg",
						title: "文章图片",
						type: "image",
						width: 200
					},
					{
						key: "category.name",
						title: "所属圈子",
						type: "text",
						width: 200
					},
					{
						key: "art_status",
						title: "是否显示",
						type: "switch",
						width: 200
					},
					{
						key: "is_sticky",
						title: "是否置顶",
						type: "switch",
						width: 200
					},
					{
						key: "view_count",
						title: "文章浏览",
						type: "text",
						width: 200
					},
					{
						key: "like_count",
						title: "用户点赞",
						type: "text",
						width: 200
					},
					{
						key: "comment_count",
						title: "文章评论",
						type: "text",
						width: 200
					},
					{
						key: "_add_time_str",
						title: "发布时间",
						type: "text",
						width: 200
					},
					],
					action:"admin/art/sys/getList"
				},
				query:{
					formData:{},
					columns:[
					    { key:"Audit", title:"是否审核", type:"select", width:160, mode:"=",
						    data:[
						        { value:0, label:"已通过" },
						        { value:1, label:"审核中" },
						        { value:2, label:"未通过" },
						    ]
						}
					]
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
				//提交表单
				console.log("表单提交了");
				this.ArtForm.props.show = false
				this.refresh()
			},
			onCancel() {
				//表单关闭
				this.ArtForm.props.show = false
				this.ArtForm.data={
					"coverImg": [],
					"Audit": 1,
					"art_status": true,
					"is_sticky": false
				}
				console.log("关闭了");
			},
			addBtn() {
				this.ArtForm.props.show = true
			},
			tabSc(e){
				this.ArtTable.data=e.data.result.rows
				console.log(e.data)
			},
			tabUp(e){
				this.ArtForm.props.show=true
				this.ArtForm.props.action="admin/art/sys/upList"
				this.ArtForm.data=e.item
				delete this.ArtForm.data.category
				delete this.ArtForm.data.userinfo
				console.log(this.ArtForm.data)
			},
			refresh(){
				this.$refs.ArtTable.refresh();
			},
			tabDel({item,deleteFn}){
				deleteFn({
					action:"admin/art/sys/delList",
					data:{
						_id:item._id
					}
				})
				this.refresh()
			},
			search(){
				this.$refs.ArtTable.search();
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