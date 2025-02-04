<template>
	<view class="outer">
		<view class="tags">
			<div class="tag" v-for="(item,index) in tags" :key="item.tag_id" :class="{'activity':item.is_activity_tag, 'suggested': item.is_suggested}">
				{{item.tag_name}}
				<img src="../../static/icons/icon_r_x.png" alt="" class="deletePoint"
				@click="deleteTag(item.tag_id)" />
			</div>
			<div class="tag add" @click="addCustomTag" v-show="tags.length < 8">
				+
			</div>
		</view>
		<view class="title_bar">官方标签</view>
		<view class="suggested_tags">
			<view class="tag" v-for="tag in suggested_tags" :key="tag.tag_id" :class="{'activity': tag.is_activity_tag, 'suggested': tag.is_suggested, 'chosen': tag.is_chosen}" @click="dealWithSuggested(tag.tag_id, tag.tag_name, tag.is_chosen)">
				{{tag.tag_name}}
			</view>
		</view>
		<view class="addTag">
			
		</view>
	</view>
</template>

<script>
	import axios from "axios"
	export default{
		data(){
			return{
				novel_id: -1,
				tags: [],
				suggested_tags: []
			}
		},
		methods:{
			getNovelTags(){
				let _this = this;
				axios.get(_this.$baseUrl + '/library/get_novel_tags?novel_id=' + this.novel_id, {}).then((res) => {
					_this.tags = res.data;
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){})
			},
			getSuggestedTags(){
				let _this = this;
				axios.get(_this.$baseUrl + '/library/get_suggested_tags?novel_id=' + this.novel_id, {}).then((res) => {
					_this.suggested_tags = res.data;
				}).catch(function (error) {
					uni.showToast({
						title: error.toString(),
						icon:'none',
						duration: 2000
					});
				}).then(function(){})
			},
			deleteTag(tag_id){
				let _this = this;
				let tk = JSON.parse(window.localStorage.getItem('token'));if(tk) tk = tk.tk;
				axios.get(_this.$baseUrl + '/library/delete_novel_tag?novel_id=' + this.novel_id + "&tag_id=" + tag_id,
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					uni.showToast({
						title: "删除成功",
						icon:'none',
						duration: 2000
					});
					_this.getNovelTags();
					_this.getSuggestedTags();
				}).catch(function (error) {
					uni.showToast({
						title: error.response.data.msg,
						icon:'none',
						duration: 2000
					});
				}).then(function(){
				})
			},
			addTag(tag){
				let _this = this;
				if(tag.replace(/(^\s*)|(\s*$)/g, "") == "" || tag.replace(/(^\s*)|(\s*$)/g, "") == "") return;
				var reg = new RegExp( '[ \n]' , "g" )
				let tag_name = tag.replace(reg, "");
				let tk = JSON.parse(window.localStorage.getItem('token'));
				if(tk) tk = tk.tk;
				axios.get(_this.$baseUrl + '/library/add_novel_tag?novel_id=' + _this.novel_id + "&tag_name=" + tag_name,
				{
					headers: {
						'Content-Type': 'application/json', //设置请求头请求格式为JSON
						'Authorization': 'Bearer ' + tk //设置token 其中K名要和后端协调好
					}
				}).then((res) => {
					uni.showToast({
						title: "添加成功",
						icon:'none',
						duration: 2000
					});
					_this.getNovelTags();
					_this.getSuggestedTags();
				}).catch(function (error) {
					uni.showToast({
						title: error.response.data.msg,
						icon:'none',
						duration: 2000
					});
				}).then(function(){})
			},
			addCustomTag(){
				let _this = this;
				uni.showModal({
				    title: '添加标签',
				    content: '',
					editable:true,
					placeholderText:"请输入标签",
				    success: function (res) {
				        if (res.confirm) {
							_this.addTag(res.content)
						}
						else if (res.cancel) {
				        }
				    }
				});
			},
			dealWithSuggested(id, name, chosen){
				if(chosen===true) this.deleteTag(id);
				else if(chosen===false&&this.tags.length<8) this.addTag(name);
				else if(this.tags.length>=8) uni.showToast(
					{
						title: "最多只能使用8个标签",
						icon:'none',
						duration: 2000,
					}
				)
			}
		},
		onLoad(params){
			if(params.id != undefined){
				this.novel_id = params.id;
				this.getNovelTags();
				this.getSuggestedTags();
			} else {
				uni.showToast({
					title: "出错",
					icon:'none',
					duration: 2000
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.title_bar{
		padding: 8px 30rpx;
		font-size: 40rpx;
		font-weight: bold;
		background-color: #f2f2f2;
		margin: 25rpx auto;
		color: #934900;
	}
	.tags{
		display:flex;
		flex-wrap: wrap;
		height:auto;
		min-height:100rpx;
		margin:30rpx;
		.tag{
			background-color: #eeeeee;
			font-size: 35rpx;
			color:#666666;
			height:70rpx;
			line-height: 70rpx;
			padding:0 30rpx;
			border-radius: 10rpx;
			margin-right: 30rpx;
			margin-bottom: 30rpx;
			display:flex;
		}
		.tag.activity{
			color:#ec8600;
			background-color: #ffcfa5;
		}
		.tag.add{
			background-color: #eeeeee;
			border:4rpx dashed #787878;
			box-sizing: border-box;
		}
		.tag.suggested{
			border: solid 1px #ec8600;
			color: #ec8600;
		}
		.deletePoint{
			margin-left: 10rpx;
			padding-top:20rpx;
			width:30rpx;
			height:30rpx;
		}
	}
	.suggested_tags{
		display:flex;
		flex-wrap: wrap;
		height:auto;
		min-height:100rpx;
		margin:30rpx;
		.tag{
			background-color: #eeeeee;
			font-size: 35rpx;
			color:#666666;
			height:70rpx;
			line-height: 70rpx;
			padding:0 30rpx;
			border-radius: 10rpx;
			margin-right: 30rpx;
			margin-bottom: 30rpx;
			display:flex;
		}
		.tag.activity{
			color:#ec8600;
			background-color: #ffcfa5;
		}
		.tag.chosen{
			border: solid 1px #ec8600;
			color: #ec8600;
		}
	}
	.outer{
		background-color: #ffffff;
	}
</style>
