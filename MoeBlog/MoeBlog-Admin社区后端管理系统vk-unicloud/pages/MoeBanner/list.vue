<template>
	<view class="page-body">
		<el-button type="success" size="small" icon="el-icon-circle-plus-outline" @click="addBtn">添加</el-button>
		<!-- 弹窗开始 -->
		<vk-data-dialog v-model="bannerForms.props.show" title="" width="600px" mode="form">
			<vk-data-form ref="bannerForms" v-model="bannerForms.data" :rules="bannerForms.props.rules"
				:action="bannerForms.props.action" :form-type="bannerForms.props.formType" :columns='bannerForms.props.columns'
				:loading.sync="bannerForms.props.loading" :label-width="100" width="100%" label-position="left" size="medium"
				:disabled="false" @success="formSc" @cancel="formCa"></vk-data-form>
		</vk-data-dialog>
		<!-- 弹窗结束 -->
		
		<vk-data-table 
		ref="bannerTable"
		:data="bannerTable.data" 
		:columns="bannerTable.columns"
		 :right-btns="['detail_auto','update','delete']"
		 getCount="auto"
		 :action="bannerTable.action"
		 @success="tableSc"
		 @delete="tableDel"
		 @update="tableUp"
		 :pagination="true"
		  :default-sort="{ name:'_add_time', type:'desc' }"
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
			bannerForms: {
				// 表单请求数据，此处可以设置默认值
				data: {
					"bannerfile": null,
					"sort": "0",
					"status": true
				},
				// 表单属性   
				props: {
					// 表单提交地址
					action: '',
					// 表单字段显示规则
					columns: [{
						"key": "title",
						"title": "轮播图标题",
						"type": "text",
						"placeholder": "请输入轮播图标题",
						"clearable": true,
						"showLabel": true
					}, {
						"key": "open_url",
						"title": "跳转地址",
						"type": "text",
						"placeholder": "请输入跳转地址",
						"clearable": true,
						"showLabel": true
					}, {
						"key": "bannerfile",
						"title": "上传",
						"type": "file-select",
						"showLabel": true,
						"limit": 1,
						"listType": "picture-card",
						"fileSize": 5,
						"sizeUnit": "MB",
						"multiple":false
					}, {
						"key": "sort",
						"title": "轮播排序",
						"type": "text",
						"placeholder": "请输入轮播排序  数字越大越靠前 默认为0",
						"clearable": true,
						"showLabel": true
					}, {
						"key": "status",
						"title": "是否显示",
						"type": "switch",
						"showLabel": true,
						"activeValue": true
					}],
					// 表单验证规则
					rules: {
						"bannerfile": [{
							"required": true,
							"message": "上传不能为空",
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
			bannerTable:{
				data:[],
				columns:[{key:"title",title:"轮播图标题",type:"text",minWidth:"200"},
				        {key:"open_url",title:"跳转地址",type:"text",minWidth:"200"},
						{key:"bannerfile",title:"图片详情",type:"image",minWidth:"200",imageWidth:100},
						{key:"sort",title:"轮播排序",type:"text",minWidth:"200"},
						{key:"status",title:"是否启用",type:"switch",minWidth:"200"},
						{ key:"_add_time", title:"添加时间", type:"time", width:160, sortable:"custom"  },],
				action:"admin/banner/sys/getList"
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
		tableSc(e) {
			//表格请求的数据
			this.bannerTable.data=e.data.result.rows
		},
		formCa() {
			//取消表单
			console.log("关闭了");
		},
		addBtn(){
			//添加按钮 点击打开表单
			this.bannerForms.data={
				"bannerfile": null,
				"sort": "0",
				"status": true
			}
			this.bannerForms.props.show=true
			this.bannerForms.props.action="admin/banner/sys/addList"
			this.bannerForms.props.formType="add"
		},
		formSc(){
			//表单请求成功
			this.refresh()
		},
		refresh(){
			this.$refs.bannerTable.refresh();
		},
		tableDel({item,deleteFn}){
			//右侧删除事件 删除当前表单数据源 物理删除
			deleteFn({
				action:"admin/banner/sys/delList",
				data:{
					_id:item._id
				}
			})
			this.refresh()
		},
		tableUp(e){
			this.bannerForms.props.show=true
			this.bannerForms.props.action="admin/banner/sys/upList"
			this.bannerForms.props.formType="update"
			this.bannerForms.data=e.item
			
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
