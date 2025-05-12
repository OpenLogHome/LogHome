<template>
	<view class="comments">
		<vk-data-table 
		    :data="cmtTable.data" 
			:columns="cmtTable.columns"
			@success="tabSc"
			@delete="tabDel"
			:action="cmtTable.action"
			pagination
			:right-btns="['detail_auto','delete']"
			ref="table"
		>
		</vk-data-table>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cmtTable:{
				    // 表格数据
				    data:[],
				    // 表格字段显示规则
					columns:[
						{key:"userinfo",title:"评论用户信息",type:"object",minWidth:200,
						  columns:[
							  { key: "_id", title: "ID", type: "text" },
							  { key: "username", title: "账号", type: "text" },
							  { key: "avatar", title: "头像", type: "avatar" }
						  ]
						 },
						{ key:"level" , title:"评论层级" , type:"radio" , minWidth:200,
	                      data:[
	                        { value:1, label:"二级评论" },
	                        { value:0, label:"一级评论" }
	                       ]					
						},
						{ key:"content" , title:"评论内容" , type:"text" , minWidth:200},
						{ key:"artinfo.title" , title:"评论帖子" , type:"text" , minWidth:200},
						{ key:"_add_time_str" , title:"发布时间" , type:"text" , minWidth:200}
				    ],
					action:"admin/comments/sys/getList"
				}
			}
		},
		methods: {
			tabSc(e){
				this.cmtTable.data=e.data.result.rows
				console.log(e)
			},
			tabDel({item,deleteFn}){
				deleteFn({
					action:"admin/comments/sys/delList",
					data:{
						_id:item._id
					}
				})
				this.refresh()
			},
			refresh(){
				this.$refs.table.refresh();
			}
		}
	}
</script>

<style lang="scss">
      .comments{
		  
	  }
</style>
